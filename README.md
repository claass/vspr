# Luminous Arcana Design System Demo

This repo snapshot contains a framework-free showcase of the **Luminous Arcana v2.1** primitives and components, implemented with vanilla HTML, CSS, and JavaScript.

## Running the demo

Open `index.html` in any modern browser (Chrome, Safari, or Firefox). No build tooling is required.

## Color gamut strategy

The system defines sRGB defaults for every token and overrides with Display-P3 values inside `@supports (color: color(display-p3 …))`. The QA panel at the bottom of the page reports which gamut the current browser is using. The triad selector swaps the cyan/coral/peach, jade/ember/opal, or azure/rose/soft gold accents scene-wide, while maintaining the fallback mapping for non-P3 displays.

To QA gamut differences:

1. Load the page in a P3-capable browser (Safari on macOS) and confirm the QA panel reports “Display-P3 active.”
2. Force an sRGB-only environment (e.g., Chrome with `--force-color-profile=srgb`) and reload— the QA panel should switch to “sRGB fallback,” and the accents remain harmonious because of the fallback tokens.

## Accessibility & preferences

- **Reduce Motion** mirrors the OS setting but can be overridden via the control panel. When enabled, looping motions stop, flicker becomes a static glow, parallax layers pin in place, and the chalice progress pauses.
- **High Contrast** amplifies global contrast and adds a physical notch indicator to the active coin tabs so there is always a non-color state cue.
- **Sans-serif Body** swaps long-form copy to the Satoshi stack while headings remain Satoshi by default.
- Screen reader users receive explicit `aria-live` updates from the chalice progress and chat orb, plus ordered labels for each card (e.g., “Card 2 of 3: The Tower”).

## Design guardrails

Do:

- Compose each scene like a still-life, letting light appear to emanate from within each object.
- Use exactly one lighting token per component (`light.candle`, `light.moon`, `light.altar`, or `light.ember`).
- Apply the iridescent triad consistently across buttons, highlights, and filaments.

Don’t:

- Stack multiple glow tokens on a single component or flood elements with neon gradients.
- Remove the “Guidance, not gospel” disclaimer— it is a required ethical guardrail, with a stronger alert any time health/legal/financial topics surface.
- Override the motion ethos with snappy or elastic timing; reveals belong in the 350–450 ms ease-out range with a ~120 ms afterglow.

## Fonts

Headings and interface text use the Satoshi family; long-form copy defaults to Erode with a sans-serif override. Both fonts load via the Fontshare CDN with `font-display: swap`, and robust system fallbacks are declared for cases where network fonts are unavailable.
