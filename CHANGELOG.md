# Changelog

All notable changes to Vesper will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - VSPR-47: Claude API Integration

#### Backend
- **Claude API Client** (`api/claude_client.py`)
  - Anthropic Claude Sonnet 4.5 integration for AI-powered interpretations
  - Automatic retry logic with exponential backoff (max 3 retries)
  - Rate limiting and token usage monitoring
  - 30-second timeout protection
  - Graceful fallback to static interpretations on API failure
  - Comprehensive error handling for API errors, timeouts, and rate limits

- **Prompt Engineering** (`api/prompts.py`)
  - Contextual prompt templates for personalized card interpretations
  - Support for user questions, card positions (past/present/future), and orientations
  - Vesper voice: insightful, witty, grounded, compassionate
  - Content moderation with harmful pattern detection
  - Fallback interpretation generator for offline/error states
  - Sample test questions for validation

- **Interpretation Endpoint** (`api/routes/interpret.py`)
  - `POST /api/py/interpret` - Generate AI-powered card interpretations
  - `GET /api/py/interpret/health` - Service health check with API availability status
  - Request validation with Pydantic models
  - Content safety checks before processing
  - Automatic fallback to static text when API unavailable
  - Response includes success status, token usage, and error details

#### Features
- **Personalized Interpretations**: 2-3 paragraph readings tailored to user's question
- **Position Awareness**: Different guidance for past/present/future/outcome positions
- **Conversational Tone**: Maintains Vesper's unique voice throughout
- **Non-Deterministic Language**: Uses "might," "suggests," "consider" vs predictions
- **Target Performance**: <5 seconds response time, ~400 tokens per interpretation
- **Content Safety**: Redirects harmful questions to mental health resources

### Added - VSPR-48: Firebase Cloud Messaging

#### Backend
- **Firebase Admin SDK Integration** (`api/routes/notifications.py`)
  - `POST /api/py/notifications/subscribe` - Subscribe users to push notifications
  - `DELETE /api/py/notifications/unsubscribe` - Unsubscribe from notifications
  - `POST /api/py/notifications/send-test` - Send test notification
  - `POST /api/py/notifications/schedule-daily` - Enable daily reminders
  - `POST /api/py/notifications/send-daily-card` - Batch send daily reminders
  - `GET /api/py/notifications/status` - Service status and statistics
  - In-memory token storage (production should use database)
  - Support for notification preferences and scheduling
  - A/B testing with multiple notification templates

#### Frontend
- **Firebase Client** (`lib/firebase.ts`)
  - Firebase app initialization with environment config
  - Firebase Cloud Messaging setup
  - Permission request flow with user-friendly prompts
  - FCM token management (get, refresh, store)
  - Foreground message handling
  - Subscribe/unsubscribe utilities
  - Browser support detection
  - Permission status checking

- **Service Worker** (`public/firebase-messaging-sw.js`)
  - Background notification handling
  - Notification click handling with deep linking
  - Tab focus/reuse logic
  - Custom notification options (icon, badge, tag)
  - Action button support (commented, ready for use)

#### Features
- **Smart Permission Timing**: Request after first reading (not on page load)
- **Cross-Platform Support**: Works on iOS Safari 16.4+, Android Chrome, Desktop
- **Daily Reminders**: Scheduled notifications for habit formation
- **A/B Testing**: Multiple notification templates for engagement testing
- **Preference Management**: Users can enable/disable and set notification times
- **Deep Linking**: Notifications open app to correct page
- **Token Refresh**: Automatic handling of expired tokens

### Configuration
- **Environment Variables** (`.env.example`)
  - `ANTHROPIC_API_KEY` - Claude API authentication
  - `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase web app API key
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project identifier
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - FCM sender ID
  - `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase app identifier
  - `NEXT_PUBLIC_FIREBASE_VAPID_KEY` - Web push VAPID key
  - `FIREBASE_SERVICE_ACCOUNT_PATH` - Path to Firebase admin credentials
  - Additional Firebase admin SDK credentials (optional individual fields)

### Dependencies
- **Python** (`requirements.txt`)
  - `anthropic==0.39.0` - Claude API client
  - `firebase-admin==6.6.0` - Firebase Admin SDK
  - `python-dotenv==1.0.1` - Environment variable management
  - `pydantic==2.9.2` - Request/response validation
  - `requests==2.31.0` - HTTP client for testing

- **Node.js** (`package.json`)
  - `firebase@^10.14.1` - Firebase JavaScript SDK

### Documentation
- **API Integration Guide** (`docs/API_INTEGRATION_GUIDE.md`)
  - Comprehensive setup instructions for Claude API and Firebase
  - Architecture diagrams and data flow
  - Usage examples and code snippets
  - Troubleshooting guide
  - Production deployment checklist
  - Best practices for notification UX

- **Quick Start Guide** (`docs/SETUP_QUICK_START.md`)
  - 5-minute setup walkthrough
  - Step-by-step API key acquisition
  - Configuration examples
  - Verification tests
  - Common troubleshooting

### Testing
- **Test Script** (`api/test_interpret.py`)
  - Automated health check tests
  - Interpretation generation tests
  - Content moderation validation
  - Fallback mode testing
  - Various question types and positions
  - Detailed test output with pass/fail summary

### Security
- **Content Moderation**: Harmful content pattern detection with safe redirects
- **Environment Security**: Sensitive credentials in `.env.local` (git-ignored)
- **CORS Configuration**: Added CORS middleware (configure for production)
- **.gitignore Updates**: Firebase service account files, environment files

### Infrastructure
- **API Routes Organization**: Created `api/routes/` structure for modularity
- **Router Integration**: All new routers registered in `api/index.py`
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Logging**: Structured logging for debugging and monitoring

## Performance Targets

- **Claude API Response Time**: <5 seconds per card
- **Token Usage**: ~400 tokens per interpretation
- **API Success Rate**: >99% (including fallback)
- **Notification Delivery**: Real-time push on all supported platforms

## Browser Support

- **iOS Safari**: 16.4+ (push notifications)
- **Android Chrome**: Latest 2 versions
- **Desktop Chrome**: Latest 2 versions
- **Desktop Firefox**: Latest 2 versions
- **Desktop Safari**: Latest 2 versions

## Known Limitations

- FCM token storage is in-memory (production needs database)
- Daily notification scheduling requires external cron/scheduler
- Service worker config has placeholder values (needs manual update)
- No authentication on notification endpoints (add in production)
- Content moderation uses simple regex (consider ML-based in production)

## Migration Notes

To upgrade to this version:

1. Install new dependencies: `pip3 install -r requirements.txt && npm install`
2. Copy `.env.example` to `.env.local`
3. Configure Claude API key from https://console.anthropic.com/
4. Set up Firebase project at https://console.firebase.google.com/
5. Update `public/firebase-messaging-sw.js` with Firebase config
6. Test endpoints with provided test script
7. Review security settings before production deployment

## Related Issues

- VSPR-47: Claude API Integration & Prompt Engineering
- VSPR-48: Firebase Cloud Messaging Setup

---

**Version**: Unreleased
**Date**: 2025-11-29
**Branch**: `claude/api-firebase-setup-01XdxGBR7BjWqJYr7Wg82zpe`
