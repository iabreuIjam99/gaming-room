import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, Twitter, Mail, Coffee } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub', color: 'text-neon-green' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'text-neon-blue' },
    { icon: Mail, href: '#', label: 'Email', color: 'text-neon-pink' },
    { icon: Coffee, href: '#', label: 'Buy me a coffee', color: 'text-neon-yellow' }
  ];

  return (
    <motion.footer 
      className="bg-gradient-to-r from-arcade-black via-arcade-gray to-arcade-black 
                 border-t-4 border-neon-green mt-16"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Game Stats */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-neon-green font-arcade text-lg mb-4">GAME STATS</h3>
            <div className="space-y-2 font-pixel text-xs">
              <div className="flex justify-between text-neon-blue">
                <span>Games Available:</span>
                <span className="text-neon-yellow">4</span>
              </div>
              <div className="flex justify-between text-neon-blue">
                <span>Total Players:</span>
                <span className="text-neon-yellow">1,337</span>
              </div>
              <div className="flex justify-between text-neon-blue">
                <span>High Scores Set:</span>
                <span className="text-neon-yellow">2,048</span>
              </div>
              <div className="flex justify-between text-neon-blue">
                <span>Arcade Level:</span>
                <span className="text-neon-yellow">LEGENDARY</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-neon-green font-arcade text-lg mb-4">QUICK ACCESS</h3>
            <div className="grid grid-cols-2 gap-2 font-pixel text-xs">
              {['SNAKE', 'TETRIS', 'CHECKERS', 'DOMINOES'].map((game, index) => (
                <motion.button
                  key={game}
                  className="text-left text-neon-blue hover:text-neon-pink transition-colors duration-200
                           border border-neon-blue/30 rounded px-2 py-1 hover:border-neon-pink/50"
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {game}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-neon-green font-arcade text-lg mb-4">CONNECT</h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map(({ icon: Icon, href, label, color }, index) => (
                <motion.a
                  key={label}
                  href={href}
                  className={`${color} hover:scale-110 transition-all duration-200 
                             border border-current rounded-full p-3 hover:shadow-lg 
                             hover:shadow-current/50 group`}
                  whileHover={{ rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  title={label}
                >
                  <Icon className="w-5 h-5 group-hover:animate-pulse" />
                </motion.a>
              ))}
            </div>
            
            {/* Fun Quote */}
            <motion.div 
              className="mt-6 p-4 border border-neon-green/30 rounded-lg bg-arcade-black/50"
              animate={{ 
                boxShadow: [
                  '0 0 10px rgba(0, 255, 65, 0.3)',
                  '0 0 20px rgba(0, 255, 65, 0.5)',
                  '0 0 10px rgba(0, 255, 65, 0.3)'
                ]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <p className="font-pixel text-xs text-neon-green/80 text-center leading-relaxed">
                "Insert coin to continue..."
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-neon-green/30 pt-6 flex flex-col md:flex-row 
                     justify-between items-center space-y-4 md:space-y-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center space-x-2 text-neon-green/80 font-pixel text-xs">
            <span>© {currentYear} Arcade Game Room</span>
            <span>•</span>
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Heart className="w-3 h-3 text-neon-pink fill-current" />
            </motion.div>
            <span>and lots of coffee</span>
          </div>

          <div className="flex items-center space-x-4 font-pixel text-xs text-neon-blue/80">
            <span>RETRO GAMING EXPERIENCE</span>
            <motion.div
              className="flex space-x-1"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="w-2 h-2 bg-neon-green rounded-full"></div>
              <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
              <div className="w-2 h-2 bg-neon-pink rounded-full"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;