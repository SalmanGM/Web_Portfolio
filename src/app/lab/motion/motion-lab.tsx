'use client';
import { useEffect, useRef, useState } from 'react';
import { LabShell } from '@/components/lab/lab-shell';
import { SplitWords } from '@/components/lab/split-words';

/** Replays its children's word reveal each time it scrolls into view (or on Replay). */
function RevealOnView({ text, step }: { text: string; step?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [run, setRun] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setRun((r) => r + 1); }, { threshold: 0.6 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);
  return <span ref={ref} className="block">{run > 0 ? <SplitWords key={run} text={text} step={step} /> : <span style={{ opacity: 0 }}>{text}</span>}</span>;
}

const LINES = [
  'I design the stuff people dread at work.',
  'Payroll day. Subscription renewals. A dispatch call that can’t wait.',
  'My job is making those boring again.'
];

export function MotionLab() {
  const [k, setK] = useState(0);
  return (
    <LabShell title="Motion" note="Primitives on trial. Each one is described above its demo; Replay restarts the reveals.">
      <section className="lab-demo">
        <div className="lab-demo-head">
          <span className="mono">01 · Word reveal on scroll</span>
          <button type="button" className="mono lab-btn" onClick={() => setK((x) => x + 1)}>Replay</button>
        </div>
        <p className="muted lab-desc">Words rise out of a mask and sharpen from a blur, one after another, as the line enters the screen. Inspired by toyfight.co/services.</p>
        <h2 key={k} className="lab-big">
          {LINES.map((l) => <RevealOnView key={l} text={l} step={0.05} />)}
        </h2>
      </section>

      <section className="lab-demo">
        <div className="lab-demo-head"><span className="mono">02 · Blur on scroll</span></div>
        <p className="muted lab-desc">Blocks come into focus as they rise into view, tied to the scroll position, so they sharpen as fast as you scroll. Inspired by lukebaffait.fr.</p>
        {[0, 1, 2].map((i) => (
          <div key={i} data-blur="" className="lab-blur-card">
            <span className="mono red-sm">{['Mudad Payroll', 'Mudad Subscriptions', 'Saned Dispatch'][i]}</span>
            <p>{[
              'Payroll used to take three steps and a bit of hoping. We got it to two.',
              'Renewals felt like a trap, so I rewrote the rules: you’re told before you’re charged.',
              'Call-center agents jumped between tabs to dispatch one order. Now it’s one screen.'
            ][i]}</p>
          </div>
        ))}
      </section>

      <section className="lab-demo">
        <div className="lab-demo-head"><span className="mono">03 · Loader</span></div>
        <p className="muted lab-desc">Now about 1.8s and shown on a first visit only. To see it again, open the site with ?tweaks, which always plays it and lets you tune it.</p>
        <a className="mono lab-btn" href="/?tweaks">Open the site with ?tweaks →</a>
      </section>
    </LabShell>
  );
}
