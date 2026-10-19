/* v456: Acampamento Portátil de Expedição (Fogueira, Tenda/Abrigo, Varal de Secagem e Bancada Rústica).
   Casas fixas e terraplenagem desativadas — o jogador monta e recolhe (F) seu acampamento na natureza
   ou dentro das Fendas (Outros Mundos), deixando o bioma 100% limpo. */
(function () {
  'use strict';
  const T = THREE, TAU = Math.PI * 2;
  const H = (x, z) => (typeof L !== 'undefined' && L && L.mode === 'dungeon') ? 0 : (typeof terrH === 'function' ? terrH(x, z) : 0);
  const ready = () => typeof started !== 'undefined' && started && typeof player !== 'undefined' && player && typeof run !== 'undefined' && run && typeof L !== 'undefined' && L && (L.mode === 'world' || L.mode === 'dungeon') && window.Surv437;

  const STRUCTS = {
    fogueira: {
      n: 'Fogueira de Pedra e Lenha',
      glb: 'fogueira', h: 0.75, w: 1.4, r: 2.8,
      cost: { pedra: 4, lenha: 2 },
      packable: true,
      d: 'Consome lenha para aquecer, iluminar, cozinhar e tratar água. Afasta criaturas sensíveis à luz.'
    },
    abrigo: {
      n: 'Tenda / Abrigo Portátil de Couro e Galhos',
      glb: 'abrigo', h: 1.85, w: 2.6, r: 3.0,
      cost: { galho: 4, couro: 2, corda: 1 },
      packable: true,
      d: 'Durma para recuperar vida e aliviar o Cansaço. O tempo avança enquanto você descansa. Recolha a tenda ao partir.'
    },
    varal: {
      n: 'Varal de Secagem Portátil',
      glb: 'varal', h: 1.65, w: 2.0, r: 2.6,
      cost: { galho: 4, corda: 2 },
      packable: true,
      d: 'Transforma carne em Carne Seca e peixe em Peixe Defumado. Duram mais que os alimentos crus; calor, Miasma e conservação alteram a duração.'
    },
    bancada: {
      n: 'Bancada Rústica de Campo',
      glb: 'bancada', h: 1.15, w: 1.8, r: 2.8,
      cost: { galho: 4, pedra: 3, corda: 1 },
      packable: true,
      d: 'Fabrica flechas, cordas, tochas, Bolsas de Conservação (Alforje de Sal, Mochila Térmica, Invólucro de Resina, Caixa de Salmoura), Cantis e conserta o Carrinho de Carga.'
    },
    caldeirao: {
      n: 'Caldeirão e Bancada de Alquimia',
      glb: 'bancada', h: 1.15, w: 1.7, r: 2.8,
      cost: { pedra: 4, galho: 3, resina: 1 },
      packable: true,
      d: 'Destila plantas, flores, fungos e raízes em poções de cura, regeneração, vigor, vitalidade, resistência e frascos arremessáveis (veneno, ácido, fogo, fumaça e choque).'
    },
    forja: {
      n: 'Forja Rústica (Fornalha e Bigorna)',
      glb: 'bancada', h: 1.35, w: 1.9, r: 2.8,
      cost: { pedra: 6, galho: 4, lenha: 2 },
      packable: true,
      d: 'Forja armas próprias combinando minérios, cristais de Fenda, madeiras nobres e partes de monstros (presas, ossos, escamas) com efeitos únicos.'
    },
    carrinho: {
      n: 'Carrinho de Carga (com Caixa de Salmoura)',
      glb: 'carrinho', h: 1.25, w: 2.3, r: 3.0,
      cost: { tora: 2, galho: 4, corda: 2 },
      isCart: true,
      d: 'Carrega até 180 kg de lenha, toras e comida. Alimentos guardados nele estragam 75% mais devagar até a porta da Fenda.'
    },
    espinho: {
      n: 'Armadilha de Espinhos Portátil',
      glb: 'armadilha-espinhos', h: 0.55, w: 1.5, r: 2.2,
      cost: { galho: 4, lasca: 2, corda: 1 },
      trap: 'spike', packable: true,
      d: 'Causa sangramento pesado e lentidão em feras e inimigos atraídos (ex: com Isca de Carniça).'
    },
    laco: {
      n: 'Armadilha de Laço',
      glb: 'armadilha-laco', h: 0.9, w: 1.1, r: 2.0,
      cost: { galho: 2, corda: 2 },
      trap: 'snare', packable: true,
      d: 'Captura pequenos animais ou imobiliza perseguidores por 4 segundos.'
    }
  };

  let FLAME_MAT = null, FLAME_GEO = null;
  const flameGeo = () => FLAME_GEO || (FLAME_GEO = new T.PlaneGeometry(0.95, 1.3));
  function flameMat() {
    if (FLAME_MAT) return FLAME_MAT;
    FLAME_MAT = new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, uniforms: { uT: { value: 0 } },
      vertexShader: 'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform float uT;varying vec2 vU;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}' +
        'void main(){vec2 q=vec2(vU.x*4.,vU.y*3.-uT*2.6);float t=n(q)*.6+n(q*2.1+3.)*.4;float y=vU.y;float w=(1.-y)*.48+.04;float d=abs(vU.x-.5+(t-.5)*.18*y);float m=smoothstep(w,w*.35,d)*smoothstep(1.,.55,y+t*.25)*smoothstep(0.,.08,y);' +
        'vec3 c=mix(vec3(1.,.95,.6),vec3(1.,.45,.08),smoothstep(.1,.55,y+d));c=mix(c,vec3(.7,.12,.02),smoothstep(.5,.95,y));gl_FragColor=vec4(c*1.25,m);}' });
    FLAME_MAT.userData.shared = true;
    const tick = () => { FLAME_MAT.uniforms.uT.value = performance.now() / 1000; setTimeout(tick, 33); }; tick();
    return FLAME_MAT;
  }
  const spawned = new Map();
  let lastMode = '';
  let activeModalStruct = null;

  function st() {
    const s = Surv437.S(); if (!s) return [];
    // Remove construções permanentes antigas (cabana, paliçada, portão, baú, coletor, suporte) para proteger 100% a estética natural
    s.built = (s.built || []).filter(b => b && STRUCTS[b.kind]);
    return s.built;
  }

  function canBuildAt(x, z, kind) {
    if (!L) return false;
    if (kind === 'carrinho' && L.mode !== 'world') {
      toast('O <b>Carrinho de Carga</b> só pode ser montado na superfície (fora da Fenda).');
      return false;
    }
    if (L.mode === 'world') {
      try {
        const c = nearestCity(x, z);
        if (c && c.d < (typeof CITYR !== 'undefined' ? CITYR : 42) + 18) {
          toast('Os arredores de <b>' + c.c.name + '</b> são protegidos. Monte seu acampamento mais adiante na natureza.');
          return false;
        }
        if (typeof inWater244 === 'function' && inWater244(x, z)) {
          toast('Não é possível montar acampamento dentro da água.');
          return false;
        }
      } catch (_) {}
    }
    return true;
  }

  function spawnMesh(b) {
    if (spawned.has(b.uid)) return;
    const def = STRUCTS[b.kind]; if (!def) return;
    const inDun = typeof L !== 'undefined' && L && L.mode === 'dungeon';
    if (!!b.inDun !== inDun) return;
    if (inDun && b.gateId != null && L.gate?.id !== b.gateId) return;

    const g = new T.Group();
    g.position.set(b.x, H(b.x, b.z), b.z);
    g.rotation.y = b.rot || 0;
    if (!inDun) g.userData.terrainAbsolute245 = true;
    scene.add(g);

    Surv437.glb(def.glb).then(tpl => {
      if (!tpl || !g.parent) return;
      const m = Surv437.fit(tpl, def.h, def.w);
      g.add(m);
    });

    let fireFx = null;
    if (b.kind === 'fogueira') {
      fireFx = new T.Group();
      const light = new T.PointLight(0xff8a30, 1.9, 16, 1.6);
      light.position.set(0, 1.1, 0);
      fireFx.add(light);
      /* v460: chama com shader animado (dois planos cruzados) no lugar do cone laranja chapado */
      try { for (let k = 0; k < 2; k++) { const flame = new T.Mesh(flameGeo(), flameMat()); flame.position.set(0, 0.62, 0); flame.rotation.y = k * Math.PI / 2; flame.renderOrder = 7; fireFx.add(flame); } }
      catch (_) { const flame = new T.Mesh(new T.ConeGeometry(0.28, 0.68, 7), new T.MeshBasicMaterial({ color: 0xffa033, transparent: true, opacity: 0.85 })); flame.position.set(0, 0.45, 0); fireFx.add(flame); }
      fireFx.visible = (b.fuel || 0) > 0;
      g.add(fireFx);
    }

    const getLabel = () => {
      if (b.justRested456 && (b.kind === 'abrigo' || b.kind === 'varal' || b.kind === 'bancada')) {
        return 'F · RECOLHER ' + def.n.toUpperCase() + ' (DEIXAR BIOMA LIMPO)';
      }
      return 'F · ' + def.n.toUpperCase() + (def.packable ? ' (USAR / RECOLHER)' : '');
    };

    const it = {
      type: 'build437', x: b.x, z: b.z, r: def.r,
      label: getLabel(),
      use: () => {
        if (b.justRested456 && def.packable) {
          b.justRested456 = false;
          packStruct456(b);
          return;
        }
        openStructModal(b);
      }
    };
    if (L?.inter) L.inter.push(it);
    spawned.set(b.uid, { b, g, it, fireFx, getLabel });
  }

  function removeMesh(uid) {
    const e = spawned.get(uid); if (!e) return;
    if (e.g && e.g.parent) scene.remove(e.g);
    if (e.it && L?.inter) { const i = L.inter.indexOf(e.it); if (i >= 0) L.inter.splice(i, 1); }
    spawned.delete(uid);
  }

  /* ---------- Recolher Peça ou Acampamento Inteiro (F) ---------- */
  function packStruct456(b, silent = false) {
    if (!b) return false;
    const def = STRUCTS[b.kind];
    if (!def) return false;
    const arr = st();
    const idx = arr.indexOf(b);
    if (idx < 0) return false;

    // Devolve 100% dos materiais da estrutura (e carnes/peixes no varal) para a mochila ou carrinho
    const c = window.Cart437?.st?.();
    const nearCart = c && c.built && L.mode === 'world' && Math.hypot(c.x - player.x, c.z - player.z) < 8;
    const refund = (id, n) => {
      if (n <= 0) return;
      if (nearCart && Surv437.totalW() + (Surv437.ITEMS[id]?.w || 0.5) * n > Surv437.maxW()) {
        Surv437.add(id, n, true);
        Cart437.put(id, n);
      } else {
        Surv437.add(id, n, true);
      }
    };

    for (const [k, n] of Object.entries(def.cost)) {
      if (b.kind === 'fogueira' && k === 'lenha') {
        const remFuel = Math.max(0, Math.floor(b.fuel || 0));
        if (remFuel > 0) refund('lenha', remFuel);
      } else {
        refund(k, n);
      }
    }
    if (b.kind === 'varal') {
      if ((b.ready || 0) > 0) refund(b.readyKind || 'defumada', b.ready);
      if ((b.drying || 0) > 0) refund(b.rawKind || 'carne', b.drying);
    }

    removeMesh(b.uid);
    arr.splice(idx, 1);
    if (activeModalStruct === b) {
      activeModalStruct = null;
      if (typeof modalOpen !== 'undefined' && modalOpen) closeModal();
    }
    try { sfx('step'); if (typeof floater === 'function') floater(b.x, b.z, 'RECOLHIDO!', '#a8e6a1', true); } catch (_) {}
    if (!silent) {
      toast('<b>[ACAMPAMENTO PORTÁTIL]</b> <b>' + def.n + '</b> recolhido(a) para a ' + (nearCart ? 'mochila/carrinho' : 'mochila') + '.');
    }
    Surv437.save();
    return true;
  }

  function packAllCamp456() {
    const arr = st().slice();
    const inDun = typeof L !== 'undefined' && L && L.mode === 'dungeon';
    let countPacked = 0;
    for (const b of arr) {
      if (!!b.inDun === inDun && Math.hypot(b.x - player.x, b.z - player.z) <= 14) {
        if (packStruct456(b, true)) countPacked++;
      }
    }
    if (countPacked > 0) {
      toast('<b>[ACAMPAMENTO RECOLHIDO]</b> ' + countPacked + ' estrutura(s) guardada(s) de volta na mochila/carrinho.');
      if (typeof modalOpen !== 'undefined' && modalOpen) closeModal();
      return true;
    }
    toast('Nenhuma estrutura de acampamento próxima para recolher.');
    return false;
  }

  function build(kind) {
    const def = STRUCTS[kind]; if (!def) return false;
    if (!Surv437.has(def.cost)) {
      toast('Materiais insuficientes para montar <b>' + def.n + '</b>.');
      return false;
    }
    const dist = 2.4;
    const x = player.x + Math.sin(player.face || 0) * dist;
    const z = player.z + Math.cos(player.face || 0) * dist;
    if (!canBuildAt(x, z, kind)) return false;

    for (const [k, n] of Object.entries(def.cost)) Surv437.take(k, n);
    try { if (window.Anim303) Anim303.play('martelo', 1.15); sfx('coin'); } catch (_) {}

    if (def.isCart) {
      const c = window.Cart437?.st();
      if (c) {
        c.built = true; c.x = x; c.z = z; c.rot = player.face || 0; c.pulling = false; c.hp = 100; c.brineBox = true;
        window.Cart437.ensure();
      }
      toast('<b>[CARRINHO DE CARGA]</b> Construído com Caixa de Salmoura! Use <b>F</b> perto dele para puxar ou guardar suprimentos.');
      Surv437.save();
      return true;
    }

    const inDun = typeof L !== 'undefined' && L && L.mode === 'dungeon';
    const b = {
      uid: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      kind, x, z, rot: (player.face || 0) + Math.PI,
      inDun, gateId: inDun ? (L.gate?.id ?? -1) : null,
      fuel: kind === 'fogueira' ? 3 : 0,
      drying: 0, ready: 0, dryT: 0, rawKind: 'carne', readyKind: 'defumada'
    };
    st().push(b);
    spawnMesh(b);
    Surv437.save();
    toast('<b>[ACAMPAMENTO PORTÁTIL]</b> <b>' + def.n + '</b> montado(a)! Use <b>F</b> para interagir ou recolher ao partir.');
    return true;
  }

  function openStructModal(b) {
    const def = STRUCTS[b.kind]; if (!def) return;
    activeModalStruct = b;
    view = () => openStructModal(b);
    let h = '<div class="sysline">' + def.d + '<br><small style="color:#a8e6a1">Use <b>Recolher</b> para desmontar e recuperar os materiais antes de partir.</small></div>';

    if (b.kind === 'fogueira') {
      const lit = (b.fuel || 0) > 0;
      h += row('🔥 Estado da Fogueira', lit ? '<b style="color:#ffb347">Acesa</b> · Combustível: ' + b.fuel.toFixed(1) + ' lenhas (aquece, ilumina e afasta predadores fotofóbicos)' : '<span style="opacity:.7">Apagada (adicione lenha ou galhos)</span>',
        '<button class="btn hot" id="b437fuel">+1 Lenha (' + Surv437.count('lenha') + ')</button> <button class="btn" id="b437branch">+2 Galhos (' + Surv437.count('galho') + ')</button>');
      if (lit) {
        const ctn = Surv437.S().canteen;
        h += row('💧 Água, Destilação e Chás Térmicos',
          ctn.frozen ? 'Odre Congelado — aqueça ao fogo!' : ctn.sips > 0 ? 'Cantil (' + ctn.sips + '/' + ctn.max + ' goles · ' + ctn.kind + ')' : 'Cantil vazio',
          '<button class="btn hot" id="b437boil">' + (ctn.frozen ? 'Descongelar Odre' : ctn.kind === 'salgada' ? 'Destilar Água do Mar' : 'Ferver Água') + '</button> ' +
          '<button class="btn hot" id="b437tea">Ferver Chá Térmico (' + Surv437.count('erva') + ' erva)</button> ' +
          '<button class="btn" id="b437anti">Ferver Antídoto (' + Surv437.count('erva') + ' erva)</button>');
        h += row('🍖 Assar Carne na Brasa', 'Carne Crua (' + Surv437.count('carne') + ') → Carne Assada (dura 3–4 dias + forte bônus de Vida/Vigor)',
          '<button class="btn hot" id="b437cook">Assar Carne</button>');
        h += row('🐟 Assar Peixe na Brasa', 'Peixe Cru (' + Surv437.count('peixe_cru') + ') → Peixe Assado (dura 3–4 dias + forte bônus de Vida/Vigor)',
          '<button class="btn hot" id="b437cookFish">Assar Peixe</button>');
        if (window.Alchemy470) {
          const fishes = Alchemy470.getAvailableFish();
          if (fishes.length) {
            h += '<div class="sec">FRITAR PEIXE NA BRASA (PESCA & SOBREVIVÊNCIA)</div>';
            for (const f of fishes) {
              h += row('🐟 ' + f.name + ' (' + f.count + ')', 'Grelhado ao fogo com chiado e fumaça (+55 Fome, +Vida e bônus de calor por 8m)',
                '<button class="btn hot" data-fryeat="' + f.key + '">Fritar & Comer</button> <button class="btn" data-frysave="' + f.key + '">Assar p/ Mochila</button>');
            }
          }
        }
        h += row('🍱 Preparar Ração de Expedição', 'Carne Seca (' + Surv437.count('defumada') + ') + 2 Frutas (' + Surv437.count('fruta') + ') + 1 Resina/Sal (' + Surv437.count('resina') + ') → 2× Ração de Expedição (dura +20 dias!)',
          '<button class="btn hot" id="b437ration">Fazer Ração ×2</button>');
      }
    } else if (b.kind === 'abrigo') {
      const inDun = typeof L !== 'undefined' && L && L.mode === 'dungeon';
      h += row('⛺ Dormir e Descansar na Tenda Portátil',
        'Recupera 100% da Vida e Mana, avança ' + (inDun ? '1 dia de expedição no Outro Mundo' : '6 horas até o amanhecer') + ' e remove toda a penalidade de Cansaço (v287).',
        '<button class="btn hot" id="b437sleep">Dormir & Curar Ferimentos</button>');
    } else if (b.kind === 'varal') {
      const nearLitFire = Surv437.nearFire(7);
      h += row('🥩 Curar Carne Seca (10–14 dias)',
        'Penduradas: <b>' + (b.drying || 0) + '</b> (' + (b.rawKind === 'peixe_cru' ? 'Peixe' : 'Carne') + ') · Prontas: <b style="color:#7ef5a5">' + (b.ready || 0) + '</b>' + (nearLitFire ? ' · <span style="color:#ffb347">🔥 Fumaça da fogueira acelerando a cura!</span>' : ''),
        '<button class="btn hot" id="b437hangMeat">Pendurar Carne (' + Surv437.count('carne') + ')</button> ' +
        '<button class="btn hot" id="b437hangFish">Pendurar Peixe (' + Surv437.count('peixe_cru') + ')</button> ' +
        ((b.ready || 0) > 0 ? '<button class="btn hot" id="b437takeDry">Recolher Curados (' + b.ready + ')</button>' : ''));
    } else if (b.kind === 'bancada') {
      h += row('🎒 Fabricar Bolsas de Conservação, Cantis e Utensílios',
        'Abre a aba de Artesanato com a <b>Bancada Rústica de Campo</b> ativa (Alforje de Sal, Mochila Térmica, Invólucro de Resina, Cantil de Ferro/Térmico, Flechas).',
        '<button class="btn hot" id="b437bench">Abrir Bancada de Artesanato</button>');
      if (window.Cart437 && Cart437.st()?.built) {
        const c = Cart437.st();
        h += row('🛒 Consertar / Revisar Carrinho de Carga',
          'Estrutura atual do carrinho: <b>' + Math.round(c.hp || 100) + '%</b> · Caixa de Salmoura: <b style="color:#7ef5a5">Ativa (-75% apodrecimento)</b>.',
          '<button class="btn" id="b437repCart">Consertar Carrinho (2 Galhos + 1 Corda)</button>');
      }
    } else if (b.kind === 'caldeirao') {
      h += '<div class="sec">CALDEIRÃO DE ALQUIMIA (POÇÕES & FRASCOS ARREMESSÁVEIS)</div>';
      h += '<div class="sysline">Destile plantas, flores, raízes e fungos colhidos nos biomas e Fendas para fabricar poções e frascos arremessáveis.</div>';
      if (window.Alchemy470) {
        for (const r of Alchemy470.ALCHEMY_RECIPES) {
          const can = Surv437.has(r.cost);
          const costTxt = Object.entries(r.cost).map(([ck, cn]) => {
            const have = Surv437.count(ck);
            return '<span style="color:' + (have >= cn ? '#a8e6a1' : '#ff8fa3') + '">' + (Surv437.ITEMS[ck]?.n || ck) + ' ' + have + '/' + cn + '</span>';
          }).join(' · ');
          h += row('🧪 ' + (Surv437.ITEMS[r.id]?.n || r.id), r.desc + '<br><small>' + costTxt + '</small>',
            '<button class="btn ' + (can ? 'hot' : '') + '" data-brew="' + r.id + '" ' + (can ? '' : 'disabled') + '>Preparar</button>');
        }
      }
    } else if (b.kind === 'forja') {
      h += '<div class="sec">FORJA RÚSTICA DE ACAMPAMENTO (FORNALHA & BIGORNA)</div>';
      h += '<div class="sysline">Forje armas combinando minérios, madeiras e catalisadores monstruosos (presas, ossos, escamas) com afixos de combate próprios.</div>';
      if (window.Alchemy470) {
        for (const w of Alchemy470.WEAPON_TYPES) {
          h += row('🔨 ' + w.n, w.desc + ' · Base: ' + w.baseDmg + ' Dano (Exige ' + w.reqWood + ' Galhos)',
            '<button class="btn hot" data-forge="' + w.id + '">Forjar Arma</button>');
        }
      }
    }

    h += '<div class="sec">LEVANTAR ACAMPAMENTO (DEIXAR BIOMA LIMPO)</div>';
    h += row('Recolher ' + def.n, 'Guarda esta estrutura de volta na mochila/carrinho e devolve os materiais.', '<button class="btn hot" id="b437remove">Recolher [F]</button>');
    h += row('Recolher Acampamento Completo', 'Recolhe de uma vez a Tenda, o Varal, a Bancada e a Fogueira próximos.', '<button class="btn" id="b437packAll">Recolher Tudo</button>');

    openModal(def.n.toUpperCase(), h);

    const bf = document.getElementById('b437fuel');
    if (bf) bf.onclick = () => {
      if (Surv437.take('lenha', 1)) { b.fuel = (b.fuel || 0) + 3; toast('+3 combustível na fogueira.'); openStructModal(b); }
      else toast('Você não tem Feixes de Lenha.');
    };
    const bb = document.getElementById('b437branch');
    if (bb) bb.onclick = () => {
      if (Surv437.take('galho', 2)) { b.fuel = (b.fuel || 0) + 1.5; toast('+1.5 combustível na fogueira.'); openStructModal(b); }
      else toast('Você precisa de 2 Galhos Secos.');
    };
    const bboil = document.getElementById('b437boil');
    if (bboil) bboil.onclick = () => { Surv437.boilCanteen(false, false); openStructModal(b); };
    const btea = document.getElementById('b437tea');
    if (btea) btea.onclick = () => { Surv437.boilCanteen(true, false); openStructModal(b); };
    const banti = document.getElementById('b437anti');
    if (banti) banti.onclick = () => { Surv437.boilCanteen(true, true); openStructModal(b); };
    const bcook = document.getElementById('b437cook');
    if (bcook) bcook.onclick = () => {
      if (Surv437.take('carne', 1)) { Surv437.add('assada', 1, false, 0); openStructModal(b); }
      else toast('Sem Carne Crua na mochila.');
    };
    const bcookF = document.getElementById('b437cookFish');
    if (bcookF) bcookF.onclick = () => {
      if (Surv437.take('peixe_cru', 1)) { Surv437.add('peixe_assado', 1, false, 0); openStructModal(b); }
      else toast('Sem Peixe Cru na mochila.');
    };
    const bration = document.getElementById('b437ration');
    if (bration) bration.onclick = () => {
      const rIdx = Surv437.RECIPES.findIndex(r => r.id === 'racao_expedicao' && r.st === 'fogueira');
      if (rIdx >= 0) Surv437.craft(rIdx);
      openStructModal(b);
    };
    const bsleep = document.getElementById('b437sleep');
    if (bsleep) bsleep.onclick = () => {
      player.hp = player.maxhp; player.mp = player.maxmp; player.bleedT = 0;
      const s = Surv437.S();
      s.temp = 55; s.sickT = 0; s.intoxT = 0;
      if (run) {
        run.awake287 = 0;
        run.rested = { t: 900 * (1 + (window.Attr462 ? Attr462.surv().sleep : 0)) }; // v462 Vitalidade: descanso mais longo
        if (typeof refreshStats === 'function') refreshStats();
      }
      if (typeof dayT !== 'undefined') dayT += 300;
      if (typeof L !== 'undefined' && L && L.mode === 'dungeon') {
        L.riftDays456 = (L.riftDays456 || 1) + 1;
      }
      b.justRested456 = true;
      const sp = spawned.get(b.uid);
      if (sp && sp.it) sp.it.label = sp.getLabel();
      closeModal();
      activeModalStruct = null;
      try { sfx('level'); bigText('DESCANSADO', 1600); } catch (_) {}
      toast('<b>[TENDA PORTÁTIL]</b> Você dormiu aquecido: Vida/Mana em 100% e Cansaço zerado! Aperte <b>F</b> na tenda para recolher o acampamento.');
      Surv437.save();
    };
    const bhm = document.getElementById('b437hangMeat');
    if (bhm) bhm.onclick = () => {
      /* v460: um tipo por vez no varal (antes, carne e peixe juntos saíam todos como o último pendurado) */
      if (((b.drying || 0) + (b.ready || 0)) > 0 && b.rawKind && b.rawKind !== 'carne') { toast('O varal está curando <b>Peixe</b>. Espere terminar e recolha os curados antes de pendurar Carne.'); return; }
      if (Surv437.take('carne', 1)) {
        b.rawKind = 'carne'; b.readyKind = 'defumada';
        b.drying = (b.drying || 0) + 1;
        openStructModal(b);
      } else toast('Você não tem Carne Crua.');
    };
    const bhf = document.getElementById('b437hangFish');
    if (bhf) bhf.onclick = () => {
      /* v460: um tipo por vez no varal (antes, carne e peixe juntos saíam todos como o último pendurado) */
      if (((b.drying || 0) + (b.ready || 0)) > 0 && b.rawKind && b.rawKind !== 'peixe_cru') { toast('O varal está curando <b>Carne</b>. Espere terminar e recolha os curados antes de pendurar Peixe.'); return; }
      if (Surv437.take('peixe_cru', 1)) {
        b.rawKind = 'peixe_cru'; b.readyKind = 'peixe_defumado';
        b.drying = (b.drying || 0) + 1;
        openStructModal(b);
      } else toast('Você não tem Peixe Cru.');
    };
    const btd = document.getElementById('b437takeDry');
    if (btd) btd.onclick = () => {
      if ((b.ready || 0) > 0) {
        const outKind = b.readyKind || 'defumada';
        Surv437.add(outKind, b.ready, false, 0);
        b.ready = 0;
        b.justRested456 = true;
        const sp = spawned.get(b.uid);
        if (sp && sp.it) sp.it.label = sp.getLabel();
        openStructModal(b);
      }
    };
    const bbench = document.getElementById('b437bench');
    if (bbench) bbench.onclick = () => { activeModalStruct = null; Surv437.open('craft'); };
    const brep = document.getElementById('b437repCart');
    if (brep) brep.onclick = () => { window.Cart437?.repair456?.(); openStructModal(b); };
    const brem = document.getElementById('b437remove');
    if (brem) brem.onclick = () => { packStruct456(b); };
    const bpackAll = document.getElementById('b437packAll');
    if (bpackAll) bpackAll.onclick = () => { packAllCamp456(); };

    document.querySelectorAll('#modal [data-fryeat]').forEach(btn => btn.onclick = () => {
      if (window.Alchemy470) Alchemy470.fryFish(btn.dataset.fryeat, true);
      openStructModal(b);
    });
    document.querySelectorAll('#modal [data-frysave]').forEach(btn => btn.onclick = () => {
      if (window.Alchemy470) Alchemy470.fryFish(btn.dataset.frysave, false);
      openStructModal(b);
    });
    document.querySelectorAll('#modal [data-brew]').forEach(btn => btn.onclick = () => {
      const rec = window.Alchemy470?.ALCHEMY_RECIPES.find(r => r.id === btn.dataset.brew);
      if (rec && Surv437.has(rec.cost)) {
        for (const [ck, cn] of Object.entries(rec.cost)) Surv437.take(ck, cn);
        Surv437.add(rec.id, rec.n, true);
        try { if (typeof sfx === 'function') sfx('magic'); if (typeof floater === 'function') floater(player.x, player.z, '+' + rec.n + ' ' + (Surv437.ITEMS[rec.id]?.n || rec.id), '#7ef5a5', true); } catch (_) {}
        toast('<b>[CALDEIRÃO]</b> Você preparou <b>' + (Surv437.ITEMS[rec.id]?.n || rec.id) + '</b>!');
      } else {
        toast('Materiais insuficientes para preparar esta receita.');
      }
      openStructModal(b);
    });
    document.querySelectorAll('#modal [data-forge]').forEach(btn => btn.onclick = () => {
      const wId = btn.dataset.forge;
      const minOrder = ['cristal_frio', 'lasca', 'resina', 'pedra'];
      const beastOrder = ['raiz_sangue', 'cogu_venenoso', 'couro', 'osso'];
      const selMin = minOrder.find(k => Surv437.count(k) >= 2);
      const selBeast = beastOrder.find(k => Surv437.count(k) >= 1);
      if (!selMin || !selBeast) {
        toast('Você precisa de 2x minérios (Pedra/Lasca/Cristal) e 1x catalisador (Osso/Couro/Esporo/Raiz) para forjar.');
        return;
      }
      if (window.Alchemy470) Alchemy470.forgeWeapon(wId, selMin, selBeast);
      openStructModal(b);
    });
  }

  function open() {
    if (!ready()) return;
    activeModalStruct = null;
    view = () => open();
    const inDun = typeof L !== 'undefined' && L && L.mode === 'dungeon';
    const nearbyCamp = st().filter(b => !!b.inDun === inDun && Math.hypot(b.x - player.x, b.z - player.z) <= 14);

    let h = '<div class="sysline">⛺ <b>Acampamento Portátil de Expedição</b> (' + (inDun ? 'Dentro da Fenda · Outro Mundo' : 'Superfície de Primeva') + ').<br>' +
      'Monte sua Fogueira, Tenda, Varal e Bancada onde precisar e <b>recolha tudo com [F]</b> ao levantar acampamento, deixando o bioma 100% limpo!</div>';

    if (nearbyCamp.length > 0) {
      h += '<div style="margin-bottom:10px"><button class="btn hot" id="b437packCampTop">🎒 Recolher Todo o Acampamento Próximo (' + nearbyCamp.length + ' estrutura' + (nearbyCamp.length > 1 ? 's' : '') + ')</button></div>';
    }

    for (const [k, def] of Object.entries(STRUCTS)) {
      const costTxt = Object.entries(def.cost).map(([ck, cn]) => {
        const have = Surv437.count(ck);
        return '<span style="color:' + (have >= cn ? '#a8e6a1' : '#ff8fa3') + '">' + (Surv437.ITEMS[ck]?.n || ck) + ' ' + have + '/' + cn + '</span>';
      }).join(' · ');
      const can = Surv437.has(def.cost) && !(def.isCart && inDun);
      h += row('<b>' + def.n + '</b>', def.d + '<br>' + costTxt,
        '<button class="btn ' + (can ? 'hot' : '') + '" data-build="' + k + '" ' + (can ? '' : 'disabled') + '>Montar</button>');
    }
    openModal('ACAMPAMENTO PORTÁTIL & ARMADILHAS [B]', h);
    const bpTop = document.getElementById('b437packCampTop');
    if (bpTop) bpTop.onclick = () => { packAllCamp456(); };
    document.querySelectorAll('#modal [data-build]').forEach(b => b.onclick = () => {
      const k = b.dataset.build;
      if (build(k)) closeModal();
    });
  }

  addEventListener('keydown', e => {
    if (e.repeat || !ready()) return;
    const t = e.target; if (t && ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return;
    if (e.code === 'KeyB' && !(typeof modalOpen !== 'undefined' && modalOpen)) {
      e.preventDefault();
      open();
    } else if (e.code === 'KeyF' && typeof modalOpen !== 'undefined' && modalOpen && activeModalStruct && STRUCTS[activeModalStruct.kind]?.packable) {
      // Apertar F com a janela da Tenda/Varal/Bancada aberta recolhe imediatamente a estrutura para a mochila!
      e.preventDefault();
      packStruct456(activeModalStruct);
    }
  });

  function tick(dt) {
    if (!ready() || paused) return;
    if (typeof modalOpen !== 'undefined' && !modalOpen) activeModalStruct = null;
    const curMode = L.mode + ':' + (L.gate?.id ?? '');
    if (curMode !== lastMode) {
      for (const uid of [...spawned.keys()]) removeMesh(uid);
      lastMode = curMode;
    }
    const list = st();
    const inDun = L.mode === 'dungeon';
    const nearFire = Surv437.nearFire(8);

    for (let idx = list.length - 1; idx >= 0; idx--) {
      const b = list[idx];
      if (!!b.inDun !== inDun) continue;
      if (inDun && b.gateId != null && L.gate?.id !== b.gateId) continue;
      if (!spawned.has(b.uid)) spawnMesh(b);
      const sp = spawned.get(b.uid);

      if (b.kind === 'fogueira' && (b.fuel || 0) > 0) {
        b.fuel = Math.max(0, b.fuel - dt / 150 * (1 - (window.Attr462 ? Attr462.surv().fuel : 0))); // v462 Espírito: lenha rende mais
        if (sp?.fireFx) sp.fireFx.visible = b.fuel > 0;
      }
      if (b.kind === 'varal' && (b.drying || 0) > 0) {
        // Cura mais rápido perto da fumaça da fogueira acesa
        b.dryT = (b.dryT || 0) + dt * (nearFire ? 1.8 : 1.0);
        if (b.dryT >= 32) {
          b.dryT = 0;
          b.drying--;
          b.ready = (b.ready || 0) + 1;
          const outName = b.readyKind === 'peixe_defumado' ? 'Peixe Defumado' : 'Carne Seca';
          toast('<b>[VARAL PORTÁTIL]</b> 1× <b>' + outName + '</b> ficou pronto(a) (dura 10–14 dias)!');
        }
      }

      const def = STRUCTS[b.kind];
      if (def?.trap && typeof enemies !== 'undefined') {
        for (const e of enemies) {
          if (!e || e.dead || Math.hypot(e.x - b.x, e.z - b.z) > 1.8) continue;
          if (def.trap === 'spike') {
            e.hp -= Math.max(18, e.maxhp * 0.25);
            e.bleedT = 6; e.bleedD = 6; e.slowT = 4;
            floater(e.x, e.z, 'ARMADILHA!', '#ff5d5d', true);
            if (e.hp <= 0 && typeof killEnemy === 'function') killEnemy(e);
          } else if (def.trap === 'snare') {
            e.stun = 4.5; e.slowT = 6;
            floater(e.x, e.z, 'PRESO NO LAÇO!', '#ffd54f', true);
          }
          try { sfx('hit'); } catch (_) {}
          removeMesh(b.uid);
          list.splice(idx, 1);
          break;
        }
      }
    }
  }

  let last = performance.now();
  setInterval(() => {
    const now = performance.now(), dt = Math.min(0.2, (now - last) / 1000);
    last = now;
    try { tick(dt); } catch (_) {}
  }, 150);

  window.Build437 = { STRUCTS, st, build, open, openStructModal, packStruct456, packAllCamp456, spawnMesh };
})();
