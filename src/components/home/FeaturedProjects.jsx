import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { containerVariants, itemVariants } from '../../utils/animations';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage.jsx';

const FeaturedProjects = () => {
  const { t } = useLanguage();
  // تعریف دستی داده پروژه کافه
  const featuredProjects = [
    {
      id: 'cafe',
      title: t('featuredProjects.cafe.title'),
      description: t('featuredProjects.cafe.description'),
      image: '/images/projects/cafe-project.jpg',
      technologies: ['React', 'Tailwind CSS', 'Formspree'],
      github: 'https://github.com/yourusername/cafe-project', // آدرس گیت‌هاب واقعی رو بذار
      demo: '/projects/cafe' // مسیر داخلی به صفحه پروژه کافه
    }
  ];

  return (
    <section className="py-20 bg-light-bg dark:bg-dark-bg">
      <div className="container mx-auto px-4">
        {/* عنوان بخش */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4 text-light-text dark:text-dark-text">
            {t('featuredProjects.title')}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-400 text-lg">
            {t('featuredProjects.subtitle')}
          </motion.p>
        </motion.div>

        {/* کارت پروژه کافه */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* تصویر */}
              <div className="relative h-48 overflow-hidden">
                <img src={project.image} alt={project.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* محتوای کارت */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">
                    <FiGithub size={20} /> <span>{t('featuredProjects.code')}</span>
                  </a>
                  <Link
  to="/projects/cafe"
  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
>
  <FiExternalLink size={20} />
  <span>{t('featuredProjects.viewProject')}</span>
</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
