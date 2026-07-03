import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage' // 1. Added AboutPage Import
import CheckoutPage from './pages/CheckoutPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const location = useLocation()

  return (
    <CartProvider>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/about" element={<AboutPage />} /> {/* 2. Added Route for /about */}
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route element={<ProtectedRoute requireAdmin={true} redirectTo="/login" />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </motion.div>
      </AnimatePresence>
    </CartProvider>
  )
}

export default App