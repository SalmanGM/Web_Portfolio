'use client';
/**
 * Motion engine: a port of the prototype's site-engine v1–v6, trimmed to what the final
 * design uses. Effects are attached to elements by data attributes, so markup stays declarative:
 *
 *   data-reveal   rise + fade on scroll          data-slam   fast punch-in on scroll
 *   data-draw     SVG stroke draws on scroll     data-speed  scrubbed vertical parallax
 *   data-par      painting parallax              data-kb     slow Ken Burns pan/zoom
 *   data-pl-speed dune layer parallax            data-brush  brush-edged wipe reveal
 *   data-paper    grain overlay                  data-uline  underline on hover
 *   data-media    project image hover (zoom + "Open" label)
 *   data-fit      font-size fitted to the element's width (hero name)
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Registered at import, so components can create ScrollTriggers in their own effects,
// which React runs before their parents' effects (where the engine starts).
if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export type TextAnim ={ animation: string; by: 'character' | 'word' | 'text'; duration: number; delay: number };

type Engine = {
  root: HTMLElement | null;
  inited: boolean;
  loaded: boolean;
  reduce: boolean;
  lenis: Lenis | null;
  boilMs: number;
  textAnim: TextAnim;
  skipPreload: boolean;
  brushQ: (() => void)[];
  onLoaded: (() => void)[];
};

export const E: Engine = {
  root: null,
  inited: false,
  loaded: false,
  reduce: false,
  lenis: null,
  boilMs: 180,
  textAnim: { animation: 'blurInUp', by: 'character', duration: 2, delay: 0.1 },
  skipPreload: false,
  brushQ: [],
  onLoaded: []
};

const svgUrl = (s: string) => 'url("data:image/svg+xml;utf8,' + encodeURIComponent(s) + '")';
const BRUSH = svgUrl("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 100' preserveAspectRatio='none'><filter id='f' x='-20%' y='-20%' width='140%' height='140%'><feTurbulence type='fractalNoise' baseFrequency='0.035 0.4' numOctaves='3' seed='7'/><feDisplacementMap in='SourceGraphic' scale='38' xChannelSelector='R' yChannelSelector='G'/></filter><rect x='-30' y='-30' width='225' height='160' fill='white' filter='url(#f)'/></svg>");
const GRAIN = svgUrl("<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .3 0 0 0 0 .25 0 0 0 0 .18 0 0 0 .7 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>");

const isRtl = (el: Element) => getComputedStyle(el).direction === 'rtl';

export function initEngine(root: HTMLElement, opts: { skipPreload: boolean; textAnim: TextAnim; boilMs: number }) {
  E.root = root;
  E.skipPreload = opts.skipPreload;
  E.textAnim = opts.textAnim;
  E.boilMs = opts.boilMs;
  if (E.inited) { scan(); return; }
  setupCore();
  scan();
  startBoil();
  idle(makePaper);
  // Fit the name only after fonts land (capped at 1.5s), then start the loader.
  const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1500))]);
  fontsReady.then(() => { fit(); preload(); ScrollTrigger.refresh(); });
}

/** Smooth scroll + scroll effects only, no loader. Used by the /lab sandboxes. */
export function initBasic(root: HTMLElement) {
  E.root = root;
  if (!E.inited) setupCore();
  E.loaded = true;
  scan();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

function setupCore() {
  E.inited = true;
  E.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });
  if (!E.reduce) {
    const lenis = (E.lenis = new Lenis({ lerp: 0.085 }));
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  let rz: ReturnType<typeof setTimeout>;
  addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => { fit(); ScrollTrigger.refresh(); }, 150);
  });
  const refit = () => { fit(); ScrollTrigger.refresh(); };
  document.fonts?.addEventListener('loadingdone', refit);
}

const idle = (fn: () => void) =>
  'requestIdleCallback' in window ? (window as Window).requestIdleCallback(fn) : setTimeout(fn, 600);

export function scrollTo(target: string | Element) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (E.lenis) E.lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: 'smooth' });
}

export function lockScroll(on: boolean) {
  if (E.lenis) on ? E.lenis.stop() : E.lenis.start();
  else document.documentElement.style.overflow = on ? 'hidden' : '';
}

/** Scales the hero name so it fills the full width of its line. */
export function fit() {
  if (!E.root) return;
  E.root.querySelectorAll<HTMLElement>('[data-fit]').forEach((el) => {
    const kid = ([...el.children] as HTMLElement[]).find((k) => k.offsetWidth > 0);
    if (!kid) return;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    const w = el.clientWidth;
    if (w > 0) el.style.fontSize = (fs * w) / kid.offsetWidth * 0.995 + 'px';
  });
}

/** Attaches every data-attribute effect to elements that don't have it yet. Safe to call repeatedly. */
export function scan() {
  const root = E.root;
  if (!root) return;
  fit();
  const reduce = E.reduce;
  const q = <T extends Element = HTMLElement>(s: string) => root.querySelectorAll<T & HTMLElement>(s);
  const once = (el: HTMLElement, k: string) => { if (el.dataset[k]) return false; el.dataset[k] = '1'; return true; };

  q('[data-reveal]').forEach((el) => {
    if (!once(el, 'rv') || reduce) return;
    gsap.fromTo(el, { y: 56, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, ease: 'expo.out', delay: +(el.dataset.delay || 0), scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });
  q<SVGPathElement>('[data-draw]').forEach((p) => {
    if (!once(p, 'rv') || reduce) return;
    const L = p.getTotalLength();
    p.style.strokeDasharray = String(L);
    p.style.strokeDashoffset = String(L);
    gsap.to(p, { strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut', delay: +(p.dataset.delay || 0), scrollTrigger: { trigger: p.ownerSVGElement || p, start: 'top 95%', once: true } });
  });
  q('[data-speed]').forEach((el) => {
    if (!once(el, 'rv') || reduce) return;
    gsap.to(el, { yPercent: -(+(el.dataset.speed || 0)) * 12, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  q('[data-uline]').forEach((el) => {
    if (!once(el, 'ul')) return;
    const l = el.querySelector('[data-line]');
    if (!l) return;
    el.addEventListener('pointerenter', () => { const r = isRtl(el); gsap.fromTo(l, { scaleX: 0, transformOrigin: r ? 'right' : 'left' }, { scaleX: 1, duration: 0.6, ease: 'expo.out' }); });
    el.addEventListener('pointerleave', () => { const r = isRtl(el); gsap.to(l, { scaleX: 0, transformOrigin: r ? 'left' : 'right', duration: 0.45, ease: 'expo.out' }); });
  });
  q('[data-media]').forEach((el) => {
    if (!once(el, 'md') || reduce) return;
    const fr = el.querySelector('[data-tilt]'), lab = el.querySelector('[data-open-label]');
    if (lab) gsap.set(lab, { yPercent: 140, opacity: 0 });
    el.addEventListener('pointerenter', () => { fr && gsap.to(fr, { scale: 1.04, duration: 0.9, ease: 'expo.out' }); lab && gsap.to(lab, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }); });
    el.addEventListener('pointerleave', () => { fr && gsap.to(fr, { scale: 1, duration: 0.9, ease: 'expo.out' }); lab && gsap.to(lab, { yPercent: 140, opacity: 0, duration: 0.45, ease: 'power2.in' }); });
  });
  q('[data-tilt]').forEach((el) => {
    if (!once(el, 'tl') || reduce) return;
    const host = el.parentElement!;
    gsap.set(el, { transformPerspective: 1400 });
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.9, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.9, ease: 'power3' });
    host.addEventListener('pointermove', (e) => {
      const r = host.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 12);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 9);
    });
    host.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
  q('[data-brush]').forEach((el) => {
    if (!once(el, 'bs') || reduce) return;
    const st = el.style;
    st.webkitMaskImage = st.maskImage = BRUSH;
    st.webkitMaskSize = st.maskSize = '300% 100%';
    st.webkitMaskRepeat = st.maskRepeat = 'no-repeat';
    const o = { p: 100 };
    const ap = () => { st.webkitMaskPosition = st.maskPosition = o.p + '% 0'; };
    ap();
    const run = () => gsap.to(o, { p: 0, duration: 1.7, ease: 'power2.inOut', delay: +(el.dataset.delay || 0), onUpdate: ap, onComplete: () => { st.webkitMaskImage = st.maskImage = 'none'; } });
    if (el.closest('#top') && !E.loaded) E.brushQ.push(run);
    else ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: run });
  });
  q('[data-paper]').forEach((el) => {
    if (!once(el, 'pp')) return;
    el.style.backgroundImage = GRAIN;
    el.style.backgroundSize = '220px';
  });
  q('[data-kb]').forEach((el) => {
    if (!once(el, 'kbd') || reduce) return;
    gsap.fromTo(el, { scale: 1.06, xPercent: -1.5 }, { scale: 1.15, xPercent: 1.5, duration: 24 + Math.random() * 8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });
  q('[data-par]').forEach((el) => {
    if (!once(el, 'pard') || reduce) return;
    gsap.fromTo(el, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  q('[data-slam]').forEach((el) => {
    if (!once(el, 'slm') || reduce) return;
    gsap.fromTo(el, { y: 90, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
  q('[data-blur]').forEach((el) => {
    if (!once(el, 'blr') || reduce) return;
    gsap.fromTo(el, { filter: 'blur(12px)', opacity: 0.15, y: 24 }, {
      filter: 'blur(0px)', opacity: 1, y: 0, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 62%', scrub: 0.6 },
      onComplete: () => { el.style.filter = ''; }
    });
  });
  q('[data-pl-speed]').forEach((el) => {
    if (!once(el, 'plsd') || reduce) return;
    const s = parseFloat(el.dataset.plSpeed || '0');
    if (!s) return;
    el.style.willChange = 'transform';
    const band = el.closest('[data-sky]') || el.parentElement;
    gsap.fromTo(el, { y: -90 * s }, { y: 70 * s, ease: 'none', scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/** Paper fibre texture generated once in the browser, exposed as --paperimg (used by About). */
function makePaper() {
  try {
    const N = 640, c = document.createElement('canvas');
    c.width = c.height = N;
    const x = c.getContext('2d')!;
    x.fillStyle = '#808080';
    x.fillRect(0, 0, N, N);
    const oct = (cell: number, a: number) => {
      const g = document.createElement('canvas'), n = Math.ceil(N / cell);
      g.width = g.height = n;
      const gx = g.getContext('2d')!, d = gx.createImageData(n, n);
      for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (Math.random() - 0.5) * 255 * a; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
      gx.putImageData(d, 0, 0);
      x.globalAlpha = 0.5;
      x.imageSmoothingEnabled = true;
      x.drawImage(g, 0, 0, N, N);
    };
    oct(80, 0.5); oct(24, 0.45); oct(6, 0.4);
    x.globalAlpha = 1;
    const d = x.getImageData(0, 0, N, N);
    for (let i = 0; i < d.data.length; i += 4) { const v = (Math.random() - 0.5) * 38; d.data[i] += v; d.data[i + 1] += v; d.data[i + 2] += v; }
    x.putImageData(d, 0, 0);
    for (let k = 0; k < 1400; k++) {
      const px = Math.random() * N, py = Math.random() * N, a = Math.random() * Math.PI, L = 6 + Math.random() * 34;
      x.strokeStyle = Math.random() < 0.55 ? 'rgba(255,255,255,' + (0.05 + Math.random() * 0.14) + ')' : 'rgba(0,0,0,' + (0.04 + Math.random() * 0.1) + ')';
      x.lineWidth = 0.4 + Math.random() * 0.9;
      x.beginPath();
      x.moveTo(px, py);
      x.quadraticCurveTo(px + Math.cos(a) * L * 0.5 + (Math.random() - 0.5) * 8, py + Math.sin(a) * L * 0.5 + (Math.random() - 0.5) * 8, px + Math.cos(a) * L, py + Math.sin(a) * L);
      x.stroke();
    }
    for (let k = 0; k < 90; k++) { x.fillStyle = 'rgba(70,50,20,' + (0.04 + Math.random() * 0.08) + ')'; x.beginPath(); x.arc(Math.random() * N, Math.random() * N, 0.6 + Math.random() * 2.2, 0, 7); x.fill(); }
    c.toBlob((b) => { if (b) document.documentElement.style.setProperty('--paperimg', 'url(' + URL.createObjectURL(b) + ')'); }, 'image/png');
  } catch {}
}

/** Stop-motion jitter on the hero / loader letters and the two stamps. */
function startBoil() {
  if (E.reduce) return;
  const jig = () => {
    if (!document.hidden) {
      document.querySelectorAll('[data-boil],[data-pl-ch]').forEach((el) => gsap.set(el, { x: (Math.random() - 0.5) * 1.1, rotation: (Math.random() - 0.5) * 1.3 }));
      document.querySelectorAll('[data-hero-aux],[data-pl-aux]').forEach((el) => gsap.set(el, { rotation: (Math.random() - 0.5) * 1.6 }));
    }
    setTimeout(jig, Math.max(60, E.boilMs));
  };
  jig();
}

/** The green stamp spreads in like ink soaking into paper. */
function bleedIn() {
  const root = E.root;
  if (!root || E.reduce) return;
  const pl = root.querySelector('[data-preloader]');
  const live = !!pl && getComputedStyle(pl).display !== 'none';
  const el = (live ? pl!.querySelector('[data-pl-aux]') : root.querySelector('[data-hero-aux]')) as HTMLElement | null;
  const blur = document.getElementById('bleedBlur'), disp = document.getElementById('bleedDisp');
  if (!el || !blur || !disp) return;
  const prev = el.style.filter;
  el.style.filter = 'url(#bleed)';
  const d = live ? 0.45 : 0;
  gsap.fromTo(blur, { attr: { stdDeviation: 9 } }, { attr: { stdDeviation: 0 }, duration: 1.2, delay: d, ease: 'power2.out' });
  gsap.fromTo(disp, { attr: { scale: 16 } }, { attr: { scale: 0 }, duration: 1.4, delay: d, ease: 'power2.out', onComplete: () => { el.style.filter = prev; } });
}

const TEXT_FROM: Record<string, gsap.TweenVars> = {
  fadeIn: { opacity: 0, y: 20 },
  blurIn: { opacity: 0, filter: 'blur(10px)' },
  blurInUp: { opacity: 0, filter: 'blur(10px)', y: 20 },
  blurInDown: { opacity: 0, filter: 'blur(10px)', y: -20 },
  slideUp: { opacity: 0, y: 20 },
  slideDown: { opacity: 0, y: -20 },
  slideLeft: { opacity: 0, x: 20 },
  slideRight: { opacity: 0, x: -20 },
  scaleUp: { opacity: 0, scale: 0.5 },
  scaleDown: { opacity: 0, scale: 1.5 }
};

function markLoaded() {
  E.loaded = true;
  E.brushQ.splice(0).forEach((f, i) => setTimeout(f, 150 + i * 110));
  E.onLoaded.splice(0).forEach((f) => f());
  ScrollTrigger.refresh();
}

/**
 * Loader: the name animates in letter by letter (Magic UI "Text Animate" style), the counter runs,
 * then the name and stamp glide into their hero positions while the paper sheet tears away upward.
 */
function preload() {
  const root = E.root!;
  const el = root.querySelector<HTMLElement>('[data-preloader]');
  const vis = (sel: string, scope: ParentNode = root) => [...scope.querySelectorAll<HTMLElement>(sel)].find((x) => x.getClientRects().length > 0);
  const heroName = vis('[data-hero-name]'), heroAux = root.querySelector<HTMLElement>('[data-hero-aux]');
  const reveal = () => [heroName, heroAux].forEach((h) => h && (h.style.opacity = '1'));
  if (!el || E.reduce || E.skipPreload) {
    if (el) el.style.display = 'none';
    reveal();
    markLoaded();
    bleedIn();
    return;
  }
  [heroName, heroAux].forEach((h) => h && (h.style.opacity = '0'));
  lockScroll(true);
  const name = vis('[data-pl-name]', el), aux = el.querySelector<HTMLElement>('[data-pl-aux]');
  const paper = el.querySelector('[data-pl-paper]'), cnt = el.querySelector('[data-count]'), bar = el.querySelector<HTMLElement>('[data-pl-bar]');
  const h1 = heroName?.closest('h1');
  if (name && h1) name.style.fontSize = getComputedStyle(h1).fontSize;

  const T = E.textAnim, from = TEXT_FROM[T.animation] || TEXT_FROM.blurInUp, blur = 'filter' in from;
  const chars = name ? [...name.querySelectorAll<HTMLElement>('[data-pl-ch]')] : [];
  let groups: HTMLElement[][];
  if (!chars.length && name) groups = [[name]];
  else if (T.by === 'text') groups = [chars];
  else if (T.by === 'word') {
    groups = [[]];
    chars.forEach((c, i) => { if (i && c.dataset.word !== chars[i - 1].dataset.word) groups.push([]); groups[groups.length - 1].push(c); });
  } else groups = chars.map((c) => [c]);
  const to: gsap.TweenVars = { opacity: 1, y: 0, x: 0, scale: 1, duration: 0.3, ease: /scale/.test(T.animation) ? 'back.out(2.2)' : 'power1.out' };
  if (blur) { to.filter = 'blur(0px)'; to.duration = 0.4; }
  const stag = T.duration / Math.max(1, groups.length);
  const end = T.delay + stag * (groups.length - 1) + (to.duration as number);

  const tl = gsap.timeline(), o = { v: 0 };
  groups.forEach((g, i) => tl.fromTo(g, { ...from }, { ...to }, T.delay + i * stag));
  if (aux) {
    gsap.set(aux, { opacity: 0, y: 14 });
    tl.to(aux, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, Math.min(0.55, end * 0.3));
  }
  const fly = (a?: HTMLElement | null, b?: HTMLElement | null) => {
    if (!a || !b) return;
    const r1 = a.getBoundingClientRect(), r2 = b.getBoundingClientRect();
    gsap.to(a, { x: r2.left - r1.left, y: r2.top - r1.top, scale: r1.width ? r2.width / r1.width : 1, duration: 0.8, ease: 'expo.inOut' });
  };
  tl.to(o, { v: 100, duration: end + 0.1, ease: 'power2.inOut', onUpdate: () => {
      if (cnt) cnt.textContent = String(Math.round(o.v)).padStart(3, '0');
      if (bar) bar.style.transform = 'scaleX(' + o.v / 100 + ')';
    } }, 0)
    .add(() => groups.forEach((g) => gsap.set(g, { clearProps: 'filter' })), end + 0.02)
    .to(el.querySelectorAll('[data-pl-fade]'), { opacity: 0, duration: 0.25, ease: 'power2.in' }, end + 0.02)
    .add(() => { fly(name, heroName); fly(aux, heroAux); }, end + 0.08)
    .to(paper, { y: () => -(innerHeight + 80), rotation: -1.2, transformOrigin: '0% 100%', duration: 0.75, ease: 'power3.inOut' }, end + 0.08)
    .add(markLoaded, end + 0.45)
    .add(() => { reveal(); el.style.display = 'none'; lockScroll(false); }, end + 0.9);
  bleedIn();
}

/** Peels the image's corner, then calls done (used before opening a case study from a chapter card). */
export function peel(el: HTMLElement, done: () => void) {
  if (E.reduce) return done();
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  const r = el.getBoundingClientRect(), s = Math.min(r.width, r.height) * 0.46;
  const box = document.createElement('span');
  box.style.cssText = 'position:absolute;right:0;bottom:0;width:0;height:0;z-index:8;pointer-events:none;filter:drop-shadow(-6px -6px 10px rgba(0,0,0,.45))';
  box.innerHTML = '<span style="position:absolute;inset:0;background:#0C0D0B;clip-path:polygon(100% 0,100% 100%,0 100%)"></span><span style="position:absolute;inset:0;background:linear-gradient(135deg,#F4EEE0 0%,#DCD2BD 65%,#B6AB92 100%);clip-path:polygon(100% 0,0 100%,0 0)"></span>';
  el.appendChild(box);
  gsap.to(box, { width: s, height: s, duration: 0.34, ease: 'power2.in', onComplete: () => { done(); setTimeout(() => box.remove(), 700); } });
}

type Box = { left: number; top: number; width: number; height: number };
const box = (r: DOMRect): Box => ({ left: r.left, top: r.top, width: r.width, height: r.height });

/** Case study opens by growing the clicked image into its hero frame. */
export function flipOpen(ov: HTMLElement, from: DOMRect | null) {
  lockScroll(true);
  const bg = ov.querySelector('[data-cs-bg]'), wrap = ov.querySelector('[data-flip]'), inner = ov.querySelector('[data-flip-inner]'), ins = ov.querySelectorAll('[data-cs-in]');
  if (E.reduce || !from || !wrap || !inner) return;
  const to = wrap.getBoundingClientRect();
  gsap.set(inner, { position: 'fixed', zIndex: 3, ...box(from) });
  if (ins.length) gsap.set(ins, { opacity: 0, y: 60 });
  if (bg) gsap.fromTo(bg, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' });
  gsap.to(inner, { ...box(to), duration: 1.15, ease: 'expo.inOut', onComplete: () => { gsap.set(inner, { clearProps: 'position,zIndex,left,top,width,height' }); } });
  if (ins.length) gsap.to(ins, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06, delay: 0.75, clearProps: 'transform' });
}

export function flipClose(ov: HTMLElement, src: HTMLElement | null, cb: () => void) {
  const fin = () => { lockScroll(false); cb(); };
  const bg = ov.querySelector('[data-cs-bg]'), inner = ov.querySelector('[data-flip-inner]'), ins = ov.querySelectorAll('[data-cs-in]');
  if (E.reduce || !src || !inner) { fin(); return; }
  ov.style.scrollBehavior = 'auto';
  ov.scrollTop = 0;
  requestAnimationFrame(() => {
    const from = inner.getBoundingClientRect(), to = src.getBoundingClientRect();
    if (ins.length) gsap.to(ins, { opacity: 0, y: 30, duration: 0.35, ease: 'power2.in' });
    gsap.set(inner, { position: 'fixed', zIndex: 3, ...box(from) });
    gsap.to(inner, { ...box(to), duration: 1, ease: 'expo.inOut', onComplete: fin });
    if (bg) gsap.to(bg, { opacity: 0, duration: 0.6, delay: 0.3, ease: 'power2.inOut' });
  });
}

export function csStagger(el: HTMLElement) {
  if (E.reduce) return;
  gsap.fromTo(el.querySelectorAll('[data-cs-in]'), { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: 0.06, clearProps: 'transform' });
}

/** Theme / language switch: the new page is revealed in a circle growing from the button. */
export function circleTransition(x: number, y: number, apply: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  if (!doc.startViewTransition || E.reduce) { apply(); return; }
  const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const vt = doc.startViewTransition(apply);
  vt.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] },
      { duration: 950, easing: 'cubic-bezier(.76,0,.24,1)', pseudoElement: '::view-transition-new(root)' }
    );
  }).catch(() => {});
}

export { gsap, ScrollTrigger };
