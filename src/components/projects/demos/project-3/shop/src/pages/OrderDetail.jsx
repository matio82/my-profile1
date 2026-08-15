// src/pages/OrderDetail.jsx
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../utils/axios";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // تنظیمات وضعیت‌ها
  const statusConfig = {
    pending: { label: "در انتظار تأیید", color: "yellow", icon: "⏳", step: 1 },
    confirmed: { label: "تأیید شده", color: "blue", icon: "✅", step: 2 },
    packing: { label: "در حال بسته‌بندی", color: "purple", icon: "📦", step: 3 },
    shipped: { label: "ارسال شده", color: "cyan", icon: "🚚", step: 4 },
    delivered: { label: "تحویل داده شده", color: "green", icon: "✔️", step: 5 },
    cancelled: { label: "لغو شده", color: "red", icon: "❌", step: 0 },
  };

  const statusSteps = ["pending", "confirmed", "packing", "shipped", "delivered"];

  // ✅ اصلاح: useCallback قبل از useEffect
  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/orders/${id}`);

      console.log("✅ جزئیات سفارش:", res.data);
      setOrder(res.data.order || res.data.data || res.data);
    } catch (err) {
      console.error("❌ خطا:", err);
      setError(err.response?.data?.message || "خطا در دریافت جزئیات سفارش");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ✅ اصلاح: useEffect بعد از تعریف fetchOrder
  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleCancelOrder = async () => {
    if (!window.confirm("آیا مطمئنید که می‌خواهید این سفارش را لغو کنید؟")) {
      return;
    }

    try {
      await axios.put(`/orders/${id}/cancel`);
      alert("✅ سفارش با موفقیت لغو شد");
      fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || "خطا در لغو سفارش");
    }
  };

  // لودینگ
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1929] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⚙️</div>
          <p className="text-2xl text-[#00eaff]">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // خطا
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a1929] flex items-center justify-center p-6">
        <div className="text-center bg-red-900/30 border border-red-500 rounded-2xl p-8 max-w-md">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-xl text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/my-orders")}
            className="px-6 py-3 bg-[#00eaff] text-[#0a1929] rounded-xl font-bold"
          >
            🔙 بازگشت به سفارشات
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0a1929] flex items-center justify-center">
        <p className="text-xl text-gray-400">سفارش یافت نشد</p>
      </div>
    );
  }

  const currentStatus = statusConfig[order.status] || statusConfig.pending;
  const currentStep = currentStatus.step;
  const canCancel = ["pending", "confirmed"].includes(order.status);
  const isCancelled = order.status === "cancelled";
  // ✅ اصلاح: استفاده از totalAmount یا totalPrice
  const totalPrice = order.totalPrice || order.totalAmount || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0a1929] p-6"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        {/* دکمه بازگشت */}
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-2 text-[#00eaff] hover:text-white mb-6 transition-colors"
        >
          <span>→</span> بازگشت به سفارشات
        </Link>

        {/* هدر سفارش */}
        <div className="bg-gradient-to-r from-[#102030] to-[#1a3a52] rounded-2xl p-6 mb-6 border border-[#00eaff]/30">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#00eaff] mb-2">
                📋 جزئیات سفارش
              </h1>
              <p className="text-gray-400">
                شماره سفارش:{" "}
                <span className="text-[#ffd700] font-mono font-bold">
                  {order.orderNumber || order._id?.slice(-8)}
                </span>
              </p>
            </div>

            <div
              className={`px-5 py-3 rounded-xl border-2 ${
                isCancelled
                  ? "bg-red-500/20 border-red-500 text-red-400"
                  : "bg-green-500/20 border-green-500 text-green-400"
              }`}
            >
              <span className="text-2xl ml-2">{currentStatus.icon}</span>
              <span className="font-bold">{currentStatus.label}</span>
            </div>
          </div>
        </div>

        {/* تایم‌لاین وضعیت */}
        {!isCancelled && (
          <div className="bg-[#102030] rounded-2xl p-6 mb-6 border border-[#1e3a5f]">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>📍</span> وضعیت سفارش
            </h2>

            <div className="flex items-center justify-between relative">
              {/* خط پس‌زمینه */}
              <div className="absolute top-5 right-0 left-0 h-1 bg-[#1e3a5f] z-0"></div>

              {/* خط پیشرفت */}
              <div
                className="absolute top-5 right-0 h-1 bg-gradient-to-l from-[#00eaff] to-[#28a745] z-10 transition-all duration-500"
                style={{
                  width: `${((currentStep - 1) / (statusSteps.length - 1)) * 100}%`,
                }}
              ></div>

              {/* مراحل */}
              {statusSteps.map((stepKey, index) => {
                const stepConfig = statusConfig[stepKey];
                const isCompleted = currentStep > index + 1;
                const isCurrent = currentStep === index + 1;

                return (
                  <div key={stepKey} className="flex flex-col items-center z-20">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 ${
                        isCompleted
                          ? "bg-[#28a745] border-[#28a745] text-white"
                          : isCurrent
                          ? "bg-[#00eaff] border-[#00eaff] text-[#0a1929] animate-pulse"
                          : "bg-[#0d1b2a] border-[#1e3a5f] text-gray-500"
                      }`}
                    >
                      {isCompleted ? "✓" : stepConfig.icon}
                    </motion.div>
                    <span
                      className={`mt-2 text-xs text-center ${
                        isCompleted || isCurrent ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {stepConfig.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* سفارش لغو شده */}
        {isCancelled && (
          <div className="bg-red-900/20 border border-red-500 rounded-2xl p-6 mb-6 text-center">
            <div className="text-5xl mb-4">❌</div>
            <p className="text-xl text-red-400 font-bold">
              این سفارش لغو شده است
            </p>
          </div>
        )}

        {/* اطلاعات ارسال */}
        {order.shippingAddress && (
          <div className="bg-[#102030] rounded-2xl p-6 mb-6 border border-[#1e3a5f]">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📍</span> اطلاعات ارسال
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div className="bg-[#0d1b2a] p-4 rounded-xl">
                <span className="text-gray-500 text-sm">گیرنده:</span>
                <p className="text-white font-bold">
                  {order.shippingAddress.fullName}
                </p>
              </div>

              <div className="bg-[#0d1b2a] p-4 rounded-xl">
                <span className="text-gray-500 text-sm">تلفن:</span>
                <p className="text-white font-bold">
                  {order.shippingAddress.phone}
                </p>
              </div>

              <div className="bg-[#0d1b2a] p-4 rounded-xl">
                <span className="text-gray-500 text-sm">شهر:</span>
                <p className="text-white font-bold">
                  {order.shippingAddress.city}
                </p>
              </div>

              <div className="bg-[#0d1b2a] p-4 rounded-xl">
                <span className="text-gray-500 text-sm">کد پستی:</span>
                <p className="text-white font-bold">
                  {order.shippingAddress.postalCode}
                </p>
              </div>

              <div className="bg-[#0d1b2a] p-4 rounded-xl md:col-span-2">
                <span className="text-gray-500 text-sm">آدرس کامل:</span>
                <p className="text-white font-bold">
                  {order.shippingAddress.address}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* کد رهگیری */}
        {order.trackingCode && (
          <div className="bg-gradient-to-r from-green-900/30 to-cyan-900/30 rounded-2xl p-6 mb-6 border border-green-500/50">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🚚</span> اطلاعات ارسال پستی
            </h2>

            <div className="flex flex-wrap gap-4">
              <div className="bg-[#0d1b2a] p-4 rounded-xl flex-1">
                <span className="text-gray-500 text-sm">کد رهگیری:</span>
                <p className="text-[#00eaff] font-bold text-xl font-mono">
                  {order.trackingCode}
                </p>
              </div>

              {order.shippingCompany && (
                <div className="bg-[#0d1b2a] p-4 rounded-xl flex-1">
                  <span className="text-gray-500 text-sm">شرکت پستی:</span>
                  <p className="text-white font-bold">{order.shippingCompany}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* لیست محصولات */}
        <div className="bg-[#102030] rounded-2xl p-6 mb-6 border border-[#1e3a5f]">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📦</span> محصولات سفارش
          </h2>

          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-[#0d1b2a] p-4 rounded-xl"
              >
                {/* تصویر */}
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={
                      item.product?.images?.[0] ||
                      "https://via.placeholder.com/80"
                    }
                    alt={item.product?.name || "محصول"}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* اطلاعات */}
                <div className="flex-1">
                  <h3 className="text-white font-bold">
                    {item.product?.name || item.name || "محصول"}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    تعداد: {item.quantity} عدد
                  </p>
                </div>

                {/* قیمت */}
                <div className="text-left">
                  <p className="text-gray-400 text-sm">
                    {item.price?.toLocaleString("fa-IR")} × {item.quantity}
                  </p>
                  <p className="text-[#28a745] font-bold">
                    {(item.price * item.quantity).toLocaleString("fa-IR")} تومان
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* جمع کل */}
        <div className="bg-gradient-to-r from-[#102030] to-[#1a3a52] rounded-2xl p-6 mb-6 border border-[#28a745]/40">
          {order.originalTotalPrice && order.originalTotalPrice > totalPrice && (
            <div className="flex justify-between items-center text-xl mb-2">
              <span className="text-gray-300">جمع کل:</span>
              <span className="text-gray-400 line-through">
                {order.originalTotalPrice.toLocaleString("fa-IR")} تومان
              </span>
            </div>
          )}

          {order.totalSavings > 0 && (
            <div className="flex justify-between items-center text-lg mb-2 text-yellow-400">
              <span>💰 سود شما:</span>
              <span>{order.totalSavings.toLocaleString("fa-IR")} تومان</span>
            </div>
          )}

          <div className="flex justify-between items-center text-2xl font-bold">
            <span className="text-white">مبلغ نهایی:</span>
            <span className="text-[#28a745]">
              {totalPrice.toLocaleString("fa-IR")} تومان
            </span>
          </div>
        </div>

        {/* دکمه لغو سفارش */}
        {canCancel && !isCancelled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={handleCancelOrder}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:shadow-red-500/40"
            >
              ❌ لغو سفارش
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default OrderDetail;
