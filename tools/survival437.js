/* v437 (Ian): Sobrevivência no mundo aberto — núcleo.
   Bolsa de sobrevivência (peso em kg), Fome + Sede (somam ao cansaço da v287), comida que estraga, água e cantil,
   coleta no chão (pedras, arbustos, ervas), resina e derrubada de árvores com machado (Tora Bruta física no chão,
   cortar em Feixe de Lenha / Tábuas, levar no ombro) e caça (couro, carne crua, ossos).
   Carrinho: tools/cart437.js. Construção peça por peça e fogueira/varal/coletor: tools/build437.js.
   Relevo (terrain245): raiz em y=0 = no chão; o shader soma terrH() pela raiz. Modelos Tripo novos em models/m437/. */
(function () {
  'use strict';
  const T = THREE, TAU = Math.PI * 2;
  const ready = () => typeof started !== 'undefined' && started && typeof player !== 'undefined' && player && run && profile && !profile.creationPending91;
  const world = () => L.mode === 'world' && !L.grid;
  const DAY = () => (typeof DAYLEN !== 'undefined' ? DAYLEN : 1440); // 1 dia de jogo em segundos
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------------- itens ---------------- */
  // kg: peso; eat: {f: fome, s: sede, fed: segundos de "Bem Alimentado", sick: chance de mal-estar}; keep: dias até estragar
  const IT = {
    tora: { n: 'Tora Bruta', kg: 40, d: 'Tronco inteiro. Só no ombro ou no carrinho. Corte com machado em Lenha ou Tábuas.' },
    lenha: { n: 'Feixe de Lenha', kg: 6, d: 'Fogueira, lareira, cozinhar e aquecer no frio.' },
    tabua: { n: 'Tábuas', kg: 5, d: 'Construir, reparar, barcos e carrinho.' },
    pedra: { n: 'Pedra Lascada', kg: 2, d: 'Ferramentas, fundações e fogueira.' },
    minerio: { n: 'Minério Superficial', kg: 3, d: 'Pregos e reforços na bancada.' },
    sal: { n: 'Sal Grosso', kg: .5, d: 'Salga a carne (dura dias).' },
    fibra: { n: 'Fibras', kg: .3, d: 'Cordas, amarras e armadilhas.' },
    cipo: { n: 'Cipós', kg: .5, d: 'Amarrar toras e telhado.' },
    resina: { n: 'Resina', kg: .3, d: 'Vedação de barco, tochas e cola.' },
    couro: { n: 'Couro', kg: 2, d: 'Cantil, cama e abrigo.' },
    osso: { n: 'Ossos', kg: 1, d: 'Ferramentas e armadilhas.' },
    erva: { n: 'Ervas', kg: .1, d: 'Chá (limpa a água) e antídoto na fogueira.' },
    carne: { n: 'Carne Crua', kg: 1, keep: .5, eat: { f: 12, s: 0, sick: .45 }, d: 'Estraga em meio dia. Asse na fogueira, defume no varal ou salgue.' },
    assada: { n: 'Carne Assada', kg: .8, keep: 3, eat: { f: 38, s: -3, fed: 600 }, d: 'Dura 3 dias. Dá Bem Alimentado.' },
    defumada: { n: 'Carne Defumada', kg: .6, keep: 8, eat: { f: 30, s: -5, fed: 480 }, d: 'Feita no varal. Dura 8 dias.' },
    salgada: { n: 'Carne Salgada', kg: .7, keep: 12, eat: { f: 28, s: -10, fed: 420 }, d: 'Dura 12 dias, dá sede.' },
    fruta: { n: 'Frutas Silvestres', kg: .2, keep: 1.5, eat: { f: 9, s: 6 }, d: 'Estragam em 1 dia e meio.' },
    cogumelo: { n: 'Cogumelos', kg: .2, keep: 1, eat: { f: 7, s: 0, sick: .25 }, d: 'Crus podem fazer mal. Assados ficam seguros.' },
    cogu_assado: { n: 'Cogumelos Assados', kg: .2, keep: 2, eat: { f: 16, s: 0, fed: 240 }, d: 'Dá Bem Alimentado curto.' },
    estragada: { n: 'Comida Estragada', kg: .5, eat: { f: 4, s: 0, sick: .9 }, d: 'Melhor não comer.' },
    polpa_cacto: { n: 'Polpa / Água de Cacto', kg: .4, keep: 3, eat: { f: 14, s: 32 }, d: 'Cortada dos cactos do Deserto de Zahar. Mata a sede (+32%) e a fome (+14%).' },
    fibra_espinhosa: { n: 'Fibras Espinhosas', kg: .3, d: 'Fibras resistentes dos cactos de Zahar. Servem para cordas, amarras e ferramentas.' },
    tocha: { n: 'Tocha com Resina', kg: .5, use: 'torch', d: 'Feixe de Lenha com Resina. Acende por 5 min, ilumina e neutraliza o Frio/Congelamento de Ymiria.' },
    pa: { n: 'Pá / Enxada', kg: 2, d: 'Nivela encostas e dunas para o Carrinho passar e desobstrui passagens bloqueadas (F).' },
    machado: { n: 'Machado de Pedra', kg: 2, d: 'Derruba árvores, corta cactos e toras. Feito com Pedra Lascada, Fibras e um galho.' },
    cantil: { n: 'Cantil de Couro', kg: .6, d: 'Encha na margem de rio ou lago. Água crua: ferva na fogueira ou faça Chá Térmico.' }
  };
  const FOOD = Object.keys(IT).filter(k => IT[k].eat);
  window.SurvItems437 = IT;

  function S() {
    const s = run.surv437 || (run.surv437 = {});
    if (s.v !== 1) Object.assign(s, { v: 1, fome: 100, sede: 100, clock: 0, fed: 0, sickT: 0, torchT: 0, chaT: 0, cold441: 0, leveled: [], bag: {}, batches: {}, felled: [], logs: [], picked: {}, canteen: null, carry: null }, Object.assign({}, s));
    s.leveled = s.leveled || [];
    return s;
  }
  const fmtKg = k => (Math.round(k * 10) / 10).toLocaleString('pt-BR') + ' kg';
  const cap = () => 35 * (S().fed > 0 ? 1.3 : 1);
  const weight = () => { const b = S().bag; let w = 0; for (const k in b) w += (IT[k]?.kg || 0) * b[k]; if (S().canteen) w += .6 + S().canteen.sips * .2; return w; };
  const has = (k, n = 1) => (k === 'fibra' ? (S().bag.fibra || 0) + (S().bag.fibra_espinhosa || 0) : (S().bag[k] || 0)) >= n;
  function add(k, n = 1, quiet) {
    if (!IT[k] || n <= 0) return 0;
    const s = S(); let ok = n;
    if (k !== 'tora') { const room = Math.floor((cap() - weight()) / IT[k].kg + 1e-6); ok = Math.max(0, Math.min(n, room)); }
    if (!ok) { if (!quiet) toast('<b>[SOBREVIVÊNCIA]</b> Bolsa pesada demais (' + fmtKg(weight()) + ' de ' + fmtKg(cap()) + '). Use o carrinho ou largue algo.', 4000); return 0; }
    s.bag[k] = (s.bag[k] || 0) + ok;
    if (IT[k].keep) (s.batches[k] = s.batches[k] || []).push(...Array(ok).fill(s.clock + IT[k].keep * DAY()));
    if (!quiet) floater(player.x, player.z, '+' + ok + ' ' + IT[k].n, '#cfe8a0');
    save(); return ok;
  }
  function take(k, n = 1) {
    const s = S(); if (!has(k, n)) return false;
    if (k === 'fibra' && (s.bag.fibra || 0) < n) {
      const a = s.bag.fibra || 0, rem = n - a;
      if (a) delete s.bag.fibra;
      s.bag.fibra_espinhosa = (s.bag.fibra_espinhosa || 0) - rem;
      if (!s.bag.fibra_espinhosa) delete s.bag.fibra_espinhosa;
      save(); return true;
    }
    s.bag[k] -= n; if (!s.bag[k]) delete s.bag[k];
    if (s.batches[k]) { s.batches[k].sort((a, b) => a - b); s.batches[k].splice(0, n); } // gasta primeiro o que estraga antes
    save(); return true;
  }
  function spoilTick() { // comida crua/assada vira Comida Estragada no prazo
    const s = S(); let lost = 0;
    for (const k in s.batches) {
      const b = s.batches[k]; let i = 0; b.sort((x, y) => x - y);
      while (i < b.length && b[i] <= s.clock) i++;
      if (i) { b.splice(0, i); s.bag[k] = Math.max(0, (s.bag[k] || 0) - i); if (!s.bag[k]) delete s.bag[k]; s.bag.estragada = (s.bag.estragada || 0) + i; lost += i; }
    }
    if (lost) toast('<b>[SOBREVIVÊNCIA]</b> ' + lost + ' porç' + (lost > 1 ? 'ões estragaram' : 'ão estragou') + ' na bolsa.', 4000);
  }

  /* ---------------- fome, sede, efeitos ---------------- */
  let effort = 0, lastVig = null;
  function needsTick(dt) {
    const s = S(); s.clock += dt;
    const b = typeof biomeAt === 'function' ? biomeAt(player.x, player.z) : '';
    const hot = b === 'deserto' || b === 'vulcao', cold = b === 'neve' && !(window.Biomes295?.warmSource441?.());
    // esforço = estamina gasta (correr, golpes, escalar) + carga pesada
    try { const v = martialState260().vigor; if (lastVig != null && v < lastVig) effort += lastVig - v; lastVig = v; } catch (_) {}
    const ef = Math.min(1, effort / 30); effort = Math.max(0, effort - dt * 12);
    const load = (window.Cart437?.pulling() ? Cart437.loadKg() / 400 : 0) + (s.carry ? .6 : 0);
    // fome: 100 → 0 em ~1,6 dia parado; até 2× com esforço e carga; frio gasta mais
    s.fome = Math.max(0, s.fome - dt * 100 / (DAY() * 1.6) * (1 + ef + load * .6 + (cold ? .35 : 0)));
    // sede: 100 → 0 em ~1 dia; calor árido do deserto 2,35×; esforço até +1×
    const thirstMul = b === 'deserto' ? (run.bioGear295?.cantil > 0 ? 1.15 : 2.35) : hot ? 1.8 : 1;
    s.sede = Math.max(0, s.sede - dt * 100 / DAY() * (1 + ef + load * .4) * thirstMul);
    if (s.fed > 0) s.fed = Math.max(0, s.fed - dt);
    if (s.sickT > 0) s.sickT = Math.max(0, s.sickT - dt);
    if (s.torchT > 0) { s.torchT = Math.max(0, s.torchT - dt); syncTorch(true); if (s.torchT <= 0) { syncTorch(false); toast('<b>[SOBREVIVÊNCIA]</b> A Tocha com Resina apagou.', 3500); } } else syncTorch(false);
    if (s.chaT > 0) s.chaT = Math.max(0, s.chaT - dt);
    if (s.sede < 15 && run.awake287 != null) run.awake287 += dt; // sede crítica: cansaço 2× mais rápido
    if (s.sede <= 0) { needsTick.hurt = (needsTick.hurt || 0) - dt; if (needsTick.hurt <= 0 && player.hp > player.maxhp * .1) { needsTick.hurt = 3; player.hp = Math.max(player.maxhp * .1, player.hp - player.maxhp * .02); floater(player.x, player.z, 'DESIDRATADO', '#9fd8ff'); } }
    if (s.fome <= 0) { needsTick.hh = (needsTick.hh || 0) - dt; if (needsTick.hh <= 0 && player.hp > player.maxhp * .15) { needsTick.hh = 4; player.hp = Math.max(player.maxhp * .15, player.hp - player.maxhp * .015); floater(player.x, player.z, 'FAMINTO', '#ffb36b'); } }
    // avisos uma vez por faixa
    const band = (v) => v <= 0 ? 3 : v < 15 ? 2 : v < 35 ? 1 : 0;
    const bf = band(s.fome), bs = band(s.sede);
    if (bf > (s.wF || 0)) toast(['', '<b>[FOME]</b> Você está com fome.', '<b>[FOME]</b> Muita fome: estamina volta mais devagar e o golpe perde força.', '<b>[FOME]</b> Faminto! Coma algo assado logo.'][bf], 5000);
    if (bs > (s.wS || 0)) toast(['', '<b>[SEDE]</b> Você está com sede.', '<b>[SEDE]</b> Sede crítica: a estamina quase não volta e o cansaço chega 2× mais rápido.', '<b>[SEDE]</b> Desidratado! Beba água já.'][bs], 5000);
    s.wF = bf; s.wS = bs;
  }
  const mods = () => { const s = run?.surv437; if (!s) return { vig: 0, dmg: 1, hp: 1 }; let vig = 0, dmg = 1, hp = 1;
    if (s.fome <= 0) { vig -= .5; dmg *= .8; } else if (s.fome < 15) { vig -= .25; dmg *= .9; }
    if (s.sede < 15) vig -= .4;
    if (s.sickT > 0) vig -= .3;
    if ((s.cold441 || 0) >= 50) vig -= .25;
    if (s.fed > 0) { vig += .2; hp = 1.1; }
    return { vig, dmg, hp }; };
  if (typeof pVigorRegen281 === 'function') { const vr0 = pVigorRegen281; pVigorRegen281 = function () { const m = mods(); return Math.max(-.95, (1 + vr0()) * (1 + m.vig) - 1); }; }
  if (typeof hurtEnemy === 'function') { const he0 = hurtEnemy; hurtEnemy = function (e, amt, sx, sz, o = {}) { try { if (o && o.fromPlayer) amt *= mods().dmg; } catch (_) {} return he0.call(this, e, amt, sx, sz, o); }; }
  if (typeof refreshStats === 'function') { const rs0 = refreshStats; refreshStats = function () { const r = rs0.apply(this, arguments); try { const k = mods().hp; if (k !== 1 && player) { player.maxhp = Math.round(player.maxhp * k); } } catch (_) {} return r; }; }
  let fedWas = false;

  function eat(k) {
    const it = IT[k]; if (!it?.eat || !take(k, 1)) return;
    const s = S(), e = it.eat;
    s.fome = Math.min(100, s.fome + e.f); s.sede = Math.max(0, Math.min(100, s.sede + (e.s || 0)));
    if (e.fed) s.fed = Math.max(s.fed, e.fed);
    let msg = 'Você comeu <b>' + it.n + '</b>.';
    if (e.sick && Math.random() < e.sick) { s.sickT = 120; s.fome = Math.max(0, s.fome - 15); msg += ' <b style="color:#ff9b8b">Mal-estar</b>: estamina mais lenta por 2 min.'; }
    if (e.fed) msg += ' <b style="color:#9fe39a">Bem Alimentado</b> (' + Math.round(e.fed / 60) + ' min): +10% vida máx., +20% estamina, +30% de carga.';
    toast(msg, 4500); try { sfx('pickup'); } catch (_) {}
    syncFed(); save();
  }
  function lightTorch() {
    if (!take('tocha', 1)) return;
    const s = S(); s.torchT = Math.max(s.torchT || 0, 300); s.cold441 = 0;
    syncTorch(true); save();
    try { sfx('pickup'); } catch (_) {}
    toast('<b>[TOCHA COM RESINA]</b> Acesa por 5 min: ilumina o redor e neutraliza o Frio/Congelamento.', 4500);
  }
  let torchG = null;
  function syncTorch(on) {
    if (!on || !player?.m?.root) { if (torchG) { torchG.parent?.remove(torchG); torchG = null; } return; }
    if (torchG && torchG.parent === player.m.root) return;
    if (torchG) torchG.parent?.remove(torchG);
    const g = new T.Group();
    const stick = new T.Mesh(new T.CylinderGeometry(.035, .045, .55, 6), new T.MeshStandardMaterial({ color: 0x5c3d24, roughness: .85 }));
    const flame = new T.Mesh(new T.SphereGeometry(.09, 8, 8), new T.MeshBasicMaterial({ color: 0xffa838 }));
    flame.position.y = .3; g.add(stick, flame);
    try { const pl = new T.PointLight(0xff9f40, 1.35, 11, 2); pl.position.y = .35; g.add(pl); } catch (_) {}
    g.position.set(-.38, 1.15, .22); g.rotation.x = .35;
    player.m.root.add(g); torchG = g;
  }
  function syncFed() { const on = S().fed > 0; if (on !== fedWas) { fedWas = on; try { refreshStats(); } catch (_) {} } }

  /* ---------------- água e cantil ---------------- */
  const WATER_K = { limpa: 'Água limpa', suja: 'Água de rio/lago (crua)', cha: 'Chá Térmico de ervas', pantano: 'Água do pântano (crua)', mar: 'Água do mar (salgada)' };
  function drink(kind, amt) {
    const s = S();
    if (kind === 'mar') { s.sede = Math.max(0, s.sede - 8); toast('Água do mar: o sal dá <b>mais</b> sede. Destile na fogueira (cantil cheio de água do mar).', 4500); save(); return; } // v439
    s.sede = Math.min(100, s.sede + amt);
    let msg = 'Você bebeu ' + WATER_K[kind].toLowerCase() + '.';
    const risk = kind === 'suja' ? .25 : kind === 'pantano' ? .6 : 0;
    if (Math.random() < risk) { s.sickT = 150; s.fome = Math.max(0, s.fome - 12); msg += ' <b style="color:#ff9b8b">Mal-estar</b>: devia ter fervido.'; }
    if (kind === 'cha') { s.sickT = 0; s.chaT = Math.max(s.chaT || 0, 300); s.cold441 = 0; msg += ' <b style="color:#9fe39a">Aquecido por 5 min</b> (neutraliza o frio de Ymiria e tira mal-estar).'; }
    toast(msg, 3500); save();
  }
  function sip() {
    const c = S().canteen; if (!c || !c.sips) { toast('O cantil está vazio. Encha na margem de um rio ou lago (F).'); return; }
    c.sips--; drink(c.kind, 22); if (!c.sips) c.kind = null;
  }
  function waterNear(seaOnly) { // margem a até 2,5 m (seaOnly: só se for o mar, v439)
    if (!window.Water391 || !world()) return null;
    for (let i = 0; i < 9; i++) { const a = i / 8 * TAU, r = i ? 2.2 : 0, x = player.x + Math.cos(a) * r, z = player.z + Math.sin(a) * r, w = Water391.waterAt(x, z); if (w && !w.frozen && (!seaOnly || w.sea)) return { x, z }; }
    return null;
  }
  const waterIt = { type: 'water437', x: 0, z: 0, r: 3.2, label: '', hidden: true, use: () => waterMenu() };
  function waterMenu() {
    const s = S(), sea = !!(window.Water391 && waterNear(true)), sw = sea ? 'mar' : typeof biomeAt === 'function' && biomeAt(player.x, player.z) === 'pantano' ? 'pantano' : 'suja';
    if (sea) { const c0 = s.canteen; openModal('MAR', '<p>Água salgada: beber dá mais sede. Encha o cantil e <b>destile</b> na fogueira (vira água limpa e sobra Sal Grosso).</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="w437d">BEBER MESMO ASSIM</button>' + (c0 ? '<button class="btn" id="w437f">ENCHER O CANTIL (' + c0.sips + '/5)</button>' : '<span style="opacity:.7">Sem cantil.</span>') + '</div>');
      document.getElementById('w437d').onclick = () => { closeModal(); drink('mar', 0); };
      const f0 = document.getElementById('w437f'); if (f0) f0.onclick = () => { c0.sips = 5; c0.kind = 'mar'; closeModal(); toast('Cantil cheio de água do mar. Destile na fogueira.', 4000); save(); };
      return; }
    const c = s.canteen;
    const h = '<p>Água de ' + (sw === 'pantano' ? 'pântano' : 'rio ou lago') + ': beber crua tem risco de mal-estar (' + (sw === 'pantano' ? '60' : '25') + '%). Fervida na fogueira (ou em chá de ervas) fica segura.</p>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="w437d">BEBER DIRETO</button>' +
      (c ? '<button class="btn" id="w437f">ENCHER O CANTIL (' + c.sips + '/5)</button>' : '<span style="opacity:.7">Sem cantil (2 Couro + 1 Cipó na bancada ou no Manual).</span>') + '</div>';
    openModal('MARGEM', h);
    document.getElementById('w437d').onclick = () => { closeModal(); drink(sw, 30); };
    const f = document.getElementById('w437f'); if (f) f.onclick = () => { if (c.kind && c.kind !== sw && c.sips) { /* misturar estraga a limpa */ } c.sips = 5; c.kind = sw; closeModal(); toast('Cantil cheio de ' + WATER_K[sw].toLowerCase() + '. Ferva na fogueira para ficar segura.', 4000); save(); };
  }

  /* ---------------- modelos ---------------- */
  function sceneryMat(m) { // igual ao cenário Tripo (mechanics434): textura sRGB, sem metal, leve luz própria
    const mat = m.clone(); mat.side = T.DoubleSide;
    if (mat.map) { mat.map.encoding = T.sRGBEncoding; mat.map.anisotropy = 4; mat.color.setScalar(1.25); mat.emissiveMap = mat.map; mat.emissive.setRGB(.18, .17, .16); }
    mat.roughness = Math.max(.72, mat.roughness || 0); mat.metalness = 0; return mat;
  }
  const glbCache = new Map();
  function glb(name) {
    if (glbCache.has(name)) return glbCache.get(name);
    const p = new Promise(res => {
      if (!T.GLTFLoader) { res(null); return; }
      const l = new T.GLTFLoader(); if (window.MeshoptDecoder) l.setMeshoptDecoder(MeshoptDecoder);
      l.load((name.includes('/') ? 'models/' + name : 'models/m437/' + name) + '.glb?v=437', g => {
        const root = g.scene; root.updateMatrixWorld(true);
        root.traverse(o => { if (o.isMesh) { o.material = Array.isArray(o.material) ? o.material.map(sceneryMat) : sceneryMat(o.material); o.castShadow = true; o.receiveShadow = true; o.geometry.userData.shared = true; } });
        const b = new T.Box3().setFromObject(root), sz = b.getSize(new T.Vector3()), wrap = new T.Group();
        root.position.x -= (b.min.x + b.max.x) / 2; root.position.y -= b.min.y; root.position.z -= (b.min.z + b.max.z) / 2;
        wrap.add(root); wrap.userData.h = sz.y || 1; wrap.userData.w = Math.max(sz.x, sz.z) || 1; wrap.userData.sx = sz.x; wrap.userData.sz = sz.z; res(wrap);
      }, undefined, () => res(null));
    });
    glbCache.set(name, p); return p;
  }
  // h = altura máx., w = largura máx.; devolve cópia com raiz no chão (y=0)
  const fit = (tpl, h, w = Infinity) => { const g = tpl.clone(true), k = Math.min(h / tpl.userData.h, w / tpl.userData.w); g.scale.setScalar(k); g.userData.h = tpl.userData.h * k; g.userData.w = tpl.userData.w * k; return g; };
  const tripoMats = {};
  function plainMat(src) {
    const mat = new T.MeshStandardMaterial({ map: src.map || null, normalMap: src.normalMap || null, side: T.DoubleSide, roughness: .8, metalness: 0 });
    if (mat.map) { mat.color.setScalar(1.3); mat.emissiveMap = mat.map; mat.emissive.setRGB(.2, .19, .18); } else mat.color.copy(src.color);
    return mat;
  }
  function envPiece(id, h, w) { // peça do cenário Tripo do jogo (pedras, rochedo, paliçada…), fora das instâncias
    if (typeof TripoEnvironment153 === 'undefined') return null;
    const m = TripoEnvironment153.models[id]; if (!m) return null;
    const mats = tripoMats[id] || (tripoMats[id] = m.parts.map(p => Array.isArray(p.material) ? p.material.map(plainMat) : plainMat(p.material)));
    const g = new T.Group();
    m.parts.forEach((p, i) => { const mesh = new T.Mesh(p.geometry, mats[i]); mesh.castShadow = true; mesh.receiveShadow = true; g.add(mesh); });
    if (w) g.scale.set(w / m.sx, h / m.h, w / m.sx); else g.scale.setScalar(h / m.h);
    return g;
  }

  /* ---------------- coleta no chão ---------------- */
  // Pontos fixos por célula de 26 m (sempre os mesmos); depois de coletados voltam em 1 dia de jogo.
  const CELL = 26, nodes = new Map();
  const rnd = s => { s = Math.imul(s ^ (s >>> 15), 2246822507) >>> 0; s = Math.imul(s ^ (s >>> 13), 3266489909) >>> 0; return ((s ^ (s >>> 16)) >>> 0) / 4294967296; };
  function nodeKinds(b) {
    if (b === 'deserto') return ['cacto', 'cacto', 'pedra', 'ervas'];
    if (b === 'vulcao') return ['pedra', 'pedra'];
    if (b === 'neve') return ['pedra', 'arbusto'];
    if (b === 'pantano') return ['ervas', 'ervas', 'arbusto'];
    return ['pedra', 'arbusto', 'ervas'];
  }
  function loot(kind, b) {
    if (kind === 'cacto') return [['polpa_cacto', 2 + (Math.random() * 2 | 0)], ['fibra_espinhosa', 2 + (Math.random() * 2 | 0)]];
    if (kind === 'pedra') { const o = [['pedra', 2 + (Math.random() * 2 | 0)]]; if (Math.random() < .4) o.push(['minerio', 1]); if (b === 'deserto' && Math.random() < .6) o.push(['sal', 1 + (Math.random() * 2 | 0)]); return o; }
    if (kind === 'arbusto') { const o = [['fruta', 2 + (Math.random() * 3 | 0)]]; if (Math.random() < .55) o.push(['cipo', 1 + (Math.random() * 2 | 0)]); return o; }
    const o = [['fibra', 2 + (Math.random() * 3 | 0)], ['erva', 1 + (Math.random() * 2 | 0)]];
    if ((b === 'floresta' || b === 'pantano' || Math.random() < .3)) o.push(['cogumelo', 1 + (Math.random() * 2 | 0)]);
    if (Math.random() < .35) o.push(['cipo', 1]);
    return o;
  }
  const LABEL = { pedra: 'F · COLETAR PEDRAS', arbusto: 'F · COLHER FRUTAS E CIPÓS', ervas: 'F · COLHER FIBRAS E ERVAS', cacto: 'F · CORTAR CACTO (Polpa/Água e Fibras Espinhosas)' };
  function buildCell(cx, cz) {
    const key = cx + ',' + cz, out = [];
    for (let i = 0; i < 3; i++) {
      const sd = (cx * 73856093 ^ cz * 19349663 ^ i * 83492791) >>> 0;
      if (rnd(sd) < .35) continue;
      const x = cx * CELL + rnd(sd + 1) * CELL, z = cz * CELL + rnd(sd + 2) * CELL;
      if (typeof freeAt === 'function' && !freeAt(x, z, 1.1)) continue;
      if (window.Water391 && Water391.waterAt(x, z)) continue;
      if (typeof nearestCity === 'function') { const n = nearestCity(x, z); if (n.d < 75 * (typeof CITYK !== 'undefined' ? CITYK : 1)) continue; }
      if (typeof onRoad === 'function' && typeof roadSegs === 'function' && onRoad(roadSegs(x, z, 1), x, z, 3)) continue;
      const b = biomeAt(x, z), ks = nodeKinds(b), kind = ks[(rnd(sd + 3) * ks.length) | 0];
      out.push({ id: key + ':' + i, kind, x, z, ry: rnd(sd + 4) * TAU, s: .8 + rnd(sd + 5) * .5, b });
    }
    return out;
  }
  function makeCactusMesh(s) {
    const g = new T.Group();
    if (typeof ENV !== 'undefined' && ENV.m?.cactus_tall && typeof envMesh === 'function') {
      const m = envMesh('cactus_tall'); m.scale.setScalar(1.9 * s / Math.max(ENV.m.cactus_tall.h || 1, .1)); g.add(m); return g;
    }
    const mat = new T.MeshStandardMaterial({ color: 0x3b7a3e, roughness: .82, metalness: 0 });
    const trunk = new T.Mesh(new T.CylinderGeometry(.18 * s, .22 * s, 1.8 * s, 8), mat); trunk.position.y = .9 * s; trunk.castShadow = true; g.add(trunk);
    for (const side of [-1, 1]) {
      const armH = (.55 + (side > 0 ? .15 : 0)) * s;
      const arm = new T.Mesh(new T.CylinderGeometry(.12 * s, .13 * s, armH, 7), mat);
      arm.position.set(side * .32 * s, (.85 + (side > 0 ? .18 : 0)) * s + armH * .5, 0); arm.castShadow = true;
      const joint = new T.Mesh(new T.BoxGeometry(.28 * s, .2 * s, .2 * s), mat);
      joint.position.set(side * .18 * s, (.85 + (side > 0 ? .18 : 0)) * s, 0);
      g.add(arm, joint);
    }
    return g;
  }
  function makeNode(n) {
    const g = new T.Group(); g.position.set(n.x, 0, n.z); g.rotation.y = n.ry;
    if (n.kind === 'pedra') { const p = envPiece('stones', .55 * n.s); if (p) g.add(p); }
    else if (n.kind === 'cacto') { g.add(makeCactusMesh(n.s)); }
    else glb(n.kind).then(t => { if (t && g.parent !== null) g.add(fit(t, (n.kind === 'arbusto' ? 1.1 : .75) * n.s, 1.6 * n.s)); });
    scene.add(g); n.g = g;
    n.it = { type: 'gather437', x: n.x, z: n.z, r: 2.2, label: LABEL[n.kind], use: () => gather(n) };
    L.inter.push(n.it);
  }
  function dropNode(n) { if (n.g) scene.remove(n.g); const i = L.inter.indexOf(n.it); if (i >= 0) L.inter.splice(i, 1); n.g = null; }
  function gather(n) {
    const s = S(); if (s.picked[n.id] > s.clock) return;
    try { Anim303?.play(n.kind === 'pedra' || n.kind === 'cacto' ? 'corte' : 'ajoelhar', 1.4); sfx('hit'); } catch (_) {}
    const got = []; for (const [k, q] of loot(n.kind, n.b)) { const a = add(k, q, true); if (a) got.push(a + ' ' + IT[k].n); }
    if (!got.length) { toast('<b>[SOBREVIVÊNCIA]</b> Bolsa cheia (' + fmtKg(weight()) + ').'); return; }
    floater(n.x, n.z, got.join(' · '), '#cfe8a0', true);
    s.picked[n.id] = s.clock + DAY(); dropNode(n); nodes.delete(n.id); save();
  }
  let nodeKey = '';
  function nodesTick() {
    if (!world()) { for (const n of nodes.values()) dropNode(n); nodes.clear(); nodeKey = ''; return; }
    const cx = Math.floor(player.x / CELL), cz = Math.floor(player.z / CELL), key = cx + ',' + cz;
    if (key === nodeKey) return; nodeKey = key;
    const s = S(), want = new Set();
    for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) for (const n of buildCell(cx + i, cz + j)) {
      want.add(n.id); if (nodes.has(n.id) || s.picked[n.id] > s.clock) continue;
      nodes.set(n.id, n); makeNode(n);
    }
    for (const [id, n] of nodes) if (!want.has(id)) { dropNode(n); nodes.delete(id); }
    for (const id in s.picked) if (s.picked[id] <= s.clock) delete s.picked[id];
  }

  /* ---------------- árvores: resina e derrubada ---------------- */
  const TREES = new Set(['oak', 'willow', 'fir']);
  const HITS = { oak: 6, willow: 5, fir: 4 };
  function treeMeshes() { const out = []; if (!window.CULL180) return out; for (const m of CULL180) if (m.parent && TREES.has(m.userData.tripo153)) out.push(m); return out; }
  function baseOf(m) { const u = m.userData; if (!u.base423) { u.base423 = m.instanceMatrix.array.slice(); u.n423 = m.instanceMatrix.count; u.col423 = m.instanceColor ? m.instanceColor.array.slice() : null; } return u.base423; }
  const alive = (B, i) => B[i * 16] !== 0 || B[i * 16 + 2] !== 0;
  function nearestTree(x, z, maxD) {
    let best = null, bd = maxD;
    for (const m of treeMeshes()) {
      const sp = m.userData.bs180; if (sp && Math.hypot(sp.center.x - x, sp.center.z - z) > sp.radius + maxD) continue;
      const B = baseOf(m), n = m.userData.n423;
      for (let i = 0; i < n; i++) { if (!alive(B, i)) continue; const d = Math.hypot(B[i * 16 + 12] - x, B[i * 16 + 14] - z); if (d < bd) { bd = d; best = { m, i, x: B[i * 16 + 12], z: B[i * 16 + 14], y: B[i * 16 + 13], id: m.userData.tripo153, d } } }
    }
    return best;
  }
  function hideTreeAt(x, z) { // zera a instância em todas as partes (tronco, copa, versão leve) e tira o colisor
    let hit = false;
    for (const m of treeMeshes()) {
      const sp = m.userData.bs180; if (sp && Math.hypot(sp.center.x - x, sp.center.z - z) > sp.radius + 2) continue;
      const B = baseOf(m), n = m.userData.n423;
      const direct = !m.userData.lite180, A = m.instanceMatrix.array; // sem versão leve o recorte (split423) não roda: zera direto
      for (let i = 0; i < n; i++) if (alive(B, i) && Math.abs(B[i * 16 + 12] - x) < .25 && Math.abs(B[i * 16 + 14] - z) < .25) { for (let k = 0; k < 12; k++) { B[i * 16 + k] = 0; if (direct) A[i * 16 + k] = 0; } hit = true; if (direct) m.instanceMatrix.needsUpdate = true; }
      m.userData.key423 = null;
    }
    try { const rem = []; hnear(HASH, x, z, c => { if (Math.hypot(c.x - x, c.z - z) < .8 && c.r < 3) rem.push(c); }); rem.forEach(c => hrem(c)); } catch (_) {}
    return hit;
  }
  let felledVer = -1;
  function reapplyFelled() { // árvore derrubada continua derrubada quando o pedaço do mapa recarrega
    const F = S().felled; let n = 0; for (const m of treeMeshes()) n += m.id;
    const ver = F.length * 7919 + n; if (ver === felledVer) return; felledVer = ver; // muda quando derruba ou quando entra pedaço novo do mapa
    for (const [x, z] of F) if (Math.abs(x - player.x) < 260 && Math.abs(z - player.z) < 260) hideTreeAt(x, z);
  }
  const hasAxe = () => has('machado') || (typeof weaponKind272 === 'function' && weaponKind272(run.equip?.w) === 'axe');
  const hasShovel = () => has('pa');
  /* ---------------- Terraplenagem com Pá/Enxada (v441) ---------------- */
  function levelTerrain441(tx, tz, r = 12, h = 0, msg) {
    const s = S();
    s.leveled = s.leveled || [];
    const ex = s.leveled.find(f => Math.hypot(f.x - tx, f.z - tz) < 5);
    if (ex) { ex.r = Math.max(ex.r || 12, r); ex.h = h; }
    else { s.leveled.push({ x: Math.round(tx * 10) / 10, z: Math.round(tz * 10) / 10, r, h }); if (s.leveled.length > 24) s.leveled.shift(); }
    if (window.TER245) { TER245.lx = null; try { if (typeof ter245tick === 'function') ter245tick(); } catch (_) {} }
    try { Anim303?.play('esmagar', 1.2); sfx('hit'); fxRing(tx, tz, 0xe3b86a, r * .4, .6); } catch (_) {}
    floater(tx, tz, 'TERRENO NIVELADO', '#e9dfc0', true);
    if (msg !== false) toast(msg || '<b>[TERRAPLENAGEM]</b> Terreno nivelado com a Pá/Enxada! O Carrinho passa sem gastar estamina.', 4500);
    save();
  }
  const shovelIt = { type: 'shovel441', x: 0, z: 0, r: 2.8, label: '', hidden: true, use: () => {
    if (!hasShovel()) { toast('Faça uma <b>Pá / Enxada</b> no Manual de Sobrevivência (2 Pedra Lascada + 1 Feixe de Lenha + 2 Fibras).', 4500); return; }
    const b = typeof biomeAt === 'function' ? biomeAt(player.x, player.z) : '';
    levelTerrain441(player.x, player.z, 13, 0, b === 'deserto' ? '<b>[TERRAPLENAGEM]</b> Duna de areia nivelada com a Pá/Enxada! Passagem plana para o Carrinho.' : '<b>[TERRAPLENAGEM]</b> Encosta nivelada com a Pá/Enxada!');
  } };
  const treeIt = { type: 'tree437', x: 0, z: 0, r: 2.6, label: '', hidden: true, use: () => chop() };
  let chopping = null;
  function chop() {
    const t = treeIt.tree; if (!t) return;
    if (!hasAxe()) { // sem machado: só resina
      const key = 'res:' + Math.round(t.x) + ',' + Math.round(t.z), s = S();
      if (s.picked[key] > s.clock) { toast('Esta árvore já deu a resina de hoje.'); return; }
      try { Anim303?.play('palma', 1.3); } catch (_) {}
      if (add('resina', 1 + (Math.random() * 2 | 0))) s.picked[key] = s.clock + DAY();
      toast('Sem machado você só tira <b>Resina</b>. Faça um <b>Machado de Pedra</b> no Manual de Sobrevivência (2 Pedra Lascada + 3 Fibras).', 5000);
      return;
    }
    try { const r = martialState260(); if (r.vigor < 8) { toast('Sem fôlego para o machado. Espere a estamina voltar.'); return; } r.vigor -= 8; r.vigorWait = .8; } catch (_) {}
    if (!chopping || chopping.x !== t.x || chopping.z !== t.z) chopping = { x: t.x, z: t.z, id: t.id, hits: 0, need: HITS[t.id] || 5 };
    chopping.hits++;
    player.face = Math.atan2(t.x - player.x, t.z - player.z);
    try { Anim303?.play('corte', 1); sfx('hit'); } catch (_) {}
    floater(t.x, t.z, 'TOC ' + chopping.hits + '/' + chopping.need, '#f0d9a0');
    if (chopping.hits >= chopping.need) { fell(t); chopping = null; }
  }
  function fell(t) {
    const s = S();
    s.felled.push([Math.round(t.x * 100) / 100, Math.round(t.z * 100) / 100]); if (s.felled.length > 4000) s.felled.shift();
    hideTreeAt(t.x, t.z); felledVer = -1;
    // a árvore cai: cópia simples do modelo (materiais fora da instância) girando até o chão
    const m = TripoEnvironment153.models[t.id], g = new T.Group(), pivot = new T.Group();
    if (m) {
      const mats = tripoMats[t.id] || (tripoMats[t.id] = m.parts.map(p => Array.isArray(p.material) ? p.material.map(plainMat) : plainMat(p.material)));
      const B = baseOf(t.m), sc = Math.hypot(B[t.i * 16] || 0, B[t.i * 16 + 1] || 0, B[t.i * 16 + 2] || 0) || 1;
      m.parts.forEach((p, i) => { const me = new T.Mesh(p.geometry, mats[i]); me.castShadow = true; me.scale.setScalar(sc); pivot.add(me); });
    }
    const dir = Math.atan2(t.x - player.x, t.z - player.z);
    g.position.set(t.x, 0, t.z); g.rotation.y = dir; g.add(pivot); scene.add(g);
    const t0 = performance.now();
    (function fall() {
      const k = Math.min(1, (performance.now() - t0) / 1600); pivot.rotation.x = (k * k) * Math.PI / 2 * .97;
      if (k < 1) { setTimeout(fall, 16); return; }
      setTimeout(() => { scene.remove(g); dropLogs(t.x, t.z, dir, t.id === 'oak' ? 3 : 2); }, 500);
    })();
    toast('<b>[MADEIRA]</b> Árvore derrubada! As <b>Toras Brutas</b> ficaram no chão: F para cortar ou carregar.', 4500);
    try { sfx('crash'); } catch (_) {}
    if (Math.random() < .5) add('resina', 1, true);
    save();
  }

  /* ---------------- Tora Bruta física ---------------- */
  const logs = new Map(); // id → {x,z,ry,g,it}
  function dropLogs(x, z, dir, n) {
    for (let i = 0; i < n; i++) { const d = 2.5 + i * 2.6, lx = x + Math.sin(dir) * d, lz = z + Math.cos(dir) * d; addLog({ id: 'L' + Date.now().toString(36) + i, x: lx, z: lz, ry: dir }); }
  }
  function addLog(L0, quiet) {
    const s = S(); if (!s.logs.find(q => q.id === L0.id)) s.logs.push({ id: L0.id, x: L0.x, z: L0.z, ry: L0.ry });
    if (!quiet) save();
    spawnLog(L0);
  }
  function spawnLog(l) {
    if (logs.has(l.id)) return;
    const g = new T.Group(); g.position.set(l.x, 0, l.z); g.rotation.y = l.ry;
    glb('tora').then(t => { if (t) g.add(fit(t, .8, 2.6)); }); // tora deitada: comprimento no eixo z do modelo
    scene.add(g);
    const it = { type: 'log437', x: l.x, z: l.z, r: 2.4, label: 'F · TORA BRUTA (cortar / carregar)', use: () => logMenu(l) };
    L.inter.push(it); logs.set(l.id, { l, g, it });
  }
  function removeLog(id) {
    const o = logs.get(id); if (o) { scene.remove(o.g); const i = L.inter.indexOf(o.it); if (i >= 0) L.inter.splice(i, 1); logs.delete(id); }
    const s = S(); s.logs = s.logs.filter(q => q.id !== id); save();
  }
  function logsTick() {
    const s = S();
    if (!world()) { for (const o of logs.values()) { scene.remove(o.g); const i = L.inter.indexOf(o.it); if (i >= 0) L.inter.splice(i, 1); } logs.clear(); return; }
    for (const l of s.logs) { const d = Math.hypot(l.x - player.x, l.z - player.z); if (d < 110 && !logs.has(l.id)) spawnLog(l); }
    for (const [id, o] of logs) if (Math.hypot(o.l.x - player.x, o.l.z - player.z) > 130) { scene.remove(o.g); const i = L.inter.indexOf(o.it); if (i >= 0) L.inter.splice(i, 1); logs.delete(id); }
  }
  function logMenu(l) {
    const axe = hasAxe(), cart = window.Cart437 && Cart437.near(l.x, l.z, 6);
    const b = (id, t, on = true) => '<button class="btn" id="' + id + '"' + (on ? '' : ' disabled') + '>' + t + '</button>';
    openModal('TORA BRUTA', '<p>Um tronco de uns 40 kg. ' + (axe ? 'Com o machado dá para cortar aqui mesmo.' : '<span style="color:#ffb36b">Sem machado: só dá para carregar.</span>') + '</p><div style="display:flex;gap:8px;flex-wrap:wrap">' +
      b('l437a', 'CORTAR EM 3 FEIXES DE LENHA', axe) + b('l437b', 'CORTAR EM 2 TÁBUAS', axe) + b('l437c', 'CARREGAR NO OMBRO', !S().carry) + b('l437d', 'PÔR NO CARRINHO', !!cart) + '</div>');
    const on = (id, fn) => { const e = document.getElementById(id); if (e) e.onclick = () => { closeModal(); fn(); }; };
    const cut = (k, n) => { try { const r = martialState260(); if (r.vigor < 15) { toast('Sem fôlego. Espere a estamina voltar.'); return; } r.vigor -= 15; } catch (_) {} try { Anim303?.play('esmagar', 1); sfx('hit'); } catch (_) {}
      const s = S(); s.bag[k] = s.bag[k] || 0; const got = add(k, n); if (got) removeLog(l.id); };
    on('l437a', () => cut('lenha', 3)); on('l437b', () => cut('tabua', 2));
    on('l437c', () => { S().carry = 'tora'; removeLog(l.id); shoulder(true); toast('Tora no ombro: mais lento. Atacar ou F de novo larga a tora.', 4000); });
    on('l437d', () => { if (Cart437.load('tora', 1)) removeLog(l.id); });
  }
  // tora no ombro
  let shoulderG = null;
  function shoulder(on) {
    if (shoulderG) { shoulderG.parent?.remove(shoulderG); shoulderG = null; }
    if (!on || !player?.m?.root) return;
    const g = new T.Group(); shoulderG = g;
    glb('tora').then(t => { if (!t || shoulderG !== g) return; const p = fit(t, .45, 1.7); p.position.set(.3, 0, -.1); p.rotation.y = .3; g.add(p); });
    g.position.y = 1.35; player.m.root.add(g);
  }
  function dropCarry() {
    const s = S(); if (!s.carry) return;
    s.carry = null; shoulder(false);
    addLog({ id: 'L' + Date.now().toString(36), x: player.x + Math.sin(player.face || 0) * 1.4, z: player.z + Math.cos(player.face || 0) * 1.4, ry: (player.face || 0) + Math.PI / 2 });
  }
  const carryIt = { type: 'carry437', x: 0, z: 0, r: 1.2, label: 'F · LARGAR A TORA', hidden: true, use: () => { if (window.Cart437 && Cart437.near(player.x, player.z, 4) && Cart437.load('tora', 1)) { S().carry = null; shoulder(false); return; } dropCarry(); } };
  if (typeof movementSpeed === 'function') { const ms0 = movementSpeed; movementSpeed = function (raw) { const s = run?.surv437; let k = 1; if (s?.carry) k *= .7; if (s && s.sede <= 0) k *= .9; return ms0(raw * k); }; }
  if (typeof attack === 'function') { const at0 = attack; attack = function () { try { if (run?.surv437?.carry) dropCarry(); } catch (_) {} return at0.apply(this, arguments); }; }

  /* ---------------- caça ---------------- */
  const GAME = { coelho: [1, 1, 0], alpaca: [2, 2, 1], lobo: [2, 1, 1], chifrudo: [2, 3, 2], yeti: [3, 3, 2], dino: [2, 3, 2], raptor: [1, 2, 1], sapo: [0, 1, 0], passaro: [0, 1, 1], lobofendido: [2, 1, 2], yetinho: [1, 1, 1] };
  if (typeof killEnemy === 'function') { const ke0 = killEnemy; killEnemy = function (e) {
    const was = e && !e.dead; const r = ke0.apply(this, arguments);
    try { if (was && e.dead && world() && ready()) { const k = String(e.kind || '').replace(/_(f|a)$/, ''), g = GAME[k];
      if (g && Math.hypot(e.x - player.x, e.z - player.z) < 30) { const got = []; [['couro', g[0]], ['carne', g[1]], ['osso', g[2]]].forEach(([id, q]) => { if (q) { const n = add(id, q + (Math.random() < .4 ? 1 : 0), true); if (n) got.push(n + ' ' + IT[id].n); } }); if (got.length) floater(e.x, e.z, got.join(' · '), '#e8c79a', true); } } } catch (_) {}
    return r; }; }

  /* ---------------- janela da bolsa ---------------- */
  function bagView() {
    const s = S(), b = s.bag, rows = Object.keys(IT).filter(k => b[k]);
    const bar = (v, c) => '<div style="height:8px;background:#0b1612;border:1px solid #b9974f55;border-radius:4px"><div style="height:100%;width:' + Math.max(0, Math.min(100, v)) + '%;background:' + c + ';border-radius:4px"></div></div>';
    const soon = k => { const q = s.batches[k]; if (!q?.length) return ''; const t = Math.min(...q) - s.clock; return ' <small style="opacity:.7">(estraga em ' + (t > DAY() ? (t / DAY()).toFixed(1).replace('.', ',') + ' dia' : Math.max(1, Math.round(t / 60)) + ' min') + ')</small>'; };
    let h = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px"><div>Fome ' + Math.round(s.fome) + '%' + bar(s.fome, '#e3a64a') + '</div><div>Sede ' + Math.round(s.sede) + '%' + bar(s.sede, '#4fb7e8') + '</div></div>';
    const wSrc = window.Biomes295?.warmSource441?.();
    h += '<p style="margin:4px 0">' + (s.fed > 0 ? '<b style="color:#9fe39a">Bem Alimentado</b> por ' + Math.ceil(s.fed / 60) + ' min · ' : '') + (s.torchT > 0 ? '<b style="color:#ffb347">Tocha acesa</b> (' + Math.ceil(s.torchT / 60) + ' min) · ' : '') + (s.chaT > 0 ? '<b style="color:#9fe39a">Chá Térmico</b> (' + Math.ceil(s.chaT / 60) + ' min) · ' : '') + (wSrc ? '<b style="color:#9fe39a">Calor: ' + esc(wSrc) + '</b> · ' : (s.cold441 > 5 ? '<b style="color:#9fd8ff">Frio/Congelamento ' + Math.round(s.cold441) + '%</b> · ' : '')) + (s.sickT > 0 ? '<b style="color:#ff9b8b">Mal-estar</b> · ' : '') + 'Carga ' + fmtKg(weight()) + ' de ' + fmtKg(cap()) + (s.carry ? ' · Tora no ombro' : '') + '</p>';
    const c = s.canteen; h += '<p style="margin:4px 0">' + (c ? 'Cantil: ' + (c.sips ? c.sips + '/5 goles de ' + WATER_K[c.kind].toLowerCase() : 'vazio') + (c.sips ? ' <button class="btn" id="b437sip">BEBER</button>' : '') : 'Sem cantil.') + '</p>';
    h += '<table style="width:100%;border-collapse:collapse">';
    for (const k of rows) h += '<tr style="border-bottom:1px solid #b9974f33"><td style="padding:5px" title="' + esc(IT[k].d) + '"><b>' + IT[k].n + '</b> ×' + b[k] + soon(k) + '<br><small style="opacity:.7">' + esc(IT[k].d) + '</small></td><td style="text-align:right;white-space:nowrap">' + fmtKg(IT[k].kg * b[k]) + (IT[k].eat ? ' <button class="btn" data-eat="' + k + '">COMER</button>' : '') + (IT[k].use === 'torch' ? ' <button class="btn" data-torch="1">ACENDER</button>' : '') + (k === 'pa' && world() ? ' <button class="btn" data-level="1">NIVELAR TERRENO</button>' : '') + ' <button class="btn" data-drop="' + k + '" title="Largar 1">−1</button></td></tr>';
    if (!rows.length) h += '<tr><td style="opacity:.6;padding:8px">Vazia. Colete pedras, arbustos, cactos e ervas pelo mundo (F), cace e derrube árvores.</td></tr>';
    h += '</table><div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="b437man">MANUAL DE SOBREVIVÊNCIA</button></div>';
    openModal('BOLSA DE SOBREVIVÊNCIA', h);
    const box = document.getElementById('modal') || document;
    box.querySelectorAll('[data-eat]').forEach(e => e.onclick = () => { eat(e.dataset.eat); bagView(); });
    box.querySelectorAll('[data-torch]').forEach(e => e.onclick = () => { lightTorch(); bagView(); });
    box.querySelectorAll('[data-level]').forEach(e => e.onclick = () => { closeModal(); levelTerrain441(player.x, player.z, 13, 0); });
    box.querySelectorAll('[data-drop]').forEach(e => e.onclick = () => { take(e.dataset.drop, 1); bagView(); });
    const sp = document.getElementById('b437sip'); if (sp) sp.onclick = () => { sip(); bagView(); };
    const mn = document.getElementById('b437man'); if (mn) mn.onclick = () => { if (window.Build437) Build437.manual(); };
  }

  /* ---------------- HUD ----------------
     v440 (Ian: "muito perto uma da outra e tampa"): Fome e Sede ficam dentro do painel de Vida/Estamina (#stat),
     lado a lado, com as mesmas barras (.bar/.lbl) — nada solto no meio da tela. */
  const hud = document.createElement('div'); hud.id = 'hud437';
  hud.style.cssText = 'display:none;cursor:pointer;margin-top:2px';
  hud.title = 'Fome cai com o tempo, o esforço e o frio; Sede cai mais rápido no calor e no esforço. Clique para abrir a bolsa (tecla 8).';
  const col = (id, c) => '<div style="flex:1;min-width:0"><div class="bar" style="height:5px"><i id="hb437' + id + '" style="width:100%;background:' + c + '"></i></div><div class="lbl"><span>' + id.toUpperCase() + '</span><span id="hb437' + id + 'T">100</span></div></div>';
  hud.innerHTML = '<div style="display:flex;gap:8px">' + col('Fome', '#e3a64a') + col('Sede', '#4fb7e8') + '</div><div id="hb437x" style="font-size:10px;color:#9fe39a;min-height:0"></div>';
  hud.onclick = () => { if (ready()) bagView(); };
  function hudTick() {
    const st = document.getElementById('stat');
    if (st && hud.parentElement !== st) { const sec = document.getElementById('secondaryResources260'); if (sec && sec.parentElement === st) sec.after(hud); else st.appendChild(hud); }
    const on = !!st && ready() && L.mode !== 'none';
    hud.style.display = on ? 'block' : 'none'; if (!on) return;
    const s = S();
    for (const [k, v, c] of [['Fome', s.fome, '#e3a64a'], ['Sede', s.sede, '#4fb7e8']]) { const b = document.getElementById('hb437' + k); b.style.width = v.toFixed(0) + '%'; b.style.background = v < 15 ? '#ff6b5a' : c; document.getElementById('hb437' + k + 'T').textContent = Math.round(v) + '%'; }
    const wSrc = window.Biomes295?.warmSource441?.(), bio = typeof biomeAt === 'function' && L.mode === 'world' ? biomeAt(player.x, player.z) : '';
    document.getElementById('hb437x').textContent = [
      s.fed > 0 ? 'Bem Alimentado' : '',
      s.torchT > 0 ? 'Tocha (' + Math.ceil(s.torchT / 60) + 'm)' : '',
      s.chaT > 0 ? 'Chá Térmico (' + Math.ceil(s.chaT / 60) + 'm)' : '',
      bio === 'neve' ? (wSrc ? 'Aquecido: ' + wSrc : 'Frio ' + Math.round(s.cold441 || 0) + '%') : '',
      bio === 'deserto' ? 'Calor Árido (Sede ×2,3)' : '',
      s.sickT > 0 ? 'Mal-estar' : '',
      s.carry ? 'Tora no ombro' : '',
      player.sheathed441 ? 'Arma guardada' : ''
    ].filter(Boolean).join(' · ');
  }
  (function menu() {
    const ref = document.getElementById('bDiary'); if (!ref) { setTimeout(menu, 500); return; }
    if (document.getElementById('bSurv437')) return;
    const a = document.createElement('button'); a.className = 'mini'; a.id = 'bSurv437'; a.textContent = 'SOBREVIVÊNCIA'; a.onclick = () => { if (ready()) bagView(); };
    ref.after(a);
  })();
  const KEY = 'surv437';
  try { if (!KEYACT.find(k => k[0] === KEY)) KEYACT.push([KEY, 'Bolsa de sobrevivência', 'Digit8']); } catch (_) {}
  addEventListener('keydown', e => {
    if (e.repeat || !ready()) return; const t = e.target; if (t && ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return;
    let k = 'Digit8'; try { k = keyOf(KEY); } catch (_) {}
    if (e.code === k && !(typeof modalOpen !== 'undefined' && modalOpen)) { e.preventDefault(); bagView(); }
  }, true);

  function save() { clearTimeout(save.t); save.t = setTimeout(() => { try { saveRun(); } catch (_) {} }, 600); }

  /* ---------------- laço ---------------- */
  let last = performance.now(), slow = 0, slow2 = 0, lastRun = null;
  function loop() {
    const now = performance.now(), dt = Math.min(.25, (now - last) / 1000); last = now;
    try {
      hudTick();
      if (ready()) {
        if (run !== lastRun) { lastRun = run; felledVer = -1; S(); shoulder(!!S().carry); fedWas = !(S().fed > 0); syncFed(); if (window.TER245) TER245.lx = null; }
        if (!paused && !player.dead) {
          needsTick(dt);
          slow -= dt; if (slow <= 0) { slow = .3;
            const s = S(), w = world();
            // árvore mais perto (2,6 m): resina ou derrubar
            const t = w ? nearestTree(player.x, player.z, 2.6) : null;
            treeIt.tree = t; treeIt.hidden = !t; if (t) { treeIt.x = t.x; treeIt.z = t.z; treeIt.label = hasAxe() ? 'F · DERRUBAR ÁRVORE' + (chopping && chopping.x === t.x ? ' (' + chopping.hits + '/' + chopping.need + ')' : '') : 'F · COLETAR RESINA'; }
            const wn = w ? waterNear() : null; waterIt.hidden = !wn; if (wn) { waterIt.x = player.x; waterIt.z = player.z; waterIt.label = 'F · BEBER / ENCHER O CANTIL'; }
            carryIt.hidden = !s.carry; carryIt.x = player.x; carryIt.z = player.z;
            const gh = w && typeof terrH === 'function' ? Math.abs(terrH(player.x, player.z)) : 0;
            const bio = w && typeof biomeAt === 'function' ? biomeAt(player.x, player.z) : '';
            const steep = w && hasShovel() && (gh > 1.35 || (bio === 'deserto' && gh > .45)) && !(s.leveled || []).some(f => Math.hypot(f.x - player.x, f.z - player.z) < 8);
            shovelIt.hidden = !steep; if (steep) { shovelIt.x = player.x; shovelIt.z = player.z; shovelIt.label = bio === 'deserto' ? 'F · NIVELAR DUNA (Pá/Enxada)' : 'F · NIVELAR ENCOSTA (Pá/Enxada)'; }
            for (const it of [treeIt, waterIt, carryIt, shovelIt]) { const i = L.inter.indexOf(it); if (!it.hidden && i < 0) L.inter.push(it); else if (it.hidden && i >= 0) L.inter.splice(i, 1); }
          }
          slow2 -= dt; if (slow2 <= 0) { slow2 = 1; nodesTick(); logsTick(); if (world()) reapplyFelled(); spoilTick(); syncFed(); }
        }
      }
    } catch (e) { if (!loop.err) { loop.err = 1; console.warn('surv437', e); } }
    setTimeout(loop, 50);
  }
  loop();

  function clearCarry() { S().carry = null; shoulder(false); save(); }
  window.Surv437 = { clearCarry, S, IT, add, give: add, take, has, count: has, eat, drink, sip, lightTorch, levelTerrain441, levelTerrain: levelTerrain441, hasShovel, weight, cap, glb, fit, envPiece, bagView, hasAxe, nearestTree, hideTreeAt, addLog, dropCarry, save, world, ready, mods, WATER_K };
})();
