import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, RefreshCcw } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import supabase from '../../utils/supabase'
import { useAppUi } from '../../context/AppUiContext'

/**
 * VerifyOtpPage Component
 * The high-fidelity verification layer for account activation and recovery.
 * Features advanced keyboard interaction for seamless OTP entry.
 */
const VerifyOtpPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setGlobalLoading, addAlert } = useAppUi()
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])
  
  const registrationData = location.state?.registrationData
  const forgotPasswordEmail = location.state?.email
  const flow = location.state?.flow || 'registration'
  
  const targetEmail = flow === 'registration' ? registrationData?.email : forgotPasswordEmail
  const hasSentRef = useRef(false)

  useEffect(() => {
    if (!targetEmail) {
      addAlert('Invalid session. Please start again.', 'error')
      navigate(flow === 'registration' ? '/register' : '/forgot-password')
      return
    }

    if (!hasSentRef.current) {
      sendVerificationCode()
      hasSentRef.current = true
    }
  }, [targetEmail, navigate, flow])

  const sendVerificationCode = async () => {
    setGlobalLoading(true, 'Sending verification code...')
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      
      // 1. Store OTP in the secure registry
      const { error: otpError } = await supabase
        .from('otps')
        .upsert({
          email: targetEmail,
          code: code,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        },
          { onConflict: 'email' }
        )

      if (otpError) throw otpError

      // 2. Invoke the cinematic email delivery narrative
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          to: targetEmail,
          subject: flow === 'registration' ? "Verify your La Tejcreations Account" : "Reset your La Tejcreations Password",
          html: `
            <div style="font-family: sans-serif; padding: 40px; background-color: #fcfaf8;">
              <h1 style="color: #6d3e21;">Verification Code</h1>
              <p>Please use the code below to ${flow === 'registration' ? 'verify your account' : 'reset your password'}:</p>
              <div style="font-size: 40px; font-weight: bold; color: #6d3e21; letter-spacing: 10px; margin: 30px 0;">
                ${code}
              </div>
              <p style="color: #999; font-size: 12px;">This code will expire in 10 minutes.</p>
            </div>
          `
        }
      })

      if (emailError) throw emailError
      addAlert('Verification code sent to your email', 'success')

    } catch (err) {
      console.error('OTP Delivery Error:', err.message)
      addAlert('Could not send verification code', 'error')
    } finally {
      setGlobalLoading(false)
    }
  }

  const handleChange = (element, index) => {
    const value = element.value
    if (isNaN(value)) return false

    const newOtp = [...otp]
    // Only take the last character entered
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)
    
    // Auto-focus next manifestation
    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    // Backspace sequence orchestration
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current is empty, move focus to previous and clear it
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        inputRefs.current[index - 1].focus()
      } else if (otp[index]) {
        // If current has value, just clear it
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 6) {
      addAlert('Please enter the full 6-digit code', 'warning')
      return
    }

    setGlobalLoading(true, 'Verifying code...')
    try {
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-code', {
        body: { email: targetEmail, code: code }
      })

      if (verifyError || !verifyData.success) {
        throw new Error(verifyError?.message || 'Invalid verification code')
      }

      if (flow === 'registration') {
        const { data: userData, error: createError } = await supabase.functions.invoke('create-latej-user', {
          body: {
            email: registrationData.email,
            password: registrationData.password,
            name: registrationData.name
          }
        })
        if (createError) throw createError
        addAlert('Account created successfully! Please sign in.', 'success')
        navigate('/login')
      } else {
        addAlert('Identity verified. Create your new password.', 'success')
        navigate('/reset-password', { state: { email: targetEmail } })
      }

    } catch (err) {
      console.error('Verification Fatal Error:', err.message)
      addAlert(err.message || 'Verification failed', 'error')
    } finally {
      setGlobalLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Security Check" 
      subtitle={`We've sent a 6-digit code to ${targetEmail}. Please enter it below to verify your identity.`}
      backLink={flow === 'registration' ? "/register" : "/forgot-password"}
    >
      <div className="d-flex flex-column gap-5">
        <div className="d-flex justify-content-between gap-2">
          {otp.map((data, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength="1"
              className="form-control text-center py-3 rounded-4 bg-light border-0 fw-bold display-6 shadow-none"
              style={{ width: '15%', height: '80px' }}
              value={data}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onFocus={e => e.target.select()}
            />
          ))}
        </div>

        <div className="text-start">
          <Button 
            onClick={handleVerify}
            variant="primary" 
            className="w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-premium border-0"
          >
            Verify and Continue <ArrowRight size={20} />
          </Button>

          <div className="text-center mt-5">
            <p className="small text-dark opacity-50 fw-bold">
              Didn't get the code? <button onClick={sendVerificationCode} className="btn btn-link p-0 text-primary fw-bold text-decoration-none d-inline-flex align-items-center gap-1"><RefreshCcw size={14} /> Resend Code</button>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default VerifyOtpPage
