(function () {
  if (window.SiteEngine && window.SiteEngine._base) return;
  const S = (window.SiteEngine = window.SiteEngine || {});
  S._base = true;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  S.reduce = reduce;
  S.ready = () => !!(window.gsap && window.ScrollTrigger && window.Lenis);
  S.loaded = false;
  S.mouse = { x: 0.5, y: 0.5, cx: innerWidth / 2, cy: innerHeight / 2 };
  addEventListener('pointermove', (e) => { S.mouse.cx = e.clientX; S.mouse.cy = e.clientY; }, { passive: true });

  S.init = function (root, o = {}) {
    S.root = root;
    if (S._inited) { S.scan(); return; }
    S._inited = true;
    gsap.registerPlugin(ScrollTrigger);
    if (!reduce) {
      const lenis = (S.lenis = new Lenis({ lerp: 0.085 }));
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    root.addEventListener('pointerover', (e) => {
      const t = e.target.closest && e.target.closest('[data-sfx]');
      if (t && t !== S._sfx) { S._sfx = t; S.sound.tick(); }
      if (!t) S._sfx = null;
    });
    root.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('button,a')) S.sound.click(); });
    let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { S.fit(); ScrollTrigger.refresh(); }, 150); });
    S.scan();
    const refit = () => { S.fit(); window.ScrollTrigger && ScrollTrigger.refresh(); };
    if (document.fonts) document.fonts.addEventListener('loadingdone', refit);
    const fr = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]) : Promise.resolve();
    fr.then(() => { S.fit(); S.preload(o.onReady); window.ScrollTrigger && ScrollTrigger.refresh(); });
  };

  S.scrollTo = (target) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    if (S.lenis) S.lenis.scrollTo(el, { offset: 0, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: 'smooth' });
  };

  S.fit = function () {
    if (!S.root) return;
    S.root.querySelectorAll('[data-fit]').forEach((el) => {
      const kid = [...el.children].find((k) => k.offsetWidth > 0);
      if (!kid) return;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      const w = el.clientWidth;
      if (kid.offsetWidth > 0 && w > 0) el.style.fontSize = (fs * w / kid.offsetWidth) * 0.995 + 'px';
    });
  };

  S.scan = function () {
    const root = S.root; if (!root || !window.gsap) return;
    S.fit();
    const q = (s) => root.querySelectorAll(s);
    q('[data-reveal]:not([data-rv])').forEach((el) => {
      el.dataset.rv = 1; if (reduce) return;
      gsap.fromTo(el, { y: 56, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, ease: 'expo.out', delay: +(el.dataset.delay || 0), scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    q('[data-mask]:not([data-rv])').forEach((el) => {
      el.dataset.rv = 1; if (reduce) return;
      gsap.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    q('[data-draw]:not([data-rv])').forEach((p) => {
      p.dataset.rv = 1;
      const L = p.getTotalLength ? p.getTotalLength() : 1000;
      if (reduce) return;
      p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
      gsap.to(p, { strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut', delay: +(p.dataset.delay || 0), scrollTrigger: { trigger: p.ownerSVGElement || p, start: 'top 95%', once: true } });
    });
    q('[data-speed]:not([data-rv])').forEach((el) => {
      el.dataset.rv = 1; if (reduce) return;
      gsap.to(el, { yPercent: -(+el.dataset.speed) * 12, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    q('[data-intro]:not([data-rv])').forEach((el) => {
      el.dataset.rv = 1; if (reduce) return;
      gsap.set(el, { yPercent: 115 });
      if (S.loaded) S._intro([el]); else (S._pending = S._pending || []).push(el);
    });
    q('[data-tilt]:not([data-tl])').forEach((el) => {
      el.dataset.tl = 1; if (reduce) return;
      const host = el.closest('[data-tilt-host]') || el.parentElement;
      gsap.set(el, { transformPerspective: 1400 });
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.9, ease: 'power3' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.9, ease: 'power3' });
      host.addEventListener('pointermove', (e) => {
        const r = host.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 12);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 9);
      });
      host.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
    q('[data-magnetic]:not([data-mg])').forEach((el) => {
      el.dataset.mg = 1; if (reduce) return;
      const qx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
      const qy = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
      el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * 0.28); qy((e.clientY - r.top - r.height / 2) * 0.4); });
      el.addEventListener('pointerleave', () => { qx(0); qy(0); });
    });
    q('[data-ripple]:not([data-rp])').forEach((el) => {
      el.dataset.rp = 1; if (reduce) return;
      const host = el.closest('[data-tilt-host]') || el;
      host.addEventListener('pointerenter', () => S.rippleOn(el));
      host.addEventListener('pointerleave', () => S.rippleOff(el));
    });
    q('[data-pan]:not([data-pn])').forEach((el) => {
      el.dataset.pn = 1;
      const host = el.closest('[data-tilt-host]') || el.parentElement;
      const k = +el.dataset.pan || 1.7;
      host.addEventListener('pointerenter', () => gsap.to(el, { yPercent: -(1 - 1 / k) * 100, duration: 5, ease: 'power1.inOut' }));
      host.addEventListener('pointerleave', () => gsap.to(el, { yPercent: 0, duration: 1.4, ease: 'expo.out' }));
    });
    q('[data-marquee]').forEach(S.marquee);
    q('[data-carousel]').forEach((t) => S.carousel(t, root.querySelector('[data-counter]'), root.querySelector('[data-progress]')));
  };

  S._intro = (els) => gsap.to(els, { yPercent: 0, duration: 1.5, ease: 'expo.out', stagger: 0.07 });

  S.preload = function (cb) {
    const el = S.root.querySelector('[data-preloader]');
    const done = () => { S.loaded = true; const p = S._pending || []; S._pending = []; S._intro(p); cb && cb(); ScrollTrigger.refresh(); };
    if (!el || reduce) { if (el) el.style.display = 'none'; done(); return; }
    const cnt = el.querySelector('[data-count]'), seal = el.querySelector('[data-seal]');
    const o = { v: 0 };
    const tl = gsap.timeline();
    tl.to(o, { v: 100, duration: 1.9, ease: 'power2.inOut', onUpdate: () => { if (cnt) cnt.textContent = String(Math.round(o.v)).padStart(3, '0'); } }, 0);
    if (seal) tl.fromTo(seal, { scale: 2.4, opacity: 0, rotation: -22 }, { scale: 1, opacity: 1, rotation: -6, duration: 0.34, ease: 'expo.in', onComplete: () => { S.sound.stamp(); gsap.fromTo(el, { x: -4 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,0.3)' }); } }, 1.0);
    tl.fromTo(el, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.15, ease: 'expo.inOut' }, '+=0.35');
    tl.add(done, '-=0.55');
    tl.add(() => { el.style.display = 'none'; });
  };

  S.marquee = function (el) {
    if (el._mq) return; el._mq = 1;
    let x = 0, v = 1;
    el.addEventListener('pointerenter', () => (el._h = true));
    el.addEventListener('pointerleave', () => (el._h = false));
    gsap.ticker.add((t, dt) => {
      if (!el.isConnected) return;
      const half = el.scrollWidth / 2; if (!half) return;
      const vel = S.lenis ? Math.abs(S.lenis.velocity || 0) : 0;
      const target = (el._h ? 0.2 : 1) + Math.min(vel * 0.06, 5);
      v += (target - v) * 0.06;
      x -= (reduce ? 0 : 46) * v * dt / 1000;
      if (-x >= half) x += half;
      el.style.transform = `translate3d(${x}px,0,0)`;
    });
  };

  S.carousel = function (track, counter, bar) {
    if (track._cr) return; track._cr = 1;
    const upd = () => {
      const max = track.scrollWidth - track.clientWidth;
      const p = max > 0 ? Math.min(1, Math.abs(track.scrollLeft) / max) : 0;
      const b = S.root.querySelector('[data-progress]');
      if (b) b.style.transform = `scaleX(${0.25 + p * 0.75})`;
      const n = track.children.length;
      const c = S.root.querySelector('[data-counter]');
      if (c) c.textContent = String(Math.min(n, Math.round(p * (n - 1)) + 1)).padStart(2, '0');
    };
    track.addEventListener('scroll', upd, { passive: true }); upd();
    let down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; sx = e.clientX; sl = track.scrollLeft;
    });
    addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 6) { moved = true; track.style.scrollSnapType = 'none'; track.style.cursor = 'grabbing'; }
      if (moved) track.scrollLeft = sl - dx;
    });
    addEventListener('pointerup', () => {
      if (!down) return; down = false;
      track.style.cursor = 'grab';
      if (moved) {
        const cards = [...track.children]; const tr = track.getBoundingClientRect();
        const rtl = getComputedStyle(track).direction === 'rtl';
        let best = cards[0], bd = 1e9;
        cards.forEach((c) => { const r = c.getBoundingClientRect(); const d = Math.abs(rtl ? tr.right - r.right : r.left - tr.left); if (d < bd) { bd = d; best = c; } });
        const r = best.getBoundingClientRect();
        const pad = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
        const delta = rtl ? (r.right - (tr.right - pad)) : (r.left - (tr.left + pad));
        track.scrollBy({ left: delta, behavior: 'smooth' });
        setTimeout(() => { track.style.scrollSnapType = 'x mandatory'; }, 600);
      }
    });
    track.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  };

  S.rippleOn = function (el) {
    const map = document.getElementById('rippleMap'), turb = document.getElementById('rippleTurb');
    if (!map) return;
    if (S._rEl && S._rEl !== el) S._rEl.style.filter = '';
    S._rEl = el; el.style.filter = 'url(#ripple)';
    const o = (S._ro = S._ro || { s: 0 });
    gsap.killTweensOf(o);
    gsap.timeline().to(o, { s: 42, duration: 0.45, ease: 'power2.out', onUpdate: () => map.setAttribute('scale', o.s) })
      .to(o, { s: 0, duration: 1.8, ease: 'power3.out', onUpdate: () => map.setAttribute('scale', o.s) });
    if (S._rt) S._rt.kill();
    const f = { v: 0 };
    S._rt = gsap.to(f, { v: 1, duration: 2.4, repeat: -1, ease: 'none', onUpdate: () => turb.setAttribute('baseFrequency', `${(0.011 + Math.sin(f.v * 6.283) * 0.003).toFixed(4)} ${(0.028 + Math.cos(f.v * 6.283) * 0.006).toFixed(4)}`) });
  };
  S.rippleOff = function (el) {
    const map = document.getElementById('rippleMap'); if (!map) return;
    const o = (S._ro = S._ro || { s: 0 });
    gsap.killTweensOf(o);
    gsap.to(o, { s: 0, duration: 0.6, ease: 'power2.out', onUpdate: () => map.setAttribute('scale', o.s), onComplete: () => { if (S._rEl === el) { el.style.filter = ''; S._rEl = null; if (S._rt) S._rt.kill(); } } });
  };

  S.overlayIn = function (el, x, y) {
    if (S.lenis) S.lenis.stop(); else document.documentElement.style.overflow = 'hidden';
    if (reduce) return;
    const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    gsap.fromTo(el, { clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${R}px at ${x}px ${y}px)`, duration: 1.1, ease: 'expo.inOut', onComplete: () => { el.style.clipPath = 'none'; } });
    S.csStagger(el, 0.45);
  };
  S.csStagger = function (el, delay = 0) {
    if (reduce) return;
    gsap.fromTo(el.querySelectorAll('[data-cs-in]'), { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: 0.06, delay, clearProps: 'transform' });
  };
  S.overlayOut = function (el, cb) {
    const fin = () => { if (S.lenis) S.lenis.start(); else document.documentElement.style.overflow = ''; cb && cb(); };
    if (reduce) { fin(); return; }
    gsap.fromTo(el, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85, ease: 'expo.inOut', onComplete: fin });
  };

  S.themeTransition = function (x, y, apply) {
    if (!document.startViewTransition || reduce) { apply(); return; }
    const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(() => apply());
    vt.ready.then(() => {
      document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] }, { duration: 950, easing: 'cubic-bezier(.76,0,.24,1)', pseudoElement: '::view-transition-new(root)' });
    }).catch(() => {});
  };

  S.bars = function (el, on) {
    if (!el || !window.gsap) return;
    const bars = el.children;
    gsap.killTweensOf(bars);
    if (on) [...bars].forEach((b, i) => gsap.fromTo(b, { scaleY: 0.3 }, { scaleY: 1, duration: 0.35 + i * 0.09, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.07 }));
    else gsap.to(bars, { scaleY: 0.3, duration: 0.3 });
  };

  S.sound = (function () {
    let ctx, master, on = false;
    function build() {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
      const len = ctx.sampleRate * 4, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; b0 = 0.99765 * b0 + w * 0.099046; b1 = 0.963 * b1 + w * 0.2965; b2 = 0.57 * b2 + w * 1.0526; d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.11; }
      const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 480; lp.Q.value = 0.8;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07; const lg = ctx.createGain(); lg.gain.value = 240; lfo.connect(lg).connect(lp.frequency);
      const ng = ctx.createGain(); ng.gain.value = 0.2; src.connect(lp).connect(ng).connect(master); src.start(); lfo.start();
      const pf = ctx.createBiquadFilter(); pf.type = 'lowpass'; pf.frequency.value = 850;
      const pg = ctx.createGain(); pg.gain.value = 0.045; pf.connect(pg).connect(master);
      [146.83, 220, 277.18, 329.63].forEach((f, i) => {
        const o = ctx.createOscillator(); o.type = i % 2 ? 'triangle' : 'sine'; o.frequency.value = f;
        const g = ctx.createGain(); g.gain.value = 0.22;
        const l = ctx.createOscillator(); l.frequency.value = 0.04 + i * 0.027; const l2 = ctx.createGain(); l2.gain.value = 0.18; l.connect(l2).connect(g.gain);
        o.connect(g).connect(pf); o.start(); l.start();
      });
    }
    function blip(f1, f2, dur, vol, type) {
      if (!on || !ctx) return;
      const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || 'sine'; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + 0.03);
    }
    return {
      get on() { return on; },
      toggle() {
        if (!ctx) build();
        on = !on; ctx.resume();
        const t = ctx.currentTime;
        master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t);
        master.gain.linearRampToValueAtTime(on ? 0.6 : 0, t + (on ? 1.8 : 0.5));
        if (on) blip(660, 990, 0.14, 0.05);
        return on;
      },
      tick() { blip(1900, 1300, 0.035, 0.02); },
      click() { blip(540, 270, 0.09, 0.05, 'triangle'); },
      stamp() { blip(150, 42, 0.28, 0.3); }
    };
  })();

  // ---------- Three.js shaders ----------
  const VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`;
  const FS = `
precision highp float;
uniform float uTime, uScroll, uTheme, uMode;
uniform vec2 uRes, uMouse;
uniform vec3 uRipple;
varying vec2 vUv;
float h21(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
vec2 h22(vec2 p){ float n = h21(p); return vec2(n, h21(p+n)); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),u.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),u.x), u.y); }
float fbm(vec2 p){ float v=0., a=.5; mat2 m=mat2(1.6,1.2,-1.2,1.6); for(int i=0;i<5;i++){ v+=a*noise(p); p=m*p; a*=.5; } return v; }
float caustic(vec2 uv, float t){
  vec2 p = mod(uv*6.2831, 6.2831) - 250.; vec2 i = p; float c = 1.; float inten = .005;
  for(int n=0;n<4;n++){ float tt = t*(1.-(3.5/float(n+1)));
    i = p + vec2(cos(tt-i.x)+sin(tt+i.y), sin(tt-i.y)+cos(tt+i.x));
    c += 1./length(vec2(p.x/(sin(i.x+tt)/inten), p.y/(cos(i.y+tt)/inten))); }
  c /= 4.; c = 1.17 - pow(c, 1.4); return clamp(pow(abs(c), 8.), 0., 1.);
}
vec3 lilies(vec2 p, float t, float squash){
  vec2 ip=floor(p), fp=fract(p); float pad=0., flw=0., sh=0.;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec2 g=vec2(float(x),float(y)); vec2 o=h22(ip+g); vec2 s=h22(ip+g+7.31);
    if(s.y<.42) continue;
    vec2 c = g + .22 + o*.56 + .035*vec2(sin(t*.3+o.x*6.), cos(t*.25+o.y*6.)) - fp;
    vec2 q = c*vec2(1., squash);
    float r = .15 + .15*s.x; float d = length(q);
    float ang = atan(q.y, q.x);
    float wedge = smoothstep(.22, 0., abs(mod(ang - o.x*6.2832 + 3.1416, 6.2832) - 3.1416));
    float m = smoothstep(r, r-.02, d) * (1. - wedge*smoothstep(r*.15, r*.45, d));
    pad = max(pad, m); sh = max(sh, m*(1.-d/r));
    if(s.x>.68) flw = max(flw, smoothstep(.055, .028, length(q - vec2(r*.25, -r*.12))));
  }
  return vec3(pad, flw, sh);
}
float rays(vec2 uv, float t){
  vec2 src = vec2(.5 + .18*sin(t*.06), 1.35);
  vec2 d = uv - src; d.x *= uRes.x/uRes.y;
  float a = atan(d.x, -d.y);
  float r = noise(vec2(a*9., t*.12))*.6 + noise(vec2(a*23., -t*.18))*.4;
  r = smoothstep(.38, 1., r);
  return r * smoothstep(1.9, .15, length(d));
}
vec2 splash(vec2 p, vec2 asp, float t){
  float rt = t - uRipple.z;
  if(rt < 0. || rt > 5.) return vec2(0.);
  vec2 c = uRipple.xy*asp; vec2 dv = p - c; float rd = length(dv);
  float w = sin(rd*38. - rt*10.) * exp(-rt*.9) * exp(-abs(rd - rt*.32)*9.);
  return dv/max(rd,.001) * w * .018;
}
vec3 paintA(vec2 uv, float t, float th){
  vec2 asp = vec2(uRes.x/uRes.y, 1.); vec2 p = uv*asp;
  vec2 m = uMouse*asp; float md = length(p-m);
  p += (p-m)/max(md,.001) * sin(md*34. - t*3.2) * .005 * exp(-md*5.);
  p += splash(p, asp, t);
  float bs = noise(vec2(p.x*3., p.y*42.));
  vec2 w = vec2(fbm(p*1.6 + vec2(0., t*.035)), fbm(p*1.6 + vec2(5.2,1.3) - t*.028));
  vec2 pp = p + w*.35 + (bs-.5)*vec2(.018,.006);
  float n = fbm(pp*2.2);
  vec3 deep = mix(vec3(.17,.31,.43), vec3(.04,.09,.13), th);
  vec3 lav  = mix(vec3(.63,.66,.83), vec3(.19,.22,.36), th);
  vec3 teal = mix(vec3(.34,.57,.53), vec3(.08,.25,.24), th);
  vec3 sky  = mix(vec3(.95,.91,.80), vec3(.62,.58,.46), th);
  vec3 col = mix(deep, lav, smoothstep(.28, .76, n));
  col = mix(col, teal, smoothstep(.45, .82, w.x)*.7);
  float streak = smoothstep(.6, .95, noise(vec2(pp.x*4.5 + pp.y*.8, pp.y*1.4 + t*.05)));
  col = mix(col, sky, streak*.42*(1.-th*.35));
  vec3 L = lilies(pp*3.1 + vec2(0., t*.012), t, 1.75);
  vec3 padc = mix(vec3(.23,.41,.23), vec3(.45,.60,.31), fbm(pp*9.));
  padc = mix(padc, vec3(.07,.15,.11), th*.6);
  col = mix(col, padc*(.78 + .45*L.z), L.x);
  vec3 flc = mix(vec3(.93,.52,.58), vec3(.99,.86,.82), noise(pp*40.));
  col = mix(col, mix(flc, flc*.7, th), L.y);
  float stk = noise(vec2(p.x*8. + w.y*4., p.y*95.));
  col *= .95 + .1*stk;
  col += rays(uv, t)*.13*(1.-th*.4)*vec3(1.,.97,.86);
  return col;
}
vec3 paintB(vec2 uv, float t, float th){
  vec2 asp = vec2(uRes.x/uRes.y, 1.); vec2 p = uv*asp;
  p += splash(p, asp, t);
  float depth = clamp(uScroll*.35, 0., 1.);
  vec3 top = mix(vec3(.80,.89,.84), vec3(.09,.29,.29), th);
  vec3 bot = mix(vec3(.66,.79,.76), vec3(.015,.05,.06), th);
  vec3 col = mix(bot, top, pow(uv.y, 1.25));
  col = mix(col, col*mix(.86, .45, th), depth);
  vec2 w = vec2(fbm(p*1.2 + t*.03), fbm(p*1.2 + 4. - t*.02));
  col = mix(col, mix(vec3(.55,.74,.70), vec3(.05,.20,.22), th), smoothstep(.4, .82, fbm(p*1.5 + w))*.35);
  float c = caustic(p*.5 + w*.15, t*.32);
  col += c*mix(.22, .34, th)*mix(vec3(1.,1.,.95), vec3(.62,.96,.86), th)*(1.-depth*.7)*smoothstep(0., .95, uv.y);
  float rr = rays(uv, t);
  col += rr*mix(.20, .30, th)*mix(vec3(1.,.98,.9), vec3(.72,1.,.9), th)*(1.-depth*.5);
  vec3 L = lilies(vec2(p.x*2.1 + t*.015, uv.y*3.2), t, 1.9);
  float near = smoothstep(.62, .98, uv.y);
  vec3 padc = mix(vec3(.30,.45,.33), vec3(.015,.06,.045), th);
  col = mix(col, padc + L.z*mix(vec3(.22,.32,.08), vec3(.14,.24,.05), th), L.x*near*.94);
  vec2 sg = floor(p*110.); float st = h21(sg); float tw = .5 + .5*sin(t*2.2 + st*40.);
  col += step(.9965, st)*tw*mix(.25, .8, th)*(1.-near);
  vec2 m = uMouse*asp; col += .07*exp(-length(p-m)*4.)*mix(vec3(1.), vec3(.6,1.,.9), th);
  return col;
}
void main(){
  float t = uTime;
  vec3 col = uMode < .5 ? paintA(vUv, t, uTheme) : paintB(vUv, t, uTheme);
  col += (h21(gl_FragCoord.xy + fract(t)*7.) - .5)*.045;
  vec2 v = vUv - .5; col *= 1. - dot(v, v)*mix(.35, .6, uTheme);
  gl_FragColor = vec4(col, 1.);
}`;
  const PVS = `attribute float aSeed; uniform float uTime, uDpr; varying float vA;
void main(){ vec3 p = position; float sp = .015 + aSeed*.035;
  p.y = mod(p.y + 1.1 + uTime*sp, 2.2) - 1.1; p.x += sin(uTime*.25 + aSeed*20.)*.035;
  gl_Position = vec4(p.xy, 0., 1.); gl_PointSize = (1.2 + aSeed*aSeed*4.5)*uDpr;
  vA = (.35 + .65*fract(aSeed*7.13)) * (.45 + .55*sin(uTime*(.8 + aSeed*2.) + aSeed*40.)); }`;
  const PFS = `precision highp float; uniform vec3 uColor; uniform float uOpacity; varying float vA;
void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, 0., d)*vA; gl_FragColor = vec4(uColor, a*uOpacity); }`;

  let threeP;
  const getThree = () => (threeP = threeP || import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'));

  S.mountShader = function (canvas, opts) {
    const h = { alive: true, theme: opts.theme || 0 };
    h.dispose = () => { h.alive = false; h._cleanup && h._cleanup(); };
    h.setTheme = (v) => { h.theme = v; if (h.uni) { if (window.gsap) gsap.to(h.uni.uTheme, { value: v, duration: 0.01 }); else h.uni.uTheme.value = v; } };
    h.splash = (x, y) => { if (h.uni) h.uni.uRipple.value.set(x, y, h.uni.uTime.value); };
    getThree().then((THREE) => {
      if (!h.alive) return;
      const mode = opts.mode;
      let renderer;
      try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' }); }
      catch (e) { canvas.style.background = 'var(--bg2)'; return; }
      const dpr = Math.min(devicePixelRatio || 1, mode === 1 ? 1 : 1.5);
      renderer.setPixelRatio(dpr);
      const scene = new THREE.Scene(); const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const uni = (h.uni = {
        uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uScroll: { value: 0 }, uTheme: { value: h.theme }, uMode: { value: mode }, uRipple: { value: new THREE.Vector3(0.5, 0.5, -10) }
      });
      const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: uni, vertexShader: VS, fragmentShader: FS }));
      scene.add(quad);
      const N = mode === 1 ? 360 : 70;
      const pos = new Float32Array(N * 3), seed = new Float32Array(N);
      for (let i = 0; i < N; i++) { pos[i * 3] = Math.random() * 2 - 1; pos[i * 3 + 1] = Math.random() * 2.2 - 1.1; seed[i] = Math.random(); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
      const pu = { uTime: uni.uTime, uDpr: { value: dpr }, uColor: { value: new THREE.Color(0.85, 1, 0.92) }, uOpacity: { value: 0.7 } };
      const pts = new THREE.Points(g, new THREE.ShaderMaterial({ uniforms: pu, vertexShader: PVS, fragmentShader: PFS, transparent: true, depthTest: false, blending: THREE.AdditiveBlending }));
      scene.add(pts);
      const size = () => { const r = canvas.getBoundingClientRect(); const w = Math.max(1, r.width), hh = Math.max(1, r.height); renderer.setSize(w, hh, false); uni.uRes.value.set(w, hh); };
      size();
      const ro = new ResizeObserver(size); ro.observe(canvas);
      let visible = true;
      const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; }); io.observe(canvas);
      const onDown = (e) => { const r = canvas.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return; if (e.target.closest && e.target.closest('button,a,nav')) return; h.splash((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height); };
      addEventListener('pointerdown', onDown);
      const mx = { x: 0.5, y: 0.5 };
      let raf, last = performance.now(), t = Math.random() * 50;
      const loop = (now) => {
        raf = requestAnimationFrame(loop);
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        if (!visible || document.hidden) return;
        if (mode === 1) {
          const y = scrollY, H = innerHeight, max = document.documentElement.scrollHeight - H;
          if (y > H * 1.6 && y < max - H * 1.6) return;
          uni.uScroll.value = y / H;
        }
        t += reduce ? dt * 0.15 : dt;
        uni.uTime.value = t;
        const r = canvas.getBoundingClientRect();
        mx.x += ((S.mouse.cx - r.left) / r.width - mx.x) * 0.06;
        mx.y += ((1 - (S.mouse.cy - r.top) / r.height) - mx.y) * 0.06;
        uni.uMouse.value.set(mx.x, mx.y);
        pu.uOpacity.value = uni.uTheme.value > 0.5 ? 0.75 : 0.55;
        renderer.render(scene, cam);
      };
      raf = requestAnimationFrame(loop);
      h._cleanup = () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); removeEventListener('pointerdown', onDown); renderer.dispose(); };
      if (!h.alive) h._cleanup();
    });
    return h;
  };
})();
