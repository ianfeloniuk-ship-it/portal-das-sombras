/* Campanha narrativa v5: leitura da crônica e registro de contenção; prêmios e combate preservados. */
(function (root) {
  'use strict';
  const story = root.SOLO_RPG_STORY;
  if (!story) return;
  const getProfile = () => typeof profile !== 'undefined' ? profile : null;
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const name = () => getProfile()?.name || 'Viajante';
  const format = value => String(value == null ? '' : value).replace(/\{nome\}/g, () => esc(name()));
  const hasLore = key => !!getProfile()?.lore?.includes(key);
  story.acts.slice(0, 7).forEach((act, index) => {
    if (MAIN_ACTS[index + 1]) MAIN_ACTS[index + 1] = [act.title, act.objective + '<br>' + act.diary];
  });
  Object.assign(LORE, {
    start: [story.lore.start.title, story.lore.start.text],
    originV3: [story.lore.origin.title, story.lore.origin.paragraphs.join('<br><br>')],
    narratorMemoryV3: [story.lore.narratorMemory.title, story.lore.narratorMemory.paragraphs.join('<br><br>')],
    gate: ['Fendas e Portais', 'Os portais levam a fragmentos de outros mundos. Seus guardiões atuais sustentam a invasão: enquanto vivem, a mana se acumula até transbordar e os monstros atravessam.'],
    boss: ['Guardiões das masmorras', 'Derrotar um guardião atual desfaz a ligação da masmorra. Esta função é diferente da contenção exercida pelo antigo Primeiro Guardião.'],
    past: ['Um selo anterior', 'Registros antigos mencionam um guardião que impedia a passagem. Sua morte precedeu a abertura geral das Fendas. Quem o matou e por quê ainda são perguntas sem resposta.'],
    towerEnd: [story.acts[6].title + ' · O mapa', story.acts[6].diary + ' Aldric deixou um registro para a Ordem. O andar 100 encerra esta etapa; a Torre continua acima dele.'],
    act13: [story.lore.victory.title, story.lore.victory.text],
    containmentV5: [story.lore.containment.title, story.lore.containment.text]
  });
  story.acts.slice(7, 12).forEach(act => {
    const confession = act.id === 'act_12' ? '<br><br>' + story.lore.narratorMemory.paragraphs.join('<br><br>') : '';
    LORE[act.id.replace('act_', 'act')] = [act.title, act.diary + '<br><br>' + act.evidence + confession];
  });
  const originalUnlock = unlockLore;
  unlockLore = function (key) {
    if (key === 'act12' && !hasLore('act11')) return false;
    return originalUnlock.apply(this, arguments);
  };
  const originalChapter = storyCh220;
  storyCh220 = function (key) {
    if (key === 'act12' && !hasLore('act11')) return false;
    return originalChapter.apply(this, arguments);
  };
  // Uma ofensiva contida é um registro narrativo. Não executa o prêmio do chefe.
  const containmentReady = () => {
    const p = getProfile();
    if (!p || p.creationPending91 || !hasLore('act11') || !hasLore('act12') || p.arch223 || Object.keys(p.piece250 || {}).length) return false;
    const capitals = caps223();
    return capitals.length === 5 && capitals.every(c => !anchorOpen221(c) && !cityFallen(c));
  };
  const recordContainment = () => {
    if (hasLore('containmentV5') || hasLore('act13') || !containmentReady()) return false;
    originalUnlock.call(this, 'containmentV5');
    return true;
  };
  const originalArchTick = archTick223;
  archTick223 = function () {
    const result = originalArchTick.apply(this, arguments);
    // A reunião e o Fim do Ciclo continuam sendo tratados pelo código original primeiro.
    if (!root._wipe) recordContainment();
    return result;
  };
  NPCQ.Lyra.d = 'Feche 3 portais e registre os sinais das travessias';
  NPCQ.Mira.d = 'Pesque 5 vezes para abastecer os sobreviventes';
  NPCQ.Kael.d = 'Derrote 5 elites para proteger a coleta de metal';
  NPCQ.Brann.d = 'Derrote 2 guardiões que sustentam as invasões';
  NPCQ.Dorian.d = 'Mine 30 recursos para recompor a carga perdida';
  NPCQ.Selene.d = 'Deposite 50.000 de ouro no fundo do refúgio';
  NPCTALK.Lyra[0] = '{nome}, há outros Transmigradores nos registros. Alguns descrevem a mesma inscrição em épocas diferentes. Vamos conferir as evidências antes de tirar conclusões.';
  NPCTALK.Mira[0] = '{nome}, os sobreviventes precisam de comida e remédios. O lago ainda abastece a cidade.';
  NPCTALK.Kael[0] = '{nome}, encontrei as mesmas marcas em armas de passagens diferentes. Precisamos de metal e evidências.';
  NPCTALK.Brann[0] = '{nome}, os guardiões atuais sustentam as invasões. Derrube-os para aliviar a pressão nas muralhas.';
  NPCTALK.Dorian[0] = 'Uma carga ficou pelo caminho. Reponha os materiais; não vou abandonar quem dependia dela.';
  NPCTALK.Selene[0] = 'Cada depósito sustenta um refúgio possível. Aster precisa resistir e continuar habitável.';
  const reframed = {
    tower: ['Os Registros de Aldric', ['Lyra: alcance o andar 20 e compare as inscrições com o diário de Aldric.', 'Derrote 3 guardiões e registre a repetição das marcas.', 'Feche 5 portais para estabilizar a rota dos registros.', 'Alcance o andar 50 e complete o mapa parcial de Aldric.']],
    lake: ['Abastecimento de Mira', ['Mira: pesque 10 vezes para abastecer os sobreviventes.', 'Encontre 4 espécies para diversificar o abastecimento.', 'Derrote 100 ameaças que põem a rota em perigo.', 'Resista por 60 segundos à pressão de uma ruptura.']],
    miner: ['A Carga sem Destino'], city: ['Um Refúgio em Aster']
  };
  STORIES.forEach(s => { const update = reframed[s.id]; if (!update) return; s.n = update[0]; if (update[1]) s.steps.forEach((step, i) => { step[2] = update[1][i]; }); });
  // Resolve a macro uma vez, na entrada da tela; o nome vira texto escapado.
  let journalTab = null;
  const chapterUnlocked = index => {
    const p = getProfile();
    if (!Number.isInteger(index) || index < 0 || index >= 13 || !p || p.creationPending91) return false;
    if (index === 0) return true;
    if (index < 6) return p.rank >= index + 1 || (p.acts || []).includes(index + 1);
    if (index === 6) return hasLore('towerEnd');
    if (index === 7) return hasLore('towerEnd') && hasLore('act8');
    if (index < 12) return chapterUnlocked(index - 1) && hasLore('act' + (index + 1));
    return chapterUnlocked(11) && (hasLore('act13') || hasLore('containmentV5'));
  };
  const bookList = () => {
    const chapters = story.book.chapters;
    const available = chapters.filter((_, index) => chapterUnlocked(index)).length;
    let blockedShown = false;
    let html = '<div class="sec">' + esc(story.book.title) + '</div><div class="sysline">' + available + ' de 13 capítulos revelados. As próximas páginas se abrem conforme você avança e encontra novas provas.</div>';
    chapters.forEach((chapter, index) => {
      const unlocked = chapterUnlocked(index);
      if (unlocked) html += row('<b>' + esc(chapter.title) + '</b>', 'Página disponível para leitura.', btn('Ler capítulo', 'storyreadV5', index));
      else if (!blockedShown) { blockedShown = true; html += row('Capítulo ' + (index + 1) + ' · ainda não revelado', 'Continue a jornada para encontrar as próximas páginas.', ''); }
    });
    return html;
  };
  const readChapter = value => {
    const index = Number(value);
    if (!Number.isInteger(index) || index < 0 || index >= story.book.chapters.length || !chapterUnlocked(index)) return false;
    const chapter = story.book.chapters[index];
    let paragraphs = chapter.paragraphs, title = chapter.title;
    if (index === 12) {
      if (hasLore('act13')) paragraphs = story.book.confrontation;
      else { title = story.lore.containment.title; paragraphs = story.book.containment; }
    }
    let html = '<div class="story-reading" style="max-width:680px;margin:0 auto;font-size:15px;line-height:1.7">' + paragraphs.map(p => '<p style="margin:0 0 1em">' + esc(p) + '</p>').join('') + '</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between">' + (index > 0 && chapterUnlocked(index - 1) ? btn('Capítulo anterior', 'storyreadV5', index - 1) : '') + btn('Voltar à história', 'journeytab', 'story') + (index < 12 && chapterUnlocked(index + 1) ? btn('Próximo capítulo', 'storyreadV5', index + 1) : '') + '</div>';
    view = () => readChapter(index);
    openModal(title, html);
    const body = document.getElementById('mb');
    if (body) body.scrollTop = 0;
    return true;
  };
  const originalJourney = journeyView;
  journeyView = function (tab = 'goals') {
    journalTab = tab;
    try { return originalJourney.apply(this, arguments); }
    finally { journalTab = null; }
  };
  const originalModal = openModal;
  openModal = function (title, html, route) {
    if (journalTab === 'story' && title === 'DIÁRIO DE JORNADA') html += bookList();
    return originalModal.call(this, title, format(html), route);
  };
  const originalActions = extraActions3;
  extraActions3 = function (action, value) {
    if (action === 'storyreadV5') { readChapter(value); return 'close0'; }
    return originalActions.apply(this, arguments);
  };
  const originalShow = showSys;
  showSys = function (html) { return originalShow.call(this, format(html)); };
  // A origem continua como texto; confirmar a criação não abre nenhuma cena.
  const originalCreation = finishCreation;
  finishCreation = function () {
    const result = originalCreation.apply(this, arguments);
    if (result === true) unlockLore('originV3');
    return result;
  };
  const originalObjectives = journeyObjectives;
  journeyObjectives = function () {
    const list = originalObjectives.apply(this, arguments), p = getProfile();
    if (!p || p.creationPending91) return list;
    let index = Math.max(0, Math.min(6, (p.rank || 0) - 1));
    for (let i = 7; i < 12; i++) if (hasLore('act' + (i + 1))) index = i;
    if (hasLore('act13') || hasLore('containmentV5')) index = 12;
    const act = story.acts[index];
    let action = 'Continue as provas e as missões da Ordem para investigar os próximos registros.';
    if (index === 6) action = hasLore('towerEnd') ? 'Procure os caçadores do Clã Ferrugem nas estradas.' : 'Alcance o andar 100 da Torre.';
    if (index === 7) action = 'Visite uma das cinco capitais e investigue suas Âncoras.';
    if (index === 8) action = 'Fortaleça as cidades e prepare-se para enfrentar um guardião de ameaça divina.';
    if (index === 9) action = 'Investigue e feche o Portal Primordial durante o Fim do Mundo.';
    if (index === 10) action = 'Conquiste o rank Arconte e investigue a memória da voz que acompanha você.';
    if (index === 11) action = 'Proteja as Âncoras. Contenha as partes que escaparem; se reunidas, detenha o Arquiteto antes de Aster abrir caminho para as outras realidades.';
    if (index === 12) action = containmentReady() ? 'Esta ofensiva foi contida. Leia o encerramento no Diário e cuide de Aster e das rotas.' : 'A vitória está registrada. Novos sinais de pressão exigem proteger as capitais e conter as peças que escaparem.';
    list.unshift({ id: 'campaignV3', n: act.title, d: act.objective + '<br>' + action, progress: 'Registro atual da campanha', ready: false });
    return list;
  };
  root.NarrativeCampaignIntegration = { version: story.version, story, format, name, chapterUnlocked, readChapter, containmentReady, actUnlocked: key => chapterUnlocked(story.acts.findIndex(act => act.id === key)) };
})(window);
