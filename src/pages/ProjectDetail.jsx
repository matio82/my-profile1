import { Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectDemos } from '../components/projects/demos';
import { useLanguage } from '../hooks/useLanguage.jsx';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { t } = useLanguage();
  const DemoComponent = projectDemos[projectId];

  // اگه پروژه‌ای با این اسم توی registry ثبت نشده باشه
  if (!DemoComponent) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('notFound.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('notFound.description')}
          </p>
          <Link
            to="/portfolio"
            className="inline-block px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('notFound.backHome')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <DemoComponent />
    </Suspense>
  );
};

export default ProjectDetail;
