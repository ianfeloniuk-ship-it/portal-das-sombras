/* v439 (Ian, pacote Sobrevivência parte 4): o Mar de Thalor.
   O relevo (tools/terrain245.js, seaD439/seaBed439) afunda tudo a oeste da costa: praia, recifes de coral (até ~450 m),
   alto-mar (até −22 m) e fossas (até −64 m). Nível do mar = TER245.SEA439.Y (y absoluto). Thalor fica na costa; as
   cidades além dela viram ilhas (o disco plano da cidade sobe acima da água) e as estradas afundam no alto-mar.
   Aqui: superfície do mar (ondas, cor pela profundidade, espuma na praia), nada de árvore/casa/pedra no fundo,
   e bichos terrestres que nasceriam no fundo viram bichos do mar. Água do mar não mata a sede (tools/survival437.js). */
(function () {
  'use strict';
  const T = THREE;
  const SE = () => window.TER245 && TER245.SEA439;
  const ready = () => typeof started !== 'undefined' && started && typeof player !== 'undefined' && player && run;
  const depth = (x, z) => { const s = SE(); if (!s || s.d(x, z) < -60) return 0; return Math.max(0, s.Y - terrH(x, z)); };
  const API = window.Sea439 = { depth, inSea: (x, z) => depth(x, z) > .05 };

  /* ---------- superfície ---------- */
  // perto: 1,2 km com 7,5 m de malha (espuma da praia); longe: 9 km, malha grossa, só fora do quadrado de perto
  const NEAR = 1200, FAR = 9000;
  const geo = new T.PlaneGeometry(NEAR, NEAR, 160, 160); geo.rotateX(-Math.PI / 2);
  const geoFar = new T.PlaneGeometry(FAR, FAR, 90, 90); geoFar.rotateX(-Math.PI / 2);
  const U = { t: { value: 0 }, uDay: { value: 1 }, uY: { value: -.9 }, uC: { value: new T.Vector2() }, uHole: { value: 0 } };
  const WAVE = 'float wv(vec2 p,float t){return .18*sin(p.x*.21+t*1.3)+.12*sin(p.y*.17-t*1.1)+.06*sin((p.x+p.y)*.45+t*2.);}';
  const mat = new T.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, side: T.DoubleSide,
    vertexShader: 'uniform float t;uniform float uY;varying float vDepth;varying float vSea;varying vec3 vW;' + WAVE +
      'void main(){vec4 w=modelMatrix*vec4(position,1.);w.y=uY+wv(w.xz,t);vDepth=uY-terrH245(w.xz);vSea=seaD439(w.xz);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
    fragmentShader: 'uniform float t;uniform float uDay;uniform vec2 uC;uniform float uHole;varying float vDepth;varying float vSea;varying vec3 vW;' + WAVE +
      'void main(){if(vDepth<-.05||vSea<-60.)discard;if(uHole>0.&&abs(vW.x-uC.x)<uHole&&abs(vW.z-uC.y)<uHole)discard;' +
      'float e=.4,hx=wv(vW.xz+vec2(e,0.),t)-wv(vW.xz-vec2(e,0.),t),hz=wv(vW.xz+vec2(0.,e),t)-wv(vW.xz-vec2(0.,e),t);' +
      'vec3 n=normalize(vec3(-hx/(2.*e),1.,-hz/(2.*e)));vec3 v=normalize(cameraPosition-vW);if(!gl_FrontFacing)n=-n;' +
      'float k=1.-exp(-max(vDepth,0.)*.16);vec3 col=mix(vec3(.24,.78,.76),vec3(.03,.17,.34),k);' +
      'vec3 sky=mix(vec3(.08,.12,.25),vec3(.58,.78,.96),uDay);float fr=pow(1.-max(dot(n,v),0.),3.);col=mix(col,sky,fr*.55);' +
      'vec3 l=normalize(vec3(.4,.8,.3));col+=vec3(1.,.95,.85)*pow(max(dot(reflect(-l,n),v),0.),70.)*.7*uDay;' +
      'float foam=(1.-smoothstep(0.,.8,vDepth))*(.55+.45*sin(vW.x*.7+vW.z*.5+t*2.3));col=mix(col,vec3(.96,.98,1.),clamp(foam,0.,1.)*.75);' +
      'col*=mix(.32,1.,uDay);if(!gl_FrontFacing)col=mix(col,vec3(.05,.3,.38),.6);' +
      'gl_FragColor=vec4(col,mix(.55,.93,k)+foam*.3);}'
  });
  const surf = new T.Mesh(geo, mat);
  surf.userData.terrainAbsolute245 = true; surf.frustumCulled = false; surf.renderOrder = 4; surf.visible = false; surf.name = 'Sea439';
  const matFar = mat.clone(); matFar.uniforms = Object.assign({}, U, { uHole: { value: NEAR / 2 - 15 } });
  const far = new T.Mesh(geoFar, matFar); far.userData.terrainAbsolute245 = true; far.frustumCulled = false; far.renderOrder = 3; far.visible = false; far.name = 'Sea439far';
  scene.add(surf, far);
  function dayK() {
    try { const p = ((dayT % DAYLEN) + DAYLEN) % DAYLEN / DAYLEN; // noite entre NIGHT0_377 e NIGHT1_377
      const a = NIGHT0_377, b = NIGHT1_377, ss = (e0, e1, x) => { const q = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return q * q * (3 - 2 * q); };
      return p < a ? 1 - ss(a - .05, a, p) : p > b ? ss(b, b + .04, p) : 0; } catch (_) { return 1; }
  }

  /* ---------- nada de cenário de terra firme no fundo do mar ---------- */
  // o cenário do pedaço é montado às vezes antes do relevo ligar (terrH = 0): mede com o relevo ligado
  const deepAt = (x, z) => { const s = SE(); if (!s || s.d(x, z) < -60) return false; const o = TER245.on.value; TER245.on.value = 1; const h = terrH(x, z); TER245.on.value = o; return s.Y - h > .35; };
  if (typeof EH === 'function') { const eh0 = EH; EH = function (batch, key, x, y, z) { try { if (deepAt(x, z)) return 0; } catch (_) {} return eh0.apply(this, arguments); }; }
  if (typeof EW === 'function') { const ew0 = EW; EW = function (batch, key, x, y, z) { try { if (deepAt(x, z)) return 0; } catch (_) {} return ew0.apply(this, arguments); }; }
  /* bichos: o que nasceria no fundo vira bicho do mar (mesmo rank e mesmas regras) */
  const MARINE = ['homempeixe', 'lula', 'arraia', 'peixinho'];
  const isMarine = k => /^(homempeixe|lula|arraia|peixinho|glub|glubancio)(_[fa])?$/.test(k || '');
  API.MARINE = MARINE; API.isMarine = isMarine;
  if (typeof spawnKind === 'function') {
    const sk0 = spawnKind;
    spawnKind = function (k, x, z, gr, extra = {}) {
      try {
        if (L.mode === 'world' && !isMarine(k) && !(extra && (extra.story || extra.boss || extra.keep439)) && depth(x, z) > 1.4) {
          const suf = (/_([fa])$/.exec(k) || [])[0] || '', m = MARINE[(Math.abs(Math.floor(x * 7 + z * 13)) % MARINE.length)] + suf;
          if (typeof KINDS !== 'undefined' && KINDS[m]) k = m; else if (KINDS[MARINE[0]]) k = MARINE[0];
        }
      } catch (_) {}
      return sk0.call(this, k, x, z, gr, extra);
    };
  }

  /* ---------- aviso ao chegar ---------- */
  let seen = false, lastNear = false;
  let last = performance.now();
  function loop() {
    const now = performance.now(), dt = Math.min(.1, (now - last) / 1000); last = now;
    try {
      const s = SE(), on = !!(s && ready() && L.mode === 'world' && TER245.on.value);
      const near = on && s.d(player.x, player.z) > -2500;
      surf.visible = far.visible = near;
      if (near) {
        U.t.value += dt; U.uY.value = s.Y; U.uDay.value = dayK();
        surf.position.set(Math.round(player.x / 10) * 10, 0, Math.round(player.z / 10) * 10); surf.updateMatrixWorld();
        U.uC.value.set(surf.position.x, surf.position.z); far.position.copy(surf.position); far.updateMatrixWorld();
        if (!lastNear && !seen && s.d(player.x, player.z) > -250) { seen = true; toast('<b>[MAR DE THALOR]</b> O cheiro de sal chega com o vento. Recifes perto da praia, alto-mar e fossas mais adiante. Água do mar não mata a sede: só destilada.', 7000); }
      }
      lastNear = near && s.d(player.x, player.z) > -250;
    } catch (e) { if (!loop.err) { loop.err = 1; console.warn('sea439', e); } }
    setTimeout(loop, 16);
  }
  loop();
  API.surface = surf;
})();
