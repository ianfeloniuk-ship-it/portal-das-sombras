/* v659 (Ian, 28/10/2026): Ferimentos e Mutagênicos — PDF "Primeva — Ferimentos e Mutagênicos (proposta) v1" aprovado,
   com as 14 respostas de Ian no chat (valem sobre o PDF):
   - V troca 1ª/3ª; cenas raras em 1ª. Voltar ao save devolve o membro (o estado fica no save, run.corpo659).
   - Só elite para cima decepa: elite 10, chefe 20, chefe de Fenda 30, dragão 40 (em 100); armadura vestida corta pela metade.
   - Duração por família: regeneração e pele dura são para sempre; frio, calor, veneno, ácido, visão e fôlego passam
     (Menor 1 dia, Maior 7 dias, Ancestral 30 dias — o Ancestral temporário é decisão do gerente, Ian revisa).
   - Carga do corpo começa em 1 e vai até 14 (+1 a cada 50 níveis). Menor não ocupa carga (só nas famílias para sempre: 1).
   - Mutagênico é item: qualquer um pode ter, compra e vende (Mira). Não depende da origem do Viajante.
   - Frio = Yetis e Dragão Gélido; regeneração = Lula do Vazio e Gosma Ancestral (sem criatura nova).
   - Ancestral não usa núcleo: só mais extratos (5). Mordida de vampiro ou lobisomem passa doença que vira mutação (Skyrim).
   - Próteses na Forja. Sangue e coto à mostra, com opção de menos sangue na ficha. Ninguém reage a mutações.
   CORPO   6 partes (cabeça, tronco, 2 braços, 2 pernas) com pontos próprios (base × vida máxima / 100), graus 0 a 5.
           O golpe que tira vida tira o mesmo tanto da parte acertada. Tipo do dano pelo atacante (corte, esmagamento,
           ácido, queimadura, congelamento, mordida).
   EFEITO  braço da arma −10/−25% de dano; sem a mão da arma, a arma passa para a outra com −20% até 20 acertos (Treino);
           perna −10/−25/−40/−60% de velocidade; tronco −10/−25% de Vigor máximo; cabeça grau 2 = visão borrada 5 s.
           Corte grau 2+ sangra 1 de vida a cada 5 s até a atadura; ácido queima 1 por segundo até lavar na água;
           mordida pode infeccionar (1 em 5): 1 de vida a cada 10 s até o álcool.
   CURA    grau 1 some em 1 hora do jogo; grau 2 com o item certo + 6 horas; grau 3 com o item + 2 dias (deixa cicatriz);
           médico (Mira) cura graus 1 a 3 por ouro. Mão, pé, braço ou perna perdidos: prótese (Forja) ou regeneração.
   GENES   extrato cai de criatura das 8 famílias (comum 1 em 10, elite 1 em 3, chefe sempre; Fenda vermelha dá forte);
           Menor na fogueira (1 extrato + álcool), Maior na bancada (1 extrato forte + álcool), Ancestral (5 fortes + álcool).
           Tomar: fora de combate. Toxicidade 0–100, cai 10 por hora do jogo; acima de 100 = rejeição (−30% da vida,
           o frasco se perde). Febre de 1 hora do jogo: −20% de Vigor máximo.
   CENA    só 3 momentos (1ª assimilação Maior/Ancestral de cada família, regenerar membro com Ancestral, perder membro = só
           tremor de 1 s); no máximo 1 cena por hora real. */
(function () {
  'use strict';
  if (typeof hurtPlayer !== 'function' || typeof update !== 'function' || !window.Surv437) return;
  const T = THREE, HOUR = 150, CHUNK = '[CORPO]';
  const PARTS = {
    cab: { n: 'Cabeça', base: 30, w: 10, limb: false },
    tro: { n: 'Tronco', base: 60, w: 34, limb: false },
    be: { n: 'Braço esquerdo', base: 40, w: 14, limb: 'arm', side: 'l', end: 'mão esquerda', all: 'braço esquerdo' },
    bd: { n: 'Braço direito', base: 40, w: 14, limb: 'arm', side: 'r', end: 'mão direita', all: 'braço direito' },
    pe: { n: 'Perna esquerda', base: 50, w: 14, limb: 'leg', side: 'l', end: 'pé esquerdo', all: 'perna esquerda' },
    pd: { n: 'Perna direita', base: 50, w: 14, limb: 'leg', side: 'r', end: 'pé direito', all: 'perna direita' }
  };
  const TYPES = {
    corte: { n: 'Corte', trata: 'Atadura de Ervas' }, esmag: { n: 'Esmagamento', trata: 'Tala' },
    acido: { n: 'Ácido', trata: 'água (lavar) e Unguento' }, queim: { n: 'Queimadura', trata: 'Unguento' },
    cong: { n: 'Congelamento', trata: 'fogueira ou Chá Térmico' }, mord: { n: 'Mordida', trata: 'Álcool Forte e Atadura' }
  };
  const GRADE = ['Inteiro', 'Arranhão', 'Ferida', 'Ferida grave', 'Mutilação', 'Perda do membro'];
  const FAM = {
    regen: { n: 'Regeneração', re: /Lula do Vazio|Gosma Ancestral/, perm: true, sinal: 'pele de outro tom e veias da criatura' },
    frio: { n: 'Frio', re: /Yeti|Gélido/, sinal: 'pelos grossos nos antebraços' },
    calor: { n: 'Calor', re: /Dragonete|Chifrudo|Vulcânico/, sinal: 'pele avermelhada e seca' },
    veneno: { n: 'Veneno', re: /Aranha|Vespa|Matriarca/, sinal: 'veias escuras no pescoço' },
    acido: { n: 'Ácido', re: /Gosma|Glub/, sinal: 'manchas verdes nas mãos' },
    pele: { n: 'Pele dura', re: /Escaravelho|Golem de Pedra|Gigante de Pedra/, perm: true, sinal: 'placas nos antebraços' },
    visao: { n: 'Visão e faro', re: /Lobo Sombrio|Lobo Fendido|Alfa da Matilha/, sinal: 'olhos que brilham no escuro' },
    folego: { n: 'Fôlego', re: /Sapo|Homem-Peixe/, sinal: 'guelras finas no pescoço' }
  };
  const FORCE = { menor: { n: 'Menor', tox: 20, load: 0, h: 24 }, maior: { n: 'Maior', tox: 40, load: 2, h: 168 }, ancestral: { n: 'Ancestral', tox: 70, load: 4, h: 720 } };
  const RANKF = { menor: 1, maior: 2, ancestral: 3 };
  const now = () => performance.now() / 1000;
  const S = window.Corpo659 = { PARTS, TYPES, FAM, FORCE };

  /* ---------- estado (vai junto no save) ---------- */
  function st() {
    if (typeof run === 'undefined' || !run) return null;
    const c = run.corpo659 || (run.corpo659 = { hh: 0, p: {}, genes: {}, tox: 0, fever: 0, first: {}, swap: 0, disease: null, lowGore: false, lastScene: 0 });
    for (const k in PARTS) if (!c.p[k]) c.p[k] = { hp: null, g: 0, t: 'corte', hit: 0, tr: 0, wash: true, inf: false, scar: false, pros: false, warn: false, regrow: 0 };
    return c;
  }
  S.state = st;
  const scale = () => Math.max(1, Math.round((player && player.maxhp || 100) / 100));
  const pmax = k => PARTS[k].base * scale();
  function partHp(c, k) { const p = c.p[k], m = pmax(k); if (p.hp == null || p.hp > m) p.hp = p.g >= 4 ? 0 : m; return p.hp; }
  function gradeOf(c, k) {
    const p = c.p[k]; if (p.g >= 4) return p.g;
    const m = pmax(k), lost = Math.round((m - partHp(c, k)) * 100 / m);
    return lost <= 0 ? 0 : lost <= 25 ? 1 : lost <= 50 ? 2 : 3;
  }
  const level = () => (typeof run !== 'undefined' && run && run.level) || 0;
  S.loadMax = () => Math.min(14, 1 + Math.floor(level() / 50));
  function loadOf(c, fam, f) { return f === 'menor' ? (FAM[fam].perm ? 1 : 0) : FORCE[f].load; }
  S.loadUsed = () => { const c = st(); let n = 0; if (!c) return 0; for (const k in c.genes) { const g = c.genes[k]; if (FAM[k]) n += loadOf(c, k, g.f); } return n; };
  const gene = fam => { const c = st(); const g = c && c.genes[fam]; return g ? RANKF[g.f] || 0 : 0; };
  S.gene = gene;

  /* ---------- quem bateu e com o quê ---------- */
  function atkName(e) { try { return e.name || (KINDS[e.kind] && KINDS[e.kind].n) || e.kind || '' } catch (_) { return '' } }
  function dtype(e) {
    const n = atkName(e) + ' ' + (e.kind || '');
    if (/Gosma|Glub|ácid|acid/i.test(n)) return 'acido';
    if (/Gélido|gelido|Gelo|Geada/.test(n)) return 'cong';
    if (/Lobo|lobo|Aranha|aranha|Raptor|raptor|Vampir|Lobisomem|Sapo|Homem-Peixe/.test(n)) return 'mord';
    if (/Golem|Yeti|Gigante|Ogro|Troll|Escaravelho|mace|hammer|Tanque/.test(n)) return 'esmag';
    if (/Drag|drag|Demônio|demon|Chifrudo|Vulc|Fogo|Brasa|fire/.test(n)) return 'queim';
    return 'corte';
  }
  function tierChance(e) {
    if (!e) return 0;
    const n = atkName(e);
    if (/Drag(ão|on)|dragao/i.test(n + ' ' + (e.kind || '')) && !/Dragonete/.test(n)) return 40;
    if (e.isBoss && typeof L !== 'undefined' && L.mode !== 'world') return 30;
    if (e.isBoss) return 20;
    if (e.elite) return 10;
    return 0;
  }
  function pickPart() { let tot = 0; for (const k in PARTS) tot += PARTS[k].w; let r = Math.random() * tot; for (const k in PARTS) { r -= PARTS[k].w; if (r <= 0) return k; } return 'tro'; }
  function famOf(e) { const n = atkName(e); for (const k in FAM) if (FAM[k].re.test(n)) return k; return null; }

  /* ---------- ferir uma parte ---------- */
  function wound(e, dmg) {
    const c = st(); if (!c || dmg <= 0 || player.dead) return;
    const k = pickPart(), P = PARTS[k], p = c.p[k];
    let t = dtype(e), d = dmg;
    const pele = gene('pele'); if (pele && d < [0, 30, 40, 50][pele] * scale()) return; /* pele dura: grau só sobe com golpe forte */
    if (pele >= 2 && t === 'corte') t = 'esmag';
    if (t === 'queim') { const g = gene('calor'); if (g >= 2 && !/Drag/.test(atkName(e))) return; if (g === 1) d = Math.round(d / 2); }
    if (t === 'cong') { const g = gene('frio'); d = Math.round(d * (100 - 20 * g) / 100); }
    if (t === 'mord' && /Aranha|Vespa/.test(atkName(e))) { const g = gene('veneno'); if (g >= 2) player.bleedT = 0; else if (g === 1) player.bleedT = (player.bleedT || 0) / 2; }
    if (d <= 0) return;
    const before = gradeOf(c, k);
    p.t = t; p.hit = c.hh; p.tr = 0; if (t === 'acido') p.wash = gene('acido') >= 2; if (t === 'corte' || t === 'mord') p.wash = true;
    if (p.g >= 4) { /* parte já mutilada: um golpe forte pode levar o membro inteiro */
      if (P.limb && p.g === 4 && sever(e, t)) lose(k, 5, e);
      return;
    }
    let hp = partHp(c, k) - d;
    if (hp <= 0) {
      if (P.limb && sever(e, t)) { p.hp = 0; lose(k, 4, e); return; }
      hp = 1; /* comum nunca decepa; cabeça e tronco ficam no grau 3 */
    }
    p.hp = hp;
    const g = gradeOf(c, k);
    if (t === 'mord' && g >= 2 && !p.inf && Math.random() < .2) { p.inf = true; toast('<b>' + CHUNK + '</b> A mordida no ' + P.n.toLowerCase() + ' infeccionou. Álcool Forte limpa.', 4500); }
    try { if (window.Doenca681) Doenca681.rolar(c, e, g, atkName(e)); } catch (_) { } /* v681: contágio pelas regras do documento Doença e Transformação */
    if (k === 'cab' && g >= 2 && before < 2) blur(5);
    if (g === 3 && !p.warn && P.limb) { p.warn = true; toast('<b>' + CHUNK + '</b> ' + P.n + ' em ferida grave. Um golpe forte de elite pode arrancar a ' + P.end + '.', 4500); }
    if (g >= 2 && before < 2) hudDirty = true;
    hudDirty = true;
  }
  function sever(e, t) {
    let ch = tierChance(e); if (!ch) return false;
    if (t === 'cong') return false;
    if (t === 'queim' && ch < 40) return false; /* queimadura só arranca com sopro de dragão */
    try { if (run.equip && run.equip.a) ch = Math.floor(ch / 2); } catch (_) { }
    return Math.random() * 100 < ch;
  }
  function lose(k, g, e) {
    const c = st(), P = PARTS[k], p = c.p[k];
    p.g = g; p.hp = 0; p.pros = false; p.regrow = 0; p.inf = false;
    const what = g === 5 ? P.all : P.end, esmag = p.t === 'esmag';
    try { shake(.9); sfx('hurt'); } catch (_) { }
    try { const v = $('vig'); v.style.boxShadow = 'inset 0 0 160px rgba(120,0,10,.85)'; setTimeout(() => { v.style.boxShadow = 'inset 0 0 120px rgba(255,0,40,0)'; }, 1000); } catch (_) { }
    if (!c.lowGore) try { fxBurst(player.x, 1.2, player.z, 0x8a0010, 14, 3); } catch (_) { }
    toast('<b>' + CHUNK + '</b> ' + (esmag ? 'Esmagaram sua ' : 'Você perdeu a ') + what + '. Prótese na Forja ou mutagênico de Regeneração.', 7000);
    if (k === 'bd' && !c.swap) { c.swap = 1; toast('<b>' + CHUNK + '</b> A arma passou para a mão esquerda: −20% de dano até 20 acertos (Treino 0/20).', 6000); }
    hudDirty = true; try { saveRun(); } catch (_) { }
  }
  S.lose = lose;

  /* ---------- efeitos no jogo ---------- */
  const PENA = [0, 0, 10, 25, 25, 25], PENL = [0, 0, 10, 25, 40, 60];
  function armPen(c) {
    const r = c.p.bd, l = c.p.be;
    if (r.g >= 4) { /* a arma está na mão esquerda */
      let pen = PENA[gradeOf(c, 'be')] || 0; if (l.g >= 4) pen = l.pros ? 30 : 60;
      if (c.swap && c.swap <= 20) pen += 20;
      return Math.min(80, pen);
    }
    return PENA[gradeOf(c, 'bd')] || 0;
  }
  function legPen(c) { let m = 0; for (const k of ['pe', 'pd']) { const p = c.p[k]; let v = PENL[gradeOf(c, k)] || 0; if (p.pros && p.g >= 4) v = Math.floor(v / 2); m = Math.max(m, v); } return m; }
  function feverOn(c) { return c.fever > c.hh; }
  S.armPen = () => { const c = st(); return c ? armPen(c) : 0; };
  S.legPen = () => { const c = st(); return c ? legPen(c) : 0; };

  const H0 = hurtPlayer;
  hurtPlayer = function () {
    const hp0 = player ? player.hp : 0, atk = typeof curAtk !== 'undefined' ? curAtk : null;
    const r = H0.apply(this, arguments);
    try { if (player && !player.dead && atk && hp0 > player.hp) wound(atk, Math.round(hp0 - player.hp)); } catch (err) { console.warn('corpo659 wound', err); }
    return r;
  };
  const MS0 = movementSpeed;
  movementSpeed = function (v) { const r = MS0.apply(this, arguments); try { const c = st(); if (c) { const pen = legPen(c); if (pen) return r * (100 - pen) / 100; } } catch (_) { } return r; };
  if (typeof vigorMax281 === 'function') {
    const VM0 = vigorMax281;
    vigorMax281 = function () {
      const v = VM0.apply(this, arguments);
      try { const c = st(); if (!c) return v; let pen = [0, 0, 10, 25, 25, 25][gradeOf(c, 'tro')] || 0; if (feverOn(c)) pen += 20; return pen ? Math.max(1, Math.round(v * (100 - pen) / 100)) : v; } catch (_) { return v; }
    };
  }
  const HE0 = hurtEnemy;
  hurtEnemy = function (e, amt, sx, sz, o) {
    try {
      const mine = (o && (o.fromPlayer || o.basicClass != null)) || (player && sx === player.x && sz === player.z);
      if (mine && Number.isFinite(amt) && amt > 0) {
        const c = st(); if (c) {
          const pen = armPen(c); if (pen) amt = amt * (100 - pen) / 100;
          if (c.p.bd.g >= 4 && c.swap && c.swap <= 20) { c.swap++; if (c.swap > 20) toast('<b>' + CHUNK + '</b> Treino 20/20: a mão esquerda aprendeu a lutar. Sem a perda de −20%.', 5000); }
        }
      }
    } catch (_) { }
    return HE0.call(this, e, amt, sx, sz, o);
  };

  /* ---------- extratos (caem do corpo da criatura) ---------- */
  const KE0 = killEnemy;
  killEnemy = function (e) {
    const was = e && !e.dead;
    const r = KE0.apply(this, arguments);
    try {
      if (was && e && !e.ally && !e.friendly217) {
        const fam = famOf(e); if (fam) {
          const red = typeof L !== 'undefined' && L.gate && L.gate.red;
          let item = null;
          if (e.isBoss) item = 'extrato_' + fam + '_forte';
          else if (e.elite) { if (Math.random() < 1 / 3) item = 'extrato_' + fam + '_forte'; }
          else if (Math.random() < .1) item = 'extrato_' + fam + (red ? '_forte' : '');
          if (item && Surv437.add(item, 1, true)) toast('<b>' + CHUNK + '</b> Você colheu ' + Surv437.ITEMS[item].n + ' do corpo de ' + atkName(e) + '.', 4000);
        }
      }
    } catch (err) { console.warn('corpo659 extrato', err); }
    return r;
  };

  /* ---------- itens e receitas (inventário de sobrevivência) ---------- */
  const IT = Surv437.ITEMS, RC = Surv437.RECIPES;
  const addItem = (id, o) => { if (!IT[id]) IT[id] = o; };
  if (IT.atadura && !/corte/.test(IT.atadura.d)) IT.atadura.d += ' Trata todo corte e mordida de grau 2 e 3.'; /* parte ligada: a atadura agora também fecha ferida */
  addItem('tala', { n: 'Tala', w: .4, cat: 'food', use658: true, d: 'Imobiliza osso quebrado. Trata todo esmagamento de grau 2 e 3.' });
  addItem('unguento', { n: 'Unguento', w: .3, cat: 'food', use658: true, d: 'Pomada de ervas e resina. Trata toda queimadura e todo ácido já lavado, de grau 2 e 3.' });
  addItem('alcool_forte', { n: 'Álcool Forte', w: .5, cat: 'food', use658: true, d: 'Destilado de frutas. Limpa infecção e trata mordida. Base dos mutagênicos.' });
  for (const f in FAM) {
    addItem('extrato_' + f, { n: 'Extrato de ' + FAM[f].n, w: .2, cat: 'mat', d: 'Glândula de criatura comum. Base do mutagênico Menor de ' + FAM[f].n + '.' });
    addItem('extrato_' + f + '_forte', { n: 'Extrato Forte de ' + FAM[f].n, w: .3, cat: 'mat', d: 'Glândula de elite ou chefe. Base do Maior (1) e do Ancestral (5) de ' + FAM[f].n + '.' });
    for (const fo in FORCE) addItem('mut_' + f + '_' + fo, { n: 'Mutagênico ' + FORCE[fo].n + ' de ' + FAM[f].n, w: .3, cat: 'food', use658: true, mut659: [f, fo], d: mutDesc(f, fo) });
  }
  function mutDesc(f, fo) {
    const dur = FAM[f].perm ? 'para sempre' : fo === 'menor' ? '1 dia do jogo' : fo === 'maior' ? '7 dias do jogo' : '30 dias do jogo';
    const ef = {
      regen: ['ferida fecha na metade do tempo', 'membro perdido volta em 3 dias do jogo', 'membro perdido volta em 1 hora do jogo'],
      frio: ['congelamento 20% mais fraco', 'congelamento 40% mais fraco', 'congelamento 60% mais fraco'],
      calor: ['queimadura na metade', 'imune a queimadura comum', 'imune a queimadura comum'],
      veneno: ['sangramento de picada na metade', 'imune a picada de aranha e vespa', 'imune a picada de aranha e vespa'],
      acido: ['ácido na pele 1 a cada 2 s', 'ácido não passa da pele', 'ácido não passa da pele'],
      pele: ['ferida só com golpe de 30 ou mais', 'golpe de 40 ou mais; corte vira esmagamento', 'golpe de 50 ou mais; corte vira esmagamento'],
      visao: ['enxerga melhor à noite', 'enxerga bem à noite', 'enxerga no escuro'],
      folego: ['fôlego maior na água', 'fôlego bem maior na água', 'respira na água']
    }[f][RANKF[fo] - 1];
    return ef[0].toUpperCase() + ef.slice(1) + '. Dura ' + dur + '. Toxicidade +' + FORCE[fo].tox + ', carga ' + (fo === 'menor' ? (FAM[f].perm ? 1 : 0) : FORCE[fo].load) + '. Sinal: ' + FAM[f].sinal + '.';
  }
  const addRec = r => { if (!RC.some(x => x.id === r.id)) RC.push(r); };
  addRec({ id: 'tala', n: 1, cost: { galho: 2, corda: 1 }, st: 'mao', desc: 'Tala de galhos amarrados para osso quebrado.' });
  addRec({ id: 'unguento', n: 1, cost: { erva: 2, resina: 1 }, st: 'fogueira', desc: 'Cozinhar ervas com resina: pomada para queimadura e ácido.' });
  addRec({ id: 'alcool_forte', n: 1, cost: { fruta: 3, frasco_vazio: 1 }, st: 'fogueira', desc: 'Destilar frutas: limpa infecção e é a base dos mutagênicos.' });
  for (const f in FAM) {
    addRec({ id: 'mut_' + f + '_menor', n: 1, cost: { ['extrato_' + f]: 1, alcool_forte: 1 }, st: 'fogueira', desc: 'Mutagênico Menor de ' + FAM[f].n + '.' });
    addRec({ id: 'mut_' + f + '_maior', n: 1, cost: { ['extrato_' + f + '_forte']: 1, alcool_forte: 1 }, st: 'bancada', desc: 'Mutagênico Maior de ' + FAM[f].n + '.' });
    addRec({ id: 'mut_' + f + '_ancestral', n: 1, cost: { ['extrato_' + f + '_forte']: 5, alcool_forte: 1 }, st: 'bancada', desc: 'Mutagênico Ancestral de ' + FAM[f].n + ' (5 extratos fortes).' });
  }

  /* ---------- usar item (chamado pelo inventário) ---------- */
  function treat(types, also) {
    const c = st(); let n = 0;
    for (const k in c.p) { const p = c.p[k], g = gradeOf(c, k); if (g >= 1 && g <= 3 && types.includes(p.t) && (p.t !== 'acido' || p.wash)) { if (!p.tr) { p.tr = c.hh; n++; } } if (also) also(p); }
    hudDirty = true; return n;
  }
  S.onUse = function (id) { /* itens que já existiam: a atadura trata corte e mordida */
    if (id === 'atadura') { const n = treat(['corte', 'mord']); if (n) toast('<b>' + CHUNK + '</b> Atadura em ' + n + (n > 1 ? ' feridas' : ' ferida') + ': param de sangrar e começam a fechar.', 3500); }
  };
  S.use = function (id) {
    const c = st(), it = IT[id]; if (!c || !it || !Surv437.count(id)) return false;
    if (it.mut659) return takeMut(id, it.mut659[0], it.mut659[1]);
    let n = 0, msg = '';
    if (id === 'tala') { n = treat(['esmag']); msg = n ? 'Tala no lugar: o osso começa a colar.' : 'Nenhum osso quebrado para imobilizar.'; }
    else if (id === 'unguento') { n = treat(['queim', 'acido']); const sujo = Object.keys(c.p).some(k => c.p[k].t === 'acido' && !c.p[k].wash && gradeOf(c, k) >= 1 && gradeOf(c, k) <= 3); msg = n ? 'Unguento passado: a pele começa a fechar.' : sujo ? 'Lave o ácido na água antes do unguento.' : 'Nenhuma queimadura para tratar.'; }
    else if (id === 'alcool_forte') {
      let inf = 0; for (const k in c.p) if (c.p[k].inf) { c.p[k].inf = false; inf++; }
      n = treat(['mord']) + inf;
      if (c.disease) { msg = 'O álcool queimou a doença antes de ela tomar conta.'; c.disease = null; n++; }
      else msg = n ? 'Álcool na ferida: infecção limpa.' : 'Nenhuma infecção para limpar.';
    }
    if (!n) { toast('<b>' + CHUNK + '</b> ' + msg, 3000); return false; }
    Surv437.take(id, 1); toast('<b>' + CHUNK + '</b> ' + msg, 3500);
    try { sfx('pot'); } catch (_) { }
    try { Surv437.save(); } catch (_) { }
    return true;
  };

  /* ---------- tomar mutagênico ---------- */
  function takeMut(id, fam, fo) {
    const c = st(), F = FAM[fam];
    if (player.shT > 0) { toast('<b>' + CHUNK + '</b> Fora de combate: espere o corpo acalmar para tomar.', 3000); return false; }
    const cur = c.genes[fam];
    if (cur && RANKF[cur.f] > RANKF[fo]) { toast('<b>' + CHUNK + '</b> Você já tem ' + F.n + ' ' + FORCE[cur.f].n + ', mais forte que este.', 3500); return false; }
    const used = S.loadUsed() - (cur ? loadOf(c, fam, cur.f) : 0), need = loadOf(c, fam, fo), max = S.loadMax();
    if (used + need > max) { toast('<b>' + CHUNK + '</b> O corpo não aguenta: carga ' + (used + need) + ' de ' + max + '. A carga sobe 1 a cada 50 níveis.', 4500); return false; }
    Surv437.take(id, 1);
    c.tox += FORCE[fo].tox;
    if (c.tox > 100) {
      const lossHp = Math.max(1, Math.round(player.maxhp * 30 / 100));
      player.hp = Math.max(1, player.hp - lossHp); c.tox = 100;
      toast('<b>' + CHUNK + '</b> Rejeição: você vomitou, perdeu ' + lossHp + ' de vida e o mutagênico se perdeu. Toxicidade cai 10 por hora do jogo.', 6500);
      try { shake(.5); sfx('hurt'); } catch (_) { } hudDirty = true; return true;
    }
    c.genes[fam] = { f: fo, at: c.hh, until: F.perm ? 0 : c.hh + FORCE[fo].h };
    if (fo !== 'menor') c.fever = c.hh + 1;
    const first = fo !== 'menor' && !c.first[fam];
    if (first) c.first[fam] = 1;
    toast('<b>' + CHUNK + '</b> ' + IT[id].n + ' assimilado. ' + (fo !== 'menor' ? 'Febre por 1 hora do jogo (−20% de Vigor máximo). ' : '') + 'Toxicidade ' + c.tox + '/100 · carga ' + S.loadUsed() + '/' + max + '.', 6000);
    if (first) scene('assimilar', fam); else { try { sfx('pot'); } catch (_) { } }
    if (fam === 'regen') startRegrow(c);
    hudDirty = true; try { saveRun(); } catch (_) { }
    return true;
  }
  function startRegrow(c) {
    const g = gene('regen'); if (g < 2) return;
    for (const k in c.p) { const p = c.p[k], at = c.hh + (g === 3 ? 1 : 72); if (p.g >= 4 && (!p.regrow || at < p.regrow)) { p.regrow = at; p.regrowFrom = c.hh; } } /* o Ancestral encurta uma volta já em andamento */
  }

  /* ---------- cena rara (1ª pessoa, 3 s, no máximo 1 por hora real) ---------- */
  let sceneEl = null;
  function scene(kind, fam) {
    const c = st();
    if (c.lastScene && Date.now() - c.lastScene < 3600000) { try { sfx('level'); } catch (_) { } return; } /* relógio real: vale entre sessões */
    c.lastScene = Date.now();
    const fp = window.FP550, was = fp && fp.active;
    try { if (fp && !was && fp.toggle) fp.toggle(true); } catch (_) { }
    if (!sceneEl) { sceneEl = document.createElement('div'); sceneEl.id = 'corpo659scene'; sceneEl.style.cssText = 'position:fixed;inset:0;z-index:940;pointer-events:none;opacity:0;transition:opacity .4s;display:flex;align-items:flex-end;justify-content:center;padding-bottom:18vh;font:400 22px "Jost","Chakra Petch",sans-serif;letter-spacing:1px;color:#f4f1ea;text-shadow:0 2px 8px #000'; document.body.appendChild(sceneEl); }
    const col = kind === 'regen' ? 'rgba(40,160,90,.55)' : 'rgba(70,20,90,.6)';
    sceneEl.style.background = 'radial-gradient(ellipse at 50% 70%, rgba(0,0,0,0) 30%, ' + col + ' 100%)';
    sceneEl.textContent = kind === 'regen' ? 'A pele se fecha. Os ossos brotam. A mão abre e fecha.' : 'A mão treme. As veias escurecem: ' + FAM[fam].sinal + '.';
    sceneEl.style.opacity = '1';
    try { shake(.35); sfx('level'); } catch (_) { }
    setTimeout(() => { sceneEl.style.opacity = '0'; try { if (fp && !was && fp.active && fp.toggle) fp.toggle(false); } catch (_) { } }, 3000);
  }
  S.scene = scene;

  /* ---------- visão borrada ---------- */
  let blurT = 0;
  function blur(s) { blurT = Math.max(blurT, now() + s); }

  /* ---------- relógio, sangramento, cura ---------- */
  let acc5 = 0, acc1 = 0, acc10 = 0, hudDirty = true, lastHH = -1;
  function inWater() { try { if (window.Water391 && Water391.swimming) return true; return window.Water391 && typeof Water391.depthAt === 'function' && Water391.depthAt(player.x, player.z) > .3; } catch (_) { return false; } }
  function hurtSelf(n) { if (player.dead || n <= 0) return; player.hp -= n; try { floater(player.x, player.z, '-' + n, '#b0182c'); } catch (_) { } if (player.hp <= 0 && !player.dead) { try { die(); } catch (_) { } } }
  function step(dt) {
    const c = st(); if (!c || !player || player.dead || (typeof paused !== 'undefined' && paused)) return;
    let cine = false; try { cine = isCinematic451(); } catch (_) { }
    c.hh += dt / HOUR;
    if (!cine) {
      acc5 += dt; acc1 += dt; acc10 += dt;
      if (acc1 >= 1) { acc1 -= 1; /* ácido na pele */
        let n = 0; const ga = gene('acido');
        for (const k in c.p) { const p = c.p[k]; if (p.t === 'acido' && !p.wash && p.g < 4 && gradeOf(c, k) >= 1) { if (inWater()) { p.wash = true; toast('<b>' + CHUNK + '</b> A água tirou o ácido do ' + PARTS[k].n.toLowerCase() + '. Agora Unguento.', 3500); } else n++; } }
        if (n && ga < 2 && (ga === 0 || Math.floor(c.hh * HOUR) % 2 === 0)) hurtSelf(1);
      }
      if (acc5 >= 5) { acc5 -= 5; /* corte sangra */
        let n = 0; for (const k in c.p) { const p = c.p[k], g = gradeOf(c, k); if ((p.t === 'corte' || p.t === 'mord') && g >= 2 && g <= 3 && !p.tr) n += (k === 'tro' && g === 3) ? 2 : 1; }
        if (n) hurtSelf(n);
      }
      if (acc10 >= 10) { acc10 -= 10; let n = 0; for (const k in c.p) if (c.p[k].inf) n++; if (n) hurtSelf(n); }
    }
    /* uma vez por hora do jogo: cura, toxicidade, genes que passam, doença, membro voltando */
    const hh = Math.floor(c.hh);
    if (hh !== lastHH) {
      const first = lastHH < 0; lastHH = hh; if (!first) hourly(c);
    }
    /* visão borrada e outros efeitos de tela */
    try { const cv = $('c'); const b = blurT > now() ? 3 : 0; const want = b ? 'blur(' + b + 'px)' : ''; if (cv.style.filter !== want) cv.style.filter = want; } catch (_) { }
    for (const k in c.p) { const p = c.p[k]; if (p.regrow && c.hh >= p.regrow) regrown(c, k); }
    gore(c);
    if (hudDirty) drawHud(c);
  }
  function hourly(c) {
    c.tox = Math.max(0, c.tox - 10);
    const half = gene('regen') >= 1;
    for (const k in c.p) {
      const p = c.p[k], g = gradeOf(c, k); if (g < 1 || g > 3) continue;
      const since = c.hh - p.hit, tr = p.tr ? c.hh - p.tr : -1;
      let ok = false;
      if (g === 1 && since >= (half ? 1 : 1)) ok = true;
      else if (g === 2 && p.tr && tr >= (half ? 3 : 6)) ok = true;
      else if (g === 3 && p.tr && tr >= (half ? 24 : 48)) { ok = true; p.scar = true; }
      if (p.t === 'cong' && g >= 1 && since >= 2 && !p.tr) { try { if (Surv437.nearFire && Surv437.nearFire(8)) ok = true; } catch (_) { } }
      if (ok) { p.hp = pmax(k); p.tr = 0; p.inf = false; p.warn = false; p.wash = true; hudDirty = true; toast('<b>' + CHUNK + '</b> ' + PARTS[k].n + ' curou' + (p.scar && g === 3 ? ', mas ficou a cicatriz.' : '.'), 3500); }
    }
    for (const f in c.genes) { const g = c.genes[f]; if (g.until && c.hh >= g.until) { delete c.genes[f]; toast('<b>' + CHUNK + '</b> O mutagênico de ' + (FAM[f] ? FAM[f].n : f) + ' passou.', 4000); hudDirty = true; } }
    try { if (window.Doenca681) Doenca681.hora(c); } catch (_) { } /* v681: incubação e estágios */
    startRegrow(c);
  }
  function regrown(c, k) {
    const p = c.p[k], anc = c.hh - (p.regrowFrom || 0) <= 2;
    p.g = 0; p.hp = pmax(k); p.regrow = 0; p.pros = false; p.scar = true; p.tr = 0; p.inf = false; p.warn = false;
    if (k === 'bd') c.swap = 0;
    hudDirty = true;
    toast('<b>' + CHUNK + '</b> ' + (PARTS[k].limb === 'arm' ? 'O braço' : 'A perna') + ' voltou inteiro, com a pele de outro tom.', 6000);
    if (anc) scene('regen');
    try { saveRun(); } catch (_) { }
  }

  /* ---------- corpo no modelo: membro faltando, coto, prótese ---------- */
  const goreMeshes = {};
  const BONES = { be: ['hand_l', 'forearm_l'], bd: ['hand_r', 'forearm_r'], pe: ['foot_l', 'shin_l'], pd: ['foot_r', 'shin_r'] };
  const PARENT = { hand_l: 'forearm_l', forearm_l: 'upperarm_l', hand_r: 'forearm_r', forearm_r: 'upperarm_r', foot_l: 'shin_l', shin_l: 'thigh_l', foot_r: 'shin_r', shin_r: 'thigh_r' };
  function cap(k, kind) {
    const key = k + kind; if (goreMeshes[key]) return goreMeshes[key];
    let geo, mat;
    if (kind === 'pros') { geo = new T.CylinderGeometry(.035, .03, .22, 8); mat = new T.MeshStandardMaterial({ color: 0x8a8f96, metalness: .7, roughness: .45 }); }
    else { geo = new T.CylinderGeometry(.06, .07, .05, 12); mat = new T.MeshStandardMaterial({ color: kind === 'gore' ? 0x4a060c : 0xcfc0a0, roughness: .85 }); }
    const m = new T.Mesh(geo, mat); m.userData.corpo659 = true; goreMeshes[key] = m; return m;
  }
  function gore(c) {
    const m = player && player.m; if (!m || !m.bones) return;
    for (const k in BONES) {
      const p = c.p[k];
      const lost = p.g >= 4 ? (p.g === 5 ? BONES[k][1] : BONES[k][0]) : null;
      for (const kind of ['gore', 'band', 'pros']) { const g = goreMeshes[k + kind]; if (g && g.parent) g.parent.remove(g); }
      for (const bn of BONES[k]) { const bb = m.bones[bn]; if (bb && bb !== m.bones[lost] && bb.scale.x < .5) bb.scale.setScalar(1); }
      if (!lost) continue;
      const b = m.bones[lost], par = m.bones[PARENT[lost]]; if (!b || !par) continue;
      b.scale.setScalar(.001);
      const kind = p.pros ? 'pros' : (c.lowGore || p.tr) ? 'band' : 'gore';
      const mesh = cap(k, kind); par.add(mesh);
      const len = b.position.length() || .25; mesh.scale.setScalar(len / (kind === 'pros' ? .3 : .3)); /* do tamanho do osso, não do mundo */
      mesh.position.copy(b.position); mesh.position.multiplyScalar(kind === 'pros' ? 1.15 : .98);
      mesh.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), b.position.clone().normalize());
    }
  }

  /* ---------- HUD: contorno pequeno só com parte em grau 2 ou mais ---------- */
  let hud = null;
  const GCOL = ['#3b4250', '#d9c46a', '#e8913a', '#e0413a', '#4a0d14', '#1a0508'];
  function svgBody(c, size) {
    const col = k => { const g = gradeOf(c, k), p = c.p[k]; return p.pros && p.g >= 4 ? '#8a8f96' : GCOL[g]; };
    const blink = k => gradeOf(c, k) === 3 ? '<animate attributeName="opacity" values="1;.35;1" dur="1s" repeatCount="indefinite"/>' : '';
    const s = (k, el) => el.replace('/>', ' fill="' + col(k) + '" stroke="#0b0d12" stroke-width="1.5">' + blink(k) + '</' + el.match(/^<(\w+)/)[1] + '>');
    return '<svg width="' + size + '" height="' + Math.round(size * 1.8) + '" viewBox="0 0 50 90">' +
      s('cab', '<circle cx="25" cy="9" r="7"/>') + s('tro', '<rect x="15" y="18" width="20" height="28" rx="4"/>') +
      s('be', '<rect x="5" y="19" width="8" height="28" rx="3"/>') + s('bd', '<rect x="37" y="19" width="8" height="28" rx="3"/>') +
      s('pe', '<rect x="15" y="48" width="9" height="38" rx="3"/>') + s('pd', '<rect x="26" y="48" width="9" height="38" rx="3"/>') + '</svg>';
  }
  S.svgBody = (size) => { const c = st(); return c ? svgBody(c, size || 50) : ''; };
  function drawHud(c) {
    hudDirty = false;
    const show = Object.keys(c.p).some(k => gradeOf(c, k) >= 2);
    if (!hud) { hud = document.createElement('div'); hud.id = 'corpo659hud'; hud.style.cssText = 'position:fixed;left:18px;bottom:150px;z-index:60;pointer-events:none;opacity:.85;filter:drop-shadow(0 1px 3px #000)'; document.body.appendChild(hud); }
    hud.style.display = show ? '' : 'none';
    if (show) hud.innerHTML = svgBody(c, 26);
  }

  /* ---------- laço ---------- */
  const U0 = update;
  update = function (dt) { const r = U0.apply(this, arguments); try { step(dt); } catch (err) { console.warn('corpo659', err); } return r; };

  /* ---------- ficha, Forja (próteses), Mira (médico e mutagênicos) ---------- */
  const esc = s => (typeof safeText === 'function' ? safeText(s) : String(s));
  const R = (a, b, cc) => (typeof row === 'function' ? row(a, b, cc) : '<div>' + a + ' ' + b + ' ' + cc + '</div>');
  const B = (t, a, v, en) => (typeof btn === 'function' ? btn(t, a, v, en !== false) : '');
  function hrs(h) { h = Math.max(0, Math.ceil(h)); return h >= 48 ? Math.ceil(h / 24) + ' dias' : h + (h === 1 ? ' hora' : ' horas'); }
  function fichaHtml() {
    const c = st(); if (!c) return '';
    let h = '<div class="guide93" style="display:flex;gap:14px;align-items:flex-start"><div>' + svgBody(c, 56) + '</div><div style="flex:1"><strong>Corpo</strong><p>Carga ' + S.loadUsed() + '/' + S.loadMax() + ' · Toxicidade ' + Math.round(c.tox) + '/100' + (feverOn(c) ? ' · com febre' : '') + (c.disease ? ' · doente (' + (c.disease.k === 'vampirismo' ? 'Vampirismo' : 'Licantropia') + ', vira mutação em ' + hrs(c.disease.until - c.hh) + ')' : '') + '</p></div></div>';
    for (const k in PARTS) {
      const p = c.p[k], g = gradeOf(c, k); if (!g && !p.scar) continue;
      let d = g ? GRADE[g] + ' · ' + TYPES[p.t].n : 'Cicatriz';
      if (g >= 4) d = (g === 4 ? 'Perdeu a ' + PARTS[k].end : 'Perdeu a ' + PARTS[k].all) + (p.pros ? ' · com prótese (metade da perda)' : ' · prótese na Forja ou Regeneração') + (p.regrow ? ' · voltando em ' + hrs(p.regrow - c.hh) : '');
      else if (g >= 2) d += p.tr ? ' · tratado, fecha em ' + hrs((g === 2 ? 6 : 48) / (gene('regen') ? 2 : 1) - (c.hh - p.tr)) : ' · trata com ' + TYPES[p.t].trata + (p.t === 'acido' && !p.wash ? ' (ainda queimando)' : '');
      else if (g === 1) d += ' · some em 1 hora do jogo';
      if (p.inf) d += ' · infeccionado';
      h += R('<b>' + PARTS[k].n + '</b>', esc(d), '');
    }
    const pen = armPen(c), lp = legPen(c);
    if (pen || lp) h += R('Perdas agora', (pen ? '−' + pen + '% de dano' : '') + (pen && lp ? ' · ' : '') + (lp ? '−' + lp + '% de velocidade' : '') + (c.p.bd.g >= 4 && c.swap && c.swap <= 20 ? ' · Treino da mão esquerda ' + (c.swap - 1) + '/20' : ''), '');
    for (const f in c.genes) { const g = c.genes[f]; const name = FAM[f] ? 'Mutagênico ' + FORCE[g.f].n + ' de ' + FAM[f].n : (f === 'vampirismo' ? 'Vampirismo' : 'Licantropia'); h += R('<b>' + esc(name) + '</b>', esc((g.until ? 'passa em ' + hrs(g.until - c.hh) : 'para sempre') + (FAM[f] ? ' · ' + FAM[f].sinal : ' · efeitos ainda em definição')), ''); }
    try { if (window.Doenca681) h += Doenca681.ficha(c, R, esc); } catch (_) { }
    h += R('Sangue', c.lowGore ? 'Menos sangue: coto enfaixado.' : 'Coto e sangue à mostra.', B(c.lowGore ? 'Mostrar sangue' : 'Menos sangue', 'corpo659gore', c.lowGore ? '0' : '1'));
    return h;
  }
  const OM0 = openModal;
  openModal = function (title, html, route) {
    try {
      if (title === 'PERSONAGEM' && typeof L !== 'undefined' && L.characterTab === 'status') html += fichaHtml();
      else if (typeof SHOPS !== 'undefined') {
        const wep = SHOPS.find(s => s.id === 'wep'), arm = SHOPS.find(s => s.id === 'arm'), pot = SHOPS.find(s => s.id === 'pot');
        if (wep && arm && (title === wep.n || title === arm.n)) html += R('Próteses', 'Gancho, mão de ferro, perna de pau e pé de ferro para membro perdido.', B('Abrir', 'corpo659open', 'pros'));
        else if (pot && title === pot.n) html += R('Médico e mutagênicos', 'Cura feridas por ouro. Compra e venda de mutagênicos.', B('Abrir', 'corpo659open', 'med'));
      }
    } catch (err) { console.warn('corpo659 modal', err); }
    return OM0.call(this, title, html, route);
  };
  const PROS = { arm: { n: 'Gancho de ferro', price: 120 }, leg: { n: 'Perna de pau', price: 100 } };
  function prosView() {
    const c = st(); let h = '<div class="guide93"><p>A prótese tira metade da perda do membro. Regeneração devolve o membro inteiro.</p></div>';
    let any = false;
    for (const k in PARTS) { const p = c.p[k]; if (!PARTS[k].limb || p.g < 4) continue; any = true; const P = PROS[PARTS[k].limb], nm = p.g === 4 ? (PARTS[k].limb === 'arm' ? 'Mão de ferro' : 'Pé de ferro') : P.n; h += R('<b>' + nm + '</b> · ' + PARTS[k].n, p.pros ? 'Já colocada.' : P.price + ' de ouro', B(p.pros ? 'Colocada' : 'Colocar', 'corpo659pros', k, !p.pros && run.gold >= P.price)); }
    if (!any) h += R('Nenhum membro perdido', 'Nada para trocar agora.', '');
    OM0.call(window, 'PRÓTESES', h, 'corpo659');
  }
  function medPrice(c) { let n = 0; for (const k in c.p) { const g = gradeOf(c, k); if (g >= 1 && g <= 3) n += g; } return n * 25; }
  const MUTPRICE = { menor: 60, maior: 400, ancestral: 1600 };
  function medView() {
    const c = st(), pr = medPrice(c);
    let h = R('<b>Médico</b>', pr ? 'Cura todas as feridas de grau 1 a 3' + (c.disease ? ' e a doença' : '') + ': ' + pr + ' de ouro.' : (c.disease ? 'Cura a doença: 100 de ouro.' : 'Nenhuma ferida para curar.'), B('Curar', 'corpo659med', '1', (pr || c.disease) && run.gold >= (pr || 100)));
    h += R('<b>Purga</b>', 'Tira um mutagênico do corpo. 200 de ouro e 1 hora de febre. A cicatriz fica.', '');
    for (const f in c.genes) if (FAM[f]) h += R('Purgar ' + FAM[f].n + ' ' + FORCE[c.genes[f].f].n, '', B('Purgar', 'corpo659purge', f, run.gold >= 200));
    h += '<div class="guide93"><strong>Mutagênicos à venda</strong><p>Menores prontos. Maiores e Ancestrais você faz com extratos fortes.</p></div>';
    for (const f in FAM) h += R(esc(IT['mut_' + f + '_menor'].n), esc(IT['mut_' + f + '_menor'].d), B('Comprar ' + MUTPRICE.menor, 'corpo659buy', f, run.gold >= MUTPRICE.menor));
    let sell = '';
    for (const id in IT) { if (!/^(mut_|extrato_)/.test(id)) continue; const n = Surv437.count(id); if (!n) continue; const v = sellPrice(id); sell += R(esc(IT[id].n) + ' ×' + n, v + ' de ouro cada', B('Vender', 'corpo659sell', id)); }
    if (sell) h += '<div class="guide93"><strong>Vender</strong></div>' + sell;
    OM0.call(window, 'MÉDICO E MUTAGÊNICOS', h, 'corpo659');
  }
  function sellPrice(id) { if (/^extrato_.*_forte$/.test(id)) return 80; if (/^extrato_/.test(id)) return 15; const fo = (IT[id].mut659 || [])[1]; return Math.floor((MUTPRICE[fo] || 60) / 2); }
  const EA0 = extraActions;
  extraActions = function (a, v) {
    try {
      const c = st();
      if (a === 'corpo659open') { if (v === 'pros') prosView(); else medView(); return 'close0'; }
      if (a === 'corpo659gore') { c.lowGore = v === '1'; try { saveRun(); } catch (_) { } characterView('status'); return 'close0'; }
      if (a === 'corpo659pros') { const P = PROS[PARTS[v].limb]; if (run.gold >= P.price && c.p[v].g >= 4) { run.gold -= P.price; c.p[v].pros = true; toast('<b>' + CHUNK + '</b> Prótese colocada: ' + PARTS[v].n.toLowerCase() + ' com metade da perda.', 4000); hudDirty = true; saveRun(); } prosView(); return 'close0'; }
      if (a === 'corpo659med') { const pr = medPrice(c) || (c.disease ? 100 : 0); if (pr && run.gold >= pr) { run.gold -= pr; for (const k in c.p) { const g = gradeOf(c, k); if (g >= 1 && g <= 3) { if (g === 3) c.p[k].scar = true; c.p[k].hp = pmax(k); c.p[k].tr = 0; c.p[k].inf = false; c.p[k].warn = false; c.p[k].wash = true; } } c.disease = null; c.hh += 1; hudDirty = true; toast('<b>' + CHUNK + '</b> O médico cuidou de você por 1 hora do jogo. Feridas fechadas.', 4500); saveRun(); } medView(); return 'close0'; }
      if (a === 'corpo659purge') { if (run.gold >= 200 && c.genes[v]) { run.gold -= 200; delete c.genes[v]; c.fever = c.hh + 1; toast('<b>' + CHUNK + '</b> Purga feita: o gene saiu. Febre por 1 hora do jogo.', 4500); saveRun(); } medView(); return 'close0'; }
      if (a === 'corpo659buy') { if (run.gold >= MUTPRICE.menor && Surv437.add('mut_' + v + '_menor', 1, true)) { run.gold -= MUTPRICE.menor; saveRun(); } medView(); return 'close0'; }
      if (a === 'corpo659sell') { if (Surv437.take(v, 1)) { run.gold += sellPrice(v); saveRun(); } medView(); return 'close0'; }
    } catch (err) { console.warn('corpo659 action', err); }
    return EA0.apply(this, arguments);
  };

  /* ---------- visão noturna (família Visão e faro) ---------- */
  try {
    const R0 = renderer.render.bind(renderer);
    renderer.render = function (sc, cam) {
      const g = gene('visao'); let e0 = null;
      if (g) { try { const night = typeof isNight === 'function' ? isNight() : (typeof dayT !== 'undefined' && typeof DAYLEN !== 'undefined' ? (dayT % DAYLEN) / DAYLEN > .75 || (dayT % DAYLEN) / DAYLEN < .2 : false); if (night) { e0 = renderer.toneMappingExposure; renderer.toneMappingExposure = e0 * (1 + .15 * g); } } catch (_) { } }
      const r = R0(sc, cam); if (e0 != null) renderer.toneMappingExposure = e0; return r;
    };
  } catch (_) { }
})();
