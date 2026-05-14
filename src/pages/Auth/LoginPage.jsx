import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import supabase from '../../utils/supabase'
import { useAppUi } from '../../context/AppUiContext'
import { authBootstrapper } from '../../utils/auth'
import { useDispatch } from 'react-redux'
import { setAuth } from '../../store/slices/authSlice'

/**
 * LoginPage Component
 * The high-fidelity secure entry manifestation for established partners.
 * Features a refined password visibility toggle and manual entry logic.
 */
const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { setGlobalLoading, addAlert } = useAppUi()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      addAlert('Please enter your credentials', 'warning')
      return
    }

    setGlobalLoading(true, 'Authenticating...')
    try {
      // 1. Invoke the secure entry manifestation
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) throw error

      // 2. Synchronize the high-fidelity profile manifestation
      const profile = await authBootstrapper(data.user)

      if (profile) {
        dispatch(setAuth({ user: data.user, profile }))
        addAlert('Welcome back to the heritage!', 'success')
        navigate('/')
      } else {
        // The bootstrapper handles the sign out if profile is missing
        addAlert('Could not provision your profile. Please contact support.', 'error')
      }

    } catch (err) {
      console.error('Authentication Error:', err.message)
      addAlert('Invalid email or password. Please try again.', 'error')
    } finally {
      setGlobalLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to continue your Retail or Wholesale journey with La Tejcreations."
    >
      <Form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
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
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Form.Label className="tiny text-uppercase fw-bold opacity-50 mb-0">Password</Form.Label>
            <Link to="/forgot-password" virtual="true" className="tiny text-primary fw-bold text-decoration-none">Forgot?</Link>
          </div>
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

        {/* Submit Action */}
        <Button 
          type="submit"
          variant="primary" 
          className="w-100 rounded-pill py-3 mt-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-premium border-0"
        >
          Sign In Now <ArrowRight size={20} />
        </Button>

        {/* Redirect Narrative */}
        <div className="text-center mt-4">
          <p className="small text-dark opacity-50 fw-bold">
            New to the family? <Link to="/register" className="text-primary text-decoration-none">Create Account</Link>
          </p>
        </div>
      </Form>
    </AuthLayout>
  )
}

export default LoginPage
