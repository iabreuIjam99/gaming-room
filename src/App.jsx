import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import GameMenu from './components/GameMenu';
import Snake from './games/snake/Snake';
import Tetris from './games/tetris/Tetris';
import Checkers from './games/checkers/Checkers';
import Dominoes from './games/dominoes/Dominoes';
import Header from './components/Header';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-arcade-black via-arcade-gray to-arcade-black 
                      scanline-effect relative overflow-hidden">
        
        {/* Animated Background Elements */}
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 border border-neon-green animate-pulse rounded-full"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border border-neon-blue animate-pulse rounded-full"></div>
          <div className="absolute bottom-20 left-32 w-40 h-40 border border-neon-pink animate-pulse rounded-full"></div>
          <div className="absolute bottom-32 right-10 w-28 h-28 border border-neon-yellow animate-pulse rounded-full"></div>
        </div>

        <div className="relative z-10">
          <Header />
          
          <main className="container mx-auto px-4 py-8 min-h-screen">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Routes>
                <Route path="/" element={<GameMenu />} />
                <Route path="/snake" element={<Snake />} />
                <Route path="/tetris" element={<Tetris />} />
                <Route path="/checkers" element={<Checkers />} />
                <Route path="/dominoes" element={<Dominoes />} />
              </Routes>
            </motion.div>
          </main>
          
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;