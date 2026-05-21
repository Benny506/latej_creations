import React, { useState, useEffect, useCallback } from 'react'
import { Container, Row, Col, Form, Modal, Button as BsButton } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAppUi } from '../../context/AppUiContext'
import useScript from '../../hooks/useScript'
import supabase from '../../utils/supabase'
import { updateQuantityThunk, removeItemThunk, setCartData } from '../../store/slices/cartSlice'

// Modular Components Registry
import CheckoutHeader from '../../components/checkout/CheckoutHeader'
import CheckoutTips from '../../components/checkout/CheckoutTips'
import OrderTypeSelector from '../../components/checkout/OrderTypeSelector'
import DeliveryForm from '../../components/checkout/DeliveryForm'
import OrderSummary from '../../components/checkout/OrderSummary'
import { FLUTTERWAVE_CONFIG } from '../../utils/flutterwave'

/**
 * CheckoutPage Component
 * Handles the modular checkout process for both Retail and Wholesale orders.
 * Now refactored into focused sub-components for better maintainability.
 */
const CheckoutPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { setGlobalLoading, setSubtleLoading, addAlert } = useAppUi()

  // Use dynamic script loader for resilience
  const sdkStatus = useScript('https://checkout.flutterwave.com/v3.js')

  const { isAuthenticated, user, profile } = useSelector(state => state.auth)
  const { items: reduxItems } = useSelector(state => state.cart)

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
      console.log("HERE")
      setSubtleLoading(false)
    }
  }, [isAuthenticated, user?.id, reduxItems, setSubtleLoading, addAlert])

  useEffect(() => {
    loadCheckoutData()
  }, [])

  // Calculation Registry
  const filteredItems = cartItems.filter(i => i.product.type === checkoutType)

  const calculatePrice = useCallback((item) => {
    if (item.product.type === 'wholesale') {
      const cat = catalogs.find(c => c.id === item.product.catalog_id)
      return cat?.wholesale_price || 0
    }
    return item.variant.price || 0
  }, [catalogs])

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
      if (sdkStatus === 'loading') {
        setGlobalLoading(false)
        addAlert('The payment system is still initializing. Please wait a second.', 'info')
        return
      }

      if (sdkStatus === 'error') {
        setGlobalLoading(false)
        addAlert('The payment gateway was blocked. Please check your internet or refresh the page.', 'error')
        return
      }

      const modal = window.FlutterwaveCheckout({
        public_key: FLUTTERWAVE_CONFIG.PUBLIC_KEY,
        tx_ref: finalTxRef,
        amount: (subtotal - couponDiscount) + deliveryFee,
        currency: "NGN",
        payment_options: "card, account, ussd",
        customer: {
          email: formData.email,
          phone_number: formData.whatsapp,
          name: formData.fullName,
        },
        customizations: {
          title: FLUTTERWAVE_CONFIG.CUSTOM_TITLE,
          description: FLUTTERWAVE_CONFIG.CUSTOM_DESCRIPTION,
          logo: FLUTTERWAVE_CONFIG.CUSTOM_LOGO,
        },
        callback: (paymentData) => {
          console.log("Payment Manifested:", paymentData);
          const status = paymentData.status?.toLowerCase();

          if (status === 'successful' || status === 'success' || status === 'completed') {
            addAlert('Payment successful! Your order is being processed.', 'success');

            // Automated dismissal and sync
            if (modal && typeof modal.close === 'function') {
              modal.close();
            }

            setTimeout(() => {
              navigate(`/dashboard/orders?id=${data.id}`, { replace: true });
            }, 1000);
          }
        },
        onclose: () => {
          addAlert('Payment window closed. You can track your order in your dashboard.', 'info');
          navigate(`/dashboard/orders?id=${data.id}`, { replace: true });
        }
      });
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
      <Modal show={showManualModal} onHide={() => {}} backdrop="static" keyboard={false} centered className="manual-payment-modal">
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
