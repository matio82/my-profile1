// frontend/src/pages/ProductList.jsx
import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function ProductList() {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [searchParams, setSearchParams] = useSearchParams();

  // State های اصلی
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingProduct, setAddingProduct] = useState(null);

  // State های فیلتر
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: { minPrice: 0, maxPrice: 10000000 }
  });

  // State های صفحه‌بندی
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  // فیلترهای فعال
  const [activeFilters, setActiveFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    inStock: searchParams.get("inStock") === "true",
    sort: searchParams.get("sort") || "newest"
  });

  // نمایش/عدم نمایش فیلترها در موبایل
  const [showFilters, setShowFilters] = useState(false);

  // ============================================
  // 📥 دریافت محصولات
  // ============================================
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (activeFilters.search) params.append("search", activeFilters.search);
      if (activeFilters.category) params.append("category", activeFilters.category);
      if (activeFilters.minPrice) params.append("minPrice", activeFilters.minPrice);
      if (activeFilters.maxPrice) params.append("maxPrice", activeFilters.maxPrice);
      if (activeFilters.inStock) params.append("inStock", "true");
      params.append("sort", activeFilters.sort);
      params.append("page", searchParams.get("page") || "1");
      params.append("limit", "12");

      const response = await axios.get(`/products?${params.toString()}`);

      setProducts(response.data.data || []);
      setPagination(response.data.pagination || { page: 1, pages: 1, total: 0 });
      setFilters(response.data.filters || {
        categories: [],
        brands: [],
        priceRange: { minPrice: 0, maxPrice: 10000000 }
      });
    } catch (err) {
      console.error("خطا در دریافت محصولات:", err);
      setError("خطا در دریافت محصولات");
    } finally {
      setLoading(false);
    }
  }, [activeFilters, searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ============================================
  // 🔄 بروزرسانی URL
  // ============================================
  const updateURL = (newFilters) => {
    const params = new URLSearchParams();

    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
    if (newFilters.inStock) params.set("inStock", "true");
    params.set("sort", newFilters.sort);

    setSearchParams(params);
  };

  // ============================================
  // 🎯 توابع تغییر فیلتر
  // ============================================
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...activeFilters, [filterName]: value };
    setActiveFilters(newFilters);
    updateURL(newFilters);
  };

  const handleCategoryChange = (category) => {
    const newCategory = activeFilters.category === category ? "" : category;
    handleFilterChange("category", newCategory);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      inStock: false,
      sort: "newest"
    };
    setActiveFilters(clearedFilters);
    setSearchParams(new URLSearchParams());
  };

  // ============================================
  // 📄 تغییر صفحه
  // ============================================
  const handlePageChange = (newPage) => {
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ============================================
  // 🛒 افزودن به سبد خرید
  // ============================================
  const handleAddToCart = async (productId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!user) {
      alert("⚠️ لطفاً ابتدا وارد شوید");
      return;
    }

    setAddingProduct(productId);
    const result = await addToCart(productId, 1);

    if (result.success) {
      alert("✅ محصول به سبد خرید اضافه شد");
    } else {
      alert("❌ خطا: " + (result.message || "مشکلی پیش آمد"));
    }

    setAddingProduct(null);
  };

  // ============================================
  // 🎨 رندر Loading
  // ============================================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <p className="text-2xl text-[#00eaff] font-bold">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // 🎨 رندر Error
  // ============================================
  if (error) {
    return (
      <div className="text-center mt-10 bg-red-900/30 border-2 border-red-500 rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="text-5xl mb-4">❌</div>
        <p className="text-2xl text-red-400 font-bold">{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold"
        >
          🔄 تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ============================================ */}
      {/* 🔍 نوار جستجو و مرتب‌سازی */}
      {/* ============================================ */}
      <div className="bg-gradient-to-r from-[#102030] to-[#1a3a52] p-6 rounded-2xl border-2 border-[#00eaff]/30 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* جستجو */}
          <div className="relative w-full lg:w-96">
            <input
              type="text"
              placeholder="🔍 جستجو در محصولات..."
              value={activeFilters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full px-4 py-3 bg-[#0d1b2a] border-2 border-[#00eaff]/30 rounded-xl text-white placeholder-gray-400 focus:border-[#00eaff] focus:outline-none"
            />
          </div>

          {/* مرتب‌سازی */}
          <div className="flex items-center gap-4">
            <select
              value={activeFilters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
              className="px-4 py-3 bg-[#0d1b2a] border-2 border-[#00eaff]/30 rounded-xl text-white focus:border-[#00eaff] focus:outline-none"
            >
              <option value="newest">جدیدترین</option>
              <option value="oldest">قدیمی‌ترین</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
              <option value="bestselling">پرفروش‌ترین</option>
              <option value="rating">بهترین امتیاز</option>
              <option value="discount">بیشترین تخفیف</option>
            </select>

            {/* دکمه نمایش فیلتر موبایل */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-4 py-3 bg-[#00eaff] text-black rounded-xl font-bold"
            >
              🎛️ فیلترها
            </button>
          </div>
        </div>

        {/* نمایش تعداد نتایج */}
        <div className="mt-4 text-gray-400">
          <span className="text-[#00eaff] font-bold">{pagination.total}</span> محصول یافت شد
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ============================================ */}
        {/* 🎛️ سایدبار فیلترها */}
        {/* ============================================ */}
        <AnimatePresence>
          {(showFilters || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full lg:w-72 bg-gradient-to-b from-[#102030] to-[#0d1b2a] p-6 rounded-2xl border-2 border-[#00eaff]/20 h-fit lg:sticky lg:top-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#00eaff]">🎛️ فیلترها</h3>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  پاک کردن همه
                </button>
              </div>

              {/* فیلتر دسته‌بندی */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">📂 دسته‌بندی</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filters.categories?.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={activeFilters.category === cat}
                        onChange={() => handleCategoryChange(cat)}
                        className="w-4 h-4 accent-[#00eaff]"
                      />
                      <span className="text-gray-300 group-hover:text-[#00eaff] transition-colors">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* فیلتر قیمت */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">💰 محدوده قیمت</h4>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="حداقل قیمت"
                    value={activeFilters.minPrice}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1b2a] border border-gray-600 rounded-lg text-white text-sm"
                  />
                  <input
                    type="number"
                    placeholder="حداکثر قیمت"
                    value={activeFilters.maxPrice}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1b2a] border border-gray-600 rounded-lg text-white text-sm"
                  />
                  <p className="text-xs text-gray-500 text-center">
                    {filters.priceRange?.minPrice?.toLocaleString("fa-IR")} - {filters.priceRange?.maxPrice?.toLocaleString("fa-IR")} تومان
                  </p>
                </div>
              </div>

              {/* فیلتر موجودی */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeFilters.inStock}
                    onChange={(e) => handleFilterChange("inStock", e.target.checked)}
                    className="w-4 h-4 accent-[#00eaff]"
                  />
                  <span className="text-gray-300">📦 فقط کالاهای موجود</span>
                </label>
              </div>

              {/* دکمه بستن در موبایل */}
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden w-full py-3 bg-[#00eaff] text-black rounded-xl font-bold mt-4"
              >
                اعمال فیلترها
              </button>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ============================================ */}
        {/* 📦 لیست محصولات */}
        {/* ============================================ */}
        <main className="flex-1">
          {/* فیلترهای اعمال شده */}
          {(activeFilters.search || activeFilters.category || activeFilters.minPrice || activeFilters.maxPrice) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilters.search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#00eaff]/20 text-[#00eaff] rounded-full text-sm">
                  🔍 {activeFilters.search}
                  <button onClick={() => handleFilterChange("search", "")} className="hover:text-white">✕</button>
                </span>
              )}
              {activeFilters.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#00eaff]/20 text-[#00eaff] rounded-full text-sm">
                  📂 {activeFilters.category}
                  <button onClick={() => handleFilterChange("category", "")} className="hover:text-white">✕</button>
                </span>
              )}
              {activeFilters.minPrice && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#00eaff]/20 text-[#00eaff] rounded-full text-sm">
                  💰 از {Number(activeFilters.minPrice).toLocaleString("fa-IR")}
                  <button onClick={() => handleFilterChange("minPrice", "")} className="hover:text-white">✕</button>
                </span>
              )}
              {activeFilters.maxPrice && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#00eaff]/20 text-[#00eaff] rounded-full text-sm">
                  💰 تا {Number(activeFilters.maxPrice).toLocaleString("fa-IR")}
                  <button onClick={() => handleFilterChange("maxPrice", "")} className="hover:text-white">✕</button>
                </span>
              )}
            </div>
          )}

          {/* گرید محصولات */}
          {products.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-[#102030] to-[#0d1b2a] rounded-2xl border-2 border-dashed border-gray-600">
              <div className="text-8xl mb-6">📭</div>
              <p className="text-3xl text-gray-400 font-bold mb-4">محصولی یافت نشد</p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-3 bg-[#00eaff] text-black rounded-xl font-bold"
              >
                پاک کردن فیلترها
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={index}
                  onAddToCart={handleAddToCart}
                  addingProduct={addingProduct}
                />
              ))}
            </div>
          )}

          {/* صفحه‌بندی */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  pagination.page === 1
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-[#00eaff]/20 text-[#00eaff] hover:bg-[#00eaff] hover:text-black"
                }`}
              >
                قبلی
              </button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter(page => {
                  return page === 1 ||
                    page === pagination.pages ||
                    Math.abs(page - pagination.page) <= 2;
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-bold transition-all ${
                        page === pagination.page
                          ? "bg-[#00eaff] text-black"
                          : "bg-[#00eaff]/20 text-[#00eaff] hover:bg-[#00eaff] hover:text-black"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  pagination.page === pagination.pages
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-[#00eaff]/20 text-[#00eaff] hover:bg-[#00eaff] hover:text-black"
                }`}
              >
                بعدی
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ============================================
// 🃏 کامپوننت کارت محصول
// ============================================
const ProductCard = ({ product, index, onAddToCart, addingProduct }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const finalPrice = hasDiscount ? product.discountPrice : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  // تایمر تخفیف
  useEffect(() => {
    if (!product.hasTimedDiscount || !product.discountEndDate) return;

    const calculateTime = () => {
      const end = new Date(product.discountEndDate);
      const now = new Date();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000)
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [product.hasTimedDiscount, product.discountEndDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -10 }}
    >
      <Link
        to={`/products/${product._id}`}
        className="block bg-gradient-to-br from-[#102030] to-[#1a3a52] rounded-2xl overflow-hidden border-2 border-[#00eaff]/20 hover:border-[#ffaa00] hover:shadow-[0_0_40px_rgba(0,234,255,0.4)] transition-all duration-300 relative"
      >
        {/* بج تخفیف */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
              {discountPercent}% تخفیف
            </span>
          </div>
        )}

        {/* تصویر */}
        <div className="relative h-56 bg-gray-800">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/400x300?text=تصویر+ندارد"}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />

          {product.stock === 0 && (
            <div className="absolute top-3 right-3 bg-red-600 text-white px-4 py-2 rounded-xl font-bold">
              ❌ ناموجود
            </div>
          )}

          {/* تایمر */}
          {timeLeft && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
              <div className="flex items-center justify-center gap-1 text-white">
                <span className="text-yellow-400 text-sm">⏰</span>
                <div className="flex gap-1 font-mono text-sm">
                  {timeLeft.days > 0 && (
                    <span className="bg-red-600 px-2 py-1 rounded">{timeLeft.days}d</span>
                  )}
                  <span className="bg-red-600 px-2 py-1 rounded">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span>:</span>
                  <span className="bg-red-600 px-2 py-1 rounded">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span>:</span>
                  <span className="bg-red-600 px-2 py-1 rounded">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* محتوا */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-[#00eaff] mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">
            {product.description || "توضیحاتی ثبت نشده"}
          </p>

          {/* قیمت */}
          <div className="flex justify-between items-center mb-4">
            {hasDiscount ? (
              <div className="flex flex-col">
                <span className="text-gray-500 line-through text-sm">
                  {product.price.toLocaleString("fa-IR")} تومان
                </span>
                <span className="text-2xl font-bold text-[#28a745]">
                  {finalPrice.toLocaleString("fa-IR")} تومان
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-[#28a745]">
                {product.price.toLocaleString("fa-IR")} تومان
              </span>
            )}
          </div>

          {/* دکمه افزودن */}
          {product.stock > 0 && (
            <button
              onClick={(e) => onAddToCart(product._id, e)}
              disabled={addingProduct === product._id}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                addingProduct === product._id
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#28a745] to-[#20c997] hover:shadow-[0_0_20px_rgba(40,167,69,0.6)]"
              } text-white`}
            >
              {addingProduct === product._id ? "⏳ در حال افزودن..." : "🛒 افزودن به سبد"}
            </button>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductList;
