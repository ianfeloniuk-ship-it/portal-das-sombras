/* v661 (Ian, 28/10/2026): «cachoeiras que vertem das montanhas perto do reino de água… a cidade é banhada pelo mar e flutua
   através de magia dos zumbis muito antiga… todos os rios de Primeva (Terras Despertas) vêm desse mar, e vertem junto das cachoeiras».
   - Thalor virou ilha: um canal de mar em volta da muralha (relevo em tools/terrain245.js, moat661) com 3 aterros de pedra nas estradas.
     A magia dos afogados aparece como runas verde-água na linha d'água, uma cortina de luz subindo da água e pedras soltas flutuando no canal.
   - A água do Mar de Thalor sobe pela mesma magia, corre por dentro da serra e despenca nas cachoeiras. Cada rio nasce no poço de uma
     cachoeira (RIO_SRC661): o rio oeste na serra a leste de Thalor (3 quedas), o rio central na serra do norte (2 quedas). Ao norte do poço não há rio.
   Tudo aqui é visual (malhas fixas, sem colisão); nadar no poço fica em tools/water391.js. */
(function () {
  'use strict';
  const T = window.THREE; if (!T || !window.TER245) return;
  const TER = TER245, TH = TER.TH661, POOLY = -2.34;
  const ready = () => typeof started !== 'undefined' && started && typeof player !== 'undefined' && player && typeof run !== 'undefined' && run;
  const U = { t: { value: 0 }, uDay: { value: 1 } };
  const NOISE = 'float h661(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}' +
    'float n661(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h661(i),h661(i+vec2(1.,0.)),f.x),mix(h661(i+vec2(0.,1.)),h661(i+vec2(1.,1.)),f.x),f.y);}';
  /* runas dos afogados: faixa de glifos (3 traços por célula, sorteados) */
  const RUNE = NOISE + 'float rune661(vec2 c,float id){vec2 q=fract(c)-.5;float g=0.;for(int k=0;k<3;k++){float a=h661(vec2(id,float(k)*7.1));float b=h661(vec2(id*1.3,float(k)*3.7));' +
    'vec2 d=a<.33?vec2(1.,0.):a<.66?vec2(0.,1.):vec2(.7,.7*(b<.5?1.:-1.));vec2 o=vec2(b-.5,h661(vec2(id,float(k)))-.5)*.5;float l=abs(dot(q-o,vec2(-d.y,d.x)));float e=abs(dot(q-o,d));' +
    'g=max(g,(1.-smoothstep(.035,.06,l))*(1.-smoothstep(.22,.26,e)));}return g*(1.-smoothstep(.36,.46,max(abs(q.x),abs(q.y))));}';
  const root = new T.Group(); root.name = 'Cachoeiras661'; root.visible = false; root.userData.terrainAbsolute245 = true; scene.add(root);
  const abs = o => { o.userData.terrainAbsolute245 = true; o.frustumCulled = false; return o; };

  /* ---------- cachoeiras ---------- */
  const FALLS = [ // poço (b do rio), direção de onde a água vem (rad, 0 = leste, -π/2 = norte), desvio para o lado (m), largura
    { b: -1, a: 0, o: 0, w: 17 }, { b: -1, a: 0, o: 21, w: 8 }, { b: -1, a: 0, o: -19, w: 9 },
    { b: 0, a: -Math.PI / 2, o: 0, w: 14 }, { b: 0, a: -Math.PI / 2, o: -17, w: 7 }];
  const fallMat = new T.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, side: T.DoubleSide,
    vertexShader: 'attribute float aL;attribute float aW;varying vec2 vUv;varying float vL;varying float vW;varying vec3 vP;void main(){vUv=uv;vL=aL;vW=aW;vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
    fragmentShader: 'uniform float t;uniform float uDay;varying vec2 vUv;varying float vL;varying float vW;varying vec3 vP;' + NOISE +
      'void main(){float s=vUv.y;float sp=6.+22.*s;float x=vUv.x*vW;' +
      'float a=n661(vec2(x*.55,(vL-t*sp)*.09))*.6+n661(vec2(x*1.7,(vL-t*sp*1.15)*.3))*.4;float str=smoothstep(.35,.85,a);' +
      'vec3 deep=vec3(.16,.40,.46),foam=vec3(.90,.96,1.);vec3 col=mix(deep,foam,.35+.65*str);' +
      'float lip=1.-smoothstep(0.,7.,vL);col=mix(col,vec3(.40,1.,.80),lip*(.55+.25*sin(t*2.3)));' + // a água do mar sobe com a luz da magia
      'float edge=smoothstep(0.,.14,vUv.x)*smoothstep(1.,.86,vUv.x);float ragged=smoothstep(.15,.5,n661(vec2(x*.9,(vL-t*sp)*.05))+edge*.6);' +
      'float al=edge*ragged*(.62+.38*str)*(1.-smoothstep(.96,1.,s)*.6);col*=mix(.30,1.,uDay);col+=vec3(.25,.75,.6)*lip*(1.-uDay)*.6;' +
      'gl_FragColor=vec4(col,clamp(al,0.,.95));}'
  });
  const mistMat = new T.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false,
    vertexShader: 'uniform float t;attribute vec4 aS;varying float vA;void main(){float life=fract(t*aS.w+aS.z);vec3 p=position;p.y+=life*11.;' +
      'vec4 mv=viewMatrix*vec4(p+vec3(sin(aS.z*40.+t)*life*3.,0.,cos(aS.z*31.+t)*life*3.),1.);vA=sin(life*3.1416)*.55;gl_PointSize=clamp((140.+life*420.)*aS.x/-mv.z,2.,320.);gl_Position=projectionMatrix*mv;}',
    fragmentShader: 'uniform float uDay;varying float vA;void main(){vec2 q=gl_PointCoord-.5;float d=length(q);if(d>.5)discard;float a=(1.-smoothstep(.1,.5,d))*vA;gl_FragColor=vec4(mix(vec3(.25,.3,.35),vec3(.92,.96,1.),uDay),a*.45);}'
  });
  const poolMat = new T.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false,
    vertexShader: 'varying vec3 vP;varying vec2 vUv;void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
    fragmentShader: 'uniform float t;uniform float uDay;varying vec3 vP;varying vec2 vUv;' + NOISE +
      'void main(){vec2 q=vUv-.5;float r=length(q)*2.;if(r>1.)discard;float rip=n661(vP.xz*.35+vec2(t*.6,-t*.4))*.5+n661(vP.xz*1.1-vec2(t*1.3,0.))*.5;' +
      'vec3 col=mix(vec3(.05,.22,.28),vec3(.20,.55,.58),rip*.6+r*.25);float foam=smoothstep(.55,.9,rip)*(.35+.65*smoothstep(.3,1.,r));col=mix(col,vec3(.92,.97,1.),foam*.6);' +
      'col*=mix(.32,1.,uDay);gl_FragColor=vec4(col,(.85-r*.1)*(1.-smoothstep(.93,1.,r)));}'
  });
  const glyphMat = new T.ShaderMaterial({ // runa da nascente, no alto da queda
    uniforms: U, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);}',
    fragmentShader: 'uniform float t;varying vec2 vUv;' + RUNE +
      'void main(){vec2 q=vUv-.5;float r=length(q)*2.;float th=atan(q.y,q.x)/6.2832+.5;float band=smoothstep(.62,.66,r)*(1.-smoothstep(.94,.98,r));' +
      'float id=floor(th*14.);float g=rune661(vec2(th*14.,(r-.62)/.34),id)*band;float ring=(1.-smoothstep(.0,.025,abs(r-.6)))+(1.-smoothstep(.0,.02,abs(r-.98)));' +
      'float k=(g+ring*.7)*(.65+.35*sin(t*1.7+id));gl_FragColor=vec4(vec3(.35,1.,.78)*k,k*.9);}'
  });

  function buildFall(f, P) {
    /* u = distância do centro do poço na direção da serra; o paredão (terrain245, pool661) começa em u = R */
    const R = P.S.R, dx = Math.cos(f.a), dz = Math.sin(f.a), px = -dz, pz = dx, bx = P.p.x - dz * f.o, bz = P.p.z + dx * f.o;
    const at = u => [bx + dx * u, bz + dz * u];
    let hm = -1e9; const H = []; for (let u = R + 4; u <= 340; u += 3) { const [x, z] = at(u), h = terrH(x, z); H.push([u, h]); if (h > hm) hm = h; }
    let ul = H[H.length - 1][0]; for (const [u, h] of H) { if (h >= POOLY + (hm - POOLY) * .8) { ul = u; break; } }
    let ue = R + 1.2; { const top = terrH(...at(R + 9)); for (let u = R + 9; u > R - 6; u -= .25) if (terrH(...at(u)) < top * .6) { ue = u + .5; break; } } // borda do paredão (irregular)
    const ul2 = R - 7, path = [];
    for (let u = ul; u > ue; u -= 3) { const [x, z] = at(u); path.push([x, terrH(x, z) + .45, z]); } // corredeira pela encosta
    { const [x, z] = at(ue); const ye = terrH(x, z) + .6; for (let i = 0; i <= 16; i++) { const q = i / 16, [xx, zz] = at(ue - (ue - ul2) * Math.sqrt(q)); path.push([xx, ye - (ye - POOLY) * q, zz]); } } // queda solta do paredão
    const [lx, ly, lz] = path[0], N = path.length - 1, tx = path[N][0], tz = path[N][2];
    const pos = [], uv = [], aL = [], aW = [], idx = []; let len = 0, ox = lx, oy = ly, oz = lz;
    for (let i = 0; i <= N; i++) {
      const s = i / N, [x, y, z] = path[i], w = f.w * (1 + s * .55) * .5;
      len += Math.hypot(x - ox, y - oy, z - oz); ox = x; oy = y; oz = z;
      pos.push(x - px * w, y, z - pz * w, x + px * w, y, z + pz * w); uv.push(0, s, 1, s); aL.push(len, len); aW.push(f.w, f.w);
      if (i) { const k = (i - 1) * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    g.setAttribute('aL', new T.Float32BufferAttribute(aL, 1)); g.setAttribute('aW', new T.Float32BufferAttribute(aW, 1)); g.setIndex(idx);
    const m = abs(new T.Mesh(g, fallMat)); m.renderOrder = 5; root.add(m);
    /* runa da nascente na rocha, de frente para o poço */
    const gl = abs(new T.Mesh(new T.PlaneGeometry(f.w * 1.5, f.w * 1.5), glyphMat)); gl.position.set(lx + dx * 1.5, ly + f.w * .55, lz + dz * 1.5); gl.lookAt(tx, ly + f.w * .55, tz); gl.renderOrder = 6; root.add(gl);
    /* névoa onde a queda bate */
    const M = 26, mp = [], ms = []; for (let i = 0; i < M; i++) { const a = Math.random() * 6.283, r = Math.random() * f.w * .6; mp.push(tx + Math.cos(a) * r - dx * 2, POOLY + .2, tz + Math.sin(a) * r - dz * 2); ms.push(f.w / 10 + Math.random() * .6, 0, Math.random(), .12 + Math.random() * .1); }
    const mg = new T.BufferGeometry(); mg.setAttribute('position', new T.Float32BufferAttribute(mp, 3)); mg.setAttribute('aS', new T.Float32BufferAttribute(ms, 4));
    const pts = abs(new T.Points(mg, mistMat)); pts.renderOrder = 7; root.add(pts);
    return { x: lx, z: lz, y: ly, tx, tz };
  }
  /* nada de árvore, pedra ou casa dentro do poço ou no paredão */
  const clear = (x, z) => { for (const P of TER.RS661) { const qx = x - P.p.x, qz = z - P.p.z, dx = Math.cos(P.S.a), dz = Math.sin(P.S.a), u = qx * dx + qz * dz, v = Math.abs(-qx * dz + qz * dx);
    if (Math.hypot(qx, qz) < P.S.R + 14 || (u > P.S.R - 4 && u < P.S.R + 30 && v < P.S.W + 12)) return true; } return false; };
  if (typeof EH === 'function') { const eh0 = EH; EH = function (batch, key, x, y, z) { try { if (clear(x, z)) return 0; } catch (_) {} return eh0.apply(this, arguments); }; }
  if (typeof EW === 'function') { const ew0 = EW; EW = function (batch, key, x, y, z) { try { if (clear(x, z)) return 0; } catch (_) {} return ew0.apply(this, arguments); }; }
  const falls = [];
  function buildAll() {
    for (const P of TER.RS661) {
      const pool = abs(new T.Mesh(new T.PlaneGeometry(P.S.R * 2 + 8, P.S.R * 2 + 8), poolMat)); pool.rotation.x = -Math.PI / 2; pool.position.set(P.p.x, POOLY, P.p.z); pool.renderOrder = 4; root.add(pool);
      for (const f of FALLS) if (f.b === P.b) falls.push(buildFall(f, P));
    }
  }

  /* ---------- Thalor: runas, cortina de luz e pedras flutuando ---------- */
  const isle = new T.Group(); isle.userData.terrainAbsolute245 = true; root.add(isle);
  const bandMat = new T.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);}',
    fragmentShader: 'uniform float t;uniform float uDay;varying vec2 vUv;' + RUNE +
      'void main(){float x=vUv.x*420.;float id=floor(x);float g=rune661(vec2(x,vUv.y),id);float pulse=.55+.45*sin(t*1.3-x*.06);' +
      'float k=g*pulse*mix(1.,.55,uDay);gl_FragColor=vec4(vec3(.32,1.,.76)*k,k);}'
  });
  const curtainMat = new T.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);}',
    fragmentShader: 'uniform float t;uniform float uDay;varying vec2 vUv;' + NOISE +
      'void main(){float c=n661(vec2(vUv.x*900.,vUv.y*2.-t*.5))*.7+n661(vec2(vUv.x*2600.,vUv.y*5.-t*1.1))*.3;float k=pow(1.-vUv.y,2.2)*smoothstep(.35,.9,c);' +
      'k*=mix(.6,.3,uDay);gl_FragColor=vec4(vec3(.30,.95,.80)*k,k);}'
  });
  function buildIsle() {
    const r = TH.r0 - 1; // linha d'água do lado da cidade
    const band = abs(new T.Mesh(new T.RingGeometry(r - 4, r + 1, 512, 1), bandMat));
    { const g = band.geometry, p = g.attributes.position, uv = g.attributes.uv; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), a = Math.atan2(y, x) / 6.2832 + .5, rr = Math.hypot(x, y); uv.setXY(i, a, (rr - (r - 4)) / 5); } }
    band.rotation.x = -Math.PI / 2; band.position.set(TH.x, -.82, TH.z); band.renderOrder = 6; isle.add(band);
    const cur = abs(new T.Mesh(new T.CylinderGeometry(r + .5, r + .5, 16, 256, 1, true), curtainMat)); cur.position.set(TH.x, -.9 + 8, TH.z); cur.renderOrder = 6; isle.add(cur);
    /* pedras soltas no canal, presas pela mesma magia (fora dos aterros) */
    /* pedra solta = lasca de terra arrancada: topo quase plano com musgo, fundo afinando em pontas (relevo irregular, sem forma lisa) */
    const geo = new T.IcosahedronGeometry(1, 3); { const p = geo.attributes.position, col = [], S = Math.sin;
      for (let i = 0; i < p.count; i++) { let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
        const n = .55 * S(x * 3.1 + z * 1.7) * S(y * 2.3 - z * 2.9) + .25 * S(x * 7.3 - y * 5.1 + z * 2.2) + .12 * S(x * 13.7 + z * 11.3 - y * 9.1), k = .82 + n * .28;
        if (y > .15) y = .15 + (y - .15) * .35; else y *= 1.25 + .55 * Math.max(0, -y) * (1 + S(x * 5 + z * 4)); // topo achatado, fundo em ponta
        const r = y < 0 ? 1 - Math.min(.75, -y * .38) : 1; p.setXYZ(i, x * k * r * 1.35, y * (y < 0 ? k : 1), z * k * r * 1.2);
        const top = y > .1 ? 1 : 0, g = .85 + .3 * n; col.push(top ? .36 * g : .42 * g, top ? .44 * g : .40 * g, top ? .27 * g : .36 * g); }
      geo.setAttribute('color', new T.Float32BufferAttribute(col, 3)); geo.computeVertexNormals(); }
    const rock = new T.MeshLambertMaterial({ color: 0xffffff, vertexColors: true, emissive: 0x04110c });
    const N = 44, inst = abs(new T.InstancedMesh(geo, rock, N)), list = [];
    let seed = 661; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0, tries = 0; i < N && tries < 600; tries++) {
      const a = rnd() * 6.2832, rr = TH.r0 + 12 + rnd() * (TH.r1 - TH.r0 - 24), x = TH.x + Math.cos(a) * rr, z = TH.z + Math.sin(a) * rr;
      if (TER.moat661(x, z) < 40 || TER.SEA439.d(x, z) > 250) continue; // só no canal, longe dos aterros e do alto-mar
      list.push({ x, z, y: 5 + rnd() * 16, s: (2.4 + rnd() * 4.6) * (rnd() < .15 ? 2.2 : 1), ry: rnd() * 6.28, ph: rnd() * 6.28, sp: .15 + rnd() * .25 }); i++;
    }
    inst.count = list.length; isle.add(inst);
    /* brilho na água embaixo de cada pedra */
    const glowMat = new T.ShaderMaterial({ uniforms: U, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*viewMatrix*modelMatrix*instanceMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform float t;uniform float uDay;varying vec2 vUv;void main(){float r=length(vUv-.5)*2.;float k=(1.-smoothstep(0.,1.,r))*mix(.7,.3,uDay)*(.7+.3*sin(t*2.));gl_FragColor=vec4(vec3(.3,1.,.78)*k*k,k*k);}' });
    const gg = new T.PlaneGeometry(1, 1); gg.rotateX(-Math.PI / 2); const glow = abs(new T.InstancedMesh(gg, glowMat, list.length)); isle.add(glow);
    const m = new T.Matrix4(), q = new T.Quaternion(), e = new T.Euler(), v = new T.Vector3(), sc = new T.Vector3();
    for (let i = 0; i < list.length; i++) { const o = list[i]; m.compose(v.set(o.x, -.78, o.z), q.set(0, 0, 0, 1), sc.set(o.s * 5, 1, o.s * 5)); glow.setMatrixAt(i, m); }
    glow.instanceMatrix.needsUpdate = true;
    isle.userData.tick = t => { for (let i = 0; i < list.length; i++) { const o = list[i]; e.set(Math.sin(t * .2 + o.ph) * .15, o.ry + t * o.sp * .3, Math.cos(t * .17 + o.ph) * .12); q.setFromEuler(e);
      m.compose(v.set(o.x, -.9 + o.y + Math.sin(t * o.sp * 2 + o.ph) * .7, o.z), q, sc.set(o.s, o.s, o.s)); inst.setMatrixAt(i, m); } inst.instanceMatrix.needsUpdate = true; };
  }

  function dayK() { try { const p = ((dayT % DAYLEN) + DAYLEN) % DAYLEN / DAYLEN, a = NIGHT0_377, b = NIGHT1_377, ss = (e0, e1, x) => { const q = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return q * q * (3 - 2 * q); };
    return p < a ? 1 - ss(a - .05, a, p) : p > b ? ss(b, b + .04, p) : 0; } catch (_) { return 1; } }

  let built = false, last = performance.now();
  const seen = () => (profile.agua661 = profile.agua661 || {});
  function loop() {
    const now = performance.now(), dt = Math.min(.1, (now - last) / 1000); last = now;
    try {
      const on = ready() && L.mode === 'world' && !L.grid && TER.on.value && !(TER.OW.value.x > .5);
      if (on && !built) { built = true; buildAll(); buildIsle(); }
      root.visible = on;
      if (on) {
        U.t.value += dt; U.uDay.value = dayK(); if (isle.userData.tick) isle.userData.tick(U.t.value);
        const dT = Math.hypot(player.x - TH.x, player.z - TH.z), S = seen();
        if (!S.ilha && dT < TH.r1 + 120) { S.ilha = 1; toast('<b>[THALOR]</b> A cidade-ilha flutua sobre o Mar de Thalor pela magia antiga dos afogados. As runas na linha d\'água ainda seguram as pedras do canal.', 8000); }
        if (!S.queda && falls.some(f => Math.hypot(player.x - f.tx, player.z - f.tz) < 260)) { S.queda = 1; toast('<b>[NASCENTE]</b> A água do Mar de Thalor sobe pela magia dos afogados, corre por dentro da serra e despenca aqui. Todo rio de Primeva nasce numa cachoeira assim.', 8000); }
      }
    } catch (e) { if (!loop.err) { loop.err = 1; console.warn('cachoeiras661', e); } }
    setTimeout(loop, 16);
  }
  loop();
  window.Cachoeiras661 = { root, falls, U };
})();
