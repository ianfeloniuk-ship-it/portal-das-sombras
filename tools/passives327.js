/* v328 (Ian, 08/10/2026): 10 passivas gerais novas do nível 55 ao 100; passivas só aparecem depois de liberadas. */
(function(){
const NEW=[
 {id:'resolute',n:'Golpe Resoluto',d:'O 4º ataque básico seguido dá dano dobrado.'},
 {id:'respite',n:'Respiro',d:'Depois de 3s sem apanhar, o próximo golpe recebido tira metade.'},
 {id:'impetus',n:'Ímpeto',d:'Andando sem parar, a velocidade de ataque sobe 4% por segundo, até +20%.'},
 {id:'elem_link',n:'Elo Elemental',d:'Acertar a fraqueza do monstro tira 0,5s da recarga de todas as habilidades (no máximo 1 vez a cada 0,5s).'},
 {id:'wear',n:'Desgaste',d:'Cada golpe no mesmo alvo tira 1 ponto da defesa dele, até 20 pontos. Some após 5s sem golpear.'},
 {id:'mark_hunter',n:'Caçador de Marcas',d:'Matar um inimigo marcado passa a Marca para os 2 inimigos mais próximos (até 10m).'},
 {id:'combat_read',n:'Leitura de Combate',d:'+1% de dano contra uma espécie a cada 50 abates dela no Bestiário, até +10% (500 abates).'},
 {id:'cold_blood',n:'Sangue-Frio',d:'Abaixo de 30% de vida, habilidades gastam metade de Mana, Fúria ou Vigor.'},
 {id:'counterflow',n:'Contra-Fluxo',d:'Esquiva perfeita deixa o próximo golpe em até 1,5s crítico garantido.'},
 {id:'last_breath',n:'Último Fôlego',d:'Uma vez por portal (ou a cada 3 min fora dele), o golpe que te mataria deixa você com 1 de vida e 2s invulnerável.'}
];
const LV=[55,60,65,70,75,80,85,90,95,100];
const P=ResourceBalance263.passives;
NEW.forEach((p,i)=>{if(!P.some(q=>q.id===p.id)){P.push(p);PASSIVE_LV286.push(LV[i])}});
const has=id=>{try{return hasPassive263(id)}catch(_){return false}};
const T=()=>typeof time!=='undefined'?time:0;

/* Sangue-Frio: metade do custo abaixo de 30% de vida */
const baseCost=passiveCost263;
passiveCost263=function(kind,cost){let c=baseCost(kind,cost);if(c>0&&has('cold_blood')&&typeof player!=='undefined'&&player&&player.hp<player.maxhp*.3)c=Math.max(1,Math.ceil(c*.5));return c};

/* Lista: só passivas liberadas */
passiveRows263=function(){const lv=run.level||1,on=ResourceBalance263.passives.filter((p,i)=>lv>=passiveLevel286(i));let h='<div class="sec">PASSIVAS GERAIS · '+on.length+' LIBERADAS</div><div class="sysline">Passivas funcionam sozinhas: não precisam ser equipadas e não ocupam espaços de habilidade. Novas passivas aparecem aqui quando você chega ao nível delas.<br>Descontos arredondam o custo para cima; técnicas gratuitas continuam gratuitas.</div>';if(!on.length)h+='<div class="sysline">Nenhuma passiva liberada ainda.</div>';on.forEach(p=>{h+=row(p.n,p.d,'<b>Ativa</b>')});return h};

/* Desgaste: pontos de defesa a tirar do alvo */
window.passiveShred327=function(e,o){if(!o||!o.fromPlayer||!e||!has('wear'))return 0;if(T()-(e.wearAt327??-99)>5)e.wear327=0;const n=e.wear327||0;e.wear327=Math.min(20,n+1);e.wearAt327=T();const lvl=(run&&run.level)||1;const per=typeof atkPer==='function'?atkPer(lvl)*.5:1;return n*per};

/* Golpe Resoluto + Leitura de Combate (antes da fraqueza) */
window.passiveHit327=function(e,amt,o){if(!o||!o.fromPlayer||o.pet)return amt;
 if(Number.isInteger(o.basicClass)&&has('resolute')){const t=T();if(t-(player.res327At??-99)>2.5)player.res327=0;player.res327At=t;player.res327=(player.res327||0)+1;if(player.res327>=4){player.res327=0;amt*=2;try{floater(e.x,e.z,'RESOLUTO!','#ffd54f',true)}catch(_){}}}
 if(has('combat_read')&&e.kind&&profile&&profile.bestiary){const k=profile.bestiary[e.kind]||0;amt*=1+Math.min(.1,Math.floor(k/50)*.01)}
 return amt};

/* Elo Elemental: chamado com o dano antes/depois da fraqueza */
window.passiveElem327=function(before,after,o){if(!o||!o.fromPlayer||!has('elem_link')||!(after>before*1.2))return;const t=T();if(t<(player.elem327At||0))return;player.elem327At=t+.5;for(const s of (player.skills||[]))if(s&&s.cdT>0)s.cdT=Math.max(0,s.cdT-.5)};

/* Contra-Fluxo */
window.passiveDodge327=function(){if(has('counterflow'))player.cf327Until=T()+1.5};
window.passiveCrit327=function(o){if(o&&o.fromPlayer&&player.cf327Until>T()){player.cf327Until=0;return true}return false};

/* Respiro */
window.passiveIncoming327=function(amt){const t=T(),last=player.hurt327At??-99;player.hurt327At=t;if(has('respite')&&t-last>=3){try{floater(player.x,player.z,'RESPIRO','#8bdcff')}catch(_){}return amt*.5}return amt};

/* Último Fôlego */
window.passiveLast327=function(){if(!has('last_breath'))return false;const t=T(),lv=typeof L!=='undefined'?L:null;if(lv){if(lv.lb327)return false;lv.lb327=true}else{if(t<(run.lb327At||0))return false;run.lb327At=t+180}player.hp=1;player.iT=Math.max(player.iT||0,2);try{bigText('ÚLTIMO FÔLEGO',1200);floater(player.x,player.z,'ÚLTIMO FÔLEGO','#ffd54f',true,3)}catch(_){}return true};

/* Caçador de Marcas */
window.passiveKill327=function(e){if(!has('mark_hunter')||!e)return;const marks=e.marks181||0,echo=e.echoMarkUntil>T();if(!marks&&!echo)return;const near=(typeof enemies!=='undefined'?enemies:[]).filter(x=>x!==e&&!x.dead&&!x.ally&&Math.hypot(x.x-e.x,x.z-e.z)<=10).sort((a,b)=>Math.hypot(a.x-e.x,a.z-e.z)-Math.hypot(b.x-e.x,b.z-e.z)).slice(0,2);for(const x of near){if(marks&&typeof cm181Mark==='function')cm181Mark(x,Math.max(1,marks));if(echo)x.echoMarkUntil=Math.max(x.echoMarkUntil||0,e.echoMarkUntil);try{floater(x.x,x.z,'MARCADO','#bd8bff')}catch(_){}}};

/* Ímpeto */
window.passiveTick327=function(dt){if(typeof player==='undefined'||!player)return;const px=player.px327??player.x,pz=player.pz327??player.z,mv=Math.hypot(player.x-px,player.z-pz)>dt*.5;player.px327=player.x;player.pz327=player.z;player.imp327=mv?Math.min(5,(player.imp327||0)+dt):0};
window.passiveSpd327=function(){return has('impetus')?1/(1+.04*Math.min(5,player.imp327||0)):1};
})();
