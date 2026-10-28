(function wait() {
  const S = window.SiteEngine;
  if (!S || !S.v4 || !S.scan) return setTimeout(wait, 20);
  if (S.v5) return;
  const mkPaper = () => { try {
    const N = 640, c = document.createElement('canvas'); c.width = c.height = N;
    const x = c.getContext('2d');
    x.fillStyle = '#808080'; x.fillRect(0, 0, N, N);
    const oct = (cell, a) => {
      const g = document.createElement('canvas'), n = Math.ceil(N / cell); g.width = g.height = n;
      const gx = g.getContext('2d'), d = gx.createImageData(n, n);
      for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (Math.random() - .5) * 255 * a; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
      gx.putImageData(d, 0, 0); x.globalAlpha = .5; x.imageSmoothingEnabled = true; x.drawImage(g, 0, 0, N, N);
    };
    oct(80, .5); oct(24, .45); oct(6, .4); x.globalAlpha = 1;
    const d = x.getImageData(0, 0, N, N);
    for (let i = 0; i < d.data.length; i += 4) { const v = (Math.random() - .5) * 38; d.data[i] += v; d.data[i + 1] += v; d.data[i + 2] += v; }
    x.putImageData(d, 0, 0);
    for (let k = 0; k < 1400; k++) {
      const px = Math.random() * N, py = Math.random() * N, a = Math.random() * Math.PI, L = 6 + Math.random() * 34;
      x.strokeStyle = Math.random() < .55 ? 'rgba(255,255,255,' + (.05 + Math.random() * .14) + ')' : 'rgba(0,0,0,' + (.04 + Math.random() * .1) + ')';
      x.lineWidth = .4 + Math.random() * .9; x.beginPath(); x.moveTo(px, py);
      x.quadraticCurveTo(px + Math.cos(a) * L * .5 + (Math.random() - .5) * 8, py + Math.sin(a) * L * .5 + (Math.random() - .5) * 8, px + Math.cos(a) * L, py + Math.sin(a) * L); x.stroke();
    }
    for (let k = 0; k < 90; k++) { x.fillStyle = 'rgba(70,50,20,' + (.04 + Math.random() * .08) + ')'; x.beginPath(); x.arc(Math.random() * N, Math.random() * N, .6 + Math.random() * 2.2, 0, 7); x.fill(); }
    c.toBlob((b) => { if (b) document.documentElement.style.setProperty('--paperimg', 'url(' + URL.createObjectURL(b) + ')'); }, 'image/png');
  } catch (e) {} };
  (window.requestIdleCallback || ((fn) => setTimeout(fn, 600)))(mkPaper);
  const base = S.scan;
  S.scan = function () {
    base();
    const root = S.root; if (!root || !window.gsap || S.reduce || !window.ScrollTrigger) return;
    root.querySelectorAll('[data-pl-speed]:not([data-plsd])').forEach((el) => {
      el.dataset.plsd = 1; const s = parseFloat(el.dataset.plSpeed) || 0; if (!s) return;
      el.style.willChange = 'transform';
      const band = el.closest('[data-sky]') || el.parentElement;
      gsap.fromTo(el, { y: -90 * s }, { y: 70 * s, ease: 'none', scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  };
  S.v5 = true;
  if (S._inited) S.scan();
})();
