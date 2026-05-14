import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

/**
 * ConfirmModal Component
 * A premium-grade, world-class reusable manifestation for high-stakes actions.
 * Features cinematic transitions and high-fidelity visual governance.
 */
const ConfirmModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  description = "This action cannot be undone. Please confirm to proceed.",
  confirmText = "Confirm Action",
  cancelText = "Cancel",
  variant = "primary", // primary, danger, warning
  icon: Icon = AlertTriangle
}) => {
  return (
    <Modal 
      show={show} 
      onHide={onClose} 
      centered 
      backdrop="static"
      className="confirm-modal-wrapper"
      contentClassName="border-0 rounded-5 shadow-premium overflow-hidden"
    >
      <div className="position-relative p-4 p-md-5 text-center">
        {/* Close Interaction */}
        <button 
          onClick={onClose}
          className="btn btn-link position-absolute top-0 end-0 m-3 text-dark opacity-25 hover-opacity-100 transition-all p-2 border-0 shadow-none"
        >
          <X size={20} />
        </button>

        {/* Cinematic Icon Manifestation */}
        <div className={`mx-auto mb-4 bg-${variant}-light text-${variant} rounded-circle d-flex align-items-center justify-content-center shadow-sm`} style={{ width: '80px', height: '80px' }}>
          <Icon size={40} />
        </div>

        {/* Narrative Manifestation */}
        <h3 className="fw-bold mb-3">{title}</h3>
        <p className="text-dark opacity-50 mb-5 leading-relaxed px-md-4">
          {description}
        </p>

        {/* Action Registry */}
        <div className="d-flex flex-column gap-3">
          <Button 
            variant={variant} 
            className="w-100 rounded-pill py-3 fw-bold shadow-sm border-0 transition-all hover-scale-102"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
          <Button 
            variant="light" 
            className="w-100 rounded-pill py-3 fw-bold text-dark opacity-75 hover-opacity-100 border-0 transition-all"
            onClick={onClose}
          >
            {cancelText}
          </Button>
        </div>
      </div>

      <style>
        {`
          .confirm-modal-wrapper .modal-content {
            background: var(--lt-bg-ivory) !important;
          }
          .bg-primary-light { background: rgba(109, 62, 33, 0.1); }
          .bg-danger-light { background: rgba(220, 53, 69, 0.1); }
          .bg-warning-light { background: rgba(255, 193, 7, 0.1); }
          
          .hover-scale-102:hover {
            transform: scale(1.02);
          }
        `}
      </style>
    </Modal>
  )
}

export default ConfirmModal
