/* v486 (Ian, 20/10/2026, print do elfo no campo): "tem muita pessoa", "estão carregando um bloco, não é nem pedra", "não é pra ir pro mesmo lugar",
   "ao invés de uma fundação de pedra, ter uma mina que eles entram pra escavar e daí voltam", "não pode ter as raças tudo no mesmo lugar...
   raças espalhadas em biomas certos", "eles podem estar na carroça... porque estão fazendo uma viagem longa".
   - Menos moradores (limite por cidade em src/core/400-loop.js).
   - Só 1 em cada 3 moradores trabalha, e o trabalho é a mina da cidade: sai pelo portão, entra na mina, fica lá dentro um tempo e volta.
     Sem caixa na mão, sem ir todos para o mesmo ponto (cada um tem um horário), sem pescador/lenhador de mentira.
   - Raça de quem mora pelo bioma da cidade: floresta → elfos; neve/vulcão/cristal → anões; o resto → humanos.
   - Gente de outra raça só como viajante: chega de carroça no portão, passeia na cidade e volta para a carroça, que vai embora. */
(()=>{
'use strict';
const T=THREE,TAU=Math.PI*2;
const hs=s=>{let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const R32=a=>{let s=a>>>0;return()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
const lin=s=>{s.fragmentShader=s.fragmentShader.replace('#include <encodings_fragment>','#include <encodings_fragment>\ngl_FragColor=LinearTosRGB(gl_FragColor);')};
const wallR=c=>{try{return window.City253&&City253.wallRadius?City253.wallRadius(cityL(c)):60}catch(_){return 60}};
const H=(x,z)=>{try{const h=(typeof gy==='function'?gy:terrH)(x,z);return isFinite(h)?h:0}catch(_){return 0}};

/* ---------- raça pelo bioma ---------- */
function nativeRace(c){let b='campos';try{b=biomeAt(c.x,c.z)}catch(_){}
 return /floresta|flores/.test(b)?'elf':/neve|vulcao|cristal/.test(b)?'dwarf':'human'}
function raceFor(c,seed,foreign){const nat=nativeRace(c),R=R32(seed);
 if(!foreign)return nat==='human'?'human':R()<.7?nat:'human';
 const others=['human','elf','dwarf'].filter(r=>r!==nat);return others[Math.floor(R()*others.length)]}

/* ---------- mina de cada cidade ---------- */
const MINE_URL='models/povo482/mina482.glb?v=486';let mineG,mineAsk=false;const mines=new Map();
function loadMine(){if(mineAsk)return;mineAsk=true;const ld=new T.GLTFLoader();if(window.MeshoptDecoder)ld.setMeshoptDecoder(MeshoptDecoder);
 ld.load(MINE_URL,g=>{g.scene.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true;o.material=o.material.clone();o.material.onBeforeCompile=lin;o.material.customProgramCacheKey=()=>'mina486'}});
  const b=new T.Box3().setFromObject(g.scene),sz=b.getSize(new T.Vector3());g.k486=7/Math.max(sz.x,sz.z,.01);g.y486=-b.min.y;mineG=g},undefined,()=>{mineG=false})}
/* lugar fixo por cidade: fora da muralha maior, longe da estrada e da água, no ponto mais alto entre os candidatos (encosta) */
/* árvores, pedras e casas ficam em ch.cols de cada pedaço carregado do mapa */
function loadedAt(x,z){try{for(const ch of chunks.values())if(Math.abs(ch.cx*CH-x)<=CH/2+.5&&Math.abs(ch.cz*CH-z)<=CH/2+.5&&ch.cols)return true}catch(_){}return false}
function blockedAt(x,z){try{for(const ch of chunks.values()){if(Math.abs(ch.cx*CH-x)>CH*1.5||Math.abs(ch.cz*CH-z)>CH*1.5)continue;for(const c of ch.cols||[])if(!c.mina486&&Math.hypot(c.x-x,c.z-z)<10+(c.r||0))return true}}catch(_){}return false}
function mineSpot(c){if(mines.has(c.id))return mines.get(c.id);if(!c.minesTry486)c.minesTry486=0;const R=R32(hs('mina486|'+c.id)),a0=R()*TAU,r0=Math.max(wallR(c),115)+40;let best=null,bh=-1e9;
 for(let k=0;k<24;k++){const a=a0+k*TAU/24,d=r0+R()*30,x=c.x+Math.cos(a)*d,z=c.z+Math.sin(a)*d;
  try{if(onRoad(roadSegs(x,z,1),x,z,12)||inWater244(x,z))continue}catch(_){}
  /* sem árvore, pedra ou casa a menos de 10 m (Ian: a mina não pode nascer no meio das árvores) */
  if(blockedAt(x,z)||(c.bad486||[]).some(b=>Math.hypot(b.x-x,b.z-z)<20))continue;
  const h=H(x,z);if(h>bh){bh=h;best={x,z}}}
 if(!best)best={x:c.x+Math.cos(a0)*r0,z:c.z+Math.sin(a0)*r0};
 const face=Math.atan2(c.x-best.x,c.z-best.z),door={x:best.x+Math.sin(face)*4.2,z:best.z+Math.cos(face)*4.2};
 const s={c,x:best.x,z:best.z,face,door,obj:null,cols:[]};mines.set(c.id,s);return s}
/* colisão: rocha e madeiramento da mina (a porta fica livre para o minerador entrar) */
function addCols(s){const f=s.face,bx=Math.sin(f),bz=Math.cos(f),sx=bz,sz=-bx;
 for(const [k,side,r] of [[-1.2,0,2.6],[-.4,2.6,1.6],[-.4,-2.6,1.6],[-2.6,1.6,1.8],[-2.6,-1.6,1.8]]){const c={x:s.x+bx*k+sx*side,z:s.z+bz*k+sz*side,r,mina486:true};hadd(HASH,c);s.cols.push(c)}}
function delCols(s){for(const c of s.cols){try{hnear(HASH,c.x,c.z,()=>{});for(const a of HASH.values()){const i=a.indexOf(c);if(i>=0){a.splice(i,1);break}}}catch(_){}}s.cols=[]}
function showMines(){if(typeof player==='undefined'||!player||typeof scene==='undefined'||typeof L==='undefined'||L.mode!=='world')return;
 loadMine();let near=[];try{near=citiesAround(player.x,player.z,420)}catch(_){}
 for(const c of near){if(typeof cityFallen==='function'&&cityFallen(c))continue;const s=mineSpot(c);if(!s.obj&&mineG){const o=T.SkeletonUtils?T.SkeletonUtils.clone(mineG.scene):mineG.scene.clone(true);
  o.scale.setScalar(mineG.k486);o.position.set(s.x,H(s.x,s.z)+mineG.y486*mineG.k486-.15,s.z);o.rotation.y=s.face;o.name='mina486';scene.add(o);s.obj=o;addCols(s)}}
 /* conferência perto: as árvores de um pedaço só existem quando ele carrega; se a mina caiu nelas, muda de lugar */
 for(const s of [...mines.values()]){if(!s.ok486&&Math.hypot(player.x-s.x,player.z-s.z)<140&&loadedAt(s.x,s.z)){if(blockedAt(s.x,s.z)){(s.c.bad486||(s.c.bad486=[])).push({x:s.x,z:s.z});if(s.obj)scene.remove(s.obj);delCols(s);mines.delete(s.c.id)}else s.ok486=true}}
 for(const s of mines.values()){if(s.obj&&Math.hypot(player.x-s.x,player.z-s.z)>620){scene.remove(s.obj);s.obj=null;delCols(s)}}}

/* ---------- moradores: menos trabalho, só a mina ---------- */
function speakDefault(n,c){n.use=()=>{try{speech153(n,(typeof regionLine116==='function'&&regionLine116(c))||pick(CLINES),'Moradora(o) de '+c.name)}catch(_){}}}
function stripJob(n){if(n.cargo348&&n.cargo348.parent)n.cargo348.parent.remove(n.cargo348);delete n.cargo348;delete n.job348;delete n.workRoute348;delete n.workSite348;n.short=n.name}
/* nomes medievais por raça (Ian: "é um mundo medieval") */
const NM={human:{m:['Aldric','Bertram','Cedric','Godwin','Gerold','Hugo','Leofric','Osric','Roderic','Tobias','Wendel','Alaric'],f:['Agnes','Brígida','Elsbeth','Gisela','Helena','Ilse','Matilde','Maud','Nesta','Odila','Petronela','Rosamund']},
 elf:{m:['Aelar','Caelion','Elrond','Faelar','Ithrandil','Lorien','Sylvar','Thalion','Varis','Erevan'],f:['Aerwyn','Elaria','Ilyana','Lirael','Naivara','Sariel','Thessaly','Ylvaine','Faelith','Shava']},
 dwarf:{m:['Balin','Durgin','Gorim','Harbek','Korgan','Morgrim','Rurik','Thorgar','Ulfgar','Brottor'],f:['Amber','Bardryn','Dagnal','Eldeth','Gunnloda','Helja','Kathra','Mardred','Riswynn','Torbera']}};
function rename(n,race,seed){const R=R32(seed),sx=n.p482.sex||(R()<.5?'f':'m');n.p482.sex=sx;const L0=(NM[race]||NM.human)[sx];const nm=L0[Math.floor(R()*L0.length)];
 n.name=nm;n.short=nm;n.label='F · CONVERSAR COM '+nm.toUpperCase()}
const perCity=new Map();
function makeMiner(n,c){const s=mineSpot(c),R=R32(hs(n.name+'|'+c.id+'|'+perCity.get(c.id)));
 if(n.cargo348&&n.cargo348.parent)n.cargo348.parent.remove(n.cargo348);n.cargo348=new T.Object3D();/* sem caixa na mão */
 n.job348=2;n.mine486={inside:0,rest:20+R()*160,R};/* cada um sai num horário diferente */
 n.workSite348={x:s.door.x+(R()-.5)*2,z:s.door.z+(R()-.5)*2};n.workPhase348='volta';n.workRoute348=[];n.short=n.name+' · Minerador'+(sexF(n)?'a':'');
 n.use=()=>{try{speech153(n,n.mine486.inside>0?'':n.workPhase348==='ida'?'Vou para a mina. O turno é longo lá dentro.':'Voltando da mina de '+c.name+'. O pó de pedra gruda em tudo.','Minerador')}catch(_){}}}
const sexF=n=>n.p482?n.p482.sex==='f':/a$/.test(String(n.name||''));
const baseSpawn=spawnCitizen;
spawnCitizen=function(c,opt){const n=baseSpawn.apply(this,arguments);try{if(!n||n.critter||!c)return n;
  const foreign=!!(opt&&opt.foreign486);if(n.p482)n.p482.race=raceFor(c,hs(n.name+'|'+c.id+'|'+Math.round(n.x)+'|'+Math.round(n.z)),foreign);
  if(n.p482)rename(n,n.p482.race,hs(n.name+'|'+c.id+'|'+Math.round(n.x)));
  if(foreign){stripJob(n);speakDefault(n,c);return n}
  const i=perCity.get(c.id)||0;perCity.set(c.id,i+1);
  if(n.job348!=null){if(i%3===0)makeMiner(n,c);else{stripJob(n);speakDefault(n,c)}}
 }catch(e){console.warn('vida486',e)}return n};

/* ---------- viajantes de carroça ---------- */
const trips=new Set();let tripT=40;
function startTrip(c){if(!window.Wagon369||!Wagon369.ok)return;const R=R32(hs('trip|'+c.id+'|'+Math.floor(performance.now()/1000)));
 const a=Math.round(R()*4)%4*(Math.PI/2),wr=Math.max(wallR(c),60),stop=wr+12,from=wr+75,dir={x:Math.cos(a),z:Math.sin(a)};
 const w=Wagon369.create();if(!w)return;const holder=new T.Group();holder.add(w.g);scene.add(holder);
 const t={c,w,holder,dir,d:from,stop,phase:'chega',folks:[],stay:150+R()*150,R};trips.add(t);place(t)}
function place(t){const x=t.c.x+t.dir.x*t.d,z=t.c.z+t.dir.z*t.d;t.holder.position.set(x,H(x,z),z);
 const toward=t.phase==='vai'?1:-1;t.holder.rotation.y=Math.atan2(t.dir.x*toward,t.dir.z*toward)}
function unload(t){const c=t.c,n=1+(t.R()<.5?1:0),side={x:-t.dir.z,z:t.dir.x};
 for(let i=0;i<n;i++){const p=spawnCitizen(c,{foreign486:true});if(!p)continue;p.x=t.holder.position.x+side.x*(1.8+i);p.z=t.holder.position.z+side.z*(1.8+i);
  if(p.m&&p.m.root)p.m.root.position.set(p.x,0,p.z);p.trip486=t;p.short=p.name+' · Viajante';p.tx=c.x;p.tz=c.z;p.wait=0;
  p.use=()=>{try{speech153(p,p.leave486?'A estrada é longa. Hora de seguir viagem.':pick(['Viemos de longe. A carroça precisa descansar tanto quanto nós.','Só uma parada para comprar mantimentos e seguimos.','Dizem que o mercado daqui é bom. Veremos.']),'Viajante')}catch(_){}};t.folks.push(p)}}
function tickTrips(dt){if(typeof player==='undefined'||!player||L.mode!=='world')return;
 tripT-=dt;if(tripT<=0){tripT=120+Math.random()*120;try{const nc=nearestCity(player.x,player.z),c=nc&&nc.c;if(c&&nc.d<220&&!isNight()&&!(typeof cityFallen==='function'&&cityFallen(c))&&![...trips].some(t=>t.c===c))startTrip(c)}catch(_){}}
 for(const t of trips){let moved=0;
  if(t.phase==='chega'){const s=Math.min(dt*2.6,t.d-t.stop);t.d-=s;moved=s;place(t);if(t.d<=t.stop+.01){t.phase='parada';unload(t)}}
  else if(t.phase==='parada'){t.stay-=dt;const alive=t.folks.filter(p=>!p.gone&&typeof npcs!=='undefined'&&npcs.includes(p));t.folks=alive;
   if(t.stay<=0)for(const p of alive)p.leave486=true;
   if(t.stay<=0&&!alive.length){t.phase='vai';t.d=t.stop}}
  else{t.d+=dt*2.6;moved=dt*2.6;place(t);if(t.d>t.stop+90){scene.remove(t.holder);try{t.w.mixer.stopAllAction()}catch(_){}trips.delete(t)}}
  try{Wagon369.animate(t.w,dt,moved,0)}catch(_){}
  if(Math.hypot(player.x-t.c.x,player.z-t.c.z)>700){for(const p of t.folks)drop(p);scene.remove(t.holder);trips.delete(t)}}}
function drop(p){p.gone=true;try{if(p.m&&p.m.root&&p.m.root.parent)p.m.root.parent.remove(p.m.root)}catch(_){}const i=typeof npcs!=='undefined'?npcs.indexOf(p):-1;if(i>=0)npcs.splice(i,1)}
function walkTo(n,x,z,dt){const dx=x-n.x,dz=z-n.z,d=Math.hypot(dx,dz);if(d<1.4)return true;const a=Math.atan2(dx,dz),step=Math.min(d,dt*2.3);let ch=a;
 for(const off of [0,.6,-.6,1.2,-1.2])if(worldFree(n.x+Math.sin(a+off)*(step+.6),n.z+Math.cos(a+off)*(step+.6),n.r||.45)){ch=a+off;break}
 turnTo(n,ch,dt,6);moveEnt(n,Math.sin(ch)*step,Math.cos(ch)*step);return false}

/* ---------- comportamento por quadro ---------- */
const baseNpc=updNpc;
updNpc=function(n,dt){
 /* viajante indo embora: volta até a carroça e sobe */
 if(n.leave486&&n.trip486){const h=n.trip486.holder.position;if(walkTo(n,h.x,h.z,dt)){drop(n);return}
  animChibi(n.m,{move:1,atk:0,dead:0,wind:0},n.t=(n.t||0)+dt);n.m.root.position.set(n.x,0,n.z);n.m.root.rotation.y=n.face;return}
 const M=n.mine486;if(M){
  if(M.inside>0){M.inside-=dt;n.m.root.visible=false;n.noLabel=true;if(M.inside<=0){n.m.root.visible=true;n.noLabel=false;n.workPhase348='volta';n.workWait348=0;
    try{Workers348.route(n,{x:n.home.x+(M.R()-.5)*16,z:n.home.z+(M.R()-.5)*16})}catch(_){}}return}
  /* chegou à porta da mina: entra e passa 1 a 3 minutos lá dentro */
  if(n.workPhase348==='ida'&&n.workRoute348&&!n.workRoute348.length){M.inside=60+M.R()*120;n.workWait348=0;return}
  /* de volta à cidade: vive como morador comum por um tempo antes do próximo turno */
  if(n.workPhase348==='volta'&&n.workRoute348&&!n.workRoute348.length){M.rest-=dt;const j=n.job348;n.job348=null;try{baseNpc(n,dt)}finally{n.job348=j}
   if(M.rest<=0){M.rest=120+M.R()*240;n.workPhase348='ida';const d=mineSpot(n.home).door;n.workSite348={x:d.x+(M.R()-.5)*2,z:d.z+(M.R()-.5)*2};try{Workers348.route(n,n.workSite348)}catch(_){}}return}
  n.workWait348=0;}
 return baseNpc(n,dt)};

let last=performance.now();
setInterval(()=>{const now=performance.now(),dt=Math.min(.5,(now-last)/1000);last=now;try{showMines();tickTrips(dt)}catch(e){console.warn('vida486',e)}},250);
window.Vida486={mines,trips,nativeRace,mineSpot,startTrip};
})();
