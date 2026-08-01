import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // زبان پیش‌فرض انگلیسی است؛ اگر کاربر قبلاً زبانی انتخاب کرده باشد از localStorage خوانده می‌شود
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage === 'fa' || savedLanguage === 'en' ? savedLanguage : 'en';
  });

  // ترجمه بر اساس مسیر نقطه‌ای، مثل t('nav.home')
  const t = (path) => {
    const keys = path.split('.');
    let result = translations[language];
    for (const key of keys) {
      result = result?.[key];
    }
    return result ?? path;
  };

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';

    document.title = t('siteMeta.title');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('siteMeta.description'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'fa' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
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
