/* v508 (Ian, 21/10/2026): a "teia de gatilhos" do mundo aberto, estilo Skyrim — explorar sempre esbarra numa história, e uma missão leva a outra.
   Tudo entra no Diário [L] que já existe (aba Contratos) e em tools/quests480.js; nenhum diário novo.
   1) Documentos: 17 modelos de carta/diário achados em baús, carcaças, acampamentos, covis e ruínas (encontros502). Cada um aponta
      um lugar REAL do mapa (ruína, covil ou altar que existe por semente). Ler abre uma "Missão diversa"; chegar lá revela o item com nome.
   2) Pontos vivos: ~1 em cada 3 acampamentos/carcaças/baús/altares sorteia, a cada visita, o que acontece ali (bandidos com carta, caçador
      morto, refugiado doente, duelo de clãs), pesando nível, o que você já fez e quantas vezes passou. O que saiu fica em run.gat508.pv.
   3) Eventos presenciados: carroça atacada na estrada (Civic343) e monstro contra guardas perto de uma Capital. Se você ajuda, alguém aborda.
   4) Mensageiro: depois de subir de rank ou abrir o baú de um covil, um mensageiro (Povo482) alcança você e entrega uma carta.
   5) Cadeias: carta→relíquia→contrato do mural · guardas→relato na Capital→contrato do mural · carroça→entrega→missão de guilda ·
      refugiado→clã→missão de clã · duelo de clãs→missão de clã.
   Determinístico por semente (rh/mulberry32), salvo em run.gat508 (e as missões em profile.quests480), números inteiros. */
(function (global) {
  'use strict';
  const TAU = Math.PI * 2;
  const Q = () => global.Quests480;
  const clampN = (v, a, b) => Math.max(a, Math.min(b, v));
  const hs = s => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  const RND = (...k) => mulberry32(rh(hs(k.join('|')) | 0, 508, k.length));
  const pickR = (R, a) => a[Math.floor(R() * a.length)];
  const G = () => { if (typeof run === 'undefined' || !run) return null; return run.gat508 || (run.gat508 = { docs: [], pv: {}, wit: {}, done: {}, defs: {}, pend: [], last: [], rank: -1, dens: {} }); };
  const rk = () => { try { return rankOf(); } catch (_) { return 0; } };
  const gradeAt = (x, z) => clampN(Math.max(danger(x, z), rk() - 1), 0, 9);
  const cityAt = (x, z) => { try { return nearestCity(x, z); } catch (_) { return { c: { name: 'Aster', x: 0, z: 0 }, d: 0 }; } };
  const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
  const DIRS = ['leste', 'sudeste', 'sul', 'sudoeste', 'oeste', 'noroeste', 'norte', 'nordeste'];
  const dirOf = (dx, dz) => DIRS[Math.round(((Math.atan2(dz, dx) + TAU) % TAU) / (TAU / 8)) % 8];
  const REGION = { Aster: 'aster', Ymiria: 'ymiria', Zahar: 'zahar', Thalor: 'thalor', Urdan: 'urdan_verden', Verden: 'urdan_verden' };
  function capitals() { const out = []; try { const C = global.Mapa500 && Mapa500.CAP; for (const k in C) out.push({ name: C[k].name, x: C[k].x, z: C[k].z }); } catch (_) {} out.push({ name: 'Aster', x: 0, z: 0 }); return out; }
  function nearCapital(x, z) { let b = null, bd = 1e12; for (const c of capitals()) { const d = Math.hypot(c.x - x, c.z - z); if (d < bd) { bd = d; b = c; } } return b && { ...b, d: bd }; }
  const fmtN = n => (typeof fmt === 'function' ? fmt(n) : String(n));
  const say = (h, ms) => { try { toast(h, ms); } catch (_) {} };
  const save = () => { try { if (typeof profile !== 'undefined' && profile && typeof store !== 'undefined') store.set('pds2_profile', profile); saveRun(); } catch (_) {} };
  const inWorld = () => typeof L !== 'undefined' && L && L.mode === 'world' && typeof player !== 'undefined' && player && !player.dead && typeof started !== 'undefined' && started;
  const E = () => global.Enc502;
  const inWaterSafe = (x, z) => { try { return inWater244(x, z); } catch (_) { return false; } };

  /* ---------------- 1) documentos ---------------- */
  const NOMES = ['Aldren', 'Maud', 'Osric', 'Brígida', 'Voss', 'Mirae', 'Kargan', 'Elsbeth', 'Torben', 'Hadrian', 'Isolde', 'Gunnar', 'Sibyl', 'Corvin', 'Edda', 'Rurik', 'Thessaly', 'Bertram'];
  const PLACE = { ruin: ['a ruína', 'o prédio caído'], den: ['o covil'], altar: ['o altar de pedras'] };
  const WNAME = { sword: 'Espada', dagger: 'Adagas', axe: 'Machado', staff: 'Cajado', bow: 'Arco', wand: 'Maça Sacra', tome: 'Grimório', spear: 'Lança' };
  const TPL = [
    { t: 'Última carta de um soldado', k: 'carta', p: ['ruin', 'den', 'altar'], x: 'Se esta carta chegou a você, eu não voltei. Escondi {item} {em}. Pertence à minha família. Use bem. — {nome}' },
    { t: 'Diário do caçador de tesouros', k: 'diário', p: ['den', 'ruin'], x: 'Dia 9. Os covis falam alto, mas {lugar} guarda o que importa: {item}. Os guardas dormem de dia. — {nome}' },
    { t: 'Mapa rabiscado do contrabandista', k: 'carta', p: ['ruin', 'altar'], ch: 'mural', x: 'A mercadoria boa ficou {em}: {item}. Não conte à Ordem. — {nome}' },
    { t: 'Carta ao irmão', k: 'carta', p: ['ruin', 'den', 'altar'], x: 'Irmão, escondi {item} {em}, longe da guerra. Se eu cair, é sua. Saudades. — {nome}' },
    { t: 'Testamento do mercador', k: 'carta', p: ['ruin', 'den', 'altar'], x: 'Eu, {nome}, deixo {item} a quem tiver coragem de ir {ao}. Os ladrões levaram o resto.' },
    { t: 'Bilhete do desertor', k: 'carta', p: ['ruin', 'den'], ch: 'mural', x: 'Fugi da Ordem com {item}. Enterrei {em}. Se me acharem, mintam. — {nome}' },
    { t: 'Diário do peregrino', k: 'diário', p: ['altar', 'ruin'], x: 'O altar só fala a quem reza. Deixei {item} {em}, aos pés da luz. — Peregrino {nome}' },
    { t: 'Carta do ferreiro', k: 'carta', p: ['ruin', 'den'], x: 'Forjei {item} para um cliente que nunca voltou. Fica {em}, sob um pano velho. — Ferreiro {nome}' },
    { t: 'Ordem do chefe dos bandidos', k: 'carta', p: ['den', 'ruin'], ch: 'mural', x: 'Bando, guardem {item} {em}. Quem tocar nisso antes de mim perde a mão. — {nome}' },
    { t: 'Diário do estudioso das Fendas', k: 'diário', p: ['ruin', 'altar'], x: 'As Fendas se abrem perto {de}. Deixei {item} lá, para estudo. Se eu morrer, que a Ordem se vire. — {nome}' },
    { t: 'Recibo de penhor', k: 'carta', p: ['ruin', 'den'], ch: 'mural', x: 'Penhor de {nome}: {item}, deixado em penhor {em}. Prazo vencido.' },
    { t: 'Bilhete do clã', k: 'carta', p: ['ruin', 'den', 'altar'], x: 'Aos nossos: o que o clã perdeu, {item}, repousa {em}. Tragam de volta. — {nome}' },
    { t: 'Canção do bardo', k: 'carta', p: ['ruin', 'altar', 'den'], x: 'Onde {lugar} dorme sob o musgo, {nome} cantou: "O valente que não teme a sombra receberá {item}."' },
    { t: 'Aviso do guarda', k: 'carta', p: ['ruin', 'den'], ch: 'mural', x: 'Ninguém entra {em}. Por ordem de {nome}, deixaram {item} lá dentro. Quem desobedecer, pague caro.' },
    { t: 'Oração rasgada', k: 'carta', p: ['altar', 'ruin'], x: 'Senhor, guarda {nome}. Rezei {em} e deixei {item} como oferta. Que alguém encontre.' },
    { t: 'Convocação da Ordem', k: 'carta', p: ['ruin', 'altar', 'den'], msg: 'rank', ch: 'mural', x: 'A Ordem reconhece seu avanço. Guardamos {item} {em} para quem merecer. — {nome}, mensageiro da Ordem' },
    { t: 'Agradecimento do povo', k: 'carta', p: ['ruin', 'altar', 'den'], msg: 'den', x: 'Você limpou o covil. Em agradecimento, deixamos {item} {em}. — {nome}, em nome do povo da estrada' }
  ];
  const pickRSite = (type, s) => { const a = PLACE[type] || ['o lugar']; return a[hs(s.id) % a.length]; };
  const em = t => t.replace(/^a /, 'na ').replace(/^o /, 'no '), de = t => t.replace(/^a /, 'da ').replace(/^o /, 'do '), ao = t => t.replace(/^a /, 'à ').replace(/^o /, 'ao ');
  function phrase(s) {
    const cap = nearCapital(s.x, s.z), c = cityAt(s.x, s.z).c, ref = (c && c.name) ? { name: c.name, x: c.x, z: c.z } : cap;
    return pickRSite(s.type, s) + ' ' + dirOf(s.x - ref.x, s.z - ref.z) + ' de ' + ref.name;
  }
  function placeFor(R, x, z, types, used) {
    const En = E(); if (!En) return null;
    const c = En.near(x, z, 1400).filter(s => types.includes(s.type) && !used.has(s.id) && Math.hypot(s.x - x, s.z - z) >= 160);
    if (!c.length) return null;
    c.sort((a, b) => Math.hypot(a.x - x, a.z - z) - Math.hypot(b.x - x, b.z - z));
    return c[Math.floor(R() * Math.min(5, c.length))];
  }
  function itemFor(R, s, nome) {
    const gr = gradeAt(s.x, s.z), rar = gr >= 4 ? 3 : 2;
    if (R() < .55) { const k = pickR(R, Object.keys(WNAME)); return { slot: 'w', kind: k, name: WNAME[k] + ' de ' + nome, tier: gr, rar }; }
    const sl = pickR(R, ['a', 'h', 'g', 'b']); return { slot: sl, name: ({ a: 'Armadura', h: 'Elmo', g: 'Luvas', b: 'Botas' })[sl] + ' de ' + nome, tier: gr, rar };
  }
  /* cria um documento (ou null se já existe/sem lugar). src = origem estável (id do encontro + etiqueta) */
  function makeDoc(src, x, z, only) {
    const S = G(); if (!S) return null;
    const id = 'd' + hs(src).toString(36);
    if (S.docs.some(d => d.id === id)) return null;
    const R = RND('doc', src);
    const pool = TPL.map((t, i) => ({ t, i })).filter(o => only ? o.t.msg === only : !o.t.msg);
    const used = new Set(S.docs.map(d => d.pid));
    for (let n = 0; n < 6; n++) {
      const o = pickR(R, pool), nome = pickR(R, NOMES), s = placeFor(R, x, z, o.t.p, used) || placeFor(R, x, z, ['ruin', 'den', 'altar'], used);
      if (!s) continue;
      const it = itemFor(R, s, nome), lugar = phrase(s);
      const text = o.t.x.replace('{item}', it.name).replace('{em}', em(lugar)).replace('{de}', de(lugar)).replace('{ao}', ao(lugar)).replace('{lugar}', lugar).replace('{nome}', nome).replace('{nome}', nome);
      const d = { id, tpl: o.i, title: o.t.t, kind: o.t.k, text, nome, pid: s.id, px: Math.round(s.x), pz: Math.round(s.z), ptype: s.type, lugar, item: it, ch: o.t.ch || null, st: 0 };
      S.docs.push(d); return d;
    }
    return null;
  }
  function found(d, from) {
    if (!d) return;
    say('<b>[' + d.kind.toUpperCase() + ']</b> ' + from + ' Você achou: <b>' + d.title + '</b>. Leia no Diário [L], aba Contratos.', 7000);
    try { sfx('coin'); } catch (_) {}
    save();
  }
  function readDoc(id) {
    const S = G(), d = S && S.docs.find(x => x.id === id); if (!d) return;
    const act = d.st === 0 ? '<button class="btn hot" onclick="Gat508.take(\'' + id + '\');closeModal()">Seguir a pista (missão diversa)</button>' : d.st === 1 ? '<b style="color:#ffd070">Missão em andamento</b>' : '<b style="color:#6fe39a">✔ Cumprida</b>';
    let h = '<div class="guide93"><strong>' + d.title + '</strong><p style="font-size:13px;line-height:1.5;margin-top:6px;color:#dbe8f2;font-style:italic">“' + d.text + '”</p></div>';
    h += '<div class="sysline">Lugar: ' + d.lugar + '. Fica a ' + fmtN(Math.round(dist(player, { x: d.px, z: d.pz }))) + ' m de você.</div><div style="margin-top:8px">' + act + '</div>';
    openModal(d.title.toUpperCase(), h);
  }
  function take(id) {
    const S = G(), d = S && S.docs.find(x => x.id === id); if (!d || d.st) return;
    const gr = gradeAt(d.px, d.pz);
    const def = {
      id: 'doc_' + id, region: 'mundo_aberto', type: 'diversa', tag508: 'Missão diversa', custom508: true,
      title: 'Atrás de ' + d.item.name, giver: d.nome + ' · ' + d.title, desc: 'Vá até ' + d.lugar + '. A pista diz que ' + d.item.name + ' está lá.',
      rank: gr, gold: 100 + 80 * gr, xp: 120 + 90 * gr, rep: 5 + 2 * gr, trust: 6, rewardGold: 100 + 80 * gr, r508: 18,
      doc508: id, next508: d.ch ? 'mural' : null
    };
    d.st = 1; activate(def, { x: d.px, z: d.pz }); save();
  }
  function activate(def, target) {
    const S = G(), Qs = Q(); if (!S || !Qs) return false;
    const st = Qs.getState(); if (!st || st.active[def.id] || st.completed[def.id]) return false;
    Qs.CATALOG[def.id] = def; S.defs[def.id] = def;
    st.active[def.id] = { id: def.id, acceptedAt: Date.now(), progress: 0, max: 1, targetPos: { x: Math.round(target.x), z: Math.round(target.z) }, spawned: false, def490: def };
    st.tracked = def.id;
    try { bigText('NOVA MISSÃO: ' + def.title.toUpperCase(), 1800); sfx('gong'); } catch (_) {}
    say('<b>[' + (def.tag508 || 'MISSÃO').toUpperCase() + ']</b> ' + def.title + '. O marcador está no minimapa e no Diário [L].', 6000);
    save(); return true;
  }
  /* chegada a um destino "ir até lá" */
  function arrive(def) {
    const S = G(), d = def.doc508 && S.docs.find(x => x.id === def.doc508);
    if (d) {
      const it = makeItem(d.item.slot, d.item.tier, d.item.rar, d.item.kind); it.name = d.item.name; it.relic508 = true;
      try { fxRing(player.x, player.z, 0xffd76a, 3); floater(player.x, player.z, d.item.name, '#ffd76a', true); } catch (_) {}
      say('<b>[ACHADO]</b> Aqui está o que a pista prometia: <b>' + d.item.name + '</b>.', 6000);
      addItem(it); d.st = 2;
    } else if (def.arrive508) say('<b>[' + (def.tag508 || 'MISSÃO').toUpperCase() + ']</b> ' + def.arrive508, 7000);
    try { Q().completeQuest(def.id); } catch (e) { console.warn('gat508 completar', e); }
    save();
  }

  /* ---------------- cadeias: o que vem depois ---------------- */
  const BOSSBY = { neve: 'yeti', deserto: 'cactogig', pantano: 'homempeixe', vulcao: 'orcinho', floresta: 'cogufuria', cristal: 'golempedra' };
  const foeGr = (x, z) => Math.min(gradeAt(x, z), rk() + 2);
  function huntKinds(x, z, gr) {
    let k = null; try { k = wpick(worldKinds124(gr, x, z)).k; } catch (_) {}
    const b = (typeof biomeAt === 'function' && BOSSBY[biomeAt(x, z)]) || 'orcinho';
    return { boss: (typeof KINDS !== 'undefined' && KINDS[b]) ? b : (k || 'orcinho'), minion: k || 'orcinho' };
  }
  function huntDef(o) {
    const gr = Math.min(o.gr, rk() + 2), hk = huntKinds(o.x, o.z, gr);
    return Object.assign({
      region: 'mundo_aberto', type: 'emergent', biome: 'campos', bossKind: o.boss || hk.boss, bossScale: 1.4, minions: 3, minionKinds: [hk.minion, 'goblin'].filter(k => KINDS[k]),
      rank: gr, gold: 300 + 220 * gr, xp: 250 + 130 * gr, rep: 12 + 6 * gr, trust: 8, rewardGold: 300 + 220 * gr
    }, o.def);
  }
  function siteNear(x, z, types, minD, maxD, R) {
    const En = E(); if (!En) return null;
    const c = En.near(x, z, maxD).filter(s => types.includes(s.type) && Math.hypot(s.x - x, s.z - z) >= minD);
    if (!c.length) return null; return c[Math.floor((R || Math.random)() * c.length)];
  }
  function clanSite(x, z, rad, min) {
    const L3 = global.Living372; if (!L3 || !L3.site) return null; let best = null, bd = 1e12;
    for (let i = Math.round((x - rad) / 160); i <= Math.round((x + rad) / 160); i++) for (let j = Math.round((z - rad) / 160); j <= Math.round((z + rad) / 160); j++) {
      const p = L3.site(i, j); if (!p || !p.clan) continue; const d = Math.hypot(p.x - x, p.z - z); if (d >= min && d < bd) { bd = d; best = p; }
    }
    return best;
  }
  function nextStep(def) {
    const S = G(), key = def.next508; if (!key) return;
    const gr = gradeAt(player.x, player.z), R = RND('next', def.id);
    if (key === 'mural') {
      const cap = nearCapital(player.x, player.z), reg = REGION[cap.name] || 'aster', s = siteNear(player.x, player.z, ['den', 'ruin'], 220, 1100, R);
      const tx = s ? s.x : player.x + 150, tz = s ? s.z : player.z - 130, nome = pickR(R, NOMES);
      const def2 = huntDef({ gr: Math.min(9, gr + 1), x: tx, z: tz, def: {
        id: 'mural_' + def.id, region: reg, type: 'bounty', tag508: 'Contrato do mural', title: 'Caçada: o bando de ' + nome, giver: 'Mural de ' + cap.name,
        desc: 'A pista levou ao bando que vigiava o tesouro. O mural de ' + cap.name + ' paga pela cabeça do chefe, ' + nome + '. Ele está ' + (s ? em(phrase(s)) : 'ao norte') + '.',
        bossName: 'Chefe ' + nome, next508: null } });
      say('<b>[MURAL]</b> Um novo contrato apareceu no mural de <b>' + cap.name + '</b> por causa da sua pista.', 6000);
      activate(def2, { x: tx, z: tz });
    } else if (key === 'guilda') {
      const g = (typeof GUILDS !== 'undefined' ? GUILDS : []).filter(x => x.req <= rk()), G0 = g.length ? pickR(R, g) : { n: 'Caçadores Livres' }, s = siteNear(player.x, player.z, ['den', 'ruin'], 200, 900, R);
      const tx = s ? s.x : player.x - 160, tz = s ? s.z : player.z + 140;
      const def2 = huntDef({ gr, x: tx, z: tz, def: {
        id: 'guilda_' + def.id, tag508: 'Missão de guilda', title: 'Guilda ' + G0.n + ': limpar o ninho', giver: G0.n,
        desc: 'O gerente da guilda ' + G0.n + ' leu o selo da carga e quer sua ajuda: um bando se instalou ' + (s ? em(phrase(s)) : 'perto da estrada') + '. Depois, você pode entrar na guilda pela aba Guilda.',
        bossName: 'Capitão do Ninho', next508: null } });
      activate(def2, { x: tx, z: tz });
    } else if (key === 'cla') {
      const cn = (def.clan508 && def.clan508.n) || 'o clã', cs = clanSite(player.x, player.z, 600, 0) || { x: player.x, z: player.z };
      const s = siteNear(cs.x, cs.z, ['den', 'ruin', 'camp'], 160, 700, R);
      const tx = s ? s.x : cs.x + 160, tz = s ? s.z : cs.z - 140;
      const def2 = huntDef({ gr, x: tx, z: tz, def: {
        id: 'cla_' + def.id, tag508: 'Missão de clã', title: cn + ': expulsar os saqueadores', giver: cn,
        desc: 'O clã aceitou você. Agora pede ajuda: saqueadores atacam as trilhas ' + (s ? 'perto ' + de(phrase(s)) : 'ao redor') + '. Vença-os e ganhe +10% de ataque físico por 5 minutos.',
        bossName: 'Chefe dos Saqueadores', next508: null, reward508: 'clatk' } });
      activate(def2, { x: tx, z: tz });
    } else if (key === 'cla_duelo') {
      const cn = def.clanName508 || 'o clã', s = siteNear(def.tx508, def.tz508, ['den', 'ruin'], 150, 800, R);
      const tx = s ? s.x : def.tx508 + 150, tz = s ? s.z : def.tz508;
      const def2 = huntDef({ gr, x: tx, z: tz, def: {
        id: 'cla2_' + def.id, tag508: 'Missão de clã', title: cn + ': a honra do clã', giver: cn,
        desc: 'Depois do duelo, ' + cn + ' pede mais uma prova: expulsar quem rouba as trilhas do clã. Vença e ganhe +10% de ataque físico por 5 minutos.',
        bossName: 'Rival do Clã', next508: null, reward508: 'clatk' } });
      activate(def2, { x: tx, z: tz });
    }
  }

  /* ---------------- 2) pontos vivos ---------------- */
  const LIVE = ['camp', 'carcass', 'chest', 'altar'];
  const isLive = s => LIVE.includes(s.type) && (hs('live' + s.id) % 100) < 36;
  const scenes = new Map();
  const BAND = ['goblin', 'orcinho', 'gobArcher118'];
  function mkNpc(x, z, name, o) {
    o = o || {};
    const R = RND('npc', name, Math.round(x), Math.round(z));
    const pk = a => a[Math.floor(R() * a.length)];
    const m = makeChibi({ body: o.body || pk([0x6b4a2a, 0x3a5fd0, 0x8a2b4a, 0x2f7a4a, 0xb39a6a]), hair: o.hair || pk([0x222222, 0xc85a1e, 0xe8e8ff, 0x6b4a2a, 0xd8b060]), wep: 'none', gk: o.gk || pk(['Knight', 'Barbarian', 'Mage', 'Rogue']), scale: .9 });
    m.root.position.set(x, 0, z); m.root.userData.terrainRoot245 = true; scene.add(m.root);
    const n = { kind: 'traveler', m, x, z, face: o.face || 0, r: .45, name, short: name, col: '#d9c9a8', t: R() * 9, label: o.label || '', gone: false, gat508: true };
    npcs.push(n);
    if (o.lie) { m.root.rotation.set(-Math.PI / 2, 0, 0); m.root.position.y = .25; n.lie508 = true; }
    try { const P = global.Povo482; if (P && P.register && !o.lie) P.register(n, o.hunter ? { role: 'hunter', family: 'soldado', cls: 0, rank: 1, sex: o.sex || 'm', seed: hs(name), isCurrent: () => !n.gone && L.mode === 'world' } : { role: 'civil', sex: o.sex || 'm', seed: hs(name) }); } catch (_) {}
    return n;
  }
  function rmNpc(n) { if (!n) return; n.gone = true; try { scene.remove(n.m.root); } catch (_) {} const i = npcs.indexOf(n); if (i >= 0) npcs.splice(i, 1); }
  function mkFoes(x, z, kinds, n, gr, tag) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU + .4, fx = x + Math.cos(a) * 7, fz = z + Math.sin(a) * 7, k = kinds[i % kinds.length];
      try { const e = spawnKind(KINDS[k] ? k : 'orcinho', fx, fz, gr, { wild: true }); e.aggro = true; e.gat508 = tag; out.push(e); } catch (_) {}
    }
    return out;
  }
  const OUTS = ['bandidos', 'cacador', 'refugiado', 'duelo', 'quieto'];
  function weights(pv, S) {
    const r = rk(), lv = (run && run.level) || 1, w = { bandidos: 30 + (S.docs.length < 2 ? 12 : 0), cacador: 22, refugiado: lv < 25 ? 26 : 16, duelo: r >= 1 ? 16 : 0, quieto: 8 };
    if (S.done['refugiado'] || S.docs.length > 6) w.refugiado *= .3;
    if (run.clans372 && Object.keys(run.clans372.wins || {}).length) w.duelo *= 1.6;
    if (S.docs.some(d => d.st === 1)) { w.bandidos *= .5; w.cacador *= .5; }
    for (const o of OUTS) { w[o] *= Math.pow(.15, (pv.seen[o] || 0)); const rec = S.last.filter(q => q === o).length; w[o] *= Math.pow(.6, rec); }
    return w;
  }
  function rollOutcome(s, pv, S) {
    const R = RND('pv', s.id, pv.visits), w = weights(pv, S), tot = OUTS.reduce((a, o) => a + w[o], 0);
    let t = R() * tot; for (const o of OUTS) { t -= w[o]; if (t < 0) return o; } return 'quieto';
  }
  function liveTick() {
    const S = G(), En = E(); if (!S || !En || !inWorld()) return;
    for (const s of En.near(player.x, player.z, 100)) {
      if (!isLive(s) || scenes.has(s.id) || Math.hypot(s.x - player.x, s.z - player.z) > 62) continue;
      const pv = S.pv[s.id] || (S.pv[s.id] = { visits: 0, seen: {} });
      pv.visits++; const out = global.Gat508.force || rollOutcome(s, pv, S); global.Gat508.force = null;
      pv.seen[out] = (pv.seen[out] || 0) + 1; pv.last = out; S.last.push(out); if (S.last.length > 3) S.last.shift();
      const sc = { s, out, npcs: [], foes: [], done: false }; scenes.set(s.id, sc);
      try { buildScene(sc, S); } catch (e) { console.warn('gat508 cena', e); }
      save();
    }
    for (const [id, sc] of [...scenes]) {
      const d = Math.hypot(sc.s.x - player.x, sc.s.z - player.z);
      if (d > 170 || L.mode !== 'world') { for (const n of sc.npcs) rmNpc(n); scenes.delete(id); continue; }
      sceneTick(sc, S);
    }
  }
  function buildScene(sc, S) {
    const s = sc.s, gr = foeGr(s.x, s.z), a0 = s.ry + 2, ox = s.x + Math.cos(a0) * 8, oz = s.z + Math.sin(a0) * 8;
    if (sc.out === 'bandidos') {
      sc.foes = mkFoes(s.x, s.z, BAND, 3 + (gr >= 3 ? 1 : 0), gr, s.id);
      say('<b>[ENCONTRO]</b> Bandidos montaram guarda aqui. O chefe carrega uma carta.', 5000);
    } else if (sc.out === 'cacador') {
      const n = mkNpc(ox, oz, 'Caçador de tesouros', { lie: true, label: 'F · REVISTAR O CAÇADOR MORTO', body: 0x4a3b2a });
      n.use = () => {
        if (sc.done) return; sc.done = true; n.label = ''; n.kind = 'deco';
        const d = makeDoc(s.id + ':cacador:' + S.pv[s.id].visits, s.x, s.z);
        if (d) found(d, 'No bolso do caçador morto,'); else say('<b>[ACHADO]</b> O caçador não tinha mais nada de útil.', 4000);
      };
      sc.npcs.push(n); say('<b>[ENCONTRO]</b> Um caçador de tesouros jaz aqui, morto há pouco.', 5000);
    } else if (sc.out === 'refugiado') {
      const n = mkNpc(ox, oz, 'Refugiado doente', { label: 'F · FALAR COM O REFUGIADO', face: Math.atan2(s.x - ox, s.z - oz) });
      n.use = () => refugeeTalk(sc, n);
      sc.npcs.push(n); say('<b>[ENCONTRO]</b> Um refugiado doente pede ajuda perto do fogo.', 5000);
    } else if (sc.out === 'duelo') {
      const L3 = global.Living372, cl = L3 && L3.clans ? L3.clans.filter(c => c.bio.includes(biomeAt(s.x, s.z)) && c.ks.every(k => KINDS[k])) : [];
      const A = cl.length ? cl[hs(s.id) % cl.length] : { id: 'x', n: 'Clã do Norte', ks: ['orcinho', 'goblin'] }, B = cl.length > 1 ? cl[(hs(s.id) + 1) % cl.length] : { id: 'y', n: 'Clã do Sul', ks: ['goblin', 'orcinho'] };
      sc.clans = [A, B];
      const nA = mkNpc(s.x - 5, s.z + 8, 'Lutador: ' + A.n, { hunter: true, label: 'F · APOIAR ' + A.n.toUpperCase(), face: Math.PI / 2 }), nB = mkNpc(s.x + 1, s.z + 8, 'Lutador: ' + B.n, { hunter: true, label: 'F · APOIAR ' + B.n.toUpperCase(), face: -Math.PI / 2 });
      nA.use = () => duelChoose(sc, 0, S); nB.use = () => duelChoose(sc, 1, S);
      sc.npcs.push(nA, nB); say('<b>[ENCONTRO]</b> Dois clãs disputam este lugar: ' + A.n + ' e ' + B.n + '. Escolha um lado.', 6000);
    }
  }
  function sceneTick(sc, S) {
    if (sc.out === 'bandidos' && !sc.done && sc.foes.length && sc.foes.every(e => e.dead || !enemies.includes(e))) {
      sc.done = true; const d = makeDoc(sc.s.id + ':band:' + S.pv[sc.s.id].visits, sc.s.x, sc.s.z);
      if (d) found(d, 'O chefe dos bandidos carregava uma carta.'); save();
    }
  }
  function refugeeTalk(sc, n) {
    speech153(n, 'Estou doente e perdi minha gente. Há um clã nesta região. Se você me levar até lá, terei abrigo.', 'Refugiado');
    const cs = clanSite(sc.s.x, sc.s.z, 1400, 120);
    let h = '<div class="guide93"><strong>Refugiado doente</strong><p style="font-size:13px;line-height:1.45;margin-top:6px;color:#dbe8f2">“Febre e fome desde a Fenda. Um clã vive ' + (cs ? 'ao ' + dirOf(cs.x - sc.s.x, cs.z - sc.s.z) + ' daqui' : 'nesta região') + '. Leve-me, por favor.”</p></div>';
    h += '<div style="display:flex;flex-direction:column;gap:8px;margin-top:10px"><button class="btn hot" onclick="Gat508.refugee(\'' + sc.s.id + '\');closeModal()">Aceitar: levar o refugiado ao clã</button><button class="btn" onclick="closeModal()">Seguir viagem</button></div>';
    openModal('REFUGIADO NA ESTRADA', h);
  }
  function refugee(id) {
    const S = G(), sc = scenes.get(id), s = sc ? sc.s : E().site(...id.split(',').map(Number)); if (!s) return;
    const cs = clanSite(s.x, s.z, 1400, 120) || { x: s.x + 220, z: s.z - 180, clan: { n: 'o clã da estrada', id: 'x' } };
    const def = { id: 'ref_' + hs(id + (S.pv[id] ? S.pv[id].visits : 0)).toString(36), region: 'mundo_aberto', type: 'diversa', tag508: 'Missão diversa', custom508: true, rank: gradeAt(s.x, s.z),
      title: 'Levar o refugiado a ' + cs.clan.n, giver: 'Refugiado doente', desc: 'O refugiado não aguenta andar sozinho. Leve-o até o acampamento de ' + cs.clan.n + ', ao ' + dirOf(cs.x - s.x, cs.z - s.z) + ' dali. O clã dá uma bênção em troca.',
      gold: 140, xp: 160, rep: 8, trust: 8, rewardGold: 140, r508: 26, arrive508: 'O clã acolhe o refugiado e abençoa você: 15% menos dano mágico por 5 minutos.', next508: 'cla', clan508: { id: cs.clan.id, n: cs.clan.n }, reward508: 'bless' };
    if (sc && sc.npcs[0]) { sc.npcs[0].label = ''; sc.npcs[0].kind = 'deco'; }
    S.done['refugiado'] = 1; activate(def, { x: cs.x, z: cs.z });
  }
  function duelChoose(sc, side, S) {
    if (sc.chosen) return; sc.chosen = true;
    const mine = sc.clans[side], other = sc.clans[1 - side];
    for (const n of sc.npcs) { n.label = ''; n.kind = 'deco'; }
    const s = sc.s, gr = gradeAt(s.x, s.z);
    const def = huntDef({ gr, x: s.x, z: s.z, boss: other.ks[0], def: {
      id: 'duelo_' + hs(s.id + S.pv[s.id].visits).toString(36), tag508: 'Missão diversa', title: 'Duelo de clãs: apoiar ' + mine.n, giver: mine.n,
      desc: 'Você tomou partido de ' + mine.n + ' contra ' + other.n + '. Derrote os lutadores do outro clã aqui mesmo.', bossName: 'Campeão do ' + other.n, minions: 2, minionKinds: other.ks.filter(k => KINDS[k]),
      next508: 'cla_duelo', clanName508: mine.n, tx508: Math.round(s.x), tz508: Math.round(s.z) } });
    activate(def, { x: s.x, z: s.z });
  }

  /* ---------------- 3) eventos presenciados ---------------- */
  let guardEv = null, lastWit = -1e9, lastMsg = -1e9; const cartSeen = new WeakMap();
  function witnessTick() {
    const S = G(); if (!S || !inWorld()) return;
    const now = performance.now();
    /* carroça atacada (Civic343): quando o ataque é vencido perto de você, o mercador oferece uma missão */
    const C = global.Civic343;
    if (C && C.wagons) for (const w of C.wagons) {
      const pd = Math.hypot(w.x - player.x, w.z - player.z), prev = cartSeen.get(w);
      if (w.amb && pd < 90 && !prev) cartSeen.set(w, 'seen');
      if (!w.amb && prev === 'seen' && !w.wreck && w.hp > 0 && pd < 55 && !w.gat508) { w.gat508 = 1; setTimeout(() => cartOffer(w), 2200); lastWit = now; }
    }
    /* monstro contra guardas, perto de uma Capital */
    if (guardEv) { guardTick(); return; }
    if (now - lastWit < 150000) return;
    const cap = nearCapital(player.x, player.z); if (!cap || cap.d < 180 || cap.d > 520) return;
    const cx = Math.floor(player.x / 220), cz = Math.floor(player.z / 220), day = typeof gameDay198 === 'function' ? gameDay198() : 0, k = cx + ',' + cz + ',' + day;
    const forced = global.Gat508.forceGuard;
    if (S.wit[k] && !forced) return; S.wit[k] = 1;
    if (RND('guard', cx, cz, day)() > .3 && !forced) return;
    global.Gat508.forceGuard = false; lastWit = now; startGuards(cap);
  }
  function cartOffer(w) {
    const S = G(); if (!S || !inWorld()) return;
    const dest = w.dest || cityAt(player.x, player.z).c, id = 'cart_' + hs(dest.name + Math.floor(w.x / 50)).toString(36);
    if (S.defs[id]) return;
    let h = '<div class="guide93"><strong>Mercador da estrada</strong><p style="font-size:13px;line-height:1.45;margin-top:6px;color:#dbe8f2">“Você me salvou. A carga tem um selo que só a guilda de ' + safeText(dest.name) + ' pode abrir. Leve-o até lá por mim?”</p></div>';
    h += '<div style="display:flex;flex-direction:column;gap:8px;margin-top:10px"><button class="btn hot" onclick="Gat508.cart(\'' + id + '\',' + Math.round(dest.x) + ',' + Math.round(dest.z) + ',\'' + safeText(dest.name).replace(/'/g, '') + '\');closeModal()">Aceitar: entregar o selo em ' + safeText(dest.name) + '</button><button class="btn" onclick="closeModal()">Seguir viagem</button></div>';
    openModal('MERCADOR DA ESTRADA', h);
  }
  function cart(id, x, z, name) {
    const S = G(); if (S.defs[id]) return;
    const gr = gradeAt(player.x, player.z);
    activate({ id, region: 'mundo_aberto', type: 'diversa', tag508: 'Missão diversa', custom508: true, rank: gr, title: 'Entregar o selo em ' + name, giver: 'Mercador da estrada',
      desc: 'Leve o selo lacrado até o centro de ' + name + '. A guilda de lá espera a carga.', gold: 120 + 60 * gr, xp: 140 + 80 * gr, rep: 6 + 2 * gr, trust: 8, rewardGold: 120 + 60 * gr, r508: 60,
      arrive508: 'O gerente da guilda abre o selo, lê a carta e quer falar com você.', next508: 'guilda' }, { x, z });
  }
  function startGuards(cap) {
    const a = (player.face || 0), x = player.x + Math.sin(a) * 62, z = player.z + Math.cos(a) * 62;
    try { if (!worldFree(x, z, 2) || inWaterSafe(x, z)) return false; } catch (_) {}
    const gr = foeGr(x, z), mk = Math.min(9, gr + 1);
    let kind = 'orcinho'; try { kind = wpick(worldKinds124(mk, x, z)).k; } catch (_) {}
    let mon = null; try { mon = spawnKind(kind, x, z, mk, { wild: true }); mon.hp *= 1.8; mon.maxhp *= 1.8; mon.name = 'Fera da estrada'; mon.aggro = false; mon.gat508 = 'guard'; } catch (_) { return false; }
    const g1 = mkNpc(x - 4, z - 3, 'Guarda de ' + cap.name, { hunter: true, face: .6 }), g2 = mkNpc(x + 4, z - 3, 'Guarda de ' + cap.name, { hunter: true, sex: 'f', face: -.6 });
    guardEv = { cap, mon, guards: [g1, g2], t: 0, hit: 0, state: 'fight', x, z };
    say('<b>[ESTRADA]</b> Perto de ' + cap.name + ', guardas lutam contra uma fera. Ajude-os antes que caiam.', 7000); try { sfx('gong'); } catch (_) {}
    return true;
  }
  function guardTick() {
    const g = guardEv; g.t += .5;
    const pd = Math.hypot(g.x - player.x, g.z - player.z);
    if (g.state === 'fight') {
      const alive = g.mon && !g.mon.dead && enemies.includes(g.mon);
      if (alive) {
        g.hit -= .5; if (g.hit <= 0 && g.mon.hp > g.mon.maxhp * .4) { g.hit = 1.5; try { fxLine([{ x: g.guards[0].x, z: g.guards[0].z }, { x: g.mon.x, z: g.mon.z }], 0xffd080); hurtEnemy(g.mon, Math.max(1, Math.round(g.mon.maxhp * .01)), g.guards[0].x, g.guards[0].z); } catch (_) {} }
        if (!g.mon.aggro && pd < 20) g.mon.aggro = true;
        if (g.t > 70) { g.state = 'fail'; for (const n of g.guards) { n.m.root.rotation.set(-Math.PI / 2, 0, 0); n.m.root.position.y = .25; n.kind = 'deco'; } g.mon.aggro = true; say('<b>[ESTRADA]</b> A fera derrubou os guardas. Eles não resistiram.', 5000); }
      } else {
        g.state = 'won'; g.t = 0;
        const c = g.guards[0]; c.x = player.x + Math.sin(player.face || 0) * 3; c.z = player.z + Math.cos(player.face || 0) * 3; c.m.root.position.set(c.x, 0, c.z);
        setTimeout(() => guardOffer(g), 1800);
      }
    }
    if (pd > 240 || (g.state !== 'fight' && g.t > 120)) { for (const n of g.guards) rmNpc(n); guardEv = null; }
  }
  function guardOffer(g) {
    if (!inWorld()) return;
    const cap = g.cap; let h = '<div class="guide93"><strong>Capitão da Guarda de ' + cap.name + '</strong><p style="font-size:13px;line-height:1.45;margin-top:6px;color:#dbe8f2">“Sem você, a fera nos pegava. Havia um bando soltando essas feras na estrada. Venha à ' + cap.name + ' contar ao comandante.”</p></div>';
    h += '<div style="display:flex;flex-direction:column;gap:8px;margin-top:10px"><button class="btn hot" onclick="Gat508.guards(' + Math.round(cap.x) + ',' + Math.round(cap.z) + ',\'' + cap.name + '\');closeModal()">Aceitar: relatar em ' + cap.name + '</button><button class="btn" onclick="closeModal()">Seguir viagem</button></div>';
    openModal('GUARDA DA ESTRADA', h);
  }
  function guards(x, z, name) {
    const gr = gradeAt(player.x, player.z);
    activate({ id: 'guard_' + hs(name + Math.floor(player.x / 100) + ',' + Math.floor(player.z / 100)).toString(36), region: 'mundo_aberto', type: 'diversa', tag508: 'Missão diversa', custom508: true, rank: gr, title: 'Relatar aos guardas de ' + name,
      giver: 'Capitão da Guarda', desc: 'Conte ao comandante de ' + name + ' sobre a fera da estrada. Vá ao centro da cidade.', gold: 120 + 60 * gr, xp: 140 + 80 * gr, rep: 6 + 2 * gr, trust: 10, rewardGold: 120 + 60 * gr, r508: 60,
      arrive508: 'O comandante agradece e abre um contrato no mural contra o bando que soltava as feras.', next508: 'mural' }, { x, z });
  }

  /* ---------------- 4) mensageiro ---------------- */
  let messenger = null;
  function milestoneTick() {
    const S = G(); if (!S || !inWorld()) return;
    const r = rk(); if (S.rank < 0) S.rank = r; else if (r > S.rank) { S.rank = r; S.pend.push('rank'); save(); }
    const en = run.enc502 || {};
    for (const k in en) if (!S.dens[k]) { S.dens[k] = 1; const ps = k.split(',').map(Number), s = E() && E().site(ps[0], ps[1]); if (s && s.type === 'den') { S.pend.push('den'); save(); } }
    if (messenger) { msgTick(); return; }
    if (!S.pend.length || performance.now() - lastMsg < 90000) return;
    if (cityAt(player.x, player.z).d < 120) return;
    startMessenger(S.pend[0]);
  }
  function startMessenger(kind) {
    const a = (player.face || 0) + Math.PI, x = player.x + Math.sin(a) * 70, z = player.z + Math.cos(a) * 70;
    const n = mkNpc(x, z, 'Mensageiro', { sex: 'm' });
    messenger = { n, kind, t: 0 }; n.msg508 = true;
    say('<b>[ESTRADA]</b> Um mensageiro corre atrás de você, chamando.', 5000);
  }
  function msgTick() {
    const m = messenger, n = m.n; m.t += .5;
    const dx = player.x - n.x, dz = player.z - n.z, d = Math.hypot(dx, dz);
    if (d > 3.2) { const st = Math.min(d - 3, 3); n.x += dx / d * st; n.z += dz / d * st; n.face = Math.atan2(dx, dz); n.m.root.position.set(n.x, 0, n.z); n.m.root.rotation.y = n.face; }
    else if (!n.label && n.kind !== 'deco') {
      n.label = 'F · RECEBER A CARTA'; speech153(n, 'Viajante! Tenho uma carta para você.', 'Mensageiro');
      n.use = () => {
        const S = G(), kind = m.kind; S.pend.shift();
        const d2 = makeDoc('msg:' + kind + ':' + S.rank + ':' + Object.keys(S.dens).length, player.x, player.z, kind);
        if (d2) found(d2, 'O mensageiro entregou uma carta.'); else say('<b>[MENSAGEIRO]</b> A carta estava em branco. Nenhum lugar novo a apontar.', 5000);
        n.label = ''; n.kind = 'deco'; lastMsg = performance.now(); setTimeout(() => { rmNpc(n); if (messenger === m) messenger = null; }, 2500); save();
      };
    }
    if (m.t > 200 && !n.label) { rmNpc(n); messenger = null; lastMsg = performance.now(); }
  }

  /* ---------------- ticks, destinos e recompensas ---------------- */
  function arriveTick() {
    const S = G(), Qs = Q(); if (!S || !Qs || !inWorld()) return;
    const st = Qs.getState(); if (!st) return;
    for (const id of Object.keys(S.defs)) if (!Qs.CATALOG[id]) Qs.CATALOG[id] = S.defs[id];
    for (const [id, act] of Object.entries(st.active)) {
      const def = Qs.CATALOG[id]; if (!def || !def.custom508 || !act.targetPos) continue;
      if (Math.hypot(player.x - act.targetPos.x, player.z - act.targetPos.z) < (def.r508 || 18)) arrive(def);
    }
    for (const id of Object.keys(st.completed)) {
      if (S.done[id]) continue; const def = S.defs[id]; S.done[id] = 1; if (!def) continue;
      if (def.reward508 === 'bless' && run.clans372) run.clans372.bless = 300;
      if (def.reward508 === 'clatk' && run.clans372) { run.clans372.attack = 300; try { refreshStats(); } catch (_) {} }
      if (def.next508) nextStep(def);
      save();
    }
  }
  setInterval(() => { try { arriveTick(); } catch (e) { console.warn('gat508 a', e); } }, 700);
  setInterval(() => { try { liveTick(); witnessTick(); milestoneTick(); } catch (e) { console.warn('gat508 b', e); } }, 500);

  /* ---------------- diário [L] ---------------- */
  function diaryRows() {
    const S = G(); if (!S || !S.docs.length) return '';
    let h = '<div class="sec">CARTAS E DIÁRIOS (' + S.docs.length + ')</div>';
    for (const d of S.docs) {
      const stt = d.st === 2 ? '✔ cumprida' : d.st === 1 ? 'missão em andamento' : 'ainda não lida';
      h += row('<b>' + d.title + '</b> · ' + d.kind, d.text.slice(0, 90) + '… <small>(' + stt + ')</small>', btn('Ler', 'gat508read', d.id, true, d.st === 0 ? 'hot' : ''));
    }
    return h;
  }
  /* chamado por encontros502 depois de vasculhar: chance fixa por encontro (semente) de achar um documento */
  const LOOT_PCT = { camp: 45, carcass: 55, ruin: 45, den: 70, chest: 40 };
  const LOOT_FROM = { camp: 'Entre as coisas do acampamento,', carcass: 'Nos restos do viajante,', ruin: 'No baú da ruína,', den: 'No baú do covil,', chest: 'No baú escondido,' };
  function onLoot(s) {
    if ((rh(Math.round(s.x), Math.round(s.z), 510) % 100) >= (LOOT_PCT[s.type] || 0)) return;
    const d = makeDoc(s.id + ':loot', s.x, s.z); if (d) found(d, LOOT_FROM[s.type]);
  }
  global.Gat508 = { onLoot, TPL, makeDoc, found, readDoc, take, refugee, cart, guards, diaryRows, scenes, isLive, OUTS, rollOutcome, force: null, forceGuard: false, activate, nextStep, startGuards, startMessenger, nearCapital, state: () => ({ guardEv, messenger }) };
})(window);
