'use client';
import { useEffect, useRef } from 'react';
import { EXP, PRINCIPLES, SKILLS, TEAMS } from '@/content/sections';
import { CONTACT } from '@/content/site';
import { E, gsap, scrollTo } from '@/lib/engine';
import { Dune, HoldCopy, L, Slot } from './ui';
import { PaintingWash } from './work';

function BrushRule({ d }: { d: string }) {
  return (
    <div aria-hidden="true" className="brush-rule">
      <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
        <path data-draw="" d={d} fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        <path data-draw="" data-delay=".25" d="M120 30 C 380 24, 700 34, 1040 27" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".6" />
      </svg>
    </div>
  );
}

/** Team logos scrolling edge to edge; slows on hover, speeds up with scroll velocity. */
function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    let x = 0, v = 1, hover = false;
    const on = () => (hover = true), off = () => (hover = false);
    el.addEventListener('pointerenter', on);
    el.addEventListener('pointerleave', off);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tick = (_t: number, dt: number) => {
      const half = el.scrollWidth / 2;
      if (!half) return;
      const vel = E.lenis ? Math.abs(E.lenis.velocity || 0) : 0;
      const target = (hover ? 0.2 : 1) + Math.min(vel * 0.06, 5);
      v += (target - v) * 0.06;
      x -= (reduce ? 0 : 46) * v * dt / 1000;
      if (-x >= half) x += half;
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); el.removeEventListener('pointerenter', on); el.removeEventListener('pointerleave', off); };
  }, []);
  const items = [...TEAMS, ...TEAMS, ...TEAMS, ...TEAMS];
  return (
    <div className="marquee-mask">
      <div ref={ref} dir="ltr" className="marquee">
        {items.map((m, i) => (
          <div key={i} className="marquee-item">
            {m.kind === 'logo' ? (
              <div role="img" aria-label={m.name} className="marquee-logo" style={{ width: m.w, height: m.h, WebkitMaskImage: `url(${m.logo})`, maskImage: `url(${m.logo})` }} />
            ) : (
              <div className="marquee-word">{m.word}</div>
            )}
            <div className="marquee-cap"><span className="ink">{m.name}</span><span>{m.yrs}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Experience row: drag (or tap) to slide it aside and reveal a related project behind it. */
function SwipeRow({ x, open }: { x: (typeof EXP)[number]; open: (i: number, el: HTMLElement) => void }) {
  const row = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = row.current!, fr = front.current!;
    const rtl = () => getComputedStyle(el).direction === 'rtl';
    let down = false, drag = false, sx = 0, sy = 0, pos = 0, b = 0;
    const max = () => (content.current?.offsetWidth ?? 200) + 48;
    const dir = () => (rtl() ? 1 : -1);
    const set = (v: number, anim?: boolean) => { pos = v; anim ? gsap.to(fr, { x: v, duration: 0.65, ease: 'expo.out' }) : gsap.set(fr, { x: v }); };
    const pdown = (e: PointerEvent) => { if (e.button > 0) return; down = true; drag = false; sx = e.clientX; sy = e.clientY; b = pos; };
    const pmove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!drag) {
        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { drag = true; fr.style.cursor = 'grabbing'; }
        else if (Math.abs(dy) > 10) { down = false; return; }
        else return;
      }
      const m = max() * 1.08;
      let v = b + dx;
      v = dir() < 0 ? Math.max(-m, Math.min(0, v)) : Math.min(m, Math.max(0, v));
      set(v);
    };
    const pup = () => {
      if (!down) return;
      down = false;
      fr.style.cursor = '';
      const m = max(), d = dir();
      if (!drag) set(Math.abs(pos) > 4 ? 0 : d * m, true);
      else set(Math.abs(pos) > m * 0.4 ? d * m : 0, true);
    };
    const enter = () => { if (!E.reduce && Math.abs(pos) < 1) gsap.to(fr, { x: dir() * 14, duration: 0.5, ease: 'expo.out' }); };
    const leave = () => { if (!down && Math.abs(pos) < 1) gsap.to(fr, { x: 0, duration: 0.5, ease: 'expo.out' }); };
    fr.addEventListener('pointerdown', pdown);
    fr.addEventListener('pointerenter', enter);
    fr.addEventListener('pointerleave', leave);
    addEventListener('pointermove', pmove);
    addEventListener('pointerup', pup);
    return () => {
      fr.removeEventListener('pointerdown', pdown);
      fr.removeEventListener('pointerenter', enter);
      fr.removeEventListener('pointerleave', leave);
      removeEventListener('pointermove', pmove);
      removeEventListener('pointerup', pup);
    };
  }, []);
  return (
    <div ref={row} role="listitem" className="swipe">
      <div className="swipe-back">
        <div ref={content} className="swipe-content">
          <span className="serif-i swipe-note"><L en={x.en.back} ar={x.ar.back} /></span>
          <button type="button" className="swipe-open" onClick={(e) => open(x.i, e.currentTarget)}>
            <L en={x.en.cta} ar={x.ar.cta} />
          </button>
        </div>
      </div>
      <div ref={front} className="swipe-front">
        <span className="mono muted"><L en={x.en.date} ar={x.ar.date} /></span>
        <span className="swipe-co">
          <span className="swipe-co-name"><L en={x.en.co} ar={x.ar.co} /></span>
          {x.en.sub && <span className="mono muted"><L en={x.en.sub} ar={x.ar.sub} /></span>}
        </span>
        <span className="fs16"><L en={x.en.role} ar={x.ar.role} /></span>
        <span className="mono muted swipe-hint">
          <span style={{ color: x.cur ? 'var(--red)' : 'var(--line)' }}>●</span>
          <L en="Drag ←" ar="اسحب ←" />
        </span>
      </div>
    </div>
  );
}

export function About({ open }: { open: (i: number, el: HTMLElement) => void }) {
  return (
    <>
      <div data-screen-label="Riyadh art" className="painting riyadh-painting">
        <div data-par="" className="painting-par">
          <div data-kb="" className="fill">
            <Slot id="art-orient" ph="Drop Léon Belly, Pilgrims Going to Mecca (1861), public domain on Wikimedia Commons" />
          </div>
        </div>
        <PaintingWash />
        <span className="painting-credit riyadh-credit">Léon Belly · Pilgrims Going to Mecca · 1861</span>
      </div>

      <BrushRule d="M8 16 C 220 4, 420 32, 640 18 S 1010 2, 1192 24" />
      <section id="about" data-screen-label="About" className="about">
        <span className="mono red-sm label"><L en="(03) About" ar="(٠٣) عنّي" /></span>
        <p data-reveal="" className="about-lede">
          <span lang="en">
            I’m Salman. I started at Jahez designing for people who answer phones all day, spent two years on Mudad at Masdr (back when it was still GOSI Business Development), and now I’m co-founding One To X. I design in Arabic and English, so I’m used to thinking <em className="red">in both directions.</em>
          </span>
          <span lang="ar">
            أنا سلمان. بدأت في جاهز أصمّم لأشخاص يقضون يومهم على الهاتف، ثم قضيت سنتين على منصة مُدد في مصدر (حين كانت لا تزال تطوير أعمال التأمينات الاجتماعية)، والآن أشارك في تأسيس One To X. أصمّم بالعربية والإنجليزية، لذلك اعتدت التفكير <span className="red">في الاتجاهين.</span>
          </span>
        </p>

        <div className="teams">
          <div className="teams-head">
            <h3 className="mono muted"><L en="Teams I’ve shipped with" ar="فرق أطلقت معها منتجات" /></h3>
          </div>
          <Marquee />
        </div>

        <div className="about-grid">
          <div data-brush="" className="portrait">
            <div data-speed="-.4" className="portrait-par"><Slot id="about-portrait" ph="Drop a portrait" /></div>
            <div className="portrait-seal">سلمان</div>
          </div>
          <div className="principles">
            <h3 className="mono muted principles-h"><L en="How I operate" ar="كيف أعمل" /></h3>
            {PRINCIPLES.map((p, i) => (
              <div key={p.n} data-reveal="" className={'principle' + (i === PRINCIPLES.length - 1 ? ' last' : '')}>
                <span dir="ltr" className="num red-sm fs17 principle-n">{p.n}</span>
                <div className="principle-body">
                  <h4 className="display principle-h"><L en={p.h.en} ar={p.h.ar} /></h4>
                  <p className="principle-p"><L en={p.p.en} ar={p.p.ar} /></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="exp-head">
          <h3 data-reveal="" className="display exp-title"><L en="Where I’ve been" ar="أين عملت" /></h3>
          <span className="mono muted"><L en="Most recent first" ar="الأحدث أولاً" /></span>
        </div>
        <div role="list">
          {EXP.map((x) => <SwipeRow key={x.en.date} x={x} open={open} />)}
          <div className="rule-top" />
        </div>
      </section>

      <BrushRule d="M8 24 C 220 12, 420 32, 640 18 S 1010 10, 1192 24" />
      <section id="skills" data-screen-label="Capabilities" className="skills">
        <div className="skills-head">
          <div className="col20">
            <span className="mono red-sm"><L en="(04) Capabilities" ar="(٠٤) المهارات" /></span>
            <h2 data-reveal="" className="display skills-title"><L en="What you’d actually hire me for" ar="ما الذي ستوظّفني من أجله فعلاً" /></h2>
          </div>
          <p data-reveal="" data-delay=".1" className="skills-lede">
            <L en="Six things I’m reliably good at, each tied to something I shipped or proposed. No generic skill bars." ar="ست مهارات أتقنها، وكل واحدة مرتبطة بشيء أطلقته أو اقترحته." />
          </p>
        </div>
        <div className="skills-grid">
          {SKILLS.en.map((s, i) => {
            const a = SKILLS.ar[i];
            return (
              <div key={s.t} data-reveal="" className="skill">
                <div className="skill-top">
                  <span dir="ltr" className="num red-sm fs17">{String(i + 1).padStart(2, '0')}</span>
                  <span className="mono muted"><L en={s.seen} ar={a.seen} /></span>
                </div>
                <h3 className="display skill-t"><L en={s.t} ar={a.t} /></h3>
                <p className="skill-b"><L en={s.b} ar={a.b} /></p>
              </div>
            );
          })}
        </div>
      </section>

      <Dune label="Dune 3" className="dune dune-major" style={{ background: 'var(--sbg)' }} back="color-mix(in oklab, var(--foot-bg) 50%, var(--sbg))" front="var(--foot-bg)" />
      <footer id="contact" data-screen-label="Contact" className="foot">
        <img src="/assets/monet-lilies-1906.webp" alt="" aria-hidden="true" className="foot-art" />
        <div aria-hidden="true" className="foot-tint" />
        <div aria-hidden="true" className="ticket-wrap">
          <div className="ticket">
            <div className="ticket-main">
              <span className="ticket-admit">Admit one</span>
              <span className="ticket-name"><span lang="en">Salman</span><span lang="ar" className="ticket-name-ar">سلمان</span></span>
              <span className="ticket-role">Product Designer · Riyadh</span>
            </div>
            <div className="ticket-no">No. 001</div>
          </div>
        </div>
        <div className="foot-inner">
          <span className="mono foot-label"><L en="(06) Contact" ar="(٠٦) تواصل" /></span>
          <h2 className="display foot-title">
            <span data-reveal="" className="block"><L en="Got a flow everyone hates?" ar="عندك تجربة يكرهها الجميع؟" /></span>
            <a href={'mailto:' + CONTACT.email} data-reveal="" data-delay=".1" className="foot-talk">
              <span lang="en">Let’s talk →</span>
              <span lang="ar" className="foot-talk-ar">لنتحدث ←</span>
            </a>
          </h2>
          <div className="foot-row">
            <p className="foot-p"><L en="I reply within a day or two, faster if it involves money moving somewhere." ar="أرد خلال يوم أو يومين، وأسرع إن كان الأمر يتعلق بأموال تتحرك." /></p>
            <div className="foot-links">
              <HoldCopy email={CONTACT.email} className="hold-foot" />
              {CONTACT.links.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener" className="foot-link">{l.label}</a>
              ))}
            </div>
          </div>
          <div className="foot-bottom mono">
            <span><L en="© 2026 Salman Binmandeel · Riyadh" ar="© 2026 سلمان بن منديل · الرياض" /></span>
            <span><L en="Made with ink, pond water and WebGL" ar="صُنع بالحبر وماء البركة وWebGL" /></span>
            <button type="button" className="foot-top" onClick={() => scrollTo('#top')}><L en="Back to top ↑" ar="إلى الأعلى ↑" /></button>
          </div>
        </div>
      </footer>
    </>
  );
}
