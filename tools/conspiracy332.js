/* v332 (Ian, 08/10/2026): CONSPIRAR. Monstros comuns que dão 3 golpes seguidos de 0 de dano no jogador param de bater no vazio:
   os da mesma facção a até 8,5 m recuam, canalizam 1,8 s (círculo vermelho no chão + fala) e soltam um golpe conjunto.
   O golpe soma por DOIS canais que não se misturam: físico contra Resistência + metade da Vontade, mágico contra Espírito + metade da Vontade.
   Dano em área (2 ou mais conspiradores atingidos juntos) ou atordoamento durante a canalização quebra a formação. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else { root.Conspiracy332 = factory(); root.Conspiracy332.install(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var CFG = { hits: 3, radius: 8.5, channel: 1.8, zone: 3.2, minMembers: 2, streakWindow: 5, cooldown: 8, brokenCooldown: 10, aoeWindow: .2, stun: .5 };
  var MAGIC_PROFILES = { Arcano: 1, Espectral: 1 };
  var LINES = ['As lâminas não entram! Juntem as lanças no mesmo ponto!', 'Sozinho ninguém fura essa armadura. Todos juntos, agora!', 'Parem de bater à toa! No mesmo ponto, ao meu sinal!'];
  var BROKEN = 'A formação quebrou!';
  var TIP = 'Conspiração: Monstros que não perfuram sua defesa se unirão para um golpe coordenado. Interrompa-os com habilidades em área antes que concluam o ataque.';

  function num(v) { v = Number(v); return Number.isFinite(v) ? Math.max(0, v) : 0; }
  /* members: [{atk,pen,type:'phy'|'mag'}] · def: {res,esp,von} já em pontos de defesa (von = metade da Vontade, como no resto do jogo). */
  function jointDamage(members, def) {
    var s = { phyAtk: 0, phyPen: 0, magAtk: 0, magPen: 0 }, d = def || {};
    (members || []).forEach(function (m) {
      if (!m) return;
      if (m.type === 'mag') { s.magAtk += num(m.atk); s.magPen += num(m.pen); } else { s.phyAtk += num(m.atk); s.phyPen += num(m.pen); }
    });
    var phyDef = Math.max(0, num(d.res) + num(d.von) - s.phyPen), magDef = Math.max(0, num(d.esp) + num(d.von) - s.magPen);
    var phy = s.phyAtk > 0 ? Math.max(0, s.phyAtk - phyDef) : 0, mag = s.magAtk > 0 ? Math.max(0, s.magAtk - magDef) : 0;
    return { phy: Math.round(phy), mag: Math.round(mag), total: Math.round(phy) + Math.round(mag), sums: s };
  }
  /* Sequência de golpes sem dano: zera se um golpe machucar ou se passarem `window` segundos. */
  function nextStreak(streak, lastAt, now, dealt, cfg) {
    var c = cfg || CFG;
    if (dealt > 0) return 0;
    return (now - lastAt > c.streakWindow ? 0 : streak) + 1;
  }
  function distinctRecent(hits, now, cfg) {
    var c = cfg || CFG, seen = [];
    hits.forEach(function (h) { if (now - h.at <= c.aoeWindow && seen.indexOf(h.e) < 0) seen.push(h.e); });
    return seen.length;
  }

  function install() {
    if (typeof hurtPlayer !== 'function' || typeof updEnemy !== 'function' || typeof hurtEnemy !== 'function') return false;
    var S = { streak: 0, lastAt: -99, nextAt: 0, C: null, striking: false, lastTick: -1, tipShown: false };
    var api = this;
    api.state = S;

    function familyOf(e) {
      if (e.group) return 'g:' + e.group;
      try { for (var id in FAMILIES124) if (FAMILIES124[id].ks.indexOf(e.kind) >= 0) return 'f:' + id; } catch (_) {}
      return 'k:' + (e.kind || '');
    }
    function usable(e) { return e && !e.dead && !e.gone && !e.isBoss && !e.rival && !e.friendly217 && !e.ally && !e.statue && !e.frozen && !e.hold; }
    function memberStats(e) {
      var a = null, atk = num(e.dmg);
      try { a = mobAttr281(e); mobDefNums296(e); } catch (_) {}
      try { atk = num(kitWeakDamage111(e, atk)); } catch (_) {}
      return { atk: atk, pen: num(a && a.penV), type: a && MAGIC_PROFILES[a.prof] ? 'mag' : 'phy' };
    }
    function playerDef() { var d = pDefNums296(); return { res: d.phy, esp: d.mag, von: d.uni }; }
    function say(e, line) {
      try {
        var K = (typeof KINDS !== 'undefined' && KINDS[e.kind]) || {};
        speech153({ short: e.name || K.n || 'Monstro', m: e.m, get x() { return e.x; }, get z() { return e.z; }, get gone() { return !!(e.gone || e.dead); } }, line);
      } catch (_) {}
    }
    /* Círculo vermelho no chão que enche até o golpe. */
    function showTelegraph(x, z, r, dur) {
      var g = new THREE.Group(); g.position.set(x, .07, z);
      var mat = function (o) { return new THREE.MeshBasicMaterial({ color: 0xff2030, transparent: true, opacity: o, depthWrite: false }); };
      var ring = new THREE.Mesh(new THREE.RingGeometry(r - .2, r, 48), mat(.95)); ring.rotation.x = -Math.PI / 2; g.add(ring);
      var fill = new THREE.Mesh(new THREE.CircleGeometry(r, 48), mat(.3)); fill.rotation.x = -Math.PI / 2; fill.scale.setScalar(.01); g.add(fill);
      scene.add(g);
      return { g: g, fill: fill, t0: time, dur: dur, remove: function () { if (g.parent) g.parent.remove(g); g.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); }); } };
    }
    api.showTelegraph = showTelegraph;
    if (typeof window.showTelegraph !== 'function') window.showTelegraph = showTelegraph;

    function release(C, cd) {
      C.members.forEach(function (e) { if (e.cons332 === C) { e.cons332 = null; if (e.act && e.act.type === 'conspire332') e.act = null; if (!e.dead) e.cd = Math.max(e.cd || 0, cd); } });
      try { C.tele.remove(); } catch (_) {}
      if (S.C === C) S.C = null;
      S.streak = 0;
    }
    function alive(C) { return C.members.filter(function (e) { return e.cons332 === C && usable(e) && enemies.indexOf(e) >= 0; }); }
    function start(leader) {
      var fam = familyOf(leader);
      var members = enemies.filter(function (e) { return usable(e) && !e.cons332 && familyOf(e) === fam && Math.hypot(e.x - leader.x, e.z - leader.z) <= CFG.radius; });
      if (members.indexOf(leader) < 0 || members.length < CFG.minMembers) { S.streak = 0; S.nextAt = time + 3; return null; }
      var C = { members: members, leader: leader, t0: time, end: time + CFG.channel, x: player.x, z: player.z, r: CFG.zone, hits: [] };
      C.tele = showTelegraph(C.x, C.z, C.r, CFG.channel);
      members.forEach(function (e) { e.cons332 = C; e.act = { type: 'conspire332', t: 0 }; e.aggro = true; });
      S.C = C; S.streak = 0; S.nextAt = time + CFG.channel + CFG.cooldown;
      say(leader, LINES[Math.floor(Math.random() * LINES.length)]);
      try { floater(leader.x, leader.z, 'CONSPIRAÇÃO', '#ff4d6a', true, 3.2); sfx('swing'); } catch (_) {}
      try { LORE.conspira332 = LORE.conspira332 || ['Tática · Conspiração', TIP]; unlockLore('conspira332'); } catch (_) {}
      if (!S.tipShown) { S.tipShown = true; try { toast('<b>[COMBATE]</b> ' + TIP, 9000); } catch (_) {} }
      return C;
    }
    function breakFormation(C, why) {
      var left = alive(C), who = left.indexOf(C.leader) >= 0 ? C.leader : left[0];
      if (who) say(who, BROKEN);
      try { floater(C.x, C.z, 'FORMAÇÃO QUEBRADA', '#9fe8ff', true, 3); fxRing(C.x, C.z, 0x9fb0c4, C.r, .3); } catch (_) {}
      C.broken = why; release(C, 1.4); S.nextAt = time + CFG.brokenCooldown;
    }
    function resolve(C) {
      var left = alive(C), res = jointDamage(left.map(memberStats), playerDef());
      C.result = res;
      try { left.forEach(function (e) { fxLine([{ x: e.x, z: e.z }, { x: C.x, z: C.z }], 0xff4040); }); fxRing(C.x, C.z, 0xff2030, C.r, .4); fxBurst(C.x, .5, C.z, 0xff4040, 10, 5); shake(.35); sfx('boom'); } catch (_) {}
      var inside = !player.dead && Math.hypot(player.x - C.x, player.z - C.z) <= C.r + (player.r || .5);
      if (inside) {
        if (res.total > 0) {
          var keepAtk = curAtk, keepType = inDType281, lead = left.slice().sort(function (a, b) { return num(b.dmg) - num(a.dmg); })[0];
          S.striking = true; curAtk = lead; inDType281 = res.mag > res.phy ? 'mag' : 'phy';
          try { hurtPlayer(res.total, false); } finally { S.striking = false; curAtk = keepAtk; inDType281 = keepType; }
          try { floater(player.x, player.z, 'GOLPE CONJUNTO · físico ' + fmt(res.phy) + ' + mágico ' + fmt(res.mag), '#ff4d6a', true, 3.4); } catch (_) {}
        } else { try { floater(player.x, player.z, 'BLOQUEADO', '#8bdcff', true, 3); } catch (_) {} }
      }
      C.hitPlayer = inside && res.total > 0;
      api.last = C;
      release(C, 1.2);
    }
    function tick() {
      var C = S.C; if (!C || time === S.lastTick) return; S.lastTick = time;
      var left = alive(C);
      if (left.length < CFG.minMembers) return breakFormation(C, 'few');
      if (left.some(function (e) { return e.stun >= CFG.stun; })) return breakFormation(C, 'stun');
      C.tele.fill.scale.setScalar(Math.max(.01, Math.min(1, (time - C.t0) / CFG.channel)));
      if (time >= C.end) resolve(C);
    }
    api.tick = tick; api.start = start;

    var basePDef = pDefVal296;
    pDefVal296 = function (type) { return S.striking ? 0 : basePDef(type); }; /* a defesa já foi descontada por canal no golpe conjunto */

    var baseHurtPlayer = hurtPlayer;
    hurtPlayer = function (amt) {
      var a = curAtk, count = !S.striking && !S.C && a && usable(a) && !player.dead && !(player.iT > 0) && time >= S.nextAt && enemies.indexOf(a) >= 0;
      var pool = function () { var hs = 0; try { hs = healingShield(player); } catch (_) {} return player.hp + (player.shield || 0) + hs; };
      var before = count ? pool() : 0, out = baseHurtPlayer.apply(this, arguments);
      if (count) {
        S.streak = nextStreak(S.streak, S.lastAt, time, Math.max(0, before - pool()));
        S.lastAt = time;
        if (S.streak >= CFG.hits && !player.dead) start(a);
      }
      return out;
    };

    var baseHurtEnemy = hurtEnemy;
    hurtEnemy = function (e, amt, sx, sz, o) {
      var C = e && e.cons332, out = baseHurtEnemy.apply(this, arguments);
      if (C && S.C === C && o && o.fromPlayer) {
        if ((o.stun || 0) >= CFG.stun) breakFormation(C, 'stun');
        else { C.hits.push({ e: e, at: time }); if (distinctRecent(C.hits, time) >= 2) breakFormation(C, 'aoe'); }
      }
      return out;
    };

    var baseUpd = updEnemy;
    updEnemy = function (e, dt) {
      tick();
      var C = e.cons332;
      if (C && S.C === C && !e.dead) { if (!e.act || e.act.type !== 'conspire332') e.act = { type: 'conspire332', t: 0 }; }
      else if (C) { e.cons332 = null; if (e.act && e.act.type === 'conspire332') e.act = null; }
      var out = baseUpd.apply(this, arguments);
      C = e.cons332; /* a conspiração pode ter começado dentro desta mesma atualização */
      if (C && S.C === C && !e.dead && !(e.stun > 0)) {
        var dx = e.x - C.x, dz = e.z - C.z, d = Math.hypot(dx, dz) || 1;
        try { if (time - C.t0 < .4) moveEnt(e, dx / d * 2.4 * dt, dz / d * 2.4 * dt); turnTo(e, Math.atan2(-dx, -dz), dt, 8); e.m.root.position.set(e.x, 0, e.z); e.m.root.rotation.y = e.face; } catch (_) {}
      }
      return out;
    };
    /* Sem monstros sendo atualizados (troca de mapa, morte), o círculo não pode ficar no chão. */
    setInterval(function () { var C = S.C; if (!C) return; try { if (player.dead || time > C.end + 1.5 || !alive(C).length) release(C, 0); } catch (_) {} }, 500);
    return true;
  }

  return { CFG: CFG, TIP: TIP, LINES: LINES, BROKEN: BROKEN, jointDamage: jointDamage, nextStreak: nextStreak, distinctRecent: distinctRecent, install: install };
}));
