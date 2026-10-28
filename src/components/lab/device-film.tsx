'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BOARD, FILM, figSrc, type Shot } from '@/content/film';
import { ScrollTrigger } from '@/lib/engine';
import { L } from '../ui';
import { SplitWords } from './split-words';

type Crop = Shot['crop'];
const CHROME = 38; // browser title bar height, px
const HOLD = 0.55; // share of each shot's scroll spent holding before the move to the next
const EDIT_KEY = 'film-crops';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const aspectOf = (c: Crop) => clamp(((c[2] - c[0]) * BOARD.w) / ((c[3] - c[1]) * BOARD.h), 1.15, 2.4);

/** Places the board image so `crop` fills a box of cw×ch (contain). */
function place(img: HTMLImageElement, c: Crop, cw: number, ch: number) {
  const w = (c[2] - c[0]) * BOARD.w, h = (c[3] - c[1]) * BOARD.h;
  const s = Math.min(cw / w, ch / h);
  const ox = (cw - w * s) / 2 - c[0] * BOARD.w * s;
  const oy = (ch - h * s) / 2 - c[1] * BOARD.h * s;
  img.style.transform = `translate3d(${ox}px,${oy}px,0) scale(${s})`;
  // Show only the crop, so the paper board around the UI never leaks in when the window letterboxes.
  img.style.clipPath = `inset(${c[1] * 100}% ${(1 - c[2]) * 100}% ${(1 - c[3]) * 100}% ${c[0] * 100}%)`;
}

/**
 * Scroll-driven "product film" of the Mudad Payroll screens. A clean browser window stays pinned
 * while the page scrolls; it reshapes to each shot, pans across a board for paired shots
 * (before/after, off/on) and blurs across to the next board otherwise.
 */
export function DeviceFilm({ editable = false }: { editable?: boolean }) {
  const [shots, setShots] = useState<Shot[]>(FILM);
  const [active, setActive] = useState(0);
  const [reduce, setReduce] = useState(false);
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const layerA = useRef<HTMLDivElement>(null);
  const layerB = useRef<HTMLDivElement>(null);
  const imgA = useRef<HTMLImageElement>(null);
  const imgB = useRef<HTMLImageElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const progress = useRef(0);
  const shotsRef = useRef(shots);
  shotsRef.current = shots;
  const activeRef = useRef(0);

  // Crop overrides from the editor survive reloads in this browser only.
  useEffect(() => {
    setReduce(matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (!editable) return;
    try {
      const saved = JSON.parse(localStorage.getItem(EDIT_KEY) || 'null') as Record<string, Crop> | null;
      if (saved) setShots(FILM.map((s) => (saved[s.id] ? { ...s, crop: saved[s.id] } : s)));
    } catch {}
  }, [editable]);

  const render = useCallback(() => {
    const st = stage.current, w = win.current, A = layerA.current, B = layerB.current, ia = imgA.current, ib = imgB.current;
    if (!st || !w || !A || !B || !ia || !ib) return;
    const list = shotsRef.current, N = list.length;
    const f = clamp(progress.current, 0, 1) * N;
    let i = Math.floor(f), local = f - i;
    if (i >= N - 1) { i = N - 1; local = 0; }
    const t = ease(clamp((local - HOLD) / (1 - HOLD), 0, 1));
    const a = list[i], b = list[Math.min(i + 1, N - 1)];

    // Window size: fit the shot's aspect into the space above the caption.
    const narrow = st.clientWidth < 760;
    const maxW = Math.min(1160, st.clientWidth * (narrow ? 0.92 : 0.8));
    const maxH = st.clientHeight * (narrow ? 0.46 : 0.56) - CHROME;
    const size = (c: Crop) => { const r = aspectOf(c), cw = Math.min(maxW, maxH * r); return [cw, cw / r]; };
    const [aw, ah] = size(a.crop), [bw, bh] = size(b.crop);
    const cw = lerp(aw, bw, t), ch = lerp(ah, bh, t);
    w.style.width = cw + 'px';
    w.style.height = ch + CHROME + 'px';

    const hold = 1 + 0.02 * clamp(local / HOLD, 0, 1); // slow push-in while a shot holds
    if (ia.dataset.fig !== a.fig) { ia.src = figSrc(a.fig); ia.dataset.fig = a.fig; }
    if (a.fig === b.fig || t === 0) {
      // Same board: one layer, the camera pans between the two crops.
      const c = a.crop.map((v, k) => lerp(v, b.crop[k], t)) as Crop;
      place(ia, c, cw, ch);
      A.style.cssText = `opacity:1;filter:none;transform:scale(${a.fig === b.fig ? lerp(hold, 1, t) : hold})`;
      B.style.opacity = '0';
    } else {
      // New board: blur across.
      if (ib.dataset.fig !== b.fig) { ib.src = figSrc(b.fig); ib.dataset.fig = b.fig; }
      place(ia, a.crop, cw, ch);
      place(ib, b.crop, cw, ch);
      A.style.cssText = `opacity:${1 - t};filter:blur(${t * 14}px);transform:scale(${hold * (1 - 0.04 * t)})`;
      B.style.cssText = `opacity:${t};filter:blur(${(1 - t) * 14}px);transform:scale(${1.04 - 0.04 * t})`;
    }
    if (bar.current) bar.current.style.transform = `scaleX(${clamp(progress.current, 0, 1)})`;
    const now = t < 0.5 ? i : Math.min(i + 1, N - 1);
    if (now !== activeRef.current) { activeRef.current = now; setActive(now); }
  }, []);

  useEffect(() => {
    if (reduce || !section.current) return;
    const trig = ScrollTrigger.create({
      trigger: section.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => { progress.current = self.progress; render(); }
    });
    const ro = new ResizeObserver(render);
    ro.observe(stage.current!);
    render();
    return () => { trig.kill(); ro.disconnect(); };
  }, [reduce, render]);

  useEffect(() => { render(); }, [shots, render]);

  // Preload every board once, so a blur never waits on the network.
  useEffect(() => { [...new Set(FILM.map((s) => s.fig))].forEach((f) => { const im = new Image(); im.src = figSrc(f); }); }, []);

  const chapters = useMemo(() => {
    const out: { en: string; ar: string; from: number; to: number }[] = [];
    shots.forEach((s, k) => {
      const last = out[out.length - 1];
      if (last && last.en === s.chapter.en) last.to = k; else out.push({ ...s.chapter, from: k, to: k });
    });
    return out;
  }, [shots]);

  const shot = shots[active];

  if (reduce) {
    // Reduced motion: the finished figures as a plain sequence, captions included.
    return (
      <section className="film-static">
        {shots.filter((s, k) => k === 0 || shots[k - 1].fig !== s.fig).map((s) => (
          <figure key={s.id}>
            <img src={figSrc(s.fig)} alt={s.caption.en} loading="lazy" decoding="async" />
          </figure>
        ))}
      </section>
    );
  }

  return (
    <section ref={section} className="film" style={{ height: `${shots.length * 100 + 40}vh` }} aria-label="Mudad Payroll, in motion">
      <div ref={stage} className="film-stage">
        <div className="film-bg" aria-hidden="true" data-chapter={chapters.findIndex((c) => active >= c.from && active <= c.to)}>
          <span className="blob b1" />
          <span className="blob b2" />
          <span className="blob b3" />
        </div>

        <div className="film-head">
          <span className="mono film-kicker"><L en="Mudad Payroll · in motion" ar="رواتب مُدد · بالحركة" /></span>
          <span key={shot.chapter.en} className="film-chapter display"><L en={shot.chapter.en} ar={shot.chapter.ar} /></span>
          <span className="mono film-count" dir="ltr">
            <span className="num">{String(active + 1).padStart(2, '0')}</span> / {String(shots.length).padStart(2, '0')}
          </span>
        </div>

        <div ref={win} className="film-window">
          <div className="film-chrome" aria-hidden="true">
            <span className="film-dots"><i /><i /><i /></span>
            <span className="film-url" dir="ltr">
              <svg width="10" height="10" viewBox="0 0 10 10"><path d="M3 4.5V3a2 2 0 0 1 4 0v1.5M2.5 4.5h5v4h-5z" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
              {shot.url}
            </span>
            <span className="film-dots film-dots-ghost" />
          </div>
          <div className="film-view">
            <div ref={layerA} className="film-layer"><img ref={imgA} alt="" draggable={false} /></div>
            <div ref={layerB} className="film-layer"><img ref={imgB} alt="" draggable={false} /></div>
            {shot.chip && <span key={shot.id} className="film-chip mono"><L en={shot.chip.en} ar={shot.chip.ar} /></span>}
          </div>
        </div>

        <p className="film-caption" aria-live="polite">
          <span lang="en"><SplitWords key={shot.id + 'en'} text={shot.caption.en} /></span>
          <span lang="ar"><SplitWords key={shot.id + 'ar'} text={shot.caption.ar} /></span>
        </p>

        <div className="film-rail" aria-hidden="true">
          <span ref={bar} className="film-rail-bar" />
          {chapters.map((c) => {
            const on = active >= c.from && active <= c.to;
            return (
              <span key={c.en} className={'film-rail-ch mono' + (on ? ' on' : '')} style={{ insetInlineStart: (c.from / shots.length) * 100 + '%' }}>
                {on && <L en={c.en} ar={c.ar} />}
              </span>
            );
          })}
        </div>

        {editable && <CropEditor shot={shot} onChange={(crop) => {
          const next = shots.map((s) => (s.id === shot.id ? { ...s, crop } : s));
          setShots(next);
          try { localStorage.setItem(EDIT_KEY, JSON.stringify(Object.fromEntries(next.map((s) => [s.id, s.crop])))); } catch {}
        }} onReset={() => { setShots(FILM); try { localStorage.removeItem(EDIT_KEY); } catch {} }} shots={shots} />}
      </div>
    </section>
  );
}

/** Lab-only: nudge the current shot's crop and copy the result into src/content/film.ts. */
function CropEditor({ shot, shots, onChange, onReset }: { shot: Shot; shots: Shot[]; onChange: (c: Crop) => void; onReset: () => void }) {
  const [copied, setCopied] = useState(false);
  const names = ['left', 'top', 'right', 'bottom'];
  return (
    <div className="crop-ed" data-lenis-prevent="">
      <p className="mono">Crop · {shot.id}</p>
      {shot.crop.map((v, k) => (
        <label key={k} className="crop-row">
          <span>{names[k]} <b>{v.toFixed(3)}</b></span>
          <input type="range" min={0} max={1} step={0.005} value={v}
            onChange={(e) => { const c = [...shot.crop] as Crop; c[k] = +e.target.value; onChange(c); }} />
        </label>
      ))}
      <div className="crop-btns">
        <button type="button" onClick={() => {
          const text = shots.map((s) => `${s.id}: [${s.crop.map((n) => n.toFixed(3)).join(', ')}]`).join('\n');
          navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }).catch(() => {});
        }}>{copied ? 'Copied' : 'Copy all crops'}</button>
        <button type="button" onClick={onReset}>Reset</button>
      </div>
    </div>
  );
}

