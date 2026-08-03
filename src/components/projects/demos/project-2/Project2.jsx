import { useState, useEffect } from 'react';

// 🛍️ این یه TEMPLATE برای پروژه‌های فروشگاهی‌ه که بک‌اند سنگین دارن و به سرور واقعی وصلن.
// طبق چیزی که خواستید: فقط ویترین محصولات و سبد خرید (نمایشی) نشون داده می‌شه،
// بدون پروفایل مشتری، بدون لاگین، بدون اتصال واقعی به دیتابیس یا سرور.
//
// برای استفاده واقعی:
// ۱. آرایه sampleProducts رو با محصولات واقعی پروژه‌تون جایگزین کنید (اسم، قیمت، عکس)
// ۲. اسم فروشگاه و رنگ‌بندی رو مطابق پروژه اصلی عوض کنید
// ۳. اگه می‌خواید عکس واقعی محصولات رو نشون بدید، عکس‌ها رو توی
//    public/images/projects/project-2/ بذارید و مسیرشون رو این‌جا ارجاع بدید

const sampleProducts = [
  { id: 1, name: 'محصول نمونه ۱', price: 450000, category: 'دسته ۱', emoji: '👕' },
  { id: 2, name: 'محصول نمونه ۲', price: 890000, category: 'دسته ۲', emoji: '👟' },
  { id: 3, name: 'محصول نمونه ۳', price: 320000, category: 'دسته ۱', emoji: '🎒' },
  { id: 4, name: 'محصول نمونه ۴', price: 1250000, category: 'دسته ۳', emoji: '⌚' },
  { id: 5, name: 'محصول نمونه ۵', price: 275000, category: 'دسته ۲', emoji: '🧢' },
  { id: 6, name: 'محصول نمونه ۶', price: 560000, category: 'دسته ۳', emoji: '🕶️' },
];

const formatPrice = (price) => price.toLocaleString('fa-IR') + ' تومان';

function Project2() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  // این صفحه مثل کافه گاف، یه دموی مستقله و از سوییچ زبان سایت مستثناست
  useEffect(() => {
    document.title = 'فروشگاه آنلاین (نمونه) - مهدی';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'نمونه‌کار: ویترین محصولات و سبد خرید فروشگاه آنلاین');
    }
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // این فقط یه نمایشه - هیچ سفارش واقعی ثبت یا به سروری ارسال نمی‌شه
  const handleFakeCheckout = () => {
    setConfirmation(true);
    setCart([]);
    setTimeout(() => setConfirmation(false), 3000);
    setShowCart(false);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-stone-50 text-stone-800">
      {/* هدر */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">فروشگاه نمونه</h1>
          <button
            onClick={() => setShowCart(true)}
            className="relative px-4 py-2 rounded-full bg-stone-800 text-white text-sm font-semibold"
            type="button"
          >
            سبد خرید
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-xs">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ویترین محصولات */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-8">محصولات</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {sampleProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-5xl mb-4">{product.emoji}</div>
              <h3 className="font-semibold mb-1">{product.name}</h3>
              <p className="text-xs text-stone-400 mb-2">{product.category}</p>
              <p className="font-bold text-stone-700 mb-4">{formatPrice(product.price)}</p>
              <button
                onClick={() => addToCart(product)}
                className="w-full py-2 rounded-lg bg-stone-800 text-white text-sm font-semibold hover:bg-stone-700 transition-colors"
                type="button"
              >
                افزودن به سبد
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* سبد خرید (نمایشی) */}
      {showCart && (
        <div className="fixed inset-0 bg-black/40 z-30 flex justify-end" onClick={() => setShowCart(false)}>
          <div
            className="bg-white w-full max-w-sm h-full p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">سبد خرید</h3>
              <button onClick={() => setShowCart(false)} type="button" className="text-stone-400">✕</button>
            </div>

            {cart.length === 0 ? (
              <p className="text-stone-400 text-center py-10">سبد خریدتون خالیه</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 border-b border-stone-100 pb-4">
                      <div className="text-3xl">{item.emoji}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-stone-400">{item.qty} × {formatPrice(item.price)}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        type="button"
                        className="text-red-400 text-sm"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between font-bold mb-4">
                  <span>جمع کل</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <button
                  onClick={handleFakeCheckout}
                  type="button"
                  className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                >
                  ثبت سفارش (نمایشی)
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* پیام تایید (نمایشی) */}
      {confirmation && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-40">
          ✅ این یه دموی نمایشیه - سفارش واقعی ثبت نشد
        </div>
      )}
    </div>
  );
}

export default Project2;
