/* v446 (Ian: "faz grama com aquele negócio ... Perlin noise"): grama de verdade em volta do jogador.
   Tufos de lâminas (7 por tufo) em células de 0,9 m num raio de 40 m. Onde nasce e quanto nasce vem de ruído Perlin
   (fbm de 4 oitavas), então o campo fica em manchas naturais; o bioma muda a densidade e a cor (campos e flores cheios,
   floresta mais escura, pântano amarelado, neve e cristal ralos e claros, deserto só tufos secos raros, vulcão nada).
   Não nasce em água, estrada, cidade, trilha/calçamento (terra444) nem dentro de construção. Vento e o jogador
   empurrando as lâminas no shader; a raiz segue o relevo pela instância (terrain245). As folhinhas verdes antigas
   do cenário (plant_flat*) saem. */
(function () {
  'use strict';
  const T = THREE, TAU = Math.PI * 2;
  const R = 34, CELL = .55, TILE = 8, MAX = 30000;
  const ready = () => typeof started !== 'undefined' && started && typeof player !== 'undefined' && player && run && L.mode === 'world' && !L.grid;

  /* ---------- ruído Perlin (gradiente) + fbm ---------- */
  const P = new Uint8Array(512); { const p = []; for (let i = 0; i < 256; i++) p.push(i); let s = 4460; for (let i = 255; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [p[i], p[j]] = [p[j], p[i]]; } for (let i = 0; i < 512; i++) P[i] = p[i & 255]; }
  const fade = t => t * t * t * (t * (t * 6 - 15) + 10), lerp = (a, b, t) => a + (b - a) * t;
  const grad = (h, x, y) => { const u = (h & 1) ? x : -x, v = (h & 2) ? y : -y; return (h & 4) ? u + v * .5 : u * .5 + v; };
  function perlin(x, y) { const X = Math.floor(x) & 255, Y = Math.floor(y) & 255; x -= Math.floor(x); y -= Math.floor(y); const u = fade(x), v = fade(y), a = P[X] + Y, b = P[X + 1] + Y; return lerp(lerp(grad(P[a], x, y), grad(P[b], x - 1, y), u), lerp(grad(P[a + 1], x, y - 1), grad(P[b + 1], x - 1, y - 1), u), v); }
  function fbm(x, y) { let v = 0, a = .5, f = 1; for (let i = 0; i < 4; i++) { v += a * perlin(x * f, y * f); f *= 2.02; a *= .5; } return v; } // ~ −0,6…0,6
  const hash = (x, y) => { let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  window.Perlin446 = { perlin, fbm };

  /* ---------- tufo de lâminas ---------- */
  function tuft() {
    const pos = [], col = [], uv = [], idx = []; let v = 0;
    for (let b = 0; b < 11; b++) {
      const a = b / 11 * TAU + hash(b, 7) * .9, r = .04 + hash(b, 3) * .16, h = .26 + hash(b, 5) * .26, w = .05 + hash(b, 9) * .03, lean = (hash(b, 11) - .5) * .5;
      const ox = Math.cos(a) * r, oz = Math.sin(a) * r, dx = -Math.sin(a) * w, dz = Math.cos(a) * w, lx = Math.cos(a) * lean * h, lz = Math.sin(a) * lean * h;
      const pts = [[-1, 0], [1, 0], [-.7, .5], [.7, .5], [0, 1]];
      for (const [s, t] of pts) { pos.push(ox + dx * s + lx * t * t, h * t, oz + dz * s + lz * t * t); const c = .45 + .55 * t; col.push(c, c, c); uv.push(t, t); }
      idx.push(v, v + 1, v + 2, v + 1, v + 3, v + 2, v + 2, v + 3, v + 4); v += 5;
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new T.Float32BufferAttribute(col, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals(); return g;
  }
  function flower() { // haste fina e um disco de pétalas em cruz (a cor vem da instância)
    const pos = [], col = [], uv = [], idx = []; let v = 0; const h = .5, w = .02, pr = .17;
    const quad = (a, b2, c, d, ca, cb) => { pos.push(...a, ...b2, ...c, ...d); col.push(...ca, ...ca, ...cb, ...cb); uv.push(0, a[1] / h, 0, b2[1] / h, 0, c[1] / h, 0, d[1] / h); idx.push(v, v + 1, v + 2, v + 1, v + 3, v + 2); v += 4; };
    const G = [.25, .5, .2], G2 = [.35, .65, .3];
    quad([-w, 0, 0], [w, 0, 0], [-w, h, 0], [w, h, 0], G, G2); quad([0, 0, -w], [0, 0, w], [0, h, -w], [0, h, w], G, G2);
    for (let k = 0; k < 3; k++) { const a = k / 3 * Math.PI, c = Math.cos(a) * pr, s2 = Math.sin(a) * pr; quad([-c, h - .02, -s2], [c, h - .02, s2], [-c, h + .05, -s2], [c, h + .05, s2], [1, 1, 1], [1.15, 1.15, 1.15]); quad([-s2 * .7, h + .015, c * .7], [s2 * .7, h + .015, -c * .7], [-s2 * .7, h + .02, c * .7], [s2 * .7, h + .02, -c * .7], [1, 1, 1], [1, 1, 1]); }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new T.Float32BufferAttribute(col, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g;
  }
  const U = { uT: { value: 0 }, uP: { value: new T.Vector2() } };
  const mat = new T.MeshStandardMaterial({ vertexColors: true, side: T.DoubleSide, roughness: .85, metalness: 0 });
  mat.onBeforeCompile = sh => {
    sh.uniforms.uT446 = U.uT; sh.uniforms.uP446 = U.uP;
    sh.vertexShader = 'uniform float uT446;uniform vec2 uP446;\n' + sh.vertexShader
      .replace('#include <beginnormal_vertex>', 'vec3 objectNormal=vec3(0.,1.,0.);')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
{float h=uv.y;vec3 ip=vec3(0.);
#ifdef USE_INSTANCING
ip=(modelMatrix*instanceMatrix*vec4(0.,0.,0.,1.)).xyz;
#endif
float g=sin(uT446*.6+ip.x*.05)*.5+.5;float sw=sin(uT446*1.9+ip.x*.37+ip.z*.29)*(.6+.6*g)+sin(uT446*3.3+ip.x*1.3)*.25;
transformed.x+=sw*h*h*.14;transformed.z+=cos(uT446*1.4+ip.z*.41)*h*h*.08;
vec2 d=ip.xz-uP446;float dist=length(d);if(dist<1.3&&dist>.001){transformed.xz+=normalize(d)*(1.3-dist)*h*h*.55;transformed.y-=(1.3-dist)*h*.18;}}`);
  };
  mat.customProgramCacheKey = () => 'grass446';
  const mesh = new T.InstancedMesh(tuft(), mat, MAX);
  mesh.instanceMatrix.setUsage(T.DynamicDrawUsage); mesh.count = 0; mesh.frustumCulled = false; mesh.receiveShadow = true; mesh.castShadow = false; mesh.name = 'Grass446';
  mesh.instanceColor = new T.InstancedBufferAttribute(new Float32Array(MAX * 3).fill(1), 3); mesh.instanceColor.setUsage(T.DynamicDrawUsage); scene.add(mesh); // cor por instância já do tamanho máximo
  const FMAX = 4000, fl = new T.InstancedMesh(flower(), mat, FMAX); fl.instanceMatrix.setUsage(T.DynamicDrawUsage); fl.count = 0; fl.frustumCulled = false; fl.instanceColor = new T.InstancedBufferAttribute(new Float32Array(FMAX * 3).fill(1), 3); fl.name = 'Flowers446'; scene.add(fl);
  const PETAL = [[1, .55, .75], [1, .85, .3], [.75, .55, 1], [1, 1, .95], [1, .45, .4]];

  /* ---------- onde nasce ---------- */
  const BIO = { campos: [1, .50, .78, .30], flores: [1, .56, .82, .32], floresta: [.8, .36, .62, .24], pantano: [.85, .60, .66, .28], neve: [.14, .92, .9, .74], cristal: [.2, .66, .86, .92], deserto: [.07, .86, .74, .44], vulcao: [0, 0, 0, 0] };
  const tiles = new Map(); const M = new T.Matrix4(), Q = new T.Quaternion(), V = new T.Vector3(), Sc = new T.Vector3(), up = new T.Vector3(0, 1, 0);
  function blocked(x, z) {
    if (window.Water391 && Water391.waterAt(x, z)) return true;
    if (window.TER245 && TER245.path444 && TER245.path444(x, z) > .25) return true;
    return false;
  }
  function buildTile(tx, tz) {
    const out = [], x0 = tx * TILE, z0 = tz * TILE;
    const cx = x0 + TILE / 2, cz = z0 + TILE / 2;
    if (typeof nearestCity === 'function' && nearestCity(cx, cz).d < 68 * (typeof CITYK !== 'undefined' ? CITYK : 1)) return out;
    const bio = typeof biomeAt === 'function' ? biomeAt(cx, cz) : 'campos', B = BIO[bio] || BIO.campos; if (!B[0]) return out;
    let segs = null; try { segs = typeof roadSegs === 'function' ? roadSegs(cx, cz, 1) : null; } catch (_) {}
    const sites = (run.build437 || []).filter(b => Math.abs(b.x - cx) < 14 && Math.abs(b.z - cz) < 14);
    for (let i = 0; i < TILE / CELL; i++) for (let j = 0; j < TILE / CELL; j++) {
      const gx = Math.floor((x0 + i * CELL) / CELL), gz = Math.floor((z0 + j * CELL) / CELL);
      const x = (gx + hash(gx, gz)) * CELL, z = (gz + hash(gz, gx + 9)) * CELL;
      const n = fbm(x * .045, z * .045) + .35 * perlin(x * .21, z * .21);
      const dens = Math.max(0, Math.min(1, (n + .32) * 2.1)) * B[0]; // manchas: campo cheio onde o ruído sobe, clareiras onde desce
      if (hash(gx + 31, gz - 17) > dens) continue;
      if (blocked(x, z)) continue;
      if (segs && typeof onRoad === 'function' && onRoad(segs, x, z, 4)) continue;
      if (sites.some(b => Math.hypot(b.x - x, b.z - z) < 3)) continue;
      const s = (.75 + hash(gx * 3, gz * 5) * .6) * (bio === 'deserto' ? .8 : 1) * (.85 + .35 * Math.max(0, n));
      const tone = .85 + .3 * hash(gx, gz * 7) + .25 * n;
      const fch = bio === 'flores' ? .16 : bio === 'campos' ? .035 : bio === 'pantano' ? .02 : 0;
      if (hash(gx * 7 + 3, gz * 11 - 5) < fch) { const c = PETAL[(hash(gx, gz + 77) * PETAL.length) | 0], k2 = Math.floor((fbm(x * .02, z * .02) + 1) * 3) % PETAL.length, c2 = PETAL[k2]; const pc = hash(gx + 5, gz) < .6 ? c2 : c; out.push([x, z, hash(gz, gx) * TAU, .8 + hash(gx, gz + 3) * .5, pc[0], pc[1], pc[2], 1]); continue; }
      out.push([x, z, hash(gz, gx) * TAU, s, B[1] * tone, B[2] * tone, B[3] * tone]);
    }
    return out;
  }
  let key = '', fill = 0;
  function rebuild() {
    const px = player.x, pz = player.z, k = Math.round(px / 6) + ',' + Math.round(pz / 6) + ',' + ((run.terra444?.st?.length) || 0) + ',' + ((run.build437 || []).length);
    if (k === key) return; key = k;
    const ed = ((run.terra444?.st?.length) || 0) + ':' + ((run.build437 || []).length); if (ed !== rebuild.ed) { rebuild.ed = ed; tiles.clear(); } // trilha nova ou obra nova: refaz os ladrilhos
    const t0x = Math.floor((px - R) / TILE), t1x = Math.floor((px + R) / TILE), t0z = Math.floor((pz - R) / TILE), t1z = Math.floor((pz + R) / TILE);
    const want = new Set(); let n = 0, nf = 0; const col = new T.Color(); let budget = 10; // no máx. 6 ladrilhos novos por vez (sem travar)
    for (let tx = t0x; tx <= t1x; tx++) for (let tz = t0z; tz <= t1z; tz++) {
      const id = tx + ',' + tz; want.add(id);
      if (!tiles.has(id)) { if (budget-- <= 0) { key = ''; continue; } tiles.set(id, buildTile(tx, tz)); }
      for (const g of tiles.get(id)) {
        const dx = g[0] - px, dz = g[1] - pz; if (dx * dx + dz * dz > R * R) continue;
        if (g[7]) { if (nf >= FMAX) continue; Q.setFromAxisAngle(up, g[2]); V.set(g[0], 0, g[1]); Sc.setScalar(g[3]); M.compose(V, Q, Sc); fl.setMatrixAt(nf, M); col.setRGB(g[4], g[5], g[6]); fl.setColorAt(nf, col); nf++; continue; }
        if (n >= MAX) continue;
        Q.setFromAxisAngle(up, g[2]); V.set(g[0], 0, g[1]); Sc.set(g[3], g[3] * (.9 + .2 * ((n * 7) % 5) / 5), g[3]); M.compose(V, Q, Sc); mesh.setMatrixAt(n, M);
        col.setRGB(g[4], g[5], g[6]); mesh.setColorAt(n, col); n++;
      }
    }
    for (const id of tiles.keys()) if (!want.has(id)) tiles.delete(id);
    fl.count = nf; fl.instanceMatrix.needsUpdate = true; fl.instanceColor.needsUpdate = true;
    mesh.count = n; mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true; fill = n;
  }
  /* as folhinhas antigas (plant_flat*) saem do cenário */
  if (typeof EH === 'function') { const eh0 = EH; EH = function (batch, k) { if (typeof k === 'string' && /^(plant_flat|grass|flower_)/.test(k)) return 0; return eh0.apply(this, arguments); }; }
  function invalidate() { tiles.clear(); key = ''; }

  let last = performance.now(), slow = 0;
  function loop() {
    const now = performance.now(), dt = Math.min(.1, (now - last) / 1000); last = now;
    try {
      const on = ready(); mesh.visible = fl.visible = on;
      if (on) { U.uT.value += dt; U.uP.value.set(player.x, player.z); slow -= dt; if (slow <= 0) { slow = .25; rebuild(); } }
    } catch (e) { if (!loop.err) { loop.err = 1; console.warn('grass446', e); } }
    setTimeout(loop, 33);
  }
  loop();
  window.Grass446 = { mesh, rebuild, invalidate, count: () => fill, tiles };
})();
