import React from 'react';
import { useNavigate } from 'react-router-dom';

const GameMenuSimple = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-white">
      <h1 className="text-4xl font-bold mb-8 text-green-500">
        🎮 ARCADE GAME ROOM 🎮
      </h1>
      
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <button 
          onClick={() => navigate('/snake')}
          className="bg-green-500 hover:bg-green-600 text-black font-bold py-4 px-8 rounded"
        >
          🐍 SNAKE CLASSIC
        </button>
        
        <button 
          onClick={() => navigate('/tetris')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded"
        >
          🧩 NEON TETRIS
        </button>
        
        <button 
          onClick={() => navigate('/checkers')}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded"
        >
          ♟️ CYBER CHECKERS
        </button>
        
        <button 
          onClick={() => navigate('/dominoes')}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded"
        >
          ⚫ RETRO DOMINOES
        </button>
      </div>
      
      <p className="mt-8 text-gray-400">
        Click any game to play! (Snake & Tetris are fully functional)
      </p>
    </div>
  );
};

export default GameMenuSimple;