import React, { useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * DashboardLayout Component
 * Provisions the world-class structural manifest for the partner portal.
 * Features a dual-column layout with a responsive offcanvas navigation manifest.
 */
const DashboardLayout = ({ children, title = 'My Dashboard', description = 'Welcome back to the heritage' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="d-flex w-100" style={{ minHeight: '100vh', background: 'var(--lt-bg-ivory)' }}>
      {/* Desktop Sidebar (Left Column) */}
      <aside
        className="d-none d-lg-block position-sticky top-0 shadow-sm"
        style={{ width: '280px', height: '100vh', zIndex: 1060 }}
      >
        <Sidebar />
      </aside>

      {/* Mobile Sidebar (Offcanvas Overlay) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
              style={{ zIndex: 1040 }}
            />
            {/* Sidebar Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="position-fixed top-0 start-0 h-100 shadow-lg"
              style={{ width: '280px', zIndex: 1050 }}
            >
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area (Right Column) */}
      <main className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        {/* Fixed Top Bar */}
        <TopBar
          title={title}
          description={description}
          onMenuOpen={() => setIsSidebarOpen(true)}
        />

        {/* Scrollable Content Body */}
        <div className="flex-grow-1 p-3 p-md-4 p-lg-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={title} // Trigger animation on screen change
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
