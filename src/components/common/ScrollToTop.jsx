import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// با هر تغییر مسیر (route)، صفحه رو به بالا اسکرول می‌کنه
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
