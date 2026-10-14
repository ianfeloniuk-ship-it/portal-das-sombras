/* Ancient threshold guardians: rigid stone, committed strikes and visible recovery. */
(function(){'use strict';
const variants={guardiao:{range:1.85,wind:.85,speed:1.6,label:'SOLEIRA!'},guardiao_f:{range:2.8,wind:1,speed:1.7,label:'RUPTURA!'},guardiao_a:{range:3.4,wind:1.1,speed:1.5,label:'VAZIO!'}};
function pose(e,n,dt,span){const m=e.m;if(m.glb){if(m.cur!==n){const duration=gAct(m,n)?.getClip().duration||1;gPlay(m,n,!['Idle','Walk'].includes(n),span?duration/span:1)}m.mixer.update(dt)}else animChibi(m,{move:n==='Walk'?1:0,atk:0,dead:0,wind:0},e.t);m.root.position.set(e.x,0,e.z);m.root.rotation.y=e.face;}
function step(e,x,z,dt,spd){const dx=x-e.x,dz=z-e.z,d=Math.hypot(dx,dz);if(d<.05)return false;turnTo(e,Math.atan2(dx,dz),dt,3);const s=Math.min(d,spd*dt),mx=dx/d*s,mz=dz/d*s;if(!freeAt(e.x+mx,e.z+mz,e.r)||kitBlocked111(e,e.x+mx,e.z+mz))return false;const ox=e.x,oz=e.z;moveEnt0(e,mx,mz);return Math.hypot(e.x-ox,e.z-oz)>.0001}
function beforeAI(e,dt){const def=variants[e.kind];if(!def||e.isBoss||e.ally)return false;e.act=null;
 const home=e.guardHome370||(e.guardHome370={x:e.x,z:e.z});const pt=pickTarget(e),T=pt&&pt.t;
 const hit=e.guardHp370==null?e.hp<e.maxhp:e.hp<e.guardHp370;e.guardHp370=e.hp;
 if(e.stun>0){e.guard370=null;e.cd=Math.max(e.cd,.3);pose(e,'HitRecieve',dt);return true}
 if(!e.guardAwake370){const radius=e.kind==='guardiao'?4.5:e.kind==='guardiao_f'&&T&&(T.mp||0)>0?6.5:5.5;if(hit||e.kitTaunt111>time||(T&&pt.d<radius&&los(e.x,e.z,T.x,T.z))){e.guardAwake370=true;e.aggro=true;e.guard370={phase:'wake',t:0}}else{e.aggro=false;pose(e,'Idle',dt);return true}}
 let a=e.guard370;
 if(a){a.t+=dt;if(a.phase==='wake'){pose(e,'Wake',dt,1);if(a.t>=1)e.guard370=null;return true}
  if(a.phase==='wind'){pose(e,'Windup',dt,def.wind);if(a.target.dead){e.guard370=null;e.cd=.3;return true}if(a.t>=def.wind){a.phase='attack';a.t=0;pose(e,'Attack',0,.58)}return true}
  if(a.phase==='attack'){
   pose(e,'Attack',dt,.58);
   if(!a.hit&&a.t>=.18){a.hit=true;const target=a.target,dx=target.x-e.x,dz=target.z-e.z,d=Math.hypot(dx,dz),angle=Math.abs(Math.atan2(Math.sin(Math.atan2(dx,dz)-a.face),Math.cos(Math.atan2(dx,dz)-a.face))),radial=e.kind==='guardiao_a';
    if(!target.dead&&d<def.range+(target.r||.4)&&(radial||angle<.85)&&los(e.x,e.z,target.x,target.z))dmgTo(target,e.dmg);
    if(radial)fxRing(e.x,e.z,0x8b49d6,def.range,.45);else fxSlash(e.x,e.z,a.face,e.kind==='guardiao_f'?0xae6eef:0xad9275,def.range);
   }
   if(a.t>=.58){a.phase='recover';a.t=0;e.cd=e.atkCd}return true;
  }
  pose(e,'Recover',dt,Math.max(.25,e.atkCd));if(a.t>=Math.max(.25,e.atkCd))e.guard370=null;return true;
 }
 if(!T||pt.d>12||Math.hypot(e.x-home.x,e.z-home.z)>10){const moving=step(e,home.x,home.z,dt,def.speed);pose(e,moving?'Walk':'Idle',dt);if(Math.hypot(e.x-home.x,e.z-home.z)<.15){e.guardAwake370=false;e.aggro=false}return true}
 const ang=Math.atan2(T.x-e.x,T.z-e.z);turnTo(e,ang,dt,3);
 if(pt.d<=def.range+.2&&e.cd<=0&&los(e.x,e.z,T.x,T.z)){
  e.face=ang;e.guard370={phase:'wind',t:0,target:T,face:ang,hit:false};floater(e.x,e.z,def.label,e.kind==='guardiao'?'#d6c0a0':'#c6a0ef',true,def.wind+.15);fxRing(e.x,e.z,e.kind==='guardiao'?0xb19b7a:0x9564d2,def.range,def.wind);pose(e,'Windup',0,def.wind);return true;
 }
 const moving=pt.d>def.range*.85&&step(e,T.x,T.z,dt,def.speed*(e.slow>0?.5:1));pose(e,moving?'Walk':'Idle',dt);return true;
}
window.Guardian370={beforeAI,variants};
})();
