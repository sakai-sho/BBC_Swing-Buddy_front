# Next.js Standalone Frontend

This is a port of the provided Vite React app to Next.js 14 (App Router),
keeping the exact UI and in-app screen transitions. All navigation remains
state-based within `src/App.tsx`.

## Run
```bash
npm i
npm run dev
# open http://localhost:3000
```

## Notes
- Original components, screens, and state are preserved under `src/`.
- Static assets are in `public/` (including `public/images/bg.jpg`).
- TailwindCSS is configured and uses `app/globals.css` plus `src/index.css`.
