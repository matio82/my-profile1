import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage.jsx';
import { usePageSEO } from '../hooks/usePageSEO';

const NotFound = () => {
  const { t } = useLanguage();
  usePageSEO('notFound.title', 'notFound.description');

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('notFound.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t('notFound.description')}
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
