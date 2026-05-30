import React from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import { MapPin, User, Phone, Mail, Globe } from 'lucide-react'

const DeliveryForm = ({ formData, setFormData, deliveryOptions, selectedDeliveryId, setSelectedDeliveryId, deliveryFee }) => (
  <div className="bg-white p-4 p-md-5 rounded-5 shadow-premium border border-light">
    <h5 className="fw-bold text-main mb-5 d-flex align-items-center gap-3">
      <MapPin size={22} className="text-primary" />
      Delivery Details
    </h5>
    
    <div className="d-flex flex-column gap-4">
      <Row className="g-4">
        <Col md={12}>
          <Form.Group>
            <Form.Label className="tiny text-uppercase fw-bold opacity-50 mb-2 tracking-widest">Full Name</Form.Label>
            <div className="bg-light p-3 rounded-4 d-flex align-items-center gap-3 border border-light">
              <User size={18} className="opacity-25" />
              <Form.Control
                required
                placeholder="e.g. John Doe"
                className="bg-transparent border-0 p-0 shadow-none fw-bold"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label className="tiny text-uppercase fw-bold opacity-50 mb-2 tracking-widest">Email Address</Form.Label>
            <div className="bg-light p-3 rounded-4 d-flex align-items-center gap-3 border border-light">
              <Mail size={18} className="opacity-25" />
              <Form.Control
                required
                type="email"
                placeholder="john@example.com"
                className="bg-transparent border-0 p-0 shadow-none fw-bold"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label className="tiny text-uppercase fw-bold opacity-50 mb-2 tracking-widest">WhatsApp Number</Form.Label>
            <div className="bg-light p-3 rounded-4 d-flex align-items-center gap-3 border border-light">
              <Phone size={18} className="opacity-25" />
              <Form.Control
                required
                placeholder="+234..."
                className="bg-transparent border-0 p-0 shadow-none fw-bold"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              />
            </div>
          </Form.Group>
        </Col>

        <Col md={12}>
          <Form.Group>
            <Form.Label className="tiny text-uppercase fw-bold opacity-50 mb-2 tracking-widest">Select Your Area</Form.Label>
            <div className="bg-light p-3 rounded-4 d-flex align-items-center gap-3 border border-light">
              <MapPin size={18} className="opacity-25" />
              <Form.Select
                required
                className="bg-transparent border-0 p-0 shadow-none fw-bold"
                value={selectedDeliveryId}
                onChange={(e) => setSelectedDeliveryId(e.target.value)}
              >
                <option value="">Choose where to deliver...</option>
                {deliveryOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.location_name}</option>
                ))}
              </Form.Select>
            </div>
            {selectedDeliveryId && (
              <div className="mt-2 px-3 py-2 bg-white rounded-pill border border-light d-inline-flex align-items-center gap-2">
                 <span className="tiny fw-bold text-primary">Delivery Fee: ₦{(Number(deliveryFee) || 0).toLocaleString()}</span>
              </div>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label className="tiny text-uppercase fw-bold opacity-50 mb-2 tracking-widest">Country</Form.Label>
            <div className="bg-light p-3 rounded-4 d-flex align-items-center gap-3 border border-light">
              <Globe size={18} className="opacity-25" />
              <Form.Control
                required
                placeholder="e.g. Nigeria"
                className="bg-transparent border-0 p-0 shadow-none fw-bold"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label className="tiny text-uppercase fw-bold opacity-50 mb-2 tracking-widest">City</Form.Label>
            <div className="bg-light p-3 rounded-4 border border-light">
              <Form.Control
                required
                placeholder="e.g. Ikeja"
                className="bg-transparent border-0 p-0 shadow-none fw-bold"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </Form.Group>
        </Col>

        <Col md={12}>
          <Form.Group>
            <Form.Label className="tiny text-uppercase fw-bold opacity-50 mb-2 tracking-widest">Your Home Address</Form.Label>
            <div className="bg-light p-3 rounded-4 border border-light">
              <Form.Control
                as="textarea"
                rows={3}
                required
                placeholder="House No, Street Name..."
                className="bg-transparent border-0 p-0 shadow-none fw-bold"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </Form.Group>
        </Col>
      </Row>
    </div>
  </div>
)

export default DeliveryForm
