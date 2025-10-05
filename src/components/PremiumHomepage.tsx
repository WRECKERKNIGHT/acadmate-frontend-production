// stray jsx causing syntax error
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Matrix Rain Effect Component
const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}ACADMATE";
    const matrixArray = matrix.split("");
    const fontSize = 12;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    function draw() {
      if (!ctx || !canvas) return;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ffff';
      ctx.font = fontSize + 'px "Courier New", monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 35);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-30 z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

// Neural Network Animation
const NeuralNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const nodes: Array<{x: number; y: number; vx: number; vy: number}> = [];
    
    for (let i = 0; i < 80; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8
      });
    }
    
    let animationId: number;
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Draw node with glow effect
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 8);
        gradient.addColorStop(0, '#00ffff');
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const distance = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
            );
            
            if (distance < 120) {
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              ctx.strokeStyle = `rgba(0, 255, 255, ${(1 - distance / 120) * 0.5})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-40 z-0"
    />
  );
};

// Morphing 3D Sphere
const MorphingSphere: React.FC = () => {
  const sphereRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const sphere = sphereRef.current;
    if (!sphere) return;
    
    let animationId: number;
    let time = 0;
    
    const animate = () => {
      time += 0.02;
      
      const scale = 1 + Math.sin(time) * 0.3;
      const rotateX = Math.sin(time * 0.7) * 30;
      const rotateY = Math.cos(time * 0.5) * 25;
      const translateY = Math.sin(time * 0.3) * 20;
      
      sphere.style.transform = `
        translate(-50%, -50%) 
        translateY(${translateY}px)
        scale(${scale}) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
      `;
      
      // Morphing effect with CSS variables
      const hue = (time * 50) % 360;
      sphere.style.filter = `hue-rotate(${hue}deg) blur(1px)`;
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return (
    <div 
      ref={sphereRef}
      className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full opacity-20 pointer-events-none z-10"
      style={{
        background: `
          conic-gradient(from 0deg, #00ffff, #ff00ff, #ffff00, #00ff00, #00ffff),
          radial-gradient(circle, rgba(0,255,255,0.3) 0%, transparent 70%)
        `,
        boxShadow: `
          0 0 100px #00ffff,
          inset 0 0 100px rgba(255,255,255,0.1)
        `,
        animation: 'morphing 4s ease-in-out infinite alternate'
      }}
    />
  );
};

// Glitch Text Effect
const GlitchText: React.FC<{ children: string; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <span className="relative z-10 animate-pulse">{children}</span>
      <span 
        className="absolute top-0 left-0 text-red-500 opacity-70"
        style={{ 
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', 
          animation: 'glitch1 0.3s ease-in-out infinite alternate' 
        }}
      >
        {children}
      </span>
      <span 
        className="absolute top-0 left-0 text-blue-500 opacity-70"
        style={{ 
          clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)', 
          animation: 'glitch2 0.4s ease-in-out infinite alternate-reverse' 
        }}
      >
        {children}
      </span>
    </div>
  );
};

// Holographic Card
const HolographicCard: React.FC<{ 
  title: string; 
  description: string; 
  icon: string; 
  delay?: number;
}> = ({ title, description, icon, delay = 0 }) => {
  return (
    <motion.div
      className="group relative cursor-pointer h-full"
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 8, 
        rotateX: 5,
        z: 50
      }}
      style={{ perspective: 1000 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
      
      <div className="relative bg-black/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 h-full overflow-hidden group-hover:border-cyan-400/60 transition-all duration-500 transform-gpu">
        {/* Animated border */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse" style={{animationDelay: '0.25s'}}></div>
          <div className="absolute right-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-pulse" style={{animationDelay: '0.75s'}}></div>
        </div>
        
        {/* Holographic overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
        
        <div className="relative z-10">
          <motion.div 
            className="text-5xl mb-6"
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {icon}
          </motion.div>
          
          <motion.h3 
            className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-500"
          >
            {title}
          </motion.h3>
          
          <p className="text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors duration-500">
            {description}
          </p>
        </div>
        
        {/* Corner accents */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-500/20 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-tr-full opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </motion.div>
  );
};

// Particle Field
const ParticleField: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const particles: HTMLDivElement[] = [];
    
    for (let i = 0; i < 100; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-cyan-400 rounded-full opacity-70 animate-ping';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 3}s`;
      particle.style.animationDuration = `${2 + Math.random() * 3}s`;
      
      container.appendChild(particle);
      particles.push(particle);
    }
    
    return () => {
      particles.forEach(p => p.remove());
    };
  }, []);
  
  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />;
};

const PremiumHomepage: React.FC = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  // Parallax transforms
  const y1 = useTransform(scrollY, [0, 300], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.3]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Effects */}
      <MatrixRain />
      <NeuralNetwork />
      <ParticleField />
      
      {/* Mouse follower glow */}
      <motion.div
        className="fixed w-96 h-96 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,255,0.15) 0%, rgba(128,0,128,0.1) 50%, transparent 100%)',
          filter: 'blur(40px)',
          x: mousePos.x - 192,
          y: mousePos.y - 192,
        }}
      />
      
      {/* Hero Section with 3D Spline and more VFX */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center px-4"
        style={{ y: y1, opacity, scale }}
      >
        {/* 3D Spline or SVG CGI Hero */}
        <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
          <iframe
            src="https://prod.spline.design/6Q2QwQv7nQw6QwQw/scene.splinecode"
            title="3D CGI Hero"
            frameBorder="0"
            width="100%"
            height="100%"
            style={{ minHeight: 600, opacity: 0.7, filter: 'drop-shadow(0 0 80px #00fff7) blur(1px)' }}
            allowFullScreen
          />
        </div>
        <MorphingSphere />
        <div className="relative z-20 text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.5, type: "spring", stiffness: 80 }}
          >
            <GlitchText className="text-8xl md:text-9xl font-black mb-8 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_#00fff7]">
              ACADMATE
            </GlitchText>
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6 text-cyan-300 drop-shadow-[0_0_40px_#00fff7]"
              animate={{
                textShadow: [
                  "0 0 40px #00ffff",
                  "0 0 80px #ff00ff",
                  "0 0 40px #00ffff"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🏆 PREMIUM COACHING INSTITUTE
            </motion.h2>
          </motion.div>
          <motion.p
            className="text-2xl md:text-3xl text-cyan-200 mb-12 leading-relaxed max-w-4xl mx-auto drop-shadow-[0_0_20px_#00fff7]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            🎯 Master JEE • NEET • Boards with <span className="text-pink-400 font-bold">Revolutionary AI-Powered Learning</span>
            <br />
            ⚡ <span className="text-purple-400 font-bold">Live Classes</span> • <span className="text-cyan-400 font-bold">Expert Faculty</span> • <span className="text-yellow-300 font-bold">24/7 Doubt Solving</span> • <span className="text-green-400 font-bold">Performance Analytics</span>
          </motion.p>
          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <motion.button
              onClick={() => navigate('/login')}
              className="group relative px-12 py-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full font-bold text-2xl overflow-hidden transition-all duration-300 shadow-[0_0_40px_#00fff7]"
              whileHover={{ 
                scale: 1.12, 
                rotateX: 10,
                boxShadow: "0 20px 60px #00fff7"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                🚀 Enter Platform
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 animate-pulse bg-white/10"></div>
            </motion.button>
            <motion.button
              className="group relative px-12 py-6 border-2 border-cyan-400 text-cyan-400 rounded-full font-bold text-2xl overflow-hidden transition-all duration-300 hover:bg-cyan-400 hover:text-black shadow-[0_0_40px_#00fff7]"
              whileHover={{ 
                scale: 1.12, 
                rotateX: -10,
                boxShadow: "0 20px 60px #00fff7"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                📚 Explore Courses
              </span>
            </motion.button>
          </motion.div>
          {/* Achievement Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            {[
              { number: "15,000+", label: "Success Stories", icon: "🏆" },
              { number: "99.2%", label: "Success Rate", icon: "⭐" },
              { number: "200+", label: "Expert Faculty", icon: "👨‍🏫" },
              { number: "24/7", label: "AI Support", icon: "🤖" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center p-6 rounded-2xl bg-black/60 backdrop-blur-2xl border border-cyan-500/40 hover:border-cyan-400/80 transition-colors duration-300 shadow-[0_0_40px_#00fff7]"
                whileHover={{ scale: 1.08, y: -8 }}
                animate={{
                  boxShadow: [
                    "0 0 40px #00fff7",
                    "0 0 60px #ff00ff",
                    "0 0 40px #00fff7"
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 3, repeat: Infinity },
                  hover: { duration: 0.2 }
                }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-cyan-300 mb-1">{stat.number}</div>
                <div className="text-lg text-cyan-100">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
          </div> {/* <-- Close the Hero section's main content div */}
        	{/* Scroll Indicator */}
        	<motion.div
        	  className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        	  animate={{ y: [0, 15, 0] }}
        	  transition={{ repeat: Infinity, duration: 2 }}
        	>
        	  <div className="w-8 h-12 border-2 border-cyan-400 rounded-full flex justify-center pt-2">
        		<motion.div 
        		  className="w-1 h-3 bg-cyan-400 rounded-full"
        		  animate={{ y: [0, 16, 0] }}
        		  transition={{ repeat: Infinity, duration: 2 }}
        		/>
        	  </div>
        	</motion.div>
        </motion.section>
      
      {/* Features Section */}
      <motion.section 
        className="relative py-20 px-4 z-10"
        style={{ y: y2 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlitchText className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              🌟 REVOLUTIONARY FEATURES
            </GlitchText>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience cutting-edge educational technology that adapts to your learning style
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <HolographicCard
              title="🧠 AI-Powered Learning"
              description="Advanced neural networks analyze your performance and create personalized study paths for maximum efficiency and retention."
              icon="🤖"
              delay={0.1}
            />
            
            <HolographicCard
              title="📊 Real-Time Analytics"
              description="Comprehensive performance tracking with predictive insights, weakness identification, and progress optimization."
              icon="📈"
              delay={0.2}
            />
            
            <HolographicCard
              title="🌐 Virtual Lab"
              description="Immersive 3D simulations and interactive experiments that bring complex concepts to life in virtual reality."
              icon="🔬"
              delay={0.3}
            />
            
            <HolographicCard
              title="👨‍🏫 Expert Mentorship"
              description="Direct access to IIT/NIT graduates and top educators with personalized guidance and doubt resolution."
              icon="🎯"
              delay={0.4}
            />
            
            <HolographicCard
              title="📱 Mobile Excellence"
              description="Seamless cross-platform experience with offline capabilities and synchronized progress tracking."
              icon="📲"
              delay={0.5}
            />
            
            <HolographicCard
              title="🏆 Guaranteed Results"
              description="Proven success methodology with 99.2% success rate and money-back guarantee for dedicated students."
              icon="✅"
              delay={0.6}
            />
          </div>
        </div>
      </motion.section>
      
      {/* Final CTA */}
      <section className="relative py-20 px-4 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative p-12 rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 to-cyan-900/60 backdrop-blur-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
            
            <div className="relative z-10">
              <GlitchText className="text-5xl md:text-6xl font-bold mb-8">
                🚀 READY TO DOMINATE?
              </GlitchText>
              
              <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed">
                Join 15,000+ successful students who transformed their dreams into reality
                <br />
                <span className="text-cyan-400 font-semibold">Your Success Story Starts Now!</span>
              </p>
              
              <motion.button
                onClick={() => navigate('/login')}
                className="px-12 py-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-bold text-2xl transition-all duration-300 relative overflow-hidden group"
                whileHover={{ 
                  scale: 1.15, 
                  rotateY: 10,
                  boxShadow: "0 30px 60px rgba(0, 255, 255, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">🎯 BEGIN TRANSFORMATION</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Custom Styles */}
  <style>{`
        @keyframes morphing {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
        
        @keyframes glitch1 {
          0% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
          100% { transform: translateX(0); }
        }
        
        @keyframes glitch2 {
          0% { transform: translateX(0); }
          25% { transform: translateX(2px); }
          50% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default PremiumHomepage;