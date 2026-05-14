import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import supabase from '../../utils/supabase'
import { useAppUi } from '../../context/AppUiContext'

/**
 * ResetPasswordPage Component
 * The world-class completion of the recovery narrative.
 */
const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setGlobalLoading, addAlert } = useAppUi()
  
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })

  const email = location.state?.email

  useEffect(() => {
    if (!email) {
      addAlert('Invalid session. Please start again.', 'error')
      navigate('/forgot-password')
    }
  }, [email, navigate, addAlert])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.password || !formData.confirmPassword) {
      addAlert('Please fill in all fields', 'warning')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      addAlert('Passwords do not match', 'error')
      return
    }

    if (formData.password.length < 8) {
      addAlert('Password must be at least 8 characters', 'warning')
      return
    }

    setGlobalLoading(true, 'Updating your security...')
    try {
      // 1. Invoke the reset-password edge function
      const { data, error } = await supabase.functions.invoke('reset-password', {
        body: { email, new_password: formData.password }
      })

      if (error) throw error

      addAlert('Password updated successfully. You can now sign in.', 'success')
      navigate('/login')

    } catch (err) {
      console.error('Reset Fatal Error:', err.message)
      addAlert('Could not update password. Please try again.', 'error')
    } finally {
      setGlobalLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="New Password" 
      subtitle="Create a strong, unique password to secure your account."
      backLink="/login"
    >
      <Form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
        {/* New Password */}
        <Form.Group>
          <Form.Label className="tiny text-uppercase fw-bold opacity-50 mb-2">New Password</Form.Label>
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
        </Form.Group>

        {/* Confirm Password */}
        <Form.Group>
          <Form.Label className="tiny text-uppercase fw-bold opacity-50 mb-2">Confirm New Password</Form.Label>
          <div className="position-relative">
            <Lock size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-primary opacity-50" />
            <Form.Control 
              name="confirmPassword"
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              className="bg-light border-0 py-3 ps-5 pe-5 rounded-4 shadow-none fw-bold"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </Form.Group>

        {/* Submit Action */}
        <Button 
          type="submit"
          variant="primary" 
          className="w-100 rounded-pill py-3 mt-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-premium border-0"
        >
          Update Password <ArrowRight size={20} />
        </Button>
      </Form>
    </AuthLayout>
  )
}

export default ResetPasswordPage
