/* v488: the four approved mage recipes, driven by actual game projectiles and canonical hit budgets. */
(function(){'use strict';
const G=window.Golpes487;if(!G)return;const X=G.fx,T=THREE,IDS=new Set(['8:1','9:0','10:0','11:0']),CIS=[8,9,10,11];
const recipe=ci=>G.referenceRecipes.find(r=>r.id===ci),heads=new Map();
function ctx(ci,e,pt){return X.context(ci,e,pt)}
function world(p){const v=X.pos(p.x,p.z);v.y=p.y??v.y+1;return v}
const P={handles:s=>!!s&&IDS.has(s.skillId),basic:ci=>CIS.includes(ci),immediate:s=>s.sourceClass===8,
 animationPlan:s=>({clip:null,overlay:s.sourceClass===8?'mage488_ceu':s.sourceClass===11?'mage488_raio':'mage488_lanca',duration:s.sourceClass===8?2.15:1.2}),
 pulseTimes:()=>null,
 start(s,K,cast){cast.sk=s;const ci=s.sourceClass,rs=recipe(ci);let list=cast.hits.length?[...new Set(cast.hits.map(h=>h[0]))]:K.list;
  if(ci===8){const c=ctx(ci,null,K.pt);c.cast=cast;c.skill=s;X.inContext(c,()=>{
   // Preserve the game's five pulse times. Each approved meteor lands on its corresponding real pulse.
   const base=c.foe.position.clone(),flight=Math.sqrt(3*3+9*9+2.2*2.2)/16;
   X.ringFlat(base,rs.col[1],3,3.2,(s.delay||.1)+(s.pulses-1)*.65+.5);
   for(let i=0;i<s.pulses;i++){const hitAt=(s.delay||.1)+i*.65,fly=Math.min(flight,hitAt),launch=hitAt-fly;
    X.at(launch,()=>{const g=base.clone().add(new T.Vector3((Math.random()-.5)*2.8,.1,(Math.random()-.5)*2.8));if(i===2)g.copy(base).setY(.1);const a=g.clone().add(new T.Vector3(-3,9,2.2));
     X.shot(a,g,a.distanceTo(g)/Math.max(.03,fly),p=>{const group=new T.Group(),rock=new T.Mesh(X.GEOS[i%8],X.crystalMat('magma'));rock.scale.set(.45,.6,.45);group.add(rock);const fire=X.orb(new T.Vector3(),1.4,rs.col,{fire:1});group.add(fire);group.position.copy(p);X.add(group);X.spawn(group,(o,dt,t)=>{rock.rotation.x+=dt*6;fire.quaternion.copy(camera.quaternion);fire.material.uniforms.uTime.value=time;return !!group.parent});return group},p=>rs.boom(p,1.6),{trail:[.8,rs.col]});
    });
   }
  });return}
  if(ci===9||ci===10){const dir=new T.Vector3(Math.sin(player.face),0,Math.cos(player.face)),chosen=list.slice().sort((a,b)=>Math.hypot(b.x-player.x,b.z-player.z)-Math.hypot(a.x-player.x,a.z-player.z))[0],pt={x:player.x+dir.x*s.range,z:player.z+dir.z*s.range},c=ctx(ci,chosen||null,pt);c.cast=cast;c.skill=s;X.inContext(c,()=>{rs.s();X.at(.92,()=>G.releaseCast(cast))});return}
  // The recipe has three jumps in its demo. Live casts use the exact canonical order, up to five.
  const c=ctx(ci,list[0]||null,K.pt);c.cast=cast;c.skill=s;c.recipeChain=true;c.chainCount=list.length;c.foes=Array.from({length:3},(_,i)=>X.actor(list[i]||list.at(-1)||null,list[i]?X.pos(list[i].x,list[i].z):X.pos((list.at(-1)||K.pt).x,(list.at(-1)||K.pt).z)));
  X.inContext(c,()=>{if(!list.length){X.fade(X.sprite(X.glowTex,c.hero.position.clone().setY(1.05),.2,{color:rs.col[1]}),.4,4);G.releaseCast(cast);return}rs.s();list.forEach((e,i)=>X.at(.32+i*.14,()=>{G.releaseTarget(cast,e);if(i>=3){const a=X.pos(list[i-1].x,list[i-1].z,.85),b=X.pos(e.x,e.z,.85);X.bolt(a,b,rs.col,{width:.22,life:.32,seg:14,jit:.5});X.bolt(a,b,rs.col,{width:.08,life:.26,seg:10,jit:.7});X.sparks(b,20,rs.col[1],6,3);X.ringFace(b,rs.col[1],.3,1.8,.3);X.crack(b,rs.col[1],1.8,.6);X.knock(X.actor(e),.35)}}))});
 },
 onShotImpact(c){if(c?.skill?.skillId==='8:1')G.releaseCast(c.cast)},
 prewarm(){const c=ctx(8,null,player);X.inContext(c,()=>{const p=c.hero.position;for(const pal of ['ice','stone','magma'])X.crystal(pal,p,.2,.2,0,X.UP,{chunks:0,bits:false});const o=X.orb(p.clone().setY(1),.2,recipe(8).col,{fire:1,noise:.8});X.spawn(o,()=>true);X.bolt(p.clone().setY(1),p.clone().setY(1.3),recipe(11).col,{width:.06,life:.3});X.smoke(p,1,0x9cc8ff,.2,.3,.2,.2)})},
 clear(){for(const p of heads.keys()){p.mesh?.traverse(o=>o.layers.set(0));delete p.fx487}heads.clear()},update(){}
};
G.providers.push(P);window.Magos488=P;
function impact(ci,p,e,big){const r=recipe(ci),c=ctx(ci,e||null,{x:p.x,z:p.z});c.foe.position=X.pos(p.x,p.z);const b=world(p);
 X.inContext(c,()=>{if(ci===8){r.boom(b,big?1.15:1);return}
  if(ci===9){X.bits('ice',b,8);X.sparks(b,10,r.col[1],4);X.ringFace(b,r.col[1],.2,1.2,.25);for(let k=0;k<3;k++)X.crystal('ice',X.pos(p.x+(Math.random()-.5)*.8,p.z+(Math.random()-.5)*.8),.35+Math.random()*.2,.6,.5,new T.Vector3(Math.random()-.5,0,Math.random()-.5).normalize(),{hold:.25,grow:.08,chunks:1});X.knock(c.foe,.22);return}
  if(ci===10){for(let k=0;k<8;k++)X.chunk('stone',c.foe.position,1.2);X.bits('stone',b,6);X.smoke(b,4,0x6a5240,.8,1,1,.35);X.sparks(b,8,r.col[1],3.5);X.crack(c.foe.position,r.col[1],1.6,.5);X.knock(c.foe,big?.45:.25);if(big)X.flash(.3,.5,.2);return}
  X.sparks(b,12,r.col[1],5,3);X.fade(X.sprite(X.glowTex,b,1,{color:r.col[1]}),.15,.5);X.knock(c.foe,.2);X.flash(.15,.35,.05);
 });
}
const shoot0=shoot;shoot=function(){const n=projs.length,s=G.legacySkill,r=shoot0.apply(this,arguments);if(!G.on)return r;
 for(let i=n;i<projs.length;i++){const p=projs[i],ci=P.handles(s)?s.sourceClass:p.basicClass;if(p.team!=='player'||!P.basic(ci)||p.skillHit&&!P.handles(s))continue;
  p.fx487={ci,sk:P.handles(s)?{...s}:null,start:world(p),serial:player.combo||1};p.mesh.traverse(o=>o.layers.set(31));const c=ctx(ci,null,{x:p.x,z:p.z}),rs=recipe(ci);
  X.inContext(c,()=>{let m;if(ci===8)m=X.orb(world(p),.75,rs.col,{fire:1,noise:.8});else if(ci===9||ci===10){m=new T.Mesh(X.GEOS[ci===9?2:Math.min(7,p.fx487.serial+2)],X.crystalMat(ci===9?'ice':'stone'));m.scale.set(...(ci===9?[.5,1.1,.5]:[.6,.6,.6]));m.position.copy(world(p));X.add(m)}else{m=new T.Group();m.position.copy(world(p));X.add(m)}heads.set(p,m);
   if(ci!==11)X.trail(()=>projs.includes(p)?world(p):null,ci===8?.45:ci===9?.22:.28,rs.col);
   let beamAt=0;X.spawn(m,(o,dt,t)=>{if(!projs.includes(p)||t>3){heads.delete(p);X.kill(o);return false}o.position.copy(world(p));if(ci===8){o.material.uniforms.uTime.value=time;X.faceCam(o)}else if(ci===9)o.quaternion.setFromUnitVectors(X.UP,new T.Vector3(p.vx,p.vy||0,p.vz).normalize());else if(ci===10){o.rotation.x+=dt*9;o.rotation.z+=dt*7;o.material.uniforms.uTime.value=time}else{beamAt-=dt;if(beamAt<=0){beamAt=.04;X.bolt(p.fx487.start,world(p),rs.col,{width:.14,life:.16})}}return true});
  });
 }
 return r;
};
const pi0=projectileImpact253;projectileImpact253=function(p){if(!G.projectile(p))return pi0.apply(this,arguments);const r=pi0.apply(this,arguments),e=[...p.hit].at(-1);impact(p.fx487.ci,p,e,p.third);return r};
// Motions authored on the existing rig. These do not move the collider or replace the normal attack clips.
const A=Anim303.A,ready={upperarm_r:[-70,0,-35],forearm_r:[-60,0,0],upperarm_l:[-75,0,30],forearm_l:[-60,0,0],spine:[8,0,0],thigh_l:[-15,0,0],shin_l:[20,0,0]};
A.mage488_ceu={d:2.15,gameClock:true,mage488:true,k:[{t:0,b:{}},{t:.16,b:{upperarm_r:[-160,0,-35],upperarm_l:[-150,0,35],forearm_r:[-20,0,0],chest:[-15,0,0],head:[-20,0,0]}},{t:.4,b:{...ready,upperarm_r:[-120,0,-35],upperarm_l:[-130,0,35],chest:[-10,15,0]}},{t:.7,b:{...ready,upperarm_r:[-95,0,-35],upperarm_l:[-110,0,35],chest:[10,-15,0]}},{t:.88,b:ready},{t:1,b:{}}]};
A.mage488_lanca={d:1.2,gameClock:true,mage488:true,k:[{t:0,b:{}},{t:.28,root:{y:-.05},b:{...ready,chest:[-10,-30,0],upperarm_r:[-145,0,-45],forearm_r:[-50,0,0],upperarm_l:[-45,0,25]}},{t:.42,b:{...ready,chest:[8,25,0],upperarm_r:[-100,0,-30],forearm_r:[-15,0,0]}},{t:.76,root:{y:-.12},b:{...ready,spine:[22,0,0],chest:[8,25,0],upperarm_r:[-110,0,-30],forearm_r:[-10,0,0],upperarm_l:[-90,0,30],thigh_l:[-30,0,0],shin_l:[35,0,0]}},{t:.88,b:ready},{t:1,b:{}}]};
A.mage488_raio={d:1.15,gameClock:true,mage488:true,k:[{t:0,b:{}},{t:.2,b:{...ready,chest:[-5,-20,0],forearm_r:[-100,0,0]}},{t:.29,b:{...ready,chest:[12,30,0],upperarm_r:[-105,0,-30],forearm_r:[-15,0,0]}},{t:.68,b:{...ready,chest:[8,20,0],upperarm_r:[-105,0,-30],forearm_r:[-15,0,0]}},{t:.84,b:ready},{t:1,b:{}}]};
})();
