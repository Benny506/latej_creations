import React, { useState, useMemo, useEffect } from 'react'
import { Container, Row, Col, Badge, Form, InputGroup } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '../../components/catalog/ProductCard'
import { fetchPreorderWindows } from '../../store/slices/preorderSlice'
import { Search, Filter, SlidersHorizontal, Package } from 'lucide-react'
import { useAppUi } from '../../context/AppUiContext'
import ArtisanalIcon from '../../components/ui/ArtisanalIcon'

/**
 * RulesCarousel Component
 * Displays wholesale rules in a subtle, fade-in-fade-out cycle.
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
 * WholesalePage Component
 * A professional page for bulk ordering.
 */
const WholesalePage = () => {
  const dispatch = useDispatch()
  const { products, catalogs } = useSelector(state => state.products)
  const { windows } = useSelector(state => state.preorder || { windows: [] })
  const { siteContent } = useAppUi()
  const wholesaleTips = siteContent?.wholesale_tips?.sections?.main?.items || []

  useEffect(() => {
    dispatch(fetchPreorderWindows())
  }, [dispatch])

  const wholesaleWindow = useMemo(() => {
    return windows.find(w => w.mode === 'wholesale') || null
  }, [windows])
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [selectedCatalog, setSelectedCatalog] = useState(searchParams.get('category') || '')
  const [maxPrice, setMaxPrice] = useState('')

  // Sync state with URL params when navigating via navbar
  useEffect(() => {
    const category = searchParams.get('category')
    if (category !== null) {
      setSelectedCatalog(category)
    } else {
      setSelectedCatalog('')
    }
  }, [searchParams])

  // Update URL when dropdown changes
  const handleCatalogChange = (e) => {
    const val = e.target.value
    setSelectedCatalog(val)
    if (val) {
      searchParams.set('category', val)
    } else {
      searchParams.delete('category')
    }
    setSearchParams(searchParams)
  }

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (p.type !== 'wholesale') return false
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchesCatalog = selectedCatalog ? p.catalog_id === selectedCatalog : true
      const matchesPrice = maxPrice ? (p.variants?.[0]?.price <= parseFloat(maxPrice)) : true
      return matchesSearch && matchesCatalog && matchesPrice
    })
  }, [products, catalogs, search, selectedCatalog, maxPrice])

  return (
    <div className="wholesale-page pt-5 pb-5">
      <Container className="py-5 my-5">
        <div className="mb-5">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-4 mb-5">
            <div className="text-start">
              <Badge bg="primary" className="px-3 py-2 rounded-pill tiny text-uppercase fw-bold mb-3 shadow-sm">
                Bulk Orders
              </Badge>
              {/* Responsive Header: Prevents overflow on smaller screens */}
              <h1 className="fw-bold text-main mb-2" style={{ fontSize: 'calc(1.375rem + 1.5vw)', lineHeight: '1.2' }}>
                Wholesale List
              </h1>
              <p className="tiny text-uppercase fw-bold opacity-50 mb-0">Showing {filteredProducts.length} items</p>
            </div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="">
              <RulesCarousel tips={wholesaleTips} />
            </motion.div>
          </div>

          {wholesaleWindow && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-4 mb-5 shadow-sm text-center border border-2 border-primary position-relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(var(--bs-primary-rgb), 0.05) 0%, rgba(var(--bs-primary-rgb), 0.15) 100%)' }}
            >
              <h5 className="fw-bold text-main mb-2 tracking-widest text-uppercase d-flex align-items-center justify-content-center gap-2">
                <span className="badge bg-primary text-white p-2">ACTIVE WHOLESALE PRE-ORDER</span>
              </h5>
              <p className="mb-0 small fw-bold opacity-75">
                Window is open for bulk pre-orders! Closes on: {new Date(wholesaleWindow.end_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </motion.div>
          )}

          <div className="bg-white p-4 rounded-5 shadow-premium border border-light">
            <Row className="g-4">
              <Col lg={4}>
                <Form.Group>
                  <Form.Label className="tiny text-uppercase fw-bold opacity-50 d-flex align-items-center gap-2 mb-2"><Search size={14} /> Search Products</Form.Label>
                  <InputGroup className="bg-light rounded-4 overflow-hidden border-0">
                    <Form.Control placeholder="Search..." className="bg-transparent border-0 py-3 px-4 shadow-none" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col lg={4}>
                <Form.Group>
                  <Form.Label className="tiny text-uppercase fw-bold opacity-50 d-flex align-items-center gap-2 mb-2"><Filter size={14} /> Shop by Category</Form.Label>
                  <Form.Select className="bg-light border-0 py-3 px-4 rounded-4 shadow-none" value={selectedCatalog} onChange={handleCatalogChange}>
                    <option value="">All Categories</option>
                    {catalogs.filter(c => c.type === 'wholesale').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={4}>
                <Form.Group>
                  <Form.Label className="tiny text-uppercase fw-bold opacity-50 d-flex align-items-center gap-2 mb-2"><SlidersHorizontal size={14} /> Max Price</Form.Label>
                  <InputGroup className="bg-light rounded-4 overflow-hidden border-0">
                    <InputGroup.Text className="bg-transparent border-0 ps-4 pe-0 opacity-50 fw-bold">₦</InputGroup.Text>
                    <Form.Control type="number" placeholder="Price..." className="bg-transparent border-0 py-3 px-4 shadow-none" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </div>

        <Row className="g-4 g-lg-5">
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
              <div className="opacity-25 py-5">
                <Package size={60} className="mb-3" />
                <h5 className="fw-bold">No products found</h5>
                <p className="tiny text-uppercase fw-bold">Try adjusting your filters</p>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  )
}

export default WholesalePage
