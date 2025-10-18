import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Snake = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'paused', 'gameOver'
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(localStorage.getItem('snakeHighScore') || 0);
  const [speed, setSpeed] = useState(150);

  const BOARD_SIZE = 20;

  // Generate random food position
  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  // Reset game
  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 0, y: 0 });
    setScore(0);
    setSpeed(150);
    setGameState('menu');
  };

  // Start game
  const startGame = () => {
    resetGame();
    setGameState('playing');
    setDirection({ x: 1, y: 0 });
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState === 'menu') {
        if (e.key === 'Enter') startGame();
        if (e.key === 'Escape') navigate('/');
        return;
      }

      if (gameState === 'playing') {
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            if (direction.y === 0) setDirection({ x: 0, y: -1 });
            break;
          case 'ArrowDown':
            e.preventDefault();
            if (direction.y === 0) setDirection({ x: 0, y: 1 });
            break;
          case 'ArrowLeft':
            e.preventDefault();
            if (direction.x === 0) setDirection({ x: -1, y: 0 });
            break;
          case 'ArrowRight':
            e.preventDefault();
            if (direction.x === 0) setDirection({ x: 1, y: 0 });
            break;
          case ' ':
            e.preventDefault();
            setGameState('paused');
            break;
          case 'Escape':
            setGameState('menu');
            break;
        }
      }

      if (gameState === 'paused') {
        if (e.key === ' ') setGameState('playing');
        if (e.key === 'Escape') setGameState('menu');
      }

      if (gameState === 'gameOver') {
        if (e.key === 'Enter') startGame();
        if (e.key === 'Escape') navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, direction, navigate]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      setSnake(currentSnake => {
        const newSnake = [...currentSnake];
        const head = { ...newSnake[0] };
        
        head.x += direction.x;
        head.y += direction.y;

        // Check wall collision
        if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
          setGameState('gameOver');
          return currentSnake;
        }

        // Check self collision
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameState('gameOver');
          return currentSnake;
        }

        newSnake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(prev => {
            const newScore = prev + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('snakeHighScore', newScore);
            }
            return newScore;
          });
          setFood(generateFood());
          setSpeed(prev => Math.max(80, prev - 2)); // Increase speed
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameLoop);
  }, [gameState, direction, food, speed, generateFood, highScore]);

  // Render game board
  const renderBoard = () => {
    const board = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isHead = snake[0]?.x === x && snake[0]?.y === y;
        const isFood = food.x === x && food.y === y;

        board.push(
          <div
            key={`${x}-${y}`}
            className={`
              w-4 h-4 border border-gray-800
              ${isHead 
                ? 'bg-neon-green shadow-lg shadow-neon-green/50 animate-pulse' 
                : isSnake 
                ? 'bg-neon-green/80' 
                : isFood 
                ? 'bg-neon-pink animate-pulse shadow-lg shadow-neon-pink/50' 
                : 'bg-arcade-black'
              }
            `}
          />
        );
      }
    }
    return board;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Game Title */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-6xl font-bold mb-6 arcade-glow text-neon-green"
      >
        SNAKE CLASSIC
      </motion.h1>

      {gameState === 'menu' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="text-neon-blue text-xl mb-8">
            🐍 GET READY TO SLITHER 🐍
          </div>
          
          <div className="space-y-4">
            <button
              onClick={startGame}
              className="arcade-button text-lg px-8 py-4"
            >
              START GAME
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="arcade-button text-lg px-8 py-4 border-neon-pink text-neon-pink hover:border-neon-yellow hover:text-neon-yellow"
            >
              BACK TO MENU
            </button>
          </div>

          <div className="text-gray-400 text-sm space-y-2 mt-8">
            <p>🎮 Use ARROW KEYS to control</p>
            <p>⚡ SPACE to pause</p>
            <p>🏆 High Score: {highScore}</p>
          </div>
        </motion.div>
      )}

      {(gameState === 'playing' || gameState === 'paused') && (
        <div className="flex flex-col items-center space-y-6">
          {/* Score Display */}
          <div className="flex space-x-6">
            <div className="score-display">
              SCORE: {score}
            </div>
            <div className="score-display">
              HIGH: {highScore}
            </div>
          </div>

          {/* Game Board */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="game-board p-4"
          >
            <div 
              className="grid gap-0 bg-arcade-dark p-2 rounded"
              style={{ 
                gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`
              }}
            >
              {renderBoard()}
            </div>
          </motion.div>

          {/* Pause Overlay */}
          {gameState === 'paused' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
            >
              <div className="text-center">
                <h2 className="text-4xl font-bold text-neon-yellow mb-4 animate-pulse">
                  PAUSED
                </h2>
                <p className="text-gray-400">Press SPACE to continue</p>
              </div>
            </motion.div>
          )}

          {/* Controls */}
          <div className="text-gray-400 text-sm text-center space-y-1">
            <p>SPACE: Pause | ESC: Menu</p>
            <p>Speed: {Math.round((200 - speed) / 10)}x</p>
          </div>
        </div>
      )}

      {gameState === 'gameOver' && (
        <motion.div
          initial={{ scale: 0, rotateZ: 180 }}
          animate={{ scale: 1, rotateZ: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-center space-y-6"
        >
          <div className="text-6xl font-bold text-red-500 mb-4 animate-pulse">
            GAME OVER
          </div>
          
          <div className="space-y-4">
            <div className="text-2xl text-neon-yellow">
              Final Score: {score}
            </div>
            {score === highScore && score > 0 && (
              <div className="text-neon-green animate-pulse text-xl">
                🏆 NEW HIGH SCORE! 🏆
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={startGame}
              className="arcade-button text-lg px-8 py-4"
            >
              PLAY AGAIN
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="arcade-button text-lg px-8 py-4 border-neon-pink text-neon-pink hover:border-neon-yellow hover:text-neon-yellow"
            >
              BACK TO MENU
            </button>
          </div>
        </motion.div>
      )}

      {/* Scanline Effect */}
      <div className="scanline"></div>
    </div>
  );
};

export default Snake;