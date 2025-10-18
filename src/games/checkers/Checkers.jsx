import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Checkers = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Game Title */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-6xl font-bold mb-6 arcade-glow text-neon-pink"
      >
        CYBER CHECKERS
      </motion.h1>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="text-neon-yellow text-xl mb-8 animate-pulse">
          ♟️ COMING SOON ♟️
        </div>
        
        <div className="text-gray-400 text-lg mb-8">
          Strategic board game reimagined
        </div>

        <div className="space-y-4">
          <div className="text-6xl animate-bounce">
            🚧
          </div>
          
          <p className="text-gray-400 max-w-md">
            The classic strategy game is being enhanced with cyber aesthetics. 
            Prepare for neon-powered tactical gameplay!
          </p>
          
          <button
            onClick={() => navigate('/')}
            className="arcade-button text-lg px-8 py-4 border-neon-pink text-neon-pink hover:border-neon-green hover:text-neon-green mt-6"
          >
            BACK TO MENU
          </button>
        </div>
      </motion.div>

      {/* Scanline Effect */}
      <div className="scanline"></div>
    </div>
  );
};

export default Checkers;