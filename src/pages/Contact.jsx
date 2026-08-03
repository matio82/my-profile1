import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEnvelope, 
  FaTelegram, 
  FaInstagram, 
  FaPaperPlane 
} from 'react-icons/fa';
import SectionTitle from '../components/common/SectionTitle';
import { BsTwitterX } from 'react-icons/bs';
import { useLanguage } from '../hooks/useLanguage.jsx';
<<<<<<< HEAD

const Contact = () => {
=======
import { usePageSEO } from '../hooks/usePageSEO';

const Contact = () => {
  usePageSEO('seo.contact.title', 'seo.contact.description');
>>>>>>> 3b0d91b88cc1854f75fc962963c58609507843a4
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    _gotcha: '' // فیلد تله برای بات‌ها؛ کاربر واقعی هرگز اینو پر نمی‌کنه
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // اگه فیلد تله پر شده باشه یعنی احتمالاً یه بات فرم رو پر کرده، ساکت رد می‌کنیم
    if (formData._gotcha) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/mblqrpzr';
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '', _gotcha: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: BsTwitterX,
      title: t('contact.methodTitles.twitter'),
      value: 'boy8_iranian',
      href: 'https://x.com/boy8_iranian?t=nIG_MrBFJhi-csTdWuqvBA&s=09',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: FaTelegram,
      title: t('contact.methodTitles.telegram'),
      value: '@Mm_02_08',
      href: 'https://t.me/Mm_02_08',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaInstagram,
      title: t('contact.methodTitles.instagram'),
      value: '@mahdim.100',
      href: 'https://www.instagram.com/mahdim.110?igsh=N3ViNGhrNGVsc2I=',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={t('contact.title')}
          subtitle={t('contact.subtitle')}
<<<<<<< HEAD
=======
          level="h1"
>>>>>>> 3b0d91b88cc1854f75fc962963c58609507843a4
        />

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* فرم تماس */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('contact.form.sendMessage')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* فیلد تله ضد اسپم - برای کاربر واقعی مخفیه */}
              <input
                type="text"
                name="_gotcha"
                value={formData._gotcha}
                onChange={handleChange}
                tabIndex="-1"
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
              />

              {/* نام */}
              <div>
                <label 
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all outline-none"
                  placeholder={t('contact.form.namePlaceholder')}
                />
              </div>

              {/* ایمیل */}
              <div>
                <label 
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={254}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all outline-none"
                  placeholder="example@email.com"
                />
              </div>

              {/* پیام */}
              <div>
                <label 
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  maxLength={5000}
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all outline-none resize-none"
                  placeholder={t('contact.form.messagePlaceholder')}
                />
              </div>

              {/* دکمه ارسال */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                         hover:from-blue-700 hover:to-purple-700
                         text-white font-semibold py-3 px-6 rounded-lg
                         transform hover:scale-105 transition-all duration-300
                         flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    {t('contact.form.submitting')}
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    {t('contact.form.submit')}
                  </>
                )}
              </button>

              {/* پیام وضعیت */}
              {submitStatus === 'success' && (
                <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 
                              px-4 py-3 rounded-lg text-center">
                  {t('contact.form.success')}
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 
                              px-4 py-3 rounded-lg text-center">
                  {t('contact.form.error')}
                </div>
              )}
            </form>
          </motion.div>

          {/* راه‌های ارتباطی */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {t('contact.methods')}
            </h3>

            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6
                         hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${method.color} 
                                flex items-center justify-center text-white text-2xl
                                group-hover:scale-110 transition-transform`}>
                    <method.icon />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {method.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {method.value}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
