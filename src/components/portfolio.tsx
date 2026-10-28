'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { E, ScrollTrigger, circleTransition, fit, initEngine, peel, scan } from '@/lib/engine';
import { savePrefs, type Lang, type Theme } from '@/lib/prefs';
import { TweaksProvider, readTweakOverrides, useTweaks } from '@/lib/tweaks';
import { About } from './about';
import { CaseStudy } from './case-study';
import { Hero, Nav, Preloader } from './hero';
import { TweaksPanel } from './tweaks-panel';
import { LightRays, Stars, SvgFilters } from './ui';
import { Work } from './work';

const SEEN_KEY = 'sb-seen';

export function Portfolio() {
  return (
    <TweaksProvider>
      <Site />
      <TweaksPanel />
    </TweaksProvider>
  );
}

function Site() {
  const root = useRef<HTMLDivElement>(null);
  const { tweaks } = useTweaks();
  const [lang, setLang] = useState<Lang>('en');
  const [theme, setTheme] = useState<Theme>('light');
  const [connect, setConnect] = useState(false);
  const [cs, setCs] = useState(-1);
  const [busy, setBusy] = useState(false);
  const src = useRef<HTMLElement | null>(null);
  const from = useRef<DOMRect | null>(null);
  const closeRef = useRef<(() => void) | null>(null);

  // Pick up the theme / language the pre-paint script applied, then start the engine.
  useEffect(() => {
    const d = document.documentElement;
    const lg = (d.dataset.lang === 'ar' ? 'ar' : 'en') as Lang;
    setLang(lg);
    setTheme(d.dataset.theme === 'dark' ? 'dark' : 'light');
    if (root.current) root.current.dir = lg === 'ar' ? 'rtl' : 'ltr';
    d.lang = lg;
    const t = readTweakOverrides();
    // The loader plays on a first visit only; returning visitors (within 7 days) go straight to the hero.
    // With ?tweaks it always plays, so it can be tuned.
    let seen = false;
    try { seen = Date.now() - Number(localStorage.getItem(SEEN_KEY) || 0) < 7 * 864e5; localStorage.setItem(SEEN_KEY, String(Date.now())); } catch {}
    const tuning = new URLSearchParams(location.search).has('tweaks');
    initEngine(root.current!, {
      skipPreload: !t.showPreloader || (seen && !tuning),
      boilMs: t.boilInterval,
      textAnim: { animation: t.loaderAnimation, by: t.loaderBy, duration: t.loaderDuration, delay: t.loaderDelay }
    });
  }, []);

  useEffect(() => {
    E.boilMs = tweaks.boilInterval;
    document.documentElement.style.setProperty('--gk', String(tweaks.grainAmount));
  }, [tweaks.boilInterval, tweaks.grainAmount]);

  useEffect(() => {
    savePrefs(theme, lang);
  }, [theme, lang]);

  useEffect(() => {
    if (!E.inited) return;
    requestAnimationFrame(() => { scan(); fit(); ScrollTrigger.refresh(); });
  }, [lang, tweaks.showStars]);

  const center = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [r.left + r.width / 2, r.top + r.height / 2] as const;
  };
  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const [x, y] = center(e);
    circleTransition(x, y, () => flushSync(() => { document.documentElement.dataset.theme = next; setTheme(next); }));
  };
  const toggleLang = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Lang = lang === 'en' ? 'ar' : 'en';
    const [x, y] = center(e);
    circleTransition(x, y, () => flushSync(() => {
      const d = document.documentElement;
      d.dataset.lang = next;
      d.lang = next;
      if (root.current) root.current.dir = next === 'ar' ? 'rtl' : 'ltr';
      setLang(next);
    }));
  };

  const srcFor = (i: number) => root.current?.querySelector<HTMLElement>('#work [data-media="' + i + '"]') ?? null;

  const openCase = useCallback((i: number, el: HTMLElement, peelFirst = false) => {
    const go = () => {
      src.current = el;
      from.current = el.getBoundingClientRect();
      el.style.visibility = 'hidden';
      setCs(i);
    };
    peelFirst ? peel(el, go) : go();
  }, []);

  const onClosed = useCallback(() => {
    const s = src.current;
    setCs(-1);
    if (s) s.style.visibility = '';
  }, []);

  const nextCs = () => {
    if (busy) return;
    setBusy(true);
    setTimeout(() => {
      const n = (cs + 1) % 4;
      if (src.current) src.current.style.visibility = '';
      const s = srcFor(n);
      if (s) s.style.visibility = 'hidden';
      src.current = s;
      setCs(n);
      setBusy(false);
    }, 480);
  };

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (cs >= 0) closeRef.current?.();
      else setConnect(false);
    };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [cs]);

  return (
    <div ref={root} dir="ltr" className="site">
      <SvgFilters />
      {tweaks.showStars && <Stars />}
      <Preloader />
      <Nav toggleLang={toggleLang} toggleTheme={toggleTheme} />
      <LightRays on={tweaks.showLightRays} count={tweaks.rayCount} speed={tweaks.raySpeed} />
      <Hero connect={connect} setConnect={setConnect} open={(i, el) => openCase(i, el)} />
      <Work
        colors={{ strategy: tweaks.strategyColor, research: tweaks.researchColor, visual: tweaks.visualColor }}
        open={openCase}
      />
      <About open={(i, el) => openCase(i, el)} />
      {cs >= 0 && (
        <CaseStudy index={cs} lang={lang} from={from.current} src={src.current} busy={busy} onNext={nextCs} onClosed={onClosed} closeRef={closeRef} />
      )}
    </div>
  );
}
