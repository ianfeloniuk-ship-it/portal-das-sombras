/* v456: Carrinho de Carga com Caixa de Salmoura (alimentos estragam 75% mais devagar),
   estacionamento na entrada das Fendas e marcação no minimapa. */
(function () {
  'use strict';
  const T = THREE;
  const H = (x, z) => typeof terrH === 'function' ? terrH(x, z) : 0;
  const ready = () => typeof started !== 'undefined' && started && typeof player !== 'undefined' && player && typeof run !== 'undefined' && run && typeof L !== 'undefined' && L && L.mode === 'world' && window.Surv437;

  function st() {
    if (!run) return null;
    if (!run.cart437) {
      run.cart437 = {
        built: false,
        x: 0, z: 0, rot: 0,
        pulling: false,
        hp: 100, maxHp: 100,
        brineBox: true,
        parkedGateId: null,
        inv: {},
        spoil: {}
      };
    }
    run.cart437.inv = run.cart437.inv || {};
    run.cart437.spoil = run.cart437.spoil || {};
    if (typeof run.cart437.hp !== 'number') run.cart437.hp = 100;
    if (typeof run.cart437.maxHp !== 'number') run.cart437.maxHp = 100;
    if (Surv437?.count?.('caixa_salmoura') > 0) run.cart437.brineBox = true;
    return run.cart437;
  }

  const cap = () => 180;
  function w() {
    const c = st(); if (!c) return 0;
    let total = 0;
    for (const [k, n] of Object.entries(c.inv)) {
      if (n > 0 && Surv437.ITEMS[k]) total += Surv437.ITEMS[k].w * n;
    }
    return total;
  }

  let meshGrp = null, interObj = null;

  function ensureMesh() {
    const c = st();
    if (!c || !c.built || !ready()) {
      if (meshGrp && meshGrp.parent) scene.remove(meshGrp);
      if (interObj && L?.inter) { const i = L.inter.indexOf(interObj); if (i >= 0) L.inter.splice(i, 1); }
      meshGrp = null; interObj = null;
      return;
    }
    if (!meshGrp || !meshGrp.parent) {
      meshGrp = new T.Group();
      meshGrp.position.set(c.x, H(c.x, c.z), c.z);
      meshGrp.rotation.y = c.rot || 0;
      meshGrp.userData.terrainAbsolute245 = true;
      scene.add(meshGrp);
      Surv437.glb('carrinho').then(tpl => {
        if (!tpl || !meshGrp) return;
        const m = Surv437.fit(tpl, 1.25, 2.3);
        meshGrp.add(m);
        meshGrp.userData.cartMesh = m;
      });
      const cargo = new T.Group();
      cargo.position.set(0, 0.55, 0);
      meshGrp.add(cargo);
      meshGrp.userData.cargo = cargo;
      syncCargoVisual();
    }
    if (!interObj) {
      interObj = {
        type: 'cart437', x: c.x, z: c.z, r: 3.2,
        label: 'F · CARRINHO DE CARGA (CAIXA DE SALMOURA)',
        use: () => open()
      };
    }
    interObj.x = c.x; interObj.z = c.z;
    interObj.label = c.pulling ? 'F · SOLTAR / ESTACIONAR CARRINHO' : 'F · PUXAR / ABRIR CARRINHO DE CARGA';
    if (L?.inter && !L.inter.includes(interObj)) L.inter.push(interObj);
  }

  function syncCargoVisual() {
    if (!meshGrp || !meshGrp.userData.cargo) return;
    const cargo = meshGrp.userData.cargo;
    while (cargo.children.length) cargo.remove(cargo.children[0]);
    const c = st(); if (!c) return;
    const used = w();
    if (used <= 0) return;
    const boxes = Math.min(6, Math.ceil(used / 25));
    const mat = new T.MeshStandardMaterial({ color: 0x7b5636, roughness: 0.88 });
    for (let i = 0; i < boxes; i++) {
      const b = new T.Mesh(new T.BoxGeometry(0.42, 0.32, 0.42), mat);
      b.position.set((i % 2 ? 0.24 : -0.24), Math.floor(i / 2) * 0.30, (i % 3 - 1) * 0.28);
      b.castShadow = true;
      cargo.add(b);
    }
  }

  function put(id, n = 1) {
    const c = st(), s = Surv437?.S?.(); if (!c || !c.built || !Surv437.ITEMS[id]) return false;
    if (Surv437.count(id) < n) return false;
    const addW = Surv437.ITEMS[id].w * n;
    if (w() + addW > cap()) {
      toast('O <b>Carrinho de Carga</b> atingiu o limite de ' + cap() + ' kg!');
      return false;
    }
    const incomingSpoil = (s && s.spoil && s.spoil[id]) || 0;
    const cur = c.inv[id] || 0;
    if (Surv437.ITEMS[id].spoilDays) {
      const oldSpoil = cur > 0 ? (c.spoil[id] || 0) : 0;
      c.spoil[id] = (oldSpoil * cur + incomingSpoil * n) / (cur + n);
    }
    Surv437.take(id, n);
    c.inv[id] = cur + n;
    syncCargoVisual();
    Surv437.save();
    return true;
  }

  function get(id, n = 1) {
    const c = st(); if (!c || !c.built || (c.inv[id] || 0) < n) return false;
    const sp = (c.spoil && c.spoil[id]) || 0;
    c.inv[id] -= n;
    if (c.inv[id] <= 0) { delete c.inv[id]; delete c.spoil[id]; }
    Surv437.add(id, n, true, sp);
    syncCargoVisual();
    Surv437.save();
    return true;
  }

  function togglePull() {
    const c = st(); if (!c || !c.built) return;
    if (Math.hypot(player.x - c.x, player.z - c.z) > 4.5) {
      toast('Chegue mais perto do <b>Carrinho de Carga</b> para puxá-lo.');
      return;
    }
    c.pulling = !c.pulling;
    if (!c.pulling) {
      c.parkedAt = { x: c.x, z: c.z };
    }
    toast(c.pulling
      ? '<b>[CARRINHO]</b> Puxando o Carrinho de Carga (Caixa de Salmoura ativa: alimentos estragam 75% mais devagar).'
      : '<b>[CARRINHO]</b> Carrinho estacionado (marcado no minimapa). Você está livre para combater ou entrar na Fenda!');
    Surv437.save();
  }

  function parkAtGate456(gate) {
    const c = st();
    if (!c || !c.built) return false;
    if (c.pulling || (gate && Math.hypot(c.x - gate.x, c.z - gate.z) < 16)) {
      c.pulling = false;
      if (gate) {
        c.x = gate.x + 3.6;
        c.z = gate.z + 3.4;
        c.parkedGateId = gate.id;
      }
      if (meshGrp) meshGrp.position.set(c.x, H(c.x, c.z), c.z);
      Surv437.save();
      toast('<b>[EXPEDIÇÃO]</b> Carrinho de Carga estacionado do lado de fora da Fenda (marcado no minimapa).');
      return true;
    }
    return false;
  }

  function repair456() {
    const c = st(); if (!c || !c.built) return false;
    if (c.hp >= c.maxHp && Surv437.count('caixa_salmoura') <= 0) {
      toast('O Carrinho de Carga já está com a estrutura em 100%.');
      return false;
    }
    if (Surv437.count('caixa_salmoura') > 0) {
      Surv437.take('caixa_salmoura', 1);
      c.brineBox = true;
      c.hp = c.maxHp;
      toast('<b>[BANCADA]</b> Caixa de Salmoura instalada e Carrinho de Carga 100% revisado!');
      Surv437.save();
      return true;
    }
    if (Surv437.count('galho') >= 2 && Surv437.count('corda') >= 1) {
      Surv437.take('galho', 2);
      Surv437.take('corda', 1);
      c.hp = c.maxHp;
      toast('<b>[BANCADA]</b> Carrinho de Carga consertado e reforçado (100%)!');
      Surv437.save();
      return true;
    }
    toast('Para consertar o Carrinho você precisa de 2 Galhos + 1 Corda (ou 1 Caixa de Salmoura).');
    return false;
  }

  function open() {
    const c = st();
    if (!c || !c.built) {
      toast('Você ainda não montou um <b>Carrinho de Carga</b>. Abra o menu de Acampamento [B] para construir um.');
      return;
    }
    view = () => open();
    const used = w();
    let h = '<div class="sysline">⚖ Carga no Carrinho: <b>' + used.toFixed(1) + ' / ' + cap() + ' kg</b> · Estrutura: <b>' + Math.round(c.hp) + '%</b><br>' +
      '🧊 <b>Caixa de Salmoura Ativa:</b> Os alimentos guardados aqui estragam <b>75% mais devagar</b>.<br>' +
      (c.pulling ? '<b style="color:#ffd54f">Você está puxando o carrinho.</b> Ao entrar numa Fenda, ele fica estacionado do lado de fora. Leve as provisões na mochila.' : 'Carrinho estacionado (visível no minimapa).') + '</div>';

    h += '<div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">' +
      '<button class="btn hot" id="ctPull">' + (c.pulling ? 'Soltar / Estacionar Carrinho (E)' : 'Puxar Carrinho (E)') + '</button>' +
      '<button class="btn" id="ctPutAll">Guardar Recursos Brutos & Lenha</button>' +
      '<button class="btn" id="ctTakeFood">Pegar Suprimentos p/ Fenda</button>' +
      (c.hp < c.maxHp || Surv437.count('caixa_salmoura') > 0 ? '<button class="btn" id="ctRepair">Consertar / Reforçar Salmoura</button>' : '') +
      '</div>';

    h += '<div class="sec">NO CARRINHO (CAIXA DE SALMOURA · -75% APODRECIMENTO)</div>';
    const cEntries = Object.entries(c.inv).filter(([k, n]) => n > 0 && Surv437.ITEMS[k]);
    if (!cEntries.length) h += '<div class="sysline">O carrinho está vazio.</div>';
    for (const [k, n] of cEntries) {
      const it = Surv437.ITEMS[k];
      let fHtml = '';
      if (it.spoilDays && Surv437.freshnessPct) {
        const pct = Surv437.freshnessPct(k, c.spoil);
        const stg = Surv437.freshStage(pct);
        fHtml = ' · <span style="color:' + stg.col + ';font-weight:700">' + stg.name + ' ' + pct + '%</span>';
      }
      h += row('<b>' + it.n + '</b> ×' + n + ' <small>(' + (it.w * n).toFixed(1) + ' kg)</small>' + fHtml, '',
        '<button class="btn" data-cget="' + k + ':1">Pegar 1</button> <button class="btn hot" data-cget="' + k + ':' + n + '">Pegar Tudo</button>');
    }

    h += '<div class="sec">NA SUA MOCHILA (' + Surv437.totalW().toFixed(1) + '/' + Math.round(Surv437.maxW()) + ' kg)</div>';
    const s = Surv437.S();
    const pEntries = Object.entries(s.inv).filter(([k, n]) => n > 0 && Surv437.ITEMS[k]);
    for (const [k, n] of pEntries) {
      const it = Surv437.ITEMS[k];
      h += row('<b>' + it.n + '</b> ×' + n + ' <small>(' + (it.w * n).toFixed(1) + ' kg)</small>', 'Na mochila',
        '<button class="btn" data-cput="' + k + ':1">Guardar 1</button> <button class="btn hot" data-cput="' + k + ':' + n + '">Guardar Tudo</button>');
    }

    openModal('CARRINHO DE CARGA & CAIXA DE SALMOURA', h);
    const bp = document.getElementById('ctPull');
    if (bp) bp.onclick = () => { togglePull(); closeModal(); };
    const ba = document.getElementById('ctPutAll');
    if (ba) ba.onclick = () => {
      for (const k of ['tora', 'lenha', 'pedra', 'galho', 'fibra', 'tabua', 'couro', 'osso', 'minerio']) {
        const q = Surv437.count(k);
        if (q > 0) put(k, q);
      }
      open();
    };
    const btf = document.getElementById('ctTakeFood');
    if (btf) btf.onclick = () => {
      for (const k of ['racao_expedicao', 'defumada', 'peixe_defumado', 'assada', 'peixe_assado', 'pacote_lacrado', 'lenha', 'erva']) {
        const q = c.inv[k] || 0;
        if (q > 0) get(k, Math.min(q, 6));
      }
      toast('Suprimentos de expedição transferidos para a mochila!');
      open();
    };
    const br = document.getElementById('ctRepair');
    if (br) br.onclick = () => { repair456(); open(); };
    document.querySelectorAll('#modal [data-cget]').forEach(b => b.onclick = () => {
      const [id, q] = b.dataset.cget.split(':');
      get(id, +q); open();
    });
    document.querySelectorAll('#modal [data-cput]').forEach(b => b.onclick = () => {
      const [id, q] = b.dataset.cput.split(':');
      put(id, +q); open();
    });
  }

  function tick(dt) {
    if (!ready() || paused) return;
    const c = st(); if (!c || !c.built) return;
    ensureMesh();
    if (c.pulling && !player.dead) {
      if (window.Water391?.swimming) {
        c.pulling = false;
        toast('Você soltou o <b>Carrinho de Carga</b> antes de entrar na água funda.');
        return;
      }
      const dx = player.x - c.x, dz = player.z - c.z, d = Math.hypot(dx, dz);
      const targetDist = 2.05;
      if (d > targetDist) {
        /* v480: reboque de alta velocidade */ const step = Math.min(d - targetDist, 35 * dt);
        c.x += (dx / d) * step;
        c.z += (dz / d) * step;
        c.rot = Math.atan2(dx, dz);
      }
      if (meshGrp) {
        meshGrp.position.set(c.x, H(c.x, c.z), c.z);
        meshGrp.rotation.y = c.rot;
      }
      if (interObj) { interObj.x = c.x; interObj.z = c.z; }
    }
  }

  /* Marcação do Carrinho de Carga estacionado no Minimapa e Mapa Mundi */
  function hookMinimap() {
    if (window.Campaign327 && typeof Campaign327.map === 'function' && !Campaign327.map.__cart456) {
      const origMap = Campaign327.map;
      const wrapped = function (ctx, S, full) {
        origMap.apply(this, arguments);
        try {
          const c = st();
          if (!c || !c.built || !player) return;
          const k = full ? S / 560 : 2.2;
          const dx = (c.x - player.x) * k, dz = (c.z - player.z) * k;
          const lim = S / 2 - 10;
          const scale = Math.min(1, lim / Math.max(Math.abs(dx), Math.abs(dz), 1));
          const mx = S / 2 + dx * scale, my = S / 2 + dz * scale;
          ctx.save();
          ctx.translate(mx, my);
          ctx.fillStyle = '#d8a25e';
          ctx.strokeStyle = '#1b1208';
          ctx.lineWidth = 2;
          ctx.fillRect(-5, -4, 10, 8);
          ctx.strokeRect(-5, -4, 10, 8);
          if (full) {
            ctx.fillStyle = '#ffe5b4';
            ctx.font = 'bold 10px sans-serif';
            ctx.fillText('Carrinho', 8, 3);
          }
          ctx.restore();
        } catch (_) {}
      };
      wrapped.__cart456 = true;
      Campaign327.map = wrapped;
    }
  }

  let last = performance.now();
  setInterval(() => {
    const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    try { tick(dt); hookMinimap(); } catch (_) {}
  }, 50);

  /* v580: o que boats440 chama (pulling/setPull/loadKg/menu) e nao existia */
  const pulling = () => { const c = run && run.cart437; return !!(c && c.pulling); };
  function setPull(v) { const c = st(); if (!c) return; c.pulling = !!v; if (!c.pulling) c.parkedAt = { x: c.x, z: c.z }; }
  function moveTo630(x, z) { const c = st(); if (!c) return; c.x = x; c.z = z; if (meshGrp) meshGrp.position.set(x, H(x, z), z); if (interObj) { interObj.x = x; interObj.z = z; } }
  window.Cart437 = { moveTo630, st, w, cap, put, get, togglePull, parkAtGate456, repair456, open, ensure: ensureMesh, pulling, setPull, loadKg: w, menu: open };
})();
