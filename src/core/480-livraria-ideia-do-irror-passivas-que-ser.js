/* ===== LIVRARIA (ideia do Irror): passivas que servem para qualquer classe. Custam 1 ponto de habilidade + ouro por nível (máx. 10). ===== */
const PBOOK=[{k:'xp',n:'Tomo da Sabedoria',d:l=>'+'+(3*l)+'% de XP',u:'+3% de XP por nível'},{k:'ls',n:'Tomo do Vampiro',d:l=>String(.5*l).replace('.',',')+'% do dano volta como vida',u:'+0,5% de roubo de vida por nível'},
 {k:'sh',n:'Tomo da Égide',d:l=>'+'+(4*l)+'% de escudo máximo',u:'+4% de escudo por nível'},{k:'res',n:'Tomo da Pele de Ferro',d:l=>'+'+fmt(Math.round(1.5*l*atkPer(run?.level||1)))+' de defesa universal (desconta de todo dano)',get u(){return '+'+fmt(Math.round(1.5*atkPer(run?.level||1)))+' de defesa universal por nível (cresce com seu nível)'}},
 {k:'eva',n:'Tomo do Vento',d:l=>String(1.5*l).replace('.',',')+'% de chance de evitar um golpe',u:'+1,5% de evasão por nível'},{k:'area',n:'Tomo do Alcance',d:l=>'+'+(4*l)+'% de alcance do ataque corpo a corpo',u:'+4% de alcance por nível'}];
function pb(k){return ((run&&run.pbook)||{})[k]||0}
function pbCost(l){return servicePrice265('passive',{passiveLevel:l})}
function libView(){view=libView;let h='<div class="sysline">Passivas para todas as classes. Cada melhoria custa <b>1 ponto de habilidade</b> e ouro. Máximo: nível 10. Pontos de habilidade: <b>'+(run.spts||0)+'</b>.</div><div class="sec">PASSIVAS</div>';
  for(const B of PBOOK){const l=pb(B.k);h+=row(B.n+' <b>NV '+l+'/10</b>','Agora: '+(l?B.d(l):'sem efeito')+' · '+B.u,l<10?btn('+1 · '+fmt(pbCost(l))+' ouro','pbup',B.k,run.gold>=pbCost(l)&&(run.spts||0)>=1):'<b>Máximo</b>')}
  const T=profile.trophies||[];h+='<div class="sec">TOMOS DE GUARDIÃO</div><div class="sysline" style="font-size:12px">Poderes dos guardiões derrotados. Equipe na Biblioteca de Poderes (1–3).</div>';
  const L2=bookList().filter(B=>T.some(t=>ALLBOSS().some(b=>b.n===t&&b.skill&&b.skill.n===B.sk.n)));if(!L2.length)h+='<div class="sysline" style="font-size:12px;color:var(--dim)">Nenhum ainda. Derrote guardiões.</div>';
  L2.forEach(B=>{const i=bookList().indexOf(B);h+=row('Tomo: <b>'+B.sk.n+'</b>',skillDesc(B.sk),btn(fmt(B.price)+' ouro','buybook',i,run.gold>=B.price))});openModal('LIVRARIA',h)}
