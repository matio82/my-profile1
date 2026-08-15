// frontend/src/pages/admin/UserDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../utils/axios';

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ═══════════════════════════════════════════════════════════
  // 📦 State
  // ═══════════════════════════════════════════════════════════
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // تب فعال
  const [activeTab, setActiveTab] = useState('info');
  
  // مودال‌ها
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // فرم ویرایش
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    nationalId: '',
    birthDate: ''
  });

  // ═══════════════════════════════════════════════════════════
  // 🔄 دریافت اطلاعات کاربر
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      const res = await axios.get(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setUser(res.data.user);
        setOrders(res.data.orders || []);
        setStats(res.data.stats || {});
        
        // پر کردن فرم ویرایش
        setEditForm({
          name: res.data.user.name || '',
          email: res.data.user.email || '',
          phone: res.data.user.phone || '',
          nationalId: res.data.user.nationalId || '',
          birthDate: res.data.user.birthDate?.split('T')[0] || ''
        });
      }
    } catch (err) {
      console.error('❌ خطا در دریافت کاربر:', err);
      setError(err.response?.data?.message || 'خطا در دریافت اطلاعات کاربر');
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // 🎬 اکشن‌ها
  // ═══════════════════════════════════════════════════════════

  // ویرایش کاربر
  const handleEditUser = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');

      const res = await axios.put(
        `/admin/users/${id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setUser(res.data.user);
        setShowEditModal(false);
        alert('✅ اطلاعات کاربر با موفقیت ویرایش شد');
      }
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'خطا در ویرایش کاربر'));
    } finally {
      setActionLoading(false);
    }
  };

  // تغییر نقش
  const handleChangeRole = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const newRole = user.role === 'admin' ? 'user' : 'admin';

      const res = await axios.put(
        `/admin/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setUser(prev => ({ ...prev, role: newRole, isAdmin: newRole === 'admin' }));
        setShowRoleModal(false);
        alert(`✅ نقش کاربر به "${newRole === 'admin' ? 'ادمین' : 'کاربر'}" تغییر کرد`);
      }
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'خطا در تغییر نقش'));
    } finally {
      setActionLoading(false);
    }
  };

  // تغییر وضعیت
  const handleToggleStatus = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');

      const res = await axios.put(
        `/admin/users/${id}/status`,
        { isActive: !user.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setUser(prev => ({ ...prev, isActive: !prev.isActive }));
        setShowStatusModal(false);
        alert(`✅ کاربر ${user.isActive ? 'غیرفعال' : 'فعال'} شد`);
      }
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'خطا در تغییر وضعیت'));
    } finally {
      setActionLoading(false);
    }
  };

  // حذف کاربر
  const handleDeleteUser = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');

      await axios.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ کاربر با موفقیت حذف شد');
      navigate('/admin/users');
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'خطا در حذف کاربر'));
    } finally {
      setActionLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // 🎨 رندر
  // ═══════════════════════════════════════════════════════════

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00eaff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#00eaff] text-xl">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">❌ {error}</p>
          <button
            onClick={() => navigate('/admin/users')}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl"
          >
            بازگشت به لیست کاربران
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* ═══════════ هدر ═══════════ */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="p-3 rounded-xl bg-[#102030] border border-gray-700 hover:border-[#00eaff] transition"
          >
            ←
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#00eaff] flex items-center gap-3">
              👤 جزئیات کاربر
            </h1>
            <p className="text-gray-400 mt-1">{user.email}</p>
          </div>
        </div>

        {/* دکمه‌های اکشن */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:shadow-lg transition flex items-center gap-2"
          >
            ✏️ ویرایش
          </button>
          <button
            onClick={() => setShowRoleModal(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold hover:shadow-lg transition flex items-center gap-2"
          >
            👑 تغییر نقش
          </button>
          <button
            onClick={() => setShowStatusModal(true)}
            className={`px-5 py-3 rounded-xl font-bold hover:shadow-lg transition flex items-center gap-2 ${
              user.isActive
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
            }`}
          >
            {user.isActive ? '🚫 غیرفعال کردن' : '✅ فعال کردن'}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold hover:shadow-lg transition flex items-center gap-2"
          >
            🗑️ حذف
          </button>
        </div>
      </div>

      {/* ═══════════ کارت پروفایل ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* پروفایل اصلی */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-gradient-to-br from-[#102030] to-[#1a3a52] rounded-2xl p-6 border border-[#00eaff]/20"
        >
          <div className="text-center">
            {/* آواتار */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#00eaff] to-[#00ff88] mx-auto flex items-center justify-center text-4xl font-bold text-black mb-4">
              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">{user.name || 'بدون نام'}</h2>
            <p className="text-gray-400 mb-4">{user.email}</p>

            {/* بج‌ها */}
            <div className="flex justify-center gap-3 mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                user.role === 'admin'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
              }`}>
                {user.role === 'admin' ? '👑 ادمین' : '👤 کاربر'}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                user.isActive
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-red-500/20 text-red-400 border border-red-500/50'
              }`}>
                {user.isActive ? '✅ فعال' : '🚫 غیرفعال'}
              </span>
            </div>

            {/* اطلاعات تماس */}
            <div className="space-y-3 text-right">
              <InfoRow icon="📱" label="تلفن" value={user.phone || '—'} />
              <InfoRow icon="🆔" label="کد ملی" value={user.nationalId || '—'} />
              <InfoRow icon="🎂" label="تاریخ تولد" value={user.birthDate ? new Date(user.birthDate).toLocaleDateString('fa-IR') : '—'} />
              <InfoRow icon="📅" label="تاریخ عضویت" value={new Date(user.createdAt).toLocaleDateString('fa-IR')} />
              <InfoRow icon="🕐" label="آخرین ورود" value={user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fa-IR') : '—'} />
            </div>
          </div>
        </motion.div>

        {/* آمار خرید */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <StatCard
            icon="🛒"
            title="کل سفارشات"
            value={stats.totalOrders || 0}
            color="blue"
          />
          <StatCard
            icon="✅"
            title="تحویل شده"
            value={stats.deliveredOrders || 0}
          />
          <StatCard
            icon="⏳"
            title="در انتظار"
            value={stats.pendingOrders || 0}
            color="orange"
          />
          <StatCard
            icon="💰"
            title="مبلغ کل"
            value={(stats.totalSpent || 0).toLocaleString('fa-IR') + ' تومان'}
            color="green"
          />
        </motion.div>
      </div>

      {/* ═══════════ تب‌ها ═══════════ */}
      <div className="bg-[#102030] border border-gray-700 rounded-2xl mb-8">
        <div className="flex border-b border-gray-700">
          <TabButton label="ℹ️ اطلاعات" active={activeTab === 'info'} onClick={() => setActiveTab('info')} />
          <TabButton label="🛒 سفارشات" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
          <TabButton label="📍 آدرس‌ها" active={activeTab === 'addresses'} onClick={() => setActiveTab('addresses')} />
        </div>

        <div className="p-6">
          {/* اطلاعات */}
          {activeTab === 'info' && (
            <InfoGrid user={user} />
          )}

          {/* سفارشات */}
          {activeTab === 'orders' && (
            <OrdersTable orders={orders} />
          )}

          {/* آدرس‌ها */}
          {activeTab === 'addresses' && (
            <AddressesList addresses={user.addresses || []} />
          )}
        </div>
      </div>

      {/* ═══════════ مودال‌ها ═══════════ */}
      <ConfirmModal
        show={showRoleModal}
        title="تغییر نقش کاربر"
        message={`آیا مطمئن هستید نقش کاربر به "${
          user.role === 'admin' ? 'کاربر' : 'ادمین'
        }" تغییر کند؟`}
        confirmText="تغییر نقش"
        loading={actionLoading}
        onConfirm={handleChangeRole}
        onClose={() => setShowRoleModal(false)}
      />

      <ConfirmModal
        show={showStatusModal}
        title="تغییر وضعیت کاربر"
        message={`آیا مطمئن هستید کاربر ${
          user.isActive ? 'غیرفعال' : 'فعال'
        } شود؟`}
        confirmText="تأیید"
        loading={actionLoading}
        onConfirm={handleToggleStatus}
        onClose={() => setShowStatusModal(false)}
      />

      <ConfirmModal
        show={showDeleteModal}
        title="حذف کاربر"
        danger
        message="⚠️ این عملیات غیرقابل بازگشت است. آیا مطمئن هستید؟"
        confirmText="حذف کاربر"
        loading={actionLoading}
        onConfirm={handleDeleteUser}
        onClose={() => setShowDeleteModal(false)}
      />

      <EditUserModal
        show={showEditModal}
        form={editForm}
        setForm={setEditForm}
        loading={actionLoading}
        onSave={handleEditUser}
        onClose={() => setShowEditModal(false)}
      />
    </motion.div>
  );
}

export default UserDetail;

/* ═══════════════════════════════════════════════════════════
   🧩 کامپوننت‌های کمکی
═══════════════════════════════════════════════════════════ */

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex justify-between text-sm text-gray-300">
      <span>{icon} {label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  const colors = {
    blue: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/50',
    orange: 'from-orange-500/20 to-yellow-500/20 border-yellow-500/50',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/50'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-6 border`}>
      <div className="text-3xl mb-3">{icon}</div>
      <h4 className="text-gray-400 text-sm mb-1">{title}</h4>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-4 font-bold transition ${
        active
          ? 'text-[#00eaff] border-b-2 border-[#00eaff]'
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function OrdersTable({ orders }) {
  if (!orders.length) {
    return <p className="text-gray-400 text-center">سفارشی ثبت نشده است</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right text-sm">
        <thead className="text-gray-400 border-b border-gray-700">
          <tr>
            <th>کد</th>
            <th>تاریخ</th>
            <th>وضعیت</th>
            <th>مبلغ</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id} className="border-b border-gray-800 hover:bg-gray-800/40">
              <td>#{order._id.slice(-6)}</td>
              <td>{new Date(order.createdAt).toLocaleDateString('fa-IR')}</td>
              <td>{order.status}</td>
              <td>{order.totalPrice.toLocaleString('fa-IR')} تومان</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AddressesList({ addresses }) {
  if (!addresses.length) {
    return <p className="text-gray-400 text-center">هیچ آدرسی ثبت نشده است</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {addresses.map((addr, i) => (
        <div
          key={i}
          className={`rounded-xl p-5 border ${
            addr.isDefault
              ? 'border-[#00eaff] bg-[#00eaff]/10'
              : 'border-gray-700 bg-[#0b1620]'
          }`}
        >
          <h4 className="font-bold mb-2">
            📍 {addr.title} {addr.isDefault && '(پیش‌فرض)'}
          </h4>
          <p className="text-gray-400 text-sm">
            {addr.province}، {addr.city}، {addr.street}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            👤 {addr.receiverName} | 📞 {addr.receiverPhone}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ═══════════ مودال‌ها ═══════════ */

function ConfirmModal({ show, title, message, confirmText, onConfirm, onClose, loading, danger }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#102030] border border-gray-700 rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-lg">
            لغو
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-bold ${
              danger ? 'bg-red-600' : 'bg-blue-600'
            }`}
          >
            {loading ? 'در حال انجام...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditUserModal({ show, form, setForm, onSave, onClose, loading }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#102030] border border-gray-700 rounded-2xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">✏️ ویرایش اطلاعات کاربر</h3>

        <div className="grid gap-4">
          {Object.keys(form).map(key => (
            <input
              key={key}
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              placeholder={key}
              className="bg-[#0b1620] border border-gray-700 rounded-lg px-4 py-3 text-white"
            />
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-lg">
            لغو
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-[#00eaff] to-[#00ff88] text-black font-bold rounded-lg"
          >
            {loading ? 'در حال ذخیره...' : 'ذخیره'}
          </button>
        </div>
      </div>
    </div>
  );
}
