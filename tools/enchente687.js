/* v692 (Ian: "quando alagar ela tem que ir pros lugares que nem se fosse na vida real, tem que ter física"):
   a enchente agora é uma lâmina d'água no nível real do rio/lago (margem + nível da chuva). Ela só aparece onde o
   chão fica abaixo desse nível, então a água escorre para os baixios e para nas elevações, como na vida real.
   Antes o rio só "alargava" 5 m no shader e a água subia pelas paredes do leito. A regra de nado (water391) usa o
   mesmo nível, então dá para nadar onde alagou. */
(function () {
  'use strict';
  const T = THREE, N = 72, STEP = 2.5, REACH = 70, SPAN = N * STEP;
  const RISE = () => window.RAIN626 ? RAIN626.rise.value : 0, FLOOD = () => window.RAIN626 ? RAIN626.flood.value : 0;
  const geo = new T.PlaneGeometry(SPAN, SPAN, N, N); geo.rotateX(-Math.PI / 2);
  const cnt = geo.attributes.position.count, aBase = new Float32Array(cnt).fill(-999), aTer = new Float32Array(cnt);
  geo.setAttribute('aBase', new T.BufferAttribute(aBase, 1)); geo.setAttribute('aTer', new T.BufferAttribute(aTer, 1));
  const U = { uTime: { value: 0 }, uRise: RAIN626.rise, uFlood: RAIN626.flood, uNight: window.NIGHT153U || (window.NIGHT153U = { value: 0 }) };
  const mat = new T.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, fog: false,
    vertexShader: `attribute float aBase,aTer;uniform float uRise;varying float vD;varying vec3 vW;
      void main(){vec4 w=modelMatrix*vec4(position,1.);float lv=aBase+uRise;w.y=lv;vD=lv-aTer;vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader: `uniform float uTime,uFlood,uNight;varying float vD;varying vec3 vW;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
      void main(){if(vD<.02||uFlood<.01)discard;float t=uTime;vec2 p=vW.xz;
        float e=.08;float w0=n(p*.9+t*.35)+n(p*2.3-t*.5)*.5;vec2 g=vec2(n((p+vec2(e,0))*.9+t*.35)+n((p+vec2(e,0))*2.3-t*.5)*.5-w0,n((p+vec2(0,e))*.9+t*.35)+n((p+vec2(0,e))*2.3-t*.5)*.5-w0)/e;
        vec3 nr=normalize(vec3(-g.x*.12,1.,-g.y*.12));vec3 V=normalize(cameraPosition-vW);
        float fres=.04+.96*pow(1.-clamp(dot(nr,V),0.,1.),5.);
        vec3 sky=mix(vec3(.55,.66,.74),vec3(.08,.11,.2),uNight),body=mix(vec3(.17,.19,.15),vec3(.04,.05,.06),uNight);
        float deep=smoothstep(.0,1.4,vD);vec3 col=mix(body*1.3,body*.7,deep);col=mix(col,sky,fres*.8);
        vec3 L=normalize(vec3(-.4,.8,.45));col+=pow(max(0.,dot(reflect(-L,nr),V)),180.)*mix(1.2,.3,uNight);
        float foam=smoothstep(.22,.0,vD)*smoothstep(.35,.7,n(p*3.+t*.6));col=mix(col,vec3(.85,.86,.82)*mix(1.,.35,uNight),foam*.6);
        float a=smoothstep(.02,.3,vD)*mix(.55,.84,deep)*smoothstep(0.,.25,uFlood);gl_FragColor=vec4(col,a);}`
  });
  const mesh = new T.Mesh(geo, mat); mesh.frustumCulled = false; mesh.userData.terrainAbsolute245 = true; mesh.renderOrder = 3; mesh.visible = false;
  let cx = 1e9, cz = 1e9;
  /* nível de base (sem a chuva) da água mais perto; -999 = longe de água */
  function baseAt(x, z) {
    let best = -999, bd = REACH;
    try {
      const rv = riverNear239(x, z), w = riverWidth351(rv.b, z), d = rv.d - w / 2;
      if (d < bd && snowB(rv.x, z) > .29 && snowB(rv.x, z) <= .717) { bd = Math.max(0, d); best = terrH(rv.x + w / 2, z) + .06 }
      const lk = lakeAt239(Math.round(x / CH), Math.round(z / CH));
      if (lk && !['neve', 'cristal'].includes(biomeAt(lk.x, lk.z))) { const dl = Math.hypot(x - lk.x, z - lk.z) - lk.r; if (dl < bd) { bd = dl; best = terrH(lk.x + lk.r, lk.z) + .06 } }
    } catch (_) {}
    return best;
  }
  function rebuild(px, pz) {
    cx = Math.round(px / 20) * 20; cz = Math.round(pz / 20) * 20; mesh.position.set(cx, 0, cz); mesh.updateMatrixWorld();
    const P = geo.attributes.position.array;
    for (let i = 0; i < cnt; i++) { const x = cx + P[i * 3], z = cz + P[i * 3 + 2]; aTer[i] = terrH(x, z); aBase[i] = baseAt(x, z) }
    geo.attributes.aBase.needsUpdate = geo.attributes.aTer.needsUpdate = true;
  }
  const API = window.Enchente687 = {
    rebuild: () => { cx = 1e9 },
    /* topo da água alagada em (x,z) ou null — usado pela regra de nado */
    at(x, z) { if (FLOOD() < .05) return null; const b = baseAt(x, z); if (b < -900) return null; const top = b + RISE(), g = terrH(x, z); return g < top - .02 ? top : null }
  };
  let last = performance.now();
  function tick() {
    requestAnimationFrame(tick);
    try {
      const now = performance.now(); U.uTime.value = now / 1000; last = now;
      const ok = typeof started !== 'undefined' && started && L.mode === 'world' && !L.grid && typeof player !== 'undefined' && player && FLOOD() > .01;
      mesh.visible = !!ok; if (!ok) return;
      if (mesh.parent !== scene) scene.add(mesh);
      if (Math.abs(player.x - cx) > 20 || Math.abs(player.z - cz) > 20) rebuild(player.x, player.z);
    } catch (_) {}
  }
  requestAnimationFrame(tick);
})();
