'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Heading reveal after toyfight.co/services: the text is split into its rendered lines, and each
 * line rises out of a clipped box (1.2s expo out, 0.1s apart) once the block is 20% up the screen.
 * Plays once. Splits by word only, so Arabic letters keep joining. Re-splits when the width
 * changes, including when a hidden language becomes visible. Remount (change `key`) to replay.
 * CSS lives under `.rl` in globals.css.
 */
export function RevealLines({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(/\s+/).filter(Boolean);
  const [lines, setLines] = useState<string[][] | null>(null);
  const [on, setOn] = useState(false);
  const [, remeasure] = useState(0);

  // Measure: group the words by the line they land on.
  useLayoutEffect(() => {
    if (lines) return;
    const el = ref.current!;
    if (!el.offsetWidth) return;
    const out: string[][] = [];
    let top = -Infinity;
    el.querySelectorAll<HTMLElement>('.rl-w').forEach((w, i) => {
      if (w.offsetTop > top + 2) { out.push([]); top = w.offsetTop; }
      out[out.length - 1].push(words[i]);
    });
    setLines(out);
  });

  useEffect(() => {
    const el = ref.current!;
    let width = el.offsetWidth;
    const ro = new ResizeObserver(() => {
      if (el.offsetWidth === width) return;
      width = el.offsetWidth;
      setLines(null);
      remeasure((n) => n + 1);
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: '0px 0px -20% 0px' });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  return (
    <span ref={ref} className={'rl' + (on ? ' on' : '')} aria-label={text} style={{ '--rl-delay': `${delay}s` } as React.CSSProperties}>
      {lines
        ? lines.map((l, i) => (
            <span key={i} className="rl-mask" aria-hidden="true">
              <span className="rl-line" style={{ '--i': i } as React.CSSProperties}>{l.join(' ')}</span>
            </span>
          ))
        : words.map((w, i) => (
            <span key={i} aria-hidden="true">
              <span className="rl-w">{w}</span>{' '}
            </span>
          ))}
    </span>
  );
}
