/* ============================================================================
 * PRIMEVA v588 — MECÂNICA DE ATAQUE DO SKYRIM (só a mecânica)
 * Arquivo: tools/skyrim588.js
 *  - Arco: SEGURAR o botão de ataque puxa a corda (zoom de mira, flecha encaixada); SOLTAR dispara.
 *    Dano e velocidade da flecha crescem com a puxada (mínimo 20%); botão direito/Esc cancela.
 *  - Espada/machado/maça/martelo (1ª pessoa): clique rápido = golpe leve; SEGURAR e soltar = golpe forte
 *    (o braço recua enquanto segura; dano ×2, recarga maior).
 *  - Magias/habilidades (1ª pessoa): a mão livre sobe à frente, abre a palma e brilha na cor do elemento.
 * Estado exposto em window.Skyrim588 (lido por tools/fp550.js para as poses).
 * ============================================================================ */
(function(global){
  'use strict';
  const SK = global.Skyrim588 = { drawing: false, draw: 0, winding: false, wind: 0, held: 0, cast: 0, castCol: 0x88ccff, drawn: false, dr: 0, blk: 0 };
  const DRAW_TIME = 0.9, POWER_TIME = 0.42, POWER_MUL = 2, MIN_DRAW = 0.2;
  let baseFov = null, last = 0;

  const kind = () => { try { return weaponKind272(run.equip.w) || ''; } catch(_) { return ''; } };
  const ready = () => { try { return !!(started && !paused && !modalOpen && player && !player.dead); } catch(_) { return false; } };
  const fpOn = () => { try { return !!(global.FP550 && FP550.active); } catch(_) { return false; } };
  const melee = k => /^(sword|axe|mace|hammer)$/.test(k);

  function cancel(){
    SK.drawing = false; SK.draw = 0; SK.winding = false; SK.wind = 0; SK.held = 0;
  }
  function releaseBow(){
    const d = SK.draw; cancel();
    if(d < MIN_DRAW) return;
    global.__bowDraw588 = d;
    try { attack(); } finally { global.__bowDraw588 = null; }
  }
  function releaseWind(){
    const h = SK.held, power = h >= POWER_TIME; cancel();
    if(!power){ attack(); return; }
    const before = player.atkCd;
    player.dmg *= POWER_MUL;
    try { attack(); } finally { player.dmg /= POWER_MUL; }
    if(player.atkCd > before) player.atkCd *= 1.8;
    try { shakeA = Math.max(shakeA || 0, 0.35); } catch(_) {}
  }

  const cv = document.getElementById('c');
  cv.addEventListener('mousedown', e => {
    if(typeof touch !== 'undefined' && touch) return;
    if(e.button === 2 && (SK.drawing || SK.winding)){ cancel(); e.preventDefault(); return; }
    if(e.button !== 0 || !ready()) return;
    const k = kind();
    if(k && fpOn() && !SK.drawn) SK.drawn = true; /* atacar saca a arma, como no Skyrim */
    if(k === 'bow'){
      if(player.atkCd > 0 || player.dodgeT > 0) { e.stopImmediatePropagation(); return; }
      e.stopImmediatePropagation(); SK.drawing = true; SK.draw = 0; SK.held = 0;
    } else if(fpOn() && melee(k)){
      e.stopImmediatePropagation(); SK.winding = true; SK.wind = 0; SK.held = 0;
    }
  }, true);
  cv.addEventListener('contextmenu', e => { if(SK.drawing || SK.winding) e.preventDefault(); });
  addEventListener('mouseup', e => {
    if(e.button !== 0) return;
    if(SK.drawing) releaseBow(); else if(SK.winding) releaseWind();
  });
  addEventListener('blur', cancel);
  addEventListener('keydown', e => { if(e.key === 'Escape') cancel(); });

  /* sacar / guardar a arma (1ª pessoa); a tecla fica em Controles ("Sacar / guardar arma") */
  try { if(typeof KEYACT !== 'undefined' && !KEYACT.find(k => k[0] === 'sheathe')) KEYACT.push(['sheathe', 'Sacar / guardar a arma', 'Sheathe592']); } catch(_) {}
  addEventListener('keydown', e => {
    if(e.repeat || !ready() || !fpOn() || !kind()) return;
    let code = 'KeyR'; try { code = keyOf('sheathe'); } catch(_) {}
    if(e.code !== code) return;
    cancel(); SK.drawn = !SK.drawn; e.preventDefault();
    try { toast(SK.drawn ? 'Arma sacada' : 'Arma guardada', 900); } catch(_) {}
  });
  /* v634: defender = segurar o botão do MEIO (Guard472); o botão direito não defende, só gira a câmera. Defender com o meio saca a arma. */
  cv.addEventListener('pointerdown', e => {
    if(e.button !== 1 || e.pointerType === 'touch' || !ready() || !kind() || SK.drawing) return;
    SK.drawn = true;
  }, true);

  /* flecha: dano e velocidade pela puxada */
  (function wrapShoot(){
    if(typeof shoot !== 'function'){ setTimeout(wrapShoot, 300); return; }
    const s0 = shoot;
    shoot = function(x, z, a, spd, dmg, ...rest){
      const d = global.__bowDraw588;
      if(d != null){ spd *= 0.65 + 0.35 * d; dmg *= 0.4 + 1.1 * d; }
      return s0.call(this, x, z, a, spd, dmg, ...rest);
    };
  })();

  /* magias: a pose de lançamento começa quando a habilidade dispara */
  (function wrapSkill(){
    if(typeof useSkill !== 'function'){ setTimeout(wrapSkill, 300); return; }
    const u0 = useSkill;
    useSkill = function(sk){
      const r = u0.apply(this, arguments);
      if(r !== false && sk && fpOn()){ SK.cast = 1; SK.castCol = typeof sk.col === 'number' ? sk.col : 0x88ccff; }
      return r;
    };
  })();

  function step(){
    const now = performance.now(), dt = Math.min(0.06, Math.max(0, (now - (last || now)) / 1000)); last = now;
    if(SK.drawing){
      if(!ready() || kind() !== 'bow'){ cancel(); }
      else { SK.held += dt; SK.draw = Math.min(1, SK.held / DRAW_TIME); }
    } else if(SK.winding){
      if(!ready() || !fpOn() || !melee(kind())) cancel();
      else { SK.held += dt; SK.wind = Math.min(1, SK.held / POWER_TIME); }
    }
    if(SK.cast > 0) SK.cast = Math.max(0, SK.cast - dt / 0.55);
    SK.dr += ((SK.drawn ? 1 : 0) - SK.dr) * Math.min(1, dt * 7);
    const gb = global.Guard472 && Guard472.blocking && Guard472.blocking() && fpOn() ? 1 : 0;
    if(gb && !SK.drawn) SK.drawn = true;
    SK.blk += (gb - SK.blk) * Math.min(1, dt * 12);
    /* zoom de mira ao puxar o arco (e volta suave) */
    if(typeof camera !== 'undefined' && camera){
      if(SK.draw > 0.02){
        if(baseFov == null) baseFov = camera.fov;
        const e = SK.draw * SK.draw * (3 - 2 * SK.draw), target = baseFov * (1 - 0.26 * e);
        camera.fov += (target - camera.fov) * Math.min(1, dt * 12); camera.updateProjectionMatrix();
      } else if(baseFov != null){
        camera.fov += (baseFov - camera.fov) * Math.min(1, dt * 10);
        if(Math.abs(camera.fov - baseFov) < 0.05){ camera.fov = baseFov; baseFov = null; }
        camera.updateProjectionMatrix();
      }
    }
  }
  (function hookCam(){
    if(typeof camUpdate !== 'function'){ setTimeout(hookCam, 300); return; }
    const c0 = camUpdate;
    camUpdate = function(){ const r = c0.apply(this, arguments); try { step(); } catch(_) {} return r; };
  })();
})(window);
