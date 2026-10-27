/* v638 (Ian: "mundo cheio como Skyrim"): enfeites por bioma em cada pedaço do mundo, todos em InstancedMesh do cenário (EnvBatch):
   carroça quebrada com barris e caixas, cerca caída, pilha de troncos, ossadas, tronco morto, grupos de cogumelos, pedras em círculo,
   flores em canteiro e sepulturas (perigo alto). Chamado por envChunk (210) no fim da montagem do pedaço, com gerador próprio
   (não mexe nos sorteios do resto). Respeita cidades, estradas, lagos e rios (ctx.cityD). O que é sólido recebe colisor. */
(function () {
  const pk = (R, a) => a[Math.floor(R() * a.length)];
  const TAU = Math.PI * 2;
  const free = (ctx, x, z, m = 1) => { const q = ctx.cityD(x, z); return !(q.clear || q.d < 40 * CITYK * m) };
  const spot = (ctx, P, tries = 8) => { for (let i = 0; i < tries; i++) { const x = ctx.x0 + (P() - .5) * 58, z = ctx.z0 + (P() - .5) * 58; if (free(ctx, x, z, 1.1) && worldFreeL(x, z)) return [x, z] } return null };
  const kinds = {
    carroca(ctx, P, x, z, tint) {
      const ry = P() * TAU, { so } = ctx.at(x, z);
      envSolidEW357(ctx.addCol, so, 'cart', x, 0, z, ry, 3.4, tint);
      const cs = Math.cos(ry), sn = Math.sin(ry);
      const put = (k, dx, dz, w) => { const px = x + dx * cs + dz * sn, pz = z - dx * sn + dz * cs; if (free(ctx, px, pz)) envSolidEW357(ctx.addCol, ctx.at(px, pz).so, k, px, 0, pz, P() * TAU, w, tint) };
      put(pk(P, ['barrel', 'crate_A_big', 'crate_B_small']), 2.6, 1.2, 1); put(pk(P, ['crate_B_small', 'sack', 'barrel']), -2.4, -1.5, .9);
      if (P() < .6) put('sack', 1.2, -2.8, .8);
    },
    cerca(ctx, P, x, z, tint) {
      const ry = P() * TAU, n = 4 + Math.floor(P() * 4), cs = Math.cos(ry), sn = Math.sin(ry);
      for (let i = 0; i < n; i++) { const px = x + cs * i * 3.1, pz = z - sn * i * 3.1; if (!free(ctx, px, pz) || !worldFreeL(px, pz)) break; if (P() < .8) envSolidEW357(ctx.addCol, ctx.at(px, pz).so, 'fence_broken', px, 0, pz, ry + (P() - .5) * .25, 3, tint) }
    },
    troncos(ctx, P, x, z, tint) {
      const { so } = ctx.at(x, z); envSolidEW357(ctx.addCol, so, 'log_stack', x, 0, z, P() * TAU, 3, tint);
      for (let i = 0; i < 3; i++) {
        const px = x + (P() - .5) * 9, pz = z + (P() - .5) * 9; if (!free(ctx, px, pz) || !worldFreeL(px, pz)) continue;
        const k = pk(P, ['log', 'log_large', 'stump_old', 'stump_round']), s = ctx.at(px, pz).so, ry = P() * TAU;
        if (k.startsWith('log')) envSolidEW357(ctx.addCol, s, k, px, 0, pz, ry, 2.6 + P() * 1.2, tint); else envSolid357(ctx.addCol, k, px, 0, pz, ry, EH(s, k, px, 0, pz, ry, .8 + P() * .4, tint));
      }
    },
    ossos(ctx, P, x, z, tint) {
      for (let i = 0, n = 3 + Math.floor(P() * 3); i < n; i++) { const px = x + (P() - .5) * 6, pz = z + (P() - .5) * 6; if (free(ctx, px, pz)) EH(ctx.at(px, pz).so, pk(P, ['bone_A', 'skull', 'ribcage', 'bone_A']), px, 0, pz, P() * TAU, .35 + P() * .5, tint) }
      if (P() < .4 && ctx.dg >= 2) EH(ctx.at(x, z).so, 'post_skull', x, 0, z, P() * TAU, 2.4, tint);
    },
    morta(ctx, P, x, z) {
      EH(ctx.at(x, z).so, pk(P, ['tree_dead_large', 'tree_dead_medium', 'tree_dead_small']), x, 0, z, P() * TAU, 9 + P() * 7);
      ctx.addCol({ x, z, r: .8 });
    },
    cogumelos(ctx, P, x, z, tint) {
      for (let i = 0, n = 5 + Math.floor(P() * 5); i < n; i++) { const px = x + (P() - .5) * 8, pz = z + (P() - .5) * 8; if (free(ctx, px, pz)) EH(ctx.at(px, pz).fl, pk(P, ['mushroom_redGroup', 'mushroom_tanGroup', 'mushroom_red', 'plant_flatTall']), px, 0, pz, P() * TAU, .5 + P() * .7, tint) }
    },
    pedras(ctx, P, x, z, tint) {
      const k0 = ['rock_largeA', 'rock_largeB', 'rock_tallA', 'stone_largeA'];
      for (let i = 0, n = 3 + Math.floor(P() * 3); i < n; i++) { const a = i / 5 * TAU + P() * .5, r = 2.4 + P() * 1.6, px = x + Math.cos(a) * r, pz = z + Math.sin(a) * r; if (free(ctx, px, pz) && worldFreeL(px, pz)) envSolidEW357(ctx.addCol, ctx.at(px, pz).so, pk(P, i ? ['rock_smallA', 'rock_smallC', 'stone_smallA', 'rock_largeC'] : k0), px, -.04, pz, P() * TAU, 1.1 + P() * 1.6, tint) }
    },
    flores(ctx, P, x, z) {
      const F = ['flower_purpleA', 'flower_redA', 'flower_yellowA', 'flower_purpleB', 'flower_redB', 'flower_yellowB'], f1 = pk(P, F), f2 = pk(P, F);
      for (let i = 0; i < 26; i++) { const a = P() * TAU, r = Math.sqrt(P()) * 6, px = x + Math.cos(a) * r, pz = z + Math.sin(a) * r; if (free(ctx, px, pz)) EH(ctx.at(px, pz).fl, P() < .5 ? f1 : f2, px, 0, pz, P() * TAU, .55 + P() * .5) }
    },
    sepulturas(ctx, P, x, z) {
      const ry = P() * TAU, cs = Math.cos(ry), sn = Math.sin(ry);
      for (let i = 0, n = 3 + Math.floor(P() * 3); i < n; i++) { const px = x + cs * i * 2.4, pz = z - sn * i * 2.4; if (!free(ctx, px, pz)) continue; const k = pk(P, ['gravestone', 'grave_A', 'gravemarker_A']), sc = EH(ctx.at(px, pz).so, k, px, 0, pz, ry + (P() - .5) * .3, 1.2 + P() * .5); envSolid357(ctx.addCol, k, px, 0, pz, ry, sc) }
    }
  };
  const table = (B, dg) => {
    if (B === 'deserto') return ['ossos', 'ossos', 'morta', 'pedras', 'carroca'];
    if (B === 'neve') return ['pedras', 'morta', 'troncos', 'ossos', 'carroca'];
    if (B === 'cristal') return ['pedras', 'pedras', 'morta'];
    if (B === 'vulcao') return ['ossos', 'morta', 'morta', 'pedras'];
    if (B === 'pantano') return ['cogumelos', 'cogumelos', 'morta', 'troncos', 'cerca', 'ossos'];
    if (B === 'floresta') return ['troncos', 'troncos', 'cogumelos', 'carroca', 'cerca', 'pedras', 'ossos'];
    return ['carroca', 'cerca', 'cerca', 'troncos', 'pedras', 'flores', 'flores', dg >= 3 ? 'ossos' : 'flores'];
  };
  window.Enfeite637 = {
    count: 0, by: {}, sites: [],
    run(ctx) {
      try {
        if (typeof ENV === 'undefined' || !ENV.ok) return;
        const P = mulberry32(rh(ctx.cx, ctx.cz, 637)), B = ctx.B, dg = ctx.dg;
        const n = (P() < .8 ? 1 : 0) + (P() < .55 ? 1 : 0) + (P() < .25 ? 1 : 0);
        const tint = B === 'neve' || ctx.SE === 3 ? 0xf0f4f8 : undefined;
        for (let i = 0; i < n; i++) {
          const k = pk(P, table(B, dg)), p = spot(ctx, P); if (!p) continue;
          kinds[k](ctx, P, p[0], p[1], tint); this.count++; if (this.sites.length < 400) this.sites.push({ k, x: p[0], z: p[1] }); this.by[k] = (this.by[k] || 0) + 1;
        }
        if (dg >= 4 && P() < .35) { const p = spot(ctx, P); if (p) { kinds.sepulturas(ctx, P, p[0], p[1]); this.count++; this.by.sepulturas = (this.by.sepulturas || 0) + 1 } }
      } catch (e) { console.warn('enfeite637', e) }
    }
  };
})();
