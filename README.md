# 🎮 Arcade Game Room

A retro-styled arcade game collection featuring classic games built with modern web technologies.

## 🕹️ Games Included

### Arcade Classics
- **🐍 Snake** - Guide the snake, eat food, grow longer, avoid walls and yourself
- **🧩 Tetris** - Classic falling blocks puzzle game with line clearing

### Board Games  
- **⚫ Checkers** - Traditional checkers/draughts game with AI opponent
- **🎲 Dominoes** - Classic domino matching game with multiple game modes

## 🚀 Features

- **Retro Arcade Aesthetics** - Neon colors, pixel fonts, CRT-style effects
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **High Scores** - Local storage for tracking your best performances
- **Sound Effects** - Authentic arcade sound experience
- **Multiple Difficulty Levels** - From beginner to expert
- **Multiplayer Support** - Local multiplayer for board games
- **Game Statistics** - Track your wins, losses, and progress

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with custom arcade theme
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing between games
- **Lucide React** - Beautiful icon set
- **Use Sound** - Sound effects and music integration

## 🎨 Design System

### Colors
- **Neon Green** (#00ff41) - Primary accent
- **Neon Blue** (#00ffff) - Secondary accent  
- **Neon Pink** (#ff00ff) - Tertiary accent
- **Neon Yellow** (#ffff00) - Warning/highlight
- **Arcade Black** (#0a0a0a) - Background
- **Arcade Gray** (#1a1a1a) - Surface

### Typography
- **Orbitron** - Headers and UI elements
- **Press Start 2P** - Game text and retro elements

## 🎮 Game Controls

### Snake
- **Arrow Keys** or **WASD** - Change direction
- **Space** - Pause/Resume
- **R** - Restart game

### Tetris
- **Arrow Keys** - Move and rotate pieces
- **Space** - Hard drop
- **Shift** - Hold piece
- **P** - Pause

### Checkers
- **Mouse Click** - Select and move pieces
- **ESC** - Deselect piece

### Dominoes
- **Mouse Click** - Select and place dominoes
- **Right Click** - Rotate domino

## 📦 Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd arcade-game-room

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎯 Game Rules

### Snake
- Eat food to grow longer and increase score
- Avoid hitting walls or your own tail
- Game speed increases as you grow

### Tetris
- Fill horizontal lines to clear them
- Game ends when pieces reach the top
- Score increases with cleared lines and level

### Checkers
- Move diagonally on dark squares only
- Jump over opponent pieces to capture
- Reach the opposite end to become a king

### Dominoes
- Match numbers on domino ends
- First to play all dominoes wins
- Draw from boneyard if no valid moves

## 🏆 Scoring System

Each game features its own scoring mechanism:
- **Snake**: Points per food eaten, bonus for consecutive eating
- **Tetris**: Points per line cleared, multipliers for simultaneous clears
- **Checkers**: Points for captures and wins
- **Dominoes**: Points based on remaining opponent dominoes

## 🔧 Development

### Project Structure
```
src/
├── components/         # Reusable UI components
├── games/             # Individual game implementations
│   ├── snake/         # Snake game logic and components
│   ├── tetris/        # Tetris game logic and components
│   ├── checkers/      # Checkers game logic and components
│   └── dominoes/      # Dominoes game logic and components
├── hooks/             # Custom React hooks
├── contexts/          # React contexts for state management
├── utils/             # Utility functions and helpers
├── assets/            # Images, sounds, and other assets
└── styles/            # Additional CSS and animations
```

### Adding New Games
1. Create game folder in `src/games/`
2. Implement game logic and components
3. Add routing in main App component
4. Update navigation and game selection menu

## 🎵 Audio

The game includes retro-style sound effects:
- Button clicks and navigation sounds
- Game-specific audio (snake eating, Tetris line clear, etc.)
- Background music (can be toggled)
- Victory and game over sounds

## 📱 Mobile Support

All games are optimized for mobile devices:
- Touch controls for movement
- Responsive layouts
- Mobile-friendly button sizes
- Landscape orientation support for better gameplay

## 🚀 Future Enhancements

- Online multiplayer support
- Tournament mode
- Custom themes and skins
- More arcade classics (Pac-Man, Space Invaders)
- Leaderboards with backend integration
- Achievement system
- Game replay functionality

## 📄 License

MIT License - Feel free to use this project for learning and development.

## 🙏 Acknowledgments

- Inspired by classic arcade games and retro gaming culture
- Sound effects from public domain arcade game collections
- Retro fonts and styling inspired by 80s/90s arcade aesthetics

---

**Built with ❤️ and nostalgia for the golden age of arcade gaming** 🕹️