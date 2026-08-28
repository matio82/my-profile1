import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { fadeInUp } from '../../utils/animations';
import { useLanguage } from '../../hooks/useLanguage.jsx';

const Hero = () => {
  const { t, buildPath } = useLanguage();
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* خوش آمدید - بدون کادر */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
             
            </span>
          </motion.div>

          {/* نام کامل - هماهنگ با زبان فعلی، برای سئو مهمه که این متن باشه نه فقط MAHDI */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
          >
            {t('hero.name')}
            <span className="sr-only"> — {t('hero.subtitle')}</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link to={buildPath('/portfolio')}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="primary" size="lg">
                  {t('hero.ctaPortfolio')}
                </Button>
              </motion.div>
            </Link>
            <Link to={buildPath('/contact')}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="secondary" size="lg">
                  {t('hero.ctaContact')}
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
