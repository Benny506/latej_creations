import React, { useState, useMemo, useEffect } from 'react'
import { Container, Row, Col, Badge, Form, InputGroup, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/catalog/ProductCard'
import { fetchPreorderWindows } from '../../store/slices/preorderSlice'
import { Search, Filter, SlidersHorizontal, Package, ArrowRight, ShoppingBag } from 'lucide-react'
import { useAppUi } from '../../context/AppUiContext'
import ArtisanalIcon from '../../components/ui/ArtisanalIcon'

/**
 * RulesCarousel Component
 * A simple way to see our Retail shipping and quality rules.
 */
const RulesCarousel = ({ tips }) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!tips || tips.length === 0) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % tips.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [tips])

  if (!tips || tips.length === 0) return null

  const currentRule = tips[index]

  return (
    <div className="rules-carousel-container" style={{ minWidth: '350px' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRule.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="d-flex align-items-center gap-4 bg-white p-4 rounded-5 shadow-sm border border-light"
        >
          <div className="bg-primary-light p-3 rounded-4 text-primary shadow-sm">
            <ArtisanalIcon name={currentRule.icon} size={22} />
          </div>
          <div className="text-start">
            <p className="tiny fw-bold text-uppercase text-primary mb-1 tracking-widest" style={{ fontSize: '0.65rem' }}>
              {currentRule.title}
            </p>
            <p className="small text-main fw-bold opacity-75 mb-0 lh-sm" style={{ fontSize: '0.75rem' }}>
              {currentRule.description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/**
 * ShopPage Component
 * The main storefront for Retail items.
 */
const ShopPage = () => {
  const dispatch = useDispatch()
  const { products, catalogs } = useSelector(state => state.products)
  const { windows } = useSelector(state => state.preorder || { windows: [] })
  const { siteContent } = useAppUi()
  const retailTips = siteContent?.retail_tips?.sections?.main?.items || []

  useEffect(() => {
    dispatch(fetchPreorderWindows())
  }, [dispatch])

  const retailWindow = useMemo(() => {
    return windows.find(w => w.mode === 'retail') || null
  }, [windows])

  const [search, setSearch] = useState('')
  const [selectedCatalog, setSelectedCatalog] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (p.type !== 'retail') return false
      const primaryVariant = p.variants?.[0]
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchesCatalog = selectedCatalog ? p.catalog_id === selectedCatalog : true
      const matchesPrice = maxPrice ? (primaryVariant?.price <= parseFloat(maxPrice)) : true
      return search.length > 0 ? matchesSearch && matchesCatalog && matchesPrice : matchesCatalog && matchesPrice
    })
  }, [products, search, selectedCatalog, maxPrice])

  return (
    <div className="shop-page pt-5 pb-5">
      <Container className="py-5 my-5">

        {/* Top Wholesale Teaser Banner */}
        {/* <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-white p-3 rounded-4 mb-5 d-flex flex-wrap align-items-center justify-content-between shadow-sm"
        >
          <div className="d-flex align-items-center gap-3 ps-3 mb-lg-0 mb-md-2 mb-2">
            <Package size={18} className="opacity-75" />
            <span className="tiny fw-bold text-uppercase tracking-widest">Looking for Wholesale?</span>
            <span className="tiny opacity-75 d-none d-md-inline">— Access special prices for business orders.</span>
          </div>
          <Link to="/wholesale" className="btn btn-white text-white rounded-pill px-4 tiny fw-bold border-0 shadow-sm transition-all hover-scale-105">
            View Wholesale
          </Link>
        </motion.div> */}

        {/* Header Section */}
        <div className="mb-5">
          <div
            className="d-flex flex-wrap align-items-center justify-content-between gap-4 mb-5"
          >
            <div className="text-start">
              <Badge bg="primary" className="px-3 py-2 rounded-pill tiny text-uppercase fw-bold mb-3 shadow-sm border-0">
                Retail
              </Badge>
              <h1 className="fw-bold text-main mb-2" style={{ fontSize: 'calc(1.375rem + 1.5vw)', lineHeight: '1.2' }}>
                You are now shopping Aṣọ̀lé Sẹ̀kẹ̀sẹ̀ by Latéjcreations
              </h1>
              <p className="tiny text-uppercase fw-bold opacity-50 mb-0">Showing {filteredProducts.length} items</p>
            </div>

            <Row className='g-3 flex-wrap justify-content-between w-100'>
              <Col lg={retailWindow ? 6 : 8}>
                <RulesCarousel tips={retailTips} />
              </Col>

              {retailWindow && (
                <Col lg={6} className='d-flex align-items-center justify-content-lg-end justify-content-center'>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-4 mb-5 shadow-sm text-center border border-2 border-primary position-relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, rgba(var(--bs-primary-rgb), 0.05) 0%, rgba(var(--bs-primary-rgb), 0.15) 100%)' }}
                  >
                    {/* <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary opacity-10" style={{ pointerEvents: 'none' }}></div> */}
                    <h5 className="fw-bold text-main mb-2 tracking-widest text-uppercase d-flex align-items-center justify-content-center gap-2">
                      <span className="badge bg-primary text-light p-2">ACTIVE PRE-ORDER</span>
                    </h5>
                    <p className="mb-0 small fw-bold opacity-75">
                      Secure your PRE-ORDER pieces now! Window closes on: {new Date(retailWindow.end_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </motion.div>
                </Col>
              )}
            </Row>
          </div>

          <div className="bg-white p-4 rounded-5 shadow-premium border border-light">
            <Row className="g-4">
              <Col lg={4}><Form.Group><Form.Label className="tiny text-uppercase fw-bold opacity-50 d-flex align-items-center gap-2 mb-2"><Search size={14} /> Search</Form.Label><InputGroup className="bg-light rounded-4 overflow-hidden border-0"><Form.Control placeholder="Find something..." className="bg-transparent border-0 py-3 px-4 shadow-none" value={search} onChange={(e) => setSearch(e.target.value)} /></InputGroup></Form.Group></Col>
              <Col lg={4}><Form.Group><Form.Label className="tiny text-uppercase fw-bold opacity-50 d-flex align-items-center gap-2 mb-2"><Filter size={14} /> Category</Form.Label><Form.Select className="bg-light border-0 py-3 px-4 rounded-4 shadow-none" value={selectedCatalog} onChange={(e) => setSelectedCatalog(e.target.value)}><option value="">All Categories</option>{catalogs.filter(c => c.type === 'retail').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Form.Select></Form.Group></Col>
              <Col lg={4}><Form.Group><Form.Label className="tiny text-uppercase fw-bold opacity-50 d-flex align-items-center gap-2 mb-2"><SlidersHorizontal size={14} /> Max Price</Form.Label><InputGroup className="bg-light rounded-4 overflow-hidden border-0"><InputGroup.Text className="bg-transparent border-0 ps-4 pe-0 opacity-50 fw-bold">₦</InputGroup.Text><Form.Control type="number" placeholder="Highest price..." className="bg-transparent border-0 py-3 px-4 shadow-none" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} /></InputGroup></Form.Group></Col>
            </Row>
          </div>
        </div>

        {/* Product Grid */}
        <Row className="g-4 g-lg-5 mb-5 pb-5">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p, index) => (
              <Col key={p.id} md={6} lg={4}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <ProductCard product={p} />
                </motion.div>
              </Col>
            ))
          ) : (
            <Col xs={12} className="text-center py-5">
              <div className="opacity-25 py-5"><Package size={60} className="mb-3" /><h5 className="fw-bold">No items found</h5></div>
            </Col>
          )}
        </Row>

        {/* Large Wholesale Teaser */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-5 pt-5">
          <div className="bg-white rounded-5 p-5 shadow-premium text-start border border-light position-relative overflow-hidden">
            <Row className="align-items-center g-5 position-relative" style={{ zIndex: 2 }}>
              <Col lg={8}>
                <Badge bg="primary" className="px-3 py-2 rounded-pill tiny text-uppercase fw-bold mb-4 shadow-sm border-0">Wholesale</Badge>
                <h2 className="display-5 fw-bold text-dark mb-4">Want to buy in Wholesale?</h2>
                <p className="lead text-dark opacity-75 mb-0">We support businesses with high-quality handmade items in bulk. Access our wholesale pricing and professional fulfillment services today.</p>
              </Col>
              <Col lg={4} className="text-lg-end">
                <Button as={Link} to="/wholesale" variant="primary" className="rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-2 shadow-sm border-0">Explore Wholesale <ArrowRight size={20} /></Button>
              </Col>
            </Row>
          </div>
        </motion.div>
      </Container>
    </div>
  )
}

export default ShopPage
