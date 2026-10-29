/* Missão fixa #15 «A Primeira Âncora: O Trono de Gelo de Ymiria» (v684). Ato IX, depois da #14.
   Você cruza o Desfiladeiro das Lágrimas até Ymiria (0, -3400). A Pedra-Âncora de cristal azul flutua sob ataque do Golias de Geada, cercado por Filhotes de Yeti assustados.
   Poupar: guarde a arma (X) perto dos filhotes e mate só o Golias. O Yeti Alfa se alia a Ymiria, os menores fogem quando o chefe cai, avisos de nevasca no norte
   e o 1º Relato Ancestral intacto. Atacar tudo: se algum filhote morrer pela sua mão, não há aliança nem avisos, e o Relato fica danificado.
   Estado em profile.fixas545.q015. Simplificações: o frio do desfiladeiro usa o sistema de frio que já existe (fogueira e chá térmico); o Golias é um Yeti chefe com vida alta;
   «avisos de nevasca» = marca `avisosNevasca` e um aviso no Diário. */
(function () {
  'use strict';
  let world = null, worldT = 0, golias = null, pups = [], alfa = null, busy = false, lastSave = 0, killedPups = 0;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q015 = profile.fixas545.q015 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const city = () => { try { const n = nearestCity(0, -3400); if (n && n.c && n.c.name === 'Ymiria') return n.c; } catch (_) {} return { x: 0, z: -3392, name: 'Ymiria' }; };
  const q14 = () => profile && profile.fixas545 && profile.fixas545.q014;
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q015; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  const dC = () => { const c = city(); return Math.hypot(player.x - c.x, player.z - c.z); };
  if (typeof LORE !== 'undefined') {
    LORE.q015_poupar = ['O Trono de Gelo de Ymiria', 'Você guardou a arma diante dos Filhotes de Yeti e abateu só o Golias de Geada. O Yeti Alfa se aliou a Ymiria, os menores fugiram em pânico quando o chefe caiu, os avisos de nevasca passaram a soar no norte e o 1º Relato Ancestral ficou intacto.'];
    LORE.q015_atacar = ['A câmara de gelo manchada', 'Você atacou tudo na câmara com dano em área. O Golias caiu, mas os filhotes caíram com ele. Não houve aliança nem avisos de nevasca, e o 1º Relato Ancestral ficou danificado.'];
  }
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'rota'; save();
    try { toast('<b>[MISSÃO]</b> A Primeira Âncora: cruze o Desfiladeiro das Lágrimas até Ymiria (0, -3400). Mantenha fogueira ou Chá Térmico contra o frio.', 9000); } catch (_) {}
  }
  function foe(kind, name, x, z, boss) {
    let e = null; /* o mundo às vezes troca a espécie ao nascer (draugr): descarta e tenta de novo */
    for (let i = 0; i < 8; i++) { e = spawnKind(kind, x, z, Math.min(9, rankOf()), { wild: true }); if (e.kind === kind) break; e.gone = e.dead = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    e.siege = true; /* cityRaider341: a regra da cidade segura (390-ia) não empurra o monstro para fora das muralhas */
    e.name = e.short = name; return e;
  }
  function startChamber() {
    const s = S(), c = city(); s.phase = 'golias'; if (s.pupsMortos == null) s.pupsMortos = 0; save(); killedPups = s.pupsMortos;
    for (const e of [golias].concat(pups)) if (e && !e.dead) { e.gone = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    try {
      golias = foe('yeti', 'Golias de Geada', c.x + 10, c.z + 6);
      golias.hp = golias.maxhp = Math.round(golias.maxhp * 3); golias.isBoss = true; golias.aggro = true; golias.golias683 = true;
    } catch (_) { golias = null; }
    pups = [];
    for (let i = 0; i < 4 - s.pupsMortos; i++) {
      const a = i * 1.57 + .5, x = c.x + Math.cos(a) * 9, z = c.z + Math.sin(a) * 9;
      try { const y = foe(KINDS.yetinho ? 'yetinho' : 'yeti', 'Filhote de Yeti', x, z); y.yetiPack441 = true; y.aggro = false; y.pup683 = true; pups.push(y); } catch (_) {}
    }
    try { toast('<b>[YMIRIA]</b> O Golias de Geada ataca a Pedra-Âncora, cercado por Filhotes de Yeti assustados. Guarde a arma (X) perto dos filhotes e mire só no Golias, ou ataque tudo na câmara.', 11000); } catch (_) {}
  }
  function gone(e) { return !e || e.dead || e.gone; }
  function golDied() {
    const s = S(), c = city();
    const spare = killedPups === 0;
    s.done = true; s.phase = 'fim'; s.t = Date.now(); s.escolha = spare ? 'poupar' : 'atacar';
    if (spare) {
      s.aliadoAlfa = true; s.avisosNevasca = true; s.relato1 = 'intacto';
      try { alfa = spawnKind('yeti', c.x + 14, c.z - 6, 0, { wild: true }); const ix = enemies.indexOf(alfa); if (ix >= 0) enemies.splice(ix, 1); FRIENDS217.push(alfa); alfa.friendly217 = true; alfa.hp = alfa.maxhp = 1e9; alfa.name = 'Yeti Alfa de Ymiria'; alfa.short = 'Yeti Alfa'; alfa.noExpLoot = true; } catch (_) {}
      try { unlockLore('q015_poupar'); } catch (_) {}
      try { toast('<b>[YMIRIA]</b> O Golias cai. Os menores fogem em pânico e o Yeti Alfa se alia a Ymiria. Avisos de nevasca passam a soar no norte; o 1º Relato Ancestral está intacto.', 11000); } catch (_) {}
    } else {
      s.relato1 = 'danificado';
      try { unlockLore('q015_atacar'); } catch (_) {}
      try { toast('<b>[YMIRIA]</b> O Golias cai, mas ' + killedPups + ' filhote(s) caíram junto. Não há aliança nem avisos de nevasca, e o 1º Relato Ancestral ficou danificado.', 11000); } catch (_) {}
    }
    save();
  }
  function objective() {
    const ph = phase(); if (!ph) return null; const c = city(); let text, target = { x: c.x, z: c.z };
    if (ph === 'rota') text = 'Cruze o Desfiladeiro das Lágrimas até Ymiria';
    else text = 'Derrote o Golias de Geada junto da Pedra-Âncora · filhotes vivos: ' + pups.filter(p => !gone(p)).length;
    if (ph === 'golias' && golias && !golias.dead) target = { x: golias.x, z: golias.z };
    return { actTitle: 'A PRIMEIRA ÂNCORA: O TRONO DE GELO DE YMIRIA', step: ph === 'rota' ? 2 : 3, totalSteps: 4, text, target };
  }
  function tick() {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile || L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); golias = null; pups = []; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s || s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) { if (q14() && q14().done && free) begin(); return; }
    if (s.phase === 'rota' && free && dC() < 90) startChamber();
    if (s.phase === 'golias') {
      if (!golias && !pups.length && free && dC() < 120) startChamber();
      for (const p of pups) if (p.dead && !p.cnt683) { p.cnt683 = 1; killedPups++; s.pupsMortos = killedPups; }
      if (golias && !golias.dead && !golias.gone) { /* o Golias é do chefe da câmara: fica hostil mesmo com a sua arma guardada e não sai do trono */
        const c = city(); golias.aggro = true;
        if (Math.hypot(golias.x - c.x, golias.z - c.z) > 45) { golias.x = c.x + 10; golias.z = c.z + 6; if (golias.m && golias.m.root) { golias.m.root.position.x = golias.x; golias.m.root.position.z = golias.z; } }
      }
      if (golias && golias.dead) golDied();
      else if (golias && golias.gone && free) { golias = null; startChamber(); }
    }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(); if (window.Fixas545 && !Fixas545.LIVE.primeva_q015) Fixas545.LIVE.primeva_q015 = 'v684'; } catch (e) { console.warn('Ymiria683', e); } };
  window.Ymiria683 = { state: S, active, objective, begin, get golias() { return golias; }, get pups() { return pups; } };
})();
