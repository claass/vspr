# Quick Start Setup Guide

Get Vesper's Claude API and Firebase features running in 5 minutes.

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Git

## Setup Steps

### 1. Install Dependencies

```bash
# Install Python dependencies
pip3 install -r requirements.txt

# Install Node dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
# Required for Claude API
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Required for Firebase (see below for getting these)
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key
```

### 3. Get API Keys

#### Claude API Key (2 minutes)

1. Go to https://console.anthropic.com/
2. Sign up / Log in
3. Click "Get API Key"
4. Copy the key (starts with `sk-ant-`)
5. Add to `.env.local`

#### Firebase Setup (3 minutes)

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it (e.g., "vesper-dev")
4. Disable Google Analytics (optional, for faster setup)
5. Click "Create project"

**Get Web Credentials:**

1. Click the web icon (`</>`) to add web app
2. Register app (name: "Vesper Web")
3. Copy the config values to `.env.local`:
   - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

**Get VAPID Key:**

1. Go to Project Settings > Cloud Messaging
2. Under "Web Push certificates", click "Generate key pair"
3. Copy to `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

**Get Service Account (for backend):**

1. Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save as `serviceAccountKey.json` in project root
4. Add to `.env.local`:
   ```env
   FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
   ```
5. Add to `.gitignore`:
   ```bash
   echo "serviceAccountKey.json" >> .gitignore
   ```

### 4. Update Service Worker

Edit `public/firebase-messaging-sw.js`:

Replace the placeholder config with your actual Firebase config:

```javascript
firebase.initializeApp({
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123"
});
```

### 5. Run Development Server

```bash
npm run dev
```

This starts both:
- Next.js dev server (http://localhost:3000)
- FastAPI backend (http://localhost:8000)

### 6. Verify Setup

**Test Claude API:**

```bash
curl http://localhost:3000/api/py/interpret/health
```

Expected output:
```json
{
  "status": "healthy",
  "api_available": true,
  "usage_stats": {"total_tokens_used": 0, "request_count": 0}
}
```

**Test Firebase:**

```bash
curl http://localhost:3000/api/py/notifications/status
```

Expected output:
```json
{
  "firebase_initialized": true,
  "firebase_available": true,
  "total_tokens": 0,
  "active_tokens": 0,
  "daily_reminder_enabled": 0
}
```

## Testing

### Run Automated Tests

```bash
# Run Claude API integration tests
python3 api/test_interpret.py
```

### Manual Testing

**Test Claude Interpretation:**

```bash
curl -X POST http://localhost:3000/api/py/interpret \
  -H "Content-Type: application/json" \
  -d '{
    "card_name": "The Fool",
    "card_orientation": "upright",
    "card_upright_meaning": "New beginnings, spontaneity, infinite potential",
    "card_reversed_meaning": "Recklessness, fear of unknown",
    "card_description": "The Fool represents new beginnings",
    "user_question": "What should I focus on today?"
  }'
```

**Test Notifications (in browser console):**

```javascript
// Import Firebase utilities
import { subscribeToNotifications } from '@/lib/firebase';

// Subscribe to notifications
const result = await subscribeToNotifications();
console.log('Subscription result:', result);
```

Then send a test notification:

```bash
curl -X POST http://localhost:3000/api/py/notifications/send-test \
  -H "Content-Type: application/json" \
  -d '{
    "fcm_token": "YOUR_TOKEN_FROM_CONSOLE",
    "title": "Test from Vesper",
    "body": "Your setup is working!"
  }'
```

## Troubleshooting

### "API key not configured"

- Check `.env.local` has `ANTHROPIC_API_KEY`
- Restart dev server after adding key
- Key should start with `sk-ant-`

### "Firebase not initialized"

- Check `.env.local` has all `NEXT_PUBLIC_FIREBASE_*` variables
- Verify service account JSON path is correct
- Check Firebase project exists and is active

### Port already in use

```bash
# Kill processes on ports 3000 and 8000
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```

### Module not found errors

```bash
# Reinstall dependencies
pip3 install -r requirements.txt
npm install
```

## Next Steps

1. Read the full [API Integration Guide](./API_INTEGRATION_GUIDE.md)
2. Review the [Architecture Documentation](./ARCHITECTURE.md)
3. Explore the API at http://localhost:3000/api/py/docs
4. Start building!

## Development Workflow

```bash
# Start dev server
npm run dev

# Run tests
npm test                    # Frontend tests
python3 api/test_interpret.py  # Backend tests

# Build for production
npm run build
```

## Support

- 📖 [Full API Integration Guide](./API_INTEGRATION_GUIDE.md)
- 🔥 [Firebase Documentation](https://firebase.google.com/docs)
- 🤖 [Anthropic API Docs](https://docs.anthropic.com/)

---

**Setup Time:** ~5 minutes
**Last Updated:** 2025-11-29
