// src/pages/CategoryProducts.jsx
import { useState, useEffect, useContext, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../utils/axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const CategoryProducts = () => {
  const { category } = useParams();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingProduct, setAddingProduct] = useState(null);

  // ✅ تعریف fetchProducts با useCallback قبل از useEffect
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(`/products/category/${category}`);
      setProducts(data.products || data.data || []);
    } catch (err) {
      console.error("❌ خطا در دریافت محصولات:", err);
      setError(err.response?.data?.message || "خطا در دریافت محصولات");
    } finally {
      setLoading(false);
    }
  }, [category]);

  // ✅ حالا useEffect بعد از تعریف fetchProducts
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("⚠️ لطفاً ابتدا وارد شوید");
      return;
    }

    setAddingProduct(productId);
    const result = await addToCart(productId, 1);

    if (result.success) {
      alert("✅ محصول به سبد خرید اضافه شد");
    } else {
      alert("❌ خطا: " + (result.message || "مشکلی پیش آمد"));
    }

    setAddingProduct(null);
  };

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
            در حال بارگذاری محصولات...
          </p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-10 bg-red-900/30 border-2 border-red-500 rounded-2xl p-8 max-w-2xl mx-auto"
      >
        <div className="text-5xl mb-4">❌</div>
        <p className="text-2xl text-red-400 font-bold">{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
        >
          🔄 تلاش مجدد
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4"
    >
      {/* Header با دکمه بازگشت */}
      <div className="flex items-center justify-between mb-10 bg-gradient-to-r from-[#102030] to-[#1a3a52] p-6 rounded-2xl border-2 border-[#00eaff]/30 shadow-lg">
        <div>
          <h1 className="text-4xl font-bold text-[#00eaff] mb-2">
            📦 {decodeURIComponent(category)}
          </h1>
          <p className="text-gray-400">
            {products.length} محصول یافت شد
          </p>
        </div>

        <Link
          to="/categories"
          className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#764ba2] hover:to-[#667eea] text-white font-bold rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(102,126,234,0.6)] transition-all duration-300"
        >
          ← بازگشت به دسته‌بندی‌ها
        </Link>
      </div>

      {/* لیست محصولات */}
      {products.length === 0 ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-20 bg-gradient-to-br from-[#102030] to-[#0d1b2a] rounded-2xl border-2 border-dashed border-gray-600"
        >
          <div className="text-8xl mb-6">😔</div>
          <p className="text-3xl text-gray-400 font-bold">
            محصولی در این دسته‌بندی یافت نشد
          </p>
          <Link
            to="/categories"
            className="inline-block mt-8 px-8 py-4 bg-[#00eaff] hover:bg-[#ffaa00] text-[#0d1b2a] font-bold rounded-xl transition-colors"
          >
            مشاهده سایر دسته‌بندی‌ها
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              <Link
                to={`/products/${product._id}`}
                className="block bg-gradient-to-br from-[#102030] to-[#1a3a52] rounded-2xl overflow-hidden border-2 border-[#00eaff]/20 hover:border-[#ffaa00] hover:shadow-[0_0_40px_rgba(0,234,255,0.4)] transition-all duration-300"
              >
                {/* تصویر محصول */}
                <div className="relative h-56 bg-gray-800 overflow-hidden">
                  <img
                    src={
                      product.images && product.images[0]
                        ? product.images[0]
                        : "https://via.placeholder.com/400x300?text=تصویر+ندارد"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />

                  {/* برچسب موجودی */}
                  {product.stock === 0 && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                      ❌ ناموجود
                    </div>
                  )}

                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-[#ff0080] text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                      🔥 {product.discount}% تخفیف
                    </div>
                  )}
                </div>

                {/* اطلاعات محصول */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-[#00eaff] mb-3 hover:text-[#ffaa00] transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">
                    {product.description || "توضیحاتی برای این محصول ثبت نشده"}
                  </p>

                  {/* قیمت */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-[#28a745]">
                        {product.price.toLocaleString("fa-IR")}
                      </span>
                      <span className="text-gray-400 text-sm mr-2">تومان</span>
                    </div>

                    {product.discount > 0 && (
                      <span className="text-gray-500 line-through text-sm">
                        {((product.price * 100) / (100 - product.discount)).toLocaleString("fa-IR")} تومان
                      </span>
                    )}
                  </div>

                  {/* دکمه افزودن به سبد */}
                  {product.stock > 0 && (
                    <button
                      onClick={(e) => handleAddToCart(product._id, e)}
                      disabled={addingProduct === product._id}
                      className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                        addingProduct === product._id
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#28a745] to-[#20c997] hover:from-[#20c997] hover:to-[#28a745] hover:shadow-[0_0_20px_rgba(40,167,69,0.6)]"
                      } text-white`}
                    >
                      {addingProduct === product._id ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin">⏳</span>
                          در حال افزودن...
                        </span>
                      ) : (
                        "🛒 افزودن به سبد خرید"
                      )}
                    </button>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default CategoryProducts;
