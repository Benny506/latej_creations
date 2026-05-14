import React, { useState } from 'react'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import { useSelector, useDispatch } from 'react-redux'
import { User, Mail, ShieldCheck, Save, Edit2 } from 'lucide-react'
import { Row, Col, Card, Form, Button } from 'react-bootstrap'
import supabase from '../../utils/supabase'
import { setProfile } from '../../store/slices/authSlice'
import { useAppUi } from '../../context/AppUiContext'

/**
 * ProfilePage Component
 * Orchestrates the high-fidelity display and modification of partner identity.
 * Features specialized view-only and editable manifestations.
 */
const ProfilePage = () => {
  const dispatch = useDispatch()
  const { setGlobalLoading, addAlert } = useAppUi()
  const { user, profile } = useSelector(state => state.auth)

  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!fullName) {
      addAlert('Full name cannot be empty', 'warning')
      return
    }

    setGlobalLoading(true, 'Updating your identity...')
    try {
      const { data, error } = await supabase
        .from('latej_user_profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      dispatch(setProfile(data))
      addAlert('Profile updated successfully!', 'success')
      setIsEditing(false)

    } catch (err) {
      console.error('Update Error:', err.message)
      addAlert('Could not update profile. Please try again.', 'error')
    } finally {
      setGlobalLoading(false)
    }
  }

  return (
    <DashboardLayout
      title="My Identity"
      description="Manage your account details and partner information"
    >
      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-5 overflow-hidden">
            <Card.Header className="bg-white border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold text-main mb-0">Personal Manifest</h5>
              {!isEditing && (
                <Button
                  variant="outline-primary"
                  className="rounded-pill px-4 py-2 tiny fw-bold d-flex align-items-center gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 size={14} /> Edit Identity
                </Button>
              )}
            </Card.Header>
            <Card.Body className="p-4 p-md-5">
              <Form onSubmit={handleUpdate} className="d-flex flex-column gap-4">
                {/* Full Name Manifestation */}
                <Form.Group>
                  <Form.Label className="tiny text-uppercase fw-bold opacity-50 mb-2">Full Name</Form.Label>
                  <div className="position-relative">
                    <User size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-primary opacity-50" />
                    <Form.Control
                      type="text"
                      placeholder="Your heritage name"
                      className={`bg-light border-0 py-3 ps-5 rounded-4 shadow-none fw-bold ${!isEditing && 'opacity-75'}`}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </Form.Group>

                {/* Email Address (View Only Registry) */}
                <Form.Group>
                  <Form.Label className="tiny text-uppercase fw-bold opacity-50 mb-2">Email Address</Form.Label>
                  <div className="position-relative">
                    <Mail size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-primary opacity-50" />
                    <Form.Control
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      disabled
                      className="bg-light border-0 py-3 ps-5 rounded-4 shadow-none fw-bold opacity-50 cursor-not-allowed"
                    />
                  </div>
                  <Form.Text className="tiny opacity-50 fw-bold mt-2">
                    Email address is tied to your heritage identity and cannot be changed.
                  </Form.Text>
                </Form.Group>

                {/* Action Registry */}
                {isEditing && (
                  <div className="d-flex gap-3 mt-3">
                    <Button
                      type="submit"
                      variant="primary"
                      className="rounded-pill px-5 py-3 fw-bold d-flex align-items-center gap-2 border-0 shadow-premium"
                    >
                      <Save size={18} /> Save Changes
                    </Button>
                    <Button
                      variant="light"
                      className="rounded-pill px-5 py-3 fw-bold text-dark opacity-75 hover-opacity-100 border-0 bg-light"
                      onClick={() => {
                        setIsEditing(false)
                        setFullName(profile?.full_name || '')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Status Manifestation Card */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-5 bg-primary text-white p-4 h-100">
            <div className="bg-white/20 p-3 rounded-circle d-inline-flex mb-4" style={{ width: 'fit-content' }}>
              <ShieldCheck size={30} />
            </div>
            <h4 className="fw-bold mb-3 text-light">Account Status</h4>
            <p className="opacity-75 mb-5 leading-relaxed text-light">
              Your account is professionally verified. You have full access to our Retail and Wholesale heritage collections.
            </p>

            <div className="mt-auto">
              <div className="bg-white/10 p-3 rounded-4 border border-white/10">
                <span className="tiny text-uppercase fw-bold opacity-50 tracking-widest d-block mb-1">Registered Since</span>
                <span className="fw-bold">{new Date(profile?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  )
}

export default ProfilePage
