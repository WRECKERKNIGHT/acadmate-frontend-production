import React, { Suspense, lazy, ComponentType } from 'react';
import { motion } from 'framer-motion';

// Loading component with premium animations
const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
    {/* Animated background particles */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-40"
          initial={{ x: Math.random() * 1200, y: Math.random() * 800 }}
          animate={{ 
            x: Math.random() * 1200, 
            y: Math.random() * 800,
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{ 
            duration: Math.random() * 8 + 8, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
        />
      ))}
    </div>

    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative z-10 text-center"
    >
      {/* Neon Loading Spinner */}
      <motion.div
        className="w-16 h-16 border-4 border-transparent border-t-cyan-400 border-r-purple-500 rounded-full mx-auto mb-6"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(255, 0, 255, 0.1)'
        }}
      />
      
      {/* Loading text with gradient */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
      >
        {message}
      </motion.h2>

      {/* Pulsing dots */}
      <motion.div className="flex justify-center space-x-2 mt-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-cyan-400 rounded-full"
            animate={{ 
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay: i * 0.2 
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  </div>
);

// Error fallback for lazy loading failures
const LazyLoadError: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md mx-auto p-6"
    >
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-4">
        Failed to Load Component
      </h2>
      
      <p className="text-gray-400 mb-6">
        The component couldn't be loaded. This might be due to a network issue.
      </p>

      {process.env.NODE_ENV === 'development' && (
        <p className="text-red-400 text-sm mb-4 font-mono">
          {error.message}
        </p>
      )}
      
      <motion.button
        onClick={retry}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold transition-all duration-300"
      >
        Try Again
      </motion.button>
    </motion.div>
  </div>
);

// Higher-order component for lazy loading with error handling
export function withLazyLoading<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  loadingComponent?: React.ComponentType<any>,
  errorComponent?: React.ComponentType<any>
) {
  const LazyComponent = lazy(importFunc);
  
  return React.forwardRef<any, P>((props, ref) => (
    <Suspense
      fallback={
        loadingComponent ? React.createElement(loadingComponent) : <LoadingSpinner />
      }
    >
      <ErrorBoundary
        fallback={
          errorComponent ? React.createElement(errorComponent) : 
          <LazyLoadError 
            error={new Error('Component failed to load')} 
            retry={() => window.location.reload()} 
          />
        }
      >
        <LazyComponent {...props} ref={ref} />
      </ErrorBoundary>
    </Suspense>
  ));
}

// Error Boundary for lazy loading
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Lazy loaded components for the entire app
export const LazyHomepage = withLazyLoading(
  () => import('../components/Homepage'),
  () => <LoadingSpinner message="Loading Homepage..." />
);

export const LazyLogin = withLazyLoading(
  () => import('../components/Login'),
  () => <LoadingSpinner message="Loading Login..." />
);

export const LazyStudentDashboard = withLazyLoading(
  () => import('../components/dashboards/StudentDashboard'),
  () => <LoadingSpinner message="Loading Student Dashboard..." />
);

export const LazyTeacherDashboard = withLazyLoading(
  () => import('../components/dashboards/TeacherDashboard'),
  () => <LoadingSpinner message="Loading Teacher Dashboard..." />
);

export const LazyAdminDashboard = withLazyLoading(
  () => import('../components/dashboards/AdminDashboard'),
  () => <LoadingSpinner message="Loading Admin Dashboard..." />
);

export const LazyAttendanceSystem = withLazyLoading(
  () => import('../components/AttendanceSystem'),
  () => <LoadingSpinner message="Loading Attendance System..." />
);

export const LazyHomeworkSystem = withLazyLoading(
  () => import('../components/HomeworkSystem'),
  () => <LoadingSpinner message="Loading Homework System..." />
);

export const LazyLeaderboard = withLazyLoading(
  () => import('../components/Leaderboard'),
  () => <LoadingSpinner message="Loading Leaderboard..." />
);

export const LazyOfflineTestManager = withLazyLoading(
  () => import('../components/OfflineTestManager'),
  () => <LoadingSpinner message="Loading Test Manager..." />
);

export const LazyHeadTeacherAdminSystem = withLazyLoading(
  () => import('../components/admin/HeadTeacherAdminSystem'),
  () => <LoadingSpinner message="Loading Admin System..." />
);

export const LazyClassScheduler = withLazyLoading(
  () => import('../components/admin/ClassScheduler'),
  () => <LoadingSpinner message="Loading Class Scheduler..." />
);

export const LazyNotificationSystem = withLazyLoading(
  () => import('../components/admin/NotificationSystem'),
  () => <LoadingSpinner message="Loading Notification System..." />
);

// Preloading utilities
export const preloadComponent = (importFunc: () => Promise<any>) => {
  // Start loading the component in the background
  const componentPromise = importFunc();
  return componentPromise;
};

export const preloadRoute = (routePath: string) => {
  // Preload components based on route
  switch (routePath) {
    case '/dashboard/student':
      return preloadComponent(() => import('../components/dashboards/StudentDashboard'));
    case '/dashboard/teacher':
      return preloadComponent(() => import('../components/dashboards/TeacherDashboard'));
    case '/dashboard/admin':
      return preloadComponent(() => import('../components/dashboards/AdminDashboard'));
    case '/attendance':
      return preloadComponent(() => import('../components/AttendanceSystem'));
    case '/homework':
      return preloadComponent(() => import('../components/HomeworkSystem'));
    case '/leaderboard':
      return preloadComponent(() => import('../components/Leaderboard'));
    case '/tests':
      return preloadComponent(() => import('../components/OfflineTestManager'));
    case '/admin':
      return preloadComponent(() => import('../components/admin/HeadTeacherAdminSystem'));
    default:
      return Promise.resolve();
  }
};

// Route-based prefetching
export const usePrefetch = () => {
  const prefetch = (route: string) => {
    // Prefetch on hover or focus
    preloadRoute(route);
  };

  const prefetchOnHover = (route: string) => ({
    onMouseEnter: () => prefetch(route),
    onFocus: () => prefetch(route),
  });

  return { prefetch, prefetchOnHover };
};

// Image lazy loading
export const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}> = ({ src, alt, className = '', placeholder }) => {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          {placeholder ? (
            <img src={placeholder} alt="Loading..." className="opacity-50" />
          ) : (
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      )}
      
      <motion.img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`${loaded ? 'block' : 'hidden'} w-full h-full object-cover`}
      />
      
      {error && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-400">
          Failed to load image
        </div>
      )}
    </div>
  );
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  callback: () => void,
  options: IntersectionObserverInit = {}
) => {
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
        observer.disconnect();
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [callback, options]);

  return ref;
};

export default {
  withLazyLoading,
  preloadComponent,
  preloadRoute,
  usePrefetch,
  LazyImage,
  useIntersectionObserver,
  LoadingSpinner,
};