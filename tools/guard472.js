/* v472 (Ian, 19/10/2026): defender, aparar e contra-atacar (referência: combate do Enshrouded e reel de parry).
   "Defender no botão direito do mouse; a câmera vai para o botão do meio." Vale para todas as classes e armas.
   DEFENDER  segurar o botão direito: golpes de frente (até ~75° para cada lado) causam só 50% do dano (25% com
             escudo); cada golpe defendido gasta Estamina (8 + 25% do dano, metade com escudo). Sem Estamina a
             guarda quebra: fica lento e sem poder defender por 1,5 s. Defendendo, anda a 55% da velocidade.
   APARAR    começar a defender até 0,22 s antes do golpe (0,32 s com escudo): nenhum dano, faíscas, "APARADO!",
             o inimigo fica atordoado 1,2 s (chefe 0,5 s) e o próximo golpe em 1,6 s é CONTRA-ATAQUE (dano x1,8,
             conta como crítico). Tiros também podem ser aparados, mas só pela frente.
   ESCUDADA  defendendo + botão esquerdo: empurra o inimigo da frente 2,5 m e atordoa 0,7 s (só com escudo, a cada
             1,2 s, 15 de Estamina). Sem escudo, o botão esquerdo defendendo não ataca.
   AVISO     inimigos que vão golpear o jogador piscam branco no começo da preparação (dá tempo de aparar).
   Escudo: lido de run.equip.sh (slot de escudo); enquanto o slot não existir, ninguém tem escudo. */
(function(){
'use strict';
if(typeof hurtPlayer!=='function'||typeof hurtEnemy!=='function'||typeof attack!=='function')return;
const G=window.Guard472={on:true,stats:{blocks:0,parries:0,counters:0,bashes:0,breaks:0,tells:0}};
const P_=()=>player;
const now=()=>(typeof time==='number'?time:performance.now()/1000);
let held=false,t0=-9,bashCd=0,counterUntil=-9,breakUntil=-9;
const hasShield=()=>{try{return !!(run&&run.equip&&run.equip.sh)}catch(_){return false}};
const blocking=()=>held&&G.on&&now()>=breakUntil&&P_()&&!P_().dead&&!(P_().dodgeT>0)&&!(P_().stunT>0)&&!run?.mounted;
G.blocking=blocking;G.hasShield=hasShield;
function vigor(){try{return martialState260()}catch(_){return null}}
function spend(n){const r=vigor();if(!r)return true;if(r.vigor<n){r.vigor=0;return false}r.vigor-=n;r.vigorWait=Math.max(r.vigorWait||0,1.2);return true}

/* ---------- entrada: botão direito ---------- */
const C=document.getElementById('c');
function down(e){if(e.pointerType==='touch'||e.button!==2)return;if(!started||paused||modalOpen)return;held=true;t0=now();e.preventDefault()}
function up(e){if(e.button===2)held=false}
C.addEventListener('pointerdown',down);addEventListener('pointerup',up);addEventListener('blur',()=>{held=false});

/* ---------- dano recebido ---------- */
function frontal(src){const P=P_();if(!src||src.x==null)return true;const a=Math.atan2(src.x-P.x,src.z-P.z);let d=a-P.face;d=Math.atan2(Math.sin(d),Math.cos(d));return Math.abs(d)<1.3}
const HP0=hurtPlayer;
hurtPlayer=function(amt,compat){
 const P=P_();if(!blocking()||!P||P.iT>0||!(amt>0))return HP0.apply(this,arguments);
 const src=(typeof curAtk!=='undefined'&&curAtk)||null;if(!frontal(src))return HP0.apply(this,arguments);
 const sh=hasShield(),win=sh?.32:.22,since=now()-t0;
 if(since<=win){/* APARAR */
  G.stats.parries++;counterUntil=now()+1.6;
  if(src&&!src.dead){const st=src.isBoss?.5:1.2;src.stun=Math.max(src.stun||0,st);src.act=null;src.cd=Math.max(src.cd||0,st);try{const dx=src.x-P.x,dz=src.z-P.z,l=Math.hypot(dx,dz)||1;moveEnt(src,dx/l*.8,dz/l*.8)}catch(_){}}
  try{bigText('APARADO!',700)}catch(_){}
  try{floater(P.x,P.z,'APARADO!','#ffe9a8',true,2.4)}catch(_){}
  try{const fx=src||P,mx=(P.x+fx.x)/2,mz=(P.z+fx.z)/2;fxRing(mx,mz,0xffe9a8,1.6,.3);fxBurst(mx,1.3,mz,0xfff2c0,16,7)}catch(_){}
  try{hitstop(.12);shake(.18)}catch(_){}
  try{sfx('block')}catch(_){}
  if(window.Flip470&&src)try{Flip470.spawn('dust',(P.x+src.x)/2,.6,(P.z+src.z)/2,1.4,{grow:.4,op:.7})}catch(_){}
  return}
 /* DEFENDER */
 G.stats.blocks++;const cost=Math.round((8+amt*.25)*(sh?.5:1));
 if(!spend(cost)){G.stats.breaks++;held=false;breakUntil=now()+1.5;P.slowT=Math.max(P.slowT||0,1.5);try{floater(P.x,P.z,'GUARDA QUEBRADA','#ff8a6a',true,2.2);shake(.3)}catch(_){}return HP0.call(this,amt,compat)}
 try{if(now()>=(P.block472At||0)){floater(P.x,P.z,'DEFENDEU','#8bdcff',false,2.0);P.block472At=now()+.35}fxRing(P.x+Math.sin(P.face)*.7,P.z+Math.cos(P.face)*.7,0x8bdcff,.9,.2);sfx('block')}catch(_){}
 return HP0.call(this,amt*(sh?.25:.5),compat)};

/* ---------- contra-ataque ---------- */
const HE0=hurtEnemy;
hurtEnemy=function(e,amt,sx,sz,o){if(G.on&&o&&o.fromPlayer&&now()<counterUntil&&e&&!e.dead&&amt>0){counterUntil=-9;G.stats.counters++;amt*=1.8;o={...o,crit:true,counter472:true};try{floater(e.x,e.z,'CONTRA-ATAQUE!','#ffd54f',true,2.6)}catch(_){}}
 return HE0.call(this,e,amt,sx,sz,o)};

/* ---------- botão esquerdo defendendo = escudada (ou nada) ---------- */
const A0=attack;
attack=function(){if(!blocking())return A0.apply(this,arguments);if(!hasShield())return;const P=P_();if(now()<bashCd)return;if(!spend(15)){try{floater(P.x,P.z,'SEM ESTAMINA','#ff8a6a')}catch(_){}return}
 bashCd=now()+1.2;G.stats.bashes++;const fx=Math.sin(P.face),fz=Math.cos(P.face);let best=null,bd=2.6;
 for(const e of enemies){if(!e||e.dead||e.ally||e.friendly217)continue;const dx=e.x-P.x,dz=e.z-P.z,d=Math.hypot(dx,dz);if(d>bd+(e.r||.5))continue;if((dx*fx+dz*fz)/(d||1)<.4)continue;best=e;bd=d}
 try{fxRing(P.x+fx,P.z+fz,0xd8e4f0,1.3,.25);sfx('block')}catch(_){}
 if(best){try{HE0(best,Math.max(1,P.dmg*.35),P.x,P.z,{fromPlayer:true,kb:0,stun:best.isBoss?.2:.7,bash472:true});if(!best.isBoss)moveEnt(best,fx*2.5,fz*2.5);shake(.2);hitstop(.06)}catch(_){}}};

/* ---------- velocidade defendendo + aviso de golpe ---------- */
if(typeof movementSpeed==='function'){const MS0=movementSpeed;movementSpeed=function(v){const r=MS0.apply(this,arguments);return blocking()?r*.55:r}}
const told=new WeakSet();
function tick(){const P=P_();if(!P)return;
 P.block472=blocking();
 for(const e of enemies){if(!e||e.dead||!e.act){continue}const A=e.act;if(told.has(A))continue;if(!/swing|claw|draco|lunge|charge|slam/.test(A.type||''))continue;
  if(Math.hypot(e.x-P.x,e.z-P.z)>7)continue;told.add(A);G.stats.tells++;try{flashMats(e.m,1,0xffffff);setTimeout(()=>{try{flashMats(e.m,0)}catch(_){}},110)}catch(_){}}}
(function hook(){if(typeof camUpdate!=='function'){setTimeout(hook,300);return}const prev=camUpdate;camUpdate=function(){prev.apply(this,arguments);try{tick()}catch(err){if(!G.err)console.warn('guard472',err);G.err=err}}})();
})();
