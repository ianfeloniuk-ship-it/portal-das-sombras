/* ================= INSTÂNCIAS ESPECIAIS ================= */
function renderGrid(cells,Wd,Hd,CS,ox,oz,th,R,pillars,torchP){
  if(th.natural124){renderHabitat124(cells,Wd,Hd,CS,ox,oz,th,R);return}
  if(ENV.ok){envGrid(cells,Wd,Hd,CS,ox,oz,th,R,pillars,torchP||.08);return}
  const floorL=[],wallL=[],trimL=[],torchL=[],pillarL=[];const f1=th.floor,f2=new THREE.Color(th.floor).multiplyScalar(1.28).getHex();
  for(let y=0;y<Hd;y++)for(let x=0;x<Wd;x++){const v=cells[y*Wd+x],wx=ox+(x+.5)*CS,wz=oz+(y+.5)*CS;
    if(v){floorL.push({x:wx,y:-.15,z:wz,c:((x+y)&1)?f1:f2});if(v===2&&pillars)pillarL.push({x:wx,y:1.5,z:wz})}
    else{let nb=false;for(let dy=-1;dy<=1&&!nb;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<Wd&&yy<Hd&&cells[yy*Wd+xx]){nb=true;break}}
      if(nb){wallL.push({x:wx,y:1.1,z:wz,c:th.wall});trimL.push({x:wx,y:2.25,z:wz});if(R()<.08)torchL.push({x:wx,y:2.6,z:wz})}}}
  inst(geo('dfl',()=>new THREE.BoxGeometry(CS,.3,CS)),toonS(0xffffff),floorL);
  inst(geo('dwl',()=>new THREE.BoxGeometry(CS,2.2,CS)),toonS(0xffffff),wallL);
  inst(geo('dtr',()=>new THREE.BoxGeometry(CS,.1,CS)),glowS(th.trim,.5),trimL);
  inst(geo('dpl',()=>new THREE.CylinderGeometry(.7,.8,3,8)),toonS(th.wall),pillarL,true);
  inst(geo('dto',()=>new THREE.SphereGeometry(.25,8,6)),glowS(th.light,1),torchL);
  const voidP=new THREE.Mesh(geo('void',()=>new THREE.PlaneGeometry(400,400)),new THREE.MeshBasicMaterial({color:0x000000}));voidP.rotation.x=-Math.PI/2;voidP.position.y=-.4;L.group.add(voidP);
}
const SP_TH={
  job:{n:'Arena do Julgamento',floor:0x2a2418,wall:0x5a4a2a,trim:0xffd070,fog:0x0e0a04,light:0xffe0a0},
  weekly:{n:'Covil do Chefe Semanal',floor:0x2a0c14,wall:0x4a1422,trim:0xff4d6a,fog:0x12030a,light:0xffb0c0},
  penalty:{n:'Zona de Penalidade',floor:0x6a5230,wall:0x8a6a3a,trim:0xff8a1e,fog:0x2a1a08,light:0xffd090},
  clone:{n:'Prova do Clone',floor:0x14101e,wall:0x2a1a3a,trim:0xff2020,fog:0x05020a,light:0xd0b0ff},
  dream:{n:'Masmorra do Sonho',floor:0x2a1a4a,wall:0x4a2a7a,trim:0xd7b8ff,fog:0x1a0a33,light:0xe0c8ff},
  past:{n:'Antes dos Portais',floor:0x5a4a30,wall:0x7a6a48,trim:0xe0c890,fog:0x2a2014,light:0xfff0c8},
  tower:{n:'Torre da Ascensão',floor:0x1a1a2e,wall:0x3a3a6a,trim:0xffd08a,fog:0x06061a,light:0xc0d8ff},
  reverse:{n:'Portal Invertido',floor:0x2a0a2a,wall:0x4a1450,trim:0xff40ff,fog:0x140414,light:0xffa0ff},
  defend:{n:'Defesa do Domínio',floor:0x1e2a1e,wall:0x3a4a2a,trim:0x6fe39a,fog:0x081008,light:0xc0ffc0},
  primordial:{n:'Portal Primordial',floor:0x1a0606,wall:0x3a0a0a,trim:0xff2020,fog:0x0a0000,light:0xff8080},
  temple:{n:'Santuário da Ressonância',floor:0x34343f,wall:0x55556a,trim:0xffd070,fog:0x08080e,light:0xfff0d0}};
function buildSpecial(kind,gRef,arg){
  const ret=gRef?{x:gRef.x,z:gRef.z}:{x:player.x,z:player.z};
  const pr=rankOf();
  clearLevel();
  const gr=kind==='job'&&L.rankTrial?L.rankTrial:kind==='weekly'||kind==='primordial'?Math.min(9,pr+1):kind==='temple'?clamp(pr,2,9):Math.min(9,pr);
  const th=SP_TH[kind],N=kind==='temple'?30:24,Wd=N+4,Hd=N+4,CS=2,ox=-Wd*CS/2,oz=-Hd*CS/2,cells=new Uint8Array(Wd*Hd);
  for(let y=2;y<N+2;y++)for(let x=2;x<N+2;x++){const a=Math.min(x-2,N+1-x),b=Math.min(y-2,N+1-y);if(a+b<5)continue;cells[y*Wd+x]=1}
  const R=mulberry32(777+N);
  L={mode:'dungeon',group:new THREE.Group(),inter:[],grid:{cells,W:Wd,H:Hd,CS,ox,oz},rooms:[{x:2,y:2,w:N,h:N}],visited:new Uint8Array(Wd*Hd),seen:new Set([0]),bossRoom:-1,
    gate:{id:-1,rank:gr,red:true,seed:1,x:ret.x,z:ret.z,ref:gRef||null},G:GR[gr],bossDead:false,markT:0,exits:[],special:{kind,name:th.n,stage:0,t:0,gr,msg:''}};
  scene.add(L.group);
  scene.background=new THREE.Color(th.fog);scene.fog=new THREE.FogExp2(th.fog,.026);
  hemi.color.setHex(th.light);hemi.intensity=.55;sun.color.setHex(th.light);sun.intensity=.4;pLight.color.setHex(th.light);pLight.intensity=1.3;
  const block=(x,z,r)=>{for(let y=0;y<Hd;y++)for(let xx=0;xx<Wd;xx++){const wx=ox+(xx+.5)*CS,wz=oz+(y+.5)*CS;if(Math.hypot(wx-x,wz-z)<r&&cells[y*Wd+xx])cells[y*Wd+xx]=2}};
  const S=L.special,half=N;
  if(kind==='temple'){
    const gz=-half+6;block(0,gz,5);
    const god=makeChibi({body:0x6a6a78,skin:0x7a7a88,eye:0x222222,scale:5,wep:'staff',wcol:0xffd070,helm:true});god.root.position.set(0,0,gz);scene.add(god.root);
    const throne=mesh(new THREE.BoxGeometry(9,7,2),toonS(0x44445a));throne.position.set(0,3.5,gz-3);L.group.add(throne);
    npcs.push({kind:'deco',m:god,x:0,z:gz,face:0,r:3,t:0,name:'',col:'#ffd070',noLabel:true});
    S.god=god;S.ax=0;S.az=gz+8;
    const dais=mesh(geo('dais',()=>new THREE.CylinderGeometry(3,3.2,.25,32)),toonS(0x8a7a50));dais.position.set(S.ax,.1,S.az);L.group.add(dais);
    const ring=new THREE.Mesh(geo('dring',()=>new THREE.RingGeometry(3.1,3.4,40)),glowS(0xffd070,.7));ring.rotation.x=-Math.PI/2;ring.position.set(S.ax,.25,S.az);L.group.add(ring);
    for(const s of[-1,1]){const b=new THREE.Mesh(geo('braz',()=>new THREE.SphereGeometry(.45,10,8)),glowS(0xffb060,1));b.position.set(S.ax+s*4.5,1.6,S.az);L.group.add(b);const p=mesh(geo('brp',()=>new THREE.CylinderGeometry(.2,.3,1.4,6)),toonS(0x3a3a48));p.position.set(S.ax+s*4.5,.7,S.az);L.group.add(p)}
    S.statues=[];const K={n:'Estátua do Templo',hp:1e9,dmg:1,spd:1.7,ai:'melee',range:2.2,wind:.9,atkCd:2.2,xp:0,scale:1.8,body:0x80808c,skin:0x90909c,eye:0x333333,wep:'axe',r:.9};
    for(const sx of[-12,12])for(let z=-14;z<=16;z+=6){const e=mkEnemy({...K,wep:z%12===0?'sword':'axe'},sx,z,1,1,{statue:true,invuln:true,frozen:true,gold:0});e.face=sx>0?-Math.PI/2:Math.PI/2;e.m.root.rotation.y=e.face;S.statues.push(e)}
    const steles=[[-9,21,'I'],[9,21,'II'],[-5,-9,'III']];for(const [x,z,t] of steles){block(x,z,1.2);let st;if(ENV.ok&&ENV.m.gravestone){st=envMesh('gravestone');st.scale.setScalar(2.9/ENV.m.gravestone.h);st.position.set(x,0,z);st.rotation.y=z>0?Math.PI:0}else{st=mesh(geo('stele',()=>new THREE.BoxGeometry(1.6,2.8,.5)),toonS(0x5a5a6a));st.position.set(x,1.4,z)}L.group.add(st);const sg=makeSign(t,'#ffd070',.35);sg.position.set(x,3.4,z);L.group.add(sg);
      L.inter.push({type:'tablet',x,z,r:2.6,label:'F · LER PROTOCOLOS',use:showRules})}
    S.rite={type:'rite',x:0,z:0,r:999,hidden:true,label:'F · SINCRONIZAR',use:()=>{}};L.inter.push(S.rite);
    S.altar={type:'altar',x:S.ax,z:S.az,r:3.4,hidden:true,label:'F · ATIVAR O FOCO',use:()=>{}};L.inter.push(S.altar);
    bossLight.position.set(0,7,gz);bossLight.color.setHex(0xfff0d0);bossLight.intensity=.6;
  }
  renderGrid(cells,Wd,Hd,CS,ox,oz,th,R,false);
  exitPortal(0,half-3,true);
  player.x=0;player.z=half-7;player.face=Math.PI;
  if(['tower','reverse','defend','primordial'].includes(kind))specialSetup2(kind,S,arg);
  if(['clone','dream','past'].includes(kind))specialSetup3(kind,S,arg);
  if(kind==='weekly'){const B=weeklyBoss();const b=spawnBoss(0,-10,gr,B);b.hp*=2;b.maxhp*=2;b.xp*=2;b.gold*=3;b.name='Chefe Semanal: '+B.n;
    for(let i=0;i<4;i++){const a=i/4*TAU;const e=spawnKind(wpick(kindsFor(gr)).k,Math.cos(a)*6,-10+Math.sin(a)*6,gr,{});makeElite(e)}}
  cam.x=player.x;cam.z=player.z;placeAllies();sfx('portal');if(kind==='penalty')unlockLore('penalty');
  bigText(th.n.toUpperCase(),1500);
}
function spawnWave(n,elites){const S=L.special;for(let i=0;i<n;i++){let x=0,z=0;for(let t=0;t<20;t++){const a=rnd(0,TAU),d=rnd(10,18);x=Math.cos(a)*d;z=Math.sin(a)*d-2;if(freeAt(x,z,.6))break}
  const e=spawnKind(wpick(kindsFor(S.gr)).k,x,z,S.gr,{});e.aggro=true;if(i<elites)makeElite(e);fxRing(x,z,0xffd070,1.5)}}
function showRules(){logNews('<b>PROTOCOLOS DE RESSONÂNCIA</b><br>I. Sincronize com o Vigia.<br>II. Ative o foco da câmara.<br>III. Suporte a vigília.<small>O foco protege contra os sentinelas. Quando os olhos do Vigia acenderem, permaneça imóvel.</small>','important')}
function punish(msg){const P=player;toast('<b>[NARRADOR]</b> '+msg+' O Vigia rejeitou a resposta.',3000);laser(.45)}
function laser(frac){const P=player,S=L.special;if(P.dead)return;fxLine([{x:0,z:S.god.root.position.z+1},{x:P.x,z:P.z}],0xff2020);fxBurst(P.x,1,P.z,0xff2020,10,4);sfx('laser');shake(.5);P.iT=0;hurtPlayer(P.maxhp*frac)}
function updSpecial(dt){
  const S=L.special;if(!S)return;S.t+=dt;const P=player;
  if(L.bossDead&&S.kind==='tower'){S.msg='Andar '+S.floor+' limpo · suba ou saia';return}
  if(L.bossDead){S.msg='Concluído · saia pelo portal · fecha em '+fmtT(L.closeT);return}
  if(S.kind==='job'){
    if(updateRankExaminer(S))return;if(updateAwakenTest155(S))return;
    const alive=enemies.filter(e=>!e.dead&&!e.isBoss).length;
    if(S.stage===0&&S.t>2.5){S.stage=1;spawnWave(8,0);toast('<b>[NARRADOR]</b> Missão de troca de classe: onda 1 de 3.')}
    else if(S.stage===1&&alive===0){S.stage=2;spawnWave(12,3);toast('<b>[NARRADOR]</b> Onda 2 de 3. Elites chegando.')}
    else if(S.stage===2&&alive===0){S.stage=3;const B={n:L.rankTrial?'Examinador do Rank '+RANKS[L.rankTrial].id:L.tierTrial?'Mestre da Provação':'Cavaleiro do Julgamento',types:['seismic','fury'],body:0xc8a040,scale:2.4,skill:S2('Julgamento Dourado','cone',8,25,3,0xffd070)};const b=spawnBoss(0,-8,S.gr,B);const tm=L.rankTrial?1:L.tierTrial?(1+.6*tierOf()):.6;b.hp*=tm;b.maxhp*=tm;if(L.tierTrial){b.dmg*=1+.25*tierOf()}b.aggro=true;bossAggro(b);toast('<b>[NARRADOR]</b> Onda final: o Cavaleiro do Julgamento.')}
    S.msg=S.stage===0?'Prepare-se':S.stage<3?'Troca de classe · onda '+S.stage+' de 3 · restam '+alive:'Derrote o Cavaleiro do Julgamento';
  }
  else if(S.kind==='penalty')penaltyUpd(S,dt);
  else if(['tower','reverse','defend','primordial'].includes(S.kind))updSpecial2(S,dt);
  else if(['clone','dream','past'].includes(S.kind))updSpecial3(S,dt);
  else if(S.kind==='weekly'){S.msg=bossE&&!bossE.dead?bossE.name:'Chefe semanal'}
  else if(S.kind==='temple'){
    const eyes=c=>S.god.eyeMat.color.setHex(c);
    if(P.bowT>0){P.bowT-=dt;P.m.body.rotation.x=.75}
    if(S.stage===0){S.msg='Santuário · leia os protocolos';if(S.t>1&&!S.shown){S.shown=true;showRules();sfx('gong')}
      if(S.t>8){S.stage=1;S.t=0;eyes(0xffd070);sfx('gong');toast('<b>[NARRADOR]</b> O Vigia iniciou a sincronização.',3000);S.rite.hidden=false;
        S.rite.use=()=>{P.bowT=1.4;fxRing(P.x,P.z,0xffd070,3,.7);sfx('ding');S.stage=2;S.t=0;S.rite.hidden=true;S.altar.hidden=false;toast('<b>[NARRADOR]</b> Sincronização aceita. Ative o foco de ressonância.',3500);
          S.altar.use=()=>{P.bowT=1.4;fxRing(S.ax,S.az,0xffd070,4,.8);sfx('gong');S.altar.hidden=true;S.stage=3;S.t=0;S.gaze=3;S.open=false;S.px=P.x;S.pz=P.z;
            for(const e of S.statues){e.frozen=false;e.aggro=true;e.dmg=P.maxhp*.28;e.m.eyeMat.color.setHex(0xff2020)}bigText('SUPORTE A VIGÍLIA',1500);toast('<b>[NARRADOR]</b> As estátuas despertaram.',3500)}}}}
    else if(S.stage===1){S.rite.x=P.x;S.rite.z=P.z;const left=12-S.t;S.msg='Protocolo I · sincronize · '+fmtT(left);if(left<=0){S.t=0;punish('A sincronização não foi concluída.')}}
    else if(S.stage===2){const left=30-S.t;S.msg='Protocolo II · ative o foco · '+fmtT(left);S.pT=(S.pT||2)-dt;if(S.pT<=0){S.pT=2.6;hazard(P.x+rnd(-2.5,2.5),P.z+rnd(-2.5,2.5),2,1.1,P.maxhp*.16,'enemy',0xffd070)}if(left<=0){S.t=0;punish('O foco não foi ativado a tempo.')}}
    else if(S.stage===3){const left=60-S.t;S.gaze-=dt;
      if(S.gaze<=0){S.open=!S.open;S.gaze=S.open?2.3:rnd(2.8,4.2);eyes(S.open?0xff2020:0x333333);bossLight.color.setHex(S.open?0xff2020:0xfff0d0);bossLight.intensity=S.open?2.6:.6;if(S.open){toast('Vigia ativo: permaneça imóvel.',1200);sfx('laser')}S.px=P.x;S.pz=P.z}
      if(S.open&&Math.hypot(P.x-S.px,P.z-S.pz)>.25&&(S.lz||0)<time){S.lz=time+.8;laser(.3)}
      if(S.open){S.px=P.x;S.pz=P.z}
      const safe=Math.hypot(P.x-S.ax,P.z-S.az)<3.2;for(const e of S.statues)e.hold=safe;
      S.msg='Protocolo III · sobreviva · '+fmtT(left)+' · olhos '+(S.open?'ABERTOS':'fechados');
      if(left<=0)finishTemple()}
  }
}
const S2=S;
function finishTemple(){unlockLore('temple');
  const S=L.special,P=player;S.stage=4;S.done=true;
  for(const e of S.statues){e.dead=true;e.gone=true;scene.remove(e.m.root);fxBurst(e.x,1,e.z,0xffd070,8,3)}
  S.god.eyeMat.color.setHex(0xffd070);bossLight.color.setHex(0xffd070);bossLight.intensity=2;sfx('arise');sfx('gong');
  profile.templeCompleted103=true;store.set('pds2_profile',profile);bigText('PROTOCOLOS CONCLUÍDOS',2600);toast('<b>[NARRADOR]</b> O templo reconheceu sua vitória. A promoção a ★ exige rank SS+, Segundo Despertar e a prova da Ordem.',6000);
  L.bossDead=true;L.closeT=60;
  for(const it of L.exits)if(it.locked){unlockExitModel131(it)}
  addChest(0,S.az+4,9,true);
}
/* PROVAÇÃO DA CLASSE: depois da evolução (nível 30), a cada 100 níveis a classe pode evoluir de novo. */
const TIER_N=['','Mestre','Grão-Mestre','Lendário','Mítico','Divino','Primordial'];
const tierOf=()=>run.tier||0,tierNeed=()=>100*(tierOf()+1),tierB=()=>1+.15*tierOf();
function className(){if(profile.classless)return 'Viajante (Sem Classe)';const A=ADV[profile.cls],t=tierOf();return run.adv?(t?TIER_N[Math.min(t,TIER_N.length-1)]+' ':'')+A.n:CLASSES[profile.cls].n}
function canArise(){return !!CLASSES[profile.cls].arise||ownsRare(7)||profile.rank===9}
function completeTier(){narratorEvent105('tier');run.tier=tierOf()+1;run.spts=(run.spts||0)+3;refreshStats();player.hp=player.maxhp;const n=className();
  bigText(n.toUpperCase(),2200);sfx('level');toast('<b>[NARRADOR]</b> Provação da Classe concluída: <b>'+n+'</b>. Dano e vida +15% no bônus somado (total +'+Math.round((tierB()-1)*100)+'%) e +3 pontos de habilidade.',7000);saveRun()}
/* v155 (Ian): set completo de uma classe rara libera o teste de despertar: duelo contra o guardião do tema, mais forte. Vencer ensina a classe. */
function awakenTestReady155(id){const S=SETS153[id];return !!S&&setCount153(id)>=5&&!awakening103().unlocked.includes(S.cls)&&profile.cls!==S.cls}
function awakenRows155(){let h='';for(const id in SETS153){const n=setCount153(id);if(!n)continue;const S=SETS153[id],cls=CLASSES[S.cls]?.n,learned=awakening103().unlocked.includes(S.cls)||profile.cls===S.cls;
  h+=row(S.n+' ('+n+'/5)',learned?'Você já tem a classe '+cls+'.':n<5?'Vista as 5 peças para ouvir o chamado do Despertar do '+cls+'.':(profile.awDeclined169||{})[id]===awakenKey169(id)?'Você recusou este chamado. Ele volta quando reunir um set novo.':'Set completo: o chamado do Despertar aparece no mundo.','')}return h}
function startAwakenTest155(id){if(!awakenTestReady155(id)||L.mode!=='world'||player.dead)return false;closeModal();L.awaken155=id;buildSpecial('job');L.awaken155=id;toast('<b>[NARRADOR]</b> Teste de despertar do <b>'+CLASSES[SETS153[id].cls].n+'</b>. O dono deste set deixou um guardião para medir você.',7000);return true}
function updateAwakenTest155(S){const id=L.awaken155;if(!id)return false;const Set=SETS153[id];
  if(S.stage===0&&S.t>2.5){S.stage=3;const gr=clamp(rankOf()+1,0,9),B={...dungeonBoss124({family124:Set.family,biome124:'campos',rank:gr,seed:1})};B.n='Prova: '+B.n;B.scale=(B.scale||1.6)*1.3;const b=spawnBoss(0,-8,gr,B);b.hp*=5;b.maxhp*=5;b.dmg*=1.6;b.aggro=true;bossAggro(b)}
  S.msg=S.stage===0?'Prepare-se: o guardião do '+CLASSES[Set.cls].n+' está muito mais forte':S.stage===4?'Prova de replicar · use as habilidades do '+CLASSES[Set.cls].n+': '+S.rep169.done.size+'/'+S.rep169.need+' · '+Math.max(0,Math.ceil(S.rep169.until-time))+'s':'Despertar · derrote o guardião do '+CLASSES[Set.cls].n;return true}
/* v169 (Ian): despertar = popup ao vestir as 5 peças de um chefe → Aceitar leva à arena com o chefe muito mais forte
   → depois, prova de replicar: você recebe as habilidades da classe por 60s e precisa usá-las. Recusar: fica só com os itens; o popup só volta com um set novo. */
function awakenClassSkills169(cls){const c=CLASSES[cls];if(!c)return[];const out=[];c.sk.forEach((s,i)=>{const k=classSkill(cls,i);if(k&&(k.rare103||k.kit111||cls>=12))out.push(k)});return out.slice(cls===7?-3:0).slice(0,3)}
function startReplica169(){const id=L.awaken155,SD=SETS153[id],S=L.special;if(!SD||!S)return;const a=awakening103(),temp=!a.unlocked.includes(SD.cls);if(temp)a.unlocked.push(SD.cls);
  const sk=awakenClassSkills169(SD.cls);S.saved169=player.skills;const slots=Array.from({length:7},()=>({empty:true,n:'Espaço'}));sk.forEach((k,i)=>slots[[0,1,2][i]]={...k,cdT:0});player.skills=slots;if(typeof showG==='function')showG();
  S.stage=4;S.rep169={need:Math.min(2,sk.length),done:new Set(),until:time+60,temp,cls:SD.cls,names:sk.map(k=>k.n)};player.hp=player.maxhp;player.mp=player.maxmp||player.mp;
  for(let i=0;i<4;i++){const e=spawnKind(wpick(familyPool124(SD.family,clamp(rankOf(),0,9))).k,rnd(-8,8),-6+rnd(-4,4),clamp(rankOf(),0,9),{});e.aggro=true}
  bigText('PROVA: REPLICAR',1600);toast('<b>[NARRADOR]</b> O guardião caiu. Agora prove que entende o '+CLASSES[SD.cls].n+': use as habilidades dele ('+sk.map(k=>k.n).join(', ')+') nos ecos da arena. 60 segundos.',9000)}
function replicaTick169(){const S=L.special;if(!S||S.stage!==4||!S.rep169)return;const R=S.rep169;
  if(R.done.size>=R.need){S.stage=5;player.skills=S.saved169||pSkills();completeAwakenTest155();return}
  if(time>R.until||player.dead){S.stage=6;player.skills=S.saved169||pSkills();if(typeof showG==='function')showG();if(R.temp){const a=awakening103();a.unlocked=a.unlocked.filter(c=>c!==R.cls)}L.awaken155=null;bigText('PROVA FALHOU',1600);toast('<b>[NARRADOR]</b> Ainda não. Você manteve as peças; vista o set de novo para tentar outra vez.',7000)}}
setInterval(()=>{try{replicaTick169()}catch(e){}},250);
{const useSkill0=useSkill;useSkill=function(sk){const S=L&&L.special,R=S&&S.stage===4&&S.rep169;const before=R&&sk&&!sk.empty?(player.skills.find(x=>!x.empty&&x.n===sk.n)||sk).cdT:0;const r=useSkill0.apply(this,arguments);if(R&&sk&&!sk.empty&&R.names.includes(sk.n)){const now=(player.skills.find(x=>!x.empty&&x.n===sk.n)||sk).cdT;if(now>before){R.done.add(sk.n);floater(player.x,player.z,'REPLICADA: '+sk.n,'#ffd070',true)}}return r}}
function awakeningView103(){view=awakeningView103;L.characterTab='awakening';const a=awakening103();let h=characterTabs('awakening')+'<div class="guide93"><strong>O SEGUNDO DESPERTAR</strong><p>Derrote os chefes de classes raras em Fendas Vermelhas para conquistar suas armaduras com passivas exclusivas.</p><p>Reúna e equipe as 5 peças do conjunto completo para liberar a prova do guardião e despertar a classe correspondente.</p></div>';
  for(const c of RARE103){const learned=a.unlocked.includes(c.id)||profile.cls===c.id;h+=row(c.n,learned?'Desperta. '+(c.exclusive||''):'Ainda não despertou.',learned?'<b>Desperta</b>':'')}openModal('PERSONAGEM',h,'awakening')}
function awakenKey169(id){return equippedItems().filter(it=>it.set153===id).map(it=>it.uid).sort().join('|')}
function awakenPopup169(force){if(!started||!run||!player||player.dead||L.mode!=='world'||(!force&&(modalOpen||paused))||profile.creationPending91)return;profile.awDeclined169=profile.awDeclined169||{};
  for(const id in SETS153){if(!awakenTestReady155(id))continue;const key=awakenKey169(id);if(profile.awDeclined169[id]===key||L.awAsked169===key)continue;L.awAsked169=key;const Set=SETS153[id],cn=CLASSES[Set.cls].n;
    openModal('DESPERTAR','<div class="guide93"><strong>'+safeText(Set.n)+' completa</strong><p>As cinco peças do '+cn+' respondem juntas. Uma passagem se abre: lá dentro o guardião do '+cn+' espera, muito mais forte. Se vencer, terá de replicar as habilidades dele para despertar a classe.</p><p>Se recusar, você fica só com os itens. O chamado só volta quando reunir um set novo.</p></div><div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">'+btn('RECUSAR','aw169no',id)+btn('ACEITAR','aw169yes',id,true,'hot')+'</div>');return}}
setInterval(()=>{try{awakenPopup169()}catch(e){}},1500);
function completeAwakenTest155(){const id=L.awaken155,S=SETS153[id];L.awaken155=null;if(!S)return;const a=awakening103();a.discovered=true;if(!a.unlocked.includes(S.cls))a.unlocked.push(S.cls);a.points[S.cls]=Math.max(1,a.points[S.cls]||0);profile.jobs=[...new Set([...jobsOf(),S.cls])];store.set('pds2_profile',profile);
  bigText(CLASSES[S.cls].n.toUpperCase()+' DESPERTO',2400);sfx('arise');toast('<b>[NARRADOR]</b> Teste concluído. Você aprendeu a classe rara <b>'+CLASSES[S.cls].n+'</b>. Monte as habilidades dela em Personagem → Habilidades.',8000);saveRun()}
function completeJob(){
  if(L.awaken155){if(L.special&&L.special.stage===3){startReplica169();return}return}
  if(L.rankTrial){const r=L.rankTrial;L.rankTrial=0;profile.rank=Math.max(profile.rank,r);narratorEvent105('rank',{rank:r});rememberClassCooldowns();player.skills=pSkills();showG();store.set('pds2_profile',profile);refreshStats();player.hp=player.maxhp;player.aura.material.color.set(RANKS[r].c);try{rebuildLook()}catch(_){}bigText('RANK '+RANKS[r].id,2200);sfx('arise');
    toast('<b>[ORDEM]</b> Prova concluída: você agora é <b style="color:'+RANKS[r].c+'">rank '+RANKS[r].id+'</b>. '+(r===9?'Você superou SS+ e alcançou Arconte.':'<b>Uma nova escolha de combate</b> disponível em Prova de Rank. Veja também seus espaços de habilidades.'),8000);setTimeout(()=>storyAct(r),2500);saveRun();return}
  if(L.tierTrial){L.tierTrial=false;completeTier();return}
  const A=ADV[profile.cls];narratorEvent105('job');run.adv=true;if(profile.cls===3)player.skills[3]={...A.sk,sourceClass:profile.cls,cdT:0};else {const s=CLASSES[profile.cls].sk.find(s=>s.evolution);profile.kitLearning111=profile.kitLearning111||{};if(s)profile.kitLearning111[s.skillId]=true;if(profile.cls===5)profile.paladinSolar109=true;player.skills=pSkills()};refreshStats();player.hp=player.maxhp;
  bigText(A.n.toUpperCase(),2000);sfx('level');toast('<b>[NARRADOR]</b> Troca de classe concluída: <b>'+A.n+'</b>. Nova habilidade: '+A.sk.n+' · equipe em Personagem → Habilidades.',6000);showG();saveRun();
}
function skillButtonTip(sk){if(sk.lockedRank)return 'Libera no rank '+sk.lockedRank+'.';if(sk.empty)return 'Escolha uma habilidade em Personagem → Habilidades.';return sk.n+'\n'+tipText155(skillDesc(sk))}

function skillTips(){if(!player||!player.skills)return;['bQ','bR','bT','bG','bY','bU','b5'].forEach((id,i)=>{const sk=player.skills[i];if(sk&&$(id))$(id).title=skillButtonTip(sk)})}
for(const id of ['bQ','bR','bT','bG','bY','bU','b5'])$(id).addEventListener('mouseenter',skillTips);
function showG(){skillTips();if(player)for(const [id,i] of [['bQ',0],['bR',1],['bT',2],['bY',4],['bU',5],['b5',6]])if(player.skills[i]){$(id).hidden=!!player.skills[i].lockedRank;$(id).querySelector('.nm').textContent=player.skills[i].n;}const P=player,s=P&&P.skills[3];$('bG').hidden=!s||s.empty;if(s)$('bG').querySelector('.nm').textContent=s.n;$('bZ').hidden=profile.rank!==9;refreshKeyLabels()}
function bankView(){
  view=bankView;const b=profile.bank||0;
  let h='<div class="sysline">Selene: O que fica aqui não se perde, nem se você morrer lá fora. · Com você <b class="gold">'+fmt(run.gold)+'</b> · No banco <b class="gold">'+fmt(b)+'</b></div>';
  h+=row('Depositar','Guarda o ouro com segurança',btn('100','dep','100',run.gold>=100)+btn('1.000','dep','1000',run.gold>=1000)+btn('Tudo','dep','all',run.gold>0,'hot'));
  h+=(affL('Selene')?row('Juros','Coletar '+fmt(bankInterest266())+' ouro · '+Math.min(10,affL('Selene'))+' ouro a cada 500 guardados, limitado a '+fmt(20*Math.min(10,affL('Selene')))+' ouro por dia',btn('Coletar','interest',0,profile.intDay!==todayKey()&&b>0)):'')+affRow('Selene');
  h+=row('Sacar','Leva o ouro de volta para a bolsa',btn('100','wd','100',b>=100)+btn('1.000','wd','1000',b>=1000)+btn('Tudo','wd','all',b>0));
  h+='<div class="sec">RECURSOS DA VILA</div>'+row('Preparar a defesa','Brann organiza guardas e vigias; os investimentos ficam nesta vila.',btn('Defesas','defense',0))+row('Desenvolvimento da vila','Consulte melhorias, doações e renda.',btn('Ver evolução','gtab','city'));
  openModal('BANCO DE '+nearestCity(player.x,player.z).c.name.toUpperCase(),h);
}

