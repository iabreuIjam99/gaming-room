import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GameMenu = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);

  console.log('GameMenu component loaded');

  // Game data with arcade styling
  const games = [
    {
      id: 'snake',
      title: 'SNAKE CLASSIC',
      description: 'Classic snake game with neon graphics',
      difficulty: 'EASY',
      players: '1 PLAYER',
      color: 'neon-green',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-neon-green',
      icon: '🐍',
      route: '/snake',
      status: 'READY'
    },
    {
      id: 'tetris',
      title: 'NEON TETRIS',
      description: 'Block puzzle with arcade beats',
      difficulty: 'MEDIUM',
      players: '1 PLAYER',
      color: 'neon-blue',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-neon-blue',
      icon: '🧩',
      route: '/tetris',
      status: 'COMING SOON'
    },
    {
      id: 'checkers',
      title: 'CYBER CHECKERS',
      description: 'Strategic board game reimagined',
      difficulty: 'HARD',
      players: '2 PLAYERS',
      color: 'neon-pink',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-neon-pink',
      icon: '♟️',
      route: '/checkers',
      status: 'COMING SOON'
    },
    {
      id: 'dominoes',
      title: 'RETRO DOMINOES',
      description: 'Classic dominoes with style',
      difficulty: 'MEDIUM',
      players: '2-4 PLAYERS',
      color: 'neon-yellow',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-neon-yellow',
      icon: '⚫',
      route: '/dominoes',
      status: 'COMING SOON'
    }
  ];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedGame((prev) => (prev - 1 + games.length) % games.length);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedGame((prev) => (prev + 1) % games.length);
          break;
        case 'Enter':
          e.preventDefault();
          handleGameSelect(games[selectedGame]);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedGame, games]);

  const handleGameSelect = (game) => {
    console.log('Game selected:', game);
    if (game.status === 'COMING SOON') {
      // Flash effect for coming soon games
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 1000);
      return;
    }
    console.log('Navigating to:', game.route);
    navigate(game.route);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Title */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl md:text-8xl font-bold mb-4 arcade-glow">
          <span className="text-neon-green">ARCADE</span>
          <span className="text-neon-pink ml-4">ROOM</span>
        </h1>
        <div className="flex items-center justify-center space-x-2 text-neon-blue text-xl">
          <span className="animate-pulse">●</span>
          <span>SELECT YOUR GAME</span>
          <span className="animate-pulse">●</span>
        </div>
      </motion.div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.2,
              type: "spring",
              stiffness: 100
            }}
            className={`
              relative cursor-pointer group transition-all duration-300
              ${selectedGame === index ? 'scale-105' : 'scale-100'}
              ${isFlashing && selectedGame === index ? 'animate-pulse' : ''}
            `}
            onMouseEnter={() => setSelectedGame(index)}
            onClick={() => handleGameSelect(game)}
          >
            {/* Game Card */}
            <div className={`
              relative p-6 rounded-lg border-2 transition-all duration-300
              ${selectedGame === index 
                ? `${game.borderColor} ${game.bgColor} shadow-2xl arcade-glow-box` 
                : 'border-gray-600 bg-gray-800/50'
              }
              hover:${game.borderColor} hover:${game.bgColor}
            `}>
              
              {/* Selection Indicator */}
              {selectedGame === index && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-neon-green rounded-full flex items-center justify-center"
                >
                  <span className="text-black text-xs font-bold">►</span>
                </motion.div>
              )}

              {/* Game Icon */}
              <div className="text-center mb-4">
                <span className="text-6xl filter drop-shadow-lg">
                  {game.icon}
                </span>
              </div>

              {/* Game Title */}
              <h3 className={`
                text-2xl font-bold text-center mb-3 transition-colors duration-300
                ${selectedGame === index ? `text-${game.color}` : 'text-white'}
              `}>
                {game.title}
              </h3>

              {/* Game Description */}
              <p className="text-gray-300 text-center mb-4 text-sm">
                {game.description}
              </p>

              {/* Game Stats */}
              <div className="flex justify-between items-center text-xs mb-4">
                <span className={`
                  px-3 py-1 rounded-full border transition-colors duration-300
                  ${selectedGame === index 
                    ? `border-${game.color} text-${game.color}` 
                    : 'border-gray-500 text-gray-400'
                  }
                `}>
                  {game.difficulty}
                </span>
                <span className={`
                  transition-colors duration-300
                  ${selectedGame === index ? `text-${game.color}` : 'text-gray-400'}
                `}>
                  {game.players}
                </span>
              </div>

              {/* Status */}
              <div className="text-center">
                {game.status === 'COMING SOON' ? (
                  <span className="text-red-400 text-sm font-bold animate-pulse">
                    🚧 COMING SOON 🚧
                  </span>
                ) : game.status === 'READY' ? (
                  <span className="text-neon-green text-sm font-bold">
                    ✓ READY TO PLAY
                  </span>
                ) : (
                  <span className="text-neon-green text-sm font-bold">
                    ✓ READY TO PLAY
                  </span>
                )}
              </div>

              {/* Hover Effect Lines */}
              <div className={`
                absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
                ${selectedGame === index ? 'opacity-100' : ''}
              `}>
                <div className={`absolute top-0 left-0 w-full h-0.5 bg-${game.color} animate-pulse`}></div>
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-${game.color} animate-pulse`}></div>
                <div className={`absolute top-0 left-0 w-0.5 h-full bg-${game.color} animate-pulse`}></div>
                <div className={`absolute top-0 right-0 w-0.5 h-full bg-${game.color} animate-pulse`}></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Controls Info */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-12 text-center"
      >
        <div className="text-gray-400 text-sm space-y-2">
          <p>🎮 Use ↑↓ ARROW KEYS to navigate</p>
          <p>⚡ Press ENTER to select</p>
          <p>🖱️ Or click with mouse</p>
        </div>
      </motion.div>

      {/* Scanline Effect */}
      <div className="scanline"></div>
    </div>
  );
};

export default GameMenu;