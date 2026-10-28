'use client';

/**
 * Word-by-word reveal: each word rises out of a mask and comes into focus, staggered.
 * Remount (change `key`) to replay. CSS lives under `.sw` in globals.css.
 */
export function SplitWords({ text, step = 0.035, delay = 0 }: { text: string; step?: number; delay?: number }) {
  return (
    <span className="sw" aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i}>
          <span className="sw-w" aria-hidden="true"><span style={{ animationDelay: `${delay + i * step}s` }}>{w}</span></span>{' '}
        </span>
      ))}
    </span>
  );
}
