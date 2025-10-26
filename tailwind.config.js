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
