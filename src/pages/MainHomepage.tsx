import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { 
  ArrowRight, 
  Play, 
  Star, 
  Users, 
  Trophy, 
  BookOpen, 
  Zap, 
  Target, 
  Award,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  CheckCircle,
  Sparkles,
  Atom,
  Brain,
  Rocket,
  Globe,
  Shield,
  Clock,
  TrendingUp
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { 
  MorphingSphere,
  FloatingGeometry,
  ParticleWave,
  HolographicCard,
  LiquidMorphBackground,
  NeuralNetwork,
  GlitchText,
  MatrixRain,
  DNAHelix
} from '../components/animations/AdvancedEffects'
import VideoScrollEffect, { LayeredVideoScroll, CinematicVideoScroll } from '../components/animations/VideoScrollEffect'
import '../styles/advanced-effects.css'

// Custom hooks for advanced animations
const useParallax = (value: any, distance: number) => {
  return useTransform(value, [0, 1], [-distance, distance])
}

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  return mousePosition
}

const MainHomepage: React.FC = () => {
  const { scrollYProgress } = useScroll()
  const mousePosition = useMousePosition()
  const [currentVideoFrame, setCurrentVideoFrame] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  
  // Parallax transforms
  const y1 = useParallax(scrollYProgress, 300)
  const y2 = useParallax(scrollYProgress, 200)
  const y3 = useParallax(scrollYProgress, 100)
  
  // Mouse follow effects
  const mouseX = useSpring(mousePosition.x / window.innerWidth - 0.5, { stiffness: 300, damping: 30 })
  const mouseY = useSpring(mousePosition.y / window.innerHeight - 0.5, { stiffness: 300, damping: 30 })

  // Frame-by-frame video scroll effect
  const frameCount = 60 // Number of video frames
  const videoFrameProgress = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1])
  
  useEffect(() => {
    const unsubscribe = videoFrameProgress.onChange(latest => {
      setCurrentVideoFrame(Math.round(latest))
    })
    return unsubscribe
  }, [videoFrameProgress])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Animated Background with CGI Effects */}
      <div className="fixed inset-0 z-0">
        {/* Liquid Morph Background */}
        <LiquidMorphBackground />
        
        {/* Matrix Rain Effect */}
        <MatrixRain className="opacity-5" />
        
        {/* Floating Geometry */}
        <FloatingGeometry />
        
        {/* Neural Network */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 opacity-20">
          <NeuralNetwork />
        </div>
        
        {/* Advanced Particle System */}
        <ParticleWave className="absolute inset-0 opacity-40" />
        
        {/* Original Particle System */}
        <div className="absolute inset-0 opacity-30">
          <ParticleSystem />
        </div>
        
        {/* Gradient Orbs with Mouse Interaction */}
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #3B82F6 0%, #1D4ED8 50%, transparent 70%)',
            x: useTransform(mouseX, [-0.5, 0.5], [-100, 100]),
            y: useTransform(mouseY, [-0.5, 0.5], [-100, 100]),
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute top-1/2 right-0 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #8B5CF6 0%, #7C3AED 50%, transparent 70%)',
            x: useTransform(mouseX, [-0.5, 0.5], [50, -50]),
            y: useTransform(mouseY, [-0.5, 0.5], [50, -50]),
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Floating Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl px-8 py-4">
          <div className="flex items-center space-x-8">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Atom className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">ACADMATE</span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-6">
              {['Home', 'About', 'Courses', 'Results', 'Contact'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-white/80 hover:text-white transition-colors relative"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                  />
                </motion.a>
              ))}
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Advanced Animations */}
      <section id="home" className="min-h-screen flex items-center justify-center relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Floating Elements with Morphing Sphere */}
          <motion.div
            className="absolute -top-20 -left-20"
            style={{ y: y1 }}
          >
            <MorphingSphere className="w-32 h-32" />
          </motion.div>

          <motion.div
            className="absolute -bottom-32 -right-32"
            style={{ y: y2 }}
          >
            <DNAHelix className="w-40 h-60 opacity-30" />
          </motion.div>

          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-20"
          >
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-6 py-3 mb-8"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-semibold">India's #1 Coaching Institute</span>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-4 h-4 text-yellow-400" />
              </motion.div>
            </motion.div>

            {/* Main Heading with Text Reveal Animation and Glitch Effect */}
            <div className="mb-8 overflow-hidden">
              <motion.h1
                className="text-6xl md:text-8xl font-black leading-tight"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
              >
                <span className="block">
                  <GlitchText className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
                    Transform Your
                  </GlitchText>
                </span>
                <span className="block">
                  <GlitchText className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Future Today
                  </GlitchText>
                </span>
              </motion.h1>
            </div>

            {/* Animated Subtitle */}
            <motion.p
              className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              Join thousands of successful students who achieved their dreams with our expert guidance, 
              cutting-edge technology, and personalized learning approach.
            </motion.p>

            {/* CTA Buttons with Advanced Hover Effects */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.5)" 
                }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur group-hover:blur-xl transition-all duration-300 opacity-70 group-hover:opacity-100" />
                <Link
                  to="/register"
                  className="relative bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center space-x-2 hover:shadow-2xl transition-all duration-300"
                >
                  <span>Start Your Journey</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center space-x-2 hover:bg-white/20 transition-all duration-300">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </motion.div>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
            >
              {[
                { number: "50K+", label: "Students", icon: Users },
                { number: "98%", label: "Success Rate", icon: Trophy },
                { number: "15+", label: "Years Experience", icon: Award },
                { number: "100+", label: "Expert Faculty", icon: Star }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 + index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center space-y-2 text-white/60 hover:text-white transition-colors cursor-pointer"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="text-sm">Scroll to explore</span>
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Frame-by-Frame Video Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-10"
          style={{
            background: `linear-gradient(45deg, 
              hsla(${currentVideoFrame * 6}, 70%, 50%, 0.1) 0%, 
              hsla(${(currentVideoFrame * 6 + 120) % 360}, 70%, 50%, 0.1) 50%,
              hsla(${(currentVideoFrame * 6 + 240) % 360}, 70%, 50%, 0.1) 100%)`
          }}
        />
        
        <div className="relative z-20 text-center text-white">
          <motion.h2
            className="text-5xl font-bold mb-8"
            style={{
              scale: useTransform(scrollYProgress, [0.2, 0.5], [0.8, 1.2]),
              opacity: useTransform(scrollYProgress, [0.2, 0.4, 0.6], [0, 1, 0])
            }}
          >
            Experience the Future of Learning
          </motion.h2>
          
          <motion.div
            className="w-32 h-32 mx-auto rounded-full border-4 border-white/20"
            style={{
              rotate: useTransform(scrollYProgress, [0, 1], [0, 720]),
              scale: useTransform(scrollYProgress, [0.3, 0.7], [1, 1.5])
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Brain className="w-16 h-16 text-white" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Advanced Video Scroll Effects Section */}
      <section className="relative">
        {/* Cinematic Video Scroll with Parallax */}
        <CinematicVideoScroll 
          className="h-screen" 
          foregroundFrames={80} 
          backgroundFrames={40}
        >
          <motion.div
            className="text-center text-white z-30"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
              Innovation in Motion
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Experience learning like never before with our cutting-edge technology and immersive educational platform.
            </p>
          </motion.div>
        </CinematicVideoScroll>

        {/* Layered Video Scroll Effects */}
        <LayeredVideoScroll 
          className="h-screen"
          layers={[
            { frameCount: 60, speed: 1, opacity: 0.8, blendMode: 'multiply' },
            { frameCount: 45, speed: 0.7, opacity: 0.6, blendMode: 'screen' },
            { frameCount: 90, speed: 1.3, opacity: 0.4, blendMode: 'overlay' }
          ]}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="text-center text-white">
              <motion.h3
                className="text-5xl font-bold mb-8"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899, #3B82F6)',
                  backgroundSize: '300% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Multi-Dimensional Learning
              </motion.h3>
              <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
                {[
                  { icon: Globe, title: "Global Reach", desc: "Students worldwide" },
                  { icon: Shield, title: "Secure Platform", desc: "Protected learning" },
                  { icon: Clock, title: "24/7 Access", desc: "Learn anytime" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <item.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-slate-300">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </LayeredVideoScroll>

        {/* Single Video Scroll with Custom Content */}
        <VideoScrollEffect className="h-screen" frameCount={120}>
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, type: "spring" }}
          >
            <motion.div
              className="inline-block mb-8"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-16 h-16 text-white" />
              </div>
            </motion.div>
            <h3 className="text-4xl font-bold mb-6">Scroll-Driven Excellence</h3>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Every scroll reveals new possibilities. Experience the future of interactive education.
            </p>
          </motion.div>
        </VideoScrollEffect>
      </section>

      {/* About Section with Morphing Shapes */}
      <section id="about" className="min-h-screen py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-white mb-8">
              Why Choose ACADMATE?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We don't just teach, we transform. Our revolutionary approach combines technology, 
              expertise, and personalization to create extraordinary learning experiences.
            </p>
          </motion.div>

          {/* Feature Cards with 3D Effects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Rocket,
                title: "Accelerated Learning",
                description: "Advanced methodologies that help you learn faster and retain better",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Brain,
                title: "Smart AI Integration",
                description: "Personalized learning paths powered by artificial intelligence",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Trophy,
                title: "Proven Results",
                description: "98% success rate with students achieving their dream colleges",
                color: "from-orange-500 to-red-500"
              }
            ].map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Course Section */}
      <CoursesSection />

      {/* Success Stories with Parallax */}
      <SuccessStoriesSection scrollY={scrollYProgress} />

      {/* Contact Section with Animated Forms */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}

// Particle System Component
const ParticleSystem: React.FC = () => {
  const particles = Array.from({ length: 50 }, (_, i) => i)

  return (
    <div className="absolute inset-0">
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  )
}

// Feature Card with Holographic 3D Effects
const FeatureCard: React.FC<{
  icon: any
  title: string
  description: string
  color: string
  index: number
}> = ({ icon: Icon, title, description, color, index }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
    >
      <HolographicCard className="h-full">
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:border-white/20 transition-all duration-500 h-full"
             onMouseEnter={() => setIsHovered(true)}
             onMouseLeave={() => setIsHovered(false)}>
          
          <motion.div
            className="w-16 h-16 mb-6 rounded-2xl flex items-center justify-center mx-auto"
            style={{ 
              background: `linear-gradient(135deg, ${color.replace('from-', '').replace('to-', ', ')})` 
            }}
            animate={isHovered ? { 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360] 
            } : {}}
            transition={{ duration: 0.6 }}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
          
          <h3 className="text-2xl font-bold text-white mb-4 text-center">{title}</h3>
          <p className="text-slate-300 text-center leading-relaxed">{description}</p>
          
          {/* Animated particles inside card */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full"
                initial={{
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                }}
                animate={{
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        </div>
      </HolographicCard>
    </motion.div>
  )
}

// Courses Section with Interactive Elements
const CoursesSection: React.FC = () => {
  const [activeCourse, setActiveCourse] = useState(0)
  
  const courses = [
    { name: "NEET", icon: "🧬", students: "25,000+", success: "99%" },
    { name: "JEE", icon: "⚡", students: "20,000+", success: "97%" },
    { name: "CBSE", icon: "📚", students: "15,000+", success: "98%" },
    { name: "Foundation", icon: "🌟", students: "10,000+", success: "96%" }
  ]

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-8">Our Premium Courses</h2>
          <p className="text-xl text-slate-300">Comprehensive programs designed for excellence</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              className={`relative p-6 rounded-3xl cursor-pointer transition-all duration-500 ${
                activeCourse === index 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50' 
                  : 'bg-white/5 border border-white/10 hover:border-white/20'
              }`}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCourse(index)}
            >
              <div className="text-6xl mb-4 text-center">{course.icon}</div>
              <h3 className="text-2xl font-bold text-white text-center mb-4">{course.name}</h3>
              <div className="space-y-2 text-center">
                <div className="text-blue-400 font-semibold">{course.students} Students</div>
                <div className="text-green-400 font-semibold">{course.success} Success</div>
              </div>
              
              {activeCourse === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Success Stories with Parallax Effects
const SuccessStoriesSection: React.FC<{ scrollY: any }> = ({ scrollY }) => {
  const y = useTransform(scrollY, [0, 1], [0, -100])

  return (
    <section className="py-20 relative overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500" />
      </motion.div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-8">Success Stories</h2>
          <p className="text-xl text-slate-300">Dreams achieved, futures transformed</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Priya Sharma", rank: "AIR 1", exam: "NEET 2024", image: "👩‍🎓" },
            { name: "Rahul Gupta", rank: "AIR 3", exam: "JEE 2024", image: "👨‍🎓" },
            { name: "Ananya Singh", rank: "AIR 7", exam: "NEET 2024", image: "👩‍🎓" }
          ].map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl text-center group"
            >
              <div className="text-8xl mb-4">{story.image}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{story.name}</h3>
              <div className="text-green-400 font-semibold text-xl mb-2">{story.rank}</div>
              <div className="text-slate-300">{story.exam}</div>
              
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact Section with Animated Forms
const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-5xl font-bold text-white mb-8">Get in Touch</h2>
            <p className="text-xl text-slate-300 mb-12">
              Ready to transform your future? Contact us today and take the first step towards success.
            </p>

            {[
              { icon: Phone, text: "+91 98765 43210", href: "tel:+919876543210" },
              { icon: Mail, text: "info@acadmate.com", href: "mailto:info@acadmate.com" },
              { icon: MapPin, text: "123 Education Street, Mumbai, India", href: "#" }
            ].map((contact, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, x: 10 }}
                className="flex items-center space-x-4 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <contact.icon className="w-6 h-6 text-white" />
                </div>
                <a href={contact.href} className="text-slate-300 hover:text-white transition-colors text-lg">
                  {contact.text}
                </a>
              </motion.div>
            ))}

            {/* Social Media */}
            <div className="flex space-x-4 pt-8">
              {[Facebook, Twitter, Instagram, Youtube].map((Social, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all"
                >
                  <Social className="w-5 h-5 text-white" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-all"
                />
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  placeholder="Your Email"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
              
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="Subject"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-all"
              />
              
              <motion.textarea
                whileFocus={{ scale: 1.02 }}
                rows={6}
                placeholder="Your Message"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-all resize-none"
              />
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 rounded-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="bg-black/50 border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Atom className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">ACADMATE</span>
            </div>
            <p className="text-slate-400">
              Transforming futures through exceptional education and innovative learning experiences.
            </p>
          </div>
          
          {[
            {
              title: "Courses",
              links: ["NEET Preparation", "JEE Preparation", "CBSE Coaching", "Foundation Courses"]
            },
            {
              title: "Company",
              links: ["About Us", "Our Faculty", "Success Stories", "Careers"]
            },
            {
              title: "Support",
              links: ["Contact Us", "Help Center", "Privacy Policy", "Terms of Service"]
            }
          ].map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-slate-400">
          <p>&copy; 2024 ACADMATE. All rights reserved. Built with ❤️ for your success.</p>
        </div>
      </div>
    </footer>
  )
}

export default MainHomepage