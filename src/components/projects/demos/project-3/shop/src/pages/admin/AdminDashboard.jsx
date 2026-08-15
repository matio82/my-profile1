// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState, useContext, useCallback } from "react";
import axios from "../../utils/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SalesDashboard from "./SalesDashboard";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
    usersCount: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [showSalesDashboard, setShowSalesDashboard] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      console.log("🚀 شروع واکشی آمار");
      const res = await axios.get("/admin/stats");
      console.log("✅ پاسخ سرور:", res.data);
      
      if (res.data.success && res.data.stats) {
        setStats(res.data.stats);
        console.log("📊 آمار ذخیره شد:", res.data.stats);
      }
    } catch (error) {
      console.error("❌ خطا در دریافت آمار:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
          <div className="text-cyan-400 text-2xl mb-2">در حال بارگذاری آمار 📊</div>
          <div className="text-gray-400">لطفاً صبر کنید...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* هدر */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-3">
            👑 پنل مدیریت
          </h1>
          <p className="text-cyan-400 text-lg md:text-xl">
            خوش آمدید {user?.name || "ادمین"} 🎉
          </p>
        </div>

        {/* کارت‌های آماری */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          <StatCard 
            icon="📦" 
            value={stats.productsCount || 0} 
            label="کل محصولات" 
            color="text-blue-400"
            bgGradient="from-blue-900 to-blue-700"
            borderColor="border-blue-500"
          />
          <StatCard 
            icon="👥" 
            value={stats.usersCount || 0} 
            label="کاربران" 
            color="text-red-400"
            bgGradient="from-red-900 to-red-700"
            borderColor="border-red-500"
          />
          <StatCard 
            icon="🛒" 
            value={stats.ordersCount || 0} 
            label="سفارشات" 
            color="text-yellow-400"
            bgGradient="from-yellow-900 to-yellow-700"
            borderColor="border-yellow-500"
          />
          <StatCard 
            icon="💰" 
            value={`${(stats.totalRevenue || 0).toLocaleString('fa-IR')} تومان`} 
            label="کل درآمد" 
            color="text-green-400"
            bgGradient="from-green-900 to-green-700"
            borderColor="border-green-500"
          />
        </div>

        {/* اقدامات سریع */}
        <div className="bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-700 mb-8 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-6 text-center">
            ⚡ اقدامات سریع
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <ActionCard
              icon="➕"
              label="ساخت محصول جدید"
              desc="افزودن محصول به فروشگاه"
              color="text-green-400"
              hoverColor="hover:border-green-400"
              onClick={() => navigate("/admin/products/create")}
            />
            <ActionCard
              icon="🛍️"
              label="مدیریت محصولات"
              desc="ویرایش و حذف محصولات"
              color="text-cyan-400"
              hoverColor="hover:border-cyan-400"
              onClick={() => navigate("/admin/products")}
            />
            <ActionCard
              icon="📦"
              label="مدیریت سفارشات"
              desc="بررسی و پردازش سفارشات"
              color="text-yellow-400"
              hoverColor="hover:border-yellow-400"
              onClick={() => navigate("/admin/orders")}
            />
          </div>
        </div>

        {/* دکمه داشبورد فروش */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-8 shadow-2xl">
          <button
            onClick={() => setShowSalesDashboard(!showSalesDashboard)}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4 rounded-xl text-white font-bold text-lg hover:from-purple-700 hover:to-purple-900 transition-all shadow-lg hover:shadow-purple-500/50 transform hover:scale-[1.02]"
          >
            📊 {showSalesDashboard ? 'بستن' : 'نمایش'} داشبورد فروش
          </button>
          
          {showSalesDashboard && (
            <div className="mt-6">
              <SalesDashboard />
            </div>
          )}
        </div>

        {/* دکمه خروج */}
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-600 to-red-800 px-8 md:px-10 py-3 md:py-4 rounded-xl text-white font-bold text-base md:text-lg hover:from-red-700 hover:to-red-900 transition-all shadow-lg hover:shadow-red-500/50 transform hover:scale-105"
          >
            🚪 خروج از حساب
          </button>
        </div>
      </div>
    </div>
  );
};

// کامپوننت کارت آمار
const StatCard = ({ icon, value, label, color, bgGradient, borderColor }) => (
  <div className={`bg-gradient-to-br ${bgGradient} p-6 rounded-2xl shadow-2xl border-2 ${borderColor} hover:scale-105 transition-transform cursor-pointer`}>
    <div className="text-center">
      <div className="text-4xl md:text-5xl mb-3">{icon}</div>
      <h3 className={`text-3xl md:text-4xl font-bold mb-2 ${color}`}>
        {value}
      </h3>
      <p className="text-gray-300 text-sm md:text-lg">{label}</p>
    </div>
  </div>
);

// کامپوننت کارت عملیات
const ActionCard = ({ icon, label, desc, color, hoverColor, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 ${hoverColor} hover:scale-105 transition-all cursor-pointer shadow-xl hover:shadow-cyan-500/30`}
  >
    <div className="text-center">
      <div className="text-4xl md:text-5xl mb-3">{icon}</div>
      <h3 className={`text-lg md:text-xl font-bold mb-2 ${color}`}>
        {label}
      </h3>
      <p className="text-gray-400 text-sm md:text-base">{desc}</p>
    </div>
  </div>
  
);


export default AdminDashboard;