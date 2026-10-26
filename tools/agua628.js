/* v628 (Ian: "água real, que nem em Skyrim"; "água viva"): marolas e respingos quando algo entra ou anda na água,
   embaixo d'água turvo e azulado com raios de luz, enchente (nível sobe com a chuva acumulada, RAIN626). */
(function () {
  'use strict';
  const T = THREE, W = () => window.Water391;
  const N = 48, geo = new T.RingGeometry(.8, 1, 20); geo.rotateX(-Math.PI / 2);
  const mat = new T.MeshBasicMaterial({ color: 0xe8f4ff, transparent: true, opacity: .55, depthWrite: false, fog: true });
  const rings = new T.InstancedMesh(geo, mat, N); rings.frustumCulled = false; rings.userData.terrainAbsolute245 = true; rings.renderOrder = 6;
  const ND = 60, dpos = new Float32Array(ND * 3).fill(0), dgeo = new T.BufferGeometry(); dgeo.setAttribute('position', new T.BufferAttribute(dpos, 3));
  const dmat = new T.PointsMaterial({ color: 0xdff0ff, size: .09, transparent: true, opacity: .85, depthWrite: false });
  const drops = new T.Points(dgeo, dmat); drops.frustumCulled = false; drops.userData.terrainAbsolute245 = true; drops.renderOrder = 6;
  const R = [], D = [];
  for (let i = 0; i < N; i++) R.push({ t: 1, x: 0, y: 0, z: 0, s: 1, sp: 1 });
  for (let i = 0; i < ND; i++) D.push({ t: 1, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 });
  let ri = 0, di = 0;
  function ripple(x, y, z, s, sp) { const r = R[ri++ % N]; r.t = 0; r.x = x; r.y = y; r.z = z; r.s = s || 1; r.sp = sp || 1.2 }
  function splash(x, y, z, power) {
    ripple(x, y, z, 1.6 * power, 1); ripple(x, y, z, 1.1 * power, 1.5); ripple(x, y, z, .7 * power, 2);
    const n = Math.round(14 * power);
    for (let i = 0; i < n; i++) { const d = D[di++ % ND], a = Math.random() * 6.283, v = (1 + Math.random() * 1.6) * power; d.t = 0; d.x = x; d.y = y; d.z = z; d.vx = Math.cos(a) * v * .8; d.vz = Math.sin(a) * v * .8; d.vy = 2.2 + Math.random() * 2.4 * power }
  }
  window.Agua628 = { ripple, splash };
  const M = new T.Matrix4(), V = new T.Vector3(), S = new T.Vector3(), Q = new T.Quaternion(), HID = new T.Matrix4().makeScale(0, 0, 0);
  /* ---- embaixo d'água ---- */
  const ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:5;opacity:0;transition:opacity .25s;background:radial-gradient(ellipse at 50% 30%,rgba(60,160,170,.18),rgba(8,60,80,.55) 75%),repeating-linear-gradient(100deg,rgba(255,255,255,0) 0 90px,rgba(190,255,245,.07) 110px 150px,rgba(255,255,255,0) 170px 260px);mix-blend-mode:normal';
  const addOv = () => document.body && document.body.appendChild(ov);
  if (document.body) addOv(); else window.addEventListener('DOMContentLoaded', addOv);
  let under = false, wasIn = false, accT = 0, last = performance.now(), ox = 0, oz = 0, rayT = 0;
  const fogSave = { c: new T.Color(), d: 0 }, uwFog = new T.Color(0x0c5062);
  function surfaceAt(x, z) { try { return W() && W().waterAt(x, z) } catch (_) { return null } }
  function tick() {
    requestAnimationFrame(tick);
    const now = performance.now(), dt = Math.min(.1, (now - last) / 1000); last = now;
    try {
      const ok = typeof started !== 'undefined' && started && typeof L !== 'undefined' && L.mode === 'world' && typeof player !== 'undefined' && player && !player.dead;
      rings.visible = drops.visible = ok;
      if (!ok) { under = false; ov.style.opacity = 0; return }
      if (rings.parent !== scene) { scene.add(rings); scene.add(drops) }
      const ws = surfaceAt(player.x, player.z), inW = !!(ws && !ws.frozen && ws.top - terrH(player.x, player.z) > .25);
      if (inW && !wasIn) splash(player.x, ws.top + .03, player.z, 1);
      wasIn = inW;
      if (inW) { const mv = Math.hypot(player.x - ox, player.z - oz); accT += dt; if (accT > (mv > .002 ? .28 : .9)) { accT = 0; ripple(player.x, ws.top + .03, player.z, mv > .002 ? .9 : .6, 1) } }
      ox = player.x; oz = player.z;
      const cw = surfaceAt(camera.position.x, camera.position.z);
      under = !!window.Agua628.forceUnder || !!(cw && !cw.frozen && camera.position.y < cw.top - .05 && cw.top - terrH(camera.position.x, camera.position.z) > .2);
      ov.style.opacity = under ? 1 : 0;
      for (let i = 0; i < N; i++) { const r = R[i]; r.t += dt * r.sp; if (r.t >= 1) { rings.setMatrixAt(i, HID); continue } const sc = .1 + r.s * r.t * 1.4 * (1 - .3 * r.t); S.set(sc, 1, sc); V.set(r.x, r.y, r.z); M.compose(V, Q.identity(), S); rings.setMatrixAt(i, M) }
      rings.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < ND; i++) { const d = D[i]; if (d.t >= 1) { dpos[i * 3 + 1] = -9999; continue } d.t += dt * .9; d.vy -= 9 * dt; d.x += d.vx * dt; d.z += d.vz * dt; d.y += d.vy * dt; dpos[i * 3] = d.x; dpos[i * 3 + 1] = d.y; dpos[i * 3 + 2] = d.z }
      dgeo.attributes.position.needsUpdate = true;
    } catch (_) {}
  }
  requestAnimationFrame(tick);
  /* fog azul-esverdeada e curta so durante o desenho quando a camera esta embaixo d'agua */
  const hook = () => {
    if (typeof renderer === 'undefined' || renderer.__agua628) return; renderer.__agua628 = true;
    const r0 = renderer.render;
    renderer.render = function (sc, cam) {
      if (under && sc === scene && scene.fog) { fogSave.c.copy(scene.fog.color); fogSave.d = scene.fog.density; scene.fog.color.copy(uwFog); scene.fog.density = .07; const bg = scene.background && scene.background.isColor ? scene.background.clone() : null; if (bg) scene.background.copy(uwFog); try { return r0.apply(this, arguments) } finally { scene.fog.color.copy(fogSave.c); scene.fog.density = fogSave.d; if (bg) scene.background.copy(bg) } }
      return r0.apply(this, arguments);
    };
  };
  window.addEventListener('load', () => setTimeout(hook, 1500));
})();
