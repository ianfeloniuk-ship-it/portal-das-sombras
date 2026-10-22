/* ============================================================================
 * PRIMEVA v538 — SKYRIM OVERHAUL & INTEGRAÇÃO DAS 300 MISSÕES + MOTOR INFINITO
 * Arquivo: tools/skyrim-overhaul538.js
 * Direção e Criação: Ian Feloniuk
 *
 * 1. Ataque básico mágico contínuo (1 de mana/s) + roda do mouse (1-4) para armas.
 * 2. Câmera 1ª/3ª pessoa (V) com mãos/luvas.
 * 3. Desiluminador (H) + progressão sem classe fixa (K).
 * 4. Atacar qualquer NPC + recompensa por naturalidade e testemunhas.
 * 5. Mapa-múndi 3D com relevo, mar e névoa (M).
 * ============================================================================ */
(function (global) {
  'use strict';

  const API = global.SkyrimOverhaul538 = {
    version: 538,
    firstPerson: false,
    activeSlot: 0,
    manaDrainAcc: 0,
    deluminatorOrbs: [],
    map3DActive: true,
    map3DAngle: 0,
    map3DZoom: 1,
    map3DPanX: 0,
    map3DPanZ: 0,
    discoveredSpells: ['chamas_iniciais'],
    skillTree: {
      espadas: { level: 1, xp: 0, name: 'Lâminas & Espadas', bonus: '+5% dano de corte por nível' },
      macas: { level: 1, xp: 0, name: 'Maças & Impacto', bonus: '+5% quebra de guarda por nível' },
      adagas: { level: 1, xp: 0, name: 'Adagas & Furtividade', bonus: '+6% crítico furtivo por nível' },
      arcos: { level: 1, xp: 0, name: 'Arquearia & Precisão', bonus: '+5% alcance e dano à distância' },
      magia_fogo: { level: 1, xp: 0, name: 'Chamas & Destruição', bonus: '+6% dano elemental por nível' },
      luz_ilusao: { level: 1, xp: 0, name: 'Luz & Desiluminação', bonus: '+2m raio de absorção de luz' },
      defesa: { level: 1, xp: 0, name: 'Bloqueio & Aparo', bonus: '+5% redução no botão do meio' }
    },
    bountyByCity: { Aster: 0, Ymiria: 0, Zahar: 0, Thalor: 0, Urdan: 0, Verden: 0 }
  };

  const QUICK_SLOTS = [
    { slot: 1, id: 'dagger', name: 'Adaga de Caça', kind: 'dagger', isMagic: false, icon: '🗡️', dmgMul: 1, spdMul: 1 },
    { slot: 2, id: 'mace', name: 'Maça de Ferro', kind: 'mace', isMagic: false, icon: '🔨', dmgMul: 1, spdMul: 1 },
    { slot: 3, id: 'sword', name: 'Espada Longa', kind: 'sword', isMagic: false, icon: '⚔️', dmgMul: 1, spdMul: 1 },
    { slot: 4, id: 'staff_fire', name: 'Chamas / Cajado', kind: 'staff', isMagic: true, icon: '🔥', dmgMul: 1, spdMul: 1 }
  ];
  API.QUICK_SLOTS = QUICK_SLOTS;

  const WORLD_SPELLS = [
    { id: 'chamas_iniciais', name: 'Chamas Contínuas', costText: '1 de mana por segundo', location: 'Despertar Inicial', x: 0, z: 40, desc: 'Fluxo contínuo de fogo nas mãos estilo Skyrim. Gasta 1 de mana por segundo enquanto ataca.' },
    { id: 'desiluminador', name: 'Luz de Dumbledore (Desiluminador)', costText: '0 de mana (Utilitária)', location: 'Postes de Aster', x: 18, z: -15, desc: 'Retira a luz dos postes e tochas ao redor para deixar a rua no breu e devolve a luz quando quiser.' },
    { id: 'geada_ymiria', name: 'Sopro de Geada Contínuo', costText: '1 de mana por segundo', location: 'Altar de Ymiria', x: 0, z: -3360, desc: 'Congela o passo do inimigo na neve e reduz a velocidade dele em 30%.' },
    { id: 'faisca_thalor', name: 'Corrente de Centelhas', costText: '1 de mana por segundo', location: 'Farol de Thalor', x: -3810, z: 20, desc: 'Salta entre inimigos molhados ou próximos à costa.' },
    { id: 'passo_sussurro', name: 'Passos Abafados na Névoa', costText: '10 de mana', location: 'Ruínas de Verden', x: 2260, z: 2280, desc: 'Silencia completamente seus passos por 30 segundos.' }
  ];
  API.WORLD_SPELLS = WORLD_SPELLS;

  // ===== HUD =====
  function injectStylesAndHUD() {
    if (typeof document === 'undefined' || document.getElementById('skyrim538-style')) return;

    const st = document.createElement('style');
    st.id = 'skyrim538-style';
    st.textContent = `
      #skyrim538-bounty-banner { position: fixed; top: 68px; left: 24px; z-index: 9998; font-family: "Cinzel","Chakra Petch",Georgia,serif; font-size: 20px; font-weight: 700; color: #f3efe6; text-shadow: 0 2px 6px rgba(0,0,0,.95),0 0 12px rgba(0,0,0,.85); letter-spacing: .6px; pointer-events: none; opacity: 0; transform: translateY(-6px); transition: opacity .35s ease, transform .35s ease; }
      #skyrim538-bounty-banner.show { opacity: 1; transform: translateY(0); }
      #skyrim538-sub-subtitle { position: fixed; bottom: 138px; left: 50%; transform: translateX(-50%); z-index: 9997; font-family: "Chakra Petch",sans-serif; font-size: 18px; font-weight: 600; color: #f6f1e3; background: rgba(8,10,14,.72); border: 1px solid rgba(255,214,138,.32); padding: 6px 18px; border-radius: 4px; text-shadow: 0 2px 4px #000; pointer-events: none; opacity: 0; transition: opacity .25s ease; }
      #skyrim538-sub-subtitle.show { opacity: 1; }
      #skyrim538-quickbar { position: fixed; bottom: 14px; left: 50%; transform: translateX(-50%); z-index: 900; display: flex; gap: 8px; align-items: center; background: rgba(10,14,22,.84); border: 1px solid rgba(212,180,116,.42); border-radius: 6px; padding: 5px 10px; box-shadow: 0 6px 20px rgba(0,0,0,.65); }
      .sky538-slot { display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 4px; border: 1px solid rgba(255,255,255,.14); background: rgba(20,26,38,.75); color: #cbd5e1; font-family: "Chakra Petch",sans-serif; font-size: 12px; cursor: pointer; user-select: none; transition: all .15s ease; }
      .sky538-slot.active { border-color: #ffd070; background: linear-gradient(180deg, rgba(92,68,24,.85), rgba(38,28,12,.92)); color: #fff7e0; box-shadow: 0 0 10px rgba(255,196,77,.45); }
      .sky538-slot kbd { background: rgba(0,0,0,.55); border: 1px solid rgba(255,255,255,.22); border-radius: 3px; padding: 1px 5px; font-size: 11px; color: #ffd070; }
      #skyrim538-fp-canvas { position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 45; display: none; }
    `;
    document.head.appendChild(st);

    const banner = document.createElement('div');
    banner.id = 'skyrim538-bounty-banner';
    document.body.appendChild(banner);

    const sub = document.createElement('div');
    sub.id = 'skyrim538-sub-subtitle';
    document.body.appendChild(sub);

    const fpCanvas = document.createElement('canvas');
    fpCanvas.id = 'skyrim538-fp-canvas';
    fpCanvas.width = 960;
    fpCanvas.height = 540;
    document.body.appendChild(fpCanvas);

    const qbar = document.createElement('div');
    qbar.id = 'skyrim538-quickbar';
    renderQuickBar(qbar);
    document.body.appendChild(qbar);
  }

  function renderQuickBar(container) {
    const el = container || (typeof document !== 'undefined' ? document.getElementById('skyrim538-quickbar') : null);
    if (!el) return;
    let html = '';
    QUICK_SLOTS.forEach((s, idx) => {
      const act = API.activeSlot === idx ? ' active' : '';
      html += `<div class="sky538-slot${act}" data-slot="${idx}" title="Role a rodinha do mouse ou aperte ${s.slot}"><kbd>${s.slot}</kbd><span>${s.icon} ${s.name}</span></div>`;
    });
    const fpAct = API.firstPerson ? ' active' : '';
    const orbsCount = API.deluminatorOrbs.length;
    html += `<div class="sky538-slot${fpAct}" id="sky538-btn-pov" title="Alternar 1ª / 3ª Pessoa (Tecla V)"><kbd>V</kbd><span>🎥 ${API.firstPerson ? '1ª PESSOA' : '3ª PESSOA'}</span></div>`;
    html += `<div class="sky538-slot${orbsCount > 0 ? ' active' : ''}" id="sky538-btn-light" title="Desiluminador de Luzes (Tecla H)"><kbd>H</kbd><span>✨ LUZ (${orbsCount})</span></div>`;
    html += `<div class="sky538-slot" id="sky538-btn-tree" title="Árvore de Habilidades Sem Classe & 300 Missões"><kbd>K</kbd><span>🌳 HABILIDADES & 300 MISSÕES</span></div>`;
    el.innerHTML = html;

    el.querySelectorAll('[data-slot]').forEach(btn => {
      btn.addEventListener('click', () => API.selectQuickSlot(parseInt(btn.getAttribute('data-slot'), 10)));
    });
    const povBtn = el.querySelector('#sky538-btn-pov');
    if (povBtn) povBtn.addEventListener('click', () => API.toggleFirstPerson());
    const lightBtn = el.querySelector('#sky538-btn-light');
    if (lightBtn) lightBtn.addEventListener('click', () => API.useDeluminator());
    const treeBtn = el.querySelector('#sky538-btn-tree');
    if (treeBtn) treeBtn.addEventListener('click', () => API.openSkillTreeModal());
  }

  let bountyTimer = null;
  function showSkyrimBanner(text) {
    if (typeof document === 'undefined') return;
    const b = document.getElementById('skyrim538-bounty-banner');
    if (!b) return;
    b.textContent = text;
    b.classList.add('show');
    if (bountyTimer) clearTimeout(bountyTimer);
    bountyTimer = setTimeout(() => b.classList.remove('show'), 4200);
  }
  API.showSkyrimBanner = showSkyrimBanner;

  let subTimer = null;
  function showSkyrimSubtitle(speaker, line) {
    if (typeof document === 'undefined') return;
    const s = document.getElementById('skyrim538-sub-subtitle');
    if (!s) return;
    s.innerHTML = `<b style="color:#ffd070">${speaker}:</b> ${line}`;
    s.classList.add('show');
    if (subTimer) clearTimeout(subTimer);
    subTimer = setTimeout(() => s.classList.remove('show'), 3800);
  }
  API.showSkyrimSubtitle = showSkyrimSubtitle;

  // ===== Roda do mouse + dreno de mana =====
  API.selectQuickSlot = function (idx) {
    const slotIdx = ((idx % QUICK_SLOTS.length) + QUICK_SLOTS.length) % QUICK_SLOTS.length;
    API.activeSlot = slotIdx;
    const chosen = QUICK_SLOTS[slotIdx];

    if (global.profile) global.profile.classless = true;

    if (global.run) {
      global.run.equip = global.run.equip || {};
      const curW = global.run.equip.w || { slot: 'w', name: chosen.name, atk: 12, r: 0 };
      const baseAtk = Math.max(10, Math.round(curW.atk || 14));
      global.run.equip.w = Object.assign({}, curW, {
        name: chosen.name,
        kind155: chosen.kind,
        visual: { shape: chosen.kind },
        visualWeapon: { shape: chosen.kind },
        atk: baseAtk
      });
      global.run.style = chosen.isMagic ? 'arc' : 'nat';
    }

    renderQuickBar();
    if (typeof global.hud === 'function') {
      try { global.hud(); } catch (_) {}
    }
    showSkyrimBanner(`Equipado [${chosen.slot}]: ${chosen.name}`);
    return chosen;
  };

  function tickManaDrainAndSkills(dt) {
    const P = global.player;
    const r = global.run;
    if (!P || P.dead || !r) return;

    const currentSlot = QUICK_SLOTS[API.activeSlot];
    const isAttackingNow = P.atkCd > 0.02 || P.atkT > 0.01;

    if (isAttackingNow) {
      if (currentSlot && currentSlot.isMagic) {
        API.manaDrainAcc += dt;
        if (API.manaDrainAcc >= 1.0) {
          const drainInt = Math.floor(API.manaDrainAcc);
          API.manaDrainAcc -= drainInt;
          const curMana = Math.max(0, Math.floor((P.mana !== undefined ? P.mana : r.mp) || 0));
          if (curMana >= drainInt) {
            if (P.mana !== undefined) P.mana = Math.max(0, P.mana - drainInt);
            if (r.mp !== undefined) r.mp = Math.max(0, r.mp - drainInt);
            if (typeof global.floater === 'function') global.floater(P.x, P.z, `-${drainInt} MANA`, '#60a5fa');
            gainSkillXP('magia_fogo', 2);
          } else {
            if (P.mana !== undefined) P.mana = 0;
            if (r.mp !== undefined) r.mp = 0;
            showSkyrimBanner('Mana esgotada! Trocando para a Espada (Slot 3)');
            API.selectQuickSlot(2);
          }
        }
      } else if (currentSlot) {
        API.manaDrainAcc += dt;
        if (API.manaDrainAcc >= 1.2) {
          API.manaDrainAcc = 0;
          if (currentSlot.kind === 'sword') gainSkillXP('espadas', 2);
          else if (currentSlot.kind === 'mace') gainSkillXP('macas', 2);
          else if (currentSlot.kind === 'dagger') gainSkillXP('adagas', 2);
        }
      }
    }
  }

  function gainSkillXP(branchKey, amount) {
    const br = API.skillTree[branchKey];
    if (!br) return;
    br.xp += Math.round(amount);
    const need = br.level * 20;
    if (br.xp >= need) {
      br.xp -= need;
      br.level += 1;
      showSkyrimBanner(`${br.name} subiu para o Nível ${br.level}!`);
      if (global.player) global.player.dmg = Math.round((global.player.dmg || 20) * 1.03);
    }
  }
  API.gainSkillXP = gainSkillXP;

  // ===== 1ª / 3ª pessoa =====
  API.toggleFirstPerson = function () {
    API.firstPerson = !API.firstPerson;
    const fpCanvas = typeof document !== 'undefined' ? document.getElementById('skyrim538-fp-canvas') : null;
    if (fpCanvas) fpCanvas.style.display = API.firstPerson ? 'block' : 'none';
    if (global.player && global.player.m && global.player.m.root) global.player.m.root.visible = !API.firstPerson;
    renderQuickBar();
    showSkyrimBanner(API.firstPerson ? 'Visão em 1ª Pessoa (Mãos e Luvas Ativas)' : 'Visão em 3ª Pessoa');
    return API.firstPerson;
  };

  function getGlovePalette() {
    const b = global.run && global.run.equip && global.run.equip.b;
    const name = (b && b.name ? b.name : '').toLowerCase();
    if (name.includes('mithril')) return { main: '#9ec5e8', trim: '#d8eeff', stud: '#ffffff', label: 'Manoplas de Mithril' };
    if (name.includes('estrela') || name.includes('primeva')) return { main: '#eab308', trim: '#fef08a', stud: '#a855f7', label: 'Manoplas Estelares' };
    if (name.includes('aço') || name.includes('aco') || name.includes('ferro')) return { main: '#7c8594', trim: '#b8c2d1', stud: '#e2e8f0', label: 'Manoplas de Aço Cravejado' };
    return { main: '#8c6d53', trim: '#586574', stud: '#cbd5e1', label: 'Luvas de Couro Cravejado' };
  }

  function renderFirstPersonHands(nowSec) {
    if (!API.firstPerson || typeof document === 'undefined') return;
    const canvas = document.getElementById('skyrim538-fp-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const P = global.player;
    if (!P || P.dead || global.modalOpen) return;

    const pal = getGlovePalette();
    const slot = QUICK_SLOTS[API.activeSlot] || QUICK_SLOTS[0];
    const isMoving = Math.hypot((P.vx || 0), (P.vz || 0)) > 0.2;
    const isAttacking = (P.atkCd || 0) > 0.02;
    const isBlocking = !!(global.Guard472 && typeof global.Guard472.isBlocking === 'function' && global.Guard472.isBlocking());

    const bobX = isMoving ? Math.sin(nowSec * 8) * 10 : Math.sin(nowSec * 2) * 3;
    const bobY = isMoving ? Math.abs(Math.cos(nowSec * 8)) * 9 : Math.cos(nowSec * 2) * 3;
    const swing = isAttacking ? Math.sin(((P.atkCd || 0) * 14)) * 38 : 0;
    const blockLift = isBlocking ? -45 : 0;

    ctx.save();
    ctx.translate(210 + bobX, H - 50 + bobY + blockLift);
    ctx.rotate(-0.22 + (isAttacking ? 0.14 : 0));

    const flameGrad = ctx.createRadialGradient(0, -110, 8, 0, -110, 72);
    if (API.deluminatorOrbs.length > 0) {
      flameGrad.addColorStop(0, 'rgba(255,250,210,.95)');
      flameGrad.addColorStop(0.5, 'rgba(96,185,255,.65)');
      flameGrad.addColorStop(1, 'rgba(96,185,255,0)');
    } else {
      flameGrad.addColorStop(0, 'rgba(255,235,150,.92)');
      flameGrad.addColorStop(0.5, 'rgba(255,110,25,.65)');
      flameGrad.addColorStop(1, 'rgba(255,60,0,0)');
    }
    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.arc(0, -110, 68 + Math.sin(nowSec * 15) * 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = pal.main;
    ctx.strokeStyle = '#1e1b18';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-42, -75, 84, 130, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = pal.trim;
    ctx.fillRect(-45, -35, 90, 24);
    for (let i = -30; i <= 30; i += 20) {
      ctx.fillStyle = pal.stud;
      ctx.beginPath();
      ctx.arc(i, -23, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.translate(W - 220 - bobX - swing * 0.8, H - 40 + bobY - Math.abs(swing) * 0.6 + blockLift);
    ctx.rotate(0.24 - (isAttacking ? 0.35 : 0));

    if (slot.isMagic) {
      const fireR = isAttacking ? 135 : 85;
      const g2 = ctx.createRadialGradient(-20, -130, 10, -20, -130, fireR);
      g2.addColorStop(0, 'rgba(255,250,190,.98)');
      g2.addColorStop(0.45, 'rgba(255,135,25,.88)');
      g2.addColorStop(1, 'rgba(220,38,38,0)');
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(-20, -130, fireR, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.save();
      ctx.translate(0, -90);
      ctx.fillStyle = '#d6e0ea';
      ctx.strokeStyle = '#293241';
      ctx.lineWidth = 3;
      if (slot.kind === 'dagger') {
        ctx.beginPath();
        ctx.moveTo(-10, 15);
        ctx.lineTo(0, -95);
        ctx.lineTo(10, 15);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (slot.kind === 'mace') {
        ctx.fillStyle = '#6b4f35';
        ctx.fillRect(-7, -95, 14, 110);
        ctx.fillStyle = '#8d99ae';
        ctx.beginPath();
        ctx.arc(0, -105, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(-13, 20);
        ctx.lineTo(0, -165);
        ctx.lineTo(13, 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#d4a359';
        ctx.fillRect(-34, 12, 68, 12);
      }
      ctx.restore();
    }

    ctx.fillStyle = pal.main;
    ctx.strokeStyle = '#1e1b18';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-46, -80, 92, 140, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = pal.trim;
    ctx.fillRect(-48, -38, 96, 26);
    for (let i = -32; i <= 32; i += 21) {
      ctx.fillStyle = pal.stud;
      ctx.beginPath();
      ctx.arc(i, -25, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // ===== Desiluminador =====
  API.useDeluminator = function () {
    const P = global.player;
    if (!P) return;
    const sc = global.scene;

    const nearbyLights = [];
    if (sc && typeof sc.traverse === 'function') sc.traverse(obj => {
      if (obj.isPointLight && obj.distance > 0 && obj.distance <= 45) {
        const wp = new THREE.Vector3();
        obj.getWorldPosition(wp);
        const d = Math.hypot(wp.x - P.x, wp.z - P.z);
        if (d <= 35) nearbyLights.push({ light: obj, dist: d, pos: wp });
      }
    });

    const litPost = nearbyLights.find(item => item.light.visible !== false && item.light.intensity > 0.05);
    if (litPost && API.deluminatorOrbs.length < 12) {
      let count = 0;
      nearbyLights.forEach(item => {
        if (item.light.visible !== false && item.light.intensity > 0.05) {
          API.deluminatorOrbs.push({ lightRef: item.light, origIntensity: item.light.intensity, x: Math.round(item.pos.x), z: Math.round(item.pos.z) });
          item.light.intensity = 0;
          item.light.visible = false;
          count++;
        }
      });
      gainSkillXP('luz_ilusao', 5);
      renderQuickBar();
      showSkyrimBanner(`Desiluminador: ${count} luzes absorvidas dos postes (Furtividade +25%)`);
      if (typeof global.floater === 'function') global.floater(P.x, P.z, `✨ +${count} LUZES GUARDADAS`, '#fde047', true);
      return { action: 'absorbed', count };
    }

    if (API.deluminatorOrbs.length > 0) {
      const restored = API.deluminatorOrbs.length;
      API.deluminatorOrbs.forEach(orb => {
        if (orb.lightRef) {
          orb.lightRef.visible = true;
          orb.lightRef.intensity = orb.origIntensity || 2.0;
        }
      });
      API.deluminatorOrbs = [];
      gainSkillXP('luz_ilusao', 5);
      renderQuickBar();
      showSkyrimBanner(`Desiluminador: ${restored} luzes devolvidas aos postes!`);
      if (typeof global.floater === 'function') global.floater(P.x, P.z, '💡 LUZES DEVOLVIDAS AOS POSTES', '#fde047', true);
      return { action: 'restored', count: restored };
    }

    API.deluminatorOrbs.push({ lightRef: null, origIntensity: 2, x: Math.round(P.x), z: Math.round(P.z) });
    gainSkillXP('luz_ilusao', 3);
    renderQuickBar();
    showSkyrimBanner('Desiluminador: Luz do poste absorvida para a sua mão!');
    return { action: 'absorbed_virtual', count: 1 };
  };

  // ===== Atacar NPCs =====
  const NPC_SURPRISE_LINES = [
    'O que você pensa que está fazendo?',
    'Guardas! Ele enlouqueceu!',
    'Você vai pagar caro por levantar a mão contra mim!',
    'Por Aster! Alguém chame a patrulha!'
  ];

  function getNearestCityInfo(x, z) {
    if (typeof global.nearestCity === 'function') {
      try {
        const res = global.nearestCity(x, z);
        if (res && res.c) return { name: res.c.name || 'Aster', id: (res.c.name || 'aster').toLowerCase(), dist: res.d || 0, city: res.c };
      } catch (_) {}
    }
    return { name: 'Aster', id: 'aster', dist: 40, city: null };
  }

  function ensureNpcCombatProps(n, idx) {
    if (!n || n._skyrim538Ready) return;
    n._skyrim538Ready = true;
    const cInfo = getNearestCityInfo(n.x || 0, n.z || 0);
    const otherCities = ['Ymiria', 'Zahar', 'Thalor', 'Urdan', 'Verden', 'Solaria'];
    const isForeigner = ((idx || 0) % 4 === 3) || /viajante|forasteiro|caravana|peregrino/i.test(n.name || '');
    n.currentCity = cInfo.name;
    n.homeCity = isForeigner ? otherCities[(idx || 0) % otherCities.length] : cInfo.name;
    n.isForeigner = n.homeCity !== n.currentCity;
    n.hp538 = n.hp538 || 120;
    n.maxHp538 = n.maxHp538 || 120;
    n.hostileToPlayer = false;
  }

  function hasWitnessesNear(x, z, victimNpc) {
    const list = global.npcs || [];
    for (const other of list) {
      if (!other || other === victimNpc || other.dead538) continue;
      if (Math.hypot((other.x || 0) - x, (other.z || 0) - z) <= 28) return true;
    }
    return false;
  }

  API.checkNpcHitFromAttack = function () {
    const P = global.player;
    const list = global.npcs || [];
    if (!P || P.dead || !list.length) return;

    const slot = QUICK_SLOTS[API.activeSlot] || QUICK_SLOTS[0];
    const reach = slot.isMagic ? 11 : 4.2;

    list.forEach((n, idx) => {
      if (!n || n.dead538) return;
      ensureNpcCombatProps(n, idx);
      const dx = (n.x || 0) - P.x;
      const dz = (n.z || 0) - P.z;
      const dist = Math.hypot(dx, dz);
      if (dist > reach) return;

      const angleToNpc = Math.atan2(dx, dz);
      const diff = Math.atan2(Math.sin(angleToNpc - (P.face || 0)), Math.cos(angleToNpc - (P.face || 0)));
      if (Math.abs(diff) > 1.15 && dist > 2.2) return;

      const dmg = Math.max(12, Math.round((P.dmg || 20) * 0.8));
      n.hp538 = Math.max(0, n.hp538 - dmg);
      n.hostileToPlayer = true;

      const npcName = n.name || 'Cidadão';
      showSkyrimSubtitle(npcName, NPC_SURPRISE_LINES[idx % NPC_SURPRISE_LINES.length]);
      if (typeof global.floater === 'function') global.floater(n.x, n.z, `-${dmg}`, '#ff6b6b');

      const witnessed = hasWitnessesNear(n.x, n.z, n);
      const cityName = n.currentCity || 'Aster';

      if (n.isForeigner) {
        showSkyrimBanner(`${npcName} é forasteiro de ${n.homeCity} (0 recompensa em ${cityName})`);
      } else if (witnessed) {
        const bountyAdd = n.hp538 <= 0 ? 1000 : 40;
        API.bountyByCity[cityName] = (API.bountyByCity[cityName] || 0) + bountyAdd;
        if (global.profile) {
          global.profile.multa523 = (global.profile.multa523 || 0) + bountyAdd;
          global.profile.fama523 = global.profile.fama523 || { good: 0, bad: 0, thief: 0 };
          global.profile.fama523.bad += 1;
          const regKey = cityName.toLowerCase();
          if (global.profile.regions116 && global.profile.regions116[regKey]) {
            global.profile.regions116[regKey].trust = Math.max(0, (global.profile.regions116[regKey].trust || 0) - 5);
          }
        }
        showSkyrimBanner(`${bountyAdd} recompensa adicionada em ${cityName}`);
      } else {
        showSkyrimBanner(`Sem testemunhas em ${cityName} — crime não visto`);
      }

      if (n.hp538 <= 0) {
        n.dead538 = true;
        if (n.m && n.m.root) n.m.root.visible = false;
        if (typeof global.floater === 'function') global.floater(n.x, n.z, `${npcName} abatido`, '#ef4444', true);
      } else if (Array.isArray(global.enemies) && !n._spawnedDefender538) {
        n._spawnedDefender538 = true;
        setTimeout(() => {
          if (global.player && !global.player.dead && !n.dead538) {
            const dNow = Math.hypot((n.x || 0) - global.player.x, (n.z || 0) - global.player.z);
            if (dNow <= 8) {
              const retDmg = 8;
              global.player.hp = Math.max(1, (global.player.hp || 100) - retDmg);
              if (typeof global.floater === 'function') global.floater(global.player.x, global.player.z, `${npcName} revidou (-${retDmg})`, '#fb923c');
            }
          }
        }, 650);
      }
    });
  };

  // ===== Mapa 3D =====
  API.renderSkyrim3DMap = function (canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const now = performance.now() * 0.001;

    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0, '#0b192c');
    skyGrad.addColorStop(0.35, '#1b334b');
    skyGrad.addColorStop(1, '#091321');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 28; i++) {
      const wy = (i * 22 + (now * 12) % 22);
      ctx.strokeStyle = `rgba(125,185,235,${0.06 + (i % 3) * 0.03})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, wy);
      ctx.bezierCurveTo(W * 0.3, wy + Math.sin(now + i) * 6, W * 0.7, wy - Math.cos(now + i) * 6, W, wy);
      ctx.stroke();
    }

    const P = global.player || { x: 0, z: 0 };
    const gy = typeof global.terrH === 'function'
      ? global.terrH
      : (x, z) => (Math.sin(x * 0.003) * Math.cos(z * 0.003) * 42 + Math.sin(x * 0.011 + z * 0.009) * 18);

    const cols = 44, rows = 38;
    const worldSpan = 4400 / Math.max(0.5, API.map3DZoom);
    const centerX = P.x + API.map3DPanX;
    const centerZ = P.z + API.map3DPanZ;

    function project3D(wx, wz, wy) {
      const nx = (wx - centerX) / worldSpan;
      const nz = (wz - centerZ) / worldSpan;
      const tilt = 0.62;
      return {
        x: W * 0.5 + nx * (W * 0.78) * (1 - nz * 0.18),
        y: H * 0.54 + nz * (H * 0.68 * tilt) - wy * 0.42
      };
    }

    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const u0 = c / (cols - 1) - 0.5;
        const v0 = r / (rows - 1) - 0.5;
        const u1 = (c + 1) / (cols - 1) - 0.5;
        const v1 = (r + 1) / (rows - 1) - 0.5;

        const wx0 = centerX + u0 * worldSpan * 2;
        const wz0 = centerZ + v0 * worldSpan * 2;
        const wx1 = centerX + u1 * worldSpan * 2;
        const wz1 = centerZ + v1 * worldSpan * 2;

        const distCenter = Math.hypot(wx0, wz0);
        const isSea = wx0 < -3650 || distCenter > 4550;
        const h00 = isSea ? -4 : gy(wx0, wz0);
        const h10 = isSea ? -4 : gy(wx1, wz0);
        const h11 = isSea ? -4 : gy(wx1, wz1);
        const h01 = isSea ? -4 : gy(wx0, wz1);

        const p00 = project3D(wx0, wz0, h00);
        const p10 = project3D(wx1, wz0, h10);
        const p11 = project3D(wx1, wz1, h11);
        const p01 = project3D(wx0, wz1, h01);

        const slope = (h10 - h00) * 0.8 + (h01 - h00) * 0.5;
        let fill = '#2b3d34';
        if (isSea) {
          fill = 'rgba(22,58,92,.82)';
        } else if (h00 > 52 || wz0 < -2200) {
          const l = Math.min(255, Math.max(150, Math.round(215 + slope * 2)));
          fill = `rgb(${l - 12},${l - 5},${l})`;
        } else if (wx0 > 2000 && wz0 < 1200) {
          const l = Math.min(220, Math.max(110, Math.round(168 + slope * 2)));
          fill = `rgb(${l},${Math.round(l * 0.82)},${Math.round(l * 0.56)})`;
        } else if (wz0 > 2200 && Math.abs(wx0) < 1600) {
          const l = Math.min(130, Math.max(42, Math.round(74 + slope * 2)));
          fill = `rgb(${l + 18},${l},${l - 6})`;
        } else {
          const l = Math.min(165, Math.max(58, Math.round(98 + slope * 2.2)));
          fill = `rgb(${Math.round(l * 0.72)},${l},${Math.round(l * 0.78)})`;
        }

        ctx.fillStyle = fill;
        ctx.strokeStyle = isSea ? 'rgba(90,150,200,.12)' : 'rgba(15,23,34,.28)';
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(p00.x, p00.y);
        ctx.lineTo(p10.x, p10.y);
        ctx.lineTo(p11.x, p11.y);
        ctx.lineTo(p01.x, p01.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }

    for (let f = 0; f < 9; f++) {
      const fx = ((f * 137 + now * (14 + f * 2)) % (W + 260)) - 130;
      const fy = H * (0.22 + (f % 5) * 0.14) + Math.sin(now * 0.7 + f) * 14;
      const rx = 110 + (f % 3) * 45;
      const ry = 32 + (f % 2) * 16;
      const fogGrad = ctx.createRadialGradient(fx, fy, 8, fx, fy, rx);
      fogGrad.addColorStop(0, 'rgba(226,238,248,.28)');
      fogGrad.addColorStop(0.55, 'rgba(200,220,238,.14)');
      fogGrad.addColorStop(1, 'rgba(200,220,238,0)');
      ctx.fillStyle = fogGrad;
      ctx.beginPath();
      ctx.ellipse(fx, fy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    const landmarks = [
      { name: 'ASTER (Nexo)', x: 0, z: 0, col: '#ffd070', icon: '🏰' },
      { name: 'YMIRIA (Gelo)', x: 0, z: -3400, col: '#93c5fd', icon: '❄️' },
      { name: 'ZAHAR (Areias)', x: 3400, z: 0, col: '#fcd34d', icon: '☀️' },
      { name: 'THALOR (Mar)', x: -3850, z: 0, col: '#38bdf8', icon: '⚓' },
      { name: 'URDAN (Vulcão)', x: 0, z: 3400, col: '#f87171', icon: '🌋' },
      { name: 'VERDEN (Raízes)', x: 2300, z: 2300, col: '#4ade80', icon: '🌿' },
      { name: 'Estátua da Colina', x: 210, z: 360, col: '#e9d5ff', icon: '🗿' }
    ];

    landmarks.forEach(lm => {
      const h = gy(lm.x, lm.z) + 25;
      const pt = project3D(lm.x, lm.z, h);
      if (pt.x < 20 || pt.x > W - 20 || pt.y < 20 || pt.y > H - 20) return;

      const beam = ctx.createLinearGradient(pt.x, pt.y - 34, pt.x, pt.y);
      beam.addColorStop(0, 'rgba(255,255,255,0)');
      beam.addColorStop(1, lm.col);
      ctx.strokeStyle = beam;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y - 34);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();

      ctx.fillStyle = lm.col;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '700 12px "Cinzel","Chakra Petch",sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText(`${lm.icon} ${lm.name}`, pt.x, pt.y - 10);
      ctx.shadowBlur = 0;
    });

    const ph = gy(P.x, P.z) + 18;
    const pp = project3D(P.x, P.z, ph);
    ctx.fillStyle = '#38bdf8';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(pp.x, pp.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e0f2fe';
    ctx.font = '700 13px "Chakra Petch",sans-serif';
    ctx.fillText('▲ VOCÊ', pp.x, pp.y - 13);

    ctx.fillStyle = 'rgba(8,12,20,.78)';
    ctx.fillRect(12, 12, W - 24, 38);
    ctx.strokeStyle = 'rgba(255,208,112,.45)';
    ctx.strokeRect(12, 12, W - 24, 38);
    ctx.fillStyle = '#ffd070';
    ctx.font = '700 14px "Cinzel","Chakra Petch",sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('MAPA 3D DAS TERRAS DESPERTAS (RELEVO, MAR E NÉVOA — SKYRIM)', 24, 35);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 12px "Chakra Petch",sans-serif';
    ctx.fillText('300 Missões Fixas + Motor Infinito Ativo', W - 24, 35);
    ctx.textAlign = 'left';
  };

  // ===== Painel K =====
  API.openSkillTreeModal = function () {
    if (typeof global.openModal !== 'function') return;

    const fixedCount = (global.RadiantPrimeva && Array.isArray(global.RadiantPrimeva.FIXED_300_QUESTS))
      ? global.RadiantPrimeva.FIXED_300_QUESTS.length : 300;
    const board = (global.RadiantPrimeva && typeof global.RadiantPrimeva.generateBoard === 'function')
      ? (global.RadiantPrimeva.active.length ? global.RadiantPrimeva.active : global.RadiantPrimeva.generateBoard())
      : [];

    let h = `<div class="sec">PROGRESSÃO LIVRE ESTILO SKYRIM (SEM CLASSE INICIAL FIXA — APENAS 2º DESPERTAR)</div>`;
    h += `<div class="card" style="margin-bottom:10px;line-height:1.5">Você evolui <b>usando qualquer arma ou magia</b> (role a rodinha do mouse ou aperte <b>1, 2, 3, 4</b>). As <b>10 Classes Secretas do Segundo Despertar</b> continuam como conquistas lendárias das Fendas Vermelhas.</div>`;

    h += `<div class="grid2" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;margin-bottom:12px">`;
    Object.keys(API.skillTree).forEach(k => {
      const br = API.skillTree[k];
      h += `<div class="card" style="padding:10px;border:1px solid rgba(255,208,112,.28)"><div style="font-weight:700;color:#ffd070">${br.name} · Nível ${br.level}</div><div style="font-size:12px;color:#cbd5e1;margin:4px 0">${br.bonus}</div><div style="font-size:11px;color:#94a3b8">Progresso: ${br.xp} / ${br.level * 20} XP</div></div>`;
    });
    h += `</div>`;

    h += `<div class="sec">MAGIAS DESCOBERTAS NO MUNDO & LUZ DE DUMBLEDORE (TECLA H)</div>`;
    h += `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:8px;margin-bottom:12px">`;
    WORLD_SPELLS.forEach(sp => {
      const known = API.discoveredSpells.includes(sp.id);
      h += `<div class="card" style="padding:10px;border:1px solid ${known ? '#38bdf8' : 'rgba(255,255,255,.12)'}"><div style="font-weight:700;color:${known ? '#38bdf8' : '#94a3b8'}">${known ? '✨ ' : '🔒 '}${sp.name}</div><div style="font-size:11px;color:#ffd070">${sp.costText} · Local: ${sp.location}</div><div style="font-size:12px;color:#cbd5e1;margin-top:4px">${sp.desc}</div></div>`;
    });
    h += `</div>`;

    const riftFixed = (global.RadiantPrimeva && typeof global.RadiantPrimeva.getFixedRiftQuests === 'function')
      ? global.RadiantPrimeva.getFixedRiftQuests() : [];
    const activeRiftQ = (global.RadiantPrimeva && global.RadiantPrimeva.activeRiftQuest)
      ? global.RadiantPrimeva.activeRiftQuest
      : (global.RadiantPrimeva && typeof global.RadiantPrimeva.generateRiftQuest === 'function' ? global.RadiantPrimeva.generateRiftQuest() : null);

    h += `<div class="sec">🌀 MISSÃO ATIVA DENTRO DE FENDA / PORTAL (${riftFixed.length} FIXAS DE FENDA + MOTOR DE PORTAL)</div>`;
    if (activeRiftQ) {
      h += `<div class="card" style="padding:12px;margin-bottom:12px;border:1px solid #a855f7;background:rgba(46,16,101,.35)"><div style="font-weight:700;color:#e9d5ff;font-size:14px">${activeRiftQ.title} <span style="color:#ffd070">(${activeRiftQ.rewardGold} ouro)</span></div><div style="font-size:12px;color:#cbd5e1;margin:6px 0">${activeRiftQ.description}</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="mini" onclick="window.SkyrimOverhaul538.resolveRiftChoice(0)" style="border-color:#a855f7;color:#f3e8ff">Escolher A: ${activeRiftQ.choices[0].label}</button><button class="mini" onclick="window.SkyrimOverhaul538.resolveRiftChoice(1)" style="border-color:#ffd070;color:#fef08a">Escolher B: ${activeRiftQ.choices[1].label}</button></div></div>`;
    }

    h += `<div class="sec">CRÔNICAS DAS TERRAS DESPERTAS (${fixedCount} MISSÕES FIXAS + ${riftFixed.length} DENTRO DE FENDAS)</div>`;
    board.forEach(q => {
      h += `<div class="card" style="padding:10px;margin-bottom:8px;border-left:3px solid #ffd070"><div style="font-weight:700;color:#fff7e0">${q.title} <span style="color:#ffd070;font-size:12px">(${q.regionName} · ${q.rewardGold} ouro)</span></div><div style="font-size:11px;color:#93c5fd;margin:2px 0">Gatilho: ${q.trigger}</div><div style="font-size:12px;color:#cbd5e1;margin:4px 0">${q.description}</div></div>`;
    });

    global.openModal('ÁRVORE SKYRIM, LUZ & 300 MISSÕES', h);
  };

  API.resolveRiftChoice = function (choiceIdx) {
    const rq = global.RadiantPrimeva && global.RadiantPrimeva.activeRiftQuest;
    if (!rq || !rq.choices || !rq.choices[choiceIdx]) return;
    const ch = rq.choices[choiceIdx];
    if (typeof ch.run === 'function') ch.run();
    showSkyrimBanner(`Fenda Concluída: ${ch.effect}`);
    if (global.RadiantPrimeva && typeof global.RadiantPrimeva.generateRiftQuest === 'function') {
      global.RadiantPrimeva.generateRiftQuest();
    }
    if (typeof global.closeModal === 'function') global.closeModal();
  };

  // ===== Hooks =====
  function installHooks() {
    injectStylesAndHUD();

    if (global.profile) global.profile.classless = true;

    if (global.RadiantPrimeva && global.Quests480 && global.Quests480.CATALOG) {
      (global.RadiantPrimeva.FIXED_300_QUESTS || []).forEach(q => { global.Quests480.CATALOG[q.id] = q; });
      global.RadiantPrimeva.generateBoard().forEach(q => { global.Quests480.CATALOG[q.id] = q; });
    }

    if (typeof window !== 'undefined' && !window._skyrim538WheelBound) {
      window._skyrim538WheelBound = true;
      window.addEventListener('wheel', e => {
        if (global.paused || global.modalOpen) return;
        API.selectQuickSlot(API.activeSlot + (e.deltaY > 0 ? 1 : -1));
      }, { passive: true });

      window.addEventListener('keydown', e => {
        if (global.modalOpen && e.code !== 'Escape') return;
        if (e.code === 'Digit1') API.selectQuickSlot(0);
        else if (e.code === 'Digit2') API.selectQuickSlot(1);
        else if (e.code === 'Digit3') API.selectQuickSlot(2);
        else if (e.code === 'Digit4') API.selectQuickSlot(3);
        else if (e.code === 'KeyV' && !e.ctrlKey && !e.altKey) API.toggleFirstPerson();
        else if (e.code === 'KeyH' && !e.ctrlKey && !e.altKey) API.useDeluminator();
        else if (e.code === 'KeyK' && !e.ctrlKey && !e.altKey) API.openSkillTreeModal();
      });
    }

    if (typeof global.camUpdate === 'function' && !global.camUpdate._skyrim538Wrapped) {
      const origCamUpdate = global.camUpdate;
      const wrappedCam = function (dt) {
        const res = origCamUpdate.apply(this, arguments);
        try {
          const P = global.player;
          if (P && API.firstPerson && global.camera && !global.CINE231) {
            if (P.m && P.m.root) P.m.root.visible = false;
            const eyeY = (typeof global.terrH === 'function' ? global.terrH(P.x, P.z) : 0) + (P.jy || 0) + 1.68;
            global.camera.position.set(P.x, eyeY, P.z);
            const [vx, vz] = typeof global.camRot === 'function'
              ? global.camRot(0, -Math.cos(global.pcCam ? global.pcCam.pitch : 0))
              : [0, -1];
            const pitch = global.pcCam ? global.pcCam.pitch : 0;
            global.camera.lookAt(P.x + vx, eyeY - Math.sin(pitch), P.z + vz);
          } else if (P && !API.firstPerson && P.m && P.m.root) {
            P.m.root.visible = true;
          }
          renderFirstPersonHands(performance.now() * 0.001);
        } catch (_) {}
        return res;
      };
      wrappedCam._skyrim538Wrapped = true;
      global.camUpdate = wrappedCam;
    }

    if (typeof global.update === 'function' && !global.update._skyrim538Wrapped) {
      const origUpdate = global.update;
      const wrappedUpdate = function (dt) {
        const res = origUpdate.apply(this, arguments);
        try {
          tickManaDrainAndSkills(dt || 0.016);
          const P = global.player;
          if (P && !P.dead) {
            WORLD_SPELLS.forEach(sp => {
              if (!API.discoveredSpells.includes(sp.id) && Math.hypot(P.x - sp.x, P.z - sp.z) < 18) {
                API.discoveredSpells.push(sp.id);
                showSkyrimBanner(`Nova Magia Descoberta: ${sp.name}!`);
              }
            });
          }
        } catch (_) {}
        return res;
      };
      wrappedUpdate._skyrim538Wrapped = true;
      global.update = wrappedUpdate;
    }

    if (typeof global.attack === 'function' && !global.attack._skyrim538Wrapped) {
      const origAttack = global.attack;
      const wrappedAttack = function () {
        const res = origAttack.apply(this, arguments);
        try { API.checkNpcHitFromAttack(); } catch (_) {}
        return res;
      };
      wrappedAttack._skyrim538Wrapped = true;
      global.attack = wrappedAttack;
    }

    if (typeof global.enterGate === 'function' && !global.enterGate._skyrim538Wrapped) {
      const origEnterGate = global.enterGate;
      const wrappedEnterGate = function (g) {
        const res = origEnterGate.apply(this, arguments);
        try {
          if (global.RadiantPrimeva && typeof global.RadiantPrimeva.generateRiftQuest === 'function') {
            const rq = global.RadiantPrimeva.generateRiftQuest(g);
            if (rq) {
              setTimeout(() => {
                showSkyrimBanner(rq.title);
                showSkyrimSubtitle('Eco da Fenda', rq.description);
              }, 900);
            }
          }
        } catch (_) {}
        return res;
      };
      wrappedEnterGate._skyrim538Wrapped = true;
      global.enterGate = wrappedEnterGate;
    }

    if (typeof global.drawMap === 'function' && !global.drawMap._skyrim538Wrapped) {
      const origDrawMap = global.drawMap;
      const wrappedDrawMap = function (ctx, S, full) {
        if (full && API.map3DActive && ctx && ctx.canvas) {
          API.renderSkyrim3DMap(ctx.canvas);
          return;
        }
        return origDrawMap.apply(this, arguments);
      };
      wrappedDrawMap._skyrim538Wrapped = true;
      global.drawMap = wrappedDrawMap;
    }
  }

  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', installHooks);
    } else {
      setTimeout(installHooks, 50);
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
