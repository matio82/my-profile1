import { useState, useEffect } from 'react';

// 🛒 دموی پروژه واقعی «فروشگاه آنلاین MartNeo»
// (ریپوهای اصلی: e-shop-frontend + e-shop-backend)
//
// طبق چیزی که خواستید: این فقط UI فروشگاهه، با داده نمونه (mock)، بدون اتصال به
// بک‌اند واقعی. هیچ سفارش واقعی ثبت نمی‌شه، لاگین/ثبت‌نام واقعی نیست، و پنل ادمین
// و پروفایل مشتری اصلاً این‌جا نیست - فقط بخش ویترین فروشگاه که مخاطب می‌بینه.

const CATEGORIES = ['همه', 'الکترونیک', 'پوشاک', 'کتاب', 'لوازم خانگی', 'ورزشی', 'آرایشی و بهداشتی', 'اسباب بازی', 'مواد غذایی'];

const CATEGORY_ICONS = {
  'الکترونیک': '💻', 'پوشاک': '👕', 'کتاب': '📚', 'لوازم خانگی': '🏠',
  'ورزشی': '⚽', 'آرایشی و بهداشتی': '💄', 'اسباب بازی': '🧸', 'مواد غذایی': '🍔',
};

const sampleProducts = [
  { id: 1, name: 'هدفون بی‌سیم Pro', category: 'الکترونیک', price: 2450000, discountPrice: 1890000, rating: 4.6, status: 'discount', emoji: '🎧' },
  { id: 2, name: 'ساعت هوشمند X2', category: 'الکترونیک', price: 5200000, rating: 4.8, status: 'new', emoji: '⌚' },
  { id: 3, name: 'کاپشن زمستانی', category: 'پوشاک', price: 1350000, discountPrice: 990000, rating: 4.3, status: 'discount', emoji: '🧥' },
  { id: 4, name: 'رمان هزار خورشید تابان', category: 'کتاب', price: 320000, rating: 4.9, status: 'new', emoji: '📖' },
  { id: 5, name: 'اسپرسوساز خانگی', category: 'لوازم خانگی', price: 3800000, rating: 4.5, status: 'normal', emoji: '☕' },
  { id: 6, name: 'توپ فوتبال حرفه‌ای', category: 'ورزشی', price: 680000, rating: 4.2, status: 'normal', emoji: '⚽' },
  { id: 7, name: 'ست آرایشی طبیعی', category: 'آرایشی و بهداشتی', price: 890000, discountPrice: 690000, rating: 4.7, status: 'discount', emoji: '💄' },
  { id: 8, name: 'عروسک خرس پولیشی', category: 'اسباب بازی', price: 410000, rating: 4.4, status: 'new', emoji: '🧸' },
  { id: 9, name: 'کیف لپ‌تاپ چرمی', category: 'پوشاک', price: 750000, rating: 4.1, status: 'normal', emoji: '💼' },
];

const formatPrice = (price) => price.toLocaleString('fa-IR') + ' تومان';

const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="text-gray-400 text-xs">({rating})</span>
  </div>
);

const ProductCard = ({ product, onSelect }) => {
  const hasDiscount = !!product.discountPrice;
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="group text-right block relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl overflow-hidden border border-gray-800/50 hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/20"
    >
      <div className="relative h-40 bg-gradient-to-br from-[#0d1b2a] to-[#1a1a2e] flex items-center justify-center">
        <span className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-500">{product.emoji}</span>

        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg shadow-pink-500/30">
            🔥 تخفیف
          </span>
        )}
        {product.status === 'new' && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg shadow-cyan-500/30">
            ✨ جدید
          </span>
        )}
      </div>

      <div className="p-4">
        <span className="inline-block text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md mb-2">
          {product.category}
        </span>
        <h3 className="text-white font-bold mb-1 line-clamp-1 group-hover:text-cyan-400 transition-colors">
          {product.name}
        </h3>
        <div className="mb-3"><Stars rating={product.rating} /></div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
          {hasDiscount ? (
            <div className="flex flex-col">
              <span className="text-gray-500 line-through text-xs">{formatPrice(product.price)}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 font-black">
                {formatPrice(product.discountPrice)}
              </span>
            </div>
          ) : (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-black">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

function EshopDemo() {
  const [activeCategory, setActiveCategory] = useState('همه');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  useEffect(() => {
    document.title = 'MartNeo - فروشگاه آنلاین (نمونه پروژه)';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'نمونه‌کار: فروشگاه اینترنتی MartNeo - ویترین محصولات، دسته‌بندی و سبد خرید');
    }
  }, []);

  const filteredProducts = activeCategory === 'همه'
    ? sampleProducts
    : sampleProducts.filter((p) => p.category === activeCategory);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setSelectedProduct(null);
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

  const total = cart.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.qty, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleFakeCheckout = () => {
    setConfirmation(true);
    setCart([]);
    setShowCart(false);
    setTimeout(() => setConfirmation(false), 3000);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#0d1117] text-white">
      {/* هدر */}
      <header className="sticky top-0 z-20 bg-[#0d1117]/90 backdrop-blur border-b border-gray-800/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-black">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">MartNeo</span>
          </span>
          <button
            onClick={() => setShowCart(true)}
            type="button"
            className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/40 transition-all"
          >
            🛒 سبد خرید
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-pink-500 text-xs">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/30 mb-6">
            <span className="text-cyan-400 text-sm font-medium">✨ فروشگاه نسل جدید</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4">
            به <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">MartNeo</span> خوش آمدید
          </h1>
          <p className="text-gray-400 mb-8">بهترین محصولات با بهترین قیمت‌ها، تجربه خریدی متفاوت و هوشمند</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="px-5 py-2.5 bg-white/5 rounded-xl border border-gray-800 text-sm">
              <span className="font-bold text-white">+۵۰۰</span> <span className="text-gray-500">محصول</span>
            </div>
            <div className="px-5 py-2.5 bg-white/5 rounded-xl border border-gray-800 text-sm">
              <span className="font-bold text-white">+۱۰K</span> <span className="text-gray-500">مشتری راضی</span>
            </div>
            <div className="px-5 py-2.5 bg-white/5 rounded-xl border border-gray-800 text-sm">
              <span className="font-bold text-white">۲۴h</span> <span className="text-gray-500">تحویل سریع</span>
            </div>
          </div>
        </div>
      </section>

      {/* دسته‌بندی‌ها */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              type="button"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-white/5 text-gray-400 border border-gray-800 hover:border-cyan-500/50'
              }`}
            >
              {CATEGORY_ICONS[cat] ? `${CATEGORY_ICONS[cat]} ` : ''}{cat}
            </button>
          ))}
        </div>
      </div>

      {/* محصولات */}
      <main className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 py-16">محصولی توی این دسته نیست</p>
        )}
      </main>

      {/* مودال جزئیات محصول */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-[#151b2b] border border-gray-800 rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-40 bg-gradient-to-br from-[#0d1b2a] to-[#1a1a2e] rounded-xl flex items-center justify-center mb-4">
              <span className="text-7xl">{selectedProduct.emoji}</span>
            </div>
            <span className="inline-block text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md mb-2">
              {selectedProduct.category}
            </span>
            <h3 className="text-xl font-bold mb-2">{selectedProduct.name}</h3>
            <div className="mb-4"><Stars rating={selectedProduct.rating} /></div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-black text-2xl mb-6">
              {formatPrice(selectedProduct.discountPrice || selectedProduct.price)}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => addToCart(selectedProduct)}
                type="button"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 font-bold hover:shadow-lg hover:shadow-cyan-500/40 transition-all"
              >
                افزودن به سبد
              </button>
              <button
                onClick={() => setSelectedProduct(null)}
                type="button"
                className="px-5 py-3 rounded-xl bg-white/5 border border-gray-700 text-gray-300"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* سبد خرید */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 z-30 flex justify-end" onClick={() => setShowCart(false)}>
          <div
            className="bg-[#151b2b] border-l border-gray-800 w-full max-w-sm h-full p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">سبد خرید</h3>
              <button onClick={() => setShowCart(false)} type="button" className="text-gray-400">✕</button>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-10">سبد خریدتون خالیه</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 border-b border-gray-800 pb-4">
                      <div className="text-3xl">{item.emoji}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.qty} × {formatPrice(item.discountPrice || item.price)}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} type="button" className="text-red-400 text-sm">
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between font-bold mb-4">
                  <span>جمع کل</span>
                  <span className="text-cyan-400">{formatPrice(total)}</span>
                </div>
                <button
                  onClick={handleFakeCheckout}
                  type="button"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 font-bold hover:shadow-lg hover:shadow-cyan-500/40 transition-all"
                >
                  ثبت سفارش (نمایشی)
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {confirmation && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg z-40 text-sm font-semibold">
          ✅ این یه دموی نمایشیه - سفارش واقعی ثبت نشد
        </div>
      )}
    </div>
  );
}

export default EshopDemo;
