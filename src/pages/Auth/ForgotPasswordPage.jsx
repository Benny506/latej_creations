import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Mail, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import supabase from '../../utils/supabase'
import { useAppUi } from '../../context/AppUiContext'

/**
 * ForgotPasswordPage Component
 * The entry point for account recovery narratives.
 * Features identity verification before proceeding to verification.
 */
const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const { setGlobalLoading, addAlert } = useAppUi()
  const [email, setEmail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      addAlert('Please enter your email address', 'warning')
      return
    }

    setGlobalLoading(true, 'Verifying account...')
    try {
      // 1. Verify if user exists in the heritage
      const { data: exists, error: existsError } = await supabase
        .rpc('user_exists', { input_email: email })

      if (existsError) throw existsError

      if (!exists) {
        addAlert('This account is not registered in our heritage.', 'error')
        return
      }

      // 2. Proceed to verification manifestation
      addAlert('Account found. Let\'s verify your identity.', 'success')
      navigate('/verify-otp', { state: { email, flow: 'forgot-password' } })

    } catch (err) {
      console.error('Recovery Error:', err.message)
      addAlert('Could not verify account. Please try again.', 'error')
    } finally {
      setGlobalLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Lost Access?" 
      subtitle="Enter your email below and we'll send you instructions to reset your password."
      backLink="/login"
    >
      <Form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
        {/* Email Address */}
        <Form.Group>
          <Form.Label className="tiny text-uppercase fw-bold opacity-50 mb-2">Email Address</Form.Label>
          <div className="position-relative">
            <Mail size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-primary opacity-50" />
            <Form.Control 
              type="email" 
              placeholder="name@example.com" 
              className="bg-light border-0 py-3 ps-5 rounded-4 shadow-none fw-bold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </Form.Group>

        {/* Submit Action */}
        <Button 
          type="submit"
          variant="primary" 
          className="w-100 rounded-pill py-3 mt-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-premium border-0"
        >
          Verify Email <ArrowRight size={20} />
        </Button>
      </Form>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
