import { translations } from './translations';

export const projects = [
  {
    id: 1,
    title: { en: 'MartNeo - Online Store', fa: 'مارت‌نئو - فروشگاه آنلاین' },
    description: { en: translations.en.projects[1].description, fa: translations.fa.projects[1].description },
    image: "/images/projects/project1.jpg",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    github: "https://github.com/matio82/e-shop-frontend",
    demo: "/projects/eshop",
    category: "fullstack",
    isInternal: true
  },
  {
    id: 6,
    title: { en: translations.en.projects[6].title, fa: translations.fa.projects[6].title },
    description: { en: translations.en.projects[6].description, fa: translations.fa.projects[6].description },
    image: "/images/projects/cafe-project.jpg",
    technologies: ["React", "JavaScript", "Formspree", "Tailwind CSS"],
    github: null,
    demo: "/projects/cafe",
    category: "fullstack",
    isInternal: true
  }
];

export const categories = [
  { id: "all", name: { en: "All", fa: "همه" }, icon: "🌟" },
  { id: "frontend", name: { en: "Frontend", fa: "فرانت‌اند" }, icon: "🎨" },
  { id: "backend", name: { en: "Backend", fa: "بک‌اند" }, icon: "⚙️" },
  { id: "fullstack", name: { en: "Full Stack", fa: "فول‌استک" }, icon: "🚀" }
];
