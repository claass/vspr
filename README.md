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

## UI Components (shadcn/ui)

This project uses [shadcn/ui](https://ui.shadcn.com) for UI components. The following components are currently installed:

- **Button**: Various button variants (default, secondary, destructive, outline, ghost, link)
- **Card**: Card components for displaying content (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- **Dialog**: Modal dialogs for user interactions
- **Separator**: Horizontal and vertical separators for layout

### Using Components

Components are located in `components/ui/` and can be imported as follows:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
```

### Component Demo

Visit `/components-demo` to see all installed components in action.

### Adding New Components

To add new shadcn/ui components:

1. Visit [shadcn/ui documentation](https://ui.shadcn.com/docs/components)
2. Copy the component code into `components/ui/[component-name].tsx`
3. Install any required dependencies
4. Import and use in your pages/components

### Theming

The application uses CSS variables for theming, configured in:
- `app/globals.css` - Color variables and theme definitions
- `tailwind.config.js` - Tailwind configuration with shadcn/ui extensions
- `components.json` - shadcn/ui configuration

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
