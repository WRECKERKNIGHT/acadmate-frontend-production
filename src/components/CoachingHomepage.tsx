import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CoachingHomepage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-purple-900 to-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Neon Bubbles Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/20 blur-2xl"
            style={{
              width: `${60 + Math.random() * 120}px`,
              height: `${60 + Math.random() * 120}px`,
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              opacity: 0.5 + Math.random() * 0.3,
            }}
            animate={{
              y: [0, Math.random() * 40 - 20, 0],
              x: [0, Math.random() * 40 - 20, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-6 drop-shadow-lg"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          ACADMATE COACHING
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          The most advanced, premium coaching platform for ambitious students. <br />
          <span className="text-cyan-400 font-semibold">Unlock your potential with CGI, neon, and 3D-powered learning.</span>
        </motion.p>
        <motion.button
          className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-bold text-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/login')}
        >
          Get Started
        </motion.button>
      </div>
    </div>
  );
};

export default CoachingHomepage;
