/* v545 (Ian, 22/10/2026, áudio): «pode ter fantasmas que nem no Skyrim, as pessoas vivas com VFX».
   À noite, perto das cidades, aparece de vez em quando uma alma: o corpo de um morador (Povo482) feito de luz azul
   translúcida, com borda acesa (fresnel), faixas que sobem, tremulação, fiapos de luz subindo e um brilho no chão.
   Ela flutua devagar pela cidade e fala pelo diálogo de sempre (Dialogo520.custom + visual da conversa539).
   Ouvir quem ela era e o que deixou sem terminar libera «Descanse em paz»: ela se desfaz em luz e você ganha
   2 de reputação da Ordem. Cada alma descansa uma vez só (profile.almas545). De manhã as que sobraram somem.
   Desempenho: no máximo 1 alma por vez, 24 fiapos, sem luz nova na cena (não recompila os outros materiais). */
(function (global) {
  'use strict';
  const T = global.THREE; if (!T) return;
  const ALMAS = [
    { nome: 'Edwyn', sex: 'm', quem: 'Eu guardava este portão quando a Fenda abriu lá fora. Fiquei no meu posto e nunca consegui sair.', falta: 'Meu filho acha que eu fugi. Só queria que alguém soubesse que eu fiquei no portão.', paz: 'Você sabe que eu fiquei. Obrigado, agora posso sair do posto.' },
    { nome: 'Maren', sex: 'f', quem: 'Eu vendia flores na praça. As crianças me chamavam de dona Maren.', falta: 'Plantei um jardim atrás da muralha e nunca vi florir. Deve estar cheio de mato agora.', paz: 'Se florir um dia, pense em mim. Adeus, viajante.' },
    { nome: 'Tobias', sex: 'm', quem: 'Eu era caçador rank D e achava que dava conta de tudo. A Fenda me provou o contrário.', falta: 'Entrei para provar que não precisava de ninguém. Nunca cometa esse erro.', paz: 'Você me ouviu, então valeu alguma coisa. Agora vou descansar.' },
    { nome: 'Ilsa', sex: 'f', quem: 'Eu cuidava dos doentes no tempo da febre. Salvei muita gente, mas não consegui me salvar.', falta: 'Ninguém acendeu uma vela por mim. Só queria que alguém soubesse meu nome.', paz: 'Você ouviu meu nome: Ilsa. Era tudo que eu precisava.' },
    { nome: 'Corvin', sex: 'm', quem: 'Eu era o ferreiro mais teimoso da região. Forjei minha última espada na noite em que caí.', falta: 'A espada nunca ganhou nome. Uma lâmina sem nome não descansa, e o ferreiro também não.', paz: 'Vou chamar a espada de Aurora. Agora a lâmina e eu podemos descansar.' },
    { nome: 'Lis', sex: 'f', quem: 'Eu cantava na taverna. Dizem que ainda dá para me ouvir quando chove.', falta: 'Fiquei devendo uma canção para alguém que nunca voltou da estrada. Talvez eu cante para você.', paz: 'Esta é para você. Lembre dela quando chover.' },
    { nome: 'Hagen', sex: 'm', quem: 'Fui mercador por trinta anos sem sofrer um assalto. Morri de velho, acredita?', falta: 'Escondi um pouco de ouro e esqueci onde. Agora tanto faz, mas é estranho não lembrar.', paz: 'Lembrei: era embaixo da escada. Fique bem, viajante.' },
    { nome: 'Nessa', sex: 'f', quem: 'Eu era aprendiz da Ordem. Ia fazer minha prova de rank na manhã seguinte.', falta: 'Nunca soube se eu teria passado. Será que eu teria passado?', paz: 'Você me ouviu como alguém da Ordem ouviria. Obrigada por me dar essa chance.' }
  ];
  const AB = ['Você... consegue me ver?', 'Não tenha medo. Não vou machucar você.', 'Faz tanto tempo que ninguém para para falar comigo.', 'Está frio aqui. Sempre está frio.'];
  let alma = null, last = 0, raf = 0, prev = 0;
  const almaMaterials = new Set();
  const U = { t: { value: 0 }, a: { value: 1 } };
  const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
  const ready = () => typeof L !== 'undefined' && L && L.mode === 'world' && typeof player !== 'undefined' && player && !player.dead
    && typeof npcs !== 'undefined' && typeof makeChibi === 'function' && typeof scene !== 'undefined' && typeof chunks !== 'undefined';
  const night = () => typeof isNight === 'function' && isNight();
  const done = () => { if (typeof profile === 'undefined' || !profile) return {}; return profile.almas545 = profile.almas545 || {}; };

  /* material de alma: azul translúcido, aditivo, borda acesa, faixas que sobem e tremulação */
  function ghostMat(src) {
    const mt = new T.MeshPhongMaterial({ color: 0x000000, transparent: true, depthWrite: false, blending: T.AdditiveBlending });
    mt.skinning = !!(src && src.skinning); mt.morphTargets = !!(src && src.morphTargets);
    mt.onBeforeCompile = sh => {
      sh.uniforms.gT545 = U.t; sh.uniforms.gA545 = U.a;
      sh.vertexShader = 'varying float vY545;\n' + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\n vY545 = (modelMatrix * vec4(transformed, 1.0)).y;');
      sh.fragmentShader = 'uniform float gT545; uniform float gA545; varying float vY545;\n' + sh.fragmentShader.replace('#include <dithering_fragment>',
        `#include <dithering_fragment>
 float fr545 = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 1.7);
 float band545 = 0.65 + 0.35 * sin(vY545 * 10.0 - gT545 * 3.2);
 float flick545 = 0.82 + 0.18 * sin(gT545 * 7.3) * sin(gT545 * 2.9 + 1.3);
 vec3 c545 = mix(vec3(0.16, 0.42, 0.95), vec3(0.75, 0.95, 1.0), fr545);
 gl_FragColor = vec4(c545 * (0.22 + fr545 * 1.5) * band545 * flick545 * gA545, 1.0);`);
    };
    mt.customProgramCacheKey = () => 'alma545-' + mt.skinning;
    mt.userData.g545 = 1; return mt;
  }
  function ghostify(root) {
    root.traverse(o => {
      if (!o.isMesh || !o.material) return;
      const arr = Array.isArray(o.material) ? o.material : [o.material];
      if (arr.every(x => x.userData && x.userData.g545)) return;
      const nm = arr.map(x => { if (x.userData && x.userData.g545) return x;
        const mt = ghostMat(x); almaMaterials.add(mt); return mt; });
      o.material = Array.isArray(o.material) ? nm : nm[0]; o.castShadow = false; o.renderOrder = 6;
    });
  }

  /* fiapos de luz que sobem + brilho no chão */
  function glowTex() {
    const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, 'rgba(190,235,255,1)'); r.addColorStop(.35, 'rgba(90,170,255,.55)'); r.addColorStop(1, 'rgba(40,90,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, 64, 64); const t = new T.CanvasTexture(c); return t;
  }
  let TEX = null;
  function makeFx() {
    TEX = TEX || glowTex();
    const N = 24, pos = new Float32Array(N * 3), seed = [];
    for (let i = 0; i < N; i++) seed.push({ a: Math.random() * 6.28, r: .2 + Math.random() * .45, s: .35 + Math.random() * .5, o: Math.random() });
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3));
    const pts = new T.Points(g, new T.PointsMaterial({ size: .22, map: TEX, transparent: true, depthWrite: false, blending: T.AdditiveBlending, color: 0x9fd8ff }));
    g.boundingSphere = new T.Sphere(new T.Vector3(0, 1.25, 0), 1.7);
    const disc = new T.Mesh(new T.PlaneGeometry(2.6, 2.6), new T.MeshBasicMaterial({ map: TEX, transparent: true, depthWrite: false, blending: T.AdditiveBlending, color: 0x5a9cff, opacity: .55 }));
    disc.rotation.x = -Math.PI / 2; disc.position.y = .04;
    const grp = new T.Group(); grp.add(pts); grp.add(disc); scene.add(grp);
    return { grp, pts, disc, seed };
  }
  function updFx(fx, n, t) {
    fx.grp.position.set(n.x, 0, n.z);
    const p = fx.pts.geometry.attributes.position;
    fx.seed.forEach((s, i) => { const k = (t * s.s * .35 + s.o) % 1, a = s.a + t * .6; p.setXYZ(i, Math.cos(a) * s.r * (1 - k * .4), .1 + k * 2.3, Math.sin(a) * s.r * (1 - k * .4)); });
    p.needsUpdate = true;
    fx.pts.material.opacity = U.a.value * .9; fx.disc.material.opacity = U.a.value * (.4 + .15 * Math.sin(t * 2.1));
  }

  function spawn(c) {
    const D = done(), livres = ALMAS.filter(a => !D[a.nome]); if (!livres.length) return;
    const A = livres[Math.floor(Math.random() * livres.length)];
    const ang = Math.random() * 6.28, r = 14 + Math.random() * 10, x = c.x + Math.cos(ang) * r, z = c.z + Math.sin(ang) * r;
    const m = makeChibi({ body: 0x8fd0ff, hair: 0xdff4ff, wep: 'none', gk: A.sex === 'f' ? 'Mage' : 'Knight', tint: 0xffffff, scale: .9 });
    m.root.position.set(x, 0, z); scene.add(m.root);
    const n = { kind: 'emergent', alma545: A, home: c, m, x, z, face: 0, r: .45, t: Math.random() * 9, tx: x, tz: z, wait: 0, path: [], col: '#9fd8ff',
      name: A.nome, short: A.nome, job523: 'Alma perdida', label: 'F · FALAR COM A ALMA DE ' + A.nome.toUpperCase(), ax: x, az: z, wx: x, wz: z };
    n.use = () => falar(n);
    npcs.push(n);
    try { if (global.Povo482 && Povo482.register) Povo482.register(n, { role: 'civil', sex: A.sex, seed: (A.nome.length * 7919 + 13) >>> 0, region: Povo482.regionOf ? Povo482.regionOf(c) : null, priority: true }); } catch (_) {}
    ghostify(m.root);
    alma = { n, fx: makeFx(), fade: 0, out: false, root: m.root }; prev = 0;
    U.a.value = 0;
    if (typeof floater === 'function') floater(x, z, '...', '#9fd8ff');
  }
  function drop() {
    if (!alma) return;
    const { n, fx } = alma; n.gone = true;
    try { scene.remove(n.m.root); } catch (_) {}
    try { scene.remove(fx.grp); fx.pts.geometry.dispose(); fx.pts.material.dispose(); fx.disc.geometry.dispose(); fx.disc.material.dispose(); } catch (_) {}
    for (const mt of almaMaterials) mt.dispose(); almaMaterials.clear();
    const i = npcs.indexOf(n); if (i >= 0) npcs.splice(i, 1);
    alma = null; prev = 0;
  }
  function sumir(paz) {
    if (!alma) return; alma.out = true;
    if (paz) { try { if (typeof fxBurst === 'function') fxBurst(alma.n.x, 1.2, alma.n.z, 0x9fd8ff, 40, 4); if (typeof fxRing === 'function') fxRing(alma.n.x, alma.n.z, 0x9fd8ff, 4, .9); } catch (_) {} }
  }

  function falar(n) {
    if (n.gone || done()[n.alma545.nome] || (alma && alma.out) || !global.Dialogo520 || !Dialogo520.custom) return;
    const A = n.alma545, f = (profile.almas545f = profile.almas545f || {}), k = f[A.nome] = f[A.nome] || {};
    const build = () => ({
      raiz: { t: k.quem && k.falta ? 'Você voltou. Ainda está me ouvindo?' : AB[A.nome.length % AB.length], o: [
        { l: '● Quem é você?', go: 'quem' },
        { l: '● Por que ainda está aqui?', go: 'falta' },
        { l: '◆ "Descanse em paz. Eu ouvi você."', if: () => k.quem && k.falta, go: 'paz' },
        { l: 'Afastar-se devagar', fn: () => 'fim' }] },
      quem: { t: A.quem, o: [{ l: 'Sinto muito', fn: () => { k.quem = 1; return 'raiz'; } }] },
      falta: { t: A.falta, o: [{ l: 'Eu entendo', fn: () => { k.falta = 1; return 'raiz'; } }] },
      paz: { t: A.paz, o: [{ l: 'Adeus, ' + A.nome, fn: () => {
        if (done()[A.nome]) return 'fim'; done()[A.nome] = 1; sumir(true);
        if (typeof addOrderRep === 'function') addOrderRep(2, 'Ajudou uma alma a descansar');
        try { if (typeof store !== 'undefined' && store.set) store.set('pds2_profile', profile); } catch (_) {}
        return 'fim'; } }] }
    });
    Dialogo520.custom({ name: A.nome, title: A.nome, type: 'alma:' + A.nome }, n, build);
  }

  function frame(now) {
    raf = 0;
    if (!alma) return;
    const t = now / 1000, n = alma.n, dt = Math.min(.1, prev ? t - prev : 1 / 60); prev = t; U.t.value = t;
    const talking = document.body.classList.contains('dlg520');
    alma.fade = Math.max(0, Math.min(1, alma.fade + (alma.out ? -.75 : .6) * dt));
    U.a.value = alma.fade;
    if (alma.out && alma.fade <= 0) { drop(); return; }
    /* flutua devagar entre pontos perto de onde apareceu (para quando você conversa) */
    if (!talking && !alma.out) {
      const dx = n.wx - n.x, dz = n.wz - n.z, d = Math.hypot(dx, dz);
      if (d < .4) { const a = Math.random() * 6.28, r = Math.random() * 7; n.wx = n.ax + Math.cos(a) * r; n.wz = n.az + Math.sin(a) * r; }
      else { const s = Math.min(d, .9 * dt); n.x += dx / d * s; n.z += dz / d * s; }
    }
    if (alma.root !== n.m.root) { ghostify(n.m.root); alma.root = n.m.root; }
    /* alma não se assusta com monstros nem faz gestos de morador: fica de pé, parada, flutuando */
    if (n.m.povo482) { const C = n.m.civ486 || (n.m.civ486 = {}); C.fear = false; C.chk = 9; C.t = 9; C.n = 'standing_relax'; }
    updFx(alma.fx, n, t);
    raf = requestAnimationFrame(frame);
  }
  function tick() {
    try {
      if (alma && (alma.n.gone || !ready() || dist(player, alma.n) > 170)) { drop(); }
      if (alma && !night() && !alma.out) sumir(false);
      if (alma && !raf) raf = requestAnimationFrame(frame);
      if (alma || !ready() || !night()) return;
      const now = performance.now(); if (now - last < 25000) return; last = now;
      if (Math.random() > .45) return;
      for (const ch of chunks.values()) {
        const c = ch.city; if (!c || (typeof cityFallen === 'function' && cityFallen(c)) || dist(player, c) > 90) continue;
        spawn(c); if (alma && !raf) raf = requestAnimationFrame(frame); break;
      }
    } catch (e) { console.warn('Almas545', e); }
  }
  const npcUpdate = updNpc;
  updNpc = function(n, dt) {
    if (!n.alma545) return npcUpdate.apply(this, arguments);
    n.t = (n.t || 0) + dt;
    if (n.m.povo482) { const C = n.m.civ486 || (n.m.civ486 = {}); C.fear = false; C.chk = 9; C.t = 9; C.n = 'standing_relax'; }
    animChibi(n.m, { move: 0, atk: 0, dead: 0, wind: 0 }, n.t);
    /* terrain245 soma o relevo no shader: aqui vai só a altura de flutuação. */
    n.m.root.position.set(n.x, .18 + Math.sin(n.t * 1.4) * .06, n.z);
    n.m.root.rotation.y = n.face;
  };
  setInterval(tick, 2000);
  global.Almas545 = { spawn: c => { last = 0; if (alma) drop(); spawn(c); if (!raf) raf = requestAnimationFrame(frame); return alma && alma.n; }, get: () => alma, ALMAS };
})(typeof window !== 'undefined' ? window : globalThis);
