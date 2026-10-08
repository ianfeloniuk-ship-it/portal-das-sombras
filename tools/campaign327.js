/* v327 (Ian): missões jogáveis da campanha. Cada ato tem passos de verdade (ir, lutar, falar, subir a Torre),
   as missões de NPC da Crônica de Aster existem no jogo e a tela de rank mostra os 13 atos. Estado em profile.camp327. */
(function () {
  'use strict';
  if (typeof profile === 'undefined' && typeof window.profile === 'undefined') { /* perfil é global léxico do game.html */ }
  const SHOP_NPC = { guild: 'Lyra', pot: 'Mira', wep: 'Kael', arm: 'Brann', defense: 'Brann', mkt: 'Dorian', bank: 'Selene' };
  const GUARD = { body: 0x5f6f86, hair: 0x6b4a2a, wep: 'sword', gk: 'Knight', tint: 0xd0e0ff, scale: .95 };
  const ALDRIC = { body: 0x4a3a2a, hair: 0xe8e8ff, wep: 'sword', gk: 'Knight', tint: 0xffe0c0, scale: 1 };
  const CIV = () => ({ body: pick([0x6b4a2a, 0x3a5fd0, 0x8a2b4a, 0x2f7a4a, 0xb39a6a]), hair: pick([0x222222, 0xc85a1e, 0x6b4a2a, 0xd8b060]), wep: 'none', gk: pick(['Barbarian', 'Mage', 'Rogue']), tint: 0xffe0c0, scale: .85 });
  const GOB = ['goblin', 'gobArcher118', 'gobShield118', 'gobBrute118', 'gobShaman118'];

  /* t: talk (abrir o NPC na cidade) · go (marcador no mundo; fight = inimigos que aparecem ao chegar; pts = vários pontos)
     ev (evento contado do jogo) · tower (andar da Torre; rel = andares acima do recorde ao começar) · city · caps · diary */
  const ACTS = [
    { id: 'a1', act: 1, title: 'I — O Chamado', steps: [
      { t: 'go', d: 'Ajude o guarda ferido na estrada perto de {cidade}.', verb: 'AJUDAR O GUARDA', fig: { look: GUARD, name: 'Guarda ferido' }, fight: { n: 3 },
        done: 'Guarda ferido: — Você caiu do céu e ainda lutou por mim. Vá para a muralha e avise Lyra que a estrada caiu.' },
      { t: 'city', d: 'Alcance a muralha de {cidade}.', done: 'Uma voz, perto demais: — A muralha. Continue.' },
      { t: 'talk', npc: 'Lyra', d: 'Registre seu nome com Lyra, na Ordem.', say: ['Mais alguém que caiu sob as estrelas erradas. Você não é o primeiro esta semana, {nome}.', 'Vou registrar seu nome. A Ordem dá abrigo a Transmigradores; em troca, você caça as Fendas.'] }] },
    { id: 'a2', act: 2, title: 'II — O Diário de Aldric', steps: [
      { t: 'talk', npc: 'Brann', d: 'Fale com Brann, na Defesa da Vila, sobre a patrulha sumida.', say: ['Uma patrulha minha sumiu na estrada com uma carroça de mantimentos. Aldric ia junto.', 'Vá na frente. Eu seguro a muralha.'] },
      { t: 'go', d: 'Encontre a carroça interrompida pela Fenda.', verb: 'EXAMINAR A CARROÇA', fight: { n: 5, el: 1 },
        done: 'Entre as caixas há um caderno de capa queimada: o diário de Aldric.' },
      { t: 'go', d: 'Resgate os sobreviventes escondidos perto da carroça.', verb: 'AJUDAR O SOBREVIVENTE', pts: 2, near: 1, fig: { civ: true, name: 'Sobrevivente' },
        done: 'Sobrevivente: — Aldric entrou numa passagem vermelha atrás de uma criança. Não voltou.' },
      { t: 'talk', npc: 'Lyra', d: 'Leve o diário de Aldric a Lyra.', say: ['"As marcas se repetem." Aldric viu um padrão antes de todo mundo.', 'Ele fala de uma construção mais antiga que os portais. Se quiser respostas, comece pela Torre.'] }] },
    { id: 'a3', act: 3, title: 'III — A Torre Antiga', steps: [
      { t: 'tower', rel: 5, d: 'Suba 5 andares acima do seu recorde na Torre da Ascensão.' },
      { t: 'go', d: 'Copie a inscrição da pedra antiga nas ruínas perto de {cidade}.', verb: 'COPIAR A INSCRIÇÃO', fight: { n: 4 },
        done: 'É a mesma marca do diário de Aldric, mas a data gravada não bate com nenhum arquivo. A voz murmura: — Vocês chegaram a esta parte.' },
      { t: 'talk', npc: 'Lyra', d: 'Compare a inscrição com as anotações da Ordem.', say: ['Essa data é anterior às Fendas. Alguém tentou conter isso antes de nós.'] }] },
    { id: 'a4', act: 4, title: 'IV — As Marcas', steps: [
      { t: 'ev', ev: 'boss', n: 2, d: 'Derrote 2 guardiões e compare as marcas gravadas neles.' },
      { t: 'talk', npc: 'Lyra', d: 'Leve as marcas dos guardiões a Lyra.', say: ['Os guardiões vêm de mundos diferentes, mas carregam a mesma marca.', 'Nos registros antigos, quem faz isso tem um nome: o Arquiteto.'] },
      { t: 'go', d: 'Procure o registro do Arquiteto no arquivo soterrado.', verb: 'LER O REGISTRO', fight: { n: 5, el: 1 },
        done: '"O Arquiteto não abre portas. Ele recolhe o que passa por elas." O resto da página foi arrancado.' }] },
    { id: 'a5', act: 5, title: 'V — O Retorno', steps: [
      { t: 'go', d: 'Encontre o veterano que voltou ferido de uma Fenda.', verb: 'AJUDAR ALDRIC', fig: { look: ALDRIC, name: 'Aldric' }, fight: { n: 5, el: 1 },
        done: 'Aldric: — Você leu meu diário? Ótimo. Então me leve até a Mira antes que eu desmaie.' },
      { t: 'talk', npc: 'Mira', d: 'Leve Aldric até Mira, na Loja de Poções.', say: ['Aldric?! Senta e não fala. Esses cortes são de criaturas que não existem aqui.', 'Ele vai ficar bem. Pediu que você ouça o relato dele com a Lyra.'] },
      { t: 'talk', npc: 'Lyra', d: 'Compare o relato de Aldric com as marcas já registradas.', say: ['Aldric diz que o Arquiteto quer caçadores fortes e se alimenta de quem sobe.', 'As marcas que você registrou batem com o que ele viu. Não suba sozinho, {nome}.'] }] },
    { id: 'a6', act: 6, title: 'VI — As Muralhas', steps: [
      { t: 'talk', npc: 'Mira', d: 'Pegue os suprimentos com Mira.', say: ['Esses remédios precisam chegar à estrada. A rota está cercada.'] },
      { t: 'go', d: 'Leve os remédios até a rota ameaçada.', verb: 'ENTREGAR OS REMÉDIOS', fight: { n: 6, el: 1 },
        done: 'Os feridos da estrada recebem os remédios. Alguém avisa que a defesa da cidade está rachando.' },
      { t: 'ev', ev: 'mine', n: 20, d: 'Minere 20 cristais para Brann reparar a defesa.' },
      { t: 'talk', npc: 'Brann', d: 'Entregue os cristais a Brann.', say: ['É disso que eu precisava. Com isso a defesa aguenta mais um cerco.'] },
      { t: 'go', d: 'Contenha a brecha da invasão e procure sobreviventes.', verb: 'PROCURAR SOBREVIVENTES', fig: { civ: true, name: 'Sobrevivente' }, fight: { n: 8, el: 2 }, zone: 'edge',
        done: 'Sobrevivente: — Achei que ninguém vinha. Obrigado.' }] },
    { id: 'a7', act: 7, title: 'VII — O Topo', steps: [
      { t: 'tower', n: 100, d: 'Chegue ao andar 100 da Torre da Ascensão.' },
      { t: 'talk', npc: 'Lyra', d: 'Conte a Lyra o que viu no mapa do topo.', say: ['Um mapa de mundos inteiros, em pedaços…', 'Um deles parece com o seu, {nome}. Talvez ainda exista alguém lá.'] }] },
    { id: 'a8', act: 8, title: 'VIII — O Clã Ferrugem', steps: [
      { t: 'go', d: 'Encontre Torvo, do Clã Ferrugem, na estrada perto de {cidade}.', verb: 'FALAR COM TORVO', fig: { torvo: true },
        done: 'Torvo: — Você caçou goblins a vida inteira e ainda veio conversar. Tem gente usando o nome do meu clã para saquear.' },
      { t: 'go', d: 'Derrote os saqueadores que usam o nome do Clã Ferrugem.', verb: 'RECOLHER O ESTANDARTE FALSO', fight: { n: 6, el: 1, kinds: GOB },
        done: 'O estandarte foi pintado por cima. Não é o vermelho do Clã.' },
      { t: 'go', d: 'Ajude os refugiados escondidos na estrada.', verb: 'GUIAR O REFUGIADO', pts: 2, near: 1, fig: { civ: true, name: 'Refugiado' },
        done: 'Refugiado: — O caminho está livre? Então vamos.' },
      { t: 'go', d: 'Volte a Torvo e ouça o testemunho dele.', verb: 'OUVIR TORVO', same: 0, fig: { torvo: true },
        done: 'Torvo: — Atravessamos há cem anos. Nosso mundo foi esvaziado. Ele não destrói mundos: ele os recolhe.' }] },
    { id: 'a9', act: 9, title: 'IX — As Capitais', steps: [
      { t: 'talk', npc: 'Lyra', d: 'Compare com Lyra os registros das capitais.', say: ['Os ataques seguem as cinco capitais. Cada uma guarda uma Âncora.', 'Vá ver com os próprios olhos onde a pressão é real.'] },
      { t: 'caps', n: 3, d: 'Visite 3 capitais e veja a pressão sobre as Âncoras.' },
      { t: 'ev', ev: 'elite', n: 6, d: 'Contenha as ameaças: derrote 6 elites.' },
      { t: 'talk', npc: 'Brann', d: 'Conte a Brann onde reforçar as defesas.', say: ['Reforçamos onde a pressão era real, não onde o medo mandava. Bom trabalho.'] }] },
    { id: 'a10', act: 10, title: 'X — Pedaços de Deus', steps: [
      { t: 'talk', npc: 'Lyra', d: 'Leve a Lyra o fragmento do Logos.', say: ['Você derrubou um Logos. Os portais perigosos estão calmos, mas não por muito tempo.'] },
      { t: 'ev', ev: 'clear', n: 3, d: 'Aproveite a calma: feche 3 portais.' },
      { t: 'talk', npc: 'Dorian', d: 'Organize a expedição com Dorian, no Mercado.', say: ['Suprimentos para uma expedição? Separo o melhor. Só me traga histórias de volta.'] }] },
    { id: 'a11', act: 11, title: 'XI — A Mão do Arquiteto', steps: [
      { t: 'talk', npc: 'Lyra', d: 'Conte a Lyra sobre a mão do Portal Primordial.', say: ['Uma mão do outro lado… Precisamos dos registros da abertura antiga.'] },
      { t: 'go', d: 'Recupere os registros da abertura antiga, guardados por criaturas da Fenda.', verb: 'RECUPERAR OS REGISTROS', fight: { n: 8, el: 2 },
        done: 'Os registros contam a mesma abertura duas vezes, com detalhes diferentes.' },
      { t: 'talk', npc: 'Lyra', d: 'Confronte as divergências com Lyra.', say: ['Dois relatos do mesmo dia que não concordam. Alguém mentiu, ou alguém não sabia de tudo.'] }] },
    { id: 'a12', act: 12, title: 'XII — O Narrador', steps: [
      { t: 'talk', npc: 'Lyra', d: 'Apresente a Lyra as provas da abertura antiga.', say: ['A voz que guia você estava lá na abertura? Então leia o que ela mesma conta.'] },
      { t: 'diary', d: 'Leia a confissão no Diário → História.' },
      { t: 'go', d: 'Compare a confissão com uma inscrição antiga perto de {cidade}.', verb: 'COMPARAR A INSCRIÇÃO', fight: { n: 6, el: 1 },
        done: 'A inscrição e a confissão concordam numa coisa: o Primeiro Guardião era um selo.' },
      { t: 'talk', npc: 'Lyra', d: 'Decida a defesa com Lyra.', say: ['Então defendemos as Âncoras. Ouvindo a voz, mas conferindo tudo.'] }] },
    { id: 'a13', act: 13, title: 'XIII — Quem Fechou a Porta', steps: [
      { t: 'talk', npc: 'Brann', d: 'Ajude Brann a começar a reconstrução.', say: ['A estrada ainda tem pó dourado. Vamos reconstruir.'] },
      { t: 'talk', npc: 'Mira', d: 'Veja como estão os feridos com Mira.', say: ['Pela primeira vez em muito tempo: só feridos, nenhum desaparecido.'] },
      { t: 'talk', npc: 'Lyra', d: 'Registre o resultado com Lyra.', say: ['Vou escrever seu nome na parede. Ninguém tinha fechado a porta antes de você, {nome}.'] }] }
  ];
  const SIDE = [
    { id: 'lyra_names', npc: 'Lyra', after: 'a1', steps: [
      { t: 'go', d: 'Recupere 3 registros de viajantes perdidos perto de {cidade}.', verb: 'RECOLHER O REGISTRO', pts: 3, fight: { n: 2 },
        done: 'Um nome, um mundo de origem e uma data. Mais alguém chegou como você.' },
      { t: 'talk', npc: 'Lyra', d: 'Leve os registros a Lyra.', say: ['Três nomes, três pessoas que chegaram como você. Uma delas ainda está viva e procura a família.'] }] },
    { id: 'mira_route', npc: 'Mira', after: 'a2', steps: [
      { t: 'talk', npc: 'Mira', d: 'Fale com Mira sobre a carga perdida.', say: ['A carga de remédios saiu ontem e não chegou. Os feridos estão esperando.'] },
      { t: 'go', d: 'Recupere a carga de remédios na estrada.', verb: 'RECUPERAR A CARGA', fight: { n: 5, el: 1 },
        done: 'A carga está inteira, só um pouco amassada.' },
      { t: 'talk', npc: 'Mira', d: 'Devolva a carga a Mira.', say: ['Inteira! Os feridos de hoje vão dormir melhor.'] }] },
    { id: 'brann_wall', npc: 'Brann', after: 'a3', steps: [
      { t: 'talk', npc: 'Brann', d: 'Fale com Brann sobre o trecho de defesa ameaçado.', say: ['Um trecho da defesa está cedendo. Preciso de cristais e de alguém para segurar os monstros.'] },
      { t: 'ev', ev: 'mine', n: 15, d: 'Minere 15 cristais para o reparo.' },
      { t: 'go', d: 'Proteja o reparo no trecho ameaçado.', verb: 'REPARAR A DEFESA', fight: { n: 6, el: 1 }, zone: 'edge',
        done: 'O reparo segura. Os guardas voltam aos postos.' },
      { t: 'talk', npc: 'Brann', d: 'Avise Brann que o trecho aguentou.', say: ['A defesa fica. Por causa de você.'] }] },
    { id: 'kael_weapon', npc: 'Kael', after: 'a4', steps: [
      { t: 'talk', npc: 'Kael', d: 'Fale com Kael sobre a arma abandonada.', say: ['Acharam uma arma largada perto da estrada. Ninguém larga uma arma boa à toa.'] },
      { t: 'go', d: 'Recupere a arma abandonada.', verb: 'PEGAR A ARMA', fight: { n: 4, el: 1 },
        done: 'A lâmina tem uma marca gravada por baixo da ferrugem.' },
      { t: 'talk', npc: 'Kael', d: 'Leve a arma a Kael.', say: ['Essa marca é a mesma dos guardiões. Alguém marcou o dono antes de ele cair.'] }] },
    { id: 'selene_record', npc: 'Selene', after: 'a5', steps: [
      { t: 'talk', npc: 'Selene', d: 'Fale com Selene, no Banco, sobre as cartas.', say: ['Tenho cartas de Transmigradores esperando resposta. Algumas notícias já foram conferidas.'] },
      { t: 'go', d: 'Entregue as notícias a quem espera.', verb: 'ENTREGAR A NOTÍCIA', pts: 2, fig: { civ: true, name: 'Morador' }, zone: 'in',
        done: 'Morador: — Então ele está vivo… Obrigado.' },
      { t: 'talk', npc: 'Selene', d: 'Volte a Selene.', say: ['Nomes guardados não se perdem. Obrigada por levar as notícias.'] }] },
    { id: 'dorian_delivery', npc: 'Dorian', after: 'a6', steps: [
      { t: 'talk', npc: 'Dorian', d: 'Fale com Dorian, no Mercado, sobre a carga suspeita.', say: ['Chegou uma carga sem destinatário. As marcas não são de nenhum mercador que eu conheça.'] },
      { t: 'go', d: 'Investigue o ponto de entrega da carga.', verb: 'EXAMINAR A CARGA', fight: { n: 6, el: 1 },
        done: 'Dentro há ordens escritas por alguém de fora, com uma lista de nomes.' },
      { t: 'talk', npc: 'Lyra', d: 'Compare as ordens com os registros da Ordem.', say: ['Ordens de fora, com nomes de pessoas daqui. Alguém está recolhendo gente.'] }] },
    { id: 'torvo_route', npc: 'Torvo', after: 'a8', steps: [
      { t: 'go', d: 'Encontre Torvo na estrada.', verb: 'FALAR COM TORVO', fig: { torvo: true },
        done: 'Torvo: — Uma caravana de goblins e de gente da cidade quer atravessar junta. Preciso de você na frente.' },
      { t: 'go', d: 'Abra caminho para a caravana dos dois povos.', verb: 'ABRIR O CAMINHO', fight: { n: 8, el: 2 },
        done: 'O caminho está livre.' },
      { t: 'go', d: 'Guie os viajantes da caravana.', verb: 'GUIAR O VIAJANTE', pts: 2, near: 1, fig: { civ: true, name: 'Viajante' },
        done: 'Viajante: — Nunca andei ao lado de um goblin. Até que foi tranquilo.' },
      { t: 'talk', npc: 'Lyra', d: 'Conte a Lyra sobre a caravana.', say: ['Uma estrada para dois povos. A Ordem vai proteger essa rota.'] }] }
  ];
  const story = window.SOLO_RPG_STORY || {};
  for (const s of SIDE) { const src = (story.sideQuests || []).find(q => q.id === s.id) || {}; s.title = src.title || s.id; s.consequence = src.consequence || ''; }
  const ALL = [...ACTS, ...SIDE];
  /* Páginas do Diário de cada missão concluída (registradas sempre, para saves antigos). */
  for (const m of ALL) {
    if (m.npc) LORE['camp327_' + m.id] = [m.title + ' · ' + m.npc, m.consequence];
    else { const A = (story.acts || [])[m.act - 1], e = ['Ato ' + m.title + ' · missão concluída', '']; Object.defineProperty(e, 1, { get: () => A ? fill(A.consequence, {}) : '' }); LORE['camp327_' + m.id] = e; }
  }
  const byId = id => ALL.find(m => m.id === id);
  const isSide = m => !m.act;

  const st = () => { profile.camp327 = profile.camp327 || { m: {} }; return profile.camp327; };
  const save = () => { try { store.set('pds2_profile', profile); } catch (_) {} };
  const nm = () => (profile && profile.name) || 'Viajante';
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lore = () => profile.lore || [];
  const cityName = s => (s && s.city) || 'Aster';
  const fill = (t, s) => String(t).replace(/\{nome\}/g, nm()).replace(/\{cidade\}/g, cityName(s));

  /* Quando cada ato abre (mesmas regras que já liberam as páginas do Diário). */
  const ACT_OPEN = {
    1: () => true,
    8: () => lore().includes('act8'), 9: () => lore().includes('act9'), 10: () => lore().includes('act10'),
    11: () => lore().includes('act11'), 12: () => lore().includes('act12'), 13: () => lore().includes('act13')
  };
  const ACT_HINT = {
    8: 'Converse com um caçador do Clã Ferrugem num posto da estrada.', 9: 'Visite outra capital além de Aster.',
    10: 'Derrote uma criatura de ameaça Logos.', 11: 'Feche o Portal Primordial.', 12: 'Chegue ao rank SS+ depois do Ato X.', 13: 'Derrote o Arquiteto.'
  };
  const actOpen = n => (ACT_OPEN[n] ? ACT_OPEN[n]() : (profile.rank || 0) >= n || (profile.acts || []).includes(n));
  const sideOpen = m => !!st().m[m.after]?.done;
  const state = id => st().m[id];
  const active = () => ALL.filter(m => { const s = state(m.id); return s && !s.done; });

  function begin(m) {
    const S = st(); if (S.m[m.id]) return;
    S.m[m.id] = { s: 0, got: 0, base: null, pos: null, city: null, killed: 0, fightDone: false, hit: [] };
    enterStep(m); save();
    toast('<b>[' + (isSide(m) ? m.npc.toUpperCase() : 'HISTÓRIA') + ']</b> ' + esc(isSide(m) ? m.title : 'Ato ' + m.title) + ': ' + esc(fill(m.steps[0].d, S.m[m.id])), 7000);
  }
  function enterStep(m) {
    const s = state(m.id), sp = m.steps[s.s]; if (!sp) return;
    s.got = 0; s.killed = 0; s.fightDone = !sp.fight; s.hit = [];
    if (sp.t === 'tower') s.base = sp.rel ? (profile.towerBest || 0) + sp.rel : sp.n;
    if (sp.t === 'go') { if (sp.same != null && s.saved && s.saved[sp.same]) s.pos = s.saved[sp.same].slice(); else if (!sp.near) s.pos = null; }
    if (!s.city && typeof player !== 'undefined' && player && L.mode === 'world') try { s.city = nearestCity(player.x, player.z).c.name; } catch (_) {}
  }
  function stepValue(m) {
    const s = state(m.id), sp = m.steps[s.s];
    if (!sp) return [0, 0];
    if (sp.t === 'tower') return [Math.min(profile.towerBest || 0, s.base), s.base];
    if (sp.t === 'caps') return [Math.min(sp.n, capsVisited()), sp.n];
    if (sp.t === 'ev') return [Math.min(sp.n, s.got), sp.n];
    if (sp.t === 'go') { const n = sp.pts || 1; return [s.hit.length, n]; }
    return [0, 1];
  }
  function capsVisited() { const V = profile.visited217 || {}; return 1 + Object.values(V).filter(v => v && v.cap && v.n !== 'Aster').length; }

  function advance(m, msg) {
    const s = state(m.id), sp = m.steps[s.s];
    if (msg) news(m, msg);
    if (sp && sp.t === 'go') { s.saved = s.saved || {}; s.saved[s.s] = s.pos ? s.pos.slice() : null; }
    clearWorld(m.id);
    s.s++; s.pos = (m.steps[s.s] && m.steps[s.s].near) ? s.pos : null;
    if (s.s >= m.steps.length) return finish(m);
    enterStep(m); save();
    try { sfx('level'); } catch (_) {}
    toast('<b>[' + (isSide(m) ? m.npc.toUpperCase() : 'HISTÓRIA') + ']</b> ' + esc(fill(m.steps[s.s].d, s)), 7000);
  }
  function news(m, text) { try { logNews('<b>[' + (isSide(m) ? esc(m.title) : 'ATO ' + esc(m.title)) + ']</b> ' + esc(fill(text, state(m.id))), 'important'); popNews194('<b>[HISTÓRIA]</b> ' + esc(fill(text, state(m.id))), 7000); } catch (_) {} }
  function finish(m) {
    const s = state(m.id); s.done = true; s.pos = null; save();
    const lvl = Math.max(1, run.level || 1), xp = RpgBalance.questReward({ type: 'clear', level: lvl, count: isSide(m) ? 1 : 2 }).xp;
    const got = gainXp(xp, 'quest'), gold = Math.round(questGold283({ t: 'clear', rank: Math.min(9, rankOf()) }) * (isSide(m) ? 2 : 3));
    run.gold += gold; addOrderRep(isSide(m) ? 20 : 40, isSide(m) ? 'Missão de ' + m.npc : 'Ato concluído');
    const key = 'camp327_' + m.id;
    try { unlockLore(key); } catch (_) {}
    bigText(isSide(m) ? 'MISSÃO CONCLUÍDA' : 'ATO ' + m.title.split(' — ')[0] + ' CONCLUÍDO', 1800); try { sfx('arise'); } catch (_) {}
    toast('<b>[' + (isSide(m) ? m.npc.toUpperCase() : 'HISTÓRIA') + ']</b> ' + esc(isSide(m) ? m.title : 'Ato ' + m.title) + ' concluído: +' + xpNumber(got) + ' XP · +' + fmt(gold) + ' ouro.', 8000);
    for (const o of SIDE) if (o.after === m.id) toast('<b>[' + o.npc.toUpperCase() + ']</b> Nova missão: <b>' + esc(o.title) + '</b>. Fale com ' + o.npc + (o.npc === 'Torvo' ? ' na estrada.' : '.'), 8000);
    if (run.trackObj === 'camp327:' + m.id) run.trackObj = null;
    saveRun();
  }

  /* ---------- marcadores no mundo (shader animado + figura) ---------- */
  const W = new Map(); // id -> {grp, figs[], inters[], foes[]}
  let beamGeo = null, ringGeo = null;
  function beamMat(col) {
    return new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { t: { value: 0 }, c: { value: new THREE.Color(col) } },
      vertexShader: 'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform float t;uniform vec3 c;varying vec2 vU;void main(){float y=vU.y;float band=.55+.45*sin(y*22.-t*3.);float edge=pow(1.-abs(vU.x-.5)*2.,1.5);float a=(1.-y)*(1.-y)*band*(.35+.65*edge);gl_FragColor=vec4(c*(1.2+band*.6),a*.75);}' });
  }
  function ringMat(col) {
    return new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { t: { value: 0 }, c: { value: new THREE.Color(col) } },
      vertexShader: 'varying vec2 vP;void main(){vP=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform float t;uniform vec3 c;varying vec2 vP;void main(){float r=length(vP);float a=atan(vP.y,vP.x);float rune=step(.55,fract(a*4.77+t*.4))*smoothstep(1.45,1.3,r)*smoothstep(1.05,1.2,r);float ring=smoothstep(.06,0.,abs(r-1.6+.05*sin(t*2.)))+smoothstep(.05,0.,abs(r-.9));float glow=smoothstep(1.8,0.,r)*.18*(.6+.4*sin(t*3.));gl_FragColor=vec4(c*1.4,clamp(rune*.8+ring+glow,0.,1.));}' });
  }
  const gy = (x, z) => { try { return typeof terrH === 'function' ? terrH(x, z) : 0; } catch (_) { return 0; } };
  function makeBeacon(x, z, side) {
    beamGeo = beamGeo || new THREE.CylinderGeometry(.55, .9, 16, 20, 1, true);
    ringGeo = ringGeo || new THREE.CircleGeometry(1.9, 48);
    const col = side ? 0x7fe8ff : 0xffc457, g = new THREE.Group();
    const b = new THREE.Mesh(beamGeo, beamMat(col)); b.position.y = 8; g.add(b);
    const r = new THREE.Mesh(ringGeo, ringMat(col)); r.rotation.x = -Math.PI / 2; r.position.y = .07; g.add(r);
    g.position.set(x, gy(x, z), z); g.userData.mats = [b.material, r.material]; g.renderOrder = 5; return g;
  }
  function place(s, sp, i) {
    if (i > 0 && s.pos) { // pontos extras ficam ao redor do primeiro
      for (let k = 0; k < 30; k++) { const a = rnd(0, TAU), d = rnd(7, 13), x = s.pos[0] + Math.cos(a) * d, z = s.pos[1] + Math.sin(a) * d; if (freeAt(x, z, 1.2)) return [x, z]; }
      return [s.pos[0] + 8 * i, s.pos[1]];
    }
    const c = nearestCity(player.x, player.z).c, wall = wallOf(c); s.city = c.name;
    const [d0, d1] = sp.zone === 'in' ? [wall * .3, wall * .55] : sp.zone === 'edge' ? [wall - 3, wall + 8] : [wall + 14, wall + 40];
    for (let k = 0; k < 60; k++) {
      const a = (Math.floor(rnd(0, 4)) * Math.PI / 2) + rnd(-.12, .12) * (sp.zone === 'in' ? 4 : 1), d = rnd(d0, d1), x = c.x + Math.cos(a) * d, z = c.z + Math.sin(a) * d;
      if (freeAt(x, z, 1.4) && freeAt(x + 2, z, 1) && freeAt(x - 2, z, 1) && !taken(x, z, s)) return [x, z];
    }
    return [c.x + d0, c.z];
  }
  function taken(x, z, own) { // longe das luzes de outras missões
    for (const m of active()) { const o = state(m.id); if (o === own) continue; for (const p of [o.pos, ...(o.extra || [])]) if (p && Math.hypot(p[0] - x, p[1] - z) < 18) return true; }
    return false;
  }
  function wallOf(c) { let w = 36 * CITYK; try { w = Math.max(w, cityPalisadeR(cityL(c)) || 0); } catch (_) {} return w; }
  function pointsOf(m) {
    const s = state(m.id), sp = m.steps[s.s], n = sp.pts || 1;
    if (!s.pos) s.pos = place(s, sp, 0);
    s.extra = s.extra && s.extra.length === n - 1 && s.extraStep === s.s ? s.extra : Array.from({ length: n - 1 }, (_, i) => place(s, sp, i + 1));
    s.extraStep = s.s;
    return [s.pos, ...s.extra];
  }
  function figure(f, x, z) {
    if (!f) return null;
    if (f.torvo) {
      try {
        const e = spawnKind(KINDS.gobShield118 ? 'gobShield118' : 'goblin', x + 2.2, z, 0, { wild: true });
        const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1);
        FRIENDS217.push(e); e.friendly217 = true; e.hp = e.maxhp = 1e9; e.name = 'Torvo, caçador do Clã Ferrugem'; e.short = 'Torvo'; e.noExpLoot = true;
        return { friend: e, x: x + 2.2, z };
      } catch (_) { return null; }
    }
    const m = makeChibi(f.civ ? CIV() : f.look); m.root.position.set(x + 1.8, gy(x + 1.8, z), z); scene.add(m.root);
    return { m, x: x + 1.8, z, name: f.name, t: Math.random() * 5 };
  }
  function clearWorld(id) {
    const w = W.get(id); if (!w) return;
    for (const g of w.grps) scene.remove(g);
    for (const f of w.figs) { if (!f) continue; if (f.m) { const root = f.m.root; setTimeout(() => scene.remove(root), w.L === L && L.mode === 'world' ? 6000 : 0); } if (f.friend) { f.friend.gone = true; try { scene.remove(f.friend.m.root); } catch (_) {} } }
    for (const it of w.inters) { const i = L.inter.indexOf(it); if (i >= 0) L.inter.splice(i, 1); }
    for (const e of w.foes) if (!e.dead) { e.dead = true; e.deadT = 0; try { scene.remove(e.m.root); } catch (_) {} const i = enemies.indexOf(e); if (i >= 0) enemies.splice(i, 1); }
    W.delete(id);
  }
  function buildWorldFor(m) {
    const s = state(m.id), sp = m.steps[s.s], pts = pointsOf(m), side = isSide(m);
    const w = { step: s.s, grps: [], figs: [], inters: [], foes: [], L };
    pts.forEach((p, i) => {
      if (s.hit.includes(i)) return;
      const g = makeBeacon(p[0], p[1], side); scene.add(g); w.grps.push(g);
      const fig = figure(sp.fig, p[0], p[1]); w.figs.push(fig);
      const it = { type: 'camp327', x: fig ? fig.x : p[0], z: fig ? fig.z : p[1], r: 3, label: 'F · ' + sp.verb, camp327: m.id, idx: i, use: () => useMarker(m, i) };
      L.inter.push(it); w.inters.push(it);
    });
    W.set(m.id, w); save();
  }
  function foesLeft(m) { const w = W.get(m.id); return w ? w.foes.filter(e => !e.dead && enemies.includes(e)).length : 0; }
  function useMarker(m, i) {
    const s = state(m.id), sp = m.steps[s.s]; if (!sp || sp.t !== 'go') return;
    if (!s.fightDone) { toast('<b>[HISTÓRIA]</b> Derrote os inimigos por perto primeiro (' + Math.max(1, (sp.fight.n + (sp.fight.el || 0)) * (sp.pts || 1) - s.killed) + ' restantes).', 3500); return; }
    if (s.hit.includes(i)) return;
    s.hit.push(i);
    const w = W.get(m.id);
    if (w) { const it = w.inters.find(x => x.idx === i); if (it) { const k = L.inter.indexOf(it); if (k >= 0) L.inter.splice(k, 1); }
      const fig = w.figs[w.inters.findIndex(x => x.idx === i)]; if (fig && fig.m) speech153({ m: fig.m, x: fig.x, z: fig.z, short: fig.name || '' }, fill(sp.done.replace(/^[^:—]+: — /, '— '), s));
      const gi = w.inters.findIndex(x => x.idx === i); if (gi >= 0 && w.grps[gi]) { w.grps[gi].userData.taken = true; scene.remove(w.grps[gi]); } }
    try { fxRing(player.x, player.z, isSide(m) ? 0x7fe8ff : 0xffc457, 2.2, .6); sfx('coin'); } catch (_) {}
    const n = sp.pts || 1;
    if (s.hit.length >= n) advance(m, sp.done); else { save(); toast('<b>[HISTÓRIA]</b> ' + s.hit.length + ' de ' + n + '.', 2500); }
  }
  function spawnFight(m) {
    const s = state(m.id), sp = m.steps[s.s], w = W.get(m.id); if (!w || !sp.fight) return;
    const total = (sp.fight.n + (sp.fight.el || 0)) * (sp.pts || 1), left = total - s.killed; if (left <= 0) return;
    const gr = Math.min(9, rankOf()), elites = Math.max(0, Math.min(left, (sp.fight.el || 0) * (sp.pts || 1) - Math.max(0, s.killed - sp.fight.n * (sp.pts || 1))));
    const pts = pointsOf(m);
    for (let i = 0; i < left; i++) {
      const p = pts[i % pts.length]; let x = p[0], z = p[1];
      for (let k = 0; k < 20; k++) { const a = rnd(0, TAU), d = rnd(5, 10); x = p[0] + Math.cos(a) * d; z = p[1] + Math.sin(a) * d; if (freeAt(x, z, .6)) break; }
      const pool = sp.fight.kinds ? sp.fight.kinds.filter(k => KINDS[k]) : null;
      const k = pool && pool.length ? pick(pool) : wpick(kindsFor(gr)).k;
      try { const e = spawnKind(k, x, z, gr, { wild: true }); e.aggro = true; if (i < elites) makeElite(e); e.camp327 = m.id; w.foes.push(e); fxRing(x, z, 0xff8a4a, 1.5); } catch (_) {}
    }
    toast('<b>[HISTÓRIA]</b> Inimigos à vista!', 2500);
  }

  /* ---------- laço ---------- */
  let T = 0;
  function tick() {
    if (typeof started === 'undefined' || !started || typeof player === 'undefined' || !player || !profile || profile.creationPending91 || !run) return;
    T += .3;
    const S = st();
    { const next = ACTS.find(m => !S.m[m.id]?.done); if (next && !S.m[next.id] && actOpen(next.act)) begin(next); }
    for (const m of SIDE) if (m.npc === 'Torvo' && !S.m[m.id] && sideOpen(m)) begin(m);
    const world = L.mode === 'world';
    for (const m of active()) {
      const s = state(m.id), sp = m.steps[s.s]; if (!sp) continue;
      if (sp.t === 'tower' && (profile.towerBest || 0) >= s.base) { advance(m); continue; }
      if (sp.t === 'caps' && capsVisited() >= sp.n) { advance(m); continue; }
      if (sp.t === 'city' && world) { const c = nearestCity(player.x, player.z); if (c.d < wallOf(c.c) - 4) { s.city = c.c.name; advance(m, sp.done); continue; } }
      if (sp.t !== 'go') { clearWorld(m.id); continue; }
      let w = W.get(m.id);
      if (w && (w.L !== L || w.step !== s.s || w.grps.some(g => !g.parent && !g.userData.taken))) { // mundo foi refeito: recria
        for (const e of w.foes) if (e.dead && !e.counted327) { e.counted327 = true; s.killed++; }
        w.foes = []; clearWorld(m.id); w = null;
      }
      if (!world) continue;
      if (!w) { buildWorldFor(m); w = W.get(m.id); }
      for (const g of w.grps) for (const mat of g.userData.mats) mat.uniforms.t.value = T;
      for (const f of w.figs) if (f && f.m) try { f.t += .3; animChibi(f.m, { move: 0, atk: 0, dead: 0, wind: 0 }, f.t); f.m.root.rotation.y = Math.atan2(player.x - f.x, player.z - f.z); } catch (_) {}
      if (!s.fightDone) {
        for (const e of w.foes) if (e.dead && !e.counted327) { e.counted327 = true; s.killed++; save(); }
        const total = (sp.fight.n + (sp.fight.el || 0)) * (sp.pts || 1);
        if (s.killed >= total) { s.fightDone = true; save(); toast('<b>[HISTÓRIA]</b> Área segura. ' + (sp.verb ? 'Aproxime-se e use F: ' + sp.verb.toLowerCase() + '.' : ''), 4000); }
        else if (!foesLeft(m) && pointsOf(m).some(p => Math.hypot(player.x - p[0], player.z - p[1]) < 22)) { w.foes = w.foes.filter(e => !e.dead && enemies.includes(e)); spawnFight(m); }
      }
    }
  }
  setInterval(() => { try { tick(); } catch (e) { if (!window.__camp327err) { window.__camp327err = 1; console.warn('campaign327', e); } } }, 300);

  /* ---------- ganchos nos sistemas do jogo ---------- */
  const evOrig = storyEv;
  storyEv = function (t, v = 1) {
    const r = evOrig.apply(this, arguments);
    try { for (const m of active()) { const s = state(m.id), sp = m.steps[s.s]; if (sp && sp.t === 'ev' && sp.ev === t) { s.got += v; if (s.got >= sp.n) advance(m); else save(); } } } catch (_) {}
    return r;
  };
  function talked(npc) {
    let hit = null;
    for (const m of active()) { const s = state(m.id), sp = m.steps[s.s]; if (sp && sp.t === 'talk' && sp.npc === npc) { hit = { m, sp, s }; break; } }
    if (!hit) return '';
    const lines = hit.sp.say.map(x => '<p style="margin:4px 0">“' + esc(fill(x, hit.s)) + '”</p>').join('');
    const title = isSide(hit.m) ? hit.m.title : 'Ato ' + hit.m.title;
    advance(hit.m, npc + ': ' + hit.sp.say[hit.sp.say.length - 1]);
    return '<div class="sysline" style="border-left:3px solid #ffc457;padding-left:10px"><b>' + esc(npc) + ' · ' + esc(title) + '</b>' + lines + '</div>';
  }
  const shopOrig = openShop;
  openShop = function (id) {
    const r = shopOrig.apply(this, arguments);
    try {
      const npc = SHOP_NPC[id];
      if (npc && L.mode === 'world' && (n => n.d < wallOf(n.c) + 25)(nearestCity(player.x, player.z))) { const box = talked(npc); if (box && modalOpen) $('mb').insertAdjacentHTML('afterbegin', box); }
    } catch (_) {}
    return r;
  };
  const jvOrig = journeyView;
  journeyView = function (tab) {
    const r = jvOrig.apply(this, arguments);
    try { if (tab === 'story') for (const m of active()) { const s = state(m.id), sp = m.steps[s.s]; if (sp && sp.t === 'diary' && lore().includes('act12')) advance(m, 'Você leu a confissão no Diário.'); } } catch (_) {}
    return r;
  };
  /* Missões dos NPCs aparecem na janela de afinidade de cada um. */
  const rowsOrig = npcRows;
  npcRows = function (n) {
    let h = rowsOrig.apply(this, arguments);
    try { for (const m of SIDE) if (m.npc === n) h += sideRow(m); } catch (_) {}
    return h;
  };
  function sideRow(m) {
    const s = state(m.id), lab = 'Missão da história: ' + m.title;
    if (!sideOpen(m)) return row(lab, 'Liberada ao concluir o Ato ' + byId(m.after).title + '.', '');
    if (!s) return row(lab, fill(m.steps[0].d, {}), btn('Aceitar', 'camp327', m.id, true, 'hot'));
    if (s.done) return row(lab, 'Concluída. ' + m.consequence, '<b style="color:#6fe39a">Feita</b>');
    const [a, b] = stepValue(m); return row(lab, 'Passo ' + (s.s + 1) + '/' + m.steps.length + ': ' + fill(m.steps[s.s].d, s) + (b > 1 ? ' (' + a + '/' + b + ')' : ''), btn('Acompanhar', 'trackobj', 'camp327:' + m.id, true));
  }
  const xa2 = extraActions2;
  extraActions2 = function (a, v) {
    if (a === 'camp327') { const m = byId(v); if (m && isSide(m) && sideOpen(m) && !state(m.id)) { begin(m); run.trackObj = 'camp327:' + m.id; save(); return true; } return false; }
    return xa2.apply(this, arguments);
  };
  function objective(m) {
    const s = state(m.id), sp = m.steps[s.s]; if (!sp) return null;
    const [a, b] = stepValue(m); let where = '';
    if (sp.t === 'go' && s.pos && L.mode === 'world') {
      const pts = pointsOf(m).filter((_, i) => !s.hit.includes(i)), p = pts[0] || s.pos, dx = p[0] - player.x, dz = p[1] - player.z, d = Math.round(Math.hypot(dx, dz));
      const dir = ['leste', 'sudeste', 'sul', 'sudoeste', 'oeste', 'noroeste', 'norte', 'nordeste'][(Math.round(Math.atan2(dz, dx) / (Math.PI / 4)) + 8) % 8];
      where = ' Luz ' + (isSide(m) ? 'azul' : 'dourada') + ' a ' + d + ' m, ' + dir + '.';
      if (!s.fightDone) where += ' Inimigos: ' + Math.max(0, (sp.fight.n + (sp.fight.el || 0)) * (sp.pts || 1) - s.killed) + '.';
    }
    if (sp.t === 'talk' && sp.npc !== 'Torvo') where = ' Fale com ' + sp.npc + ' numa cidade.';
    return { id: 'camp327:' + m.id, n: (isSide(m) ? m.title + ' · ' + m.npc : 'Ato ' + m.title), d: '', progress: fill(sp.d, s) + where + ' (passo ' + (s.s + 1) + '/' + m.steps.length + (b > 1 ? ' · ' + a + '/' + b : '') + ')', ready: false };
  }
  const joOrig = journeyObjectives;
  journeyObjectives = function () {
    const list = joOrig.apply(this, arguments);
    try { const mine = active().map(objective).filter(Boolean); list.unshift(...mine); } catch (_) {}
    return list;
  };
  const mpOrig = missionPanelText;
  missionPanelText = function () {
    let h = mpOrig.apply(this, arguments);
    try {
      const tr = run.trackObj && String(run.trackObj).startsWith('camp327:');
      if (!tr) { const m = active().find(x => !isSide(x)) || active()[0]; const o = m && objective(m);
        if (o) h = '<div class="objective-row" style="cursor:pointer" onclick="event.stopPropagation();journeyView()"><strong>' + esc(o.n) + '</strong><small>' + esc(o.progress) + '</small></div>' + h; }
    } catch (_) {}
    return h;
  };
  /* Tela de rank: os 13 atos, com a missão de cada um. */
  const rtOrig = rankTab;
  rankTab = function () {
    let h = rtOrig.apply(this, arguments);
    try {
      const mark = '<div class="sec">HISTÓRIA PRINCIPAL</div>', i = h.indexOf(mark); if (i < 0) return h;
      let out = mark;
      for (const m of ACTS) {
        const A = (story.acts || [])[m.act - 1], s = state(m.id), open = !!s || actOpen(m.act);
        if (!open) { out += row('<span style="opacity:.5">Ato ' + esc(m.title) + '</span>', m.act <= 7 ? 'Passe na prova para o rank ' + RANKS[m.act].id + '.' : ACT_HINT[m.act], ''); continue; }
        const status = !s ? 'Missão começa em instantes.' : s.done ? '<b style="color:#6fe39a">Missão concluída.</b>' : 'Passo ' + (s.s + 1) + '/' + m.steps.length + ': ' + esc(fill(m.steps[s.s].d, s));
        out += row('<b>Ato ' + esc(m.title) + '</b>', (A ? esc(fill(A.objective, s || {})) + '<br>' : '') + status, s && !s.done ? btn('Acompanhar', 'trackobj', 'camp327:' + m.id, true) : '');
      }
      h = h.slice(0, i) + out;
    } catch (_) {}
    return h;
  };
  window.Campaign327 = { ACTS, SIDE, state, active, begin, advance, tick, W };
})();
