import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Tetris = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'paused', 'gameOver'
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [highScore, setHighScore] = useState(localStorage.getItem('tetrisHighScore') || 0);
  
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;
  const INITIAL_SPEED = 800;

  // Tetromino shapes
  const SHAPES = {
    I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-500' },
    O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-500' },
    T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500' },
    S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500' },
    Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500' },
    J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-500' },
    L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-500' }
  };

  const [board, setBoard] = useState(Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(null)));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  // Generate random piece
  const getRandomPiece = () => {
    const shapes = Object.keys(SHAPES);
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    return { type: randomShape, ...SHAPES[randomShape] };
  };

  // Initialize game
  const initGame = () => {
    const piece = getRandomPiece();
    const next = getRandomPiece();
    setBoard(Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(null)));
    setCurrentPiece(piece);
    setNextPiece(next);
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
    setScore(0);
    setLevel(1);
    setLines(0);
    setSpeed(INITIAL_SPEED);
  };

  // Start game
  const startGame = () => {
    initGame();
    setGameState('playing');
  };

  // Rotate piece
  const rotatePiece = (piece) => {
    const rows = piece.shape.length;
    const cols = piece.shape[0].length;
    const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        rotated[j][rows - 1 - i] = piece.shape[i][j];
      }
    }
    
    return { ...piece, shape: rotated };
  };

  // Check collision
  const checkCollision = (piece, pos) => {
    if (!piece) return false;
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Merge piece to board
  const mergePiece = () => {
    if (!currentPiece) return;
    
    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = currentPiece.color;
          }
        }
      }
    }
    
    setBoard(newBoard);
    clearLines(newBoard);
    
    // Spawn new piece
    setCurrentPiece(nextPiece);
    setNextPiece(getRandomPiece());
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
    
    // Check game over
    if (checkCollision(nextPiece, { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 })) {
      setGameState('gameOver');
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('tetrisHighScore', score);
      }
    }
  };

  // Clear completed lines
  const clearLines = (currentBoard) => {
    let linesCleared = 0;
    const newBoard = currentBoard.filter(row => {
      if (row.every(cell => cell !== null)) {
        linesCleared++;
        return false;
      }
      return true;
    });
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null));
    }
    
    if (linesCleared > 0) {
      setBoard(newBoard);
      setLines(prev => prev + linesCleared);
      
      // Score calculation (Tetris scoring system)
      const points = [0, 100, 300, 500, 800];
      setScore(prev => prev + points[linesCleared] * level);
      
      // Level up every 10 lines
      const newLevel = Math.floor((lines + linesCleared) / 10) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        setSpeed(prev => Math.max(100, prev - 50));
      }
    }
  };

  // Move piece
  const movePiece = (dir) => {
    if (gameState !== 'playing') return;
    
    const newPos = { ...position };
    if (dir === 'left') newPos.x--;
    if (dir === 'right') newPos.x++;
    if (dir === 'down') newPos.y++;
    
    if (!checkCollision(currentPiece, newPos)) {
      setPosition(newPos);
    } else if (dir === 'down') {
      mergePiece();
    }
  };

  // Hard drop
  const hardDrop = () => {
    if (gameState !== 'playing') return;
    
    let newPos = { ...position };
    while (!checkCollision(currentPiece, { ...newPos, y: newPos.y + 1 })) {
      newPos.y++;
    }
    setPosition(newPos);
    setTimeout(() => mergePiece(), 50);
  };

  // Rotate
  const rotate = () => {
    if (gameState !== 'playing') return;
    
    const rotated = rotatePiece(currentPiece);
    if (!checkCollision(rotated, position)) {
      setCurrentPiece(rotated);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState === 'menu') {
        if (e.key === 'Enter') startGame();
        if (e.key === 'Escape') navigate('/');
        return;
      }

      if (gameState === 'playing') {
        e.preventDefault();
        switch (e.key) {
          case 'ArrowLeft': movePiece('left'); break;
          case 'ArrowRight': movePiece('right'); break;
          case 'ArrowDown': movePiece('down'); break;
          case 'ArrowUp': rotate(); break;
          case ' ': hardDrop(); break;
          case 'p': setGameState('paused'); break;
          case 'Escape': setGameState('menu'); break;
        }
      }

      if (gameState === 'paused') {
        if (e.key === 'p') setGameState('playing');
        if (e.key === 'Escape') setGameState('menu');
      }

      if (gameState === 'gameOver') {
        if (e.key === 'Enter') startGame();
        if (e.key === 'Escape') navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, position, currentPiece, navigate]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      movePiece('down');
    }, speed);

    return () => clearInterval(gameLoop);
  }, [gameState, speed, position, currentPiece, board]);

  // Render board
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display
    if (currentPiece && position) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }
    
    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={`w-6 h-6 border border-gray-700 ${
              cell || 'bg-arcade-black'
            } ${cell ? 'shadow-lg' : ''}`}
          />
        ))}
      </div>
    ));
  };

  // Render next piece preview
  const renderNextPiece = () => {
    if (!nextPiece) return null;
    
    return nextPiece.shape.map((row, y) => (
      <div key={y} className="flex justify-center">
        {row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={`w-5 h-5 border border-gray-700 ${
              cell ? nextPiece.color : 'bg-arcade-black'
            }`}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-6xl font-bold mb-6 arcade-glow text-neon-blue"
      >
        NEON TETRIS
      </motion.h1>

      {gameState === 'menu' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="text-neon-blue text-xl mb-8">
            🧩 STACK AND CLEAR 🧩
          </div>
          
          <div className="space-y-4">
            <button onClick={startGame} className="arcade-button text-lg px-8 py-4">
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
            <p>🎮 ← → to move | ↑ to rotate</p>
            <p>⬇ Soft drop | SPACE Hard drop</p>
            <p>🏆 High Score: {highScore}</p>
          </div>
        </motion.div>
      )}

      {(gameState === 'playing' || gameState === 'paused') && (
        <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
          {/* Side Panel */}
          <div className="space-y-6">
            <div className="score-display">
              SCORE<br />{score}
            </div>
            <div className="score-display">
              LEVEL<br />{level}
            </div>
            <div className="score-display">
              LINES<br />{lines}
            </div>
            <div className="score-display">
              HIGH<br />{highScore}
            </div>
            
            {/* Next Piece */}
            <div className="bg-arcade-black border-2 border-neon-blue p-4 rounded-lg">
              <div className="text-neon-blue text-sm mb-2 text-center">NEXT</div>
              {renderNextPiece()}
            </div>
          </div>

          {/* Game Board */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="game-board p-4"
          >
            {renderBoard()}
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
                <p className="text-gray-400">Press P to continue</p>
              </div>
            </motion.div>
          )}

          {/* Controls */}
          <div className="text-gray-400 text-xs text-center md:text-left space-y-1">
            <p>P: Pause | ESC: Menu</p>
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
            <div className="text-2xl text-neon-yellow">Final Score: {score}</div>
            <div className="text-xl text-neon-blue">Level: {level}</div>
            <div className="text-xl text-neon-green">Lines: {lines}</div>
            {score === highScore && score > 0 && (
              <div className="text-neon-green animate-pulse text-xl">
                🏆 NEW HIGH SCORE! 🏆
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button onClick={startGame} className="arcade-button text-lg px-8 py-4">
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

      <div className="scanline"></div>
    </div>
  );
};

export default Tetris;