/* v640 (Ian: "o que eu não vejo não pode estar sendo renderizado"): corte por quadro do que está fora da câmera.
   O three só corta o objeto inteiro pela esfera da geometria; InstancedMesh com frustumCulled=false (o jeito de evitar o corte errado
   das instâncias) era desenhado por inteiro, mesmo atrás do jogador. Aqui, a cada renderização do mundo:
   - InstancedMesh com frustumCulled=false (pedaços do cenário, árvores distantes em tiles) ganha uma esfera real (das instâncias,
     ou `userData.sph637`) e só é desenhado se a esfera cruza o frustum;
   - personagens com pele (SkinnedMesh sem corte) fora do frustum e a mais de 30 m não são desenhados (nem animados no desenho);
   - animação (mixer) de monstro fora da vista ou longe roda a 1/4 do ritmo, acumulando o tempo.
   Não mexe no que o CULL180 (árvores/casas do Tripo) e o golpes487 já controlam. Sem sombras em mapa (renderer.shadowMap desligado),
   então esconder o que está fora da câmera não muda a imagem. Números em `Culling637.stats()`. */
(function () {
  const T = THREE, F = new T.Frustum(), PM = new T.Matrix4(), V = new T.Vector3(), S = new T.Sphere(), S2 = new T.Sphere();
  const C = window.Culling637 = { dirty: true, list: [], skins: [], hid: 0, hidLod: 0, hidOcc: 0, smalls: [], total: 0, mixSkipped: 0, mixRan: 0, on: true, last: 0 };
  /* v697: chuva e respingos andam com a câmera; a esfera guardada ficava velha e escondia a chuva conforme você virava */
  const skip = m => m.userData.noCull695 || m.userData.tripo153 || m.userData.lite180 || m.userData.golpes487 || m.userData.ctx487 || m.userData.ol210 || /^(Grass|Flowers)/.test(m.name || '');
  function instSphere(m) {
    let s = m.userData.sph637; if (s) return s;
    const n = m.instanceMatrix.count, a = m.instanceMatrix.array; if (!n) return null;
    if (m.userData.key637 === n && m.userData.sph637b) return m.userData.sph637b;
    let sx = 0, sz = 0, sy = 0; for (let i = 0; i < n; i++) { sx += a[i * 16 + 12]; sy += a[i * 16 + 13]; sz += a[i * 16 + 14] } sx /= n; sy /= n; sz /= n;
    let r = 0; for (let i = 0; i < n; i++) r = Math.max(r, Math.hypot(a[i * 16 + 12] - sx, a[i * 16 + 14] - sz));
    const g = m.geometry; if (!g.boundingSphere) g.computeBoundingSphere();
    let ms = 1; for (let i = 0; i < n; i++) ms = Math.max(ms, a[i * 16], a[i * 16 + 5]);
    const sp = new T.Sphere(new T.Vector3(sx, sy + 8, sz), r + (g.boundingSphere.radius + 6) * ms + 12);
    m.userData.key637 = n; m.userData.sph637b = sp; return sp;
  }
  const QQ = new T.Quaternion(), SC = new T.Vector3();
  function refresh() {
    C.dirty = false; C.list.length = 0; C.skins.length = 0; C.smalls.length = 0;
    if (typeof L !== 'undefined' && L.group && L.group.visible) L.group.traverse(o => {
      if (!o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || o.frustumCulled === false || o.userData.noLod637) return;
      const g = o.geometry; if (!g) return; if (!g.boundingSphere) g.computeBoundingSphere(); if (!g.boundingSphere) return;
      const mt = o.material; if (!mt || Array.isArray(mt) || mt.fog === false) return;
      o.updateWorldMatrix(true, false); o.matrixWorld.decompose(V, QQ, SC);
      const r = g.boundingSphere.radius * Math.max(SC.x, SC.y, SC.z);
      if (r < 2.5) C.smalls.push({ o, r, x: o.matrixWorld.elements[12], z: o.matrixWorld.elements[14] });
    });
    scene.traverse(o => {
      if (o.frustumCulled !== false) return;
      if (o.isInstancedMesh) { if (!skip(o) && !(o.userData.isLite423)) C.list.push(o) }
      else if (o.isSkinnedMesh && !o.userData.fist162 && !o.userData.golpes487) C.skins.push(o);
    });
  }
  /* oclusão barata por relevo: tile de árvores distantes escondido atrás de serra/morro (3 raios câmera→tile sobre terrH) */
  function occluded(m, sp, cam, now) {
    const u = m.userData; if (u.occT637 && now - u.occT637 < 200) return u.occ637; u.occT637 = now;
    let res = false;
    try {
      const dx = sp.center.x - cam.position.x, dz = sp.center.z - cam.position.z, d = Math.hypot(dx, dz);
      if (d > 320 && typeof terrH === 'function') {
        const nx = -dz / d, nz = dx / d, lat = [0, sp.radius * .5, -sp.radius * .5]; let hiddenAll = true;
        for (const L2 of lat) {
          const tx = sp.center.x + nx * L2, tz = sp.center.z + nz * L2, ty = terrH(tx, tz) + 38; let blocked = false;
          for (let k = 1; k <= 7 && !blocked; k++) { const t = k / 8, x = cam.position.x + (tx - cam.position.x) * t, z = cam.position.z + (tz - cam.position.z) * t, ry = cam.position.y + (ty - cam.position.y) * t; if (terrH(x, z) > ry + 3) blocked = true }
          if (!blocked) { hiddenAll = false; break }
        }
        res = hiddenAll;
      }
    } catch (_) { }
    u.occ637 = res; if (res) C.hidOcc++; return res;
  }
  let t0 = 0;
  const base = renderer.render;
  renderer.render = function (s, cam, ...r) {
    if (s === scene && C.on && cam && L.mode !== undefined) {
      try {
        const now = performance.now(); if (C.dirty || now - t0 > 1000) { t0 = now; refresh() }
        cam.updateMatrixWorld(); PM.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse); F.setFromProjectionMatrix(PM);
        let hid = 0; const px = player ? player.x : 0, pz = player ? player.z : 0;
        for (const m of C.list) {
          if (!m.parent) continue;
          const sp = instSphere(m); if (!sp) continue;
          if (m.userData.h637 === undefined) m.userData.h637 = false;
          if (m.userData.h637 && m.visible) m.userData.h637 = false; /* alguém religou: assume o controle de volta */
          S.copy(sp).applyMatrix4(m.parent.matrixWorld);
          const out = !F.intersectsSphere(S) || (m.userData.sph637 && occluded(m, S, cam, now));
          if (out) { if (m.visible) { m.visible = false; m.userData.h637 = true } hid++ } else if (m.userData.h637) { m.visible = true; m.userData.h637 = false }
        }
        for (const m of C.skins) {
          if (!m.parent) continue;
          V.setFromMatrixPosition(m.matrixWorld); const d = Math.hypot(V.x - px, V.z - pz);
          S2.center.copy(V); S2.center.y += 2; S2.radius = 16;
          const out = d > 30 && !F.intersectsSphere(S2);
          if (out) { if (m.visible) { m.visible = false; m.userData.h637 = true } hid++ } else if (m.userData.h637) { m.visible = true; m.userData.h637 = false }
        }
        let lod = 0;
        for (const q of C.smalls) {
          const m = q.o; if (!m.parent) continue;
          const dx = q.x - px, dz = q.z - pz, lim = 45 + 55 * q.r, far = dx * dx + dz * dz > lim * lim;
          if (m.userData.h637 && m.visible) m.userData.h637 = false;
          if (far) { if (m.visible) { m.visible = false; m.userData.h637 = true } lod++ } else if (m.userData.h637) { m.visible = true; m.userData.h637 = false }
        }
        C.hidLod = lod; C.hid = hid; C.total = C.list.length + C.skins.length + C.smalls.length;
      } catch (e) { if (!C.w) { C.w = 1; console.warn('culling637', e) } C.on = false }
    }
    return base.call(this, s, cam, ...r);
  };
  /* animação: fora da vista ou longe -> 1 atualização a cada 4 quadros (ou 8 se > 150 m), com o tempo acumulado */
  C.mix = function (m, dt) {
    try {
      const r = m.root; if (!r || !C.on || !player) { m.mixer.update(dt); return }
      const dx = r.position.x - player.x, dz = r.position.z - player.z, d = Math.hypot(dx, dz);
      let slow = false;
      if (d > 14) { S2.center.set(r.position.x, 2, r.position.z); S2.radius = 8; slow = d > 70 || !F.intersectsSphere(S2) }
      if (!slow || m.mixer._dead637) { m.mixer.update((m.acc637 || 0) + dt); m.acc637 = 0; m.sk637 = 0; C.mixRan++; return }
      m.acc637 = (m.acc637 || 0) + dt;
      m.sk637 = (m.sk637 || 0) + 1; if (m.sk637 >= (d > 150 ? 8 : 4)) { m.mixer.update(m.acc637); m.acc637 = 0; m.sk637 = 0; C.mixRan++ } else C.mixSkipped++;
    } catch (e) { m.mixer.update(dt) }
  };
  C.stats = () => ({ candidatos: C.list.length, peles: C.skins.length, escondidos: C.hid, lod: C.hidLod, pequenas: C.smalls.length, ocl: C.hidOcc, mixRan: C.mixRan, mixSkipped: C.mixSkipped });
})();
