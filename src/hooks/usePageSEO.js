import { useEffect } from 'react';
import { useLanguage } from './useLanguage.jsx';

// تنظیم عنوان و توضیحات هر صفحه، هماهنگ با زبان فعلی
export const usePageSEO = (titleKey, descriptionKey) => {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = t(titleKey);
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t(descriptionKey));
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', t(titleKey));
    }
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', t(descriptionKey));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, titleKey, descriptionKey]);
};
