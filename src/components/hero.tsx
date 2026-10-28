'use client';
import { useEffect, useRef } from 'react';
import { CONTACT } from '@/content/site';
import { PROJECTS } from '@/content/projects';
import { gsap, scrollTo } from '@/lib/engine';
import { Clock, HoldCopy, L, Slot } from './ui';

const NAME_EN = 'SALMAN BINMANDEEL';
const NAME_AR = 'سلمان بن منديل';

function Stamp(props: React.HTMLAttributes<HTMLSpanElement> & Record<string, unknown>) {
  return (
    <span className="stamp" {...props}>
      <L en="Product Designer · Riyadh" ar="مصمم منتجات · الرياض" />
    </span>
  );
}

export function Preloader() {
  let word = 0;
  return (
    <div data-preloader="" className="pl">
      <div data-pl-paper="" className="pl-paper">
        <svg viewBox="0 0 1200 44" preserveAspectRatio="none" aria-hidden="true" className="pl-tear">
          <path d={TEAR_A} style={{ fill: 'color-mix(in oklab,var(--bg) 82%,#fff)' }} />
          <path d={TEAR_B} style={{ fill: 'var(--bg)' }} />
        </svg>
      </div>
      <div data-pl-ui="" className="pl-ui">
        <div data-pl-fade="" className="pl-top mono">
          <span><L en="Selected work 2023–26" ar="أعمال مختارة 2023–26" /></span>
          <span data-count="" dir="ltr" className="pl-count num">000</span>
        </div>
        <div className="pl-mid">
          <div data-pl-name="" lang="en" dir="ltr" aria-hidden="true" className="pl-name">
            {NAME_EN.split('').map((ch, i) => {
              if (ch === ' ') { word++; return <span key={i} className="pl-space" />; }
              return <span key={i} data-pl-ch="" data-word={word} className="ib">{ch}</span>;
            })}
          </div>
          <div data-pl-name="" lang="ar" aria-hidden="true" className="pl-name pl-name-ar">
            <span data-pl-ch="" className="ib">{NAME_AR}</span>
          </div>
          <Stamp data-pl-aux="" />
        </div>
        <div data-pl-fade="" className="pl-bottom">
          <span className="pl-wet"><L en="Wetting the brush…" ar="نبلّل الفرشاة…" /></span>
          <span className="pl-track"><span data-pl-bar="" className="pl-bar" /></span>
        </div>
      </div>
    </div>
  );
}

const NAV = [
  { t: '#work', en: 'Work', ar: 'أعمالي' },
  { t: '#about', en: 'About', ar: 'عنّي' },
  { t: '#skills', en: 'Capabilities', ar: 'المهارات', wide: true },
  { t: '#contact', en: 'Contact', ar: 'تواصل' }
];

type Toggle = (e: React.MouseEvent<HTMLButtonElement>) => void;

export function Nav({ toggleLang, toggleTheme }: { toggleLang: Toggle; toggleTheme: Toggle }) {
  return (
    <nav aria-label="Primary" className="nav">
      <button type="button" className="nav-home" aria-label="Back to top" onClick={() => scrollTo('#top')}>س</button>
      {NAV.map((n) => (
        <button key={n.t} type="button" className={'nav-link' + (n.wide ? ' nav-wide' : '')} onClick={() => scrollTo(n.t)}>
          <L en={n.en} ar={n.ar} />
        </button>
      ))}
      <span aria-hidden="true" className="nav-sep" />
      <button type="button" className="nav-icon" aria-label="Switch language" onClick={toggleLang}>
        <span lang="en" className="nav-ar-glyph">ع</span>
        <span lang="ar" className="nav-en-glyph">EN</span>
      </button>
      <button type="button" className="nav-icon" aria-label="Toggle dark mode" onClick={toggleTheme}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M8 1.8a6.2 6.2 0 0 1 0 12.4z" fill="currentColor" />
        </svg>
      </button>
    </nav>
  );
}

function ConnectCard() {
  return (
    <div id="connect-card" role="dialog" aria-label="Contact" className="connect-card">
      <span className="mono connect-kicker"><L en="Get in touch" ar="تواصل معي" /></span>
      <HoldCopy email={CONTACT.email} className="hold-card" />
      <div className="connect-links">
        {CONTACT.links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener">
            <span>{l.label}</span>
            <span className="connect-arrow">↗</span>
          </a>
        ))}
      </div>
      <span className="connect-note"><L en="Riyadh · replies within a day" ar="الرياض · أرد خلال يوم" /></span>
    </div>
  );
}

// Floating collage of the four project frames (position, width, tilt, stacking, aspect).
const FLOAT = [
  { x: '4%', y: '6%', w: '54%', r: '-3deg', z: 2, ar: '16/10' },
  { x: '50%', y: '0%', w: '40%', r: '4deg', z: 1, ar: '4/5' },
  { x: '30%', y: '46%', w: '46%', r: '2deg', z: 3, ar: '16/10' },
  { x: '0%', y: '58%', w: '30%', r: '-5deg', z: 4, ar: '9/16' }
];

function FloatStage({ open }: { open: (i: number, el: HTMLElement) => void }) {
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const st = stage.current!;
    const els = [...st.querySelectorAll<HTMLElement>('[data-float]')];
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Each frame drifts on its own 9–14s loop; the pointer nudges them at different depths.
    const anims = els.map((el, i) => {
      const dy = 10 + (i % 3) * 5, dx = 4 + (i % 2) * 4, dr = 0.8 + (i % 2) * 0.6, dir = i % 2 ? -1 : 1;
      return el.animate(
        [
          { translate: '0px 0px', rotate: '0deg' },
          { translate: dx * dir + 'px ' + -dy + 'px', rotate: dr * dir + 'deg', offset: 0.33 },
          { translate: -dx * dir * 0.6 + 'px ' + -dy * 0.4 + 'px', rotate: -dr * dir * 0.5 + 'deg', offset: 0.66 },
          { translate: '0px 0px', rotate: '0deg' }
        ],
        { duration: 9000 + i * 1700, delay: -i * 2300, iterations: Infinity, easing: 'ease-in-out' }
      );
    });
    const move = (ev: PointerEvent) => {
      const r = st.getBoundingClientRect(), nx = (ev.clientX - r.left) / r.width - 0.5, ny = (ev.clientY - r.top) / r.height - 0.5;
      els.forEach((el, i) => { const d = 6 + i * 4; gsap.to(el, { x: -nx * d, y: -ny * d, duration: 1.2, ease: 'power3.out', overwrite: 'auto' }); });
    };
    st.addEventListener('pointermove', move);
    return () => { anims.forEach((a) => a.cancel()); st.removeEventListener('pointermove', move); };
  }, []);
  return (
    <div ref={stage} className="float-stage">
      {PROJECTS.map((p, i) => {
        const f = FLOAT[i % 4];
        return (
          <div key={p.key} data-float="" className="float" style={{ left: f.x, top: f.y, width: f.w, zIndex: f.z }}>
            <button
              type="button"
              data-media={'h' + i}
              data-brush=""
              data-delay={String(i * 0.08)}
              aria-label={'Open ' + p.en.title}
              className="float-frame"
              style={{ rotate: f.r, aspectRatio: f.ar, background: p.bg }}
              onClick={(e) => open(i, e.currentTarget)}
            >
              <span className="fill"><Slot id={p.slot} ph={p.ph} /></span>
              <span data-paper="" className="fill paper-35" />
              <span className="fill float-gloss" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function Hero({ connect, setConnect, open }: { connect: boolean; setConnect: (v: boolean) => void; open: (i: number, el: HTMLElement) => void }) {
  return (
    <header id="top" data-screen-label="Hero" className="hero">
      <h1 data-fit="" aria-label="Salman Binmandeel" className="hero-name">
        <span lang="en" data-hero-name="" className="ib upper">
          {'Salman Binmandeel'.split('').map((ch, i) =>
            ch === ' ' ? <span key={i} className="ib pre"> </span> : <span key={i} data-boil="" className="ib">{ch}</span>
          )}
        </span>
        <span lang="ar" data-hero-name="" className="ib hero-name-ar">{NAME_AR}</span>
      </h1>

      <div className="hero-meta">
        <Stamp data-hero-aux="" />
        <span className="hero-links">
          {NAV.map((n) => (
            <button key={n.t} type="button" data-uline="" className="uline" onClick={() => scrollTo(n.t)}>
              <L en={n.en} ar={n.ar} />
              <span data-line="" className="uline-line" />
            </button>
          ))}
        </span>
        <span className="connect">
          <button
            type="button"
            aria-expanded={connect}
            aria-controls="connect-card"
            className="btn-stamp btn-connect"
            style={{ rotate: connect ? '0deg' : '-1.5deg' }}
            onClick={() => setConnect(!connect)}
          >
            <L en={connect ? 'Close ×' : 'Connect'} ar={connect ? 'إغلاق ×' : 'تواصل'} />
          </button>
          {connect && <ConnectCard />}
        </span>
      </div>

      <div className="hero-body">
        <div className="hero-copy">
          <p data-reveal="" className="hero-lede">
            <span lang="en" className="hero-lede-en">
              I design the stuff people dread at work: payroll day, subscription renewals, a dispatch call that can’t wait. My job is making those <em className="serif-i">boring</em> again.
            </span>
            <span lang="ar">أصمّم الأشياء التي يتجنّبها الناس في العمل: يوم الرواتب، تجديد الاشتراكات، ومكالمة توزيع لا تحتمل الانتظار. مهمتي أن أجعلها مملّة من جديد.</span>
          </p>
          <div data-reveal="" data-delay=".12" className="hero-cta">
            <button type="button" className="btn-stamp btn-work" onClick={() => scrollTo('#work')}>
              <L en="See the work ↓" ar="شاهد الأعمال ↓" />
            </button>
          </div>
        </div>
        <div className="hero-art">
          <FloatStage open={open} />
        </div>
      </div>

      <div className="hero-foot mono">
        <span className="col4">
          <span><L en="Local time" ar="التوقيت المحلي" /></span>
          <span dir="ltr"><Clock /> (GMT+3)</span>
        </span>
        <span><L en="● Taking on new problems" ar="● متاح لمشاكل جديدة" /></span>
      </div>
    </header>
  );
}

// Torn bottom edge of the loader's paper sheet (fibre layer + paper layer).
const TEAR_A = 'M0 0 H1200 V23.4 L1200 23.4 L1187 22.8 L1168 11.2 L1161 11.9 L1150 7.7 L1128 18.2 L1112 13.6 L1096 8.7 L1082 9.4 L1060 11.1 L1053 14.7 L1035 15.3 L1013 11.4 L996 13.1 L975 6.2 L968 10.5 L961 21.9 L945 37.8 L929 26.1 L909 7.7 L896 11.2 L886 10.5 L871 6.6 L853 22.7 L839 17.5 L822 15.8 L813 26.8 L795 16.9 L787 10.4 L766 19.9 L744 12.9 L735 22.0 L724 19.7 L712 25.5 L700 14.8 L680 11.5 L667 27.0 L645 25.4 L638 21.1 L630 8.4 L624 21.7 L607 29.2 L597 11.9 L580 27.3 L571 6.5 L551 26.1 L545 8.6 L524 11.2 L504 21.1 L490 11.1 L474 11.5 L468 22.7 L448 25.6 L428 9.0 L412 9.2 L396 27.9 L389 14.9 L381 8.4 L361 14.6 L350 18.9 L340 14.7 L319 17.1 L305 20.0 L285 25.9 L275 17.7 L264 14.0 L253 9.6 L239 20.6 L228 7.2 L207 15.3 L193 12.0 L186 22.0 L171 12.5 L158 9.4 L147 13.4 L135 26.1 L120 21.1 L99 30.9 L78 21.0 L71 21.6 L59 24.0 L43 17.9 L25 13.2 L11 10.6 L0 6.0 Z';
const TEAR_B = 'M0 0 H1200 V20.4 L1200 18.0 L1187 17.8 L1168 6.5 L1161 7.9 L1150 3.5 L1128 13.7 L1112 9.1 L1096 4.0 L1082 4.2 L1060 6.1 L1053 9.8 L1035 10.1 L1013 5.7 L996 7.6 L975 0.2 L968 6.2 L961 17.4 L945 31.9 L929 20.2 L909 3.6 L896 8.0 L886 6.5 L871 1.0 L853 17.6 L839 12.3 L822 9.9 L813 21.4 L795 13.3 L787 6.7 L766 14.5 L744 9.6 L735 16.3 L724 14.3 L712 20.6 L700 9.7 L680 6.9 L667 22.7 L645 19.8 L638 16.4 L630 2.8 L624 17.9 L607 24.1 L597 7.6 L580 23.1 L571 2.9 L551 21.3 L545 4.9 L524 5.5 L504 15.6 L490 7.1 L474 6.5 L468 17.1 L448 22.3 L428 5.1 L412 3.4 L396 24.9 L389 11.5 L381 4.2 L361 11.5 L350 13.8 L340 9.0 L319 13.6 L305 16.4 L285 20.1 L275 12.6 L264 10.5 L253 6.2 L239 15.7 L228 4.2 L207 9.9 L193 7.2 L186 16.7 L171 9.1 L158 5.4 L147 8.3 L135 20.2 L120 16.5 L99 26.1 L78 15.7 L71 16.5 L59 18.8 L43 13.1 L25 9.9 L11 7.5 L0 1.2 Z';

