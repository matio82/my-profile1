import { motion } from 'framer-motion';
import SectionTitle from '../common/SectionTitle';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import { useLanguage } from '../../hooks/useLanguage.jsx';

const About = () => {
  const { t } = useLanguage();
  const skills = [
    {
      category: 'Frontend Development',
      items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS'],
      icon: '💻'
    },
    {
      category: 'UI/UX Design',
      items: ['Figma', 'Adobe XD', 'Responsive Design', 'User Research'],
      icon: '🎨'
    },
    {
      category: 'WordPress',
      items: ['Theme Development', 'Plugin Customization', 'WooCommerce', 'Elementor'],
      icon: '📦'
    },
    {
      category: 'Translation',
      items: ['English ↔ Persian', 'Technical Translation', 'Localization'],
      icon: '🌐'
    },
    {
      category: 'Android Development',
      items: ['Java', 'Kotlin', 'Android Studio', 'Material Design'],
      icon: '📱'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={t('about.title')}
          subtitle={t('about.subtitle')}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-4xl mb-4">{skill.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {skill.category}
              </h3>
              <ul className="space-y-2">
                {skill.items.map((item, i) => (
                  <li
                    key={i}
                    className="text-gray-600 dark:text-gray-400 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-primary-light dark:bg-primary-dark rounded-full"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
