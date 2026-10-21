/* v520 (Ian, 21/10/2026): diálogo com NPCs de encontro como no Skyrim — as respostas levam a coisas.
   Cada NPC lembra do que você fez (profile.dialogo520[tipo]): recusar, ameaçar, barganhar, ajudar de graça, concluir.
   Liga em tools/quests480.js (openEmergentDialogue chama Dialogo520.open). */
(function (global) {
  'use strict';
  let ctx = null; // { def, npc, node }

  function mem(type) {
    if (typeof profile === 'undefined' || !profile) return { flags: {}, meets: 0 };
    profile.dialogo520 = profile.dialogo520 || {};
    const m = profile.dialogo520[type] = profile.dialogo520[type] || { flags: {}, meets: 0 };
    m.flags = m.flags || {};
    return m;
  }
  function save() {
    try { if (typeof store !== 'undefined' && store.set && typeof profile !== 'undefined') store.set('pds2_profile', profile); } catch (_) {}
    try { if (typeof saveRun === 'function') saveRun(); } catch (_) {}
  }
  function say(h) { try { if (typeof toast === 'function') toast(h, 5200); } catch (_) {} }
  function rep() { return (typeof profile !== 'undefined' && profile && profile.orderRep97) || 0; }
  function gold() { return (typeof run !== 'undefined' && run && run.gold) || 0; }
  function addGold(n) { if (typeof run !== 'undefined' && run) run.gold = Math.max(0, (run.gold || 0) + n); }
  function subRep(n) { if (typeof profile !== 'undefined' && profile) profile.orderRep97 = Math.max(0, (profile.orderRep97 || 0) - n); }
  function questDone(def) { const S = global.Quests480 && Quests480.getState(); return !!(S && S.completed[def.quest.id]); }
  function questActive(def) { const S = global.Quests480 && Quests480.getState(); return !!(S && S.active[def.quest.id]); }

  function dismissNpc() {
    const n = ctx && ctx.npc;
    if (!n || n.gone) return;
    n.gone = true;
    try { if (n.m && n.m.root && typeof scene !== 'undefined') scene.remove(n.m.root); } catch (_) {}
    try { if (typeof L !== 'undefined' && L && Array.isArray(L.inter) && n.interRef) L.inter = L.inter.filter(i => i !== n.interRef); } catch (_) {}
  }

  /* Cada nó: { t: texto do NPC, o: [ { l: rótulo, if?: ()=>bool, go?: nó, fn?: ()=>nó|null|'fim' } ] }.
     fn devolve o próximo nó (string), ou 'fim' para fechar. */
  function build(def) {
    const q = def.quest, m = mem(def.type), f = m.flags, g = q.gold;
    const nome = def.name.split(',')[0];
    const pay = Math.round(g * 1.25);
    const accept = over => { Quests480.acceptEmergent(def.type, over); f.aceitou = 1; f.recusou = 0; save(); return 'fim'; };
    const N = {};

    N.raiz = {
      t: def.desc,
      o: [
        { l: 'Aceitar o pedido', go: 'aceitar' },
        { l: 'Perguntar o que está acontecendo de verdade', go: 'saber', if: () => !f.soube },
        { l: 'Pedir um pagamento maior (' + pay + ' de ouro)', go: 'barganha', if: () => !f.barganhou },
        { l: 'Ameaçar: "Entregue o que tem e suma"', go: 'ameaca' },
        { l: 'Seguir viagem', fn: () => { f.recusou = 1; save(); say('<b>' + nome + ':</b> "Se mudar de ideia, estarei por aqui."'); return 'fim'; } }
      ]
    };
    N.volta = {
      t: 'Você voltou. ' + def.speech,
      o: [
        { l: 'Aceitar o pedido agora', go: 'aceitar' },
        { l: 'Perguntar o que está acontecendo de verdade', go: 'saber', if: () => !f.soube },
        { l: 'Pedir um pagamento maior (' + pay + ' de ouro)', go: 'barganha', if: () => !f.barganhou },
        { l: 'Seguir viagem', fn: () => 'fim' }
      ]
    };
    N.saber = {
      t: 'Escute: ' + q.desc + ' Quem vai lá precisa estar preparado. Os lacaios vêm primeiro e o chefe aparece depois.',
      o: [
        { l: 'Entendi. Aceito, já sabendo o que esperar', fn: () => { f.soube = 1; return accept({ minions: Math.max(1, (q.minions || 3) - 1), xp: Math.round(q.xp * 1.1) }); } },
        { l: 'Prefiro pensar mais um pouco', fn: () => { f.soube = 1; f.recusou = 1; save(); return 'fim'; } }
      ]
    };
    N.aceitar = {
      t: 'Posso contar com você? Diga como quer fazer isso.',
      o: [
        { l: 'Aceito o pagamento combinado (' + g + ' de ouro)', fn: () => accept({}) },
        { l: 'Ajudo de graça, por honra (sem ouro, o dobro de reputação e confiança)', fn: () => { f.honra = 1; return accept({ gold: 0, rep: q.rep * 2, trust: q.trust * 2 }); } },
        { l: 'Voltar', go: 'raiz' }
      ]
    };
    N.barganha = {
      t: rep() >= 200
        ? 'Hm... a Ordem fala bem de você. Está certo, pago mais, mas é pegar ou largar.'
        : 'Pagar mais? Quem é você para exigir isso? A Ordem nem conhece seu nome ainda.',
      o: rep() >= 200
        ? [
          { l: 'Fechado, por ' + pay + ' de ouro', fn: () => { f.barganhou = 1; return accept({ gold: pay, trust: Math.max(1, q.trust - 8) }); } },
          { l: 'Deixa pra lá', go: 'raiz' }
        ]
        : [
          { l: 'Tem razão. Volto quando a Ordem me conhecer (200 de reputação)', fn: () => { f.barganhou = 1; save(); return 'fim'; } },
          { l: 'Voltar', go: 'raiz' }
        ]
    };
    N.ameaca = {
      t: 'Você não faria isso... não com alguém que só pediu ajuda!',
      o: [
        { l: 'Levar a bolsa e deixar o ' + nome + ' fugir (+' + Math.round(g / 10) + ' de ouro, -20 de reputação)', fn: () => {
          addGold(Math.round(g / 10)); subRep(20); f.ameacado = 1; f.aceitou = 0; save(); dismissNpc();
          say('<b>' + nome + '</b> larga a bolsa e foge. Ele não vai esquecer o que você fez.'); return 'fim';
        } },
        { l: 'Recuar. Foi só um teste', go: 'raiz' }
      ]
    };
    N.perdao = {
      t: 'Você me ameaçou. Por que eu falaria com você?',
      o: [
        { l: 'Pedir desculpas e pagar 200 de ouro', if: () => gold() >= 200, fn: () => { addGold(-200); f.ameacado = 0; f.perdoado = 1; save(); say('<b>' + nome + ':</b> "Está bem. Mas não repita."'); return 'raiz'; } },
        { l: 'Sair sem dizer nada', fn: () => 'fim' }
      ]
    };
    N.ativa = {
      t: 'Você já aceitou meu pedido. Veja o marcador no minimapa. Boa sorte.',
      o: [{ l: 'Certo', fn: () => 'fim' }]
    };
    N.obrigado = {
      t: 'Você de novo! Se estou vivo, devo a você. Aceite isto.',
      o: [{
        l: 'Aceitar o agradecimento', fn: () => {
          if (!f.agradeceu) { f.agradeceu = 1; const b = Math.round(g / 5); addGold(b); say('<b>' + nome + '</b> dá ' + b + ' de ouro como agradecimento.'); save(); }
          return 'fim';
        }
      }]
    };
    return N;
  }

  function start(def) {
    const m = mem(def.type), f = m.flags;
    if (questActive(def)) return 'ativa';
    if (questDone(def)) return 'obrigado';
    if (f.ameacado) return 'perdao';
    if (f.recusou) return 'volta';
    return 'raiz';
  }

  function render() {
    const def = ctx.def, N = ctx.tree, nd = N[ctx.node];
    let h = '<div class="guide93"><strong>' + def.name + '</strong>'
      + '<p style="font-size:13px;line-height:1.45;margin-top:6px;color:#dbe8f2">' + nd.t + '</p></div>'
      + '<div class="sec">O QUE VOCÊ RESPONDE?</div>'
      + '<div style="display:flex;flex-direction:column;gap:8px;margin-top:10px">';
    nd.o.forEach((o, i) => {
      if (o.if && !o.if()) return;
      h += '<button class="btn' + (i === 0 ? ' hot' : '') + '" onclick="Dialogo520.pick(' + i + ')">' + o.l + '</button>';
    });
    h += '</div>';
    if (typeof openModal === 'function') openModal(def.title, h);
  }

  function open(def, npc) {
    mem(def.type).meets++;
    ctx = { def, npc, builder: build, tree: build(def), node: null };
    ctx.node = start(def);
    render();
  }

  /* v521: NPCs de cidade e vilas (vendedores e caçadores). Memória por NPC: afeto (0 a 5) e ofensa. */
  function tmem(n) {
    const m = mem('cidade:' + (n.name || n.short));
    if (m.bond == null) m.bond = 0;
    return m;
  }
  function buildTown(n, orig) {
    const m = tmem(n), f = m.flags, nome = n.short || n.name, vend = n.kind === 'vendor';
    const N = {};
    const news = () => { try { return (typeof regionLine116 === 'function' && n.home && regionLine116(n.home)) || 'Anda tudo calmo por aqui.'; } catch (_) { return 'Anda tudo calmo por aqui.'; } };
    const bondTxt = () => m.bond >= 4 ? 'Ora, meu amigo! Entre, entre.' : m.bond >= 2 ? 'Bom te ver de novo.' : m.meets > 1 ? 'Ah, é você. O que precisa?' : 'Olá, viajante. Em que posso ajudar?';
    N.raiz = {
      t: f.ofendido ? 'Depois do que você me disse, não tenho nada a tratar com você.' : bondTxt(),
      o: f.ofendido ? [
        { l: 'Pedir desculpas e pagar 100 de ouro', if: () => gold() >= 100, fn: () => { addGold(-100); f.ofendido = 0; m.bond = Math.max(0, m.bond - 1); save(); say('<b>' + nome + ':</b> "Está bem. Vou esquecer isso."'); return 'raiz'; } },
        { l: 'Ir embora', fn: () => 'fim' }
      ] : [
        { l: vend ? 'Ver as mercadorias' : 'Ouvir o que ' + nome + ' tem a dizer', fn: () => { ctx = null; if (typeof closeModal === 'function') closeModal(); try { orig(); } catch (_) {} return 'fim'; } },
        { l: 'Perguntar como andam as coisas na cidade', go: 'noticias' },
        { l: 'Elogiar o trabalho de ' + nome, go: 'elogio', if: () => m.bond < 5 },
        { l: 'Pedir um agrado', go: 'agrado' },
        { l: 'Provocar: "Você não vale nada"', go: 'provoca' },
        { l: 'Sair', fn: () => 'fim' }
      ]
    };
    N.noticias = {
      t: news(),
      o: [{ l: 'Obrigado pela conversa', fn: () => { if (!f.noticias) { f.noticias = 1; m.bond = Math.min(5, m.bond + 1); save(); } return 'raiz'; } }]
    };
    N.elogio = {
      t: f.elogiou ? 'Você já disse isso. Mas continuo gostando de ouvir.' : 'Fico feliz que tenha notado! Poucos dizem isso.',
      o: [{ l: 'Voltar', fn: () => { if (!f.elogiou) { f.elogiou = 1; m.bond = Math.min(5, m.bond + 1); save(); } return 'raiz'; } }]
    };
    N.agrado = m.bond >= 3
      ? { t: 'Como você tem sido bom comigo, aceite isto. Não conte a ninguém.',
        o: [{ l: 'Aceitar (' + (f.agrado ? 'já recebeu antes, vale 25' : '100') + ' de ouro)', fn: () => { addGold(f.agrado ? 25 : 100); f.agrado = 1; m.bond = Math.max(0, m.bond - 1); save(); return 'raiz'; } }, { l: 'Recusar com educação', go: 'raiz' }] }
      : { t: 'Um agrado? A gente mal se conhece. Volte quando eu souber mais de você (afeto 3 de 5).',
        o: [{ l: 'Entendi', go: 'raiz' }] };
    N.provoca = {
      t: 'O que foi que você disse?!',
      o: [
        { l: 'Repetir e ir embora (-10 de reputação)', fn: () => { f.ofendido = 1; m.bond = 0; subRep(10); save(); say('<b>' + nome + '</b> vira as costas. Ele não vai tratar com você tão cedo.'); return 'fim'; } },
        { l: 'Rir: "Brincadeira!"', go: 'raiz' }
      ]
    };
    return N;
  }
  function town(n, orig) {
    const m = tmem(n); m.meets++;
    const def = { name: n.name || n.short, title: n.short || n.name, type: 'cidade:' + (n.name || n.short) };
    ctx = { def, npc: n, builder: () => buildTown(n, orig), tree: buildTown(n, orig), node: 'raiz' };
    render();
  }
  function wrapTownNpcs() {
    try {
      if (typeof npcs === 'undefined' || !Array.isArray(npcs)) return;
      for (const n of npcs) {
        if (n.dlg520 || (n.kind !== 'vendor' && n.kind !== 'hunter') || typeof n.use !== 'function') continue;
        n.dlg520 = 1;
        const orig = n.use;
        n.use = () => town(n, orig);
        if (typeof L !== 'undefined' && L && Array.isArray(L.inter)) for (const it of L.inter) if (it.use === orig) it.use = n.use;
      }
    } catch (_) {}
  }
  setInterval(wrapTownNpcs, 1500);

  function pick(i) {
    if (!ctx) return;
    const o = ctx.tree[ctx.node].o[i];
    if (!o) return;
    let next = o.go || (o.fn ? o.fn() : 'fim');
    if (!next || next === 'fim') { ctx = null; if (typeof closeModal === 'function') closeModal(); return; }
    // nós que dependem do estado atual (barganha) são refeitos ao entrar
    ctx.tree = ctx.builder(ctx.def);
    ctx.node = next;
    render();
  }

  global.Dialogo520 = { open, pick, town };
})(typeof window !== 'undefined' ? window : globalThis);
