// Application Optimization Configuration

export const appConfig = {
  // Performance Settings
  performance: {
    // API request timeout in milliseconds
    apiTimeout: 10000,
    
    // Debounce delay for search inputs
    searchDebounceDelay: 300,
    
    // Throttle delay for scroll events
    scrollThrottleDelay: 100,
    
    // Cache TTL in milliseconds
    cacheTTL: 5 * 60 * 1000, // 5 minutes
    
    // Maximum cache size (number of entries)
    maxCacheSize: 100,
    
    // Lazy loading intersection threshold
    lazyLoadThreshold: 0.1,
    
    // Virtual scrolling settings
    virtualScrolling: {
      itemHeight: 60,
      overscan: 5
    },
    
    // Image optimization
    imageOptimization: {
      quality: 85,
      format: 'webp',
      sizes: [400, 800, 1200, 1600]
    }
  },

  // Security Settings
  security: {
    // Rate limiting
    rateLimit: {
      maxRequests: 100,
      windowMs: 60 * 1000, // 1 minute
      blockDuration: 15 * 60 * 1000 // 15 minutes
    },
    
    // Session settings
    session: {
      tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
      maxInactiveTime: 30 * 60 * 1000, // 30 minutes
      rememberMeDuration: 7 * 24 * 60 * 60 * 1000 // 7 days
    },
    
    // Password policy
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAttempts: 5,
      lockoutDuration: 30 * 60 * 1000 // 30 minutes
    },
    
    // Input validation
    validation: {
      maxInputLength: 1000,
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFilesPerUpload: 5
    }
  },

  // UI/UX Settings
  ui: {
    // Animation settings
    animations: {
      defaultDuration: 0.3,
      staggerDelay: 0.1,
      springConfig: { type: "spring", stiffness: 300, damping: 30 },
      reduceMotion: false // Will be set based on user preference
    },
    
    // Theme settings
    theme: {
      prefersDarkMode: true,
      accentColor: '#3B82F6',
      borderRadius: '12px',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    
    // Layout settings
    layout: {
      maxWidth: '1440px',
      sidebarWidth: '280px',
      headerHeight: '72px',
      mobileBreakpoint: '768px'
    },
    
    // Toast notifications
    toast: {
      duration: 4000,
      position: 'top-right',
      maxVisible: 5
    }
  },

  // API Configuration
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
    
    // Endpoints
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      tests: '/api/tests',
      attendance: '/api/attendance',
      homework: '/api/homework',
      doubts: '/api/doubts',
      leaderboard: '/api/leaderboard'
    },
    
    // Request headers
    defaultHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },

  // Feature Flags
  features: {
    // Core features
    authentication: true,
    dashboard: true,
    tests: true,
    homework: true,
    attendance: true,
    doubts: true,
    
    // Advanced features
    leaderboard: true,
    analytics: true,
    notifications: true,
    fileUpload: true,
    offlineMode: false,
    
    // Experimental features
    virtualScrolling: false,
    serviceWorker: false,
    webPush: false,
    darkModeToggle: true,
    
    // Admin features
    userManagement: true,
    systemStats: true,
    bulkOperations: true,
    dataExport: true
  },

  // Environment specific settings
  env: {
    development: {
      logging: {
        level: 'debug',
        enableConsole: true,
        enableNetwork: true,
        enablePerformance: true
      },
      devTools: {
        reduxDevTools: true,
        reactDevTools: true,
        performanceProfiler: true
      }
    },
    
    production: {
      logging: {
        level: 'error',
        enableConsole: false,
        enableNetwork: false,
        enablePerformance: false
      },
      devTools: {
        reduxDevTools: false,
        reactDevTools: false,
        performanceProfiler: false
      },
      analytics: {
        enabled: true,
        trackingId: process.env.REACT_APP_GA_TRACKING_ID,
        enableErrorReporting: true
      }
    }
  }
}

// Get environment specific configuration
export const getConfig = () => {
  const isDev = process.env.NODE_ENV === 'development'
  const baseConfig = { ...appConfig }
  const envConfig = isDev ? appConfig.env.development : appConfig.env.production
  
  return {
    ...baseConfig,
    ...envConfig,
    isDevelopment: isDev,
    isProduction: !isDev
  }
}

// Performance monitoring configuration
export const performanceConfig = {
  // Core Web Vitals thresholds
  thresholds: {
    lcp: 2500, // Largest Contentful Paint
    fid: 100,  // First Input Delay
    cls: 0.1   // Cumulative Layout Shift
  },
  
  // Performance marks to track
  marks: [
    'app-start',
    'app-mounted',
    'dashboard-loaded',
    'first-interaction',
    'route-change'
  ],
  
  // Bundle size limits (in KB)
  bundleSizeLimits: {
    main: 1000,
    vendor: 800,
    async: 200
  },
  
  // Memory usage limits (in MB)
  memoryLimits: {
    warning: 100,
    critical: 200
  }
}

// Security headers configuration
export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' " + (appConfig.api.baseURL || 'http://localhost:5000')
  ].join('; '),
  
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
}

// Code splitting configuration
export const codeSplittingConfig = {
  // Route-based splitting
  routes: {
    'dashboard': () => import('../pages/Dashboard'),
    'tests': () => import('../pages/Tests'),
    'homework': () => import('../pages/Homework'),
    'doubts': () => import('../pages/Doubts'),
    'attendance': () => import('../pages/Attendance'),
    'profile': () => import('../pages/Profile'),
    'admin': () => import('../pages/Admin')
  },
  
  // Component-based splitting
  components: {
    'Chart': () => import('../components/Chart'),
    'DataTable': () => import('../components/DataTable'),
    'FileUpload': () => import('../components/FileUpload'),
    'VideoPlayer': () => import('../components/VideoPlayer')
  },
  
  // Library-based splitting
  libraries: {
    'pdf': () => import('react-pdf'),
    'charts': () => import('recharts'),
    'editor': () => import('@tinymce/tinymce-react')
  }
}

// PWA configuration
export const pwaConfig = {
  // Service Worker settings
  serviceWorker: {
    enabled: appConfig.features.serviceWorker,
    swSrc: '/sw.js',
    scope: '/',
    updateMode: 'refresh'
  },
  
  // Cache strategies
  cacheStrategies: {
    // Cache first for static assets
    static: {
      urlPattern: /\.(js|css|woff|woff2|png|jpg|jpeg|svg|gif)$/,
      strategy: 'CacheFirst',
      cacheName: 'static-assets',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      }
    },
    
    // Network first for API calls
    api: {
      urlPattern: /\/api\//,
      strategy: 'NetworkFirst',
      cacheName: 'api-cache',
      networkTimeoutSeconds: 10,
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 5 * 60 // 5 minutes
      }
    },
    
    // Stale while revalidate for HTML
    html: {
      urlPattern: /\.html$/,
      strategy: 'StaleWhileRevalidate',
      cacheName: 'html-cache'
    }
  },
  
  // Background sync
  backgroundSync: {
    enabled: true,
    queueName: 'acadmate-queue',
    maxRetentionTime: 24 * 60 * 60 * 1000 // 24 hours
  }
}

// Export default configuration
export default getConfig()