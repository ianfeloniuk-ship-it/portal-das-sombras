/* Nearby workers reuse the existing population and character models.
   Routes and cargo are transient: no save migration and no background economy. */
(()=>{
 const jobs=['Pescador','Lenhador','Minerador'],counts=new Map();
 const baseSpawn=spawnCitizen,baseNpc=updNpc;
 function site(n){const c=n.home,j=n.job348;
  if(j===0){const spots=L.inter.filter(i=>i.type==='fish'&&Math.hypot(i.x-c.x,i.z-c.z)<180);return spots.sort((a,b)=>Math.hypot(a.x-c.x,a.z-c.z)-Math.hypot(b.x-c.x,b.z-c.z))[0]||{x:c.x-7,z:c.z-4}}
  if(j===2){const g=gates.filter(g=>!g.dead&&!g.red&&Math.hypot(g.x-c.x,g.z-c.z)<180).sort((a,b)=>Math.hypot(a.x-c.x,a.z-c.z)-Math.hypot(b.x-c.x,b.z-c.z))[0];if(g)return{x:g.x+5,z:g.z+3}}
  let best=null,dist=180;for(const ch of chunks.values())for(const q of ch.cols){if(j===1?q.r!==.8:q.h==null)continue;const d=Math.hypot(q.x-c.x,q.z-c.z);if(d<50||d>dist)continue;const a=Math.atan2(c.z-q.z,c.x-q.x),x=q.x+Math.cos(a)*(q.r+1.1),z=q.z+Math.sin(a)*(q.r+1.1);if(worldFree(x,z,.5)){best={x,z};dist=d}}return best;
 }
 function route(n,to){const c=n.home,fromOut=Math.hypot(n.x-c.x,n.z-c.z)>35*CITYK,toOut=Math.hypot(to.x-c.x,to.z-c.z)>35*CITYK;
  const pts=[];if(fromOut!==toOut){const q=toOut?to:n,a=Math.round(Math.atan2(q.z-c.z,q.x-c.x)/(Math.PI/2))*(Math.PI/2),inner={x:c.x+Math.cos(a)*27*CITYK,z:c.z+Math.sin(a)*27*CITYK},outer={x:c.x+Math.cos(a)*42*CITYK,z:c.z+Math.sin(a)*42*CITYK};pts.push(...(toOut?[inner,outer]:[outer,inner]))}pts.push({x:to.x,z:to.z});n.workRoute348=pts;
 }
 function assign(n,j){if(n.cargo348)n.m.root.remove(n.cargo348);n.job348=j;n.short=n.name+' · '+jobs[j];n.workPhase348='ida';n.workWait348=0;n.workSite348=site(n);if(!n.workSite348){delete n.job348;return n}route(n,n.workSite348);
  const cargo=new THREE.Mesh(geo('workerCargo348',()=>new THREE.BoxGeometry(.5,.6,.4)),toonS(j===0?0x8f7044:j===1?0x6e4930:0x767f88));cargo.position.set(0,1,-.35);cargo.visible=false;n.m.root.add(cargo);n.cargo348=cargo;
  n.use=()=>speech153(n,n.workPhase348==='volta'?'Estou levando '+['peixes','madeira','minério'][j]+' para '+n.home.name+'.':['Vou pescar e levar a pesca ao mercado.','Recolho madeira fora das muralhas.','Extraio minério perto das Fendas.'][j],jobs[j]);return n;
 }
 spawnCitizen=function(c){const n=baseSpawn(c),i=counts.get(c.id)||0;counts.set(c.id,i+1);return i%4<3?assign(n,i%4):n};
 updNpc=function(n,dt){if(n.job348==null||n.gone||L.mode!=='world')return baseNpc(n,dt);
  if(enemies.some(e=>!e.dead&&!e.gone&&cityRaider341(e)&&Math.hypot(e.x-n.x,e.z-n.z)<20)){n.workRoute348=null;return baseNpc(n,dt)}
  n.panic348=false;n.t+=dt;let moving=0;
  if(!n.workRoute348)route(n,n.workPhase348==='volta'?{x:n.home.x+5,z:n.home.z+9}:n.workSite348);
  const p=n.workRoute348[0];if(p){const dx=p.x-n.x,dz=p.z-n.z,d=Math.hypot(dx,dz);if(d<1.3)n.workRoute348.shift();else{const a=Math.atan2(dx,dz),step=Math.min(d,dt*2.4);let chosen=a;for(const off of [0,.65,-.65,1.2,-1.2]){const q=a+off;if(worldFree(n.x+Math.sin(q)*(step+.6),n.z+Math.cos(q)*(step+.6),n.r)){chosen=q;break}}turnTo(n,chosen,dt,6);moveEnt(n,Math.sin(chosen)*step,Math.cos(chosen)*step);moving=1}}
  else {n.workWait348+=dt;if(n.workWait348>= (n.workPhase348==='volta'?3:8)){n.workWait348=0;if(n.workPhase348==='volta'){n.workPhase348='ida';n.deliveries348=(n.deliveries348||0)+1;n.cargo348.visible=false;route(n,n.workSite348)}else{n.workPhase348='volta';n.cargo348.visible=true;route(n,{x:n.home.x+5,z:n.home.z+9})}}}
  animChibi(n.m,{move:moving,atk:!moving&&n.workPhase348==='ida'&&n.job348!==0?Math.max(0,Math.sin(n.t*3)):0,dead:0,wind:0},n.t);n.m.root.position.set(n.x,0,n.z);n.m.root.rotation.y=n.face;
 };
 // Small fishing boats are attached to streamed water chunks and vanish with them.
 const boats=new Set(),baseWater=buildWater239;
 buildWater239=function(ch,g,addCol){baseWater(ch,g,addCol);const x0=ch.cx*CH,z=ch.cz*CH,rv=riverNear239(x0,z),b=snowB(rv.x,z);if(boats.size>=3||rh(ch.cx,ch.cz,348)%3||rv.d>CH/2-6||b<.34||b>.66||nearestCity(rv.x,z).d<220||onRoad(roadSegs(rv.x,z,1),rv.x,z,12))return;
  const root=new THREE.Group();root.userData.terrainRoot245=true;root.position.set(rv.x,.12,z);const shape=new THREE.Shape();shape.moveTo(0,-2);shape.lineTo(.75,-1.1);shape.lineTo(.8,1.2);shape.lineTo(0,2);shape.lineTo(-.8,1.2);shape.lineTo(-.75,-1.1);shape.closePath();
  const bottom=new THREE.Mesh(new THREE.ShapeGeometry(shape),toonS(0x624028));bottom.rotation.x=-Math.PI/2;bottom.position.y=.015;bottom.userData.own=true;root.add(bottom);const inner=new THREE.Path();inner.moveTo(0,-1.6);inner.lineTo(-.55,-.85);inner.lineTo(-.6,1);inner.lineTo(0,1.6);inner.lineTo(.6,1);inner.lineTo(.55,-.85);inner.closePath();shape.holes.push(inner);
  const hull=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.35,bevelEnabled:false}),toonS(0x6b452a));hull.rotation.x=Math.PI/2;hull.userData.own=true;root.add(hull);for(const side of [-1,1]){const rail=new THREE.Mesh(geo('boatRail348',()=>new THREE.BoxGeometry(.15,.3,2.5)),toonS(0x8f623a));rail.position.set(side*.7,.12,0);root.add(rail)}
  for(const z of [-.85,.85]){const seat=new THREE.Mesh(geo('boatSeat349',()=>new THREE.BoxGeometry(1.15,.12,.28)),toonS(0x9b7048));seat.position.set(0,.02,z);root.add(seat)}
  const rod=new THREE.Mesh(geo('boatRod349',()=>new THREE.CylinderGeometry(.018,.025,2.1,5)),toonS(0x62452a));rod.position.set(.45,1.25,.8);rod.rotation.x=1.15;root.add(rod);const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(.45,1.68,1.75),new THREE.Vector3(.45,-.04,2.3)]),new THREE.LineBasicMaterial({color:0xcec5ad}));line.userData.own=true;root.add(line);
  const m=makeChibi({gk:'Rogue',wep:'none',body:0x6b704a,scale:.65});m.root.position.set(0,.03,0);root.add(m.root);g.add(root);const boat={root,ch,m,b:rv.b,z,t:0};boats.add(boat);ch.boat348=boat;
 };
 const baseUnload=unloadChunk;unloadChunk=function(ch){if(ch.city)counts.delete(ch.city.id);const b=ch.boat348;if(b){boats.delete(b);b.root.traverse(o=>{if(o.isLine)o.material.dispose()});b.m.mixer?.stopAllAction();b.m.mixer?.uncacheRoot(b.m.model||b.m.root)}return baseUnload(ch)};
 const baseUpdate=update;update=function(dt){baseUpdate(dt);for(const b of boats){if(!b.root.parent||!chunks.has(b.ch.key)||L.mode!=='world'){boats.delete(b);continue}b.t+=dt;const z=b.z+Math.sin(b.t*.07)*6,x=riverCenter239(b.b,z);b.root.position.set(x,.12+Math.sin(b.t*1.4)*.035,z);b.root.rotation.y=Math.atan2(riverCenter239(b.b,z+.5)-x,.5);animChibi(b.m,{move:0,atk:0,dead:0,wind:0},b.t)}};
 const baseWorld=buildWorld;buildWorld=function(...args){boats.clear();counts.clear();return baseWorld.apply(this,args)};
 window.Workers348={jobs,assign,site,route,boats};
})();
