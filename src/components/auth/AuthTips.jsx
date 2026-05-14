import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Package, ShieldCheck, Heart } from 'lucide-react'

// Asset references for the cinematic tips
const TIPS_REGISTRY = [
  {
    id: 1,
    title: "Handmade with Love",
    description: "Every item in our store is carefully crafted by skilled artisans using traditional techniques.",
    image: "/assets/auth/craftsmanship.png",
    icon: <Heart size={20} />
  },
  {
    id: 2,
    title: "Business Partnerships",
    description: "We help businesses grow with our reliable wholesale services and special bulk pricing.",
    image: "/assets/auth/wholesale.png",
    icon: <Package size={20} />
  },
  {
    id: 3,
    title: "Safe and Secure",
    description: "Your information is safe with us. We use world-class security to protect your account.",
    image: "/assets/auth/retail.png",
    icon: <ShieldCheck size={20} />
  }
]

/**
 * AuthTips Component
 * A cinematic side-panel that teaches users about the La Tejcreations mission.
 * Features high-fidelity image transitions and professional typography.
 */
const AuthTips = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TIPS_REGISTRY.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const current = TIPS_REGISTRY[index]

  return (
    <div className="auth-tips-container h-100 position-relative overflow-hidden d-flex flex-column justify-content-end p-5 text-white">
      {/* Background Image Manifestation */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={current.image}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            src={current.image}
            className="w-100 h-100 object-fit-cover"
            alt="La Tejcreations Story"
          />
        </AnimatePresence>
        {/* Cinematic Overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(to top, rgba(109, 62, 33, 0.95) 0%, rgba(109, 62, 33, 0.4) 50%, transparent 100%)',
            zIndex: 1
          }}
        />
      </div>

      {/* Content Manifestation */}
      <div className="position-relative" style={{ zIndex: 2 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="display-5 fw-bold mb-3 text-light">{current.title}</h2>
            <p className="lead opacity-90 mb-5 text-light" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Manifestation */}
        <div className="d-flex gap-2">
          {TIPS_REGISTRY.map((_, i) => (
            <div
              key={i}
              className={`rounded-pill transition-all ${i === index ? 'bg-white' : 'bg-white/30'}`}
              style={{ width: i === index ? '40px' : '8px', height: '8px' }}
            />
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .auth-tips-container {
           min-height: 100vh;
        }
        @media (max-width: 991px) {
          .auth-tips-container {
             display: none !important;
          }
        }
      `}} />
    </div>
  )
}

export default AuthTips
