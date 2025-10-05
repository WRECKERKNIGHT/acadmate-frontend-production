// Security utilities and configuration

export interface SecurityConfig {
  enableCSP: boolean;
  enableSRI: boolean;
  enableHSTS: boolean;
  enableXSSProtection: boolean;
  enableFrameOptions: boolean;
  enableContentTypeOptions: boolean;
  enableReferrerPolicy: boolean;
  enablePermissionsPolicy: boolean;
}

const defaultSecurityConfig: SecurityConfig = {
  enableCSP: true,
  enableSRI: true,
  enableHSTS: true,
  enableXSSProtection: true,
  enableFrameOptions: true,
  enableContentTypeOptions: true,
  enableReferrerPolicy: true,
  enablePermissionsPolicy: true,
};

// Content Security Policy utilities
export const cspUtils = {
  generateCSP: (options: {
    allowInlineStyles?: boolean;
    allowInlineScripts?: boolean;
    allowEval?: boolean;
    additionalScriptSources?: string[];
    additionalStyleSources?: string[];
    additionalImgSources?: string[];
    additionalFontSources?: string[];
  } = {}) => {
    const {
      allowInlineStyles = false,
      allowInlineScripts = false,
      allowEval = false,
      additionalScriptSources = [],
      additionalStyleSources = [],
      additionalImgSources = [],
      additionalFontSources = [],
    } = options;

    const directives = [];

    // Default source
    directives.push("default-src 'self'");

    // Script sources
    const scriptSources = ['self', ...additionalScriptSources];
    if (allowInlineScripts) scriptSources.push("'unsafe-inline'");
    if (allowEval) scriptSources.push("'unsafe-eval'");
    directives.push(`script-src ${scriptSources.map(s => s.includes("'") ? s : `'${s}'`).join(' ')}`);

    // Style sources
    const styleSources = ['self', 'fonts.googleapis.com', ...additionalStyleSources];
    if (allowInlineStyles) styleSources.push("'unsafe-inline'");
    directives.push(`style-src ${styleSources.map(s => s.includes("'") ? s : `'${s}'`).join(' ')}`);

    // Image sources
    const imgSources = ['self', 'data:', 'blob:', 'https:', ...additionalImgSources];
    directives.push(`img-src ${imgSources.join(' ')}`);

    // Font sources
    const fontSources = ['self', 'fonts.gstatic.com', 'data:', ...additionalFontSources];
    directives.push(`font-src ${fontSources.join(' ')}`);

    // Other directives
    directives.push("object-src 'none'");
    directives.push("frame-ancestors 'self'");
    directives.push("base-uri 'self'");
    directives.push("form-action 'self'");

    return directives.join('; ');
  },

  setCSP: (csp: string) => {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = csp;
    document.head.appendChild(meta);
  },
};

// Input sanitization utilities
export const sanitizeUtils = {
  escapeHtml: (unsafe: string): string => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  stripScripts: (input: string): string => {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  },

  sanitizeInput: (input: string, options: {
    allowHtml?: boolean;
    maxLength?: number;
    allowedTags?: string[];
  } = {}): string => {
    const { allowHtml = false, maxLength = 1000, allowedTags = [] } = options;
    
    let sanitized = input;

    // Trim and limit length
    sanitized = sanitized.trim().substring(0, maxLength);

    if (!allowHtml) {
      // Escape all HTML
      sanitized = sanitizeUtils.escapeHtml(sanitized);
    } else {
      // Strip dangerous tags but allow specified ones
      sanitized = sanitizeUtils.stripScripts(sanitized);
      
      if (allowedTags.length > 0) {
        const allowedPattern = new RegExp(`<(?!/?(?:${allowedTags.join('|')})(?:\\s|>))[^>]*>`, 'gi');
        sanitized = sanitized.replace(allowedPattern, '');
      }
    }

    return sanitized;
  },

  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  validateUrl: (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  },
};

// Authentication utilities
export const authUtils = {
  generateSecureToken: (length: number = 32): string => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  hashPassword: async (password: string): Promise<string> => {
    // Use Web Crypto API for password hashing (for demo purposes)
    // In production, use a proper password hashing library like bcrypt on the server
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  },

  validatePassword: (password: string): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  secureStorage: {
    set: (key: string, value: string): void => {
      try {
        // Use sessionStorage for sensitive data that should not persist
        sessionStorage.setItem(key, btoa(value));
      } catch (error) {
        console.error('Failed to store secure data:', error);
      }
    },

    get: (key: string): string | null => {
      try {
        const value = sessionStorage.getItem(key);
        return value ? atob(value) : null;
      } catch (error) {
        console.error('Failed to retrieve secure data:', error);
        return null;
      }
    },

    remove: (key: string): void => {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.error('Failed to remove secure data:', error);
      }
    },

    clear: (): void => {
      try {
        sessionStorage.clear();
      } catch (error) {
        console.error('Failed to clear secure storage:', error);
      }
    },
  },
};

// Rate limiting utilities
export const rateLimitUtils = {
  createLimiter: (maxRequests: number, windowMs: number) => {
    const requests = new Map<string, number[]>();

    return {
      isAllowed: (identifier: string): boolean => {
        const now = Date.now();
        const windowStart = now - windowMs;
        
        // Get existing requests for this identifier
        const userRequests = requests.get(identifier) || [];
        
        // Remove requests outside the current window
        const validRequests = userRequests.filter(time => time > windowStart);
        
        // Check if under the limit
        if (validRequests.length >= maxRequests) {
          return false;
        }

        // Add current request
        validRequests.push(now);
        requests.set(identifier, validRequests);
        
        return true;
      },

      getRemainingRequests: (identifier: string): number => {
        const now = Date.now();
        const windowStart = now - windowMs;
        const userRequests = requests.get(identifier) || [];
        const validRequests = userRequests.filter(time => time > windowStart);
        
        return Math.max(0, maxRequests - validRequests.length);
      },

      reset: (identifier?: string): void => {
        if (identifier) {
          requests.delete(identifier);
        } else {
          requests.clear();
        }
      },
    };
  },
};

// CSRF protection utilities
export const csrfUtils = {
  generateToken: (): string => {
    return authUtils.generateSecureToken(32);
  },

  setToken: (token: string): void => {
    const meta = document.createElement('meta');
    meta.name = 'csrf-token';
    meta.content = token;
    document.head.appendChild(meta);
  },

  getToken: (): string | null => {
    const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
    return meta ? meta.content : null;
  },

  validateToken: (token: string): boolean => {
    const storedToken = csrfUtils.getToken();
    return storedToken === token;
  },
};

// Security headers utilities
export const securityHeaders = {
  setHeaders: (config: Partial<SecurityConfig> = {}): void => {
    const finalConfig = { ...defaultSecurityConfig, ...config };

    if (finalConfig.enableXSSProtection) {
      const xssProtection = document.createElement('meta');
      xssProtection.httpEquiv = 'X-XSS-Protection';
      xssProtection.content = '1; mode=block';
      document.head.appendChild(xssProtection);
    }

    if (finalConfig.enableContentTypeOptions) {
      const contentTypeOptions = document.createElement('meta');
      contentTypeOptions.httpEquiv = 'X-Content-Type-Options';
      contentTypeOptions.content = 'nosniff';
      document.head.appendChild(contentTypeOptions);
    }

    if (finalConfig.enableFrameOptions) {
      const frameOptions = document.createElement('meta');
      frameOptions.httpEquiv = 'X-Frame-Options';
      frameOptions.content = 'DENY';
      document.head.appendChild(frameOptions);
    }

    if (finalConfig.enableReferrerPolicy) {
      const referrerPolicy = document.createElement('meta');
      referrerPolicy.name = 'referrer';
      referrerPolicy.content = 'strict-origin-when-cross-origin';
      document.head.appendChild(referrerPolicy);
    }

    if (finalConfig.enablePermissionsPolicy) {
      const permissionsPolicy = document.createElement('meta');
      permissionsPolicy.httpEquiv = 'Permissions-Policy';
      permissionsPolicy.content = 'camera=(), microphone=(), geolocation=(), payment=()';
      document.head.appendChild(permissionsPolicy);
    }
  },
};

// Secure communication utilities
export const secureComm = {
  createSecureRequest: (url: string, options: RequestInit = {}): RequestInit => {
    const csrfToken = csrfUtils.getToken();
    
    return {
      ...options,
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
        ...options.headers,
      },
    };
  },

  secureRequestInterceptor: (requestConfig: any) => {
    // Add security headers to all requests
    const authToken = authUtils.secureStorage.get('auth-token');
    if (authToken && !authUtils.isTokenExpired(authToken)) {
      requestConfig.headers.Authorization = `Bearer ${authToken}`;
    }

    return requestConfig;
  },

  responseInterceptor: (response: Response) => {
    // Handle security-related responses
    if (response.status === 401) {
      // Token expired, redirect to login
      authUtils.secureStorage.clear();
      window.location.href = '/login';
    }

    if (response.status === 403) {
      // Forbidden, log security event
      console.warn('Access forbidden - potential security issue');
    }

    return response;
  },
};

// Security monitoring utilities
export const securityMonitor = {
  logSecurityEvent: (event: {
    type: 'xss_attempt' | 'csrf_violation' | 'rate_limit_exceeded' | 'invalid_token' | 'suspicious_activity';
    details: string;
    userAgent?: string;
    ip?: string;
  }) => {
    const securityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: event.userAgent || navigator.userAgent,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Security Event:', securityEvent);
    }

    // Send to security monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      securityMonitor.sendSecurityEvent(securityEvent);
    }
  },

  sendSecurityEvent: async (event: any) => {
    try {
      await fetch('/api/security/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to send security event:', error);
    }
  },

  detectSuspiciousActivity: () => {
    // Monitor for rapid clicks/requests
    let clickCount = 0;
    const resetClickCount = () => { clickCount = 0; };
    
    document.addEventListener('click', () => {
      clickCount++;
      if (clickCount > 50) {
        securityMonitor.logSecurityEvent({
          type: 'suspicious_activity',
          details: 'Excessive clicking detected',
        });
        clickCount = 0;
      }
      setTimeout(resetClickCount, 1000);
    });

    // Monitor for console access (possible developer tools usage)
    let devtools = false;
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
        if (!devtools) {
          devtools = true;
          securityMonitor.logSecurityEvent({
            type: 'suspicious_activity',
            details: 'Developer tools detected',
          });
        }
      } else {
        devtools = false;
      }
    }, 500);
  },
};

// Initialize security measures
export const initializeSecurity = (config: Partial<SecurityConfig> = {}) => {
  // Set security headers
  securityHeaders.setHeaders(config);

  // Generate and set CSRF token
  const csrfToken = csrfUtils.generateToken();
  csrfUtils.setToken(csrfToken);

  // Set up basic CSP
  if (config.enableCSP !== false) {
    const csp = cspUtils.generateCSP({
      allowInlineStyles: true, // Required for React/CSS-in-JS
      additionalScriptSources: ['cdn.jsdelivr.net', 'fonts.googleapis.com'],
      additionalStyleSources: ['fonts.googleapis.com'],
    });
    cspUtils.setCSP(csp);
  }

  // Start security monitoring
  if (process.env.NODE_ENV === 'production') {
    securityMonitor.detectSuspiciousActivity();
  }

  console.log('🔒 Security measures initialized');
};

// Export main security object
export const security = {
  cspUtils,
  sanitizeUtils,
  authUtils,
  rateLimitUtils,
  csrfUtils,
  securityHeaders,
  secureComm,
  securityMonitor,
  initializeSecurity,
};

export default security;