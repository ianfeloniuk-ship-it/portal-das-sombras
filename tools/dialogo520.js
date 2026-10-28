/* v524 (Ian, 21/10/2026): HUD de diálogo estilo Skyrim e correção de lojas/banco.
   1. Diálogo estilo Skyrim com HUD próprio (#skyrim-dialog): legendas do NPC no centro inferior, escolhas verticais à direita com atalhos numéricos [1-9], setas ◆ e [ESC] Sair.
   2. Banco e lojas corrigidos: abrir loja ou banco fecha o diálogo e NÃO executa closeModal prematuro; banco ganha opções próprias (Depositar/Sacar, etc.).
   3. Cada NPC lembra do que você fez (profile.dialogo520[tipo]): afeto, recusa, ameaça, barganha, gratidão. */
(function (global) {
  'use strict';
  let ctx = null; // { def, npc, builder, tree, node }
  let activeOptions = [];
  let keyHandlerAttached = false;

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

  /* v527: fama do jogador e notícias que mudam com o que ele fez */
  function fama(k) { if (typeof profile === 'undefined' || !profile) return {}; const F = profile.fama523 = profile.fama523 || {}; if (k) { F[k] = (F[k] || 0) + 1; } return F; }
  /* v558: fala por região (cultura da cidade) — saudação e boato próprios de cada capital */
  const REG558 = {
    aster: { oi: 'Que a Ordem guarde seus passos, viajante.', boato: ['As forjas de Kael não apagam nem de noite: a Ordem quer muralhas novas.', 'Chegam caídos das Fendas toda semana. A Ordem os acolhe, mas as camas acabam.'] },
    solaria: { oi: 'Que o sol lhe seja leve, viajante.', boato: ['Aqui o sol nunca se põe por inteiro, e os sacerdotes dizem que é sinal de bênção.', 'Os mercadores do sol pagam bem por ouro polido e por notícias de estrada.'] },
    ymiria: { oi: 'Entre logo, o frio come quem fica parado.', boato: ['A geada chegou mais cedo e o gelo das minas rangeu a noite inteira.', 'Os caçadores do norte voltam calados. O que vem do gelo profundo não se comenta alto.'] },
    zahar: { oi: 'Água e sombra para você, viajante das dunas.', boato: ['A tempestade vermelha cobriu a estrada dos caravaneiros por dois dias.', 'Em Zahar, quem guarda a água manda. E hoje o poço anda baixo.'] },
    thalor: { oi: 'Vento em popa, viajante.', boato: ['O porto está cheio: três velas chegaram com a maré e uma não voltou.', 'Pescadores juram ter visto algo enorme sob o casco na noite sem lua.'] },
    urdan_verden: { oi: 'Os ancestrais ouvem, viajante. Fale com respeito.', boato: ['Os anciãos do vale andam inquietos: as pedras dos antigos ficaram mornas.', 'Dizem que, nas noites de neblina, vultos caminham entre as árvores velhas do vale.'] }
  };
  function reg558(n) { try { const id = global.Povo482 && Povo482.regionOf ? Povo482.regionOf(n && n.home) : 'aster'; return REG558[id] || REG558.aster; } catch (_) { return REG558.aster; } }
  function news(n, fb) {
    const F = fama() || {}, L2 = [];
    if (F.bondade >= 2) L2.push('Dizem que um viajante anda dando esmola aos pobres da cidade. Gente boa.');
    if (F.maldade >= 2) L2.push('Andam falando de um viajante de mau gênio. A fama dele não é boa.');
    if (F.ladroes >= 1) L2.push('Todo mundo comenta que alguém pegou o ladrão da cidade.');
    try { const P655 = global.Povo655 && n && Povo655.noticia(n.home); if (P655) L2.push(P655, P655); } catch (_) {} /* v655: mortes e gente nova na cidade */
    if (typeof profile !== 'undefined' && profile && profile.multa523) L2.push('Ouvi dizer que um viajante arrumou confusão com a guarda e ainda não pagou a multa.');
    try { const S = global.Quests480 && Quests480.getState(), k = S ? Object.keys(S.completed || {}).length : 0; if (k >= 1) L2.push('Contam que um viajante já cumpriu ' + k + ' contrato' + (k > 1 ? 's' : '') + ' da Ordem por aí.'); } catch (_) {}
    if (L2.length && Math.random() < .65) return L2[Math.floor(Math.random() * L2.length)];
    if (Math.random() < .4) { const B = reg558(n).boato; return B[Math.floor(Math.random() * B.length)]; }
    try { return (typeof regionLine116 === 'function' && n && n.home && regionLine116(n.home)) || fb; } catch (_) { return fb; }
  }
  function dismissNpc() {
    const n = ctx && ctx.npc;
    if (!n || n.gone) return;
    n.gone = true;
    try { if (n.m && n.m.root && typeof scene !== 'undefined') scene.remove(n.m.root); } catch (_) {}
    try { if (typeof L !== 'undefined' && L && Array.isArray(L.inter) && n.interRef) L.inter = L.inter.filter(i => i !== n.interRef); } catch (_) {}
  }

  /* v532: tela simples. Durante a conversa nada fica por cima de nada; fora dela some a caixa de texto do canto */
  (function () {
    const st = document.createElement('style');
    st.textContent = 'body.dlg520 #btns, body.dlg520 #bF, body.dlg520 #mm, body.dlg520 #obj, body.dlg520 #quest401, body.dlg520 #tb { display: none !important; } #obj { display: none !important; }';
    document.head.appendChild(st);
  })();

  /* --- HUD ESTILO SKYRIM --- */
  const FALA520 = {"emergent_alpha_beast": "Uma fera alfa abissal emboscou minha patrulha nas colinas. Derrote-a e ajude a devolver a honra dos meus caçadores.", "emergent_stolen_cargo": "Saqueadores renegados emboscaram minha carroça. Elimine-os e recupere o baú de mercadorias refinadas.", "emergent_monolith_trial": "Toque o monólito rúnico antigo e derrote a aparição do Guardião Ancestral. Só assim os segredos dele se abrem.", "emergent_deserter_stash": "Siga as coordenadas que vou lhe passar até o covil oculto nas pedras e conquiste o tesouro das feras.", "emergent_corrupted_grove": "Destrua o fungo primordial que infecta este bosque sagrado. Eu sozinho não consigo.", "emergent_shipwreck_salvage": "Derrote os monstros de carapaça nas pedras da costa e recupere as pérolas da minha jangada naufragada.", "emergent_leviathan_spoils": "Expulse os corsários que tentam roubar a carcaça do leviatã encalhado na costa.", "emergent_frozen_expedition": "Quebre o cerco dos golens de gelo ao redor da minha tenda de expedição.", "emergent_avalanche_ambush": "Extermine a alcateia de lobos da nevasca que cerca meu trenó soterrado pela avalanche.", "emergent_eternal_flame": "Proteja a fogueira eterna contra os cavaleiros espectrais do gelo.", "emergent_dune_beetles": "Esmague a rainha dos escaravelhos que cerca minha caravana encalhada.", "emergent_sand_mirage": "Derrote a aparição do Djinn e dissipe a miragem mortal no meio do deserto.", "emergent_pharaoh_tomb": "Entre na tumba soterrada e derrote o guardião esquelético das dunas.", "emergent_swamp_slime": "Derrote a Gosma Matriarca no coração do pântano. Preciso dela para o meu caldeirão.", "emergent_sunken_tomb": "Encontre a cripta submersa que o fogo-fátuo indica e derrote o cavaleiro espectral do lodo.", "emergent_magma_forge": "Elimine os golens de magma que cercaram minha bigorna na ravina vulcânica.", "emergent_thunder_storm": "Neutralize os golens elétricos atraídos pelo meu cajado durante a tempestade."};
  function ensureSkyrimUI() {
    let el = document.getElementById('skyrim-dialog');
    if (!el) {
      el = document.createElement('div');
      el.id = 'skyrim-dialog';
      el.innerHTML = `
        <style>
          #skyrim-dialog {
            position: fixed; inset: 0; z-index: 120; pointer-events: none; display: none;
            font-family: "Chakra Petch", sans-serif; user-select: none;
            background: none;
          }
          .skyrim-dialog-subtitles {
            position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
            width: min(680px, 92vw); text-align: center; pointer-events: auto;
            animation: skyrimFadeIn 0.18s ease-out;
          }
          .skyrim-dialog-speaker {
            font-size: 13px; font-weight: 700; letter-spacing: 2.2px; color: #ffd070;
            text-transform: uppercase; margin-bottom: 6px; text-shadow: 0 2px 4px rgba(0,0,0,0.9);
          }
          .skyrim-dialog-text {
            font-size: 15px; line-height: 1.5; color: #f5f8ff; font-weight: 500;
            padding: 0 12px; text-shadow: 0 0 3px #000, 0 0 6px #000, 0 1px 8px rgba(0,0,0,0.95);
          }
          .skyrim-dialog-choices {
            position: absolute; bottom: 130px; right: 44px; width: min(440px, 92vw); max-height: 60vh; overflow: auto;
            display: flex; flex-direction: column; gap: 7px; pointer-events: auto;
            animation: skyrimSlideIn 0.2s ease-out;
          }
          @media (max-width: 768px) {
            .skyrim-dialog-choices { right: 14px; bottom: 135px; width: min(380px, 94vw); }
            .skyrim-dialog-subtitles { bottom: 18px; }
          }
          .skyrim-dialog-header {
            font-size: 11px; font-weight: 700; letter-spacing: 1.8px; color: rgba(255, 208, 112, 0.75);
            text-transform: uppercase; margin-bottom: 2px; text-shadow: 0 1px 3px rgba(0,0,0,0.8);
          }
          .skyrim-choice-item {
            display: flex; align-items: center; gap: 10px; padding: 10px 14px;
            background: none; border: none; padding: 4px 8px;
            border-radius: 3px; color: #dce7f5; font-size: 14px; font-weight: 600; cursor: pointer;
            transition: all 0.12s ease-out; text-shadow: 0 0 3px #000, 0 0 6px #000, 0 1px 8px rgba(0,0,0,0.95);
          }
          .skyrim-choice-item:hover, .skyrim-choice-item.selected {
            color: #ffd070; transform: translateX(-4px);
          }
          .skyrim-choice-num {
            font-size: 11px; color: #ffd070; padding: 0 2px;
          }
          .skyrim-choice-icon {
            color: rgba(255, 208, 112, 0.6); font-size: 11px; transition: color 0.12s ease-out;
          }
          .skyrim-choice-item:hover .skyrim-choice-icon { color: #ffd070; }
          .skyrim-choice-text { flex: 1; line-height: 1.35; }
          .skyrim-dialog-footer {
            font-size: 11px; color: rgba(180, 195, 215, 0.65); text-align: right;
            margin-top: 3px; letter-spacing: 0.5px;
          }
          @keyframes skyrimFadeIn {
            from { opacity: 0; transform: translate(-50%, 8px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
          @keyframes skyrimSlideIn {
            from { opacity: 0; transform: translateX(12px); }
            to { opacity: 1; transform: translateX(0); }
          }
        </style>
        <div class="skyrim-dialog-subtitles">
          <div class="skyrim-dialog-speaker" id="skyrim-speaker"></div>
          <div class="skyrim-dialog-text" id="skyrim-speech"></div>
        </div>
        <div class="skyrim-dialog-choices">
          <div class="skyrim-dialog-header">RESPOSTAS [1-9]</div>
          <div id="skyrim-choices-list" style="display:flex;flex-direction:column;gap:6px"></div>
          <div class="skyrim-dialog-footer">[ESC] Sair</div>
        </div>
      `;
      document.body.appendChild(el);
    }
    return el;
  }

  function onKeyDown(e) {
    if (!ctx) return;
    if (e.code === 'Escape') {
      e.preventDefault(); e.stopPropagation();
      closeSkyrimDialog();
      return;
    }
    let num = -1;
    if (e.code.startsWith('Digit')) num = parseInt(e.code.replace('Digit', ''), 10);
    else if (e.code.startsWith('Numpad')) num = parseInt(e.code.replace('Numpad', ''), 10);
    if (num >= 1 && num <= activeOptions.length) {
      e.preventDefault(); e.stopPropagation();
      pick(num - 1);
      return;
    }
    if (e.code === (typeof keyOf === 'function' ? keyOf('use') : 'KeyE') || e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault(); e.stopPropagation();
      if (activeOptions.length > 0) pick(0);
      return;
    }
  }

  /* v575 (Ian): como no Skyrim, a conversa segura o mundo. O NPC para no lugar, vira para o jogador e fica até o fim;
     ninguém fere o jogador enquanto a conversa está aberta; ela fecha sozinha se o jogador se afastar. */
  let hold575 = null, wrapped575 = false;
  function startHold575() {
    const n = ctx && ctx.npc;
    if (!n || n.x == null || typeof player === 'undefined' || !player) { hold575 = null; return; }
    if (!hold575 || hold575.n !== n) hold575 = { n, x: n.x, z: n.z };
    if (!wrapped575 && typeof update === 'function') {
      wrapped575 = true;
      const U = update;
      update = function () { const r = U.apply(this, arguments); try { holdStep575(); } catch (_) {} return r; };
    }
  }
  function holdStep575() {
    if (!ctx || !hold575) { hold575 = null; return; }
    const n = hold575.n, P = player;
    if (!P || P.dead || n.gone || (n.m && n.m.root && !n.m.root.parent)) { closeSkyrimDialog(); return; }
    if (Math.hypot(P.x - hold575.x, P.z - hold575.z) > 7) { closeSkyrimDialog(); return; }
    P.iT = Math.max(P.iT || 0, .3);
    n.x = hold575.x; n.z = hold575.z; n.chase523 = null; n.talk575 = true;
    const yaw = Math.atan2(P.x - n.x, P.z - n.z), r = n.m && n.m.root;
    if (r) { r.position.x = n.x; r.position.z = n.z; if (!n.down) { n.face = yaw; r.rotation.y = yaw; } }
  }

  function closeSkyrimDialog() {
    if (hold575 && hold575.n) hold575.n.talk575 = false;
    hold575 = null;
    ctx = null;
    activeOptions = [];
    const el = document.getElementById('skyrim-dialog');
    if (el) el.style.display = 'none';
    document.body.classList.remove('dlg520');
    if (keyHandlerAttached) {
      if (typeof window !== 'undefined' && window.removeEventListener) window.removeEventListener('keydown', onKeyDown, true);
      keyHandlerAttached = false;
    }
  }

  function render() {
    if (!ctx) return;
    const def = ctx.def, N = ctx.tree, nd = N[ctx.node];
    if (!nd) { closeSkyrimDialog(); return; }
    startHold575();
    try { if (typeof mouseHeld !== 'undefined') mouseHeld = false; if (document.pointerLockElement) document.exitPointerLock(); } catch (_) {}

    const el = ensureSkyrimUI();
    const speakerEl = document.getElementById('skyrim-speaker');
    const speechEl = document.getElementById('skyrim-speech');
    const listEl = document.getElementById('skyrim-choices-list');

    if (speakerEl) speakerEl.textContent = def.name || def.title;
    if (speechEl) speechEl.innerHTML = nd.t;

    activeOptions = nd.o.filter(o => !o.if || o.if());
    if (listEl) {
      listEl.innerHTML = '';
      activeOptions.forEach((o, i) => {
        const item = document.createElement('div');
        item.className = 'skyrim-choice-item';
        item.innerHTML = `<span class="skyrim-choice-num">${i + 1}</span><span class="skyrim-choice-icon">◆</span><span class="skyrim-choice-text">${o.l}</span>`;
        item.onclick = (e) => { e.stopPropagation(); pick(i); };
        item.onmouseenter = () => { try { if (typeof beep === 'function') beep(800, 0.02, 0.02, 'triangle'); } catch (_) {} };
        listEl.appendChild(item);
      });
    }

    el.style.display = 'block';
    document.body.classList.add('dlg520');

    if (!keyHandlerAttached) {
      if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('keydown', onKeyDown, true);
      keyHandlerAttached = true;
    }
  }

  function pick(i) {
    if (!ctx) return;
    const o = activeOptions[i];
    if (!o) return;
    if (typeof sfx === 'function') sfx('click');
    let next = o.go || (o.fn ? o.fn() : 'fim');
    if (!next || next === 'fim') {
      closeSkyrimDialog();
      return;
    }
    ctx.tree = ctx.builder(ctx.def);
    ctx.node = next;
    render();
  }

  const ABERT520 = [
    n => 'Ei, viajante! Chegue mais perto, ' + n + ' não morde... quase nunca.',
    n => 'Pelos deuses, finalmente alguém aparece. Pare um instante, por favor.',
    n => 'Você tem cara de quem sabe lutar. Posso tomar um minuto do seu tempo?',
    n => 'Não precisa sacar a arma. Só quero conversar.',
    n => 'Que sorte a minha cruzar com você neste fim de mundo.',
    n => 'Shh. Fale baixo, tem coisa rondando por aqui.',
    n => 'Olhe só, um Transmigrador. Dizem que vocês nunca recusam um bom pedido.',
    n => 'Ainda bem que você veio. Eu já estava sem opção.'
  ];
  const ADEUS520 = [
    'Se mudar de ideia, estarei por aqui.',
    'Entendo. Cuide-se na estrada.',
    'Tudo bem. Mas não demore, o tempo está contra nós.',
    'Sem rancor. Que os ventos lhe sejam favoráveis.',
    'Vá com cuidado. Esta região não perdoa.',
    'Quando precisar, é só voltar aqui.'
  ];
  const BOATO520 = [
    'Ouvi dizer que as Fendas estão ficando maiores a cada lua.',
    'Os guardas das cidades andam nervosos. Há feras rondando mais perto das muralhas.',
    'Um mercador jurou ter visto uma estátua gigante no alto de uma colina, com uma câmara dentro.',
    'À noite os monstros ficam mais fortes. Eu só viajo de dia.',
    'Se a chuva apertar, procure abrigo. Raios caem nas colinas abertas.',
    'Dizem que há ruínas de mármore espalhadas por aí, com relíquias escondidas.',
    'Os acampamentos de estrada vendem bom mantimento, mas cobram caro de quem tem fama ruim.',
    'Nas montanhas, tem gente que paga bem por quem limpa os covis das feras.',
    'Eu vi um dragão cruzando o céu no mês passado. Nunca mais dormi direito.',
    'Quem tem boa fama nas cidades recebe descontos e pedidos melhores.'
  ];
  const sorteio520 = a => a[Math.floor(Math.random() * a.length)];

  /* Cada nó de encontro: { t: texto do NPC, o: [ { l: rótulo, if?: ()=>bool, go?: nó, fn?: ()=>nó|null|'fim' } ] } */
  function build(def) {
    const q = def.quest, m = mem(def.type), f = m.flags, g = q.gold;
    const nome = def.name.split(',')[0];
    const pay = Math.round(g * 1.25);
    const accept = over => {
      Quests480.acceptEmergent(def.type, over);
      f.aceitou = 1; f.recusou = 0; save();
      return 'fim';
    };
    const N = {};

    N.raiz = {
      t: sorteio520(ABERT520)(nome) + ' ' + def.desc,
      o: [
        { l: 'Aceitar o pedido', go: 'aceitar' },
        { l: 'Perguntar o que está acontecendo de verdade', go: 'saber', if: () => !f.soube },
        { l: 'Pedir um pagamento maior (' + pay + ' de ouro)', go: 'barganha', if: () => !f.barganhou },
        { l: 'Perguntar sobre as redondezas', go: 'boato' },
        { l: 'Ameaçar: "Entregue o que tem e suma"', go: 'ameaca' },
        { l: 'Seguir viagem', fn: () => { f.recusou = 1; save(); say('<b>' + nome + ':</b> "' + sorteio520(ADEUS520) + '"'); return 'fim'; } }
      ]
    };
    N.boato = {
      t: sorteio520(BOATO520),
      o: [
        { l: 'Outra notícia?', go: 'boato' },
        { l: 'Voltar ao pedido', go: 'raiz' },
        { l: 'Seguir viagem', fn: () => 'fim' }
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
      t: 'Escute: ' + (FALA520[q.id] || q.desc) + ' Quem vai lá precisa estar preparado. Os lacaios vêm primeiro e o chefe aparece depois.',
      o: [
        { l: 'Entendi. Aceito, já sabendo o que esperar', fn: () => { f.soube = 1; return accept({ minions: Math.max(1, (q.minions || 3) - 1), xp: Math.round(q.xp * 1.1) }); } },
        { l: 'Prefiro pensar mais um pouco', fn: () => { f.soube = 1; f.recusou = 1; save(); return 'fim'; } }
      ]
    };
    N.aceitar = {
      t: 'Posso contar com você? Diga como quer fazer isso.',
      o: [
        { l: 'Aceito o pagamento combinado (' + g + ' de ouro)', fn: () => accept({}) },
        { l: 'Ajudo de graça, por honra (sem ouro, o dobro de reputação)', fn: () => { f.honra = 1; return accept({ gold: 0, rep: q.rep * 2, trust: q.trust * 2 }); } },
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
          addGold(Math.round(g / 10)); subRep(20); fama('maldade'); f.ameacado = 1; f.aceitou = 0; save(); dismissNpc();
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
      t: 'Você já aceitou meu pedido. Veja o marcador no minimapa e no horizonte. Boa sorte.',
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

  function open(def, npc) {
    mem(def.type).meets++;
    ctx = { def, npc, builder: build, tree: build(def), node: null };
    ctx.node = start(def);
    render();
  }

  /* --- NPCs DE CIDADE E VILAS (VENDEDORES, BANCO, FERREIRO, CAÇADORES) --- */
  function tmem(n) {
    const m = mem('cidade:' + (n.name || n.short));
    if (m.bond == null) m.bond = 0;
    return m;
  }

  /* v545 (Ian, 22/10/2026: «é sempre as mesmas perguntas, as mesmas coisas»): cada pessoa tem um jeito (pelo nome),
     a saudação muda com a chuva, a neve, a noite e o quanto vocês se conhecem, e os assuntos mudam de pessoa para pessoa
     e de dia para dia. Cada assunto ouvido pela primeira vez aproxima vocês (+1 de afeto). Depois de ouvido, sai da lista. */
  function h545(s) { let h = 2166136261 >>> 0; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
  const day545 = () => { try { return Math.floor(dayT / DAYLEN); } catch (_) { return 0; } };
  const wx545 = () => { try { return (L.mode === 'world' && WX.type) || 'clear'; } catch (_) { return 'clear'; } };
  const night545 = () => { try { return typeof isNight === 'function' && isNight(); } catch (_) { return false; } };
  const of545 = (a, k) => a[(k >>> 0) % a.length];
  const JEITO545 = {
    falante: { oi: ['Ah, que bom, alguém para conversar! Faz horas que ninguém para aqui.', 'Chegue, chegue! Tenho tanta coisa para contar.', 'Você de novo? Ótimo, eu estava querendo falar com alguém.'], tique: ' Mas isso é só metade da história.', elogio: 'Obrigado, pouca gente repara! Aprendi tudo sozinho.', provoca: 'Nossa. Eu estava sendo tão simpático com você.', tchau: 'Volte logo, ainda tenho mil histórias.' },
    rabugento: { oi: ['Hm. O que é?', 'Seja rápido, tenho mais o que fazer.', 'Se for para pedir desconto, nem comece.'], tique: ' Pronto, falei.', elogio: 'Elogio não paga as contas. Mas obrigado.', provoca: 'Repete isso se tiver coragem.', tchau: 'Finalmente.' },
    medroso: { oi: ['Você me assustou! Achei que fosse uma fera.', 'Fale baixo, por favor. Nunca se sabe quem está ouvindo.', 'Você veio lá de fora? Viu alguma coisa estranha?'], tique: ' ...Você ouviu isso?', elogio: 'S-sério? Obrigado. Ninguém nunca me disse isso.', provoca: 'P-por que você diria uma coisa dessas?', tchau: 'Tome cuidado lá fora. De verdade.' },
    orgulhoso: { oi: ['Sim? Fale. Não é todo dia que dou atenção a forasteiros.', 'Você com certeza já ouviu falar de mim.', 'Diga logo o que quer. Meu tempo vale ouro.'], tique: ' Nem todo mundo aguentaria.', elogio: 'Eu sei. Mas é bom ouvir de alguém que entende.', provoca: 'Você sabe com quem está falando?!', tchau: 'Pode ir. Lembre de quem te tratou bem.' },
    sonhador: { oi: ['Já reparou como o céu mudou depois da Fenda? Desculpe, eu estava distraído.', 'Você tem cara de quem já viu muita coisa. Me conta?', 'Bom te ver. Eu estava aqui pensando na vida.'], tique: ' Às vezes eu penso nisso antes de dormir.', elogio: 'Que gentil. Vou guardar isso comigo.', provoca: 'Hm. Você não acredita nisso de verdade, acredita?', tchau: 'Que as estrelas te guiem.' },
    devoto: { oi: ['Que a luz te proteja, viajante.', 'Paz a você. Em que posso ser útil?', 'Os deuses mandam as pessoas na hora certa. Olá.'], tique: ' Que os deuses nos guardem.', elogio: 'Agradeço. O mérito é de quem me dá forças.', provoca: 'Vou rezar por você. Está precisando.', tchau: 'Vá em paz.' }
  };
  const JK545 = Object.keys(JEITO545);
  const CLIMA545 = {
    rain: ['Que chuva, hein? Estou molhado até os ossos.', 'Com essa chuva, nem as feras saem da toca.', 'Chuva assim apaga fogueira e esconde pegada. Péssimo para caçar.'],
    snow: ['Esse frio corta até a alma.', 'Neve de novo. Meus dedos nem mexem direito.'],
    noite: ['A essa hora? Só gente com problema anda pela rua.', 'De noite os mortos andam. Pelo menos é o que dizem.', 'Não devia estar aqui fora tão tarde.']
  };
  const CACA545 = ['Acabei de voltar de uma Fenda. Ainda estou com cheiro de sangue de fera.', 'Mais um dia, mais um núcleo quebrado. E você, caçando o quê?', 'Se veio pedir ajuda, eu cobro caro. Se veio conversar, tudo bem.'];
  /* assuntos: l = pergunta, r = respostas (cada pessoa fica sempre com a mesma), c = quando aparece */
  const ASSUNTO545 = [
    { id: 'origem', l: () => 'De onde você é?', r: ['Nasci aqui mesmo, nunca saí destas muralhas. Talvez um dia.', 'Vim de Ymiria, fugindo do frio. Troquei a neve pelas feras.', 'Minha família era de pescadores da costa. O mar levou meu pai, a Fenda levou o resto.', 'Não lembro. Acordei numa carroça depois da primeira Fenda e nunca mais soube quem eu era.'] },
    { id: 'familia', l: () => 'Você tem família?', r: ['Minha filha pequena quer ser caçadora. Rezo para ela mudar de ideia.', 'Tinha um irmão. Ele entrou numa Fenda vermelha e não voltou.', 'Minha mãe ainda mora aqui perto. Faz o melhor pão da região, pode perguntar.', 'A cidade é a minha família. Os outros eu nem conheço mais.'] },
    { id: 'medo', l: () => 'Do que você tem mais medo?', r: ['De acordar e a Fenda estar dentro das muralhas.', 'De dragões. Vi um passar uma vez e a sombra dele cobriu a praça inteira.', 'De ficar velho sem ter feito nada que valha uma história.', 'De silêncio. Quando a floresta fica quieta demais, alguma coisa grande está vindo.'] },
    { id: 'fenda', l: () => 'O que você acha das Fendas?', r: ['Uma ferida no mundo. E feridas que não fecham apodrecem.', 'Para mim, são trabalho. Cada Fenda fechada é pão na mesa de alguém.', 'Dizem que do outro lado existe um mundo inteiro. Eu não quero saber.', 'Acho que alguém abriu de propósito. O Arquiteto, como os velhos chamam.'] },
    { id: 'sonho', l: () => 'Se pudesse largar tudo, o que faria?', r: ['Compraria um barco e iria até onde o mapa acaba.', 'Abriria uma taverna. Com música toda noite.', 'Aprenderia a ler as estrelas, como os antigos.', 'Já larguei tudo uma vez. Não recomendo.'] },
    { id: 'cidade', l: n => 'O que tem de bom em ' + ((n.home && n.home.name) || 'sua cidade') + '?', r: ['A taverna. E a vista da muralha quando o sol se põe.', 'As pessoas. Aqui ninguém passa fome sozinho.', 'Nada. Mas é o único lugar que eu conheço.', 'O mercado. Tudo que chega da estrada passa por ele primeiro.'] },
    { id: 'mortos', l: () => 'Já viu os mortos andando por aí?', r: ['Vi uma luz azul com a forma de um homem perto da muralha. Ela só queria conversar.', 'Minha avó dizia que os mortos voltam quando deixam algo sem terminar. Escute se encontrar um.', 'Não, e nem quero. Mas os guardas da noite juram que veem.', 'Os fantasmas aparecem de noite, brilhando como a Fenda. Só querem conversar.'] },
    { id: 'chuva', c: () => wx545() === 'rain', l: () => 'Essa chuva não vai parar?', r: ['Sempre para. O problema é a lama que fica.', 'Chuva boa para a plantação, ruim para os ossos.', 'Quando chove assim, raio cai nas colinas. Fique longe dos lugares altos.'] },
    { id: 'frio', c: () => wx545() === 'snow', l: () => 'Como vocês aguentam esse frio?', r: ['Lã, fogo e muita sopa.', 'Não aguentamos. Só fingimos.', 'Em Ymiria é pior. Lá até o fogo treme.'] },
    { id: 'noite', c: night545, l: () => 'O que você faz na rua a essa hora?', r: ['Não consigo dormir. Desde a última Fenda, nunca mais dormi direito.', 'Gosto da noite. A cidade fica quieta e dá para ouvir os próprios pensamentos.', 'Estou esperando alguém. Não pergunte quem.'] },
    { id: 'trabalho', c: n => n.kind !== 'hunter', l: n => 'Como é o seu trabalho' + (n.job523 ? ' de ' + String(n.job523).toLowerCase() : '') + '?', r: ['É cansativo, mas honesto. Isso vale muito hoje em dia.', 'Faço a mesma coisa todo dia. Às vezes é bom, às vezes dá vontade de sumir.', 'Melhor do que caçar fera. Pelo menos eu volto inteiro para casa.'] },
    { id: 'pior', c: n => n.kind === 'hunter', l: () => 'Qual foi a sua pior caçada?', r: ['Um ninho de aranhas numa masmorra sem luz. Ainda sinto as patas no pescoço.', 'Um chefe que voltou a levantar depois de morto. Perdi dois amigos naquele dia.', 'A primeira. Eu nem sabia segurar a arma direito.'] },
    { id: 'rank', c: n => n.kind === 'hunter', l: n => 'Como foi chegar ao rank ' + ((typeof RANKS !== 'undefined' && RANKS[n.rank] && RANKS[n.rank].id) || 'atual') + '?', r: ['Muito sangue, pouco sono. E a Ordem não dá nada de graça.', 'Prova atrás de prova. Cada rank novo é uma Fenda mais funda.', 'Sorte, mais que tudo. Os melhores que eu conheci já morreram.'] },
    { id: 'conselho', c: n => n.kind === 'hunter', l: () => 'Algum conselho para quem vai para a Fenda?', r: ['Nunca entre sem um jeito de sair.', 'Mate primeiro os que curam. Sempre.', 'Se o chão começar a brilhar, saia de cima.'] }
  ];
  /* a pessoa pergunta de volta: a resposta que combina com o jeito dela aproxima vocês */
  const PERGUNTA545 = { l: 'E você, por que luta?', o: [['Pela Ordem e pelas pessoas', ['devoto', 'medroso']], ['Pelo ouro, claro', ['orgulhoso', 'rabugento']], ['Para descobrir o que existe do outro lado', ['sonhador', 'falante']]] };
  function jeito545(n) { return JK545[h545('jeito|' + (n.short || n.name)) % JK545.length]; }
  /* assuntos do dia para quem não usa buildTown (guardas): cria os nós e devolve as opções */
  function assuntos545(n, m, N, q) {
    const f = m.flags, nome = n.short || n.name, J = JEITO545[jeito545(n)];
    return ASSUNTO545.filter(a => (!a.c || a.c(n)) && !f['t545_' + a.id]).sort((a, b) => h545(day545() + '|' + a.id + '|' + nome) - h545(day545() + '|' + b.id + '|' + nome)).slice(0, q).map(a => {
      const k = h545(nome + '|' + a.id);
      N['a545_' + a.id] = { t: of545(a.r, k), o: [{ l: of545(['Entendi', 'Interessante', 'Obrigado por contar'], k >>> 2), fn: () => { if (!f['t545_' + a.id]) { f['t545_' + a.id] = 1; m.bond = Math.min(5, m.bond + 1); save(); } return 'raiz'; } }] };
      return { l: '● ' + a.l(n), go: 'a545_' + a.id };
    });
  }

  function buildTown(n, orig) {
    const m = tmem(n), f = m.flags, nome = n.short || n.name;
    const shop = n.shop || '', sign = (n.sign || '').toUpperCase();
    const isBank = shop === 'bank' || sign.includes('BANCO') || nome === 'Selene';
    const isWep = shop === 'wep' || sign.includes('EQUIPAMENTO') || nome === 'Kael';
    const isMkt = shop === 'mkt' || sign.includes('MERCADO') || nome === 'Dorian';
    const isPot = shop === 'pot' || sign.includes('POÇÕES') || nome === 'Mira';
    const isArm = shop === 'arm' || shop === 'defense' || sign.includes('DEFESA') || nome === 'Brann';
    const isGuild = shop === 'guild' || sign.includes('ORDEM') || nome === 'Lyra';
    const isVendor = n.kind === 'vendor';
    const aster541 = isVendor && typeof NPCTALK !== 'undefined' && NPCTALK[nome] && typeof NPCQ !== 'undefined' && NPCQ[nome] && n.home && n.home.name === 'Aster';
    const affL541 = () => { try { return typeof affL === 'function' ? affL(nome) : 0; } catch (_) { return 0; } };
    const npcHas541 = () => { try { return typeof npcHas === 'function' && npcHas(nome); } catch (_) { return false; } };
    const giftC541 = () => { try { return typeof servicePrice265 === 'function' ? servicePrice265('gift', { affinityLevel: affL541() }) : 0; } catch (_) { return 0; } };
    const act541 = (a, v) => { try { const r = (typeof extraActions === 'function' && extraActions(a, v)) || (typeof extraActions2 === 'function' && extraActions2(a, v)) || (typeof extraActions3 === 'function' && extraActions3(a, v)); save(); return r; } catch (e) { console.warn('dialogo541', e); } };

    const N = {};
    const news0 = () => news(n, 'Anda tudo calmo por aqui.');
    
    let defaultGreeting = reg558(n).oi + ' Em que posso ajudar?';
    if (isBank) defaultGreeting = 'Bem-vindo ao Banco de ' + ((n.home && n.home.name) || 'Aster') + '. Seu ouro e seus bens estão sempre protegidos aqui.';
    else if (isWep) defaultGreeting = 'Aço bom e corte afiado mantêm um guerreiro vivo. O que procura hoje?';
    else if (isMkt) defaultGreeting = 'Minérios, peixes e provisões do dia. Tenho de tudo um pouco.';
    else if (isPot) defaultGreeting = 'Ervas raras e poções frescas. Uma boa poção na hora certa salva vidas.';
    else if (isArm) defaultGreeting = 'Armadura pesada é a diferença entre voltar para casa ou virar comida de fera.';
    else if (isGuild) defaultGreeting = 'A Ordem da Fenda está sempre à procura de caçadores corajosos.';

    /* v545: saudação pelo jeito da pessoa, pelo clima e pela noite (a mesma durante toda a conversa) */
    const J = JEITO545[jeito545(n)], sd = (h545(day545() + '|' + nome) + (m.meets || 0)) >>> 0, isHunter = n.kind === 'hunter';
    const clima = wx545() === 'rain' ? CLIMA545.rain : wx545() === 'snow' ? CLIMA545.snow : night545() ? CLIMA545.noite : null;
    const bondTxt = () => (window.Kael604 ? Kael604.addr(n) : '') + (m.bond >= 4 ? of545(['Ora, meu amigo! Entre, entre.', 'Olha quem voltou! Senti sua falta.', 'Para você eu sempre tenho tempo.'], sd)
      : clima && sd % 2 === 0 ? of545(clima, sd >> 1)
      : isHunter && sd % 3 === 0 ? of545(CACA545, sd)
      : m.meets <= 1 && (isVendor || isBank) ? defaultGreeting
      : m.bond >= 2 && sd % 3 === 1 ? 'Bom te ver de novo.' : of545(J.oi, sd));
    const tema = id => 't545_' + id;
    const assuntos = ASSUNTO545.filter(a => (!a.c || a.c(n)) && !f[tema(a.id)]).sort((a, b) => h545(day545() + '|' + a.id + '|' + nome) - h545(day545() + '|' + b.id + '|' + nome)).slice(0, isVendor ? 2 : 3);
    const rk545 = (typeof RANKS !== 'undefined' && RANKS[n.rank] && RANKS[n.rank].id) || '?';
    const elogioL = isHunter ? of545(['Elogiar a arma de ' + nome, 'Dizer que já ouviu falar das caçadas de ' + nome, 'Elogiar o trabalho de ' + nome], sd) : of545(['Elogiar o trabalho de ' + nome, 'Dizer que ' + nome + ' parece saber o que faz', 'Agradecer pelo que ' + nome + ' faz pela cidade'], sd);
    const provocaL = isHunter ? of545(['Provocar: "Rank ' + rk545 + '? Parece rank E."', 'Provocar: "Você não vale nada"', 'Provocar: "Aposto que foge de lobo"'], sd) : of545(['Provocar: "Você não vale nada"', 'Provocar: "Já vi gente mais útil num cemitério"', 'Provocar: "Você só sabe reclamar"'], sd);

    // Ação principal de cada NPC de comércio/serviço
    let actionLabel = 'Ver as mercadorias';
    if (isBank) actionLabel = 'Acessar o Banco (Depositar e Sacar)';
    else if (isWep) actionLabel = 'Quero ver suas armas e equipamentos';
    else if (isMkt) actionLabel = 'Quero negociar recursos do mercado';
    else if (isPot) actionLabel = 'Quero comprar poções e pergaminhos';
    else if (isArm) actionLabel = 'Quero ver armaduras e defesas da vila';
    else if (isGuild) actionLabel = 'Ver missões e serviços da Ordem';
    else if (!isVendor) actionLabel = isHunter ? of545(['Ouvir o que ' + nome + ' tem a dizer', 'Perguntar de onde ' + nome + ' está vindo', 'Ouvir as histórias de ' + nome], sd) : of545(['Perguntar o que ' + nome + ' está fazendo', 'Ouvir o que ' + nome + ' tem a dizer', 'Perguntar como foi o dia de ' + nome], sd);

    N.raiz = {
      t: f.ofendido ? 'Depois do que você me disse, não tenho nada a tratar com você.' : bondTxt(),
      o: f.ofendido ? [
        { l: 'Pedir desculpas e pagar 100 de ouro', if: () => gold() >= 100, fn: () => { addGold(-100); f.ofendido = 0; m.bond = Math.max(0, m.bond - 1); save(); say('<b>' + nome + ':</b> "Está bem. Vou esquecer isso."'); return 'raiz'; } },
        { l: 'Ir embora', fn: () => 'fim' }
      ] : [
        { l: actionLabel, fn: () => {
          closeSkyrimDialog();
          try { orig(); } catch (e) { console.warn('Erro ao abrir serviço do NPC', e); }
          return 'fim';
        } },
        ...(isBank ? [{ l: 'Como funciona a segurança do Banco?', go: 'sobre_banco' }] : []),
        ...(isWep ? [{ l: 'Como funciona o aprimoramento de armas?', go: 'dica_forja' }] : []),
        ...(isPot ? [{ l: 'Qual poção você mais recomenda?', go: 'dica_pocao' }] : []),
        /* v543: em Aster, conversa, missão pessoal e presente do jogo (NPCTALK, NPCQ, afinidade) */
        ...(aster541 ? [
          { l: '● Como estão as coisas?', go: 'fala541' },
          { l: (npcHas541() ? 'Sobre o que você me ensinou' : affL541() >= 3 ? '◆ Missão pessoal: ' + NPCQ[nome].d : '⌂ Missão pessoal (3 corações)'), go: 'missao541' },
          { l: '♥ Trouxe um presente (' + giftC541() + ' de ouro)', if: () => typeof AFF_PERK !== 'undefined' && AFF_PERK[nome] && affL541() < 10 && gold() >= giftC541(), fn: () => { const b = affL541(); act541('gift', nome); return affL541() > b ? 'presente541' : 'raiz'; } },
        ] : []),
        /* v545: três assuntos desta pessoa para hoje; a pergunta dela de volta; notícias, elogio, agrado e provocação com outras palavras */
        ...assuntos.map(a => ({ l: '● ' + a.l(n), go: 'a545_' + a.id })),
        { l: '● Conversar sobre a vida', go: 'p545', if: () => !f.t545_pergunta && n.role523 !== 'crianca' && !aster541 },
        { l: of545(['Perguntar como andam as coisas na cidade', 'Alguma novidade por aqui?', 'O que andam dizendo por aí?'], sd), go: 'noticias' },
        { l: elogioL, go: 'elogio', if: () => m.bond < 5 && sd % 2 === 0 },
        { l: of545(['Pedir um agrado', 'Perguntar se ' + nome + ' tem algo sobrando para você'], sd), go: 'agrado', if: () => n.role523 !== 'crianca' && m.bond >= 2 },
        { l: provocaL, go: 'provoca', if: () => n.role523 !== 'crianca' && sd % 3 !== 1 },
        { l: 'Ver o crédito do modelo desta criança', if: () => n.role523 === 'crianca', fn: () => { say('<b>Crédito:</b> modelo "Low Poly Kid" de malekith97 (Nitin Chowdary), licença CC BY 4.0, do OpenGameArt.'); return 'raiz'; } },
        { l: of545(['Até logo', 'Preciso ir', 'Até mais'], sd), fn: () => { setTimeout(() => { try { if (typeof speech153 === 'function') speech153(n, J.tchau, ''); } catch (_) {} }, 60); return 'fim'; } }
      ]
    };

    for (const a of ASSUNTO545) {
      const k = h545(nome + '|' + a.id), txt = of545(a.r, k);
      N['a545_' + a.id] = { t: txt, o: [{ l: of545(['Entendi', 'Interessante', 'Obrigado por contar'], k >>> 2), fn: () => { if (!f[tema(a.id)]) { f[tema(a.id)] = 1; m.bond = Math.min(5, m.bond + 1); save(); } return 'raiz'; } }] };
    }
    N.p545 = { t: of545(['Posso te perguntar uma coisa? ', 'Agora é a minha vez. ', 'Diga uma coisa. '], sd) + PERGUNTA545.l,
      o: PERGUNTA545.o.map(([l, gosta]) => ({ l: l, fn: () => { f.t545_pergunta = 1; const ok = gosta.includes(jeito545(n)); if (ok) m.bond = Math.min(5, m.bond + 1); f.r545 = ok ? 1 : 0; save(); return 'p545r'; } })) };
    N.p545r = { t: f.r545 ? of545(['É isso! Finalmente alguém que pensa como eu.', 'Gostei de ouvir isso. De verdade.'], sd) : of545(['Hm. Cada um com seus motivos.', 'Não é o que eu faria. Mas respeito.'], sd), o: [{ l: 'Voltar', go: 'raiz' }] };

    if (aster541) {
      const qq = NPCQ[nome], st541 = () => (profile.npcq || {})[nome] || { got: 0 };
      N.fala541 = { t: String(NPCTALK[nome][Math.min(NPCTALK[nome].length - 1, Math.floor(affL541() / 2))]).replace(/\{nome\}/g, (profile && profile.name) || 'Viajante'), o: [{ l: 'Entendi', go: 'raiz' }] };
      N.missao541 = npcHas541() ? { t: 'Você já carrega ' + qq.sk + '. Use bem.', o: [{ l: 'Voltar', go: 'raiz' }] }
        : affL541() < 3 ? { t: 'Ainda não confio em você para isso. Volte quando a gente se conhecer melhor.', o: [{ l: 'Entendi', go: 'raiz' }] }
        : st541().got >= qq.n ? { t: 'Você fez o que eu pedi. Leve isto: ' + qq.sk + '.', o: [{ l: '◆ Aceitar', fn: () => { act541('npcdone', nome); return 'raiz'; } }] }
        : { t: qq.d + '. Até agora: ' + Math.min(st541().got, qq.n) + ' de ' + qq.n + '. Recompensa: 25 de reputação da Ordem e ' + qq.sk + '.', o: [{ l: 'Vou cuidar disso', go: 'raiz' }] };
      N.presente541 = { t: 'Hm. Não precisava. Mas não vou recusar.', o: [{ l: 'De nada', go: 'raiz' }] };
    }
    N.sobre_banco = {
      t: 'O que fica no banco não se perde, mesmo se você cair lá fora. E o seu ouro guardado rende juros diários todos os dias.',
      o: [{ l: 'Entendi, obrigado', go: 'raiz' }]
    };
    N.dica_forja = {
      t: 'Traga ouro e cristais da categoria do item. Cada nível concede +8% de poder. Acima do nível 10, há risco de perder os materiais se falhar.',
      o: [{ l: 'Entendi', go: 'raiz' }]
    };
    N.dica_pocao = {
      t: 'Poções de cura salvam na hora do aperto. E se for enfrentar Fendas de rank alto, leve sempre um Pergaminho de Ressurgimento.',
      o: [{ l: 'Boa dica', go: 'raiz' }]
    };
    N.noticias = {
      t: news0(),
      o: [{ l: 'Obrigado pela informação', fn: () => { if (!f.noticias) { f.noticias = 1; m.bond = Math.min(5, m.bond + 1); save(); } return 'raiz'; } }]
    };
    N.elogio = {
      t: f.elogiou ? 'Você já disse isso. Mas continuo gostando de ouvir.' : J.elogio,
      o: [{ l: 'Voltar', fn: () => { if (!f.elogiou) { f.elogiou = 1; m.bond = Math.min(5, m.bond + 1); save(); } return 'raiz'; } }]
    };
    N.agrado = m.bond >= 3
      ? { t: 'Como você tem sido bom comigo, aceite isto. Não conte a ninguém.',
        o: [{ l: 'Aceitar (' + (f.agrado ? 'já recebeu antes, vale 25' : '100') + ' de ouro)', fn: () => { addGold(f.agrado ? 25 : 100); f.agrado = 1; m.bond = Math.max(0, m.bond - 1); save(); return 'raiz'; } }, { l: 'Recusar com educação', go: 'raiz' }] }
      : { t: 'Um agrado? A gente mal se conhece. Volte quando eu souber mais de você (afeto 3 de 5).',
        o: [{ l: 'Entendi', go: 'raiz' }] };
    N.provoca = {
      t: J.provoca,
      o: [
        { l: 'Repetir e ir embora (-10 de reputação)', fn: () => { f.ofendido = 1; fama('maldade'); m.bond = 0; subRep(10); save(); say('<b>' + nome + '</b> vira as costas. Ele não vai tratar com você tão cedo.'); return 'fim'; } },
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

  /* --- MENDIGOS (v522) --- */
  const PASSADO = [
    'Eu era ferreiro, até a Fenda levar minha oficina e tudo que eu tinha.',
    'Fui soldado da Ordem. Perdi a perna esquerda num cerco e ninguém me quis depois.',
    'Tinha uma plantação ao norte. As feras comeram tudo em uma noite.',
    'Fui mercador. Um golpe de sócio me deixou sem nada, só a roupa do corpo.'
  ];
  function buildBeggar(n) {
    const m = tmem(n), f = m.flags, nome = n.short || n.name;
    const h = (String(nome).length + (m.meets || 0)) % PASSADO.length;
    const N = {};
    N.raiz = {
      t: f.expulso ? 'Por favor... não me bata de novo.'
        : m.bond >= 4 ? 'Meu amigo! Que bom ver você. Os outros dizem que você é um homem honrado.'
        : m.bond >= 2 ? 'Você de novo... Que a luz lhe pague pelo que já fez.'
        : 'Uma moedinha, nobre viajante? Faz dois dias que não como.',
      o: [
        { l: 'Dar 1 de ouro', if: () => gold() >= 1, fn: () => { addGold(-1); fama('bondade'); m.bond = Math.min(5, m.bond + 1); f.expulso = 0; save(); say('<b>' + nome + ':</b> "Obrigado, de coração."'); return m.bond >= 3 && !f.presente ? 'presente' : 'raiz'; } },
        { l: 'Dar 10 de ouro', if: () => gold() >= 10, fn: () => { addGold(-10); fama('bondade'); m.bond = Math.min(5, m.bond + 2); f.expulso = 0; save(); return m.bond >= 3 && !f.presente ? 'presente' : 'noticia'; } },
        { l: 'Dar 50 de ouro', if: () => gold() >= 50 && !f.deu50, fn: () => { addGold(-50); f.deu50 = 1; f.expulso = 0; m.bond = 5; if (typeof addOrderRep === 'function') addOrderRep(5, 'A Ordem soube da sua bondade'); save(); return m.bond >= 3 && !f.presente ? 'presente' : 'raiz'; } },
        { l: 'Perguntar o que aconteceu com ele', go: 'passado' },
        { l: 'Expulsar: "Saia daqui, vagabundo" (-15 de reputação)', fn: () => { f.expulso = 1; fama('maldade'); m.bond = 0; subRep(15); save(); dismissNpc(); say('<b>' + nome + '</b> sai arrastando os pés. Quem viu não gostou.'); return 'fim'; } },
        { l: 'Ignorar e seguir', fn: () => 'fim' }
      ]
    };
    N.passado = { t: PASSADO[h], o: [{ l: 'Sinto muito', go: 'raiz' }] };
    N.noticia = { t: news(n, 'A cidade anda calma.'), o: [{ l: 'Obrigado pela notícia', go: 'raiz' }] };
    N.presente = {
      t: 'Espere... guardei isto escondido dos saqueadores. Você foi o único que me tratou como gente. Fique com isto.',
      o: [{ l: 'Aceitar (150 de ouro)', fn: () => { f.presente = 1; addGold(150); save(); say('<b>' + nome + '</b> entrega 150 de ouro escondidos.'); return 'raiz'; } },
        { l: 'Recusar: "Guarde para você"', fn: () => { f.presente = 1; m.bond = 5; if (typeof addOrderRep === 'function') addOrderRep(10, 'Recusou a esmola de um mendigo'); save(); return 'raiz'; } }]
    };
    return N;
  }
  function mendigo(n) {
    const m = tmem(n); m.meets++;
    const def = { name: n.name, title: n.short || n.name, type: 'cidade:' + n.name };
    ctx = { def, npc: n, builder: () => buildBeggar(n), tree: buildBeggar(n), node: 'raiz' };
    render();
  }

  /* --- MORADORES COM ROTINA, GUARDAS E BÊBADOS (v523) --- */
  function actTxt(n) { return ({ trabalho: 'Estou no meio do trabalho.', almoco: 'É hora do almoço, deixe eu comer em paz.', taverna: 'Depois do serviço, nada como uma caneca na taverna.', casa: 'Estou indo para casa descansar.', patrulha: 'Estou de ronda.', brincar: 'Pega eu! Você não me pega!', briga: 'Saia daqui, isso não é da sua conta!' })[n.act523] || 'Tenho muito o que fazer hoje.'; }
  function buildGuard(n) {
    const m = tmem(n), f = m.flags, nome = n.short || n.name;
    const multa = () => profile && profile.multa523;
    /* v545: recompensa por crime nesta cidade (tools/crime545.js) */
    const cr = () => (window.Crime545 && n.home ? Crime545.bounty(n.home) : 0), cn = n.home && n.home.name || 'esta cidade';
    const N = {};
    if (cr()) {
      N.raiz = {
        t: 'Pare, criminoso! Você tem ' + cr() + ' de recompensa em ' + cn + '. Pague agora ou enfrente a guarda.',
        o: [
          { l: 'Pagar a recompensa (' + cr() + ' de ouro)', if: () => gold() >= cr(), fn: () => { Crime545.pay(n.home); say('<b>' + nome + ':</b> "Pago. Agora ande na linha."'); return 'fim'; } },
          { l: 'Não tenho o ouro', if: () => gold() < cr(), fn: () => { say('<b>' + nome + ':</b> "Então volte com ' + cr() + ' de ouro. Até lá, estou de olho em você."'); return 'fim'; } },
          { l: 'Resistir à prisão', fn: () => { Crime545.resist(n.home); return 'fim'; } }
        ]
      };
      return N;
    }
    N.raiz = {
      t: multa() ? 'Alto lá. Você me deve uma multa por desordem.' : m.bond >= 3 ? 'Cidadão de bem! Ando de olho nos ladrões, pode andar tranquilo.'
        : of545(['Mantenha a ordem e não teremos problema.', 'Circulando, viajante. Algum problema?', 'Mais uma ronda, mais um dia sem dormir.', night545() ? 'Noite calma. Calma demais.' : 'Dia tranquilo. Do jeito que eu gosto.'], h545(day545() + '|' + nome) + (m.meets || 0)),
      o: [
        ...assuntos545(n, m, N, 2),
        { l: 'Pagar a multa de 50 de ouro', if: () => multa() && gold() >= 50, fn: () => { addGold(-50); profile.multa523 = 0; save(); say('<b>' + nome + ':</b> "Multa paga. Siga em frente."'); return 'raiz'; } },
        { l: 'Subornar o guarda (100 de ouro, -10 de reputação)', if: () => multa() && gold() >= 100, fn: () => { addGold(-100); profile.multa523 = 0; subRep(10); save(); say('<b>' + nome + '</b> olha para o lado e perdoa a multa.'); return 'raiz'; } },
        { l: 'Perguntar se há ladrões por perto', go: 'ladroes' },
        { l: 'Perguntar como andam as coisas na cidade', go: 'noticias' },
        { l: 'Provocar: "Você é um covarde"', go: 'provoca' },
        { l: 'Seguir em frente', fn: () => 'fim' }
      ]
    };
    N.ladroes = { t: n.home && n.home.ladrao523 ? 'Sim! Um ladrão anda rondando. Se ele roubar você, grite que eu corro atrás dele.' : 'Por enquanto está tudo calmo. Eles aparecem mais à noite.', o: [{ l: 'Obrigado', go: 'raiz' }] };
    N.noticias = { t: news(n, 'Tudo calmo.'), o: [{ l: 'Obrigado', fn: () => { if (!f.n) { f.n = 1; m.bond = Math.min(5, m.bond + 1); save(); } return 'raiz'; } }] };
    N.provoca = { t: 'Repita isso e vai passar a noite na cela.', o: [
      { l: 'Repetir (multa de 50 e -10 de reputação)', fn: () => { profile.multa523 = 1; m.bond = 0; subRep(10); save(); return 'raiz'; } },
      { l: 'Recuar', go: 'raiz' }] };
    return N;
  }
  function buildDrunk(n) {
    const m = tmem(n), f = m.flags, nome = n.short || n.name;
    const N = {};
    N.raiz = {
      t: m.bond >= 3 ? 'Meu... hic... melhor amigo! Senta aqui!' : 'Hic... quem é você? Paga uma pra mim?',
      o: [
        { l: 'Pagar uma bebida (5 de ouro)', if: () => gold() >= 5, fn: () => { addGold(-5); m.bond = Math.min(5, m.bond + 1); save(); return 'rumor'; } },
        { l: 'Ajudar a ir para casa', fn: () => { if (!f.ajudou) { f.ajudou = 1; if (typeof addOrderRep === 'function') addOrderRep(2, 'Ajudou um bêbado a voltar para casa'); } n.act523 = 'casa'; n.drunk523 = 0; save(); return 'fim'; } },
        { l: 'Provocar: "Bêbado inútil"', fn: () => { if (profile) profile.multa523 = 1; subRep(10); save(); say('Um guarda viu a confusão. Você ganhou uma multa de 50 de ouro.'); return 'fim'; } },
        { l: 'Seguir', fn: () => 'fim' }
      ]
    };
    N.rumor = { t: news(n, 'Hic... a cidade é boa, só tem muito ladrão à noite.'), o: [{ l: 'Saúde!', go: 'raiz' }] };
    return N;
  }
  function buildBrawl(n) {
    const o = n.briga523, nome = n.short || n.name, on = o && (o.short || o.name), m = tmem(n), mo = o ? tmem(o) : null;
    const end = () => { n.brigaT523 = 0; n.act523 = 'trabalho'; if (o) { o.brigaT523 = 0; o.act523 = 'trabalho'; } };
    return { raiz: {
      t: nome + ' e ' + on + ' estão aos gritos. "Ele me deve dinheiro!" "Mentira, ele quebrou minha banca!"',
      o: [
        { l: 'Separar a briga', fn: () => { end(); if (typeof addOrderRep === 'function') addOrderRep(3, 'Separou uma briga'); fama('bondade'); save(); say('Os dois se acalmam e agradecem.'); return 'fim'; } },
        { l: 'Tomar o partido de ' + nome, fn: () => { end(); m.bond = Math.min(5, m.bond + 1); if (mo) mo.bond = Math.max(0, mo.bond - 1); save(); say('<b>' + on + '</b> te olha torto e vai embora.'); return 'fim'; } },
        { l: 'Tomar o partido de ' + on, fn: () => { end(); if (mo) mo.bond = Math.min(5, mo.bond + 1); m.bond = Math.max(0, m.bond - 1); save(); say('<b>' + nome + '</b> te olha torto e vai embora.'); return 'fim'; } },
        { l: 'Deixar para lá', fn: () => 'fim' }
      ] } };
  }
  function vida(n, orig) {
    if (n.brigaT523 && n.brigaT523 > performance.now() && n.briga523) {
      const def = { name: n.name, title: 'BRIGA', type: 'cidade:' + n.name };
      ctx = { def, npc: n, builder: () => buildBrawl(n), tree: buildBrawl(n), node: 'raiz' };
      render(); return;
    }
    if (n.role523 === 'guarda' || n.role523 === 'bebado') {
      const b = n.role523 === 'guarda' ? buildGuard : buildDrunk, m = tmem(n); m.meets++;
      const def = { name: n.name, title: n.short || n.name, type: 'cidade:' + n.name };
      ctx = { def, npc: n, builder: () => b(n), tree: b(n), node: 'raiz' };
      render(); return;
    }
    town(n, () => { try { if (typeof speech153 === 'function') speech153(n, actTxt(n), n.job523 || ''); } catch (_) {} });
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

  /* v546: conversa com árvore própria (usada pelas missões fixas, ex.: banca de ataduras do casal da Estrada Sul) */
  function custom(def, npc, builder, node) { ctx = { def, npc, builder: () => builder(), tree: builder(), node: node || 'raiz' }; render(); }
  global.Dialogo520 = { open, pick, town, mendigo, vida, fama, custom, close: closeSkyrimDialog };
})(typeof window !== 'undefined' ? window : globalThis);
