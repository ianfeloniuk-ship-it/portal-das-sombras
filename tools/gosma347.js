/* Gosma Verde: one organism, three independently targetable Blender fragments. */
(function(){
'use strict';
const groups=new Set(),shares=[.6,.23,.17],ids=e=>[0,1,2].map(i=>(KINDS[e.kind]?.mon||'gosma')+'_part'+i);
function clearLinks(g){for(const l of g.links||[]){scene.remove(l);l.geometry.dispose();l.material.dispose();}g.links=[];}
function links(g,alive){
 const variant=KINDS[g.reward.kind]?.variant;if(!variant||g.merged){clearLinks(g);return;}
 const anchor=alive[0],others=alive.slice(1);g.links=g.links||[];
 while(g.links.length>others.length){const l=g.links.pop();scene.remove(l);l.geometry.dispose();l.material.dispose();}
 for(let i=0;i<others.length;i++){
  const e=others[i];let l=g.links[i];if(!l){l=new THREE.Mesh(new THREE.CylinderGeometry(variant==='f'?.045:.018,variant==='f'?.055:.024,1,variant==='f'?5:8),new THREE.MeshStandardMaterial({color:variant==='f'?0x8c65a9:0x151219,roughness:.42,metalness:.15}));scene.add(l);g.links.push(l);}
  const a=new THREE.Vector3(anchor.x,.24,anchor.z),b=new THREE.Vector3(e.x,.2,e.z),delta=b.clone().sub(a);l.position.copy(a).add(b).multiplyScalar(.5);l.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.clone().normalize());l.scale.y=delta.length();l.visible=anchor.m.root.visible&&e.m.root.visible;
 }
}
const live=g=>g.members.filter(e=>!e.dead&&!e.gone&&enemies.includes(e));
function pose(e,name){e.m.mixer.stopAllAction();gPlay(e.m,name,true,1);e.gosmaPose347=.47;}
function swap(e,model){scene.remove(e.m.root);e.m.mixer?.stopAllAction();e.m=model;e.mats=model.mats;model.root.position.set(e.x,0,e.z);model.root.rotation.y=e.face;scene.add(model.root);}
function afterDamage(e){
 if((KINDS[e.kind]?.baseKind||e.kind)!=='gosma'||e.dead||e.isBoss||e.ally||e.noExpLoot||e.gosmaUsed347||e.hp<=0||e.hp>e.maxhp*.5||!ids(e).every(k=>MON.list[k])||!e.m.glb)return;
 e.gosmaUsed347=true;e.gosmaSplit347=.47;e.act=null;pose(e,'Split');
 floater(e.x,e.z,'A GOSMA SE DIVIDE','#a4d765',true,2);
}
function divide(e){
 const base={...e},g={members:[],reward:{...e,m:{sc:e.m.sc}},age:0,paid:false,merged:false};groups.add(g);
 // Spawn after the damage event, so one area hit cannot hit newborn pieces twice.
 for(let i=0;i<3;i++){
  const q=i===0?e:{...base},w=shares[i],m=makeMonster({mon:ids(base)[i],scale:base.m.sc});
  if(i===0)swap(q,m);else{q.m=m;q.mats=m.mats;scene.add(m.root);enemies.push(q);}
  q.gosmaGroup347=g;q.gosmaPart347=i;q.gosmaSplit347=0;q.gosmaPose347=0;q.gosmaUsed347=true;
  q.name=base.name+' · fragmento';q.hp=base.hp*w;q.maxhp=base.maxhp*w;q.dmg=base.dmg*w;
  q.r=base.r*Math.cbrt(w);q.range=base.range*Math.cbrt(w);q.noExpLoot=true;q.act=null;q.kb={x:0,z:0};q.cd=.6;
  q.basicDots=Object.fromEntries(Object.entries(base.basicDots||{}).map(([k,v])=>[k,{...v,d:v.d*w}]));q.dotD=(base.dotD||0)*w;
  const a=base.face+[0,-1.8,1.8][i],dist=i?base.r*1.5:0;
  moveEnt(q,Math.sin(a)*dist,Math.cos(a)*dist);q.m.root.position.set(q.x,0,q.z);q.m.root.rotation.y=q.face;
  g.members.push(q);gPlay(q.m,'Idle',false,1);
 }
 fxRing(e.x,e.z,0x83b94d,1.2,.4);
}
function beforeKill(e){
 const g=e.gosmaGroup347;if(!g)return false;
 e.act=null;e.gosmaSplit347=0;e.gosmaPose347=0;
 if(live(g).some(q=>q!==e)){e.dead=true;e.deadT=0;return true;}
 if(g.paid){e.dead=true;e.deadT=0;return true;}
 g.paid=true;clearLinks(g);groups.delete(g);
 // Settle the original creature once, using its original reward/effort baseline.
 for(const key of ['maxhp','xp','speciesXpBalance','rewardSpeciesHP262','gold','name','noExpLoot','rewardBlocked'])e[key]=g.reward[key];
 return false;
}
function merge(g,alive){
 const e=alive[0],hp=alive.reduce((a,q)=>a+q.hp,0),maxhp=alive.reduce((a,q)=>a+q.maxhp,0),dmg=alive.reduce((a,q)=>a+q.dmg,0),fraction=maxhp/g.reward.maxhp;
 const dots={};for(const q of alive)for(const [k,d] of Object.entries(q.basicDots||{})){if(!dots[k])dots[k]={...d,d:0};dots[k].d+=d.d;dots[k].t=Math.max(dots[k].t,d.t);}
 e.dotD=alive.reduce((a,q)=>a+(q.dotD||0),0);e.dotT=Math.max(...alive.map(q=>q.dotT||0));e.basicDots=dots;
 e.stun=Math.max(...alive.map(q=>q.stun||0));e.slow=Math.max(...alive.map(q=>q.slow||0));
 for(const q of alive.slice(1)){q.dead=true;q.gone=true;q.act=null;q.m.mixer?.stopAllAction();scene.remove(q.m.root);}
 swap(e,makeMonster({mon:KINDS[g.reward.kind]?.mon||'gosma',scale:g.reward.m.sc*Math.cbrt(fraction)}));
 Object.assign(e,{hp,maxhp,dmg,r:g.reward.r*Math.cbrt(fraction),range:g.reward.range*Math.cbrt(fraction),name:g.reward.name,act:null,gosmaGather347:false});
 clearLinks(g);g.members=[e];g.merged=true;pose(e,'Merge');floater(e.x,e.z,'A GOSMA SE REÚNE','#b0e784',true,2);
}
function update(dt){
 for(const g of groups){
  const alive=live(g);if(!alive.length){clearLinks(g);groups.delete(g);continue;}g.age+=dt;links(g,alive);
  if(g.merged)continue;
  const gather=isNight()&&g.age>=8;
  for(const e of alive)e.gosmaGather347=gather;
  if(!gather)continue;
  // A surviving fragment anchors the reunion; never teleport through obstacles.
  const anchor=alive[0];g.anchor=anchor;
  if(alive.every(q=>Math.hypot(q.x-anchor.x,q.z-anchor.z)<.3&&los(q.x,q.z,anchor.x,anchor.z)))merge(g,alive);
 }
}
function beforeAI(e,dt){
 if(e.gosmaSplit347>0){e.gosmaSplit347-=dt;e.m.mixer.update(dt);if(e.gosmaSplit347<=0)divide(e);return true;}
 if(e.gosmaPose347>0){e.gosmaPose347-=dt;e.m.mixer.update(dt);return true;}
 if(!e.gosmaGather347){
  const g=e.gosmaGroup347,variant=g&&KINDS[g.reward.kind]?.variant;
  if(variant&&!g.merged){const a=live(g)[0],max=variant==='f'?1.25:2.2;if(a&&a!==e){const dx=a.x-e.x,dz=a.z-e.z,d=Math.hypot(dx,dz);if(d>max){e.act=null;const step=Math.min(d-max,e.speed*dt);if(e.stun<=0)moveEnt(e,dx/d*step,dz/d*step);animChibi(e.m,{move:1,atk:0,dead:0,wind:0},e.t);e.m.root.position.set(e.x,0,e.z);return true;}}}
  return false;
 }
 const a=e.gosmaGroup347?.anchor;if(!a||a.dead)return false;
 e.act=null;const dx=a.x-e.x,dz=a.z-e.z,d=Math.hypot(dx,dz),step=Math.min(d,e.speed*dt);
 if(e.stun<=0&&d>.15){e.face=Math.atan2(dx,dz);moveEnt(e,dx/d*step,dz/d*step);}
 animChibi(e.m,{move:d>.15&&e.stun<=0?1:0,atk:0,dead:0,wind:0},e.t);e.m.root.position.set(e.x,0,e.z);e.m.root.rotation.y=e.face;return true;
}
window.Gosma347={afterDamage,beforeKill,beforeAI,update};
})();
