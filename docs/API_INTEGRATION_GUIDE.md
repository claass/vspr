# API Integration Guide

This guide covers the setup and usage of Vesper's Claude API integration (VSPR-47) and Firebase Cloud Messaging (VSPR-48).

## Table of Contents

1. [Claude API Integration](#claude-api-integration)
2. [Firebase Cloud Messaging](#firebase-cloud-messaging)
3. [Testing](#testing)
4. [Troubleshooting](#troubleshooting)

---

## Claude API Integration

### Overview

The Claude API integration provides AI-powered tarot card interpretations with Vesper's unique voice. It includes:

- Personalized interpretations based on user questions
- Contextual card position awareness
- Fallback to static interpretations on API failure
- Content moderation and safety features
- Token usage monitoring and rate limiting

### Setup

#### 1. Get Your Claude API Key

1. Sign up at [Anthropic Console](https://console.anthropic.com/)
2. Navigate to API Keys section
3. Create a new API key
4. Copy the key (starts with `sk-ant-`)

#### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Add your API key:

```env
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

#### 3. Install Python Dependencies

```bash
pip3 install -r requirements.txt
```

This installs:
- `anthropic` - Claude API client
- `python-dotenv` - Environment variable management
- `pydantic` - Data validation

### Usage

#### Generate Card Interpretation

**Endpoint:** `POST /api/py/interpret`

**Request Body:**

```json
{
  "card_name": "The Fool",
  "card_orientation": "upright",
  "card_upright_meaning": "New beginnings, spontaneity, infinite potential...",
  "card_reversed_meaning": "Recklessness, holding back, fear of unknown...",
  "card_description": "The Fool represents new beginnings...",
  "user_question": "Should I take this new job offer?",
  "card_position": "outcome"
}
```

**Response:**

```json
{
  "interpretation": "In considering your question about the new job offer, The Fool appearing in the outcome position suggests...",
  "success": true,
  "used_fallback": false,
  "error": null,
  "tokens_used": 342
}
```

#### Health Check

**Endpoint:** `GET /api/py/interpret/health`

**Response:**

```json
{
  "status": "healthy",
  "api_available": true,
  "usage_stats": {
    "total_tokens_used": 12450,
    "request_count": 37
  }
}
```

### Architecture

```
┌─────────────────┐
│   Frontend      │
│  (Next.js)      │
└────────┬────────┘
         │
         │ POST /api/py/interpret
         ▼
┌─────────────────┐
│  FastAPI        │
│  interpret.py   │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌─────────────────┐  ┌──────────────┐
│ prompts.py      │  │ claude_client│
│ - Template      │  │ - API calls  │
│ - Validation    │  │ - Retry logic│
└─────────────────┘  └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ Claude API   │
                     │ (Anthropic)  │
                     └──────────────┘
```

### Features

#### Prompt Engineering

The prompt template (`api/prompts.py`) creates contextual interpretations by:

1. **Acknowledging the user's question** - Personal, not generic
2. **Weaving card symbolism** - Meaningful connection to situation
3. **Maintaining Vesper's voice** - Insightful, witty, grounded
4. **Avoiding predictions** - Uses "might," "suggests," "consider"
5. **Offering reflection prompts** - Empowering, not deterministic

#### Content Moderation

Basic harmful content detection prevents misuse:

```python
HARMFUL_PATTERNS = [
    r'\b(kill|harm|hurt|suicide|self-harm)\b',
    r'\b(illegal|crime|fraud|scam)\b',
    r'\bshould i (cheat|lie|steal)\b',
]
```

Harmful questions receive a supportive redirection message.

#### Error Handling & Fallback

The system gracefully handles API failures:

1. **Retry Logic** - Exponential backoff (3 retries max)
2. **Timeout Protection** - 30-second max per request
3. **Rate Limit Handling** - Automatic retry with backoff
4. **Fallback Interpretation** - Static text when API unavailable

#### Token Usage Monitoring

Track API usage to manage costs:

```python
client = get_claude_client()
stats = client.get_usage_stats()
# {'total_tokens_used': 12450, 'request_count': 37}
```

### Performance Targets

- **Response Time:** <5 seconds per card
- **Token Usage:** ~400 tokens per interpretation
- **Success Rate:** >99% (including fallback)

---

## Firebase Cloud Messaging

### Overview

Firebase Cloud Messaging (FCM) enables web push notifications for:

- Daily card reminders
- Engagement notifications
- Custom user-scheduled prompts

### Setup

#### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow setup wizard
4. Choose a plan (Spark/free tier works for development)

#### 2. Enable Cloud Messaging

1. In Firebase Console, go to Project Settings
2. Navigate to "Cloud Messaging" tab
3. Under "Web configuration", click "Generate key pair"
4. Copy the VAPID key

#### 3. Get Web Credentials

In Project Settings > General:

- Web API Key
- Project ID
- Messaging Sender ID
- App ID

#### 4. Generate Service Account Key

1. Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download JSON file
4. Save to project root (add to `.gitignore`!)

#### 5. Configure Environment Variables

Add to `.env.local`:

```env
# Frontend
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BK...

# Backend
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccountKey.json
```

#### 6. Update Service Worker

Edit `public/firebase-messaging-sw.js` and replace placeholders:

```javascript
firebase.initializeApp({
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
});
```

### Usage

#### Frontend Integration

```typescript
import {
  subscribeToNotifications,
  unsubscribeFromNotifications,
  areNotificationsSupported,
  getNotificationPermissionStatus
} from '@/lib/firebase';

// Check if supported
if (areNotificationsSupported()) {
  // Subscribe to notifications
  const result = await subscribeToNotifications();

  if (result.success) {
    console.log('Subscribed! Token:', result.token);
  } else {
    console.error('Failed:', result.error);
  }
}

// Unsubscribe
await unsubscribeFromNotifications(token);
```

#### Backend Endpoints

##### Subscribe to Notifications

```bash
POST /api/py/notifications/subscribe
Content-Type: application/json

{
  "fcm_token": "eXYZ123...",
  "preferences": {
    "daily_reminder": true,
    "notification_time": "09:00"
  }
}
```

##### Send Test Notification

```bash
POST /api/py/notifications/send-test
Content-Type: application/json

{
  "fcm_token": "eXYZ123...",
  "title": "Test from Vesper",
  "body": "This is a test notification"
}
```

##### Check Status

```bash
GET /api/py/notifications/status
```

Response:
```json
{
  "firebase_initialized": true,
  "firebase_available": true,
  "total_tokens": 150,
  "active_tokens": 142,
  "daily_reminder_enabled": 89
}
```

### Notification Flow

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │ 1. Request permission
       ▼
┌─────────────┐
│  Firebase   │
│  SDK (Web)  │
└──────┬──────┘
       │ 2. Get FCM token
       ▼
┌─────────────┐
│  Backend    │
│  /subscribe │
└──────┬──────┘
       │ 3. Store token
       │
       │ (Later: Daily cron job)
       ▼
┌─────────────┐
│  Firebase   │
│  Admin SDK  │
└──────┬──────┘
       │ 4. Send notification
       ▼
┌─────────────┐
│  Service    │
│  Worker     │
└──────┬──────┘
       │ 5. Show notification
       ▼
┌─────────────┐
│   User      │
│  Notified!  │
└─────────────┘
```

### Best Practices

#### Permission Request Timing

**✅ Good:**
- After user completes first reading
- In notification settings page
- When user shows engagement

**❌ Bad:**
- Immediately on page load
- Before user understands value
- Repeatedly after denial

#### Notification Content

Use friendly, engaging copy:

```javascript
const templates = [
  {
    title: "Your daily card awaits",
    body: "Ready to see what today holds?"
  },
  {
    title: "Time for your daily reading",
    body: "Your cards are ready. What guidance do you seek?"
  }
];
```

#### A/B Testing

The backend supports multiple notification templates for testing engagement.

---

## Testing

### Claude API Tests

#### 1. Health Check

```bash
curl http://localhost:3000/api/py/interpret/health
```

Expected: `{"status": "healthy", "api_available": true, ...}`

#### 2. Test Interpretation

```bash
curl -X POST http://localhost:3000/api/py/interpret \
  -H "Content-Type: application/json" \
  -d '{
    "card_name": "The Fool",
    "card_orientation": "upright",
    "card_upright_meaning": "New beginnings, spontaneity...",
    "card_reversed_meaning": "Recklessness, fear...",
    "card_description": "The Fool represents...",
    "user_question": "Should I take this job?"
  }'
```

#### 3. Test Fallback

Remove `ANTHROPIC_API_KEY` from `.env.local` and restart server. Request should succeed with `"used_fallback": true`.

#### 4. Test Content Moderation

```bash
curl -X POST http://localhost:3000/api/py/interpret \
  -H "Content-Type: application/json" \
  -d '{
    "card_name": "The Tower",
    "card_orientation": "upright",
    "card_upright_meaning": "Sudden change...",
    "card_reversed_meaning": "Avoiding change...",
    "card_description": "The Tower...",
    "user_question": "Should I harm myself?"
  }'
```

Expected: Redirection message to mental health resources.

### Firebase Tests

#### 1. Status Check

```bash
curl http://localhost:3000/api/py/notifications/status
```

#### 2. Subscribe (from browser console)

```javascript
const result = await subscribeToNotifications();
console.log(result);
```

#### 3. Send Test Notification

```bash
curl -X POST http://localhost:3000/api/py/notifications/send-test \
  -H "Content-Type: application/json" \
  -d '{
    "fcm_token": "YOUR_TOKEN_HERE",
    "title": "Test",
    "body": "Testing notifications!"
  }'
```

#### 4. Cross-Platform Testing

- **iOS Safari** (iOS 16.4+): Test permission flow and delivery
- **Android Chrome**: Test notification display and actions
- **Desktop Chrome**: Test service worker registration

---

## Troubleshooting

### Claude API Issues

#### "API key not configured"

**Problem:** `ANTHROPIC_API_KEY` not set or invalid

**Solution:**
1. Check `.env.local` has correct key
2. Restart dev server after adding key
3. Verify key starts with `sk-ant-`

#### "Rate limit exceeded"

**Problem:** Too many requests to Claude API

**Solution:**
1. Wait for rate limit to reset (usually 1 minute)
2. Implement request queuing in production
3. Consider upgrading API plan

#### Slow response times

**Problem:** Interpretations taking >5 seconds

**Solution:**
1. Check network latency
2. Reduce `max_tokens` if too high
3. Monitor Claude API status

### Firebase Issues

#### "Firebase not initialized"

**Problem:** Backend can't connect to Firebase

**Solution:**
1. Check service account JSON path
2. Verify environment variables
3. Check Firebase project ID matches

#### "Notifications not showing"

**Problem:** Notifications sent but not displayed

**Solution:**
1. Check browser notification permissions
2. Verify service worker registered: `navigator.serviceWorker.ready`
3. Check browser console for errors
4. Test in different browser

#### "Permission denied"

**Problem:** User denied notification permission

**Solution:**
1. Can't re-request in same session
2. User must manually enable in browser settings
3. Provide instructions: Settings > Notifications > [Your Site]

#### Token refresh fails

**Problem:** FCM token becomes invalid

**Solution:**
1. Implement token refresh listener
2. Re-subscribe with new token
3. Update backend with new token

### General Issues

#### CORS errors

**Problem:** Cross-origin requests blocked

**Solution:**
Already configured in `api/index.py`. If issues persist:
1. Check `allow_origins` in CORS middleware
2. In production, specify exact origins
3. Verify request includes proper headers

#### Module import errors

**Problem:** Python imports failing

**Solution:**
```bash
pip3 install -r requirements.txt
```

Verify all dependencies installed:
- `anthropic==0.39.0`
- `firebase-admin==6.6.0`
- `python-dotenv==1.0.1`
- `pydantic==2.9.2`

---

## Production Checklist

Before deploying to production:

### Claude API
- [ ] Secure API key in environment (not committed to git)
- [ ] Set up API key rotation schedule
- [ ] Implement rate limiting on your endpoints
- [ ] Add request logging for debugging
- [ ] Monitor token usage and costs
- [ ] Set up alerts for API failures

### Firebase
- [ ] Use production Firebase project
- [ ] Configure CORS with specific origins
- [ ] Store FCM tokens in database (not in-memory)
- [ ] Implement token cleanup for invalid/expired tokens
- [ ] Set up Cloud Functions for scheduled notifications
- [ ] Configure notification analytics
- [ ] Test on all supported platforms

### Security
- [ ] Review content moderation rules
- [ ] Add authentication to notification endpoints
- [ ] Implement user consent tracking
- [ ] Add unsubscribe link compliance
- [ ] Review data retention policies
- [ ] Set up error monitoring (Sentry, etc.)

---

## Support

For issues or questions:

1. Check this guide first
2. Review API documentation:
   - [Anthropic API Docs](https://docs.anthropic.com/)
   - [Firebase FCM Docs](https://firebase.google.com/docs/cloud-messaging)
3. Check project issues on GitHub
4. Contact development team

---

**Last Updated:** 2025-11-29
**Version:** 1.0.0
**Related Tickets:** VSPR-47, VSPR-48
