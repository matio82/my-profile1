// frontend/src/pages/Checkout.jsx
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axios';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();

  // ✅ اصلاح ۱: حذف getTotalPrice چون استفاده نمیشه (محاسبه دستی انجام میشه)
  const {
    cartItems,
    clearCart,
    fetchCart,
    // getTotalPrice,  ❌ حذف شد چون استفاده نمیشه
    loading: cartLoading
  } = useContext(CartContext);

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    customerNote: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

  // ✅ اصلاح ۲: استفاده از useCallback برای fetchCart wrapper
  const loadCart = useCallback(() => {
    console.log("🔄 [Checkout] Mount شد، دریافت سبد...");
    if (user && fetchCart) {
      fetchCart();
    }
  }, [user, fetchCart]);

  // ✅ اصلاح ۳: اضافه کردن loadCart به dependency
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // ✅ لاگ برای دیباگ
  useEffect(() => {
    console.log("🛒 [Checkout] cartItems:", cartItems);
    console.log("🛒 [Checkout] تعداد آیتم‌ها:", cartItems?.length);
  }, [cartItems]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        phone: user.phone || '',
        address: user.address?.street || '',
        city: user.address?.city || '',
        province: user.address?.province || '',
        postalCode: user.address?.postalCode || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ محاسبه قیمت با cartItems (بدون نیاز به getTotalPrice)
  const subtotal = cartItems?.reduce((sum, item) => {
    const price = item.product?.discountPrice || item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0) || 0;

  const shippingCost = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // اعتبارسنجی فرم
    if (!formData.fullName || !formData.phone || !formData.address ||
        !formData.city || !formData.province || !formData.postalCode) {
      toast.error('لطفاً همه فیلدها را پر کنید');
      return;
    }

    // اعتبارسنجی شماره تماس
    const phoneRegex = /^09[0-9]{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('شماره تماس معتبر نیست');
      return;
    }

    // اعتبارسنجی کد پستی
    const postalRegex = /^[0-9]{10}$/;
    if (!postalRegex.test(formData.postalCode)) {
      toast.error('کد پستی باید ۱۰ رقم باشد');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          province: formData.province.trim(),
          postalCode: formData.postalCode.trim()
        },
        paymentMethod: paymentMethod,
        customerNote: formData.customerNote?.trim() || ''
      };

      console.log('📤 ارسال سفارش:', orderData);

      const response = await axiosInstance.post('/orders', orderData);

      if (response.data.success) {
        toast.success('🎉 سفارش شما با موفقیت ثبت شد!');

        if (clearCart) await clearCart();

        navigate(`/orders/${response.data.order._id}`, {
          state: { orderSuccess: true }
        });
      }
    } catch (error) {
      console.error('❌ خطا در ثبت سفارش:', error);
      const message = error.response?.data?.message || 'خطا در ثبت سفارش';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ نمایش Loading
  if (cartLoading) {
    return (
      <div className="checkout-loading">
        <div className="spinner"></div>
        <p>در حال بارگذاری سبد خرید...</p>
      </div>
    );
  }

  // ✅ چک کردن cartItems
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>سبد خرید شما خالی است</h2>
        <button onClick={() => navigate('/products')}>
          مشاهده محصولات
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>تکمیل خرید</h1>

      <div className="checkout-content">
        {/* فرم اطلاعات ارسال */}
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section">
            <h2>📍 اطلاعات ارسال</h2>

            <div className="form-row">
              <div className="form-group">
                <label>نام و نام خانوادگی *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="نام گیرنده"
                  required
                />
              </div>

              <div className="form-group">
                <label>شماره تماس *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="09123456789"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <div className="form-group">
              <label>آدرس کامل *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="خیابان، کوچه، پلاک، واحد"
                rows={3}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>استان *</label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                >
                  <option value="">انتخاب استان</option>
                  <option value="تهران">تهران</option>
                  <option value="اصفهان">اصفهان</option>
                  <option value="فارس">فارس</option>
                  <option value="خراسان رضوی">خراسان رضوی</option>
                  <option value="آذربایجان شرقی">آذربایجان شرقی</option>
                  <option value="آذربایجان غربی">آذربایجان غربی</option>
                  <option value="خوزستان">خوزستان</option>
                  <option value="مازندران">مازندران</option>
                  <option value="گیلان">گیلان</option>
                  <option value="کرمان">کرمان</option>
                  <option value="سایر">سایر</option>
                </select>
              </div>

              <div className="form-group">
                <label>شهر *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="نام شهر"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>کد پستی *</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="۱۰ رقم"
                maxLength={10}
                required
                dir="ltr"
              />
            </div>
          </div>

          {/* روش پرداخت */}
          <div className="form-section">
            <h2>💳 روش پرداخت</h2>

            <div className="payment-methods">
              <label className={`payment-option ${paymentMethod === 'cash_on_delivery' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-icon">💵</span>
                <span>پرداخت در محل (نقدی)</span>
              </label>

              <label className={`payment-option ${paymentMethod === 'card_to_card' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card_to_card"
                  checked={paymentMethod === 'card_to_card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-icon">💳</span>
                <span>کارت به کارت</span>
              </label>

              <label className="payment-option disabled">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  disabled
                />
                <span className="payment-icon">🌐</span>
                <span>پرداخت آنلاین (به زودی...)</span>
              </label>
            </div>
          </div>

          {/* توضیحات */}
          <div className="form-section">
            <h2>📝 توضیحات (اختیاری)</h2>
            <textarea
              name="customerNote"
              value={formData.customerNote}
              onChange={handleChange}
              placeholder="توضیحات اضافی برای سفارش..."
              rows={3}
            />
          </div>
        </form>

        {/* خلاصه سفارش */}
        <div className="order-summary">
          <h2>📋 خلاصه سفارش</h2>

          <div className="summary-items">
            {cartItems.map((item, index) => (
              <div key={index} className="summary-item">
                <img
                  src={item.product?.images?.[0] || '/placeholder.png'}
                  alt={item.product?.name}
                />
                <div className="item-details">
                  <h4>{item.product?.name}</h4>
                  <p>{item.quantity} عدد</p>
                </div>
                <span className="item-price">
                  {((item.product?.discountPrice || item.product?.price || 0) * item.quantity).toLocaleString('fa-IR')} تومان
                </span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>جمع محصولات:</span>
              <span>{subtotal.toLocaleString('fa-IR')} تومان</span>
            </div>

            <div className="summary-row">
              <span>هزینه ارسال:</span>
              <span className={shippingCost === 0 ? 'free-shipping' : ''}>
                {shippingCost === 0 ? 'رایگان 🎉' : `${shippingCost.toLocaleString('fa-IR')} تومان`}
              </span>
            </div>

            <div className="summary-row total">
              <span>مبلغ قابل پرداخت:</span>
              <span>{total.toLocaleString('fa-IR')} تومان</span>
            </div>
          </div>

          <button
            type="submit"
            className="submit-order-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                در حال ثبت...
              </>
            ) : (
              '✅ ثبت سفارش'
            )}
          </button>

          {subtotal < 500000 && (
            <p className="free-shipping-hint">
              💡 با خرید بیشتر از ۵۰۰,۰۰۰ تومان، ارسال رایگان می‌شود!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
