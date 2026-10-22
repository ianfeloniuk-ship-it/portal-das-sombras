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
      { t: 'go', d: 'Ajude Edran, o guarda caído ao lado da carroça tombada, na estrada perto de {cidade}.', verb: 'AJUDAR EDRAN', cart: true, fig: { look: GUARD, name: 'Edran', down: true }, fight: { n: 1, kinds: ['gosma_f'] }, /* v546: missão fixa #1 — Gosma Fendida */
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
      { t: 'go', d: 'Na rota para o oeste de {cidade}, enfrente os falsos saqueadores no desfiladeiro obstruído (solte o Carrinho com F para lutar livre) e desobstrua as pedras e troncos da passagem.', verb: 'DESOBSTRUIR PEDRAS E TRONCOS DO DESFILADEIRO', fight: { n: 6, el: 1, kinds: GOB },
        done: 'O desfiladeiro está desobstruído e livre, mantendo o relevo natural intacto. O estandarte dos saqueadores foi pintado por cima: não é o vermelho do Clã Ferrugem.' },
      { t: 'go', d: 'Avance ao vale da fundição velha e ajude Torvo a defender os refugiados cercados.', verb: 'FALAR COM TORVO NO VALE', fight: { n: 5, el: 1 }, fig: { torvo: true },
        done: 'Torvo: — Você caçou goblins a vida inteira e ainda veio lutar ao nosso lado. Os refugiados estão exaustos de Fome e Cansaço.' },
      { t: 'go', d: 'Cure a Fome e Cansaço dos refugiados no vale da fundição velha: monte/acenda uma Fogueira perto ou entregue Água Fervida / Comida Assada.', verb: 'AQUECER / ENTREGAR ÁGUA FERVIDA OU COMIDA ASSADA', same: 1, fig: { civ: true, name: 'Refugiado' },
        done: 'Refugiado: — Água fervida, comida quente e fogo… A fome e o cansaço passaram. Obrigado!' },
      { t: 'go', d: 'Colha o testemunho de Torvo no vale da fundição velha.', verb: 'COLHER TESTEMUNHO DE TORVO', same: 1, fig: { torvo: true },
        done: 'Torvo: — Atravessamos há cem anos. Nosso mundo foi esvaziado. Ele não destrói mundos: ele os recolhe.' },
      { t: 'talk', npc: 'Lyra', d: 'Registre o testemunho de Torvo com Lyra, na Ordem.', say: ['Um povo inteiro que atravessou há cem anos porque o mundo deles foi recolhido…', 'Vou registrar o testemunho de Torvo nos arquivos da Ordem, {nome}.'] }] },
    { id: 'a9', act: 9, title: 'IX — As Capitais', steps: [
      { t: 'talk', npc: 'Lyra', d: 'Compare com Lyra os registros das capitais.', say: ['Os ataques seguem as cinco capitais: Ymiria, Zahar, Thalor, Urdan e Verden. Cada uma guarda uma Âncora.', 'Vá ver com os próprios olhos onde a pressão é real.'] },
      { t: 'caps', n: 3, d: 'Visite 3 capitais e veja a pressão sobre as Âncoras.' },
      { t: 'ev', ev: 'elite', n: 6, d: 'Contenha as ameaças: derrote 6 elites.' },
      { t: 'talk', npc: 'Brann', d: 'Conte a Brann onde reforçar as defesas.', say: ['Reforçamos onde a pressão era real, não onde o medo mandava. Bom trabalho.'] }] },
    { id: 'a10', act: 10, title: 'X — Pedaços de Deus', steps: [
      { t: 'go', d: 'Derrube a manifestação do Logos perto de {cidade} e recolha o fragmento dourado.', verb: 'RECOLHER FRAGMENTO DO LOGOS', logos456: true, fight: { n: 1, el: 1, logos456: true },
        done: 'Aldric segura o fragmento dourado que caiu do Logos: — Isto é um dedo dele. Cada portal vermelho é o Arquiteto tentando enfiar a mão neste mundo.' },
      { t: 'talk', npc: 'Lyra', d: 'Leve a Lyra o fragmento do Logos.', say: ['Você derrubou um Logos. Os portais perigosos estão calmos, mas não por muito tempo.', 'Precisamos estabilizar os selos de Urdan e Verden. Organize a expedição com Dorian no Mercado.'] },
      { t: 'talk', npc: 'Dorian', d: 'Organize a expedição com Dorian, no Mercado.', say: ['Suprimentos para uma expedição às Fendas e às Âncoras de Urdan e Verden? Separo o melhor: Ração de Expedição e Invólucro de Resina. Só me traga histórias de volta.'] },
      { t: 'go', d: 'Estabilize o selo de Urdan (Tronco do Arquiteto) e vença ou aceite a rendição do Sapo Rei (#020) em Verden (Cabeça do Arquiteto).', verb: 'SINTONIZAR SELOS DE URDAN E VERDEN', pts: 2, urdanVerden456: true, fight: { n: 1, el: 1, saporei456: true },
        done: 'O Sapo Rei (#020) reconheceu sua força, rendeu-se com honra sem deixar carcaça para a Mão e os selos de Urdan e Verden foram estabilizados.' },
      { t: 'ev', ev: 'clear', n: 3, d: 'Aproveite a calma: feche 3 portais.' }] },
    { id: 'a11', act: 11, title: 'XI — A Mão do Arquiteto', steps: [
      { t: 'go', d: 'Feche o Portal Primordial perto de {cidade} e faça a Mão do Arquiteto recuar.', verb: 'FECHAR O PORTAL PRIMORDIAL', primordial456: true, fight: { n: 4, el: 2 },
        done: 'Ao fechar o Portal Primordial, uma imensa mão de pedra e luz recua para o outro lado da Fenda.' },
      { t: 'talk', npc: 'Lyra', d: 'Conte a Lyra sobre a mão do Portal Primordial.', say: ['Uma mão do outro lado… O Fim do Mundo não é um desastre: é um teste. Precisamos dos registros da abertura antiga.'] },
      { t: 'go', d: 'Recupere os registros da abertura antiga, guardados por criaturas da Fenda.', verb: 'RECUPERAR OS REGISTROS', book: true, fight: { n: 8, el: 2 },
        done: 'Os registros contam a mesma abertura duas vezes, com detalhes diferentes.' },
      { t: 'talk', npc: 'Lyra', d: 'Confronte as divergências com Lyra.', say: ['Dois relatos do mesmo dia que não concordam. Alguém mentiu, ou alguém não sabia de tudo.'] }] },
    { id: 'a12', act: 12, title: 'XII — O Narrador', steps: [
      { t: 'talk', npc: 'Lyra', d: 'Apresente a Lyra as provas da abertura antiga.', say: ['A voz que guia você estava lá na abertura? Então leia o que ela mesma conta.'] },
      { t: 'diary', d: 'Leia a confissão no Diário → História.' },
      { t: 'go', d: 'Compare a confissão com uma inscrição antiga perto de {cidade}.', verb: 'COMPARAR A INSCRIÇÃO', monolith456: true, fight: { n: 6, el: 1 },
        done: 'A inscrição e a confissão concordam numa coisa: o Primeiro Guardião era um selo.' },
      { t: 'talk', npc: 'Lyra', d: 'Decida a defesa com Lyra.', say: ['Então defendemos as Âncoras. Ouvindo a voz, mas conferindo tudo. O Arquiteto despertou na estrada — detenha-o!'] },
      { t: 'go', d: 'Enfrente o Arquiteto na estrada de {cidade} e feche a Porta Primordial.', verb: 'SELAR OS FRAGMENTOS DO ARQUITETO', architect456: true, fight: { n: 1, el: 1, architectBoss456: true },
        done: 'O Arquiteto se desfez em pó dourado no meio da estrada para Aster. Os cinco pedaços voltaram a dormir sob as Âncoras.' }] },
    { id: 'a13', act: 13, title: 'XIII — Quem Fechou a Porta', steps: [
      { t: 'talk', npc: 'Brann', d: 'Ajude Brann a começar a reconstrução.', say: ['A estrada ainda tem pó dourado. Vamos reconstruir.'] },
      { t: 'go', d: 'Erga o Marco da Reconstrução junto a Brann e aos sobreviventes na muralha de {cidade}.', verb: 'CONCLUIR A RECONSTRUÇÃO COM BRANN', rebuild456: true, zone: 'edge',
        done: 'Brann: — As muralhas estão de pé e as cinco Capitais respiram aliviadas.' },
      { t: 'talk', npc: 'Mira', d: 'Veja como estão os feridos com Mira.', say: ['Pela primeira vez em muito tempo: só feridos, nenhum desaparecido.'] },
      { t: 'talk', npc: 'Lyra', d: 'Registre o resultado com Lyra.', say: ['Vou escrever seu nome na parede. Ninguém tinha fechado a porta antes de você, {nome}.'] }] }
  ];
  const SIDE = [
    { id: 'lyra_names', npc: 'Lyra', after: 'a1', steps: [
      { t: 'go', d: 'Recupere 3 registros de viajantes perdidos perto de {cidade}.', verb: 'RECOLHER O REGISTRO', pts: 3, book: true, fight: { n: 2 },
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

  /* Quando cada ato abre (mesmas regras que já liberam as páginas do Diário ou conclusão do ato anterior). */
  const ACT_OPEN = {
    1: () => true,
    8: () => lore().includes('act8') || !!st().m.a7?.done,
    9: () => lore().includes('act9') || !!st().m.a8?.done,
    10: () => lore().includes('act10') || !!st().m.a9?.done,
    11: () => lore().includes('act11') || !!st().m.a10?.done,
    12: () => lore().includes('act12') || !!st().m.a11?.done,
    13: () => lore().includes('act13') || !!st().m.a12?.done
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
    if (m.act >= 8) try { if (!lore().includes('act' + m.act)) unlockLore('act' + m.act); } catch (_) {}
    enterStep(m); save();
    toast('<b>[' + (isSide(m) ? m.npc.toUpperCase() : 'HISTÓRIA') + ']</b> ' + esc(isSide(m) ? m.title : 'Ato ' + m.title) + ': ' + esc(fill(m.steps[0].d, S.m[m.id])), 7000);
  }
  function enterStep(m) {
    const s = state(m.id), sp = m.steps[s.s]; if (!sp) return;
    s.got = 0; s.killed = 0; s.fightDone = !sp.fight; s.hit = [];
    if (m.act >= 8) try { if (!lore().includes('act' + m.act)) unlockLore('act' + m.act); } catch (_) {}
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
    if (run.trackObj === 'camp327:' + m.id) { run.trackObj = null; if (!isSide(m)) st().follow436 = true; }
    if (!isSide(m)) { const nx = ACTS.find(o => !st().m[o.id]?.done); if (nx) { st().follow436 = st().follow436 !== false; save();
      setTimeout(() => { try { toast('<b>[HISTÓRIA]</b> Agora o mundo é seu: jogue no seu ritmo. Quando quiser continuar a história, o <b>Ato ' + esc(nx.title) + '</b> ' + (actOpen(nx.act) ? 'já está liberado no Diário › Atos.' : 'abre assim: ' + esc(nx.act <= 7 ? 'passe na prova para o rank ' + RANKS[nx.act].id + '.' : ACT_HINT[nx.act])), 11000); } catch (_) {} }, 2500); } }
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
  function makeBeacon(x, z, side, book) {
    const g = new THREE.Group();
    g.position.set(x,gy(x,z),z);g.userData.mats=[];g.userData.terrainAbsolute245=true;
    if (book) g.add(bookProp());
    return g;
  }
  /* v436 (Ian): o registro de viajante perdido é um livro de verdade no chão, com fecho que brilha, para dar para achar e pegar. */
  function bookProp() {
    const b = new THREE.Group(); b.name = 'Registro436'; b.rotation.y = Math.random() * TAU;
    const M = (c, e = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: .9, metalness: .05, emissive: e, emissiveIntensity: e ? .9 : 0 });
    const add = (w, h, d, y, mat, x = 0) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, 0); m.castShadow = true; b.add(m); return m; };
    const leather = M(0x4a2f22), paper = M(0xe0cf9f), clasp = M(0xc89b4f, 0xffb340);
    add(.78, .07, .58, .05, leather); add(.72, .08, .52, .12, paper); add(.79, .05, .59, .18, leather);
    add(.07, .02, .59, .215, clasp, .26); add(.3, .015, .04, .215, clasp, -.05);
    b.userData.book436 = clasp; b.scale.setScalar(1.25); return b;
  }

  function place(s, sp, i, mId) {
    if (i > 0 && s.pos) { // pontos extras ficam ao redor do primeiro
      for (let k = 0; k < 30; k++) { const a = rnd(0, TAU), d = rnd(7, 13), x = s.pos[0] + Math.cos(a) * d, z = s.pos[1] + Math.sin(a) * d; if (freeAt(x, z, 1.2)) return [x, z]; }
      return [s.pos[0] + 8 * i, s.pos[1]];
    }
    const c = nearestCity(player.x, player.z).c, wall = wallOf(c); s.city = c.name;
    if (mId === 'a1') return window.Fronteira551 ? [Fronteira551.cx(334),334] : [c.x,c.z+334];
    if (mId === 'a8') {
      if (s.s === 0) return [c.x - (wall + 28), c.z];
      if (s.s === 1) return [c.x - (wall + 58), c.z - 8];
    }
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
    // The people seen hiding during the ambush stay at those same coordinates.
    if(m.id==='a2'&&s.s===2&&s.survivors406?.length===2){s.pos=s.survivors406[0].slice();s.extra=[s.survivors406[1].slice()];s.extraStep=s.s;return [s.pos,...s.extra]}
    if (!s.pos) s.pos = place(s, sp, 0, m.id);
    s.extra = s.extra && s.extra.length === n - 1 && s.extraStep === s.s ? s.extra : Array.from({ length: n - 1 }, (_, i) => place(s, sp, i + 1, m.id));
    s.extraStep = s.s;
    return [s.pos, ...s.extra];
  }
  const edranCache = new Map();
  let sobrev456 = 0;
  function makeEdranActor(){
    const url = 'models/edran452.glb?v=454';
    const root = new THREE.Group(), body = new THREE.Group();
    root.add(body);
    const mats = [];
    const m = { root, body, model: null, mats, edran452: true, glb: true, sc: 1.0, bones: {} };
    if(!edranCache.has(url)){
      edranCache.set(url, new Promise(res => {
        const ld = new THREE.GLTFLoader();
        if(window.MeshoptDecoder) ld.setMeshoptDecoder(MeshoptDecoder);
        ld.load(url, g => res(g), undefined, () => res(null));
      }));
    }
    edranCache.get(url).then(g => {
      if(!g) return;
      const model = THREE.SkeletonUtils.clone(g.scene);
      model.traverse(o => {
        if(o.isMesh){
          o.castShadow = true;
          o.receiveShadow = true;
          o.frustumCulled = false;
          const list = Array.isArray(o.material) ? o.material : [o.material];
          for(const mat of list){
            mat.side = THREE.DoubleSide;
            mat.onBeforeCompile = s => {
              s.fragmentShader = s.fragmentShader.replace('#include <encodings_fragment>', '#include <encodings_fragment>\ngl_FragColor=LinearTosRGB(gl_FragColor);');
            };
            mat.customProgramCacheKey = () => 'edran452-linear';
          }
          if(o.material) mats.push(o.material);
        }
        if(o.isBone) m.bones[o.name] = o;
      });
      body.add(model);
      m.model = model;
      m.mixer = new THREE.AnimationMixer(model);
    });
    return m;
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
    if (f.name === 'Edran' && window.NPC456) {
      /* v456: Edran do Tripo com rig e animações (sentado ferido, andando, parado, empurrando) */
      const m = NPC456.create('edran');
      m.root.position.set(x + 1.8, gy(x + 1.8, z), z); m.root.userData.terrainAbsolute245 = true; scene.add(m.root);
      if (f.down) m.wounded401 = true;
      const fig = NPC456.figure('edran', { m, x: x + 1.8, z, name: f.name, down: !!f.down, t: Math.random() * 5 });
      return window.Solid429 ? Solid429.figure(fig) : fig;
    }
    if (f.name === 'Edran') {
      const m = makeEdranActor();
      m.root.position.set(x + 1.8, gy(x + 1.8, z), z);
      m.root.userData.terrainAbsolute245 = true;
      scene.add(m.root);
      if (f.down) { m.root.position.y = gy(x + 1.8, z); m.wounded401 = true; }
      const fig = { m, x: x + 1.8, z, name: f.name, down: !!f.down, t: Math.random() * 5 };
      return window.Solid429 ? Solid429.figure(fig) : fig;
    }
    if ((f.name === 'Sobrevivente' || f.name === 'Refugiado') && window.NPC456) {
      /* v456: sobreviventes do Tripo (homem e mulher se alternam), caídos de verdade e levantando com animação */
      const id = (sobrev456++ % 2) ? 'mulher' : 'homem';
      const m = NPC456.create(id);
      m.root.position.set(x + 1.8, gy(x + 1.8, z), z); m.root.userData.terrainAbsolute245 = true; scene.add(m.root);
      if (f.down) m.wounded401 = true;
      const fig = NPC456.figure(id, { m, x: x + 1.8, z, name: f.name, down: !!f.down, t: Math.random() * 5 });
      return window.Solid429 ? Solid429.figure(fig) : fig;
    }
    if (f.name === 'Sobrevivente' && window.Citizens133) {
      const cit = (Math.abs(Math.round(x * 10)) % 2 === 0) ? 'Dorian' : 'Selene';
      const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
      const m = { root, body, mats: [], citizen133: true, glb: true, sc: 0.92, name: cit };
      Citizens133.load(cit).then(() => {
        if (!root.parent) return;
        const created = Citizens133.create(cit);
        if (created && created.model) { body.add(created.model); if (created.mats) m.mats = created.mats; }
      });
      m.root.position.set(x + 1.8, gy(x + 1.8, z), z);
      m.root.userData.terrainAbsolute245 = true;
      if (f.down) { m.root.rotation.z = Math.PI / 2 * 0.85; m.wounded401 = true; }
      scene.add(m.root);
      const fig = { m, x: x + 1.8, z, name: f.name, down: !!f.down, t: Math.random() * 5 };
      return window.Solid429 ? Solid429.figure(fig) : fig;
    }
    const look = f.civ ? CIV() : f.look;
    const m = MODELS.list[look.gk] ? makeActor(look) : {root:new THREE.Group(),mats:[]};
    if (!m.model) MODELS.ready.then(() => {
      if (!m.root.parent || !MODELS.list[look.gk]) return;
      const old = m.root, ready = makeActor(look);
      ready.root.position.copy(old.position); ready.root.rotation.copy(old.rotation); ready.root.userData.terrainAbsolute245 = true;
      scene.remove(old); Object.assign(m,ready); scene.add(m.root);
    }); m.root.position.set(x + 1.8, gy(x + 1.8, z) + (f.down ? .3 : 0), z); m.root.userData.terrainAbsolute245 = true; /* v428: altura absoluta; sem isso o relevo do shader somava de novo e flutuavam em morro */ scene.add(m.root);
    if (f.down) { m.root.position.y = gy(x + 1.8, z); m.wounded401 = true; }
    const fig = { m, x: x + 1.8, z, name: f.name, down: !!f.down, t: Math.random() * 5 };
    return window.Solid429 ? Solid429.figure(fig) : fig; /* v429: figurante tem colisão */
  }
  function clearWorld(id) {
    const w = W.get(id); if (!w) return;
    w.disposed498 = true;
    window.Scenes406?.dispose(w);
    if(id==='a1'&&state(id)?.s===0&&state(id)?.cartRescued401&&window.Fronteira551){ Fronteira551.begin(w.figs); w.figs=[]; }
    for (const g of w.grps) {
      if (g === w.cart && state(id)?.cartRescued401 && w.L === L) {
        /* Convoy follows road towards Aster gate */
        const city = nearestCity(g.position.x, g.position.z).c;
        const tx = city ? city.x : g.position.x, tz = city ? city.z : g.position.z;
        const cartM = g.userData?.wagon?.g;
        if (cartM) { cartM.rotation.z = 0; }
        let ct = 0;
        walk457(g, tx, tz, 1.5, () => scene.remove(g)); /* v457: anda suave a cada quadro (antes pulava 1 m a cada 0,5 s) */
      } else scene.remove(g);
    }
    for (const f of w.figs) {
      if (!f) continue;
      if (f.m) {
        const root = f.m.root;
        if (state(id)?.cartRescued401 && w.L === L && L.mode === 'world') {
          const city = nearestCity(root.position.x, root.position.z).c;
          const tx = city ? city.x : root.position.x, tz = city ? city.z : root.position.z;
          f.down = false; root.rotation.z = 0;
          let ft = 0;
          walk457(root, tx, tz, 1.5, () => scene.remove(root), dt => { ft += dt; try { animChibi(f.m, { move: 1, atk: 0, dead: 0, wind: 0 }, ft * 6); } catch (_) {} });
        } else {
          setTimeout(() => scene.remove(root), !f.hidden406 && w.L === L && L.mode === 'world' ? 6000 : 0);
        }
      }
      if (f.friend) { f.friend.gone = true; try { scene.remove(f.friend.m.root); } catch (_) {} }
    }
    for (const it of w.inters) { const i = L.inter.indexOf(it); if (i >= 0) L.inter.splice(i, 1); }
    for (const e of w.foes) if (!e.dead) { e.dead = true; e.deadT = 0; try { scene.remove(e.m.root); } catch (_) {} const i = enemies.indexOf(e); if (i >= 0) enemies.splice(i, 1); }
    W.delete(id);
  }
  function buildWorldFor(m) {
    const s = state(m.id), sp = m.steps[s.s], pts = pointsOf(m), side = isSide(m);
    const w = { step: s.s, grps: [], figs: [], inters: [], foes: [], L };
    pts.forEach((p, i) => {
      if (s.hit.includes(i)) return;
      const g = makeBeacon(p[0] + (sp.fig?1.8:0), p[1], side, sp.book); scene.add(g); w.grps.push(g);
      const fig = figure(sp.fig, p[0], p[1]); w.figs.push(fig);
      const it = { type: 'camp327', x: fig ? fig.x : p[0], z: fig ? fig.z : p[1], r: 3, label: 'F · ' + sp.verb, camp327: m.id, idx: i, r: sp.book ? 3.6 : 3, use: () => useMarker(m, i) };
      L.inter.push(it); w.inters.push(it);
    });
    if (sp.cart && pts[0] && !s.hit.includes(0)) {
      const c = makeCart(pts[0][0] - 3.6, pts[0][1] - 2.8); scene.add(c); w.grps.push(c); w.cart=c;
      /* Refugiados civis abrigados junto à carroça desde o início */
      const s1 = figure({ civ: true, name: 'Sobrevivente', down: true }, pts[0][0] - 4.8, pts[0][1] - 2.8);
      const s2 = figure({ civ: true, name: 'Sobrevivente', down: true }, pts[0][0] - 2.6, pts[0][1] - 2.8);
      if (s1) w.figs.push(s1);
      if (s2) w.figs.push(s2);
      /* v457 (Ian): quem está preso fica EMBAIXO da carroceria tombada (lona e tábuas por cima do corpo, só a cabeça para fora);
         antes ficavam no chão livre ao lado e, ao levantar a carroça, ela cairia em cima deles */
      [[s1, -1.6, -1.15], [s2, -1.75, -0.3]].forEach(([f, lx, lz]) => pinUnderCart457(c, f, lx, lz));
    }
    if (m.id === 'a1' && pts[0]) {
      const p0 = pts[0], cx = p0[0], cz = p0[1];
      const sg = new THREE.Group(); sg.userData.mats = []; sg.userData.terrainAbsolute245 = true; sg.userData.roadFrame498 = true;
      const offsets = [
        [-10, -18, 'fir', 8.5], [9.5, -16, 'fir', 9.0],
        [-12, 6, 'fir', 7.5], [10.2, 8, 'fir', 8.0],
        [-8.5, -3, 'mossrock', 3.2], [9.0, -1, 'mossrock', 3.6],
        [-9.2, 20, 'mossrock', 2.8], [9.8, 22, 'fir', 8.2]
      ];
      const addFrame = () => {
        if (w.disposed498 || w.L !== L || !window.TripoEnvironment153?.models) return;
        offsets.forEach(([ox, oz, key, h]) => {
          const mDef = TripoEnvironment153.models[key];
          if (!mDef) return;
          const rx = cx + ox, rz = cz + oz, ry = gy(rx, rz);
          const grp = new THREE.Group();
          grp.position.set(rx, ry, rz);
          grp.rotation.y = Math.sin(ox * 2.3 + oz * 1.7) * Math.PI;
          const scale = h / (mDef.h || 4);
          grp.scale.setScalar(scale);
          mDef.parts.forEach(p => {
            const mesh = new THREE.Mesh(p.geometry, p.material);
            mesh.castShadow = true; mesh.receiveShadow = true;
            grp.add(mesh);
          });
          sg.add(grp);
          window.Solid429?.prop(grp, [{ x: 0, z: 0, r: key === 'fir' ? 1.0 : 1.6 }]);
        });
      };
      if (window.TripoEnvironment153?.ready) {
        TripoEnvironment153.ready.then(addFrame);
      } else {
        addFrame();
      }
      scene.add(sg); w.grps.push(sg);
    }
    if(m.id==='a1'&&s.s===0&&s.edranHelp401&&w.cart){w.inters[0].x=w.cart.position.x;w.inters[0].z=w.cart.position.z+2.3;w.inters[0].label='F · EMPURRAR A CARROÇA'}
    if (m.id === 'a8' && pts[0]) {
      const p0 = pts[0];
      if (s.s === 0 && !s.gorgeCleared441) {
        const bg = new THREE.Group(); bg.position.set(p0[0], gy(p0[0], p0[1]), p0[1]); bg.userData.mats = []; bg.userData.terrainAbsolute245 = true;
        const rockMat = new THREE.MeshStandardMaterial({ color: 0x5c5349, roughness: .92 }), woodMat = new THREE.MeshStandardMaterial({ color: 0x4b3624, roughness: .9 });
        for (const [ox, oz, r] of [[-2.4, -1.2, 1.35], [0, -1.6, 1.45], [2.4, -1.1, 1.3], [-1.3, 1.4, 1.1], [1.5, 1.3, 1.15]]) {
          const rk = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 1), rockMat); rk.position.set(ox, r * .55, oz); rk.castShadow = true; bg.add(rk);
        }
        for (const [ox, oz] of [[-3.2, .3], [3.1, .2]]) {
          const stp = new THREE.Mesh(new THREE.CylinderGeometry(.55, .72, 1.1, 8), woodMat); stp.position.set(ox, .55, oz); stp.castShadow = true; bg.add(stp);
        }
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(.06, .08, 3.2, 6), woodMat); pole.position.set(.6, 1.6, 0); bg.add(pole);
        const cloth = new THREE.Mesh(new THREE.BoxGeometry(.95, 1.1, .05), new THREE.MeshStandardMaterial({ color: 0x7c2d1e, roughness: .85 })); cloth.position.set(1.08, 2.35, 0); bg.add(cloth);
        window.Solid429?.prop(bg, [{ x: -2.4, z: -1.2, r: 1.3 }, { x: 0, z: -1.6, r: 1.4 }, { x: 2.4, z: -1.1, r: 1.25 }, { x: -1.3, z: 1.4, r: 1.05 }, { x: 1.5, z: 1.3, r: 1.1 }]);
        scene.add(bg); w.grps.push(bg); w.gorge441 = bg;
      }
      if (s.s === 1 || s.s === 2 || s.s === 3) {
        const fg = new THREE.Group(); fg.position.set(p0[0] - 4.2, gy(p0[0] - 4.2, p0[1] - 2.5), p0[1] - 2.5); fg.userData.mats = []; fg.userData.terrainAbsolute245 = true;
        const wallM = new THREE.MeshStandardMaterial({ color: 0x4a433d, roughness: .95 }), rustM = new THREE.MeshStandardMaterial({ color: 0x6e3b23, metalness: .45, roughness: .7 });
        const w1 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.2, .6), wallM); w1.position.set(0, 1.1, -1.8); fg.add(w1);
        const anvil = new THREE.Mesh(new THREE.BoxGeometry(1.1, .75, .65), rustM); anvil.position.set(1.2, .38, 0); fg.add(anvil);
        scene.add(fg); w.grps.push(fg);
        if (s.s === 1 || s.s === 2) {
          const r1 = figure({ civ: true, name: 'Refugiado', down: s.s === 2 && !s.refugeeHealed441 }, p0[0] - 3.2, p0[1] + 1.8);
          const r2 = figure({ civ: true, name: 'Refugiado', down: s.s === 2 && !s.refugeeHealed441 }, p0[0] - 1.4, p0[1] + 2.4);
          if (r1) w.figs.push(r1); if (r2) w.figs.push(r2);
        }
        if (s.s === 2) {
          const tf = figure({ torvo: true }, p0[0] + 2.5, p0[1] - 1.2);
          if (tf) w.figs.push(tf);
        }
      }
    }
    if (m.id === 'a10' && pts[0]) {
      if (sp.logos456) {
        const p0 = pts[0], lg = new THREE.Group(); lg.position.set(p0[0], gy(p0[0], p0[1]), p0[1]); lg.userData.mats = []; lg.userData.terrainAbsolute245 = true;
        const ring = new THREE.Mesh(new THREE.CircleGeometry(2.8, 48), ringMat(0xffd36b)); ring.rotation.x = -Math.PI / 2; ring.position.y = .08; lg.add(ring); lg.userData.mats.push(ring.material);
        if (typeof pieceMesh250 === 'function') { const pm = pieceMesh250(0); if (pm) { pm.scale.setScalar(.55); pm.position.y = 1.6; lg.add(pm); } }
        scene.add(lg); w.grps.push(lg); w.logos456 = lg;
      }
      if (sp.urdanVerden456) {
        pts.forEach((pt, idx) => {
          if (s.hit.includes(idx)) return;
          const isVerden = idx === 1, col = isVerden ? 0x8fe35a : 0xc77dff, pIdx = isVerden ? 4 : 3;
          const sg = new THREE.Group(); sg.position.set(pt[0], gy(pt[0], pt[1]), pt[1]); sg.userData.mats = []; sg.userData.terrainAbsolute245 = true;
          const ring = new THREE.Mesh(new THREE.CircleGeometry(3.2, 48), ringMat(col)); ring.rotation.x = -Math.PI / 2; ring.position.y = .08; sg.add(ring); sg.userData.mats.push(ring.material);
          if (typeof pieceMesh250 === 'function') { const pm = pieceMesh250(pIdx); if (pm) { pm.scale.setScalar(.62); pm.position.y = 2.0; sg.add(pm); } }
          scene.add(sg); w.grps.push(sg);
          const it = w.inters.find(x => x.idx === idx);
          if (it) it.label = isVerden ? 'F · SINTONIZAR SELO DE VERDEN (CABEÇA DO ARQUITETO)' : 'F · SINTONIZAR SELO DE URDAN (TRONCO DO ARQUITETO)';
        });
      }
    }
    if (m.id === 'a11' && sp.primordial456 && pts[0]) {
      const p0 = pts[0], pg = new THREE.Group(); pg.position.set(p0[0], gy(p0[0], p0[1]), p0[1]); pg.userData.mats = []; pg.userData.terrainAbsolute245 = true;
      if (window.Rift131) { const rift = Rift131.create({ seed: 456, legacyLinearOutput: true }); rift.scale.setScalar(1.35); pg.add(rift); w.primordialRift456 = rift; }
      if (typeof pieceMesh250 === 'function') { const hand = pieceMesh250(0); if (hand) { hand.scale.setScalar(1.25); hand.position.set(0, 2.4, .6); pg.add(hand); w.primordialHand456 = hand; } }
      scene.add(pg); w.grps.push(pg); w.primordial456 = pg;
    }
    if (m.id === 'a12' && sp.architect456 && pts[0]) {
      const p0 = pts[0], ag = new THREE.Group(); ag.position.set(p0[0], gy(p0[0], p0[1]), p0[1]); ag.userData.mats = []; ag.userData.terrainAbsolute245 = true;
      const ring = new THREE.Mesh(new THREE.CircleGeometry(4.2, 64), ringMat(0xffd070)); ring.rotation.x = -Math.PI / 2; ring.position.y = .08; ag.add(ring); ag.userData.mats.push(ring.material);
      scene.add(ag); w.grps.push(ag); w.archSeal456 = ag;
    }
    if (m.id === 'a13' && sp.rebuild456 && pts[0]) {
      const p0 = pts[0], rg = new THREE.Group(); rg.position.set(p0[0], gy(p0[0], p0[1]), p0[1]); rg.userData.mats = []; rg.userData.terrainAbsolute245 = true;
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xe6c365, emissive: 0x8a6418, emissiveIntensity: .45, roughness: .4, metalness: .6 });
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(.42, .58, 3.2, 8), goldMat); pillar.position.y = 1.6; rg.add(pillar);
      scene.add(rg); w.grps.push(rg); w.rebuild456 = rg;
      const c1 = figure({ civ: true, name: 'Morador' }, p0[0] - 2.4, p0[1] + 1.6);
      if (c1) w.figs.push(c1);
    }
    window.Scenes406?.build(m,s,w,pts,figure);
    W.set(m.id, w); save();
  }
  /* Modelo real da carroça, sem boi e condutor durante o resgate. */
  /* coloca a figura deitada no espaço local da carroça (x local negativo = debaixo da lona), cabeça saindo para +x */
  /* v457 (Ian: "um passo, para, um passo, para"): leva um objeto até (tx,tz) a velocidade constante, quadro a quadro,
     girando suave para a direção; para a 6 m do alvo ou depois de 40 s */
  function walk457(obj, tx, tz, speed, done, each) {
    let last = performance.now(), t = 0;
    (function step(now) {
      const dt = Math.min(.1, Math.max(0, (now - last) / 1000)); last = now; t += dt;
      const dx = tx - obj.position.x, dz = tz - obj.position.z, d = Math.hypot(dx, dz);
      if (d < 6 || t > 40 || !obj.parent) { done && done(); return; }
      if (!paused) {
        const k = Math.min(d, speed * dt);
        obj.position.x += dx / d * k; obj.position.z += dz / d * k; obj.position.y = gy(obj.position.x, obj.position.z);
        const want = Math.atan2(dx, dz), cur = obj.rotation.y; obj.rotation.y = cur + Math.atan2(Math.sin(want - cur), Math.cos(want - cur)) * Math.min(1, dt * 5);
        each && each(dt);
      }
      requestAnimationFrame(step);
    })(last);
  }
  function pinUnderCart457(c, f, lx, lz) {
    if (!f || !f.m || !f.m.npc456) return;
    const a = c.rotation.y, x = c.position.x + lx * Math.cos(a) + lz * Math.sin(a), z = c.position.z - lx * Math.sin(a) + lz * Math.cos(a);
    f.x = x; f.z = z; f.m.root.position.set(x, gy(x, z), z);
    f.m.root.rotation.y = a + (window.NPC456?.DEFS[f.m.npc456]?.lieYaw || 0);
    f.pinned457 = true;
  }
  function makeCart(x,z){
    const g=new THREE.Group();g.position.set(x,gy(x,z),z);g.rotation.y=.5;g.userData.mats=[];g.userData.terrainAbsolute245=true;
    g.userData.loading=true;window.Solid429?.prop(g,[{x:0,z:-1.5,r:1.25},{x:0,z:0,r:1.3},{x:0,z:1.5,r:1.25}]);/* v429: carroça tombada tem colisão */
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
    const people = w.figs.filter(f => f?.name === 'Sobrevivente');
    if (!people.length) {
      [-1,1].forEach(side => { const f = figure({ civ: true, name: 'Sobrevivente', down: true }, cx - 1.8 + side * .5, cz); w.figs.push(f); people.push(f); });
    }
    creak();const dustGroup=new THREE.Group();dustGroup.userData.terrainAbsolute245=true;scene.add(dustGroup);const motes=[];let elapsed=0,last=performance.now(),dust=-1;
    function animate(now){
      if(W.get(m.id)!==w||player.dead){scene.remove(dustGroup);paused=modalOpen;return}
      const dt=Math.min(.05,(now-last)/1000);last=now;if(!document.hidden)elapsed+=dt;
      const oldDt=ADT;ADT=dt;animChibi(player.m,{move:0,atk:0,dead:0,wind:0,wep:'fist'},elapsed);window.Anim303?.post(player);ADT=oldDt;
      const u=Math.min(1,elapsed/3.6),rise=Math.max(0,Math.min(1,(u-.15)/.62));
      const model=cart.userData.wagon.g;model.rotation.z=1.12*(1-rise)+Math.sin(u*45)*.045*Math.sin(Math.PI*u);model.position.y=0;model.updateMatrixWorld(true);model.position.y+=gy(cx,cz)-new THREE.Box3().setFromObject(model).min.y;
      if(Math.floor(elapsed*5)!==dust){dust=Math.floor(elapsed*5);for(let j=0;j<3;j++){const d=new THREE.Mesh(new THREE.SphereGeometry(.13,5,4),new THREE.MeshBasicMaterial({color:0xb7a083,transparent:true,opacity:.45,depthWrite:false}));d.position.set(cx+(Math.random()-.5)*3,gy(cx,cz)+.2,cz+(Math.random()-.5)*2);d.userData={age:0,vx:(Math.random()-.5)*1.5,vz:(Math.random()-.5)*1.5};dustGroup.add(d);motes.push(d)}}
      for(const d of motes){d.userData.age+=dt;d.position.x+=d.userData.vx*dt;d.position.z+=d.userData.vz*dt;d.position.y+=dt*.45;d.scale.setScalar(1+d.userData.age*2);d.material.opacity=Math.max(0,.45-d.userData.age*.3)}
      people.forEach((f,j)=>{
        const k=Math.max(0,(u-.6)/.4);
        if(f.pinned457){ /* v457: só saem depois que a carroça subiu de cima deles */
          if(u>=.8&&f.down){f.down=false;f.m.root.rotation.y=Math.atan2(player.x-f.m.root.position.x,player.z-f.m.root.position.z)}
          if(!f.down){const a=cart.rotation.y,tx=cx+(j?1.3:-1.3)*Math.cos(a)+2.2*Math.sin(a),tz=cz-(j?1.3:-1.3)*Math.sin(a)+2.2*Math.cos(a);const p=f.m.root.position;p.x+=(tx-p.x)*Math.min(1,dt*2.5);p.z+=(tz-p.z)*Math.min(1,dt*2.5);f.x=p.x;f.z=p.z}
          return;
        }
        if(!f.m.npc456)f.m.root.rotation.z=(1-k)*Math.PI/2;
        f.m.root.position.x=cx+(j?1.2:-1.2)*(1+k*1.2);
        f.m.root.position.z=cz+k*1.5;
        f.m.root.position.y=gy(f.m.root.position.x, f.m.root.position.z);
        if(k>=1){f.down=false;f.m.root.rotation.z=0;}
      });
      if(u<1){requestAnimationFrame(animate);return}
      scene.remove(dustGroup);for(const d of motes){d.geometry.dispose();d.material.dispose()}w.rescuing=false;s.cartRescued401=true;if(s.choice545==='civis'&&w.inters[0])w.inters[0].label='F · FALAR COM EDRAN';paused=false;useMarker(m,i);
    }requestAnimationFrame(animate);
  }
  /* despertar no chão: anéis que se expandem + luz que sobe */
  function awakenFx(x, z) {
    try {
      const col = 0xffc457, ring = new THREE.Mesh(new THREE.CircleGeometry(1.9, 48), ringMat(col)); ring.rotation.x = -Math.PI / 2; ring.position.set(x, gy(x, z) + .08, z); ring.renderOrder = 6;
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(.5, 1.2, 14, 20, 1, true), beamMat(col)); beam.position.set(x, gy(x, z) + 7, z); beam.renderOrder = 6;
      ring.userData.terrainAbsolute245 = beam.userData.terrainAbsolute245 = true; scene.add(ring); scene.add(beam);
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
  /* Personagem novo: cena curta de sonho com a Mão do Arquiteto -> despertar estilo Skyrim na estrada perto da carroça tombada e Edran. */
  function spawnAwakening() {
    try {
      const m = ACTS[0], c = nearestCity(player.x, player.z).c, wall = wallOf(c); let P = null;
      // Aster's south gate: the road and wall share the initial camera axis.
      P = window.Fronteira551 ? [Fronteira551.cx(334),334] : [c.x,c.z+334];
      begin(m); const s = state(m.id); s.pos = P.slice(); s.helped401 = false; s.extra = []; s.extraStep = 0; save();
      const px = P[0] + 1.8, pz = P[1] + 3;
      player.x = px; player.z = pz; cam.x = px; cam.z = pz; player.m.root.position.set(px, gy(px, pz), pz); try { updChunks(true); } catch (_) {}
      player.face = 0; pcCam.yaw = 0; pcCam.pitch = .06; run.pos = { x: px, z: pz }; s.roadSpawn401={x:px,z:pz};save();
      try { buildWorldFor(m); } catch (_) {}
      if (window.Dream488 && !s.dreamSeen) {
        s.dreamSeen = true; save();
        window.Dream488.play({
          onAwaken: () => {
            setTimeout(() => {
              try { toast('<b>[NARRADOR]</b> A muralha… Vá para a muralha.', 7000); } catch (_) {}
            }, 800);
          }
        });
        return true;
      }
      introFade();
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
  function useMarker(m, i, read406 = false) {
    const s = state(m.id), sp = m.steps[s.s]; if (!sp || sp.t !== 'go') return;
    if(m.id==='a1'&&s.s===0&&!s.helped401&&!s.fightDone&&!s.killed&&window.Intro401){Intro401.dialog('Edran',['A carroça… Ela veio da Fenda. Tem dois presos debaixo da madeira!','E a gosma está saindo do mato. Empurre a carroça agora e tire os dois de lá, ou derrube a criatura primeiro. Você escolhe.'],()=>{s.helped401=true;const w=W.get(m.id),it=w&&w.inters[0];if(it&&w.cart){it.x=w.cart.position.x;it.z=w.cart.position.z+2.3;it.label='F · EMPURRAR A CARROÇA'}save();tick()});return}
    /* v546 (missão fixa #1): empurrar a carroça antes da luta salva os dois primeiro */
    if(m.id==='a1'&&s.s===0&&s.helped401&&!s.fightDone&&!s.cartRescued401){s.choice545='civis';save();rescueCart(m,i);return}
    if (!s.fightDone) { toast('<b>[HISTÓRIA]</b> Derrote a criatura primeiro (' + Math.max(1, (sp.fight.n + (sp.fight.el || 0)) * (sp.pts || 1) - s.killed) + ' restante).', 3500); return; }
    if (s.hit.includes(i)) return;
    if (m.id === 'a8' && s.s === 0 && !s.gorgeCleared441) {
      const w = W.get(m.id), p0 = pointsOf(m)[0] || [player.x, player.z];
      if (window.Surv437?.give) {
        Surv437.give('galho', 3, 'Galhos recolhidos do desfiladeiro');
        Surv437.give('pedra', 3, 'Pedras recolhidas do desfiladeiro');
      }
      s.gorgeCleared441 = true;
      if (w?.gorge441) { scene.remove(w.gorge441); w.gorge441 = null; }
      try { addFloat(p0[0], gy(p0[0], p0[1]) + 2.2, p0[1], 'DESFILADEIRO DESOBSTRUÍDO!', '#7ef5a5'); } catch (_) {}
    }
    if (m.id === 'a8' && s.s === 2 && !s.refugeeHealed441) {
      const p0 = pointsOf(m)[0] || [player.x, player.z];
      const hasFire = !!(window.Surv437?.nearFire?.(16) || (run?.builds437 || []).some(b => (b.id === 'fogueira' || b.id === 'cabana') && b.fuel > 0 && Math.hypot(b.x - p0[0], b.z - p0[1]) < 16));
      const ctn = run?.surv437?.canteen;
      const boilCanteen = ctn && (ctn.kind === 'limpa' || ctn.kind === 'cha') && (ctn.sips || 0) > 0 ? ctn : null;
      const roastFood = ['assada', 'defumada', 'cogu_assado', 'racao_expedicao'].find(k => window.Surv437?.count?.(k) > 0);
      if (!hasFire && !boilCanteen && !roastFood) {
        toast('<b>[HISTÓRIA]</b> Os refugiados estão com Fome e Cansaço! Monte/acenda uma <b>Fogueira</b> perto, ferva <b>Água no Cantil</b> ou traga <b>Carne Assada</b>.', 6500);
        return;
      }
      if (boilCanteen && !hasFire) { boilCanteen.sips = Math.max(0, (boilCanteen.sips || 1) - 1); if (!boilCanteen.sips) boilCanteen.kind = null; }
      else if (roastFood && !hasFire) { window.Surv437?.take?.(roastFood, 1); }
      s.refugeeHealed441 = true;
      const w = W.get(m.id);
      if (w) for (const f of w.figs) if (f && f.name === 'Refugiado' && f.m) { f.down = false; f.m.wounded401 = false; f.m.root.rotation.z = 0; }
      try { addFloat(p0[0], gy(p0[0], p0[1]) + 2.2, p0[1], 'FOME E CANSAÇO CURADOS!', '#7ef5a5'); } catch (_) {}
    }
    if (m.id === 'a10' && sp.logos456) {
      profile.godKills192 = (profile.godKills192 || 0) + 1;
      try { if (!lore().includes('act10')) unlockLore('act10'); bigText('MATADOR DE DEUSES', 2000); } catch (_) {}
    }
    if (m.id === 'a10' && sp.urdanVerden456) {
      profile.m423 = profile.m423 || { anchors: {}, marks: [], astral: false };
      profile.visited217 = profile.visited217 || {};
      if (i === 0) {
        profile.m423.anchors.Urdan = { t: Date.now(), stab: 100, sealed441: true, piece: 'Tronco do Arquiteto' };
        profile.visited217.c_urdan = { n: 'Urdan', cap: true, t: Date.now() };
      } else {
        profile.m423.anchors.Verden = { t: Date.now(), stab: 100, sealed441: true, piece: 'Cabeça do Arquiteto' };
        profile.visited217.c_verden = { n: 'Verden', cap: true, t: Date.now() };
      }
    }
    if (m.id === 'a11' && sp.primordial456) {
      const w = W.get(m.id);
      if (w?.primordialRift456 && window.Rift131) try { Rift131.close(w.primordialRift456, false); } catch (_) {}
      try { if (!lore().includes('act11')) unlockLore('act11'); bigText('PORTAL PRIMORDIAL FECHADO', 2000); } catch (_) {}
    }
    if (m.id === 'a12' && sp.architect456) {
      s.architectDefeated456 = true;
      profile.archKills223 = (profile.archKills223 || 0) + 1;
      try { if (typeof archWin223 === 'function') archWin223(); else { if (!lore().includes('act13')) unlockLore('act13'); bigText('A PORTA FOI FECHADA', 2600); } } catch (_) {}
    }
    if (m.id === 'a13' && sp.rebuild456) {
      s.rebuilt456 = true;
      profile.raided155 = {};
      profile.m423 = profile.m423 || { anchors: {}, marks: [], astral: false };
      for (const [cap, piece] of [['Ymiria', 'Pernas do Arquiteto'], ['Zahar', 'Braço Direito do Arquiteto'], ['Thalor', 'Braço Esquerdo do Arquiteto'], ['Urdan', 'Tronco do Arquiteto'], ['Verden', 'Cabeça do Arquiteto']]) {
        profile.m423.anchors[cap] = { t: Date.now(), stab: 100, sealed441: true, piece };
      }
      try { bigText('MARCO DA RECONSTRUÇÃO ERGUIDO', 2000); } catch (_) {}
    }
    if(!read406&&window.Scenes406){const w=W.get(m.id),step=s.s;if(Scenes406.read(m,s,w,()=>{if(W.get(m.id)===w&&state(m.id)===s&&s.s===step&&!s.done)useMarker(m,i,true)}))return}
    if(m.id==='a1'&&s.s===0&&s.cartRescued401&&!s.edranHelp401){
      /* v546 (missão fixa #1): salvou os civis antes de lutar — o escudo de Edran rachou segurando a gosma */
      s.edranHelp401=true;if(typeof player!=='undefined'&&player){player.hp=player.maxhp;try{floater(player.x,player.z,'VIDA RESTAURADA','#6bff8d',true);sfx('level')}catch(_){}}save();
      if(window.Intro401){Intro401.dialog('Edran',['Você tirou os dois de lá antes de tudo. A gosma acertou meu escudo enquanto você empurrava: rachou de ponta a ponta.','Eles são um casal de Aster. Disseram que vão abrir uma banca de ataduras no primeiro anel da cidade.','Beba este bálsamo da minha bolsa. Ele restaura toda a sua vida. Agora vamos.'],()=>useMarker(m,i,true));return}
    }
    if(m.id==='a1'&&s.s===0&&!s.cartRescued401){
      const w=W.get(m.id);if(!w)return;
      if(!s.choice545)s.choice545='luta';
      if(!s.edranHelp401){s.edranHelp401=true;if(typeof player!=='undefined'&&player){player.hp=player.maxhp;player.iT=Math.max(player.iT||0,3);try{floater(player.x,player.z,'VIDA RESTAURADA','#6bff8d',true);sfx('level')}catch(_){}}const it=w.inters[0];it.x=w.cart.position.x;it.z=w.cart.position.z+2.3;it.label='F · EMPURRAR A CARROÇA';save();if(window.Intro401)Intro401.dialog('Edran',['Você conseguiu. A criatura deixou um cristal; use F para recolher os recursos.','Ele desaparece em dez segundos. O ouro do abate já está com você.','Beba este bálsamo revigorante da minha bolsa para restaurar toda sua vida antes de seguir.','Meu escudo aguentou inteiro porque você foi direto na criatura.','Agora ajude-me a levantar a carroça. Há sobreviventes presos debaixo dela.'],()=>{});else toast('<b>Edran:</b> — Beba o bálsamo da bolsa e ajude-me a levantar a carroça.',6000);return}
      rescueCart(m,i);return;
    }
    s.hit.push(i);
    const w = W.get(m.id);
    if (w) { const it = w.inters.find(x => x.idx === i); if (it) { const k = L.inter.indexOf(it); if (k >= 0) L.inter.splice(k, 1); }
      const fig = w.figs[w.inters.findIndex(x => x.idx === i)]; if (fig && fig.m) speech153({ m: fig.m, x: fig.x, z: fig.z, short: fig.name || '' }, fill(sp.done.replace(/^[^:—]+: — /, '— '), s));
      const gi = w.inters.findIndex(x => x.idx === i); if (gi >= 0 && w.grps[gi]) { w.grps[gi].userData.taken = true; scene.remove(w.grps[gi]); } }
    try { fxRing(player.x, player.z, isSide(m) ? 0x7fe8ff : 0xffc457, 2.2, .6); sfx('coin'); } catch (_) {}
    const n = sp.pts || 1;
    if (m.id === 'a1' && s.s === 0 && s.hit.length >= n) window.Fixas545?.done1(s.choice545 || 'luta');
    if (s.hit.length >= n) advance(m, sp.done); else { save(); toast('<b>[HISTÓRIA]</b> ' + s.hit.length + ' de ' + n + '.', 2500); }
  }
  function spawnFight(m) {
    const s = state(m.id), sp = m.steps[s.s], w = W.get(m.id); if (!w || !sp.fight) return;
    const total = (sp.fight.n + (sp.fight.el || 0)) * (sp.pts || 1), left = total - s.killed; if (left <= 0) return;
    const gr = Math.min(9, rankOf()), elites = Math.max(0, Math.min(left, (sp.fight.el || 0) * (sp.pts || 1) - Math.max(0, s.killed - sp.fight.n * (sp.pts || 1))));
    const pts = pointsOf(m);
    for (let i = 0; i < left; i++) {
      const ptIdx = i % pts.length, p = pts[ptIdx]; let x = p[0], z = p[1];
      for (let k = 0; k < 20; k++) { const a = rnd(0, TAU), d = rnd(5, 10); x = p[0] + Math.cos(a) * d; z = p[1] + Math.sin(a) * d; if (freeAt(x, z, .6)) break; }
      const pool = sp.fight.kinds ? sp.fight.kinds.filter(k => KINDS[k]) : null;
      let k = pool && pool.length ? pick(pool) : wpick(kindsFor(gr)).k;
      if (sp.fight.saporei456) {
        if (ptIdx === 1) k = KINDS.saporei ? 'saporei' : (KINDS.sapogig ? 'sapogig' : (KINDS.sapo ? 'sapo' : k));
        else k = KINDS.golcristal_f ? 'golcristal_f' : (KINDS.golcristal ? 'golcristal' : k);
      }
      try {
        const e = spawnKind(k, x, z, gr, { wild: true });
        e.aggro = true;
        if (m.id === 'a1' && s.s === 0) { e.isIntroTutorial = true; e.hp = e.maxhp = 30; e.dmg = 3; }
        else if (i < elites) makeElite(e);
        if (sp.fight.logos456 && i === 0) {
          e.logos456 = true; e.threat184 = 9; e.name = '[Logos] Dedo do Arquiteto'; e.short = 'Dedo do Arquiteto';
        }
        if (sp.fight.saporei456 && ptIdx === 1 && !w.foes.some(o => o.saporei456)) {
          e.saporei456 = true; e.honor456 = true; e.name = '[Rei do Brejo #020] Sapo Rei de Verden'; e.short = 'Sapo Rei #020';
        }
        if (sp.fight.architectBoss456 && i === 0) {
          e.arch223 = true; e.architect456 = true; e.isBoss = true; e.name = '[Inefável] O Arquiteto'; e.short = 'O Arquiteto';
          try {
            if (typeof arch242 === 'function') arch242(e);
            else if (typeof pieceMesh250 === 'function') { const pm = pieceMesh250(3); if (pm && e.m?.root) e.m.root.add(pm); }
          } catch (_) {}
        }
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
    { const next = ACTS.find(m => !S.m[m.id]?.done); if (next && !S.m[next.id] && actOpen(next.act)) { begin(next); if (S.follow436 !== false && (!run.trackObj || !String(run.trackObj).startsWith('camp327:'))) { run.trackObj = 'camp327:' + next.id; saveRun(); toast('<b>[HISTÓRIA]</b> Novo ato liberado: <b>Ato ' + esc(next.title) + '</b>. Acompanhando no mapa.', 8000); } } }
    for (const m of SIDE) if (m.npc === 'Torvo' && !S.m[m.id] && sideOpen(m)) begin(m);
    const world = L.mode === 'world';
    for (const m of active()) {
      const s = state(m.id), sp = m.steps[s.s]; if (!sp) continue;
      if (sp.t === 'tower' && (profile.towerBest || 0) >= s.base) { advance(m); continue; }
      if (sp.t === 'caps' && capsVisited() >= sp.n) { advance(m); continue; }
      if (sp.t === 'barter') { if (!profile.classless) advance(m, sp.done); continue; }
      if(m.id==='a1'&&s.s===1&&window.Fronteira551?.active())continue;
      if (sp.t === 'city' && world) { const c = nearestCity(player.x, player.z); if (c.d < entryRadius(c.c) - 3) { s.city = c.c.name; if(m.id==='a1'){s.cityCheckpoint401=true;save();window.Fixas545?.gate1()} advance(m, sp.done); continue; } }
      if (sp.t !== 'go') { clearWorld(m.id); continue; }
      let w = W.get(m.id);
      if (w && (w.L !== L || w.step !== s.s || w.grps.some(g => !g.parent && !g.userData.taken))) { // mundo foi refeito: recria
        for (const e of w.foes) if (e.dead && !e.counted327) { e.counted327 = true; s.killed++; }
        w.foes = []; clearWorld(m.id); w = null;
      }
      if (!world) continue;
      if (!w) { buildWorldFor(m); w = W.get(m.id); }
      for (const g of w.grps) { for (const mat of g.userData.mats) mat.uniforms.t.value = T; const bk = g.getObjectByName && g.getObjectByName('Registro436'); if (bk) { bk.position.y = .08 + Math.sin(T * 2 + g.position.x) * .05; bk.userData.book436.emissiveIntensity = .5 + .4 * Math.sin(T * 2.6); } }
      for (const f of w.figs) if (f && f.m) try { f.t += .3; if(!f.down)animChibi(f.m, { move: 0, atk: 0, dead: 0, wind: 0 }, f.t); if(!f.down)f.m.root.rotation.y = Math.atan2(player.x - f.x, player.z - f.z); } catch (_) {}
      if (!s.fightDone) {
        for (const e of w.foes) if (e.dead && !e.counted327) { e.counted327 = true; s.killed++; save(); }
        const total = (sp.fight.n + (sp.fight.el || 0)) * (sp.pts || 1);
        if (s.killed >= total && !(m.id === 'a1' && window.Intro401?.reclaiming())) { s.fightDone = true; save(); toast('<b>[HISTÓRIA]</b> Área segura. ' + (sp.verb ? 'Aproxime-se e use F: ' + sp.verb.toLowerCase() + '.' : ''), 4000); }
        else if ((m.id !== 'a1' || s.s !== 0 || s.helped401) && !foesLeft(m) && pointsOf(m).some(p => Math.hypot(player.x - p[0], player.z - p[1]) < 22)) { w.foes = w.foes.filter(e => !e.dead && enemies.includes(e)); spawnFight(m); }
      }
      window.Scenes406?.update(m,s,w,T);
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
  function giveDorianSupplies456(m) {
    if (m.id === 'a10' && window.Surv437?.give) {
      Surv437.give('racao_expedicao', 2, 'Ração de Expedição (Dorian)');
      Surv437.give('involucro_resina', 1, 'Invólucro de Resina (Dorian)');
    }
  }
  function talked(npc) {
    let hit = null;
    for (const m of active()) { const s = state(m.id), sp = m.steps[s.s]; if (sp && sp.t === 'talk' && sp.npc === npc) { hit = { m, sp, s }; break; } }
    if (!hit) return '';
    if (npc === 'Dorian') giveDorianSupplies456(hit.m);
    if (hit.m.id === 'a12' && hit.s.s === 0) try { if (!lore().includes('act12')) unlockLore('act12'); } catch (_) {}
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
      Intro401.dialog(npc401, sp.say.map(x => fill(x,s)), () => {if(main401.id==='a1'&&s.s===2&&profile.orderPending401){profile.creationPending91=true;creationView()}else{if(npc401==='Dorian')giveDorianSupplies456(main401);if(main401.id==='a12'&&s.s===0)try{if(!lore().includes('act12'))unlockLore('act12')}catch(_){};advance(main401,npc401+': '+sp.say.at(-1));}});
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
    if(m.id==='a1'&&s.s===1&&window.Fronteira551?.active())return Fronteira551.objective()?.target;
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
