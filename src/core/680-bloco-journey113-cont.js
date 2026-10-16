
function rememberVestige103(e){if(!e.noExpLoot&&!e.rival&&!e.statue&&e.kind&&(e.elite||e.isBoss)&&awakening103().unlocked.includes(7))AR103.corpse={x:e.x,z:e.z,until:time+30,n:e.name,kind:e.kind,role:e.ai==='ranged'||e.ai==='wraith'?'arqueiro':e.shield?'tanque':'atacante'}}
function specialEcos103(){return allies.filter(a=>a.rareEcho103&&!a.dead)}
function spawnRareEcho103(rec){const a=spawnShadow({n:rec.n},player.x+1,player.z+1);a.rareEcho103=true;a.role=rec.role;a.ranged=rec.role==='arqueiro';a.range=a.ranged?9:2.2;a.col=0xb98cff;narratorEvent105('necro');return a}
function rareMana103(sk){return sk.t==='rare_anchor'&&AR103.anchor&&AR103.anchor.until>time?0:manaCost177(sk)}
function rareCastCheck103(sk){if(AR103.region!==L)AR103={region:L,reserve:0};const P=player,a=awakening103();if(!sk.rare103)return '';if(!a.unlocked.includes(sk.sourceClass))return 'Classe rara ainda não aprendida.';if(sk.sourceClass===14)return guardianCheck108(sk);switch(sk.t){case 'rare_echo':if(specialEcos103().length>=affinity103(7))return 'Limite de ecos especiais atingido.';if(!(AR103.corpse&&AR103.corpse.until>time&&Math.hypot(P.x-AR103.corpse.x,P.z-AR103.corpse.z)<=10)&&!a.essences.length)return 'Derrote um inimigo de elite e use perto do vestígio.';break;case 'rare_order':case 'rare_pact':if(!allies.some(x=>!x.dead&&x.shadow))return 'Você precisa de um eco vivo.';if(sk.t==='rare_pact'&&P.hp<=P.maxhp*.1)return 'Vida insuficiente para o pacto.';break;case 'rare_anchor':if(AR103.anchor&&AR103.anchor.until>time&&(!freeAt(AR103.anchor.x,AR103.anchor.z,P.r)||!los(P.x,P.z,AR103.anchor.x,AR103.anchor.z)))return 'O caminho de retorno está bloqueado.';break;case 'rare_reprise':if(!AR103.lastAttack)return 'Use primeiro uma habilidade ofensiva compatível nesta região.';break;case 'rare_passage':{const pt=skillGroundPoint(8);if(!freeAt(pt.x,pt.z,.6)||!los(P.x,P.z,pt.x,pt.z)||Math.hypot(P.x-pt.x,P.z-pt.z)<2)return 'Escolha um ponto livre e visível, de 2 a 8 m.';break}case 'rare_gate':if(L.mode!=='world'||inCity(P.x,P.z)||nearestEnemy(P.x,P.z,20))return 'Abra a Fenda fora da cidade e de combate.';if(profile.rank>=8)return 'Você já alcançou o teto dos portais comuns. ★ exige sua própria jornada.';if(a.energy<3)return 'Você precisa de 3 energias de Fenda.';break}return ''}
function rareSkillRun103(sk){if(sk.sourceClass===14){guardianCast108(sk);sfx('skill');return}const P=player,a=awakening103(),dmg=skillDamage(sk);switch(sk.t){
 case 'rare_echo':{let rec=a.essences.at(-1);if(AR103.corpse&&AR103.corpse.until>time&&Math.hypot(P.x-AR103.corpse.x,P.z-AR103.corpse.z)<=10){rec={n:AR103.corpse.n,kind:AR103.corpse.kind,role:AR103.corpse.role};if(!a.essences.some(r=>r.kind===rec.kind)){a.essences.push(rec);a.essences=a.essences.slice(-20)}AR103.corpse=null}if(rec)spawnRareEcho103(rec);saveRun();break}
 case 'rare_order':{const pt=skillGroundPoint(),target=nearestEnemy(pt.x,pt.z,5);for(const al of allies.filter(x=>x.shadow&&!x.dead)){al.rareOrder103={x:pt.x,z:pt.z,target,until:time+8};if(al.rareEcho103){if(al.role==='tanque'){al.fortressUntil=time+4;for(const e of enemies)if(!e.dead&&Math.hypot(e.x-al.x,e.z-al.z)<4)hurtEnemy(e,dmg*.6,al.x,al.z,{kb:4,stun:.3})}else if(target){if(al.ranged)shoot(al.x,al.z,Math.atan2(target.x-al.x,target.z-al.z),25,dmg,'player',0xb98cff,'soul',{fromPlayer:false});else if(Math.hypot(target.x-al.x,target.z-al.z)<4)hurtEnemy(target,dmg,al.x,al.z,{kb:1})}}}break}
 case 'rare_pact':P.hp-=P.maxhp*.1;for(const al of allies)if(al.shadow&&!al.dead){if(!hasAff('nocure'))al.hp=Math.min(al.maxhp,al.hp+al.maxhp*.35);al.buffT=8;fxRing(al.x,al.z,sk.col,1.5)}break;
 case 'rare_anchor':if(AR103.anchor&&AR103.anchor.until>time){const m=AR103.anchor;if(!hasAff('nocure'))P.hp=Math.min(P.maxhp,P.hp+Math.max(0,m.hp-P.hp)*.5);P.x=m.x;P.z=m.z;AR103.anchor=null;narratorEvent105('time');fxRing(P.x,P.z,sk.col,2)}else{const extra=Math.min(AR103.reserve||0,3*affinity103(12));AR103.reserve=Math.max(0,(AR103.reserve||0)-extra);AR103.anchor={x:P.x,z:P.z,hp:P.hp,until:time+3+extra};fxRing(P.x,P.z,sk.col,2,3+extra)}break;
 case 'rare_dilate':{const pt=skillGroundPoint(),extra=Math.min(AR103.reserve||0,3*affinity103(12));AR103.reserve=Math.max(0,(AR103.reserve||0)-extra);AR103.zone={x:pt.x,z:pt.z,r:5,until:time+3+extra};fxRing(pt.x,pt.z,sk.col,5,3+extra);break}
 case 'rare_reprise':{const replay={...AR103.lastAttack,pow:AR103.lastAttack.pow*.6,repeat103:true};runSkill(replay);break}
 case 'rare_passage':{const pt=skillGroundPoint(8);AR103.passages={a:{x:P.x,z:P.z},b:pt,until:time+8};for(const pt0 of [AR103.passages.a,pt])fxRing(pt0.x,pt0.z,sk.col,1.2,8);break}
 case 'rare_cut':{const dx=Math.sin(P.face),dz=Math.cos(P.face),cx=P.x+dx*5,cz=P.z+dz*5;waveFwd(P.x,P.z,P.face,sk.col,10,2);for(const e of enemies){const ex=e.x-P.x,ez=e.z-P.z,along=ex*dx+ez*dz;if(!e.dead&&along>=0&&along<=10+e.r&&Math.abs(ex*dz-ez*dx)<1.5+e.r){const hit=hurtEnemy(e,dmg,P.x,P.z,{fromPlayer:true,skillHit:true,kb:0,stun:0});if(hit>0&&!e.dead&&!e.isBoss&&los(e.x,e.z,cx,cz))moveEnt(e,(cx-e.x)*.35,(cz-e.z)*.35)}}break}
 }sfx('skill')}
/* v153 (pedido do Ian): Ascensão de Fenda abre na hora o melhor portal que você pode pagar, rasgando a realidade. */
function rareGateLevel153(sk){return run.skl[(sk||player.skills.find(s=>s.t==='rare_gate'||s.effect==='gate')||{}).n]||0}
function rareWovenBonus153(lv){return .15+.03*lv}
function rareAutoGate153(sk){const a=awakening103();let best=0;for(let n=1;n<=affinity103(13)&&profile.rank+n<=8;n++)if(a.energy>=n*3)best=n;if(!best){toast('Você precisa de pelo menos 3 energias de Fenda.');return false}return rareOpenGate103(best)}
function rareGateView103(){const sk=player.skills.find(s=>s.t==='rare_gate');if(!sk)return;const err=rareCastCheck103(sk);if(err){toast(err);return}view=rareGateView103;let h='<div class="guide93"><strong>ASCENSÃO DE FENDA</strong><p>Portais temporários duram 15 minutos. Veja o rank, o ambiente e o custo antes de abrir. A promoção do personagem continua exigindo prova.</p><p><b>Fendas tecidas: o Tecelão não rasga o mundo, ele puxa um fio do Eco e costura a passagem até um trecho que nenhum transmigrador saqueou. Lá dentro, os itens sobem um grau de raridade e guardam o calor do mundo de origem (+15% de ataque/escudo, +3% por nível da habilidade). Ao usar, a habilidade abre na hora o melhor portal que suas energias pagam, com chance de vir vermelho (12% + 3% por nível).</b></p></div>';for(let n=1;n<=affinity103(13)&&profile.rank+n<=8;n++){const r=profile.rank+n;h+=row('Portal rank '+GR[r].id,BIO_N[biomeAt(player.x,player.z)]+' · nível recomendado '+GR[r].lvl+' · '+(n*3)+' energias (você tem '+awakening103().energy+').',btn('Abrir este portal','awgate',n,awakening103().energy>=n*3))}openModal('ABRIR FENDA SUPERIOR',h)}
function rareOpenGate103(n){const sk=player.skills.find(s=>s.t==='rare_gate'||s.effect==='gate');if(!sk||sk.cdT>0||rareCastCheck103(sk)||!Number.isInteger(n)||n<1||n>affinity103(13)||profile.rank+n>8||awakening103().energy<n*3)return false;let pt=null;for(let i=0;i<12;i++){const ang=i*Math.PI/6,x=player.x+Math.sin(ang)*7,z=player.z+Math.cos(ang)*7;if(worldFree(x,z,3)&&!inCity(x,z)&&gates.every(g=>g.dead||Math.hypot(g.x-x,g.z-z)>7)){pt={x,z};break}}if(!pt){toast('Não há espaço livre para o portal. Procure uma área aberta.');return false}const lv153=rareGateLevel153(sk),red153=Math.random()<Math.min(.45,.12+.03*lv153);const g=newGate();Object.assign(g,{...pt,rank:profile.rank+n,aff:[],red:red153,woven153:rareWovenBonus153(lv153),double:false,secret:false,inverse:false,time:false,life:900,custom:true,rareCreated103:true});awakening103().energy-=n*3;gates.push(g);gateMesh(g);if(g.mesh?.userData.rift131)Rift131.open(g.mesh);shake(.55);if(typeof fxBurst==='function')fxBurst(g.x,2.6,g.z,red153?0xec3552:0xb98cff,34,6);narratorEvent105('fenda',{rank:g.rank});sk.cdT=sk.cdMax=skillCooldown(sk);saveRun();closeModal();toast((red153?'Fenda VERMELHA':'Fenda')+' rank '+GR[g.rank].id+' aberta. Itens tecidos: +'+Math.round(g.woven153*100)+'%.');logNews('<b>[NARRADOR]</b> Você rasga o tecido da realidade e costura a passagem.'+(red153?' O fio veio tingido de sangue: a Fenda é vermelha.':'')+' Do outro lado há um trecho que ninguém pisou: o que se encontra lá vem intacto, com o calor do mundo de origem.');return true}
function rareAreaTime103(x,z,boss=false){const z0=AR103.zone;return z0&&z0.until>time&&Math.hypot(x-z0.x,z-z0.z)<=z0.r?(boss?.8:.5):1}
/* v182: efeitos de combate atrasados seguem o relógio do jogo (param na pausa e somem ao trocar de área). */
const LATER181=[];function later181(fn,ms){LATER181.push({at:time+(ms||0)/1000,fn,L});return LATER181.length}
function laterTick181(){for(let i=LATER181.length-1;i>=0;i--){const q=LATER181[i];if(q.L!==L){LATER181.splice(i,1);continue}if(time>=q.at){LATER181.splice(i,1);try{q.fn()}catch(e){console.warn(e)}}}}
/* v192 (Ian): túmulo no lugar da morte. Voltar lá uma vez devolve 20% do ouro perdido. */
function graveTick192(){const G=profile&&profile.grave192;if(!G||!player||L.mode!=='world'){if(window.GRAVE192M&&GRAVE192M.parent)GRAVE192M.parent.remove(GRAVE192M);return}
 if(!window.GRAVE192M){const g=new THREE.Group(),st=toonS(0x6d6a74),a=mesh(new THREE.BoxGeometry(.9,1.3,.25),st);a.position.y=.65;const b=mesh(new THREE.BoxGeometry(.25,.9,.27),st);b.position.y=1.1;const c=mesh(new THREE.BoxGeometry(.7,.22,.27),st);c.position.y=1.25;const gl=new THREE.Mesh(new THREE.RingGeometry(.8,1.1,24),glowS(0xffd070,.8));gl.rotation.x=-Math.PI/2;gl.position.y=.04;g.add(a,b,c,gl);window.GRAVE192M=g}
 if(GRAVE192M.parent!==L.group){L.group.add(GRAVE192M)}GRAVE192M.position.set(G.x,0,G.z);
 if(Math.hypot(player.x-G.x,player.z-G.z)<2.2&&!player.dead){run.gold+=G.gold;floater(player.x,player.z,'+'+fmt(G.gold)+' ouro do túmulo','#ffd36b',true);toast('<b>[NARRADOR]</b> Você achou o que restou de si mesmo.',4000);sfx('coin');delete profile.grave192;store.set('pds2_profile',profile);L.group.remove(GRAVE192M)}}
function rareUpdate103(dt){laterTick181();if((window.AR223=(window.AR223||0)+dt)>2){try{archTick223(AR223)}catch(_){}AR223=0}if((window.AT221=(window.AT221||0)+dt)>1){AT221=0;try{anchorTick221()}catch(_){}}if(profile&&profile.rank===9&&(profile.lore||[]).includes('act10'))storyCh220('act12');for(let i=FRIENDS217.length-1;i>=0;i--){const f=FRIENDS217[i];if(f.gone||!f.m.root.parent){FRIENDS217.splice(i,1)}}for(const f of FRIENDS217)if(!f.gone&&!f.clan372)try{f.t=(f.t||0)+dt;animChibi(f.m,{move:0,atk:0,dead:0,wind:0},f.t);f.m.root.position.set(f.x,0,f.z);f.m.root.rotation.y=Math.atan2(player.x-f.x,player.z-f.z)}catch(_){}try{visit217()}catch(_){}graveTick192();if(run)run.playT184=(run.playT184||0)+Math.max(dt,dt>0?(window.WDT196||dt):0);if(boon184()&&player&&!player.dead)player.hp=Math.min(player.maxhp,player.hp+player.maxhp*.01*dt);if(AR103.region!==L){if(AR103.trial)finishTrial103(false);AR103={region:L,reserve:0};}const P=player;kitUpdate111(dt);if(typeof cm154Update==='function')cm154Update(dt);guardianUpdate108();const hud103=document.getElementById('rare-status103');if(hud103){const t103=rareHud103()+raidHud155()+(()=>{try{return archHud223()}catch(e){return ''}})();hud103.textContent=t103;hud103.style.display=t103?'':'none'}if(P.dead){if(AR103.trial)finishTrial103(false);AR103.anchor=null;AR103.zone=null;AR103.passages=null;AR103.lastAttack=null;return}const a=awakening103();if(!rareActive103(12)){AR103.reserve=0;AR103.anchor=null;if(!AR103.trial)AR103.zone=null}else if(nearestEnemy(P.x,P.z,18))AR103.reserve=Math.min(3*affinity103(12),(AR103.reserve||0)+dt*.5);
 if(!rareActive103(13))AR103.passages=null;const cap=rareActive103(7)?affinity103(7):0;for(const al of specialEcos103().slice(cap)){al.dead=true;scene.remove(al.m.root)}
  if(a.pending&&L.mode==='world'&&!L.inter.some(i=>i.type==='fissure103')){const p=a.pending;L.inter.push({type:'fissure103',x:p.x,z:p.z,r:3.5,label:'F · INVESTIGAR FISSURA',use:inspectFissure103})}for(const it of L.inter)if(it.type==='fissure103'){it.hidden=!a.pending||!!AR103.trial;if(a.pending){it.x=a.pending.x;it.z=a.pending.z}}
 if(L.mode==='world'&&a.pending){if(!window.riftScarPersistent131||window.riftScarPersistent131.userData.owner!==L){const scar=new THREE.Group();for(let i=0;i<7;i++){const angle=-.9+i*.3,length=1.15+(i%3)*.22,x0=Math.cos(angle)*length*.22,z0=Math.sin(angle)*length*.22,x1=Math.cos(angle+.3)*length,z1=Math.sin(angle+.3)*length,m=new THREE.Mesh(new THREE.CylinderGeometry(.019,.006,Math.hypot(x1-x0,z1-z0),4),glowS(a.pending.color==='red'?0xe14a64:0x9370d2,.30)),dir=new THREE.Vector3(x1-x0,0,z1-z0);m.position.set((x0+x1)/2,.055,(z0+z1)/2);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());scar.add(m)}scar.userData.owner=L;scene.add(scar);window.riftScarPersistent131=scar}window.riftScarPersistent131.position.set(a.pending.x,0,a.pending.z)}else if(window.riftScarPersistent131){scene.remove(window.riftScarPersistent131);window.riftScarPersistent131=null}
 if(a.pending&&L.mode==='world'&&Math.hypot(P.x-a.pending.x,P.z-a.pending.z)<35&&time>(AR103.ringAt||0)){AR103.ringAt=time+1;fxRing(a.pending.x,a.pending.z,0xc2a2ff,2.5,1.2)}
 const t=AR103.trial;if(t)trialUpdate113(t,dt);
 const ps=AR103.passages;if(ps&&ps.until>time)for(const ent of [P,...allies]){if(ent.dead||time<(ent.passageAt103||0))continue;if(ent.passageLock103&&Math.hypot(ent.x-ent.passageLock103.x,ent.z-ent.passageLock103.z)<1.5)continue;ent.passageLock103=null;let dest=null;if(Math.hypot(ent.x-ps.a.x,ent.z-ps.a.z)<1.2)dest=ps.b;else if(Math.hypot(ent.x-ps.b.x,ent.z-ps.b.z)<1.2)dest=ps.a;if(dest&&freeAt(dest.x,dest.z,ent.r||.5)&&los(ent.x,ent.z,dest.x,dest.z)){ent.x=dest.x;ent.z=dest.z;ent.passageAt103=time+1.5;ent.passageLock103=dest;ent.act=null}}
}
function rareHud103(){const a=profile.awakening103;if(!a||!a.discovered)return '';const t=AR103.trial;return (t?trialHud113(t):'')+guardianHud108()+kitHud111()+(rareActive103(12)?' · TEMPO '+preciseNumber(AR103.reserve||0)+'/'+3*affinity103(12)+'s':'')+(AR103.anchor&&AR103.anchor.until>time?' · ÂNCORA '+Math.ceil(AR103.anchor.until-time)+'s':'')}
function rareActions103(a,v){if(a==='awakening'){awakeningView103();return 'close0'}if(a==='awinspect'){inspectFissure103();return 'close0'}if(a==='awtrial'){startTrial103(+v);return 'close0'}if(a==='awlearn'){rareLearn103(+v);awakeningView103();return 'close0'}if(a==='awattune'){rareAttune103(+v);awakeningView103();return 'close0'}if(a==='awgate'){rareOpenGate103(+v);return 'close0'}return null}

// Local rift review controls131 — explicitly requested test URL only.
if(window.RIFT131_ENABLE&&new URLSearchParams(location.search).get('fendas')==='teste'){
 const review=document.createElement('button');review.id='riftReview131';review.textContent='VER FENDA';review.style.cssText='position:fixed;right:12px;top:55px;z-index:90;background:#292035;color:#dfcfef;border:1px solid #9470bd;padding:8px;font-size:11px';
 review.onclick=()=>{if(!started||!player||L.mode!=='world'){toast('Entre na partida, em Aster, para ver a fenda.');return}const g=gates.filter(x=>!x.dead&&x.mesh).sort((a,b)=>Math.hypot(a.x-player.x,a.z-player.z)-Math.hypot(b.x-player.x,b.z-player.z))[0];if(!g)return;player.x=g.x;player.z=g.z+3.2;player.face=Math.PI;player.act=null;player.m.root.position.set(player.x,0,player.z);updChunks(true);riftPrevious131=null;toast('Atravesse a superfície colorida para entrar.',3000);};document.body.appendChild(review);
 if(new URLSearchParams(location.search).has('riftReview')){const closeReview=document.createElement('button');closeReview.id='riftCloseReview131';closeReview.textContent='TESTAR FECHAMENTO';closeReview.style.cssText='position:fixed;right:12px;top:92px;z-index:90;background:#292035;color:#dfcfef;border:1px solid #9470bd;padding:8px;font-size:11px';closeReview.onclick=()=>{const g=gates.filter(x=>!x.dead&&x.mesh?.userData.rift131).sort((a,b)=>Math.hypot(a.x-player.x,a.z-player.z)-Math.hypot(b.x-player.x,b.z-player.z))[0];if(!g)return;player.x=g.x;player.z=g.z+7;player.face=Math.PI;player.m.root.position.set(player.x,0,player.z);g.closing131=true;Rift131.close(g.mesh);toast('Ciclo visual de fechamento iniciado.',1800)};document.body.appendChild(closeReview)}
}

// cenário da tela inicial
function titleWorld(){const real=profile;profile=real||{rank:0,cls:0,seed:20260927};newRun();buildWorld(profile.seed);profile=real;run=null}
const rareStatus103=document.createElement('div');rareStatus103.id='rare-status103';rareStatus103.style.cssText='position:fixed;left:50%;bottom:110px;transform:translateX(-50%);color:#bfe8ff;background:#101321b8;border-radius:6px;padding:3px 8px;font-size:11px;pointer-events:none;z-index:5';document.body.appendChild(rareStatus103);
/* Textured Tripo scenery. Shared geometry/materials, instanced per streamed chunk. */
const TripoEnvironment153 = (() => {
  const models = {}, errors = [];
  const files={oak:'tripo-carvalho153.glb',willow:'tripo-salgueiro153.glb',fir:'tripo-conifera153.glb',house:'tripo-casa153.glb',guild:'tripo-guilda154.glb',defense:'tripo-torre-defesa154.glb',forge:'tripo-forja154.glb',inn:'tripo-taverna154.glb',church:'tripo-capela154.glb',potion:'tripo-pocoes154.glb',mill:'tripo-moinho154.glb',wall:'tripo-muro154.glb',well:'tripo-poco154.glb',bank:'tripo-banco154.glb',market:'tripo-mercado154.glb',bankhall:'tripo-banco-predio154.glb',boulder:'tripo-rochedo154.glb',stones:'tripo-pedras154.glb',mossrock:'tripo-rocha-musgo154.glb',palisade:'tripo-palicada154.glb'};
  // v154 scale rule (Ian): 1 unit = 1 m, hero ~1.9 m. Target heights in metres per building; old pieces had no common scale.
  const HEIGHT={guild:12,defense:13,forge:7,inn:10,church:13,potion:8,mill:12,well:3.2,bank:3.4,market:3.4,bankhall:10},KEYHEIGHT={building_tower_A_blue:11,building_tower_B_blue:11};
  // v154 city: original Kenney/KayKit keys -> Tripo building. Footprint follows the original piece so collisions stay valid.
  const CITY={building_barracks_blue:'guild',building_blacksmith_blue:'forge',building_home_B_red:'potion',building_tavern_blue:'inn',building_church_blue:'church',building_windmill_blue:'mill',building_well_blue:'well',building_tower_A_blue:'defense',building_tower_B_blue:'defense',building_market_blue:'defense',wall_straight:'wall','stall-red':'market','stall-green':'bank',tripo_bank_building:'bankhall',palisade154:'palisade',outerwall154:'wall'};
  function prepare(gltf, id) {
    const root = gltf.scene;
    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root), size = box.getSize(new THREE.Vector3());
    if (!Number.isFinite(size.y) || size.y <= 0) throw new Error('Invalid bounds: '+id);
    const origin = new THREE.Matrix4().makeTranslation(-(box.min.x+box.max.x)/2,-box.min.y,-(box.min.z+box.max.z)/2);
    // Wall pieces tile along X: turn the model if Tripo built it along Z.
    // Some Tripo props come out facing -Z; turn them so the counter faces the plaza.
    if(id==='bank')origin.premultiply(new THREE.Matrix4().makeRotationY(Math.PI));
    if((id==='wall'||id==='palisade')&&size.z>size.x){origin.premultiply(new THREE.Matrix4().makeRotationY(Math.PI/2));const t=size.x;size.x=size.z;size.z=t;}
    const parts=[];
    root.traverse(o=>{
      if (!o.isMesh) return;
      const geometry=o.geometry.clone();
      geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(origin,o.matrixWorld));
      // Etapa 2 (Ian): Tripo trees came with a flat grass platform that clashes with the ground; keep only trunk/roots near the floor.
      if(['oak','willow','fir'].includes(id)){const P=geometry.attributes.position,I=geometry.index?geometry.index.array:null,n=I?I.length:P.count,keep=[],lim=size.y*(id==='willow'?.075:.125),rad=size.y*(id==='fir'?.06:.1);
        for(let t=0;t<n;t+=3){const v=[I?I[t]:t,I?I[t+1]:t+1,I?I[t+2]:t+2];if(Math.max(...v.map(k=>P.getY(k)))<lim&&Math.max(...v.map(k=>Math.hypot(P.getX(k),P.getZ(k))))>rad)continue;keep.push(...v)}
        geometry.setIndex(keep)}
      geometry.computeBoundingSphere();
      const source=Array.isArray(o.material)?o.material:[o.material];
      const materials=source.map(m=>{
        const mat=m.clone();mat.side=THREE.DoubleSide;/* v191: malhas Tripo têm faces invertidas; com um lado só apareciam buracos nas paredes */
        if(mat.map){mat.map.encoding=THREE.sRGBEncoding;mat.map.anisotropy=4;}
        mat.roughness=Math.max(.72,mat.roughness||0);mat.metalness=0;
        // Tripo foliage albedo is very dark under the game's lighting; lift it to read like the reference.
        // Etapa 2 (Irror, 02/10): 1.9x + strong self-glow read as neon; keep a gentle lift, slightly muted green, almost no glow.
        if(['oak','willow','fir'].includes(id)&&mat.map){mat.color.setRGB(1.22,1.12,1.08);mat.emissiveMap=mat.map;mat.emissive.setRGB(.09,.09,.08);}else if(mat.map){mat.color.setScalar(1.3);/* painted look: never pure black at dusk */mat.emissiveMap=mat.map;mat.emissive.setRGB(.2,.19,.18);}
        // Same character visibility cutout as existing scenery. Instancing needs world positions.
        mat.onBeforeCompile=shader=>{
          envShader(false,true)(shader);
          /* v243: vento nas árvores — o tronco curva com rajadas e as folhas tremem; fase por árvore */
          if(['oak','willow','fir'].includes(id)){shader.uniforms.uWind=ENV.wind;shader.vertexShader='uniform float uWind;\n'+shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
            {float H=${size.y.toFixed(3)},h=clamp(transformed.y/H,0.,1.);vec2 ph=vec2(0.);
            #ifdef USE_INSTANCING
            ph=instanceMatrix[3].xz;
            #endif
            float t=uWind,f=dot(ph,vec2(.13,.09)),g=.55+.45*sin(t*.33+f*.7)*sin(t*.21+f*.3);
            float b=h*h*H*(${id==='fir'?'.022':id==='willow'?'.05':'.035'})*g;
            transformed.x+=sin(t*1.3+f)*b+b*.6;transformed.z+=cos(t*1.05+f*1.3)*b*.6;
            float lf=smoothstep(.35,.7,h)*H*.0025*(.6+g);vec3 q=transformed*(5./H);
            transformed+=vec3(sin(t*4.+q.y+q.z+f),sin(t*3.6+q.x)*.4,cos(t*4.4+q.z+q.x+f))*lf;}`)}
          if(['oak','willow','fir'].includes(id))shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#if defined(USE_COLOR)
            {vec3 c0=diffuseColor.rgb;float leaf154=smoothstep(-.015,.035,c0.g-max(c0.r,c0.b)*.95);float on154=step(.02,1.-min(vColor.r,min(vColor.g,vColor.b)));
            diffuseColor.rgb=mix(c0,(dot(c0,vec3(.3,.59,.11))*2.1+.11)*vColor,leaf154*on154);}
            #endif`);
          if(!['oak','willow','fir','boulder','stones','mossrock'].includes(id)){
            // Night: amber window panes glow and the facade keeps a faint read, like the procedural houses.
            shader.uniforms.night153=window.NIGHT153U||(window.NIGHT153U={value:0});
            shader.fragmentShader='uniform float night153;\n'+shader.fragmentShader.replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
            #ifdef USE_MAP
            vec3 tex153=texture2D(map,vUv).rgb;
            float warm153=smoothstep(.36,.56,tex153.r-tex153.b)*smoothstep(.12,.30,tex153.r-tex153.g);
            totalEmissiveRadiance+=night153*(vec3(1.,.62,.24)*warm153*3.+tex153*.10);
            #endif`);
          }
          shader.vertexShader=shader.vertexShader.replace('vWp=(modelMatrix*vec4(transformed,1.)).xyz;',
            '#ifdef USE_INSTANCING\nvWp=(modelMatrix*instanceMatrix*vec4(transformed,1.)).xyz;\n#else\nvWp=(modelMatrix*vec4(transformed,1.)).xyz;\n#endif\n');
        };
        mat.customProgramCacheKey=()=> 'tripo153-occlusion-'+id;
        return mat;
      });
      parts.push({geometry,material:Array.isArray(o.material)?materials:materials[0]});
    });
    models[id]={h:size.y,w:Math.max(size.x,size.z),sx:size.x,sz:size.z,parts};
  }
  const ready=Promise.all(Object.entries(files).map(([id,file])=>new Promise(resolve=>{
    const loader=new THREE.GLTFLoader();
    if(window.MeshoptDecoder)loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load('models/'+file,g=>{try{prepare(g,id)}catch(e){errors.push(String(e))}
      /* v180: versão leve (Blender, ~3 mil triângulos) para árvores longe da câmera */
      const lod=({oak:'tripo-carvalho153-lod.glb',willow:'tripo-salgueiro153-lod.glb',fir:'tripo-conifera153-lod.glb',wall:'tripo-muro154-lod.glb',palisade:'tripo-palicada154-lod.glb',house:'tripo-casa153-lod.glb',mossrock:'tripo-rocha-musgo154-lod.glb'})[id];/* v418: versões leves refeitas no Blender (~35% dos triângulos) */
      if(lod&&models[id])loader.load('models/'+lod,g2=>{const full=models[id];try{prepare(g2,id);full.liteParts=models[id].parts}catch(e){}models[id]=full;resolve()},undefined,()=>resolve());else resolve()},undefined,e=>{errors.push(file);console.warn('Tripo scenery fallback:',file);resolve()});
  })));
  function tree(key,x,z){
    if(key.includes('dead'))return null;
    const bio=L.mode==='dungeon'&&L.G?.th?.habitat124||biomeAt(x,z);
    if(bio==='vulcao'||bio==='deserto')return null;
    return bio==='pantano'?'willow':bio==='neve'||bio==='cristal'?'fir':'oak';
  }
  // Etapa 2 (Ian): leaf colour follows biome and season (white = keep the Tripo texture).
  function leaf154(id,x,z){
    const bio=L.mode==='dungeon'&&L.G?.th?.habitat124||biomeAt(x,z),se=seasonI(),v=WN?WN(x*.05+7,z*.05+3):.5;
    if(id==='fir')return bio==='neve'||bio==='cristal'||se===3?(v>.5?[.72,.88,.8]:[.6,.8,.68]):bio==='pantano'?[.42,.55,.36]:bio==='floresta'?[.3,.48,.3]:null;
    if(se===2)return[[1,.55,.16],[.92,.32,.12],[1,.78,.22]][Math.min(2,Math.floor(v*3))];
    if(se===3)return[.88,.92,.96];
    if(bio==='flores')return se===0?(v>.55?[1,.93,.95]:[1,.52,.76]):[.62,.88,.38];
    if(bio==='pantano')return[.45,.55,.3];
    if(bio==='floresta')return[.3,.5,.28];
    return se===0?[.55,.88,.35]:null;
  }
  function add(batch,id,x,y,z,ry,scale,sy,sz){
    (batch.tripo153||(batch.tripo153=[])).push({id,x,y,z,ry:ry||0,scale,sy:sy||scale,sz:sz||scale});
  }
  const oldAdd=EnvBatch.prototype.add;
  EnvBatch.prototype.add=function(k,x,y,z,ry,sx,sy,sz,tint){
    const id=CITY[k],t=models[id],m=ENV.m[k];
    if(!t||(!m&&id==='wall'&&k!=='outerwall154'))return oldAdd.call(this,k,x,y,z,ry,sx,sy,sz,tint);
    sx=sx||1;sy=sy||sx;sz=sz||sx;
    // Outer ring (Attack-on-Titan style districts): same stone wall, taller and thicker.
    if(k==='outerwall154'){add(this,id,x,y,z,ry,(sx||4)/t.sx*1.04,6/t.h,2.2/t.sz);return true;}
    if(id==='palisade'){add(this,id,x,y,z,ry,(sx||4)/t.sx*1.06,3.4/t.h,1.2/t.sz);return true;}
    if(id==='wall'){const L=(m.max[0]-m.min[0])*sx;add(this,id,x,y,z,ry,L/t.sx*1.04,4.5/t.h,1.6/t.sz);return true;}
    // Buildings keep proportions and follow the metre scale, independent of the old piece size.
    const s=(KEYHEIGHT[k]||HEIGHT[id])/t.h;add(this,id,x,y,z,ry,s);return true;
  };
  const oldEH=EH,oldEW=EW,oldMesh=EnvBatch.prototype.mesh;
  EH=function(batch,key,x,y,z,ry,height,tint){
    const id=key.startsWith('tree_')?tree(key,x,z):null,m=models[id];
    // Etapa 2 (Ian): the old non-Tripo trees are gone; where there is no Tripo tree, nothing grows.
    if(!m&&key.startsWith('tree_')&&models.oak)return 0;
    if(!m)return oldEH(batch,key,x,y,z,ry,height,tint);
    // Metre scale: real trees tower over the 1.9 m hero (oak ~10 m, willow ~9 m, fir ~12 m).
    const scale=height*({oak:1.55,willow:1.35,fir:1.7}[id]||1)/m.h;add(batch,id,x,y,z,ry,scale);return scale;
  };
  EW=function(batch,key,x,y,z,ry,width,tint){
    // v154 rocks from Tripo in the open world (dungeons keep their habitat stones). Width from the game is already in metres.
    const rk=/^(rock|stone)_(small|large|tall)/.exec(key);
    // Etapa 2 (Irror, 02/10): the dark Tripo stones look like the Metamorfo helm in the snow; snow/crystal keep the light frosted rocks.
    if(rk&&L.mode==='world'&&['neve','cristal'].includes(biomeAt(x,z)))return oldEW(batch,key,x,y,z,ry,width,tint??0xe5eef1);
    if(rk&&L.mode==='world'){const bio=biomeAt(x,z),id=rk[2]==='tall'?(['campos','floresta','flores','pantano'].includes(bio)?'mossrock':'boulder'):rk[2]==='large'?'boulder':'stones',t=models[id];
      // Etapa 2: the Tripo boulder/stones came out black and spiky (read as the Metamorfo helm) in every biome; only the moss rock stays.
      if(id!=='mossrock')return oldEW(batch,key,x,y,z,ry,width,tint);if(t){const sc=width*(id==='stones'?1.15:1)/t.w;add(batch,id,x,y,z,ry,sc);return sc}}
    // Shops retain their distinct architecture and signage; replace residential houses only.
    const kind=Village129.classify(key),m=models.house;
    if(!m||!['home-a','home-b'].includes(kind))return oldEW(batch,key,x,y,z,ry,width,tint);
    // Two-storey homes ~6.6-7.4 m; the requested width only adds a little variety.
    const scale=(6.6+Math.max(0,width-5.4)*.6)/m.h;add(batch,'house',x,y,z,ry+Math.PI/2,scale);return scale;/* v188: porta da casa Tripo fica na lateral do modelo */
  };
  EnvBatch.prototype.mesh=function(material){
    const base=oldMesh.call(this,material),entries=this.tripo153;
    if(!entries?.length)return base;
    const group=new THREE.Group();
    if(base){base.userData.own=1;group.add(base)}
    const matrix=new THREE.Matrix4(),position=new THREE.Vector3(),rotation=new THREE.Quaternion(),scale=new THREE.Vector3(),axis=new THREE.Vector3(0,1,0);
    for(const id of Object.keys(models)){
      const placements=entries.filter(e=>e.id===id);if(!placements.length)continue;
      for(const part of models[id].parts){
        const mesh=new THREE.InstancedMesh(part.geometry,part.material,placements.length);
        placements.forEach((e,i)=>{position.set(e.x,e.y,e.z);rotation.setFromAxisAngle(axis,e.ry);scale.set(e.scale,e.sy||e.scale,e.sz||e.scale);matrix.compose(position,rotation,scale);mesh.setMatrixAt(i,matrix)});
        if(['oak','willow','fir'].includes(id)){const col=new THREE.Color();placements.forEach((e,i)=>{const c=leaf154(id,e.x,e.z);col.setRGB(...(c||[1,1,1]));mesh.setColorAt(i,col)});mesh.instanceColor.needsUpdate=true}
        mesh.instanceMatrix.needsUpdate=true;
        const li=models[id].liteParts&&models[id].liteParts[models[id].parts.indexOf(part)];
        if(li){const lm=new THREE.InstancedMesh(li.geometry,li.material,placements.length);for(let i=0;i<placements.length;i++){mesh.getMatrixAt(i,matrix);lm.setMatrixAt(i,matrix)}if(mesh.instanceColor){const col=new THREE.Color();for(let i=0;i<placements.length;i++){mesh.getColorAt(i,col);lm.setColorAt(i,col)}lm.instanceColor.needsUpdate=true}lm.instanceMatrix.needsUpdate=true;lm.frustumCulled=false;lm.userData.tripo153=id;lm.visible=true;mesh.visible=false;/* v201: começa leve; o recorte (100 ms) decide depois. Evita o pico de ~6 mi de triângulos ao carregar. */lm.castShadow=mesh.castShadow;lm.receiveShadow=mesh.receiveShadow;group.add(lm);mesh.userData.lite180=lm}
        // Three r128 culls instances using source bounds; chunk streaming already bounds visibility.
        mesh.frustumCulled=false;mesh.userData.tripo153=id;group.add(mesh);
        /* v180: recorte de visão por grupo — esfera que cobre as instâncias; fora da câmera não é desenhado (cidade ia a 10 mi de triângulos). */
        {let r=0,cx=0,cz=0;placements.forEach(e=>{cx+=e.x;cz+=e.z});cx/=placements.length;cz/=placements.length;placements.forEach(e=>{r=Math.max(r,Math.hypot(e.x-cx,e.z-cz)+14*(e.scale||1))});mesh.userData.bs180=new THREE.Sphere(new THREE.Vector3(cx,4,cz),r+8);CULL180.add(mesh)}
      }
    }
    return group;
  };
  const NAT422=window.NAT422=new Set(['oak','willow','fir','boulder','stones','mossrock']);const CULL180=window.CULL180=new Set(),fr180=new THREE.Frustum(),pm180=new THREE.Matrix4();
  setInterval(()=>{if(!camera||!CULL180.size)return;camera.updateMatrixWorld();pm180.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);fr180.setFromProjectionMatrix(pm180);for(const m of CULL180){if(!m.parent){CULL180.delete(m);continue}const inV=fr180.intersectsSphere(m.userData.bs180),lt=m.userData.lite180;if(!lt){m.visible=inV;continue}if(!inV){m.visible=lt.visible=false;continue}const P=typeof player!=='undefined'&&player?player:camera.position,nat=NAT422.has(m.userData.tripo153);split423(m,lt,P,nat?10:40,nat?90:1e9,nat?(m.userData.thin423??1):1)}},100);
  /* v424 (Ian: jogo liso no navegador): antes o pedaço inteiro virava completo quando o jogador chegava perto do grupo
     (até 2,7 mi de triângulos só de carvalho, 12 mil cada). Agora é por árvore/construção: as mais perto ficam completas,
     o resto na versão leve (árvore completa só até 10 m), e árvore/pedra além de 90 m some. A ordem é refeita só quando o jogador anda 1,5 m. */
  function split423(m,lt,P,near,far,thin){const u=m.userData;lt.userData.isLite423=true;if(!u.base423){u.base423=m.instanceMatrix.array.slice();u.n423=m.instanceMatrix.count;u.col423=m.instanceColor?m.instanceColor.array.slice():null}
    const key=Math.round(P.x/1.5)+','+Math.round(P.z/1.5)+','+thin;if(u.key423===key){m.visible=m.count>0;lt.visible=lt.count>0;return}u.key423=key;
    const B=u.base423,C=u.col423,idx=[];for(let i=0;i<u.n423;i++){const dx=B[i*16+12]-P.x,dz=B[i*16+14]-P.z;idx.push([dx*dx+dz*dz,i])}idx.sort((x,y)=>x[0]-y[0]);
    const nm=m.instanceMatrix.array,lm=lt.instanceMatrix.array;let a=0,b=0;
    for(const [d2,i] of idx){if(d2<near*near){nm.set(B.subarray(i*16,i*16+16),a*16);if(C)m.instanceColor.array.set(C.subarray(i*3,i*3+3),a*3);a++}
      else if(d2<far*far){if(thin<1&&((Math.imul(i+1,2654435761)>>>0)%1000)/1000>=thin)continue;lm.set(B.subarray(i*16,i*16+16),b*16);if(C&&lt.instanceColor)lt.instanceColor.array.set(C.subarray(i*3,i*3+3),b*3);b++}}
    m.count=a;lt.count=b;m.instanceMatrix.needsUpdate=lt.instanceMatrix.needsUpdate=true;if(C){m.instanceColor.needsUpdate=true;if(lt.instanceColor)lt.instanceColor.needsUpdate=true}m.visible=a>0;lt.visible=b>0}
  // Streamed instances share resources; release only the instance GPU buffer when a chunk unloads.
  const oldDispose=envDispose;
  envDispose=function(root){root.traverse(o=>{if(o.isInstancedMesh&&o.userData.tripo153&&o.dispose)o.dispose()});oldDispose(root)};
  MODELS.ready=Promise.all([MODELS.ready,ready]).then(([ok])=>ok);
  const treeOk=(k,x,z)=>!k.startsWith('tree_')||!models.oak||!!models[tree(k,x,z)];
  function dimensions(key,width=6){const id=CITY[key],kind=Village129.classify(key),home=!id&&['home-a','home-b'].includes(kind),t=models[home?'house':id];
    if(t){const h=home?6.6+Math.max(0,width-5.4)*.6:KEYHEIGHT[key]||HEIGHT[id],s=h/t.h;return {w:(home?t.sz:t.sx)*s,d:(home?t.sx:t.sz)*s,h};}
    const m=ENV.m[key];if(!m)return null;const scale=width/m.w,w=(m.max[0]-m.min[0])*scale,d=(m.max[2]-m.min[2])*scale,ry=doorRot188(key);return {w:Math.abs(Math.cos(ry))*w+Math.abs(Math.sin(ry))*d,d:Math.abs(Math.sin(ry))*w+Math.abs(Math.cos(ry))*d,h:m.h*scale};
  }
  return {models,errors,ready,files,treeOk,leaf154,dimensions};
})();
window.TripoEnvironment153=TripoEnvironment153;

titleWorld();MODELS.ready.then(()=>{if(!started&&ENV.ok)titleWorld()});
requestAnimationFrame(frame);
