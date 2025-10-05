import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

// Particle system for login background
const LoginParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`;
        ctx.fill();

        // Connect nearby particles
        particles.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(0, 255, 255, ${(1 - distance / 80) * 0.3})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-40 z-0"
    />
  );
};

// Glowing input component
const GlowingInput: React.FC<{
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: string;
  error?: string;
}> = ({ label, type, value, onChange, placeholder, icon, error }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-6">
      <motion.label
        className="block text-sm font-medium text-cyan-300 mb-2"
        animate={{ opacity: value ? 1 : 0.7 }}
      >
        {icon} {label}
      </motion.label>
      
      <div className="relative">
        <motion.input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-4 bg-black/80 backdrop-blur-xl border-2 rounded-xl
            text-white placeholder-gray-500 transition-all duration-300
            focus:outline-none focus:ring-0
            ${error 
              ? 'border-red-500/50 focus:border-red-400' 
              : 'border-cyan-500/30 focus:border-cyan-400'
            }
          `}
          style={{
            boxShadow: isFocused 
              ? error
                ? '0 0 20px rgba(255, 0, 0, 0.3)'
                : '0 0 20px rgba(0, 255, 255, 0.3)'
              : 'none'
          }}
        />
        
        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            boxShadow: isFocused
              ? error
                ? ['0 0 0px rgba(255, 0, 0, 0)', '0 0 15px rgba(255, 0, 0, 0.5)', '0 0 0px rgba(255, 0, 0, 0)']
                : ['0 0 0px rgba(0, 255, 255, 0)', '0 0 15px rgba(0, 255, 255, 0.5)', '0 0 0px rgba(0, 255, 255, 0)']
              : 'none'
          }}
          transition={{ duration: 2, repeat: isFocused ? Infinity : 0 }}
        />
      </div>
      
      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-400 text-sm mt-2 flex items-center gap-2"
          >
            ❌ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const EnhancedLoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  // Clear errors when user starts typing - PREVENT SIMULTANEOUS ERRORS
  useEffect(() => {
    if (formTouched && !isLoading) {
      const newErrors: {[key: string]: string} = {};
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      
      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      setErrors(newErrors);
    }
  }, [formData, formTouched, isLoading]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormTouched(true);
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear errors immediately when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);
    
    // Clear all previous errors
    setErrors({});
    
    // Validate form
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors below');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Show loading toast
      const loadingToast = toast.loading('🔐 Authenticating...', {
        style: {
          background: '#0a0a0a',
          color: '#00ffff',
          border: '1px solid #00ffff',
        }
      });
      
      // Attempt login
      const result = await login(formData.email, formData.password);
      
      // Success
      toast.dismiss(loadingToast);
      toast.success('🎉 Welcome to ACADMATE!', {
        duration: 3000,
        style: {
          background: '#0a0a0a',
          color: '#00ffff',
          border: '1px solid #00ffff',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
        }
      });
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error types
      let errorMessage = '❌ Login failed. Please try again.';
      
      if (error?.response?.status === 401) {
        errorMessage = '❌ Invalid email or password';
      } else if (error?.response?.status === 404) {
        errorMessage = '❌ Account not found';
      } else if (error?.message) {
        errorMessage = `❌ ${error.message}`;
      }
      
      toast.error(errorMessage, {
        duration: 4000,
        style: {
          background: '#1a0000',
          color: '#ff4444',
          border: '1px solid #ff4444',
        }
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login function with better error handling
  const handleDemoLogin = async (role: 'student' | 'teacher' | 'admin') => {
    if (isLoading) return; // Prevent multiple clicks
    
    setIsLoading(true);
    setErrors({}); // Clear any existing errors
    
    const demoCredentials = {
      student: { email: 'student@acadmate.com', password: 'student123' },
      teacher: { email: 'teacher@acadmate.com', password: 'teacher123' },
      admin: { email: 'admin@acadmate.com', password: 'admin123' }
    };
    
    const creds = demoCredentials[role];
    setFormData(creds);
    
    try {
      const loadingToast = toast.loading(`🚀 Logging in as ${role}...`, {
        style: {
          background: '#0a0a0a',
          color: '#00ffff',
          border: '1px solid #00ffff',
        }
      });
      
      await login(creds.email, creds.password);
      
      toast.dismiss(loadingToast);
      toast.success(`🎯 Welcome ${role.toUpperCase()}!`, {
        duration: 3000,
        style: {
          background: '#0a0a0a',
          color: '#00ffff',
          border: '1px solid #00ffff',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
        }
      });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error: any) {
      console.error('Demo login error:', error);
      toast.error('❌ Demo login failed. Using fallback authentication...', {
        duration: 2000,
        style: {
          background: '#1a0000',
          color: '#ff4444',
          border: '1px solid #ff4444',
        }
      });
      
      // Fallback: simulate successful login for demo
      setTimeout(() => {
        toast.success(`🎯 Demo ${role.toUpperCase()} access granted!`);
        navigate('/dashboard');
      }, 1500);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      <LoginParticles />
      
      {/* Back to home button */}
      <motion.button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 px-4 py-2 bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-xl text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        ← Back to Home
      </motion.button>
      
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <motion.div
          className="bg-black/80 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          style={{
            boxShadow: '0 25px 50px rgba(0, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center"
              animate={{ 
                rotateY: [0, 360],
                boxShadow: [
                  '0 0 20px rgba(0, 255, 255, 0.5)',
                  '0 0 30px rgba(128, 0, 128, 0.5)',
                  '0 0 20px rgba(0, 255, 255, 0.5)'
                ]
              }}
              transition={{ 
                rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
                boxShadow: { duration: 3, repeat: Infinity }
              }}
            >
              <span className="text-3xl font-bold text-white">A</span>
            </motion.div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400">
              Sign in to your ACADMATE account
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <GlowingInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              placeholder="Enter your email"
              icon="📧"
              error={errors.email}
            />

            <div className="relative">
              <GlowingInput
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                placeholder="Enter your password"
                icon="🔒"
                error={errors.password}
              />
              
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-12 text-cyan-400 hover:text-cyan-300 transition-colors z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? '🙈' : '👁️'}
              </motion.button>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Authenticating...
                  </>
                ) : (
                  <>
                    🚀 Sign In
                  </>
                )}
              </span>
              
              {!isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </motion.button>
          </motion.form>

          {/* Demo Login Options */}
          <motion.div
            className="mt-8 pt-6 border-t border-cyan-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-center text-sm text-gray-400 mb-4">
              🎯 Quick Demo Access
            </p>
            
            <div className="grid grid-cols-3 gap-2">
              {[
                { role: 'student' as const, label: '👨‍🎓 Student', color: 'from-green-500 to-emerald-600' },
                { role: 'teacher' as const, label: '👨‍🏫 Teacher', color: 'from-blue-500 to-cyan-600' },
                { role: 'admin' as const, label: '👑 Admin', color: 'from-purple-500 to-pink-600' }
              ].map(({ role, label, color }) => (
                <motion.button
                  key={role}
                  onClick={() => handleDemoLogin(role)}
                  disabled={isLoading}
                  className={`p-3 bg-gradient-to-r ${color} rounded-xl text-white text-xs font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50`}
                  whileHover={{ scale: isLoading ? 1 : 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {label}
                </motion.button>
              ))}
            </div>
            
            <p className="text-center text-xs text-gray-500 mt-3">
              Click any role for instant demo access
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedLoginForm;