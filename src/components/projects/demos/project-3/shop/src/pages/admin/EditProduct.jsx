// src/pages/admin/EditProduct.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // فرم اصلی
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    status: 'normal',
    isActive: true,
    images: []
  });

  // تخفیف
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [discountPrice, setDiscountPrice] = useState('');

  // ⏰ تایمر تخفیف
  const [timedDiscountEnabled, setTimedDiscountEnabled] = useState(false);
  const [discountStartDate, setDiscountStartDate] = useState('');
  const [discountStartTime, setDiscountStartTime] = useState('00:00');
  const [discountEndDate, setDiscountEndDate] = useState('');
  const [discountEndTime, setDiscountEndTime] = useState('23:59');
  const [countdown, setCountdown] = useState(null);

  // لیست دسته‌بندی‌ها
  const categories = [
    { value: 'الکترونیک', label: '💻 الکترونیک' },
    { value: 'پوشاک', label: '👕 پوشاک' },
    { value: 'کتاب', label: '📚 کتاب' },
    { value: 'لوازم خانگی', label: '🏠 لوازم خانگی' },
    { value: 'ورزشی', label: '⚽ ورزشی' },
    { value: 'آرایشی و بهداشتی', label: '💄 آرایشی و بهداشتی' },
    { value: 'اسباب بازی', label: '🧸 اسباب بازی' },
    { value: 'مواد غذایی', label: '🍔 مواد غذایی' },
    { value: 'سایر', label: '📦 سایر' }
  ];

  // ==================== دریافت اطلاعات محصول ====================
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/products/${id}`);
      const product = response.data.product || response.data.data || response.data;

      console.log('📦 محصول دریافت شد:', product);

      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || '',
        status: product.status || 'normal',
        isActive: product.isActive !== false,
        images: product.images || []
      });

      // چک کردن تخفیف
      if (product.discountPrice && product.discountPrice < product.price) {
        setDiscountEnabled(true);
        setDiscountPrice(product.discountPrice);
      }

      // ⏰ چک کردن تایمر تخفیف
      if (product.hasTimedDiscount) {
        setTimedDiscountEnabled(true);
        if (product.discountStartDate) {
          const start = new Date(product.discountStartDate);
          setDiscountStartDate(start.toISOString().split('T')[0]);
          setDiscountStartTime(start.toTimeString().slice(0, 5));
        }
        if (product.discountEndDate) {
          const end = new Date(product.discountEndDate);
          setDiscountEndDate(end.toISOString().split('T')[0]);
          setDiscountEndTime(end.toTimeString().slice(0, 5));
        }
      }

    } catch (err) {
      console.error('❌ خطا در دریافت محصول:', err);
      setError(err.response?.data?.message || 'خطا در دریافت اطلاعات محصول');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // ==================== تغییر فیلدها ====================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ==================== آپلود تصویر ====================
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('❌ فقط فایل‌های تصویری (jpg, png, webp, gif) مجاز هستند');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('❌ حجم فایل نباید بیشتر از 5 مگابایت باشد');
      return;
    }

    setUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('images', file);

      const response = await axios.post('/products/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success && response.data.images.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, response.data.images[0]]
        }));
        alert('✅ عکس با موفقیت آپلود شد!');
      }
    } catch (error) {
      console.error('❌ خطا در آپلود:', error);
      alert(error.response?.data?.message || '❌ خطا در آپلود تصویر');
    } finally {
      setUploading(false);
    }
  };

  // حذف تصویر
  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // ==================== محاسبات تخفیف ====================
  const calculateDiscountPercent = () => {
    const originalPrice = parseFloat(formData.price) || 0;
    const finalPrice = parseFloat(discountPrice) || 0;

    if (originalPrice > 0 && finalPrice > 0 && finalPrice < originalPrice) {
      return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
    }
    return 0;
  };

  const calculateSavings = () => {
    const originalPrice = parseFloat(formData.price) || 0;
    const finalPrice = parseFloat(discountPrice) || 0;

    if (originalPrice > 0 && finalPrice > 0 && finalPrice < originalPrice) {
      return originalPrice - finalPrice;
    }
    return 0;
  };

  // ==================== محاسبه تایمر ====================
  const calculateTimeLeft = useCallback(() => {
    if (!timedDiscountEnabled || !discountEndDate) {
      return null;
    }

    const endDateTime = new Date(`${discountEndDate}T${discountEndTime}`);
    const startDateTime = discountStartDate
      ? new Date(`${discountStartDate}T${discountStartTime}`)
      : null;
    const now = new Date();

    // اگر هنوز شروع نشده
    if (startDateTime && now < startDateTime) {
      const diff = startDateTime - now;
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        status: 'pending',
        message: '⏳ تا شروع تخفیف'
      };
    }

    // محاسبه زمان باقی‌مانده تا پایان
    const difference = endDateTime - now;

    if (difference <= 0) {
      return {
        expired: true,
        status: 'expired',
        message: '⛔ تخفیف به پایان رسیده'
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      expired: false,
      status: 'active',
      message: '🔥 تا پایان تخفیف'
    };
  }, [timedDiscountEnabled, discountStartDate, discountStartTime, discountEndDate, discountEndTime]);

  // ⏳ بروزرسانی تایمر هر ثانیه
  useEffect(() => {
    if (!timedDiscountEnabled || !discountEndDate) {
      setCountdown(null);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft());
    }, 1000);

    setCountdown(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [timedDiscountEnabled, calculateTimeLeft, discountEndDate]);

  // ==================== ذخیره تغییرات ====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // اعتبارسنجی
    if (!formData.name.trim()) {
      alert('❌ نام محصول الزامی است');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('❌ قیمت محصول الزامی است');
      return;
    }

    if (discountEnabled && timedDiscountEnabled && !discountEndDate) {
      alert('❌ تاریخ پایان تخفیف الزامی است');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // ساخت تاریخ‌ها
      let startDateTime = null;
      let endDateTime = null;

      if (timedDiscountEnabled && discountEnabled) {
        if (discountStartDate) {
          startDateTime = new Date(`${discountStartDate}T${discountStartTime}`).toISOString();
        }
        if (discountEndDate) {
          endDateTime = new Date(`${discountEndDate}T${discountEndTime}`).toISOString();
        }
      }

      const dataToSend = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        status: discountEnabled ? 'discount' : formData.status,
        isActive: formData.isActive,
        images: formData.images,
        // تخفیف
        discountPrice: discountEnabled ? parseFloat(discountPrice) : null,
        discountPercent: discountEnabled ? calculateDiscountPercent() : 0,
        // ⏰ تایمر
        hasTimedDiscount: timedDiscountEnabled && discountEnabled,
        discountStartDate: startDateTime,
        discountEndDate: endDateTime
      };

      console.log('📤 ارسال داده:', dataToSend);

      await axios.put(`/products/${id}`, dataToSend);

      alert('✅ محصول با موفقیت ویرایش شد!');
      navigate('/admin/products');

    } catch (err) {
      console.error('❌ خطا در ذخیره:', err);
      setError(err.response?.data?.message || 'خطا در ذخیره تغییرات');
    } finally {
      setSaving(false);
    }
  };

  // ==================== حالت لودینگ ====================
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-[#00eaff] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#00eaff] mt-4 text-lg">در حال بارگذاری محصول...</p>
      </div>
    );
  }

  // ==================== حالت خطا ====================
  if (error && !formData.name) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-xl mb-4">❌ {error}</p>
        <button
          onClick={() => navigate('/admin/products')}
          className="px-6 py-2 bg-[#00eaff] text-[#0d1b2a] rounded-lg font-bold hover:bg-[#00d4e8] transition-colors"
        >
          بازگشت به لیست محصولات
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" dir="rtl">
      {/* هدر */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#00eaff] mb-2">
          ✏️ ویرایش محصول
        </h1>
        <p className="text-gray-400">
          شناسه: {id}
        </p>
      </div>

      {/* نمایش خطا */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ==================== کارت اطلاعات اصلی ==================== */}
        <div className="bg-[#1a2d42] rounded-2xl p-6 border border-[#0d324d]">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📦</span>
            اطلاعات اصلی
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* نام محصول */}
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">نام محصول *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0d1b2a] border border-[#1e3a5f] rounded-lg text-white focus:border-[#00eaff] focus:outline-none transition-colors"
                placeholder="نام محصول را وارد کنید"
              />
            </div>

            {/* توضیحات */}
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">توضیحات</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-[#0d1b2a] border border-[#1e3a5f] rounded-lg text-white focus:border-[#00eaff] focus:outline-none transition-colors resize-none"
                placeholder="توضیحات محصول..."
              />
            </div>

            {/* قیمت */}
            <div>
              <label className="block text-gray-300 mb-2">قیمت (تومان) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 bg-[#0d1b2a] border border-[#1e3a5f] rounded-lg text-white focus:border-[#00eaff] focus:outline-none transition-colors"
                placeholder="0"
              />
            </div>

            {/* موجودی */}
            <div>
              <label className="block text-gray-300 mb-2">موجودی انبار</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 bg-[#0d1b2a] border border-[#1e3a5f] rounded-lg text-white focus:border-[#00eaff] focus:outline-none transition-colors"
                placeholder="0"
              />
            </div>

            {/* دسته‌بندی */}
            <div>
              <label className="block text-gray-300 mb-2">دسته‌بندی</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0d1b2a] border border-[#1e3a5f] rounded-lg text-white focus:border-[#00eaff] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="">انتخاب دسته‌بندی</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* وضعیت */}
            <div>
              <label className="block text-gray-300 mb-2">وضعیت</label>
              <select
                name="status"
                value={discountEnabled ? 'discount' : formData.status}
                onChange={handleChange}
                disabled={discountEnabled}
                className="w-full px-4 py-3 bg-[#0d1b2a] border border-[#1e3a5f] rounded-lg text-white focus:border-[#00eaff] focus:outline-none transition-colors disabled:opacity-50 cursor-pointer"
              >
                <option value="normal">عادی</option>
                <option value="new">جدید</option>
                <option value="discount">تخفیف‌دار</option>
              </select>
            </div>

            {/* فعال/غیرفعال */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 rounded bg-[#0d1b2a] border-[#1e3a5f] text-[#00eaff] focus:ring-[#00eaff] cursor-pointer"
              />
              <label htmlFor="isActive" className="text-gray-300 cursor-pointer">
                محصول فعال است
              </label>
            </div>
          </div>
        </div>

        {/* ==================== کارت تخفیف ==================== */}
        <div className="bg-gradient-to-r from-[#1a2d42] to-[#2d1a42] rounded-2xl p-6 border border-[#0d324d]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🏷️</span>
              اعمال تخفیف
            </h2>

            {/* سوییچ فعال‌سازی تخفیف */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={discountEnabled}
                onChange={(e) => {
                  setDiscountEnabled(e.target.checked);
                  if (!e.target.checked) {
                    setDiscountPrice('');
                    setTimedDiscountEnabled(false);
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-[#0d1b2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-gray-400 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-500 peer-checked:after:bg-white"></div>
              <span className="ms-3 text-sm font-medium text-gray-300">
                {discountEnabled ? 'فعال ✔' : 'غیرفعال'}
              </span>
            </label>
          </div>

          {discountEnabled && (
            <div className="space-y-6">
              {/* قیمت با تخفیف */}
              <div>
                <label className="block text-gray-300 mb-2">
                  💰 قیمت نهایی با تخفیف (تومان)
                </label>
                <input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  min="0"
                  max={formData.price}
                  className="w-full px-4 py-3 bg-[#0d1b2a] border border-[#1e3a5f] rounded-lg text-white focus:border-green-500 focus:outline-none transition-colors text-lg"
                  placeholder="قیمت نهایی را وارد کنید"
                />

                {parseFloat(discountPrice) >= parseFloat(formData.price) && discountPrice && (
                  <p className="text-red-400 text-sm mt-2">
                    ⚠️ قیمت تخفیف باید کمتر از قیمت اصلی باشد!
                  </p>
                )}
              </div>

              {/* نمایش محاسبات */}
              {discountPrice && parseFloat(discountPrice) < parseFloat(formData.price) && (
                <div className="bg-[#0d1b2a] rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center text-gray-400">
                    <span>قیمت اصلی:</span>
                    <span className="line-through">
                      {parseFloat(formData.price).toLocaleString()} تومان
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-green-400 text-lg font-bold">
                    <span>قیمت نهایی:</span>
                    <span>
                      {parseFloat(discountPrice).toLocaleString()} تومان
                    </span>
                  </div>

                  <div className="border-t border-[#1e3a5f] pt-3 flex justify-between items-center">
                    <span className="text-gray-400">درصد تخفیف:</span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {calculateDiscountPercent()}% تخفیف
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-yellow-400">
                    <span>💵 صرفه‌جویی مشتری:</span>
                    <span className="font-bold">
                      {calculateSavings().toLocaleString()} تومان
                    </span>
                  </div>
                </div>
              )}

              {/* ==================== بخش تایمر تخفیف ==================== */}
              <div className="border-t border-[#1e3a5f] pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>⏰</span> تخفیف زمان‌دار
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={timedDiscountEnabled}
                      onChange={(e) => setTimedDiscountEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#0d1b2a] rounded-full peer peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-gray-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:bg-white"></div>
                  </label>
                </div>

                {timedDiscountEnabled && (
                  <div className="space-y-4">
                    {/* تاریخ شروع */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">📅 تاریخ شروع (اختیاری)</label>
                        <input
                          type="date"
                          value={discountStartDate}
                          onChange={(e) => setDiscountStartDate(e.target.value)}
                          className="w-full px-3 py-2 bg-[#0d1b2a] border border-[#1e3a5f] rounded-lg text-white focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">🕐 ساعت شروع</label>
                        <input
                          type="time"
                          value={discountStartTime}
                          onChange={(e) => setDiscountStartTime(e.target.value)}
                          className="w-full px-3 py-2 bg-[#0d1b2a] border border-[#1e3a5f] rounded-lg text-white focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* تاریخ پایان */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">📅 تاریخ پایان *</label>
                        <input
                          type="date"
                          value={discountEndDate}
                          onChange={(e) => setDiscountEndDate(e.target.value)}
                          required={timedDiscountEnabled}
                          className="w-full px-3 py-2 bg-[#0d1b2a] border border-[#1e3a5f] rounded-lg text-white focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">🕐 ساعت پایان</label>
                        <input
                          type="time"
                          value={discountEndTime}
                          onChange={(e) => setDiscountEndTime(e.target.value)}
                          className="w-full px-3 py-2 bg-[#0d1b2a] border border-[#1e3a5f] rounded-lg text-white focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* ⏳ نمایش تایمر زنده */}
                    {countdown && (
                      <div className={`rounded-xl p-4 text-center ${
                        countdown.status === 'expired'
                          ? 'bg-red-500/20 border border-red-500'
                          : countdown.status === 'pending'
                            ? 'bg-yellow-500/20 border border-yellow-500'
                            : 'bg-green-500/20 border border-green-500'
                      }`}>
                        <p className={`text-sm mb-2 ${
                          countdown.status === 'expired' ? 'text-red-400'
                            : countdown.status === 'pending' ? 'text-yellow-400'
                              : 'text-green-400'
                        }`}>
                          {countdown.message}
                        </p>

                        {!countdown.expired && (
                          <div className="flex justify-center gap-3">
                            {/* روز */}
                            <div className="bg-[#0d1b2a] px-4 py-2 rounded-lg min-w-[60px]">
                              <div className="text-2xl font-bold text-white">{countdown.days}</div>
                              <div className="text-xs text-gray-400">روز</div>
                            </div>
                            {/* ساعت */}
                            <div className="bg-[#0d1b2a] px-4 py-2 rounded-lg min-w-[60px]">
                              <div className="text-2xl font-bold text-white">{countdown.hours}</div>
                              <div className="text-xs text-gray-400">ساعت</div>
                            </div>
                            {/* دقیقه */}
                            <div className="bg-[#0d1b2a] px-4 py-2 rounded-lg min-w-[60px]">
                              <div className="text-2xl font-bold text-white">{countdown.minutes}</div>
                              <div className="text-xs text-gray-400">دقیقه</div>
                            </div>
                            {/* ثانیه */}
                            <div className="bg-[#0d1b2a] px-4 py-2 rounded-lg min-w-[60px]">
                              <div className="text-2xl font-bold text-[#00eaff]">{countdown.seconds}</div>
                              <div className="text-xs text-gray-400">ثانیه</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ==================== کارت تصاویر ==================== */}
        <div className="bg-[#1a2d42] rounded-2xl p-6 border border-[#0d324d]">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🖼️</span>
            مدیریت تصاویر
          </h2>

          {/* آپلود تصویر جدید */}
          <div className="mb-6">
            <label className="block w-full cursor-pointer">
              <div className="border-2 border-dashed border-[#1e3a5f] rounded-lg p-8 text-center hover:border-[#00eaff] transition-colors">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-gray-400 mb-1">کلیک کنید یا تصویر را بکشید</p>
                <p className="text-xs text-gray-500">JPG, PNG, WEBP, GIF (حداکثر 5MB)</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            {uploading && (
              <p className="text-center text-[#00eaff] mt-2">در حال آپلود...</p>
            )}
          </div>

          {/* نمایش تصاویر فعلی */}
          {formData.images && formData.images.length > 0 && (
            <div>
              <h3 className="text-white mb-3 font-semibold">تصاویر فعلی:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`تصویر ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-[#1e3a5f]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==================== دکمه‌ها ==================== */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-4 bg-gradient-to-r from-[#00eaff] to-[#0080ff] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                در حال ذخیره...
              </span>
            ) : (
              '💾 ذخیره تغییرات'
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-8 py-4 bg-[#1a2d42] text-gray-300 font-bold rounded-xl hover:bg-[#243b53] transition-colors border border-[#0d324d]"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;