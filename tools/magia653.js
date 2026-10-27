/* v653 (Ian, áudio de 27/10/2026): "o jeito que as magias são castadas … tem que ser como em Skyrim".
   TOQUE    apertar e soltar rápido o botão esquerdo lança UMA magia (o projétil de sempre, mesmo efeito) e gasta 1 de mana.
   SEGURAR  depois de um instante segurando, sai um fluxo contínuo da mão ou do cajado, na direção da mira:
            fogo = jato de chamas em cone curto, gelo = jato de geada em cone, terra = jato de areia e pedrinhas em cone,
            raio / arcano / luz / trevas = feixe contínuo até o primeiro inimigo.
            Dano a cada 1/4 de segundo, sempre inteiro (o mesmo dano por segundo do ataque básico com projéteis).
            Os efeitos do básico da classe continuam (fogo queima, gelo deixa lento). Gasta 1 de mana ao começar e mais 1
            a cada segundo segurando; a mana não regenera enquanto o fluxo sai. Sem mana, para e avisa. Soltar = para.
   Só vale para o ataque básico mágico que soltava projéteis (cajado, varinha, tomo, orbe ou mãos com estilo arcano).
   Armas físicas, defesa (botão do meio), câmera (direito) e habilidades com tecla própria não mudam.
   Esta parte é carregada ANTES dos outros envoltórios do attack() (ecology410, guard472, impact459, lote541, crime545,
   living372): conversa, defesa, montaria e falta de mana continuam barrando o ataque antes de chegar aqui.
   v656   publicado como v656 (o número v653 já tinha sido usado por outra sessão; o nome do arquivo ficou).
          O fluxo também para sozinho em cena, dormindo, conversa, janela aberta, defendendo e montado (checado a cada quadro).
          Efeitos de acerto do básico (cura do Paladino, veneno, runas, passivas) e a diária de ataques contam 1 vez por segundo.
          O dano usa resto acumulado: sempre inteiro e o mesmo dano por segundo do projétil, sem mínimo de 1 por tick.
          Toque não liga o gasto por segundo do lote541 (paga só 1). */
(function () {
  'use strict';
  if (typeof attack !== 'function' || typeof update !== 'function' || typeof THREE === 'undefined') return;
  const T = THREE;
  const HOLD = .25, TICK = .25;
  const MAG = /^(staff|bonestaff|wand|tome|orb)$/, PHY = /^(sword|axe|mace|spear|hammer|bow|dagger|firearm)$/;
  const S = window.Magia653 = { on: true, hold: HOLD, tick: TICK, stats: { taps: 0, starts: 0, ticks: 0, hits: 0, dmg: 0, paid: 0, stops: {} }, last: null };
  const now = () => performance.now() / 1000;
  let press = null, stream = null, tapFire = false, pendingTap = 0, warnT = -9;

  /* ---------- quando vale ---------- */
  function wk() { try { return weaponKind272(run.equip.w) || '' } catch (_) { return '' } }
  function magicMode() {
    if (!S.on || (typeof touch !== 'undefined' && touch) || typeof run === 'undefined' || !run || !player) return false;
    try { if (window.Firearms372 && Firearms372.isGun(run.equip.w)) return false } catch (_) { }
    try { const k = kitState111(); if (k.form && rareActive103(15) && kitForms111().includes(k.form)) return false } catch (_) { }
    const k = wk(); if (PHY.test(k)) return false;
    let ci; try { ci = basicAttackId() } catch (_) { return false }
    try { if (MELEE_MAGIC297.includes(ci)) return false } catch (_) { }
    if (MAG.test(k)) return true;
    try { return basicIsMagic() } catch (_) { return false }
  }
  S.magicMode = magicMode;
  function barred() {
    try { if (typeof inConversation === 'function' && inConversation()) return 'conversa' } catch (_) { }
    try { if (typeof isCinematic451 === 'function' && isCinematic451()) return 'cena' } catch (_) { }
    try { if (window.Cogu348 && Cogu348.asleep(player)) return 'dormindo' } catch (_) { }
    try { if (typeof modalOpen !== 'undefined' && modalOpen) return 'janela' } catch (_) { }
    try { if (window.Guard472 && Guard472.blocking && Guard472.blocking()) return 'defesa' } catch (_) { }
    try { if (run && run.mounted) return 'montaria' } catch (_) { }
    try { if (window.Living372 && Living372.riding && Living372.riding()) return 'carona' } catch (_) { }
    return '';
  }

  /* ---------- elemento e cores (as mesmas do projétil da classe) ---------- */
  function ptypeOf(ci) { const c = CLASSES[ci] || {}; return c.pt ? c.pt : c.n === 'Mago Elemental' ? 'fire' : c.n === 'Paladino' ? 'holy' : c.n === 'Necromante' ? 'soul' : 'orb'; }
  const SPARK = [11, 18], VOID = [7, 20];
  function look(ci) {
    const pt = ptypeOf(ci), c = CLASSES[ci] || {}, base = (c.sk && c.sk[0] && c.sk[0].col) || 0x9fb8ff;
    let rec = null; try { rec = window.Golpes487 && Golpes487.referenceRecipes.find(r => r.id === ci) } catch (_) { }
    const dark = new T.Color(base).multiplyScalar(.45).getHex();
    let col = rec && rec.col ? rec.col.slice() : [0xffffff, base, dark];
    let kind = 'beam', look_ = 'arcane';
    if (pt === 'fire') { kind = 'cone'; look_ = 'fire'; col = [0xfff2c0, 0xff8a20, 0xc01a00]; }
    else if (pt === 'ice') { kind = 'cone'; look_ = 'ice'; col = [0xffffff, 0x8fe8ff, 0x2f7dff]; }
    else if (pt === 'stone') { kind = 'cone'; look_ = 'stone'; col = [0xfff0c0, 0xd8a060, 0x6a4020]; }
    else if (pt === 'spark' || SPARK.includes(ci)) { look_ = 'spark'; col = [0xffffff, ci === 11 ? 0xfff36b : base, ci === 11 ? 0x5a3cff : dark]; }
    else if (pt === 'soul' || VOID.includes(ci)) { look_ = 'void'; col = [0xf0e0ff, 0xa26bff, 0x3a0a70]; }
    else if (pt === 'holy') { look_ = 'holy'; col = [0xffffff, 0xffe28a, 0xd08a20]; }
    const elem = { fire: 'fogo', ice: 'gelo', stone: 'terra', spark: 'raio', soul: 'trevas', holy: 'luz' }[pt] || null;
    return { pt, kind, look: look_, col, elem, range: kind === 'cone' ? (look_ === 'stone' ? 5 : 6) : 18, width: look_ === 'stone' ? 1.3 : 1.6 };
  }
  S.look = look;

  /* ---------- mana ---------- */
  function pay(n) {
    try { if (window.Mana642) Mana642.topUp(n) } catch (_) { }
    if ((player.mp || 0) < n) return false;
    player.mp = Math.max(0, Math.floor(player.mp) - n); S.stats.paid += n; return true;
  }
  function noMana() { if (now() - warnT > 1.5) { warnT = now(); try { floater(player.x, player.z, 'SEM MANA', '#60a5fa') } catch (_) { } } }

  /* ---------- dano por quarto de segundo (inteiro) ---------- */
  function tickDamage() {
    let shot = 0, iv = .5;
    try {
      const tm = attackTiming(false); iv = Math.max(.1, tm.interval); shot = player.dmg * tm.damage * basicDmgMul() * (player.buff > 0 ? player.buffMul : 1);
      const over = (window.Surv437 && typeof Surv437.overRatio === 'function') ? Surv437.overRatio() : 1; /* peso excessivo deixa o fluxo mais fraco, como deixa o tiro mais lento */
      if (over > 1) iv *= Math.min(2.5, 1 + (over - 1) * 1.6);
    } catch (_) { shot = player.dmg || 1 }
    return Math.max(0, shot / iv * TICK); /* valor exato; o doTick acumula o resto e só bate números inteiros */
  }

  /* ---------- envoltório do attack() (o mais interno) ---------- */
  const A0 = attack;
  attack = function () {
    if (tapFire) { const cd = player ? player.atkCd : 0, r = A0.apply(this, arguments); if (player && player.atkCd > cd) { S.tapJust = true; if (pay(1)) S.stats.taps++; } return r; }
    if (!magicMode()) return A0.apply(this, arguments);
    if (!player || player.dead || paused) return;
    if (barred()) { if (stream) stop(barred()); return A0.apply(this, arguments); }
    if (typeof mouseHeld === 'undefined' || !mouseHeld) { const cd = player.atkCd, r = A0.apply(this, arguments); if (player.atkCd > cd) { S.tapJust = true; if (pay(1)) S.stats.taps++; } return r; }
    const t = now();
    if (!press) { press = { t0: t, seen: t }; return; }
    press.seen = t;
    if (!stream && t - press.t0 >= HOLD && player.dodgeT <= 0) start();
    if (stream) stream.seen = t;
  };
  addEventListener('mouseup', e => {
    if (e.button !== 0 || !press) return;
    const wasStream = !!stream; press = null;
    if (wasStream) stop('solto');
    else { pendingTap = now() + .6; fireTap(); } /* soltou antes de o fluxo sair (mesmo com o jogo lento) = toque */
  });

  function fireTap() {
    if (!pendingTap || !player || player.dead || paused || player.atkCd > 0) return;
    pendingTap = 0; tapFire = true; try { attack() } finally { tapFire = false }
  }
  function start() {
    if (!pay(1)) { noMana(); return; }
    const ci = basicAttackId(), L_ = look(ci);
    try { L_.range *= 1 + .15 * rankTalent('reach') } catch (_) { }
    stream = { ci, ...L_, carry: 0, full: true, t: 0, acc: 0, drain: 0, seen: now(), dmg: tickDamage(), vfx: null, end: null, dir: new T.Vector3(0, 0, 1), o: new T.Vector3() };
    try { resourceCombat258() } catch (_) { }
    S.stats.starts++;
    try { stream.vfx = makeVfx(stream) } catch (err) { console.warn('magia653 vfx', err) }
  }
  function stop(why) {
    if (!stream) return;
    S.stats.stops[why] = (S.stats.stops[why] || 0) + 1;
    const v = stream.vfx; stream = null;
    if (v) v.release();
  }
  S.stop = stop;

  /* ---------- mira: mesma do projétil (aimPoint / alvo travado / frente) ---------- */
  function aimTarget() {
    try {
      if (window.W377 && W377.target && !W377.target.dead && enemies.includes(W377.target)) { const b = projectileBody253(W377.target); return new T.Vector3(b.x, b.y, b.z); }
      const ap = aimPoint();
      if (ap) {
        if (ap.enemy253) { const b = projectileBody253(ap.enemy253); return new T.Vector3(b.x, b.y, b.z); }
        if (ap.ray388) return new T.Vector3(ap.ray388.x, ap.ray388.y, ap.ray388.z);
        return new T.Vector3(ap.x, ap.y, ap.z);
      }
    } catch (_) { }
    if (window.FP550 && FP550.active) { const d = new T.Vector3(); camera.getWorldDirection(d); return camera.position.clone().addScaledVector(d, 30); }
    let e = null; try { e = faceTarget(16) } catch (_) { }
    if (e) { const b = projectileBody253(e); return new T.Vector3(b.x, b.y, b.z); }
    return null;
  }
  function muzzle(face, pitch) {
    if (window.FP550 && FP550.active) {
      const f = new T.Vector3(); camera.getWorldDirection(f);
      const r = new T.Vector3().crossVectors(f, camera.up).normalize();
      return camera.position.clone().addScaledVector(f, .6).addScaledVector(r, .2).add(new T.Vector3(0, -.24, 0));
    }
    const m = player.m;
    try {
      if (m && m.warrior127 && window.Warrior127) {
        let mz = null;
        const staff = weaponIsMagic173(run.equip.w) && Warrior127.staffMuzzle(m);
        if (staff) { Warrior127.prepareStaffCast(m, { face, combo: 1, pitch253: pitch }); mz = Warrior127.staffMuzzle(m); }
        else mz = Warrior127.handMuzzle(m, { face, combo: 1, pitch253: pitch });
        if (mz) return new T.Vector3(mz.x, mz.y + (window.TER245 ? TER245.heightFor(m.root) : terrH(player.x, player.z)), mz.z);
      }
    } catch (_) { }
    return new T.Vector3(player.x + Math.sin(face) * .6, terrH(player.x, player.z) + (player.jy || 0) + 1.25, player.z + Math.cos(face) * .6);
  }
  function aim(st) {
    const tgt = aimTarget();
    let face = player.face, pitch = 0;
    if (tgt && Math.hypot(tgt.x - player.x, tgt.z - player.z) > .8) face = Math.atan2(tgt.x - player.x, tgt.z - player.z);
    if (!(window.FP550 && FP550.active)) player.face = face;
    if (tgt) { const y0 = terrH(player.x, player.z) + (player.jy || 0) + 1.2; pitch = Math.atan2(tgt.y - y0, Math.max(.5, Math.hypot(tgt.x - player.x, tgt.z - player.z))); }
    pitch = Math.max(-1.1, Math.min(1.1, pitch)); player.aimPitch253 = pitch;
    const o = muzzle(face, pitch);
    let d;
    if (window.FP550 && FP550.active && !tgt) { d = new T.Vector3(); camera.getWorldDirection(d); }
    else if (tgt && tgt.distanceTo(o) > 1) d = tgt.clone().sub(o).normalize();
    else d = new T.Vector3(Math.sin(face) * Math.cos(pitch), Math.sin(pitch), Math.cos(face) * Math.cos(pitch));
    st.o.copy(o); st.dir.copy(d);
  }

  /* ---------- quem o fluxo pega ---------- */
  function foes() { return (typeof enemies !== 'undefined' ? enemies : []).filter(e => e && !e.dead && !e.gone && !e.ally && !e.friendly217 && !e.statue); }
  function hitList(st) {
    const out = [], o = st.o, d = st.dir;
    if (st.kind === 'cone') {
      const R = st.range, tan = st.width / R;
      for (const e of foes()) {
        if (Math.hypot(e.x - player.x, e.z - player.z) > R + 4) continue;
        let b; try { b = projectileBody253(e) } catch (_) { b = { x: e.x, y: terrH(e.x, e.z) + 1, z: e.z, r: e.r || .6 } }
        const v = new T.Vector3(b.x - o.x, b.y - o.y, b.z - o.z), along = v.dot(d), rr = (b.r || e.r || .6);
        if (along < -rr || along > R + rr) continue;
        const perp = Math.sqrt(Math.max(0, v.lengthSq() - along * along));
        if (perp > Math.max(.6, along * tan) + rr + .35) continue;
        try { if (typeof los === 'function' && !los(player.x, player.z, e.x, e.z)) continue } catch (_) { }
        out.push(e);
      }
      st.end = o.clone().addScaledVector(d, R);
      return out;
    }
    // feixe: o primeiro inimigo na linha; chão e paredes cortam
    let max = st.range, best = null;
    try { const g = Projectiles253.aimTerrainRay({ origin: o, direction: d }, terrH, st.range); if (g && g.hit !== false && Number.isFinite(g.t)) max = Math.min(max, Math.max(.5, g.t * st.range)); } catch (_) { }
    const maxG = max;
    for (const e of foes()) {
      if (Math.hypot(e.x - player.x, e.z - player.z) > st.range + 6) continue;
      let b; try { b = projectileBody253(e) } catch (_) { continue }
      const h = Projectiles253.intersectRayCapsule(o, d, b, (b.r || .6) + .25, b.hitHeight, st.range);
      if (h.hit && h.distance < max) { try { if (typeof los === 'function' && !los(player.x, player.z, e.x, e.z)) continue } catch (_) { } max = h.distance; best = e; }
    }
    st.end = o.clone().addScaledVector(d, max); st.target = best;
    let pierce = 0; try { pierce = rankTalent('piercing') } catch (_) { }
    if (best && pierce) { /* talento de perfurar: o feixe passa e pega todos na linha até o chão */
      const all = [];
      for (const e of foes()) { if (Math.hypot(e.x - player.x, e.z - player.z) > st.range + 6) continue; let b; try { b = projectileBody253(e) } catch (_) { continue } const h = Projectiles253.intersectRayCapsule(o, d, b, (b.r || .6) + .25, b.hitHeight, st.range); if (h.hit && h.distance < Math.min(st.range, maxG)) all.push(e); }
      st.end = o.clone().addScaledVector(d, maxG); return all.length ? all : [best];
    }
    return best ? [best] : [];
  }
  function doTick(st) {
    S.stats.ticks++;
    const list = hitList(st);
    let dt0 = null; try { dt0 = curDType281; curDType281 = 'mag' } catch (_) { }
    try { resourceCombat258() } catch (_) { }
    const f0 = window.floater, combo0 = (typeof FX2 !== 'undefined') ? FX2.combo : null;
    st.n = (st.n || 0) + 1;
    if (st.n % 4 === 1) { st.full = true; try { dprog('atk', 1) } catch (_) { } } /* 1 vez por segundo: diária de ataques e efeitos de acerto */
    let vol = 1; try { if (st.kind === 'beam') vol = 1 + rankTalent('volley') } catch (_) { } /* vários projéteis = feixe mais forte */
    st.carry += tickDamage() * vol; const amt = Math.floor(st.carry); st.dmg = amt;
    if (amt < 1 || !list.length) { if (!list.length) st.carry = Math.min(st.carry, 1); try { curDType281 = dt0 } catch (_) { } return; }
    st.carry -= amt;
    const full = st.full; st.full = false;
    const fl = window.Flip470, flOn = fl ? fl.on : null, im = window.Impact459, imOn = im ? im.on : null, quiet = !full; /* clarão do elemento 1 vez por segundo, não 4 */
    const ap0 = typeof applyPassive === 'function' ? applyPassive : null;
    if (quiet && ap0) applyPassive = function () { }; /* passivas com chance por acerto: 1 vez por segundo */
    for (const e of list) {
      const hp = e.hp, had = !!(e.basicDots && e.basicDots.burn);
      if (quiet && e.hp > st.dmg * 6) { if (fl) fl.on = false; if (im) im.on = false; } else { if (fl) fl.on = flOn; if (im) im.on = imOn; } /* quem pode morrer agora recebe o efeito normal */
      if (had) window.floater = function (x, z, txt) { if (txt === 'QUEIMANDO') return; return f0.apply(this, arguments) };
      try { hurtEnemy(e, st.dmg, player.x, player.z, { kb: 0, stun: 0, fromPlayer: true, basicClass: quiet ? undefined : st.ci, ptype300: st.pt, elem300: st.elem, dtype281: 'mag', tick: true, stream653: true }); }
      catch (err) { console.warn('magia653 hit', err) }
      finally { window.floater = f0 }
      if (e.hp < hp) { S.stats.hits++; S.stats.dmg += hp - e.hp; try { if (st.vfx) st.vfx.hit(e) } catch (_) { } }
    }
    if (fl) fl.on = flOn; if (im) im.on = imOn;
    if (quiet && ap0) applyPassive = ap0;
    try { curDType281 = dt0 } catch (_) { }
    if (combo0 != null && list.length && quiet) FX2.combo = Math.max(combo0, FX2.combo - list.length); /* o contador de combo sobe 1 por segundo de fluxo, não 4 */
  }

  /* ---------- efeito: formas 3D que brilham (técnica aprovada, peças do Golpes487) ---------- */
  const NOISE = `float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){return .55*vn(p)+.3*vn(p*2.1+3.)+.15*vn(p*4.3+7.);}`;
  const VS = `varying vec2 vUv;varying vec3 vN;varying vec3 vW;void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`;
  const FS = NOISE + `uniform float uTime,uFade,uSpd,uTurb,uSeed,uGain,uEnd,uBeam,uRep;uniform vec3 uA,uB,uC;varying vec2 vUv;varying vec3 vN;varying vec3 vW;
void main(){float s=vUv.y,a=vUv.x;vec3 V=normalize(cameraPosition-vW);float f=abs(dot(normalize(vN),V));
 float n=fbm(vec2(a*7.+uSeed+sin(s*4.+uTime*2.)*.3*uTurb,s*uRep-uTime*uSpd));
 float n2=fbm(vec2(a*13.-uSeed,s*uRep*2.-uTime*uSpd*1.7));
 float body=pow(f,mix(1.3,.6,uBeam));
 float along=smoothstep(0.,.06,s)*(1.-smoothstep(uEnd-.3,uEnd,s+(n-.5)*.4*uTurb));
 float al=body*along*mix(1.,.2+1.8*n*n2,clamp(uTurb,0.,1.)*.85+.1);
 float heat=(1.-s*.85)*body;
 vec3 c=mix(uC,uB,smoothstep(.1,.8,n*body+.25*(1.-s)));
 c+=uA*pow(heat,3.)*.55+uA*smoothstep(.82,1.,n2)*.35;
 gl_FragColor=vec4(c*uGain,clamp(al*uFade,0.,1.));}`;
  function jetMat(col, o) {
    return new T.ShaderMaterial({
      vertexShader: VS, fragmentShader: FS, transparent: true, depthWrite: false, side: T.DoubleSide, blending: T.AdditiveBlending, toneMapped: false, fog: false,
      uniforms: { uTime: { value: 0 }, uFade: { value: 0 }, uSpd: { value: o.spd }, uTurb: { value: o.turb }, uSeed: { value: Math.random() * 10 }, uGain: { value: o.gain }, uEnd: { value: o.end ?? 1 }, uBeam: { value: o.beam ? 1 : 0 }, uRep: { value: o.rep ?? 6 },
        uA: { value: new T.Color(col[0]) }, uB: { value: new T.Color(col[1]) }, uC: { value: new T.Color(col[2]) } }
    });
  }
  let CONE = null, TUBE = null;
  function geos() {
    if (!CONE) { CONE = new T.CylinderGeometry(1, .07, 1, 28, 18, true); CONE.translate(0, .5, 0); CONE.rotateX(Math.PI / 2); }
    if (!TUBE) { TUBE = new T.CylinderGeometry(1, 1, 1, 16, 24, true); TUBE.translate(0, .5, 0); TUBE.rotateX(Math.PI / 2); }
  }
  const lite = () => { try { return !!GFX267.lite } catch (_) { return false } };
  function makeVfx(st) {
    geos();
    const G = window.Golpes487, X = G && G.fx;
    const grp = new T.Group(); grp.name = 'Magia653'; grp.userData.terrainAbsolute245 = true; grp.frustumCulled = false;
    const layers = [];
    const add = (geo, mat, w, len) => { const m = new T.Mesh(geo, mat); m.frustumCulled = false; m.userData.terrainAbsolute245 = true; m.renderOrder = 5; grp.add(m); const L_ = { m, mat, w, len }; layers.push(L_); return L_; };
    const col = st.col;
    if (st.kind === 'cone') {
      const fire = st.look === 'fire', ice = st.look === 'ice';
      const R = st.range, W = st.width;
      add(CONE, jetMat([col[1], col[1], col[2]], { spd: fire ? 7 : ice ? 4 : 5, turb: fire ? 1 : ice ? .55 : .8, gain: fire ? .34 : .3, rep: 5 }), W, R);
      add(CONE, jetMat(col, { spd: fire ? 10 : ice ? 6 : 7, turb: fire ? .9 : .5, gain: fire ? .45 : .4, rep: 7 }), W * .6, R * .85);
      add(CONE, jetMat([0xffffff, col[0], col[1]], { spd: 13, turb: .5, gain: fire ? .5 : .3, rep: 9 }), W * .22, R * .45);
    } else {
      add(TUBE, jetMat([col[1], col[1], col[2]], { spd: 6, turb: .7, gain: .2, beam: 1, rep: 3, end: 1.02 }), .2, 1);
      add(TUBE, jetMat([col[1], col[1], col[2]], { spd: 10, turb: .55, gain: .42, beam: 1, rep: 5, end: 1.02 }), .09, 1);
      add(TUBE, jetMat([0xffffff, col[1], col[1]], { spd: 16, turb: .25, gain: .6, beam: 1, rep: 8, end: 1.02 }), .035, 1);
    }
    if (X) X.add(grp); else scene.add(grp);
    let handOrb = null, endOrb = null;
    try { if (X) { handOrb = X.orb(new T.Vector3(), st.kind === 'cone' ? .4 : .3, col, { fire: st.look === 'fire' ? 1 : 0, noise: 1 }); if (st.kind === 'beam') endOrb = X.orb(new T.Vector3(), .7, col, { noise: 1 }); } } catch (_) { }
    let fade = 0, dying = false, pt = 0, bt = 0, sm = 0, vis = 1;
    const pieces = [], puffs = [];
    let pf = 0;
    const v = {
      grp, layers,
      update(dt, st2) {
        const t = now();
        fade = dying ? Math.max(0, fade - dt / .2) : Math.min(1, fade + dt / .12);
        const s = st2 || v.lastSt; if (s) v.lastSt = s;
        if (s) {
          camera.getWorldDirection(CAMD); vis = 1 - .7 * Math.pow(Math.abs(CAMD.dot(s.dir)), 2);
          grp.position.copy(s.o); grp.lookAt(s.o.clone().add(s.dir));
          const len = s.kind === 'beam' ? Math.max(.5, s.end ? s.end.distanceTo(s.o) : s.range) : 1;
          for (const L_ of layers) {
            const fl = 1 + Math.sin(t * 31 + L_.w * 13) * .05 + Math.sin(t * 17.3 + L_.len) * .04;
            const grow = s.kind === 'cone' ? Math.min(1, (s.t || 0) / .18 + .25) : 1;
            if (s.kind === 'cone') L_.m.scale.set(L_.w * fl * grow, L_.w * fl * grow, L_.len * grow);
            else L_.m.scale.set(L_.w * fl, L_.w * fl, len);
            L_.mat.uniforms.uTime.value = t; L_.mat.uniforms.uFade.value = fade * vis;
          }
          if (handOrb) { handOrb.position.copy(s.o); handOrb.quaternion.copy(camera.quaternion); handOrb.material.uniforms.uTime.value = t; handOrb.material.uniforms.uFade.value = fade; handOrb.scale.setScalar((s.kind === 'cone' ? .4 : .3) * (1 + Math.sin(t * 25) * .12)); }
          if (endOrb && s.end) { endOrb.position.copy(s.end); endOrb.quaternion.copy(camera.quaternion); endOrb.material.uniforms.uTime.value = t; endOrb.material.uniforms.uFade.value = fade * (s.target ? 1 : .6); endOrb.scale.setScalar(.7 * (1 + Math.sin(t * 19) * .2)); }
          if (!dying && X) {
            pt += dt; bt += dt; sm += dt;
            const k = lite() ? 2 : 1, R = s.kind === 'cone' ? s.range : len;
            pf += dt;
            if (s.kind === 'cone') while (pf > .04 * k) { pf -= .04 * k; puff(X, s); }
            if (s.kind === 'cone' && pt > .045 * k) {
              pt = 0; const f = .25 + Math.random() * .7, p = s.o.clone().addScaledVector(s.dir, R * f);
              p.x += (Math.random() - .5) * s.width * f; p.y += (Math.random() - .5) * s.width * f * .7; p.z += (Math.random() - .5) * s.width * f;
              if (s.look === 'fire') X.embers(p, 1, col[1], .4, .7);
              else shard(X, s, f);
            }
            if (s.kind === 'cone' && sm > .16 * k) { sm = 0; const p = s.o.clone().addScaledVector(s.dir, R * .95); X.smoke(p, 1, s.look === 'fire' ? 0x3a2a22 : s.look === 'ice' ? 0xd8f4ff : 0x8a6a48, 1, .9, 1.2, s.look === 'ice' ? .3 : .22); }
            if (s.kind === 'beam' && s.look === 'spark' && bt > .07) { bt = 0; X.bolt(s.o, s.end || s.o.clone().addScaledVector(s.dir, R), col, { width: .09, life: .11, jit: .5, gain: .85, seg: Math.max(6, Math.min(16, Math.round(R))) }); }
            if (s.kind === 'beam' && s.look === 'void' && sm > .12 * k) { sm = 0; const p = s.o.clone().addScaledVector(s.dir, R * Math.random()); X.smoke(p, 1, 0x2a0a4a, .4, .8, .7, .3); }
            if (s.kind === 'beam' && s.look !== 'spark' && bt > .09 * k) { bt = 0; const p = s.o.clone().addScaledVector(s.dir, R * Math.random()); X.sparks(p, 1, col[1], 1.2, 0, .14, .35); }
          }
        }
        for (let i = pieces.length - 1; i >= 0; i--) { const q = pieces[i]; q.t += dt; q.m.position.addScaledVector(q.v, dt); q.m.rotation.x += dt * q.sp; q.m.rotation.y += dt * q.sp * .7; const k2 = q.t / q.life; if (q.m.material.uniforms && q.m.material.uniforms.uFade) q.m.material.uniforms.uFade.value = Math.max(0, 1 - k2 * k2); q.m.material.uniforms && q.m.material.uniforms.uTime && (q.m.material.uniforms.uTime.value = t); if (k2 >= 1) { scene.remove(q.m); q.m.material.dispose(); pieces.splice(i, 1); } }
        for (let i = puffs.length - 1; i >= 0; i--) {
          const q = puffs[i]; q.t += dt; const k2 = q.t / q.life;
          if (k2 >= 1) { killPuff(q); puffs.splice(i, 1); continue; }
          const ease = 1 - Math.pow(1 - k2, 1.6);
          q.m.position.copy(q.a).addScaledVector(q.d, q.R * ease).addScaledVector(q.side, q.R * ease * .9); q.m.position.y += q.rise * k2 * k2;
          const sz = q.s0 + (q.s1 - q.s0) * ease; q.m.scale.setScalar(sz);
          const env = Math.min(1, k2 / .1) * Math.pow(1 - k2, 1.4);
          if (q.orb) { q.m.quaternion.copy(camera.quaternion); q.m.material.uniforms.uTime.value = t + q.seed; q.m.material.uniforms.uFade.value = env * q.op * vis * (dying ? Math.max(.2, fade) : 1); }
          else q.m.material.opacity = env * q.op;
        }
        if (dying && fade <= 0 && !pieces.length && !puffs.length) { v.dispose(); return false; }
        return true;
      },
      hit(e) {
        if (!X) return; let b; try { b = projectileBody253(e) } catch (_) { return }
        const p = new T.Vector3(b.x, b.y, b.z), c2 = v.lastSt ? v.lastSt.col : col, look_ = v.lastSt ? v.lastSt.look : 'arcane';
        X.sparks(p, lite() ? 2 : 4, c2[1], 3, 5, .15, .35);
        if (look_ === 'fire') X.embers(p, 2, c2[1], .6, .8);
        else if (look_ === 'spark' || look_ === 'holy' || look_ === 'arcane') X.ringFace(p, c2[1], .2, 1.1, .22);
      },
      release() { dying = true; },
      dispose() {
        if (v.dead) return; v.dead = true;
        if (grp.parent) grp.parent.remove(grp);
        for (const L_ of layers) L_.mat.dispose();
        for (const o of [handOrb, endOrb]) if (o) { if (o.parent) o.parent.remove(o); try { o.material.dispose(); o.geometry.dispose() } catch (_) { } }
        for (const q of pieces) { scene.remove(q.m); q.m.material.dispose(); } pieces.length = 0;
        for (const q of puffs) killPuff(q); puffs.length = 0;
        const i = dyingList.indexOf(v); if (i >= 0) dyingList.splice(i, 1);
      }
    };
    function puff(X_, s) {
      if (puffs.length > (lite() ? 18 : 34)) return;
      const fire = s.look === 'fire', ice = s.look === 'ice';
      const side = new T.Vector3(Math.random() - .5, (Math.random() - .5) * .6, Math.random() - .5);
      side.addScaledVector(s.dir, -side.dot(s.dir)); side.multiplyScalar(2 * s.width / s.range * Math.random());
      const a = s.o.clone().addScaledVector(s.dir, .15), R = s.range * (.82 + Math.random() * .2);
      let m, orb = true;
      if (fire || ice) {
        const c = fire ? (Math.random() < .15 ? [0xffc070, 0xff8a20, 0xb02006] : [0xff8a30, 0xff4a08, 0x6a0800]) : (Math.random() < .3 ? [0xffffff, 0xc8f0ff, 0x4a90e0] : [0xb0e8ff, 0x60b8f8, 0x1a48a0]);
        m = X_.orb(a.clone(), .3, c, { fire: fire ? 1 : 0, noise: 1 });
      } else { orb = false; m = X_.sprite(X_.softTex, a.clone(), .3, { color: Math.random() < .5 ? 0xb08a5a : 0xd8b888, normal: true, op: 0 }); }
      m.userData.terrainAbsolute245 = true; m.renderOrder = 6;
      puffs.push({ m, orb, a, d: s.dir.clone(), side, R, t: 0, life: (fire ? .42 : ice ? .5 : .55) + Math.random() * .12, s0: fire ? .25 : .2, s1: (fire ? 1.6 : ice ? 1.4 : 1.8) * (.75 + Math.random() * .4), rise: fire ? .7 : ice ? -.15 : .1, seed: Math.random() * 9, op: fire ? .3 : ice ? .28 : .45 });
    }
    function killPuff(q) { if (q.m.parent) q.m.parent.remove(q.m); try { q.m.material.dispose(); if (q.orb) q.m.geometry.dispose(); } catch (_) { } q.m.userData.dead487 = true; }
    function shard(X_, s, f) {
      if (pieces.length > (lite() ? 14 : 30)) return;
      const pal = s.look === 'ice' ? 'ice' : 'stone', geo = X_.GEOS[(Math.random() * X_.GEOS.length) | 0];
      const m = new T.Mesh(geo, X_.crystalMat(pal)); m.userData.terrainAbsolute245 = true; m.frustumCulled = false;
      const sc = s.look === 'ice' ? .1 + Math.random() * .1 : .08 + Math.random() * .1; m.scale.set(sc, sc * 1.8, sc);
      m.position.copy(s.o).addScaledVector(s.dir, .3);
      const sp = new T.Vector3((Math.random() - .5), (Math.random() - .5) * .7, (Math.random() - .5)).multiplyScalar(s.width * .9);
      const vel = s.dir.clone().multiplyScalar(s.range / .55).add(sp);
      m.material.toneMapped = false; m.material.fog = false;
      X_.add(m); pieces.push({ m, v: vel, t: 0, life: .5 + Math.random() * .12, sp: 6 + Math.random() * 8 });
    }
    dyingList.push(v);
    return v;
  }
  const dyingList = [], CAMD = new T.Vector3();

  /* ---------- laço ---------- */
  const U0 = update;
  update = function (dt) {
    const mp0 = player ? player.mp : 0;
    const res = U0.apply(this, arguments);
    try { step(dt, mp0) } catch (err) { console.warn('magia653', err) }
    return res;
  };
  function step(dt, mp0) {
    const t = now();
    if (pendingTap) {
      if (t > pendingTap || !player || player.dead) pendingTap = 0;
      else fireTap();
    }
    if (press && (typeof mouseHeld === 'undefined' || !mouseHeld)) { press = null; if (stream) stop('solto'); }
    if (stream) {
      const st = stream;
      if (!player || player.dead) stop('morte');
      else if (paused) stop('pausa');
      else if (barred()) stop(barred());
      else if (t - st.seen > .2) stop('barrado');
      else if (player.dodgeT > 0) stop('rolagem');
      else if (!magicMode()) stop('arma');
      if (stream) {
        st.t += dt;
        if (player.mp > mp0 && player.mp - mp0 <= dt * 10) player.mp = mp0; /* sem regenerar enquanto o fluxo sai (poção continua valendo) */
        st.drain += dt;
        while (st.drain >= 1 && stream) { st.drain -= 1; if (!pay(1)) { noMana(); stop('sem mana'); } }
        if (stream) {
          aim(st);
          player.comboT = 0;
          st.acc += dt;
          if (st.t <= dt + 1e-6) { st.acc = 0; doTick(st); }
          while (st.acc >= TICK && stream) { st.acc -= TICK; doTick(st); }
          if (!st.end) hitList(st);
          S.last = { ci: st.ci, kind: st.kind, look: st.look, dmg: st.dmg, mp: player.mp, t: st.t };
        }
      }
    }
    for (let i = dyingList.length - 1; i >= 0; i--) { const v = dyingList[i]; if (v.update(dt, v === (stream && stream.vfx) ? stream : null) === false) { /* já saiu */ } }
  }
  S.state = () => ({ press: !!press, stream: stream ? { ci: stream.ci, kind: stream.kind, look: stream.look, dmg: stream.dmg, t: stream.t, target: !!stream.target } : null, pendingTap: !!pendingTap, vfx: dyingList.length });
})();
