# Mahdi's Portfolio

A personal portfolio website for a frontend developer & UI/UX designer, built with React, Vite, and Tailwind CSS. Fully bilingual (English / Persian) with automatic RTL/LTR layout switching, and a light/dark theme toggle.

🔗 **Live site:** [mahdimotee.ir](https://mahdimotee.ir)

## Features

- 🌐 **Bilingual (EN/FA)** — one-click language switch, with correct `dir`/`lang` handling for RTL Persian and LTR English
- 🌓 **Light / dark theme** toggle, persisted across visits
- 📱 Fully responsive layout
- 🗂️ **Portfolio** page with search and category filtering
- ✉️ **Contact form** (via [Formspree](https://formspree.io))
- 🔍 Basic SEO: per-page titles/descriptions, `sitemap.xml`, `robots.txt`, JSON-LD structured data, Open Graph & Twitter Card tags
- 🛡️ Error boundary with a friendly fallback screen, and a proper 404 page

## Tech Stack

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Three.js](https://threejs.org/) (background effects)

## Getting Started

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# build for production
npm run build

# preview the production build locally
npm run preview
```

## Configuration

Copy `.env.example` to `.env` if you want to override the Formspree contact-form endpoint:

```bash
cp .env.example .env
```

## Before deploying

Live at **mahdimotee.ir** ✅ — `index.html`, `robots.txt`, and `sitemap.xml` already point to this domain.

One placeholder still needs a real value:

- `src/components/home/FeaturedProjects.jsx` — the `github` link for the cafe project currently points to a placeholder `yourusername` URL

## Project Structure

```
src/
├── components/
│   ├── common/       # Navbar, Footer, SectionTitle, ErrorBoundary, etc.
│   ├── home/          # Hero, About, CTA, FeaturedProjects
│   └── projects/      # Portfolio project cards/filters + the Cafe demo project
├── hooks/             # useTheme, useLanguage, usePageSEO
├── pages/             # Home, Portfolio, Contact, NotFound
└── utils/             # translations, projectsData, constants, animations
```

## License

Personal project — all rights reserved.
