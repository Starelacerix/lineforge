# LineForge Studio

LineForge Studio is a one-page, installable Progressive Web App for learning to draw through structured creative missions.

## What is included

- `index.html` — app shell, tabs, canvas, lesson cards
- `style.css` — iPad-friendly visual system
- `app.js` — prompt engine, local saved library, canvas tools, sharing, speech synthesis
- `manifest.webmanifest` — install metadata and icon references
- `service-worker.js` — offline app-shell cache
- `` — PWA and Apple touch icons

## Core features

- Drawing mission generator
- Step-by-step drawing coach
- Shape language mini lessons
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
4. Launch LineForge from the Home Screen.
5. Open once online before testing offline mode.

## Updating the app

When changing cached files, update `CACHE_NAME` in `service-worker.js`, for example:
`lineforge-studio-v2`.
