import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { errorUtils } from '../utils/performance'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log the error
    errorUtils.logError(error, errorInfo)
  }

  private handleRefresh = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleReportError = () => {
    const { error, errorInfo } = this.state
    const errorReport = {
      error: error?.toString() || 'Unknown error',
      stack: error?.stack || 'No stack trace available',
      componentStack: errorInfo?.componentStack || 'No component stack available',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    // In a real app, send this to your error reporting service
    console.log('Error Report:', errorReport)
    
    // For now, copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => {
        alert('Error report copied to clipboard. Please send this to support.')
      })
      .catch(() => {
        alert('Could not copy error report. Please check the browser console.')
      })
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full card p-8 text-center"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/30 mb-6"
            >
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </motion.div>

            {/* Error Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-4"
            >
              Oops! Something went wrong
            </motion.h1>

            {/* Error Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-slate-300 mb-8 text-lg leading-relaxed"
            >
              We're sorry, but something unexpected happened. Our team has been notified and is working to fix the issue.
            </motion.p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8 p-4 bg-slate-800/50 rounded-xl border border-red-500/20 text-left"
              >
                <h3 className="text-red-400 font-semibold mb-2 flex items-center">
                  <Bug className="w-4 h-4 mr-2" />
                  Error Details (Development Mode)
                </h3>
                <div className="text-sm text-slate-300 font-mono break-all">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-blue-400 hover:text-blue-300">
                        View Stack Trace
                      </summary>
                      <pre className="mt-2 text-xs bg-slate-900 p-2 rounded overflow-x-auto">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                onClick={this.handleRefresh}
                className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2 min-w-[160px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh Page</span>
              </motion.button>

              <motion.button
                onClick={this.handleGoHome}
                className="btn-secondary px-6 py-3 rounded-xl flex items-center space-x-2 min-w-[160px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-5 h-5" />
                <span>Go to Home</span>
              </motion.button>

              {process.env.NODE_ENV === 'development' && (
                <motion.button
                  onClick={this.handleReportError}
                  className="text-slate-400 hover:text-white transition-colors text-sm underline"
                  whileHover={{ scale: 1.05 }}
                >
                  Copy Error Report
                </motion.button>
              )}
            </motion.div>

            {/* Help Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 pt-6 border-t border-slate-700"
            >
              <p className="text-slate-400 text-sm">
                If the problem persists, please contact support at{' '}
                <a 
                  href="mailto:support@acadmate.com" 
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  support@acadmate.com
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}

// Hook for error handling in functional components
export const useErrorHandler = () => {
  const handleError = (error: Error, errorInfo?: any) => {
    errorUtils.logError(error, errorInfo)
    
    // In a real app, you might want to show a toast notification
    // or trigger a global error state
    console.error('Handled error:', error)
  }

  return { handleError }
}

export default ErrorBoundary