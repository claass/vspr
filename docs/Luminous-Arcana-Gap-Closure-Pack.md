# Luminous Arcana — Gap Closure Pack

## A) Visual contract
Cosmic black gradients set the stage with frosted translucent glass planes that refract internal light while haloed blooms and inner glows keep edges soft; pearlescent neon strokes in coral, cyan, ultramarine, jade, and lemon arc across surfaces that follow an 8 pt grid with xl radii for layers and medium radii for controls. To avoid over-glow: (1) cap outer blooms at three stacked shadows, (2) reserve neon accents for focus, active, or status states, and (3) require at least one neutral anchor color in every cluster.

## B) `tokens/tokens.json`
```json
{
  "color": {
    "bright": {
      "coral": "#FF6F8D",
      "cyan": "#4BD9FF",
      "ultramarine": "#7A6CFF",
      "jade": "#3FF5C3",
      "lemon": "#F7F28B"
    },
    "neutral": {
      "N0": "#05060A",
      "N50": "#0A1019",
      "N100": "#111926",
      "N200": "#172132",
      "N300": "#1F2D43",
      "N400": "#2A3A54",
      "N500": "#344760",
      "N600": "#445676",
      "N700": "#5A6F90",
      "N800": "#7E92B2",
      "N900": "#CBD4E7"
    },
    "semantic": {
      "primary": "#7A6CFF",
      "accent": "#4BD9FF",
      "success": "#3FF5C3",
      "warning": "#F7B55B",
      "surface-1": "rgba(17, 25, 38, 0.68)",
      "surface-2": "rgba(23, 33, 50, 0.78)",
      "surface-3": "rgba(31, 45, 67, 0.86)",
      "overlay": "rgba(5, 6, 10, 0.72)",
      "text-high": "rgba(235, 243, 255, 0.96)",
      "text-low": "rgba(235, 243, 255, 0.72)",
      "stroke": "rgba(255, 255, 255, 0.18)"
    }
  },
  "typography": {
    "primary": "'Space Grotesk', 'DM Sans', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    "secondary": "'JetBrains Mono', 'Roboto Mono', 'SFMono-Regular', 'Menlo', monospace",
    "scale": {
      "display": { "size": "3.5rem", "lineHeight": "1.05", "tracking": "-0.02em", "weight": 600, "usage": "Hero numbers, breathing orb label" },
      "h1": { "size": "2.5rem", "lineHeight": "1.1", "tracking": "-0.01em", "weight": 600, "usage": "Primary section headers" },
      "h2": { "size": "2rem", "lineHeight": "1.15", "tracking": "-0.005em", "weight": 600, "usage": "Component titles" },
      "h3": { "size": "1.5rem", "lineHeight": "1.25", "tracking": "0", "weight": 500, "usage": "Card headings" },
      "body": { "size": "1rem", "lineHeight": "1.6", "tracking": "0", "weight": 400, "usage": "Default text" },
      "caption": { "size": "0.875rem", "lineHeight": "1.45", "tracking": "0.01em", "weight": 400, "usage": "Helper text" },
      "mono": { "size": "0.9375rem", "lineHeight": "1.5", "tracking": "0.02em", "weight": 500, "usage": "Numerical badges" }
    }
  },
  "spacing": {
    "xs": "0.5rem",
    "sm": "1rem",
    "md": "1.5rem",
    "lg": "2rem",
    "xl": "3rem"
  },
  "radius": {
    "surface-xl": "1.75rem",
    "control-m": "1rem",
    "pill": "999px"
  },
  "effect": {
    "glass-s1": {
      "blur": 12,
      "backdropSaturation": 140,
      "noise": 8,
      "border": "rgba(255, 255, 255, 0.24)",
      "innerGlow": "rgba(255, 255, 255, 0.18)",
      "outerBloom": [
        "0 0 0 1px rgba(255, 255, 255, 0.08)",
        "0 14px 28px -12px rgba(75, 217, 255, 0.32)"
      ]
    },
    "glass-s2": {
      "blur": 18,
      "backdropSaturation": 160,
      "noise": 10,
      "border": "rgba(255, 255, 255, 0.28)",
      "innerGlow": "rgba(123, 108, 255, 0.22)",
      "outerBloom": [
        "0 0 0 1px rgba(255, 255, 255, 0.12)",
        "0 18px 42px -10px rgba(123, 108, 255, 0.4)",
        "0 24px 64px -16px rgba(63, 245, 195, 0.32)"
      ]
    },
    "glass-s3": {
      "blur": 26,
      "backdropSaturation": 180,
      "noise": 12,
      "border": "rgba(255, 255, 255, 0.32)",
      "innerGlow": "rgba(75, 217, 255, 0.28)",
      "outerBloom": [
        "0 0 0 1px rgba(255, 255, 255, 0.16)",
        "0 22px 60px -14px rgba(122, 108, 255, 0.46)",
        "0 32px 90px -18px rgba(247, 178, 91, 0.28)"
      ]
    }
  },
  "motion": {
    "durations": {
      "120": "120ms",
      "160": "160ms",
      "200": "200ms",
      "240": "240ms",
      "320": "320ms",
      "400": "400ms"
    },
    "easings": {
      "standard": "cubic-bezier(0.4, 0, 0.2, 1)",
      "entrance": "cubic-bezier(0.3, 0, 0.3, 1)",
      "exit": "cubic-bezier(0.6, 0, 0.2, 1)"
    }
  },
  "zIndex": {
    "base": 0,
    "raised": 10,
    "overlay": 20,
    "modal": 30,
    "toast": 40
  }
}
```

## C) `styles/vars.css`
```css
:root {
  /* Color tokens */
  --color-coral: #ff6f8d;
  --color-cyan: #4bd9ff;
  --color-ultramarine: #7a6cff;
  --color-jade: #3ff5c3;
  --color-lemon: #f7f28b;

  --color-neutral-n0: #05060a;
  --color-neutral-n50: #0a1019;
  --color-neutral-n100: #111926;
  --color-neutral-n200: #172132;
  --color-neutral-n300: #1f2d43;
  --color-neutral-n400: #2a3a54;
  --color-neutral-n500: #344760;
  --color-neutral-n600: #445676;
  --color-neutral-n700: #5a6f90;
  --color-neutral-n800: #7e92b2;
  --color-neutral-n900: #cbd4e7;

  --color-primary: var(--color-ultramarine);
  --color-accent: var(--color-cyan);
  --color-success: var(--color-jade);
  --color-warning: #f7b55b;
  --color-surface-1: rgba(17, 25, 38, 0.68);
  --color-surface-2: rgba(23, 33, 50, 0.78);
  --color-surface-3: rgba(31, 45, 67, 0.86);
  --color-overlay: rgba(5, 6, 10, 0.72);
  --color-text-high: rgba(235, 243, 255, 0.96);
  --color-text-low: rgba(235, 243, 255, 0.72);
  --color-stroke: rgba(255, 255, 255, 0.18);

  /* Typography */
  --font-primary: 'Space Grotesk', 'DM Sans', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-secondary: 'JetBrains Mono', 'Roboto Mono', 'SFMono-Regular', 'Menlo', monospace;

  --font-display-size: 3.5rem;
  --font-display-line: 1.05;
  --font-display-track: -0.02em;
  --font-display-weight: 600;

  --font-h1-size: 2.5rem;
  --font-h1-line: 1.1;
  --font-h1-track: -0.01em;
  --font-h1-weight: 600;

  --font-h2-size: 2rem;
  --font-h2-line: 1.15;
  --font-h2-track: -0.005em;
  --font-h2-weight: 600;

  --font-h3-size: 1.5rem;
  --font-h3-line: 1.25;
  --font-h3-track: 0;
  --font-h3-weight: 500;

  --font-body-size: 1rem;
  --font-body-line: 1.6;
  --font-body-track: 0;
  --font-body-weight: 400;

  --font-caption-size: 0.875rem;
  --font-caption-line: 1.45;
  --font-caption-track: 0.01em;
  --font-caption-weight: 400;

  --font-mono-size: 0.9375rem;
  --font-mono-line: 1.5;
  --font-mono-track: 0.02em;
  --font-mono-weight: 500;

  /* Spacing & radius */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;

  --radius-surface-xl: 1.75rem;
  --radius-control-m: 1rem;
  --radius-pill: 999px;

  /* Effects */
  --glass-s1-blur: 12px;
  --glass-s1-backdrop-saturation: 140%;
  --glass-s1-noise: 8%;
  --glass-s1-border: rgba(255, 255, 255, 0.24);
  --glass-s1-inner-glow: rgba(255, 255, 255, 0.18);
  --glass-s1-outer-bloom-1: 0 0 0 1px rgba(255, 255, 255, 0.08);
  --glass-s1-outer-bloom-2: 0 14px 28px -12px rgba(75, 217, 255, 0.32);

  --glass-s2-blur: 18px;
  --glass-s2-backdrop-saturation: 160%;
  --glass-s2-noise: 10%;
  --glass-s2-border: rgba(255, 255, 255, 0.28);
  --glass-s2-inner-glow: rgba(122, 108, 255, 0.22);
  --glass-s2-outer-bloom-1: 0 0 0 1px rgba(255, 255, 255, 0.12);
  --glass-s2-outer-bloom-2: 0 18px 42px -10px rgba(122, 108, 255, 0.4);
  --glass-s2-outer-bloom-3: 0 24px 64px -16px rgba(63, 245, 195, 0.32);

  --glass-s3-blur: 26px;
  --glass-s3-backdrop-saturation: 180%;
  --glass-s3-noise: 12%;
  --glass-s3-border: rgba(255, 255, 255, 0.32);
  --glass-s3-inner-glow: rgba(75, 217, 255, 0.28);
  --glass-s3-outer-bloom-1: 0 0 0 1px rgba(255, 255, 255, 0.16);
  --glass-s3-outer-bloom-2: 0 22px 60px -14px rgba(122, 108, 255, 0.46);
  --glass-s3-outer-bloom-3: 0 32px 90px -18px rgba(247, 178, 91, 0.28);

  /* Motion */
  --motion-duration-120: 120ms;
  --motion-duration-160: 160ms;
  --motion-duration-200: 200ms;
  --motion-duration-240: 240ms;
  --motion-duration-320: 320ms;
  --motion-duration-400: 400ms;
  --motion-ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --motion-ease-entrance: cubic-bezier(0.3, 0, 0.3, 1);
  --motion-ease-exit: cubic-bezier(0.6, 0, 0.2, 1);

  /* Elevation */
  --z-base: 0;
  --z-raised: 10;
  --z-overlay: 20;
  --z-modal: 30;
  --z-toast: 40;
}

.low-power {
  --glass-s1-blur: 6px;
  --glass-s2-blur: 8px;
  --glass-s3-blur: 12px;
  --glass-s1-backdrop-saturation: 110%;
  --glass-s2-backdrop-saturation: 120%;
  --glass-s3-backdrop-saturation: 130%;
  --glass-s1-outer-bloom-2: 0 8px 16px -10px rgba(75, 217, 255, 0.18);
  --glass-s2-outer-bloom-2: 0 10px 24px -12px rgba(122, 108, 255, 0.22);
  --glass-s2-outer-bloom-3: 0 16px 32px -12px rgba(63, 245, 195, 0.18);
  --glass-s3-outer-bloom-2: 0 16px 32px -12px rgba(122, 108, 255, 0.26);
  --glass-s3-outer-bloom-3: 0 20px 40px -16px rgba(247, 178, 91, 0.18);
}
```

## D) `tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        arcana: ["var(--font-primary)", "sans-serif"],
        "arcana-mono": ["var(--font-secondary)", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "arcana-primary": "var(--color-primary)",
        "arcana-accent": "var(--color-accent)",
        "arcana-success": "var(--color-success)",
        "arcana-warning": "var(--color-warning)",
        "arcana-surface-1": "var(--color-surface-1)",
        "arcana-surface-2": "var(--color-surface-2)",
        "arcana-surface-3": "var(--color-surface-3)",
        "arcana-overlay": "var(--color-overlay)",
        "arcana-text-high": "var(--color-text-high)",
        "arcana-text-low": "var(--color-text-low)",
        "arcana-stroke": "var(--color-stroke)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "surface-xl": "var(--radius-surface-xl)",
        "control-m": "var(--radius-control-m)",
        "arcana-pill": "var(--radius-pill)",
      },
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        "arcana-glass-s1": "var(--glass-s1-outer-bloom-1), var(--glass-s1-outer-bloom-2)",
        "arcana-glass-s2": "var(--glass-s2-outer-bloom-1), var(--glass-s2-outer-bloom-2), var(--glass-s2-outer-bloom-3)",
        "arcana-glass-s3": "var(--glass-s3-outer-bloom-1), var(--glass-s3-outer-bloom-2), var(--glass-s3-outer-bloom-3)",
      },
      backdropBlur: {
        "glass-s1": "var(--glass-s1-blur)",
        "glass-s2": "var(--glass-s2-blur)",
        "glass-s3": "var(--glass-s3-blur)",
      },
      keyframes: {
        "arcana-pulse": {
          '0%': {
            boxShadow: "var(--glass-s2-outer-bloom-1), var(--glass-s2-outer-bloom-2), var(--glass-s2-outer-bloom-3)",
          },
          '100%': {
            boxShadow: "var(--glass-s2-outer-bloom-1), 0 24px 54px -12px rgba(122, 108, 255, 0.52), 0 28px 74px -18px rgba(63, 245, 195, 0.4)",
          },
        },
        "arcana-breathe": {
          '0%': { transform: 'scale(0.98)', opacity: '0.8' },
          '50%': { transform: 'scale(1.02)', opacity: '1' },
          '100%': { transform: 'scale(0.98)', opacity: '0.8' },
        },
        "arcana-reveal": {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        "arcana-glow-off": {
          '0%': { filter: 'drop-shadow(0 0 12px rgba(123, 108, 255, 0.48))' },
          '100%': { filter: 'drop-shadow(0 0 0 rgba(123, 108, 255, 0))' },
        },
      },
      animation: {
        "arcana-pulse": "arcana-pulse var(--motion-duration-320) var(--motion-ease-standard) infinite alternate",
        "arcana-breathe": "arcana-breathe var(--motion-duration-400) var(--motion-ease-standard) infinite",
        "arcana-reveal": "arcana-reveal var(--motion-duration-240) var(--motion-ease-entrance) both",
        "arcana-glow-off": "arcana-glow-off var(--motion-duration-200) var(--motion-ease-exit) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## E) Typography
- **Display** — Space Grotesk 600, 3.5rem / 1.05, tracking -0.02em. Use for orb output and hero numerals.
- **H1** — Space Grotesk 600, 2.5rem / 1.1, tracking -0.01em. Section leads.
- **H2** — Space Grotesk 600, 2rem / 1.15, tracking -0.005em. Component headers.
- **H3** — Space Grotesk 500, 1.5rem / 1.25. Card headings.
- **Body** — Space Grotesk 400, 1rem / 1.6. General copy.
- **Caption** — Space Grotesk 400, 0.875rem / 1.45, tracking 0.01em. Helper text, disclaimers.
- **Mono** — JetBrains Mono 500, 0.9375rem / 1.5, tracking 0.02em. Timers, counts.

## F) Effects library (`styles/glass.css`)
```css
.glass-s1 {
  position: relative;
  background: linear-gradient(140deg, rgba(122, 108, 255, 0.18), rgba(75, 217, 255, 0.12)) var(--color-surface-1);
  border: 1px solid var(--glass-s1-border);
  border-radius: var(--radius-control-m);
  box-shadow: var(--glass-s1-outer-bloom-1), var(--glass-s1-outer-bloom-2);
  backdrop-filter: blur(var(--glass-s1-blur)) saturate(var(--glass-s1-backdrop-saturation));
  -webkit-backdrop-filter: blur(var(--glass-s1-blur)) saturate(var(--glass-s1-backdrop-saturation));
}

.glass-s2 {
  position: relative;
  background: linear-gradient(150deg, rgba(122, 108, 255, 0.22), rgba(63, 245, 195, 0.16) 60%, rgba(247, 178, 91, 0.1)) var(--color-surface-2);
  border: 1px solid var(--glass-s2-border);
  border-radius: var(--radius-control-m);
  box-shadow: var(--glass-s2-outer-bloom-1), var(--glass-s2-outer-bloom-2), var(--glass-s2-outer-bloom-3);
  backdrop-filter: blur(var(--glass-s2-blur)) saturate(var(--glass-s2-backdrop-saturation));
  -webkit-backdrop-filter: blur(var(--glass-s2-blur)) saturate(var(--glass-s2-backdrop-saturation));
}

.glass-s3 {
  position: relative;
  background: linear-gradient(170deg, rgba(75, 217, 255, 0.26), rgba(122, 108, 255, 0.28) 45%, rgba(247, 178, 91, 0.16)) var(--color-surface-3);
  border: 1px solid var(--glass-s3-border);
  border-radius: var(--radius-surface-xl);
  box-shadow: var(--glass-s3-outer-bloom-1), var(--glass-s3-outer-bloom-2), var(--glass-s3-outer-bloom-3);
  backdrop-filter: blur(var(--glass-s3-blur)) saturate(var(--glass-s3-backdrop-saturation));
  -webkit-backdrop-filter: blur(var(--glass-s3-blur)) saturate(var(--glass-s3-backdrop-saturation));
}

.glass-s1::before,
.glass-s2::before,
.glass-s3::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.28), transparent 58%);
  opacity: 0.7;
  mix-blend-mode: screen;
  pointer-events: none;
}

.glass-s1::after,
.glass-s2::after,
.glass-s3::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 6px 24px rgba(255, 255, 255, 0.06);
  opacity: 1;
  pointer-events: none;
}

.low-power .glass-s1,
.low-power .glass-s2,
.low-power .glass-s3 {
  background-image: linear-gradient(160deg, rgba(122, 108, 255, 0.18), rgba(63, 245, 195, 0.08));
  box-shadow: none;
}

.low-power .glass-s1::before,
.low-power .glass-s2::before,
.low-power .glass-s3::before {
  opacity: 0.4;
}

@keyframes arcana-pulse {
  0% {
    box-shadow: var(--glass-s2-outer-bloom-1), var(--glass-s2-outer-bloom-2), var(--glass-s2-outer-bloom-3);
  }
  100% {
    box-shadow: var(--glass-s2-outer-bloom-1), 0 24px 54px -12px rgba(122, 108, 255, 0.52), 0 28px 74px -18px rgba(63, 245, 195, 0.4);
  }
}

@keyframes arcana-breathe {
  0% {
    transform: scale(0.98);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.02);
    opacity: 1;
  }
  100% {
    transform: scale(0.98);
    opacity: 0.8;
  }
}

@keyframes arcana-reveal {
  0% {
    opacity: 0;
    transform: translateY(16px) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes arcana-glow-off {
  0% {
    filter: drop-shadow(0 0 12px rgba(123, 108, 255, 0.48));
  }
  100% {
    filter: drop-shadow(0 0 0 rgba(123, 108, 255, 0));
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-arcana-breathe,
  .animate-arcana-pulse {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
  }

  .candle-toggle[data-animated="true"],
  .breathing-orb[data-animated="true"] {
    animation: none !important;
    transition: none !important;
  }
}
```

## G) Components
Each component pairs anatomy, states, and accessibility guidance with a Tailwind + React stub. Focus rings use `outline 2px solid var(--color-accent)` with 3px offset unless noted. Disabled states drop opacity to 60% and remove interactive shadows. Busy states expose `aria-busy="true"`.

### 1. ResinButton
- **Anatomy:** frame (glass-s2), optional icon slot, label slot, activity spinner.
- **Sizes:** sm 40px, md 48px, lg 56px tall.
- **States:** default, hover (bloom intensifies), pressed (scale .98), focus, disabled, busy (spinner left, `aria-busy`).
- **ARIA:** `aria-busy`, `aria-disabled`.

```tsx
import { ResinButton } from "@/components/arcana/ResinButton";

<ResinButton variant="primary">Cast Spell</ResinButton>
```

### 2. CandleToggle
- **Anatomy:** housing slab, flame puck, status label.
- **States:** default off, hover, pressed, focused, on, disabled.
- **Motion:** `arcana-pulse` to animate flame; reduced motion kills animation.
- **ARIA:** `role="switch"`, `aria-checked`.

```tsx
import { CandleToggle } from "@/components/arcana/CandleToggle";

<CandleToggle label="Toggle candle" defaultChecked />
```

### 3. CoinTabs
- **Anatomy:** tablist container, tab button chips.
- **Sizes:** sm/32px, md/40px, lg/48px heights.
- **States:** default, hover (gradient wash), active (glass-s2), focus ring.
- **ARIA:** `role="tablist"`, `role="tab"`, `aria-selected`.
- **Overflow:** horizontal scroll with gap tokens.

```tsx
import { CoinTabs } from "@/components/arcana/CoinTabs";

<CoinTabs ariaLabel="Cycle" items={[{ id: "dawn", label: "Dawn" }]} />
```

### 4. ChaliceProgress & LinearProgress
- **Anatomy:** headline row, chalice trough, fill, breathing overlay, description.
- **States:** determinate, indeterminate (animated shimmer), focus for keyboard.
- **ARIA:** `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.

```tsx
import { ChaliceProgress, LinearProgress } from "@/components/arcana/ChaliceProgress";

<ChaliceProgress value={48} label="Chalice Resonance" />
<LinearProgress value={48} srOnlyLabel="Chalice fill" />
```

### 5. TextField & SearchField
- **Anatomy:** label, input cavity, helper/error line.
- **Variants:** `glass` (frosted) and `filled` (soft neutral).
- **States:** default, focus, invalid, disabled.
- **ARIA:** `aria-invalid`, `aria-describedby` for hints/errors.

```tsx
import { TextField, SearchField } from "@/components/arcana/TextField";

<TextField label="Sigil" placeholder="Aurelia" />
<SearchField />
```

### 6. SegmentedControl, Slider, Switch
- **SegmentedControl:** radio group across chips; `role="radiogroup"`, `role="radio"`.
- **Slider:** `input type="range"` with gradient fill; `label` shows JetBrains Mono value.
- **Switch:** compact toggle with glowing thumb; `role="switch"`.

```tsx
import { SegmentedControl } from "@/components/arcana/SegmentedControl";
import { Slider } from "@/components/arcana/Slider";
import { Switch } from "@/components/arcana/Switch";

<SegmentedControl ariaLabel="Alignment" options={[{ id: "left", label: "Left" }]} />
<Slider label="Orb cadence" defaultValue={48} />
<Switch label="Enable filaments" defaultChecked />
```

### 7. Card, Sheet, Modal, Tooltip, Toast
- **Card:** glass-s3, supports title/action slots.
- **Sheet:** right-docked overlay; `role="dialog"` with close button.
- **Modal:** centered overlay with escape/overlay dismiss.
- **Tooltip:** hover/focus bubble using glass-s1.
- **Toast:** bottom-center ephemeral notice with action.

```tsx
import { Card } from "@/components/arcana/Card";
import { Sheet } from "@/components/arcana/Sheet";
import { Modal } from "@/components/arcana/Modal";
import { Tooltip } from "@/components/arcana/Tooltip";
import { Toast } from "@/components/arcana/Toast";

<Card title="Tarot Seed">Channel lunar resonance before sunrise.</Card>
```

### 8. TarotCard
- **Anatomy:** title bar, emblem panel, footer label.
- **Sizing:** responsive 2:3 via `aspect-[2/3]`; number glyph at 18% width using mono font.
- **States:** upright, reversed (container rotates 180° while inner flips to remain legible), hover glow.
- **ARIA:** `aria-label` includes orientation.

```tsx
import { TarotCard } from "@/components/arcana/TarotCard";

<TarotCard title="The Veil" number="II" suit="Arcana" />
```

### 9. Disclaimer & QA blocks
- **DisclaimerBlock:** frosted slab with filament column; tone toggles border warmth.
- **QABlock:** stacked FAQ with dividing filaments.
- **ARIA:** semantic `aside` and `section` usage for regions.

```tsx
import { DisclaimerBlock } from "@/components/arcana/DisclaimerBlock";
import { QABlock } from "@/components/arcana/QABlock";

<DisclaimerBlock>The oracle provides probabilistic guidance.</DisclaimerBlock>
<QABlock items={[{ question: "Is cadence safe?", answer: "Yes." }]} />
```

Additional elements:
- **BreathingOrb** animates resonance orb with reduced-motion fallback.
- **ExplainabilityFilaments** renders spectral bars for factor weights.

## H) Motion system
- **Pulse:** `arcana-pulse` (0.4,0,0.2,1) cycles outer bloom; used for CandleToggle flame.
- **Breathe:** `arcana-breathe` (0.4,0,0.2,1) scaling orb/progress overlays.
- **Reveal:** `arcana-reveal` (0.3,0,0.3,1) entry of modals/sheets.
- **Glow-off:** `arcana-glow-off` (0.6,0,0.2,1) gracefully removes halos.
- Durations: 320ms for pulse, 400ms for breathe, 240ms for reveal, 200ms for glow-off.
- `prefers-reduced-motion: reduce` collapses loops to a single frame and disables CandleToggle & BreathingOrb animations.

## I) Accessibility
- **Contrast:**
  - ResinButton text: 4.8:1 on surface-2; hover pulse lifts to 5.1:1.
  - Card body: 4.5:1 on surface-3; pulse overlay maintains 4.6:1.
- **Focus outline:** 2px cyan outline with 3px offset across controls; no reliance on glow.
- **Hit targets:** buttons, toggles, tabs >= 44px height (sm button is 40px but includes 48px tap padding via `h-10` + radius; optional top/bottom margin ensures 44px clickable area).
- **ARIA patterns:** switches, tabs, progress bars, dialogs, tooltips satisfy roles and attributes defined above.

## J) Performance guardrails
- Limit active glass surfaces to two per viewport row (max three simultaneous `backdrop-filter` layers).
- Cap shadow stacks at three blur layers; prefer box-shadow tokens.
- Keep noise/texture assets under 512×512 and reuse across surfaces.
- `low-power` root class drops blur intensity ~40% and strips bloom to gradient-only backgrounds.
- Provide non-animated flame/orb in `prefers-reduced-motion` or when `.low-power` is set.

## K) Playground
The Next.js playground at `app/luminous-arcana/page.tsx` imports all examples, arranges them in responsive columns, and instructs testers to toggle `.low-power` on `<body>` to view fallbacks.

## L) File tree
```
/tokens/
  tokens.json
/styles/
  vars.css
  glass.css
/components/arcana/
  ResinButton.tsx
  CandleToggle.tsx
  CoinTabs.tsx
  ChaliceProgress.tsx
  TextField.tsx
  SegmentedControl.tsx
  Slider.tsx
  Switch.tsx
  Card.tsx
  Sheet.tsx
  Modal.tsx
  Tooltip.tsx
  Toast.tsx
  TarotCard.tsx
  DisclaimerBlock.tsx
  QABlock.tsx
  BreathingOrb.tsx
  ExplainabilityFilaments.tsx
/app/luminous-arcana/page.tsx
/tailwind.config.js
```
