/* Missão fixa #5 «O Caderno sob o Casaco» (v607). Estrada Leste: carroça de Dorian queimada, 6 inimigos, diário de Aldric
   protegido por um casaco entre duas pedras. Escolha ao entregar a Lyra: entregar direto ou copiar as páginas da inscrição antes.
   Copiar: prova duplicada das inscrições da Primeira Era, agentes de Logos não apagam o rastro na Ordem, +10 de Reputação da Ordem. */
(function () {
  'use strict';
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q005 = profile.fixas545.q005 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  function a2() { return window.Campaign327?.state('a2'); }
  function lyra() { return npcs.find(n => !n.gone && (n.short === 'Lyra' || n.name === 'Lyra' || n.shop === 'guild')); }
  if (typeof LORE !== 'undefined') LORE.q005_copia = ['Cópia das páginas de Aldric', 'Você copiou as páginas da inscrição da Primeira Era antes de entregar o diário. A Ordem guarda o original; a sua cópia fica com você, fora do alcance dos agentes de Logos.'];
  function ask(then) {
    const s = S(), npc = lyra();
    const done = c => {
      s.choice = c; s.t = Date.now();
      if (c === 'copia') {
        s.copia = true;
        try { unlockLore('q005_copia'); } catch (_) {}
        try { addOrderRep(10, 'Cópia das páginas de Aldric'); } catch (_) {}
        try { toast('<b>[ESCOLHA]</b> Você copiou as páginas antes de entregar. A prova da Primeira Era agora existe em duas vias; os agentes de Logos não apagam o rastro na Ordem. <b>+10 de Reputação da Ordem</b>', 8000); } catch (_) {}
      } else { try { toast('<b>[ESCOLHA]</b> Você entregou o diário de Aldric direto a Lyra.', 5000); } catch (_) {} }
      save();
    };
    const tree = () => ({ raiz: { t: 'O diário estava sob um casaco, entre duas pedras, queimado só nas bordas. Ainda dá para ler a página da inscrição. Como quer fazer?', o: [
      { l: 'Entregar o diário direto a Lyra', fn: () => { done('direto'); then(); return 'fim'; } },
      { l: 'Copiar as páginas da inscrição antes de entregar', fn: () => { done('copia'); then(); return 'fim'; } }] } });
    if (window.Dialogo520 && npc) setTimeout(() => Dialogo520.custom({ name: 'Lyra', title: 'Chanceler da Ordem', type: 'caderno605' }, npc, tree), 120);
    else { done('direto'); then(); }
  }
  const prev = openShop;
  openShop = function (id) {
    const a = a2();
    if (id === 'guild' && a && !a.done && a.s === 3 && S() && !S().choice) { const self = this, args = arguments; ask(() => prev.apply(self, args)); return; }
    return prev.apply(this, arguments);
  };
  const pu = update; update = function () { pu.apply(this, arguments); if (window.Fixas545 && !Fixas545.LIVE.primeva_q005) Fixas545.LIVE.primeva_q005 = 'v607'; };
  window.Caderno605 = { ask, state: S };
})();
