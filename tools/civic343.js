/* v343 (Ian): status cívico por cidade, invasão com Fenda vermelha na praça, carroças de suprimentos nas estradas e Alvos Notórios.
   Vale para qualquer cidade (Aster, capitais e vilas): tudo parte de nearestCity()/regionState116().
   - Confiança 0–100 por cidade vira 4 graus: Forasteiro, Conhecido, Defensor Local, Herói Local.
   - Ataque à cidade (RAID155): com domo inteiro, os invasores ficam do lado de fora e gastam o domo; sem domo, entram.
     Cidade que cai por ataque ganha uma Fenda Invasora na praça; só depois de fechá-la dá para pagar a reconstrução.
   - Defesa vencida: +15 de confiança e ouro pago pelo tesouro da cidade. Não abre festival.
   - Carroças andam pelas estradas entre as cidades; algumas são emboscadas.
   - Alvos Notórios: contratos da Ordem liberados por reputação. */
window.Civic343=(()=>{
 const TAU=Math.PI*2,GRADE_N=['','Forasteiro','Conhecido','Defensor Local','Herói Local'],GRADE_MIN=[0,0,25,50,75];
 const WALL=36*CITYK;
 const cityById=id=>{const p=String(id).split(',').map(Number);return Number.isFinite(p[0])&&Number.isFinite(p[1])?regionCity(p[0],p[1]):null};
 const here=()=>player&&L.mode==='world'?nearestCity(player.x,player.z).c:null;
 const gradeOf=c=>{if(!c||!profile)return 1;const t=regionState116(c).trust;return t>=75?4:t>=50?3:t>=25?2:1};
 const grade=()=>gradeOf(here());
 const st=()=>{profile.civic343=profile.civic343||{};const s=profile.civic343;s.res=s.res||{};s.scout=s.scout||{};return s};
 const save=()=>store.set('pds2_profile',profile);
 const compass=(dx,dz)=>['norte','nordeste','leste','sudeste','sul','sudoeste','oeste','noroeste'][((Math.round(Math.atan2(dx,-dz)/(Math.PI/4))%8)+8)%8];

 /* ---------- pousada e imposto ---------- */
 const restMul=()=>{const g=grade();return g>=4?0:g>=3?.5:1};
 function restPaid(){const c=here();if(!c||gradeOf(c)<3||!window.Econ154||!Econ154.treasuryPay)return;const full=servicePrice265('rest',{innLevel:innLv()});Econ154.treasuryPay(c,Math.round(full*(1-restMul())))}
 function innNote(){const c=here(),g=gradeOf(c);return '<div class="sysline" style="font-size:12px">'+(g>=4?'<b>Herói Local</b>: seu quarto em '+safeText(c.name)+' é gratuito, por conta do tesouro da cidade.':g>=3?'<b>Defensor Local</b>: o tesouro de '+safeText(c.name)+' paga metade do seu descanso.':'Com 50 de confiança nesta cidade o descanso custa a metade; com 75, o quarto é gratuito.')+'</div>'}
 const taxFree=c=>gradeOf(c)>=4;

 /* ---------- estoque reservado (Conhecido) ---------- */
 const stock={};
 function reservedItem(sl){const c=here();if(!c)return null;const key=c.id+'|'+sl+'|'+gameDay198();if(!stock[key]){const t=clamp(rankOf(),0,8);stock[key]={it:makeItem(sl,t,1,sl==='w'?classShopKind290():undefined),t}}return {key,...stock[key]}}
 const reservedPrice=(sl,t)=>equipmentShopPrice(sl,t)*2;
 function reservedRows(sl){const c=here();if(!c||!inCity(player.x,player.z))return '';let h='<div class="sec">ESTOQUE RESERVADO</div>';
  if(gradeOf(c)<2)return h+'<div class="sysline" style="font-size:12px">O vendedor guarda peças raras para quem a cidade já conhece. Chegue a 25 de confiança em '+safeText(c.name)+' (grau Conhecido).</div>';
  const R=reservedItem(sl),day=gameDay198(),sold=st().res[c.id+'|'+sl]===day;if(!R)return '';const pp=reservedPrice(sl,R.t);
  return h+row('<span class="rl" style="color:'+RANKS[R.t].c+'">'+RANKS[R.t].id+'</span> · <b style="color:'+RAR[R.it.rar].c+'">'+R.it.name+'</b>',statTxt(R.it)+' · raridade '+RAR[R.it.rar].n+' · guardada para conhecidos da cidade · uma por dia do jogo',sold?'<b>Vendido hoje</b>':btn(fmt(pp)+' ouro','buyres343',sl,run.gold>=pp))}
 function buyReserved(sl){const c=here();if(!c||!inCity(player.x,player.z)||gradeOf(c)<2||!EQUIP_SLOTS.includes(sl))return false;const day=gameDay198(),k=c.id+'|'+sl;if(st().res[k]===day)return false;const R=reservedItem(sl);if(!R)return false;const pp=reservedPrice(sl,R.t);if(run.gold<pp||!equipmentBagRoom())return false;
  run.gold-=pp;if(window.Econ154)Econ154.notePurchase(pp);R.it.purchasePaidBalance=pp;addItem(R.it);delete stock[R.key];st().res[k]=day;save();toast('<b>['+safeText(c.name)+']</b> Peça do estoque reservado comprada.');return true}

 /* ---------- quadro de graus (janela REGIÃO) ---------- */
 function regionRows(c,local){const g=gradeOf(c),t=regionState116(c).trust,day=gameDay198();
  const line=(n,txt)=>row((g>=n?'<b style="color:#6fe39a">✔ ':'<b>')+'Grau '+n+' · '+GRADE_N[n]+'</b> <span style="color:var(--dim)">('+GRADE_MIN[n]+(n<4?'–'+(GRADE_MIN[n+1]-1):'–100')+')</span>',txt,'');
  let h='<div class="sec">STATUS CÍVICO EM '+safeText(c.name).toUpperCase()+' · '+t+'/100</div>';
  h+=line(1,'Preços normais. Moradores e guardas tratam você como qualquer viajante.');
  h+=line(2,'Os comerciantes abrem o estoque reservado (uma peça rara por dia nas lojas de equipamento; elixires com os mascates). Os moradores cumprimentam você pelo nome.');
  h+=line(3,'Guardas das muralhas atiram nos monstros que perseguirem você até os portões. Descanso na pousada pela metade do preço. Suprimentos da guarnição.');
  h+=line(4,'Quarto gratuito na pousada. Sem imposto nas suas vendas nesta cidade. Batedores da Ordem apontam Fendas raras no mapa.');
  if(g>=4)h+=row('Batedores da Ordem','Uma vez por dia do jogo, os batedores marcam no mapa as Fendas raras da região e a direção das peças soltas.',btn(st().scout[c.id]===day?'Já enviados hoje':'Requisitar batedores','scout343',0,local&&st().scout[c.id]!==day,'hot'));
  return h}

 /* ---------- batedores (Herói Local) ---------- */
 function scout(){const c=here();if(!c||!inCity(player.x,player.z)||gradeOf(c)<4)return false;const day=gameDay198();if(st().scout[c.id]===day)return false;const P=player,marks=[];
  const rare=gates.filter(g=>!g.dead&&!g.inv343&&!g.anchor221&&(g.secret||g.red||g.giant||g.double||g.rank>=Math.min(9,rankOf()+1))).sort((a,b)=>Math.hypot(a.x-P.x,a.z-P.z)-Math.hypot(b.x-P.x,b.z-P.z)).slice(0,3);
  for(const g of rare)marks.push({x:g.x,z:g.z,n:'Fenda '+(g.secret?'secreta':g.red?'vermelha':'rank '+GR[g.rank].id),gate:g.id});
  for(const id in profile.piece250||{}){const p=profile.piece250[id];if(p&&Number.isFinite(p.x))marks.push({x:p.x,z:p.z,n:'Peça solta do Arquiteto',piece:1})}
  if(!marks.length){toast('<b>[ORDEM]</b> Os batedores não acharam Fenda rara nem peça solta por perto. Tente de novo mais tarde; o pedido de hoje não foi gasto.',6000);return false}
  st().scout[c.id]=day;save();run.scout343={day,marks};
  toast('<b>[ORDEM]</b> Batedores de volta: '+marks.map(m=>m.n+' a '+fmt(Math.round(Math.hypot(m.x-P.x,m.z-P.z)))+' m a '+compass(m.x-P.x,m.z-P.z)).join(' · ')+'. Marcado no mapa.',9000);sfx('coin');return true}

 /* ---------- domo x invasores, queda e defesa ---------- */
 const domeUp=c=>{if(!c||!window.Dome154)return false;const s=Dome154.state(c);return !!(s.built&&!s.broken)};
 function domeDrain(c,f){if(!(f>0)||!c)return;const d=Dome154.domes.get(c.id);if(d){if(d.broken)return;d.hp-=f;if(d.hp<=0)Dome154.shatter(d);return}
  const p=(profile.dome154||{})[c.id];if(!p||!p.built||p.broken)return;p.hp=(p.hp??1)-f;if(p.hp<=0){p.hp=0;p.broken=true;save();logNews('<b>[NARRADOR]</b> O domo de '+safeText(c.name)+' se rompeu durante o ataque. Os monstros estão entrando.')}}
 const help={};
 function defenseWon(c,id){const near=Math.hypot(c.x-player.x,c.z-player.z)<RAIDNEAR215;if(!near||!((help[id]||0)>=6))return;
  const want=Math.round(300*(1+cityL(c))),paid=window.Econ154&&Econ154.treasuryPay?Econ154.treasuryPay(c,want):0;run.gold+=paid;
  regionEvent116(c,15,0,'Você defendeu a cidade de um ataque da Fenda. Confiança +15.');bigText('CIDADE DEFENDIDA',1600);sfx('coin');
  toast('<b>['+safeText(c.name)+']</b> A cidade resistiu com a sua ajuda. +15 de confiança'+(paid?' e +'+fmt(paid)+' de ouro pagos pelo tesouro da cidade.':'. O tesouro da cidade está vazio; não houve pagamento em ouro.'),8000);saveRun()}
 const baseRaids=updRaids155;
 updRaids155=function(dt){if(L.mode!=='world'||!player)return baseRaids(dt);
  const stash={},pre={},was=new Set(Object.keys(profile.raided155||{}));
  for(const id in RAID155){const c=cityById(id);pre[id]=c;if(!c)continue;
   if(Math.hypot(c.x-player.x,c.z-player.z)<110||enemies.some(e=>!e.dead&&e.raid155&&e.raid155.city===id&&Math.hypot(e.x-player.x,e.z-player.z)<30))help[id]=(help[id]||0)+dt;
   if(domeUp(c)){stash[id]=RAID155[id].hp;RAID155[id].hp=100}}
  baseRaids(dt);
  for(const id in stash){const R=RAID155[id];if(!R)continue;const loss=100-R.hp;R.hp=stash[id];R.warned=false;if(loss>0)domeDrain(pre[id],loss/100)}
  for(const id in pre){if(RAID155[id])continue;const c=pre[id],fell=!!(profile.raided155||{})[id]&&!was.has(id);
   if(c&&fell&&!c.capital){profile.inv343=profile.inv343||{};profile.inv343[id]=1;save()}
   else if(c&&!cityFallen(c))defenseWon(c,id);
   delete help[id]}};
 const baseHud=raidHud155;
 raidHud155=function(){let s=baseHud();if(!s||!player)return s;for(const id in RAID155){const c=cityById(id);if(c&&Math.hypot(c.x-player.x,c.z-player.z)<400&&domeUp(c)){s=' · '+c.name.toUpperCase()+' SOB ATAQUE: DOMO '+Math.max(0,Math.round(Dome154.state(c).hp*100))+'%';break}}return s};

 /* ---------- Fenda Invasora na praça ---------- */
 const riftOpen=c=>!!(c&&!c.capital&&cityFallen(c)&&(profile.inv343||{})[c.id]);
 function riftTick(){if(!player||L.mode!=='world')return;const n=nearestCity(player.x,player.z),c=n.c;if(!c||n.d>700)return;const has=gates.find(g=>g.inv343===c.id&&!g.dead);
  if(riftOpen(c)&&!has){const rank=clamp(Math.max(danger(c.x+90,c.z),rankOf()),0,9);const g={id:++gateSeq,x:c.x,z:c.z-5,rank,lvl207:Math.max(portalLvl207(rank),run.level),aff:rollAff(rank),double:false,red:true,giant:false,life:1e9,max:1e9,seed:(Math.random()*2**31)|0,layout103:null,cleared:false,dead:false,inv343:c.id};gates.push(g);gateMesh(g);if(g.mesh)g.mesh.scale.setScalar(1.5);
   if(n.d<300)showSys('Uma <b>Fenda Invasora</b> vermelha abriu na praça de <b>'+safeText(c.name)+'</b>. Lojas, banco e serviços estão fechados e os moradores se trancaram em casa. Limpe a praça, entre na Fenda e derrote o chefe invasor; depois pague a reconstrução no marco central.')}
  else if(has&&!riftOpen(c)){has.dead=true;if(has.mesh&&has.mesh.parent)has.mesh.parent.remove(has.mesh)}}
 function riftClosed(g){if(!g||!g.inv343)return;if(profile.inv343)delete profile.inv343[g.inv343];save();const c=cityById(g.inv343);
  setTimeout(()=>{bigText('FENDA INVASORA FECHADA',1800);showSys('A Fenda Invasora'+(c?' de <b>'+safeText(c.name)+'</b>':'')+' se fechou. Volte ao marco no centro da cidade para pagar a reconstrução.')},1500)}
 const baseRV=rebuildView;
 rebuildView=function(c){if(riftOpen(c)){view=()=>rebuildView(c);openModal('RECONSTRUIR '+c.name.toUpperCase(),'<div class="sysline">Uma <b>Fenda Invasora</b> vermelha está aberta na praça de '+safeText(c.name)+'.</div>'+row('1. Limpar a praça','Derrote os monstros que ocuparam a cidade.','')+row('2. Fechar a Fenda','Entre na Fenda vermelha no centro e derrote o chefe invasor.','<span style="color:#ff8fa3">Fenda aberta</span>')+row('3. Pagar a reconstrução','Depois de fechar a Fenda, volte a este marco.',''));return}return baseRV(c)};
 const baseDR=doRebuild;
 doRebuild=function(id){if(riftOpen(nearestCity(player.x,player.z).c))return;return baseDR(id)};

 /* ---------- guardas das muralhas (Defensor Local) ---------- */
 let guardT=0,volley=0,guardTold=0;
 function guardShot(c,e,magic){const dx=e.x-c.x,dz=e.z-c.z,d=Math.hypot(dx,dz)||1,ox=c.x+dx/d*WALL,oz=c.z+dz/d*WALL;
  const o=magic?mesh(geo('gorb343',()=>new THREE.SphereGeometry(.28,10,8)),glow(0xb48cff,.9)):mesh(geo('garrow343',()=>new THREE.CylinderGeometry(.035,.035,1.3,5).rotateX(Math.PI/2)),toonS(0xd8c49a));
  o.position.set(ox,5,oz);o.lookAt(e.x,1,e.z);
  fxCustom(o,.28,(_,k)=>{o.position.set(ox+(e.x-ox)*k,5+(1.1-5)*k+Math.sin(k*Math.PI)*.8,oz+(e.z-oz)*k)});
  setTimeout(()=>{if(e.dead||L.mode!=='world')return;hurtEnemy(e,Math.max(1,e.maxhp*(e.isBoss?.01:e.elite?.03:.07)),ox,oz,{guard343:1,kb:1});fxRing(e.x,e.z,magic?0xb48cff:0xffe0a0,.9,.25)},260)}
 function guardTick(dt){guardT-=dt;if(guardT>0)return;guardT=.9;const n=nearestCity(player.x,player.z),c=n.c;if(!c||n.d>WALL+40||cityFallen(c)||gradeOf(c)<3)return;
  const T=[];for(const e of enemies){if(e.dead||e.gone||e.friendly217||e.ally)continue;const d=Math.hypot(e.x-c.x,e.z-c.z);if(d<WALL-1||d>WALL+26)continue;if(!(e.aggro||Math.hypot(e.x-player.x,e.z-player.z)<20))continue;T.push({e,d})}
  if(!T.length)return;T.sort((a,b)=>a.d-b.d);volley++;for(const t of T.slice(0,2))guardShot(c,t.e,volley%3===0);
  if(time>guardTold){guardTold=time+240;toast('<b>['+safeText(c.name)+']</b> Os guardas das muralhas reconhecem você e atiram nos monstros que chegam perto dos portões.',5000)}}

 /* ---------- carroças de suprimentos ---------- */
 const wagons=[];let wagonT=14;
 function wagonModel(){const g=new THREE.Group(),wood=toonS(0x7a5230),dark=toonS(0x4a3220),cloth=toonS(0xe6dcc2),hide=toonS(0x9a7248),horn=toonS(0xefe6d0);
  const add=(geom,mat,x,y,z)=>{const m=mesh(geom,mat);m.position.set(x,y,z);g.add(m);return m};
  add(geo('wbed343',()=>new THREE.BoxGeometry(1.7,.5,2.7)),wood,0,.95,-1.2);
  add(geo('wcov343',()=>new THREE.CylinderGeometry(.9,.9,2.5,12,1,false,-Math.PI/2,Math.PI).rotateX(-Math.PI/2)),cloth,0,1.2,-1.25);
  const wheels=[];for(const[x,z]of[[-.95,-.3],[.95,-.3],[-.95,-2.1],[.95,-2.1]]){const w=add(geo('wwh343',()=>new THREE.CylinderGeometry(.5,.5,.14,10)),dark,x,.5,z);w.rotation.z=Math.PI/2;wheels.push(w)}
  for(const x of[-.5,.5])add(geo('wshaft343',()=>new THREE.BoxGeometry(.08,.08,2.2)),dark,x,.85,1.1);
  add(geo('wseat343',()=>new THREE.BoxGeometry(1.5,.12,.5)),dark,0,1.3,.05);
  const ox=new THREE.Group();ox.position.set(0,0,2.1);g.add(ox);const oadd=(geom,mat,x,y,z)=>{const m=mesh(geom,mat);m.position.set(x,y,z);ox.add(m);return m};
  oadd(geo('obody343',()=>new THREE.BoxGeometry(.85,.8,1.6)),hide,0,1.05,0);oadd(geo('ohead343',()=>new THREE.BoxGeometry(.5,.5,.6)),hide,0,1.2,1.05);
  for(const x of[-.3,.3]){const hn=oadd(geo('ohorn343',()=>new THREE.ConeGeometry(.07,.4,6)),horn,x,1.55,1.05);hn.rotation.z=x<0?.5:-.5}
  const legs=[];for(const[x,z]of[[-.28,.55],[.28,.55],[-.28,-.55],[.28,-.55]]){const p=new THREE.Group();p.position.set(x,.7,z);const l=mesh(geo('oleg343',()=>new THREE.BoxGeometry(.2,.7,.2)),hide);l.position.y=-.35;p.add(l);ox.add(p);legs.push(p)}
  let driver=null;try{driver=makeChibi({body:0x7a5a2a,skin:0xffd8b8,hair:0x3b2a20,wep:'none',scale:.9});driver.root.position.set(0,.78,.05);g.add(driver.root)}catch(_){driver=null}
  return {g,wheels,legs,ox,driver}}
 function routesNear(P){const out=[];for(const c of citiesAround(P.x,P.z,1900)){const rx=Math.floor(c.cx/REG),rz=Math.floor(c.cz/REG),e=regionCity(rx+1,rz),so=regionCity(rx,rz+1);out.push({a:c,b:e,pts:[[c.x,c.z],[e.x,c.z],[e.x,e.z]]},{a:c,b:so,pts:[[c.x,c.z],[c.x,so.z],[so.x,so.z]]})}return out}
 function wagonSpawn(force){const P=player,cand=[];for(const r of routesNear(P)){if(cityFallen(r.a)||cityFallen(r.b))continue;for(let s=0;s<2;s++){const[x1,z1]=r.pts[s],[x2,z2]=r.pts[s+1],len=Math.hypot(x2-x1,z2-z1);if(len<1)continue;for(let d=0;d<=len;d+=12){const x=x1+(x2-x1)*d/len,z=z1+(z2-z1)*d/len,pd=Math.hypot(x-P.x,z-P.z);if(pd<(force?16:55)||pd>(force?30:95)||nearestCity(x,z).d<82)continue;cand.push({r,s,x,z})}}}
  if(!cand.length)return null;const k=cand[Math.floor(Math.random()*cand.length)],fwd=Math.random()<.5,M=wagonModel();
  const w={...M,x:k.x,z:k.z,face:0,pts:k.r.pts,s:k.s,fwd,from:fwd?k.r.a:k.r.b,dest:fwd?k.r.b:k.r.a,hp:100,amb:null,told:false,wait:0,t:0,gone:false};
  w.n={x:w.x,z:w.z,short:'Mercador',name:'Mercador',m:{root:w.g}};w.g.position.set(w.x,0,w.z);scene.add(w.g);wagons.push(w);
  if(force==='ambush'||(!force&&Math.random()<.34&&nearestCity(w.x,w.z).d>120))ambush(w);return w}
 function ambush(w){const gr=clamp(Math.max(danger(w.x,w.z),rankOf()-2),0,9),n=3+(gr>=3?1:0),foes=[];
  for(let i=0;i<n;i++){const a=i/n*TAU+Math.random()*.5,x=w.x+Math.cos(a)*3.6,z=w.z+Math.sin(a)*3.6;try{const e=spawnKind(wpick(worldKinds124(gr,x,z)).k,x,z,gr,{wild:true});e.wagon343=1;e.face=Math.atan2(w.x-x,w.z-z);foes.push(e)}catch(_){}}
  if(foes.length)w.amb={foes,n:foes.length,hitT:0}}
 function wagonRemove(w){w.gone=true;w.n.gone=true;if(w.g.parent)w.g.parent.remove(w.g);const i=wagons.indexOf(w);if(i>=0)wagons.splice(i,1)}
 function wagonTick(dt){const P=player;
  wagonT-=dt;if(wagonT<=0){wagonT=35+Math.random()*30;if(wagons.length<2&&!L.siege&&!L.inv)wagonSpawn()}
  for(const w of[...wagons]){w.t+=dt;const pd=Math.hypot(w.x-P.x,w.z-P.z);if(pd>280){wagonRemove(w);continue}
   if(w.wreck){w.wreck-=dt;if(w.wreck<=0)wagonRemove(w);continue}
   let moving=false;
   if(w.amb){const A=w.amb,alive=A.foes.filter(e=>!e.dead&&!e.gone&&enemies.includes(e));
    if(!alive.length){w.amb=null;w.wait=4;
     if(pd<45){const gold=Math.round(120*GR[clamp(rankOf(),0,9)].gold*(.6+.4*w.hp/100));run.gold+=gold;speech153(w.n,pick(['Você salvou a carga e a minha pele. Obrigado!','Achei que era o fim. Fique com isto, você mereceu.','Vou contar em '+w.dest.name+' quem me tirou dessa.']),'Mercador a caminho de '+w.dest.name);
      regionEvent116(w.dest,5,-3,'Você salvou uma carroça de suprimentos na estrada. Confiança +5; a escassez diminuiu.');sfx('coin');bigText('CARROÇA SALVA',1300);toast('<b>[ESTRADA]</b> O mercador pagou <b>'+fmt(gold)+'</b> de ouro. +5 de confiança em '+safeText(w.dest.name)+' e menos escassez por lá.',7000);saveRun()}}
    else{if(pd<140)w.hp-=dt*100/55*(alive.length/A.n);A.hitT-=dt;
     if(A.hitT<=0&&pd<90){A.hitT=1.1;fxRing(w.x,w.z,0xff6a4d,1.6,.3);floater(w.x,w.z,'−','#ff8a6a',false,2.6);for(const e of alive)if(!e.aggro){e.face=Math.atan2(w.x-e.x,w.z-e.z);if(e.m&&e.m.root)e.m.root.rotation.y=e.face}}
     if(!w.told&&pd<75){w.told=true;toast('<b>[ESTRADA]</b> Uma carroça de suprimentos para <b>'+safeText(w.dest.name)+'</b> está sendo atacada. Derrote os monstros antes que ela seja destruída.',7000);sfx('gong')}
     if(pd<13&&w.t>(w.cryT||0)){w.cryT=w.t+9;speech153(w.n,pick(['Socorro! Eles vão levar tudo!','Aqui! Tire esses bichos de cima da carroça!','Ajude, por favor!']),'Mercador')}
     if(w.hp<=0){w.amb=null;w.wreck=25;w.g.rotation.z=.5;w.g.position.y=-.25;if(w.ox)w.ox.visible=false;if(w.driver)w.driver.root.visible=false;fxRing(w.x,w.z,0xff3a2a,4,.7);for(const e of alive)e.aggro=true;
      if(w.told){regionEvent116(w.dest,0,2,'Uma carroça de suprimentos foi destruída na estrada. A escassez aumentou.');toast('<b>[ESTRADA]</b> A carroça foi destruída. Os suprimentos não chegam a '+safeText(w.dest.name)+'.',6000)}}}}
   else if(w.wait>0)w.wait-=dt;
   else{const tgt=w.pts[w.fwd?w.s+1:w.s],dx=tgt[0]-w.x,dz=tgt[1]-w.z,d=Math.hypot(dx,dz);
    if(d<1){if(w.fwd?w.s>=1:w.s<=0){wagonRemove(w);continue}w.s+=w.fwd?1:-1}
    else{const sp=2.7*dt;w.x+=dx/d*Math.min(d,sp);w.z+=dz/d*Math.min(d,sp);w.face=Math.atan2(dx,dz);moving=true}
    if(nearestCity(w.x,w.z).d<70&&w.t>6){wagonRemove(w);continue}}
   w.n.x=w.x;w.n.z=w.z;if(!w.wreck){w.g.position.set(w.x,0,w.z);w.g.rotation.y=w.face}
   if(moving){for(const wh of w.wheels)wh.rotation.x+=dt*5.4;w.legs.forEach((l,i)=>{l.rotation.x=Math.sin(w.t*6+(i%3?Math.PI:0))*.5})}
   if(w.driver&&pd<60)try{animChibi(w.driver,{move:0,atk:0,dead:0,wind:0},time)}catch(_){}}}
 function clearWagons(){for(const w of[...wagons])wagonRemove(w)}

 /* ---------- Alvos Notórios ---------- */
 const TARGETS=[
  {id:'campos',tier:0,bio:'campos',kinds:['orcinho','magote','slime'],n:'Barrão, o Quebra-Cercas',t:'Caçador do Quebra-Cercas',m:'+2% de dano',b:{dmg:.02}},
  {id:'floresta',tier:1,bio:'floresta',kinds:['cogufuria','ninjinha','cogu'],n:'Velha Míscaro',t:'Caçador da Velha Míscaro',m:'+3% de vida',b:{hp:.03}},
  {id:'flores',tier:2,bio:'flores',kinds:['coelho','abelha','passaro'],n:'Orelha-Rubra',t:'Caçador do Orelha-Rubra',m:'+4% de ouro dos monstros',b:{gold:.04}},
  {id:'pantano',tier:3,bio:'pantano',kinds:['sapo','homempeixe','espinhosa'],n:'Rei Coaxo',t:'Caçador do Rei Coaxo',m:'+4% de vida',b:{hp:.04}},
  {id:'neve',tier:4,bio:'neve',kinds:['yeti','yetinho'],n:'Geada-Mãe',t:'Caçador da Geada-Mãe',m:'+3% de dano',b:{dmg:.03}},
  {id:'cristal',tier:5,bio:'cristal',kinds:['golempedra','redemoinho','golenzinho'],n:'Prisma Faminto',t:'Caçador do Prisma Faminto',m:'+5% de vida',b:{hp:.05}},
  {id:'deserto',tier:6,bio:'deserto',kinds:['cactogig','escaravelho','cactinho'],n:'Sultão Escaravelho',t:'Caçador do Sultão Escaravelho',m:'+6% de ouro dos monstros',b:{gold:.06}},
  {id:'vulcao',tier:7,bio:'vulcao',kinds:['dragonete','chifrudo','dino'],n:'Brasa-Velha',t:'Caçador do Brasa-Velha',m:'+4% de dano e +4% de vida',b:{dmg:.04,hp:.04}}];
 const NS=()=>{const s=profile.notor343=profile.notor343||{};s.done=s.done||{};return s};
 const repOf=T=>ORDER_REP_PORTAL[Math.min(9,T.tier+1)]*3,goldOf=T=>Math.round(800*GR[T.tier].gold);
 try{for(const T of TARGETS)if(!TITLES.some(x=>x.id==='notor_'+T.id))TITLES.push({id:'notor_'+T.id,n:T.t,d:'abater o Alvo Notório '+T.n+' (contrato da Ordem)',c:()=>!!(profile.notor343&&profile.notor343.done&&profile.notor343.done[T.id]),m:T.m,b:T.b})}catch(_){}
 let tgt=null,tgtT=0;
 function targetsTab(){ensureOrderRep();const s=NS(),rep=profile.orderRep97||0;
  let h='<div class="sysline">Lyra: Alvos Notórios são monstros de elite com nome próprio. Cada um vive num bioma. Aceite o contrato, vá até o bioma (fora das cidades) e ele aparece. Um contrato por vez. Abater o alvo dá um título de caçador com bônus e muita reputação da Ordem. Sua reputação: <b>'+fmt(rep)+'</b>.</div>';
  for(const T of TARGETS){const need=orderRepNeed(T.tier),done=!!s.done[T.id],act=s.active===T.id,open=rep>=need;
   const info=BIO_N[T.bio]+' · rank '+GR[T.tier].id+' · recompensa: título <b>'+T.t+'</b> ('+T.m+'), +'+fmt(repOf(T))+' de reputação e '+fmt(goldOf(T))+' de ouro';
   h+=row((done?'<span style="color:#6fe39a">✔</span> ':'')+'<b>'+T.n+'</b>',info+(open||done?'':'<br><span style="color:#ff8fa3">Requer '+fmt(need)+' de reputação da Ordem.</span>')+(act?'<br><b style="color:#ffd54f">Contrato ativo.</b> '+(tgt&&!tgt.dead?'O alvo foi visto por perto; veja a estrela no mapa.':'Vá para '+BIO_N[T.bio]+', longe das cidades.'):''),
    done?'<b>Abatido</b>':act?btn('Desistir','notorx343',0):btn(open?'Aceitar contrato':'Bloqueado','notor343',T.id,open&&!s.active,'hot'))}
  return h}
 function targetDrop(){if(tgt&&!tgt.dead){tgt.gone=true;tgt.dead=true;if(tgt.m&&tgt.m.root&&tgt.m.root.parent)tgt.m.root.parent.remove(tgt.m.root);const i=enemies.indexOf(tgt);if(i>=0)enemies.splice(i,1)}tgt=null}
 function targetTick(dt){const s=NS();if(!s.active){if(tgt)targetDrop();return}const T=TARGETS.find(x=>x.id===s.active);if(!T){s.active=null;return}const P=player;
  if(tgt){if(tgt.dead){tgt=null;s.done[T.id]=1;s.active=null;const g=goldOf(T);run.gold+=g;save();bigText('ALVO NOTÓRIO ABATIDO',2000);sfx('level');addOrderRep(repOf(T),'Alvo Notório abatido: '+T.n);toast('<b>[ORDEM]</b> Contrato cumprido: <b>'+T.n+'</b>. +'+fmt(g)+' de ouro e o título <b>'+T.t+'</b> ('+T.m+').',9000);try{checkTitles()}catch(_){}saveRun();return}
   if(!enemies.includes(tgt)){tgt=null;return}if(Math.hypot(tgt.x-P.x,tgt.z-P.z)>280)targetDrop();return}
  if(biomeAt(P.x,P.z)!==T.bio||nearestCity(P.x,P.z).d<140||L.siege||L.inv){tgtT=0;return}
  tgtT+=dt;if(tgtT<5)return;tgtT=0;const k=T.kinds.find(x=>KINDS[x]);if(!k)return;const a=Math.random()*TAU,x=P.x+Math.cos(a)*34,z=P.z+Math.sin(a)*34;if(nearestCity(x,z).d<110)return;
  let e;try{e=spawnKind(k,x,z,T.tier,{wild:true,noFendido:1,noInedita:1})}catch(_){return}
  makeElite(e);e.name=T.n;e.short=T.n;e.notor343=T.id;e.maxhp*=3;e.hp=e.maxhp;e.dmg*=1.25;try{e.m.body.scale.multiplyScalar(1.25);e.r*=1.2}catch(_){}tgt=e;
  bigText('ALVO NOTÓRIO',1600);sfx('gong');toast('<b>[ORDEM]</b> <b>'+T.n+'</b> foi visto a '+compass(x-P.x,z-P.z)+'. Veja a estrela no mapa.',7000)}

 /* ---------- mapa ---------- */
 function map(ctx,tx,tz,full){const P=player;
  for(const w of wagons){const X=tx(w.x),Z=tz(w.z);ctx.fillStyle=w.wreck?'#555':w.amb?(Math.floor(time*3)%2?'#ff8a4d':'#ffd54f'):'#c9a26b';ctx.fillRect(X-3,Z-2,6,4);if(w.amb&&full){ctx.font='700 11px sans-serif';ctx.textAlign='left';ctx.fillText('Carroça atacada',X+7,Z+4);ctx.textAlign='center'}}
  if(tgt&&!tgt.dead){const X=tx(tgt.x),Z=tz(tgt.z),r=full?9:6;ctx.fillStyle='#ff5a8a';ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;ctx.lineTo(X+Math.cos(a)*rr,Z+Math.sin(a)*rr)}ctx.closePath();ctx.stroke();ctx.fill();if(full){ctx.font='700 11px sans-serif';ctx.textAlign='left';ctx.fillText(tgt.name,X+11,Z+4);ctx.textAlign='center'}}
  const S=run&&run.scout343;if(S&&S.day===gameDay198()){const size=ctx.canvas.width,m=14;for(const k of S.marks){if(k.gate&&!gates.some(g=>g.id===k.gate&&!g.dead))continue;let X=tx(k.x),Z=tz(k.z);const off=X<m||X>size-m||Z<m||Z>size-m;X=clamp(X,m,size-m);Z=clamp(Z,m,size-m);ctx.fillStyle=k.piece?'#ffd070':'#7cf4d2';ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X,Z-7);ctx.lineTo(X+6,Z);ctx.lineTo(X,Z+7);ctx.lineTo(X-6,Z);ctx.closePath();ctx.stroke();ctx.fill();if(full){ctx.font='700 11px sans-serif';ctx.textAlign=X>size/2?'right':'left';ctx.fillText(k.n+(off?' ('+fmt(Math.round(Math.hypot(k.x-P.x,k.z-P.z)))+' m)':''),X+(X>size/2?-10:10),Z+4);ctx.textAlign='center'}}}}

 /* ---------- ações dos botões ---------- */
 function action(a,v){
  if(a==='buyres343')return buyReserved(v)?true:'close0';
  if(a==='scout343'){scout();regionView116();return 'close0'}
  if(a==='notor343'){const s=NS(),T=TARGETS.find(x=>x.id===v);ensureOrderRep();if(!T||s.active||s.done[T.id]||(profile.orderRep97||0)<orderRepNeed(T.tier))return 'close0';s.active=T.id;tgtT=0;save();toast('<b>[ORDEM]</b> Contrato aceito: <b>'+T.n+'</b>. Procure em '+BIO_N[T.bio]+', longe das cidades.',6000);return true}
  if(a==='notorx343'){const s=NS();s.active=null;targetDrop();save();return true}
  return null}

 /* ---------- laço ---------- */
 let slow=0;
 function tick(dt){if(!player||!profile||!run||player.dead)return;if(L.mode!=='world'){if(wagons.length)clearWagons();tgt=tgt&&enemies.includes(tgt)?tgt:null;return}
  slow-=dt;if(slow<=0){slow=.5;riftTick()}
  guardTick(dt);wagonTick(dt);targetTick(dt)}
 const baseSiege=updSiege;updSiege=function(dt){baseSiege(dt);try{tick(dt)}catch(err){console.warn('Civic343',err)}};
 return {grade,gradeOf,GRADE_N,restMul,restPaid,innNote,taxFree,reservedRows,regionRows,riftOpen,riftClosed,targetsTab,action,map,wagons,TARGETS,
  test:{wagonSpawn,ambush,scout,target:()=>tgt,domeDrain,help}};
})();
