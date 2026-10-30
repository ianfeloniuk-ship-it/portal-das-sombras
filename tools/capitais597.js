/* v597 (Ian, 23/10/2026): CAPITAIS GRANDES. As 5 Capitais (Ymiria, Zahar, Thalor, Urdan, Verden) passam a ter muralha de 250 m (capitais504.js)
   e bairros por dentro, do anel da cidade antiga (até ~105 m) até a muralha: 4 avenidas, vielas tortas, casas coladas de frente para a rua,
   praça do mercado com poço e barracas, taverna/pousada, ferreiros, mercado, igreja, quartel, adereços e árvores, com a cara de cada capital
   (Ymiria gelada, Urdan forjas e pedra, Verden árvores, Thalor cais, Zahar tendas e deserto). Tudo instanciado (EnvBatch) e com colisão.
   Aster não muda. Base: protótipo tools/cidade533 (v533, nunca publicado). */
(function () {
  'use strict';
  const T = THREE, TAU = Math.PI * 2, PI = Math.PI;
  const seedOf = s => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0; return h || 7331; };
  /* cara de cada capital (Ian, 23/10): só visual e arquitetura; a raça guardiã é da Fase C */
  const THEME = {
    Ymiria: { tints: [0xd4e6ff, 0xc9d3c9, 0xb9c8e0, 0xe9dcff, 0xffffff, 0xaebfd8], extra: [['building_church_blue', 9.6], ['building_church_blue', 8.6]], props: [['tree_fir', 34, 12, 20], ['rock_large', 10, 3, 4]] },
    Urdan: { tints: [0xf2b98a, 0xc9a27e, 0xb08968, 0x9a8878, 0xd9b38c], extra: [['building_blacksmith_blue', 9], ['building_blacksmith_blue', 8.4], ['building_blacksmith_blue', 9.4]], props: [['rock_large', 26, 3, 5], ['log_stack', 22, 1.6, 1.4]] },
    Verden: { tints: [0xdcf2c8, 0xc9e6a8, 0xe8f2c8, 0xa9cf9a, 0xffe2c2], extra: [['building_lumbermill_blue', 7.5], ['building_market_blue', 9.5]], props: [['tree_oak', 46, 11, 16], ['tree_willow', 14, 10, 14]] },
    Thalor: { tints: [0xd4e6ff, 0xb9c8e0, 0xaadfd0, 0xcfeff0, 0xdcd2b8], extra: [['building_market_blue', 10], ['building_tavern_blue', 9.4]], props: [['barrel', 30, 1.3, 1.1], ['crate_A_big', 20, 1.3, 1.1], ['sack', 14, 1, .9]] },
    Zahar: { plaza: 24, stalls: 20, tints: [0xf2d9a6, 0xe8c98a, 0xfff0a8, 0xf2b98a, 0xe0c090], extra: [['building_market_blue', 10], ['building_windmill_blue', 7.5]], props: [['cactus_0', 18, 4.5, 1], ['cactus_3', 14, 4, 1], ['cactus_7', 12, 5, 1], ['barrel', 14, 1.3, 1.1]] }
  };
  /* árvores, pedras, barris e cactos soltos entre as casas, de acordo com o tema */
  function themeProps(prop, R, RW, RIN, TH, X, Z, flatAt, RHO) {
    for (const [key, n, h, r] of TH.props) for (let i = 0; i < n; i++) {
      for (let t = 0; t < 20; t++) {
        const a = R() * TAU, rr = RIN + 6 + R() * (RHO(a) - RIN - 20), x = Math.cos(a) * rr, z = Math.sin(a) * rr;
        if (Math.abs(x) < 12 || Math.abs(z) < 12) continue;
        prop(key, x, z, R() * TAU, h * (.8 + R() * .5), r > 3 ? 2.2 : .7); break;
      }
    }
  }
  const RW = 250, RIN = 106, AVE = 9;
  const rng = n => () => { n = (Math.imul(n, 1664525) + 1013904223) >>> 0; return n / 4294967296; };
  const gate = a => { a %= TAU; if (a < 0) a += TAU; return Math.min(...[0, PI / 2, PI, PI * 1.5, TAU].map(q => Math.abs(a - q))); };
  const stoneMat = (c, o) => new T.MeshBasicMaterial({ color: c, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, side: T.DoubleSide, opacity: o || 1, transparent: !!o });

  const ss = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
  const gorgeH = () => 0;
  /* calçamento: paralelepípedo nas ruas, tijolo/laje na praça (canvas, uma vez só) */
  const texCache = {};
  function pavTex(kind) {
    if (texCache[kind]) return texCache[kind];
    const N = 512, c = document.createElement('canvas'); c.width = c.height = N;
    const x = c.getContext('2d'); let seed = kind === 'brick' ? 91 : 17;
    const rnd = () => { seed = (Math.imul(seed,1664525)+1013904223)>>>0; return seed/4294967296; };
    x.fillStyle='#686057'; x.fillRect(0,0,N,N);
    const rows=8, rh=N/rows;
    for(let row=0;row<rows;row++) for(let col=-1;col<9;col++) {
      const w=64, px=col*w+(row%2?32:0), py=row*rh;
      const v=(rnd()-.5)*30, warm=kind==='brick';
      const rgb=warm?[128+v,111+v,94+v]:[119+v,116+v,109+v];
      x.fillStyle=`rgb(${rgb.map(Math.round).join(',')})`;
      x.beginPath(); x.moveTo(px+2+rnd()*2,py+2); x.lineTo(px+w-2,py+2+rnd()*2);
      x.lineTo(px+w-2-rnd()*2,py+rh-2);x.lineTo(px+2,py+rh-2-rnd()*2);x.closePath();x.fill();
      x.save();x.clip();
      for(let j=0;j<160;j++){x.fillStyle=rnd()<.5?'rgba(30,25,20,.10)':'rgba(235,225,200,.10)';x.fillRect(px+rnd()*w,py+rnd()*rh,1+rnd()*2,1+rnd()*2);}
      x.restore();
      x.strokeStyle='rgba(224,216,192,.16)';x.lineWidth=1;x.beginPath();x.moveTo(px+4,py+4);x.lineTo(px+w-4,py+4);x.stroke();
    }
    const texture=new T.CanvasTexture(c);texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.encoding=T.sRGBEncoding;texture.anisotropy=4;
    const heightCanvas=document.createElement('canvas');heightCanvas.width=heightCanvas.height=N;
    const hx=heightCanvas.getContext('2d');hx.drawImage(c,0,0);const data=hx.getImageData(0,0,N,N);
    for(let i=0;i<data.data.length;i+=4){const y=(data.data[i]+data.data[i+1]+data.data[i+2])/3;data.data[i]=data.data[i+1]=data.data[i+2]=y;}
    hx.putImageData(data,0,0);const bump=new T.CanvasTexture(heightCanvas);bump.wrapS=bump.wrapT=T.RepeatWrapping;
    texture.userData=texture.userData||{};texture.userData.bump=bump;texCache[kind]=texture;return texture;
  }
  const pavMat=(kind,layer,tint)=>{const map=pavTex(kind);return new T.MeshStandardMaterial({map,bumpMap:map.userData.bump,bumpScale:.035,roughness:.96,metalness:0,color:tint||0xffffff,polygonOffset:true,polygonOffsetFactor:layer||-2,polygonOffsetUnits:layer||-2,side:T.DoubleSide});};
  /* piso que cola no terreno: vértices com y pequeno + âncora (x,z) -> o shader soma terrH exato (igual ao EnvBatch) */
  const onTerrain = (geo, anc) => { geo.setAttribute('terrainAnchor245', new T.Float32BufferAttribute(anc, 2)); geo.userData.terrainBatch245 = true; return geo; };
  const reliefH = () => 0;
  function bairros(c, g, addCol, R0) {
    const ORGANIC = !!(window.Capitais501 && Capitais501.rho && Capitais501.rho(c, 0) !== 250);
    let EXT = false; /* true = subúrbio fora da muralha, perto dos portões */
    const RHO = a => (window.Capitais501 && Capitais501.rho) ? Capitais501.rho(c, a) : RW, TH = THEME[c.name] || THEME.Verden, X = c.x, Z = c.z, M = TripoEnvironment153.models, R = rng(seedOf(c.name));
    const b = new EnvBatch(), stats = { houses: 0, special: 0 }, SH = [];
    const col = (x, z, r) => addCol({ x, z, r });

    /* ---- estilo Skyrim (Whiterun): avenidas retas dos portões, vielas tortas que saem delas, casas coladas de frente para a rua,
       praça do mercado com poço, barracas e árvore grande, adereços (barris, caixas, carrinhos) e árvores/hortas entre as casas ---- */
    const TINTS = TH.tints;
    const TT = TINTS.map(h => [(h >> 16 & 255) / 255, (h >> 8 & 255) / 255, (h & 255) / 255]);
    const RAW = ['building_home_A_blue', 'building_home_B_blue', 'building_home_A_red', 'building_home_B_red', 'building_home_A_yellow', 'building_home_B_green'];
    const HM = M.house; b.tripo153 = [];
    const tripoList = [], used = [], streets = [];
    const fp = (dim, x, z, ry) => City253.bounds(dim, x, z, ry);
    const dist2seg = (px, pz, ax, az, bx, bz) => { const dx = bx - ax, dz = bz - az, l = dx * dx + dz * dz || 1, t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / l)); return Math.hypot(px - ax - t * dx, pz - az - t * dz); };
    const dStreet = (px, pz, skip) => { let m = 1e9; streets.forEach((st, i) => { if (i === skip) return; for (let k = 0; k < st.pts.length - 1; k++) { const d = dist2seg(px, pz, st.pts[k][0], st.pts[k][1], st.pts[k + 1][0], st.pts[k + 1][1]) - st.hw; if (d < m) m = d; } }); return m; };
    const flatAt = (x, z, m) => gorgeH(X + x, Z + z) < 1 && [[m, 0], [-m, 0], [0, m], [0, -m]].every(([dx, dz]) => gorgeH(X + x + dx, Z + z + dz) < 1);
    const slopeOk = (x, z, m, lim) => { const h0 = reliefH(X + x, Z + z); return [[m, 0], [-m, 0], [0, m], [0, -m]].every(([dx, dz]) => Math.abs(reliefH(X + x + dx, Z + z + dz) - h0) < lim); };
    const ribbon = (pts, hw, mat, tile) => { tile = tile || 2.4; /* faixa de chão que acompanha o relevo */
      const dense = [];
      for (let k = 0; k < pts.length - 1; k++) { const l = Math.hypot(pts[k + 1][0] - pts[k][0], pts[k + 1][1] - pts[k][1]), n = Math.max(1, Math.ceil(l / 2)); for (let i = 0; i < n; i++) dense.push([pts[k][0] + (pts[k + 1][0] - pts[k][0]) * i / n, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * i / n]); }
      dense.push(pts[pts.length - 1]);
      const P = [], I = [], UV = [], ANC = []; let dl = 0;
      dense.forEach((p, k) => { if (k) dl += Math.hypot(p[0] - dense[k - 1][0], p[1] - dense[k - 1][1]); const a = dense[Math.max(0, k - 1)], c2 = dense[Math.min(dense.length - 1, k + 1)], tx = c2[0] - a[0], tz = c2[1] - a[1], l = Math.hypot(tx, tz) || 1, nx = -tz / l * hw, nz = tx / l * hw; for (const sg of [1, -1]) { const x = X + p[0] + nx * sg, z = Z + p[1] + nz * sg; P.push(x, .12, z); ANC.push(x, z); UV.push(dl / tile, sg > 0 ? hw * 2 / tile : 0); } if (k) { const o = (k - 1) * 2; I.push(o, o + 1, o + 2, o + 1, o + 3, o + 2); } });
      const gg = new T.BufferGeometry(); gg.setAttribute('position', new T.Float32BufferAttribute(P, 3)); gg.setAttribute('uv', new T.Float32BufferAttribute(UV, 2)); gg.setIndex(I); gg.computeVertexNormals(); onTerrain(gg, ANC); const m = new T.Mesh(gg, mat); m.userData.terrainBatch245 = true; m.userData.own = 1; m.frustumCulled = false; g.add(m);
    };
    const casa = () => {
      const q = R();
      if (q < .34 && HM) { const hv = ['house', 'house2', 'house3', 'house4'][Math.floor(R() * 4)], HV = M[hv] || HM; /* v695: uma das 4 casas medievais do Drive */ const s0 = (5.4 + R() * 3.6) / HV.h, fx = .8 + R() * .55, fy = .8 + R() * .6, fz = .8 + R() * .55; return { id: M[hv] ? hv : 'house', s0, fx, fy, fz, tint: TT[Math.floor(R() * TT.length)], dim: { w: HV.sz * s0 * fz, d: HV.sx * s0 * fx, h: HV.h * s0 * fy } }; }
      if (q < .96) { const key = RAW[Math.floor(R() * RAW.length)], w = 4.4 + R() * 5.2; return { key, w, tint: TINTS[Math.floor(R() * TINTS.length)], dim: cityDim253(key, w) }; }
      return { key: 'building_scaffolding', w: 6, tint: 1, dim: cityDim253('building_scaffolding', 6) };
    };
    const especial = (key, w) => ({ key, w, special: true, dim: cityDim253(key, w) });
    const stats2 = { props: 0, trees: 0 };
    const prop = (key, x, z, ry, h, r) => { if (!ENV.m[key] || !flatAt(x, z, 1)) return; if (used.some(u => City253.clearance(City253.bounds({ w: 1.4, d: 1.4 }, x, z, 0), u.footprint) < .2)) return; EH(b, key, X + x, 0, Z + z, ry, h); col(X + x, Z + z, r || .6); stats2.props++; };
    const PL = { x: 1e9, z: 1e9, R: 0 };
    function place(H, x, z, ry, gapMin) {
      const dim = H.dim, f = fp(dim, x, z, ry);
      if (!H.plaza && Math.hypot(x - PL.x, z - PL.z) < PL.R + Math.max(dim.w, dim.d) / 2 + 1) return false;
      if (f.corners.some(k => { const q = Math.hypot(k.x, k.z), rh = RHO(Math.atan2(k.z, k.x)); return EXT ? (q < rh + 6 || q > rh + 80) : (q < RIN || q > rh - 9); })) return false;
      if (!flatAt(x, z, Math.max(dim.w, dim.d) / 2 + 6)) return false;
      if (!slopeOk(x, z, Math.max(dim.w, dim.d) / 2 + 1.5, 2.4)) return false;
      if (used.some(u => City253.clearance(f, u.footprint) < (gapMin || 2.6))) return false;
      used.push({ footprint: f });
      if (H.id) { b.tripo153.push({ id: H.id, x: X + x, y: 0, z: Z + z, ry: ry + PI / 2, scale: H.s0 * H.fx, sy: H.s0 * H.fy, sz: H.s0 * H.fz }); tripoList.push(H.tint); }
      else if (H.special) EW(b, H.key, X + x, 0, Z + z, ry, H.w, 1);
      else { const mm = ENV.m[H.key]; if (!mm) { used.pop(); return false; } const sc = H.w / mm.w, fy = .9 + R() * .4; b.add(H.key, X + x, 0, Z + z, ry + doorRot188(H.key), sc, sc * fy, sc, H.tint); }
      cityCollider253(addCol, X + x, Z + z, ry, dim); ENV.cast.push({ x: X + x + .8, z: Z + z - .6, r: Math.max(dim.w, dim.d) * .6, k: .5 });
      if (H.special) { stats.special++; SH.push({ key: H.key, x: X + x, z: Z + z, ry, dim }); } else stats.houses++;
      const fxv = Math.sin(ry), fzv = Math.cos(ry), lx = fzv, lz = -fxv;
      if (!H.special && R() < .55) { const kk = ['barrel', 'crate_A_big', 'sack', 'barrel_small', 'wheelbarrow', 'log_stack', 'crates_stacked'][Math.floor(R() * 7)], o = (R() - .5) * dim.w * .7; prop(kk, x + fxv * (dim.d / 2 + 1.7) + lx * o, z + fzv * (dim.d / 2 + 1.7) + lz * o, R() * TAU, kk === 'wheelbarrow' ? 1.1 : 1, .5); }
      if (!H.special && R() < .3) { const bx = x - fxv * (dim.d / 2 + 3.2), bz = z - fzv * (dim.d / 2 + 3.2); if (flatAt(bx, bz, 2) && dStreet(bx, bz, -1) > 2.5 && used.every(u => City253.clearance(City253.bounds({ w: 4, d: 4 }, bx, bz, 0), u.footprint) > .5)) { EH(b, R() < .5 ? 'tree_oak' : 'tree_willow', X + bx, 0, Z + bz, R() * TAU, 5.2 + R() * 2.4); col(X + bx, Z + bz, .8); stats2.trees++; } }
      return true;
    }
    /* casas coladas ao longo de uma linha (rua), dos dois lados, viradas para ela */
    function frente(pts, hw, queue, depth) {
      let acc = 0; const segs = [];
      for (let k = 0; k < pts.length - 1; k++) { const l = Math.hypot(pts[k + 1][0] - pts[k][0], pts[k + 1][1] - pts[k][1]) || .01; segs.push(l); acc += l; }
      for (const side of [-1, 1]) {
        let s = 4 + R() * 6, nHouse = 0;
        while (s < acc - 3) {
          let t = s, k = 0; while (k < segs.length - 1 && t > segs[k]) { t -= segs[k]; k++; }
          const A = pts[k], B = pts[k + 1], l = segs[k], tx = (B[0] - A[0]) / l, tz = (B[1] - A[1]) / l, px = A[0] + tx * t, pz = A[1] + tz * t, nx = -tz * side, nz = tx * side;
          /* a cada 2-4 casas fica um vão largo: é a viela que entra no quarteirão */
          if (!depth && nHouse >= 2 + Math.floor(R() * 3)) {
            nHouse = 0;
            const sx = px + nx * (hw + .5), sz = pz + nz * (hw + .5), lane = [[px, pz], [sx, sz]]; let h = Math.atan2(nz, nx), x = sx, z = sz, L = 0; const lim = 24 + R() * 30;
            for (let q = 0; q < 12 && L < lim; q++) { h += (R() - .5) * .7; x += Math.cos(h) * 5; z += Math.sin(h) * 5; L += 5; const rr = Math.hypot(x, z); if (rr < RIN - 2 || rr > RHO(Math.atan2(z, x)) - 12 || gorgeH(X + x, Z + z) > .5 || !slopeOk(x, z, 3, 2.2) || dStreet(x, z, -1) < 4) break; lane.push([x, z]); }
            if (lane.length >= 4) { streets.push({ pts: lane, hw: 1.6 }); frente(lane, 1.6, null, 1); }
            s += 6.5; continue;
          }
          const H = (queue && queue.length && R() < .5) ? especial(...queue.shift()) : casa();
          const off = hw + .9 + R() * 2.2 + H.dim.d / 2, cx = px + nx * off, cz = pz + nz * off, ry = Math.atan2(-nx, -nz) + (R() - .5) * .22;
          const placed = place(H, cx, cz, ry);
          if (placed) nHouse++;
          s += (placed ? H.dim.w + 2.6 + R() * 2.2 : 2.5);
        }
      }
    }
    const dirs = [0, PI / 2, PI, PI * 1.5];
    dirs.forEach(q => streets.push({ pts: [[Math.cos(q) * (RIN - 6), Math.sin(q) * (RIN - 6)], [Math.cos(q) * RHO(q), Math.sin(q) * RHO(q)]], hw: 5.5 }));
    /* praça do mercado (NE): poço, árvore grande, barracas em volta e as casas importantes viradas para ela */
    {
      const pa = -PI / 4 - .1, pr = Math.min(150, RHO(pa) - 30), px = Math.cos(pa) * pr, pz = Math.sin(pa) * pr, PR = TH.plaza || 17;
      if (flatAt(px, pz, PR)) {
        PL.x = px; PL.z = pz; PL.R = PR;
        const pg = new T.RingGeometry(.01, PR, 40, 8); pg.rotateX(-PI / 2); { const ps = pg.attributes.position, anc = []; for (let i = 0; i < ps.count; i++) { const wx = X + px + ps.getX(i), wz = Z + pz + ps.getZ(i); ps.setXYZ(i, wx, .14, wz); anc.push(wx, wz); } onTerrain(pg, anc); } const pm = new T.Mesh(pg, pavMat('brick', -5)); pm.userData.terrainBatch245 = true; pm.userData.own = 1; pm.frustumCulled = false; pavTex('brick').repeat.set(1, 1); { const uv = pg.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) - .5) * PR * 2 / 3.2, (uv.getY(i) - .5) * PR * 2 / 3.2); } pg.computeVertexNormals(); g.add(pm);
        EW(b, 'building_well_blue', X + px, 0, Z + pz, 0, 3.6); col(X + px, Z + pz, 1.8);
        EH(b, 'tree_oak', X + px + 6, 0, Z + pz - 4, 1.2, 12); col(X + px + 6, Z + pz - 4, 1.4);
        for (let k = 0; k < (TH.stalls || 7); k++) { const aa = k / (TH.stalls || 7) * TAU + .3, sx = px + Math.cos(aa) * (PR - 3.5), sz = pz + Math.sin(aa) * (PR - 3.5); EW(b, ['stall', 'stall-red', 'stall-green', 'stall-bench'][k % 4], X + sx, 0, Z + sz, Math.atan2(-Math.cos(aa), -Math.sin(aa)), 3.4); col(X + sx, Z + sz, 1.5); }
        const esp = [['building_tavern_blue', 9.4], ['building_blacksmith_blue', 8.8], ['building_market_blue', 10], ['building_church_blue', 9.6], ['building_barracks_blue', 10.5]];
        esp.forEach(([key, w], k) => { const aa = pa + (k - 2) * .62, d = cityDim253(key, w), rr = PR + 2.5 + d.d / 2, cx = px + Math.cos(aa) * rr, cz = pz + Math.sin(aa) * rr; place({ ...especial(key, w), plaza: true }, cx, cz, Math.atan2(px - cx, pz - cz), .6); });
      }
    }
    dirs.forEach((q, i) => frente(streets[i].pts, 5.5, TH.extra.filter((_, k) => k % 4 === i).map(e => [...e]), 0));
    /* subúrbio: casas fora dos muros, ao longo das estradas, perto dos portões */
    if (ORGANIC) { EXT = true; const n0 = streets.length;
      dirs.forEach(q => { const rh = RHO(q); streets.push({ pts: [[Math.cos(q) * (rh + 4), Math.sin(q) * (rh + 4)], [Math.cos(q) * (rh + 80), Math.sin(q) * (rh + 80)]], hw: 5.5 }); frente(streets[streets.length - 1].pts, 5.5, null, 1); });
      EXT = false; }
    /* vielas tortas que saem das avenidas */
    for (let i = 0; i < 4; i++) {
      const q = dirs[i], ux = Math.cos(q), uz = Math.sin(q);
      let side = i % 2 ? 1 : -1;
      for (let d = RIN + 8; d < RHO(q) - 24; d += 24 + R() * 14, side = -side) {
        let x = ux * d - uz * side * 6, z = uz * d + ux * side * 6, h = Math.atan2(ux * side, -uz * side) + (R() - .5) * .5, L = 0;
        const pts = [[ux * d, uz * d], [x, z]], lim = 34 + R() * 34;
        for (let k = 0; k < 14 && L < lim; k++) { h += (R() - .5) * .55; x += Math.cos(h) * 5; z += Math.sin(h) * 5; L += 5; const rr = Math.hypot(x, z); if (rr < RIN || rr > RHO(Math.atan2(z, x)) - 14 || gorgeH(X + x, Z + z) > .5 || (k > 2 && dStreet(x, z, -1) < 5)) break; pts.push([x, z]); }
        if (pts.length >= 4) { streets.push({ pts, hw: 2.4 }); frente(pts, 2.4, null, 1); }
      }
    }
    /* chão das alamedas: faixas planas por cima do relevo (as avenidas retas já vêm pintadas no chão) */
    const cob = pavMat('cobble', -3), brk = pavMat('brick', -4), edge = pavMat('cobble', -2, 0xaaa59a);
    streets.forEach((st, i) => { if (i < 4) { ribbon(st.pts, st.hw + .2, brk, 3.2); } else { ribbon(st.pts, st.hw + .9, edge); ribbon(st.pts, st.hw + .2, cob, 2.4); } });
    /* piso da cidade inteira: paralelepípedo mais escuro entre as casas, acompanhando as colinas (fora da garganta) */
    {
      const R0 = RIN - 8, R1 = 245, NR = Math.ceil((R1 - R0) / 4), NA = 160, P = [], UV = [], I = [], ok = [], ANC = [];
      for (let i = 0; i <= NR; i++) for (let j = 0; j < NA; j++) { const an = j / NA * TAU, rr = R0 + (Math.min(R1, RHO(an) - 3) - R0) * i / NR, x = Math.cos(an) * rr, z = Math.sin(an) * rr; P.push(X + x, .05, Z + z); ANC.push(X + x, Z + z); UV.push((X + x) / 2.6, (Z + z) / 2.6); ok.push(gorgeH(X + x, Z + z) < .5); }
      for (let i = 0; i < NR; i++) for (let j = 0; j < NA; j++) { const a0 = i * NA + j, a1 = i * NA + (j + 1) % NA, b0 = (i + 1) * NA + j, b1 = (i + 1) * NA + (j + 1) % NA; if (ok[a0] && ok[a1] && ok[b0] && ok[b1]) I.push(a0, b0, a1, a1, b0, b1); }
      const fg = new T.BufferGeometry(); fg.setAttribute('position', new T.Float32BufferAttribute(P, 3)); fg.setAttribute('uv', new T.Float32BufferAttribute(UV, 2)); fg.setIndex(I); fg.computeVertexNormals(); onTerrain(fg, ANC);
      const fm = new T.Mesh(fg, pavMat('cobble', -1, 0x8d8576)); fm.userData.terrainBatch245 = true; fm.userData.own = 1; fm.frustumCulled = false; g.add(fm);
    }
    themeProps(prop, R, RW, RIN, TH, X, Z, flatAt, RHO);
    stats.props = stats2.props; stats.trees = stats2.trees; stats.streets = streets.length;
    const grp = b.mesh(BLDMAT);
    if (grp && tripoList.length) { /* cor própria de cada casa Tripo (também no modelo leve de longe) */
      const cc = new T.Color();
      grp.traverse(o => { if (!o.isInstancedMesh || o.count !== tripoList.length) return; tripoList.forEach((t, i) => { cc.setRGB(t[0], t[1], t[2]); o.setColorAt(i, cc); }); o.instanceColor.needsUpdate = true; });
    }
    if (grp && window.Capitais501 && Capitais501.grade) { try { Capitais501.grade(grp, c); } catch (e) { console.warn('grade625', e); } }
    envOwn(g, grp);
    c.bairros533 = stats;
    /* vendedores nas lojas dos bairros: ferreiro (equipamentos), mercado, igreja (poções) e quartel (defesa) */
    const VS = { building_blacksmith_blue: ['wep', 'EQUIPAMENTOS', '#ffb84d', 0x7a4a2a, 'Ferreiro'], building_market_blue: ['mkt', 'MERCADO', '#b18cff', 0x5a2a6a, 'Mercador'], building_church_blue: ['pot', 'POÇÕES', '#ff8fa3', 0x8a2b4a, 'Curandeiro'], building_barracks_blue: ['arm', 'DEFESA', '#c9d3de', 0x5f6f86, 'Armeiro'] };
    const VN = ['Torvald', 'Ysolde', 'Bertram', 'Mirabel', 'Osric', 'Edda', 'Halvar', 'Ingrid', 'Corwin', 'Selka'];
    SH.forEach((s, i) => { const v = VS[s.key]; if (!v || typeof addVendor !== 'function') return; try { const f = cityFront253(s.x, s.z, s.ry, s.dim.d / 2 + 1.6); addVendor(c, v[0], VN[(seedOf(c.name) + i) % VN.length] + ' · ' + v[4], v[1], v[2], f.x, f.z, { body: v[3], hair: 0x3a2a1a, wep: 'none', gk: 'Rogue' }); } catch (_) {} });
  }

  const bc0 = buildCity;
  buildCity = function (c, g, addCol, R) {
    const r = bc0.apply(this, arguments);
    try {
      if (c && c.capital && THEME[c.name] && !cityFallen(c) && ENV.ok && window.TripoEnvironment153) {
        if (TripoEnvironment153.models.wall) bairros(c, g, addCol, R);
        else TripoEnvironment153.ready.then(() => { if (g.parent) bairros(c, g, addCol, R); });
      }
    } catch (e) { console.warn('capitais597', e); }
    return r;
  };
  window.Capitais597 = { R: RW, THEME };
})();
