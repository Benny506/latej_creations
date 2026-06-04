import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Row, Col, Badge, Button, Form, Modal } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import {
  ShoppingBag,
  ChevronLeft,
  Star,
  ShieldCheck,
  Truck,
  RefreshCcw,
  CheckCircle2,
  Minus,
  Plus,
  ExternalLink,
  ArrowRight,
  Ruler
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { addItemThunk, openCart } from '../../store/slices/cartSlice'
import { useAppUi } from '../../context/AppUiContext'
import supabase from '../../utils/supabase'

/**
 * ProductDetailsPage Component
 * Orchestrates the high-fidelity discovery manifestation for individual heritage items.
 * Features specialized variant discovery and procurement narratives.
 */
const ProductDetailsPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { setSubtleLoading, addAlert } = useAppUi()
  const { products, catalogs } = useSelector(state => state.products)
  const { isAuthenticated } = useSelector(state => state.auth)

  const product = products.find(p => p.id === id)
  const catalog = catalogs.find(c => c.id === product?.catalog_id)

  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)

  const [sizeChart, setSizeChart] = useState(null)
  const [showSizeChart, setShowSizeChart] = useState(false)

  useEffect(() => {
    if (product && product.variants?.length > 0) {
      setSelectedVariant(product.variants[0])
    }

    console.log(product?.size_chart_id)

    if (product?.size_chart_id) {
      const fetchSizeChart = async () => {
        const { data, error } = await supabase.from('latej_size_charts').select('*').eq('id', product.size_chart_id).single()
        if (data) setSizeChart(data)
      }
      fetchSizeChart()
    }
  }, [product])

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h2 className="fw-bold">Heritage item not found</h2>
        <Link to="/shop" className="btn btn-primary rounded-pill px-4 py-2 mt-3">Back to Collection</Link>
      </Container>
    )
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) return

    if (isAuthenticated) {
      setSubtleLoading(true, `Adding ${product.name} to your heritage collection...`)
    }

    try {
      await dispatch(addItemThunk({
        product,
        variant: selectedVariant,
        quantity
      })).unwrap()

      addAlert(`${product.name} added to cart`, 'success')
      dispatch(openCart())
    } catch (err) {
      console.error('Procurement Error:', err.message)
      addAlert('Could not add to cart. Please try again.', 'error')
    } finally {
      if (isAuthenticated) {
        setSubtleLoading(false)
      }
    }
  }

  const isRetail = product.type === 'retail'
  const isWholesale = product.type === 'wholesale'

  const displayPrice = selectedVariant?.price || product.variants?.[0]?.price

  const displayImage = selectedVariant?.images?.[0] || product.variants?.[0]?.images?.[0] || '/placeholder-product.jpg'

  return (
    <div className="product-details-page pt-5 mt-5">
      <Container className="py-4">
        {/* Navigation Registry */}
        <Link to="/shop" className="text-decoration-none text-main opacity-50 hover-opacity-100 d-flex align-items-center gap-2 mb-5 transition-all">
          <ChevronLeft size={18} />
          <span className="tiny text-uppercase fw-bold tracking-widest">Back to Collection</span>
        </Link>

        <Row className="g-5">
          {/* Visual Manifestation Section */}
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="position-sticky top-0"
              style={{ top: '100px' }}
            >
              <div className="rounded-5 overflow-hidden shadow-premium bg-white p-3">
                <img
                  src={displayImage}
                  alt={product.name}
                  className="w-100 h-100 object-fit-cover rounded-4"
                  style={{ minHeight: '500px', maxHeight: '700px' }}
                />
              </div>
            </motion.div>
          </Col>

          {/* Discovery Manifestation Section */}
          <Col lg={6}>
            <div className="d-flex flex-column gap-4">
              <div>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Badge bg="primary-light" className="text-primary rounded-pill px-3 py-2 tiny text-uppercase tracking-widest">
                    {catalog?.name || 'Heritage Collection'}
                  </Badge>
                  <Badge bg="dark" className="text-white rounded-pill px-3 py-2 tiny text-uppercase tracking-widest">
                    {product.type}
                  </Badge>
                </div>
                <h1 className="display-5 fw-bold text-main mb-3">{product.name}</h1>
                <h2 className="fw-bold text-primary mb-3">₦{displayPrice?.toLocaleString() || '0'}</h2>
                <p className="lead text-dark opacity-50 mb-0 leading-relaxed">
                  {product.description || 'A timeless manifestation of African craftsmanship, meticulously designed for the modern connoisseur.'}
                </p>
              </div>

              <hr className="opacity-10" />

              {/* Variant Discovery Registry */}
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="tiny text-uppercase fw-bold opacity-50 tracking-widest mb-0">Select Variant</h6>
                  {sizeChart && (
                    <Button
                      variant="link"
                      className="p-0 text-primary d-flex align-items-center gap-1 tiny fw-bold text-decoration-none hover-opacity-75 transition-all"
                      onClick={() => setShowSizeChart(true)}
                    >
                      <Ruler size={14} /> Size Guide
                    </Button>
                  )}
                </div>
                <div className="d-flex flex-wrap align-items-start gap-3">
                  {product.variants?.map(v => {
                    const isActive = selectedVariant?.id === v.id
                    return (
                      <motion.div
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        whileHover={{ y: isActive ? 0 : -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`position-relative variant-card p-3 rounded-4 border-2 transition-all cursor-pointer d-flex flex-column gap-1 ${isActive
                          ? 'border-primary shadow-premium bg-white'
                          : 'border-light bg-light opacity-75 hover-opacity-100'
                          }`}
                        style={{ minWidth: '130px', zIndex: isActive ? 2 : 1 }}
                      >
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="position-absolute top-0 end-0 translate-middle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                            style={{ width: '22px', height: '22px' }}
                          >
                            <CheckCircle2 size={12} strokeWidth={4} />
                          </motion.div>
                        )}
                        {v.is_preorder && (
                          <Badge bg="primary" className="text-white tiny text-uppercase tracking-widest align-self-start mb-2" style={{ fontSize: '0.55rem', padding: '0.3rem 0.5rem' }}>
                            Pre-order
                          </Badge>
                        )}
                        {v.options && Object.keys(v.options).length > 0 ? (
                          <div className="d-flex flex-column gap-1 mb-1">
                            {Object.entries(v.options).map(([key, value]) => (
                              <div key={key} className="d-flex align-items-center gap-2">
                                <span className="tiny opacity-50 text-uppercase" style={{ fontSize: '0.65rem' }}>{key}:</span>
                                <span className="fw-bold text-main small">{value}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="fw-bold text-main">Standard</span>
                        )}
                        <span className="tiny fw-bold text-primary">₦{Number(v.price).toLocaleString()}</span>

                        {/* Stock Visibility Manifestation */}
                        {/* {isRetail && ( */}
                        <div className="mt-2 pt-2 border-top border-dark border-opacity-50">
                          {v.stock > 0 ? (
                            <div className="d-flex align-items-center gap-1">
                              <CheckCircle2 size={10} className={v.stock < 5 ? 'text-warning' : 'text-success'} />
                              <span className={`tiny fw-bold ${v.stock < 5 ? 'text-warning' : 'text-success'}`} style={{ fontSize: '0.6rem' }}>
                                {v.stock < 5 ? `Low Stock: ${v.stock}` : `${v.stock} Available`}
                              </span>
                            </div>
                          ) : (
                            <span className="tiny fw-bold text-danger" style={{ fontSize: '0.6rem' }}>Out of Stock</span>
                          )}
                        </div>
                        {/* )} */}
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* External Product Media Link */}
              {selectedVariant?.external_product_link && (
                <div className="bg-white border border-primary p-4 rounded-5 mt-4 d-flex align-items-center justify-content-between position-relative overflow-hidden shadow-sm">
                  <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(45deg, rgba(var(--bs-primary-rgb), 0.05), transparent)' }} />
                  <div className="position-relative z-1 pe-4">
                    <h6 className="fw-bold text-main mb-1 d-flex align-items-center gap-2">
                      <ExternalLink size={16} className="text-primary" /> Deeper Look
                    </h6>
                    <p className="tiny opacity-75 mb-0 leading-relaxed" style={{ fontSize: '0.65rem' }}>
                      Discover more images, potential videos, and post-content styling for this exact variant!
                    </p>
                  </div>
                  <a
                    href={selectedVariant.external_product_link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary rounded-circle p-3 d-flex align-items-center justify-content-center shadow-sm position-relative z-1 flex-shrink-0"
                  >
                    <ArrowRight size={18} />
                  </a>
                </div>
              )}

              {/* Procurement Action Registry */}
              <div className="bg-light p-4 rounded-5 mt-4">
                <Row className="align-items-center g-3">
                  <Col sm={4}>
                    <div className="d-flex align-items-center justify-content-between bg-white rounded-pill p-2 shadow-sm">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="btn btn-link text-main p-1 border-0 shadow-none"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="fw-bold px-3">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="btn btn-link text-main p-1 border-0 shadow-none"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </Col>
                  <Col sm={8}>
                    <Button
                      onClick={handleAddToCart}
                      disabled={!selectedVariant || (isRetail && selectedVariant.stock === 0)}
                      variant="primary"
                      className="w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-premium border-0"
                    >
                      <ShoppingBag size={20} /> Add to Cart
                    </Button>
                  </Col>
                </Row>
              </div>

              {/* Trust & Heritage Manifestation */}
              <Row className="g-4 mt-2">
                {[
                  { icon: ShieldCheck, title: 'Quality Guaranteed', desc: 'Handcrafted with precision' },
                  { icon: Truck, title: 'Safe Delivery', desc: 'Secure institutional shipping' },
                  { icon: RefreshCcw, title: 'Easy Returns', desc: 'Within 7 heritage days' }
                ].map((item, i) => (
                  <Col key={i} md={4}>
                    <div className="d-flex flex-column align-items-center text-center">
                      <div className="bg-white p-3 rounded-circle shadow-sm mb-3 text-primary">
                        <item.icon size={24} />
                      </div>
                      <h6 className="tiny text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>{item.title}</h6>
                      <p className="tiny opacity-50 mb-0" style={{ fontSize: '0.6rem' }}>{item.desc}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Size Chart Modal Manifestation */}
      {sizeChart && (
        <Modal
          show={showSizeChart}
          onHide={() => setShowSizeChart(false)}
          centered
          size="lg"
          contentClassName="border-0 shadow-premium"
          style={{ borderRadius: '40px' }}
        >
          <Modal.Header closeButton className="border-0 p-5 pb-0">
            <Modal.Title className="fw-bold text-main d-flex align-items-center gap-3">
              <div className="bg-primary-light p-3 rounded-4 text-primary shadow-sm">
                <Ruler size={24} />
              </div>
              {sizeChart.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-5 pt-4">
            {sizeChart.description && (
              <p className="text-main opacity-75 leading-relaxed mb-4">
                {sizeChart.description}
              </p>
            )}
            <div className="bg-light p-2 rounded-5 overflow-hidden">
              <img
                src={sizeChart.image_url}
                alt={sizeChart.title}
                className="w-100 rounded-4"
                style={{ objectFit: 'contain', maxHeight: '600px' }}
              />
            </div>
          </Modal.Body>
        </Modal>
      )}

      <style>
        {`
          .variant-card {
            cursor: pointer;
            width: fit-content;
          }
          .bg-primary-light {
            background: rgba(109, 62, 33, 0.05);
          }
          .hover-scale-105:hover {
            transform: scale(1.05);
          }
        `}
      </style>
    </div>
  )
}

export default ProductDetailsPage
