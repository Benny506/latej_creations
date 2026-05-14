import { useAppUi } from '../../context/AppUiContext'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { motion } from 'framer-motion'
import {
  Target,
  Eye,
  Heart,
  Award,
  ShieldCheck,
  Zap,
  Gem,
  Feather,
  Globe,
  Crown,
  Users
} from 'lucide-react'

const AboutPage = () => {
  const { siteContent } = useAppUi()
  const content = siteContent?.about?.sections || {}

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: 'easeOut' }
  }

  const defaultCoreValues = [
    {
      id: 'integrity',
      icon: 'Heart',
      title: 'Artisanal Integrity',
      desc: 'We preserve the soul of African craftsmanship, ensuring every stitch tells a story of heritage and dedication.'
    },
    {
      id: 'quality',
      icon: 'Award',
      title: 'Premium Quality',
      desc: 'Luxury is not just a label; it is our standard. We source only the finest materials for our creations.'
    },
    {
      id: 'ethical',
      icon: 'ShieldCheck',
      title: 'Ethical Sourcing',
      desc: 'Our procurement engine is built on transparency, supporting local artisans and sustainable practices.'
    },
    {
      id: 'innovation',
      icon: 'Zap',
      title: 'Modern Innovation',
      desc: 'While we respect the past, we leverage modern technology to streamline procurement and delivery globally.'
    }
  ]

  const coreValues = content.core_values?.items || defaultCoreValues

  // Icon mapper for dynamic items with robust fallback
  const renderIcon = (iconName) => {
    const IconMap = {
      Heart,
      Award,
      ShieldCheck,
      Zap,
      Gem,
      Feather,
      Globe,
      Crown,
      Users
    }
    const IconComponent = IconMap[iconName] || Heart
    return <IconComponent className="text-primary" size={32} />
  }

  return (
    <div className="about-page bg-white">
      {/* Hero Manifestation */}
      <section className="position-relative overflow-hidden py-10 bg-main text-white" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100">
          <img
            src={content.hero?.image || "/assets/information/about-hero.png"}
            alt="Luxury Workshop"
            className="w-100 h-100 object-fit-cover opacity-20"
          />
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(11, 11, 13, 0.9), rgba(11, 11, 13, 0.6))' }}></div>
        </div>
        <Container className="position-relative" style={{ zIndex: 1 }}>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <motion.div {...fadeInUp}>
                <span className="tiny text-uppercase fw-bold tracking-widest opacity-75 mb-3 d-block text-light">
                  {content.hero?.badge || 'The House of Heritage'}
                </span>
                <h1 className="display-3 fw-bold mb-4 tracking-tighter text-light">
                  {content.hero?.title ? (
                    <>
                      {content.hero.title.split(content.hero.title_accent || '')[0]}
                      <span className="text-primary">{content.hero.title_accent || ''}</span>
                      {content.hero.title.split(content.hero.title_accent || '')[1]}
                    </>
                  ) : (
                    <>Weave the Future of <br /><span className="text-primary">African Luxury</span></>
                  )}
                </h1>
                <p className="lead opacity-75 mb-0 leading-relaxed text-light">
                  {content.hero?.description || 'La Tejcreations is more than a fashion house; we are the guardians of a legacy, connecting the world to the unmatched craftsmanship of African textile artistry.'}
                </p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Vision Discovery */}
      <section className="py-10">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <motion.div {...fadeInUp} className="pe-lg-5">
                <div className="mb-5">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-primary-light p-3 rounded-circle">
                      <Target className="text-primary" size={24} />
                    </div>
                    <h2 className="fw-bold mb-0 text-main">{content.mission_vision?.mission_title || 'Our Mission'}</h2>
                  </div>
                  <p className="text-main opacity-75 fs-5 leading-relaxed">
                    {content.mission_vision?.mission_description || 'To democratize access to premium African heritage fashion by bridging the gap between master artisans and the global market through a robust, transparent procurement ecosystem.'}
                  </p>
                </div>

                <div>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-primary-light p-3 rounded-circle">
                      <Eye className="text-primary" size={24} />
                    </div>
                    <h2 className="fw-bold mb-0 text-main">{content.mission_vision?.vision_title || 'Our Vision'}</h2>
                  </div>
                  <p className="text-main opacity-75 fs-5 leading-relaxed">
                    {content.mission_vision?.vision_description || 'To become the global gold standard for African luxury procurement, recognized for our unwavering commitment to artisanal integrity and modern delivery excellence.'}
                  </p>
                </div>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                {...fadeInUp}
                className="rounded-5 overflow-hidden shadow-premium"
                style={{ height: '600px' }}
              >
                <img
                  src={content.mission_vision?.image || "/assets/information/mission.png"}
                  alt="Vision of Future"
                  className="w-100 h-100 object-fit-cover"
                />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Core Values Registry */}
      <section className="py-10 bg-light">
        <Container>
          <div className="text-center mb-5 pb-3">
            <h2 className="fw-bold text-main display-5">{content.core_values?.title || 'Our Pillars of Excellence'}</h2>
            <p className="text-main opacity-50 tiny text-uppercase fw-bold tracking-widest mt-2">
              {content.core_values?.subtitle || 'The foundation of every La Tej creation'}
            </p>
          </div>
          <Row className="g-4">
            {coreValues.map((val, idx) => (
              <Col md={6} lg={3} key={idx}>
                <motion.div
                  {...fadeInUp}
                  transition={{ delay: idx * 0.1 }}
                  className="h-100"
                >
                  <Card className="border-0 rounded-5 p-4 shadow-sm h-100 hover-translate-y transition-all">
                    <Card.Body className="p-0">
                      <div className="mb-4">{renderIcon(val.icon)}</div>
                      <h4 className="fw-bold text-main mb-3">{val.title}</h4>
                      <p className="text-main opacity-75 mb-0 small leading-relaxed">{val.desc}</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Business Model Manifestation */}
      <section className="py-10 overflow-hidden">
        <Container>
          <Row className="g-5">
            <Col lg={6}>
              <motion.div
                {...fadeInUp}
                className="bg-main text-white p-5 rounded-5 shadow-premium h-100"
              >
                <span className="tiny text-uppercase fw-bold tracking-widest opacity-50 mb-3 d-block text-primary">
                  {content.business_model?.wholesale?.badge || 'Enterprise Solutions'}
                </span>
                <h2 className="display-6 fw-bold mb-4">{content.business_model?.wholesale?.title || 'Wholesale Procurement'}</h2>
                <p className="opacity-75 fs-5 mb-5 leading-relaxed">
                  {content.business_model?.wholesale?.description || 'For our global partners and boutiques, we offer a dedicated wholesale channel. This line is designed for high-volume procurement, allowing businesses to scale with authentic African craftsmanship.'}
                </p>
                <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                  {(content.business_model?.wholesale?.features || [
                    "Minimum Order Quantity of 20 units per collection",
                    "Exclusive Bulk Pricing Models",
                    "Direct Artisan Collaboration"
                  ]).map((feature, fIdx) => (
                    <li key={fIdx} className="d-flex align-items-center gap-3">
                      <div className="bg-white/10 p-2 rounded-circle"><ShieldCheck size={18} className='text-primary' /></div>
                      <span className='text-primary'>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                {...fadeInUp}
                className="bg-primary text-white p-5 rounded-5 shadow-premium h-100"
              >
                <span className="tiny text-uppercase fw-bold tracking-widest opacity-50 mb-3 d-block">
                  {content.business_model?.retail?.badge || 'Individual Elegance'}
                </span>
                <h2 className="display-6 fw-bold mb-4">{content.business_model?.retail?.title || 'Aṣọ̀ Lésẹ̀kẹ̀sẹ̀ Retail'}</h2>
                <p className="opacity-75 fs-5 mb-5 leading-relaxed text-light">
                  {content.business_model?.retail?.description || 'Our retail line, Aṣọ̀ Lésẹ̀kẹ̀sẹ̀ (Ready-to-Wear), is curated for the individual who seeks heritage fashion for everyday elegance. Experience the pinnacle of handcrafted fashion without the wait.'}
                </p>
                <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                  {(content.business_model?.retail?.features || [
                    "Instant Stock Availability",
                    "Premium Individual Packaging",
                    "Global Individual Shipping"
                  ]).map((feature, fIdx) => (
                    <li key={fIdx} className="d-flex align-items-center gap-3">
                      <div className="bg-white/10 p-2 rounded-circle"><ShieldCheck size={18} /></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      <style>
        {`
          .bg-primary-light { background: rgba(109, 62, 33, 0.05); }
          .hover-translate-y:hover { transform: translateY(-10px); }
          .py-10 { padding-top: 6rem; padding-bottom: 6rem; }
          .shadow-premium { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); }
        `}
      </style>
    </div>
  )
}

export default AboutPage
