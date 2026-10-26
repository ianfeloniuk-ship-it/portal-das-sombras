/* Missão fixa #6 «A Caixa de Remédios Quebrada» (v611). Trilha das Colinas Centrais até Aster.
   Depois de resgatar os sobreviventes da carroça de Aldric (#5), uma sobrevivente segura uma caixa quebrada de remédios para a
   enfermaria de Aster e bandos de Lobo Fendido farejam o sangue. Escolha: carregar a caixa (velocidade -15%) ou dar cobertura rápida.
   Caixa intacta: +1 nível de Afinidade com Mira (e poções mais baratas em Aster, pela afinidade). Cobertura: salva 2 guardas da ronda externa. */
(function () {
  'use strict';
  let world = null, actors = [], foes = [], interaction = null, lastSave = 0, spawnT = 0;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q006 = profile.fixas545.q006 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  function a2() { return window.Campaign327?.state('a2'); }
  function mine() { const s = profile && profile.fixas545 && profile.fixas545.q006; return !!(s && s.phase && s.phase !== 'fim' && !s.done); }
  function aster() { return typeof regionCity === 'function' ? regionCity(0, 0) : { x: 0, z: 0, name: 'Aster' }; }
  const dAster = () => Math.hypot(player.x - aster().x, player.z - aster().z);
  function mk(id, name) {
    const m = NPC456.create(id), f = NPC456.figure(id, { m, name, down: false, x: player.x, z: player.z, t: 0 });
    m.root.userData.terrainAbsolute245 = true; scene.add(m.root); return f;
  }
  function spawnActors() {
    if (actors.length || !window.NPC456) return;
    actors = [mk('mulher', 'Sobrevivente'), mk('homem', 'Sobrevivente')];
    actors.forEach((f, i) => { f.x = player.x + 2 + i * 2; f.z = player.z + 3; });
  }
  function clearActors() { for (const f of actors) { try { scene.remove(f.m.root); } catch (_) {} } actors = []; foes = []; }
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'escolha'; save(); spawnActors(); setInter();
    try { toast('<b>[MISSÃO]</b> A caixa de remédios está quebrada. Fale com a sobrevivente.', 6000); } catch (_) {}
  }
  function setInter() {
    if (interaction && world && world.inter) world.inter = world.inter.filter(x => x !== interaction);
    interaction = null;
    const s = S();
    if (s.phase === 'escolha' && actors[0] && L.inter) { interaction = { x: actors[0].x, z: actors[0].z, r: 4, label: 'F · FALAR COM A SOBREVIVENTE', use: talk }; L.inter.push(interaction); }
  }
  function talk() {
    const s = S(); if (s.phase !== 'escolha' || !actors[0]) return;
    Dialogo520.custom({ name: 'Sobrevivente', title: 'Caravana de Dorian', type: 'caixa606' }, actors[0], () => ({ raiz: { t: 'Esta caixa de remédios é da enfermaria de Aster, mas está rachada. E tem lobos farejando o sangue na trilha. Se eu correr, os frascos quebram.', o: [
      { l: 'Carregar a caixa eu mesmo (15% mais lento)', fn: () => { choose('caixa'); return 'fim'; } },
      { l: 'Dar cobertura para vocês correrem até o portão', fn: () => { choose('cobertura'); return 'fim'; } }] } }));
  }
  function choose(c) {
    const s = S(); if (s.phase !== 'escolha') return;
    s.choice = c; s.phase = 'trilha'; s.t = Date.now(); save(); setInter();
    try { toast(c === 'caixa' ? '<b>[ESCOLHA]</b> Você leva a caixa. Está 15% mais lento; nenhum frasco pode quebrar.' : '<b>[ESCOLHA]</b> Você dá cobertura. Os sobreviventes correm na frente; guarde o flanco dos lobos.', 6500); } catch (_) {}
  }
  function finish() {
    const s = S(); if (s.done) return; s.done = true; s.phase = 'fim';
    if (s.choice === 'caixa') {
      profile.aff = profile.aff || {}; profile.aff.Mira = Math.min(10, (profile.aff.Mira || 0) + 1); s.intacta = true;
      try { toast('<b>[MIRA]</b> A caixa chegou intacta. Afinidade com Mira +1 nível; as poções de Aster ficam mais baratas.', 8000); } catch (_) {}
    } else {
      s.guardas = 2;
      try { if (typeof regionEvent116 === 'function') regionEvent116(aster(), 3, 0, 'Você deu cobertura à caravana e dois guardas da ronda externa voltaram vivos.'); } catch (_) {}
      try { toast('<b>[ASTER]</b> Você deu cobertura: dois guardas da ronda externa foram salvos.', 8000); } catch (_) {}
    }
    save(); clearActors();
  }
  function objective() {
    const s = S(); if (!mine()) return null; const c = aster();
    const text = s.phase === 'escolha' ? 'Fale com a sobrevivente da caixa quebrada [E]' : 'Leve a caixa de remédios até o Portão de Aster · lobos na trilha';
    return { actTitle: 'A CAIXA DE REMÉDIOS QUEBRADA', step: 5, totalSteps: 6, text, target: s.phase === 'escolha' && actors[0] ? { x: actors[0].x, z: actors[0].z } : { x: c.x + 70, z: c.z } };
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || L.mode !== 'world') return;
    if (world !== L) { clearActors(); world = L; interaction = null; }
    const a = a2(), s = S(); if (!s) return;
    if (!s.phase && !s.done && a && !a.done && a.s >= 3 && dAster() > 90 && !(typeof paused !== 'undefined' && paused) && !(window.Intro401 && window.Intro401.conversation)) begin();
    if (!mine() || player.dead || (typeof paused !== 'undefined' && paused)) return;
    spawnActors();
    if (s.phase === 'escolha' && !interaction) setInter();
    if (interaction && actors[0]) { interaction.x = actors[0].x; interaction.z = actors[0].z; }
    const sp = (s.choice === 'cobertura' ? 6.2 : 4.4) * dt;
    actors.forEach((f, i) => {
      const tx = player.x + (i ? 2.2 : -2.2), tz = player.z + 3, dx = tx - f.x, dz = tz - f.z, d = Math.hypot(dx, dz);
      if (d > 2.5) { f.x += dx / d * Math.min(sp, d); f.z += dz / d * Math.min(sp, d); f.m.root.rotation.y = Math.atan2(dx, dz); }
      f.m.root.position.set(f.x, terrH(f.x, f.z), f.z);
    });
    if (s.phase === 'trilha') {
      if (s.phase === 'trilha' && !s.packed) { s.packed = true; spawnT = 0; }
      foes = foes.filter(e => !e.dead);
      spawnT -= dt;
      const dd = dAster();
      if (spawnT <= 0 && foes.length < 2 && dd > 78) {
        spawnT = 14;
        for (let i = 0; i < 2; i++) {
          const ang = Math.atan2(player.z - aster().z, player.x - aster().x) + (i ? .3 : -.3), x = player.x + Math.cos(ang) * 22, z = player.z + Math.sin(ang) * 22;
          try { const e = spawnKind('lobo_f', x, z, 0, { wild: true }); e.name = e.short = 'Lobo Fendido'; e.hp = e.maxhp = Math.min(e.maxhp, 40 + 12 * (run.level || 1)); e.dmg = Math.min(e.dmg || 4, 4 + (run.level || 1)); e.aggro = true; e.caixa606 = true; foes.push(e); } catch (_) {}
        }
      }
      if (dd < 75) finish();
    }
    if (performance.now() - lastSave > 3000) { lastSave = performance.now(); save(); }
  }
  const mv = movementSpeed;
  movementSpeed = function (raw) { const v = mv(raw), s = profile && profile.fixas545 && profile.fixas545.q006; return s && s.phase === 'trilha' && s.choice === 'caixa' ? v * .85 : v; };
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); } catch (e) { console.warn('Caixa606', e); } if (window.Fixas545 && !Fixas545.LIVE.primeva_q006) Fixas545.LIVE.primeva_q006 = 'v611'; };
  window.Caixa606 = { active: mine, objective, begin, choose, state: S, get actors() { return actors; }, get foes() { return foes; } };
})();
