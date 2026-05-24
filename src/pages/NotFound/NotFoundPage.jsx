import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPinOff, ArrowRight, Home } from 'lucide-react'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light text-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-5 rounded-4 shadow-sm"
        style={{ maxWidth: '600px', width: '100%', border: '1px solid rgba(0,0,0,0.05)' }}
      >
        <div className="mb-4 d-flex justify-content-center">
          <div className="bg-light p-4 rounded-circle text-primary">
            <MapPinOff size={64} />
          </div>
        </div>
        
        <h1 className="display-4 fw-bold text-main mb-3" style={{ fontFamily: 'var(--lt-font-serif)' }}>
          404 Not Found
        </h1>
        
        <p className="lead text-main opacity-75 mb-5 mx-auto" style={{ maxWidth: '400px' }}>
          The page you are looking for seems to have been moved, deleted, or never existed in the first place.
        </p>

        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
          <button 
            onClick={() => navigate('/catalog')}
            className="btn btn-primary btn-lg rounded-pill px-4 py-3 fw-bold d-inline-flex align-items-center justify-content-center gap-2 hover-shadow-sm"
          >
            Explore Catalogs <ArrowRight size={20} />
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="btn btn-outline-primary btn-lg rounded-pill px-4 py-3 fw-bold d-inline-flex align-items-center justify-content-center gap-2 hover-shadow-sm"
          >
            <Home size={20} /> Return Home
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage
