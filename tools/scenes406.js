/* v406: physical evidence for Acts II/III. Campaign327 owns progress and saves. */
(function () {
  'use strict';
  const API = {}, owned = new WeakMap();
  let reader = null;
  const height = (x, z) => typeof terrH === 'function' ? terrH(x, z) : 0;
  // Scenic adaptation of historia-campanha.js book.act_02, paragraphs 6/8,
  // and book.act_03 paragraph 6. These are not pre-existing transcriptions.
  const DOCUMENTS = {
    a2: [
      'Comecei estas páginas com as entregas. Depois vieram os relatos de desaparecimentos em estradas onde ainda não havia portais grandes.',
      'Desenhei a inscrição que vi numa ruína. Um viajante descreveu a mesma inscrição, num lugar semelhante, com uma data anterior ao nascimento de quem a descreveu. As marcas se repetem; as datas não concordam.',
      'Devolvam estes registros à Ordem. — Aldric'
    ],
    a3: [
      'Um arco tem cinco pequenas marcas ao redor e um sinal central, afastado delas.',
      'Sob a pedra, outra inscrição foi parcialmente apagada. A camada inferior é muito mais antiga do que as anotações sobre a crise atual.',
      'A cópia registra os traços visíveis. A inscrição inferior continua incompleta.'
    ]
  };
  const fill = text => String(text).replace(/\{nome\}/g, profile.name || 'Viajante');
  function keep(w, value) { owned.get(w).add(value); return value; }
  function material(w, color, emissive = 0) {
    return keep(w, new THREE.MeshStandardMaterial({ color, roughness: .93, metalness: .05, emissive }));
  }
  function box(w, parent, size, pos, mat, rot = 0) {
    const m = new THREE.Mesh(keep(w, new THREE.BoxGeometry(...size)), mat);
    m.position.set(...pos); m.rotation.y = rot; m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  }
  function line(w, parent, a, b, mat, width = .035) {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b), d = end.clone().sub(start);
    const m = box(w, parent, [width, d.length(), width], start.clone().add(end).multiplyScalar(.5).toArray(), mat);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); return m;
  }
  function prop(w, parent, key, x, z, size, turn = 0, tint) {
    if (typeof ENV === 'undefined' || !ENV.m[key] || typeof envMesh !== 'function') return;
    const mat = tint == null ? undefined : keep(w, ENVMAT.clone());
    if (mat) mat.color.setHex(tint);
    const m = envMesh(key, mat), data = ENV.m[key];
    m.scale.setScalar(size / Math.max(data.w, .01));
    m.position.set(x, height(parent.position.x + x, parent.position.z + z) - parent.position.y - data.min[1] * m.scale.x, z);
    m.rotation.y = turn; parent.add(m); return m;
  }
  function root(w, x, z, name) {
    const g = new THREE.Group(); g.name = name; g.position.set(x, height(x, z), z); g.userData.mats = [];
    g.userData.terrainAbsolute245 = true;
    scene.add(g); w.grps.push(g); w.scene406 = g; return g;
  }
  function journal(w, g) {
    const book = new THREE.Group(); book.name = 'AldricJournal406'; book.position.set(0, .22, 0); book.rotation.y = -.4;
    const leather = material(w, 0x382b24), paper = material(w, 0xd4c293), clasp = material(w, 0xb28b4f, 0xb27625);
    box(w, book, [1.02, .10, .76], [0, 0, 0], leather);
    box(w, book, [.94, .09, .67], [0, .08, 0], paper);
    box(w, book, [1.03, .07, .78], [0, .16, 0], leather);
    box(w, book, [.10, .02, .78], [.33, .21, 0], clasp);
    box(w, book, [.45, .018, .045], [-.04, .21, -.08], clasp);
    box(w, book, [.30, .018, .035], [-.11, .21, .04], clasp);
    g.add(book); book.visible = false; w.book406 = book; w.glow406 = clasp;
  }
  function wreck(m, s, w, points, figure) {
    const p = s.s === 1 ? points[0] : s.saved?.[1] || points[0], g = root(w, p[0], p[1], 'AldricWreck406');
    w.wreck406 = [p[0], p[1]];
    const wood = material(w, 0x302620), ash = material(w, 0x272721), dust = material(w, 0x554639);
    for (let i = 0; i < 7; i++) box(w, g, [1.2 + (i % 3) * .35, .09, .13], [-3.8 + (i % 3) * .7, .10, -1 + Math.floor(i / 3) * .65], wood, i * .73);
    for (let i = 0; i < 5; i++) box(w, g, [.16, .025, 2.8], [-5 + i * 1.3, .035, 2.7 - (i % 2) * 1.4], dust, -.6 + i * .2);
    box(w, g, [4.5, .035, 2.3], [-3.8, .025, -1], ash, .22);
    const holder = new THREE.Group(); holder.name = 'BurnedWagon406'; holder.position.set(-4.5, height(p[0] - 4.5, p[1] - 1.8) - g.position.y, -1.8); holder.rotation.y = .55; g.add(holder);
    if (window.Wagon369) Wagon369.ready.then(ok => {
      if (!ok || w.disposed406 || !g.parent) return;
      const cart = Wagon369.create(); if (!cart) return;
      cart.mixer.stopAllAction();
      // Hidden ox/driver meshes still contribute to Box3 in Three r128.
      // Detach them from this clone before grounding the abandoned wagon.
      if (cart.ox?.parent) cart.ox.parent.remove(cart.ox);
      if (cart.driver?.root?.parent) cart.driver.root.parent.remove(cart.driver.root);
      cart.g.traverse(o => { if (o.isMesh && o.material) {
        o.material = Array.isArray(o.material) ? o.material.map(v => keep(w, v.clone())) : keep(w, o.material.clone());
        for (const mat of Array.isArray(o.material) ? o.material : [o.material]) if (mat.color) mat.color.multiplyScalar(.42);
      } });
      cart.g.rotation.z = .42; cart.g.updateMatrixWorld(true);
      cart.g.position.y -= new THREE.Box3().setFromObject(cart.g).min.y;
      holder.add(cart.g); w.wagon406 = cart;
    });
    prop(w, g, 'box_large', -2.1, 1.5, 1.2, .35, 0x6f6550);
    prop(w, g, 'box_small', -4.3, 2.1, .75, -.45, 0x786b51);
    prop(w, g, 'rubble_half', -1.3, -1.8, 1.1, .3);
    prop(w, g, 'rock_smallA', -1.1, -.1, 1.0, .5);
    prop(w, g, 'rock_smallA', 1.0, -.2, 1.1, 2.1);
    if (s.s === 1) {
      journal(w, g);
      if (!s.survivors406) s.survivors406 = [[p[0] + 5.5, p[1] + 3.2], [p[0] + 8.2, p[1] - 2.5]];
      for (const pt of s.survivors406) {
        const f = figure({ civ: true, name: 'Sobrevivente' }, pt[0], pt[1]);
        if (f) { f.hidden406 = true; w.figs.push(f); }
        prop(w, g, 'box_large', pt[0] - p[0] + .6, pt[1] - p[1] - 1, 1.4, -.2, 0x6f6550);
      }
    }
  }
  function inscription(w, points) {
    const p = points[0], g = root(w, p[0], p[1], 'AncientInscription406');
    const stone = material(w, 0x686a60), dark = material(w, 0x3d423d), glyph = material(w, 0xa79567, 0x332611);
    const slab = new THREE.Group(); slab.name = 'InscribedMonolith406'; slab.position.set(0, 0, -.6); g.add(slab);
    box(w, slab, [3.4, .3, 1.7], [0, .15, 0], dark);
    box(w, slab, [2.5, 3.5, .62], [0, 2, 0], stone);
    box(w, slab, [2.85, .25, .82], [0, 3.85, 0], dark);
    const z = .325, cy = 2.48, radius = .77;
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * Math.PI, b = (i + 1) / 16 * Math.PI;
      line(w, slab, [Math.cos(a) * radius, cy + Math.sin(a) * radius, z], [Math.cos(b) * radius, cy + Math.sin(b) * radius, z], glyph, .045);
    }
    for (const x of [-radius, radius]) line(w, slab, [x, cy, z], [x, cy - .73, z], glyph, .045);
    for (let i = 0; i < 5; i++) {
      const a = Math.PI * (.08 + i * .21), x = Math.cos(a) * 1.04, y = cy + Math.sin(a) * 1.04;
      const mark = box(w, slab, [.10, .20, .035], [x, y, z], glyph); mark.rotation.z = a - Math.PI / 2;
    }
    const center = box(w, slab, [.19, .19, .04], [0, 2.10, z], glyph); center.rotation.z = Math.PI / 4;
    // The partially erased lower layer is geometry, never an invented translation.
    for (let i = 0; i < 7; i++) box(w, slab, [.15 + (i % 3) * .08, .025, .018], [-.76 + i * .24, 1.24 + (i % 2) * .07, z], dark);
    for (const x of [-3.6, 3.6]) { prop(w, g, 'statue_columnDamaged', x, -1.3, 1.0, x); prop(w, g, 'rubble_half', x + .6, .2, 1.7, .8); }
    w.monolith406 = slab; w.glow406 = glyph;
  }
  API.build = function (m, s, w, points, figure) {
    if (!((m.id === 'a2' && [1, 2].includes(s.s)) || (m.id === 'a3' && s.s === 1) || (m.id === 'a12' && s.s === 2))) return;
    owned.set(w, new Set());
    if (m.id === 'a2') wreck(m, s, w, points, figure); else inscription(w, points);
    API.update(m, s, w, 0);
  };
  API.update = function (m, s, w, t) {
    if (!w.scene406) return;
    for (const f of w.figs) if (f?.m) f.m.root.userData.terrainAbsolute245 = true;
    const ready = !!s.fightDone, near = Math.hypot(player.x - w.scene406.position.x, player.z - w.scene406.position.z) < 13;
    if (w.book406) { w.book406.visible = ready; w.book406.position.y = .22 + (ready ? Math.sin(t * 2) * .035 : 0); }
    if (w.glow406) w.glow406.emissiveIntensity = (ready || w.monolith406) && near ? .6 + .3 * Math.sin(t * 2.6) : .05;
    if (m.id === 'a2' && s.s === 1 && w.inters[0]) w.inters[0].label = ready ? 'F · LER O DIÁRIO DE ALDRIC' : 'F · EXAMINAR A CARROÇA';
  };
  function close(confirm) {
    if (!reader) return;
    const r = reader; reader = null; r.el.remove(); paused = r.paused; modalOpen = r.modal;
    document.body.classList.remove('reading406'); window.W377?.releaseAll(); r.focus?.focus?.();
    if (confirm) r.done();
  }
  API.read = function (m, s, w, done) {
    if (!((m.id === 'a2' || m.id === 'a3') && s.s === 1)) return false;
    if (reader) return true;
    const lines = DOCUMENTS[m.id];
    if (!lines.length) { toast('O registro está indisponível. Tente novamente após carregar a história.'); return true; }
    const el = document.createElement('section'); el.id = 'reader406'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'readerTitle406');
    const sheet = document.createElement('article'); sheet.className = 'reader406-sheet';
    const over = document.createElement('small'); over.textContent = m.id === 'a2' ? 'ANOTAÇÕES DE ALDRIC · ORDEM DA FENDA' : 'CÓPIA DOS TRAÇOS VISÍVEIS';
    const title = document.createElement('h2'); title.id = 'readerTitle406'; title.textContent = m.id === 'a2' ? 'O Diário de Aldric' : 'A inscrição da Torre';
    const body = document.createElement('div'); body.className = 'reader406-text'; body.tabIndex = 0;
    for (const text of lines) { const p = document.createElement('p'); p.textContent = fill(text); body.appendChild(p); }
    const footer = document.createElement('footer'), cancel = document.createElement('button'), take = document.createElement('button');
    cancel.textContent = 'Voltar'; take.textContent = m.id === 'a2' ? 'Guardar diário' : 'Levar cópia a Lyra';
    cancel.onclick = () => close(false); take.onclick = () => close(true);
    footer.append(cancel, take); sheet.append(over, title, body, footer); el.appendChild(sheet);
    reader = { el, w, paused, modal: modalOpen, focus: document.activeElement, done };
    paused = true; modalOpen = true; window.W377?.releaseAll(); document.body.classList.add('reading406'); document.body.appendChild(el); body.focus(); return true;
  };
  addEventListener('keydown', e => {
    if (!reader) return;
    // Movement/interaction never reaches the world while the document is open.
    e.stopImmediatePropagation();
    if (e.code === 'Escape') { e.preventDefault(); close(false); }
    if (e.code === 'Tab') {
      const focusable = [...reader.el.querySelectorAll('[tabindex],button')], i = focusable.indexOf(document.activeElement);
      e.preventDefault(); focusable[(i + (e.shiftKey ? -1 : 1) + focusable.length) % focusable.length].focus();
    }
  }, true);
  API.dispose = function (w) {
    w.disposed406 = true;
    if (reader?.w === w) close(false);
    if (w.wagon406) w.wagon406.mixer.stopAllAction();
    for (const obj of owned.get(w) || []) obj.dispose(); owned.delete(w);
  };
  window.Scenes406 = API;
})();
