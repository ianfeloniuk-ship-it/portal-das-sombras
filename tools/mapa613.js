/* Missão fixa #13 «O Mapa Astral no Centésimo Degrau» (v651). Topo da Torre da Ascensão (andar 100). Ato VII, depois da defesa de Aster (#12).
   Limpo o andar 100, o mapa astral aparece suspenso no ar entre fragmentos de pedra, com uma Rasgada do Mundo de Duas Luas ao lado.
   As rotas parecem levar aos mundos natais; acima do nome do Arquiteto há uma ordem superior. Escolha: tocar o selo luminoso que lembra a porta
   da sua casa, ou seguir o aviso do Narrador («Não toque ainda») e copiar a hierarquia.
   Copiar: os Superiores do Arquiteto entram no Diário e +5 de Vontade, com resistência a ilusões mentais (marca `resiste`). Tocar: vê a porta de casa
   e perde a cópia. Estado em profile.fixas545.q013. A «placa de Edran no portão» do gatilho original não existe no jogo: basta a #12. */
(function () {
  'use strict';
  const CZ = -15;
  let sceneL = null, grp = null, frags = [], figure = null, inter = null, busy = false;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q013 = profile.fixas545.q013 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const q12 = () => profile && profile.fixas545 && profile.fixas545.q012;
  const unlocked = () => { const q = q12(); return !!(q && q.done); };
  const phase = () => { if (!unlocked()) return null; const s = S(); return s && !s.done ? (s.phase || 'subir') : null; };
  const active = () => !!phase();
  const onTop = () => typeof L !== 'undefined' && L.special && L.special.kind === 'tower' && L.special.floor === 100;
  if (typeof LORE !== 'undefined') {
    LORE.q013_superiores = ['Os Superiores do Arquiteto', 'No mapa astral do topo da Torre havia uma ordem acima do nome do Arquiteto: os Superiores. Você copiou a hierarquia antes de tocar em qualquer selo, e agora ela está no Diário. Conter o impulso lhe deixou a mente mais firme (+5 de Vontade, resistência a ilusões mentais).'];
    LORE.q013_selo = ['O selo que lembrava a porta de casa', 'Você tocou o selo luminoso. Por um instante viu a porta da sua casa, e o mapa se fechou. A hierarquia acima do Arquiteto não foi copiada.'];
  }

  function box(w, h, d, c, e) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: c, roughness: .8, emissive: e || 0, emissiveIntensity: e ? .8 : 0 })); }
  function build() {
    grp = new THREE.Group();
    const cx = 0, cz = CZ, cy = 3.2;
    /* fragmentos de pedra no ar, em anel, cada um com um ponto de luz (as rotas) */
    for (let i = 0; i < 14; i++) {
      const a = i / 14 * Math.PI * 2, r = 2.6 + (i % 3) * .5, h = .35 + (i % 4) * .12;
      const f = box(.9 + (i % 3) * .25, h, .7 + (i % 2) * .3, 0x4a4660, i % 2 ? 0x2a50a0 : 0xa07a20);
      f.position.set(cx + Math.cos(a) * r, cy + Math.sin(a * 2) * .5, cz + Math.sin(a) * r); f.userData.a = a; f.userData.r = r; f.userData.y = f.position.y; grp.add(f); frags.push(f);
    }
    const core = new THREE.Mesh(new THREE.SphereGeometry(.4, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffe9a0, transparent: true, opacity: .85 }));
    core.position.set(cx, cy, cz); grp.add(core); frags.push(core); core.userData.core = 1;
    for (const [dy, c] of [[1.5, 0x8aa0ff], [1.9, 0xffd070]]) { const rg = new THREE.Mesh(new THREE.TorusGeometry(1.1 + dy * .3, .04, 6, 36), new THREE.MeshBasicMaterial({ color: c })); rg.rotation.x = Math.PI / 2; rg.position.set(cx, cy + dy - 1, cz); grp.add(rg); frags.push(rg); rg.userData.spin = 1; }
    /* o selo luminoso que lembra uma porta */
    const seal = new THREE.Group(); const frame = box(1.4, 2.2, .12, 0x2a2018, 0xffb060); const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.9), new THREE.MeshBasicMaterial({ color: 0xffe0a0, transparent: true, opacity: .9 }));
    glow.position.z = .08; seal.add(frame); seal.add(glow); seal.position.set(cx + 5.2, 1.4, cz + 1); seal.rotation.y = -1.1; grp.add(seal);
    L.group.add(grp);
    try {
      const m = NPC456.create('mulher'); figure = NPC456.figure('mulher', { m, name: 'Rasgada do Mundo de Duas Luas', down: false, x: cx - 4.2, z: cz + 2.5, t: 0 });
      m.root.userData.terrainAbsolute245 = true; m.root.position.set(cx - 4.2, 0, cz + 2.5); m.root.rotation.y = Math.PI * .8; scene.add(m.root);
    } catch (_) { figure = null; }
    inter = { x: cx, z: cz + 2.2, r: 4, label: 'E · EXAMINAR O MAPA ASTRAL', use: examine }; L.inter.push(inter);
    S().phase = 'mapa'; save();
    try { toast('<b>[TORRE]</b> No alto da Torre o mapa não está no chão: está suspenso no ar, entre fragmentos de pedra. Há outra Rasgada diante dele.', 8000); } catch (_) {}
  }
  function drop() {
    if (grp) { try { L.group && L.group.remove(grp); } catch (_) {} grp.traverse(o => { o.geometry && o.geometry.dispose && o.geometry.dispose(); }); }
    if (figure) { try { scene.remove(figure.m.root); } catch (_) {} }
    if (inter && L.inter) L.inter = L.inter.filter(i => i !== inter);
    grp = figure = inter = null; frags = [];
  }
  function examine() {
    const s = S(); if (s.done || busy) return;
    const npc = figure || { x: -4, z: -4.5, name: 'Rasgada' };
    Dialogo520.custom({ name: 'Rasgada do Mundo de Duas Luas', title: 'Topo da Torre da Ascensão', type: 'mapa613' }, npc, () => ({
      raiz: { t: 'Você também reconhece, não é? Rotas inteiras, e algumas parecem levar para casa. Mas olhe mais alto: há uma ordem escrita acima do nome do Arquiteto. O selo ali ao lado tem a forma da porta da minha casa... da sua também? O Narrador sussurra: «Não toque ainda.»', o: [
        { l: 'Tocar o selo luminoso que lembra a porta da sua casa', fn: () => { choose('tocar'); return 'fim'; } },
        { l: 'Seguir o aviso do Narrador e copiar a hierarquia superior', fn: () => { choose('copiar'); return 'fim'; } }] }
    }));
  }
  function choose(c) {
    const s = S(); if (s.done) return;
    s.escolha = c; s.done = true; s.phase = 'fim'; s.t = Date.now();
    if (inter && L.inter) L.inter = L.inter.filter(i => i !== inter); inter = null;
    if (c === 'copiar') {
      s.superiores = true; s.resiste = true;
      if (!s.von) { s.von = true; try { run.stats.von = (run.stats.von || 0) + 5; } catch (_) {} try { if (typeof refreshStats === 'function') refreshStats(); } catch (_) {} }
      try { unlockLore('q013_superiores'); } catch (_) {}
      try { toast('<b>[ESCOLHA]</b> Você contém o impulso e copia a inscrição. Os Superiores do Arquiteto entram no Diário. +5 de Vontade e resistência a ilusões mentais.', 10000); } catch (_) {}
    } else {
      try { unlockLore('q013_selo'); } catch (_) {}
      try { toast('<b>[ESCOLHA]</b> Você toca o selo: a porta da sua casa aparece por um instante e o mapa se fecha. A hierarquia acima do Arquiteto não foi copiada.', 10000); } catch (_) {}
      try { if (typeof bigText === 'function') bigText('A PORTA DE CASA', 1600); } catch (_) {}
    }
    save();
  }

  function objective() {
    const ph = phase(); if (!ph) return null;
    let text = 'Suba ao andar 100 da Torre da Ascensão: o mapa astral está no topo';
    if (onTop()) text = L.special.cleared ? 'Examine o mapa astral suspenso [E]' : 'Derrote o chefe do andar 100';
    return { actTitle: 'O MAPA ASTRAL NO CENTÉSIMO DEGRAU', step: onTop() && L.special.cleared ? 3 : 2, totalSteps: 3, text, target: null };
  }

  function tick(dt) {
    if (typeof L === 'undefined' || !profile) return;
    if (sceneL && sceneL !== L) { drop(); sceneL = null; }
    if (!unlocked()) return;
    const s = S(); if (!s) return;
    if (!sceneL && onTop() && L.special.cleared && !s.done && !grp) { sceneL = L; build(); }
    if (grp) { const t = performance.now() / 1000; for (const f of frags) { if (f.userData.a != null) { const a = f.userData.a + t * .25; f.position.x = Math.cos(a) * f.userData.r; f.position.z = CZ + Math.sin(a) * f.userData.r; f.position.y = f.userData.y + Math.sin(t * 1.5 + f.userData.a) * .15; f.rotation.y = t * .6; } else if (f.userData.spin) f.rotation.z = t * .5; else if (f.userData.core) f.scale.setScalar(1 + Math.sin(t * 3) * .08); } }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q013) Fixas545.LIVE.primeva_q013 = 'v651'; } catch (e) { console.warn('Mapa613', e); } };
  window.Mapa613 = { state: S, active, objective, choose, examine, onTop };
})();
