import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTelegram, FaEnvelope } from 'react-icons/fa';
import { SOCIAL_LINKS } from '../../utils/constants';
import { fadeInUp, staggerContainer } from '../../utils/animations';

const SocialLinks = () => {
  const socialIcons = {
    github: FaGithub,
    linkedin: FaLinkedin,
    telegram: FaTelegram,
    email: FaEnvelope,
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="space-y-6"
    >
      <motion.h3
        variants={fadeInUp}
        className="text-2xl font-bold text-gray-800 dark:text-white mb-6"
      >
        راه‌های ارتباطی
      </motion.h3>
      {SOCIAL_LINKS.map((link) => {
        const Icon = socialIcons[link.id];
        return (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            variants={fadeInUp}
            whileHover={{ x: -10 }}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all group"
          >
            <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Icon size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white">
                {link.label}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {link.url.replace('https://', '').replace('mailto:', '')}
              </p>
            </div>
          </motion.a>
        );
      })}
    </motion.div>
  );
};

export default SocialLinks;
