# Lakshya Bhuker — Cinematic 3D Portfolio

A React + Vite + Three.js + GSAP portfolio built by upgrading the existing project rather than replacing it with a generic template.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Structure

- `src/main.jsx` — React application, sections, interactions and Three.js scenes.
- `src/styles/main.css` — responsive visual system and animation styles.
- `public/profile.png` — supplied professional portrait, used only in the Hero.
- `public/resume.pdf` — supplied resume opened by the Hero Resume button.

## Key interactions

- First-session cinematic `LAKSHYA BHUKER` intro with a real right-to-left wipe.
- Skip intro and Replay Intro controls.
- Real supplied portrait appears only in Hero.
- Procedural Three.js delivery drone with hover, propellers, lights and mouse response.
- Drone project uses `THREE.CatmullRomCurve3`; Start, Pause, Resume and Reset control the actual 3D drone.
- Recall and Contest Tracker project visualizations.
- Keyboard `Esc` closes project overlays.
- Dark/light theme and responsive mobile navigation.
- Reduced-motion fallback.

## Source of truth

Portfolio content is based on the supplied CV. No internship, client, production scale, repository URL, project metric, contest data or certificate image is fabricated.

## Notes

The project intentionally avoids external 3D model URLs and does not require a separate backend to run the portfolio.
