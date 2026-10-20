/* v470: Sistema de Autonomia e Sobrevivência Avançada (Ian, 19/10/2026):
   1. Alquimia com dezenas de matinhos/ervas botânicas nos biomas e fendas, Caldeirão de Alquimia no acampamento,
      poções de beber (cura, regeneração, vigor, vitalidade, resistência, luz) e frascos arremessáveis em área (veneno, ácido, fogo, fumaça, paralisia).
   2. Forja Rústica de Acampamento: fornalha e bigorna portátil para forjar armas combinando minérios, madeiras e partes de monstros.
   3. Fritar/assar espécies de peixe da pesca (lakeAt239 / run.fish) e peixe cru diretamente na fogueira portátil acesa com efeitos visuais e sonoros. */
(function () {
  'use strict';
  const T = THREE, TAU = Math.PI * 2;

  /* ---------- 1. INGREDIENTES BOTÂNICOS E ITENS DE ALQUIMIA ---------- */
  const BOTANICAL_ITEMS = {
    /* Matinhos, ervas, fungos e raízes */
    erva_cura:      { n: 'Erva-da-Vida',       w: 0.12, cat: 'mat', bio: ['campos', 'floresta'], d: 'Folhas medicinais frescas. Base para poções de cura imediata e compressas vitais.' },
    raiz_sangue:    { n: 'Raiz Sanguínea',     w: 0.20, cat: 'mat', bio: ['pantano', 'floresta'], d: 'Raiz espessa com seiva escarlate. Estimula vigor celular, coagulação e poções de regeneração contínua.' },
    cogu_venenoso:  { n: 'Esporo Venenoso',    w: 0.15, cat: 'mat', bio: ['pantano', 'fenda'],    d: 'Fungo tóxico colhido na umidade ou fendas. Ingrediente de venenos virulentos e frascos de lentidão.' },
    liquen_acido:   { n: 'Líquen Corrosivo',   w: 0.14, cat: 'mat', bio: ['vulcao', 'fenda'],     d: 'Líquen cáustico que dissolve rochas. Usado em frascos ácidos para corroer armaduras de inimigos.' },
    flor_brasa:     { n: 'Flor-de-Brasa',      w: 0.10, cat: 'mat', bio: ['vulcao', 'deserto'],   d: 'Pétalas incandescentes que retêm calor vulcânico. Base para fogo líquido e elixires térmicos.' },
    musgo_glacial:  { n: 'Musgo Glacial',      w: 0.10, cat: 'mat', bio: ['neve', 'cristal'],     d: 'Musgo congelado das montanhas de Ymiria. Protege contra calor extremo e fornece dano glacial.' },
    erva_vigor:     { n: 'Broto de Vigor',     w: 0.12, cat: 'mat', bio: ['campos', 'montanha'],  d: 'Broto silvestre enérgico. Concede estamina rápida, velocidade e tônicos de aceleração muscular.' },
    fungo_luz:      { n: 'Fungo Luminescente', w: 0.16, cat: 'mat', bio: ['fenda', 'caverna'],    d: 'Cogumelo brilhante das Fendas e abismos. Emite esporos paralisantes e luz estelar duradoura.' },
    folha_sombra:   { n: 'Orquídea Abissal',   w: 0.10, cat: 'mat', bio: ['fenda', 'sombra'],     d: 'Planta que se alimenta do Miasma. Libera fumaça densa que ofusca a visão e quebra perseguição de feras.' },
    flor_serena:    { n: 'Lírio Sereno',       w: 0.10, cat: 'mat', bio: ['campos', 'flores'],    d: 'Flor aromática relaxante. Amplia a Vida Máxima e estabiliza a mente contra o terror.' },

    /* Frascos e Recipientes */
    frasco_vazio:   { n: 'Frasco de Vidro Rústico', w: 0.15, cat: 'tool', d: 'Recipiente de vidro soprado com areia mineral e resina para alquimia e frascos arremessáveis.' },

    /* Poções de Beber */
    pocao_cura_forte:  { n: 'Poção de Cura Rápida',        w: 0.35, cat: 'food', d: 'Restaura instantaneamente +140 de Vida.', heal: 140, alchemy: true },
    pocao_regeneracao: { n: 'Elixir de Regeneração',       w: 0.35, cat: 'food', d: 'Regenera +20 de Vida por segundo durante 25 segundos.', alchemy: true, buff: { regenHp: 20, dur: 25 } },
    pocao_vigor:       { n: 'Tônico de Vigor e Disparada', w: 0.35, cat: 'food', d: 'Vigor inesgotável e +20% de velocidade de movimento por 60s.', alchemy: true, buff: { vigMult: 2.2, spd: 0.20, dur: 60 } },
    pocao_vitalidade:  { n: 'Infusão de Vida Máxima',      w: 0.40, cat: 'food', d: 'Aumenta a Vida Máxima em +35% durante 5 minutos.', alchemy: true, buff: { hpPct: 0.35, dur: 300 } },
    pocao_resistencia: { n: 'Elixir Térmico Elemental',    w: 0.35, cat: 'food', d: 'Blindagem total contra frio extremo, calor escaldante e Miasma de Fenda por 5 min.', alchemy: true, buff: { thermalImmune: true, miasmaImmune: true, dur: 300 } },
    pocao_luz:         { n: 'Elixir Luminescente',         w: 0.35, cat: 'food', d: 'Emite luz radiante ao redor do caçador e revela caminhos no escuro por 5 min.', alchemy: true, buff: { glow: true, dur: 300 } },

    /* Frascos Arremessáveis (Área) */
    frasco_veneno:   { n: 'Frasco de Veneno Asfixiante', w: 0.50, cat: 'tool', flask: 'veneno',   d: 'Arremesse nos inimigos ou no chão: explode em nuvem tóxica causando dano contínuo e -40% de lentidão por 8s.' },
    frasco_acido:    { n: 'Frasco de Ácido Corrosivo',   w: 0.50, cat: 'tool', flask: 'acido',    d: 'Arremesse para estilhaçar em ácido: dissolve armaduras inimigas, aumentando em +50% todo o dano recebido por 10s.' },
    frasco_fogo:     { n: 'Frasco de Fogo Líquido',      w: 0.50, cat: 'tool', flask: 'fogo',     d: 'Arremesse para criar poça incendiária: dano imediato de fogo e chamas intensas que queimam alvos que pisarem.' },
    frasco_fumaca:   { n: 'Frasco de Fumaça Ofuscante',  w: 0.45, cat: 'tool', flask: 'fumaca',   d: 'Arremesse para erguer cortina densa de fumaça: quebra perseguição de inimigos na área e permite fuga segura.' },
    frasco_paralisia:{ n: 'Frasco de Esporos Paralisantes', w: 0.50, cat: 'tool', flask: 'paralisia', d: 'Arremesse para dispersar esporos relampejantes: atordoa e paralisa todos os inimigos na área por 4s.' }
  };

  /* Registrar itens na tabela do Surv437 */
  function registerBotanicals() {
    if (window.Surv437 && Surv437.ITEMS) {
      for (const [k, v] of Object.entries(BOTANICAL_ITEMS)) {
        if (!Surv437.ITEMS[k]) Surv437.ITEMS[k] = v;
      }
    }
  }

  /* Receitas de Alquimia no Caldeirão */
  const ALCHEMY_RECIPES = [
    { id: 'frasco_vazio',        n: 2, cost: { pedra: 2, resina: 1 }, desc: 'Soprar 2 frascos de vidro rústico com minério e resina.' },
    { id: 'pocao_cura_forte',    n: 1, cost: { frasco_vazio: 1, erva_cura: 2, raiz_sangue: 1 }, desc: 'Poção de Cura Rápida: restaura +140 de Vida imediata.' },
    { id: 'pocao_regeneracao',   n: 1, cost: { frasco_vazio: 1, erva_cura: 1, flor_serena: 1, resina: 1 }, desc: 'Elixir de Regeneração: cura contínua de +20 HP/s por 25s.' },
    { id: 'pocao_vigor',         n: 1, cost: { frasco_vazio: 1, erva_vigor: 2, fruta: 2 }, desc: 'Tônico de Vigor: estamina infinita e +20% de velocidade por 60s.' },
    { id: 'pocao_vitalidade',    n: 1, cost: { frasco_vazio: 1, raiz_sangue: 2, flor_serena: 1, resina: 1 }, desc: 'Infusão de Vitalidade: +35% de Vida Máxima por 5 min.' },
    { id: 'pocao_resistencia',   n: 1, cost: { frasco_vazio: 1, flor_brasa: 1, musgo_glacial: 1, resina: 1 }, desc: 'Elixir Térmico: imunidade a frio de Ymiria, calor de Zahar e Miasma de Fenda.' },
    { id: 'pocao_luz',           n: 1, cost: { frasco_vazio: 1, fungo_luz: 2, cristal_frio: 1 }, desc: 'Elixir Luminescente: aura estelar que ilumina cavernas e fendas por 5 min.' },

    /* Frascos Arremessáveis */
    { id: 'frasco_veneno',       n: 1, cost: { frasco_vazio: 1, cogu_venenoso: 2, resina: 1 }, desc: 'Frasco de Veneno Asfixiante: nuvem tóxica em área (dano contínuo e lentidão).' },
    { id: 'frasco_acido',        n: 1, cost: { frasco_vazio: 1, liquen_acido: 2, lasca: 1 }, desc: 'Frasco de Ácido Corrosivo: corrói armaduras inimigas (-50% armadura por 10s).' },
    { id: 'frasco_fogo',         n: 1, cost: { frasco_vazio: 1, flor_brasa: 2, resina: 2 }, desc: 'Frasco de Fogo Líquido: explosão incendiária no solo com queima contínua.' },
    { id: 'frasco_fumaca',       n: 1, cost: { frasco_vazio: 1, folha_sombra: 2, galho: 1 }, desc: 'Frasco de Fumaça Ofuscante: cortina espessa que quebra o aggro dos inimigos.' },
    { id: 'frasco_paralisia',    n: 1, cost: { frasco_vazio: 1, fungo_luz: 2, erva_vigor: 1 }, desc: 'Frasco de Paralisia: esporos de choque que imobilizam inimigos por 4s.' }
  ];

  /* Efeitos ativos de poções / buffs de sobrevivência */
  const activeBuffs = {};
  function applyBuff(key, b) {
    if (!b) return;
    activeBuffs[key] = { ...b, t: b.dur || 60 };
    if (b.hpPct && typeof player !== 'undefined' && player) {
      if (typeof refreshStats === 'function') refreshStats();
      player.hp = Math.min(player.maxhp, player.hp + Math.round(player.maxhp * b.hpPct));
    }
    try {
      if (typeof floater === 'function') floater(player.x, player.z, 'BUFF ATIVO: ' + key.toUpperCase(), '#ffd76a', true);
      if (typeof sfx === 'function') sfx('level');
    } catch (_) {}
  }

  function updateBuffs(dt) {
    if (typeof player === 'undefined' || !player || player.dead) return;
    for (const [k, b] of Object.entries(activeBuffs)) {
      b.t -= dt;
      if (b.regenHp && !player.dead) {
        player.hp = Math.min(player.maxhp, player.hp + b.regenHp * dt);
      }
      if (b.t <= 0) {
        delete activeBuffs[k];
        if (b.hpPct && typeof refreshStats === 'function') refreshStats();
      }
    }
  }

  /* Usar poção ou item consumível de alquimia */
  function drinkPotion(id) {
    const it = BOTANICAL_ITEMS[id] || Surv437?.ITEMS?.[id];
    if (!it || !Surv437.count(id)) return false;
    Surv437.take(id, 1);
    if (it.heal && typeof player !== 'undefined' && player) {
      player.hp = Math.min(player.maxhp, player.hp + it.heal);
      try { if (typeof floater === 'function') floater(player.x, player.z, '+' + it.heal + ' VIDA', '#7ef5a5', true); } catch (_) {}
    }
    if (it.buff) applyBuff(id, it.buff);
    try {
      if (typeof sfx === 'function') sfx('coin');
      if (typeof fxRing === 'function') fxRing(player.x, player.z, 0x7ef5a5, 2.5, 0.5);
    } catch (_) {}
    toast('<b>[ALQUIMIA]</b> Você consumiu <b>' + it.n + '</b>.');
    Surv437.save();
    return true;
  }

  /* ---------- 2. ARREMESSO DE FRASCOS EM ÁREA (BALÍSTICA 3D) ---------- */
  const activeFlasks = [];
  function throwFlask(flaskId) {
    const it = BOTANICAL_ITEMS[flaskId] || Surv437?.ITEMS?.[flaskId];
    if (!it || !Surv437.count(flaskId) || typeof player === 'undefined' || !player) {
      toast('Você não tem esse frasco na mochila.');
      return false;
    }
    Surv437.take(flaskId, 1);

    const a = player.face || 0;
    const speed = 14;
    const startX = player.x + Math.sin(a) * 0.8;
    const startZ = player.z + Math.cos(a) * 0.8;
    const startY = (typeof terrH === 'function' ? terrH(player.x, player.z) : 0) + (player.jy || 0) + 1.25;

    /* Grupo visual do frasco voando */
    const g = new T.Group();
    g.position.set(startX, startY, startZ);
    const colMap = {
      frasco_veneno: 0x44dd44,
      frasco_acido: 0xccff00,
      frasco_fogo: 0xff4411,
      frasco_fumaca: 0x9999aa,
      frasco_paralisia: 0x44ccff
    };
    const col = colMap[flaskId] || 0xffd54f;
    const mesh = new T.Mesh(
      new T.DodecahedronGeometry(0.24, 1),
      new T.MeshStandardMaterial({ color: col, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.9 })
    );
    g.add(mesh);
    if (typeof scene !== 'undefined' && scene) scene.add(g);

    const vx = Math.sin(a) * speed;
    const vz = Math.cos(a) * speed;
    const vy = 5.2; // arco parabólico

    activeFlasks.push({
      id: flaskId, it, g, col,
      x: startX, y: startY, z: startZ,
      vx, vy, vz,
      life: 4
    });

    try {
      if (typeof sfx === 'function') sfx('step');
      if (typeof floater === 'function') floater(player.x, player.z, 'ARREMESSOU ' + it.n.toUpperCase() + '!', '#ffd54f');
    } catch (_) {}
    toast('<b>[ARREMESSO]</b> Você atirou o <b>' + it.n + '</b>!');
    Surv437.save();
    return true;
  }

  function detonateFlask(f) {
    const radius = 6.8;
    const fx = f.x, fz = f.z;
    try {
      if (typeof fxRing === 'function') fxRing(fx, fz, f.col, radius, 1.2);
      if (typeof fxBurst === 'function') fxBurst(fx, f.y, fz, f.col, 16, 5);
      if (typeof sfx === 'function') sfx(f.id === 'frasco_fogo' ? 'flame' : 'boom');
    } catch (_) {}

    const ens = (typeof enemies !== 'undefined' && enemies) ? enemies : [];
    let affected = 0;

    for (const e of ens) {
      if (!e || e.dead) continue;
      const d = Math.hypot(e.x - fx, e.z - fz);
      if (d <= radius) {
        affected++;
        if (f.id === 'frasco_veneno') {
          e.dotT = 8; e.dotD = Math.max(e.dotD || 0, 18);
          e.slowT = 8; e.slowM = 0.60; // 40% lentidão
          if (typeof floater === 'function') floater(e.x, e.z, '☣ VENENO & LENTIDÃO', '#44dd44', true);
        } else if (f.id === 'frasco_acido') {
          e.acidDefDebuff470 = 10; // reduz armadura em 50%
          if (typeof floater === 'function') floater(e.x, e.z, '🧪 ÁCIDO (-50% DEF)', '#ccff00', true);
        } else if (f.id === 'frasco_fogo') {
          if (typeof hurtEnemy === 'function') hurtEnemy(e, 55, fx, fz, { elem300: 'fogo', fromPlayer: true });
          e.burnT = 6; e.burnD = Math.max(e.burnD || 0, 16);
          if (typeof floater === 'function') floater(e.x, e.z, '🔥 FOGO LÍQUIDO', '#ff4411', true);
        } else if (f.id === 'frasco_fumaca') {
          e.aggro = false; e.target = null; e.blindT470 = 7;
          if (typeof floater === 'function') floater(e.x, e.z, '💨 FUMAÇA (CEGO/SEM ALVO)', '#cccccc', true);
        } else if (f.id === 'frasco_paralisia') {
          e.stun = Math.max(e.stun || 0, 4);
          if (typeof floater === 'function') floater(e.x, e.z, '⚡ PARALISIA (3.5s)', '#44ccff', true);
        }
      }
    }

    if (f.id === 'frasco_fumaca') {
      toast('<b>[FUMAÇA]</b> A cortina de fumaça quebrou a perseguição de ' + affected + ' inimigo(s)!');
    } else {
      toast('<b>[ESTOURO]</b> O frasco atingiu a área e afetou ' + affected + ' inimigo(s)!');
    }
  }

  function updateFlasks(dt) {
    for (let i = activeFlasks.length - 1; i >= 0; i--) {
      const f = activeFlasks[i];
      f.life -= dt;
      f.x += f.vx * dt;
      f.z += f.vz * dt;
      f.vy -= 14 * dt; // gravidade
      f.y += f.vy * dt;

      const floorH = typeof terrH === 'function' ? terrH(f.x, f.z) : 0;
      let hitEnemy = false;
      const ens = (typeof enemies !== 'undefined' && enemies) ? enemies : [];
      for (const e of ens) {
        if (!e || e.dead) continue;
        if (Math.hypot(e.x - f.x, e.z - f.z) < (e.r || 1.0) + 0.3 && Math.abs((e.y || floorH) + 1.0 - f.y) < 1.4) {
          hitEnemy = true;
          break;
        }
      }

      if (f.y <= floorH + 0.15 || hitEnemy || f.life <= 0) {
        f.y = floorH;
        if (f.g && f.g.parent) scene.remove(f.g);
        detonateFlask(f);
        activeFlasks.splice(i, 1);
        continue;
      }

      if (f.g) {
        f.g.position.set(f.x, f.y, f.z);
        f.g.rotation.x += 8 * dt;
        f.g.rotation.y += 12 * dt;
      }
    }
  }

  /* Hook no dano a inimigos para aplicar debuff de ácido (-50% armadura / +50% dano sofrido) */
  if (typeof window !== 'undefined') {
    const origHurtEnemy = window.hurtEnemy;
    if (typeof origHurtEnemy === 'function') {
      window.hurtEnemy = function (e, dmg, hx, hz, opt) {
        if (e && e.acidDefDebuff470 > 0) {
          dmg = Math.round(dmg * 1.5); // +50% dano pela armadura corroída
        }
        return origHurtEnemy.apply(this, [e, dmg, hx, hz, opt]);
      };
    }
  }

  /* ---------- 3. FRITAR PEIXES NA FOGUEIRA PORTÁTIL (lakeAt239 / run.fish) ---------- */
  function getAvailableFish() {
    const list = [];
    const rf = (typeof run !== 'undefined' && run && run.fish) ? run.fish : {};
    for (const [species, count] of Object.entries(rf)) {
      if (count > 0) list.push({ key: species, name: species, count, fromRun: true });
    }
    const crude = Surv437?.count?.('peixe_cru') || 0;
    if (crude > 0) list.push({ key: 'peixe_cru', name: 'Peixe Cru', count: crude, fromRun: false });
    return list;
  }

  function fryFish(key, eatNow = true) {
    if (!Surv437?.nearFire?.(4.5)) {
      toast('Você precisa estar perto de uma <b>Fogueira Acesa</b> para fritar peixe.');
      return false;
    }
    const rf = (typeof run !== 'undefined' && run && run.fish) ? run.fish : {};
    let ok = false;
    let fishName = 'Peixe';

    if (key === 'peixe_cru') {
      if (Surv437.take('peixe_cru', 1)) { ok = true; fishName = 'Peixe Cru'; }
    } else if (rf[key] > 0) {
      rf[key]--;
      ok = true;
      fishName = key;
      if (typeof saveRun === 'function') saveRun();
    }

    if (!ok) {
      toast('Você não tem esse peixe para fritar.');
      return false;
    }

    /* Feedback visual e sonoro de fritura na brasa */
    try {
      if (typeof sfx === 'function') { sfx('flame'); sfx('hit'); }
      if (typeof fxBurst === 'function') fxBurst(player.x, (typeof terrH === 'function' ? terrH(player.x, player.z) : 0) + 0.4, player.z, 0xffa033, 14, 4);
    } catch (_) {}

    if (eatNow) {
      const s = Surv437.S();
      if (s) {
        s.hunger = Math.min(100, s.hunger + 55);
        if (s.sickT > 0) s.sickT = Math.max(0, s.sickT - 40); // alivia parasitas
      }
      if (typeof player !== 'undefined' && player) {
        player.hp = Math.min(player.maxhp, player.hp + Math.round(player.maxhp * 0.35));
      }
      applyBuff('peixe_grelhado', { hpPct: 0.25, vigMult: 1.4, dur: 480 });
      try { if (typeof floater === 'function') floater(player.x, player.z, '🐟 ' + fishName.toUpperCase() + ' GRELHADO (+FOME/VIDA/CALOR)!', '#ffd54f', true); } catch (_) {}
      toast('<b>[FOGUEIRA]</b> Você fritou e saboreou <b>' + fishName + '</b> na brasa quente (+55 Fome, +Vida e bônus de calor)!');
    } else {
      Surv437.add('peixe_assado', 1, false, 0);
      try { if (typeof floater === 'function') floater(player.x, player.z, '+1 Peixe Assado na Mochila', '#ffd54f', true); } catch (_) {}
      toast('<b>[FOGUEIRA]</b> <b>' + fishName + '</b> assado na brasa e guardado na mochila (dura 3–4 dias)!');
    }

    Surv437.save();
    return true;
  }

  /* ---------- 4. FORJA RÚSTICA DE ACAMPAMENTO (FORNALHA E BIGORNA) ---------- */
  const WEAPON_TYPES = [
    { id: 'sword', n: 'Espada de Campo',   baseDmg: 28, slot: 'w', kind: 'sword', reqWood: 2, desc: 'Lâmina equilibrada para combate corpo a corpo.' },
    { id: 'axe',   n: 'Machado Selvagem',  baseDmg: 34, slot: 'w', kind: 'axe',   reqWood: 3, desc: 'Arma pesada que rasga defesas e quebra posturas.' },
    { id: 'spear', n: 'Lança de Caçador',  baseDmg: 27, slot: 'w', kind: 'spear', reqWood: 3, desc: 'Longo alcance e perfuração profunda.' },
    { id: 'dagger',n: 'Adaga de Trilha',   baseDmg: 22, slot: 'w', kind: 'dagger',reqWood: 1, desc: 'Golpes rápidos com alta chance de sangramento crítico.' },
    { id: 'bow',   n: 'Arco Rústico Curvo',baseDmg: 29, slot: 'w', kind: 'bow',   reqWood: 4, desc: 'Disparos à distância impulsionados por Destreza.' }
  ];

  const MINERAL_BASES = {
    pedra:        { n: 'Pedra Lascada',      dmgMod: 1.0,  rar: 0, desc: 'Básico e robusto.' },
    lasca:        { n: 'Lasca Afiada',       dmgMod: 1.25, rar: 1, desc: '+25% de dano e penetração.' },
    cristal_frio: { n: 'Cristal Glacial',    dmgMod: 1.45, rar: 2, elem: 'gelo', desc: 'Dano de Gelo com lentidão nos inimigos.' },
    resina:       { n: 'Resina Incandescente',dmgMod: 1.35, rar: 2, elem: 'fogo', desc: 'Lâmina inflamada com dano contínuo de queimadura.' }
  };

  const MONSTER_CATALYSTS = {
    osso:         { n: 'Osso / Chifre de Fera', aff: { id: 'impact', n: 'Impacto de Fera', d: 'Golpes quebram postura e atordoam' } },
    couro:        { n: 'Couro Trançado',       aff: { id: 'guard',  n: 'Guarda Firme',    d: '+15% de armadura ao segurar a arma' } },
    cogu_venenoso:{ n: 'Esporo Venenoso',      aff: { id: 'poison', n: 'Lâmina Tóxica',   d: 'Ataques envenenam o inimigo por 5s' } },
    raiz_sangue:  { n: 'Raiz Sanguínea',      aff: { id: 'bleed',  n: 'Fio Sangrento',   d: 'Causa sangramento pesado de 35% do dano em 4s' } }
  };

  function forgeWeapon(wepTypeId, mineralKey, monsterKey) {
    const wDef = WEAPON_TYPES.find(w => w.id === wepTypeId);
    const mDef = MINERAL_BASES[mineralKey];
    const cDef = MONSTER_CATALYSTS[monsterKey];
    if (!wDef || !mDef || !cDef) {
      toast('Selecione todos os materiais para forjar a arma.');
      return false;
    }

    if (!Surv437.has({ galho: wDef.reqWood, [mineralKey]: 2, [monsterKey]: 1 })) {
      toast('Materiais insuficientes para forjar esta arma.');
      return false;
    }

    /* Consome materiais */
    Surv437.take('galho', wDef.reqWood);
    Surv437.take(mineralKey, 2);
    Surv437.take(monsterKey, 1);

    const tier = (typeof rankOf === 'function' ? rankOf() : 0);
    const rar = Math.min(4, mDef.rar + 1);
    const finalDmg = Math.round(wDef.baseDmg * mDef.dmgMod * (1 + tier * 0.25));

    const item = {
      slot: 'w',
      tier,
      rar,
      kind155: wDef.kind,
      name: wDef.n + ' de ' + mDef.n,
      d: 'Arma customizada forjada no acampamento. ' + cDef.aff.d + '.',
      dmg: finalDmg,
      elem300: mDef.elem || null,
      v2: 1,
      value: 60 + tier * 35,
      uid: Math.random().toString(36).slice(2, 9),
      aff: [cDef.aff],
      customForged: true
    };

    if (typeof run !== 'undefined' && run && run.items) {
      run.items.push(item);
    }

    /* Feedback de forja */
    try {
      if (typeof sfx === 'function') sfx('boom');
      if (typeof Anim303 !== 'undefined' && Anim303.play) Anim303.play('martelo', 1.2);
      if (typeof floater === 'function') floater(player.x, player.z, 'ARMA FORJADA: ' + item.name.toUpperCase(), '#ffd54f', true);
    } catch (_) {}

    toast('<b>[FORJA RÚSTICA]</b> Você forjou <b>' + item.name + '</b> (' + finalDmg + ' Dano)! Guardada na bolsa de equipamentos.');
    Surv437.save();
    return item;
  }

  /* Tick por quadro */
  function tick(dt) {
    updateBuffs(dt);
    updateFlasks(dt);
  }

  /* Gancho no loop principal */
  if (typeof window !== 'undefined') {
    const prevTick = window.updDungeon;
    window.updDungeon = function (dt) {
      if (prevTick) prevTick.apply(this, arguments);
      try { tick(dt); } catch (e) { console.warn('Alchemy470.tick', e); }
    };
    const prevLoop = window.loopUpdate437;
    if (typeof prevLoop === 'function') {
      window.loopUpdate437 = function (dt) {
        prevLoop(dt);
        try { tick(dt); } catch (_) {}
      };
    }
  }

  registerBotanicals();

  window.Alchemy470 = {
    BOTANICAL_ITEMS,
    ALCHEMY_RECIPES,
    WEAPON_TYPES,
    MINERAL_BASES,
    MONSTER_CATALYSTS,
    registerBotanicals,
    drinkPotion,
    throwFlask,
    getAvailableFish,
    fryFish,
    forgeWeapon,
    tick
  };
})();
