// frontend/src/utils/axios.js
import axios from 'axios';

// ======================================
// 🔧 تنظیم آدرس API بر اساس محیط
// ======================================

// در Production از متغیر محیطی استفاده می‌شود
// در Development از localhost استفاده می‌شود
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// فقط در Development لاگ بزن
if (process.env.NODE_ENV === 'development') {
  console.log('🔗 Axios Base URL:', API_URL);
}

// ======================================
// 🏗️ ساخت Instance از Axios
// ======================================
const instance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // برای ارسال کوکی‌ها (اگر نیاز باشد)
});

// ======================================
// 📤 Interceptor برای درخواست‌ها
// ======================================
instance.interceptors.request.use(
  (config) => {
    // اضافه کردن توکن به هر درخواست
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // لاگ فقط در Development
    if (process.env.NODE_ENV === 'development') {
      console.log('📤 درخواست:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ خطا در درخواست:', error);
    }
    return Promise.reject(error);
  }
);

// ======================================
// 📥 Interceptor برای پاسخ‌ها
// ======================================
instance.interceptors.response.use(
  (response) => {
    // لاگ فقط در Development
    if (process.env.NODE_ENV === 'development') {
      console.log('📥 پاسخ:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    // لاگ خطا فقط در Development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ خطا در پاسخ:', error.message);

      if (error.response) {
        console.error('📛 وضعیت:', error.response.status);
        console.error('📛 پیام:', error.response.data);
      } else if (error.request) {
        console.error('🔌 سرور پاسخ نمی‌دهد');
      } else {
        console.error('⚠️ خطا:', error.message);
      }
    }

    // ======================================
    // 🔐 مدیریت خطای 401 (Unauthorized)
    // ======================================
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // فقط اگر در صفحه login نیستیم، ریدایرکت کن
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/auth')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
