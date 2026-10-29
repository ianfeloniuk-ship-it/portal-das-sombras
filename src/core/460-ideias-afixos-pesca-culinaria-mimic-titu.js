/* ================= IDEIAS: AFIXOS, PESCA, CULINÁRIA, MIMIC, TÍTULOS, MALDIÇÕES, TORRE, NÊMESIS, AFINIDADE, CIDADE, CLIMA, INVERTIDO, DOMÍNIOS, FUSÃO, SAZONAL, ORÁCULO ================= */
const AFFIX=[{id:'expl',n:'Explosivos',d:'monstros explodem ao morrer'},{id:'nocure',n:'Sem cura',d:'poções e curas não funcionam'},{id:'dark',n:'Escuridão',d:'visão muito curta'},{id:'frenzy',n:'Frenesi',d:'monstros 30% mais rápidos'},{id:'armor',n:'Blindados',d:'monstros com +50% de vida'},{id:'vamp',n:'Vampíricos',d:'monstros recuperam 20% do dano que causam'},{id:'elite',n:'Elite',d:'1 em cada 4 monstros é elite'},{id:'rage',n:'Chefe Furioso',d:'chefe com 1 barra a mais e +30% de dano; baú dele dá 1 item extra'}];
const affN=g=>(g.aff||[]).map(i=>AFFIX.find(a=>a.id===i).n);
function rollAff(rank){if(Math.random()>.35+rank*.04)return[];const a=[...AFFIX].sort(()=>Math.random()-.5);return a.slice(0,rank>=6&&Math.random()<.3?3:Math.random()<.3?2:1).map(x=>x.id)} /* v183: até 3 regras em portais altos; cada regra dá +50% de ouro e +25% de XP */
const hasAff=id=>L.mode==='dungeon'&&L.gate&&(L.gate.aff||[]).includes(id);
/* títulos */
/* TÍTULOS (feedback do Irror): sem limite de equipados; cada um dá uma MECÂNICA própria, não só número. */
const TITLES=[
 {id:'hunter',n:'Caçador de Monstros',d:'200 monstros numa vida',c:()=>run.kills>=200,m:'Cada abate recarrega 5% do escudo',b:{}},
 {id:'kings',n:'Matador de Reis',d:'10 guardiões',c:()=>(profile.bossKills||0)>=10,m:'Quebrar uma barra de vida de chefe cura 10% da sua vida',b:{}},
 {id:'lvl50',n:'Veterano',d:'nível 50',c:()=>run.level>=50,m:'Poções curam mais 15% da vida máxima',b:{}},
 {id:'rich',n:'Magnata',d:'1 milhão de ouro somando o banco',c:()=>run.gold+(profile.bank||0)>=1e6,m:'+10% de ouro dos monstros',b:{gold:.1}},
 {id:'phoenix',n:'Fênix',d:'morrer 5 vezes',c:()=>(profile.deaths||0)>=5,m:'Ao cair abaixo de 20% de vida, o escudo enche na hora (1 vez por minuto)',b:{}},
 {id:'tower',n:'Escalador',d:'andar 20 da torre',c:()=>(profile.towerBest||0)>=20,m:'Na torre, cada andar limpo cura 25% da vida',b:{}},
 {id:'army',n:'General dos Servos',d:'10 servos',c:()=>run.shadows.length>=10,m:'Servos causam +20% de dano',b:{}},
 {id:'fisher',n:'Pescador',d:'30 peixes',c:()=>(profile.fish||0)>=30,m:'Comida dura o dobro do tempo',b:{}},
 {id:'avenger',n:'Vingador',d:'derrotar seu nêmesis',c:()=>(profile.nemKills||0)>=1,m:'+20% de dano contra elites',b:{}},
 {id:'lord',n:'Senhor de Domínios',d:'3 masmorras dominadas',c:()=>(profile.owned||[]).length>=3,m:'Baús comuns têm +15% de chance de trazer item',b:{}},
 {id:'brk30',n:'Resistente',d:'sobreviver 30 s num Transbordo da Fenda',c:()=>(profile.brkBest||0)>=30,m:'Escudo recarrega 30% mais rápido',b:{}},
 {id:'brk60',n:'Inabalável',d:'sobreviver 1 min num Transbordo da Fenda',c:()=>(profile.brkBest||0)>=60,m:'Esquiva recarrega 15% mais rápido',b:{}},
 {id:'brk600',n:'Imortal',d:'sobreviver 10 min num Transbordo da Fenda',c:()=>(profile.brkBest||0)>=600,m:'Regenera 1% da vida por segundo',b:{}},
 {id:'founder',n:'Fundador',d:'levar uma cidade ao nível 10',c:()=>Object.values(profile.cityLv||{}).some(v=>v>=10),m:'Lojas 10% mais baratas em todas as cidades',b:{}},
 {id:'miner',n:'Amigo dos Mineiros',d:'história O Mineiro Desaparecido',c:()=>false,m:'Veios de mana rendem +1 minério por golpe',b:{}},
 {id:'lakeg',n:'Guardião do Lago',d:'história A Canção do Lago',c:()=>false,m:'Poções também enchem 30% do escudo',b:{}},
 {id:'towerc',n:'Eleito da Torre',d:'história O Chamado da Torre',c:()=>false,m:'+20% de dano dentro da torre',b:{}},
 {id:'protector',n:'Protetor da Cidade',d:'história A Cidade que Cresce',c:()=>false,m:'Renda das cidades +50%',b:{}},
 {id:'godslayer',n:'Matador de Deuses',d:'vença um chefe de ameaça Logos',c:()=>(profile.godKills192||0)>0,m:'+6% de dano',b:{dmg:.06}},
 {id:'doorcloser',n:'Quem Fechou a Porta',d:'derrote o Arquiteto',c:()=>(profile.archKills223||0)>0,m:'+10% de dano e de vida',b:{dmg:.1,hp:.1}},
 {id:'sov',n:'Arconte',d:'???',secret:true,c:()=>profile.rank===9,m:'+10% de dano e de vida',b:{dmg:.1,hp:.1}}];
const TITLE_TRACKS=[
 {id:'endlessHunt',n:'Flagelo das Fendas',base:100,unit:'monstros derrotados',key:'hunt',effect:'dano contra inimigos comuns e elites',value:()=>Math.max(profile.titleKills||0,run.kills||0)},
 {id:'endlessPortal',n:'Selador de Fendas',base:5,unit:'portais fechados',key:'boss',effect:'dano contra guardiões',value:()=>Object.values(profile.closedPortalsByRank||{}).reduce((a,b)=>a+Math.max(0,Number(b)||0),0)},
 {id:'endlessTower',n:'Além do Horizonte',base:10,unit:'andares no recorde da torre',key:'tower',effect:'dano dentro da torre',value:()=>profile.towerBest||0},
 {id:'endlessVillage',n:'Bastião das Vilas',base:1,unit:'cercos vencidos',key:'hp',effect:'bônus de vida máxima, somado às outras fontes de vida',value:()=>profile.sieges||0}
];
for(const t of TITLE_TRACKS)TITLES.push({...t,track:true,c:()=>false,b:{},d:'Progressão permanente',m:''});
function titleGoal(t,n){return t.base*n*(n+1)/2}
function titleProgress(t){const v=Math.max(0,Number(t.value())||0),saved=profile.titleProgress?.[t.id]||0;return Math.max(v,saved)}
function titleLevel(t){return Math.max(0,Math.floor((Math.sqrt(1+8*titleProgress(t)/t.base)-1)/2))}
function titleGain(n){return .1*n/(n+10)}
function titlePercent(n){return (titleGain(n)*100).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})+'%'}
function titleName(t){return t.n+(t.track?' · NV '+titleLevel(t):'')}
function titleEffect(t){return t.track?'+'+titlePercent(titleLevel(t))+' de '+t.effect+'.':t.m}
function titleCard118(name,description,actions,progress=''){return '<section class="title-card118"><div class="title-heading118"><strong>'+name+'</strong>'+(actions?'<div class="acts">'+actions+'</div>':'')+'</div><div class="title-effect118">'+description+'</div>'+progress+'</section>'}
function titleTrackRows(){let h='';for(const t of TITLES.filter(t=>t.track)){const n=titleLevel(t),v=titleProgress(t),next=titleGoal(t,n+1),prev=titleGoal(t,n),pct=Math.min(100,Math.max(0,100*v/next)),ok=(profile.ach||[]).includes(t.id);if(!v&&!ok)continue;h+=titleCard118(titleName(t),titleEffect(t),ok?btn(eqTitles().includes(t.id)?'Tirar':'Equipar','title',t.id,true,eqTitles().includes(t.id)?'on':''):'','<div class="title-progress114"><span>'+v.toLocaleString('pt-BR')+' / '+next.toLocaleString('pt-BR')+' '+t.unit+'</span><progress aria-label="Progresso de '+t.n+'" value="'+pct+'" max="100"></progress></div>')}return h}

function syncTitleProgress(){profile.titleProgress=profile.titleProgress||{};let changed=false;for(const t of TITLE_TRACKS){const old=profile.titleProgress[t.id]||0,v=titleProgress(t);if(v>old){profile.titleProgress[t.id]=v;changed=true}const n=titleLevel(t),was=profile.titleLevels?.[t.id]||0;profile.titleLevels=profile.titleLevels||{};if(n>was){profile.titleLevels[t.id]=n;if(!profile.ach.includes(t.id))profile.ach.push(t.id);toast('<b>[CONQUISTA]</b> '+t.n+' chegou ao nível '+n+'. Veja o próximo marco em PERSONAGEM → Títulos.',5000);changed=true;if(eqTitles().includes(t.id)&&player&&!player.dead)refreshStats()}}return changed}
function titleHitBonus(e){const b=titleB();return (e.isBoss?b.boss||0:b.hunt||0)+(L.special?.kind==='tower'?b.tower||0:0)}
function eqTitles(){if(!profile.titles)profile.titles=profile.title?[profile.title]:[];return [...new Set(profile.titles)].filter(id=>(profile.ach||[]).includes(id)&&TITLES.some(t=>t.id===id))}
function hasT(id){return !!profile&&eqTitles().includes(id)}
function titleB(){const o={};for(const id of eqTitles()){const t=TITLES.find(x=>x.id===id);if(t){for(const k in t.b)o[k]=(o[k]||0)+t.b[k];if(t.track)o[t.key]=(o[t.key]||0)+titleGain(titleLevel(t))}}return o}
function checkTitles(){profile.ach=profile.ach||[];if(syncTitleProgress())store.set('pds2_profile',profile);for(const t of TITLES)if(!profile.ach.includes(t.id)&&t.c()){profile.ach.push(t.id);narratorEvent105('title');store.set('pds2_profile',profile);toast('<b>[CONQUISTA]</b> Título desbloqueado: <b>'+t.n+'</b>. Ative em PERSONAGEM → Títulos.',5000);sfx('level')}}
/* maldições */
const CURSES=[{n:'Sede de Sangue',d:'−20% vida máxima',hp:-.2},{n:'Mente Rachada',d:'−30% mana',mp:-.3},{n:'Fardo',d:'−10% velocidade',spd:-.1}];
function curseB(){const o={hp:0,mp:0,spd:0};for(const s of EQUIP_SLOTS){const it=run.equip[s];if(specialGear354(it)&&it.curse){for(const k in o)o[k]+=it.curse[k]||0}}return o}
/* comida */
/* PESCA 2.0: espécies dependem de hora, clima e bioma; cada peixe tem peso (recorde por espécie); vara melhora a faixa. */
const FISH=[{n:'Peixe-lua',w:55,c:'#c9d3de',kg:[.3,1.2],v:20,d:0},{n:'Carpa de Mana',w:28,c:'#ffb347',kg:[.8,3],v:45,d:1},{n:'Enguia Relâmpago',w:13,c:'#b18cff',kg:[1,4],v:90,d:2,wx:'rain'},{n:'Peixe Dourado',w:4,c:'#ffb84d',kg:[.5,2],v:300,d:3},
 {n:'Peixe Sombrio',w:10,c:'#7a55ff',kg:[1,5],v:150,d:2,night:true},{n:'Truta Glacial',w:12,c:'#ffd08a',kg:[1,6],v:120,d:2,bio:'neve'},{n:'Bagre do Pântano',w:14,c:'#8a9a70',kg:[2,12],v:80,d:1,bio:'pantano'},
 {n:'Escorpião-d’água',w:10,c:'#d9b36a',kg:[.5,3],v:110,d:2,bio:'deserto'},{n:'Salmão de Tempestade',w:8,c:'#fff36b',kg:[3,9],v:220,d:3,wx:'rain'},{n:'Filhote de Leviatã',w:.6,c:'#ff3d1e',kg:[40,160],v:5000,d:4}];
function fishPool(){const P=player,b={cristal:'neve',vulcao:'deserto',floresta:'pantano',flores:'campos'}[biomeAt(P.x,P.z)]||biomeAt(P.x,P.z),n=isNight(),w=WX.type;return FISH.filter(f=>(!f.night||n)&&(!f.bio||f.bio===b)&&(!f.wx||f.wx===w))}
const ROD=[{n:'Vara de Bambu',z:18,t:3,p:0},{n:'Vara Reforçada',z:22,t:4,p:4000},{n:'Vara de Mana',z:26,t:4,p:25000},{n:'Vara do Caçador',z:30,t:5,p:120000}];
const RECIPES_X=[{n:'Elixir de Fúria',need:null,d:'+25% de dano por 3 min',b:{dmg:.25},t:180},{n:'Elixir de Ferro',need:null,d:'+30% de vida por 3 min',b:{hp:.3},t:180}];
const RECIPES=[{n:'Ensopado de Peixe',need:{'Peixe-lua':2},d:'+25% vida por 5 min',b:{hp:.25},t:300},{n:'Sushi de Mana',need:{'Carpa de Mana':1,'Peixe-lua':1},d:'+30% mana por 5 min',b:{mp:.3},t:300},{n:'Espeto Relâmpago',need:{'Enguia Relâmpago':1},d:'+20% dano por 5 min',b:{dmg:.2},t:300},{n:'Banquete Dourado',need:{'Peixe Dourado':1},d:'+20% vida, dano e mana por 10 min',b:{hp:.2,dmg:.2,mp:.2},t:600}];
const recipe=n=>RECIPES.find(r=>r.n===n)||RECIPES_X.find(r=>r.n===n);
function foodB(){return run.food&&run.food.t>0?recipe(run.food.n).b:{}}
function fishView(){if(!unl('fish')){toast(lockMsg('fish'));return}view=null;const rod=ROD[run.rod||0],f=wpick(fishPool()),zw=Math.max(8,rod.z-f.d*2.5+Math.min(10,Math.floor(profLv('fish')/2))+(window.Attr462?Attr462.surv().fishZone:0)),spd=2+f.d*.5;let pos=0,dir=1,zone=rnd(10,88-zw),zd=f.d>=2?1:0,tries=rod.t+(hasF('aqua')?1:0),iv=null;
  const h='<div class="sysline">'+(f.d>=3?'<b style="color:'+f.c+'">Algo GRANDE mordeu a isca!</b> ':'Algo mordeu. ')+'Toque PUXAR quando o marcador estiver na faixa verde'+(zd?' (este peixe se mexe)':'')+'. <span id="ftries">'+tries+'</span> tentativas · '+rod.n+'</div><div style="position:relative;height:26px;background:#0a1830;border:1px solid #ffb347;border-radius:4px;margin:10px 0"><div id="fzone" style="position:absolute;top:0;bottom:0;left:'+zone+'%;width:'+zw+'%;background:rgba(111,227,154,.45)"></div><div id="fmark" style="position:absolute;top:-4px;width:6px;height:34px;background:#ffd54f;left:0"></div></div><div style="display:flex;justify-content:flex-end">'+btn('PUXAR','fishpull',0,true,'hot')+'</div>';
  openModal('PESCA',h);iv=setInterval(()=>{if($('modal').hidden){clearInterval(iv);return}pos+=dir*spd;if(pos>=97||pos<=0)dir*=-1;const m=$('fmark');if(m)m.style.left=pos+'%';if(zd){zone+=zd*.35*f.d;if(zone<=2||zone>=96-zw)zd*=-1;const z=$('fzone');if(z)z.style.left=zone+'%'}},16);
  window._fish={get pos(){return pos},get zone(){return zone},zw,f,iv,get tries(){return tries},dec(){tries--;$('ftries').textContent=tries}}}
function fishPull(){const F=window._fish;if(!F)return;if(F.pos>=F.zone&&F.pos<=F.zone+F.zw){clearInterval(F.iv);if(window.Attr462)Attr462.train('des');const f=F.f,kg0=f.kg[0]+Math.pow(Math.random(),2)*(f.kg[1]-f.kg[0]),kg=kg0>=10?Math.round(kg0):+kg0.toFixed(1);run.fish=run.fish||{};run.fish[f.n]=(run.fish[f.n]||0)+1;profile.fish=(profile.fish||0)+1;
  profile.aqua=profile.aqua||{};const rec=profile.aqua[f.n],isNew=!rec,isRec=rec&&kg>rec;if(!rec||kg>rec)profile.aqua[f.n]=kg;if(isNew&&window.Growth465)Growth465.gift('des',1,'Espécie nova no Aquário: a pescaria conta como treino.');
  profXp('fish',10+f.d*10);storyEv('fish');storyEv('species');npcEv('fish');store.set('pds2_profile',profile);closeModal();sfx('coin');toast('<b>[PESCA]</b> <b style="color:'+f.c+'">'+f.n+'</b> · '+wTxt(kg)+(isNew?' · <b>ESPÉCIE NOVA no Aquário: +1 ponto de status</b>':isRec?' · <b>NOVO RECORDE!</b>':''),5000);if(f.d>=4){bigText('LEVIATÃ!',1500);sfx('gong')}saveRun()}
  else{F.dec();sfx('block');if(F.tries<=0){clearInterval(F.iv);closeModal();toast('O peixe escapou.')}}}
function fishValue(){let t=0;const f=run.fish||{};for(const F of FISH)t+=(f[F.n]||0)*F.v;return window.Econ154?Econ154.salePrice('fish',t):t}
function aquaRows(){const A=profile.aqua||{};let h='<div class="sec">AQUÁRIO ('+Object.keys(A).length+'/'+FISH.length+')</div><div class="sysline" style="font-size:12px">Nova espécie: +1 ponto de atributo. Os peixes variam com horário, clima e região.</div>';
  for(const F of FISH)h+=row(A[F.n]?'<b style="color:'+F.c+'">'+F.n+'</b>':'<span style="opacity:.5">???</span>',A[F.n]?'Recorde: '+wTxt(A[F.n]):(F.night?'Só à noite':F.wx?'Só na chuva':F.bio?'Só em '+BIO_N[F.bio]:F.d>=4?'Lendário':'Comum no lago'),'');
  const r=run.rod||0;h+='<div class="sec">VARA DE PESCA</div>'+row(ROD[r].n,'Faixa '+ROD[r].z+'% · '+ROD[r].t+' tentativas',r<ROD.length-1?btn(ROD[r+1].n+' · '+fmt(rodPrice265(r+1)),'rodup',0,run.gold>=rodPrice265(r+1)):'<b>Máxima</b>');
  const v=fishValue();h+=row('Vender todos os peixes','Dorian paga '+fmt(v)+' ouro (guarde os que você quer cozinhar)',btn('Vender','fishsell',0,v>0));return h}
function cookRows(){let h=aquaRows()+'<div class="sec">COZINHA</div>';const f=run.fish||{};h+='<div class="sysline" style="font-size:12px">Seus peixes: '+(Object.keys(f).filter(k=>f[k]).map(k=>f[k]+' '+k).join(', ')||'nenhum. Pesque no lago da praça.')+'</div>';
  RECIPES.forEach((r,i)=>{const ok=Object.entries(r.need).every(([k,n])=>(f[k]||0)>=n);h+=row(r.n,r.d+' · precisa '+Object.entries(r.need).map(([k,n])=>n+' '+k).join(' + '),btn('Cozinhar','cook',i,ok))});return h}
/* afinidade */
const AFF_PERK={Mira:'Poções 4% mais baratas por nível',Kael:'Armas e armaduras 3% mais baratas por nível',Brann:'Mantém seu desconto de armaduras com Kael (vale a maior afinidade)',Dorian:'Recursos vendidos por 3% a mais por nível',Selene:'Juros diários: 1 ouro a cada 500 guardados, por nível (até 20 ouro por nível)',Lyra:'Missões pagam 5% a mais por nível'};
const affL=n=>{if(profile.aff&&!profile.aff10){profile.aff10=1;for(const k in profile.aff)profile.aff[k]=Math.min(10,profile.aff[k]*2)}return (profile.aff||{})[n]||0};
function affRow(n){const l=affL(n),c=servicePrice265('gift',{affinityLevel:l});return '<div class="sec">AFINIDADE COM '+n.toUpperCase()+'</div>'+row('<span style="color:#ff8fa3">'+'♥'.repeat(l)+'♡'.repeat(10-l)+' '+l+'/10</span>',AFF_PERK[n],l<10?btn('Presentear '+fmt(c),'gift',n,run.gold>=c):'<b>Máxima</b>')+npcRows(n)}
function innLv(){return player?((profile.innLv||{})[nearestCity(player.x,player.z).c.id]||0):0}
/* v287 (Ian): pousada passa a importar — dormir cura só parte (melhor pousada, mais cura), dá XP extra por 10 min e tira o cansaço; ficar 2 dias de jogo sem dormir cansa. */
function innHeal287(l){return Math.min(1,.5+.1*(l||0))}
function tired287(){return run&&(run.awake287||0)>=2*DAYLEN}
function restXp287(){if(!run)return 0;if(run.rested&&run.rested.t>0)return .1+.02*(run.rested.l||0);return tired287()?-.1:0}
function innB(){return run&&run.rested&&run.rested.t>0?run.rested.l:0}
function cityLv(){return (profile.cityLv||{})[nearestCity(player.x,player.z).c.id]||0}
function priceMul(kind){const a=kind==='pot'?affL('Mira')*.04:kind==='wep'?affL('Kael')*.03:kind==='arm'?Math.max(affL('Kael'),affL('Brann'))*.03:0;return choiceMul()*Math.max(.4,1-a-Math.min(5,cityLv())*.04-(hasT('founder')?.1:0)-((festival()||{}).shop||0))}
const CITY_U=[['1','Bandeiras nas torres · lojas 4% mais baratas por nível'],['2','Carroça e depósito · elixires na loja de Poções'],['3','Muralhas brilhantes e colunas na praça'],['4','Estandartes na muralha, feira na praça · guardas defendem nas invasões'],['5','Postes de luz nas ruas · torres da muralha atiram nos monstros'],['6','BAIRRO NOVO fora da muralha · renda diária da cidade'],['7','Moinhos e serraria nos campos · renda maior'],['8','Segundo bairro e catedral · renda maior'],['9','Monumentos dos heróis e obelisco aceso · renda maior'],['10','Capital: praça dourada · renda máxima e título Fundador']];
const cityNeed=l=>({cry:20*(l+1),gold:l>=5?localPrice265(400*(l-3)*(l-3)):0});
const cityIncome=l=>l>=6?Math.round(40*(Math.min(10,l)-5)*(hasT('protector')?1.5:1)):0;
function bankInterest266(){const a=Math.min(10,Math.max(0,affL('Selene')));return Math.min(Math.max(0,Math.floor((profile.bank||0)/500)*a),20*a)}/* v485: 1 ouro a cada 500 por nível (antes 0,15%) */
function cityIncomeAvailable266(l){const s=profile.cityIncome266,paid=s?.day===todayKey()?Math.max(0,Number(s.paid)||0):0;return Math.max(0,Math.min(cityIncome(l),800-paid))}/* Renda local fixa; não cresce com o rank do visitante. */
/* Preparação permanente, separada para cada cidade. */
function defenseLevel(c,k){return Math.max(0,Math.min(3,Math.floor(Number(((profile.defenses||{})[c.id]||{})[k])||0)))}
function defenseCost(c,k){const n=defenseLevel(c,k)+1;return {gold:servicePrice265('defense',{defenseLevel:n-1}),core:8*n}}
function defenseGuards(c){return (cityL(c)>=4?3:0)+defenseLevel(c,'guards')}
function defenseRange(c){return (60+8*defenseLevel(c,'watch'))*CITYK}
function upgradeDefense(k){if(!['guards','watch'].includes(k)||L.mode!=='world'||!inCity(player.x,player.z))return false;const c=nearestCity(player.x,player.z).c,lv=defenseLevel(c,k),cost=defenseCost(c,k);if(cityFallen(c)||cityL(c)<2||lv>=3||L.siege||run.gold<cost.gold||run.res.core.reduce((a,b)=>a+b,0)<cost.core)return false;if(!spendService265(cost.gold))return false;let need=cost.core;for(let i=0;i<run.res.core.length&&need;i++){const n=Math.min(need,run.res.core[i]);run.res.core[i]-=n;need-=n}profile.defenses=profile.defenses||{};profile.defenses[c.id]={...(profile.defenses[c.id]||{}),[k]:lv+1};store.set('pds2_profile',profile);saveRun();toast('<b>[VILA]</b> '+c.name+': '+(k==='guards'?'Guarnição':'Vigia')+' melhorada para '+(lv+1)+'.');return true}
function spawnCityDefenders(c,x,z){const n=defenseGuards(c);for(let i=0;i<n;i++)makeHunterAlly({name:'Guarda de '+c.name,cls:[0,2,4][i%3],rank:clamp(rankOf(),0,TOPR),lvl:run.level+5,hair:0x333333},x+(i%3-1)*2,z+Math.floor(i/3)*2,true);return n}
function defenseView(){view=defenseView;const c=nearestCity(player.x,player.z).c;let h='<div class="sysline"><b>Brann · Defesa de '+c.name+'</b><br>Melhore a defesa desta cidade. As melhorias são permanentes.</div>';
  h+=row('Guarnição atual',defenseGuards(c)+' guardas respondem a transbordos e ao Dragão Sitiante.','');
  for(const [k,n,d] of [['guards','Treinar guarnição','Cada nível acrescenta 1 guarda às respostas de defesa.'],['watch','Postos de vigia','Cada nível amplia em 8m o alcance das torres; torres funcionam a partir do nível 5 da vila.']]){const lv=defenseLevel(c,k),cost=defenseCost(c,k);h+=row(n+' · '+lv+'/3',d+(lv<3?'<br>Custo: '+fmt(cost.gold)+' ouro e '+cost.core+' núcleos (consome os menores ranks primeiro).':''),lv>=3?'<b>Concluído</b>':btn(cityL(c)<2?'Vila nível 2':L.siege?'Cerco em andamento':'Melhorar','defup',k,cityL(c)>=2&&!L.siege&&!cityFallen(c)&&run.gold>=cost.gold&&run.res.core.reduce((a,b)=>a+b,0)>=cost.core))}
  if(window.Dome154)h+=Dome154.row(c);
  h+='<div class="sec">PREPARAÇÃO</div>'+row('Torres',cityL(c)>=5?'Ativas · alcance '+defenseRange(c)+'m':'Liberadas no nível 5 da vila','')+row('Próximo passo',cityL(c)<2?'Evolua a vila até o nível 2 para organizar a defesa.':'Reúna núcleos nas Fendas e invista antes de uma invasão.',btn('Evolução da vila','gtab','city'))+affRow('Brann');openModal('DEFESA DA VILA',h)}

function cityTab(){const c=nearestCity(player.x,player.z).c,l=cityLv(),nd=cityNeed(l),tot=run.res.cry.reduce((a,b)=>a+b,0),inc=cityIncomeAvailable266(l),got=((profile.cityDay||{})[c.id])===todayKey();
  let h=regionSummary116(c);
  if(window.WorldSim479){
    h+=row('Conselho Regional e Governantes','Editais públicos, caçadores autônomos e crescimento da região','<button class="btn hot" onclick="WorldSim479.openCouncilView(\'aster\')">Abrir Conselho</button>');
  }
  if(window.Quests480){
    h+=row('Mural de Contratos','Missões secundárias, caça a monstros e fugitivos de '+c.name,'<button class="btn hot" onclick="Quests480.openBoard(\''+c.id+'\')">Ver Contratos</button>');
  }
  h+='<div class="sysline">Cidade de <b>'+c.name+'</b> · nível <b>'+l+'/10</b>. Cada nível muda a cidade de verdade: do 6 em diante ela cresce para fora da muralha.</div>'+CITY_U.map(([n,d])=>row('Nível '+n,d,l>=+n?'<b style="color:#6fe39a">Liberado</b>':'')).join('')
   +(l>=6?row('Renda da cidade',fmt(inc)+' ouro disponível hoje · limite total de 800 por dia',btn(got?'Coletado hoje':inc?'Coletar':'Limite diário atingido','cityinc',0,!got&&inc>0,'hot')):'')
   +(l<10?row('Doar para o nível '+(l+1),nd.cry+' minérios de qualquer rank'+(nd.gold?' + '+fmt(nd.gold)+' ouro':'')+' · você tem '+tot+' minérios',btn('Doar','citydon',0,tot>=nd.cry&&run.gold>=nd.gold,'hot')):row('Capital no nível máximo','',''));
  return h;
}

