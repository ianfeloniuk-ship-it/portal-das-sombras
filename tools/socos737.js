/* socos737.js — Guerreiro sem arma: socos novos com o dourado do Guerreiro (técnica aprovada da golpes487). */
(()=>{'use strict';
const COL=[0xffffff,0xffc94d,0xff5a10];
let n=0,last=0;
function fx(){const G=window.Golpes487,F=G&&G.on&&G.fx;if(!F)return;
 const now=performance.now();n=now-last>1200?1:n+1;last=now;const big=n%3===0;
 const a=aimPoint(),T=F.T,dir=new T.Vector3(a.x-player.x,0,a.z-player.z);if(dir.lengthSq()<.01)return;dir.normalize();
 const y=terrH(player.x,player.z)+1.05,p=new T.Vector3(player.x,y,player.z).addScaledVector(dir,1);
 F.at(.1,()=>{F.ringDir(p.clone().addScaledVector(dir,.3),dir,COL[1],.2,big?2:1,.2);F.sparks(p,big?18:8,COL[1],big?6:4.5);
  F.fade(F.sprite(F.glowTex,p,big?1.2:.6,{color:COL[1]}),.16,1);
  if(big){F.flash(.5,.6,.2);F.ringFlat(new T.Vector3(p.x,y-1,p.z),COL[1],.4,3,.35);F.crack(new T.Vector3(p.x,y-1,p.z),COL[1],2,.5)}})}
const a0=window.attack;if(typeof a0!=='function')return;
window.attack=function(){const c=player&&player.atkCd,r=a0.apply(this,arguments);
 try{if(player&&player.atkCd>c&&animWep173()==='brawl'&&basicAttackId()===0)fx()}catch(e){console.warn('socos737',e)}return r};
window.Socos737={fx};})();
