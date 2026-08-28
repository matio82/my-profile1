import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from './useLanguage.jsx';

const SITE_URL = 'https://mahdimotee.ir';
const EN_PREFIX = '/en';

const toFaPath = (pathname) => {
  if (pathname === EN_PREFIX) return '/';
  if (pathname.startsWith(`${EN_PREFIX}/`)) return pathname.slice(EN_PREFIX.length);
  return pathname;
};

const toEnPath = (pathname) => {
  if (pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`)) return pathname;
  return pathname === '/' ? EN_PREFIX : `${EN_PREFIX}${pathname}`;
};

const setOrCreateMeta = (selector, attr, value) => {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const [, attrName, attrValue] = selector.match(/\[(.+)="(.+)"\]/) || [];
    if (attrName) el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const setOrCreateLink = (rel, hreflang, href) => {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (hreflang) el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  return el;
};

// تنظیم عنوان، توضیحات، canonical و hreflang هر صفحه، هماهنگ با زبان و مسیر فعلی
// این تابع قلب سئوی چندزبانه‌ی سایته: هر صفحه دقیقاً یک نسخه‌ی فارسی و یک نسخه‌ی انگلیسی معرفی می‌کنه
export const usePageSEO = (titleKey, descriptionKey, options = {}) => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const { noindex = false } = options;

  useEffect(() => {
    document.title = t(titleKey);

    setOrCreateMeta('meta[name="description"]', 'content', t(descriptionKey));
    setOrCreateMeta('meta[property="og:title"]', 'content', t(titleKey));
    setOrCreateMeta('meta[property="og:description"]', 'content', t(descriptionKey));
    setOrCreateMeta('meta[property="og:locale"]', 'content', language === 'fa' ? 'fa_IR' : 'en_US');
    setOrCreateMeta('meta[name="twitter:title"]', 'content', t(titleKey));
    setOrCreateMeta('meta[name="twitter:description"]', 'content', t(descriptionKey));
    setOrCreateMeta('meta[name="robots"]', 'content', noindex ? 'noindex, nofollow' : 'index, follow');

    const canonicalUrl = `${SITE_URL}${location.pathname}`;
    setOrCreateLink('canonical', null, canonicalUrl);
    setOrCreateMeta('meta[property="og:url"]', 'content', canonicalUrl);

    // hreflang: به گوگل می‌گیم این صفحه دقیقاً معادل کدوم نسخه‌ی فارسی/انگلیسیه
    const faUrl = `${SITE_URL}${toFaPath(location.pathname)}`;
    const enUrl = `${SITE_URL}${toEnPath(location.pathname)}`;
    setOrCreateLink('alternate', 'fa', faUrl);
    setOrCreateLink('alternate', 'en', enUrl);
    setOrCreateLink('alternate', 'x-default', faUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, titleKey, descriptionKey, location.pathname, noindex]);
};
