import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

const CheckoutHeader = () => (
  <div className="mb-5 d-flex align-items-center gap-3">
    <Link to="/shop" className="btn btn-white rounded-pill p-2 shadow-sm border-0 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
      <ChevronLeft size={24} />
    </Link>
    <div>
      <h1 className="fw-bold text-main mb-0 fs-3">Finish Your Order</h1>
      <p className="tiny text-uppercase fw-bold opacity-50 tracking-widest mb-0">Secure Checkout</p>
    </div>
  </div>
)

export default CheckoutHeader
