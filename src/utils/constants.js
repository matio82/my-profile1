import { translations } from './translations';

export const SITE_INFO = {
  name: { en: translations.en.siteInfo.name, fa: translations.fa.siteInfo.name },
  title: { en: translations.en.siteInfo.title, fa: translations.fa.siteInfo.title },
  description: { en: translations.en.siteInfo.description, fa: translations.fa.siteInfo.description },
  email: 'mahdimotee8@gmail.com',
  phone: '+98 910 996 8286',
  location: { en: translations.en.siteInfo.location, fa: translations.fa.siteInfo.location },
  
  social: {
    github: 'https://github.com/matio82',
    linkedin: 'https://linkedin.com/in/REPLACE_ME', // TODO: آیدی واقعی لینکدین رو جایگزین کن
    telegram: 'https://t.me/Mm_02_08',
    instagram: 'https://www.instagram.com/mahdim.110',
    twitter: 'https://x.com/boy8_iranian',
  },
  
  skills: [
    { name: 'React', level: 90, category: 'frontend' },
    { name: 'Vue.js', level: 85, category: 'frontend' },
    { name: 'JavaScript', level: 95, category: 'frontend' },
    { name: 'TypeScript', level: 80, category: 'frontend' },
    { name: 'Tailwind CSS', level: 90, category: 'frontend' },
    { name: 'UI/UX Design', level: 85, category: 'design' },
    { name: 'Figma', level: 80, category: 'design' },
    { name: 'WordPress', level: 88, category: 'cms' },
    { name: 'Android', level: 75, category: 'mobile' },
    { name: 'Git', level: 85, category: 'tools' },
  ],
};
