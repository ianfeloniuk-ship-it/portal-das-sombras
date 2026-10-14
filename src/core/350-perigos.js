/* ================= PERIGOS ================= */
function hazard(x,z,r,dur,dmg,team,col){if(team==='enemy'&&r>8){r=8;dur=Math.max(dur,1.2)}
  const g=new THREE.Group();g.position.set(x,.06,z);
  // v163: área de perigo com cor sólida — o brilho aditivo virava branco no chão claro das masmorras.
  const solid163=(o)=>new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:o,depthWrite:false});
  const ring=new THREE.Mesh(new THREE.RingGeometry(r-.18,r,40),solid163(.95));ring.rotation.x=-Math.PI/2;g.add(ring);
  const fill=new THREE.Mesh(new THREE.CircleGeometry(r,40),solid163(.35));fill.rotation.x=-Math.PI/2;fill.scale.setScalar(.01);g.add(fill);
  scene.add(g);const h={g,fill,x,z,r,dur,t:0,dmg,team,col,owner:team==='enemy'?curAtk:null};hazards.push(h);return h;
}
function updHazards(dt){
  for(let i=hazards.length-1;i>=0;i--){const h=hazards[i];h.t+=dt;h.fill.scale.setScalar(Math.max(.01,h.t/h.dur));
    /* Se quem criou a área morreu antes dela explodir, a área some sem causar dano. */
    if(h.owner&&h.owner.dead&&h.t<h.dur){h.dmg=0;h.t=h.dur;fxRing(h.x,h.z,0x9fb0c4,h.r,.25)}
    if(h.t>=h.dur){
      if(h.invert113){inversionHit113(h)}
      else if(h.healFraction){solarHeal(h.x,h.z,h.r,h.healFraction)}
      else if(h.team==='enemy'){if(h.dmg>0&&!player.dead&&Math.hypot(player.x-h.x,player.z-h.z)<h.r+player.r){window.projOwner333=h.owner||null;hurtPlayer(h.dmg);window.projOwner333=null}for(const a of allies)if(Math.hypot(a.x-h.x,a.z-h.z)<h.r)hurtAlly(a,h.dmg)}
      else{for(const e of enemies)if(!e.dead&&Math.hypot(e.x-h.x,e.z-h.z)<h.r+e.r)hurtEnemy(e,h.dmg,h.x,h.z,{kb:h.kb??3,stun:h.stun,slow:h.slow||0,fromPlayer:true,skillHit:true,passive:!!h.passive})}
      if(h.icePulse)spikes(h.x,h.z,8,1,h.r,h.col,1);if(h.firePulse)pillar(h.x,h.z,h.col,.8,.35);
      if(h.bladeStrike)fxSlash(h.x,h.z,h.t*7,h.col,h.r);if(h.runeStrike){circle(h.x,h.z,h.col);pillar(h.x,h.z,h.col,.6,.4)}
      if(h.lightning){pillar(h.x,h.z,h.col,.22,.28);sparkUp(h.x,h.z,h.col,7,.45)}
      if(h.dmg>0){if(time-AU.lastBoom>.2){AU.lastBoom=time;sfx('boom')}fxRing(h.x,h.z,h.col,h.r,.35);fxBurst(h.x,.5,h.z,h.col,6,4);shake(h.team==='enemy'?.25:.12)}
      scene.remove(h.g);h.g.traverse(o=>{if(o.geometry)o.geometry.dispose()});hazards.splice(i,1)}}
}

