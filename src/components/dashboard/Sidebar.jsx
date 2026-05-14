import React, { useState } from 'react'
import { Nav } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  ShoppingBag, 
  User, 
  Package, 
  Store, 
  Truck, 
  LogOut, 
  ChevronRight,
  Heart
} from 'lucide-react'
import { useDispatch } from 'react-redux'
import { toggleCart } from '../../store/slices/cartSlice'
import supabase from '../../utils/supabase'
import { clearAuth } from '../../store/slices/authSlice'
import ConfirmModal from '../ui/ConfirmModal'

/**
 * Sidebar Component
 * Orchestrates the dashboard navigation manifest for partners.
 * Features specialized links for Orders, Profile, and Boutique discovery.
 */
const Sidebar = ({ onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    dispatch(clearAuth())
    navigate('/login')
  }

  const navLinks = [
    { name: 'My Orders', icon: Package, path: '/dashboard/orders' },
    { name: 'My Profile', icon: User, path: '/dashboard/profile' },
    { 
      name: 'Open My Cart', 
      icon: ShoppingBag, 
      action: () => {
        dispatch(toggleCart())
        if (onClose) onClose()
      } 
    },
    { type: 'divider' },
    { name: 'Retail Store', icon: Store, path: '/shop' },
    { name: 'Wholesale Center', icon: Truck, path: '/wholesale' },
  ]

  return (
    <div className="dashboard-sidebar h-100 d-flex flex-column bg-white shadow-sm border-end border-light">
      {/* Brand Manifestation */}
      <div className="p-4 border-bottom border-light">
        <Link to="/" className="text-decoration-none d-flex align-items-center gap-3">
          <div className="rounded-circle overflow-hidden shadow-sm" style={{ width: '40px', height: '40px' }}>
            <img src="/logo.jpeg" alt="Logo" className="w-100 h-100 object-fit-cover" />
          </div>
          <div className="d-flex flex-column">
            <span className="fw-bold text-main lh-1">La Tejcreations</span>
            <span className="tiny text-uppercase fw-bold opacity-50 tracking-widest" style={{ fontSize: '0.6rem' }}>Dashboard</span>
          </div>
        </Link>
      </div>

      {/* Navigation Registry */}
      <div className="flex-grow-1 py-4 px-3 overflow-auto">
        <Nav className="flex-column gap-2">
          {navLinks.map((link, i) => {
            if (link.type === 'divider') {
              return <hr key={i} className="my-3 opacity-10 mx-2" />
            }

            const isActive = location.pathname === link.path
            const Icon = link.icon

            const NavItem = (
              <div
                className={`nav-item-dashboard d-flex align-items-center justify-content-between p-3 rounded-4 transition-all cursor-pointer ${isActive ? 'bg-primary text-white shadow-sm' : 'text-main opacity-75 hover-bg-light'}`}
              >
                <div className="d-flex align-items-center gap-3">
                  <Icon size={20} />
                  <span className="fw-bold tiny text-uppercase tracking-widest">{link.name}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </div>
            )

            if (link.action) {
              return <div key={i} onClick={link.action}>{NavItem}</div>
            }

            return (
              <Nav.Link 
                key={i} 
                as={Link} 
                to={link.path} 
                className="p-0 border-0"
                onClick={onClose}
              >
                {NavItem}
              </Nav.Link>
            )
          })}
        </Nav>
      </div>

      {/* Security Registry (Logout) */}
      <div className="p-3 border-top border-light">
        <div 
          onClick={() => setShowLogoutConfirm(true)}
          className="nav-item-dashboard d-flex align-items-center gap-3 p-3 rounded-4 text-danger opacity-75 hover-opacity-100 cursor-pointer transition-all hover-bg-danger-light"
        >
          <LogOut size={20} />
          <span className="fw-bold tiny text-uppercase tracking-widest">Sign Out</span>
        </div>
      </div>

      {/* Confirmation Manifestation */}
      <ConfirmModal 
        show={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Leave the heritage?"
        description="Are you sure you want to sign out of your account? We'll be here whenever you're ready to come back."
        confirmText="Sign Out"
        variant="danger"
        icon={LogOut}
      />

      <style>
        {`
          .nav-item-dashboard {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .hover-bg-light:hover {
            background: rgba(109, 62, 33, 0.05);
            opacity: 1 !important;
          }
          .hover-bg-danger-light:hover {
            background: rgba(220, 53, 69, 0.05);
          }
          .cursor-pointer { cursor: pointer; }
        `}
      </style>
    </div>
  )
}

export default Sidebar
