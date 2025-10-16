import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Zap, Star } from 'lucide-react';

const Header = () => {
  return (
    <motion.header 
      className="bg-gradient-to-r from-arcade-black via-arcade-gray to-arcade-black 
                 border-b-4 border-neon-green shadow-lg shadow-neon-green/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative">
              <Gamepad2 className="w-12 h-12 text-neon-green animate-neon-pulse" />
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-neon-yellow rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-arcade font-bold neon-text">
                ARCADE
              </h1>
              <p className="text-neon-blue font-pixel text-xs tracking-widest">
                GAME ROOM
              </p>
            </div>
          </motion.div>

          {/* Status Indicators */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.div 
              className="flex items-center space-x-2 text-neon-yellow"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Zap className="w-5 h-5" />
              <span className="font-pixel text-xs">ONLINE</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-2 text-neon-pink"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <Star className="w-5 h-5" />
              <span className="font-pixel text-xs">HIGH SCORE</span>
            </motion.div>
          </div>
        </div>

        {/* Subtitle */}
        <motion.div 
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <p className="text-neon-green/80 font-arcade text-sm tracking-wider">
            Experience the Golden Age of Gaming
          </p>
          <div className="mt-2 flex justify-center space-x-2">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-neon-green rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  delay: i * 0.1 
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;