import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Public pages
import Home          from './pages/Home'
import Login         from './pages/Login'
import Register      from './pages/Register'
import ProductsPage  from './pages/ProductsPage'
import ProductDetail from './pages/ProductDetail'
import NotFound      from './pages/NotFound'
import ForgotPassword from './pages/ForgotPassword'
import VerifyEmail    from './pages/VerifyEmail'
import ResetPassword  from './pages/ResetPassword'

// Protected pages
import Cart     from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders   from './pages/Orders'
import Profile  from './pages/Profile'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts  from './pages/admin/AdminProducts'
import AdminOrders    from './pages/admin/AdminOrders'

// Route guards
import ProtectedRoute from './component/ProtectedRoute'
import AdminRoute     from './component/AdminRoute'

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', fontSize: '14px', fontWeight: '600', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
          success: { style: { background: '#f59e0b', color: '#fff' } },
          error:   { style: { background: '#f43f5e', color: '#fff' } },
        }}
      />

      <Routes>
        {/* ── Public ── */}
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email"     element={<VerifyEmail />} />
        <Route path="/reset-password/:resetPasswordToken" element={<ResetPassword />} />
        <Route path="/products"           element={<ProductsPage />} />
        <Route path="/products/:category" element={<ProductsPage />} />
        <Route path="/product/:id"        element={<ProductDetail />} />

        {/* ── User Protected ── */}
        <Route path="/cart"     element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders"   element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* ── Admin Protected ── */}
        <Route path="/admin"          element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/orders"   element={<AdminRoute><AdminOrders /></AdminRoute>} />

        {/* ── Fallbacks ── */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*"    element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  )
}

export default App