'use client';
import { LabShell } from '@/components/lab/lab-shell';
import { SplitWords } from '@/components/lab/split-words';
import { StoryPlayer } from '@/components/lab/story-player';
import { L } from '@/components/ui';

export function StoryLab() {
  return (
    <LabShell
      title="Story"
      note="Option A for the Mudad case study hero: a story player, after the AccessGrid stage. Tabs pick a thread, captions are the timeline; click any caption to jump. The UI is illustrated, and the rates and amounts are placeholders."
    >
      <section className="lab-story">
        <span className="mono red-sm"><L en="Case study · Mudad Payroll" ar="دراسة حالة · رواتب مُدد" /></span>
        <h2 className="display lab-h">
          <span lang="en"><SplitWords text="Payday, without the guessing." step={0.06} /></span>
          <span lang="ar"><SplitWords text="يوم الرواتب، بلا تخمين." step={0.06} /></span>
        </h2>
        <StoryPlayer />
      </section>
    </LabShell>
  );
}
