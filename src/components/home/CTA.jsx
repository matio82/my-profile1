import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage.jsx';

const CTA = () => {
  const { t } = useLanguage();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      rotate: [0, -1, 1, -1, 0],
      transition: {
        duration: 0.3,
        rotate: {
          repeat: Infinity,
          repeatDelay: 1
        }
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 
                 dark:from-blue-800 dark:via-purple-800 dark:to-pink-700
                 relative overflow-hidden"
    >
      {/* افکت پس‌زمینه متحرک */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2
          variants={itemVariants}
          className="text-3xl md:text-5xl font-bold text-white mb-6"
        >
          {t('cta.title')}
        </motion.h2>
        
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto"
        >
          {t('cta.subtitle')}
        </motion.p>

        <motion.div variants={itemVariants}>
          <Link to="/contact">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="px-10 py-5 bg-white dark:bg-gray-900 
                       text-blue-600 dark:text-white font-bold rounded-xl
                       hover:bg-gray-100 dark:hover:bg-gray-800 
                       transition-all duration-300 shadow-2xl
                       border-2 border-white/20
                       relative overflow-hidden group"
            >
              {/* افکت درخشش */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent 
                         via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{
                  x: '100%',
                  transition: { duration: 0.6, repeat: Infinity, repeatDelay: 0.5 }
                }}
              />
              
              <span className="relative z-10 text-lg">
                {t('cta.button')}
              </span>
            </motion.button>
          </Link>
        </motion.div>

        {/* ذرات شناور */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute w-2 h-2 bg-white/40 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default CTA;
