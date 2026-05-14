import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppUi } from '../../context/AppUiContext'
import ArtisanalIcon from '../ui/ArtisanalIcon'

const CheckoutTips = ({ type }) => {
  const { siteContent } = useAppUi()
  const [index, setIndex] = useState(0)
  
  const rules = type === 'retail' 
    ? (siteContent?.retail_tips?.sections?.main?.items || []) 
    : (siteContent?.wholesale_tips?.sections?.main?.items || [])

  useEffect(() => {
    if (rules.length === 0) return
    setIndex(0)
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % rules.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [type, rules.length])

  if (rules.length === 0) return null

  const currentRule = rules[index]

  return (
    <div className="checkout-tips mb-5">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${type}-${currentRule.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="d-flex align-items-center gap-4 bg-white p-4 rounded-5 shadow-sm border border-light"
        >
          <div className="bg-primary-light p-3 rounded-4 text-primary shadow-sm flex-shrink-0">
            <ArtisanalIcon name={currentRule.icon} size={22} />
          </div>
          <div className="text-start">
            <p className="tiny fw-bold text-uppercase text-primary mb-1 tracking-widest" style={{ fontSize: '0.65rem' }}>
              {currentRule.title}
            </p>
            <p className="small text-main fw-bold opacity-75 mb-0 lh-sm">
              {currentRule.description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default CheckoutTips
