import React from 'react'
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap'
import { Package, Truck, CreditCard, Calendar, Hash, MapPin, User, ChevronRight } from 'lucide-react'

/**
 * OrderDetailsModal Component
 * Orchestrates the high-fidelity manifestation of full procurement details.
 */
const OrderDetailsModal = ({ show, onHide, order }) => {
  if (!order) return null

  const getStatusBadge = (status) => {
    switch (status) {
      case 'processing': return <Badge bg="primary-light" className="text-primary rounded-pill px-3 py-2 tiny text-uppercase tracking-tighter">Processing</Badge>
      case 'shipped': return <Badge bg="info-light" className="text-info rounded-pill px-3 py-2 tiny text-uppercase tracking-tighter">In Transit</Badge>
      case 'delivered': return <Badge bg="success-light" className="text-success rounded-pill px-3 py-2 tiny text-uppercase tracking-tighter">Delivered</Badge>
      default: return <Badge bg="light" className="text-dark rounded-pill px-3 py-2 tiny text-uppercase tracking-tighter">{status}</Badge>
    }
  }

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered 
      contentClassName="rounded-5 border-0 shadow-premium overflow-hidden"
    >
      <Modal.Header closeButton className="border-0 p-4 bg-light">
        <Modal.Title className="tiny text-uppercase tracking-widest fw-bold opacity-50">Procurement Manifest Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="d-flex flex-column">
          {/* Header Summary */}
          <div className="p-4 bg-white border-bottom">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h4 className="fw-bold mb-1">Order #{order.id.split('-')[0].toUpperCase()}</h4>
                <div className="d-flex align-items-center gap-3 opacity-50 tiny fw-bold text-uppercase tracking-tighter">
                   <span className="d-flex align-items-center gap-1"><Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}</span>
                   <span className="d-flex align-items-center gap-1"><Hash size={14} /> {order.type}</span>
                </div>
              </div>
              {getStatusBadge(order.status)}
            </div>
          </div>

          <Row className="g-0">
            {/* Items Discovery Section */}
            <Col lg={7} className="p-4 border-end">
              <h6 className="tiny text-uppercase fw-bold tracking-widest opacity-50 mb-4 d-flex align-items-center gap-2">
                <Package size={16} /> Heritage Selection
              </h6>
              <div className="d-flex flex-column gap-3 mb-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="d-flex align-items-center justify-content-between p-3 bg-light rounded-4">
                    <div>
                      <h6 className="fw-bold mb-1 tiny">{item.name}</h6>
                      <span className="tiny opacity-50">{item.variant_name} x {item.quantity}</span>
                    </div>
                    <span className="fw-bold text-primary tiny">₦{item.total_price.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="bg-light rounded-4 p-4">
                <div className="d-flex justify-content-between mb-2 opacity-50 tiny fw-bold text-uppercase tracking-tighter">
                  <span>Subtotal</span>
                  <span>₦{(order.total_amount - order.delivery_fee).toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 opacity-50 tiny fw-bold text-uppercase tracking-tighter">
                  <span>Delivery Fee</span>
                  <span>₦{order.delivery_fee.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between pt-3 border-top">
                  <span className="fw-bold text-uppercase tracking-widest tiny">Total Amount Paid</span>
                  <span className="fw-bold text-primary h5 mb-0">₦{order.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </Col>

            {/* Logistics & Payment Manifest Section */}
            <Col lg={5} className="p-4 bg-light bg-opacity-50">
              <div className="d-flex flex-column gap-5">
                {/* Logistics Registry */}
                <div>
                  <h6 className="tiny text-uppercase fw-bold tracking-widest opacity-50 mb-3 d-flex align-items-center gap-2">
                    <Truck size={16} /> Delivery Registry
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex gap-2">
                      <User size={14} className="opacity-25 mt-1" />
                      <div className="tiny fw-bold">{order.full_name}</div>
                    </div>
                    <div className="d-flex gap-2">
                      <MapPin size={14} className="opacity-25 mt-1" />
                      <div className="tiny opacity-75">
                        {order.address},<br />
                        {order.city}, {order.state},<br />
                        {order.country}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Audit Registry */}
                <div>
                  <h6 className="tiny text-uppercase fw-bold tracking-widest opacity-50 mb-3 d-flex align-items-center gap-2">
                    <CreditCard size={16} /> Payment Manifest
                  </h6>
                  <div className="d-flex flex-column gap-2 bg-white p-3 rounded-4 border">
                    <div className="tiny d-flex justify-content-between">
                      <span className="opacity-50">Reference:</span>
                      <span className="fw-bold">{order.tx_ref?.split('-')[0]}...</span>
                    </div>
                    <div className="tiny d-flex justify-content-between">
                      <span className="opacity-50">Gateway:</span>
                      <span className="fw-bold">Flutterwave</span>
                    </div>
                    <div className="tiny d-flex justify-content-between">
                      <span className="opacity-50">Status:</span>
                      <span className="text-success fw-bold">Verified</span>
                    </div>
                  </div>
                </div>

                {/* Additional Notes Discovery */}
                {order.notes && (
                  <div>
                    <h6 className="tiny text-uppercase fw-bold tracking-widest opacity-50 mb-2">Partner Notes</h6>
                    <p className="tiny opacity-75 mb-0 leading-relaxed italic">"{order.notes}"</p>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 p-4">
        <Button variant="light" onClick={onHide} className="rounded-pill px-4 tiny fw-bold text-uppercase tracking-widest">
          Close Registry
        </Button>
      </Modal.Footer>

      <style>
        {`
          .bg-primary-light { background: rgba(109, 62, 33, 0.05); }
          .bg-info-light { background: rgba(13, 202, 240, 0.05); }
          .bg-success-light { background: rgba(25, 135, 84, 0.05); }
        `}
      </style>
    </Modal>
  )
}

export default OrderDetailsModal
