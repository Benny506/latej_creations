import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Badge, Button, Table, Spinner } from 'react-bootstrap'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Clock,
  MessageSquare,
  HelpCircle,
  ExternalLink
} from 'lucide-react'
import supabase from '../../utils/supabase'
import { useAppUi } from '../../context/AppUiContext'
import { ADMIN_CONFIG } from '../../utils/constants'
import DashboardLayout from '../../components/dashboard/DashboardLayout'

/**
 * OrderDetailsPage Component
 * A high-fidelity discovery manifest for a single partner order.
 * Features item snapshots and administrative concierge contact info.
 */
const OrderDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addAlert } = useAppUi()

  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderDetails()
  }, [id])

  const fetchOrderDetails = async () => {
    setLoading(true)
    try {
      // 1. Fetch Order Header
      const { data: orderData, error: orderError } = await supabase
        .from('latej_orders')
        .select('*')
        .eq('id', id)
        .single()

      if (orderError) throw orderError
      setOrder(orderData)

      // 2. Fetch Order Items (Snapshot Registry)
      const { data: itemsData, error: itemsError } = await supabase
        .from('latej_order_items')
        .select('*')
        .eq('order_id', id)

      if (itemsError) throw itemsError
      setItems(itemsData)
    } catch (err) {
      console.error('Discovery Failure:', err)
      addAlert('Failed to manifest order details.', 'danger')
      navigate('/dashboard/orders')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Manifesting Order...">
        <div className="d-flex flex-column align-items-center justify-content-center py-10">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="fw-bold text-main opacity-50">Discovering order details...</p>
        </div>
      </DashboardLayout>
    )
  }

  const statusColors = {
    unpaid: 'warning',
    processing: 'primary',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger'
  }

  return (
    <DashboardLayout
      title={`Order #${order.order_number || order.id.split('-')[0].toUpperCase()}`}
      description={`Manifested on ${new Date(order.created_at).toLocaleDateString()}`}
    >
      <Button
        variant="link"
        className="text-decoration-none text-main p-0 mb-4 d-flex align-items-center gap-2 opacity-50 hover-opacity-100 transition-all"
        onClick={() => navigate('/dashboard/orders')}
      >
        <ArrowLeft size={18} /> Back to My Orders
      </Button>

      <Row className="g-4">
        {/* Left Column: Order Content */}
        <Col lg={8}>
          {/* Status Manifestation Card */}
          <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
            <Card.Body className="p-4 bg-primary bg-opacity-5">
              <div className="d-flex align-items-center gap-3">
                <div className={`bg-${statusColors[order.status]} p-3 rounded-4 text-white shadow-sm`}>
                  {order.status === 'processing' ? <Clock size={24} /> :
                    order.status === 'shipped' ? <Truck size={24} /> :
                      <ShoppingBag size={24} />}
                </div>
                <div>
                  <h6 className="tiny text-uppercase tracking-widest opacity-50 mb-1 text-light">Procurement Status</h6>
                  <h4 className="fw-bold text-main mb-0 text-uppercase text-light">{order.status}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Order Items Registry */}
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <Card.Header className="bg-white border-0 py-4 px-4">
              <div className="d-flex align-items-center gap-3">
                <ShoppingBag className="text-primary" />
                <h5 className="fw-bold text-main mb-0">Purchased Selection</h5>
              </div>
            </Card.Header>
            <Table responsive borderless hover className="align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="tiny text-uppercase fw-bold text-main opacity-50 px-4 py-3">Item Discovery</th>
                  <th className="tiny text-uppercase fw-bold text-main opacity-50 py-3 text-center">Qty</th>
                  <th className="tiny text-uppercase fw-bold text-main opacity-50 py-3 text-end">Price</th>
                  <th className="tiny text-uppercase fw-bold text-main opacity-50 px-4 py-3 text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-top border-light">
                    <td className="px-4 py-4">
                      <div className="d-flex align-items-center gap-3">
                        {/* Variant Image Manifest from Snapshot */}
                        <div className="position-relative">
                          {(item.variant_snapshot?.images || []).length > 0 ? (
                            <img
                              src={item.variant_snapshot.images[0]}
                              alt={item.name}
                              className="rounded-3 shadow-sm"
                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                              <ShoppingBag size={24} className="opacity-20" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="fw-bold text-main mb-0">{item.name}</p>
                          <p className="tiny text-uppercase fw-bold opacity-50 mb-0">{item.variant_name}</p>
                          <Badge bg="light" className="text-main opacity-50 tiny fw-bold border-0 p-0 mt-1">
                            {item.type === 'retail' ? 'Retail Selection' : 'Wholesale Manifest'}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className="fw-bold text-main">x{item.quantity}</span>
                    </td>
                    <td className="py-4 text-end">
                      <span className="text-main opacity-75 small">₦{Number(item.price).toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-4 text-end">
                      <span className="fw-bold text-main">₦{Number(item.total_price).toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-light bg-opacity-50 border-top border-light">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-end fw-bold tiny text-uppercase opacity-50">Subtotal</td>
                  <td className="px-4 py-3 text-end fw-bold text-main">₦{(Number(order.total_amount) - Number(order.delivery_fee) + Number(order.discount_amount || 0)).toLocaleString()}</td>
                </tr>
                {Number(order.discount_amount) > 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-end fw-bold tiny text-uppercase text-success">Coupon Discount</td>
                    <td className="px-4 py-2 text-end fw-bold text-success">- ₦{Number(order.discount_amount).toLocaleString()}</td>
                  </tr>
                )}
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-end fw-bold tiny text-uppercase opacity-50">Delivery Registry</td>
                  <td className="px-4 py-3 text-end fw-bold text-main">₦{Number(order.delivery_fee).toLocaleString()}</td>
                </tr>
                <tr className="border-top border-secondary border-opacity-10">
                  <td colSpan={3} className="px-4 py-4 text-end fw-bold text-main">TOTAL PROCUREMENT</td>
                  <td className="px-4 py-4 text-end fw-bold text-primary h4 mb-0">₦{Number(order.total_amount).toLocaleString()}</td>
                </tr>
              </tfoot>
            </Table>
          </Card>
        </Col>

        {/* Right Column: Concierge & Logistics */}
        <Col lg={4}>
          {/* Concierge Support Card */}
          <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
            <Card.Header className="bg-primary bg-opacity-5 border-0 py-4 px-4">
              <div className="d-flex align-items-center gap-3">
                <HelpCircle className="text-primary" />
                <h5 className="fw-bold text-main mb-0 text-light">Concierge Support</h5>
              </div>
            </Card.Header>
            <Card.Body className="p-4 pt-4">
              <p className="small text-main opacity-75 mb-4">
                Need assistance with your procurement? Our brand concierge is available for institutional support.
              </p>
              <div className="d-grid gap-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-light p-2 rounded-3 text-primary"><User size={18} /></div>
                  <div>
                    <p className="tiny text-uppercase fw-bold opacity-50 mb-1">Administrative Registry</p>
                    <p className="fw-bold text-main mb-0">{ADMIN_CONFIG.name}</p>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-light p-2 rounded-3 text-primary"><Mail size={18} /></div>
                  <div>
                    <p className="tiny text-uppercase fw-bold opacity-50 mb-1">Email Concierge</p>
                    <a href={`mailto:${ADMIN_CONFIG.email}`} className="fw-bold text-main mb-0 text-decoration-none hover-text-primary transition-all d-flex align-items-center gap-2">
                      {ADMIN_CONFIG.email} <ExternalLink size={14} className="opacity-50" />
                    </a>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-light p-2 rounded-3 text-primary"><Phone size={18} /></div>
                  <div>
                    <p className="tiny text-uppercase fw-bold opacity-50 mb-1">Direct Manifest</p>
                    <a 
                      href={`https://wa.me/${ADMIN_CONFIG.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello La Tejcreations, I have an inquiry about my order: #${order.order_number || order.id.split('-')[0].toUpperCase()}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fw-bold text-main mb-0 text-decoration-none hover-text-primary transition-all d-flex align-items-center gap-2"
                    >
                      {ADMIN_CONFIG.phone} <ExternalLink size={14} className="opacity-50" />
                    </a>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Delivery Logistics Manifest */}
          <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
            <Card.Header className="bg-white border-0 py-4 px-4">
              <div className="d-flex align-items-center gap-3">
                <Truck className="text-primary" />
                <h5 className="fw-bold text-main mb-0">Delivery Manifest</h5>
              </div>
            </Card.Header>
            <Card.Body className="p-4 pt-0">
              <div className="d-grid gap-3">
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-light p-2 rounded-3 text-primary"><MapPin size={18} /></div>
                  <div>
                    <p className="tiny text-uppercase fw-bold opacity-50 mb-1">Destination</p>
                    <p className="fw-bold text-main mb-1">{order.address}</p>
                    <p className="small text-main opacity-75 mb-0">{order.city}, {order.state}</p>
                    <p className="small text-main opacity-75 mb-0">{order.country}</p>
                  </div>
                </div>
                {order.notes && (
                  <div className="d-flex align-items-start gap-3 mt-2">
                    <div className="bg-light p-2 rounded-3 text-primary"><MessageSquare size={18} /></div>
                    <div>
                      <p className="tiny text-uppercase fw-bold opacity-50 mb-1">Manifest Notes</p>
                      <p className="small text-main opacity-75 mb-0 fst-italic">"{order.notes}"</p>
                    </div>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Delivery Tracking (From Admin) */}
          {(order.tracking_id || order.tracking_link || order.admin_notes) && (
            <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
              <Card.Header className="bg-white border-0 py-4 px-4">
                <div className="d-flex align-items-center gap-3">
                  <Truck className="text-primary" />
                  <h5 className="fw-bold text-main mb-0">Delivery Tracking</h5>
                </div>
              </Card.Header>
              <Card.Body className="p-4 pt-0">
                <div className="d-grid gap-3">
                  {order.tracking_id && (
                    <div className="d-flex align-items-start gap-3">
                      <div className="bg-light p-2 rounded-3 text-primary"><MapPin size={18} /></div>
                      <div>
                        <p className="tiny text-uppercase fw-bold opacity-50 mb-1">Tracking ID</p>
                        <p className="fw-bold text-main mb-0 text-break">{order.tracking_id}</p>
                      </div>
                    </div>
                  )}
                  {order.tracking_link && (
                    <div className="d-flex align-items-start gap-3 mt-2">
                      <div className="bg-light p-2 rounded-3 text-primary"><ExternalLink size={18} /></div>
                      <div>
                        <p className="tiny text-uppercase fw-bold opacity-50 mb-1">Tracking Link</p>
                        <a href={order.tracking_link} target="_blank" rel="noopener noreferrer" className="fw-bold text-primary text-break text-decoration-none hover-opacity-75">
                          Track My Order
                        </a>
                      </div>
                    </div>
                  )}
                  {order.admin_notes && (
                    <div className="d-flex align-items-start gap-3 mt-2">
                      <div className="bg-light p-2 rounded-3 text-primary"><MessageSquare size={18} /></div>
                      <div>
                        <p className="tiny text-uppercase fw-bold opacity-50 mb-1">Updates</p>
                        <p className="small text-main mb-0">{order.admin_notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Payment Identity */}
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-main text-white">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <CreditCard size={24} className="text-primary" />
                <h5 className="fw-bold mb-0">Financial Discovery</h5>
              </div>
              <div className="d-grid gap-3">
                <div className="p-3 bg-white bg-opacity-10 rounded-4">
                  <p className="tiny text-uppercase fw-bold opacity-50 mb-1">Transaction Identity</p>
                  <code className="small d-block text-break text-dark">{order.tx_ref || 'VERIFIED_SETTLEMENT'}</code>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>
        {`
          .py-10 { padding-top: 6rem; padding-bottom: 6rem; }
          .hover-text-primary:hover { color: var(--main-color) !important; opacity: 0.8; }
        `}
      </style>
    </DashboardLayout>
  )
}

export default OrderDetailsPage
