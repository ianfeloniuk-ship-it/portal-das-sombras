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
  const R = 44, NR = 18, CELL = .34, TILE = 8, MAX = 30000, MAX2 = 9000; /* v595: fios cheios até NR m, LOD simples até R */ /* v567: tufos bem mais juntos (gramado contínuo) */
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
  function tuft(nb = 15, wm = 1, near = true) { /* v595: fios finos; longe, poucos fios mais largos */
    const pos = [], col = [], uv = [], idx = []; let v = 0;
    for (let b = 0; b < nb; b++) {
      const a = b / nb * TAU + hash(b, 7) * .9, r = .03 + hash(b, 3) * .10, h = .13 + hash(b, 5) * .13, w = (.03 + hash(b, 9) * .018) * wm, /* v568: capim fino e baixo, como relva */ lean = (hash(b, 11) - .5) * .5;
      const ox = Math.cos(a) * r, oz = Math.sin(a) * r, dx = -Math.sin(a) * w, dz = Math.cos(a) * w, lx = Math.cos(a) * lean * h, lz = Math.sin(a) * lean * h;
      const pts = [[-1, 0], [1, 0], [-.7, .5], [.7, .5], [0, 1]];
      for (const [s, t] of pts) { pos.push(ox + dx * s + lx * t * t, h * t, oz + dz * s + lz * t * t); const c = .38 + .62 * t * t; col.push(c, c, c); /* v595: base escura, ponta clara */ uv.push(t, t); }
      idx.push(v, v + 1, v + 2, v + 1, v + 3, v + 2, v + 2, v + 3, v + 4); v += 5;
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new T.Float32BufferAttribute(col, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals(); return g;
  }
  function flower() { // haste fina e um disco de pétalas em cruz (a cor vem da instância)
    const pos = [], col = [], uv = [], idx = []; let v = 0; const h = .28, w = .015, pr = .1;
    const quad = (a, b2, c, d, ca, cb) => { pos.push(...a, ...b2, ...c, ...d); col.push(...ca, ...ca, ...cb, ...cb); uv.push(0, a[1] / h, 0, b2[1] / h, 0, c[1] / h, 0, d[1] / h); idx.push(v, v + 1, v + 2, v + 1, v + 3, v + 2); v += 4; };
    const G = [.25, .5, .2], G2 = [.35, .65, .3];
    quad([-w, 0, 0], [w, 0, 0], [-w, h, 0], [w, h, 0], G, G2); quad([0, 0, -w], [0, 0, w], [0, h, -w], [0, h, w], G, G2);
    for (let k = 0; k < 3; k++) { const a = k / 3 * Math.PI, c = Math.cos(a) * pr, s2 = Math.sin(a) * pr; quad([-c, h - .02, -s2], [c, h - .02, s2], [-c, h + .05, -s2], [c, h + .05, s2], [1, 1, 1], [1.15, 1.15, 1.15]); quad([-s2 * .7, h + .015, c * .7], [s2 * .7, h + .015, -c * .7], [-s2 * .7, h + .02, c * .7], [s2 * .7, h + .02, -c * .7], [1, 1, 1], [1, 1, 1]); }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new T.Float32BufferAttribute(col, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g;
  }
  const NI = 12, NZ = 6;
  const U = { uT: { value: 0 }, uP: { value: new T.Vector2() }, uI: { value: Array.from({ length: NI }, () => new T.Vector4()) }, uZ: { value: Array.from({ length: NZ }, () => new T.Vector4()) }, uK: { value: new Array(NZ).fill(0) } };
  const mat = new T.MeshStandardMaterial({ vertexColors: true, side: T.DoubleSide, roughness: .85, metalness: 0 });
  mat.onBeforeCompile = sh => {
    sh.uniforms.uT446 = U.uT; sh.uniforms.uP446 = U.uP; sh.uniforms.uI446 = U.uI; sh.uniforms.uZ446 = U.uZ; sh.uniforms.uK446 = U.uK;
    sh.vertexShader = 'uniform float uT446;uniform vec2 uP446;uniform vec4 uI446[' + NI + '];uniform vec4 uZ446[' + NZ + '];uniform float uK446[' + NZ + '];varying float vBurn446;varying float vIce446;\n' + sh.vertexShader
      .replace('#include <beginnormal_vertex>', 'vec3 objectNormal=vec3(0.,1.,0.);')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
{float h=uv.y;vec3 ip=vec3(0.);
#ifdef USE_INSTANCING
ip=(modelMatrix*instanceMatrix*vec4(0.,0.,0.,1.)).xyz;
#endif
float g=sin(uT446*.6+ip.x*.05)*.5+.5;float sw=sin(uT446*1.9+ip.x*.37+ip.z*.29)*(.6+.6*g)+sin(uT446*3.3+ip.x*1.3)*.25;
/* v595: ondas de vento atravessando o campo */
float wave=sin(dot(ip.xz,vec2(.11,.06))-uT446*1.7)*.5+.5;sw+=wave*wave*.9;
float brn=0.,frz=0.,fl=0.;
for(int k=0;k<${NZ};k++){vec4 z=uZ446[k];if(z.z>0.){float w=1.-smoothstep(z.z*.55,z.z,distance(ip.xz,z.xy));float kd=uK446[k];if(kd<1.5)brn=max(brn,w*smoothstep(0.,1.5,z.w));else if(kd<2.5)frz=max(frz,w);else fl=max(fl,w);}}
float st=1.-frz*.92;
transformed.x+=sw*h*h*.14*st;transformed.z+=cos(uT446*1.4+ip.z*.41)*h*h*.08*st;
for(int i=0;i<${NI};i++){vec4 q=uI446[i];if(q.w>.01){vec2 d=ip.xz-q.xy;float dist=length(d);if(dist<q.z&&dist>.001){float push=(1.-dist/q.z)*q.w*(1.-frz*.85);transformed.xz+=normalize(d)*push*h*.55;transformed.y-=push*h*.2;}}}
transformed.xz+=vec2(.8,.35)*fl*h*.35;transformed.y*=(1.-brn*.97)*(1.-fl*.7);
vBurn446=brn;vIce446=frz;}`);
    sh.fragmentShader = 'varying float vBurn446;varying float vIce446;\n' + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb*=1.-.88*vBurn446;diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.55,.8,1.),vIce446*.75);');
  };
  mat.customProgramCacheKey = () => 'grass446';
  const mesh = new T.InstancedMesh(tuft(9, 1), mat, MAX);
  const mesh2 = new T.InstancedMesh(tuft(3, 2.8), mat, MAX2); /* LOD longe: 4 fios mais largos */
  mesh2.instanceMatrix.setUsage(T.DynamicDrawUsage); mesh2.count = 0; mesh2.frustumCulled = false; mesh2.receiveShadow = true; mesh2.castShadow = false; mesh2.name = 'Grass446far';
  mesh2.instanceColor = new T.InstancedBufferAttribute(new Float32Array(MAX2 * 3).fill(1), 3); mesh2.instanceColor.setUsage(T.DynamicDrawUsage);
  mesh.instanceMatrix.setUsage(T.DynamicDrawUsage); mesh.count = 0; mesh.frustumCulled = false; mesh.receiveShadow = true; mesh.castShadow = false; mesh.name = 'Grass446';
  mesh.instanceColor = new T.InstancedBufferAttribute(new Float32Array(MAX * 3).fill(1), 3); mesh.instanceColor.setUsage(T.DynamicDrawUsage); scene.add(mesh); scene.add(mesh2); // cor por instância já do tamanho máximo
  const FMAX = 4000, fl = new T.InstancedMesh(flower(), mat, FMAX); fl.instanceMatrix.setUsage(T.DynamicDrawUsage); fl.count = 0; fl.frustumCulled = false; fl.instanceColor = new T.InstancedBufferAttribute(new Float32Array(FMAX * 3).fill(1), 3); fl.name = 'Flowers446'; scene.add(fl);
  const PETAL = [[1, .55, .75], [1, .85, .3], [.75, .55, 1], [1, 1, .95], [1, .45, .4]];

  /* ---------- onde nasce ---------- */
  const BIO = { campos: [1, .50, .78, .30], flores: [1, .56, .82, .32], floresta: [.8, .36, .62, .24], pantano: [.85, .60, .66, .28], neve: [.14, .92, .9, .74], cristal: [.2, .66, .86, .92], deserto: [.07, .86, .74, .44], vulcao: [0, 0, 0, 0] };
  const tiles = new Map(); const M = new T.Matrix4(), Q = new T.Quaternion(), V = new T.Vector3(), Sc = new T.Vector3(), up = new T.Vector3(0, 1, 0);
  function blocked(x, z) {
    if (window.Water391 && Water391.waterAt(x, z)) return true;
    if (window.TER245 && TER245.ice500 && TER245.ice500(x, z) > 20) return true; /* v502: cordilheira de gelo sem grama */
    if (window.Enc502 && Enc502.clearAt(x, z)) return true; /* v502: clareira em volta dos encontros */
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
      const dens = (.9 + .1 * Math.max(0, Math.min(1, (n + .32) * 2.1))) * B[0]; /* v566 (Ian): gramado uniforme; só falha onde é trilha, terra, lama, água ou estrada */ // manchas: campo cheio onde o ruído sobe, clareiras onde desce
      if (hash(gx + 31, gz - 17) > dens) continue;
      if (blocked(x, z)) continue;
      if (window.Mundo513 && Mundo513.steep(x, z, .7)) continue; /* v529: sem grama em encosta íngreme/parede */
      if (segs && typeof onRoad === 'function' && onRoad(segs, x, z, 2.6)) continue;
      if (sites.some(b => Math.hypot(b.x - x, b.z - z) < 3)) continue;
      const s = (.75 + hash(gx * 3, gz * 5) * .6) * (bio === 'deserto' ? .8 : 1) * (.85 + .35 * Math.max(0, n));
      const tone = .85 + .3 * hash(gx, gz * 7) + .25 * n;
      const fch = bio === 'flores' ? .16 : bio === 'campos' ? .035 : bio === 'pantano' ? .02 : 0;
      if (hash(gx * 7 + 3, gz * 11 - 5) < fch) { const c = PETAL[(hash(gx, gz + 77) * PETAL.length) | 0], k2 = Math.floor((fbm(x * .02, z * .02) + 1) * 3) % PETAL.length, c2 = PETAL[k2]; const pc = hash(gx + 5, gz) < .6 ? c2 : c; out.push([x, z, hash(gz, gx) * TAU, .8 + hash(gx, gz + 3) * .5, pc[0], pc[1], pc[2], 1]); continue; }
      out.push([x, z, hash(gz, gx) * TAU, s, B[1] * tone, B[2] * tone, B[3] * tone]);
    }
    return out;
  }
  const CF446 = new T.Vector3(), CULLCOS446 = Math.cos(100 * Math.PI / 180);
  let key = '', fill = 0;
  function rebuild() {
    const px = player.x, pz = player.z, cdx = camera.getWorldDirection(CF446), yb = Math.round(Math.atan2(CF446.x, CF446.z) / .35), k = Math.round(px / 6) + ',' + Math.round(pz / 6) + ',' + yb + ',' + ((run.terra444?.st?.length) || 0) + ',' + ((run.build437 || []).length) + ',' + ((window.EcoGrid && EcoGrid.rev) | 0); /* v566: biomassa/pisoteio do EcoGrid mudaram */
    if (k === key) return; key = k;
    const ed = ((run.terra444?.st?.length) || 0) + ':' + ((run.build437 || []).length); if (ed !== rebuild.ed) { rebuild.ed = ed; tiles.clear(); } // trilha nova ou obra nova: refaz os ladrilhos
    const t0x = Math.floor((px - R) / TILE), t1x = Math.floor((px + R) / TILE), t0z = Math.floor((pz - R) / TILE), t1z = Math.floor((pz + R) / TILE);
    const em = window.EcoGrid && EcoGrid.grassMul; const want = new Set(); let n = 0, nf = 0, n2 = 0, far = 0; const col = new T.Color(); let budget = 10; // no máx. 6 ladrilhos novos por vez (sem travar)
    for (let tx = t0x; tx <= t1x; tx++) for (let tz = t0z; tz <= t1z; tz++) {
      const id = tx + ',' + tz; want.add(id);
      if (!tiles.has(id)) { if (budget-- <= 0) { key = ''; continue; } tiles.set(id, buildTile(tx, tz)); }
      for (const g of tiles.get(id)) {
        const dx = g[0] - px, dz = g[1] - pz; if (dx * dx + dz * dz > R * R) continue;
        if (dx * dx + dz * dz > 100) { const il = 1 / Math.hypot(CF446.x, CF446.z || 1e-6), cf = (dx * CF446.x + dz * CF446.z) * il / Math.sqrt(dx * dx + dz * dz); if (cf < CULLCOS446) continue } /* v641: só o que está na frente (±100°) */
        const eh = em ? em(g[0], g[1]) : 1; if (eh < .12) continue; /* v566: trilha batida/solo pobre não tem capim */
        const dd = dx * dx + dz * dz;
        if (dd > NR * NR) { if (g[7] || (far++ % 4) || n2 >= MAX2) continue; Q.setFromAxisAngle(up, g[2]); V.set(g[0], 0, g[1]); Sc.set(g[3] * 1.5, g[3] * 1.15 * eh, g[3] * 1.5); M.compose(V, Q, Sc); mesh2.setMatrixAt(n2, M); col.setRGB(g[4], g[5], g[6]); mesh2.setColorAt(n2, col); n2++; continue; }
        if (g[7]) { if (nf >= FMAX) continue; Q.setFromAxisAngle(up, g[2]); V.set(g[0], 0, g[1]); Sc.setScalar(g[3]); M.compose(V, Q, Sc); fl.setMatrixAt(nf, M); col.setRGB(g[4], g[5], g[6]); fl.setColorAt(nf, col); nf++; continue; }
        if (n >= MAX) continue;
        Q.setFromAxisAngle(up, g[2]); V.set(g[0], 0, g[1]); Sc.set(g[3], g[3] * (.9 + .2 * ((n * 7) % 5) / 5) * eh, g[3]); M.compose(V, Q, Sc); mesh.setMatrixAt(n, M);
        col.setRGB(g[4], g[5], g[6]); mesh.setColorAt(n, col); n++;
      }
    }
    for (const id of tiles.keys()) if (!want.has(id)) tiles.delete(id);
    fl.count = nf; fl.instanceMatrix.needsUpdate = true; fl.instanceColor.needsUpdate = true;
    mesh2.count = n2; mesh2.instanceMatrix.needsUpdate = true; if (mesh2.instanceColor) mesh2.instanceColor.needsUpdate = true;
    mesh.count = n; mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true; fill = n;
  }
  /* as folhinhas antigas (plant_flat*) saem do cenário */
  if (typeof EH === 'function') { const eh0 = EH; EH = function (batch, k) { if (typeof k === 'string' && /^(plant_flat|grass|flower_)/.test(k)) return 0; return eh0.apply(this, arguments); }; }
  /* ---------- v595: reação (jogador, NPCs, monstros) e elementos ---------- */
  const samples = [], zones = []; let tick = 0;
  function ents() {
    const out = [{ e: player, r: 1.0 }], px = player.x, pz = player.z, near = [];
    const add = (list, r0) => { try { for (const e of list) { if (!e || e.dead || e.gone || e === player) continue; const dx = e.x - px, dz = e.z - pz; if (dx * dx + dz * dz < 900) near.push({ e, r: Math.max(.6, Math.min(2.6, e.rad || e.r || r0)), d: dx * dx + dz * dz }); } } catch (_) {} };
    if (typeof enemies !== 'undefined') add(enemies, .9);
    if (typeof npcs !== 'undefined') add(npcs, .7);
    near.sort((a, b) => a.d - b.d); return out.concat(near.slice(0, 7));
  }
  function stepReact(dt) {
    if (++tick % 3 === 0) {
      for (const { e, r } of ents()) {
        const s0 = e._gs446;
        if (s0 && Math.hypot(s0.x - e.x, s0.z - e.z) < .45) { s0.s = 1; s0.x = e.x; s0.z = e.z; continue; }
        if (s0) s0.live = false;
        const n = { x: e.x, z: e.z, r: r * 2.0, s: 1, live: true }; e._gs446 = n; samples.push(n);
      }
      while (samples.length > NI) { let k = 0; for (let i = 1; i < samples.length; i++) if (samples[i].s < samples[k].s && !samples[i].live) k = i; samples.splice(k, 1); }
    }
    for (let i = samples.length - 1; i >= 0; i--) { const q = samples[i]; if (!q.live) q.s -= dt / 2.4; if (q.s <= 0) samples.splice(i, 1); }
    for (let i = 0; i < NI; i++) { const q = samples[i], v = U.uI.value[i]; if (q) v.set(q.x, q.z, q.r, Math.min(1, q.s)); else v.set(0, 0, 1, 0); }
    for (let i = zones.length - 1; i >= 0; i--) { const z = zones[i]; z.t += dt; if (z.t > z.dur) zones.splice(i, 1); }
    for (let i = 0; i < NZ; i++) { const z = zones[i], v = U.uZ.value[i]; if (z) { v.set(z.x, z.z, z.r, z.t); U.uK.value[i] = z.kind; } else { v.set(0, 0, 0, 0); U.uK.value[i] = 0; } }
  }
  /* fogo queima (fios escurecem e somem; biomassa cai e volta pelo Solo Vivo), gelo congela, vento derruba */
  function element(kind, x, z, r) {
    const K = { fire: 1, ice: 2, wind: 3 }[kind]; if (!K) return;
    zones.push({ x, z, r: Math.max(1.5, r), t: 0, kind: K, dur: K === 1 ? 7 : K === 2 ? 20 : 5 }); if (zones.length > NZ) zones.shift();
    if (K === 1 && window.EcoGrid && EcoGrid.getCellAt) {
      for (let dx = -r; dx <= r; dx += 2) for (let dz = -r; dz <= r; dz += 2) { if (dx * dx + dz * dz > r * r) continue; const c = EcoGrid.getCellAt(x + dx, z + dz); if (c) { c.grid[c.idx + 3] = Math.min(c.grid[c.idx + 3], 18); c.grid[c.idx + 1] = Math.max(0, c.grid[c.idx + 1] - 25); } }
      try { EcoGrid.rev++; } catch (_) {}
    }
  }
  function elementOf(sk) {
    if (!sk) return null;
    const n = (sk.n || '').toLowerCase(), eff = sk.t === 'kit111' ? sk.effect : (sk.effect || sk.t);
    if (/^(ward|guard|speed|move)$/.test(eff)) return null; /* armadura/escudo/velocidade não queimam nem congelam o chão */
    if (/fogo|chama|meteor|inferno|brasa|lava|incêndio|incendi|explos|rubro|ígneo/.test(n)) return 'fire';
    if (/gelo|congel|frio|nevasca|glaci|geada|gélid/.test(n)) return 'ice';
    if (/vento|tempestade de vento|ciclone|furac|rajada|tornado|vendaval/.test(n)) return 'wind';
    const t = sk.ptype300; if (t === 'fire' || t === 'meteor') return 'fire'; if (t === 'ice') return 'ice';
    const c = sk.col || 0, r = c >> 16 & 255, g = c >> 8 & 255, b = c & 255;
    if (r > 200 && g < 150 && b < 90) return 'fire'; if (b > 220 && g > 170 && r < 235) return 'ice'; return null;
  }
  /* impacto real: não repete a mesma zona enquanto ela é nova */
  function impact(el, x, z, r) {
    for (const q of zones) if ((q.kind === 1 ? 'fire' : q.kind === 2 ? 'ice' : 'wind') === el && Math.hypot(q.x - x, q.z - z) < q.r * .6 && q.t < 1.2) return;
    element(el, x, z, r);
  }
  function hookElements() {
    for (const V of [window.VFX302, window.VFX328]) {
      if (!V || !V.play || V._g446) continue; V._g446 = true; const old = V.play;
      V.play = function (sk) {
        try { const eff = sk && (sk.t === 'kit111' ? sk.effect : (sk.effect || sk.t)); const el = /^(bolt|line|chain|fan|release|target|execute|burn|counter)$/.test(eff) ? null : elementOf(sk); /* projétil queima onde acerta (kitHit111) */ if (el && player) { const K = window.VFX328 && VFX328.truth ? VFX328.truth(sk) : null; const pt = K && K.pt || { x: player.x + Math.sin(player.face || 0) * 4, z: player.z + Math.cos(player.face || 0) * 4 }; element(el, pt.x, pt.z, K && K.r || sk.radius || 4); } } catch (_) {}
        return old.apply(this, arguments);
      };
    }
    if (typeof window.kitHit111 === 'function' && !window.kitHit111._g446) { const o = window.kitHit111; window.kitHit111 = function (e, d, sk) { try { const el = elementOf(sk); if (el && e) impact(el, e.x, e.z, el === 'wind' ? 3 : 2.6); } catch (_) {} return o.apply(this, arguments); }; window.kitHit111._g446 = true; }
    if (typeof window.hurtEnemy === 'function' && !window.hurtEnemy._g446) { const o = window.hurtEnemy; window.hurtEnemy = function (e, amt, sx, sz, h) { try { if (e && h && h.fromPlayer && h.skillHit) { const el = h.elem300 === 'fogo' ? 'fire' : h.elem300 === 'gelo' ? 'ice' : null; if (el) impact(el, e.x, e.z, 2.6); } } catch (_) {} return o.apply(this, arguments); }; window.hurtEnemy._g446 = true; }
    if (typeof window.elemMul300 === 'function' && !window.elemMul300._g446) { const o = window.elemMul300; window.elemMul300 = function (e, amt, h) { try { const t = h && h.ptype300; const el = t === 'fire' || t === 'meteor' ? 'fire' : t === 'ice' ? 'ice' : null; if (el && e) element(el, e.x, e.z, 2.5); } catch (_) {} return o.apply(this, arguments); }; window.elemMul300._g446 = true; }
  }
  function invalidate() { tiles.clear(); key = ''; }

  let last = performance.now(), slow = 0;
  function loop() {
    const now = performance.now(), dt = Math.min(.1, (now - last) / 1000); last = now;
    try {
      const on = ready(); mesh.visible = mesh2.visible = fl.visible = on;
      if (on) { U.uT.value += dt; U.uP.value.set(player.x, player.z); stepReact(dt); if (!loop.h) { loop.h = 1; hookElements(); } slow -= dt; if (slow <= 0) { slow = .12; rebuild(); } }
    } catch (e) { if (!loop.err) { loop.err = 1; console.warn('grass446', e); } }
    setTimeout(loop, 33);
  }
  loop();
  window.Grass446 = { mesh, mesh2, element, zones, samples, rebuild, invalidate, count: () => fill, tiles };
})();
