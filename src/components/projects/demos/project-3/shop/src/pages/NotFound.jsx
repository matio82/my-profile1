// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '100px 20px',
      fontFamily: 'Vazir, Arial'
    }}>
      <h1 style={{ fontSize: '120px', margin: '0' }}>404</h1>
      <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>
        صفحه مورد نظر یافت نشد
      </h2>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        متاسفانه صفحه‌ای که دنبال آن هستید وجود ندارد.
      </p>
      <Link 
        to="/" 
        style={{
          display: 'inline-block',
          padding: '12px 30px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontSize: '16px'
        }}
      >
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
};

export default NotFound;
