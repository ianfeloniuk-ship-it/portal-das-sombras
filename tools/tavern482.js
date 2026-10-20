/* v482 (Ian, 20/10/2026): Sistema de Interiores e Tavernas Vivas estilo Skyrim / GTA.
   Transição cinematográfica com fade preto suave na porta da Pousada/Taverna de qualquer cidade.
   Salão 3D modular aconchegante: piso de carvalho, lareira crepitante de pedra com luz âmbar oscilante,
   balcão rústico de tília com o Taverneiro, clientes bebendo hidromel, e Quadro de Contratos de Caçadores na parede. */
(function (global) {
  'use strict';

  let fadeEl = null;
  let hearthLight = null;
  let tavernTickInterval = null;

  function ensureFadeOverlay() {
    if (fadeEl && document.body.contains(fadeEl)) return fadeEl;
    fadeEl = document.getElementById('pds_tavern_fade482');
    if (!fadeEl) {
      fadeEl = document.createElement('div');
      fadeEl.id = 'pds_tavern_fade482';
      fadeEl.style.position = 'fixed';
      fadeEl.style.top = '0';
      fadeEl.style.left = '0';
      fadeEl.style.width = '100vw';
      fadeEl.style.height = '100vh';
      fadeEl.style.backgroundColor = '#000000';
      fadeEl.style.opacity = '0';
      fadeEl.style.pointerEvents = 'none';
      fadeEl.style.zIndex = '99999';
      fadeEl.style.transition = 'opacity 0.35s ease';
      document.body.appendChild(fadeEl);
    }
    return fadeEl;
  }

  function openEntryPrompt(city, door) {
    if (typeof cityFallen === 'function' && cityFallen(city)) {
      if (typeof toast === 'function') {
        toast(`<b>[${city.name.toUpperCase()}]</b> A taverna está trancada enquanto a cidade estiver sob cerco.`, 4000);
      }
      return;
    }

    const cName = city.name || 'Astera';
    let h = `<div class="guide93">`;
    h += `<strong>Taverna & Pousada de ${cName}</strong>`;
    h += `<p style="font-size:13px;line-height:1.5;margin-top:6px;color:#fde68a">`;
    h += `O aroma de ensopado de carne e hidromel quente escapa pelas frestas da pesada porta de carvalho. `;
    h += `No interior, aventureiros contam causos ao redor da lareira de pedra e o quadro de avisos aguarda por caçadores.`;
    h += `</p>`;
    h += `</div>`;

    h += `<div class="sec">COMO DESEJA ENTRAR?</div>`;
    h += `<div style="display:flex;flex-direction:column;gap:8px;margin-top:10px">`;
    h += `<button class="btn hot" onclick="Tavern482.enter(Tavern482.currentPromptCity, Tavern482.currentPromptDoor);if(typeof closeModal==='function')closeModal();">Entrar no Salão da Taverna (Exploração 3D)</button>`;
    h += `<button class="btn" onclick="if(typeof innView==='function')innView();">Descanso Rápido (Menu Tradicional)</button>`;
    h += `</div>`;

    Tavern482.currentPromptCity = city;
    Tavern482.currentPromptDoor = door;

    if (typeof openModal === 'function') {
      openModal(`POUSADA · ${cName.toUpperCase()}`, h);
    }
  }

  function enter(city, door) {
    const fade = ensureFadeOverlay();
    fade.style.opacity = '1';

    setTimeout(() => {
      try {
        buildTavernScene(city, door);
      } catch (e) {
        console.error('Erro ao construir taverna:', e);
      }
      setTimeout(() => {
        fade.style.opacity = '0';
      }, 80);
    }, 360);
  }

  function buildTavernScene(city, door) {
    if (typeof clearLevel === 'function') clearLevel();

    const returnPos = {
      city: city,
      door: door || (typeof player !== 'undefined' ? { x: player.x, z: player.z } : { x: 0, z: 0 }),
      prevX: typeof player !== 'undefined' ? player.x : 0,
      prevZ: typeof player !== 'undefined' ? player.z : 0,
      prevFace: typeof player !== 'undefined' ? player.face : 0
    };

    // Grid de colisão da sala da Taverna (Wd: 20, Hd: 16, CS: 1m)
    const Wd = 20, Hd = 16, CS = 1, ox = -10, oz = -8;
    const cells = new Uint8Array(Wd * Hd);
    for (let y = 1; y < Hd - 1; y++) {
      for (let x = 1; x < Wd - 1; x++) {
        cells[y * Wd + x] = 1; // 1 = livre / caminhável
      }
    }
    // Bloqueia lareira no norte
    for (let x = 7; x <= 12; x++) cells[1 * Wd + x] = 0;
    // Bloqueia balcão
    for (let x = 4; x <= 9; x++) cells[5 * Wd + x] = 0;
    cells[6 * Wd + 4] = 0;

    global.L = {
      mode: 'dungeon',
      isTavern482: true,
      group: new THREE.Group(),
      inter: [],
      grid: { cells, W: Wd, H: Hd, CS, ox, oz },
      rooms: [{ x: 1, y: 1, w: Wd - 2, h: Hd - 2 }],
      visited: new Uint8Array(Wd * Hd),
      seen: new Set([0]),
      bossRoom: -1,
      gate: { id: -99, rank: 0, x: returnPos.door.x, z: returnPos.door.z },
      exits: [],
      special: { kind: 'tavern', name: 'Taverna de ' + city.name },
      city: city,
      returnPos: returnPos
    };

    if (typeof scene !== 'undefined') scene.add(global.L.group);

    // Ajusta atmosfera e iluminação quente de taverna
    if (typeof scene !== 'undefined') {
      scene.background = new THREE.Color(0x140a05);
      scene.fog = new THREE.FogExp2(0x140a05, 0.022);
    }
    if (typeof hemi !== 'undefined') {
      hemi.color.setHex(0xffe0b2);
      hemi.intensity = 0.6;
    }
    if (typeof sun !== 'undefined') {
      sun.intensity = 0.08;
    }
    if (typeof pLight !== 'undefined') {
      pLight.color.setHex(0xffa726);
      pLight.intensity = 1.3;
    }

    // Material estilizado de toon para mobílias
    const woodMat = (typeof toonS === 'function') ? toonS(0x3e2723) : new THREE.MeshLambertMaterial({ color: 0x3e2723 });
    const stoneMat = (typeof toonS === 'function') ? toonS(0x37474f) : new THREE.MeshLambertMaterial({ color: 0x37474f });
    const barTopMat = (typeof toonS === 'function') ? toonS(0x27170e) : new THREE.MeshLambertMaterial({ color: 0x27170e });
    const rugMat = (typeof toonS === 'function') ? toonS(0x881313) : new THREE.MeshLambertMaterial({ color: 0x881313 });
    const emberMat = (typeof glowS === 'function') ? glowS(0xff7700, 1.2) : new THREE.MeshBasicMaterial({ color: 0xff7700 });

    // 1. Piso de Carvalho
    const floor = new THREE.Mesh(new THREE.BoxGeometry(18, 0.3, 14), woodMat);
    floor.position.set(0, -0.15, 0);
    global.L.group.add(floor);

    // Tapete carmesim em frente à lareira
    const rug = new THREE.Mesh(new THREE.CircleGeometry(2.5, 32), rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.02, -4.5);
    global.L.group.add(rug);

    // 2. Paredes de Pedra e Vigas Rústicas
    const wallN = new THREE.Mesh(new THREE.BoxGeometry(18, 4.8, 0.6), woodMat);
    wallN.position.set(0, 2.4, -7);
    global.L.group.add(wallN);

    const wallS = new THREE.Mesh(new THREE.BoxGeometry(18, 4.8, 0.6), woodMat);
    wallS.position.set(0, 2.4, 7);
    global.L.group.add(wallS);

    const wallW = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.8, 14), woodMat);
    wallW.position.set(-9, 2.4, 0);
    global.L.group.add(wallW);

    const wallE = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.8, 14), woodMat);
    wallE.position.set(9, 2.4, 0);
    global.L.group.add(wallE);

    // Vigas do Teto
    for (let bz = -5; bz <= 5; bz += 2.5) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(18, 0.35, 0.35), barTopMat);
      beam.position.set(0, 4.5, bz);
      global.L.group.add(beam);
    }

    // 3. Grande Lareira de Pedra (Hearth)
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(4.6, 4.6, 1.5), stoneMat);
    chimney.position.set(0, 2.3, -6.4);
    global.L.group.add(chimney);

    const hearthHole = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.2, 1.0), new THREE.MeshBasicMaterial({ color: 0x050505 }));
    hearthHole.position.set(0, 1.1, -5.9);
    global.L.group.add(hearthHole);

    // Troncos em brasas incandescentes
    const logs = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 2.2, 8), emberMat);
    logs.rotation.z = Math.PI / 2;
    logs.position.set(0, 0.25, -5.8);
    global.L.group.add(logs);

    // Ponto de luz quente cintilante da lareira
    hearthLight = new THREE.PointLight(0xff9800, 2.6, 18);
    hearthLight.position.set(0, 1.4, -5.4);
    global.L.group.add(hearthLight);

    // 4. Balcão de Carvalho do Taverneiro
    const bar = new THREE.Mesh(new THREE.BoxGeometry(5.4, 1.15, 1.3), barTopMat);
    bar.position.set(-4.5, 0.58, -2.8);
    global.L.group.add(bar);

    // Banquetas na frente do balcão
    for (let bx = -6.0; bx <= -3.0; bx += 1.5) {
      const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.75, 12), barTopMat);
      stool.position.set(bx, 0.38, -1.6);
      global.L.group.add(stool);
    }

    // Prateleira de Garrafas e Barris ao fundo
    const shelves = new THREE.Mesh(new THREE.BoxGeometry(5.4, 2.5, 0.6), barTopMat);
    shelves.position.set(-4.5, 2.2, -6.5);
    global.L.group.add(shelves);

    // 5. Taverneiro (Barkeep)
    if (typeof makeChibi === 'function') {
      try {
        const barkeepChibi = makeChibi({
          body: 0x5d4037,
          hair: 0x2b1d12,
          eye: 0x1a1a1a,
          wep: 'none',
          gk: 'Rogue',
          tint: 0xffd54f
        });
        barkeepChibi.root.position.set(-4.5, 0, -4.5);
        barkeepChibi.root.rotation.y = 0; // Olhando para o salão (sul)
        global.L.group.add(barkeepChibi.root);
      } catch (_) {}
    }

    const barkeepSign = (typeof makeSign === 'function') ? makeSign('ESTALAJADEIRO', '#ffd54f', 0.4) : null;
    if (barkeepSign) {
      barkeepSign.position.set(-4.5, 2.4, -2.8);
      global.L.group.add(barkeepSign);
    }

    global.L.inter.push({
      type: 'tavernkeeper',
      x: -4.5,
      z: -2.8,
      r: 3.2,
      label: 'F · FALAR COM O TAVERNEIRO',
      use: () => talkToBarkeep(city)
    });

    // 6. Quadro de Avisos e Contratos (Bounty Board) na parede Leste
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.6, 3.8), barTopMat);
    board.position.set(8.7, 2.2, 0);
    global.L.group.add(board);

    // Pergaminhos pregados no quadro
    for (let pz of [-1.2, -0.4, 0.4, 1.2]) {
      const scroll = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.9, 0.65), emberMat);
      scroll.position.set(8.65, 2.2, pz);
      global.L.group.add(scroll);
    }

    const boardSign = (typeof makeSign === 'function') ? makeSign('MURAL DE CONTRATOS', '#fbbf24', 0.4) : null;
    if (boardSign) {
      boardSign.position.set(8.5, 3.8, 0);
      boardSign.rotation.y = -Math.PI / 2;
      global.L.group.add(boardSign);
    }

    global.L.inter.push({
      type: 'bounty_board',
      x: 7.8,
      z: 0,
      r: 2.8,
      label: 'F · EXAMINAR QUADRO DE CONTRATOS',
      use: () => {
        if (global.Quests480 && typeof global.Quests480.openBoard === 'function') {
          global.Quests480.openBoard(city.name);
        } else if (typeof toast === 'function') {
          toast('Nenhum contrato ativo no mural no momento.');
        }
      }
    });

    // 7. Mesas, Canecas e Clientes da Taverna
    const table1 = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.85, 16), woodMat);
    table1.position.set(4.2, 0.42, -2.8);
    global.L.group.add(table1);

    const candleLight = new THREE.PointLight(0xffe082, 1.2, 8);
    candleLight.position.set(4.2, 1.3, -2.8);
    global.L.group.add(candleLight);

    if (typeof makeChibi === 'function') {
      try {
        const patron = makeChibi({
          body: 0x334155,
          hair: 0x94a3b8,
          wep: 'none',
          gk: 'Warrior',
          tint: 0x93c5fd
        });
        patron.root.position.set(4.2, 0, -4.0);
        global.L.group.add(patron.root);
      } catch (_) {}
    }

    // 8. Porta de Saída para a Cidade
    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.6, 0.4), barTopMat);
    doorFrame.position.set(0, 1.8, 6.7);
    global.L.group.add(doorFrame);

    const exitSign = (typeof makeSign === 'function') ? makeSign('SAÍDA PARA A CIDADE', '#ffffff', 0.35) : null;
    if (exitSign) {
      exitSign.position.set(0, 3.9, 6.5);
      global.L.group.add(exitSign);
    }

    global.L.inter.push({
      type: 'tavern_exit',
      x: 0,
      z: 5.8,
      r: 2.8,
      label: 'F · SAIR PARA A CIDADE',
      use: () => leave()
    });

    // Posiciona o jogador em frente à porta, olhando para o interior
    if (typeof player !== 'undefined' && player) {
      player.x = 0;
      player.z = 4.6;
      player.face = 0; // Olhando para o norte (fogo e balcão)
    }
    if (typeof cam !== 'undefined' && cam) {
      cam.x = 0;
      cam.z = 8.0;
    }

    if (typeof sfx === 'function') sfx('quest');
    if (typeof bigText === 'function') bigText('TAVERNA DE ' + city.name.toUpperCase(), 1600);

    // Inicia oscilação suave da chama da lareira
    if (tavernTickInterval) clearInterval(tavernTickInterval);
    tavernTickInterval = setInterval(() => {
      if (!global.L || !global.L.isTavern482 || !hearthLight) {
        clearInterval(tavernTickInterval);
        return;
      }
      const t = performance.now() / 1000;
      hearthLight.intensity = 2.4 + Math.sin(t * 7.5) * 0.25 + (Math.random() - 0.5) * 0.15;
    }, 80);
  }

  function leave() {
    const fade = ensureFadeOverlay();
    fade.style.opacity = '1';

    setTimeout(() => {
      if (tavernTickInterval) clearInterval(tavernTickInterval);
      const ret = (global.L && global.L.returnPos) ? global.L.returnPos : null;
      if (typeof clearLevel === 'function') clearLevel();

      if (ret && typeof player !== 'undefined') {
        player.x = ret.door ? ret.door.x : ret.prevX;
        player.z = ret.door ? ret.door.z + 1.2 : ret.prevZ + 1.2;
        player.face = Math.PI;
      }

      if (typeof buildWorld === 'function') buildWorld();
      if (typeof placeAllies === 'function') placeAllies();
      if (typeof cam !== 'undefined' && typeof player !== 'undefined') {
        cam.x = player.x;
        cam.z = player.z;
      }
      if (typeof sfx === 'function') sfx('portal');

      setTimeout(() => {
        fade.style.opacity = '0';
        if (typeof toast === 'function' && ret && ret.city) {
          toast(`<b>[TAVERNA]</b> Você saiu da taverna e voltou às ruas de ${ret.city.name}.`, 4000);
        }
      }, 80);
    }, 360);
  }

  function talkToBarkeep(city) {
    const cName = city.name || 'Astera';
    let h = `<div class="guide93">`;
    h += `<strong>Estalajadeiro de ${cName}</strong>`;
    h += `<p style="font-size:13px;line-height:1.45;margin-top:6px;color:#dbe8f2">`;
    h += `"Saudações, Transmigrador! O caldo está quente e o barril de hidromel acabou de ser aberto. O que vai ser hoje?"`;
    h += `</p>`;
    h += `</div>`;

    h += `<div class="sec">SERVIÇOS DA TAVERNA</div>`;
    h += `<div style="display:flex;flex-direction:column;gap:8px;margin-top:10px">`;
    h += `<button class="btn hot" onclick="Tavern482.askRumor('${cName}');if(typeof closeModal==='function')closeModal();">🗣️ "Ouviu algum boato ou lenda nesta região?"</button>`;
    h += `<button class="btn" onclick="Tavern482.buyMead();if(typeof closeModal==='function')closeModal();">🍺 Servir Caneca de Hidromel da Casa (40 Ouro · Buff de Velocidade & Vigor)</button>`;
    h += `<button class="btn" onclick="Tavern482.restInInn();if(typeof closeModal==='function')closeModal();">🛏️ Alugar Quarto para Dormir até o Amanhecer (Cura Total & Descanso)</button>`;
    h += `<button class="btn" onclick="if(global.Quests480&&typeof global.Quests480.openBoard==='function')global.Quests480.openBoard('${cName}');if(typeof closeModal==='function')closeModal();">📜 Ver Mural de Contratos e Caçadas da Região</button>`;
    h += `</div>`;

    if (typeof openModal === 'function') {
      openModal(`ESTALAJADEIRO · ${cName.toUpperCase()}`, h);
    }
  }

  function askRumor(cName) {
    const rumors = [
      `"Batedores que desceram as montanhas juram ter visto o brilho avermelhado de uma Fenda Ancestral oculta a cerca de 320m a nordeste. Dizem que há um relicário intacto lá dentro!"`,
      `"Um mercador da rota relatou que uma alcateia com uma Fera Alfa com chifres de obsidiana atacou uma carroça perto das colinas a sudoeste. A Ordem está pagando alto pela carcaça!"`,
      `"Viajantes que cruzaram o cânion contam que uma cripta esquecida foi destrancada pelas vibrações das fendas. Quem levar tochas pode encontrar ouro dos primeiros reis!"`,
      `"Cuidado se for para o litoral ou charcos hoje: pescadores avistaram carcaças de monstros marinhos encalhadas, e saqueadores armados já estão fatiando os despojos."`
    ];
    const r = rumors[Math.floor(Math.random() * rumors.length)];

    let h = `<div class="guide93">`;
    h += `<strong>Boatos de Taverna · ${cName}</strong>`;
    h += `<p style="font-size:14px;line-height:1.5;margin-top:8px;color:#fde68a">${r}</p>`;
    h += `</div>`;
    h += `<div style="margin-top:12px;text-align:right">`;
    h += `<button class="btn hot" onclick="if(typeof closeModal==='function')closeModal();">Anotar no Diário de Bordo</button>`;
    h += `</div>`;

    if (typeof sfx === 'function') sfx('chat');
    if (typeof openModal === 'function') {
      openModal('BOATO DE TAVERNA', h);
    }
  }

  function buyMead() {
    if (typeof run === 'undefined' || !run) return;
    if ((run.gold || 0) < 40) {
      if (typeof toast === 'function') toast('Ouro insuficiente para pagar a rodada de hidromel (custa 40 ouro).', 4000);
      return;
    }
    run.gold -= 40;
    if (typeof player !== 'undefined' && player) {
      player.hp = Math.min(player.maxhp, player.hp + player.maxhp * 0.4);
      player.mp = Math.min(player.maxmp, player.mp + player.maxmp * 0.4);
    }
    run.rested = { t: 360, l: 2 }; // 6 minutos de buff
    if (typeof sfx === 'function') sfx('potion');
    if (typeof toast === 'function') {
      toast('<b>[HIDROMEL DA ORDEM]</b> O hidromel quente aqueceu seu peito! Recuperou vida/mana e ganhou +15% de velocidade e vigor por 6 min!', 6000);
    }
  }

  function restInInn() {
    if (typeof innView === 'function') {
      innView();
    }
  }

  global.Tavern482 = {
    openEntryPrompt,
    enter,
    leave,
    talkToBarkeep,
    askRumor,
    buyMead,
    restInInn
  };

})(window);
