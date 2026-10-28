(function wait() {
  const S = window.SiteEngine;
  if (!S || !S.scan || !S.init) return setTimeout(wait, 20);
  if (S.v2) return;
  const reduce = S.reduce;
  const base = S.scan;
  const isRtl = (el) => getComputedStyle(el).direction === 'rtl';

  S.scan = function () {
    base();
    const root = S.root; if (!root || !window.gsap) return;
    root.querySelectorAll('[data-uline]:not([data-ul])').forEach((el) => {
      el.dataset.ul = 1; const l = el.querySelector('[data-line]'); if (!l) return;
      el.addEventListener('pointerenter', () => { const r = isRtl(el); gsap.fromTo(l, { scaleX: 0, transformOrigin: r ? 'right' : 'left' }, { scaleX: 1, duration: 0.6, ease: 'expo.out' }); });
      el.addEventListener('pointerleave', () => { const r = isRtl(el); gsap.to(l, { scaleX: 0, transformOrigin: r ? 'left' : 'right', duration: 0.45, ease: 'expo.out' }); });
    });
    root.querySelectorAll('[data-sweep]:not([data-sw])').forEach((el) => {
      el.dataset.sw = 1; const f = el.querySelector('[data-fill]'), lb = el.querySelector('[data-lbl]'); if (!f) return;
      el.addEventListener('pointerenter', () => { gsap.fromTo(f, { yPercent: 101 }, { yPercent: 0, duration: 0.55, ease: 'expo.out' }); if (lb && el.dataset.sweepInk) lb.style.color = el.dataset.sweepInk; });
      el.addEventListener('pointerleave', () => { gsap.to(f, { yPercent: -101, duration: 0.5, ease: 'expo.out' }); if (lb) lb.style.color = ''; });
    });
    root.querySelectorAll('[data-media]:not([data-md])').forEach((el) => {
      el.dataset.md = 1; if (reduce) return;
      const fr = el.querySelector('[data-tilt]'), lab = el.querySelector('[data-open-label]');
      if (lab) gsap.set(lab, { yPercent: 140, opacity: 0 });
      el.addEventListener('pointerenter', () => { fr && gsap.to(fr, { scale: 1.04, duration: 0.9, ease: 'expo.out' }); lab && gsap.to(lab, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }); });
      el.addEventListener('pointerleave', () => { fr && gsap.to(fr, { scale: 1, duration: 0.9, ease: 'expo.out' }); lab && gsap.to(lab, { yPercent: 140, opacity: 0, duration: 0.45, ease: 'power2.in' }); });
    });
  };

  S.preload = function (cb) {
    const root = S.root, el = root.querySelector('[data-preloader]'), heroSeal = root.querySelector('[data-hero-seal]');
    const done = () => { S.loaded = true; const p = S._pending || []; S._pending = []; S._intro(p); cb && cb(); ScrollTrigger.refresh(); };
    if (!el || reduce || S.skipPreload) { if (el) el.style.display = 'none'; if (heroSeal) heroSeal.style.opacity = 1; done(); return; }
    if (heroSeal) heroSeal.style.opacity = 0;
    if (S.lenis) S.lenis.stop();
    const q = (s) => [...el.querySelectorAll(s)];
    const chars = q('[data-pl-ch]').filter((c) => c.offsetParent !== null);
    const cnt = el.querySelector('[data-count]'), seal = el.querySelector('[data-seal]'), ui = el.querySelector('[data-pl-ui]');
    const top = el.querySelector('[data-pl-top]'), bot = el.querySelector('[data-pl-bot]');
    const o = { v: 0 };
    if (chars.length) gsap.set(chars, { yPercent: 115 });
    const tl = gsap.timeline();
    if (chars.length) tl.to(chars, { yPercent: 0, duration: 1.25, ease: 'expo.out', stagger: 0.07 }, 0.1);
    tl.to(o, { v: 100, duration: 2.1, ease: 'power2.inOut', onUpdate: () => { if (cnt) cnt.textContent = String(Math.round(o.v)).padStart(3, '0'); } }, 0);
    if (seal) tl.fromTo(seal, { scale: 2.6, opacity: 0, rotation: -26 }, { scale: 1, opacity: 1, rotation: -6, duration: 0.32, ease: 'expo.in', onComplete: () => { S.sound.stamp(); gsap.fromTo(ui, { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,0.3)' }); } }, 1.45);
    if (chars.length) tl.to(chars, { yPercent: -115, duration: 0.7, ease: 'expo.in', stagger: 0.035 }, 2.3);
    tl.to(q('[data-pl-fade]'), { opacity: 0, duration: 0.4 }, 2.35)
      .add(() => {
        if (!seal || !heroSeal) { if (seal) gsap.to(seal, { opacity: 0, duration: 0.3 }); return; }
        const a = seal.getBoundingClientRect(), b = heroSeal.getBoundingClientRect();
        gsap.to(seal, { x: '+=' + (b.left + b.width / 2 - (a.left + a.width / 2)), y: '+=' + (b.top + b.height / 2 - (a.top + a.height / 2)), scale: heroSeal.offsetWidth / seal.offsetWidth, duration: 1.25, ease: 'expo.inOut' });
      }, 2.75)
      .to(top, { yPercent: -100, duration: 1.25, ease: 'expo.inOut' }, 2.75)
      .to(bot, { yPercent: 100, duration: 1.25, ease: 'expo.inOut' }, 2.75)
      .add(done, 3.15)
      .add(() => { if (heroSeal) heroSeal.style.opacity = 1; el.style.display = 'none'; if (S.lenis) S.lenis.start(); }, 4.02);
  };

  const lock = (on) => { if (S.lenis) on ? S.lenis.stop() : S.lenis.start(); else document.documentElement.style.overflow = on ? 'hidden' : ''; };
  const box = (r) => ({ left: r.left, top: r.top, width: r.width, height: r.height });

  S.flipOpen = function (ov, from) {
    lock(true);
    const bg = ov.querySelector('[data-cs-bg]'), wrap = ov.querySelector('[data-flip]'), inner = ov.querySelector('[data-flip-inner]'), ins = ov.querySelectorAll('[data-cs-in]');
    if (reduce || !from || !wrap || !inner || !window.gsap) return;
    const to = wrap.getBoundingClientRect();
    gsap.set(inner, { position: 'fixed', zIndex: 3, ...box(from) });
    if (ins.length) gsap.set(ins, { opacity: 0, y: 60 });
    if (bg) gsap.fromTo(bg, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' });
    gsap.to(inner, { ...box(to), duration: 1.15, ease: 'expo.inOut', onComplete: () => gsap.set(inner, { clearProps: 'position,zIndex,left,top,width,height' }) });
    if (ins.length) gsap.to(ins, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06, delay: 0.75, clearProps: 'transform' });
  };

  S.flipClose = function (ov, src, cb) {
    const fin = () => { lock(false); cb && cb(); };
    const bg = ov.querySelector('[data-cs-bg]'), inner = ov.querySelector('[data-flip-inner]'), ins = ov.querySelectorAll('[data-cs-in]');
    if (reduce || !src || !inner || !window.gsap) { fin(); return; }
    ov.style.scrollBehavior = 'auto'; ov.scrollTop = 0;
    requestAnimationFrame(() => {
      const from = inner.getBoundingClientRect(), to = src.getBoundingClientRect();
      if (ins.length) gsap.to(ins, { opacity: 0, y: 30, duration: 0.35, ease: 'power2.in' });
      gsap.set(inner, { position: 'fixed', zIndex: 3, ...box(from) });
      gsap.to(inner, { ...box(to), duration: 1, ease: 'expo.inOut', onComplete: fin });
      if (bg) gsap.to(bg, { opacity: 0, duration: 0.6, delay: 0.3, ease: 'power2.inOut' });
    });
  };

  S.v2 = true;
})();
