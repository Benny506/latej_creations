import { useState, useEffect } from 'react'

/**
 * useScript Hook
 * Programmatically loads external scripts and tracks their lifecycle.
 * Resolves race conditions and provides diagnostic feedback for SDK failures.
 */
export default function useScript(src) {
  const [status, setStatus] = useState(src ? 'loading' : 'idle')

  useEffect(() => {
    if (!src) {
      setStatus('idle')
      return
    }

    // Check if script already exists
    let script = document.querySelector(`script[src="${src}"]`)

    if (!script) {
      // Create script
      script = document.createElement('script')
      script.src = src
      script.async = true
      script.setAttribute('data-status', 'loading')
      document.head.appendChild(script)

      // Add event listeners
      const setAttributeFromEvent = (event) => {
        script.setAttribute(
          'data-status',
          event.type === 'load' ? 'ready' : 'error'
        )
      }

      script.addEventListener('load', setAttributeFromEvent)
      script.addEventListener('error', setAttributeFromEvent)
    } else {
      // Grab existing script status
      const existingStatus = script.getAttribute('data-status')
      if (existingStatus) {
        setStatus(existingStatus === 'ready' ? 'ready' : 'error')
      }
    }

    // Script event handler to update state
    const setStateFromEvent = (event) => {
      setStatus(event.type === 'load' ? 'ready' : 'error')
    }

    // Add event listeners to the existing or new script
    script.addEventListener('load', setStateFromEvent)
    script.addEventListener('error', setStateFromEvent)

    // Handle cleanup
    return () => {
      if (script) {
        script.removeEventListener('load', setStateFromEvent)
        script.removeEventListener('error', setStateFromEvent)
      }
    }
  }, [src])

  return status
}
