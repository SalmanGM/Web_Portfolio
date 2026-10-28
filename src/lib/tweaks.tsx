'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type LoaderAnimation =
  | 'fadeIn' | 'blurIn' | 'blurInUp' | 'blurInDown' | 'slideUp'
  | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleUp' | 'scaleDown';

export type Tweaks = {
  loaderAnimation: LoaderAnimation;
  loaderBy: 'character' | 'word' | 'text';
  loaderDuration: number;
  loaderDelay: number;
  boilInterval: number;
  strategyColor: string;
  researchColor: string;
  visualColor: string;
  grainAmount: number;
  showStars: boolean;
  showPreloader: boolean;
  showLightRays: boolean;
  rayCount: number;
  raySpeed: number;
};

/** Production values, baked in from the design's Tweaks panel. */
export const DEFAULT_TWEAKS: Tweaks = {
  loaderAnimation: 'blurInUp',
  loaderBy: 'character',
  loaderDuration: 0.55,
  loaderDelay: 0.05,
  boilInterval: 180,
  strategyColor: '#7FD08A',
  researchColor: '#5CC8DC',
  visualColor: '#E06A3C',
  grainAmount: 1,
  showStars: true,
  showPreloader: true,
  showLightRays: true,
  rayCount: 7,
  raySpeed: 14
};

const KEY = 'sb-tweaks';

type Ctx = { tweaks: Tweaks; set: (patch: Partial<Tweaks>) => void; reset: () => void; enabled: boolean };
const TweaksContext = createContext<Ctx>({ tweaks: DEFAULT_TWEAKS, set: () => {}, reset: () => {}, enabled: false });

/** Overrides only load when the page is opened with ?tweaks, so normal visitors always get the defaults. */
export function readTweakOverrides(): Tweaks {
  if (typeof window === 'undefined') return DEFAULT_TWEAKS;
  if (!new URLSearchParams(location.search).has('tweaks')) return DEFAULT_TWEAKS;
  try {
    return { ...DEFAULT_TWEAKS, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return DEFAULT_TWEAKS;
  }
}

export function TweaksProvider({ children }: { children: React.ReactNode }) {
  const [tweaks, setTweaks] = useState<Tweaks>(DEFAULT_TWEAKS);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!new URLSearchParams(location.search).has('tweaks')) return;
    setEnabled(true);
    setTweaks(readTweakOverrides());
  }, []);

  const set = useCallback((patch: Partial<Tweaks>) => {
    setTweaks((t) => {
      const next = { ...t, ...patch };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);
  const reset = useCallback(() => {
    try { localStorage.removeItem(KEY); } catch {}
    setTweaks(DEFAULT_TWEAKS);
  }, []);

  return <TweaksContext.Provider value={{ tweaks, set, reset, enabled }}>{children}</TweaksContext.Provider>;
}

export const useTweaks = () => useContext(TweaksContext);
