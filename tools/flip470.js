/* v470–v475 (Ian, 19/10/2026): "algo mais real, mais fluido, mais visceral" — efeitos realistas em sequência de quadros
   (pacotes CC0 da Unity Labs + renders Blender 5.2 tomsilf_motion, fx/unity470) por cima dos efeitos da v459.
   Visual realista, fluido e visceral para todas as habilidades e ataques de todas as classes.
   - Fogo: bola de fogo e explosões volumétricas; chamas contínuas no corpo de monstro queimando
   - Raio: arcos elétricos e descargas de raio (lightning_8x8)
   - Água/Gelo: borrifos fluidos e ondas de impacto de água (water_8x8)
   - Sagrado/Rúnico: círculos de runa dourados (rune_8x8)
   - Poeira/Físico: expansão de poeira e impacto no chão
   - Trevas/Morte: fumaça espectral e névoa subindo */
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
 dust:{src:'fx/unity470/dust_16x4.webp',c:16,r:4,add:false,fps:40},
 lightning:{src:'fx/unity470/lightning_8x8.webp',c:8,r:8,add:true,fps:45},
 water:{src:'fx/unity470/water_8x8.webp',c:8,r:8,add:true,fps:36},
 rune:{src:'fx/unity470/rune_8x8.webp',c:8,r:8,add:true,fps:32}};
const loader=new T.TextureLoader();
for(const k in SHEETS){const s=SHEETS[k];s.tex=loader.load(s.src+'?v=475');s.tex.colorSpace=T.SRGBColorSpace||s.tex.colorSpace;s.n=s.c*s.r}
const lite=()=>!!(window.GFX267&&GFX267.lite),MAX=()=>lite()?24:60;
const live=[];
function spawn(kind,x,y,z,size,o={}){if(!F.on)return null;const s=SHEETS[kind];if(!s||!s.tex.image)return null;
 if(live.length>=MAX()){const old=live.shift();scene.remove(old.sp);old.sp.material.dispose()}
 const tex=s.tex.clone();tex.needsUpdate=true;tex.repeat.set(1/s.c,1/s.r);
 const mat=new T.SpriteMaterial({map:tex,transparent:true,depthWrite:false,blending:s.add?T.AdditiveBlending:T.NormalBlending,toneMapped:false,opacity:o.op??1,rotation:o.rot??R(-.4,.4)});
 if(o.tint!=null)mat.color.setHex(o.tint);
 const sp=new T.Sprite(mat);sp.position.set(x,y,z);sp.scale.set(size,size,1);sp.renderOrder=8;sp.userData.terrainAbsolute245=true;sp.frustumCulled=false;scene.add(sp);
 const fx={sp,s,kind,t:-(o.delay||0),size,grow:o.grow??0,rise:o.rise??0,follow:o.follow||null,dur:o.dur||0,frame:-1};live.push(fx);F.stats.spawned++;setFrame(fx,0);return fx}
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
function getElem(e,o){
 if(!o)return null;
 if(o.elem300)return o.elem300;
 if(o.burn>0||o.burn152>0)return 'fogo';
 if(o.ptype300&&/^(fire|meteor)$/.test(o.ptype300))return 'fogo';
 if(o.ptype300&&/^(ice|water)$/.test(o.ptype300))return 'gelo';
 if(o.ptype300&&/^(spark|lightning)$/.test(o.ptype300))return 'raio';
 if(o.ptype300&&/^(soul|void)$/.test(o.ptype300))return 'trevas';
 if(o.ptype300==='holy')return 'luz';
 try{
  if(o.fromPlayer&&!o.skillHit){const w=run.equip&&run.equip.w;if(w&&w.elem300)return w.elem300}
  const c=Number.isInteger(o.basicClass)&&CLASSES[o.basicClass];if(c&&c.elem)return c.elem;
 }catch(_){}
 return null;
}
let lastFx=0;const burning=new WeakMap();
const H0=hurtEnemy;
hurtEnemy=function(e,amt,sx,sz,o){const hp0=e&&e.hp,r=H0.apply(this,arguments);
 try{if(F.on&&e&&r>0&&e.hp<hp0){const now=performance.now();const b=body(e),sz=Math.max(.8,b.r/.5);
  const elem=getElem(e,o);
  const fire=elem==='fogo',lightning=elem==='raio',water=elem==='gelo'||elem==='água'||elem==='agua',holy=elem==='luz'||elem==='sagrado',dark=elem==='trevas'||elem==='sombra';
  const big=!!(o&&(o.crit||o.third||o.skillHit));
  if(fire&&now-lastFx>55){lastFx=now;spawn(big?'explosion':'fireball',b.x,b.y+.2,b.z,(big?2.6:1.7)*sz,{grow:.35})}
  else if(lightning&&now-lastFx>55){lastFx=now;spawn('lightning',b.x,b.y+.2,b.z,(big?2.8:1.8)*sz,{grow:.15})}
  else if(water&&now-lastFx>55){lastFx=now;spawn('water',b.x,b.y,b.z,(big?2.6:1.7)*sz,{grow:.25})}
  else if(holy&&now-lastFx>55){lastFx=now;spawn('rune',b.x,ground(b.x,b.z)+.08,b.z,(big?2.5:1.6)*sz,{grow:.1})}
  else if(dark&&now-lastFx>55){lastFx=now;spawn('smoke',b.x,b.y+.2,b.z,2.0*sz,{tint:0x4c1d95,grow:.3})}
  else if(big&&now-lastFx>55){lastFx=now;const g=ground(b.x,b.z);spawn('dust',b.x,g+.55,b.z,1.9*sz,{grow:.4,op:.8})}
  /* queimando: chama real acompanhando o corpo enquanto durar a queimadura */
  const d=e.basicDots||{},burnT=Math.max(d.burn?.t||0,d.kitFire111?.t||0);if(burnT>0&&!(burning.get(e)>now)){burning.set(e,now+burnT*1000);spawn('flame',b.x,b.y,b.z,1.5*sz,{follow:e,dur:burnT,op:.9})}}}catch(err){if(!F.err)console.warn('flip470',err);F.err=err}
 return r};
const K0=killEnemy;
killEnemy=function(e){const fire=!!(e&&e.basicDots&&((e.basicDots.burn?.t||0)>0||(e.basicDots.kitFire111?.t||0)>0));let b=null;try{if(e&&!e.dead)b=body(e)}catch(_){}
 const r=K0.apply(this,arguments);
 try{if(F.on&&b){const g=ground(b.x,b.z),sz=Math.max(.8,b.r/.5);
  if(fire)spawn('explosion',b.x,b.y,b.z,2.8*sz,{grow:.3});
  spawn('smoke',b.x,g+.9*sz,b.z,2.1*sz,{rise:.7,grow:.6,op:.5,tint:0xd8d4cc,delay:fire?.12:0})}}catch(err){if(!F.err)console.warn('flip470',err);F.err=err}
 return r};

let last=performance.now();
(function hook(){if(typeof camUpdate!=='function'){setTimeout(hook,300);return}const prev=camUpdate;camUpdate=function(){prev.apply(this,arguments);const n=performance.now(),dt=Math.min(.1,(n-last)/1000);last=n;try{step(dt)}catch(err){if(!F.err)console.warn('flip470',err);F.err=err}}})();
F.spawn=spawn;
F.live=live;
F.SHEETS=SHEETS;
})();
