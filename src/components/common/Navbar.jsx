import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme.jsx'; // ⬅️ import کن
import { useLanguage } from '../../hooks/useLanguage.jsx';

const Navbar = () => { // ⬅️ props رو حذف کن
  const { theme, toggleTheme } = useTheme(); // ⬅️ مستقیم از hook بگیر
  const { language, toggleLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/portfolio', label: t('nav.portfolio') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path) => location.pathname === path;

  // ⬅️ اضافه کردن لاگ برای تست
  const handleThemeClick = () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🖱️ کلیک روی دکمه تم در Navbar!');
    console.log('📌 تم فعلی:', theme);
    console.log('📌 localStorage قبل:', localStorage.getItem('theme'));
    
    toggleTheme();
    
    setTimeout(() => {
      console.log('✅ بعد از toggleTheme:');
      console.log('   - تم جدید:', localStorage.getItem('theme'));
      console.log('   - کلاس dark:', document.documentElement.classList.contains('dark'));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }, 100);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent"
            >
              {t('nav.logo')}
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <motion.span
                  whileHover={{ y: -2 }}
                  className={`text-lg transition-colors ${
                    isActive(link.path)
                      ? 'text-primary-light dark:text-primary-dark font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark'
                  }`}
                >
                  {link.label}
                </motion.span>
              </Link>
            ))}

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleThemeClick} // ⬅️ استفاده از handler جدید
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              type="button" // ⬅️ اضافه کن
            >
              {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
            </motion.button>

            {/* Language Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold"
              type="button"
              aria-label={language === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
            >
              {language === 'fa' ? 'EN' : 'فا'}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleThemeClick} // ⬅️ استفاده از handler جدید
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
              type="button" // ⬅️ اضافه کن
            >
              {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleLanguage}
              className="px-2.5 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold"
              type="button"
              aria-label={language === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
            >
              {language === 'fa' ? 'EN' : 'فا'}
            </motion.button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300"
              type="button" // ⬅️ اضافه کن
            >
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-6"
          >
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(false)}
                  className={`py-3 text-lg transition-colors ${
                    isActive(link.path)
                      ? 'text-primary-light dark:text-primary-dark font-semibold'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {link.label}
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
