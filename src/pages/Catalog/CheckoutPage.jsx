import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Container, Row, Col, Form, Modal, Button as BsButton } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { usePaystackPayment } from 'react-paystack'
import { useAppUi } from '../../context/AppUiContext'
import supabase from '../../utils/supabase'
import { updateQuantityThunk, removeItemThunk, setCartData } from '../../store/slices/cartSlice'
import { fetchPreorderWindows, fetchPreorderRules } from '../../store/slices/preorderSlice'
import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import { CalendarClock, ShieldCheck } from 'lucide-react'

// Modular Components Registry
import CheckoutHeader from '../../components/checkout/CheckoutHeader'
import CheckoutTips from '../../components/checkout/CheckoutTips'
import OrderTypeSelector from '../../components/checkout/OrderTypeSelector'
import DeliveryForm from '../../components/checkout/DeliveryForm'
import OrderSummary from '../../components/checkout/OrderSummary'
import PreorderRulesModal from '../../components/ui/PreorderRulesModal'
import { PAYSTACK_CONFIG } from '../../utils/paystack'

/**
 * CheckoutPage Component
 * Handles the modular checkout process for both Retail and Wholesale orders.
 * Now refactored into focused sub-components for better maintainability.
 */
const CheckoutPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { setGlobalLoading, setSubtleLoading, addAlert } = useAppUi()

  const { isAuthenticated, user, profile } = useSelector(state => state.auth)
  const { items: reduxItems } = useSelector(state => state.cart)
  const { windows, rules: preorderRules } = useSelector(state => state.preorder || { windows: [], rules: [] })

  // Local state for fresh data
  const [cartItems, setCartItems] = useState([])
  const [checkoutType, setCheckoutType] = useState('retail')
  const [catalogs, setCatalogs] = useState([])
  const [deliveryOptions, setDeliveryOptions] = useState([])
  const [selectedDeliveryId, setSelectedDeliveryId] = useState('')
  const [deliveryFee, setDeliveryFee] = useState(0)

  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  const [paymentMethod, setPaymentMethod] = useState('paystack')
  const [showManualModal, setShowManualModal] = useState(false)
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [manualOrderId, setManualOrderId] = useState(null)
  const [cancellingOrder, setCancellingOrder] = useState(false)

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: user?.email || '',
    whatsapp: '',
    country: 'Nigeria',
    state: '',
    city: '',
    address: '',
    notes: ''
  })

  const [pendingCheckoutData, setPendingCheckoutData] = useState(null)



  /**
   * Robust data loading to fix "0 items" bug
   */
  const loadCheckoutData = useCallback(async () => {
    setSubtleLoading(true, 'Getting your order ready...')
    try {
      // 1. Get catalogs and delivery areas
      const [catRes, delRes] = await Promise.all([
        supabase.from('latej_catalogs').select('*'),
        supabase.from('latej_delivery_pricing').select('*').eq('is_active', true).order('location_name')
      ])

      setCatalogs(catRes.data || [])
      setDeliveryOptions(delRes.data || [])

      // 2. Resolve cart items from database or redux
      let rawItems = []
      if (isAuthenticated && user?.id) {
        const { data, error } = await supabase
          .from('latej_cart')
          .select(`
            quantity,
            variant:latej_product_variants(*, product:latej_products(*))
          `)
          .eq('user_id', user.id)

        rawItems = (data || []).map(item => ({
          quantity: item.quantity,
          variant: item.variant,
          product: item.variant.product
        }))
      } else if (reduxItems.length > 0) {
        // Guest/Fallback: Refetch details for redux items
        const ids = reduxItems.map(i => i.variant.id)
        const { data } = await supabase
          .from('latej_product_variants')
          .select('*, product:latej_products(*)')
          .in('id', ids)

        rawItems = (data || []).map(variant => {
          const reduxItem = reduxItems.find(i => i.variant.id === variant.id)
          return {
            variant,
            product: variant.product,
            quantity: reduxItem?.quantity || 1
          }
        })
      }

      setCartItems(rawItems)
      dispatch(setCartData(rawItems))

      // Initial mode detection
      if (rawItems.length > 0) {
        const hasWholesale = rawItems.some(i => i.product.type === 'wholesale')
        const hasRetail = rawItems.some(i => i.product.type === 'retail')
        if (hasWholesale && !hasRetail) setCheckoutType('wholesale')
      }
    } catch (err) {
      console.error('Checkout Load Error:', err)
      addAlert('We could not load your cart details. Please try again.', 'error')
    } finally {
      setSubtleLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id, setSubtleLoading, addAlert])

  useEffect(() => {
    loadCheckoutData()
    dispatch(fetchPreorderWindows())
    dispatch(fetchPreorderRules())
  }, [loadCheckoutData, dispatch])

  // Calculation Registry
  const filteredItems = cartItems.filter(i => i.product.type === checkoutType)

  const activePreorderWindow = useMemo(() => {
    // Only show if at least one item being checked out is a pre-order variant
    const hasPreorderItem = filteredItems.some(item => item.variant?.is_preorder)
    if (!hasPreorderItem) return null
    return windows.find(w => w.mode === checkoutType) || null
  }, [filteredItems, windows, checkoutType])

  const calculatePrice = useCallback((item) => {
    return item.variant.price || 0
  }, [])

  const subtotal = filteredItems.reduce((acc, item) => acc + (calculatePrice(item) * item.quantity), 0)

  let couponDiscount = 0
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      couponDiscount = subtotal * (appliedCoupon.amount / 100)
    } else {
      couponDiscount = appliedCoupon.amount
    }
    couponDiscount = Math.min(couponDiscount, subtotal) // Cannot discount more than subtotal
  }

  const totalWeight = filteredItems.reduce((acc, item) => {
    const weight = item.variant.weight || 0
    return acc + (weight * item.quantity)
  }, 0)

  const [deliveryBreakdown, setDeliveryBreakdown] = useState(null)

  const handleApplyCoupon = async (e) => {
    e.preventDefault()
    if (!couponCode.trim()) {
      addAlert('Please enter a coupon code', 'warning')
      return
    }
    if (!isAuthenticated) {
      addAlert('Please sign in to use coupons', 'warning')
      return
    }

    setSubtleLoading(true, 'Verifying coupon...')
    try {
      const { data, error } = await supabase.rpc('latej_validate_coupon', {
        p_code: couponCode.trim().toUpperCase(),
        p_user_id: user.id,
        p_order_amount: subtotal
      })

      if (error) throw error

      if (!data.is_valid) {
        addAlert(data.message, 'error')
        setAppliedCoupon(null)
        return
      }

      setAppliedCoupon(data.coupon)
      addAlert(data.message, 'success')
    } catch (err) {
      addAlert(err.message || 'Failed to validate coupon', 'error')
      setAppliedCoupon(null)
    } finally {
      setSubtleLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
  }

  // Delivery fee logic
  useEffect(() => {
    if (!selectedDeliveryId) {
      setDeliveryFee(0)
      setDeliveryBreakdown(null)
      return
    }

    const option = deliveryOptions.find(opt => opt.id === selectedDeliveryId)
    if (!option) return

    const baseFee = parseFloat(option.flat_fee)
    let totalFee = baseFee
    let breakdown = { baseFee, isExtra: false }

    if (totalWeight > option.increment_weight) {
      const extraWeight = totalWeight - option.increment_weight
      const increments = Math.ceil(extraWeight / option.increment_weight)
      const incrementFee = parseFloat(option.increment_fee)
      const totalExtra = increments * incrementFee

      totalFee += totalExtra
      breakdown = {
        ...breakdown,
        isExtra: true,
        extraWeight: extraWeight.toFixed(1),
        increments,
        incrementFee,
        totalExtra,
        threshold: option.increment_weight
      }
    }

    setDeliveryFee(totalFee)
    setDeliveryBreakdown(breakdown)
    setFormData(prev => ({ ...prev, state: option.location_name }))
  }, [selectedDeliveryId, totalWeight, deliveryOptions])

  const paystackConfig = {
    reference: pendingCheckoutData?.txRef || '',
    email: formData.email,
    amount: Math.round(((subtotal - couponDiscount) + deliveryFee) * 100), // Paystack expects amount in kobo
    publicKey: PAYSTACK_CONFIG.PUBLIC_KEY,
    currency: 'NGN',
    metadata: {
      custom_fields: [
        { display_name: "Customer Name", variable_name: "customer_name", value: formData.fullName },
        { display_name: "Phone Number", variable_name: "phone_number", value: formData.whatsapp }
      ]
    }
  }

  const initializePayment = usePaystackPayment(paystackConfig)

  useEffect(() => {
    if (pendingCheckoutData) {
      initializePayment({
        onSuccess: (response) => {
          console.log("Payment Manifested:", response);
          if (response.status === 'success') {
            addAlert('Payment successful! Your order is being processed.', 'success');
            setTimeout(() => {
              navigate(`/dashboard/orders?id=${pendingCheckoutData.orderId}`, { replace: true });
            }, 1000);
          }
        },
        onClose: async () => {
          setGlobalLoading(true, 'Cancelling transaction...');
          try {
            // Delete the order to release stock and cleanup
            const { error } = await supabase.from('latej_orders').delete().eq('id', pendingCheckoutData.orderId);
            if (error) throw error;
            addAlert('Payment cancelled. Your items have been released.', 'info');
            // Navigate back to catalog since cart was cleared during order manifestation
            navigate('/catalog');
          } catch (err) {
            console.error('Failed to cancel order:', err);
            addAlert('Payment cancelled.', 'info');
          } finally {
            setGlobalLoading(false);
            setPendingCheckoutData(null);
          }
        }
      });
      setGlobalLoading(false);
      setPendingCheckoutData(null);
    }
  }, [pendingCheckoutData, initializePayment, navigate, addAlert, setGlobalLoading])

  // Interaction Registry
  const handleUpdateQuantity = async (variantId, newQty) => {
    setSubtleLoading(true, 'Updating your items...')
    try {
      await dispatch(updateQuantityThunk({ variantId, quantity: newQty })).unwrap()
      setCartItems(prev => prev.map(item =>
        item.variant.id === variantId ? { ...item, quantity: Math.max(1, newQty) } : item
      ))
    } catch (err) {
      addAlert('Could not update your cart', 'error')
    } finally {
      setSubtleLoading(false)
    }
  }

  const handleRemove = async (variantId) => {
    setSubtleLoading(true, 'Removing item...')
    try {
      await dispatch(removeItemThunk(variantId)).unwrap()
      setCartItems(prev => prev.filter(item => item.variant.id !== variantId))
    } catch (err) {
      addAlert('Could not remove that item', 'error')
    } finally {
      setSubtleLoading(false)
    }
  }

  const [orderError, setOrderError] = useState(null)

  const handleCancelManualOrder = async () => {
    setCancellingOrder(true)
    setGlobalLoading(true, 'Cancelling order and releasing stock...')
    try {
      const { error } = await supabase.from('latej_orders').delete().eq('id', manualOrderId)
      if (error) throw error

      addAlert('Order cancelled and items released back to stock.', 'info')
      setShowManualModal(false)
      setManualOrderId(null)
    } catch (err) {
      console.error(err)
      addAlert('Failed to cancel order. Please try again or contact support.', 'error')
    } finally {
      setCancellingOrder(false)
      setGlobalLoading(false)
    }
  }

  const handleConfirmManualPayment = async () => {
    setGlobalLoading(true, 'Confirming your transfer...')
    try {
      const { error } = await supabase
        .from('latej_orders')
        .update({ status: 'verifying_manual_payment' })
        .eq('id', manualOrderId)

      if (error) throw error

      // Trigger email dispatch gracefully
      try {
        await supabase.functions.invoke('send-email', {
          body: {
            to: formData.email,
            subject: 'We are verifying your manual payment',
            template: 'order_status_update',
            params: {
              customerName: formData.fullName,
              orderId: manualOrderId,
              newStatus: 'Verifying Manual Payment'
            }
          }
        })
      } catch (e) { console.error('Email failed', e) }

      addAlert('Payment submitted for verification. You will be notified once approved!', 'success')
      setShowManualModal(false)
      navigate(`/dashboard/orders?id=${manualOrderId}`, { replace: true })
    } catch (err) {
      console.error(err)
      addAlert('Failed to verify payment submission.', 'error')
    } finally {
      setGlobalLoading(false)
    }
  }

  const handleCompleteOrder = async (e) => {
    if (e) e.preventDefault()
    setOrderError(null)

    if (!isAuthenticated) {
      const msg = 'Please sign in to complete your order'
      addAlert(msg, 'warning')
      setOrderError(msg)
      navigate('/login?redirect=/checkout')
      return
    }

    if (!selectedDeliveryId) {
      const msg = 'Please tell us where to deliver your order'
      addAlert(msg, 'warning')
      setOrderError(msg)
      return
    }

    setGlobalLoading(true, 'Finishing up your order...')
    try {
      const idempotencyKey = `${user.id}_${Date.now()}_${checkoutType}`
      const finalTxRef = `LTJ_ORD_${checkoutType}_${user.id.split('-')[0]}_${Date.now()}`

      const { data, error } = await supabase.rpc('create_latej_order', {
        input_shop_mode: checkoutType,
        input_delivery_fee: deliveryFee,
        input_address_info: formData,
        input_idempotency_key: idempotencyKey,
        input_tx_ref: finalTxRef,
        input_coupon_code: appliedCoupon ? appliedCoupon.code : null,
        input_payment_method: paymentMethod
      })

      if (error) {
        console.log(error)
        throw error
      }

      // 3.5. Zero-Cost Bypass
      if (data.total_amount === 0) {
        setGlobalLoading(false)
        addAlert('Order placed successfully! Your total was fully covered by the discount.', 'success')
        navigate(`/dashboard/orders?id=${data.id}`, { replace: true })
        return
      }

      // Manual Payment Intercept
      if (paymentMethod === 'manual') {
        setManualOrderId(data.id)
        setShowManualModal(true)
        setGlobalLoading(false)
        return
      }

      // 4. Trigger Payment Window
      setPendingCheckoutData({
        txRef: finalTxRef,
        orderId: data.id
      })
    } catch (err) {
      addAlert(err.message, 'error')
      setOrderError(err.message)
      setGlobalLoading(false)
    } finally {
      setGlobalLoading(false)
    }
  }

  return (
    <div className="checkout-page pt-5 mt-5 pb-5 bg-light" style={{ minHeight: '100vh' }}>
      <Container className="py-5">
        <CheckoutHeader />

        <Form onSubmit={handleCompleteOrder}>
          <Row className="g-5">
            <Col lg={7}>
              <div className="d-flex flex-column gap-5">
                <CheckoutTips type={checkoutType} />
                <OrderTypeSelector checkoutType={checkoutType} setCheckoutType={setCheckoutType} />

                {activePreorderWindow && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-4 shadow-sm border border-2 border-primary position-relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, rgba(var(--bs-primary-rgb), 0.05) 0%, rgba(var(--bs-primary-rgb), 0.1) 100%)' }}
                  >
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <CalendarClock className="text-primary" size={24} />
                      <div className="ms-3 flex-grow-1">
                        <h6 className="fw-bold mb-1" style={{ color: 'var(--lt-earth-dark)' }}>Pre-order Advisory</h6>
                        <p className="mb-0 small" style={{ color: 'var(--lt-earth-dark)' }}>
                          Your order contains pre-order items. These items will be processed after the {checkoutType} window closes on <span className="text-primary fw-bold">{new Date(activePreorderWindow.end_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>. Delivery timelines will begin from this date.
                        </p>
                        <button 
                          type="button"
                          className="btn btn-link p-0 text-primary fw-bold small mt-2 text-decoration-none shadow-none" 
                          onClick={() => setShowRulesModal(true)}
                        >
                          View {checkoutType === 'wholesale' ? 'Wholesale' : 'Retail'} Pre-order Guidelines &rarr;
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <DeliveryForm
                  formData={formData}
                  setFormData={setFormData}
                  deliveryOptions={deliveryOptions}
                  selectedDeliveryId={selectedDeliveryId}
                  setSelectedDeliveryId={setSelectedDeliveryId}
                  deliveryFee={deliveryFee}
                />
              </div>
            </Col>

            <Col lg={5}>
              <OrderSummary
                filteredItems={filteredItems}
                checkoutType={checkoutType}
                calculatePrice={calculatePrice}
                handleUpdateQuantity={handleUpdateQuantity}
                handleRemove={handleRemove}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                deliveryBreakdown={deliveryBreakdown}
                orderError={orderError}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                handleApplyCoupon={handleApplyCoupon}
                appliedCoupon={appliedCoupon}
                couponDiscount={couponDiscount}
                handleRemoveCoupon={handleRemoveCoupon}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </Col>
          </Row>
        </Form>
      </Container>

      {/* Manual Payment Verification Modal */}
      <Modal show={showManualModal} onHide={() => { }} backdrop="static" keyboard={false} centered className="manual-payment-modal">
        <Modal.Header className="border-0 pb-0 text-center justify-content-center pt-4">
          <Modal.Title className="fw-bold text-main">Complete Your Transfer</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <p className="text-main opacity-75 small leading-relaxed mb-4">
            Your order has been reserved! Please transfer the exact amount of <strong className="text-primary fs-5">₦{((subtotal - couponDiscount) + deliveryFee).toLocaleString()}</strong> to the account below.
          </p>
          <div className="bg-light p-4 rounded-4 border border-light mb-4 text-start">
            <h6 className="tiny text-uppercase fw-bold opacity-50 mb-1">Bank Name</h6>
            <p className="fw-bold text-main mb-3">Guaranty Trust Bank (GTB)</p>

            <h6 className="tiny text-uppercase fw-bold opacity-50 mb-1">Account Number</h6>
            <p className="fw-bold text-primary fs-3 mb-3 tracking-widest">0123456789</p>

            <h6 className="tiny text-uppercase fw-bold opacity-50 mb-1">Account Name</h6>
            <p className="fw-bold text-main mb-0">La Tej Creations</p>
          </div>
          <p className="tiny opacity-50 fst-italic">Do not close this window until you have successfully made the transfer.</p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 pb-4 px-4 flex-nowrap">
          <BsButton variant="light" className="w-50 rounded-pill fw-bold text-danger opacity-75 hover-opacity-100" onClick={handleCancelManualOrder} disabled={cancellingOrder}>
            Cancel Order
          </BsButton>
          <BsButton variant="primary" className="w-50 rounded-pill fw-bold shadow-sm" onClick={handleConfirmManualPayment}>
            I've Made Payment
          </BsButton>
        </Modal.Footer>
      </Modal>

      {/* Pre-order Rules Modal */}
      <PreorderRulesModal 
        show={showRulesModal} 
        onHide={() => setShowRulesModal(false)} 
        rules={preorderRules}
        modeFilter={checkoutType} 
      />

      <style>
        {`
          .checkout-page .form-control:focus, .checkout-page .form-select:focus {
            background-color: transparent !important;
            box-shadow: none !important;
          }
          .bg-primary-light {
            background: rgba(109, 62, 33, 0.05);
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(109, 62, 33, 0.1);
            border-radius: 10px;
          }
        `}
      </style>
    </div>
  )
}

export default CheckoutPage
