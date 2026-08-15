import { useState, useEffect, useMemo } from "react";

import { Link } from 'react-router-dom';
import axios from "../utils/axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ لیست کامل دسته‌بندی‌ها به صورت ثابت
 const allCategories = useMemo(() => [
  "الکترونیک",
  "پوشاک",
  "کتاب",
  "لوازم خانگی",
  "ورزشی",
  "آرایشی و بهداشتی",
  "اسباب بازی",
  "مواد غذایی",
  "سایر",
], []);


  // آیکون‌های هر دسته
  const categoryIcons = {
    'الکترونیک': '💻',
    'پوشاک': '👕',
    'کتاب': '📚',
    'لوازم خانگی': '🏠',
    'ورزشی': '⚽',
    'آرایشی و بهداشتی': '💄',
    'اسباب بازی': '🧸',
    'مواد غذایی': '🍔',
    'سایر': '📦'
  };

  useEffect(() => {
  const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/products/categories');
        if (data.success && Array.isArray(data.data)) {
          // ✅ ترکیب داده‌های سرور با لیست ثابت
          const merged = Array.from(new Set([...allCategories, ...data.data]));
          setCategories(merged);
        } else {
          setCategories(allCategories);
        }
      } catch (err) {
        console.error('❌ خطا در دریافت دسته‌بندی‌ها:', err);
        setError('خطا در دریافت دسته‌بندی‌ها از سرور');
        setCategories(allCategories);
      } finally {
        setLoading(false);
      }
    };

     fetchCategories();
}, [allCategories]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        fontSize: '24px'
      }}>
        ⏳ در حال بارگذاری دسته‌ها...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#e74c3c',
        fontSize: '18px'
      }}>
        ❌ {error}
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '40px',
        fontSize: '36px',
        background: 'linear-gradient(45deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold'
      }}>
        🏷️ دسته‌بندی محصولات
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '25px'
      }}>
        {categories.map((category) => (
          <Link
            key={category}
            to={`/category/${category}`}
            style={{
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              padding: '40px 20px',
              borderRadius: '20px',
              textAlign: 'center',
              color: 'white',
              fontSize: '22px',
              fontWeight: 'bold',
              boxShadow: '0 10px 25px rgba(102,126,234,0.4)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-7px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(102,126,234,0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(102,126,234,0.4)';
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '10px' }}>
              {categoryIcons[category] || '📦'}
            </div>
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
