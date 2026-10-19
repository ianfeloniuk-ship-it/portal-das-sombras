/* ================= ORÁCULOS: STATUS, DIÁRIA, ECOS, GUILDA, FORJA, MONTARIA, DIA/NOITE, EVENTOS, APARÊNCIA, DIÁRIO ================= */
const STATN={for:'Força',des:'Destreza',agi:'Agilidade',per:'Percepção',int:'Inteligência',vit:'Vitalidade',res:'Resistência',esp:'Espírito',von:'Vontade'};
const STATD={for:'',agi:'',per:'',int:'',vit:''};
const DAILY=[['run','Correr',1000,'m'],['atk','Golpes',100,''],['dodge','Esquivas',20,''],['kill','Monstros',30,'']];
const todayKey=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);
const SHNAMES=['Kaizen','Vorn','Ignar','Velmor','Durak','Grimm','Nyx','Morvak','Eco Alfa','Rurik','Zael','Orsk'];
const LOOK_H=[null,0x222222,0xc85a1e,0xe8e8ff,0x3a5fd0,0xd0b070,0x8a2b8a,0x2f8a4a];
const LOOK_B=[null,0x2a3a5a,0x7a1a2a,0x1f6b4a,0x5a3a8a,0x8a7a50,0x222228,0xd8d8e0];
const LORE={
  anchor237:['A Âncora Rompida','Você viu a esfera de plasma se partir e as correntes caírem. Lyra explica: as esferas não são enfeite, são a tampa de uma prisão. Dentro de cada uma, um pedaço do Arquiteto dormia. Agora um deles está acordado no centro da cidade, e o chão em volta lembra o que ele é.'],
  act13:['Ato XIII · Quem Fechou a Porta','O Arquiteto se desfez em pó dourado no meio da estrada para Aster. Os cinco pedaços voltaram a dormir sob as âncoras. O Narrador ficou em silêncio por muito tempo, e depois disse só: "Obrigado." A porta está fechada. Por enquanto.'],
  act8:['Ato VIII · O Clã Ferrugem','Torvo, do Clã Ferrugem, conta que os goblins atravessaram a Fenda há cem anos, fugindo de um mundo que o Arquiteto já tinha esvaziado. "Ele não cria monstros. Ele recolhe. Nós fomos recolhidos uma vez. Não vamos ser de novo." O clã caça portais para que nenhum outro povo passe pelo que passaram.'],
  act9:['Ato IX · As Capitais','Lyra explica que cada capital foi erguida sobre uma Pedra-Âncora, um cristal tão antigo quanto a primeira Fenda. Enquanto as âncoras resistem, o mundo não rasga por inteiro. Os ataques às cidades nunca foram aleatórios: o Arquiteto está procurando as âncoras.'],
  act10:['Ato X · Pedaços de Deus','Aldric segura o fragmento dourado que caiu do Logos: "Isto é um dedo dele. Cada portal ★ vermelho é o Arquiteto tentando enfiar a mão neste mundo." Desde que você venceu, os portais ★ vermelhos ficaram mais raros por alguns dias. Ele sentiu.'],
  act11:['Ato XI · A Mão do Arquiteto','Ao fechar o Portal Primordial, você viu do outro lado uma mão de pedra e luz recuar. O Fim do Mundo não é um desastre: é um teste. O Arquiteto mede as muralhas, as âncoras e os caçadores. E anota.'],
  act12:['Ato XII · O Narrador','A voz que acompanha você desde o primeiro dia fala, pela primeira vez, sem tom de deboche: "Fui eu quem derrubou o primeiro guardião, há muito tempo. Achei que estava salvando este mundo. Só abri a porta para ele. Você é forte o bastante para fechá-la. Eu não fui." O próximo ciclo começa com uma pergunta: como se fecha uma porta que você mesmo abriu?'],
  start:['O Despertar','As Fendas trouxeram ameaças e viajantes de outros mundos. Os habitantes têm dons e ranks definidos; os Transmigradores conseguem evoluir além desses limites. Uma voz acompanha sua chegada: o Narrador. Sua origem permanece desconhecida.'],
  gate:['Fendas e Portais','Cada portal atravessa uma Fenda e leva a um fragmento de outro mundo. Se o guardião permanece vivo, a mana se acumula até transbordar: os monstros atravessam para o nosso lado.'],
  boss:['Guardiões','Todo portal tem um guardião. Quando ele cai, a masmorra perde a âncora e começa a se desfazer.'],
  city:['As Cidades','As muralhas das cidades foram erguidas com cristais de mana. Monstro nenhum atravessa. Por enquanto.'],
  high:['Portais de rank S e SS','A Ordem classifica essas Fendas nos ranks S e SS. São fragmentos de mundos quase esquecidos. Os caçadores que voltam de lá raramente contam tudo o que viram.'],
  shadow:['Ecos','Necromantes dizem ouvir os mortos pedirem para lutar de novo. Poucos conseguem responder.'],
  penalty:['A Zona de Penalidade','O Oráculo não perdoa quem ignora o treino. Ninguém escolhe ir para lá.'],
  past:['Antes dos Portais','Havia um guardião antes de todos. Ele não deixava nada sair. Alguém o derrotou, e a porta ficou aberta.'],
  dream:['O Sonho','Os monstros que mais te mataram moram na sua cabeça. Dá para enfrentá-los dormindo.'],
  temple:['O Santuário','Existe uma câmara oculta dentro de certas Fendas. O Vigia testa a ressonância dos despertos; quem completa os protocolos retorna ligado ao Oráculo.'],
  towerEnd:['Ato VII · A Porta do Arquiteto','No andar 100, o guardião caiu e a porta se abriu. Do outro lado não havia um trono: havia o mapa de incontáveis mundos rachados. Uma mensagem de Aldric esperava na pedra: "O Arquiteto constrói passagens, mas não decide quem atravessa. Essa escolha é nossa." Você deixou um sinal para a Ordem. O primeiro ciclo da torre está encerrado; os caminhos acima dele continuam abertos.']};
/* v220 (Ian): segundo ciclo da história (Atos VIII–XII), cada ato ligado a um sistema novo. */
function storyCh220(k){profile.lore=profile.lore||[];if(profile.lore.includes(k)||!LORE[k])return;unlockLore(k);setTimeout(()=>showSys('<b>'+LORE[k][0]+'</b><br>'+LORE[k][1]+'<br><small>Releia em DIÁRIO → História.</small>'),2500)}
function unlockLore(k){profile.lore=profile.lore||[];if(profile.lore.includes(k))return;profile.lore.push(k);store.set('pds2_profile',profile);(k==='start'?logNews:toast)('<b>[DIÁRIO]</b> Nova página: '+LORE[k][0])}
function v2Item(it){if(!it||it.v2)return;it.v2=1;delete it.bonus;delete it.def;const n=[0,0,1,1,2,2,2,3][it.rar]||0;
  it.aff=(it.aff||[]).slice(0,n).map(x=>{const A=AFX.find(y=>y.k===x.k)||{};return{k:x.k,v:Math.max(1,Math.min(x.v,Math.round((1+it.tier*.4)*(1+it.rar*.15)*(A.f||1)*1.3)))}});
  it.value=Math.round(PRICE[Math.min(9,it.tier)]*(1+.06*it.rar)*.4*Math.pow(1.15,it.up||0))}
function migrateSkillPoints113(){if(run.skillPoints113)return 0;const lv=Math.max(1,Math.floor(run.level||1)),points=Math.max(0,lv-1-Math.floor(lv/5));run.spts=(run.spts||0)+points;run.skillPoints113=true;return points}
function resetPointPassives253(){profile.transmigratorLv=0;profile.rankTalents=[];profile.pointPassivesLife253=Math.max(0,Math.floor(Number(profile.deaths)||0));delete run.lastMonsterXp253;}
function migratePointPassives253(){const life=Math.max(0,Math.floor(Number(profile.deaths)||0));if(profile.pointPassivesLife253===life)return;
  if(life>0){if(!store.get('pds_backup_point_passives_v252'))store.set('pds_backup_point_passives_v252',{deaths:life,transmigratorLv:profile.transmigratorLv||0,rankTalents:[...(profile.rankTalents||[])]});resetPointPassives253();}
  else profile.pointPassivesLife253=life;
  store.set('pds2_profile',profile);
}
function normalizeStoryProgress262(){
  if(!Array.isArray(profile.levelStory262))profile.levelStory262=[];
  if(Array.isArray(profile.story)){profile.levelStory262=[...new Set([...profile.levelStory262,...profile.story.filter(Number.isFinite)])];profile.story=Object.fromEntries(Object.entries(profile.story).filter(([k,v])=>!/^\d+$/.test(k)&&v&&typeof v==='object'))}
  else if(!profile.story||typeof profile.story!=='object')profile.story={};
}
function ensureRun(){migratePointPassives253();normalizeStoryProgress262();run.lamps=run.lamps||0;
  if(!profile.rk2){profile.rank=Math.max(profile.rank||0,Math.min(profile.rank===9?9:TOPR,rankOfOld()));profile.rk2=1;jobsOf();store.set('pds2_profile',profile)}
  if(run.v2&&!run.v2fix){run.v2fix=1;if((run.level||1)>1){const g=run.level-1;run.pts=(run.pts||0)+g;setTimeout(()=>showSys('Compensação do Oráculo 2.0: a conversão apagou os pontos que vieram de missões. Devolvemos <b>+'+g+' pontos de status</b> (1 por nível, estimativa). Abra Status.'),5500)}}if((profile.dayT||0)>dayT)dayT=profile.dayT;
  {const F=festival();if(F&&run.festDay!==todayKey()){run.festDay=todayKey();setTimeout(()=>toast('<b>[FESTIVAL]</b> '+F.n+': '+F.d+'.',7000),6000)}}
  for(const it of[run.equip&&run.equip.w,run.equip&&run.equip.a,...(run.items||[])])if(it&&/Soberan/.test(it.name))it.name=it.name.replace(/d[oa] Soberan[oa]/,'Primeva');
  if(!run.v2){run.v2=1;run.v2fix=1;const lv=run.level||1;run.stats={for:0,agi:0,per:0,int:0,vit:0};run.pts=2*(lv-1)+Math.floor(lv/5)*(profile.rebirths||0)+5*(profile.rebirths||0);
    for(const it of[run.equip&&run.equip.w,run.equip&&run.equip.a,...(run.items||[])])v2Item(it);AFFC=null;
    if(lv>1)setTimeout(()=>showSys('Atualização do jogo: seus atributos foram devolvidos: <b>'+run.pts+' pontos</b> para distribuir de novo (agora 1 por nível). Seus equipamentos foram ajustados ao novo sistema. Abra Status para distribuir.'),4500)}
  run.stats=run.stats||{for:0,agi:0,per:0,int:0,vit:0};for(const k of ATTR_NEW281)run.stats[k]=run.stats[k]||0;if(!run.attr281){run.attr281=1}run.pts=run.pts||0;run.skl=run.skl||{};run.spts=run.spts||0;const compensation113=migrateSkillPoints113();if(compensation113)setTimeout(()=>toast('Progressão de habilidades: agora você ganha 1 ponto por nível. +'+compensation113+' pontos retroativos adicionados.',7000),2000);
  if(!run.daily||run.daily.day!==todayKey()){if(run.daily&&!run.daily.done&&Object.values(run.daily.p||{}).some(v=>v>0))run.penalty=true;run.daily={day:todayKey(),repRank97:Math.min(9,rankOf()),p:{run:0,atk:0,dodge:0,kill:0},done:false}}
  questBudget262(run.daily,'daily');run.daily.p=run.daily.p||{};for(const [k,,n] of DAILY)run.daily.p[k]=clamp(Number(run.daily.p[k])||0,0,n);if(typeof run.trackObj!=='string')run.trackObj=null;
  run.shadows=(run.shadows||[]).map(s=>typeof s==='string'?{n:s,lvl:1,xp:0,nick:null,on:true}:s.n?s:{n:s.n,lvl:1,xp:0,on:true});
}
function dprog(k,v){const d=run.daily;if(!d||d.done)return;const g=DAILY.find(q=>q[0]===k);const b=d.p[k];d.p[k]=Math.min(g[2],b+v);
  if(b<g[2]&&d.p[k]>=g[2])toast('<b>[DIÁRIA]</b> '+g[1]+' concluído.');
  if(DAILY.every(q=>d.p[q[0]]>=q[2])){d.done=true;const baseXp=questBudget262(d,'daily').xp,canPay=profile.dailyXp262Day!==d.day;profile.dailyXp262Day=d.day;const xp=canPay?gainXp(baseXp,'quest'):0;addOrderRep(10,'Missão diária');run.pts+=1;player.hp=player.maxhp;player.mp=player.maxmp;bigText('DIÁRIA COMPLETA',1400);sfx('level');toast('<b>[NARRADOR]</b> Missão diária concluída: +'+xpNumber(xp)+' XP, +1 ponto de status e recuperação total.',5000);try{streak214()}catch(e){}saveRun()}}
/* v214 (Ian): sequência de diárias (dias reais seguidos). Fica no perfil, não se perde ao morrer. Pular um dia volta para o 1º. */
const STREAK214=['Bênção da Fenda (10 min)','Ouro','Pergaminho de Ressurgimento','Ouro em dobro','Bênção da Fenda (20 min)','Pergaminho de Ressurgimento','Relíquia nova'];
function streakDay214(){const S=profile.streak214||{};const t=todayKey();return S.last===t?S.n:S.last===t-1?(S.n%7)+1:1}
function streak214(){const t=todayKey(),S=profile.streak214=profile.streak214||{n:0,last:-9};if(S.last===t)return;S.n=S.last===t-1?(S.n%7)+1:1;S.last=t;store.set('pds2_profile',profile);
 const d=S.n,g=Math.round(500*(1+rankOf())*(d===4?2:1));let msg=STREAK214[d-1];
 if(d===1)giveBoon184(10);else if(d===5)giveBoon184(20);else if(d===3||d===6){run.rez187=Math.min(3,(run.rez187||0)+1)}else if(d===7){const r=relics183(),miss=Object.keys(UNIQ183).filter(k=>!r.own[k]);if(miss.length){const k=pick(miss);r.own[k]=1;if(r.eq.length<relicSlots192())r.eq.push(k);msg='Relíquia: '+UNIQ183[k].n}else{run.gold+=g*4;msg='Ouro (todas as relíquias já são suas)'}store.set('pds2_profile',profile)}else run.gold+=g;
 if(d===2||d===4)msg+=' +'+fmt(g);toast('<b>[DIÁRIA]</b> Sequência dia <b>'+d+'/7</b>: '+msg+'.',7000);if(d===7)bigText('SEQUÊNCIA COMPLETA',1800)}
function shadowCap(){return Math.max(3,2+Math.floor(((player&&player.maxmp)||60)/50))+(profile.rank===9?3:0)}
function summonCap(){return 2+Math.floor(((player&&player.maxmp)||60)/(hasClassPassive(6)?30:60))}
function minionAllies(includeEcos=false){return allies.filter(a=>a.life>0&&!a.dead&&!a.kitDevice111&&(includeEcos||!a.shadow)&&!a.guest&&!a.party&&!a.caravan)}
function shadowRecs(){return run.shadows}
const ORDERS=[['atacar','ATACAR','caçam os inimigos por perto'],['defender','DEFENDER','ficam perto e só atacam quem chega em você'],['seguir','SEGUIR','não lutam, só seguem você']];
function cycleOrder(){if(!allies.some(a=>a.shadow&&!a.dead)){toast('Você não tem ecos ativas.');return}const i=(ORDERS.findIndex(o=>o[0]===(run.order||'atacar'))+1)%ORDERS.length;run.order=ORDERS[i][0];bigText('ECOS: '+ORDERS[i][1],900);toast('<b>[NARRADOR]</b> Ordem ao exército: <b>'+ORDERS[i][1]+'</b> — '+ORDERS[i][2]+'.');sfx('arise')}
/* BESTIÁRIO: conta abates por espécie (permanente). Estudar uma espécie dá dano extra contra ela. */
const BEST_STEPS=[[10,.03,'Conhecido'],[50,.06,'Estudado'],[200,.10,'Dominado'],[1000,.15,'Lenda']];
function bestLvl(k){const n=((profile.bestiary||{})[k])||0;let l=null;for(const s of BEST_STEPS)if(n>=s[0])l=s;return l}
function bestMul(k){const l=k&&bestLvl(k);return l?1+l[1]:1}
function bestKill(k){if(!k||!KINDS[k])return;profile.bestiary=profile.bestiary||{};const before=bestLvl(k),n0=profile.bestiary[k]||0;profile.bestiary[k]=n0+1;const after=bestLvl(k);try{Bestiary294.loreCheck(k,n0,n0+1)}catch(_){}
  if(after&&after!==before){logNews('<b>[BESTIÁRIO]</b> '+KINDS[k].n+': <b>'+after[2]+'</b> — +'+Math.round(after[1]*100)+'% de dano contra essa espécie.');Bestiary294.corner('ESPÉCIE ESTUDADA',KINDS[k].n+' · '+after[2]+' · +'+Math.round(after[1]*100)+'% de dano','#ffd54f',k);sfx('level')}
  if(profile.bestiary[k]%5===1||after!==before)store.set('pds2_profile',profile)}
const AIDESC={melee:'Luta corpo a corpo',ranged:'Ataca de longe e mantém distância',lunge:'Dá saltos rápidos em você',slam:'Golpes pesados em área',wraith:'Flutua e dispara magia',rival:'Luta como um caçador'};
function bestInfo(k,n){const K=KINDS[k];let t='';

  if(n>=50)t+='<br>Comportamento: '+(AIDESC[K.ai]||'?')+(K.shield?' · escudo na frente bloqueia golpes':'');
  if(n>=200)t+='<br><span style="color:#6fe39a">Ponto fraco: '+(K.shield?'ataque pelas costas ou atordoe':K.ai==='ranged'||K.ai==='wraith'?'chegue perto, é frágil':K.ai==='slam'?'esquive do golpe lento e bata em seguida':K.ai==='lunge'?'esquive do salto e contra-ataque':'lento para reagir a atordoamento')+'</span>';
  if(n<200)t+='<br><span style="color:var(--dim)">Próxima informação em '+(n<10?10:n<50?50:200)+' abates.</span>';
  return t}
/* Ficha de referência calculada sem criar monstros nem modificar o mundo. */
function bestStats293(k,threat=0){const K=KINDS[k];if(!K)return '';const level=Math.max(1,run?.level||1),T=THREAT184[threat]||THREAT184[0],base=MonsterBalance.species(K,{}),e={kind:k,lvl:level,threat184:threat};
 const hp=base.hp*eHP(level)*T.h,dmg=base.damage*eDMG(level)*T.d;
 return '<p>Comparação no nível '+level+'. Escolha a ameaça para comparar.</p><label>Ameaça <select id="dexThreat351">'+THREAT_ORDER281.map(t=>'<option value="'+t+'"'+(t===threat?' selected':'')+'>'+safeText(THREAT184[t].n||'Comum')+'</option>').join('')+'</select></label><div class="dex348-stats"><span>Vida <b>'+fmt(Math.round(hp))+'</b></span><span>Dano <b>'+fmt(Math.round(dmg))+'</b></span><span>Defesa física <b>'+fmt(Math.round(mobDefVal296(e,'phy')))+'</b></span><span>Defesa mágica <b>'+fmt(Math.round(mobDefVal296(e,'mag')))+'</b></span></div>'}

function bestView(){view=bestView;const b=profile.bestiary||{};const ks=Object.keys(KINDS).filter(k=>!KINDS[k].alias308);const S294=(window.Bestiary294&&Bestiary294.seen())||{};let h='<div class="sysline"><b>[BESTIÁRIO]</b> Espécies descobertas: <b>'+ks.filter(k=>S294[k]||b[k]).length+'/'+ks.length+'</b>. Derrotar uma espécie revela sua história (1, 10, 50 e 100 abates) e dá dano extra contra ela (10, 50, 200 e 1000 abates).</div>';
  for(const k of ks){const n=b[k]||0,l=bestLvl(k),nx=BEST_STEPS.find(s=>n<s[0]);
    h+=(!n&&!S294[k])?row('<span style="color:var(--dim)">??? · não descoberto</span>','',''):!n?row('<b>'+KINDS[k].n+'</b>','Visto, mas ainda não derrotado.'+(window.Bestiary294?Bestiary294.loreHtml(k,0):''),''):row('<b>'+KINDS[k].n+'</b>'+(l?' <span style="color:#ffd54f">· '+l[2]+'</span>':''),'Abates: <b>'+fmt(n)+'</b>'+(l?' · +'+Math.round(l[1]*100)+'% de dano':'')+(nx?' · próximo nível em '+nx[0]:' · nível máximo')+bestStats293(k)+bestInfo(k,n)+(window.Bestiary294?Bestiary294.loreHtml(k,n):''),'')}
  openModal('BESTIÁRIO',h)}
/* VIAGEM RÁPIDA: pelos Portais de Viagem das cidades já visitadas (Ordem → Viagem). */
function markVisited(){if(!started||L.mode!=='world')return;const n=nearestCity(player.x,player.z);if(n.d<30*CITYK){profile.visited=profile.visited||{};if(!profile.visited[n.c.id]){profile.visited[n.c.id]={n:n.c.name,x:n.c.x,z:n.c.z};store.set('pds2_profile',profile);(n.c.name==='Aster'?logNews:toast)('<b>[NARRADOR]</b> Portal de Viagem de <b>'+n.c.name+'</b> registrado. Viaje pela Ordem (aba Viagem).',4500)}}}
/* v265: preço exibido e cobrado usam a mesma tarifa; imposto registrado uma vez. */
function servicePrice265(kind,options={}){const tier=options.tier==null?rankOf():options.tier;if(!Number.isInteger(tier)||tier<0||tier>=GR.length)throw new RangeError('tier');const o={...options,rankFactor:GR[Math.min(9,Math.max(0,rankOf()))].gold,tierFactor:GR[tier].gold,slotFactor:equipFactor(options.slot||'w')};return window.Econ154?Econ154.servicePrice(kind,o):Math.max(1,Math.ceil(ServicePrices265.base(kind,o)))}
function localPrice265(base){return window.Econ154?Econ154.localPrice(base):Math.max(1,Math.ceil(base))}
function spendService265(price){if(!Number.isSafeInteger(price)||price<1||!Number.isFinite(run.gold)||run.gold<price)return false;run.gold-=price;if(window.Econ154)Econ154.notePurchase(price);return true}
function forgePrice265(sl,tier){return servicePrice265('forge',{slot:sl,tier})}
function elixirPrice265(){return servicePrice265('elixir')}
function resurrectionPrice265(){return servicePrice265('resurrection')}
function restPrice265(){return Math.ceil(servicePrice265('rest',{innLevel:innLv()})*(window.Civic343?Civic343.restMul():1))}
function innUpgradePrice265(l){return servicePrice265('innUpgrade',{innLevel:l})}
function petPrice265(){return servicePrice265('pet')}
function mountPrice265(){return servicePrice265('mount')}
function recruitPrice265(p){return servicePrice265('recruit',{tier:p.rank,candidateLevel:p.lvl})}
function rodPrice265(l){return servicePrice265('rod',{rodLevel:l})}
function mapPrice265(){const offer=treasureOffer266();return offer?servicePrice265('treasureMap',{tier:offer.tier}):0}
function retiredPrice265(tier){return servicePrice265('retired',{tier})}
function housePrice265(moving){return localPrice265(moving?2000:HOUSE_P)}
function furniturePrice265(f){return localPrice265(f.p)}
function travelReady265(c){if(!c||!Number.isFinite(c.x)||!Number.isFinite(c.z)||L.mode!=='world')return false;if(enemies.some(e=>!e.dead&&e.aggro&&Math.hypot(e.x-player.x,e.z-player.z)<25)){toast('Monstros estão te perseguindo. Não dá para viajar agora.');return false}return true}
function travelCost(c){return travelCost219(Math.hypot(c.x-player.x,c.z-player.z)/1000)}
function travelTab(){const v=profile.visited||{};const ids=Object.keys(v);let h='<div class="sysline">Lyra: Os Portais de Viagem ligam as cidades que você já visitou. Não funciona com monstros te perseguindo.</div>';
  if(ids.length<2)h+='<div class="it"><div class="d"><small>Visite outras cidades para liberar viagens.</small></div></div>';
  const here=nearestCity(player.x,player.z).c.id;
  for(const id of ids){if(id===here)continue;const c=v[id];if(!c||!Number.isFinite(c.x)||!Number.isFinite(c.z))continue;const cost=travelCost(c);h+=row('<b>'+c.n+'</b>',fmt(Math.round(Math.hypot(c.x-player.x,c.z-player.z)))+' m de distância',btn('Viajar · '+fmt(cost),'travel',id,run.gold>=cost))}
  return h}
function albumView(){view=albumView;const a=profile.album||[];let h='<div class="sysline"><b>[NARRADOR]</b> Coleção de Ecos: <b>'+a.length+'</b> espécies já erguidas. A coleção fica mesmo se você morrer.</div>';
  if(!a.length)h+='<div class="it"><div class="d"><small>Nenhum eco erguido ainda. Use ERGUER ECO (F) em guardiões e elites.</small></div></div>';
  for(const n of a)h+='<div class="it"><div class="d"><b style="color:#b18cff">'+n+'</b><small>Eco registrado</small></div></div>';openModal('COLEÇÃO DE ECOS',h)}
function addShadow(rec){{profile.album=profile.album||[];const nm=String(rec.n||'');if(nm&&!profile.album.includes(nm)){profile.album.push(nm);store.set('pds2_profile',profile);toast('<b>[NARRADOR]</b> Novo eco na coleção: <b>'+nm+'</b> ('+profile.album.length+')')}}if(run.shadows.length>=20){toast('<b>[NARRADOR]</b> Seu exército está cheio (20).');return}rec.on=run.shadows.filter(s=>s.on).length<shadowCap();run.shadows.push(rec);if(rec.on)spawnShadowRec(rec,player.x+1,player.z+1);unlockLore('shadow')}
function spawnShadowRec(rec,x,z){const B=ALLBOSS().find(b=>b.n===rec.n);const a=spawnShadow(B||{n:rec.n},x,z,rec);return a}
function shadowXp(x){for(const a of allies)if(a.shadow&&!a.dead&&a.rec&&a.rec.on){const r=a.rec;r.xp+=x*.35;const need=80*Math.max(1,r.lvl);if(r.xp>=need){r.xp-=need;r.lvl++;fxRing(a.x,a.z,0xa26bff,2,.5);floater(a.x,a.z,'ECO NV '+r.lvl,'#b18cff');const f=1.08;a.maxhp*=f;a.hp=a.maxhp;a.dmg*=f}}}
/* Classes mágicas usam INT para ataque e habilidades; físicas usam FOR para os dois. */
const MAGIC_CLS=[3,5,6,7,8,9,10,11,12,13,16,18,19,20];
/* v297 (Ian): mais classes corpo a corpo — Monge (21), Lâmina Arcana (22, mago corpo a corpo), Lanceiro (23), Berserker (24). */
const MELEE_MAGIC297=[22];
CLASSES.push(
 {n:'Monge',w:10,ranged:false,body:0xc9862e,hair:0x2a1a10,wep:'none',sk:[S('Rajada de Punhos','cone',3,8,1.7,0xffc86a),S('Chute Giratório','nova',6,14,2,0xffa040),S('Postura da Montanha','guard',14,16,.3,0xd9b25a)].map(k=>({...k,resource260:'fury'}))},
 {n:'Lâmina Arcana',w:10,ranged:false,body:0x3a4fb0,hair:0xe8e8ff,wep:'sword',sk:[S('Corte Arcano','cone',3,10,1.9,0x8fa0ff),S('Lâmina Flamejante','buff_dmg',16,20,1.5,0xff7a3a),S('Salto Rúnico','dash_strike',6,14,2.3,0xb48cff)].map(k=>({...k,resource260:'mana'}))},
 {n:'Lanceiro',w:10,ranged:false,/* v339 (Ian): sem lança bate de perto; só arremessa a lança que está na mão */body:0x7a5a2a,hair:0x3b2a20,wep:'spear',sk:[S('Estocada Longa','cone',4,10,2.1,0xe0d0a0),S('Varredura de Lança','nova',5,12,1.8,0xffe0a0),S('Salto do Dragão','dash_strike',7,16,2.6,0xff8040)].map(k=>({...k,resource260:'vigor'}))},
 {n:'Berserker',w:10,ranged:false,body:0x8a1f1f,hair:0x5a2a12,wep:'axe',sk:[S('Golpe Brutal','cone',4,12,2.3,0xff4a2a),S('Redemoinho de Aço','nova',6,16,2.1,0xff6a3a),S('Sede de Sangue','buff_dmg',16,20,1.6,0xc81e1e)].map(k=>({...k,resource260:'fury'}))});
MAGIC_CLS.push(22);
PASSIVES[21]={n:'Punho Ressonante',d:'A cada 5 golpes seguidos, um impacto atinge todos os inimigos perto do alvo (40% do dano).'};
PASSIVES[22]={n:'Lâmina Sedenta',d:'Golpes corpo a corpo recuperam 2% da sua mana máxima.'};
PASSIVES[23]={n:'Primeiro Sangue',d:'O primeiro golpe em cada inimigo causa +20% de dano.'};
PASSIVES[24]={n:'Fúria Sanguinária',d:'Quanto menos vida você tem, mais dano causa: até +40% perto da morte.'};
CLASS_GK.push('Rogue','Knight','Knight','Barbarian');CLASS_TINT.push(null,null,null,null);
function passive297(e,amt,o){if(!o||!o.fromPlayer||!profile)return amt;
 if(hasClassPassive(24))amt*=1+.4*(1-Math.max(0,Math.min(1,player.hp/player.maxhp)));
 if(hasClassPassive(23)){e.firstHit297=e.firstHit297||0;if(!e.firstHit297){e.firstHit297=1;amt*=1.2}}
 if(hasClassPassive(22)&&Number.isInteger(o.basicClass)&&!o.skillHit&&!o.ptype300)player.mp=Math.min(player.maxmp,player.mp+player.maxmp*.02);
 if(hasClassPassive(21)&&Number.isInteger(o.basicClass)&&!o.skillHit&&!o.passive297){player.combo297=(time-(player.monkHit318??-Infinity)<=.85?(player.combo297||0):0)+1;player.monkHit318=time;if(player.combo297>=5){player.combo297=0;for(const x of enemies)if(x!==e&&!x.dead&&Math.hypot(x.x-e.x,x.z-e.z)<3)hurtEnemy(x,amt*.4,e.x,e.z,{fromPlayer:true,passive297:true,kb:2});try{fxRing(e.x,e.z,0xffc86a,3,.4)}catch(_){}}}
 return amt}
const isMagic=()=>MAGIC_CLS.includes(profile.cls);
function statsBonus(){const s=run.stats||{};return{dmg:1,skill:1+.05*gearRuneCount('arcane'),hp:1,mp:1,phys:1,mag:1,spd:1+.005*(s.agi||0),atk:1/(1+.004*(s.agi||0)),crit:.0025*(s.per||0)}}
/* ESTILO DE LUTA: natural da classe (100%) ou o outro (70%). Físico usa Força, arcano usa Inteligência. */
function canUseMagicStyle(){return jobsOf().some(ci=>MAGIC_CLS.includes(ci))}
function styleOff(){return basicIsMagic()!==isMagic()}
function basicIsMagic(){return isMagic()?run.style!=='off':run.style==='arc'&&canUseMagicStyle()}
function basicAttackId(){const magic=basicIsMagic(),known=jobsOf(),saved=(run.basicChoices||{})[magic?'mag':'phy'];if(known.includes(saved)&&MAGIC_CLS.includes(saved)===magic)return saved;if(MAGIC_CLS.includes(profile.cls)===magic)return profile.cls;const sk=learnedSkills().find(s=>MAGIC_CLS.includes(s.sourceClass)===magic&&classLoadout().includes(s.skillId));return sk?sk.sourceClass:known.find(ci=>MAGIC_CLS.includes(ci)===magic)??profile.cls}
function basicAttackClass(){return CLASSES[basicAttackId()]}
function basicAttackName259(){return MAGIC_CLS.includes(basicAttackId())===basicIsMagic()?basicAttackClass().n:'Mãos · Físico';}
function basicAttackDesc(ci){if(ci===23)return 'Sem arma: golpes corpo a corpo. Com lança equipada: arremessa a própria lança. Usa Força.';if(ci===1)return 'Sem arma: golpes corpo a corpo. Com adaga equipada: arremessos. Acertos causam sangramento de 30% do dano em 3 s.';const mode=MAGIC_CLS.includes(ci)?'Mágico · usa Inteligência':CLASSES[ci].ranged?'À distância · usa Destreza':'Corpo a corpo · usa Força';const effects={0:'3º golpe causa impacto curto; inimigos resistem a atordoamentos repetidos',1:'sangra por 30% do dano em 3s',2:'3º golpe recupera 2% do escudo máximo',4:'3ª flechada atravessa inimigos',5:'cada acerto cura 0,5% da sua vida máxima',6:'marca o alvo para suas invocações por 4s; +1 vaga a cada 30 de mana máxima',7:'marca o alvo por 4s: seus ecos causam +20% de dano nele',8:'queima por 25% do dano em 3s',9:'lentidão por 2s',10:'3º projétil causa impacto curto; inimigos resistem a atordoamentos repetidos',11:'3º disparo salta para mais um alvo com 25% do dano'};return mode+' · '+(effects[ci]||'projétil elemental')}
function selectBasicAttack(ci){if(!Number.isInteger(ci)||!jobsOf().includes(ci))return false;const magic=MAGIC_CLS.includes(ci);if(!prepareStyleWeapon259(magic))return false;run.basicChoices=run.basicChoices||{};run.basicChoices[magic?'mag':'phy']=ci;run.style=isMagic()?(magic?'nat':'off'):(magic?'arc':'nat');resetBasicPose259();saveRun();return true}
function basicAttackView(){view=basicAttackView;const active=basicAttackId();L.characterTab='skills';let h=characterTabs('skills')+characterBack118('Ataque básico')+'<div class="sysline">Escolha o ataque básico de uma classe aprendida. '+keyLabel(keyOf('style'))+' alterna entre físico e mágico.</div>';for(const ci of jobsOf())h+=row(CLASSES[ci].n,basicAttackDesc(ci),ci===active&&MAGIC_CLS.includes(ci)===basicIsMagic()?'<b>Em uso</b>':btn('Usar ataque','basicset',ci));h+='';openModal('PERSONAGEM',h,'basic')}
function applyBasicAttackEffect(e,ci,amt,third){if(e.dead)return;const P=player;
  if(ci===0&&third&&!e.isBoss)e.stun=Math.max(e.stun||0,.9);
  if(ci===2&&third)P.shield=Math.min(P.maxsh,P.shield+P.maxsh*.02);
  if(ci===5&&!hasAff('nocure'))P.hp=Math.min(P.maxhp,P.hp+P.maxhp*.005);
  if(ci===6)e.summonFocusUntil=time+4;
  if(ci===7)e.echoMarkUntil=time+4;
  if(ci===10&&third&&!e.isBoss)e.stun=Math.max(e.stun||0,.8);
  if(ci===11&&third){const target=enemies.filter(x=>x!==e&&!x.dead&&Math.hypot(x.x-e.x,x.z-e.z)<6).sort((a,b)=>Math.hypot(a.x-e.x,a.z-e.z)-Math.hypot(b.x-e.x,b.z-e.z))[0];if(target){zig([{x:e.x,z:e.z},{x:target.x,z:target.z}],0xfff36b);hurtEnemy(target,amt*.25,e.x,e.z,{kb:0,stun:0,pierce:true,passive:true})}}
  if(ci===9){e.slow=Math.max(e.slow||0,2);return}if(ci!==1&&ci!==8)return;const key=ci===1?'bleed':'burn';e.basicDots=e.basicDots||{};const old=e.basicDots[key];e.basicDots[key]={t:3,d:Math.max(old&&old.d||0,amt*(ci===1?.3:.25)/3),acc:old&&old.acc||0};floater(e.x,e.z,ci===1?'SANGRANDO':'QUEIMANDO',ci===1?'#ff4d6a':'#ff7a22')}
function updateBasicDots(e,dt){for(const [key,d] of Object.entries(e.basicDots||{})){const elapsed=Math.min(dt,Math.max(0,d.t));d.t-=elapsed;d.acc+=elapsed;while(d.acc+1e-9>=1&&!e.dead){d.acc-=1;hurtEnemy(e,d.d,e.x,e.z,{kb:0,stun:0,pierce:true,...(d.hit318||{})})}if(d.t<=0)delete e.basicDots[key]}}
function basicDmgMul(){/* v273 (Ian): arma física (arco, adaga, espada, machado) = dano físico no ataque básico, mesmo em classe mágica; habilidades seguem o tipo da própria habilidade */{const k=weaponKind272(run.equip.w)||'';if(/^(sword|axe|mace|spear|hammer|bow|dagger|firearm)$/.test(k))return (/^(bow|dagger|firearm)$/.test(k)?atkRanged281():atkOf('phy'))/Math.max(1,atkOf(isMagic()?'mag':'phy'));if(/^(staff|bonestaff|wand|tome|orb)$/.test(k))return atkOf('mag')/Math.max(1,atkOf(isMagic()?'mag':'phy'))}return (rangedPhysBasic281()?atkRanged281():atkOf(basicIsMagic()?'mag':'phy'))/Math.max(1,atkOf(isMagic()?'mag':'phy'))*(styleOff()&&!basicIsMagic()?.7:1)}
function styleTutorial(){if(!canUseMagicStyle()||profile.styleTut71||profile.creationPending91||profile.tips93)return;profile.styleTut71=true;store.set('pds2_profile',profile);toast('<b>[TUTORIAL]</b> Você conhece uma classe mágica. Aperte <b>'+keyLabel(keyOf('style'))+'</b> para alternar o ataque básico entre físico (Força) e mágico (Inteligência). As habilidades equipadas funcionam em qualquer estilo. Escolha fogo, gelo ou outro ataque aprendido em Personagem → Ataque básico. Reveja os controles em ⚙.',10000)}
function toggleStyle(){if(!started||paused)return;if(!canUseMagicStyle()){toast('<b>[NARRADOR]</b> Aprenda uma classe mágica na Ordem para usar o ataque básico arcano. Suas habilidades equipadas continuam disponíveis.');return}const next=!basicIsMagic();if(!prepareStyleWeapon259(next))return false;run.style=isMagic()?(next?'nat':'off'):(next?'arc':'nat');resetBasicPose259();bigText('ESTILO: '+(next?'ARCANO':'FÍSICO'),900);
  toast('<b>[NARRADOR]</b> Ataque básico: <b>'+(next?'ARCANO (Inteligência)':'FÍSICO (Força)')+'</b>. '+keyLabel(keyOf('style'))+' alterna novamente. As 6 habilidades equipadas não mudam.',5000);sfx('arise');hud();saveRun()}
/* Texto da Agilidade com os valores atuais e os limites (pedido do Irror: jogador precisa saber dos limites). */
function agiDesc(){const g=(run.stats||{}).agi||0,f=v=>v.toFixed(2).replace('.',',');
  return 'Velocidade de ataque: <b>+0,4% por ponto</b> · agora <b>+'+String(Math.round(.4*g*10)/10).replace('.',',')+'%</b> (sem limite)<br>Movimento: <b>+0,5% por ponto</b> · agora <b>+'+String(Math.round(.5*g*10)/10).replace('.',',')+'%</b> (sem limite)<br>Esquiva recarrega em <b>'+f(dodgeCdVal())+' s</b> = 1,50 s ÷ (1 + 1% por ponto) · sem limite, cada ponto sempre ajuda'}

function statDesc(){return {
 for:['Dano corpo a corpo e Fúria (não conta para arco e arremesso).','Cada ponto ganho no treino: +'+atkPer(run.level)+' de ataque corpo a corpo. A cada 20 pontos: +1 de Fúria por golpe.'],
 des:['Dano à distância (arco, adaga arremessada, arma de fogo) e penetração.','Vale para qualquer classe que atire: um Guerreiro de arco usa Destreza, não Força. Cada ponto ganho no treino: +'+atkPer(run.level)+' de ataque à distância e +'+preciseNumber(atkPer(run.level)*.5)+' de penetração.'],
 agi:['Velocidade de ataque, movimento e esquiva.','Cada ponto ganho no treino: +0,4% de velocidade de ataque e +0,5% de movimento. Reduz a recarga da esquiva.'],
 per:['Chance e dano crítico.','Cada ponto ganho no treino: +0,25% de chance e +0,5% de dano crítico.'],
 int:['Mana e dano mágico.','Cada ponto ganho no treino: +'+mpPer(run.level)+' de mana e +'+atkPer(run.level)+' de ataque mágico.'],
 vit:['Vida e Estamina.','Cada ponto ganho no treino: +'+hpPer(run.level)+' de vida e +0,5 de Estamina.'],
 res:['Defesa física e Fúria máxima.','Cada ponto ganho no treino: +'+atkPer(run.level)+' de defesa física e +0,5 de Fúria máxima.'],
 esp:['Defesa mágica e regeneração de mana.','Cada ponto ganho no treino: +'+atkPer(run.level)+' de defesa mágica. Recupera mana mais rápido.'],
 von:['Defesa geral e resistência a efeitos.','Cada ponto ganho no treino: +'+preciseNumber(atkPer(run.level)*.5)+' de defesa contra qualquer golpe e efeitos negativos mais curtos.']
}}
/* Linha com dica: passe o mouse (PC) ou toque no nome (celular) para ver a explicação. */
function tipFmt(t){if(String(t).includes('<br>'))return t;const p=String(t).split(/(?<=[.!])\s+(?=[A-ZÀ-Ú<(+−0-9])/).filter(x=>x.trim());return p.length>1?'<span style="display:block;margin-top:3px">• '+p.join('<br>• ')+'</span>':t}
function tipRow(name,short,tip,btns){// v154 (Irror): detalhes só no balão ao passar o mouse.
  return '<div class="it"'+(tip?' data-tip154="'+tipAttr154(tipFmt(tip))+'" style="cursor:help"':'')+'><div class="d">'+cap154(name)+'<small>'+cap154(short)+'</small></div><div class="acts">'+btns+'</div></div>'}
function guildBonus(){const g=profile.guild;return g?.03*g.lvl:0}
function guildNeed(l){return 1600*l*l}
const GUILD_LVL=50;function guildCost(){return typeof Econ154!=='undefined'&&Econ154.H?Math.round(8*Econ154.H(rankOf())):Math.round(8*400*GR[Math.max(0,Math.min(9,rankOf()))].gold)}
const GUILDS=[
 {n:'Coroa Branca',lvl:5,req:5,lead:'Aldric, rank S',h:'A guilda mais antiga do mundo. Foi fundada no dia em que o primeiro portal se abriu, por sete caçadores que fecharam juntos o Portal de Aster. Só aceitam quem já provou ser rank A.'},
 {n:'Lâminas do Crepúsculo',lvl:4,req:3,lead:'Seraphine Vael, rank A',h:'Caçam de noite, quando os monstros são mais fortes. Dizem que Seraphine nunca perdeu um membro numa masmorra. Nunca ninguém confirmou.'},
 {n:'Legião de Ferro',lvl:3,req:2,lead:'Gorran, o Muro, rank B',h:'Tanques e guerreiros que defendem as cidades nas quebras de masmorra. Foi a Legião que segurou Valkor na Grande Invasão.'},
 {n:'Olho de Mirath',lvl:3,req:1,lead:'A Vidente, rank desconhecido',h:'Colecionam mapas, segredos e rumores dos portais. Ninguém sabe o rosto da líder. Alguns dizem que ela sabe da parede escondida.'},
 {n:'Caçadores Livres',lvl:1,req:0,lead:'Toma, rank D',h:'A guilda de quem está começando. Pouco bônus, muito coração. Metade dos caçadores famosos passou por aqui.'}];
/* dia e noite */
/* v377 (Ian): dia de 14 min e noite de 10 min (ciclo de 24 min). */
let dayT=120;const DAYLEN=1440,NIGHT0_377=.55,NIGHT1_377=.55+600/1440;
/* v384: relógio do dia. Noite (18h–6h) ocupa a faixa NIGHT0–NIGHT1 do ciclo; o dia, o resto. */
function clock384(){const p=(dayT%DAYLEN)/DAYLEN,n0=NIGHT0_377,n1=NIGHT1_377;let h;if(p>=n0&&p<n1)h=18+12*(p-n0)/(n1-n0);else{const d=(p>=n1?p-n1:p+1-n1)/(1-(n1-n0));h=6+12*d}h%=24;const H=Math.floor(h),M=Math.floor((h-H)*60/5)*5;return (H>=6&&H<18?'☀ ':'☾ ')+String(H).padStart(2,'0')+':'+String(M).padStart(2,'0')}
function isNight(){const p=(dayT%DAYLEN)/DAYLEN;return p>NIGHT0_377&&p<NIGHT1_377}
/* v205 (Ian): no Fim do Mundo, a cada dia de jogo uma horda marcha para a cidade mais próxima de você (até 150 m). */
function hordeTick205(){const d=gameDay198();if(window.HD205===undefined){window.HD205=d;return}if(d===HD205)return;HD205=d;
 if(!player||player.dead||L.mode!=='world'||!unl('season')||!seasonOn()||profile.season===weekId())return;
 const near=nearestCity(player.x,player.z),c=near.c;if(!c||near.d>150||cityFallen(c)||c.name==='Aster')return;
 const gr=clamp(rankOf(),0,9),a=rnd(0,TAU),hx=c.x+Math.cos(a)*90,hz=c.z+Math.sin(a)*90,n=6+gr+(d%7);const R=RAID155[c.id]||(RAID155[c.id]={hp:100,warned:false});
 for(let i=0;i<n;i++){const k=wpick(kindsFor(gr)).k,e=spawnKind(k,hx+rnd(-6,6),hz+rnd(-6,6),gr,{wild:true,breaker:true});threatApply184(e,threatRoll184(gr,false,{red:1}));e.gold*=2;e.raid155={city:c.id,cx:c.x,cz:c.z,tx:c.x,tz:c.z}}
 toast('<b>[NARRADOR]</b> FIM DO MUNDO: uma horda de '+n+' monstros marcha para <b>'+c.name+'</b>. Defenda a cidade!',7000);bigText('HORDA',1400)}
function weekTick198(){try{hordeTick205()}catch(_){}const w=weekId();if(window.WK198===undefined){window.WK198=w;return}if(w===WK198)return;WK198=w;try{towerWeek202()}catch(_){}
 if(unl('season')&&seasonOn()&&profile.season!==w){toast('<b>[NARRADOR]</b> O FIM DO MUNDO COMEÇOU. Um Arconte inimigo abriu o Portal Primordial. A cada dia de jogo mais cidades caem. Veja a Ordem.',8000);bigText('FIM DO MUNDO',1800)}
 else toast('<b>[ORDEM]</b> Nova semana de jogo: o chefe semanal mudou.',5000)}
function updDayNight(dt){dayT+=Math.max(dt,dt>0?(window.WDT196||dt):0);try{weekTick198()}catch(_){}if(profile)profile.dayT=dayT;if(L.mode!=='world')return;const p=(dayT%DAYLEN)/DAYLEN;const n=clamp(Math.min((p-(NIGHT0_377-.03))/.06,(NIGHT1_377+.03-p)/.06),0,1);(window.NIGHT153U||(window.NIGHT153U={value:0})).value=n;
  if(ENV.ok){if(!L.dn)L.dn={sd:new THREE.Color(0x48a8ef),sn:new THREE.Color(0x101c3d),fd:new THREE.Color(0xa5d8ed),fn:new THREE.Color(0x1d3152),hd:new THREE.Color(0xd9f1ff),hn:new THREE.Color(0x7899ce),gd:new THREE.Color(0x587a52),gn:new THREE.Color(0x2e4557),ud:new THREE.Color(0xfff5df),un:new THREE.Color(0xb6c9ff),gray:new THREE.Color(0x87909a),w:0};
    const D=L.dn,wt=typeof WX!=='undefined'?(WX.type==='rain'?.75:WX.type==='snow'?.45:0):0;D.w+=(wt-D.w)*Math.min(1,dt*.4);
    scene.background.copy(D.sd).lerp(D.gray,D.w*.8).lerp(D.sn,n);scene.fog.color.copy(D.fd).lerp(D.gray,D.w*.8).lerp(D.fn,n);hemi.color.copy(D.hd).lerp(D.hn,n);hemi.groundColor.copy(D.gd).lerp(D.gn,n);sun.color.copy(D.ud).lerp(D.un,n);
    hemi.intensity=(.85-.35*n)*(1-D.w*.18);sun.intensity=(.90-.52*n)*(1-D.w*.45);scene.fog.density=.0105+D.w*.006}
  else{const day=new THREE.Color(0x48a8ef),night=new THREE.Color(0x101c3d);scene.background.copy(day).lerp(night,n);scene.fog.color.copy(new THREE.Color(0xa5d8ed)).lerp(new THREE.Color(0x1d3152),n);
  hemi.intensity=1-.45*n;sun.intensity=1.05-.6*n}if(L.moon)L.moon.visible=n>.3;
  if(n>.99&&!L.nightNote){L.nightNote=true;narratorEvent105('night');toast('<b>[NARRADOR]</b> A noite caiu. Monstros mais fortes nas terras selvagens.')}if(n<.01){if(L.nightNote)narratorEvent105('dawn');L.nightNote=false}}
/* eventos do mundo */
let evT=240;
function updEvents(dt){if(L.mode!=='world'||!player||player.dead||profile?.classless)return;updRaids155(dt);updSiege(dt);evT-=dt;if(evT>0)return;evT=rnd(300,480);const P=player,nc=nearestCity(P.x,P.z);if(nc.d<36*CITYK){evT=60;return}
  if(profile.nemesis&&Math.random()<.4){spawnNemesis();return}
  if(unl('time')&&Math.random()<.12){const g=newGate();g.rank=clamp(rankOf(),0,9);g.time=true;g.red=false;g.life=500;g.x=P.x+rnd(-30,30);g.z=P.z-45;gates.push(g);gateMesh(g);toast('<b>[EVENTO]</b> Um portal com cor de sépia apareceu. Parece levar a outra época.',6000);bigText('PORTAL DO TEMPO',1200);return}
  if(Math.random()<.22){const g=newGate();g.rank=clamp(rankOf(),0,9);g.inverse=true;g.red=false;g.life=500;g.x=P.x+rnd(-30,30);g.z=P.z-45;gates.push(g);gateMesh(g);toast('<b>[EVENTO]</b> Um PORTAL INVERTIDO apareceu. Do outro lado fica o ninho deles.',6000);bigText('PORTAL INVERTIDO',1200);return}
  const pr=rankOf(),r=Math.random();
  /* v435 (Ian): Aster é o último refúgio; só o Arquiteto a ataca. Invasão não mira Aster. */
  if(r<.34&&nc.c&&nc.c.name!=='Aster'){const c=nc.c,a=pick([0,Math.PI/2,Math.PI,Math.PI*1.5]),x=c.x+Math.cos(a)*48,z=c.z+Math.sin(a)*48,gr=clamp(pr,0,9);for(let i=0;i<8;i++){const e=spawnKind(wpick(worldKinds124(gr,x,z)).k,x+rnd(-5,5),z+rnd(-5,5),gr,{wild:true,breaker:true});e.gold*=3;if(i<2)makeElite(e)}
    for(const e of enemies)if(e.breaker&&!e.dead&&Math.hypot(e.x-x,e.z-z)<10)e.inv=true;L.inv={c,t:150,targets116:enemies.filter(e=>e.inv&&!e.dead&&Math.hypot(e.x-x,e.z-z)<10)};
    toast('<b>[EVENTO] INVASÃO!</b> Monstros cercam a cidade de <b>'+c.name+'</b>. Mate todos em <b>2:30</b> (marcados no mapa). Participar de uma defesa vitoriosa aumenta a confiança local. Se a invasão persistir, o abastecimento será afetado e os preços locais podem subir até 20%. Depois, ajude na recuperação pelo Diário → Região.',12000);
    showSys('INVASÃO em '+c.name+'. Vá até lá e derrote todos os monstros antes do tempo acabar. O resultado muda os preços da cidade (veja em NOTÍCIAS).');
    if(spawnCityDefenders(c,c.x+Math.cos(a)*38*CITYK,c.z+Math.sin(a)*38*CITYK)){toast('<b>[CIDADE]</b> Os guardas de '+c.name+' saíram para lutar.')}bigText('INVASÃO',1200)}
  else if(r<.67){const a=rnd(0,TAU),x=P.x+Math.cos(a)*38,z=P.z+Math.sin(a)*38;const e=spawnRival(x,z,clamp(pr+1,0,9),{wild:true,breaker:true});e.name='Lendário '+e.name;e.legend=true;e.hp*=4;e.maxhp*=4;e.gold*=6;e.xp*=4;e.m.body.scale.multiplyScalar(1.25);
    const dir=['leste','sudeste','sul','sudoeste','oeste','noroeste','norte','nordeste'][((Math.round(Math.atan2(z-P.z,x-P.x)/(Math.PI/4))%8)+8)%8];
    toast('<b>[EVENTO]</b> Um <b style="color:#ffd54f">caçador lendário</b> foi visto a '+Math.round(Math.hypot(x-P.x,z-P.z))+'m ao <b>'+dir+'</b> (estrela dourada no MAPA). Recompensa enorme, perigo enorme.',9000)}
  else{const g=newGate();g.rank=clamp(pr+1,0,9);g.red=true;g.giant=true;g.life=600;g.x=P.x+rnd(-40,40);g.z=P.z-50;gates.push(g);gateMesh(g);g.mesh.scale.setScalar(1.8);toast('<b>[EVENTO]</b> Um PORTAL GIGANTE vermelho se abriu perto de você. Recompensas triplas.',6000);bigText('PORTAL GIGANTE',1200)}
}
/* montaria */
function setMount(on){const P=player;if(on&&!run.mount)return;if(on&&L.mode!=='world'){toast('Montarias só fora das masmorras.');return}
  if(P.mountM){scene.remove(P.mountM.root);P.mountM=null}run.mounted=on;
  if(on&&MODELS.fox){const m=foxMount();scene.add(m.root);P.mountM=m;sfx('dodge')}else if(on){const pm=toon(0x1f5f86,0x0a2a40);const m=makeChibi({mat:pm,skinMat:pm,legMat:pm,eye:0xffd08a,scale:1.25});m.body.rotation.x=0;scene.add(m.root);P.mountM=m;sfx('dodge')}}
/* aparência */
function rebuildLook(){const P=player;if(!P)return;const st={x:P.x,z:P.z,face:P.face};scene.remove(P.m.root);const {m,aura}=playerModel();P.m=m;P.aura=aura;P.x=st.x;P.z=st.z;m.root.position.set(P.x,0,P.z)}
/* penalidade */
function penaltyUpd(S,dt){S.sp=(S.sp||0)-dt;const left=60-S.t;S.msg='ZONA DE PENALIDADE · sobreviva '+fmtT(left);
  if(S.sp<=0&&left>0){S.sp=3.5;for(let i=0;i<4;i++){const a=rnd(0,TAU);let x=Math.cos(a)*16,z=Math.sin(a)*16;if(!freeAt(x,z,.6)){x=0;z=0}const e=spawnKind(pick(['rogue','demon','minion']),x,z,S.gr,{});e.aggro=true;fxRing(x,z,0xff8a1e,1.5)}}
  if(left<=0){for(const e of enemies)if(!e.dead){e.dead=true;e.gone=true;scene.remove(e.m.root)}L.bossDead=true;L.closeT=30;for(const it of L.exits)if(it.locked){unlockExitModel131(it)}
    bigText('PENALIDADE CUMPRIDA',1600);toast('<b>[NARRADOR]</b> Penalidade cumprida. Não ignore o treino de novo.',4000)}}
/* janelas novas */
function characterTabs(tab){return '<div class="tabs">'+[['status','Status'],['skills','Habilidades'],['passives','Passivas'],...(profile.rank>0||profile.rankTalents?.length?[['rank','Rank']]:[]),['titles','Títulos'],['build','Build'],...(awakeningDiscovered109()?[['awakening','Despertar']]:[])].map(([k,n])=>btn(n,'character',k,true,k===tab?'on':'')).join('')+'</div>'}
function characterView(tab='status'){L.characterTab=tab;if(tab==='awakening')return awakeningView103();if(tab==='rank')return rankView114();if(tab==='skills')return skillsView();if(tab==='passives')return passivesView();if(tab==='titles')return titlesView();if(tab==='build')return buildView();return statusView()}
function rankView114(){if(!(profile.rank>0||profile.rankTalents?.length))return statusView();view=rankView114;L.characterTab='rank';openModal('PERSONAGEM',characterTabs('rank')+rankTalentRows(),'rank')}
function masteryReady114(){const skills=learnedSkills();return skills.length>0&&skills.every(sk=>(run.skl[sk.n]||0)>=10)}
/* v390 (Ian): coisas do próprio personagem (habilidades, passivas, atributos, talentos, formas) se mexem em qualquer lugar, não só na cidade. */
function canRedistribute(){return !!player&&!player.dead}
function redistributeAttributes(){if(!canRedistribute())return false;let points=0;for(const k in STATN)points+=Math.max(0,Math.floor(run.stats[k]||0));if(!points)return false;for(const k in STATN)run.stats[k]=0;run.pts+=points;refreshStats();saveRun();return true}
function resetRankTalents(){if(!canRedistribute())return false;profile.rankTalents=[];saveRun();return true}
function statusView(){view=statusView;L.characterTab='status';let h=characterTabs('status')+'<div class="guide93"><strong>'+safeText(profile.name||CLASSES[profile.cls].n)+'</strong><p>Nível '+run.level+' · Rank '+RANKS[rankOf()].id+' · '+className()+'</p><p>'+xpProgressText(xpProgress())+'</p><p>Atributos sobem <b>treinando</b>: cada ação conta para a meta do atributo e, ao completar, ele ganha 1 ponto.</p></div>';const D=statDesc();for(const k in STATN)h+=tipRow(STATN[k]+': <b>'+(run.stats[k]||0)+'</b>',D[k][0],D[k][1],'<span class="a465-stat" data-stat465="'+k+'"></span>');/* v465 (Ian): sem +1/+5 nem Redistribuir — não existe ponto para colocar */h+='<div class="tabs">'+btn('Aparência','look',0)+'</div>';if(run.level>=100*((profile.rebirths||0)+1))h+=row('Reencarnação','Recomeça no nível 1, reinicia atributos e habilidades e concede bônus permanentes. Mantém ouro, itens e ecos.',btn('Reencarnar','rebirth',0,true,'red'));openModal('PERSONAGEM',h,'status')}
function tipText155(html){return String(html).replace(/<br\s*\/?>|<\/(div|p|li)>/gi,'\n').replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&').replace(/\n\s*\n+/g,'\n').trim()}
/* v158→ Ian: habilidade não abre/fecha no clique; a explicação aparece no balão ao passar o mouse. */
function skillUpgradeRow(sk,cost=1){const lv=run.skl[sk.n]||0,up=skillUpgradeText(sk),tip=tipText155(skillDesc(sk));return '<div class="it skill155" data-tip154="'+gearText(tip)+'" style="cursor:help"><div class="d"><b>'+safeText(sk.n)+'</b><div style="font-size:12px;line-height:1.4;margin:4px 0">'+safeText(sk.kit111?briefSkill260(sk):tipText155(skillEffect102(sk)))+'</div><small>'+(lv>=10?'Melhorias 10/10 · máximo':'Melhorias '+lv+'/10')+' · '+manaCostText258(sk)+(lv<10&&sk.mp>0?' → '+manaCost177(sk,lv+1)+' '+resourceName260(sk):'')+' · Recarga '+skillCooldownText(sk)+'s</small></div><div class="acts">'+(lv>=10?'':btn('Melhorar · '+cost+(cost===1?' ponto':' pontos'),cost===1?'skup':'skup2',sk.n,run.spts>=cost).replace('<button','<button data-tip154="'+gearText(tipText155(up))+'"'))+'</div></div>'}
function skillsView(){view=skillsView;L.characterTab='skills';let h=characterTabs('skills')+'<div class="sysline"><b>'+run.spts+' pontos disponíveis</b> · +1 por nível</div><div class="tabs">'+btn('Ataque básico','basicview',0)+btn('Equipar habilidades · '+classSlotCount()+(classSlotCount()===1?' espaço':' espaços'),'loadout',0)+'</div>';if(jobsOf().length>1)h+=kitFilter111();h+=btn('Combinar técnicas','comboview261',0);const seen=new Set();/* v341 (Ian): a lista mostra só as habilidades em uso; as outras ficam recolhidas, para o ponto não ir na habilidade errada. */const eq341=new Set(player.skills.filter(s=>!s.empty).map(s=>s.n));let others341='',nOthers341=0;for(const sk of [...player.skills.filter(s=>!s.empty),...learnedSkills()]){if(seen.has(sk.n))continue;seen.add(sk.n);if(!(jobsOf().length===1||kitVisible111(sk)))continue;if(eq341.has(sk.n))h+=skillUpgradeRow(sk);else{others341+=skillUpgradeRow(sk);nOthers341++}}/* v390 (Ian): só aparecem as habilidades em uso; as outras não entram na lista de melhorar. */if(nOthers341)h+='<div class="sysline" style="font-size:12px">Você tem mais '+nOthers341+(nOthers341===1?' habilidade aprendida fora de uso':' habilidades aprendidas fora de uso')+'. Para melhorar uma delas, equipe primeiro em <b>Equipar habilidades</b> (em qualquer lugar).</div>';
 if(profile.cls===3&&run.level>=20){h+='<details open><summary onclick="event.preventDefault()" style="list-style:none;cursor:default;font-weight:700">Elemento</summary>';for(const k in ELEM){const E=ELEM[k];h+=row(E.n,E.d,run.elem===k?'Atual':btn(run.elem?'Trocar · '+fmt(servicePrice265('element'))+' ouro':'Escolher','elem',k,!run.elem||run.gold>=servicePrice265('element')))}h+='</details>'}
 for(const ci of jobsOf())for(const sk of (KIT_DEFS111[ci]||[]).filter(s=>s.expansion260&&!kitUnlocked111(ci,Number(s.skillId.split(':')[1])))){if(jobsOf().length===1||kitVisible111(sk))h+=row(sk.n+' · bloqueada',briefSkill260(sk)+'<br><b>'+kitRequirement111(ci,Number(sk.skillId.split(':')[1]))+'</b>','')}h+='<details><summary>Como recuperar os recursos</summary>'+resourceGuide260()+'</details>';h+=kitProgress111();const lib=powLib();if(lib.length){h+='<details open><summary onclick="event.preventDefault()" style="list-style:none;cursor:default;font-weight:700">Poderes absorvidos · '+lib.length+'</summary>'+libRows();for(const sk of lib)if(!seen.has(sk.n))h+=skillUpgradeRow(sk,2);h+='</details>'}if(run.fused)h+=row(run.fused.n,run.fused.tag,'');if(run.shadows.length)h+=btn('Exército de ecos','army',0);
 const ready=masteryReady114(),mastery=run.mastery||0;if(ready||mastery>0)h+=row('Maestria · '+mastery,'+'+preciseNumber(mastery*.5)+'% de dano e vida.'+(ready?'':' Maximize as habilidades aprendidas para voltar a investir.'),btn('Melhorar · 1 ponto','mast',0,ready&&run.spts>0));openModal('PERSONAGEM',h,'skills')}

/* v258: preço pela melhoria da habilidade; capacidade não encarece o uso. */
function manaCost177(skill,level){const object=skill&&typeof skill==='object',base=object?skill.mp:skill;const improvement=level==null?(object&&run?run.skl?.[skill.n]||0:0):level;return passiveCost263(object?resourceType260(skill):'mana',Mana258.cost(base,improvement))}
function manaCostText258(sk,level){return resourceText260(sk,level)}
function paySkill258(sk,returning=false){if(sk&&!returning)curDType281=MAGIC_CLS.includes(sk.sourceClass??profile.cls)?'mag':'phy';return resourcePay260(sk,returning)}
function finishSkill258(sk,receipt){if(!receipt||receipt.done)return;receipt.done=true;if(receipt.returning)return;player.lastResourceCombat258=time;player.resourceRest258=false;player.castSerial258=(player.castSerial258||0)+1;const ag=rankTalent('aegis');if(ag&&player.maxsh!==undefined)player.shield=Math.min(Math.max(player.maxsh,player.maxhp*.04*ag),(player.shield||0)+player.maxhp*.04*ag);if(receipt.mana>0&&rankTalent('freecast')&&Math.random()<.25){player.mp=Math.min(player.maxmp,player.mp+receipt.mana);floater(player.x,player.z,'ECO GRATUITO','#9fe8ff',true)}}
function resourceCombat258(){if(player&&!player.dead){player.lastResourceCombat258=time;player.resourceRest258=false}}
function recoveryTick258(dt){const P=player;if(!P||P.dead)return;if(P.resourceRegion258!==L){P.resourceRegion258=L;P.lastResourceCombat258=time;P.resourceScan258=0;P.resourceRest258=false}P.resourceScan258=(P.resourceScan258||0)-dt;if(P.resourceScan258<=0){P.resourceScan258=.25;P.resourceThreat258=enemies.some(e=>!e.dead&&e.aggro&&Math.hypot(e.x-P.x,e.z-P.z)<40)||projs.some(p=>p.team==='enemy'&&Math.hypot(p.x-P.x,p.z-P.z)<18)}if(P.resourceThreat258||P.bleedT>0)P.lastResourceCombat258=time;P.resourceRest258=time-(P.lastResourceCombat258??time)>=6}
function naturalRegen(P=player,safe=false){return {hp:hasAff('nocure')?0:P.maxhp*((hasT('brk600')?.01:0)+(safe?.015:0)+(hasPassive263('recovery')&&P.resourceRest258&&!hasAff('nocure')?.003:0)),mp:Mana258.regeneration(run?.level||1,P.maxmp,!!P.resourceRest258)*(!P.resourceRest258&&hasPassive263('mana_flow')?1.15:1)*Math.max(0,1+pManaRegen281()),shield:P.maxsh*.2*(hasT('brk30')?1.3:1)*(hasPassive263('shield_flow')?1.15:1),shieldWait:Math.max(0,P.shT||0)}}
function regenRows(){const P=player,regen=naturalRegen(P),unit=v=>preciseNumber(v)+'/s';let h='<div class="sec">RECUPERAÇÃO</div>';h+=tipRow('Vida',unit(regen.hp),'Fora da cidade: '+unit(naturalRegen(P,false).hp)+'. Na zona segura: '+unit(naturalRegen(P,true).hp)+'.','');h+=tipRow('Mana',unit(regen.mp),'Em combate: '+unit(naturalRegen({...P,resourceRest258:false},false).mp)+'. Após 6s sem combate: '+unit(naturalRegen({...P,resourceRest258:true},false).mp)+'.','');h+=tipRow('Estamina',unit(vigorRate263())+' após '+preciseNumber(resourceWait263('vigor'))+'s sem gastar.','Máximo: '+preciseNumber(vigorMaxR260())+'.','');h+=tipRow('Fúria','Ganha ao atacar e receber dano.','Golpes: +'+(6+Number(hasPassive263('warm_blood')))+'; terceiro: +'+(12+Number(hasPassive263('warm_blood')))+'. Dano recebido: +5. Perde 5/s após '+resourceWait263('fury')+'s sem ganhar ou gastar.','');h+=tipRow('Escudo',unit(regen.shield)+' após 4s sem dano.','Espera restante: '+preciseNumber(regen.shieldWait)+'s.','');return h}
function livingWeaponRows318(){let h='';const living=run.equip.w;if(specialGear354(living)&&unl('living'))h+='<details open><summary onclick="event.preventDefault()" style="list-style:none;cursor:default;font-weight:700">Arma viva · '+gearText(living.name)+' · NV '+(living.wlv||0)+'/10</summary><div class="sysline">A arma ganha experiência ao derrotar inimigos. Cada nível soma 2% ao seu bônus de ataque. '+((living.wlv||0)>=10?'Nível máximo.':Math.floor(living.wxp||0)+' / '+Math.round(120*Math.pow((living.wlv||0)+1,1.5))+' XP para o próximo nível.')+' A experiência pertence a esta arma.</div></details>';return h}
function buildView(){view=buildView;L.characterTab='build';let h=characterTabs('build')+equipmentPanel()+livingWeaponRows318()+bagGearRows156()+awakenRows155()+charSheet()+regenRows();const effects=[];for(const sl of EQUIP_SLOTS){const it=run.equip[sl],r=GEAR_RUNES[it?.rune];if(r)effects.push(row(EQUIP_LABEL[sl]+' · '+r.n,r.d,''))}for(const set of activeSets())effects.push(row(set.n,set.d,''));if(effects.length)h+='<details open><summary onclick="event.preventDefault()" style="list-style:none;cursor:default;font-weight:700">Efeitos do equipamento</summary>'+effects.join('')+'</details>';openModal('PERSONAGEM',h,'build')}

function armyView(){view=armyView;const on=run.shadows.filter(s=>s.on).length,cap=shadowCap();
  let h='<div class="sysline">Ecos ativos: <b>'+on+'/'+cap+'</b> · Exército: '+run.shadows.length+'/20. Ecos ganham nível lutando. Ao morrer, ficam guardados no nível 0 e podem ser chamados novamente.</div>';
  if(!run.shadows.length)h+='<div class="it"><div class="d"><small>'+(canArise()?'Use ERGUER ECO (F) em guardiões e elites.':'Só o Necromante levanta ecos.')+'</small></div></div>';
  run.shadows.forEach((r,i)=>{h+=row((r.nick?'<b>'+r.nick+'</b> · ':'')+r.n+' <b>NV '+r.lvl+'</b>',(r.on?'Invocada':'Guardada')+' · XP '+Math.floor(r.xp)+'/'+80*Math.max(1,r.lvl),btn(r.on?'Guardar':'Invocar','shtog',i,r.on||on<cap)+btn('Renomear','shname',i)+btn('Libertar','shfree',i,true,'red'))});
  openModal('EXÉRCITO DE ECOS',h)}
function startFirstEquipment(){if(profile.classless)return;if(!profile.journey92||profile.firstEquipment92)return;profile.firstEquipment92={done:false};run.trackObj='firstEquipment';toast('<b>[NARRADOR]</b> Seu primeiro equipamento: encontre uma peça em uma masmorra, fabrique na forja, compre com Kael ou troque com ele (escambo, sem ouro). Depois, equipe pela Bolsa; a primeira arma desperta sua classe. Acompanhe a missão no Diário.',6500)}
function firstEquipmentObjective(){const q=profile.firstEquipment92;if(!q||q.done)return null;const found=run.items.some(it=>EQUIP_SLOTS.includes(it.slot));
 return {id:'firstEquipment',n:'Seu primeiro equipamento',d:found?'<div class="guide93"><strong>2. Equipe sua peça</strong><p>Abra a Bolsa e escolha Equipar. No PC, também pode arrastar para a posição correspondente.</p></div>':'<div class="guide93"><strong>1. Consiga um equipamento</strong><p>Monstros e baús das masmorras dão equipamentos. A forja também fabrica peças quando for liberada.</p><p>Sem ouro, Kael troca uma arma de treino por escambo (uma vez); a arma escolhida desperta sua classe. Comprar com Kael é uma alternativa cara: botas F a partir de '+equipmentShopPrice('b',0)+' ouro. Nenhuma peça exige rank para usar.</p></div>',progress:found?'Etapa 2 de 2 · equipe uma peça da bolsa':'Etapa 1 de 2 · encontre, fabrique ou compre uma peça',ready:false}}
function finishFirstEquipment(){const q=profile.firstEquipment92;if(!q||q.done||!Object.values(run.equip).some(it=>it&&EQUIP_SLOTS.includes(it.slot)))return false;q.done=true;addOrderRep(10,'Primeiro equipamento');if(run.trackObj==='firstEquipment')run.trackObj=null;store.set('pds2_profile',profile);toast('<b>[NARRADOR]</b> Seu primeiro equipamento: concluído. Você conseguiu sua primeira peça e a equipou. O próximo passo é seu.',6500);saveRun();return true}
function journeyObjectives(){const list=[],nx=profile.rank+1;const eq=run.extractMission117;if(eq)list.push({id:'extract117',n:'Missão de extração',d:eq.completed?'Receba a recompensa com Lyra, na Ordem.':'Envie materiais pela torre verde. '+questXpText262(eq,'extract')+'. Retome com Lyra se sair.',progress:Math.min(6,eq.sent)+'/6',ready:eq.completed});const first=firstEquipmentObjective();if(first)list.push(first);
  if(nx<=9){const need=GR[nx].lvl,ready=rankTrialReady(nx);list.push({id:'rank',n:'Prova de Rank '+RANKS[nx].id,d:ready?'Você cumpriu os requisitos. Procure Lyra na Ordem e enfrente o Examinador. Sua reputação permanece após a prova.':'Alcance o nível '+need+' e '+fmt(orderRepNeed(nx))+' de reputação da Ordem.'+(nx===9?(isTwiceAwakened103()?' Exige também o Segundo Despertar concluído.':' Continue a história para descobrir o requisito restante.'):'')+' Ganhe reputação fechando masmorras e concluindo missões, na ordem que preferir.',progress:'Nível '+run.level+'/'+need+' · reputação '+fmt(orderRep())+'/'+fmt(orderRepNeed(nx))+(ready?' · prova disponível':''),ready})}
  else if(!(profile.lore||[]).includes('towerEnd'))list.push({id:'towerend',n:'A Porta do Arquiteto',d:'Complete o andar 100 da Torre da Ascensão para encerrar o primeiro ciclo da história.',progress:'andar '+Math.min(100,profile.towerBest||0)+'/100',ready:false});
  for(const S of STORIES){const st=(profile.story||{})[S.id];if(!st||st.done)continue;const sp=S.steps[st.s];if(!sp)continue;const got=STORY_ABS[sp[0]]?STORY_ABS[sp[0]]():st.got||0;list.push({id:'story:'+S.id,n:S.n,d:sp[2],progress:'capítulo '+(st.s+1)+'/'+S.steps.length+' · '+Math.min(got,sp[1])+'/'+sp[1],ready:got>=sp[1]})}
  (run.quests||[]).forEach((q,i)=>list.push({id:'quest:'+i,n:q.d+questTargetText262(q),d:q.got>=q.n?'Recompensa pronta. Volte à Ordem da Fenda para receber.':'Recompensa: '+questXpText262(q)+' · '+fmt(q.rw)+' ouro e '+questOrderRep(q)+' de reputação da Ordem. Receba com Lyra na Ordem da Fenda. '+QUEST_XP_RULE332,progress:Math.min(q.got,q.n)+'/'+q.n,ready:q.got>=q.n}));return list}
function trackedObjective(){return run.trackObj?journeyObjectives().find(o=>o.id===run.trackObj)||null:null}
function journeyView(tab='goals'){view=()=>journeyView(tab);let h=(L.mode==='world'?regionSummary116(nearestCity(player.x,player.z).c):'')+btn('Bestiário / Grimório','bestv',0)+((profile.album||[]).length||run.shadows.length?btn('Coleção de ecos','album',0):'')+row('O Narrador e você','Lembranças da sua jornada e uma relação que muda com suas experiências.',btn('Ver lembranças','narrator105',0))+'<div class="tabs">'+[['goals','Missões e objetivos'],['story','História'],['lore','Descobertas']].map(([k,n])=>btn(n,'journeytab',k,true,k===tab?'on':'')).join('')+'</div>';
  if(tab==='goals'){if(profile.firstEquipment92?.done)h+=row('Seu primeiro equipamento · concluído','Você conquistou ouro, comprou uma peça e aprendeu a equipá-la.','✓');h+='<div class="sysline">Escolha um objetivo para acompanhar. Receba recompensas com Lyra, na Ordem.</div>';const list=journeyObjectives(),tracked=trackedObjective();
    for(const o of list){const active=tracked&&tracked.id===o.id;h+=row('<b>'+o.n+'</b>'+(active?' · ◆ acompanhando':''),o.d+'<br><b>'+o.progress+'</b>',btn(active?'Parar de acompanhar':'Acompanhar','trackobj',active?'':o.id,true,o.ready?'hot':''))}
    if(!list.length)h+='<div class="sysline">Nenhum objetivo pendente. Novas histórias estão na Ordem da Fenda.</div>';
    h+='<div class="sec">MISSÃO DIÁRIA'+(run.daily&&run.daily.done?' · CONCLUÍDA':'')+'</div><div class="sysline"><span class="tipi" style="cursor:help" data-tip154="Recompensa: '+questXpText262(run.daily,'daily')+', +10 reputação, +1 atributo, vida e mana cheias. Bônus: '+STREAK214[streakDay214()-1]+'. Faltar um dia reinicia a sequência.">Complete os quatro objetivos até a meia-noite. Sequência: dia '+streakDay214()+'/7 ('+STREAK214[streakDay214()-1]+').</span></div>';for(const [k,n,total,unit] of DAILY){const got=Math.min(total,(run.daily&&run.daily.p&&run.daily.p[k])||0);h+=row(n,Math.floor(got)+'/'+total+(unit?' '+unit:''),got>=total?'✓':'')}
  }else if(tab==='story'){h+='<div class="sysline">Cada Prova de Rank revela um ato. As histórias paralelas começam com a Ordem da Fenda.</div>';let any=false;
    for(let i=1;i<MAIN_ACTS.length;i++)if(profile.rank>=i||(profile.acts||[]).includes(i)){any=true;h+=row('<b>'+MAIN_ACTS[i][0]+'</b>',MAIN_ACTS[i][1],'')}
    if(!any)h+='<div class="sysline">Passe na primeira Prova de Rank para receber o chamado de Lyra.</div>';
    if((profile.lore||[]).includes('towerEnd'))h+=row('<b>'+LORE.towerEnd[0]+' · CONCLUSÃO</b>',LORE.towerEnd[1],'');
  }else{let any=false;for(const k of profile.lore||[]){const page=LORE[k];if(!page)continue;any=true;h+=row('<b>'+page[0]+'</b>',page[1],'')}if(!any)h+='<div class="sysline">Explore as Fendas para descobrir novas páginas.</div>'}
  openModal('DIÁRIO DE JORNADA',h)}
function diaryView(){journeyView('lore')}
function lookView(){view=lookView;const lk=profile.look||{h:0,b:0};let h='<div class="sysline">Mude a aparência do seu Viajante. Fica salvo no seu despertar.</div>';
  h+=row('Cabelo','Estilo '+(lk.h||'da classe'),btn('Trocar','lookh',0))+row('Roupa','Cor '+(lk.b||'da classe'),btn('Trocar','lookb',0));openModal('APARÊNCIA',h)}
/* v384 (Ian): save por ARQUIVO (.json), sem o texto enorme que travava a tela. Códigos antigos ainda carregam. */
function saveData384(){return {p:profile,r:store.get('pds3_run'),v:window.PDS_V||0,at:Date.now()}}
function loadSave384(d){if(!d||!d.p)throw 0;profile=d.p;store.set('pds2_profile',profile);if(d.r)store.set('pds3_run',d.r);else store.del('pds3_run');closeModal();showProfile();$('goBtn').textContent='CONTINUAR';toast('Save carregado.')}
function exportSave384(){try{saveRun()}catch(e){}const b=new Blob([JSON.stringify(saveData384())],{type:'application/json'}),a=document.createElement('a'),d=new Date(),z=n=>String(n).padStart(2,'0');a.href=URL.createObjectURL(b);a.download='primeva-save-'+d.getFullYear()+z(d.getMonth()+1)+z(d.getDate())+'-'+z(d.getHours())+z(d.getMinutes())+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('Save baixado como arquivo. Guarde no Drive, no PC ou mande no WhatsApp.')}
function importSave384(){const f=document.createElement('input');f.type='file';f.accept='.json,.txt,application/json,text/plain';f.onchange=()=>{const file=f.files&&f.files[0];if(!file)return;file.text().then(t=>{t=t.trim();let d;try{d=JSON.parse(t)}catch(_){d=JSON.parse(decodeURIComponent(escape(atob(t))))}if(!confirm('Carregar este save? Isto substitui o progresso atual deste aparelho.'))return;loadSave384(d)}).catch(()=>toast('Arquivo de save inválido.'))};f.click()}
function saveCodeView(imp){view=()=>saveCodeView(imp);
  const h=imp?'<div class="sysline">Escolha o arquivo do save (.json). Isto substitui o progresso atual deste aparelho.</div><div style="display:flex;justify-content:flex-end;margin-top:6px">'+btn('ESCOLHER ARQUIVO','loadsave',0,true,'hot')+'</div>'
   :'<div class="sysline">O save é baixado como um arquivo pequeno (.json). Guarde no Drive, no PC ou mande no WhatsApp; para recuperar, use Importar save e escolha o arquivo.</div><div style="display:flex;justify-content:flex-end;margin-top:6px">'+btn('BAIXAR SAVE','copysave',0,true,'hot')+'</div>';
  openModal(imp?'IMPORTAR SAVE':'EXPORTAR SAVE',h)}
function guildTab(){const g=profile.guild;let h='';
  if(!g){h+='<div class="sysline">Entre numa guilda ou funde a sua. A guilda sobrevive à sua morte.</div>';
    for(const G of GUILDS){const ok=rankOf()>=G.req;h+='<div class="it"><div class="d"><b>'+G.n+'</b> · nível '+G.lvl+' · +'+(G.lvl*3)+'% XP e ouro<small>Líder: '+G.lead+' · exige rank '+RANKS[G.req].id+'</small><small style="margin-top:3px">'+G.h+'</small></div><div class="acts">'+btn('Entrar','gjoin',G.n+'|'+G.lvl,ok)+'</div></div>'}
    {const c=guildCost(),ok=run.level>=GUILD_LVL&&run.gold>=c;h+='<div class="sec">FUNDAR UMA GUILDA</div>'+row('Nova guilda','Só existem 5 guildas no mundo. Fundar a sexta custa <b class="gold">'+fmt(c)+'</b> de ouro e exige nível '+GUILD_LVL+' (você: '+run.level+').',btn('Fundar','gmake',0,ok,'hot'))}}
  else{const G=GUILDS.find(x=>x.n===g.name);h+='<div class="sysline">Guilda <b>'+g.name+'</b> · Nível <b>'+g.lvl+'</b> · bônus +'+Math.round(guildBonus()*100)+'% XP e ouro</div>'+(G?'<div class="sysline" style="font-size:12px;color:var(--dim)">Líder: '+G.lead+'. '+G.h+'</div>':'');
    if(g.own&&g.lvl<10)h+=row('Doações',fmt(g.don)+' / '+fmt(guildNeed(g.lvl))+' para o nível '+(g.lvl+1),btn('1.000','gdon','1000',run.gold>=1000)+btn('10.000','gdon','10000',run.gold>=10000));
    h+=row('Sair da guilda','',btn('Sair','gleave',0,true,'red'))}
  return h}
/* Cristais do rank do item OU MAIORES servem para aprimorar; gasta primeiro os de rank mais baixo (pedido do Irror). */
function cryUp(t){let n=0;for(let r=t;r<10;r++)n+=run.res.cry[r]||0;return n}
function spendCry(t,n){for(let r=t;r<10&&n>0;r++){const u=Math.min(n,run.res.cry[r]||0);run.res.cry[r]-=u;n-=u}}
const GEAR_RUNES={
 ward:{n:'Proteção Ressonante',d:'Recebe 3% menos dano por peça. Soma entre peças; aplica depois das outras reduções.'},
 reprise:{n:'Eco do Golpe',d:'A cada 4 acertos básicos, repete 20% do dano por peça após 1s. Não gera outra repetição; novos ecos no mesmo alvo renovam o impacto mais forte.'},
 stalker:{n:'Instinto Predador',d:'Ataques básicos causam +10% de dano por peça contra alvos acima de 80% da vida.'},
 fang:{n:'Ferida da Caçada',d:'Ataques básicos causam mais 10% do dano como sangramento em 3s. Novos golpes renovam, sem acumular sangramentos.'},
 shell:{n:'Couraça Natural',d:'+8% ao escudo máximo. Requer armadura equipada para ter escudo.'},
 arcane:{n:'Condutor Arcano',d:'+5% ao poder de dano das habilidades. Não aumenta cura ou quantidade de invocações.'},
 vigor:{n:'Reserva Etérea',d:'+5% à mana máxima.'},
 stride:{n:'Passos Leves',d:'+3% à velocidade de movimento.'},
 command:{n:'Vínculo do Guardião',d:'+8% ao dano dos seus ecos e invocações. Não afeta caçadores contratados.'}
};
function lootRune(key){if(GEAR_RUNES[run.loot?.[key]?.rune])return run.loot[key].rune;if(run.loot?.[key]?.b)return 'command';const prefix=key.split(' de ')[0];if(['Presa','Garra','Chifre'].includes(prefix))return 'fang';if(['Couro','Escama','Osso'].includes(prefix))return 'shell';if(['Essência','Olho','Fragmento'].includes(prefix))return 'arcane';if(prefix==='Pena')return 'stride';return 'vigor'}
function gearRuneCount(id){return EQUIP_SLOTS.reduce((n,sl)=>n+(specialGear354(run?.equip?.[sl])&&run.equip[sl].rune===id?1:0),0)}
function gearRuneText(it){const r=specialGear354(it)&&GEAR_RUNES[it.rune];return r?' · Passiva gravada: '+r.n+' — '+r.d:''}
function applyGearRuneHit(e,amt){const repeat=gearRuneCount('reprise');if(repeat&&!e.dead&&e.hp>0){player.runeHits=(player.runeHits||0)+1;if(player.runeHits%4===0){e.basicDots=e.basicDots||{};e.basicDots.reprise={t:1,d:Math.max(e.basicDots.reprise?.d||0,amt*.2*repeat),acc:0};fxRing(e.x,e.z,0xb98cff,1,.3)}}const n=gearRuneCount('fang');if(!n||e.dead||e.hp<=0)return;e.basicDots=e.basicDots||{};const old=e.basicDots.rune;e.basicDots.rune={t:3,d:Math.max(old?.d||0,amt*.1*n/3),acc:old?.acc||0}}
function equipmentUpgradeCost(eq){const up=eq.up||0;return{gold:servicePrice265('upgrade',{tier:eq.tier,slot:eq.slot,upgrade:up}),cry:3*(up+1)}}
function finishEquipmentUpgrade(eq,safe=false){const up=eq.up||0;if(!safe&&up>=10&&Math.random()<Math.min(.6,.2+(up-10)*.04)){toast('<b>[FORJA]</b> O aprimoramento falhou. Materiais perdidos; equipamento preservado.');sfx('block');narratorEvent105('upgrade_fail');return false}narratorEvent105('upgrade_win');eq.up=up+1;eq.bn=eq.bn||eq.name;eq.name=eq.bn+' +'+eq.up;eq.value=Math.round(eq.value*1.15);refreshStats();fxRing(player.x,player.z,0xffd070,2.5);toast('<b>[FORJA]</b> '+eq.name+': '+statTxt(eq));return true}
function lootForgeQuote(sl,key,mode){
  const material=Object.prototype.hasOwnProperty.call(run.loot||{},key)?run.loot[key]:null;if(!EQUIP_SLOTS.includes(sl)||!material||!['new','up','rune'].includes(mode))return null;
  const eq=run.equip[sl];if(mode!=='new'&&!eq)return null;if(mode==='rune'&&!specialGear354(eq))return null;
  if(mode==='rune')return{tier:eq.tier,gold:servicePrice265('rune',{tier:eq.tier,slot:sl}),cry:3,parts:material.recipeParts|| (material.b?3:12),rune:lootRune(key)};
  const tier=mode==='new'?rankOf():eq.tier,up=eq?.up||0,base=mode==='up'?equipmentUpgradeCost(eq):{gold:forgePrice265(sl,tier),cry:5};
  return{tier,gold:mode==='up'&&!material.b?Math.ceil(base.gold*.75):base.gold,cry:mode==='up'&&!material.b?Math.max(1,Math.ceil(base.cry*.75)):base.cry,parts:mode==='new'?(material.b?3:10):(material.b?3+Math.floor(up/5):5+up),rar:material.b?2:1,safe:!!material.b};
}
function canLootForge(sl,key,mode,q=lootForgeQuote(sl,key,mode)){
  return !!q&&unl('forge')&&L.mode==='world'&&!!inCity(player.x,player.z)&&run.loot[key].n>=q.parts&&run.gold>=q.gold&&cryUp(q.tier)>=q.cry&&(mode!=='new'||run.items.length<bagCapacity353())&&(mode!=='rune'||run.equip[sl].rune!==q.rune);
}
function craftWithLoot(sl,key,mode){const q=lootForgeQuote(sl,key,mode);if(!canLootForge(sl,key,mode,q))return false;
  if(!spendService265(q.gold))return false;run.loot[key].n-=q.parts;spendCry(q.tier,q.cry);
  if(mode==='new'){const fl=profLv('forge'),rar=Math.max(q.rar,wpick([Math.max(4,30-fl*2),40,22+fl,8+fl*.8,fl*.25].map((w,i)=>({i,w}))).i);const it=makeItem(sl,q.tier,rar);run.items.push(it);profXp('forge',10+q.tier*5);sfx('boom');toast('<b>[FORJA]</b> '+it.name+' criado e guardado na bolsa.');narratorEvent105('craft');}
  else if(mode==='rune'){run.equip[sl].rune=q.rune;narratorEvent105('rune');refreshStats();sfx('boom');toast('<b>[FORJA]</b> Passiva gravada: '+GEAR_RUNES[q.rune].n+'.')}
  else finishEquipmentUpgrade(run.equip[sl],q.safe);
  saveRun();return true;
}
function lootForgeView(sl){if(!EQUIP_SLOTS.includes(sl))return;view=()=>lootForgeView(sl);const mode=['new','up','rune'].includes(L.lootMode)?L.lootMode:'new',keys=Object.keys(run.loot||{}).filter(k=>run.loot[k].n>0),eq=run.equip[sl];
  let h='<div class="sec">1. ESCOLHA A PEÇA</div><div class="tabs">'+EQUIP_SLOTS.map(k=>btn(EQUIP_LABEL[k],'lootforge',k,true,sl===k?'on':'')).join('')+'</div><div class="sec">2. O QUE VOCÊ QUER FAZER?</div><div class="tabs">'+[['new','Criar equipamento'],['up','Melhorar equipado'],['rune','Gravar passiva']].map(([k,n])=>btn(n,'lootmode',sl+'|'+k,true,mode===k?'on':'')).join('')+'</div>';
  h+='<div class="sysline">Ouro disponível: <b>'+fmt(run.gold)+'</b> · Libera no nível 12.</div>';
  if(mode==='new')h+=row('Criar '+EQUIP_LABEL[sl].toLowerCase()+' · rank '+RANKS[rankOf()].id,'Vai para a bolsa. Partes criam item Raro ou melhor; relíquias criam Épico ou melhor.','');
  else if(!eq)h+='<div class="sysline">Equipe uma peça nesta posição antes de continuar.</div>';
  else if(mode==='up')h+=row(gearText(eq.name)+' → +'+((eq.up||0)+1),'Partes: desconto de 25% em ouro e cristais. Relíquias: sucesso garantido.<br>Após +10, usar partes pode falhar e consumir os materiais. A peça permanece.','');
  else if(!specialGear354(eq))h+='<p>Passivas são exclusivas dos conjuntos de classes raras.</p>';
  else h+=row('Peça: '+gearText(eq.name),'Passiva atual: '+(GEAR_RUNES[eq.rune]?.n||'nenhuma')+'.<br>Cada peça guarda uma passiva. Gravar outra substitui a atual. O bônus vale enquanto a peça estiver equipada; peças com a mesma passiva somam seus efeitos.','');
  h+='<div class="sec">3. ESCOLHA O MATERIAL</div>';
  if(!keys.length)h+='<div class="sysline">Você ainda não tem espólios.<br>Derrote monstros para conseguir partes e chefes para conseguir relíquias.</div>';
  keys.forEach(k=>{const q=lootForgeQuote(sl,k,mode);if(!q)return;const ok=canLootForge(sl,k,mode,q),missing=[];if(!unl('forge'))missing.push('nível 12');if(run.loot[k].n<q.parts)missing.push((q.parts-run.loot[k].n)+' materiais');if(run.gold<q.gold)missing.push(fmt(q.gold-run.gold)+' ouro');if(cryUp(q.tier)<q.cry)missing.push((q.cry-cryUp(q.tier))+' cristais');if(mode==='new'&&run.items.length>=bagCapacity353())missing.push('espaço na bolsa');if(mode==='rune'&&eq.rune===q.rune)missing.push('esta passiva já está gravada');
    h+=row(gearText(k)+' · '+run.loot[k].n+' disponíveis',(mode==='rune'?'<b>'+GEAR_RUNES[q.rune].n+'</b>: '+GEAR_RUNES[q.rune].d+'<br>':'')+'Custo: '+q.parts+' materiais · '+fmt(q.gold)+' ouro · '+q.cry+' cristais rank '+RANKS[q.tier].id+' ou superior.'+(missing.length?'<br><b>Falta:</b> '+missing.join(', ')+'.':''),btn(mode==='new'?'Criar':mode==='up'?'Melhorar':'Gravar','lootcraft',sl+'|'+mode+'|'+encodeURIComponent(k),ok));});
  h+=btn('Voltar ao Kael','equipshop',sl==='w'?'wep':'arm');openModal('KAEL · FORJA DE ESPÓLIOS',h);
}
function forgeRows(sl,pr){let h='<div class="sec">FORJAR (NÚCLEOS + CRISTAIS)</div><div class="sysline" style="font-size:12px">Cria equipamento do rank escolhido e envia à bolsa. Usa ouro, núcleos e cristais. Pode gerar raridades melhores que as da loja.</div>';for(let t=0;t<=9;t++){const gc=forgePrice265(sl,t),nc=run.res.core[t],cc=run.res.cry[t];
  h+=row('Forjar '+EQUIP_LABEL[sl].toLowerCase()+' <span class="rl" style="color:'+RANKS[t].c+'">'+GR[t].id+'</span>','5 núcleos + 5 cristais '+GR[t].id+' + '+fmt(gc)+' ouro · você tem '+nc+'/'+cc+' · raridade melhor que a loja',btn('Forjar','forge',sl+t,nc>=5&&cc>=5&&run.gold>=gc))}return h}
function extraActions(a,v){if(window.Loot353){const handled=Loot353.action(a,v);if(handled)return handled;}if(a==='comboview261'){comboView261();return 'close0'}if(a==='comboset261'){comboConfigure261(String(v));comboView261();return 'close0'}if(a==='modalback118'){if(MODAL_NAV118.back.length||modalParent118())modalBack118();else closeModal();return 'close0'}if(a==='extractstart117'){startExtractionMission117();return 'close0'}if(a==='extractclaim117'){claimExtractionMission117();guildView('quests');return 'close0'}if(a==='professions114'){view=()=>openModal('PROFISSÕES',profRows());view();return 'close0'}

  if(a==='expact'){const [kind,index,op]=v.split('|');expAction(kind,Number(index),op);return 'close0'}
  if(a==='lootmode'){const [sl,mode]=v.split('|');L.lootMode=mode;lootForgeView(sl);return 'close0'}
  if(a==='lootforge'){lootForgeView(v);return 'close0'}
  if(a==='lootcraft'){const [sl,mode,key]=v.split('|');try{craftWithLoot(sl,decodeURIComponent(key),mode)}catch(e){console.warn('Receita inválida',e)}lootForgeView(sl);return 'close0'}
  if(a==='stat'||a==='stat5'){const n=a==='stat5'?5:1;if(run.pts<n)return;run.pts-=n;run.stats[v]=(run.stats[v]||0)+n;refreshStats();return true}
  if(a==='skup'){if(run.spts<1)return;const l=run.skl[v]||0;if(l>=10)return;run.spts--;run.skl[v]=l+1;return true}
  if(a==='skup2'){if(run.spts<2)return;const l=run.skl[v]||0;if(l>=10)return;run.spts-=2;run.skl[v]=l+1;return true}
  if(a==='consconv'){if(!consFull()||!run.cpts)return;const n=run.cpts;run.cpts=0;for(let i=0;i<n;i++){const ks=Object.keys(STATN).sort((x,y)=>(run.stats[x]||0)-(run.stats[y]||0));if(window.Growth465)Growth465.gift(ks[0],1,'')}toast('<b>[NARRADOR]</b> '+n+' pontos de constelação viraram '+n+' pontos de treino, nos atributos mais baixos.');return true}
  if(a==='mast'){if(run.spts<1||!masteryReady114())return;run.spts--;run.mastery=(run.mastery||0)+1;refreshStats();return true}
  if(a==='powslot'){const [i,k]=String(v).split(':').map(Number);const sk=powLib()[i];if(!sk)return;const old=run.stolen.findIndex(x=>x.n===sk.n);if(old>=0)run.stolen.splice(old,1);/* v165 (Irror): clicar de novo no número ativo tira o poder da tecla. */if(old===k){buildSteal();return true}if(k>=run.stolen.length)run.stolen.push({...sk,cdT:0});else run.stolen[k]={...sk,cdT:0};run.stolen=run.stolen.slice(0,3);buildSteal();return true}
  if(a==='buycry'){const t=+v;if(!Number.isInteger(t)||t<0||t>9)return;const p=crystalPurchasePriceBalance(t);if(t>rankOf()||run.gold<p)return;run.gold-=p;run.res.cry[t]+=10;if(window.Econ154){Econ154.notePurchase(p);Econ154.noteResourcePurchase(t,p);}sfx('coin');return true}
  if(a==='buybook'){const B=bookList()[+v];if(!B||run.gold<B.price)return;const known=powLib().some(x=>x.n===B.sk.n);if(!spendService265(B.price))return;learnPower(B.sk);if(!known){sfx('level');toast('<b>[NARRADOR]</b> Grimório lido: <b>'+B.sk.n+'</b>.',4000)}return true}
  if(a==='shtog'){const r=run.shadows[+v];if(!r)return;if(r.on){r.on=false;const al=allies.find(x=>x.rec===r);if(al){al.dead=true;scene.remove(al.m.root)}}else if(run.shadows.filter(s=>s.on).length<shadowCap()){r.on=true;spawnShadowRec(r,player.x+1,player.z+1)}return true}
  if(a==='shname'){const r=run.shadows[+v];const i=SHNAMES.indexOf(r.nick);r.nick=SHNAMES[(i+1)%SHNAMES.length];const al=allies.find(x=>x.rec===r);if(al)al.name=r.nick+' ['+r.n+']';return true}
  if(a==='shfree'){const r=run.shadows[+v];const al=allies.find(x=>x.rec===r);if(al){al.dead=true;scene.remove(al.m.root)}run.shadows.splice(+v,1);return true}
  if(a==='gjoin'){const [n,l]=v.split('|');const G=GUILDS.find(x=>x.n===n);if(G&&rankOf()<G.req)return;profile.guild={name:n,lvl:+l,don:0,own:false};store.set('pds2_profile',profile);toast('<b>[NARRADOR]</b> Você entrou na guilda '+n+'.');return true}
  if(a==='gmake'){const c=guildCost();if(profile.guild||run.gold<c||run.level<GUILD_LVL)return;if(!spendService265(c))return;profile.guild={name:'Guilda de '+pick(SHNAMES),lvl:1,don:0,own:true};store.set('pds2_profile',profile);toast('<b>[NARRADOR]</b> Guilda fundada: '+profile.guild.name);return true}
  if(a==='gdon'){const g=profile.guild,amt=+v;if(!g||g.lvl>=10||!Number.isSafeInteger(amt)||amt<=0||run.gold<amt)return;run.gold-=amt;g.don+=amt;while(g.lvl<10&&g.don>=guildNeed(g.lvl)){g.don-=guildNeed(g.lvl);g.lvl++;toast('<b>[NARRADOR]</b> Guilda subiu para o nível '+g.lvl+'.')}store.set('pds2_profile',profile);return true}
  if(a==='gleave'){profile.guild=null;store.set('pds2_profile',profile);return true}
  if(a==='forge'){if(!equipmentBagRoom())return 'close0';const sl=v[0],t=+v.slice(1),gc=forgePrice265(sl,t);if(run.res.core[t]<5||run.res.cry[t]<5||run.gold<gc)return;if(!spendService265(gc))return;run.res.core[t]-=5;run.res.cry[t]-=5;const fl=profLv('forge');const rar=wpick([Math.max(4,30-fl*2),40,22+fl,8+fl*.8,fl*.25].map((w,i)=>({i,w}))).i;profXp('forge',10+t*5);sfx('boom');addItem(makeItem(sl,t,rar));narratorEvent105('craft');return true}
  if(a==='elem'){if(!ELEM[v])return;if(run.elem&&!spendService265(servicePrice265('element')))return;run.elem=v;AFFC=null;player.skills=pSkills();refreshStats();bigText(ELEM[v].n.toUpperCase(),1300);toast('<b>[NARRADOR]</b> Você despertou o elemento '+ELEM[v].n+'.');return true}
  if(a==='buypet'){if(!spendService265(petPrice265()))return;const np=newPet();if(!run.pet||typeof run.pet!=='object'||np.rar>=run.pet.rar){run.pet=np;if(PET){scene.remove(PET);PET=null}toast('<b>[NARRADOR]</b> Novo companheiro: <b style="color:'+RAR[np.rar].c+'">'+RAR[np.rar].n+' · '+PETP[np.pow].n+'</b>',4500)}else{run.pet.lvl+=3;toast('<b>[NARRADOR]</b> O ovo era '+RAR[np.rar].n+'. Seu companheiro absorveu a energia: +3 níveis.')}return true}
  if(a==='trainpet'){const c=petTrainCost();if(!run.pet||!spendService265(c))return;run.pet.lvl++;toast('<b>[NARRADOR]</b> Companheiro subiu para o nível '+run.pet.lvl+'.');return true}
  if(a==='buymount'){if(run.mount||!spendService265(mountPrice265()))return;run.mount=true;toast('<b>[NARRADOR]</b> Montaria comprada: Lobo de Mana. Use o botão MONTAR na bolsa ou a tecla V.');return true}
  if(a==='mount'){closeModal();setMount(!run.mounted);return 'close'}
  if(a==='lookh'||a==='lookb'){profile.look=profile.look||{h:0,b:0};const k=a==='lookh'?'h':'b',arr=k==='h'?LOOK_H:LOOK_B;profile.look[k]=(profile.look[k]+1)%arr.length;store.set('pds2_profile',profile);rebuildLook();return true}
  if(a==='copysave'){exportSave384();return 'close0'}
  if(a==='loadsave'){importSave384();return 'close0'}
  if(a==='reaval'){const cur=rankOf(),off=run.official??profile.rank;if(cur<=off)return;run.official=cur;run.gold+=2000*(cur+1);if(window.Growth465)Growth465.gift('esp',1,'');closeModal();
    const R=RANKS[cur];bigText('REAVALIAÇÃO · RANK '+R.id,2400);shake(.6);fxRing(player.x,player.z,0xffd54f,5,1);setTimeout(()=>fxRing(player.x,player.z,0xffb347,8,1),300);sfx('level');
    toast('<b>[NARRADOR]</b> A Ordem registrou você como Viajante <b style="color:'+R.c+'">rank '+R.id+'</b>. +'+fmt(2000*(cur+1))+' ouro e +1 de Espírito (a mana despertada conta como treino).',6000);saveRun();return}
  if(a==='album')return albumView(),'close0';
  if(a==='bestv')return bestView(),'close0';
  if(a==='travel'){const c=(profile.visited||{})[v];if(!travelReady265(c))return;const cost=travelCost(c);if(!spendService265(cost))return;
    closeModal();player.x=c.x+rnd(-3,3);player.z=c.z+14;cam.x=player.x;cam.z=player.z;player.m.root.position.set(player.x,0,player.z);updChunks(true);fxRing(player.x,player.z,0xffb347,4,.8);bigText(c.n,1400);sfx('arise');narratorEvent105('travel');saveRun();return}
  if(a==='bindk'){bindWait=v;return keysView(),'close0'}if(a==='bindreset'){KEYMAP={};refreshKeyLabels();try{localStorage.removeItem('pds_keys')}catch(_){}return keysView(),'close0'}if(a==='keys')return keysView(),'close0';
  if(a==='journeytab')return journeyView(v),'close0';if(a==='trackobj'){if(v&&!journeyObjectives().some(o=>o.id===v))return;run.trackObj=v||null;saveRun();return journeyView(),'close0'}
  if(a==='status')return statusView(),'close0';if(a==='army')return armyView(),'close0';if(a==='diary')return diaryView(),'close0';if(a==='look')return lookView(),'close0';
}
/* tutorial */
let tutorialDelay93=12;
function tutorial(){if(profile.tut)return;profile.tut=true;profile.tips93={};tutorialDelay93=12;store.set('pds2_profile',profile)}
function tutorialTick93(dt){if(!profile.tips93||profile.creationPending91||modalOpen||player.dead)return;tutorialDelay93-=dt;if(tutorialDelay93>0)return;const seen=profile.tips93,near=enemies.some(e=>!e.dead&&Math.hypot(e.x-player.x,e.z-player.z)<14);let id='',title='',body='';
 if(!seen.move){id='move';title='Primeiros passos';body=touch?'Arraste à esquerda para andar. Use os botões à direita para lutar.':'Use WASD ou as setas para andar. Mire com o mouse.'}
 else if(!seen.combat&&near){id='combat';title='Combate';body=(touch?'Segure ATACAR':'Clique ou segure o botão esquerdo do mouse')+' para atacar. '+(touch?'':keyLabel(keyOf('jump'))+' pula. ')+(touch?'ESQUIVA':keyLabel(keyOf('dodge')))+' ajuda a evitar golpes.'}
 else if(!seen.style&&canUseMagicStyle()&&!near){id='style';title='Seu ataque básico';body=keyLabel(keyOf('style'))+' alterna entre físico e mágico. Escolha fogo, gelo e outros estilos aprendidos em Personagem → Ataque básico. As habilidades funcionam em ambos.';profile.styleTut71=true}
 else if(!seen.world&&L.mode==='world'&&!near&&nearestCity(player.x,player.z).d>40*CITYK){id='world';title='Exploração';body='O Mapa mostra os portais. Quanto mais longe das cidades, mais perigosos os monstros.'}
 else if(!seen.training&&!near){id='training';title='Evolução por uso';body='Os 9 atributos crescem com suas ações. Complete a meta de um atributo para ganhar +1 nele. Subir de nível dá 1 ponto de habilidade e o crescimento da classe. Veja o treino de cada atributo no Status.'}
 else if(!seen.supplies&&!near){id='supplies';title='Preparar a expedição';body='[V] abre os suprimentos: confira comida e água tratada. [B] monta o acampamento. O carrinho fica fora da Fenda; leve o necessário na mochila.'}
 if(!id)return;seen[id]=true;tutorialDelay93=25;store.set('pds2_profile',profile);toast('<div class="guide93"><strong>[TUTORIAL] '+title+':</strong> <p>'+body+'</p></div>',6500)}

