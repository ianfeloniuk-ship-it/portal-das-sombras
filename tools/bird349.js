/* Passaro Bravo: flank first, then a committed, avoidable diving pass. */
(function(){
'use strict';
function pose(e,name,dt,once=false){
 const m=e.m;if(m.glb){if(m.cur!==name)gPlay(m,name,once,1);m.mixer.update(dt);}else animChibi(m,{move:name==='Flight'?1:0,atk:0,wind:0,dead:0},e.t);
 m.root.position.set(e.x,0,e.z);m.root.rotation.y=e.face;
}
function lateral(e,t){const d=Math.hypot(e.x-t.x,e.z-t.z)||1;return Math.abs(((e.x-t.x)*Math.sin(t.face||0)+(e.z-t.z)*Math.cos(t.face||0))/d)<.45;}
function beforeAI(e,dt){
 if(!/^passaro(?:_[fa])?$/.test(e.kind)||e.isBoss||e.ally)return false;
 e.act=null;
 if(e.stun>0){e.bird349=null;e.cd=Math.max(e.cd,.5);pose(e,'Idle',dt);return true;}
 const pt=pickTarget(e);if(!pt||pt.d>24){e.bird349=null;pose(e,'Idle',dt);return true;}
 const T=pt.t;if(!e.aggro){if(pt.d<12&&los(e.x,e.z,T.x,T.z))e.aggro=true;else{pose(e,'Idle',dt);return true;}}
 let a=e.bird349;
 if(a&&a.target!==T){e.bird349=null;a=null;}
 if(a){a.t+=dt;
  if(a.phase==='wind'){
   if(!lateral(e,T)||!los(e.x,e.z,T.x,T.z)){e.bird349=null;e.cd=.3;pose(e,'Flight',dt);return true;}
   turnTo(e,Math.atan2(T.x-e.x,T.z-e.z),dt,8);pose(e,'Takeoff',dt,true);
   if(a.t>=e.wind){const d=Math.hypot(T.x-e.x,T.z-e.z)||1;a.phase='dive';a.t=0;a.dx=(T.x-e.x)/d;a.dz=(T.z-e.z)/d;a.duration=Math.min(.8,(d+2)/13);a.hit=false;e.face=Math.atan2(a.dx,a.dz);}
  }else if(a.phase==='dive'){
   const ox=e.x,oz=e.z;const speed=e.slow>0?6.5:13;moveEnt(e,a.dx*speed*dt,a.dz*speed*dt);
   const vx=e.x-ox,vz=e.z-oz,q=Math.max(0,Math.min(1,((T.x-ox)*vx+(T.z-oz)*vz)/(vx*vx+vz*vz||1)));
   if(!a.hit&&Math.hypot(T.x-ox-vx*q,T.z-oz-vz*q)<e.r+(T.r||.5)&&los(e.x,e.z,T.x,T.z)){a.hit=true;dmgTo(T,e.dmg*1.2);fxSlash(e.x,e.z,e.face,0xd19a5c,e.range);}
   pose(e,'Dive',dt,true);
   if(a.t>=a.duration||Math.hypot(vx,vz)<.001){a.phase='recover';a.t=0;e.cd=e.atkCd;}
  }else{pose(e,'Recover',dt,true);if(a.t>=.6)e.bird349=null;}
  return true;
 }
 const side=e.birdSide349||(e.birdSide349=Math.random()<.5?-1:1),f=T.face||0;
 const goals=[side,-side].map(k=>({x:T.x+Math.cos(f)*4*k,z:T.z-Math.sin(f)*4*k}));
 const goal=goals.find(g=>freeAt(g.x,g.z,e.r)&&los(e.x,e.z,g.x,g.z));
 if(goal){const dx=goal.x-e.x,dz=goal.z-e.z,d=Math.hypot(dx,dz)||1,step=Math.min(d,e.speed*(e.slow>0?.5:1)*dt);moveEnt(e,dx/d*step,dz/d*step);turnTo(e,Math.atan2(dx,dz),dt,8);}
 pose(e,goal?'Flight':'Idle',dt);
 const d=Math.hypot(e.x-T.x,e.z-T.z);
 if(e.cd<=0&&d>2&&d<6&&lateral(e,T)&&los(e.x,e.z,T.x,T.z)){e.bird349={phase:'wind',target:T,t:0};floater(e.x,e.z,'MERGULHO!','#e5b777',true,e.wind+.3);}
 return true;
}
window.Bird349={beforeAI,lateral};
})();
