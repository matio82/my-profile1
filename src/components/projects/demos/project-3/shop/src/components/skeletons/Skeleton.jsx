// src/components/skeletons/Skeleton.jsx

import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════
// 🦴 Base Skeleton
// ═══════════════════════════════════════════════════════════
export const Skeleton = ({ 
  width = '100%', 
  height = '20px', 
  rounded = 'lg',
  className = '' 
}) => {
  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-${rounded} ${className}`}
      style={{ width, height }}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════
// 🃏 Product Card Skeleton
// ═══════════════════════════════════════════════════════════
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-[#102030] to-[#1a3a52] rounded-2xl overflow-hidden border border-gray-700/50">
      {/* تصویر */}
      <Skeleton height="200px" rounded="none" />
      
      {/* محتوا */}
      <div className="p-4 space-y-3">
        {/* عنوان */}
        <Skeleton height="24px" width="80%" />
        
        {/* دسته‌بندی */}
        <Skeleton height="16px" width="40%" />
        
        {/* قیمت */}
        <div className="flex justify-between items-center pt-2">
          <Skeleton height="28px" width="100px" />
          <Skeleton height="40px" width="40px" rounded="full" />
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// 📋 Product List Skeleton
// ═══════════════════════════════════════════════════════════
export const ProductListSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <ProductCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// 📄 Product Detail Skeleton
// ═══════════════════════════════════════════════════════════
export const ProductDetailSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* تصویر */}
        <div className="space-y-4">
          <Skeleton height="400px" rounded="2xl" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} width="80px" height="80px" rounded="xl" />
            ))}
          </div>
        </div>

        {/* اطلاعات */}
        <div className="space-y-6">
          <Skeleton height="40px" width="70%" />
          <Skeleton height="20px" width="30%" />
          
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} width="24px" height="24px" rounded="full" />
            ))}
          </div>

          <Skeleton height="100px" />
          
          <div className="flex gap-4">
            <Skeleton height="50px" width="150px" rounded="xl" />
            <Skeleton height="50px" className="flex-1" rounded="xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// 🛒 Cart Item Skeleton
// ═══════════════════════════════════════════════════════════
export const CartItemSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-[#102030] to-[#1a3a52] rounded-xl p-4 flex gap-4 items-center">
      <Skeleton width="80px" height="80px" rounded="xl" />
      <div className="flex-1 space-y-2">
        <Skeleton height="20px" width="60%" />
        <Skeleton height="16px" width="30%" />
      </div>
      <Skeleton width="120px" height="40px" rounded="xl" />
      <Skeleton width="100px" height="24px" />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ❤️ Wishlist Item Skeleton
// ═══════════════════════════════════════════════════════════
export const WishlistItemSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-[#102030] to-[#1a3a52] rounded-xl p-4 flex gap-4 items-center border border-gray-700/50">
      <Skeleton width="96px" height="96px" rounded="xl" />
      <div className="flex-1 space-y-2">
        <Skeleton height="24px" width="70%" />
        <Skeleton height="16px" width="40%" />
        <Skeleton height="20px" width="30%" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton width="100px" height="40px" rounded="lg" />
        <Skeleton width="100px" height="40px" rounded="lg" />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// 📊 Dashboard Stats Skeleton
// ═══════════════════════════════════════════════════════════
export const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-gradient-to-br from-[#102030] to-[#1a3a52] rounded-2xl p-6 border border-gray-700/50">
          <div className="flex justify-between items-start mb-4">
            <Skeleton width="48px" height="48px" rounded="xl" />
            <Skeleton width="60px" height="24px" rounded="full" />
          </div>
          <Skeleton height="32px" width="50%" className="mb-2" />
          <Skeleton height="16px" width="70%" />
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// 📝 Table Row Skeleton
// ═══════════════════════════════════════════════════════════
export const TableRowSkeleton = ({ columns = 5 }) => {
  return (
    <tr className="border-b border-gray-700/50">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton height="20px" width={i === 0 ? "60%" : "80%"} />
        </td>
      ))}
    </tr>
  );
};

export const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <table className="w-full">
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  );
};
