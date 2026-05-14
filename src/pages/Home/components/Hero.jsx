import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { ArrowRight, Factory } from 'lucide-react'

/**
 * Hero Component
 * Provisions a cinematic first impression for the hybrid platform.
 * Features dual CTAs for Wholesale and Retail, utilizing brand-aligned imagery.
 */
const Hero = ({ content }) => {
  return (
    <section
      className="position-relative overflow-hidden"
      style={{
        minHeight: '100vh',
        paddingTop: 'clamp(100px, 15vh, 160px)',
        paddingBottom: '80px',
        background: 'transparent'
      }}
    >
      <Container>
        <Row className="align-items-center g-5">
          <Col lg={6} className="text-center text-lg-start order-2 order-lg-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <div
                className="d-flex align-items-center justify-content-center justify-content-lg-start gap-3 mb-4"
                style={{
                  color: 'var(--lt-terracotta)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  fontSize: '0.8rem'
                }}
              >
                <div style={{ width: 30, height: 2, background: 'var(--lt-terracotta)' }} className="d-none d-sm-block" />
                {content?.badge || 'Wholesale Manufacturer & Retail'}
              </div>

              <h1 className="mb-4 display-3 fw-bold" style={{ lineHeight: 1.1, color: 'var(--lt-text-main)' }}>
                {content?.title ? (
                  <>
                    {content.title.split(content.title_accent || '')[0]}
                    <span style={{ color: 'var(--lt-terracotta)' }}>{content.title_accent || ''}</span>
                    {content.title.split(content.title_accent || '')[1]}
                  </>
                ) : (
                  <>
                    Manufacturing <br />
                    <span style={{ color: 'var(--lt-terracotta)' }}>Native Excellence</span>
                  </>
                )}
              </h1>

              <p className="lead mb-5 pe-lg-5 text-dark mx-auto mx-lg-0" style={{ maxWidth: '600px' }}>
                {content?.description || (
                  <>
                    We manufacture fashion in scale while offering limited retail pieces
                    through our signature line <span className="fw-bold">Aṣọ̀ Lésẹ̀kẹ̀sẹ̀</span>.
                  </>
                )}
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Button
                  style={{ background: 'var(--lt-earth-dark)', borderColor: 'var(--lt-earth-dark)', borderRadius: '100px' }}
                  className="btn-lg px-4 py-3 shadow-lg d-flex align-items-center justify-content-center"
                >
                  {content?.cta_wholesale || 'Request Bulk Production'}
                  <Factory size={18} className="ms-2" />
                </Button>

                <Button
                  style={{ color: 'var(--lt-earth-dark)', borderColor: 'var(--lt-earth-dark)', borderRadius: '100px' }}
                  variant="outline-dark"
                  className="btn-lg px-4 py-3 d-flex align-items-center justify-content-center"
                >
                  {content?.cta_retail || 'Shop Retail Line'}
                  <ArrowRight size={18} className="ms-2" />
                </Button>
              </div>
            </motion.div>
          </Col>

          <Col lg={6} className="position-relative order-1 order-lg-2">
            <div className="position-relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="position-relative z-1"
              >
                <div
                  className="overflow-hidden shadow-2xl"
                  style={{
                    borderRadius: '40px 140px 40px 40px',
                    border: '10px solid #fff'
                  }}
                >
                  <img
                    src={content?.image_main || "/hero_production_workshop.png"}
                    alt="La Tejcreations Workshop"
                    className="img-fluid w-100"
                    style={{ objectFit: 'cover', minHeight: '450px', height: '60vh' }}
                  />
                </div>
              </motion.div>

              {/* Secondary Floating Image */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                viewport={{ once: true }}
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '-10px',
                  width: '45%',
                  zIndex: 2,
                  border: '6px solid #fff',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
                className="d-none d-sm-block"
              >
                <img
                  src={content?.image_secondary || "/production_fabric_detail.png"}
                  alt="Fabric Detail"
                  className="img-fluid"
                />
              </motion.div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Hero
