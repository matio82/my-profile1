// src/components/ProductCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

// ============================================================
// 🛒 ProductCard Component - Nexus Style
// ============================================================

const ProductCard = ({ product, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // ==================== Helper Functions ====================
  
  /**
   * استخراج امن مقدار rating
   * @param {number|object} rating - مقدار rating که می‌تواند عدد یا آبجکت باشد
   * @returns {number} مقدار عددی rating
   */
  const getRatingValue = (rating) => {
    if (typeof rating === 'number') return rating;
    if (rating && typeof rating === 'object' && typeof rating.average === 'number') {
      return rating.average;
    }
    return 0;
  };

  /**
   * استخراج تعداد نظرات
   * @param {number|object} rating
   * @returns {number}
   */
  const getRatingCount = (rating) => {
    if (rating && typeof rating === 'object' && typeof rating.count === 'number') {
      return rating.count;
    }
    return 0;
  };

  // ==================== Computed Values ====================
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const ratingValue = getRatingValue(product.rating);
  const ratingCount = getRatingCount(product.rating);
  const isNew = product.status === 'new' || product.isNew;
  const isTrending = product.isTrending || product.status === 'trending';

  // ==================== Image URL ====================
  const imageUrl = product.images?.[0] || product.image || null;

  return (
    <Link
      to={`/products/${product._id}`}
      className="product-card group relative block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 0.1}s`
      }}
    >
      <div className="
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-[#1a2d42] to-[#0d1b2a]
        border border-[#0d324d]/50
        transition-all duration-500 ease-out
        hover:border-[#00eaff]/50
        hover:shadow-[0_0_40px_rgba(0,234,255,0.15)]
        hover:-translate-y-2">
        
        {/* ==================== Hover Glow Effect ==================== */}
        <div 
          className={`
            absolute inset-0 pointer-events-none transition-opacity duration-500
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            background: 'radial-gradient(circle at center, rgba(0,234,255,0.1), transparent 70%)'
          }}
        />

        {/* ==================== Badges ==================== */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {/* تخفیف */}
          {hasDiscount && (
            <span className="
              inline-flex items-center gap-1 px-2.5 py-1
              text-xs font-bold text-white rounded-full
              bg-gradient-to-r from-red-500 to-pink-500
              shadow-lg shadow-red-500/30
            ">
              <FireIcon className="w-3 h-3" />
              {discountPercent}% تخفیف
            </span>
          )}
          {/* جدید */}
          {isNew && (
            <span className="
              inline-flex items-center gap-1 px-2.5 py-1
              text-xs font-bold text-white rounded-full
              bg-gradient-to-r from-[#00eaff] to-[#3a7bd5]
              shadow-lg shadow-[#00eaff]/30
            ">
              <SparklesIcon className="w-3 h-3" />
              جدید
            </span>
          )}

          {/* ترند */}
          {isTrending && (
            <span className="
              inline-flex items-center gap-1 px-2.5 py-1
              text-xs font-bold rounded-full
              bg-purple-500/20 text-purple-300
              border border-purple-500/30
            ">
              <TrendingIcon className="w-3 h-3" />
              پرطرفدار
            </span>
          )}
        </div>

        {/* ==================== Product Image ==================== */}
        <div className="relative aspect-square overflow-hidden bg-[#0d1b2a]">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={product.name}
              className={`
                w-full h-full object-cover
                transition-transform duration-700 ease-out
                ${isHovered ? 'scale-110' : 'scale-100'}
              `}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-50">📦</span>
            </div>
          )}

          {/* Overlay Gradient */}
          <div className="
            absolute inset-0 
            bg-gradient-to-t from-[#0d1b2a] via-transparent to-transparent
            pointer-events-none
          " />

          {/* Quick Action Button */}
          <div className={`
            absolute bottom-4 right-4 
            transition-all duration-300
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}>
            <span className="
              inline-flex items-center gap-2 px-4 py-2
              text-sm font-bold text-white rounded-xl
              bg-gradient-to-r from-[#00eaff] to-[#3a7bd5]
              shadow-lg shadow-[#00eaff]/30
            ">
              <EyeIcon className="w-4 h-4" />
              مشاهده
            </span>
          </div>
        </div>

        {/* ==================== Content ==================== */}
        <div className="p-5 space-y-3">
          
          {/* Category */}
          {product.category && (
            <span className="
              inline-block px-2 py-1 text-xs rounded-md
              bg-[#00eaff]/10 text-[#00eaff]/80
              border border-[#00eaff]/20
            ">
              {product.category}
            </span>
          )}

          {/* Product Name */}
          <h3 className="
            text-lg font-bold text-white line-clamp-1
            group-hover:text-[#00eaff] transition-colors duration-300
          ">
            {product.name}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-400 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Rating */}
          {ratingValue > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(ratingValue)
                        ? 'text-[#00eaff] fill-[#00eaff]'
                        : 'text-gray-600'
                    }`}
                    filled={i < Math.floor(ratingValue)}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400">
                {ratingValue.toFixed(1)}
                {ratingCount > 0 && (
                  <span className="text-gray-500 mr-1">({ratingCount})</span>
                )}
              </span>
            </div>
          )}

          {/* Price Section */}
          <div className="flex items-center justify-between pt-2 border-t border-[#0d324d]/50">
            <div className="flex flex-col">
              {hasDiscount ? (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    {product.price.toLocaleString('fa-IR')} تومان
                  </span>
                  <span className="text-xl font-black text-green-400">
                    {product.discountPrice.toLocaleString('fa-IR')} تومان
                  </span>
                </>
              ) : (
                <span className="text-xl font-black text-[#00eaff]">
                  {product.price.toLocaleString('fa-IR')} تومان
                </span>
              )}
            </div>

            {/* Cart Icon */}
            <div className={`
              p-2.5 rounded-xl
              bg-gradient-to-r from-[#00eaff]/20 to-[#3a7bd5]/20
              border border-[#00eaff]/30
              transition-all duration-300
              group-hover:from-[#00eaff] group-hover:to-[#3a7bd5]
              group-hover:shadow-lg group-hover:shadow-[#00eaff]/30
            `}>
              <CartIcon className="w-5 h-5 text-[#00eaff] group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

// ============================================================
// 🎨 SVG Icons
// ============================================================

function StarIcon({ className = '', filled = false }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill={filled ? 'currentColor' : 'none'} 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function FireIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-4.83 3.15-6.35.92-.7 2.15-.15 2.35 1.02.12.68.52 1.28 1.08 1.64.56.36 1.24.47 1.88.3.64-.17 1.18-.58 1.5-1.14.32-.56.4-1.22.22-1.84-.18-.62-.58-1.14-1.12-1.44-.54-.3-1.18-.36-1.76-.16-.58.2-1.06.62-1.32 1.16-.26.54-.28 1.16-.06 1.72.22.56.64 1.02 1.18 1.28.54.26 1.16.3 1.72.1.56-.2 1.02-.6 1.28-1.14.26-.54.3-1.16.1-1.72-.2-.56-.6-1.02-1.14-1.28C10.5 6.5 9.5 6 8.5 6c-2.21 0-4 1.79-4 4 0 3.31 2.69 6 6 6s6-2.69 6-6c0-1.1-.45-2.1-1.17-2.83-.72-.73-1.72-1.17-2.83-1.17-1.1 0-2.1.45-2.83 1.17C9.45 7.9 9 8.9 9 10c0 1.66 1.34 3 3 3s3-1.34 3-3c0-.55-.45-1-1-1s-1 .45-1 1c0 .55-.45 1-1 1s-1-.45-1-1c0-1.66 1.34-3 3-3s3 1.34 3 3c0 3.31-2.69 6-6 6z"/>
    </svg>
  );
}

function SparklesIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
      <path d="M19 12l1 2 1-2 2-1-2-1-1-2-1 2-2 1 2 1z" />
    </svg>
  );
}

function TrendingIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function EyeIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CartIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
