// src/context/ToastContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext();

// ═══════════════════════════════════════════════════════════
// 🎨 Toast Types & Icons
// ═══════════════════════════════════════════════════════════
const TOAST_TYPES = {
  success: {
    icon: '✅',
    bgColor: 'from-green-500/20 to-green-600/20',
    borderColor: 'border-green-500/50',
    textColor: 'text-green-400',
    progressColor: 'bg-green-500'
  },
  error: {
    icon: '❌',
    bgColor: 'from-red-500/20 to-red-600/20',
    borderColor: 'border-red-500/50',
    textColor: 'text-red-400',
    progressColor: 'bg-red-500'
  },
  warning: {
    icon: '⚠️',
    bgColor: 'from-yellow-500/20 to-yellow-600/20',
    borderColor: 'border-yellow-500/50',
    textColor: 'text-yellow-400',
    progressColor: 'bg-yellow-500'
  },
  info: {
    icon: 'ℹ️',
    bgColor: 'from-blue-500/20 to-blue-600/20',
    borderColor: 'border-blue-500/50',
    textColor: 'text-blue-400',
    progressColor: 'bg-blue-500'
  },
  wishlist: {
    icon: '❤️',
    bgColor: 'from-pink-500/20 to-pink-600/20',
    borderColor: 'border-pink-500/50',
    textColor: 'text-pink-400',
    progressColor: 'bg-pink-500'
  },
  cart: {
    icon: '🛒',
    bgColor: 'from-cyan-500/20 to-cyan-600/20',
    borderColor: 'border-cyan-500/50',
    textColor: 'text-cyan-400',
    progressColor: 'bg-cyan-500'
  }
};

// ═══════════════════════════════════════════════════════════
// 🔔 Single Toast Component
// ═══════════════════════════════════════════════════════════
const Toast = ({ toast, onRemove }) => {
  const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
  const [isPaused, setIsPaused] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`
        relative overflow-hidden
        bg-gradient-to-r ${config.bgColor}
        backdrop-blur-xl
        border ${config.borderColor}
        rounded-xl p-4 pr-10
        shadow-2xl shadow-black/20
        min-w-[320px] max-w-[420px]
        cursor-pointer
      `}
      onClick={() => onRemove(toast.id)}
      dir="rtl"
    >
      {/* محتوا */}
      <div className="flex items-start gap-3">
        {/* آیکون با انیمیشن */}
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
          className="text-2xl flex-shrink-0"
        >
          {toast.icon || config.icon}
        </motion.span>

        <div className="flex-grow">
          {/* عنوان */}
          {toast.title && (
            <h4 className={`font-bold ${config.textColor} mb-1`}>
              {toast.title}
            </h4>
          )}
          
          {/* پیام */}
          <p className="text-gray-300 text-sm leading-relaxed">
            {toast.message}
          </p>

          {/* Action Button */}
          {toast.action && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                toast.action.onClick();
                onRemove(toast.id);
              }}
              className={`mt-2 px-3 py-1 rounded-lg text-sm font-semibold ${config.textColor} bg-white/10 hover:bg-white/20 transition-colors`}
            >
              {toast.action.label}
            </motion.button>
          )}
        </div>

        {/* دکمه بستن */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(toast.id);
          }}
          className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      {/* Progress Bar */}
      {toast.duration && (
        <motion.div
          className={`absolute bottom-0 left-0 h-1 ${config.progressColor}`}
          initial={{ width: "100%" }}
          animate={{ width: isPaused ? undefined : "0%" }}
          transition={{ 
            duration: toast.duration / 1000, 
            ease: "linear",
            ...(isPaused && { duration: 0 })
          }}
          onAnimationComplete={() => !isPaused && onRemove(toast.id)}
        />
      )}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════
// 📦 Toast Provider
// ═══════════════════════════════════════════════════════════
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // افزودن Toast
  const addToast = useCallback((options) => {
    const id = Date.now() + Math.random();
    
    const toast = {
      id,
      type: 'info',
      duration: 4000,
      ...options
    };

    setToasts(prev => [...prev, toast]);

    return id;
  }, []);

  // حذف Toast
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // حذف همه
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // ═══════════════════════════════════════════════════════════
  // 🎯 Helper Functions
  // ═══════════════════════════════════════════════════════════
  const toast = {
    success: (message, options = {}) => 
      addToast({ type: 'success', message, title: 'موفق', ...options }),
    
    error: (message, options = {}) => 
      addToast({ type: 'error', message, title: 'خطا', duration: 6000, ...options }),
    
    warning: (message, options = {}) => 
      addToast({ type: 'warning', message, title: 'هشدار', ...options }),
    
    info: (message, options = {}) => 
      addToast({ type: 'info', message, ...options }),

    // 🆕 Toast های مخصوص
    wishlist: (message, options = {}) => 
      addToast({ type: 'wishlist', message, ...options }),
    
    cart: (message, options = {}) => 
      addToast({ type: 'cart', message, ...options }),

    // با Action
    withAction: (message, action, options = {}) =>
      addToast({ message, action, duration: 8000, ...options }),

    // Promise-based
    promise: async (promise, { loading, success, error }) => {
      const id = addToast({ type: 'info', message: loading, duration: null });
      
      try {
        const result = await promise;
        removeToast(id);
        addToast({ type: 'success', message: success, title: 'موفق' });
        return result;
      } catch (err) {
        removeToast(id);
        addToast({ type: 'error', message: error || err.message, title: 'خطا' });
        throw err;
      }
    }
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast, clearToasts }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 left-4 z-[9999] flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <Toast key={t.id} toast={t} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// ═══════════════════════════════════════════════════════════
// 🪝 Custom Hook
// ═══════════════════════════════════════════════════════════
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
