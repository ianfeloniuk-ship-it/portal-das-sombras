/* v637 (Ian: "o mundo parece vazio, as coisas aparecem aos poucos"): horizonte cheio, sem pop-in.
   1) Árvores distantes: malhas de ~40 triângulos (InstancedMesh, 1 desenho por espécie) de 80 m até ~1,05 km, no mesmo
      lugar que as árvores reais usariam (mesma regra de bioma/ruído do cenário). Entram por dithering entre 80 e 110 m,
      onde as árvores reais (até 105 m) ainda existem: nenhuma árvore "aparece" de repente.
   2) Atmosfera: a névoa do mundo fica mais rala (se vê longe) e o chão distante ganha perspectiva atmosférica
      (mistura com a cor da névoa conforme a distância), como nas montanhas de Skyrim.
   A malha é refeita em fatias (poucos ms por quadro) quando o jogador anda 160 m; as posições vêm do mundo, não do jogador. */
(function () {
  const T = THREE, R_OUT = 1050, STEP = 10, R_IN = 70, FADE0 = 80, FADE1 = 112;
  const H = { on: true, n: 0, byKind: {}, ms: 0, builds: 0, cx: 1e9, cz: 1e9, season: -1, meshes: {}, job: null };
  window.Horizonte637 = H;
  const u = { uP637: { value: new T.Vector3() }, uF637: { value: new T.Vector2(FADE0, FADE1) } };
  const mat = new T.MeshLambertMaterial({ vertexColors: true });
  mat.customProgramCacheKey = () => 'hz637';
  mat.onBeforeCompile = function (sh) {
    sh.uniforms.uP637 = u.uP637; sh.uniforms.uF637 = u.uF637;
    sh.vertexShader = 'varying vec3 vW637;\n' + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\nvW637=(modelMatrix*instanceMatrix*vec4(transformed,1.)).xyz;');
    sh.fragmentShader = 'varying vec3 vW637;uniform vec3 uP637;uniform vec2 uF637;\n' + sh.fragmentShader.replace(/void\s+main\s*\(\s*\)\s*\{/, m => m +
      'float d637=distance(vW637.xz,uP637.xz);float f637=smoothstep(uF637.x,uF637.y,d637);' +
      'float h637=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715))));if(f637<h637)discard;');
  };
  /* ---- geometrias (vértices coloridos; a variação por árvore vem da cor da instância) ---- */
  const col = (g, c) => { const a = new Float32Array(g.attributes.position.count * 3), k = new T.Color(c); for (let i = 0; i < a.length; i += 3) { a[i] = k.r; a[i + 1] = k.g; a[i + 2] = k.b } g.setAttribute('color', new T.BufferAttribute(a, 3)); return g };
  const mv = (g, x, y, z) => { g.translate(x, y, z); return g };
  const merge = parts => { const gs = parts.map(g => g.index ? g.toNonIndexed() : g); let n = 0; for (const g of gs) n += g.attributes.position.count; const P = new Float32Array(n * 3), N = new Float32Array(n * 3), C = new Float32Array(n * 3); let o = 0; for (const g of gs) { P.set(g.attributes.position.array, o); N.set(g.attributes.normal.array, o); C.set(g.attributes.color.array, o); o += g.attributes.position.count * 3 } const r = new T.BufferGeometry(); r.setAttribute('position', new T.BufferAttribute(P, 3)); r.setAttribute('normal', new T.BufferAttribute(N, 3)); r.setAttribute('color', new T.BufferAttribute(C, 3)); return r };
  const TRUNK = 0x4a3524;
  const kinds = {
    pine: c => merge([col(mv(new T.CylinderGeometry(.5, .8, 6, 5), 0, 3, 0), TRUNK), col(mv(new T.ConeGeometry(5.2, 11, 6), 0, 9.5, 0), c), col(mv(new T.ConeGeometry(3.6, 9, 6), 0, 17, 0), c)]),
    oak: c => merge([col(mv(new T.CylinderGeometry(.7, 1.1, 8, 5), 0, 4, 0), TRUNK), col(mv(new T.IcosahedronGeometry(5.6, 0).scale(.9, 1.1, .9), 0, 13, 0), c), col(mv(new T.IcosahedronGeometry(4.4, 0), 3.6, 11, 1.4), c)]),
    willow: c => merge([col(mv(new T.CylinderGeometry(.6, 1, 6, 5), 0, 3, 0), TRUNK), col(mv(new T.IcosahedronGeometry(6, 0).scale(1.15, .7, 1.15), 0, 8.5, 0), c)]),
    dead: c => merge([col(mv(new T.CylinderGeometry(.35, .85, 15, 5), 0, 7.5, 0), c), col(mv(new T.ConeGeometry(2.2, 6, 4), 1.2, 11, 0), c)])
  };
  const TINT = { pine: 0x1f4a30, oak: 0x3d6b2a, fall: 0xb8741f, willow: 0x6f8a45, snow: 0xdfe9ee, crystal: 0x9fe8ff, dead: 0x4d3b33, snowOak: 0xe6eef2 };
  const SHAPE = { pine: 'pine', oak: 'oak', fall: 'oak', willow: 'willow', snow: 'pine', crystal: 'pine', dead: 'dead', snowOak: 'oak' };
  const group = new T.Group(); group.name = 'horizonte637';
  const ids = Object.keys(TINT);
  const geoOf = {}; for (const k of ids) geoOf[k] = kinds[SHAPE[k]](TINT[k]);
  /* ---- escolha das árvores: mesma regra do cenário (210-environment), em grade larga e árvore maior ---- */
  function kindAt(px, pz, SE) {
    const B = biomeAt(px, pz);
    if (B === 'deserto') return null;
    const n = WN(px * .035, pz * .035), bio = WN(px * .004 + 900, pz * .004 + 900), rnd = (rh(Math.floor(px), Math.floor(pz), 637) & 1023) / 1023;
    const thr = B === 'floresta' ? .34 : B === 'vulcao' ? .66 : .5;
    if (!(n > thr || rnd < .045 / 3)) return null;
    if (SE === 3 && B !== 'neve' && B !== 'cristal' && B !== 'vulcao') return B === 'pantano' ? 'willow' : (bio < .34 ? 'snow' : 'snowOak');
    if (B === 'neve') return 'snow'; if (B === 'cristal') return 'crystal'; if (B === 'vulcao') return 'dead';
    if (B === 'pantano') return 'willow';
    if (B === 'floresta') return rnd < .55 ? 'pine' : (SE === 2 ? 'fall' : 'oak');
    return bio < .34 ? 'pine' : (bio > .74 || SE === 2 ? 'fall' : 'oak');
  }
  function startBuild(cx, cz) {
    if (H.job) H.job.dead = true;
    const SE = seasonI(), n = Math.ceil(R_OUT / STEP), job = { dead: false, i: -n, items: {}, cx, cz, SE, t0: performance.now() };
    for (const k of ids) job.items[k] = [];
    job.segs = new Map();
    H.job = job;
  }
  function segsFor(job, px, pz) { const k = Math.floor(px / 512) + ',' + Math.floor(pz / 512); let s = job.segs.get(k); if (!s) { s = roadSegs(Math.floor(px / 512) * 512 + 256, Math.floor(pz / 512) * 512 + 256, 1); job.segs.set(k, s) } return s }
  function step(job) {
    const n = Math.ceil(R_OUT / STEP), t0 = performance.now();
    while (job.i <= n && performance.now() - t0 < 4) {
      const i = job.i++;
      for (let j = -n; j <= n; j++) {
        const gx = Math.round(job.cx / STEP) + i, gz = Math.round(job.cz / STEP) + j;
        const h = rh(gx, gz, 6371), px = gx * STEP + ((h & 255) / 255 - .5) * STEP * .9, pz = gz * STEP + (((h >> 8) & 255) / 255 - .5) * STEP * .9;
        const dx = px - job.cx, dz = pz - job.cz, d = Math.hypot(dx, dz);
        if (d > R_OUT || d < R_IN - 10) continue;
        if (px < -3900) continue; /* mar a oeste */
        const k = kindAt(px, pz, job.SE); if (!k) continue;
        const nc = nearestCity(px, pz); if (nc.d < (nc.c.capital ? 300 : 135)) continue;
        if (onRoad(segsFor(job, px, pz), px, pz, 11)) continue;
        try { if (riverClear239(px, pz)) continue } catch (_) { }
        const th = terrH(px, pz); if (th > 120) continue;
        const s = .62 + ((h >> 16) & 255) / 255 * .42, v = .82 + ((h >> 24) & 255) / 255 * .3;
        job.items[k].push(px, pz, s, v, ((h >> 4) & 1023) / 1023 * 6.2832);
      }
    }
    if (job.i > n) finish(job);
  }
  function finish(job) {
    const M = new T.Matrix4(), q = new T.Quaternion(), p = new T.Vector3(), sc = new T.Vector3(), ax = new T.Vector3(0, 1, 0), c = new T.Color();
    let tot = 0; H.byKind = {};
    for (const k of ids) {
      const a = job.items[k], cnt = a.length / 5; H.byKind[k] = cnt; tot += cnt;
      let m = H.meshes[k];
      if (m && m.instanceMatrix.count !== cnt) { group.remove(m); m.dispose(); m = null }
      if (!cnt) { delete H.meshes[k]; continue }
      if (!m) { m = new T.InstancedMesh(geoOf[k], mat, cnt); m.frustumCulled = false; m.castShadow = m.receiveShadow = false; m.onBeforeRender = () => u.uP637.value.set(player.x, 0, player.z); group.add(m); H.meshes[k] = m }
      for (let i = 0; i < cnt; i++) { const o = i * 5; q.setFromAxisAngle(ax, a[o + 4]); p.set(a[o], 0, a[o + 1]); sc.set(a[o + 2], a[o + 2] * (.9 + (a[o + 3] - .82)), a[o + 2]); M.compose(p, q, sc); m.setMatrixAt(i, M); c.setRGB(a[o + 3], a[o + 3], a[o + 3]); m.setColorAt(i, c) }
      m.instanceMatrix.needsUpdate = true; m.instanceColor.needsUpdate = true;
    }
    H.n = tot; H.cx = job.cx; H.cz = job.cz; H.season = job.SE; H.builds++; H.ms = Math.round(performance.now() - job.t0); H.job = null;
  }
  let added = false;
  function tick() {
    try {
      if (typeof L === 'undefined' || typeof player === 'undefined' || !player || typeof scene === 'undefined' || typeof WN === 'undefined' || !WN) return;
      const world = L.mode === 'world' && H.on && window.TER245 && TER245.on.value;
      if (!added) { scene.add(group); added = true }
      group.visible = !!world;
      if (!world) { if (H.job) H.job = null; return }
      if (H.job) { if (H.job.dead) H.job = null; else { step(H.job); return } }
      const se = seasonI();
      if (Math.hypot(player.x - H.cx, player.z - H.cz) > 160 || se !== H.season) startBuild(player.x, player.z);
    } catch (e) { console.warn('horizonte637', e); H.on = false; group.visible = false }
  }
  setInterval(tick, 16);
  /* ---- atmosfera: névoa do mundo mais rala (vê-se o horizonte) ---- */
  const baseDay = updDayNight;
  updDayNight = function (dt) {
    baseDay(dt);
    try { if (H.on && L.mode === 'world' && scene.fog && scene.fog.density < .02) scene.fog.density *= .42 } catch (_) { }
  };
})();
