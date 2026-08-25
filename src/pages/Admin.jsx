import { useEffect } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';

const Admin = () => {
  const { isLoggedIn, error, login, logout, changeCredentials } = useAdminAuth();

  // این صفحه نباید توی گوگل ایندکس بشه؛ حتی اگه آدرسش جایی درز کنه
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'پنل مدیریت';

    let metaRobots = document.querySelector('meta[name="robots"]');
    const previousContent = metaRobots ? metaRobots.getAttribute('content') : null;
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');

    return () => {
      document.title = previousTitle;
      if (previousContent !== null) {
        metaRobots.setAttribute('content', previousContent);
      }
    };
  }, []);

  return (
    <div dir="rtl" lang="fa" className="min-h-screen bg-gray-100 font-sans dark:bg-gray-950">
      {isLoggedIn ? (
        <AdminDashboard onLogout={logout} onChangeCredentials={changeCredentials} />
      ) : (
        <AdminLogin onLogin={login} error={error} />
      )}
    </div>
  );
};

export default Admin;
