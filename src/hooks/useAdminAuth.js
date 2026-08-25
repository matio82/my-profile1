import { useState, useCallback } from 'react';

const CREDENTIALS_KEY = 'admin_credentials';
const SESSION_KEY = 'admin_logged_in';

// نام کاربری و رمز پیش‌فرض. از تب «تنظیمات» توی پنل می‌تونی این‌ها رو عوض کنی.
const DEFAULT_CREDENTIALS = { username: '123456', password: '123456' };

const readCredentials = () => {
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_CREDENTIALS;
  } catch {
    return DEFAULT_CREDENTIALS;
  }
};

export const useAdminAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem(SESSION_KEY) === 'true'
  );
  const [error, setError] = useState('');

  const login = useCallback((username, password) => {
    const creds = readCredentials();
    if (username === creds.username && password === creds.password) {
      localStorage.setItem(SESSION_KEY, 'true');
      setIsLoggedIn(true);
      setError('');
      return true;
    }
    setError('نام کاربری یا رمز عبور اشتباهه.');
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setIsLoggedIn(false);
  }, []);

  const changeCredentials = useCallback((newUsername, newPassword) => {
    localStorage.setItem(
      CREDENTIALS_KEY,
      JSON.stringify({ username: newUsername, password: newPassword })
    );
  }, []);

  return { isLoggedIn, error, login, logout, changeCredentials };
};
