(function wait() {
  const S = window.SiteEngine;
  if (!S || !S.v5) return setTimeout(wait, 20);
  if (S.v6) return;
  S.peel = function (el, done) {
    if (S.reduce || !window.gsap || !el) return done();
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const r = el.getBoundingClientRect(), s = Math.min(r.width, r.height) * 0.46;
    const box = document.createElement('span');
    box.style.cssText = 'position:absolute;right:0;bottom:0;width:0;height:0;z-index:8;pointer-events:none;filter:drop-shadow(-6px -6px 10px rgba(0,0,0,.45))';
    box.innerHTML = '<span style="position:absolute;inset:0;background:#0C0D0B;clip-path:polygon(100% 0,100% 100%,0 100%)"></span><span style="position:absolute;inset:0;background:linear-gradient(135deg,#F4EEE0 0%,#DCD2BD 65%,#B6AB92 100%);clip-path:polygon(100% 0,0 100%,0 0)"></span>';
    el.appendChild(box);
    gsap.to(box, { width: s, height: s, duration: 0.34, ease: 'power2.in', onComplete: () => { done(); setTimeout(() => box.remove(), 700); } });
  };
  if (!S.reduce) {
    S.boilMs = S.boilMs || 320;
    const jig = () => {
      if (!document.hidden && window.gsap) {
        document.querySelectorAll('[data-boil],[data-pl-ch]').forEach((el) => gsap.set(el, { x: (Math.random() - .5) * 1.1, rotation: (Math.random() - .5) * 1.3 }));
        document.querySelectorAll('[data-hero-aux],[data-pl-aux]').forEach((el) => gsap.set(el, { rotation: (Math.random() - .5) * 1.6 }));
      }
      setTimeout(jig, Math.max(60, S.boilMs));
    };
    jig();
  }
  S.bleedIn = function () {
    const root = S.root || document, pl = root.querySelector('[data-preloader]');
    const live = pl && getComputedStyle(pl).display !== 'none';
    const el = live ? pl.querySelector('[data-pl-aux]') : root.querySelector('[data-hero-aux]');
    const blur = document.getElementById('bleedBlur'), disp = document.getElementById('bleedDisp');
    if (!el || !blur || !disp || S.reduce || !window.gsap) return;
    const prev = el.style.filter; el.style.filter = 'url(#bleed)';
    const d = live ? 0.45 : 0;
    gsap.fromTo(blur, { attr: { stdDeviation: 9 } }, { attr: { stdDeviation: 0 }, duration: 1.2, delay: d, ease: 'power2.out' });
    gsap.fromTo(disp, { attr: { scale: 16 } }, { attr: { scale: 0 }, duration: 1.4, delay: d, ease: 'power2.out', onComplete: () => { el.style.filter = prev; } });
  };
  const VAR = { fadeIn: { opacity: 0, y: 20 }, blurIn: { opacity: 0, filter: 'blur(10px)' }, blurInUp: { opacity: 0, filter: 'blur(10px)', y: 20 }, blurInDown: { opacity: 0, filter: 'blur(10px)', y: -20 }, slideUp: { opacity: 0, y: 20 }, slideDown: { opacity: 0, y: -20 }, slideLeft: { opacity: 0, x: 20 }, slideRight: { opacity: 0, x: -20 }, scaleUp: { opacity: 0, scale: .5 }, scaleDown: { opacity: 0, scale: 1.5 } };
  S.textAnim = S.textAnim || { animation: 'blurInUp', by: 'character', duration: 5, delay: 0.1 };
  S.preload = function (cb) {
    const root = S.root, el = root.querySelector('[data-preloader]');
    const red = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const vis = (sel, scope) => [...(scope || root).querySelectorAll(sel)].find((x) => x.getClientRects().length > 0);
    const heroName = vis('[data-hero-name]'), heroAux = root.querySelector('[data-hero-aux]');
    const done = () => { S.loaded = true; const p = S._pending || []; S._pending = []; S._intro(p); cb && cb(); ScrollTrigger.refresh(); };
    const reveal = () => { [heroName, heroAux].forEach((h) => h && (h.style.opacity = 1)); };
    if (!el || red || S.skipPreload) { if (el) el.style.display = 'none'; reveal(); done(); return; }
    [heroName, heroAux].forEach((h) => h && (h.style.opacity = 0));
    if (S.lenis) S.lenis.stop();
    const name = vis('[data-pl-name]', el), aux = el.querySelector('[data-pl-aux]');
    const paper = el.querySelector('[data-pl-paper]'), cnt = el.querySelector('[data-count]'), bar = el.querySelector('[data-pl-bar]');
    const h1 = heroName && heroName.closest('h1');
    if (name && h1) name.style.fontSize = getComputedStyle(h1).fontSize;
    const T = S.textAnim, from = VAR[T.animation] || VAR.blurInUp, blur = 'filter' in from;
    let chars = name ? [...name.querySelectorAll('[data-pl-ch]')] : [];
    chars.forEach((c) => { if (c.parentElement) c.parentElement.style.overflow = 'visible'; });
    let groups;
    if (!chars.length && name) groups = [[name]];
    else if (T.by === 'text') groups = [chars];
    else if (T.by === 'word') { groups = [[]]; let prev = null; chars.forEach((c) => { const w = c.parentElement; if (prev && w.previousElementSibling !== prev) groups.push([]); groups[groups.length - 1].push(c); prev = w; }); }
    else groups = chars.map((c) => [c]);
    const to = { opacity: 1, y: 0, x: 0, scale: 1, duration: 0.3, ease: /scale/.test(T.animation) ? 'back.out(2.2)' : 'power1.out' };
    if (blur) { to.filter = 'blur(0px)'; to.duration = 0.4; }
    const stag = T.duration / Math.max(1, groups.length), end = T.delay + stag * (groups.length - 1) + to.duration;
    const tl = gsap.timeline(), o = { v: 0 };
    groups.forEach((g, i) => tl.fromTo(g, { ...from }, { ...to }, T.delay + i * stag));
    if (aux) { gsap.set(aux, { opacity: 0, y: 14 }); tl.to(aux, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, Math.min(0.55, end * 0.3)); }
    tl.to(o, { v: 100, duration: end + 0.1, ease: 'power2.inOut', onUpdate: () => { if (cnt) cnt.textContent = String(Math.round(o.v)).padStart(3, '0'); if (bar) bar.style.transform = 'scaleX(' + o.v / 100 + ')'; } }, 0)
      .add(() => groups.forEach((g) => gsap.set(g, { clearProps: 'filter' })), end + 0.05)
      .to(el.querySelectorAll('[data-pl-fade]'), { opacity: 0, duration: 0.3, ease: 'power2.in' }, end + 0.1)
      .add(() => {
        const fly = (a, b) => { if (!a || !b) return; const r1 = a.getBoundingClientRect(), r2 = b.getBoundingClientRect(); gsap.to(a, { x: r2.left - r1.left, y: r2.top - r1.top, scale: r1.width ? r2.width / r1.width : 1, duration: 1.05, ease: 'expo.inOut' }); };
        fly(name, heroName); fly(aux, heroAux);
      }, end + 0.25)
      .to(paper, { y: () => -(innerHeight + 80), rotation: -1.2, transformOrigin: '0% 100%', duration: 0.95, ease: 'power3.inOut' }, end + 0.25)
      .add(done, end + 0.75)
      .add(() => { reveal(); el.style.display = 'none'; if (S.lenis) S.lenis.start(); }, end + 1.32);
  };
  const P = S.preload;
  if (P) S.preload = function () { const r = P.apply(this, arguments); S.bleedIn(); return r; };
  S.lightRays = function (root, o) {
    const host = root && root.querySelector('[data-rays]');
    if (!host) return;
    const key = [o.on, o.count, o.speed].join('|');
    if (host._key === key) return;
    host._key = key;
    (host._anims || []).forEach((a) => a.cancel());
    host._anims = [];
    host.innerHTML = '';
    if (!o.on) return;
    const glow = (x, y, a, r) => { const g = document.createElement('div'); g.style.cssText = 'position:absolute;inset:0;opacity:.6;mix-blend-mode:var(--rays-blend);background:radial-gradient(circle at ' + x + '% ' + y + '%, color-mix(in srgb, var(--rays) ' + a + '%, transparent), transparent ' + r + '%)'; host.appendChild(g); };
    glow(20, 15, 45, 70); glow(80, 10, 35, 75);
    const cyc = Math.max(o.speed, 0.1);
    for (let i = 0; i < o.count; i++) {
      const left = 8 + Math.random() * 84, rot = -28 + Math.random() * 56, w = 160 + Math.random() * 160, sw = 0.8 + Math.random() * 1.8;
      const delay = Math.random() * cyc, dur = cyc * (0.75 + Math.random() * 0.5), k = 0.6 + Math.random() * 0.5;
      const r = document.createElement('div');
      r.style.cssText = 'position:absolute;top:-12%;left:' + left + '%;width:' + w + 'px;height:85vh;margin-left:' + (-w / 2) + 'px;transform-origin:top center;border-radius:999px;background:linear-gradient(to bottom, color-mix(in srgb, var(--rays) 70%, transparent), transparent);mix-blend-mode:var(--rays-blend);filter:blur(' + o.blur + 'px);opacity:0;will-change:transform,opacity;transform:rotate(' + rot + 'deg)';
      host.appendChild(r);
      if (S.reduce) { r.style.opacity = String(k * .6); continue; }
      host._anims.push(r.animate([{ opacity: 0, transform: 'rotate(' + (rot - sw) + 'deg)' }, { opacity: k, transform: 'rotate(' + (rot + sw) + 'deg)', offset: .5 }, { opacity: 0, transform: 'rotate(' + (rot - sw) + 'deg)' }], { duration: dur * 1100, delay: delay * 1000, iterations: Infinity, easing: 'ease-in-out' }));
    }
  };
  S.floatWork = function (root, on) {
    if (!root) return;
    const els = [...root.querySelectorAll('[data-float]')];
    els.forEach((el, i) => {
      if (el._fa && el._on === on) return;
      if (el._fa) { el._fa.cancel(); el._fa = null; }
      el._on = on;
      if (!on || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const dy = 10 + (i % 3) * 5, dx = 4 + (i % 2) * 4, dr = 0.8 + (i % 2) * 0.6, dir = i % 2 ? -1 : 1;
      el._fa = el.animate([
        { translate: '0px 0px', rotate: '0deg' },
        { translate: (dx * dir) + 'px ' + (-dy) + 'px', rotate: (dr * dir) + 'deg', offset: .33 },
        { translate: (-dx * dir * .6) + 'px ' + (-dy * .4) + 'px', rotate: (-dr * dir * .5) + 'deg', offset: .66 },
        { translate: '0px 0px', rotate: '0deg' }
      ], { duration: 9000 + i * 1700, delay: -i * 2300, iterations: Infinity, easing: 'ease-in-out' });
    });
    if (!S._floatPar && window.gsap) {
      S._floatPar = true;
      const st = root.querySelector('[data-float-stage]');
      if (st) st.addEventListener('pointermove', (ev) => {
        const r = st.getBoundingClientRect(), nx = (ev.clientX - r.left) / r.width - .5, ny = (ev.clientY - r.top) / r.height - .5;
        els.forEach((el, i) => { const d = 6 + i * 4; gsap.to(el, { x: -nx * d, y: -ny * d, duration: 1.2, ease: 'power3.out', overwrite: 'auto' }); });
      });
    }
  };
  S.skyFlow = function (root, on, sec) {
    if (!root) return;
    root.querySelectorAll('[data-sky-track]').forEach((t) => {
      const key = on + '|' + sec;
      if (t._sk === key) return;
      t._sk = key;
      if (t._sa) { t._sa.cancel(); t._sa = null; }
      if (!on || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const back = t.hasAttribute('data-back');
      t._sa = t.animate([{ transform: 'translate(0px,0px)' }, { transform: 'translate(-1600px,0px)' }], { duration: sec * (back ? 1.7 : 1) * 1000, iterations: Infinity, easing: 'linear' });
    });
  };
  S.v6 = true;
})();
