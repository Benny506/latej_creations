import React from 'react'
import { AlertOctagon, RotateCcw } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("ErrorBoundary caught an error", error, errorInfo)
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light p-4 text-center">
          <div className="bg-white p-5 rounded-4 shadow-sm border border-danger border-opacity-25" style={{ maxWidth: '600px', width: '100%' }}>
            <AlertOctagon size={64} className="text-danger mb-4" />
            <h1 className="display-6 fw-bold text-main mb-3" style={{ fontFamily: 'var(--lt-font-serif)' }}>
              Something went wrong.
            </h1>
            <p className="lead text-main opacity-75 mb-4">
              We've encountered an unexpected error. Our systems have logged the issue and we are looking into it.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="text-start bg-light p-3 rounded-3 mb-4 overflow-auto border" style={{ maxHeight: '200px' }}>
                <pre className="text-danger small mb-0">
                  {this.state.error.toString()}
                </pre>
                <pre className="text-muted small mt-2 mb-0">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}

            <button 
              onClick={() => window.location.href = '/'}
              className="btn btn-primary rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-2 hover-shadow-sm"
            >
              <RotateCcw size={20} />
              Return to Homepage
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
