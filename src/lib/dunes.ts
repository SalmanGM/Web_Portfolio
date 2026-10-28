// Two-layer dune silhouettes shared by every section divider (viewBox 0 0 1600 400).
const q = (v: number) => v.toFixed(1);

function dune(base: number, amp: number, ph: number) {
  let p = 'M0 400 ';
  for (let x = 0; x <= 1600; x += 16) {
    p += 'L' + x + ' ' + q(base + amp * (Math.sin(x / 260 + ph) * 0.6 + Math.sin(x / 97 + ph * 2) * 0.3)) + ' ';
  }
  return p + 'L1600 400 Z';
}

export const DUNE_BACK = dune(170, 70, 1);
export const DUNE_FRONT = dune(260, 55, 3);
