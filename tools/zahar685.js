/* Missão fixa #16 «A Segunda Âncora: As Ruínas do Primeiro Rei em Zahar» (v685). Ato IX, depois da Primeira Âncora (#15).
   Você segue a Garganta das Cinzas até as Ruínas Soterradas de Zahar (+3400, 0), onde o Guardião Solar (Braço Direito do Arquiteto) tenta romper as correntes
   e ondas de Escaravelhos cercam o trono oxidado. Escolha: selar o Braço Direito na hora com os minérios trazidos de Aster, ou ler o 2º Relato Ancestral gravado sob o trono
   por 4 s, parado junto dele, enquanto as ondas continuam.
   Ler: o Narrador era o escriba real do primeiro ciclo e a relíquia regional Moeda do Primeiro Rei (+8% de ouro dos monstros) entra no perfil (profile.lux267.relics).
   Selar: Braço Direito contido, sem o Relato. Em qualquer ramo o Guardião Solar precisa cair. Estado em profile.fixas545.q016.
   Simplificações: o selo não gasta minério (basta ter chegado com a Âncora de Aster); a trilha de dunas e a polpa de cacto usam a sede que já existe. */
(function () {
  'use strict';
  let world = null, worldT = 0, guard = null, wave = [], waveN = 0, waveT = 0, busy = false, lastSave = 0, relInter = null, selInter = null;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q016 = profile.fixas545.q016 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const city = () => { try { const n = nearestCity(3400, 0); if (n && n.c && n.c.name === 'Zahar') return n.c; } catch (_) {} return { x: 3392, z: 0, name: 'Zahar', id: 'zahar' }; };
  const q15 = () => profile && profile.fixas545 && profile.fixas545.q015;
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q016; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  const dC = () => { const c = city(); return Math.hypot(player.x - c.x, player.z - c.z); };
  const throne = () => { const c = city(); return { x: c.x + 12, z: c.z - 8 }; /* longe do poço de pesca e da Âncora, para o E pegar o certo */ };
  if (typeof LORE !== 'undefined') {
    LORE.q016_relato = ['O 2º Relato Ancestral', 'Sob o trono oxidado das Ruínas de Zahar estava gravado o 2º Relato. Você o leu durante o cerco: o Narrador era o escriba real do primeiro ciclo. A Moeda do Primeiro Rei, relíquia regional de Zahar, agora é sua (+8% de ouro dos monstros).'];
    LORE.q016_selo = ['O Braço Direito selado', 'Você selou o Braço Direito do Arquiteto na hora, com os minérios de Aster. O 2º Relato ficou sob o trono, sem ser lido.'];
  }
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'rota'; save();
    try { toast('<b>[MISSÃO]</b> A Segunda Âncora: siga a Garganta das Cinzas até as Ruínas do Primeiro Rei em Zahar (+3400, 0). Leve água para o deserto.', 9000); } catch (_) {}
  }
  function foe(kind, name, x, z) {
    let e = null;
    for (let i = 0; i < 8; i++) { e = spawnKind(kind, x, z, Math.min(9, rankOf()), { wild: true }); if (e.kind === kind) break; e.gone = e.dead = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    e.siege = true; /* cityRaider341: a cidade segura (390-ia) não empurra o monstro para fora das muralhas */
    e.name = e.short = name; e.aggro = true; return e;
  }
  function addInter(label, x, z, fn) { const i = { x, z, r: 2.6, label, use: fn }; L.inter.push(i); return i; }
  function rmInter(i) { if (i && L.inter) L.inter = L.inter.filter(k => k !== i); }
  function startSiege() {
    const s = S(), c = city(); s.phase = 'cerco'; save();
    for (const e of [guard].concat(wave)) if (e && !e.dead) { e.gone = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    wave = []; waveN = 0; waveT = 0;
    const gk = KINDS.cactogig_f ? 'cactogig_f' : (KINDS.cactogig ? 'cactogig' : 'orc');
    try { guard = foe(gk, 'Guardião Solar', c.x + 10, c.z + 6); guard.hp = guard.maxhp = Math.round(guard.maxhp * 2.5); guard.isBoss = true; guard.guardiao684 = true; } catch (_) { guard = null; }
    try { toast('<b>[ZAHAR]</b> O Guardião Solar rompe as correntes e Escaravelhos cercam o trono oxidado. Sele o Braço Direito agora ou leia o 2º Relato sob o trono enquanto aguenta as ondas.', 11000); } catch (_) {}
  }
  function arrange() {
    const s = S(), t = throne();
    if (s.escolha) { rmInter(relInter); rmInter(selInter); relInter = selInter = null; return; }
    if (!relInter || !L.inter.includes(relInter)) relInter = addInter('E · LER O 2º RELATO SOB O TRONO', t.x, t.z, readStart);
    if (!selInter || !L.inter.includes(selInter)) selInter = addInter('E · SELAR O BRAÇO DIREITO COM OS MINÉRIOS DE ASTER', t.x, t.z + 6, seal);
  }
  function seal() {
    const s = S(); if (s.phase !== 'cerco' || s.escolha) return;
    s.escolha = 'selar'; s.lendo = null; save(); try { unlockLore('q016_selo'); } catch (_) {}
    try { toast('<b>[ZAHAR]</b> Você sela o Braço Direito com os minérios de Aster. Falta derrubar o Guardião Solar.', 8000); } catch (_) {}
    arrange();
  }
  function readStart() {
    const s = S(); if (s.phase !== 'cerco' || s.escolha || s.lendo) return;
    s.lendo = performance.now();
    try { toast('<b>[ZAHAR]</b> Você lê o Relato gravado sob o trono. Fique junto dele por 4 segundos enquanto as ondas atacam.', 6000); } catch (_) {}
  }
  function readDone() {
    const s = S(); s.escolha = 'ler'; s.lendo = null; s.relato2 = true;
    try {
      const x = profile.lux267 = profile.lux267 || {}; x.relics = x.relics || {}; x.relics[city().id || 'zahar'] = 'moeda'; s.moeda = true;
      if (typeof refreshStats === 'function') refreshStats();
    } catch (_) {}
    try { unlockLore('q016_relato'); } catch (_) {}
    try { toast('<b>[ZAHAR]</b> O Narrador era o escriba real do primeiro ciclo. A Moeda do Primeiro Rei é sua: +8% de ouro dos monstros. Falta derrubar o Guardião Solar.', 11000); } catch (_) {}
    save(); arrange();
  }
  function finish() {
    const s = S(); s.done = true; s.phase = 'fim'; s.t = Date.now(); rmInter(relInter); rmInter(selInter); relInter = selInter = null;
    for (const e of wave) if (e && !e.dead) { e.gone = true; try { scene.remove(e.m.root); } catch (_) {} } wave = [];
    try { toast('<b>[ZAHAR]</b> O Guardião Solar cai e a Segunda Âncora se estabiliza' + (s.escolha === 'ler' ? ' com o Relato lido.' : ' com o selo posto.'), 9000); } catch (_) {}
    save();
  }
  function objective() {
    const ph = phase(); if (!ph) return null; const s = S(), c = city(); let text, target = { x: c.x, z: c.z };
    if (ph === 'rota') text = 'Siga a Garganta das Cinzas até as Ruínas do Primeiro Rei em Zahar';
    else if (!s.escolha) { text = 'Sele o Braço Direito [E] ou leia o 2º Relato sob o trono [E]'; target = throne(); }
    else { text = 'Derrote o Guardião Solar'; if (guard && !guard.dead) target = { x: guard.x, z: guard.z }; }
    return { actTitle: 'A SEGUNDA ÂNCORA: AS RUÍNAS DO PRIMEIRO REI EM ZAHAR', step: ph === 'rota' ? 2 : 3, totalSteps: 4, text, target };
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile || L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); guard = null; wave = []; relInter = selInter = null; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s || s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) { if (q15() && q15().done && free) begin(); return; }
    if (s.phase === 'rota' && free && dC() < 90) startSiege();
    if (s.phase !== 'cerco') return;
    const c = city();
    if (!guard && free && dC() < 120) startSiege();
    if (guard && !guard.dead && !guard.gone) {
      guard.aggro = true;
      if (Math.hypot(guard.x - c.x, guard.z - c.z) > 45) { guard.x = c.x + 10; guard.z = c.z + 6; if (guard.m && guard.m.root) { guard.m.root.position.x = guard.x; guard.m.root.position.z = guard.z; } }
    } else if (guard && guard.gone && !guard.dead && free) { guard = null; }
    if (guard && !guard.dead && dC() < 70 && free) { /* ondas: 3 escaravelhos a cada 12 s, no máximo 6 vivos */
      wave = wave.filter(e => !e.dead && !e.gone); waveT -= dt;
      if (waveT <= 0 && wave.length < 6) { waveT = 12; waveN++; const k = KINDS.escaravelho ? 'escaravelho' : 'goblin'; for (let i = 0; i < 3; i++) { const a = i * 2.09 + waveN, x = c.x + Math.cos(a) * 18, z = c.z + Math.sin(a) * 18; try { const e = foe(k, 'Escaravelho de Zahar', x, z); e.hp = e.maxhp = Math.min(e.maxhp, 60 + 10 * (run.level || 1)); wave.push(e); } catch (_) {} } }
    }
    if (free) arrange();
    if (s.lendo) { const t = throne(); if (Math.hypot(player.x - t.x, player.z - t.z) > 6) { s.lendo = null; try { toast('<b>[ZAHAR]</b> Você se afastou do trono: a leitura se perdeu. Leia de novo.', 5000); } catch (_) {} } else if (performance.now() - s.lendo > 4000) readDone(); }
    if (guard && guard.dead && s.escolha) finish();
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q016) Fixas545.LIVE.primeva_q016 = 'v685'; } catch (e) { console.warn('Zahar685', e); } };
  window.Zahar685 = { state: S, active, objective, begin, seal, readStart, get guard() { return guard; }, get wave() { return wave; } };
})();
