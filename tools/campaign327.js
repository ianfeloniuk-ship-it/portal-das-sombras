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
      { t: 'go', d: 'Ajude Edran, o guarda caído ao lado da carroça tombada, na estrada perto de {cidade}.', verb: 'AJUDAR EDRAN', cart: true, fig: { look: GUARD, name: 'Edran', down: true }, fight: { n: 1, kinds: ['slime', 'gosma', 'goblin'] },
        done: 'Edran: — Procure Lyra e Kael em Aster.' },
      { t: 'city', d: 'Alcance a muralha de {cidade}.', done: 'Uma voz, perto demais: — A muralha. Continue.' },
      { t: 'talk', npc: 'Lyra', d: 'Registre seu nome com Lyra, na Ordem.', say: ['Mais alguém que caiu sob as estrelas erradas. Você não é o primeiro esta semana, {nome}.', 'Vou registrar seu nome. A Ordem dá abrigo a Transmigradores; em troca, você caça as Fendas.', 'Sem moedas? Ninguém que cai da Fenda tem. Fale com Kael, na loja de equipamentos: ele troca uma arma de treino por escambo.'] },
      { t: 'barter', d: 'Faça o escambo com Kael, na loja de equipamentos, e equipe sua primeira arma.', done: 'Kael: — Está feito. A Fenda reconhece o seu caminho, Viajante.' }] },
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
      { t: 'talk', npc: 'Lyra', d: 'Compare com Lyra os registros das capitais.', say: ['Os ataques seguem as cinco capitais: Ymiria, Zahar, Thalor, Urdan e Verden. Cada uma guarda uma Âncora.', 'Vá ver com os próprios olhos onde a pressão é real.'] },
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
    const s = state(m.id); s.done = true; s.pos = null; if(m.id==='a1')profile.openWorld401=true;save();
    const lvl = Math.max(1, run.level || 1), xp = RpgBalance.questReward({ type: 'clear', level: lvl, count: isSide(m) ? 1 : 2 }).xp;
    const got = m.id==='a1'?0:gainXp(xp, 'quest'), gold = Math.round(questGold283({ t: 'clear', rank: Math.min(9, rankOf()) }) * (isSide(m) ? 2 : 3));
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
    const g = new THREE.Group();
    g.position.set(x,gy(x,z),z);g.userData.mats=[];return g;
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
  function entryRadius(c){const gates=GATES341.filter(g=>g.c.name===c.name);return gates.length?Math.min(...gates.map(g=>Math.hypot(g.x-c.x,g.z-c.z))):wallOf(c)}
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
    const look = f.civ ? CIV() : f.look;
    const m = MODELS.list[look.gk] ? makeActor(look) : {root:new THREE.Group(),mats:[]};
    if (!m.model) MODELS.ready.then(() => {
      if (!m.root.parent || !MODELS.list[look.gk]) return;
      const old = m.root, ready = makeActor(look);
      ready.root.position.copy(old.position); ready.root.rotation.copy(old.rotation);
      scene.remove(old); Object.assign(m,ready); scene.add(m.root);
    }); m.root.position.set(x + 1.8, gy(x + 1.8, z) + (f.down ? .3 : 0), z); scene.add(m.root);
    if (f.down) { m.root.position.y = gy(x + 1.8, z); m.wounded401 = true; }
    return { m, x: x + 1.8, z, name: f.name, down: !!f.down, t: Math.random() * 5 };
  }
  function clearWorld(id) {
    const w = W.get(id); if (!w) return;
    for (const g of w.grps) {if(g===w.cart&&state(id)?.cartRescued401&&w.L===L)setTimeout(()=>scene.remove(g),6000);else scene.remove(g);}
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
      const g = makeBeacon(p[0] + (sp.fig?1.8:0), p[1], side); scene.add(g); w.grps.push(g);
      const fig = figure(sp.fig, p[0], p[1]); w.figs.push(fig);
      const it = { type: 'camp327', x: fig ? fig.x : p[0], z: fig ? fig.z : p[1], r: 3, label: 'F · ' + sp.verb, camp327: m.id, idx: i, use: () => useMarker(m, i) };
      L.inter.push(it); w.inters.push(it);
    });
    if (sp.cart && pts[0] && !s.hit.includes(0)) { const c = makeCart(pts[0][0] - 3.6, pts[0][1] - 2.8); scene.add(c); w.grps.push(c); w.cart=c; }
    if(m.id==='a1'&&s.s===0&&s.edranHelp401&&w.cart){w.inters[0].x=w.cart.position.x;w.inters[0].z=w.cart.position.z+2.3;w.inters[0].label='F · EMPURRAR A CARROÇA'}
    W.set(m.id, w); save();
  }
  /* Modelo real da carroça, sem boi e condutor durante o resgate. */
  function makeCart(x,z){
    const g=new THREE.Group();g.position.set(x,gy(x,z),z);g.rotation.y=.5;g.userData.mats=[];
    g.userData.loading=true;
    Wagon369.ready.then(ok=>{g.userData.loading=false;if(!ok)return;
      const w=Wagon369.create();w.mixer.stopAllAction();if(w.ox)w.ox.visible=false;if(w.driver.root)w.driver.root.visible=false;
      w.g.rotation.z=1.12;w.g.updateMatrixWorld(true);w.g.position.y-=new THREE.Box3().setFromObject(w.g).min.y;g.add(w.g);g.userData.wagon=w;g.userData.asset401='models/wagon369.glb';
    });return g;
  }
  function creak(){
    if(!AU.ctx||!AU.on)return;const c=AU.ctx,t=c.currentTime;
    const src=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();src.buffer=AU.noise;src.loop=true;
    filter.type='bandpass';filter.Q.value=8;filter.frequency.setValueAtTime(180,t);filter.frequency.exponentialRampToValueAtTime(470,t+1.6);filter.frequency.exponentialRampToValueAtTime(110,t+3);
    gain.gain.setValueAtTime(.001,t);gain.gain.linearRampToValueAtTime(.23,t+.4);gain.gain.linearRampToValueAtTime(.001,t+3.2);
    src.connect(filter);filter.connect(gain);gain.connect(AU.fx);src.start(t);src.stop(t+3.3);src.onended=()=>{src.disconnect();filter.disconnect();gain.disconnect()};
  }
  function rescueCart(m,i){
    const s=state(m.id),w=W.get(m.id);if(!w||w.rescuing)return;
    const cart=w.cart;if(!cart?.userData.wagon){toast('A carroça está carregando. Tente novamente em instantes.');return}
    w.rescuing=true;paused=true;player.iT=5;W377.releaseAll();
    const cx=cart.position.x,cz=cart.position.z;
    player.x=cx;player.z=cz+2.3;player.face=Math.PI;player.m.root.position.set(player.x,gy(player.x,player.z),player.z);player.m.root.rotation.y=Math.PI;
    if(window.Anim303){Anim303.A.empurrar401={d:3.6,k:[{t:0,b:{}},{t:.18,b:{spine:[28,0,0],upperarm_l:[-85,0,-10],upperarm_r:[-85,0,10],thigh_l:[-35,0,0],shin_l:[45,0,0]}},{t:.75,b:{spine:[38,0,0],upperarm_l:[-100,0,-10],upperarm_r:[-100,0,10],thigh_l:[-45,0,0],shin_l:[55,0,0]}},{t:1,b:{}}]};Anim303.play('empurrar401')}
    const people=[-1,1].map(side=>{const f=figure({civ:true,name:'Sobrevivente'},cx-1.8+side*.5,cz);f.m.root.rotation.z=Math.PI/2;w.figs.push(f);return f});
    creak();const dustGroup=new THREE.Group();scene.add(dustGroup);const motes=[];let elapsed=0,last=performance.now(),dust=-1;
    function animate(now){
      if(W.get(m.id)!==w||player.dead){scene.remove(dustGroup);paused=modalOpen;return}
      const dt=Math.min(.05,(now-last)/1000);last=now;if(!document.hidden)elapsed+=dt;
      const oldDt=ADT;ADT=dt;animChibi(player.m,{move:0,atk:0,dead:0,wind:0,wep:'fist'},elapsed);window.Anim303?.post(player);ADT=oldDt;
      const u=Math.min(1,elapsed/3.6),rise=Math.max(0,Math.min(1,(u-.15)/.62));
      const model=cart.userData.wagon.g;model.rotation.z=1.12*(1-rise)+Math.sin(u*45)*.045*Math.sin(Math.PI*u);model.position.y=0;model.updateMatrixWorld(true);model.position.y+=gy(cx,cz)-new THREE.Box3().setFromObject(model).min.y;
      if(Math.floor(elapsed*5)!==dust){dust=Math.floor(elapsed*5);for(let j=0;j<3;j++){const d=new THREE.Mesh(new THREE.SphereGeometry(.13,5,4),new THREE.MeshBasicMaterial({color:0xb7a083,transparent:true,opacity:.45,depthWrite:false}));d.position.set(cx+(Math.random()-.5)*3,gy(cx,cz)+.2,cz+(Math.random()-.5)*2);d.userData={age:0,vx:(Math.random()-.5)*1.5,vz:(Math.random()-.5)*1.5};dustGroup.add(d);motes.push(d)}}
      for(const d of motes){d.userData.age+=dt;d.position.x+=d.userData.vx*dt;d.position.z+=d.userData.vz*dt;d.position.y+=dt*.45;d.scale.setScalar(1+d.userData.age*2);d.material.opacity=Math.max(0,.45-d.userData.age*.3)}
      people.forEach((f,j)=>{const k=Math.max(0,(u-.6)/.4);f.m.root.rotation.z=(1-k)*Math.PI/2;f.m.root.position.x=cx+(j?1:-1)*(.5+k*3);f.m.root.position.z=cz+k*2;});
      if(u<1){requestAnimationFrame(animate);return}
      scene.remove(dustGroup);for(const d of motes){d.geometry.dispose();d.material.dispose()}w.rescuing=false;s.cartRescued401=true;paused=false;useMarker(m,i);
    }requestAnimationFrame(animate);
  }
  /* despertar no chão: anéis que se expandem + luz que sobe */
  function awakenFx(x, z) {
    try {
      const col = 0xffc457, ring = new THREE.Mesh(new THREE.CircleGeometry(1.9, 48), ringMat(col)); ring.rotation.x = -Math.PI / 2; ring.position.set(x, gy(x, z) + .08, z); ring.renderOrder = 6;
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(.5, 1.2, 14, 20, 1, true), beamMat(col)); beam.position.set(x, gy(x, z) + 7, z); beam.renderOrder = 6;
      scene.add(ring); scene.add(beam);
      const t0 = performance.now(), iv = setInterval(() => {
        const k = (performance.now() - t0) / 2600; if (k >= 1) { clearInterval(iv); scene.remove(ring); scene.remove(beam); return; }
        ring.material.uniforms.t.value = beam.material.uniforms.t.value = k * 6; ring.scale.setScalar(.4 + k * 2.2); beam.scale.set(1 - k * .6, 1, 1 - k * .6);
      }, 50);
      for (let i = 0; i < 3; i++) setTimeout(() => { try { fxRing(x, z, col, 2 + i * 1.6, .8); } catch (_) {} }, i * 450);
      sfx('arise'); bigText('DESPERTAR', 1800);
    } catch (_) {}
  }
  /* Transição cinematográfica de despertar: tela preta com fade-in suave */
  function introFade() {
    try {
      let el = document.getElementById('pds_intro_fade');
      if (!el) {
        el = document.createElement('div');
        el.id = 'pds_intro_fade';
        el.style.cssText = 'position:fixed;inset:0;background:#000;z-index:99999;pointer-events:none;opacity:1;transition:opacity 2.6s cubic-bezier(0.4,0,0.2,1);';
        document.body.appendChild(el);
      } else {
        el.style.transition = 'none';
        el.style.opacity = '1';
      }
      setTimeout(() => {
        el.style.transition = 'opacity 2.6s cubic-bezier(0.4,0,0.2,1)';
        el.style.opacity = '0';
        setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 2800);
      }, 400);
    } catch (_) {}
  }
  /* Personagem novo: tela preta com fade-in, nasce na estrada perto da carroça tombada e Edran. */
  function spawnAwakening() {
    try {
      introFade();
      const m = ACTS[0], c = nearestCity(player.x, player.z).c, wall = wallOf(c); let P = null;
      // Aster's south gate: the road and wall share the initial camera axis.
      P = [c.x, c.z + wall + 20];
      begin(m); const s = state(m.id); s.pos = P.slice(); s.helped401 = false; s.extra = []; s.extraStep = 0; save();
      const px = P[0] + 1.8, pz = P[1] + 3;
      player.x = px; player.z = pz; cam.x = px; cam.z = pz; player.m.root.position.set(px, gy(px, pz), pz); try { updChunks(true); } catch (_) {}
      player.face = Math.PI; pcCam.yaw = 0; pcCam.pitch = .06; run.pos = { x: px, z: pz }; s.roadSpawn401={x:px,z:pz};save();
      try { buildWorldFor(m); } catch (_) {}
      setTimeout(() => {
        try {
          toast('<b>[NARRADOR]</b> A muralha… Vá para a muralha.', 7000);
          // toast already writes this line to history; do not record it again.
        } catch (_) {}
      }, 1200);
      return true;
    } catch (e) { console.warn('spawnAwakening', e); return false; }
  }
  function foesLeft(m) { const w = W.get(m.id); return w ? w.foes.filter(e => !e.dead && enemies.includes(e)).length : 0; }
  function useMarker(m, i) {
    const s = state(m.id), sp = m.steps[s.s]; if (!sp || sp.t !== 'go') return;
    if(m.id==='a1'&&s.s===0&&!s.helped401&&!s.fightDone&&!s.killed&&window.Intro401){Intro401.dialog('Edran',['A carroça… Ela veio da Fenda. Cuidado, está logo ali!'],()=>{s.helped401=true;save();tick()});return}
    if (!s.fightDone) { toast('<b>[HISTÓRIA]</b> Derrote a criatura primeiro (' + Math.max(1, (sp.fight.n + (sp.fight.el || 0)) * (sp.pts || 1) - s.killed) + ' restante).', 3500); return; }
    if (s.hit.includes(i)) return;
    if(m.id==='a1'&&s.s===0&&!s.cartRescued401){
      const w=W.get(m.id);if(!w)return;
      if(!s.edranHelp401){s.edranHelp401=true;const it=w.inters[0];it.x=w.cart.position.x;it.z=w.cart.position.z+2.3;it.label='F · EMPURRAR A CARROÇA';save();if(window.Intro401)Intro401.dialog('Edran',['Você conseguiu… A Mão levou a criatura. O cristal que ela deixou guarda os recursos por dez segundos; recolha também o ouro antes que suma.', 'Agora ajude-me a levantar a carroça. Há gente presa debaixo dela.'],()=>{});else toast('<b>Edran:</b> — Ajude-me a levantar a carroça.',6000);return}
      rescueCart(m,i);return;
    }
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
      try {
        const e = spawnKind(k, x, z, gr, { wild: true });
        e.aggro = true;
        if (m.id === 'a1' && s.s === 0) { e.isIntroTutorial = true; e.hp = e.maxhp = 30; e.dmg = 3; }
        else if (i < elites) makeElite(e);
        e.camp327 = m.id;
        w.foes.push(e);
        fxRing(x, z, 0xff8a4a, 1.5);
      } catch (_) {}
    }
    toast('<b>[HISTÓRIA]</b> Inimigos à vista!', 2500);
  }

  /* ---------- laço ---------- */
  let T = 0;
  function tick() {
    if (typeof started === 'undefined' || !started || typeof player === 'undefined' || !player || !profile || profile.creationPending91 || !run) return;
    if(player.dead||paused)return;
    T += .3;
    const S = st();
    { const next = ACTS.find(m => !S.m[m.id]?.done); if (next && !S.m[next.id] && actOpen(next.act)) begin(next); }
    for (const m of SIDE) if (m.npc === 'Torvo' && !S.m[m.id] && sideOpen(m)) begin(m);
    const world = L.mode === 'world';
    for (const m of active()) {
      const s = state(m.id), sp = m.steps[s.s]; if (!sp) continue;
      if (sp.t === 'tower' && (profile.towerBest || 0) >= s.base) { advance(m); continue; }
      if (sp.t === 'caps' && capsVisited() >= sp.n) { advance(m); continue; }
      if (sp.t === 'barter') { if (!profile.classless) advance(m, sp.done); continue; }
      if (sp.t === 'city' && world) { const c = nearestCity(player.x, player.z); if (c.d < entryRadius(c.c) - 3) { s.city = c.c.name; if(m.id==='a1'){s.cityCheckpoint401=true;save()} advance(m, sp.done); continue; } }
      if (sp.t !== 'go') { clearWorld(m.id); continue; }
      let w = W.get(m.id);
      if (w && (w.L !== L || w.step !== s.s || w.grps.some(g => !g.parent && !g.userData.taken))) { // mundo foi refeito: recria
        for (const e of w.foes) if (e.dead && !e.counted327) { e.counted327 = true; s.killed++; }
        w.foes = []; clearWorld(m.id); w = null;
      }
      if (!world) continue;
      if (!w) { buildWorldFor(m); w = W.get(m.id); }
      for (const g of w.grps) for (const mat of g.userData.mats) mat.uniforms.t.value = T;
      for (const f of w.figs) if (f && f.m) try { f.t += .3; if(!f.down)animChibi(f.m, { move: 0, atk: 0, dead: 0, wind: 0 }, f.t); if(!f.down)f.m.root.rotation.y = Math.atan2(player.x - f.x, player.z - f.z); } catch (_) {}
      if (!s.fightDone) {
        for (const e of w.foes) if (e.dead && !e.counted327) { e.counted327 = true; s.killed++; save(); }
        const total = (sp.fight.n + (sp.fight.el || 0)) * (sp.pts || 1);
        if (s.killed >= total && !(m.id === 'a1' && window.Intro401?.reclaiming())) { s.fightDone = true; save(); toast('<b>[HISTÓRIA]</b> Área segura. ' + (sp.verb ? 'Aproxime-se e use F: ' + sp.verb.toLowerCase() + '.' : ''), 4000); }
        else if ((m.id !== 'a1' || s.s !== 0 || s.helped401) && !foesLeft(m) && pointsOf(m).some(p => Math.hypot(player.x - p[0], player.z - p[1]) < 22)) { w.foes = w.foes.filter(e => !e.dead && enemies.includes(e)); spawnFight(m); }
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
    const npc401 = SHOP_NPC[id];
    const main401 = active().find(m => !isSide(m) && m.steps[state(m.id).s]?.t === 'talk' && m.steps[state(m.id).s].npc === npc401);
    if (main401 && window.Intro401) {
      const s = state(main401.id), sp = main401.steps[s.s];
      Intro401.dialog(npc401, sp.say.map(x => fill(x,s)), () => {if(main401.id==='a1'&&s.s===2&&profile.orderPending401){profile.creationPending91=true;creationView()}else advance(main401,npc401+': '+sp.say.at(-1));});
      return;
    }
    if (id === 'wep' && window.Intro401 && state('a1')?.s === 3 && !state('a1').done && !state('a1').kaelIntro401 && profile.classless) {
      Intro401.dialog('Kael', ['Lyra registrou sua chegada. Escolha sua primeira arma de treino por escambo. Ela despertará o seu caminho.', 'Depois disso, o mundo é seu: explore as regiões, masmorras e sistemas no seu ritmo. A história pode esperar.'], () => { state('a1').kaelIntro401 = true; save(); shopOrig.call(this,id); });
      return;
    }
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
      where = ' Marcador ' + (isSide(m) ? 'azul' : 'dourada') + ' a ' + d + ' m, ' + dir + '.';
      if (sp.fight&&!s.fightDone) where += ' Inimigos: ' + Math.max(0, (sp.fight.n + (sp.fight.el || 0)) * (sp.pts || 1) - s.killed) + '.';
    }
    if (sp.t === 'talk' && sp.npc !== 'Torvo') where = ' Fale com ' + sp.npc + ' numa cidade.';
    if (sp.t === 'barter') where = ' Abra a loja de equipamentos do Kael, em ' + cityName(s) + ', e escolha uma arma de treino.';
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

  function rescueCamera(dt){const w=W.get('a1');if(!w?.rescuing||!w.cart)return;const p=w.cart.position;camera.position.lerp(new THREE.Vector3(p.x+6,p.y+3.6,p.z+7),1-Math.exp(-dt*6));camera.lookAt(p.x,p.y+1.1,p.z);}
  function registered(){const s=state('a1');if(s&&!s.done&&s.s===2)advance(ACTS[0],'Lyra: — Seu nome está registrado. Procure Kael para o escambo da primeira arma.');saveRun()}
  function roadCheckpoint(){const s=state('a1');return !!(s&&!s.done&&s.s<2&&!s.cityCheckpoint401)}
  function respawnRoad(){
    const road=roadCheckpoint(),s=state('a1');
    if(!road&&!(profile.classless&&s&&!s.done&&s.s>=2))return false;
    const c=nearestCity(player.x,player.z).c;
    const p=road?(s.roadSpawn401||(s.s===0?s.pos:s.saved?.[0])):{x:c.x,z:c.z+14};if(!p)return false;
    const x=p.x??p[0],z=p.z??p[1]+4.5;
    player.dead=true;paused=true;introFade();toast(road?'<b>[NARRADOR]</b> — Ainda não. Levante-se, Viajante.':'<b>[NARRADOR]</b> Você acordou em '+c.name+'.',4500);
    setTimeout(()=>{
      if(L.mode!=='world'){if(L.special)leaveDungeon(false);else leaveDungeon(true)}
      player.x=x;player.z=z;cam.x=x;cam.z=z;player.hp=player.maxhp;player.mp=player.maxmp;player.shield=player.maxsh;player.iT=4;
      for(const k of ['bleedT','bleedD','slowT','stun','sleep348','healShield','healShieldUntil','venomCharges','venomUntil'])player[k]=0;
      player.jy=0;player.jvy=0;player.air344=false;if(window.FALL393)FALL393.top=null;player.dead=false;player.m.root.position.set(x,gy(x,z),z);run.pos={x,z};updChunks(true);paused=modalOpen||!!window.Intro401?.conversation;saveRun();
    },450);return true;
  }
  function target(){
    if(!player||L.mode!=='world')return null;
    const m=active().find(m=>'camp327:'+m.id===run.trackObj)||active().find(m=>!isSide(m));if(!m)return null;
    const s=state(m.id),sp=m.steps[s.s];
    if(sp.t==='go'){
      const w=W.get(m.id);if(m.id==='a1'&&s.s===0&&s.edranHelp401&&w?.cart)return {x:w.cart.position.x,z:w.cart.position.z};
      const it=w?.inters.find(it=>!s.hit.includes(it.idx));if(it)return {x:it.x,z:it.z};
      if(s.pos)return {x:s.pos[0],z:s.pos[1]};
    }
    if(sp.t==='city')return GATES341.filter(g=>g.c.name===cityName(s)).sort((a,b)=>Math.hypot(a.x-player.x,a.z-player.z)-Math.hypot(b.x-player.x,b.z-player.z))[0]||null;
    const shop=sp.t==='barter'?'wep':Object.keys(SHOP_NPC).find(k=>SHOP_NPC[k]===sp.npc);
    return shop?npcs.find(n=>n.shop===shop&&n.home?.name===cityName(s)):null;
  }
  function map(ctx,S,full){const p=target();if(!p)return;const k=full?S/560:2.2,dx=(p.x-player.x)*k,dz=(p.z-player.z)*k,lim=S/2-12,scale=Math.min(1,lim/Math.max(Math.abs(dx),Math.abs(dz),1));
    ctx.save();ctx.translate(S/2+dx*scale,S/2+dz*scale);ctx.fillStyle='#ffda68';ctx.strokeStyle='#3b2505';ctx.lineWidth=2;ctx.shadowColor='#ffd05b';ctx.shadowBlur=7;ctx.beginPath();
    if(scale<1){ctx.rotate(Math.atan2(dz,dx));ctx.moveTo(7,0);ctx.lineTo(-5,-5);ctx.lineTo(-3,0);ctx.lineTo(-5,5);ctx.closePath()}else ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
  }
  window.Campaign327 = { rescueCamera, registered, roadCheckpoint, respawnRoad, target, map, ACTS, SIDE, state, active, begin, advance, tick, W, spawnAwakening };
})();
