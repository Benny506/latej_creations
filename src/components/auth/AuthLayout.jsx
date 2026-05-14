import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AuthTips from './AuthTips'
import { ArrowLeft } from 'lucide-react'

/**
 * AuthLayout Component
 * A world-class two-column manifestation for all authentication screens.
 * Features a cinematic AuthTips panel and a refined form area.
 */
const AuthLayout = ({ children, title, subtitle, backLink = "/" }) => {
  return (
    <div className="auth-layout-registry min-vh-100 bg-white overflow-hidden">
      <Row className="g-0 min-vh-100">
        {/* Form Column (Left) */}
        <Col lg={5} className="d-flex flex-column p-4 p-lg-5">
          <div className="mb-auto">
             <Link to={backLink} className="btn btn-light rounded-circle p-3 shadow-sm border-0 text-primary transition-all hover-scale-110">
                <ArrowLeft size={20} />
             </Link>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-100 mx-auto"
            style={{ maxWidth: '450px' }}
          >
            <div className="text-start mb-5">
              <h1 className="fw-bold text-main mb-2 display-5">{title}</h1>
              <p className="text-dark opacity-50 fw-bold">{subtitle}</p>
            </div>

            <div className="auth-form-manifestation">
              {children}
            </div>
          </motion.div>

          <div className="mt-auto text-start pt-5">
             <p className="tiny text-uppercase fw-bold opacity-25 mb-0" style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}>
                © 2024 La Tejcreations. All Rights Reserved.
             </p>
          </div>
        </Col>

        {/* Cinematic Tips Column (Right) */}
        <Col lg={7} className="d-none d-lg-block bg-primary">
          <AuthTips />
        </Col>
      </Row>

      <style dangerouslySetInnerHTML={{ __html: `
        .auth-layout-registry {
           background-color: #fff;
        }
        .btn-light {
           background-color: var(--lt-bg-ivory) !important;
        }
      `}} />
    </div>
  )
}

export default AuthLayout
