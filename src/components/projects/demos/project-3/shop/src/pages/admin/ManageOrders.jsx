// frontend/src/pages/admin/ManageOrders.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from "../../utils/axios";
import LoadingSpinner from '../../components/LoadingSpinner';
import './ManageOrders.css';

// آیکون‌های وضعیت
const statusConfig = {
  pending: { 
    label: 'در انتظار تایید', 
    icon: '⏳', 
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)'
  },
  confirmed: { 
    label: 'تایید شده', 
    icon: '✅', 
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)'
  },
  packing: { 
    label: 'در حال بسته‌بندی', 
    icon: '📦', 
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.1)'
  },
  shipped: { 
    label: 'ارسال شده', 
    icon: '🚚', 
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.1)'
  },
  delivered: { 
    label: 'تحویل داده شده', 
    icon: '🎉', 
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.1)'
  },
  cancelled: { 
    label: 'لغو شده', 
    icon: '❌', 
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.1)'
  }
};

const ManageOrders = () => {
  // States
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [pagination, setPagination] = useState({});
  
  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 15
  });

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [updating, setUpdating] = useState(false);

  // ═══════════════════════════════════════════════════════════
  // 📡 دریافت سفارشات
  // ═══════════════════════════════════════════════════════════
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: filters.limit
      };
      
      if (filters.status !== 'all') {
        params.status = filters.status;
      }

      const { data } = await axios.get('/orders/admin/all', { params });
      
      setOrders(data.orders || []);
      setStats(data.stats || []);
      setPagination(data.pagination || {});
      
    } catch (error) {
      console.error('❌ خطا در دریافت سفارشات:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ═══════════════════════════════════════════════════════════
  // 🔄 تغییر وضعیت سفارش
  // ═══════════════════════════════════════════════════════════
  const handleStatusChange = async () => {
    if (!selectedOrder || !newStatus) return;
    
    setUpdating(true);
    try {
      const payload = { status: newStatus };
      
      if (newStatus === 'shipped' && trackingCode) {
        payload.trackingCode = trackingCode;
      }
      if (adminNote) {
        payload.adminNote = adminNote;
      }

      await axios.put(`/orders/admin/${selectedOrder._id}/status`, payload);
      
      // بروزرسانی لیست
      fetchOrders();
      
      // بستن مودال
      closeStatusModal();
      
    } catch (error) {
      console.error('❌ خطا در تغییر وضعیت:', error);
      alert(error.response?.data?.message || 'خطا در تغییر وضعیت');
    } finally {
      setUpdating(false);
    }
  };

  // باز کردن مودال تغییر وضعیت
  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingCode(order.trackingCode || '');
    setAdminNote('');
    setShowStatusModal(true);
  };

  // بستن مودال
  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedOrder(null);
    setNewStatus('');
    setTrackingCode('');
    setAdminNote('');
  };

  // ═══════════════════════════════════════════════════════════
  // 📊 محاسبه آمار
  // ═══════════════════════════════════════════════════════════
  const getStatCount = (status) => {
    const stat = stats.find(s => s._id === status);
    return stat?.count || 0;
  };

  const getTotalRevenue = () => {
    const delivered = stats.find(s => s._id === 'delivered');
    return delivered?.total || 0;
  };

  const getTotalOrders = () => {
    return stats.reduce((sum, s) => sum + s.count, 0);
  };

  // ═══════════════════════════════════════════════════════════
  // 🎨 رندر
  // ═══════════════════════════════════════════════════════════
  
  if (loading && orders.length === 0) {
    return <LoadingSpinner text="در حال بارگذاری سفارشات..." />;
  }

  return (
    <div className="manage-orders">
      {/* هدر */}
      <div className="page-header">
        <div className="header-content">
          <h1>📦 مدیریت سفارشات</h1>
          <p>مشاهده و مدیریت تمام سفارشات فروشگاه</p>
        </div>
      </div>

      {/* کارت‌های آمار */}
      <div className="stats-grid">
        <motion.div 
          className="stat-card total"
          whileHover={{ scale: 1.02 }}
        >
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-value">{getTotalOrders()}</span>
            <span className="stat-label">کل سفارشات</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card pending"
          whileHover={{ scale: 1.02 }}
          onClick={() => setFilters(f => ({ ...f, status: 'pending', page: 1 }))}
        >
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-value">{getStatCount('pending')}</span>
            <span className="stat-label">در انتظار</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card processing"
          whileHover={{ scale: 1.02 }}
          onClick={() => setFilters(f => ({ ...f, status: 'packing', page: 1 }))}
        >
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <span className="stat-value">{getStatCount('packing')}</span>
            <span className="stat-label">در حال پردازش</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card shipped"
          whileHover={{ scale: 1.02 }}
          onClick={() => setFilters(f => ({ ...f, status: 'shipped', page: 1 }))}
        >
          <div className="stat-icon">🚚</div>
          <div className="stat-info">
            <span className="stat-value">{getStatCount('shipped')}</span>
            <span className="stat-label">ارسال شده</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card delivered"
          whileHover={{ scale: 1.02 }}
          onClick={() => setFilters(f => ({ ...f, status: 'delivered', page: 1 }))}
        >
          <div className="stat-icon">🎉</div>
          <div className="stat-info">
            <span className="stat-value">{getStatCount('delivered')}</span>
            <span className="stat-label">تحویل شده</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card revenue"
          whileHover={{ scale: 1.02 }}
        >
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-value">{getTotalRevenue().toLocaleString('fa-IR')}</span>
            <span className="stat-label">درآمد (تومان)</span>
          </div>
        </motion.div>
      </div>

      {/* فیلترها */}
      <div className="filters-bar">
        <div className="filter-tabs">
          {[
            { key: 'all', label: 'همه', icon: '📋' },
            { key: 'pending', label: 'در انتظار', icon: '⏳' },
            { key: 'confirmed', label: 'تایید شده', icon: '✅' },
            { key: 'packing', label: 'بسته‌بندی', icon: '📦' },
            { key: 'shipped', label: 'ارسال شده', icon: '🚚' },
            { key: 'delivered', label: 'تحویل شده', icon: '🎉' },
            { key: 'cancelled', label: 'لغو شده', icon: '❌' }
          ].map(tab => (
            <button
              key={tab.key}
              className={`filter-tab ${filters.status === tab.key ? 'active' : ''}`}
              onClick={() => setFilters(f => ({ ...f, status: tab.key, page: 1 }))}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.key !== 'all' && (
                <span className="tab-count">{getStatCount(tab.key)}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* جدول سفارشات */}
      <div className="orders-table-container">
        {orders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <h3>سفارشی یافت نشد</h3>
            <p>هنوز سفارشی با این فیلتر ثبت نشده است</p>
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>شماره سفارش</th>
                <th>مشتری</th>
                <th>تاریخ</th>
                <th>مبلغ کل</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {orders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="order-id">
                      <span className="id-badge">
                        #{order._id?.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="customer-info">
                      <div className="customer-name">
                        {order.user?.name || 'کاربر حذف شده'}
                      </div>
                      <div className="customer-contact">
                        {order.user?.phone || order.user?.email || '-'}
                      </div>
                    </td>
                    <td className="order-date">
                      <div className="date">
                        {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                      </div>
                      <div className="time">
                        {new Date(order.createdAt).toLocaleTimeString('fa-IR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="order-amount">
                      <span className="amount">
                        {order.totalAmount?.toLocaleString('fa-IR')}
                      </span>
                      <span className="currency">تومان</span>
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{
                          backgroundColor: statusConfig[order.status]?.bg,
                          color: statusConfig[order.status]?.color
                        }}
                      >
                        <span>{statusConfig[order.status]?.icon}</span>
                        <span>{statusConfig[order.status]?.label}</span>
                      </span>
                    </td>
                    <td className="actions">
                      <Link 
                        to={`/admin/orders/${order._id}`}
                        className="btn-action btn-view"
                        title="مشاهده جزئیات"
                      >
                        👁️
                      </Link>
                      <button
                        className="btn-action btn-status"
                        onClick={() => openStatusModal(order)}
                        title="تغییر وضعیت"
                        disabled={order.status === 'delivered' || order.status === 'cancelled'}
                      >
                        🔄
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>

      {/* صفحه‌بندی */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={pagination.page <= 1}
            onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
          >
            قبلی
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter(p => Math.abs(p - pagination.page) <= 2)
              .map(p => (
                <button
                  key={p}
                  className={`page-num ${p === pagination.page ? 'active' : ''}`}
                  onClick={() => setFilters(f => ({ ...f, page: p }))}
                >
                  {p}
                </button>
              ))
            }
          </div>

          <button
            className="page-btn"
            disabled={pagination.page >= pagination.pages}
            onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
          >
            بعدی
          </button>
        </div>
      )}

      {/* مودال تغییر وضعیت */}
      <AnimatePresence>
        {showStatusModal && selectedOrder && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeStatusModal}
          >
            <motion.div
              className="modal-content status-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>🔄 تغییر وضعیت سفارش</h2>
                <button className="close-btn" onClick={closeStatusModal}>×</button>
              </div>

              <div className="modal-body">
                <div className="order-summary">
                  <p>
                    <strong>شماره سفارش:</strong> 
                    #{selectedOrder._id?.slice(-6).toUpperCase()}
                  </p>
                  <p>
                    <strong>مشتری:</strong> 
                    {selectedOrder.user?.name}
                  </p>
                  <p>
                    <strong>مبلغ:</strong> 
                    {selectedOrder.totalAmount?.toLocaleString('fa-IR')} تومان
                  </p>
                </div>

                <div className="form-group">
                  <label>وضعیت جدید:</label>
                  <div className="status-options">
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <button
                        key={key}
                        className={`status-option ${newStatus === key ? 'selected' : ''}`}
                        style={{
                          borderColor: newStatus === key ? config.color : 'transparent',
                          backgroundColor: newStatus === key ? config.bg : ''
                        }}
                        onClick={() => setNewStatus(key)}
                      >
                        <span>{config.icon}</span>
                        <span>{config.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {newStatus === 'shipped' && (
                  <div className="form-group">
                    <label>کد رهگیری مرسوله:</label>
                    <input
                      type="text"
                      value={trackingCode}
                      onChange={e => setTrackingCode(e.target.value)}
                      placeholder="کد رهگیری پستی را وارد کنید..."
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>یادداشت (اختیاری):</label>
                  <textarea
                    value={adminNote}
                    onChange={e => setAdminNote(e.target.value)}
                    placeholder="توضیحات برای این تغییر وضعیت..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn-cancel" 
                  onClick={closeStatusModal}
                  disabled={updating}
                >
                  انصراف
                </button>
                <button 
                  className="btn-confirm"
                  onClick={handleStatusChange}
                  disabled={updating || newStatus === selectedOrder.status}
                >
                  {updating ? '⏳ در حال ذخیره...' : '✅ ذخیره تغییرات'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageOrders;
