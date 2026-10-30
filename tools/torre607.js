/* Missão fixa #7 «Os Degraus da Torre da Vigília Antiga» (v613). Torre da Ascensão, 5 primeiros andares da subida do Ato III.
   Cada andar tem um archote rúnico raspado por mãos recentes. Escolha: purificar os archotes de cada andar antes de subir, ou avançar direto.
   Purificar os 5: o chefe do terraço causa 20% menos dano mágico e o Narrador deixa escapar a primeira falha de memória.
   (O chefe do terraço e a moeda de Logos são a missão #8, em tools/sentinela608.js.) */
(function () {
  'use strict';
  let meshes = [], floorKey = null, inter = null;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q007 = profile.fixas545.q007 || { pur: {} }; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  function a3() { const a = window.Campaign327 && Campaign327.state('a3'); if (!a || a.done || !a.base || a.s > 1) return null; const s = S(); if (!s.base) s.base = a.base; return a; }
  const inRange = f => { const a = a3(); return !!a && f > a.base - 5 && f <= a.base; };
  const count = () => Object.keys(S().pur || {}).length;
  function clearMeshes() { for (const m of meshes) { try { scene.remove(m); m.traverse(o => { o.geometry && o.geometry.dispose && o.geometry.dispose(); if (o.material && o.material.dispose) o.material.dispose(); }); } catch (_) {} } meshes = []; }
  function torch(x, z, lit) {
    const g = new THREE.Group();
    const post = new THREE.Mesh(new THREE.CylinderGeometry(.18, .26, 1.6, 8), new THREE.MeshStandardMaterial({ color: 0x4a443c, roughness: .95 }));
    post.position.y = .8; g.add(post);
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(.5, .3, .35, 10), new THREE.MeshStandardMaterial({ color: 0x302c28, roughness: .9 }));
    bowl.position.y = 1.75; g.add(bowl);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(.38, 1.1, 8), new THREE.MeshBasicMaterial({ color: lit ? 0x66d8ff : 0xb94a30, transparent: true, opacity: .9 }));
    flame.position.y = 2.5; flame.userData.flame = 1; g.add(flame);
    const light = new THREE.PointLight(lit ? 0x66d8ff : 0xff6a30, 1.4, 11); light.position.y = 2.6; g.add(light);
    g.position.set(x, 0, z); g.userData.terrainAbsolute245 = true; scene.add(g); meshes.push(g); return g;
  }
  function purify() {
    const s = S(), f = L.special && L.special.floor; if (!f || !inRange(f) || s.pur[f]) return;
    s.pur[f] = 1; save();
    clearMeshes(); torch(6, -2, true);
    if (inter) { const i = L.inter.indexOf(inter); if (i >= 0) L.inter.splice(i, 1); inter = null; }
    try { sfx('level'); floater(player.x, player.z, 'ARCHOTE PURIFICADO', '#66d8ff', true); } catch (_) {}
    try { toast('<b>[TORRE]</b> Archote purificado (' + count() + '/5). Os sinais de contenção voltam a brilhar.', 4500); } catch (_) {}
    if (count() >= 5) {
      s.todos = true; save();
      try { toast('<b>[TORRE]</b> Os cinco archotes estão acesos: o chefe do terraço vai causar 20% menos dano mágico.', 7000); } catch (_) {}
      try { narratorSayTop('Vocês chegaram a esta parte.', 7500); } catch (_) {}
      try { toast('<b>[NARRADOR]</b> — Vocês chegaram a esta parte. (A voz repete uma frase que já disse. Ela não se lembra de ter dito.)', 8000); } catch (_) {}
    }
  }
  function floorTick() {
    const sp = L.special, f = sp && sp.kind === 'tower' ? sp.floor : 0, key = f ? f + ':' + (sp.t > 0 ? 1 : 0) : null;
    const id = f ? sp.floor + '#' + (L.id || '') : null;
    if (f && inRange(f) && floorKey !== f + '|' + (sp.startedAt || (sp.startedAt = performance.now()))) {
      floorKey = f + '|' + sp.startedAt; clearMeshes(); inter = null;
      const lit = !!S().pur[f];
      torch(6, -2, lit);
      if (!lit) { inter = { x: 6, z: -2, r: 3.4, label: 'F · PURIFICAR O ARCHOTE RÚNICO (' + count() + '/5)', use: purify }; L.inter.push(inter); }
      if (f === a3().base - 4) try { toast('<b>[TORRE]</b> As pedras mostram sinais de contenção raspados por mãos recentes. Purifique o archote de cada andar antes de subir, ou avance direto.', 8000); } catch (_) {}
    }
    if ((!f || !inRange(f)) && meshes.length) { clearMeshes(); floorKey = null; inter = null; }
    for (const m of meshes) m.traverse(o => { if (o.userData && o.userData.flame) o.scale.y = 1 + Math.sin(performance.now() / 140) * .12; });
  }
  function objective() {
    const a = a3(); if (!a || typeof L === 'undefined' || !L.special || L.special.kind !== 'tower') return null;
    const f = L.special.floor; if (!inRange(f)) return null;
    return { actTitle: 'OS DEGRAUS DA TORRE ANTIGA', step: 1, totalSteps: 3, text: 'Andar ' + f + ' de ' + a.base + ' · archotes purificados ' + count() + '/5 [E]', target: null };
  }
  const pu = update;
  update = function () { pu.apply(this, arguments); try { if (typeof L !== 'undefined' && L.special) floorTick(); else if (meshes.length) { clearMeshes(); floorKey = null; } if (window.Fixas545 && !Fixas545.LIVE.primeva_q007) Fixas545.LIVE.primeva_q007 = 'v613'; } catch (e) { console.warn('Torre607', e); } };
  window.Torre607 = { state: S, count, inRange, purify, objective };
})();
