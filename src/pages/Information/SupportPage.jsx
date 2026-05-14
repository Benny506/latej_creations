import React, { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Accordion } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, MessageCircle, HelpCircle, ChevronDown } from 'lucide-react'
import { useAppUi } from '../../context/AppUiContext'
import { ADMIN_CONFIG } from '../../utils/constants'
import supabase from '../../utils/supabase'

const SupportPage = () => {
  const { siteContent, addAlert, setGlobalLoading } = useAppUi()
  const content = siteContent?.support?.sections || {}

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  })

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: 'easeOut' }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGlobalLoading(true, 'Sending your message...')

    try {
      // 1. Dispatch Email to User (Confirmation)
      const userMailPromise = supabase.functions.invoke('send-email', {
        body: {
          to: [{ email: formData.email, name: formData.name }],
          subject: 'Message Received - La Tejcreations',
          from_name: 'La Tejcreations',
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #6D3E21;">Hi ${formData.name},</h2>
              <p>Thanks for reaching out to us! We've received your message about <strong>${formData.subject}</strong>.</p>
              <p>Our team is already looking into it, and we'll get back to you as soon as possible.</p>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="font-size: 0.9em; color: #777;">Best regards,<br>The La Tejcreations Team</p>
              </div>
            </div>
          `
        }
      })

      // 2. Dispatch Email to Admin (Notification)
      const adminMailPromise = supabase.functions.invoke('send-email', {
        body: {
          to: [{ email: ADMIN_CONFIG.email, name: ADMIN_CONFIG.name }],
          subject: `New Inquiry: ${formData.subject}`,
          from_name: 'Platform Concierge',
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #6D3E21;">New Inquiry Received</h2>
              <p>You have a new message from the support page:</p>
              <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>From:</strong> ${formData.name} (${formData.email})</p>
                <p><strong>Subject:</strong> ${formData.subject}</p>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${formData.message}</p>
              </div>
              <p>You can reply directly to the customer at ${formData.email}.</p>
            </div>
          `
        }
      })

      const [userRes, adminRes] = await Promise.all([userMailPromise, adminMailPromise])

      if (userRes.error) throw new Error('Error sending confirmation email')
      if (adminRes.error) throw new Error('Error notifying admin')

      addAlert('Your message has been sent successfully! Check your email for confirmation.', 'success')
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' })
    } catch (err) {
      console.error('Email Manifestation Failure:', err)
      addAlert('We encountered a snag while sending your message. Please try again or reach out via phone.', 'danger')
    } finally {
      setGlobalLoading(false)
    }
  }

  const defaultFaqs = [
    {
      q: 'How do I start a Wholesale partnership?',
      a: 'To begin your wholesale journey, simply register for an account and select the Wholesale catalog. Ensure your total order quantity meets the minimum of 20 items per collection to unlock enterprise pricing.'
    },
    {
      q: 'What is the delivery timeline for Aṣọ̀ Lésẹ̀kẹ̀sẹ̀?',
      a: 'As our retail line is ready-to-wear, orders are typically processed within 48 hours. Shipping timelines vary by region but generally range from 3-7 business days globally.'
    },
    {
      q: 'Can I track my procurement status?',
      a: 'Yes, your personal dashboard provides real-time manifestation of your order status, from payment confirmation to final delivery manifest.'
    },
    {
      q: 'What materials do you use for your creations?',
      a: 'We use premium, ethically sourced African textiles, including high-grade cottons and traditional hand-woven fabrics, treated for durability and modern luxury comfort.'
    }
  ]

  const faqs = content.faqs?.items || defaultFaqs

  return (
    <div className="support-page bg-white">
      {/* Hero Manifestation */}
      <section className="position-relative overflow-hidden py-10 bg-main text-white" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100">
          <img
            src={content.hero?.image || "/assets/information/support-hero.png"}
            alt="Support Concierge"
            className="w-100 h-100 object-fit-cover opacity-20"
          />
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(11, 11, 13, 0.9), rgba(11, 11, 13, 0.6))' }}></div>
        </div>
        <Container className="position-relative" style={{ zIndex: 1 }}>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <motion.div {...fadeInUp}>
                <span className="tiny text-uppercase fw-bold tracking-widest opacity-75 mb-3 d-block text-light">
                  {content.hero?.badge || 'Concierge Services'}
                </span>
                <h1 className="display-4 fw-bold mb-4 tracking-tighter text-light">
                  {content.hero?.title ? (
                    <>
                      {content.hero.title.split(content.hero.title_accent || '')[0]}
                      <span className="text-primary">{content.hero.title_accent || ''}</span>
                      {content.hero.title.split(content.hero.title_accent || '')[1]}
                    </>
                  ) : (
                    <>Professional Support <br /><span className="text-primary">& Collaboration</span></>
                  )}
                </h1>
                <p className="lead opacity-75 mb-0 leading-relaxed text-light">
                  {content.hero?.description || 'Whether you are a retail enthusiast or a wholesale partner, our team is dedicated to ensuring your experience with La Tejcreations is flawless and professional.'}
                </p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact & Form Section */}
      <section className="py-10">
        <Container>
          <Row className="g-5">
            <Col lg={5}>
              <motion.div {...fadeInUp} className="pe-lg-5">
                <h2 className="display-6 fw-bold text-main mb-4">{content.contact?.title || 'Connect with Us'}</h2>
                <p className="text-main opacity-75 fs-5 mb-5 leading-relaxed">
                  {content.contact?.description || 'Our heritage experts are available for detailed consultations regarding bulk procurement, custom lines, or retail inquiries.'}
                </p>

                <div className="d-flex flex-column gap-4">
                  <div className="d-flex align-items-center gap-4">
                    <div className="bg-primary-light p-4 rounded-circle text-primary">
                      <Mail size={24} />
                    </div>
                    <div>
                      <span className="tiny text-uppercase fw-bold opacity-50 d-block">Email Registry</span>
                      <span className="fw-bold fs-5 text-main">{content.contact?.methods?.email || 'hello@latejcreations.com'}</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-4">
                    <div className="bg-primary-light p-4 rounded-circle text-primary">
                      <Phone size={24} />
                    </div>
                    <div>
                      <span className="tiny text-uppercase fw-bold opacity-50 d-block">Voice Manifest</span>
                      <span className="fw-bold fs-5 text-main">{content.contact?.methods?.phone || '+234 (0) 800 HERITAGE'}</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-4">
                    <div className="bg-primary-light p-4 rounded-circle text-primary">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <span className="tiny text-uppercase fw-bold opacity-50 d-block">Corporate Studio</span>
                      <span className="fw-bold fs-5 text-main">{content.contact?.methods?.location || 'Lagos, Nigeria | London, UK'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Col>

            <Col lg={7}>
              <motion.div {...fadeInUp} className="bg-light p-5 rounded-5 shadow-sm border border-white">
                <h3 className="fw-bold text-main mb-4">Inquiry Manifest</h3>
                <Form onSubmit={handleSubmit}>
                  <Row className="g-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="tiny text-uppercase fw-bold opacity-50 ps-1">Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          className="bg-white border-0 py-3 rounded-4 shadow-none"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="tiny text-uppercase fw-bold opacity-50 ps-1">Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          required
                          className="bg-white border-0 py-3 rounded-4 shadow-none"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="tiny text-uppercase fw-bold opacity-50 ps-1">Subject of Inquiry</Form.Label>
                        <Form.Select
                          className="bg-white border-0 py-3 rounded-4 shadow-none"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        >
                          <option>General Inquiry</option>
                          <option>Wholesale Partnership</option>
                          <option>Retail Assistance</option>
                          <option>Custom Commission</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="tiny text-uppercase fw-bold opacity-50 ps-1">Message Manifest</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          required
                          className="bg-white border-0 py-3 rounded-4 shadow-none"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Button
                        type="submit"
                        variant="primary"
                        className="rounded-pill w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 border-0 shadow-premium mt-2"
                      >
                        <Send size={18} /> Dispatch Inquiry
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FAQ Discovery Layer */}
      <section className="py-10 bg-main text-white overflow-hidden">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3 tracking-tighter">{content.faqs?.title || 'Frequently Asked'}</h2>
            <p className="opacity-50 tiny text-uppercase fw-bold tracking-widest">{content.faqs?.subtitle || 'Heritage & Logistics Guidance'}</p>
          </div>
          <Row className="justify-content-center">
            <Col lg={8}>
              <motion.div {...fadeInUp}>
                <Accordion className="premium-accordion border-0">
                  {faqs.map((faq, idx) => (
                    <Accordion.Item eventKey={idx.toString()} key={idx} className="bg-transparent border-0 mb-3 overflow-hidden">
                      <Accordion.Header className="rounded-4 overflow-hidden border border-white/10 bg-white/5">
                        <div className="d-flex align-items-center gap-3 w-100 py-1">
                          <HelpCircle size={20} className="text-primary" />
                          <span className="fw-bold tracking-tight text-dark">{faq.q}</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="bg-white/5 border border-top-0 border-white/10 rounded-bottom-4 opacity-75 leading-relaxed pt-2">
                        {faq.a}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      <style>
        {`
          .bg-primary-light { background: rgba(109, 62, 33, 0.05); }
          .py-10 { padding-top: 6rem; padding-bottom: 6rem; }
          .shadow-premium { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); }
          
          .premium-accordion .accordion-button {
            background: rgba(255, 255, 255, 0.05) !important;
            color: white !important;
            box-shadow: none !important;
            padding: 1.5rem !important;
            border-radius: 1rem !important;
          }
          .premium-accordion .accordion-button:not(.collapsed) {
            background: rgba(255, 255, 255, 0.1) !important;
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
          }
          .premium-accordion .accordion-button::after {
            filter: brightness(0) invert(1);
          }
          .premium-accordion .accordion-item {
            background: transparent !important;
          }
        `}
      </style>
    </div>
  )
}
export default SupportPage
