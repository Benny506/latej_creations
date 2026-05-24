import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { FaTiktok } from 'react-icons/fa'
import { ADMIN_CONFIG } from '../../utils/constants'

/**
 * Global Footer Component
 * Provisions high-fidelity brand closure and secondary navigation.
 * Features culturally-aligned styling and responsive contact protocols.
 */
const GlobalFooter = () => {
  return (
    <footer
      style={{
        background: 'var(--lt-earth-light)',
        borderTop: '1px solid var(--lt-border-soft)',
        padding: '80px 0 40px'
      }}
    >
      <Container>
        <Row className="g-5 mb-5">
          <Col lg={4}>
            <div className="mb-4">
              <h2
                style={{
                  fontFamily: 'var(--lt-font-header)',
                  fontWeight: 800,
                  fontSize: '1.8rem',
                  color: 'var(--lt-earth-dark)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}
              >
                Latéjcreations
              </h2>
              <div
                style={{
                  fontFamily: 'var(--lt-font-body)',
                  fontSize: '0.75rem',
                  color: 'var(--lt-terracotta)',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase'
                }}
              >
                Aṣọ̀ Lésẹ̀kẹ̀sẹ̀
              </div>
            </div>
            <p className="text-dark mb-4 opacity-75">
              Wholesale manufacturer of premium African wears and signature retail collections.
              Quality craftsmanship meets modern native aesthetics.
            </p>
            <div className="d-flex gap-3 text-primary">
              <Instagram size={20} />
              <Facebook size={20} />
              <FaTiktok size={20} />
            </div>
          </Col>

          <Col sm={6} lg={3} className="ms-lg-auto">
            <h5 className="mb-4 uppercase tiny fw-bold tracking-widest text-primary">The Platform</h5>
            <ul className="list-unstyled d-grid gap-2">
              <li><Link to="/" className="text-dark opacity-75 hover-opacity-100 text-decoration-none small fw-bold">Home</Link></li>
              <li><Link to="/about" className="text-dark opacity-75 hover-opacity-100 text-decoration-none small fw-bold">About La Tej</Link></li>
              <li><Link to="/support" className="text-dark opacity-75 hover-opacity-100 text-decoration-none small fw-bold">Support Hub</Link></li>
              <li><Link to="/contact" className="text-dark opacity-75 hover-opacity-100 text-decoration-none small fw-bold">Contact Us</Link></li>
            </ul>
          </Col>

          <Col sm={6} lg={3}>
            <h5 className="mb-4 uppercase tiny fw-bold tracking-widest text-primary">Heritage Lines</h5>
            <ul className="list-unstyled d-grid gap-2">
              <li><Link to="/shop" className="text-dark opacity-75 hover-opacity-100 text-decoration-none small fw-bold">Aṣọ̀ Lésẹ̀kẹ̀sẹ̀ Retail</Link></li>
              <li><Link to="/wholesale" className="text-dark opacity-75 hover-opacity-100 text-decoration-none small fw-bold">Wholesale Partnership</Link></li>
              {/* <li><Link to="/size-guide" className="text-dark opacity-75 hover-opacity-100 text-decoration-none small fw-bold">Size Guide</Link></li> */}
              <li><Link to="/policies" className="text-dark opacity-75 hover-opacity-100 text-decoration-none small fw-bold">Legal & Policies</Link></li>
            </ul>
          </Col>

          <Col lg={3}>
            <h5 className="mb-4 uppercase tracking-widest text-primary">Reach Out</h5>
            <ul className="list-unstyled d-grid gap-3">
              <li className="d-flex align-items-center gap-3 text-dark opacity-75">
                <MapPin size={18} className="text-primary" />
                {ADMIN_CONFIG.location}
              </li>
              <li className="d-flex align-items-center gap-3 text-dark opacity-75">
                <Phone size={18} className="text-primary" />
                {ADMIN_CONFIG.phone}
              </li>
              <li className="d-flex align-items-center gap-3 text-dark opacity-75">
                <Mail size={18} className="text-primary" />
                {ADMIN_CONFIG.email}
              </li>
            </ul>
          </Col>
        </Row>

        <div className="pt-4 border-top border-opacity-10 border-dark text-center">
          <p className="tiny text-uppercase tracking-widest text-dark opacity-50 mb-0">
            © {new Date().getFullYear()} La Tejcreations & Aṣọ̀ Lésẹ̀kẹ̀sẹ̀. All Rights Reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}

export default GlobalFooter
