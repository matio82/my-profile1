// src/pages/OrderSuccess.jsx
import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, orderNumber } = location.state || {};

  // اگر مستقیم به این صفحه آمد (بدون state)
  if (!order) {
    return (
      <div className="min-h-screen bg-[#0a1929] flex items-center justify-center p-6" dir="rtl">
        <div className="text-center bg-[#102030] p-10 rounded-2xl border border-[#1e3a5f]">
          <div className="text-6xl mb-4">❓</div>
          <h2 className="text-2xl text-[#00eaff] font-bold mb-4">
            اطلاعات سفارش یافت نشد
          </h2>
          <p className="text-gray-400 mb-6">
            لطفاً از طریق سبد خرید اقدام کنید
          </p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-[#00eaff] text-[#0a1929] rounded-xl font-bold hover:bg-[#00d4e8] transition-all"
          >
            🛍️ بازگشت به فروشگاه
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-[#0a1929] flex items-center justify-center p-6"
      dir="rtl"
    >
      <div className="max-w-2xl w-full">
        {/* کارت موفقیت */}
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-br from-[#102030] to-[#1a3a52] rounded-3xl p-8 border-2 border-[#28a745]/50 shadow-2xl shadow-green-500/20"
        >
          {/* آیکون موفقیت */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-center mb-6"
          >
            <div className="inline-block p-6 bg-[#28a745]/20 rounded-full mb-4">
              <span className="text-8xl">✅</span>
            </div>
            <h1 className="text-3xl font-bold text-[#28a745] mb-2">
              سفارش با موفقیت ثبت شد!
            </h1>
            <p className="text-gray-400">
              از خرید شما متشکریم
            </p>
          </motion.div>

          {/* اطلاعات سفارش */}
          <div className="bg-[#0d1b2a] rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-[#00eaff] mb-4 flex items-center gap-2">
              <span>📋</span> جزئیات سفارش
            </h2>

            <div className="space-y-3">
              {/* شماره سفارش */}
              <div className="flex justify-between items-center p-3 bg-[#102030] rounded-xl">
                <span className="text-gray-400">شماره سفارش:</span>
                <span className="text-[#ffd700] font-bold text-lg font-mono">
                  {orderNumber || order.orderNumber || order._id?.slice(-8)}
                </span>
              </div>

              {/* وضعیت */}
              <div className="flex justify-between items-center p-3 bg-[#102030] rounded-xl">
                <span className="text-gray-400">وضعیت:</span>
                <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
                  ⏳ در انتظار تأیید
                </span>
              </div>

              {/* روش پرداخت */}
              <div className="flex justify-between items-center p-3 bg-[#102030] rounded-xl">
                <span className="text-gray-400">روش پرداخت:</span>
                <span className="text-white">
                  {order.paymentMethod === "cash" ? "💵 پرداخت در محل" : "🏦 پرداخت آنلاین"}
                </span>
              </div>

              {/* مبلغ کل */}
              <div className="flex justify-between items-center p-3 bg-[#102030] rounded-xl">
                <span className="text-gray-400">مبلغ کل:</span>
                <span className="text-[#28a745] font-bold text-xl">
                  {order.totalPrice?.toLocaleString("fa-IR")} تومان
                </span>
              </div>

              {/* تعداد اقلام */}
              <div className="flex justify-between items-center p-3 bg-[#102030] rounded-xl">
                <span className="text-gray-400">تعداد اقلام:</span>
                <span className="text-white">
                  {order.items?.length || 0} محصول
                </span>
              </div>
            </div>
          </div>

          {/* آدرس ارسال */}
          {order.shippingAddress && (
            <div className="bg-[#0d1b2a] rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold text-[#00eaff] mb-4 flex items-center gap-2">
                <span>📍</span> آدرس ارسال
              </h2>
              <div className="text-gray-300 space-y-2">
                <p>
                  <span className="text-gray-500">گیرنده: </span>
                  {order.shippingAddress.fullName}
                </p>
                <p>
                  <span className="text-gray-500">تلفن: </span>
                  {order.shippingAddress.phone}
                </p>
                <p>
                  <span className="text-gray-500">شهر: </span>
                  {order.shippingAddress.city}
                </p>
                <p>
                  <span className="text-gray-500">آدرس: </span>
                  {order.shippingAddress.address}
                </p>
                <p>
                  <span className="text-gray-500">کد پستی: </span>
                  {order.shippingAddress.postalCode}
                </p>
              </div>
            </div>
          )}

          {/* پیام راهنما */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
            <p className="text-blue-400 text-sm text-center">
              💡 شما می‌توانید وضعیت سفارش خود را از بخش "سفارشات من" پیگیری کنید.
              <br />
              پس از تأیید سفارش، کد رهگیری پستی برای شما ارسال خواهد شد.
            </p>
          </div>

          {/* دکمه‌ها */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/my-orders"
              className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#00eaff] to-[#0080ff] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              📦 مشاهده سفارشات من
            </Link>
            
            <Link
              to="/products"
              className="flex items-center justify-center gap-2 py-4 bg-[#1e3a5f] text-white rounded-xl font-bold hover:bg-[#2a4a6f] transition-all"
            >
              🛍️ ادامه خرید
            </Link>
          </div>
        </motion.div>

        {/* انیمیشن کانفتی ساده */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <span className="text-4xl">🎉</span>
          <span className="text-4xl mx-2">🎊</span>
          <span className="text-4xl">🎉</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderSuccess;
