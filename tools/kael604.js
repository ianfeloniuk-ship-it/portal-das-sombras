/* Missão fixa #4 «A Bigorna de Kael e o Primeiro Aço» (v604). Forja Central de Aster, Mestre Ferreiro Kael.
   Depois do registro com Lyra, Kael entrega a arma inicial da classe diante da bigorna aquecida pelo Nexo.
   Os 9 pontos iniciais de atributo já vão sozinhos para a vocação (v465); aqui a cena os conta ao jogador.
   Consequência no mundo: guardas e moradores de Aster passam a chamar o jogador pela classe. */
(function () {
  'use strict';
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q004 = profile.fixas545.q004 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  function cls() { return profile && !profile.classless && CLASSES[profile.cls] ? CLASSES[profile.cls] : null; }
  const KIND = { sword: 'Espada', dagger: 'Adagas', axe: 'Machado', staff: 'Cajado', bow: 'Arco', wand: 'Maça Sacra', tome: 'Grimório', bonestaff: 'Cajado de Osso', spear: 'Lança', firearm: 'Pistola da Escama' };
  /* Como Aster chama o jogador: só depois da cena de Kael (consequência da missão). */
  function addr(n) {
    const c = cls(), s = profile?.fixas545?.q004;
    if (!c || !s?.done || !n) return '';
    const home = n.home?.name || n.homeCity || '';
    if (home && home !== 'Aster') return '';
    return (n.kind === 'guard' || /guarda|capit/i.test(n.title || n.role || n.name || '') ? 'Alto lá, ' : 'Salve, ') + c.n + '. ';
  }
  function give(c) {
    const kind = c.wep, had = run.equip?.w;
    if (had) return false;
    const it = makeItem('w', 1, 0, kind);
    run.items.push(it);
    try { equipBagItem(it.uid); } catch (_) {}
    try { gearLook(); } catch (_) {}
    return true;
  }
  function scene(then) {
    const c = cls(), s = S();
    const gave = give(c);
    const lines = [
      'Kael: — A bigorna ainda está quente do Nexo. É sempre assim quando alguém com a sua marca entra na forja.',
      'Kael: — ' + c.n + ', então. ' + (gave ? 'Pegue esta ' + (KIND[c.wep] || 'arma') + ' de treino; foi batida para a sua vocação.' : 'A arma que você escolheu no escambo foi batida para a sua vocação. Cuide dela.'),
      'Kael: — Os 9 pontos de atributo que a Fenda lhe deu já foram para a sua vocação. Daqui em diante, o resto você forja.'
    ];
    s.done = true; s.cls = c.n; s.t = Date.now(); save();
    const end = () => { try { toast('<b>[MISSÃO]</b> O Primeiro Aço: ' + (gave ? KIND[c.wep] + ' de treino entregue por Kael. ' : '') + 'Aster agora chama você de ' + c.n + '.', 7000); } catch (_) {} then(); };
    try { if (window.Intro401) Intro401.dialog('Kael', lines, end); else { toast(lines.join('<br>'), 8000); end(); } } catch (_) { end(); }
  }
  /* A classe nasce no escambo com Kael (a primeira arma desperta a vocação): a cena fecha logo depois dele. */
  const pu = update;
  update = function () {
    pu.apply(this, arguments);
    try {
      if (window.Fixas545 && !Fixas545.LIVE.primeva_q004) Fixas545.LIVE.primeva_q004 = 'v604';
      const s = S(), a = window.Campaign327?.state('a1');
      if (s && !s.done && !s.busy && cls() && a && a.s >= 3 && typeof L !== 'undefined' && L.mode === 'world' && !window.Intro401?.conversation && !(typeof paused !== 'undefined' && paused) && typeof nearestCity === 'function' && nearestCity(player.x, player.z).d < 120) { s.busy = true; scene(() => { s.busy = false; }); }
    } catch (e) { console.warn('Kael604', e); }
  };
  window.Kael604 = { addr, scene, state: S };
})();
