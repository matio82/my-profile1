import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { projects } from '../utils/projectsData';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectFilters from '../components/projects/ProjectFilters';
import SectionTitle from '../components/common/SectionTitle';
import { containerVariants, itemVariants } from '../utils/animations';

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [searchQuery, setSearchQuery] = useState('');

  // استخراج دسته‌بندی‌های یکتا
  const categories = useMemo(() => {
    const uniqueCategories = ['همه'];
    projects.forEach(project => {
      if (project.category && !uniqueCategories.includes(project.category)) {
        uniqueCategories.push(project.category);
      }
    });
    return uniqueCategories;
  }, []);

  // فیلتر پروژه‌ها
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // فیلتر بر اساس دسته‌بندی
      const categoryMatch = selectedCategory === 'همه' || project.category === selectedCategory;
      
      // فیلتر بر اساس جستجو
      const searchMatch = searchQuery === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, searchQuery]);

  // گروه‌بندی پروژه‌های فیلتر شده بر اساس دسته‌بندی
  const groupedProjects = useMemo(() => {
    if (selectedCategory === 'همه') {
      // گروه‌بندی بر اساس دسته‌بندی
      const grouped = {};
      filteredProjects.forEach(project => {
        const category = project.category || 'دیگر';
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(project);
      });
      return grouped;
    } else {
      // فقط یک دسته
      return {
        [selectedCategory]: filteredProjects
      };
    }
  }, [filteredProjects, selectedCategory]);

  return (
    <div className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-12"
        >
          <SectionTitle 
            title="نمونه کارها" 
            subtitle="پروژه‌های انجام شده"
          />
          
          <motion.p 
            variants={itemVariants}
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-4"
          >
            مجموعه‌ای از پروژه‌های موفق که با تکنولوژی‌های روز دنیا پیاده‌سازی شده‌اند
          </motion.p>
        </motion.div>

        {/* Filters */}
        <ProjectFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Projects Grid */}
        <div className="space-y-16">
          {Object.entries(groupedProjects).map(([category, categoryProjects]) => (
            <motion.div
              key={category}
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {/* عنوان دسته‌بندی (فقط در حالت "همه") */}
              {selectedCategory === 'همه' && (
                <motion.h3
                  variants={itemVariants}
                  className="text-2xl font-bold text-gray-800 dark:text-white mb-8 
                           border-r-4 border-blue-500 pr-4"
                >
                  {category}
                </motion.h3>
              )}

              {/* بررسی وجود پروژه */}
              {categoryProjects && categoryProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={itemVariants}
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-12"
                >
                  <p className="text-gray-500 dark:text-gray-400">
                    پروژه‌ای در این دسته یافت نشد
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* پیام خالی بودن نتایج */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              نتیجه‌ای یافت نشد
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              لطفاً فیلترها یا عبارت جستجو را تغییر دهید
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
