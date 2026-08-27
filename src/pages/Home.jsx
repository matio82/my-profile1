import Hero from '../components/home/Hero';
import Articles from '../components/home/Articles';
import About from '../components/home/About';
import FeaturedProjects from '../components/home/FeaturedProjects';
import CTA from '../components/home/CTA';
import { usePageSEO } from '../hooks/usePageSEO';

const Home = () => {
  usePageSEO('seo.home.title', 'seo.home.description');
  return (
    <div className="relative">
      <Hero />
      <Articles />
      <About />
      <FeaturedProjects />
      <CTA />
    </div>
  );
};

export default Home;
