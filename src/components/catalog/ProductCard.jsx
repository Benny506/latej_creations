import React from 'react'
import { Card, Badge, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ShoppingBag, Star, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { addItemThunk, openCart } from '../../store/slices/cartSlice'
import { useAppUi } from '../../context/AppUiContext'

/**
 * ProductCard Component
 * Orchestrates the high-fidelity discovery manifestation for heritage items.
 * Features specialized procurement triggers and visual excellence.
 */
const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const { setSubtleLoading, addAlert } = useAppUi()
  const { isAuthenticated } = useSelector(state => state.auth)
  const { catalogs } = useSelector(state => state.products)

  // Institutional Pricing Discovery
  const catalog = catalogs.find(c => c.id === product.catalog_id)
  const isWholesale = product.type === 'wholesale'

  const displayPrice = isWholesale
    ? catalog?.wholesale_price
    : product.variants?.[0]?.price

  const displayImage = product.variants?.[0]?.images?.[0] || '/placeholder-product.jpg'

  const handleQuickAdd = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Automatically pick the first variant directly for quick procurement
    const defaultVariant = product.variants?.[0]
    if (!defaultVariant) return

    if (isAuthenticated) {
      setSubtleLoading(true, `Adding ${product.name} to your collection...`)
    }

    try {
      await dispatch(addItemThunk({
        product,
        variant: defaultVariant,
        quantity: 1
      })).unwrap()

      addAlert(`${product.name} added to cart`, 'success')
      dispatch(openCart())
    } catch (err) {
      console.error('Quick Add Error:', err.message)
      addAlert('Could not add to cart', 'error')
    } finally {
      if (isAuthenticated) {
        setSubtleLoading(false)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="h-100"
    >
      <Card className="product-card border-0 rounded-5 shadow-sm h-100 overflow-hidden transition-all bg-white p-3">
        {/* Visual Manifestation Layer */}
        <div className="position-relative overflow-hidden rounded-4 mb-3 group" style={{ height: '280px' }}>
          <Link to={`/product/${product.id}`} className="d-block h-100">
            <img
              src={displayImage}
              alt={product.name}
              className="w-100 h-100 object-fit-cover transition-all hover-scale-110"
            />
          </Link>

          <Badge
            bg="white"
            className="position-absolute top-0 end-0 m-3 text-primary shadow-sm rounded-pill px-3 py-2 tiny text-uppercase tracking-widest border border-light"
          >
            {product.type}
          </Badge>
        </div>

        {/* Discovery Narrative Layer */}
        <Card.Body className="p-0 d-flex flex-column gap-2">
          <div className="d-flex justify-content-between align-items-start">
            <span className="tiny text-uppercase fw-bold opacity-50 tracking-widest">
              {catalog?.name || 'Boutique'}
            </span>
            <div className="d-flex align-items-center gap-1 text-warning">
              <Star size={12} fill="currentColor" />
              <span className="tiny fw-bold">4.9</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`} className="text-decoration-none">
            <h6 className="fw-bold text-main mb-1 truncate-2-lines h-auto" style={{ minHeight: '2.4em' }}>{product.name}</h6>
          </Link>

          <div className="d-flex align-items-center justify-content-between mt-auto pt-2 border-top border-light">
            <div className="d-flex flex-column">
              <span className="tiny opacity-50 fw-bold lh-1 mb-1">
                Price
              </span>
              <span className="fw-bold text-primary display-6 fs-5">
                ₦{displayPrice?.toLocaleString() || '0'}
              </span>
            </div>
            <Button
              onClick={handleQuickAdd}
              // disabled={product.variants?.[0]?.stock === 0}
              variant="light"
              className="text-lowercase rounded-pill p-2 px-3 border-0 bg-light-ivory text-primary hover-text-white transition-all shadow-none"
            >
              Add to <ShoppingBag size={15} />
            </Button>
          </div>
        </Card.Body>
      </Card>

      <style>
        {`
          .product-card:hover .card-overlay {
            opacity: 1;
          }
          .hover-scale-110:hover {
            transform: scale(1.1);
          }
          .bg-light-ivory {
            background: rgba(109, 62, 33, 0.05);
          }
          .hover-bg-primary:hover {
            background: var(--lt-primary) !important;
          }
          .truncate-2-lines {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}
      </style>
    </motion.div>
  )
}

export default ProductCard
