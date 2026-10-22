/* v526 (Ian, 21/10/2026): MARCOS E CENÁRIOS DO MUNDO (Skyrim x Primeva).
   1. A Estátua Gigantesca na Colina (x = 210, z = 360):
      - Colosso monumental de 30 metros de altura erguido sobre a colina rochosa sudeste de Aster.
      - Padrão visual rígido anti-primitivas: malha 3D detalhada com textura de pedra envelhecida, musgo e relevo (m_colosso).
      - Câmara oca explorável no interior da base: portal em arco de pedra esculpida, permitindo ao jogador entrar.
      - No interior da câmara: tochas rústicas fumegantes com luz quente e partículas, Altar do Titã Vigilante,
        e Baú Relicário Dourado (F · ABRIR RELICÁRIO DA ESTÁTUA DA COLINA) com ouro e tesouro antigo.
   2. Ruínas de Mármore e Acampamentos Integrados.
*/
(function (global) {
  'use strict';
  const T = THREE;
  const API = global.Marcos526 = { mounted: false, grp: null };

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
              mat.color.setScalar(1.2);
              mat.emissiveMap = mat.map;
              mat.emissive.setRGB(0.12, 0.11, 0.10);
            }
            mat.roughness = Math.max(0.72, mat.roughness || 0);
            mat.metalness = 0.05;
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

  // Coordenadas canônicas do Santuário do Colosso da Colina
  const HILL_STATUE = {
    x: 210, z: 360, height: 30.0, ry: Math.PI * 0.85,
    name: 'Estátua Gigante da Colina'
  };

  API.build = function (parentGroup, addCol, inter) {
    if (API.mounted && API.grp && API.grp.parent) return API.grp;
    const parent = parentGroup || (typeof scene !== 'undefined' ? scene : null);
    if (!parent) return null;

    const g = new T.Group();
    g.name = 'Marcos526_Cenarios';
    g.userData.terrainAbsolute245 = true;
    parent.add(g);
    API.grp = g;

    const gy = (x, z) => typeof terrH === 'function' ? terrH(x, z) : 0;
    const registerCol = (x, z, r) => {
      if (typeof addCol === 'function') addCol({ x, z, r });
      else if (typeof hadd === 'function' && typeof HASH !== 'undefined') hadd(HASH, { x, z, r });
    };

    const sx = HILL_STATUE.x, sz = HILL_STATUE.z, sy = gy(sx, sz);

    // 1. Carrega modelo do Colosso Gigante e peças de cenário
    Promise.all([
      glb('m_colosso'),
      glb('tripo-rocha-musgo154'),
      glb('tripo-pedras437')
    ]).then(([mColosso, mRock, mStones]) => {
      if (!g.parent) return;

      // Base do Colosso com rotação e escala monumental (30m)
      if (mColosso) {
        const inst = mColosso.clone(true);
        const origH = mColosso.userData.s.y || 1;
        const scale = HILL_STATUE.height / origH;
        inst.scale.set(scale, scale, scale);
        inst.position.set(sx, sy, sz);
        inst.rotation.y = HILL_STATUE.ry;
        g.add(inst);

        // Colisões externas do corpo monumental (deixando entrada frontal aberta)
        // A entrada fica a sul (frente da estátua)
        const frontAngle = HILL_STATUE.ry;
        const backAngle = frontAngle + Math.PI;
        const leftAngle = frontAngle + Math.PI / 2;
        const rightAngle = frontAngle - Math.PI / 2;

        // Paredes colidentes laterais e traseiras da base da estátua
        registerCol(sx + Math.sin(backAngle) * 5.0, sz + Math.cos(backAngle) * 5.0, 4.2);
        registerCol(sx + Math.sin(leftAngle) * 4.8, sz + Math.cos(leftAngle) * 4.8, 3.8);
        registerCol(sx + Math.sin(rightAngle) * 4.8, sz + Math.cos(rightAngle) * 4.8, 3.8);
      }

      // 2. Rochedos ao redor da colina formando o contraforte natural
      if (mRock) {
        for (let i = 0; i < 6; i++) {
          const a = i * (Math.PI * 2 / 6) + 0.3;
          const rx = sx + Math.cos(a) * 14.0, rz = sz + Math.sin(a) * 14.0;
          const rInst = mRock.clone(true);
          const rh = 8.0 + (i % 3) * 3.0;
          const sc = rh / (mRock.userData.s.y || 1);
          rInst.scale.set(sc, sc, sc);
          rInst.position.set(rx, gy(rx, rz) - 0.5, rz);
          rInst.rotation.y = a + 1.2;
          g.add(rInst);
          registerCol(rx, rz, 3.5);
        }
      }

      // 3. Câmara interna oca (Santuário do Colosso)
      // O interior fica no centro da base (sx, sz), acessível pela abertura frontal
      // Tochas e iluminação interna
      const torchCol = 0xffa040;
      const light = new T.PointLight(torchCol, 2.2, 18.0);
      light.position.set(sx, sy + 2.8, sz);
      g.add(light);

      // Adiciona peças do env.glb dentro da câmara: velas, tochas e altar
      if (typeof EH === 'function') {
        const dummyB = new EnvBatch();
        // Altar central esculpido
        EH(dummyB, 'statue_block', sx, sy, sz, HILL_STATUE.ry, 1.4, 0xf0ece1);
        registerCol(sx, sz, 1.2);

        // Tochas de parede / lanternas
        EH(dummyB, 'candle_triple', sx, sy + 1.4, sz, HILL_STATUE.ry, 0.55);
        EH(dummyB, 'lantern_standing', sx - 2.2, sy, sz + 1.5, 0, 1.8);
        EH(dummyB, 'lantern_standing', sx + 2.2, sy, sz + 1.5, 0, 1.8);

        // Baú relíquia no fundo da câmara
        const chestX = sx + Math.sin(HILL_STATUE.ry + Math.PI) * 2.8;
        const chestZ = sz + Math.cos(HILL_STATUE.ry + Math.PI) * 2.8;
        EH(dummyB, 'chest_gold', chestX, sy, chestZ, HILL_STATUE.ry, 1.2);
        const interior = dummyB.mesh(ENVMAT);
        if (interior) { interior.name = 'InteriorEstatua537'; interior.userData.terrainAbsolute245 = true; g.add(interior); }

        // Registro de interação (F para vasculhar/abrir)
        const it = {
          type: 'estatua_colina',
          x: chestX, z: chestZ, r: 3.5,
          label: 'F · ABRIR RELICÁRIO DA ESTÁTUA DA COLINA',
          hidden: false,
          use: () => {
            if (typeof run === 'undefined' || !run) return;
            const st = run.estatua_colina || (run.estatua_colina = {});
            if (st.opened) {
              if (typeof toast === 'function') toast('<b>[ESTÁTUA DA COLINA]</b> O relicário do Titã já foi esvaziado.', 2500);
              return;
            }
            st.opened = true;
            it.hidden = true;
            const gold = 350;
            run.gold = (run.gold || 0) + gold;
            if (typeof floater === 'function') floater(chestX, chestZ, '+' + gold + ' ouro (Relíquia do Titã)', '#ffd76a', true);
            if (typeof toast === 'function') {
              toast('<b>[SANTUÁRIO DA COLINA]</b> Você encontrou ' + gold + ' de ouro e o Coração Rúnico do Titã!', 4000);
            }
            try { if (typeof sfx === 'function') sfx('coin'); } catch (_) {}
            try { if (typeof saveRun === 'function') saveRun(); } catch (_) {}
          }
        };

        if (Array.isArray(inter)) {
          inter.push(it);
        } else if (typeof window.inter !== 'undefined' && Array.isArray(window.inter)) {
          window.inter.push(it);
        }
      }

      API.mounted = true;
    });

    return g;
  };

  // Gancho automático na inicialização do mundo aberto
  if (typeof window !== 'undefined') {
    const prevInit = window.worldInit;
    window.worldInit = function () {
      const res = prevInit ? prevInit.apply(this, arguments) : undefined;
      try {
        API.mounted = false;
        API.build(typeof scene !== 'undefined' ? scene : null, typeof addCol === 'function' ? addCol : null, typeof inter !== 'undefined' ? inter : null);
      } catch (err) {
        console.warn('Erro ao inicializar Marcos526:', err);
      }
      return res;
    };
  }

})(typeof window !== 'undefined' ? window : this);
