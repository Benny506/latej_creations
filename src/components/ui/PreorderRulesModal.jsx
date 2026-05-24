import React, { useState, useEffect } from 'react'
import { Modal, Button as BsButton, Nav } from 'react-bootstrap'
import * as LucideIcons from 'lucide-react'
import { ShieldCheck } from 'lucide-react'

const PreorderRulesModal = ({ show, onHide, rules, modeFilter }) => {
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (show) {
      setActiveTab(modeFilter || 'all')
    }
  }, [show, modeFilter])

  const applicableRules = (rules || []).filter(r => {
    if (activeTab === 'all') return true
    return r.mode === 'both' || r.mode === activeTab
  })

  return (
    <Modal show={show} onHide={onHide} centered scrollable>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-main d-flex align-items-center gap-2">
          <ShieldCheck className="text-primary" size={24} />
          Pre-order Protocol
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-2">
        <Nav variant="pills" className="latej-modal-tabs mb-4 p-1 bg-light rounded-pill d-flex" style={{ border: '1px solid var(--bs-border-color)' }}>
          <Nav.Item className="flex-fill text-center">
            <Nav.Link
              active={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
              className="rounded-pill tiny fw-bold text-uppercase tracking-widest text-main py-2"
            >
              All Rules
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="flex-fill text-center">
            <Nav.Link
              active={activeTab === 'retail'}
              onClick={() => setActiveTab('retail')}
              className="rounded-pill tiny fw-bold text-uppercase tracking-widest text-main py-2"
            >
              Retail
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="flex-fill text-center">
            <Nav.Link
              active={activeTab === 'wholesale'}
              onClick={() => setActiveTab('wholesale')}
              className="rounded-pill tiny fw-bold text-uppercase tracking-widest text-main py-2"
            >
              Wholesale
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <div className="d-flex flex-column gap-4">
          {applicableRules.map(rule => {
            const IconComponent = LucideIcons[rule.icon] || LucideIcons.ShieldCheck
            return (
              <div key={rule.id} className="d-flex gap-3 bg-light p-3 rounded-4 border">
                <div className="bg-white p-2 rounded-3 shadow-sm h-100 d-flex align-items-center justify-content-center text-primary">
                  <IconComponent size={20} />
                </div>
                <div>
                  <div className="mb-1">
                    <span className="badge bg-primary text-white mb-1" style={{ fontSize: '0.55rem' }}>
                      {rule.mode.toUpperCase()}
                    </span>
                    <h6 className="fw-bold text-main mb-0">{rule.title}</h6>
                  </div>
                  <p className="small text-muted mb-0 lh-sm">{rule.description}</p>
                </div>
              </div>
            )
          })}
          {applicableRules.length === 0 && (
            <p className="text-center text-muted small my-4">No specific pre-order rules apply at this time.</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <BsButton variant="primary" className="w-100 rounded-pill fw-bold" onClick={onHide}>
          I Understand
        </BsButton>
      </Modal.Footer>

      <style>{`
        .latej-modal-tabs .nav-link {
          opacity: 0.6;
          transition: all 0.2s ease;
        }
        .latej-modal-tabs .nav-link.active {
          opacity: 1;
          background-color: var(--lt-primary) !important;
          color: #ffffff !important;
          box-shadow: 0 4px 10px rgba(var(--lt-primary-rgb), 0.3);
        }
        .latej-modal-tabs .nav-link:hover:not(.active) {
          opacity: 0.8;
        }
      `}</style>
    </Modal>
  )
}

export default PreorderRulesModal
