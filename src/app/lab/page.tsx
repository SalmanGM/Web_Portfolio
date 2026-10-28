const LABS = [
  { href: '/lab/showcase/', name: 'Showcase', body: 'Interactive assets for the work: the Mudad Payroll device film first. Add ?edit to tune each shot’s crop.' },
  { href: '/lab/motion/', name: 'Motion', body: 'Motion primitives on trial: word-by-word reveals, blur on scroll. Replay them here before they go on the page.' }
];

export default function LabIndex() {
  return (
    <main className="lab-index">
      <a href="/" className="mono lab-home">← Site</a>
      <h1 className="display">Lab</h1>
      <p className="lab-note">Sandboxes for each part of the portfolio. Nothing here is linked from the site.</p>
      <ul>
        {LABS.map((l) => (
          <li key={l.href}>
            <a href={l.href}>
              <span className="display">{l.name}</span>
              <span>{l.body}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
