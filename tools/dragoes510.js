/* v510 (Ian, 21/10/2026, print do Dragão Errante chibi de asas chapadas): "tu não colocou os dragões no jogo";
   "eu gostaria que os nossos dragões fossem do mesmo jeito [que no Skyrim]... aparecerem do nada, ter chance de aparecer, atacando uma vila".
   - O Dragão Errante (chefe de mundo) e o Dragão Sitiante (ataque à cidade) usam os dragões novos (models/povo482), escolhidos pelo bioma,
     no lugar do boneco com duas placas vermelhas.
   - Voo como no Skyrim: chega pelo céu, circula sobre o alvo soltando sopro (fogo, gelo, areia ou veneno) no chão, pousa para lutar,
     decola de novo depois de um tempo. No chão a luta é a IA de chefe que já existia.
   - Aparece com mais frequência (Errante a cada ~10 min em vez de 20) e o ataque à vila vale para cidades a partir do nível 2. */
(()=>{
'use strict';
const T=THREE,TAU=Math.PI*2;
const SPEC={
 dragaoancio:{n:'Dragão Ancião',col:0xff6a1e,el:'fogo'},
 dragonete:{n:'Dragonete',col:0xff8a2a,el:'fogo'},
 dragao_gelido_ymiria:{n:'Dragão Gélido de Ymiria',col:0x9fe0ff,el:'gelo'},
 serpe_zahar:{n:'Serpe de Zahar',col:0xe8c070,el:'areia'},
 dragao_musgo_verden:{n:'Dragão-Musgo de Verden',col:0x7ad04a,el:'veneno'}
};
function pickKind(x,z){let b='campos';try{b=biomeAt(x,z)}catch(_){}
 const want=/neve|cristal/.test(b)?'dragao_gelido_ymiria':/deserto/.test(b)?'serpe_zahar':/floresta|pantano/.test(b)?'dragao_musgo_verden':/vulcao/.test(b)?'dragaoancio':(Math.random()<.5?'dragaoancio':'dragonete');
 if(MON.list[want])return want;for(const k of Object.keys(SPEC))if(MON.list[k])return k;return null}

/* troca o boneco antigo do chefe pelo dragão: o chefe nasce já com mon=dragão; sem modelo carregado, fica o antigo */
const baseWB=spawnWorldBoss;
spawnWorldBoss=function(){const P=player,k=pickKind(P.x,P.z);if(!k)return baseWB.apply(this,arguments);
 const a=rnd(0,TAU),x=P.x+Math.cos(a)*80,z=P.z+Math.sin(a)*80,S=SPEC[k];
 const b=spawnBoss(x,z,clamp(rankOf()+1,0,9),{...WBOSS,mon:k,scale:1,n:S.n+' Errante',body:S.col});b.wild=true;b.breaker=true;b.world=true;b.hp*=4;b.maxhp*=4;b.gold*=5;b.roam={x,z};
 drake(b,k,{x:P.x,z:P.z});toast('<b>[MUNDO]</b> Um rugido corta o céu. '+S.n+' sobrevoa a região.',6000);bigText(S.n.toUpperCase(),1300);try{sfx('gong')}catch(_){}return b};
const baseSiege=startSiege;
startSiege=function(c){if(profile?.classless)return;const k=pickKind(c.x,c.z);if(!k)return baseSiege.apply(this,arguments);const S=SPEC[k];
 const a=rnd(0,TAU),x=c.x+Math.cos(a)*90,z=c.z+Math.sin(a)*90;
 const b=spawnBoss(x,z,clamp(rankOf()+1,0,9),{...WBOSS,mon:k,scale:1,n:S.n+' Sitiante',body:S.col});b.wild=true;b.breaker=true;b.world=true;b.siege=c;b.hp*=5;b.maxhp*=5;b.gold*=6;b.bars=5;b.roam={x:c.x,z:c.z};b.aggro=true;
 drake(b,k,{x:c.x,z:c.z});
 spawnCityDefenders(c,c.x+Math.cos(a)*38*CITYK,c.z+Math.sin(a)*38*CITYK);L.siege={b,c,t:300};bigText('DRAGÃO ATACA '+c.name.toUpperCase(),1600);sfx('gong');shake(.6);
 showSys(S.n+' ataca '+c.name+'! Derrube-o em 5 minutos. Recompensa: ouro, troféu e nova coleta da renda de hoje.')};
/* ataque à vila também em cidades menores (antes só nível 5+) */
const baseUpdSiege=updSiege;
updSiege=function(dt){const r=baseUpdSiege.apply(this,arguments);try{if(!L.siege&&run.siegeT>900&&!bossE&&!profile?.classless){const nc=nearestCity(player.x,player.z);
  if(nc.d<120&&cityL(nc.c)>=2&&cityL(nc.c)<5&&!cityFallen(nc.c)&&Math.random()<.5){run.siegeT=0;startSiege(nc.c)}}}catch(_){}return r};

/* ---------- voo ---------- */
function drake(b,k,target){const S=SPEC[k];b.drake510={k,S,alt:24,phase:'chega',t:0,ang:Math.random()*TAU,target,breath:2.5,pend:[]};
 const al=b.m.alias||{};b.drake510.run=al.Running_A;b.drake510.fly=al.Fly||al.Running_A}
function setFly(b,on){const D=b.drake510,al=b.m.alias;if(!al)return;al.Running_A=on?D.fly:D.run}
function breathAt(b,x,z){const D=b.drake510,col=D.S.col;try{fxRing(x,z,col,5,.9);fxBurst(x,1,z,col,14,7)}catch(_){}
 D.pend.push({x,z,t:.7})}
const baseUpd=updEnemy;
updEnemy=function(e,dt){const D=e.drake510;
 if(!D||e.dead){if(D&&e.dead&&D.alt>0){D.alt=Math.max(0,D.alt-dt*14);e.m.root.position.y=terrH(e.x,e.z)+D.alt}return baseUpd.apply(this,arguments)}
 D.t+=dt;
 /* sopros marcados: o chão acende e, um instante depois, queima quem ainda estiver ali */
 for(const p of D.pend){p.t-=dt;if(p.t<=0&&!p.done){p.done=true;try{fxBurst(p.x,.5,p.z,D.S.col,20,9);shake(.25)}catch(_){}
   if(Math.hypot(player.x-p.x,player.z-p.z)<5)try{hurtPlayer(e.dmg*1.2,false)}catch(_){}}}
 D.pend=D.pend.filter(p=>!p.done);
 const air=D.phase!=='chao';
 if(air){
  /* alvo: o jogador se estiver perto; no ataque à vila, a própria cidade */
  const P=player,tg=(Math.hypot(P.x-e.x,P.z-e.z)<70||!e.siege)?{x:P.x,z:P.z}:D.target;
  if(D.phase==='chega'){const dx=tg.x-e.x,dz=tg.z-e.z,d=Math.hypot(dx,dz);const sp=11*dt;if(d>26){e.x+=dx/d*sp;e.z+=dz/d*sp;e.face=Math.atan2(dx,dz)}else{D.phase='circula';D.t=0}}
  else if(D.phase==='circula'){D.ang+=dt*.45;const R=24,nx=tg.x+Math.cos(D.ang)*R,nz=tg.z+Math.sin(D.ang)*R;e.face=Math.atan2(nx-e.x,nz-e.z);e.x+=(nx-e.x)*Math.min(1,dt*1.6);e.z+=(nz-e.z)*Math.min(1,dt*1.6);
   D.breath-=dt;if(D.breath<=0){D.breath=3.2;breathAt(e,tg.x+(Math.random()-.5)*3,tg.z+(Math.random()-.5)*3)}
   if(D.t>14){D.phase='pousa';D.t=0}}
  else if(D.phase==='pousa'){D.alt=Math.max(0,D.alt-dt*7);if(D.alt<=0){D.phase='chao';D.t=0;setFly(e,false);e.aggro=true;try{shake(.5);sfx('boom')}catch(_){}}}
  else if(D.phase==='decola'){D.alt=Math.min(24,D.alt+dt*8);if(D.alt>=24){D.phase='circula';D.t=0}}
  if(D.phase!=='pousa'&&D.phase!=='decola')D.alt+=(24+Math.sin(D.t*1.3)*2-D.alt)*Math.min(1,dt*2);
  setFly(e,true);e.act=null;e.cd=Math.max(e.cd||0,.5);
  try{animChibi(e.m,{move:1,atk:0,dead:0,wind:0},e.t=(e.t||0)+dt)}catch(_){}
  try{if(window.Anim547&&Anim547.postDragon)Anim547.postDragon(e,dt);else{e.m.root.position.set(e.x,terrH(e.x,e.z)+D.alt,e.z);e.m.root.rotation.y=e.face;}}catch(_){e.m.root.position.set(e.x,terrH(e.x,e.z)+D.alt,e.z);e.m.root.rotation.y=e.face;}return}
 /* no chão: luta normal de chefe; depois de um tempo levanta voo de novo (mais cedo se estiver ferido) */
 const r=baseUpd.apply(this,arguments);try{if(window.Anim547&&Anim547.postDragon)Anim547.postDragon(e,dt)}catch(_){}
 if(D.t>(e.hp<e.maxhp*.5?12:20)&&!e.act){D.phase='decola';D.t=0;setFly(e,true);try{sfx('gong')}catch(_){}}
 return r};
/* mais frequente: o laço principal recarrega o Errante em 1200 s; aqui cortamos para ~600 s */
setInterval(()=>{try{if(typeof L!=='undefined'&&L.wbT>600)L.wbT=600}catch(_){}},2000);
window.Dragoes510={SPEC,pickKind,spawn:()=>spawnWorldBoss(),siege:c=>startSiege(c||nearestCity(player.x,player.z).c)};
})();
