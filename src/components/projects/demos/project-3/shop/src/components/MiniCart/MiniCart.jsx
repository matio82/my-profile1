import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import './MiniCart.css';

const MiniCart = ({ isOpen, onClose }) => {
  const {
    cartItems,
    getItemFinalPrice,
    getTotalPrice,
    getTotalSavings,
    updateQuantity,
    removeFromCart,
  } = useContext(CartContext);

  // ⛔ جلوگیری از اسکرول صفحه
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [isOpen]);

  // ⌨ ESC
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose();
    if (isOpen) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  return (
    <>
      <div className={`mini-cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />

      <aside className={`mini-cart ${isOpen ? 'open' : ''}`}>
        <header className="mini-cart-header">
          <h3>🛒 سبد خرید</h3>
          <button onClick={onClose}>✕</button>
        </header>

        {cartItems.length === 0 ? (
          <div className="mini-cart-empty">
            سبد خرید شما خالی است 🌱
          </div>
        ) : (
          <>
            <div className="mini-cart-items">
              {cartItems.map((item) => {
                const product = item.product;
                const finalPrice = getItemFinalPrice(item);

                return (
                  <div key={item._id} className="mini-cart-item">
                    <img src={product.image} alt={product.name} />

                    <div className="info">
                      <h4>{product.name}</h4>
                      <div className="price">
                        {finalPrice.toLocaleString()} تومان
                      </div>

                      <div className="quantity">
                        <button onClick={() => updateQuantity(product._id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(product._id, item.quantity + 1)}>+</button>
                      </div>
                    </div>

                    <button
                      className="remove"
                      onClick={() => removeFromCart(product._id)}
                    >
                      🗑
                    </button>
                  </div>
                );
              })}
            </div>

            <footer className="mini-cart-footer">
              <div className="summary">
                <div>
                  <span>جمع کل:</span>
                  <strong>{getTotalPrice().toLocaleString()} تومان</strong>
                </div>

                {getTotalSavings() > 0 && (
                  <div className="savings">
                    🎁 شما {getTotalSavings().toLocaleString()} تومان صرفه‌جویی کردید
                  </div>
                )}
              </div>

              <div className="actions">
                <Link to="/cart" onClick={onClose}>مشاهده سبد</Link>
                <Link to="/checkout" className="primary" onClick={onClose}>
                  پرداخت
                </Link>
              </div>
            </footer>
          </>
        )}
      </aside>
    </>
  );
};

export default MiniCart;
