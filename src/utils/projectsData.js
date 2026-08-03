import { translations } from './translations';

<<<<<<< HEAD
=======
// ⚠️ TODO: لینک‌های گیت‌هاب پروژه‌ها (github) الان placeholder هستن ("yourusername") — قبل از پابلیش با آدرس واقعی ریپوهاتون جایگزین کنید
>>>>>>> 3b0d91b88cc1854f75fc962963c58609507843a4
export const projects = [
  {
    id: 1,
    title: { en: translations.en.projects[1].title, fa: translations.fa.projects[1].title },
    description: { en: translations.en.projects[1].description, fa: translations.fa.projects[1].description },
    image: "/images/projects/project1.jpg",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    github: "https://github.com/yourusername/project1",
    demo: "https://project1.demo.com",
    category: "fullstack"
  },
  {
    id: 2,
    title: { en: translations.en.projects[2].title, fa: translations.fa.projects[2].title },
    description: { en: translations.en.projects[2].description, fa: translations.fa.projects[2].description },
    image: "/images/projects/project2.jpg",
    technologies: ["React", "Chart.js", "Material-UI", "Firebase"],
    github: "https://github.com/matio82/project2",
    demo: "https://project2.demo.com",
    category: "frontend"
  },
  {
    id: 3,
    title: { en: translations.en.projects[3].title, fa: translations.fa.projects[3].title },
    description: { en: translations.en.projects[3].description, fa: translations.fa.projects[3].description },
    image: "/images/projects/project3.jpg",
    technologies: ["React", "OpenWeather API", "Framer Motion"],
    github: "https://github.com/matio82/project3",
    demo: "https://project3.demo.com",
    category: "frontend"
  },
  {
    id: 4,
    title: { en: translations.en.projects[4].title, fa: translations.fa.projects[4].title },
    description: { en: translations.en.projects[4].description, fa: translations.fa.projects[4].description },
    image: "/images/projects/project4.jpg",
    technologies: ["Node.js", "Express", "JWT", "bcrypt", "PostgreSQL"],
    github: "https://github.com/matio82/project4",
    demo: "https://project4.demo.com",
    category: "backend"
  },
  {
    id: 5,
    title: { en: translations.en.projects[5].title, fa: translations.fa.projects[5].title },
    description: { en: translations.en.projects[5].description, fa: translations.fa.projects[5].description },
    image: "/images/projects/project5.jpg",
    technologies: ["Next.js", "MDX", "Tailwind CSS", "Vercel"],
    github: "https://github.com/matio82/project5",
    demo: "https://project5.demo.com",
    category: "fullstack"
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
