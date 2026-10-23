/* ================= TELAS ================= */
/* Atalhos de teste SÓ no PC local com ?dev no endereço. No site publicado não existem. */
const DEV=/^(127\.0\.0\.1|localhost)$/.test(location.hostname)&&/[?&]dev\b/.test(location.search);
(function(){let n=0,t0=0;$('ttl').addEventListener('pointerdown',()=>{const now=performance.now();if(now-t0>3000)n=0;t0=now;
  if(!DEV)return;if(++n>=7&&profile){n=0;profile.rank=profile.rank===9?8:9;store.set('pds2_profile',profile);showProfile();beep(110,.5,.06,'sawtooth')}})})();
(function(){let n=0,t0=0;$('roll').addEventListener('pointerdown',()=>{const now=performance.now();if(now-t0>3000)n=0;t0=now;if(!DEV)return;if(++n>=5&&profile){n=0;profile.devGate=true;store.set('pds2_profile',profile);beep(880,.4,.06,'triangle')}})})();
$('tbl').innerHTML='';
function showProfile(){backupRanks78();if(migrateRankProfile(profile))store.set('pds2_profile',profile);ensureRankProgress();ensureOrderRep();store.set('pds2_profile',profile);const rk=RANKS[profile.rank],c=CLASSES[profile.cls];$('rollbox').hidden=false;$('roll').textContent=rk.id;$('roll').style.color=rk.c;$('rollc').textContent=c.n.toUpperCase();
  $('rolls').innerHTML=c.sk.slice(0,3).map(s=>s.n).join(' · ')+(profile.creationPending91?'<br>Você escolhe a primeira habilidade na criação do personagem':'')+(c.arise?'<br>Único que ergue ecos':'')+'<br>Mortes: '+(profile.deaths||0);if(profile.classless){$('rollc').textContent='VIAJANTE · SEM CLASSE';$('rolls').innerHTML='Chegou sem ouro e sem técnicas. Sua classe desperta com a primeira arma.<br>Mortes: '+(profile.deaths||0)}}
if(profile){showProfile();$('goBtn').textContent=store.get('pds3_run')?'CONTINUAR':(profile.classless?'DESPERTAR NA ESTRADA':'ENTRAR NA CIDADE');$('reroll').hidden=!DEV}
$('goBtn').addEventListener('click',()=>{
  audioInit();
  if(!profile&&!/[?&]escolherClasse/.test(location.search)){profile=pickAwaken(0);profile.classless=true;profile.name='Viajante';profile.creationPending91=false;profile.orderPending401=true;store.set('pds2_profile',profile);startGame();return}
  if(!profile){const C=CLASSES.map((c,i)=>({c,i})).filter(o=>o.c.w>0);$('rollbox').hidden=false;$('roll').textContent=RANKS[0].id;$('roll').style.color=RANKS[0].c;$('rollc').textContent='ESCOLHA SUA CLASSE';
    /* v301 (Ian): a lista vazava da caixa e o texto ficava minúsculo. Botões curtos em 2 colunas; ao clicar abre o detalhe com passiva e recurso e o botão Escolher. */
    const RN={fury:'Fúria',vigor:'Estamina',mana:'Mana'},info=i=>{const c=CLASSES[i],mag=MAGIC_CLS.includes(i);return {c,rs:RN[resourceType260({sourceClass:i})],at:mag?'Inteligência':c.ranged?'Destreza':'Força',st:c.ranged?'À distância':'Corpo a corpo'}};
    $('rolls').innerHTML='<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:8px;max-height:46vh;overflow-y:auto">'+C.map(o=>{const I=info(o.i);return '<button class="btn" data-cls="'+o.i+'" style="text-align:left;white-space:normal;line-height:1.25;padding:7px 9px"><b style="font-size:14px">'+o.c.n+'</b><br><small style="opacity:.8;font-size:11.5px">'+I.st+' · '+I.rs+'</small></button>'}).join('')+'</div><div id="clsDetail301" style="margin-top:8px;font-size:13px;line-height:1.45;text-align:left;min-height:64px;opacity:.9">Clique numa classe para ver os detalhes.</div>';
    $('goBtn').hidden=true;document.querySelectorAll('[data-cls]').forEach(b=>b.addEventListener('click',()=>{const ci=+b.dataset.cls,I=info(ci);document.querySelectorAll('[data-cls]').forEach(x=>x.classList.toggle('on',x===b));$('clsDetail301').innerHTML='<b style="font-size:15px">'+I.c.n+'</b> · '+I.st+'<br>Recurso: <b>'+I.rs+'</b> · atributo principal: <b>'+I.at+'</b><br>Passiva <b>'+(PASSIVES[ci]?PASSIVES[ci].n:'')+'</b>: '+(PASSIVES[ci]?PASSIVES[ci].d:'')+'<br>Habilidades: '+I.c.sk.map(s=>s.n).join(' · ')+(window.Growth465?Growth465.panel(ci):'')+'<button class="btn hot" id="clsPick301" style="margin-top:6px">Escolher '+I.c.n+'</button>';$('clsPick301').addEventListener('click',()=>{profile=pickAwaken(ci);store.set('pds2_profile',profile);showProfile();$('goBtn').hidden=false;$('goBtn').textContent=(profile.classless?'DESPERTAR NA ESTRADA':'ENTRAR NA CIDADE');beep(880,.3,.06);$('reroll').hidden=!DEV})}));return}
  if(false){let n=0;
    const iv=setInterval(()=>{const r=RANKS[Math.floor(Math.random()*8)];$('roll').textContent=r.id;$('roll').style.color=r.c;$('rollc').textContent=CLASSES.filter((c,i)=>i<8&&!c.legacy)[Math.floor(Math.random()*7)].n.toUpperCase();beep(300+n*20,.04,.03);
      if(++n>26){clearInterval(iv);showProfile();beep(880,.3,.06);$('goBtn').disabled=false;$('goBtn').textContent=(profile.classless?'DESPERTAR NA ESTRADA':'ENTRAR NA CIDADE');$('reroll').hidden=!DEV}},80);return}
  startGame();
});
$('reroll').addEventListener('click',()=>{if(!DEV)return;profile=null;store.del('pds2_profile');store.del('pds3_run');$('goBtn').textContent='DESPERTAR';$('reroll').hidden=true;$('rollbox').hidden=true;$('goBtn').click()});
$('again').addEventListener('click',()=>{$('dead').hidden=true;player.dead=false;player.hp=player.maxhp;player.mp=player.maxmp;player.shield=player.maxsh;player.iT=2;player.slowT=0;player.bleedT=0;player.healShield=0;player.healShieldUntil=0;player.venomCharges=0;player.venomUntil=0;
  const return372=run.invReturn372;if(L.mode!=='world'){if(L.special)leaveDungeon(false);else leaveDungeon(true)}const c=nearestCity(player.x,player.z).c;player.x=return372?return372.x:c.x+rnd(-3,3);player.z=return372?return372.z:c.z+14;cam.x=player.x;cam.z=player.z;player.m.root.position.set(player.x,0,player.z);updChunks(true);paused=false;saveRun();toast('<b>[NARRADOR]</b> Você acordou em '+c.name+'.')});
function newGame(){if(!confirm('Começar um jogo novo? O save atual será APAGADO deste navegador. Se quiser guardar, cancele e use "Exportar save" antes.'))return;if(!confirm('Tem certeza? Não dá para desfazer.'))return;window._wipe=1;started=false;paused=true;store.set=()=>{};store.del('pds2_profile');store.del('pds3_run');removeEventListener('pagehide',saveRunPH);location.reload()}
function saveRunPH(){saveRun()}
$('newSave').addEventListener('click',newGame);
$('expSave').addEventListener('click',()=>{if(!profile){toast('Desperte primeiro.');return}saveCodeView(false)});$('impSave').addEventListener('click',()=>saveCodeView(true));
let playerAssetsReady405=false,playerAssetsPending405=null;
function startGame(){
  if(started)return;
  if(!MODELS.done){$('goBtn').textContent='CARREGANDO PERSONAGENS…';$('goBtn').disabled=true;MODELS.ready.then(()=>{MODELS.done=true;$('goBtn').disabled=false;startGame()});return}
  if(window.WARRIOR127_ENABLE&&profile&&(profile.cls===0||!/viajanteSoGuerreiro/.test(location.search))&&window.Warrior127&&!playerAssetsReady405){
    $('goBtn').textContent='CARREGANDO VIAJANTE…';$('goBtn').disabled=true;
    if(!playerAssetsPending405)playerAssetsPending405=Warrior127.prepare().then(()=>window.Proj155?Proj155.load('models/proj155/'):0)
      .then(()=>{playerAssetsReady405=true;$('goBtn').disabled=false;startGame()});return}
  $('title').hidden=true;
  if(profile.classless&&profile.creationPending91){profile.orderPending401=true;profile.creationPending91=false;}
  if(!loadRun())newRun();if(profile.classless){run.level=0;run.xp=0;}ensureRun();if(run.level>777){run.level=777;run.xp=0}if(!run.quests)run.quests=genQuests();normalizeRewardBudgetsBalance();
  makePlayer();if(run.pos){player.x=run.pos.x;player.z=run.pos.z}buildWorld();buildSteal();
  for(const p of run.party)makeHunterAlly(p,player.x+rnd(-2,2),player.z+2,false);
  for(const r of run.shadows)if(r.on)spawnShadowRec(r,player.x+rnd(-2,2),player.z+2);
  restoreSummons();
  for(const id of['stat','obj','mm','tb','pad','btns'])$(id).hidden=false;/* v410 (Ian): painel Histórico fora da tela de jogo; continua no MENU → HISTÓRICO */showG();
  if(profile.devGate){delete profile.devGate;store.set('pds2_profile',profile);for(const g of gates)g.double=true}refreshKeyLabels();finishTowerStory();
  window.Lights348?.warm();
  started=true;paused=false;applyHistory95();renderHistory95(true);cam.x=player.x;cam.z=player.z;
  const rk=RANKS[rankOf()];
  if(profile.classless)logNews('<b>[NARRADOR]</b> Viajante rank <b style="color:'+rk.c+'">'+rk.id+'</b> · Sem Classe. A queda da Fenda deixou marcas na estrada.',4000);
  else logNews('<b>[NARRADOR]</b> Viajante rank <b style="color:'+rk.c+'">'+rk.id+'</b> · '+CLASSES[profile.cls].n+'. Bem-vindo à Cidade de Aster.',4000);
  logNews('<b>[NARRADOR]</b> Portais abertos nas planícies. Veja no MAPA.');

  unlockLore('start');if(!profile.creationPending91)tutorial();setTimeout(styleTutorial,1200);setInterval(()=>{if(started&&run&&!player.dead)checkTitles()},3000);
  if(unl('season')&&seasonOn()&&profile.season!==weekId())setTimeout(()=>{toast('<b>[NARRADOR]</b> O FIM DO MUNDO COMEÇOU. Um Arconte inimigo abriu o Portal Primordial. Veja a Ordem.',7000);bigText('FIM DO MUNDO',1500)},6000);
  try{navigator.wakeLock&&navigator.wakeLock.request('screen').catch(()=>{})}catch(e){}
  if(profile.classless&&!profile.camp327?.m?.a1&&window.Campaign327)Campaign327.spawnAwakening();
  saveRun();if(profile.creationPending91)creationView();
}
document.addEventListener('visibilitychange',()=>{if(document.hidden){for(const k in keys)keys[k]=false;input.x=input.z=0;saveRun()}});
addEventListener('pagehide',()=>{if(started)saveRun()});
setInterval(()=>{if(started&&!paused)saveRun()},15000);
/* Narrador pessoal: fatos locais, nenhuma chamada de IA. */
function narratorMemory105(){
 if(!profile)return null;
 if(!profile.narrator105||profile.narrator105.v!==1)profile.narrator105={v:1,seed:Math.floor(Math.random()*2147483646)+1,clock:0,counts:{},seen:{},last:{},recent:[],facts:[],failed:{},regions:[],skills:[],dominant:null,lastSpoke:-120,sequence:0};
 return profile.narrator105;
}
function narratorTone105(m){const n=k=>m.recent.filter(x=>x===k).length;
 if(n('death')+n('narrow')+n('core_fail')>=3)return 'careful';
 if(n('support')>=3||n('returnwin')+n('nemesis')>=2)return 'warm';
 if(n('hard')+n('core_win')+n('siege')>=3||n('trial')+n('trial_necro')+n('trial_time')+n('trial_fenda')>=3)return 'warm';
 return CFG.narratorTease105===true&&m.recent.length>=12?'playful':'calm';
}
function narratorEvent105(kind,data={}){
 if(!profile||!NR_LINES105[kind])return;const m=narratorMemory105();
 const gap={support:20,necro:30,time:30,shift:120,city:180,explore:90}[kind]??NR_META107[kind]?.gap??0;
 if(m.last['event:'+kind]!==undefined&&m.clock-m.last['event:'+kind]<gap)return;
 m.last['event:'+kind]=m.clock;m.counts[kind]=Math.min(1000000,(m.counts[kind]||0)+1);m.sequence++;
 m.recent.push(kind);m.recent=m.recent.slice(-64);
 m.facts.push({kind,rank:Number.isInteger(data.rank)?data.rank:null,at:Math.floor(m.clock)});m.facts=m.facts.slice(-24);
 if(CFG.narrator105==='off')return;
 if(kind==='awakening'&&Object.keys(m.seen).some(k=>k.startsWith('awakening:')))return;
 const priority={awakening:100,rank:95,returnwin:90,death:85,fissure:80,narrow:75,hard:70,trial:65,support:50,shift:50,veteran:45}[kind]??NR_META107[kind]?.priority??30;
 if(kind==='death')NR105.queue=[];
 NR105.queue=NR105.queue.filter(e=>e.kind!==kind);
 NR105.queue.push({kind,data,priority,at:m.clock,expires:m.clock+(priority>=80?180:60)});
 NR105.queue.sort((a,b)=>b.priority-a.priority||b.at-a.at);NR105.queue=NR105.queue.slice(0,4);
}
function narratorChoose105(event,m){const bank=NR_LINES105[event.kind],tone=narratorTone105(m),once=event.kind==='awakening';
 const allowed=bank.map((text,i)=>({text,id:event.kind+':'+i,tone:event.kind==='death'?'careful':NR_META107[event.kind]?['careful','calm','warm','playful'][Math.floor(i/10)]:i>=15?'playful':i>=10?'warm':i<5?'careful':'calm'})).filter(l=>l.tone!=='playful'||CFG.narratorTease105===true);
 let pool=allowed.filter(l=>m.seen[l.id]===undefined);
 if(!pool.length&&!once)pool=allowed.filter(l=>m.clock-m.seen[l.id]>=3600);
 if(!pool.length)return null;
 const matched=pool.filter(l=>l.tone===tone);if(matched.length)pool=matched;
 const h=(Math.imul(m.seed|0,1664525)+Math.imul(m.sequence|0,1013904223))>>>0;return pool[h%pool.length];
}
function narratorSkill105(sk){if(!profile||!Number.isInteger(sk.sourceClass)||!nearestEnemy(player.x,player.z,18))return;const m=narratorMemory105();m.skills.push(sk.sourceClass);m.skills=m.skills.slice(-24);if(m.skills.length<24)return;
 const scores={};for(const c of m.skills)scores[c]=(scores[c]||0)+1;const best=Object.keys(scores).sort((a,b)=>scores[b]-scores[a])[0];if(scores[best]<16)return;
 if(m.dominant!==null&&m.dominant!==+best)narratorEvent105('shift');m.dominant=+best;
}
function narratorPortal105(g,cleared){if(!g||g.narratorExit105)return;g.narratorExit105=true;const m=narratorMemory105();if(!m)return;
 if(!cleared){if(!player.dead&&!g.coreFailed103&&!g.deathBreak103)narratorEvent105('retreat',{rank:g.rank});return}
 m.clears=(m.clears||0)+1;
 const kind=m.failed[g.rank]?'returnwin':player.hp/player.maxhp<.25?'narrow':g.rank>profile.rank?'hard':'victory';narratorEvent105(kind,{rank:g.rank});if(kind==='returnwin')delete m.failed[g.rank];
 if(m.clears>=20&&m.clears%10===0)narratorEvent105('veteran');
}
function narratorEnter105(g){g.narratorExit105=false;const m=narratorMemory105();const key=[g.id,g.seed].join(':');if(m.entry===key)return;m.entry=key;
 if(g.red)narratorEvent105('red',{rank:g.rank,gate:key});else if(g.rank>profile.rank)narratorEvent105('higher',{rank:g.rank,gate:key});
}
function narratorDeath105(){const m=narratorMemory105();const g=L.special?L.gate?.ref:L.gate;if(L.mode==='dungeon'&&g&&Number.isInteger(g.rank))m.failed[g.rank]=Math.min(999,(m.failed[g.rank]||0)+1);narratorEvent105('death',{rank:g?.rank})}
function narratorContext105(e){if(['stairs_up','stairs_down'].includes(e.kind))return L.mode==='dungeon'&&L.floors?.current===e.data.floor&&L.gate&&[L.gate.id,L.gate.seed].join(':')===e.data.gate;if(e.kind==='core_fail')return L.mode==='dungeon'&&!!L.defense?.failed;if(['rain','snow'].includes(e.kind))return L.mode==='world'&&WX.type===e.kind;if(e.kind==='night'||e.kind==='dawn')return L.mode==='world'&&isNight()===(e.kind==='night');if(['red','higher'].includes(e.kind))return L.mode==='dungeon'&&L.gate&&[L.gate.id,L.gate.seed].join(':')===e.data.gate;if(e.kind==='city')return !!inCity(player.x,player.z);if(e.kind==='explore')return L.mode==='world'&&!inCity(player.x,player.z);if(e.kind==='narrow')return player.hp/player.maxhp<.5;if(e.kind==='fissure')return !!profile.awakening103?.pending;return true}
function narratorUpdate105(dt){if(!started||!profile||!player||paused||player.dead)return;const m=narratorMemory105();m.clock+=Math.max(0,Math.min(dt,1));NR105.quietFor=Math.max(0,NR105.quietFor-dt);NR105.tick=(NR105.tick||0)+dt;if(NR105.tick<1)return;NR105.tick=0;
 if(narratorStoryBusy513()){narratorSilence513();return;}
 if(L.mode==='world'){
 const city=inCity(player.x,player.z),key=city?String(nearestCity(player.x,player.z).c.id):null;
 if(key&&key!==NR105.city)narratorEvent105('city');NR105.city=key;
 if(!city){const cell=Math.floor(player.x/400)+','+Math.floor(player.z/400);if(!m.regions.includes(cell)&&m.regions.length<256){m.regions.push(cell);if(m.regions.length>1)narratorEvent105('explore')}}
 }else NR105.city=null;
 NR105.queue=NR105.queue.filter(e=>e.expires>=m.clock&&narratorContext105(e));
 if(CFG.narrator105==='off'){NR105.queue=[];return}
 const interval=CFG.narrator105==='quiet'?300:CFG.narrator105==='chatty'?120:240;
 if(modalOpen||NR105.quietFor>0||m.clock-m.lastSpoke<interval||nearestEnemy(player.x,player.z,18)||AR103.trial)return;
 for(let i=0;i<NR105.queue.length;i++){const e=NR105.queue[i];if(m.clock-e.at<6||m.clock-(m.last['said:'+e.kind]??-1000)<600)continue;const line=narratorChoose105(e,m);if(!line)continue;
 m.seen[line.id]=m.clock;m.last['said:'+e.kind]=m.clock;m.lastSpoke=m.clock;NR105.queue.splice(i,1);
 narratorSayTop(line.text);return;
 }

}
function narratorSettings105(){const m=narratorMemory105(),mode=['off','quiet','normal','chatty'].includes(CFG.narrator105)?CFG.narrator105:'normal';return '<div class="sec">NARRADOR · SUA JORNADA</div><label for="narratorMode105"><span class="tipi" style="cursor:help" data-tip154="Liga ou desliga comentários no histórico. Avisos importantes continuam ativos.">Comentários do Narrador</span></label><select id="narratorMode105" onchange="setNarrator105(this.value)">'+[['off','Desligados'],['quiet','Poucos'],['normal','Equilibrados'],['chatty','Mais presentes']].map(([v,n])=>'<option value="'+v+'" '+(mode===v?'selected':'')+'>'+n+'</option>').join('')+'</select><label><input type="checkbox" '+(CFG.narratorTease105===true?'checked':'')+' onchange="CFG.narratorTease105=this.checked;applyCfg()"> Permitir provocações leves</label>'+btn('Ver lembranças','narrator105',0,!!m)}
function narratorView105(){const m=narratorMemory105();if(!m)return;view=narratorView105;const tone={careful:'Atento aos riscos recentes',warm:'Cúmplice das suas conquistas e cuidados',playful:'À vontade para provocar',calm:'Conhecendo seu caminho'}[narratorTone105(m)];let h='<div class="guide93"><strong>'+tone+'</strong><p>A relação acompanha acontecimentos recentes e pode mudar. O Narrador lembra do que aconteceu, sem decidir o que você pensa.</p></div>';
 h+=row('Experiências compartilhadas','Fendas concluídas: '+(m.clears||0)+' · Quedas acompanhadas: '+(m.counts.death||0)+' · Falas diferentes ouvidas: '+Object.keys(m.seen).length+'.','');
 const names={victory:'Fenda concluída',hard:'Vitória acima do seu rank',narrow:'Volta com pouca vida',retreat:'Expedição interrompida',death:'Queda',returnwin:'Vitória em rank de Fenda com derrota anterior',higher:'Entrada acima do seu rank',red:'Entrada em portal vermelho',explore:'Novo trecho explorado',city:'Chegada à cidade',support:'Cura de aliado ferido',necro:'Eco especial convocado',time:'Retorno à âncora temporal',fenda:'Portal superior criado',fissure:'Fissura persistente descoberta',trial:'Investigação concluída',awakening:'Segundo Despertar concluído',rank:'Promoção pela prova',shift:'Mudança no uso de classes',veteran:'Marco de expedições concluídas'};
 for(const f of m.facts.slice(-12).reverse())h+=row(names[f.kind]||NR_META107[f.kind]?.name||'Experiência',f.rank!==null&&RANKS[f.rank]?'Rank da experiência: '+RANKS[f.rank].id:'Registrado durante sua jornada.','');openModal('O NARRADOR E VOCÊ',h)}

function setNarrator105(value){if(!["off","quiet","normal","chatty"].includes(value))return;CFG.narrator105=value;if(value==="off")NR105.queue=[];applyCfg()}
let AR103={};
document.addEventListener('click',e=>{const b=e.target.closest('[data-a=kitform111]');if(b&&!b.disabled){kitToggleForm111(b.dataset.v)}});
