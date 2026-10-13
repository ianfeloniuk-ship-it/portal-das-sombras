/* Cavaleiro Escaravelho: straight patrol and a telegraphed charge at shiny equipment. */
(function(){
'use strict';
function shiny(t){
 if(t.shiny352!=null)return !!t.shiny352;
 const gear=t===player?run.equip:t.equip,w=gear&&gear.w,a=gear&&gear.a;
 // Metal blades reflect light; rarity glow follows gearLook's existing rule.
 return !!((w&&(/^(sword|dagger|axe|mace|spear|hammer)$/.test(weaponKind272(w))||w.rar>0))||(a&&a.rar>0));
}
function target(e){
 const pt=pickTarget(e);if(!pt)return null;
 if(e.beetleAnger352>0||e.kitTaunt111>time)return pt;
 const candidates=[pt.t,...allies];
 if(!player.dead&&player.stealth<=0&&(!inCity(player.x,player.z)||(cityRaider341(e)&&inCity(e.x,e.z))))candidates.push(player);
 let best=null;
 for(const t of candidates){if(t.dead||!shiny(t))continue;const d=Math.hypot(t.x-e.x,t.z-e.z);if(d<10&&(!best||d<best.d)&&los(e.x,e.z,t.x,t.z))best={t,d};}
 return best;
}
function pose(e,n,dt,once=false){const m=e.m;if(m.glb){if(m.cur!==n)gPlay(m,n,once,1);m.mixer.update(dt);}else animChibi(m,{move:n==='Walk'||n==='Charge'?1:0,atk:0,wind:0,dead:0},e.t);m.root.position.set(e.x,0,e.z);m.root.rotation.y=e.face;}
function stop(e,a){a.phase='recover';a.t=0;e.cd=e.atkCd;}
function beforeAI(e,dt){
 if(e.kind!=='escaravelho'||e.isBoss||e.ally)return false;
 e.act=null;
 if(e.beetleHp352!=null&&e.hp<e.beetleHp352)e.beetleAnger352=5;
 e.beetleHp352=e.hp;e.beetleAnger352=Math.max(0,(e.beetleAnger352||0)-dt);
 if(e.stun>0){e.beetle352=null;e.cd=Math.max(e.cd,.3);pose(e,'HitRecieve',dt,true);return true;}
 let a=e.beetle352;
 if(a){
  a.t+=dt;
  if(a.phase==='wind'){
   turnTo(e,Math.atan2(a.dx,a.dz),dt,12);pose(e,'Windup',dt,true);
   if(a.target.dead||!los(e.x,e.z,a.x,a.z)){e.beetle352=null;e.cd=.3;return true;}
   if(a.t>=e.wind){a.phase='charge';a.t=0;e.face=Math.atan2(a.dx,a.dz);}
  }else if(a.phase==='charge'){
   const ox=e.x,oz=e.z,speed=e.slow>0?6:12,step=Math.min(speed*dt,a.left);
   const nx=ox+a.dx*step,nz=oz+a.dz*step;
   // No pathfinder or axis sliding during a committed straight charge.
   if(!freeAt(nx,nz,e.r)||kitBlocked111(e,nx,nz)){stop(e,a);pose(e,'Impact',dt,true);return true;}
   moveEnt0(e,a.dx*step,a.dz*step);
   const vx=e.x-ox,vz=e.z-oz,moved=Math.hypot(vx,vz);a.left-=moved;
   const T=a.target,q=Math.max(0,Math.min(1,((T.x-ox)*vx+(T.z-oz)*vz)/(vx*vx+vz*vz||1)));
   if(!a.hit&&!T.dead&&Math.hypot(T.x-ox-vx*q,T.z-oz-vz*q)<e.r+(T.r||.5)&&los(e.x,e.z,T.x,T.z)){a.hit=true;dmgTo(T,e.dmg);fxSlash(e.x,e.z,e.face,0xc8a050,e.range);stop(e,a);}
   pose(e,a.phase==='recover'?'Impact':'Charge',dt,a.phase==='recover');
   if(a.left<=.01||moved<step*.8||a.t>1.5)stop(e,a);
  }else{pose(e,a.t<.3?'Impact':'Recover',dt,true);if(a.t>=e.atkCd)e.beetle352=null;}
  return true;
 }
 const pt=target(e);
 if(pt&&pt.d<10&&e.cd<=0&&los(e.x,e.z,pt.t.x,pt.t.z)){
  const d=pt.d||1;e.beetle352={phase:'wind',t:0,target:pt.t,x:pt.t.x,z:pt.t.z,dx:(pt.t.x-e.x)/d,dz:(pt.t.z-e.z)/d,left:Math.min(12,d+2),hit:false};
  floater(e.x,e.z,'INVESTIDA!','#e8c582',true,e.wind+.3);pose(e,'Windup',dt,true);return true;
 }
 if(e.cd>0){pose(e,'Idle',dt);return true;}
 const d=e.speed*(e.slow>0?.5:1)*dt,dx=Math.sin(e.face)*d,dz=Math.cos(e.face)*d;
 if(freeAt(e.x+dx,e.z+dz,e.r)&&!kitBlocked111(e,e.x+dx,e.z+dz)){moveEnt0(e,dx,dz);pose(e,'Walk',dt);}
 else{e.face+=Math.PI*.5;pose(e,'Idle',dt);}
 return true;
}
window.Beetle352={beforeAI,shiny,target};
})();
