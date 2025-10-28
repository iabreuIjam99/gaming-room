import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Crown } from 'lucide-react';

const Checkers = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'gameOver'
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('red'); // 'red' or 'black'
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [scores, setScores] = useState({ red: 12, black: 12 });
  const [winner, setWinner] = useState(null);
  const [mustCapture, setMustCapture] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameMode, setGameMode] = useState('pvp'); // 'pvp' or 'ai'

  const BOARD_SIZE = 8;

  // Initialize board
  const initBoard = () => {
    const newBoard = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    
    // Place red pieces (top)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if ((row + col) % 2 === 1) {
          newBoard[row][col] = { player: 'red', isKing: false };
        }
      }
    }
    
    // Place black pieces (bottom)
    for (let row = 5; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if ((row + col) % 2 === 1) {
          newBoard[row][col] = { player: 'black', isKing: false };
        }
      }
    }
    
    return newBoard;
  };

  // Start game
  const startGame = (mode = 'pvp') => {
    setGameMode(mode);
    setBoard(initBoard());
    setCurrentPlayer('red');
    setSelectedPiece(null);
    setValidMoves([]);
    setScores({ red: 12, black: 12 });
    setWinner(null);
    setMustCapture(null);
    setMoveHistory([]);
    setGameState('playing');
  };

  // Get valid moves for a piece
  const getValidMoves = useCallback((row, col, board, player, captureOnly = false) => {
    const piece = board[row][col];
    if (!piece || piece.player !== player) return [];

    const moves = [];
    const captures = [];
    const directions = piece.isKing 
      ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] // King moves in all diagonal directions
      : player === 'red' 
        ? [[1, -1], [1, 1]] // Red moves down
        : [[-1, -1], [-1, 1]]; // Black moves up

    // Check normal moves and captures
    directions.forEach(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = col + dCol;

      // Normal move
      if (!captureOnly && newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
        if (!board[newRow][newCol]) {
          moves.push({ row: newRow, col: newCol, isCapture: false });
        }
      }

      // Capture move
      const captureRow = row + dRow * 2;
      const captureCol = col + dCol * 2;
      if (captureRow >= 0 && captureRow < BOARD_SIZE && captureCol >= 0 && captureCol < BOARD_SIZE) {
        const jumped = board[newRow][newCol];
        if (jumped && jumped.player !== player && !board[captureRow][captureCol]) {
          captures.push({ 
            row: captureRow, 
            col: captureCol, 
            isCapture: true,
            capturedRow: newRow,
            capturedCol: newCol
          });
        }
      }
    });

    return captures.length > 0 ? captures : moves;
  }, []);

  // Check if player has any captures available
  const hasCaptures = useCallback((board, player) => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = board[row][col];
        if (piece && piece.player === player) {
          const moves = getValidMoves(row, col, board, player, true);
          if (moves.some(m => m.isCapture)) return true;
        }
      }
    }
    return false;
  }, [getValidMoves]);

  // Handle piece selection
  const handleSquareClick = (row, col) => {
    if (gameState !== 'playing') return;
    if (gameMode === 'ai' && currentPlayer === 'black') return; // AI turn

    const piece = board[row][col];

    // If a piece is selected
    if (selectedPiece) {
      // Check if clicked square is a valid move
      const move = validMoves.find(m => m.row === row && m.col === col);
      
      if (move) {
        makeMove(selectedPiece, move);
      } else if (piece && piece.player === currentPlayer) {
        // Select different piece
        selectPiece(row, col);
      } else {
        // Deselect
        setSelectedPiece(null);
        setValidMoves([]);
      }
    } else if (piece && piece.player === currentPlayer) {
      // Select piece
      selectPiece(row, col);
    }
  };

  // Select a piece
  const selectPiece = (row, col) => {
    const moves = getValidMoves(row, col, board, currentPlayer, mustCapture !== null);
    
    // If must capture, only show pieces that can capture
    if (mustCapture && !moves.some(m => m.isCapture)) {
      return;
    }

    setSelectedPiece({ row, col });
    setValidMoves(moves);
  };

  // Make a move
  const makeMove = (from, to) => {
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[from.row][from.col];
    
    // Move piece
    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = null;

    // Check for king promotion
    if (!piece.isKing) {
      if ((piece.player === 'red' && to.row === BOARD_SIZE - 1) ||
          (piece.player === 'black' && to.row === 0)) {
        newBoard[to.row][to.col].isKing = true;
      }
    }

    // Handle capture
    let newScores = { ...scores };
    if (to.isCapture) {
      newBoard[to.capturedRow][to.capturedCol] = null;
      const opponent = currentPlayer === 'red' ? 'black' : 'red';
      newScores[opponent]--;

      // Check for multiple captures
      const additionalCaptures = getValidMoves(to.row, to.col, newBoard, currentPlayer, true)
        .filter(m => m.isCapture);
      
      if (additionalCaptures.length > 0) {
        // Continue capturing with same piece
        setBoard(newBoard);
        setScores(newScores);
        setSelectedPiece({ row: to.row, col: to.col });
        setValidMoves(additionalCaptures);
        setMustCapture({ row: to.row, col: to.col });
        return;
      }
    }

    // Update board and switch player
    setBoard(newBoard);
    setScores(newScores);
    setSelectedPiece(null);
    setValidMoves([]);
    setMustCapture(null);
    setMoveHistory([...moveHistory, { from, to, player: currentPlayer }]);

    // Check win condition
    if (newScores.red === 0 || newScores.black === 0) {
      setWinner(newScores.red === 0 ? 'black' : 'red');
      setGameState('gameOver');
      return;
    }

    // Check if next player has moves
    const nextPlayer = currentPlayer === 'red' ? 'black' : 'red';
    const hasValidMoves = checkPlayerHasMoves(newBoard, nextPlayer);
    if (!hasValidMoves) {
      setWinner(currentPlayer);
      setGameState('gameOver');
      return;
    }

    // Check if next player must capture
    const nextHasCaptures = hasCaptures(newBoard, nextPlayer);
    setCurrentPlayer(nextPlayer);
    
    if (nextHasCaptures) {
      setMustCapture({ player: nextPlayer });
    }
  };

  // Check if player has any valid moves
  const checkPlayerHasMoves = (board, player) => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = board[row][col];
        if (piece && piece.player === player) {
          const moves = getValidMoves(row, col, board, player);
          if (moves.length > 0) return true;
        }
      }
    }
    return false;
  };

  // Simple AI move
  useEffect(() => {
    if (gameState === 'playing' && gameMode === 'ai' && currentPlayer === 'black') {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, gameMode, currentPlayer, board]);

  const makeAIMove = () => {
    // Find all possible moves
    const allMoves = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = board[row][col];
        if (piece && piece.player === 'black') {
          const moves = getValidMoves(row, col, board, 'black', mustCapture !== null);
          moves.forEach(move => {
            allMoves.push({ from: { row, col }, to: move });
          });
        }
      }
    }

    if (allMoves.length === 0) return;

    // Prioritize captures
    const captures = allMoves.filter(m => m.to.isCapture);
    const movesToChoose = captures.length > 0 ? captures : allMoves;

    // Choose random move
    const randomMove = movesToChoose[Math.floor(Math.random() * movesToChoose.length)];
    makeMove(randomMove.from, randomMove.to);
  };

  // Render board
  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((piece, colIndex) => {
          const isDark = (rowIndex + colIndex) % 2 === 1;
          const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
          const isValidMove = validMoves.some(m => m.row === rowIndex && m.col === colIndex);
          const isCapture = validMoves.find(m => m.row === rowIndex && m.col === colIndex)?.isCapture;

          return (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-12 h-12 md:w-16 md:h-16 flex items-center justify-center cursor-pointer
                border border-gray-800 transition-all duration-200
                ${isDark ? 'bg-gray-700' : 'bg-gray-400'}
                ${isSelected ? 'ring-4 ring-neon-yellow shadow-lg shadow-neon-yellow/50' : ''}
                ${isValidMove ? 'ring-2 ring-neon-green animate-pulse' : ''}
              `}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {piece && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`
                    w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                    border-4 shadow-lg transition-all
                    ${piece.player === 'red' 
                      ? 'bg-red-500 border-red-700 shadow-red-500/50' 
                      : 'bg-gray-900 border-gray-950 shadow-black/50'
                    }
                    ${piece.isKing ? 'ring-4 ring-yellow-400' : ''}
                  `}
                >
                  {piece.isKing && (
                    <Crown className="w-6 h-6 text-yellow-400" />
                  )}
                </motion.div>
              )}
              {isValidMove && !piece && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`
                    w-4 h-4 rounded-full
                    ${isCapture ? 'bg-neon-pink shadow-lg shadow-neon-pink/50' : 'bg-neon-green shadow-lg shadow-neon-green/50'}
                  `}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-6xl font-bold mb-6 arcade-glow text-neon-pink"
      >
        CYBER CHECKERS
      </motion.h1>

      {gameState === 'menu' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="text-neon-pink text-xl mb-8">
            ♟️ STRATEGIC BOARD GAME ♟️
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => startGame('pvp')}
              className="arcade-button text-lg px-8 py-4 w-64"
            >
              2 PLAYERS
            </button>
            
            <button
              onClick={() => startGame('ai')}
              className="arcade-button text-lg px-8 py-4 w-64 border-neon-blue text-neon-blue hover:border-neon-pink hover:text-neon-pink"
            >
              VS COMPUTER
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="arcade-button text-lg px-8 py-4 w-64 border-neon-yellow text-neon-yellow hover:border-neon-green hover:text-neon-green"
            >
              BACK TO MENU
            </button>
          </div>

          <div className="text-gray-400 text-sm space-y-2 mt-8">
            <p>🎮 Click piece to select, click valid move to play</p>
            <p>👑 Reach opposite end to become King</p>
            <p>⚡ Must capture when possible</p>
          </div>
        </motion.div>
      )}

      {gameState === 'playing' && (
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Side Panel */}
          <div className="space-y-4">
            <div className={`score-display ${currentPlayer === 'red' ? 'ring-2 ring-neon-pink' : ''}`}>
              <div className="text-red-500 font-bold">RED</div>
              <div className="text-2xl">{scores.red}</div>
            </div>
            
            <div className={`score-display ${currentPlayer === 'black' ? 'ring-2 ring-neon-blue' : ''}`}>
              <div className="text-gray-900 font-bold">BLACK</div>
              <div className="text-2xl">{scores.black}</div>
            </div>

            <div className="bg-arcade-black border-2 border-neon-pink p-4 rounded-lg">
              <div className="text-neon-pink text-sm mb-2">CURRENT TURN</div>
              <div className={`text-2xl font-bold ${currentPlayer === 'red' ? 'text-red-500' : 'text-gray-300'}`}>
                {currentPlayer.toUpperCase()}
              </div>
              {gameMode === 'ai' && currentPlayer === 'black' && (
                <div className="text-neon-blue text-xs mt-2 animate-pulse">AI Thinking...</div>
              )}
            </div>

            {mustCapture && (
              <div className="bg-arcade-black border-2 border-neon-yellow p-3 rounded-lg animate-pulse">
                <div className="text-neon-yellow text-xs font-bold">
                  ⚡ MUST CAPTURE!
                </div>
              </div>
            )}
          </div>

          {/* Game Board */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="game-board p-4"
          >
            {renderBoard()}
          </motion.div>

          {/* Controls */}
          <div className="text-center space-y-4">
            <button
              onClick={() => setGameState('menu')}
              className="arcade-button px-6 py-2 text-sm border-neon-yellow text-neon-yellow"
            >
              NEW GAME
            </button>
            
            <div className="text-gray-400 text-xs space-y-1">
              <p>Moves: {moveHistory.length}</p>
              <p>Mode: {gameMode === 'pvp' ? '2P' : 'vs AI'}</p>
            </div>
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
          <div className={`text-6xl font-bold mb-4 animate-pulse ${winner === 'red' ? 'text-red-500' : 'text-gray-300'}`}>
            {winner?.toUpperCase()} WINS!
          </div>
          
          <div className="space-y-4">
            <div className="text-2xl text-neon-yellow">
              Final Score: Red {scores.red} - {scores.black} Black
            </div>
            <div className="text-xl text-neon-blue">
              Moves Played: {moveHistory.length}
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => startGame(gameMode)}
              className="arcade-button text-lg px-8 py-4"
            >
              PLAY AGAIN
            </button>
            
            <button
              onClick={() => setGameState('menu')}
              className="arcade-button text-lg px-8 py-4 border-neon-pink text-neon-pink hover:border-neon-yellow hover:text-neon-yellow"
            >
              MAIN MENU
            </button>
          </div>
        </motion.div>
      )}

      <div className="scanline"></div>
    </div>
  );
};

export default Checkers;