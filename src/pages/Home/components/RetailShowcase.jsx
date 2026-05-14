import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { ShoppingCart, Globe, ShieldCheck, ShoppingBag } from 'lucide-react'

/**
 * RetailShowcase Component
 * Provisions a high-fidelity introduction to the Aṣọ̀ Lésẹ̀kẹ̀sẹ̀ retail line.
 * Features brand-aligned narrative elements and premium CTA protocols.
 */
const RetailShowcase = ({ content }) => {
  return (
    <section className="py-5" style={{ background: 'transparent' }}>
      <Container className="py-5">
        <Row className="align-items-center g-5">
          <Col lg={5} className="order-2 order-lg-1 text-center text-lg-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div
                style={{
                  color: 'var(--lt-terracotta)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  fontSize: '0.8rem'
                }}
                className="mb-4 d-flex align-items-center justify-content-center justify-content-lg-start gap-3"
              >
                <div style={{ width: 25, height: 2, background: 'var(--lt-terracotta)' }} />
                {content?.badge || 'Signature Product Line'}
              </div>

              <h2 className="display-4 mb-4 fw-bold" style={{ color: 'var(--lt-earth-dark)' }}>
                {content?.title || 'Aṣọ̀ Lésẹ̀kẹ̀sẹ̀ —'} <br />
                <span className="text-dark">{content?.title_accent || 'Wearable Ease'}</span>
              </h2>

              <div className="mb-5">
                <p className="text-dark lead mb-4" style={{ fontStyle: 'italic' }}>
                  "{content?.quote || 'Àṣọ Lẹ́sẹ̀kẹsẹ̀ is a Yoruba expression for clothes you can wear immediately.'}"
                </p>
                <p className="text-dark mx-auto mx-lg-0" style={{ maxWidth: '500px' }}>
                  {content?.description || 'Our retail line represents the pinnacle of modern African chic. Designed for the contemporary global citizen who values ease and authenticity.'}
                </p>
              </div>

              <Row className="mb-5 g-4 justify-content-center justify-content-lg-start">
                <Col xs={6} sm={5} lg={6}>
                  <div className="d-flex align-items-center gap-2 justify-content-center justify-content-lg-start">
                    <Globe size={20} className="text-primary" />
                    <span className="tiny text-uppercase tracking-widest fw-bold text-muted">Global Shipping</span>
                  </div>
                </Col>
                <Col xs={6} sm={5} lg={6}>
                  <div className="d-flex align-items-center gap-2 justify-content-center justify-content-lg-start">
                    <ShieldCheck size={20} style={{ color: '#6D3E21' }} />
                    <span className="tiny text-uppercase tracking-widest fw-bold text-muted">#secureease</span>
                  </div>
                </Col>
              </Row>

              <Button
                style={{ background: '#6D3E21', borderColor: '#6D3E21', borderRadius: '100px' }}
                className="btn-lg px-5 py-3 shadow-lg d-flex align-items-center mx-auto mx-lg-0"
              >
                {content?.cta_text || 'Shop Aṣọ̀ Lésẹ̀kẹ̀sẹ̀'}
                <ShoppingBag size={20} className="ms-2" />
              </Button>
            </motion.div>
          </Col>

          <Col lg={7} className="order-1 order-lg-2">
            <Row className="g-3 g-md-4 px-2">
              <Col xs={6}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                  className="overflow-hidden shadow-xl"
                  style={{ borderRadius: '24px', height: 'clamp(250px, 40vh, 400px)' }}
                >
                  <img
                    src={content?.image_1 || "/luxury_ankara_accessories.png"}
                    alt="RTW Oufit"
                    className="img-fluid h-100 w-100"
                    style={{ objectFit: 'cover' }}
                  />
                </motion.div>
              </Col>
              <Col xs={6} className="pt-4 pt-md-5">
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="overflow-hidden shadow-xl"
                  style={{ borderRadius: '24px', height: 'clamp(250px, 40vh, 400px)' }}
                >
                  <img
                    src={content?.image_2 || "/signature_bag.png"}
                    alt="Signature Bag"
                    className="img-fluid h-100 w-100"
                    style={{ objectFit: 'cover' }}
                  />
                </motion.div>
              </Col>
              <Col xs={12}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="p-3 p-md-4 mt-2 text-center shadow-sm"
                  style={{
                    background: 'var(--lt-earth-light)',
                    borderRadius: '20px',
                    border: '1px dashed #6D3E21'
                  }}
                >
                  <div className="tiny fw-bold mb-0 tracking-widest text-uppercase" style={{ color: '#6D3E21' }}>
                    {content?.footer_badge || 'Handcrafted Excellence'}
                  </div>
                </motion.div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default RetailShowcase
