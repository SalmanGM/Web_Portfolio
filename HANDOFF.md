# Handoff — Salman Binmandeel portfolio

Read this first in a new session. It records where the work stands, what has been decided, and what comes next.

## Where things live

- **Code:** https://github.com/SalmanGM/Web_Portfolio, branch `feat/nextjs-portfolio` (the default branch). Next.js 16 + React 19, static export (`npm run build` → `out/`). See `README.md`.
- **Shared board (tasks, questions, decisions):** https://claude.ai/artifact/K6vnM4krbAxPejSqsxY5bi — "Portfolio Studio". Collections in its database: `tasks`, `questions`, `decisions`. Read it with the Artifact / ArtifactData tools at the start of every session; it is the source of truth for status.
- **Original design handoff:** `project/Salman Portfolio v6.dc.html` (prototype) and `chats/` (design transcripts). Not part of the build.
- **Lab sandboxes:** `/lab`, `/lab/showcase` (Mudad device film, `?edit` for crop editor), `/lab/motion` (word reveal, blur on scroll).

## Done

1. v6 design rebuilt in Next.js: loader, hero, three work chapters, about, capabilities, contact, FLIP case study overlay, EN/AR with RTL, light/dark. Motion engine ported to `src/lib/engine.ts` (GSAP, ScrollTrigger, Lenis).
2. Light theme is the default. Loader ≈1.8s, first visit only (7 days); `?tweaks` always plays it and opens the dev Tweaks panel.
3. "Money before payday" case study beat written (EN + AR) from Salman's answer.
4. Device film draft at `/lab/showcase`: 11 shots cropped from the Mudad figure boards (`src/content/film.ts`), pinned browser window that reshapes per shot, pans within a board, blurs between boards, word-reveal captions, drifting colour background.

## Decisions (also on the board)

- Workspaces = the shared board + `/lab` sandbox pages. Ideas are tried in the lab, then moved into the real page.
- Active tracks: C · UI showcase, B · Motion direction, D · Styling. Later: A · Content, E · Launch.
- Showcase formats: annotated hotspots, rebuilt clickable UI, device frames that move with the scroll. No before/after slider for now.
- First clickable rebuild: **Autopayroll setup**. Screens should be redesigned to look sleeker for presentation. No NDA limits unless stated.
- Motion mixes by section: paper & ink for loader and case studies, cinematic for chapter paintings, snappy for UI details.
- Showcased UI sits in clean browser / phone frames.
- Motion references: lukebaffait.fr (subtle scroll blur, project-list hover + click transition), toyfight.co/services (text reveal on scroll), YouTube `IStiszvY5h8` 18:17–23:50 (illustrated UI animation over animated backgrounds; Claude can't watch video — work from Salman's description).
- Salman wants to rethink the hero layout and the layout of the three main sections, and what to show.

## Next steps, in order

1. **Reference sites — studied (28 Oct).** Write-up with frames, timings from their code and live demos: https://claude.ai/artifact/B9tDmC8DaTgHAr5BCZn24W. Both use GSAP + Lenis (nothing to install). ToyFight = lines rise out of an `overflow:hidden` mask, `translateY(105%)→0`, 1.2s expo-out (`cubic-bezier(.19,1,.22,1)`), 0.1s/line, plays once at 20% into view. Luke = each word `opacity 0 + blur → sharp`, scrubbed from `top 75%` to `top 60%`, no blur on touch; project list is scroll-active (row nearest centre) with a preview card and a ~2s title-flight open. Proposal: split `/lab/motion`'s reveal into a line rise (headings) and a scroll focus (prose); never split Arabic by character. Salman chose Luke for prose, ToyFight for headings: built as `RevealLines` and `FocusWords` in `src/components/lab/`, demoed in `/lab/motion` (EN + AR).
2. **Get Salman's feedback on the device film** (scroll speed, hold time, blur, captions, background) and revise.
3. **Figma:** ask for the Figma links (Autopayroll screens; Saned, Subscriptions, One To X). Make sleeker presentation versions, then build the clickable Autopayroll rebuild in `/lab/showcase`.
4. **Layout options:** build 2–3 options for the hero and the three main sections side by side in a new `/lab/layout`, including a lukebaffait-style project list with hover preview and click transition.
5. **CV material:** Claude can't see other chats. Ask Salman to paste or upload his CV for hotspot copy and case study detail.
6. **Deploy:** the code is on GitHub; next is hosting (Vercel/Netlify/GitHub Pages) and a domain.

## Still placeholder

Contact email and links (`src/content/site.ts`), chapter paintings and portrait (`src/content/images.ts`), screenshots for Subscriptions / Saned / One To X, the Mudad case study hero image (`hero-auto-payroll.webp` was never uploaded).

## Video reference

YouTube refuses downloads from the cloud session (HTTP 403), and getting around that would mean bypassing its bot check, which Claude won't do. To analyse the IStiszvY5h8 18:17–23:50 section, Salman uploads the clip (a screen recording is fine) into the session; Claude then extracts frames with ffmpeg.

## Gotchas

- `gsap.registerPlugin(ScrollTrigger)` runs at import in `src/lib/engine.ts`, because child components create ScrollTriggers in effects that run before their parents' effects.
- Both languages are always in the DOM; CSS hides the inactive one via `html[data-lang]`. Use the `L` component for bilingual text.
- The Mudad figures are presentation boards (UI pieces on paper with baked-in captions), not raw screens. The film crops them; Fig. 05 still shows a patch of board beside its overlapping panel.
- When serving `out/` locally, restart the server after each build (a stale server keeps serving the deleted folder).
