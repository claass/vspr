# PWA Icons

This directory contains the Progressive Web App icons for Vesper.

## Required Icons

- `icon-192x192.png` - Standard icon (192x192px)
- `icon-512x512.png` - Standard icon (512x512px)
- `icon-192x192-maskable.png` - Maskable icon (192x192px with safe zone)
- `icon-512x512-maskable.png` - Maskable icon (512x512px with safe zone)

## Design Guidelines

- **Background**: Use `#05060A` (N0 from design tokens)
- **Primary Color**: Use `#7A6CFF` (primary ultramarine)
- **Accent**: Use `#4BD9FF` (accent cyan)
- **Style**: Minimal, mystical, modern aesthetic
- **Maskable Safe Zone**: Keep important content within 80% of canvas (40% radius circle from center)

## Icon Suggestions

1. **Option 1**: Stylized crescent moon with stars
2. **Option 2**: Abstract tarot card outline with mystical symbols
3. **Option 3**: Minimalist "V" lettermark with celestial elements

## Generation

Icons can be generated using:
- Figma export from design system
- PWA Asset Generator: `npx @pwa/asset-generator`
- Manual design in Adobe Illustrator or Sketch
