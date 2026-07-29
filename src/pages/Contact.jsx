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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
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
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://formspree.io/f/mblqrpzr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: BsTwitterX,
      title: 'توییتر',
      value: 'boy8_iranian',
      href: 'https://x.com/boy8_iranian?t=nIG_MrBFJhi-csTdWuqvBA&s=09',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: FaTelegram,
      title: 'تلگرام',
      value: '@Mm_02_08',
      href: 'https://t.me/Mm_02_08',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaInstagram,
      title: 'اینستاگرام',
      value: '@mahdim.100',
      href: 'https://www.instagram.com/mahdim.110?igsh=N3ViNGhrNGVsc2I=',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="تماس با من"
          subtitle="برای همکاری و پروژه‌های جدید با من در ارتباط باشید"
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
              ارسال پیام
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* نام */}
              <div>
                <label 
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all outline-none"
                  placeholder="نام خود را وارد کنید"
                />
              </div>

              {/* ایمیل */}
              <div>
                <label 
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  ایمیل
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
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
                  پیام
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all outline-none resize-none"
                  placeholder="پیام خود را بنویسید..."
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
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    ارسال پیام
                  </>
                )}
              </button>

              {/* پیام وضعیت */}
              {submitStatus === 'success' && (
                <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 
                              px-4 py-3 rounded-lg text-center">
                  ✅ پیام شما با موفقیت ارسال شد!
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 
                              px-4 py-3 rounded-lg text-center">
                  ❌ خطا در ارسال پیام. لطفاً دوباره تلاش کنید.
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
              راه‌های ارتباطی
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
