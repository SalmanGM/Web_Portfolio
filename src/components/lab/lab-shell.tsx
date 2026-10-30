'use client';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { circleTransition, initBasic } from '@/lib/engine';
import { savePrefs, type Lang, type Theme } from '@/lib/prefs';

const LABS = [
  { href: '/lab/showcase/', label: 'Showcase' },
  { href: '/lab/story/', label: 'Story' },
  { href: '/lab/motion/', label: 'Motion' }
];

/** Frame for the /lab sandboxes: smooth scroll, theme and language toggles, links between labs. */
export function LabShell({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [lang, setLang] = useState<Lang>('en');
  const [path, setPath] = useState('');

  useEffect(() => {
    const d = document.documentElement;
    setTheme(d.dataset.theme === 'dark' ? 'dark' : 'light');
    const lg = d.dataset.lang === 'ar' ? 'ar' : 'en';
    setLang(lg);
    if (root.current) root.current.dir = lg === 'ar' ? 'rtl' : 'ltr';
    setPath(location.pathname);
    initBasic(root.current!);
  }, []);

  const at = (e: React.MouseEvent<HTMLElement>) => { const r = e.currentTarget.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2] as const; };
  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const [x, y] = at(e);
    circleTransition(x, y, () => flushSync(() => { document.documentElement.dataset.theme = next; setTheme(next); savePrefs(next, lang); }));
  };
  const toggleLang = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Lang = lang === 'en' ? 'ar' : 'en';
    const [x, y] = at(e);
    circleTransition(x, y, () => flushSync(() => {
      document.documentElement.dataset.lang = next;
      if (root.current) root.current.dir = next === 'ar' ? 'rtl' : 'ltr';
      setLang(next);
      savePrefs(theme, next);
    }));
  };

  return (
    <div ref={root} className="site lab">
      <header className="lab-bar">
        <a href="/" className="lab-home mono">← Site</a>
        <span className="lab-title mono">Lab · {title}</span>
        <nav className="lab-links">
          {LABS.map((l) => (
            <a key={l.href} href={l.href} className={'mono' + (path === l.href ? ' on' : '')}>{l.label}</a>
          ))}
          <button type="button" className="mono" onClick={toggleLang}>{lang === 'en' ? 'ع' : 'EN'}</button>
          <button type="button" className="mono" onClick={toggleTheme}>{theme === 'dark' ? 'Light' : 'Dark'}</button>
        </nav>
      </header>
      <p className="lab-note">{note}</p>
      {children}
    </div>
  );
}
