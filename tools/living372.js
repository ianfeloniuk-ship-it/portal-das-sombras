/* v372 — clans use base species only. Deterministic off-road sites; no paid/new assets. */
window.Living372=(()=>{
'use strict';
const clans=[
 {id:'ferrugem',n:'Clã Ferrugem',bio:['campos','floresta'],ks:['gobShield118','gobArcher118','goblin'],line:'Torvo manda proteger quem viaja. A estrada ao norte está vigiada.',service:'supplies',patrol:true},
 {id:'rocha',n:'Clã Quebra-Rocha',bio:['campos'],ks:['orc','orcinho'],line:'Honra não se toma. Mostre sua força num duelo e respeitaremos você.',service:'duel'},
 {id:'lagoa',n:'Vigias da Lagoa Sagrada',bio:['pantano','campos','floresta'],ks:['homempeixe','peixinho'],line:'A água sustenta todos nós. Não deixe a corrupção alcançar a lagoa.',service:'water',shore:true},
 {id:'brejo',n:'Confraria do Brejo',bio:['pantano'],ks:['sapo','sapo'],line:'Este chão é nosso. Uma disputa justa decide se merece atravessá-lo como amigo.',service:'duel'},
 {id:'escama',n:'Ordem da Escama Dourada',bio:['vulcao'],ks:['dragao','dragonete'],line:'O fogo prova o guerreiro. Traga seu ranque e sua coragem.',service:'forge',duel:true},
 {id:'manto',n:'Povo do Manto Branco',bio:['neve'],ks:['yeti','yetinho','yetinho'],line:'Aproxime-se do fogo. Proteja os pequenos e terá abrigo entre nós.',service:'shelter'},
 {id:'veu',n:'Irmandade do Véu',bio:['floresta'],ks:['ninja','ninjinha'],line:'Duas sombras. Um caminho. Informação tem preço.',service:'scout',train:true},
 {id:'micelio',n:'Círculo do Micélio',bio:['floresta'],ks:['reicogu','cogu','cogu'],line:'Quem chega em paz descansa. Nossas raízes guardam remédios.',service:'heal'},
 {id:'faces',n:'Conclave das Duas Faces',bio:['floresta','campos'],ks:['tribal','tribal'],line:'Uma face observa a Fenda. A outra protege seu espírito.',service:'bless',totem:true},
 {id:'velo',n:'Pastores do Velo Dourado',bio:['flores'],ks:['human','alpaca','alpacaimp'],line:'O rebanho conhece os campos. Descanse e leve provisões para a viagem.',service:'supplies'},
 {id:'fogueira',n:'Companhias da Fogueira',bio:['campos','floresta','flores','pantano','neve','cristal','deserto','vulcao'],ks:['human','human','human'],line:'Sente perto do fogo. A Ordem deixou notícias dos alvos desta região.',service:'rest'}
];
const clues={campos:'Campos abertos, além das muralhas e cercas.',floresta:'Interior da floresta, sob as copas mais densas.',flores:'Campos floridos, longe das cidades.',pantano:'Interior do brejo, entre as águas escuras.',neve:'Planícies nevadas além das muralhas.',cristal:'Terras de cristal, onde as pedras brilham.',deserto:'Areias do deserto, fora dos portões.',vulcao:'Terras vulcânicas, entre cinzas e rochas.'};
const camps=new Map();let world=null,scan=0,duel=null,ride=null,rest=0;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const corrupt=e=>!!(e&&(KINDS[e.kind]?.variant||KINDS[e.kind]?.fendido||e.fendido||e.variant));
const state=()=>run.clans372||(run.clans372={wins:{},bless:0,attack:0});
let siteSeed=null;const siteCache=new Map();
function site(cx,cz){if(siteSeed!==WSEED||siteCache.size>20000){siteCache.clear();siteSeed=WSEED}const key=cx+','+cz;if(!siteCache.has(key))siteCache.set(key,makeSite(cx,cz));return siteCache.get(key)}
function nearbySites(x,z){const out=[],cx=Math.round(x/160),cz=Math.round(z/160);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const p=site(cx+i,cz+j);if(p)out.push(p)}return out}
function makeSite(cx,cz){
 const R=mulberry32(rh(cx,cz,372)),x=cx*160+(R()-.5)*70,z=cz*160+(R()-.5)*70,bio=biomeAt(x,z);
 if(nearestCity(x,z).d<150||onRoad(roadSegs(x,z,1),x,z,26)||inWater244(x,z))return null;
 const rv=riverNear239(x,z),lk=lakeAt239(Math.round(x/CH),Math.round(z/CH));
 const shore=rv.d<riverWidth351(rv.b,z)/2+22||!!(lk&&Math.abs(Math.hypot(x-lk.x,z-lk.z)-lk.r)<22);
 const eligible=clans.filter(c=>c.bio.includes(bio)&&(!c.shore||shore));
 const clan=shore&&eligible.some(c=>c.shore)&&R()<.7?clans[2]:eligible[Math.floor(R()*eligible.length)];
 if(!clan)return null;return {id:cx+','+cz,x,z,clan,bio};
}
function ground(o,x,z,y=0){o.userData.terrainAbsolute245=true;o.position.set(x,terrH(x,z)+y,z);}
function spawn(p){
 if(camps.has(p.id))return camps.get(p.id);
 if(!worldFree(p.x,p.z,8))return null;
 const points=p.clan.ks.map((k,i)=>{const a=i/p.clan.ks.length*Math.PI*2;return {k,x:p.x+Math.sin(a)*4,z:p.z+Math.cos(a)*4}});
 if(points.some(q=>!worldFree(q.x,q.z,1.7)||inWater244(q.x,q.z)||onRoad(roadSegs(q.x,q.z,1),q.x,q.z,20)))return null;
 if(points.some(q=>KINDS[q.k]?.mon&&!MON.list[KINDS[q.k].mon]))return null;
 const c={...p,npcs:[],props:[],inter:[],talk:0};
 const g=new THREE.Group();ground(g,p.x,p.z);scene.add(g);c.props.push(g);
 for(let i=0;i<7;i++){const a=i/7*Math.PI*2,m=new THREE.Mesh(new THREE.DodecahedronGeometry(.3),toonS(0x655951));m.position.set(Math.sin(a)*1.1,.15,Math.cos(a)*1.1);g.add(m)}
 const fire=new THREE.Mesh(new THREE.ConeGeometry(.45,1.2,7),glowS(0xff8433,.8));fire.position.y=.65;g.add(fire);c.fire=fire;
 const tent=new THREE.Mesh(new THREE.ConeGeometry(2,2.8,4),toonS(c.clan.id==='manto'?0xddd8cb:0x947653));tent.position.set(-5,1.4,-4);tent.rotation.y=Math.PI/4;g.add(tent);const opening=new THREE.Mesh(new THREE.ConeGeometry(.7,1.8,3),toonS(0x30271e));opening.position.set(-5,.9,-2.57);opening.scale.z=.06;g.add(opening);
 if(c.clan.totem){const post=new THREE.Mesh(new THREE.CylinderGeometry(.24,.35,3,7),toonS(0x72513b));post.position.set(-1,1.5,-1);g.add(post);const mask=new THREE.Mesh(new THREE.DodecahedronGeometry(.6),toonS(0xd5ba7a));mask.position.set(-1,2.6,-1);g.add(mask)}
 /* v429 (Ian): barraca, fogueira e totem do acampamento têm colisão */if(window.Solid429)Solid429.prop(g,[{x:-5,z:-4,r:1.85},{x:0,z:0,r:.85},...(c.clan.totem?[{x:-1,z:-1,r:.45}]:[])]);
 const sign=makeCitySign(c.clan.n,'#e5c796',.5);ground(sign,p.x,p.z,3.7);scene.add(sign);c.props.push(sign);
 for(const [i,q] of points.entries()){
  let e;
  if(q.k==='human'){const cl=CLASSES[i%3],m=makeChibi({body:cl.body,hair:cl.hair,wep:cl.wep,gk:CLASS_GK[i%3],wcol:0xd8b878});e={m,x:q.x,z:q.z,face:0,name:c.clan.id==='velo'?'Pastor humano':'Aventureiro '+(i+1),maxhp:100,hp:100,r:.5};scene.add(m.root)}
  else {const K=KINDS[q.k];if(!K||K.variant||K.fendido)throw Error('Espécie base indisponível: '+q.k);e=mkEnemy(K,q.x,q.z,1,1,{noExpLoot:true});e.kind=q.k;enemies.splice(enemies.indexOf(e),1);}
  e.clan372=c;e.home372={x:q.x,z:q.z};e.friendly217=true;e.short=e.name;e.gone=false;e.t=0;FRIENDS217.push(e);ground(e.m.root,e.x,e.z);c.npcs.push(e);
  const it={type:'clan372',x:e.x,z:e.z,r:2.8,label:'F · '+(i===0?'FALAR · '+c.clan.n.toUpperCase():'CONVERSAR'),use:()=>{if(!duel)show(c,e,i)}};L.inter.push(it);c.inter.push(it);
 }
 camps.set(c.id,c);if(state().hostile?.[c.id])provoke(c);return c;
}
function remove(c){if(duel?.c===c)finishDuel(false);for(const e of c.npcs){e.gone=true;scene.remove(e.m.root);const ix=FRIENDS217.indexOf(e);if(ix>=0)FRIENDS217.splice(ix,1);const j=enemies.indexOf(e);if(j>=0)enemies.splice(j,1)}for(const g of c.props){scene.remove(g);g.traverse(o=>{if(o.geometry)o.geometry.dispose()})}L.inter=L.inter.filter(i=>!c.inter.includes(i));camps.delete(c.id)}
function say(c,e){if(c.hostile||corrupt(e))return;speech153(e,c.clan.line+(c.clan.id==='fogueira'?' Pista: '+clue(c.bio):''),c.clan.n);c.talk=12;}
function show(c,e,i=0){
 if(c.hostile||L.mode!=='world'||distance(player,e)>4)return;say(c,e);if(i)return;
 view=()=>show(c,e);const key=c.id,s=c.clan.service;
 let h='<div class="sysline">'+c.clan.line+'</div>';
 if(s==='duel'||c.clan.duel)h+=row('Duelo de Honra','Um contra um. Rendição a 20% de vida. Uma recompensa por acampamento por dia.',btn('Desafiar','clan372duel',key,!duel&&(!c.clan.duel||rankOf()>=5)));
 if(['supplies','water','forge','heal'].includes(s))h+=row('Trocas do clã','Produtos e provisões para a viagem.',btn('Negociar','clan372trade',key));
 if(['rest','supplies','shelter','heal'].includes(s))h+=row(s==='heal'?'Remédios naturais':'Descanso na fogueira',s==='heal'?'Remove veneno e cansaço.':'Recupera vida e mana fora de combate.',btn('Descansar','clan372rest',key));
 if(s==='bless')h+=row('Ritual de contenção','+15% de resistência ao dano mágico por 5 minutos.',btn('Receber bênção','clan372bless',key));
 if(s==='scout'||s==='shelter')h+=row('Fendas da região',s==='scout'?'Localização de uma Fenda rara: 100 ouro.':'Direção de uma Fenda glacial, sem custo.',btn('Pedir direção','clan372scout',key));
 openModal(c.clan.n,h);
}
const nearCamp=id=>{const c=camps.get(id);return c&&!c.hostile&&L.mode==='world'&&distance(player,c)<9?c:null};
function beginDuel(c){
 if(duel||player.dead||nearestEnemy(player.x,player.z,18))return false;
 if(c.clan.duel&&rankOf()<5)return false;
 const e=c.npcs[0];if(!e.kind)return false;
 closeModal();duel={c,e,hp:e.hp,maxhp:e.maxhp,dmg:e.dmg};e.hp=e.maxhp=Math.max(60,player.maxhp);e.dmg=Math.max(2,player.maxhp*.05);e.friendly217=false;e.duel372=true;e.aggro=true;e.cd=1;e.dead=false;enemies.push(e);toast('Duelo de Honra: rendição a 20% de vida. Afaste-se 25 m para desistir.');return true;
}
function finishDuel(won){
 if(!duel)return;const d=duel;duel=null;const e=d.e;
 enemies=enemies.filter(q=>q!==e);Object.assign(e,{friendly217:true,duel372:false,dead:false,act:null,dotT:0,stun:0,hp:d.hp,maxhp:d.maxhp,dmg:d.dmg,x:e.home372.x,z:e.home372.z});e.basicDots={};
 projs=projs.filter(p=>{if(p.team==='enemy'){scene.remove(p.mesh);return false}return true});
 speech153(e,won?'Sua força merece respeito. A honra é sua.':'Basta. Sua vida vale mais que uma disputa.',d.c.clan.n);
 if(won){const st=state(),day=gameDay198();if(st.wins[d.c.id]!==day){st.wins[d.c.id]=day;run.gold+=Math.round(100*GR[rankOf()].gold);if(d.c.clan.id==='brejo')run.clanRespect372=true;else st.attack=300;refreshStats();toast('Respeito conquistado. Ouro recebido'+(d.c.clan.id==='brejo'?' e lentidão do pântano reduzida pela metade.':' e +10% de ataque físico por 5 minutos.'));saveRun()}}
}
function scout(c){const rare=c.clan.service==='scout';const gs=gates.filter(g=>!g.dead&&!g.inv343&&(rare?(g.secret||g.red||g.giant||g.double):biomeAt(g.x,g.z)==='neve')).sort((a,b)=>distance(a,player)-distance(b,player));if(!gs.length){toast('Nenhuma Fenda '+(rare?'rara':'glacial')+' conhecida por perto.');return}if(rare&&run.gold<100){toast('Faltam 100 ouro.');return}const g=gs[0];if(rare)run.gold-=100;run.scout343={day:gameDay198(),marks:[{x:g.x,z:g.z,n:rare?'Fenda rara':'Fenda glacial',gate:g.id}]};const a=Math.atan2(g.x-player.x,-(g.z-player.z));speech153(c.npcs[0],Math.round(distance(g,player))+' m a '+['norte','nordeste','leste','sudeste','sul','sudoeste','oeste','noroeste'][(Math.round(a/(Math.PI/4))+8)%8]+'. Marquei no seu mapa.');saveRun()}
function restAt(c){if(duel||nearestEnemy(player.x,player.z,18)){toast('Afaste os inimigos antes de descansar.');return}player.hp=player.maxhp;player.mp=player.maxmp;run.awake287=0;if(c.clan.service==='heal'){player.bleedT=0;player.bleedD=0;player.dotT=0;player.poisonT=0;player.slowT=0;}refreshStats();saveRun();closeModal();speech153(c.npcs[0],'Descanse. Aqui você é bem-vindo.',c.clan.n)}
function sheltered(){return L.mode==='world'&&[...camps.values()].some(c=>c.clan.id==='manto'&&!c.hostile&&distance(c,player)<12)}
function clue(id){return clues[id]||'Explore o interior do bioma, longe das cidades.'}
/* Daily weighted stock, generated once from day + location; no affixes. */
const goods=[{id:'armor',n:'Armadura pesada',sl:'a',bio:['neve']},{id:'axe',n:'Machado',sl:'w',k:'axe',bio:['vulcao']},{id:'spear',n:'Lança',sl:'w',k:'spear',bio:['vulcao']},{id:'dagger',n:'Adagas',sl:'w',k:'dagger',bio:['pantano','floresta']},{id:'bow',n:'Arco',sl:'w',k:'bow',bio:['pantano','floresta']},{id:'catalyst',n:'Catalisador',sl:'w',k:'staff',bio:['cristal']},{id:'arcane',n:'Espada arcana',sl:'w',k:'sword',bio:['cristal']},{id:'potion',n:'Poção concentrada',bio:['pantano','floresta']},{id:'mana',n:'Anel de mana',bio:['cristal']}];
function weighted(R,list,bio){const weights=list.map(g=>g.bio.includes(bio)?4:1);let n=R()*weights.reduce((a,b)=>a+b,0);return list[weights.findIndex(w=>(n-=w)<0)]||list[list.length-1]}
function weapon(seed,bio){const list=WEAPON_LOOT_KINDS.map(k=>({k,bio:k==='axe'||k==='spear'?['vulcao']:k==='bow'||k==='dagger'?['pantano','floresta']:['staff','wand','tome','sword'].includes(k)?['cristal']:[]}));return weighted(mulberry32(seed),list,bio).k}
function stock(){const x=Math.round(player.x/CH),z=Math.round(player.z/CH),day=gameDay198(),bio=biomeAt(player.x,player.z),c=nearestCity(player.x,player.z),key=(c.d<150?c.c.id:x+','+z)+'|'+day;const R=mulberry32([...key].reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619),2166136261)),pool=goods.slice(),out=[];for(let i=0;i<3;i++){const g=weighted(R,pool,bio);out.push(g);pool.splice(pool.indexOf(g),1)}return {key,out,bio,t:clamp(rankOf(),0,9)}}
let offers=null;
function price(g,t){return g.sl?equipmentShopPrice(g.sl,t):Math.round((g.id==='mana'?250:35)*GR[t].gold)}
function rowsStock(){offers=stock();const {out,t,key}=offers;const sold=run.shop372||{},fixed=classShopKind290();let h='<div class="sec">ESPECIALIDADES REGIONAIS · '+BIO_N[offers.bio]+'</div><div class="sysline">Três ofertas por dia. Sem afixos; prioridade aos produtos deste bioma.</div>';const all=fixed?[{id:'fixed',n:'Arma da sua classe',sl:'w',k:fixed},...out]:out;all.forEach((g,i)=>{const done=g.id!=='fixed'&&sold[key+'|'+g.id];h+=row(g.n,g.id==='potion'?'Recupera 60% de vida ao usar.':g.id==='mana'?'Relíquia de viagem: +10% de regeneração de mana enquanto equipada.':('Ranque '+GR[t].id+' · '+(g.sl==='w'?'arma':'armadura')+' sem afixos'),btn(done?'Vendido':fmt(price(g,t))+' ouro','region372buy',i,!done&&run.gold>=price(g,t)))});offers.all=all;return h}
function buyOffer(i){if(!offers||!modalOpen)return;const current=stock();if(current.key!==offers.key)return;const g=offers.all[Number(i)];if(!g)return;const k=offers.key+'|'+g.id,sold=run.shop372||(run.shop372={}),p=price(g,offers.t);if(g.id!=='fixed'&&sold[k]||run.gold<p)return;if(g.sl&&!equipmentBagRoom())return;if(g.id==='mana'&&run.manaRing372){toast('Você já possui este anel.');return}run.gold-=p;if(g.sl){const it=makeItem(g.sl,offers.t,0,g.k);it.name=g.id==='fixed'?it.name:g.n+' '+TIERN[offers.t];it.purchasePaidBalance=p;addItem(it)}else if(g.id==='potion')run.pots372=(run.pots372||0)+1;else run.manaRing372={equipped:true};if(g.id!=='fixed')sold[k]=1;saveRun();toast('Comprado: '+g.n);closeModal()}
function trade(c){let h=rowsStock();if(c.clan.service==='water')h+=row('Peixe e ervas aquáticas','Provisões: remove cansaço e recupera 30% de vida.',btn('30 ouro','clan372food',c.id,run.gold>=30));if(c.clan.service==='forge')h+=row('Pistola da Escama','Arma física · disparo único · recarga automática de 1,2 s (agilidade reduz). Sem mana; munição básica ilimitada.',btn(fmt(equipmentShopPrice('w',rankOf()))+' ouro','clan372gun',c.id,run.gold>=equipmentShopPrice('w',rankOf())))+row('Minérios','3 núcleos do seu ranque para a forja.',btn('120 ouro','clan372ore',c.id,run.gold>=120));h+=row('Suprimentos básicos','Duas poções comuns.',btn('40 ouro','clan372pots',c.id,run.gold>=40));openModal(c.clan.n+' · Trocas',h)}
const oldMarket=mktView;mktView=function(){oldMarket();$('mb').insertAdjacentHTML('beforeend',rowsStock())};
const oldShop=openShop;openShop=function(id){oldShop(id);if(id==='pot')$('mb').insertAdjacentHTML('beforeend',rowsStock())};
const oldBag=bagView;bagView=function(...args){oldBag(...args);if(run.pots372)$('mb').insertAdjacentHTML('beforeend',row('Poções concentradas: '+run.pots372,'Recupera 60% da vida.',btn('Usar','pot372',0,player.hp<player.maxhp)));if(run.manaRing372)$('mb').insertAdjacentHTML('beforeend',row('Anel de mana','Relíquia de viagem · +10% de regeneração de mana.',btn(run.manaRing372.equipped?'Desequipar':'Equipar','ring372',0)))};
const oldAction=extraActions;extraActions=function(a,v){
 if(a==='region372buy'){buyOffer(v);return 'close0'}
 if(a==='ring372'&&run.manaRing372){run.manaRing372.equipped=!run.manaRing372.equipped;saveRun();bagView();return 'close0'}
 if(a==='pot372'){if(run.pots372>0&&!hasAff('nocure')&&!player.dead&&player.hp<player.maxhp){run.pots372--;player.hp=Math.min(player.maxhp,player.hp+player.maxhp*.6);saveRun()}bagView();return 'close0'}
 if(a.startsWith('clan372')){const c=nearCamp(v);if(!c)return 'close0';const allowed={clan372duel:c.clan.service==='duel'||c.clan.duel,clan372trade:['supplies','water','forge','heal'].includes(c.clan.service),clan372rest:['rest','supplies','shelter','heal'].includes(c.clan.service),clan372scout:['scout','shelter'].includes(c.clan.service),clan372bless:c.clan.service==='bless',clan372food:c.clan.service==='water',clan372ore:c.clan.service==='forge',clan372gun:c.clan.service==='forge',clan372pots:['supplies','water','forge','heal'].includes(c.clan.service)};if(!allowed[a])return 'close0';if(a==='clan372gun'){const p=equipmentShopPrice('w',rankOf());if(run.gold>=p&&equipmentBagRoom()){run.gold-=p;const it=makeItem('w',rankOf(),0,'firearm');it.purchasePaidBalance=p;addItem(it);saveRun();trade(c)}}else if(a==='clan372duel')beginDuel(c);else if(a==='clan372trade')trade(c);else if(a==='clan372rest')restAt(c);else if(a==='clan372scout')scout(c);else if(a==='clan372bless'){state().bless=300;saveRun();closeModal();speech153(c.npcs[0],'Seu espírito está protegido por cinco minutos.')}else{const p=a==='clan372food'?30:a==='clan372ore'?120:40;if(run.gold>=p){run.gold-=p;if(a==='clan372food'){run.awake287=0;player.hp=Math.min(player.maxhp,player.hp+player.maxhp*.3)}else if(a==='clan372ore')run.res.core[rankOf()]+=3;else run.pots+=2;saveRun();trade(c)}}return 'close0'}
 return oldAction(a,v);
};
const oldMana=pManaRegen281;pManaRegen281=function(){return (1+oldMana())*(run?.manaRing372?.equipped?1.1:1)-1};
const oldAtk=atkOf;atkOf=function(k){return oldAtk(k)*(k==='phy'&&run?.clans372?.attack>0?1.1:1)};
const oldHurt=hurtPlayer;hurtPlayer=function(amt,...args){if(duel&&curAtk!==duel.e)return;if(run?.clans372?.bless>0&&inDType281==='mag')amt*=.85;return oldHurt(amt,...args)};
const oldHit=hurtEnemy;hurtEnemy=function(e,amt,x,z,o={}){if(e?.duel372){if(!o.fromPlayer)return 0;const r=oldHit(e,Math.min(amt,e.hp),x,z,o);if(duel&&e.hp<=e.maxhp*.2)finishDuel(true);return r}return oldHit(e,amt,x,z,o)};
const oldKill=killEnemy;killEnemy=function(e){if(e?.duel372){e.hp=e.maxhp*.2;finishDuel(true);return}return oldKill(e)};
const oldTarget=pickTarget;pickTarget=function(e){return e.duel372?{t:player,d:distance(e,player)}:oldTarget(e)};
const oldDie=die;die=function(){if(duel){player.hp=Math.max(1,player.maxhp*.2);player.bleedT=0;finishDuel(false);return}dismount();return oldDie()};
const oldSpeech=speech153;speech153=function(e,...args){if(corrupt(e))return;return oldSpeech(e,...args)};
function provoke(c){if(c.hostile)return;c.hostile=true;const st=state();st.hostile=st.hostile||{};st.hostile[c.id]=1;for(const e of c.npcs){e.friendly217=false;e.aggro=true;if(!enemies.includes(e))enemies.push(e)}for(const it of c.inter)it.hidden=true;saveRun();toast('Os Yetis defendem os filhotes. O abrigo foi perdido.')}
const oldEnemy=updEnemy;updEnemy=function(e,dt){if(corrupt(e)&&!e.dead&&distance(e,player)<(e.range||10)+16&&los(e.x,e.z,player.x,player.z))e.aggro=true;const r=oldEnemy(e,dt);if(e.clan372&&!e.gone)ground(e.m.root,e.x,e.z);return r};
/* Ride is transient, never serialized; the regular save contains the last road position. */
/* v429 (Ian): embarcar e desembarcar viram uma cena curta — câmera de lado, o Viajante anda até a traseira e senta (ou levanta, desce e se afasta) e a carroça espera parada.
   Chegando à cidade de destino a carroça entra pelo portão, para na rua principal (Civic343) e o desembarque toca sozinho; ninguém cai mais da carroça no portão. */
const SEAT429=3.15,STEP429=4.35;let cut=null;
function riding(){return !!ride}
function rideWagon(){return ride}
function cutscene(){return cut}
function behind(w,d,side=0){const s=Math.sin(w.face),c=Math.cos(w.face);return {x:w.x-s*d+c*side,z:w.z-c*d-s*side}}
function sitPose(k){const b=player.m&&player.m.bones;if(!b||!(k>0))return;k=Math.min(1,k);for(const n of ['thigh_l','thigh_r'])if(b[n])b[n].rotation.x+=(-Math.PI/2-b[n].rotation.x)*k;for(const n of ['shin_l','shin_r'])if(b[n])b[n].rotation.x+=(Math.PI/2-b[n].rotation.x)*k}
function seat(w,k=1,p=behind(w,SEAT429)){player.x=p.x;player.z=p.z;player.face=w.face+Math.PI;player.jy=0;player.air344=false;player.m.root.position.set(p.x,.65*k,p.z);player.m.root.rotation.y=player.face;sitPose(k)}
function freeSpot(w){for(const [d,sd] of [[5.9,0],[4.8,2.6],[4.8,-2.6],[3,3],[3,-3]]){const q=behind(w,d,sd);if(worldFree(q.x,q.z,(player.r||.5)+.15))return q}return behind(w,5.9)}
function board(w){if(world!==L)tick(0);if(ride||cut||duel||w.gone||w.wreck||w.amb||w.arr429||distance(w,player)>5)return;setMount(false);if(!w.seat372){const seat=new THREE.Mesh(geo('ride-seat372',()=>new THREE.BoxGeometry(1.6,.14,.6)),toonS(0x68452e));seat.position.set(0,1.3,-3.05);w.g.add(seat);w.seat372=seat;}ride=w;rest=0;player.dodgeT=0;player.atkT=0;player.jy=0;player.air344=false;
 const step=behind(w,STEP429),walk=Math.hypot(step.x-player.x,step.z-player.z),side=Math.sign((player.x-w.x)*Math.cos(w.face)-(player.z-w.z)*Math.sin(w.face))||1;
 cut={kind:'board',w,t:0,from:{x:player.x,z:player.z},step,walkT:Math.min(1.6,Math.max(.3,walk/2.3)),side};cut.dur=cut.walkT+1.2;w.wait=Math.max(w.wait||0,cut.dur+.3);
 toast('Carona: F ou Espaço para desembarcar. +1% de vida/mana a cada 3 s.');closeModal()}
function dismount(now){if(!ride)return false;if(cut&&now!==true)return true;const w=ride;
 if(now===true||w.gone||w.wreck||L.mode!=='world'||player.dead){cut=null;ride=null;const q=freeSpot(w);player.x=q.x;player.z=q.z;player.jy=0;player.air344=false;player.m.root.position.set(player.x,0,player.z);saveRun();return true}
 cut={kind:'leave',w,t:0,delay:0,step:behind(w,STEP429),out:freeSpot(w),side:1};cut.dur=1.75;w.wait=Math.max(w.wait||0,cut.dur+.4);return true}
/* chamada pela Civic343 quando a carroça estaciona dentro da cidade */
function arrive429(w,c){if(ride!==w||cut||player.dead)return;cut={kind:'leave',w,t:0,delay:.7,step:behind(w,STEP429),out:freeSpot(w),side:1,arrive:c};cut.dur=cut.delay+1.75;try{speech153(w.n,pick(['Chegamos a '+c.name+'! Pode descer com calma.','Pronto, '+c.name+'. Boa estadia!','Chegamos. Cuidado ao descer.']),'Mercador')}catch(_){}}
function cutTick(dt){const w=ride,C=cut;C.t+=dt;const t=C.t,ease=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u)};C.walk=false;
 if(C.kind==='board'){
  if(t<C.walkT){const u=t/C.walkT,x=C.from.x+(C.step.x-C.from.x)*u,z=C.from.z+(C.step.z-C.from.z)*u;turnTo(player,Math.atan2(C.step.x-C.from.x,C.step.z-C.from.z),dt,10);player.x=x;player.z=z;player.m.root.position.set(x,0,z);player.m.root.rotation.y=player.face;C.walk=true}
  else if(t<C.walkT+.3){player.x=C.step.x;player.z=C.step.z;turnTo(player,w.face+Math.PI,dt,12);player.m.root.position.set(player.x,0,player.z);player.m.root.rotation.y=player.face}
  else if(t<C.dur){const u=ease((t-C.walkT-.3)/.9),p=behind(w,STEP429+(SEAT429-STEP429)*u);seat(w,u,p);player.m.root.position.y+=Math.sin(Math.PI*u)*.22}
  else{cut=null;seat(w,1)}
  return}
 const t0=C.delay||0;
 if(t<t0)seat(w,1);
 else if(t<t0+.8){const u=ease((t-t0)/.8),p=behind(w,SEAT429+(STEP429-SEAT429)*u);seat(w,1-u,p);player.m.root.position.y+=Math.sin(Math.PI*u)*.18}
 else if(t<t0+1.5){const u=ease((t-t0-.8)/.7),x=C.step.x+(C.out.x-C.step.x)*u,z=C.step.z+(C.out.z-C.step.z)*u;if(Math.hypot(C.out.x-C.step.x,C.out.z-C.step.z)>.2)turnTo(player,Math.atan2(C.out.x-C.step.x,C.out.z-C.step.z),dt,10);player.x=x;player.z=z;player.m.root.position.set(x,0,z);player.m.root.rotation.y=player.face;C.walk=true}
 else if(t<C.dur){player.x=C.out.x;player.z=C.out.z;player.m.root.position.set(player.x,0,player.z);player.m.root.rotation.y=player.face}
 else{cut=null;ride=null;player.x=C.out.x;player.z=C.out.z;player.jy=0;player.air344=false;player.m.root.position.set(player.x,0,player.z);saveRun();if(C.arrive)toast('<b>[CARROÇA]</b> Você chegou a <b>'+safeText(C.arrive.name)+'</b>. A carroça fica parada na rua principal por um tempo.',5000)}}
/* câmera de lado durante a cena; entra e sai suave por cima da câmera normal */
const cineCam429=new THREE.PerspectiveCamera(),camA429=new THREE.Vector3(),camB429=new THREE.Vector3();
const oldCam429=camUpdate;camUpdate=function(dt){oldCam429(dt);if(!cut||!ride||window.CINE231||L.mode!=='world')return;const w=cut.w,k=Math.min(1,cut.t/.45,(cut.dur-cut.t)/.45);if(!(k>0))return;const e=k*k*(3-2*k),T=behind(w,SEAT429+.5),s=Math.sin(w.face),c=Math.cos(w.face),sd=cut.side||1,hy=terrH(T.x,T.z);
 camA429.set(T.x+c*5.4*sd-s*3.8,hy+2.6,T.z-s*5.4*sd-c*3.8);camB429.set(T.x-s*.5,hy+1.05,T.z-c*.5);camera.position.lerp(camA429,e);cineCam429.position.copy(camA429);cineCam429.lookAt(camB429);camera.quaternion.slerp(cineCam429.quaternion,e)};
/* durante os passos da cena o Viajante usa a animação de andar de verdade */
if(window.Warrior127&&Warrior127.animate){const baseAnim429=Warrior127.animate;Warrior127.animate=function(m,st,t,dt){if(cut&&cut.walk&&player&&m===player.m)st=Object.assign({},st,{move:1,speed:2.3,sprint:false,atk:0,dodge:false,skill:null,hit:false});return baseAnim429.call(this,m,st,t,dt)}}
const oldCtx=ctxTarget;ctxTarget=function(){if(ride)return cut?null:{label:'F · DESEMBARCAR',use:()=>dismount()};const c=oldCtx();if(c)return c;if(L.mode==='world'&&player&&!player.dead){const w=Civic343.wagons.find(w=>!w.gone&&!w.wreck&&!w.amb&&!w.arr429&&distance(w,player)<5);if(w)return {label:'F · PEGAR CARONA',use:()=>board(w)}}return null};
const oldJump=jump343;jump343=function(){if(ride){if(!cut)dismount();return}return oldJump()};
// Neutral cubs still receive a real player-projectile hit before the family joins combat.
const oldProjectiles=updateProjectiles253;updateProjectiles253=function(dt){for(const p of projs){if(p.team!=='player'||p.life<=0)continue;const a={x:p.x,y:p.y??p.originY??1.1,z:p.z},b={x:p.x+p.vx*dt,y:(p.y??p.originY??1.1)+(p.vy||0)*dt,z:p.z+p.vz*dt},ground=Projectiles253.terrainHit(a,b,terrH);for(const c of camps.values()){if(c.hostile||c.clan.id!=='manto')continue;for(const e of c.npcs){if(e.kind!=='yetinho')continue;const body=projectileBody253(e),hit=Projectiles253.segmentCapsule(a,b,body,body.r+p.r,body.hitHeight);if(hit.hit&&hit.t<(ground?.t??1)&&worldFree(hit.p.x,hit.p.z,.1,hit.p.y)){provoke(c);break}}}}return oldProjectiles(dt)};
const oldAttack=attack;attack=function(){if(ride)return;if(!paused&&!player.dead&&player.atkCd<=0){for(const c of camps.values()){if(c.clan.id!=='manto'||c.hostile)continue;const cub=c.npcs.find(e=>e.kind==='yetinho'&&distance(e,player)<3&&Math.abs(Math.atan2(Math.sin(Math.atan2(e.x-player.x,e.z-player.z)-player.face),Math.cos(Math.atan2(e.x-player.x,e.z-player.z)-player.face)))<.8);if(cub)provoke(c);}}return oldAttack()};
const oldDodge=dodge;dodge=function(){if(!ride)return oldDodge()};
const oldSkill=useSkill;useSkill=function(...args){if(!ride)return oldSkill(...args)};
function tick(dt){
 if(!run||!player)return;if(L.mode==='dungeon'&&L.bossDead&&L.gate?.inv343&&!L.gate.closed372)invasionWon(L.gate);
 if(world!==L){for(const c of [...camps.values()])remove(c);world=L;scan=0;if(ride)dismount(true)}
 if(L.mode!=='world'||player.dead)return;
 const st=state();if(st.attack>0){st.attack=Math.max(0,st.attack-dt);if(!st.attack)refreshStats()}st.bless=Math.max(0,st.bless-dt);
 scan-=dt;if(scan<=0){scan=1;for(const c of [...camps.values()])if(distance(c,player)>360)remove(c);const cx=Math.round(player.x/160),cz=Math.round(player.z/160);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const p=site(cx+i,cz+j);if(p&&distance(p,player)<235&&camps.size<8)spawn(p)}}
 for(const c of camps.values()){c.talk-=dt;if(c.clan.patrol){c.guard372=(c.guard372||0)-dt;const foe=c.guard372<=0&&enemies.find(e=>!e.dead&&!e.duel372&&!e.clan372&&e.aggro&&distance(e,c)<14);if(foe){c.guard372=2;const guard=c.npcs[0];guard.attack372=.4;fxLine([{x:guard.x,z:guard.z},{x:foe.x,z:foe.z}],0xffd080);hurtEnemy(foe,Math.max(5,foe.maxhp*.04),guard.x,guard.z,{guard343:true,kb:0});}}c.fire.scale.y=1+Math.sin(time*7)*.1;for(const [i,e] of c.npcs.entries()){if(e.duel372||c.hostile)continue;e.t+=dt;e.attack372=Math.max(0,(e.attack372||0)-dt);let move=0;if((c.clan.patrol||c.clan.train)&&i>0){const t=e.t*.3,x=e.home372.x+Math.sin(t)*1.5,z=e.home372.z+Math.cos(t)*1.5;if(worldFree(x,z,e.r)){e.face=Math.atan2(x-e.x,z-e.z);e.x=x;e.z=z;move=.35}}else e.face=Math.atan2(player.x-e.x,player.z-e.z);animChibi(e.m,{move,atk:e.attack372>0?.5:c.clan.train&&i>0?Math.max(0,Math.sin(e.t*2)):0,dead:0,wind:0},time);ground(e.m.root,e.x,e.z);e.m.root.rotation.y=e.face;c.inter[i].x=e.x;c.inter[i].z=e.z;}if(c.talk<=0&&distance(c,player)<10&&!duel&&player.atkT<=0&&player.atkCd<=0)say(c,c.npcs[0]);}
 if(duel&&(distance(duel.c,player)>25||!enemies.includes(duel.e)))finishDuel(false);
 if(ride){if(ride.gone||ride.wreck||ride.amb){dismount(true);return}const w=ride;if(cut&&cut.w!==w)cut=null;if(cut)cutTick(dt);else seat(w,1);rest+=dt;while(rest>=3){rest-=3;player.hp=Math.min(player.maxhp,player.hp+player.maxhp*.01);player.mp=Math.min(player.maxmp,player.mp+player.maxmp*.01)}}
}
const oldUpdate=update;update=function(dt){oldUpdate(dt);tick(dt)};
function invasionWon(g){if(!g.inv343||g.closed372)return;if(run.invReturn372)run.invReturn372.open=false;saveRun();if(store.get('pds3_run')?.invReturn372?.open!==false||store.get('pds3_run')?.invReturn372?.token!==run.invReturn372?.token){if(run.invReturn372)run.invReturn372.open=true;return;}Civic343.riftClosed(g);saveRun();}
return {clans,camps,site,nearbySites,spawn,tick,clue,weapon,sheltered,riding,rideWagon,cutscene,arrive429,invasionWon,beginDuel,finishDuel,board,dismount,stock,goods,corrupt,show,provoke};
})();
