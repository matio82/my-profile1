import { FaGithub, FaTelegram, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useLanguage } from '../../hooks/useLanguage.jsx';
import { SITE_INFO } from '../../utils/constants';

const Footer = () => {
  const { t } = useLanguage();
  const socialLinks = [
    {
      icon: FaGithub,
      href: SITE_INFO.social.github,
      label: 'GitHub'
    },
    {
      icon: FaTelegram,
      href: SITE_INFO.social.telegram,
      label: 'Telegram'
    },
    {
      icon: FaInstagram,
      href: SITE_INFO.social.instagram,
      label: 'Instagram'
    },
    {
      icon: FaLinkedin,
      href: SITE_INFO.social.linkedin,
      label: 'LinkedIn'
    }
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* کپی‌رایت */}
          <div className="text-center md:text-right">
            <p className="text-gray-400">
              © {new Date().getFullYear()} {t('footer.rights')}
            </p>
          </div>

          {/* شبکه‌های اجتماعی */}
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full 
                         bg-gray-800 hover:bg-blue-600 transition-colors duration-300"
                aria-label={social.label}
              >
                <social.icon className="text-xl" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
