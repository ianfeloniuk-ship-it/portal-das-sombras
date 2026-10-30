/* Missão fixa #26 «Juramento de Ferro nas Ameias» (v729). Facção Vanguarda da Muralha, Aster.
   Gatilho: falar com Brann [E] depois do nível 5. Três veteranos treinam com você no campo de treino diante da muralha norte (o pátio interno fica sob o tiro das sentinelas, que atiram em tudo perto da muralha): bloqueio e aparo (botão do meio do mouse, tools/guard472.js).
   Os veteranos batem leve e se rendem com 20% de vida (a lição é a guarda, não o dano). Depois, uma patrulha de 3 Goblins Fendidos na Estrada Norte.
   Escolha (pelo que você faz): vencer o treino com aparos perfeitos (pelo menos 3 aparos, sem quebrar a própria guarda) ganha o respeito de Edran e o broche de Recruta da Vanguarda (+5% de escudo, marca broche726);
   vencer só na força bruta (sem os 3 aparos ou quebrando a guarda) não rende broche.
   Estado em profile.fixas545.q026.
   Simplificações: os veteranos são mercenários comuns com dano reduzido (sem animação de treino nem «guarda» dos recrutas); o escudo +5% é a marca broche726 (sem item no equipamento);
   «respeito de Edran» é a marca respeitoEdran; a contagem de aparos vem de Guard472.stats. */
(function () {
  'use strict';
  let world = null, worldT = 0, vets = [], goblins = [], brann = null, inter = null, busy = false, lastSave = 0, p0 = 0, b0 = 0, held = 0;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q026 = profile.fixas545.q026 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q026; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  const lvl = () => { try { return run.level || 1; } catch (_) { return 1; } };
  const brannNpc = () => npcs.find(n => !n.gone && (n.short === 'Brann' || n.name === 'Brann'));
  const yard = () => ({ x: 0, z: -95 });
  const NORTE = { x: 0, z: -170 };
  const G = () => window.Guard472 && Guard472.stats;
  if (typeof LORE !== 'undefined') {
    LORE.q026_aparos = ['Juramento de Ferro', 'Você venceu o treino da Vanguarda da Muralha só com aparos perfeitos e limpou a patrulha de Goblins Fendidos na Estrada Norte. Edran ganhou respeito por você e Brann lhe deu o broche de Recruta da Vanguarda (+5% de escudo).'];
    LORE.q026_forca = ['Juramento de Ferro', 'Você derrubou os veteranos na força bruta e limpou a patrulha de Goblins Fendidos na Estrada Norte. Brann aceitou o juramento, mas sem o broche: aparar é a disciplina da guarda.'];
  }
  function dropInter() { if (inter && L.inter) L.inter = L.inter.filter(i => i !== inter); inter = null; }
  function mkInter() {
    const b = brannNpc(); if (!b || inter && L.inter.includes(inter)) return; dropInter();
    inter = { x: b.x, z: b.z, r: 4, label: 'E · FALAR COM BRANN: JURAMENTO DE FERRO', use: falar }; L.inter.push(inter);
  }
  function falar() {
    const s = S(); if (s.phase || s.done) return;
    if (lvl() < 5) { try { toast('<b>Brann:</b> Volte quando tiver nível 5.', 4000); } catch (_) {} return; }
    s.phase = 'treino'; p0 = G() ? G().parries : 0; b0 = G() ? G().breaks : 0; s.p0 = p0; save(); dropInter();
    try { toast('<b>[BRANN]</b> Três veteranos no campo de treino diante da muralha norte (as sentinelas da muralha atiram em tudo perto dela, por isso o treino é fora do alcance delas). Teste seu bloqueio e aparo (botão do meio do mouse). Aparos perfeitos valem mais que força: eles se rendem com pouca vida. Depois limpe a patrulha de Goblins Fendidos na Estrada Norte.', 13000); } catch (_) {}
  }
  function foe(kind, name, x, z) {
    let e = null;
    for (let i = 0; i < 8; i++) { e = spawnKind(kind, x, z, Math.min(9, rankOf()), { wild: true }); if (e.kind === kind) break; e.gone = e.dead = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    e.siege = true; e.name = e.short = name; return e;
  }
  function spawnVets() {
    const y = yard(); vets = [];
    for (let i = 0; i < 3; i++) { try { const e = foe('rogue', 'Veterano da Vanguarda', y.x - 6 + i * 6, y.z - 2); e.dmg *= .15; e.hp = e.maxhp = Math.round(e.maxhp * 1.2); e.aggro = true; e.vet726 = true; vets.push(e); } catch (_) {} }
  }
  function spawnGoblins() {
    goblins = [];
    for (let i = 0; i < 3; i++) { try { const e = foe('goblin', 'Goblin Fendido da Patrulha', NORTE.x - 6 + i * 6, NORTE.z); e.aggro = false; e.gob726 = true; goblins.push(e); } catch (_) {} }
  }
  function finish() {
    const s = S(); const ap = (G() ? G().parries : 0) - (s.p0 || 0), br = (G() ? G().breaks : 0) - b0;
    s.done = true; s.phase = 'fim'; s.t = Date.now(); s.aparos = ap;
    if (ap >= 3 && br === 0) { s.escolha = 'aparos'; s.broche726 = true; s.respeitoEdran = true; profile.broche726 = true; try { unlockLore('q026_aparos'); } catch (_) {} try { toast('<b>[BRANN]</b> Juramento aceito. Aparos limpos: Edran lhe deve respeito e você recebe o broche de Recruta da Vanguarda (+5% de escudo).', 11000); } catch (_) {} }
    else { s.escolha = 'forca'; try { unlockLore('q026_forca'); } catch (_) {} try { toast('<b>[BRANN]</b> Juramento aceito, mas sem broche: você venceu na força. Aparar é a disciplina da guarda.', 10000); } catch (_) {} }
    save();
  }
  function objective() {
    const ph = phase(); let text, target = yard();
    if (!ph) { if (lvl() >= 5 && brannNpc()) return null; return null; }
    if (ph === 'treino') { text = 'Vença os 3 veteranos no campo de treino ao norte (aparos com o botão do meio: ' + Math.max(0, (G() ? G().parries : 0) - (S().p0 || 0)) + ' de 3)'; const v = vets.find(e => !e.dead && !e.yield726); if (v) target = { x: v.x, z: v.z }; }
    else { text = 'Limpe a patrulha de Goblins Fendidos na Estrada Norte'; const g = goblins.find(e => !e.dead); target = g ? { x: g.x, z: g.z } : NORTE; }
    return { actTitle: 'JURAMENTO DE FERRO NAS AMEIAS', step: ph === 'treino' ? 2 : 3, totalSteps: 4, text, target };
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile || L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); vets = []; goblins = []; inter = null; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s || s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase && free && lvl() >= 5) mkInter();
    if (s.phase === 'treino') {
      if (!vets.length && free && Math.hypot(player.x - yard().x, player.z - yard().z) < 55) spawnVets();
      else if (vets.length && vets.some(e => e.gone && !e.dead && !e.yield726) && free) vets = [];
      for (const e of vets) if (!e.dead && !e.gone && !e.yield726 && e.hp <= e.maxhp * .2) { e.yield726 = true; e.aggro = false; e.act = null; try { floater(e.x, e.z, 'SE RENDEU', '#ffd76a', true, 2.2); } catch (_) {} }
      for (const e of vets) if (e.yield726 && !e.dead) { e.aggro = false; e.act = null; }
      for (const e of vets) if (!e.yield726 && !e.dead && !e.gone && Math.hypot(e.x - player.x, e.z - player.z) < 40) e.aggro = true;
      if (vets.length && !vets.some(e => e.gone && !e.dead && !e.yield726) && vets.every(e => e.dead || e.gone || e.yield726)) {
        s.phase = 'patrulha'; save(); for (const e of vets) { e.gone = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
        try { toast('<b>[BRANN]</b> Os veteranos se rendem. Agora a patrulha de Goblins Fendidos na Estrada Norte.', 8000); } catch (_) {}
      }
    }
    if (s.phase === 'patrulha') {
      if (!goblins.length && free && Math.hypot(player.x - NORTE.x, player.z - NORTE.z) < 55) spawnGoblins();
      for (const e of goblins) if (!e.dead && !e.gone && !e.aggro && Math.hypot(e.x - player.x, e.z - player.z) < 14) e.aggro = true;
      if (goblins.length && goblins.every(e => e.dead)) finish();
      else if (goblins.length && goblins.some(e => e.gone && !e.dead) && free) goblins = [];
    }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q026) Fixas545.LIVE.primeva_q026 = 'v729'; } catch (e) { console.warn('Juramento729', e); } };
  window.Juramento726 = { state: S, active, objective, begin: falar, get vets() { return vets; }, get goblins() { return goblins; }, get inter() { return inter; } };
})();
