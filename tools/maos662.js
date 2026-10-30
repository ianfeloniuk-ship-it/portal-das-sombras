/* ============================================================================
 * PRIMEVA v662 — DUAS MÃOS E MOUSE COMO NO SKYRIM (Ian, 28/10/2026)
 * «tem que poder alternar onde vc quer usar cada coisa que nem skyrim usar as 2 mãos
 *  feitiços diferentes usar 2 espadas etc» · «cara igual ao skyrim mapeia os botoes»
 *
 *  MOUSE (PC, igual ao Skyrim):
 *   - A câmera segue o mouse (cursor preso), na 1ª e na 3ª pessoa. Menus, conversa, mapa e Esc soltam o cursor;
 *     clicar na tela prende de novo.
 *   - Botão ESQUERDO = mão direita. Botão DIREITO = mão esquerda.
 *   - Mão esquerda com arma: ataca (segurar e soltar = golpe forte). Com magia: lança a magia.
 *     Vazia: soco da esquerda. Com escudo ou arma de duas mãos (arco, lança): nada.
 *   - v670 (Ian): DEFENDER é só segurar o botão do MEIO; o direito não defende mais.
 *   - Duas armas: segurar os dois botões e soltar = golpe forte duplo (sem defesa, como no Skyrim).
 *   - Botão do meio = defender (o único); a trava de alvo continua na tecla dela.
 *  MÃOS:
 *   - Mão direita: arma (slot Arma de sempre) ou uma habilidade/magia.
 *   - Mão esquerda: arma de uma mão (run.equip.wl), escudo (run.equip.sh) ou uma habilidade/magia.
 *   - Arco e lança são de duas mãos: ocupam as duas. Equipar algo na esquerda tira o arco/lança da direita.
 *   - O que sai de uma mão volta para a Bolsa.
 *  As habilidades continuam também nas teclas de sempre.
 * ============================================================================ */
(function(global){
  'use strict';
  if(typeof attack !== 'function' || typeof run === 'undefined') return;
  const H = global.Maos662 = { stats: { left: 0, dual: 0, casts: { r: 0, l: 0 }, blocks: 0 } };
  const $ = id => document.getElementById(id);
  const TWO = { bow: 1, spear: 1 };
  const kindOf = it => { try { return (it && (weaponKind272(it) || it.kind155)) || null; } catch(_) { return it && it.kind155 || null; } };
  const isTwo = it => !!(it && TWO[kindOf(it)]);
  H.isTwo = isTwo;
  function hands(){ if(!run.hands662) run.hands662 = { r: null, l: null }; return run.hands662; }
  const keyOfSkill = s => s && (s.skillId || s.n);
  function skillByKey(k){ if(!k) return null; try { return (player.skills || []).find(s => s && !s.empty && keyOfSkill(s) === k) || null; } catch(_) { return null; } }
  H.spells = () => { try { return (player.skills || []).filter(s => s && !s.empty && !s.lockedRank); } catch(_) { return []; } };
  function shieldOn(){ try { return typeof shieldActive473 === 'function' ? shieldActive473() : !!run.equip.sh; } catch(_) { return false; } }
  function leftKind(){ if(run.equip.wl) return 'weapon'; const h = hands(); if(h.l && skillByKey(h.l)) return 'spell'; if(run.equip.sh && shieldOn()) return 'shield'; return 'empty'; }
  function rightKind(){ const h = hands(); if(h.r && skillByKey(h.r)) return 'spell'; return run.equip.w ? 'weapon' : 'empty'; }
  H.leftKind = leftKind; H.rightKind = rightKind;

  /* ---------------- equipar por mão ---------------- */
  function room(n){ try { return run.items.length + n <= bagCapacity353(); } catch(_) { return true; } }
  function say(t){ try { toast('<b>[NARRADOR]</b> ' + t); } catch(_) {} }
  function done(msg){ try { refreshStats(); } catch(_) {} try { saveRun(); } catch(_) {} if(msg) say(msg); }
  function clearLeftFor(extraOut){
    const out = [run.equip.wl, run.equip.sh].filter(Boolean);
    if(!room(out.length + (extraOut || 0))) { try { toast('Bolsa cheia: libere espaço para trocar o que está na mão.'); } catch(_) {} return false; }
    for(const it of out) run.items.push(it);
    run.equip.wl = null; run.equip.sh = null; hands().l = null;
    return true;
  }
  H.equipLeft = function(uid){
    const i = run.items.findIndex(x => x.uid === uid); if(i < 0) return false;
    const it = run.items[i];
    if(it.slot !== 'w') return false;
    if(isTwo(it)){ try { toast('Arco e lança usam as duas mãos: equipe na mão direita.'); } catch(_) {} return false; }
    try { if(typeof weaponFitsStyle259 === 'function' && !weaponFitsStyle259(it)){ toast('Esta arma exige estilo ' + (weaponIsMagic173(it) ? 'mágico' : 'físico') + '. Troque o estilo antes de equipar.'); return false; } } catch(_) {}
    const twoR = isTwo(run.equip.w) ? 1 : 0;
    run.items.splice(i, 1);
    if(!clearLeftFor(twoR)){ run.items.splice(i, 0, it); return false; }
    if(twoR){ run.items.push(run.equip.w); run.equip.w = null; }
    run.equip.wl = it;
    done('Mão esquerda: ' + it.name);
    return true;
  };
  H.spellTo = function(side, key){
    const sk = skillByKey(key); if(!sk) return false;
    const h = hands();
    if(side === 'r'){
      if(run.equip.w){ if(!room(1)) { try { toast('Bolsa cheia.'); } catch(_) {} return false; } run.items.push(run.equip.w); run.equip.w = null; }
      h.r = key;
    } else {
      const twoR = isTwo(run.equip.w) ? 1 : 0;
      if(!clearLeftFor(twoR)) return false;
      if(twoR){ run.items.push(run.equip.w); run.equip.w = null; }
      h.l = key;
    }
    done((side === 'r' ? 'Mão direita: ' : 'Mão esquerda: ') + sk.n);
    return true;
  };
  H.clear = function(side){
    const h = hands();
    if(side === 'r'){
      if(h.r){ h.r = null; done('Mão direita vazia'); return true; }
      if(run.equip.w){ if(!room(1)) { try { toast('Bolsa cheia.'); } catch(_) {} return false; } run.items.push(run.equip.w); run.equip.w = null; done('Mão direita vazia'); return true; }
      return false;
    }
    if(!clearLeftFor(0)) return false;
    done('Mão esquerda vazia');
    return true;
  };
  /* o slot Arma de sempre é a mão direita; arco/lança e escudo limpam o que conflita na esquerda */
  (function wrapEquip(){
    if(typeof equipBagItem !== 'function'){ setTimeout(wrapEquip, 300); return; }
    const E0 = equipBagItem;
    equipBagItem = function(uid){
      const it = (run.items || []).find(x => x.uid === uid);
      const ok = E0.apply(this, arguments);
      if(ok && it){
        const h = hands();
        if(it.slot === 'w'){ h.r = null; if(isTwo(it) && (run.equip.wl || h.l)){ if(run.equip.wl && room(1)){ run.items.push(run.equip.wl); run.equip.wl = null; } h.l = null; done(); } }
        if(it.slot === 'sh'){ h.l = null; if(run.equip.wl && room(1)){ run.items.push(run.equip.wl); run.equip.wl = null; } done(); }
      }
      return ok;
    };
  })();

  /* ---------------- ações por mão ---------------- */
  const POWER = 0.42;
  const L = { held: false, t0: 0, ready: 0, blk: false };
  function playing(){
    try {
      if(!started || paused || modalOpen || !player || player.dead) return false;
      if($('gameMenu95') && !$('gameMenu95').hidden) return false;
      if($('dead') && !$('dead').hidden) return false;
      if(typeof inConversation === 'function' && inConversation()) return false;
      if(typeof isCinematic451 === 'function' && isCinematic451()) return false;
      if(global.Dream488 && Dream488.active) return false;
      if(global.CINE231) return false;
      const vis = id => { const e = $(id); return !!e && !e.hidden && getComputedStyle(e).display !== 'none'; };
      if(vis('cons523') || vis('reader406') || vis('fav593')) return false;
      const sd = $('skyrim-dialog'); if(sd && sd.style.display && sd.style.display !== 'none') return false;
      return true;
    } catch(_) { return false; }
  }
  H.playing = playing;
  function cast(side){
    const sk = skillByKey(hands()[side]); if(!sk) return false;
    /* v670: qual mão lança (animação e braço da magia do lado certo) */
    H.castSide = side; H.castUntil = performance.now() + 900;
    let r = false;
    try { r = useSkill(sk); } catch(e){ console.warn('maos662 cast', e); }
    if(r !== false){ H.stats.casts[side]++; H.lastCast = { side, t: performance.now(), col: typeof sk.col === 'number' ? sk.col : 0x88ccff }; }
    return r;
  }
  H.cast = cast;
  /* golpe da mão esquerda: o ataque do jogo com a arma da esquerda no lugar da direita (dano e tipo da arma da esquerda) */
  function leftAttack(power, force){
    const now = performance.now();
    if(!force && now < L.ready) return false;
    if(!player || player.dead || paused) return false;
    const w = run.equip.w, cd = player.atkCd, d0 = player.dmg, mh = (typeof mouseHeld !== 'undefined') ? mouseHeld : false;
    let fired = false, iv = 0;
    run.equip.w = run.equip.wl || null;
    try {
      let dl = d0; try { dl = statsFor().dmg; } catch(_) {}
      player.dmg = dl * (power ? 2 : 1); player.atkCd = 0;
      try { mouseHeld = false; } catch(_) {}
      attack();
      iv = player.atkCd; fired = iv > 0;
    } catch(e){ console.warn('maos662 left', e); }
    finally {
      run.equip.w = w; player.dmg = d0; player.atkCd = cd;
      try { mouseHeld = mh; } catch(_) {}
    }
    if(fired){
      L.ready = now + iv * 1000 * (power ? 1.8 : 1);
      H.stats.left++;
      H.lastLeft = { t: now, power: !!power };
      H.leftUntil = now + Math.max(450, iv * 1000 * (power ? 1.8 : 1)); /* v670: golpe da mão esquerda (clipe espelhado) */
      try { if(global.FP550 && FP550.leftSwing) FP550.leftSwing(!!power); } catch(_) {}
      if(power){ try { shakeA = Math.max(shakeA || 0, 0.35); } catch(_) {} }
    }
    return fired;
  }
  H.leftAttack = leftAttack;
  /* golpe forte duplo: as duas armas de uma vez (soltar os dois botões segurados) */
  function dualPower(){
    const cd = player.atkCd, d0 = player.dmg;
    player.atkCd = 0; player.dmg = d0 * 2;
    try { attack(); } catch(_) {} finally { player.dmg = d0; }
    if(player.atkCd > 0) player.atkCd *= 1.8; else player.atkCd = cd;
    leftAttack(true, true);
    H.stats.dual++;
    try { const SK = global.Skyrim588; if(SK){ SK.winding = false; SK.wind = 0; SK.held = 0; } } catch(_) {}
  }
  function blockOn(){ if(global.Guard472 && Guard472.hold){ Guard472.hold(true); L.blk = true; H.stats.blocks++; try { if(global.Skyrim588) Skyrim588.drawn = true; } catch(_) {} } }
  function blockOff(){ if(L.blk && global.Guard472 && Guard472.hold) Guard472.hold(false); L.blk = false; }
  H.debug = L;

  const C = $('c');
  const touchMode = () => typeof touch !== 'undefined' && touch;
  /* botão esquerdo com magia na mão direita: lança a magia (antes do ataque normal) */
  addEventListener('mousedown', e => {
    if(touchMode() || e.target !== C || !playing()) return;
    if(e.button === 0){ H.leftUntil = 0; H.castSide = 'r'; } /* v670: a mão direita volta a ser a que anima */
    if(e.button === 0 && rightKind() === 'spell'){
      e.stopImmediatePropagation(); e.preventDefault();
      try { mouseHeld = false; } catch(_) {}
      cast('r');
    }
  }, true);
  /* botão direito = mão esquerda. O jogo cancela o pointerdown do direito (câmera), e com dois botões apertados o
     navegador não manda um novo pointerdown: segue o estado real dos botões (e.buttons) em todos os eventos. */
  let rDown = false;
  function rightPress(){
    const lk = leftKind();
    if(lk === 'weapon'){ L.held = true; L.t0 = performance.now(); try { if(global.Skyrim588) Skyrim588.drawn = true; } catch(_) {} }
    else if(lk === 'spell') cast('l');
    else if(lk === 'empty') leftAttack(false);
    /* v670 (Ian: «duas mãos, defesa no meio»): o direito nunca defende; escudo e arma de duas mãos defendem só no botão do meio */
  }
  function rightRelease(leftStill){
    if(L.held){
      L.held = false;
      const power = (performance.now() - L.t0) / 1000 >= POWER;
      const rightHeld = !!leftStill || (typeof mouseHeld !== 'undefined' && mouseHeld) || !!(global.Skyrim588 && Skyrim588.winding);
      if(power && rightHeld && rightKind() === 'weapon' && !isTwo(run.equip.w)) dualPower();
      else leftAttack(power);
    }
    blockOff();
  }
  function track(e){
    if(touchMode() || e.pointerType === 'touch') return;
    let down;
    if(e.type === 'mousedown' || e.type === 'pointerdown') down = e.button === 2 ? true : !!(e.buttons & 2);
    else if(e.type === 'mouseup' || e.type === 'pointerup') down = e.button === 2 ? false : !!(e.buttons & 2);
    else down = !!(e.buttons & 2);
    if(down === rDown) return;
    if(down){
      if(e.target !== C || !playing()) return;
      /* com arma na esquerda o direito não cancela o preparo da direita (Skyrim588): os dois juntos = golpe duplo */
      if(leftKind() === 'weapon' && e.type === 'mousedown') e.stopImmediatePropagation();
      rDown = true; rightPress();
    }
    else { rDown = false; rightRelease(!!(e.buttons & 1)); }
  }
  for(const t of ['pointerdown', 'mousedown', 'pointermove', 'pointerup', 'mouseup']) addEventListener(t, track, true);
  addEventListener('blur', () => { L.held = false; rDown = false; blockOff(); });
  C.addEventListener('contextmenu', e => e.preventDefault());
  H.leftHeld = () => L.held ? Math.min(1, (performance.now() - L.t0) / 1000 / POWER) : 0;

  /* ---------------- câmera seguindo o mouse (cursor preso), como no Skyrim ---------------- */
  if(!touchMode() && C && C.requestPointerLock){
    global.MOUSE662 = true;
    const locked = () => document.pointerLockElement === C;
    const tryLock = () => { if(!locked() && playing()){ try { const p = C.requestPointerLock(); if(p && p.catch) p.catch(() => {}); } catch(_) {} } };
    H.locked = locked;
    const css = document.createElement('style');
    css.textContent = '#xh662{position:fixed;left:50%;top:50%;width:4px;height:4px;margin:-2px 0 0 -2px;border-radius:50%;background:rgba(255,255,255,.8);box-shadow:0 0 3px #000;pointer-events:none;z-index:6;display:none}'
      + '#hint662{position:fixed;left:50%;bottom:96px;transform:translateX(-50%);z-index:7;padding:6px 14px;border-radius:3px;background:rgba(8,10,14,.78);color:#e8e2d0;font:500 14px Jost,"Chakra Petch",sans-serif;letter-spacing:.5px;pointer-events:none;display:none}';
    document.head.append(css);
    const xh = document.createElement('div'); xh.id = 'xh662'; document.body.append(xh);
    const hint = document.createElement('div'); hint.id = 'hint662'; hint.textContent = 'Clique na tela para mirar com o mouse'; document.body.append(hint);
    addEventListener('pointerdown', e => { if(e.target === C && e.pointerType !== 'touch') tryLock(); }, true);
    setInterval(() => {
      const ok = playing();
      if(locked() && !ok){ try { document.exitPointerLock(); } catch(_) {} }
      xh.style.display = ok && locked() && !(global.FP550 && FP550.active) ? 'block' : 'none';
      hint.style.display = ok && !locked() && started ? 'block' : 'none';
      if(!ok){ L.held = false; rDown = false; blockOff(); }
    }, 120);
    addEventListener('mousemove', e => {
      if(!locked() || !playing()) return;
      /* na 1ª pessoa o tools/fp550.js já gira a câmera com o cursor preso */
      if(!(global.FP550 && FP550.active) && typeof cameraLook373 === 'function') cameraLook373(e.movementX, e.movementY);
      try { mouseAim.x = innerWidth / 2; mouseAim.y = innerHeight / 2; mouseAim.ok = true; } catch(_) {}
    });
    document.addEventListener('pointerlockchange', () => { if(locked()){ try { mouseAim.x = innerWidth / 2; mouseAim.y = innerHeight / 2; mouseAim.ok = true; } catch(_) {} } });
  }

  /* ---------------- arma da esquerda no Viajante (3ª pessoa) ----------------
     Monta o modelo da arma do mesmo jeito que a direita (Warrior127.gear com a arma da esquerda no lugar), copia e
     prende na palma da mão esquerda: eixo da arma no polegar, gume nos dedos (mesmo método da 1ª pessoa). */
  const T = THREE;
  function deepClone(o){
    const c = (o.isSkinnedMesh || hasSkin(o)) && T.SkeletonUtils ? T.SkeletonUtils.clone(o) : o.clone(true);
    c.traverse(n => { if(n.isMesh){ n.geometry = n.geometry.clone(); n.material = Array.isArray(n.material) ? n.material.map(m => m.clone()) : n.material.clone(); } });
    return c;
  }
  function hasSkin(o){ let s = false; o.traverse(c => { if(c.isSkinnedMesh) s = true; }); return s; }
  function axisInfo(obj){
    obj.updateWorldMatrix(true, true);
    const inv = obj.matrixWorld.clone().invert(), box = new T.Box3();
    obj.traverse(o => { if(o.isMesh && o.geometry){ o.geometry.computeBoundingBox(); box.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld).applyMatrix4(inv)); } });
    const sz = box.getSize(new T.Vector3()), c = box.getCenter(new T.Vector3());
    const k = sz.x >= sz.y && sz.x >= sz.z ? 'x' : sz.y >= sz.z ? 'y' : 'z';
    const ax = new T.Vector3(); ax[k] = (Math.abs(box.max[k]) >= Math.abs(box.min[k])) ? 1 : -1;
    const rest = ['x', 'y', 'z'].filter(q => q !== k).sort((p, q) => sz[q] - sz[p]);
    const ed = new T.Vector3(); ed[rest[0]] = 1;
    return { ax, ed, len: sz[k], c };
  }
  H.axisInfo = axisInfo;
  /* âncora na palma da mão esquerda (alinhada ao modelo), a partir da amarração da malha */
  function palm(m){
    if(m.palmL662 && m.palmL662.parent) return m.palmL662;
    const hb = m.bones.hand_l; let sk = null;
    m.model.traverse(o => { if(!sk && o.isSkinnedMesh && o.skeleton && o.skeleton.bones.includes(hb)) sk = o.skeleton; });
    const a = new T.Object3D(); a.name = 'palm662_l';
    if(sk){ const hi = sk.bones.indexOf(hb); sk.boneInverses[hi].clone().multiply(new T.Matrix4().makeTranslation(0.3662 + 0.058, 0.7118 - 0.022, 0.03)).decompose(a.position, a.quaternion, a.scale); }
    hb.add(a); m.palmL662 = a; return a;
  }
  let building = false;
  function syncLeft3P(force){
    const P = global.player, m = P && P.m;
    if(!m || !m.warrior127 || !global.Warrior127 || !m.bones || !m.bones.hand_l || building) return;
    const wl = run.equip.wl;
    const key = (wl ? wl.uid + ':' + wl.tier + ':' + wl.rar : 'none') + '|' + m.model.uuid;
    if(!force && key === m.left662key && (!wl || (m.left662 && m.left662.parent))) return;
    if(m.left662 && m.left662.parent) m.left662.parent.remove(m.left662);
    m.left662 = null; m.left662key = key; H.leftSrc = null;
    if(!wl) return;
    building = true;
    const w = run.equip.w, opts = { tierColors: TIER_COL, rarities: RAR, look: profile.look || {} };
    let copy = null, ws = 1;
    try {
      run.equip.w = wl; Warrior127.gear(m, run.equip, opts);
      const src = m.socket && m.socket.children[0];
      if(src){ src.updateWorldMatrix(true, true); ws = src.getWorldScale(new T.Vector3()).x || 1; copy = deepClone(src); }
    } catch(e){ console.warn('maos662 3p', e); }
    finally { run.equip.w = w; try { Warrior127.gear(m, run.equip, opts); } catch(_) {} building = false; }
    if(!copy) return;
    copy.position.set(0, 0, 0); copy.quaternion.identity(); copy.scale.set(1, 1, 1);
    const wrap = new T.Group(), inner = new T.Group(); inner.add(copy); wrap.add(inner); wrap.name = 'left662';
    const info = axisInfo(copy);
    inner.scale.setScalar(ws);
    /* eixo → polegar (+z do modelo); gume → dedos da mão esquerda (+x do modelo) */
    const Z = new T.Vector3(0, 0, 1), F = new T.Vector3(1, 0, 0);
    const mFrom = new T.Matrix4().makeBasis(info.ax, info.ed, info.ax.clone().cross(info.ed)), mTo = new T.Matrix4().makeBasis(Z, F, Z.clone().cross(F));
    wrap.quaternion.setFromRotationMatrix(mTo.multiply(mFrom.transpose()));
    const a = palm(m); a.add(wrap);
    wrap.updateWorldMatrix(true, false);
    wrap.scale.setScalar(1 / (a.getWorldScale(new T.Vector3()).x || 1));
    copy.traverse(o => { if(o.isMesh) o.castShadow = true; });
    m.left662 = wrap; H.leftSrc = { obj: copy, ws, kind: kindOf(wl) };
  }
  H.syncLeft3P = syncLeft3P;
  (function wrapGear(){
    if(typeof gearLook !== 'function'){ setTimeout(wrapGear, 300); return; }
    const G0 = gearLook;
    gearLook = function(){ const r = G0.apply(this, arguments); try { if(!building) syncLeft3P(); } catch(e){ console.warn('maos662', e); } return r; };
  })();
  /* modelos de arma chegam depois (GLB): remonta a esquerda algumas vezes depois de trocar */
  let lastKey = '';
  setInterval(() => {
    try {
      const wl = run && run.equip && run.equip.wl, k = wl ? wl.uid : '';
      if(k !== lastKey){ lastKey = k; syncLeft3P(); if(wl){ setTimeout(() => syncLeft3P(true), 1500); setTimeout(() => syncLeft3P(true), 4500); } }
      else if(wl && player && player.m && !(player.m.left662 && player.m.left662.parent)) syncLeft3P(true);
    } catch(_) {}
  }, 700);

  /* ---------------- Bolsa: o que está em cada mão + equipar por mão ---------------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const B = (txt, a, v, en) => '<button class="btn" data-a="' + a + '" data-v="' + esc(v) + '"' + (en === false ? ' disabled' : '') + '>' + txt + '</button>';
  function handLabel(side){
    const h = hands();
    if(side === 'r'){ const s = skillByKey(h.r); if(s) return 'Magia: ' + esc(s.n); return run.equip.w ? esc(run.equip.w.name) + (isTwo(run.equip.w) ? ' (duas mãos)' : '') : 'Vazia'; }
    if(isTwo(run.equip.w)) return 'Ocupada pela arma de duas mãos';
    if(run.equip.wl) return esc(run.equip.wl.name);
    const s = skillByKey(h.l); if(s) return 'Magia: ' + esc(s.n);
    if(run.equip.sh) return esc(run.equip.sh.name) + (shieldOn() ? '' : ' (guardado)');
    return 'Vazia';
  }
  function handsHtml(){
    let h = '<div class="sec">MÃOS</div><div class="sysline">Como no Skyrim: botão esquerdo usa a mão direita; botão direito usa a mão esquerda (vazia, ela soca). Defender: segure o botão do meio.</div>';
    h += row('Mão direita · botão esquerdo', handLabel('r'), B('Esvaziar', 'hand662clr', 'r', !!(run.equip.w || hands().r)));
    h += row('Mão esquerda · botão direito', handLabel('l'), B('Esvaziar', 'hand662clr', 'l', !!(run.equip.wl || run.equip.sh || hands().l)));
    const sp = H.spells();
    if(sp.length){
      h += '<div class="sec">MAGIAS E HABILIDADES NAS MÃOS</div><div class="sysline">A habilidade na mão é lançada pelo botão daquela mão (continua também na tecla dela).</div>';
      for(const s of sp){ const k = keyOfSkill(s); h += row(esc(s.n), (s.mp ? s.mp + ' de mana · ' : '') + 'recarga ' + Math.round(s.cd || 0) + ' s', B('Mão direita', 'hand662sp', 'r|' + k, hands().r !== k) + B('Mão esquerda', 'hand662sp', 'l|' + k, hands().l !== k)); }
    }
    return h;
  }
  H.handsHtml = handsHtml;
  /* v714 (Ian): o jogo explica uma vez, quando acontece: primeira magia pronta para usar */
  setInterval(() => {
    try {
      if(!started || !player || !H.spells().length) return;
      const d = profile.dicas695 || (profile.dicas695 = {});
      if(d.maos) return; d.maos = 1; store.set('pds2_profile', profile);
      let k = 'I'; try { k = keyLabel(keyOf('bag')); } catch(_) {}
      toast('<b>[NARRADOR]</b> Você pode segurar uma magia em cada mão. Na Bolsa (' + k + '), escolha a mão ao lado da magia. O botão esquerdo do mouse usa a mão direita; o direito usa a esquerda.', 9000);
    } catch(_) {}
  }, 1000);
  (function wrapBag(){
    if(typeof bagView !== 'function'){ setTimeout(wrapBag, 300); return; }
    const BV = bagView;
    bagView = function(){
      const r = BV.apply(this, arguments);
      try {
        const mb = $('mb'); if(!mb) return r;
        const sec = [...mb.querySelectorAll('.sec')].find(e => /^BOLSA/.test(e.textContent));
        if(sec && !mb.querySelector('[data-hands662]')){ const d = document.createElement('div'); d.setAttribute('data-hands662', '1'); d.innerHTML = handsHtml(); sec.parentNode.insertBefore(d, sec); }
        /* armas de uma mão: botão «Mão esquerda» ao lado de «Equipar» (que é a mão direita) */
        mb.querySelectorAll('button[data-a="equip"]').forEach(b => {
          const it = (run.items || []).find(x => x.uid === b.dataset.v);
          if(!it || it.slot !== 'w') return;
          b.textContent = 'Mão direita';
          if(!isTwo(it) && !b.parentNode.querySelector('[data-a="hand662l"]')) b.insertAdjacentHTML('afterend', B('Mão esquerda', 'hand662l', it.uid));
        });
      } catch(e){ console.warn('maos662 bag', e); }
      return r;
    };
  })();
  (function bindActs(){
    const mb = $('mb'); if(!mb){ setTimeout(bindActs, 300); return; }
    mb.addEventListener('click', e => {
      const b = e.target.closest('[data-a]'); if(!b || b.disabled) return;
      const a = b.dataset.a, v = b.dataset.v;
      if(!/^hand662/.test(a)) return;
      e.stopImmediatePropagation();
      if(a === 'hand662l') H.equipLeft(v);
      else if(a === 'hand662clr') H.clear(v);
      else if(a === 'hand662sp'){ const i = v.indexOf('|'); H.spellTo(v.slice(0, i), v.slice(i + 1)); }
      try { if(typeof view === 'function') view(); } catch(_) {}
    }, true);
  })();
})(window);
