# Gaming Leaderboard Frontend

A mobile-first gaming leaderboard system built with Next.js, featuring real-time updates and a modern mobile game UI design.

## 🎮 Features

- **Mobile Game UI Design** - Authentic mobile game interface with dark theme and green accents
- **Real-time Updates** - Live leaderboard updates with WebSocket simulation
- **Trophy System** - Gold, silver, bronze trophies for top 3 positions
- **Puzzle Piece Rewards** - Visual reward system with puzzle piece currency
- **Admin Panel** - Create tournaments and simulate player activity
- **Responsive Design** - Optimized for mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
\`\`\`bash
# Clone the repository
git clone <repository-url>
cd gaming-leaderboard-frontend

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### Build for Production
\`\`\`bash
# Build the application
npm run build

# Start production server
npm start
\`\`\`

## 📱 Usage

### Main Features
1. **Tournament Selection** - Browse available tournaments on the main screen
2. **Leaderboard View** - Tap any tournament to view the full leaderboard
3. **Live Updates** - Toggle "GO LIVE" to see real-time score changes
4. **Admin Panel** - Access via settings icon to create tournaments

### Tournament Types
- Weekly Puzzle Championship
- Monthly Brain Challenge
- Speed Puzzle Blitz
- Valentine's Puzzle Special
- Spring Mind Games
- Lucky 7s Tournament

## 🎨 Design System

### Colors
- **Background**: Purple gradient (from-purple-900 to-black)
- **Accent**: Green (#10B981) for buttons and rewards
- **Text**: White primary, purple-200 secondary
- **Cards**: Purple-800/50 with backdrop blur

### Typography
- **Headers**: Bold, white text
- **Body**: Regular, purple-200 text
- **Accents**: Green for rewards and CTAs

### Components
- **Trophy Images**: Gold, silver, bronze for positions 1-3
- **Puzzle Pieces**: Green currency icons
- **Cards**: Rounded with gradient backgrounds
- **Buttons**: Green primary, outlined secondary

## 🔧 Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React hooks
- **Data**: Mock service with simulated API calls

## 📂 Project Structure

\`\`\`
src/
├── app/
│   └── page.tsx                 # Main application page
├── components/
│   ├── admin/
│   │   └── admin-panel.tsx      # Admin interface
│   ├── layout/
│   │   └── header.tsx           # App header
│   ├── leaderboard/
│   │   ├── leaderboard-grid.tsx # Tournament grid
│   │   ├── leaderboard-card.tsx # Tournament cards
│   │   ├── mobile-leaderboard.tsx # Full leaderboard view
│   │   └── mobile-player-*.tsx  # Player components
│   └── ui/
│       └── *.tsx                # Reusable UI components
├── lib/
│   └── mock-data-service.ts     # Data service
└── public/
    └── images/                  # Trophy and reward assets
\`\`\`

## 🎯 Key Components

### MockDataService
- Simulates backend API responses
- Manages tournament and player data
- Provides real-time update subscriptions
- Handles tournament creation and player simulation

### Mobile Leaderboard
- Full-screen tournament view
- Real-time score updates
- Trophy display for top 3 players
- Puzzle piece reward system

### Admin Panel
- Create new tournaments
- Simulate player activity
- View system statistics
- Mobile-optimized interface

## 🔄 Real-time Features

- **Live Updates**: Scores update every 3 seconds when enabled
- **Position Changes**: Players move up/down based on score changes
- **Visual Feedback**: Live badges and animations
- **WebSocket Simulation**: Mimics real-time server communication

## 🎮 Game Mechanics

### Scoring System
- Players earn points through puzzle-solving activities
- Scores determine leaderboard positions
- Real-time score updates affect rankings

### Reward Structure
- Position-based rewards using puzzle pieces
- Different reward tiers for each tournament
- Top 3 positions get trophy recognition

### Tournament Types
- **Active**: Currently running tournaments
- **Upcoming**: Future tournaments
- **Ended**: Completed tournaments

## 🚀 Deployment

The application is a static Next.js app that can be deployed to any hosting platform:

- **Vercel**: `vercel deploy`
- **Netlify**: Connect GitHub repository
- **Static Hosting**: Use `npm run build` and serve the `out` folder

## 🔮 Future Enhancements

- **Player Profiles**: Individual player statistics and achievements
- **Tournament Brackets**: Elimination-style competitions
- **Sound Effects**: Audio feedback for interactions
- **Push Notifications**: Real-time alerts for position changes
- **Social Features**: Friend lists and challenges
- **Analytics**: Player engagement and performance metrics

## 📄 License

This project is licensed under the MIT License.
