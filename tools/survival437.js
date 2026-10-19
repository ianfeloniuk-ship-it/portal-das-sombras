/* v456: Sistema Profundo de Sobrevivência, Comida (4 Estágios de Frescor), Água, Cantis, Bolsas de Conservação,
   Coleta Orgânica com Regeneração Natural e Acampamento Portátil (0 créditos Tripo — 100% modelos existentes). */
(function () {
  'use strict';
  const T = THREE, TAU = Math.PI * 2;
  const H = (x, z) => (typeof L !== 'undefined' && L && L.mode === 'dungeon') ? 0 : (typeof terrH === 'function' ? terrH(x, z) : 0);
  const ready = () => typeof started !== 'undefined' && started && typeof player !== 'undefined' && player && typeof run !== 'undefined' && run && typeof L !== 'undefined' && L && (L.mode === 'world' || L.mode === 'dungeon');
  const DAY = () => (typeof DAY_LENGTH !== 'undefined' ? DAY_LENGTH : 1200);
  /* v462: bônus de sobrevivência dos 9 atributos (tools/attrs462.js) e treino prático */
  const A = (k) => { try { return (window.Attr462 && Attr462.surv()[k]) || 0; } catch (_) { return 0; } };
  const TR = (k, n) => { try { if (window.Attr462) Attr462.train(k, n); } catch (_) {} };

  /* ---------- Catálogo de Itens, Alimentos, Bolsas de Conservação e Cantis ---------- */
  const ITEMS = {
    galho:    { n: 'Galho Seco',        w: 0.4,  cat: 'mat',  d: 'Galho caído no chão da floresta. Usado em fogueiras, tendas, varais, flechas e cabos.' },
    pedra:    { n: 'Pedra Bruta',       w: 0.8,  cat: 'mat',  d: 'Pedra solta ou extraída de rochas. Base para fogueira, lascas e sal mineral.' },
    lasca:    { n: 'Lasca Afiada',      w: 0.5,  cat: 'mat',  d: 'Pedra lascada com fio cortante para machados, picaretas e pontas de flecha.' },
    fibra:    { n: 'Fibra Vegetal',     w: 0.25, cat: 'mat',  d: 'Colhida de arbustos e capim alto. Trançada vira corda ou invólucro hermético.' },
    corda:    { n: 'Corda de Fibra',    w: 0.5,  cat: 'mat',  d: 'Fibras trançadas. Amarração essencial para Tenda, Varal, Bancada e Carrinho.' },
    lenha:    { n: 'Feixe de Lenha',    w: 1.5,  cat: 'mat',  d: 'Madeira cortada para alimentar a Fogueira de Pedra e Lenha.', fuel: 1 },
    tora:     { n: 'Tora de Madeira',   w: 5.5,  cat: 'mat',  d: 'Tronco pesado. Ideal para levar no Carrinho de Carga, fazer lenha ou consertar o eixo.' },
    tabua:    { n: 'Tábua Rústica',     w: 2.0,  cat: 'mat',  d: 'Madeira aparelhada para reparos de bancada e estrutura do Carrinho de Carga.' },
    resina:   { n: 'Resina & Sal',      w: 0.35, cat: 'mat',  d: 'Seiva inflamável e sal mineral de rocha. Usada em tochas, cura de carnes e invólucros herméticos.' },
    cristal_frio: { n: 'Lasca de Cristal Frio', w: 0.5, cat: 'mat', d: 'Cristal glacial que mantém baixa temperatura. Usado na Mochila Térmica e no Cantil Térmico Isolado.' },
    couro:    { n: 'Couro Cru',         w: 1.2,  cat: 'mat',  d: 'Pele de fera limpa. Usada em Tendas Portáteis, Bolsas de Conservação e Cantis.' },
    osso:     { n: 'Osso / Chifre',     w: 0.9,  cat: 'mat',  d: 'Material rígido deixado por feras e carcaças.' },
    pena:     { n: 'Pena',              w: 0.1,  cat: 'mat',  d: 'Pena leve de ave para estabilizar flechas.' },
    erva:     { n: 'Erva Medicinal',    w: 0.25, cat: 'food', d: 'Folhas curativas para Ataduras, Chás Térmicos e Antídotos fervidos no cantil.' },

    /* Alimentos com 4 Estágios de Frescor e duração por tipo de preparo */
    fruta:          { n: 'Frutas Silvestres',    w: 0.3,  cat: 'food', d: 'Colhidas de arbustos. Estragam rápido (1–2 dias).', eat: 12, water: 8, spoilDays: 1.5, buff: { hpPct: 0.05, vigMult: 1.10, dur: 120 } },
    carne:          { n: 'Carne Crua',           w: 1.2,  cat: 'food', d: 'Estraga rápido (1–2 dias). Asse na Fogueira ou seque no Varal Portátil.', eat: 14, raw: true, spoilDays: 1.5 },
    peixe_cru:      { n: 'Peixe Cru',            w: 1.1,  cat: 'food', d: 'Pescado em rios, lagos ou fendas. Estraga em 1–2 dias; asse ou defume no Varal.', eat: 15, raw: true, spoilDays: 1.5 },
    cogu_bom:       { n: 'Cogumelo Comestível',  w: 0.35, cat: 'food', d: 'Cogumelo claro da mata ou fenda. Dura 2 dias.', eat: 14, spoilDays: 2.0, buff: { hpPct: 0.05, vigMult: 1.10, dur: 120 } },
    cogu_assado:    { n: 'Cogumelo na Brasa',    w: 0.3,  cat: 'food', d: 'Cogumelo tostado na fogueira. Dura 3–4 dias.', eat: 28, spoilDays: 3.5, buff: { hpPct: 0.12, vigMult: 1.22, dur: 240 } },
    assada:         { n: 'Carne Assada',         w: 1.0,  cat: 'food', d: 'Assada na Fogueira: dura 3 a 4 dias e concede forte bônus imediato de Vida e Vigor.', eat: 45, spoilDays: 3.5, buff: { hpPct: 0.20, vigMult: 1.35, dur: 360 } },
    peixe_assado:   { n: 'Peixe Assado',         w: 0.95, cat: 'food', d: 'Assado na Fogueira: dura 3 a 4 dias e concede forte bônus imediato de Vida e Vigor.', eat: 48, spoilDays: 3.5, buff: { hpPct: 0.22, vigMult: 1.40, dur: 360 } },
    defumada:       { n: 'Carne Seca',           w: 0.75, cat: 'food', d: 'Curada no Varal de Secagem Portátil: dura de 10 a 14 dias sem estragar.', eat: 46, spoilDays: 12.0, buff: { hpPct: 0.15, vigMult: 1.25, dur: 480 } },
    peixe_defumado: { n: 'Peixe Defumado',       w: 0.7,  cat: 'food', d: 'Defumado no Varal de Secagem Portátil: dura de 10 a 14 dias sem estragar.', eat: 48, spoilDays: 12.0, buff: { hpPct: 0.16, vigMult: 1.28, dur: 480 } },
    racao_expedicao:{ n: 'Ração de Expedição',   w: 0.65, cat: 'food', d: 'Carne seca/peixe + frutas + resina/sal. Dura mais de 20 dias — ideal para expedições de semanas nas Fendas!', eat: 68, spoilDays: 22.0, buff: { hpPct: 0.28, vigMult: 1.45, dur: 720 } },

    /* Podre (0% Frescor) -> transforma-se automaticamente em Isca de Carniça (LURE_FOOD) */
    isca_carnica:   { n: 'Isca de Carniça (Podre)', w: 0.4, cat: 'food', d: 'Comida no estágio Podre (0%). Imprópria para humanos, mas pode ser jogada no chão [G] para atrair e distrair feras e carniceiros (LURE_FOOD)!', bait: true },
    estragada:      { n: 'Isca de Carniça (Podre)', w: 0.4, cat: 'food', d: 'Comida no estágio Podre (0%). Imprópria para humanos, mas pode ser jogada no chão [G] para atrair e distrair feras e carniceiros (LURE_FOOD)!', bait: true },

    /* Bolsas Especiais e Pacotes de Conservação (fabricados na Bancada Rústica de Campo) */
    alforje_sal:      { n: 'Alforje de Couro Curado no Sal', w: 0.8, cat: 'tool', bagUpgrade: true, d: 'Compartimento de mochila curado no sal que reduz a velocidade de apodrecimento da comida em 50%.' },
    mochila_termica:  { n: 'Mochila Térmica de Cristal Frio', w: 1.1, cat: 'tool', bagUpgrade: true, d: 'Forrada com couro grosso e lasca de cristal glacial: reduz o apodrecimento da comida em 80% e blinda contra o Miasma da Fenda.' },
    involucro_resina: { n: 'Invólucro de Resina e Fibra',    w: 0.3, cat: 'tool', wrap: true, d: 'Lacra até 4 refeições num pacote hermético (0% de perda enquanto lacrado; o tempo só volta a correr ao abrir).' },
    pacote_lacrado:   { n: 'Pacote Hermético (4 Refeições)', w: 1.2, cat: 'food', bundle: true, d: 'Refeições lacradas em resina e fibra. NÃO estragam (0% de perda) até você abrir o pacote na masmorra ou acampamento!' },
    caixa_salmoura:   { n: 'Caixa de Salmoura (Carrinho)',   w: 1.5, cat: 'tool', cartUpgrade: true, d: 'Compartimento para o Carrinho de Carga: alimentos guardados nos slots do carrinho estragam 75% mais devagar.' },

    /* Progressão de Cantis e Ferramentas de Sobrevivência */
    cantil:         { n: 'Odre de Couro Simples',   w: 1.0,  cat: 'tool', tool: true, canteenTier: 1, d: 'Guarda 4 goles. Encha em uma fonte e trate na fogueira. A água pode congelar no frio ou evaporar no calor.' },
    cantil_ferro:   { n: 'Cantil de Ferro',         w: 1.4,  cat: 'tool', tool: true, canteenTier: 2, d: 'Guarda 8 goles e trata a água duas vezes mais rápido junto à fogueira.' },
    cantil_termico: { n: 'Cantil Térmico Isolado',  w: 1.5,  cat: 'tool', tool: true, canteenTier: 3, d: 'Guarda 10 goles. Impede que a água congele na neve ou evapore no deserto e triplica (3×) a duração da potência dos chás medicinais.' },
    machado:        { n: 'Machado de Pedra',        w: 2.2,  cat: 'tool', tool: true, dur: 28, d: 'Derruba árvores para obter Toras e Feixes de Lenha (os tocos regeneram naturalmente).' },
    picareta:       { n: 'Picareta Rústica',        w: 2.6,  cat: 'tool', tool: true, dur: 24, d: 'Quebra rochas brutas e extrai Lascas de Cristal Frio.' },
    tocha:          { n: 'Tocha de Resina',         w: 0.9,  cat: 'tool', tool: true, dur: 180, d: 'Ilumina a noite/masmorra, aquece contra o frio e afasta predadores fotofóbicos.' },
    vara:           { n: 'Vara de Pesca',           w: 1.2,  cat: 'tool', tool: true, dur: 22, d: 'Pesca peixes frescos em rios, lagos ou poças abissais dentro das Fendas.' },
    arco_rustico:   { n: 'Arco de Caça',            w: 1.8,  cat: 'tool', tool: true, dur: 35, d: 'Arco silencioso de madeira e corda.' },
    flecha:         { n: 'Flecha de Lasca',         w: 0.15, cat: 'tool', d: 'Munição para o Arco de Caça.' },
    atadura:        { n: 'Atadura de Ervas',        w: 0.35, cat: 'food', d: 'Estanca sangramento e restaura 35% da vida.', heal: 0.35, stopBleed: true },
    bolsa:          { n: 'Alforje de Carga (+12 kg)', w: 0,  cat: 'tool', d: 'Aumenta a capacidade máxima da mochila em +12 kg.' }
  };

  /* Receitas: 'mao' = à mão; 'fogueira' = Fogueira Portátil; 'bancada' = Bancada Rústica de Campo */
  const RECIPES = [
    { id: 'lasca',    n: 2, cost: { pedra: 2 },                          st: 'mao',      desc: 'Bater duas pedras para tirar lascas cortantes.' },
    { id: 'corda',    n: 1, cost: { fibra: 3 },                          st: 'mao',      desc: 'Trançar fibras vegetais em corda resistente.' },
    { id: 'machado',  n: 1, cost: { galho: 2, lasca: 1, corda: 1 },      st: 'mao',      desc: 'Machado básico para cortar lenha e toras.' },
    { id: 'picareta', n: 1, cost: { galho: 2, lasca: 2, corda: 1 },      st: 'mao',      desc: 'Picareta rústica para quebrar rochas e cristais frios.' },
    { id: 'tocha',    n: 1, cost: { galho: 1, fibra: 2, resina: 1 },     st: 'mao',      desc: 'Tocha que ilumina, aquece e afasta feras da noite.' },
    { id: 'atadura',  n: 1, cost: { fibra: 2, erva: 2 },                 st: 'mao',      desc: 'Compressa de ervas para estancar sangramento.' },
    { id: 'cantil',   n: 1, cost: { couro: 2, corda: 1 },                st: 'mao',      desc: 'Odre de Couro Simples (4 goles).' },
    { id: 'lenha',    n: 3, cost: { tora: 1 },                           st: 'mao',      desc: 'Rachar uma tora em 3 feixes de lenha.' },
    { id: 'tabua',    n: 2, cost: { tora: 1 },                           st: 'mao',      desc: 'Aparelhar uma tora em 2 tábuas rústicas para reparos.' },

    /* Receitas de Fogueira (Culinária & Ração) */
    { id: 'assada',          n: 1, cost: { carne: 1 },                           st: 'fogueira', desc: 'Assar carne na brasa (dura 3–4 dias + forte bônus de Vida/Vigor).' },
    { id: 'peixe_assado',    n: 1, cost: { peixe_cru: 1 },                       st: 'fogueira', desc: 'Assar peixe na brasa (dura 3–4 dias + forte bônus de Vida/Vigor).' },
    { id: 'cogu_assado',     n: 1, cost: { cogu_bom: 1 },                        st: 'fogueira', desc: 'Tostar cogumelo comestível no calor do fogo (dura 3–4 dias).' },
    { id: 'racao_expedicao', n: 2, cost: { defumada: 1, fruta: 2, resina: 1 },   st: 'fogueira', desc: 'Ração de Expedição (Carne Seca + Frutas + Resina/Sal): dura mais de 20 dias!' },

    /* Receitas da Bancada Rústica de Campo (Bolsas de Conservação, Cantis, Armas e Utensílios) */
    { id: 'involucro_resina', n: 1, cost: { resina: 2, fibra: 3 },               st: 'bancada',  desc: 'Invólucro de Resina e Fibra (lacra até 4 refeições com 0% de apodrecimento).' },
    { id: 'alforje_sal',      n: 1, cost: { couro: 2, pedra: 2, corda: 1 },      st: 'bancada',  desc: 'Alforje de Couro Curado no Sal (reduz apodrecimento na mochila em 50%).' },
    { id: 'mochila_termica',  n: 1, cost: { couro: 3, cristal_frio: 2, corda: 2 }, st: 'bancada', desc: 'Mochila Térmica de Cristal Frio (reduz apodrecimento em 80% e blinda contra Miasma).' },
    { id: 'caixa_salmoura',   n: 1, cost: { couro: 2, pedra: 3, resina: 1 },     st: 'bancada',  desc: 'Caixa de Salmoura no Carrinho (comida no carrinho estraga 75% mais devagar).' },
    { id: 'cantil_ferro',     n: 1, cost: { couro: 1, pedra: 4, resina: 1 },     st: 'bancada',  desc: 'Cantil de Ferro (8 goles e ferve água na metade do tempo).' },
    { id: 'cantil_termico',   n: 1, cost: { couro: 2, cristal_frio: 2, resina: 2 }, st: 'bancada', desc: 'Cantil Térmico Isolado (10 goles, não congela/evapora e triplica potência dos chás).' },
    { id: 'racao_expedicao',  n: 2, cost: { peixe_defumado: 1, fruta: 2, resina: 1 }, st: 'bancada', desc: 'Ração de Expedição (Peixe Defumado + Frutas + Resina/Sal): dura mais de 20 dias!' },
    { id: 'cristal_frio',     n: 1, cost: { pedra: 2, resina: 1 },               st: 'bancada',  desc: 'Condensar Lasca de Cristal Frio a partir de rocha mineral e resina.' },
    { id: 'vara',             n: 1, cost: { galho: 2, corda: 2, osso: 1 },       st: 'bancada',  desc: 'Vara de pesca com anzol de osso.' },
    { id: 'arco_rustico',     n: 1, cost: { galho: 3, corda: 2 },                st: 'bancada',  desc: 'Arco de caça silencioso.' },
    { id: 'flecha',           n: 6, cost: { galho: 2, lasca: 2, pena: 1 },       st: 'bancada',  desc: '6 flechas com ponta de lasca.' },
    { id: 'bolsa',            n: 1, cost: { couro: 3, corda: 2 },                st: 'bancada',  desc: 'Alforje de Carga (+12 kg na mochila).' }
  ];

  /* ---------- Estado no save da run ---------- */
  function S() {
    if (!run) return null;
    if (!run.surv437) {
      run.surv437 = {
        hunger: 100, thirst: 100, temp: 50,
        inv: { galho: 3, pedra: 2, fruta: 2, cantil: 1 },
        spoil: {}, dur: {},
        canteen: { sips: 2, max: 4, kind: 'limpa', tier: 1, potency: 0, frozen: false, freezeP: 0, evapP: 0 },
        torchOn: false, sickT: 0, intoxT: 0, warmT: 0, antidoteT: 0, foodBuff: null,
        bundles456: [],
        picked: {}, felled: {}, built: [], leveled: [], clock: 0
      };
    }
    const s = run.surv437;
    s.inv = s.inv || {}; s.spoil = s.spoil || {}; s.dur = s.dur || {};
    s.canteen = s.canteen || { sips: 0, max: 4, kind: 'limpa', tier: 1, potency: 0, frozen: false };
    s.bundles456 = Array.isArray(s.bundles456) ? s.bundles456 : [];
    s.picked = s.picked || {}; s.felled = s.felled || {}; s.built = s.built || []; s.leveled = [];
    // Sync legacy estragada <-> isca_carnica
    const rot = Math.max(s.inv.isca_carnica || 0, s.inv.estragada || 0);
    if (rot > 0) { s.inv.isca_carnica = rot; delete s.inv.estragada; }
    // Sync canteen tier from inventory
    if (s.inv.cantil_termico > 0) s.canteen.tier = 3;
    else if (s.inv.cantil_ferro > 0) s.canteen.tier = Math.max(s.canteen.tier || 1, 2);
    else s.canteen.tier = Math.max(s.canteen.tier || 1, 1);
    s.canteen.max = s.canteen.tier === 3 ? 10 : s.canteen.tier === 2 ? 8 : 4;
    if (typeof s.clock !== 'number') s.clock = 0;
    return s;
  }
  const save = () => { try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} };

  function canteenTier() {
    const s = S(); if (!s) return 1;
    if (s.inv.cantil_termico > 0 || s.canteen.tier === 3) return 3;
    if (s.inv.cantil_ferro > 0 || s.canteen.tier === 2) return 2;
    return 1;
  }
  function canteenMaxSips() {
    const t = canteenTier();
    return t === 3 ? 10 : t === 2 ? 8 : 4;
  }

  /* ---------- 4 Estágios de Frescor da Comida ---------- */
  function maxSpoilSec(id) {
    const it = ITEMS[id];
    if (!it || !it.spoilDays) return 0;
    return it.spoilDays * DAY();
  }
  function freshnessPct(id, customSpoilMap) {
    const maxS = maxSpoilSec(id);
    if (!maxS) return 100;
    const s = S(), map = customSpoilMap || (s && s.spoil) || {};
    const el = Math.max(0, Number(map[id]) || 0);
    return Math.max(0, Math.min(100, Math.round((1 - el / maxS) * 100)));
  }
  function freshStage(pct) {
    if (pct >= 60) return { stage: 1, id: 'fresca',     name: 'Fresca',     col: '#6fe39a', mul: 1.00, buff: true,  intox: false };
    if (pct >= 25) return { stage: 2, id: 'amanhecida', name: 'Amanhecida', col: '#ffd54f', mul: 0.50, buff: false, intox: false };
    if (pct >= 1)  return { stage: 3, id: 'estragada',  name: 'Estragada',  col: '#ff6b6b', mul: 0.15, buff: false, intox: true  };
    return               { stage: 4, id: 'podre',      name: 'Podre',      col: '#8a929a', mul: 0.00, buff: false, intox: true, rotten: true };
  }
  function spoilMult(inCart) {
    const s = S(); if (!s) return 1;
    const fresh = 1 - A('fresh'); // Inteligência: comida preparada dura mais
    if (inCart) {
      // Caixa de Salmoura no Carrinho de Carga: alimentos guardados nos slots do carrinho estragam 75% mais devagar
      return 0.25 * fresh;
    }
    const inRift = typeof L !== 'undefined' && L && L.mode === 'dungeon';
    const hasThermal = (s.inv.mochila_termica || 0) > 0;
    const hasSaltBag = (s.inv.alforje_sal || 0) > 0;
    // O Miasma da Fenda faz qualquer comida fora de bolsas térmicas/invólucros de resina apodrecer 2x mais rápido lá dentro
    const miasma = (inRift && !hasThermal) ? 1 + (1 - A('miasma')) : 1.0; // Espírito enfraquece o Miasma
    let bag = 1.0;
    if (hasThermal) bag = 0.20;      // -80% apodrecimento
    else if (hasSaltBag) bag = 0.50; // -50% apodrecimento
    return bag * miasma * fresh;
  }

  /* ---------- Peso e Capacidade ---------- */
  function equipW() {
    let w = 0;
    try {
      for (const b of (run.bags || [])) if (b) w += b.slot === 'w' ? 1.8 : 1.1;
      for (const k of Object.keys(run.equip || {})) if (run.equip[k]) w += k === 'w' ? 1.5 : 0.9;
    } catch (_) {}
    return w;
  }
  function invW() {
    const s = S(); if (!s) return 0;
    let w = 0;
    for (const [k, n] of Object.entries(s.inv)) {
      if (n > 0 && ITEMS[k]) w += ITEMS[k].w * n;
    }
    return w;
  }
  function totalW() { return equipW() + invW(); }
  function maxW() {
    const s = S(), bags = (s?.inv?.bolsa || 0) + ((s?.inv?.alforje_sal || 0) > 0 ? 0.5 : 0) + ((s?.inv?.mochila_termica || 0) > 0 ? 1 : 0);
    return 35 + A('carryKg') + bags * 12; // Força (antes lia run.stats.str, que não existe)
  }
  function overRatio() { return totalW() / Math.max(1, maxW()); }
  function overMul() {
    const r = overRatio();
    const cartPull = window.Cart437 && Cart437.st && Cart437.st()?.pulling ? 1 - 0.18 * (1 - A('cartRelief')) : 1;
    const coldSlow = (S()?.temp ?? 50) < 18 ? 0.85 : 1;
    const base = r > 1.25 ? 0.38 : r > 1.0 ? 0.68 : r > 0.85 ? 0.88 : 1;
    return base * cartPull * coldSlow;
  }
  const canRun = () => overRatio() <= 1.0 && (S()?.thirst ?? 100) > 8 && !(window.Cart437 && Cart437.st && Cart437.st()?.pulling && Cart437.w() > Cart437.cap());

  function count(id) {
    const s = S(); if (!s) return 0;
    if (id === 'estragada' || id === 'isca_carnica') return (s.inv.isca_carnica || 0) + (s.inv.estragada || 0);
    return s.inv[id] || 0;
  }
  function has(cost) {
    for (const [k, n] of Object.entries(cost)) if (count(k) < n) return false;
    return true;
  }
  function add(id, n = 1, silent = false, incomingSpoil = 0) {
    const s = S(); if (!s || !ITEMS[id] || n <= 0) return 0;
    if (id === 'estragada') id = 'isca_carnica';
    const cur = s.inv[id] || 0;
    if (ITEMS[id].spoilDays) {
      const oldSpoil = cur > 0 ? (s.spoil[id] || 0) : 0;
      s.spoil[id] = (oldSpoil * cur + incomingSpoil * n) / (cur + n);
    }
    s.inv[id] = cur + n;
    if (ITEMS[id].dur && !s.dur[id]) s.dur[id] = ITEMS[id].dur;
    if (ITEMS[id].canteenTier) {
      s.canteen.tier = Math.max(s.canteen.tier || 1, ITEMS[id].canteenTier);
      s.canteen.max = canteenMaxSips();
      if (s.canteen.tier === 3) { s.canteen.frozen = false; s.canteen.freezeP = 0; }
    }
    if (!silent && typeof floater === 'function' && typeof player !== 'undefined') {
      floater(player.x, player.z, '+' + n + ' ' + ITEMS[id].n, '#a8e6a1');
    }
    save();
    return n;
  }
  function take(id, n = 1) {
    const s = S(); if (!s) return false;
    if (id === 'estragada') id = 'isca_carnica';
    if ((s.inv[id] || 0) < n) return false;
    s.inv[id] -= n;
    if (s.inv[id] <= 0) { delete s.inv[id]; delete s.spoil[id]; delete s.dur[id]; }
    save();
    return true;
  }
  function useTool(id, cost = 1) {
    const s = S(); if (!s || !count(id)) return false;
    if ((id === 'machado' || id === 'picareta') && Math.random() < A('toolSave')) return true;
    const max = ITEMS[id].dur || 20;
    s.dur[id] = (s.dur[id] ?? max) - cost;
    if (s.dur[id] <= 0) {
      take(id, 1);
      if (count(id) > 0) s.dur[id] = max;
      toast('<b>' + ITEMS[id].n + '</b> quebrou com o uso!');
    }
    save();
    return true;
  }

  /* ---------- Invólucro de Resina e Fibra (Bundling Wrap — 0% perda enquanto lacrado) ---------- */
  function sealBundle() {
    const s = S(); if (!s) return false;
    if (count('involucro_resina') < 1) {
      toast('Você precisa de 1 <b>Invólucro de Resina e Fibra</b> (fabricado na Bancada Rústica).');
      return false;
    }
    const foodPriority = ['racao_expedicao', 'defumada', 'peixe_defumado', 'assada', 'peixe_assado', 'cogu_assado', 'fruta', 'cogu_bom', 'carne', 'peixe_cru'];
    const meals = [];
    let totalPicked = 0;
    for (const fid of foodPriority) {
      while (count(fid) > 0 && totalPicked < 4) {
        const sp = s.spoil[fid] || 0;
        take(fid, 1);
        const existing = meals.find(m => m.id === fid);
        if (existing) {
          existing.spoil = (existing.spoil * existing.n + sp) / (existing.n + 1);
          existing.n++;
        } else {
          meals.push({ id: fid, n: 1, spoil: sp });
        }
        totalPicked++;
      }
      if (totalPicked >= 4) break;
    }
    if (!totalPicked) {
      toast('Nenhuma refeição na mochila para lacrar no Invólucro de Resina.');
      return false;
    }
    take('involucro_resina', 1);
    s.bundles456.push({ meals, total: totalPicked, sealedAt: s.clock });
    add('pacote_lacrado', 1, true);
    try { sfx('coin'); } catch (_) {}
    toast('<b>[INVÓLUCRO HERMÉTICO]</b> ' + totalPicked + ' refeição(ões) lacrada(s) em resina! Apodrecimento congelado em <b>0%</b> até abrir.');
    save();
    return true;
  }
  function unsealBundle() {
    const s = S(); if (!s || count('pacote_lacrado') < 1) return false;
    take('pacote_lacrado', 1);
    const b = s.bundles456.pop();
    if (b && Array.isArray(b.meals) && b.meals.length) {
      const names = [];
      for (const m of b.meals) {
        add(m.id, m.n, true, m.spoil || 0);
        names.push(m.n + '× ' + (ITEMS[m.id]?.n || m.id));
      }
      toast('<b>[PACOTE ABERTO]</b> Refeições recuperadas intactas: ' + names.join(', ') + '!');
    } else {
      add('racao_expedicao', 2, true, 0);
      toast('<b>[PACOTE ABERTO]</b> 2× Ração de Expedição frescas recuperadas!');
    }
    try { sfx('step'); } catch (_) {}
    save();
    return true;
  }

  /* ---------- Jogar Isca de Carniça no Chão (LURE_FOOD) ---------- */
  const activeBaits456 = [];
  function throwBait() {
    const s = S(); if (!s || typeof player === 'undefined' || !player) return false;
    if (count('isca_carnica') < 1) {
      toast('Você não tem <b>Isca de Carniça</b> (comida podre 0%) para jogar.');
      return false;
    }
    take('isca_carnica', 1);
    const bx = player.x + Math.sin(player.face || 0) * 2.4;
    const bz = player.z + Math.cos(player.face || 0) * 2.4;
    const by = H(bx, bz);
    if (typeof scene !== 'undefined' && scene) {
      const g = new T.Group();
      g.position.set(bx, by + 0.08, bz);
      g.userData.terrainAbsolute245 = true;
      const morsel = new T.Mesh(
        new T.DodecahedronGeometry(0.32, 1),
        new T.MeshStandardMaterial({ color: 0x5c4338, roughness: 0.9, emissive: 0x2e3b1f, emissiveIntensity: 0.35 })
      );
      morsel.scale.set(1.2, 0.65, 1.0);
      g.add(morsel);
      const ring = new T.Mesh(
        new T.RingGeometry(0.45, 0.62, 20),
        new T.MeshBasicMaterial({ color: 0x9be03a, transparent: true, opacity: 0.55, side: T.DoubleSide, depthWrite: false })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.03;
      g.add(ring);
      scene.add(g);
      activeBaits456.push({ g, t: 15 });
    }
    if (window.Eco410 && typeof Eco410.dropLure === 'function') {
      Eco410.dropLure(bx, bz, 'food', 18);
    }
    try {
      if (typeof fxRing === 'function') fxRing(bx, bz, 0x9be03a, 3.5, 0.7);
      if (typeof floater === 'function') floater(bx, bz, 'ISCA DE CARNIÇA!', '#b8eb85', true);
      if (typeof sfx === 'function') sfx('step');
    } catch (_) {}
    toast('<b>[ISCA DE CARNIÇA]</b> Jogada no chão! Feras e carniceiros próximos foram atraídos e distraídos pelo cheiro.');
    save();
    return true;
  }

  /* ---------- Carregador GLB para recursos e modelos ---------- */
  const cache = new Map();
  let loader = null;
  function glb(name) {
    if (cache.has(name)) return cache.get(name);
    const p = new Promise(res => {
      if (!T.GLTFLoader) { res(null); return; }
      if (!loader) { loader = new T.GLTFLoader(); if (window.MeshoptDecoder) loader.setMeshoptDecoder(MeshoptDecoder); }
      const path = name.includes('/') ? 'models/' + name + '.glb?v=456' : 'models/m437/' + name + '.glb?v=456';
      loader.load(path, g => {
        const root = g.scene;
        root.traverse(o => {
          if (o.isMesh) {
            o.castShadow = true; o.receiveShadow = true;
            const mats = Array.isArray(o.material) ? o.material : [o.material];
            for (const m of mats) if (m && !m.userData?.srgb437) {
              m.userData = m.userData || {}; m.userData.srgb437 = true;
              m.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace('#include <encodings_fragment>', '#include <encodings_fragment>\ngl_FragColor=LinearTosRGB(gl_FragColor);'); };
              m.customProgramCacheKey = () => 'm437-srgb';
            }
          }
        });
        const box = new T.Box3().setFromObject(root), sz = new T.Vector3(), ct = new T.Vector3();
        box.getSize(sz); box.getCenter(ct);
        const wrap = new T.Group();
        root.position.set(-ct.x, -box.min.y, -ct.z);
        wrap.add(root);
        wrap.userData = { h: Math.max(0.05, sz.y), w: Math.max(0.05, sz.x, sz.z) };
        res(wrap);
      }, undefined, () => res(null));
    });
    cache.set(name, p);
    return p;
  }
  function fit(tpl, h, maxW) {
    const c = tpl.clone(true);
    let s = h / (tpl.userData.h || 1);
    if (maxW && (tpl.userData.w || 1) * s > maxW) s = maxW / tpl.userData.w;
    c.scale.setScalar(s);
    return c;
  }

  /* ---------- Coleta Orgânica no Mundo e nas Fendas (Com Regeneração Natural) ---------- */
  const CELL = 26, RADIUS = 2;
  const nodes = new Map();
  let lastCellKey = '';
  const hash = (a, b, c) => {
    let n = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b ^ 0xc2b2ae35, 0x27d4eb2f) ^ Math.imul(c, 0x165667b1);
    n = Math.imul(n ^ (n >>> 15), 0x85ebca6b);
    return ((n ^ (n >>> 13)) >>> 0) / 4294967296;
  };
  function nearAnyCity(x, z, pad = 18) {
    try {
      const c = nearestCity(x, z);
      if (c && c.d < (typeof CITYR !== 'undefined' ? CITYR : 42) + pad) return true;
    } catch (_) {}
    return false;
  }
  function cellDef(cx, cz) {
    const out = [];
    for (let i = 0; i < 4; i++) {
      const r1 = hash(cx, cz, i * 7 + 1), r2 = hash(cx, cz, i * 7 + 2), r3 = hash(cx, cz, i * 7 + 3);
      if (r3 < 0.32) continue;
      const x = (cx + r1) * CELL, z = (cz + r2) * CELL;
      if (nearAnyCity(x, z, 14)) continue;
      try { if (typeof inWater244 === 'function' && inWater244(x, z)) continue; } catch (_) {}
      let bio = 'campos';
      try { bio = biomeAt(x, z); } catch (_) {}
      const sel = hash(cx, cz, i * 7 + 4);
      let kind = 'galho';
      if (sel < 0.24) kind = 'galho';
      else if (sel < 0.44) kind = 'pedra';
      else if (sel < 0.64) kind = (bio === 'deserto') ? 'pedra' : 'arbusto';
      else if (sel < 0.80) kind = (bio === 'vulcao') ? 'pedra' : 'erva';
      else if (sel < 0.92) kind = (bio === 'pantano' || bio === 'floresta' || bio === 'cristal') ? 'cogu' : 'arbusto';
      else kind = 'rocha';
      out.push({ id: cx + ',' + cz + ':' + i, kind, x, z, bio, ry: hash(cx, cz, i * 7 + 5) * TAU, s: 0.85 + hash(cx, cz, i * 7 + 6) * 0.35 });
    }
    return out;
  }

  const NODE_META = {
    galho:   { glb: 'feixe-lenha', h: 0.42, w: 0.9,  r: 2.2, label: 'F · APANHAR GALHOS SECOS' },
    pedra:   { glb: 'pedra-lasca', h: 0.38, w: 0.75, r: 2.2, label: 'F · APANHAR PEDRAS SOLTAS' },
    arbusto: { glb: 'arbusto',     h: 1.05, w: 1.35, r: 2.4, label: 'F · COLHER FRUTAS E FIBRAS' },
    erva:    { glb: 'ervas',       h: 0.55, w: 0.85, r: 2.2, label: 'F · COLHER ERVAS MEDICINAIS' },
    cogu:    { glb: 'ervas',       h: 0.48, w: 0.75, r: 2.2, label: 'F · COLHER COGUMELOS SILVESTRES' },
    rocha:   { glb: 'pedra-lasca', h: 1.15, w: 1.75, r: 2.6, label: 'F · QUEBRAR ROCHA (Picareta)' }
  };

  function spawnNode(d) {
    const m = NODE_META[d.kind]; if (!m) return;
    const g = new T.Group();
    g.position.set(d.x, H(d.x, d.z), d.z);
    g.rotation.y = d.ry;
    g.userData.terrainAbsolute245 = true;
    scene.add(g);
    glb(m.glb).then(tpl => {
      if (!tpl || !g.parent) return;
      const mesh = fit(tpl, m.h * d.s, m.w * d.s);
      if (d.kind === 'cogu') {
        mesh.traverse(o => { if (o.isMesh && o.material) { o.material = o.material.clone(); o.material.color.setHex(0xd8a878); } });
      }
      g.add(mesh);
    });
    const it = { type: 'surv437', x: d.x, z: d.z, r: m.r, label: m.label, nodeId: d.id, use: () => harvestNode(d) };
    L.inter.push(it);
    nodes.set(d.id, { d, g, it });
  }
  function removeNode(id) {
    const e = nodes.get(id); if (!e) return;
    if (e.g && e.g.parent) scene.remove(e.g);
    if (e.it && L?.inter) { const i = L.inter.indexOf(e.it); if (i >= 0) L.inter.splice(i, 1); }
    nodes.delete(id);
  }
  function clearNodes() {
    for (const id of [...nodes.keys()]) removeNode(id);
    lastCellKey = '';
  }

  function harvestNode(d) {
    const s = S(); if (!s) return;
    if (d.kind === 'rocha') {
      if (!count('picareta')) {
        toast('Você precisa de uma <b>Picareta Rústica</b> para quebrar esta rocha. Fabrique uma à mão [V].');
        return;
      }
      useTool('picareta', 1);
      add('pedra', 3, true);
      add('lasca', 1, true);
      if (d.bio === 'neve' || d.bio === 'cristal' || Math.random() < 0.45) {
        add('cristal_frio', 1, true);
        floater(d.x, d.z, '+3 Pedras · +1 Lasca · +1 Cristal Frio', '#9fd8ff', true);
      } else {
        add('resina', 1, true);
        floater(d.x, d.z, '+3 Pedras · +1 Lasca · +1 Sal/Resina', '#d8cfbf', true);
      }
      try { sfx('mine'); if (window.Anim303) Anim303.play('picareta', 1.1); } catch (_) {}
      TR('for');
    } else if (d.kind === 'galho') {
      const n = 2 + (Math.random() < 0.5 ? 1 : 0);
      add('galho', n, true);
      if (Math.random() < 0.35) add('resina', 1, true);
      floater(d.x, d.z, '+' + n + ' Galhos', '#d8c39e', true);
      try { sfx('step'); if (window.Anim303) Anim303.play('palma', 1.2); } catch (_) {}
    } else if (d.kind === 'pedra') {
      add('pedra', 2, true);
      if (Math.random() < 0.35) add('lasca', 1, true);
      if (d.bio === 'neve' || d.bio === 'cristal') add('cristal_frio', 1, true);
      floater(d.x, d.z, '+2 Pedras', '#c8c8d0', true);
      try { sfx('step'); if (window.Anim303) Anim303.play('palma', 1.2); } catch (_) {}
    } else if (d.kind === 'arbusto') {
      add('fibra', 2 + (Math.random() < 0.5 ? 1 : 0), true);
      add('fruta', 2, true);
      if (Math.random() < 0.4) add('galho', 1, true);
      floater(d.x, d.z, '+2 Frutas · +Fibras', '#8fe388', true);
      try { sfx('step'); if (window.Anim303) Anim303.play('palma', 1.2); } catch (_) {}
    } else if (d.kind === 'erva') {
      add('erva', 2, true);
      add('fibra', 1, true);
      floater(d.x, d.z, '+2 Ervas Medicinais', '#6fe39a', true);
      try { sfx('step'); if (window.Anim303) Anim303.play('palma', 1.2); } catch (_) {}
    } else if (d.kind === 'cogu') {
      add('cogu_bom', 2, true);
      floater(d.x, d.z, '+2 Cogumelos Comestíveis', '#e0c898', true);
      try { sfx('step'); if (window.Anim303) Anim303.play('palma', 1.2); } catch (_) {}
    }
    // v462 Percepção: coleta extra e achado raro; colher treina Percepção
    const main = { rocha: 'pedra', galho: 'galho', pedra: 'pedra', arbusto: 'fruta', erva: 'erva', cogu: 'cogu_bom' }[d.kind];
    if (main && Math.random() < A('gatherExtra')) { add(main, 1, true); floater(d.x, d.z, '+1 ' + ITEMS[main].n + ' (Percepção)', '#ffd76a'); }
    if (Math.random() < A('gatherRare')) { const rare = d.bio === 'neve' || d.bio === 'cristal' ? 'cristal_frio' : Math.random() < .5 ? 'erva' : 'resina'; add(rare, 1, true); floater(d.x, d.z, 'ACHADO RARO: ' + ITEMS[rare].n, '#ffd76a', true); }
    TR('per');
    // Coleta orgânica com regeneração natural em 1 dia de jogo
    s.picked[d.id] = s.clock + DAY();
    removeNode(d.id);
    save();
  }

  /* ---------- Corte de Lenha com Regeneração Natural de Tocos ---------- */
  let treeInter = null;
  const _mat4 = new T.Matrix4(), _pos = new T.Vector3(), _quat = new T.Quaternion(), _scl = new T.Vector3();
  const stumps456 = new Map();

  function spawnStumpVisual(key, x, z) {
    if (stumps456.has(key) || typeof scene === 'undefined' || !scene) return;
    const g = new T.Group();
    g.position.set(x, H(x, z), z);
    g.userData.terrainAbsolute245 = true;
    const cyl = new T.Mesh(
      new T.CylinderGeometry(0.32, 0.42, 0.38, 8),
      new T.MeshStandardMaterial({ color: 0x5c4028, roughness: 0.92 })
    );
    cyl.position.y = 0.19;
    g.add(cyl);
    scene.add(g);
    stumps456.set(key, g);
  }
  function removeStumpVisual(key) {
    const g = stumps456.get(key);
    if (g) { if (g.parent) scene.remove(g); stumps456.delete(key); }
  }

  function findNearestTree() {
    if (!ready() || L.mode !== 'world') return null;
    const s = S();
    let best = null, bd = 4.2;
    scene.traverse(o => {
      if (!o.isInstancedMesh || !['oak', 'willow', 'fir', 'palm', 'dead', 'cherry'].includes(o.userData?.tripo153)) return;
      for (let i = 0; i < o.count; i++) {
        o.getMatrixAt(i, _mat4);
        _pos.setFromMatrixPosition(_mat4);
        _scl.setFromMatrixScale(_mat4);
        if (_scl.y < 0.05) continue;
        const key = Math.round(_pos.x) + ':' + Math.round(_pos.z);
        const exp = s.felled[key];
        // Regeneração natural: se já passou o tempo (ou era flag antiga 1), a árvore volta!
        if (exp) {
          if (exp === 1 || exp <= s.clock) {
            delete s.felled[key];
            removeStumpVisual(key);
          } else {
            o.setMatrixAt(i, new T.Matrix4().makeScale(0, 0, 0));
            o.instanceMatrix.needsUpdate = true;
            spawnStumpVisual(key, _pos.x, _pos.z);
            continue;
          }
        }
        const d = Math.hypot(_pos.x - player.x, _pos.z - player.z);
        if (d < bd && !nearAnyCity(_pos.x, _pos.z, 18)) {
          bd = d;
          best = { mesh: o, idx: i, x: _pos.x, z: _pos.z, key };
        }
      }
    });
    return best;
  }

  function chopTree(tr) {
    const s = S(); if (!s || !tr) return;
    if (!count('machado')) {
      add('galho', 2, true);
      if (Math.random() < 0.5) add('resina', 1, true);
      floater(tr.x, tr.z, '+2 Galhos (use Machado para Toras/Lenha)', '#d8c39e', true);
      try { if (window.Anim303) Anim303.play('palma', 1.1); sfx('step'); } catch (_) {}
      return;
    }
    tr. hits = (tr.hits || 0) + 1;
    try { if (window.Anim303) Anim303.play('machado', 1.15); sfx('hit'); shake(0.1); } catch (_) {}
    useTool('machado', 1);
    // Toco regenera naturalmente após 1 dia de jogo (sem desmatar permanentemente!)
    s.felled[tr.key] = s.clock + DAY();
    tr.mesh.setMatrixAt(tr.idx, new T.Matrix4().makeScale(0, 0, 0));
    tr.mesh.instanceMatrix.needsUpdate = true;
    spawnStumpVisual(tr.key, tr.x, tr.z);
    add('tora', 1, true);
    add('lenha', 2, true);
    if (Math.random() < A('chopExtra')) { add('lenha', 1, true); floater(tr.x, tr.z, '+1 Lenha (Força)', '#ffd76a'); }
    TR('for');
    add('galho', 2, true);
    if (Math.random() < 0.65) add('resina', 1, true);
    floater(tr.x, tr.z, '+1 Tora · +2 Lenhas · +2 Galhos (regenera em 1 dia)', '#d8b37a', true);
    if (treeInter) { const k = L.inter.indexOf(treeInter); if (k >= 0) L.inter.splice(k, 1); treeInter = null; }
    save();
  }

  /* ---------- Água, Pesca, Temperatura e Cantis ---------- */
  let waterInter = null;
  function nearFreshWater() {
    if (!ready()) return null;
    if (L.mode === 'dungeon') {
      // Dentro das Fendas (Outros Mundos): goteiras de caverna ou poças abissais perto das bordas/veios
      if (L.inter && L.inter.some(it => (it.type === 'vein' || it.type === 'riftCampWater456') && Math.hypot(it.x - player.x, it.z - player.z) < 5.5)) {
        return { x: player.x, z: player.z, sea: false, caveDrip: true };
      }
      return null;
    }
    try {
      if (window.TER245?.SEA439 && TER245.SEA439.d(player.x, player.z) > -14) {
        return { x: player.x, z: player.z, sea: true };
      }
      if (typeof inWater244 === 'function' && inWater244(player.x, player.z)) return { x: player.x, z: player.z, sea: false };
      const cx = Math.round(player.x / CH), cz = Math.round(player.z / CH);
      for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
        if (typeof lakeAt239 === 'function') {
          const lk = lakeAt239(cx + dx, cz + dz);
          if (lk && Math.hypot(player.x - lk.x, player.z - lk.z) < lk.r + 5.5) return { x: player.x, z: player.z, sea: false };
        }
      }
    } catch (_) {}
    return null;
  }

  function fillCanteen(sea = false) {
    const s = S(); if (!s) return false;
    if (!count('cantil') && !count('cantil_ferro') && !count('cantil_termico')) {
      toast('Você precisa de um <b>Cantil / Odre</b> para guardar água.');
      return false;
    }
    s.canteen.max = canteenMaxSips();
    s.canteen.sips = s.canteen.max;
    s.canteen.kind = sea ? 'salgada' : 'suja';
    s.canteen.potency = 0;
    s.canteen.frozen = false;
    try { sfx('step'); } catch (_) {}
    toast(sea
      ? '<b>[CANTIL]</b> Cheio com <b>Água Salgada</b> (' + s.canteen.max + ' goles). Destile numa <b>Fogueira</b> antes de beber!'
      : '<b>[CANTIL]</b> Cheio com <b>Água Bruta</b> (' + s.canteen.max + ' goles). Ferva na <b>Fogueira</b> para eliminar Parasitas/Corrupção!');
    save();
    return true;
  }

  function fishAtWater() {
    const s = S(); if (!s) return false;
    if (!count('vara')) {
      toast('Equipe/fabrique uma <b>Vara de Pesca</b> na Bancada Rústica para pescar.');
      return false;
    }
    useTool('vara', 1);
    add('peixe_cru', 1, true);
    TR('des');
    try { sfx('coin'); floater(player.x, player.z, '+1 Peixe Cru', '#7fd8ff', true); } catch (_) {}
    toast('<b>[PESCA]</b> Você pescou 1 <b>Peixe Cru</b>! Asse na Fogueira ou defume no Varal Portátil.');
    save();
    return true;
  }

  function boilCanteen(withHerb = false, asAntidote = false) {
    const s = S(); if (!s) return false;
    if (s.canteen.sips <= 0 && !s.canteen.frozen) {
      toast('Seu cantil está vazio. Encha-o num rio, lago, mar ou goteira primeiro.');
      return false;
    }
    const tier = canteenTier();
    if (s.canteen.frozen) {
      s.canteen.frozen = false;
      s.canteen.freezeP = 0;
      toast('<b>[FOGUEIRA]</b> O gelo do seu Odre descongelou ao calor das chamas!');
    }
    if (withHerb || asAntidote) {
      if (count('erva') < 1) { toast('Você precisa de 1 <b>Erva Medicinal</b> para ferver Chá Térmico / Antídoto.'); return false; }
      take('erva', 1);
      TR('int');
      s.canteen.kind = asAntidote ? 'antidoto' : 'cha';
      s.canteen.potency = 100;
      toast(asAntidote
        ? '<b>[FOGUEIRA]</b> <b>Antídoto Quente</b> preparado (Potência 100%' + (tier === 3 ? ' · duração 3× no Cantil Térmico' : '') + ')!'
        : '<b>[FOGUEIRA]</b> <b>Chá Térmico</b> fervido (Potência/Calor 100%' + (tier === 3 ? ' · duração 3× no Cantil Térmico' : '') + ')!');
    } else {
      const wasSalt = s.canteen.kind === 'salgada';
      s.canteen.kind = 'limpa';
      s.canteen.potency = 0;
      toast(wasSalt
        ? '<b>[FOGUEIRA]</b> Água salgada <b>destilada</b> com sucesso' + (tier >= 2 ? ' (fervura rápida no Cantil de Ferro/Térmico)' : '') + '! 100% potável.'
        : '<b>[FOGUEIRA]</b> Água <b>fervida</b>' + (tier >= 2 ? ' na metade do tempo' : '') + '! 100% potável e livre de parasitas.');
    }
    try { sfx('coin'); } catch (_) {}
    save();
    return true;
  }
  const distillSeaWater = () => boilCanteen(false, false);

  function drinkCanteen() {
    const s = S(); if (!s) return false;
    if (s.canteen.frozen) {
      toast('<b>[ODRE CONGELADO]</b> A água congelou no frio extremo! Aqueça na Fogueira ou use um Cantil Térmico Isolado.');
      return false;
    }
    if (s.canteen.sips <= 0) {
      toast('Cantil vazio! Encha num rio, lago ou goteira de caverna.');
      return false;
    }
    if (s.canteen.kind === 'salgada') {
      toast('Não dá para beber <b>Água Salgada</b> pura! Destile-a numa <b>Fogueira</b> primeiro.');
      return false;
    }
    s.canteen.sips--;
    if (s.canteen.kind === 'cha' && (s.canteen.potency || 0) > 0) {
      s.thirst = Math.min(100, s.thirst + 48);
      s.temp = Math.min(100, s.temp + 30);
      s.warmT = 240 * (canteenTier() === 3 ? 1.5 : 1) * (1 + A('tea'));
      s.sickT = 0; s.intoxT = 0;
      if (run) run.awake287 = Math.max(0, (run.awake287 || 0) - 360);
      player.hp = Math.min(player.maxhp, player.hp + Math.round(player.maxhp * 0.20));
      toast('<b>[CHÁ TÉRMICO · POTÊNCIA ' + Math.round(s.canteen.potency) + '%]</b> +48 Sede, aquece contra o frio extremo e reduz o Cansaço!');
    } else if (s.canteen.kind === 'antidoto' && (s.canteen.potency || 0) > 0) {
      s.thirst = Math.min(100, s.thirst + 45);
      s.sickT = 0; s.intoxT = 0; s.antidoteT = 240 * (1 + A('tea'));
      player.bleedT = 0;
      player.hp = Math.min(player.maxhp, player.hp + Math.round(player.maxhp * 0.25));
      toast('<b>[ANTÍDOTO QUENTE · POTÊNCIA ' + Math.round(s.canteen.potency) + '%]</b> Purificou parasitas, intoxicação e veneno!');
    } else if (s.canteen.kind === 'limpa' || ((s.canteen.kind === 'cha' || s.canteen.kind === 'antidoto') && (s.canteen.potency || 0) <= 0)) {
      s.canteen.kind = 'limpa';
      s.thirst = Math.min(100, s.thirst + 42);
      toast('Você bebeu <b>Água Fervida/Destilada</b> (+42 Sede). Restam ' + s.canteen.sips + ' goles.');
    } else {
      // Água Bruta: causa Parasitas / Corrupção
      s.thirst = Math.min(100, s.thirst + 22);
      s.sickT = 90;
      toast('<b>[PARASITAS / CORRUPÇÃO]</b> Você bebeu <b>Água Bruta</b> sem ferver! Seu corpo contraiu parasitas (-Vigor/Vida por 90s).');
    }
    try { sfx('pot'); } catch (_) {}
    save();
    return true;
  }

  /* ---------- Comer Alimento (Aplicando os 4 Estágios de Frescor) ---------- */
  function eat(id) {
    const s = S(), it = ITEMS[id];
    if (!s || !it || !count(id)) return false;
    if (id === 'pacote_lacrado') return unsealBundle();
    if (it.bait || id === 'isca_carnica' || id === 'estragada') {
      return throwBait();
    }
    if (it.heal) {
      take(id, 1);
      player.hp = Math.min(player.maxhp, player.hp + Math.round(player.maxhp * it.heal));
      if (it.stopBleed) player.bleedT = 0;
      floater(player.x, player.z, 'CURADO', '#6fe39a', true);
      try { sfx('pot'); } catch (_) {}
      save();
      return true;
    }
    if (!it.eat) return false;
    const pct = freshnessPct(id);
    const stg = freshStage(pct);
    if (stg.rotten) {
      take(id, 1);
      add('isca_carnica', 1, true);
      toast('<b>[PODRE · 0%]</b> Esta comida apodreceu completamente e virou <b>Isca de Carniça</b>!');
      return false;
    }
    take(id, 1);
    if (it.raw) {
      const gain = Math.max(2, Math.round(it.eat * stg.mul));
      s.hunger = Math.min(100, s.hunger + gain);
      s.sickT = 60;
      toast('<b>[COMIDA CRUA]</b> +' + gain + ' Fome, mas comer cru causou <b>Parasitas</b>! Asse na Fogueira ou seque no Varal.');
    } else if (stg.stage === 1) {
      // 1. Fresca (Verde · 100% a 60%): 100% saciedade + todos os bônus de Vida Máxima temporária e regeneração de Vigor
      s.hunger = Math.min(100, s.hunger + it.eat);
      if (it.water) s.thirst = Math.min(100, s.thirst + it.water);
      const bf = it.buff || { hpPct: 0.15, vigMult: 1.25, dur: 300 };
      s.foodBuff = { hpPct: bf.hpPct, vigMult: bf.vigMult, t: bf.dur, label: it.n };
      player.hp = Math.min(player.maxhp, player.hp + Math.round(player.maxhp * 0.20));
      toast('<b>[FRESCA · ' + pct + '%]</b> ' + it.n + ': +' + it.eat + ' Fome, +' + Math.round(bf.hpPct * 100) + '% Vida Máx e +' + Math.round((bf.vigMult - 1) * 100) + '% regen de Vigor!');
    } else if (stg.stage === 2) {
      // 2. Amanhecida / Passada (Amarela · 59% a 25%): recupera apenas 50% da fome normal e não concede buffs
      const gain = Math.max(1, Math.round(it.eat * 0.50));
      s.hunger = Math.min(100, s.hunger + gain);
      if (it.water) s.thirst = Math.min(100, s.thirst + Math.round(it.water * 0.5));
      toast('<b>[AMANHECIDA · ' + pct + '%]</b> ' + it.n + ' perdeu o frescor: recuperou apenas 50% da fome (+' + gain + ') e nenhum bônus.');
    } else {
      // 3. Estragada / Rançosa (Vermelha · 24% a 1%): recupera apenas 15% da fome e aplica intoxicação leve (2 min)
      const gain = Math.max(1, Math.round(it.eat * 0.15));
      s.hunger = Math.min(100, s.hunger + gain);
      s.intoxT = 120; // 2 minutos de intoxicação leve (reduz regen de Stamina/Vigor)
      toast('<b>[ESTRAGADA / RANÇOSA · ' + pct + '%]</b> ' + it.n + ' recuperou apenas 15% da fome (+' + gain + ') e causou <b>Intoxicação Leve</b> (-regen de Vigor por 2 min)!');
    }
    try { sfx('pot'); } catch (_) {}
    save();
    return true;
  }

  /* ---------- Fogueira / Bancada próximas (Funciona no Mundo e nas Fendas) ---------- */
  function nearStruct(kind, dist = 5.5) {
    const s = S(); if (!s || !player) return null;
    const inDun = typeof L !== 'undefined' && L && L.mode === 'dungeon';
    for (const b of s.built) {
      if (!!b.inDun !== inDun) continue;
      if ((kind === 'fogueira' && b.kind === 'fogueira' && (b.fuel || 0) > 0) || (kind !== 'fogueira' && b.kind === kind)) {
        if (Math.hypot(b.x - player.x, b.z - player.z) <= dist) return b;
      }
    }
    return null;
  }
  const nearFire = (dist = 7) => !!nearStruct('fogueira', dist);
  const nearCamp456 = (dist = 8) => {
    const s = S(); if (!s || !player) return false;
    const inDun = typeof L !== 'undefined' && L && L.mode === 'dungeon';
    return s.built.some(b => !!b.inDun === inDun && Math.hypot(b.x - player.x, b.z - player.z) <= dist);
  };

  function craft(recipeIdx) {
    const r = typeof recipeIdx === 'number' ? RECIPES[recipeIdx] : (RECIPES.find(x => x.id === recipeIdx && has(x.cost)) || RECIPES.find(x => x.id === recipeIdx));
    if (!r) return false;
    if (r.st === 'fogueira' && !nearFire(6)) {
      toast('Chegue perto de uma <b>Fogueira de Pedra e Lenha acesa</b> para preparar isto.');
      return false;
    }
    if (r.st === 'bancada' && !nearStruct('bancada', 6)) {
      toast('Chegue perto de uma <b>Bancada Rústica de Campo</b> [B] para fabricar isto.');
      return false;
    }
    if (!has(r.cost)) {
      toast('Materiais insuficientes.');
      return false;
    }
    // Se a receita consome um alimento perecível (ex: carne -> assada), começa com 100% de frescor (spoil = 0)
    for (const [k, n] of Object.entries(r.cost)) take(k, n);
    add(r.id, r.n, false, 0);
    // v462: cozinhar treina Inteligência; fabricar à mão/na Bancada treina Destreza e pode render 1 a mais
    if (r.st === 'fogueira') TR('int');
    else { TR('des'); if (!ITEMS[r.id].tool && !ITEMS[r.id].bagUpgrade && !ITEMS[r.id].cartUpgrade && Math.random() < A('craftExtra')) add(r.id, 1, false, 0); }
    try { sfx('coin'); } catch (_) {}
    return true;
  }

  /* ---------- Repulsão de Predadores Fotofóbicos pela Fogueira e Tocha ---------- */
  const PHOTOPHOBIC = new Set(['lobo', 'lobo_f', 'lobofendido', 'aranha', 'aranha_f', 'tecela', 'caveira', 'caveira_f', 'magote', 'magote_f', 'cogu', 'cogu_f', 'fantasma', 'fantasma_f', 'wraith', 'wraith_f', 'olhoerrante']);
  function repelPhotophobic(dt) {
    if (typeof enemies === 'undefined' || !enemies.length) return;
    const s = S(); if (!s) return;
    const inDun = typeof L !== 'undefined' && L && L.mode === 'dungeon';
    const nightOrDark = inDun || (typeof isNight === 'function' && isNight());
    if (!nightOrDark) return;
    const fires = s.built.filter(b => !!b.inDun === inDun && b.kind === 'fogueira' && (b.fuel || 0) > 0);
    const torchActive = s.torchOn && count('tocha') > 0 && player;
    if (!fires.length && !torchActive) return;

    for (const e of enemies) {
      if (!e || e.dead || e.isBoss || !PHOTOPHOBIC.has(e.kind)) continue;
      for (const f of fires) {
        const dx = e.x - f.x, dz = e.z - f.z, d = Math.hypot(dx, dz);
        if (d > 0.1 && d < 8.5) {
          const push = (8.5 - d) * 2.2 * dt;
          e.x += (dx / d) * push;
          e.z += (dz / d) * push;
          e.aggro = false;
          if (e.m?.root) e.m.root.position.set(e.x, H(e.x, e.z), e.z);
        }
      }
      if (torchActive && e.hp < e.maxhp * 0.9) {
        const dx = e.x - player.x, dz = e.z - player.z, d = Math.hypot(dx, dz);
        if (d > 0.1 && d < 4.5) {
          e.x += (dx / d) * 1.4 * dt;
          e.z += (dz / d) * 1.4 * dt;
        }
      }
    }
  }

  /* ---------- Simulação Contínua (Fome, Sede, Frescor, Água, Temperatura) ---------- */
  function tick(dt) {
    if (!ready() || paused || player.dead) return;
    const s = S(); if (!s) return;
    s.clock += dt;

    // Atualiza iscas de carniça no chão
    for (let i = activeBaits456.length - 1; i >= 0; i--) {
      activeBaits456[i].t -= dt;
      if (activeBaits456[i].t <= 0) {
        if (activeBaits456[i].g?.parent) scene.remove(activeBaits456[i].g);
        activeBaits456.splice(i, 1);
      }
    }

    // Fome e Sede
    const inC = L.mode === 'world' && typeof inCity === 'function' && inCity(player.x, player.z);
    const rate = inC ? 0.2 : 1;
    const vitSlow = 1 - A('hungerSlow'); // Vitalidade desacelera Fome e Sede
    s.hunger = Math.max(0, s.hunger - (100 / (DAY() * 1.35)) * dt * rate * vitSlow);
    let bio = 'campos';
    try { bio = L.mode === 'dungeon' ? (L.otherworld456?.bio || L.gate?.bio124 || 'cristal') : biomeAt(player.x, player.z); } catch (_) {}
    const hotMul = (bio === 'deserto' || bio === 'vulcao') ? 1.55 : 1;
    s.thirst = Math.max(0, s.thirst - (100 / (DAY() * 0.95)) * dt * rate * hotMul * vitSlow);

    // Temperatura corporal
    const night = L.mode === 'dungeon' || (typeof isNight === 'function' && isNight());
    let targetTemp = 50;
    if (bio === 'neve') targetTemp = night ? 8 : 20;
    else if (bio === 'cristal') targetTemp = night ? 24 : 34;
    else if (bio === 'deserto') targetTemp = night ? 32 : 82;
    else if (bio === 'vulcao') targetTemp = 88;
    else if (night) targetTemp = 36;
    if (targetTemp < 40 || targetTemp > 70) targetTemp += (50 - targetTemp) * A('climate'); // Resistência: frio de Ymiria e calor de Zahar
    if (nearFire(7.5)) targetTemp = Math.max(targetTemp, 62);
    if (s.torchOn && count('tocha') > 0) targetTemp = Math.max(targetTemp, 48);
    if (s.warmT > 0) { s.warmT -= dt; targetTemp = Math.max(targetTemp, 55); }
    if (s.antidoteT > 0) s.antidoteT -= dt;
    s.temp += (targetTemp - s.temp) * Math.min(1, dt * 0.08);

    // Tocha acesa
    if (s.torchOn) {
      if (!count('tocha')) s.torchOn = false;
      else useTool('tocha', dt * (1 - A('fuel'))); // Espírito: tocha rende mais
    }

    // Repulsão de predadores fotofóbicos
    repelPhotophobic(dt);

    // Cantil: Potência do Chá/Antídoto, Congelamento (Ymiria) e Evaporação (Zahar)
    const cTier = canteenTier();
    if ((s.canteen.kind === 'cha' || s.canteen.kind === 'antidoto') && (s.canteen.potency || 0) > 0) {
      // Cantil Térmico Isolado (tier 3) triplica a duração da potência dos chás medicinais!
      const potDur = (cTier === 3 ? 1800 : 600) * (1 + A('tea')); // Inteligência: chás duram mais
      s.canteen.potency = Math.max(0, s.canteen.potency - (100 / potDur) * dt);
      if (s.canteen.potency <= 0 && s.canteen.sips > 0) {
        s.canteen.kind = 'limpa';
        toast('<b>[CANTIL]</b> O chá medicinal esfriou e voltou a ser Água Limpa.');
      }
    }
    if (nearFire(6.5) && s.canteen.frozen) {
      s.canteen.frozen = false;
      s.canteen.freezeP = 0;
      toast('<b>[FOGUEIRA]</b> A água do seu Odre descongelou ao calor da fogueira.');
    }
    if (cTier === 1 && s.canteen.sips > 0) {
      // Odre de Couro Simples: congela no frio extremo de Ymiria e evapora mais rápido em Zahar
      if (bio === 'neve' && !nearFire(7.5) && s.warmT <= 0 && !s.canteen.frozen) {
        s.canteen.freezeP = (s.canteen.freezeP || 0) + dt;
        if (s.canteen.freezeP >= 45) {
          s.canteen.frozen = true;
          s.canteen.freezeP = 0;
          toast('<b>[FRIO DE YMIRIA]</b> A água do seu <b>Odre de Couro Simples</b> congelou! Aqueça na Fogueira ou fabrique um Cantil Térmico.');
        }
      } else {
        s.canteen.freezeP = Math.max(0, (s.canteen.freezeP || 0) - dt * 2);
      }
      if ((bio === 'deserto' || bio === 'vulcao') && !s.canteen.frozen) {
        s.canteen.evapP = (s.canteen.evapP || 0) + dt;
        if (s.canteen.evapP >= 140) {
          s.canteen.evapP = 0;
          s.canteen.sips = Math.max(0, s.canteen.sips - 1);
          toast('<b>[CALOR DE ZAHAR]</b> 1 gole evaporou do seu Odre de Couro Simples!');
        }
      }
    } else if (cTier === 3) {
      s.canteen.frozen = false;
      s.canteen.freezeP = 0;
      s.canteen.evapP = 0;
    }

    // Apodrecimento de comida na mochila (4 Estágios -> 0% vira Isca de Carniça)
    const mult = spoilMult(false) * ((bio === 'deserto' || bio === 'vulcao') && !(s.inv.mochila_termica > 0) ? 1.25 : 1);
    for (const k of Object.keys(s.inv)) {
      const it = ITEMS[k];
      if (!it || !it.spoilDays || s.inv[k] <= 0) continue;
      s.spoil[k] = (s.spoil[k] || 0) + dt * mult;
      const limit = maxSpoilSec(k);
      if (s.spoil[k] >= limit) {
        s.spoil[k] = 0;
        take(k, 1);
        add('isca_carnica', 1, true);
        toast('<b>[COMIDA PODRE · 0%]</b> 1× ' + it.n + ' apodreceu e virou <b>Isca de Carniça</b> (jogue com [G] para atrair feras)!');
      }
    }

    // Apodrecimento de comida na Caixa de Salmoura do Carrinho de Carga (75% mais devagar!)
    if (run.cart437 && run.cart437.inv) {
      const c = run.cart437;
      c.spoil = c.spoil || {};
      const cMult = spoilMult(true); // 0.25x
      for (const k of Object.keys(c.inv)) {
        const it = ITEMS[k];
        if (!it || !it.spoilDays || c.inv[k] <= 0) continue;
        c.spoil[k] = (c.spoil[k] || 0) + dt * cMult;
        if (c.spoil[k] >= maxSpoilSec(k)) {
          c.spoil[k] = 0;
          c.inv[k]--;
          if (c.inv[k] <= 0) { delete c.inv[k]; delete c.spoil[k]; }
          c.inv.isca_carnica = (c.inv.isca_carnica || 0) + 1;
        }
      }
    }

    // Buff de Comida Fresca (Vida Máxima temporária + regeneração de Vigor)
    if (s.foodBuff && s.foodBuff.t > 0) {
      s.foodBuff.t -= dt;
      run.wellFed437 = s.foodBuff.t;
      if (player.sprint372 && !player.sprint372.running) {
        player.stamina372 = Math.min(player.maxStamina372 || 100, (player.stamina372 || 0) + dt * 8 * (s.foodBuff.vigMult - 1));
      }
      if (s.foodBuff.t <= 0) { s.foodBuff = null; run.wellFed437 = 0; }
    } else {
      run.wellFed437 = 0;
    }

    // Penalidades de Parasitas, Intoxicação, Fome 0 e Sede 0
    const willMul = 1 / Math.max(.2, 1 - A('intox')); // Vontade: parasitas e intoxicação passam mais rápido
    if (s.sickT > 0) {
      s.sickT -= dt * willMul;
      if (Math.random() < dt * 0.25) player.hp = Math.max(1, player.hp - Math.max(1, Math.round(player.maxhp * 0.012)));
    }
    if (s.intoxT > 0) {
      s.intoxT -= dt * willMul;
      if (player.sprint372 && typeof player.stamina372 === 'number') {
        player.stamina372 = Math.max(0, player.stamina372 - dt * 4.5);
      }
    }
    if (s.hunger <= 0 || s.thirst <= 0) {
      s.starveAcc = (s.starveAcc || 0) + dt;
      if (s.starveAcc >= 4) {
        s.starveAcc = 0;
        const dmg = Math.max(1, Math.round(player.maxhp * (s.thirst <= 0 ? 0.03 : 0.018) * (1 - A('starve')))); // Vontade
        player.hp = Math.max(1, player.hp - dmg);
        floater(player.x, player.z, s.thirst <= 0 ? 'SEDE EXTREMA' : 'FOME EXTREMA', '#ff5d5d');
      }
    }
  }

  /* ---------- Streaming de nós de coleta e interação ---------- */
  function updateStream() {
    if (!ready()) return;
    if (L.mode !== 'world') {
      if (nodes.size) clearNodes();
      if (treeInter) { const k = L.inter.indexOf(treeInter); if (k >= 0) L.inter.splice(k, 1); treeInter = null; }
    } else {
      const s = S();
      const cx = Math.floor(player.x / CELL), cz = Math.floor(player.z / CELL);
      const key = cx + ',' + cz;
      if (key !== lastCellKey) {
        lastCellKey = key;
        const keep = new Set();
        for (let dx = -RADIUS; dx <= RADIUS; dx++) {
          for (let dz = -RADIUS; dz <= RADIUS; dz++) {
            for (const d of cellDef(cx + dx, cz + dz)) {
              if ((s.picked[d.id] || 0) > s.clock) continue;
              keep.add(d.id);
              if (!nodes.has(d.id)) spawnNode(d);
            }
          }
        }
        for (const id of [...nodes.keys()]) if (!keep.has(id)) removeNode(id);
      }
      // Interação com árvore próxima
      const tr = findNearestTree();
      if (tr) {
        const lbl = count('machado') ? 'F · CORTAR ÁRVORE (Machado)' : 'F · COLHER GALHOS E RESINA';
        if (!treeInter) {
          treeInter = { type: 'tree437', x: tr.x, z: tr.z, r: 3.4, label: lbl, use: () => chopTree(tr) };
          L.inter.push(treeInter);
        } else {
          treeInter.x = tr.x; treeInter.z = tr.z; treeInter.label = lbl; treeInter.use = () => chopTree(tr);
          if (!L.inter.includes(treeInter)) L.inter.push(treeInter);
        }
      } else if (treeInter) {
        const k = L.inter.indexOf(treeInter); if (k >= 0) L.inter.splice(k, 1);
        treeInter = null;
      }
    }

    // Interação com água próxima (funciona na superfície e em goteiras/poças nas Fendas)
    const wPos = nearFreshWater();
    if (wPos) {
      const sea = !!wPos.sea;
      const drip = !!wPos.caveDrip;
      const hasRod = count('vara') > 0;
      const lbl = sea
        ? (hasRod ? 'F · PESCAR OU RECOLHER ÁGUA SALGADA' : 'F · RECOLHER ÁGUA SALGADA (DESTILAR NA FOGUEIRA)')
        : drip
          ? (hasRod ? 'F · PESCAR POÇA ABISSAL / GOTEIRA DA FENDA' : 'F · COLHER ÁGUA DE GOTEIRA DA FENDA')
          : (hasRod ? 'F · PESCAR / ENCHER CANTIL' : 'F · ENCHER CANTIL OU BEBER ÁGUA');
      if (!waterInter) {
        waterInter = { type: 'water437', x: wPos.x, z: wPos.z, r: 3.5, label: lbl, use: () => openWaterModal(sea, drip) };
        L.inter.push(waterInter);
      } else {
        waterInter.x = wPos.x; waterInter.z = wPos.z; waterInter.label = lbl; waterInter.use = () => openWaterModal(sea, drip);
        if (!L.inter.includes(waterInter)) L.inter.push(waterInter);
      }
    } else if (waterInter) {
      const k = L.inter.indexOf(waterInter); if (k >= 0) L.inter.splice(k, 1);
      waterInter = null;
    }
  }

  function openWaterModal(sea = false, drip = false) {
    const s = S(); if (!s) return;
    const tierName = ['', 'Odre de Couro Simples', 'Cantil de Ferro', 'Cantil Térmico Isolado'][canteenTier()];
    let h = '<div class="sysline">' + (sea
      ? 'Água do Mar de Thalor. Salgada demais para beber direto — recolha no cantil e <b>destile numa Fogueira</b>.'
      : drip
        ? 'Goteira mineral e poça subterrânea da Fenda. Contém <b>Água Bruta</b> — ferva na Fogueira do seu Acampamento Portátil!'
        : 'Beber água bruta direto do rio/lago causa <b>Parasitas</b>. Use o <b>' + tierName + '</b> e ferva na Fogueira.') + '</div>';
    if (!sea) {
      h += row('Beber Água Bruta Direto', '+22 Sede, mas causa Parasitas por 90 segundos.', '<button class="btn" id="w437raw">Beber Bruta</button>');
    }
    h += row(sea ? 'Encher com Água Salgada' : 'Encher ' + tierName, 'Guarda ' + canteenMaxSips() + ' goles para ferver ou destilar na Fogueira.', '<button class="btn hot" id="w437fill">Encher Cantil</button>');
    if (count('vara') > 0) {
      h += row('Pescar com Vara', 'Tenta fisgar Peixe Cru para assar na Fogueira ou defumar no Varal Portátil.', '<button class="btn hot" id="w437fish">Pescar</button>');
    }
    openModal(sea ? 'ÁGUA DO MAR & PESCA' : drip ? 'FONTE DA FENDA' : 'ÁGUA E PESCA', h);
    const bRaw = document.getElementById('w437raw');
    if (bRaw) bRaw.onclick = () => { s.thirst = Math.min(100, s.thirst + 22); s.sickT = 90; toast('Você bebeu água bruta (+22 Sede) e contraiu Parasitas!'); closeModal(); save(); };
    const bFill = document.getElementById('w437fill');
    if (bFill) bFill.onclick = () => { if (fillCanteen(sea)) closeModal(); };
    const bFish = document.getElementById('w437fish');
    if (bFish) bFish.onclick = () => { fishAtWater(); closeModal(); };
  }

  /* ---------- Drops de caça ao abater criaturas ---------- */
  const origKill = typeof killEnemy === 'function' ? killEnemy : null;
  if (origKill) {
    killEnemy = function (e) {
      const wasAlive = e && !e.dead;
      const r = origKill.apply(this, arguments);
      try {
        if (wasAlive && e.dead && !e.ally && !e.statue) {
          const k = (e.kind || '').replace(/_[fa]$/, '');
          if (['coelho', 'alpaca', 'alpacaimp', 'lobo', 'orc', 'orcinho', 'yeti', 'yetinho', 'dino', 'raptor', 'sapo', 'escaravelho'].includes(k)) {
            add('carne', ['dino', 'yeti', 'alpaca', 'alpacaimp'].includes(k) ? 2 : 1, true);
            if (Math.random() < 0.75) add('couro', 1, true);
            if (Math.random() < 0.5) add('osso', 1, true);
          } else if (['passaro', 'abelha', 'vespa', 'arraia'].includes(k)) {
            add('pena', 2, true);
            if (k === 'passaro') add('carne', 1, true);
          } else if (['peixinho', 'homempeixe', 'lula'].includes(k)) {
            add('peixe_cru', 1, true);
          } else if (['cogu', 'cogufuria', 'reicogu'].includes(k)) {
            add('cogu_bom', 1, true);
          } else if (['caveira', 'minion', 'warrior', 'rogue'].includes(k)) {
            add('osso', 1, true);
          }
          if (e.kind && /_f$|_a$/.test(e.kind) && Math.random() < 0.35) {
            add('cristal_frio', 1, true);
          }
        }
      } catch (_) {}
      return r;
    };
  }

  /* ---------- HUD & Janela Completa de Sobrevivência (Tecla V) ---------- */
  /* v462 (Ian): o widget do canto (🍖 💧) saiu; Fome e Sede ficam na Ficha (tools/attrs462.js). Tecla V abre a mochila. */
  function updateHud() { const el = document.getElementById('surv437hud'); if (el) el.remove(); }

  function freshnessBarHtml(id) {
    const it = ITEMS[id];
    if (!it || !it.spoilDays) return '';
    const pct = freshnessPct(id);
    const stg = freshStage(pct);
    return '<div style="margin-top:4px;display:flex;align-items:center;gap:6px">' +
      '<div style="flex:1;max-width:140px;height:6px;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.15);border-radius:3px;overflow:hidden">' +
        '<div style="width:' + pct + '%;height:100%;background:' + stg.col + '"></div>' +
      '</div>' +
      '<span style="font-size:11px;font-weight:700;color:' + stg.col + '">' + stg.name + ' · ' + pct + '%</span>' +
    '</div>';
  }

  function open(tab = 'inv') {
    const s = S(); if (!s) return;
    view = () => open(tab);
    const w = totalW(), mw = maxW();
    const fire = nearFire(6), bench = !!nearStruct('bancada', 6);
    const cTier = canteenTier();
    const tierLabel = ['', 'Odre de Couro Simples (Tier 1)', 'Cantil de Ferro (Tier 2)', 'Cantil Térmico Isolado (Tier 3)'][cTier];
    const kindLabel = { limpa: 'Água Fervida/Potável', cha: 'Chá Térmico Medicinal', antidoto: 'Antídoto de Ervas', suja: 'Água Bruta (não fervida)', salgada: 'Água Salgada (destilar)' }[s.canteen.kind] || 'Vazio';

    let h = '<div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">' +
      '<button class="btn ' + (tab === 'inv' ? 'hot' : '') + '" id="svTabInv">Mochila e cantil</button>' +
      '<button class="btn ' + (tab === 'craft' ? 'hot' : '') + '" id="svTabCraft">Artesanato & Bolsas (' + (bench ? 'Bancada' : fire ? 'Fogueira' : 'À Mão') + ')</button>' +
      '<button class="btn" id="svTabBuild">Acampamento Portátil [B]</button>' +
      (window.Cart437 ? '<button class="btn" id="svTabCart">Carrinho de Carga</button>' : '') +
      '</div>';

    const bagStatus = (s.inv.mochila_termica > 0)
      ? '<b style="color:#6fe39a">Mochila Térmica de Cristal Frio (-80% apodrecimento · imune ao Miasma)</b>'
      : (s.inv.alforje_sal > 0)
        ? '<b style="color:#ffd54f">Alforje de Couro Curado no Sal (-50% apodrecimento)</b>'
        : '<span style="opacity:.8">Sem bolsa térmica (apodrecimento normal · 2× mais rápido nas Fendas)</span>';

    h += '<div class="sysline">🍖 Fome: <b>' + Math.round(s.hunger) + '%</b> · 💧 Sede: <b>' + Math.round(s.thirst) + '%</b> · 🌡 Temp: <b>' + Math.round(s.temp) + '°</b> · ⚖ Carga: <b>' + w.toFixed(1) + ' / ' + Math.round(mw) + ' kg</b><br>' +
      '🎒 Conservação: ' + bagStatus +
      (s.foodBuff ? '<br><span style="color:#6fe39a">✨ Saciedade (' + s.foodBuff.label + '): +' + Math.round(s.foodBuff.hpPct * 100) + '% Vida Máx e +' + Math.round((s.foodBuff.vigMult - 1) * 100) + '% regen de Vigor (' + Math.ceil(s.foodBuff.t) + 's)</span>' : '') +
      (s.intoxT > 0 ? '<br><span style="color:#ff8fa3">⚠ Intoxicação Leve (comida rançosa): regeneração de Vigor reduzida (' + Math.ceil(s.intoxT) + 's)</span>' : '') +
      (s.sickT > 0 ? '<br><span style="color:#ff8fa3">☣ Parasitas/Corrupção: beba Chá Térmico, Antídoto ou Água Fervida! (' + Math.ceil(s.sickT) + 's)</span>' : '') +
      '</div>';

    h += '<details class="sysline"><summary>Como conservar comida e tratar água</summary><p>Fome e Sede mostram suas reservas: mantenha as barras cheias. Fresca (60–100%): efeito completo; amanhecida (25–59%): metade da nutrição, sem bônus; estragada (1–24%): pouca nutrição e intoxicação; podre (0%): não alimenta.</p><p>Alforje de Sal: deterioração 50% menor. Mochila Térmica: 80% menor e proteção contra Miasma. Carrinho: 75% menor para a comida guardada nele. Um pacote de resina interrompe a deterioração até ser aberto.</p><p>Encha o cantil em uma fonte. Na fogueira acesa, ferva água bruta ou destile água salgada. Água bruta causa Parasitas; a água tratada é segura. Odre: 4 goles; ferro: 8; térmico: 10, sem congelamento ou evaporação.</p><p>Acampamento [B]: fogueira para cozinhar e tratar água; tenda para descansar; varal para conservar carne e peixe; bancada para fabricar equipamentos. Recolha as estruturas antes de partir.</p></details>';
    if (tab === 'inv') {
      // Bloco do Cantil + Barra de Potência/Calor dos Chás
      const potBar = (s.canteen.kind === 'cha' || s.canteen.kind === 'antidoto') && s.canteen.potency > 0
        ? '<div style="margin-top:4px;display:flex;align-items:center;gap:6px"><div style="flex:1;max-width:160px;height:6px;background:#111;border:1px solid #ffb34766;border-radius:3px;overflow:hidden"><div style="width:' + Math.round(s.canteen.potency) + '%;height:100%;background:linear-gradient(90deg,#ff7a22,#ffd54f)"></div></div><span style="font-size:11px;color:#ffd54f">Potência/Calor: ' + Math.round(s.canteen.potency) + '%</span></div>'
        : '';
      const cActs = [];
      if (s.canteen.sips > 0 && !s.canteen.frozen) cActs.push('<button class="btn hot" id="svDrink">Beber (' + s.canteen.sips + '/' + s.canteen.max + ')</button>');
      if (fire && (s.canteen.sips > 0 || s.canteen.frozen)) {
        cActs.push('<button class="btn" id="svBoil">' + (s.canteen.frozen ? 'Descongelar' : s.canteen.kind === 'salgada' ? 'Destilar Água' : 'Ferver Água') + '</button>');
        if (count('erva') > 0) {
          cActs.push('<button class="btn hot" id="svTea">Chá Térmico</button>');
          cActs.push('<button class="btn" id="svAnti">Antídoto</button>');
        }
      }
      h += row('💧 ' + tierLabel, (s.canteen.frozen ? '<b style="color:#7fd8ff">🧊 ÁGUA CONGELADA (aqueça numa Fogueira)</b>' : s.canteen.sips > 0 ? s.canteen.sips + '/' + s.canteen.max + ' goles · <b>' + kindLabel + '</b>' : 'Vazio (encha num rio, lago, mar ou goteira)') + potBar, cActs.join(' '));

      // Bloco de Invólucro de Resina e Fibra
      if (count('involucro_resina') > 0 || count('pacote_lacrado') > 0) {
        const bActs = [];
        if (count('involucro_resina') > 0) bActs.push('<button class="btn hot" id="svSealWrap">Lacrar até 4 Refeições (0% perda)</button>');
        if (count('pacote_lacrado') > 0) bActs.push('<button class="btn hot" id="svUnsealWrap">Abrir Pacote (' + count('pacote_lacrado') + ')</button>');
        h += row('📦 Invólucros Herméticos de Resina', 'Preserva o frescor atual de até 4 refeições até abrir o pacote. Não recupera comida já estragada.', bActs.join(' '));
      }

      if (count('tocha') > 0) {
        h += row('🔥 Tocha de Resina', s.torchOn ? 'Acesa — iluminando, aquecendo e afastando predadores fotofóbicos' : 'Apagada na mochila', '<button class="btn ' + (s.torchOn ? 'hot' : '') + '" id="svTorch">' + (s.torchOn ? 'Apagar' : 'Acender') + '</button>');
      }

      const entries = Object.entries(s.inv).filter(([k, n]) => n > 0 && ITEMS[k]);
      if (!entries.length) {
        h += '<div class="sysline">Sua mochila de sobrevivência está vazia.</div>';
      } else {
        for (const [k, n] of entries) {
          const it = ITEMS[k];
          const act = [];
          if (k === 'pacote_lacrado') act.push('<button class="btn hot" data-eat="' + k + '">Abrir Pacote</button>');
          else if (it.bait) act.push('<button class="btn hot" data-bait="' + k + '">Jogar Isca [G]</button>');
          else if (it.eat || it.heal) act.push('<button class="btn hot" data-eat="' + k + '">' + (it.heal ? 'Usar' : 'Comer') + '</button>');
          if (fire && k === 'carne') act.push('<button class="btn" data-cook="assada">Assar</button>');
          if (fire && k === 'peixe_cru') act.push('<button class="btn" data-cook="peixe_assado">Assar</button>');
          if (fire && k === 'cogu_bom') act.push('<button class="btn" data-cook="cogu_assado">Assar</button>');
          act.push('<button class="btn" data-drop="' + k + '">Largar 1</button>');
          h += row('<b>' + it.n + '</b> ×' + n + ' <small>(' + (it.w * n).toFixed(1) + ' kg)</small>', it.d + freshnessBarHtml(k), act.join(' '));
        }
      }
    } else if (tab === 'craft') {
      h += '<div class="sysline">Estações ativas perto de você: <b>À mão</b>' + (fire ? ' · <b style="color:#ffb347">🔥 Fogueira Acesa</b>' : '') + (bench ? ' · <b style="color:#a8e6a1">🔨 Bancada Rústica de Campo</b>' : ' · <span style="opacity:.65">(Monte uma Bancada Rústica [B] para fazer Bolsas de Conservação, Cantis e Arco)</span>') + '</div>';
      RECIPES.forEach((r, idx) => {
        const it = ITEMS[r.id];
        const costTxt = Object.entries(r.cost).map(([ck, cn]) => {
          const have = count(ck);
          return '<span style="color:' + (have >= cn ? '#a8e6a1' : '#ff8fa3') + '">' + (ITEMS[ck]?.n || ck) + ' ' + have + '/' + cn + '</span>';
        }).join(' · ');
        const stOk = r.st === 'mao' || (r.st === 'fogueira' && fire) || (r.st === 'bancada' && bench);
        const can = stOk && has(r.cost);
        const stTag = r.st === 'fogueira' ? '🔥 Fogueira' : r.st === 'bancada' ? '🔨 Bancada' : '✋ À mão';
        h += row('<b>' + it.n + '</b>' + (r.n > 1 ? ' ×' + r.n : '') + ' <small>[' + stTag + ']</small>', r.desc + '<br>' + costTxt, '<button class="btn ' + (can ? 'hot' : '') + '" data-craft="' + idx + '" ' + (can ? '' : 'disabled') + '>Fabricar</button>');
      });
    }

    openModal('SUPRIMENTOS E SOBREVIVÊNCIA', h);
    const ti = document.getElementById('svTabInv'); if (ti) ti.onclick = () => open('inv');
    const tc = document.getElementById('svTabCraft'); if (tc) tc.onclick = () => open('craft');
    const tb = document.getElementById('svTabBuild'); if (tb) tb.onclick = () => { closeModal(); window.Build437?.open(); };
    const tcart = document.getElementById('svTabCart'); if (tcart) tcart.onclick = () => { closeModal(); window.Cart437?.open(); };
    const bDrink = document.getElementById('svDrink'); if (bDrink) bDrink.onclick = () => { drinkCanteen(); open(tab); };
    const bBoil = document.getElementById('svBoil'); if (bBoil) bBoil.onclick = () => { boilCanteen(false, false); open(tab); };
    const bTea = document.getElementById('svTea'); if (bTea) bTea.onclick = () => { boilCanteen(true, false); open(tab); };
    const bAnti = document.getElementById('svAnti'); if (bAnti) bAnti.onclick = () => { boilCanteen(true, true); open(tab); };
    const bSeal = document.getElementById('svSealWrap'); if (bSeal) bSeal.onclick = () => { sealBundle(); open(tab); };
    const bUnseal = document.getElementById('svUnsealWrap'); if (bUnseal) bUnseal.onclick = () => { unsealBundle(); open(tab); };
    const bTorch = document.getElementById('svTorch'); if (bTorch) bTorch.onclick = () => { s.torchOn = !s.torchOn; save(); open(tab); };

    document.querySelectorAll('#modal [data-eat]').forEach(b => b.onclick = () => { eat(b.dataset.eat); open(tab); });
    document.querySelectorAll('#modal [data-bait]').forEach(b => b.onclick = () => { closeModal(); throwBait(); });
    document.querySelectorAll('#modal [data-cook]').forEach(b => b.onclick = () => {
      const targetId = b.dataset.cook;
      const rIdx = RECIPES.findIndex(r => r.id === targetId && r.st === 'fogueira');
      if (rIdx >= 0) craft(rIdx);
      open(tab);
    });
    document.querySelectorAll('#modal [data-drop]').forEach(b => b.onclick = () => { take(b.dataset.drop, 1); open(tab); });
    document.querySelectorAll('#modal [data-craft]').forEach(b => b.onclick = () => { craft(+b.dataset.craft); open(tab); });
  }

  addEventListener('keydown', e => {
    if (e.repeat || !ready()) return;
    const t = e.target; if (t && ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return;
    if (e.code === 'KeyV' && !(typeof modalOpen !== 'undefined' && modalOpen)) {
      e.preventDefault();
      open('inv');
    } else if (e.code === 'KeyG' && !(typeof modalOpen !== 'undefined' && modalOpen)) {
      if (count('isca_carnica') > 0) {
        e.preventDefault();
        throwBait();
      }
    }
  });

  // Integra na velocidade do jogador e no máximo de HP temporário (bem alimentado)
  const origSpd = typeof spdMul === 'function' ? spdMul : null;
  if (origSpd) {
    spdMul = function () {
      return origSpd.apply(this, arguments) * overMul();
    };
  }

  let lastT = performance.now(), streamAcc = 0;
  setInterval(() => {
    const now = performance.now(), dt = Math.min(0.25, (now - lastT) / 1000);
    lastT = now;
    try {
      tick(dt);
      streamAcc += dt;
      if (streamAcc >= 0.45) { streamAcc = 0; updateStream(); updateHud(); }
    } catch (err) { console.warn('surv437', err); }
  }, 120);

  function give(id, n = 1, reason = '') {
    const got = add(id, n, false);
    if (got && reason && typeof toast === 'function') toast('<b>[SUPRIMENTO]</b> ' + reason);
    return got;
  }
  function levelTerrain() {
    // v456: terraplenagem desativada — relevo natural permanece 100% protegido
    return false;
  }

  window.Surv437 = {
    S, ITEMS, RECIPES, add, take, count, has, invW, maxW, totalW, overMul, canRun,
    craft, eat, drinkCanteen, fillCanteen, boilCanteen, distillSeaWater, useTool,
    open, nearFire, nearCamp456, glb, fit, save, nodes, give, levelTerrain,
    freshnessPct, freshStage, sealBundle, unsealBundle, throwBait,
    canteenTier, canteenMaxSips, spoilMult
  };
})();
