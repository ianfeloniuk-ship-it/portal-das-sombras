/* v332/v333 (Ian, 08/10/2026): CONSPIRAR. Monstro comum que acerta o jogador 3 vezes seguidas dando 0 de dano (corpo a corpo ou tiro)
   chama os da mesma facção a até 8,5 m. Eles se aproximam segurando o ataque por 1,8 s e, ao sinal, atacam todos juntos com os ataques normais.
   v333 (Ian): sem círculo no chão. Só entra na conta quem realmente acertar; tiro e corpo a corpo somam igual.
   A soma é por DOIS canais que não se misturam: físico contra Resistência + metade da Vontade, mágico contra Espírito + metade da Vontade.
   Depois da primeira vez o grupo continua conspirando sem pausa (quebrar a formação só atrasa 2,5 s).
   Dano em área (2 ou mais conspiradores atingidos juntos) ou atordoamento enquanto se preparam quebra a formação. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else { root.Conspiracy333 = factory(); root.Conspiracy333.install(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var CFG = { hits: 3, radius: 8.5, channel: 1.8, strike: 2.4, minMembers: 2, streakWindow: 5, cooldown: 0, brokenCooldown: 2.5, aoeWindow: .2, stun: .5 };
  var LINES = ['As lâminas não entram! Juntem as lanças no mesmo ponto!', 'Sozinho ninguém fura essa armadura. Todos juntos, agora!', 'Parem de bater à toa! No mesmo ponto, ao meu sinal!'];
  var BROKEN = 'A formação quebrou!';
  var TIP = 'Conspiração: Monstros que não perfuram sua defesa se unirão para um golpe coordenado. Interrompa-os com habilidades em área antes que concluam o ataque.';

  function num(v) { v = Number(v); return Number.isFinite(v) ? Math.max(0, v) : 0; }
  /* hits: [{atk,pen,type:'phy'|'mag'}] de quem acertou · def: {res,esp,von} já em pontos de defesa (von = metade da Vontade, como no resto do jogo). */
  function jointDamage(hits, def) {
    var s = { phyAtk: 0, phyPen: 0, magAtk: 0, magPen: 0 }, d = def || {};
    (hits || []).forEach(function (m) {
      if (!m) return;
      if (m.type === 'mag') { s.magAtk += num(m.atk); s.magPen += num(m.pen); } else { s.phyAtk += num(m.atk); s.phyPen += num(m.pen); }
    });
    var phyDef = Math.max(0, num(d.res) + num(d.von) - s.phyPen), magDef = Math.max(0, num(d.esp) + num(d.von) - s.magPen);
    var phy = s.phyAtk > 0 ? Math.max(0, s.phyAtk - phyDef) : 0, mag = s.magAtk > 0 ? Math.max(0, s.magAtk - magDef) : 0;
    return { phy: Math.round(phy), mag: Math.round(mag), total: Math.round(phy) + Math.round(mag), sums: s };
  }
  /* Cada golpe que acerta entra na soma; o jogador recebe só a diferença para o que já tinha recebido. */
  function addHit(pool, hit, def) {
    pool.hits.push(hit);
    var res = jointDamage(pool.hits, def), delta = Math.max(0, res.total - (pool.applied || 0));
    pool.applied = Math.max(pool.applied || 0, res.total); pool.result = res;
    return delta;
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
    function penOf(e) { try { mobDefNums296(e); return num(mobAttr281(e).penV); } catch (_) { return 0; } }
    function playerDef() { var d = pDefNums296(); return { res: d.phy, esp: d.mag, von: d.uni }; }
    /* Quem está batendo: corpo a corpo vem em curAtk; tiro e área vêm marcados pelo jogo em projOwner333. */
    function attacker() { return curAtk || window.projOwner333 || null; }
    function say(e, line) {
      try {
        var K = (typeof KINDS !== 'undefined' && KINDS[e.kind]) || {};
        speech153({ short: e.name || K.n || 'Monstro', m: e.m, get x() { return e.x; }, get z() { return e.z; }, get gone() { return !!(e.gone || e.dead); } }, line);
      } catch (_) {}
    }

    function release(C, cd) {
      C.members.forEach(function (e) { if (e.cons333 === C) { e.cons333 = null; if (!e.dead && cd) e.cd = Math.max(e.cd || 0, cd); } });
      if (S.C === C) S.C = null;
      S.streak = 0;
    }
    function alive(C) { return C.members.filter(function (e) { return e.cons333 === C && usable(e) && enemies.indexOf(e) >= 0; }); }
    function start(leader, again) {
      var fam = familyOf(leader);
      var members = enemies.filter(function (e) { return usable(e) && !e.cons333 && familyOf(e) === fam && Math.min(Math.hypot(e.x - leader.x, e.z - leader.z), Math.hypot(e.x - player.x, e.z - player.z)) <= CFG.radius; }); /* 8,5 m de quem chamou ou do alvo: atiradores ficam espalhados em volta do jogador */
      if (members.indexOf(leader) < 0 || members.length < CFG.minMembers) { S.streak = 0; S.nextAt = time + 3; return null; }
      var C = { members: members, leader: leader, phase: 'gather', t0: time, signalAt: time + CFG.channel, pulseAt: time, aoe: [], hits: [], hitBy: [], applied: 0, result: jointDamage([], {}) };
      members.forEach(function (e) { e.cons333 = C; e.knows333 = true; e.aggro = true; });
      S.C = C; S.streak = 0; S.nextAt = time + CFG.channel + CFG.strike + CFG.cooldown;
      if (!again) say(leader, LINES[Math.floor(Math.random() * LINES.length)]);
      try { floater(leader.x, leader.z, 'CONSPIRAÇÃO', '#ff4d6a', !again, 3.2); if (!again) sfx('swing'); } catch (_) {}
      try { LORE.conspira332 = LORE.conspira332 || ['Tática · Conspiração', TIP]; unlockLore('conspira332'); } catch (_) {}
      if (!S.tipShown) { S.tipShown = true; try { toast('<b>[COMBATE]</b> ' + TIP, 9000); } catch (_) {} }
      return C;
    }
    function breakFormation(C, why) {
      var left = alive(C), who = left.indexOf(C.leader) >= 0 ? C.leader : left[0];
      if (who) { say(who, BROKEN); try { floater(who.x, who.z, 'FORMAÇÃO QUEBRADA', '#9fe8ff', true, 3); } catch (_) {} }
      C.broken = why; release(C, 1.4); S.nextAt = time + CFG.brokenCooldown;
    }
    function signal(C) {
      C.phase = 'strike'; C.strikeEnd = time + CFG.strike;
      alive(C).forEach(function (e) { e.cd = 0; try { fxRing(e.x, e.z, 0xff2030, 1.4, .3); } catch (_) {} });
      try { floater(C.leader.x, C.leader.z, 'AGORA!', '#ff4d6a', true, 3.4); sfx('swing'); } catch (_) {}
    }
    function finish(C) {
      var r = C.result;
      try {
        if (C.hitBy.length && C.applied > 0) floater(player.x, player.z, 'GOLPE CONJUNTO · ' + C.hitBy.length + ' acertaram · físico ' + fmt(r.phy) + ' + mágico ' + fmt(r.mag), '#ff4d6a', true, 3.4);
        else if (C.hitBy.length) floater(player.x, player.z, 'BLOQUEADO', '#8bdcff', true, 3);
      } catch (_) {}
      C.done = true; api.last = C; release(C, 0); S.nextAt = time + CFG.cooldown;
    }
    function tick() {
      var C = S.C; if (!C || time === S.lastTick) return; S.lastTick = time;
      var left = alive(C);
      if (C.phase === 'gather') {
        if (left.length < CFG.minMembers) return breakFormation(C, 'few');
        if (left.some(function (e) { return e.stun >= CFG.stun; })) return breakFormation(C, 'stun');
        if (time >= C.pulseAt) { C.pulseAt = time + .45; left.forEach(function (e) { try { fxRing(e.x, e.z, 0xff2030, 1.1, .3); } catch (_) {} }); }
        if (time >= C.signalAt) signal(C);
      } else if (!left.length || time >= C.strikeEnd || left.every(function (e) { return C.hitBy.indexOf(e) >= 0; })) finish(C);
    }
    api.tick = tick; api.start = start;

    var basePDef = pDefVal296;
    pDefVal296 = function (type) { return S.striking ? 0 : basePDef(type); }; /* a defesa já foi descontada por canal no golpe conjunto */

    var baseShoot = shoot;
    shoot = function (x, z, a, spd, dmg, team) { /* guarda quem atirou, para o tiro contar no gatilho e na soma */
      var n = projs.length, out = baseShoot.apply(this, arguments);
      if (team === 'enemy' && curAtk) for (var i = n; i < projs.length; i++) projs[i].owner333 = curAtk;
      return out;
    };

    var baseHurtPlayer = hurtPlayer;
    hurtPlayer = function (amt) {
      var a = attacker(), C = S.C;
      if (!S.striking && C && C.phase === 'strike' && a && a.cons333 === C && C.hitBy.indexOf(a) < 0 && !player.dead && !(player.iT > 0)) {
        /* acertou durante o golpe conjunto: entra na soma e o jogador recebe só o que a soma passou a furar */
        C.hitBy.push(a);
        var delta = addHit(C, { atk: amt, pen: penOf(a), type: inDType281 === 'mag' ? 'mag' : 'phy' }, playerDef());
        if (delta > 0) {
          var keepAtk = curAtk; S.striking = true; curAtk = a;
          try { baseHurtPlayer.call(this, delta, false); } finally { S.striking = false; curAtk = keepAtk; }
        } else { try { if (time >= (player.def296At || 0)) { floater(player.x, player.z, 'BLOQUEADO', '#8bdcff'); player.def296At = time + .5; } } catch (_) {} }
        return;
      }
      var count = !S.striking && !C && a && usable(a) && !player.dead && !(player.iT > 0) && time >= S.nextAt && enemies.indexOf(a) >= 0;
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
      var C = e && e.cons333, out = baseHurtEnemy.apply(this, arguments);
      if (C && S.C === C && C.phase === 'gather' && o && o.fromPlayer) {
        if ((o.stun || 0) >= CFG.stun) breakFormation(C, 'stun');
        else { C.aoe.push({ e: e, at: time }); if (distinctRecent(C.aoe, time) >= 2) breakFormation(C, 'aoe'); }
      }
      return out;
    };

    var baseUpd = updEnemy;
    updEnemy = function (e, dt) {
      tick();
      var C = e.cons333;
      if (C && S.C !== C) e.cons333 = null;
      /* v333 (Ian): quem já conspirou sabe que sozinho não fere e volta a conspirar em seguida, sem precisar de mais 3 golpes */
      if (!S.C && e.knows333 && usable(e) && time >= S.nextAt && !player.dead && e.aggro && Math.hypot(e.x - player.x, e.z - player.z) < 14) start(e, true);
      C = e.cons333;
      if (C && C.phase === 'gather' && !e.dead) e.cd = Math.max(e.cd || 0, dt + .05); /* continua vindo, mas segura o golpe até o sinal */
      return baseUpd.apply(this, arguments);
    };
    /* Sem monstros sendo atualizados (troca de mapa, morte), a conspiração não pode ficar presa. */
    setInterval(function () { var C = S.C; if (!C) return; try { if (player.dead || time > C.signalAt + CFG.strike + 1.5 || !alive(C).length) release(C, 0); } catch (_) {} }, 500);
    return true;
  }

  return { CFG: CFG, TIP: TIP, LINES: LINES, BROKEN: BROKEN, jointDamage: jointDamage, addHit: addHit, nextStreak: nextStreak, distinctRecent: distinctRecent, install: install };
}));
