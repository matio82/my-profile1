// src/pages/ProductDetail.jsx
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  
  // ✅ Wishlist Context
  const { toggleWishlist, isInWishlist, loading: wishlistLoading } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // 🔥 State برای نظر جدید
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ""
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  // ✅ چک کردن وضعیت Wishlist
  const isWishlisted = product ? isInWishlist(product._id) : false;

  // ✅ تعریف توابع قبل از useEffect
  const fetchProduct = useCallback(async () => {
    try {
      const { data } = await axios.get(`/products/${id}`);
      setProduct(data.data || data);
      setLoading(false);
    } catch (err) {
      console.error("❌ خطا در دریافت محصول:", err);
      setError("محصول یافت نشد");
      setLoading(false);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    try {
      const { data } = await axios.get(`/reviews/product/${id}`);
      setReviews(data.data || []);
    } catch (err) {
      console.error("❌ خطا در دریافت نظرات:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [fetchProduct, fetchReviews]);

  // ═══════════════════════════════════════════════════════════════
  // ❤️ Toggle Wishlist
  // ═══════════════════════════════════════════════════════════════
  const handleWishlistToggle = async () => {
    if (!user) {
      alert("⚠️ لطفاً ابتدا وارد شوید");
      navigate("/login");
      return;
    }

    if (!product) return;

    const result = await toggleWishlist(product._id);
    if (!result.success) {
      alert("❌ خطا: " + (result.message || "مشکلی پیش آمد"));
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 🔖 ثبت نظر
  // ═══════════════════════════════════════════════════════════════
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("⚠️ لطفاً ابتدا وارد شوید");
      return;
    }

    if (!newReview.rating || !newReview.comment.trim()) {
      alert("⚠️ لطفاً امتیاز و نظر خود را وارد کنید");
      return;
    }

    try {
      setSubmittingReview(true);
      const token = localStorage.getItem("token");

      const payload = {
        product: id,
        rating: Number(newReview.rating),
        comment: newReview.comment.trim()
      };

      console.log("📤 ارسال نظر:", payload);

      await axios.post("/reviews", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ نظر شما با موفقیت ثبت شد");
      setNewReview({ rating: 5, comment: "" });
      fetchReviews();

    } catch (err) {
      console.error("❌ خطا در ثبت نظر:", err);
      alert("❌ خطا: " + (err.response?.data?.message || "مشکلی پیش آمد"));
    } finally {
      setSubmittingReview(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 🛒 افزودن به سبد خرید
  // ═══════════════════════════════════════════════════════════════
  const handleAddToCart = async () => {
    if (!user) {
      alert("⚠️ لطفاً ابتدا وارد شوید");
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(id, 1);

    if (result.success) {
      alert("✅ محصول به سبد خرید اضافه شد");
    } else {
      alert("❌ خطا: " + (result.message || "مشکلی پیش آمد"));
    }

    setAddingToCart(false);
  };

  // ═══════════════════════════════════════════════════════════════
  // 💰 محاسبه قیمت نهایی
  // ═══════════════════════════════════════════════════════════════
  const getFinalPrice = () => {
    if (product?.discountPrice && product.discountPrice < product.price) {
      return product.discountPrice;
    }
    return product?.price || 0;
  };

  const getDiscountPercent = () => {
    if (product?.discountPrice && product.discountPrice < product.price) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  };

  // ═══════════════════════════════════════════════════════════════
  // ⏳ Loading State
  // ═══════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-[60vh]"
      >
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <p className="text-2xl text-[#00eaff] font-bold">
            در حال بارگذاری...
          </p>
        </div>
      </motion.div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ❌ Error State
  // ═══════════════════════════════════════════════════════════════
  if (error || !product) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-10 bg-red-900/30 border-2 border-red-500 rounded-2xl p-8 max-w-2xl mx-auto"
      >
        <div className="text-5xl mb-4">❌</div>
        <p className="text-2xl text-red-400 font-bold">{error}</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
        >
          🔙 بازگشت به لیست محصولات
        </button>
      </motion.div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 🖼️ تصاویر محصول
  // ═══════════════════════════════════════════════════════════════
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : ["https://via.placeholder.com/600x400?text=تصویر+ندارد"];

  const hasDiscount = getDiscountPercent() > 0;

  // ═══════════════════════════════════════════════════════════════
  // 🎨 Main Render
  // ═══════════════════════════════════════════════════════════════
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
      dir="rtl"
    >
      {/* ══════════════════ محصول ══════════════════ */}
      <div className="bg-gradient-to-br from-[#102030] to-[#1a3a52] rounded-2xl p-8 border-2 border-[#00eaff]/20 mb-8 relative">
        
        {/* Badge تخفیف */}
        {hasDiscount && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl font-bold text-lg z-10 shadow-lg">
            {getDiscountPercent()}% تخفیف 🔥
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* ══════════════════ تصویر ══════════════════ */}
          <div className="space-y-4">
            {/* تصویر اصلی */}
            <div className="relative overflow-hidden rounded-2xl bg-[#0d1b2a]">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-[400px] object-contain rounded-2xl shadow-2xl"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x400?text=تصویر+ندارد";
                }}
              />

              {/* ✅ دکمه Wishlist روی تصویر */}
              <motion.button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                whileTap={{ scale: 0.85 }}
                className={`absolute top-4 left-4 w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300 shadow-lg z-20 ${
                  isWishlisted
                    ? "bg-red-500 text-white shadow-red-500/50"
                    : "bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/30"
                }`}
                title={isWishlisted ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
              >
                <motion.span
                  key={isWishlisted ? "filled" : "empty"}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {wishlistLoading ? "⏳" : isWishlisted ? "❤️" : "🤍"}
                </motion.span>
              </motion.button>
            </div>

            {/* گالری تصاویر کوچک */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((img, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-[#00eaff] shadow-[0_0_15px_rgba(0,234,255,0.5)]"
                        : "border-[#1e3a5f] hover:border-[#00eaff]/50"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80?text=...";
                      }}
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* ══════════════════ اطلاعات ══════════════════ */}
          <div className="flex flex-col justify-between">
            <div>
              {/* نام محصول */}
              <h1 className="text-3xl md:text-4xl font-bold text-[#00eaff] mb-4 leading-tight">
                {product.name}
              </h1>

              {/* دسته‌بندی */}
              {product.category && (
                <span className="inline-block bg-[#1e3a5f] text-[#00eaff] px-4 py-2 rounded-lg text-sm mb-4">
                  🏷️ {product.category}
                </span>
              )}

              {/* توضیحات */}
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                {product.description || "توضیحاتی ثبت نشده"}
              </p>

              {/* قیمت */}
              <div className="mb-6 space-y-2">
                {hasDiscount ? (
                  <>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl text-gray-500 line-through">
                        {product.price.toLocaleString("fa-IR")}
                      </span>
                      <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg text-sm font-bold">
                        {getDiscountPercent()}% تخفیف
                      </span>
                    </div>
                    <span className="text-4xl md:text-5xl font-bold text-[#28a745] block">
                      {getFinalPrice().toLocaleString("fa-IR")} تومان
                    </span>
                  </>
                ) : (
                  <span className="text-4xl md:text-5xl font-bold text-[#28a745]">
                    {product.price.toLocaleString("fa-IR")} تومان
                  </span>
                )}
              </div>

              {/* موجودی */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-6 ${
                product.stock > 0 
                  ? "bg-green-500/20 text-green-400" 
                  : "bg-red-500/20 text-red-400"
              }`}>
                {product.stock > 0 ? (
                  <>
                    <span>✅</span>
                    <span>موجود در انبار ({product.stock} عدد)</span>
                  </>
                ) : (
                  <>
                    <span>❌</span>
                    <span>ناموجود</span>
                  </>
                )}
              </div>
            </div>

            {/* دکمه‌های عملیات */}
            <div className="space-y-4">
              {/* دکمه افزودن به سبد */}
              {product.stock > 0 ? (
                <motion.button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
                    addingToCart
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#28a745] to-[#20c997] hover:shadow-[0_0_30px_rgba(40,167,69,0.6)]"
                  } text-white`}
                >
                  {addingToCart ? "⏳ در حال افزودن..." : "🛒 افزودن به سبد خرید"}
                </motion.button>
              ) : (
                <div className="bg-red-600/50 text-white py-4 rounded-xl text-center font-bold text-xl border-2 border-red-500">
                  ❌ این محصول موجود نیست
                </div>
              )}

              {/* دکمه‌های اضافی */}
              <div className="flex gap-3">
                {/* دکمه Wishlist بزرگ */}
                <motion.button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    isWishlisted
                      ? "bg-red-500/20 text-red-400 border-2 border-red-500"
                      : "bg-[#1e3a5f] text-white border-2 border-[#1e3a5f] hover:border-[#00eaff]"
                  }`}
                >
                  <motion.span
                    key={isWishlisted ? "yes" : "no"}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {isWishlisted ? "❤️" : "🤍"}
                  </motion.span>
                  {isWishlisted ? "در علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                </motion.button>

                {/* دکمه اشتراک */}
                <motion.button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("✅ لینک کپی شد!");
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-xl bg-[#1e3a5f] text-white border-2 border-[#1e3a5f] hover:border-[#00eaff] transition-all"
                  title="اشتراک‌گذاری"
                >
                  🔗
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════ نظرات ══════════════════ */}
      <div className="bg-gradient-to-br from-[#102030] to-[#1a3a52] rounded-2xl p-8 border-2 border-[#00eaff]/20">
        <h2 className="text-3xl font-bold text-[#00eaff] mb-6">
          💬 نظرات کاربران ({reviews.length})
        </h2>

        {/* فرم ثبت نظر */}
        {user ? (
          <form onSubmit={handleSubmitReview} className="bg-[#0d1b2a] p-6 rounded-xl mb-8 border border-[#00eaff]/30">
            <h3 className="text-xl font-bold text-[#ffaa00] mb-4">
              ✏️ ثبت نظر جدید
            </h3>

            {/* انتخاب امتیاز */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">امتیاز:</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                className="w-full px-4 py-3 bg-[#102030] border border-[#00eaff]/30 rounded-xl text-white focus:outline-none focus:border-[#ffaa00] cursor-pointer"
              >
                <option value="5">⭐⭐⭐⭐⭐ (عالی)</option>
                <option value="4">⭐⭐⭐⭐ (خوب)</option>
                <option value="3">⭐⭐⭐ (متوسط)</option>
                <option value="2">⭐⭐ (ضعیف)</option>
                <option value="1">⭐ (خیلی ضعیف)</option>
              </select>
            </div>

            {/* متن نظر */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">نظر شما:</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows="4"
                placeholder="نظر خود را بنویسید..."
                className="w-full px-4 py-3 bg-[#102030] border border-[#00eaff]/30 rounded-xl text-white focus:outline-none focus:border-[#ffaa00] resize-none"
              />
            </div>

            <motion.button
              type="submit"
              disabled={submittingReview}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                submittingReview
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:shadow-[0_0_20px_rgba(102,126,234,0.6)]"
              } text-white`}
            >
              {submittingReview ? "⏳ در حال ثبت..." : "📤 ثبت نظر"}
            </motion.button>
          </form>
        ) : (
          <div className="bg-[#0d1b2a] p-6 rounded-xl mb-8 border border-[#ffaa00]/30 text-center">
            <p className="text-gray-400 mb-4">برای ثبت نظر باید وارد شوید</p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-[#00eaff] text-[#0a1929] rounded-xl font-bold hover:bg-[#00d4e8] transition-colors"
            >
              🔐 ورود به حساب
            </button>
          </div>
        )}

        {/* لیست نظرات */}
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💭</div>
            <p className="text-gray-400 text-lg">
              هنوز نظری ثبت نشده است. اولین نفر باشید! 🎉
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {reviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#0d1b2a] p-6 rounded-xl border border-[#00eaff]/20 hover:border-[#00eaff]/40 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[#28a745] font-bold text-lg">
                        👤 {review.user?.name || "کاربر"}
                      </p>
                      <div className="text-yellow-400 text-lg mt-1">
                        {"⭐".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm bg-[#1e3a5f] px-3 py-1 rounded-lg">
                      {new Date(review.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {review.comment}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ══════════════════ دکمه بازگشت ══════════════════ */}
      <motion.button
        onClick={() => navigate("/products")}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-8 w-full py-4 bg-[#1e3a5f] text-white rounded-xl font-bold text-lg hover:bg-[#2a4a6f] transition-colors border-2 border-[#1e3a5f] hover:border-[#00eaff]"
      >
        🔙 بازگشت به لیست محصولات
      </motion.button>
    </motion.div>
  );
}

export default ProductDetail;