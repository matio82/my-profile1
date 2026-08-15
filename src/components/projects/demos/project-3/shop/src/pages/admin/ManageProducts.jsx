// src/pages/admin/ManageProducts.jsx
import { useEffect, useState } from 'react'; // ✅ حذف React (بلااستفاده)
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';

const ManageProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // لیست دسته‌بندی‌ها
  const categories = [
    'الکترونیک',
    'پوشاک',
    'کتاب',
    'لوازم خانگی',
    'ورزشی',
    'آرایشی و بهداشتی',
    'اسباب بازی',
    'مواد غذایی',
    'سایر'
  ];

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/products');
      console.log('✅ محصولات دریافت شدند:', res.data);

      const productsList = res.data.data || res.data.products || [];
      setProducts(productsList);
    } catch (error) {
      console.error('❌ خطا در دریافت محصولات:', error);
      alert('خطا در دریافت محصولات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('⚠️ آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟')) {
      return;
    }

    try {
      await axios.delete(`/admin/products/${id}`);
      alert('✅ محصول با موفقیت حذف شد');
      fetchProducts();
    } catch (error) {
      console.error('❌ خطا در حذف:', error);
      alert(error.response?.data?.message || 'خطا در حذف محصول');
    }
  };

  const handleEdit = (product) => {
    localStorage.setItem('editProduct', JSON.stringify(product));
    navigate(`/admin/products/edit/${product._id}`);
  };

  // فیلتر محصولات
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a1929]">
        <div className="text-center">
          <div className="text-[#00eaff] text-2xl mb-4 animate-pulse">
            در حال بارگذاری محصولات 📦
          </div>
          <div className="text-gray-400">لطفاً صبر کنید...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1929] p-8">
      <div className="max-w-7xl mx-auto">
        {/* هدر */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-[#00eaff]">
            📝 مدیریت محصولات
          </h1>
          <button
            onClick={() => navigate('/admin/products/create')}
            className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-3 rounded-xl text-white font-bold hover:from-green-700 hover:to-green-900 transition-all shadow-lg hover:scale-105"
          >
            ➕ افزودن محصول جدید
          </button>
        </div>

        {/* جستجو و فیلتر */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 جستجوی محصول بر اساس نام..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#102030] text-white border border-[#1e3a5f] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00eaff]"
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full bg-[#102030] text-white border border-[#1e3a5f] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00eaff] cursor-pointer"
          >
            <option value="">🏷️ همه دسته‌بندی‌ها</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* تعداد محصولات */}
        <div className="mb-6 text-gray-400">
          📊 تعداد محصولات یافت شده: <span className="text-[#00eaff] font-bold">{filteredProducts.length}</span>
        </div>

        {/* لیست محصولات */}
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-400 text-xl mt-20">
            {products.length === 0 ? (
              <>
                <div className="text-6xl mb-4">📦</div>
                <p>هیچ محصولی وجود ندارد</p>
                <button
                  onClick={() => navigate('/admin/products/create')}
                  className="mt-6 bg-[#28a745] px-6 py-3 rounded-xl text-white font-bold hover:bg-[#218838] transition-colors"
                >
                  ➕ اولین محصول را بسازید
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🔍</div>
                <p>هیچ محصولی با این فیلترها پیدا نشد</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 🧩 کامپوننت کارت محصول
const ProductCard = ({ product, onDelete, onEdit }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      'الکترونیک': '💻',
      'پوشاک': '👕',
      'کتاب': '📚',
      'لوازم خانگی': '🏠',
      'ورزشی': '⚽',
      'آرایشی و بهداشتی': '💄',
      'اسباب بازی': '🧸',
      'مواد غذایی': '🍔',
      'سایر': '📦'
    };
    return icons[category] || '📦';
  };

  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image) {
      return product.image;
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };

  return (
    <div className="bg-[#102030] rounded-2xl p-6 border border-[#1e3a5f] hover:border-[#00eaff] transition-all shadow-xl hover:scale-105">
      {/* تصویر */}
      <div className="mb-4 overflow-hidden rounded-xl">
        <img
          src={getProductImage()}
          alt={product.name}
          className="w-full h-48 object-cover hover:scale-110 transition-transform"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=تصویر+موجود+نیست';
          }}
        />
      </div>

      {/* اطلاعات */}
      <h3 className="text-xl font-bold text-[#00eaff] mb-2 line-clamp-1">
        {product.name}
      </h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {product.description}
      </p>

      {/* قیمت و موجودی */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-[#28a745] font-bold text-lg">
          💰 {product.price?.toLocaleString('fa-IR')} تومان
        </span>
        <span className={`font-bold ${product.stock > 0 ? 'text-[#00eaff]' : 'text-red-500'}`}>
          📊 موجودی: {product.stock}
        </span>
      </div>

      {/* دسته‌بندی */}
      <div className="mb-4">
        <span className="bg-[#1e3a5f] px-4 py-2 rounded-lg text-sm text-[#00eaff] inline-flex items-center gap-2">
          {getCategoryIcon(product.category)} {product.category}
        </span>
      </div>

      {/* دکمه‌ها */}
      <div className="flex gap-3">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 bg-[#007bff] text-white py-2 rounded-xl font-bold hover:bg-[#0056b3] transition-colors shadow-lg hover:shadow-blue-500/50"
        >
          ✏️ ویرایش
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="flex-1 bg-[#dc3545] text-white py-2 rounded-xl font-bold hover:bg-[#c82333] transition-colors shadow-lg hover:shadow-red-500/50"
        >
          🗑️ حذف
        </button>
      </div>
    </div>
  );
};

export default ManageProducts;
