import { useState } from 'react';
import { useArticles } from '../../hooks/useArticles';

const inputClass =
  'w-full mb-4 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light';

const AdminDashboard = ({ onLogout, onChangeCredentials }) => {
  const [tab, setTab] = useState('articles');
  const { articles, addArticle, deleteArticle } = useArticles();

  // --- فرم اضافه‌کردن مقاله ---
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [addedMsg, setAddedMsg] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    addArticle(title, content);
    setTitle('');
    setContent('');
    setAddedMsg('مقاله اضافه شد و همین الان توی صفحه اصلی نمایش داده می‌شه.');
    setTimeout(() => setAddedMsg(''), 4000);
  };

  // --- فرم تغییر نام کاربری/رمز ---
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsMsg, setSettingsMsg] = useState('');
  const [settingsError, setSettingsError] = useState('');

  const handleChangeCredentials = (e) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsMsg('');
    if (!newUsername.trim() || !newPassword.trim()) {
      setSettingsError('نام کاربری و رمز عبور نباید خالی باشن.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setSettingsError('تکرار رمز عبور با رمز عبور یکی نیست.');
      return;
    }
    onChangeCredentials(newUsername.trim(), newPassword.trim());
    setSettingsMsg('نام کاربری و رمز عبور تغییر کرد. دفعه‌ی بعد با اطلاعات جدید وارد شو.');
    setNewUsername('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">پنل مدیریت</h1>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          خروج
        </button>
      </div>

      <div className="mb-8 flex gap-2 border-b border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => setTab('articles')}
          className={`border-b-2 px-4 py-2 font-medium transition-colors ${
            tab === 'articles'
              ? 'border-primary-light text-primary-light dark:border-primary-dark dark:text-primary-dark'
              : 'border-transparent text-gray-500 dark:text-gray-400'
          }`}
        >
          مقالات
        </button>
        <button
          type="button"
          onClick={() => setTab('settings')}
          className={`border-b-2 px-4 py-2 font-medium transition-colors ${
            tab === 'settings'
              ? 'border-primary-light text-primary-light dark:border-primary-dark dark:text-primary-dark'
              : 'border-transparent text-gray-500 dark:text-gray-400'
          }`}
        >
          تنظیمات
        </button>
      </div>

      {tab === 'articles' && (
        <div>
          <form onSubmit={handleAdd} className="mb-8 rounded-2xl bg-white p-6 shadow dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              اضافه‌کردن مقاله‌ی جدید
            </h2>

            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              عنوان مقاله
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: چند نکته درباره React"
              className={inputClass}
            />

            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              متن مقاله
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="متن کامل مقاله رو اینجا بنویس یا پیست کن..."
              className={`${inputClass} resize-y`}
            />

            {addedMsg && (
              <p className="mb-4 text-sm text-green-600 dark:text-green-400">{addedMsg}</p>
            )}

            <button
              type="submit"
              className="rounded-lg bg-gradient-to-r from-primary-light to-secondary-light px-6 py-2.5 font-semibold text-white transition-opacity hover:opacity-90"
            >
              اضافه‌کردن به صفحه اصلی
            </button>
          </form>

          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
            مقالات موجود ({articles.length})
          </h2>
          {articles.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">هنوز مقاله‌ای اضافه نشده.</p>
          ) : (
            <div className="space-y-3">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 shadow dark:bg-gray-900"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900 dark:text-white">
                      {article.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(article.date).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteArticle(article.id)}
                    className="flex-shrink-0 rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'settings' && (
        <div className="max-w-md rounded-2xl bg-white p-6 shadow dark:bg-gray-900">
          <h2 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
            تغییر نام کاربری و رمز عبور
          </h2>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            پیشنهاد می‌شه همین الان نام کاربری و رمز پیش‌فرض (123456) رو عوض کنی.
          </p>
          <form onSubmit={handleChangeCredentials}>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              نام کاربری جدید
            </label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className={inputClass}
            />

            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              رمز عبور جدید
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />

            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              تکرار رمز عبور جدید
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />

            {settingsError && <p className="mb-4 text-sm text-red-500">{settingsError}</p>}
            {settingsMsg && (
              <p className="mb-4 text-sm text-green-600 dark:text-green-400">{settingsMsg}</p>
            )}

            <button
              type="submit"
              className="rounded-lg bg-gradient-to-r from-primary-light to-secondary-light px-6 py-2.5 font-semibold text-white transition-opacity hover:opacity-90"
            >
              ذخیره تغییرات
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
