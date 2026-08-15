// src/context/CartContext.js
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from "../utils/axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ═══════════════════════════════════════════════════════════
  // 🔑 تابع برای گرفتن توکن و ساخت config
  // ═══════════════════════════════════════════════════════════
  const getAxiosConfig = () => {
    const token = localStorage.getItem("token");
    
    console.log("🔑 [CartContext] توکن:", token ? "✅ موجود" : "❌ ندارد");
    
    if (!token) {
      console.error("❌ توکن در localStorage یافت نشد!");
      return null;
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // ═══════════════════════════════════════════════════════════
  // 📦 دریافت سبد خرید
  // ═══════════════════════════════════════════════════════════
  const fetchCart = useCallback(async () => {
    if (!user) {
      console.log("⚠️ کاربر وارد نشده - سبد خالی می‌شود");
      setCartItems([]);
      return;
    }

    console.log("📦 [fetchCart] در حال دریافت سبد...");
    
    try {
      const config = getAxiosConfig();
      
      if (!config) {
        console.error("❌ config نامعتبر است!");
        return;
      }

      console.log("📤 [fetchCart] ارسال GET /cart");
      
      const res = await axios.get("/cart", config);
      
      console.log("✅ [fetchCart] سبد دریافت شد:", res.data);
      setCartItems(res.data.items || []);
    } catch (error) {
      console.error("❌ [fetchCart] خطا:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        fullError: error.response?.data
      });
      
      if (error.response?.status === 401) {
        console.log("🔐 خطای احراز هویت - توکن نامعتبر است");
        localStorage.removeItem("token");
        setCartItems([]);
        
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    }
  }, [user]);

  // ═══════════════════════════════════════════════════════════
  // ➕ افزودن به سبد خرید
  // ═══════════════════════════════════════════════════════════
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      alert("لطفاً ابتدا وارد شوید");
      return { success: false, message: "لطفاً ابتدا وارد شوید" };
    }

    setLoading(true);
    console.log("➕ [addToCart] افزودن محصول:", { productId, quantity });
    
    try {
      const config = getAxiosConfig();
      
      if (!config) {
        throw new Error("توکن یافت نشد");
      }

      console.log("📤 [addToCart] ارسال POST /cart");
      
      const res = await axios.post(
        "/cart",
        { productId, quantity },
        config
      );
      
      console.log("✅ [addToCart] محصول به سبد اضافه شد:", res.data);
      setCartItems(res.data.items || []);
      return { success: true, data: res.data };
    } catch (error) {
      console.error("❌ [addToCart] خطا:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "خطا در افزودن محصول"
      };
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // 🗑️ حذف از سبد خرید
  // ═══════════════════════════════════════════════════════════
  const removeFromCart = async (productId) => {
    if (!user) {
      return { success: false, message: "لطفاً ابتدا وارد شوید" };
    }

    setLoading(true);
    console.log("🗑️ [removeFromCart] حذف محصول:", productId);
    
    try {
      const config = getAxiosConfig();
      
      if (!config) {
        throw new Error("توکن یافت نشد");
      }

      const res = await axios.delete(`/cart/${productId}`, config);
      
      console.log("✅ [removeFromCart] محصول از سبد حذف شد");
      setCartItems(res.data.items || []);
      return { success: true };
    } catch (error) {
      console.error("❌ [removeFromCart] خطا:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "خطا در حذف محصول"
      };
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // 🔄 به‌روزرسانی تعداد
  // ═══════════════════════════════════════════════════════════
  const updateQuantity = async (productId, quantity) => {
    if (!user) {
      return { success: false, message: "لطفاً ابتدا وارد شوید" };
    }

    // اگر تعداد صفر یا کمتر شد، حذف کن
    if (quantity < 1) {
      return removeFromCart(productId);
    }

    setLoading(true);
    console.log("🔄 [updateQuantity] بروزرسانی تعداد:", { productId, quantity });
    
    try {
      const config = getAxiosConfig();
      
      if (!config) {
        throw new Error("توکن یافت نشد");
      }

      const res = await axios.put(
        `/cart/${productId}`,
        { quantity },
        config
      );
      
      console.log("✅ [updateQuantity] تعداد به‌روزرسانی شد");
      setCartItems(res.data.items || []);
      return { success: true };
    } catch (error) {
      console.error("❌ [updateQuantity] خطا:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "خطا در به‌روزرسانی"
      };
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // 🧹 خالی کردن سبد
  // ═══════════════════════════════════════════════════════════
  const clearCart = async () => {
    if (!user) {
      return { success: false, message: "لطفاً ابتدا وارد شوید" };
    }

    setLoading(true);
    console.log("🧹 [clearCart] خالی کردن سبد...");
    
    try {
      const config = getAxiosConfig();
      
      if (!config) {
        throw new Error("توکن یافت نشد");
      }

      await axios.delete("/cart", config);
      console.log("✅ [clearCart] سبد خالی شد");
      setCartItems([]);
      return { success: true };
    } catch (error) {
      console.error("❌ [clearCart] خطا:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "خطا در خالی کردن سبد"
      };
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // 💰 محاسبه قیمت نهایی هر آیتم (با در نظر گرفتن تخفیف)
  // ═══════════════════════════════════════════════════════════
  const getItemFinalPrice = (item) => {
    const product = item.product;
    if (!product) return 0;
    
    // اگر discountPrice داره و کمتر از price هست
    if (product.discountPrice && product.discountPrice < product.price) {
      return product.discountPrice;
    }
    return product.price || 0;
  };

  // ═══════════════════════════════════════════════════════════
  // 💵 محاسبه مجموع قیمت سبد (با تخفیف)
  // ═══════════════════════════════════════════════════════════
  const getTotalPrice = () => {
    const total = cartItems.reduce((sum, item) => {
      const finalPrice = getItemFinalPrice(item);
      return sum + (finalPrice * item.quantity);
    }, 0);
    
    return total;
  };

  // ═══════════════════════════════════════════════════════════
  // 🎁 محاسبه مجموع صرفه‌جویی از تخفیف‌ها
  // ═══════════════════════════════════════════════════════════
  const getTotalSavings = () => {
    const savings = cartItems.reduce((sum, item) => {
      const product = item.product;
      if (!product) return sum;
      
      // اگر تخفیف دارد
      if (product.discountPrice && product.discountPrice < product.price) {
        const savedPerItem = product.price - product.discountPrice;
        return sum + (savedPerItem * item.quantity);
      }
      return sum;
    }, 0);
    
    return savings;
  };

  // ═══════════════════════════════════════════════════════════
  // 📊 محاسبه قیمت اصلی (بدون تخفیف) - برای نمایش مقایسه
  // ═══════════════════════════════════════════════════════════
  const getOriginalTotalPrice = () => {
    const total = cartItems.reduce((sum, item) => {
      const product = item.product;
      if (!product) return sum;
      return sum + ((product.price || 0) * item.quantity);
    }, 0);
    
    return total;
  };

  // ═══════════════════════════════════════════════════════════
  // 🔢 تعداد کل آیتم‌های سبد
  // ═══════════════════════════════════════════════════════════
  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // ═══════════════════════════════════════════════════════════
  // 🔄 دریافت سبد هنگام لود شدن یا تغییر کاربر
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (user) {
      console.log("👤 کاربر تغییر کرد، دریافت سبد...");
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user, fetchCart]);

  // ═══════════════════════════════════════════════════════════
  // 📤 ارائه Context
  // ═══════════════════════════════════════════════════════════
  return (
    <CartContext.Provider
      value={{
        // State
        cartItems,
        loading,
        
        // Actions
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        
        // Calculations (با پشتیبانی تخفیف)
        getTotalPrice,
        getTotalSavings,
        getOriginalTotalPrice,
        getCartItemsCount,
        getItemFinalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ═══════════════════════════════════════════════════════════
// 🎣 Custom Hook برای استفاده آسان‌تر
// ═══════════════════════════════════════════════════════════
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
