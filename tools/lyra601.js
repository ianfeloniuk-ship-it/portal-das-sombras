/* Missão fixa #3 «O Livro de Lyra e a Linha em Branco» (v601). Portão Sul de Aster → tenda da Ordem.
   Edran desfalece nos braços de Mira; Lyra abre o Livro e pergunta nome e mundo. Escolha: contar a visão da Mão ou guardar segredo. */
(function () {
  'use strict';
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q003 = profile.fixas545.q003 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  function a1() { return window.Campaign327?.state('a1'); }
  function lyra() { return npcs.find(n => !n.gone && (n.short === 'Lyra' || n.name === 'Lyra' || n.shop === 'guild')); }
  if (typeof LORE !== 'undefined') LORE.q003_aldric = ['Nota de Aldric · A Mão no sonho', 'Aldric anotou à margem do Livro de Registros: quem sonha com uma mão no instante da queda foi visto antes do pouso. Lyra copiou a linha e a trancou no arquivo da Ordem.'];
  function gate() {
    if (window.Fixas545 && !Fixas545.LIVE.primeva_q003) Fixas545.LIVE.primeva_q003 = 'v601';
    const s0 = profile?.fixas545?.q003;
    if (s0?.xpPend && !profile.classless && typeof run !== 'undefined' && run) { try { gainXp(s0.xpPend, 'quest'); } catch (_) {} s0.xpPend = 0; save(); }
    const q = profile?.fixas545?.q002, s = S(), a = a1();
    if (!q?.done || !s || s.gate || !a || a.done || a.s < 2 || typeof player === 'undefined' || !player || L.mode !== 'world') return;
    if (Math.hypot(player.x, player.z - 72) > 60 || (typeof paused !== 'undefined' && paused)) return;
    s.gate = true; save();
    const lines = ['Mira: — Edran! Segura o peso nos meus braços, deixa a cabeça cair aqui.', 'Mira: — Ele aguentou até o portão. Agora é comigo. Vá à tenda da Ordem: Lyra espera com o Livro de Registros.'];
    try { if (window.Intro401) Intro401.dialog('Mira', lines, () => {}); else toast('<b>Mira:</b> ' + lines.join(' '), 7000); } catch (_) {}
  }
  function ask(then) {
    const s = S(), npc = lyra();
    const done = c => {
      s.choice = c; s.t = Date.now();
      if (c === 'mao') {
        try { unlockLore('q003_aldric'); } catch (_) {}
        s.xpPend = 50; /* sem classe o XP é zero: entra assim que a classe for escolhida */
        try { toast('<b>[ESCOLHA]</b> Você contou a Lyra sobre a Mão. Aldric deixou uma nota no Diário. <b>+50 XP</b>', 7000); } catch (_) {}
      } else {
        try { narratorSayTop('Prudência, Viajante. Há sonhos que só valem quando você escolhe a hora de contá-los.', 8000); } catch (_) {}
        try { toast('<b>[HISTÓRICO]</b> Narrador: — Você guardou o sonho em segredo. Poucos sabem calar na hora certa.', 7000); } catch (_) {}
        s.rare = true;
      }
      save();
    };
    const tree = () => ({ raiz: { t: 'Abro o Livro de Registros. Linha em branco. Qual é o seu nome e de que mundo você caiu? E o sonho da queda: quer que eu registre o que viu?', o: [
      { l: 'Contar a visão da Mão do Arquiteto', fn: () => { done('mao'); then(); return 'fim'; } },
      { l: 'Registrar só a chegada e guardar o sonho', fn: () => { done('segredo'); then(); return 'fim'; } }] } });
    /* a conversa da cidade fecha ao devolver 'fim': abre a nossa logo depois */
    if (window.Dialogo520 && npc) setTimeout(() => Dialogo520.custom({ name: 'Lyra', title: 'Chanceler da Ordem', type: 'lyra601' }, npc, tree), 120);
    else { done('segredo'); then(); }
  }
  function hook() {
    const prev = openShop;
    openShop = function (id) {
      const a = a1();
      if (id === 'guild' && a && !a.done && a.s === 2 && !S().choice) { const self = this, args = arguments; ask(() => prev.apply(self, args)); return; }
      return prev.apply(this, arguments);
    };
    const pu = update; update = function (dt) { pu.apply(this, arguments); try { gate(); } catch (e) { console.warn('Lyra601', e); } };
  }
  hook();
  window.Lyra601 = { ask, gate, state: S };
})();
