import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaTelegram } from 'react-icons/fa';
import { fadeInUp } from '../../utils/animations';
import { SITE_INFO } from '../../utils/constants';

const QuickContact = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="container mx-auto text-center">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
            آماده همکاری هستید؟
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            اگر پروژه‌ای دارید یا می‌خواهید همکاری کنیم، خوشحال می‌شم باهاتون در ارتباط باشم!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <FaEnvelope />
                ارسال پیام
              </motion.button>
            </Link>
            <motion.a
              href={`mailto:${SITE_INFO.email}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
            >
              <FaTelegram />
              تماس مستقیم
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuickContact;
