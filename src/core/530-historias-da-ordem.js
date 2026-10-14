/* ===== HISTÓRIAS DA ORDEM ===== */
const STORIES=[
 {id:'miner',npc:'Dorian',n:'O Mineiro Desaparecido',steps:[['mine',30,'Dorian: Meu irmão sumiu perto dos veios. Minere 30 cristais e procure pistas.'],['clear',2,'Os cristais têm marcas de garra. Feche 2 portais: algo está saindo deles.'],['elite',5,'As garras são de elites. Mate 5 elites.'],['boss',1,'Um guardião prendeu o irmão do Dorian. Derrote um guardião.']],rw:{g:30000,p:3,t:'miner'}},
 {id:'lake',npc:'Mira',n:'A Canção do Lago',steps:[['fish',10,'Mira: O lago está cantando à noite. Pesque 10 peixes e escute.'],['species',4,'Cada espécie canta uma nota. Tenha 4 espécies no Aquário.'],['kill',100,'A canção atrai monstros. Mate 100 deles.'],['brk',60,'A última nota vem de uma masmorra quebrando. Sobreviva 1 minuto num Transbordo da Fenda.']],rw:{g:40000,p:3,t:'lakeg'}},
 {id:'tower',npc:'Lyra',n:'O Chamado da Torre',steps:[['tower',20,'Lyra: A torre chamou o seu nome. Chegue ao andar 20.'],['boss',3,'Os guardiões guardam a chave. Derrote 3.'],['clear',5,'Feche 5 portais para acalmar a mana.'],['tower',50,'Suba até o andar 50.']],rw:{g:80000,p:5,t:'towerc'}},
 {id:'city',npc:'Selene',n:'A Cidade que Cresce',steps:[['citylv',3,'Selene: Esta cidade pode ser grande. Leve uma cidade ao nível 3.'],['house',1,'Todo morador precisa de um lar. Compre uma casa.'],['siege',1,'Um dragão sempre vem atrás de cidades grandes. Defenda uma cidade de um ataque (cidade nível 5+).']],rw:{g:120000,p:5,t:'protector'}}];
function storyBudget262(S,st){const level=({miner:20,lake:35,tower:80,city:55})[S.id]||1;if(st&&!st.xpBudget262)st.xpBudget262=RpgBalance.questReward({type:'story_'+S.id,level});return questXpNow332(st?.xpBudget262||RpgBalance.questReward({type:'story_'+S.id,level}))}
function storyXpText262(S,st){const b=storyBudget262(S,st);return xpNumber(xpAwardAmount262(b.xp,'quest'))+' XP · duração estimada '+b.minutes+' min'}
const STORY_ABS={species:()=>Object.keys(profile.aqua||{}).length,tower:()=>profile.towerBest||0,brk:()=>profile.brkBest||0,citylv:()=>Math.max(0,...Object.values(profile.cityLv||{})),house:()=>profile.house?1:0,siege:()=>profile.sieges||0};
function storyEv(t,v=1){const P=profile.story;if(!P)return;let ch=false;
  for(const S of STORIES){const st=P[S.id];if(!st||st.done)continue;let sp=S.steps[st.s];if(sp[0]!==t&&!STORY_ABS[sp[0]])continue;
    if(STORY_ABS[sp[0]])st.got=STORY_ABS[sp[0]]();else st.got+=v;
    while(sp&&st.got>=sp[1]){st.s++;st.got=0;ch=true;sp=S.steps[st.s];
      if(!sp){st.done=true;const storyXp=gainXp(storyBudget262(S,st).xp,'quest');addOrderRep(50,'História concluída');const g=Math.round(S.rw.g*(1+rankOf()));run.gold+=g;giveBoon184(15+S.rw.p*5);profile.ach=profile.ach||[];if(!profile.ach.includes(S.rw.t))profile.ach.push(S.rw.t);bigText('HISTÓRIA CONCLUÍDA',1600);sfx('arise');toast('<b>[HISTÓRIA]</b> '+S.n+' concluída: +'+xpNumber(storyXp)+' XP, +'+fmt(g)+' ouro, Bênção da Fenda por '+(15+S.rw.p*5)+' min e o título <b>'+TITLES.find(x=>x.id===S.rw.t).n+'</b>.',7000);break}
      toast('<b>[HISTÓRIA]</b> '+S.n+' · capítulo '+(st.s+1)+': '+sp[2],7000);if(STORY_ABS[sp[0]])st.got=STORY_ABS[sp[0]]()}}
  if(ch){store.set('pds2_profile',profile);saveRun()}}
function storyTab(){const P=profile.story||{};let h='<div class="sysline">Histórias da Ordem: cada uma tem capítulos e termina com um <b>título único</b>. Dá para seguir várias ao mesmo tempo.</div>';
  for(const S of STORIES){const st=P[S.id],T=TITLES.find(t=>t.id===S.rw.t);
    if(st&&st.done){h+=row('<b style="color:#6fe39a">'+S.n+'</b>','Concluída · título '+T.n+': '+T.m,'');continue}
    if(!st){h+=row('<b>'+S.n+'</b> · '+S.npc,S.steps.length+' capítulos · '+storyXpText262(S)+' · recompensa: 50 de reputação da Ordem, ouro, Bênção da Fenda por '+(15+S.rw.p*5)+' min e o título '+T.n+' ('+T.m+')',btn('Começar','stbeg',S.id,true,'hot'));continue}
    const sp=S.steps[st.s];h+=row('<b>'+S.n+'</b> · capítulo '+(st.s+1)+'/'+S.steps.length,sp[2]+'<br>'+storyXpText262(S,st)+'<br>Progresso: <b>'+Math.min(st.got,sp[1])+'/'+sp[1]+'</b>','')}return h}

