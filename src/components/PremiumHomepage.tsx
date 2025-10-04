import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ChevronRightIcon, StarIcon, PlayIcon, CheckCircleIcon, UsersIcon, BookOpenIcon, TrophyIcon, ClockIcon, PhoneIcon, MailIcon, MapPinIcon, FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from '@heroicons/react/24/outline'

interface PremiumHomepageProps {
  onLoginClick: () => void
}

const PremiumHomepage: React.FC<PremiumHomepageProps> = ({ onLoginClick }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const { scrollY } = useScroll()
  const springScrollY = useSpring(scrollY, { stiffness: 100, damping: 30 })
  
  // Parallax effects
  const heroY = useTransform(springScrollY, [0, 500], [0, -150])
  const heroOpacity = useTransform(springScrollY, [0, 300], [1, 0.3])
  const particlesY = useTransform(springScrollY, [0, 1000], [0, -300])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    {
      icon: BookOpenIcon,
      title: "Interactive Learning",
      description: "Advanced AI-powered learning modules with personalized curriculum",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      icon: UsersIcon,
      title: "Expert Faculty",
      description: "Learn from industry experts with 10+ years of teaching experience",
      gradient: "from-purple-500 to-pink-400"
    },
    {
      icon: TrophyIcon,
      title: "100% Results",
      description: "Guaranteed success with our proven track record of achievements",
      gradient: "from-green-500 to-emerald-400"
    },
    {
      icon: ClockIcon,
      title: "24/7 Support",
      description: "Round-the-clock doubt solving and mentorship support",
      gradient: "from-orange-500 to-red-400"
    }
  ]

  const stats = [
    { number: "10K+", label: "Students Enrolled" },
    { number: "95%", label: "Success Rate" },
    { number: "50+", label: "Expert Teachers" },
    { number: "24/7", label: "Support Available" }
  ]

  const testimonials = [
    {
      name: "Arjun Kumar",
      role: "IIT Delhi Graduate",
      image: "/api/placeholder/80/80",
      text: "ACADMATE transformed my preparation journey. The personalized approach and expert guidance helped me crack JEE Advanced with AIR 47!"
    },
    {
      name: "Priya Sharma",
      role: "NEET Qualifier",
      image: "/api/placeholder/80/80", 
      text: "The comprehensive study material and mock tests were game-changers. Highly recommend ACADMATE for serious aspirants!"
    },
    {
      name: "Rahul Patel",
      role: "IIT Bombay Student",
      image: "/api/placeholder/80/80",
      text: "Best coaching experience ever! The faculty's teaching methodology and doubt-solving sessions are absolutely phenomenal."
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        {/* Floating Particles */}
        <motion.div
          style={{ y: particlesY }}
          className="absolute inset-0"
        >
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-70"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </motion.div>

        {/* Mouse Follower Glow */}
        <div 
          className="absolute w-96 h-96 bg-gradient-radial from-cyan-400/20 via-purple-500/10 to-transparent rounded-full pointer-events-none transition-all duration-300"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            filter: 'blur(40px)'
          }}
        />
      </div>

      {/* Header */}
      <motion.header 
        className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/80 border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold gradient-text">ACADMATE</span>
            </motion.div>

            <nav className="hidden md:flex items-center space-x-8">
              {['Home', 'Features', 'About', 'Contact'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-colors relative group"
                  whileHover={{ y: -2 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </motion.a>
              ))}
            </nav>

            <motion.button
              onClick={onLoginClick}
              className="btn-primary px-8 py-3 rounded-full text-sm font-semibold flex items-center space-x-2"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 212, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Login</span>
              <ChevronRightIcon className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-black mb-6 leading-tight"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.5, type: "spring" }}
            >
              <span className="block gradient-text mb-4">ACADMATE</span>
              <span className="block text-4xl md:text-5xl font-semibold text-white/90">
                Elite Coaching Institute
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Transform your future with India's most advanced learning platform. 
              <span className="text-cyan-400 font-semibold"> AI-powered education</span>, 
              <span className="text-purple-400 font-semibold"> expert mentorship</span>, and 
              <span className="text-green-400 font-semibold"> guaranteed results</span>.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
          >
            <motion.button
              className="btn-primary px-12 py-4 text-lg font-bold rounded-full flex items-center space-x-3"
              whileHover={{ scale: 1.1, boxShadow: "0 0 40px rgba(0, 212, 255, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onLoginClick}
            >
              <span>Start Learning Today</span>
              <ChevronRightIcon className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              className="group flex items-center space-x-3 px-8 py-4 border-2 border-white/20 rounded-full hover:border-white/40 transition-all"
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsVideoPlaying(true)}
            >
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all">
                <PlayIcon className="w-5 h-5 text-white ml-1" />
              </div>
              <span className="text-lg font-semibold">Watch Demo</span>
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-black gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm md:text-base font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
            <div className="w-1 h-3 bg-white/50 rounded-full mx-auto animate-pulse"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black gradient-text mb-6">
              Why Choose ACADMATE?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of education with our cutting-edge platform designed for success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="card p-8 h-full text-center relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-black gradient-text mb-8">About ACADMATE</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Founded with a vision to revolutionize education, ACADMATE combines cutting-edge technology 
                with proven teaching methodologies to deliver unparalleled learning experiences.
              </p>
              
              <div className="space-y-6 mb-10">
                {[
                  "AI-powered personalized learning paths",
                  "Live interactive classes with expert faculty", 
                  "Comprehensive test series and analytics",
                  "24/7 doubt resolution and mentorship"
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-4"
                  >
                    <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="btn-primary px-8 py-4 rounded-full text-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                onClick={onLoginClick}
              >
                Join Our Community
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden">
                <img 
                  src="/api/placeholder/600/400" 
                  alt="ACADMATE Learning Environment"
                  className="w-full h-auto rounded-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-purple-600/20 rounded-3xl"></div>
              </div>
              
              {/* Floating Achievement Cards */}
              <motion.div
                className="absolute -top-6 -left-6 bg-black/90 backdrop-blur-md rounded-2xl p-4 border border-white/10"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                    <TrophyIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">95% Success Rate</div>
                    <div className="text-gray-400 text-sm">This Year</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -right-6 bg-black/90 backdrop-blur-md rounded-2xl p-4 border border-white/10"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">10K+ Students</div>
                    <div className="text-gray-400 text-sm">Enrolled</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black gradient-text mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Hear from our students who have achieved their dreams with ACADMATE
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="card p-8 relative overflow-hidden"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-white">{testimonial.name}</h4>
                    <p className="text-cyan-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black gradient-text mb-6">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Ready to start your journey? Contact us today for personalized guidance
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center">
                  <PhoneIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Call Us</h3>
                  <p className="text-gray-400">+91 9876543210</p>
                  <a
                    href="https://wa.me/919876543210"
                    className="text-green-400 hover:text-green-300 transition-colors inline-flex items-center space-x-2 mt-2"
                  >
                    <span>WhatsApp</span>
                    <ChevronRightIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-400 rounded-2xl flex items-center justify-center">
                  <MailIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Email Us</h3>
                  <p className="text-gray-400">info@acadmate.com</p>
                  <p className="text-gray-400">support@acadmate.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center">
                  <MapPinIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Visit Us</h3>
                  <p className="text-gray-400">
                    123, Education Hub,<br />
                    Tech City, Delhi - 110001
                  </p>
                </div>
              </div>

              <div className="pt-8">
                <h3 className="text-2xl font-bold text-white mb-6">Follow Us</h3>
                <div className="flex space-x-4">
                  {[
                    { icon: FacebookIcon, color: "from-blue-600 to-blue-500" },
                    { icon: TwitterIcon, color: "from-sky-500 to-blue-400" },
                    { icon: InstagramIcon, color: "from-pink-500 to-orange-400" },
                    { icon: YoutubeIcon, color: "from-red-600 to-red-500" }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center hover:scale-110 transition-transform`}
                      whileHover={{ y: -3 }}
                    >
                      <social.icon className="w-6 h-6 text-white" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="card p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    className="input"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea
                    className="input resize-none h-32"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                <motion.button
                  type="submit"
                  className="w-full btn-primary py-4 text-lg font-semibold rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <motion.div
              className="flex items-center justify-center space-x-3 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">A</span>
              </div>
              <span className="text-3xl font-bold gradient-text">ACADMATE</span>
            </motion.div>
            
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Empowering students to achieve their dreams through innovative education technology
              and expert mentorship. Your success is our mission.
            </p>
            
            <div className="text-gray-500">
              <p>&copy; 2024 ACADMATE. All rights reserved.</p>
              <p className="mt-2">Designed with ❤️ for future achievers</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
          onClick={() => setIsVideoPlaying(false)}
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            className="relative max-w-4xl w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <PlayIcon className="w-20 h-20 text-white/50 mx-auto mb-4" />
                <p className="text-white/70">Demo video coming soon...</p>
              </div>
            </div>
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <span className="text-white text-xl">×</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default PremiumHomepage