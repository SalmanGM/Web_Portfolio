'use client';
import { useEffect, useRef, useState } from 'react';
import { IMAGES } from '@/content/images';
import { E, gsap } from '@/lib/engine';
import { DUNE_BACK, DUNE_FRONT } from '@/lib/dunes';

/** Both languages are always in the DOM; CSS hides the inactive one, so switching never re-renders. */
export function L({ en, ar }: { en: React.ReactNode; ar: React.ReactNode }) {
  return (
    <>
      <span lang="en">{en}</span>
      <span lang="ar">{ar}</span>
    </>
  );
}

/** An image slot: shows the configured image, or a dashed placeholder with its caption until one is supplied. */
export function Slot({ id, ph, src, alt = '', style }: { id: string; ph?: string; src?: string | null; alt?: string; style?: React.CSSProperties }) {
  const url = src ?? IMAGES[id] ?? null;
  return (
    <span className="slot" data-slot={id} style={style}>
      {url ? (
        <img src={url} alt={alt} decoding="async" loading="lazy" />
      ) : (
        <span className="slot-empty">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="9" cy="10" r="1.8" />
            <path d="M21 16l-5.5-5.5L5 20" />
          </svg>
          <span className="slot-cap">{ph || 'Image coming soon'}</span>
        </span>
      )}
    </span>
  );
}

export function Dune({ back, front, label, className, style }: { back: string; front: string; label?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div data-sky="" data-screen-label={label} aria-hidden="true" className={className} style={style}>
      <svg data-pl-speed="0.6" viewBox="0 0 1600 400" preserveAspectRatio="none" className="dune-layer">
        <path d={DUNE_BACK} style={{ fill: back }} />
      </svg>
      <svg viewBox="0 0 1600 400" preserveAspectRatio="none" className="dune-layer dune-front">
        <path d={DUNE_FRONT} style={{ fill: front }} />
      </svg>
    </div>
  );
}

/** Hold-to-copy email button: idle → holding → copying → copied. Enter / Space copy straight away. */
export function HoldCopy({ email, className }: { email: string; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const spin = useRef<HTMLSpanElement>(null);
  const tw = useRef<gsap.core.Tween | null>(null);
  const [st, setSt] = useState<'idle' | 'hold' | 'busy' | 'done'>('idle');
  const stRef = useRef(st);
  stRef.current = st;

  const finish = () => {
    setSt('busy');
    const sp = spin.current && gsap.to(spin.current, { rotation: '+=720', duration: 1, ease: 'none', repeat: -1 });
    setTimeout(() => {
      try { navigator.clipboard?.writeText(email); } catch {}
      sp && sp.kill();
      setSt('done');
      if (ref.current) gsap.fromTo(ref.current, { scale: 0.95 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1,0.4)' });
      setTimeout(() => { setSt('idle'); gsap.to(fill.current, { scaleX: 0, duration: 0.5, ease: 'expo.out' }); }, 1800);
    }, 650);
  };
  const start = (e: React.PointerEvent) => {
    if (stRef.current !== 'idle' || e.button > 0) return;
    setSt('hold');
    tw.current = gsap.fromTo(fill.current, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power1.in', onComplete: finish });
  };
  const cancel = () => {
    if (stRef.current !== 'hold') return;
    tw.current?.kill();
    gsap.to(fill.current, { scaleX: 0, duration: 0.35, ease: 'expo.out' });
    setSt('idle');
  };

  return (
    <button
      ref={ref}
      type="button"
      className={'hold ' + (className || '')}
      aria-label="Hold to copy email"
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && stRef.current === 'idle') {
          e.preventDefault();
          gsap.set(fill.current, { scaleX: 1 });
          finish();
        }
      }}
    >
      <span ref={fill} className="hold-fill" />
      <span className="hold-st" hidden={st !== 'idle'}>
        <em className="serif">{email}</em>
        <span className="hold-hint"><L en="Hold to copy" ar="اضغط مطولاً للنسخ" /></span>
      </span>
      <span className="hold-st" hidden={st !== 'hold'}><L en="Keep holding…" ar="استمر بالضغط…" /></span>
      <span className="hold-st" hidden={st !== 'busy'}>
        <span ref={spin} className="hold-spin" />
        <L en="Copying" ar="جارٍ النسخ" />
      </span>
      <span className="hold-st" hidden={st !== 'done'}><L en="Copied to clipboard ✓" ar="تم النسخ ✓" /></span>
    </button>
  );
}

/** Riyadh local time, ticking every second. */
export function Clock() {
  const [t, setT] = useState('--:--:--');
  useEffect(() => {
    const tick = () => {
      try { setT(new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Riyadh', hour12: false })); }
      catch { setT(new Date().toTimeString().slice(0, 8)); }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{t}</span>;
}

/** Faint drifting starfield with flowing lines, behind the whole site in both themes. */
export function Stars() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext('2d')!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const stars = Array.from({ length: 240 }, () => ({ x: Math.random(), y: Math.random(), r: 0.35 + Math.pow(Math.random(), 3) * 1.4, ph: Math.random() * 6.28, sp: 0.4 + Math.random() * 1.6, d: 0.2 + Math.random() * 0.8 }));
    const size = () => { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    addEventListener('resize', size);
    let t = Math.random() * 40, last = performance.now(), raf = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (document.hidden) return;
      t += reduce ? 0 : dt;
      const dark = document.documentElement.dataset.theme === 'dark';
      const col = dark ? '236,230,214' : '26,44,70';
      const base = dark ? 0.55 : 0.28;
      ctx.clearRect(0, 0, W, H);
      const sc = scrollY;
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        for (let x = -20; x <= W + 20; x += 18) {
          const y = H * (0.22 + 0.28 * i) + Math.sin(x * 0.0024 + t * 0.07 + i * 2.1) * 70 + Math.sin(x * 0.0061 - t * 0.05 + i) * 22 - ((sc * 0.03 * (i + 1)) % H);
          x < 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(' + col + ',' + (dark ? 0.07 : 0.05) + ')';
        ctx.stroke();
      }
      for (const s of stars) {
        let y = (s.y * H - sc * 0.05 * s.d) % H;
        if (y < 0) y += H;
        const a = base * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph)));
        ctx.fillStyle = 'rgba(' + col + ',' + a.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(s.x * W, y, s.r, 0, 6.283);
        ctx.fill();
        if (s.r > 1.35) {
          ctx.fillStyle = 'rgba(' + col + ',' + (a * 0.25).toFixed(3) + ')';
          ctx.fillRect(s.x * W - s.r * 3, y - 0.3, s.r * 6, 0.6);
          ctx.fillRect(s.x * W - 0.3, y - s.r * 3, 0.6, s.r * 6);
        }
      }
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); };
  }, []);
  return <canvas ref={ref} className="stars" aria-hidden="true" />;
}

type Ray = { left: number; rot: number; w: number; sw: number; delay: number; dur: number; k: number };

/** Magic UI "Light Rays", rebuilt on the Web Animations API. Fixed to the screen, above content, under the grain. */
export function LightRays({ on, count, speed, blur = 36 }: { on: boolean; count: number; speed: number; blur?: number }) {
  const [rays, setRays] = useState<Ray[]>([]);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cyc = Math.max(speed, 0.1);
    setRays(Array.from({ length: on ? count : 0 }, () => ({
      left: 8 + Math.random() * 84, rot: -28 + Math.random() * 56, w: 160 + Math.random() * 160, sw: 0.8 + Math.random() * 1.8,
      delay: Math.random() * cyc, dur: cyc * (0.75 + Math.random() * 0.5), k: 0.6 + Math.random() * 0.5
    })));
  }, [on, count, speed]);
  useEffect(() => {
    if (!host.current) return;
    const els = [...host.current.querySelectorAll<HTMLElement>('[data-ray]')];
    if (E.reduce || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el, i) => { el.style.opacity = String(rays[i].k * 0.6); });
      return;
    }
    const anims = els.map((el, i) => {
      const r = rays[i];
      return el.animate(
        [
          { opacity: 0, transform: `rotate(${r.rot - r.sw}deg)` },
          { opacity: r.k, transform: `rotate(${r.rot + r.sw}deg)`, offset: 0.5 },
          { opacity: 0, transform: `rotate(${r.rot - r.sw}deg)` }
        ],
        { duration: r.dur * 1100, delay: r.delay * 1000, iterations: Infinity, easing: 'ease-in-out' }
      );
    });
    return () => anims.forEach((a) => a.cancel());
  }, [rays]);
  if (!on) return null;
  return (
    <div ref={host} className="rays" aria-hidden="true">
      <div className="ray-glow" style={{ background: 'radial-gradient(circle at 20% 15%, color-mix(in srgb, var(--rays) 45%, transparent), transparent 70%)' }} />
      <div className="ray-glow" style={{ background: 'radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--rays) 35%, transparent), transparent 75%)' }} />
      {rays.map((r, i) => (
        <div
          key={i}
          data-ray=""
          className="ray"
          style={{ left: r.left + '%', width: r.w, marginLeft: -r.w / 2, filter: `blur(${blur}px)`, transform: `rotate(${r.rot}deg)` }}
        />
      ))}
    </div>
  );
}

/** SVG filters used by the stamps (print texture) and the loader's ink bleed. */
export function SvgFilters() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <filter id="stamp" x="-3%" y="-10%" width="106%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={4} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="1.1" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="bleed" x="-25%" y="-60%" width="150%" height="220%">
        <feGaussianBlur id="bleedBlur" in="SourceGraphic" stdDeviation="0" result="b" />
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves={2} seed={3} result="t" />
        <feDisplacementMap id="bleedDisp" in="b" in2="t" scale="0" xChannelSelector="R" yChannelSelector="G" result="d" />
        <feComponentTransfer in="d">
          <feFuncA type="linear" slope="5" intercept="-1.6" />
        </feComponentTransfer>
      </filter>
    </svg>
  );
}
