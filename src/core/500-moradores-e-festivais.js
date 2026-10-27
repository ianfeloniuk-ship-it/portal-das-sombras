/* ===== MORADORES E FESTIVAIS ===== */
const CLINES=['Bom dia, caçador!','Dizem que a muralha brilha à noite agora.','Meu filho quer ser caçador. Eu não deixo.','O preço do peixe subiu de novo.','Você é aquele que subiu a torre?','Cuidado com os portais vermelhos.','A pousada ficou mais confortável depois da reforma.','Ouvi dizer que um dragão foi visto perto daqui.','À noite eu fico em casa. Os monstros ficam mais fortes.','Minha avó jura que viu um eco andando sozinha.'];
const CNAMES=['Aldo','Brígida','Cedric','Elsbeth','Godwin','Flora','Gerold','Helena','Ivo','Matilde','Leofric','Maud','Nesta','Otto','Petronela','Roderic'];/* v486: nomes medievais (antes Enzo, Duda, Pietra...) */
function festival(){const d=new Date(),m=d.getMonth()+1,dd=d.getDate(),w=d.getDay();
  if((m===10&&dd>=25)||(m===11&&dd<=2))return{n:'Noite dos Ecos',d:'XP +50% à noite',xp:isNight()?.5:0,shop:0,line:'Na Noite dos Ecos os portais ficam inquietos...'};
  if((m===12&&dd>=20)||(m===1&&dd<=6))return{n:'Festival de Inverno',d:'lojas 20% mais baratas e XP +25%',xp:.25,shop:.2,line:'Feliz Festival de Inverno!'};
  if(w===0||w===6)return{n:'Feira de Fim de Semana',d:'lojas 15% mais baratas e estandartes na praça',xp:0,shop:.15,line:'Aproveita a feira! Tudo mais barato hoje.'};return null}
const CRIT=['gato','galinha','pombo'],CRIT_N={gato:'Miau.',galinha:'Có-có-có!',pombo:'Pruu.'};
function spawnCritter(c){const k=pick(CRIT);if(!MON.list[k])return;const m=makeChibi({mon:k,gk:'Skeleton_Minion',scale:1});const a=rnd(0,TAU),d=rnd(4,20),x=c.x+Math.cos(a)*d,z=c.z+Math.sin(a)*d;m.root.position.set(x,0,z);scene.add(m.root);
  const n={kind:'citizen',critter:true,home:c,m,x,z,face:0,r:.3,name:'',short:'',col:'#c9d3de',t:Math.random()*9,tx:x,tz:z,wait:rnd(0,3),path:[],noLabel:true,label:'F · FAZER CARINHO'};n.use=()=>{floater(n.x,n.z,CRIT_N[k],'#ffd9a0');sfx('ding')};npcs.push(n);return n}
function spawnCitizen(c){const m=makeChibi({body:pick([0x6b4a2a,0x3a5fd0,0x8a2b4a,0x2f7a4a,0xb39a6a,0x7a5a9a]),hair:pick([0x222222,0xc85a1e,0xe8e8ff,0x6b4a2a,0xd8b060]),wep:'none',gk:pick(['Knight','Barbarian','Mage','Rogue']),tint:pick([0xffffff,0xffe0c0,0xd0e0ff,0xe0ffd0]),scale:.88});
  const a=rnd(0,TAU),d=rnd(4,18),x=c.x+Math.cos(a)*d,z=c.z+Math.sin(a)*d;m.root.position.set(x,0,z);scene.add(m.root);const nm=window.Nomes655?Nomes655.nome(c,'morador'):pick(CNAMES);/* v655: nome da região */
  const n={kind:'citizen',home:c,m,x,z,face:0,r:.45,name:nm,short:nm,col:'#c9d3de',t:Math.random()*9,tx:x,tz:z,wait:rnd(0,3),path:[],label:'F · CONVERSAR COM '+nm.toUpperCase()};
  n.use=()=>{const F=festival();speech153(n,F&&Math.random()<.4?F.line:(regionLine116(c)||pick(CLINES)),'Moradora(o) de '+c.name)};npcs.push(n);return n}

