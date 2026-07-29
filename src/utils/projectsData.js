export const projects = [
  {
    id: 1,
    title: "فروشگاه آنلاین",
    description: "یک فروشگاه کامل با React و Node.js با قابلیت مدیریت محصولات، سبد خرید و پرداخت آنلاین",
    image: "/images/projects/project1.jpg",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    github: "https://github.com/yourusername/project1",
    demo: "https://project1.demo.com",
    category: "fullstack"
  },
  {
    id: 2,
    title: "داشبورد مدیریتی",
    description: "پنل ادمین پیشرفته با نمودارها و گزارش‌های تحلیلی برای مدیریت کسب‌وکار",
    image: "/images/projects/project2.jpg",
    technologies: ["React", "Chart.js", "Material-UI", "Firebase"],
    github: "https://github.com/yourusername/project2",
    demo: "https://project2.demo.com",
    category: "frontend"
  },
  {
    id: 3,
    title: "اپلیکیشن آب‌وهوا",
    description: "نمایش وضعیت آب‌وهوا با استفاده از API با طراحی زیبا و انیمیشن‌های جذاب",
    image: "/images/projects/project3.jpg",
    technologies: ["React", "OpenWeather API", "Framer Motion"],
    github: "https://github.com/yourusername/project3",
    demo: "https://project3.demo.com",
    category: "frontend"
  },
  {
    id: 4,
    title: "سیستم احراز هویت",
    description: "سیستم کامل ثبت‌نام، ورود و مدیریت کاربران با امنیت بالا",
    image: "/images/projects/project4.jpg",
    technologies: ["Node.js", "Express", "JWT", "bcrypt", "PostgreSQL"],
    github: "https://github.com/yourusername/project4",
    demo: "https://project4.demo.com",
    category: "backend"
  },
  {
    id: 5,
    title: "وبلاگ شخصی",
    description: "وبلاگ با قابلیت مدیریت مقالات، کامنت‌گذاری و جستجوی پیشرفته",
    image: "/images/projects/project5.jpg",
    technologies: ["Next.js", "MDX", "Tailwind CSS", "Vercel"],
    github: "https://github.com/yourusername/project5",
    demo: "https://project5.demo.com",
    category: "fullstack"
  },
  {
    id: 6,
    title: "سیستم سفارش کافه گاف",
    description: "سیستم سفارش‌گیری آنلاین کافه با امکان انتخاب منو و ارسال سفارش",
    image: "/images/projects/cafe-project.jpg",
    technologies: ["React", "JavaScript", "Formspree", "Tailwind CSS"],
    github: null,
    demo: "/projects/cafe",
    category: "fullstack",
    isInternal: true
  }
];

export const categories = [
  { id: "all", name: "همه", icon: "🌟" },
  { id: "frontend", name: "فرانت‌اند", icon: "🎨" },
  { id: "backend", name: "بک‌اند", icon: "⚙️" },
  { id: "fullstack", name: "فول‌استک", icon: "🚀" }
];
