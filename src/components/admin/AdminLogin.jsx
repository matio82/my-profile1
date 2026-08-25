import { useState } from 'react';

const AdminLogin = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900"
      >
        <h1 className="mb-1 text-center text-2xl font-bold text-gray-900 dark:text-white">
          ورود به پنل مدیریت
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
          این صفحه فقط برای مدیر سایته
        </p>

        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          نام کاربری
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className="mb-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-light dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />

        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          رمز عبور
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="mb-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-light dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />

        {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r from-primary-light to-secondary-light py-2.5 font-semibold text-white transition-opacity hover:opacity-90"
        >
          ورود
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
