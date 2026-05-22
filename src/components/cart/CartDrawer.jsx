import React from 'react'
import { Offcanvas, Button, Badge } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import {
  ShoppingBag,
  X,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Package
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  closeCart,
  updateQuantityThunk,
  removeItemThunk,
  clearCartThunk
} from '../../store/slices/cartSlice'
import { useAppUi } from '../../context/AppUiContext'
import { Link } from 'react-router-dom'

/**
 * CartDrawer Component
 * Orchestrates the high-fidelity procurement manifest for partner collections.
 * Features specialized item management and everyday language narratives.
 */
const CartDrawer = () => {
  const dispatch = useDispatch()
  const { setSubtleLoading, addAlert } = useAppUi()
  const { items, isOpen } = useSelector(state => state.cart)
  const { catalogs } = useSelector(state => state.products)
  const { isAuthenticated } = useSelector(state => state.auth)

  // Institutional Pricing & Total Calculation
  const calculateItemPrice = (item) => {
    if (item.product.type === 'wholesale') {
      const catalog = catalogs.find(c => c.id === item.product.catalog_id)
      return catalog?.wholesale_price || 0
    }
    return item.variant.price || 0
  }

  const total = items.reduce((acc, item) => acc + (calculateItemPrice(item) * item.quantity), 0)

  const handleUpdateQuantity = async (variantId, newQuantity) => {
    if (isAuthenticated) {
      setSubtleLoading(true, 'Updating your collection...')
    }
    try {
      await dispatch(updateQuantityThunk({ variantId, quantity: newQuantity })).unwrap()
    } catch (err) {
      addAlert('Could not update quantity', 'error')
    } finally {
      if (isAuthenticated) setSubtleLoading(false)
    }
  }

  const handleRemoveItem = async (variantId) => {
    setSubtleLoading(true, 'Removing item from collection...')
    try {
      await dispatch(removeItemThunk(variantId)).unwrap()
      addAlert('Item removed from cart', 'success')
    } catch (err) {
      addAlert('Could not remove item', 'error')
    } finally {
      setSubtleLoading(false)
    }
  }

  return (
    <Offcanvas
      show={isOpen}
      onHide={() => dispatch(closeCart())}
      placement="end"
      className="cart-offcanvas border-0 shadow-premium"
      style={{ width: '100%', maxWidth: '450px', background: 'var(--lt-bg-ivory)' }}
    >
      {/* Header Manifestation */}
      <Offcanvas.Header className="p-4 border-bottom border-light bg-white d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h5 className="fw-bold text-main mb-0">My Shopping Cart</h5>
            <span className="tiny text-uppercase fw-bold opacity-50 tracking-widest" style={{ fontSize: '0.65rem' }}>
              {items.length} {items.length === 1 ? 'item' : 'items'} in collection
            </span>
          </div>
        </div>
        <button
          onClick={() => dispatch(closeCart())}
          className="btn btn-link text-dark opacity-25 hover-opacity-100 transition-all p-2 border-0 shadow-none"
        >
          <X size={24} />
        </button>
      </Offcanvas.Header>

      <Offcanvas.Body className="p-0 d-flex flex-column">
        {items.length === 0 ? (
          <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-5 text-center">
            <div className="bg-light text-primary rounded-circle p-4 mb-4 opacity-50">
              <ShoppingBag size={60} />
            </div>
            <h4 className="fw-bold mb-3">Your cart is empty</h4>
            <p className="text-dark opacity-50 mb-5 leading-relaxed">
              Looks like you haven't added any heritage items to your collection yet.
            </p>
            <Button
              onClick={() => dispatch(closeCart())}
              variant="primary"
              className="rounded-pill px-5 py-3 fw-bold border-0 shadow-sm"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Items Registry */}
            <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-4">
              <AnimatePresence>
                {items.map((item) => {
                  const itemPrice = calculateItemPrice(item)
                  const itemImage = item.variant.images?.[0] || '/placeholder-product.jpg'

                  return (
                    <motion.div
                      key={item.variant.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="cart-item bg-white p-3 rounded-5 shadow-sm border border-light d-flex gap-3 position-relative"
                    >
                      {/* Visual Preview */}
                      <div className="rounded-4 overflow-hidden shadow-sm" style={{ width: '90px', height: '110px', flexShrink: 0 }}>
                        <img
                          src={itemImage}
                          alt={item.product.name}
                          className="w-100 h-100 object-fit-cover"
                        />
                      </div>

                      {/* Discovery Narrative */}
                      <div className="flex-grow-1 d-flex flex-column justify-content-between py-1">
                        <div>
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <div className="d-flex flex-column gap-1">
                              <h6 className="fw-bold text-main mb-0 pe-4 leading-tight">{item.product.name}</h6>
                              {/* {item.product.type === 'retail' && ( */}
                              <div className="d-flex">
                                <Badge bg="white" className="text-primary tiny fw-bold border border-light rounded-pill px-2 py-1" style={{ fontSize: '0.6rem' }}>
                                  {item.variant.stock} left
                                </Badge>
                              </div>
                              {/* )} */}
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.variant.id)}
                              className="btn btn-link text-danger opacity-25 hover-opacity-100 p-1 border-0 shadow-none position-absolute top-0 end-0 m-3"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <span className="tiny fw-bold text-primary text-uppercase tracking-widest opacity-75 d-block mb-2" style={{ fontSize: '0.65rem' }}>
                            {item.variant.name}
                          </span>
                        </div>

                        <div className="d-flex align-items-center justify-content-between mt-auto">
                          <div className="d-flex align-items-center bg-light rounded-pill p-1 shadow-sm">
                            <button
                              onClick={() => handleUpdateQuantity(item.variant.id, item.quantity - 1)}
                              className="btn btn-link text-main p-1 border-0 shadow-none"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="fw-bold px-2 tiny">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.variant.id, item.quantity + 1)}
                              className="btn btn-link text-main p-1 border-0 shadow-none"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="fw-bold text-main">₦{(itemPrice * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Procurement Summary Registry */}
            <div className="p-4 bg-white border-top border-light shadow-lg">
              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex justify-content-between align-items-center opacity-75">
                  <span className="tiny text-uppercase fw-bold tracking-widest">Subtotal</span>
                  <span className="fw-bold">₦{total.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center opacity-75">
                  <span className="tiny text-uppercase fw-bold tracking-widest">Shipping</span>
                  <span className="tiny fw-bold text-uppercase">Calculated at Checkout</span>
                </div>
                <hr className="my-1 opacity-10" />
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold text-main mb-0">Total Due</h5>
                  <h4 className="fw-bold text-primary mb-0">₦{total.toLocaleString()}</h4>
                </div>
              </div>

              <div className="d-flex flex-column gap-2">
                <Button
                  as={Link}
                  to="/checkout"
                  onClick={() => dispatch(closeCart())}
                  variant="primary"
                  className="w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-premium border-0"
                >
                  Proceed to Checkout <ArrowRight size={20} />
                </Button>
                <div className="d-flex align-items-center justify-content-center gap-2 mt-2 opacity-50">
                  <ShieldCheck size={14} />
                  <span className="tiny fw-bold text-uppercase tracking-tighter" style={{ fontSize: '0.6rem' }}>Secure Checkout</span>
                </div>
              </div>
            </div>
          </>
        )}
      </Offcanvas.Body>

      <style>
        {`
          .cart-item {
            transition: all 0.3s ease;
          }
          .cart-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(109, 62, 33, 0.08) !important;
          }
          .cursor-not-allowed { cursor: not-allowed; }
        `}
      </style>
    </Offcanvas>
  )
}

export default CartDrawer
