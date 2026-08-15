// src/components/RequireAdmin.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RequireAdmin = ({ children }) => {
  const { user, loading, isTokenValid } = useContext(AuthContext);

  console.log('👑 RequireAdmin - user:', user);
  console.log('👑 RequireAdmin - isAdmin:', user?.isAdmin);

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
        <p>⏳ در حال بررسی دسترسی ادمین...</p>
      </div>
    );
  }

  // ✅ اگر لاگین نکرده، برو صفحه لاگین
  if (!user || !isTokenValid()) {
    console.log('❌ کاربر لاگین نکرده - هدایت به /login');
    return <Navigate to="/login" replace />;
  }

  // ✅ اگر لاگین کرده ولی ادمین نیست، برو صفحه اصلی
  if (!user.isAdmin) {
    console.log('⛔ کاربر ادمین نیست - هدایت به /');
    return <Navigate to="/" replace />;
  }

  // ✅ اگر ادمین هست، نمایش محتوا
  console.log('✅ دسترسی ادمین تایید شد - نمایش پنل ادمین');
  return children;
};

export default RequireAdmin;
