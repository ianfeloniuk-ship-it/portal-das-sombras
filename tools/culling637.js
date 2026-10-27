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
  const C = window.Culling637 = { dirty: true, list: [], skins: [], hid: 0, total: 0, mixSkipped: 0, mixRan: 0, on: true, last: 0 };
  const skip = m => m.userData.tripo153 || m.userData.lite180 || m.userData.golpes487 || m.userData.ctx487 || m.userData.ol210 || /^(Grass|Flowers)/.test(m.name || '');
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
  function refresh() {
    C.dirty = false; C.list.length = 0; C.skins.length = 0;
    scene.traverse(o => {
      if (o.frustumCulled !== false) return;
      if (o.isInstancedMesh) { if (!skip(o) && !(o.userData.isLite423)) C.list.push(o) }
      else if (o.isSkinnedMesh && !o.userData.fist162 && !o.userData.golpes487) C.skins.push(o);
    });
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
          const out = !F.intersectsSphere(S);
          if (out) { if (m.visible) { m.visible = false; m.userData.h637 = true } hid++ } else if (m.userData.h637) { m.visible = true; m.userData.h637 = false }
        }
        for (const m of C.skins) {
          if (!m.parent) continue;
          V.setFromMatrixPosition(m.matrixWorld); const d = Math.hypot(V.x - px, V.z - pz);
          S2.center.copy(V); S2.center.y += 2; S2.radius = 16;
          const out = d > 30 && !F.intersectsSphere(S2);
          if (out) { if (m.visible) { m.visible = false; m.userData.h637 = true } hid++ } else if (m.userData.h637) { m.visible = true; m.userData.h637 = false }
        }
        C.hid = hid; C.total = C.list.length + C.skins.length;
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
  C.stats = () => ({ candidatos: C.list.length, peles: C.skins.length, escondidos: C.hid, mixRan: C.mixRan, mixSkipped: C.mixSkipped });
})();
