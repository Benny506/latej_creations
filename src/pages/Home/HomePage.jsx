import { useAppUi } from '../../context/AppUiContext'
import Hero from './components/Hero'
import BulkProduction from './components/BulkProduction'
import RetailShowcase from './components/RetailShowcase'
import ShopByCatalog from './components/ShopByCatalog'
import PreorderRules from './components/PreorderRules'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

/**
 * HomePage Component
 * Orchestrates the high-fidelity narrative flow for La Tejcreations.
 * Assembles the Hero, Wholesale Production, and Retail Showcase manifests.
 */
const HomePage = () => {
  const { siteContent } = useAppUi()
  const homeContent = siteContent?.home?.sections || {}

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="homepage-manifest"
    >
      {/* Hero Section: Brand Identity & Identity Pivot */}
      <Hero content={homeContent.hero} />

      {/* Bulk Production: B2B Infrastructure & Consultation */}
      {/* <BulkProduction content={homeContent.bulk_production} /> */}

      {/* Shop By Catalog: Dynamic Catalog List */}
      <ShopByCatalog />

      {/* Retail Showcase: B2C Lifestyle & Product Line */}
      <RetailShowcase content={homeContent.retail_showcase} />

      {/* Preorder Rules: Guidelines & Active Windows */}
      <PreorderRules />

      {/* Brand Message Section */}
      <section className="py-5" style={{ background: 'var(--lt-earth-dark)', color: '#fff' }}>
        <div className="container py-4 text-center">
          <p
            className="mb-0 px-lg-5 lead text-light"
            style={{ fontStyle: 'italic', fontFamily: 'var(--lt-font-body)' }}
          >
            {homeContent.footer_message?.text || `"Latéjcreations is a wholesale company, while Aṣọ̀ Lésẹ̀kẹ̀sẹ̀ is our signature fashion product line available for retail customers."`}
          </p>
        </div>
      </section>
    </motion.div>
  )
}

export default HomePage
