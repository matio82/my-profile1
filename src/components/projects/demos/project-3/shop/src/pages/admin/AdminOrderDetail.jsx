// frontend/src/pages/admin/AdminOrderDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../utils/axios';
import './AdminOrderDetail.css';

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // ═══════════════════════════════════════════════════════════
  // 📦 دریافت جزئیات سفارش
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        console.log('📦 دریافت سفارش:', orderId);
        
        const response = await axios.get(`/orders/${orderId}`);
        console.log('✅ سفارش دریافت شد:', response.data);
        
        // ✅ اصلاح شد
        setOrder(response.data.order);
        setError(null);
      } catch (err) {
        console.error('❌ خطا در دریافت سفارش:', err);
        setError(err.response?.data?.message || 'خطا در دریافت اطلاعات سفارش');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // ═══════════════════════════════════════════════════════════
  // 🔄 تغییر وضعیت سفارش
  // ═══════════════════════════════════════════════════════════
  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      console.log('🔄 تغییر وضعیت به:', newStatus);
      
      // ✅ مسیر اصلاح شد - از /admin/ استفاده می‌کنه
      const response = await axios.put(`/orders/admin/${orderId}/status`, {
        status: newStatus
      });
      
      console.log('✅ وضعیت تغییر کرد:', response.data);
      
      // ✅ اصلاح شد
      setOrder(response.data.order);
      alert('وضعیت سفارش با موفقیت تغییر کرد');
    } catch (err) {
      console.error('❌ خطا در تغییر وضعیت:', err);
      alert(err.response?.data?.message || 'خطا در تغییر وضعیت');
    } finally {
      setUpdating(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // 🎨 رنگ وضعیت
  // ═══════════════════════════════════════════════════════════
  const getStatusColor = (status) => {
    const colors = {
      'pending': '#f39c12',
      'confirmed': '#3498db',
      'packing': '#9b59b6',
      'shipped': '#1abc9c',
      'delivered': '#27ae60',
      'cancelled': '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  const getStatusText = (status) => {
    const texts = {
      'pending': 'در انتظار تایید',
      'confirmed': 'تایید شده',
      'packing': 'در حال بسته‌بندی',
      'shipped': 'ارسال شده',
      'delivered': 'تحویل داده شده',
      'cancelled': 'لغو شده'
    };
    return texts[status] || status;
  };

  // ═══════════════════════════════════════════════════════════
  // 📅 فرمت تاریخ
  // ═══════════════════════════════════════════════════════════
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // ═══════════════════════════════════════════════════════════
  // 💰 فرمت قیمت
  // ═══════════════════════════════════════════════════════════
  const formatPrice = (price) => {
    if (!price) return '۰';
    return Number(price).toLocaleString('fa-IR');
  };

  // ═══════════════════════════════════════════════════════════
  // 🎨 رندر
  // ═══════════════════════════════════════════════════════════
  if (loading) {
    return (
      <div className="admin-order-detail">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-order-detail">
        <div className="error-container">
          <span className="error-icon">❌</span>
          <h2>خطا</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/admin/orders')} className="back-btn">
            بازگشت به لیست سفارشات
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="admin-order-detail">
        <div className="error-container">
          <span className="error-icon">📦</span>
          <h2>سفارش یافت نشد</h2>
          <button onClick={() => navigate('/admin/orders')} className="back-btn">
            بازگشت به لیست سفارشات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-order-detail">
      {/* هدر */}
      <div className="detail-header">
        <div className="header-right">
          <Link to="/admin/orders" className="back-link">
            ← بازگشت
          </Link>
          <h1>جزئیات سفارش #{order._id?.slice(-8)}</h1>
        </div>
        <div 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(order.status) }}
        >
          {getStatusText(order.status)}
        </div>
      </div>

      <div className="detail-content">
        {/* ستون اصلی */}
        <div className="detail-main">
          {/* محصولات */}
          <div className="detail-card">
            <h2>📦 محصولات سفارش</h2>
            <div className="order-items">
              {order.items?.map((item, index) => (
                <div key={index} className="order-item">
                  <img 
                    src={item.image || item.product?.images?.[0] || '/placeholder.jpg'} 
                    alt={item.name}
                    className="item-image"
                  />
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>قیمت واحد: {formatPrice(item.price)} تومان</p>
                    <p>تعداد: {item.quantity}</p>
                  </div>
                  <div className="item-total">
                    {formatPrice(item.price * item.quantity)} تومان
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-summary">
              <div className="summary-row">
                <span>جمع محصولات:</span>
                <span>{formatPrice(order.totalAmount)} تومان</span>
              </div>
              <div className="summary-row">
                <span>هزینه ارسال:</span>
                <span>{formatPrice(order.shippingCost || 0)} تومان</span>
              </div>
              <div className="summary-row total">
                <span>مبلغ کل:</span>
                <span>{formatPrice((order.totalAmount || 0) + (order.shippingCost || 0))} تومان</span>
              </div>
            </div>
          </div>

          {/* آدرس تحویل */}
          <div className="detail-card">
            <h2>📍 آدرس تحویل</h2>
            <div className="address-info">
              <p><strong>آدرس:</strong> {order.shippingAddress?.address || '-'}</p>
              <p><strong>شهر:</strong> {order.shippingAddress?.city || '-'}</p>
              <p><strong>کد پستی:</strong> {order.shippingAddress?.postalCode || '-'}</p>
              <p><strong>تلفن:</strong> {order.shippingAddress?.phone || '-'}</p>
            </div>
          </div>

          {/* یادداشت مشتری */}
          {order.customerNote && (
            <div className="detail-card">
              <h2>📝 یادداشت مشتری</h2>
              <p className="customer-note">{order.customerNote}</p>
            </div>
          )}
        </div>

        {/* ستون کناری */}
        <div className="detail-sidebar">
          {/* اطلاعات مشتری */}
          <div className="detail-card">
            <h2>👤 اطلاعات مشتری</h2>
            <div className="customer-info">
              <p><strong>نام:</strong> {order.user?.name || '-'}</p>
              <p><strong>ایمیل:</strong> {order.user?.email || '-'}</p>
              <p><strong>تلفن:</strong> {order.user?.phone || '-'}</p>
            </div>
          </div>

          {/* اطلاعات سفارش */}
          <div className="detail-card">
            <h2>📋 اطلاعات سفارش</h2>
            <div className="order-info">
              <p><strong>شماره سفارش:</strong> {order.orderNumber || order._id?.slice(-8)}</p>
              <p><strong>تاریخ ثبت:</strong> {formatDate(order.createdAt)}</p>
              <p><strong>روش پرداخت:</strong> {order.paymentMethod === 'cash_on_delivery' ? 'پرداخت در محل' : order.paymentMethod}</p>
              {order.trackingCode && (
                <p><strong>کد رهگیری:</strong> {order.trackingCode}</p>
              )}
            </div>
          </div>

          {/* مدیریت وضعیت */}
          <div className="detail-card">
            <h2>⚙️ مدیریت سفارش</h2>
            <div className="status-management">
              <label>تغییر وضعیت:</label>
              <select 
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating || order.status === 'cancelled' || order.status === 'delivered'}
                className="status-select"
              >
                <option value="pending">در انتظار تایید</option>
                <option value="confirmed">تایید شده</option>
                <option value="packing">در حال بسته‌بندی</option>
                <option value="shipped">ارسال شده</option>
                <option value="delivered">تحویل داده شده</option>
                <option value="cancelled">لغو شده</option>
              </select>
              {updating && <p className="updating-text">در حال بروزرسانی...</p>}
            </div>
          </div>

          {/* تاریخچه وضعیت */}
          {order.statusHistory?.length > 0 && (
            <div className="detail-card">
              <h2>📜 تاریخچه وضعیت</h2>
              <div className="status-history">
                {order.statusHistory.map((history, index) => (
                  <div key={index} className="history-item">
                    <div 
                      className="history-dot"
                      style={{ backgroundColor: getStatusColor(history.status) }}
                    ></div>
                    <div className="history-content">
                      <span className="history-status">{getStatusText(history.status)}</span>
                      <span className="history-date">{formatDate(history.changedAt)}</span>
                      {history.note && <p className="history-note">{history.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
