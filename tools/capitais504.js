/* v504–v507 (Ian, 21/10/2026): as 5 CAPITAIS ganham cara de capital.
   Cada Capital (Ymiria, Zahar, Thalor, Urdan, Verden — Aster fica como está) recebe, em volta da cidade comum:
   - muralha externa de 150 m de raio (muro de pedra ou paliçada do cenário Tripo, tingido pelo bioma), 4 portões, torres e tochas;
   - praça pavimentada no centro, marco visível de longe (torre/árvore gigante com farol de luz) e adornos do bioma;
   - Zahar: tendas e cactos · Thalor: cais, barcos atracados · Urdan: brasas ao sul, pedras · Verden: carvalhos gigantes.
   Só modelos existentes (muro, paliçada, torre, árvores, cactos, tabuas/cabana/abrigo/veleiro/canoa/navio). Instanciado (InstancedMesh + LOD do cenário).
   O chão fica plano até 195 m do centro (loop de relevo em 400-loop.js) e todas as peças têm colisão. */
(function () {
  'use strict';
  const T = THREE, TAU = Math.PI * 2, RC = 150, PI = Math.PI;
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

    /* muralha: segmentos de ~6 m, com vãos nos 4 portões */
    const wm = M[S.wall], seg = 6.2, n = Math.round(TAU * RC / seg), gapA = 12.5 / RC;
    if (wm) for (let i = 0; i < n; i++) {
      const a = (i + .5) / n * TAU; if (gateDist(a) < gapA) continue;
      const x = X + Math.cos(a) * RC, z = Z + Math.sin(a) * RC, sea = c.name === 'Thalor' && Math.cos(a) < -.2;
      const L = TAU * RC / n * 1.05, H = S.H + (sea ? 2 : 0), th = S.wall === 'wall' ? 2.4 : 1.4;
      push(S.wall, x, z, -(a + PI / 2), L / wm.sx, H / wm.h, th / wm.sz, segTint(x, z));
      col(x, z, 3.3);
    }
    /* torres: duas em cada portão, uma entre portões */
    const tm = M.defense, tws = [];
    if (tm) {
      for (const q of [0, PI / 2, PI, PI * 1.5]) for (const sd of [-1, 1]) tws.push(q + sd * (gapA + 5.5 / RC));
      for (const q of [PI / 4, PI * .75, PI * 1.25, PI * 1.75]) tws.push(q);
      for (const a of tws) {
        const x = X + Math.cos(a) * RC, z = Z + Math.sin(a) * RC, hh = (gateDist(a) < .2 ? 17 : 14), sc = hh / tm.h;
        push('defense', x, z, Math.atan2(X - x, Z - z), sc, sc, sc, null); col(x, z, 4.2);
        flames.push({ x: x + Math.cos(a) * -2.2, y: hh * .62, z: z + Math.sin(a) * -2.2, size: 5.5 });
      }
    }
    cityGates341(c, g, false, RC, 9, 7);
    /* tochas ao longo da muralha, por dentro */
    for (let i = 0; i < 40; i++) {
      const a = i / 40 * TAU + .04; if (gateDist(a) < gapA + .01) continue;
      const r = RC - 3.5, x = X + Math.cos(a) * r, z = Z + Math.sin(a) * r;
      EH(b, 'campfire_stones', x, 0, z, -a, 1.5); col(x, z, .8); flames.push({ x, y: 1.5, z, size: 4.2 });
    }
    /* avenidas dos portões ao centro: lanternas dos dois lados */
    for (const q of [0, PI / 2, PI, PI * 1.5]) for (let d = 70; d < RC - 12; d += 14) for (const sd of [-1, 1]) {
      const px = -Math.sin(q) * sd * 7.5, pz = Math.cos(q) * sd * 7.5, x = X + Math.cos(q) * d + px, z = Z + Math.sin(q) * d + pz;
      EH(b, 'lantern', x, 0, z, 0, 3.3); col(x, z, .4);
    }

    /* marco: visível de longe */
    {
      const a = S.lmAng * PI / 180, x = X + Math.cos(a) * S.lmR, z = Z + Math.sin(a) * S.lmR;
      const mm = M[S.lm];
      if (mm) {
        const sc = S.lmH / mm.h; if (S.lm === 'oak') big.push({ x, z, ry: 0, sc }); else push(S.lm, x, z, Math.atan2(X - x, Z - z), sc, sc, sc, null); col(x, z, S.lm === 'oak' ? 3 : 9);
        const halo = new T.Sprite(new T.SpriteMaterial({ map: soft(), color: S.halo, opacity: .5, transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false }));
        halo.scale.setScalar(S.lmH * (S.lm === 'oak' ? .45 : .75)); halo.position.set(x, S.lmH * (S.lm === 'oak' ? 1.05 : .93), z); halo.renderOrder = 9; g.add(halo);
        flames.push({ x, y: S.lmH * (S.lm === 'oak' ? 1.05 : .93), z, size: S.lm === 'oak' ? 14 : 26 });
        for (let k = 0; k < 4; k++) { const aa = k * PI / 2 + .6; flames.push({ x: x + Math.cos(aa) * 6, y: 1.6, z: z + Math.sin(aa) * 6, size: 3 }); }
      }
    }

    /* adornos do bioma */
    const spot = (r0, r1, tries) => {
      for (let t = 0; t < (tries || 30); t++) {
        const a = R() * TAU, r = r0 + R() * (r1 - r0), x = X + Math.cos(a) * r, z = Z + Math.sin(a) * r;
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

    if (wm) for (const p of CTX.pillars) { push(S.wall, p.x, p.z, p.ry, 2.4 / wm.sx, p.h / wm.h, 2.6 / wm.sz, null); }
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
    STYLE, RC,
    want(P, list) { if (L.mode !== 'world') return; for (const c of caps()) if (near(c, P, 700)) list.push([c.cx, c.cz, 99]); },
    keep(ch, P) { return L.mode === 'world' && ch.city && STYLE[ch.city.name] && near(ch.city, P, 820); }
  };
})();
