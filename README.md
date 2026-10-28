# Salman Binmandeel — Portfolio

The production build of the "Ink & Dune" portfolio (design v6 from Claude Design), in Next.js + React with GSAP, ScrollTrigger and Lenis.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in /out, deployable to any static host (Vercel, Netlify, GitHub Pages)
npm start        # serves /out locally
```

Open the site with `?tweaks` (e.g. `localhost:3000/?tweaks`) to get the dev-only Tweaks panel: loader animation, stop-motion speed, chapter colours, grain, stars, preloader and light rays. Changes are saved only in your browser; normal visitors always get the defaults in `src/lib/tweaks.tsx`.

## Filling in content

| What | Where |
|---|---|
| Email, LinkedIn, Read.cv, Dribbble (still placeholders) | `src/content/site.ts` |
| Screenshots, paintings, portrait, Mudad hero | drop files in `public/images/`, then set the path in `src/content/images.ts` |
| Project and case study copy (EN + AR) | `src/content/projects.ts` |
| Chapters, experience, capabilities, teams, principles | `src/content/sections.ts` |

Any image left as `null` renders as a dashed placeholder in the design's colours. The Mudad case study figures (`public/assets/mudad/`) are already in place; `hero-auto-payroll.webp` was never uploaded, so the case study hero is still a placeholder. The "Money before payday" beat body is still `[Body text to come]`.

## Structure

- `src/app/` — layout (self-hosted Google Fonts, pre-paint theme/language script) and global CSS (tokens + all section styles)
- `src/components/` — preloader, nav, hero, work chapters, about / capabilities / contact, case study overlay, tweaks panel
- `src/lib/engine.ts` — motion engine: scroll reveals, parallax, brush wipes, loader timeline, FLIP case study open/close, page peel, circle theme/language transition
- `project/`, `chats/` — the original Claude Design handoff (prototype HTML, source assets, design transcripts). Not part of the build.

Both languages are always in the DOM and CSS hides the inactive one (`html[data-lang]`), so switching is instant and Arabic flips the layout to RTL.
