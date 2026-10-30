'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SCENE_MS, STORY } from '@/content/story';
import { L } from '../ui';

const GAP = 420; // empty stage between scenes, ms, so each new object makes an entrance
const GLYPHS = '0123456789#%&$@ABCDEFGHJKLMNPRSTUVXYZ';
const RING = 2 * Math.PI * 7;

const reduced = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Latin letters and digits run through random glyphs and settle left to right. Arabic and punctuation stay put. */
function Decode({ text, on, delay = 0, dur = 650 }: { text: string; on: boolean; delay?: number; dur?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!on || reduced()) { el.textContent = text; return; }
    let raf = 0, start = 0;
    const tick = (now: number) => {
      start ||= now;
      const t = (now - start - delay) / dur;
      const settled = Math.max(0, Math.floor(t * text.length));
      el.textContent = [...text].map((c, k) => (k < settled || !/[0-9A-Za-z]/.test(c) ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
      if (t < 1) raf = requestAnimationFrame(tick); else el.textContent = text;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, text, delay, dur]);
  return <span ref={ref} className="dc" dir="ltr">{text}</span>;
}

/** A thin light that runs once around the edge of its parent. */
const Band = () => (
  <svg className="sp-band" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100">
    <rect x="0.5" y="0.5" width="99" height="99" rx="4" pathLength={100} vectorEffect="non-scaling-stroke" />
  </svg>
);

/** Outline that draws itself in: the empty frame of the next device. */
const Outline = ({ r = 6 }: { r?: number }) => (
  <svg className="sp-outline" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100">
    <rect x="0.5" y="0.5" width="99" height="99" rx={r} pathLength={100} vectorEffect="non-scaling-stroke" />
  </svg>
);

const Pulse = () => <i className="sp-pulse" aria-hidden="true" />;
const d = (s: number) => ({ '--d': s + 's' }) as React.CSSProperties;

const MONTHS = [['Jan', 'يناير'], ['Feb', 'فبراير'], ['Mar', 'مارس'], ['Apr', 'أبريل'], ['May', 'مايو']];

function Scene({ id, on }: { id: string; on: boolean }) {
  switch (id) {
    case 'auto':
      return (
        <div className="sp-panel w34">
          <div className="sp-row sp-in" style={d(0.1)}>
            <b><L en="Auto payroll" ar="الرواتب التلقائية" /></b>
            <span className="sp-tgl" style={d(0.9)}><i /></span>
          </div>
          <div className="sp-fld" style={d(1.3)}>
            <span className="sp-lbl"><L en="Stops after" ar="تتوقف بعد" /></span>
            <div className="sp-chips">
              {MONTHS.map(([en, ar], k) => (
                <span key={en} className="sp-chip" style={d(1.7 + k * 0.14)}><L en={en} ar={ar} /></span>
              ))}
            </div>
          </div>
          <div className="sp-skel sp-in" style={d(0.3)}><i style={{ width: '62%' }} /><i style={{ width: '40%' }} /></div>
        </div>
      );
    case 'code':
      return (
        <div className="sp-panel w32 sp-center">
          <Band />
          <b className="sp-in" style={d(0.1)}><L en="Confirm five months" ar="تأكيد خمسة أشهر" /></b>
          <span className="sp-lbl sp-in" style={d(0.2)}><L en="Jan → May" ar="يناير ← مايو" /></span>
          <div className="sp-otp">
            {'482915'.split('').map((n, k) => (
              <span key={k} className="sp-in" style={d(0.4 + k * 0.12)}><Decode text={n} on={on} delay={400 + k * 120} dur={500} /></span>
            ))}
          </div>
          <span className="sp-stamp" style={d(2.1)}><L en="✓ Confirmed" ar="✓ تم التأكيد" /></span>
        </div>
      );
    case 'warn':
      return (
        <div className="sp-panel w40">
          <div className="sp-row sp-in" style={d(0.1)}>
            <b><L en="Employees" ar="الموظفون" /></b>
            <span className="sp-meter"><span className="sp-lbl"><L en="Expected compliance" ar="الالتزام المتوقع" /></span><i><b style={d(1.8)} /></i></span>
          </div>
          {[64, 48, 72, 55, 40].map((w, k) => (
            <div key={k} className={'sp-emp sp-in' + (k === 1 || k === 3 ? ' bad' : '')} style={d(0.25 + k * 0.09)}>
              <span className="sp-av" />
              <i style={{ width: w + '%' }} />
              <span className="sp-amt"><Decode text={['8,500', '6,200', '11,000', '7,400', '9,850'][k]} on={on} delay={300 + k * 90} /></span>
              {(k === 1 || k === 3) && <span className="sp-flag" style={d(1.15 + k * 0.12)}><L en="Check" ar="تنبيه" /></span>}
            </div>
          ))}
        </div>
      );
    case 'request':
      return (
        <div className="sp-fan">
          <div className="sp-panel w22 sp-center sp-in" style={d(0.1)}>
            <span className="sp-lbl"><L en="Financing request" ar="طلب تمويل" /></span>
            <b className="sp-big"><Decode text="250,000" on={on} delay={200} /></b>
          </div>
          <svg className="sp-wires" viewBox="0 0 500 70" preserveAspectRatio="none" aria-hidden="true">
            {[50, 150, 250, 350, 450].map((x, k) => (
              <path key={x} d={`M250 0 C250 35 ${x} 35 ${x} 70`} pathLength={1} style={d(0.7 + Math.abs(k - 2) * 0.12)} />
            ))}
          </svg>
          <div className="sp-provs">
            {[0, 1, 2, 3, 4].map((k) => <span key={k} className="sp-prov" style={d(1.15 + Math.abs(k - 2) * 0.12)}><i /><i /></span>)}
          </div>
        </div>
      );
    case 'offers':
      return (
        <div className="sp-offers">
          {['5.1', '4.4', '4.9'].map((rate, k) => (
            <div key={k} className={'sp-offer' + (k === 1 ? ' best' : '')}>
              <span className="sp-tiles">{[0, 1, 2, 3].map((q) => <b key={q} style={d(0.1 + k * 0.15 + q * 0.06)} />)}</span>
              <div className="sp-offer-in" style={d(1.3 + k * 0.15)}>
                {k === 1 && <Band />}
                <i className="sp-logo" />
                <span className="sp-lbl"><L en="Rate" ar="النسبة" /></span>
                <b className="sp-big"><Decode text={rate + '%'} on={on} delay={1400 + k * 150} /></b>
                <i className="sp-bar" style={{ width: ['58%', '70%', '46%'][k] }} />
              </div>
              {k === 1 && <span className="sp-stamp sm" style={d(2.4)}><L en="Lowest rate" ar="أقل نسبة" /></span>}
            </div>
          ))}
        </div>
      );
    case 'sign':
      return (
        <div className="sp-ho">
          <div className="sp-from sp-panel w22 sp-center green" style={d(0.85)}>
            <span className="sp-lbl"><L en="Offer B" ar="العرض ب" /></span>
            <b className="sp-big">4.4%</b>
            <span className="sp-btn"><L en="Sign" ar="وقّع" /><Pulse /></span>
          </div>
          <div className="sp-to sheet" style={d(1.15)}>
            <Outline r={3} />
            <div className="sp-fill" style={d(1.7)}>
              <b><L en="Financing contract" ar="عقد التمويل" /></b>
              <div className="sp-skel"><i style={{ width: '90%' }} /><i style={{ width: '76%' }} /><i style={{ width: '84%' }} /></div>
              <div className="sp-otp sm">
                {'7031'.split('').map((n, k) => <span key={k}><Decode text={n} on={on} delay={1900 + k * 110} dur={420} /></span>)}
              </div>
              <span className="sp-stamp" style={d(2.75)}><L en="✓ Signed" ar="✓ تم التوقيع" /></span>
            </div>
          </div>
        </div>
      );
    case 'earned':
      return (
        <div className="sp-phone solo">
          <Outline r={14} />
          <div className="sp-fill" style={d(0.6)}>
            <span className="sp-lbl"><L en="Earned this month" ar="المكتسب هذا الشهر" /></span>
            <b className="sp-big"><Decode text="4,250" on={on} delay={800} /></b>
            <span className="sp-days"><b style={d(1.2)} /></span>
            <span className="sp-lbl"><L en="Day 18 of 30" ar="اليوم 18 من 30" /></span>
            <span className="sp-btn" style={d(1.6)}><L en="Request 1,500" ar="اطلب 1,500" /><Pulse /></span>
          </div>
        </div>
      );
    case 'approve':
      return (
        <div className="sp-ho">
          <div className="sp-from sp-phone sm" style={d(0.75)}>
            <div className="sp-fill on">
              <span className="sp-lbl"><L en="Request sent" ar="أُرسل الطلب" /></span>
              <b className="sp-big">1,500</b>
              <span className="sp-btn"><L en="Done" ar="تم" /><Pulse /></span>
            </div>
          </div>
          <div className="sp-to wide" style={d(1.05)}>
            <Outline r={6} />
            <div className="sp-fill" style={d(1.55)}>
              <div className="sp-row"><b><L en="Early wage requests" ar="طلبات الأجر المبكر" /></b><span className="sp-lbl"><Decode text="47:59:12" on={on} delay={1700} /></span></div>
              {[52, 66, 44].map((w, k) => (
                <div key={k} className="sp-emp">
                  <span className="sp-av" /><i style={{ width: w + '%' }} />
                  <span className="sp-amt">{['1,500', '900', '2,000'][k]}</span>
                  <span className={'sp-pill' + (k === 0 ? ' ok' : '')} style={d(2.5)}>
                    {k === 0 ? <><span className="was"><L en="Pending" ar="قيد المراجعة" /></span><span className="now"><L en="Approved" ar="تمت الموافقة" /></span></> : <L en="Pending" ar="قيد المراجعة" />}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case 'settle':
      return (
        <div className="sp-panel w40">
          <div className="sp-row sp-in" style={d(0.1)}>
            <b><L en="March payroll" ar="مسيرة مارس" /></b>
            <span className="sp-lbl"><L en="Total" ar="الإجمالي" /> <Decode text="412,600" on={on} delay={200} /></span>
          </div>
          {[58, 70, 46].map((w, k) => (
            <div key={k} className={'sp-emp sp-in' + (k === 1 ? ' open' : '')} style={d(0.25 + k * 0.1)}>
              <span className="sp-av" /><i style={{ width: w + '%' }} />
              <span className="sp-amt">{['8,500', '6,200', '7,400'][k]}</span>
              {k === 1 && (
                <span className="sp-sub" style={d(1.0)}>
                  <span><L en="Early wage deduction" ar="استقطاع أجر مبكر" /> <span dir="ltr">−1,500</span></span>
                  <span className="sp-stamp sm" style={d(1.9)}><L en="Not a violation" ar="ليست مخالفة" /></span>
                </span>
              )}
            </div>
          ))}
        </div>
      );
  }
  return null;
}

/**
 * The Mudad case study hero as a "story player": tabs choose a thread, each thread plays three short
 * illustrated scenes, and the captions under the stage are the timeline. Modelled on the AccessGrid
 * stage: a quiet monochrome stage where colour shows up only at the moment that matters.
 */
export function StoryPlayer() {
  const [tab, setTab] = useState(0);
  const [scene, setScene] = useState(0);
  const [live, setLive] = useState(false);
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const root = useRef<HTMLElement>(null);
  const rings = useRef<(SVGCircleElement | null)[]>([]);
  const t0 = useRef(0);
  const elapsed = useRef(0);

  const go = useCallback((t: number, s: number) => {
    setTab(t); setScene(s); setLive(false);
    elapsed.current = 0; t0.current = 0;
  }, []);

  useEffect(() => {
    setReduce(reduced());
    const io = new IntersectionObserver(([e]) => { setInView(e.isIntersecting); if (e.isIntersecting) setSeen(true); }, { threshold: 0.35 });
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);

  // Under reduced motion there's no clock: the scene shows in its finished state and the captions are buttons.
  useEffect(() => { if (reduce) setLive(true); }, [reduce, tab, scene]);

  useEffect(() => {
    if (reduce || !inView || paused) { t0.current = 0; return; }
    let raf = 0;
    const tick = (now: number) => {
      if (!t0.current) t0.current = now - elapsed.current;
      elapsed.current = now - t0.current;
      if (elapsed.current >= GAP) setLive(true);
      const p = Math.min(1, elapsed.current / (SCENE_MS + GAP));
      const ring = rings.current[scene];
      if (ring) ring.style.strokeDashoffset = String(RING * (1 - p));
      if (p >= 1) {
        const last = scene === STORY[tab].scenes.length - 1;
        go(last ? (tab + 1) % STORY.length : tab, last ? 0 : scene + 1);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, inView, paused, tab, scene, go]);

  // Rings behind the active one are full, ahead of it empty.
  useEffect(() => {
    rings.current.forEach((r, k) => { if (r && k !== scene) r.style.strokeDashoffset = String(k < scene ? 0 : RING); });
    if (reduce && rings.current[scene]) rings.current[scene]!.style.strokeDashoffset = '0';
  }, [tab, scene, reduce]);

  const cur = STORY[tab];

  return (
    <section ref={root} className={'sp' + (seen ? ' in' : '')} data-tab={tab} aria-label="Mudad Payroll story">
      <div className="sp-tabs" role="tablist">
        {STORY.map((t, k) => (
          <button key={t.id} type="button" role="tab" aria-selected={k === tab} className={k === tab ? 'on' : ''} style={d(0.1 + k * 0.08)} onClick={() => go(k, 0)}>
            <L en={t.label.en} ar={t.label.ar} />
          </button>
        ))}
        {!reduce && (
          <button type="button" className="sp-pause mono" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play' : 'Pause'}>
            {paused ? '▶' : '❚❚'}
          </button>
        )}
      </div>

      <div className="sp-stage">
        <div className="sp-bg" aria-hidden="true"><span className="blob b1" /><span className="blob b2" /><span className="blob b3" /></div>
        <div className="sp-grid" aria-hidden="true" />
        {STORY.map((t, ti) => t.scenes.map((s, si) => {
          const on = ti === tab && si === scene && live;
          return (
            <div key={s.id} className={'sp-sc' + (on ? ' on' : '')} aria-hidden={!on}>
              <Scene id={s.id} on={on} />
            </div>
          );
        }))}
      </div>

      <div className="sp-caps" role="list">
        {cur.scenes.map((s, k) => (
          <button key={cur.id + s.id} type="button" role="listitem" className={'sp-cap' + (k === scene ? ' on' : '')} onClick={() => go(tab, k)}>
            <svg className="sp-ring" viewBox="0 0 18 18" aria-hidden="true">
              <circle cx="9" cy="9" r="7" />
              <circle className="p" cx="9" cy="9" r="7" ref={(el) => { rings.current[k] = el; }} style={{ strokeDasharray: RING, strokeDashoffset: RING }} />
            </svg>
            <b><L en={s.title.en} ar={s.title.ar} /></b>
            <span><L en={s.body.en} ar={s.body.ar} /></span>
          </button>
        ))}
      </div>
    </section>
  );
}
