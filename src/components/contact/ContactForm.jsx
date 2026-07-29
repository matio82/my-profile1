import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import { fadeInUp } from '../../utils/animations';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/mnnzdaob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <motion.form
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* نام */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
          نام و نام خانوادگی
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* ایمیل */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
          ایمیل
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* موضوع */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
          موضوع
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* پیام */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
          پیام
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      {/* دکمه ارسال */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={status === 'sending'}
        className="w-full px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {status === 'sending' ? 'در حال ارسال...' : 'ارسال پیام'}
        <FaPaperPlane />
      </motion.button>

      {/* پیام وضعیت */}
      {status === 'success' && (
        <p className="text-green-600 dark:text-green-400 text-center font-semibold">
          پیام شما با موفقیت ارسال شد!
        </p>
      )}
      {status === 'error' && (
        <p className="text-red-600 dark:text-red-400 text-center font-semibold">
          خطا در ارسال پیام. لطفاً دوباره تلاش کنید.
        </p>
      )}
    </motion.form>
  );
};

export default ContactForm;
