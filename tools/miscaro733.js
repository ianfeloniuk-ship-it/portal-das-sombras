/* Missão fixa #30 «Alvo Notório: Velha Míscaro» (v733). Facção Vanguarda da Muralha. Gatilho (simplificado): concluir a #29 (contrato de Alvo Notório Rank D).
   Velha Míscaro (Rei Cogumelo, 3× vida) na Floresta Sombria ao sul de Aster (0, 230), a ~230 m da muralha, solta uma nuvem de esporos soníferos.
   Escolha: queimar os 4 anéis de micélio [E] antes do combate (corta a nuvem) ou lutar com a nuvem ativa: a menos de 16 m dela, a cada 8 s você adormece por 1 s
   (nesse caso você preserva os esporos raros: marca esporosRaros730; o jogo ainda não tem poção de Vontade para contrapor).
   Nos dois casos: título «Caçador da Velha Míscaro» (profile.titulo730, marca de +3% de vida máxima) e +150 de Reputação da Ordem.
   Estado em profile.fixas545.q030.
   Simplificações: os anéis queimam só com E (sem item de fogo); a nuvem é um atordoamento curto (stunT), sem efeito visual; o +3% de vida é marca (profile.bonusVida730);
   as poções de Vontade não são exigidas; sem cocheiros. */
(function () {
  'use strict';
  let world = null, worldT = 0, rei = null, rings = [], busy = false, lastSave = 0, cloudT = 8;
  function S() { if (!profile) return null; profile.fixas545 = profile.fixas545 || {}; return profile.fixas545.q030 = profile.fixas545.q030 || {}; }
  function save() { try { store.set('pds2_profile', profile); } catch (_) {} try { if (typeof saveRun === 'function') saveRun(); } catch (_) {} }
  const SPOT = { x: 0, z: 230 };
  const q29 = () => profile && profile.fixas545 && profile.fixas545.q029;
  const phase = () => { const s = profile && profile.fixas545 && profile.fixas545.q030; return s && !s.done ? s.phase || null : null; };
  const active = () => !!phase();
  const dS = () => Math.hypot(player.x - SPOT.x, player.z - SPOT.z);
  if (typeof LORE !== 'undefined') {
    LORE.q030_aneis = ['Velha Míscaro', 'Você queimou os quatro anéis de micélio e cortou a nuvem de sono antes de enfrentar a Velha Míscaro, na Floresta Sombria. Título: Caçador da Velha Míscaro (+3% de vida máxima) e +150 de Reputação da Ordem.'];
    LORE.q030_esporos = ['Velha Míscaro', 'Você enfrentou a Velha Míscaro com a nuvem de esporos ativa, resistindo ao sono, e preservou os esporos raros. Título: Caçador da Velha Míscaro (+3% de vida máxima) e +150 de Reputação da Ordem.'];
  }
  function begin() {
    const s = S(); if (s.phase || s.done) return;
    s.phase = 'rota'; save();
    try { toast('<b>[MISSÃO]</b> Alvo Notório, Velha Míscaro: um fungo gigante espalha esporos soníferos pela estrada florestal ao sul de Aster e os cocheiros dormem ao volante. Vá à Floresta Sombria.', 10000); } catch (_) {}
  }
  function foe(kind, name, x, z) {
    let e = null;
    for (let i = 0; i < 8; i++) { e = spawnKind(kind, x, z, Math.min(9, rankOf()), { wild: true }); if (e.kind === kind) break; e.gone = e.dead = true; try { const ix = enemies.indexOf(e); if (ix >= 0) enemies.splice(ix, 1); scene.remove(e.m.root); } catch (_) {} }
    e.siege = true; e.name = e.short = name; return e;
  }
  function addInter(label, x, z, fn) { const i = { x, z, r: 3.5, label, use: fn }; L.inter.push(i); return i; }
  function rmInter(i) { if (i && L.inter) L.inter = L.inter.filter(k => k !== i); }
  function mkRings() {
    for (const r of rings) { rmInter(r.inter); try { scene.remove(r.m); } catch (_) {} }
    rings = [[-12, 0], [12, 0], [0, -12], [0, 12]].map(([dx, dz]) => {
      const x = SPOT.x + dx, z = SPOT.z + dz, m = new THREE.Mesh(new THREE.TorusGeometry(2.2, .25, 6, 20), new THREE.MeshStandardMaterial({ color: 0x8a5ac0, emissive: 0x6a2aa0, emissiveIntensity: .7 }));
      m.rotation.x = Math.PI / 2; m.position.set(x, terrH(x, z) + .3, z); m.userData.terrainAbsolute245 = true; scene.add(m);
      const r = { x, z, m, burned: false, inter: null }; r.inter = addInter('E · QUEIMAR O ANEL DE MICÉLIO', x, z, () => burn(r)); return r;
    });
  }
  function burn(r) {
    const s = S(); if (r.burned || s.phase !== 'floresta') return; r.burned = true; rmInter(r.inter); r.inter = null;
    try { r.m.material.color.setHex(0x303030); r.m.material.emissiveIntensity = 0; } catch (_) {} try { fxBurst(r.x, 1, r.z, 0xff7a20, 16, 3); } catch (_) {}
    s.aneis = rings.filter(k => k.burned).length; save();
    try { toast(s.aneis >= 4 ? 'Os 4 anéis queimaram: a nuvem de sono se desfaz.' : 'Anel de micélio queimado (' + s.aneis + ' de 4).', 4000); } catch (_) {}
  }
  function spawnRei() {
    try { rei = foe('reicogu', 'Velha Míscaro', SPOT.x, SPOT.z); rei.hp = rei.maxhp = Math.round(rei.maxhp * 3); rei.aggro = false; rei.misc733 = true; rei.hpIni733 = rei.hp; } catch (_) { rei = null; }
  }
  function startFloresta() {
    const s = S(); s.phase = 'floresta'; save(); mkRings(); spawnRei();
    try { toast('<b>[FLORESTA SOMBRIA]</b> A Velha Míscaro cobre a clareira de esporos. Queime os 4 anéis de micélio [E] antes do combate para cortar a nuvem, ou lute com ela ativa.', 11000); } catch (_) {}
  }
  function finish() {
    const s = S(); s.done = true; s.phase = 'fim'; s.t = Date.now(); for (const r of rings) rmInter(r.inter);
    const n = rings.filter(r => r.burned).length; s.aneis = n;
    if (n >= 4) { s.escolha = 'aneis'; try { unlockLore('q030_aneis'); } catch (_) {} } else { s.escolha = 'esporos'; s.esporosRaros730 = true; profile.esporosRaros730 = true; try { unlockLore('q030_esporos'); } catch (_) {} }
    profile.titulo730 = 'Caçador da Velha Míscaro'; profile.bonusVida730 = .03;
    try { addOrderRep(150, 'Velha Míscaro'); } catch (_) {}
    try { toast('<b>[TÍTULO]</b> Caçador da Velha Míscaro (+3% de vida máxima) e <b>+150 de Reputação da Ordem</b>.' + (s.esporosRaros730 ? ' Esporos raros preservados.' : ''), 11000); } catch (_) {}
    save();
  }
  function objective() {
    const ph = phase(); if (!ph) return null; let text, target = SPOT;
    if (ph === 'rota') text = 'Vá à Floresta Sombria, ao sul de Aster, onde os cocheiros adormecem';
    else { text = 'Queime os anéis de micélio [E] (' + rings.filter(r => r.burned).length + ' de 4) e derrube a Velha Míscaro'; if (rei && !rei.dead) target = { x: rei.x, z: rei.z }; }
    return { actTitle: 'ALVO NOTÓRIO: VELHA MÍSCARO', step: ph === 'rota' ? 2 : 3, totalSteps: 4, text, target };
  }
  function tick(dt) {
    if (typeof player === 'undefined' || !player || typeof L === 'undefined' || !profile || L.mode !== 'world') return;
    if (world !== L) { world = L; worldT = performance.now(); rei = null; rings = []; }
    if (performance.now() - worldT < 3500) return;
    const s = S(); if (!s || s.done) return;
    const free = !busy && !(window.Intro401 && Intro401.conversation) && !(typeof paused !== 'undefined' && paused) && !player.dead;
    if (!s.phase) { if (q29() && q29().done && free) begin(); return; }
    if (s.phase === 'rota' && free && dS() < 50) startFloresta();
    if (s.phase === 'floresta') {
      if (!rings.length && free) mkRings();
      if (rei && !rei.dead && !rei.gone) {
        const pd = Math.hypot(rei.x - player.x, rei.z - player.z);
        if (!rei.aggro && (rei.hp < rei.hpIni733 || pd < 14)) rei.aggro = true;
        if (pd < 16 && rings.filter(r => r.burned).length < 4 && free) { cloudT -= dt; if (cloudT <= 0) { cloudT = 8; try { player.stunT = Math.max(player.stunT || 0, 1); } catch (_) {} try { toast('Os esporos o fazem adormecer por um instante.', 2500); } catch (_) {} } }
      } else if (rei && rei.dead) finish();
      else if (rei && rei.gone && free) rei = null;
      if (!rei && free && dS() < 55) spawnRei();
    }
    if (performance.now() - lastSave > 4000) { lastSave = performance.now(); save(); }
  }
  const pu = update;
  update = function (dt) { pu.apply(this, arguments); try { tick(Math.min(.1, dt || .016)); if (window.Fixas545 && !Fixas545.LIVE.primeva_q030) Fixas545.LIVE.primeva_q030 = 'v733'; } catch (e) { console.warn('Miscaro733', e); } };
  window.Miscaro730 = { state: S, active, objective, begin, get rei() { return rei; }, get rings() { return rings; } };
})();
