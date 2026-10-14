function addVein(x,z,rank,charges,col){
  if(L.inter.some(it=>(it.type==='chest'||it.type==='ruin')&&!it.hidden&&Math.hypot(x-it.x,z-it.z)<2.75)){const p=chestPoint253({x,z});if(!p)return null;x=p.x;z=p.z;}
  rank=crystalRank125(rank);col=crystalColor125(rank).getHex();
  const owner=L.group;const g=new THREE.Group();for(let i=0;i<5;i++){const m=new THREE.Mesh(geo('vein',()=>new THREE.OctahedronGeometry(.5,0)),glowS(col,.9));m.position.set(rnd(-.6,.6),.5+rnd(0,.5),rnd(-.6,.6));m.scale.set(.6,rnd(1.2,2.2),.6);m.rotation.set(rnd(-.4,.4),rnd(0,3),rnd(-.4,.4));g.add(m)}
  const base=mesh(geo('vbase',()=>new THREE.DodecahedronGeometry(.9,0)),toonS(0x2a2a3a));base.position.y=.3;g.add(base);g.position.set(x,0,z);L.group.add(g);
  const it={type:'vein',x,z,r:2.4,charges,g,rank125:rank,label:'F · MINERAR CRISTAL · RANK '+RANKS[rank].id,use:()=>mine(it,rank)};L.inter.push(it);
  for(const e of enemies)if(!e.dead)crystalUnstuck126(e);
  if(!attachCrystal125(g,rank))crystalReady125.then(ok=>{if(ok&&!it.hidden&&L.group===owner&&g.parent===owner)attachCrystal125(g,rank)});return it;
}
function mine(it,rank){
  if(it.hidden||it.charges<=0||(it.cd||0)>time)return;it.cd=time+.35;let n=1+(Math.random()<.4?1:0);if(Math.random()<Math.min(1,profLv('mine')*.05))n++;if(hasT('miner'))n++;run.res.cry[rank]+=n;profXp('mine',n);storyEv('mine',n);
  player.face=Math.atan2(it.x-player.x,it.z-player.z);player.atkT=.001;
  floater(it.x,it.z,'+'+n+' cristal '+GR[rank].id,RANKS[rank].c);fxBurst(it.x,1,it.z,crystalColor125(rank).getHex(),6,3);sfx('mine');shake(.08);
  npcEv('mine',n);it.charges--;it.g.scale.setScalar(.7+.3*Math.min(1,it.charges/4));if(it.charges<=0){it.hidden=true;L.group.remove(it.g);toast('<b>[NARRADOR]</b> Veio de mana esgotado.')}
}
function tryExit(it){if(it&&it.locked&&!(L.gate&&L.gate.red&&!L.bossDead)){toast('<b>[NARRADOR]</b> '+(L.special&&L.special.kind==='tower'?'A saída da torre só abre nos andares de chefe (10, 20, 30...). Limpe o andar e suba pelo portal dourado.':'Esta saída está fechada.'));return}if(L.gate.red&&!L.bossDead){toast('<b>[NARRADOR]</b> Portal vermelho: derrote o guardião para abrir a única saída.');return}leaveDungeon(false)}
function enterGate(g){if(run&&!(run.rez187>0)&&(g.red||g.rank>=Math.max(2,(profile.rank||0))))setTimeout(()=>toast('<b>[NARRADOR]</b> Sem Ressurgimento: morrer zera seu nível e perde ouro e itens carregados.',6000),1500);if(g.dead||g.closing131||g.coreFailed103)return;run.sealed269=(run.sealed269||[]).filter(q=>q.t>Date.now());if(run.sealed269.some(q=>Math.hypot(q.x-g.x,q.z-g.z)<8)){toast('<b>[NARRADOR]</b> Este portal colapsou quando você o abandonou. Ele não aceita você de novo.',5000);return}if(g.inv343){const c=nearestCity(g.x,g.z).c;run.invReturn372={city:g.inv343,x:c.x,z:c.z+6,open:true,token:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2),raided:!!(profile.raided155||{})[g.inv343]};player.x=c.x;player.z=c.z+6;}run.inGate269={x:g.x,z:g.z};saveRun();if(g.inv343&&store.get('pds3_run')?.invReturn372?.token!==run.invReturn372.token){toast('Não foi possível salvar o retorno à praça. Libere espaço de armazenamento antes de entrar.');delete run.inGate269;delete run.invReturn372;return;}rollRareGate155(g);if(g.set153&&SETS153[g.set153]){bigText('PORTAL DE CLASSE RARA',1600);toast('<b>[NARRADOR]</b> Este portal guarda o rastro do <b>'+(CLASSES[SETS153[g.set153].cls]?.n||'')+'</b>. Ele ficou vermelho: não há saída até o guardião cair.',7000)}if(g.set153&&SETS153[g.set153])logNews('<b>[NARRADOR]</b> '+SETS153[g.set153].lore);

  if(g.secret){closeModal();curGate=g;buildSpecial('temple',g);return}
  if(g.inverse){closeModal();curGate=g;buildSpecial('reverse',g);return}
  if(g.time){closeModal();curGate=g;buildSpecial('past',g);return}
  closeModal();curGate=g;buildDungeon(g);narratorEnter105(g);placeAllies();sfx('portal');unlockLore(g.rank>=6?'high':'gate');if(g.giant){for(const e of enemies)e.gold*=3}
  cam.x=player.x;cam.z=player.z;
  bigText('RANK '+GR[g.rank].id,1300);
  toast('<b>[NARRADOR]</b> '+L.G.th.n+' · '+L.rooms.length+' salas'+(g.red?' · <b style="color:#ff4d6a">PORTAL VERMELHO</b>':''),3500);
  if(g.hostile)setTimeout(()=>toast('<b>[NARRADOR]</b> Caçadores hostis detectados nesta masmorra.'),1500);
  if(g.friends)setTimeout(()=>toast('<b>[NARRADOR]</b> Outro grupo de caçadores está lá dentro.'),2600);
}
function startBreak(){L.brk={t:0,sp:1};for(const it of L.exits)if(it.locked){unlockExitModel131(it)}
  bigText('TRANSBORDO DA FENDA',2200);sfx('gong');shake(.8);showSys('A masmorra está quebrando. Os monstros não param de vir. Quanto mais você aguentar, maior o recorde. A saída continua aberta: chegue nela para sair vivo.')}
function updBreak(dt){const B=L.brk,P=player;B.t+=dt;B.sp-=dt;if(Math.floor(B.t)>(profile.brkBest||0)){profile.brkBest=Math.floor(B.t);if(profile.brkBest%10===0){store.set('pds2_profile',profile);checkTitles();storyEv('brk')}}
  if(B.sp<=0){B.sp=Math.max(.8,3-B.t/60);const alive=enemies.filter(e=>!e.dead).length,n=Math.min(40-alive,2+Math.floor(B.t/20)),gr=Math.min(9,L.gate.rank);
    for(let i=0;i<n;i++){let x=P.x,z=P.z;for(let t=0;t<25;t++){const a=rnd(0,TAU),d=rnd(9,16);x=P.x+Math.cos(a)*d;z=P.z+Math.sin(a)*d;if(freeAt(x,z,.6))break}if(!freeAt(x,z,.6))continue;
      const e=spawnKind(wpick(activeDungeonPool124(gr)).k,x,z,gr,{});const m=1+B.t/120;e.hp*=m;e.maxhp*=m;e.dmg*=1+B.t/240;e.aggro=true;if(Math.random()<Math.min(.4,B.t/600))makeElite(e);fxRing(x,z,0xff2d55,1.4)}}}
function leaveDungeon(toCity){expAbandon();if(run)delete run.inGate269;if(L.brk){const t=Math.floor(L.brk.t);profile.brkBest=Math.max(profile.brkBest||0,t);store.set('pds2_profile',profile);checkTitles();toast('<b>[QUEBRA]</b> Você saiu vivo depois de '+fmtT(t)+'. Recorde: '+fmtT(profile.brkBest)+'.',5000)}
  if(L.special){const sp=L.special,g=L.gate;curGate=null;if((sp.done||sp.cleared)&&!L.failed103&&g.ref&&g.ref.id){recordSpecialOrderRep();g.ref.dead=true;}player.x=g.x;player.z=g.z+(g.ref?5:0);player.bowT=0;buildWorld();for(let t=0;t<20&&!worldFree(player.x,player.z,.6);t++){player.x+=rnd(-3,3);player.z+=rnd(-3,3)}placeAllies();cam.x=player.x;cam.z=player.z;sfx('portal');toast('<b>[NARRADOR]</b> Você voltou ao mundo.');saveRun();return}
  const g=L.gate,cleared=L.bossDead&&!L.failed103,riftClosure=cleared&&window.RIFT131_ENABLE&&window.Rift131?{...g,mesh:null,dead:false,life:120}:null;narratorPortal105(g,cleared);
  if(cleared){g.cleared=true;g.dead=true;if(g.inv343&&window.Civic343)Civic343.riftClosed(g);if(g.anchor221){profile.anchorShut221=profile.anchorShut221||{};profile.anchorShut221[g.anchor221]=1;store.set('pds2_profile',profile);setTimeout(()=>{bigText('ÂNCORA SELADA',1800);showSys('A Fenda da Âncora se fechou. A Pedra-Âncora voltou a dormir. Agora a cidade pode ser reconstruída.')},1500)}qev('clear',g.rank);rareOnPortal103(g);if(riftClosure){const pending=awakening103().pending;riftClosure.storyScar131=!!pending&&Math.hypot(pending.x-g.x,pending.z-g.z)<.1}run.clears++;profile.best=Math.max(profile.best||0,g.rank);store.set('pds2_profile',profile)}

  curGate=null;
  if(toCity){const c=nearestCity(g.x,g.z).c;player.x=c.x;player.z=c.z+6}else{player.x=g.x;player.z=g.z+5}
  buildWorld();
  if(riftClosure){delete riftClosure.cleared;gateMesh(riftClosure);riftClosure.closing131=true;gates.push(riftClosure);Rift131.close(riftClosure.mesh,riftClosure.storyScar131)}
  for(let t=0;t<20&&!worldFree(player.x,player.z,.6);t++){player.x+=rnd(-3,3);player.z+=rnd(-3,3)}
  placeAllies();cam.x=player.x;cam.z=player.z;
  toast(g.deathBreak103?'<b>[NARRADOR]</b> O portal vermelho rompeu. Monstros escaparam para o mundo; a entrada foi perdida.':g.coreFailed103?'<b>[NARRADOR]</b> Você escapou. O núcleo foi perdido e o portal se fechou.':cleared?'<b>[NARRADOR]</b> O portal rank '+GR[g.rank].id+' se fechou e sumiu. Venda seus recursos no Mercado de qualquer cidade.':'<b>[NARRADOR]</b> Você saiu da masmorra. O portal continua aberto enquanto ainda tiver tempo.',4000);
  saveRun();
}
function placeAllies(){for(const a of allies){if(a.guest)continue;a.x=player.x+rnd(-1.5,1.5);a.z=player.z+rnd(.5,2);if(L.grid&&!freeAt(a.x,a.z,.4)){a.x=player.x;a.z=player.z}a.act=null;a.m.root.position.set(a.x,0,a.z)}}

