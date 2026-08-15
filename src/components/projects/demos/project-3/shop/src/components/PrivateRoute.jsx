import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  console.log("🔐 PrivateRoute - user:", user);
  console.log("🔐 PrivateRoute - loading:", loading);

  // صبر برای بارگذاری
  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}>
        <p>در حال بررسی احراز هویت...</p>
      </div>
    );
  }

  // اگر کاربر لاگین نکرده، هدایت به صفحه لاگین
  if (!user) {
    console.log("❌ کاربر لاگین نکرده - هدایت به /login");
    return <Navigate to="/login" replace />;
  }

  // اگر لاگین کرده، نمایش محتوا
  return children;
}

export default PrivateRoute;
