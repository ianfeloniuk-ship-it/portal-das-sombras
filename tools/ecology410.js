/* v410 (Ian): Ecologia viva do Bestiário.
   Cada uma das 61 espécies (e suas versões Fendida e Abissal) + os 13 chefes recebem
   um perfil de comportamento tirado do Livro Oficial ("Hábitos e perigo" e "Tática de sobrevivência").
   - Espécies com módulo próprio (escaravelho, guardião, gosma espinhosa...) mantêm a IA delas; aqui ganham dica, moeda e moral.
   - Fendida: "ataca qualquer coisa que carregue mana" -> pula o estado neutro/adormecido.
   - Abissal: "obedece a um chamado do outro lado" -> não entra em pânico e não se rende.
   Tecla nova: Jogar moeda brilhante (padrão 7), custa 1 de ouro. */
(function(){
'use strict';
const BOOK410={"slime": ["Slime Rosa", "Isole a criatura do grupo e mantenha uma rota de saída; o risco aumenta quando várias cercam o mesmo alvo."], "gosma": ["Gosma Verde", "Observe os pedaços depois do dano e não deixe que se reúnam fora do seu alcance durante a noite."], "cogu": ["Cogumelinho", "Deixe uma saída aberta, não a encurrale e fique fora da nuvem de esporos antes de voltar ao ataque."], "passaro": ["Pássaro Bravo", "Use cobertura ou mantenha-se sob proteção; espere o mergulho passar e ataque quando ela recuperar altitude."], "espinhosa": ["Gosma Espinhosa", "Evite correr ou golpear de forma desordenada perto dela; aguarde o disparo de espinhos e avance durante a pausa."], "escaravelho": ["Cavaleiro Escaravelho", "Saia da linha reta da investida e evite carregar objetos brilhantes; ataque depois da freada."], "guardiao": ["Guardião Corrompido", "Não atravesse sem observar o espaço vigiado; provoque a reação à distância e recue do corredor."], "cactinho": ["Cactoro", "Evite aproximar-se durante o dia; no fim da tarde, mantenha distância das raízes e ataque após o movimento."], "magote": ["Magote", "Não permaneça no local da luta; afaste-se depois do combate e observe o terreno antes de recolher espólios."], "orcinho": ["Orc Pequeno", "Separe-o dos mais velhos e não o persiga sozinho; quando fica isolado, a fuga dele abre espaço para o contra-ataque."], "ninjinha": ["Ninja Mirim", "Proteja as costas e mantenha os dois adversários no mesmo campo de visão; ataque depois do reaparecimento."], "visitante": ["Visitante", "Não entregue uma abertura enquanto ele observa; use um ataque seguro e mude de posição antes da resposta."], "yetinho": ["Filhote de Yeti", "Não ataque perto dos adultos; se o filhote reagir, abra distância e evite lutar entre os dois."], "peixinho": ["Peixe Andante", "Durante a chuva, evite lutar cercado por vários; mantenha terreno seco ou uma rota para fora do bando."], "fantasma": ["Fantasma", "Não dependa de paredes como cobertura; espere o reaparecimento e ataque quando o gesto repetido terminar."], "abelha": ["Abelha Blindada", "Afaste a criatura da colmeia e evite um combate prolongado perto das flores; o zumbido pode trazer reforço."], "glub": ["Glub", "Não a pressione de perto quando se assusta; recue dos respingos e só se aproxime depois da reconstrução."], "golenzinho": ["Golenzinho", "Não fique perto do golem maior que ela imita; force um espaço separado antes de atacar."], "cogufuria": ["Cogumelo Furioso", "Evite que sua sombra fique sobre a criatura; mude o ângulo e ataque de lado."], "sapo": ["Sapo Guerreiro", "Não dispute o centro do brejo; atraia a criatura para terreno aberto e ataque depois do salto."], "coelho": ["Coelho Assassino", "Não se aproxime por aparência; mantenha alcance e reação pronta antes de entrar no espaço curto."], "caveira": ["Caveira Fantasma", "Apague ou afaste fontes de luz desnecessárias e não deixe que o barulho atraia outros mortos."], "redemoinho": ["Redemoinho", "Evite permanecer no cruzamento das Fendas; recue antes do amanhecer e ataque somente quando houver chão estável."], "mono": ["Monkroose", "Proteja seus itens e observe as ruínas altas; não o persiga até o ninho sem uma rota de retorno."], "ninja": ["Ninja Sombrio", "Espere o primeiro ataque e não gaste a esquiva no vazio; ataque quando ele reaparecer."], "cactogig": ["Cactoro Gigante", "Não dispute a água de perto; atraia o corpo pesado para fora da fonte e ataque durante a recuperação."], "homempeixe": ["Homem-Peixe", "Evite lutar dentro da lagoa sagrada; atraia-o para a margem e não permaneça diante da lança."], "alpaca": ["Alpaca Real", "Não encare o rebanho de frente; mantenha distância lateral e evite separar as alpacas."], "abelharainha": ["Abelha Rainha Blindada", "Afaste a rainha das demais e interrompa a formação; o grupo fica mais perigoso quando o som coordena o ataque."], "glubancio": ["Glub Ancião", "Não fique perto quando despertar; saia da área baixa e procure terreno alto antes de enfrentar a inundação."], "golempedra": ["Golem de Pedra", "Não retire cristais perto dele; se já reagiu, atraia-o para fora da caverna e ataque durante a caminhada pesada."], "lula": ["Lula do Vazio", "Mantenha contato visual e uma rota de fuga; se o silêncio cobrir a área, saia antes de procurar o ataque."], "invasor": ["Invasor", "Quebre a linha de marcha pelo flanco e evite permanecer no caminho que ele segue."], "dino": ["Dino", "Não fique entre os dois; force um deles a perder a distração e ataque quando o par se separar."], "diabrete": ["Diabrete", "Não persiga as provocações; mantenha distância dos demônios maiores e ataque quando o chamado terminar."], "tribal": ["Máscara Tribal", "Não atravesse o círculo do ritual; observe o ritmo da dança e ataque somente quando a maldição não estiver sendo formada."], "alpacaimp": ["Alpaca Imperial", "Proteja o rebanho e não persiga a fuga; mantenha uma rota lateral para impedir que ela escolha o terreno."], "chifrudo": ["Demônio Chifrudo", "Não ofereça um duelo direto; use distância e ataque enquanto ele procura um adversário mais forte."], "reicogu": ["Rei Cogumelo", "Afaste-se do círculo de cogumelos e elimine a fonte de comando antes de ficar cercado."], "dragonete": ["Dragonete", "Não deixe o primeiro sopro definir o combate; mova-se de lado e ataque depois de observar o padrão de fogo."], "dragaoancio": ["Dragão Ancião", "Não acorde o dragão por aproximação desnecessária; se despertar, abandone o ouro e saia do alcance do sopro."], "minion": ["Esqueleto", "Afaste-o do grupo que dá ordens e ataque quando ele ficar sem direção."], "mage": ["Esqueleto Mago", "Ignore a linha de frente por um instante e alcance o mago por uma rota protegida; não fique parado diante da magia."], "warrior": ["Esqueleto Guarda", "Não force a porta de frente; procure uma abertura lateral e enfrente o guarda fora do corredor estreito."], "golem": ["Golem de Mana", "Afaste-o dos cristais antes de atacar; sem a fonte próxima, o combate fica mais previsível."], "wraith": ["Espectro", "Não permaneça no caminho que ele escolheu; mude de região e ataque quando ele perder a linha de perseguição."], "demon": ["Demônio", "Evite o terreno queimado e não deixe que ele abra passagem para outros; interrompa o avanço antes de perseguir."], "goblin": ["Goblin Guerreiro", "Quebre o bando e não responda aos gritos com uma investida cega; ataque o isolado e recue."], "gobShield118": ["Goblin Escudeiro", "Não bata no escudo enquanto os arqueiros trabalham; contorne-o e pressione quem está atrás."], "gobArcher118": ["Goblin Arqueiro", "Use cobertura para encurtar a distância e ataque quando ele iniciar a fuga."], "gobShaman118": ["Goblin Xamã", "Priorize o xamã e não se agrupe sob a maldição; interrompa a cura antes de perseguir os guerreiros."], "gobBrute118": ["Goblin Bruto", "Fique fora do golpe amplo e atraia o bruto para longe dos outros; ataque depois do impacto."], "lobo": ["Lobo Sombrio", "Não permita que a matilha feche o círculo; mantenha uma direção de fuga e ataque o lobo que se afastar."], "aranha": ["Aranha Gigante", "Olhe acima antes de avançar; evite as teias e ataque depois que a aranha gastar o fio de captura."], "vespa": ["Vespa Rainha", "Mantenha cobertura acima e não siga o mergulho; ataque quando ela voltar para a altura."], "orc": ["Orc", "Não aceite um duelo em terreno ruim; mantenha distância e escolha quando enfrentar a criatura."], "yeti": ["Yeti", "Não lute entre os filhotes; afaste o yeti do abrigo e saia da linha de possíveis avalanches."], "gigante": ["Gigante de Pedra", "Observe a parede antes de caminhar; atraia o gigante para espaço aberto e ataque depois do primeiro movimento."], "raptor": ["Raptor", "Proteja os flancos e não corra em linha; alterne direção para impedir o zigue-zague."], "dragao": ["Dracônico", "Evite o duelo frontal se não for sua escolha; mantenha distância e ataque depois do desafio."], "rogue": ["Esqueleto Ladino", "Proteja as costas e não entre nas sombras sem visão; ataque quando o ladino sair para golpear."], "olhoerrante": ["Olho Errante", "Quebre a linha de visão da íris roxa e ataque pelos flancos antes que ele chame outras criaturas da Fenda."], "arraia": ["Arraia do Vazio", "Observe a sombra quando ela planar alto e esquive para o lado no mergulho da cauda; ataque enquanto ela recupera altitude."], "arauto": ["Arauto da Fenda", "Interrompa o cântico antes que os anéis de runas se fechem; mantenha distância das mãos de luz e recue quando ele anunciar o vazio."], "semente": ["Semente da Fenda", "Elimine o bando pequeno antes que suguem a mana do chão e se enraízem perto do portal."]};
const INEDITAS456=['olhoerrante','arraia','arauto','semente'];
const BOSSBOOK410={"Cavaleiro Carmesim": "Vigie a espada e preserve uma saída lateral. A armadura larga encobre o corpo; observe a preparação inteira antes de entrar no alcance da lâmina.", "Lich Ancestral": "Acompanhe o grimório tanto quanto o corpo. Evite ficar preso entre o conjurador e as áreas que ele ameaça; aproxime-se com uma rota de retirada.", "Berserker Rubro": "Mantenha os dois machados no campo de visão. Saia do alcance dos braços pesados e procure a pausa depois do golpe para responder, sem prolongar a troca.", "General Esqueleto": "Observe o general e o espaço ocupado pela tropa. Preserve seus flancos e evite avançar entre adversários só para alcançar o comandante.", "O Rei Oco": "Use a coroa e o manto para acompanhar sua posição. A ausência de um corpo visível dificulta a leitura da distância; conserve uma margem ao se aproximar.", "Rei Demônio Vharok": "Evite encostar-se ao trono e às bordas da fortaleza. Observe a abertura no peito e o fogo ao redor para escolher quando avançar ou recuar.", "Dragão do Caos Kaelthys": "Observe qual região do corpo prepara o ataque: garganta, asas e dorso anunciam ameaças diferentes. Mantenha uma saída disponível quando o dragão mudar a posição.", "Rainha Aranha Nhyssa": "Não atravesse a rede sem examinar as rotas de saída. Ovos e teias fazem parte do território defendido; entrar no ninho exige espaço para recuar.", "Colosso de Gelo Ymrak": "Dê espaço ao peso de seus passos e braços. Evite uma troca prolongada junto ao corpo; reconheça primeiro a distância que ele cobre ao avançar.", "Arconte da Destruição": "Acompanhe o núcleo e a direção das placas. Preserve terreno livre atrás de você e resista à tentação de permanecer perto apenas porque o centro parece exposto.", "Arconte do Gelo Eterno": "Vigie as lâminas e mantenha distância para sair da trajetória. Não deixe que uma aproximação precipitada prenda você entre o corpo e a borda da arena.", "Arconte das Pragas": "Observe as cavidades do tronco e as flores. Mude de posição quando a névoa aparecer e evite atravessar uma região encoberta para continuar o ataque.", "Arconte das Feras": "As galhadas largas e as garras tornam a frente especialmente ameaçadora. Vigie a orientação da cabeça, conserve espaço lateral e recue antes de insistir em outro golpe."};
/* Famílias de reação (a tabela de cobertura conta por elas). */
const FAM410={
 brilho:'Atração por brilho',carnica:'Atração por carniça',moral:'Moral do bando',protecao:'Fúria protetora',honra:'Honra e rendição',
 vibracao:'Sensor de vibração',luz:'Luz e barulho',perimetro:'Guarda adormecido / perímetro',investida:'Investida em linha reta',
 emboscada:'Predador de emboscada',neutro:'Observador / ignora fracos',bando:'Bando e cerco',habitat:'Preso ao habitat / hora do dia',comando:'Comando e chamado',
 cacador:'Caçador persistente',duelo:'Desafiante'};
/* own: módulo que já cuida da IA (aqui só ganha dica, moeda e moral).
   esc: como o jogador escapa — far (distância), home (sai do território), los (fora de vista por N s), none (não desiste). */
const P410={
 slime:{f:['bando'],own:'Slime360',esc:{far:22,los:4},how:'Sozinho é pacífico; em grupo cerca o alvo.'},
 gosma:{f:['habitat','bando'],own:'Gosma347',esc:{far:24,los:5},how:'Divide-se ao apanhar; os pedaços se juntam de novo.'},
 cogu:{f:['moral','emboscada'],own:'Cogu348',leader:['reicogu'],esc:{far:20,los:4},how:'Foge; encurralado, solta esporos de sono.'},
 passaro:{f:['emboscada'],own:'Bird349',esc:{far:30,los:5},how:'Mergulha pelos flancos; nunca de frente.'},
 espinhosa:{f:['vibracao'],own:'Spiky350',esc:{far:14,los:3},how:'Dispara espinhos quando sente vibração (correr ou golpear perto).'},
 escaravelho:{f:['investida','brilho'],own:'Beetle352',lure:'charge',esc:{far:26,los:4},how:'Investe em linha reta contra o que brilha e freia no fim. Jogue uma moeda (tecla 7).'},
 guardiao:{f:['perimetro'],own:'Guardian370',esc:{home:10},how:'Imóvel até alguém cruzar o espaço vigiado; volta ao posto.'},
 cactinho:{f:['habitat'],own:'Cactoro372',esc:{far:18,los:4},how:'Enraizado de dia; anda e cospe espinhos no fim da tarde.'},
 magote:{f:['carnica'],carrion:1,esc:{far:20,los:4},how:'Vai até os restos de uma luta recente ou isca de carniça e come em vez de caçar.'},
 orcinho:{f:['moral'],lone:['orcinho','orc'],esc:{far:24,los:5},how:'Ataca para impressionar os mais velhos; foge se ficar sozinho.'},
 ninjinha:{f:['emboscada','bando'],esc:{far:30,los:6},how:'Some e reaparece atrás do alvo; treina em pares.'},
 visitante:{f:['neutro'],observe:2.5,esc:{far:26,los:5},how:'Observa antes de agir: não ataca nos primeiros segundos.'},
 yetinho:{f:['protecao','moral'],playful:1,leader:['yeti'],esc:{far:22,los:4},how:'Brinca até ver um adulto ser atacado; foge se o adulto cair.'},
 peixinho:{f:['habitat','bando'],water:.7,esc:{far:22,los:4},how:'Mais lento fora da água; anda em bando.'},
 fantasma:{f:['cacador'],esc:{far:34,los:8},how:'Atravessa paredes: cobertura não basta.'},
 abelha:{f:['comando','bando'],alert:['abelha','abelharainha','vespa'],leader:['abelharainha'],esc:{home:22},how:'O zumbido chama as outras; foge se a rainha cair.'},
 glub:{f:['habitat'],esc:{far:18,los:4},how:'Explode em respingos quando assustado e se reconstrói.'},
 golenzinho:{f:['moral'],leader:['golempedra','gigante','golem'],esc:{far:20,los:4},how:'Imita o golem maior; sem ele, foge.'},
 cogufuria:{f:['emboscada'],near:3,leader:['reicogu'],esc:{far:16,los:3},how:'Só ataca quem pisa na sua sombra (muito perto).'},
 sapo:{f:['honra','habitat'],honor:1,esc:{home:24},how:'Disputa o brejo; com pouca vida, se rende a quem o venceu. F para aceitar.'},
 coelho:{f:['emboscada'],near:4,esc:{far:20,los:4},how:'Parece inofensivo até alguém chegar perto demais.'},
 caveira:{f:['luz','comando'],light:1,call:['caveira','fantasma','minion','mage','warrior','wraith','rogue'],esc:{far:24,los:4},how:'Enxerga longe à noite; o grito acorda outros mortos.'},
 redemoinho:{f:['habitat'],dawn:1,esc:{far:20,los:4},how:'Desfaz-se ao amanhecer.'},
 mono:{f:['brilho'],lure:'grab',esc:{far:26,los:5},how:'Larga tudo por uma moeda brilhante (tecla 7) e foge com ela.'},
 ninja:{f:['emboscada'],esc:{far:30,los:6},how:'Ataca uma vez, some e espera o próximo erro.'},
 cactogig:{f:['perimetro'],near:3.5,esc:{home:12},how:'Parado e paciente; só esmaga quem chega perto da sua água.'},
 homempeixe:{f:['habitat','perimetro'],water:.7,esc:{home:16},how:'Defende a lagoa; fora da água fica lento e desiste.'},
 alpaca:{f:['protecao','neutro'],stare:1,herd:['alpaca','alpacaimp'],esc:{home:14},how:'Cospe em quem a encara; o rebanho defende os seus.'},
 abelharainha:{f:['comando'],call:['abelha','vespa'],esc:{home:24},how:'Ordena o ataque das abelhas ao entrar em combate.'},
 glubancio:{f:['perimetro'],near:5,esc:{home:14},how:'Parado por séculos; acorda se chegarem perto.'},
 golempedra:{f:['perimetro','protecao'],dormant:1,esc:{home:14},how:'Só reage a quem mexe com ele.'},
 lula:{f:['emboscada'],esc:{far:24,los:3},how:'Silencia a área antes do bote; saia do silêncio.'},
 invasor:{f:['investida'],esc:{far:22,los:4},how:'Marcha em linha; saia do caminho pelo flanco.'},
 dino:{f:['bando','carnica'],carrion:1,esc:{far:28,los:5},how:'Caça em pares: um distrai, o outro ataca. Distraído por iscas de carniça.'},
 diabrete:{f:['comando'],call:['demon','chifrudo','diabrete'],esc:{far:24,los:4},how:'O chamado traz os demônios maiores.'},
 tribal:{f:['perimetro'],near:5,esc:{home:12},how:'Só ataca quem entra no círculo do ritual.'},
 alpacaimp:{f:['protecao','moral'],shy:1,herd:['alpaca','alpacaimp'],esc:{far:16,los:3},how:'Foge de tudo; luta só se o rebanho for atacado.'},
 chifrudo:{f:['neutro','duelo'],weak:.35,esc:{far:26,los:5},how:'Ignora presas fracas (com pouca vida).'},
 reicogu:{f:['comando'],call:['cogu','cogufuria'],esc:{home:20},how:'Comanda os cogumelos; sem ele, eles fogem.'},
 dragonete:{f:['duelo'],esc:{far:24,los:4},how:'Testa a força soprando fogo.'},
 dragaoancio:{f:['perimetro'],near:6,esc:{home:30},how:'Dorme sobre o ouro; acorda se chegarem perto.'},
 minion:{f:['comando','moral'],leaderless:['mage','warrior','wraith','demon'],leader:['mage','warrior','wraith'],esc:{far:20,los:4},how:'Obedece ao mais forte; sem ordens, vaga sem rumo.'},
 mage:{f:['comando'],esc:{far:24,los:4},how:'Lança magia de trás dos outros mortos; sem ele, os esqueletos se perdem.'},
 warrior:{f:['perimetro'],esc:{home:10},how:'Protege portas e passagens; não persegue longe.'},
 golem:{f:['perimetro'],esc:{home:16},how:'Guarda antiga; não persegue longe do posto.'},
 wraith:{f:['cacador'],esc:{none:1},how:'Caça a mesma pessoa sem descanso: não desiste.'},
 demon:{f:['comando'],esc:{far:26,los:5},how:'Abre caminho para outros demônios.'},
 goblin:{f:['moral','bando'],leader:['gobBrute118'],lone:['goblin','gobShield118','gobArcher118','gobShaman118','gobBrute118'],esc:{far:24,los:4},how:'Ataca em bando; foge se o Bruto cair ou se ficar sozinho.'},
 gobShield118:{f:['moral','bando'],leader:['gobBrute118'],esc:{far:22,los:4},how:'Bloqueia na frente; foge se o Bruto cair.'},
 gobArcher118:{f:['moral'],leader:['gobBrute118'],esc:{far:24,los:4},how:'Atira de longe e recua; foge se o Bruto cair.'},
 gobShaman118:{f:['moral','comando'],leader:['gobBrute118'],esc:{far:24,los:4},how:'Cura o bando; foge se o Bruto cair.'},
 gobBrute118:{f:['comando'],esc:{far:24,los:4},how:'Os outros goblins o temem: sem ele, o bando se desfaz.'},
 lobo:{f:['bando','moral','carnica'],carrion:1,lone:['lobo'],loneHp:.5,esc:{far:40,los:7},how:'Cerca em matilha; fareja iscas de carniça; o último, ferido, foge.'},
 aranha:{f:['emboscada','carnica'],carrion:1,esc:{far:22,los:4},how:'Espera na teia e prende com fios; atraída por isca de carniça.'},
 vespa:{f:['emboscada'],esc:{far:28,los:5},how:'Mergulha e volta para o alto.'},
 orc:{f:['honra','duelo'],honor:1,esc:{far:26,los:5},how:'Luta por honra; com pouca vida, se rende a quem o venceu. F para aceitar.'},
 yeti:{f:['protecao'],esc:{home:24},how:'Fúria ao ver um filhote atacado; os filhotes fogem se ele cair.'},
 gigante:{f:['perimetro'],near:4.5,esc:{home:16},how:'Parece parte da parede até alguém chegar perto.'},
 raptor:{f:['cacador','bando','carnica'],carrion:1,esc:{far:36,los:6},how:'Zigue-zague pelos flancos; persegue longe, mas é distraído por isca de carniça.'},
 dragao:{f:['duelo'],esc:{far:30,los:5},how:'Desafia caçadores para provar valor.'},
 rogue:{f:['emboscada'],esc:{far:26,los:5},how:'Ataca pelas costas e some nas sombras.'},
 olhoerrante:{f:['luz','comando'],light:1,call:['olhoerrante','arraia','semente','fantasma','wraith'],esc:{far:28,los:5},how:'Vigia as passagens das Fendas sem piscar; dispara luz pela pupila e chama reforços.'},
 arraia:{f:['emboscada','habitat'],esc:{far:30,los:5},how:'Plana em silêncio no ar das Fendas e mergulha de repente cortando com a cauda.'},
 arauto:{f:['comando','duelo'],call:['semente','olhoerrante','arraia','wraith','demon'],esc:{far:34,los:6},how:'Mensageiro do Outro Mundo; seus anéis de runas convocam criaturas da Fenda.'},
 semente:{f:['bando','moral','habitat'],lone:['semente'],leader:['arauto'],esc:{far:20,los:4},how:'Anda em bandos sugando mana do solo; foge se o Arauto cair ou se ficar isolada.'}
};
const base=k=>k==='saporei'?'sapo':(KINDS[k]?.baseKind||(KINDS[k]?.alias308?KINDS[k].alias308.replace(/_f$/,''):k));
const variant=e=>KINDS[e.kind]?.variant||(KINDS[e.kind]?.alias308?'f':'');
const T=()=>typeof time==='number'?time:performance.now()/1000;
function profileOf(k){const b=base(k),P=P410[b];if(!P)return null;return{kind:k,base:b,...P,book:BOOK410[b]}}
function bossProfile(name){const key=Object.keys(BOSSBOOK410).find(n=>String(name||'').includes(n));return key?{boss:key,f:['comando'],esc:{far:40},how:'Chefe: desiste se você se afastar 40 m.',book:[key,BOSSBOOK410[key]]}:null}
function coverage(){
 const kindSet=new Set(Object.keys(typeof KINDS!=='undefined'?KINDS:{}).filter(k=>!KINDS[k]?.alias308&&BOOK410[base(k)]));
 for(const k of INEDITAS456)kindSet.add(k);
 const kinds=[...kindSet];
 const rows=kinds.map(k=>({k,p:profileOf(k)})).concat(Object.keys(BOSSBOOK410).map(b=>({k:'boss:'+b,p:bossProfile(b)})));
 const count={};for(const r of rows)for(const f of r.p?.f||[])count[f]=(count[f]||0)+1;
 return{total:rows.length,missing:rows.filter(r=>!r.p||!r.p.book?.[1]||!r.p.esc||!r.p.f?.length).map(r=>r.k),count,rows};
}
/* ---------- estado e utilidades ---------- */
function st(e){return e.eco410||(e.eco410={home:{x:e.x,z:e.z},hp:e.hp,awake:false,calm:0,flee:0,peers0:0})}
function pose(e,move,dt,wind){animChibi(e.m,{move,atk:0,dead:0,wind:wind||0},e.t);if(window.Anim303)try{Anim303.enemyPost(e,dt)}catch(_){}e.m.root.position.set(e.x,0,e.z);e.m.root.rotation.y=e.face}
function walk(e,tx,tz,dt,mul){const dx=tx-e.x,dz=tz-e.z,d=Math.hypot(dx,dz);if(d<.2)return false;const s=Math.min(d,e.speed*(mul||1)*(e.slow>0?.5:1)*dt);turnTo(e,Math.atan2(dx,dz),dt,8);moveEnt(e,dx/d*s,dz/d*s);return true}
function near(e,kinds,r,fn){const out=[];for(const o of enemies){if(o===e||o.dead||o.ally||!kinds.includes(base(o.kind)))continue;if(Math.hypot(o.x-e.x,o.z-e.z)<r&&(!fn||fn(o)))out.push(o)}return out}
function wake(o){if(o.dead||o.ally)return;const S=st(o);S.awake=true;S.calm=0;S.giveup=0;o.aggro=true}
let tipBox=null;const tipSeen={};
function tipEl(){if(tipBox&&document.body.contains(tipBox))return tipBox;tipBox=document.createElement('div');tipBox.id='eco410tip';tipBox.setAttribute('role','status');document.body.appendChild(tipBox);return tipBox}
function showTip(html,ms){try{if(typeof modalOpen!=='undefined'&&modalOpen)return;const b=tipEl();b.innerHTML=html;b.classList.add('on');clearTimeout(b._t);b._t=setTimeout(()=>b.classList.remove('on'),ms||6000)}catch(_){}}
/* Ian (v410): cada aviso aparece só na PRIMEIRA vez (fica no save); depois fica registrado na ficha do Bestiário. */
function mem(){try{const m=profile.eco410=profile.eco410||{};m.seen=m.seen||{};m.won=m.won||{};return m}catch(_){return{seen:tipSeen,won:tipSeen}}}
function save(){try{store.set('pds2_profile',profile)}catch(_){}}
function once(key){const m=mem();if(m.seen[key])return false;m.seen[key]=1;save();return true}
function tactic(e,P){const b=P.base||('boss:'+P.boss);if(!once(b))return;showTip('<b>'+(P.book?.[0]||e.name||'')+'</b> · '+P.how+'<small>Livro: '+P.book?.[1]+'</small>',7000)}
function win(msg,b,type){const m=mem(),key=b+':'+type;m.wins=(m.wins||0)+1;if(m.won[key]){save();return}m.won[key]=msg;save();try{floater(player.x,player.z,'TÁTICA DO BESTIÁRIO','#ffd76a',true,2.8);sfx('ding')}catch(_){}showTip('<b class="ok">Tática funcionou</b> · '+msg+'<small>Registrado no Bestiário.</small>',5000)}
function story(e){return !!(e.camp327||e.isIntroTutorial||e.raid155||e.coreRaider||e.expBoss||e.rival||e.nemesis||e.statue)}
function dayP(){try{return (dayT%DAYLEN)/DAYLEN}catch(_){return .5}}
function night(){const p=dayP();return p<.2||p>.8}
/* ---------- pânico / fuga ---------- */
function panic(o,why){if(variant(o)==='a'||o.dead||o.isBoss||story(o))return false;const S=st(o);if(S.flee>T())return false;S.flee=T()+7;S.surr=null;S.lure=null;o.act=null;o.aggro=false;floater(o.x,o.z,why||'PÂNICO!','#9fe0ff',true,2.6);return true}
function fleeStep(e,S,dt){const dx=e.x-player.x,dz=e.z-player.z;let a=Math.atan2(dx,dz);for(let i=0;i<7;i++){const t=a+(i%2?1:-1)*Math.ceil(i/2)*.6,nx=e.x+Math.sin(t)*1.2,nz=e.z+Math.cos(t)*1.2;if(freeAt(nx,nz,e.r||.5)){a=t;break}}
 e.act=null;e.face=a;moveEnt(e,Math.sin(a)*e.speed*1.25*dt,Math.cos(a)*e.speed*1.25*dt);pose(e,1,dt);if(T()>=S.flee-.05){S.calm=T()+20;S.awake=false}}
/* ---------- moeda brilhante ---------- */
const coins=[];
function coinMesh(){const g=new THREE.Group();const m=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.035,18),new THREE.MeshStandardMaterial({color:0xffcf4a,emissive:0xb87a10,emissiveIntensity:.9,metalness:.85,roughness:.25}));m.rotation.x=Math.PI/2;g.add(m);try{const l=new THREE.PointLight(0xffd76a,1.2,5,2);l.position.y=.3;g.add(l)}catch(_){}scene.add(g);return g}
function throwCoin(){
 if(!started||paused||!player||player.dead||(typeof modalOpen!=='undefined'&&modalOpen))return false;
 if((run.gold||0)<1){toast('<b>[NARRADOR]</b> Sem ouro para jogar.');return false}
 run.gold-=1;const a=player.face,dist=5.5;let x=player.x+Math.sin(a)*dist,z=player.z+Math.cos(a)*dist;
 for(let i=0;i<6&&!freeAt(x,z,.3);i++){x-=Math.sin(a)*.8;z-=Math.cos(a)*.8}
 const c={x,z,sx:player.x,sz:player.z,t:0,until:T()+9,mesh:coinMesh(),taken:false,mode:L.mode};c.mesh.position.set(player.x,1.2,player.z);coins.push(c);
 try{sfx('coin')}catch(_){}return c}
function coinsTick(dt){for(let i=coins.length-1;i>=0;i--){const c=coins[i];c.t+=dt;const k=Math.min(1,c.t/.45),y=k<1?1.2+Math.sin(k*Math.PI)*1.4-1.0*k:.1;
 c.mesh.position.set(c.sx+(c.x-c.sx)*k,y,c.sz+(c.z-c.sz)*k);c.mesh.rotation.y+=dt*4;if(c.taken||T()>c.until||L.mode!==c.mode){scene.remove(c.mesh);c.mesh.traverse(o=>{o.geometry?.dispose?.();o.material?.dispose?.()});coins.splice(i,1)}}}
function coinFor(e){let best=null,bd=13;for(const c of coins){if(c.taken||c.t<.45)continue;const d=Math.hypot(c.x-e.x,c.z-e.z);if(d<bd&&los(e.x,e.z,c.x,c.z)){bd=d;best=c}}return best}
function lureStep(e,P,S,dt){
 if(!P.lure)return false;const A=S.lure;
 if(A){A.t+=dt;
  if(P.lure==='charge'){e.face=Math.atan2(A.dx,A.dz);
   if(A.phase==='wind'){pose(e,0,dt,1);if(A.t>=.45){A.phase='go';A.t=0}return true}
   const left=Math.hypot(A.c.x-e.x,A.c.z-e.z),step=Math.min(12*dt,left),nx=e.x+A.dx*step,nz=e.z+A.dz*step;
   if(left<.7||!freeAt(nx,nz,e.r)||A.t>1.6){S.lure=null;A.c.taken=true;e.stun=2.6;e.cd=Math.max(e.cd,2.6);e.beetle352=null;e.aggro=true;floater(e.x,e.z,'FREADA!','#e8c582',true,2.4);try{fxBurst(A.c.x,.3,A.c.z,0xffd76a,14,4)}catch(_){}win('O '+(P.book?.[0]||'Escaravelho')+' investiu contra a moeda e parou na freada. Ataque agora.',P.base,'moeda');return true}
   moveEnt(e,A.dx*step,A.dz*step);pose(e,1,dt);return true}
  // grab: corre até a moeda, pega e foge com ela
  if(A.c.taken){S.lure=null;return false}
  if(Math.hypot(A.c.x-e.x,A.c.z-e.z)<.8||!walk(e,A.c.x,A.c.z,dt,1.4)){A.c.taken=true;S.lure=null;e.aggro=false;S.flee=T()+5;win('O '+(P.book?.[0]||'Monkroose')+' largou você para fugir com a moeda.',P.base,'moeda');return true}
  pose(e,1,dt);return true}
 if(e.stun>0)return false;const c=coinFor(e);if(!c)return false;const d=Math.hypot(c.x-e.x,c.z-e.z)||1;
 S.lure={c,t:0,phase:'wind',dx:(c.x-e.x)/d,dz:(c.z-e.z)/d};S.tip=1;e.act=null;e.beetle352=null;return true}
/* ---------- carniça e isca de comida podre (LURE_FOOD) ---------- */
const foodLures=[];
function dropLure(x,z,kind='food',dur=18){
 const item={x,z,kind,type:'LURE_FOOD',until:T()+(dur||18)};
 foodLures.push(item);
 if(typeof enemies!=='undefined'){
  for(const e of enemies){
   if(!e||e.dead||e.isBoss||e.ally)continue;
   const P=profileOf(e.kind);
   if(!P||(!P.carrion&&!['lobo','aranha','raptor','dino','magote','cogu','cogufuria','sapo','coelho','peixinho','orc','orcinho','goblin','slime','gosma','semente'].includes(P.base)))continue;
   if(Math.hypot(e.x-x,e.z-z)<24){
    const S=st(e);S.eating=1;S.foodLure=item;e.aggro=false;e.act=null;
    try{floater(e.x,e.z,'ATRAÍDO PELA ISCA!','#a6e22e',true,2.2)}catch(_){}
   }
  }
 }
 return item;
}
const throwBait=(x,z)=>dropLure(x??player?.x??0,z??player?.z??0,'food',18);
function carrionStep(e,S,dt,pd){
 for(let i=foodLures.length-1;i>=0;i--)if(T()>foodLures[i].until)foodLures.splice(i,1);
 let bestLure=null,ld=24;
 for(const l of foodLures){const d=Math.hypot(l.x-e.x,l.z-e.z);if(d<ld){ld=d;bestLure=l}}
 if(bestLure){
  const P=profileOf(e.kind);
  if(e.aggro&&!S.eating)win('O '+(P?.book?.[0]||e.name)+' foi atraído pela Isca de Carniça (LURE_FOOD).',P?.base||'magote','carnica');
  S.eating=1;e.aggro=false;e.act=null;
  if(ld>1.3){walk(e,bestLure.x,bestLure.z,dt,1.05);pose(e,1,dt)}else{turnTo(e,Math.atan2(bestLure.x-e.x,bestLure.z-e.z),dt,4);pose(e,0,dt,.5)}
  return true;
 }
 if(pd<2.6)return false;
 let best=null,bd=26;for(const o of enemies){if(!o.dead||o===e||(o.deadT||0)>25||o.m?.root?.userData?.reclaimed372)continue;const d=Math.hypot(o.x-e.x,o.z-e.z);if(d<bd){bd=d;best=o}}
 if(!best)return false;const P=profileOf(e.kind);if(e.aggro&&!S.eating)win('O '+(P?.book?.[0]||BOOK410.magote[0])+' trocou você pelos restos da luta.',P?.base||'magote','carnica');S.eating=1;e.aggro=false;e.act=null;
 if(bd>1.4){walk(e,best.x,best.z,dt,1);pose(e,1,dt)}else{turnTo(e,Math.atan2(best.x-e.x,best.z-e.z),dt,4);pose(e,0,dt,.5)}return true}
/* ---------- rendição ---------- */
function surrStep(e,S,dt,pd){S.surr.t+=dt;e.act=null;e.aggro=false;pose(e,0,dt,.9);if(pd>22){S.surr=null;S.surrDone=1;S.calm=T()+30}return true}
function accept(e){const S=st(e);if(!S.surr||e.dead)return;S.surr=null;S.surrDone=1;S.accepted=1;const P=profileOf(e.kind);
 try{fxBurst(e.x,1,e.z,0xffd76a,18,4)}catch(_){}
 killEnemy(e);try{e.m.root.userData.reclaimed372=true}catch(_){}
 win('O '+(P?.book?.[0]||e.name)+' reconheceu sua vitória e entregou o tributo. Sem carcaça para a Mão do Arquiteto.',P?.base,'rendicao')}
function surrTarget(){if(!player||player.dead)return null;let best=null,bd=4;for(const e of enemies){if(e.dead||!e.eco410?.surr)continue;const d=Math.hypot(e.x-player.x,e.z-player.z);if(d<bd){bd=d;best=e}}return best}
/* ---------- reações ---------- */
function onHurt(e,P,S){
 if(P.base==='yeti')for(const y of near(e,['yetinho'],16)){st(y).provoked=1;wake(y)}
 if(P.base==='yetinho')for(const a of near(e,['yeti'],16)){st(a).fury=T()+12;wake(a);floater(a.x,a.z,'FÚRIA!','#ff7a5a',true,2)}
 if(P.alert){const o=near(e,P.alert,18,x=>!x.aggro);o.forEach(wake)}
 if(P.herd)for(const o of near(e,P.herd,15)){st(o).provoked=1;wake(o)}
 if(P.shy||P.stare||P.playful)S.provoked=1;
}
function onAggro(e,P){
 if(P.call){const o=near(e,P.call,P.base==='caveira'?20:22,x=>!x.aggro);o.forEach(wake)}
}
function gated(e,P,S,v,pd,dt){
 if(S.awake||e.aggro)return false;
 if(S.calm>T())return pd>2.5; // depois de fugir ou desistir, só volta se você chegar colado
 if(v)return false; // Fendida/Abissal: agressiva com quem carrega mana
 if(P.near)return pd>P.near;
 if(P.dormant)return true;
 if(P.playful){if(S.provoked)return false;if(pd<4.5&&!player?.sheathed441&&player?.atkCd>0){S.provoked=1;e.aggro=true;return false}return true}
 if(P.shy){if(S.provoked)return false;if(pd<11){S.flee=T()+4;return 'flee'}return true}
 if(P.stare){if(S.provoked)return false;const a=Math.atan2(e.x-player.x,e.z-player.z),df=Math.abs(Math.atan2(Math.sin(a-player.face),Math.cos(a-player.face)));if(pd<7&&df<.4){S.stareT=(S.stareT||0)+dt;if(S.stareT>1.2){e.aggro=true;return false}}else S.stareT=Math.max(0,(S.stareT||0)-dt);return true}
 if(P.light){const r=night()?16:7;if(pd<r&&los(e.x,e.z,player.x,player.z)){e.aggro=true;return false}return true}
 if(P.weak&&player.hp<player.maxhp*P.weak)return true;
 if(P.leaderless&&!near(e,P.leaderless,15).length&&!enemies.some(o=>o.isBoss&&!o.dead&&Math.hypot(o.x-e.x,o.z-e.z)<15))return pd>4.5;
 return false}
function inWaterAt(x,z){try{return typeof inWater244==='function'&&inWater244(x,z)}catch(_){return false}}
function escape(e,P,S,pd,dt){
 if(L.mode!=='world'||!e.aggro||P.esc?.none)return false;const E=P.esc||{},k=variant(e)?1.4:1;let why=null;
 if(E.home&&Math.hypot(player.x-S.home.x,player.z-S.home.z)>E.home*k)why='saiu do território';
 if(E.far&&pd>E.far*k)why='abriu distância';
 if(E.los){if(los(e.x,e.z,player.x,player.z))S.blind=0;else{S.blind=(S.blind||0)+dt;if(S.blind>E.los&&pd>9)why='quebrou a linha de visão'}}
 if(P.water&&!inWaterAt(e.x,e.z)&&pd>8&&inWaterAt(S.home.x,S.home.z))why='saiu da água';
 if(!why)return false;
 e.aggro=false;e.act=null;S.awake=false;S.giveup=T()+8;S.blind=0;win('Você '+why+': '+(P.book?.[0]||e.name)+' desistiu.',P.base,'escape');return true}
function mods(e,P,S){
 if(S.spd0==null)S.spd0=e.speed;if(S.dmg0==null)S.dmg0=e.dmg;let sm=1,dm=1;
 if(S.fury>T()){sm*=1.35;dm*=1.3}
 if(P.water&&L.mode==='world'&&inWaterAt(S.home.x,S.home.z)&&!inWaterAt(e.x,e.z))sm*=P.water;
 e.speed=S.spd0*sm;e.dmg=S.dmg0*dm}
function beforeAI(e,dt){
 if(e.ally||e.friendly217||e.dead||!player)return false;
 if(e.isBoss){if(e.aggro&&!e.eco410boss){e.eco410boss=1;const B=bossProfile(e.name);if(B)tactic(e,B)}return false}
 const P=profileOf(e.kind);if(!P)return false;const S=st(e),v=variant(e),pd=Math.hypot(player.x-e.x,player.z-e.z);
 const hit=e.hp<S.hp-1e-6;S.hp=e.hp;
 if(hit){S.calm=0;S.giveup=0;S.awake=true;onHurt(e,P,S);if(S.surr){S.surr=null;S.surrDone=1}}
 mods(e,P,S);
 if(P.dawn&&L.mode==='world'&&!e.aggro){const p=dayP();if(p>.22&&p<.26){try{fxBurst(e.x,1,e.z,0xd8e6ff,12,3)}catch(_){}e.noExpLoot=true;killEnemy(e);e.m.root.userData.reclaimed372=true;return true}}
 if(S.surr)return surrStep(e,S,dt,pd);
 if(S.flee>T()){fleeStep(e,S,dt);return true}
 if(lureStep(e,P,S,dt))return true;
 if((P.carrion||foodLures.length)&&carrionStep(e,S,dt,pd))return true;S.eating=0;
 if(P.own){if(e.aggro&&!S.tip&&pd<16){S.tip=1;tactic(e,P)}return false}
 if(story(e)&&!e.yetiPack441&&!e.honor456)return false;
 // moral: ficou sozinho
 if(P.lone&&v!=='a'){const n=near(e,P.lone,14).length;S.peers0=Math.max(S.peers0,n);if(S.peers0>0&&n===0&&e.aggro&&(!P.loneHp||e.hp<e.maxhp*P.loneHp)&&!S.loneDone){S.loneDone=1;if(panic(e,'PÂNICO!')){win('O '+(P.book?.[0]||e.name)+' ficou sem o bando e fugiu.',P.base,'sozinho');return true}}}
 if(S.giveup>T()){if(pd<2.5)S.giveup=0;else{const m=walk(e,S.home.x,S.home.z,dt,.8);pose(e,m?1:0,dt);return true}}
 const g=gated(e,P,S,v,pd,dt);
 if(g==='flee'){fleeStep(e,S,dt);return true}
 if(g){e.aggro=false;e.act=null;
  if(P.leaderless||P.playful){if(Math.random()<dt*.6)e.face+=(Math.random()-.5)*1.6;const nx=e.x+Math.sin(e.face)*e.speed*.25*dt,nz=e.z+Math.cos(e.face)*e.speed*.25*dt;if(freeAt(nx,nz,e.r||.5))moveEnt(e,nx-e.x,nz-e.z);else e.face+=1.2;pose(e,.4,dt)}else pose(e,0,dt);return true}
 if(!S.awake&&(P.near||P.dormant||P.stare||P.playful||P.light||P.shy)&&e.aggro){
  if(P.playful&&player?.sheathed441&&!S.provoked){e.aggro=false;e.act=null;pose(e,.3,dt);return true}
  S.awake=true;
 }
 if(escape(e,P,S,pd,dt))return true;
 // honra: rendição com pouca vida
 if((P.honor||e.honor456)&&v!=='a'&&!S.surrDone&&e.hp>0&&e.hp<=e.maxhp*(e.honor456?.25:.15)&&pd<14){S.surr={t:0};e.act=null;e.aggro=false;floater(e.x,e.z,'SE RENDEU','#ffd76a',true,2.6);if(once('tip:rendicao')||e.honor456)showTip('<b>'+(P.book?.[0]||e.name)+'</b> reconheceu sua força e se rendeu. <b>F</b> para aceitar a rendição.',6000);return true}
 if(P.weak&&e.aggro&&player.hp<player.maxhp*P.weak){e.aggro=false;S.awake=false;return true}
 if(P.observe&&e.aggro){if(S.obs==null)S.obs=P.observe;if(S.obs>0){S.obs-=dt;e.act=null;turnTo(e,Math.atan2(player.x-e.x,player.z-e.z),dt,4);pose(e,0,dt);return true}}else if(!e.aggro)S.obs=null;
 if(e.aggro&&!S.was){S.was=1;onAggro(e,P);if(pd<16)tactic(e,P)}else if(!e.aggro)S.was=0;
 return false}
function onKill(e){
 if(!e||e.ally)return;const b=base(e.kind);if(e.eco410?.accepted)return;
 const followers=Object.keys(P410).filter(k=>P410[k].leader?.includes(b));let n=0;
 for(const k of followers)for(const o of near(e,[k],24)){o.camp327=null;if(panic(o,'PÂNICO!'))n++}
 if(b==='yeti'||e.yetiAlpha441){for(const o of near(e,['yetinho','yeti'],26))if(o!==e&&!o.yetiAlpha441){o.camp327=null;if(panic(o,'FUGA DO BANDO!'))n++}}
 if(n)win('Sem o '+(BOOK410[b]?.[0]||e.name)+', os menores entraram em pânico e fugiram.',b,'lider');
}
function toggleSheath(force){
 if(!player)return false;
 player.sheathed441=force!=null?!!force:!player.sheathed441;
 try{if(player.m?.wep)player.m.wep.visible=!player.sheathed441}catch(_){}
 toast(player.sheathed441?'<b>[POSTURA]</b> Arma guardada: Filhotes de Yeti (#013) e criaturas neutras do Povo do Manto Branco não se sentem ameaçados.':'<b>[POSTURA]</b> Arma empunhada.',3500);
 return player.sheathed441;
}
function used(b){const w=mem().won,l=Object.keys(w).filter(k=>k.startsWith(b+':')).map(k=>w[k]);return l.length?'<br><b>Você já usou:</b> '+l.join(' '):''}
/* ---------- integração ---------- */
function install(){
 if(typeof killEnemy==='function'&&!killEnemy.eco410){const k0=killEnemy;killEnemy=function(e){const was=e&&!e.dead;const r=k0.apply(this,arguments);try{if(was&&e.dead)onKill(e)}catch(err){console.warn('eco410',err)}return r};killEnemy.eco410=1}
 if(typeof attack==='function'&&!attack.sheath441){const a0=attack;attack=function(){try{if(player?.sheathed441){player.sheathed441=false;if(player.m?.wep)player.m.wep.visible=true}}catch(_){}return a0.apply(this,arguments)};attack.sheath441=1}
 if(typeof ctxTarget==='function'&&!ctxTarget.eco410){const c0=ctxTarget;ctxTarget=function(){const b=c0.apply(this,arguments);try{if(!b){const e=surrTarget();if(e)return{label:'F · ACEITAR RENDIÇÃO',use:()=>accept(e)}}}catch(_){}return b};ctxTarget.eco410=1}
 if(typeof KEYACT!=='undefined'&&!KEYACT.some(k=>k[0]==='coin410'))KEYACT.push(['coin410','Jogar moeda brilhante','Digit7']);
 if(typeof KEYACT!=='undefined'&&!KEYACT.some(k=>k[0]==='sheath441'))KEYACT.push(['sheath441','Guardar / empunhar arma','KeyX']);
 addEventListener('keydown',ev=>{try{if(ev.repeat||!started||typeof keyOf!=='function')return;const tg=ev.target;if(tg&&/^(INPUT|TEXTAREA|SELECT)$/.test(tg.tagName))return;if(ev.code===keyOf('coin410'))throwCoin();else if(ev.code===(keyOf('sheath441')||'KeyX')&&!(typeof modalOpen!=='undefined'&&modalOpen))toggleSheath()}catch(_){}});
 if(window.Bestiary294&&!Bestiary294.loreHtml.eco410){const l0=Bestiary294.loreHtml;Bestiary294.loreHtml=function(k,n){let h=l0.apply(this,arguments);try{const P=profileOf(k);if(P&&n>0)h+='<br><span class="eco410-lore"><b>Reação:</b> '+P.how+' <i>('+P.f.map(f=>FAM410[f]).join(' · ')+')</i><br><b>Tática de sobrevivência:</b> '+P.book[1]+used(P.base)+'</span>'}catch(_){}return h};Bestiary294.loreHtml.eco410=1}
 let last=performance.now();(function tick(){const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;try{coinsTick(dt)}catch(_){}setTimeout(tick,16)})();
 const css=document.createElement('style');css.textContent='#eco410tip{position:fixed;left:50%;bottom:118px;transform:translate(-50%,8px);max-width:min(560px,92vw);padding:8px 14px;border-radius:10px;background:rgba(14,26,22,.88);border:1px solid rgba(214,180,104,.55);color:#e8e2cc;font:13px/1.35 system-ui,sans-serif;opacity:0;pointer-events:none;transition:opacity .35s,transform .35s;z-index:40;text-align:center}#eco410tip.on{opacity:1;transform:translate(-50%,0)}#eco410tip b{color:#ffd76a}#eco410tip b.ok{color:#9fe8a8}#eco410tip small{display:block;opacity:.75;margin-top:3px}.eco410-lore{display:inline-block;margin-top:4px}';document.head.appendChild(css);
}
const api={beforeAI,profileOf,bossProfile,coverage,throwCoin,dropLure,throwBait,foodLures,toggleSheath,accept,P410,FAM410,BOOK410,BOSSBOOK410,INEDITAS456,coins,st,panic};
if(typeof window!=='undefined'){window.Eco410=api;if(typeof document!=='undefined'&&typeof KINDS!=='undefined')install()}
if(typeof module!=='undefined')module.exports=api;
})();
