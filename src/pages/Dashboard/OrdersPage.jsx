import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import { Package, Search, ChevronRight, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react'
import { Row, Col, Card, Badge, Form, InputGroup, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchLatejOrdersThunk } from '../../store/slices/latejOrderSlice'
import { useAppUi } from '../../context/AppUiContext'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * OrdersPage Component
 * Orchestrates the high-fidelity display of partner procurement history.
 * Features specialized filtering and status manifestations.
 */
const OrdersPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { setSubtleLoading } = useAppUi()
  const { orders, isInitialized, isLoading } = useSelector(state => state.latejOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  
  const handleOpenDetails = (order) => {
    navigate(`/dashboard/orders/${order.id}`)
  }

  useEffect(() => {
    const refreshOrders = async () => {
      setSubtleLoading(true, 'Syncing your procurement history...')
      try {
        await dispatch(fetchLatejOrdersThunk()).unwrap()
      } catch (err) {
        console.error('Order Sync Fallout:', err)
      } finally {
        setSubtleLoading(false)
      }
    }

    refreshOrders()
  }, [dispatch, setSubtleLoading])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'unpaid': return <Badge bg="light" className="text-dark border rounded-pill px-3 py-2 tiny text-uppercase tracking-tighter d-flex align-items-center gap-2"><Clock size={12} /> Pending Payment</Badge>
      case 'processing': return <Badge bg="primary-light" className="text-primary rounded-pill px-3 py-2 tiny text-uppercase tracking-tighter d-flex align-items-center gap-2"><CheckCircle2 size={12} /> Processing</Badge>
      case 'shipped': return <Badge bg="info-light" className="text-info rounded-pill px-3 py-2 tiny text-uppercase tracking-tighter d-flex align-items-center gap-2"><Truck size={12} /> In Transit</Badge>
      case 'delivered': return <Badge bg="success-light" className="text-success rounded-pill px-3 py-2 tiny text-uppercase tracking-tighter d-flex align-items-center gap-2"><CheckCircle2 size={12} /> Delivered</Badge>
      default: return <Badge bg="light" className="text-dark rounded-pill px-3 py-2 tiny text-uppercase tracking-tighter">{status}</Badge>
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout 
      title="My Procurement Orders" 
      description="Track and manage your heritage collection purchases"
    >
      <div className="d-flex flex-column gap-4">
        {/* Filters Registry */}
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Card.Body className="p-4">
            <Row className="g-3 align-items-center">
              <Col md={9}>
                <InputGroup className="bg-light rounded-pill px-3 py-1 border">
                  <InputGroup.Text className="bg-transparent border-0 opacity-50">
                    <Search size={18} />
                  </InputGroup.Text>
                  <Form.Control 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by order ID or name..." 
                    className="bg-transparent border-0 shadow-none fw-bold tiny"
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <Form.Select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-pill bg-light border py-2 tiny fw-bold shadow-none"
                >
                  <option>All</option>
                  <option>Unpaid</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Orders Manifestation */}
        {!isInitialized && isLoading ? (
           <div className="text-center py-5 opacity-50">
              <h6 className="tiny text-uppercase tracking-widest fw-bold">Initializing Discovery...</h6>
           </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-5">
            <div className="bg-light text-primary rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px', opacity: 0.5 }}>
              <Package size={40} />
            </div>
            <h4 className="fw-bold mb-2">No orders found</h4>
            <p className="text-dark opacity-50 mb-0">Your procurement history will manifest here once orders are confirmed.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            <AnimatePresence>
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="border-0 shadow-premium-sm rounded-4 overflow-hidden hover-scale-101 transition-all">
                    <Card.Body className="p-4">
                      <Row className="align-items-center g-4">
                        <Col lg={4}>
                          <div className="d-flex flex-column gap-1">
                            <span className="tiny text-uppercase tracking-widest opacity-50 fw-bold">Order Manifest</span>
                            <h6 className="fw-bold mb-0">#{order.id.split('-')[0].toUpperCase()}</h6>
                            <span className="tiny opacity-50">{new Date(order.created_at).toLocaleDateString('en-GB', { dateStyle: 'long' })}</span>
                          </div>
                        </Col>
                        <Col lg={3}>
                          <div className="d-flex flex-column gap-1">
                            <span className="tiny text-uppercase tracking-widest opacity-50 fw-bold">Amount</span>
                            <h6 className="fw-bold text-primary mb-0">₦{order.total_amount.toLocaleString()}</h6>
                            <span className="tiny opacity-50">{order.items?.length || 0} Selection(s)</span>
                          </div>
                        </Col>
                        <Col lg={3}>
                          <div className="d-flex flex-column gap-2 align-items-lg-start">
                            <span className="tiny text-uppercase tracking-widest opacity-50 fw-bold">Discovery Status</span>
                            {getStatusBadge(order.status)}
                          </div>
                        </Col>
                        <Col lg={2} className="text-lg-end">
                          <Button 
                            variant="link" 
                            onClick={() => handleOpenDetails(order)}
                            className="text-primary p-0 shadow-none text-decoration-none d-flex align-items-center gap-2 justify-content-lg-end w-100"
                          >
                             <span className="tiny fw-bold text-uppercase tracking-widest">Details</span>
                             <ChevronRight size={16} />
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <style>
        {`
          .shadow-premium-sm {
            box-shadow: 0 10px 30px rgba(109, 62, 33, 0.05);
          }
          .hover-scale-101:hover {
            transform: scale(1.01);
          }
          .bg-primary-light { background: rgba(109, 62, 33, 0.05); }
          .bg-info-light { background: rgba(13, 202, 240, 0.05); }
          .bg-success-light { background: rgba(25, 135, 84, 0.05); }
        `}
      </style>
    </DashboardLayout>
  )
}

export default OrdersPage
