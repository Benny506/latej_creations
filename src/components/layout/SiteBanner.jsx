import React, { useState, useEffect, useMemo } from 'react'
import { Offcanvas } from 'react-bootstrap'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useAppUi } from '../../context/AppUiContext'
import ArtisanalIcon from '../ui/ArtisanalIcon'
import supabase from '../../utils/supabase'
import { ChevronDown, X } from 'lucide-react'

/**
 * SiteBanner Component
 * Smart-scrolling, dynamic top banner that cycles through retail and wholesale tips.
 */
const SiteBanner = () => {
  const { siteContent, setSiteContent } = useAppUi()
  const [tips, setTips] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [showOffcanvas, setShowOffcanvas] = useState(false)

  const { scrollY } = useScroll()

  // 1. Resolve Tips from Context or DB
  useEffect(() => {
    const resolveTips = async () => {
      let combinedTips = []

      // Try reading from context
      const retailItems = siteContent?.retail_tips?.sections?.main?.items || []
      const wholesaleItems = siteContent?.wholesale_tips?.sections?.main?.items || []

      if (retailItems.length > 0 || wholesaleItems.length > 0) {
        const rTips = retailItems.map(t => ({ ...t, category: 'RETAIL' }))
        const wTips = wholesaleItems.map(t => ({ ...t, category: 'WHOLESALE' }))
        combinedTips = [...rTips, ...wTips]
        setTips(combinedTips)
        return
      }

      // If context has no tips, attempt a single fetch
      if (!hasAttemptedFetch && !isFetching) {
        setIsFetching(true)
        try {
          const { data, error } = await supabase
            .from('latej_site_content')
            .select('*')
            .in('page_id', ['retail_tips', 'wholesale_tips'])

          if (!error && data) {
            const contentMap = data.reduce((acc, curr) => {
              acc[curr.page_id] = curr.content
              return acc
            }, {})

            // Update context so other parts of the app can use it
            setSiteContent(prev => ({ ...prev, ...contentMap }))

            const rItems = contentMap.retail_tips?.sections?.main?.items || []
            const wItems = contentMap.wholesale_tips?.sections?.main?.items || []

            const rTips = rItems.map(t => ({ ...t, category: 'RETAIL' }))
            const wTips = wItems.map(t => ({ ...t, category: 'WHOLESALE' }))
            combinedTips = [...rTips, ...wTips]

            setTips(combinedTips)
          }
        } catch (err) {
          console.error('SiteBanner Fetch Error:', err)
        } finally {
          setIsFetching(false)
          setHasAttemptedFetch(true)
        }
      }
    }

    resolveTips()
  }, [siteContent, hasAttemptedFetch, isFetching, setSiteContent])

  // 2. Cycling Logic
  useEffect(() => {
    if (tips.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tips.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [tips])

  // 3. Smart Scroll Logic using Framer Motion
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious()
    if (latest < 50) {
      setIsVisible(true) // Always show at the very top
    } else if (latest > previous && latest > 50) {
      setIsVisible(false) // Scrolling down
    } else if (latest < previous) {
      setIsVisible(true) // Scrolling up
    }
  })

  // Synchronize CSS variable for the Navbar
  useEffect(() => {
    if (isVisible && tips.length > 0) {
      document.documentElement.style.setProperty('--banner-height', '40px')
    } else {
      document.documentElement.style.setProperty('--banner-height', '0px')
    }
    
    // Cleanup on unmount
    return () => {
      document.documentElement.style.setProperty('--banner-height', '0px')
    }
  }, [isVisible, tips.length])

  if (tips.length === 0) return null

  const currentTip = tips[currentIndex]

  return (
    <>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1040, // Above navbar which is typically 1030
          transition: 'transform 0.3s ease-in-out',
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
          width: '100%',
          height: '40px',
          backgroundColor: '#0a0a0a', // Deep dark brand color
          color: '#ffffff',
          cursor: 'pointer'
        }}
        onClick={() => setShowOffcanvas(true)}
      >
        <div className="container px-3 h-100 d-flex justify-content-center align-items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTip.id || currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="d-flex align-items-center justify-content-center gap-3 w-100"
            >
              <div className="d-flex align-items-center gap-2 text-truncate" style={{ minWidth: 0, flex: 1, justifyContent: 'center' }}>
                <span className="badge bg-primary text-white tiny fw-bold flex-shrink-0" style={{ fontSize: '0.6rem' }}>
                  {currentTip.category}
                </span>
                <ArtisanalIcon name={currentTip.icon} size={14} className="opacity-75 d-none d-sm-block flex-shrink-0" />
                <span className="tiny fw-bold text-truncate" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  {currentTip.title} <span className="opacity-75 fw-normal d-none d-md-inline ms-1">— {currentTip.description}</span>
                </span>
              </div>

              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="d-flex align-items-center flex-shrink-0 ms-auto"
              >
                <ChevronDown size={18} className="opacity-75" />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Offcanvas to show all tips */}
      <Offcanvas scroll show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="top" style={{ height: 'auto', maxHeight: '70vh' }} className="rounded-bottom-4 shadow-premium">
        <Offcanvas.Header className="border-bottom border-light d-flex justify-content-between align-items-center">
          <Offcanvas.Title className="fw-bold text-main tiny text-uppercase tracking-widest mb-0">
            Aṣọ̀lé Sẹ̀kẹ̀sẹ̀ Guidelines
          </Offcanvas.Title>
          <button type="button" onClick={() => setShowOffcanvas(false)} className="btn btn-link text-main p-1 border-0 opacity-50 hover-opacity-100 shadow-none m-0">
            <X size={20} />
          </button>
        </Offcanvas.Header>
        <Offcanvas.Body className="custom-scrollbar" style={{ overflowY: 'auto' }}>
          <div className="row g-4">
            {tips.map((tip, idx) => (
              <div key={tip.id || idx} className="col-md-6 col-lg-4">
                <div className="p-3 bg-light rounded-4 h-100 d-flex gap-3">
                  <div className="bg-white p-2 rounded-3 text-primary shadow-sm h-100 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <ArtisanalIcon name={tip.icon} size={18} />
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="badge bg-primary text-white" style={{ fontSize: '0.55rem' }}>{tip.category}</span>
                      <h6 className="tiny fw-bold text-main mb-0">{tip.title}</h6>
                    </div>
                    <p className="tiny opacity-75 mb-0 lh-sm">
                      {tip.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default SiteBanner
