import React from 'react'
import { Badge, Button } from 'react-bootstrap'
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const OrderSummary = ({
  filteredItems,
  checkoutType,
  calculatePrice,
  handleUpdateQuantity,
  handleRemove,
  subtotal,
  deliveryFee,
  deliveryBreakdown,
  orderError,
  couponCode,
  setCouponCode,
  handleApplyCoupon,
  appliedCoupon,
  couponDiscount,
  handleRemoveCoupon,
  paymentMethod,
  setPaymentMethod
}) => (
  <div className="sticky-top" style={{ top: '120px' }}>
    <div className="bg-white rounded-5 shadow-premium border border-light overflow-hidden">
      <div className="p-4 bg-light border-bottom border-light">
        <h6 className="fw-bold text-main mb-0 d-flex align-items-center justify-content-between">
          Order Summary
          <Badge bg="primary" className="rounded-pill tiny text-uppercase tracking-widest px-3 py-2">
            {filteredItems.length} {checkoutType} items
          </Badge>
        </h6>
      </div>

      <div className="p-4 d-flex flex-column gap-3 max-vh-50 overflow-auto custom-scrollbar">
        <AnimatePresence>
          {filteredItems.length === 0 ? (
            <div className="py-5 text-center opacity-50">
              <ShoppingBag size={40} className="mb-3" />
              <p className="tiny fw-bold text-uppercase tracking-widest">Your cart is empty</p>
            </div>
          ) : (
            filteredItems.map(item => {
              const price = calculatePrice(item)
              const image = item.variant.images?.[0] || '/placeholder.jpg'
              return (
                <motion.div
                  key={item.variant.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="d-flex gap-3 bg-light p-3 rounded-4 border border-light position-relative"
                >
                  <div className="rounded-3 overflow-hidden shadow-sm" style={{ width: '60px', height: '70px', flexShrink: 0 }}>
                    <img src={image} className="w-100 h-100 object-fit-cover" />
                  </div>
                  <div className="flex-grow-1 d-flex flex-column justify-content-between">
                    <div>
                      <h6 className="fw-bold text-main mb-0 tiny text-uppercase leading-tight">{item.product.name}</h6>
                      {/* {item.product.type === 'retail' && ( */}
                      <Badge bg="white" className="text-primary tiny fw-bold border border-light rounded-pill px-2 py-1" style={{ fontSize: '0.6rem' }}>
                        {item.variant.stock} left
                      </Badge>
                      {/* )} */}
                      <span className="tiny opacity-50 fw-bold">{item.variant.name}</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <button type="button" onClick={() => handleUpdateQuantity(item.variant.id, item.quantity - 1)} className="btn btn-link p-0 text-main border-0 shadow-none"><Minus size={14} /></button>
                        <span className="tiny fw-bold">{item.quantity}</span>
                        <button type="button" onClick={() => handleUpdateQuantity(item.variant.id, item.quantity + 1)} className="btn btn-link p-0 text-main border-0 shadow-none"><Plus size={14} /></button>
                      </div>
                      <span className="fw-bold text-primary">₦{(price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => handleRemove(item.variant.id)} className="btn btn-link text-danger opacity-25 hover-opacity-100 p-0 border-0 shadow-none position-absolute top-0 end-0 m-2">
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-white border-top border-light">
        <div className="d-flex flex-column gap-3 mb-4">
          <div className="d-flex justify-content-between opacity-50 tiny text-uppercase fw-bold tracking-widest">
            <span>Items Total ({checkoutType})</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>

          {/* Coupon Section */}
          <div className="py-2 border-bottom border-light">
            {!appliedCoupon ? (
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control rounded-pill tiny text-uppercase tracking-widest px-3 bg-light border-0 shadow-none"
                  placeholder="Enter discount code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (couponCode.trim()) handleApplyCoupon(e)
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleApplyCoupon}
                  variant="dark"
                  className="rounded-pill tiny text-uppercase tracking-widest px-3 fw-bold"
                  disabled={!couponCode.trim()}
                >
                  Apply
                </Button>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-between bg-success bg-opacity-10 p-2 px-3 rounded-pill">
                <div className="d-flex align-items-center gap-2">
                  <span className="tiny fw-bold text-light text-uppercase tracking-widest">{appliedCoupon.code}</span>
                  <span className="badge bg-success rounded-pill tiny">
                    {appliedCoupon.type === 'percentage' ? `${appliedCoupon.amount}% OFF` : `₦${appliedCoupon.amount} OFF`}
                  </span>
                </div>
                <button type="button" onClick={handleRemoveCoupon} className="btn btn-link p-0 text-danger shadow-none">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          {couponDiscount > 0 && (
            <div className="d-flex justify-content-between text-success tiny text-uppercase fw-bold tracking-widest animate-pulse">
              <span>Coupon Discount</span>
              <span>- ₦{couponDiscount.toLocaleString()}</span>
            </div>
          )}

          <div className="d-flex flex-column gap-2 mb-2">
            <div className="d-flex justify-content-between opacity-50 tiny text-uppercase fw-bold tracking-widest">
              <span>Delivery Fee</span>
              <span className="text-primary">₦{deliveryFee.toLocaleString()}</span>
            </div>
            {deliveryBreakdown?.isExtra && (
              <div className="p-3 bg-light rounded-4 border border-light mt-1">
                <p className="tiny fw-bold text-main mb-2 text-uppercase opacity-75" style={{ fontSize: '0.6rem' }}>Weight Breakdown</p>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between tiny fw-bold opacity-50">
                    <span>Base Flat Fee</span>
                    <span>₦{deliveryBreakdown.baseFee.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between tiny fw-bold opacity-50">
                    <span>Extra Weight ({deliveryBreakdown.extraWeight}kg)</span>
                    <span>+ ₦{deliveryBreakdown.totalExtra.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 pt-2 border-top border-light border-opacity-50 tiny opacity-50 leading-relaxed font-italic" style={{ fontSize: '0.8rem' }}>
                    Note: Your order exceeds the {deliveryBreakdown.threshold}kg base weight. ₦{deliveryBreakdown.incrementFee.toLocaleString()} added for every {deliveryBreakdown.threshold}kg extra.
                  </div>
                </div>
              </div>
            )}
          </div>
          <hr className="my-1 opacity-10" />
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold text-main mb-0">Grand Total</h5>
            <h4 className="fw-bold text-primary mb-0">₦{((subtotal - couponDiscount) + deliveryFee).toLocaleString()}</h4>
          </div>
          <div className="d-flex flex-column gap-2 mt-2 mb-3">
            <h6 className="tiny fw-bold text-main opacity-50 text-uppercase tracking-widest mb-1">Payment Method</h6>
            <div className="d-flex gap-2">
              <Button
                variant={paymentMethod === 'paystack' ? 'dark' : 'outline-light'}
                className={`flex-grow-1 rounded-pill tiny fw-bold text-uppercase p-2 ${paymentMethod !== 'paystack' ? 'text-main' : ''}`}
                onClick={() => setPaymentMethod('paystack')}
              >
                Card / Online
              </Button>
              <Button
                variant={paymentMethod === 'manual' ? 'dark' : 'outline-light'}
                className={`flex-grow-1 rounded-pill tiny fw-bold text-uppercase p-2 ${paymentMethod !== 'manual' ? 'text-main' : ''}`}
                onClick={() => setPaymentMethod('manual')}
              >
                Bank Transfer
              </Button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={filteredItems.length === 0}
          variant="primary"
          className="w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-premium border-0 text-uppercase tracking-widest tiny"
        >
          {paymentMethod === 'manual' ? 'Complete Order' : 'Pay Now'} <ArrowRight size={20} />
        </Button>

        {orderError && (
          <div className="mt-3 p-3 bg-danger bg-opacity-10 border border-danger border-opacity-10 rounded-4 animate-shake">
            <p className="tiny fw-bold text-light mb-0 leading-relaxed text-center">
              {orderError}
            </p>
          </div>
        )}

        <div className="d-flex align-items-center justify-content-center gap-2 mt-3 opacity-25">
          <ShieldCheck size={16} />
          <span className="tiny fw-bold text-uppercase tracking-tighter" style={{ fontSize: '0.6rem' }}>Secure Payment</span>
        </div>
      </div>
    </div>
  </div>
)

export default OrderSummary
