// src/pages/Dashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: "الکترونیک", label: "💻 الکترونیک" },
    { value: "پوشاک", label: "👕 پوشاک" },
    { value: "کتاب", label: "📚 کتاب" },
    { value: "لوازم خانگی", label: "🏠 لوازم خانگی" },
    { value: "ورزشی", label: "⚽ ورزشی" },
    { value: "آرایشی و بهداشتی", label: "💄 آرایشی و بهداشتی" },
    { value: "اسباب بازی", label: "🧸 اسباب بازی" },
    { value: "مواد غذایی", label: "🍔 مواد غذایی" },
    { value: "سایر", label: "📦 سایر" }
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔑 Token:", token ? "موجود ✅" : "نداریم ❌");

    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/admin/stats");
        console.log("🔥 Response کامل:", data);
        
        if (data?.success && data?.stats) {
          console.log("✅ قبل از setStats:", data.stats);
          setStats(data.stats);
        } else {
          console.error("❌ ساختار response اشتباهه:", data);
        }
      } catch (error) {
        console.error("❌ خطا:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // 👀 چک کنیم stats واقعاً تغییر کرد یا نه
  useEffect(() => {
    if (stats) {
      console.log("🎯 State stats الان:", stats);
    }
  }, [stats]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="text-center text-[#00eaff] text-xl mt-20 animate-pulse">
        در حال بارگذاری آمار 📊 ...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-red-500 text-lg mt-20">
        ⚠️ دریافت آمار از سرور انجام نشد.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-[#0d1b2a] text-white rounded-2xl shadow-2xl border border-[#0d324d]">
      <h1 className="text-4xl font-bold text-center mb-4 text-[#ffd700]">
        👑 پنل مدیریت
      </h1>
      <p className="text-center text-[#00eaff] mb-8">
        خوش آمدی {user?.name || "ادمین"} 🎉
      </p>

      {/* 🔥 تست مستقیم: آیا stats مقدار داره؟ */}
      <div className="text-center mb-4 text-yellow-400">
        🧪 Debug: کاربران = {stats.usersCount}, محصولات = {stats.productsCount}
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center mb-8">
        <StatCard value={stats.productsCount} label="کل محصولات" icon="📦" color="#00eaff" />
        <StatCard value={stats.ordersCount} label="سفارشات" icon="🛒" color="#ffaa00" />
        <StatCard value={`${stats.totalRevenue.toLocaleString()} تومان`} label="کل درآمد" icon="💰" color="#28a745" />
        <StatCard value={stats.usersCount} label="کاربران" icon="👥" color="#dc3545" />
      </div>

      {/* دسته‌بندی‌ها */}
      <div className="bg-[#102030] rounded-xl p-6 border border-[#1e3a5f] mb-10">
        <h2 className="text-2xl font-bold text-[#00eaff] mb-4">🏷️ دسته‌بندی‌ها</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => navigate(`/category/${cat.value}`)}
              className="px-4 py-2 bg-[#1b2a41] border border-[#00eaff] rounded-xl text-white hover:bg-[#082a46] transition-all font-semibold"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* اقدامات سریع */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <ActionCard
          label="➕ ساخت محصول جدید"
          desc="افزودن محصول به فروشگاه"
          color="#28a745"
          onClick={() => navigate("/admin/products/create")}
        />
        <ActionCard
          label="🛍️ مدیریت محصولات"
          desc="ویرایش و حذف محصولات"
          color="#00eaff"
          onClick={() => navigate("/admin/products")}
        />
        <ActionCard
          label="📦 مدیریت سفارشات"
          desc="بررسی و پردازش سفارشات"
          color="#ffaa00"
          onClick={() => navigate("/admin/orders")}
        />
      </div>

      {/* دکمه خروج */}
      <div className="text-center mt-10">
        <button
          onClick={handleLogout}
          className="bg-[#dc3545] px-8 py-3 rounded-xl text-white font-bold hover:bg-[#c82333] transition-colors"
        >
          🚪 خروج از حساب
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label, color }) => {
  console.log(`🃏 StatCard render: ${label} = ${value}`);
  
  return (
    <div
      className="p-6 rounded-xl shadow-lg"
      style={{ backgroundColor: "#102030", border: `2px solid ${color}` }}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-2xl font-bold" style={{ color }}>
        {value}
      </h3>
      <p className="text-gray-300 mt-1">{label}</p>
    </div>
  );
};

const ActionCard = ({ label, desc, color, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-[#102030] border border-[#1e3a5f] rounded-xl p-6 hover:scale-105 transition-transform shadow-lg"
  >
    <h3 className="text-xl font-bold mb-2" style={{ color }}>
      {label}
    </h3>
    <p className="text-gray-400">{desc}</p>
  </div>
);

export default Dashboard;
