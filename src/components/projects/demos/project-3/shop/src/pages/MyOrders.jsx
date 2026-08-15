// src/pages/MyOrders.jsx
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../utils/axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // وضعیت‌های سفارش با رنگ و آیکون
  const statusConfig = {
    pending: { label: "در انتظار تأیید", color: "yellow", icon: "⏳" },
    confirmed: { label: "تأیید شده", color: "blue", icon: "✅" },
    packing: { label: "در حال بسته‌بندی", color: "purple", icon: "📦" },
    shipped: { label: "ارسال شده", color: "cyan", icon: "🚚" },
    delivered: { label: "تحویل داده شده", color: "green", icon: "✔️" },
    cancelled: { label: "لغو شده", color: "red", icon: "❌" },
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/orders/my-orders");

      console.log("✅ سفارشات دریافت شد:", res.data);
      setOrders(res.data.orders || res.data.data || []);
    } catch (err) {
      console.error("❌ خطا در دریافت سفارشات:", err);
      setError(err.response?.data?.message || "خطا در دریافت سفارشات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("آیا مطمئنید که می‌خواهید این سفارش را لغو کنید؟")) {
      return;
    }

    try {
      await axios.put(`/orders/${orderId}/cancel`);
      alert("✅ سفارش با موفقیت لغو شد");
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "خطا در لغو سفارش");
    }
  };

  const getStatusStyle = (status) => {
    const config = statusConfig[status] || statusConfig.pending;
    const colorMap = {
      yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      cyan: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      green: "bg-green-500/20 text-green-400 border-green-500/30",
      red: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return colorMap[config.color] || colorMap.yellow;
  };

  // لودینگ
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1929] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📦</div>
          <p className="text-2xl text-[#00eaff]">در حال بارگذاری سفارشات...</p>
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
            onClick={fetchOrders}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
          >
            🔄 تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0a1929] p-6"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        {/* هدر */}
        <div className="bg-gradient-to-r from-[#102030] to-[#1a3a52] rounded-2xl p-6 mb-8 border border-[#00eaff]/30">
          <h1 className="text-3xl font-bold text-[#00eaff] flex items-center gap-3">
            <span>📋</span> سفارشات من
          </h1>
          <p className="text-gray-400 mt-2">
            تعداد کل سفارشات: {orders.length}
          </p>
        </div>

        {/* لیست سفارشات */}
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-[#102030] rounded-2xl border border-dashed border-gray-600">
            <div className="text-8xl mb-6">📭</div>
            <p className="text-2xl text-gray-400 mb-4">
              هنوز سفارشی ثبت نکرده‌اید
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-[#28a745] text-white rounded-xl font-bold hover:bg-[#218838]"
            >
              🛍️ شروع خرید
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const canCancel = ["pending", "confirmed"].includes(order.status);
              // ✅ اصلاح: استفاده از totalAmount یا totalPrice
              const totalPrice = order.totalPrice || order.totalAmount || 0;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-[#102030] to-[#1a3a52] rounded-2xl p-6 border border-[#1e3a5f] hover:border-[#00eaff]/50 transition-all"
                >
                  {/* ردیف بالا */}
                  <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                    {/* شماره سفارش */}
                    <div>
                      <span className="text-gray-500 text-sm">شماره سفارش:</span>
                      <p className="text-[#ffd700] font-bold font-mono">
                        {order.orderNumber || order._id?.slice(-8)}
                      </p>
                    </div>

                    {/* تاریخ */}
                    <div>
                      <span className="text-gray-500 text-sm">تاریخ ثبت:</span>
                      <p className="text-white">
                        {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                      </p>
                    </div>

                    {/* وضعیت */}
                    <div
                      className={`px-4 py-2 rounded-full border ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      <span className="ml-1">{status.icon}</span>
                      {status.label}
                    </div>
                  </div>

                  {/* لیست محصولات */}
                  <div className="bg-[#0d1b2a] rounded-xl p-4 mb-4">
                    <p className="text-gray-400 text-sm mb-2">محصولات:</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items?.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-[#1e3a5f] text-white px-3 py-1 rounded-lg text-sm"
                        >
                          {item.product?.name || item.name || "محصول"} × {item.quantity}
                        </span>
                      ))}
                      {order.items?.length > 3 && (
                        <span className="bg-gray-600 text-white px-3 py-1 rounded-lg text-sm">
                          +{order.items.length - 3} محصول دیگر
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ردیف پایین */}
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    {/* مبلغ کل */}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">مبلغ کل:</span>
                      <span className="text-[#28a745] font-bold text-xl">
                        {totalPrice.toLocaleString("fa-IR")} تومان
                      </span>
                    </div>

                    {/* دکمه‌ها */}
                    <div className="flex gap-3">
                      <Link
                        to={`/my-orders/${order._id}`}
                        className="px-4 py-2 bg-[#00eaff] text-[#0a1929] rounded-xl font-bold hover:bg-[#00d4e8] transition-all"
                      >
                        👁️ جزئیات
                      </Link>

                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
                        >
                          ❌ لغو
                        </button>
                      )}
                    </div>
                  </div>

                  {/* کد رهگیری (اگر موجود باشد) */}
                  {order.trackingCode && (
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                      <span className="text-green-400">
                        🚚 کد رهگیری: <strong>{order.trackingCode}</strong>
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MyOrders;
