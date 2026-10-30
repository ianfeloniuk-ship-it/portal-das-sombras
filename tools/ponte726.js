/* Missão fixa #23 «A Confissão do Narrador e a Ponte Inexistente» (v726). Ato XII, depois da #22.
   Em Aster, Lyra recebe os documentos do Portal Primordial [E]. O Narrador confessa: foi o primeiro Viajante, matou o Primeiro Guardião para salvar prisioneiros, abriu sem querer o caminho para o Arquiteto e perdeu o corpo.
   Logo depois indica um atalho urgente por uma ponte antiga para levar remédios a uma Âncora sob pressão.
   Escolha (conversa): conferir o registro da ponte com Selene e Aldric (rota segura e mais longa) ou confiar na memória do Narrador.
   Conferir: prova que a ponte caiu há décadas, a patrulha não morre no abismo, e o Diário passa a separar «memória deslocada» de «sinal verificado». Confiar: a caravana segue pelo atalho,
   chega ao Desfiladeiro do Arco (a Fronteira, ao sul de Aster) e não há ponte: a patrulha cai (marca patrulhaPerdida) e o Narrador reconhece o erro.
   Em ambos os casos o jogador precisa levar a caravana a pé até o Desfiladeiro do Arco. Estado em profile.fixas545.q023.
   Simplificações: Selene e Aldric são só nomes na conversa (sem figuras); a caravana é o próprio jogador chegando ao ponto; a queda da patrulha é uma marca e um aviso (sem cena);
   o Diário ganha uma entrada, e a regra «memória deslocada × sinal verificado» é a entrada (sem mecânica nova). */
(function () {
  'use strict';
  let world = null, worldT = 0, inter = null, goal = null, busy = false, lastSave = 0;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q023 = profile.fixas545.q023 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const q22 = () => profile && profile.fixas545 && profile.fixas545.q022;
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q023; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  const lyra = () => npcs.find(n => !n.gone && (n.short === 'Lyra' || n.name === 'Lyra' || n.shop === 'guild'));
  const arco = () => { let x = 0; try { x = Fronteira551.cx(334); } catch (_) {} return { x, z: 334 }; };
  if (typeof LORE !== 'undefined') {
    LORE.q023_confissao = ['A confissão do Narrador', 'Sobre a mesa de Lyra, o Narrador confessou: foi o primeiro Viajante, matou o Primeiro Guardião para salvar prisioneiros e, sem saber, abriu o caminho para o Arquiteto. Perdeu o corpo físico e passou a contar a história dos outros.'];
    LORE.q023_verificado = ['Memória deslocada, sinal verificado', 'O Narrador indicou uma ponte antiga como atalho. Selene e Aldric conferiram os registros: a ponte caiu há décadas. A patrulha não morreu no abismo. A partir de agora, o Diário separa «memória deslocada» (o que o Narrador lembra) de «sinal verificado» (o que foi conferido).'];
    LORE.q023_confiou = ['A ponte que não existia', 'Você confiou na memória do Narrador e levou a caravana ao Desfiladeiro do Arco. Não havia ponte: a patrulha da frente caiu no abismo. O Narrador reconheceu o erro: o que ele lembra pode estar deslocado no tempo.'];
  }
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'mesa'; save();
    try { toast('<b>[MISSÃO]</b> A Confissão do Narrador: leve os documentos do Portal Primordial a Lyra, em Aster, e coloque-os na mesa dela [E].', 9000); } catch (_) {}
  }
  function dropInter() { if (inter && L.inter) L.inter = L.inter.filter(i => i !== inter); inter = null; }
  function mkInter() {
    const l = lyra(); if (!l || inter && L.inter.includes(inter)) return;
    dropInter(); inter = { x: l.x, z: l.z, r: 4, label: 'E · COLOCAR OS DOCUMENTOS NA MESA DE LYRA', use: mesa }; L.inter.push(inter);
  }
  function mesa() {
    const s = S(); if (s.phase !== 'mesa' || busy) return;
    const l = lyra() || { x: player.x, z: player.z, name: 'Lyra' };
    Dialogo520.custom({ name: 'Lyra', title: 'Santuário do Nexo, Aster', type: 'ponte726' }, l, () => ({
      raiz: { t: 'Os documentos estão sobre a mesa. Então o Arquiteto tinha mestre. Então... Narrador? Você tem algo a dizer antes que eu leia o resto.', o: [
        { l: 'Ouvir o Narrador', fn: () => { conf(); return 'conf'; } }] },
      conf: { t: '«Fui o primeiro Viajante. Matei o Primeiro Guardião para salvar prisioneiros e, sem saber, abri o caminho do Arquiteto. Perdi o corpo. Por isso conto as histórias dos outros.» E logo depois: «Há um atalho urgente: uma ponte antiga no Desfiladeiro do Arco. A caravana de remédios para a Âncora sob pressão passa por ela em metade do tempo.»', o: [
        { l: 'Conferir o registro da ponte com Selene e Aldric antes de mandar a caravana', fn: () => { choose('conferir'); return 'fim'; } },
        { l: 'Confiar na memória do Narrador e mandar a caravana pelo atalho', fn: () => { choose('confiar'); return 'fim'; } }] }
    }));
  }
  function conf() { const s = S(); s.confissao = true; try { unlockLore('q023_confissao'); } catch (_) {} save(); }
  function choose(c) {
    const s = S(); if (s.escolha) return; s.escolha = c; s.confissao = true; s.phase = 'caravana'; dropInter(); save();
    if (c === 'conferir') {
      try { toast('<b>[ESCOLHA]</b> Selene e Aldric conferem o registro: a ponte caiu há décadas. A caravana vai pela rota segura, mais longa, até o Desfiladeiro do Arco.', 11000); } catch (_) {}
    } else {
      try { toast('<b>[ESCOLHA]</b> Você confia na memória do Narrador. A caravana segue pelo atalho até o Desfiladeiro do Arco, ao sul de Aster. Vá junto.', 11000); } catch (_) {}
    }
  }
  function arrive() {
    const s = S(); s.done = true; s.phase = 'fim'; s.t = Date.now();
    if (s.escolha === 'conferir') {
      s.ponteCaida = true; s.patrulhaPerdida = false; s.regraDiario = true; try { unlockLore('q023_verificado'); } catch (_) {}
      try { toast('<b>[ARCO]</b> A caravana chega pela rota segura. Onde o Narrador lembrava uma ponte há só o abismo, e a patrulha está viva. O Diário passa a separar «memória deslocada» de «sinal verificado».', 12000); } catch (_) {}
    } else {
      s.ponteCaida = true; s.patrulhaPerdida = true; try { unlockLore('q023_confiou'); } catch (_) {}
      try { toast('<b>[ARCO]</b> Não há ponte. A patrulha da frente cai no abismo. O Narrador reconhece o erro: a memória dele pode estar deslocada no tempo.', 12000); } catch (_) {}
    }
    save();
  }
  function objective() {
    const ph = phase(); if (!ph) return null; const l = lyra(); let text, target;
    if (ph === 'mesa') { text = 'Coloque os documentos na mesa de Lyra, em Aster [E]'; target = l ? { x: l.x, z: l.z } : { x: 0, z: 0 }; }
    else { text = S().escolha === 'conferir' ? 'Acompanhe a caravana pela rota segura até o Desfiladeiro do Arco' : 'Acompanhe a caravana pelo atalho até o Desfiladeiro do Arco'; target = arco(); }
    return { actTitle: 'A CONFISSÃO DO NARRADOR E A PONTE INEXISTENTE', step: ph === 'mesa' ? 2 : 3, totalSteps: 4, text, target };
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile || L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); inter = null; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s || s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) { if (q22() && q22().done && free) begin(); return; }
    if (s.phase === 'mesa' && free) mkInter();
    if (s.phase === 'caravana' && free) { const a = arco(); if (Math.hypot(player.x - a.x, player.z - a.z) < 14) arrive(); }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q023) Fixas545.LIVE.primeva_q023 = 'v726'; } catch (e) { console.warn('Ponte726', e); } };
  window.Ponte726 = { state: S, active, objective, begin, choose, get inter() { return inter; } };
})();
