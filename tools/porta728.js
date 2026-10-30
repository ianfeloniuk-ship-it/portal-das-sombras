/* Missão fixa #25 «Quem Fechou a Porta» (v728). Ato XIII final, depois da #24.
   O Arquiteto [Grau Inefável] marcha a 2 m/s pela Estrada Sul rumo ao Nexo de Aster e deve ser detido antes de chegar a 55 m da muralha (linha z = 110, a 55 m da borda sul da cidade).
   Enquanto você não o enfrenta (a menos de 14 m ou ferindo-o) ele marcha; se cruzar a linha, o aviso diz que a muralha foi alcançada (marca muralhaAlcancada) e ele passa a lutar ali mesmo.
   Vencê-lo leva ao registro final no Livro de Lyra (E em Lyra): declarar que continuará procurando o caminho do mundo natal mas quer poder voltar para Aster como lar,
   ou declarar que Aster agora é a única casa. Nos dois casos: título «Quem Fechou a Porta» (profile.titulo725), 1.000.000 de ouro, relíquias primordiais (marca) e o pós-jogo aberto (marca posJogo).
   Estado em profile.fixas545.q025.
   Simplificações: o Arquiteto é um colosso de vida alta (4×); «relíquias primordiais» = marca no perfil, sem itens; o pós-jogo é só a marca (as Terras Despertas já são jogáveis); Lyra, Brann, Mira, Aldric e Torvo só falam no texto;
   a diferença entre as duas declarações é a marca profile.lar725 ('procura' ou 'aster') e a fala final de Lyra. */
(function () {
  'use strict';
  let world = null, worldT = 0, arq = null, inter = null, busy = false, lastSave = 0;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q025 = profile.fixas545.q025 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const roadX = z => { try { return Fronteira551.cx(z); } catch (_) { return 0; } };
  const START = 480, LINE = 110;
  const q24 = () => profile && profile.fixas545 && profile.fixas545.q024;
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q025; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  const lyra = () => npcs.find(n => !n.gone && (n.short === 'Lyra' || n.name === 'Lyra' || n.shop === 'guild'));
  const dS = () => Math.hypot(player.x - roadX(START), player.z - START);
  if (typeof LORE !== 'undefined') {
    LORE.q025_procura = ['Quem Fechou a Porta', 'Você deteve o Arquiteto e, no registro final do Livro de Lyra, escreveu que continuará procurando o caminho do seu mundo natal, mas que quer poder voltar para Aster como seu lar. Título: Quem Fechou a Porta.'];
    LORE.q025_aster = ['Quem Fechou a Porta', 'Você deteve o Arquiteto e, no registro final do Livro de Lyra, escreveu que Aster agora é a sua única casa. Título: Quem Fechou a Porta.'];
  }
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'rota'; save();
    try { toast('<b>[MISSÃO]</b> Quem Fechou a Porta: o Arquiteto marcha pela Estrada Sul rumo ao Nexo de Aster. Detenha-o antes que chegue a 55 m da muralha.', 10000); } catch (_) {}
  }
  function foe(kind, name, x, z) {
    let e = null;
    for (let i = 0; i < 8; i++) { e = spawnKind(kind, x, z, Math.min(9, rankOf()), { wild: true }); if (e.kind === kind) break; e.gone = e.dead = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    e.siege = true; e.name = e.short = name; return e;
  }
  function spawnArq() {
    try { arq = foe('colosso', 'O Arquiteto [Grau Inefável]', roadX(START), START); arq.hp = arq.maxhp = Math.round(arq.maxhp * 4); arq.isBoss = true; arq.aggro = false; arq.arq728 = true; arq.hpIni728 = arq.hp; } catch (_) { arq = null; }
  }
  function startMarcha() {
    const s = S(); s.phase = 'marcha'; save(); spawnArq();
    try { toast('<b>[ESTRADA SUL]</b> O Arquiteto marcha a 2 m por segundo rumo ao Nexo de Aster. Detenha-o antes que alcance 55 m da muralha.', 11000); } catch (_) {}
  }
  function dropInter() { if (inter && L.inter) L.inter = L.inter.filter(i => i !== inter); inter = null; }
  function mkInter() {
    const l = lyra(); if (!l || inter && L.inter.includes(inter)) return;
    dropInter(); inter = { x: l.x, z: l.z, r: 4, label: 'E · REGISTRO FINAL NO LIVRO DE LYRA', use: livro }; L.inter.push(inter);
  }
  function livro() {
    const s = S(); if (s.phase !== 'livro' || busy) return;
    const l = lyra() || { x: player.x, z: player.z, name: 'Lyra' };
    Dialogo520.custom({ name: 'Lyra', title: 'Livro de Lyra, Aster', type: 'porta728' }, l, () => ({
      raiz: { t: 'O Arquiteto caiu. Brann, Mira, Aldric e Torvo estão vivos. A porta está fechada. Falta o registro final do Livro: o que você quer que fique escrito?', o: [
        { l: 'Continuarei procurando o caminho do meu mundo natal, mas quero poder voltar para Aster como meu lar', fn: () => { choose('procura'); return 'fim'; } },
        { l: 'Aster agora é a minha única casa', fn: () => { choose('aster'); return 'fim'; } }] }
    }));
  }
  function choose(c) {
    const s = S(); if (s.done) return;
    s.escolha = c; s.done = true; s.phase = 'fim'; s.t = Date.now(); dropInter();
    profile.titulo725 = 'Quem Fechou a Porta'; profile.lar725 = c; profile.posJogo725 = true; profile.reliquiasPrimordiais725 = true;
    try { run.gold += 1000000; } catch (_) {}
    try { unlockLore(c === 'procura' ? 'q025_procura' : 'q025_aster'); } catch (_) {}
    try { toast('<b>[TÍTULO]</b> Quem Fechou a Porta. <b>+1.000.000 de ouro</b>, relíquias primordiais e o pós-jogo aberto nas Terras Despertas. A jornada continua.', 13000); } catch (_) {}
    try { if (typeof bigText === 'function') bigText('QUEM FECHOU A PORTA', 2200); } catch (_) {}
    save();
  }
  function objective() {
    const ph = phase(); if (!ph) return null; let text, target = { x: roadX(START - 40), z: START - 40 };
    if (ph === 'rota') text = 'Siga pela Estrada Sul: o Arquiteto marcha rumo ao Nexo';
    else if (ph === 'marcha') { text = 'Detenha o Arquiteto antes de 55 m da muralha'; if (arq && !arq.dead) target = { x: arq.x, z: arq.z }; }
    else { text = 'Faça o registro final no Livro de Lyra [E]'; const l = lyra(); if (l) target = { x: l.x, z: l.z }; }
    return { actTitle: 'QUEM FECHOU A PORTA', step: ph === 'rota' ? 2 : 3, totalSteps: 4, text, target };
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile || L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); arq = null; inter = null; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s || s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) { if (q24() && q24().done && free) begin(); return; }
    if (s.phase === 'rota' && free && dS() < 55) startMarcha();
    if (s.phase === 'marcha') {
      if (arq && !arq.dead && !arq.gone) {
        if (!arq.aggro && arq.hp < arq.hpIni728) arq.aggro = true;
        const pd = Math.hypot(arq.x - player.x, arq.z - player.z);
        if (!arq.aggro) {
          if (pd < 60 && arq.z > LINE) {
            const tz = arq.z - 2 * dt, tx = roadX(tz);
            try { moveEnt(arq, tx - arq.x, tz - arq.z); } catch (_) {}
            if (arq.m && arq.m.root) arq.m.root.rotation.y = Math.PI;
          }
          if (pd < 14) arq.aggro = true;
        }
        if (arq.z <= LINE && !s.muralhaAlcancada) { s.muralhaAlcancada = true; arq.aggro = true; save(); try { toast('<b>[NEXO]</b> O Arquiteto alcançou 55 m da muralha! Detenha-o agora.', 8000); } catch (_) {} }
      } else if (arq && arq.dead) { s.phase = 'livro'; s.arqCaiu = true; save(); try { toast('<b>[ARQUITETO]</b> O Arquiteto cai. A porta está fechada. Volte a Aster: Lyra espera com o Livro para o registro final.', 11000); } catch (_) {} }
      else if (arq && arq.gone && free) { arq = null; }
      if (!arq && free && dS() < 55 && s.phase === 'marcha') spawnArq();
    }
    if (s.phase === 'livro' && free) mkInter();
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q025) Fixas545.LIVE.primeva_q025 = 'v728'; } catch (e) { console.warn('Porta728', e); } };
  window.Porta728 = { state: S, active, objective, begin, get arq() { return arq; } };
})();
