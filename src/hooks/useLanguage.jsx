import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

const EN_PREFIX = '/en';

// مسیر فارسی معادل یک مسیر (پیشوند /en رو حذف می‌کنه)
const toFaPath = (pathname) => {
  if (pathname === EN_PREFIX) return '/';
  if (pathname.startsWith(`${EN_PREFIX}/`)) return pathname.slice(EN_PREFIX.length);
  return pathname;
};

// مسیر انگلیسی معادل یک مسیر (پیشوند /en رو اضافه می‌کنه)
const toEnPath = (pathname) => {
  if (pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`)) return pathname;
  return pathname === '/' ? EN_PREFIX : `${EN_PREFIX}${pathname}`;
};

export const LanguageProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // زبان همیشه از روی مسیر URL تعیین می‌شه، نه از localStorage
  // این برای سئو حیاتیه: هر آدرس باید همیشه همون زبان رو نشون بده (هم برای کاربر، هم برای گوگل)
  const language = useMemo(
    () => (location.pathname === EN_PREFIX || location.pathname.startsWith(`${EN_PREFIX}/`) ? 'en' : 'fa'),
    [location.pathname]
  );

  const t = (path) => {
    const keys = path.split('.');
    let result = translations[language];
    for (const key of keys) {
      result = result?.[key];
    }
    return result ?? path;
  };

  // مسیر داخلی رو با توجه به زبان فعلی می‌سازه؛ همه‌ی لینک‌های داخلی سایت باید از این استفاده کنن
  const buildPath = (path) => (language === 'en' ? toEnPath(path) : path);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
  }, [language]);

  const toggleLanguage = () => {
    const target = language === 'fa' ? toEnPath(location.pathname) : toFaPath(location.pathname);
    navigate(`${target}${location.search}`);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, buildPath, toFaPath, toEnPath }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
