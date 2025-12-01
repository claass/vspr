# Next.js to Vite Migration Guide

This document outlines the migration from Next.js to Vite for the Vesper project.

## What Changed

### Before (Next.js)
- Frontend: Next.js 14 with App Router
- Build tool: Next.js built-in (webpack)
- Deployment: Vercel-optimized
- Pages in `/app` directory

### After (Vite)
- Frontend: Vite + React 18 with TanStack Router
- Build tool: Vite (ultra-fast)
- Deployment: Any Node.js host or static host (Netlify, Cloudflare Pages, etc.)
- Routes in `/src/routes` directory with TanStack Router

## Directory Structure

```
old:                          new:
app/                    →     src/routes/
  page.tsx                      index.tsx
  design/page.tsx              design.tsx
  luminous-arcana/page.tsx     luminous-arcana.tsx
  layout.tsx                   __root.tsx (root layout)

components/             →     src/components/
lib/                    →     src/lib/
styles/                 →     src/styles/
data/                   →     src/data/

                              src/main.tsx (entry point)
                              index.html (Vite entry)
```

## Key Differences

### 1. Entry Point
**Next.js:** Automatic via `/app/layout.tsx`
**Vite:** Explicit `/index.html` with `<div id="root">` and `/src/main.tsx` initialization

### 2. Routing
**Next.js:** File-based routing with Next/Link
**Vite:** TanStack Router with explicit route definitions

```typescript
// Before (Next.js)
import Link from 'next/link';
<Link href="/design">Design</Link>

// After (Vite)
import { Link } from '@tanstack/react-router';
<Link to="/design">Design</Link>
```

### 3. Metadata
**Next.js:** Metadata export from layout
**Vite:** Meta tags in `/index.html`

### 4. Environment Variables
**Next.js:** `NEXT_PUBLIC_*` prefix for client-side
**Vite:** Same `NEXT_PUBLIC_*` pattern is preserved in `.env.local`

### 5. 'use client' Directives
**Next.js:** Required for client components in App Router
**Vite:** Removed (all components are client-side by default in SPA)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

This will install:
- Vite and React plugin
- TanStack Router for routing
- All existing dependencies (Firebase, Tailwind, etc.)

### 2. Environment Variables
Create/update `.env.local` with your API keys:
```bash
cp .env.example .env.local
```

Then fill in:
- `ANTHROPIC_API_KEY` - Your Claude API key
- `NEXT_PUBLIC_FIREBASE_*` - Firebase web config
- `FIREBASE_*` - Firebase admin config for backend

### 3. Running Development Server
```bash
npm run dev
```

This starts:
- Vite dev server: `http://localhost:5173`
- FastAPI backend: `http://localhost:8000` (must run separately)

In another terminal:
```bash
npm run fastapi-dev
```

Or to run both together:
```bash
npm run dev  # This concurrently runs both
```

### 4. Building for Production
```bash
npm run build
```

Outputs to `/dist` directory (instead of `.next`)

### 5. Preview Production Build
```bash
npm run preview
```

## API Integration

The Vite dev server proxies `/api/*` requests to `http://localhost:8000`:

```typescript
// src/routes/index.tsx
const response = await fetch('/api/py/draw');
// Actually hits: http://localhost:8000/api/py/draw
```

This proxy configuration is in `vite.config.ts`:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  },
}
```

## Path Aliases

Both Next.js and Vite use the same path alias:
```typescript
import { Component } from '@/components/MyComponent';
// Resolves to: src/components/MyComponent
```

Configuration in `tsconfig.json`:
```json
"paths": {
  "@/*": ["./src/*"]
}
```

## Deployment Options

### Before (Vercel-only)
- Edge Functions for image generation
- Automatic deployments from GitHub

### After (More Flexible)
**Option 1: Static Hosting** (Netlify, Cloudflare Pages, Vercel, GitHub Pages)
```bash
npm run build
# Deploy /dist to static host
```

**Option 2: Server Hosting** (Railway, Render, Fly.io)
```bash
# Run FastAPI backend + serve static Vite build
npm run build
npm run preview  # or custom Node server
```

**Option 3: Full-Stack on Single Host**
- Host Vite build as static files
- Run FastAPI on same server or separate process
- Proxy `/api/*` via nginx or similar

## Testing

### Unit Tests
```bash
npm run test
```

### Test UI
```bash
npm run test:ui
```

### Coverage
```bash
npm run test:coverage
```

## Linting

```bash
npm run lint
```

Note: Linting rules have been updated for Vite/ESM compatibility.

## Service Worker & PWA

The PWA setup remains unchanged:
- `/public/service-worker.js` - Caching strategies
- `/public/manifest.json` - PWA metadata
- `src/lib/pwa.ts` - PWA utilities

Service worker registration in `src/components/PWAInitializer.tsx` still works as expected.

## Performance Notes

### Improvements with Vite
- **Faster dev server startup** (~100ms vs ~3s with Next.js)
- **Faster HMR** (Hot Module Replacement)
- **Smaller bundle** (no Next.js runtime overhead)
- **Native ESM** in development

### Trade-offs
- No built-in server-side rendering (optional via separate framework if needed)
- No automatic image optimization (use `sharp` or external service)
- No automatic font optimization (use `<link rel="preload">` manually if needed)

## Troubleshooting

### "Cannot find module '@/components/...'"
- Verify `tsconfig.json` paths are correct
- Check that files are in `src/` directory
- Restart dev server if needed

### API calls failing with 404
- Ensure FastAPI backend is running on `http://localhost:8000`
- Check vite.config.ts proxy settings
- Verify .env.local has correct base URL

### Styles not loading
- Ensure all CSS imports are in `src/styles/index.css` or `src/routes/__root.tsx`
- Check that Tailwind CSS classes are being generated
- Verify `tailwind.config.js` includes correct paths

### Service worker not registering
- Check browser console for errors
- Ensure PWAInitializer is mounted in root layout
- Service worker file must be in `/public` directory

## Future Improvements

1. **Server-Side Rendering (Optional)**
   - Integrate with Remix or similar if needed
   - Not necessary for PWA-first app

2. **Edge Functions Replacement**
   - For shareable card images: use FastAPI + Pillow/ImageMagick
   - Or use external service like Cloudinary

3. **Advanced Routing**
   - TanStack Router supports nested routes, loaders, actions
   - Can be enhanced as complexity grows

## Files Changed Summary

### Deleted
- `app/` - Next.js app directory
- `next.config.js` - Next.js configuration
- `components.json` - shadcn CLI config
- Old root-level `components/`, `lib/`, `styles/`, `data/`

### Created
- `src/` - All frontend code
- `src/main.tsx` - Entry point
- `src/routes/` - TanStack Router routes
- `index.html` - Vite HTML entry
- `vite.config.ts` - Vite configuration

### Modified
- `package.json` - Updated scripts and dependencies
- `tsconfig.json` - Vite-compatible settings
- `.gitignore` - Updated for Vite builds
- Components - Removed 'use client' directives

## Rollback

To revert to Next.js:
1. Keep API/Firebase branches (those are independent)
2. Restore from commit before migration
3. Remove `vite.config.ts`, `index.html`, `src/`
4. Restore `app/`, `next.config.js`, `components.json`
5. Update `package.json` dependencies

## Questions?

Refer to:
- [Vite Documentation](https://vitejs.dev/)
- [TanStack Router Docs](https://tanstack.com/router/latest)
- [React Documentation](https://react.dev/)
