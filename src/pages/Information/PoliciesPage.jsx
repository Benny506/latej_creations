import { useAppUi } from '../../context/AppUiContext'
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { Shield, Truck, ShoppingBag, Scale, ChevronRight } from 'lucide-react'

const PoliciesPage = () => {
  const { siteContent } = useAppUi()
  const content = siteContent?.policies?.sections || {}

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const defaultSections = [
    {
      id: 'privacy',
      icon: <Shield size={20} />,
      title: 'Privacy Manifest',
      heading: 'Privacy & Data Governance',
      description: 'At La Tejcreations, your privacy is as sacred as our heritage craftsmanship. We collect only the essential data required to manifest your orders and provide professional support.',
      points: [
        { label: "Data Collection", text: "We collect identity information (name, email) and logistics details for delivery orchestration." },
        { label: "Payment Security", text: "All financial transactions are secured through Flutterwave. We do not store sensitive card data on our servers." },
        { label: "Third-Party Disclosure", text: "We only share logistics data with verified shipping partners to ensure your creations reach you safely." }
      ]
    },
    {
      id: 'shipping',
      icon: <Truck size={20} />,
      title: 'Shipping & Logistics',
      heading: 'Logistics & Global Delivery',
      description: 'We operate a robust global logistics manifest, ensuring our African heritage reaches you wherever you are.',
      grids: [
        { title: "Retail Delivery (Aṣọ̀ Lésẹ̀kẹ̀sẹ̀)", text: "Processed within 48 hours. Shipping timelines range from 3-7 business days globally." },
        { title: "Wholesale Manifest", text: "Bulk orders require 7-14 days for meticulous production and quality audit before dispatch." },
        { title: "Tracking Ritual", text: "Real-time tracking is provided for every order via your personal partner dashboard." }
      ]
    },
    {
      id: 'wholesale',
      icon: <ShoppingBag size={20} />,
      title: 'Wholesale Protocol',
      heading: 'Wholesale Partnership Terms',
      description: 'Our wholesale channel is a professional partnership registry designed for high-volume procurement.',
      points: [
        { label: "Minimum Order Quantity", text: "A strict MOQ of 20 units per product is enforced for wholesale pricing." },
        { label: "Partner Verification", "text": "We reserve the right to verify business credentials to maintain the exclusivity of our heritage collections." },
        { label: "Cancellations", "text": "Wholesale orders cannot be cancelled once the production manifest has been initialized." }
      ]
    },
    {
      id: 'legal',
      icon: <Scale size={20} />,
      title: 'Legal Standard',
      heading: 'Terms of Service',
      description: 'By utilizing the La Tejcreations platform, you agree to our heritage standards and legal protocols.',
      points: [
        { label: "Intellectual Property", text: "All heritage designs, patterns, and brand assets are the exclusive property of La Tejcreations." },
        { label: "Returns Policy", text: "Returns are only accepted for items with documented manufacturing defects within 7 days of delivery." },
        { label: "Dispute Resolution", text: "Any platform disputes will be governed by the laws of the Federal Republic of Nigeria." }
      ]
    }
  ]

  const sections = [
    { ...defaultSections[0], ...content.privacy },
    { ...defaultSections[1], ...content.shipping },
    { ...defaultSections[2], ...content.wholesale },
    { ...defaultSections[3], ...content.legal }
  ]

  // Hydrate custom dynamic sections
  const customSchemas = siteContent?.policies?.custom_schema_sections || []
  customSchemas.forEach(schemaDef => {
    const customData = content[schemaDef.id] || {}
    sections.push({
      id: schemaDef.id,
      icon: <Shield size={20} />, // Fallback icon for dynamic policies
      title: schemaDef.label, // Fallback if admin hasn't filled out nav title
      ...customData
    })
  })

  return (
    <div className="policies-page bg-light min-vh-100 py-10">
      <Container className='mt-5'>
        <motion.div {...fadeInUp} className="mb-10 text-center">
          <span className="tiny text-uppercase fw-bold tracking-widest text-primary mb-3 d-block">
            {content.header?.badge || 'Platform Governance'}
          </span>
          <h1 className="display-4 fw-bold text-main tracking-tighter">
            {content.header?.title || 'Legal & Policies'}
          </h1>
          <p className="lead text-main opacity-50">
            {content.header?.description || 'Our standards, your security, and the heritage promise.'}
          </p>
        </motion.div>

        <Tab.Container id="policy-tabs" defaultActiveKey="privacy">
          <Row className="g-5">
            <Col lg={4}>
              <motion.div
                {...fadeInUp}
                className="bg-white p-4 rounded-5 shadow-premium sticky-top"
                style={{ top: '120px' }}
              >
                <Nav variant="pills" className="flex-column gap-2">
                  {sections.map(section => (
                    <Nav.Item key={section.id}>
                      <Nav.Link
                        eventKey={section.id}
                        className="d-flex align-items-center justify-content-between p-4 rounded-4 border-0 transition-all text-main"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <span className="policy-icon">{section.icon}</span>
                          <span className="fw-bold tiny text-uppercase tracking-widest">{section.title}</span>
                        </div>
                        <ChevronRight size={16} className="opacity-25" />
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </motion.div>
            </Col>

            <Col lg={8}>
              <motion.div
                {...fadeInUp}
                className="bg-white p-5 rounded-5 shadow-premium min-vh-50"
              >
                <Tab.Content>
                  {sections.map(section => (
                    <Tab.Pane key={section.id} eventKey={section.id}>
                      <div className="policy-content animate-in text-main">
                        <h4 className="fw-bold mb-4">{section.heading}</h4>
                        <p className="opacity-75 leading-relaxed">
                          {section.description}
                        </p>

                        {section.points && (
                          <ul className="list-unstyled d-flex flex-column gap-3 mt-4">
                            {section.points.map((point, pIdx) => (
                              <li key={pIdx} className="d-flex gap-3">
                                <div className="text-primary">•</div>
                                <span><strong>{point.label}:</strong> {point.text}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {section.grids && (
                          <ul className="list-unstyled d-grid gap-4 mt-4">
                            {section.grids.map((grid, gIdx) => (
                              <div key={gIdx} className="bg-light p-4 rounded-4">
                                <h6 className="fw-bold mb-2">{grid.title}</h6>
                                <p className="small mb-0 opacity-75">{grid.text}</p>
                              </div>
                            ))}
                          </ul>
                        )}
                      </div>
                    </Tab.Pane>
                  ))}
                </Tab.Content>
              </motion.div>
            </Col>
          </Row>
        </Tab.Container>
      </Container>

      <style>
        {`
          .py-10 { padding-top: 6rem; padding-bottom: 6rem; }
          .mb-10 { margin-bottom: 5rem; }
          .shadow-premium { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1); }
          .min-vh-50 { min-height: 500px; }
          
          .nav-pills .nav-link.active {
            background-color: var(--lt-primary) !important;
            color: #fff !important;
            opacity: 1 !important;
          }
          
          .nav-pills .nav-link {
            background: transparent;
            color: var(--lt-earth-dark);
            opacity: 0.6;
            transition: all 0.3s ease;
          }

          .nav-pills .nav-link:hover {
            background: rgba(109, 62, 33, 0.05) !important;
            opacity: 1;
          }

          .nav-pills .nav-link.active .opacity-25 {
            opacity: 0.5 !important;
          }
          
          .policy-content.animate-in {
            animation: fadeInSlide 0.4s ease-out forwards;
          }
          
          @keyframes fadeInSlide {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  )
}

export default PoliciesPage
