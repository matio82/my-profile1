// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isTokenValid } = useContext(AuthContext);

  console.log('🔐 ProtectedRoute - user:', user);
  console.log('🔐 ProtectedRoute - loading:', loading);

  // ✅ صبر برای بارگذاری
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        <p>⏳ در حال بررسی احراز هویت...</p>
      </div>
    );
  }

  // ✅ بررسی لاگین و اعتبار توکن
  if (!user || !isTokenValid()) {
    console.log('❌ کاربر لاگین نکرده یا توکن نامعتبر - هدایت به /login');
    return <Navigate to="/login" replace />;
  }

  // ✅ اگر همه چی اوکی بود، محتوا رو نشون بده
  console.log('✅ دسترسی مجاز - نمایش محتوا');
  return children;
};

export default ProtectedRoute;
