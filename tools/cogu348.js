/* Cogumelinho: flee, then vent a telegraphed sleep cloud when cornered. */
(function(){
'use strict';
const radius=2.8,wind=.7,recovery=1.5;
function asleep(a){return !!a&&!a.dead&&(a.sleep348||0)>time;}
function wake(a){if(a)a.sleep348=0;}
function sleep(a){
 if(!a||a.dead||a.caravan||a.defenseCore||(a.sleepImmune348||0)>time||(a===player&&a.iT>0))return false;
 const resistance=a===player?clamp(pStatusRes281(),0,.9):0;
 a.sleep348=time+2*(1-resistance);a.sleepImmune348=a.sleep348+6;a.act=null;
 if(a===player){a.atkT=0;a.skillAnim155=null;a.dodgeT=0;a.dashDmg=null;if(typeof CM154!=='undefined')CM154.charge=null;}
 floater(a.x,a.z,'SONO','#bed3ff',true,2);return true;
}
function beforeAI(e,dt){
 if(e.kind!=='cogu'||e.isBoss||e.ally)return false;
 e.coguCd348=Math.max(0,(e.coguCd348||0)-dt);e.act=null;
 if(e.stun>0){e.coguCast348=null;animChibi(e.m,{move:0,atk:0,dead:0,wind:0},e.t);return true;}
 const cast=e.coguCast348;
 if(cast){
  cast.t+=dt;e.m.mixer?.update(dt);
  if(!cast.done&&cast.t>=wind){cast.done=true;fxBurst(e.x,.65,e.z,0xaaca78,28,1.5);fxRing(e.x,e.z,0xc4db95,radius,.7);
   for(const a of [player,...allies])if(a&&!a.dead&&Math.hypot(a.x-e.x,a.z-e.z)<=radius+(a.r||.4)&&los(e.x,e.z,a.x,a.z))sleep(a);
  }
  if(cast.t>=recovery){e.coguCast348=null;e.coguCd348=6;}
  return true;
 }
 const pt=pickTarget(e);let moving=0;
 if(pt&&pt.d<10){
  const away=Math.atan2(e.x-pt.t.x,e.z-pt.t.z),speed=e.speed*(e.slow>0?.5:1),oldX=e.x,oldZ=e.z;
  let escape=null;
  for(const off of [0,-.6,.6,-1.15,1.15]){
   const x=Math.sin(away+off),z=Math.cos(away+off);
   if(freeAt(e.x+x*1.1,e.z+z*1.1,e.r)&&los(e.x,e.z,e.x+x*1.1,e.z+z*1.1)){escape={x,z};break;}
  }
  const trapped=!escape||pt.d<1+(pt.t.r||.4);
  if(trapped&&e.coguCd348<=0){e.coguCast348={t:0,done:false};e.coguCd348=6;
   if(e.m.glb){e.m.mixer.stopAllAction();gPlay(e.m,'Spore',true,1);}
   fxRing(e.x,e.z,0xd1e790,radius,wind);floater(e.x,e.z,'ESPOROS!','#cddd9b',true,1.5);
  }else if(escape){moveEnt(e,escape.x*speed*dt,escape.z*speed*dt);moving=Math.hypot(e.x-oldX,e.z-oldZ)>.001?1:0;turnTo(e,away,dt,9);}
 }
 if(!e.coguCast348)animChibi(e.m,{move:moving,atk:0,dead:0,wind:0},e.t);
 e.m.root.position.set(e.x,0,e.z);e.m.root.rotation.y=e.face;return true;
}
window.Cogu348={asleep,wake,sleep,beforeAI};
})();
