import { useAppUi } from '../../context/AppUiContext'
import { Container, Row, Col, Badge, Button, Card } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  Package, 
  Truck, 
  ShieldCheck, 
  Check,
  Heart,
  Award
} from 'lucide-react'

/**
 * AboutAsoLesekesePage Component
 * The story of our Retail and Wholesale mission.
 */
const AboutAsoLesekesePage = () => {
  const { siteContent } = useAppUi()
  const content = siteContent?.about_aso_lesekese?.sections || {}

  const defaultRetailFeatures = [
    "Ready-to-wear items",
    "Easy Retail shopping",
    "Home delivery services"
  ]

  const defaultWholesaleFeatures = [
    { title: "Bulk Pricing", text: "Professional rates for business-sized orders." },
    { title: "Wholesale Logistics", text: "Secure and efficient bulk shipping options." }
  ]

  const defaultPromiseItems = [
    { icon: 'Sparkles', title: "Best Quality", text: "Everything is handmade with the best materials." },
    { icon: 'ShieldCheck', title: "Safe Shipping", text: "We make sure your items arrive in perfect shape." },
    { icon: 'Check', title: "Trusted Service", text: "Whether Retail or Wholesale, we are here for you." }
  ]

  const retailFeatures = content.retail?.features || defaultRetailFeatures
  const wholesaleFeatures = content.wholesale?.features || defaultWholesaleFeatures
  
  const renderIcon = (iconName) => {
    const IconMap = {
      Sparkles,
      ShieldCheck,
      Check,
      Package,
      Truck,
      Heart,
      Award
    }
    const IconComponent = IconMap[iconName] || Sparkles
    return <IconComponent />
  }

  const promiseItems = content.promise?.items || defaultPromiseItems

  return (
    <div className="about-page pt-5 pb-5 mt-5">
      <Container className="py-5">
        
        {/* Hero Section */}
        <div className="text-center mb-5 pb-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <Badge bg="primary" className="px-3 py-2 rounded-pill tiny text-uppercase fw-bold mb-4 shadow-sm border-0">
               {content.hero?.badge || 'Our Mission'}
             </Badge>
             <h1 className="display-3 fw-bold text-main mb-4">{content.hero?.title || 'Aṣọ̀ Lésẹ̀kẹ̀sẹ̀'}</h1>
             <p className="lead text-dark opacity-75 mx-auto" style={{ maxWidth: '700px' }}>
               {content.hero?.description || "We provide beautiful, handmade fashion and accessories. Whether you're shopping for yourself or your business, we've got you covered."}
             </p>
          </motion.div>
        </div>

        {/* Retail Section */}
        <div className="bg-white rounded-5 p-5 shadow-premium mb-5 border border-light text-start overflow-hidden">
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <Badge bg="success" className="px-3 py-2 rounded-pill tiny text-uppercase fw-bold mb-4 shadow-sm border-0">
                {content.retail?.badge || 'Retail Line'}
              </Badge>
              <h2 className="display-5 fw-bold text-dark mb-4">{content.retail?.title || 'Our Retail Collection'}</h2>
              <p className="text-dark opacity-75 mb-5 lead" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                {content.retail?.description || 'Our Retail collection is designed for individuals who appreciate fine craftsmanship. Each item is unique and ready to become a part of your style.'}
              </p>
              <div className="d-flex flex-column gap-3 mb-5">
                {retailFeatures.map((feature, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-3">
                    <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }} />
                    <span className="fw-bold text-dark opacity-75">{feature}</span>
                  </div>
                ))}
              </div>
              <Button as={Link} to="/shop" variant="primary" className="rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-2 shadow-sm border-0">Shop Retail <ShoppingBag size={20} /></Button>
            </Col>
            <Col lg={6}>
              <div className="rounded-5 overflow-hidden shadow-lg bg-ivory" style={{ aspectRatio: '1/1' }}>
                <img 
                  src={content.retail?.image || "https://images.unsplash.com/photo-1591085686350-798c0f992383?auto=format&fit=crop&q=80&w=1000"} 
                  className="w-100 h-100 object-fit-cover" 
                  alt="Retail Fashion" 
                />
              </div>
            </Col>
          </Row>
        </div>

        {/* Wholesale Section */}
        <div className="bg-ivory rounded-5 p-5 shadow-premium border border-light text-start overflow-hidden">
          <Row className="align-items-center g-5 flex-lg-row-reverse">
            <Col lg={6}>
              <Badge bg="primary" className="px-3 py-2 rounded-pill tiny text-uppercase fw-bold mb-4 shadow-sm border-0">
                {content.wholesale?.badge || 'Wholesale Services'}
              </Badge>
              <h2 className="display-5 fw-bold text-dark mb-4">{content.wholesale?.title || 'Wholesale Partnerships'}</h2>
              <p className="text-dark opacity-75 mb-5 lead" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                {content.wholesale?.description || 'We partner with businesses to provide high-quality items at Wholesale rates. Scale your business with our reliable fulfillment and bulk pricing.'}
              </p>
              <div className="d-flex flex-column gap-5 mb-5">
                {wholesaleFeatures.map((feature, idx) => (
                  <div key={idx} className="d-flex align-items-start gap-4">
                    <div className="bg-white p-3 rounded-4 shadow-sm text-primary border border-light">
                      {idx === 0 ? <Package size={24} /> : <Truck size={24} />}
                    </div>
                    <div>
                      <p className="tiny text-uppercase fw-bold text-primary mb-1">{feature.title}</p>
                      <p className="small text-dark fw-bold opacity-75 mb-0">{feature.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button as={Link} to="/wholesale" variant="primary" className="rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-2 shadow-sm border-0">Wholesale Options <ArrowRight size={20} /></Button>
            </Col>
            <Col lg={6}>
              <div className="rounded-5 overflow-hidden shadow-lg bg-white" style={{ aspectRatio: '1/1' }}>
                <img 
                  src={content.wholesale?.image || "https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=1000"} 
                  className="w-100 h-100 object-fit-cover" 
                  alt="Wholesale Orders" 
                />
              </div>
            </Col>
          </Row>
        </div>

        {/* Brand Promise Section */}
        <div className="mt-5 pt-5 text-center">
           <Badge bg="light" className="text-primary px-3 py-2 rounded-pill tiny text-uppercase fw-bold mb-4 border border-light">
             {content.promise?.badge || 'Our Promise'}
           </Badge>
           <h2 className="fw-bold text-main mb-5">{content.promise?.title || 'Why shop with us?'}</h2>
           <Row className="g-4">
             {promiseItems.map((item, idx) => (
               <Col key={idx} md={4}>
                 <Card className="border-0 bg-white p-4 rounded-5 shadow-sm h-100">
                   <div className="bg-primary-light p-3 rounded-4 text-primary w-fit mx-auto mb-4">{renderIcon(item.icon)}</div>
                   <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
                   <p className="small text-dark opacity-75 mb-0">{item.text}</p>
                 </Card>
               </Col>
             ))}
           </Row>
        </div>

      </Container>
    </div>
  )
}
export default AboutAsoLesekesePage
