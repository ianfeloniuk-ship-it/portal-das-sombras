/* ================= COMPLETOS: TORRE 100, NPCs, CIDADE, FUSÃO SOMBRIA, CIDADES CAÍDAS ================= */
const NPCQ={Lyra:{d:'Feche 3 portais',t:'clear',n:3,sk:'Bênção de Lyra: +10% de XP'},Mira:{d:'Pesque 5 peixes',t:'fish',n:5,sk:'Receita de Mira: poções curam 75%'},Kael:{d:'Mate 5 elites',t:'elite',n:5,sk:'Fio de Kael: +8% de dano'},
  Brann:{d:'Derrote 2 guardiões',t:'boss',n:2,sk:'Couraça de Brann: −8% de dano recebido'},Dorian:{d:'Minere 30 cristais',t:'mine',n:30,sk:'Faro de Dorian: mais núcleos dos monstros'},Selene:{d:'Deposite 50.000 de ouro',t:'bank',n:50000,sk:'Seguro de Selene: ao morrer, 20% do ouro vai para o banco'}};
const NPCTALK={Lyra:['Mais um caçador novo... cuidado lá fora.','Você voltou inteiro. Isso é raro.','Sabe, eu também quis ser caçadora. Não tinha mana suficiente.','Guardei um relatório só para você ver primeiro.','Se um dia você sumir num portal, eu vou atrás. Sério.','Já pedi à Ordem: seu nome vai na parede dos lendários. Não me faça tirar ele de lá.'],
  Mira:['Poção? Poção.','Você de novo. Gostei.','Minha avó fazia poções com peixe. Não pergunte.','Estou testando uma receita nova. Quer provar?','Você é meu cliente favorito. Não conta pros outros.','Essa aqui eu nunca vendi pra ninguém. Leva. É por minha conta, hoje e sempre.'],
  Kael:['Arma boa não perdoa mão fraca.','Hm. Você segura a lâmina direito agora.','Eu forjei a espada de um SS uma vez. Ele morreu. A espada não.','Traga metal de guardião e eu faço milagre.','Você é o único que eu deixaria usar minhas melhores peças.','Forjei uma lâmina só pra você, com o meu nome gravado embaixo do seu. Nunca fiz isso antes.'],
  Brann:['Kael cuida dos equipamentos. Eu preparo os guardas.','Ainda vivo? Bom material.','Perdi um olho num portal C. Por isso eu faço armadura.','Ajustei as placas pro seu jeito de lutar.','Se precisar, os guardas estarão ao seu lado.','Não é mais armadura. É uma promessa de metal: enquanto eu viver, nada te atravessa.'],
  Dorian:['Núcleos, cristais, compro tudo.','Você tem olho pra coisa boa.','Sabia que cristal de rank A canta de noite?','Tenho um comprador secreto. Paga mais.','Sócio? Sócio.','Sócio, amigo, irmão. Escolhe o título, a metade do lucro já é sua.'],
  Selene:['Depósitos e saques, só isso.','Seu saldo está bonito.','O banco guarda mais que ouro. Guarda nomes de quem não voltou.','Abri uma conta especial pra você.','Se você morrer, eu cuido do que é seu. Prometo.','Seu cofre agora tem duas chaves. A outra fica comigo, junto do coração.']};
const npcHas=n=>!!(profile.npcSk||{})[n];
function npcEv(t,v=1){profile.npcq=profile.npcq||{};for(const n in NPCQ){const q=NPCQ[n];if(q.t!==t||affL(n)<6||npcHas(n))continue;const s=profile.npcq[n]=profile.npcq[n]||{got:0};if(s.got>=q.n)continue;s.got=Math.min(q.n,s.got+v);if(s.got>=q.n)toast('<b>['+n.toUpperCase()+']</b> Missão pessoal concluída. Fale comigo.',4000)}store.set('pds2_profile',profile)}
function npcRows(n){const l=affL(n),q=NPCQ[n],s=(profile.npcq||{})[n]||{got:0};let h=row('Conversar','"'+NPCTALK[n][Math.min(NPCTALK[n].length-1,Math.floor(l/2))]+'"','');
  if(npcHas(n))h+=row('Habilidade aprendida',q.sk,'<b style="color:#6fe39a">Ativa</b>');
  else if(l>=3)h+=row('Missão pessoal: '+q.d,'Progresso '+fmt(Math.min(s.got,q.n))+'/'+fmt(q.n)+' · recompensa: 25 de reputação da Ordem e '+q.sk,btn('Concluir','npcdone',n,s.got>=q.n,'hot'));
  else h+=row('Missão pessoal','Liberada com 3 corações','');return h}
/* cidade */
const cityOf=()=>nearestCity(player.x,player.z).c;
const cityL=c=>Math.max(c&&c.capital?4:0,(profile.cityLv||{})[c.id]||0)/* v217: capitais já nascem grandes */;
/* cidades caídas */
function cityFallen(c){if(c&&(profile.raided155||{})[c.id])return true;if(!seasonOn()||profile.season===weekId()||c.name==='Aster'||(profile.rebuilt||{})[c.id]===weekId())return false;const day=gameDay198()%7;const h=(Math.imul(c.cx|0,73856093)^Math.imul(c.cz|0,19349663)^weekId())>>>0;return (h%10)<=day}
function towerRank(){const R=mulberry32((profile.seed|0)+9);const l=NAMES.slice(0,12).map(n=>({n,f:Math.floor(Math.pow(R(),1.8)*100)+1}));l.push({n:'Você',f:profile.towerBest||0,me:true});return l.sort((a,b)=>b.f-a.f)}

