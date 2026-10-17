/* v460 (Ian, 16/10/2026): "é pra ser outro mundo. Tu entrou na fenda, o portal some, é outro lugar; não pode sair até matar o chefe."
   v461 (Ian, 17/10/2026): "o planeta tem que ser procedural infinito… não quero marcação de onde tá o chefe ou as energias brilhando
   alto, é pra ser difícil sair de lá."
   A Fenda comum é um planeta aberto e INFINITO: relevo próprio (terrain245 owH460, sem borda), céu alienígena (planeta gigante,
   anel, luas, aurora, estrelas), chão que acompanha o jogador e pedaços de 64 m gerados em volta dele (formações, flora,
   rochas flutuantes, recursos, acampamentos de monstros), tudo com modelos que já existem (Kenney + Tripo, 0 créditos).
   A colisão é uma grade virtual calculada na hora (L.grid.cells é um Proxy). Nada de feixe no céu nem marca no mapa: os
   3 Sinais de Energia são cristais baixos que, rastreados, apontam o próximo por um rastro no chão; os veios do chão pulsam
   a partir da Cidadela. O portal de chegada desmorona atrás do jogador; o de volta só abre na Cidadela com o Soberano morto.
   v464 (Ian, 17/10/2026): "não deixa o chefe preso numa gaiola, esquece esse negócio de energia, o chefe tem que estar solto…
   eu posso sair a qualquer momento achando a fenda de onde eu entrei; toda vez que eu entro numa fenda ela some atrás de mim
   e aparece em algum lugar; matando o chefe surge uma nova fenda." Sem Cidadela, sem sinais: o Soberano anda solto em volta
   do covil; a Fenda de entrada reaparece em algum lugar deste mundo (sem marca) e leva de volta; a morte do Soberano rasga
   uma Fenda nova onde ele cair. Portal vermelho: a Fenda de volta fica selada até o Soberano cair (regra antiga). */
(function () {
  'use strict';
  const T = THREE, TAU = Math.PI * 2;
  const SKIP = ['extract']; /* core vira defesa na Cidadela; floors vira 3 zonas com os mesmos baús */

  /* Um mundo por bioma do portal (mesmos ids da v458 OTHERWORLDS456). */
  const WORLDS = {
    erebo: { zen: 0x07021a, hor: 0x4a2a88, fog: 0x2c1858, fogD: .0072, gr: [0x2e2448, 0x40306a, 0x1f1a36], rock: 0x2f2646, peak: 0x6a5a92, vein: 0xc07bff, sun: 0xe0c4ff, sunI: 1.05, hs: 0xa58aff, hg: 0x281a40, hI: .8, pl: [0x8a5ae6, 0x2c1a66, 0xe6c8ff], moon: [0xd8c8ff, 0x9a7ad8], aur: 0x8a5aff, cry: ['cristal-ancora-violeta', 'cristal-ancora-turquesa'], tint: 0x9b7be5, trees: ['tree_dead_large', 'tree_dead_medium', 'tree_thin'], big: ['spire', 'crystal', 'crystal', 'tree', 'ruin', 'mesa'], small: ['grass_large', 'grass_leafsLarge', 'plant_flatTall', 'flower_purpleA', 'flower_purpleB', 'rock_smallA', 'rock_smallC'], part: 'motes', pc: 0xd8b0ff },
    esporo: { zen: 0x01120c, hor: 0x1f6a50, fog: 0x154a36, fogD: .0078, gr: [0x1f3d2c, 0x2d5f3e, 0x163024], rock: 0x26402f, peak: 0x46705a, vein: 0x5dffb8, sun: 0xc8ffe8, sunI: 1.0, hs: 0x8cf5cc, hg: 0x0f2a1d, hI: .82, pl: [0x46c99a, 0x0f4a3a, 0xc0ffe4], moon: [0xd0ffe8, 0x7ad8b0], aur: 0x3cffb0, cry: ['cristal-ancora-verde', 'cristal-ancora-turquesa'], tint: 0x5ee0a8, trees: ['tree_oak_dark', 'tree_fat', 'tree_plateau'], big: ['shroom', 'shroom', 'tree', 'tree', 'crystal', 'spire'], small: ['grass_large', 'grass_leafsLarge', 'grass_leafs', 'plant_bushSmall', 'mushroom_red', 'mushroom_tanGroup', 'plant_flatShort'], part: 'spores', pc: 0x9dffd0 },
    forja: { zen: 0x150204, hor: 0x7a2414, fog: 0x4e160e, fogD: .0080, gr: [0x2c1814, 0x3c2018, 0x1a0f0c], rock: 0x281816, peak: 0x463028, vein: 0xff6a1e, sun: 0xffa070, sunI: 1.1, hs: 0xff9a70, hg: 0x2a0c08, hI: .75, pl: [0xff7a30, 0x5a1206, 0xffc090], moon: [0xffd0b0, 0xd86a40], aur: 0xff5030, cry: ['cristal-ancora-ambar'], tint: 0xb85a40, trees: ['tree_dead_large', 'tree_dead_medium', 'tree_dead_small'], big: ['spire', 'spire', 'mesa', 'crystal', 'ruin', 'tree'], small: ['rock_smallA', 'rock_smallC', 'rock_smallFlatA', 'grass', 'plant_flatShort', 'bone_A'], part: 'embers', pc: 0xffa040 },
    crio: { zen: 0x020818, hor: 0x2a5a8a, fog: 0x1d4266, fogD: .0070, gr: [0xc9dceb, 0xa2bcd0, 0xe8f3fb], rock: 0x5c6e84, peak: 0xf2f8ff, vein: 0x70f4ff, sun: 0xcdeeff, sunI: 1.15, hs: 0xc4ebff, hg: 0x2c3c50, hI: .85, pl: [0x70bcff, 0x1c3c6e, 0xd8f6ff], moon: [0xeaf6ff, 0x9cc8ee], aur: 0x60ffd8, cry: ['cristal-ancora-gelo', 'cristal-ancora-turquesa'], tint: 0xdcefff, trees: ['tree_pineRoundA', 'tree_pineTallA_detailed', 'tree_cone'], big: ['crystal', 'crystal', 'spire', 'tree', 'tree', 'ruin'], small: ['rock_smallA', 'rock_smallC', 'grass', 'plant_flatShort', 'rock_smallFlatA'], part: 'snow', pc: 0xffffff },
    ambar: { zen: 0x170c02, hor: 0x9a6422, fog: 0x74491a, fogD: .0074, gr: [0xb48444, 0xcc9a52, 0x8c6434], rock: 0x6c4c2c, peak: 0x9a7046, vein: 0xffc24a, sun: 0xffd890, sunI: 1.2, hs: 0xffdc98, hg: 0x3c2612, hI: .85, pl: [0xffbc4e, 0x7c4012, 0xfff2c4], moon: [0xfff0d0, 0xd8a060], aur: 0xffb040, cry: ['cristal-ancora-ambar'], tint: 0xe0a860, trees: ['cactus_tall', 'cactus_short', 'tree_dead_small'], big: ['mesa', 'spire', 'cactus', 'ruin', 'crystal', 'mesa'], small: ['rock_smallA', 'rock_smallC', 'rock_smallFlatA', 'plant_flatShort', 'bone_A', 'cactus_short'], part: 'sand', pc: 0xffe0a0 }
  };
  const ZONES = ['Zona 1 · Fronteira da Fenda', 'Zona 2 · Ermos do Outro Mundo', 'Zona 3 · Covil do Soberano'];

  const absolute = o => { o.userData.terrainAbsolute245 = true; return o; };
  /* pedra por altura sem passar pela troca automática da v446 (que põe o pedregulho do Tripo sem a cor do mundo): dentro da Fenda o EW mantém a pedra tingida */
  const EHk = (b, k, x, y, z, ry, H, t) => { const m = ENV.m[k]; return m ? EW(b, k, x, y, z, ry, H * m.w / m.h, t) : 0; };

  /* ---------- GLB do repositório (Tripo): cristais, rocha flutuante, cactos ---------- */
  const glbCache = new Map();
  function glb(path) {
    if (glbCache.has(path)) return glbCache.get(path);
    const p = new Promise(res => {
      if (!T.GLTFLoader) { res(null); return; }
      const l = new T.GLTFLoader(); if (window.MeshoptDecoder) l.setMeshoptDecoder(MeshoptDecoder);
      l.load(path, g => {
        const root = g.scene; root.updateMatrixWorld(true);
        root.traverse(o => { if (o.isMesh) { o.geometry.userData.shared = true; o.castShadow = false; o.receiveShadow = false; } });
        const b = new T.Box3().setFromObject(root), s = b.getSize(new T.Vector3()), wrap = new T.Group();
        root.position.x -= (b.min.x + b.max.x) / 2; root.position.y -= b.min.y; root.position.z -= (b.min.z + b.max.z) / 2;
        wrap.add(root); wrap.userData.h = s.y || 1; wrap.userData.w = Math.max(s.x, s.z) || 1; res(wrap);
      }, undefined, () => res(null));
    });
    glbCache.set(path, p); return p;
  }
  const crystalPath = n => 'models/m434/' + n + '.glb';
  const uT = { value: 0 };
  /* Cristal do Tripo com brilho interno e borda de fresnel (pedido antigo de Ian: cristal bonito, não chapado). */
  const cryMats = new Map();
  function crystalMat(src, col) {
    const key = (src.uuid || '') + col; if (cryMats.has(key)) return cryMats.get(key);
    const m = new T.MeshStandardMaterial({ map: src.map || null, color: src.map ? 0xffffff : (src.color || new T.Color(col)), roughness: .22, metalness: .08, side: T.DoubleSide });
    if (m.map) { m.map.encoding = T.sRGBEncoding; m.emissiveMap = m.map; }
    m.emissive = new T.Color(col).multiplyScalar(.55);
    const rim = { value: new T.Color(col) };
    m.onBeforeCompile = sh => {
      sh.uniforms.uRim460 = rim; sh.uniforms.uT460 = uT;
      sh.fragmentShader = 'uniform vec3 uRim460;uniform float uT460;\n' + sh.fragmentShader.replace('#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\n{float fr=pow(1.-abs(dot(normalize(normal),normalize(vViewPosition))),2.4);totalEmissiveRadiance+=uRim460*(fr*1.5+.12+.10*sin(uT460*1.7+vViewPosition.y*.6));}');
    };
    m.customProgramCacheKey = () => 'ow460cry';
    m.userData.shared = true; cryMats.set(key, m); return m;
  }
  const rockMats = new Map();
  function rockMat(src, tint, glow = .18) {
    const key = (src.uuid || '') + tint + glow; if (rockMats.has(key)) return rockMats.get(key);
    const m = new T.MeshStandardMaterial({ map: src.map || null, color: new T.Color(tint).multiplyScalar(1.6), roughness: .9, metalness: 0, side: T.DoubleSide });
    if (m.map) { m.map.encoding = T.sRGBEncoding; m.emissiveMap = m.map; m.emissive = new T.Color(tint).multiplyScalar(glow); }
    m.userData.shared = true; rockMats.set(key, m); return m;
  }
  function placeGlb(parent, path, H, x, y, z, ry, mat) {
    return glb(path).then(tpl => {
      if (!tpl || !parent.parent) return null;
      const g = tpl.clone(true), k = H / tpl.userData.h; g.scale.setScalar(k);
      g.traverse(o => { if (o.isMesh) o.material = Array.isArray(o.material) ? o.material.map(mat) : mat(o.material); });
      const h = new T.Group(); h.position.set(x, y, z); h.rotation.y = ry; h.add(g); parent.add(h); return h;
    });
  }

  /* ---------- Shaders: céu, planeta, anel, lua, água, partículas, runas ---------- */
  const NOISE = `float h31(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*n3(p);p*=2.03;a*=.5;}return s;}
`;
  function skyMat(W) {
    return new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false, fog: false,
      uniforms: { uZen: { value: new T.Color(W.zen) }, uHor: { value: new T.Color(W.hor) }, uAur: { value: new T.Color(W.aur) }, uGlow: { value: new T.Color(W.vein) }, uT, uDay: { value: 1 } },
      vertexShader: 'varying vec3 vD;void main(){vD=position;vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;gl_Position.z=gl_Position.w*.99995;}',
      fragmentShader: 'uniform vec3 uZen,uHor,uAur,uGlow;uniform float uT,uDay;varying vec3 vD;\n' + NOISE +
        'void main(){vec3 d=normalize(vD);float h=d.y;vec3 c=mix(uHor,uZen,pow(smoothstep(-.08,.9,h),.65));c*=mix(.55,1.,uDay);' +
        'c+=uHor*.35*exp(-abs(h)*7.);' +
        'float n=fbm(d*2.6+vec3(0.,uT*.006,uT*.003));c+=uGlow*.22*smoothstep(.5,.95,n)*smoothstep(-.05,.5,h);' +
        'float band=sin(d.x*7.+uT*.22+sin(d.z*4.+uT*.15)*2.2)*.5+.5;float cur=smoothstep(.55,1.,sin(d.z*2.6+d.x*1.7+uT*.08)*.5+.5);' +
        'c+=uAur*band*cur*smoothstep(.12,.4,h)*smoothstep(.9,.5,h)*(.45+.35*(1.-uDay));' +
        'vec3 qq=d*420.,q=floor(qq);float st=h31(q);float sd=length(fract(qq)-.5);c+=vec3(step(.9978,st)*smoothstep(.42,.05,sd)*smoothstep(0.,.35,h)*(.6+.4*sin(uT*2.6+st*90.))*(1.-uDay*.5));' +
        'gl_FragColor=vec4(c,1.);}'
    });
  }
  function planetMat(W) {
    return new T.ShaderMaterial({
      depthWrite: false, fog: false,
      uniforms: { uA: { value: new T.Color(W.pl[0]) }, uB: { value: new T.Color(W.pl[1]) }, uR: { value: new T.Color(W.pl[2]) }, uL: { value: new T.Vector3(-.6, .35, .7).normalize() }, uT },
      vertexShader: 'varying vec3 vP;varying vec3 vN;varying vec3 vW;void main(){vP=position;vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;gl_Position.z=gl_Position.w*.99990;}',
      fragmentShader: 'uniform vec3 uA,uB,uR,uL;uniform float uT;varying vec3 vP;varying vec3 vN;varying vec3 vW;\n' + NOISE +
        'void main(){vec3 p=normalize(vP);float w=fbm(p*3.+vec3(uT*.01,0.,0.));float band=sin(p.y*16.+w*4.)*.5+.5;vec3 c=mix(uA,uB,band);' +
        'c=mix(c,uR,smoothstep(.72,.95,fbm(p*7.-vec3(0.,uT*.02,0.)))*.35);' +
        'float spot=smoothstep(.16,.0,length(vec2(atan(p.z,p.x)*.5-uT*.004-1.1,p.y*1.4+.25)));c=mix(c,uR,spot*.6);' +
        'vec3 n=normalize(vN);float l=clamp(dot(n,uL)*1.05+.08,0.,1.);c*=l;' +
        'vec3 V=normalize(cameraPosition-vW);float fr=pow(1.-max(dot(n,V),0.),3.);c+=uR*fr*1.2;gl_FragColor=vec4(c,1.);}'
    });
  }
  function ringMat(W) {
    return new T.ShaderMaterial({
      transparent: true, depthWrite: false, fog: false, side: T.DoubleSide,
      uniforms: { uC: { value: new T.Color(W.pl[2]) }, uB: { value: new T.Color(W.pl[0]) }, uT },
      vertexShader: 'varying vec2 vP;void main(){vP=position.xy;vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;gl_Position.z=gl_Position.w*.99992;}',
      fragmentShader: 'uniform vec3 uC,uB;uniform float uT;varying vec2 vP;void main(){float r=length(vP);float t=(r-62.)/38.;float b=sin(t*60.)*.5+.5;b*=sin(t*23.+1.3)*.5+.5;' +
        'float a=smoothstep(0.,.06,t)*smoothstep(1.,.86,t)*(.25+.6*b);gl_FragColor=vec4(mix(uB,uC,b),a*.7);}'
    });
  }
  function moonMat(col) {
    return new T.ShaderMaterial({
      depthWrite: false, fog: false,
      uniforms: { uC: { value: new T.Color(col) }, uL: { value: new T.Vector3(-.6, .35, .7).normalize() } },
      vertexShader: 'varying vec3 vP;varying vec3 vN;void main(){vP=position;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_Position.z=gl_Position.w*.99991;}',
      fragmentShader: 'uniform vec3 uC,uL;varying vec3 vP;varying vec3 vN;\n' + NOISE +
        'void main(){vec3 p=normalize(vP);float cr=fbm(p*6.);float k=.75+.35*cr-.25*smoothstep(.6,.7,n3(p*9.));float l=clamp(dot(normalize(vN),uL)+.12,0.,1.);gl_FragColor=vec4(uC*k*l+uC*.06,1.);}'
    });
  }
  function runeMat(col, k = 1) {
    return new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
      uniforms: { uC: { value: new T.Color(col).multiplyScalar(k) }, uT },
      vertexShader: 'varying vec2 vP;void main(){vP=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform vec3 uC;uniform float uT;varying vec2 vP;void main(){float r=length(vP);float a=atan(vP.y,vP.x);' +
        'float rune=step(.55,fract(a*4.77+uT*.25))*smoothstep(.82,.78,r)*smoothstep(.62,.66,r);float ring=smoothstep(.025,0.,abs(r-.9))+smoothstep(.02,0.,abs(r-.55))+smoothstep(.03,0.,abs(r-.98));' +
        'float spokes=smoothstep(.02,0.,abs(sin(a*6.+uT*.1)))*step(r,.55)*step(.18,r)*.5;float glow=smoothstep(1.,0.,r)*.14*(.6+.4*sin(uT*2.));' +
        'gl_FragColor=vec4(uC*1.3,clamp(rune*.8+ring+spokes+glow,0.,1.)*smoothstep(1.02,.97,r));}'
    });
  }
  function waterMat(col, deep) {
    return new T.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uC: { value: new T.Color(col) }, uD: { value: new T.Color(deep) }, uT },
      vertexShader: 'varying vec2 vP;void main(){vP=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform vec3 uC,uD;uniform float uT;varying vec2 vP;\n' + NOISE +
        'void main(){float r=length(vP);float n=fbm(vec3(vP*1.7,uT*.35));float rip=sin(r*9.-uT*2.2)*.5+.5;vec3 c=mix(uD,uC,smoothstep(.2,1.,r)*.6+n*.4);' +
        'c+=uC*pow(rip*n,3.)*1.4;float a=smoothstep(1.,.86,r)*.88;gl_FragColor=vec4(c,a);}'
    });
  }
  function curtainMat(col) {
    return new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
      uniforms: { uC: { value: new T.Color(col) }, uT },
      vertexShader: 'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform vec3 uC;uniform float uT;varying vec2 vU;\n' + NOISE +
        'void main(){vec2 g=vU*vec2(9.,6.);vec2 c=fract(g)-.5;float hex=smoothstep(.05,.0,abs(max(abs(c.x)*1.15+abs(c.y)*.6,abs(c.y)*1.2)-.42));' +
        'float n=fbm(vec3(vU*5.,uT*.6));float a=(hex*.8+n*.35)*smoothstep(0.,.08,vU.y)*smoothstep(1.,.8,vU.y)*smoothstep(0.,.06,vU.x)*smoothstep(1.,.94,vU.x);gl_FragColor=vec4(uC*1.4,a*(.65+.35*sin(uT*3.)));}'
    });
  }
  function particles(W) {
    const n = W.part === 'snow' ? 1400 : W.part === 'sand' ? 1100 : 900, P = new Float32Array(n * 3), A = new Float32Array(n), R = mulberry32(459);
    for (let i = 0; i < n; i++) { P[i * 3] = R(); P[i * 3 + 1] = R(); P[i * 3 + 2] = R(); A[i] = R(); }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(P, 3)); g.setAttribute('aR', new T.BufferAttribute(A, 1));
    const vel = { snow: [0, -1.3, 0], embers: [0, 1.1, 0], spores: [0, .35, 0], sand: [5.5, -.2, 1.5], motes: [0, .25, 0] }[W.part] || [0, .3, 0];
    const size = { snow: .16, embers: .14, spores: .2, sand: .07, motes: .18 }[W.part] || .15;
    const m = new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: W.part === 'sand' || W.part === 'snow' ? T.NormalBlending : T.AdditiveBlending, fog: false,
      uniforms: { uC: { value: new T.Color(W.pc) }, uP: { value: new T.Vector3() }, uT, uV: { value: new T.Vector3(...vel) }, uS: { value: size } },
      vertexShader: 'uniform vec3 uP,uV;uniform float uT,uS;attribute float aR;varying float vA;void main(){vec3 B=vec3(80.,34.,80.);vec3 p=position*B+uV*uT*(.6+.8*aR);' +
        'p.x+=sin(uT*.4+aR*20.)*1.8;p.z+=cos(uT*.33+aR*13.)*1.8;p=mod(p-uP+B*.5,B)+uP-B*.5;vec4 mv=viewMatrix*vec4(p,1.);' +
        'float d=-mv.z;vA=smoothstep(60.,18.,d)*smoothstep(.5,2.,d)*(.55+.45*sin(uT*2.+aR*40.));gl_PointSize=uS*(260./max(d,.1))*(.6+.8*aR);gl_Position=projectionMatrix*mv;}',
      fragmentShader: 'uniform vec3 uC;varying float vA;void main(){vec2 q=gl_PointCoord-.5;float a=smoothstep(.5,.0,length(q));gl_FragColor=vec4(uC,a*vA);}'
    });
    const pts = absolute(new T.Points(g, m)); pts.frustumCulled = false; pts.renderOrder = 8; return pts;
  }

  /* ---------- Chão infinito: malha que acompanha o jogador; altura, cor e veios calculados na placa de vídeo pela posição no mundo ---------- */
  let groundTex = null;
  const GSIZE = 600, GSEG = 214, GSTEP = GSIZE / GSEG;
  function groundMesh(W, st) {
    const geo = new T.PlaneGeometry(GSIZE, GSIZE, GSEG, GSEG); geo.rotateX(-Math.PI / 2);
    if (!groundTex && typeof envGroundTex === 'function') { groundTex = envGroundTex(); }
    const tex = groundTex ? groundTex.clone() : null; if (tex) { tex.needsUpdate = true; tex.repeat.set(GSIZE / 5.6, GSIZE / 5.6); }
    const mat = new T.MeshStandardMaterial({ map: tex, roughness: .93, metalness: 0 });
    const U = { uG0: { value: new T.Color(W.gr[0]) }, uG1: { value: new T.Color(W.gr[1]) }, uG2: { value: new T.Color(W.gr[2]) }, uRock: { value: new T.Color(W.rock) }, uPeak: { value: new T.Color(W.peak) },
      uVein: { value: new T.Color(W.vein) }, uBoss: { value: new T.Vector2(st.boss.x, st.boss.z) }, uT };
    mat.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, U);
      // TER_NORMAL245: o relevo (terrain245) levanta cada vértice e inclina a normal, como o chão do mundo
      sh.vertexShader = '#define TER_NORMAL245\nvarying vec3 vOw460;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvOw460=(modelMatrix*vec4(transformed,1.)).xyz;vOw460.y=terrH245(vOw460.xz);');
      sh.fragmentShader = 'uniform vec3 uG0,uG1,uG2,uRock,uPeak,uVein;uniform vec2 uBoss;uniform float uT;varying vec3 vOw460;\n' + sh.fragmentShader.replace('#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\n{vec2 q=vOw460.xz;' +
        'float n1=.5+.5*sin(q.x*.031+sin(q.y*.023)*2.)*sin(q.y*.027+sin(q.x*.019)*1.7),n2=.5+.5*sin(q.x*.11+q.y*.07)*sin(q.y*.09-q.x*.05),n3=.5+.5*sin(q.x*.37+sin(q.y*.29))*sin(q.y*.33-q.x*.21);' +
        'vec3 c=mix(uG0,uG1,n1);c=mix(c,uG2,smoothstep(.55,.9,n2)*.7);c*=.78+.44*n3;c=mix(c,uG2,smoothstep(.62,.95,n1*n3)*.55);' +
        'vec3 wn=normalize((vec4(normal,0.)*viewMatrix).xyz);c=mix(c,uRock,smoothstep(.94,.72,wn.y));c=mix(c,uPeak,smoothstep(14.,40.,vOw460.y)*.85);' +
        'diffuseColor.rgb*=c;' +
        'float w1=abs(sin(q.x*.19+sin(q.y*.11)*2.3)*sin(q.y*.17+sin(q.x*.13)*1.9)),w2=abs(sin(q.x*.07-q.y*.05+1.3)*sin(q.y*.06+q.x*.04));' +
        'float pulse=.5+.5*sin(uT*1.3+n2*6.);float line=smoothstep(.022,.0,w2)*.8+smoothstep(.03,.0,w1)*.3;' +
        'totalEmissiveRadiance+=uVein*line*(.05+.08*pulse);}');
    };
    mat.customProgramCacheKey = () => 'ow461ground';
    const m = new T.Mesh(geo, mat); m.userData.own = 1; m.name = 'ow460-ground'; m.receiveShadow = true; m.frustumCulled = false; return m;
  }

  /* ---------- Grade virtual infinita, pedaços e caminho ---------- */
  /* ---------- v461 (Ian): planeta procedural INFINITO — grade virtual, pedaços gerados em volta do jogador ---------- */
  const NV = 1 << 20, CSV = 2, OXV = -NV * CSV / 2;          // ~2.000 km de lado: infinito na prática
  const CHK = 64, VIEW = 4, KEEP = 6;                            // pedaço de 64 m; desenha 4 pedaços em volta, guarda 6
  const CAMP_CHK = 160;                                          // um acampamento possível a cada 160 m
  const hash2 = (a, b, s) => { let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul((s * 1e4) | 0, 2246822519)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return (h ^ (h >>> 16)) >>> 0; };
  const cellCenter = i => { const cx = i % NV, cy = (i - cx) / NV; return { x: OXV + (cx + .5) * CSV, z: OXV + (cy + .5) * CSV }; };
  const cellOf = (x, z) => ({ x: Math.floor((x - OXV) / CSV), y: Math.floor((z - OXV) / CSV) });

  /* formações de um pedaço (determinístico; usado para desenhar E para colidir) */
  function chunkData(st, cx, cz) {
    const key = cx + ',' + cz; let d = st.chunkCache.get(key); if (d) return d;
    const R = mulberry32(hash2(cx, cz, st.seed)), W0 = st.W || WORLDS.erebo, forms = [];
    const n = R() < .15 ? 0 : R() < .45 ? 1 : R() < .75 ? 2 : 3;
    for (let k = 0; k < n * 3 && forms.length < n; k++) {
      const x = (cx + R()) * CHK, z = (cz + R()) * CHK, db = Math.hypot(x - st.boss.x, z - st.boss.z);
      let type = W0.big[Math.floor(R() * W0.big.length)]; if (db < 160 && R() < .5) type = 'crystal';
      const H = type === 'spire' ? 9 + R() * 11 : type === 'mesa' ? 5 + R() * 5 : type === 'crystal' ? 7 + R() * 8 : type === 'shroom' ? 5 + R() * 5 : type === 'cactus' ? 5 + R() * 4 : type === 'ruin' ? 4 + R() * 5 : 10 + R() * 7;
      const r = type === 'spire' ? H * .2 : type === 'mesa' ? H * .7 : type === 'crystal' ? H * .17 : type === 'shroom' ? H * .3 : type === 'cactus' ? 1.1 : type === 'ruin' ? 1.3 : 1.1;
      if (st.reserved.some(p => Math.hypot(p.x - x, p.z - z) < p.r + r + 4)) continue;
      if (forms.some(f => Math.hypot(f.x - x, f.z - z) < f.r + r + 7)) continue;
      forms.push({ type, x, z, H, r, ry: R() * TAU, k: Math.floor(R() * 99) });
    }
    d = { forms }; st.chunkCache.set(key, d);
    if (st.chunkCache.size > 3000) { const it = st.chunkCache.keys(); for (let i = 0; i < 1000; i++) st.chunkCache.delete(it.next().value); }
    return d;
  }
  /* colisão: 1 = livre, 0 = bloqueado, 2 = portão selado da Cidadela */
  function cellAt(st, i) {
    if (st.over.has(i)) return st.over.get(i);
    const c = st.cellCache.get(i); if (c !== undefined) return c;
    const p = cellCenter(i); let v = 1;
    const cx = Math.floor(p.x / CHK), cz = Math.floor(p.z / CHK);
    outer: for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) for (const f of chunkData(st, cx + dx, cz + dz).forms) if (Math.hypot(f.x - p.x, f.z - p.z) <= f.r * .85) { v = 0; break outer; }
    if (st.cellCache.size > 250000) st.cellCache.clear();
    st.cellCache.set(i, v); return v;
  }
  function virtualGrid(st) {
    const num = k => (typeof k === 'string' && k !== '' && !isNaN(k)) ? +k : null;
    const cells = new Proxy({}, {
      get(_, k) { if (k === 'length') return NV * NV; const i = num(k); if (i === null) return undefined; return i < 0 ? 0 : cellAt(st, i); },
      set(_, k, v) { const i = num(k); if (i !== null) { st.over.set(i, v); st.cellCache.delete(i); } return true; }
    });
    const seen = new Set();
    const visited = new Proxy({}, {
      get(_, k) { if (k === 'length') return NV * NV; const i = num(k); return i !== null && seen.has(i) ? 1 : 0; },
      set(_, k, v) { const i = num(k); if (i !== null) { if (v) seen.add(i); else seen.delete(i); } return true; }
    });
    return { cells, visited };
  }
  /* caminho curto para monstro travado: busca numa janela local; longe demais = vai reto */
  function path(from, to) {
    const a = cellOf(from.x, from.z), b = cellOf(to.x, to.z);
    if (Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)) > 90) return [{ x: to.x, z: to.z }];
    const st = L.ow460, m = 16, x0 = Math.min(a.x, b.x) - m, y0 = Math.min(a.y, b.y) - m, w = Math.abs(a.x - b.x) + 2 * m + 1, h = Math.abs(a.y - b.y) + 2 * m + 1;
    const prev = new Int32Array(w * h).fill(-1), li = (x, y) => (y - y0) * w + (x - x0), s = li(a.x, a.y), e = li(b.x, b.y), q = [s]; prev[s] = s;
    for (let k = 0; k < q.length && prev[e] < 0; k++) {
      const v = q[k], x = v % w + x0, y = Math.floor(v / w) + y0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = x + dx, Y = y + dy; if (X < x0 || Y < y0 || X >= x0 + w || Y >= y0 + h) continue; const n = li(X, Y); if (prev[n] >= 0 || cellAt(st, Y * NV + X) !== 1) continue; prev[n] = v; q.push(n); }
    }
    if (prev[e] < 0) return [];
    const out = []; for (let n = e; n !== s; n = prev[n]) { const X = n % w + x0, Y = Math.floor(n / w) + y0; out.push({ x: OXV + (X + .5) * CSV, z: OXV + (Y + .5) * CSV }); }
    return out.reverse();
  }

  /* ---------- Layout: chegada, Cidadela longe, sinais e acampamentos fixos da rota ---------- */
  function applies(g, variant) {
    if (!window.TER245 || !TER245.owH460 || !g) return false;
    if (g.goblin118 || g.missionExtract117 || g.extractionCleared117 || g.noOw460) return false;
    return !SKIP.includes(variant);
  }
  function layout(g, R, variant, wid) {
    const TER = window.TER245, s = ((g.seed >>> 0) % 997) * .0063 + .3;
    TER.OW.value.set(1, 18 + R() * 14, 6.5 + R() * 2.5, s); // x liga, y altura das cordilheiras, z colinas, w semente
    // chegada perto da origem; a Cidadela fica longe (900–1300 m) numa direção qualquer — sem marca nenhuma
    const ex = (R() - .5) * 60, ez = (R() - .5) * 60, aB = R() * TAU, dB = 900 + R() * 400 + Math.min(9, g.rank || 0) * 20;
    const bx = ex + Math.cos(aB) * dB, bz = ez + Math.sin(aB) * dB;
    TER.OWB.value.set(ex, ez, bx, bz); TER.on.value = 1;
    const st = { W: WORLDS[wid] || WORLDS.erebo, seed: s, entry: { x: ex, z: ez }, boss: { x: bx, z: bz }, hunt: variant === 'hunt',
      reserved: [], over: new Map(), cellCache: new Map(), chunkCache: new Map(), chunks: new Map(), queue: [], dyn: new Map(), t: 0, zone: 1, zoneSeen: { 1: true }, lastDay: 0, floats: [] };
    const room = (x, z, half, kind) => { const c = cellOf(x, z); return { x: c.x - half, y: c.y - half, w: half * 2, h: half * 2, ow: kind, px: x, pz: z }; };
    // rota escondida (curva) da chegada até a Cidadela: acampamentos e sinais ficam perto dela, não em cima
    const px = -(bz - ez) / dB, pz = (bx - ex) / dB, off = (R() - .5) * 500, kx = (ex + bx) / 2 + px * off, kz = (ez + bz) / 2 + pz * off;
    const bez = t => ({ x: (1 - t) * (1 - t) * ex + 2 * (1 - t) * t * kx + t * t * bx, z: (1 - t) * (1 - t) * ez + 2 * (1 - t) * t * kz + t * t * bz });
    // a Fenda por onde você entrou reaparece em algum lugar deste mundo, longe da chegada e do covil (sem marca nenhuma)
    { let best = null; for (let k = 0; k < 40; k++) { const a = R() * TAU, d = 260 + R() * 360, x = ex + Math.cos(a) * d, z = ez + Math.sin(a) * d; if (Math.hypot(x - bx, z - bz) > 220) { best = { x, z }; break; } } st.rift = best || { x: ex - (bx - ex) * .35, z: ez - (bz - ez) * .35 }; }
    const camps = [];
    for (const t of [.1, .2, .32, .44, .56, .68, .8, .9]) { const p = bez(t), a = R() * TAU, j = 20 + R() * 60, r = room(p.x + Math.cos(a) * j, p.z + Math.sin(a) * j, 4, 'camp'); r.t = t; camps.push(r); }
    for (let k = 0; k < 5; k++) { const a = R() * TAU, d = 110 + R() * 190; camps.push(room(ex + Math.cos(a) * d, ez + Math.sin(a) * d, 4, 'camp')); }
    if (variant === 'floors') { const z1 = camps.find(c => c.t === .32), z2 = camps.find(c => c.t === .68); if (z1) { z1.floorEnd = true; z1.floor = 0; } if (z2) { z2.floorEnd = true; z2.floor = 1; } }
    st.reserved.push({ x: ex, z: ez, r: 18 }, { x: bx, z: bz, r: 30 }, { x: st.rift.x, z: st.rift.z, r: 10 }, ...camps.map(c => ({ x: c.px, z: c.pz, r: 11 })));
    const rooms = [room(ex, ez, 4, 'entry'), ...camps, room(bx, bz, 8, 'lair')], bi = rooms.length - 1;
    rooms[0].entry = true;
    const vg = virtualGrid(st);
    return { cells: vg.cells, visited: vg.visited, W: NV, H: NV, rooms, bi, st };
  }

  /* ---------- Render: céu, chão, Cidadela, partículas; o resto vem dos pedaços ---------- */
  function render(g, R, ow456) {
    const st = L.ow460, W = WORLDS[ow456?.id] || st.W || WORLDS.erebo; st.W = W; st.name = ow456?.name || 'Outro Mundo'; st.weather = ow456?.weather || '';
    scene.background = new T.Color(W.fog); scene.fog = new T.FogExp2(W.fog, W.fogD);
    hemi.color.setHex(W.hs); hemi.groundColor.setHex(W.hg); hemi.intensity = W.hI; sun.color.setHex(W.sun); sun.intensity = W.sunI; sun.position.set(-60, 70, 80);
    pLight.color.setHex(0xffe2c0); pLight.intensity = 1.1; pLight.distance = 18; L.cave155 = false; /* sem o véu escuro de caverna: é céu aberto */
    const grp = L.group;
    grp.add(st.ground = groundMesh(W, st));
    const sky = absolute(new T.Group()); sky.name = 'ow460-sky';
    const dome = new T.Mesh(new T.SphereGeometry(236, 48, 24), skyMat(W)); dome.frustumCulled = false; dome.renderOrder = -20; dome.userData.own = 1; sky.add(dome); st.skyU = dome.material.uniforms;
    const aP = R() * TAU, dirP = new T.Vector3(Math.cos(aP), .34, Math.sin(aP)).normalize();
    const planet = new T.Mesh(new T.SphereGeometry(44, 64, 40), planetMat(W)); planet.position.copy(dirP).multiplyScalar(205); planet.rotation.set(.3, .2, .45); planet.frustumCulled = false; planet.renderOrder = -19; planet.userData.own = 1; sky.add(planet);
    const ring = new T.Mesh(new T.RingGeometry(62, 100, 128, 1), ringMat(W)); ring.position.copy(planet.position); ring.lookAt(planet.position.clone().add(new T.Vector3(.35, 1, .2))); ring.frustumCulled = false; ring.renderOrder = -18; ring.userData.own = 1; sky.add(ring);
    [[.55, .52, -.4, 9, W.moon[0]], [-.7, .42, .25, 5.5, W.moon[1]]].forEach(([x, y, z, r, c]) => { const m = new T.Mesh(new T.SphereGeometry(r, 32, 20), moonMat(c)); m.position.set(x, y, z).normalize().multiplyScalar(215); m.frustumCulled = false; m.renderOrder = -19; m.userData.own = 1; sky.add(m); });
    grp.add(sky); st.sky = sky;
    buildLair(grp, W, st, R);
    grp.add(st.parts = particles(W));
    streamChunks(true, st.entry.x, st.entry.z);
  }

  /* covil do Soberano: ruínas e cristais soltos, sem muralha (ele não fica preso) */
  function buildLair(grp, W, st, R) {
    const { x: bx, z: bz } = st.boss, B = ENV.ok ? new EnvBatch() : null;
    for (let i = 0; i < 9; i++) {
      if (R() < .3) continue; const a = i / 9 * TAU + R() * .4, d = 16 + R() * 10, x = bx + Math.cos(a) * d, z = bz + Math.sin(a) * d;
      if (i % 3 === 0) placeGlb(grp, crystalPath(W.cry[i % W.cry.length]), 6 + R() * 6, x, -.4, z, R() * TAU, m => crystalMat(m, W.vein));
      else if (B) EH(B, ['statue_obelisk', 'statue_columnDamaged', 'column'][i % 3], x, -.3, z, R() * TAU, 4 + R() * 4, W.peak);
      if (B && R() < .6) EH(B, 'rubble_large', x + 1.2, -.2, z + .6, R() * TAU, 1.1, W.peak);
    }
    if (B) envOwn(grp, B.mesh(BLDMAT));
    const disc = new T.Mesh(new T.CircleGeometry(14, 96), runeMat(W.vein, .45)); disc.rotation.x = -Math.PI / 2; disc.position.set(bx, .07, bz); disc.renderOrder = 6; disc.userData.own = 1; grp.add(disc);
  }

  /* ---------- Pedaços: formações, flora, rochas flutuantes, recursos e acampamentos novos ---------- */
  function buildChunk(cx, cz) {
    const st = L.ow460, W = st.W, grp = new T.Group(), R = mulberry32(hash2(cx * 7 + 3, cz * 13 - 5, st.seed)), d = chunkData(st, cx, cz), inter = [];
    L.group.add(grp);
    if (ENV.ok) {
      const bigB = new EnvBatch(), treeB = new EnvBatch(), flora = new EnvBatch();
      for (const f of d.forms) {
        if (f.type === 'spire') EHk(bigB, ['rock_tallA', 'rock_tallB', 'rock_tallC'][f.k % 3], f.x, -.4, f.z, f.ry, f.H, W.rock);
        else if (f.type === 'mesa') EW(bigB, ['rock_largeA', 'rock_largeB', 'rock_largeC', 'rock_largeD'][f.k % 4], f.x, -.6, f.z, f.ry, f.r * 2.3, W.rock);
        else if (f.type === 'tree') EH(treeB, W.trees[f.k % W.trees.length], f.x, -.2, f.z, f.ry, f.H, W.tint);
        else if (f.type === 'shroom') EH(treeB, f.k % 2 ? 'mushroom_redGroup' : 'mushroom_tanGroup', f.x, -.1, f.z, f.ry, f.H, W.tint);
        else if (f.type === 'ruin') { const key = ['statue_obelisk', 'statue_columnDamaged', 'column', 'statue_column', 'pillar_decorated'][f.k % 5]; EH(bigB, key, f.x, -.3, f.z, f.ry, f.H, W.peak); EH(bigB, 'rubble_large', f.x + 1.4, -.2, f.z + .8, f.ry + 1, 1.2, W.peak); }
        else if (f.type === 'cactus') placeGlb(grp, 'models/tripo-cacto446' + (f.k % 2 ? 'a' : 'b') + '.glb', f.H, f.x, 0, f.z, f.ry, m => rockMat(m, W.tint));
        else if (f.type === 'crystal') { placeGlb(grp, crystalPath(W.cry[f.k % W.cry.length]), f.H, f.x, -.3, f.z, f.ry, m => crystalMat(m, W.vein)); EHk(bigB, 'rock_largeB', f.x, -.6, f.z, f.ry, f.H * .22, W.rock); }
      }
      const nearB = (x, z) => Math.hypot(x - st.boss.x, z - st.boss.z) < 12;
      for (let i = 0; i < 130; i++) {
        const x = (cx + R()) * CHK, z = (cz + R()) * CHK; if (nearB(x, z) || d.forms.some(f => Math.hypot(f.x - x, f.z - z) < f.r + .6)) continue;
        const k = W.small[Math.floor(R() * W.small.length)], rocky = k.startsWith('rock') || k === 'bone_A';
        (rocky ? EHk : EH)(flora, k, x, rocky ? -.05 : 0, z, R() * TAU, rocky ? .25 + R() * .55 : .35 + R() * .7, rocky ? W.peak : W.tint);
      }
      for (let i = 0; i < 4; i++) {
        const x = (cx + R()) * CHK, z = (cz + R()) * CHK; if (R() < .35 || Math.hypot(x - st.boss.x, z - st.boss.z) < 27 || d.forms.some(f => Math.hypot(f.x - x, f.z - z) < f.r + 2)) continue;
        const k = R() < .55 ? W.trees[Math.floor(R() * W.trees.length)] : (W.part === 'sand' ? 'cactus_short' : 'plant_bushLarge');
        EH(treeB, k, x, -.1, z, R() * TAU, k.startsWith('tree') ? 2.6 + R() * 2.4 : 1 + R() * 1.4, W.tint);
      }
      envOwn(grp, bigB.mesh(BLDMAT)); envOwn(grp, treeB.mesh(TREEMAT)); envOwn(grp, flora.mesh(FLORAMAT));
    }
    if (R() < .09) { const x = (cx + R()) * CHK, z = (cz + R()) * CHK, y = 14 + R() * 26, ph = R() * 9; placeGlb(grp, crystalPath('rocha-flutuante'), 3 + R() * 7, x, y, z, R() * TAU, m => rockMat(m, W.peak, .45)).then(h => { if (h) st.floats.push({ h, y, ph }); }); }
    if (R() < .3) {
      const kinds = ['lenha_abissal', 'fungo_astral', 'poca_abissal'], kind = kinds[Math.floor(R() * 3)], x = (cx + .2 + R() * .6) * CHK, z = (cz + .2 + R() * .6) * CHK;
      if (!d.forms.some(f => Math.hypot(f.x - x, f.z - z) < f.r + 2) && Math.hypot(x - st.boss.x, z - st.boss.z) > 30) inter.push(...resource(grp, W, kind, x, z, R));
    }
    for (const it of inter) L.inter.push(it);
    return { grp, inter };
  }
  function resource(parent, W, kind, x, z, R) {
    const rg = new T.Group(); rg.position.set(x, 0, z); parent.add(rg); let label; const out = [];
    const B = ENV.ok ? new EnvBatch() : null;
    if (kind === 'lenha_abissal') {
      if (B) { EH(B, 'log_large', 0, 0, 0, R() * TAU, .7, W.tint); EH(B, 'stump_old', 1.1, 0, -.6, R() * TAU, .9, W.tint); }
      placeGlb(rg, crystalPath('cristal-veio'), .9, .3, 0, .4, R() * TAU, m => crystalMat(m, W.vein));
      label = 'F · CORTAR LENHA E RESINA DO OUTRO MUNDO';
    } else if (kind === 'fungo_astral') {
      if (B) { EH(B, 'mushroom_redGroup', 0, 0, 0, R() * TAU, 1.1, W.tint); EH(B, 'mushroom_tanGroup', .9, 0, .5, R() * TAU, .8, W.vein); }
      label = 'F · COLHER FUNGOS E ERVAS DO OUTRO MUNDO';
    } else {
      const pool = new T.Mesh(new T.CircleGeometry(2.4, 48), waterMat(W.vein, W.gr[2])); pool.rotation.x = -Math.PI / 2; pool.position.y = .05; pool.renderOrder = 5; pool.userData.own = 1; rg.add(pool);
      if (B) for (let k = 0; k < 7; k++) { const a = k / 7 * TAU; EHk(B, k % 2 ? 'rock_smallA' : 'rock_smallC', Math.cos(a) * 2.5, -.05, Math.sin(a) * 2.5, a, .45, W.peak); }
      out.push({ type: 'riftCampWater456', x, z, r: 0, hidden: false, label: '', use() {} });
      label = 'F · ENCHER CANTIL / PESCAR NA POÇA DO OUTRO MUNDO';
    }
    if (B) { const m = B.mesh(FLORAMAT); if (m) { m.userData.own = 1; rg.add(m); } }
    const it = { type: 'riftRes456', kind, x, z, r: 2.8, grp: rg, charges: 2, label, use: () => gatherOtherworldRes456(it) };
    out.push(it); return out;
  }
  function dropChunk(key) {
    const c = L.ow460.chunks.get(key); if (!c) return;
    if (c.grp) { try { envDispose(c.grp); } catch (_) {} L.group.remove(c.grp); const fl = L.ow460.floats; for (let i = fl.length - 1; i >= 0; i--) { let p = fl[i].h; while (p && p !== c.grp) p = p.parent; if (p === c.grp) fl.splice(i, 1); } }
    for (const it of c.inter) { const i = L.inter.indexOf(it); if (i >= 0) L.inter.splice(i, 1); }
    L.ow460.chunks.delete(key);
  }
  function streamChunks(all, x0 = player.x, z0 = player.z) {
    const st = L.ow460; if (!st) return;
    const pcx = Math.floor(x0 / CHK), pcz = Math.floor(z0 / CHK);
    for (const key of [...st.chunks.keys()]) { const [x, z] = key.split(',').map(Number); if (Math.max(Math.abs(x - pcx), Math.abs(z - pcz)) > KEEP) dropChunk(key); }
    const want = [];
    for (let dx = -VIEW; dx <= VIEW; dx++) for (let dz = -VIEW; dz <= VIEW; dz++) { const key = (pcx + dx) + ',' + (pcz + dz); if (!st.chunks.has(key)) want.push([dx * dx + dz * dz, pcx + dx, pcz + dz, key]); }
    want.sort((a, b) => a[0] - b[0]);
    const n = all ? want.length : Math.min(2, want.length);
    for (let i = 0; i < n; i++) { const [, x, z, key] = want[i]; st.chunks.set(key, buildChunk(x, z)); }
  }

  /* acampamentos novos conforme você anda (o mundo não acaba); longe e sem briga, os monstros somem e voltam quando você volta */
  function streamCamps() {
    const st = L.ow460, g = L.gate, ccx = Math.floor(player.x / CAMP_CHK), ccz = Math.floor(player.z / CAMP_CHK);
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
      const X = ccx + dx, Z = ccz + dz, key = X + ',' + Z; if (st.dyn.has(key)) continue;
      const R = mulberry32(hash2(X * 31 + 7, Z * 17 + 11, st.seed + 1)); let camp = null;
      if (R() < .55) {
        const x = (X + .2 + R() * .6) * CAMP_CHK, z = (Z + .2 + R() * .6) * CAMP_CHK;
        const free = L.rooms.every(r => Math.hypot((r.px ?? r.wx) - x, (r.pz ?? r.wz) - z) > 70) && Math.hypot(x - st.entry.x, z - st.entry.z) > 110 && Math.hypot(x - st.boss.x, z - st.boss.z) > 70;
        if (free) camp = { x, z, room: -1, left: null };
      }
      st.dyn.set(key, camp);
    }
    for (const camp of st.dyn.values()) {
      if (!camp) continue; const d = Math.hypot(camp.x - player.x, camp.z - player.z);
      if (camp.room < 0 && d < 170) spawnCamp(camp);
      else if (camp.room >= 0 && camp.mobs && d > 300) {
        const alive = camp.mobs.filter(e => !e.dead && !e.gone);
        if (alive.some(e => e.aggro)) continue;
        camp.left = alive.length; for (const e of alive) { e.dead = true; e.gone = true; scene.remove(e.m.root); } camp.mobs = null;
      } else if (camp.room >= 0 && !camp.mobs && camp.left > 0 && d < 170) spawnMobs(camp, camp.left);
    }
  }
  function spawnCamp(camp) {
    const c = cellOf(camp.x, camp.z), r = { x: c.x - 4, y: c.y - 4, w: 8, h: 8, ow: 'camp', px: camp.x, pz: camp.z, i: L.rooms.length, wx: OXV + (c.x + .5) * CSV, wz: OXV + (c.y + .5) * CSV };
    L.rooms.push(r); camp.room = r.i;
    const n = Math.max(3, Math.min(12, Math.round(r.w * r.h / 22 * (L.G.dens || 1) * 1.6)));
    spawnMobs(camp, n);
    const R = mulberry32(hash2(c.x, c.y, L.ow460.seed + 2));
    if (R() < .25) try { addChest(r.wx + (R() < .5 ? 1.5 : -1.5), r.wz, L.gate.rank, false); } catch (_) {}
  }
  function spawnMobs(camp, n) {
    const g = L.gate, r = L.rooms[camp.room], KW = dungeonPool124(g), redM = g.red ? 1.3 : 1, mobs = []; let first = null;
    for (let k = 0; k < n; k++) {
      let p = null; for (let t = 0; t < 20 && !p; t++) { const x = r.wx + (Math.random() - .5) * 14, z = r.wz + (Math.random() - .5) * 14; if (freeAt(x, z, .7)) p = { x, z }; }
      if (!p) continue;
      const e = spawnKind(wpick(KW).k, p.x, p.z, g.rank, { room: camp.room }); e.hp *= redM; e.maxhp *= redM; mobs.push(e); if (!first) first = e;
      for (const a of g.aff || []) { if (a === 'armor') { e.hp *= 1.5; e.maxhp *= 1.5; } if (a === 'frenzy') e.speed *= 1.3; if (a === 'expl') e.expl = true; if (a === 'vamp') e.vamp183 = true; }
    }
    if (first && Math.random() < .3 + Math.max(0, g.rank - 5) * .25) try { makeElite(first); } catch (_) {}
    L.seen.delete(camp.room); camp.mobs = mobs;
  }

  /* ---------- Fendas deste mundo: a de entrada (reaparece longe) e a que nasce quando o Soberano cai ---------- */
  function riftExit(x, z, locked, kind) {
    const R131 = window.RIFT131_ENABLE && window.Rift131;
    const grp = R131 ? Rift131.create({ seed: ((L.gate?.seed || 131) + (kind === 'boss' ? 7 : 0)) | 0, red: locked, exit: !locked, secret: !locked, legacyLinearOutput: true }) : new T.Group();
    grp.position.set(x, 0, z); grp.rotation.y = Math.random() * TAU; grp.scale.setScalar(.86); L.group.add(grp);
    const it = { type: 'exit', x, z, r: 3.4, ring: new T.Group(), grp, locked, riftLocked131: locked, ow460: kind, label: kind === 'boss' ? 'F · ATRAVESSAR A FENDA NOVA (VOLTAR A PRIMEVA)' : 'F · VOLTAR PELA FENDA POR ONDE ENTROU', use: () => tryExit(it) };
    L.inter.push(it); L.exits.push(it); return it;
  }
  function setupHunt(g, rooms, bi, mids, R) {
    const st = L.ow460;
    L.riftSignalNodes456 = []; L.riftSignalsMax456 = 0; L.riftSignals456 = 0;
    st.exit = riftExit(st.rift.x, st.rift.z, !!g.red, 'entry');
  }
  function onSignal() {}
  function openCitadel() {}
  function openReturn() {
    const st = L.ow460; if (!st || st.returned) return; st.returned = true;
    const b = bossE && Math.hypot(bossE.x - st.boss.x, bossE.z - st.boss.z) < 2000 ? { x: bossE.x, z: bossE.z } : st.boss;
    let p = { x: b.x + 4, z: b.z + 3 }; for (let k = 0; k < 12 && !freeAt(p.x, p.z, 1.2); k++) { const a = k * 1.3; p = { x: b.x + Math.cos(a) * (4 + k), z: b.z + Math.sin(a) * (4 + k) }; }
    const it = riftExit(p.x, p.z, false, 'boss');
    try { if (it.grp && window.Rift131) Rift131.open(it.grp); } catch (_) {}
    setTimeout(() => { if (L.ow460 === st) { bigText('UMA FENDA NOVA SE ABRIU', 2400); toast('<b>[OUTRO MUNDO]</b> O Soberano caiu e rasgou uma Fenda nova bem onde morreu: ela leva de volta a Primeva.' + (L.gate?.red ? ' A Fenda por onde você entrou também destrancou.' : ' A Fenda por onde você entrou continua aberta onde estava.') + ' Em 2 minutos este mundo começa a transbordar.', 7500); } }, 900);
  }

  /* o Soberano anda solto em volta do covil; quando te vê, a IA normal de chefe assume */
  function roam(e, dt) {
    const st = L.ow460; if (!st || e !== bossE || e.dead || e.aggro || st.hunt || L.defense) return false;
    const dp = Math.hypot(player.x - e.x, player.z - e.z);
    if (!player.dead && dp < 26 && los(e.x, e.z, player.x, player.z)) { e.aggro = true; try { bossAggro(e); } catch (_) {} return false; }
    const r = st.roam || (st.roam = { wp: null, t: 0, stuck: 0, lx: e.x, lz: e.z });
    r.t -= dt;
    if (!r.wp || Math.hypot(r.wp.x - e.x, r.wp.z - e.z) < 2 || r.t <= 0) {
      for (let k = 0; k < 12; k++) { const a = Math.random() * TAU, d = 40 + Math.random() * 300, x = st.boss.x + Math.cos(a) * d, z = st.boss.z + Math.sin(a) * d; if (freeAt(x, z, 1.2)) { r.wp = { x, z }; break; } }
      r.t = 25 + Math.random() * 30; r.pause = 2 + Math.random() * 5;
    }
    if (r.pause > 0) { r.pause -= dt; animChibi(e.m, { move: 0, atk: 0, dead: 0, wind: 0 }, time); return true; }
    const dx = r.wp.x - e.x, dz = r.wp.z - e.z, len = Math.hypot(dx, dz) || 1, sp = Math.min(len, 2.6 * dt);
    e.face = Math.atan2(dx, dz); const x0 = e.x, z0 = e.z; moveEnt(e, dx / len * sp, dz / len * sp);
    if (Math.hypot(e.x - x0, e.z - z0) < sp * .3) { r.stuck += dt; if (r.stuck > 1.2) { r.wp = null; r.stuck = 0; } } else r.stuck = 0;
    animChibi(e.m, { move: 1, atk: 0, dead: 0, wind: 0 }, time); e.m.root.position.set(e.x, 0, e.z); e.m.root.rotation.y = e.face;
    return true;
  }

  /* saindo pela Fenda de entrada sem matar o Soberano: ela some atrás de você em Primeva e reabre em outro lugar perto */
  function relocateGate(g) {
    if (!g || g.dead) return false;
    let spot = null;
    for (let t = 0; t < 80 && !spot; t++) {
      const a = Math.random() * TAU, d = 120 + Math.random() * 160, x = g.x + Math.cos(a) * d, z = g.z + Math.sin(a) * d;
      try { if (nearestCity(x, z).d < 52 * (typeof CITYK !== 'undefined' ? CITYK : 1)) continue; if (gates.some(o => o !== g && !o.dead && Math.hypot(o.x - x, o.z - z) < 30)) continue; if (!worldFree(x, z, 3.5)) continue; if (typeof onRoad === 'function' && onRoad(roadSegs(x, z, 1), x, z, 10)) continue; } catch (_) { continue; }
      spot = { x, z };
    }
    if (!spot) return false;
    try { if (window.RIFT131_ENABLE && window.Rift131) { const ghost = { ...g, id: ++gateSeq, mesh: null, ring: null, sw: null, dead: false, life: 120 }; delete ghost.cleared; gateMesh(ghost); ghost.closing131 = true; gates.push(ghost); if (ghost.mesh) Rift131.close(ghost.mesh, false); } } catch (_) {}
    try { removeGateMesh(g); } catch (_) {}
    g.x = spot.x; g.z = spot.z;
    setTimeout(() => toast('<b>[FENDA]</b> A Fenda se fechou atrás de você e reabriu em outro lugar por perto. O Soberano daquele mundo continua vivo.', 6500), 1600);
    return true;
  }

  function zoneAt(x, z) {
    const st = L.ow460, de = Math.hypot(x - st.entry.x, z - st.entry.z), db = Math.hypot(x - st.boss.x, z - st.boss.z), f = de / Math.max(1, de + db);
    return f < .38 ? 1 : f < .72 ? 2 : 3;
  }
  function objective(obj) {
    const st = L.ow460; if (!st) return obj;
    const day = L.riftDays456 || 1;
    let line;
    if (L.brk) line = 'O mundo está transbordando · volte por uma Fenda';
    else if (L.bossDead) line = 'O Soberano caiu · uma Fenda nova abriu onde ele morreu · transbordo em ' + fmtT(Math.max(0, L.closeT));
    else if (L.defense) line = 'O Núcleo da Fenda fica no covil deste mundo · ache e defenda · ou volte pela Fenda por onde entrou';
    else if (L.combat117 && !L.combat117.spawned) line = 'Derrote os acampamentos para despertar o Soberano · ou volte pela Fenda por onde entrou';
    else line = L.gate?.red ? 'O Soberano anda solto · portal vermelho: a Fenda de volta só abre quando ele cair' : 'O Soberano anda solto por este mundo · ache a Fenda por onde entrou para voltar';
    let rest = String(obj || '');
    if (/^(\[[^\]]*\] )?Salas /.test(rest) || /^(\[[^\]]*\] )?Transbordo em /.test(rest) || /^(\[[^\]]*\] )?TRANSBORDO/.test(rest)) rest = '';
    return st.name + ' · Dia ' + day + ' · ' + ZONES[st.zone - 1] + '\n' + line + (rest ? '\n' + rest : '');
  }
  function map() { /* v461 (Ian): sem marcação de chefe, sinais ou portal no mapa — só o que você já explorou */ }

  /* ---------- Chegada: o portal vermelho fecha atrás de você ---------- */
  function arrive() {
    const st = L.ow460, e = st.entry, a = Math.random() * TAU, ux = Math.cos(a), uz = Math.sin(a);
    player.x = e.x + ux * 1.5; player.z = e.z + uz * 1.5; player.face = Math.atan2(ux, uz);
    pcCam.yaw = Math.atan2(-ux, -uz); pcCam.pitch = .16;
    if (window.RIFT131_ENABLE && window.Rift131) {
      const grp = Rift131.create({ seed: (L.gate?.seed || 131) | 0, red: true, legacyLinearOutput: true }); grp.position.set(e.x - ux * 2.4, 0, e.z - uz * 2.4); grp.rotation.y = Math.atan2(ux, uz); grp.scale.setScalar(.9);
      L.group.add(grp); st.arrival = { t: 0, grp, closed: false };
    } else st.arrival = { t: 0, grp: null, closed: false };
    st.cine = { t: 0, ux, uz };
  }

  /* ---------- Por quadro ---------- */
  function tick(dt) {
    const st = L.ow460; if (!st || L.mode !== 'dungeon') return;
    uT.value += dt; st.t += dt;
    const a = st.arrival;
    if (a) {
      a.t += dt; if (a.grp) try { Rift131.update(a.grp, dt); } catch (_) {}
      if (!a.closed && a.t > 1.9) { a.closed = true; if (a.grp) try { Rift131.close(a.grp, false); } catch (_) {} try { shake(.55); sfx('portal'); } catch (_) {} bigText('O PORTAL SE FECHOU', 2000); }
      if (a.t > 4.6) {
        if (a.grp) { try { Rift131.dispose(a.grp); } catch (_) {} L.group.remove(a.grp); }
        st.arrival = null;
        toast('<b>[OUTRO MUNDO · ' + st.name + ']</b> A Fenda sumiu atrás de você e reapareceu em algum lugar deste mundo sem fim. Ache-a para voltar' + (L.gate?.red ? ' (portal vermelho: ela só destranca quando o Soberano cair)' : '') + ', ou cace o <b>Soberano</b>, que anda solto por aqui: a morte dele rasga uma Fenda nova. ' + (st.weather ? '<i>' + st.weather + '.</i>' : ''), 9500);
      }
    }
    // chão acompanha o jogador (em passos da malha, sem tremer)
    if (st.ground) { const gx = Math.round(player.x / GSTEP) * GSTEP, gz = Math.round(player.z / GSTEP) * GSTEP; if (st.ground.position.x !== gx || st.ground.position.z !== gz) st.ground.position.set(gx, 0, gz); }
    st.streamT = (st.streamT || 0) - dt; if (st.streamT <= 0) { st.streamT = .2; streamChunks(false); streamCamps(); }
    const DAY = typeof DAY_LENGTH !== 'undefined' ? DAY_LENGTH : 1200, f = (st.t / DAY + .3) % 1, day = .5 + .5 * Math.cos((f - .5) * TAU);
    if (st.skyU) st.skyU.uDay.value = .35 + .65 * day;
    const W = st.W; if (W) { sun.intensity = W.sunI * (.5 + .5 * day); hemi.intensity = W.hI * (.6 + .4 * day); }
    const dn = Math.floor(st.t / DAY); if (dn > st.lastDay) { st.lastDay = dn; L.riftDays456 = (L.riftDays456 || 1) + 1; toast('<b>[OUTRO MUNDO]</b> Amanhece o <b>dia ' + L.riftDays456 + '</b> deste mundo. Lá fora, em Primeva, o tempo corre mais rápido.', 5000); }
    for (const fl of st.floats) { fl.h.position.y = fl.y + Math.sin(st.t * .35 + fl.ph) * 1.1; fl.h.rotation.y += dt * .04; }
    if (st.parts) st.parts.material.uniforms.uP.value.set(player.x, terrH(player.x, player.z) + 6, player.z);
    st.cullT = (st.cullT || 0) - dt;
    if (st.cullT <= 0) { st.cullT = .25; for (const e of enemies) { if (e.dead || e.gone || !e.m || !e.m.root) continue; const far = !e.isBoss && Math.hypot(e.x - player.x, e.z - player.z) > 85; e.m.root.visible = !far; } }
    const z = zoneAt(player.x, player.z);
    if (z !== st.zone) { st.zone = z; if (!st.zoneSeen[z]) { st.zoneSeen[z] = true; bigText(ZONES[z - 1].toUpperCase(), 1800); } }
  }
  function camAfter(dt) {
    const st = L.ow460; if (!st || L.mode !== 'dungeon') return;
    if (st.sky) st.sky.position.copy(camera.position);
    const c = st.cine; if (!c) return;
    // 1) de frente para o herói, vendo o portal vermelho atrás dele fechar; 2) gira para trás do herói e revela o planeta
    c.t += Math.min(.05, Math.max(.001, dt || .016));
    const P = player, hy = terrH(P.x, P.z);
    const nPos = camera.position.clone(), dir = new T.Vector3(); camera.getWorldDirection(dir); const nLook = nPos.clone().addScaledVector(dir, 10);
    const a0 = Math.atan2(c.uz, c.ux) + .35, r0 = 6.6, y0 = 2.5;
    const a1 = Math.atan2(nPos.z - P.z, nPos.x - P.x), r1 = Math.max(1.5, Math.hypot(nPos.x - P.x, nPos.z - P.z)), y1 = nPos.y - hy;
    let da = a1 - a0; da = Math.atan2(Math.sin(da), Math.cos(da));
    const k = Math.min(1, Math.max(0, (c.t - 2.9) / 2.6)), e = k * k * (3 - 2 * k);
    const ang = a0 + da * e, rad = r0 + (r1 - r0) * e, hh = y0 + (y1 - y0) * e + Math.sin(e * Math.PI) * 1.6;
    camera.position.set(P.x + Math.cos(ang) * rad, hy + hh, P.z + Math.sin(ang) * rad);
    const aLook = new T.Vector3(P.x - c.ux * 1.6, hy + 1.9, P.z - c.uz * 1.6);
    camera.lookAt(aLook.lerp(nLook, e));
    if (st.sky) st.sky.position.copy(camera.position);
    if (k >= 1) st.cine = null;
  }

  // Ganchos: a lógica por quadro da masmorra e a câmera.
  const prevUD = updDungeon; updDungeon = function (dt) { prevUD.apply(this, arguments); try { tick(dt); } catch (e) { console.warn('OW460.tick', e); } };
  const prevHM = expHuntMove; expHuntMove = function (e, dt) { if (prevHM.apply(this, arguments)) return true; try { return roam(e, dt); } catch (err) { console.warn('OW460.roam', err); return false; } };
  const prevCam = camUpdate; camUpdate = function (dt) { prevCam.apply(this, arguments); try { camAfter(dt); } catch (e) { console.warn('OW460.cam', e); } };

  /* cristal pequeno do Tripo para outros sistemas (ex.: marcas do cerco ao sair da Fenda) */
  function shard(parent, x, y, z, H, col) { return placeGlb(parent, crystalPath('cristal-veio'), H, x, y, z, Math.random() * TAU, m => crystalMat(m, col)); }

  window.OW460 = { shard, WORLDS, applies, layout, render, setupHunt, arrive, onSignal, openCitadel, openReturn, relocateGate, objective, map, zoneAt, tick, path, roam, cellAt: i => cellAt(L.ow460, i) };
})();
