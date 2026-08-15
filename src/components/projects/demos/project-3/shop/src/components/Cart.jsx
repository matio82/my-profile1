import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart
  } = useContext(CartContext);

  const navigate = useNavigate();

  const handleRemove = async (productId) => {
    if (window.confirm("آیا مطمئنید که می‌خواهید این محصول را حذف کنید؟")) {
      await removeFromCart(productId);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("آیا مطمئنید که می‌خواهید کل سبد را خالی کنید؟")) {
      await clearCart();
    }
  };

  // ✅ تابع محاسبه قیمت نهایی هر آیتم
  const getItemFinalPrice = (item) => {
    const product = item.product;
    if (!product) return 0;
    
    // اگر discountPrice داره و کمتر از price هست
    if (product.discountPrice && product.discountPrice < product.price) {
      return product.discountPrice;
    }
    return product.price;
  };

  // ✅ محاسبه درصد تخفیف
  const getDiscountPercent = (item) => {
    const product = item.product;
    if (!product) return 0;
    
    if (product.discountPrice && product.discountPrice < product.price) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  };

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-12 max-w-lg mx-auto"
      >
        <div className="bg-gradient-to-br from-[#102030] to-[#1a3a52] rounded-2xl p-10 border-2 border-[#00eaff]/30">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-[#00eaff] mb-4">
            سبد خرید شما خالی است
          </h2>
          <p className="text-gray-400 mb-6">
            محصولات مورد علاقه خود را به سبد اضافه کنید
          </p>
          <button
            onClick={() => navigate("/products")}
            className="px-8 py-3 bg-gradient-to-r from-[#00eaff] to-[#0080ff] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            🛍️ برو به فروشگاه
          </button>
        </div>
      </motion.div>
    );
  }

  // محاسبه صرفه‌جویی کل
  const totalSavings = cartItems.reduce((sum, item) => {
    const product = item.product;
    if (product && product.discountPrice && product.discountPrice < product.price) {
      return sum + ((product.price - product.discountPrice) * item.quantity);
    }
    return sum;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-4xl mx-auto"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-[#102030] to-[#1a3a52] p-6 rounded-2xl border-2 border-[#00eaff]/30">
        <h2 className="text-3xl font-bold text-[#00eaff]">🛒 سبد خرید</h2>
        <button
          onClick={handleClearCart}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
        >
          🗑️ خالی کردن سبد
        </button>
      </div>

      {/* لیست آیتم‌ها */}
      <div className="space-y-4">
        {cartItems.map((item) => {
          const finalPrice = getItemFinalPrice(item);
          const discountPercent = getDiscountPercent(item);
          const hasDiscount = discountPercent > 0;

          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-[#102030] to-[#1a3a52] rounded-2xl p-5 border-2 border-[#00eaff]/20 flex flex-col md:flex-row items-center gap-4"
            >
              {/* تصویر */}
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={item.product?.images?.[0] || "https://via.placeholder.com/100"}
                  alt={item.product?.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* اطلاعات محصول */}
              <div className="flex-1 text-right">
                <h3 className="text-xl font-bold text-[#00eaff] mb-2">
                  {item.product?.name || "محصول"}
                </h3>
                
                {/* ✅ قیمت با پشتیبانی تخفیف */}
                <div className="flex items-center gap-3">
                  {hasDiscount ? (
                    <>
                      <span className="text-gray-500 line-through text-sm">
                        {item.product?.price?.toLocaleString("fa-IR")}
                      </span>
                      <span className="text-[#28a745] font-bold">
                        {finalPrice?.toLocaleString("fa-IR")} تومان
                      </span>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {discountPercent}%
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-400">
                      قیمت واحد: {item.product?.price?.toLocaleString("fa-IR")} تومان
                    </span>
                  )}
                </div>
              </div>

              {/* کنترل تعداد */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className={`w-10 h-10 rounded-xl font-bold text-xl transition-colors ${
                    item.quantity <= 1
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-600 text-white hover:bg-gray-500"
                  }`}
                >
                  −
                </button>

                <span className="w-12 text-center text-xl font-bold text-white bg-[#0d1b2a] py-2 rounded-xl">
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  className="w-10 h-10 rounded-xl font-bold text-xl bg-[#28a745] text-white hover:bg-[#20c997] transition-colors"
                >
                  +
                </button>
              </div>

              {/* قیمت کل آیتم */}
              <div className="text-center min-w-[140px]">
                <span className="text-2xl font-bold text-[#28a745]">
                  {(finalPrice * item.quantity).toLocaleString("fa-IR")}
                </span>
                <span className="text-gray-400 text-sm block">تومان</span>
              </div>

              {/* دکمه حذف */}
              <button
                onClick={() => handleRemove(item.product._id)}
                className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
              >
                🗑️ حذف
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* ==================== جمع کل ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-gradient-to-br from-[#102030] to-[#1a3a52] rounded-2xl p-6 border-2 border-[#28a745]/50"
      >
        {/* 💰 نمایش صرفه‌جویی */}
        {totalSavings > 0 && (
          <div className="flex justify-between items-center mb-4 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
            <span className="text-yellow-400 font-bold">💰 سود شما از تخفیف‌ها:</span>
            <span className="text-yellow-400 font-bold text-xl">
              {totalSavings.toLocaleString("fa-IR")} تومان
            </span>
          </div>
        )}

        {/* مجموع */}
        <div className="flex justify-between items-center text-2xl">
          <span className="text-white font-bold">مجموع سبد خرید:</span>
          <span className="text-[#28a745] font-bold text-3xl">
            {getTotalPrice().toLocaleString("fa-IR")} تومان
          </span>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="w-full mt-6 py-4 bg-gradient-to-r from-[#28a745] to-[#20c997] text-white rounded-xl font-bold text-xl hover:shadow-lg hover:shadow-green-500/50 transition-all"
        >
          ✅ ادامه و تکمیل خرید
        </button>
      </motion.div>
    </motion.div>
  );
}

export default Cart;
