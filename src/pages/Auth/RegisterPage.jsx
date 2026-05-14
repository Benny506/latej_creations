import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import supabase from '../../utils/supabase'
import { useAppUi } from '../../context/AppUiContext'

/**
 * RegisterPage Component
 * The world-class entry point for new Retail and Wholesale partners.
 * Features a high-fidelity password visibility toggle and existence verification logic.
 */
const RegisterPage = () => {
  const navigate = useNavigate()
  const { setGlobalLoading, addAlert } = useAppUi()
  
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.password) {
      addAlert('Please fill in all fields', 'warning')
      return
    }

    if (formData.password.length < 8) {
      addAlert('Password must be at least 8 characters', 'warning')
      return
    }

    setGlobalLoading(true, 'Checking identity...')
    try {
      // 1. Verify if user already exists in the heritage
      const { data: exists, error: existsError } = await supabase
        .rpc('user_exists', { input_email: formData.email })

      if (existsError) throw existsError

      if (exists) {
        addAlert('An account with this email already exists', 'error')
        return
      }

      // 2. Proceed to verification manifestation
      addAlert('Identity valid. Let\'s verify your email.', 'success')
      navigate('/verify-otp', { state: { registrationData: formData } })

    } catch (err) {
      console.error('Registry Error:', err.message)
      addAlert('Could not verify identity. Please try again.', 'error')
    } finally {
      setGlobalLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Join the Heritage" 
      subtitle="Create your account to start your Retail or Wholesale journey."
    >
      <Form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
        {/* Full Name */}
        <Form.Group>
          <Form.Label className="tiny text-uppercase fw-bold opacity-50 mb-2">Full Name</Form.Label>
          <div className="position-relative">
            <User size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-primary opacity-50" />
            <Form.Control 
              name="name"
              type="text" 
              placeholder="Enter your name" 
              className="bg-light border-0 py-3 ps-5 rounded-4 shadow-none fw-bold"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        </Form.Group>

        {/* Email Address */}
        <Form.Group>
          <Form.Label className="tiny text-uppercase fw-bold opacity-50 mb-2">Email Address</Form.Label>
          <div className="position-relative">
            <Mail size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-primary opacity-50" />
            <Form.Control 
              name="email"
              type="email" 
              placeholder="name@example.com" 
              className="bg-light border-0 py-3 ps-5 rounded-4 shadow-none fw-bold"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </Form.Group>

        {/* Password */}
        <Form.Group>
          <Form.Label className="tiny text-uppercase fw-bold opacity-50 mb-2">Password</Form.Label>
          <div className="position-relative">
            <Lock size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-primary opacity-50" />
            <Form.Control 
              name="password"
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              className="bg-light border-0 py-3 ps-5 pe-5 rounded-4 shadow-none fw-bold"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-primary opacity-50 hover-opacity-100 transition-all p-2 border-0 shadow-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <Form.Text className="tiny opacity-50 fw-bold mt-2 d-block">
             Must be at least 8 characters.
          </Form.Text>
        </Form.Group>

        {/* Submit Action */}
        <Button 
          type="submit"
          variant="primary" 
          className="w-100 rounded-pill py-3 mt-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-premium border-0"
        >
          Create Account <ArrowRight size={20} />
        </Button>

        {/* Redirect Narrative */}
        <div className="text-center mt-4">
          <p className="small text-dark text-center opacity-50 fw-bold">
            Already part of the family? <Link to="/login" className="text-primary text-decoration-none">Sign In</Link>
          </p>
        </div>
      </Form>
    </AuthLayout>
  )
}

export default RegisterPage
