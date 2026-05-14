import React from 'react'
import { useSelector } from 'react-redux'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap'
import { ShieldAlert, ArrowRight, Home, Lock } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * AccessDenied Component
 * A world-class centralized manifestation for unauthorized discovery attempts.
 */
const AccessDenied = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-5 rounded-5 shadow-premium bg-white border border-light"
        style={{ maxWidth: '600px' }}
      >
        <div className="bg-primary-light text-primary rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '100px', height: '100px' }}>
          <ShieldAlert size={50} />
        </div>
        
        <h1 className="fw-bold mb-3">Wait a moment!</h1>
        <p className="lead text-dark opacity-50 mb-5 leading-relaxed">
          This part of the heritage is reserved for our registered partners. Please sign in to your account to continue your journey.
        </p>

        <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
          <Button 
            as={Link} 
            to="/login" 
            variant="primary" 
            className="rounded-pill px-5 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 border-0"
          >
            Sign In Now <Lock size={18} />
          </Button>
          <Button 
            as={Link} 
            to="/" 
            variant="light" 
            className="rounded-pill px-5 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 border-0 bg-light opacity-75 hover-opacity-100"
          >
            Back to Home <Home size={18} />
          </Button>
        </div>
      </motion.div>
    </Container>
  )
}

/**
 * ProtectedRoute Component
 * Orchestrates the secure entry manifest for dashboard discovery.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, profile, loading } = useSelector(state => state.auth)
  const location = useLocation()

  // If we're still initializing the auth registry, we wait (AutoLogin handles the loader)
  if (loading) return null

  if (!isAuthenticated || !user || !profile) {
    return <AccessDenied />
  }

  return <>{children}</>
}

export default ProtectedRoute
