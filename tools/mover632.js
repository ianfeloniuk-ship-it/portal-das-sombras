/* v632: movimento mais fluido (Ian). Shift + direção = ROLAR (invulnerável por pouco tempo, gasta Estamina);
   toque duplo em W/A/S/D = IMPULSO curto (dash) sem rolar, com recarga e Estamina; Alt = correr (a troca de teclas está em 630-controles.js).
   Rolar e impulso passam pelo moveEnt (colisão em passos de 25 cm), então não atravessam parede nem muralha; aqui também não entram em água funda. */
(() => {
  'use strict';
  const COST_ROLL = 20, COST_DASH = 10, DASH_T = .2, DASH_SPD = 18, DASH_CD = .9, TAP_MS = 250;
  const ok = () => typeof started !== 'undefined' && started && typeof player !== 'undefined' && player && !player.dead && !paused && !modalOpen;
  const vig = () => { try { return martialState260(); } catch (_) { return null; } };
  const spend = n => { const r = vig(); if (r) { r.vigor = Math.max(0, r.vigor - n); r.vigorWait = Math.max(r.vigorWait || 0, 1.2); } };
  const has = n => { const r = vig(); return !r || r.vigor >= n; };
  const tired = (() => { let t = 0; return () => { const n = performance.now(); if (n - t > 1500) { t = n; try { toast('Sem fôlego (Estamina).', 1200); } catch (_) {} } }; })();

  /* rolar: gasta Estamina e só rola se a original aceitou o pedido */
  const dodge0 = dodge;
  dodge = function () {
    const P = player;
    if (!P || P.dead || paused || P.dodgeCd > 0 || P.dodgeT > 0 || P.swim391) return;
    if (!has(COST_ROLL)) { tired(); return; }
    P.dashNoRoll632 = false;
    const before = P.dodgeT || 0;
    dodge0.apply(this, arguments);
    if ((P.dodgeT || 0) > before) spend(COST_ROLL);
  };

  /* impulso: toque duplo na direção */
  const DIR = { KeyW: [0, -1], ArrowUp: [0, -1], KeyS: [0, 1], ArrowDown: [0, 1], KeyA: [-1, 0], ArrowLeft: [-1, 0], KeyD: [1, 0], ArrowRight: [1, 0] };
  const last = {};
  function dash(code) {
    const P = player;
    if (!ok() || P.dodgeT > 0 || P.air344 || P.swim391 || (P.dashCd632 || 0) > performance.now() || (typeof run !== 'undefined' && run && run.mounted)) return;
    if (window.Cogu348 && Cogu348.asleep(P)) return;
    if (!has(COST_DASH)) { tired(); return; }
    let [dx, dz] = DIR[code];
    if (pcCam.yaw) [dx, dz] = camRot(dx, dz);
    const l = Math.hypot(dx, dz) || 1;
    P.dir = { x: dx / l, z: dz / l };
    P.dodgeT = DASH_T; P.dashSpd = DASH_SPD; P.dashNoRoll632 = true; P.dashDmg = null;
    P.dashCd632 = performance.now() + DASH_CD * 1000;
    spend(COST_DASH);
    try { sfx('dodge'); } catch (_) {}
  }
  addEventListener('keydown', e => {
    if (e.repeat || !DIR[e.code]) return;
    const t = e.target; if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    if (e.shiftKey || e.altKey || e.ctrlKey) { last[e.code] = 0; return; }
    const now = performance.now();
    if (last[e.code] && now - last[e.code] < TAP_MS && now - last[e.code] > 30) { last[e.code] = 0; dash(e.code); }
    else last[e.code] = now;
  }, true);
  addEventListener('blur', () => { for (const k in last) last[k] = 0; });

  /* rolar/impulso não entram em água funda (nada passa por cima do nado) */
  const move0 = moveEnt;
  moveEnt = function (e, dx, dz) {
    if (e === player && e.dodgeT > 0 && window.Water391) {
      try { if (Water391.depthAt(e.x + dx, e.z + dz) > 1.3 && Water391.depthAt(e.x, e.z) <= 1.3) return; } catch (_) {}
    }
    return move0.apply(this, arguments);
  };
  window.Mover632 = { COST_ROLL, COST_DASH, dash };
})();
