import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { useTheme } from './hooks/useTheme.jsx';
import HexagonalBackground from './components/HexagonalBackground';
import CafeProject from "./components/projects/CafeProject";

function App() {
  const { theme } = useTheme();

  // اعمال تم به HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      {/* پس‌زمینه در پشت همه چیز */}
      <HexagonalBackground />
      <ScrollToTop />

      {/* محتوای اصلی با position: relative */}
      <div className="relative bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/projects/cafe" element={<CafeProject />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
