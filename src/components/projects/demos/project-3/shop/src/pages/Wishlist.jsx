// src/pages/Wishlist.jsx
import React, { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Wishlist.css";

function Wishlist() {
  const { user } = useContext(AuthContext);
  const { 
    wishlistItems, 
    removeFromWishlist, 
    clearWishlist, 
    loading 
  } = useContext(WishlistContext);
  
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  // ═══════════════════════════════════════════════════════════
  // 🔐 اگر کاربر لاگین نکرده
  // ═══════════════════════════════════════════════════════════
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="wishlist-empty"
      >
        <div className="empty-box">
          <div className="empty-icon">🔐</div>
          <h2>برای مشاهده علاقه‌مندی‌ها وارد شوید</h2>
          <p>لطفاً ابتدا وارد حساب کاربری خود شوید</p>
          <button
            onClick={() => navigate("/login")}
            className="browse-btn"
          >
            🔑 ورود به حساب
          </button>
        </div>
      </motion.div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // 🗑️ حذف از لیست
  // ═══════════════════════════════════════════════════════════
  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  // ═══════════════════════════════════════════════════════════
  // 🛒 افزودن به سبد خرید
  // ═══════════════════════════════════════════════════════════
  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1);
    if (result.success) {
      // نمایش پیام موفقیت (اختیاری)
      console.log("✅ به سبد خرید اضافه شد");
    }
  };

  // ═══════════════════════════════════════════════════════════
  // 🛒➕ افزودن همه به سبد
  // ═══════════════════════════════════════════════════════════
  const handleAddAllToCart = async () => {
    for (const item of wishlistItems) {
      if (item.product && item.product.stock > 0) {
        await addToCart(item.product._id, 1);
      }
    }
  };

  // ═══════════════════════════════════════════════════════════
  // 🧹 پاک کردن کل لیست
  // ═══════════════════════════════════════════════════════════
  const handleClearAll = async () => {
    if (window.confirm("آیا مطمئنید که می‌خواهید کل لیست را پاک کنید؟")) {
      await clearWishlist();
    }
  };

  // ═══════════════════════════════════════════════════════════
  // 💰 محاسبه قیمت نهایی
  // ═══════════════════════════════════════════════════════════
  const getFinalPrice = (product) => {
    if (product?.discountPrice && product.discountPrice < product.price) {
      return product.discountPrice;
    }
    return product?.price || 0;
  };

  // ═══════════════════════════════════════════════════════════
  // 📊 محاسبه درصد تخفیف
  // ═══════════════════════════════════════════════════════════
  const getDiscountPercent = (product) => {
    if (product?.discountPrice && product.discountPrice < product.price) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  };

  // ═══════════════════════════════════════════════════════════
  // 💵 محاسبه مجموع قیمت
  // ═══════════════════════════════════════════════════════════
  const getTotalPrice = () => {
    return wishlistItems.reduce((sum, item) => {
      const price = getFinalPrice(item.product);
      return sum + price;
    }, 0);
  };

  // ═══════════════════════════════════════════════════════════
  // 🎨 رندر لیست خالی
  // ═══════════════════════════════════════════════════════════
  if (wishlistItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="wishlist-empty"
      >
        <div className="empty-box">
          <div className="empty-icon">💖</div>
          <h2>لیست علاقه‌مندی‌های شما خالی است</h2>
          <p>محصولات مورد علاقه خود را با کلیک روی ❤️ اضافه کنید</p>
          <button
            onClick={() => navigate("/products")}
            className="browse-btn"
          >
            🛍️ مشاهده محصولات
          </button>
        </div>
      </motion.div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // 🎨 رندر اصلی
  // ═══════════════════════════════════════════════════════════
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="wishlist-page"
      dir="rtl"
    >
      {/* ═══════════════════ Header ═══════════════════ */}
      <div className="wishlist-header">
        <div className="header-right">
          <h2>💖 لیست علاقه‌مندی‌ها</h2>
          <span className="item-count">{wishlistItems.length} محصول</span>
        </div>
        <div className="header-left">
          <button
            onClick={handleAddAllToCart}
            className="add-all-btn"
            disabled={loading}
          >
            🛒 افزودن همه به سبد
          </button>
          <button
            onClick={handleClearAll}
            className="clear-btn"
            disabled={loading}
          >
            🗑️ پاک کردن همه
          </button>
        </div>
      </div>

      {/* ═══════════════════ Products Grid ═══════════════════ */}
      <div className="wishlist-grid">
        <AnimatePresence mode="popLayout">
          {wishlistItems.map((item, index) => {
            const product = item.product;
            if (!product) return null;

            const finalPrice = getFinalPrice(product);
            const discountPercent = getDiscountPercent(product);
            const hasDiscount = discountPercent > 0;
            const isOutOfStock = product.stock <= 0;

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ delay: index * 0.05 }}
                layout
                className={`wishlist-card ${isOutOfStock ? 'out-of-stock' : ''}`}
              >
                {/* Badge تخفیف */}
                {hasDiscount && (
                  <div className="discount-badge">
                    {discountPercent}% تخفیف
                  </div>
                )}

                {/* Badge ناموجود */}
                {isOutOfStock && (
                  <div className="out-of-stock-badge">
                    ناموجود
                  </div>
                )}

                {/* دکمه حذف */}
                <button
                  onClick={() => handleRemove(product._id)}
                  className="remove-btn"
                  title="حذف از علاقه‌مندی‌ها"
                  disabled={loading}
                >
                  ✕
                </button>

                {/* تصویر */}
                <div 
                  className="card-image"
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  <img
                    src={product.images?.[0] || "https://via.placeholder.com/200?text=No+Image"}
                    alt={product.name}
                    loading="lazy"
                  />
                </div>

                {/* اطلاعات */}
                <div className="card-info">
                  <h3 
                    className="product-name"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    {product.name}
                  </h3>

                  {/* دسته‌بندی */}
                  {product.category && (
                    <span className="product-category">
                      {product.category}
                    </span>
                  )}

                  {/* قیمت */}
                  <div className="price-section">
                    {hasDiscount ? (
                      <>
                        <span className="original-price">
                          {product.price?.toLocaleString("fa-IR")}
                        </span>
                        <span className="final-price">
                          {finalPrice?.toLocaleString("fa-IR")} تومان
                        </span>
                      </>
                    ) : (
                      <span className="final-price">
                        {product.price?.toLocaleString("fa-IR")} تومان
                      </span>
                    )}
                  </div>

                  {/* وضعیت موجودی */}
                  <div className={`stock-status ${product.stock > 0 ? 'in-stock' : 'no-stock'}`}>
                    {product.stock > 0 
                      ? `✅ موجود (${product.stock} عدد)` 
                      : '❌ ناموجود'
                    }
                  </div>

                  {/* دکمه‌های عملیات */}
                  <div className="card-actions">
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="add-to-cart-btn"
                      disabled={isOutOfStock || loading}
                    >
                      {isOutOfStock ? '🚫 ناموجود' : '🛒 افزودن به سبد'}
                    </button>
                    <button
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="view-btn"
                    >
                      👁️
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ═══════════════════ Summary ═══════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="wishlist-summary"
      >
        <div className="summary-row">
          <span>مجموع قیمت محصولات:</span>
          <span className="total-price">
            {getTotalPrice().toLocaleString("fa-IR")} تومان
          </span>
        </div>
        <p className="summary-note">
          💡 با افزودن به سبد خرید، قیمت نهایی محاسبه می‌شود
        </p>
      </motion.div>
    </motion.div>
  );
}

export default Wishlist;
