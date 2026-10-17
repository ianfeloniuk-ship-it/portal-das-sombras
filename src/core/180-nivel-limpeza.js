/* ================= NÍVEL: LIMPEZA ================= */
function clearLevel(){if(window.TER245&&TER245.OW)TER245.OW.value.x=0;/* v460: relevo do Outro Mundo só vale dentro da Fenda */if(window.Loot353)Loot353.clear();FX2.inv=0;riftPrevious131=null;riftArrival131=performance.now()+700;
  if(window.Rift131){for(const gate of gates)if(gate.mesh?.userData.rift131)Rift131.dispose(gate.mesh);if(L&&L.exits)for(const it of L.exits)if(it.grp?.userData.rift131)Rift131.dispose(it.grp);}if(riftLight131)riftLight131.intensity=0;if(riftSound131)riftSound131.silence();
  if(player&&player.mountM){scene.remove(player.mountM.root);player.mountM=null;run.mounted=false}
  if(L&&L.group)envDispose(L.group);scene.remove(L.group);chunks.clear();HASH.clear();
  for(const e of enemies)scene.remove(e.m.root);for(const n of npcs)scene.remove(n.m.root);
  for(const p of projs)scene.remove(p.mesh);for(const h of hazards)scene.remove(h.g);for(const f of fxs)scene.remove(f.o);
  enemies=[];npcs=[];projs=[];hazards=[];fxs=[];floats=[];bossE=null;$('boss').hidden=true;
  allies=allies.filter(a=>{if(a.party||a.shadow||(!a.dead&&a.life>0&&!a.guest&&!a.caravan))return true;scene.remove(a.m.root);return false});
  bossLight.intensity=0;
  for(const g of gates){g.mesh=null}
}

