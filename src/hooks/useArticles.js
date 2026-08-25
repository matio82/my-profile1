import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'site_articles';

// دو مقاله‌ی نمونه که فقط بار اولی که هیچی ذخیره نشده نمایش داده می‌شن.
// از تب «مقالات» توی پنل مدیریت (/admin) می‌تونی این‌ها رو حذف و مقاله‌های واقعی اضافه کنی.
const SEED_ARTICLES = [
  {
    id: 'seed-1',
    title: 'به بخش مقالات خوش اومدید',
    content:
      'این یک مقاله‌ی نمونه‌ست که فقط برای نشون‌دادن شکل ظاهری این بخش قرار داده شده. برای مدیریت مقالات، وارد پنل مدیریت به آدرس /admin بشو و از تب «مقالات» می‌تونی این مقاله‌ی نمونه رو حذف کنی و مقاله‌های واقعی خودت رو اضافه کنی.',
    excerpt:
      'این یک مقاله‌ی نمونه‌ست. از پنل مدیریت می‌تونی این رو حذف کنی و مقاله‌های واقعی خودت رو اضافه کنی.',
    date: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    title: 'نکاتی درباره‌ی توسعه فرانت‌اند',
    content:
      'این هم یک مقاله‌ی نمونه‌ی دیگه‌ست تا ببینی چند تا کارت کنار هم چه شکلی می‌شن. متن کامل مقاله همین‌جا نمایش داده می‌شه؛ هرچقدر طولانی‌تر بنویسی، همین‌جا کامل و خوانا نمایش داده می‌شه.',
    excerpt: 'مثالی دیگه از یک کارت مقاله برای اینکه ببینی چند تا کارت کنار هم چه شکلی می‌شن.',
    date: new Date().toISOString(),
  },
];

const readFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return SEED_ARTICLES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeToStorage = (articles) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch {
    // اگه localStorage پر یا غیرفعال باشه، فقط از ذخیره‌سازی صرف‌نظر می‌کنیم
  }
};

export const useArticles = () => {
  const [articles, setArticles] = useState(readFromStorage);

  // هماهنگ‌سازی وقتی چند تب باز باشه (مثلاً پنل مدیریت یه تب و صفحه اصلی یه تب دیگه)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setArticles(readFromStorage());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const persist = useCallback((next) => {
    setArticles(next);
    writeToStorage(next);
  }, []);

  const addArticle = useCallback(
    (title, content) => {
      const trimmedContent = content.trim();
      const excerpt =
        trimmedContent.length > 140 ? `${trimmedContent.slice(0, 140).trim()}…` : trimmedContent;
      const newArticle = {
        id: Date.now().toString(),
        title: title.trim(),
        content: trimmedContent,
        excerpt,
        date: new Date().toISOString(),
      };
      persist([newArticle, ...articles]);
    },
    [articles, persist]
  );

  const deleteArticle = useCallback(
    (id) => {
      persist(articles.filter((a) => a.id !== id));
    },
    [articles, persist]
  );

  return { articles, addArticle, deleteArticle };
};
