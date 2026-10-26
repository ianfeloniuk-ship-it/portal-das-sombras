/* v504–v507 (Ian, 21/10/2026): as 5 CAPITAIS ganham cara de capital.
   Cada Capital (Ymiria, Zahar, Thalor, Urdan, Verden — Aster fica como está) recebe, em volta da cidade comum:
   - muralha externa de 150 m de raio (muro de pedra ou paliçada do cenário Tripo, tingido pelo bioma), 4 portões, torres e tochas;
   - praça pavimentada no centro, marco visível de longe (torre/árvore gigante com farol de luz) e adornos do bioma;
   - Zahar: tendas e cactos · Thalor: cais, barcos atracados · Urdan: brasas ao sul, pedras · Verden: carvalhos gigantes.
   Só modelos existentes (muro, paliçada, torre, árvores, cactos, tabuas/cabana/abrigo/veleiro/canoa/navio). Instanciado (InstancedMesh + LOD do cenário).
   O chão fica plano até 195 m do centro (loop de relevo em 400-loop.js) e todas as peças têm colisão. */
(function () {
  'use strict';
  const T = THREE, TAU = Math.PI * 2, RC = 250, PI = Math.PI;
  const hex = h => { const c = new T.Color(h); return [c.r, c.g, c.b]; };
  /* tint = multiplica a textura do modelo (1 = original). halo/flame = cores do farol e das tochas */
  const STYLE = {
    Ymiria: { name: 'Ymiria', wall: 'wall', H: 9, col: [.42, .52, .78], tcol: [.36, .46, .72], flame: 0x9fdcff, halo: 0x8fd8ff, plaza: [.85, .95, 1.15], lmAng: 235, lmR: 104, lmH: 50, lm: 'defense', lmTint: null },
    Zahar: { name: 'Zahar', wall: 'wall', H: 8, col: [1, .78, .45], tcol: [1, .8, .5], flame: 0xffc25a, halo: 0xffd27a, plaza: [1.5, 1.2, .8], lmAng: 320, lmR: 104, lmH: 48, lm: 'defense', lmTint: null },
    Thalor: { name: 'Thalor', wall: 'wall', H: 9, col: [1, .98, .92], tcol: [1, .97, .9], flame: 0xfff0c8, halo: 0xfff4d8, plaza: [1.4, 1.4, 1.4], lmAng: 200, lmR: 128, lmH: 46, lm: 'defense', lmTint: null },
    Urdan: { name: 'Urdan', wall: 'palisade', H: 7.5, col: [.62, .46, .34], tcol: [.5, .3, .28], flame: 0xff7a2a, halo: 0xff5a1a, plaza: [.8, .7, .65], lmAng: 50, lmR: 104, lmH: 46, lm: 'defense', lmTint: null },
    Verden: { name: 'Verden', wall: 'palisade', H: 8, col: [.5, .7, .32], tcol: [.5, .68, .38], flame: 0xb8ff7a, halo: 0x9dff7a, plaza: [.8, 1.0, .65], lmAng: 140, lmR: 100, lmH: 52, lm: 'oak', lmTint: null }
  };

  /* ---------- utilidades ---------- */
  const seedOf = s => { let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
  const rng = n => () => { n = (Math.imul(n, 1664525) + 1013904223) >>> 0; return n / 4294967296; };
  const norm = a => { a %= TAU; return a < 0 ? a + TAU : a; };
  /* v622 (Ian, 26/10/2026): "nenhuma cidade no mundo é redonda" — a muralha segue um contorno orgânico (raio por ângulo). Só as capitais listadas aqui;
     as outras seguem redondas até a vez delas. Os 4 portões ficam nos eixos cardeais (as estradas da v600 saem por eles). */
  /* v623: o contorno é um POLÍGONO irregular (muralha reta entre torres de canto, como cidade medieval de verdade). Vértices sorteados por capital;
     o raio por ângulo é a interseção do raio com o polígono. Zahar espalhada, Urdan colada na serra (lado norte reto), Thalor com o lado do mar reto,
     Verden como mancha de árvores (muitos lados), Ymiria angulosa. Raio entre 172 e 240 m. */
  const POLYCFG = {
    Zahar: { n: 12, base: 206, amp: 34, jit: .45, seed: 5 },
    Urdan: { n: 9, base: 200, amp: 24, jit: .3, seed: 23, flat: { a0: PI * 1.1, a1: PI * 1.9, r: 178 } },
    Thalor: { n: 10, base: 205, amp: 26, jit: .3, seed: 37, flat: { a0: PI * .78, a1: PI * 1.22, r: 214 } },
    Verden: { n: 15, base: 208, amp: 20, jit: .22, seed: 41 },
    Ymiria: { n: 12, base: 208, amp: 30, jit: .28, seed: 53, alt: 1 }
  };
  const POLY = {};
  function polyOf(name) {
    if (POLY[name]) return POLY[name];
    const C = POLYCFG[name]; if (!C) return null;
    const R = rng(C.seed * 7919 + 13), V = [];
    for (let i = 0; i < C.n; i++) {
      const a = (i + .5 + (R() - .5) * C.jit * 2) / C.n * TAU;
      let r = C.base + (R() - .5) * 2 * C.amp; if (C.alt) r += (i % 2 ? -1 : 1) * 12;
      if (C.flat && a > C.flat.a0 && a < C.flat.a1) r = C.flat.r + (R() - .5) * 4;
      V.push({ a, r: Math.max(172, Math.min(240, r)) });
    }
    V.sort((p, q) => p.a - q.a);
    return POLY[name] = V.map(v => [Math.cos(v.a) * v.r, Math.sin(v.a) * v.r]);
  }
  function polyRho(P, a) {
    const dx = Math.cos(a), dz = Math.sin(a);
    for (let i = 0; i < P.length; i++) {
      const A = P[i], B = P[(i + 1) % P.length], ex = B[0] - A[0], ez = B[1] - A[1], den = dx * ez - dz * ex; if (Math.abs(den) < 1e-9) continue;
      const t = (A[0] * ez - A[1] * ex) / den, u = (A[0] * dz - A[1] * dx) / den; /* ponto = t*d = A + u*e */
      if (t > 0 && u >= -1e-6 && u <= 1 + 1e-6) return t;
    }
    return RC;
  }
  const ORG = new Proxy({}, { has: (o, k) => !!POLYCFG[k], get: (o, k) => POLYCFG[k] ? (a => polyRho(polyOf(k), a)) : undefined });
  const rhoOf = (c, a) => ORG[c.name] ? ORG[c.name](a) : RC;
  const gateDist = a => Math.min(...[0, PI / 2, PI, PI * 1.5, TAU].map(q => Math.abs(norm(a) - q)));

  const glbCache = new Map();
  function glb(name) { /* modelos soltos (tendas, tábuas, barcos): cópia simples do material do cenário, uma vez só */
    if (glbCache.has(name)) return glbCache.get(name);
    const p = new Promise(res => {
      if (!T.GLTFLoader) { res(null); return; }
      const l = new T.GLTFLoader(); if (window.MeshoptDecoder) l.setMeshoptDecoder(MeshoptDecoder);
      l.load('models/' + name + '.glb', g => {
        const root = g.scene; root.updateMatrixWorld(true);
        root.traverse(o => {
          if (!o.isMesh) return;
          const fix = m => { const mat = m.clone(); mat.side = T.DoubleSide; if (mat.map) { mat.map.encoding = T.sRGBEncoding; mat.color.setScalar(1.25); mat.emissiveMap = mat.map; mat.emissive.setRGB(.18, .17, .16); } mat.roughness = Math.max(.75, mat.roughness || 0); mat.metalness = 0; return mat; };
          o.material = Array.isArray(o.material) ? o.material.map(fix) : fix(o.material); o.castShadow = true; o.receiveShadow = true; o.geometry.userData.shared = true;
        });
        const b = new T.Box3().setFromObject(root), s = b.getSize(new T.Vector3()), wrap = new T.Group();
        root.position.set(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2); wrap.add(root);
        wrap.userData.s = s; res(wrap);
      }, undefined, () => res(null));
    });
    glbCache.set(name, p); return p;
  }
  /* cópia da peça, com altura h (e largura/comprimento opcionais) e cor multiplicada */
  function place(tpl, o) {
    const g = tpl.clone(true), s = tpl.userData.s, k = o.h / s.y;
    g.scale.set(o.sx ? o.sx / s.x : k, k * (o.sy || 1), o.sz ? o.sz / s.z : k);
    g.position.set(o.x, o.y || 0, o.z); g.rotation.y = o.ry || 0;
    if (o.tint) g.traverse(m => { if (m.isMesh) { const f = x => { const c = x.clone(); c.color.multiply(new T.Color(o.tint[0], o.tint[1], o.tint[2])); return c; }; m.material = Array.isArray(m.material) ? m.material.map(f) : f(m.material); } });
    return g;
  }

  /* ---------- tochas, farol e brasas (Points: um desenho por conjunto) ---------- */
  let glowTex = null;
  const soft = () => glowTex || (glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), r = x.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.3, 'rgba(255,255,255,.45)'); r.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = r; x.fillRect(0, 0, 64, 64); return new T.CanvasTexture(c); })());
  /* pts: [{x,y,z,size,drift,ph}] · drift>0: sobe e recomeça (brasa); drift=0: chama que pisca */
  function points(pts, color, fx) {
    if (!pts.length) return null;
    const pos = new Float32Array(pts.length * 3), at = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => { pos.set([p.x, p.y, p.z], i * 3); at.set([p.size, p.drift || 0, p.ph == null ? Math.random() : p.ph], i * 3); });
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('a', new T.BufferAttribute(at, 3));
    const mat = new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false,
      uniforms: { t: { value: 0 }, c: { value: new T.Color(color) }, map: { value: soft() }, k: { value: fx || 1 } },
      vertexShader: 'uniform float t;attribute vec3 a;varying float vA;void main(){vec3 p=position;float f=1.;if(a.y>0.){float u=fract(t*.07+a.z);p.y+=u*a.y;p.x+=sin(t*.8+a.z*40.)*1.2*u;f=sin(u*3.14159);}else{f=.75+.25*sin(t*9.+a.z*60.)*sin(t*5.3+a.z*20.);}vA=f;vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=a.x*f*(420./-mv.z);gl_Position=projectionMatrix*mv;}',
      fragmentShader: 'uniform sampler2D map;uniform vec3 c;uniform float k;varying float vA;void main(){vec4 s=texture2D(map,gl_PointCoord);gl_FragColor=vec4(c*k,1.)*s.a*vA;}'
    });
    const m = new T.Points(geo, mat); m.frustumCulled = false; m.renderOrder = 8; m.userData.own = 1;
    m.onBeforeRender = () => { mat.uniforms.t.value = performance.now() / 1000; };
    return m;
  }

  /* ---------- praça pavimentada ---------- */
  const plazaTex = {};
  function paving(tint) {
    const k = tint.join(',');
    if (plazaTex[k]) return plazaTex[k];
    const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d'), R = rng(7);
    const s = 64;
    for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) {
      const v = 120 + R() * 50, o = (j & 1) * 32;
      x.fillStyle = 'rgb(' + [v * tint[0], v * tint[1], v * tint[2]].map(q => Math.min(255, q | 0)).join(',') + ')';
      x.fillRect(i * s - o, j * s, s - 3, s - 3); x.fillRect(i * s - o + 512, j * s, s - 3, s - 3);
    }
    const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.encoding = T.sRGBEncoding; t.anisotropy = 4;
    return plazaTex[k] = t;
  }

  /* contexto da capital em construção: tocha no lugar do lampião, pedra/paliçada pintada pelo bioma, neblina leve */
  let CTX = null;
  const dimCache = new Map();
  function dim(m, S, role) {
    if (Array.isArray(m)) return m.map(x => dim(x, S, role));
    const key = S.name + role; let c = dimCache.get(m); if (!c) dimCache.set(m, c = {}); if (c[key]) return c[key];
    const r = m.clone(), col = role === 'tower' ? S.tcol : role === 'wall' ? S.col : null;
    if (col) r.emissive.multiplyScalar(.12);
    r.onBeforeCompile = (sh, rd) => {
      if (m.onBeforeCompile) m.onBeforeCompile(sh, rd);
      let f = sh.fragmentShader;
      if (col) { sh.uniforms.capTint = { value: new T.Color(col[0], col[1], col[2]) }; f = 'uniform vec3 capTint;\n' + f.replace('#include <map_fragment>', '#include <map_fragment>\n{float l=dot(diffuseColor.rgb,vec3(.3,.59,.11));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(l)*capTint*3.1,.92);}'); }
      /* neblina reduzida: a silhueta da muralha e das torres aparece de longe */
      f = f.replace('#include <fog_fragment>', '#ifdef USE_FOG\nfloat ff504=1.0-exp(-fogDensity*fogDensity*fogDepth*fogDepth);gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,ff504*.2);\n#endif');
      sh.fragmentShader = f;
    };
    const k0 = m.customProgramCacheKey ? m.customProgramCacheKey() : ''; r.customProgramCacheKey = () => k0 + '-cap504-' + key;
    return c[key] = r;
  }
  function recolor(group, S) {
    group.traverse(o => {
      const id = o.isInstancedMesh && o.userData.tripo153; if (!id) return;
      const role = id === 'defense' ? 'tower' : (id === 'wall' || id === 'palisade') ? 'wall' : ['oak', 'willow', 'fir'].includes(id) ? 'tree' : null;
      if (role) o.material = dim(o.material, S, role);
    });
  }
  const eh0 = EH, mesh0 = EnvBatch.prototype.mesh, add0 = EnvBatch.prototype.add;
  EH = function (batch, key, x, y, z, ry, height, tint) {
    if (CTX && key === 'lantern') { CTX.lamps.push({ x, z }); return eh0.call(this, batch, 'post_skull', x, y, z, ry, 3.3, tint); }
    return eh0.apply(this, arguments);
  };
  /* pilares lisos do portão (caixa cinza + cone) saem; entram peças de muro do cenário Tripo, na cor do bioma */
  const gates0 = cityGates341;
  cityGates341 = function (c, g, fallen, ring, half, h) {
    const n0 = GATES341.length, r = gates0.apply(this, arguments);
    if (CTX) for (const gt of GATES341.slice(n0)) {
      const G = gt.g, ry = G.rotation.y, cs = Math.cos(ry), sn = Math.sin(ry);
      G.children.forEach(m => { if (m.isMesh) m.visible = false; });
      for (const sd of [-1, 1]) { const lx = sd * (half + .5); CTX.pillars.push({ x: G.position.x + lx * cs, z: G.position.z - lx * sn, ry, h: h + 3.5 }); }
    }
    return r;
  };
  EnvBatch.prototype.mesh = function () { const g = mesh0.apply(this, arguments); if (CTX && g) { try { recolor(g, CTX.S); } catch (e) { console.warn('capitais504 recolor', e); } } return g; };
  EnvBatch.prototype.add = function (k, x, y, z, ry, sx, sy, sz, tint) { /* Urdan/Verden: o muro da cidade interna também vira paliçada */
    if (CTX && CTX.S.wall === 'palisade' && k === 'wall_straight') { const m = ENV.m[k]; return add0.call(this, 'palisade154', x, y, z, ry, (m.max[0] - m.min[0]) * (sx || 1), 1, 1, tint); }
    return add0.apply(this, arguments);
  };

  /* ---------- v623: muralha e torres em geometria própria, com material procedural realista (pedra com junta, adobe com reboco, madeira velha) ---------- */
  const LOOK = {
    Zahar: { k: [1, 1], cA: 0xc9a46c, cB: 0xb78f58, cM: 0x9b7545, dA: 0xe3cfa4, dB: 0xd2b98a, dM: 0xa88a5c, kp: [2.4, 1.5], kq: [2.4, 1.5], snow: 0, moss: 0,
      wt: { H: 8, th: 2.6, taper: .74, plinth: 1, merl: 'box' }, tw: { seg: 4, taper: .82, roof: 'none', r: 3.2 } },
    Urdan: { k: [0, 0], cA: 0x544e48, cB: 0x3e3a36, cM: 0x1c1a19, dA: 0x2e2a28, dB: 0x3a3330, dM: 0x151413, kp: [1.5, .85], kq: [.6, .35], snow: .12, moss: 0,
      wt: { H: 9, th: 3.2, taper: .9, plinth: 1, merl: 'box' }, tw: { seg: 6, taper: .86, roof: 'none', r: 3.4 } },
    Thalor: { k: [0, 0], cA: 0x959a90, cB: 0x7a8076, cM: 0x4d514a, dA: 0x41606a, dB: 0x34505a, dM: 0x24373e, kp: [1.1, .6], kq: [.55, .32], snow: 0, moss: 1,
      wt: { H: 9, th: 2.4, taper: .94, plinth: 1, merl: 'box' }, tw: { seg: 8, taper: .9, roof: 'cone', roofH: 1.9, r: 3.2 } },
    Verden: { k: [0, 2], cA: 0xc4bfa8, cB: 0xa9a58f, cM: 0x706d5c, dA: 0x7b5a39, dB: 0x634728, dM: 0x2f2112, kp: [1.2, .62], kq: [.42, 9], snow: 0, moss: .5,
      wt: { H: 8, th: 1.6, base: 2.8, merl: 'stake' }, tw: { seg: 8, taper: .88, roof: 'cone', roofH: 1.5, r: 3.1, base: 3.4 } },
    Ymiria: { k: [0, 0], cA: 0x59627a, cB: 0x454c61, cM: 0x262a36, dA: 0x2a3042, dB: 0x1f2433, dM: 0x10131c, kp: [1.3, .75], kq: [.5, .3], snow: .7, moss: 0,
      wt: { H: 10, th: 2.4, taper: .92, plinth: 1, merl: 'spike' }, tw: { seg: 8, taper: .8, roof: 'cone', roofH: 3.4, r: 3 } }
  };
  const mergeParts = parts => {
    const P = [], N = [], M = [];
    for (const { g, mk } of parts) {
      const q = g.index ? g.toNonIndexed() : g; q.computeVertexNormals();
      const p = q.attributes.position.array, n = q.attributes.normal.array;
      for (let i = 0; i < p.length; i++) { P.push(p[i]); N.push(n[i]); }
      for (let i = 0; i < p.length / 3; i++) M.push(mk);
      if (q !== g) q.dispose(); g.dispose();
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.Float32BufferAttribute(P, 3)); geo.setAttribute('normal', new T.Float32BufferAttribute(N, 3)); geo.setAttribute('mk', new T.Float32BufferAttribute(M, 1));
    geo.computeBoundingSphere(); return geo;
  };
  const kitGeo = {}, kitMat = {};
  const WALL_L = 6.4, TOWER_H = 14;
  function wallGeo(name) {
    if (kitGeo['w' + name]) return kitGeo['w' + name];
    const w = LOOK[name].wt, H = w.H, th = w.th, parts = [];
    const tp = (g, mk, x, y, z) => { g.translate(x, y, z); parts.push({ g, mk }); };
    const taper = g => { const p = g.attributes.position; for (let i = 0; i < p.count; i++) if (p.getY(i) > 1) p.setZ(i, p.getZ(i) * w.taper); return g; };
    if (w.base) { /* Verden: pé de pedra clara + paliçada de troncos por cima */
      tp(new T.BoxGeometry(WALL_L, w.base, th * 1.25), 0, 0, w.base / 2, 0);
      const up = H - w.base; tp(new T.BoxGeometry(WALL_L, up, th * .7), 1, 0, w.base + up / 2, 0);
      for (let i = 0; i < 12; i++) { const g = new T.ConeGeometry(.3, 1.4, 4); g.rotateY(PI / 4); tp(g, 1, -WALL_L / 2 + .27 + i * (WALL_L - .54) / 11, H + .7, i % 2 ? .12 : -.12); }
      tp(new T.BoxGeometry(WALL_L, .35, th * .9), 1, 0, w.base + 1.6, 0); tp(new T.BoxGeometry(WALL_L, .35, th * .9), 1, 0, H - 1, 0);
    } else {
      tp(taper(new T.BoxGeometry(WALL_L, H, th)), 0, 0, H / 2, 0);
      if (w.plinth) tp(new T.BoxGeometry(WALL_L, 1.1, th * 1.14), 0, 0, .55, 0);
      const tt = th * w.taper;
      for (const side of [-1, 1]) for (let i = 0; i < 3; i++) {
        const x = -2.1 + i * 2.1, z = side * (tt / 2 - .3);
        if (w.merl === 'spike') { const g = new T.ConeGeometry(.75, 2.1, 4); g.rotateY(PI / 4); tp(g, 0, x, H + 1.05, z); tp(new T.BoxGeometry(1.5, .9, .6), 0, x, H + .45, z); }
        else tp(new T.BoxGeometry(1.5, 1.4, .6), 0, x, H + .7, z);
      }
      tp(new T.BoxGeometry(WALL_L, .5, th * w.taper), 0, 0, H + .15, 0);
    }
    return kitGeo['w' + name] = mergeParts(parts);
  }
  function towerGeo(name) {
    if (kitGeo['t' + name]) return kitGeo['t' + name];
    const t = LOOK[name].tw, h = TOWER_H, r = t.r, parts = [], rot = t.seg === 4 ? PI / 4 : PI / t.seg;
    const cyl = (rt, rb, hh, y, mk) => { const g = new T.CylinderGeometry(rt, rb, hh, t.seg, 1); g.rotateY(rot); g.translate(0, y + hh / 2, 0); parts.push({ g, mk }); };
    const rr = t.seg === 4 ? 1.3 : 1.05; /* quadrada: o cilindro de 4 lados vai até o canto */
    const R0 = r * rr, R1 = R0 * t.taper;
    if (t.base) { cyl(R0 * 1.06, R0 * 1.1, t.base, 0, 0); cyl(R1, R0 * 1.03, h - t.base, t.base, 1); } else cyl(R1, R0, h, 0, 0);
    cyl(R1 * 1.2, R1 * 1.06, 1.2, h, t.base ? 1 : 0);
    const nm = t.seg * 2, rm = R1 * 1.12 * (t.seg === 4 ? .72 : .95);
    for (let i = 0; i < nm; i++) { const a = i / nm * TAU + rot; const g = new T.BoxGeometry(1.05, 1.1, .55); g.rotateY(-a + PI / 2); g.translate(Math.cos(a) * rm, h + 1.75, Math.sin(a) * rm); parts.push({ g, mk: t.base ? 1 : 0 }); }
    if (t.roof === 'cone') { const g = new T.ConeGeometry(R1 * 1.35, t.roofH * r, t.seg); g.rotateY(rot); g.translate(0, h + 1.2 + t.roofH * r / 2, 0); parts.push({ g, mk: 1 }); }
    return kitGeo['t' + name] = mergeParts(parts);
  }
  const linear = hex => { const c = new T.Color(hex); c.convertSRGBToLinear(); return c; };
  function kitMaterial(name, ox, oz) {
    if (kitMat[name]) return kitMat[name];
    const L = LOOK[name], m = new T.MeshStandardMaterial({ color: 0xffffff, roughness: .96, metalness: 0 });
    m.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, { uCA: { value: linear(L.cA) }, uCB: { value: linear(L.cB) }, uCM: { value: linear(L.cM) }, uDA: { value: linear(L.dA) }, uDB: { value: linear(L.dB) }, uDM: { value: linear(L.dM) }, uKP: { value: new T.Vector4(L.kp[0], L.kp[1], 0, 0) }, uKQ: { value: new T.Vector4(L.kq[0], L.kq[1], 0, 0) }, uKind: { value: new T.Vector3(L.k[0], L.k[1], L.snow) }, uMoss: { value: L.moss }, uOrg: { value: new T.Vector2(ox, oz) } });
      sh.vertexShader = sh.vertexShader.replace(/void\s+main\s*\(\s*\)\s*\{/, 'attribute float mk;varying vec3 vWP;varying float vMk;\nvoid main(){').replace('#include <begin_vertex>', '#include <begin_vertex>\nvMk=mk;vec4 wq=vec4(transformed,1.);\n#ifdef USE_INSTANCING\nwq=instanceMatrix*wq;\n#endif\nvWP=(modelMatrix*wq).xyz;');
      const fn = `uniform vec3 uCA,uCB,uCM,uDA,uDB,uDM,uKind;uniform vec4 uKP,uKQ;uniform float uMoss;uniform vec2 uOrg;varying vec3 vWP;varying float vMk;
float h21(vec2 p){p=fract(p*vec2(123.34,345.45));p+=dot(p,p+34.23);return fract(p.x*p.y);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y);}
vec3 layer(vec2 uv,float kind,vec2 cell,vec3 cA,vec3 cB,vec3 cM,float seed){
  float row=floor(uv.y/cell.y);float ro=kind>1.5?0.:(mod(row,2.)*.5+h21(vec2(row,seed))*.35);
  vec2 q=vec2(uv.x/cell.x+ro,uv.y/cell.y);vec2 id=floor(q),f=fract(q);float rnd=h21(id+seed);
  vec2 e=min(f,1.-f)*cell;float m=min(e.x,e.y);float mw=kind>1.5?.012:(kind>.5?.05:.032);
  float mort=1.-smoothstep(mw*.5,mw*1.7,m);
  vec3 col=mix(cA,cB,rnd);
  float g=vn(uv*(kind>1.5?vec2(34.,2.2):vec2(13.)))*.55+vn(uv*4.7)*.45;col*=.74+.46*g;col*=.93+.14*h21(id*1.7+seed);
  if(kind>.5&&kind<1.5){col*=.88+.24*vn(uv*1.6+seed);float cr=1.-smoothstep(.0,.02,abs(vn(uv*vec2(2.6,1.1)+seed)-.5));col=mix(col,cM,cr*.55);mort*=.3;}
  return mix(col,cM,mort*(kind>1.5?.75:.88));
}
vec3 proc(){
  vec3 n=normalize(cross(dFdx(vWP),dFdy(vWP)));bool top=abs(n.y)>.7;vec3 wp=vWP-vec3(uOrg.x,0.,uOrg.y);
  vec2 uv=top?wp.xz:vec2(dot(wp.xz,normalize(vec2(-n.z,n.x)+vec2(1e-4))),wp.y);
  vec3 c=vMk<.5?layer(uv,uKind.x,uKP.xy,uCA,uCB,uCM,1.):layer(uv,uKind.y,uKQ.xy,uDA,uDB,uDM,7.);
  float gr=1.-smoothstep(0.,2.6,wp.y);c*=1.-.38*gr*vn(uv*2.7);
  c=mix(c,vec3(.035,.075,.02),clamp(uMoss*gr*smoothstep(.35,.7,vn(uv*3.3+9.)),0.,1.));
  float sn=uKind.z*(top?1.:smoothstep(.62,.9,vn(uv*2.2+3.))*.4);c=mix(c,vec3(.72,.78,.88),clamp(sn,0.,1.));
  return c;
}
void main(){`;
      sh.fragmentShader = sh.fragmentShader.replace(/void\s+main\s*\(\s*\)\s*\{/, fn).replace('#include <map_fragment>', '#include <map_fragment>\ndiffuseColor.rgb=proc();')
        .replace('#include <fog_fragment>', '#ifdef USE_FOG\nfloat ffk=1.0-exp(-fogDensity*fogDensity*fogDepth*fogDepth);gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,ffk*.25);\n#endif');
    };
    m.customProgramCacheKey = () => 'kit623-' + name;
    return kitMat[name] = m;
  }
  function kitMesh(geo, mat, list) { /* list: [{x,z,ry,sx,sy,sz}] */
    const im = new T.InstancedMesh(geo, mat, list.length), mx = new T.Matrix4(), q = new T.Quaternion(), ax = new T.Vector3(0, 1, 0);
    list.forEach((e, i) => { mx.compose(new T.Vector3(e.x, 0, e.z), q.setFromAxisAngle(ax, e.ry), new T.Vector3(e.sx, e.sy, e.sz)); im.setMatrixAt(i, mx); });
    im.instanceMatrix.needsUpdate = true; im.frustumCulled = false; im.castShadow = true; im.receiveShadow = true; im.userData.own = 1; return im;
  }

  /* ---------- a capital ---------- */
  function capital(c, g, addCol) {
    const S = STYLE[c.name], X = c.x, Z = c.z, M = TripoEnvironment153.models, R = rng(seedOf(c.id + c.name));
    const b = new EnvBatch(); b.tripo153 = [];
    const flames = [], embers = [], solids = [], big = [];
    const col = (x, z, r) => { addCol({ x, z, r }); };
    const push = (id, x, z, ry, sc, sy, sz, tint, y) => { b.tripo153.push({ id, x, y: y || 0, z, ry, scale: sc, sy, sz, tint }); };
    const segTint = (x, z) => { /* Urdan: madeira do pântano ao norte, carvão do vulcão ao sul */
      if (c.name !== 'Urdan') return null;
      const w = Math.min(1, Math.max(0, (z - Z + 20) / 60)); return [1 - .5 * w, 1 - .58 * w, 1 - .55 * w];
    };

    /* muralha: polígono irregular, trechos retos de ~6 m com vãos nos 4 portões, torre em cada vértice (v623) */
    const LK = LOOK[c.name], seg = WALL_L, rho = a => rhoOf(c, a);
    const gateR = [0, PI / 2, PI, PI * 1.5].map(rho);
    const PLY = polyOf(c.name), wallList = [], towerList = [], flames0 = [];
    const nearGate = (x, z) => [[gateR[0], 0], [0, gateR[1]], [-gateR[2], 0], [0, -gateR[3]]].some(g => Math.hypot(x - g[0], z - g[1]) < 12.5);
    for (let i = 0; i < PLY.length; i++) {
      const A = PLY[i], B = PLY[(i + 1) % PLY.length], len = Math.hypot(B[0] - A[0], B[1] - A[1]), n = Math.max(1, Math.round(len / seg)), tan = Math.atan2(B[1] - A[1], B[0] - A[0]);
      for (let k = 0; k < n; k++) {
        const t = (k + .5) / n, x = A[0] + (B[0] - A[0]) * t, z = A[1] + (B[1] - A[1]) * t; if (nearGate(x, z)) continue;
        const sea = c.name === 'Thalor' && x < -60, H = LK.wt.H + (sea ? 2 : 0);
        wallList.push({ x: X + x, z: Z + z, ry: -tan, sx: len / n / seg * 1.04, sy: H / LK.wt.H, sz: 1 }); col(X + x, Z + z, 3.3);
      }
      const hh = i % 3 === 0 ? 17 : 14; towerList.push({ x: X + A[0], z: Z + A[1], s: hh / TOWER_H, ry: 0, hh }); col(X + A[0], Z + A[1], 4.4);
    }
    cityGates341(c, g, false, gateR, 9, 7);
    /* torres de canto e dos portões: tochas no alto */
    for (const e of towerList) flames.push({ x: e.x + (X - e.x) * .02, y: e.hh * .98, z: e.z, size: 5 });
    /* fortaleza: no ponto mais largo do contorno (o "alto" da cidade), um torreão grande e quatro torres de canto */
    {
      let best = 0, ba = 0; for (let i = 0; i < 360; i++) { const a = i / 360 * TAU, r = rho(a); if (r > best && gateDist(a) * r > 70) { best = r; ba = a; } }
      const kx = X + Math.cos(ba) * (best - 42), kz = Z + Math.sin(ba) * (best - 42);
      towerList.push({ x: kx, z: kz, s: 34 / TOWER_H, ry: ba, hh: 34 }); col(kx, kz, 8); flames.push({ x: kx, y: 35, z: kz, size: 8 });
      for (const [dx, dz] of [[-17, -17], [17, -17], [-17, 17], [17, 17]]) { const tx = kx + dx, tz = kz + dz; towerList.push({ x: tx, z: tz, s: 22 / TOWER_H, ry: ba, hh: 22 }); col(tx, tz, 5); flames.push({ x: tx, y: 22.5, z: tz, size: 5 }); }
      c.keep622 = { x: kx, z: kz };
    }
    /* pilares dos portões viram torres de portão */
    for (const p of CTX.pillars) { towerList.push({ x: p.x, z: p.z, s: 17 / TOWER_H, ry: 0, hh: 17 }); col(p.x, p.z, 4.4); flames.push({ x: p.x, y: 17.5, z: p.z, size: 5 }); }
    CTX.pillars.length = 0;
    {
      const kmat = kitMaterial(c.name, X, Z);
      if (wallList.length) g.add(kitMesh(wallGeo(c.name), kmat, wallList.map(e => e)));
      if (towerList.length) g.add(kitMesh(towerGeo(c.name), kmat, towerList.map(e => ({ x: e.x, z: e.z, ry: e.ry, sx: e.s, sy: e.s, sz: e.s }))));
    }
    /* tochas ao longo da muralha, por dentro */
    for (let i = 0; i < 70; i++) {
      const a = i / 70 * TAU + .04; if (gateDist(a) * rho(a) < 13.5) continue;
      const r = rho(a) - 3.5, x = X + Math.cos(a) * r, z = Z + Math.sin(a) * r;
      EH(b, 'campfire_stones', x, 0, z, -a, 1.5); col(x, z, .8); flames.push({ x, y: 1.5, z, size: 4.2 });
    }
    /* avenidas dos portões ao centro: lanternas dos dois lados */
    for (const [qi, q] of [0, PI / 2, PI, PI * 1.5].entries()) for (let d = 70; d < gateR[qi] - 12; d += 14) for (const sd of [-1, 1]) {
      const px = -Math.sin(q) * sd * 7.5, pz = Math.cos(q) * sd * 7.5, x = X + Math.cos(q) * d + px, z = Z + Math.sin(q) * d + pz;
      EH(b, 'lantern', x, 0, z, 0, 3.3); col(x, z, .4);
    }

    /* marco: visível de longe */
    {
      const a = S.lmAng * PI / 180, x = X + Math.cos(a) * S.lmR, z = Z + Math.sin(a) * S.lmR;
      const mm = M[S.lm];
      if (mm) {
        const sc = S.lmH / mm.h; if (S.lm === 'oak') big.push({ x, z, ry: 0, sc }); else { const ks = S.lmH / TOWER_H; g.add(kitMesh(towerGeo(c.name), kitMaterial(c.name, X, Z), [{ x, z, ry: a, sx: ks * .6, sy: ks, sz: ks * .6 }])); } col(x, z, S.lm === 'oak' ? 3 : 7);
        const halo = new T.Sprite(new T.SpriteMaterial({ map: soft(), color: S.halo, opacity: .5, transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false }));
        halo.scale.setScalar(S.lmH * (S.lm === 'oak' ? .45 : .75)); halo.position.set(x, S.lmH * (S.lm === 'oak' ? 1.05 : .93), z); halo.renderOrder = 9; g.add(halo);
        flames.push({ x, y: S.lmH * (S.lm === 'oak' ? 1.05 : .93), z, size: S.lm === 'oak' ? 14 : 26 });
        for (let k = 0; k < 4; k++) { const aa = k * PI / 2 + .6; flames.push({ x: x + Math.cos(aa) * 6, y: 1.6, z: z + Math.sin(aa) * 6, size: 3 }); }
      }
    }

    /* adornos do bioma */
    const spot = (r0, r1, tries) => {
      for (let t = 0; t < (tries || 30); t++) {
        const a = R() * TAU, r = r0 + R() * (Math.max(r0 + 4, Math.min(r1, rho(a) - 14)) - r0), x = X + Math.cos(a) * r, z = Z + Math.sin(a) * r;
        if (Math.abs(x - X) < 11 || Math.abs(z - Z) < 11) continue; /* avenidas livres */
        if (Math.hypot(x - (X + Math.cos(S.lmAng * PI / 180) * S.lmR), z - (Z + Math.sin(S.lmAng * PI / 180) * S.lmR)) < 14) continue;
        return { x, z, a };
      }
      return null;
    };
    const decor = []; /* peças soltas carregadas depois: {file, h, x, z, ry, tint, sx, sz, y} */
    if (c.name === 'Ymiria') {
      for (let i = 0; i < 26; i++) { const p = spot(72, RC - 14); if (!p) continue; const h = 11 + R() * 7; EH(b, 'tree_fir', p.x, 0, p.z, R() * TAU, h / 1.7); col(p.x, p.z, 1); }
      for (let i = 0; i < 9; i++) { const p = spot(74, RC - 12); if (!p) continue; EH(b, 'rock_large', p.x, 0, p.z, R() * TAU, 3.2); col(p.x, p.z, 2.2); }
    } else if (c.name === 'Zahar') {
      for (let i = 0; i < 22; i++) { const p = spot(74, RC - 14); if (!p) continue; EH(b, 'cactus_' + i, p.x, 0, p.z, R() * TAU, 4.5 + R() * 3); col(p.x, p.z, 1); }
      const tents = [];
      for (let i = 0; i < 14; i++) { const p = spot(78, RC - 18); if (!p || tents.some(q => Math.hypot(q.x - p.x, q.z - p.z) < 13)) continue; tents.push(p); col(p.x, p.z, 4); decor.push({ f: R() < .5 ? 'm437/cabana' : 'm437/abrigo', h: 5.5 + R() * 1.5, x: p.x, z: p.z, ry: Math.atan2(X - p.x, Z - p.z) + (R() - .5) * .8, tint: [1.55 + R() * .2, 1.1 + R() * .2, .75] }); }
    } else if (c.name === 'Thalor') {
      for (let i = 0; i < 14; i++) { const p = spot(74, RC - 14); if (!p) continue; EH(b, 'tree_pine', p.x, 0, p.z, R() * TAU, 5.5 + R() * 2); col(p.x, p.z, 1); }
      for (let i = 0; i < 8; i++) { const p = spot(110, RC - 8); if (!p) continue; EH(b, 'rock_large', p.x, 0, p.z, R() * TAU, 2.6); col(p.x, p.z, 1.8); }
      portThalor(c, g, addCol, decor, flames);
    } else if (c.name === 'Urdan') {
      for (let i = 0; i < 12; i++) { const p = spot(74, RC - 14); if (!p || p.z > Z + 10) continue; EH(b, 'tree_willow', p.x, 0, p.z, R() * TAU, 6 + R() * 3); col(p.x, p.z, 1); }
      for (let i = 0; i < 12; i++) { const p = spot(74, RC - 12); if (!p || p.z < Z + 10) continue; EH(b, 'rock_large', p.x, 0, p.z, R() * TAU, 3 + R() * 2); col(p.x, p.z, 2.4); }
      for (let i = 0; i < 90; i++) { const a = R() * TAU, r = Math.sqrt(R()) * RC; const x = X + Math.cos(a) * r, z = Z + Math.abs(Math.sin(a)) * r; embers.push({ x, y: 0.4, z, size: 2.4 + R() * 1.8, drift: 10 + R() * 14, ph: R() }); }
    } else if (c.name === 'Verden') {
      for (let i = 0; i < 9; i++) {
        const p = spot(72, RC - 16); if (!p || solids.some(q => Math.hypot(q.x - p.x, q.z - p.z) < 26)) continue;
        solids.push(p); const h = 20 + R() * 8, sc = h / M.oak.h; big.push({ x: p.x, z: p.z, ry: R() * TAU, sc }); col(p.x, p.z, 3.4);
      }
      for (let i = 0; i < 14; i++) { const p = spot(72, RC - 14); if (!p) continue; EH(b, 'tree_oak', p.x, 0, p.z, R() * TAU, 5 + R() * 2); col(p.x, p.z, 1); }
    }

    /* monta o lote instanciado e tinge por instância */
    const group = b.mesh(BLDMAT);
    if (group) {
      const byId = {};
      for (const e of b.tripo153) (byId[e.id] || (byId[e.id] = [])).push(e);
      group.traverse(o => {
        const id = o.isInstancedMesh && o.userData.tripo153, list = id && byId[id];
        if (!list || !list.some(e => e.tint) || o.count !== list.length) return;
        const cc = new T.Color();
        list.forEach((e, i) => { const t = e.tint || [1, 1, 1]; cc.setRGB(t[0], t[1], t[2]); o.setColorAt(i, cc); });
        o.instanceColor.needsUpdate = true;
      });
      envOwn(g, group);
    }

    /* carvalhos gigantes: malha própria (sem o recorte de 90 m das árvores comuns), opacos e com as cores do modelo */
    if (big.length && M.oak) {
      const mx = new T.Matrix4(), q = new T.Quaternion(), ax = new T.Vector3(0, 1, 0), cc = new T.Color(), lf = TripoEnvironment153.leaf154('oak', X, Z);
      for (const part of M.oak.parts) {
        const im = new T.InstancedMesh(part.geometry, dim(part.material, S, 'tree'), big.length);
        big.forEach((e, i) => { mx.compose(new T.Vector3(e.x, 0, e.z), q.setFromAxisAngle(ax, e.ry), new T.Vector3(e.sc, e.sc, e.sc)); im.setMatrixAt(i, mx); cc.setRGB(...(lf || [1, 1, 1])); im.setColorAt(i, cc); });
        im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; im.frustumCulled = false; im.castShadow = true; g.add(im);
      }
    }
    /* praça */
    {
      const pl = new T.Mesh(new T.CircleGeometry(30, 64), new T.MeshBasicMaterial({ map: paving(S.plaza), color: 0xffffff, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
      pl.material.map.repeat.set(5, 5); pl.rotation.x = -PI / 2; pl.position.set(X, .05, Z); pl.userData.own = 1; g.add(pl);
    }
    const fl = points(flames, S.flame, 1.1); if (fl) g.add(fl);
    const em = points(embers, S.flame, 1.5); if (em) g.add(em);

    /* peças soltas (assíncronas) */
    Promise.all(decor.map(d => glb(d.f))).then(tpls => {
      if (!g.parent) return;
      decor.forEach((d, i) => { const tpl = tpls[i]; if (tpl) g.add(place(tpl, d)); });
    });
    c.capital501 = true;
  }

  /* Thalor: cais de tábuas até o mar e barcos atracados */
  function portThalor(c, g, addCol, decor, flames) {
    const X = c.x, Z = c.z, sd = TER245 && TER245.SEA439 && TER245.SEA439.d;
    if (!sd) return;
    let xs = X - RC - 14; while (xs > X - 400 && sd(xs, Z) < -2) xs -= 2; /* x da linha d'água */
    const x0 = X - RC - 4, x1 = xs - 68, len = x0 - x1, y = 0.35;
    decor.push({ f: 'm437/tabuas', pier: true, x0, x1, z: Z, y });
    for (let d = 0; d < len; d += 12) for (const sdd of [-1, 1]) { flames.push({ x: x0 - d, y: 2.6, z: Z + sdd * 3.4, size: 2.6 }); }
    /* barcos: perto da ponta do cais, dos dois lados */
    const boats = [['m440/navio', 15, 0, -1, 0], ['m437/veleiro', 9, 0, 1, 1], ['m437/veleiro', 8, 0, -1, 2], ['m437/canoa', 3.2, 0, 1, 3], ['m437/canoa', 3.2, 0, -1, 4]];
    boats.forEach(([f, h, , side, k]) => { const bz = Z + side * (k === 0 ? 20 : 11 + k); let bx = x1 + 4 + k * 7; while ((sd(bx, bz) < h * 2 + 6 || terrH(bx, bz) > -1.6) && bx > x1 - 90) bx -= 2; /* só em água funda */ decor.push({ f, h, boat: true, x: bx, z: bz, ry: (k * 1.3) % PI, tint: null }); });
  }

  /* cais: tábuas lado a lado (tolera o modelo vir curto) — monta no lugar do 'place' simples */
  const place0 = place;
  place = function (tpl, o) {
    if (o.pier) {
      const g = new T.Group(), len = o.x0 - o.x1, w = 7, step = 5.6;
      for (let d = 0; d < len; d += step) { const p = place0(tpl, { h: 0.45, sx: step + .2, sz: w, x: o.x0 - d - step / 2, z: o.z, y: o.y - .3, ry: 0, tint: [1.0, .92, .8] }); g.add(p); }
      return g;
    }
    const gr = place0(tpl, o);
    if (o.boat) { const w = window.Water391 && Water391.waterAt(o.x, o.z); gr.position.y = (w ? w.top : -.9) - .35; }
    return gr;
  };

  /* ---------- gancho na construção da cidade ---------- */
  const bc0 = buildCity;
  buildCity = function (c, g, addCol, R) {
    const S = c && c.capital && STYLE[c.name] && !cityFallen(c) && window.TripoEnvironment153 ? STYLE[c.name] : null;
    if (S) CTX = { S, lamps: [], pillars: [] };
    let r;
    try {
      r = bc0.apply(this, arguments);
      if (S) {
        if (TripoEnvironment153.models.wall) capital(c, g, addCol);
        else TripoEnvironment153.ready.then(() => { if (g.parent) { CTX = { S, lamps: [], pillars: [] }; try { capital(c, g, addCol); } finally { CTX = null; } } });
        const lp = points(CTX.lamps.map(l => ({ x: l.x, y: 3.55, z: l.z, size: 3.2 })), S.flame, 1.1); if (lp) g.add(lp);
      }
    } catch (e) { console.warn('capitais504', e); } finally { CTX = null; }
    return r;
  };
  /* o chunk central da Capital (onde a muralha é montada) fica carregado até 430 m do jogador */
  const near = (c, P, r) => Math.hypot(c.x - P.x, c.z - P.z) < r;
  const caps = () => { const out = []; try { for (const n in STYLE) { const c = Mapa500.capital(n); if (c) out.push(c); } } catch (_) {} return out; };
  /* o plano de corte da câmera (260 m) apagava a muralha longe: perto de uma Capital ele sobe para 950 m */
  let far0 = 0;
  setInterval(() => {
    try {
      if (typeof camera === 'undefined' || !camera || typeof player === 'undefined' || !player) return;
      if (!far0) far0 = camera.far;
      const want = L.mode === 'world' ? 1300 : far0; /* v529: o chão distante (1,1 km) e as serras aparecem em todo o mapa, não só perto de Capital */
      if (camera.far !== want) { camera.far = want; camera.updateProjectionMatrix(); }
    } catch (_) {}
  }, 400);
  /* ---------- chão distante: malha única de baixa resolução em volta do jogador ---------- */
  const FAR = { R: 1100, N: 110, step: 150, mesh: null, cx: 1e9, cz: 1e9, on: true, u: { value: new T.Vector2(1e9, 1e9) } };
  function farUpdate() {
    if (typeof L === 'undefined' || typeof player === 'undefined' || !player || typeof scene === 'undefined') return;
    const world = L.mode === 'world' && FAR.on && window.TER245 && TER245.on.value;
    if (FAR.mesh) FAR.mesh.visible = !!world;
    FAR.u.value.set(player.x, player.z);
    if (!world) return;
    const cx = Math.round(player.x / FAR.step) * FAR.step, cz = Math.round(player.z / FAR.step) * FAR.step;
    if (cx === FAR.cx && cz === FAR.cz && FAR.mesh) return;
    FAR.cx = cx; FAR.cz = cz;
    const pg = new T.PlaneGeometry(FAR.R * 2, FAR.R * 2, FAR.N, FAR.N); pg.rotateX(-PI / 2); pg.translate(cx, 0, cz);
    envGroundColors(pg, []);
    if (!FAR.mesh) {
      const base = envGroundMat(), fm = base.clone();
      const g = function (sh, rd) { const bf = Object.getOwnPropertyDescriptor(T.Material.prototype, 'onBeforeCompile').get.call(base); bf.call(this, sh, rd); sh.fragmentShader = sh.fragmentShader.replace('#include <fog_fragment>', '#ifdef USE_FOG'+String.fromCharCode(10)+'float ffg504=1.0-exp(-fogDensity*fogDensity*fogDepth*fogDepth);gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,ffg504*.2);'+String.fromCharCode(10)+'#endif'); /* v562: o chão distante é grosso (20 m) e furava o chão real em desfiladeiros e serras estreitas; some perto do jogador, onde o chão real já existe */ sh.uniforms.uFarP504 = FAR.u; sh.fragmentShader = 'uniform vec2 uFarP504;' + String.fromCharCode(10) + sh.fragmentShader.replace(/void\s+main\s*\(\s*\)\s*\{/, m => m + 'if(distance(terrainWorld128.xz,uFarP504)<150.)discard;'); };
      g._w245 = true; fm.onBeforeCompile = g; fm.customProgramCacheKey = () => 'far504';
      FAR.mesh = new T.Mesh(pg, fm); FAR.mesh.frustumCulled = false; FAR.mesh.renderOrder = -2; FAR.mesh.position.y = -3.2; /* abaixo do chão carregado: sem briga de profundidade */
      FAR.mesh.userData.farGround504 = true; scene.add(FAR.mesh);
    } else { FAR.mesh.geometry.dispose(); FAR.mesh.geometry = pg; }
  }
  setInterval(() => { try { farUpdate(); } catch (e) { console.warn('capitais504 far', e); FAR.on = false; } }, 250);
  window.Capitais501 = {
    FAR,
    STYLE, RC, rho: rhoOf,
    want(P, list) { if (L.mode !== 'world') return; for (const c of caps()) if (near(c, P, 700)) list.push([c.cx, c.cz, 99]); },
    keep(ch, P) { return L.mode === 'world' && ch.city && STYLE[ch.city.name] && near(ch.city, P, 820); }
  };
})();
