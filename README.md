# Vesper

**Modern mysticism meets digital serenity**

Vesper is a daily tarot companion that blends contemplative reflection with AI-powered insight. Built for clarity, not fortune-telling, it guides you through your inner landscape with beautiful, mindful design.

## Design Philosophy

Vesper's aesthetic draws from *cosmic noir*—frosted glass planes suspended in deep space, illuminated by internal light that feels alive. Every element is designed to evoke the atmosphere of a midnight ritual: candlelight flickering, resin surfaces glowing softly, and gentle motion that breathes rather than bounces.

**Design Principles:**
- **Guidance, not gospel**: Tarot as a mirror for reflection, never deterministic
- **Still-life composition**: Each screen arranged like a sacred object under moonlight
- **Restrained motion**: Reveals unfold at 350–450ms with soft easing; no snappy or elastic timing
- **Accessible mysticism**: Full WCAG AA compliance with Display-P3 color gamut support

For complete design specifications, see [Design Guidelines](./docs/Luminous-Arcana-Gap-Closure-Pack.md).

---

## Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.9+ (for FastAPI backend)
- **Firebase account** (for push notifications in dev/production)
- Modern browser with service worker support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vesper.git
   cd vesper
   ```

2. **Install dependencies**
   ```bash
   npm install
   pip install -r requirements.txt
   ```

3. **Set up environment variables**

   Create `.env.local` in the project root:
   ```env
   # Firebase (for push notifications)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

   # Claude API (for AI interpretations)
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

   Get Firebase credentials from the [Firebase Console](https://console.firebase.google.com/).

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app runs at `http://localhost:3000`.

   **Note:** Service workers only activate in production builds or over HTTPS. In development, readings are stored in localStorage but offline functionality is limited. Run `npm run build && npm start` to test PWA features locally.

---

## Architecture & Tech Decisions

### Why localStorage instead of a database?
**Speed and simplicity.** Phase 0 focuses on proving the core experience—daily draws, AI interpretations, reading history—without infrastructure overhead. localStorage gives us instant persistence, works offline by default, and eliminates server costs during MVP validation. We'll migrate to a backend when social features (Phase 2) require cross-device sync.

### Why PWA instead of React Native/Expo?
**Fast iteration and web-first reach.** PWAs install like native apps, work offline, and receive push notifications—all without app store gatekeeping. We can ship updates instantly, test on any device with a browser, and avoid platform-specific build complexity. See [PWA Implementation Guide](./docs/PWA-IMPLEMENTATION.md) for architecture details.

### Why Vercel?
**Edge functions + instant deploys.** Vercel's serverless functions let us generate shareable reading images on-demand (using Vercel's image optimization) without managing a separate backend. Deploy previews for every PR make design QA seamless.

### Why Claude API?
**Contextual, non-deterministic interpretations.** Claude excels at nuanced, reflective writing that avoids fortune-telling tropes. It can weave user context (mood tags, reading history) into personalized guidance while maintaining Vesper's contemplative voice. This is our core differentiator.

### Why Firebase Cloud Messaging (FCM)?
**Reliable notifications without a custom backend.** Firebase handles push delivery across iOS, Android, and desktop with a generous free tier. We can trigger daily reading reminders without building notification infrastructure from scratch.

---

## Project Phases

### Phase 0: PWA Foundation ✨ *Current Phase*
**Goal:** Prove the core loop—draw cards, receive AI interpretation, save to history.

**Features:**
- ✅ PWA manifest & service worker (offline-first)
- ✅ localStorage schema (preferences, readings, tags)
- ✅ Claude API integration (contextual interpretations)
- ✅ Firebase FCM setup (push notification infrastructure)
- 🚧 Shareable reading cards (image generation via edge function)
- 🚧 Basic analytics (event tracking for draws, shares, installs)

**Timeline:** 2–3 weeks

---

### Phase 1: Make it Sticky (Weeks 4–10)
**Goal:** Turn one-time users into daily practitioners.

**Features:**
- Daily draw ritual (one reading per day, respecting the user's pace)
- Reading journal with search/filter (by date, tags, card arcana)
- AI contextual interpretation (mood/intent tags influence Claude's response)
- Shareable reading cards (custom images with design-system styling)
- Daily reminder notifications (customizable time via settings)
- Mood/context tagging (e.g., "career," "anxious," "clarity")

**Success Metrics:**
- 40% of users return for a 2nd reading within 7 days
- 20% weekly active users (WAU) after 30 days

---

### Phase 2: Make it Social (Weeks 11–20)
**Goal:** Add collaborative depth without becoming a social network.

**Features:**
- Multiple spread types (Past-Present-Future, Celtic Cross, custom)
- Reading comparisons with friends (side-by-side card analysis)
- Pattern analysis ("Your Mirror"—recurring cards, themes over time)
- Weekly reading summaries (email or in-app digest)
- Streak tracking (consecutive days with a reading)

**Success Metrics:**
- 10% of users compare readings with ≥1 friend
- 30% retention at 60 days

---

### Phase 3: Make it Premium (Weeks 21–32)
**Goal:** Launch sustainable revenue via premium tier.

**Features:**
- Premium tier & payments (Stripe integration)
- Advanced spreads (Celtic Cross, Tree of Life, Zodiac Wheel)
- Custom spread creator (design your own layouts)
- Voice/chat AI reflection (conversational follow-up with Claude)
- Collaborative readings (real-time shared spreads)
- Friend feed (opt-in sharing of readings to close circle)

**Success Metrics:**
- 5% conversion to premium ($4.99/month or $39.99/year)
- 50% monthly active users (MAU) at 90 days

---

## Design System

Vesper's visual language is defined in the **Luminous Arcana** design system—a framework-agnostic set of primitives built on cosmic gradients, frosted glass, and soft glows.

### Core Tokens

**Typography:**
- **Headings & UI:** Satoshi (loaded via Fontshare CDN)
- **Body copy:** Erode (with sans-serif override option)
- **Monospace:** JetBrains Mono (for timers, numerical badges)

**Color Triads:**
- **Primary:** Cyan (`#4BD9FF`), Coral (`#FF6F8D`), Peach (`#FFB27A`)
- **Alternate:** Jade (`#3FF5C3`), Ember (`#F7B55B`), Opal (`#E8D5FF`)
- **Neutrals:** N0–N900 (deep cosmic blacks to soft blue-grays)

**Materials:**
- **Glass S1/S2/S3:** Frosted translucent planes with backdrop blur, inner glow, and stacked outer blooms
- **Lighting:** Candle, moon, altar, ember (used as one-per-component guideline)

**Motion:**
- **Pulse:** 320ms ease for breathing glows (candle flame, progress orbs)
- **Breathe:** 400ms scale oscillation (0.98 → 1.02)
- **Reveal:** 240ms entrance for modals/sheets
- **Glow-off:** 200ms exit for halos

### Color Gamut
Vesper defines sRGB defaults for all tokens and overrides with **Display-P3** values where supported (Safari on macOS/iOS). Fallbacks ensure harmony across all devices.

### Accessibility
- **WCAG AA** contrast ratios (4.5:1 for body text, 3:1 for large text)
- **Focus rings:** 2px cyan outline with 3px offset (no reliance on glow alone)
- **Motion preferences:** Respects `prefers-reduced-motion` (loops freeze, parallax stops)
- **Screen reader support:** Full ARIA labeling for cards, progress, controls

**Resources:**
- [Luminous Arcana Gap Closure Pack](./docs/Luminous-Arcana-Gap-Closure-Pack.md) – Complete token reference
- [Tailwind config](./tailwind.config.js) – Design tokens as Tailwind utilities

---

## Development Workflow

### Ticket Structure
We use a **batch approach** to tickets:
1. **Context research** – Grep/read existing code to understand integration points
2. **Implementation** – Write features following design system patterns
3. **Testing** – Unit tests (Vitest) + manual QA across devices
4. **Design review** – Check against Luminous Arcana guidelines

### Tools
- **Project tracking:** Linear (link to board in Resources)
- **Design QA:** Figma (link in Resources)
- **AI implementation:** Claude Code (for rapid prototyping)
- **Testing:** Vitest for unit tests, manual testing for PWA/offline scenarios

### Code Style
- **Linting:** ESLint + Next.js config
- **Formatting:** Prettier (enforced via pre-commit hooks)
- **Type safety:** TypeScript strict mode

---

## Environment Variables

All environment variables use the `NEXT_PUBLIC_` prefix for client-side access or remain server-only.

**Required for development:**

```env
# Firebase Cloud Messaging
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Anthropic Claude API
ANTHROPIC_API_KEY=your_anthropic_key  # Server-only (for API routes)
```

**Optional:**

```env
# Analytics (Phase 0)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Vercel-specific (auto-set in production)
VERCEL_URL=auto_generated_in_production
```

Create `.env.local` for local development. **Never commit** `.env.local` to git.

---

## Contributing Guidelines

### Code Standards

1. **Design system adherence**
   - Use Luminous Arcana tokens (no hardcoded colors, spacing, or shadows)
   - Follow glass surface hierarchy (S1 for controls, S2 for cards, S3 for modals)
   - Apply motion tokens (no custom durations without design approval)

2. **Vesper voice for copy**
   - **Tone:** Contemplative, grounded, empowering
   - **Avoid:** Deterministic language ("You will…"), preachy tone, shame/guilt
   - **Embrace:** Reflection prompts ("Consider…"), agency ("You might explore…"), mystery

   **Examples:**
   - ❌ "Your future holds great success."
   - ✅ "The cards suggest momentum building in areas where you've planted seeds."

3. **Testing requirements**
   - Unit tests for business logic (tarot shuffle, localStorage helpers, etc.)
   - Manual testing for PWA features (offline mode, install prompts, notifications)
   - Cross-browser testing (Chrome, Safari, Firefox)

4. **Commit messages**
   - Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
   - Example: `feat: add daily draw limit to localStorage schema`

### localStorage Schema Migrations

⚠️ **Breaking changes** to localStorage require migration logic. See `lib/storage.ts` for schema versioning.

**Before changing schema:**
1. Bump `SCHEMA_VERSION` in `storage.ts`
2. Write migration function to transform old data
3. Test with populated localStorage from previous version

### Pull Request Process

1. Create feature branch from `main`
2. Implement changes following guidelines above
3. Run tests: `npm test`
4. Open PR with description of changes and screenshots (for UI work)
5. Request review from maintainer
6. Address feedback, then squash and merge

---

## Deployment

### Production Environment

- **Hosting:** Vercel
- **Domain:** `vesper.app` (or staging URL)
- **Service worker:** Auto-activates over HTTPS
- **Environment variables:** Set in Vercel project settings (Dashboard → Settings → Environment Variables)

### Deployment Process

1. **Merge to `main`** triggers auto-deploy to production
2. **Preview deploys** created for every PR (check Vercel bot comment)
3. **Service worker cache busting:** Increment `CACHE_VERSION` in `public/service-worker.js` when static assets change

### Firebase Credentials in Production

Add Firebase config to Vercel environment variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### Monitoring

- **Analytics:** Track draw events, shares, install prompts (Phase 0 WIP)
- **Error tracking:** (Add Sentry/LogRocket in future phases)
- **Performance:** Lighthouse CI runs on PRs (target: 90+ on mobile)

---

## Project Structure

```
vesper/
├── app/                      # Next.js 14 app directory
│   ├── page.tsx              # Home (landing/daily draw)
│   ├── layout.tsx            # Root layout with design system styles
│   ├── design/               # Design system playground
│   └── api/                  # API routes (Claude integration, image gen)
├── components/               # React components
│   ├── arcana/               # Luminous Arcana design system components
│   └── ui/                   # shadcn/ui base components
├── lib/                      # Utilities & core logic
│   ├── storage.ts            # localStorage schema & helpers
│   ├── pwa.ts                # PWA utilities (install prompts, detection)
│   └── hooks/                # React hooks (usePWA, useReadings, etc.)
├── public/                   # Static assets
│   ├── service-worker.js     # Service worker for offline/caching
│   ├── manifest.json         # PWA manifest
│   └── icons/                # App icons (192x192, 512x512, maskable)
├── styles/                   # Global CSS
│   ├── vars.css              # Design tokens as CSS custom properties
│   └── glass.css             # Glass surface effect classes
├── data/                     # Static data
│   └── cards.json            # Tarot card data (78 cards)
├── docs/                     # Documentation
│   ├── PWA-IMPLEMENTATION.md
│   └── Luminous-Arcana-Gap-Closure-Pack.md
└── api/                      # Python FastAPI backend (future)
```

---

## Resources

### Documentation
- [PWA Implementation Guide](./docs/PWA-IMPLEMENTATION.md) – Service workers, caching strategies, install flows
- [Luminous Arcana Design System](./docs/Luminous-Arcana-Gap-Closure-Pack.md) – Complete design token reference
- [Tarot Card Data](./data/cards.json) – 78-card deck schema

### External Links
- **Linear Project Board:** [Coming soon]
- **Figma Design Files:** [Coming soon]
- **Firebase Console:** https://console.firebase.google.com/
- **Vercel Dashboard:** https://vercel.com/

### Design References
- [Creative Direction v2.1](./docs/Luminous-Arcana-Gap-Closure-Pack.md) – Material tokens, lighting philosophy
- [Typography specimens](./docs/Luminous-Arcana-Gap-Closure-Pack.md#E) – Satoshi + Erode usage

---

## Brand Voice Guidelines

Vesper speaks with a **contemplative, grounded, and empowering** tone. The goal is to create space for reflection without prescribing answers.

### Core Principles

1. **Guidance, not determinism**
   - ❌ "You will meet someone new this week."
   - ✅ "The cards suggest openness to new connections—where might you create space for that?"

2. **Reflection over instruction**
   - ❌ "Do this to solve your problem."
   - ✅ "Consider what shifts when you approach this with curiosity rather than urgency."

3. **Agency and ownership**
   - ❌ "The universe has a plan for you."
   - ✅ "You're the author of your path—what do these symbols stir in you?"

4. **Mystery without mystification**
   - ❌ "Ancient wisdom reveals all."
   - ✅ "Tarot is a mirror, not a map—what do you see reflected back?"

### Avoid
- Deterministic predictions ("You will…")
- Preachy or parental tone ("You should…")
- Shame or guilt ("You failed to…")
- Over-explaining symbolism (trust the user's intuition)

### Embrace
- Open-ended questions ("What feels true here?")
- Gentle reframing ("Notice what arises when…")
- Spaciousness ("Sit with this—there's no rush.")
- Poetic simplicity ("The Tower clears what no longer serves.")

### Context-Specific Examples

**Daily draw notification:**
> "Your reading awaits. What are you carrying into this moment?"

**Reading saved to journal:**
> "Saved. Return to this when you're ready to see what shifts."

**Share reading prompt:**
> "Share this reflection with someone you trust—or keep it close."

**Install prompt (iOS):**
> "Add Vesper to your home screen for daily guidance, offline."

---

## License

MIT License. See [LICENSE](./LICENSE) for details.

---

## Acknowledgments

Built with intention by the Vesper team. Design system inspired by cosmic rituals, frosted resin, and the soft glow of candles at midnight.

Special thanks to the tarot community for centuries of reflective practice, and to the open-source contributors who make tools like Next.js, Vercel, and Claude API possible.

---

**Questions?** Open an issue or reach out to the maintainers.
**Ready to contribute?** Read the [Contributing Guidelines](#contributing-guidelines) and dive in.

✨ *May your readings bring clarity.*
