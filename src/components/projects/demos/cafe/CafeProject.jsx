import React, { useState, useEffect } from 'react';

// Menu Data
const menu = {
  'نوشیدنی های گرم': { 
    items: [
      { name: 'قهوه', price: 45000 },
      { name: 'نسکافه', price: 50000 },
      { name: 'اسپرسو', price: 40000 }
    ], 
    icon: (
      <svg className="w-12 h-12 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5M17 13l1.4 5m0 0H7.6m9.8 0a2 2 0 11-4 0m4 0a2 2 0 11-4 0"></path>
      </svg>
    )
  },
  'نوشیدنی های سرد': { 
    items: [
      { name: 'آب', price: 10000 },
      { name: 'آیس کافی', price: 65000 },
      { name: 'شیر یخ', price: 55000 }
    ], 
    icon: (
      <svg className="w-12 h-12 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
      </svg>
    )
  },
  'کیک ها': { 
    items: [
      { name: 'کیک خیس', price: 70000 },
      { name: 'کیک شکلاتی', price: 75000 },
      { name: 'تیتاپ', price: 20000 }
    ], 
    icon: (
      <svg className="w-12 h-12 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v6z"></path>
      </svg>
    )
  },
  'دسر ها': { 
    items: [
      { name: 'سالاد فصل', price: 80000 },
      { name: 'سالاد سزار', price: 100000 },
      { name: 'سالاد مرغ', price: 95000 }
    ], 
    icon: (
      <svg className="w-12 h-12 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
      </svg>
    )
  }
};

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [orderCounter, setOrderCounter] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [showItemModal, setShowItemModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [orderError, setOrderError] = useState(false);

  // این صفحه یک نمونه‌کار مستقل با محتوای فارسی ثابت است و از سوییچ زبان سایت مستثناست
  useEffect(() => {
    document.title = 'کافه گاف - سیستم سفارش آنلاین';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'نمونه‌کار: سیستم سفارش آنلاین کافه با امکان انتخاب منو و ثبت سفارش');
    }
  }, []);

  useEffect(() => {
    if (currentPage === 'order') {
      const timer = setTimeout(() => {
        setShowNameModal(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const handleLogin = () => {
    const phoneRegex = /^09\d{9}$/;
    if (phoneRegex.test(phone.trim())) {
      setCurrentPage('order');
      setPhoneError(false);
    } else {
      setPhoneError(true);
    }
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setShowItemModal(true);
  };

  const getItemQuantity = (itemName) => {
    const item = shoppingCart.find(cartItem => cartItem.name === itemName);
    return item ? item.quantity : 0;
  };

  const handleQuantityChange = (item, change) => {
    const existingItem = shoppingCart.find(cartItem => cartItem.name === item.name);
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + change;
      
      if (newQuantity <= 0) {
        setShoppingCart(shoppingCart.filter(cartItem => cartItem.name !== item.name));
      } else {
        setShoppingCart(shoppingCart.map(cartItem => 
          cartItem.name === item.name 
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        ));
      }
    } else if (change > 0) {
      setShoppingCart([...shoppingCart, { ...item, quantity: 1 }]);
    }
  };

  const sendOrderNotification = () => {
    let invoiceText = '';
    let totalPrice = 0;
    shoppingCart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      invoiceText += `${item.name} × ${item.quantity} = ${itemTotal.toLocaleString('fa-IR')} تومان\n`;
      totalPrice += itemTotal;
    });

    const formData = new FormData();
    formData.append('نام مشتری', customerName || 'ثبت نشده');
    formData.append('شماره نوبت', orderCounter);
    formData.append('شماره تلفن', phone);
    formData.append('فاکتور', invoiceText);
    formData.append('مبلغ کل', totalPrice.toLocaleString('fa-IR') + ' تومان');
    formData.append('_subject', 'سفارش جدید کافه گاف: نوبت ' + orderCounter);

    fetch('https://formspree.io/f/mnnzdaob', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        console.log('سفارش با موفقیت ارسال شد');
      } else {
        console.log('خطا در ارسال سفارش');
      }
    }).catch(error => {
      console.error('خطا:', error);
    });
  };

  const handleConfirmOrder = () => {
    if (shoppingCart.length === 0) {
      setOrderError(true);
      setTimeout(() => setOrderError(false), 3000);
      return;
    }
    setCurrentPage('confirmation');
    sendOrderNotification();
    setOrderCounter(orderCounter + 1);
  };

  const handleNewOrder = () => {
    setShoppingCart([]);
    setCustomerName('');
    setPhone('');
    setCurrentPage('login');
  };

  const totalPrice = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{
      fontFamily: 'Vazirmatn, sans-serif',
      background: 'linear-gradient(to bottom right, #F5EFE6, #E8DFD5)'
    }} dir="rtl">
      
      {/* Login Page */}
      {currentPage === 'login' && (
        <div className="w-full max-w-sm">
          <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl p-8 space-y-6 border border-white/20">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-stone-800">کافه گاف</h1>
              <p className="text-stone-600 mt-2">خوش آمدید</p>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-2">شماره تلفن</label>
              <input 
                type="tel" 
                id="phone" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثال: 09123456789" 
                className="w-full px-4 py-3 bg-white/80 border-2 border-stone-300 rounded-lg focus:ring-stone-500 focus:border-stone-500 transition duration-300"
              />
              {phoneError && (
                <p className="text-red-500 text-sm mt-1">لطفا یک شماره تلفن معتبر وارد کنید.</p>
              )}
            </div>
            <button 
              onClick={handleLogin}
              className="w-full bg-stone-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-700 transition duration-300 shadow-lg"
            >
              ورود و ثبت سفارش
            </button>
          </div>
        </div>
      )}

      {/* Order Page */}
      {currentPage === 'order' && (
        <div className="w-full max-w-4xl">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-stone-800">منو کافه گاف</h2>
              <p className="text-stone-600 mt-2">لطفا دسته بندی مورد نظر خود را برای انتخاب آیتم کلیک کنید</p>
              {totalItems > 0 && (
                <div className="mt-4 inline-block bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                  <span className="font-bold">{totalItems}</span> آیتم در سبد خرید
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.keys(menu).map((categoryName) => (
                <div 
                  key={categoryName}
                  onClick={() => handleCategoryClick(categoryName)}
                  className="bg-white/60 p-6 rounded-2xl shadow-md flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {menu[categoryName].icon}
                  <h3 className="text-stone-800 text-xl font-bold text-center mt-4">{categoryName}</h3>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button 
                onClick={handleConfirmOrder}
                className="bg-green-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition duration-300 shadow-lg"
              >
                تایید نهایی و ثبت سفارش
              </button>
              {orderError && (
                <p className="text-red-500 text-sm mt-2">سبد خرید شما خالی است. لطفا ابتدا یک آیتم انتخاب کنید.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Page */}
      {currentPage === 'confirmation' && (
        <div className="w-full max-w-md text-center">
          <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl p-8 space-y-4 border border-white/20">
            <h2 className="text-2xl font-bold text-green-700">سفارش شما با موفقیت ثبت شد!</h2>
            <p className="text-stone-700">از خرید شما سپاسگزاریم.</p>
            <div className="pt-4 text-right border-t border-stone-300 mt-4">
              <p className="text-lg text-stone-800 font-bold mb-2">فاکتور خرید:</p>
              <ul className="space-y-2 text-stone-700">
                {shoppingCart.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="bg-stone-200 text-stone-800 px-2 py-1 rounded text-sm font-bold">×{item.quantity}</span>
                      <span>{item.name}</span>
                    </span>
                    <span className="font-bold">{(item.price * item.quantity).toLocaleString('fa-IR')} تومان</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-stone-300 mt-3 pt-3 flex justify-between items-center">
                <p className="text-lg font-bold text-stone-800">جمع کل:</p>
                <p className="text-lg font-bold text-stone-900">{totalPrice.toLocaleString('fa-IR')} تومان</p>
              </div>
            </div>
            <div className="pt-4">
              <p className="text-lg text-stone-800">شماره نوبت شما:</p>
              <p className="text-6xl font-bold text-stone-800 py-4">{orderCounter - 1}</p>
            </div>
            <button 
              onClick={handleNewOrder}
              className="w-full bg-stone-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-700 transition duration-300 shadow-lg mt-4"
            >
              ثبت سفارش جدید
            </button>
          </div>
        </div>
      )}

      {/* Item Selection Modal */}
      {showItemModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
          onClick={() => setShowItemModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-stone-800 mb-4">انتخاب از {selectedCategory}</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {menu[selectedCategory]?.items.map((item, index) => {
                const quantity = getItemQuantity(item.name);
                return (
                  <div key={index} className="p-3 rounded-lg border-2 border-stone-200 hover:border-stone-400 transition">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold text-gray-800">{item.name}</span>
                      <span className="text-md text-stone-600">{item.price.toLocaleString('fa-IR')} تومان</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-stone-100 rounded-lg p-1">
                        <button 
                          onClick={() => handleQuantityChange(item, -1)}
                          disabled={quantity === 0}
                          className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-bold transition"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-bold text-stone-800">{quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item, 1)}
                          className="w-8 h-8 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition"
                        >
                          +
                        </button>
                      </div>
                      
                      {quantity > 0 && (
                        <span className="text-sm font-bold text-green-700">
                          {(item.price * quantity).toLocaleString('fa-IR')} تومان
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 text-left">
              <button 
                onClick={() => setShowItemModal(false)}
                className="bg-stone-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-stone-800 transition duration-300"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Name Input Modal */}
      {showNameModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
          onClick={() => setShowNameModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-stone-800 mb-4">آه راستی، اسمت چی بود؟</h3>
            <input 
              type="text" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="نام و نام خانوادگی" 
              className="w-full px-4 py-3 bg-white/80 border-2 border-stone-300 rounded-lg focus:ring-stone-500 focus:border-stone-500 transition duration-300 mb-4"
            />
            <button 
              onClick={() => setShowNameModal(false)}
              className="w-full bg-stone-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-stone-800 transition duration-300"
            >
              ثبت اسم
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
