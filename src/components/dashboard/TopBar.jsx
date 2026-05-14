import React from 'react'
import { useSelector } from 'react-redux'
import { Menu, User, Bell } from 'lucide-react'
import { Container } from 'react-bootstrap'

/**
 * TopBar Component
 * Provisions the world-class header manifest for the partner dashboard.
 * Features partner identity and responsive navigation triggers.
 */
const TopBar = ({ title, description, onMenuOpen }) => {
  const { profile } = useSelector(state => state.auth)

  return (
    <header className="bg-white border-bottom border-light py-3 px-4 shadow-sm position-sticky top-0" style={{ zIndex: 1000 }}>
      <div className="d-flex align-items-center justify-content-between">
        {/* Left Discovery Section */}
        <div className="d-flex align-items-center gap-3">
          <button 
            onClick={onMenuOpen}
            className="btn btn-link p-2 text-dark opacity-75 hover-opacity-100 d-lg-none border-0"
          >
            <Menu size={24} />
          </button>
          
          <div className="d-flex flex-column">
            <h5 className="fw-bold text-main mb-0">{title}</h5>
            <span className="tiny text-uppercase fw-bold opacity-50 tracking-widest d-none d-md-inline" style={{ fontSize: '0.65rem' }}>
              {description}
            </span>
          </div>
        </div>

        {/* Right Identity Section */}
        <div className="d-flex align-items-center gap-4">
          {/* Notifications (Placeholder) */}
          <button className="btn btn-link p-2 text-dark opacity-25 hover-opacity-100 border-0 d-none d-sm-block">
            <Bell size={20} />
          </button>

          <div className="d-flex align-items-center gap-3 bg-light p-2 ps-3 rounded-pill">
            <div className="d-flex flex-column text-end d-none d-sm-flex">
              <span className="fw-bold text-main tiny text-uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>
                {profile?.full_name || 'Partner'}
              </span>
              <span className="tiny opacity-50 fw-bold" style={{ fontSize: '0.6rem' }}>Account Active</span>
            </div>
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '35px', height: '35px' }}>
              <User size={18} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopBar
