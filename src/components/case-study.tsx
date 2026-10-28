'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BEAT_KICKER, MENU, PROJECTS } from '@/content/projects';
import type { Lang } from '@/lib/prefs';
import { csStagger, flipClose, flipOpen } from '@/lib/engine';
import { L, Slot } from './ui';

type Props = {
  index: number;
  lang: Lang;
  from: DOMRect | null;
  src: HTMLElement | null;
  busy: boolean;
  onNext: () => void;
  onClosed: () => void;
  closeRef: React.MutableRefObject<(() => void) | null>;
};

export function CaseStudy({ index, lang, from, src, busy, onNext, onClosed, closeRef }: Props) {
  const ov = useRef<HTMLDivElement>(null);
  const mini = useRef<HTMLDivElement>(null);
  const ind = useRef<HTMLDivElement>(null);
  const [sec, setSec] = useState(0);
  const first = useRef(true);

  const p = PROJECTS[index];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const figs = !!p.figures;
  const beatCount = p.en.cs.beats.length;

  const onScroll = useCallback(() => {
    const el = ov.current, m = mini.current, i = ind.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    const pr = max > 0 ? el.scrollTop / max : 0;
    if (m && i) {
      const H = m.clientHeight - 6;
      const h = Math.max(18, (el.clientHeight / el.scrollHeight) * H);
      i.style.height = h + 'px';
      i.style.top = 3 + pr * (H - h) + 'px';
    }
    let a = 0;
    el.querySelectorAll('[data-cs-sec]').forEach((s, k) => { if (s.getBoundingClientRect().top < innerHeight * 0.45) a = k; });
    setSec(a);
  }, []);

  // Open: grow the clicked image into the hero frame. Next: reset scroll and stagger the content in.
  useEffect(() => {
    const el = ov.current!;
    if (first.current) { first.current = false; flipOpen(el, from); }
    else { el.scrollTop = 0; csStagger(el); }
    setSec(0);
    requestAnimationFrame(onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => { requestAnimationFrame(onScroll); }, [lang, onScroll]);

  closeRef.current = () => { if (ov.current) flipClose(ov.current, src, onClosed); else onClosed(); };

  const jumpTo = (k: number) => {
    const el = ov.current;
    const s = el?.querySelectorAll<HTMLElement>('[data-cs-sec]')[k];
    if (el && s) el.scrollTo({ top: s.getBoundingClientRect().top + el.scrollTop - 80, behavior: 'smooth' });
  };
  const miniClick = (e: React.MouseEvent) => {
    const el = ov.current, m = mini.current;
    if (!el || !m) return;
    const r = m.getBoundingClientRect();
    el.scrollTo({ top: ((e.clientY - r.top) / r.height) * (el.scrollHeight - el.clientHeight), behavior: 'smooth' });
  };

  const menu = (lg: Lang) => (figs ? [MENU[lg][0], ...p[lg].cs.beats.map((b) => b.h)] : MENU[lg]);
  const kicker = (lg: Lang, j: number) => {
    const b = p[lg].cs.beats[j];
    if (!figs) return BEAT_KICKER[lg][j];
    if (j === beatCount - 1) return BEAT_KICKER[lg][2];
    return b.k || BEAT_KICKER[lg][Math.min(j, 1)];
  };
  const bar = busy ? '100%' : '0%';
  const d = p[lang];

  return (
    <div ref={ov} data-lenis-prevent="" role="dialog" aria-modal="true" aria-label={d.title} className="cs" onScroll={onScroll}>
      <div data-cs-bg="" className="cs-bg" />
      <div data-cs-paper="" aria-hidden="true" />
      <div className="relative">
        <div data-cs-in="" className="cs-bar">
          <button type="button" className="cs-close" onClick={() => closeRef.current?.()}>
            <L en="← Close" ar="إغلاق →" />
          </button>
          <span className="mono muted cs-crumb">
            <span dir="ltr" className="num fs14">{'0' + (index + 1)} / 04</span> · <L en={p.en.title} ar={p.ar.title} />
          </span>
          <button type="button" className="cs-next" onClick={onNext}>
            <span className="cs-next-bar" style={{ width: bar }} />
            <span className="relative">
              {busy ? <L en="Loading…" ar="جارٍ التحميل…" /> : <L en="Next →" ar="التالي ←" />}
            </span>
          </button>
        </div>

        <div className="cs-hero-pad">
          <div data-flip="" className="cs-flip">
            <div data-flip-inner="" className="cs-flip-inner" style={{ background: p.bg }}>
              {figs ? (
                <div className="cs-fighero">
                  <div className="cs-fighero-box">
                    <Slot id="cs-hero-payroll" ph="Drop hero-auto-payroll.webp (21:9)" alt={p.hero?.alt} />
                  </div>
                </div>
              ) : p.frame === 'phone' ? (
                <div className="cs-phone">
                  <div className="cs-phone-screen"><Slot id={p.slot} ph={p.ph} /></div>
                </div>
              ) : (
                <div className="cs-browser">
                  <Slot id={p.slot} ph={p.ph} />
                  <span className="gloss" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="cs-grid">
          <aside data-cs-in="" className="cs-rail">
            <span className="mono muted cs-rail-h"><L en="On this page" ar="في هذه الصفحة" /></span>
            {menu('en').map((label, j) => {
              const on = j === sec;
              return (
                <button key={j} type="button" className="cs-menu" style={{ color: on ? 'var(--ink)' : 'var(--muted)' }} onClick={() => jumpTo(j)}>
                  <span className="cs-menu-bar" style={{ width: on ? 28 : 10 }} />
                  <span><L en={label} ar={menu('ar')[j]} /></span>
                </button>
              );
            })}
          </aside>

          <main className="cs-main">
            <div data-cs-sec="" className="flex-col">
              <div data-cs-in="" className="mono cs-tagrow">
                <span className="red-sm"><L en={p.en.cs.tag} ar={p.ar.cs.tag} /></span>
                <span className="muted"><L en="One-minute read" ar="قراءة في دقيقة" /></span>
              </div>
              <h1 data-cs-in="" className="display cs-title"><L en={p.en.title} ar={p.ar.title} /></h1>
              <div data-cs-in="" className="cs-summary-row">
                <p className="cs-summary"><L en={p.en.cs.summary} ar={p.ar.cs.summary} /></p>
                <div className="cs-facts">
                  <div className="cs-fact">
                    <span className="mono muted"><L en="Company" ar="الجهة" /></span>
                    <span className="fs16"><L en={p.en.cs.org} ar={p.ar.cs.org} /></span>
                  </div>
                  <div className="cs-fact">
                    <span className="mono muted"><L en="Role" ar="الدور" /></span>
                    <span className="fs16"><L en={p.en.cs.role} ar={p.ar.cs.role} /></span>
                  </div>
                  {p.en.cs.metrics.map((m, k) => (
                    <div key={k} className="cs-fact">
                      <span className="num red cs-metric"><L en={m.v} ar={p.ar.cs.metrics[k].v} /></span>
                      <span className="fs14 muted"><L en={m.l} ar={p.ar.cs.metrics[k].l} /></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {p.en.cs.beats.map((b, j) => {
              const a = p.ar.cs.beats[j];
              const fl = figs ? p.figures![j] || [] : [];
              return (
                <section key={j} data-cs-sec="" data-cs-in="" className="cs-beat">
                  <div className="cs-beat-copy">
                    <span className="mono red-sm cs-beat-k">
                      <span dir="ltr" className="num fs22">{'0' + (j + 1)}</span>
                      <span><L en={kicker('en', j)} ar={kicker('ar', j)} /></span>
                    </span>
                    <h2 className="display cs-beat-h"><L en={b.h} ar={a.h} /></h2>
                    <p className="cs-beat-p"><L en={b.p} ar={a.p} /></p>
                  </div>
                  {figs ? (
                    fl[0] && <img src={fl[0].src} alt={fl[0].alt} loading="lazy" decoding="async" className="cs-fig" />
                  ) : (
                    <div className="cs-beat-media" style={{ background: p.bg }}>
                      <div className="cs-beat-frame">
                        <Slot id={'cs2-' + p.key + '-' + (j + 1)} ph={p.beatPh[j]} />
                        <span className="gloss" />
                      </div>
                    </div>
                  )}
                  {fl.length > 1 && (
                    <div className="cs-figgrid">
                      {fl.slice(1).map((g) => <img key={g.src} src={g.src} alt={g.alt} loading="lazy" decoding="async" className="cs-fig" />)}
                    </div>
                  )}
                </section>
              );
            })}

            <button type="button" className="cs-nextbig" onClick={onNext}>
              <span className="cs-nextbig-bar" style={{ width: bar }} />
              <span className="mono muted"><L en="Next project" ar="المشروع التالي" /></span>
              <span className="display cs-nextbig-t"><L en={next.en.title + ' →'} ar={next.ar.title + ' →'} /></span>
            </button>
          </main>

          <aside data-cs-in="" className="cs-rail cs-rail-r">
            <span className="mono muted"><L en="Page" ar="الصفحة" /></span>
            <div ref={mini} title="Jump" className="cs-mini" onClick={miniClick}>
              <span className="cs-mini-hero" style={{ background: p.bg }} />
              <div className="cs-mini-head">
                <span className="mm mm-red" />
                <span className="mm mm-title" />
                <span className="mm mm-line" />
                <span className="mm mm-line mm-70" />
              </div>
              {p.en.cs.beats.map((_, j) => (
                <div key={j} className="cs-mini-beat">
                  <div className="cs-mini-text">
                    <span className="mm mm-h" />
                    <span className="mm mm-t" />
                    <span className="mm mm-t mm-80" />
                  </div>
                  <span className="cs-mini-img" style={{ background: p.bg }} />
                </div>
              ))}
              <div ref={ind} className="cs-mini-ind" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
