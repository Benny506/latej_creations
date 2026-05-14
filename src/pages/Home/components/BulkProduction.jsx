import React from 'react'
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { Scissors, Package, Users, Palette, Ruler, MessageCircle, FileText } from 'lucide-react'

/**
 * BulkProduction Component
 * Provisions a high-fidelity presentation of B2B manufacturing services.
 * Features service highlights and a WhatsApp-integrated consultation form.
 */
const BulkProduction = ({ content }) => {
  const defaultServices = [
    { title: 'Souvenirs/ Wholesale', icon: <Package size={28} />, desc: 'High-volume production for corporate gifting and wholesale distribution.' },
    { title: 'Private Label', icon: <Users size={28} />, desc: 'Custom brand labeling and specialized manufacturing for fashion houses.' },
    { title: 'Production Consulting', icon: <FileText size={28} />, desc: 'Strategic guidance on scale, cost optimization, and supply chain.' },
    { title: 'Pattern Development', icon: <Scissors size={28} />, desc: 'Precision engineering of garment patterns from sketches or samples.' },
    { title: 'Sampling', icon: <Palette size={28} />, desc: 'High-fidelity prototype creation before full batch commitment.' }
  ]

  const services = content?.services || defaultServices

  // Helper to map icons back if they come from JSON (since Lucide icons can't be stored in JSON easily)
  const getIcon = (idx) => {
    return defaultServices[idx]?.icon || <Package size={28} />
  }

  return (
    <section className="py-5" style={{ background: 'rgba(252, 249, 245, 0.7)' }}>
      <Container className="py-5">
        <Row className="justify-content-center mb-5 text-center px-3">
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="display-5 mb-4 fw-bold">
                {content?.title || 'Bulk Production'} <span style={{ color: 'var(--lt-terracotta)' }}>{content?.title_accent || 'Excellence'}</span>
              </h2>
              <p className="text-dark mx-auto" style={{ maxWidth: '700px' }}>
                {content?.description || 'We empower emerging and established brands with world-class African fashion manufacturing. From pattern development to final quality control.'}
              </p>
            </motion.div>
          </Col>
        </Row>

        <Row className="g-4 mb-5 px-2">
          {services.map((service, idx) => (
            <Col key={idx} md={6} lg={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-100 p-4 border-0 shadow-sm hover-lift" style={{ borderRadius: '24px' }}>
                  <div
                    className="mb-4 d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{ width: 60, height: 60, background: 'var(--lt-earth-light)', color: 'var(--lt-earth-dark)' }}
                  >
                    {getIcon(idx)}
                  </div>
                  <h4 className="mb-3 fw-bold" style={{ color: 'var(--lt-earth-dark)' }}>{service.title}</h4>
                  <p className="text-dark small mb-0">{service.desc}</p>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Quotations & Catalog CTA */}
        <div
          className="p-4 p-md-5 text-center mb-5 mx-2"
          style={{
            background: 'var(--lt-earth-dark)',
            borderRadius: '40px',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <img
            src={content?.catalog?.bg_image || "/luxury_ankara_accessories.png"}
            alt="Catalog Background"
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              objectFit: 'cover',
              opacity: 0.05,
              mixBlendMode: 'luminosity'
            }}
          />
          {/* Dark Overlay for ensured contrast */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ background: 'rgba(0,0,0,0.2)', zIndex: 0 }}
          />
          <div className="position-relative z-1">
            <h3 className="mb-4 text-white fw-bold">{content?.catalog?.title || 'Access Our Pricing & Catalogs'}</h3>
            <p className="opacity-75 mb-5 px-lg-5 mx-auto" style={{ maxWidth: '800px' }}>
              {content?.catalog?.description || 'Ready to scale? Click below to explore our detailed catalogs and transparent pricing tiers for bags, dresses, and accessories.'}
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Button style={{ background: '#fff', color: 'var(--lt-earth-dark)', border: 'none' }} className="px-4 px-md-5 py-3 shadow fw-bold">
                {content?.catalog?.cta_primary || 'Bag & Dresses Catalog'}
              </Button>
              <Button variant="outline-light" className="px-4 px-md-5 py-3">
                {content?.catalog?.cta_secondary || 'Accessories Catalog'}
              </Button>
            </div>
          </div>
        </div>

        {/* WhatsApp Inquiry Form */}
        <Row className="justify-content-center mt-5 pt-lg-5">
          <Col lg={11}>
            <div
              className="p-4 p-md-5 shadow-lg position-relative overflow-hidden"
              style={{ background: '#fff', borderRadius: '40px' }}
            >
              <div
                className="position-absolute top-0 end-0 p-5 d-none d-lg-block"
                style={{ opacity: 0.05, transform: 'rotate(15deg)', pointerEvents: 'none' }}
              >
                <MessageCircle size={300} />
              </div>

              <Row className="align-items-center">
                <Col lg={5} className="mb-5 mb-lg-0 text-center text-lg-start">
                  <h2 className="mb-4 fw-bold">Request a <span style={{ color: 'var(--lt-terracotta)' }}>Production Quote</span></h2>
                  <p className="text-dark mb-5">
                    Share your vision with our manufacturing experts via WhatsApp.
                    We'll provide a tailored timeline and pricing estimate.
                  </p>
                  <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-3 h4 fw-bold" style={{ color: 'var(--lt-earth-dark)' }}>
                    <MessageCircle fill="currentColor" size={28} />
                    +234 812 345 6789
                  </div>
                </Col>
                <Col lg={7}>
                  <Form className="row g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="tiny text-uppercase tracking-widest fw-bold opacity-50">Your Name</Form.Label>
                        <Form.Control type="text" placeholder="John Doe" className="bg-light border-0 py-3" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="tiny text-uppercase tracking-widest fw-bold opacity-50">Individual / Brand Name</Form.Label>
                        <Form.Control type="text" placeholder="Fashion Brand X" className="bg-light border-0 py-3" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="tiny text-uppercase tracking-widest fw-bold opacity-50">Quantity Required</Form.Label>
                        <Form.Control type="number" placeholder="Min. 50 Units" className="bg-light border-0 py-3" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="tiny text-uppercase tracking-widest fw-bold opacity-50">Production Timeline</Form.Label>
                        <Form.Select className="bg-light border-0 py-3">
                          <option>Standard (14 Days)</option>
                          <option>Express (7 Days)</option>
                          <option>Flexible</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="tiny text-uppercase tracking-widest fw-bold opacity-50">Product Details</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Tell us about the items..." className="bg-light border-0 py-3" />
                      </Form.Group>
                    </Col>
                    <Col xs={12} className="mt-4">
                      <Button style={{ background: 'var(--lt-earth-dark)', borderColor: 'var(--lt-earth-dark)' }} className="w-100 py-3 shadow d-flex align-items-center justify-content-center">
                        <MessageCircle size={20} className="me-2" />
                        Send Request via WhatsApp
                      </Button>
                    </Col>
                  </Form>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default BulkProduction
