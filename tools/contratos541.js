/* v541 (Ian, 22/10/2026): os contratos do motor infinito (tools/motor-missoes-infinitas.js) viram missão de verdade.
   Cada mural de cidade mostra 3 contratos vivos daquela cidade. Ao aceitar você escolhe como vai resolver (A ou B);
   o alvo nasce no mundo perto da cidade, cada abate conta no HUD, o marcador aparece no minimapa e no mapa,
   e o pagamento da escolha só entra quando o último alvo cai (Quests480.completeQuest → Contratos541.pay).
   Concluído o contrato, aquela vaga do mural ganha um contrato novo; a cada dia as vagas livres também mudam. */
(function (global) {
  'use strict';

  const SLOTS = 3;
  // Capitais do Livro: nome → região do mundo (CANON_CAPITALS em 250-mundo-infinito.js)
  const CAP = { aster: '0,0', ymiria: '0,-5', zahar: '5,0', thalor: '-5,0', urdan: '0,5', verden: '5,5', urdan_verden: '0,5' };
  // Mural fixo do quests480 por capital
  const FIXKEY = { '0,0': 'aster', '0,-5': 'ymiria', '5,0': 'zahar', '-5,0': 'thalor', '0,5': 'urdan_verden', '5,5': 'urdan_verden' };
  // Bioma do jogo (biomeAt) → lista de criaturas do motor
  const BIOME = { campos: 'campos', flores: 'campos', floresta: 'floresta', pantano: 'pantano', neve: 'neve', cristal: 'neve', deserto: 'deserto', vulcao: 'vulcao' };
  // Criatura do motor → monstro real (KINDS)
  const KIND = { aranha: 'tecela' };
  // Como resolver: textos curtos e verdadeiros (a escolha muda só o pagamento; o trabalho é abater os alvos)
  const APPROACH = {
    CARAVAN_ESCORT: ['Escoltar o comboio por honra, sem cobrar', 'Cobrar a taxa de escolta'],
    CLAN_DIPLOMACY: ['Provar a inocência do clã', 'Exigir tributo do acampamento'],
    MISSING_SCOUT_LETTER: ['Devolver a arca à família do batedor', 'Ficar com tudo o que estava na arca'],
    RIFT_MIASMA_CONTAINMENT: ['Limpar a área e reforçar o selo da terra', 'Limpar a área e recolher os núcleos da fissura'],
    SURVIVAL_EXPEDITION_SUPPLY: ['Montar um acampamento seguro para a patrulha', 'Abrir caminho para a patrulha voltar à muralha'],
    SABOTAGE_INVESTIGATION: ['Entregar o sabotador ao governo da cidade', 'Usar a isca do sabotador e ficar com o ouro dele']
  };
  const GOLD_SCALE = [1, 3, 6, 14, 30, 70, 160, 380, 600, 900];
  const WS_REGION = { '0,0': 'aster', '0,-5': 'ymiria', '5,0': 'zahar', '-5,0': 'thalor', '0,5': 'urdan_verden', '5,5': 'urdan_verden' };

  const R = () => global.RadiantPrimeva;
  const Q = () => global.Quests480;

  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  function cityOf(key) {
    if (key == null || typeof regionCity !== 'function') return null;
    key = String(key);
    const id = CAP[key.toLowerCase()] || key;
    const m = /^(-?\d+),(-?\d+)$/.exec(id);
    return m ? regionCity(+m[1], +m[2]) : null;
  }
  function boardKey(key) { const c = cityOf(key); return (c && FIXKEY[c.id]) || key; }

  function st() {
    if (typeof profile === 'undefined' || !profile) return null;
    const S = profile.contratos541 = profile.contratos541 || {};
    return S;
  }
  function slotsOf(city) {
    const S = st(); if (!S) return [0, 0, 0];
    const day = typeof todayKey === 'function' ? todayKey() : '';
    const c = S[city.id] = S[city.id] || { g: [0, 0, 0], day };
    if (c.day !== day) { // dia novo: vagas livres trocam de contrato
      const QS = Q() && Q().getState();
      for (let i = 0; i < SLOTS; i++) if (!(QS && QS.active[qidOf(city, i, c.g[i])])) c.g[i]++;
      c.day = day;
    }
    return c.g;
  }
  function qidOf(city, slot, gen) { return 'c541_' + city.id.replace(',', '_') + '_' + slot + '_' + gen; }

  function rankNow() { try { return Math.max(0, Math.min(9, rankOf())); } catch (_) { return 0; } }

  // Monta o contrato (sem escolha) de uma vaga do mural
  function build(city, slot, gen, usedCodes) {
    const E = R(); if (!E) return null;
    const rng = E.mulberry32(hash(city.id + '|' + slot + '|' + gen + '|' + (typeof WSEED !== 'undefined' ? WSEED : 0)));
    const pick = a => a[Math.floor(rng() * a.length)];
    let archs = E.ARCHETYPES.filter(a => !a.insideRift && APPROACH[a.code]);
    const free = archs.filter(a => !usedCodes.includes(a.code));
    if (free.length) archs = free;
    const arch = pick(archs);
    const ang = rng() * Math.PI * 2, dist = Math.round(140 + rng() * 90);
    const dx = Math.round(Math.cos(ang) * dist), dz = Math.round(Math.sin(ang) * dist);
    const b = BIOME[typeof biomeAt === 'function' ? biomeAt(city.x + dx, city.z + dz) : 'campos'] || 'campos';
    const pool = (E.CREATURES_BY_BIOME[b] || E.CREATURES_BY_BIOME.campos).filter(m => typeof KINDS === 'undefined' || KINDS[KIND[m.id] || m.id]);
    const mob = pick(pool.length ? pool : E.CREATURES_BY_BIOME.campos);
    const kind = KIND[mob.id] || mob.id;
    const hp = (typeof KINDS !== 'undefined' && KINDS[kind] && KINDS[kind].hp) || 50;
    const count = hp >= 200 ? 2 : hp >= 100 ? 3 : 4 + Math.floor(rng() * 3);
    const rk = rankNow();
    const gold = 85 * GOLD_SCALE[rk], rep = 15 + rk * 12;
    const canon = E.REGIONS.find(r => r.name === city.name);
    const region = { id: city.id, name: city.name, ruler: canon ? canon.ruler : 'o Conselho de ' + city.name };
    const ctx = { region, clan: pick(E.CLANS), npc: pick(E.MARGIN_NPCS), trigger: pick(E.TRIGGERS), mob, gold, rep, count, tx: city.x + dx, tz: city.z + dz };
    // Lê o efeito das duas escolhas sem aplicar nada
    const pays = [arch.choiceA, arch.choiceB].map(ch => { E._capture = []; try { ch.apply(ctx); } catch (_) {} const d = E._capture[0] || {}; E._capture = null; return d; });
    const kn = (typeof KINDS !== 'undefined' && KINDS[kind] && KINDS[kind].n) || mob.name;
    const desc = arch.desc(ctx).replace(/\s*Tática( recomendada)?:.*$/, '');
    return {
      id: qidOf(city, slot, gen), slot541: slot, code: arch.code,
      region: city.id, type: 'radiant541', count541: true, noBoss: true,
      title: arch.title(ctx).replace(/\s+/g, ' '),
      giver: ctx.npc + ' · Mural de ' + city.name,
      desc: desc + ` Abata ${count} × ${kn} no local marcado.`,
      trigger: ctx.trigger, rank: rk, biome: b,
      offset: { dx, dz }, minions: count, minionKinds: [kind], mobName541: kn,
      pays541: pays, approach541: APPROACH[arch.code]
    };
  }

  function boardDefs(city) {
    const g = slotsOf(city), QS = Q() && Q().getState(), out = [], used = [];
    for (let i = 0; i < SLOTS; i++) {
      const id = qidOf(city, i, g[i]);
      const act = QS && QS.active[id];
      const d = (act && act.def490) || build(city, i, g[i], used);
      if (!d) continue;
      used.push(d.code);
      out.push(d);
    }
    return out;
  }

  // Texto do pagamento, montado só do que realmente é pago (texto = contrato)
  function payText(d, city) {
    const p = [];
    if (d.gold) p.push(`<b>${d.gold} de ouro</b>`);
    if (d.rep) p.push(`<b>+${d.rep} de reputação</b> da Ordem`);
    if (d.crystals) p.push(`<b>${d.crystals} minérios</b> do seu rank`);
    if (d.cores) p.push(`<b>${d.cores} núcleos</b> do seu rank`);
    if (d.trust) p.push(`${d.trust > 0 ? '+' : ''}${d.trust} de confiança em ${city.name}`);
    if (d.scarcity < 0) p.push(`até ${-d.scarcity} pontos a menos no acréscimo de preço de ${city.name}`);
    if (d.buildPts && WS_REGION[city.id]) p.push(`+${d.buildPts} pontos de obra no Conselho de ${city.name}`);
    if (d.fameGood) p.push('fama de bondade');
    if (d.fameBad) p.push('fama de maldade');
    return p.join(', ');
  }

  function boardHtml(key) {
    const city = cityOf(key);
    if (!city || !R() || !Q()) return '';
    const QS = Q().getState();
    let h = `<div class="sec">CONTRATOS VIVOS DE ${String(city.name).toUpperCase()}</div>`;
    h += `<div class="sysline">Você escolhe como resolver ao aceitar. O pagamento da escolha só entra quando o último alvo cair. Um contrato cumprido dá lugar a outro.</div>`;
    for (const d of boardDefs(city)) {
      const act = QS && QS.active[d.id];
      let btns;
      if (act) {
        const tr = QS.tracked === d.id;
        btns = `<button class="btn ${tr ? 'on' : 'hot'}" onclick="Quests480.trackQuest('${d.id}');Quests480.openBoard('${city.id}')">${tr ? 'Acompanhando' : 'Acompanhar'}</button> ` +
               `<button class="btn" style="color:#ff8fa3" onclick="Contratos541.abandon('${d.id}','${city.id}')">Abandonar</button>`;
      } else {
        btns = [0, 1].map(i => `<button class="btn ${i ? '' : 'hot'}" onclick="Contratos541.accept('${city.id}',${d.slot541},${i})">${i ? 'B' : 'A'}: ${d.approach541[i]}</button>`).join(' ');
      }
      const dist = (typeof player !== 'undefined' && player) ? Math.round(Math.hypot(player.x - (city.x + d.offset.dx), player.z - (city.z + d.offset.dz))) : 0;
      let body = `${d.desc}<br><small style="color:#8fe3ff">Contratante: ${d.giver} · alvo a ${dist} m de você</small>`;
      if (act) {
        body += `<br><span style="color:#ffd070">Escolha: ${d.approach541[d.choice541]} · ${d.mobName541}: ${act.progress || 0}/${act.max}</span><br><span style="color:#7ef5a5">Ao concluir: ${payText(d.pay541, city)}.</span>`;
      } else {
        body += [0, 1].map(i => `<br><span style="color:${i ? '#ffd070' : '#7ef5a5'}">${i ? 'B' : 'A'} paga: ${payText(d.pays541[i], city)}.</span>`).join('');
      }
      const rl = (typeof GR !== 'undefined' && GR[d.rank]) ? `<span class="rl" style="color:${(typeof RANKS !== 'undefined' && RANKS[d.rank] && RANKS[d.rank].c) || '#ffd54f'}">${GR[d.rank].id}</span> · ` : '';
      h += row(`${rl}<b>${d.title}</b> <small style="color:#ffd070">[CONTRATO VIVO]</small>`, body, btns);
    }
    return h;
  }

  function accept(cityId, slot, choice) {
    const city = cityOf(cityId); if (!city || !Q()) return;
    const d = boardDefs(city).find(x => x.slot541 === slot); if (!d) return;
    const def = Object.assign({}, d, { choice541: choice, pay541: d.pays541[choice] });
    Q().CATALOG[def.id] = def;
    if (Q().acceptQuest(def.id) && typeof toast === 'function') toast(`<b>[CONTRATO VIVO]</b> Abata ${def.minions} × ${def.mobName541}. O alvo está marcado no minimapa e no mapa.`, 6000);
    Q().openBoard(city.id);
  }

  function abandon(qid, cityId) { if (Q()) { Q().abandonQuest(qid); Q().openBoard(cityId); } }

  // Pagamento no fim (chamado por Quests480.completeQuest)
  function pay(def) {
    const city = cityOf(def.region) || { id: def.region, name: def.region };
    const d = def.pay541 || {};
    if (typeof run !== 'undefined' && run) {
      if (d.gold) run.gold = (run.gold || 0) + d.gold;
      const rk = rankNow();
      if (run.res) {
        if (d.crystals) { run.res.cry = run.res.cry || []; run.res.cry[rk] = (run.res.cry[rk] || 0) + d.crystals; }
        if (d.cores) { run.res.core = run.res.core || []; run.res.core[rk] = (run.res.core[rk] || 0) + d.cores; }
      }
    }
    if (d.rep && typeof addOrderRep === 'function') addOrderRep(d.rep, 'Contrato cumprido: ' + def.title);
    if ((d.trust || d.scarcity) && typeof regionEvent116 === 'function' && city.x !== undefined) {
      regionEvent116(city, d.trust || 0, Math.min(0, d.scarcity || 0), 'Você cumpriu o contrato: ' + def.title);
    }
    if (d.buildPts && WS_REGION[city.id] && global.WorldSim479 && WorldSim479.getSimState) {
      const r = WorldSim479.getSimState().regions[WS_REGION[city.id]];
      if (r) r.buildPoints = (r.buildPoints || 0) + d.buildPts;
    }
    if (typeof profile !== 'undefined' && profile && (d.fameGood || d.fameBad)) {
      const F = profile.fama523 = profile.fama523 || {};
      if (d.fameGood) F.bondade = (F.bondade || 0) + 1;
      if (d.fameBad) F.maldade = (F.maldade || 0) + 1;
    }
    // A vaga do mural ganha um contrato novo
    const S = st(), c = S && S[city.id];
    if (c && c.g && def.slot541 !== undefined) c.g[def.slot541]++;
    return 'Você recebeu: ' + payText(d, city) + '.';
  }

  global.Contratos541 = { cityOf, boardKey, boardHtml, boardDefs, accept, abandon, pay };
})(window);
