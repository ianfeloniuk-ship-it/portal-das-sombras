/* v437 (Ian): Construção peça por peça (estilo The Forest) e as estruturas de sobrevivência.
   Manual de Sobrevivência → molde translúcido no chão → leva o material (bolsa, carrinho perto ou tora no ombro) e
   aperta F para encaixar cada peça. O modelo pronto (Tripo) aparece de baixo para cima por etapa (fundação, paredes,
   telhado, porta); a obra fica salva no mapa (run.build437).
   Fogueira (cozinhar, ferver, chá, aquecer no frio), Abrigo e Cabana (dormir, salvar, tirar cansaço; cabana com lareira
   e porta trancável), suporte de toras, varal (defumar/salgar), coletor de chuva, bancada, baú, armadilhas de espinho e
   de laço, paliçada e portão. O carrinho de mão também é montado aqui (tools/cart437.js).
   Relevo: raiz em y=0 (terrain245 soma terrH pela raiz). Corte por etapa = shader próprio no y do mundo antes do relevo. */
(function () {
  'use strict';
  const T = THREE, TAU = Math.PI * 2;
  const U = () => window.Surv437;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const DAY = () => (typeof DAYLEN !== 'undefined' ? DAYLEN : 1440);

  /* ---------------- catálogo ---------------- */
  // m: modelo (models/m437 ou env:<id> do cenário Tripo), h/w: altura e largura máx., r: colisor, st: etapas [{n, need}]
  const B = {
    fogueira: { n: 'Fogueira', m: 'fogueira', h: .75, w: 1.7, r: .75, d: 'Cozinha, ferve água, faz chá e aquece no frio. Gasta lenha.', st: [{ n: 'Círculo de pedras', need: { pedra: 4 } }, { n: 'Lenha', need: { lenha: 1 } }] },
    abrigo: { n: 'Abrigo de galhos', m: 'abrigo', h: 2.3, w: 3.2, r: .9, d: 'Dormir, salvar e tirar o cansaço.', st: [{ n: 'Armação', need: { lenha: 2, cipo: 2 } }, { n: 'Cobertura', need: { fibra: 6, couro: 1 } }] },
    cabana: { n: 'Cabana de toras', m: 'cabana', h: 4.4, w: 5.4, r: 2.5, d: 'Cama (sono completo), lareira e porta trancável.', st: [{ n: 'Fundação', need: { pedra: 8 } }, { n: 'Piso', need: { tabua: 6 } }, { n: 'Paredes', need: { tora: 6 } }, { n: 'Telhado', need: { tabua: 6, cipo: 4 } }, { n: 'Porta e lareira', need: { tabua: 2, minerio: 1, pedra: 4 } }] },
    suporte: { n: 'Suporte de toras', m: 'suporte-toras', h: 1.7, w: 1.9, r: .9, d: 'Guarda até 12 toras e 30 feixes de lenha.', st: [{ n: 'Armação', need: { tora: 2, cipo: 2 } }] },
    varal: { n: 'Varal de secagem', m: 'varal', h: 1.9, w: 2.2, r: .7, d: 'Defuma carne (mais rápido perto de fogueira acesa) e salga com Sal Grosso.', st: [{ n: 'Postes e travessa', need: { tabua: 2, cipo: 3, fibra: 4 } }] },
    coletor: { n: 'Coletor de chuva', m: 'coletor', h: 1.6, w: 1.8, r: .7, d: 'Junta água limpa quando chove. Enche o cantil.', st: [{ n: 'Estacas', need: { tabua: 2, cipo: 2 } }, { n: 'Funil de couro', need: { couro: 2 } }] },
    bancada: { n: 'Bancada', m: 'bancada', h: 1.3, w: 2.2, r: 1, d: 'Faz cantil, carrinho e ferramentas melhores.', st: [{ n: 'Tampo', need: { tora: 1, tabua: 4 } }, { n: 'Ferramentas', need: { minerio: 2 } }] },
    bau: { n: 'Baú', m: 'bau', h: .9, w: 1.2, r: .6, d: 'Guarda até 200 kg (separado do banco da Selene).', st: [{ n: 'Caixa', need: { tabua: 4, minerio: 1 } }] },
    espinho: { n: 'Armadilha de espinhos', m: 'armadilha', h: .8, w: 1.8, r: 0, flat: true, d: 'Fere e prende monstros que pisam nela.', st: [{ n: 'Estacas', need: { lenha: 2, osso: 2, fibra: 2 } }] },
    laco: { n: 'Armadilha de laço', m: 'armadilha', h: .45, w: 1.1, r: 0, flat: true, d: 'Pega bicho pequeno sozinha: carne e couro a cada poucas horas.', st: [{ n: 'Laço', need: { fibra: 4, cipo: 2 } }] },
    palicada: { n: 'Paliçada', m: 'env:palisade', h: 3, w: 4.4, line: 4.4, d: 'Muro de toras (4,4 m).', st: [{ n: 'Toras', need: { tora: 3, cipo: 2 } }] },
    portao: { n: 'Portão', m: 'env:palisade', h: 3, w: 4.4, line: 4.4, gate: true, d: 'Paliçada que abre e fecha (F).', st: [{ n: 'Toras', need: { tora: 3, cipo: 2 } }, { n: 'Dobradiças', need: { tabua: 2, minerio: 1 } }] },
    carrinho: { n: 'Carrinho de mão', m: 'carrinho', h: 1.25, w: 2.9, r: 0, cart: true, d: 'Puxado pelo personagem: carrega 400 kg.', st: [{ n: 'Rodas e eixo', need: { tabua: 2, minerio: 1 } }, { n: 'Caixa e varais', need: { tabua: 4, cipo: 2 } }] }
  };
  const TOOLS = {
    machado: { need: { pedra: 2, fibra: 3 } },
    pa: { need: { pedra: 2, lenha: 1, fibra: 2 } },
    tocha: { need: { lenha: 1, resina: 1 } },
    cantil: { need: { couro: 2, cipo: 1 }, bench: true }
  };
  const sites = () => (run.build437 = run.build437 || []);
  const total = b => B[b.t].st.reduce((a, s) => a + Object.values(s.need).reduce((x, y) => x + y, 0), 0);
  const doneUnits = b => Object.values(b.got || {}).reduce((x, y) => x + y, 0);
  const complete = b => b.stage >= B[b.t].st.length;
  const IT = () => U().IT;

  /* ---------------- materiais: corte por etapa e molde ---------------- */
  function cutMat(src, cut) {
    const m = src.clone();
    m.onBeforeCompile = sh => {
      sh.uniforms.uCut437 = cut;
      sh.vertexShader = 'varying float vY437;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvY437=(modelMatrix*vec4(transformed,1.)).y;');
      sh.fragmentShader = 'uniform float uCut437;varying float vY437;\n' + sh.fragmentShader.replace('void main() {', 'void main() {\nif(vY437>uCut437)discard;');
    };
    m.customProgramCacheKey = () => 'cut437';
    return m;
  }
  const ghostMat = new T.MeshBasicMaterial({ color: 0x9fe8ff, transparent: true, opacity: .26, depthWrite: false });
  const badMat = new T.MeshBasicMaterial({ color: 0xff7b6b, transparent: true, opacity: .3, depthWrite: false });
  function model(def) { // Promise<Group> com raiz no chão
    if (def.m.startsWith('env:')) return (typeof TripoEnvironment153 !== 'undefined' ? TripoEnvironment153.ready : Promise.resolve()).then(() => { const p = U().envPiece(def.m.slice(4), def.h, def.line); if (!p) return null; const g = new T.Group(); g.add(p); g.userData.h = def.h; return g; });
    return U().glb(def.m).then(t => {
      if (!t) return null; const m = U().fit(t, def.flat ? def.w : def.h, def.w); if (!def.flat) return m;
      // armadilha: o modelo vem em pé (moldura); deita no chão com a raiz em y=0
      if (t.userData.sx < t.userData.sz) m.rotation.z = Math.PI / 2; else m.rotation.x = -Math.PI / 2; /* deita pelo lado mais fino */ const g = new T.Group(); g.add(m); g.updateMatrixWorld(true); const bb = new T.Box3().setFromObject(m); m.position.y -= bb.min.y; m.position.x -= (bb.min.x + bb.max.x) / 2; m.position.z -= (bb.min.z + bb.max.z) / 2; g.userData.h = bb.max.y - bb.min.y; return g;
    });
  }
  function skin(g, mat) { g.traverse(o => { if (o.isMesh) o.material = Array.isArray(o.material) ? o.material.map(() => mat) : mat; }); return g; }

  /* ---------------- obras no mapa ---------------- */
  const live = new Map(); // id → {b, g, real, ghost, cut, it, cols, fx}
  function spawnSite(b) {
    if (live.has(b.id)) return;
    const def = B[b.t], g = new T.Group(); g.position.set(b.x, 0, b.z); g.rotation.y = b.ry; scene.add(g);
    if (def.water) { const w = window.Water391 && Water391.waterAt(b.x, b.z); g.userData.terrainAbsolute245 = true; g.position.y = w ? w.top : (TER245.SEA439?.Y || 0); } /* v440: barco no estaleiro flutua */
    const o = { b, g, cut: { value: 0 }, cols: [], it: null };
    live.set(b.id, o);
    model(def).then(m => {
      if (live.get(b.id) !== o || !m) return;
      o.h = m.userData.h || def.h;
      const real = m.clone(true); real.traverse(q => { if (q.isMesh) q.material = Array.isArray(q.material) ? q.material.map(x => cutMat(x, o.cut)) : cutMat(q.material, o.cut); });
      const ghost = skin(m.clone(true), ghostMat);
      g.add(real, ghost); o.real = real; o.ghost = ghost;
      refresh(o);
    });
    o.it = { type: 'build437', x: b.x, z: b.z, r: def.line ? 3 : def.water ? def.w * .5 + 9 : Math.max(2.2, (def.r || .6) + 1.6), label: '', use: () => useSite(o) };
    L.inter.push(o.it);
    refresh(o);
  }
  function dropSite(id) { const o = live.get(id); if (!o) return; scene.remove(o.g); const i = L.inter.indexOf(o.it); if (i >= 0) L.inter.splice(i, 1); o.cols.forEach(c => { try { hrem(c); } catch (_) {} }); if (o.fx) o.fx.light.parent?.remove(o.fx.light); live.delete(id); }
  function refresh(o) {
    const b = o.b, def = B[b.t], done = complete(b);
    o.cut.value = done ? 1e4 : o.g.position.y + (o.h || def.h) * (o.g.scale.y || 1) * Math.max(.04, doneUnits(b) / total(b));
    if (o.ghost) o.ghost.visible = !done;
    // colisores só depois da 1ª etapa
    o.cols.forEach(c => { try { hrem(c); } catch (_) {} }); o.cols = [];
    if (b.stage > 0 && !(def.gate && b.open)) {
      if (def.line) { const n = 5; for (let i = 0; i < n; i++) { const k = (i / (n - 1) - .5) * def.line, c = { x: b.x + Math.cos(b.ry) * k, z: b.z - Math.sin(b.ry) * k, r: .55 }; o.cols.push(c); } }
      else if (def.r) o.cols.push({ x: b.x, z: b.z, r: def.r });
      o.cols.forEach(c => { try { hadd(HASH, c); } catch (_) {} });
    }
    if (o.real && def.gate) o.real.position.y = b.open ? -2.7 : 0; // portão aberto desce na vala
    o.it.label = label(b);
  }
  function stageNeed(b) { const s = B[b.t].st[b.stage]; if (!s) return null; const got = b.got || {}, miss = {}; for (const k in s.need) { const m = s.need[k] - (got[k] || 0); if (m > 0) miss[k] = m; } return { s, miss }; }
  function label(b) {
    const def = B[b.t];
    if (!complete(b)) { const { s, miss } = stageNeed(b), k = Object.keys(miss)[0]; return 'F · ENCAIXAR PEÇA: ' + s.n + ' (' + IT()[k].n + ' faltam ' + miss[k] + ')'; }
    return { fogueira: 'F · FOGUEIRA', abrigo: 'F · ABRIGO (dormir / salvar)', cabana: 'F · CABANA', suporte: 'F · SUPORTE DE TORAS', varal: 'F · VARAL', coletor: 'F · COLETOR DE CHUVA', bancada: 'F · BANCADA', bau: 'F · BAÚ', espinho: 'F · ARMADILHA (recolher)', laco: 'F · ARMADILHA DE LAÇO', palicada: 'F · PALIÇADA', portao: b.open ? 'F · FECHAR PORTÃO' : 'F · ABRIR PORTÃO' }[b.t] || 'F · ' + def.n.toUpperCase();
  }
  // tira 1 unidade de onde tiver: bolsa → carrinho a 8 m → tora no ombro
  function grab(k) {
    if (U().has(k, 1)) { U().take(k, 1); return 'bolsa'; }
    if (window.Cart437 && Cart437.near(player.x, player.z, 8) && Cart437.has(k, 1)) { Cart437.take(k, 1); return 'carrinho'; }
    if (k === 'tora' && U().S().carry === 'tora') { U().clearCarry(); return 'ombro'; }
    return null;
  }
  function placePiece(o) {
    const b = o.b, nd = stageNeed(b); if (!nd) return;
    const ks = Object.keys(nd.miss); let used = null, src = null;
    for (const k of ks) { src = grab(k); if (src) { used = k; break; } }
    if (!used) { toast('<b>[CONSTRUÇÃO]</b> Falta material para ' + nd.s.n + ': ' + ks.map(k => nd.miss[k] + ' ' + IT()[k].n).join(', ') + '. Traga na bolsa, no carrinho ou no ombro.', 5000); return; }
    b.got = b.got || {}; b.got[used] = (b.got[used] || 0) + 1;
    try { Anim303?.play('esmagar', 1.1); sfx('hit'); } catch (_) {}
    floater(b.x, b.z, '+1 ' + IT()[used].n + (src !== 'bolsa' ? ' (' + src + ')' : ''), '#cfe8a0');
    if (!Object.keys(stageNeed(b).miss).length) {
      b.stage++; b.got = {};
      if (complete(b)) finish(o); else toast('<b>[CONSTRUÇÃO]</b> ' + B[b.t].n + ': etapa "' + nd.s.n + '" pronta. Próxima: ' + B[b.t].st[b.stage].n + '.', 4000);
    }
    refresh(o); U().save();
  }
  function finish(o) {
    const b = o.b, def = B[b.t];
    try { fxRing(b.x, b.z, 0xffd38a, 2, .6); sfx('arise'); } catch (_) {}
    if (def.boat && window.Boats440) { run.build437 = sites().filter(q => q !== b); dropSite(b.id); Boats440.launch(b); return; } /* v440: barco pronto vai para a água */
    if (def.cart) { // carrinho pronto vira o carrinho de verdade
      run.build437 = sites().filter(q => q !== b); dropSite(b.id);
      if (run.cart437) { toast('Você já tem um carrinho: as peças viraram 6 Tábuas.'); U().add('tabua', 6, true); return; }
      Cart437.create(b.x, b.z, b.ry); toast('<b>[CONSTRUÇÃO]</b> Carrinho de mão pronto! F perto dele para puxar.', 5000); return;
    }
    if (b.t === 'fogueira') b.fuel = DAY() / 6;
    toast('<b>[CONSTRUÇÃO]</b> ' + def.n + ' pronta!', 4000);
  }

  /* ---------------- uso das estruturas ---------------- */
  const btn = (id, t, on = true) => '<button class="btn" id="' + id + '"' + (on ? '' : ' disabled') + '>' + t + '</button>';
  const on = (id, fn) => { const e = document.getElementById(id); if (e) e.onclick = fn; };
  function useSite(o) {
    const b = o.b; if (!complete(b)) { placePiece(o); return; }
    ({ fogueira: fireView, abrigo: o2 => restView(o2, 'abrigo'), cabana: o2 => restView(o2, 'cabana'), suporte: rackView, varal: rackDryView, coletor: rainView, bancada: benchView, bau: chestView, espinho: trapView, laco: snareView, palicada: wallView, portao: gateView }[b.t] || (() => {}))(o);
  }
  // fogo
  const lit = b => b.fuel > 0;
  function cookList() { return [['carne', 'assada', 'Assar carne'], ['cogumelo', 'cogu_assado', 'Assar cogumelos']]; }
  function fireView(o, title) {
    const b = o.b, S = U().S(), c = S.canteen;
    let h = '<p>' + (lit(b) ? '<b style="color:#ffb347">Acesa</b> · lenha para ' + Math.ceil(b.fuel / 60) + ' min' : '<span style="opacity:.7">Apagada.</span> Ponha um Feixe de Lenha.') + '</p><div style="display:flex;gap:8px;flex-wrap:wrap">';
    h += btn('f437l', 'PÔR LENHA (+' + Math.round(DAY() / 6 / 60) + ' min)', U().has('lenha') || (window.Cart437 && Cart437.near(b.x, b.z, 8) && Cart437.has('lenha')));
    for (const [a, r, t] of cookList()) h += btn('f437c_' + a, t + ' (' + (S.bag[a] || 0) + ')', lit(b) && U().has(a));
    if (S.bag.carne && S.bag.sal) h += btn('f437s', 'SALGAR CARNE (+Sal)', true);
    h += btn('f437b', 'FERVER O CANTIL', lit(b) && c && c.sips > 0 && c.kind !== 'limpa' && c.kind !== 'cha' && c.kind !== 'mar');
    h += btn('f437m', 'DESTILAR ÁGUA DO MAR', lit(b) && c && c.sips > 0 && c.kind === 'mar'); // v439: rende metade e sobra sal
    h += btn('f437t', 'CHÁ TÉRMICO (cantil + Ervas)', lit(b) && c && c.sips > 0 && U().has('erva'));
    h += '</div><p style="opacity:.75;margin-top:8px">Perto do fogo aceso, o frio da neve não pesa. Comida assada dá Bem Alimentado; Chá Térmico aquece por 5 min.</p>';
    openModal(title || 'FOGUEIRA', h);
    const re = () => fireView(o, title);
    on('f437l', () => { if (!U().take('lenha', 1)) Cart437.take('lenha', 1); b.fuel = (b.fuel || 0) + DAY() / 6; U().save(); re(); });
    for (const [a, r] of cookList()) on('f437c_' + a, () => { const n = S.bag[a]; let k = 0; for (let i = 0; i < n; i++) { U().take(a, 1); U().add(r, 1, true); k++; } b.fuel = Math.max(0, b.fuel - 20 * k); toast('Assou ' + k + ' × ' + IT()[r].n + '.'); try { sfx('pickup'); } catch (_) {} re(); });
    on('f437s', () => { const n = Math.min(S.bag.carne, S.bag.sal); for (let i = 0; i < n; i++) { U().take('carne', 1); U().take('sal', 1); U().add('salgada', 1, true); } toast('Salgou ' + n + ' carne(s).'); re(); });
    on('f437m', () => { c.sips = Math.max(1, Math.ceil(c.sips / 2)); c.kind = 'limpa'; b.fuel = Math.max(0, b.fuel - 30); U().add('sal', 1, true); toast('Água do mar destilada: ' + c.sips + ' gole(s) de água limpa e 1 Sal Grosso.'); U().save(); re(); });
    on('f437b', () => { c.kind = 'limpa'; b.fuel = Math.max(0, b.fuel - 15); toast('Água fervida: agora é segura.'); U().save(); re(); });
    on('f437t', () => { U().take('erva', 1); c.kind = 'cha'; toast('Chá Térmico pronto no cantil (aquece no frio de Ymiria e tira mal-estar).'); U().save(); re(); });
  }
  // sono
  function restView(o, kind) {
    const cab = kind === 'cabana', b = o.b;
    let h = '<p>' + (cab ? 'Cama de couro, lareira e porta' + (b.locked ? ' <b>trancada</b>' : '') + '.' : 'Galhos e folhas: dá para dormir e salvar.') + '</p><div style="display:flex;gap:8px;flex-wrap:wrap">' + btn('r437s', cab ? 'DORMIR NA CAMA' : 'DORMIR NO ABRIGO') + btn('r437v', 'SALVAR');
    if (cab) h += btn('r437f', 'LAREIRA') + btn('r437l', b.locked ? 'DESTRANCAR A PORTA' : 'TRANCAR A PORTA') + btn('r437b', 'BAÚ DA CABANA');
    openModal(cab ? 'CABANA' : 'ABRIGO', h + '</div>');
    on('r437s', () => sleep(cab ? 3 : 1));
    on('r437v', () => { try { saveRun(); } catch (_) {} closeModal(); toast('Jogo salvo.'); });
    on('r437f', () => { if (!o.b.fuel && o.b.fuel !== 0) o.b.fuel = 0; fireView(o, 'LAREIRA'); });
    on('r437l', () => { b.locked = !b.locked; U().save(); restView(o, kind); });
    on('r437b', () => chestView(o, 'BAÚ DA CABANA'));
  }
  function sleep(q) {
    if (enemies.some(e => !e.dead && e.aggro && Math.hypot(e.x - player.x, e.z - player.z) < 25)) { toast('Monstros por perto: não dá para dormir.'); return; }
    const S = U().S();
    closeModal(); try { narratorEvent105('rest'); } catch (_) {}
    run.awake287 = 0; run.rested = { t: 600, l: q }; S.fome = Math.max(0, S.fome - 12); S.sede = Math.max(0, S.sede - 15);
    player.hp = Math.min(player.maxhp, player.hp + player.maxhp * (q >= 3 ? 1 : .6));
    try { if (typeof isNight === 'function' && isNight()) { const d0 = Math.floor(dayT / DAYLEN) * DAYLEN; dayT = d0 + NIGHT1_377 * DAYLEN + 30; /* acorda de manhã */ } } catch (_) {}
    try { refreshStats(); saveRun(); } catch (_) {}
    toast('<b>[DESCANSO]</b> Você dormiu ' + (q >= 3 ? 'na cama da cabana: vida cheia' : 'no abrigo: recuperou parte da vida') + ', o cansaço passou e o jogo foi salvo. Acordou com fome e sede.', 6000);
  }
  // guardar
  function storeView(o, title, allow, capKg, onlyKinds) {
    const b = o.b; b.store = b.store || {};
    const S = U().S(), I = IT(), kgOf = st => Object.keys(st).reduce((a, k) => a + (I[k]?.kg || 1) * st[k], 0);
    let h = '<p>' + Math.round(kgOf(b.store)) + ' de ' + capKg + ' kg guardados.</p><table style="width:100%;border-collapse:collapse">';
    for (const k in b.store) h += '<tr><td style="padding:4px"><b>' + I[k].n + '</b> ×' + b.store[k] + '</td><td style="text-align:right">' + (k === 'tora' ? '' : btn('st_g_' + k, 'PEGAR')) + (window.Cart437 && Cart437.near(b.x, b.z, 8) ? ' ' + btn('st_c_' + k, 'NO CARRINHO') : '') + '</td></tr>';
    h += '</table><p style="margin:8px 0 4px">Guardar:</p><div style="display:flex;gap:6px;flex-wrap:wrap">';
    for (const k in S.bag) if (allow(k)) h += btn('st_p_' + k, I[k].n + ' ×' + S.bag[k]);
    const cart = window.Cart437 && Cart437.near(b.x, b.z, 8) ? Cart437.state().load : {};
    for (const k in cart) if (allow(k)) h += btn('st_q_' + k, I[k].n + ' ×' + cart[k] + ' (carrinho)');
    if (S.carry === 'tora' && allow('tora')) h += btn('st_o', 'Tora do ombro');
    openModal(title, h + '</div>');
    const re = () => storeView(o, title, allow, capKg), room = k => Math.floor((capKg - kgOf(b.store)) / (I[k]?.kg || 1));
    for (const k in b.store) { on('st_g_' + k, () => { const n = U().add(k, b.store[k], true); b.store[k] -= n; if (!b.store[k]) delete b.store[k]; U().save(); re(); }); on('st_c_' + k, () => { const n = Math.min(b.store[k], Math.floor((Cart437.CAP - Cart437.loadKg()) / (I[k]?.kg || 1))); if (n && Cart437.load(k, n)) { b.store[k] -= n; if (!b.store[k]) delete b.store[k]; } U().save(); re(); }); }
    for (const k in S.bag) on('st_p_' + k, () => { const n = Math.min(S.bag[k], room(k)); if (n > 0 && U().take(k, n)) b.store[k] = (b.store[k] || 0) + n; else toast('Sem espaço.'); U().save(); re(); });
    for (const k in cart) on('st_q_' + k, () => { const n = Math.min(cart[k], room(k)); if (n > 0 && Cart437.take(k, n)) b.store[k] = (b.store[k] || 0) + n; else toast('Sem espaço.'); U().save(); re(); });
    on('st_o', () => { if (room('tora') < 1) { toast('Sem espaço.'); return; } U().clearCarry(); b.store.tora = (b.store.tora || 0) + 1; U().save(); re(); });
  }
  const rackView = o => storeView(o, 'SUPORTE DE TORAS', k => k === 'tora' || k === 'lenha', 12 * 40 + 30 * 6);
  const chestView = (o, t) => storeView(o, t || 'BAÚ', k => k !== 'tora' && k !== 'machado' && k !== 'pa' && k !== 'cantil', 200);
  // varal: defumar
  function rackDryView(o) {
    const b = o.b; b.dry = b.dry || [];
    const fire = sites().some(q => q.t === 'fogueira' && complete(q) && lit(q) && Math.hypot(q.x - b.x, q.z - b.z) < 7);
    const S = U().S(), ready = b.dry.filter(t => t <= S.clock).length;
    let h = '<p>' + b.dry.length + ' carne(s) no varal' + (ready ? ', <b>' + ready + ' pronta(s)</b>' : '') + '. ' + (fire ? '<b style="color:#ffb347">Fogueira acesa perto:</b> defuma em 1 hora de jogo.' : 'Sem fogueira acesa a até 7 m: seca em 4 horas.') + '</p><div style="display:flex;gap:8px;flex-wrap:wrap">';
    h += btn('v437p', 'PENDURAR CARNE CRUA (' + (S.bag.carne || 0) + ')', U().has('carne')) + btn('v437g', 'PEGAR AS PRONTAS', ready > 0) + btn('v437s', 'SALGAR (Carne + Sal)', U().has('carne') && U().has('sal'));
    openModal('VARAL DE SECAGEM', h + '</div>');
    const re = () => rackDryView(o);
    on('v437p', () => { const n = S.bag.carne; for (let i = 0; i < n; i++) { U().take('carne', 1); b.dry.push(S.clock + DAY() * (fire ? 1 : 4) / 24); } U().save(); re(); });
    on('v437g', () => { const keep = []; for (const t of b.dry) { if (t <= S.clock && U().add('defumada', 1, true)) continue; keep.push(t); } b.dry = keep; U().save(); re(); });
    on('v437s', () => { const n = Math.min(S.bag.carne, S.bag.sal); for (let i = 0; i < n; i++) { U().take('carne', 1); U().take('sal', 1); U().add('salgada', 1, true); } U().save(); re(); });
  }
  // coletor
  function rainView(o) {
    const b = o.b, c = U().S().canteen, w = Math.floor(b.water || 0);
    openModal('COLETOR DE CHUVA', '<p>' + w + ' gole(s) de água limpa' + (typeof WX !== 'undefined' && WX.type === 'rain' ? ' · <b style="color:#9fd8ff">chovendo: enchendo</b>' : ' · enche quando chove') + '.</p><div style="display:flex;gap:8px;flex-wrap:wrap">' + btn('k437d', 'BEBER', w > 0) + btn('k437f', 'ENCHER O CANTIL', w > 0 && c && c.sips < 5) + '</div>');
    on('k437d', () => { b.water--; U().drink('limpa', 25); rainView(o); });
    on('k437f', () => { const n = Math.min(w, 5 - c.sips); b.water -= n; c.sips += n; c.kind = 'limpa'; U().save(); rainView(o); });
  }
  // bancada
  function benchView(o) { manual(true); }
  // armadilhas
  function trapView(o) { openModal('ARMADILHA DE ESPINHOS', '<p>Fere e prende monstros que pisam nela (ignora você).</p>' + btn('t437r', 'RECOLHER (devolve metade)')); on('t437r', () => { closeModal(); unbuild(o); }); }
  function snareView(o) {
    const b = o.b, n = b.catch || 0;
    openModal('ARMADILHA DE LAÇO', '<p>' + (n ? n + ' bicho(s) preso(s).' : 'Nada preso ainda. Pega sozinha a cada poucas horas de jogo, longe de monstros.') + '</p>' + btn('s437g', 'PEGAR', n > 0) + ' ' + btn('s437r', 'RECOLHER'));
    on('s437g', () => { for (let i = 0; i < n; i++) { U().add('carne', 1, true); if (Math.random() < .5) U().add('couro', 1, true); } b.catch = 0; U().save(); toast('Pegou ' + n + ' bicho(s) do laço.'); snareView(o); });
    on('s437r', () => { closeModal(); unbuild(o); });
  }
  function wallView(o) { openModal('PALIÇADA', '<p>Muro de toras.</p>' + btn('w437r', 'DESMONTAR (devolve metade)')); on('w437r', () => { closeModal(); unbuild(o); }); }
  function gateView(o) { o.b.open = !o.b.open; refresh(o); U().save(); toast(o.b.open ? 'Portão aberto.' : 'Portão fechado.'); }
  function unbuild(o) {
    const b = o.b; for (const s of B[b.t].st) for (const k in s.need) { const n = Math.floor(s.need[k] / 2); if (n) U().add(k, n, true); }
    run.build437 = sites().filter(q => q !== b); dropSite(b.id); U().save();
  }

  /* ---------------- Manual e molde ---------------- */
  function cost(need) { return Object.keys(need).map(k => need[k] + ' ' + IT()[k].n).join(' + '); }
  const nearBench = () => sites().some(q => q.t === 'bancada' && complete(q) && Math.hypot(q.x - player.x, q.z - player.z) < 6);
  function canPay(need) { for (const k in need) if (!U().has(k, need[k])) return false; return true; }
  function manual(fromBench) {
    if (!U().world()) { toast('Construção só no mundo aberto.'); return; }
    const bench = fromBench || nearBench();
    let h = '<p style="opacity:.8">Escolha o que construir: o molde translúcido aparece no chão à sua frente. Depois leve o material (bolsa, carrinho perto ou tora no ombro) e aperte <b>F</b> no molde para encaixar cada peça.</p>';
    h += '<div class="sec">FERRAMENTAS E TOCHAS</div><div style="display:flex;gap:8px;flex-wrap:wrap">';
    h += btn('m437t_machado', 'Machado de Pedra · ' + cost(TOOLS.machado.need), canPay(TOOLS.machado.need) && !U().has('machado'));
    h += btn('m437t_pa', 'Pá / Enxada · ' + cost(TOOLS.pa.need), canPay(TOOLS.pa.need) && !U().has('pa'));
    h += btn('m437t_tocha', 'Tocha com Resina · ' + cost(TOOLS.tocha.need), canPay(TOOLS.tocha.need));
    h += btn('m437t_cantil', 'Cantil de Couro · ' + cost(TOOLS.cantil.need) + (bench ? '' : ' (na bancada)'), bench && canPay(TOOLS.cantil.need) && !U().S().canteen);
    h += '</div><div class="sec">CONSTRUÇÕES</div><table style="width:100%;border-collapse:collapse">';
    for (const id in B) {
      const d = B[id], needBench = id === 'carrinho';
      h += '<tr style="border-bottom:1px solid #b9974f33"><td style="padding:5px"><b>' + d.n + '</b><br><small style="opacity:.75">' + esc(d.d) + '<br>' + d.st.map(s => s.n + ': ' + cost(s.need)).join(' → ') + '</small></td><td style="text-align:right">' + btn('m437b_' + id, needBench && !bench ? 'NA BANCADA' : 'CONSTRUIR', !needBench || bench) + '</td></tr>';
    }
    openModal('MANUAL DE SOBREVIVÊNCIA', h + '</table>');
    on('m437t_machado', () => { for (const k in TOOLS.machado.need) U().take(k, TOOLS.machado.need[k]); U().add('machado', 1, true); toast('<b>Machado de Pedra</b> pronto: F nas árvores para derrubar.', 4500); manual(fromBench); });
    on('m437t_pa', () => { for (const k in TOOLS.pa.need) U().take(k, TOOLS.pa.need[k]); U().add('pa', 1, true); toast('<b>Pá / Enxada</b> pronta: F em dunas, encostas ou bloqueios de rochas/tocos para nivelar o terreno.', 4500); manual(fromBench); });
    on('m437t_tocha', () => { for (const k in TOOLS.tocha.need) U().take(k, TOOLS.tocha.need[k]); U().add('tocha', 1, true); U().lightTorch(); manual(fromBench); });
    on('m437t_cantil', () => { for (const k in TOOLS.cantil.need) U().take(k, TOOLS.cantil.need[k]); U().S().canteen = { sips: 0, kind: null }; U().save(); toast('<b>Cantil de Couro</b> pronto: encha na margem (F).', 4500); manual(fromBench); });
    for (const id in B) on('m437b_' + id, () => { closeModal(); startPlace(id); });
  }
  let place = null;
  const ph = document.createElement('div');
  ph.style.cssText = 'position:fixed;left:50%;top:150px;transform:translateX(-50%);z-index:45;display:none;gap:8px;align-items:center;background:#122019e6;border:1px solid #b9974f;border-radius:8px;padding:6px 10px;font:600 12px system-ui;color:#e9dfc0';
  ph.innerHTML = '<span id="ph437t"></span><button class="btn" id="ph437ok">COLOCAR (Enter)</button><button class="btn" id="ph437r">GIRAR (R)</button><button class="btn" id="ph437x">CANCELAR (Esc)</button>';
  document.body.appendChild(ph);
  function startPlace(id) {
    cancelPlace();
    if (id === 'carrinho' && (run.cart437 || sites().some(q => q.t === 'carrinho'))) { toast('Você já tem um carrinho (ou um sendo montado).'); return; }
    const def = B[id], g = new T.Group(); scene.add(g);
    place = { id, g, ry: (player.face || 0) + Math.PI, ok: false, m: null };
    model(def).then(m => { if (!place || place.g !== g || !m) return; place.m = skin(m, ghostMat); g.add(place.m); });
    document.getElementById('ph437t').textContent = def.n + ': ' + def.st.map(s => s.n).join(' → ');
    { const bot = ['stat', 'quest401'].map(i => document.getElementById(i)).filter(e => e && e.offsetParent).reduce((m, e) => Math.max(m, e.getBoundingClientRect().bottom), 60); ph.style.top = Math.round(bot + 8) + 'px'; } /* v440: abaixo dos painéis do topo, sem cobrir nada */
    ph.style.display = 'flex';
  }
  function cancelPlace() { if (place) scene.remove(place.g); place = null; ph.style.display = 'none'; }
  function placeTick() {
    if (!place) return;
    if (!U().world()) { cancelPlace(); return; }
    const def = B[place.id]; let dist = (def.line ? 3 : Math.max(2.2, def.w * .6 + 1.2));
    if (def.water && window.Water391) for (let d = dist; d < dist + 14; d += .5) { const qx = player.x + Math.sin(player.face || 0) * d, qz = player.z + Math.cos(player.face || 0) * d, w = Water391.waterAt(qx, qz); if (w && !w.frozen && w.top - terrH(qx, qz) > (def.draft || .8)) { dist = d; break; } } /* v440: barco vai para a 1ª água funda à frente */
    const x = player.x + Math.sin(player.face || 0) * dist, z = player.z + Math.cos(player.face || 0) * dist;
    place.x = x; place.z = z; place.g.position.set(x, 0, z); place.g.rotation.y = place.ry;
    const rad = def.line ? 1 : Math.max(.6, def.r || .6);
    let ok;
    if (def.water) { // v440: barco — o molde fica na água funda, na altura da superfície
      const w = window.Water391 && Water391.waterAt(x, z), dp = w ? w.top - terrH(x, z) : 0;
      ok = !!w && !w.frozen && dp > (def.draft || .8); place.g.userData.terrainAbsolute245 = true; place.g.position.y = w ? w.top : 0;
    } else {
    ok = typeof freeAt !== 'function' || freeAt(x, z, rad);
    if (ok && window.Water391 && Water391.waterAt(x, z)) ok = false;
    }
    if (ok && !def.water && typeof nearestCity === 'function' && nearestCity(x, z).d < 70 * (typeof CITYK !== 'undefined' ? CITYK : 1)) ok = false;
    if (ok && sites().some(q => Math.hypot(q.x - x, q.z - z) < rad + (B[q.t].r || .6) + .3)) ok = false;
    if (place.ok !== ok && place.m) skin(place.m, ok ? ghostMat : badMat);
    place.ok = ok;
  }
  function confirmPlace() {
    if (!place) return;
    if (!place.ok) { toast('Aqui não dá: chão ocupado, água, cidade ou perto demais de outra obra.'); return; }
    const b = { id: 'B' + Date.now().toString(36), t: place.id, x: place.x, z: place.z, ry: place.ry, stage: 0, got: {} };
    sites().push(b); cancelPlace(); spawnSite(b); U().save();
    toast('<b>[CONSTRUÇÃO]</b> Molde de ' + B[b.t].n + ' no chão. Traga ' + cost(B[b.t].st[0].need) + ' e aperte F nele.', 6000);
  }
  on('ph437ok', confirmPlace); on('ph437r', () => { if (place) place.ry += Math.PI / 4; }); on('ph437x', cancelPlace);
  addEventListener('keydown', e => {
    if (!place) return; const t = e.target; if (t && ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return;
    if (e.code === 'Enter' || e.code === 'NumpadEnter') { e.preventDefault(); e.stopPropagation(); confirmPlace(); }
    else if (e.code === 'KeyR') { e.preventDefault(); e.stopPropagation(); place.ry += Math.PI / 4; }
    else if (e.code === 'Escape') { e.preventDefault(); e.stopPropagation(); cancelPlace(); }
  }, true);
  addEventListener('wheel', e => { if (place) { place.ry += Math.sign(e.deltaY) * Math.PI / 12; } }, { passive: true });

  /* ---------------- efeitos no tempo ---------------- */
  const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,220,150,1)'); r.addColorStop(.35, 'rgba(255,140,40,.6)'); r.addColorStop(1, 'rgba(255,80,0,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; return t; })();
  function fireFx(o, on2) {
    if (on2 && !o.fx) { const light = new T.PointLight(0xffa040, 1.6, 12, 1.6); light.position.y = .9; const sp = new T.Sprite(new T.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: T.AdditiveBlending })); sp.scale.setScalar(1.6); sp.position.y = .55; o.g.add(light, sp); o.fx = { light, sp }; }
    if (!on2 && o.fx) { o.g.remove(o.fx.light, o.fx.sp); o.fx = null; }
    if (o.fx) { const f = .8 + Math.sin(performance.now() * .019) * .12 + Math.sin(performance.now() * .047) * .08; o.fx.light.intensity = 1.6 * f; o.fx.sp.scale.setScalar(1.5 * f); }
  }
  let hurtT = 0;
  function worldTick(dt) {
    const S = U().S(), rain = typeof WX !== 'undefined' && WX.type === 'rain';
    let warm = false;
    for (const o of live.values()) {
      const b = o.b; if (!complete(b)) continue;
      if (b.t === 'fogueira' || (b.t === 'cabana' && b.fuel > 0)) {
        if (b.fuel > 0) b.fuel = Math.max(0, b.fuel - dt);
        if (b.t === 'fogueira') fireFx(o, lit(b));
        if (lit(b) && Math.hypot(b.x - player.x, b.z - player.z) < (b.t === 'cabana' ? 6 : 5)) warm = true;
      }
      if (b.t === 'coletor' && rain) b.water = Math.min(10, (b.water || 0) + dt / 30);
      if (b.t === 'laco') { b.tick = (b.tick || 0) + dt; if (b.tick > DAY() / 6) { b.tick = 0; if ((b.catch || 0) < 3 && !enemies.some(e => !e.dead && Math.hypot(e.x - b.x, e.z - b.z) < 20) && Math.random() < .6) b.catch = (b.catch || 0) + 1; } }
    }
    // frio: perto do fogo aceso a penalidade da neve some (usa a proteção do biomes295)
    if (warm) { run.bioGear295 = run.bioGear295 || {}; run.bioGear295.capa = Math.max(run.bioGear295.capa || 0, 3); }
    // armadilha de espinhos: fere e prende (só monstros)
    hurtT -= dt; if (hurtT <= 0) { hurtT = .5;
      for (const o of live.values()) { const b = o.b; if (b.t !== 'espinho' || !complete(b)) continue;
        for (const e of enemies) if (!e.dead && !e.friend && Math.hypot(e.x - b.x, e.z - b.z) < 1.3) { try { hurtEnemy(e, Math.max(4, (e.maxhp || 100) * .06), b.x, b.z, { stun: .6, kb: 0 }); floater(e.x, e.z, 'ESPINHOS', '#ff9b6b'); } catch (_) {} } } }
  }
  function streamTick() {
    if (!U().world()) { for (const id of [...live.keys()]) dropSite(id); return; }
    for (const b of sites()) { const d = Math.hypot(b.x - player.x, b.z - player.z); if (d < 140 && !live.has(b.id)) spawnSite(b); }
    for (const [id, o] of live) if (Math.hypot(o.b.x - player.x, o.b.z - player.z) > 170) dropSite(id);
  }

  let last = performance.now(), slow = 0, lastRun = null;
  function loop() {
    const now = performance.now(), dt = Math.min(.25, (now - last) / 1000); last = now;
    try {
      if (U() && U().ready()) {
        if (run !== lastRun) { lastRun = run; for (const id of [...live.keys()]) dropSite(id); cancelPlace(); }
        if (!paused && !player.dead) { placeTick(); worldTick(dt); slow -= dt; if (slow <= 0) { slow = 1; streamTick(); } }
      } else if (live.size) { for (const id of [...live.keys()]) dropSite(id); cancelPlace(); }
    } catch (e) { if (!loop.err) { loop.err = 1; console.warn('build437', e); } }
    setTimeout(loop, 33);
  }
  loop();
  window.Build437 = { storeView, B, manual, startPlace, confirmPlace, cancelPlace, sites, live, sleep, placePiece: id => { const o = live.get(id); if (o) placePiece(o); } };
})();
