import React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { useAppUi } from '../../context/AppUiContext'

/**
 * AppAlertStack Component
 * Orchestrates high-fidelity alerts using the Institutional Portal Hierarchy.
 * Sits at the absolute top of the visual stack for critical partner communication.
 */
const AppAlertStack = () => {
  const { alerts, dismissAlert } = useAppUi()

  const getIcon = (variant) => {
    switch (variant) {
      case 'success': return <CheckCircle size={18} className="text-success" />
      case 'error': return <AlertCircle size={18} className="text-danger" />
      default: return <Info size={18} className="text-primary" />
    }
  }

  if (!alerts || alerts.length === 0) return null

  const content = (
    <div className="alert-stack position-fixed top-0 end-0 p-4" style={{ zIndex: 99998, width: '400px', maxWidth: '90vw' }}>
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="mb-3"
          >
            <div 
              className={`bg-white shadow-premium p-3 rounded-4 border-start border-4 d-flex align-items-center gap-3 position-relative ${
                alert.variant === 'success' ? 'border-success' : 
                alert.variant === 'error' ? 'border-danger' : 
                'border-primary'
              }`}
            >
              <div className="flex-shrink-0">
                {getIcon(alert.variant)}
              </div>
              
              <div className="flex-grow-1 text-start">
                <p className="mb-0 small fw-bold text-main" style={{ lineHeight: '1.4' }}>
                  {alert.message}
                </p>
              </div>

              <button 
                onClick={() => dismissAlert(alert.id)}
                className="btn btn-link p-0 text-muted border-0 shadow-none opacity-50 hover-opacity-100"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )

  const portalRoot = document.getElementById('alert-portal')
  if (!portalRoot) return null

  return createPortal(content, portalRoot)
}

export default AppAlertStack
