'use client';
import { useEffect, useRef } from 'react';
import { E, gsap, ScrollTrigger } from '@/lib/engine';

/**
 * Prose reveal after lukebaffait.fr: every word starts faint and blurred and comes into focus as it
 * travels from 75% to 60% of the screen height. Tied to the scroll, so it reverses on the way back up.
 * Touch devices get the fade without the blur (blur is costly on phones); reduced motion gets plain text.
 * Wrap a word in *asterisks* to set it in italics.
 */
export function FocusWords({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (E.reduce || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const blur = navigator.maxTouchPoints < 1;
    const ctx = gsap.context(() => {
      el.querySelectorAll('.fw-w').forEach((w) => {
        gsap.fromTo(w,
          { opacity: 0.08, filter: blur ? 'blur(10px)' : 'none' },
          { opacity: 1, filter: blur ? 'blur(0px)' : 'none', ease: 'none', scrollTrigger: { trigger: w, start: 'top 75%', end: 'top 60%', scrub: true } });
      });
    }, el);
    // A hidden language has no layout; refresh the triggers once it appears.
    let h = el.offsetHeight;
    const ro = new ResizeObserver(() => { if (el.offsetHeight !== h) { h = el.offsetHeight; ScrollTrigger.refresh(); } });
    ro.observe(el);
    return () => { ro.disconnect(); ctx.revert(); };
  }, []);

  return (
    <span ref={ref} className="fw">
      {text.split(/\s+/).filter(Boolean).map((w, i) => {
        const em = /^\*.*\*[.,;:!?،]?$/.test(w);
        const word = em ? w.replace(/\*/g, '') : w;
        return (
          <span key={i}>
            <span className="fw-w">{em ? <em>{word}</em> : word}</span>{' '}
          </span>
        );
      })}
    </span>
  );
}
