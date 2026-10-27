/* Missão fixa #10 «O Retorno de Aldric na Chuva» (v648). Morro da Rocha com Musgo e Enfermaria de Aster. Ato V, depois que Aldric é achado ferido.
   Aldric traz páginas escondidas: uma patrulha inteira foi levada para uma câmara de seleção do Arquiteto.
   Escolha: escoltá-lo passo a passo, a menos de 8 m, até a tenda de Mira enfrentando batedores da ruptura, ou deixá-lo escondido sob guarda
   para limpar a estrada antes. Escolta imediata sem deixá-lo cair: Aldric ensina o traço de leitura de inscrições (+5% de XP em ruínas).
   Estado em profile.fixas545.q010. A chuva fica ligada durante a missão. */
(function () {
  'use strict';
  const NEAR = 8;
  let world = null, aldric = null, guards = [], foes = [], inter = null, spawnT = 4, far = 0, fallT = 0, lastSave = 0, busy = false;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q010 = profile.fixas545.q010 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  function a5() { return window.Campaign327 && Campaign327.state('a5'); }
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q010; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  function aster() { return typeof regionCity === 'function' ? regionCity(0, 0) : { x: 0, z: 0 }; }
  function mira() {
    const l = typeof npcs !== 'undefined' ? npcs.filter(n => !n.gone && (n.short === 'Mira' || n.name === 'Mira')) : [];
    return l.sort((a, b) => Math.hypot(a.x - aster().x, a.z - aster().z) - Math.hypot(b.x - aster().x, b.z - aster().z))[0] || null;
  }
  const tent = () => { const m = mira(); return m ? { x: m.x, z: m.z } : { x: aster().x, z: aster().z + 14 }; };
  if (typeof LORE !== 'undefined') LORE.q010_leitura = ['Traço de Aldric: leitura de inscrições', 'Aldric chegou à tenda de Mira sem cair e ensinou o que aprendeu lendo marcas antigas. Você ganha 5% a mais de XP em ruínas.'];

  function mk(id, name, x, z) {
    const m = NPC456.create(id), f = NPC456.figure(id, { m, name, down: false, x, z, t: 0 });
    m.root.userData.terrainAbsolute245 = true; m.root.position.set(x, terrH(x, z), z); scene.add(m.root); return f;
  }
  function drop() {
    for (const f of [aldric, ...guards]) if (f) { try { scene.remove(f.m.root); } catch (_) {} }
    aldric = null; guards = []; foes = [];
    if (inter && L.inter) L.inter = L.inter.filter(i => i !== inter);
    inter = null;
  }
  function setInter(label, fn) {
    if (inter && L.inter) L.inter = L.inter.filter(i => i !== inter);
    inter = null; if (!label || !aldric) return;
    inter = { x: aldric.x, z: aldric.z, r: 4, label, use: fn }; L.inter.push(inter);
  }

  /* ---------- 1. Aldric aparece ferido sob a chuva ---------- */
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'escolha'; s.quedas = 0; save();
    aldric = mk('homem', 'Aldric', player.x + 3, player.z + 2);
    setInter('F · FALAR COM ALDRIC', talk);
    try { toast('<b>[MISSÃO]</b> O Retorno de Aldric na Chuva: Aldric está vivo, ferido, apoiado numa rocha coberta de musgo. Fale com ele.', 7000); } catch (_) {}
  }
  function talk() {
    const s = S(); if (s.phase !== 'escolha' && s.phase !== 'volta') return;
    if (s.phase === 'volta') { s.modo = 'limpa'; goEscort(); return; }
    Dialogo520.custom({ name: 'Aldric', title: 'Veterano da Patrulha', type: 'aldric610' }, aldric, () => ({
      raiz: { t: 'Eu... consegui sair. Tire isto de baixo da minha roupa: páginas. Uma patrulha inteira foi levada para uma câmara de seleção do Arquiteto. Preciso chegar à Mira, mas a estrada está cheia de batedores da ruptura e eu não aguento correr.', o: [
        { l: 'Escoltá-lo agora até a tenda de Mira, a menos de ' + NEAR + ' m de você', fn: () => { choose('imediata'); return 'fim'; } },
        { l: 'Deixá-lo escondido sob guarda e limpar a estrada antes', fn: () => { choose('limpa'); return 'fim'; } }] }
    }));
  }
  function choose(c) {
    const s = S(); if (s.phase !== 'escolha') return;
    s.modo = c; s.t = Date.now();
    if (c === 'imediata') { try { toast('<b>[ESCOLHA]</b> Você vai escoltar Aldric até a tenda de Mira. Fique a menos de ' + NEAR + ' m dele: se ele ficar para trás, cai.', 8000); } catch (_) {} goEscort(); }
    else {
      s.phase = 'limpar'; s.mortos = 0; save(); setInter(null);
      guards = [mk('homem', 'Guarda da Ordem', aldric.x + 2.2, aldric.z - 1.4), mk('mulher', 'Guarda da Ordem', aldric.x - 2.2, aldric.z - 1.4)];
      s.spot = { x: aldric.x, z: aldric.z };
      try { toast('<b>[ESCOLHA]</b> Dois guardas ficam com Aldric, escondido sob a rocha. Elimine 4 batedores da ruptura na estrada e volte.', 8000); } catch (_) {}
    }
  }
  function goEscort() { const s = S(); s.phase = 'escolta'; s.chegou = false; save(); setInter(null); spawnT = 6; far = 0; }

  /* ---------- 2. Batedores e escolta ---------- */
  function scout() {
    const lvl = run.level || 1, s = S(), ang = Math.random() * Math.PI * 2, d = 20 + Math.random() * 6;
    const cx = s.phase === 'limpar' && s.spot ? s.spot.x : player.x, cz = s.phase === 'limpar' && s.spot ? s.spot.z : player.z;
    const x = cx + Math.cos(ang) * d, z = cz + Math.sin(ang) * d;
    try {
      const e = spawnKind('rogue', x, z, 0, { wild: true }); e.name = e.short = 'Batedor da Ruptura';
      e.hp = e.maxhp = Math.min(e.maxhp, 40 + 12 * lvl); e.dmg = Math.min(e.dmg || 4, 4 + lvl); e.aggro = true; e.aldric610 = true; foes.push(e);
    } catch (_) {}
  }
  function follow(dt) {
    const s = S(); if (!aldric) return;
    const dx = player.x - aldric.x, dz = player.z - aldric.z, d = Math.hypot(dx, dz);
    if (aldric.caido) {
      aldric.m.root.rotation.z = 1.2; aldric.m.root.position.y = terrH(aldric.x, aldric.z) - .4;
      if (d < 3) { fallT += dt; if (fallT > 1.5) { aldric.caido = false; fallT = 0; aldric.m.root.rotation.z = 0; try { toast('Você ajuda Aldric a se levantar.', 2500); } catch (_) {} } } else fallT = 0;
      return;
    }
    if (s.modo === 'limpa' && d > 25) { aldric.x = player.x - 2; aldric.z = player.z - 2; return; } /* estrada limpa: ele nunca fica para trás */
    if (d > 3.5) { const k = Math.min(3.8 * dt, d - 3.5) / d; aldric.x += dx * k; aldric.z += dz * k; aldric.m.root.rotation.y = Math.atan2(dx, dz); }
    aldric.m.root.position.set(aldric.x, terrH(aldric.x, aldric.z), aldric.z);
    if (s.modo === 'imediata') {
      far = d > NEAR ? far + dt : 0;
      if (far > 1.5) {
        far = 0; aldric.caido = true; s.quedas = (s.quedas || 0) + 1; save();
        try { toast('<b>[ALDRIC]</b> — Não... consigo... Ele caiu: você se afastou mais de ' + NEAR + ' m. Volte e ajude-o a se levantar.', 5500); } catch (_) {}
        try { sfx('hit'); } catch (_) {}
      }
    }
  }
  function arrive() {
    const s = S(); if (s.chegou) return; s.chegou = true; busy = true;
    const ok = s.modo === 'imediata' && !s.quedas;
    const lines = ok
      ? ['Aldric: — Chegamos. Sem uma queda. Você me manteve de pé o caminho todo.', 'Aldric: — Quem lê inscrições antigas sabe o que procurar nelas. Vou lhe ensinar o traço: ruínas vão lhe render mais do que a outros.']
      : (s.modo === 'imediata'
        ? ['Aldric: — Chegamos. Caí uma vez, ou mais; os pontos abriram. Mira vai cuidar disso.', 'Aldric: — Tudo o que sei está nas páginas. Entregue-as à Lyra.']
        : ['Aldric: — A estrada limpa nos poupou. Estou inteiro, mas fraco; as páginas estão com você.', 'Aldric: — Mira vai cuidar de mim. A Lyra precisa ler isto.']);
    Dialogo520.custom({ name: 'Aldric', title: 'Enfermaria de Aster', type: 'aldric610' }, aldric, () => ({ raiz: { t: lines.join(' '), o: [{ l: 'Descanse, Aldric', fn: () => { finish(ok); return 'fim'; } }] } }));
  }
  function finish(ok) {
    const s = S(); s.done = true; s.phase = 'fim'; s.leitura = !!ok; s.t = Date.now(); busy = false;
    if (ok) { try { unlockLore('q010_leitura'); } catch (_) {} try { toast('<b>[ALDRIC]</b> Traço aprendido: leitura de inscrições. +5% de XP em ruínas.', 8000); } catch (_) {} }
    else try { toast('<b>[MISSÃO]</b> Aldric está na tenda de Mira. Fale com Mira e depois ouça o relato com a Lyra.', 7000); } catch (_) {}
    save(); drop();
  }

  /* ---------- objetivo ---------- */
  function objective() {
    const ph = phase(); if (!ph) return null; const s = S();
    let text, target = null;
    if (ph === 'escolha') { text = 'Fale com Aldric, ferido sob a rocha [F]'; target = aldric ? { x: aldric.x, z: aldric.z } : null; }
    else if (ph === 'limpar') { text = 'Limpe a estrada: batedores da ruptura ' + (s.mortos || 0) + '/4'; const e = foes.find(e => !e.dead); target = e ? { x: e.x, z: e.z } : (s.spot || null); }
    else if (ph === 'volta') { text = 'A estrada está livre: volte a Aldric [F]'; target = aldric ? { x: aldric.x, z: aldric.z } : null; }
    else { text = s.modo === 'imediata' ? 'Escolte Aldric até a tenda de Mira · fique a menos de ' + NEAR + ' m' + ((s.quedas || 0) ? ' · quedas ' + s.quedas : '') : 'Leve Aldric até a tenda de Mira'; target = tent(); if (aldric && aldric.caido) text = 'Aldric caiu: volte e ajude-o a se levantar'; }
    return { actTitle: 'O RETORNO DE ALDRIC NA CHUVA', step: ph === 'escolta' ? 3 : 2, totalSteps: 3, text, target };
  }

  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile) return;
    if (L.mode !== 'world') return;
    if (world !== L) { drop(); world = L; }
    const s = S(); if (!s || s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof inConversation === 'function' && inConversation()) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    const a = a5();
    if (!s.phase) { if (a && !a.done && a.s === 1 && free) { const d = Math.hypot(player.x - aster().x, player.z - aster().z); if (d > 60) begin(); } return; }
    if (typeof WX !== 'undefined') { WX.type = 'rain'; WX.t = Math.max(WX.t || 0, 60); }
    if (!aldric && s.phase !== 'fim') { /* mundo recarregado: Aldric volta ao lado do jogador */
      const p = s.phase === 'limpar' && s.spot ? s.spot : { x: player.x + 3, z: player.z + 2 }; aldric = mk('homem', 'Aldric', p.x, p.z);
      if (s.phase === 'escolha') setInter('F · FALAR COM ALDRIC', talk);
      if (s.phase === 'volta') setInter('F · LEVAR ALDRIC À TENDA DE MIRA', talk);
      if (s.phase === 'limpar') guards = [mk('homem', 'Guarda da Ordem', p.x + 2.2, p.z - 1.4), mk('mulher', 'Guarda da Ordem', p.x - 2.2, p.z - 1.4)];
    }
    if (inter && aldric) { inter.x = aldric.x; inter.z = aldric.z; }
    if (!free) return;
    foes = foes.filter(e => !e.dead);
    if (s.phase === 'limpar') {
      const alive = foes.length;
      spawnT -= dt;
      if (spawnT <= 0 && alive < 2 && (s.mortos || 0) + alive < 4) { spawnT = 3; scout(); }
      if ((s.mortos || 0) >= 4 && !alive) { s.phase = 'volta'; save(); setInter('F · LEVAR ALDRIC À TENDA DE MIRA', talk); try { toast('<b>[ESTRADA]</b> A estrada está livre. Volte a Aldric e leve-o à tenda de Mira.', 6000); } catch (_) {} }
    }
    if (s.phase === 'escolta') {
      follow(dt);
      if (s.modo === 'imediata') {
        spawnT -= dt;
        const dA = Math.hypot(player.x - aster().x, player.z - aster().z);
        if (spawnT <= 0 && foes.length < 3 && dA > 55) { spawnT = 11; scout(); scout(); }
      }
      const t = tent();
      if (!aldric.caido && Math.hypot(aldric.x - t.x, aldric.z - t.z) < 9 && Math.hypot(player.x - t.x, player.z - t.z) < 12 && free) arrive();
    }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  /* batedor derrubado conta para a limpeza da estrada (quem o mata é o combate normal: contamos pelas mortes dos nossos) */
  const ke = typeof killEnemy === 'function' ? killEnemy : null;
  if (ke) killEnemy = function (e) { const r = ke.apply(this, arguments); try { if (e && e.aldric610) { const s = S(); if (s && s.phase === 'limpar') { s.mortos = (s.mortos || 0) + 1; save(); } } } catch (_) {} return r; };

  /* traço de Aldric: +5% de XP em ruínas */
  function inRuin() {
    if (typeof ruinAt !== 'function' || typeof CH === 'undefined' || typeof L === 'undefined' || L.mode !== 'world' || !player) return false;
    const cx = Math.floor(player.x / CH), cz = Math.floor(player.z / CH);
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) if (ruinAt(cx + i, cz + j)) return true;
    return false;
  }
  const gx = gainXp;
  gainXp = function (x, source) {
    const s = profile && profile.fixas545 && profile.fixas545.q010;
    if (s && s.leitura && x > 0 && inRuin()) x = Math.round(x * 1.05);
    return gx.call(this, x, source);
  };

  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q010) Fixas545.LIVE.primeva_q010 = 'v648'; } catch (e) { console.warn('Aldric610', e); } };
  window.Aldric610 = { state: S, active, objective, begin, choose, inRuin, get aldric() { return aldric; }, get foes() { return foes; } };
})();
