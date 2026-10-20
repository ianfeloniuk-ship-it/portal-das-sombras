/* v459 (Ian, 16/10/2026): "assiste esses 2 vídeos e coloca em prática no Primeva" — reels do vasilev.yegor
   "How to make a punch juicy" e "How to make a spell juicy". Só visual e som: dano, alcance, tempo de ataque e
   regras não mudam. Vale igual para todas as classes e armas (entra por hurtEnemy, killEnemy, attack e
   projectileImpact253).
   GOLPE  1 flash branco no monstro (já existia, mantido) · 2 som seco no quadro do impacto · 3 faíscas saindo na
          direção do golpe · 4 empurrão no monstro (já existia) + recuo curto do jogador (0,16 m) · 5 tremida e
          congelamento (já existiam no golpe básico; agora também em tiros e habilidades, com limite) ·
          morte = estouro de faíscas, clarão e "pop".
   MAGIA  1 carga: energia puxada para a ponta do cajado/mão enquanto o próximo disparo recarrega · 2 núcleo que cresce
          na ponta · 3 rastro em todo projétil do jogador · 4 explosão (clarão + faíscas atravessando o alvo) ·
          5 reação (flash + tranco) · 6 som (sopro no disparo, estrondo no impacto) · 7 depois: monstro pegando fogo
          enquanto queima (e pingando enquanto sangra), apagando aos poucos · 8 números de dano que "socam" (crítico
          maior, em src/core/410) · morte por fogo = vira cinza (corpo carbonizado, cinzas e brasas; o saque continua).
   Partículas num InstancedMesh só (1 chamada de desenho), metade no modo Gráficos leve. */
(function(){
'use strict';
if(typeof hurtEnemy!=='function'||typeof killEnemy!=='function'||typeof THREE==='undefined'||typeof scene==='undefined')return;
const T=THREE,lite=()=>!!(window.GFX267&&GFX267.lite),R=(a,b)=>a+Math.random()*(b-a);
const COL={fogo:0xff8a32,gelo:0xa8ecff,terra:0xd8aa62,raio:0xfff27a,luz:0xffe9a8,vazio:0xb07cff,phy:0xffe6b0,crit:0xffd54f,block:0xb8c7d8};
const PT={fire:'fogo',meteor:'fogo',ice:'gelo',stone:'terra',stone_lance:'terra',spark:'raio',holy:'luz',soul:'vazio'};
const PHYS_PT=/^(arrow|sarrow|tdagger|tspear|bullet372|stone|thorn372.*|crystal350.*)$/;
let deferQ=null,defer=null,frameNo=0,lastStop=-9,lastSnd=0,inAttack=0,pend=null,lastCast=-9,castCol=0xffd08a,castEl=null,castInt=.3,recoil=null;
const I=window.Impact459={on:true,stats:{sparks:0,flashes:0,stops:0,kills:0,ash:0,burns:0,casts:0}};

/* ---------- partículas (faísca alongada, pontinho de luz, cinza) ---------- */
const NMAX=lite()?300:640,NASH=lite()?160:360;
function pool(geo,mat,n){const m=new T.InstancedMesh(geo,mat,n);m.instanceMatrix.setUsage(T.DynamicDrawUsage);m.setColorAt(0,new T.Color(1,1,1));m.instanceColor.setUsage(T.DynamicDrawUsage);m.count=0;m.frustumCulled=false;m.renderOrder=6;m.userData.terrainAbsolute245=true;m.userData.ol210=1;m.name='Impact459';scene.add(m);return m}
const glowMesh=pool(new T.OctahedronGeometry(.5,0),new T.MeshBasicMaterial({color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}),NMAX);
const ashMesh=pool(new T.TetrahedronGeometry(.5,0),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:1,depthWrite:true}),NASH);
const glowP=[],ashP=[];
const M4=new T.Matrix4(),Q=new T.Quaternion(),V=new T.Vector3(),S=new T.Vector3(),UP=new T.Vector3(0,0,1),C=new T.Color(),C2=new T.Color(),E=new T.Euler();
function part(list,max,o){if(list.length>=max)list.shift();o.t=0;list.push(o);return o}
/* mode 0 = faísca orientada pela velocidade; 1 = ponto de luz; 2 = floco de cinza (gira e encolhe) */
function spark(x,y,z,vx,vy,vz,o){I.stats.sparks++;return part(glowP,NMAX,{x,y,z,vx,vy,vz,life:o.life||.3,len:o.len||.4,w:o.w||.06,g:o.g??9,drag:o.drag??3.2,c0:o.c0??0xffffff,c1:o.c1??0xffd08a,b:o.b??1,mode:o.mode||0})}
function flake(x,y,z,vx,vy,vz,o){return part(ashP,NASH,{x,y,z,vx,vy,vz,life:o.life||1.2,w:o.w||.08,g:o.g??-.6,drag:o.drag??1.4,c1:o.c1??0x2a2522,spin:R(0,6),sv:R(-6,6),mode:2})}
function flame(x,y,z,vx,vy,vz,o){return part(ashP,NASH,{x,y,z,vx,vy,vz,life:o.life||.4,len:o.len||.4,w:o.w||.1,g:o.g??-1,drag:o.drag??1.5,c0:o.c0,c1:o.c1,mode:0})}
function stepList(list,mesh,dt,glow){let n=0;for(let i=0;i<list.length;i++){const p=list[i];p.t+=dt;if(p.t>=p.life)continue;
  if(dt>0){const dr=Math.max(0,1-p.drag*dt);p.vx*=dr;p.vz*=dr;p.vy=p.vy*dr-p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;if(p.spin!=null)p.spin+=p.sv*dt}
  const k=p.t/p.life;list[n++]=p;const j=n-1;
  if(p.mode===0){const sp=Math.hypot(p.vx,p.vy,p.vz);if(sp>.001)V.set(p.vx/sp,p.vy/sp,p.vz/sp);else V.set(0,1,0);Q.setFromUnitVectors(UP,V);const L=p.len*(.35+.65*Math.min(1,sp/7))*(1-.45*k),w=p.w*(1-.7*k);S.set(w,w,Math.max(w,L))}
  else if(p.mode===1){Q.identity();const w=p.w*(1-k*k);S.set(w,w,w)}
  else{E.set(p.spin,p.spin*.7,0);Q.setFromEuler(E);const w=p.w*(1-k*k);S.set(w,w*.35,w)}
  V.set(p.x,p.y,p.z);M4.compose(V,Q,S);mesh.setMatrixAt(j,M4);
  if(glow){C.setHex(p.c0);C2.setHex(p.c1);C.lerp(C2,Math.min(1,k*2.6));C.multiplyScalar(p.b*Math.pow(1-k,1.35))}else{C.setHex(p.c1);if(p.c0!=null){C2.setHex(p.c0);C2.lerp(C,Math.min(1,k*1.6));C.copy(C2)}}
  mesh.setColorAt(j,C)}
 list.length=n;mesh.count=n;if(n){mesh.instanceMatrix.needsUpdate=true;mesh.instanceColor.needsUpdate=true}}

/* ---------- clarões (sprite redondo somado à luz) ---------- */
const flashTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.22,'rgba(255,255,255,.9)');gr.addColorStop(.55,'rgba(255,255,255,.28)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);return new T.CanvasTexture(c)})();
function sprite(){const s=new T.Sprite(new T.SpriteMaterial({map:flashTex,color:0xffffff,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));s.visible=false;s.renderOrder=7;s.userData.terrainAbsolute245=true;s.frustumCulled=false;scene.add(s);return s}
const flashes=Array.from({length:14},()=>({s:sprite(),t:1,dur:1,size:1}));let fi=0;
function flashAt(x,y,z,size,col,dur=.12){const f=flashes[fi++%flashes.length];f.t=0;f.dur=dur;f.size=size;f.s.position.set(x,y,z);f.s.material.color.setHex(col);f.s.visible=true;I.stats.flashes++}
function stepFlashes(dt){for(const f of flashes){if(!f.s.visible)continue;f.t+=dt;const k=f.t/f.dur;if(k>=1){f.s.visible=false;continue}const sc=f.size*(.55+.45*Math.min(1,k*4));f.s.scale.set(sc,sc,1);f.s.material.opacity=Math.pow(1-k,1.6)}}
const core=sprite();core.material.opacity=0;

/* ---------- utilidades ---------- */
function body(e){try{const b=projectileBody253(e);return {x:b.x,y:b.y,z:b.z,r:b.r,h:b.hitHeight+2*b.r}}catch(_){const g=terrH(e.x,e.z);return {x:e.x,y:g+.9,z:e.z,r:e.r||.5,h:1.6}}}
function elemOf(o){if(!o)return null;if(o.elem300)return o.elem300;if(o.ptype300&&PT[o.ptype300])return PT[o.ptype300];
 try{if(o.fromPlayer&&!o.skillHit){const w=run.equip&&run.equip.w;if(w&&w.elem300)return w.elem300}const c=Number.isInteger(o.basicClass)&&CLASSES[o.basicClass];if(c&&c.elem)return c.elem}catch(_){}return null}
function isMag(o){return o.dtype281?o.dtype281==='mag':(inAttack&&typeof curDType281!=='undefined'?curDType281==='mag':false)}
function colorOf(el,o,crit,blocked,pcol){if(blocked)return COL.block;if(crit)return COL.crit;if(el&&COL[el])return COL[el];if(pcol!=null&&isMag(o))return pcol;return COL.phy}
/* faíscas num cone em volta da direção (dx,dy,dz) */
function burst(x,y,z,dx,dy,dz,n,col,o={}){if(lite())n=Math.ceil(n*.55);const spread=o.spread??.55,sp0=o.sp0??6,sp1=o.sp1??12;
 for(let i=0;i<n;i++){let vx=dx+R(-spread,spread),vy=dy+R(-.15,spread*1.1)+.18,vz=dz+R(-spread,spread);const l=Math.hypot(vx,vy,vz)||1,s=R(sp0,sp1);
  spark(x,y,z,vx/l*s,vy/l*s,vz/l*s,{life:R(.16,.32)*(o.lifeK||1),len:R(.28,.55)*(o.lenK||1),w:R(.045,.075)*(o.wK||1),c0:0xffffff,c1:col,b:o.b||1.15,g:o.g??10,drag:3})}}
function radial(x,y,z,n,col,o={}){if(lite())n=Math.ceil(n*.55);for(let i=0;i<n;i++){const a=Math.random()*6.283,u=R(-.2,1),c=Math.sqrt(1-u*u),s=R(o.sp0??4,o.sp1??10);spark(x,y,z,Math.cos(a)*c*s,u*s+1.5,Math.sin(a)*c*s,{life:R(.22,.42),len:R(.3,.6),w:R(.05,.085),c0:0xffffff,c1:col,b:1.2,g:9,drag:2.6})}}
function stop(fz,sh,force){if(!force&&time-lastStop<.14)return;lastStop=time;I.stats.stops++;hitstop(fz);shake(sh)}

/* ---------- som (sintetizado como o resto do jogo) ---------- */
function canSnd(gap=.04){if(!window.AU||!AU.ctx||!AU.on||typeof tone!=='function'||typeof noiz!=='function')return false;const n=performance.now()/1000;if(n-lastSnd<gap)return false;lastSnd=n;return true}
const J=()=>1+R(-.06,.06);
const SND={
 whack(blade,crit){const t=anow(),j=J();noiz(t,.022,{v:.3,type:'highpass',f:3400*j});noiz(t,.09,{v:.36,type:'lowpass',f:1700*j,sweep:260});tone(150*j,t,.12,{v:.32,slide:46});if(blade)tone(2350*j,t,.07,{type:'triangle',v:.035});if(crit){noiz(t+.012,.06,{v:.24,f:2600,q:2});tone(240*j,t,.14,{v:.2,slide:70})}},
 thunk(crit){const t=anow(),j=J();noiz(t,.04,{v:.28,f:1900*j,q:2});tone(210*j,t,.08,{v:.22,slide:85});if(crit)noiz(t,.03,{v:.2,type:'highpass',f:3800})},
 boom(el,crit){const t=anow(),j=J();noiz(t,.24,{v:.3,type:'lowpass',f:1500*j,sweep:120});tone(118*j,t,.25,{v:.26,slide:40});if(crit)noiz(t,.05,{v:.22,type:'highpass',f:3000});
  if(el==='fogo')noiz(t+.03,.2,{v:.12,type:'highpass',f:2600*j});else if(el==='gelo'){tone(2600*j,t,.2,{type:'triangle',v:.04,rev:.4});tone(3400*j,t+.03,.16,{type:'triangle',v:.03,rev:.4})}
  else if(el==='raio')tone(1500*j,t,.12,{type:'sawtooth',v:.05,slide:320,filt:4200});else if(el==='terra')tone(70*j,t,.22,{v:.22,slide:35});else if(el==='luz')tone(1320*j,t,.28,{v:.045,rev:.5});else if(el==='vazio')tone(92*j,t,.3,{type:'sawtooth',v:.06,filt:520,slide:46})},
 cast(el){const t=anow(),j=J();noiz(t,.2,{v:.15,f:480*j,sweep:2700,q:.9});tone(210*j,t,.17,{v:.07,slide:430,filt:1600});if(el==='fogo')noiz(t+.04,.16,{v:.07,type:'highpass',f:2400});else if(el==='gelo')tone(2900*j,t+.02,.14,{type:'triangle',v:.025,rev:.4});else if(el==='raio')tone(900*j,t,.1,{type:'sawtooth',v:.035,slide:2400,filt:5000})},
 twang(){const t=anow(),j=J();tone(185*j,t,.13,{type:'triangle',v:.12,slide:150});noiz(t,.06,{v:.12,type:'highpass',f:4200})},
 toss(){const t=anow();noiz(t,.15,{v:.13,f:700,sweep:2400,q:1.1})},
 pop(big){const t=anow(),j=J();noiz(t,.05,{v:.32,type:'highpass',f:1800*j});tone(540*j,t,.09,{type:'triangle',v:.15,slide:1300});tone(112*j,t,.18,{v:.22,slide:44});if(big)noiz(t,.35,{v:.22,type:'lowpass',f:900,sweep:90})},
 ash(){const t=anow();noiz(t,.5,{v:.22,type:'lowpass',f:1000,sweep:180});noiz(t+.05,.35,{v:.1,type:'highpass',f:2800});tone(96,t,.4,{v:.12,slide:40})}};
function play(n,...a){if(!canSnd(n==='cast'||n==='twang'||n==='toss'?.03:.04))return;try{SND[n](...a)}catch(_){}}

/* ---------- golpe: hurtEnemy ---------- */
const H0=hurtEnemy;
hurtEnemy=function(e,amt,sx,sz,o){
 if(deferQ&&!(o&&o.ptype300)){deferQ.hits.push([e,amt,sx,sz,o]);return amt}
 if(!I.on||!e||e.dead||e.friendly217||e.ally||!(amt>0))return H0.apply(this,arguments);
 const op=o||{},dot=op.kb===0&&op.stun===0&&op.pierce,direct=!!(op.fromPlayer&&!op.pet&&!op.passive&&!dot);
 let dx=e.x-sx,dz=e.z-sz;const l=Math.hypot(dx,dz);if(!(l>1e-4)){dx=Math.sin(player?.face||0);dz=Math.cos(player?.face||0)}else{dx/=l;dz/=l}
 const el=elemOf(op);if(el==='fogo')e.fire459=time;if(!dot)e.hit459={t:time,dx,dz,el,direct};
 const hp0=e.hp,fl0=floats.length,mute=direct&&window.SFX&&SFX.hit,h=mute?SFX.hit:null;if(mute)SFX.hit=function(){};
 let r;try{r=H0.apply(this,arguments)}finally{if(mute)SFX.hit=h}
 try{if(!(e.hp<hp0)||dot)return r;
  /* passo 1: branco já no quadro do acerto (o jogo só acendia no quadro seguinte, depois do congelamento) */if(e.flash>0&&e.m&&typeof flashMats==='function')flashMats(e.m,1);
  let crit=false,blocked=false;for(let i=fl0;i<floats.length;i++){const f=floats[i];if(/^BLOQUEIO/.test(f.txt))blocked=true;else if(f.big&&f.col==='#ffd54f')crit=true}
  const proj=!!op.ptype300,melee=inAttack>0&&!proj,col=colorOf(el,op,crit,blocked);
  if(proj)pend={e,crit,blocked,el,col,frame:frameNo};
  else if(!(window.Golpes487&&Golpes487.replacesHit(op))){const b=body(e),cy=b.y+(e.isBoss?.2:0),near=Math.max(.25,b.r*.75);
   flashAt(e.x-dx*near,cy,e.z-dz*near,(crit?1.75:blocked?.8:1.15)*(e.isBoss?1.35:1),blocked?0xdfe8ff:crit?0xfff1b0:0xffffff,crit?.14:.11);
   burst(e.x+dx*b.r*.3,cy,e.z+dz*b.r*.3,dx,.12,dz,(crit?17:blocked?6:direct?11:6)*(e.isBoss?1.3:1),col,{spread:blocked?.9:.6,lifeK:crit?1.25:1})}
  if(direct){
   if(!blocked){if(proj){if(PHYS_PT.test(op.ptype300))play('thunk',crit);else play('boom',el,crit)}else if(isMag(op)&&!melee)play('boom',el,crit);else play('whack',/^(sword|axe|dagger|spear)$/.test(weaponKind272(run.equip.w)||''),crit)}
   if(melee&&!blocked&&player&&!player.dead&&(!recoil||recoil.f!==frameNo)){const f=player.face;recoil={bx:-Math.sin(f),bz:-Math.cos(f),left:.09,f:frameNo}}
   if(!melee)stop(crit?.05:.032,crit?.13:.07)}
 }catch(err){if(!I.err)console.warn('impact459',err);I.err=err}
 return r};

/* ---------- projétil do jogador acertando: explosão no ponto do acerto ---------- */
if(typeof projectileImpact253==='function'){const P0=projectileImpact253;projectileImpact253=function(p){const r=P0.apply(this,arguments);
 try{if(I.on&&p&&p.team==='player'&&pend&&pend.frame===frameNo&&!(window.Golpes487&&Golpes487.replacesHit(p))){const q=pend;pend=null;const sp=Math.hypot(p.vx||0,p.vy||0,p.vz||0)||1,dx=(p.vx||0)/sp,dy=(p.vy||0)/sp,dz=(p.vz||0)/sp;
  const phys=PHYS_PT.test(p.ptype||''),big=!!(p.mesh&&p.mesh.scale&&p.mesh.scale.x>1.4),y=p.y??(p.originY??1.1);
  flashAt(p.x-dx*.15,y,p.z-dz*.15,(q.crit?2:1.35)*(big?1.5:1)*(phys?.55:1),phys?0xffffff:q.col,phys?.09:.14);
  burst(p.x,y,p.z,dx,dy+.1,dz,(phys?8:13)+(q.crit?8:0)+(big?6:0),q.col,{spread:phys?.45:.7,sp0:phys?5:6,sp1:phys?10:13,lifeK:phys?.9:1.15});
  if(!phys&&(q.crit||big))fxRing(q.e.x,q.e.z,q.col,big?2.2:1.6,.24)}}catch(_){}return r}}

/* ---------- morte: estouro / vira cinza ---------- */
const chars=[];
function burning(e){const b=e.basicDots&&e.basicDots.burn;return !!(b&&b.t>0)||(e.dotT>0&&(e.fire459??-9)>time-3.5)}
function charCorpse(e){const list=[];e.m.root.traverse(o=>{if(!o.isMesh||!o.material)return;const arr=Array.isArray(o.material),ms=arr?o.material.slice():[o.material];let changed=false;
  ms.forEach((m,i)=>{if(!m||!m.color||m.isMeshBasicMaterial||m.isSpriteMaterial||m.transparent)return;const c=m.clone();c.userData={char459:1,c0:m.color.clone(),e0:c.emissive?c.emissive.clone():null};ms[i]=c;list.push(c);changed=true});
  if(changed)o.material=arr?ms:ms[0]});if(list.length)chars.push({e,list,t:0})}
function stepChars(dt){for(let i=chars.length-1;i>=0;i--){const c=chars[i];c.t+=dt;const k=Math.min(1,c.t/.55),glow=Math.max(0,1-c.t/2.6);
  for(const m of c.list){m.color.copy(m.userData.c0).lerp(C.setHex(0x1b1613),k*.86);if(m.emissive)m.emissive.setRGB(.55,.17,.03).multiplyScalar(glow*(.55+.45*Math.sin(c.t*11+m.id)))}
  if(c.t>2.6||!c.e.m.root.parent){for(const m of c.list)if(m.emissive)m.emissive.copy(m.userData.e0||C.setHex(0));if(!c.e.m.root.parent)for(const m of c.list)m.dispose();chars.splice(i,1)}}}
function onKill(e){const h=e.hit459;if(!h||time-h.t>.12)return;I.stats.kills++;const b=body(e),big=e.isBoss||e.elite,fire=h.el==='fogo'||burning(e);
 flashAt(b.x,b.y,b.z,(e.isBoss?3.2:big?2.4:1.9),fire?0xffb060:0xffffff,.17);
 radial(b.x,b.y,b.z,(e.isBoss?30:big?22:16),fire?COL.fogo:0xffe2b0,{sp1:e.isBoss?13:10});burst(b.x,b.y,b.z,h.dx,.2,h.dz,10,fire?0xffc070:0xffffff,{spread:.5,sp1:14});
 if(fire){I.stats.ash++;const n=lite()?14:28;for(let i=0;i<n;i++){const a=Math.random()*6.283,rr=R(0,b.r);flake(b.x+Math.cos(a)*rr,b.y+R(-.4,.5),b.z+Math.sin(a)*rr,R(-.6,.6)+h.dx*.8,R(.6,1.8),R(-.6,.6)+h.dz*.8,{life:R(.9,1.7),w:R(.07,.15),c1:Math.random()<.35?0x55504a:0x241f1c})}
  for(let i=0;i<(lite()?8:16);i++)spark(b.x+R(-b.r,b.r),b.y+R(-.4,.4),b.z+R(-b.r,b.r),R(-.5,.5),R(1.6,3.2),R(-.5,.5),{life:R(.6,1.1),w:R(.03,.05),len:.12,c0:0xffc060,c1:0xff4a10,b:1,g:-.4,drag:1.2});
  try{charCorpse(e)}catch(_){}play('ash')}
 else play('pop',big);
 if(h.direct&&!e.isBoss)stop(big?.1:.075,big?.32:.22,true)}
const K0=killEnemy;killEnemy=function(e){const was=e&&!e.dead;const r=K0.apply(this,arguments);try{if(I.on&&was&&e.dead&&!e.noExpLoot&&!e.ally&&!e.statue&&e.m&&e.m.root)onKill(e)}catch(err){if(!I.err)console.warn('impact459 kill',err);I.err=err}return r};

/* ---------- disparo: sopro/corda + clarão na ponta; guarda a cor para a carga ---------- */
function muzzle(){const m=player&&player.m;if(!m||!m.root)return null;let p=null;try{if(window.Warrior127&&typeof weaponIsMagic173==='function'&&weaponIsMagic173(run.equip.w))p=Warrior127.staffMuzzle(m)}catch(_){}
 if(!p&&m.bones&&m.bones.hand_r){m.root.updateMatrixWorld(true);p=m.bones.hand_r.getWorldPosition(new T.Vector3())}if(!p)return null;let hgt=0;try{hgt=TER245.heightFor(m.root)}catch(_){hgt=terrH(player.x,player.z)}return {x:p.x,y:p.y+hgt,z:p.z}}
/* passo 2 do golpe ("bem no quadro do impacto"): o dano do golpe corpo a corpo saía no clique, ~0,1 s antes de a
   lâmina chegar no monstro (medido: a espada cruza o alvo a ~25% do golpe). Os acertos, o congelamento e a tremida
   desse golpe agora esperam esse tempo; dano, alcance e alvos são os mesmos (escolhidos no clique). */
function kitForm(){try{return !!kitState111().form}catch(_){return false}}
function runDefer(d){const hs=d.stops;inAttack++;try{for(const a of d.hits){try{hurtEnemy.apply(window,a)}catch(err){console.warn('impact459 hit',err)}}}finally{inAttack--}for(const [f,a] of hs){if(window.Golpes487&&Golpes487.basic(d.hits[0]?.[4]?.basicClass))continue;try{(f==='h'?hitstop:shake)(a)}catch(_){}}}
const A0=attack;attack=function(){const n0=projs.length,b0=window.beep,hs0=window.hitstop,sh0=window.shake;let beeped=null;window.beep=function(f,d,v,t){beeped=[f,d,v,t]};
 const canDefer=I.on&&!defer&&player&&!kitForm()&&!(window.Firearms372&&Firearms372.isGun(run.equip.w));
 if(canDefer){deferQ={hits:[],stops:[]};window.hitstop=function(a){deferQ.stops.push(['h',a])};window.shake=function(a){deferQ.stops.push(['s',a])}}
 inAttack++;let r;const atk0=player&&player.atkCd;
 try{r=A0.apply(this,arguments)}finally{inAttack--;window.beep=b0;const q=deferQ;deferQ=null;window.hitstop=hs0;window.shake=sh0;
  if(q){if(q.hits.length){const iv=Math.max(.05,player.atkCd||.3);defer={hits:q.hits,stops:q.stops,left:window.Golpes487&&Golpes487.basic(q.hits[0]?.[4]?.basicClass)?(q.hits[0][4].basicClass===2?.12:.08):Math.min(.13,iv*.26),L:L}}else for(const [f,a] of q.stops)(f==='h'?hs0:sh0)(a)}}
 try{const fresh=projs.slice(n0).filter(p=>p&&p.team==='player');
  if(I.on&&fresh.length){const p=fresh[0],pt=p.ptype||'';
   if(/^(arrow|sarrow)$/.test(pt))play('twang');else if(/^(tdagger|tspear)$/.test(pt))play('toss');
   else if(pt!=='bullet372'){I.stats.casts++;castCol=p.col??castCol;castEl=PT[pt]||null;lastCast=time;castInt=Math.max(.05,player.atkCd||.3);play('cast',castEl);
    const mz=muzzle();if(mz){flashAt(mz.x,mz.y,mz.z,.95,castCol,.1);const f=player.face;burst(mz.x,mz.y,mz.z,Math.sin(f),.05,Math.cos(f),6,castCol,{spread:.35,sp0:3,sp1:7,lifeK:.7,wK:.8})}}}
  else if(beeped&&b0)b0.apply(window,beeped)}catch(_){}
 return r};

/* ---------- por quadro: partículas, carga, rastros, fogo e sangue ---------- */
let coreOn=0;
function stepCharge(dt){if(!started||!player||player.dead||paused||time-lastCast>2.5||!mouseHeld){coreOn=Math.max(0,coreOn-dt*8);core.material.opacity=.6*coreOn;core.visible=coreOn>0;return}
 const mz=muzzle();if(!mz){core.visible=false;return}const cl=1-Math.max(0,Math.min(1,(player.atkCd||0)/castInt));coreOn=Math.min(1,coreOn+dt*10);
 core.visible=true;core.position.set(mz.x,mz.y,mz.z);core.material.color.setHex(castCol);const sc=(.2+.34*cl)*(1+.08*Math.sin(time*31));core.scale.set(sc,sc,1);core.material.opacity=(.3+.6*cl)*coreOn;
 if(dt>0&&Math.random()<(lite()?.45:.9)){const u=R(-1,1),a=R(0,6.283),c=Math.sqrt(1-u*u),rr=R(.45,.75),life=R(.14,.22),px=mz.x+Math.cos(a)*c*rr,py=mz.y+u*rr,pz=mz.z+Math.sin(a)*c*rr;
  spark(px,py,pz,(mz.x-px)/life,(mz.y-py)/life,(mz.z-pz)/life,{life,len:.22,w:.035,c0:0xffffff,c1:castCol,b:.7+.6*cl,g:0,drag:0})}}
function stepTrails(dt){if(dt<=0)return;for(const p of projs){if(!p||p.team!=='player'||!p.mesh||(window.Golpes487&&Golpes487.basic(p.basicClass??profile.cls)&&p.ptype==='tdagger'))continue;const pt=p.ptype||'';if(/^(fire|soul|sarrow|bullet372)$/.test(pt))continue;p.tr459=(p.tr459||0)-dt;if(p.tr459>0)continue;p.tr459=lite()?.06:.032;
  const y=p.y??(p.originY??1.1),phys=/^(arrow|tdagger|tspear|stone)$/.test(pt);
  if(phys)spark(p.x,y,p.z,(p.vx||0)*.04,(p.vy||0)*.04,(p.vz||0)*.04,{life:.12,len:.55,w:.025,c0:0xe8f0ff,c1:0x9fb0c4,b:.45,g:0,drag:0});
  else{spark(p.x+R(-.08,.08),y+R(-.08,.08),p.z+R(-.08,.08),R(-.4,.4),R(-.1,.5),R(-.4,.4),{life:R(.16,.26),w:R(.05,.09),mode:1,c0:p.col??0xffd08a,c1:p.col??0xffd08a,b:.75,g:-.5,drag:2})}}}
function stepStatus(dt){if(dt<=0||!player)return;for(const e of enemies){if(e.dead||e.sleep||!e.m||!e.m.root||!e.m.root.visible)continue;if(Math.abs(e.x-player.x)>55||Math.abs(e.z-player.z)>55)continue;
  const bd=e.basicDots||{},b=bd.burn;let left=b&&b.t>0?b.t:(e.dotT>0&&(e.fire459??-9)>time-3.5?e.dotT:0);
  if(left>0){I.stats.burns++;const k=Math.min(1,left/1.2);e.bf459=(e.bf459||0)-dt;if(e.bf459<=0){e.bf459=(lite()?.06:.03)/(.35+.65*k);const B=body(e);for(let n=0;n<2;n++){const a=R(0,6.283),rr=B.r*R(.7,1.1),bot=B.y-B.h*.45,x=e.x+Math.cos(a)*rr,z=e.z+Math.sin(a)*rr,y=bot+R(0,B.h*.9);
    flame(x,y,z,R(-.25,.25),R(1.4,2.4)*(.6+.4*k),R(-.25,.25),{life:R(.3,.5),len:R(.4,.75)*(.6+.4*k),w:R(.13,.21)*(.6+.4*k),c0:0xffd04a,c1:0xc8260a,g:-1.2,drag:1.5});
    spark(x,y,z,R(-.2,.2),R(1.6,2.6),R(-.2,.2),{life:R(.2,.35),len:.35,w:.12,c0:0xffa040,c1:0xff4010,b:.6,g:-1,drag:1.5});
    if(Math.random()<.3)spark(x,y+.2,z,R(-.5,.5),R(2.4,3.6),R(-.5,.5),{life:R(.45,.8),len:.1,w:.03,c0:0xffc060,c1:0xff4a10,b:1,g:-.3,drag:1})}}}
  const bl=bd.bleed;if(bl&&bl.t>0){e.bb459=(e.bb459||0)-dt;if(e.bb459<=0){e.bb459=lite()?.3:.16;const B=body(e);flake(e.x+R(-B.r,B.r)*.6,B.y+R(-.2,.3),e.z+R(-B.r,B.r)*.6,R(-.3,.3),R(.2,.8),R(-.3,.3),{life:.6,w:R(.05,.08),g:9,drag:.5,c1:0x8a0d18})}}}}
function tick(dt){frameNo++;if(defer){if(defer.L!==L||!player||player.dead)defer=null;else{defer.left-=dt;if(defer.left<=0){const d=defer;defer=null;runDefer(d)}}}if(!glowMesh.parent)scene.add(glowMesh);if(!ashMesh.parent)scene.add(ashMesh);for(const f of flashes)if(!f.s.parent)scene.add(f.s);if(!core.parent)scene.add(core);
 if(recoil&&dt>0&&player&&!player.dead&&!(player.dodgeT>0)){const s=Math.min(recoil.left,dt);try{moveEnt(player,recoil.bx*.16*s/.09,recoil.bz*.16*s/.09)}catch(_){}recoil.left-=s;if(recoil.left<=1e-6)recoil=null}else if(recoil&&player&&(player.dead||player.dodgeT>0))recoil=null;
 if(I.on&&started){stepCharge(dt);stepTrails(dt);stepStatus(dt)}else{core.visible=false}
 stepList(glowP,glowMesh,dt,true);stepList(ashP,ashMesh,dt,false);stepFlashes(dt);stepChars(dt);if(pend&&pend.frame!==frameNo)pend=null}
(function hook(){if(typeof camUpdate!=='function'){setTimeout(hook,300);return}const prev=camUpdate;camUpdate=function(dt){prev.apply(this,arguments);try{tick(typeof ADT==='number'?ADT:0)}catch(err){if(!I.err)console.warn('impact459 tick',err);I.err=err}}})();
})();
