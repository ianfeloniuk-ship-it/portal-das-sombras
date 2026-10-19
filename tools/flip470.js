/* v470 (Ian, 19/10/2026): "algo mais real, mais fluido, mais visceral" — efeitos realistas em sequência de quadros
   (pacotes CC0 da Unity Labs, fx/unity470, licença em fx/unity470/LICENCA-CC0.txt) por cima dos efeitos da v459.
   Só visual: dano, alcance e regras não mudam. Vale para todas as classes e armas.
   - acerto de fogo (magia, tiro ou golpe com fogo/queimadura) → explosão de fogo real no corpo do monstro
   - golpe forte (crítico ou 3º golpe do combo) → bola de fogo/clarão menor só se for fogo; senão, poeira no chão
   - monstro queimando → chamas reais saindo do corpo enquanto queima
   - morte → nuvem de fumaça subindo; morte por fogo → explosão + fumaça
   Cada efeito é um Sprite virado para a câmera trocando de quadro (uma textura por tipo, compartilhada). */
(function(){
'use strict';
if(typeof THREE==='undefined'||typeof scene==='undefined'||typeof hurtEnemy!=='function'||typeof killEnemy!=='function')return;
const T=THREE,R=(a,b)=>a+Math.random()*(b-a);
const F=window.Flip470={on:true,speed:1/* 1 = normal; teste pode desacelerar */,stats:{spawned:0,live:0}};
const SHEETS={
 fireball:{src:'fx/unity470/fireball_8x8.webp',c:8,r:8,add:true,fps:40},
 explosion:{src:'fx/unity470/explosion_5x5.webp',c:5,r:5,add:false,fps:30},
 flame:{src:'fx/unity470/flame_16x4.webp',c:16,r:4,add:false,fps:32,loop:true},
 smoke:{src:'fx/unity470/smoke_8x8.webp',c:8,r:8,add:false,fps:26},
 dust:{src:'fx/unity470/dust_16x4.webp',c:16,r:4,add:false,fps:40}};
const loader=new T.TextureLoader();
for(const k in SHEETS){const s=SHEETS[k];s.tex=loader.load(s.src+'?v=470');s.tex.colorSpace=T.SRGBColorSpace||s.tex.colorSpace;s.n=s.c*s.r}
const lite=()=>!!(window.GFX267&&GFX267.lite),MAX=()=>lite()?24:60;
const live=[];
function spawn(kind,x,y,z,size,o={}){if(!F.on)return null;const s=SHEETS[kind];if(!s||!s.tex.image)return null;
 if(live.length>=MAX()){const old=live.shift();scene.remove(old.sp);old.sp.material.dispose()}
 const tex=s.tex.clone();tex.needsUpdate=true;tex.repeat.set(1/s.c,1/s.r);
 const mat=new T.SpriteMaterial({map:tex,transparent:true,depthWrite:false,blending:s.add?T.AdditiveBlending:T.NormalBlending,toneMapped:false,opacity:o.op??1,rotation:o.rot??R(-.4,.4)});
 if(o.tint!=null)mat.color.setHex(o.tint);
 const sp=new T.Sprite(mat);sp.position.set(x,y,z);sp.scale.set(size,size,1);sp.renderOrder=8;sp.userData.terrainAbsolute245=true;sp.frustumCulled=false;scene.add(sp);
 const fx={sp,s,t:-(o.delay||0),size,grow:o.grow??0,rise:o.rise??0,follow:o.follow||null,dur:o.dur||0,frame:-1};live.push(fx);F.stats.spawned++;setFrame(fx,0);return fx}
function setFrame(fx,i){if(i===fx.frame)return;fx.frame=i;const s=fx.s,cx=i%s.c,cy=Math.floor(i/s.c);fx.sp.material.map.offset.set(cx/s.c,1-(cy+1)/s.r)}
function body(e){try{const b=projectileBody253(e);return {x:b.x,y:b.y,z:b.z,r:b.r||e.r||.5,h:(b.hitHeight||1.4)+2*(b.r||.5)}}catch(_){const g=typeof terrH==='function'?terrH(e.x,e.z):0;return {x:e.x,y:g+.9,z:e.z,r:e.r||.5,h:1.6}}}
function ground(x,z){try{return terrH(x,z)}catch(_){return 0}}
function step(dt){dt*=F.speed;for(let i=live.length-1;i>=0;i--){const fx=live[i];fx.t+=dt;if(fx.t<0){fx.sp.visible=false;continue}fx.sp.visible=true;const s=fx.s;
  let k=Math.floor(fx.t*s.fps);
  if(s.loop&&fx.dur>0){if(fx.t>fx.dur){scene.remove(fx.sp);fx.sp.material.map.dispose();fx.sp.material.dispose();live.splice(i,1);continue}k%=s.n;const left=fx.dur-fx.t;fx.sp.material.opacity=Math.min(1,left/.4)}
  else if(k>=s.n){scene.remove(fx.sp);fx.sp.material.map.dispose();fx.sp.material.dispose();live.splice(i,1);continue}
  setFrame(fx,k);
  if(fx.follow){const e=fx.follow;if(e.dead&&!s.loop){}else if(e.dead){fx.dur=Math.min(fx.dur,fx.t+.3)}else{const b=body(e);fx.sp.position.set(b.x,b.y+fx.size*.25,b.z)}}
  if(fx.rise)fx.sp.position.y+=fx.rise*dt;if(fx.grow){const sc=fx.size*(1+fx.grow*fx.t);fx.sp.scale.set(sc,sc,1)}}
 F.stats.live=live.length}

/* ---------- ligações ---------- */
const FIRE_PT=/^(fire|meteor)$/;
function isFire(e,o){if(!o)return false;if(o.burn>0||o.burn152>0)return true;if(o.ptype300&&FIRE_PT.test(o.ptype300))return true;if(o.elem300==='fogo')return true;
 try{if(o.fromPlayer&&!o.skillHit){const w=run.equip&&run.equip.w;if(w&&w.elem300==='fogo')return true}const c=Number.isInteger(o.basicClass)&&CLASSES[o.basicClass];if(c&&c.elem==='fogo')return true}catch(_){}return false}
let lastFx=0;const burning=new WeakMap();
const H0=hurtEnemy;
hurtEnemy=function(e,amt,sx,sz,o){const hp0=e&&e.hp,r=H0.apply(this,arguments);
 try{if(F.on&&e&&r>0&&e.hp<hp0){const now=performance.now();const b=body(e),fire=isFire(e,o),big=!!(o&&(o.crit||o.third||o.skillHit));
  if(fire&&now-lastFx>60){lastFx=now;spawn(big?'explosion':'fireball',b.x,b.y+.2,b.z,(big?2.6:1.7)*Math.max(.8,b.r/.5),{grow:.35})}
  else if(big&&now-lastFx>60){lastFx=now;const g=ground(b.x,b.z);spawn('dust',b.x,g+.55,b.z,1.9*Math.max(.8,b.r/.5),{grow:.4,op:.8})}
  /* queimando: chama real acompanhando o corpo enquanto durar a queimadura */
  const d=e.basicDots||{},burnT=Math.max(d.burn?.t||0,d.kitFire111?.t||0);if(burnT>0&&!(burning.get(e)>now)){burning.set(e,now+burnT*1000);spawn('flame',b.x,b.y,b.z,1.5*Math.max(.8,b.r/.5),{follow:e,dur:burnT,op:.9})}}}catch(err){if(!F.err)console.warn('flip470',err);F.err=err}
 return r};
const K0=killEnemy;
killEnemy=function(e){const fire=!!(e&&e.basicDots&&((e.basicDots.burn?.t||0)>0||(e.basicDots.kitFire111?.t||0)>0));let b=null;try{if(e&&!e.dead)b=body(e)}catch(_){}
 const r=K0.apply(this,arguments);
 try{if(F.on&&b){const g=ground(b.x,b.z),sz=Math.max(.8,b.r/.5);if(fire)spawn('explosion',b.x,b.y,b.z,2.8*sz,{grow:.3});spawn('smoke',b.x,g+.9*sz,b.z,2.1*sz,{rise:.7,grow:.6,op:.5,tint:0xd8d4cc,delay:fire?.12:0})}}catch(err){if(!F.err)console.warn('flip470',err);F.err=err}
 return r};

let last=performance.now();
(function hook(){if(typeof camUpdate!=='function'){setTimeout(hook,300);return}const prev=camUpdate;camUpdate=function(){prev.apply(this,arguments);const n=performance.now(),dt=Math.min(.1,(n-last)/1000);last=n;try{step(dt)}catch(err){if(!F.err)console.warn('flip470',err);F.err=err}}})();
F.spawn=spawn;
})();
