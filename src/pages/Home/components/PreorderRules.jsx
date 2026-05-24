import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import { CalendarClock, ArrowRight } from 'lucide-react'
import { fetchPreorderRules } from '../../../store/slices/preorderSlice'
import { useNavigate } from 'react-router-dom'
import PreorderRulesModal from '../../../components/ui/PreorderRulesModal'

const PreorderRules = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showRulesModal, setShowRulesModal] = useState(false)

  const { windows, rules: dbRules } = useSelector(state => state.preorder)
  const activeWindows = (windows || []).filter(w => w.is_active && new Date(w.end_time) > new Date())

  useEffect(() => {
    dispatch(fetchPreorderRules())
  }, [dispatch])

  // Map icons from DB or use fallback
  const rules = (dbRules || []).length > 0 ? dbRules.map(rule => {
    const IconComponent = LucideIcons[rule.icon] || LucideIcons.ShieldCheck
    return {
      ...rule,
      icon: <IconComponent size={32} className="text-primary mb-3" />
    }
  }) : []

  if (rules.length === 0) return null

  const displayRules = rules.slice(0, 3)

  return (
    <section className="py-5" style={{ backgroundColor: '#fff' }}>
      <div className="container py-lg-5">

        {/* Header */}
        <div className="text-center mb-5">
          <span className="text-primary text-uppercase tracking-widest fw-bold small mb-2 d-block">Guidelines</span>
          <h2 className="display-5 text-main mb-4" style={{ fontFamily: 'var(--lt-font-serif)' }}>
            The Pre-order Protocol
          </h2>
          <p className="text-main opacity-75 lead mx-auto" style={{ maxWidth: '700px' }}>
            We occasionally open exclusive pre-order windows for highly anticipated collections. Review our strict guidelines before securing your reservation.
          </p>
        </div>

        {/* Active Windows Banner */}
        {activeWindows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="row justify-content-center mb-5 pb-4"
          >
            <div className="col-12 col-lg-10">
              <div className="p-4 p-md-5 rounded-4 shadow-sm border border-primary position-relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(var(--bs-primary-rgb), 0.05) 0%, rgba(var(--bs-primary-rgb), 0.1) 100%)' }}>
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-4 relative z-1">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-white p-3 rounded-circle shadow-sm text-primary d-flex align-items-center justify-content-center">
                      <CalendarClock size={32} />
                    </div>
                    <div>
                      <h4 className="fw-bold text-main mb-1">Pre-order Windows Open</h4>
                      <p className="mb-0 text-main opacity-75">
                        Active for: {activeWindows.map(w => w.mode).join(' & ')}
                      </p>
                    </div>
                  </div>

                  <div className="text-center text-md-end">
                    <div className="d-flex flex-column gap-2">
                      {activeWindows.map(w => (
                        <div key={w.id} className="small text-main">
                          <span className="fw-bold text-uppercase tracking-widest">{w.mode}:</span> Closes {new Date(w.end_time).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => navigate('/catalog')} className="btn btn-primary rounded-pill fw-bold mt-3 px-4 shadow-sm">
                      Browse Catalogs <ArrowRight size={18} className="ms-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Rules Grid */}
        <div className="row g-4 g-lg-5 justify-content-center pt-3">
          {displayRules.map((rule, idx) => (
            <div key={idx} className="col-12 col-md-4 px-lg-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="h-100 d-flex flex-column p-4 bg-light rounded-4 border"
              >
                <div className="mb-2">
                  {rule.icon}
                </div>
                <h5 className="fw-bold text-main mb-2 tracking-widest">{rule.title}</h5>
                <p
                  className="text-main opacity-75 leading-relaxed mb-0 flex-grow-1"
                  style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {rule.description}
                </p>
              </motion.div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        {rules.length > 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-5"
          >
            <button
              className="btn btn-outline-primary rounded-pill px-5 fw-bold"
              onClick={() => setShowRulesModal(true)}
            >
              View All Guidelines
            </button>
          </motion.div>
        )}

      </div>

      <PreorderRulesModal
        show={showRulesModal}
        onHide={() => setShowRulesModal(false)}
        rules={dbRules}
      />
    </section>
  )
}

export default PreorderRules
