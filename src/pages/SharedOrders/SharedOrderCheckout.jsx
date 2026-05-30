import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Badge, Modal, Button as BsButton } from 'react-bootstrap'
import { usePaystackPayment } from 'react-paystack'
import { useAppUi } from '../../context/AppUiContext'
import supabase from '../../utils/supabase'
import { PAYSTACK_CONFIG } from '../../utils/paystack'
import { MANUAL_TRANSFER_DETAILS } from '../../utils/manualTransfer'
import { adminEmailConstants } from '../../utils/constants'
import { Clock, MapPin, Phone, User, Package, ShieldCheck, CreditCard, Landmark, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SharedOrderCheckout() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { setSubtleLoading, addAlert, setGlobalLoading } = useAppUi()

  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')
  const [isExpired, setIsExpired] = useState(false)

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('paystack')
  const [showManualModal, setShowManualModal] = useState(false)
  const [confirmingManual, setConfirmingManual] = useState(false)

  // Fetch the nested order data securely using the anonymous RPC
  const fetchOrderDetails = useCallback(async () => {
    setSubtleLoading(true, 'Retrieving order details...')
    try {
      const { data, error: rpcError } = await supabase.rpc('get_latej_shared_order_by_token', { p_token: token })

      if (rpcError || !data || !data.order) {
        throw new Error('Order not found')
      }

      setOrderData(data)

      // Initial expiration check
      const expiry = new Date(data.shared_order.expires_at).getTime()
      if (new Date().getTime() > expiry) {
        setIsExpired(true)
      }
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setSubtleLoading(false)
      setLoading(false)
    }
  }, [token, setSubtleLoading])

  useEffect(() => {
    fetchOrderDetails()
  }, [fetchOrderDetails])

  // Countdown Timer Logic
  useEffect(() => {
    if (!orderData || isExpired) return

    const expiryTime = new Date(orderData.shared_order.expires_at).getTime()

    const updateTimer = () => {
      const now = new Date().getTime()
      const distance = expiryTime - now

      if (distance <= 0) {
        setIsExpired(true)
        setTimeLeft('Expired')
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

      if (days >= 1) {
        setTimeLeft(`${days} day${days > 1 ? 's' : ''} ${hours}h ${minutes}m`)
      } else {
        setTimeLeft(`${hours}h ${minutes}m`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [orderData, isExpired])

  // Paystack Configuration
  const subtotal = orderData?.order?.total_amount || 0
  const deliveryFee = orderData?.order?.delivery_fee || 0 // Use delivery_fee instead of shipping_fee
  const finalTotal = subtotal + deliveryFee

  const paystackConfig = {
    reference: orderData?.order?.tx_ref || `LTJ_SHRD_${Date.now()}`,
    email: adminEmailConstants.ADMIN_EMAIL, // Fallback if no email on shared order (customer might be guest). Admin email keeps Paystack happy.
    amount: Math.round(finalTotal * 100), // Kobo
    publicKey: PAYSTACK_CONFIG.PUBLIC_KEY,
    currency: 'NGN',
    metadata: {
      custom_fields: [
        { display_name: "Customer Name", variable_name: "customer_name", value: orderData?.order?.full_name || 'Guest' },
        { display_name: "Order Type", variable_name: "order_type", value: "Shared Order" }
      ]
    }
  }

  const initializePayment = usePaystackPayment(paystackConfig)

  const handlePaystackCheckout = () => {
    initializePayment({
      onSuccess: (response) => {
        if (response.status === 'success') {
          addAlert('Payment successful! Your order is now processing.', 'success')
          navigate('/catalog', { replace: true })
        }
      },
      onClose: () => {
        addAlert('Payment cancelled.', 'info')
      }
    })
  }

  const handleCompletePayment = () => {
    if (isExpired) {
      addAlert('This link has expired.', 'error')
      return
    }

    if (paymentMethod === 'manual') {
      setShowManualModal(true)
    } else {
      handlePaystackCheckout()
    }
  }

  const handleConfirmManualPayment = async () => {
    setConfirmingManual(true)
    setGlobalLoading(true, 'Confirming your transfer...')
    try {
      // Use RPC to securely bypass RLS and mark the order as verifying
      const { error: rpcError } = await supabase.rpc('confirm_latej_shared_order_manual_payment', { p_token: token })

      if (rpcError) throw rpcError

      // Send email to admin
      try {
        await supabase.functions.invoke('send-email', {
          body: {
            to: adminEmailConstants.ADMIN_EMAIL,
            from_email: adminEmailConstants.FROM_EMAIL,
            from_name: adminEmailConstants.FROM_NAME,
            subject: 'Manual Payment Verification Required (Shared Order)',
            template: 'order_status_update',
            params: {
              customerName: orderData.order.full_name,
              orderId: orderData.order.id,
              newStatus: 'Verifying Manual Payment'
            }
          }
        })
      } catch (e) { console.error('Email failed', e) }

      addAlert('Payment submitted for verification. We will notify you once approved!', 'success')
      setShowManualModal(false)
      navigate('/catalog', { replace: true })
    } catch (err) {
      console.error(err)
      addAlert('Failed to submit manual payment verification.', 'error')
    } finally {
      setConfirmingManual(false)
      setGlobalLoading(false)
    }
  }

  // Render 404 / Error State
  if (error || (!loading && !orderData)) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-5">
        <Container>
          <div className="text-center max-w-md mx-auto">
            <div className="bg-white p-5 rounded-5 shadow-sm border border-light">
              <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex p-4 mb-4">
                <AlertTriangle size={40} className="text-danger" />
              </div>
              <h3 className="fw-bold mb-3 text-main">Order Not Found</h3>
              <p className="text-muted mb-4 leading-relaxed">
                We couldn't find a shared order matching this secure link. It may have been deleted or the link is incorrect.
              </p>
              <BsButton as={Link} to="/catalog" variant="primary" className="rounded-pill px-5 py-3 fw-bold text-uppercase tracking-widest shadow-sm">
                Browse Our Catalog
              </BsButton>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  if (loading) return null

  if (isExpired) {
    return (
      <div className="shared-checkout-page pt-5 pb-5 bg-light d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', marginTop: '60px' }}>
        <Container>
          <div className="text-center mx-auto" style={{ maxWidth: '500px' }}>
            <div className="bg-danger bg-opacity-10 text-danger p-4 rounded-circle d-inline-flex mb-4">
              <Clock size={48} />
            </div>
            <h2 className="fw-bold text-main mb-3">Link Expired</h2>
            <p className="text-muted mb-4">
              The secure payment window for this shared order has closed. To protect your security and inventory availability, this session can no longer be processed. Please contact the administrator for a new link.
            </p>
            <BsButton 
              variant="primary" 
              className="rounded-pill px-5 py-3 fw-bold text-uppercase tracking-widest shadow-sm"
              onClick={() => navigate('/catalog')}
            >
              Return to Catalog
            </BsButton>
          </div>
        </Container>
      </div>
    )
  }

  const { order, items } = orderData

  return (
    <div className="shared-checkout-page pt-5 pb-5 bg-light" style={{ minHeight: '100vh', marginTop: '60px' }}>
      <Container className="py-4">

        {/* Header & Timer Section */}
        <div className="mb-5 text-center">
          <Badge bg="primary" className="text-uppercase tracking-widest px-3 py-2 rounded-pill mb-3">
            Secure Checkout
          </Badge>
          <h2 className="fw-bold display-6 text-main mb-4">Complete Your Order</h2>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`d-inline-flex align-items-center gap-3 p-3 rounded-pill border border-2 ${isExpired ? 'border-danger' : 'border-warning'}`}
            style={{ backgroundColor: isExpired ? 'rgba(220, 53, 69, 0.1)' : 'rgba(255, 193, 7, 0.1)' }}
          >
            <Clock size={24} className={isExpired ? 'text-danger' : 'text-warning'} />
            <div>
              <span className={`fw-bold fs-5 tracking-widest ${isExpired ? 'text-danger' : 'text-warning text-dark'}`}>
                {isExpired ? 'LINK EXPIRED' : timeLeft}
              </span>
            </div>
          </motion.div>
        </div>

        <Row className="g-5">
          {/* Left Column: Details & Cart */}
          <Col lg={7}>
            <div className="d-flex flex-column gap-4">

              {/* User & Delivery Info */}
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Header className="bg-white border-light p-4 d-flex align-items-center gap-3">
                  <User className="text-primary" size={20} />
                  <h6 className="fw-bold m-0 text-uppercase tracking-widest text-muted">Delivery Details</h6>
                </Card.Header>
                <Card.Body className="p-4 bg-light">
                  <Row className="g-4">
                    <Col sm={6}>
                      <div className="d-flex gap-3">
                        <div className="text-primary mt-1"><User size={18} /></div>
                        <div>
                          <p className="tiny text-uppercase fw-bold text-muted mb-1">Customer Name</p>
                          <p className="fw-bold text-main m-0">{order.full_name || 'N/A'}</p>
                        </div>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="d-flex gap-3">
                        <div className="text-primary mt-1"><Phone size={18} /></div>
                        <div>
                          <p className="tiny text-uppercase fw-bold text-muted mb-1">Contact Phone</p>
                          <p className="fw-bold text-main m-0">{order.whatsapp || 'N/A'}</p>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12}>
                      <div className="d-flex gap-3">
                        <div className="text-primary mt-1"><MapPin size={18} /></div>
                        <div>
                          <p className="tiny text-uppercase fw-bold text-muted mb-1">Delivery Address</p>
                          <p className="fw-bold text-main m-0">
                            {order.address ? `${order.address}, ${order.city}, ${order.state}` : 'Pending Address Configuration'}
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Read-Only Cart */}
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Header className="bg-white border-light p-4 d-flex align-items-center gap-3">
                  <Package className="text-primary" size={20} />
                  <h6 className="fw-bold m-0 text-uppercase tracking-widest text-muted">Order Items ({items.length})</h6>
                </Card.Header>
                <Card.Body className="p-0">
                  {items.map((cartItem, idx) => (
                    <div key={idx} className="d-flex gap-3 p-4 border-bottom border-light align-items-center">
                      <div
                        className="rounded-3 bg-light overflow-hidden"
                        style={{ width: '80px', height: '80px', flexShrink: 0 }}
                      >
                        <img
                          src={cartItem.item.variant_snapshot?.images?.[0] || 'https://via.placeholder.com/80'}
                          alt={cartItem.item.name}
                          className="w-100 h-100 object-fit-cover"
                        />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-bold text-main mb-1">{cartItem.item.name}</h6>
                        <p className="small text-muted mb-2">Variant: {cartItem.item.variant_name}</p>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <Badge bg="light" text="dark" className="border">Qty: {cartItem.item.quantity}</Badge>
                          <span className="fw-bold text-primary">₦{Number(cartItem.item.price).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>

            </div>
          </Col>

          {/* Right Column: Payment & Summary */}
          <Col lg={5}>
            <div className="sticky-top" style={{ top: '100px' }}>
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <Card.Header className="bg-white border-light p-4">
                  <h6 className="fw-bold m-0 text-uppercase tracking-widest text-muted">Order Summary</h6>
                </Card.Header>
                <Card.Body className="p-4 bg-light">
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted fw-bold">Subtotal</span>
                    <span className="fw-bold text-main">₦{subtotal.toLocaleString()}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted fw-bold">Delivery Fee</span>
                      <span className="fw-bold text-main">₦{deliveryFee.toLocaleString()}</span>
                    </div>
                  )}
                  <hr className="border-light my-4" />
                  <div className="d-flex justify-content-between align-items-end">
                    <span className="text-uppercase tracking-widest fw-bold text-muted small">Total</span>
                    <span className="fs-3 fw-bold text-primary">₦{finalTotal.toLocaleString()}</span>
                  </div>
                </Card.Body>
              </Card>

              <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Body className="p-4">
                  <h6 className="fw-bold mb-4 text-uppercase tracking-widest text-muted text-center">Select Payment Method</h6>

                  <div className="d-flex flex-column gap-3 mb-4">
                    <label
                      className={`p-3 border rounded-3 cursor-pointer transition-all ${paymentMethod === 'paystack' ? 'border-primary' : 'border-light bg-light hover-bg-white'}`}
                      style={{ backgroundColor: paymentMethod === 'paystack' ? 'rgba(109, 62, 33, 0.05)' : undefined }}
                      onClick={() => setPaymentMethod('paystack')}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <CreditCard className={paymentMethod === 'paystack' ? 'text-primary' : 'text-muted'} size={24} />
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-1 text-main">Paystack (Instant)</h6>
                          <p className="tiny m-0 text-muted">Card, USSD, Bank Transfer</p>
                        </div>
                        <div className={`rounded-circle border d-flex align-items-center justify-content-center ${paymentMethod === 'paystack' ? 'border-primary bg-primary' : 'border-secondary'}`} style={{ width: '20px', height: '20px' }}>
                          {paymentMethod === 'paystack' && <div className="bg-white rounded-circle" style={{ width: '8px', height: '8px' }} />}
                        </div>
                      </div>
                    </label>

                    <label
                      className={`p-3 border rounded-3 cursor-pointer transition-all ${paymentMethod === 'manual' ? 'border-primary' : 'border-light bg-light hover-bg-white'}`}
                      style={{ backgroundColor: paymentMethod === 'manual' ? 'rgba(109, 62, 33, 0.05)' : undefined }}
                      onClick={() => setPaymentMethod('manual')}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <Landmark className={paymentMethod === 'manual' ? 'text-primary' : 'text-muted'} size={24} />
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-1 text-main">Manual Transfer</h6>
                          <p className="tiny m-0 text-muted">Send to our official account</p>
                        </div>
                        <div className={`rounded-circle border d-flex align-items-center justify-content-center ${paymentMethod === 'manual' ? 'border-primary bg-primary' : 'border-secondary'}`} style={{ width: '20px', height: '20px' }}>
                          {paymentMethod === 'manual' && <div className="bg-white rounded-circle" style={{ width: '8px', height: '8px' }} />}
                        </div>
                      </div>
                    </label>
                  </div>

                  <BsButton
                    variant={isExpired ? 'secondary' : 'primary'}
                    className="w-100 py-3 rounded-pill fw-bold text-uppercase tracking-widest shadow-sm d-flex align-items-center justify-content-center gap-2"
                    onClick={handleCompletePayment}
                    disabled={isExpired}
                  >
                    {isExpired ? 'Link Expired' : 'Complete Payment'} <ShieldCheck size={18} />
                  </BsButton>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Manual Payment Verification Modal */}
      <Modal show={showManualModal} onHide={() => setShowManualModal(false)} backdrop="static" keyboard={false} centered className="manual-payment-modal">
        <Modal.Header closeButton className="border-0 pb-0 text-center justify-content-center pt-4">
          <Modal.Title className="fw-bold text-main">Complete Your Transfer</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <p className="text-main opacity-75 small leading-relaxed mb-4">
            Please transfer the exact amount of <strong className="text-primary fs-5">₦{finalTotal.toLocaleString()}</strong> to the account below.
          </p>
          <div className="bg-light p-4 rounded-4 border border-light mb-4 text-start">
            <h6 className="tiny text-uppercase fw-bold opacity-50 mb-1">Bank Name</h6>
            <p className="fw-bold text-main mb-3">{MANUAL_TRANSFER_DETAILS.bankName}</p>

            <h6 className="tiny text-uppercase fw-bold opacity-50 mb-1">Account Number</h6>
            <p className="fw-bold text-primary fs-3 mb-3 tracking-widest">{MANUAL_TRANSFER_DETAILS.accountNumber}</p>

            <h6 className="tiny text-uppercase fw-bold opacity-50 mb-1">Account Name</h6>
            <p className="fw-bold text-main mb-0">{MANUAL_TRANSFER_DETAILS.accountName}</p>
          </div>
          <p className="tiny opacity-50 fst-italic">Do not close this window until you have successfully made the transfer.</p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 pb-4 px-4 flex-nowrap">
          <BsButton variant="light" className="w-50 rounded-pill fw-bold text-muted hover-opacity-100" onClick={() => setShowManualModal(false)} disabled={confirmingManual}>
            Go Back
          </BsButton>
          <BsButton variant="primary" className="w-50 rounded-pill fw-bold shadow-sm" onClick={handleConfirmManualPayment} disabled={confirmingManual}>
            I've Made Payment
          </BsButton>
        </Modal.Footer>
      </Modal>

    </div>
  )
}
