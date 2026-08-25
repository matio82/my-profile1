import { useState } from 'react';
import { useArticles } from '../../hooks/useArticles';
import { useLanguage } from '../../hooks/useLanguage.jsx';
import ArticleModal from './ArticleModal';

const Articles = () => {
  const { articles } = useArticles();
  const { t } = useLanguage();
  const [activeArticle, setActiveArticle] = useState(null);

  // اگه هنوز مقاله‌ای اضافه نشده، این بخش اصلاً نمایش داده نمی‌شه
  if (articles.length === 0) return null;

  // لیست رو دوبار تکرار می‌کنیم تا اسکرول بی‌نهایت، بدون پرش، دیده بشه
  const track = [...articles, ...articles];

  return (
    <section className="overflow-hidden bg-white py-20 dark:bg-gray-950">
      <div className="container mx-auto px-4 text-center mb-10">
        <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
          {t('articles.title')}
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          {t('articles.subtitle')}
        </p>
      </div>

      <div className="relative">
        <div dir="ltr" className="marquee-track flex w-max gap-6 px-4">
          {track.map((article, index) => (
            <button
              key={`${article.id}-${index}`}
              type="button"
              dir="auto"
              onClick={() => setActiveArticle(article)}
              className="w-80 flex-shrink-0 text-start rounded-xl bg-gray-50 p-6 shadow-lg transition-shadow duration-300 hover:shadow-2xl dark:bg-gray-900"
            >
              <span className="mb-3 inline-block rounded-full bg-primary-light/10 px-3 py-1 text-xs font-semibold text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark">
                {t('articles.badge')}
              </span>
              <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 dark:text-white">
                {article.title}
              </h3>
              <p className="mb-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                {article.excerpt}
              </p>
              <span className="text-sm font-medium text-primary-light dark:text-primary-dark">
                {t('articles.readMore')}
              </span>
            </button>
          ))}
        </div>
        {/* گرادیان محو در دو طرف برای حس بهتر اسکرول */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent dark:from-gray-950" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent dark:from-gray-950" />
      </div>

      {activeArticle && (
        <ArticleModal article={activeArticle} onClose={() => setActiveArticle(null)} />
      )}
    </section>
  );
};

export default Articles;
