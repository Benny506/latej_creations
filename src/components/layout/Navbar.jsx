import React, { useState } from 'react'
import { Navbar, Container, Nav, Offcanvas, NavDropdown } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ShoppingBag, User, Menu, X, ChevronRight } from 'lucide-react'
import { toggleCart } from '../../store/slices/cartSlice'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * GlobalNavbar Component
 * Orchestrates the institutional navigation manifestation for the platform.
 * Features a Hybrid Dropdown (Desktop) and Offcanvas (Mobile) discovery layer.
 */
const GlobalNavbar = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const [showOffcanvas, setShowOffcanvas] = useState(false)

  const { isAuthenticated, profile } = useSelector(state => state.auth)
  const { items: cartItems } = useSelector(state => state.cart)
  const totalItems = (cartItems || []).reduce((acc, item) => acc + item.quantity, 0)

  const handleClose = () => setShowOffcanvas(false)
  const handleShow = () => setShowOffcanvas(true)

  const isActive = (path) => location.pathname === path
  const isAsoActive = location.pathname.includes('/shop') || location.pathname.includes('/about-aso')

  return (
    <>
      <Navbar expand="lg" sticky="top" className="bg-white py-3 shadow-premium transition-all" style={{ zIndex: 1050, top: 'var(--banner-height, 0px)' }}>
        <Container>
          {/* Brand Manifestation */}
          <Navbar.Brand as={Link} to="/" className="fw-bold text-main d-flex align-items-center gap-3">
            <div className="rounded-circle overflow-hidden shadow-sm border border-light" style={{ width: '45px', height: '45px' }}>
              <img
                src="/logo.jpeg"
                alt="La Tejcreations Logo"
                className="w-100 h-100 object-fit-cover"
              />
            </div>
            <div className="d-flex flex-column text-start">
              <span className="tracking-tighter fw-bold lh-1" style={{ fontSize: '1.25rem' }}>La Tejcreations</span>
              <span className="tiny text-uppercase fw-bold opacity-50 tracking-widest" style={{ fontSize: '0.6rem' }}>Aṣọ̀ Lésẹ̀kẹ̀sẹ̀</span>
            </div>
          </Navbar.Brand>

          {/* Desktop Navigation Discovery (Hidden on Mobile) */}
          <div className="d-none d-lg-flex flex-grow-1 justify-content-center">
             <Nav className="gap-4 align-items-center">
                <NavDropdown
                  title={
                    <span className={`tiny text-uppercase fw-bold tracking-widest transition-all ${['/', '/about', '/support', '/contact'].includes(location.pathname) ? 'text-primary' : 'text-main opacity-75'}`}>
                      Platform
                    </span>
                  }
                  id="platform-dropdown"
                  className="aso-nav-dropdown d-flex align-items-center"
                >
                  <NavDropdown.Item as={Link} to="/" className="tiny text-uppercase fw-bold py-3 px-4">
                    Home
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/about" className="tiny text-uppercase fw-bold py-3 px-4">
                    About La Tej
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/support" className="tiny text-uppercase fw-bold py-3 px-4">
                    Support Hub
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/contact" className="tiny text-uppercase fw-bold py-3 px-4">
                    Contact Us
                  </NavDropdown.Item>
                </NavDropdown>

                {/* Desktop Dropdown for Aṣọ̀ Lésẹ̀kẹ̀sẹ̀ Retail */}
                <NavDropdown
                  title={
                    <span className={`tiny text-uppercase fw-bold tracking-widest transition-all ${isAsoActive ? 'text-primary' : 'text-main opacity-75'}`}>
                      Aṣọ̀ Lésẹ̀kẹ̀sẹ̀ Retail
                    </span>
                  }
                  id="aso-dropdown"
                  className="aso-nav-dropdown d-flex align-items-center"
                >
                  <NavDropdown.Item as={Link} to="/about-aso-lesekese" className="tiny text-uppercase fw-bold py-3 px-4">
                    About the Line
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/shop" className="tiny text-uppercase fw-bold py-3 px-4">
                    The Collection
                  </NavDropdown.Item>
                </NavDropdown>

                <Nav.Link as={Link} to="/wholesale" className={`tiny text-uppercase fw-bold tracking-widest ${isActive('/wholesale') ? 'text-primary' : 'text-main opacity-75'}`}>
                  Wholesale
                </Nav.Link>
             </Nav>
          </div>

          {/* Action Registry & Toggle */}
          <div className="d-flex align-items-center gap-2 gap-md-3">
             {/* Identity Manifestation Trigger (Desktop) */}
             <div className="d-none d-md-flex align-items-center gap-3">
                {isAuthenticated ? (
                  <Link to="/dashboard/orders" className="btn btn-light rounded-pill p-2 d-flex align-items-center gap-2 border-light shadow-sm transition-all hover-scale-105">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                      <User size={16} />
                    </div>
                    <span className="tiny fw-bold text-main pe-2 d-none d-xl-inline">{profile?.full_name?.split(' ')[0]}</span>
                  </Link>
                ) : (
                  <Link to="/login" className="btn btn-primary rounded-pill px-4 py-2 border-0 fw-bold tiny text-decoration-none shadow-sm">
                    Login
                  </Link>
                )}
             </div>

             {/* Cart Manifestation Trigger */}
             <button
                onClick={() => dispatch(toggleCart())}
                className="btn btn-white rounded-pill px-3 px-md-4 py-2 d-flex align-items-center gap-2 shadow-sm border-light transition-all hover-scale-105 position-relative"
              >
                <div className="position-relative">
                  <ShoppingBag size={18} />
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary border border-2 border-white"
                        style={{ fontSize: '0.6rem', padding: '0.3em 0.5em', zIndex: 12 }}
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span className="tiny fw-bold text-uppercase text-main opacity-75 d-none d-md-inline">Cart</span>
              </button>

              {/* Mobile Toggle Trigger */}
              <button onClick={handleShow} className="btn btn-link p-2 text-main border-0 shadow-none d-lg-none">
                <Menu size={24} />
              </button>
          </div>
        </Container>
      </Navbar>

      {/* Institutional Offcanvas Manifestation */}
      <Offcanvas 
        show={showOffcanvas} 
        onHide={handleClose} 
        placement="end"
        className="navbar-offcanvas border-0 shadow-lg"
        style={{ width: '85%', maxWidth: '400px', background: 'var(--lt-bg-ivory)' }}
      >
        <Offcanvas.Header className="p-4 border-bottom border-light bg-white d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
             <div className="rounded-circle overflow-hidden shadow-sm border border-light" style={{ width: '40px', height: '40px' }}>
                <img src="/logo.jpeg" alt="Logo" className="w-100 h-100 object-fit-cover" />
             </div>
             <h5 className="fw-bold text-main mb-0 tiny text-uppercase tracking-widest">Heritage Menu</h5>
          </div>
          <button onClick={handleClose} className="btn btn-link text-main p-2 border-0 opacity-25">
             <X size={24} />
          </button>
        </Offcanvas.Header>
        
        <Offcanvas.Body className="p-4">
          <div className="d-flex flex-column gap-2">
             {/* Mobile Navigation Registry */}
             <div className="p-3 bg-white rounded-5 shadow-sm border border-light my-2">
                <span className="tiny text-uppercase fw-bold opacity-25 tracking-widest d-block mb-3" style={{ fontSize: '0.6rem' }}>The Platform</span>
                <div className="d-flex flex-column gap-2">
                  <Link to="/" onClick={handleClose} className={`d-flex align-items-center justify-content-between p-3 rounded-4 text-decoration-none transition-all ${isActive('/') ? 'bg-primary-light text-primary' : 'bg-light text-main opacity-75'}`}>
                     <span className="fw-bold tiny text-uppercase tracking-widest">Home</span>
                     <ChevronRight size={14} />
                  </Link>
                  <Link to="/about" onClick={handleClose} className={`d-flex align-items-center justify-content-between p-3 rounded-4 text-decoration-none transition-all ${isActive('/about') ? 'bg-primary-light text-primary' : 'bg-light text-main opacity-75'}`}>
                     <span className="fw-bold tiny text-uppercase tracking-widest">About La Tej</span>
                     <ChevronRight size={14} />
                  </Link>
                  <Link to="/support" onClick={handleClose} className={`d-flex align-items-center justify-content-between p-3 rounded-4 text-decoration-none transition-all ${isActive('/support') ? 'bg-primary-light text-primary' : 'bg-light text-main opacity-75'}`}>
                     <span className="fw-bold tiny text-uppercase tracking-widest">Support Hub</span>
                     <ChevronRight size={14} />
                  </Link>
                  <Link to="/contact" onClick={handleClose} className={`d-flex align-items-center justify-content-between p-3 rounded-4 text-decoration-none transition-all ${isActive('/contact') ? 'bg-primary-light text-primary' : 'bg-light text-main opacity-75'}`}>
                     <span className="fw-bold tiny text-uppercase tracking-widest">Contact Us</span>
                     <ChevronRight size={14} />
                  </Link>
                </div>
             </div>

             <div className="p-3 bg-white rounded-5 shadow-sm border border-light my-2">
                <span className="tiny text-uppercase fw-bold opacity-25 tracking-widest d-block mb-3" style={{ fontSize: '0.6rem' }}>Aṣọ̀ Lésẹ̀kẹ̀sẹ̀ Retail</span>
                <div className="d-flex flex-column gap-2">
                  <Link to="/about-aso-lesekese" onClick={handleClose} className={`d-flex align-items-center justify-content-between p-3 rounded-4 text-decoration-none transition-all ${isActive('/about-aso-lesekese') ? 'bg-primary-light text-primary' : 'bg-light text-main opacity-75'}`}>
                     <span className="fw-bold tiny text-uppercase tracking-widest">About the Line</span>
                     <ChevronRight size={14} />
                  </Link>
                  <Link to="/shop" onClick={handleClose} className={`d-flex align-items-center justify-content-between p-3 rounded-4 text-decoration-none transition-all ${isActive('/shop') ? 'bg-primary-light text-primary' : 'bg-light text-main opacity-75'}`}>
                     <span className="fw-bold tiny text-uppercase tracking-widest">The Collection</span>
                     <ChevronRight size={14} />
                  </Link>
                </div>
             </div>

             <Link to="/wholesale" onClick={handleClose} className={`mobile-nav-link d-flex align-items-center justify-content-between p-3 rounded-4 transition-all text-decoration-none ${isActive('/wholesale') ? 'bg-primary text-white' : 'bg-white text-main shadow-sm'}`}>
                <span className="fw-bold tiny text-uppercase tracking-widest">Wholesale</span>
                <ChevronRight size={16} className={isActive('/wholesale') ? 'text-white' : 'opacity-25'} />
             </Link>

             <hr className="my-3 opacity-5" />

             {/* Identity Manifestation (Mobile) */}
             {isAuthenticated ? (
               <Link to="/dashboard/orders" onClick={handleClose} className="d-flex align-items-center gap-3 p-4 bg-primary text-white rounded-5 shadow-premium text-decoration-none">
                  <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                    <User size={24} />
                  </div>
                  <div className="d-flex flex-column">
                    <span className="fw-bold leading-tight">{profile?.full_name}</span>
                    <span className="tiny text-uppercase fw-bold opacity-75 tracking-widest" style={{ fontSize: '0.6rem' }}>View My Dashboard</span>
                  </div>
                  <ChevronRight size={20} className="ms-auto opacity-50" />
               </Link>
             ) : (
               <Link to="/login" onClick={handleClose} className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-premium border-0">
                  Login to Account
               </Link>
             )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <style>
        {`
          .mobile-nav-link {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .bg-primary-light {
            background: rgba(109, 62, 33, 0.05);
          }
          .hover-scale-105:hover {
            transform: scale(1.05);
          }
          .aso-nav-dropdown .dropdown-toggle {
            display: flex !important;
            align-items: center !important;
            gap: 4px;
            padding-right: 0 !important;
          }
          .aso-nav-dropdown .dropdown-toggle::after {
            margin-left: 4px !important;
            vertical-align: middle !important;
          }
        `}
      </style>
    </>
  )
}

export default GlobalNavbar
