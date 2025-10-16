/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00ff41',
        'neon-blue': '#00ffff',
        'neon-pink': '#ff00ff',
        'neon-yellow': '#ffff00',
        'arcade-black': '#0a0a0a',
        'arcade-gray': '#1a1a1a',
        'arcade-dark': '#0f0f0f'
      },
      fontFamily: {
        'arcade': ['Orbitron', 'monospace'],
        'pixel': ['Press Start 2P', 'monospace']
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite alternate',
        'arcade-blink': 'arcade-blink 1s ease-in-out infinite',
        'game-bounce': 'game-bounce 0.5s ease-in-out',
        'pixel-glow': 'pixel-glow 3s ease-in-out infinite'
      },
      keyframes: {
        'neon-pulse': {
          '0%': { 
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
            boxShadow: '0 0 5px currentColor'
          },
          '100%': { 
            textShadow: '0 0 2px currentColor, 0 0 5px currentColor, 0 0 8px currentColor',
            boxShadow: '0 0 2px currentColor'
          }
        },
        'arcade-blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0.3' }
        },
        'game-bounce': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        },
        'pixel-glow': {
          '0%, 100%': { filter: 'brightness(1) saturate(1)' },
          '50%': { filter: 'brightness(1.2) saturate(1.3)' }
        }
      }
    },
  },
  plugins: [],
}