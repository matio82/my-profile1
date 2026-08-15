// src/pages/admin/CreateProduct.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',  // ✅ تغییر یافت
    category: '',
    stock: '',
    images: []
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 📤 تابع آپلود فایل به سرور
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
      uploadData.append('image', file);

      const response = await axios.post('/products/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ آپلود موفق:', response.data);

      if (response.data.success && response.data.images.length > 0) {
        setFormData({
          ...formData,
          images: [response.data.images[0]]
        });
        alert('✅ عکس با موفقیت آپلود شد!');
      }
    } catch (error) {
      console.error('❌ خطا در آپلود:', error);
      alert(error.response?.data?.message || '❌ خطا در آپلود تصویر');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ اعتبارسنجی تصویر
    if (!formData.images || formData.images.length === 0) {
      alert('❌ لطفاً حداقل یک تصویر برای محصول آپلود کنید');
      return;
    }

    setLoading(true);

    try {
      // ✅ ارسال با فیلدهای صحیح
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,  // ✅ تغییر یافت
        category: formData.category,
        stock: Number(formData.stock),
        images: formData.images
      };

      console.log('📤 ارسال داده:', payload);

      const response = await axios.post('/products', payload);

      console.log('✅ محصول با موفقیت ساخته شد:', response.data);
      alert('✅ محصول با موفقیت اضافه شد!');
      navigate('/admin/products');
    } catch (error) {
      console.error('❌ خطا در ساخت محصول:', error);
      alert(error.response?.data?.message || '❌ خطا در ساخت محصول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-[#102030] rounded-2xl p-8 shadow-2xl border border-[#0d324d]">
        <h1 className="text-3xl font-bold text-[#00eaff] mb-6 text-center">
          ➕ ساخت محصول جدید
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* نام محصول */}
          <InputField
            label="📦 نام محصول"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="مثال: لپ‌تاپ ایسوس"
            required
          />

          {/* توضیحات */}
          <TextAreaField
            label="📝 توضیحات"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="توضیحات کامل محصول..."
            required
          />

          {/* قیمت */}
          <InputField
            label="💰 قیمت (تومان)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="مثال: 15000000"
            required
          />

          {/* قیمت با تخفیف - ✅ اضافه شد */}
          <InputField
            label="🔥 قیمت با تخفیف (اختیاری)"
            name="discountPrice"
            type="number"
            value={formData.discountPrice}
            onChange={handleChange}
            placeholder="مثال: 12000000 (درصد تخفیف خودکار محاسبه می‌شود)"
          />

          {/* دسته‌بندی */}
          <div>
            <label className="block text-[#00eaff] font-semibold mb-2">
              🏷️ دسته‌بندی
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full bg-[#0d1b2a] text-white border border-[#1e3a5f] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00eaff] cursor-pointer"
            >
              <option value="" disabled>
                انتخاب کنید...
              </option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* موجودی */}
          <InputField
            label="📊 موجودی"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            placeholder="مثال: 10"
            required
          />

          {/* ==================== آپلود تصویر ==================== */}
          <div>
            <label className="block text-[#00eaff] font-semibold mb-2">
              🖼️ تصویر محصول *
            </label>

            {/* دکمه آپلود فایل */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="w-full bg-[#0d1b2a] text-white border border-[#1e3a5f] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00eaff] cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#00eaff] file:text-[#0d1b2a] file:font-bold hover:file:bg-[#00d4e6] file:cursor-pointer"
            />

            {uploading && (
              <p className="text-[#00eaff] mt-2 animate-pulse">
                ⏳ در حال آپلود تصویر...
              </p>
            )}

            {/* یا لینک تصویر */}
            <div className="mt-3">
              <input
                type="text"
                placeholder="یا لینک تصویر را بچسبانید (مثال: https://...)"
                value={formData.images[0] || ''}
                onChange={(e) =>
                  setFormData({ ...formData, images: [e.target.value] })
                }
                className="w-full bg-[#0d1b2a] text-white border border-[#1e3a5f] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00eaff]"
              />
            </div>

            {/* پیش‌نمایش */}
            {formData.images.length > 0 && formData.images[0] && (
              <div className="mt-4">
                <p className="text-gray-400 text-sm mb-2">پیش‌نمایش:</p>
                <img
                  src={formData.images[0]}
                  alt="پیش‌نمایش"
                  className="w-full h-48 object-cover rounded-xl border-2 border-[#00eaff]"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=خطا+در+بارگذاری';
                  }}
                />
              </div>
            )}
          </div>

          {/* ==================== دکمه ساخت ==================== */}
          <button
            type="submit"
            disabled={loading || uploading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
              loading || uploading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 hover:scale-105'
            } text-white`}
          >
            {loading ? '⏳ در حال ساخت محصول...' : '✅ ساخت محصول'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ==================== کامپوننت‌های کمکی ====================

const InputField = ({ label, name, type = 'text', value, onChange, placeholder, required }) => (
  <div>
    <label className="block text-[#00eaff] font-semibold mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full bg-[#0d1b2a] text-white border border-[#1e3a5f] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00eaff]"
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, required }) => (
  <div>
    <label className="block text-[#00eaff] font-semibold mb-2">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows="4"
      className="w-full bg-[#0d1b2a] text-white border border-[#1e3a5f] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00eaff] resize-none"
    />
  </div>
);

export default CreateProduct;