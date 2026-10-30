/* v714 (Ian, 30/10/2026): «no skyrim é aleatório; se eu volto pro mesmo lugar o cara continua lá, não é alguém vivendo a vida dele».
   Gente de estrada como no Skyrim: ninguém fica plantado esperando você.
   - Viajantes nascem longe, sem padrão, numa estrada perto de você, e seguem andando. Saem de cena ao chegar a uma cidade ou ficar longe.
   - Na caminhada param para comer e beber quando a fome e a sede apertam, e depois seguem.
   - Quem está numa fogueira de encontro é sorteado a cada visita (tools/encontros502.js) e levanta depois de um tempo.
   - Avistamentos de tools/quests480.js somem quando você se afasta. */
(function (global) {
  'use strict';
  const NASCE0 = 70, NASCE1 = 110, SOME = 170, MAX = 2, PASSO = 1.7;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const FALA = {
    fome: ['Faz dois dias que só como pão duro.', 'Vou parar e comer alguma coisa antes de seguir.', 'A barriga manda mais que as pernas.'],
    sede: ['O cantil está quase vazio.', 'Deixa eu beber um gole antes de seguir.', 'Essa poeira seca a garganta.'],
    anda: ['Não posso parar agora. Quero chegar antes de escurecer.', 'Boa estrada para você.', 'Tenho um longo caminho pela frente.']
  };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  let T = 30;
  const andando = () => npcs.filter(n => n.andar714 && !n.gone && !n.dead);
  const ponto = () => {
    const out = [];
    for (const s of roadSegs(player.x, player.z, 1)) for (let i = 0; i < 6; i++) {
      const k = Math.random(), x = s[0] + (s[2] - s[0]) * k, z = s[1] + (s[3] - s[1]) * k, d = Math.hypot(x - player.x, z - player.z);
      if (d >= NASCE0 && d <= NASCE1 && nearestCity(x, z).d > 70 && !inWater244(x, z)) out.push({ x, z, s });
    }
    return out.length ? pick(out) : null;
  };
  /* estrada mais próxima de quem levanta da fogueira */
  function pertoDe(n) {
    let best = null, bd = 1e9;
    for (const s of roadSegs(n.x, n.z, 1)) for (const k of [0, .25, .5, .75, 1]) {
      const x = s[0] + (s[2] - s[0]) * k, z = s[1] + (s[3] - s[1]) * k, d = Math.hypot(x - n.x, z - n.z);
      if (d < bd) { bd = d; best = { x, z, s }; }
    }
    return best;
  }
  function fala(n) { n.para714 = Math.max(n.para714 || 0, 6); try { speech153(n, n.comendo714 ? pick(FALA[n.comendo714]) : pick(FALA.anda), n.sub714 || 'Viajante'); } catch (_) {} }
  function liga(n, parte) { n.andar714 = true; n.fome714 = rnd(0, 60); n.sede714 = rnd(0, 40); n.parte714 = parte; n.use = () => fala(n); }
  function nasce() {
    if (andando().length >= MAX || nearestCity(player.x, player.z).d < 110 || (isNight() && Math.random() < .6)) return false;
    const p = ponto(); if (!p || !global.Enc502 || !Enc502.viajante) return false;
    const n = Enc502.viajante(pick(['peregrino', 'mercador', 'cacador']), p.x, p.z, Math.random() * 6.28);
    liga(n, 0); const f = Math.random() < .5 ? 0 : 2; n.alvo714 = { x: p.s[f], z: p.s[f + 1] }; n.de714 = { x: p.s[2 - f], z: p.s[3 - f] }; return n;
  }
  function proximo(n) {
    const op = [];
    for (const s of roadSegs(n.x, n.z, 1)) {
      if (!(Math.hypot(s[0] - n.x, s[1] - n.z) < 2 || Math.hypot(s[2] - n.x, s[3] - n.z) < 2)) continue;
      for (const i of [0, 2]) { const q = { x: s[i], z: s[i + 1] }; if (Math.hypot(q.x - n.x, q.z - n.z) > 3 && !(n.de714 && Math.hypot(q.x - n.de714.x, q.z - n.de714.z) < 2)) op.push(q); }
    }
    n.de714 = { x: n.x, z: n.z }; if (!op.length) return false; n.alvo714 = pick(op); return true;
  }
  function sai(n) { n.gone = true; try { scene.remove(n.m.root); } catch (_) {} }
  function vive(n, dt) {
    n.t = (n.t || 0) + dt; const P = player, dp = Math.hypot(P.x - n.x, P.z - n.z);
    if (dp > SOME) return sai(n);
    n.fome714 += dt; n.sede714 += dt; let mv = 0;
    if (n.parte714 > 0) { n.parte714 -= dt; if (dp < 14) turnTo(n, Math.atan2(P.x - n.x, P.z - n.z), dt, 4); }
    else if (n.para714 > 0) { n.para714 -= dt; if (n.para714 <= 0) n.comendo714 = null; if (dp < 14) turnTo(n, Math.atan2(P.x - n.x, P.z - n.z), dt, 4); }
    else if (n.fome714 > 150 || n.sede714 > 110) {
      const k = n.fome714 > 150 ? 'fome' : 'sede'; n[k + '714'] = 0; n.comendo714 = k; n.para714 = rnd(8, 14);
      if (dp < 14) try { speech153(n, pick(FALA[k]), n.sub714 || 'Viajante'); } catch (_) {}
    } else {
      if (!n.alvo714) { const p = pertoDe(n); if (!p) return sai(n); n.alvo714 = { x: p.x, z: p.z }; }
      const a = n.alvo714, dx = a.x - n.x, dz = a.z - n.z, d = Math.hypot(dx, dz);
      if (d < 1) { if (nearestCity(n.x, n.z).d < 70 || !proximo(n)) return sai(n); }
      else { const v = Math.min(PASSO * dt, d); n.x += dx / d * v; n.z += dz / d * v; turnTo(n, Math.atan2(dx, dz), dt, 6); mv = 1; }
    }
    animChibi(n.m, { move: mv, atk: 0, dead: 0, wind: 0 }, n.t); n.m.root.position.set(n.x, 0, n.z); n.m.root.rotation.y = n.face;
  }
  const u0 = updNpc;
  updNpc = function (n, dt) { if (n.andar714 && !n.dead) return vive(n, dt); return u0(n, dt); };
  setInterval(() => {
    try {
      if (typeof started === 'undefined' || !started || !player || player.dead || L.mode !== 'world') return;
      for (const n of npcs) if (n.kind === 'emergent_skyrim' && !n.gone && Math.hypot(n.x - player.x, n.z - player.z) > SOME) { sai(n); if (n.interRef) L.inter = L.inter.filter(i => i !== n.interRef); }
      if ((T -= 5) <= 0) { T = rnd(30, 75); nasce(); }
    } catch (e) { console.warn('estrada714', e); }
  }, 5000);
  global.Estrada714 = { nasce, levanta(n) { liga(n, rnd(40, 120)); } };
})(window);
