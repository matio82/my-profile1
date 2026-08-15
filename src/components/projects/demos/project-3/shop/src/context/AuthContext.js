import { createContext, useState, useEffect } from 'react';

import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔄 بررسی توکن در localStorage...");
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("🔓 توکن decode شد:", decoded);

        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          console.log("⏰ توکن منقضی شده است");
          localStorage.removeItem("token");
          setUser(null);
        } else {
          console.log("✅ توکن معتبر است");
          setUser({
            _id: decoded._id,
            name: decoded.name,
            email: decoded.email,
            phone: decoded.phone,
            isAdmin: decoded.isAdmin || false, // ✅ اضافه شد
          });
        }
      } catch (error) {
        console.error("❌ خطا در decode توکن:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      console.log("⚠️ توکن وجود ندارد");
    }

    setLoading(false);
  }, []);

  const login = (token, userData) => {
    console.log("🔐 ورود کاربر با توکن:", token);
    localStorage.setItem("token", token);
    setUser({
      ...userData,
      isAdmin: userData.isAdmin || false, // ✅ اضافه شد
    });
  };

  const logout = () => {
    console.log("🚪 خروج کاربر");
    localStorage.removeItem("token");
    setUser(null);
  };

  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp && decoded.exp > currentTime;
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isTokenValid }}>
      {children}
    </AuthContext.Provider>
  );
};
