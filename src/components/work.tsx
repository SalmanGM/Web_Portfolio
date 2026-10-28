'use client';
import { CHAPTERS } from '@/content/sections';
import { PROJECTS, ROLES, type RoleKey } from '@/content/projects';
import { Dune, L, Slot } from './ui';

/** Chapter ground: the chapter colour mixed into the page ground (22% on dark, 26% on light; set in CSS). */
export const chBg = (col: string) => `color-mix(in oklab, ${col} var(--ch-pct), var(--ch-base))`;

export type ChapterColors = Record<RoleKey, string>;

const role = (k: RoleKey) => ROLES.find((r) => r.k === k)!;

function PaintingWash() {
  return (
    <>
      <span aria-hidden="true" className="wash wash-grade" />
      <span aria-hidden="true" className="wash wash-tint" />
      <span data-paper="" aria-hidden="true" className="wash wash-paper" />
      <span aria-hidden="true" className="wash wash-fade" />
    </>
  );
}

export { PaintingWash };

function Tape({ side }: { side: 'a' | 'b' }) {
  return <span aria-hidden="true" className={'tape tape-' + side} />;
}

export function Work({ colors, open }: { colors: ChapterColors; open: (i: number, el: HTMLElement, peel: boolean) => void }) {
  const bgs = CHAPTERS.map((c) => chBg(colors[c.k]));
  return (
    <>
      <Dune label="Dune 1" className="dune dune-major" style={{ background: 'var(--sbg)' }} back={`color-mix(in oklab, ${bgs[0]} 50%, var(--sbg))`} front={bgs[0]} />

      <div id="work" data-screen-label="Work" className="work">
        <div className="work-head" style={{ background: bgs[0] }}>
          <span className="work-kicker"><L en="Presenting" ar="نقدّم" /></span>
          <h2 className="work-title">
            <L
              en={<>Selected work in <span className="hl-block">three</span> chapters</>}
              ar={<>أعمال مختارة في <span className="hl-block">ثلاثة</span> فصول</>}
            />
          </h2>
        </div>

        {CHAPTERS.map((c, ci) => {
          const col = colors[c.k];
          const r = role(c.k);
          const items = PROJECTS.map((p, i) => ({ p, i })).filter((x) => x.p.roles.includes(c.k));
          const next = bgs[ci + 1];
          return (
            <section key={c.k} className="chapter" style={{ background: bgs[ci] }}>
              <div className="chapter-bar mono">
                <span className="chapter-bar-l">
                  <span dir="ltr" className="num red-sm fs15">{'0' + (ci + 1)}</span>
                  <span><L en={`Chapter · ${r.en}`} ar={`الفصل · ${r.ar}`} /></span>
                </span>
                <span className="muted">
                  <L en={items.length + (items.length === 1 ? ' project' : ' projects')} ar={items.length + ' مشاريع'} />
                </span>
              </div>

              <div className="chapter-tag-anchor">
                <div className="chapter-tag">
                  <span data-slam="" className="chapter-tag-kicker">
                    <span style={{ background: col }}><L en="Get to know" ar="تعرّف على" /></span>
                  </span>
                  <span data-slam="" className="block">
                    <span className="chapter-pill" style={{ borderColor: col }}>
                      <span className="chapter-initial" style={{ background: col }}><L en={r.en.charAt(0)} ar={r.ar.charAt(0)} /></span>
                      <span className="chapter-name"><L en={r.en} ar={r.ar} /></span>
                    </span>
                  </span>
                </div>
              </div>

              <div className="painting chapter-painting">
                <div data-par="" className="painting-par">
                  <div data-kb="" className="fill">
                    {c.art === 'monet' ? (
                      <img src="/assets/monet-lilies-1906.webp" alt="" className="cover" />
                    ) : (
                      <Slot id={'chapter-' + c.k} ph={c.ph} />
                    )}
                  </div>
                </div>
                <PaintingWash />
                <div data-slam="" className="painting-credit-row">
                  <div />
                  <span className="painting-credit">{c.credit}</span>
                </div>
              </div>

              <div className="chapter-intro">
                <p data-slam="" className="chapter-line"><L en={c.line.en} ar={c.line.ar} /></p>
                <div data-slam="" className="chapter-index">
                  <span className="mono muted chapter-index-h"><L en="In this chapter" ar="في هذا الفصل" /></span>
                  {items.map(({ p, i }) => (
                    <div key={p.key} className="chapter-index-row">
                      <span dir="ltr" className="num red-sm fs15">{'0' + (i + 1)}</span>
                      <span className="fs17"><L en={p.en.title} ar={p.ar.title} /></span>
                      <span className="mono muted"><L en={p.en.client} ar={p.ar.client} /></span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chapter-items">
                {items.map(({ p, i }) => (
                  <article key={p.key} data-slam="" className="project">
                    <div className="project-media">
                      <button
                        type="button"
                        data-media={String(i)}
                        aria-label={'Open ' + p.en.title}
                        className="project-frame"
                        style={{ background: p.bg }}
                        onClick={(e) => open(i, e.currentTarget, true)}
                      >
                        <span data-tilt="" className="project-shot">
                          <Slot id={p.slot} ph={p.ph} />
                          <span data-paper="" className="fill paper-40" />
                        </span>
                        <span data-paper="" className="fill paper-50" />
                        <span data-open-label="" className="open-label">
                          <span className="serif-i"><L en={p.en.cs.beats[2].h} ar={p.ar.cs.beats[2].h} /></span>
                          <span><L en="Open ↗" ar="افتح ↖" /></span>
                        </span>
                      </button>
                      <Tape side="a" />
                      <Tape side="b" />
                    </div>
                    <div className="project-copy">
                      <span className="mono muted project-num">
                        <span dir="ltr" className="num red fs18">{'0' + (i + 1)}</span>
                        <L en={p.en.client} ar={p.ar.client} />
                      </span>
                      <h3 className="project-title"><L en={p.en.title} ar={p.ar.title} /></h3>
                      <p className="project-blurb"><L en={p.en.blurb} ar={p.ar.blurb} /></p>
                      <button
                        type="button"
                        data-uline=""
                        className="uline project-cta"
                        onClick={(e) => {
                          const m = e.currentTarget.closest('article')?.querySelector<HTMLElement>('[data-media]');
                          open(i, m || e.currentTarget, true);
                        }}
                      >
                        <L en="Read the case study →" ar="اقرأ دراسة الحالة ←" />
                        <span data-line="" className="uline-line" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {next ? (
                <Dune className="dune dune-chapter" back={`color-mix(in oklab, ${next} 50%, ${bgs[ci]})`} front={next} />
              ) : (
                <div className="chapter-end" />
              )}
            </section>
          );
        })}
      </div>

      <Dune
        label="Dune 2"
        className="dune dune-major"
        style={{ background: bgs[bgs.length - 1] }}
        back={`color-mix(in oklab, var(--sbg) 50%, ${bgs[bgs.length - 1]})`}
        front="var(--sbg)"
      />
    </>
  );
}
