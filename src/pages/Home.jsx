import Hero from '../components/home/Hero';
import Articles from '../components/home/Articles';
import About from '../components/home/About';
import FeaturedProjects from '../components/home/FeaturedProjects';
import CTA from '../components/home/CTA';
import MagneticBackground from '../components/common/MagneticBackground';
import { usePageSEO } from '../hooks/usePageSEO';

const Home = () => {
  usePageSEO('seo.home.title', 'seo.home.description');
  return (
    <div className="relative">
      {/* پس‌زمینه مغناطیسی برای کل صفحه */}
      <MagneticBackground />
      
      {/* محتوای صفحه */}
      <div className="relative z-10">
        <Hero />
        <Articles />
        <About />
        <FeaturedProjects />
        <CTA />
      </div>
    </div>
  );
};

export default Home;