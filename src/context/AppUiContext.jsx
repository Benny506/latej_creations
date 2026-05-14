import React, { createContext, useContext, useState, useCallback } from 'react'

const AppUiContext = createContext()

/**
 * AppUiProvider
 * Handles the visual feedback and notifications for the entire site.
 * Designed for clarity and ease of use.
 */
export const AppUiProvider = ({ children }) => {
  const [globalLoading, setGlobalLoadingState] = useState({ show: false, message: '' })
  const [subtleLoading, setSubtleLoadingState] = useState({ show: false, message: '' })
  const [alerts, setAlerts] = useState([])
  const [confirm, setConfirm] = useState({ 
    show: false, 
    title: '', 
    message: '', 
    onConfirm: null,
    variant: 'primary' 
  })
  const [siteContent, setSiteContent] = useState({})

  // Loading Helpers
  const setGlobalLoading = useCallback((show, message = 'Loading...') => {
    setGlobalLoadingState({ show, message })
  }, [])

  const setSubtleLoading = useCallback((show, message = 'Updating...') => {
    setSubtleLoadingState({ show, message })
  }, [])

  // Notification System
  const addAlert = useCallback((message, variant = 'info', title = '') => {
    const id = Date.now() + Math.random()
    setAlerts(prev => [...prev, { id, message, variant, title }])
    
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== id))
    }, 6000)
  }, [])

  const dismissAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }, [])

  // Confirmation Helper
  const askConfirmation = useCallback(({ title, message, onConfirm, variant = 'primary' }) => {
    setConfirm({ show: true, title, message, onConfirm, variant })
  }, [])

  const handleConfirm = useCallback(() => {
    if (confirm.onConfirm) confirm.onConfirm()
    setConfirm(prev => ({ ...prev, show: false }))
  }, [confirm])

  const cancelConfirm = useCallback(() => {
    setConfirm(prev => ({ ...prev, show: false }))
  }, [])

  const value = {
    globalLoading, setGlobalLoading,
    subtleLoading, setSubtleLoading,
    alerts, addAlert, dismissAlert,
    confirm, askConfirmation, handleConfirm, cancelConfirm,
    siteContent, setSiteContent
  }

  return (
    <AppUiContext.Provider value={value}>
      {children}
    </AppUiContext.Provider>
  )
}

export const useAppUi = () => {
  const context = useContext(AppUiContext)
  if (!context) throw new Error('useAppUi must be used within AppUiProvider')
  return context
}
