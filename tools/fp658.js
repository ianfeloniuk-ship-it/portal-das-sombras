/* ============================================================================
 * PRIMEVA v660 — PRIMEIRA PESSOA COMO NO SKYRIM (pedido de Ian, 28/10/2026)
 * Arquivo: tools/fp658.js (carregado depois de tools/fp550.js)
 *
 * Como o Skyrim faz: a 1ª pessoa não entorta o corpo da 3ª pessoa. Ela tem braços próprios
 * presos à câmera. Aqui os braços são uma cópia dos antebraços e das mãos do próprio Viajante
 * (mesma malha, mesmas roupas e luvas, ossos próprios + ossos nos dedos), e o corpo de 3ª
 * pessoa fica escondido enquanto a câmera está nos olhos.
 *
 *  - Poses por arma (espada/machado/maça, adaga, lança, cajado, arco, mãos vazias, magia).
 *  - Golpe 1 da direita para a esquerda, golpe 2 de volta (alternados, como no Skyrim);
 *    golpe forte (segurar e soltar) com preparo alto; andando para a frente o forte é estocada.
 *  - Defesa (botão do meio): arma atravessada na frente; com escudo, o escudo sobe.
 *  - Arco: arco na mão ESQUERDA; ao segurar o ataque a mão direita pega a flecha, encaixa
 *    e puxa a corda até o rosto; a flecha fica alinhada com a mira; soltar dispara.
 *  - Arma guardada: as mãos saem da tela (Skyrim não mostra as mãos com a arma guardada).
 *  - Andar balança as mãos, correr abaixa a arma, girar a câmera atrasa as mãos (inércia).
 *  - Campo de visão igual ao do Skyrim nas duas câmeras (src/core/070-three.js, 59,9° na vertical).
 *  - Mira: em 1ª pessoa o ataque vai para o centro da tela (a mira), sem limite de altura.
 * ============================================================================ */
(function(global){
  'use strict';
  const FP = global.FP550;
  if(!FP || typeof THREE === 'undefined') return;
  const T = THREE;
  const VM = FP.vm658 = { model: null, src: null, sig: '', arms: {}, wep: null, wepKey: '', bow: null, sh: null, shKey: '', arrow: null, string: null, ready: false };
  const S = FP.st658 = { swing: null, nSwing: 0, lastCd: 0, lastWind: 0, lastDraw: 0, release: 0, t: 0, sp: 0, ph: 0, run: 0, sway: [0, 0], lastYaw: null, lastPitch: null, lift: 0, cur: null };
  const ez = t => t * t * (3 - 2 * t);
  const clamp01 = x => Math.max(0, Math.min(1, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const L3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  const N3 = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };

  /* ---------------- mãos: ossos nos dedos (mesmo método da v570, agora na cópia da 1ª pessoa) ---------------- */
  const LANES = ['idx', 'mid', 'rng', 'pky'];
  const LANE_Z = [[0.044, 9], [0.025, 0.044], [0.006, 0.025], [-9, 0.006]];
  const JOINT_U = [0.052, 0.082, 0.102];
  const WRIST = { r: [-0.3662, 0.7118, 0.0106], l: [0.3662, 0.7118, 0.0106] };
  const HAND_PART = { r: 'tripo_part_7', l: 'tripo_part_8' }, ARM_PART = { r: 'tripo_part_1', l: 'tripo_part_2' };
  const smooth = (e0, e1, x) => { const t = clamp01((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };

  function rigFingers(side, part, hb){
    const sk = part.skeleton, hi = sk.bones.indexOf(hb);
    if(hi < 0) return null;
    const wrist = new T.Vector3(...WRIST[side]), dirX = side === 'r' ? -1 : 1;
    const bones = [], inverses = [];
    const addBone = (name, parent, parentBindInv, pos) => {
      const b = new T.Bone(); b.name = 'fp658_' + side + '_' + name;
      const bind = new T.Matrix4().makeTranslation(pos.x, pos.y, pos.z);
      parentBindInv.clone().multiply(bind).decompose(b.position, b.quaternion, b.scale);
      b.userData.rest = b.quaternion.clone();
      parent.add(b);
      const inv = bind.clone().invert();
      bones.push(b); inverses.push(inv);
      return { bone: b, bindInv: inv };
    };
    const zc = [0.054, 0.034, 0.015, -0.003];
    LANES.forEach((ln, li) => {
      let parent = hb, pInv = sk.boneInverses[hi];
      JOINT_U.forEach((u, ji) => { const r = addBone(ln + (ji + 1), parent, pInv, new T.Vector3(wrist.x + dirX * u, wrist.y - 0.004, zc[li])); parent = r.bone; pInv = r.bindInv; });
    });
    const nb = sk.bones.length;
    const skel = new T.Skeleton(sk.bones.concat(bones), sk.boneInverses.concat(inverses));
    const g = part.geometry.clone(), PA = g.attributes.position, SIA = g.attributes.skinIndex, SWA = g.attributes.skinWeight;
    const n = PA.count, si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
    for(let v = 0; v < n; v++){
      const os = [SIA.getX(v), SIA.getY(v), SIA.getZ(v), SIA.getW(v)], ow = [SWA.getX(v), SWA.getY(v), SWA.getZ(v), SWA.getW(v)];
      const x = PA.getX(v), z = PA.getZ(v), u = (x - wrist.x) * dirX;
      let handShare = 0; const others = [];
      for(let k = 0; k < 4; k++){ if(os[k] === hi) handShare += ow[k]; else if(ow[k] > 0) others.push([os[k], ow[k]]); }
      if(handShare > 0.001 && u > 0.04){
        const lw = LANES.map((_, li) => { const [z0, z1] = LANE_Z[li]; return smooth(z0 - 0.014, z0 + 0.014, z) * (1 - smooth(z1 - 0.014, z1 + 0.014, z)); });
        const ls = lw.reduce((a, b) => a + b, 0) || 1, fingerW = smooth(0.038, 0.068, u), parts = [];
        LANES.forEach((_, li) => {
          const wl = lw[li] / ls * fingerW * handShare; if(wl < 0.004) return;
          const w1 = 1 - smooth(0.068, 0.094, u), w3 = smooth(0.090, 0.114, u), w2 = Math.max(0, 1 - w1 - w3);
          [[0, w1], [1, w2], [2, w3]].forEach(([ji, wj]) => { if(wj > 0.01) parts.push([nb + li * 3 + ji, wl * wj]); });
        });
        parts.push([hi, handShare * (1 - fingerW)]);
        for(const o of others) parts.push(o);
        parts.sort((a, b) => b[1] - a[1]);
        const top = parts.slice(0, 4), tot = top.reduce((a, b) => a + b[1], 0) || 1;
        top.forEach(([bi, w], k) => { si[v * 4 + k] = bi; sw[v * 4 + k] = w / tot; });
      } else for(let k = 0; k < 4; k++){ si[v * 4 + k] = os[k]; sw[v * 4 + k] = ow[k]; }
    }
    g.setAttribute('skinIndex', new T.BufferAttribute(si, 4));
    g.setAttribute('skinWeight', new T.BufferAttribute(sw, 4));
    part.geometry = g; part.bind(skel, part.bindMatrix);
    /* ponto de empunhadura: dentro da palma fechada */
    const anchor = new T.Object3D(); anchor.name = 'fp658_grip_' + side;
    sk.boneInverses[hi].clone().multiply(new T.Matrix4().makeTranslation(wrist.x + dirX * 0.058, wrist.y - 0.022, 0.03)).decompose(anchor.position, anchor.quaternion, anchor.scale);
    hb.add(anchor);
    /* pontas dos dedos indicador e médio (para segurar a corda e a flecha) */
    const tip = new T.Object3D(); tip.name = 'fp658_tip_' + side;
    sk.boneInverses[hi].clone().multiply(new T.Matrix4().makeTranslation(wrist.x + dirX * 0.1, wrist.y - 0.012, 0.03)).decompose(tip.position, tip.quaternion, tip.scale);
    hb.add(tip);
    return { bones, anchor, tip };
  }
  const CURL = [0.95, 1.15, 0.95];
  function curl(R, g, spread){
    const q = new T.Quaternion(), ax = new T.Vector3(0, 0, 1), sgn = R.side === 'r' ? 1 : -1;
    R.fingers.forEach((b, i) => {
      const ji = i % 3, li = i / 3 | 0;
      /* spread: indicador e médio mais abertos que anelar e mindinho (mão da corda) */
      const gi = spread ? (li < 2 ? g * 0.55 : g) : g;
      q.setFromAxisAngle(ax, sgn * CURL[ji] * gi * (0.9 + 0.1 * li / 3));
      b.quaternion.copy(b.userData.rest).multiply(q);
    });
  }

  /* corta da malha do braço o que pertence ao ombro/peito: na 1ª pessoa só aparecem antebraço e mão (como no Skyrim) */
  const ELBOW_CUT = 0.0; /* do cotovelo para cima some (ombro, manga larga e forro vermelho ficavam na frente da tela); o cotovelo fica abaixo da borda */
  function trimArm(mesh, keepBones){
    const g = mesh.geometry.clone(), SI = g.attributes.skinIndex, SW = g.attributes.skinWeight, sk = mesh.skeleton, PA = g.attributes.position;
    const ui = sk.bones.indexOf(keepBones[0]);
    const cutX = (ui >= 0 ? Math.abs(new T.Vector3().setFromMatrixPosition(sk.boneInverses[ui].clone().invert()).x) : 0) + ELBOW_CUT;
    const keep = new Set(keepBones.map(b => sk.bones.indexOf(b)).filter(i => i >= 0));
    const ok = new Uint8Array(SI.count);
    for(let v = 0; v < SI.count; v++){
      let w = 0; const ii = [SI.getX(v), SI.getY(v), SI.getZ(v), SI.getW(v)], ww = [SW.getX(v), SW.getY(v), SW.getZ(v), SW.getW(v)];
      for(let k = 0; k < 4; k++) if(keep.has(ii[k])) w += ww[k];
      ok[v] = w > 0.5 && Math.abs(PA.getX(v)) > cutX ? 1 : 0;
    }
    const src = g.index ? g.index.array : Array.from({ length: SI.count }, (_, i) => i), out = [];
    for(let i = 0; i < src.length; i += 3){ const a = src[i], b = src[i + 1], c = src[i + 2]; if(ok[a] && ok[b] && ok[c]) out.push(a, b, c); }
    g.setIndex(out);
    mesh.geometry = g;
  }

  /* ---------------- cópia dos braços do Viajante ---------------- */
  function gearSig(m){ return (m.gearSignature || '') + '|' + (m.model ? m.model.uuid : ''); }
  function build(){
    const P = global.player, m = P && P.m;
    if(!m || !m.model || !m.bones || !m.bones.hand_r || !T.SkeletonUtils) return false;
    drop();
    m.model.updateMatrixWorld(true);
    const clone = T.SkeletonUtils.clone(m.model);
    /* mapa original → cópia (mesma ordem de travessia) */
    const a = [], b = [];
    m.model.traverse(o => a.push(o)); clone.traverse(o => b.push(o));
    const map = new Map(); a.forEach((o, i) => map.set(o, b[i]));
    const keepSet = new Set();
    const armor = new Set();
    for(const p of (m.armorParts || [])) p.traverse(o => armor.add(o));
    const armBones = new Set(['forearm_r', 'hand_r', 'forearm_l', 'hand_l']);
    const remove = [];
    a.forEach((o, i) => {
      const c = b[i];
      if(o === m.model || o.isBone) return;
      if(o.isSkinnedMesh && (o.name === HAND_PART.r || o.name === HAND_PART.l || o.name === ARM_PART.r || o.name === ARM_PART.l) && o.visible !== false){ keepSet.add(c); return; }
      /* peças de armadura presas no antebraço/mão (luvas, braçadeiras) */
      if(armor.has(o)){ let p = o.parent; while(p && !p.isBone) p = p.parent; if(p && armBones.has(p.name)) { keepSet.add(c); return; } }
      if(o.isMesh || o.isSprite || o.isPoints || o.isLine || o.isLight) remove.push(c);
      else if(o === m.socket || o === m.bowHolder155 || (m.wnodes || []).includes(o)) remove.push(c);
    });
    for(const c of remove) if(c.parent) c.parent.remove(c);
    /* meshes vazias de grupos removidos: some com o que sobrou fora da lista */
    clone.traverse(o => { if(o.isMesh && !keepSet.has(o)) { let k = false, p = o.parent; while(p){ if(keepSet.has(p)) { k = true; break; } p = p.parent; } if(!k) o.visible = false; } });
    const bones = {};
    clone.traverse(o => { if(o.isBone && !bones[o.name]) bones[o.name] = o; });
    let skel = null;
    clone.traverse(o => { if(o.isSkinnedMesh && keepSet.has(o)){ skel = skel || o.skeleton; o.frustumCulled = false; o.castShadow = false; o.receiveShadow = false; o.visible = true; o.renderOrder = 3; } });
    if(!skel) return false;
    skel.pose();
    clone.traverse(o => { if(o.isSkinnedMesh && keepSet.has(o)) o.skeleton.pose(); });
    const arms = {};
    for(const side of ['r', 'l']){
      let hand = null, arm = null;
      clone.traverse(o => { if(o.isSkinnedMesh && keepSet.has(o)){ if(o.name === HAND_PART[side]) hand = o; if(o.name === ARM_PART[side]) arm = o; } });
      if(arm) trimArm(arm, [bones['forearm_' + side], bones['hand_' + side]]);
      const hb = bones['hand_' + side];
      const R = hand ? rigFingers(side, hand, hb) : null;
      const hi = skel.bones.indexOf(hb), fi = skel.bones.indexOf(bones['forearm_' + side]);
      const hq = new T.Quaternion(), fq = new T.Quaternion();
      skel.boneInverses[hi].clone().invert().decompose(new T.Vector3(), hq, new T.Vector3());
      skel.boneInverses[fi].clone().invert().decompose(new T.Vector3(), fq, new T.Vector3());
      arms[side] = { side, ua: bones['upperarm_' + side], fa: bones['forearm_' + side], hd: hb, hq, fq, fingers: R ? R.bones : [], anchor: R ? R.anchor : hb, tip: R ? R.tip : hb, curl: 0.3 };
    }
    /* raiz presa à câmera; o relevo não é somado (userData.terrainAbsolute245) */
    const root = new T.Group(); root.name = 'fp658_viewmodel'; root.userData.terrainAbsolute245 = true; root.userData.terrainRoot245 = true;
    const holder = new T.Group(); holder.add(clone); root.add(holder);
    clone.position.set(0, 0, 0); clone.quaternion.identity();
    holder.rotation.y = Math.PI; /* o Viajante olha para +z; a câmera olha para -z */
    camera.add(root);
    root.updateMatrixWorld(true);
    /* ombros na altura certa em relação aos olhos */
    const sr = bones.upperarm_r.getWorldPosition(new T.Vector3()), sl = bones.upperarm_l.getWorldPosition(new T.Vector3());
    const mid = sr.add(sl).multiplyScalar(0.5); camera.worldToLocal(mid);
    holder.position.set(-mid.x, -0.3 - mid.y, 0.06 - mid.z);
    root.updateMatrixWorld(true);
    VM.model = clone; VM.root = root; VM.bones = bones; VM.arms = arms; VM.src = m; VM.sig = gearSig(m); VM.ready = true; VM.wepKey = ''; VM.shKey = ''; VM.wlKey = '';
    root.visible = false;
    return true;
  }
  function drop(){
    if(VM.root && VM.root.parent) VM.root.parent.remove(VM.root);
    VM.ready = false; VM.model = null; VM.root = null; VM.wep = null; VM.wepKey = ''; VM.wl = null; VM.wlKey = ''; VM.bow = null; VM.sh = null; VM.shKey = '';
  }

  /* ---------------- arma, arco e escudo na mão da 1ª pessoa ---------------- */
  const LEN = { sword: 0.98, axe: 0.78, mace: 0.78, hammer: 0.82, dagger: 0.46, spear: 1.55, staff: 1.2, wand: 0.5, firearm: 0.7, bow: 1.22 };
  function axisInfo(obj){
    obj.updateWorldMatrix(true, true);
    const inv = obj.matrixWorld.clone().invert(), box = new T.Box3();
    obj.traverse(o => { if(o.isMesh && o.geometry){ o.geometry.computeBoundingBox(); const bb = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld).applyMatrix4(inv); box.union(bb); } });
    const sz = box.getSize(new T.Vector3()), c = box.getCenter(new T.Vector3());
    const k = sz.x >= sz.y && sz.x >= sz.z ? 'x' : sz.y >= sz.z ? 'y' : 'z';
    const ax = new T.Vector3(); ax[k] = (Math.abs(box.max[k]) >= Math.abs(box.min[k])) ? 1 : -1;
    /* segundo eixo (gume/face larga) */
    const rest = ['x', 'y', 'z'].filter(q => q !== k).sort((p, q) => sz[q] - sz[p]);
    const ed = new T.Vector3(); ed[rest[0]] = 1;
    return { ax, ed, len: sz[k], box, c, k };
  }
  function weaponKind(){ try { return (global.player && global.player.m && global.player.m.kind195) || weaponKind272(typeof run !== 'undefined' && run.equip && run.equip.w) || null; } catch(_) { return null; } }
  function syncWeapon(){
    const m = VM.src, kind = weaponKind();
    const srcObj = kind === 'bow' ? (m.bowHolder155 && m.bowHolder155.children[0]) : (m.socket && m.socket.children[0]);
    const key = srcObj ? srcObj.uuid + ':' + kind : 'none';
    if(key === VM.wepKey) return;
    VM.wepKey = key;
    if(VM.wep && VM.wep.parent) VM.wep.parent.remove(VM.wep);
    VM.wep = null; VM.bow = null;
    if(!srcObj) return;
    const copy = srcObj.isSkinnedMesh || hasSkin(srcObj) ? T.SkeletonUtils.clone(srcObj) : srcObj.clone(true);
    copy.traverse(o => { if(o.isMesh){ o.frustumCulled = false; o.castShadow = false; o.visible = true; o.renderOrder = 3; } });
    copy.position.set(0, 0, 0); copy.quaternion.identity(); copy.scale.set(1, 1, 1);
    const wrap = new T.Group(), inner = new T.Group(); inner.add(copy); wrap.add(inner);
    const info = axisInfo(copy);
    /* mesmo tamanho da arma na 3ª pessoa (só um teto, se algum modelo vier gigante) */
    srcObj.updateWorldMatrix(true, false);
    const ws3 = srcObj.getWorldScale(new T.Vector3()).x || 1, maxL = LEN[kind] ? LEN[kind] * 1.15 : 1.2;
    const s = Math.min(ws3, maxL / Math.max(0.05, info.len)), L = info.len * s;
    inner.scale.setScalar(s);
    if(kind === 'bow'){
      /* arco: o cabo (meio do arco, do lado do alvo) na palma; eixo do arco = polegar; a corda (pontas) fica para o seu lado */
      const bp = bowPoints(copy, info);
      inner.position.copy(bp.grip).multiplyScalar(-s);
      VM.bow = { wrap, inner, info, s, top: bp.top, bot: bp.bot, strSide: bp.strSide };
      VM.arms.l.anchor.add(wrap);
    } else {
      const grip = kind === 'staff' ? info.c.clone().addScaledVector(info.ax, -info.len * 0.22) : (kind === 'spear' ? info.c.clone().addScaledVector(info.ax, -info.len * 0.12) : new T.Vector3());
      inner.position.copy(grip).multiplyScalar(-s);
      VM.arms.r.anchor.add(wrap);
    }
    /* eixo da arma → polegar (+z do modelo); gume → dedos (±x do modelo) */
    const side = kind === 'bow' ? 'l' : 'r', Z = new T.Vector3(0, 0, 1);
    /* arco: o lado da corda vai para trás dos dedos (−dedos); armas: o gume acompanha os dedos */
    const F = new T.Vector3(side === 'r' ? -1 : 1, 0, 0).multiplyScalar(kind === 'bow' ? -1 : 1);
    if(kind === 'bow' && VM.bow) info.ed.copy(VM.bow.strSide);
    const mFrom = new T.Matrix4().makeBasis(info.ax, info.ed, info.ax.clone().cross(info.ed));
    const mTo = new T.Matrix4().makeBasis(Z, F, Z.clone().cross(F));
    const q = new T.Quaternion().setFromRotationMatrix(mTo.multiply(mFrom.transpose()));
    wrap.quaternion.copy(q);
    /* compensa a escala do osso (o modelo do Viajante é 2,14×) */
    wrap.updateWorldMatrix(true, false);
    const ws = wrap.parent.getWorldScale(new T.Vector3()).x || 1;
    wrap.scale.setScalar(1 / ws);
    VM.wep = wrap; VM.wepInfo = info; VM.wepKind = kind; VM.wepLen = L;
  }
  /* v662: arma da mão esquerda (dupla empunhadura), copiada da que tools/maos662.js montou na 3ª pessoa */
  function syncLeftWeapon(){
    const M = global.Maos662, src = M && M.leftSrc && typeof run !== 'undefined' && run.equip && run.equip.wl ? M.leftSrc : null;
    const key = src ? src.obj.uuid : 'none';
    if(key === VM.wlKey) return;
    VM.wlKey = key;
    if(VM.wl && VM.wl.parent) VM.wl.parent.remove(VM.wl);
    VM.wl = null; if(!src) return;
    const copy = hasSkin(src.obj) ? T.SkeletonUtils.clone(src.obj) : src.obj.clone(true);
    copy.traverse(o => { if(o.isMesh){ o.frustumCulled = false; o.castShadow = false; o.visible = true; o.renderOrder = 3; } });
    copy.position.set(0, 0, 0); copy.quaternion.identity(); copy.scale.set(1, 1, 1);
    const wrap = new T.Group(), inner = new T.Group(); inner.add(copy); wrap.add(inner);
    const info = axisInfo(copy), kind = src.kind, maxL = LEN[kind] ? LEN[kind] * 1.15 : 1.2;
    const sc = Math.min(src.ws || 1, maxL / Math.max(0.05, info.len));
    inner.scale.setScalar(sc);
    const grip = kind === 'staff' ? info.c.clone().addScaledVector(info.ax, -info.len * 0.22) : new T.Vector3();
    inner.position.copy(grip).multiplyScalar(-sc);
    VM.arms.l.anchor.add(wrap);
    const Z = new T.Vector3(0, 0, 1), F = new T.Vector3(1, 0, 0);
    const mFrom = new T.Matrix4().makeBasis(info.ax, info.ed, info.ax.clone().cross(info.ed)), mTo = new T.Matrix4().makeBasis(Z, F, Z.clone().cross(F));
    wrap.quaternion.setFromRotationMatrix(mTo.multiply(mFrom.transpose()));
    wrap.updateWorldMatrix(true, false);
    wrap.scale.setScalar(1 / (wrap.parent.getWorldScale(new T.Vector3()).x || 1));
    VM.wl = wrap; VM.wlKind = kind;
  }
  /* pontas do arco (onde a corda prende) e cabo, medidos nos vértices: o modelo do arco não tem corda */
  function bowPoints(obj, info){
    obj.updateWorldMatrix(true, true);
    const inv = obj.matrixWorld.clone().invert(), k = info.k, ed = ['x', 'y', 'z'].find(q => info.ed[q]);
    const lo = info.box.min[k], hi = info.box.max[k], L = hi - lo, v = new T.Vector3();
    let gs = new T.Vector3(), gn = 0, top = null, bot = null, tS = -1e9, bS = -1e9, side = 0;
    obj.traverse(o => { if(!o.isMesh) return; const P = o.geometry.attributes.position, M = inv.clone().multiply(o.matrixWorld);
      for(let i = 0; i < P.count; i++){ v.fromBufferAttribute(P, i).applyMatrix4(M); const u = (v[k] - lo) / L;
        if(Math.abs(u - 0.5) < 0.08){ gs.add(v); gn++; }
        if(u > 0.96){ side += v[ed]; } if(u < 0.04){ side += v[ed]; } } });
    const grip = gn ? gs.multiplyScalar(1 / gn) : info.c.clone();
    /* lado da corda = para onde as pontas se curvam em relação ao cabo */
    const sgn = Math.sign(side - grip[ed] * 0) || 1, strSide = new T.Vector3(); strSide[ed] = (side >= 0 ? 1 : -1);
    obj.traverse(o => { if(!o.isMesh) return; const P = o.geometry.attributes.position, M = inv.clone().multiply(o.matrixWorld);
      for(let i = 0; i < P.count; i++){ v.fromBufferAttribute(P, i).applyMatrix4(M); const u = (v[k] - lo) / L, sc = v[ed] * strSide[ed];
        if(u > 0.93 && sc + u > tS){ tS = sc + u; top = v.clone(); } if(u < 0.07 && sc + (1 - u) > bS){ bS = sc + (1 - u); bot = v.clone(); } } });
    VM.bowTmp = { strSide };
    return { grip, top: top || info.c.clone().setComponent(['x','y','z'].indexOf(k), hi), bot: bot || info.c.clone().setComponent(['x','y','z'].indexOf(k), lo), strSide, sgn };
  }
  function hasSkin(o){ let s = false; o.traverse(c => { if(c.isSkinnedMesh) s = true; }); return s; }
  function syncShield(){
    const m = VM.src; let src = null;
    try { if(global.Guard472 && Guard472.hasShield && Guard472.hasShield() && m.bones.hand_l) m.bones.hand_l.traverse(o => { if(!src && o !== m.bones.hand_l && o.parent === m.bones.hand_l && o.children.length && o !== m.bowHolder155 && o.name !== 'palm662_l') src = o; }); } catch(_) {}
    const key = src ? src.uuid : 'none';
    if(key === VM.shKey) return; VM.shKey = key;
    if(VM.sh && VM.sh.parent) VM.sh.parent.remove(VM.sh);
    VM.sh = null; if(!src) return;
    const copy = src.clone(true); copy.position.set(0, 0, 0); copy.quaternion.identity(); copy.scale.set(1, 1, 1);
    copy.traverse(o => { if(o.isMesh){ o.frustumCulled = false; o.castShadow = false; o.renderOrder = 3; } });
    const wrap = new T.Group(), inner = new T.Group(); inner.add(copy); wrap.add(inner);
    const info = axisInfo(copy), s = 0.62 / Math.max(0.05, info.len);
    inner.scale.setScalar(s); inner.position.copy(info.c).multiplyScalar(-s);
    VM.arms.l.anchor.add(wrap);
    wrap.updateWorldMatrix(true, false); wrap.scale.setScalar(1 / (wrap.parent.getWorldScale(new T.Vector3()).x || 1));
    VM.sh = wrap; VM.shInfo = info;
  }

  /* flecha encaixada e corda do arco (só existem na 1ª pessoa) */
  function arrowMesh(){
    if(VM.arrow) return VM.arrow;
    const g = new T.Group(); g.name = 'fp658_arrow';
    const wood = new T.MeshStandardMaterial({ color: 0x8a5a32, roughness: 0.7 }), iron = new T.MeshStandardMaterial({ color: 0xb8c0c8, roughness: 0.3, metalness: 0.8 }), fea = new T.MeshStandardMaterial({ color: 0xe8e2d6, roughness: 0.9, side: T.DoubleSide });
    const shaft = new T.Mesh(new T.CylinderGeometry(0.0045, 0.0045, 0.72, 6), wood); shaft.rotation.x = Math.PI / 2; shaft.position.z = -0.36; g.add(shaft);
    const head = new T.Mesh(new T.ConeGeometry(0.012, 0.055, 4), iron); head.rotation.x = -Math.PI / 2; head.position.z = -0.745; g.add(head);
    for(let i = 0; i < 3; i++){ const f = new T.Mesh(new T.PlaneGeometry(0.018, 0.09), fea); f.position.set(0, 0, -0.06); f.rotation.set(Math.PI / 2, i * Math.PI * 2 / 3, 0); f.translateX(0.009); g.add(f); }
    g.traverse(o => { if(o.isMesh){ o.renderOrder = 3; o.frustumCulled = false; } });
    g.userData.terrainAbsolute245 = true; g.userData.terrainRoot245 = true; g.visible = false;
    camera.add(g); VM.arrow = g; return g;
  }
  function stringMesh(){
    if(VM.string) return VM.string;
    const mat = new T.MeshBasicMaterial({ color: 0xd9d2c0 });
    const mk = () => { const c = new T.Mesh(new T.CylinderGeometry(0.0016, 0.0016, 1, 4), mat); c.renderOrder = 3; c.frustumCulled = false; return c; };
    const g = new T.Group(); g.add(mk(), mk()); g.userData.terrainAbsolute245 = true; g.userData.terrainRoot245 = true; g.visible = false;
    camera.add(g); VM.string = g; return g;
  }
  const tmpA = new T.Vector3(), tmpB = new T.Vector3(), tmpC = new T.Vector3(), UPY = new T.Vector3(0, 1, 0);
  function segment(mesh, a, b){ tmpC.copy(b).sub(a); const l = tmpC.length(); mesh.position.copy(a).addScaledVector(tmpC, 0.5); mesh.scale.set(1, Math.max(1e-4, l), 1); mesh.quaternion.setFromUnitVectors(UPY, tmpC.normalize()); }

  /* ---------------- poses (espaço da câmera: +x direita, +y cima, -z frente) ----------------
     p = punho · f = direção dos dedos esticados (= gume da arma) · t = lado do polegar (= lâmina/eixo da arma) · c = fechar a mão */
  const P = (p, f, t, c, e) => ({ p, f: N3(f), t: N3(t), c, e: e || null }); /* e = para onde o cotovelo aponta */
  const POSE = {
    /* uma mão: espada/machado/maça/martelo (Skyrim: arma embaixo à direita, lâmina subindo para o centro) */
    m_r: P([0.22, -0.2, -0.48], [0.3, 0.55, -0.75], [-0.35, 0.78, -0.5], 1),
    m_l: P([-0.3, -0.25, -0.46], [0.25, 0.1, -1], [0.3, 1, 0.1], 0.6),
    m_blk_r: P([0.14, -0.1, -0.45], [0.05, 0.75, -0.65], [-1, 0.18, -0.25], 1),
    dg_r: P([0.22, -0.2, -0.46], [0.25, 0.35, -0.9], [-0.25, 0.55, -0.8], 1),
    sp_r: P([0.2, -0.21, -0.44], [0.35, 0.8, -0.3], [-0.12, 0.3, -0.95], 1),
    st_r: P([0.2, -0.17, -0.5], [0.35, 0.88, -0.2], [-0.1, 0.42, -0.9], 1),
    /* mãos vazias: punhos erguidos (Skyrim) */
    f_r: P([0.19, -0.16, -0.46], [0, 0.1, -1], [-0.45, 0.9, 0], 1),
    f_l: P([-0.19, -0.16, -0.46], [0, 0.1, -1], [0.45, 0.9, 0], 1),
    /* magia nas mãos: palmas abertas, um pouco à frente */
    mg_r: P([0.22, -0.2, -0.48], [-0.15, 0.35, -0.95], [-0.55, 0.6, -0.1], 0.25),
    mg_l: P([-0.22, -0.2, -0.48], [0.15, 0.35, -0.95], [0.55, 0.6, -0.1], 0.25),
    /* arco: arco na esquerda inclinado, mão direita baixa */
    b_l: P([-0.17, -0.19, -0.5], [0.35, 0.15, -1], [0.5, 0.85, -0.15], 1),
    b_r: P([0.2, -0.22, -0.42], [-0.2, 0.3, -0.95], [-0.5, 0.75, 0], 0.5),
    /* arco puxado: braço esquerdo esticado, arco quase de pé à esquerda da mira; mão direita no rosto */
    bd_l: P([-0.12, -0.14, -0.47], [0.18, 0.02, -1], [0.14, 1, 0.02], 1, [0.6, -1, 0]),
    bd_r: P([0.1, -0.19, 0.07], [-0.6, 0.12, -0.8], [-0.05, 1, 0], 0.62, [1, 0.25, 0.9]),
    /* encaixar a flecha (a mão direita vai até o arco) */
    bn_r: P([-0.02, -0.11, -0.42], [-0.35, 0.05, -0.95], [-0.05, 1, 0], 0.62),
    bq_r: P([0.28, -0.42, -0.12], [0, -0.6, -0.8], [-0.4, 0.2, -0.6], 0.6),
    /* guardada: fora da tela */
    down_r: P([0.3, -0.65, -0.25], [0.2, 0.2, -1], [-0.3, 0.9, 0], 0.4),
    down_l: P([-0.3, -0.65, -0.25], [-0.2, 0.2, -1], [0.3, 0.9, 0], 0.4)
  };
  /* golpes: [tempo, pose da mão direita] — preparo, corte, volta */
  const SW = {
    a: [[0, null], [0.26, P([0.32, -0.06, -0.38], [0.55, 0.2, -0.8], [0.45, 0.8, 0.3], 1)], [0.58, P([-0.15, -0.16, -0.5], [-0.2, -0.3, -0.95], [-0.95, -0.12, -0.3], 1)], [1, null]],
    b: [[0, null], [0.26, P([-0.06, -0.07, -0.42], [-0.45, 0.4, -0.8], [-0.7, 0.65, 0.2], 1)], [0.58, P([0.3, -0.15, -0.5], [0.2, -0.3, -0.95], [0.95, -0.12, -0.3], 1)], [1, null]],
    pw: [[0, null], [0.3, P([0.24, 0.02, -0.28], [0.3, 0.8, 0.2], [0.25, 0.55, 0.8], 1)], [0.62, P([-0.07, -0.2, -0.55], [-0.1, -0.5, -0.86], [-0.35, -0.65, -0.65], 1)], [1, null]],
    stab: [[0, null], [0.3, P([0.2, -0.17, -0.26], [0.4, 0.8, -0.3], [-0.05, 0.12, -1], 1)], [0.6, P([0.06, -0.13, -0.76], [0.4, 0.85, -0.2], [-0.05, 0.05, -1], 1)], [1, null]],
    dga: [[0, null], [0.25, P([0.27, -0.12, -0.32], [0.4, 0.4, -0.8], [0.2, 0.7, -0.6], 1)], [0.55, P([0.02, -0.12, -0.62], [0.2, 0.2, -0.95], [-0.3, 0.2, -0.95], 1)], [1, null]],
    pu_r: [[0, null], [0.2, P([0.22, -0.16, -0.34], [0, 0.1, -1], [-0.45, 0.9, 0], 1)], [0.5, P([0.05, -0.09, -0.74], [0, 0, -1], [-0.6, 0.8, 0], 1)], [1, null]],
    pu_l: [[0, null], [0.2, P([-0.22, -0.16, -0.34], [0, 0.1, -1], [0.45, 0.9, 0], 1)], [0.5, P([-0.05, -0.09, -0.74], [0, 0, -1], [0.6, 0.8, 0], 1)], [1, null]],
    cast: [[0, null], [0.25, P([0.18, -0.15, -0.4], [-0.1, 0.6, -0.8], [-0.6, 0.5, 0.2], 0.2)], [0.55, P([0.07, -0.1, -0.66], [-0.05, 0.75, -0.65], [-0.9, 0.2, -0.1], 0.1)], [1, null]]
  };
  /* espelha uma pose da mão direita para a esquerda */
  function mirror(a){ return { p: [-a.p[0], a.p[1], a.p[2]], f: [-a.f[0], a.f[1], a.f[2]], t: [-a.t[0], a.t[1], a.t[2]], c: a.c, e: a.e }; }
  function blendPose(a, b, t){ const ea = a.e || EL0, eb = b.e || EL0; return { p: L3(a.p, b.p, t), f: N3(L3(a.f, b.f, t)), t: N3(L3(a.t, b.t, t)), c: lerp(a.c, b.c, t), e: (a.e || b.e) ? L3(ea, eb, t) : null }; }
  const EL0 = [0.3, -1, 0.2];
  function clip(keys, base, u){
    for(let i = 0; i < keys.length - 1; i++){
      const a = keys[i], b = keys[i + 1];
      if(u <= b[0]){ const k = ez(clamp01((u - a[0]) / (b[0] - a[0]))); return blendPose(a[1] || base, b[1] || base, k); }
    }
    return base;
  }

  /* ---------------- IK de 2 ossos + giro da mão ---------------- */
  const V = { a: new T.Vector3(), b: new T.Vector3(), c: new T.Vector3(), d: new T.Vector3(), e: new T.Vector3(), g: new T.Vector3(), h: new T.Vector3(), q: new T.Quaternion(), w: new T.Quaternion(), pq: new T.Quaternion(), m1: new T.Matrix4(), m2: new T.Matrix4() };
  function aimBone(bone, child, dirW){
    bone.updateWorldMatrix(true, false); child.updateWorldMatrix(true, false);
    const cur = V.c.copy(child.getWorldPosition(V.a)).sub(bone.getWorldPosition(V.b)).normalize();
    V.q.setFromUnitVectors(cur, dirW);
    const wq = bone.getWorldQuaternion(V.w).premultiply(V.q);
    bone.quaternion.copy(bone.parent.getWorldQuaternion(V.pq).invert().multiply(wq));
    bone.updateMatrixWorld(true);
  }
  function setWorldQ(bone, wq){ bone.quaternion.copy(bone.parent.getWorldQuaternion(V.pq).invert().multiply(wq)); bone.updateMatrixWorld(true); }
  const camQ = new T.Quaternion(), camDir = (v, out) => out.set(v[0], v[1], v[2]).applyQuaternion(camQ);
  function frameQ(side, fW, tW){
    /* eixos do modelo na pose T: dedos ±x, palma -y, polegar +z → mundo */
    const F = side === 'r' ? new T.Vector3(-1, 0, 0) : new T.Vector3(1, 0, 0), Pm = new T.Vector3(0, -1, 0);
    const f = fW.clone(), t = tW.clone();
    f.addScaledVector(t, -f.dot(t)).normalize();
    /* palma: direita p = t×f; esquerda p = f×t (espelhada) */
    const p = side === 'r' ? t.clone().cross(f) : f.clone().cross(t);
    V.m1.makeBasis(F, Pm, F.clone().cross(Pm));
    V.m2.makeBasis(f, p, f.clone().cross(p));
    return new T.Quaternion().setFromRotationMatrix(V.m2.clone().multiply(V.m1.clone().transpose()));
  }
  function solveArm(A, pose){
    const side = A.side === 'r' ? 1 : -1;
    const sh = A.ua.getWorldPosition(new T.Vector3()), el = A.fa.getWorldPosition(new T.Vector3()), wr = A.hd.getWorldPosition(new T.Vector3());
    const Lu = A.Lu || (A.Lu = el.distanceTo(sh)), Lf = A.Lf || (A.Lf = wr.distanceTo(el));
    const tgt = new T.Vector3(pose.p[0], pose.p[1], pose.p[2]); camera.localToWorld(tgt);
    const dir = tgt.clone().sub(sh); const dist = Math.min(dir.length(), (Lu + Lf) * 0.999); dir.normalize();
    const aa = (Lu * Lu - Lf * Lf + dist * dist) / (2 * dist), hh = Math.sqrt(Math.max(0, Lu * Lu - aa * aa));
    const e = pose.e || EL0, pole = camDir([side * e[0], e[1], e[2]], new T.Vector3());
    pole.addScaledVector(dir, -pole.dot(dir)).normalize();
    const elbow = sh.clone().addScaledVector(dir, aa).addScaledVector(pole, hh);
    aimBone(A.ua, A.fa, elbow.clone().sub(sh).normalize());
    aimBone(A.fa, A.hd, sh.clone().addScaledVector(dir, dist).sub(elbow).normalize());
    /* mão: orientação absoluta */
    const fW = camDir(pose.f, new T.Vector3()), tW = camDir(pose.t, new T.Vector3());
    const R = frameQ(A.side, fW, tW);
    const handW = R.clone().multiply(A.hq);
    /* antebraço gira junto com a mão (evita o punho torcido) */
    const faW = A.fa.getWorldQuaternion(new T.Quaternion());
    const axis = A.hd.getWorldPosition(new T.Vector3()).sub(A.fa.getWorldPosition(new T.Vector3())).normalize();
    const downCur = new T.Vector3(0, -1, 0).applyQuaternion(A.fq.clone().invert()).applyQuaternion(faW);
    const downWant = new T.Vector3(0, -1, 0).applyQuaternion(R);
    downCur.addScaledVector(axis, -downCur.dot(axis)); downWant.addScaledVector(axis, -downWant.dot(axis));
    if(downCur.lengthSq() > 1e-6 && downWant.lengthSq() > 1e-6){
      downCur.normalize(); downWant.normalize();
      let ang = Math.acos(Math.max(-1, Math.min(1, downCur.dot(downWant))));
      if(downCur.clone().cross(downWant).dot(axis) < 0) ang = -ang;
      setWorldQ(A.fa, new T.Quaternion().setFromAxisAngle(axis, ang * 0.7).multiply(faW));
    }
    setWorldQ(A.hd, handW);
  }

  /* ---------------- estado do jogo → pose ---------------- */
  const SK = () => global.Skyrim588 || {};
  function isMagicWeapon(k){ return k === 'staff' || k === 'wand'; }
  function streaming(){ try { const s = global.Magia653 && Magia653.state && Magia653.state(); return !!(s && s.stream); } catch(_) { return false; } }
  function poseFor(dt){
    const Pl = global.player, k = weaponKind(), sk = S.dbg ? Object.assign({}, SK(), S.dbg) : SK(); /* S.dbg: só para os testes congelarem um quadro */
    const drawn = sk.dr === undefined ? 1 : sk.dr;
    let r, l;
    /* golpes: o tempo de recarga do jogador sobe a cada ataque */
    const cd = Pl.atkCd || 0;
    if(cd > S.lastCd + 0.001 && k !== 'bow'){
      const fwd = (() => { try { return (typeof input !== 'undefined' && input.z < -0.3) || (global.keys && (keys.KeyW || keys.ArrowUp)); } catch(_) { return false; } })();
      const power = S.lastWind >= 0.99;
      let name;
      if(!k) name = 'pu_r'; /* v712: botão esquerdo = sempre a mão direita */
      else if(isMagicWeapon(k)) name = 'cast';
      else if(k === 'dagger') name = power ? 'pw' : 'dga';
      else if(k === 'spear') name = 'stab';
      else if(power) name = fwd ? 'stab' : 'pw';
      else name = (S.nSwing % 2) ? 'b' : 'a';
      const dur = power ? 0.5 : name === 'cast' ? 0.42 : (k === 'dagger' ? 0.26 : 0.34);
      S.swing = { name, t: 0, dur };
      S.nSwing++;
    }
    S.lastCd = cd;
    S.lastWind = sk.winding ? (sk.wind || 0) : (sk.wind > 0 ? sk.wind : (cd > 0 ? S.lastWind : 0));
    if(!sk.winding && cd <= 0) S.lastWind = 0;
    /* base por arma */
    if(k === 'bow'){ r = POSE.b_r; l = POSE.b_l; }
    else if(!k){ r = POSE.f_r; l = POSE.f_l; }
    else if(isMagicWeapon(k)){ r = POSE.st_r; l = POSE.mg_l; }
    else if(k === 'dagger'){ r = POSE.dg_r; l = POSE.m_l; }
    else if(k === 'spear'){ r = POSE.sp_r; l = POSE.m_l; }
    else { r = POSE.m_r; l = POSE.m_l; }
    const magicCls = (() => { try { return !k && typeof MAGIC_CLS !== 'undefined' && (MAGIC_CLS.includes ? MAGIC_CLS.includes(profile.cls) : MAGIC_CLS.has(profile.cls)); } catch(_) { return false; } })();
    if(magicCls){ r = POSE.mg_r; l = POSE.mg_l; }
    /* v662: duas mãos (tools/maos662.js) */
    const M2 = global.Maos662;
    if(M2){
      if(M2.rightKind() === 'spell') r = POSE.mg_r;
      const lk = M2.leftKind();
      if(lk === 'spell') l = POSE.mg_l;
      else if(lk === 'weapon'){ const wk = weaponKind272(run.equip.wl); l = mirror(wk === 'dagger' ? POSE.dg_r : (wk === 'staff' || wk === 'wand') ? POSE.st_r : POSE.m_r); }
      const lh = M2.leftHeld ? M2.leftHeld() : 0;
      if(lh > 0) l = blendPose(l, mirror(SW.pw[1][1]), ez(lh) * 0.6);
      const lc = M2.lastCast, age = lc ? (performance.now() - lc.t) / 1000 : 9;
      if(age < 0.45){ const u = age / 0.45; const pz = clip(SW.cast, lc.side === 'r' ? r : mirror(l), u); if(lc.side === 'r') r = pz; else l = mirror(pz); }
    }
    /* preparo do golpe forte (segurando o botão) */
    if(sk.winding && sk.wind > 0 && k && k !== 'bow') r = blendPose(r, SW.pw[1][1], ez(Math.min(1, sk.wind)) * 0.85);
    /* defesa */
    if(sk.blk > 0 && k && k !== 'bow'){
      if(VM.sh) l = blendPose(l, P([-0.12, -0.09, -0.44], [0.9, 0.3, -0.3], [0.2, 1, 0.1], 1), ez(sk.blk));
      else r = blendPose(r, POSE.m_blk_r, ez(sk.blk));
    }
    /* magia (habilidade lançada) ou fluxo segurado */
    const flow = streaming();
    if((sk.cast > 0 || flow) && k !== 'bow'){
      const c = flow ? 1 : ez(Math.min(1, sk.cast * 1.8));
      if(isMagicWeapon(k)) r = blendPose(r, P([0.16, -0.14, -0.6], [0.35, 0.8, -0.3], [-0.1, 0.3, -0.95], 1), c);
      else if(!k || magicCls) r = blendPose(r, P([0.12, -0.11, -0.6], [-0.05, 0.8, -0.6], [-0.9, 0.3, -0.1], 0.1), c);
      else l = blendPose(l, P([-0.12, -0.11, -0.6], [0.05, 0.8, -0.6], [0.9, 0.3, -0.1], 0.1), c);
    }
    /* golpe em andamento */
    if(S.swingL){
      S.swingL.t += dt / S.swingL.dur;
      l = mirror(clip(SW[S.swingL.name], mirror(l), clamp01(S.swingL.t)));
      if(S.swingL.t >= 1) S.swingL = null;
    }
    if(S.swing){
      S.swing.t += S.swing.hold ? 0 : dt / S.swing.dur;
      const sw = SW[S.swing.name], u = clamp01(S.swing.t);
      if(S.swing.name === 'pu_l') l = clip(sw, l, u); else r = clip(sw, r, u);
      if(S.swing.t >= 1) S.swing = null;
    }
    /* arco: encaixar e puxar */
    let arrow = null, stringPull = 0;
    if(k === 'bow'){
      const d = sk.drawing ? (sk.draw || 0) : 0;
      if(sk.drawing){
        const NOCK = 0.3, n = clamp01(d / NOCK), pull = ez(clamp01((d - NOCK) / (1 - NOCK)));
        if(n < 1){
          /* mão vai à aljava (embaixo, atrás) e volta com a flecha até o arco */
          r = n < 0.45 ? blendPose(POSE.b_r, POSE.bq_r, ez(n / 0.45)) : blendPose(POSE.bq_r, POSE.bn_r, ez((n - 0.45) / 0.55));
          l = blendPose(POSE.b_l, POSE.bd_l, ez(n) * 0.85);
          arrow = n > 0.4 ? 'hand' : null;
        } else {
          l = POSE.bd_l; r = blendPose(POSE.bn_r, POSE.bd_r, pull); arrow = 'nock'; stringPull = pull;
        }
        S.lastDraw = d;
      } else if(S.lastDraw > 0){
        if(S.lastDraw >= 0.2) S.release = 1;
        S.lastDraw = 0;
      }
      if(S.release > 0){
        /* soltou: a mão da corda abre e recua, o arco volta devagar */
        const u = 1 - S.release;
        S.release = Math.max(0, S.release - dt / 0.45);
        l = blendPose(POSE.bd_l, POSE.b_l, ez(clamp01((u - 0.3) / 0.7)));
        const rel = P([0.11, -0.06, -0.07], [-0.15, 0.3, -1], [-0.2, 1, 0.2], 0.1);
        r = u < 0.35 ? blendPose(POSE.bd_r, rel, ez(u / 0.35)) : blendPose(rel, POSE.b_r, ez((u - 0.35) / 0.65));
      }
    }
    /* arma guardada: mãos saem de cena */
    if(k || magicCls){
      const sh = 1 - drawn;
      if(sh > 0.001){ r = blendPose(r, POSE.down_r, ez(sh)); l = blendPose(l, POSE.down_l, ez(sh)); }
    } else if(sk.dr !== undefined && !sk.drawn && !S.swing){
      r = blendPose(r, POSE.down_r, ez(1 - drawn)); l = blendPose(l, POSE.down_l, ez(1 - drawn));
    }
    return { r, l, arrow, stringPull, k };
  }

  /* balanço de andar/correr/pular e atraso ao girar a câmera */
  function motion(pose, dt){
    const Pl = global.player;
    const spdRaw = (S.px === undefined || dt <= 0) ? 0 : Math.hypot(Pl.x - S.px, Pl.z - S.pz) / dt; S.px = Pl.x; S.pz = Pl.z;
    S.sp += (Math.min(spdRaw, 12) - S.sp) * Math.min(1, dt * 10);
    const mv = Math.min(1, S.sp / 4), runK = clamp01((S.sp - 4.6) / 1.5);
    S.run += (runK - S.run) * Math.min(1, dt * 6);
    S.ph += dt * (S.sp > 4.6 ? 10.5 : S.sp > 0.2 ? 7 : 0);
    S.t += dt;
    const bx = Math.sin(S.ph) * 0.012 * mv, by = Math.abs(Math.cos(S.ph)) * 0.014 * mv, br = Math.sin(S.t * 1.6) * 0.004 * (1 - mv);
    /* giro da câmera: as mãos ficam um pouco para trás */
    const yaw = global.pcCam ? pcCam.yaw : 0, pitch = global.pcCam ? pcCam.pitch : 0;
    if(S.lastYaw !== null && dt > 0){
      let dy = yaw - S.lastYaw; if(dy > Math.PI) dy -= 2 * Math.PI; if(dy < -Math.PI) dy += 2 * Math.PI;
      const dp = pitch - S.lastPitch;
      S.sway[0] += (Math.max(-0.05, Math.min(0.05, dy * 0.6)) - S.sway[0]) * Math.min(1, dt * 14);
      S.sway[1] += (Math.max(-0.04, Math.min(0.04, -dp * 0.5)) - S.sway[1]) * Math.min(1, dt * 14);
    }
    S.lastYaw = yaw; S.lastPitch = pitch;
    S.sway[0] *= Math.max(0, 1 - dt * 6); S.sway[1] *= Math.max(0, 1 - dt * 6);
    const jy = Pl.jy || 0; S.lift += ((S.prevJy !== undefined ? Math.max(-0.05, Math.min(0.05, (jy - S.prevJy) * 3)) : 0) - S.lift) * Math.min(1, dt * 8); S.prevJy = jy;
    const busy = (SK().drawing ? 1 : 0) || (S.swing ? 1 : 0);
    const k = busy ? 0.3 : 1;
    for(const s of ['r', 'l']){
      const sg = s === 'r' ? 1 : -1, P0 = pose[s];
      const p = P0.p.slice();
      p[0] += (sg * bx * 0.7 + S.sway[0]) * k;
      p[1] += (-by * (s === 'r' ? 1 : 0.85) + br * sg + S.sway[1] - S.lift) * k;
      /* correndo (Skyrim): arma desce e tomba para a frente */
      if(S.run > 0.01 && !busy){ p[1] -= 0.07 * S.run; p[0] += sg * 0.03 * S.run; p[2] += 0.04 * S.run; }
      pose[s] = { p, f: (S.run > 0.01 && !busy) ? N3(L3(P0.f, [P0.f[0], P0.f[1] - 0.6, P0.f[2] - 0.3], S.run)) : P0.f, t: (S.run > 0.01 && !busy && pose.k) ? N3(L3(P0.t, [P0.t[0] * 0.4, P0.t[1] * 0.5, P0.t[2] - 0.8], S.run * 0.7)) : P0.t, c: P0.c, e: P0.e };
    }
  }

  /* suavização: a pose segue o alvo com mola (sem saltos ao trocar de estado) */
  function smoothPose(target, dt){
    if(!S.cur){ S.cur = { r: target.r, l: target.l }; return S.cur; }
    const fast = (S.swing || SK().drawing || S.release > 0) ? 40 : 14, k = 1 - Math.exp(-fast * dt);
    for(const s of ['r', 'l']) S.cur[s] = blendPose(S.cur[s], target[s], k);
    return S.cur;
  }

  function apply(dt){
    const Pl = global.player;
    if(!VM.ready || VM.src !== Pl.m || VM.sig !== gearSig(Pl.m)){ if(!build()) return; }
    syncWeapon(); syncShield(); syncLeftWeapon();
    camera.updateMatrixWorld(true); camQ.copy(camera.getWorldQuaternion(new T.Quaternion()));
    VM.root.visible = true;
    VM.model.updateMatrixWorld(true);
    const target = poseFor(dt);
    motion(target, dt);
    const cur = smoothPose(target, dt);
    for(const s of ['r', 'l']){ const A = VM.arms[s]; solveArm(A, cur[s]); }
    /* dedos: segurando a arma fecham; mão da corda em gancho */
    const k = target.k;
    for(const s of ['r', 'l']){
      const A = VM.arms[s];
      let c = cur[s].c;
      if(s === 'r' && VM.wep && k !== 'bow') c = Math.max(c, 0.95);
      if(s === 'l' && VM.bow) c = 1;
      if(s === 'l' && VM.sh) c = 1;
      if(s === 'l' && VM.wl) c = Math.max(c, 0.95);
      A.curl += (c - A.curl) * Math.min(1, dt * 18);
      curl({ side: s, fingers: A.fingers }, A.curl, s === 'r' && k === 'bow');
    }
    VM.model.updateMatrixWorld(true);
    /* arco: corda e flecha */
    const ar = arrowMesh(), st = stringMesh();
    ar.visible = false; st.visible = false;
    if(VM.bow){
      const bw = VM.bow, info = bw.info, inner = bw.inner;
      inner.updateWorldMatrix(true, false);
      const top = bw.top.clone(), bot = bw.bot.clone();
      inner.children[0].localToWorld(top); inner.children[0].localToWorld(bot);
      const tipR = VM.arms.r.tip.getWorldPosition(new T.Vector3());
      const grip = VM.arms.l.anchor.getWorldPosition(new T.Vector3());
      camera.worldToLocal(top); camera.worldToLocal(bot); camera.worldToLocal(tipR); camera.worldToLocal(grip);
      if(target.arrow === 'nock'){
        /* corda: das pontas até os dedos; flecha: dos dedos passando pelo arco, apontando para a mira */
        const nockPt = tipR.clone();
        st.visible = true; segment(st.children[0], top, nockPt); segment(st.children[1], bot, nockPt);
        ar.visible = true;
        const aim = new T.Vector3(0, 0, -40);
        const rest = new T.Vector3(grip.x - 0.045, grip.y + 0.06, grip.z); /* apoio da flecha: em cima dos dedos, do lado esquerdo do arco */
        const dir = rest.clone().sub(nockPt).normalize();
        ar.position.copy(nockPt); ar.quaternion.setFromUnitVectors(new T.Vector3(0, 0, -1), dir);
      } else {
        st.visible = true; const mid = top.clone().lerp(bot, 0.5); segment(st.children[0], top, mid); segment(st.children[1], bot, mid);
      }
      if(target.arrow === 'hand'){
        ar.visible = true; ar.position.copy(tipR);
        const d = new T.Vector3(-0.35, 0.25, -0.9).normalize();
        ar.quaternion.setFromUnitVectors(new T.Vector3(0, 0, -1), d);
      }
    }
  }

  /* ---------------- ligação com a 1ª pessoa do jogo (fp550) ---------------- */
  let bodyOn = false;
  FP.body = function(on){
    const Pl = global.player;
    if(!Pl || !Pl.m || !Pl.m.root) return;
    on = !!on;
    if(on){ Pl.m.root.visible = false; bodyOn = true; }
    else if(bodyOn){ Pl.m.root.visible = true; bodyOn = false; if(VM.root) VM.root.visible = false; if(VM.arrow) VM.arrow.visible = false; if(VM.string) VM.string.visible = false; S.cur = null; }
  };
  FP.pose = function(){};
  let lastT = 0;
  FP.tick = function(){
    const Pl = global.player;
    const now = performance.now(), dt = Math.min(0.05, Math.max(0.001, (now - (lastT || now)) / 1000)); lastT = now;
    if(!Pl || Pl.dead || !FP.active || (typeof run !== 'undefined' && run && run.mounted) || global.CINE231){
      FP.body(false);
      return;
    }
    FP.body(true);
    try { apply(dt); } catch(e){ if(!FP._err658){ FP._err658 = 1; console.warn('fp658', e); } }
  };
  /* v662: golpe da mão esquerda (tools/maos662.js) */
  FP.leftSwing = function(power){ const vazia = !global.run || !run.equip.wl; S.swingL = { name: vazia ? 'pu_r' : power ? 'pw' : (S.nSwingL++ % 2 ? 'b' : 'a'), t: 0, dur: power && !vazia ? 0.5 : 0.34 }; };
  S.nSwingL = 0;
  /* boca da magia/fluxo: palma da mão que lança */
  FP.muzzle = function(){
    if(!FP.active || !VM.ready || !VM.root || !VM.root.visible) return null;
    const k = weaponKind();
    if(isMagicWeapon(k) && VM.wep && VM.wepInfo){
      const tip = VM.wepInfo.c.clone().addScaledVector(VM.wepInfo.ax, VM.wepInfo.len * 0.5);
      VM.wep.children[0].children[0].localToWorld(tip); return tip;
    }
    const A = (k && k !== 'fist') ? VM.arms.l : VM.arms.r;
    return A.anchor.getWorldPosition(new T.Vector3());
  };

  /* mira: em 1ª pessoa o ataque vai para o centro da tela (onde está a mira), sem o limite de altura da 3ª pessoa */
  (function wrapAim(){
    if(typeof aimPoint !== 'function'){ setTimeout(wrapAim, 300); return; }
    const a0 = aimPoint, ray = new T.Raycaster();
    aimPoint = function(){
      if(!FP.active || (typeof touch !== 'undefined' && touch) || !global.player) return a0.apply(this, arguments);
      try { if(global.W377 && W377.target && !W377.target.dead) return a0.apply(this, arguments); } catch(_) {}
      ray.setFromCamera({ x: 0, y: 0 }, camera);
      const r = ray.ray, ground = Projectiles253.aimTerrainRay(r, terrH, 220);
      let best = null, dist = ground ? ground.t * 220 : 220;
      for(const e of enemies){ if(e.dead || e.sleep || Math.hypot(e.x - player.x, e.z - player.z) > 90) continue; const b = projectileBody253(e), hit = Projectiles253.intersectRayCapsule(r.origin, r.direction, b, b.r + 0.2, b.hitHeight, 220); if(hit.hit && hit.distance < dist){ dist = hit.distance; best = e; } }
      const far = r.origin.clone().addScaledVector(r.direction, Math.min(dist, 220));
      if(best){ const b = projectileBody253(best); aimV.set(best.x, b.y, best.z); }
      else aimV.copy(far);
      aimV.enemy253 = best; aimV.ray388 = far;
      return aimV;
    };
  })();

  /* arma sacada ao entrar na 1ª pessoa quando já estava na mão */
  const set0 = FP.set;
  FP.set = function(on){
    const r = set0.apply(this, arguments);
    if(!FP.active){ FP.body(false); }
    return r;
  };
  FP.rebuild658 = () => { drop(); return build(); };
})(window);
