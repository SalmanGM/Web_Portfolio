'use client';
import { useEffect, useState } from 'react';
import { DeviceFilm, type FilmTransition } from '@/components/lab/device-film';
import { LabShell } from '@/components/lab/lab-shell';
import { SplitWords } from '@/components/lab/split-words';
import { L } from '@/components/ui';

export function ShowcaseLab() {
  const [edit, setEdit] = useState(false);
  const [mode, setMode] = useState<FilmTransition>('blur');
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    setEdit(q.has('edit'));
    if (q.get('t') === 'handoff') setMode('handoff');
  }, []);
  const pick = (m: FilmTransition) => {
    setMode(m);
    const url = new URL(location.href);
    if (m === 'handoff') url.searchParams.set('t', 'handoff'); else url.searchParams.delete('t');
    history.replaceState(null, '', url);
  };
  return (
    <LabShell
      title="Showcase"
      note={edit
        ? 'Crop editor on: scroll to a shot, drag the sliders, then “Copy all crops” and send them to Claude (or paste into src/content/film.ts).'
        : 'Device film. Switch how it moves between boards: Blur (the first draft) or Handoff (the AccessGrid four beats: tap pulse, blur out, empty outline, new screen fills). Add ?edit to tune each shot’s crop.'}
    >
      <section className="lab-intro">
        <span className="mono red-sm"><L en="Case study · Mudad Payroll" ar="دراسة حالة · رواتب مُدد" /></span>
        <h2 className="display lab-h">
          <span lang="en"><SplitWords text="Payday, without the guessing." step={0.06} /></span>
          <span lang="ar"><SplitWords text="يوم الرواتب، بلا تخمين." step={0.06} /></span>
        </h2>
        <p data-blur="" className="lab-p">
          <L
            en="Eleven screens from the payroll squad, in the order a company meets them: the new design system, Autopayroll, warnings before you submit, and money before payday."
            ar="إحدى عشرة شاشة من فريق الرواتب، بالترتيب الذي تمر به المنشأة: نظام التصميم الجديد، والرواتب التلقائية، والتنبيه قبل الإرسال، والمال قبل يوم الرواتب."
          />
        </p>
        <div className="film-mode mono" role="group" aria-label="Transition between boards">
          {(['blur', 'handoff'] as const).map((m) => (
            <button key={m} type="button" className={mode === m ? 'on' : ''} aria-pressed={mode === m} onClick={() => pick(m)}>
              {m === 'blur' ? 'A · Blur' : 'B · Handoff'}
            </button>
          ))}
        </div>
        <span className="mono muted lab-scroll"><L en="Scroll ↓" ar="مرّر ↓" /></span>
      </section>
      <DeviceFilm editable={edit} transition={mode} />
      <section className="lab-outro">
        <p data-blur="" className="lab-p">
          <L en="End of the film. Next in this lab: hotspots and the clickable Autopayroll rebuild." ar="نهاية الفيلم. التالي هنا: النقاط التوضيحية وإعادة بناء الرواتب التلقائية القابلة للنقر." />
        </p>
      </section>
    </LabShell>
  );
}
