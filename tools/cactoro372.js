/* Cactoros: rooted daylight defence, dusk locomotion and committed thorn shots. */
(function(){'use strict';
const defs={cactinho:{wind:.5,fire:.25,color:0xd6b77b,label:'ESPINHO!'},cactinho_f:{wind:.65,fire:.32,color:0xac72e2,label:'AGULHA!'},cactinho_a:{wind:.8,fire:.4,color:0x804ec4,label:'VAZIO!'}};
function active(e){return e.kind==='cactinho_a'||L.mode!=='world'||(dayT%DAYLEN)/DAYLEN>=.46&&(dayT%DAYLEN)/DAYLEN<.95;}
function pose(e,n,dt,span){const m=e.m;if(m.glb){if(m.cur!==n){const duration=gAct(m,n)?.getClip().duration||1;gPlay(m,n,!['Idle','Walk','Rooted'].includes(n),span?duration/span:1)}m.mixer.update(dt)}else animChibi(m,{move:n==='Walk'?1:0,atk:0,dead:0,wind:0},e.t);m.root.position.set(e.x,0,e.z);m.root.rotation.y=e.face;}
function beforeAI(e,dt){const d=defs[e.kind];if(!d||e.isBoss||e.ally)return false;e.act=null;const pt=pickTarget(e),T=pt&&pt.t;
 const hit=e.cactorHp372==null?e.hp<e.maxhp:e.hp<e.cactorHp372;e.cactorHp372=e.hp;if(hit)e.cactorAlert372=5;e.cactorAlert372=Math.max(0,(e.cactorAlert372||0)-dt);
 if(e.stun>0){e.cactor372=null;e.cd=Math.max(e.cd,.3);pose(e,'HitRecieve',dt);return true;}
 let a=e.cactor372;
 if(a){a.t+=dt;if(a.phase==='wind'){pose(e,'Windup',dt,d.wind);if(a.target.dead||a.target.hp<=0){e.cactor372=null;e.cd=.3;return true;}if(a.t>=d.wind){
 e.m.root.updateMatrixWorld(true);const b=e.m.model&&e.m.model.getObjectByName('Muzzle');const p=b?b.getWorldPosition(new THREE.Vector3()):new THREE.Vector3(e.x,.65,e.z);
 if(los(e.x,e.z,a.x,a.z)){const dx=a.x-p.x,dz=a.z-p.z,dy=a.y-(terrH(p.x,p.z)+p.y),len=Math.hypot(dx,dy,dz)||1;shoot(p.x,p.z,a.face,12,e.dmg,'enemy',d.color,'thorn372'+(e.kind.endsWith('_f')?'_f':e.kind.endsWith('_a')?'_a':''),{originY:p.y,dir3D:{x:dx/len,y:dy/len,z:dz/len}});}
 a.phase='fire';a.t=0;e.cd=e.atkCd;pose(e,'Fire',0,d.fire);}return true;}
 if(a.phase==='fire'){pose(e,'Fire',dt,d.fire);if(a.t>=d.fire){a.phase='recover';a.t=0;}return true;}
 pose(e,'Recover',dt,e.atkCd);if(a.t>=e.atkCd)e.cactor372=null;return true;}
 const mobile=active(e),provoked=e.cactorAlert372>0||e.kitTaunt111>time||e.kind==='cactinho_f'&&T&&(T.mp||0)>0;
 if(T&&pt.d<9&&(mobile||provoked||pt.d<3)&&los(e.x,e.z,T.x,T.z)){
  e.aggro=true;const ang=Math.atan2(T.x-e.x,T.z-e.z);turnTo(e,ang,dt,4);
  if(e.cd<=0){e.face=ang;e.cactor372={phase:'wind',t:0,target:T,x:T.x,z:T.z,y:terrH(T.x,T.z)+1,face:ang};floater(e.x,e.z,d.label,e.kind==='cactinho'?'#e2c18a':'#c7a0ed',true,d.wind+.15);pose(e,'Windup',0,d.wind);return true;}
  if(mobile&&pt.d>5){const step=Math.min(pt.d-5,e.speed*(e.slow>0?.5:1)*dt),dx=Math.sin(ang)*step,dz=Math.cos(ang)*step;if(freeAt(e.x+dx,e.z+dz,e.r)&&!kitBlocked111(e,e.x+dx,e.z+dz)){moveEnt0(e,dx,dz);pose(e,'Walk',dt);return true;}}
 }
 pose(e,mobile?'Idle':'Rooted',dt);return true;}
function projectile(kind){const g=new THREE.Group(),a=kind.endsWith('_a'),f=kind.endsWith('_f'),m=new THREE.MeshStandardMaterial({color:a?0x634578:f?0xb17bd9:0xd1b784,roughness:.65,metalness:0,emissive:a?0x22112f:f?0x180a21:0});
 const needle=new THREE.Mesh(new THREE.ConeGeometry(a?.075:.045,a?.4:.32,a||f?5:7),m);needle.rotation.x=Math.PI/2;g.add(needle);if(f){const shard=new THREE.Mesh(new THREE.OctahedronGeometry(.07),m);shard.scale.y=1.8;g.add(shard);}return g;}
window.Cactoro372={beforeAI,defs,active,projectile};
})();
