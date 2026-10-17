/* v460 (Ian, 16/10/2026): "é pra ser outro mundo. Tu entrou na fenda, o portal some, é outro lugar; não pode sair até matar o chefe."
   A Fenda deixa de ser masmorra de salas e corredores: vira um planeta aberto (~330 m) com relevo próprio (terrain245 owH460),
   céu alienígena (planeta gigante, anéis, luas, aurora, estrelas), cordilheira na borda, flora e formações feitas só com os
   modelos que já existem no repositório (Kenney + Tripo, 0 créditos), acampamentos de monstros espalhados e a Cidadela do
   Soberano, selada até seguir os 3 Sinais de Energia. O portal de chegada se fecha atrás do jogador; o portal de volta só
   abre no centro da Cidadela quando o chefe cai. A lógica do jogo continua na grade da masmorra (L.grid), só que aberta. */
(function () {
  'use strict';
  const T = THREE, TAU = Math.PI * 2;
  const N = 200, CS = 2, OX = -N * CS / 2, OZ = -N * CS / 2;
  const SKIP = ['extract']; /* core vira defesa na Cidadela; floors vira 3 zonas com os mesmos baús */

  /* Um mundo por bioma do portal (mesmos ids da v458 OTHERWORLDS456). Cores do chão, céu, planeta, veios e flora. */
  const WORLDS = {
    erebo: { zen: 0x07021a, hor: 0x4a2a88, fog: 0x2c1858, fogD: .0072, gr: [0x2e2448, 0x40306a, 0x1f1a36], rock: 0x2f2646, peak: 0x6a5a92, vein: 0xc07bff, sun: 0xe0c4ff, sunI: 1.05, hs: 0xa58aff, hg: 0x281a40, hI: .8, pl: [0x8a5ae6, 0x2c1a66, 0xe6c8ff], moon: [0xd8c8ff, 0x9a7ad8], aur: 0x8a5aff, cry: ['cristal-ancora-violeta', 'cristal-ancora-turquesa'], tint: 0x9b7be5, trees: ['tree_dead_large', 'tree_dead_medium', 'tree_thin'], big: ['spire', 'crystal', 'crystal', 'tree', 'ruin', 'mesa'], small: ['grass_large', 'grass_leafsLarge', 'plant_flatTall', 'flower_purpleA', 'flower_purpleB', 'rock_smallA', 'rock_smallC'], part: 'motes', pc: 0xd8b0ff },
    esporo: { zen: 0x01120c, hor: 0x1f6a50, fog: 0x154a36, fogD: .0078, gr: [0x1f3d2c, 0x2d5f3e, 0x163024], rock: 0x26402f, peak: 0x46705a, vein: 0x5dffb8, sun: 0xc8ffe8, sunI: 1.0, hs: 0x8cf5cc, hg: 0x0f2a1d, hI: .82, pl: [0x46c99a, 0x0f4a3a, 0xc0ffe4], moon: [0xd0ffe8, 0x7ad8b0], aur: 0x3cffb0, cry: ['cristal-ancora-verde', 'cristal-ancora-turquesa'], tint: 0x5ee0a8, trees: ['tree_oak_dark', 'tree_fat', 'tree_plateau'], big: ['shroom', 'shroom', 'tree', 'tree', 'crystal', 'spire'], small: ['grass_large', 'grass_leafsLarge', 'grass_leafs', 'plant_bushSmall', 'mushroom_red', 'mushroom_tanGroup', 'plant_flatShort'], part: 'spores', pc: 0x9dffd0 },
    forja: { zen: 0x150204, hor: 0x7a2414, fog: 0x4e160e, fogD: .0080, gr: [0x2c1814, 0x3c2018, 0x1a0f0c], rock: 0x281816, peak: 0x463028, vein: 0xff6a1e, sun: 0xffa070, sunI: 1.1, hs: 0xff9a70, hg: 0x2a0c08, hI: .75, pl: [0xff7a30, 0x5a1206, 0xffc090], moon: [0xffd0b0, 0xd86a40], aur: 0xff5030, cry: ['cristal-ancora-ambar'], tint: 0xb85a40, trees: ['tree_dead_large', 'tree_dead_medium', 'tree_dead_small'], big: ['spire', 'spire', 'mesa', 'crystal', 'ruin', 'tree'], small: ['rock_smallA', 'rock_smallC', 'rock_smallFlatA', 'grass', 'plant_flatShort', 'bone_A'], part: 'embers', pc: 0xffa040 },
    crio: { zen: 0x020818, hor: 0x2a5a8a, fog: 0x1d4266, fogD: .0070, gr: [0xc9dceb, 0xa2bcd0, 0xe8f3fb], rock: 0x5c6e84, peak: 0xf2f8ff, vein: 0x70f4ff, sun: 0xcdeeff, sunI: 1.15, hs: 0xc4ebff, hg: 0x2c3c50, hI: .85, pl: [0x70bcff, 0x1c3c6e, 0xd8f6ff], moon: [0xeaf6ff, 0x9cc8ee], aur: 0x60ffd8, cry: ['cristal-ancora-gelo', 'cristal-ancora-turquesa'], tint: 0xdcefff, trees: ['tree_pineRoundA', 'tree_pineTallA_detailed', 'tree_cone'], big: ['crystal', 'crystal', 'spire', 'tree', 'tree', 'ruin'], small: ['rock_smallA', 'rock_smallC', 'grass', 'plant_flatShort', 'rock_smallFlatA'], part: 'snow', pc: 0xffffff },
    ambar: { zen: 0x170c02, hor: 0x9a6422, fog: 0x74491a, fogD: .0074, gr: [0xb48444, 0xcc9a52, 0x8c6434], rock: 0x6c4c2c, peak: 0x9a7046, vein: 0xffc24a, sun: 0xffd890, sunI: 1.2, hs: 0xffdc98, hg: 0x3c2612, hI: .85, pl: [0xffbc4e, 0x7c4012, 0xfff2c4], moon: [0xfff0d0, 0xd8a060], aur: 0xffb040, cry: ['cristal-ancora-ambar'], tint: 0xe0a860, trees: ['cactus_tall', 'cactus_short', 'tree_dead_small'], big: ['mesa', 'spire', 'cactus', 'ruin', 'crystal', 'mesa'], small: ['rock_smallA', 'rock_smallC', 'rock_smallFlatA', 'plant_flatShort', 'bone_A', 'cactus_short'], part: 'sand', pc: 0xffe0a0 }
  };
  const ZONES = ['Zona 1 · Fronteira da Fenda', 'Zona 2 · Ermos do Outro Mundo', 'Zona 3 · Cidadela do Soberano'];

  const rimR = a => window.TER245.owRim460(a);
  const owH = (x, z) => window.TER245.owH460(x, z);
  const absolute = o => { o.userData.terrainAbsolute245 = true; return o; };
  const ss = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
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

  /* ---------- Shaders: céu, planeta, anel, lua, feixe, água, partículas, runas ---------- */
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
  function beamMat(col, on) {
    return new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, fog: false,
      uniforms: { uC: { value: new T.Color(col) }, uT, uOn: { value: on } },
      vertexShader: 'varying vec2 vU;varying float vY;void main(){vU=uv;vY=position.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform vec3 uC;uniform float uT,uOn;varying vec2 vU;varying float vY;\n' + NOISE +
        'void main(){float n=fbm(vec3(vU.x*8.,vU.y*14.-uT*1.4,uT*.2));float edge=pow(sin(vU.x*3.14159*2.)*.5+.5,1.2);' +
        'float fade=smoothstep(0.,.04,vU.y)*smoothstep(1.,.55,vU.y);float a=(.25+.75*n)*fade*(.35+.65*edge)*uOn;gl_FragColor=vec4(uC*(1.3+n),a);}'
    });
  }
  function runeMat(col) {
    return new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
      uniforms: { uC: { value: new T.Color(col) }, uT },
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

  /* ---------- Chão do planeta: relevo real, cores por ruído/encosta e veios de energia que pulsam para a Cidadela ---------- */
  let groundTex = null;
  function groundMesh(W, st) {
    const SIZE = 840, SEG = 280, geo = new T.PlaneGeometry(SIZE, SIZE, SEG, SEG); geo.rotateX(-Math.PI / 2);
    const P = geo.attributes.position, n = P.count;
    for (let i = 0; i < n; i++) { const x = P.getX(i), z = P.getZ(i); P.setY(i, owH(x, z)); }
    geo.computeVertexNormals();
    const Nn = geo.attributes.normal, C = new Float32Array(n * 3), S = Math.sin;
    const c0 = new T.Color(W.gr[0]), c1 = new T.Color(W.gr[1]), c2 = new T.Color(W.gr[2]), cr = new T.Color(W.rock), cp = new T.Color(W.peak), tmp = new T.Color();
    for (let i = 0; i < n; i++) {
      const x = P.getX(i), y = P.getY(i), z = P.getZ(i), ny = Nn.getY(i);
      const n1 = .5 + .5 * S(x * .031 + S(z * .023) * 2) * S(z * .027 + S(x * .019) * 1.7), n2 = .5 + .5 * S(x * .11 + z * .07) * S(z * .09 - x * .05), n3v = .5 + .5 * S(x * .37 + S(z * .29)) * S(z * .33 - x * .21);
      tmp.copy(c0).lerp(c1, n1); tmp.lerp(c2, ss(.55, .9, n2) * .7);
      tmp.multiplyScalar(.78 + .44 * n3v);
      tmp.lerp(c2, ss(.62, .95, n1 * n3v) * .55);
      tmp.lerp(cr, ss(.94, .72, ny));
      tmp.lerp(cp, ss(14, 46, y) * .85);
      C[i * 3] = tmp.r; C[i * 3 + 1] = tmp.g; C[i * 3 + 2] = tmp.b;
    }
    geo.setAttribute('color', new T.BufferAttribute(C, 3));
    if (!groundTex && typeof envGroundTex === 'function') { groundTex = envGroundTex(); groundTex.repeat.set(150, 150); }
    const mat = new T.MeshStandardMaterial({ vertexColors: true, map: groundTex, roughness: .93, metalness: 0 });
    const U = { uVein: { value: new T.Color(W.vein) }, uBoss: { value: new T.Vector2(st.boss.x, st.boss.z) }, uRw: { value: st.Rw }, uT };
    mat.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = 'varying vec3 vOw460;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvOw459=(modelMatrix*vec4(transformed,1.)).xyz;');
      sh.fragmentShader = 'uniform vec3 uVein;uniform vec2 uBoss;uniform float uRw,uT;varying vec3 vOw460;\n' + sh.fragmentShader.replace('#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\n{vec2 q=vOw460.xz;float w1=abs(sin(q.x*.19+sin(q.y*.11)*2.3)*sin(q.y*.17+sin(q.x*.13)*1.9));float w2=abs(sin(q.x*.07-q.y*.05+1.3)*sin(q.y*.06+q.x*.04));' +
        'float db=length(q-uBoss);float near=1.-smoothstep(25.,230.,db);float pulse=.5+.5*sin(uT*1.7-db*.09);' +
        'float line=smoothstep(.035,.0,w1)*smoothstep(.3,.75,near+.15)+smoothstep(.022,.0,w2)*.8;' +
        'float inside=1.-smoothstep(uRw*.92,uRw*1.08,length(q));totalEmissiveRadiance+=uVein*line*(.06+.9*near*pulse)*inside;}');
    };
    mat.customProgramCacheKey = () => 'ow460ground';
    const m = absolute(new T.Mesh(geo, mat)); m.userData.own = 1; m.name = 'ow460-ground'; m.receiveShadow = true; return m;
  }

  /* ---------- Layout: grade aberta, acampamentos, rota, formações e Cidadela ---------- */
  function applies(g, variant) {
    if (!window.TER245 || !TER245.owH460 || !g) return false;
    if (g.goblin118 || g.missionExtract117 || g.extractionCleared117 || g.noOw460) return false;
    return !SKIP.includes(variant);
  }
  function layout(g, R, variant, wid) {
    const TER = window.TER245, s = ((g.seed >>> 0) % 997) * .0063 + .3, Rw = 158 + Math.min(9, g.rank || 0);
    TER.OW.value.set(1, Rw, 6.5 + R() * 2.5, s);
    const aE = R() * TAU, rE = rimR(aE) - 26, ex = Math.cos(aE) * rE, ez = Math.sin(aE) * rE;
    const aB = aE + Math.PI + (R() - .5) * .7, rB = rimR(aB) - 44, bx = Math.cos(aB) * rB, bz = Math.sin(aB) * rB;
    TER.OWB.value.set(ex, ez, bx, bz); TER.on.value = 1;
    const cells = new Uint8Array(N * N);
    const cc = (cx, cy) => ({ x: OX + (cx + .5) * CS, z: OZ + (cy + .5) * CS });
    const toCell = (x, z) => ({ x: Math.floor((x - OX) / CS), y: Math.floor((z - OZ) / CS) });
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const p = cc(x, y); if (Math.hypot(p.x, p.z) < rimR(Math.atan2(p.z, p.x)) - 7) cells[y * N + x] = 1; }
    const inside = (x, z, m) => Math.hypot(x, z) < rimR(Math.atan2(z, x)) - m;
    const room = (x, z, half, kind) => { const c = toCell(x, z); return { x: c.x - half, y: c.y - half, w: half * 2, h: half * 2, ow: kind, px: x, pz: z }; };
    // rota da chegada até a Cidadela (curva), acampamentos na rota e espalhados
    const mx = (ex + bx) / 2, mz = (ez + bz) / 2, px = -(bz - ez), pz = bx - ex, pl = Math.hypot(px, pz) || 1, off = (R() - .5) * 150;
    const kx = mx + px / pl * off, kz = mz + pz / pl * off;
    const bez = t => ({ x: (1 - t) * (1 - t) * ex + 2 * (1 - t) * t * kx + t * t * bx, z: (1 - t) * (1 - t) * ez + 2 * (1 - t) * t * kz + t * t * bz });
    const route = []; for (let i = 0; i <= 40; i++) route.push(bez(i / 40));
    const camps = [];
    const free = (x, z, d) => inside(x, z, 18) && Math.hypot(x - ex, z - ez) > 30 && Math.hypot(x - bx, z - bz) > 44 && camps.every(c => Math.hypot(c.px - x, c.pz - z) > d);
    for (const t of [.16, .31, .46, .6, .74, .86]) {
      for (let k = 0; k < 14; k++) { const p = bez(t), j = 6 + k * 2.2, a = R() * TAU, x = p.x + Math.cos(a) * j, z = p.z + Math.sin(a) * j; if (free(x, z, 28)) { const r = room(x, z, 4, 'camp'); r.t = t; camps.push(r); break; } }
    }
    for (let k = 0; k < 500 && camps.length < 12; k++) { const a = R() * TAU, d = Math.sqrt(R()) * (rimR(a) - 22), x = Math.cos(a) * d, z = Math.sin(a) * d; if (free(x, z, 34)) camps.push(room(x, z, 4, 'camp')); }
    // Cidadela: muralha de cristais e rochas (raio 21–24 m) com portão virado para a rota; portão selado até os 3 sinais
    const gp = bez(.9), gateA = Math.atan2(gp.z - bz, gp.x - bx), gateCells = [], CIT_R0 = 21, CIT_R1 = 24.2, GAP = .2;
    const hunt = variant === 'hunt';
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const p = cc(x, y), d = Math.hypot(p.x - bx, p.z - bz); if (d < CIT_R0 - .6 || d > CIT_R1 + .6) continue;
      let da = Math.atan2(p.z - bz, p.x - bx) - gateA; da = Math.atan2(Math.sin(da), Math.cos(da));
      const i = y * N + x; if (Math.abs(da) > GAP) cells[i] = 0; else if (!hunt && cells[i]) { cells[i] = 2; gateCells.push(i); }
    }
    // colunas de cobertura dentro da arena
    const covers = []; for (let k = 0; k < 4; k++) { const a = gateA + Math.PI / 4 + k * Math.PI / 2, x = bx + Math.cos(a) * 12, z = bz + Math.sin(a) * 12; covers.push({ x, z }); }
    const block = (x, z, r) => { const c = toCell(x, z), rc = Math.ceil(r / CS); for (let dy = -rc; dy <= rc; dy++) for (let dx = -rc; dx <= rc; dx++) { const X = c.x + dx, Y = c.y + dy; if (X < 0 || Y < 0 || X >= N || Y >= N) continue; const q = cc(X, Y); if (Math.hypot(q.x - x, q.z - z) <= r) cells[Y * N + X] = 0; } };
    for (const c of covers) block(c.x, c.z, 1.3);
    // formações grandes (bloqueiam): longe dos acampamentos, da chegada, da Cidadela e da rota
    const W0 = WORLDS[wid] || WORLDS.erebo, forms = [];
    const nearCamp = (x, z, r) => camps.some(c => Math.abs(x - c.px) < 8 + r && Math.abs(z - c.pz) < 8 + r);
    const nearRoute = (x, z, r) => route.some(p => Math.hypot(p.x - x, p.z - z) < r + 7);
    for (let t = 0; t < 1400 && forms.length < 56; t++) {
      const a = R() * TAU, d = Math.sqrt(R()) * (rimR(a) - 10), x = Math.cos(a) * d, z = Math.sin(a) * d, db = Math.hypot(x - bx, z - bz);
      let type = W0.big[Math.floor(R() * W0.big.length)]; if (db < 90 && R() < .45) type = 'crystal';
      const H = type === 'spire' ? 9 + R() * 11 : type === 'mesa' ? 5 + R() * 5 : type === 'crystal' ? 7 + R() * 8 : type === 'shroom' ? 5 + R() * 5 : type === 'cactus' ? 5 + R() * 4 : type === 'ruin' ? 4 + R() * 5 : 10 + R() * 7;
      const rad = type === 'spire' ? H * .2 : type === 'mesa' ? H * .7 : type === 'crystal' ? H * .17 : type === 'shroom' ? H * .3 : type === 'cactus' ? 1.1 : type === 'ruin' ? 1.3 : 1.1;
      if (!inside(x, z, rad + 6) || nearCamp(x, z, rad) || nearRoute(x, z, rad) || db < 34 + rad || Math.hypot(x - ex, z - ez) < 18 + rad) continue;
      if (forms.some(f => Math.hypot(f.x - x, f.z - z) < f.r + rad + 7)) continue;
      forms.push({ type, x, z, H, r: rad, ry: R() * TAU, k: Math.floor(R() * 99) }); block(x, z, rad * .85);
    }
    // conectividade: acampamento isolado sai da lista (a rota e a Cidadela ficam sempre abertas)
    const reach = new Uint8Array(N * N), e0 = toCell(ex, ez), q = [e0.y * N + e0.x]; reach[q[0]] = 1;
    for (let i = 0; i < q.length; i++) { const v = q[i], x = v % N, y = (v - x) / N; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= N || Y >= N) continue; const k = Y * N + X; if (reach[k] || !cells[k]) continue; reach[k] = 1; q.push(k); } }
    const okCamps = camps.filter(c => { const k = toCell(c.px, c.pz); return reach[k.y * N + k.x]; });
    if (variant === 'floors') { /* tesouro garantido da Zona 1 e da Zona 2 (antes: fim do 1º e do 2º andar) */
      const pickT = t => okCamps.filter(c => c.t != null && !c.floorEnd).sort((a, b) => Math.abs(a.t - t) - Math.abs(b.t - t))[0];
      const z1 = pickT(.3); if (z1) { z1.floorEnd = true; z1.floor = 0; } const z2 = pickT(.62); if (z2) { z2.floorEnd = true; z2.floor = 1; }
    }
    const rooms = [room(ex, ez, 4, 'entry'), ...okCamps, room(bx, bz, 8, 'citadel')], bi = rooms.length - 1;
    rooms[0].entry = true;
    // sinais de energia na rota (Zona 1, 2 e 3)
    const signals = [.27, .52, .77].map((t, i) => { const p = bez(t); for (let k = 0; k < 20; k++) { const a = R() * TAU, j = 5 + k, x = p.x + Math.cos(a) * j, z = p.z + Math.sin(a) * j, c = toCell(x, z); if (cells[c.y * N + c.x] === 1 && !nearCamp(x, z, -3)) return { x, z, i }; } return { x: p.x, z: p.z, i }; });
    const st = { W: null, Rw, seed: s, entry: { x: ex, z: ez, a: aE }, boss: { x: bx, z: bz }, gateA, gateCells, open: hunt, hunt, forms, covers, signals, route, t: 0, zone: 1, zoneSeen: { 1: true }, lastDay: 0 };
    return { cells, W: N, H: N, rooms, bi, st };
  }

  /* ---------- Render: céu, chão, borda, formações, flora, Cidadela, partículas ---------- */
  function render(g, R, ow456) {
    const st = L.ow460, W = WORLDS[ow456?.id] || WORLDS.erebo; st.W = W; st.name = ow456?.name || 'Outro Mundo'; st.weather = ow456?.weather || '';
    scene.background = new T.Color(W.fog); scene.fog = new T.FogExp2(W.fog, W.fogD);
    hemi.color.setHex(W.hs); hemi.groundColor.setHex(W.hg); hemi.intensity = W.hI; sun.color.setHex(W.sun); sun.intensity = W.sunI; sun.position.set(-60, 70, 80);
    pLight.color.setHex(0xffe2c0); pLight.intensity = 1.1; pLight.distance = 18; L.cave155 = false; /* sem o véu escuro de caverna: é céu aberto */
    const grp = L.group;
    grp.add(groundMesh(W, st));
    // céu
    const sky = absolute(new T.Group()); sky.name = 'ow460-sky';
    const dome = new T.Mesh(new T.SphereGeometry(236, 48, 24), skyMat(W)); dome.frustumCulled = false; dome.renderOrder = -20; dome.userData.own = 1; sky.add(dome); st.skyU = dome.material.uniforms;
    const dirP = new T.Vector3(Math.cos(st.entry.a + Math.PI + .5), .34, Math.sin(st.entry.a + Math.PI + .5)).normalize();
    const planet = new T.Mesh(new T.SphereGeometry(44, 64, 40), planetMat(W)); planet.position.copy(dirP).multiplyScalar(205); planet.rotation.set(.3, .2, .45); planet.frustumCulled = false; planet.renderOrder = -19; planet.userData.own = 1; sky.add(planet);
    const ring = new T.Mesh(new T.RingGeometry(62, 100, 128, 1), ringMat(W)); ring.position.copy(planet.position); ring.lookAt(planet.position.clone().add(new T.Vector3(.35, 1, .2))); ring.frustumCulled = false; ring.renderOrder = -18; ring.userData.own = 1; sky.add(ring);
    [[.55, .52, -.4, 9, W.moon[0]], [-.7, .42, .25, 5.5, W.moon[1]]].forEach(([x, y, z, r, c]) => { const m = new T.Mesh(new T.SphereGeometry(r, 32, 20), moonMat(c)); m.position.set(x, y, z).normalize().multiplyScalar(215); m.frustumCulled = false; m.renderOrder = -19; m.userData.own = 1; sky.add(m); });
    grp.add(sky); st.sky = sky;
    // borda: cordilheira de rochas grandes acompanhando o relevo
    if (ENV.ok) {
      const rimB = new EnvBatch(), bigB = new EnvBatch(), treeB = new EnvBatch(), flora = new EnvBatch();
      const rocks = ['rock_largeA', 'rock_largeB', 'rock_largeC', 'rock_largeD', 'rock_tallA', 'rock_tallB', 'rock_tallC'];
      for (let i = 0; i < 190; i++) { const a = i / 190 * TAU + R() * .03, rb = rimR(a), d = rb - 6 + R() * 34, x = Math.cos(a) * d, z = Math.sin(a) * d; EHk(rimB, rocks[Math.floor(R() * rocks.length)], x, -1.2, z, R() * TAU, 6 + R() * 12 + (d - rb) * .25, W.rock); }
      // formações (as mesmas que bloqueiam a grade)
      for (const f of st.forms) {
        if (f.type === 'spire') EHk(bigB, ['rock_tallA', 'rock_tallB', 'rock_tallC'][f.k % 3], f.x, -.4, f.z, f.ry, f.H, W.rock);
        else if (f.type === 'mesa') EW(bigB, ['rock_largeA', 'rock_largeB', 'rock_largeC', 'rock_largeD'][f.k % 4], f.x, -.6, f.z, f.ry, f.r * 2.3, W.rock);
        else if (f.type === 'tree') EH(treeB, W.trees[f.k % W.trees.length], f.x, -.2, f.z, f.ry, f.H, W.tint);
        else if (f.type === 'shroom') EH(treeB, f.k % 2 ? 'mushroom_redGroup' : 'mushroom_tanGroup', f.x, -.1, f.z, f.ry, f.H, W.tint);
        else if (f.type === 'ruin') { const key = ['statue_obelisk', 'statue_columnDamaged', 'column', 'statue_column', 'pillar_decorated'][f.k % 5]; EH(bigB, key, f.x, -.3, f.z, f.ry, f.H, W.peak); EH(bigB, 'rubble_large', f.x + 1.4, -.2, f.z + .8, f.ry + 1, 1.2, W.peak); }
        else if (f.type === 'cactus') placeGlb(grp, 'models/tripo-cacto446' + (f.k % 2 ? 'a' : 'b') + '.glb', f.H, f.x, 0, f.z, f.ry, m => rockMat(m, W.tint));
        else if (f.type === 'crystal') { const n = W.cry[f.k % W.cry.length]; placeGlb(grp, crystalPath(n), f.H, f.x, -.3, f.z, f.ry, m => crystalMat(m, W.vein)); EHk(bigB, 'rock_largeB', f.x, -.6, f.z, f.ry, f.H * .22, W.rock); }
      }
      // flora pequena (sem colisão), com vento
      const forms = st.forms;
      for (let i = 0; i < 4600; i++) {
        /* 1 em cada 8 nasce perto da chegada: é a primeira vista do mundo */
        let x, z; if (i % 8 === 0) { const a = R() * TAU, d = 3 + Math.sqrt(R()) * 28; x = st.entry.x + Math.cos(a) * d; z = st.entry.z + Math.sin(a) * d; } else { const a = R() * TAU, d = Math.sqrt(R()) * (rimR(a) - 6); x = Math.cos(a) * d; z = Math.sin(a) * d; }
        if (forms.some(f => Math.hypot(f.x - x, f.z - z) < f.r + .6)) continue;
        if (Math.hypot(x - st.boss.x, z - st.boss.z) < 19) continue;
        const k = W.small[Math.floor(R() * W.small.length)], rocky = k.startsWith('rock') || k === 'bone_A';
        (rocky ? EHk : EH)(flora, k, x, rocky ? -.05 : 0, z, R() * TAU, rocky ? .25 + R() * .55 : .35 + R() * .7, rocky ? W.peak : W.tint);
      }
      // árvores e arbustos médios espalhados (sem colisão, só beleza)
      for (let i = 0; i < 160; i++) {
        const a = R() * TAU, d = Math.sqrt(R()) * (rimR(a) - 12), x = Math.cos(a) * d, z = Math.sin(a) * d;
        if (forms.some(f => Math.hypot(f.x - x, f.z - z) < f.r + 2) || Math.hypot(x - st.boss.x, z - st.boss.z) < 27) continue;
        const k = R() < .55 ? W.trees[Math.floor(R() * W.trees.length)] : (W.part === 'sand' ? 'cactus_short' : 'plant_bushLarge');
        EH(treeB, k, x, -.1, z, R() * TAU, k.startsWith('tree') ? 2.6 + R() * 2.4 : 1 + R() * 1.4, W.tint);
      }
      envOwn(grp, rimB.mesh(ENVMAT)); envOwn(grp, bigB.mesh(BLDMAT)); envOwn(grp, treeB.mesh(TREEMAT)); envOwn(grp, flora.mesh(FLORAMAT));
    }
    // rochas flutuantes do Tripo pairando sobre o planeta
    st.floats = [];
    for (let i = 0; i < 11; i++) {
      const a = R() * TAU, d = 30 + R() * (rimR(a) - 40), x = Math.cos(a) * d, z = Math.sin(a) * d, y = 14 + R() * 26, H = 3 + R() * 7, ry = R() * TAU, ph = R() * 9;
      placeGlb(grp, crystalPath('rocha-flutuante'), H, x, y, z, ry, m => rockMat(m, W.peak, .45)).then(h => { if (h) st.floats.push({ h, y, ph }); });
    }
    buildCitadel(grp, W, st, R);
    grp.add(st.parts = particles(W));
  }

  function buildCitadel(grp, W, st, R) {
    const { x: bx, z: bz } = st.boss, ga = st.gateA, B = ENV.ok ? new EnvBatch() : null;
    for (let i = 0; i < 22; i++) {
      const a = ga + (i + .5) / 22 * TAU; let da = Math.atan2(Math.sin(a - ga), Math.cos(a - ga)); if (Math.abs(da) < .3) continue;
      const x = bx + Math.cos(a) * 22.6, z = bz + Math.sin(a) * 22.6;
      if (i % 2 === 0) placeGlb(grp, crystalPath(W.cry[i % W.cry.length]), 9 + R() * 5, x, -.4, z, R() * TAU, m => crystalMat(m, W.vein));
      else if (B) EHk(B, ['rock_tallA', 'rock_tallB', 'rock_tallC'][i % 3], x, -.4, z, R() * TAU, 7 + R() * 3, W.rock);
      if (B) EW(B, ['rock_largeA', 'rock_largeC', 'rock_largeD'][i % 3], bx + Math.cos(a + .14) * 22.8, -.5, bz + Math.sin(a + .14) * 22.8, R() * TAU, 4.6, W.rock);
    }
    if (B) {
      for (const s of [-1, 1]) { const a = ga + s * .27, x = bx + Math.cos(a) * 23, z = bz + Math.sin(a) * 23; EH(B, 'statue_obelisk', x, -.2, z, a, 10, W.peak); }
      for (const c of st.covers) EH(B, 'statue_columnDamaged', c.x, -.2, c.z, R() * TAU, 5.5, W.peak);
      envOwn(grp, B.mesh(BLDMAT));
    }
    const disc = new T.Mesh(new T.CircleGeometry(19, 96), runeMat(W.vein)); disc.rotation.x = -Math.PI / 2; disc.position.set(bx, .07, bz); disc.renderOrder = 6; disc.userData.own = 1; grp.add(disc);
    const beam = new T.Mesh(new T.CylinderGeometry(2.4, 3.6, 170, 28, 1, true), beamMat(W.vein, st.open ? 1 : .22)); beam.position.set(bx, 85, bz); beam.renderOrder = 7; beam.frustumCulled = false; beam.userData.own = 1; grp.add(beam); st.beam = beam;
    if (!st.open) {
      const gx = bx + Math.cos(ga) * 22.6, gz = bz + Math.sin(ga) * 22.6, cur = new T.Mesh(new T.PlaneGeometry(10, 8), curtainMat(W.vein));
      cur.position.set(gx, 4, gz); cur.rotation.y = -ga + Math.PI / 2; cur.renderOrder = 7; cur.userData.own = 1; grp.add(cur); st.curtain = cur;
    }
  }

  /* ---------- Sinais de energia e recursos do Outro Mundo (chamado pela v458 setupOtherworld456) ---------- */
  function setupHunt(g, rooms, bi, mids, R) {
    const st = L.ow460, W = st.W || WORLDS.erebo, grp = L.group;
    L.riftSignalNodes456 = []; L.riftSignalsMax456 = st.signals.length; L.riftSignals456 = 0;
    st.signals.forEach((p, idx) => {
      const sg = new T.Group(); sg.position.set(p.x, 0, p.z); grp.add(sg);
      placeGlb(sg, crystalPath('cristal-veio-2'), 2.8, 0, -.1, 0, R() * TAU, m => crystalMat(m, W.vein));
      const disc = new T.Mesh(new T.CircleGeometry(2.4, 64), runeMat(W.vein)); disc.rotation.x = -Math.PI / 2; disc.position.y = .06; disc.renderOrder = 6; disc.userData.own = 1; sg.add(disc);
      const beam = new T.Mesh(new T.CylinderGeometry(.55, .9, 48, 16, 1, true), beamMat(W.vein, idx === 0 ? 1 : .12)); beam.position.y = 24; beam.renderOrder = 7; beam.frustumCulled = false; beam.userData.own = 1; sg.add(beam);
      const lab = makeSign('SINAL DE ENERGIA ' + (idx + 1) + '/' + st.signals.length, '#e8d4ff', .46); lab.position.y = 3.6; sg.add(lab);
      const it = { type: 'riftSignal456', idx, x: p.x, z: p.z, r: 3.4, grp: sg, beam, tracked: false, label: 'F · RASTREAR SINAL DE ENERGIA (' + (idx + 1) + '/' + st.signals.length + ')', use: () => {
        const next = L.riftSignalNodes456.find(n => !n.tracked);
        if (next && next !== it) { toast('<b>[SINAL DE ENERGIA]</b> Este sinal ainda está mudo. Siga primeiro o feixe aceso (sinal ' + (next.idx + 1) + ').', 4200); return false; }
        return trackRiftSignal456(it);
      } };
      L.inter.push(it); L.riftSignalNodes456.push(it);
    });
    // recursos: um por acampamento + poças e madeira no ermo
    const kinds = ['lenha_abissal', 'fungo_astral', 'poca_abissal'], spots = [];
    mids.forEach((ri, k) => { const r = rooms[ri], a = R() * TAU; spots.push({ x: r.wx + Math.cos(a) * 9.5, z: r.wz + Math.sin(a) * 9.5, kind: kinds[k % 3] }); });
    for (let k = 0; k < 9; k++) { const a = R() * TAU, d = 20 + Math.sqrt(R()) * (rimR(a) - 40); spots.push({ x: Math.cos(a) * d, z: Math.sin(a) * d, kind: kinds[k % 3] }); }
    const G = L.grid, freeCell = (x, z) => { const cx = Math.floor((x - G.ox) / G.CS), cy = Math.floor((z - G.oz) / G.CS); return cx >= 0 && cy >= 0 && cx < G.W && cy < G.H && G.cells[cy * G.W + cx] === 1; };
    const B = ENV.ok ? new EnvBatch() : null;
    for (const sp of spots) {
      if (!freeCell(sp.x, sp.z) || st.forms.some(f => Math.hypot(f.x - sp.x, f.z - sp.z) < f.r + 2)) continue;
      const rg = new T.Group(); rg.position.set(sp.x, 0, sp.z); grp.add(rg); let label;
      if (sp.kind === 'lenha_abissal') {
        if (B) { EH(B, 'log_large', sp.x, 0, sp.z, R() * TAU, .7, W.tint); EH(B, 'stump_old', sp.x + 1.1, 0, sp.z - .6, R() * TAU, .9, W.tint); }
        placeGlb(rg, crystalPath('cristal-veio'), .9, .3, 0, .4, R() * TAU, m => crystalMat(m, W.vein));
        label = 'F · CORTAR LENHA E RESINA DO OUTRO MUNDO';
      } else if (sp.kind === 'fungo_astral') {
        if (B) { EH(B, 'mushroom_redGroup', sp.x, 0, sp.z, R() * TAU, 1.1, W.tint); EH(B, 'mushroom_tanGroup', sp.x + .9, 0, sp.z + .5, R() * TAU, .8, W.vein); }
        const glow = new T.PointLight(W.vein, .9, 7); glow.position.y = 1; rg.add(glow);
        label = 'F · COLHER FUNGOS E ERVAS DO OUTRO MUNDO';
      } else {
        const pool = new T.Mesh(new T.CircleGeometry(2.4, 48), waterMat(W.vein, W.gr[2])); pool.rotation.x = -Math.PI / 2; pool.position.y = .05; pool.renderOrder = 5; pool.userData.own = 1; rg.add(pool);
        if (B) for (let k = 0; k < 7; k++) { const a = k / 7 * TAU; EHk(B, k % 2 ? 'rock_smallA' : 'rock_smallC', sp.x + Math.cos(a) * 2.5, -.05, sp.z + Math.sin(a) * 2.5, a, .45, W.peak); }
        L.inter.push({ type: 'riftCampWater456', x: sp.x, z: sp.z, r: 0, hidden: false, label: '', use() {} });
        label = 'F · ENCHER CANTIL / PESCAR NA POÇA DO OUTRO MUNDO';
      }
      const it = { type: 'riftRes456', kind: sp.kind, x: sp.x, z: sp.z, r: 2.8, grp: rg, charges: 2, label, use: () => gatherOtherworldRes456(it) };
      L.inter.push(it);
    }
    if (B) envOwn(grp, B.mesh(FLORAMAT));
  }

  /* ---------- Chegada: o portal vermelho fecha atrás de você ---------- */
  function arrive() {
    const st = L.ow460, e = st.entry, b = st.boss, dx = b.x - e.x, dz = b.z - e.z, l = Math.hypot(dx, dz) || 1, ux = dx / l, uz = dz / l;
    player.x = e.x + ux * 1.5; player.z = e.z + uz * 1.5; player.face = Math.atan2(ux, uz);
    pcCam.yaw = Math.atan2(-ux, -uz); pcCam.pitch = .16;
    if (window.RIFT131_ENABLE && window.Rift131) {
      const grp = Rift131.create({ seed: (L.gate?.seed || 131) | 0, red: true, legacyLinearOutput: true }); grp.position.set(e.x - ux * 2.4, 0, e.z - uz * 2.4); grp.rotation.y = Math.atan2(ux, uz); grp.scale.setScalar(.9);
      L.group.add(grp); st.arrival = { t: 0, grp, closed: false };
    } else st.arrival = { t: 0, grp: null, closed: false };
    st.cine = { t: 0, ux, uz };
  }

  /* ---------- Sinais, Cidadela e portal de volta ---------- */
  function onSignal(it) {
    const st = L.ow460; if (!st) return;
    if (it.beam) it.beam.material.uniforms.uOn.value = 0;
    const next = (L.riftSignalNodes456 || []).find(n => !n.tracked);
    if (next && next.beam) next.beam.material.uniforms.uOn.value = 1;
    if (!next) openCitadel();
  }
  function openCitadel() {
    const st = L.ow460; if (!st || st.open) return; st.open = true;
    for (const i of st.gateCells) if (L.grid.cells[i] === 2) L.grid.cells[i] = 1;
    if (st.curtain) { L.group.remove(st.curtain); st.curtain = null; }
    if (st.beam) st.beam.material.uniforms.uOn.value = 1;
    bigText('A CIDADELA SE ABRIU', 2200); try { sfx('gong'); shake(.45); } catch (_) {}
    toast('<b>[OUTRO MUNDO]</b> Os três sinais apontam para o feixe no horizonte: a <b>Cidadela do Soberano</b> abriu o portão. Não há saída deste mundo até ele cair.', 6500);
  }
  function openReturn() {
    const st = L.ow460; if (!st || st.returned) return; st.returned = true;
    const it = exitPortal(st.boss.x, st.boss.z, false);
    try { if (it && it.grp && window.Rift131) Rift131.open(it.grp); } catch (_) {}
    if (st.beam) st.beam.material.uniforms.uC.value.set(0xffd27a);
    setTimeout(() => { if (L.ow460 === st) { bigText('O PORTAL DE VOLTA SE ABRIU', 2400); toast('<b>[OUTRO MUNDO]</b> O Soberano caiu. O portal de volta para Primeva se abriu no centro da Cidadela. Em 2 minutos este mundo começa a transbordar.', 7000); } }, 900);
  }

  function zoneAt(x, z) {
    const st = L.ow460, de = Math.hypot(x - st.entry.x, z - st.entry.z), db = Math.hypot(x - st.boss.x, z - st.boss.z), f = de / Math.max(1, de + db);
    return f < .38 ? 1 : f < .72 ? 2 : 3;
  }
  function objective(obj) {
    const st = L.ow460; if (!st) return obj;
    const k = L.riftSignals456 || 0, m = L.riftSignalsMax456 || 3, day = L.riftDays456 || 1;
    let line;
    if (L.brk) line = 'O mundo está transbordando · o portal de volta está aberto na Cidadela';
    else if (L.bossDead) line = 'O portal de volta está aberto no centro da Cidadela · transbordo em ' + fmtT(Math.max(0, L.closeT));
    else if (!st.open) line = 'Siga o Sinal de Energia ' + Math.min(m, k + 1) + '/' + m + ' (feixe aceso no horizonte) · a Cidadela está selada';
    else line = L.defense ? 'Cidadela aberta · defenda o Núcleo da Fenda · o portal de volta só abre quando a defesa terminar' : L.combat117 && !L.combat117.spawned ? 'Cidadela aberta · derrote os acampamentos para despertar o Soberano' : 'Cidadela aberta · derrote o Soberano · não há saída até ele cair';
    let rest = String(obj || '');
    if (/^(\[[^\]]*\] )?Salas /.test(rest) || /^(\[[^\]]*\] )?Transbordo em /.test(rest) || /^(\[[^\]]*\] )?TRANSBORDO/.test(rest)) rest = '';
    return st.name + ' · Dia ' + day + ' · ' + ZONES[st.zone - 1] + '\n' + line + (rest ? '\n' + rest : '');
  }
  function map(ctx, tx, tz, full) {
    const st = L.ow460; if (!st) return;
    const pulse = .6 + .4 * Math.sin(performance.now() / 260);
    const next = (L.riftSignalNodes456 || []).find(n => !n.tracked);
    if (next) { ctx.save(); ctx.translate(tx(next.x), tz(next.z)); ctx.rotate(Math.PI / 4); ctx.fillStyle = 'rgba(216,180,255,' + pulse + ')'; const s = full ? 7 : 5; ctx.fillRect(-s, -s, s * 2, s * 2); ctx.restore(); }
    ctx.strokeStyle = st.open ? '#ffd27a' : 'rgba(255,210,122,.45)'; ctx.lineWidth = full ? 3 : 2; ctx.beginPath(); ctx.arc(tx(st.boss.x), tz(st.boss.z), full ? 12 : 7, 0, TAU); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,48,64,.7)'; ctx.lineWidth = 2; const X = tx(st.entry.x), Z = tz(st.entry.z), s = full ? 6 : 4; ctx.beginPath(); ctx.moveTo(X - s, Z - s); ctx.lineTo(X + s, Z + s); ctx.moveTo(X + s, Z - s); ctx.lineTo(X - s, Z + s); ctx.stroke();
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
        toast('<b>[OUTRO MUNDO · ' + st.name + ']</b> O portal se fechou atrás de você. Este mundo só deixa você voltar quando o <b>Soberano</b> dele cair. Siga o feixe dos <b>Sinais de Energia</b> pelas 3 zonas até a Cidadela. ' + (st.weather ? '<i>' + st.weather + '.</i>' : ''), 8000);
      }
    }
    // dia do Outro Mundo: um ciclo por DAY_LENGTH, céu e luz acompanham
    const DAY = typeof DAY_LENGTH !== 'undefined' ? DAY_LENGTH : 1200, f = (st.t / DAY + .3) % 1, day = .5 + .5 * Math.cos((f - .5) * TAU);
    if (st.skyU) st.skyU.uDay.value = .35 + .65 * day;
    const W = st.W; if (W) { sun.intensity = W.sunI * (.5 + .5 * day); hemi.intensity = W.hI * (.6 + .4 * day); }
    const dn = Math.floor(st.t / DAY); if (dn > st.lastDay) { st.lastDay = dn; L.riftDays456 = (L.riftDays456 || 1) + 1; toast('<b>[OUTRO MUNDO]</b> Amanhece o <b>dia ' + L.riftDays456 + '</b> deste mundo. Lá fora, em Primeva, o tempo corre mais rápido.', 5000); }
    for (const fl of st.floats || []) { fl.h.position.y = fl.y + Math.sin(st.t * .35 + fl.ph) * 1.1; fl.h.rotation.y += dt * .04; }
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
    // órbita em volta do herói: começa de frente (ângulo da direção do chefe + 0,35) e termina na câmera normal, sem atravessar o corpo
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
  const prevCam = camUpdate; camUpdate = function (dt) { prevCam.apply(this, arguments); try { camAfter(dt); } catch (e) { console.warn('OW460.cam', e); } };

  /* cristal pequeno do Tripo para outros sistemas (ex.: marcas do cerco ao sair da Fenda) */
  function shard(parent, x, y, z, H, col) { return placeGlb(parent, crystalPath('cristal-veio'), H, x, y, z, Math.random() * TAU, m => crystalMat(m, col)); }

  window.OW460 = { shard, WORLDS, applies, layout, render, setupHunt, arrive, onSignal, openCitadel, openReturn, objective, map, zoneAt, tick };
})();
