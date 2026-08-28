// این اسکریپت بعد از vite build اجرا می‌شه.
// چون این سایت CSR خالصه (بدون سرور رندرینگ)، همه‌ی مسیرها یک index.html مشترک دارن
// و تگ‌های <head> (عنوان، توضیحات، og:title و ...) فقط بعد از اجرای جاوااسکریپت درست می‌شن.
// گوگل مشکلی با این نداره (چون جاوااسکریپت رو اجرا می‌کنه)، ولی خیلی از پلتفرم‌های
// اشتراک‌گذاری (تلگرام، توییتر، واتساپ، لینکدین) موقع ساخت پیش‌نمایش لینک، جاوااسکریپت
// اجرا نمی‌کنن و فقط HTML خام رو می‌خونن.
//
// این اسکریپت برای هر صفحه/زبان، یک کپی از index.html با تگ‌های <head> درست‌شده
// می‌سازه (dist/portfolio/index.html، dist/en/index.html و ...) تا این پلتفرم‌ها هم
// عنوان و توضیحات درست همون صفحه رو ببینن. باقی سایت (محتوای واقعی صفحه) همچنان
// توسط React/جاوااسکریپت رندر می‌شه؛ این فقط پوسته‌ی HTML اولیه رو برای هر مسیر جدا می‌کنه.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { translations } from '../src/utils/translations.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');
const SITE_URL = 'https://mahdimotee.ir';

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const setTagContent = (html, pattern, newValue) => {
  if (!pattern.test(html)) {
    console.warn(`⚠️  الگو پیدا نشد و رد شد: ${pattern}`);
    return html;
  }
  return html.replace(pattern, (match) => match.replace(/content="[^"]*"/, `content="${escapeHtml(newValue)}"`));
};

const setLinkHref = (html, pattern, newValue) => {
  if (!pattern.test(html)) {
    console.warn(`⚠️  الگو پیدا نشد و رد شد: ${pattern}`);
    return html;
  }
  return html.replace(pattern, (match) => match.replace(/href="[^"]*"/, `href="${escapeHtml(newValue)}"`));
};

const pages = [
  { key: 'home', path: '' },
  { key: 'portfolio', path: 'portfolio' },
  { key: 'contact', path: 'contact' },
];

const baseHtml = readFileSync(join(DIST_DIR, 'index.html'), 'utf-8');

let written = 0;
let skipped = 0;

for (const page of pages) {
  for (const lang of ['fa', 'en']) {
    // نسخه‌ی فارسیِ صفحه‌ی اصلی همون dist/index.html هست که vite build خودش ساخته؛ نیازی به بازنویسی نیست
    if (lang === 'fa' && page.key === 'home') {
      skipped += 1;
      continue;
    }

    const seo = translations[lang]?.seo?.[page.key];
    if (!seo) {
      console.warn(`⚠️  کلید ترجمه پیدا نشد: ${lang}.seo.${page.key}`);
      continue;
    }

    const faPath = page.path ? `/${page.path}` : '/';
    const enPath = page.path ? `/en/${page.path}` : '/en';
    const currentPath = lang === 'fa' ? faPath : enPath;
    const canonical = `${SITE_URL}${currentPath}`;

    let html = baseHtml;
    html = html.replace(/<html lang="[^"]*" dir="[^"]*">/, `<html lang="${lang}" dir="${lang === 'fa' ? 'rtl' : 'ltr'}">`);
    html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(seo.title)}</title>`);
    html = setTagContent(html, /<meta name="description" content="[^"]*"/, seo.description);
    html = setLinkHref(html, /<link rel="canonical" href="[^"]*"/, canonical);
    html = setLinkHref(html, /<link rel="alternate" hreflang="fa" href="[^"]*"/, `${SITE_URL}${faPath}`);
    html = setLinkHref(html, /<link rel="alternate" hreflang="en" href="[^"]*"/, `${SITE_URL}${enPath}`);
    html = setLinkHref(html, /<link rel="alternate" hreflang="x-default" href="[^"]*"/, `${SITE_URL}${faPath}`);
    html = setTagContent(html, /<meta property="og:title" content="[^"]*"/, seo.title);
    html = setTagContent(html, /<meta property="og:description" content="[^"]*"/, seo.description);
    html = setTagContent(html, /<meta property="og:url" content="[^"]*"/, canonical);
    html = setTagContent(html, /<meta property="og:locale" content="[^"]*"/, lang === 'fa' ? 'fa_IR' : 'en_US');
    html = setTagContent(html, /<meta property="og:locale:alternate" content="[^"]*"/, lang === 'fa' ? 'en_US' : 'fa_IR');
    html = setTagContent(html, /<meta name="twitter:title" content="[^"]*"/, seo.title);
    html = setTagContent(html, /<meta name="twitter:description" content="[^"]*"/, seo.description);

    const outDir = lang === 'en' ? join(DIST_DIR, 'en', page.path) : join(DIST_DIR, page.path);
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html, 'utf-8');
    written += 1;
    console.log(`✓ ${currentPath} → ${join(outDir, 'index.html').replace(DIST_DIR, 'dist')}`);
  }
}

console.log(`\nپیش‌رندرِ متا: ${written} صفحه نوشته شد، ${skipped} صفحه (خانه/فارسی) از قبل درست بود.`);
