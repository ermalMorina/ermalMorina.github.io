# Ermal Morina — Night Drive Portfolio

A synthwave 3D portfolio: a car cruises a neon road through Ermal Morina’s CV. Content is taken only from the supplied resume (employers, dates, projects, and copy are not invented). The phone number is intentionally omitted.

## What you get

- Scroll (or WASD / arrow keys) to drive. Shift boosts. Space jumps to the next stop. A/D changes lanes.
- Landmarks for intro, summary, skills, BMW Group, Healthread USA, Pabau Clinic Software, Starlabs LLC, education, languages, and contact.
- HTML overlays so the text stays sharp. A loading screen, bloom/headlights/particles on desktop, and a readable 2D fallback.
- 2D mode turns on automatically for mobile, `prefers-reduced-motion`, missing WebGL, or save-data. You can still switch with **Readable 2D** / **Enter 3D drive**.

## Run locally

Needs Node 20+.

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:4321](http://127.0.0.1:4321).

```bash
npm run build
npm run preview
```

`preview` also serves on port **4321**.

## Deploy

This is a static Vite app (`base: './'` so assets work at the site root or a subpath). No API keys or backend required.

### GitHub Pages

A GitHub Actions workflow in `.github/workflows/deploy-pages.yml` builds with Vite and publishes `dist/` on every push to `main`.

Preferred live URL: [https://ermalmorina.github.io](https://ermalmorina.github.io) from a public repo named `ermalMorina.github.io`.

If that user-site name is taken, use `ermal-portfolio` instead. Relative `base: './'` still loads JS, CSS, and fonts at `https://ermalmorina.github.io/ermal-portfolio/`.

After creating the GitHub repo:

1. Settings → Pages → **Source: GitHub Actions**
2. Push `main` (or run the **Deploy GitHub Pages** workflow)
3. The first deploy takes a minute; the live URL is on the workflow summary and the Pages settings page

### Other hosts

Upload `dist/` to Vercel, Netlify, or Cloudflare Pages (`npm run build`, publish directory `dist`).

## Controls

| Input | Action |
| --- | --- |
| Scroll | Drive along the CV |
| W / ↑ | Accelerate |
| S / ↓ | Reverse |
| A / D or ← / → | Lane offset |
| Shift | Boost |
| Space | Next landmark |
| Left rail dots | Jump to a section |

## Assets & credits

All 3D (car, road, palms, stations, sun, mountains) is original procedural geometry. No third-party 3D models.

Fonts (SIL Open Font License):

- [Orbitron](https://fonts.google.com/specimen/Orbitron) by Matt McInerney
- [Rajdhani](https://fonts.google.com/specimen/Rajdhani) by Indian Type Foundry

Libraries: Vite, React, TypeScript, three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing, zustand.

## Performance notes

Desktop uses adaptive DPR, fog culling, instanced-style roadside props, and an FX toggle. Low-power / mobile defaults to the 2D resume so the text remains usable if WebGL would hitch.
