import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "../utils/axios";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlistIds, setWishlistIds] = useState(new Set()); // برای چک سریع

  // ═══════════════════════════════════════════════════════════
  // 🔑 تابع برای گرفتن توکن و ساخت config
  // ═══════════════════════════════════════════════════════════
  const getAxiosConfig = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // ═══════════════════════════════════════════════════════════
  // 📋 دریافت لیست علاقه‌مندی‌ها
  // ═══════════════════════════════════════════════════════════
  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlistItems([]);
      setWishlistIds(new Set());
      return;
    }

    console.log("💖 [fetchWishlist] در حال دریافت...");

    try {
      const config = getAxiosConfig();
      if (!config) return;

      const res = await axios.get("/wishlist", config);

      console.log("✅ [fetchWishlist] دریافت شد:", res.data);
      
      const products = res.data.products || [];
      setWishlistItems(products);
      
      // ساخت Set از ID ها برای چک سریع
      const ids = new Set(products.map(item => item.product?._id));
      setWishlistIds(ids);

    } catch (error) {
      console.error("❌ [fetchWishlist] خطا:", error.response?.data || error.message);
    }
  }, [user]);

  // ═══════════════════════════════════════════════════════════
  // 🔄 Toggle - افزودن/حذف
  // ═══════════════════════════════════════════════════════════
  const toggleWishlist = async (productId) => {
    if (!user) {
      alert("لطفاً ابتدا وارد شوید");
      return { success: false, message: "لطفاً ابتدا وارد شوید" };
    }

    setLoading(true);
    console.log("🔄 [toggleWishlist]:", productId);

    try {
      const config = getAxiosConfig();
      if (!config) throw new Error("توکن یافت نشد");

      const res = await axios.post("/wishlist/toggle", { productId }, config);

      console.log("✅ [toggleWishlist]:", res.data);

      const products = res.data.products || [];
      setWishlistItems(products);

      const ids = new Set(products.map(item => item.product?._id));
      setWishlistIds(ids);

      return { 
        success: true, 
        action: res.data.action,
        message: res.data.message 
      };

    } catch (error) {
      console.error("❌ [toggleWishlist] خطا:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "خطا در پردازش"
      };
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // ➕ افزودن به wishlist
  // ═══════════════════════════════════════════════════════════
  const addToWishlist = async (productId) => {
    if (!user) {
      alert("لطفاً ابتدا وارد شوید");
      return { success: false };
    }

    setLoading(true);

    try {
      const config = getAxiosConfig();
      if (!config) throw new Error("توکن یافت نشد");

      const res = await axios.post("/wishlist", { productId }, config);

      const products = res.data.products || [];
      setWishlistItems(products);

      const ids = new Set(products.map(item => item.product?._id));
      setWishlistIds(ids);

      return { success: true, message: res.data.message };

    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "خطا در افزودن"
      };
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // 🗑️ حذف از wishlist
  // ═══════════════════════════════════════════════════════════
  const removeFromWishlist = async (productId) => {
    if (!user) return { success: false };

    setLoading(true);

    try {
      const config = getAxiosConfig();
      if (!config) throw new Error("توکن یافت نشد");

      const res = await axios.delete(`/wishlist/${productId}`, config);

      const products = res.data.products || [];
      setWishlistItems(products);

      const ids = new Set(products.map(item => item.product?._id));
      setWishlistIds(ids);

      return { success: true };

    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "خطا در حذف"
      };
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // ✅ چک کردن وجود در wishlist (سریع - بدون API)
  // ═══════════════════════════════════════════════════════════
  const isInWishlist = (productId) => {
    return wishlistIds.has(productId);
  };

  // ═══════════════════════════════════════════════════════════
  // 🧹 پاک کردن کل لیست
  // ═══════════════════════════════════════════════════════════
  const clearWishlist = async () => {
    if (!user) return { success: false };

    setLoading(true);

    try {
      const config = getAxiosConfig();
      if (!config) throw new Error("توکن یافت نشد");

      await axios.delete("/wishlist/clear", config);

      setWishlistItems([]);
      setWishlistIds(new Set());

      return { success: true };

    } catch (error) {
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // 🔢 تعداد آیتم‌ها
  // ═══════════════════════════════════════════════════════════
  const getWishlistCount = () => wishlistItems.length;

  // ═══════════════════════════════════════════════════════════
  // 🔄 دریافت هنگام لود یا تغییر کاربر
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
      setWishlistIds(new Set());
    }
  }, [user, fetchWishlist]);

  // ═══════════════════════════════════════════════════════════
  // 📤 ارائه Context
  // ═══════════════════════════════════════════════════════════
  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        getWishlistCount
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// Custom Hook
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export default WishlistContext;
