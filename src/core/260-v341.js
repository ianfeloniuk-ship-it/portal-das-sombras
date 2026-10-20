/* ===== v341 (Ian): PORTÕES DAS CIDADES =====
   Monstro comum não passa do portão; de dentro da cidade não dá para ferir quem está fora; quem invade a cidade (ataque, invasão, cerco) pode atacar o jogador lá dentro. */
const GATES341=[];let gateTex341=null,gateHint341=0;
const cityRaider341=e=>!!(e.raid155||e.breaker||e.inv||e.siege||e.aw103);
function wallBlock341(e){return L.mode==='world'&&!cityRaider341(e)&&!!inCity(player.x,player.z)&&!inCity(e.x,e.z)}
function gateTexture341(){if(gateTex341)return gateTex341;const cv=document.createElement('canvas');cv.width=512;cv.height=256;const x=cv.getContext('2d');const tones=['#8a5a32','#7c4f2b','#93633a','#70452a'];for(let i=0;i<16;i++){x.fillStyle=tones[(i*7+3)%4];x.fillRect(i*32,0,32,256);x.fillStyle='rgba(40,22,10,.55)';x.fillRect(i*32,0,3,256);x.fillStyle='rgba(255,220,170,.10)';x.fillRect(i*32+5,0,4,256);for(let k=0;k<3;k++){x.fillStyle='rgba(50,28,12,.28)';x.fillRect(i*32+8+((i*13+k*9)%16),(i*37+k*71)%220,2,26)}}
 for(const y of[34,128,206]){x.fillStyle='#3b352e';x.fillRect(0,y,512,22);x.fillStyle='#6a6257';x.fillRect(0,y+2,512,4);x.fillStyle='#1f1b17';x.fillRect(0,y+18,512,4);for(let i=0;i<16;i++){x.fillStyle='#a79f90';x.beginPath();x.arc(i*32+16,y+11,4,0,TAU);x.fill();x.fillStyle='#20232c';x.beginPath();x.arc(i*32+17,y+12,2,0,TAU);x.fill()}}
 gateTex341=new THREE.CanvasTexture(cv);if(THREE.sRGBEncoding&&renderer.outputEncoding===THREE.sRGBEncoding)gateTex341.encoding=THREE.sRGBEncoding;return gateTex341}
function cityGates341(c,g,fallen,ring,half,h){const wood=new THREE.MeshToonMaterial({map:gateTexture341(),gradientMap:gmap,color:fallen?0x777777:0xffffff}),post=toonS(fallen?0x4a463f:0x9a917c),iron=toonS(0x3b352e);
 for(const a of[0,Math.PI/2,Math.PI,Math.PI*1.5]){const G=new THREE.Group();G.position.set(c.x+Math.cos(a)*ring,0,c.z+Math.sin(a)*ring);G.rotation.y=-(a+Math.PI/2);const leaves=[];
  for(const sd of[-1,1]){const pv=new THREE.Group();pv.position.set(sd*half,0,0);const w=half-.12,leaf=new THREE.Mesh(new THREE.BoxGeometry(w,h,.34),wood);leaf.position.set(-sd*w/2,h/2+.08,0);leaf.castShadow=true;pv.add(leaf);
   const cap=new THREE.Mesh(new THREE.BoxGeometry(w,.22,.46),iron);cap.position.set(-sd*w/2,h+.16,0);pv.add(cap);const edge=new THREE.Mesh(new THREE.BoxGeometry(.22,h,.46),iron);edge.position.set(-sd*(w-.11),h/2+.08,0);pv.add(edge);
   const col=new THREE.Mesh(new THREE.BoxGeometry(1.1,h+1.1,1.5),post);col.position.set(sd*(half+.5),(h+1.1)/2,0);col.castShadow=true;G.add(col);const top=new THREE.Mesh(new THREE.ConeGeometry(.95,.9,4),iron);top.position.set(sd*(half+.5),h+1.55,0);top.rotation.y=Math.PI/4;G.add(top);
   G.add(pv);leaves.push({pv,sd})}
  g.add(G);const gt={c,g:G,leaves,x:G.position.x,z:G.position.z,open:fallen?1:0,fallen,half};if(fallen){leaves[0].pv.rotation.y=1.9;leaves[1].pv.rotation.y=-1.25;leaves[1].pv.rotation.z=.12}GATES341.push(gt)}}
function updGates341(dt){for(let i=GATES341.length-1;i>=0;i--){const gt=GATES341[i];let o=gt.g,ok=false;while(o){if(o===scene){ok=true;break}o=o.parent}if(!ok){GATES341.splice(i,1);continue}if(gt.fallen)continue;
  const pd=Math.hypot(player.x-gt.x,player.z-gt.z),cart429=window.Civic343&&Civic343.wagons.some(w=>!w.gone&&!w.wreck&&Math.hypot(w.x-gt.x,w.z-gt.z)<gt.half+10);if(pd>150&&!cart429)continue;let want=!player.dead&&pd<gt.half+6||cart429?1:0;/* v429 (Ian): o portão abre para a carroça passar */if(!want&&npcs.some(n=>!n.gone&&Math.hypot(n.x-gt.x,n.z-gt.z)<gt.half+5))want=1;if(!want)for(const e of enemies)if(!e.dead&&cityRaider341(e)&&Math.hypot(e.x-gt.x,e.z-gt.z)<gt.half+8){want=1;break}
  if(want!==gt.want){if(gt.want!==undefined&&pd<45)try{sfx('block')}catch(_){}gt.want=want}gt.open+=(want-gt.open)*Math.min(1,dt*2.6);if(Math.abs(want-gt.open)<.002)gt.open=want;for(const l of gt.leaves)l.pv.rotation.y=l.sd*gt.open*1.75}}
function buildCity(c,g,addCol,R){
  const X=c.x,Z=c.z,E=ENV.ok;const fallen=cityFallen(c),cLv=cityL(c);let shopH={};
  if(E)shopH=envCity(c,g,addCol,R,fallen,cLv);else{
  const walls=[];for(let a=0;a<TAU-.01;a+=TAU/80){const off=Math.min(...[0,Math.PI/2,Math.PI,Math.PI*1.5,TAU].map(q=>Math.abs(a-q)));if(off<.16)continue;const x=X+Math.cos(a)*34,z=Z+Math.sin(a)*34;walls.push({x,y:1.7,z,ry:-(a+Math.PI/2)});addCol({x,z,r:1.6})}
  inst(geo('wall',()=>new THREE.BoxGeometry(3.1,3.4,1.2)),toonS(0x44506e),walls,true,g);
  inst(geo('wtrim',()=>new THREE.BoxGeometry(3.1,.12,1.25)),glowS(0xffb347,.5),walls.map(w=>({...w,y:3.45})),false,g);
  for(const a of[0,Math.PI/2,Math.PI,Math.PI*1.5])for(const s of[-1,1]){const aa=a+s*.2;const t=mesh(geo('tower',()=>new THREE.CylinderGeometry(1.4,1.6,6,8)),toonS(0x3a4560));t.position.set(X+Math.cos(aa)*34,3,Z+Math.sin(aa)*34);g.add(t);const f=new THREE.Mesh(geo('tflame',()=>new THREE.SphereGeometry(.4,8,6)),glowS(0xffd08a,1));f.position.set(t.position.x,6.5,t.position.z);g.add(f)}
  const ob=mesh(geo('obel',()=>new THREE.CylinderGeometry(.5,1.2,5,4)),toonS(0x2b3a5a));ob.position.set(X,2.5,Z);g.add(ob);addCol({x:X,z:Z,r:2.2});
  for(let i=0;i<8;i++){const a=i/8*TAU+TAU/16;const p=mesh(geo('lamp',()=>new THREE.CylinderGeometry(.08,.1,2.6,6)),toonS(0x2b2b38));p.position.set(X+Math.cos(a)*11,1.3,Z+Math.sin(a)*11);g.add(p);const q=new THREE.Mesh(geo('lampg',()=>new THREE.SphereGeometry(.28,8,6)),glowS(0xffd9a0,1));q.position.set(p.position.x,2.7,p.position.z);g.add(q)}
  for(const a of[20,70,110,160,200,250,290,340]){const r=a*Math.PI/180,x=X+Math.cos(r)*27,z=Z+Math.sin(r)*27;const hg=new THREE.Group();hg.position.set(x,0,z);hg.rotation.y=Math.atan2(X-x,Z-z);hg.scale.setScalar(.85+R()*.3);
    const b=mesh(geo('hb',()=>new THREE.BoxGeometry(5,3.2,4.5)),toonS(0x39456a));b.position.y=1.6;hg.add(b);const rf=mesh(geo('hr',()=>{const q=new THREE.ConeGeometry(1,2.2,4);q.rotateY(Math.PI/4);return q}),toonS(0x1f2a44));rf.scale.set(4.1,1,3.7);rf.position.y=4.3;hg.add(rf);
    const w=new THREE.Mesh(geo('hw',()=>new THREE.PlaneGeometry(.8,.8)),glowS(0xffd9a0,.9));w.position.set(1.2,2,2.27);hg.add(w);g.add(hg);addCol({x,z,r:3.4})}
  }
  const plaza=new THREE.Mesh(geo('plaza',()=>new THREE.RingGeometry(12.6,13.2,48)),toonS(0x8e846a));plaza.rotation.x=-Math.PI/2;plaza.position.set(X,.03,Z);g.add(plaza);
  const cr=(!fallen&&window.Anchor434&&Anchor434.seal(c,addCol))||seal231(fallen,c.capital);cr.position.set(X,0,Z);g.add(cr);/* v434 (Ian): nas 5 capitais das Pedras-Âncora a pedra fica no lugar do selo (tools/mechanics434.js) *//* v231 (Ian): coluna de ponta quadrada com a esfera de plasma que sela a prisão; quebrada na cidade caída */
  const cl=new THREE.PointLight(0xffd08a,1.2,26,1.5);cl.position.set(X,6,Z);g.add(cl);
  const nm=makeCitySign(fallen?c.name.toUpperCase()+' · CAÍDA':c.name.toUpperCase(),fallen?'#ff4d6a':'#ffd08a',.9);nm.position.set(X,9,Z);g.add(nm);
  /* v232: anel dourado flutuante removido (era da muralha antiga de 34 m e cortava a praça) */
  if(fallen){L.inter.push({type:'rebuild',city:c,x:X,z:Z+4,r:3,label:'F · RECONSTRUIR '+c.name.toUpperCase(),use:()=>rebuildView(c)});const fog=new THREE.Mesh(new THREE.CylinderGeometry(33,33,12,32,1,true),glowS(0xff2020,.12));fog.position.set(X,6,Z);g.add(fog)}
  for(const s of SHOPS){const sx=X+s.x,sz=Z+s.z;if(E){const ry=Math.atan2(-s.x,-s.z),dim=cityDim253(...SHOPM[s.id]),front=cityFront253(sx,sz,ry,dim.d/2+.6),sn=makeCitySign(s.sign,s.sc,.8);sn.position.set(front.x,Math.min((shopH[s.id]||6)*.72,6.2),front.z);g.add(sn)}else{const sg=new THREE.Group();sg.position.set(sx,0,sz);sg.rotation.y=Math.atan2(-s.x,-s.z);
    const b=mesh(new THREE.BoxGeometry(s.w,s.h,s.d),toonS(s.col));b.position.y=s.h/2;sg.add(b);
    const r=mesh(geo('hr',()=>0),toonS(s.roof));r.scale.set(s.w*.82,1.6,s.d*.82);r.position.y=s.h+1.7;sg.add(r);
    const door=new THREE.Mesh(geo('door',()=>new THREE.PlaneGeometry(1.8,2.6)),new THREE.MeshBasicMaterial({color:0x0a0f1c}));door.position.set(0,1.3,s.d/2+.02);sg.add(door);
    const sn=makeCitySign(s.sign,s.sc,.8);sn.position.set(0,s.h+.1,s.d/2+.6);sg.add(sn);g.add(sg)}const ry=Math.atan2(-s.x,-s.z),dim=E?cityDim253(...SHOPM[s.id]):{w:s.w,d:s.d};cityCollider253(addCol,sx,sz,ry,dim);
    const front=cityFront253(sx,sz,ry,dim.d/2+1.6),vx=front.x,vz=front.z;
    addVendor(c,s.id==='arm'?'defense':s.id,s.vendor,s.sign,s.sc,vx,vz,{body:s.vb,hair:s.vh,wep:s.vw,wcol:0xffd08a,gk:{guild:'Mage',pot:'Mage',wep:'Barbarian',arm:'Knight'}[s.id],tint:{pot:0xffb0c8}[s.id]})}
  {const pond=window.Water154?Water154.mesh(2.25):new THREE.Mesh(geo('pond',()=>new THREE.CircleGeometry(2.2,24)),new THREE.MeshBasicMaterial({color:ENV.ok?0x2d7196:0x2a8ac8,transparent:true,opacity:.85}));pond.rotation.x=-Math.PI/2;pond.position.set(X-7,.05,Z-6);g.add(pond);if(!E){const rim=new THREE.Mesh(geo('prim',()=>new THREE.RingGeometry(2.2,2.6,24)),toonS(0x5a5a6a));rim.rotation.x=-Math.PI/2;rim.position.set(X-7,.06,Z-6);g.add(rim)}
    L.inter.push({type:'fish',city:c,x:X-7,z:Z-4,r:2.8,label:'F · PESCAR',use:fishView});if(!fallen){const sg217=makeCitySign('CARROÇA','#ffd9a0',.45);sg217.position.set(X+10.15,2.4,Z+18);g.add(sg217);if(window.Wagon369){Wagon369.station(g,X+8,Z+18);for(const dz of [-1.9,-.5,1,3.1])addCol({x:X+8,z:Z+18+dz,r:dz===3.1?.7:1.18})}L.inter.push({type:'travel',city:c,x:X+8,z:Z+18,r:2.6,label:'F · TEREN · CARROÇA DA ORDEM',use:travelView217})}}
  buildHouse(c,g,E,addCol);
  if(!cityFallen(c)){const lx=X-16,lz=Z-9;if(E){const lb=new EnvBatch();EW(lb,'stall-green',lx,0,lz,Math.PI/2,3.6);EW(lb,'crates_stacked',lx-1.6,0,lz+2.2,0,1.2);envOwn(g,lb.mesh(BLDMAT))}addCol({x:lx,z:lz,r:1.4});const sg=makeCitySign('LIVRARIA','#b18cff',.5);sg.position.set(lx,4,lz);g.add(sg);L.inter.push({type:'lib',city:c,x:lx+2.4,z:lz,r:2.4,label:'F · LIVRARIA',use:libView})}
  {const inn=makeCitySign('POUSADA','#ffd9a0',.5),e=c.layout253?.inn;
    const door=e?cityFront253(X+e.x,Z+e.z,e.ry,e.dim.d/2+1.3):{x:X+7,z:Z-4.6};
    inn.position.set(door.x,E?4.2:2.6,door.z);g.add(inn);if(!E){const bd=mesh(geo('bed',()=>new THREE.BoxGeometry(2.2,.5,1.2)),toonS(0x8a2b4a));bd.position.set(X+7,.25,Z-6);g.add(bd)}
    if(!E||e)L.inter.push({type:'inn',city:c,x:door.x,z:door.z,r:3.2,label:'F · POUSADA',use:()=>cityFallen(c)?toast('<b>['+c.name.toUpperCase()+']</b> A pousada está trancada enquanto a cidade estiver ocupada.',4000):innView()});}
  if(profile.retired&&profile.retired.length&&!cityFallen(c)){const ri=c.name==='Aster'?profile.retired.length-1:((c.cx*7+c.cz*13)%(profile.retired.length+2)+profile.retired.length+2)%(profile.retired.length+2);if(ri<profile.retired.length){const r=profile.retired[ri];const cc=CLASSES[r.cls];const m=makeChibi({body:cc.body,hair:cc.hair,wep:cc.wep,wcol:0xffd08a,eye:0xffd08a,gk:CLASS_GK[r.cls],tint:0xffd08a});m.mats.forEach(mt=>{mt.transparent=true;mt.opacity=.55});m.root.position.set(X,0,Z-14);scene.add(m.root);npcs.push({kind:'vendor',home:c,m,x:X,z:Z-14,face:0,r:.5,name:r.name,short:r.name,shop:'ret'+ri,t:0,col:'#ffd08a',sign:'VIDA PASSADA',label:'F · FALAR COM '+r.name.toUpperCase(),use:()=>retiredView(ri)})}}
  if(!E){const stall=mesh(geo('stall',()=>new THREE.BoxGeometry(3,1.1,1.4)),toonS(0x6b4a2a));stall.position.set(X+5,.55,Z+10.5);g.add(stall);
  const aw=mesh(geo('awn',()=>new THREE.BoxGeometry(3.4,.15,2)),toonS(0x8a2b8a));aw.position.set(X+5,2.6,Z+10.5);g.add(aw)}
  if(!fallen){
  addVendor(c,'mkt','Dorian','MERCADO','#b18cff',X+5,Z+9.6,{body:0x5a2a6a,hair:0xd0b070,wep:'none',gk:'Rogue'});
  if(!E){const st2=mesh(geo('stall',()=>0),toonS(0x3a3a4a));st2.position.set(X-5,.55,Z+10.5);g.add(st2);const aw2=mesh(geo('awn',()=>0),toonS(0xb08a2a));aw2.position.set(X-5,2.6,Z+10.5);g.add(aw2)}
  const bank=City253.bank,bankFront=E&&TripoEnvironment153.models.bankhall?cityFront253(X+bank.x,Z+bank.z,bank.ry,cityDim253(bank.key,bank.width).d/2+1.6):{x:X-5,z:Z+9.6};addVendor(c,'bank','Selene','BANCO','#ffd54f',bankFront.x,bankFront.z,{body:0x2a3a5a,hair:0xffe08a,wep:'none',gk:'Mage',tint:0xffe08a});
  for(let i=0;i<5;i++)spawnHunter(c,true);}
}
function addVendor(c,shop,name,sign,col,x,z,look){if(cityFallen(c))return;const detailed=window.Citizens133&&Citizens133.has(name),m=detailed&&Citizens133.create(name)||makeChibi(look);m.root.position.set(x,0,z);scene.add(m.root);
  const n={kind:'vendor',noLabel:true,home:c,m,x,z,face:Math.atan2(c.x-x,c.z-z),r:.5,name,short:name,shop,t:Math.random()*5,col,sign,label:'F · '+name.toUpperCase()+' — '+sign,use:()=>openShop(shop)};npcs.push(n);
  if(detailed&&!m.citizen133)Citizens133.load(name).then(ok=>{if(!ok||n.gone||!npcs.includes(n)||L.mode!=='world')return;const next=Citizens133.create(name);if(!next)return;next.root.position.copy(n.m.root.position);next.root.rotation.copy(n.m.root.rotation);scene.remove(n.m.root);n.m=next;scene.add(next.root)});
}
function buildWorld(seed){
  seed=seed??profile.seed;if(WSEED!==(seed|0))gates=[];
  worldInit(seed);clearLevel();
  L={mode:'world',group:new THREE.Group(),inter:[],spawnT:2,hunterT:6,cands:null,loadT:0};scene.add(L.group);
  scene.background=new THREE.Color(0x150a1c);scene.fog=new THREE.FogExp2(0x26122c,.014);
  hemi.color.setHex(0xbfdcff);hemi.intensity=.75;sun.color.setHex(0xc8a2ff);sun.intensity=.85;pLight.intensity=0;pLight.distance=22;
  const moon=new THREE.Mesh(geo('moon',()=>new THREE.SphereGeometry(7,20,14)),new THREE.MeshBasicMaterial({color:0xcfe4ff,fog:false}));moon.position.set(-80,70,-150);L.group.add(moon);L.moon=moon;
  updChunks(true);
  if(!gates.length)for(let i=0;i<GATE_COUNT155;i++)gates.push(newGate());
  for(const g of gates)if(!g.dead){gateMesh(g);if(g.closing131&&g.mesh?.userData.rift131)Rift131.close(g.mesh,g.storyScar131)}
  L.cands=genCands();releaseRedPortalBreaks();
}
/* v207 (Ian): cada portal nasce com um nível fixo. Rank alto acompanha mais o seu nível (★ pode passar dele); rank baixo continua fraco.
   O nível não muda depois que o portal nasce: dá para escolher qual enfrentar. */
function portalLvl207(rank){const base=GR[rank].lvl,P=run?run.level:1;if(P<=base)return Math.round(base*rnd(1,1.15));const k=(rank+1)/10;return Math.round(base+(P-base)*k*rnd(.6,1.25))}
function gateLvl207(g){if(!g)return 1;if(!g.lvl207)g.lvl207=portalLvl207(g.rank||0);return g.lvl207}
function newGate(){
  const P=player||{x:0,z:0};let x=P.x+80,z=P.z;
  // v153 (pedido do Ian): o ranque do portal é sorteado, sem depender do seu ranque nem da região.
  const pr=run?rankOf():0;let rank=0;{let r=Math.random()*GATE_RANDOM153.reduce((a,b)=>a+b,0);for(;rank<9;rank++){if(r<GATE_RANDOM153[rank])break;r-=GATE_RANDOM153[rank]}}
  // v267 (Ian): sempre há ao menos 2 portais do seu ranque (ou abaixo) abertos, para ajudar o começo.
  if(rank>pr&&gates.filter(g=>!g.dead&&g.rank<=pr).length<2)rank=Math.max(0,pr-(Math.random()<.3?1:0));
  // v267 (Ian): cada ranque acima do seu nasce mais longe das cidades (+25 m por ranque, até +100 m).
  // Fica a menos de GATE_NEAR155 do jogador, senão a reposição o ignora e cria portais sem parar.
  const far267=Math.min(100,25*Math.max(0,rank-pr));
  for(let t=0;t<80;t++){const a=rnd(0,TAU),d=Math.min(GATE_NEAR155-5,rnd(55,170)+far267);x=P.x+Math.cos(a)*d;z=P.z+Math.sin(a)*d;if(nearestCity(x,z).d<52*CITYK+far267)continue;if(gates.some(g=>!g.dead&&Math.hypot(g.x-x,g.z-z)<30))continue;if(!worldFree(x,z,3.5))continue;if(onRoad(roadSegs(x,z,1),x,z,10))continue;break}
  const set153=null;
  if(rank===9&&Math.random()<(pr>=9?.3:danger(x,z)>=9?.5:.8))rank=8;
  const life=rnd(420,900);
  return {id:++gateSeq,x,z,rank,lvl207:portalLvl207(rank),aff:rollAff(rank),double:Math.random()<(rank<=1?.03:.012),red:rank>0&&Math.random()<(rank===9&&(profile&&(profile.godCalm237||0)>gameDay198())?.02:.12),/* v237: Ato X — após vencer um Logos, ★ vermelhos ficam raros por 3 dias de jogo */life,max:life,seed:(Math.random()*2**31)|0,layout103:pick(['core','floors',null,null,null]),cleared:false,dead:false,...(set153?{set153,family124:SETS153[set153].family,biome124:SETS153[set153].biome,red:false}:{})};
}
let riftPrevious131=null,riftArrival131=0;
function riftEnter131(g){if(!started||paused||!player||player.dead||L.mode!=='world'||!g||g.dead||g.coreFailed103||!g.mesh)return false;mouseHeld=false;riftPrevious131=null;enterGate(g);return L.mode!=='world';}
function riftContact131(){
 if(!window.RIFT131_ENABLE||!player||player.dead||paused)return false;
 const now=[player.x,1.05,player.z],old=riftPrevious131||now;riftPrevious131=now;
 if(performance.now()<riftArrival131||Math.hypot(now[0]-old[0],now[2]-old[2])>8)return false;
 const entries=L.mode==='world'?gates.filter(g=>!g.dead&&!g.closing131&&!g.coreFailed103&&g.mesh?.userData.rift131).map(g=>({root:g.mesh,g,x:g.x,z:g.z})):L.mode==='dungeon'?(L.exits||[]).filter(it=>it.type==='exit'&&it.grp?.userData.rift131).map(it=>({root:it.grp,it,x:it.x,z:it.z})):[];
 for(const e of entries){
  const maxDist=(e.g?.giant?14:7);
  const d=Math.hypot(e.x-player.x,e.z-player.z);
  if(d>maxDist)continue;
  e.root.updateMatrixWorld(true);
  const a=e.root.worldToLocal(new THREE.Vector3(...old)),b=e.root.worldToLocal(new THREE.Vector3(...now));
  const sc=e.root.scale?.x||1;
  const directTouch=d<(e.g?.giant?3.8:1.8);
  if(!directTouch&&!Rift131.crosses(a.toArray(),b.toArray(),0.35*sc))continue;
  if(e.g)return riftEnter131(e.g);
  const before=L;if(!e.it.locked||performance.now()>(e.it.riftNotice131||0)){e.it.riftNotice131=performance.now()+2500;tryExit(e.it);}return L!==before;
 }
 return false;
}
function riftExitVisual131(it){
 if(!it.grp?.userData.rift131||it.riftLocked131===it.locked)return;
 it.riftLocked131=it.locked;Rift131.setPalette(it.grp,{red:it.locked,exit:!it.locked,secret:!it.locked});
 if(it.sg){it.grp.remove(it.sg);it.sg.material.map.dispose();it.sg.material.dispose();}
 it.sg=Rift131.label({exit:true,locked:it.locked},L.G?.id||GR[L.gate?.rank||0].id);it.grp.add(it.sg);
}

function gateMesh(g){retireExtraction117(g);
  // Approved rift: walking through the membrane enters the dungeon.
  if(window.RIFT131_ENABLE&&window.Rift131){
    const grp=Rift131.create({...g,legacyLinearOutput:true});grp.position.set(g.x,0,g.z);
    grp.add(Rift131.label(g,g.anchor221?'Nv ???':GR[g.rank].id+' · Nv '+gateLvl207(g)));
    /* v480 (Ian): feixe vertical de luz fica APENAS dentro da masmorra no portal de saida */
    L.group.add(grp);g.mesh=grp;g.ring=new THREE.Group();g.sw=new THREE.Group();if(!g.opened233&&grp.userData.rift131&&player&&Math.hypot(g.x-player.x,g.z-player.z)<160){g.opened233=true;Rift131.open(grp)}/* v233 (Ian): todo portal abre rasgando como no Tecelão */
    const rPrompt=(g.giant?8.5:4.5);
    const lbl=g.anchor221?'F · ENTRAR NA FENDA DA ÂNCORA':(g.secret?'F · ENTRAR NO PORTAL ???':'F · ENTRAR NO PORTAL '+(GR[g.rank]?.id||''));
    L.inter.push({type:'gate',g,x:g.x,z:g.z,r:rPrompt,label:lbl,use:()=>enterGate(g)});
    return;
  }
  const col=g.secret?0xffd070:g.red?0xff2030:new THREE.Color(RANKS[g.rank].c).getHex();
  const grp=new THREE.Group();grp.position.set(g.x,0,g.z);
  const ring=new THREE.Mesh(geo('gring',()=>new THREE.TorusGeometry(2.3,.22,8,40)),glowS(col,1));ring.position.y=2.6;grp.add(ring);
  const disc=new THREE.Mesh(geo('gdisc',()=>new THREE.CircleGeometry(2.15,40)),new THREE.MeshBasicMaterial({color:g.secret?0x000000:g.red?0x2a0008:0x0a0a2a,side:THREE.DoubleSide}));disc.position.y=2.6;grp.add(disc);
  const sw=new THREE.Mesh(geo('gsw',()=>new THREE.RingGeometry(.3,2,24,1,0,4.5)),glowS(col,.5));sw.position.set(0,2.6,.03);grp.add(sw);
  const base=new THREE.Mesh(geo('gbase',()=>new THREE.RingGeometry(2.6,3,32)),glowS(col,.5));base.rotation.x=-Math.PI/2;base.position.y=.05;grp.add(base);
  const lbl=makeSign(g.secret?'???':g.inverse?'INVERTIDO':g.time?'PASSADO':g.custom?'CRIADO · '+gid(g.rank):'RANK '+GR[g.rank].id+(g.red?' · VERMELHO':''),hex(col),.6);lbl.position.y=5.7;grp.add(lbl);
  L.group.add(grp);g.mesh=grp;g.ring=ring;g.sw=sw;
  L.inter.push({type:'gate',g,x:g.x,z:g.z,r:3.6,label:g.secret?'F · PORTAL ???':'F · PORTAL RANK '+GR[g.rank].id,use:()=>gateModal(g)});
}
function removeGateMesh(g){if(g.mesh){if(g.mesh.userData.rift131){Rift131.dispose(g.mesh);envDispose(g.mesh)}L.group.remove(g.mesh);g.mesh=null}L.inter=L.inter.filter(i=>i.g!==g)}
const GATE_COUNT155=12,GATE_NEAR155=200,GATE_FAR155=280;
function tickGates(dt){
  const P=player;
  const closingDone=[];for(const g of gates){if(g.dead||g===curGate)continue;if(g.closing131){if(g.mesh?.userData.rift131?.closing>2.15)closingDone.push(g);continue;}g.life-=Math.max(dt,dt>0?(window.WDT196||dt):0);
    // v155 (Ian): portal longe não some; só deixa de ser desenhado. Voltando antes do tempo acabar, ele continua lá.
    const far=L.mode==='world'&&P&&Math.hypot(g.x-P.x,g.z-P.z)>GATE_FAR155;
    if(L.mode==='world'&&g.life>0){if(far&&g.mesh)removeGateMesh(g);else if(!far&&!g.mesh)gateMesh(g)}
    if(g.life<=0){g.dead=true;if(L.mode==='world'){if(!far&&g.mesh?.userData.rift131){g.closing131=true;g.dead=false;Rift131.close(g.mesh)}else removeGateMesh(g);if(!g.cleared&&!g.secret&&g.rank>=2)dungeonBreak(g)}}}
  for(const g of closingDone){removeGateMesh(g);gates=gates.filter(x=>x!==g)}
  gates=gates.filter(g=>!g.dead||g===curGate);
  // v155 (Ian): portais espalhados pelo mundo todo. Conta só os que estão por perto; os que ficaram para trás somem e novos nascem à volta (inclusive à frente), então andar reto sempre encontra portal.
  const PP=P||{x:0,z:0};let alive=gates.filter(g=>!g.dead&&Math.hypot(g.x-PP.x,g.z-PP.z)<GATE_NEAR155).length,tries=0;
  while(alive<GATE_COUNT155&&tries++<GATE_COUNT155){const ng=newGate();gates.push(ng);if(L.mode==='world')gateMesh(ng);alive++}
}
function dungeonBreak(g,opts={}){ECON[g.rank]=Math.min(1.8,ECON[g.rank]*1.25);
  // v155 (Ian): monstros e o chefe saem do portal. Se houver vila a até 100 m, marcham para atacá-la; senão vagueiam pelo mapa.
  const near=nearestCity(g.x,g.z),wall=36*CITYK,city=near.c&&near.d-wall<=100&&!cityFallen(near.c)&&near.c.name!=='Aster'?near.c:null;
  const raid={city:city?city.id:null,cx:city?city.x:g.x,cz:city?city.z:g.z};const out=[];
  const n=opts.bossOnly?0:4+g.rank;for(let i=0;i<n;i++){const e=spawnKind(wpick(dungeonPool124(g)).k,g.x+rnd(-4,4),g.z+rnd(-4,4),g.rank,{wild:true,breaker:true});dunScale(e,g.rank,gateLvl207(g));threatApply184(e,threatRoll184(g.rank,false));e.gold*=2;/* v208: monstros do rompimento têm o nível do portal */out.push(e)}
  {BREAKG184=g;const prev=bossE,b=spawnBoss(g.x+rnd(-2,2),g.z+rnd(-2,2),g.rank,dungeonBoss124(g));dunScale(b,g.rank,gateLvl207(g));bossE=prev;b.wild=true;b.breaker=true;b.gold*=2;out.push(b);BREAKG184=null}
  for(const e of out){e.raid155={...raid,tx:raid.cx,tz:raid.cz}}
  const dist=player?Math.round(Math.hypot(g.x-player.x,g.z-player.z)):0;
  const near215=dist<RAIDNEAR215,say215=near215?toast:(h=>logNews(h));
  if(city){const R=RAID155[city.id]||(RAID155[city.id]={hp:100,warned:false});R.hp=Math.min(R.hp,100);
    say215('<b>[NARRADOR]</b> TRANSBORDO DA FENDA: '+(opts.bossOnly?'o guardião escapou':'monstros e o guardião saíram')+' de um portal rank '+GR[g.rank].id+' e marcham para <b>'+city.name+'</b> ('+dist+' m de você). Defenda a cidade!',7000);if(near215)bigText('ATAQUE A '+city.name.toUpperCase(),1600)}
  else{say215('<b>[NARRADOR]</b> TRANSBORDO DA FENDA: '+(opts.bossOnly?'o guardião escapou':'monstros e o guardião saíram')+' de um portal rank '+GR[g.rank].id+' a '+dist+' m e vagueiam pelo mapa.',5000);if(near215)bigText('QUEBRA',1100)}
  return out;
}
/* v155: ataque da Fenda a uma vila. Monstros dentro da muralha derrubam a defesa da cidade; em 0 ela cai (mesma reconstrução da queda sazonal). */
const RAID155={};
function raidMove155(e,dt,near){const R=e.raid155;if(R.city&&player&&Math.hypot(player.x-R.cx,player.z-R.cz)>RAIDNEAR215)return 0;let dx=R.tx-e.x,dz=R.tz-e.z,d=Math.hypot(dx,dz);
  if(d<(R.city?(R.building348?2.2:6)+(e.r||.5):2)){if(R.city){e.raidAttack348=time+.6;if(time>=(e.raidHit348||0)){e.raidHit348=time+1.5;fxBurst(R.tx,1,R.tz,0xbda18a,5,2)}if(!R.building348){const target=SHOPS[Math.floor(Math.random()*SHOPS.length)],ry=Math.atan2(-target.x,-target.z),dim=window.City253&&ENV.ok?cityDim253(...SHOPM[target.id]):{d:target.d},front=cityFront253(R.cx+target.x,R.cz+target.z,ry,dim.d/2+2);R.tx=front.x;R.tz=front.z;R.building348=true}}else{R.tx=e.x+rnd(-40,40);R.tz=e.z+rnd(-40,40)}return 0}
  const sp=e.speed*(R.city?.75:.4)*dt;if(near)moveEnt(e,dx/d*sp,dz/d*sp);else{e.x+=dx/d*sp;e.z+=dz/d*sp}e.face=Math.atan2(dx,dz);e.m.root.position.set(e.x,0,e.z);e.m.root.rotation.y=e.face;return 1}
/* v215 (Ian): ataque só anda, avisa e derruba cidade se você estiver perto dela (até 500 m). Cidade longe não pune. */
const RAIDNEAR215=500;/* v216 (Ian): longe, o ataque continua simulado (mais devagar, sem aviso na tela); a cidade pode cair e você reconstrói quando passar lá. */
function updRaids155(dt){if(L.mode!=='world'||profile?.classless)return;const per={};
  for(const e of enemies){if(e.dead||e.gone||!e.raid155?.city)continue;const R=e.raid155,c={x:R.cx,z:R.cz};if(Math.hypot(player.x-c.x,player.z-c.z)>RAIDNEAR215){per[R.city]=(per[R.city]||0)+(e.isBoss?.12:.03);continue}if(Math.hypot(e.x-c.x,e.z-c.z)<36*CITYK)per[R.city]=(per[R.city]||0)+(e.isBoss?.6:.15)}
  for(const id in RAID155){const R=RAID155[id],c=citiesAround(player.x,player.z,6000).find(c=>c.id===id)||null,far216=!c||Math.hypot(c.x-player.x,c.z-player.z)>RAIDNEAR215;const alive=enemies.some(e=>!e.dead&&!e.gone&&e.raid155?.city===id);
    if(c&&c.name==='Aster'){for(const e of enemies)if(e.raid155?.city===id){e.raid155.city=null;e.raid155.tx=e.x;e.raid155.tz=e.z}delete RAID155[id];continue}/* v435: Aster não sofre ataque de monstros (só do Arquiteto) */
    if(!alive){delete RAID155[id];if(c&&!cityFallen(c)&&Math.hypot(c.x-player.x,c.z-player.z)<RAIDNEAR215){toast('<b>[CIDADE]</b> O ataque a '+c.name+' acabou. A cidade resistiu'+(R.hp<100?' com '+Math.round(R.hp)+'% da defesa':'')+'.',5000)}continue}
    if(per[id]){R.hp-=per[id]*dt;if(!R.warned&&R.hp<100&&!far216){R.warned=true;toast('<b>[CIDADE]</b> Monstros dentro das muralhas'+(c?' de '+c.name:'')+'! Defesa caindo.',4000)}}
    if(R.hp<=0&&c){profile.raided155=profile.raided155||{};profile.raided155[id]=1;if(profile.rebuilt)delete profile.rebuilt[id];store.set('pds2_profile',profile);delete RAID155[id];
      for(const e of enemies)if(e.raid155?.city===id){e.raid155.city=null;e.raid155.tx=e.x;e.raid155.tz=e.z}
      const ch=chunks.get(c.cx+','+c.cz);if(ch){unloadChunk(ch);loadChunk(c.cx,c.cz)}if(far216){logNews('<b>[NARRADOR]</b> '+c.name+' caiu para os monstros da Fenda enquanto você estava longe. Passe lá para expulsá-los e reconstruir.');for(const e of enemies)if(e.raid155&&e.raid155.city===null&&Math.hypot(e.x-c.x,e.z-c.z)<200){e.raid155.tx=c.x+rnd(-20,20);e.raid155.tz=c.z+rnd(-20,20);e.x=e.raid155.tx;e.z=e.raid155.tz;if(e.m)e.m.root.position.set(e.x,0,e.z)}}else{bigText(c.name.toUpperCase()+' CAIU',1800);sfx('gong');toast('<b>[NARRADOR]</b> '+c.name+' caiu para os monstros da Fenda. Expulse-os e reconstrua a cidade.',7000)}}}
}
function raidHud155(){const P=player;if(!P||L.mode!=='world')return '';let best=null;for(const id in RAID155){const c=citiesAround(P.x,P.z,400).find(c=>c.id===id);if(c){const d=Math.hypot(c.x-P.x,c.z-P.z);if(!best||d<best.d)best={c,d,R:RAID155[id]}}}return best?' · '+best.c.name.toUpperCase()+' SOB ATAQUE: DEFESA '+Math.max(0,Math.round(best.R.hp))+'%':''}
function failRedPortalOnDeath(){
 if(L.mode!=='dungeon')return false;const g=L.special?L.gate?.ref:L.gate;
 if(!g||!g.red||g.id<0||g.inv343)return false;
 L.failed103=true;g.dead=true;g.cleared=false;
 if(g.deathBreak103)return true;g.deathBreak103=true;
 const pending=profile.pendingRedBreaks103||(profile.pendingRedBreaks103=[]),key=[g.id,g.seed,g.x,g.z].join(':');
 if(!pending.some(p=>p.key===key))pending.push({key,x:g.x,z:g.z,rank:g.rank,seed:g.seed,biome124:g.biome124,family124:g.family124});
 store.set('pds2_profile',profile);return true;
}
function releaseRedPortalBreaks(){
 if(L.mode!=='world')return;const pending=profile.pendingRedBreaks103;
 if(!Array.isArray(pending)||!pending.length)return;
 profile.pendingRedBreaks103=[];store.set('pds2_profile',profile);
 for(const g of pending)if(Number.isFinite(g.x)&&Number.isFinite(g.z)&&Number.isInteger(g.rank)&&g.rank>=0&&g.rank<GR.length)dungeonBreak(g,{bossOnly:true});
}

function genCands(){const pr=Math.min(9,run?rankOf():0);const out=[];for(let i=0;i<3;i++){const rank=clamp(pr+Math.floor(rnd(-1,2)),0,TOPR);const lvl=Math.max(1,(run?run.level:1)+Math.floor(rnd(-3,5)));out.push({name:pick(NAMES),cls:Math.floor(Math.random()*7),rank,lvl,hair:pick([0x222222,0xc85a1e,0xe8e8ff,0x6b4a2a,0x3a5fd0]),cost:Math.round(HIRE[rank]*(1+lvl*.03))})}return out}
function spawnHunter(c,inside){
  const cl=/* v337: sem o Mago Elemental (classe extinta) */CLASSES.filter((c,i)=>i<7&&!c.legacy)[Math.floor(Math.random()*6)],ri=wpick([40,30,16,8,4,1.5,.4,.1].map((w,i)=>({i,w}))).i;
  const m=makeChibi({body:cl.body,hair:pick([0x222222,0xc85a1e,0xe8e8ff,0x6b4a2a,0x3a5fd0]),wep:cl.wep,wcol:cl.sk[0].col,gk:CLASS_GK[CLASSES.indexOf(cl)],tint:CLASS_TINT[CLASSES.indexOf(cl)],shield:CLASSES.indexOf(cl)===0});
  let x,z;if(inside){const a=rnd(0,TAU),d=rnd(4,16);x=c.x+Math.cos(a)*d;z=c.z+Math.sin(a)*d}else{const a=pick([0,Math.PI/2,Math.PI,Math.PI*1.5]);x=c.x+Math.cos(a)*40;z=c.z+Math.sin(a)*40}
  m.root.position.set(x,0,z);scene.add(m.root);const nm=pick(NAMES);
  const n={kind:'hunter',home:c,m,x,z,face:0,r:.5,name:nm+' ['+RANKS[ri].id+']',short:nm,rank:ri,col:RANKS[ri].c,t:Math.random()*9,tx:x,tz:z,wait:rnd(0,3),path:[],label:'F · FALAR COM '+nm.toUpperCase()};
  n.use=()=>talk(n);npcs.push(n);Hunters138.attach(n,CLASSES.indexOf(cl),ri,()=>npcs.includes(n)&&L.mode==='world');return n;
}
/* v153 (pedido do Ian): conversa com pessoas aparece num balão sobre quem fala, não no histórico do narrador. */
const SPEECH153=new Map();
function speech153(n,line,sub){if(!n||typeof document==='undefined')return;
  let b=SPEECH153.get(n);if(b){b.el.remove();cancelAnimationFrame(b.raf)}
  const el=document.createElement('div');el.className='speech153';el.innerHTML='<b>'+(n.short||n.name||'')+'</b>'+line+(sub?'<small>'+sub+'</small>':'');document.body.appendChild(el);
  b={el,until:performance.now()+Math.min(9000,3200+line.length*45),raf:0};SPEECH153.set(n,b);const v=new THREE.Vector3();
  const tick=()=>{const P=player,far=!P||Math.hypot(P.x-n.x,P.z-n.z)>14;if(performance.now()>b.until||far||n.gone||!started){el.classList.add('out');setTimeout(()=>el.remove(),260);SPEECH153.delete(n);return}
    const h=(n.m&&n.m.root?n.m.root.position.y:0)+2.55+terrH(n.x,n.z);v.set(n.x,h,n.z).project(camera);const r=renderer.domElement.getBoundingClientRect();
    el.style.display=v.z<1&&!modalOpen?'':'none';el.style.left=(r.left+(v.x*.5+.5)*r.width)+'px';el.style.top=(r.top+(-v.y*.5+.5)*r.height)+'px';b.raf=requestAnimationFrame(tick)};tick()}
function talk(n){speech153(n,regionLine116(n.home)||pick(HLINES),'Caçador de '+n.home.name)}

