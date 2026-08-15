// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';

// ==================== صفحات ====================
import Home from './pages/Home';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import CategoryProducts from './pages/CategoryProducts';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import Wishlist from './pages/Wishlist';

// ==================== صفحات ادمین ====================
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import CreateProduct from './pages/admin/CreateProduct';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';
import EditProduct from './pages/admin/EditProduct';

// ==================== کامپوننت‌ها ====================
import Cart from './components/Cart';
import ProtectedRoute from './components/ProtectedRoute';
import RequireAdmin from './components/RequireAdmin';
import Navbar from './components/Navbar';

// ==================== صفحه پروفایل (جدید) ====================
import Profile from './pages/Profile';

// =============================================================================
// 🚀 MAIN APP COMPONENT
// =============================================================================
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              {/* ✅ Navbar */}
              <Navbar />

              {/* ==================== محتوای اصلی ==================== */}
              <main className="main-content">
                <Routes>
                  {/* ========== صفحات عمومی ========== */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/register" element={<Auth />} />
                  <Route path="/auth" element={<Auth />} />

                  {/* ========== محصولات ========== */}
                  <Route
                    path="/products"
                    element={
                      <ProtectedRoute>
                        <ProductList />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/products/:id"
                    element={
                      <ProtectedRoute>
                        <ProductDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
  path="/admin/orders/:orderId"
  element={
    <RequireAdmin>
      <AdminOrderDetail />
    </RequireAdmin>
  }
/>


                  <Route
                    path="/categories"
                    element={
                      <ProtectedRoute>
                        <Categories />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/category/:category"
                    element={
                      <ProtectedRoute>
                        <CategoryProducts />
                      </ProtectedRoute>
                    }
                  />

                  {/* ========== علاقه‌مندی‌ها ========== */}
                  <Route
                    path="/wishlist"
                    element={
                      <ProtectedRoute>
                        <Wishlist />
                      </ProtectedRoute>
                    }
                  />

                  {/* ========== سبد خرید ========== */}
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />

                  {/* ========== فرآیند خرید ========== */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/admin/users" element={<ManageUsers />} />
                  <Route
                    path="/order-success"
                    element={
                      <ProtectedRoute>
                        <OrderSuccess />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/my-orders"
                    element={
                      <ProtectedRoute>
                        <MyOrders />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/my-orders/:id"
                    element={
                      <ProtectedRoute>
                        <OrderDetail />
                      </ProtectedRoute>
                    }
                  />

                  {/* ========== ✅ پروفایل کاربر (جدید) ========== */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* ========== پنل ادمین ========== */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <RequireAdmin>
                        <AdminDashboard />
                      </RequireAdmin>
                    }
                  />

                  <Route
                    path="/admin/products/create"
                    element={
                      <RequireAdmin>
                        <CreateProduct />
                      </RequireAdmin>
                    }
                  />

                  <Route
                    path="/admin/products/edit/:id"
                    element={
                      <RequireAdmin>
                        <EditProduct />
                      </RequireAdmin>
                    }
                  />

                  <Route
                    path="/admin/products"
                    element={
                      <RequireAdmin>
                        <ManageProducts />
                      </RequireAdmin>
                    }
                  />

                  <Route
                    path="/admin/orders"
                    element={
                      <RequireAdmin>
                        <ManageOrders />
                      </RequireAdmin>
                    }
                  />

                  {/* ========== 404 ========== */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
