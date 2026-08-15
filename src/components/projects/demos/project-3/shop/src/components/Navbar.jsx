// src/components/Navbar.jsx
import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import MiniCart from './MiniCart/MiniCart';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  // ==================== Context ====================
  const { cartItems, getCartItemsCount } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // ==================== State ====================
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const blurTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  // ==================== تعداد واقعی سبد خرید ====================
  const cartCount = getCartItemsCount ? getCartItemsCount() : (cartItems?.length || 0);

  // ==================== Scroll Handler ====================
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ==================== Escape Key Handler ====================
  useEffect(() => {
    if (!isSearchOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSearchValue('');
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // ==================== Click Outside Handler ====================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsWishlistOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // ==================== Cleanup ====================
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  // ==================== Search Functions ====================
  const openSearch = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setIsSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSearchFocus = () => openSearch();

  const handleSearchBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      if (!searchValue.trim()) {
        setIsSearchOpen(false);
      }
    }, 120);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchValue.trim();
    if (!query) {
      setIsSearchOpen(false);
      return;
    }
    console.info('[Navbar] search query:', query);
  };

  // ==================== Sidebar Functions ====================
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  // ==================== Action Handlers ====================
  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setIsWishlistOpen(!isWishlistOpen);
    setIsNotificationsOpen(false);
  };

  const handleNotificationsClick = (e) => {
    e.stopPropagation();
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsWishlistOpen(false);
  };

  const handleCartClick = () => {
    setIsMiniCartOpen(true);
    setIsWishlistOpen(false);
    setIsNotificationsOpen(false);
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <header 
        className={`
          fixed top-0 left-0 right-0 z-40 
          transition-all duration-500 ease-out
          ${isScrolled 
            ? 'bg-[hsl(var(--card))]/80 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-[hsl(var(--border))]/50' 
            : 'bg-transparent'
          }
        `}
      >
        {/* Gradient Line */}
        <span 
          className="absolute top-0 left-0 right-0 h-[2px] opacity-80"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--neon-blue)), hsl(var(--neon-pink)), hsl(var(--neon-purple)), hsl(var(--neon-blue)))',
            backgroundSize: '300% 100%',
            animation: 'gradient-shift 4s ease infinite'
          }}
          aria-hidden="true" 
        />

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-18">
            
            {/* ==================== Right Section ==================== */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Hamburger Button */}
              <button
                type="button"
                className="
                  p-2.5 rounded-xl
                  bg-[hsl(var(--muted))]/50 hover:bg-[hsl(var(--muted))]
                  border border-[hsl(var(--border))]/50 hover:border-[hsl(var(--neon-blue))]/50
                  transition-all duration-300
                  hover:shadow-[0_0_20px_hsl(var(--neon-blue)/0.2)]
                  group
                "
                aria-label="باز کردن منو"
                aria-expanded={isSidebarOpen}
                onClick={openSidebar}
              >
                <MenuIcon className="w-5 h-5 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--neon-blue))] transition-colors" />
              </button>

              {/* Brand */}
              <Link to="/" className="flex items-center gap-2.5 group" aria-label="بازگشت به صفحه اصلی">
                <span className="relative">
                  {/* Pulse Effect */}
                  <span 
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--neon-blue)), hsl(var(--neon-pink)))',
                      filter: 'blur(8px)',
                      animation: 'glow-pulse 2s ease-in-out infinite'
                    }}
                    aria-hidden="true" 
                  />
                  <span 
                    className="relative w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--neon-blue)), hsl(var(--neon-pink)))' }}
                  >
                    <SparklesIcon className="w-5 h-5 text-white" />
                  </span>
                </span>
                <span className="hidden sm:flex flex-col">
                  <span className="text-lg font-black tracking-tight leading-none">
                    <span className="text-[hsl(var(--foreground))]">Mart</span>
                    <span 
                      className="bg-clip-text text-transparent"
                      style={{ backgroundImage: 'linear-gradient(135deg, hsl(var(--neon-blue)), hsl(var(--neon-pink)))' }}
                    >
                      Neo
                    </span>
                  </span>
                  <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-medium">
                    خرید هوشمندانه
                  </span>
                </span>
              </Link>
            </div>

            {/* ==================== Center Section (Search) ==================== */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <form role="search" onSubmit={handleSearchSubmit}>
                <div 
                  className={`
                    relative flex items-center rounded-xl overflow-hidden
                    transition-all duration-300
                    ${isSearchOpen || searchValue 
                      ? 'bg-[hsl(var(--card))] border-[hsl(var(--neon-blue))]/50 shadow-[0_0_20px_hsl(var(--neon-blue)/0.15)]' 
                      : 'bg-[hsl(var(--muted))]/50 border-[hsl(var(--border))]/50'
                    }
                    border
                  `}
                >
                  <button
                    type="button"
                    className="p-3 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--neon-blue))] transition-colors"
                    aria-label="باز کردن سرچ"
                    onClick={openSearch}
                  >
                    <SearchIcon className="w-5 h-5" />
                  </button>
                  <input
                    ref={inputRef}
                    type="text"
                    className={`
                      flex-1 bg-transparent border-none outline-none
                      text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))]
                      text-sm py-3 pr-0 pl-3
                      transition-all duration-300
                      ${isSearchOpen || searchValue ? 'w-full opacity-100' : 'w-0 opacity-0'}
                    `}
                    placeholder="به دنبال چه محصولی هستی؟"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                  />
                  {(isSearchOpen || searchValue) && (
                    <button 
                      type="submit" 
                      className="p-3 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--neon-blue))] transition-colors"
                      aria-label="جست‌وجو"
                    >
                      <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* ==================== Left Section (Actions) ==================== */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Wishlist Button */}
              <div className="dropdown-container relative hidden md:block">
                <button
                  type="button"
                  className={`
                    p-2.5 rounded-xl
                    transition-all duration-300
                    ${isWishlistOpen 
                      ? 'bg-[hsl(var(--neon-pink))]/20 border-[hsl(var(--neon-pink))]/50 text-[hsl(var(--neon-pink))]' 
                      : 'bg-[hsl(var(--muted))]/50 border-[hsl(var(--border))]/50 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--neon-pink))] hover:border-[hsl(var(--neon-pink))]/50'
                    }
                    border
                    hover:shadow-[0_0_20px_hsl(var(--neon-pink)/0.2)]
                  `}
                  aria-label="لیست علاقه‌مندی"
                  onClick={handleWishlistClick}
                >
                  <HeartIcon className="w-5 h-5" />
                </button>

                {/* Wishlist Dropdown */}
                {isWishlistOpen && (
                  <div 
                    className="
                      absolute top-full left-0 mt-2 w-72
                      bg-[hsl(var(--card))]/95 backdrop-blur-xl
                      border border-[hsl(var(--border))]/50
                      rounded-2xl shadow-2xl shadow-black/20
                      overflow-hidden z-50
                    "
                  >
                    <div className="flex items-center gap-2 p-4 border-b border-[hsl(var(--border))]/50">
                      <HeartIcon className="w-5 h-5 text-[hsl(var(--neon-pink))]" />
                      <span className="font-bold text-[hsl(var(--foreground))]">لیست علاقه‌مندی</span>
                    </div>
                    <div className="p-6 text-center">
                      <span className="text-4xl mb-3 block">💖</span>
                      <p className="text-[hsl(var(--muted-foreground))] text-sm mb-4">لیست علاقه‌مندی شما خالی است</p>
                      <Link 
                        to="/products" 
                        className="
                          inline-block px-4 py-2 rounded-lg text-sm font-medium
                          bg-[hsl(var(--neon-pink))]/20 text-[hsl(var(--neon-pink))]
                          hover:bg-[hsl(var(--neon-pink))]/30 transition-colors
                        "
                        onClick={() => setIsWishlistOpen(false)}
                      >
                        مشاهده محصولات
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications Button */}
              <div className="dropdown-container relative hidden md:block">
                <button
                  type="button"
                  className={`
                    p-2.5 rounded-xl
                    transition-all duration-300
                    ${isNotificationsOpen 
                      ? 'bg-[hsl(var(--neon-purple))]/20 border-[hsl(var(--neon-purple))]/50 text-[hsl(var(--neon-purple))]' 
                      : 'bg-[hsl(var(--muted))]/50 border-[hsl(var(--border))]/50 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--neon-purple))] hover:border-[hsl(var(--neon-purple))]/50'
                    }
                    border
                    hover:shadow-[0_0_20px_hsl(var(--neon-purple)/0.2)]
                  `}
                  aria-label="اعلان‌ها"
                  onClick={handleNotificationsClick}
                >
                  <BellIcon className="w-5 h-5" />
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div 
                    className="
                      absolute top-full left-0 mt-2 w-72
                      bg-[hsl(var(--card))]/95 backdrop-blur-xl
                      border border-[hsl(var(--border))]/50
                      rounded-2xl shadow-2xl shadow-black/20
                      overflow-hidden z-50
                    "
                  >
                    <div className="flex items-center gap-2 p-4 border-b border-[hsl(var(--border))]/50">
                      <BellIcon className="w-5 h-5 text-[hsl(var(--neon-purple))]" />
                      <span className="font-bold text-[hsl(var(--foreground))]">اعلان‌ها</span>
                    </div>
                    <div className="p-6 text-center">
                      <span className="text-4xl mb-3 block">🔔</span>
                      <p className="text-[hsl(var(--muted-foreground))] text-sm">اعلان جدیدی ندارید</p>
                    </div>
                  </div>
                )}
              </div>

              {/* User Button */}
              {user ? (
                <Link 
                  to="/my-orders" 
                  className="
                    hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl
                    bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))]/50
                    text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--neon-cyan))]
                    hover:border-[hsl(var(--neon-cyan))]/50
                    hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.2)]
                    transition-all duration-300
                  "
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">{user.name?.split(' ')[0] || 'حساب من'}</span>
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="
                    hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl
                    bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))]/50
                    text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--neon-cyan))]
                    hover:border-[hsl(var(--neon-cyan))]/50
                    hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.2)]
                    transition-all duration-300
                  "
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">ورود</span>
                </Link>
              )}

              {/* Cart Button */}
              <button
                type="button"
                className="
                  relative p-2.5 rounded-xl
                  bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))]/50
                  text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--neon-blue))]
                  hover:border-[hsl(var(--neon-blue))]/50
                  hover:shadow-[0_0_20px_hsl(var(--neon-blue)/0.2)]
                  transition-all duration-300
                "
                aria-label="سبد خرید"
                onClick={handleCartClick}
              >
                <BagIcon className="w-5 h-5" />
                {cartCount > 0 && (
                  <span 
                    className="
                      absolute -top-1.5 -right-1.5 
                      min-w-[20px] h-5 px-1.5
                      flex items-center justify-center
                      text-xs font-bold text-white
                      rounded-full
                    "
                    style={{ 
                      background: 'linear-gradient(135deg, hsl(var(--neon-blue)), hsl(var(--neon-pink)))',
                      boxShadow: '0 0 10px hsl(var(--neon-pink) / 0.5)'
                    }}
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mini Cart Drawer */}
      <MiniCart
        isOpen={isMiniCartOpen}
        onClose={() => setIsMiniCartOpen(false)}
      />

      {/* Custom Styles */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
    </>
  );
};

export default Navbar;

// ============================================================
// 🎨 SVG Icons
// ============================================================

function MenuIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function SparklesIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
      <path d="M19 12l1 2 1-2 2-1-2-1-1-2-1 2-2 1 2 1z" />
    </svg>
  );
}

function SearchIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}

function ArrowLeftIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function HeartIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.8 4.6a5.3 5.3 0 0 0-7.5.2L12 6.2l-1.3-1.4a5.3 5.3 0 0 0-7.5-.2 5.4 5.4 0 0 0-.1 7.6l8.2 8.3 8.2-8.3a5.4 5.4 0 0 0 .1-7.6Z" />
    </svg>
  );
}

function BellIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function BagIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 7h12l1 12H5L6 7Z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function UserIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}