/* v600: o corpo do jogador volta sempre a ficar em pé. Ian mandou print do Viajante deitado de lado (3ª pessoa) sem voltar.
   Causa não reproduzida em teste (ataque, esquiva, pulo, queda, 1ª pessoa, sacar, agachar, correr, montar); as únicas rotações
   que inclinam o corpo são o nado (water391), a escalada (climb383), o corpo da inclinação na ladeira (anim547, limite 24°) e a pose
   de morte (warrior127). Este vigia zera X/Z do root e limita o corpo fora dessas poses, e se os ossos ficarem tombados por ~1 s
   fora de uma pose que deixa deitar, faz a recuperação (e avisa no console com o estado, para achar a causa). */
(() => {
  'use strict';
  let bad = 0, warned = false;
  const T = () => window.THREE;
  const finite = v => Number.isFinite(v);
  function allowedTilt(P) {
    try {
      if (P.dead || (P.deadA || 0) > 0.01) return true;
      if (P.swim391) return true;
      if (Math.abs(P.lean383 || 0) > 0.002) return true;
      if (typeof run !== 'undefined' && run && (run.mounted || run.aboard440)) return true;
      if (P.dodgeT > 0) return true;
      if (window.Dream488 && Dream488.active) return true;
      if (window.CINE231) return true;
    } catch (_) { return true; }
    return false;
  }
  function upright(P) {
    const m = P.m, h = m.bones && (m.bones.head || m.bones.neck);
    if (!h || !T()) return 1;
    const v = new (T().Vector3)(), p = new (T().Vector3)();
    h.getWorldPosition(v); m.root.getWorldPosition(p);
    v.sub(p); const l = v.length();
    return l > 0.05 ? v.y / l : 1;
  }
  setInterval(() => {
    try {
      if (typeof started === 'undefined' || !started || typeof player === 'undefined' || !player || !player.m || !player.m.root) return;
      const P = player, m = P.m, r = m.root;
      if (!finite(r.rotation.x) || !finite(r.rotation.z)) { r.rotation.x = 0; r.rotation.z = 0; }
      if (allowedTilt(P)) { bad = 0; return; }
      if (Math.abs(r.rotation.x) > 0.002 || Math.abs(r.rotation.z) > 0.002) { r.rotation.x = 0; r.rotation.z = 0; }
      if (m.body) {
        const b = m.body.rotation;
        if (!finite(b.x) || !finite(b.z)) { b.x = 0; b.z = 0; m.pitch547 = 0; m.roll547 = 0; }
        b.x = Math.max(-0.42, Math.min(0.42, b.x)); b.z = Math.max(-0.32, Math.min(0.32, b.z));
      }
      if (upright(P) < 0.5) {
        if (++bad >= 10) {
          bad = 0;
          if (!warned) { warned = true; console.warn('upright600: corpo tombado', { rx: r.rotation.x, rz: r.rotation.z, body: m.body && [m.body.rotation.x, m.body.rotation.z], state: m.a155 && m.a155.state, atkT: P.atkT, skill: P.skillAnim155 && P.skillAnim155.k, air: P.air344, sneak: window.Mechanics434 && Mechanics434.sneaking }); }
          r.rotation.x = 0; r.rotation.z = 0; r.quaternion.setFromEuler(new (T().Euler)(0, P.face || 0, 0));
          if (m.body) { m.body.rotation.set(0, 0, 0); m.body.position.set(0, 0, 0); }
          m.pitch547 = 0; m.roll547 = 0; P.lean383 = 0;
          if (m.a155) m.a155.state = null;
          if (m.bones) Object.values(m.bones).forEach(o => o.rotation.set(0, 0, 0));
        }
      } else bad = 0;
    } catch (_) {}
  }, 100);
})();
