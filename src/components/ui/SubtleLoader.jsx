import React from 'react'
import { createPortal } from 'react-dom'
import { Spinner } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppUi } from '../../context/AppUiContext'

/**
 * SubtleLoader Component
 * Orchestrates corner-anchored notifications using the Institutional Portal Hierarchy.
 * Sits professionally below Global Loaders but above Drawers and Site Content.
 */
const SubtleLoader = () => {
  const { subtleLoading } = useAppUi()

  const content = (
    <AnimatePresence>
      {subtleLoading?.show && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="position-fixed bottom-0 end-0 m-4 p-3 bg-white shadow-premium rounded-4 border border-light d-flex align-items-center gap-3"
          style={{ zIndex: 99996, minWidth: '200px' }}
        >
          <div className="position-relative d-flex align-items-center gap-2" style={{ zIndex: 1 }}>
            <Spinner 
              animation="border" 
              size="sm" 
              className="text-primary opacity-75" 
              style={{ width: '14px', height: '14px', borderWidth: '2px' }}
            />
            <p className="mb-0 fw-bold text-main" style={{ fontSize: '0.7rem', letterSpacing: '0.02em' }}>
              {subtleLoading.message || 'updating...'}
            </p>
          </div>
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-white rounded-4 opacity-50" style={{ zIndex: 0 }}>
            <motion.div 
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-100 h-100"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.05), transparent)' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const portalRoot = document.getElementById('subtle-loader-portal')
  if (!portalRoot) return null

  return createPortal(content, portalRoot)
}

export default SubtleLoader
