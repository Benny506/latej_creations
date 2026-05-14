import React from 'react'
import { createPortal } from 'react-dom'

/**
 * NoiseOverlay Component
 * Provisions an organic, canvas-like textural grain.
 * Features a high-fidelity "Organic Speckle" SVG orchestration for culturally-aligned depth.
 */
const NoiseOverlay = () => {
  const content = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0.1, // Subtle premium opacity
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='organicNoise'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.45' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.3 0 0 0 0 0.2 0 0 0 0 0.1 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23organicNoise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        mixBlendMode: 'multiply'
      }}
    />
  )

  const portalRoot = document.getElementById('overlay-portal')
  if (!portalRoot) return null

  return createPortal(content, portalRoot)
}

export default NoiseOverlay
