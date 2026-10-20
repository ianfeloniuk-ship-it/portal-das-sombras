/* escolhas: salvar ou abandonar cidades */
const karma=()=>clamp(profile.karma||0,-10,10);
function updInvasion(dt){if(profile?.classless)return;const I=L.inv;if(!I)return;if(!I.raid348){I.raid348=true;RAID155[I.c.id]=RAID155[I.c.id]||{hp:100,warned:false};for(const e of (I.targets116||enemies.filter(e=>e.inv)))if(!e.dead)e.raid155={city:I.c.id,cx:I.c.x,cz:I.c.z,tx:I.c.x,tz:I.c.z};}I.t-=dt;const alive=(I.targets116||enemies.filter(e=>e.inv)).filter(e=>!e.dead).length;if(alive===0){L.inv=null;regionInvasion116(I,true);bigText('CIDADE SALVA',1300)}else if(I.t<=0){L.inv=null;regionInvasion116(I,false)}}
const choiceMul=()=>{const c=nearestCity(player.x,player.z).c,r=regionState116(c);return (1-karma()*.015)*(1-regionDiscount116(r)/100)*(1+r.damage/100)};
/* reconstruir cidade caída */
const rebuildCost=()=>({gold:servicePrice265('rebuild'),cry:30});
/* v221 (Ian): quando uma capital cai, a fonte e o pedestal da Pedra-Âncora se rompem e uma Fenda vermelha gigante abre no centro.
   Só dá para reconstruir depois de fechá-la. Ao reconstruir, a âncora volta a ficar vulnerável. */
/* v222 (Ian): cada Fenda da Âncora guarda um pedaço do Arquiteto (nível ???). Feito para grupo: leve aliados. */
const PIECES222=['Braço Esquerdo','Braço Direito','Pernas','Tronco','Cabeça'];
/* v223 (Ian): as 5 capitais em volta de Aster guardam os 5 pedaços. Romper uma avisa o mundo todo.
   As 5 rompidas: o Arquiteto se monta e marcha para Aster, o último refúgio. Se chegar: FIM DO CICLO, o jogo recomeça do zero (perde tudo, até rank, casa e banco).
   Se for derrotado: relíquias, título e o Ato XIII. */
/* v250 (Ian): peças do Arquiteto como as esferas do dragão. Quando uma âncora se rompe, a peça FOGE para longe.
   Fechar a Fenda não basta: é preciso caçar a peça e trancá-la (derrotá-la). Se as cinco estiverem soltas ao mesmo tempo,
   elas se juntam na capital da última que fugiu (cinemática) e o Arquiteto marcha para Aster. */
const PBONES250=[['arm_L','fore_L','hand_L'],['arm_R','fore_R','hand_R'],['root','hips','thigh_L','shin_L','thigh_R','shin_R'],['chest'],['head']];
function pieceMesh250(i){const G=ARCH242.g;if(!G)return null;const sc=G.scene;sc.updateMatrixWorld(true);let sm=null;sc.traverse(o=>{if(o.isSkinnedMesh&&!sm)sm=o});if(!sm)return null;
 const want=new Set(PBONES250[i].map(n=>sm.skeleton.bones.findIndex(b=>b.name===n)).filter(k=>k>=0)),g=sm.geometry,SI=g.attributes.skinIndex,SW=g.attributes.skinWeight,I=g.index.array,keep=[];
 const main=v=>{let b=SI.getX(v),w=SW.getX(v);if(SW.getY(v)>w){w=SW.getY(v);b=SI.getY(v)}return b};
 for(let t=0;t<I.length;t+=3)if(want.has(main(I[t]))&&want.has(main(I[t+1]))&&want.has(main(I[t+2])))keep.push(I[t],I[t+1],I[t+2]);
 const ng=new THREE.BufferGeometry();ng.setAttribute('position',g.attributes.position);ng.setAttribute('normal',g.attributes.normal);if(g.attributes.uv)ng.setAttribute('uv',g.attributes.uv);ng.setIndex(keep);
 const mesh=new THREE.Mesh(ng,archMat247(sm.material,false));mesh.matrixAutoUpdate=false;mesh.matrix.copy(sm.matrixWorld);
 const bb=new THREE.Box3().setFromObject(sc),k=9/((bb.max.y-bb.min.y)||1),inner=new THREE.Group();inner.add(mesh);inner.scale.setScalar(k);inner.updateMatrixWorld(true);
 const pb=new THREE.Box3().setFromObject(inner),c=pb.getCenter(new THREE.Vector3());inner.position.sub(c);const g2=new THREE.Group();g2.add(inner);
 const goo=new THREE.Mesh(new THREE.SphereGeometry(Math.max(.6,pb.getSize(new THREE.Vector3()).length()*.09),24,18),goo250());g2.add(goo);g2.userData.size=pb.getSize(new THREE.Vector3());return g2}
function pieceAttach250(nb,i){const f=pieceMesh250(i);if(!f)return false;nb.m.root.children.forEach(c=>c.visible=false);f.traverse(o=>o.frustumCulled=false);nb.m.root.add(f);nb.frag250=f;const s=nb.m.root.scale.y||1;f.scale.setScalar(1/s);return true}
function pieceDir250(dx,dz){const a=(Math.atan2(dx,-dz)*180/Math.PI+360)%360;return ['N','NE','L','SE','S','SO','O','NO'][Math.round(a/45)%8]}
function pieceHud250(){const P=profile&&profile.piece250;if(!P)return '';const ks=Object.keys(P);if(!ks.length||!player)return '';let best=null,bd=1e12;for(const k of ks){const p=P[k],d=Math.hypot(p.x-player.x,p.z-player.z);if(d<bd){bd=d;best=p}}
 return ' · PEÇAS SOLTAS '+ks.length+'/5 · '+PIECES222[best.i]+' '+distTxt(bd)+' '+pieceDir250(best.x-player.x,best.z-player.z)}
function pieceFlee250(c,i){const P=profile.piece250=profile.piece250||{};if(P[c.id])return;const a=Math.random()*TAU,d=3000+Math.random()*9000;P[c.id]={i,x:c.x+Math.cos(a)*d,z:c.z+Math.sin(a)*d,from:c.id};store.set('pds2_profile',profile);
 showSys('O <b>'+PIECES222[i]+'</b> do Arquiteto fugiu de '+c.name+' e se escondeu a '+distTxt(d)+' dali. Fechar a Fenda não o prende. Ache e tranque a peça antes que as cinco se soltem.')}
function pieceTick250(dt){const P=profile&&profile.piece250;if(!P||!player||L.mode!=='world')return;
 for(const id in P){const p=P[id];const e=enemies.find(x=>x.piece250===id&&!x.dead);const d=Math.hypot(p.x-player.x,p.z-player.z);
  if(e){p.x=e.x;p.z=e.z;if(!e.frag250)pieceAttach250(e,p.i);/* v449 (Ian): se o modelo do Arquiteto ainda não tinha carregado, a peça nascia com o corpo de chefe genérico; tenta de novo */if(e.frag250){e.m.root.children.forEach(c=>{if(c!==e.frag250)c.visible=false});const f=e.frag250;f.rotation.y+=dt*.4;f.position.y=(f.userData.size.y*.5+1.2)+Math.sin(time*1.3)*.4}continue}
  if(d<170){const nb=spawnBoss(p.x,p.z,9,{n:PIECES222[p.i],types:['seismic','soulrain'],body:0x3a2a55,scale:2.6,skill:S('Eco do Arquiteto','rain',7,40,3,0xb68cff)});
   nb.piece250=id;nb.wild=true;nb.world=true;nb.bars=3;nb.hp*=5;nb.maxhp*=5;nb.dmg*=1.25;threatApply184(nb,11);nb.name='[Supremo] '+PIECES222[p.i]+' do Arquiteto';nb.roam={x:p.x,z:p.z};
   pieceAttach250(nb,p.i);
   if(!p.seen){p.seen=1;toast('<b>[ORDEM]</b> Você achou o '+PIECES222[p.i]+' do Arquiteto. Derrote-o para trancá-lo de volta.',6000)}}}}
function pieceSeal250(e){const P=profile.piece250||{},p=P[e.piece250];if(!p)return;delete P[e.piece250];profile.pieceSealed250=(profile.pieceSealed250||0)+1;run.gold+=150000;store.set('pds2_profile',profile);
 bigText('PEÇA TRANCADA',2200);sfx('gong');toast('<b>[ORDEM]</b> O '+PIECES222[p.i]+' voltou para a âncora. +150.000 de ouro.',6000)}
/* cinemática de junção: cinco correntes de líquido da fenda convergem e o Arquiteto se forma */
function joinCine250(x,z){window.CINE231={x,z,t:0,dur:8};const g=new THREE.Group();scene.add(g);const parts=[];for(let i=0;i<5;i++){const a=i/5*TAU,m=new THREE.Mesh(new THREE.SphereGeometry(1.4,20,14),goo250());g.add(m);parts.push({m,a})}
 shake(.6);sfx('gong');bigText('AS CINCO PEÇAS SE JUNTAM',3000);
 fxCustom(new THREE.Group(),5,(o,k)=>{const r=90*(1-k*k);for(const p of parts){p.m.position.set(x+Math.cos(p.a+k*3)*r,6+Math.sin(k*9+p.a)*3+ (1-k)*20,z+Math.sin(p.a+k*3)*r);p.m.scale.setScalar(1+k*1.5)}if(k>.98){scene.remove(g);fxRing(x,z,0x9566ed,40,1.2);shake(1);bigText('O ARQUITETO DESPERTOU',3000)}})}
function caps223(){return [[5,0],[-5,0],[0,5],[0,-5],[5,5]].map(([a,b])=>regionCity(a,b))}
function archHud223(){const k=caps223().filter(anchorOpen221).length,A=profile&&profile.arch223;if(A)return ' · O ARQUITETO MARCHA PARA ASTER: '+distTxt(Math.hypot(A.x,A.z));return pieceHud250()}
function archTick223(dt){if(!profile||!run||!player||profile.classless)return;const W=profile.anch223=profile.anch223||{};let k=0;
 caps223().forEach((c,i)=>{const open=anchorOpen221(c);if(open)k++;if(open&&!W[c.id]){W[c.id]=1;store.set('pds2_profile',profile);const d=distTxt(Math.hypot(c.x-player.x,c.z-player.z));bigText('ÂNCORA ROMPIDA',2000);sfx('gong');showSys('A Pedra-Âncora de <b>'+c.name+'</b> ('+d+') se rompeu. Feche a Fenda e reconstrua a capital.');pieceFlee250(c,i);profile.lastPiece250=c.id}
  else if(!open&&W[c.id]){delete W[c.id];store.set('pds2_profile',profile);toast('<b>[ORDEM]</b> A âncora de '+c.name+' está selada de novo.',5000)}});
 let A=profile.arch223;
 pieceTick250(dt);const nf=Object.keys(profile.piece250||{}).length;if(!A&&nf>=5){const c=caps223().find(q=>q.id===profile.lastPiece250)||caps223()[4];A=profile.arch223={x:c.x,z:c.z,hp:1,cine:0};for(const id in profile.piece250){const e=enemies.find(x=>x.piece250===id&&!x.dead);if(e){e.dead=true;if(e.m.root.parent)e.m.root.parent.remove(e.m.root)}}profile.piece250={};store.set('pds2_profile',profile);shake(.8);if(Math.hypot(c.x-player.x,c.z-player.z)<450&&L.mode==='world'){A.cine=1;joinCine250(c.x,c.z)}else bigText('O ARQUITETO DESPERTOU',3000);showSys('As cinco peças estavam soltas e se juntaram em '+c.name+'. O Arquiteto marcha para <b>Aster</b>. Se ele chegar, este mundo acaba e tudo recomeça do zero. Reúna aliados e detenha-o.')}
 if(!A)return;const b=enemies.find(e=>e.arch223&&!e.dead);
 if(b){A.x=b.x;A.z=b.z;A.hp=b.hp/b.maxhp}
 const d=Math.hypot(A.x,A.z),sp=1.6*dt;if(d>1&&!(b&&b.aggro)){A.x-=A.x/d*sp;A.z-=A.z/d*sp;if(b){b.x=A.x;b.z=A.z;b.m.root.position.set(b.x,0,b.z);b.roam={x:A.x,z:A.z}}}
 if(!b&&!A.cine&&Math.hypot(A.x-player.x,A.z-player.z)<300&&L.mode==='world'){A.cine=1;store.set('pds2_profile',profile);joinCine250(A.x,A.z)}
 if(!b&&Math.hypot(A.x-player.x,A.z-player.z)<140&&L.mode==='world'){const nb=spawnBoss(A.x,A.z,9,{n:'O Arquiteto',types:['seismic','fury','soulrain'],body:0x3a2a55,scale:4.2,skill:S('Mão do Arquiteto','rain',8,60,4,0xffd070)});nb.arch223=true;nb.wild=true;nb.world=true;nb.bars=5;nb.hp*=14;nb.maxhp*=14;nb.hp=nb.maxhp*Math.max(.05,A.hp);nb.dmg*=1.6;threatApply184(nb,10);nb.name='[Inefável] O Arquiteto';try{if(window.Boss160){Boss160.env={L:()=>L,P:()=>player};if(!arch242(nb))Boss160.attach(nb,'devorador',9)}}catch(_){}/* v224: modelo próprio, gigante, escuro e dourado */nb.roam={x:A.x,z:A.z}}
 if(Math.hypot(A.x,A.z)<55)endCycle223()}
function archWin223(b){profile.arch223=null;profile.piece250={};profile.archKills223=(profile.archKills223||0)+1;profile.anchorShut221=profile.anchorShut221||{};for(const c of caps223())profile.anchorShut221[c.id]=1;const r=relics183();for(const k in UNIQ183)r.own[k]=1;run.gold+=1e6;store.set('pds2_profile',profile);
 bigText('A PORTA FOI FECHADA',3000);sfx('level');storyCh220('act13');toast('<b>[ORDEM]</b> O Arquiteto caiu. Todas as relíquias são suas, +1.000.000 de ouro e o título Quem Fechou a Porta.',9000)}
function endCycle223(){if(window._wipe)return;window._wipe=1;paused=true;let n=0;try{n=+(localStorage.getItem('pds_cycles')||0)+1;localStorage.setItem('pds_cycles',n)}catch(e){}
 const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;z-index:99;background:rgba(0,0,0,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#ffd8d8;text-align:center;padding:24px;font-size:18px';d.innerHTML='<h1 style="color:#ff4d6a;letter-spacing:4px">FIM DO CICLO</h1><p>O Arquiteto chegou a Aster. Este mundo foi recolhido.</p><p>Tudo recomeça do zero: personagem, rank, casa e banco.</p><p style="opacity:.7">Ciclos perdidos: '+n+'</p>';document.body.appendChild(d);
 setTimeout(()=>{store.set=()=>{};store.del('pds2_profile');store.del('pds3_run');try{removeEventListener('pagehide',saveRunPH)}catch(e){}location.reload()},9000)}
function anchorOpen221(c){return !!(c&&c.capital&&c.name!=='Aster'&&cityFallen(c)&&!(profile.anchorShut221||{})[c.id])}
function anchorTick221(){if(!player||L.mode!=='world')return;const aster=regionCity(0,0);for(const g of gates)if(!g.dead&&g.anchor221===aster.id){g.dead=true;if(g.mesh?.parent)g.mesh.parent.remove(g.mesh)}if(profile?.classless)return;const n=nearestCity(player.x,player.z),c=n.c;if(!c||!c.capital||n.d>700)return;const has=gates.find(g=>g.anchor221===c.id&&!g.dead);
 if(anchorOpen221(c)&&!has){const rank=clamp(rankOf()+1,2,9);const g={id:++gateSeq,x:c.x,z:c.z+3,rank,piece222:rh(c.cx,c.cz,5)%5,lvl207:Math.max(portalLvl207(rank),run.level)+20,aff:rollAff(Math.max(6,rank)),double:false,red:true,giant:true,life:1e9,max:1e9,seed:(Math.random()*2**31)|0,layout103:null,cleared:false,dead:false,anchor221:c.id};gates.push(g);gateMesh(g);if(g.mesh)g.mesh.scale.setScalar(2.4);
  if(n.d<300){ruptureCine231(c,g);showSys('A Pedra-Âncora de <b>'+c.name+'</b> se rompeu. Uma Fenda vermelha gigante abriu no centro da cidade. Lá dentro pulsa um pedaço do Arquiteto. Ninguém consegue medir o nível dele. Leve aliados.')}}
 else if(has&&!anchorOpen221(c)){has.dead=true;if(has.mesh&&has.mesh.parent)has.mesh.parent.remove(has.mesh)}}
function cityRank372(c){return clamp(Number.isInteger(c.rank)?c.rank:danger(c.x+90,c.z),0,9)}
function eligibleCrystals372(c){return run.res.cry.reduce((n,v,i)=>n+(i>=cityRank372(c)?Math.max(0,Number(v)||0):0),0)}
function rebuildView(c){view=()=>rebuildView(c);if(anchorOpen221(c)){openModal('RECONSTRUIR '+c.name.toUpperCase(),'<div class="sysline">A Fenda da Âncora ainda está aberta no centro de '+c.name+'. Entre e derrote o guardião para fechá-la; só depois dá para reconstruir.</div>');return}const left=enemies.filter(e=>!e.dead&&e.breaker&&Math.hypot(e.x-c.x,e.z-c.z)<45).length,k=rebuildCost(),tot=eligibleCrystals372(c);
  let h='<div class="sysline">'+c.name+' caiu. Para reconstruir: expulse os monstros e doe material para os sobreviventes.</div>';
  h+=row('1. Expulsar os monstros',left?'<span style="color:#ff8fa3">Restam '+left+' monstros na cidade</span>':'<span style="color:#6fe39a">Cidade limpa</span>','');
  h+=row('2. Doar material',fmt(k.gold)+' ouro + '+k.cry+' cristais de Ranque '+GR[cityRank372(c)].id+' ou superior · você tem '+fmt(run.gold)+' / '+tot,btn(left?'Limpe a cidade antes':run.gold<k.gold?'Falta ouro':tot<k.cry?'Faltam cristais':'RECONSTRUIR','rebuild',c.id,!left&&run.gold>=k.gold&&tot>=k.cry,'hot'));
  openModal('RECONSTRUIR '+c.name.toUpperCase(),h)}
function doRebuild(id){const c=nearestCity(player.x,player.z).c,no344=t=>{toast('<b>[RECONSTRUÇÃO]</b> '+t,6000);sfx('block')};if(anchorOpen221(c))return no344('A Fenda da Âncora ainda está aberta.');if(c.id!==id||L.mode!=='world'||player.dead||!cityFallen(c))return;if(Math.hypot(player.x-c.x,player.z-c.z)>45)return no344('Chegue mais perto do marco no centro da cidade.');{const left344=enemies.filter(e=>!e.dead&&e.breaker&&Math.hypot(e.x-c.x,e.z-c.z)<45).length;if(left344)return no344('Ainda há '+left344+' monstro(s) na cidade. Eles aparecem em laranja no mapa.')}const k=rebuildCost(),tot344=eligibleCrystals372(c);if(run.gold<k.gold)return no344('Falta ouro: custa '+fmt(k.gold)+' e você tem '+fmt(run.gold)+'.');if(tot344<k.cry)return no344('A pureza desses cristais é insuficiente para restaurar a estrutura desta cidade (exige 30 cristais de Ranque '+GR[cityRank372(c)].id+' ou superior).');if(!spendService265(k.gold))return no344('Não foi possível cobrar o ouro. Avise o erro.');let need=k.cry;for(let t=cityRank372(c);t<10&&need>0;t++){const u=Math.min(run.res.cry[t],need);run.res.cry[t]-=u;need-=u}
  profile.rebuilt=profile.rebuilt||{};profile.rebuilt[c.id]=weekId();if(profile.anchorShut221)delete profile.anchorShut221[c.id];if(profile.raided155)delete profile.raided155[c.id];regionEvent116(c,20,-20,'Você ajudou a reconstruir a cidade. Confiança +20; abastecimento recuperado.');store.set('pds2_profile',profile);
  const ch=chunks.get(c.cx+','+c.cz);if(ch){unloadChunk(ch);loadChunk(c.cx,c.cz)}closeModal();bigText(c.name.toUpperCase()+' RECONSTRUÍDA',1800);sfx('gong');sfx('level');
  toast('<b>[CIDADE]</b> '+c.name+' voltou a viver. Lojas abertas, muralhas de pé. Confiança local +20.',6000);saveRun()}
/* bolsa organizada */
/* FICHA DO PERSONAGEM: de onde vem cada número (pedido do Irror). */
/* Dano crítico: x1,7 base (x2,4 com Fúria 10). Chance acima de 100% vira dano crítico extra (+1% por 1% que sobra). */
function critChance(){return Math.round((.05+statsBonus().crit+affB().crit/100+.01*cons('fur')+(cons('fur')>=10?.1:0))*100)/100}/* v485: % inteiro */
function critMul(){return 2}
function passivesView(){view=passivesView;L.characterTab='passives';let h=characterTabs('passives')+skillPoints118()+transmigratorRow()+passiveRows263();if(profile.rank>0||profile.rankTalents?.length){h+='<div class="sec">PASSIVAS DE RANK</div>';for(const [k,t] of Object.entries(RANK_TALENTS))if(rankTalent(k)>0)h+=row(t.n+' · '+rankTalent(k)+'/'+t.max,t.d,'<b>Ativa</b>');h+=row('Escolhas de combate do rank','As escolhas e os pontos ficam em Personagem → Rank.',btn('Ver / distribuir','character','rank'))}for(const i of passiveClasses())h+=row(CLASSES[i].n+' · '+PASSIVES[i].n,PASSIVES[i].d,'<b>Ativa</b>');const books=PBOOK.filter(b=>pb(b.k)>0);if(books.length){h+='<div class="sec">TOMOS APRENDIDOS</div>';for(const b of books)h+=row(b.n+' · NV '+pb(b.k),b.d(pb(b.k)),'<b>Ativa</b>')}
 if(unl('constel')||(run.cpts||0)>0||CONS.some(([k])=>cons(k)>0)){h+='<div class="sec">CONSTELAÇÕES</div>';for(const [key,n,d,cap] of CONS){const lv=cons(key);if(lv>0)h+=row(n+' · '+lv+'/10',d+(lv>=10?'<br>'+cap:''),'<b>Ativa</b>')}/* v171 (Irror): sem ponto não há botão. Com tudo cheio, o botão leva direto à conversão. */if((run.cpts||0)>0)h+=btn((consFull()?'Converter · ':'Distribuir · ')+run.cpts+(run.cpts===1?' ponto':' pontos'),'consv',0,true,'hot')}openModal('PERSONAGEM',h,'passives')}

function charSheet(){const s=run.stats||{},bp=bonusPool(),cb=CLS_BAL[profile.cls]||{hp:1,dmg:1,def:0},w=run.equip.w,a=run.equip.a,af=affB(),m=isMagic(),g=s.agi||0,
  P=v=>(v>=0?'+':'')+Math.round(v*100)+'%',cc=critChance(),
  // v154 (Irror): a explicação fica sempre visível, sem abrir/fechar, e diz de onde vem cada número.
  line=(n,v,d)=>'<div'+(d?' data-tip154="'+tipAttr154(d)+'" style="cursor:help;':' style="')+'display:flex;justify-content:space-between;gap:10px;padding:4px 0;border-bottom:1px solid rgba(255,179,71,.12)"><span>'+n+'</span><b style="white-space:nowrap">'+v+'</b></div>',
  pct=v=>Math.round(v)+'%',clsName=className(),Lv=run.level,k=atkPer(Lv),growth=RpgBalance.growthFor(profile.classless?'none':profile.cls),base=classBaseStats();
  let h='<div class="sec">FICHA DO PERSONAGEM</div><div style="font-size:13px">';
  /* v467 (Ian): o ataque à distância (Destreza) aparece separado do corpo a corpo (Força) e o dano por golpe segue a arma equipada */
  const wk467=weaponKind272(run.equip.w)||'',far467=rangedPhysBasic281(),mag467=!far467&&!/^(sword|axe|mace|spear|hammer)$/.test(wk467)&&(/^(staff|bonestaff|wand|tome|orb)$/.test(wk467)||basicIsMagic()),hit467=player.dmg*basicDmgMul();
  h+=line('Ataque corpo a corpo (Força)',fmt(atkOf('phy')),'Golpes físicos de perto: espada, machado, maça, lança, martelo e punhos. Sobe com Força.');
  h+=line('Ataque à distância (Destreza)',fmt(atkRanged281()),'Arco, adaga arremessada e arma de fogo, em qualquer classe (um Guerreiro de arco usa este valor, não a Força), e as habilidades de classes que atiram. Sobe com Destreza.');
  h+=line('Penetração (Destreza)',fmt(pPenVal296()),'Ignora essa quantidade da defesa do alvo antes do desconto.');
  h+=line('Ataque mágico',fmt(atkOf('mag')),'Aumenta o dano das magias.');
  h+=line('Dano por golpe ('+(mag467?'mágico':far467?'à distância':'corpo a corpo')+')',fmt(hit467),'Dano do ataque básico com a arma equipada, antes da defesa do inimigo e dos críticos.');
  h+=line('Vida',fmt(player.maxhp),'Quanto dano você suporta antes de morrer.');
  h+=line('Mana',fmt(player.maxmp),'Recurso gasto para lançar magias.');
  h+=line('Escudo',fmt(player.maxsh),'Absorve dano antes da vida. Recupera após 4s sem dano.');h+=line('Defesa (menos dano recebido)',Math.round(player.def*100)+'%','Porcentagem de dano bloqueada.');
  h+=line('Chance de crítico',pct(cc*100),'Chance de causar um acerto crítico.');
  h+=line('Dano crítico',cc<1?'×2':'×'+(1+Math.floor(cc))+(cc%1?' / ×'+(2+Math.floor(cc)):''),'Multiplicador do dano de um acerto crítico.');
  h+=line('Velocidade de ataque','+'+2*Math.floor(g/5)+'%','Ataques básicos mais frequentes. +2% a cada 5 pontos de Agilidade.');
  h+=line('Velocidade de movimento','+'+Math.round(Math.floor(g/2)+af.spd)+'%','Faz você correr mais rápido. +1% a cada 2 pontos de Agilidade, mais afixos.');
  h+=line('Recarga da esquiva','+'+dodgeFaster484()+'% mais rápida','Cada ponto de Agilidade: esquiva recarrega 1% mais rápido. Somado a títulos e constelações.');
  h+=line('Bônus de dano das habilidades','+'+preciseNumber((statsBonus().skill*(1+(setB().skill||0))-1)*100)+'%','Dano adicional das habilidades.');h+=line('Roubo de vida',Math.round(af.ls||0)+'%','Recupera vida com parte do dano causado.');
  h+='<div class="sec">BÔNUS EM % (SOMADOS)</div>';
  for(const x of bp.src)if(x[1]||x[2])h+=line(x[0],(x[1]?P(x[1])+' dano':'')+(x[1]&&x[2]?' · ':'')+(x[2]?P(x[2])+' vida':''),'');
  h+=line('Bônus de dano e de vida',P(bp.dmg)+' → <span style="color:#ffd54f">'+P(bp.edmg)+'</span> dano · '+P(bp.hp)+' → <span style="color:#ffd54f">'+P(bp.ehp)+'</span> vida','Bônus acumulados têm rendimento menor. Limite: +300%.');
  return h+'</div>'}
function bagTabs(cur){return cur==='itens'||cur==='world'?'':characterTabs(cur==='char'?'status':cur==='pow'?'skills':cur)}
function bagView(tab){tab=tab||'itens';if(tab==='char')return openCharacter118();if(tab==='pow')return characterView('skills');if(['status','skills','passives','build'].includes(tab))return characterView(tab);L.bagTab=tab;if(tab==='itens')return bagItems();if(tab==='titles')return titlesView();view=()=>bagView(tab);let h=bagTabs(tab);
  if(tab==='char'){h+=(profile.name?row(safeText(profile.name),'Seu personagem',''):'')+profRows()+'<div class="sysline">Nível '+run.level+' · Rank '+RANKS[rankOf()].id+' · '+(run.adv?ADV[profile.cls].n:CLASSES[profile.cls].n)+(run.fused?' '+run.fused.tag:'')+(profile.rebirths?' · Reencarnações: '+profile.rebirths:'')+'<br>Vida '+fmt(player.maxhp)+' · Dano '+fmt(player.dmg)+' · Defesa '+Math.round(player.def*100)+'% · Título: '+((TITLES.find(t=>t.id===profile.title)||{}).n||'nenhum')+'</div>';
    h+=row('Ataque básico',basicAttackName259()+' · '+(MAGIC_CLS.includes(basicAttackId())===basicIsMagic()?basicAttackDesc(basicAttackId()):'Corpo a corpo · usa Força'),btn('Escolher estilo','basicview',0));
    h+=row('Combinação de habilidades','Monte até '+classSlotCount()+' habilidades das classes aprendidas',btn('Personalizar','loadout',0,true,'hot'));h+=row('Passivas','Veja os efeitos ativos e onde melhorar cada um',btn('Ver passivas','passives',0));h+=equipmentPanel();h+=charSheet();
    h+=row('Status e habilidades','Atributos sobem treinando',unl('status')?btn('Abrir','status',0,true):lockMsg('status'));
    h+=row('Constelações',(run.cpts||0)+' pontos',unl('constel')?btn('Abrir','consv',0):lockMsg('constel'));
    h+=row('Bestiário','Espécies estudadas dão dano extra contra elas'+(touch?'':' (tecla J)'),btn('Abrir','bestv',0));
    h+=row('Coleção de Ecos','Todos os ecos que você já ergueu'+(touch?'':' (tecla K)'),btn('Abrir','album',0));
    h+=row('Aparência','Cabelo e roupa',btn('Abrir','look',0));
    h+=row('Reencarnação','Volta ao nível 1. Ganha: +10% no bônus somado e <b>treino 10% mais rápido</b> por reencarnação. Mantém ouro, itens e ecos; zera status, habilidades, constelações e maestria. Próxima exige nível <b>'+(100*((profile.rebirths||0)+1))+'</b>.',unl('rebirth')?btn('Reencarnar','rebirth',0,run.level>=100*((profile.rebirths||0)+1),'red'):lockMsg('rebirth'))}
  else if(tab==='pow'){const w=run.equip.w;
    h+=row('Poderes ativos (1–3)',run.stolen.length?run.stolen.map((s,i)=>(i+1)+' '+s.n).join(' · '):'Absorva essências de guardiões','');h+=libRows();
    h+=row('Habilidade fundida',run.fused?run.fused.n+' ('+run.fused.tag+')':'Aba Classe da Ordem','');
    h+=row('Ecos',run.shadows.length+' no exército',btn('Exército','army',0));
    h+=row('Arma viva',!unl('living')?lockMsg('living'):w?(w.soul?'<b>'+w.soul+'</b> · ':'')+'nível '+(w.wlv||0)+'/10'+((w.wlv||0)>=10?' · MÁXIMO':' · '+Math.floor(w.wxp||0)+' XP')+' · bônus da arma +'+2*(w.wlv||0)+'%'+(w.rar<2?' · só Épicas ou melhores despertam uma alma':'')+'<br><span style="color:var(--dim)">A arma que você usa ganha XP quando você mata: cada nível acrescenta +2% ao bônus de arma viva (até o 10). No nível 5, armas Épicas+ despertam uma alma que fala com você. Cada arma conserva sua própria experiência ao ser trocada.</span>':'Sem arma','');
    h+=row('Conjunto',!unl('sets')?lockMsg('sets'):(Object.keys(setB()).length?activeSets().map(s=>'<b>'+s.n+'</b>: '+s.d).join('<br>'):'Duas peças do mesmo conjunto ativam o bônus uma vez'),'');
    h+=row('Grupo',run.party.length?run.party.map(p=>p.name).join(', '):'Contrate na Ordem','')}
  else if(tab==='world'){if(Object.values(profile.prof||{}).some(x=>x>0))h+=btn('Profissões','professions114',0);if(run.party.length)h+=row('Grupo',run.party.map(p=>p.name).join(', '),'');h+=row('História','Páginas que você já viveu',btn('Ler','diary',0));
    h+=run.mount?row('Montaria','Lobo de Mana',btn(run.mounted?'Desmontar':'Montar','mount',0)):row('Montaria','Compre no Mercado','');
    h+=regionSummary116(nearestCity(player.x,player.z).c);
    if(run.tmap)h+=row('Mapa do tesouro','Um X marcado no seu mapa','');
    if(L.car)h+=row('Caravana','Escoltando para '+L.car.dest.name,'')}
  openModal(tab==='world'?'MUNDO':'PERSONAGEM',h)}
function extraActions3(a,v){{const r343=window.Civic343&&Civic343.action(a,v);if(r343)return r343}if(a==='region116'){regionView116();return 'close0'}if(a==='aid116'||a==='supply116'){if(a==='aid116')regionAid116();else regionSupply116();regionView116();return 'close0'}if(a==='narrator105'){narratorView105();return 'close0'}const rareAction=rareActions103(a,v);if(rareAction)return rareAction;
 if(a==='bagcategory363'){if(['equipment','materials','relics'].includes(v))L.bagCategory363=v;bagItems();return 'close0'}
 if(a==='character'){characterView(v);return 'close0'}
 if(a==='resetattributes'){redistributeAttributes();statusView();return 'close0'}
 if(a==='armorpart'){if(EQUIP_SLOTS.includes(v)&&v!=='w'){L.armorSlot=v;openShop('arm')}return 'close0'}
 if(a==='gearpick'){gearPicker(v);return 'close0'}
 if(a==='aw169yes'){closeModal();startAwakenTest155(v);return 'close'}
 if(a==='aw169no'){profile.awDeclined169=profile.awDeclined169||{};profile.awDeclined169[v]=awakenKey169(v);store.set('pds2_profile',profile);closeModal();toast('<b>[NARRADOR]</b> O chamado silencia. As peças continuam com você.',5000);return 'close'}
 if(a==='gtab166'){GEAR166.slot=v;return true}
 if(a==='gsort166'){GEAR166.sort=v;return true}
 if(a==='awtest155'){startAwakenTest155(v);return 'close'}
 if(a==='gearbag'){bagItems();return 'close0'}
 if(a==='unequip'){unequipItem(v);return true}

  if(a==='ranktalent'){chooseRankTalent(v);rankView114();return 'close0'}
  if(a==='rankreset'){resetRankTalents();rankView114();return 'close0'}
  if(a==='basicview'){basicAttackView();return 'close0'}
  if(a==='basicset'){if(selectBasicAttack(+v))basicAttackView();return 'close0'}
  if(a==='equipshop'){if(v==='wep'||v==='arm')openShop(v);return 'close0'}
  if(a==='defense'){defenseView();return 'close0'}
  if(a==='defup'){if(upgradeDefense(v))defenseView();return 'close0'}
  if(a==='econdonate'){if(window.Econ154&&Econ154.donate(v))mktView();return 'close0'}
  if(a==='domebuild'){if(window.Dome154&&Dome154.build(v))defenseView();return 'close0'}
  if(a==='domefix'){if(window.Dome154&&Dome154.repair(v))defenseView();return 'close0'}
  if(a==='rebuild'){doRebuild(v);return 'close'}
  if(a==='bagtab'){L.bagTab=v;bagView(v);return 'close0'}
  if(a==='consv'){consView();return 'close0'}
  if(a==='cons'){run.cons=run.cons||{};if((run.cpts||0)<1||cons(v)>=10)return;run.cpts--;run.cons[v]++;refreshStats();return true}
  if(a==='rebirth'){if(run.level<100*((profile.rebirths||0)+1))return;if(!L.rbOk||time-L.rbOk>6){L.rbOk=time||1;toast('<b>[NARRADOR]</b> Tem certeza? Toque em Reencarnar de novo para confirmar.',4000);return 'close0'}L.rbOk=0;profile.rebirths=(profile.rebirths||0)+1;store.set('pds2_profile',profile);run.level=1;run.xp=0;run.pts=0;run.classPts466=0;/* v465/v466: sem distribuir; os 9 pontos da classe voltam sozinhos */run.spts=0;run.cpts=0;run.mastery=0;run.stats={for:0,agi:0,per:0,int:0,vit:0};run.skl={};run.cons={};refreshStats();player.hp=player.maxhp;closeModal();bigText('REENCARNAÇÃO '+profile.rebirths,2000);sfx('arise');showSys('De volta ao começo. Mas você não é mais o mesmo.');return 'close'}
  if(a==='caravan'){closeModal();startCaravan();return 'close'}
  if(a==='tmap'){if(run.tmap||!buyMap())return;return true}
  if(a==='buyret'){const r=profile.retired[+v],t=Math.min(9,r.rank),price=retiredPrice265(t);if(r.sold||run.gold<price||!equipmentBagRoom())return;if(!spendService265(price))return;r.sold=true;store.set('pds2_profile',profile);addItem(makeItem(Math.random()<.5?'w':'a',t,2));return true}
  if(['housebuy','furn','hsleep','haltar','hput','hget'].includes(a))return houseAct(a,v);
  if(a==='loadout'){loadoutView();return 'close0'}
  if(a==='loadslot'){loadoutView(+v);return 'close0'}
  if(a==='loadset'){const [slot,id]=String(v).split('|');if(equipClassSkill(+slot,id))loadoutView();return 'close0'}
  if(a==='passives'){passivesView();return 'close0'}
  if(a==='jobsw'){switchJob(+v);return 'close'}
  if(a==='joblearn'){if(!CLASSES[+v]||CLASSES[+v].rare||!learnClass(+v))return;sfx('level');toast('<b>[CLASSE]</b> '+CLASSES[+v].n+' aprendida. Suas habilidades estão disponíveis para combinar.',6000);return true}
  if(a==='jobrare'||a==='rareconfirm'){awakeningView103();return 'close0'}
  if(a==='rktrial'){const nx=+v;if(!rankTrialReady(nx))return;closeModal();L.rankTrial=nx;buildSpecial('job');L.rankTrial=nx;toast('<b>[ORDEM]</b> Prova para o rank '+RANKS[nx].id+'. Derrote o Examinador. Não há ondas de monstros antes do duelo.',6000);return 'close'}
  if(a==='pbup'){const l=pb(v);if(l>=10||(run.spts||0)<1||run.gold<pbCost(l))return;if(!spendService265(pbCost(l)))return;run.spts--;run.pbook=run.pbook||{};run.pbook[v]=l+1;refreshStats();sfx('level');return true}
  if(a==='innup'){const l=innLv(),up=innUpgradePrice265(l);if(l>=5||!spendService265(up))return;const c=nearestCity(player.x,player.z).c;profile.innLv=profile.innLv||{};profile.innLv[c.id]=l+1;store.set('pds2_profile',profile);sfx('level');toast('<b>[POUSADA]</b> Pousada melhorada para o nível '+(l+1)+'.');return true}
  if(a==='rest'){{const p343=restPrice265();if(p343>0&&!spendService265(p343))return;if(window.Civic343)Civic343.restPaid()}narratorEvent105('rest');const il=innLv(),heal=innHeal287(il);run.rested={t:600,l:il};run.awake287=0;refreshStats();player.hp=Math.min(player.maxhp,player.hp+player.maxhp*heal);player.mp=Math.min(player.maxmp,player.mp+player.maxmp*heal);player.shield=player.maxsh;dayT=Math.ceil(dayT/DAYLEN)*DAYLEN+60;saveRun();closeModal();toast('<b>[POUSADA]</b> Você dormiu até o amanhecer: recuperou '+Math.round(heal*100)+'% da vida e da mana. <b>Bem descansado</b> por 10 min: +'+Math.round(restXp287()*100)+'% de XP'+(il?' e +'+(5*il)+'% de vida':'')+'.',6000);return 'close'}
  if(a==='dream'){closeModal();buildSpecial('dream');return 'close'}
  if(a==='clone'){if(profile.cloneDay===todayKey())return;closeModal();buildSpecial('clone');return 'close'}
  if(a==='gsel'){const g=L.godSel;if(v[0]==='r')g.rank=+v.slice(1);else if(v[0]==='a'){const id=v.slice(1);g.aff=g.aff.includes(id)?g.aff.filter(x=>x!==id):[...g.aff,id]}else if(v==='s+')g.rooms=Math.min(22,g.rooms+2);else g.rooms=Math.max(4,g.rooms-2);return true}
  if(a==='gcreate'){const s=L.godSel,g=newGate();Object.assign(g,{rank:s.rank,aff:[...s.aff],rooms:s.rooms,red:false,double:false,x:player.x+rnd(-6,6),z:player.z-12,life:900,custom:true});gates.push(g);gateMesh(g);closeModal();bigText('PORTAL CRIADO',1200);sfx('portal');return 'close'}
}

