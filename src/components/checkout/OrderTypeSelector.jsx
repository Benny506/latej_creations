import React from 'react'
import { Package } from 'lucide-react'

/**
 * OrderTypeSelector Component
 * Responsive mode selector for Retail vs Wholesale.
 */
const OrderTypeSelector = ({ checkoutType, setCheckoutType }) => (
  <div className="bg-white p-4 rounded-5 shadow-premium border border-light">
    <h5 className="fw-bold text-main mb-4 d-flex align-items-center gap-3">
      <Package size={22} className="text-primary flex-shrink-0" />
      What are you buying?
    </h5>
    
    <div className="d-flex gap-2 gap-md-3 bg-light p-2 rounded-pill overflow-hidden">
      <button 
        type="button"
        onClick={() => setCheckoutType('retail')}
        className={`flex-grow-1 btn rounded-pill py-2 py-md-3 fw-bold text-uppercase tracking-widest transition-all ${checkoutType === 'retail' ? 'btn-primary shadow-sm' : 'btn-link text-main opacity-50 text-decoration-none'}`}
        style={{ fontSize: '0.65rem' }}
      >
        Retail
      </button>
      <button 
        type="button"
        onClick={() => setCheckoutType('wholesale')}
        className={`flex-grow-1 btn rounded-pill py-2 py-md-3 fw-bold text-uppercase tracking-widest transition-all ${checkoutType === 'wholesale' ? 'btn-primary shadow-sm' : 'btn-link text-main opacity-50 text-decoration-none'}`}
        style={{ fontSize: '0.65rem' }}
      >
        Wholesale
      </button>
    </div>

    <div className="mt-4 p-3 bg-primary-light rounded-4 border border-primary border-opacity-10">
      <p className="tiny fw-bold text-primary mb-0 leading-relaxed">
        Note: We process Retail and Wholesale orders separately. Right now, you are viewing your <span className="text-uppercase">{checkoutType}</span> items.
      </p>
    </div>
  </div>
)

export default OrderTypeSelector
