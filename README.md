# Vesper

**Modern mysticism meets digital serenity**

A simple, elegant tarot reading app built with pure HTML, CSS, and JavaScript. No frameworks, no build tools, no complexity—just the essential experience of drawing cards and reflecting on their meaning.

## Features

- ✨ **Daily tarot readings** - Draw one or three cards for reflection
- 🌙 **Beautiful cosmic design** - Inspired by midnight rituals and celestial aesthetics
- 💾 **Reading history** - All readings saved locally in your browser
- 🎴 **Complete tarot deck** - All 78 traditional tarot cards with descriptions
- 📱 **Mobile-friendly** - Responsive design that works on any device
- 🚀 **No installation needed** - Just open and use, no build steps required

## Quick Start

Simply open `index.html` in any modern web browser. That's it!

For local development with live reload, you can use any simple HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## How It Works

Vesper is intentionally simple:

1. **`index.html`** - The structure and layout
2. **`styles.css`** - Cosmic noir aesthetic with glass surfaces and gradients
3. **`app.js`** - Vanilla JavaScript for card drawing, localStorage, and UI interactions
4. **`cards.json`** - Complete 78-card tarot deck with descriptions

All readings are stored in your browser's localStorage, so your history persists between sessions. No accounts, no servers, no tracking—just you and the cards.

## Usage

1. **Draw Cards** - Choose to draw one card or a three-card spread (Past-Present-Future)
2. **Read the Cards** - Each card displays its name and contemplative description
3. **Save Your Reading** - Store readings in your history for later reflection
4. **Review History** - Browse past readings, click to view details, or delete old entries

## Design

Vesper's aesthetic draws from **cosmic noir**—deep space backgrounds, frosted glass surfaces, and soft glowing accents. The color palette features:

- **Cyan** (`#4BD9FF`) - Primary accent for headings and interactive elements
- **Coral** (`#FF6F8D`) - Secondary accent for warnings and highlights
- **Peach** (`#FFB27A`) - Tertiary accent for softer touches
- **Deep blacks** - Gradient background evoking midnight sky

All animations use smooth, contemplative timing (300-400ms) to create a meditative atmosphere.

## File Structure

```
vesper/
├── index.html          # Main HTML file
├── app.js              # JavaScript application logic
├── styles.css          # All styles and design tokens
├── cards.json          # Complete 78-card tarot deck
├── public/             # Icons and manifest (for PWA)
└── README.md           # This file
```

## Customization

Want to modify Vesper? Here's where to look:

- **Change colors**: Edit CSS variables in `styles.css` (`:root` section)
- **Add cards**: Modify `cards.json` following the existing format
- **Adjust animations**: Update transition timings in `styles.css`
- **Change card logic**: Edit the shuffle and draw functions in `app.js`

## License

MIT License. See [LICENSE](./LICENSE) for details.

## Philosophy

Vesper treats tarot as a tool for **reflection, not prediction**. The cards are mirrors that help you explore your inner landscape, not oracles that dictate your future. Each reading is an invitation to pause, reflect, and discover what you already know within yourself.

---

✨ *May your readings bring clarity.*
