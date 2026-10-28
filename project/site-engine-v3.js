(function wait() {
  const S = window.SiteEngine;
  if (!S || !S.v2 || !S.scan) return setTimeout(wait, 20);
  if (S.v3) return;
  if (window.gsap && gsap.config) gsap.config({ nullTargetWarn: false });
  const reduce = S.reduce;
  const isRtl = (el) => getComputedStyle(el).direction === 'rtl';
  const svgUrl = (s) => 'url("data:image/svg+xml;utf8,' + encodeURIComponent(s) + '")';

  const BRUSH = svgUrl("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 100' preserveAspectRatio='none'><filter id='f' x='-20%' y='-20%' width='140%' height='140%'><feTurbulence type='fractalNoise' baseFrequency='0.035 0.4' numOctaves='3' seed='7'/><feDisplacementMap in='SourceGraphic' scale='38' xChannelSelector='R' yChannelSelector='G'/></filter><rect x='-30' y='-30' width='225' height='160' fill='white' filter='url(#f)'/></svg>");
  const GRAIN = svgUrl("<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .3 0 0 0 0 .25 0 0 0 0 .18 0 0 0 .7 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>");
  const PAINT = (seed) => svgUrl("<svg xmlns='http://www.w3.org/2000/svg' width='1400' height='800'><filter id='p' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='0.0022 0.012' numOctaves='5' seed='" + seed + "'/><feColorMatrix values='0.45 0.1 0 0 0.1  0.1 0.5 0.1 0 0.26  0.1 0.15 0.5 0 0.36  0 0 0 0 1'/></filter><rect width='100%' height='100%' filter='url(#p)'/></svg>");

  const bi = S._intro;
  S._intro = (els) => { bi(els); (S._brushQ || []).splice(0).forEach((f, i) => setTimeout(f, 150 + i * 110)); };

  const base = S.scan;
  S.scan = function () {
    base();
    const root = S.root; if (!root || !window.gsap) return;
    const q = (s) => root.querySelectorAll(s);

    q('[data-brush]:not([data-bs])').forEach((el) => {
      el.dataset.bs = 1; if (reduce) return;
      const st = el.style;
      st.webkitMaskImage = st.maskImage = BRUSH; st.webkitMaskSize = st.maskSize = '300% 100%'; st.webkitMaskRepeat = st.maskRepeat = 'no-repeat';
      const o = { p: 100 }; const ap = () => { st.webkitMaskPosition = st.maskPosition = o.p + '% 0'; }; ap();
      const run = () => gsap.to(o, { p: 0, duration: 1.7, ease: 'power2.inOut', delay: +(el.dataset.delay || 0), onUpdate: ap, onComplete: () => { st.webkitMaskImage = st.maskImage = 'none'; } });
      if (el.closest('#top') && !S.loaded) (S._brushQ = S._brushQ || []).push(run);
      else ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: run });
    });

    q('[data-paper]:not([data-pp])').forEach((el) => { el.dataset.pp = 1; el.style.backgroundImage = GRAIN; el.style.backgroundSize = '220px'; });
    q('[data-paint]:not([data-pt])').forEach((el) => {
      el.dataset.pt = 1;
      const wash = 'color-mix(in oklab, var(--bg) 60%, transparent)';
      el.style.backgroundImage = 'linear-gradient(' + wash + ',' + wash + '),' + PAINT(+el.dataset.paint || 3);
      el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center';
    });

    q('[data-media]:not([data-md3])').forEach((el) => {
      el.dataset.md3 = 1; if (reduce) return;
      const sh = el.querySelectorAll('[data-shape]');
      el.addEventListener('pointerenter', () => sh.length && gsap.to(sh, { rotation: 8, scale: 1.08, duration: 1.4, ease: 'expo.out' }));
      el.addEventListener('pointerleave', () => sh.length && gsap.to(sh, { rotation: 0, scale: 1, duration: 1.2, ease: 'expo.out' }));
    });

    q('[data-hold]:not([data-hd])').forEach((el) => {
      el.dataset.hd = 1;
      const fill = el.querySelector('[data-hold-fill]'), spin = el.querySelector('[data-spin]');
      let st = 'idle', tw;
      const show = (s) => { st = s; el.querySelectorAll('[data-st]').forEach((x) => { x.style.display = x.dataset.st === s ? 'inline-flex' : 'none'; }); };
      const finish = () => {
        show('busy'); S.sound.click();
        if (spin) gsap.to(spin, { rotation: '+=720', duration: 1, ease: 'none', repeat: -1 });
        setTimeout(() => {
          try { navigator.clipboard && navigator.clipboard.writeText(el.dataset.copy || ''); } catch (e) {}
          if (spin) gsap.killTweensOf(spin);
          show('done'); S.sound.tick();
          gsap.fromTo(el, { scale: 0.95 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1,0.4)' });
          setTimeout(() => { show('idle'); gsap.to(fill, { scaleX: 0, duration: 0.5, ease: 'expo.out' }); }, 1800);
        }, 650);
      };
      const start = (e) => { if (st !== 'idle' || (e.button && e.button > 0)) return; show('hold'); tw = gsap.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power1.in', onComplete: finish }); };
      const cancel = () => { if (st !== 'hold') return; tw && tw.kill(); gsap.to(fill, { scaleX: 0, duration: 0.35, ease: 'expo.out' }); show('idle'); };
      el.addEventListener('pointerdown', start);
      ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => el.addEventListener(ev, cancel));
      el.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && st === 'idle') { e.preventDefault(); gsap.set(fill, { scaleX: 1 }); finish(); } });
      el.addEventListener('contextmenu', (e) => e.preventDefault());
    });

    q('[data-swipe]:not([data-sp])').forEach((el) => {
      el.dataset.sp = 1;
      const front = el.querySelector('[data-swipe-front]'), content = el.querySelector('[data-swipe-content]');
      if (!front) return;
      let down = false, drag = false, sx = 0, sy = 0, x = 0, b = 0;
      const max = () => (content ? content.offsetWidth : 200) + 48;
      const dir = () => (isRtl(el) ? 1 : -1);
      const set = (v, anim) => { x = v; anim ? gsap.to(front, { x: v, duration: 0.65, ease: 'expo.out' }) : gsap.set(front, { x: v }); };
      front.addEventListener('pointerdown', (e) => { if (e.button > 0) return; down = true; drag = false; sx = e.clientX; sy = e.clientY; b = x; });
      addEventListener('pointermove', (e) => {
        if (!down) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (!drag) { if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { drag = true; front.style.cursor = 'grabbing'; } else if (Math.abs(dy) > 10) { down = false; return; } else return; }
        const m = max() * 1.08; let v = b + dx;
        v = dir() < 0 ? Math.max(-m, Math.min(0, v)) : Math.min(m, Math.max(0, v));
        set(v);
      });
      addEventListener('pointerup', () => {
        if (!down) return; down = false; front.style.cursor = '';
        const m = max(), d = dir();
        if (!drag) set(Math.abs(x) > 4 ? 0 : d * m, true);
        else set(Math.abs(x) > m * 0.4 ? d * m : 0, true);
        S.sound.tick();
      });
      front.addEventListener('pointerenter', () => { if (!reduce && Math.abs(x) < 1) gsap.to(front, { x: dir() * 14, duration: 0.5, ease: 'expo.out' }); });
      front.addEventListener('pointerleave', () => { if (!down && Math.abs(x) < 1) gsap.to(front, { x: 0, duration: 0.5, ease: 'expo.out' }); });
    });

    const cv = root.querySelector('[data-stars]');
    if (cv && !cv._st) S.stars(cv);
  };

  S.stars = function (cv) {
    cv._st = 1;
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, dpr = Math.min(devicePixelRatio || 1, 1.5);
    const N = 240, stars = [];
    for (let i = 0; i < N; i++) stars.push({ x: Math.random(), y: Math.random(), r: 0.35 + Math.pow(Math.random(), 3) * 1.4, ph: Math.random() * 6.28, sp: 0.4 + Math.random() * 1.6, d: 0.2 + Math.random() * 0.8 });
    const size = () => { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); addEventListener('resize', size);
    let t = Math.random() * 40, last = performance.now();
    const draw = (now) => {
      if (!cv.isConnected) return;
      requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (document.hidden) return;
      t += reduce ? 0 : dt;
      const dark = document.documentElement.dataset.theme === 'dark';
      const col = dark ? '236,230,214' : '26,44,70';
      const base = dark ? 0.55 : 0.28;
      ctx.clearRect(0, 0, W, H);
      const sc = scrollY;
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        for (let x = -20; x <= W + 20; x += 18) {
          const y = H * (0.22 + 0.28 * i) + Math.sin(x * 0.0024 + t * 0.07 + i * 2.1) * 70 + Math.sin(x * 0.0061 - t * 0.05 + i) * 22 - ((sc * 0.03 * (i + 1)) % H);
          x < 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(' + col + ',' + (dark ? 0.07 : 0.05) + ')';
        ctx.stroke();
      }
      for (const s of stars) {
        let y = (s.y * H - sc * 0.05 * s.d) % H; if (y < 0) y += H;
        const a = base * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph)));
        ctx.fillStyle = 'rgba(' + col + ',' + a.toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(s.x * W, y, s.r, 0, 6.283); ctx.fill();
        if (s.r > 1.35) { ctx.fillStyle = 'rgba(' + col + ',' + (a * 0.25).toFixed(3) + ')'; ctx.fillRect(s.x * W - s.r * 3, y - 0.3, s.r * 6, 0.6); ctx.fillRect(s.x * W - 0.3, y - s.r * 3, 0.6, s.r * 6); }
      }
    };
    requestAnimationFrame(draw);
  };

  const tick = () => {
    let s = '';
    try { s = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Riyadh', hour12: false }); } catch (e) { s = new Date().toTimeString().slice(0, 8); }
    document.querySelectorAll('[data-clock]').forEach((el) => { el.textContent = s; });
  };
  setInterval(tick, 1000); tick();

  S.preload = function (cb) {
    const root = S.root, el = root.querySelector('[data-preloader]');
    const vis = (sel, scope) => [...(scope || root).querySelectorAll(sel)].find((x) => x.getClientRects().length > 0);
    const heroName = vis('[data-hero-name]'), heroAux = root.querySelector('[data-hero-aux]');
    const done = () => { S.loaded = true; const p = S._pending || []; S._pending = []; S._intro(p); cb && cb(); ScrollTrigger.refresh(); };
    const reveal = () => { [heroName, heroAux].forEach((h) => h && (h.style.opacity = 1)); };
    if (!el || reduce || S.skipPreload) { if (el) el.style.display = 'none'; reveal(); done(); return; }
    [heroName, heroAux].forEach((h) => h && (h.style.opacity = 0));
    if (S.lenis) S.lenis.stop();
    const name = vis('[data-pl-name]', el), aux = el.querySelector('[data-pl-aux]');
    const paper = el.querySelector('[data-pl-paper]'), cnt = el.querySelector('[data-count]'), bar = el.querySelector('[data-pl-bar]');
    const h1 = heroName && heroName.closest('h1');
    if (name && h1) name.style.fontSize = getComputedStyle(h1).fontSize;
    const chars = name ? [...name.querySelectorAll('[data-pl-ch]')] : [];
    const o = { v: 0 };
    gsap.set(chars, { yPercent: 118 });
    if (aux) gsap.set(aux, { opacity: 0, y: 14 });
    const tl = gsap.timeline();
    tl.to(chars, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.035 }, 0.1)
      .to(aux, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0.55)
      .to(o, { v: 100, duration: 1.7, ease: 'power2.inOut', onUpdate: () => { if (cnt) cnt.textContent = String(Math.round(o.v)).padStart(3, '0'); if (bar) bar.style.transform = 'scaleX(' + o.v / 100 + ')'; } }, 0)
      .to(el.querySelectorAll('[data-pl-fade]'), { opacity: 0, duration: 0.3, ease: 'power2.in' }, 1.8)
      .add(() => {
        const fly = (a, b) => {
          if (!a || !b) return;
          const r1 = a.getBoundingClientRect(), r2 = b.getBoundingClientRect();
          gsap.to(a, { x: r2.left - r1.left, y: r2.top - r1.top, scale: r1.width ? r2.width / r1.width : 1, duration: 1.05, ease: 'expo.inOut' });
        };
        fly(name, heroName); fly(aux, heroAux);
        S.sound.click();
      }, 1.95)
      .to(paper, { y: () => -(innerHeight + 80), rotation: -1.2, transformOrigin: '0% 100%', duration: 0.95, ease: 'power3.inOut' }, 1.95)
      .add(done, 2.45)
      .add(() => { reveal(); el.style.display = 'none'; if (S.lenis) S.lenis.start(); }, 3.02);
  };

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { S.fit && S.fit(); window.ScrollTrigger && ScrollTrigger.refresh(); });
  S.v3 = true;
})();
