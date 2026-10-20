/* ================= MASMORRA PROCEDURAL ================= */
function buildDungeon(g){
  retireExtraction117(g);clearLevel();
  const th=dungeonTheme124(g),G={...GR[g.rank],th},R=mulberry32(g.seed);
  const variant=expeditionType(g),CS=2;let Wd,Hd,cells,rooms,bi;
  /* v460 (Ian): a Fenda comum vira OUTRO MUNDO aberto (tools/otherworld460.js) em vez de salas e corredores */
  const ow456=pickOtherworld456(g,th),ow460=window.OW460&&OW460.applies(g,variant)?OW460.layout(g,R,variant,ow456.id):null;
  if(ow460){Wd=ow460.W;Hd=ow460.H;cells=ow460.cells;rooms=ow460.rooms;bi=ow460.bi}else if(['core','floors'].includes(variant)){const v=variantLayout103(variant,R);Wd=v.W;Hd=v.H;cells=v.cells;rooms=v.rooms;bi=v.bi}else{
  Wd=G.size;Hd=G.size;cells=new Uint8Array(Wd*Hd);
  rooms=[];let tries=0;
  while(rooms.length<(g.rooms||G.rooms)&&tries++<1200){const w=6+Math.floor(R()*6),h=6+Math.floor(R()*6),x=2+Math.floor(R()*(Wd-w-4)),y=2+Math.floor(R()*(Hd-h-4));if(rooms.some(r=>x<r.x+r.w+2&&x+w+2>r.x&&y<r.y+r.h+2&&y+h+2>r.y))continue;rooms.push({x,y,w,h})}
  const carve=(x,y)=>{if(x>0&&y>0&&x<Wd-1&&y<Hd-1)cells[y*Wd+x]=1};
  const cen=r=>({x:Math.floor(r.x+r.w/2),y:Math.floor(r.y+r.h/2)});
  if(rooms.length<2)rooms.push({x:2,y:2,w:6,h:6});const c0=cen(rooms[0]);bi=1;let bd=-1;rooms.forEach((r,i)=>{const c=cen(r),d=Math.hypot(c.x-c0.x,c.y-c0.y);if(d>bd){bd=d;bi=i}});
  const br=rooms[bi];br.x=Math.max(1,br.x-2);br.y=Math.max(1,br.y-2);br.w=Math.min(Wd-2-br.x,br.w+4);br.h=Math.min(Hd-2-br.y,br.h+4);
  for(const r of rooms)for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)carve(x,y);
  const corr=(a,b)=>{const A=cen(a),B=cen(b);const hl=(x1,x2,y)=>{for(let x=Math.min(x1,x2);x<=Math.max(x1,x2)+1;x++){carve(x,y);carve(x,y+1)}};const vl=(y1,y2,x)=>{for(let y=Math.min(y1,y2);y<=Math.max(y1,y2)+1;y++){carve(x,y);carve(x+1,y)}};if(R()<.5){hl(A.x,B.x,A.y);vl(A.y,B.y,B.x)}else{vl(A.y,B.y,A.x);hl(A.x,B.x,B.y)}};
  for(let i=1;i<rooms.length;i++){let j=0,jd=1e9;for(let k=0;k<i;k++){const a=cen(rooms[i]),b=cen(rooms[k]),d=Math.hypot(a.x-b.x,a.y-b.y);if(d<jd){jd=d;j=k}}corr(rooms[i],rooms[j])}
  for(let k=0;k<2;k++){const a=rooms[Math.floor(R()*rooms.length)],b=rooms[Math.floor(R()*rooms.length)];if(a!==b)corr(a,b)}
  rooms.forEach((r,i)=>{if(i===0||i===bi||r.w<9||r.h<9)return;for(const [px,py] of[[r.x+2,r.y+2],[r.x+r.w-3,r.y+2],[r.x+2,r.y+r.h-3],[r.x+r.w-3,r.y+r.h-3]])cells[py*Wd+px]=2});
  }
  const ox=-Wd*CS/2,oz=-Hd*CS/2,br=rooms[bi],cen=r=>({x:Math.floor(r.x+r.w/2),y:Math.floor(r.y+r.h/2)});
  L={mode:'dungeon',group:new THREE.Group(),inter:[],grid:{cells,W:Wd,H:Hd,CS,ox,oz},rooms,visited:ow460?ow460.visited:new Uint8Array(Wd*Hd),/* v461: o Outro Mundo é infinito — grade e mapa explorado virtuais */seen:new Set(),bossRoom:bi,gate:g,G,bossDead:false,markT:0,exits:[],ow460:ow460?ow460.st:null,otherworld456:ow456,riftDays456:1,riftSignals456:0,riftSignalsMax456:3};scene.add(L.group);
  scene.background=new THREE.Color(ow456.skyCol);scene.fog=new THREE.FogExp2(ow456.fogCol,.016);
  hemi.color.setHex(ow456.lightCol);hemi.intensity=.85;sun.color.setHex(ow456.moonCol);sun.intensity=.78;pLight.color.setHex(0xffd9a8);pLight.intensity=1.6;pLight.distance=22;L.cave155=true;
  if(L.ow460)OW460.render(g,R,ow456);else{renderGrid(cells,Wd,Hd,CS,ox,oz,th,R,true,.06);if(ENV.ok&&!th.natural124)envDunProps(rooms,cells,Wd,Hd,CS,ox,oz,th,R,bi,g.rank)}
  const cellPos=(cx,cy)=>({x:ox+(cx+.5)*CS,z:oz+(cy+.5)*CS});
  const randIn=r=>{for(let t=0;t<40;t++){const cx=r.x+1+Math.floor(R()*(r.w-2)),cy=r.y+1+Math.floor(R()*(r.h-2));if(cells[cy*Wd+cx]===1)return cellPos(cx,cy)}const c=cen(r);return cellPos(c.x,c.y)};
  rooms.forEach((r,i)=>{r.i=i;const c=cellPos(cen(r).x,cen(r).y);r.wx=c.x;r.wz=c.z});
  const KW=dungeonPool124(g);habitatProps124(rooms,g,R);let goblinIndex118=0;
  const redM=g.red?1.3:1;
  const mids=rooms.map((r,i)=>i).filter(i=>i!==0&&i!==bi&&!rooms[i].entry);if(mids.length<2&&!['core','floors','combat','extract'].includes(variant))g.expType='standard';
  // monstros
  for(const i of (g.extractionCleared117?[]:mids)){const r=rooms[i];const n=clamp(Math.round(r.w*r.h/22*G.dens*1.6),3,12);let first=null;
    for(let k=0;k<n;k++){const kind=goblinDungeon118(g)&&goblinIndex118<5?KW[goblinIndex118++].k:wpick(KW).k;const reps=kind==='minion'?2:1;for(let q=0;q<reps;q++){const p=randIn(r);const e=spawnKind(kind,p.x,p.z,g.rank,{room:i});e.hp*=redM;e.maxhp*=redM;if(!first)first=e}}
    if(first&&R()<.3+Math.max(0,g.rank-5)*.25)makeElite(first)}
  // caçadores dentro
  const RR=mulberry32(g.seed+99);g.hostile=!goblinDungeon118(g)&&!g.extractionCleared117&&variant!=='core'&&RR()<.3+g.rank*.08;g.friends=!goblinDungeon118(g)&&!g.extractionCleared117&&!['core','floors'].includes(variant)&&RR()<.3;
  if(g.hostile&&mids.length>1){const i=mids[Math.floor(R()*mids.length)];const r=rooms[i];const n=2+(R()<.5?1:0);const grp='hg'+g.id;for(let k=0;k<n;k++){const p=randIn(r);spawnRival(p.x,p.z,g.rank,{room:i,group:grp})}rooms[i].hostile=true}
  if(g.friends&&mids.length>2){const i=mids[Math.floor(R()*mids.length)];const r=rooms[i];for(let k=0;k<2;k++){const p=randIn(r);const pr=Math.min(TOPR,g.rank+(Math.random()<.3?1:0));makeHunterAlly({name:pick(NAMES),cls:Math.floor(Math.random()*7),rank:pr,lvl:Math.max(1,GR[g.rank].lvl+Math.floor(rnd(0,8))),hair:pick([0x222222,0xc85a1e,0xe8e8ff])},p.x,p.z,true).room=i}rooms[i].friends=true}
  // baús
  if(variant==='floors'){for(const r of rooms.filter(r=>r.floorEnd&&r.floor<2))addChest(r.wx+1.5,r.wz,g.rank,false,{room:r.i,depth:r.floor})}
  const chestN=g.extractionCleared117||variant==='floors'?0:1+(rooms.length>8?1:0)+(g.red?1:0);const used=new Set();
  for(let k=0;k<chestN&&k<mids.length;k++){let i;let t=0;do{i=mids[Math.floor(R()*mids.length)]}while(used.has(i)&&t++<20);used.add(i);const r=rooms[i];addChest(r.wx+(R()<.5?1.5:-1.5),r.wz,g.rank,false)}
  // guardião
  const B=dungeonBoss124(g);if(variant==='combat'){L.combat117={boss:B,targets:enemies.filter(e=>!e.dead&&!e.isBoss),spawned:false};for(const e of L.combat117.targets)e.combatTarget117=true;}else if(!['core','extract'].includes(variant)){const b=spawnBoss(br.wx,br.wz,g.rank,B);b.room=bi;b.hp*=redM;b.maxhp*=redM;}
  // veios de cristal
  for(const i of (g.extractionCleared117?[]:mids)){if(R()<.55){const r=rooms[i];const p=randIn(r);addVein(p.x,p.z,g.rank,3+Math.floor(R()*3),th.trim)}}
  // afixos
  const af=g.aff||[];if(af.length){for(const e of enemies){if(af.includes('armor')){e.hp*=1.5;e.maxhp*=1.5}if(af.includes('frenzy'))e.speed*=1.3;if(af.includes('expl'))e.expl=true;if(af.includes('vamp'))e.vamp183=true;if(af.includes('elite')&&!e.isBoss&&!e.elite&&Math.random()<.25)makeElite(e);if(af.includes('rage')&&e.isBoss){const nb=(e.bars||3)+1;e.hp*=nb/(nb-1);e.maxhp*=nb/(nb-1);e.bars=nb;e.dmg*=1.3}e.gold*=1+.5*af.length;e.xp*=1+.25*af.length}if(af.includes('dark')){scene.fog.density=.035;if((run.lamps||0)>0){run.lamps--;useLamp()}else setTimeout(()=>toast('<b>[NARRADOR]</b> Masmorra com <b>Escuridão</b>. Um <b>Lampião Mágico</b> (loja de Poções) ilumina o caminho.',6000),1500)}}
  // saída
  const en=rooms[0];if(!L.ow460){let ez=en.wz-3.5;for(let k=0;k<8&&!freeAt(en.wx,ez,1.2);k++)ez+=.5;exitPortal(en.wx,ez,g.red)}
  if(variant==='core')setupCoreDefense();else if(variant==='floors'){if(!L.ow460)setupDungeonFloors()}else if(variant!=='combat')setupExpedition(g,mids);
  setupOtherworld456(g,rooms,bi,mids,R,randIn);
  player.x=en.wx;player.z=en.wz+1.5;player.face=Math.PI;if(L.ow460)OW460.arrive();if(g.extractionCleared117){L.bossDead=true;beginDungeonEscape()}else if(variant==='combat')updateCombat117();
}
/* Portais de expedição: estado ligado à instância, carga separada da bolsa. */
const EXP_TYPES={core:{n:'Defesa de Núcleo',d:'Siga o feixe até o Núcleo e inicie a defesa. Proteja-o por 60 segundos e elimine as quatro ondas. Se for destruído, a expedição falha e começa o transbordo. Em uma Fenda normal, você pode desistir pelo portal de retorno.'},floors:{n:'Expedição em Três Zonas',d:'Baús garantidos: Raro na Zona 1, Épico na Zona 2 e Lendário no Soberano, ou melhores. Vença os defensores para abrir cada baú. Equipamentos da Zona 2 e do Soberano recebem, respectivamente, +25% e +50% de ataque ou escudo.'},rupture:{n:'Ruptura',d:'Três focos fortalecem o guardião. Destrua após enfrentar os defensores, purifique mantendo a posição ou vença o chefe com os focos ativos para obter mais essências.'},hunt:{n:'Caçada',d:'Uma criatura percorre os ermos do Outro Mundo e recua para seus ninhos. Destrua os ninhos, recolha isca e prepare uma coluna para interrompê-la. Preparar a luta mantém a recompensa normal.'},combat:{n:'Combate',d:'Derrote os inimigos para despertar o guardião.'},extract:{n:'Extração',d:'Recolha materiais e envie 6 espaços de carga pela torre.'}};
const EXP_MATS={ward:{n:'Essência de Proteção',rune:'ward',v:80},echo:{n:'Essência de Duplicação',rune:'reprise',v:100},storm:{n:'Essência de Assalto',rune:'arcane',v:80},fang:{n:'Presa do Predador',rune:'fang',v:70},stalker:{n:'Glândula do Caçador',rune:'stalker',v:100},ore:{n:'Minério de Ressonância',rune:'shell',v:35,w:1},core:{n:'Núcleo Estável',rune:'vigor',v:70,w:2},heart:{n:'Coração de Cristal',rune:'arcane',v:140,w:3}};
const EXP_FOCI=[{id:'ward',n:'Proteção',d:'Aliados do foco próximos recebem 40% menos dano. No chefe: escudo de 6% da vida máxima por foco, renovado a cada 16s.',c:0x70ddff},{id:'echo',n:'Duplicação',d:'Cria cópias frágeis na sala. No chefe: duas cópias por ativação, com limite de quatro vivas.',c:0xb98cff},{id:'storm',n:'Assalto',d:'Projeta impactos em linha na sala. No chefe: as linhas aparecem pouco antes do impacto, sem bloquear a arena inteira.',c:0xff8750}];
function expeditionType(g){if(g?.missionExtract117===true)return 'extract';if(!g||g.secret||g.inverse||g.time||g.giant||g.custom||g.double)return null;if(g.expType==='extract'||g.expState?.type==='extract')return 'combat';if(g.expType==='standard')return null;if(EXP_TYPES[g.expType])return g.expType;if(['core','floors'].includes(g.layout103))return g.layout103;const r=mulberry32((g.seed^0x716af)>>>0)();return r<.25?null:r<.5?'rupture':r<.75?'hunt':'combat'}
function retireExtraction117(g){if(g.missionExtract117===true)return false;const s=g.expState;if(g.expType!=='extract'&&s?.type!=='extract')return false;g.expType='combat';g.red=false;g.double=false;g.extractionCleared117=!!(g.extractionCleared117||s?.completed||s?.sent>=6);if(s?.type==='extract'){g.retiredExtraction117={sent:Math.max(0,s.sent||0),completed:g.extractionCleared117};delete g.expState}return true}
function combatRemaining117(){return (L.combat117?.targets||[]).filter(e=>!e.dead&&!e.gone)}
function updateCombat117(){const c=L.combat117;if(!c||c.spawned||L.bossDead||L.brk||player.dead||combatRemaining117().length)return false;c.spawned=true;const g=L.gate,r=L.rooms[L.bossRoom],b=spawnBoss(r.wx,r.wz,g.rank,c.boss);b.room=L.bossRoom;const af=g.aff||[],hp=(g.red?1.3:1)*(af.includes('armor')?1.5:1);b.hp*=hp;b.maxhp*=hp;if(af.includes('frenzy'))b.speed*=1.3;if(af.includes('expl'))b.expl=true;b.gold*=1+.5*af.length;if(g.giant)b.gold*=3;fxRing(b.x,b.z,0xffd070,4,.8);bigText('O GUARDIÃO DESPERTOU',1600);return true}
function combatObjective117(){if(L.bossDead)return 'Objetivo concluído · volte à saída · '+fmtT(L.closeT);const c=L.combat117;if(c.spawned)return 'Derrote o Soberano';return 'Inimigos restantes: '+combatRemaining117().length+' · depois, o guardião'}
function expState(g){if(['core','floors','combat'].includes(expeditionType(g)))return null;if(g.expState)return g.expState;const type=expeditionType(g);if(!type)return null;const R=mulberry32(g.seed^0x33a7);return g.expState={type,foci:Array.from({length:3},(_,i)=>({kind:i===2?Math.floor(R()*3):(Math.floor(R()*3)+i)%3,status:'active'})),nests:[false,false],bait:false,baitTaken:false,traps:[false,false],trapSpent:[false,false],species:R()<.5?0:1,retreats:0,rewarded:false,cargo:[],sent:0,instability:0,deposits:Array(9).fill(2)}}
function extractionInteract117(kind,index){const ex=L.expedition;if(!ex||ex.s.completed)return false;if(ex.challenge){toast('Defenda a torre até concluir o envio.');return false}if(kind==='deposit'){const key=['ore','core','heart'][index%3];if(expCargoWeight(ex.s)+EXP_MATS[key].w>12){toast('Carga cheia. Envie na torre verde.');return false}return expAction(kind,index,'collect')}if(kind==='beacon'){if(!ex.s.cargo.length){toast('Recolha materiais antes de enviar.');return false}return expAction(kind,index,'send')}return false}
function finishExtraction117(){const ex=L.expedition;if(!ex||ex.s.completed)return false;ex.s.completed=true;L.bossDead=true;L.closeT=999999;unlockDungeonExit();if(L.gate.missionExtract117&&run.extractMission117)run.extractMission117.completed=true;for(const n of ex.nodes){n.hidden=true;n.grp.visible=false}for(const e of enemies){if(e.dead)continue;e.dead=true;e.gone=true;e.act=null;scene.remove(e.m.root)}for(const h of hazards)scene.remove(h.g);hazards=[];for(const p of projs)scene.remove(p.mesh);projs=[];bigText('MISSÃO CONCLUÍDA',1800);toast('Carga enviada. Volte à Ordem para receber.');return true}
function extractionOffer117(){const rank=Math.min(9,rankOf()),q={rank,repRank97:rank,sent:0,completed:false,rw:Math.round(120*GR[rank].gold)};questBudget262(q,'extract');return q}
function extractionMissionRow117(){const q=run.extractMission117||extractionOffer117();return row('Extração · missão opcional',(q.completed?'Concluída':q.sent?'Enviada '+q.sent+'/6':'Recolha e envie 6 espaços de carga')+' · '+questXpText262(q,'extract')+' · '+fmt(q.rw)+' ouro + '+questOrderRep(q)+' reputação',btn(q.completed?'RECEBER':run.extractMission117?'Retomar missão':'Iniciar missão',q.completed?'extractclaim117':'extractstart117',0,true,q.completed?'hot':''))}
function startExtractionMission117(){if(L.mode!=='world'||player.dead||!inCity(player.x,player.z))return false;const q=run.extractMission117||(run.extractMission117=extractionOffer117());if(q.completed)return false;q.seed=q.seed||Math.floor(Math.random()*2147483646)+1;run.trackObj='extract117';saveRun();const g={id:++gateSeq,seed:q.seed,x:player.x,z:player.z,rank:q.rank,aff:[],rooms:6,red:false,double:false,life:600,expType:'extract',missionExtract117:true};enterGate(g);return true}
function claimExtractionMission117(){const q=run.extractMission117;if(!q?.completed||q.claimed262||L.mode!=='world'||player.dead||!inCity(player.x,player.z))return false;const gold=Math.round(Math.min(q.rw,120*GR[Math.min(9,q.rank)].gold)*(1+.05*affL('Lyra'))),rep=questOrderRep(q),baseXp=questBudget262(q,'extract').xp;q.claimed262=true;delete run.extractMission117;if(run.trackObj==='extract117')run.trackObj=null;run.gold+=gold;profile.guildClaims=(profile.guildClaims||0)+1;addOrderRep(rep,'Missão de extração');const xp=gainXp(baseXp,'quest');toast('Recompensa: +'+xpNumber(xp)+' XP · +'+fmt(gold)+' ouro · +'+rep+' reputação');saveRun();return true}
function expReward(key,n,persist=true){const m=EXP_MATS[key];if(!m||n<=0)return;run.loot=run.loot||{};const r=run.loot[m.n]||(run.loot[m.n]={n:0,v:m.v,b:false,rune:m.rune,recipeParts:3});r.n+=n;r.rune=m.rune;r.recipeParts=3;toast('+'+n+' '+m.n);if(persist)saveRun()}
function expRecipe(key){const m=EXP_MATS[key];return m.n+' → '+GEAR_RUNES[m.rune].n+': '+GEAR_RUNES[m.rune].d+' (3 materiais por inscrição, mais ouro e cristais).'}
function expCargoWeight(s){return s.cargo.reduce((n,k)=>n+EXP_MATS[k].w,0)}
function expStage(s){return Math.min(3,Math.floor(s.instability/4))}
function expPoint(room,offset=0){const r=L.rooms[room];const choices=[[offset,0],[0,0],[2,2],[-2,-2],[3,-2],[-3,2]];for(const [dx,dz] of choices)if(freeAt(r.wx+dx,r.wz+dz,.8))return{x:r.wx+dx,z:r.wz+dz};return{x:r.wx,z:r.wz}}
function expNode(kind,index,room,label,color){let p=expPoint(room,kind==='beacon'?-3:2);const rr=L.rooms[room],G=L.grid;for(let y=rr.y+1;y<rr.y+rr.h-1;y++){let found=false;for(let x=rr.x+1;x<rr.x+rr.w-1;x++){const q={x:G.ox+(x+.5)*G.CS,z:G.oz+(y+.5)*G.CS};if(freeAt(q.x,q.z,.8)&&L.expedition.nodes.every(n=>Math.hypot(n.x-q.x,n.z-q.z)>2.7)){p=q;found=true;break}}if(found)break}const g=new THREE.Group(),base=mesh(geo('expBase',()=>new THREE.CylinderGeometry(.7,.95,.45,7)),toonS(0x51485b));base.position.y=.22;g.add(base);const shape=mesh(kind==='beacon'?geo('expTransmitter113',()=>new THREE.CylinderGeometry(.35,.6,2.6,6)):kind==='nest'?geo('expNest',()=>new THREE.TorusGeometry(.7,.25,5,8)):kind==='trap'?geo('expColumn',()=>new THREE.BoxGeometry(.6,2.3,.6)):geo('expCrystal',()=>new THREE.OctahedronGeometry(.6)),glowS(color,.65));shape.position.y=kind==='trap'||kind==='beacon'?1.4:.95;if(kind==='nest')shape.rotation.x=Math.PI/2;g.add(shape);if(kind==='beacon'){const ring=new THREE.Mesh(new THREE.RingGeometry(5.9,6,48),glowS(color,.8));ring.rotation.x=-Math.PI/2;ring.position.y=.08;g.add(ring);const label=makeSign('ENVIAR CARGA','#7cf4d2',.5);label.position.y=3.4;g.add(label)}g.position.set(p.x,0,p.z);L.group.add(g);const it={type:'expedition',kind,index,room,...p,r:3,label:'F · '+label,grp:g,use:()=>L.gate.missionExtract117?extractionInteract117(kind,index):expView(kind,index)};L.inter.push(it);L.expedition.nodes.push(it);return it}
function setupExpedition(g,mids){const s=expState(g);if(!s||(mids.length<2&&s.type!=='extract'))return;const ex=L.expedition={s,nodes:[],timer:3,routeT:0,challenge:null,patrol:0,lastCast:0};const rooms=(mids.length?mids:[L.bossRoom]).slice().sort((a,b)=>((a*17+g.seed)%37)-((b*17+g.seed)%37));
 if(s.type==='rupture'){s.foci.forEach((f,i)=>{const cfg=EXP_FOCI[f.kind],node=expNode('focus',i,rooms[i%rooms.length],'FOCO DE '+cfg.n.toUpperCase(),cfg.c);f.room=node.room;node.hidden=f.status!=='active';node.grp.visible=!node.hidden});if(bossE){bossE.mech=null;bossE.expBoss=true}}
 if(s.type==='hunt'){for(let i=0;i<2;i++){const node=expNode('nest',i,rooms[i],'DESTRUIR NINHO',0xe4a36e);node.hidden=s.nests[i];node.grp.visible=!node.hidden}expNode('bait',0,rooms[rooms.length-1],'RECOLHER ISCA',0xb8eb85);for(let i=0;i<2;i++)expNode('trap',i,rooms[(i+2)%rooms.length],'PREPARAR ARENA',0xe5c485);if(bossE){bossE.mech=null;bossE.expBoss=true;bossE.name=s.species?'Devorador de Mana':'Predador da Fenda';bossE.r=.7;bossE.speed=4.2;bossE.room=-1;bossE.aggro=false;ex.homeHp=bossE.hp;ex.target=expPoint(rooms[0]);ex.patrolRooms=rooms}}

 if(s.type==='extract'){s.cargo=[];s.sent=run.extractMission117?.sent||0;for(let i=0;i<9;i++)expNode('deposit',i,rooms[i%rooms.length],'RECOLHER MATERIAL',[0x8dddc8,0x77baff,0xe8a4ff][i%3]);expNode('beacon',0,0,'ENVIAR CARGA',0x7cf4d2);}
 toast(s.type==='extract'?'Recolha materiais e leve à torre verde.':s.type==='hunt'?'Encontre e derrote a criatura.':'Derrote o guardião. Os focos o fortalecem.',3500);
}
function expNear(kind,index){const ex=L.expedition;if(!ex||L.special||player.dead)return null;const n=ex.nodes.find(x=>x.kind===kind&&x.index===index&&!x.hidden);return n&&Math.hypot(n.x-player.x,n.z-player.z)<=n.r+.2?n:null}
function expRoomAlive(room){return enemies.filter(e=>!e.dead&&!e.isBoss&&e.room===room).length}
function expSpawn(x,z,n,tag,room){const out=[];for(let i=0;i<n;i++){let px=x+Math.sin(i*2.4)*5,pz=z+Math.cos(i*2.4)*5;if(!freeAt(px,pz,.7)){px=x;pz=z}const e=spawnKind(wpick(activeDungeonPool124(L.gate.rank)).k,px,pz,L.gate.rank,{room});e.expTag=tag;e.aggro=true;out.push(e)}return out}
function expLine(x,z,dmg,col){const a=Math.atan2(player.x-x,player.z-z);for(let i=1;i<=5;i++){const px=x+Math.sin(a)*i*2,pz=z+Math.cos(a)*i*2;if(freeAt(px,pz,.4))expHazard(px,pz,1.05,1.2,dmg,'enemy',col)}}
function expView(kind,index){if(L.gate.missionExtract117)return extractionInteract117(kind,index);const node=expNear(kind,index);if(!node)return;const ex=L.expedition,s=ex.s;view=()=>expView(kind,index);let h='<div class="sysline">'+EXP_TYPES[s.type].d+'</div>';
 const act=(label,op,ok=true)=>btn(label,'expact',kind+'|'+index+'|'+op,ok);
 if(ex.challenge)h+=row('Desafio em andamento','Feche esta janela para o tempo e o combate continuarem.','');
 if(kind==='focus'){const f=s.foci[index],cfg=EXP_FOCI[f.kind];h+=row('Foco de '+cfg.n,cfg.d+'<br>'+expRecipe(cfg.id),'');h+=row('Destruir','Derrote 2 defensores. Remove o poder; mantém o saque normal do guardião.',act('Destruir','destroy',!ex.challenge));h+=row('Purificar','Fique a até 4 m por 12s e derrote 3 defensores. Sair do círculo zera o tempo. Remove o poder e entrega 3 essências.',act('Purificar','purify',!ex.challenge));h+=row('Deixar ativo','O chefe mantém este poder. Vitória rende 6 essências deste foco.',act('Deixar ativo','close'))}
 if(kind==='nest')h+=row('Ninho de recuperação','Sem ninhos, a criatura não pode recuar e recuperar vida. Limpe os inimigos desta sala antes de destruir. A recompensa normal permanece.',act('Destruir ninho','nest',!s.nests[index]&&expRoomAlive(node.room)===0));
 if(kind==='bait')h+=row('Isca especial','Limpe a sala para recolher 1 isca. Use-a em uma das arenas para atrair a criatura.',act(s.baitTaken?'Já recolhida':'Recolher','bait',!s.baitTaken&&expRoomAlive(node.room)===0));
 if(kind==='trap'){h+=row('Coluna instável','Preparar arma a coluna. Quando a criatura passar a até 3 m, a coluna cai, interrompe seus ataques por 3s e impede uma fuga nessa janela. Uso único.',act(s.traps[index]?'Preparada':'Preparar','trap',!s.traps[index]&&!s.trapSpent[index]));h+=row('Escolher esta arena','Gasta a isca para conduzir a criatura até aqui. Você pode atraí-la sem isca entrando no alcance dela.',act('Usar isca','lure',s.bait&&!bossE?.dead));h+=row('Recompensa','3 Presas e 3 Glândulas. Caçar sem usar isca concede mais 2 Glândulas; preparar colunas ou destruir ninhos não reduz o saque.', '')}
 if(s.type==='extract')h+=row(s.sent>=6?'Extração concluída':'Objetivo: enviar 6 espaços de materiais',s.sent>=6?'Volte à única saída para fechar o portal.':s.cargo.length?'Leve a carga à torre verde ENVIAR CARGA, marcada com E no mapa. Recolher sozinho não conclui a extração.':'Recolha materiais e leve-os à torre verde ENVIAR CARGA, marcada com E no mapa.','');
 if(kind==='deposit'){const key=['ore','core','heart'][index%3],m=EXP_MATS[key];h+=row(m.n,'Ocupa '+m.w+' espaço(s). Restam '+s.deposits[index]+' unidades.<br>'+expRecipe(key)+'<br>Recolher aumenta a instabilidade em '+m.w+'.',act('Recolher','collect',!ex.challenge&&s.deposits[index]>0&&expCargoWeight(s)+m.w<=12))}
 if(kind==='beacon'){h+=row('Enviar a carga','Defenda a posição a até 6 m por 12s e derrote os invasores. Sair zera o tempo. O envio guarda os materiais nos espólios, mesmo se você morrer depois.',act('Iniciar envio','send',!ex.challenge&&s.cargo.length>0));h+=row('Estabilizar a região','Consome a unidade menos volumosa da carga e reduz a instabilidade em 3. Não repõe depósitos.',act('Estabilizar','stabilize',!ex.challenge&&s.cargo.length>0&&s.instability>0))}
 if(s.type==='extract'){h+=row('Carga '+expCargoWeight(s)+'/12 · enviada '+s.sent+'/6','Instabilidade '+s.instability+' · estágio '+expStage(s)+'.<br>0: região calma. 1: fissuras anunciadas. 2: criaturas atraídas. 3: fissuras mais frequentes. Corredores permanecem abertos.','');for(const key of [...new Set(s.cargo)])h+=row(EXP_MATS[key].n+' × '+s.cargo.filter(k=>k===key).length,'Carga não enviada',act('Descartar 1','drop:'+key,!ex.challenge))}
 openModal(EXP_TYPES[s.type].n.toUpperCase(),h);
}
function expAction(kind,index,op){const node=expNear(kind,index);if(!node)return false;const ex=L.expedition,s=ex.s;if(op==='close'){closeModal();return true}if(ex.challenge||s.completed)return false;
 if(kind==='focus'&&['destroy','purify'].includes(op)){const f=s.foci[index];if(f.status!=='active'||L.bossDead)return false;const tag='focus'+index;ex.challenge={kind:op,node,tag,t:0,need:op==='purify'?12:0};expSpawn(node.x,node.z,op==='purify'?3:2,tag,node.room);toast(op==='purify'?'Purificação: mantenha-se no círculo e derrote os defensores.':'Destruição: derrote os defensores do foco.');fxRing(node.x,node.z,0xe3c7ff,4,1)}
 else if(kind==='nest'&&op==='nest'){if(s.nests[index]||expRoomAlive(node.room)>0)return false;s.nests[index]=true;narratorEvent105('nest');node.hidden=true;node.grp.visible=false;toast('Ninho destruído. A criatura perdeu um ponto de recuperação.')}
 else if(kind==='bait'&&op==='bait'){if(s.baitTaken||expRoomAlive(node.room)>0)return false;s.bait=s.baitTaken=true;node.hidden=true;node.grp.visible=false;toast('Isca recolhida. Escolha uma arena para atrair a criatura.')}
 else if(kind==='trap'&&op==='trap'){if(s.traps[index]||s.trapSpent[index])return false;s.traps[index]=true;toast('Coluna preparada. Atraia a criatura para perto.')}
 else if(kind==='trap'&&op==='lure'){if(!s.bait||!bossE||bossE.dead)return false;s.bait=false;s.baitUsed=true;ex.lure=node;ex.target={x:node.x,z:node.z};ex.path=null;bossE.aggro=false;bossE.act=null;toast('A criatura farejou a isca e está vindo pelos corredores.')}
 else if(kind==='deposit'&&op==='collect'){const key=['ore','core','heart'][index%3],m=EXP_MATS[key];if(s.deposits[index]<=0||expCargoWeight(s)+m.w>12)return false;const stage=expStage(s);s.cargo.push(key);s.deposits[index]--;s.instability+=m.w;if(s.deposits[index]===0){node.hidden=true;node.grp.visible=false}if(expStage(s)>stage)toast('A coleta atraiu criaturas.');toast(m.n+' recolhido · carga '+expCargoWeight(s)+'/12.')}
 else if(kind==='beacon'&&op==='stabilize'){if(!s.cargo.length||s.instability<=0)return false;let i=0;for(let j=1;j<s.cargo.length;j++)if(EXP_MATS[s.cargo[j]].w<EXP_MATS[s.cargo[i]].w)i=j;s.cargo.splice(i,1);s.instability=Math.max(0,s.instability-3);toast('Uma unidade da carga foi consumida. Instabilidade reduzida.')}
 else if(kind==='beacon'&&op==='send'){if(!s.cargo.length)return false;ex.sendSeq=(ex.sendSeq||0)+1;const tag='send'+ex.sendSeq;ex.challenge={kind:'send',node,tag,t:0,need:12};expSpawn(node.x,node.z,2+expStage(s),tag,node.room);toast('Envio iniciado: defenda a posição e permaneça a até 6 m por 12s.')}
 else if(op.startsWith('drop:')&&s.type==='extract'){const i=s.cargo.indexOf(op.slice(5));if(i<0)return false;s.cargo.splice(i,1)}else return false;closeModal();saveRun();return true;
}
function expFinishChallenge(){const ex=L.expedition,c=ex?.challenge;if(!c)return;const s=ex.s;if(c.kind==='send'){const weight=expCargoWeight(s);for(const key of [...new Set(s.cargo)])expReward(key,s.cargo.filter(k=>k===key).length,false);s.sent+=weight;s.cargo=[];if(L.gate.missionExtract117&&run.extractMission117)run.extractMission117.sent=s.sent;if(weight>0)narratorEvent105('sendcargo');if(s.sent>=6&&!s.completed){finishExtraction117()};saveRun()}
 else{const f=s.foci[c.node.index];f.status=c.kind==='purify'?'purified':'destroyed';narratorEvent105(c.kind==='purify'?'purify':'destroyfocus');c.node.hidden=true;c.node.grp.visible=false;if(c.kind==='purify')expReward(EXP_FOCI[f.kind].id,3);for(const e of enemies)if(e.expFocus===c.node.index){e.dead=true;e.gone=true;scene.remove(e.m.root)}toast('Foco de '+EXP_FOCI[f.kind].n+' removido. O guardião perdeu esse poder.');if(bossE)bossE.expShield=0}
 ex.challenge=null;
}
function expeditionDamage(e,amt){const ex=L.expedition;if(!ex||ex.s.type!=='rupture')return amt;if(e===bossE&&e.expShield>0){const absorbed=Math.min(e.expShield,amt);e.expShield-=absorbed;amt-=absorbed;floater(e.x,e.z,'ESCUDO −'+Math.round(absorbed),'#70ddff')}
 else if(!e.isBoss&&ex.s.foci.some(f=>f.status==='active'&&f.kind===0&&f.room===e.room))amt*=.6;return amt}
function expBossReward(){const ex=L.expedition;if(!ex||ex.s.rewarded)return;const s=ex.s;s.rewarded=true;if(s.type==='rupture')for(const f of s.foci)if(f.status==='active')expReward(EXP_FOCI[f.kind].id,6);if(s.type==='hunt'){expReward('fang',3);expReward('stalker',s.baitUsed?3:5)}saveRun()}
function expAbandon(){const s=L.expedition?.s;if(s?.type==='extract'&&s.cargo.length){s.cargo=[];toast('A carga não enviada ficou no portal. Os materiais já enviados continuam nos espólios.')}}
function expPath(from,to){if(L.ow460&&window.OW460)return OW460.path(from,to);const G=L.grid;if(!G)return [];const cell=p=>({x:Math.floor((p.x-G.ox)/G.CS),y:Math.floor((p.z-G.oz)/G.CS)}),a=cell(from),b=cell(to),start=a.y*G.W+a.x,end=b.y*G.W+b.x,prev=new Int32Array(G.W*G.H).fill(-1),q=[start];if(start<0||end<0||start>=prev.length||end>=prev.length)return [];prev[start]=start;for(let i=0;i<q.length&&prev[end]<0;i++){const v=q[i],x=v%G.W,y=Math.floor(v/G.W);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,n=ny*G.W+nx;if(nx<0||ny<0||nx>=G.W||ny>=G.H||prev[n]>=0||G.cells[n]!==1)continue;prev[n]=v;q.push(n)}}if(prev[end]<0)return [];const out=[];for(let n=end;n!==start;n=prev[n])out.push({x:G.ox+(n%G.W+.5)*G.CS,z:G.oz+(Math.floor(n/G.W)+.5)*G.CS});return out.reverse()}
function expHuntMove(e,dt){const ex=L.expedition;if(!ex||ex.s.type!=='hunt'||e!==bossE||e.dead)return false;const s=ex.s;
 if(ex.trapHold>0){ex.trapHold-=dt;e.act=null;e.m.root.position.set(e.x,0,e.z);return true}
 for(const n of ex.nodes.filter(n=>n.kind==='trap'))if(s.traps[n.index]&&!s.trapSpent[n.index]&&Math.hypot(e.x-n.x,e.z-n.z)<3){s.trapSpent[n.index]=true;ex.trapHold=3;ex.lure=null;ex.retreat=null;ex.target=null;e.act=null;e.aggro=true;n.grp.rotation.z=1.4;toast('A coluna interrompeu a criatura por 3s. Ataque!');return true}
 if(!ex.lure&&!ex.retreat&&s.retreats<2&&e.hp/e.maxhp<(s.retreats===0?.65:.3)){const node=ex.nodes.find(n=>n.kind==='nest'&&!s.nests[n.index]);if(node){s.retreats++;ex.retreat=node;ex.target=node;ex.path=null;e.act=null;e.aggro=false;toast('A criatura está recuando para um ninho. Persiga ou destrua os ninhos!')}}
 if(ex.retreat&&s.nests[ex.retreat.index]){ex.retreat=null;ex.target=null;e.aggro=true}
 if(ex.target){const d=Math.hypot(e.x-ex.target.x,e.z-ex.target.z);if(d<1.4){if(ex.retreat){ex.regenT=(ex.regenT||0)+dt;e.hp=Math.min(e.maxhp,e.hp+e.maxhp*.03*dt);if(ex.regenT<4)return true;ex.regenT=0;ex.retreat=null}ex.target=null;ex.path=null;ex.lure=null;e.aggro=true;return false}
 ex.routeT-=dt;if(!ex.path||ex.routeT<=0){ex.path=expPath(e,ex.target);ex.routeT=2}const p=ex.path[0];if(p){const dx=p.x-e.x,dz=p.z-e.z,len=Math.hypot(dx,dz);if(len<.35)ex.path.shift();else{e.face=Math.atan2(dx,dz);moveEnt(e,dx/len*Math.min(len,4.8*dt),dz/len*Math.min(len,4.8*dt));animChibi(e.m,{move:1,atk:0,dead:0,wind:0},time);e.m.root.position.set(e.x,0,e.z);e.m.root.rotation.y=e.face;if((ex.trailT||0)<time){ex.trailT=time+1;fxRing(e.x,e.z,0xd7b387,.5,5)}}}if(!ex.lure&&!ex.retreat&&Math.hypot(e.x-player.x,e.z-player.z)<9&&los(e.x,e.z,player.x,player.z)){ex.target=null;ex.path=null;e.aggro=true}return true}
 if(!e.aggro){ex.patrol=(ex.patrol+1)%ex.patrolRooms.length;ex.target=expPoint(ex.patrolRooms[ex.patrol]);return true}if(Math.hypot(e.x-player.x,e.z-player.z)>12&&!los(e.x,e.z,player.x,player.z)){ex.target={x:player.x,z:player.z};ex.path=null;return true}return false;
}
function expeditionUpdate(dt){const ex=L.expedition;if(!ex||player.dead)return;const s=ex.s,c=ex.challenge;
 if(c){const r=c.kind==='send'?6:4,near=Math.hypot(player.x-c.node.x,player.z-c.node.z)<=r;c.t=near?c.t+dt:0;const alive=enemies.some(e=>!e.dead&&e.expTag===c.tag);if(!alive&&c.t>=c.need)expFinishChallenge()}
 ex.timer-=dt;if(ex.timer>0)return;ex.timer=s.type==='extract'?(expStage(s)>=3?5:8):8;
 if(s.type==='rupture'&&!L.bossDead){const active=s.foci.map((f,i)=>({...f,index:i})).filter(f=>f.status==='active');for(const f of active){const n=ex.nodes.find(n=>n.kind==='focus'&&n.index===f.index);if(Math.hypot(player.x-n.x,player.z-n.z)>12)continue;if(f.kind===2)expLine(n.x,n.z,player.maxhp*.08,EXP_FOCI[2].c);if(f.kind===1&&enemies.filter(e=>!e.dead&&e.expFocus===f.index).length<2){const e=expSpawn(n.x,n.z,1,'copy',n.room)[0];e.expFocus=f.index;e.name='Cópia instável';e.hp=e.maxhp*=.25;e.gold=0;e.xp=0;e.noExpLoot=true;}}
 if(bossE&&!bossE.dead&&bossE.aggro&&Math.hypot(player.x-bossE.x,player.z-bossE.z)<24){const ward=active.filter(f=>f.kind===0).length;if(ward&&(ex.shieldAt||0)<=time){bossE.expShield=bossE.maxhp*Math.min(.18,.06*ward);ex.shieldAt=time+16;fxRing(bossE.x,bossE.z,0x70ddff,3,1);toast('Proteção dos focos: escudo renovado no guardião.')}const cycle=(ex.bossCycle||0)%2;ex.bossCycle=cycle+1;if(cycle===0&&active.some(f=>f.kind===1)&&enemies.filter(e=>!e.dead&&e.expBossCopy).length<4){for(const e of expSpawn(bossE.x,bossE.z,2,'boss-copy',L.bossRoom)){e.expBossCopy=true;e.hp=e.maxhp*=.25;e.gold=e.xp=0;e.noExpLoot=true;e.name='Cópia do guardião'}}else if(active.some(f=>f.kind===2))expLine(bossE.x,bossE.z,bossE.dmg*.8,0xff8750)}}
 if(s.type==='hunt'&&bossE&&!bossE.dead&&bossE.aggro&&!ex.retreat&&!ex.lure&&Math.hypot(bossE.x-player.x,bossE.z-player.z)<20){if(s.species===1&&time-(player.lastSpellAt||-100)<5){expHazard(player.x,player.z,2,1.2,bossE.dmg,'enemy',0xa8a4ff);toast('Devorador: sua conjuração atraiu uma emboscada. Saia da marca!')}else if(s.species===0){const a=allies.find(a=>!a.dead&&Math.hypot(a.x-bossE.x,a.z-bossE.z)<14)||player;expHazard(a.x,a.z,1.8,1.2,bossE.dmg*.8,'enemy',0xff9a70)}}
 if(s.type==='extract'&&!s.completed&&s.sent<6&&!L.bossDead&&!L.brk){const stage=expStage(s);if(stage>=1)expHazard(player.x,player.z,1.6,1.4,player.maxhp*.12,'enemy',0xe887ff);if(stage>=2&&enemies.filter(e=>!e.dead&&e.expTag==='instability').length<4){expSpawn(player.x,player.z,1,'instability',-1)}}
}
function expeditionObjective(){const ex=L.expedition;if(!ex)return '';const s=ex.s,c=ex.challenge;if(s.type==='extract'&&(s.completed||s.sent>=6))return 'Missão concluída · volte à saída';if(c)return (c.kind==='send'?'Envio':c.kind==='purify'?'Purificação':'Destruição')+' · '+Math.floor(c.t)+'/'+c.need+'s · defensores '+enemies.filter(e=>!e.dead&&e.expTag===c.tag).length+' · permaneça no círculo';if(s.type==='rupture')return 'Ruptura · focos ativos '+s.foci.filter(f=>f.status==='active').length+'/3 · '+(L.bossDead?'guardião derrotado · saia':'prepare os focos ou enfrente o guardião');if(s.type==='hunt')return 'Caçada · '+(L.bossDead?'criatura abatida · saia':bossE?.name||'encontre a criatura')+' · ninhos '+s.nests.filter(Boolean).length+'/2 destruídos';return 'Carga '+expCargoWeight(s)+'/12 · enviada '+s.sent+'/6 · '+(s.cargo.length?'leve à torre verde (E no mapa)':'recolha materiais')}

function expHazard(...args){const h=hazard(...args);h.owner=null;return h}
function useLamp(){scene.fog.density=.02;if(!L.lampL){L.lampL=new THREE.PointLight(0xffd9a0,1.6,22);scene.add(L.lampL)}L.lampT=180;toast('<b>[NARRADOR]</b> Lampião Mágico aceso: 3 minutos de luz. Restam '+(run.lamps||0)+'.',5000)}
function makeElite(e){if(e.elite)return;const healthFraction=e.maxhp>0?e.hp/e.maxhp:1,oldRes=e.res||0;e.elite=true;e.res=Math.max(oldRes,.2);e.maxhp*=1.8*(1-e.res)/(1-oldRes);e.hp=e.maxhp*healthFraction;e.dmg*=1.3;e.name='Elite '+e.name;/* Recompensas calculadas uma vez em enemyRewardBalance. */e.m.body.scale.multiplyScalar(1.15);e.mats.forEach(m=>{m.emissive.setHex(0x331100);m.userData.e0=0x331100})}
/* Variações de calabouço: uma saída real, escadas internas e defesa de núcleo. */
function variantLayout103(type,R){
 const count=type==='floors'?3:1,W=36,H=count*40-4,cells=new Uint8Array(W*H),rooms=[];
 const carve=(x,y)=>{if(x>0&&y>0&&x<W-1&&y<H-1)cells[y*W+x]=1};
 for(let f=0;f<count;f++){
  const offset=f*40,flip=R()<.5,base=type==='core'?[[14,26,8,7],[5,3,26,21]]:[[3,3,8,8],[22,3,10,9],[3,22,9,10],[22,22,10,10]],start=rooms.length;
  for(const [bx,y,w,h] of base){const x=flip?W-bx-w:bx,r={x,y:y+offset,w,h,floor:f,entry:rooms.length===start};rooms.push(r);for(let yy=r.y;yy<r.y+h;yy++)for(let xx=x;xx<x+w;xx++)carve(xx,yy)}
  const center=r=>({x:Math.floor(r.x+r.w/2),y:Math.floor(r.y+r.h/2)});
  for(let i=start+1;i<rooms.length;i++){const a=center(rooms[i-1]),b=center(rooms[i]);for(let x=Math.min(a.x,b.x);x<=Math.max(a.x,b.x);x++){carve(x,a.y);carve(x,a.y+1)}for(let y=Math.min(a.y,b.y);y<=Math.max(a.y,b.y);y++){carve(b.x,y);carve(b.x+1,y)}}
  rooms.at(-1).floorEnd=true;
 }
 return {W,H,cells,rooms,bi:rooms.length-1};
}
function unlockExitModel131(it){it.locked=false;if(it.grp?.userData.rift131){riftExitVisual131(it);return;}it.ring.material=glowS(0xffb347,1);it.grp.remove(it.sg);if(it.type==='exit'){it.sg=makeSign('SAÍDA','#ffb347',.55);it.sg.position.y=5.5;it.grp.add(it.sg)}}
function unlockDungeonExit(){if(L.ow460&&window.OW460)OW460.openReturn();for(const it of L.exits)if(it.type==='exit'&&it.locked)unlockExitModel131(it)}
function beginDungeonEscape(){L.closeT=L.ow460?120:60;L.warn30=false;unlockDungeonExit()}
function dungeonFloorAt(z){return L.floors?Math.max(0,Math.min(2,Math.floor(((z-L.grid.oz)/L.grid.CS)/40))):0}
function floorMapCenter(){return L.floors?L.grid.oz+(L.floors.current*40+18)*L.grid.CS:0}
function setupDungeonFloors(){
 L.floors={current:0,count:3};
 const starts=L.rooms.filter(r=>r.entry),ends=L.rooms.filter(r=>r.floorEnd);
 const stair=(r,to,landing,forward)=>{const grp=new THREE.Group();grp.position.set(r.wx,0,r.wz);for(let i=0;i<5;i++){const level=forward?5-i:i+1;const step=mesh(geo('step103_'+(forward?'down':'up')+'_'+level,()=>new THREE.BoxGeometry(3,.3*level,.7)),toonS(0x758394));step.position.set(0,.15*level,1.4-i*.7);grp.add(step)}const sg=makeSign((forward?'DESCER · ':'SUBIR · ')+(to+1)+'º','#8de6ff',.5);sg.position.y=3.7;grp.add(sg);L.group.add(grp);const it={type:'stairs',x:r.wx,z:r.wz,r:3,room:r.i,to,landing,forward,grp,label:'F · '+(forward?'DESCER':'SUBIR')+' PARA O '+(to+1)+'º ANDAR'};it.use=()=>useDungeonStairs(it);L.inter.push(it)};
 for(let f=0;f<2;f++){stair(ends[f],f+1,starts[f+1],true);stair(starts[f+1],f,ends[f],false)}
}
function useDungeonStairs(it){
 if(!L.floors||player.dead||!L.inter.includes(it)||Math.hypot(player.x-it.x,player.z-it.z)>it.r+.2)return false;
 if(it.forward&&enemies.some(e=>!e.dead&&e.room===it.room)){toast('Derrote os defensores desta sala para liberar a escada.');return false}
 for(const p of projs)scene.remove(p.mesh);for(const h of hazards)scene.remove(h.g);projs=[];hazards=[];
 L.floors.current=it.to;player.x=it.landing.wx;player.z=it.landing.wz+2;player.dodgeT=0;player.dashDmg=null;player.bowT=0;placeAllies();cam.x=player.x;cam.z=player.z;bossLight.intensity=0;$('boss').hidden=true;
 for(const e of enemies)e.m.root.visible=!e.gone&&dungeonFloorAt(e.z)===it.to;
 narratorEvent105(it.forward?'stairs_up':'stairs_down',{floor:it.to,gate:[L.gate.id,L.gate.seed].join(':')});bigText('ANDAR '+(it.to+1)+' / 3',1200);sfx('step');return true;
}
function coreDefenseLayout111(r,g){return {core:{x:r.wx,z:g.oz+(r.y+3.5)*g.CS},front:{x:r.wx,z:g.oz+(r.y+r.h-2.5)*g.CS}}}
function coreWaveSize111(rank,wave){return Math.min(20,8+Math.floor(rank/2)+2*(wave-1))}
/* v230: cristal do Tripo (mesmo dos veios), em grupo; carrega quando o modelo estiver pronto. Cor pelo rank, brilho e luz próprios. */
/* v230 (Ian): cristal desenhado (prismas de 6 lados com ponta, translúcidos e brilhando), estilo fantasia cartoon. Substitui o modelo que parecia pedra. */
const CRY230={},CRYCOL230={2:0x2fd0ff,4:0x3a8cff,8:0xffb51e};
function cryGeo230(){if(CRY230.g)return CRY230.g;const b=new THREE.CylinderGeometry(.42,.5,1,6,1);b.translate(0,.5,0);const t=new THREE.ConeGeometry(.42,.55,6,1);t.translate(0,1.27,0);
 const a=b.toNonIndexed(),c=t.toNonIndexed(),pa=a.attributes.position.array,pc=c.attributes.position.array,m=new Float32Array(pa.length+pc.length);m.set(pa);m.set(pc,pa.length);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(m,3));g.computeVertexNormals();return CRY230.g=g}
function cryMat230(rank,broken){const k=rank+':'+(broken?1:0);if(CRY230[k])return CRY230[k];const col=new THREE.Color(CRYCOL230[rank]??RANKS[Math.min(RANKS.length-1,rank)].c);if(broken)col.setHex(0xc81e32);
 if(window.Crystal310){const m=Crystal310.mat(col.getHex(),broken?.85:.9);m.userData.shared=true;return CRY230[k]=m}/* v313: cristais do mundo com o shader de cristal */
 const m=new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:broken?.2:.32,roughness:.25,metalness:.05,transparent:true,opacity:.9,flatShading:true});m.userData.shared=true;return CRY230[k]=m}
function crystalCluster230(rank,size,broken){const g=new THREE.Group(),geo=cryGeo230(),mat=cryMat230(rank,broken),R=mulberry32((rank*97+size*31)|0);
 const parts=[[0,0,1,0,0],[.45,.1,.62,.42,0],[-.42,.15,.55,-.38,.3],[.1,-.42,.5,.1,-.45],[-.2,.4,.42,-.15,.5],[.32,.38,.36,.3,.4]];
 for(const [x,z,h,tx,tz] of parts){const p=new THREE.Mesh(geo,mat);p.position.set(x*size*.35,0,z*size*.35);p.scale.set(size*.32*(.7+h*.3),size*h,size*.32*(.7+h*.3));p.rotation.set(tz*.5,R()*TAU,-tx*.5);g.add(p)}
 const glow=new THREE.Mesh(new THREE.SphereGeometry(size*.32,10,8),new THREE.MeshBasicMaterial({color:mat.color,transparent:true,opacity:broken?.08:.22,blending:THREE.AdditiveBlending,depthWrite:false}));glow.position.y=size*.45;g.add(glow);return g}
/* v231: esfera de plasma (selo da prisão), coluna de pedra de ponta quadrada, versão quebrada com chão rachado, e a cena da ruptura. */
function orbMat231(){if(CRY230.orb)return CRY230.orb;const m=new THREE.ShaderMaterial({uniforms:{uT:{value:0}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
 vertexShader:'varying vec3 vN;varying vec3 vP;varying vec3 vV;void main(){vec4 w=modelMatrix*vec4(position,1.);vP=position;vN=normalize(mat3(modelMatrix)*normal);vV=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;}',
 fragmentShader:'uniform float uT;varying vec3 vN;varying vec3 vP;varying vec3 vV;float h(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}float n(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}void main(){float fr=pow(1.-abs(dot(normalize(vN),vV)),2.2);vec3 d=normalize(vP);float a=atan(d.z,d.x),b=asin(d.y);float s=n(vec3(a*3.,b*3.,uT*.6))+.5*n(vec3(a*7.,b*7.,uT*1.3));float fil=smoothstep(.04,.0,abs(fract(s*3.)-.5)-.44);vec3 c=mix(vec3(.35,.12,.95),vec3(.85,.2,.9),s)*(fil*1.1+fr*.9)+vec3(.55,.6,1.)*pow(fr,5.)*1.1+vec3(.25,.06,.45)*.35;gl_FragColor=vec4(c,clamp(fil*.85+fr*.8+.12,0.,1.));}'});
 return CRY230.orb=m}
function plasmaOrb231(r){const g=new THREE.Group(),m=new THREE.Mesh(new THREE.SphereGeometry(r,32,22),orbMat231());m.onBeforeRender=()=>{m.material.uniforms.uT.value=performance.now()/1000};g.add(m);
 const core=new THREE.Mesh(new THREE.SphereGeometry(r*.22,16,12),new THREE.MeshBasicMaterial({color:0xd9b8ff,transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false}));g.add(core);
 const l=new THREE.PointLight(0xb070ff,1.6,18,1.6);g.add(l);g.userData.orb=m;return g}
const SEALS233=[];/* v234 (Ian): voltou o pilar com a esfera de plasma */
/* v235 (Ian): correntes prendendo a esfera: 3 anéis inclinados girando devagar e 4 correntes dos cantos do pilar até ela. */
function chainLink234(){if(CRY230.link)return CRY230.link;const g=new THREE.TorusGeometry(.13,.035,6,10);g.scale(1,1.6,1);return CRY230.link=g}
function chainMat234(){return CRY230.cm||(CRY230.cm=new THREE.MeshStandardMaterial({color:0x2c2a33,metalness:.75,roughness:.35,emissive:0x3a1660,emissiveIntensity:.35}))}
function chainLine234(parent,a,b){const d=b.clone().sub(a),len=d.length(),n=Math.max(2,Math.round(len/.34)),q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());
 for(let i=0;i<n;i++){const l=new THREE.Mesh(chainLink234(),chainMat234());l.position.copy(a).addScaledVector(d,(i+.5)/n);l.quaternion.copy(q);l.rotateY(i%2?Math.PI/2:0);parent.add(l)}}
function chains234(g,orb){const R=1.24,rings=new THREE.Group();rings.position.copy(orb.position);g.add(rings);
 [[.5,0],[-.45,1.1],[.15,2.2]].forEach(([tilt,rot],k)=>{const ring=new THREE.Group();ring.rotation.set(tilt,rot,0);const n=34;for(let i=0;i<n;i++){const a=i/n*TAU,l=new THREE.Mesh(chainLink234(),chainMat234());l.position.set(Math.cos(a)*R,0,Math.sin(a)*R);l.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(-Math.sin(a),0,Math.cos(a)));l.rotateY(i%2?Math.PI/2:0);ring.add(l)}ring.userData.sp=(k%2?-1:1)*(.12+k*.05);rings.add(ring)});
 rings.children[0].onBeforeRender=()=>{const t=performance.now()/1000;rings.children.forEach(r=>r.rotation.y=r.userData.base??(r.userData.base=r.rotation.y));rings.children.forEach((r,i)=>r.rotation.y=r.userData.base+t*r.userData.sp)};
 for(const [x,z] of [[.75,.75],[-.75,.75],[.75,-.75],[-.75,-.75]])chainLine234(g,new THREE.Vector3(x,4.35,z),new THREE.Vector3(orb.position.x+x*.55,orb.position.y-.45,orb.position.z+z*.55))}
/* v236 (Ian): fonte refeita para combinar com o pilar: bacia octogonal de pedra escura, borda com faixa roxa e runas, água violeta brilhando. */
function basin236(g){const st=toonS(0x3d3947),dk=toonS(0x2c2934);
 const wall=mesh(geo('bas236',()=>new THREE.CylinderGeometry(3.6,3.9,.85,8,1,true)),st);wall.material=wall.material.clone();wall.material.side=THREE.DoubleSide;wall.position.y=.42;g.add(wall);
 const rim=mesh(geo('rim236',()=>{const q=new THREE.TorusGeometry(3.62,.2,4,8);q.rotateX(Math.PI/2);q.rotateY(Math.PI/8);return q}),dk);rim.position.y=.86;g.add(rim);
 const glow=new THREE.Mesh(geo('glw236',()=>{const q=new THREE.TorusGeometry(3.62,.045,4,8);q.rotateX(Math.PI/2);q.rotateY(Math.PI/8);return q}),new THREE.MeshBasicMaterial({color:0xb070ff,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false}));glow.position.y=1.08;g.add(glow);
 const floor=mesh(geo('flr236',()=>new THREE.CylinderGeometry(3.85,3.95,.12,8)),dk);floor.position.y=.06;g.add(floor);
 let water;if(window.Water154){water=Water154.mesh(3.45);if(!CRY230.wm){const base=water.material,m=base.clone();m.fragmentShader=base.fragmentShader.replace('vec3 deep=vec3(.03,.13,.18),shallow=vec3(.16,.42,.46);','vec3 deep=vec3(.09,.03,.2),shallow=vec3(.42,.18,.62);').replace('col=mix(col,vec3(.55,.72,.82),','col=mix(col,vec3(.72,.55,.9),').replace('col+=vec3(.25,.45,.42)*caus','col+=vec3(.55,.3,.75)*caus').replace('col=mix(col,vec3(.82,.9,.9),foam*.7)','col=mix(col,vec3(.9,.82,1.),foam*.7)');m.uniforms={uTime:{value:0},uNight:base.uniforms.uNight};CRY230.wm=m}water.material=CRY230.wm;water.onBeforeRender=()=>{CRY230.wm.uniforms.uTime.value=performance.now()/1000};water.rotation.x=-Math.PI/2}
 else{water=new THREE.Mesh(new THREE.CircleGeometry(3.45,24),new THREE.MeshBasicMaterial({color:0x5a2aa0}));water.rotation.x=-Math.PI/2}water.position.y=.62;g.add(water);/* v237: mesma água do lago de pesca, em tom violeta */
 for(let i=0;i<8;i++){const a=i/8*TAU+Math.PI/8,r=new THREE.Mesh(geo('run236',()=>new THREE.PlaneGeometry(.55,.55)),new THREE.MeshBasicMaterial({color:0xd6a8ff,transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
  r.position.set(Math.cos(a)*3.93,.45,Math.sin(a)*3.93);r.lookAt(Math.cos(a)*10,.45,Math.sin(a)*10);g.add(r)}}
function seal231(broken,capital){const g=new THREE.Group(),st=toonS(0x3d3947),dk=toonS(0x2c2934),k=capital?1.25:1;
 if(!broken){const base=mesh(geo('sealB231',()=>new THREE.BoxGeometry(1.8,.5,1.8)),dk);base.position.y=.25;const col=mesh(geo('sealC231',()=>new THREE.BoxGeometry(1,3.4,1)),st);col.position.y=2.2;const cap=mesh(geo('sealT231',()=>new THREE.BoxGeometry(1.7,.45,1.7)),dk);cap.position.y=4.1;g.add(base,col,cap);g.scale.setScalar(k);
  const orb=plasmaOrb231(1.05);orb.position.y=5.45;g.add(orb);g.userData.orb=orb;chains234(g,orb);basin236(g)}
 else{const base=mesh(geo('sealB231',()=>0),dk);base.position.y=.25;const col=mesh(geo('sealC231',()=>0),st);col.scale.y=.38;col.position.set(.15,.85,0);col.rotation.z=.18;g.add(base,col);
  for(let i=0;i<9;i++){const a=i/9*TAU+.3,len=4+((i*37)%5);const cr=new THREE.Mesh(geo('crack231',()=>new THREE.PlaneGeometry(.22,1)),new THREE.MeshBasicMaterial({color:0x14060c}));cr.rotation.set(-Math.PI/2,0,-a);cr.scale.y=len;cr.position.set(Math.cos(a)*(1.2+len/2),.04,Math.sin(a)*(1.2+len/2));g.add(cr)}
  for(let i=0;i<6;i++){const sh=mesh(geo('shard231',()=>new THREE.TetrahedronGeometry(.35)),toonS(0x7a3aa8));sh.position.set(Math.cos(i)*2.5,.15,Math.sin(i*1.7)*2.5);sh.rotation.set(i,i*2,i);g.add(sh)}g.scale.setScalar(k)}
 return g}
/* v232 (Ian): na quebra da âncora sai um pulso de luz até 400 m: dano em tudo (monstros comuns morrem, chefes perdem 20%, você perde 30% da vida) e arranca as árvores. */
function pulse232(x,z){const R=400,dur=2.2,g=new THREE.Mesh(new THREE.SphereGeometry(1,32,16,0,TAU,0,Math.PI/2),new THREE.MeshBasicMaterial({color:0xc58aff,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
 const ring=new THREE.Mesh(new THREE.RingGeometry(.92,1,64),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.3;
 g.position.set(x,0,z);ring.position.x=x;ring.position.z=z;L.group.add(g,ring);const hit=new Set();let t=0,treesDone=false;
 const iv=setInterval(()=>{t+=.05;const k=Math.min(1,t/dur),r=Math.max(1,R*(1-Math.pow(1-k,2)));g.scale.set(r,r*.35,r);ring.scale.setScalar(r);g.material.opacity=.35*(1-k);ring.material.opacity=.8*(1-k*.8);
  for(const e of enemies){if(e.dead||hit.has(e)||Math.hypot(e.x-x,e.z-z)>r)continue;hit.add(e);if(e.isBoss)hurtEnemy(e,e.maxhp*.2,x,z,{pierce:true});else{e.hp=1;hurtEnemy(e,1e12,x,z,{pierce:true,kb:6})}}
  if(player&&!player.dead&&!hit.has(player)&&Math.hypot(player.x-x,player.z-z)<=r){hit.add(player);curAtk=null;hurtPlayer(player.maxhp*.3,false);shake(.8);floater(player.x,player.z,'PULSO DA ÂNCORA','#e0b8ff',true)}
  if(!treesDone&&k>.3){treesDone=true;try{clearTrees232(x,z,R)}catch(_){}}
  if(k>=1){clearInterval(iv);L.group.remove(g,ring);g.geometry.dispose();ring.geometry.dispose()}},50)}
function clearTrees232(x,z,R){const M=new THREE.Matrix4(),P=new THREE.Vector3(),Z=new THREE.Matrix4().makeScale(0,0,0);let n=0;scene.traverse(o=>{if(!o.isInstancedMesh||!['oak','willow','fir'].includes(o.userData.tripo153))return;let ch=false;for(let i=0;i<o.count;i++){o.getMatrixAt(i,M);P.setFromMatrixPosition(M);if(Math.hypot(P.x-x,P.z-z)<=R&&!(o.userData.burnt232||(o.userData.burnt232=new Set())).has(i)){o.userData.burnt232.add(i);const cc=new THREE.Color(.11,.09,.08);if(!o.instanceColor){o.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(o.count*3).fill(1),3);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.needsUpdate=true)}o.setColorAt(i,cc);M.multiply(Z.makeScale(.92,.85,.92));o.setMatrixAt(i,M);ch=true;n++}}if(ch){o.instanceMatrix.needsUpdate=true;o.instanceColor.needsUpdate=true}});return n}
function ruptureCine231(c,gate){setTimeout(()=>{try{storyCh220('anchor237')}catch(_){}},6000);const P=player;if(!P)return;window.CINE231={x:c.x,z:c.z,t:0,dur:5};let orb=plasmaOrb231(1.4),col231=0xc070ff;orb.position.set(c.x,6,c.z);L.group.add(orb);/* v450 (Ian): no lugar da esfera genérica, a pedra-âncora da própria capital treme e explode */try{window.Anchor434&&Anchor434.crystal(c.name).then(r=>{if(!r||!orb.parent)return;L.group.remove(orb);const g=new THREE.Group();r.m.scale.setScalar(4/(r.h||1));r.m.position.y=-2;g.add(r.m);const l=new THREE.PointLight(r.col,3,30,1.6);g.add(l);g.position.set(c.x,6,c.z);L.group.add(g);orb=g;col231=r.col})}catch(_){}if(gate&&gate.mesh)gate.mesh.scale.setScalar(.01);
 bigText('A ÂNCORA SE ROMPE',2200);sfx('gong');let t=0;const iv=setInterval(()=>{t+=.05;const k=Math.min(1,t/1.6);orb.scale.setScalar(1+k*.6+Math.sin(t*40)*.08*k);
  if(t<1.6&&orb.parent){orb.position.x=c.x+Math.sin(t*55)*.15*k;orb.position.z=c.z+Math.cos(t*47)*.15*k;orb.rotation.y+=.02+k*.25}if(t>=1.6&&orb.parent){L.group.remove(orb);pulse232(c.x,c.z);shake(1.2);sfx('boom');fxRing(c.x,c.z,col231,14,.9);for(let i=0;i<4;i++)fxBurst(c.x,5,c.z,i%2?col231:0xffffff,18,9);shards250(c.x,c.z,col231)}
  if(t>1.6&&gate&&gate.mesh)gate.mesh.scale.setScalar(Math.min(2.4,(t-1.6)*1.2));if(t>=4.8){clearInterval(iv);if(gate&&gate.mesh)gate.mesh.scale.setScalar(2.4)}},50)}
function shards250(x,z,col){/* v450: estilhaços da pedra-âncora voando */const mat=new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:1.4,roughness:.25,metalness:.1,transparent:true}),S=[];for(let i=0;i<26;i++){const m=new THREE.Mesh(new THREE.OctahedronGeometry(.25+Math.random()*.55),mat);m.scale.y=1.6+Math.random();m.position.set(x,6,z);const a=Math.random()*TAU,sp=6+Math.random()*12;S.push({m,v:new THREE.Vector3(Math.cos(a)*sp,4+Math.random()*10,Math.sin(a)*sp),r:new THREE.Vector3(Math.random()*8,Math.random()*8,0)});L.group.add(m)}let t=0;const iv=setInterval(()=>{t+=.05;for(const s of S){s.v.y-=18*.05;s.m.position.addScaledVector(s.v,.05);const gy=terrH(s.m.position.x,s.m.position.z)+.2;if(s.m.position.y<gy){s.m.position.y=gy;s.v.multiplyScalar(.3);s.v.y=Math.abs(s.v.y)*.3}s.m.rotation.x+=s.r.x*.05;s.m.rotation.y+=s.r.y*.05}if(t>2.5)mat.opacity=Math.max(0,1-(t-2.5)/1.5);if(t>=4){clearInterval(iv);for(const s of S){L.group.remove(s.m);s.m.geometry.dispose()}mat.dispose()}},50)}
function crystal229(rank,size,broken,rockless){const g=crystalCluster230(rank,size,broken);if(!broken){const l=new THREE.PointLight(new THREE.Color(RANKS[Math.min(RANKS.length-1,rank)].c),1.2,12,1.8);l.position.y=size*.6;g.add(l)}return g}
function setupCoreDefense(){
 const r=L.rooms[L.bossRoom],layout=coreDefenseLayout111(r,L.grid),grp=new THREE.Group();grp.position.set(layout.core.x,0,layout.core.z);
 const base=mesh(geo('coreBase103',()=>new THREE.CylinderGeometry(2.1,2.5,.6,8)),toonS(0x536a86));base.position.y=.3;grp.add(base);
 const crystal=crystal229(2,3.4,false);crystal.position.y=.55;grp.add(crystal);/* v230: núcleo é um cristal de verdade */const sg=makeSign('NÚCLEO SELADO','#8de6ff',.55);sg.position.y=5;grp.add(sg);L.group.add(grp);
 const maxhp=600*L.G.dmg;L.defense={core:{...layout.core,r:2,hp:maxhp,maxhp,defenseCore:true},front:layout.front,grp,crystal,sg,started:false,failed:false,done:false,t:0,wave:0,duration:60};
 const it={type:'core',x:layout.core.x,z:layout.core.z,r:4,label:'F · INICIAR DEFESA DO NÚCLEO',use:()=>startCoreDefense()};L.defense.inter=it;L.inter.push(it);
 for(const dx of [-6.4,0,6.4]){const ring=new THREE.Mesh(geo('coreEntry111',()=>new THREE.RingGeometry(1.1,1.45,24)),glowS(0xff7b66,.65));ring.rotation.x=-Math.PI/2;ring.position.set(layout.front.x+dx,.08,layout.front.z);L.group.add(ring)}const frontSign=makeSign('CHEGADA DOS INVASORES','#ff9b87',.4);frontSign.position.set(layout.front.x,2.5,layout.front.z+2);L.group.add(frontSign);
}
function coreLabel(text){const d=L.defense;if(!d?.grp)return;d.grp.remove(d.sg);d.sg=makeSign(text,'#8de6ff',.55);d.sg.position.y=5;d.grp.add(d.sg)}
function startCoreDefense(){const d=L.defense;if(!d||d.started||d.failed||d.done||player.dead||Math.hypot(player.x-d.core.x,player.z-d.core.z)>4.2)return false;d.started=true;d.inter.hidden=true;toast('Defenda o núcleo ao fundo por 60s. Quatro ondas crescentes chegam pela frente; intercepte os inimigos antes que alcancem o núcleo.');sfx('gong');return true}
function hurtDefenseCore(amt){const d=L.defense;if(!d||!d.started||d.failed||d.done||amt<=0)return;d.core.hp=Math.max(0,d.core.hp-amt);fxRing(d.core.x,d.core.z,0xff5060,2,.2);if(d.core.hp<=0){d.failed=true;d.crystal.visible=false;coreLabel('NÚCLEO DESTRUÍDO');narratorEvent105('core_fail');L.gate.coreFailed103=true;L.gate.dead=true;bigText('NÚCLEO DESTRUÍDO',1700);startBreak();toast('Defesa falhou. Sem recompensa de conclusão. Fuja pela única saída; este portal será perdido.',5500)}}
function coreWave(){const d=L.defense;d.wave++;const n=coreWaveSize111(L.gate.rank,d.wave);for(let i=0;i<n;i++){const x=d.front.x+(i%5-2)*3.2,z=d.front.z-Math.floor(i/5)*2;const e=spawnKind(wpick(activeDungeonPool124(L.gate.rank,{melee:true})).k,x,z,L.gate.rank,{room:L.bossRoom});e.ai='melee';e.range=1.5;e.aggro=true;e.coreRaider=true;e.speed=Math.max(2.5,e.speed);if(L.gate.red){e.hp*=1.3;e.maxhp*=1.3}for(const aff of L.gate.aff||[]){if(aff==='armor'){e.hp*=1.5;e.maxhp*=1.5}if(aff==='frenzy')e.speed*=1.3;if(aff==='expl')e.expl=true;e.gold*=1.5}fxRing(x,z,0xff7b66,1.5,.7)}toast('Onda '+d.wave+' / 4 · '+n+' invasores pela frente. Proteja o núcleo!')}
function completeCoreDefense(){const d=L.defense;if(!d||d.done||d.failed||!d.started||d.t<d.duration||d.wave<4||enemies.some(e=>e.coreRaider&&!e.dead))return false;d.done=true;coreLabel('NÚCLEO ABERTO');narratorEvent105('core_win');L.bossDead=true;beginDungeonEscape();giveBoon184(10);run.res.core[L.gate.rank]+=3;addChest(d.core.x+4,d.core.z,L.gate.rank,true);addVein(d.core.x-4,d.core.z,L.gate.rank,7,0x78e6ff);bigText('NÚCLEO ABERTO',1500);toast('Defesa concluída: Bênção da Fenda e 3 núcleos. Recolha o tesouro e atravesse a saída. Transbordo em '+(L.ow460?'2 minutos.':'60 segundos.'),5500);saveRun();return true}
function updateCoreDefense(dt){const d=L.defense;if(!d||!d.started||d.failed||d.done||player.dead)return;d.t+=dt;while(d.wave<4&&d.t>=d.wave*15)coreWave();completeCoreDefense()}
function coreObjective(){const d=L.defense;if(d.failed)return 'Núcleo destruído · fuja pela única saída';if(d.done)return 'Núcleo aberto · transbordo em '+fmtT(Math.max(0,L.closeT))+(L.ow460?' · uma Fenda nova abriu no covil':' · volte à entrada');if(!d.started)return 'Encontre o núcleo e interaja para iniciar a defesa';return 'NÚCLEO '+Math.ceil(100*d.core.hp/d.core.maxhp)+'% · '+Math.ceil(Math.max(0,d.duration-d.t))+'s · onda '+d.wave+'/4 · '+enemies.filter(e=>e.coreRaider&&!e.dead).length+' inimigos restantes'}

function exitPortal(x,z,locked){
  const existing=L.exits.find(it=>it.type==='exit');if(existing)return existing;
  if(window.RIFT131_ENABLE&&window.Rift131){
    const grp=Rift131.create({seed:131,red:locked,exit:!locked,secret:!locked,legacyLinearOutput:true});grp.position.set(x,0,z);grp.scale.setScalar(.86);L.group.add(grp);
    const sg=Rift131.label({exit:true,locked},L.G?.id||GR[L.gate?.rank||0].id);grp.add(sg);
    /* v478 (Ian): feixe vertical de luz do portal de saída para ser visto de qualquer sala */
    const beamCol=locked?0xff3040:0x5ef0d6;
    const beam=new THREE.Mesh(geo('owExitBeam478',()=>new THREE.CylinderGeometry(.45,.45,85,8,1,true)),new THREE.MeshBasicMaterial({color:beamCol,transparent:true,opacity:.65,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
    beam.position.y=42;grp.add(beam);
    const it={type:'exit',x,z,r:3.4,ring:new THREE.Group(),grp,sg,locked,riftLocked131:locked,beam,use:()=>tryExit(it)};L.inter.push(it);L.exits.push(it);return it;
  }

  const col=locked?0xff2030:0xffb347;const grp=new THREE.Group();grp.position.set(x,0,z);
  const ring=new THREE.Mesh(geo('gring',()=>new THREE.TorusGeometry(2.3,.22,8,40)),glowS(col,1));ring.position.y=2.6;grp.add(ring);
  const disc=new THREE.Mesh(geo('gdisc',()=>new THREE.CircleGeometry(2.15,40)),new THREE.MeshBasicMaterial({color:0x04101e,side:THREE.DoubleSide}));disc.position.y=2.6;grp.add(disc);
  const beam=new THREE.Mesh(geo('owExitBeam478',()=>new THREE.CylinderGeometry(.45,.45,85,8,1,true)),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.65,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
  beam.position.y=42;grp.add(beam);
  const sg=makeSign(locked?'SEM SAÍDA':'SAÍDA',hex(col),.55);sg.position.y=5.5;grp.add(sg);
  L.group.add(grp);
  const it={type:'exit',x,z,r:3.4,ring,grp,sg,locked,label:'F · SAIR DA MASMORRA',use:()=>tryExit(it)};L.inter.push(it);L.exits.push(it);return it;
}
function registerChestBatch253(batch,target){for(const e of batch.l){if(e.y+e.m.max[1]*e.sy<.25)continue;target.push(ChestPlacement253.bounds(e.m.min,e.m.max,e.x,e.z,e.ry,e.sx,e.sz));}}
function registerChestObstacles253(meshes){const out=L.chestObstacles253||(L.chestObstacles253=[]),matrix=new THREE.Matrix4(),local=new THREE.Matrix4();for(const m of meshes){if(!m.isInstancedMesh)continue;m.updateMatrixWorld(true);if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();for(let i=0;i<m.count;i++){m.getMatrixAt(i,local);matrix.multiplyMatrices(m.matrixWorld,local);const b=m.geometry.boundingBox.clone().applyMatrix4(matrix);if(b.max.y>.25)out.push({minX:b.min.x,maxX:b.max.x,minZ:b.min.z,maxZ:b.max.z});}}}
function chestPoint253(origin,extra=[],room=null){const r=1.55,obstacles=[...extra,...(L.chestObstacles253||[])];
  if(!L.grid)for(const ch of chunks.values())obstacles.push(...(ch.group.userData.chestObstacles253||[]));
  for(const it of L.inter)if(!it.hidden&&(it.type==='chest'||it.type==='ruin'))obstacles.push({x:it.x,z:it.z,r:1.45});
  const nearby=obstacles.filter(o=>Number.isFinite(o.minX)?origin.x>=o.minX-18&&origin.x<=o.maxX+18&&origin.z>=o.minZ-18&&origin.z<=o.maxZ+18:Math.hypot(origin.x-o.x,origin.z-o.z)<20+(o.r||0));
  const valid=p=>{if(!freeAt(p.x,p.z,r))return false;if(L.grid){for(let i=0;i<16;i++){const a=i*TAU/16;if(!gfree(p.x+Math.cos(a)*r,p.z+Math.sin(a)*r))return false;}}return true;};
  const grid=L.grid,inRoom=(p,room)=>!room||!grid||p.x>=grid.ox+room.x*grid.CS+r&&p.x<=grid.ox+(room.x+room.w)*grid.CS-r&&p.z>=grid.oz+room.y*grid.CS+r&&p.z<=grid.oz+(room.y+room.h)*grid.CS-r;
  const local=ChestPlacement253.choose(origin,nearby,undefined,r,p=>valid(p)&&inRoom(p,room));if(local)return local;
  if(grid){const points=[];for(let y=0;y<grid.H;y++)for(let x=0;x<grid.W;x++){if(grid.cells[y*grid.W+x]!==1)continue;const p={x:grid.ox+(x+.5)*grid.CS,z:grid.oz+(y+.5)*grid.CS};points.push({x:p.x-origin.x,z:p.z-origin.z});}points.sort((a,b)=>(a.x*a.x+a.z*a.z)-(b.x*b.x+b.z*b.z));const same=ChestPlacement253.choose(origin,obstacles,points,r,p=>valid(p)&&inRoom(p,room));if(same)return same;return ChestPlacement253.choose(origin,obstacles,points,r,valid);}
  return null;
}
function addChest(x,z,tier,boss,reward=null){
  const room=reward?L.rooms?.[reward.room]:L.rooms?.find(r=>L.grid&&x>=L.grid.ox+r.x*L.grid.CS&&x<L.grid.ox+(r.x+r.w)*L.grid.CS&&z>=L.grid.oz+r.y*L.grid.CS&&z<L.grid.oz+(r.y+r.h)*L.grid.CS);
  const point=chestPoint253({x,z},[],room);if(!point)return null;x=point.x;z=point.z;
  let g,lid,band;if(ENV.ok){const o=envChest(boss);g=o.g;lid=o.lid;band=o.band}else{
  g=new THREE.Group();const b=mesh(geo('cb',()=>new THREE.BoxGeometry(1.4,.8,1)),toonS(0x6b3f1f));b.position.y=.4;g.add(b);
  lid=new THREE.Group();lid.position.set(0,.8,-.5);const lm=mesh(geo('cl',()=>new THREE.BoxGeometry(1.45,.35,1.05)),toonS(boss?0xffd070:0x8a5a2a));lm.position.set(0,.17,.5);lid.add(lm);g.add(lid);
  band=new THREE.Mesh(geo('cband',()=>new THREE.BoxGeometry(1.5,.12,1.1)),glowS(0xffd070,.8));band.position.y=.8;g.add(band)}
  g.position.set(x,0,z);g.userData.chest253=true;L.group.add(g);
  const it={type:'chest',grp:g,x,z,r:2.3,label:boss?'F · BAÚ DO GUARDIÃO':reward?(L.ow460?'F · TESOURO DA ZONA ':'F · TESOURO DO ANDAR ')+(reward.depth+1):'F · ABRIR BAÚ',use:()=>{if(it.opened)return;if(reward&&enemies.some(e=>!e.dead&&e.room===reward.room)){toast('Derrote os defensores desta sala para abrir o tesouro.');return}it.hidden=true;it.opened=true;lid.rotation.x=-1.9;band.visible=false;openChest(x,z,tier,boss,reward)}};L.inter.push(it);return it;
}
function openChest(x,z,tier,boss,reward=null){
  const zb460=boss&&!!L.ow460&&L.gate?.layout103==='floors',depth=reward?.depth??(zb460?2:dungeonFloorAt(z)),floorTreasure=!!reward||(boss&&(!!L.floors||zb460));
  if(!boss&&!floorTreasure&&!goblinDungeon118(L.gate)&&!L.G?.th?.natural124&&!(L.special&&L.special.kind==='tower')&&Math.random()<.12){const e=mkEnemy({n:'Mímico',hp:150,dmg:16,spd:3.8,ai:'lunge',range:1.6,wind:.35,atkCd:1.4,xp:40,scale:1.2,body:0x6b3f1f,skin:0xffd070,eye:0xff2020,wep:'none',r:.7},x,z,GR[tier].hp,GR[tier].dmg,{gr:tier});makeElite(e);e.name='Mímico';e.gold=300*GR[tier].gold;e.xp*=GR[tier].xp;e.aggro=true;bigText('MÍMICO!',900);sfx('boom');toast('O baú era um monstro!');narratorEvent105('mimic');return}
  narratorEvent105('treasure');const gold=Math.round(rnd(40,70)*GR[tier].gold*(boss?3:1)*(L.gate&&L.gate.red?2:1));run.gold+=gold;floater(x,z,'+'+gold+' ouro','#ffd54f',true);fxBurst(x,1,z,0xffd070,16,5);beep(990,.12,.05);
  if((L.special?.kind!=='tower'||boss)&&(boss||floorTreasure||Math.random()<(hasT('lord')?.85:.75)))addItem(rollItem(tier,boss,depth,floorTreasure?depth+1:0));setDrop153(boss,x,z);if(boss&&(boss.threat184||0)>=9){profile.godKills192=(profile.godKills192||0)+1;profile.godCalm237=gameDay198()+3;storyCh220('act10');bigText('MATADOR DE DEUSES',2200)}if(boss)uniqueDrop183(boss.threat183||0);if(boss&&L.gate&&(L.gate.aff||[]).includes('rage'))addItem(rollItem(tier,true,depth,1));
  if(Math.random()<.4){run.pots++;floater(x,z,'+POÇÃO','#ff8fa3',false,3)}
  saveRun();
}

/* --- v456: AS FENDAS COMO "OUTROS MUNDOS" (EXPEDIÇÕES DE SEMANAS + PASSAGEM DO TEMPO) --- */
const OTHERWORLDS456=[
  {id:'erebo',name:'Planeta Érebo · Abismo Violeta',bio:'cristal',skyCol:0x140826,fogCol:0x1e0e38,lightCol:0xc69aff,moonCol:0xa864ff,floraTint:0x9b5de5,gravMul:0.82,weather:'Vento de Miasma Astral'},
  {id:'esporo',name:'Dimensão Xylo · Esporo-Esmeralda',bio:'pantano',skyCol:0x071f18,fogCol:0x0d2e24,lightCol:0x7cf4c2,moonCol:0x52e59b,floraTint:0x38d399,gravMul:0.90,weather:'Neblina Bioluminescente'},
  {id:'forja',name:'Mundo Pyra · Crepúsculo Carmesim',bio:'vulcao',skyCol:0x24090d,fogCol:0x331015,lightCol:0xff9478,moonCol:0xff5a36,floraTint:0xd94e34,gravMul:1.12,weather:'Cinzas Eclipsadas'},
  {id:'crio',name:'Plano Nifl · Éter Crio-Astral',bio:'neve',skyCol:0x081a2b,fogCol:0x10283d,lightCol:0x9ce8ff,moonCol:0x60d2ff,floraTint:0x64dfdf,gravMul:0.78,weather:'Aurora Dimensional Fria'},
  {id:'ambar',name:'Mundo Kemet · Deserto de Âmbar Temporal',bio:'deserto',skyCol:0x231709,fogCol:0x36230e,lightCol:0xffd280,moonCol:0xffaa33,floraTint:0xe09f3e,gravMul:0.88,weather:'Tempestade de Quartzo Dourado'}
];
function pickOtherworld456(g,th){
  const bio=g?.biome124||th?.habitat124||'campos';
  const byBio={cristal:0,floresta:1,pantano:1,flores:1,vulcao:2,neve:3,deserto:4,campos:0};
  const idx=byBio[bio]??Math.abs((g?.seed||1)*17)%OTHERWORLDS456.length;
  return {...OTHERWORLDS456[idx],zones:['Zona 1 · Fronteira da Fenda','Zona 2 · Ermos do Outro Mundo','Zona 3 · Cidadela do Soberano']};
}
function setupOtherworld456(g,rooms,bi,mids,R,randIn){
  if(!L||L.mode!=='dungeon')return;
  const ow=L.otherworld456||pickOtherworld456(g,L.G?.th);
  L.otherworld456=ow;
  if(L.ow460&&window.OW460){OW460.setupHunt(g,rooms,bi,mids,R);return;} /* v460: sinais e recursos espalhados pelo mundo aberto */
  // 1. Domo Celeste Alienígena + Luas Gêmeas + Anéis Planetários + Estrelas Dimensionais
  const skyGrp=new THREE.Group();skyGrp.name='otherworld-sky456';
  const dome=new THREE.Mesh(new THREE.SphereGeometry(210,24,16),new THREE.MeshBasicMaterial({color:ow.skyCol,side:THREE.BackSide,depthWrite:false}));
  skyGrp.add(dome);
  const moon1=new THREE.Mesh(new THREE.SphereGeometry(14,20,16),new THREE.MeshBasicMaterial({color:ow.moonCol,fog:false}));
  moon1.position.set(-65,88,-110);skyGrp.add(moon1);
  const ring1=new THREE.Mesh(new THREE.RingGeometry(18,26,36),new THREE.MeshBasicMaterial({color:ow.lightCol,side:THREE.DoubleSide,transparent:true,opacity:0.55,fog:false}));
  ring1.position.copy(moon1.position);ring1.rotation.set(1.1,0.4,0.2);skyGrp.add(ring1);
  const moon2=new THREE.Mesh(new THREE.SphereGeometry(7.5,16,12),new THREE.MeshBasicMaterial({color:ow.lightCol,fog:false}));
  moon2.position.set(54,72,-95);skyGrp.add(moon2);
  // Estrelas / Esporos suspensos no céu do Outro Mundo
  const starGeo=new THREE.BufferGeometry(),starPts=[];
  for(let i=0;i<160;i++){
    const a=R()*TAU,el=0.18+R()*1.2,rad=135+R()*40;
    starPts.push(Math.cos(a)*Math.cos(el)*rad,Math.sin(el)*rad,Math.sin(a)*Math.cos(el)*rad);
  }
  starGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPts,3));
  const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:ow.lightCol,size:1.6,transparent:true,opacity:0.85,fog:false}));
  skyGrp.add(stars);
  L.group.add(skyGrp);

  // 2. Classifica as salas em 3 Zonas de Profundidade até a Cidadela do Chefe
  const en=rooms[0],br=rooms[bi];
  const maxD=Math.max(1,Math.hypot(br.wx-en.wx,br.wz-en.wz));
  rooms.forEach((r,i)=>{
    const d=Math.hypot(r.wx-en.wx,r.wz-en.wz)/maxD;
    r.zone456=i===0?1:i===bi?3:(d<0.45?1:d<0.82?2:3);
  });

  // 3. Rastros / Sinais de Energia através das Zonas (Caçada ao Chefe)
  const cand=mids.slice().sort((a,b)=>{
    const da=Math.hypot(rooms[a].wx-en.wx,rooms[a].wz-en.wz);
    const db=Math.hypot(rooms[b].wx-en.wx,rooms[b].wz-en.wz);
    return da-db;
  });
  const sigRooms=[];
  if(cand.length>=3){
    sigRooms.push(cand[0],cand[Math.floor(cand.length/2)],cand[cand.length-1]);
  }else{
    for(let k=0;k<Math.min(3,cand.length);k++)sigRooms.push(cand[k]);
  }
  L.riftSignalNodes456=[];
  L.riftSignalsMax456=Math.max(1,sigRooms.length);
  sigRooms.forEach((ri,idx)=>{
    const r=rooms[ri],p=randIn(r);
    const grp=new THREE.Group();grp.position.set(p.x,0,p.z);
    const cry=crystalCluster230(g.rank||2,1.35,false);grp.add(cry);
    const ring=new THREE.Mesh(new THREE.RingGeometry(1.1,1.45,24),glowS(ow.moonCol,0.85));
    ring.rotation.x=-Math.PI/2;ring.position.y=0.08;grp.add(ring);
    const sg=makeSign('RASTRO DE ENERGIA '+(idx+1)+'/'+L.riftSignalsMax456,'#d8b4ff',0.46);
    sg.position.y=3.1;grp.add(sg);
    L.group.add(grp);
    const it={
      type:'riftSignal456',idx,room:ri,x:p.x,z:p.z,r:3.2,grp,tracked:false,
      label:'F · RASTREAR SINAL DE ENERGIA ('+(idx+1)+'/'+L.riftSignalsMax456+')',
      use:()=>trackRiftSignal456(it)
    };
    L.inter.push(it);
    L.riftSignalNodes456.push(it);
  });

  // 4. Recursos Exóticos do Outro Mundo (Lenha Abissal, Fungos/Frutas Astrais e Minério Abissal)
  const resTypes=['lenha_abissal','fungo_astral','minerio_abissal'];
  mids.forEach((ri,k)=>{
    const r=rooms[ri],p=randIn(r),kind=resTypes[k%resTypes.length];
    const grp=new THREE.Group();grp.position.set(p.x,0,p.z);
    let label='';
    if(kind==='lenha_abissal'){
      const trunk=mesh(geo('owWood456',()=>new THREE.CylinderGeometry(0.22,0.35,1.5,6)),toonS(0x3a2846));
      trunk.position.y=0.75;trunk.rotation.z=0.18;grp.add(trunk);
      const glow=crystalCluster230(g.rank||1,0.65,false);glow.position.y=0.2;grp.add(glow);
      label='F · CORTAR LENHA E RESINA DO OUTRO MUNDO';
    }else if(kind==='fungo_astral'){
      const stem=mesh(geo('owStem456',()=>new THREE.CylinderGeometry(0.12,0.18,0.65,7)),toonS(0xd8c8f0));stem.position.y=0.32;grp.add(stem);
      const cap=mesh(geo('owCap456',()=>new THREE.SphereGeometry(0.48,12,8,0,TAU,0,Math.PI*0.6)),glowS(ow.moonCol,0.8));cap.position.y=0.62;grp.add(cap);
      label='F · COLHER FUNGOS E ERVAS DO OUTRO MUNDO';
    }else{
      const rock=mesh(geo('owOreRock478',()=>new THREE.DodecahedronGeometry(0.85,1)),toonS(0x3e3848));
      rock.position.y=0.55;rock.scale.set(1.2,0.85,1.1);grp.add(rock);
      const veins=crystalCluster230(g.rank||2,0.9,false);
      veins.position.set(0.1,0.4,0.1);grp.add(veins);
      label='F · MINERAR MINÉRIO E CRISTAIS DO OUTRO MUNDO';
    }
    L.group.add(grp);
    const it={
      type:'riftRes456',kind,x:p.x,z:p.z,r:2.8,grp,charges:2,
      label,
      use:()=>gatherOtherworldRes456(it)
    };
    L.inter.push(it);
  });
}

function trackRiftSignal456(it){
  if(!it||it.tracked||!L)return false;
  it.tracked=true;it.hidden=true;
  if(it.grp)it.grp.visible=false;
  L.riftSignals456=(L.riftSignals456||0)+1;
  L.riftDays456=(L.riftDays456||1)+3; // Dias de jornada rastreando através das zonas do Outro Mundo
  const br=L.rooms[L.bossRoom];
  const nextNode=(L.riftSignalNodes456||[]).find(n=>!n.tracked);
  const target=nextNode||br;
  if(target){
    const a=Math.atan2((target.x??target.wx)-player.x,(target.z??target.wz)-player.z);
    for(let s=1;s<=5;s++){
      fxRing(player.x+Math.sin(a)*s*1.8,player.z+Math.cos(a)*s*1.8,L.otherworld456?.moonCol||0xb070ff,0.9,0.6);
    }
  }
  sfx('portal');
  if(L.ow460&&window.OW460)OW460.onSignal(it);
  gainXp(Math.round(45*GR[L.gate?.rank||0].xp),'explore');
  if(L.riftSignals456>=L.riftSignalsMax456){
    if(L.ow460)toast('<b>[RASTRO COMPLETO · DIA '+L.riftDays456+' NO OUTRO MUNDO]</b> Os três sinais falaram. Não há mapa para a Cidadela: siga o último rastro e os veios do chão.',6000); /* v461: sem marcação */
    else{bigText('CIDADELA DO CHEFE LOCALIZADA',2200);
    toast('<b>[RASTRO COMPLETO · DIA '+L.riftDays456+' NO OUTRO MUNDO]</b> Você triangulou os sinais de energia! A Cidadela do Soberano foi revelada no mapa.',5500);}
    if(br&&!L.ow460)L.seen.add(L.bossRoom);
  }else{
    toast('<b>[SINAL '+L.riftSignals456+'/'+L.riftSignalsMax456+' · DIA '+L.riftDays456+' NO OUTRO MUNDO]</b> Rastro energético seguido! Monte seu Acampamento Portátil [B] se precisar descansar ou cozinhar antes da próxima zona.',5000);
  }
  return true;
}

function gatherOtherworldRes456(it){
  if(!it||it.hidden||!window.Surv437)return false;
  it.charges=(it.charges||1)-1;
  if(it.kind==='lenha_abissal'){
    Surv437.add('lenha',2,true);Surv437.add('galho',2,true);Surv437.add('resina',1,true);
    floater(it.x,it.z,'+2 Lenha · +1 Resina','#d8b4ff',true);
    toast('<b>[OUTRO MUNDO]</b> Você cortou <b>Lenha Abissal</b> e <b>Resina</b> para manter sua Fogueira e selar Invólucros!');
  }else if(it.kind==='fungo_astral'){
    Surv437.add('cogu_bom',2,true,0);Surv437.add('erva',1,true);Surv437.add('fibra',2,true);
    floater(it.x,it.z,'+2 Fungos Frescos · +Erva','#7cf4c2',true);
    toast('<b>[OUTRO MUNDO]</b> Você colheu <b>Fungos Comestíveis (100% Frescos)</b>, <b>Erva</b> e <b>Fibras</b>!');
  }else{
    Surv437.add('minerio',2,true);Surv437.add('pedra',3,true);Surv437.add('cristal',1,true);
    floater(it.x,it.z,'+2 Minério · +3 Pedras · +1 Cristal','#b8c8ff',true);
    toast('<b>[OUTRO MUNDO]</b> Você minerou <b>Minério Abissal</b>, <b>Pedras</b> e <b>Cristais Puros</b>!');
    sfx('hit');
  }
  sfx('step');
  if(it.charges<=0){
    it.hidden=true;
    if(it.grp)it.grp.visible=false;
  }
  Surv437.save();
  return true;
}

function spawnRiftAftermath456(gx,gz,rank,daysPassed){
  if(!L||L.mode!=='world'||!L.group)return;
  if(window.WorldSim479)WorldSim479.simulate(daysPassed,{fromRift:true,rank});
  const grp=new THREE.Group();
  const y0=typeof terrH==='function'?terrH(gx,gz):0;
  grp.position.set(gx,y0,gz);
  grp.userData.terrainAbsolute245=true;
  // Cratera / Solo Chamuscado do Cerco Contido
  const scorch=new THREE.Mesh(new THREE.RingGeometry(2.2,9.5,32),new THREE.MeshBasicMaterial({color:0x1a1118,transparent:true,opacity:0.68,side:THREE.DoubleSide,depthWrite:false}));
  scorch.rotation.x=-Math.PI/2;scorch.position.y=0.06;grp.add(scorch);
  // Estilhaços de Cristal Selado e Barricadas da Ordem
  for(let i=0;i<8;i++){
    const a=(i/8)*TAU+0.2,d=5.2+(i%3)*1.6;
    const px=Math.cos(a)*d,pz=Math.sin(a)*d;
    const dy=(typeof terrH==='function'?terrH(gx+px,gz+pz):y0)-y0;
    const post=mesh(geo('siegePost456',()=>new THREE.CylinderGeometry(0.14,0.18,1.4,6)),toonS(0x4a3525));
    post.position.set(px,dy+0.6,pz);post.rotation.set((i%2?0.32:-0.28),a,0.18);grp.add(post);
    if(i%2===0){
      if(window.OW460)OW460.shard(grp,px*0.75,dy-0.05,pz*0.75,1.1+(i%3)*.35,0x9a7cff); /* v460: cristal do Tripo, sem o cristal antigo */
    }
  }
  L.group.add(grp);
  const it={
    type:'aftermath456',x:gx,z:gz+3.2,r:3.5,
    label:'F · RELATÓRIO DO CERCO ('+daysPassed+' DIAS DE EXPEDIÇÃO)',
    use:()=>showRiftTimeReport456(daysPassed,rank)
  };
  L.inter.push(it);
}

function showRiftTimeReport456(daysPassed,rank){
  if(window.WorldSim479){
    let h=WorldSim479.generateRiftReportHtml(daysPassed,rank);
    h+='<div style="text-align:center;margin-top:14px"><button class="btn hot" onclick="WorldSim479.openCouncilView(\'aster\')">Ver Conselho e Governantes</button></div>';
    openModal('IMPACTO TEMPORAL · '+daysPassed+' DIAS DEPOIS',h);
    return;
  }
  const caps=(run&&run.capitalStatus456)||[
    {n:'Aster',st:'Guarnição reforçada; caravanas mantiveram o abastecimento durante as '+Math.round(daysPassed/7)+' semanas.'},
    {n:'Solaria',st:'Escudos solares contiveram 3 ondas de fendas secundárias no horizonte.'},
    {n:'Ymiria',st:'Nevasca severa nas muralhas; patrulhas queimaram estoques extras de lenha.'},
    {n:'Zahar',st:'Tempestades de areia mudaram as dunas; batedores seguraram o perímetro.'},
    {n:'Urdan & Verden',st:'Sentidos de vigília dobrados enquanto você esteve no Outro Mundo.'}
  ];
  let h='<div class="sysline"><b>'+daysPassed+' dias se passaram em Primeva desde que você entrou na Fenda.</b><br>O fluxo temporal dentro do Outro Mundo corre em escala diferente da superfície. Enquanto você sobreviveu e caçou o Soberano lá dentro, semanas se passaram do lado de fora:</div>';
  h+=row('Arredores da Fenda Selada','Marcas visíveis de cerco contido, barricadas da Ordem chamuscadas, cristais drenados e clima alterado pela onda de choque dimensional.','');
  for(const c of caps)h+=row('Capital · '+c.n,c.st,'');
  openModal('IMPACTO TEMPORAL · '+daysPassed+' DIAS DEPOIS',h);
}

