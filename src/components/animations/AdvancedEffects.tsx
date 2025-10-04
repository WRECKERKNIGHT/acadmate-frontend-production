import React, { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, useTransform, useScroll, useSpring } from 'framer-motion'

// 3D Morphing Sphere Component
export const MorphingSphere: React.FC<{ className?: string }> = ({ className = "" }) => {
  const controls = useAnimation()
  
  useEffect(() => {
    controls.start({
      rotateX: [0, 360, 720],
      rotateY: [0, 180, 360, 540, 720],
      scale: [1, 1.2, 0.8, 1.1, 1],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    })
  }, [controls])

  return (
    <motion.div
      animate={controls}
      className={`relative ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Multiple layers for 3D effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-sm" />
      <div className="absolute inset-2 bg-gradient-to-r from-cyan-500/40 to-pink-500/40 rounded-full blur-xs" />
      <div className="absolute inset-4 bg-gradient-to-r from-indigo-500/50 to-violet-500/50 rounded-full" />
      
      {/* Inner glow effect */}
      <motion.div
        className="absolute inset-6 bg-white/20 rounded-full"
        animate={{
          boxShadow: [
            "0 0 20px rgba(255, 255, 255, 0.3)",
            "0 0 40px rgba(59, 130, 246, 0.5)",
            "0 0 60px rgba(147, 51, 234, 0.7)",
            "0 0 40px rgba(59, 130, 246, 0.5)",
            "0 0 20px rgba(255, 255, 255, 0.3)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </motion.div>
  )
}

// Floating Geometric Shapes
export const FloatingGeometry: React.FC = () => {
  const shapes = [
    { size: 'w-8 h-8', position: 'top-20 left-10', delay: 0 },
    { size: 'w-12 h-12', position: 'top-40 right-20', delay: 1 },
    { size: 'w-6 h-6', position: 'bottom-32 left-16', delay: 2 },
    { size: 'w-10 h-10', position: 'bottom-20 right-10', delay: 0.5 },
    { size: 'w-14 h-14', position: 'top-60 left-1/3', delay: 1.5 }
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.size} ${shape.position}`}
          initial={{ 
            opacity: 0, 
            scale: 0,
            rotate: 0 
          }}
          animate={{ 
            opacity: [0, 0.7, 0],
            scale: [0, 1, 1.2, 0],
            rotate: [0, 180, 360],
            y: [0, -100, -200]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: shape.delay + Math.random() * 2,
            ease: "easeInOut"
          }}
        >
          {index % 3 === 0 ? (
            <div className="w-full h-full bg-gradient-to-r from-blue-400/60 to-purple-400/60 rotate-45" />
          ) : index % 3 === 1 ? (
            <div className="w-full h-full bg-gradient-to-r from-green-400/60 to-blue-400/60 rounded-full" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-pink-400/60 to-orange-400/60" 
                 style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          )}
        </motion.div>
      ))}
    </div>
  )
}

// Advanced Particle Wave System
export const ParticleWave: React.FC<{ className?: string }> = ({ className = "" }) => {
  const particleCount = 100
  const particles = Array.from({ length: particleCount }, (_, i) => i)
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 2 + 0.5
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight
            ],
            opacity: [0, 1, 0.5, 1, 0],
            scale: [0.5, 2, 1, 1.5, 0.5]
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
          style={{
            filter: `hue-rotate(${particle * 3.6}deg)`
          }}
        />
      ))}
    </div>
  )
}

// Holographic Card Effect
export const HolographicCard: React.FC<{ 
  children: React.ReactNode
  className?: string 
}> = ({ children, className = "" }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / 20
      const y = (e.clientY - rect.top - rect.height / 2) / 20
      setMousePosition({ x, y })
    }
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
      whileHover={{ scale: 1.05 }}
      style={{
        transform: `rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`,
        transformStyle: "preserve-3d"
      }}
    >
      {/* Holographic overlay */}
      <div 
        className="absolute inset-0 opacity-30 rounded-3xl"
        style={{
          background: `linear-gradient(
            ${mousePosition.x * 2 + 45}deg,
            transparent 30%,
            rgba(59, 130, 246, 0.3) 50%,
            transparent 70%
          )`
        }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-20 rounded-3xl"
        animate={{
          background: [
            'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
            'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
            'linear-gradient(225deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
            'linear-gradient(315deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)'
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  )
}

// Liquid Morph Background
export const LiquidMorphBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 opacity-20">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6">
              <animate attributeName="stop-color" 
                values="#3B82F6;#8B5CF6;#EC4899;#3B82F6" 
                dur="8s" 
                repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.4">
              <animate attributeName="stop-color" 
                values="#8B5CF6;#EC4899;#3B82F6;#8B5CF6" 
                dur="8s" 
                repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.6">
              <animate attributeName="stop-color" 
                values="#EC4899;#3B82F6;#8B5CF6;#EC4899" 
                dur="8s" 
                repeatCount="indefinite" />
            </stop>
          </linearGradient>
          
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="gooey" />
          </filter>
        </defs>
        
        <g filter="url(#gooey)">
          <motion.circle
            cx="200"
            cy="200"
            r="100"
            fill="url(#liquidGradient)"
            animate={{
              cx: [200, 800, 200],
              cy: [200, 600, 200],
              r: [100, 150, 100]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.circle
            cx="800"
            cy="300"
            r="120"
            fill="url(#liquidGradient)"
            animate={{
              cx: [800, 200, 800],
              cy: [300, 700, 300],
              r: [120, 80, 120]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.circle
            cx="500"
            cy="700"
            r="80"
            fill="url(#liquidGradient)"
            animate={{
              cx: [500, 700, 500],
              cy: [700, 200, 700],
              r: [80, 140, 80]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>
      </svg>
    </div>
  )
}

// Neural Network Animation
export const NeuralNetwork: React.FC<{ className?: string }> = ({ className = "" }) => {
  const nodes = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    connections: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => 
      Math.floor(Math.random() * 20)
    ).filter(id => id !== i)
  }))

  return (
    <div className={`relative ${className}`}>
      <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100">
        {/* Connections */}
        {nodes.map(node => 
          node.connections.map(connectionId => {
            const targetNode = nodes[connectionId]
            if (!targetNode) return null
            
            return (
              <motion.line
                key={`${node.id}-${connectionId}`}
                x1={node.x}
                y1={node.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth="0.1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: [0, 1, 0],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
              />
            )
          })
        )}
        
        {/* Nodes */}
        {nodes.map(node => (
          <motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r="0.5"
            fill="rgba(139, 92, 246, 0.8)"
            animate={{
              r: [0.5, 1, 0.5],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// Glitch Text Effect
export const GlitchText: React.FC<{ 
  children: string
  className?: string 
}> = ({ children, className = "" }) => {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 200)
    }, 3000 + Math.random() * 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative ${className}`}>
      <span className="relative z-10">{children}</span>
      
      {isGlitching && (
        <>
          <motion.span
            className="absolute inset-0 text-red-500"
            initial={{ x: -2, opacity: 0 }}
            animate={{ x: [0, -2, 2, 0], opacity: [0, 0.7, 0.7, 0] }}
            transition={{ duration: 0.2 }}
          >
            {children.split('').map((char, i) => (
              <span key={i} style={{ display: 'inline-block' }}>
                {Math.random() > 0.8 ? String.fromCharCode(33 + Math.random() * 93) : char}
              </span>
            ))}
          </motion.span>
          
          <motion.span
            className="absolute inset-0 text-cyan-400"
            initial={{ x: 2, opacity: 0 }}
            animate={{ x: [0, 2, -2, 0], opacity: [0, 0.7, 0.7, 0] }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {children.split('').map((char, i) => (
              <span key={i} style={{ display: 'inline-block' }}>
                {Math.random() > 0.9 ? String.fromCharCode(33 + Math.random() * 93) : char}
              </span>
            ))}
          </motion.span>
        </>
      )}
    </div>
  )
}

// Matrix Rain Effect
export const MatrixRain: React.FC<{ className?: string }> = ({ className = "" }) => {
  const columns = Math.floor(window.innerWidth / 20)
  const drops = Array.from({ length: columns }, () => Math.random() * -500)

  return (
    <div className={`fixed inset-0 pointer-events-none opacity-10 ${className}`}>
      {drops.map((drop, index) => (
        <motion.div
          key={index}
          className="absolute text-green-400 font-mono text-sm"
          style={{ 
            left: index * 20,
            fontSize: Math.random() * 10 + 10
          }}
          animate={{
            y: [drop, window.innerHeight + 50],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        >
          {Array.from({ length: Math.floor(Math.random() * 20) + 5 }, (_, i) => (
            <div key={i} style={{ marginBottom: '2px' }}>
              {String.fromCharCode(33 + Math.random() * 93)}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

// DNA Helix Animation
export const DNAHelix: React.FC<{ className?: string }> = ({ className = "" }) => {
  const pairs = Array.from({ length: 20 }, (_, i) => i)

  return (
    <div className={`relative ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 200 400">
        <defs>
          <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        
        {pairs.map((pair, i) => {
          const y = i * 20
          const phase = (i * 0.2) + (Date.now() * 0.001)
          
          return (
            <g key={i}>
              {/* Base pairs */}
              <motion.line
                x1={100 + Math.sin(phase) * 30}
                y1={y}
                x2={100 - Math.sin(phase) * 30}
                y2={y}
                stroke="url(#dnaGradient)"
                strokeWidth="2"
                animate={{
                  x1: 100 + Math.sin(phase) * 30,
                  x2: 100 - Math.sin(phase) * 30
                }}
                transition={{ duration: 0.1 }}
              />
              
              {/* DNA strands */}
              <motion.circle
                cx={100 + Math.sin(phase) * 30}
                cy={y}
                r="3"
                fill="#3B82F6"
                animate={{
                  cx: 100 + Math.sin(phase) * 30,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  cx: { duration: 0.1 },
                  scale: { duration: 2, repeat: Infinity }
                }}
              />
              
              <motion.circle
                cx={100 - Math.sin(phase) * 30}
                cy={y}
                r="3"
                fill="#EC4899"
                animate={{
                  cx: 100 - Math.sin(phase) * 30,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  cx: { duration: 0.1 },
                  scale: { duration: 2, repeat: Infinity, delay: 1 }
                }}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default {
  MorphingSphere,
  FloatingGeometry,
  ParticleWave,
  HolographicCard,
  LiquidMorphBackground,
  NeuralNetwork,
  GlitchText,
  MatrixRain,
  DNAHelix
}