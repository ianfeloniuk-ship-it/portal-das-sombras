/* Slime Rosa: a lone normal slime is peaceful; packs surround and envelop.
   Dedicated variants preserve their own silhouettes and attack timing. */
(function(){
'use strict';
const family=e=>(KINDS[e.kind]?.baseKind||e.kind)==='slime';
function pose(e,name,dt,phase){
 const m=e.m;
 if(m.glb){
  if(m.cur!==name){if(name==='ATK'){m.mixer.stopAllAction();m.cur=null;}gPlay(m,name,name==='ATK'||name==='Hit_A',1);}
  if(name==='ATK'&&phase!=null){const a=gAct(m,name);a.time=a.getClip().duration*Math.max(0,Math.min(.999,phase));m.mixer.update(0);}else m.mixer.update(dt);
 }else animChibi(m,{move:name==='Running_A'?1:0,wind:0,atk:name==='ATK'?.5:0,dead:0},e.t);
 m.root.position.set(e.x,0,e.z);m.root.rotation.y=e.face;
}
function beforeAI(e,dt){
 if(!family(e)||e.isBoss||e.ally)return false;
 e.act=null;
 if(e.slimeHp360!=null&&e.hp<e.slimeHp360)e.slimeAnger360=5;
 e.slimeHp360=e.hp;e.slimeAnger360=Math.max(0,(e.slimeAnger360||0)-dt);
 if(e.stun>0){e.slime360=null;pose(e,'Hit_A',dt);return true;}
 const pack=enemies.filter(q=>!q.dead&&!q.ally&&family(q)&&Math.hypot(q.x-e.x,q.z-e.z)<8);
 const aggressive=!!KINDS[e.kind]?.variant||pack.length>=2||e.slimeAnger360>0||e.kitTaunt111>time;
 let a=e.slime360;
 if(a){
  a.t+=dt;const d=Math.hypot(a.target.x-e.x,a.target.z-e.z);
  if(a.target.dead||d>e.range+.9||!los(e.x,e.z,a.target.x,a.target.z)){e.slime360=null;e.cd=Math.max(e.cd,.3);pose(e,'Idle',dt);return true;}
  const duration=e.wind+.8;pose(e,'ATK',dt,a.t<e.wind?.3*a.t/e.wind:.3+.7*(a.t-e.wind)/.8);
  for(let i=a.hits;i<3;i++){if(a.t<e.wind+i*.24)break;a.hits++;if(d<=e.range+.3)dmgTo(a.target,e.dmg/3);}
  if(a.t>=duration){e.slime360=null;e.cd=e.atkCd;}
  return true;
 }
 const pt=aggressive?pickTarget(e):null;
 if(!pt||pt.d>10){pose(e,'Idle',dt);return true;}
 turnTo(e,Math.atan2(pt.t.x-e.x,pt.t.z-e.z),dt,8);
 if(pt.d<=e.range+.1&&e.cd<=0&&los(e.x,e.z,pt.t.x,pt.t.z)){
  e.slime360={target:pt.t,t:0,hits:0};pose(e,'ATK',dt,0);return true;
 }
 if(e.cd>0){pose(e,'Idle',dt);return true;}
 let tx=pt.t.x,tz=pt.t.z;
 if(pack.length>=2&&pt.d<6){
  const index=Math.max(0,pack.indexOf(e)),angle=index*Math.PI*2/pack.length,radius=e.range*.75;
  tx+=Math.sin(angle)*radius;tz+=Math.cos(angle)*radius;
 }
 const dx=tx-e.x,dz=tz-e.z,d=Math.hypot(dx,dz),step=Math.min(d,e.speed*(e.slow>0?.5:1)*dt);
 let moved=false;
 if(d>.08){const nx=e.x+dx/d*step,nz=e.z+dz/d*step;if(freeAt(nx,nz,e.r)&&!kitBlocked111(e,nx,nz)){moveEnt0(e,nx-e.x,nz-e.z);moved=true;}}
 pose(e,moved?'Running_A':'Idle',dt);return true;
}
window.Slime360={beforeAI,family};
})();
