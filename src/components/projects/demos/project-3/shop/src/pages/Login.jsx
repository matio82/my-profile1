import React, { useState, useContext } from "react";
import axios from "../utils/axios";  // ✅ فقط همین
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", formData);

      if (res.data.token) {
        login(res.data.token, {
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          role: res.data.role,           // ✅ اضافه شد
          isAdmin: res.data.isAdmin 
        });
        navigate("/products");
      }
    } catch (err) {
      setError(err.response?.data?.message || "خطا در ورود");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#1a2332]">
      <style>
        {`
          @keyframes borderRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .rotating-border {
            animation: borderRotate 6s linear infinite;
          }
        `}
      </style>

      {/* MAIN BOX */}
      <div
        className={`
          relative overflow-hidden
          transition-all duration-700 ease-in-out
          ${open ? "w-[420px] h-[520px] rounded-[32px]" : "w-[280px] h-[110px] rounded-[50px]"}
        `}
        style={{
          padding: "3px",
          background: "conic-gradient(from 0deg, #06b6d4, #f59e0b, #06b6d4)",
          boxShadow: open
            ? "0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 80px rgba(6, 182, 212, 0.3)"
            : "0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 40px rgba(6, 182, 212, 0.4)"
        }}
      >
        {/* بوردر چرخان */}
        <div
          className="rotating-border absolute inset-0 opacity-100"
          style={{
            background: "conic-gradient(from 0deg, #06b6d4, transparent 20%, transparent 40%, #f59e0b, transparent 60%, transparent 80%, #06b6d4)",
            borderRadius: open ? "32px" : "50px"
          }}
        ></div>

        {/* کادر اصلی */}
        <div
          onClick={() => !open && setOpen(true)}
          className={`relative w-full h-full cursor-pointer transition-all duration-700 ${open ? "rounded-[29px]" : "rounded-[47px]"}`}
          style={{
            background: "linear-gradient(135deg, #0d1824 0%, #1a2836 100%)"
          }}
        >
          {/* فرم داخلی */}
          <div
            className={`
              absolute inset-0
              shadow-2xl px-12 py-10 transition-all duration-700
              ${open ? "opacity-100 scale-100 rounded-[29px]" : "opacity-0 scale-90 pointer-events-none rounded-[47px]"}
            `}
            style={{
              background: "linear-gradient(135deg, #0d1824 0%, #1a2836 100%)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-4xl drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">💙</span>
              <h2
                className="text-[#06b6d4] text-3xl font-bold tracking-wide"
                style={{ textShadow: "0 0 30px rgba(6, 182, 212, 0.8)" }}
              >
                ورود
              </h2>
              <span className="text-4xl drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]">🔐</span>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-red-900/20 border-2 border-red-500/40 rounded-2xl text-red-300 text-center text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="email"
                name="email"
                placeholder="نام کاربری"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 rounded-2xl bg-[#0a1420]/60 border-2 border-[#06b6d4]/30 text-white text-base outline-none focus:border-[#06b6d4] focus:bg-[#0a1420]/80 focus:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all placeholder-gray-500 text-center backdrop-blur-sm"
              />

              <input
                type="password"
                name="password"
                placeholder="رمز عبور"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-5 py-3 rounded-2xl bg-[#0a1420]/60 border-2 border-[#06b6d4]/30 text-white text-base outline-none focus:border-[#06b6d4] focus:bg-[#0a1420]/80 focus:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all placeholder-gray-500 text-center backdrop-blur-sm"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-white font-bold text-lg shadow-lg hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  boxShadow: "0 0 30px rgba(6, 182, 212, 0.5)"
                }}
              >
                {loading ? "⏳ در حال ورود..." : "ورود"}
              </button>
            </form>

            <div className="mt-6 flex justify-between items-center text-sm">
              <a href="/register" className="text-[#f59e0b] hover:text-[#fbbf24] transition-colors font-medium">
                ثبت‌نام
              </a>
              <button href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                رمز عبور را فراموش کردم
              </button>
            </div>
          </div>

          {/* دکمه اولیه (حالت بسته) - ABSOLUTE CENTER */}
          {!open && (
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <span className="text-3xl drop-shadow-[0_0_15px_rgba(6,182,212,0.9)]">💙</span>
              <span
                className="text-[#06b6d4] text-2xl font-bold"
                style={{ textShadow: "0 0 35px rgba(6, 182, 212, 1)" }}
              >
                ورود
              </span>
              <span className="text-3xl drop-shadow-[0_0_15px_rgba(245,158,11,0.9)]">🔐</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
