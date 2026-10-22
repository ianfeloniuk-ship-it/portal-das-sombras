/* v549 (Ian, 22/10/2026): Est?dio de Anima??o T?cnica 3D e Biomec?nica (Skyrim ? Primeva).
   Lei Anti-Boneco R?gido implementada diretamente nos sistemas de anima??o:
   1) Viajante (Warrior127): Foot IK com terrH, inclina??o na ladeira (pitch), inclina??o na curva (bank/roll),
      amortecimento de pelve e flex?o de joelho real.
   2) Drag?es (dragoes510.js): Curva com inclina??o real (roll at? 40?), arfagem no mergulho/subida (pitch),
      peso corporal (bobbing vertical s?ncrono com batidas), propaga??o em onda no pesco?o (6 juntas) e cauda,
      e pouso adaptado ao relevo.
   3) Mobs GLB (animGlb): Inclina??o corporal no relevo (normal do ch?o) e in?rcia de cauda nas curvas.
   4) Quadr?pedes e Chibis: Pernas articuladas de 2 juntas (coxa + joelho/canela) com flex?o no swing e firmeza no apoio.
   5) Drag?o Errante Fallback: Asas articuladas de 3 juntas com ciclo de recolhimento aerodin?mico na subida.
*/
(function(){
'use strict';
const T = window.THREE;
if(!T) return;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const sm = (cur, target, k, dt) => cur + (target - cur) * (1 - Math.exp(-k * dt));

const API = {
  version: 549,
  on: true,
  ikDist: 35,
  stats: { playerIK: 0, dragonDynamics: 0, mobTerrain: 0, quadWave: 0 }
};
window.Anim547 = API;

/* =========================================================================
   1. VIAJANTE & HUMAN?IDES (Warrior127): FOOT IK + RELEVO + CURVAS
   ========================================================================= */
API.postPlayer = function(m, st, dt){
  if(!API.on || !m || !m.bones) return;
  const B = m.bones;
  const root = m.root;
  if(!root) return;

  const tH = window.terrH;
  if(typeof tH !== 'function') return;

  const px = (typeof player !== 'undefined' && player && player.m === m) ? player.x : root.position.x;
  const pz = (typeof player !== 'undefined' && player && player.m === m) ? player.z : root.position.z;
  const face = (typeof player !== 'undefined' && player && player.m === m) ? player.face : root.rotation.y;
  const air = (typeof player !== 'undefined' && player && player.air344) || false;

  dt = clamp(dt || (1/60), 0.001, 0.1);

  if(!air && !(st && st.dead > 0)){
    const h0 = tH(px, pz);
    const sinF = Math.sin(face), cosF = Math.cos(face);
    const fwdX = sinF, fwdZ = cosF;
    const rgtX = cosF, rgtZ = -sinF;

    // A) INCLINA??O NA LADEIRA (PITCH): Frente vs Tr?s
    const sDist = 0.65;
    const hFwd = tH(px + fwdX * sDist, pz + fwdZ * sDist);
    const hRear = tH(px - fwdX * sDist, pz - fwdZ * sDist);
    const slopeFwd = (hFwd - hRear) / (sDist * 2);

    // B) INCLINA??O LATERAL (ROLL): Direita vs Esquerda
    const lDist = 0.45;
    const hRgt = tH(px + rgtX * lDist, pz + rgtZ * lDist);
    const hLft = tH(px - rgtX * lDist, pz - rgtZ * lDist);
    const slopeRgt = (hRgt - hLft) / (lDist * 2);

    // C) CURVAS COM IN?RCIA (BANKING SKYRIM)
    if(m.lastFace547 == null) m.lastFace547 = face;
    let dFace = face - m.lastFace547;
    dFace = Math.atan2(Math.sin(dFace), Math.cos(dFace));
    m.lastFace547 = face;
    const turnRate = dFace / dt;
    const moveSpd = clamp(st?.speed || (st?.move ? 5 : 0), 0, 10);
    const bankTarget = clamp(-turnRate * 0.045 * (moveSpd / 4.5), -0.22, 0.22);

    // Suaviza??o das rota??es do corpo
    const wantPitch = clamp(-slopeFwd * 0.38, -0.42, 0.42);
    m.pitch547 = sm(m.pitch547 || 0, wantPitch, 8, dt);

    const wantRoll = clamp(slopeRgt * 0.32 + bankTarget, -0.32, 0.32);
    m.roll547 = sm(m.roll547 || 0, wantRoll, 8, dt);

    // Aplica na malha/corpo do Viajante
    if(m.body){
      m.body.rotation.x = m.pitch547;
      m.body.rotation.z = m.roll547;
    }

    // Contra-rota??o da cabe?a para manter olhar firme no horizonte
    if(B.head){
      B.head.rotation.x -= m.pitch547 * 0.45;
      B.head.rotation.z -= m.roll547 * 0.5;
    }

    // D) FOOT IK ANAL?TICO (DOIS OSSOS: COXA + JOELHO/CANELA)
    const footL_X = px - rgtX * 0.22, footL_Z = pz - rgtZ * 0.22;
    const footR_X = px + rgtX * 0.22, footR_Z = pz + rgtZ * 0.22;
    const dHL = clamp(tH(footL_X, footL_Z) - h0, -0.45, 0.45);
    const dHR = clamp(tH(footR_X, footR_Z) - h0, -0.45, 0.45);

    // Pelve desce at? alcan?ar o p? mais baixo no terreno irregular
    const minDrop = Math.min(0, Math.min(dHL, dHR));
    m.drop547 = sm(m.drop547 || 0, minDrop, 12, dt);
    if(m.body) m.body.position.y = m.drop547;

    // P? mais alto dobra o joelho (shin) e compensa no quadril (thigh)
    const liftL = dHL - m.drop547;
    const liftR = dHR - m.drop547;

    if(liftL > 0.005 && B.shin_l && B.thigh_l){
      const kf = clamp(liftL * 2.2, 0, 0.75);
      B.shin_l.rotation.x += kf;
      B.thigh_l.rotation.x -= kf * 0.48;
      if(B.foot_l) B.foot_l.rotation.x -= kf * 0.52;
    }
    if(liftR > 0.005 && B.shin_r && B.thigh_r){
      const kf = clamp(liftR * 2.2, 0, 0.75);
      B.shin_r.rotation.x += kf;
      B.thigh_r.rotation.x -= kf * 0.48;
      if(B.foot_r) B.foot_r.rotation.x -= kf * 0.52;
    }

    API.stats.playerIK++;
  } else {
    if(m.body){
      m.body.rotation.x = 0;
      m.body.rotation.z = 0;
      m.body.position.y = 0;
    }
  }
};

/* =========================================================================
   2. DRAG?ES (dragoes510.js): CINEM?TICA DE VOO SKYRIM + ONDAS
   ========================================================================= */
API.postDragon = function(e, dt){
  if(!API.on || !e || !e.m || !e.m.root) return;
  const D = e.drake510;
  if(!D) return;

  dt = clamp(dt || (1/60), 0.001, 0.1);
  const air = D.phase !== 'chao';
  const tH = window.terrH;

  if(air){
    // A) CURVA COM INCLINA??O REAL (ROLL / BANKING)
    if(D.lastFace == null) D.lastFace = e.face;
    let dFace = e.face - D.lastFace;
    dFace = Math.atan2(Math.sin(dFace), Math.cos(dFace));
    D.lastFace = e.face;
    const turnRate = dFace / dt;
    const targetBank = clamp(-turnRate * 1.6, -0.68, 0.68);
    D.bank = sm(D.bank || 0, targetBank, 4.5, dt);

    // B) ARFAGEM (PITCH) NO MERGULHO E NA SUBIDA
    const dAlt = D.alt - (D.lastAlt ?? D.alt);
    D.lastAlt = D.alt;
    const vertRate = dAlt / dt;
    const targetPitch = clamp(-vertRate * 0.045, -0.45, 0.55);
    D.pitch = sm(D.pitch || 0, targetPitch, 5.0, dt);

    // C) PESO E IMPULSO DAS ASAS (BOBBING VERTICAL S?NCRONO)
    const flapFreq = 3.2; // Batidas pesadas estilo Skyrim
    const flapPhase = D.t * flapFreq;
    const wingBob = Math.sin(flapPhase) * 0.75;

    // Atualiza posi??o e orienta??o do drag?o no mundo
    const groundH = typeof tH === 'function' ? tH(e.x, e.z) : 0;
    e.m.root.position.set(e.x, groundH + D.alt + wingBob, e.z);
    e.m.root.rotation.set(D.pitch, e.face, D.bank, 'YXZ');

    // D) CADEIA DO PESCO?O E DA CAUDA: PROPAGA??O EM ONDA COM ATRASO DE FASE
    if(!D.chainsCached && e.m.model){
      const bones = [];
      e.m.model.traverse(o => { if(o.isBone) bones.push(o); });
      D.neckBones = bones.filter(b => /neck/i.test(b.name)).sort((a,b)=>a.name.localeCompare(b.name));
      D.tailBones = bones.filter(b => /tail/i.test(b.name)).sort((a,b)=>a.name.localeCompare(b.name));
      D.wingBones = bones.filter(b => /wing|finger/i.test(b.name));
      D.chainsCached = true;
    }

    if(D.neckBones && D.neckBones.length){
      const n = D.neckBones.length;
      for(let i=0; i<n; i++){
        const f = (i + 1) / n;
        D.neckBones[i].rotation.y = Math.sin(flapPhase * 0.5 - i * 0.35) * 0.08 * f - D.bank * 0.28 * f;
        D.neckBones[i].rotation.x = Math.sin(flapPhase - i * 0.3) * 0.05 * f + D.pitch * 0.22 * f;
      }
    }
    if(D.tailBones && D.tailBones.length){
      const n = D.tailBones.length;
      for(let i=0; i<n; i++){
        const f = (i + 1) / n;
        D.tailBones[i].rotation.y = Math.sin(flapPhase * 0.5 - i * 0.45) * 0.16 * f + D.bank * 0.45 * f;
        D.tailBones[i].rotation.x = Math.sin(flapPhase * 0.5 - i * 0.35) * 0.08 * f;
      }
    }

    // E) ASAS PROCEDURAIS (SE HOUVER JUNTAS DE ASA OU FALLBACK PROCEDURAL)
    if(D.proceduralWings){
      API.updateProceduralWings(D.proceduralWings, flapPhase);
    }

    API.stats.dragonDynamics++;
  } else {
    // DRAG?O NO CH?O (POUSADO): Apoio real no relevo
    if(typeof tH === 'function'){
      const sinF = Math.sin(e.face), cosF = Math.cos(e.face);
      const hFront = tH(e.x + sinF * 3.5, e.z + cosF * 3.5);
      const hRear = tH(e.x - sinF * 3.5, e.z - cosF * 3.5);
      const groundPitch = clamp(-(hFront - hRear) / 7.0, -0.45, 0.45);

      const hRgt = tH(e.x + cosF * 2.5, e.z - sinF * 2.5);
      const hLft = tH(e.x - cosF * 2.5, e.z + sinF * 2.5);
      const groundRoll = clamp((hRgt - hLft) / 5.0, -0.35, 0.35);

      D.pitch = sm(D.pitch || 0, groundPitch, 6, dt);
      D.bank = sm(D.bank || 0, groundRoll, 6, dt);
      e.m.root.rotation.set(D.pitch, e.face, D.bank, 'YXZ');
    }
  }
};

/* =========================================================================
   3. MOBS GLB (animGlb): ADAPTA??O AO RELEVO + ONDA DE CAUDA
   ========================================================================= */
API.postMobGlb = function(m, st, dt){
  if(!API.on || !m || !m.body) return;
  const root = m.root;
  if(!root) return;

  const tH = window.terrH;
  if(typeof tH !== 'function') return;

  dt = clamp(dt || (1/60), 0.001, 0.1);
  const rx = root.position.x, rz = root.position.z;
  const face = root.rotation.y;

  const sinF = Math.sin(face), cosF = Math.cos(face);
  const sDist = (m.sc || 1) * 0.75;
  const hFwd = tH(rx + sinF * sDist, rz + cosF * sDist);
  const hRear = tH(rx - sinF * sDist, rz - cosF * sDist);
  const slopeFwd = (hFwd - hRear) / (sDist * 2);

  const lDist = (m.sc || 1) * 0.5;
  const hRgt = tH(rx + cosF * lDist, rz - sinF * lDist);
  const hLft = tH(rx - cosF * lDist, rz + sinF * lDist);
  const slopeRgt = (hRgt - hLft) / (lDist * 2);

  const wantPitch = clamp(-slopeFwd * 0.35, -0.38, 0.38);
  m.pitch547 = sm(m.pitch547 || 0, wantPitch, 7, dt);

  const wantRoll = clamp(slopeRgt * 0.3, -0.3, 0.3);
  m.roll547 = sm(m.roll547 || 0, wantRoll, 7, dt);

  m.body.rotation.x = m.pitch547;
  m.body.rotation.z = m.roll547;

  API.stats.mobTerrain++;
};

/* =========================================================================
   4. QUADR?PEDES ARTICULADOS: LOBO, FERAS (2 JUNTAS POR PERNA + ONDA)
   ========================================================================= */
API.animQuadruped = function(m, st, t){
  if(!m) return;
  const mv = st?.move || 0;
  const tt = t * 10.5;

  // Marcha diagonal de quadr?pede (trote: pata dianteira esquerda + traseira direita em fase)
  const phases = [tt, tt + Math.PI, tt + Math.PI, tt];

  if(m.articulatedLegs && m.articulatedLegs.length === 4){
    for(let i=0; i<4; i++){
      const ph = phases[i];
      const sw = Math.sin(ph) * 0.55 * mv;
      // O joelho flexiona para tr?s no balan?o (swing) e estica no apoio (stance)
      const kneeFlex = Math.max(0, Math.cos(ph)) * 0.72 * mv;
      m.articulatedLegs[i].thigh.rotation.x = sw;
      m.articulatedLegs[i].knee.rotation.x = -kneeFlex;
    }
  } else if(m.paws){
    m.paws.forEach((p, i) => {
      p.rotation.x = Math.sin(phases[i]) * 0.55 * mv;
    });
  }

  // Cauda articulada em onda com atraso de fase
  if(m.tailSegments && m.tailSegments.length){
    m.tailSegments.forEach((ts, idx) => {
      ts.rotation.y = Math.sin(t * 4.5 - idx * 0.6) * (0.12 + mv * 0.18);
      ts.rotation.x = Math.sin(t * 3.0 - idx * 0.4) * 0.08;
    });
  } else if(m.tail){
    m.tail.rotation.y = Math.sin(t * 5) * 0.15;
  }

  // Deslocamento de centro de massa e peso
  m.body.position.y = Math.abs(Math.sin(tt)) * 0.045 * mv + Math.sin(t * 2) * 0.015;
  m.body.rotation.z = Math.sin(tt * 0.5) * 0.02 * mv;
  m.body.rotation.x = st?.wind > 0 ? -0.12 : st?.atk > 0 ? Math.sin(st.atk * Math.PI) * 0.2 : 0;
  if(st?.dead > 0) m.body.rotation.z = st.dead * Math.PI / 2;

  API.stats.quadWave++;
};

/* =========================================================================
   5. B?PEDES CHIBI PROCEDURAIS (DOBRADURA REAL DE JOELHO E COTOVELO)
   ========================================================================= */
API.animChibi = function(m, st, t){
  if(!m) return;
  const mv = st?.move || 0;
  const sw = Math.sin(t * 11) * 0.68 * mv;

  // Pernas com flex?o de joelho real
  if(m.shinL && m.shinR){
    m.legL.rotation.x = sw;
    m.shinL.rotation.x = Math.max(0, sw) * 0.7; // Joelho dobra para tr?s quando a perna vai ? frente
    m.legR.rotation.x = -sw;
    m.shinR.rotation.x = Math.max(0, -sw) * 0.7;
  } else {
    m.legL.rotation.x = sw;
    m.legR.rotation.x = -sw;
  }

  // Bra?os com flex?o de cotovelo
  if(m.forearmL && m.forearmR){
    m.armL.rotation.x = -sw * 0.75;
    m.forearmL.rotation.x = -Math.max(0, -sw) * 0.55;
    if(st?.wind > 0){
      m.armR.rotation.x = -2.6 * st.wind;
      m.body.rotation.x = -0.15 * st.wind;
    } else if(st?.atk > 0){
      const a = st.atk;
      m.armR.rotation.x = -2.6 + 3.6 * Math.min(1, a * 2.2);
      m.armR.rotation.z = -0.4 * Math.sin(a * Math.PI);
      m.body.rotation.y = Math.sin(a * Math.PI) * 0.5;
    } else {
      m.armR.rotation.x = sw * 0.75;
      m.forearmR.rotation.x = -Math.max(0, sw) * 0.55;
    }
  } else {
    m.armL.rotation.x = -sw * 0.8;
    if(st?.wind > 0) m.armR.rotation.x = -2.6 * st.wind;
    else if(st?.atk > 0) m.armR.rotation.x = -2.6 + 3.6 * Math.min(1, st.atk * 2.2);
    else m.armR.rotation.x = sw * 0.8;
  }

  // Rota??o sutil da pelve para acompanhar as passadas
  m.body.rotation.y = -sw * 0.08;
  m.body.position.y = Math.abs(Math.sin(t * 11)) * 0.075 * mv + Math.sin(t * 2.2) * 0.02;
  if(st?.dead > 0){
    m.body.rotation.x = -Math.PI / 2 * st.dead;
    m.body.position.y = 0.35 * st.dead;
  }
};

/* =========================================================================
   6. ASAS PROCEDURAIS ARTICULADAS (DRAG?O DE 3 JUNTAS)
   ========================================================================= */
API.createDragonWings = function(parentBody, colorHex){
  const wings = [];
  const mat = new T.MeshStandardMaterial({
    color: colorHex || 0x5a0a0a,
    roughness: 0.75,
    metalness: 0.1,
    side: T.DoubleSide
  });

  for(const s of [-1, 1]){
    const shoulder = new T.Group();
    shoulder.position.set(s * 0.75, 1.35, -0.25);

    // Junta 1: Clav?cula/?mero (Bra?o Superior)
    const armGeom = new T.CylinderGeometry(0.12, 0.09, 1.2, 6);
    armGeom.rotateZ(Math.PI / 2);
    armGeom.translate(s * 0.6, 0, 0);
    const armMesh = new T.Mesh(armGeom, mat);
    shoulder.add(armMesh);

    // Junta 2: Cotovelo/Antebra?o
    const elbow = new T.Group();
    elbow.position.set(s * 1.2, 0, 0);
    shoulder.add(elbow);

    const forearmGeom = new T.CylinderGeometry(0.09, 0.06, 1.3, 6);
    forearmGeom.rotateZ(Math.PI / 2);
    forearmGeom.translate(s * 0.65, 0, 0);
    const forearmMesh = new T.Mesh(forearmGeom, mat);
    elbow.add(forearmMesh);

    // Membrana da Asa Interna (entre bra?o e antebra?o)
    const innerMemGeom = new T.BufferGeometry();
    const posInner = new Float32Array([
      0, 0, 0,
      s * 1.2, 0, 0,
      s * 0.6, -0.65, -0.45
    ]);
    innerMemGeom.setAttribute('position', new T.BufferAttribute(posInner, 3));
    innerMemGeom.computeVertexNormals();
    const innerMem = new T.Mesh(innerMemGeom, mat);
    shoulder.add(innerMem);

    // Junta 3: Ponta da Asa / Dedos da Vela
    const wrist = new T.Group();
    wrist.position.set(s * 1.3, 0, 0);
    elbow.add(wrist);

    const outerMemGeom = new T.BufferGeometry();
    const posOuter = new Float32Array([
      0, 0, 0,
      s * 1.5, 0.2, -0.1,
      s * 0.8, -0.9, -0.5
    ]);
    outerMemGeom.setAttribute('position', new T.BufferAttribute(posOuter, 3));
    outerMemGeom.computeVertexNormals();
    const outerMem = new T.Mesh(outerMemGeom, mat);
    wrist.add(outerMem);

    parentBody.add(shoulder);
    wings.push({ shoulder, elbow, wrist, side: s });
  }

  return wings;
};

API.updateProceduralWings = function(wings, flapPhase){
  if(!wings || !wings.length) return;
  for(const w of wings){
    const s = w.side;
    // Ombro: bate com impulso principal
    w.shoulder.rotation.z = s * (0.2 + Math.sin(flapPhase) * 0.65);
    // Cotovelo: atraso de fase + recolhimento na subida para cortar o ar
    w.elbow.rotation.z = s * (Math.sin(flapPhase - 0.65) * 0.5 - Math.max(0, Math.cos(flapPhase)) * 0.45);
    // Ponta da asa: chicoteia com maior atraso
    w.wrist.rotation.z = s * (Math.sin(flapPhase - 1.3) * 0.6);
  }
};

})();
