/* v630: a enchente (RAIN626.flood) apaga a fogueira, arrasta a barraca (abrigo), o carrinho e os
   despojos soltos rio abaixo. Lago/mar: apaga e para de arrastar (sem correnteza). */
(function(){
 'use strict';
 const FL=()=>window.RAIN626?RAIN626.flood.value:0;
 const depth=(x,z)=>{try{return window.Water391?Water391.depthAt(x,z):0}catch(_){return 0}};
 function flow(x,z){ // sentido do rio (z crescente, como a correnteza do shader); lago: do centro para a margem (mais devagar)
  try{const lk=lakeAt239(Math.round(x/CH),Math.round(z/CH));if(lk){const dx=x-lk.x,dz=z-lk.z,l=Math.hypot(dx,dz)||1;if(l<lk.r+8)return [dx/l*.5,dz/l*.5]}
   const a=riverNear239(x,z),b=riverNear239(x,z+4);if(a.d>40)return null;const dx=b.x-a.x,l=Math.hypot(dx,4);return [dx/l,4/l]}catch(_){return null}}
 const told={};
 function once(k,msg){if(told[k])return;told[k]=1;setTimeout(()=>delete told[k],60000);try{toast(msg,5000)}catch(_){}}
 function drift(o,dt,sp){const f=flow(o.x,o.z);if(!f)return false;o.x+=f[0]*sp*dt;o.z+=f[1]*sp*dt;return true}
 function tick(dt){
  if(typeof started==='undefined'||!started||typeof L==='undefined'||L.mode!=='world'||typeof run==='undefined'||!run)return;
  const fl=FL();if(fl<.15)return;
  const sp=1+fl*2.5; // m/s
  const B=window.Build437;
  if(B&&B.st){for(const b of B.st()){
   if(b.inDun||(b.kind!=='fogueira'&&b.kind!=='abrigo'))continue;
   const d=depth(b.x,b.z);if(d<.15)continue;
   if(b.kind==='fogueira'&&(b.fuel||0)>0){b.fuel=0;const s=B.spawned&&B.spawned.get(b.uid);if(s&&s.fireFx)s.fireFx.visible=false;once('fire','<b>[ENCHENTE]</b> A água apagou a fogueira.')}
   if(b.kind==='abrigo'&&d>.3&&drift(b,dt,sp)){const s=B.spawned&&B.spawned.get(b.uid);if(s){s.g.position.x=b.x;s.g.position.z=b.z;s.g.position.y=terrH(b.x,b.z);s.it.x=b.x;s.it.z=b.z}once('tent','<b>[ENCHENTE]</b> A correnteza está arrastando sua barraca!')}
  }}
  const c=run.cart437;
  if(c&&c.built&&!c.pulling&&!c.onBoat440&&depth(c.x,c.z)>.3&&drift(c,dt,sp)){once('cart','<b>[ENCHENTE]</b> A água levou o carrinho rio abaixo!');
   try{window.Cart437.moveTo630(c.x,c.z)}catch(_){}}
  const LT=window.Loot353;
  if(LT&&LT.records)for(const r of LT.records()){if(depth(r.x,r.z)<=.2||!drift(r,dt,sp*.8))continue;
   const a=LT.active.get(r.id);if(a){a.root.position.x=r.x;a.root.position.z=r.z;a.inter.x=r.x;a.inter.z=r.z}once('loot','<b>[ENCHENTE]</b> A água está levando despojos rio abaixo.')}
 }
 /* margem alagada fica mais umida e fertil (aluviao): a cada 1 s, celulas do EcoGrid sob a enchente perto do jogador */
 let aluv=0;
 function aluviao(dt){aluv+=dt;if(aluv<1)return;aluv=0;if(FL()<.3||!window.EcoGrid||!EcoGrid.getCellAt)return;
  const px=player.x,pz=player.z;
  for(let dx=-24;dx<=24;dx+=2)for(let dz=-24;dz<=24;dz+=2){const x=px+dx,z=pz+dz;if(depth(x,z)<=.02)continue;
   const q=EcoGrid.getCellAt(x,z);if(!q)continue;const g=q.grid,i=q.idx;
   if(g[i]<235)g[i]=Math.min(235,g[i]+25);if(g[i+1]<255)g[i+1]=Math.min(255,g[i+1]+3);
   const ch=EcoGrid.getChunkAt(x,z);if(ch)ch.ecoDirty=true}}
 let last=performance.now();
 setInterval(()=>{const n=performance.now(),dt=Math.min(.5,(n-last)/1000);last=n;try{if(!paused){tick(dt);aluviao(dt)}}catch(e){if(!tick.err){tick.err=1;console.warn('enchente630',e)}}},200);
 window.Enchente630={tick,flow};
})();
