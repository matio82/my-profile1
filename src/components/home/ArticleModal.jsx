import { useEffect } from 'react';

const ArticleModal = ({ article, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        dir="auto"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-900"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{article.title}</h3>
          <button
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-700 dark:hover:text-white"
            aria-label="close"
            type="button"
          >
            ✕
          </button>
        </div>
        <p className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300">
          {article.content}
        </p>
      </div>
    </div>
  );
};

export default ArticleModal;
