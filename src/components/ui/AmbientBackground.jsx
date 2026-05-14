import React from 'react'
import { createPortal } from 'react-dom'

/**
 * AmbientBackground Component
 * Provisions high-fidelity background lighting using the refined Earth Brown palette (#6D3E21).
 * Features rich warm blooms that cinematicially support the African traditional attire aesthetic.
 */
const AmbientBackground = () => {
  const content = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#ffffff'
      }}
    >
      {/* Top Left Bloom - African Earth Brown (#6D3E21) */}
      <div
        style={{
          position: 'absolute',
          top: '-25%',
          left: '-20%',
          width: '90vw',
          height: '90vw',
          background: 'radial-gradient(circle, rgba(109, 62, 33, 0.4) 0%, rgba(109, 62, 33, 0) 75%)',
          filter: 'blur(100px)',
          borderRadius: '50%'
        }}
      />

      {/* Bottom Right Bloom - Rich Terracotta */}
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          right: '-25%',
          width: '100vw',
          height: '100vw',
          background: 'radial-gradient(circle, rgba(192, 77, 41, 0.35) 0%, rgba(192, 77, 41, 0) 80%)',
          filter: 'blur(120px)',
          borderRadius: '50%'
        }}
      />

      {/* Top Right Bloom - Native Gold */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          right: '-10%',
          width: '70vw',
          height: '70vw',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0) 70%)',
          filter: 'blur(140px)',
          borderRadius: '50%'
        }}
      />
    </div>
  )

  const portalRoot = document.getElementById('bg-portal')
  if (!portalRoot) return null

  return createPortal(content, portalRoot)
}

export default AmbientBackground
