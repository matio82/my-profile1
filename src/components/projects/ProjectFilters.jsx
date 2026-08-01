import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { useLanguage } from '../../hooks/useLanguage.jsx';

const ProjectFilters = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  searchQuery,
  onSearchChange 
}) => {
  const { t } = useLanguage();
  return (
    <div className="mb-12 space-y-6">
      {/* دسته‌بندی‌ها */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category)}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300
              ${selectedCategory === category
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            {t(`portfolio.categories.${category}`)}
          </motion.button>
        ))}
      </div>

      {/* جستجو */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('portfolio.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pr-12 pl-4 py-3 rounded-full bg-white dark:bg-gray-800 
                     text-gray-800 dark:text-white border-2 border-gray-200 
                     dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 
                     focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* نمایش تعداد نتایج */}
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">
          {selectedCategory === 'all'
            ? t('portfolio.allProjects')
            : `${t('portfolio.categoryLabel')}: ${t(`portfolio.categories.${selectedCategory}`)}`}
        </p>
      </div>
    </div>
  );
};

export default ProjectFilters;
