/* ================= BLOCO B: ECONOMIA, CARAVANAS, CHEFES ERRANTES, RUÍNAS ================= */
const ECON=[1,1,1,1,1,1,1,1,1,1];let econT=45;
function updEcon(dt){econT-=dt;if(econT>0)return;econT=45;for(let i=0;i<10;i++)ECON[i]=clamp(ECON[i]*rnd(.9,1.12)+(1-ECON[i])*.05,.6,1.8)}
const sellP=(k,r)=>window.Econ154?Econ154.resourceSalePrice(k,r):Math.round((k==='core'?CORE_P:CRY_P)[r]*ECON[r]*(1+.03*affL('Dorian')));
const arrow=r=>ECON[r]>1.05?'<span style="color:#6fe39a">▲'+Math.round((ECON[r]-1)*100)+'%</span>':ECON[r]<.95?'<span style="color:#ff8fa3">▼'+Math.round((1-ECON[r])*100)+'%</span>':'estável';
function startCaravan(){const P=player,here=nearestCity(P.x,P.z).c;const dests=citiesAround(P.x,P.z,900).filter(c=>c!==here&&!cityFallen(c)).sort((a,b)=>Math.hypot(a.x-P.x,a.z-P.z)-Math.hypot(b.x-P.x,b.z-P.z));
  if(!dests.length){toast('Nenhuma cidade por perto.');return}const d=dests[0],dist=Math.hypot(d.x-P.x,d.z-P.z);
  const m=makeChibi({body:0x7a5a2a,skin:0xffd8b8,hair:0x3b2a20,wep:'none',scale:1.1});const cart=mesh(geo('cart',()=>new THREE.BoxGeometry(1.6,1,2.2)),toonS(0x6b4a2a));cart.position.set(0,.9,-1.6);m.root.add(cart);m.root.position.set(P.x,0,P.z+3);scene.add(m.root);
  const mh=500*RANKS[rankOf()].mult*(1+run.level*.05);const a={m,mats:m.mats,x:P.x,z:P.z+3,face:0,name:'Caravana para '+d.name,short:'Caravana',hp:mh,maxhp:mh,dmg:0,speed:3,range:0,r:.9,cd:0,act:null,stun:0,team:'ally',caravan:true,dest:d,reward:Math.round(Math.min(200,dist*.08)*GR[Math.min(9,rankOf())].gold),life:1e9,t:0,kb:{x:0,z:0},flash:0,slow:0};
  allies.push(a);L.car=a;L.carT=15;toast('<b>[CARAVANA]</b> Escolte até '+d.name+' ('+Math.round(dist)+'m). Recompensa: '+fmt(a.reward)+' ouro.',5000)}
function caravanUpd(a,dt){a.t+=dt;if(a.flash>0){a.flash-=dt;flashMats(a.m,a.flash>0?1:0,0x550000)}const d=a.dest,dx=d.x-a.x,dz=d.z-a.z,dd=Math.hypot(dx,dz);let mv=0;
  const danger=enemies.some(e=>!e.dead&&Math.hypot(e.x-a.x,e.z-a.z)<7);const far=Math.hypot(player.x-a.x,player.z-a.z)>22;
  if(dd<30){a.dead=true;scene.remove(a.m.root);L.car=null;run.gold+=a.reward;bigText('CARAVANA ENTREGUE',1400);sfx('coin');toast('<b>[CARAVANA]</b> Chegamos a '+d.name+'. +'+fmt(a.reward)+' ouro.',5000);return}
  if(!danger&&!far){a.face=Math.atan2(dx,dz);moveEnt(a,dx/dd*a.speed*dt,dz/dd*a.speed*dt);mv=1}
  animChibi(a.m,{move:mv,atk:0,dead:0,wind:0},a.t);a.m.root.position.set(a.x,0,a.z);a.m.root.rotation.y=a.face}
const WBOSS={n:'Dragão Errante',types:['fury','soulrain'],body:0x8a1a1a,scale:3.2,skill:S('Sopro do Dragão','rain',10,35,3,0xff5a1e)};
function spawnWorldBoss(){const P=player,a=rnd(0,TAU),x=P.x+Math.cos(a)*70,z=P.z+Math.sin(a)*70;const b=spawnBoss(x,z,clamp(rankOf()+1,0,9),WBOSS);b.wild=true;b.breaker=true;b.world=true;b.hp*=4;b.maxhp*=4;b.gold*=5;b.roam={x,z};
  if(window.Anim547&&Anim547.createDragonWings){b.drakeWings547=Anim547.createDragonWings(b.m.body,0x8a1a1a);if(b.drake510)b.drake510.proceduralWings=b.drakeWings547;}else{for(const s of[-1,1]){const w=new THREE.Mesh(geo('wing',()=>new THREE.PlaneGeometry(2.2,1.2)),new THREE.MeshBasicMaterial({color:0x5a0a0a,side:THREE.DoubleSide}));w.position.set(s*1.3,1.3,-.3);w.rotation.set(0,s*.5,s*.4);b.m.body.add(w)}}
  toast('<b>[MUNDO]</b> Um DRAGÃO ERRANTE sobrevoa a região. Ele aparece no mapa.',6000);bigText('DRAGÃO ERRANTE',1300)}
function worldBossDeath(b){if(b.siege){siegeWin(b);storyEv('siege')}hitstop(.25);shake(.8);sfx('boom');sfx('gong');$('boss').hidden=true;profile.bossKills=(profile.bossKills||0)+1;addChest(b.x,b.z+3,b.gr,true);toast('<b>[MUNDO]</b> O Dragão Errante caiu. Pegue o tesouro dele.',5000)}
/* v217 (Ian): mundo em camadas. Cidades a ~1,9 km; capitais a cada 5×5 regiões (~9,6 km);
   postos de estrada (fogueira para descansar e mascate) a cada poucas centenas de metros nas estradas; Carroça da Ordem entre cidades visitadas. */
/* v239 (Ian): água no mundo. Lagos espalhados (pesca, não dá para andar por cima) e rios serpenteando entre as regiões,
   com ponte onde a estrada cruza. Longe das cidades; nada de árvore ou pedra dentro da água. */
const RIVW239=11;
function riverX239(z){const k=Math.round((0)/1);return 0}
function riverAt239(x){const P=REG*CH*2,b=Math.floor((x-REG*CH*.5)/P);return b}
/* v661 (Ian): todo rio de Primeva nasce do Mar de Thalor — a água sobe pela magia antiga dos afogados, corre por dentro da serra
   e despenca nas cachoeiras (tools/cachoeiras661.js). Cada rio começa no poço da cachoeira (z0); ao norte dele não há rio.
   O rio oeste (b=-1) faz uma curva até o pé da serra perto de Thalor. RIO_SRC661 fica em tools/terrain245.js (carrega antes). */
function riverBase239(b,z){const P=REG*CH*2;return (b*P)+REG*CH*.5+Math.sin(z*.0043+b*1.7)*95+Math.sin(z*.011+b)*28+Math.sin(z*.035+b*2.3)*18+Math.sin(z*.079+b*3.1)*5}
function riverCenter239(b,z){const c=riverBase239(b,z),S=RIO_SRC661[b];if(!S||S.x0==null)return c;let t=Math.min(1,Math.max(0,(z-S.z0)/S.L));t=t*t*(3-2*t);return c+(S.x0-riverBase239(b,S.z0))*(1-t)}
function riverSource661(b){const S=RIO_SRC661[b];return S?{x:S.x0==null?riverBase239(b,S.z0):S.x0,z:S.z0,r:S.R}:null}
function riverWidth351(b,z){return RIVW239*(1+.22*Math.sin(z*.047+b*1.3)+.12*Math.sin(z*.113+b*2.7))}
function riverNear239(x,z){const P=REG*CH*2,b=Math.round((x-REG*CH*.5)/P);const cxr=riverCenter239(b,z),S=RIO_SRC661[b];if(S&&z<S.z0+6)return {b,x:cxr,d:1e9,src:1};return {b,x:cxr,d:Math.abs(x-cxr)}}
function lakeAt239(cx,cz){if(rh(cx,cz,21)%100>=4)return null;const x=cx*CH+(rh(cx,cz,22)%20-10),z=cz*CH+(rh(cx,cz,23)%20-10),r=12+rh(cx,cz,24)%12;
 if(nearestCity(x,z).d<260||onRoad(roadSegs(x,z,1),x,z,r+8)||riverNear239(x,z).d<r+30)return null;const bio=biomeAt(x,z);if(bio==='deserto'||bio==='vulcao')return null;return {x,z,r}}
function waterMat239(){if(CRY230.wr)return CRY230.wr;const t=Water154.mesh(1);const m=t.material;CRY230.wr=m;return m}
function buildWater239(ch,g,addCol){if(!window.Water154)return;const x0=ch.cx*CH,z0=ch.cz*CH;
 const lk=lakeAt239(ch.cx,ch.cz);if(lk){const fz=['neve','cristal'].includes(biomeAt(lk.x,lk.z));let w;if(fz){const cg=new THREE.CircleGeometry(lk.r,40);cg.setAttribute('aFD',new THREE.Float32BufferAttribute(new Float32Array(cg.attributes.position.count*2).map((v,i)=>i%2?0:1),2));const mt=riverMat240();w=new THREE.Mesh(cg,mt);w.onBeforeRender=()=>{mt.uniforms.uTime.value=performance.now()/1000}}else w=Water154.mesh(lk.r);w.rotation.x=-Math.PI/2;w.position.set(lk.x,.06,lk.z);w.userData.terrainRoot245=true;g.add(w);
  /* v391: o centro do lago agora é uma bacia de 2,5 m (terrain245); a água sobe junto enquanto a bacia está ativa. v395: sobe o quanto a bacia realmente afunda (estrada perto deixa mais rasa), para bater com o nado. */{const ob=w.onBeforeRender,T=window.TER245;w.onBeforeRender=function(...a){const on=!!T&&T.D.value.some(v=>v.w<0&&Math.abs(v.x-lk.x)<.01&&Math.abs(v.y-lk.z)<.01),y=.06+(on?(lk.lift395??=Math.max(0,terrH(lk.x+lk.r,lk.z)-terrH(lk.x,lk.z))):0);if(w.position.y!==y){w.position.y=y;w.updateMatrixWorld()}if(ob)ob.apply(this,a)}}
  const bank=new THREE.Mesh(new THREE.RingGeometry(lk.r-.2,lk.r+1.6,40),toonS(0x5b4a33));bank.rotation.x=-Math.PI/2;bank.position.set(lk.x,.04,lk.z);bank.userData.terrainRoot245=true;g.add(bank);{const T=window.TER245;bank.onBeforeRender=function(){const on=!!T&&T.D.value.some(v=>v.w<0&&Math.abs(v.x-lk.x)<.01&&Math.abs(v.y-lk.z)<.01),y=.04+(on?(lk.lift395??=Math.max(0,terrH(lk.x+lk.r,lk.z)-terrH(lk.x,lk.z))):0);if(bank.position.y!==y){bank.position.y=y;bank.updateMatrixWorld()}}}
  /* v391 (Ian): dá para nadar no lago; monstros continuam fora (tools/water391.js) */L.inter.push({type:'fish',chunk:ch,x:lk.x+lk.r+.8,z:lk.z,r:2.6,label:'F · PESCAR',use:fishView})}
 let rv=riverNear239(x0,z0);if(rv.src)rv=riverNear239(x0,z0+CH/2-1);/* v661: pedaço do poço da nascente */if(rv.d>CH)return;if(nearestCity(x0,z0).d<220)return;
 /* v240 (Ian): neve/cristal = gelo (dá para andar); deserto/vulcão = seco; estrada passa por cima do rio (mureta de pedra), água some sob a estrada. */
 const RS=roadSegs(x0,z0,1),cross=[];for(const [x1,z1,x2,z2] of RS){/* v513: estradas curvas — cruza onde a estrada troca de lado do rio */const f1=x1-riverCenter239(rv.b,z1),f2=x2-riverCenter239(rv.b,z2);if(f1*f2>0||f1===f2)continue;const t=f1/(f1-f2),cz=z1+(z2-z1)*t;if(Math.abs(cz-z0)>CH/2+6)continue;cross.push({x:riverCenter239(rv.b,cz),z:cz})}
 const fd=(x,z)=>{const b=snowB(x,z);return [1-Math.min(1,Math.max(0,(b-.25)/.08)),Math.min(1,Math.max(0,(b-.66)/.06))]},kind=(x,z)=>{const [f,d]=fd(x,z);return d>.95?0:f>.5?2:1};
 const N=24,pts=[],SRC661=RIO_SRC661[rv.b];for(let i=0;i<=N;i++){const z=z0-CH/2+i*CH/N;if(SRC661&&z<SRC661.z0)continue;const x=riverCenter239(rv.b,z),[f,d]=fd(x,z);pts.push({x,z,f,d,road:cross.some(c=>Math.abs(c.z-z)<5),k:kind(x,z)})}
 {let seg=[];const flushS=()=>{if(seg.length<2){seg=[];return}const pos=[],uv=[],fdA=[],idx=[];seg.forEach((p,i)=>{pos.push(p.x-riverWidth351(rv.b,p.z)/2,.06,p.z,p.x+riverWidth351(rv.b,p.z)/2,.06,p.z);uv.push(0,.5,1,.5);fdA.push(p.f,p.d,p.f,p.d);if(i){const a=(i-1)*2;idx.push(a,a+2,a+1,a+1,a+2,a+3)}});
  const gm=new THREE.BufferGeometry();gm.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));gm.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));gm.setAttribute('aFD',new THREE.Float32BufferAttribute(fdA,2));gm.setAttribute('terrainAnchor245',new THREE.Float32BufferAttribute(pos.flatMap((v,i)=>i%3===1?[]:[v]),2));gm.setIndex(idx);gm.computeVertexNormals();
  const mt=riverMat240(),m=new THREE.Mesh(gm,mt);m.onBeforeRender=()=>{mt.uniforms.uTime.value=performance.now()/1000};g.add(m);seg=[]};
  for(const p of pts){if(p.road){flushS();continue}seg.push(p)}flushS()}
 for(const c of cross){if(!kind(c.x,c.z))continue;const wall=toonS(0x7d776c);for(const sz of [-4.6,4.6]){const pr=mesh(geo('par240',()=>new THREE.BoxGeometry(riverWidth351(rv.b,c.z)+4,.9,.6)),wall);pr.position.set(c.x,.45,c.z+sz);g.add(pr)}}
 /* v391 (Ian): sem parede invisível no rio — o herói atravessa nadando; monstros continuam fora (tools/water391.js) */}
/* v241 (Ian): rio congela aos poucos ao entrar na neve e degela ao sair; seca perto do deserto/vulcão. Gelo com geada, rachaduras e brilho; no gelo o herói desliza. */
function riverMat240(){if(CRY230.rv)return CRY230.rv;const base=Water154.mesh(1).material;const m=base.clone();m.uniforms={uTime:{value:0},uNight:base.uniforms.uNight,uRise:base.uniforms.uRise,uFlood:base.uniforms.uFlood};
 m.vertexShader=base.vertexShader.replace('varying vec2 vUv;','attribute vec2 aFD;varying vec2 vFD;varying vec2 vUv;').replace('vUv=uv;','vUv=uv;vFD=aFD;');
 m.fragmentShader=base.fragmentShader.replace('vec2 p=vW.xz;','vec2 p=vW.xz-vec2(0.,t*(1.5+uFlood*1.5));').replace('varying vec2 vUv;','varying vec2 vFD;varying vec2 vUv;').replace('col*=mix(1.,.38,uNight);',`
  /* v391: profundidade — meio escuro, margem rasa e transparente */col=mix(col,vec3(.02,.08,.12),smoothstep(.55,.0,r)*.55);
  float fz=vFD.x;vec3 ice=vec3(.62,.80,.93);float fr=n(p*1.2)*.55+n(p*5.)*.3;ice=mix(ice,vec3(.95,.98,1.),fr*.55+smoothstep(.75,1.,r)*.45);
  float cr=abs(n(p*.7+7.)-.5);float cr2=abs(n(p*1.9+3.)-.5);ice=mix(ice,vec3(.30,.48,.62),max(smoothstep(.025,.0,cr),smoothstep(.015,.0,cr2)*.7)*.85);
  vec3 Li=normalize(vec3(-.4,.8,.45));ice+=pow(max(0.,dot(reflect(-Li,vec3(0.,1.,0.)),normalize(vec3(.1,.85,.5)))),20.)*.25+pow(n(p*24.+floor(t*1.5)),30.)*1.6;
  col=mix(col,ice,smoothstep(.2,.8,fz));
  col*=mix(1.,.38,uNight);`).replace('gl_FragColor=vec4(col,a);','a=mix(.5,.95,smoothstep(.95,.35,r));a=mix(a,.98,smoothstep(.2,.8,fz))*(1.-vFD.y);gl_FragColor=vec4(col,a);');
 return CRY230.rv=m}
function onIce240(P){if(L.mode!=='world')return false;const rv=riverNear239(P.x,P.z);if(rv.d<riverWidth351(rv.b,P.z)/2+.5&&snowB(P.x,P.z)<.29)return true;const lk=lakeAt239(Math.round(P.x/CH),Math.round(P.z/CH));return !!(lk&&['neve','cristal'].includes(biomeAt(lk.x,lk.z))&&Math.hypot(P.x-lk.x,P.z-lk.z)<lk.r)}
function iceMove240(P,vx,vz,dt){const on=onIce240(P);P.iv240=P.iv240||{x:0,z:0};if(!on){P.iv240.x=P.iv240.z=0;return false}
 const k=Math.min(1,dt*(vx||vz?1.4:.35));P.iv240.x+=(vx-P.iv240.x)*k;P.iv240.z+=(vz-P.iv240.z)*k;if(Math.hypot(P.iv240.x,P.iv240.z)<.05)return true;moveEnt(P,P.iv240.x*dt,P.iv240.z*dt);if(!P.iceTip240){P.iceTip240=1;toast('<b>[NARRADOR]</b> Gelo. Cuidado: aqui você desliza.',3500)}return true}
function riverClear239(x,z){const rv=riverNear239(x,z);return rv.d<riverWidth351(rv.b,z)/2+3}
const OUTPOST361={seed:null,raw:new Map(),placed:new Map()};
function outpostCandidate361(cx,cz){
 if(OUTPOST361.seed!==WSEED){OUTPOST361.seed=WSEED;OUTPOST361.raw.clear();OUTPOST361.placed.clear()}
 const key=cx+','+cz;if(OUTPOST361.raw.has(key))return OUTPOST361.raw.get(key);let result=null;
 if(rh(cx,cz,9)%100<11){const x=cx*CH,z=cz*CH,segs=roadSegs(x,z,1);let best=null,dist=12;
  for(const [ax,az,bx,bz] of segs){const dx=bx-ax,dz=bz-az,len=Math.hypot(dx,dz);if(!len)continue;const t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(len*len))),px=ax+dx*t,pz=az+dz*t,d=Math.hypot(x-px,z-pz);if(d<dist){dist=d;best={x:px,z:pz,nx:-dz/len,nz:dx/len}}}
  if(best)for(const side of (rh(cx,cz,12)%2?[-1,1]:[1,-1])){const px=best.x+best.nx*28*side,pz=best.z+best.nz*28*side;if(onRoad(segs,px,pz,22)||nearestCity(px,pz).d<=350||riverClear239(px,pz))continue;
   let blocked=false;for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const xx=Math.round(px/CH)+i,zz=Math.round(pz/CH)+j,lake=lakeAt239(xx,zz);if(lake&&Math.hypot(px-lake.x,pz-lake.z)<lake.r+18||ruinAt(xx,zz)&&Math.hypot(px-xx*CH,pz-zz*CH)<30)blocked=true}
   if(!blocked){result={x:px,z:pz,cx,cz,priority:rh(cx,cz,13)};break}
  }
 }
 OUTPOST361.raw.set(key,result);return result;
}
function outpostPoint361(cx,cz){if(OUTPOST361.raw.size>12000){OUTPOST361.raw.clear();OUTPOST361.placed.clear()}const p=outpostCandidate361(cx,cz),key=cx+','+cz;if(OUTPOST361.placed.has(key))return OUTPOST361.placed.get(key);let result=p;
 if(p)for(let i=-6;i<=6;i++)for(let j=-6;j<=6;j++){if(!i&&!j)continue;const q=outpostCandidate361(cx+i,cz+j);if(q&&Math.hypot(p.x-q.x,p.z-q.z)<320&&(q.priority<p.priority||q.priority===p.priority&&(q.cx<p.cx||q.cx===p.cx&&q.cz<p.cz)))result=null}
 OUTPOST361.placed.set(key,result);return result;
}
function outpostAt217(cx,cz){return !!outpostPoint361(cx,cz)}
function buildOutpost217(ch,g,addCol){const point=outpostPoint361(ch.cx,ch.cz);if(!point)return;const x0=point.x,z0=point.z,R=mulberry32(rh(ch.cx,ch.cz,10));
 if(ENV.ok){const b=new EnvBatch();EH(b,'campfire_stones',x0,0,z0,0,.7);EH(b,'tent_detailedOpen',x0+4,0,z0-3,R()*TAU,2.6);EW(b,'stall',x0-4,0,z0+2,Math.PI/2,3.2);EW(b,'cart',x0+1,0,z0+5,R()*TAU,2.6);EH(b,'lantern_standing',x0-2,0,z0-3,0,2.4);EW(b,'crates_stacked',x0-5.5,0,z0-1,R()*TAU,1.4);envSolidEW357(addCol,b,'barrel',x0+5.5,0,z0+1,0,.8);envOwn(g,b.mesh(ENVMAT))}
 const f=new THREE.PointLight(0xffa04a,1.4,14,1.6);f.position.set(x0,1.2,z0);g.add(f);for(const [x,z,r] of [[x0+4,z0-3,2],[x0-4,z0+2,1.6],[x0+1,z0+5,1.4],[x0-5.5,z0-1,.8],[x0-2,z0-3,.3]])addCol({x,z,r});/* v429: caixotes e lampião também */
 const nm='Posto '+['do Viajante','da Encruzilhada','do Lampião','da Carroça','das Brasas','do Corvo'][rh(ch.cx,ch.cz,11)%6];
 L.inter.push({type:'outpost',chunk:ch,x:x0+1.5,z:z0+1.5,r:2.6,label:'F · DESCANSAR NA FOGUEIRA',use:()=>{player.hp=player.maxhp;player.mp=player.maxmp;floater(player.x,player.z,'Descansou','#ffd08a',true);toast('<b>['+nm.toUpperCase()+']</b> Você descansou na fogueira. Vida e mana cheias.',4000);saveRun()}});
 L.inter.push({type:'outpost',chunk:ch,x:x0-4,z:z0+3.5,r:2.4,label:'F · MASCATE',use:()=>openShop('pot')});
 try{const R2=mulberry32(rh(ch.cx,ch.cz,12)),k=['gobArcher118','gobShaman118','gobShield118','orc','gobBrute118'][Math.floor(R2()*5)],e=spawnKind(KINDS[k]?k:'goblin',x0+3.5,z0+2.5,0,{wild:true,noFendido:true,noInedita:true});
  {const ix=enemies.indexOf(e);if(ix>=0)enemies.splice(ix,1)}FRIENDS217.push(e);e.friendly217=true;e.hp=e.maxhp=1e9;e.name=['Grak','Mizzu','Ossa','Uzra','Kepp','Brunna'][Math.floor(R2()*6)]+', caçador do Clã Ferrugem';e.short=e.name.split(',')[0];e.face=-2.4;ch.friend217=e;
  L.inter.push({type:'outpost',chunk:ch,x:x0+3.5,z:z0+2.5,r:2.6,label:'F · FALAR COM '+e.short.toUpperCase(),use:()=>{speech153(e,pick(MONSTERHUNT217));storyCh220('act8');lore206('monsterhunt','Nem todo monstro que atravessa a fenda é inimigo. Alguns aprenderam a viver aqui e caçam portais como você. O Clã Ferrugem é o maior deles.')}})}catch(_){} }
/* v218 (Ian): monstros inteligentes que viraram caçadores. Não atacam, não podem ser atacados, conversam. */
const FRIENDS217=[];
const MONSTERHUNT217=['Atravessei a fenda há cem anos. Hoje caço os que vieram depois de mim.','Os humanos me olham torto. Mas o ouro da Ordem é igual para todos.','Nem todo monstro quer o fim do mundo. Eu gosto deste céu.','Se vir um chefe de aura dourada, corra. Aquilo não é bicho, é pedaço de deus.','O Clã Ferrugem tem regra: nunca deixar um portal romper perto de uma vila.','Você também veio de outro lugar, Rasgado. Somos mais parecidos do que pensa.','Os chefes falam do Arquiteto como se fosse um pai. Eu chamo de carcereiro.']
function visit217(){if(!player||L.mode!=='world')return;const n=nearestCity(player.x,player.z);if(n.d>40*CITYK)return;const V=profile.visited217=profile.visited217||{};if(!V[n.c.id]){V[n.c.id]={n:n.c.name,x:n.c.x,z:n.c.z,cap:!!n.c.capital};store.set('pds2_profile',profile);if(n.c.capital&&n.c.name!=='Aster'){storyCh220('act9');bigText(n.c.name.toUpperCase(),1800);showSys('Você chegou a <b>'+n.c.name+'</b>. As capitais guardam o comércio da região e uma Carroça da Ordem para viajar.')}}}
/* v219 (Ian): preço só pela distância, e crescente (viagem longa pesa). */
function travelCost219(km){return servicePrice265('travel',{km})}
function travelView217(){const V=profile.visited217||{},P=player;let h='<div class="sysline">Teren, cocheiro da Ordem, leva você a qualquer cidade que já visitou. Preço e tempo aumentam com a distância. A viagem avança o relógio em até meio dia e pode virar a data. O valor já inclui as tarifas locais.</div>';
 const L2=Object.entries(V).map(([id,v])=>({id,...v,d:Math.hypot(v.x-P.x,v.z-P.z)})).filter(v=>v.d>200).sort((a,b)=>a.d-b.d);
 for(const v of L2){const km=v.d/1000,cost=travelCost219(km);h+=row((v.cap?'★ ':'')+gearText(v.n),distTxt(v.d),btn(fmt(cost)+' ouro','travel217',v.id,run.gold>=cost))}
 if(!L2.length)h+='<div class="sysline">Visite outras cidades para liberar destinos.</div>';openModal('CARROÇA DA ORDEM',h)}
function travelGo217(id){const v=(profile.visited217||{})[id];if(!travelReady265(v))return;const P=player,km=Math.hypot(v.x-P.x,v.z-P.z)/1000,cost=travelCost219(km);if(!spendService265(cost))return;closeModal();P.x=v.x+rnd(-3,3);P.z=v.z+14;cam.x=P.x;cam.z=P.z;P.m.root.position.set(P.x,0,P.z);updChunks(true);dayT+=Math.min(DAYLEN*.5,km*40);saveRun();toast('<b>[CARROÇA]</b> Você chegou a '+gearText(v.n)+'. A viagem levou '+Math.round(km*40/60)+' min de jogo.',5000)}
function ruinAt(cx,cz){if(((rh(cx,cz,3))%100)>=6)return false;if(onRoad(roadSegs(cx*CH,cz*CH,1),cx*CH,cz*CH,16))return false;for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const c=regionCity(Math.floor((cx+i)/REG),Math.floor((cz+j)/REG));if(Math.abs(c.cx-cx)<=1&&Math.abs(c.cz-cz)<=1)return false}return true}
function buildRuin(ch,g,addCol){const x0=ch.cx*CH,z0=ch.cz*CH,key=ch.cx+','+ch.cz;
  if(ENV.ok)envRuin(g,x0,z0,addCol);else for(let i=0;i<8;i++){const a=i/8*TAU;if(i===3)continue;const p=mesh(geo('rpil',()=>new THREE.CylinderGeometry(.6,.7,1,8)),toonS(0x5a5a68));const h=rnd(1.5,4.5);p.scale.y=h;p.position.set(x0+Math.cos(a)*7,h/2,z0+Math.sin(a)*7);g.add(p);addCol({x:p.position.x,z:p.position.z,r:.8})}
  const treasure=run&&run.tmap&&run.tmap.k===key,opened=(profile.ruins||{})[key]&&!treasure;if(opened)return;
  const point=chestPoint253({x:x0,z:z0},g.userData.chestObstacles253||[]);if(!point)return;const bx=point.x,bz=point.z;
  const cg=ENV.ok?envChest(treasure).g:new THREE.Group();if(!ENV.ok){const b=mesh(geo('cb',()=>new THREE.BoxGeometry(1.4,.8,1)),toonS(treasure?0xffd070:0x6b3f1f));b.position.y=.4;cg.add(b)}cg.position.set(bx,0,bz);cg.userData.chest253=true;g.add(cg);
  const it={type:'ruin',chunk:ch,grp:cg,x:bx,z:bz,r:2.4,label:treasure?'F · ABRIR O TESOURO':'F · ABRIR BAÚ DAS RUÍNAS',use:()=>{it.hidden=true;g.remove(cg);profile.ruins=profile.ruins||{};profile.ruins[key]=1;store.set('pds2_profile',profile);
    const gr=danger(x0,z0),gold=Math.round((treasure?300:60)*GR[gr].gold);run.gold+=gold;floater(bx,bz,'+'+fmt(gold)+' ouro','#ffd54f',true);sfx('coin');addItem(treasure?makeItem(Math.random()<.5?'w':'a',gr,3):rollItem(gr,false));
    if(treasure){run.tmap=null;bigText('TESOURO!',1300);toast('<b>[TESOURO]</b> Você achou o tesouro do mapa.',5000)}}};L.inter.push(it)}
function treasureOffer266(){if(run.tmap)return null;const P=player,origin=nearestCity(P.x,P.z).c.id,old=run.tmapOffer266;if(old&&old.origin===origin&&old.day===todayKey()&&Number.isFinite(old.x)&&Number.isFinite(old.z)&&!profile.ruins?.[old.k])return old;const pcx=Math.round(P.x/CH),pcz=Math.round(P.z/CH);for(let t=0;t<400;t++){const a=rnd(0,TAU),d=rnd(8,16),cx=pcx+Math.round(Math.cos(a)*d),cz=pcz+Math.round(Math.sin(a)*d),k=cx+','+cz;if(ruinAt(cx,cz)&&!profile.ruins?.[k])return run.tmapOffer266={k,x:cx*CH,z:cz*CH,tier:danger(cx*CH,cz*CH),origin,day:todayKey()}}delete run.tmapOffer266;return null}
function buyMap(){if(run.tmap)return false;const offer=treasureOffer266();if(!offer){toast('Não há mapa de ruína disponível agora.');return false}const price=servicePrice265('treasureMap',{tier:offer.tier});if(!spendService265(price))return false;run.tmap={k:offer.k,x:offer.x,z:offer.z,tier266:offer.tier};delete run.tmapOffer266;const ch=chunks.get(offer.k);if(ch)unloadChunk(ch);toast('<b>[MAPA DO TESOURO]</b> Um X apareceu no seu mapa, a '+Math.round(Math.hypot(offer.x-player.x,offer.z-player.z))+'m.',5000);saveRun();return true}
