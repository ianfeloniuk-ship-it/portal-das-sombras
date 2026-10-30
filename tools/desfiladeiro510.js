/* v510 (Ian, 21/10/2026): O DESFILADEIRO DO MARCO ZERO (Estrada Sul de Aster — Skyrim x Primeva).
   - Transforma a primeira parte do mapa (onde o jogador desperta após o sonho com o Arquiteto)
     em uma garganta montanhosa majestosa inspirada em Skyrim:
     1. Flancos em desfiladeiro (oeste: x = -15..-25; leste: x = +15..+25, de z = 88 a 260):
        Paredões maciços de rocha lascada (tripo-rocha-musgo154 (sem o antigo elmo rotulado como rochedo)) com 14 a 24 m de altura,
        degraus geológicos e quinas angulares (anti-primitivas). Colisão sólida via addCol / HASH.
     2. Coníferas Nórdicas Gigantes (flora/abeto_geada_adulta, v689):
        Pinheiros monumentais de 18 a 24 m de altura (escala 3x) empoleirados nas cristas e saliências das rochas,
        com galhos arqueados sobre a garganta que quebram o horizonte e filtram a luz solar.
     3. Enquadramento Cênico ("Vista Shot"):
        Ao despertar deitado a z ≈ 109 olhando para o Norte (0°), os paredões e copas de pinheiro
        atuam como cortinas naturais de teatro que emolduram perfeitamente o Portão Sul e as tochas de Aster.
     4. Cenografia Rústica de Acidente:
        Muro de pedra seca (tripo-muro154 rebaixado a 1.3 m) contendo o barranco da estrada; toras caídas com musgo,
        caixotes espalhados e tochas rústicas em postes de madeira com faíscas suaves iluminando o local do acidente.
     5. Neblina Rasteira de Vale (Ground Mist):
        Camada suave de névoa rasteira entre 0.4 e 2.2 m do solo no leito da garganta.
*/
(function () {
  'use strict';
  const T = THREE;
  const API = window.Desfiladeiro510 = { mounted: false, grp: null };

  const glbCache = new Map();
  function glb(name) {
    if (glbCache.has(name)) return glbCache.get(name);
    const p = new Promise(res => {
      if (!T.GLTFLoader) { res(null); return; }
      const l = new T.GLTFLoader();
      if (window.MeshoptDecoder) l.setMeshoptDecoder(MeshoptDecoder);
      l.load('models/' + name + '.glb', g => {
        const root = g.scene;
        root.updateMatrixWorld(true);
        root.traverse(o => {
          if (!o.isMesh) return;
          const fix = m => {
            const mat = m.clone();
            mat.side = T.DoubleSide;
            if (mat.map) {
              mat.map.encoding = T.sRGBEncoding;
              mat.color.setScalar(1.25);
              mat.emissiveMap = mat.map;
              mat.emissive.setRGB(.18, .17, .16);
            }
            mat.roughness = Math.max(.75, mat.roughness || 0);
            mat.metalness = 0;
            return mat;
          };
          o.material = Array.isArray(o.material) ? o.material.map(fix) : fix(o.material);
          o.castShadow = true;
          o.receiveShadow = true;
          o.geometry.userData.shared = true;
        });
        const b = new T.Box3().setFromObject(root), s = b.getSize(new T.Vector3()), wrap = new T.Group();
        root.position.set(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2);
        wrap.add(root);
        wrap.userData.s = s;
        res(wrap);
      }, undefined, () => res(null));
    });
    glbCache.set(name, p);
    return p;
  }

  function place(tpl, o) {
    const g = tpl.clone(true), s = tpl.userData.s, k = o.h / s.y;
    g.scale.set(o.sx ? o.sx / s.x : k, k * (o.sy || 1), o.sz ? o.sz / s.z : k);
    g.position.set(o.x, o.y || 0, o.z);
    g.rotation.y = o.ry || 0;
    if (o.rz) g.rotation.z = o.rz;
    if (o.rx) g.rotation.x = o.rx;
    if (o.tint) g.traverse(m => {
      if (m.isMesh) {
        const f = x => {
          const c = x.clone();
          c.color.multiply(new T.Color(o.tint[0], o.tint[1], o.tint[2]));
          return c;
        };
        m.material = Array.isArray(m.material) ? m.material.map(f) : f(m.material);
      }
    });
    return g;
  }

  /* Shaders e partículas de névoa rasteira e fogo */
  let mistTex = null;
  const softTex = () => mistTex || (mistTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const x = c.getContext('2d'), r = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, 'rgba(255,255,255,1)');
    r.addColorStop(.35, 'rgba(230,240,255,.4)');
    r.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = r; x.fillRect(0, 0, 64, 64);
    return new T.CanvasTexture(c);
  })());

  function groundMist(pts) {
    if (!pts.length) return null;
    const pos = new Float32Array(pts.length * 3), at = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      pos.set([p.x, p.y, p.z], i * 3);
      at.set([p.size, p.drift || .15, Math.random()], i * 3);
    });
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    geo.setAttribute('a', new T.BufferAttribute(at, 3));
    const mat = new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false,
      uniforms: { t: { value: 0 }, c: { value: new T.Color(0xd2e2ee) }, map: { value: softTex() } },
      vertexShader: 'uniform float t;attribute vec3 a;varying float vA;void main(){vec3 p=position;float u=fract(t*0.03+a.z);p.y+=sin(u*6.2831)*0.35;p.x+=sin(t*0.25+a.z*12.)*1.8;p.z+=cos(t*0.2+a.z*9.)*1.5;vA=sin(u*3.14159)*0.22;vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=a.x*(380./-mv.z);gl_Position=projectionMatrix*mv;}',
      fragmentShader: 'uniform sampler2D map;uniform vec3 c;varying float vA;void main(){vec4 s=texture2D(map,gl_PointCoord);gl_FragColor=vec4(c,1.)*s.a*vA;}'
    });
    const m = new T.Points(geo, mat);
    m.frustumCulled = false;
    m.renderOrder = 4;
    m.onBeforeRender = () => { mat.uniforms.t.value = performance.now() / 1000; };
    return m;
  }

  function torchFlame(pts) {
    if (!pts.length) return null;
    const pos = new Float32Array(pts.length * 3), at = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      pos.set([p.x, p.y, p.z], i * 3);
      at.set([p.size, 1.0, Math.random()], i * 3);
    });
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    geo.setAttribute('a', new T.BufferAttribute(at, 3));
    const mat = new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false,
      uniforms: { t: { value: 0 }, c: { value: new T.Color(0xffaa44) }, map: { value: softTex() } },
      vertexShader: 'uniform float t;attribute vec3 a;varying float vA;void main(){vec3 p=position;float f=0.75+0.25*sin(t*11.+a.z*50.);vA=f;vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=a.x*f*(420./-mv.z);gl_Position=projectionMatrix*mv;}',
      fragmentShader: 'uniform sampler2D map;uniform vec3 c;varying float vA;void main(){vec4 s=texture2D(map,gl_PointCoord);gl_FragColor=vec4(c,1.)*s.a*vA;}'
    });
    const m = new T.Points(geo, mat);
    m.frustumCulled = false;
    m.renderOrder = 9;
    m.onBeforeRender = () => { mat.uniforms.t.value = performance.now() / 1000; };
    return m;
  }

  /* Definição das peças da garganta (Marco Zero — Estrada Sul de Aster) */
  const CLIFFS = [
    // Flanco Oeste (x negativo): paredão contínuo escalonado
    { t: 'boulder',  x: -16, z: 94,  h: 18.0, ry: 0.45, r: 4.8 },
    { t: 'mossrock', x: -21, z: 108, h: 22.0, ry: 1.15, r: 5.4 }, // Exatamente ao lado da carroça tombada
    { t: 'boulder',  x: -12, z: 106, h: 10.5, ry: 2.10, r: 3.6 }, // Degrau baixo junto à vala
    { t: 'mossrock', x: -17, z: 126, h: 17.5, ry: 1.85, r: 4.6 },
    { t: 'boulder',  x: -22, z: 144, h: 21.0, ry: 0.75, r: 5.2 },
    { t: 'mossrock', x: -16, z: 162, h: 18.5, ry: 2.50, r: 4.8 },
    { t: 'boulder',  x: -21, z: 182, h: 23.0, ry: 1.40, r: 5.5 },
    { t: 'mossrock', x: -18, z: 204, h: 19.0, ry: 0.30, r: 4.9 },
    { t: 'boulder',  x: -22, z: 226, h: 21.5, ry: 2.20, r: 5.2 },
    { t: 'mossrock', x: -17, z: 248, h: 18.0, ry: 1.10, r: 4.6 },

    // Flanco Leste (x positivo): contra-falésia com vista emoldurada
    { t: 'mossrock', x: 17,  z: 95,  h: 19.0, ry: 2.30, r: 4.9 },
    { t: 'boulder',  x: 22,  z: 110, h: 24.0, ry: 0.90, r: 5.6 }, // Exatamente defronte ao despertar do jogador
    { t: 'mossrock', x: 12,  z: 112, h: 11.0, ry: 1.65, r: 3.8 }, // Degrau de pedra lascada leste
    { t: 'boulder',  x: 18,  z: 130, h: 18.0, ry: 1.95, r: 4.7 },
    { t: 'mossrock', x: 23,  z: 148, h: 22.0, ry: 2.80, r: 5.4 },
    { t: 'boulder',  x: 17,  z: 168, h: 19.5, ry: 0.60, r: 4.9 },
    { t: 'mossrock', x: 22,  z: 188, h: 23.5, ry: 2.15, r: 5.5 },
    { t: 'boulder',  x: 18,  z: 210, h: 18.5, ry: 1.30, r: 4.8 },
    { t: 'mossrock', x: 22,  z: 232, h: 22.0, ry: 0.80, r: 5.3 },
    { t: 'boulder',  x: 17,  z: 252, h: 18.0, ry: 2.40, r: 4.7 }
  ];

  const PINES = [
    // Coníferas nórdicas gigantes (18 a 24m) nas cristas e saliências
    { x: -22, z: 96,  h: 21.0, ry: 0.3, rz:  0.07 },
    { x: -25, z: 112, h: 24.0, ry: 1.2, rz:  0.09 }, // Árvore-mãe acima da carroça
    { x: -19, z: 128, h: 19.5, ry: 2.1, rz: -0.04 },
    { x: -24, z: 146, h: 22.5, ry: 0.8, rz:  0.08 },
    { x: -20, z: 165, h: 20.0, ry: 2.6, rz:  0.05 },
    { x: -25, z: 185, h: 23.0, ry: 1.4, rz: -0.06 },
    { x: -21, z: 208, h: 19.0, ry: 0.5, rz:  0.07 },
    { x: -24, z: 230, h: 22.0, ry: 2.2, rz:  0.06 },

    { x:  24, z: 98,  h: 22.0, ry: 2.4, rz: -0.08 },
    { x:  26, z: 114, h: 24.5, ry: 0.9, rz: -0.10 }, // Pinheiro colossal emoldurando o leste
    { x:  20, z: 132, h: 19.0, ry: 1.7, rz:  0.05 },
    { x:  25, z: 152, h: 23.0, ry: 2.9, rz: -0.07 },
    { x:  21, z: 172, h: 20.5, ry: 0.4, rz: -0.06 },
    { x:  26, z: 192, h: 24.0, ry: 2.0, rz:  0.08 },
    { x:  22, z: 214, h: 19.5, ry: 1.1, rz: -0.05 },
    { x:  25, z: 236, h: 22.5, ry: 0.7, rz: -0.08 },

    // Pinheiros jovens na meia-encosta (10 a 14m)
    { x: -14, z: 118, h: 12.0, ry: 1.5, rz: 0.04 },
    { x:  14, z: 122, h: 13.0, ry: 2.7, rz: -0.03 },
    { x: -13, z: 175, h: 11.5, ry: 0.9, rz: 0.05 },
    { x:  13, z: 180, h: 12.5, ry: 2.2, rz: -0.04 }
  ];

  /* v523: a garganta agora vai até z 520; mais pinheiros nas cristas, lados alternados, alturas e giros determinísticos */
  for (let z = 250, i = 0; z <= 520; z += 17, i++) {
    const r1 = Math.abs(Math.sin(z * 12.9898 + 4.1)) , r2 = Math.abs(Math.sin(z * 78.233 + 1.7)), side = i % 2 ? 1 : -1;
    PINES.push({ x: side * (22 + r1 * 5), z, h: 18 + r2 * 6.5, ry: r1 * 6.28, rz: side * (-.04 - r2 * .06) });
  }

  const WALLS = [
    // Muro de pedra seca rústico (rebaixado a 1.25m) segurando o barranco
    { x: -7.2, z: 98,  h: 1.3, sx: 4.8, ry: 0.08 },
    { x: -7.0, z: 104, h: 1.3, sx: 4.8, ry: -0.04 },
    { x: -7.1, z: 114, h: 1.3, sx: 5.2, ry: 0.06 },
    { x: -7.3, z: 122, h: 1.3, sx: 5.0, ry: -0.05 },
    { x:  7.2, z: 100, h: 1.3, sx: 4.8, ry: -0.06 },
    { x:  7.1, z: 108, h: 1.3, sx: 5.0, ry: 0.05 },
    { x:  7.3, z: 118, h: 1.3, sx: 5.2, ry: -0.04 }
  ];

  const TORCHES = [
    { x:  5.4, y: 1.8, z: 105.0, size: 2.8 }, // Tocha ao lado do acidente
    { x: -5.4, y: 1.8, z: 122.0, size: 2.6 }, // Tocha na curva sul
    { x:  5.2, y: 1.8, z: 155.0, size: 2.6 },
    { x: -5.2, y: 1.8, z: 195.0, size: 2.6 }
  ];

  /* v523: a garganta serpenteia (centro gc510, igual a terrain245.js e mundo513.js); as peças seguem o centro */
  const ssm = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
  const gc510 = z => ssm(100, 260, z) * (130 * Math.sin(z * .005712) + 52 * Math.sin(z * .013369) + 18 * Math.sin(z * .033069));
  const follow = arr => arr.map(o => Object.assign({}, o, { x: o.x + gc510(o.z) }));

  /* Montagem cenográfica completa */
  API.build = function (c, parentGroup, addCol) {
    if (API.mounted && API.grp && API.grp.parent) return API.grp;
    const parent = parentGroup || (typeof scene !== 'undefined' ? scene : null);
    if (!parent) return null;

    const g = new T.Group();
    g.name = 'DesfiladeiroMarcoZero510';
    g.userData.terrainAbsolute245 = true;
    parent.add(g);
    API.grp = g;

    const PI = follow(PINES), WA = follow(WALLS), TO = follow(TORCHES);
    Promise.all([
      Promise.resolve(null), // slot legado do elmo removido; usa mMoss abaixo
      glb('tripo-rocha-musgo154'),
      glb('flora/abeto_geada_adulta'), // v689: abeto de geada do Drive no lugar da conífera antiga do Tripo
      glb('tripo-muro154'),
      glb('tripo-pedras437')
    ]).then(([mBoulder, mMoss, mFir, mWall, mStones]) => {
      if (!g.parent) return;

      const gy = (x, z) => typeof terrH === 'function' ? terrH(x, z) : 0;
      const registerCol = (x, z, r) => {
        if (typeof addCol === 'function') addCol({ x, z, r });
        else if (typeof hadd === 'function' && typeof HASH !== 'undefined') hadd(HASH, { x, z, r });
      };

      // 1. Falésias e paredões de rocha lascada
      [].forEach(cf => { /* v523: os paredões agora são relevo (terrain245.js) */
        const tpl = cf.t === 'mossrock' ? (mMoss || mBoulder) : (mBoulder || mMoss);
        if (!tpl) return;
        const y = gy(cf.x, cf.z) - 0.4;
        const mesh = place(tpl, { x: cf.x, y, z: cf.z, h: cf.h, ry: cf.ry });
        g.add(mesh);
        registerCol(cf.x, cf.z, cf.r);
      });

      // 2. Coníferas nórdicas majestosas
      if (mFir) {
        PI.forEach(pn => {
          const y = gy(pn.x, pn.z) - 0.3;
          const tree = place(mFir, { x: pn.x, y, z: pn.z, h: pn.h, ry: pn.ry, rz: pn.rz });
          g.add(tree);
          registerCol(pn.x, pn.z, 1.2);
        });
      }

      // 3. Muros de pedra seca rústicos nas margens
      if (mWall) {
        WA.forEach(wl => {
          const y = gy(wl.x, wl.z) - 0.15;
          const wMesh = place(mWall, { x: wl.x, y, z: wl.z, h: wl.h, sx: wl.sx, ry: wl.ry, sy: 0.45 });
          g.add(wMesh);
          registerCol(wl.x, wl.z, 1.0);
        });
      }

      // 4. Cascalho e pedras menores ao longo da base das rochas
      if (mStones) {
        [-13, 13, -15, 15].forEach((sx, i) => {
          const sz = 102 + i * 28, y = gy(sx, sz) - 0.1;
          const pMesh = place(mStones, { x: sx, y, z: sz, h: 1.4, ry: i * 1.5 });
          g.add(pMesh);
        });
      }

      // 5. Postes de tocha com fogo suave
      const torchMesh = torchFlame(TO.map(t => ({ x: t.x, y: gy(t.x, t.z) + 1.8, z: t.z, size: t.size })));
      if (torchMesh) g.add(torchMesh);

      // Adicionar postes de madeira rústicos sob as tochas
      if (typeof ENV !== 'undefined' && ENV.m && ENV.m.post_skull && typeof envMesh === 'function') {
        TO.forEach(tc => {
          const py = gy(tc.x, tc.z);
          const post = envMesh('post_skull');
          post.scale.setScalar(1.2);
          post.position.set(tc.x, py, tc.z);
          g.add(post);
        });
      }

      // 6. Neblina rasteira do vale (Ground Mist)
      const mistPoints = [];
      for (let z = 92; z <= 520; z += 12) {
        for (let x = -8; x <= 8; x += 8) {
          const my = gy(x, z) + 0.6;
          mistPoints.push({ x: x + gc510(z) + (Math.random() - .5) * 4, y: my, z: z + (Math.random() - .5) * 4, size: 9.5 + Math.random() * 4 });
        }
      }
      const mist = groundMist(mistPoints);
      if (mist) g.add(mist);

      API.mounted = true;
    });

    return g;
  };

  /* Gancho automático em buildCity para Aster */
  const bc0 = window.buildCity;
  if (typeof bc0 === 'function') {
    window.buildCity = function (c, g, addCol, R) {
      const res = bc0.apply(this, arguments);
      try {
        if (c && c.name === 'Aster') {
          API.build(c, g, addCol);
        }
      } catch (err) {
        console.warn('Desfiladeiro510', err);
      }
      return res;
    };
  }

  /* Monitoramento e montagem automática quando perto de Aster */
  API.ensure = function () {
    try {
      if (typeof L === 'undefined' || L.mode !== 'world' || typeof scene === 'undefined') return;
      const p = typeof player !== 'undefined' ? player : null;
      if (!p) return;
      const d = Math.hypot(p.x, p.z);
      if (d < 450) {
        if (!API.mounted || !API.grp || !API.grp.parent) {
          API.build({ name: 'Aster', x: 0, z: 0 }, scene, null);
        } else {
          API.grp.visible = true;
        }
      } else if (API.grp) {
        API.grp.visible = false;
      }
    } catch (_) {}
  };

  setInterval(API.ensure, 500);

})();
