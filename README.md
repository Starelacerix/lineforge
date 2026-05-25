# GlyphForge Atelier

GlyphForge Atelier is a one-page, installable Progressive Web App that teaches drawing by helping you build icons, logo marks, and character mascots.

## What changed in this version

- Renamed from **LineForge Studio** to **GlyphForge Atelier**
- Replaced "Studio" with the stronger **Forge Desk**
- Added **Icon builder**, **Mascot builder**, and **Surprise me** mission modes
- Added a full **Skill Codex** with explanations for each drawing skill
- Every generated mission now explains:
  - what the selected skill means
  - why it matters for icons or mascots
  - how to practice it
  - common mistakes to avoid
  - a specific drill
- Added stronger mascot construction and icon-readability coaching
- Kept all PWA icons in the project root

## Files

- `index.html` — app shell, tabs, mission cards, forge desk, skill codex
- `style.css` — iPad-friendly visual system
- `app.js` — prompt engine, skill explanations, local library, canvas tools, sharing, speech synthesis
- `manifest.webmanifest` — install metadata and root icon references
- `service-worker.js` — offline app-shell cache
- `icon-192.png` — root PWA icon
- `icon-512.png` — root PWA icon
- `apple-touch-icon.png` — root iPad/iOS Home Screen icon

## Core features

- Drawing mission generator
- Icon/logo mission mode
- Character mascot mission mode
- Skill Codex with teacher-style explanations
- Step-by-step drawing coach
- Critique checklist
- Apple Pencil/finger-friendly canvas
- Undo, grid, guide overlay, clear, PNG export
- Local saved mission library
- Offline-ready after first successful load
- Installable on iPad using Safari → Share → Add to Home Screen

## Deploy for free

### GitHub Pages
1. Create a new GitHub repository.
2. Upload all files in this folder.
3. Go to Settings → Pages.
4. Publish from the `main` branch root.
5. Open the generated HTTPS URL.

### Netlify
1. Drag this folder into Netlify.
2. Open the live HTTPS URL.
3. Test the manifest and service worker.

### Cloudflare Pages or Vercel
Use a static project with no build command. The published directory is the project root.

## iPad install test

1. Open the deployed URL in Safari on iPad.
2. Tap Share.
3. Tap Add to Home Screen.
4. Launch GlyphForge from the Home Screen.
5. Open once online before testing offline mode.

## Updating the app

When changing cached files, update `CACHE_NAME` in `service-worker.js`, for example:
`glyphforge-atelier-v3`.
