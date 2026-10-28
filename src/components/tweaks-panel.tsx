'use client';
import { useState } from 'react';
import { DEFAULT_TWEAKS, useTweaks, type Tweaks } from '@/lib/tweaks';

const ANIMS = ['fadeIn', 'blurIn', 'blurInUp', 'blurInDown', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'scaleUp', 'scaleDown'] as const;
const SWATCH: Record<'strategyColor' | 'researchColor' | 'visualColor', string[]> = {
  strategyColor: ['#7FD08A', '#5CC8DC', '#E0A84A', '#E06A3C'],
  researchColor: ['#5CC8DC', '#7FD08A', '#E0A84A', '#C9A7E8'],
  visualColor: ['#E0A84A', '#E06A3C', '#5CC8DC', '#7FD08A']
};

/** Dev-only tuning panel. Only rendered when the URL has ?tweaks; values persist in this browser. */
export function TweaksPanel() {
  const { tweaks: t, set, reset, enabled } = useTweaks();
  const [open, setOpen] = useState(true);
  if (!enabled) return null;

  const range = (k: keyof Tweaks, min: number, max: number, step: number, unit = '') => (
    <label className="tw-row">
      <span>{k}<b>{String(t[k])}{unit}</b></span>
      <input type="range" min={min} max={max} step={step} value={t[k] as number} onChange={(e) => set({ [k]: +e.target.value })} />
    </label>
  );
  const bool = (k: keyof Tweaks) => (
    <label className="tw-row tw-bool">
      <input type="checkbox" checked={t[k] as boolean} onChange={(e) => set({ [k]: e.target.checked })} />
      <span>{k}</span>
    </label>
  );

  return (
    <div className="tw" data-lenis-prevent="">
      <button type="button" className="tw-toggle" onClick={() => setOpen(!open)}>Tweaks {open ? '–' : '+'}</button>
      {open && (
        <div className="tw-body">
          <p className="tw-h">Loader text animation <i>(reload to replay)</i></p>
          <label className="tw-row">
            <span>loaderAnimation</span>
            <select value={t.loaderAnimation} onChange={(e) => set({ loaderAnimation: e.target.value as Tweaks['loaderAnimation'] })}>
              {ANIMS.map((a) => <option key={a}>{a}</option>)}
            </select>
          </label>
          <label className="tw-row">
            <span>loaderBy</span>
            <select value={t.loaderBy} onChange={(e) => set({ loaderBy: e.target.value as Tweaks['loaderBy'] })}>
              <option>character</option><option>word</option><option>text</option>
            </select>
          </label>
          {range('loaderDuration', 0.5, 8, 0.1, 's')}
          {range('loaderDelay', 0, 2, 0.05, 's')}
          <p className="tw-h">Stop-motion</p>
          {range('boilInterval', 80, 1200, 20, 'ms')}
          <p className="tw-h">Chapter colours</p>
          {(Object.keys(SWATCH) as (keyof typeof SWATCH)[]).map((k) => (
            <div key={k} className="tw-row">
              <span>{k}</span>
              <span className="tw-swatches">
                {SWATCH[k].map((c) => (
                  <button key={c} type="button" aria-label={c} className={'tw-sw' + (t[k] === c ? ' on' : '')} style={{ background: c }} onClick={() => set({ [k]: c })} />
                ))}
                <input type="color" value={t[k]} onChange={(e) => set({ [k]: e.target.value.toUpperCase() })} />
              </span>
            </div>
          ))}
          <p className="tw-h">Texture &amp; loader</p>
          {range('grainAmount', 0, 2, 0.1)}
          {bool('showStars')}
          {bool('showPreloader')}
          <p className="tw-h">Light rays</p>
          {bool('showLightRays')}
          {range('rayCount', 0, 14, 1)}
          {range('raySpeed', 4, 30, 1, 's')}
          <button type="button" className="tw-reset" onClick={reset} disabled={JSON.stringify(t) === JSON.stringify(DEFAULT_TWEAKS)}>
            Reset to defaults
          </button>
        </div>
      )}
    </div>
  );
}
