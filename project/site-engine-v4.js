(function wait() {
  const S = window.SiteEngine;
  if (!S || !S.v3 || !S.scan) return setTimeout(wait, 20);
  if (S.v4) return;
  const base = S.scan;
  S.scan = function () {
    base();
    const root = S.root; if (!root || !window.gsap) return;
    const q = (s) => root.querySelectorAll(s);
    q('[data-kb]:not([data-kbd])').forEach((el) => {
      el.dataset.kbd = 1; if (S.reduce) return;
      gsap.fromTo(el, { scale: 1.06, xPercent: -1.5 }, { scale: 1.15, xPercent: 1.5, duration: 24 + Math.random() * 8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
    q('[data-par]:not([data-pard])').forEach((el) => {
      el.dataset.pard = 1; if (S.reduce || !window.ScrollTrigger) return;
      gsap.fromTo(el, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    q('[data-slam]:not([data-slm])').forEach((el) => {
      el.dataset.slm = 1; if (S.reduce || !window.ScrollTrigger) return;
      gsap.fromTo(el, { y: 90, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
  };
  S.v4 = true;
  if (S._inited) S.scan();
})();
