// src/components/Sidebar/Sidebar.jsx
import { useEffect, useRef, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const startXRef = useRef(0);

  const [openAccordion, setOpenAccordion] = useState(null);

  // ═══════════════════════════════════════════════════════════
  // 🎯 Effects
  // ═══════════════════════════════════════════════════════════

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // ═══════════════════════════════════════════════════════════
  // 📱 Swipe Handler
  // ═══════════════════════════════════════════════════════════

  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    if (endX - startXRef.current > 100) onClose();
  };

  // ═══════════════════════════════════════════════════════════
  // 🔧 Handlers
  // ═══════════════════════════════════════════════════════════

  const toggleAccordion = (name) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  // ═══════════════════════════════════════════════════════════
  // 📋 Menu Items
  // ═══════════════════════════════════════════════════════════

  const mainMenuItems = [
    { id: 'home', label: 'صفحه اصلی', icon: '🏠', path: '/' },
    { id: 'products', label: 'محصولات', icon: '📦', path: '/products' },
    { id: 'categories', label: 'دسته‌بندی‌ها', icon: '🏷️', path: '/categories' },
    { id: 'cart', label: 'سبد خرید', icon: '🛒', path: '/cart' },
  ];

  // ✅ بروزشده: تنظیمات → اطلاعات من
  const profileMenuItems = [
    { id: 'profile', label: 'اطلاعات من', icon: '👤', path: '/profile' },
    { id: 'my-orders', label: 'سفارشات من', icon: '📋', path: '/my-orders' },
    { id: 'wishlist', label: 'لیست علاقه‌مندی', icon: '❤️', path: '/wishlist' },
  ];

  const adminMenuItems = [
    { id: 'dashboard', label: 'داشبورد', icon: '📊', path: '/admin/dashboard' },
    { id: 'manage-products', label: 'مدیریت محصولات', icon: '📦', path: '/admin/products' },
    { id: 'manage-orders', label: 'مدیریت سفارشات', icon: '📋', path: '/admin/orders' },
    { id: 'manage-users', label: 'مدیریت کاربران', icon: '👥', path: '/admin/users' },
  ];

  // ═══════════════════════════════════════════════════════════
  // 🎨 Render
  // ═══════════════════════════════════════════════════════════

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'sidebar-overlay-visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <aside
        ref={sidebarRef}
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="منوی کناری"
      >
        {/* ═══════ Header ═══════ */}
        <div className="sidebar-header">
          <div className="sidebar-header-content">
            <div className="sidebar-logo">
              <span className="sidebar-logo-icon">🛍️</span>
              <span className="sidebar-logo-text">منوی اصلی</span>
            </div>
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={onClose}
              aria-label="بستن منو"
            >
              <span className="close-icon">✕</span>
            </button>
          </div>
          <div className="sidebar-header-line" />
        </div>

        {/* ═══════ Content ═══════ */}
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            
            {/* ─────────── Main Menu ─────────── */}
            <div className="sidebar-section">
              <span className="sidebar-section-title">ناوبری</span>
              {mainMenuItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`sidebar-link ${location.pathname === item.path ? 'sidebar-link-active' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <span className="sidebar-link-icon">{item.icon}</span>
                  <span className="sidebar-link-text">{item.label}</span>
                  <span className="sidebar-link-arrow">←</span>
                </Link>
              ))}
            </div>

            {/* ─────────── Profile Accordion ─────────── */}
            {user && (
              <div className="sidebar-section">
                <div
                  className={`sidebar-accordion-header ${openAccordion === 'profile' ? 'accordion-open' : ''}`}
                  onClick={() => toggleAccordion('profile')}
                >
                  <div className="accordion-header-content">
                    <span className="sidebar-link-icon">👤</span>
                    <span className="sidebar-link-text">پروفایل من</span>
                  </div>
                  <span className={`accordion-arrow ${openAccordion === 'profile' ? 'arrow-rotated' : ''}`}>
                    ▼
                  </span>
                </div>
                <div className={`sidebar-accordion-content ${openAccordion === 'profile' ? 'accordion-content-open' : ''}`}>
                  {profileMenuItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`sidebar-link sidebar-link-nested ${location.pathname === item.path ? 'sidebar-link-active' : ''}`}
                    >
                      <span className="sidebar-link-icon">{item.icon}</span>
                      <span className="sidebar-link-text">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ─────────── Admin Accordion ─────────── */}
            {user?.isAdmin && (
              <div className="sidebar-section">
                <div
                  className={`sidebar-accordion-header accordion-admin ${openAccordion === 'admin' ? 'accordion-open' : ''}`}
                  onClick={() => toggleAccordion('admin')}
                >
                  <div className="accordion-header-content">
                    <span className="sidebar-link-icon">👑</span>
                    <span className="sidebar-link-text">پنل مدیریت</span>
                  </div>
                  <span className={`accordion-arrow ${openAccordion === 'admin' ? 'arrow-rotated' : ''}`}>
                    ▼
                  </span>
                </div>
                <div className={`sidebar-accordion-content ${openAccordion === 'admin' ? 'accordion-content-open' : ''}`}>
                  {adminMenuItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`sidebar-link sidebar-link-nested sidebar-link-admin ${location.pathname === item.path ? 'sidebar-link-active' : ''}`}
                    >
                      <span className="sidebar-link-icon">{item.icon}</span>
                      <span className="sidebar-link-text">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </nav>
        </div>

        {/* ═══════ Footer ═══════ */}
        <div className="sidebar-footer">
          {user ? (
            <>
              <div className="sidebar-user-info">
                <div className="sidebar-user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="avatar-image" />
                  ) : (
                    user.name?.charAt(0) || user.email?.charAt(0) || '👤'
                  )}
                </div>
                <div className="sidebar-user-details">
                  <span className="sidebar-user-name">
                    {user.name || 'کاربر'}
                    {user.isAdmin && <span className="admin-badge">👑</span>}
                  </span>
                  <span className="sidebar-user-email">{user.email}</span>
                </div>
              </div>
              <button
                type="button"
                className="sidebar-logout-btn"
                onClick={handleLogout}
              >
                <span className="logout-icon">🚪</span>
                <span>خروج از حساب</span>
              </button>
            </>
          ) : (
            <div className="sidebar-auth-buttons">
              <Link to="/login" className="sidebar-auth-btn sidebar-login-btn" onClick={onClose}>
                <span>🔐</span> ورود
              </Link>
              <Link to="/register" className="sidebar-auth-btn sidebar-register-btn" onClick={onClose}>
                <span>📝</span> ثبت‌نام
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
