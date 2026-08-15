// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// ===== آیکون‌های SVG =====
const SparklesIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/>
  </svg>
);

const FireIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd"/>
  </svg>
);

const StarIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"/>
  </svg>
);

const ShoppingCartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
  </svg>
);

const BoltIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd"/>
  </svg>
);

const DiamondIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L2 9l10 13 10-13-10-7z"/>
  </svg>
);

// ===== تابع استخراج Rating =====
const getRatingValue = (rating) => {
  if (rating === null || rating === undefined) return 0;
  if (typeof rating === 'number') return rating;
  if (typeof rating === 'object' && rating.average !== undefined) {
    return rating.average;
  }
  if (typeof rating === 'string') {
    const parsed = parseFloat(rating);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// ===== کامپوننت کارت محصول =====
const ProductCard = ({ product }) => {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const ratingValue = getRatingValue(product.rating);

  return (
    <Link
      to={`/products/${product._id}`}
      className="group block relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl overflow-hidden border border-gray-800/50 hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* تصویر */}
      <div className="relative h-52 bg-gradient-to-br from-[#0d1b2a] to-[#1a1a2e] overflow-hidden">
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-50">📦</span>
          </div>
        )}

        {/* Overlay گرادیانت */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent" />

        {/* بج‌ها */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="flex items-center gap-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-pink-500/30">
              <FireIcon className="w-3 h-3" />
              {product.discountPercent}% تخفیف
            </span>
          )}</div>

        {product.status === 'new' && (
          <span className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-cyan-500/30">
            <SparklesIcon className="w-3 h-3" />
            جدید
          </span>
        )}
      </div>

      {/* اطلاعات */}
      <div className="relative p-5">
        {/* دسته‌بندی */}
        <span className="inline-block text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md mb-2">
          {product.category}
        </span>

        {/* نام محصول */}
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">
          {product.name}
        </h3>

        {/* توضیحات */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* ستاره‌ها */}
        {ratingValue > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(ratingValue) ? 'text-yellow-400' : 'text-gray-600'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span className="text-gray-400 text-sm">({ratingValue.toFixed(1)})</span>
          </div>
        )}

        {/* قیمت */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-gray-500 line-through text-sm">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 font-black text-xl">
                  {product.discountPrice.toLocaleString()} تومان
                </span>
              </>
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-black text-xl">
                {product.price.toLocaleString()} تومان
              </span>
            )}
          </div>

          {/* دکمه خرید */}
          <button className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-110">
            <ShoppingCartIcon />
          </button>
        </div>
      </div>
    </Link>
  );
};

// ===== کامپوننت اسلایدر =====
const ProductSlider = ({ title, products, icon, gradient }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="mb-16">
      {/* هدر سکشن */}
      <div className="flex items-center gap-3 mb-8">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg`}>
          {icon}
        </div>
        <h2 className="text-2xl font-black text-white">{title}</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-transparent mr-4" />
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="pb-14 product-slider"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// ===== صفحه اصلی =====
const Home = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('/products');
        let allProducts = [];

        if (Array.isArray(response.data)) {
          allProducts = response.data;
        } else if (response.data.products) {
          allProducts = response.data.products;
        } else if (response.data.data) {
          allProducts = response.data.data;
        }

        const activeProducts = allProducts.filter(p => p.isActive !== false);

        const latest = [...activeProducts]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);

        const discounted = activeProducts.filter(
          p => p.status === 'discount' || (p.discountPrice && p.discountPrice < p.price)
        );

        setLatestProducts(latest);
        setDiscountProducts(discounted);
      } catch (err) {
        console.error('❌ خطا:', err);
        setError(err.response?.data?.message || 'خطا در دریافت محصولات');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // لودینگ
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-cyan-500/30 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-cyan-400 mt-6 text-lg font-medium">در حال بارگذاری...</p>
      </div>
    );
  }

  // خطا
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">❌</span>
        </div>
        <p className="text-red-400 text-xl mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ===== Hero Section ===== */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div><div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/30 mb-8">
              <SparklesIcon />
              <span className="text-cyan-400 text-sm font-medium">فروشگاه نسل جدید</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              <span className="text-white">به </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                MartNeo
              </span>
              <span className="text-white"> خوش آمدید</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed">
              بهترین محصولات با بهترین قیمت‌ها، تجربه خریدی متفاوت و هوشمند
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/products"
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                <ShoppingCartIcon />
                <span>مشاهده محصولات</span>
                <ArrowLeftIcon className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/categories"
                className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-gray-700 text-white rounded-xl font-bold hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300"
              >
                <SparklesIcon />
                <span>دسته‌بندی‌ها</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl border border-gray-800">
                <DiamondIcon className="text-cyan-400" />
                <div className="text-right">
                  <div className="text-white font-bold">+500</div>
                  <div className="text-gray-500 text-sm">محصول</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl border border-gray-800">
                <StarIcon className="text-yellow-400" />
                <div className="text-right">
                  <div className="text-white font-bold">+10K</div>
                  <div className="text-gray-500 text-sm">مشتری راضی</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl border border-gray-800">
                <BoltIcon className="text-purple-400" />
                <div className="text-right">
                  <div className="text-white font-bold">24h</div>
                  <div className="text-gray-500 text-sm">تحویل سریع</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Products Sections ===== */}
      <section className="container mx-auto px-4 py-12">
        {/* تخفیف‌های ویژه */}
        {discountProducts.length > 0 && (
          <ProductSlider
            title="تخفیف‌های ویژه"
            products={discountProducts}
            icon={<FireIcon className="w-6 h-6 text-white" />}
            gradient="from-pink-500 to-rose-500 shadow-pink-500/30"
          />
        )}

        {/* جدیدترین محصولات */}
        {latestProducts.length > 0 && (
          <ProductSlider
            title="جدیدترین محصولات"
            products={latestProducts}
            icon={<SparklesIcon className="w-6 h-6 text-white" />}
            gradient="from-cyan-500 to-blue-500 shadow-cyan-500/30"
          />
        )}

        {/* اگر محصولی نبود */}
        {latestProducts.length === 0 && discountProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">📦</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">هنوز محصولی ثبت نشده!</h3>
            <p className="text-gray-400 mb-8">اولین محصول رو اضافه کن</p>
            <Link
              to="/admin/products/create"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              ➕ افزودن محصول
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
