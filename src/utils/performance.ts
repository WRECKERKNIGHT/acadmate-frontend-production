// Performance and Security Optimization Utilities

// Performance monitoring and optimization
export const performanceUtils = {
  // Debounce function to limit API calls
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  },

  // Throttle function for scroll events
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout | null = null
    let lastExecTime = 0
    return (...args: Parameters<T>) => {
      const currentTime = Date.now()
      
      if (currentTime - lastExecTime > delay) {
        func.apply(null, args)
        lastExecTime = currentTime
      } else if (!timeoutId) {
        timeoutId = setTimeout(() => {
          func.apply(null, args)
          lastExecTime = Date.now()
          timeoutId = null
        }, delay - (currentTime - lastExecTime))
      }
    }
  },

  // Lazy loading for images
  lazyLoadImage: (img: HTMLImageElement, src: string) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement
          image.src = src
          image.classList.remove('loading')
          observer.unobserve(image)
        }
      })
    })
    observer.observe(img)
  },

  // Memory usage monitoring
  measureMemory: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      }
    }
    return null
  },

  // Performance measurement
  measure: (name: string, fn: () => void) => {
    const startTime = performance.now()
    fn()
    const endTime = performance.now()
    console.log(`${name} took ${endTime - startTime} milliseconds`)
  },

  // Cache management
  cache: new Map<string, { data: any; timestamp: number; ttl: number }>(),
  
  setCache: (key: string, data: any, ttl: number = 5 * 60 * 1000) => { // 5 minutes default
    performanceUtils.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  },

  getCache: (key: string) => {
    const cached = performanceUtils.cache.get(key)
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      performanceUtils.cache.delete(key)
      return null
    }
    
    return cached.data
  },

  clearCache: (key?: string) => {
    if (key) {
      performanceUtils.cache.delete(key)
    } else {
      performanceUtils.cache.clear()
    }
  }
}

// Security utilities
export const securityUtils = {
  // XSS protection
  sanitizeHTML: (str: string): string => {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Password strength validation
  validatePassword: (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    
    const score = Object.values(checks).filter(Boolean).length
    let strength = 'weak'
    if (score >= 4) strength = 'strong'
    else if (score >= 3) strength = 'medium'
    
    return {
      isValid: score >= 3,
      strength,
      checks
    }
  },

  // Rate limiting for API calls
  rateLimiter: new Map<string, { count: number; resetTime: number }>(),
  
  checkRateLimit: (key: string, limit: number = 10, window: number = 60000): boolean => {
    const now = Date.now()
    const record = securityUtils.rateLimiter.get(key)
    
    if (!record || now > record.resetTime) {
      securityUtils.rateLimiter.set(key, { count: 1, resetTime: now + window })
      return true
    }
    
    if (record.count >= limit) {
      return false
    }
    
    record.count++
    return true
  },

  // Session management
  getSessionToken: (): string | null => {
    return localStorage.getItem('acadmate_token')
  },

  setSessionToken: (token: string): void => {
    localStorage.setItem('acadmate_token', token)
  },

  removeSessionToken: (): void => {
    localStorage.removeItem('acadmate_token')
    localStorage.removeItem('acadmate_user')
  },

  // Token validation
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  },

  // Generate random string for CSRF protection
  generateRandomString: (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  // Input validation
  validateInput: (input: string, type: 'text' | 'email' | 'number' | 'phone' = 'text'): boolean => {
    const patterns = {
      text: /^[a-zA-Z\s]{2,50}$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      number: /^\d+$/,
      phone: /^\+?[\d\s\-\(\)]{10,15}$/
    }
    
    return patterns[type]?.test(input) || false
  }
}

// Component optimization helpers
export const componentUtils = {
  // Memoization helper
  createMemoizedComponent: <T>(component: React.ComponentType<T>) => {
    return React.memo(component)
  },

  // Virtual scrolling utility
  calculateVirtualItems: (
    itemCount: number,
    itemHeight: number,
    containerHeight: number,
    scrollTop: number
  ) => {
    const visibleStart = Math.floor(scrollTop / itemHeight)
    const visibleEnd = Math.min(
      itemCount - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight)
    )
    
    const offsetY = visibleStart * itemHeight
    const visibleItems = []
    
    for (let i = visibleStart; i <= visibleEnd; i++) {
      visibleItems.push({
        index: i,
        offsetTop: i * itemHeight - offsetY
      })
    }
    
    return {
      visibleItems,
      offsetY,
      totalHeight: itemCount * itemHeight
    }
  }
}

// Error handling and logging
export const errorUtils = {
  // Error boundary logging
  logError: (error: Error, errorInfo: any) => {
    console.error('Application Error:', error)
    console.error('Error Info:', errorInfo)
    
    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, etc.
      // sendToErrorReporting(error, errorInfo)
    }
  },

  // API error handler
  handleAPIError: (error: any) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred'
    const status = error.response?.status
    
    console.error(`API Error (${status}):`, message)
    
    return {
      message,
      status,
      isNetworkError: !error.response,
      isClientError: status >= 400 && status < 500,
      isServerError: status >= 500
    }
  }
}

// Bundle analysis and code splitting helpers
export const bundleUtils = {
  // Dynamic import with error handling
  loadComponent: async (importFn: () => Promise<any>) => {
    try {
      const module = await importFn()
      return module.default || module
    } catch (error) {
      console.error('Failed to load component:', error)
      throw error
    }
  },

  // Preload critical routes
  preloadRoute: (routeImport: () => Promise<any>) => {
    // Preload after a short delay to not block initial render
    setTimeout(() => {
      routeImport().catch(() => {
        // Ignore preload failures
      })
    }, 100)
  }
}

export default {
  performanceUtils,
  securityUtils,
  componentUtils,
  errorUtils,
  bundleUtils
}