(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RpgBalance = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var THREATS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 10];
  var XP_THREAT = [1, 1.25, 1.6, 2.1, 2.8, 3.7, 4.8, 6.2, 8, 10, 12, 16];
  var GOLD_THREAT = [1, 1.2, 1.5, 1.9, 2.4, 3, 3.8, 4.8, 6, 7.5, 10, 14];
  var THREAT_INDEX = Object.create(null);
  THREATS.forEach(function (id, i) { THREAT_INDEX[id] = i; });
  var G_LEVELS = [1, 8, 20, 35, 55, 80, 120, 180, 220, 260];
  var G_GOLD = [1, 2.5, 6, 14, 30, 70, 160, 380, 600, 900];
  var ROLES = { normal: 1, elite: 2, boss: 4, rival: 2.5 };
  var GOLD_ROLES = { normal: 1, elite: 2, boss: 25, rival: 6 };
  // v281 (Ian): classes físicas não crescem em mana/magia que não usam; o ganho foi para vida e ataque físico. Tanque passa a ter mais vida que o Guerreiro.
  var GROWTH = [
    { id: 'warrior', hp: [120, 14], mp: [28, .9], physical: [12, 2.4], magic: [2.5, .25] },
    { id: 'assassin', hp: [100, 11], mp: [30, 1], physical: [11, 2.3], magic: [3, .3] },
    { id: 'tank', hp: [130, 16], mp: [30, 1], physical: [10, 1.9], magic: [3, .3] },
    { id: 'mage', hp: [80, 8], mp: [70, 5], physical: [6, .6], magic: [12, 2] },
    { id: 'archer', hp: [95, 10.5], mp: [30, 1], physical: [10, 2.2], magic: [3, .3] },
    { id: 'paladin', hp: [105, 11], mp: [58, 3.5], physical: [9, 1.5], magic: [9, 1.3] },
    { id: 'summoner', hp: [84, 8.5], mp: [64, 4.5], physical: [6, .7], magic: [10, 1.7] },
    { id: 'necromancer', hp: [78, 7.5], mp: [68, 4.8], physical: [5, .6], magic: [11, 1.9] },
    { id: 'fire-mage', hp: [82, 8], mp: [72, 5.2], physical: [6, .6], magic: [13, 2.1] },
    { id: 'ice-mage', hp: [84, 8.2], mp: [72, 5.2], physical: [6, .6], magic: [12.5, 2.05] },
    { id: 'earth-mage', hp: [92, 9], mp: [68, 4.8], physical: [7, .7], magic: [11.5, 1.9] },
    { id: 'lightning-mage', hp: [80, 7.8], mp: [74, 5.4], physical: [6, .6], magic: [13.5, 2.2] },
    { id: 'time-mage', hp: [82, 8], mp: [76, 5.5], physical: [6, .6], magic: [12.5, 2.1] },
    { id: 'rift-weaver', hp: [80, 7.8], mp: [78, 5.6], physical: [6, .6], magic: [12.8, 2.15] },
    { id: 'guardian', hp: [108, 12], mp: [55, 3.2], physical: [9.5, 1.6], magic: [8, 1.1] },
    { id: 'shapeshifter', hp: [100, 10.5], mp: [48, 2.8], physical: [10.5, 1.9], magic: [7, .9] },
    { id: 'rare-mage', hp: [80, 7.8], mp: [76, 5.5], physical: [6, .6], magic: [12.5, 2.1] },
    { id: 'rare-sword', hp: [108, 12], mp: [30, 1], physical: [11, 2.3], magic: [3, .3] },
    { id: 'rare-staff-a', hp: [82, 8], mp: [76, 5.5], physical: [6, .6], magic: [12.5, 2.1] },
    { id: 'rare-staff-b', hp: [84, 8.2], mp: [74, 5.3], physical: [6, .6], magic: [13, 2.15] },
    { id: 'rare-staff-c', hp: [86, 8.4], mp: [72, 5.1], physical: [6, .6], magic: [13.2, 2.2] }
  ];

  function levelOf(value) { var n = Number(value); return Number.isFinite(n) ? Math.max(1, Math.floor(n)) : 1; }
  function threatOf(value) { var n = Number(value); return Number.isInteger(n) && THREAT_INDEX[n] != null ? n : 0; }
  function xpNeed(level) { var l = levelOf(level); return Math.round(60 + l * 40 + 4 * Math.pow(l, 1.8)); }
  function growthFor(classID) {
    var i = Number.isInteger(classID) ? classID : GROWTH.findIndex(function (x) { return x.id === classID; });
    var raw = GROWTH[Math.max(0, Math.min(GROWTH.length - 1, i < 0 ? 0 : i))], out = { id: raw.id };
    ['hp', 'mp', 'physical', 'magic'].forEach(function (key) { out[key] = Object.freeze({base: raw[key][0], perLevel: raw[key][1]}); });
    return Object.freeze(out);
  }
  function baseStats(level, classID) {
    var g = growthFor(classID), l = levelOf(level);
    return { hp: g.hp.base + g.hp.perLevel * l, mp: g.mp.base + g.mp.perLevel * l,
      physical: g.physical.base + g.physical.perLevel * l, magic: g.magic.base + g.magic.perLevel * l };
  }
  function interp(level, xs, ys) {
    var l = levelOf(level); if (l <= xs[0]) return ys[0];
    for (var i = 1; i < xs.length; i++) if (l <= xs[i]) {
      var t = (l - xs[i - 1]) / (xs[i] - xs[i - 1]); return Math.exp(Math.log(ys[i - 1]) + (Math.log(ys[i]) - Math.log(ys[i - 1])) * t);
    }
    return ys[ys.length - 1] * Math.pow(l / xs[xs.length - 1], 1.6);
  }
  function quantizedReward(base, factors, index) {
    var value = -1;
    for (var i = 0; i <= index; i++) value = Math.max(value + 1, Math.round(base * factors[i]));
    return value;
  }
  // Expected encounter work, never elapsed time, damage taken, or player level.
  function combatEffort(input) {
    var o = input || {}, floor = ROLES[o.role] || 1;
    var hp = Number(o.hp), baseline = Number(o.baselineHp);
    if (!(Number.isFinite(hp) && hp > 0 && Number.isFinite(baseline) && baseline > 0)) return 1;
    var resistance = Number.isFinite(Number(o.resistance)) ? Math.max(0, Math.min(.95, Number(o.resistance))) : 0;
    var work = hp / baseline / (1 - resistance);
    var premium = o.role === 'boss' ? 1.25 : o.role === 'elite' ? 1.1 : 1;
    return Math.max(1, work * premium / floor);
  }
  function questReward(input) {
    var o = input || {}, level = levelOf(o.level), count = levelOf(o.count);
    var minutes, difficulty;
    switch (o.type) {
      case 'kill': minutes = count * .3; difficulty = 1; break;
      case 'clear': minutes = count * 8; difficulty = 1.25; break;
      case 'pvp': minutes = count * 2.5; difficulty = 1.25; break;
      case 'elite': minutes = count * 1.2; difficulty = 1.3; break;
      case 'boss': minutes = count * 6; difficulty = 1.4; break;
      case 'extract': minutes = 8; difficulty = 1.15; break;
      case 'daily': minutes = 8; difficulty = .5; break;
      case 'story_miner': minutes = 20; difficulty = 1.2; break;
      case 'story_lake': minutes = 30; difficulty = 1.25; break;
      case 'story_tower': minutes = 60; difficulty = 1.4; break;
      case 'story_city': minutes = 35; difficulty = 1.35; break;
      case 'night': minutes = count * .35; difficulty = 1.15; break;
      case 'nopot': case 'nododge': minutes = count * .3; difficulty = 1.25; break;
      default: return { xp: 0, level: level, minutes: 0, difficulty: 0 };
    }
    return { xp: Math.max(1, Math.round(xpNeed(level) * .07 * minutes * difficulty)), level: level, minutes: minutes, difficulty: difficulty };
  }
  function reward(input) {
    var o = input || {}; if (o.noExpLoot || o.allied) return { xp: 0, gold: 0, threat: 0, role: 'none' };
    var l = levelOf(o.level), threat = threatOf(o.threat), ti = THREAT_INDEX[threat];
    var role = ROLES[o.role] == null ? 'normal' : o.role, gr = GOLD_ROLES[role] == null ? 1 : GOLD_ROLES[role];
    var species = Number.isFinite(Number(o.speciesXp)) ? Math.max(.75, Math.min(1.4, Math.sqrt(Math.max(0, Number(o.speciesXp)) / 16))) : 1;
    var risk = Number.isFinite(Number(o.risk)) ? Math.max(1, Math.min(1.5, Number(o.risk))) : 1;
    var effort = Number.isFinite(Number(o.effort)) ? Math.max(1, Number(o.effort)) : 1;
    var xp = quantizedReward(xpNeed(l) * .08 * ROLES[role] * species * risk * effort, XP_THREAT, ti);
    var gold = quantizedReward(4 * interp(l, G_LEVELS, G_GOLD) * gr * species * risk, GOLD_THREAT, ti);
    return { xp: xp, gold: gold, threat: threat, role: role, level: l, speciesFactor: species, riskFactor: risk, effortFactor: effort };
  }
  function runSelfTests() {
    var w = baseStats(200, 'warrior');
    for (var i = 3; i < GROWTH.length; i++) { var m = baseStats(200, i); if (!(w.hp > m.hp && w.physical > m.physical && w.mp < m.mp && w.magic < m.magic)) return false; }
    for (var t = 1; t < THREATS.length; t++) if (reward({ level: 50, threat: THREATS[t] }).xp <= reward({ level: 50, threat: THREATS[t - 1] }).xp) return false;
    for (var l = 1; l <= 2000; l += 17) if (xpNeed(l) < xpNeed(Math.max(1, l - 1))) return false;
    return true;
  }
  return { xpNeed: xpNeed, growthFor: growthFor, baseStats: baseStats, reward: reward, combatEffort: combatEffort, questReward: questReward, threatOrder: THREATS.slice(), runSelfTests: runSelfTests };
}));
