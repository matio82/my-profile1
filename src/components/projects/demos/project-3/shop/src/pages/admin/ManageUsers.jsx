// frontend/src/pages/admin/ManageUsers.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import axios from '../../utils/axios';

function ManageUsers() {
  // ═══════════════════════════════════════════════════════════
  // 📦 State
  // ═══════════════════════════════════════════════════════════
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // فیلترها
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // صفحه‌بندی
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  
  // مودال
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ═══════════════════════════════════════════════════════════
  // 🔄 دریافت کاربران
  // ═══════════════════════════════════════════════════════════
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('page', page);
      params.append('limit', 15);

      const token = localStorage.getItem('token');
      const res = await axios.get(`/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setUsers(res.data.users);
        setStats(res.data.stats);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('❌ خطا در دریافت کاربران:', err);
      setError(err.response?.data?.message || 'خطا در دریافت کاربران');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ═══════════════════════════════════════════════════════════
  // 🎬 اکشن‌ها
  // ═══════════════════════════════════════════════════════════
  
  // تغییر وضعیت (فعال/غیرفعال)
  const handleToggleStatus = async (user) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.put(
        `/admin/users/${user._id}/status`,
        { isActive: !user.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // بروزرسانی لیست
      setUsers(prev => prev.map(u => 
        u._id === user._id ? { ...u, isActive: !u.isActive } : u
      ));

      alert(`✅ کاربر ${user.isActive ? 'غیرفعال' : 'فعال'} شد`);
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'خطا در تغییر وضعیت'));
    } finally {
      setActionLoading(false);
    }
  };

  // تغییر نقش
  const handleChangeRole = async () => {
    if (!selectedUser) return;
    
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const newRole = selectedUser.role === 'admin' ? 'user' : 'admin';

      await axios.put(
        `/admin/users/${selectedUser._id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(prev => prev.map(u => 
        u._id === selectedUser._id ? { ...u, role: newRole, isAdmin: newRole === 'admin' } : u
      ));

      setShowRoleModal(false);
      setSelectedUser(null);
      alert(`✅ نقش کاربر به "${newRole === 'admin' ? 'ادمین' : 'کاربر'}" تغییر کرد`);
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'خطا در تغییر نقش'));
    } finally {
      setActionLoading(false);
    }
  };

  // حذف کاربر
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');

      await axios.delete(`/admin/users/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(prev => prev.filter(u => u._id !== selectedUser._id));
      setShowDeleteModal(false);
      setSelectedUser(null);
      alert('✅ کاربر با موفقیت حذف شد');
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'خطا در حذف کاربر'));
    } finally {
      setActionLoading(false);
    }
  };

  // جستجو با تأخیر
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // ═══════════════════════════════════════════════════════════
  // 🎨 رندر
  // ═══════════════════════════════════════════════════════════
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* ═══════════ هدر ═══════════ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#00eaff] flex items-center gap-3">
            👥 مدیریت کاربران
          </h1>
          <p className="text-gray-400 mt-2">مشاهده، ویرایش و مدیریت کاربران سیستم</p>
        </div>
      </div>

      {/* ═══════════ کارت‌های آمار ═══════════ */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard 
            icon="👥" 
            title="کل کاربران" 
            value={stats.total} 
            color="blue" 
          />
          <StatCard 
            icon="👑" 
            title="ادمین‌ها" 
            value={stats.admins} 
            color="yellow" 
          />
          <StatCard 
            icon="👤" 
            title="کاربران عادی" 
            value={stats.users} 
            color="cyan" 
          />
          <StatCard 
            icon="✅" 
            title="فعال" 
            value={stats.active} 
            color="green" 
          />
          <StatCard 
            icon="🚫" 
            title="غیرفعال" 
            value={stats.inactive} 
            color="red" 
          />
        </div>
      )}

      {/* ═══════════ فیلترها ═══════════ */}
      <div className="bg-gradient-to-r from-[#102030] to-[#1a3a52] rounded-2xl p-6 mb-6 border border-[#00eaff]/20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* جستجو */}
          <div className="lg:col-span-2">
            <label className="block text-gray-400 text-sm mb-2">🔍 جستجو</label>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="نام، ایمیل یا تلفن..."
              className="w-full px-4 py-3 bg-[#0d1b2a] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-[#00eaff] focus:outline-none transition-colors"
            />
          </div>

          {/* فیلتر نقش */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">👤 نقش</label>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="w-full px-4 py-3 bg-[#0d1b2a] border border-gray-600 rounded-xl text-white focus:border-[#00eaff] focus:outline-none"
            >
              <option value="all">همه</option>
              <option value="user">کاربر</option>
              <option value="admin">ادمین</option>
            </select>
          </div>

          {/* فیلتر وضعیت */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">📊 وضعیت</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full px-4 py-3 bg-[#0d1b2a] border border-gray-600 rounded-xl text-white focus:border-[#00eaff] focus:outline-none"
            >
              <option value="all">همه</option>
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </select>
          </div>

          {/* مرتب‌سازی */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">📈 مرتب‌سازی</label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
                setPage(1);
              }}
              className="w-full px-4 py-3 bg-[#0d1b2a] border border-gray-600 rounded-xl text-white focus:border-[#00eaff] focus:outline-none"
            >
              <option value="createdAt-desc">جدیدترین</option>
              <option value="createdAt-asc">قدیمی‌ترین</option>
              <option value="name-asc">نام (الف-ی)</option>
              <option value="name-desc">نام (ی-الف)</option>
              <option value="email-asc">ایمیل (الف-ی)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ═══════════ جدول کاربران ═══════════ */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchUsers} />
      ) : users.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="bg-gradient-to-br from-[#102030] to-[#1a3a52] rounded-2xl border border-[#00eaff]/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0d1b2a]/50 border-b border-gray-700">
                    <th className="text-right py-4 px-6 text-gray-400 font-medium">کاربر</th>
                    <th className="text-right py-4 px-6 text-gray-400 font-medium">ایمیل / تلفن</th>
                    <th className="text-center py-4 px-6 text-gray-400 font-medium">نقش</th>
                    <th className="text-center py-4 px-6 text-gray-400 font-medium">وضعیت</th>
                    <th className="text-center py-4 px-6 text-gray-400 font-medium">تاریخ عضویت</th>
                    <th className="text-center py-4 px-6 text-gray-400 font-medium">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <UserRow
                      key={user._id}
                      user={user}
                      index={index}
                      onToggleStatus={handleToggleStatus}
                      onChangeRole={(u) => { setSelectedUser(u); setShowRoleModal(true); }}
                      onDelete={(u) => { setSelectedUser(u); setShowDeleteModal(true); }}
                      actionLoading={actionLoading}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* صفحه‌بندی */}
          {pagination && pagination.pages > 1 && (
            <Pagination
              pagination={pagination}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {/* ═══════════ مودال تغییر نقش ═══════════ */}
      <AnimatePresence>
        {showRoleModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-gradient-to-br from-[#102030] to-[#1a3a52] rounded-2xl p-8 max-w-md w-full border border-yellow-500/40"
            >
              <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                ⚠️ تغییر نقش کاربر
              </h3>

              <p className="text-gray-300 mb-6 leading-relaxed">
                آیا مطمئن هستید که می‌خواهید نقش کاربر
                <span className="font-bold text-white"> {selectedUser.email} </span>
                را به
                <span className="font-bold text-yellow-300">
                  {' '}
                  {selectedUser.role === 'admin' ? 'کاربر عادی' : 'ادمین'}
                </span>
                {' '}تغییر دهید؟
              </p>

              <div className="flex gap-4">
                <button
                  onClick={handleChangeRole}
                  disabled={actionLoading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? '⏳ در حال پردازش...' : '✅ تأیید'}
                </button>

                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedUser(null);
                  }}
                  disabled={actionLoading}
                  className="flex-1 py-3 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition disabled:opacity-50"
                >
                  ❌ انصراف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ مودال حذف ═══════════ */}
      <AnimatePresence>
        {showDeleteModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-gradient-to-br from-[#2a1010] to-[#401818] rounded-2xl p-8 max-w-md w-full border border-red-500/50"
            >
              <h3 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
                🗑️ حذف کاربر
              </h3>

              <p className="text-gray-300 mb-6 leading-relaxed">
                این عملیات <span className="text-red-400 font-bold">غیرقابل بازگشت</span> است.
                <br />
                آیا از حذف کاربر
                <span className="font-bold text-white"> {selectedUser.email} </span>
                مطمئن هستید؟
              </p>

              <div className="flex gap-4">
                <button
                  onClick={handleDeleteUser}
                  disabled={actionLoading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? '⏳ در حال حذف...' : '🗑️ حذف نهایی'}
                </button>

                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  disabled={actionLoading}
                  className="flex-1 py-3 rounded-xl bg-gray-600 text-white hover:bg-gray-500 transition disabled:opacity-50"
                >
                  انصراف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// 🧩 کامپوننت‌های کمکی
// ═══════════════════════════════════════════════════════════

const StatCard = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: 'border-blue-500/30',
    yellow: 'border-yellow-500/30',
    cyan: 'border-cyan-500/30',
    green: 'border-green-500/30',
    red: 'border-red-500/30'
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-gradient-to-br from-[#102030] to-[#1a3a52] rounded-2xl p-5 border ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </motion.div>
  );
};

const UserRow = ({
  user,
  index,
  onToggleStatus,
  onChangeRole,
  onDelete,
  actionLoading
}) => (
  <motion.tr
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.03 }}
    className="border-b border-gray-700 hover:bg-[#0d1b2a]/50 transition"
  >
    <td className="py-4 px-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#00eaff]/20 flex items-center justify-center text-[#00eaff] font-bold">
          {user.email?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <p className="text-white font-semibold">{user.name || '—'}</p>
          <p className="text-gray-400 text-sm">{user.username || '—'}</p>
        </div>
      </div>
    </td>

    <td className="py-4 px-6 text-gray-300">
      <p>{user.email}</p>
      <p className="text-sm text-gray-500">{user.phone || '—'}</p>
    </td>

    <td className="py-4 px-6 text-center">
      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
        user.role === 'admin'
          ? 'bg-yellow-500/20 text-yellow-400'
          : 'bg-cyan-500/20 text-cyan-400'
      }`}>
        {user.role === 'admin' ? 'ادمین' : 'کاربر'}
      </span>
    </td>

    <td className="py-4 px-6 text-center">
      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
        user.isActive
          ? 'bg-green-500/20 text-green-400'
          : 'bg-red-500/20 text-red-400'
      }`}>
        {user.isActive ? 'فعال' : 'غیرفعال'}
      </span>
    </td>

    <td className="py-4 px-6 text-center text-gray-400 text-sm">
      {new Date(user.createdAt).toLocaleDateString('fa-IR')}
    </td>

    <td className="py-4 px-6">
      <div className="flex justify-center gap-2">
        <button
          onClick={() => onToggleStatus(user)}
          disabled={actionLoading}
          className="px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title={user.isActive ? 'غیرفعال کردن' : 'فعال کردن'}
        >
          🔄
        </button>

        <button
          onClick={() => onChangeRole(user)}
          disabled={actionLoading}
          className="px-3 py-2 rounded-lg bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="تغییر نقش"
        >
          👑
        </button>

        <button
          onClick={() => onDelete(user)}
          disabled={actionLoading}
          className="px-3 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="حذف کاربر"
        >
          🗑️
        </button>
      </div>
    </td>
  </motion.tr>
);

const Pagination = ({ pagination, onPageChange }) => {
  const pages = Array.from({ length: pagination.pages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={pagination.page === 1}
        className="px-4 py-2 rounded-xl font-bold transition bg-[#102030] text-white hover:bg-[#1a3a52] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        قبلی
      </button>

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            p === pagination.page
              ? 'bg-[#00eaff] text-black'
              : 'bg-[#102030] text-white hover:bg-[#1a3a52]'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={pagination.page === pagination.pages}
        className="px-4 py-2 rounded-xl font-bold transition bg-[#102030] text-white hover:bg-[#1a3a52] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        بعدی
      </button>
    </div>
  );
};

const LoadingState = () => (
  <div className="text-center py-20 text-[#00eaff] text-2xl animate-pulse">
    ⏳ در حال بارگذاری کاربران...
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="text-center py-20 text-red-400">
    <p className="text-xl mb-4">❌ {message}</p>
    <button
      onClick={onRetry}
      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition"
    >
      🔄 تلاش مجدد
    </button>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-20 text-gray-400 text-xl">
    📭 کاربری یافت نشد
  </div>
);

export default ManageUsers;