'use client';
import { useState } from 'react';
import { LabShell } from '@/components/lab/lab-shell';
import { RevealLines } from '@/components/lab/reveal-lines';
import { FocusWords } from '@/components/lab/focus-words';
import { L } from '@/components/ui';
import { PRINCIPLES } from '@/content/sections';
import { PROJECTS } from '@/content/projects';

const mudad = PROJECTS.find((p) => p.key === 'payroll')!;

const ABOUT = {
  en: 'I design the parts of work people *dread:* payroll day, subscription renewals, a dispatch call that can’t wait. My job is making them *boring* again, so nobody has to think about them twice.',
  ar: 'أصمم الأجزاء التي يخشاها الناس في العمل: يوم الرواتب، وتجديد الاشتراكات، ومكالمة توزيع لا تحتمل الانتظار. مهمتي أن أجعلها مملة من جديد، فلا يضطر أحد للتفكير فيها مرتين.'
};

export function MotionLab() {
  const [k, setK] = useState(0);
  return (
    <LabShell title="Motion" note="Two text reveals, chosen 28 Oct: a line rise for headings (after toyfight.co) and a focus-on-scroll for prose (after lukebaffait.fr). Scroll slowly; switch to ع to check Arabic.">
      <section className="lab-demo">
        <div className="lab-demo-head">
          <span className="mono">01 · Headings: line rise</span>
          <button type="button" className="mono lab-btn" onClick={() => setK((x) => x + 1)}>Replay</button>
        </div>
        <p className="muted lab-desc">Each line slides up out of a clipped box once the heading is a fifth of the way up the screen: 1.2s, expo out, 0.1s between lines. It plays once and stays put when you scroll back.</p>
        <div key={k} className="lab-stack">
          {PRINCIPLES.map((p) => (
            <h2 key={p.n} className="lab-head">
              <L en={<RevealLines text={p.h.en} />} ar={<RevealLines text={p.h.ar} />} />
            </h2>
          ))}
          <h2 className="lab-head lab-head-xl">
            <L en={<RevealLines text="Payroll that runs itself, for 900,000 establishments." />} ar={<RevealLines text="رواتب تعمل من تلقاء نفسها، لأكثر من 900 ألف منشأة." />} />
          </h2>
        </div>
      </section>

      <section className="lab-demo">
        <div className="lab-demo-head"><span className="mono">02 · Prose: focus on scroll</span></div>
        <p className="muted lab-desc">Every word starts faint and blurred and sharpens as it moves from 75% to 60% of the screen height. It follows the scroll, so it blurs again on the way back up. Phones and tablets get the fade without the blur.</p>
        <div className="lab-stack">
          <p className="lab-prose"><L en={<FocusWords text={ABOUT.en} />} ar={<FocusWords text={ABOUT.ar} />} /></p>
          <p className="lab-prose lab-prose-sm"><L en={<FocusWords text={mudad.en.cs.summary} />} ar={<FocusWords text={mudad.ar.cs.summary} />} /></p>
        </div>
      </section>

      <section className="lab-demo">
        <div className="lab-demo-head"><span className="mono">03 · Together: a case study beat</span></div>
        <p className="muted lab-desc">How the two would sit in a case study: the heading rises, then the paragraph comes into focus under it as you read down.</p>
        <div className="lab-stack">
          {PRINCIPLES.slice(0, 2).map((p) => (
            <article key={p.n} className="lab-beat">
              <span className="mono red-sm">{p.n}</span>
              <h3 className="lab-head"><L en={<RevealLines text={p.h.en} />} ar={<RevealLines text={p.h.ar} />} /></h3>
              <p className="lab-prose lab-prose-sm"><L en={<FocusWords text={p.p.en} />} ar={<FocusWords text={p.p.ar} />} /></p>
            </article>
          ))}
        </div>
      </section>

      <section className="lab-demo">
        <div className="lab-demo-head"><span className="mono">04 · Loader</span></div>
        <p className="muted lab-desc">Now about 1.8s and shown on a first visit only. To see it again, open the site with ?tweaks, which always plays it and lets you tune it.</p>
        <a className="mono lab-btn" href="/?tweaks">Open the site with ?tweaks →</a>
      </section>
    </LabShell>
  );
}
