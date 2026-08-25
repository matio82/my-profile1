import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';
import { useTheme } from './hooks/useTheme.jsx';
import HexagonalBackground from './components/HexagonalBackground';

// چیدمان سایت عمومی: پس‌زمینه + نوبار + فوتر
// پنل مدیریت (/admin) عمداً از این چیدمان جداست تا شبیه سایت عمومی نباشه
function PublicLayout() {
  return (
    <>
      <HexagonalBackground />
      <div className="relative bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

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
      <ScrollToTop />
      <Routes>
        {/* پنل مدیریت: جدا از چیدمان عمومی سایت، بدون نوبار/فوتر */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
