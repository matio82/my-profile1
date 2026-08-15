import { useState } from 'react';
import axios from '../utils/axios';

function ProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'الکترونیک',
    stock: '',
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // آپلود تصاویر
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      alert('حداکثر 5 تصویر مجاز است');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setFormData(prev => ({
        ...prev,
        images: data.images
      }));
      
      alert('✅ تصاویر آپلود شدند');
    } catch (error) {
      alert('❌ خطا در آپلود تصاویر');
    } finally {
      setUploading(false);
    }
  };

  // ارسال فرم
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('/products', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('✅ محصول با موفقیت اضافه شد');
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'الکترونیک',
        stock: '',
        images: []
      });
    } catch (error) {
      alert('❌ خطا در ایجاد محصول');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>افزودن محصول جدید</h2>

      <div style={{ marginBottom: '15px' }}>
        <label>نام محصول:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>توضیحات:</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          style={{ width: '100%', padding: '8px', minHeight: '100px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>قیمت (تومان):</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>دسته‌بندی:</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="الکترونیک">الکترونیک</option>
          <option value="پوشاک">پوشاک</option>
          <option value="کتاب">کتاب</option>
          <option value="لوازم خانگی">لوازم خانگی</option>
          <option value="ورزشی">ورزشی</option>
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>موجودی:</label>
        <input
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>تصاویر (حداکثر 5 تصویر):</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          style={{ width: '100%', padding: '8px' }}
        />
        {uploading && <p>در حال آپلود...</p>}
        
        {/* نمایش تصاویر آپلود شده */}
        {formData.images.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
            {formData.images.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt={`preview-${idx}`}
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        style={{
          padding: '12px 24px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        ✅ ایجاد محصول
      </button>
    </form>
  );
}

export default ProductForm;
