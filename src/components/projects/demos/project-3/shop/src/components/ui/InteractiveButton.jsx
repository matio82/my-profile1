// src/components/ui/InteractiveButton.jsx
import React from 'react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════
// 🎯 Interactive Button with Physics
// ═══════════════════════════════════════════════════════════
export const InteractiveButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  ...props
}) => {
  // Variants
  const variants = {
    primary: 'bg-gradient-to-r from-[#00eaff] to-[#3a7bd5] text-white shadow-cyan-500/25',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white',
    success: 'bg-gradient-to-r from-[#28a745] to-[#20c997] text-white shadow-green-500/25',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/25',
    ghost: 'bg-transparent border-2 border-[#00eaff]/50 text-[#00eaff] hover:bg-[#00eaff]/10',
    wishlist: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-500/25'
  };

  // Sizes
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden
        ${variants[variant]}
        ${sizes[size]}
        rounded-xl font-bold
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      whileHover={{ 
        scale: disabled ? 1 : 1.02,
        boxShadow: disabled ? undefined : '0 10px 40px rgba(0,0,0,0.3)'
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.95,
        rotate: disabled ? 0 : [-1, 1, 0]
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
      {...props}
    >
      {/* Ripple Effect */}
      <motion.span
        className="absolute inset-0 bg-white/20"
        initial={{ scale: 0, opacity: 1 }}
        whileTap={{ scale: 4, opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{ borderRadius: '50%', transformOrigin: 'center' }}
      />

      {/* Content */}
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            ⏳
          </motion.span>
        ) : icon ? (
          <motion.span
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.2, rotate: 10 }}
          >
            {icon}
          </motion.span>
        ) : null}
        {children}
      </span>
    </motion.button>
  );
};

// ═══════════════════════════════════════════════════════════
// ❤️ Wishlist Heart Button with Animation
// ═══════════════════════════════════════════════════════════
export const WishlistButton = ({ isInWishlist, onClick, loading, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      className={`
        ${sizeClasses[size]}
        rounded-full
        flex items-center justify-center
        transition-colors duration-300
        ${isInWishlist 
          ? 'bg-pink-500/20 text-pink-500' 
          : 'bg-gray-800/80 text-gray-400 hover:text-pink-400'
        }
        backdrop-blur-sm
        disabled:opacity-50
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.85 }}
    >
      <motion.span
        key={isInWishlist ? 'filled' : 'empty'}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 500 }}
      >
        {loading ? '⏳' : isInWishlist ? '❤️' : '🤍'}
      </motion.span>

      {/* Burst Effect on Add */}
      {isInWishlist && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-pink-500 text-sm"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{ x: '-50%', y: '-50%', scale: 0 }}
              animate={{
                x: `${Math.cos(i * 60 * Math.PI / 180) * 30 - 50}%`,
                y: `${Math.sin(i * 60 * Math.PI / 180) * 30 - 50}%`,
                scale: [0, 1, 0],
                opacity: [1, 1, 0]
              }}
              transition={{ duration: 0.6, delay: i * 0.02 }}
            >
              ❤️
            </motion.span>
          ))}
        </motion.div>
      )}
    </motion.button>
  );
};

// ═══════════════════════════════════════════════════════════
// 🛒 Add to Cart Button with Animation
// ═══════════════════════════════════════════════════════════
export const AddToCartButton = ({ onClick, loading, added, disabled, children }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden
        px-6 py-3 rounded-xl font-bold
        transition-all duration-300
        ${added 
          ? 'bg-green-500 text-white' 
          : 'bg-gradient-to-r from-[#28a745] to-[#20c997] text-white'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <motion.span
        className="flex items-center justify-center gap-2"
        initial={false}
        animate={added ? { y: [0, -30, 0] } : {}}
      >
        {loading ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            ⏳
          </motion.span>
        ) : added ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            ✓
          </motion.span>
        ) : (
          '🛒'
        )}
        {children || (added ? 'اضافه شد!' : 'افزودن به سبد')}
      </motion.span>

      {/* Flying Cart Animation */}
      {added && (
        <motion.span
          className="absolute text-2xl"
          initial={{ x: '-50%', y: '100%', left: '50%' }}
          animate={{ y: '-200%', opacity: [1, 1, 0] }}
          transition={{ duration: 0.8 }}
        >
          🛒
        </motion.span>
      )}
    </motion.button>
  );
};

// ═══════════════════════════════════════════════════════════
// 🔢 Quantity Selector with Animations
// ═══════════════════════════════════════════════════════════
export const QuantitySelector = ({ quantity, onIncrease, onDecrease, min = 1, max = 99, loading }) => {
  return (
    <div className="flex items-center gap-2">
      <motion.button
        onClick={onDecrease}
        disabled={quantity <= min || loading}
        className={`
          w-10 h-10 rounded-xl font-bold text-xl
          transition-colors
          ${quantity <= min 
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
            : 'bg-gray-600 text-white hover:bg-gray-500'
          }
        `}
        whileHover={{ scale: quantity > min ? 1.1 : 1 }}
        whileTap={{ scale: quantity > min ? 0.9 : 1 }}
      >
        −
      </motion.button>

      <motion.span
        key={quantity}
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-14 text-center text-xl font-bold text-white bg-[#0d1b2a] py-2 rounded-xl"
      >
        {quantity}
      </motion.span>

      <motion.button
        onClick={onIncrease}
        disabled={quantity >= max || loading}
        className={`
          w-10 h-10 rounded-xl font-bold text-xl
          ${quantity >= max 
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
            : 'bg-[#28a745] text-white hover:bg-[#20c997]'
          }
        `}
        whileH        whileHover={{ scale: quantity < max ? 1.1 : 1 }}
        whileTap={{ scale: quantity < max ? 0.9 : 1 }}
      >
        +
      </motion.button>
    </div>
  );
};
