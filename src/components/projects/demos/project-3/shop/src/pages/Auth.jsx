// src/pages/Auth.jsx
import React, { useState, useContext } from "react";
import axios from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Auth() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // ========== STATE ==========
  const [activeForm, setActiveForm] = useState(null); // null | 'login' | 'register'
  const [isAnimating, setIsAnimating] = useState(false);

  // Login Form
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  // Register Form
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ========== HANDLERS ==========
  const handleOpenForm = (formType) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setError("");
    
    setTimeout(() => {
      setActiveForm(formType);
      setIsAnimating(false);
    }, 300);
  };

  const handleCloseForm = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      setActiveForm(null);
      setIsAnimating(false);
      setError("");
    }, 300);
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  // ========== LOGIN SUBMIT ==========
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", loginData);

      if (res.data.token) {
        login(res.data.token, {
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          role: res.data.role,
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

  // ========== REGISTER SUBMIT ==========
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/auth/register", registerData);
      alert("✅ ثبت‌نام موفقیت‌آمیز! لطفاً وارد شوید.");
      setActiveForm('login');
      setRegisterData({ name: "", email: "", password: "", phone: "" });
    } catch (err) {
      setError(err.response?.data?.message || "خطا در ثبت‌نام");
    } finally {
      setLoading(false);
    }
  };

  // ========== RENDER ==========
  return (
    <div className="auth-page">
      {/* ==================== دو دکمه اولیه ==================== */}
      <div className={`auth-buttons-container ${activeForm ? 'hidden' : ''}`}>
        
        {/* دکمه ثبت‌نام - چپ */}
        <div
          className={`auth-button register-button ${isAnimating && activeForm === 'register' ? 'expanding' : ''}`}
          onClick={() => handleOpenForm('register')}
        >
          <span className="button-icon">💚</span>
          <span className="button-text">ثبت‌نام</span>
          <span className="button-icon">📝</span>
        </div>

        {/* دکمه ورود - راست */}
        <div
          className={`auth-button login-button ${isAnimating && activeForm === 'login' ? 'expanding' : ''}`}
          onClick={() => handleOpenForm('login')}
        >
          <span className="button-icon">💙</span>
          <span className="button-text">ورود</span>
          <span className="button-icon">🔐</span>
        </div>
      </div>

      {/* ==================== فرم ورود ==================== */}
      <div className={`auth-form-container login-form-container ${activeForm === 'login' ? 'active' : ''}`}>
        <div className="auth-form-box login-box">
          {/* دکمه بستن */}
          <button className="close-button" onClick={handleCloseForm}>
            ✕
          </button>

          {/* هدر */}
          <div className="form-header">
            <span className="header-icon">💙</span>
            <h2 className="form-title login-title">ورود</h2>
            <span className="header-icon">🔐</span>
          </div>

          {/* خطا */}
          {error && activeForm === 'login' && (
            <div className="error-message">{error}</div>
          )}

          {/* فرم */}
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="ایمیل"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                className="auth-input login-input"
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="رمز عبور"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                minLength={6}
                className="auth-input login-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-button login-submit"
            >
              {loading ? "⏳ در حال ورود..." : "ورود"}
            </button>
          </form>

          {/* لینک‌ها */}
          <div className="form-footer">
            <button 
              type="button"
              className="switch-form-btn"
              onClick={() => {
                setActiveForm('register');
                setError("");
              }}
            >
              حساب ندارید؟ <span className="highlight-green">ثبت‌نام</span>
            </button>
            <button type="button" className="forgot-password-btn">
              رمز عبور را فراموش کردم
            </button>
          </div>
        </div>
      </div>

      {/* ==================== فرم ثبت‌نام ==================== */}
      <div className={`auth-form-container register-form-container ${activeForm === 'register' ? 'active' : ''}`}>
        <div className="auth-form-box register-box">
          {/* دکمه بستن */}
          <button className="close-button close-green" onClick={handleCloseForm}>
            ✕
          </button>

          {/* هدر */}
          <div className="form-header">
            <span className="header-icon">💚</span>
            <h2 className="form-title register-title">ثبت‌نام</h2>
            <span className="header-icon">📝</span>
          </div>

          {/* خطا */}
          {error && activeForm === 'register' && (
            <div className="error-message">{error}</div>
          )}

          {/* فرم */}
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="نام و نام خانوادگی"
                value={registerData.name}
                onChange={handleRegisterChange}
                required
                className="auth-input register-input"
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="ایمیل"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
                className="auth-input register-input"
              />
            </div>

            <div className="input-group">
              <input
                type="tel"
                name="phone"
                placeholder="شماره تلفن"
                value={registerData.phone}
                onChange={handleRegisterChange}
                required
                className="auth-input register-input"
                dir="ltr"
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="رمز عبور"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
                minLength={6}
                className="auth-input register-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-button register-submit"
            >
              {loading ? "⏳ در حال ثبت‌نام..." : "ثبت‌نام"}
            </button>
          </form>

          {/* لینک‌ها */}
          <div className="form-footer">
            <button 
              type="button"
              className="switch-form-btn"
              onClick={() => {
                setActiveForm('login');
                setError("");
              }}
            >
              حساب دارید؟ <span className="highlight-blue">ورود</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
