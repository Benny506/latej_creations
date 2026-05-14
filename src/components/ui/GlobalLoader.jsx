import React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppUi } from '../../context/AppUiContext'

/**
 * GlobalLoader Component
 * Orchestrates full-screen blocking using the Institutional Portal Hierarchy.
 * Sits professionally below Alerts but above Subtle Loaders and Site Content.
 */
const GlobalLoader = ({ tempLoad = false }) => {
  const { globalLoading } = useAppUi()

  const content = (
    <AnimatePresence>
      {(globalLoading?.show || tempLoad) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 99997,
            background: 'rgba(26, 11, 4, 0.75)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(25px)'
          }}
        >
          <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.05, 1] }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '2px solid transparent',
                borderTopColor: 'var(--lt-gold)',
                borderBottomColor: 'var(--lt-earth-main)',
                opacity: 0.6
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                width: '50%',
                height: '50%',
                background: 'var(--lt-gold)',
                borderRadius: '50%',
                filter: 'blur(20px)'
              }}
            />
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-4 text-center"
          >
            <motion.h6
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="tiny text-uppercase tracking-widest fw-bold text-white mb-0"
              style={{ letterSpacing: '0.4em' }}
            >
              {globalLoading.message || "Please Wait"}
            </motion.h6>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const portalRoot = document.getElementById('global-loader-portal')
  if (!portalRoot) return null

  return createPortal(content, portalRoot)
}

export default GlobalLoader
