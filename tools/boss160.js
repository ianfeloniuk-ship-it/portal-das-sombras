/* v161 (pedido do Ian): chefes das classes raras feitos no Tripo a partir das referências aprovadas
   (Entregas/Tripo-Referencias-Classes-2026-10-01/Personagens). Cada portal de classe rara troca o
   chefe genérico pelo modelo da classe. Os chefes têm esqueleto Mixamo (rig do Tripo), igual ao das
   animações do Viajante (models/anim-viajante155.glb): as rotações tocam direto nos ossos do chefe.
   Pedido do Ian: "eles tbm tem que soltar o poder referente a eles" — cada chefe usa o poder da classe. */
(function(global){
  'use strict';
  const T=global.THREE,API={};
  // id do conjunto raro → id da classe (projétil da classe vem do Proj155).
  const CLS={necromante:7,tempo:12,tecelao:13,guardiao:14,metamorfo:15,artifice:16,duelista:17,condutor:18,oraculo:19,devorador:20};
  const ATK={necromante:['cajado1','magia_mao'],tempo:['cajado1','magia_mao'],tecelao:['magia_mao','cajado2'],oraculo:['cajado1','magia_mao'],condutor:['magia_mao','lanca1'],devorador:['soco','pesado2'],metamorfo:['soco','pesado1'],guardiao:['pesado1','pesado2'],artifice:['pesado1','pesado2'],duelista:['adaga1','golpe2']};
  const HEIGHT=3.3;
  const cache=new Map();let anim=null;
  function loader(){const L=new T.GLTFLoader();if(global.MeshoptDecoder)L.setMeshoptDecoder(global.MeshoptDecoder);return L}
  function loadAnim(){if(!anim)anim=new Promise(r=>loader().load('models/anim-viajante155.glb',g=>r(g),undefined,()=>r(null)));return anim}
  function load(id){if(!cache.has(id))cache.set(id,new Promise(r=>loader().load('models/chefes160/'+id+'.glb',g=>r(g),undefined,()=>r(null))));return cache.get(id)}
  API.has=id=>!!CLS[id];
  // Só rotações: as posições do rig do Viajante esticariam um corpo de outro tamanho.
  const clipsFor=new WeakMap();
  function clips(a,names){let m=clipsFor.get(a);if(!m){m={};for(const c of a.animations){const tr=c.tracks.filter(t=>t.name.endsWith('.quaternion')&&names.has(t.name.split('.')[0]));m[c.name]=new T.AnimationClip(c.name,c.duration,tr)}clipsFor.set(a,m)}return m}
  API.attach=function(e,id){
    if(!CLS[id]||!e||!e.m||!e.m.root)return;
    e.boss160id=id;skin(e,load(id),HEIGHT,ATK[id]||['pesado1']);
  };
  /* v165: mobs dos clãs (models/mobs165/<arquivo>.glb) usam o mesmo esqueleto e animações. */
  const mobCache=new Map();
  API.mob=function(e,file,height,moves){if(!e||!e.m||!e.m.root)return;const url='models/mobs165/'+file+'.glb';
    if(!mobCache.has(url))mobCache.set(url,new Promise(r=>loader().load(url,g=>r(g),undefined,()=>r(null))));
    e.mob165=file;skin(e,mobCache.get(url),height||1.6,moves||['golpe1','golpe2'])};
  function skin(e,gp,HEIGHT,moves){
    Promise.all([gp,loadAnim()]).then(([g,a])=>{
      if(!g||!a||e.gone||!e.m.root.parent)return;
      const model=T.SkeletonUtils.clone(g.scene);model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.frustumCulled=false;const m=o.material;if(m)m.metalness=Math.min(m.metalness||0,.3)}});
      const holder=new T.Group();holder.add(model);model.updateMatrixWorld(true);
      const box=new T.Box3().setFromObject(model),h=box.max.y-box.min.y,ws=e.m.root.getWorldScale(new T.Vector3()).y||1,s=HEIGHT/h/ws;
      model.scale.setScalar(s);model.position.y=-box.min.y*s;
      e.m.root.traverse(o=>{if(o.isMesh||o.isSkinnedMesh)o.visible=false});e.m.root.add(holder);
      const names=new Set();model.traverse(o=>{if(o.isBone)names.add(o.name)});
      const C=clips(a,names),mixer=new T.AnimationMixer(model),act={};for(const n in C)act[n]=mixer.clipAction(C[n]);
      const B={model,mixer,act,cur:null,last:performance.now(),px:e.x,pz:e.z,atk:0};e.boss160=B;
      const play=(n,once,dur)=>{const x=act[n]||act.idle;if(!x)return null;if(B.cur===x)return x;if(B.cur)B.cur.fadeOut(.15);x.reset();x.setLoop(once?T.LoopOnce:T.LoopRepeat);x.clampWhenFinished=!!once;x.timeScale=dur?x.getClip().duration/dur:1;x.fadeIn(.15).play();B.cur=x;return x};
      const tick=()=>{if(e.gone||!e.m.root.parent)return;
        const now=performance.now(),dt=Math.min(.1,(now-B.last)/1000);B.last=now;
        const sp=Math.hypot(e.x-B.px,e.z-B.pz)/Math.max(dt,1e-3);B.px=e.x;B.pz=e.z;
        if(e.dead)play('morte',true);
        else if(e.act&&e.act.type){if(!B.inAtk){B.inAtk=true;B.atk=(B.atk+1)%moves.length;play(moves[B.atk],true,Math.max(.5,(e.act.wind||.6)+.35))}}
        else{B.inAtk=false;if(sp>.4){const x=play('correr');if(x)x.timeScale=.8}else play('idle')}
        mixer.update(dt);requestAnimationFrame(tick)};
      requestAnimationFrame(tick);
    });
  }

  /* ---------- Poderes de cada classe ---------- */
  const G=global,TAU=Math.PI*2,R=(a,b)=>a+Math.random()*(b-a);
  const say=(b,n)=>G.toast&&G.toast('<b>[NARRADOR]</b> '+b.name+': '+n,1400);
  const env=()=>API.env||{},P=()=>env().P&&env().P(),dun=()=>{const l=env().L&&env().L();return !!l&&l.mode==='dungeon'};
  const later=(b,ms,f)=>setTimeout(()=>{if(!b.dead&&dun())f()},ms);
  const shot=(b,a,spd,mul,col,o)=>G.shoot(b.x,b.z,a,spd,b.dmg*mul,'enemy',col,'orb',Object.assign({basicClass:CLS[b.boss160id]},o||{}));
  const aim=(b,t)=>Math.atan2(t.x-b.x,t.z-b.z);
  // Rajada leve (substitui o anel genérico de orbes vermelhos).
  const VOLLEY={
    necromante:(b,t,n)=>{const o=Math.random()*TAU;for(let i=0;i<n;i++)shot(b,o+i/n*TAU,7,.42,0x7dff9a,{})},
    tempo:(b,t,n)=>{const o=Math.random()*TAU;for(let i=0;i<n;i++)shot(b,o+i/n*TAU,6,.4,0xffd27a,{slow:.5})},
    tecelao:(b,t,n)=>{for(let i=0;i<n;i++)later(b,i*70,()=>shot(b,aim(b,t)+(i-n/2)*.18,10,.4,0xc58cff))},
    guardiao:(b,t,n)=>{const a=aim(b,t);for(let i=-2;i<=2;i++)shot(b,a+i*.22,8,.5,0x9fd8ff,{sc:1.6,kb:2.2})},
    metamorfo:(b,t,n)=>{const a=aim(b,t);for(const k of[-.3,0,.3])shot(b,a+k,14,.5,0x8fe36a)},
    artifice:(b,t,n)=>{const a=aim(b,t);for(const k of[-.5,0,.5])shot(b,a+k,11,.45,0xffb347,{bounces:2})},
    duelista:(b,t,n)=>{const a=aim(b,t);for(let i=0;i<4;i++)later(b,i*90,()=>shot(b,a+R(-.08,.08),20,.35,0xff6b6b,{pierce:true}))},
    condutor:(b,t,n)=>{const a=aim(b,t);for(const k of[-.35,-.12,.12,.35])shot(b,a+k,16,.42,0xc8ecff,{stun:.25})},
    oraculo:(b,t,n)=>{const o=Math.random()*TAU;for(let i=0;i<4;i++)shot(b,o+i/4*TAU,9,.45,0x9fe8ff);later(b,350,()=>{for(let i=0;i<4;i++)shot(b,o+(i+.5)/4*TAU,9,.45,0x9fe8ff)})},
    devorador:(b,t,n)=>{const a=aim(b,t);shot(b,a,9,.8,0x6a2bb3,{sc:2,pierce:true})}
  };
  API.volley=function(b,t,n){const f=VOLLEY[b.boss160id];if(!f||!G.shoot)return false;f(b,t,n);G.sfx&&G.sfx('swing');return true};
  // Golpe especial (substitui o especial genérico do chefe).
  const SPECIAL={
    necromante:(b,t,p2)=>{const n=p2?6:4;for(let i=0;i<n;i++){const x=t.x+(i?R(-4,4):0),z=t.z+(i?R(-4,4):0);G.hazard(x,z,2,1+i*.15,b.dmg*1.1,'enemy',0x7dff9a)}
      if(G.spawnKind&&G.bossMinion124){const k=p2?3:2;for(let i=0;i<k;i++){const a=i/k*TAU,x=b.x+Math.cos(a)*3,z=b.z+Math.sin(a)*3;try{const m=G.spawnKind(G.bossMinion124(b,'minion'),x,z,b.gr,{room:b.room});m.aggro=true;G.fxRing&&G.fxRing(m.x,m.z,0x7dff9a,1.5)}catch(e){}}}
      say(b,'Levantar os Mortos')},
    tempo:(b,t,p2)=>{const n=p2?5:3;for(let i=0;i<n;i++){const x=t.x+(i?R(-3,3):0),z=t.z+(i?R(-3,3):0);G.hazard(x,z,2.6,1+i*.35,b.dmg*1.2,'enemy',0xffd27a)}say(b,'Instante Parado')},
    tecelao:(b,t,p2)=>{const a=aim(b,t);for(let i=1;i<=(p2?8:6);i++)G.hazard(b.x+Math.sin(a)*i*2.2,b.z+Math.cos(a)*i*2.2,1.5,.7+i*.08,b.dmg*1.3,'enemy',0xc58cff);say(b,'Rasgo de Fenda')},
    guardiao:(b,t,p2)=>{G.hazard(b.x,b.z,p2?8:6,1,b.dmg*1.5,'enemy',0x9fd8ff);G.fxRing&&G.fxRing(b.x,b.z,0x9fd8ff,4,.8);say(b,'Bastião Inabalável')},
    metamorfo:(b,t,p2)=>{const a=aim(b,t);b.face=a;b.act={type:'charge',t:0,wind:.7,dir:{x:Math.sin(a),z:Math.cos(a)}};G.fxBurst&&G.fxBurst(b.x,1.5,b.z,0x8fe36a,14,5);say(b,'Fúria da Fera')},
    artifice:(b,t,p2)=>{const n=p2?5:3;for(let i=0;i<n;i++){const a=i/n*TAU,x=t.x+Math.cos(a)*3,z=t.z+Math.sin(a)*3;G.hazard(x,z,2,1.4,b.dmg*1.2,'enemy',0xffb347)}say(b,'Minas Engenhosas')},
    duelista:(b,t,p2)=>{const a=aim(b,t);b.face=a;b.act={type:'lunge',t:0,wind:.35,dir:{x:Math.sin(a),z:Math.cos(a)}};if(p2)later(b,800,()=>{const a2=aim(b,P()||t);b.face=a2;b.act={type:'lunge',t:0,wind:.25}});say(b,'Estocada Relâmpago')},
    condutor:(b,t,p2)=>{const n=p2?4:3;for(let i=0;i<n;i++)later(b,i*450,()=>{const p=P()||t;G.hazard(p.x,p.z,2.2,.8,b.dmg*1.1,'enemy',0xc8ecff)});say(b,'Corrente de Raios')},
    oraculo:(b,t,p2)=>{const pl=P()||{},vx=pl.vx||0,vz=pl.vz||0;G.hazard(t.x+vx*1.1,t.z+vz*1.1,3,1.1,b.dmg*1.5,'enemy',0x9fe8ff);if(p2)G.hazard(t.x,t.z,2.2,1.4,b.dmg,'enemy',0x9fe8ff);say(b,'Visão do Destino')},
    devorador:(b,t,p2)=>{const p=P();if(p&&Math.hypot(p.x-b.x,p.z-b.z)<14){const d=Math.hypot(p.x-b.x,p.z-b.z)||1,k=Math.min(4,d-2);if(k>0&&G.moveEnt)G.moveEnt(p,(b.x-p.x)/d*k,(b.z-p.z)/d*k)}G.hazard(b.x,b.z,p2?6:4.5,1,b.dmg*1.4,'enemy',0x6a2bb3);say(b,'Fome do Vazio')}
  };
  API.special=function(b,t){const f=SPECIAL[b.boss160id];if(!f||!G.hazard)return false;if(!b.act)b.act={type:'cast',t:0,wind:.6};f(b,t,b.phase>=2);return true};
  global.Boss160=API;
})(window);
