# Vesper

A modern card reading application that brings the ancient practice of cartomancy into the digital age.

## Overview

Vesper is a web application that allows users to draw cards from a deck and receive interpretations and reflections. The MVP focuses on delivering a clean, intuitive three-card reading experience with plans to expand into personalized AI-powered reflections and social sharing features.

## Features

### Current (MVP)
- **Three-Card Draw**: Draw three cards from a curated deck
- **Card Descriptions**: View detailed interpretations for each card drawn
- **Interactive UI**: Clean, modern interface built with shadcn/ui
- **Reset & Redraw**: Start fresh readings at any time

### Planned Features
- **Basic Personalization**: Customized reading experiences
- **AI Reflection**: 
  - Text-based interpretations
  - Interactive chat about your reading
  - Voice call reflection sessions
- **Social Sharing**: Share readings with friends
- **Deck Generator**: Create and customize your own card decks

## Tech Stack

- **Frontend**: Next.js with React
- **Backend**: FastAPI
- **UI Components**: shadcn/ui with Tailwind CSS
- **Card Storage**: JSON-based data structure
- **Deployment**: Vercel

## Project Structure

```
vspr/
├── data/
│   └── cards.json          # Card deck data and descriptions
├── app/                    # Next.js app directory
├── api/                    # FastAPI backend
│   └── draw/              # Card drawing endpoint
├── components/            # React components
└── public/               # Static assets
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python 3.9+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vspr.git
cd vspr

# Install frontend dependencies
npm install

# Install backend dependencies
pip install -r requirements.txt

# Run the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

## API Endpoints

### `POST /api/draw`
Draws three random cards from the deck.

**Response:**
```json
{
  "cards": [
    {
      "id": "card-1",
      "name": "The Card Name",
      "description": "Card interpretation...",
      "imageUrl": "..."
    }
  ]
}
```

## Development Roadmap

### Phase 1: Core Reading Flow MVP ✓
- Basic three-card draw functionality
- Card display and detail views
- Clean, responsive UI

### Phase 2: Basic Personalization
- User preferences
- Reading history
- Customizable themes

### Phase 3: AI Reflection
- Text-based AI interpretations
- Interactive chat interface
- Voice-based reflection calls

### Phase 4: Social & Sharing
- Share readings on social media
- Reading collections
- Community features

### Phase 5: Advanced Features
- Custom deck creation
- Advanced spreads (beyond three cards)
- Analytics and insights

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Your License Here]

## Contact

For questions or feedback, please open an issue on GitHub.

---

*Vesper: Modern card readings for a digital age*
