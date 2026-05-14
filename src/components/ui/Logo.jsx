import React from 'react'

/**
 * Logo Component
 * Provisions the official La Tejcreations brand identity using the provided image manifest.
 * Features responsive scaling and world-class brand consistency.
 */
const Logo = ({ scale = 1 }) => {
  return (
    <div
      className="d-flex align-items-center gap-2"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'left center'
      }}
    >
      <img
        src="/logo.jpeg"
        alt="La Tejcreations Logo"
        style={{
          height: '50px',
          width: 'auto',
          objectFit: 'contain'
        }}
      />

      {/* 
        Optional: We keep the subtext for Aṣọ̀ Lésẹ̀kẹ̀sẹ̀ if it's not prominent in the logo image 
        or if the user wants to emphasize the retail line separately.
      */}
      <div className="d-flex flex-column d-none d-sm-flex">
        <span
          style={{
            fontFamily: 'var(--lt-font-header)',
            fontWeight: 800,
            fontSize: '1.2rem',
            color: 'var(--lt-earth-dark)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            lineHeight: 1
          }}
        >
          Latéjcreations
        </span>
        <span
          style={{
            fontFamily: 'var(--lt-font-body)',
            fontSize: '0.6rem',
            color: 'var(--lt-terracotta)',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}
        >
          Aṣọ̀ Lésẹ̀kẹ̀sẹ̀
        </span>
      </div>
    </div>
  )
}

export default Logo
