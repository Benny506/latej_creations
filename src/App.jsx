import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AppUiProvider } from './context/AppUiContext'
import AmbientBackground from './components/ui/AmbientBackground'
import NoiseOverlay from './components/ui/NoiseOverlay'
import GlobalLoader from './components/ui/GlobalLoader'
import SubtleLoader from './components/ui/SubtleLoader'
import AppAlertStack from './components/ui/AppAlertStack'
import ConfirmModal from './components/ui/ConfirmModal'
import GlobalNavbar from './components/layout/Navbar'
import GlobalFooter from './components/layout/Footer'
import SiteBanner from './components/layout/SiteBanner'
import DataInitializer from './components/layout/DataInitializer'
import ScrollToTop from './components/layout/ScrollToTop'
import AutoLogin from './components/auth/AutoLogin'
import ProtectedRoute from './components/auth/ProtectedRoute'
import CartDrawer from './components/cart/CartDrawer'
import ChatSupport from './components/chat/ChatSupport'
import ErrorBoundary from './components/ui/ErrorBoundary'

// Pages
import HomePage from './pages/Home/HomePage'
import WholesalePage from './pages/Wholesale/WholesalePage'
import CatalogPage from './pages/Catalog/CatalogPage'
import ShopPage from './pages/Catalog/ShopPage'
import AboutAsoLesekesePage from './pages/Catalog/AboutAsoLesekesePage'
import ProductDetailsPage from './pages/Catalog/ProductDetailsPage'
import CheckoutPage from './pages/Catalog/CheckoutPage'
import AboutPage from './pages/Information/AboutPage'
import SupportPage from './pages/Information/SupportPage'
import PoliciesPage from './pages/Information/PoliciesPage'

// Auth Pages
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import VerifyOtpPage from './pages/Auth/VerifyOtpPage'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/Auth/ResetPasswordPage'

// Fallback Pages
import NotFoundPage from './pages/NotFound/NotFoundPage'

// Dashboard Pages
import OrdersPage from './pages/Dashboard/OrdersPage'
import ProfilePage from './pages/Dashboard/ProfilePage'
import OrderDetailsPage from './pages/Dashboard/OrderDetailsPage'

import './App.css'

/**
 * AppContent Component
 * Orchestrates the routing and conditional layout manifestation.
 * Ensures auth and dashboard pages maintain focus by hiding global nav/footer.
 */
const AppContent = () => {
  const location = useLocation()

  // Manifestation Flags
  const isAuthPage = ['/login', '/register', '/verify-otp', '/forgot-password', '/reset-password'].includes(location.pathname)
  const isDashboardRoute = location.pathname.startsWith('/dashboard')
  const shouldHideLayout = isAuthPage || isDashboardRoute

  return (
    <div
      className="app-wrapper"
      style={{
        background: 'transparent',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1
      }}
    >
      <DataInitializer />
      <GlobalLoader />
      <SubtleLoader />
      <AppAlertStack />
      <ConfirmModal />
      <CartDrawer />
      {!isAuthPage && <ChatSupport />}

      {/* Top Banner (Hidden on Auth) */}
      {!isAuthPage && <SiteBanner />}

      {/* Navigation (Hidden on Auth & Dashboard Discovery) */}
      {!shouldHideLayout && <GlobalNavbar />}

      {/* Main Area */}
      <main style={{ minHeight: shouldHideLayout ? '100vh' : '80vh' }}>
        <Routes>
          {/* Public Heritage Discovery */}
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/about-aso-lesekese" element={<AboutAsoLesekesePage />} />
          <Route path="/wholesale" element={<WholesalePage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/contact" element={<SupportPage />} />
          <Route path="/policies" element={<PoliciesPage />} />

          {/* Secure Entry Narratives */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected Dashboard Registry */}
          <Route path="/dashboard/orders" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/orders/:id" element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer (Hidden on Auth & Dashboard Discovery) */}
      {!shouldHideLayout && <GlobalFooter />}
    </div>
  )
}

/**
 * Main Application
 */
function App() {
  return (
    <AppUiProvider>
      <ErrorBoundary>
        <Router>
          <AutoLogin>
            <ScrollToTop />
            <AmbientBackground />
            <NoiseOverlay />
            <AppContent />
          </AutoLogin>
        </Router>
      </ErrorBoundary>
    </AppUiProvider>
  )
}

export default App
