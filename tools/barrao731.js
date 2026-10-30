/* Missão fixa #28 «Alvo Notório: Barrão, o Quebra-Cercas» (v731). Facção Vanguarda da Muralha. Gatilho (simplificado): concluir a #27 (o contrato de Alvo Notório Rank E).
   Barrão, uma besta colossal (gigante com 2× vida) que destrói as cercas das fazendas, está nos Campos a leste de Aster (150, 0), a ~110 m da muralha.
   Escolha: erguer 3 estacas da paliçada estreita [E] em x = 120 antes da investida (quando Barrão as alcança fica preso: atordoado e perde 35% da vida, uma vez),
   ou enfrentá-lo em campo aberto. Nos dois casos, vencê-lo dá o título «Caçador do Quebra-Cercas» (profile.titulo728, marca de +2% de dano) e +75 de Reputação da Ordem.
   Estado em profile.fixas545.q028.
   Simplificações: o «moinho velho» e as pistas do Diário são só o aviso; sem carroças de feno; o +2% de dano é uma marca (profile.bonusDano728), sem efeito no cálculo ainda; a paliçada é 3 estacas fixas (sem material). */
(function () {
  'use strict';
  let world = null, worldT = 0, barrao = null, stakes = [], busy = false, lastSave = 0;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q028 = profile.fixas545.q028 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const SPOT = { x: 150, z: 0 }, STK = [[120, -6], [120, 0], [120, 6]];
  const q27 = () => profile && profile.fixas545 && profile.fixas545.q027;
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q028; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  const dS = () => Math.hypot(player.x - SPOT.x, player.z - SPOT.z);
  if (typeof LORE !== 'undefined') {
    LORE.q028_palicada = ['Barrão, o Quebra-Cercas', 'Você ergueu uma paliçada estreita nos Campos a leste de Aster e Barrão ficou preso nela na investida. Título: Caçador do Quebra-Cercas (+2% de dano) e +75 de Reputação da Ordem.'];
    LORE.q028_campo = ['Barrão, o Quebra-Cercas', 'Você enfrentou Barrão em campo aberto, nos Campos a leste de Aster. Título: Caçador do Quebra-Cercas (+2% de dano) e +75 de Reputação da Ordem.'];
  }
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'rota'; save();
    try { toast('<b>[MISSÃO]</b> Alvo Notório, Barrão o Quebra-Cercas: uma besta colossal destrói as cercas das fazendas. As pistas do Diário apontam para o moinho velho nos Campos, a leste de Aster.', 10000); } catch (_) {}
  }
  function foe(kind, name, x, z) {
    let e = null;
    for (let i = 0; i < 8; i++) { e = spawnKind(kind, x, z, Math.min(9, rankOf()), { wild: true }); if (e.kind === kind) break; e.gone = e.dead = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    e.siege = true; e.name = e.short = name; return e;
  }
  function addInter(label, x, z, fn) { const i = { x, z, r: 3.5, label, use: fn }; L.inter.push(i); return i; }
  function rmInter(i) { if (i && L.inter) L.inter = L.inter.filter(k => k !== i); }
  function mkStakes() {
    for (const k of stakes) { rmInter(k.inter); try { scene.remove(k.m); } catch (_) {} }
    stakes = STK.map(([x, z]) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, 1, 6), new THREE.MeshStandardMaterial({ color: 0x6a5030 })); m.position.set(x, terrH(x, z) + .1, z); m.scale.y = .2; m.userData.terrainAbsolute245 = true; scene.add(m);
      const k = { x, z, m, built: false, inter: null }; k.inter = addInter('E · ERGUER ESTACA DA PALIÇADA', x, z, () => build(k)); return k;
    });
  }
  function build(k) {
    const s = S(); if (k.built || s.phase !== 'campo') return; k.built = true; rmInter(k.inter); k.inter = null;
    try { k.m.scale.y = 3; k.m.position.y = terrH(k.x, k.z) + 1.5; } catch (_) {}
    s.estacas = stakes.filter(a => a.built).length; save();
    try { toast(s.estacas >= 3 ? 'Paliçada pronta: 3 estacas. Barrão vem pela estrada.' : 'Estaca erguida (' + s.estacas + ' de 3).', 4000); } catch (_) {}
  }
  function spawnBarrao() {
    try { barrao = foe(KINDS.gigante ? 'gigante' : 'colosso', 'Barrão, o Quebra-Cercas', SPOT.x, SPOT.z); barrao.hp = barrao.maxhp = Math.round(barrao.maxhp * 2); barrao.aggro = false; barrao.barrao731 = true; barrao.hpIni731 = barrao.hp; } catch (_) { barrao = null; }
  }
  function startCampo() {
    const s = S(); s.phase = 'campo'; save(); mkStakes(); spawnBarrao();
    try { toast('<b>[CAMPOS]</b> Barrão, a besta colossal, pasta entre as cercas quebradas. Erga as 3 estacas da paliçada estreita [E] antes da investida, ou enfrente-o em campo aberto.', 11000); } catch (_) {}
  }
  function finish() {
    const s = S(); s.done = true; s.phase = 'fim'; s.t = Date.now(); for (const k of stakes) rmInter(k.inter);
    s.escolha = s.preso ? 'palicada' : 'campo'; profile.titulo728 = 'Caçador do Quebra-Cercas'; profile.bonusDano728 = .02;
    try { addOrderRep(75, 'Barrão, o Quebra-Cercas'); } catch (_) {}
    try { unlockLore(s.preso ? 'q028_palicada' : 'q028_campo'); } catch (_) {}
    try { toast('<b>[TÍTULO]</b> Caçador do Quebra-Cercas (+2% de dano) e <b>+75 de Reputação da Ordem</b>.', 10000); } catch (_) {}
    save();
  }
  function objective() {
    const ph = phase(); if (!ph) return null; const s = S(); let text, target = SPOT;
    if (ph === 'rota') text = 'Siga as pistas até o moinho velho, nos Campos a leste de Aster';
    else { text = 'Erga a paliçada [E] (' + (s.estacas || 0) + ' de 3) e derrube Barrão, ou enfrente-o em campo aberto'; if (barrao && !barrao.dead) target = { x: barrao.x, z: barrao.z }; }
    return { actTitle: 'ALVO NOTÓRIO: BARRÃO, O QUEBRA-CERCAS', step: ph === 'rota' ? 2 : 3, totalSteps: 4, text, target };
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile || L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); barrao = null; stakes = []; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s || s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) { if (q27() && q27().done && free) begin(); return; }
    if (s.phase === 'rota' && free && dS() < 55) startCampo();
    if (s.phase === 'campo') {
      if (!stakes.length && free) mkStakes();
      if (barrao && !barrao.dead && !barrao.gone) {
        const pd = Math.hypot(barrao.x - player.x, barrao.z - player.z);
        if (!barrao.aggro && (barrao.hp < barrao.hpIni731 || pd < 30 || (s.estacas || 0) >= 3)) barrao.aggro = true;
        if (barrao.aggro && pd > 4 && !(barrao.stun > 0)) { /* investida: avança direto para você */ const dx = player.x - barrao.x, dz = player.z - barrao.z; try { moveEnt(barrao, dx / pd * (barrao.speed || 2) * 1.8 * dt, dz / pd * (barrao.speed || 2) * 1.8 * dt); } catch (_) {} }
        if (!s.preso && (s.estacas || 0) >= 3 && stakes.some(k => Math.hypot(barrao.x - k.x, barrao.z - k.z) < 5)) {
          s.preso = true; barrao.stun = 4; barrao.hp = Math.max(1, barrao.hp - barrao.maxhp * .35); try { floater(barrao.x, barrao.z, 'PRESO NA PALIÇADA', '#ffd76a', true, 2.4); } catch (_) {} save();
        }
      } else if (barrao && barrao.dead) finish();
      else if (barrao && barrao.gone && free) barrao = null;
      if (!barrao && free && dS() < 55 && s.phase === 'campo') spawnBarrao();
    }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q028) Fixas545.LIVE.primeva_q028 = 'v731'; } catch (e) { console.warn('Barrao731', e); } };
  window.Barrao728 = { state: S, active, objective, begin, get barrao() { return barrao; }, get stakes() { return stakes; } };
})();
