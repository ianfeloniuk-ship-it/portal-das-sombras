/* v294 (Ian): Bestiário como uma Pokédex.
   - Ao DERROTAR uma espécie pela primeira vez aparece, no canto, "Monstro descoberto · N de 61".
   - A lore abre com os abates: 1 descrição · 10 alimentação · 50 comportamento · 100 habitat. */
(function(){
const LORE294={
 slime:['Bolha rosada e elástica que se move aos pulinhos.','Absorve frutas caídas, musgo e restos deixados por viajantes.','Inofensivo sozinho; em grupo, cerca a presa e a sufoca devagar.'],
 gosma:['Massa verde e pegajosa que borbulha quando irritada.','Dissolve folhas podres e pequenos insetos do pântano.','Se divide quando apanha demais; os pedaços voltam a se juntar à noite.'],
 cogu:['Cogumelo pequeno com pernas curtas e olhos curiosos.','Suga a umidade do chão e a luz fraca da floresta.','Foge correndo; quando encurralado, solta esporos que dão sono.'],
 passaro:['Ave de penas eriçadas e bico afiado como faca.','Caça insetos grandes e rouba ovos de outros ninhos.','Defende o território com mergulhos rápidos; nunca ataca de frente.'],
 espinhosa:['Gosma coberta de espinhos de cristal.','Engole pedras e cristais pequenos para formar os espinhos.','Dispara espinhos quando sente vibração; fica parada esperando.'],
 escaravelho:['Besouro do tamanho de um cavalo, com carapaça de bronze.','Rumina raízes secas e cascas de cacto.','Anda em linha reta pelas dunas; investe contra tudo que brilha.'],
 guardiao:['Antigo protetor de pedra tomado por uma energia estranha.','Não come. Absorve a mana que vaza das fendas.','Fica imóvel até alguém cruzar o espaço que ele vigiava em vida.'],
 cactinho:['Cacto pequeno que anda e cospe espinhos.','Bebe o orvalho da madrugada e guarda água por semanas.','Enterra as raízes de dia e só se move no fim da tarde.'],
 magote:['Larva gorda que se arrasta pelos túneis das fendas.','Come restos de monstros derrotados.','Segue o cheiro de batalha; aparece depois que a luta termina.'],
 orcinho:['Orc jovem, mais barulhento do que perigoso.','Carne assada, de preferência roubada.','Ataca para impressionar os mais velhos; foge se ficar sozinho.'],
 ninjinha:['Aprendiz de ninja das fendas, pequeno e veloz.','Arroz seco e frutas que carrega numa bolsinha.','Some e reaparece atrás do alvo; treina em pares.'],
 visitante:['Criatura de outro mundo, de pele lisa e olhos vazios.','Ninguém sabe. Os visitantes nunca foram vistos comendo.','Observa por muito tempo antes de agir; parece estudar os humanos.'],
 yetinho:['Filhote de yeti, todo pelo branco e bochechas rosadas.','Liquens congelados e peixes que caem do gelo.','Brinca até ver um adulto ser atacado; aí vira uma fera.'],
 peixinho:['Peixe que aprendeu a andar com nadadeiras fortes.','Girinos, algas e o que achar nas poças do pântano.','Sai da água em bandos nas noites de chuva.'],
 fantasma:['Alma presa entre o mundo e a fenda.','Alimenta-se do medo dos vivos.','Atravessa paredes e repete os últimos gestos que fez em vida.'],
 abelha:['Abelha do tamanho de um cão, com placas de quitina.','Néctar das flores gigantes dos campos floridos.','Patrulha as flores perto da colmeia; avisa as outras com um zumbido grave.'],
 glub:['Bolha d\'água com olhos e humor imprevisível.','Bebe orvalho e minerais dissolvidos.','Explode em respingos quando assustado e se reconstrói depois.'],
 golenzinho:['Golem pequeno de pedra e cristal.','Mastiga cristais de mana como se fossem doces.','Segue golens maiores e imita tudo o que eles fazem.'],
 cogufuria:['Cogumelo vermelho que vive irritado.','Raízes podres e a seiva das árvores mortas.','Ataca qualquer coisa que pise na sua sombra.'],
 sapo:['Sapo guerreiro com escudo de casca de árvore.','Insetos, cobras pequenas e peixes do pântano.','Luta pelo melhor lugar do brejo; respeita quem o vence.'],
 coelho:['Coelho de olhos vermelhos e dentes afiados.','Raízes doces e, às vezes, carne.','Parece inofensivo até alguém se aproximar demais.'],
 caveira:['Crânio flutuante envolto em chama fria.','A energia que resta nos ossos dos caídos.','Persegue luzes e faz barulho para atrair outros mortos.'],
 redemoinho:['Vento vivo que gira com folhas e poeira.','Consome o calor do ar.','Nasce onde duas fendas se cruzam e se desfaz ao amanhecer.'],
 mono:['Macaco travesso das ruínas.','Frutas, ovos e qualquer coisa brilhante.','Rouba itens e os esconde em ninhos no alto das ruínas.'],
 ninja:['Ninja das sombras, mestre do clã das fendas.','Come pouco: pílulas de ervas e água.','Ataca uma vez, some e espera o próximo erro do alvo.'],
 cactogig:['Cacto gigante, mais velho que as cidades.','Guarda água por anos; vive de tempestades raras.','Lento e paciente; esmaga quem tenta tirar sua água.'],
 homempeixe:['Guerreiro do povo das águas escuras.','Peixes grandes e caranguejos.','Defende as lagoas sagradas; usa lanças de osso de peixe.'],
 alpaca:['Alpaca real de pelagem dourada.','Capim alto e flores dos campos.','Cospe em quem a encara; vive em pequenos rebanhos.'],
 abelharainha:['Rainha das abelhas blindadas, com coroa de quitina.','Geleia real produzida pela colmeia inteira.','Nunca sai sozinha; ordena ataques com um som que faz o ar tremer.'],
 glubancio:['Glub ancião, uma lagoa inteira com olhos.','Absorve rios pequenos.','Fica parado por séculos; quando acorda, inunda tudo ao redor.'],
 golempedra:['Golem de pedra maciça com veios de cristal.','Engole rochas ricas em mana.','Protege as cavernas de cristal; só reage a quem tira cristais de lá.'],
 lula:['Lula do vazio que flutua no ar como se fosse água.','Engole luz e som.','Envolve a presa em silêncio absoluto antes de atacar.'],
 invasor:['Soldado de outro mundo com armadura estranha.','Rações que trouxe de onde veio.','Marcha em linha e segue ordens que ninguém daqui escuta.'],
 dino:['Réptil antigo das terras vulcânicas.','Carne de outros répteis e ovos.','Caça em pares; um distrai enquanto o outro ataca.'],
 diabrete:['Diabinho de fogo, sempre rindo.','Brasas e enxofre.','Prega peças em viajantes e chama os demônios maiores.'],
 tribal:['Máscara tribal possuída que flutua.','A fé de quem a esculpiu.','Dança em círculos e amaldiçoa quem interrompe o ritual.'],
 alpacaimp:['Alpaca imperial com pelagem que brilha como ouro.','Flores raras que só nascem nos campos floridos.','Muito rara. Foge de tudo e só luta quando o rebanho é ameaçado.'],
 chifrudo:['Demônio de chifres longos e pele de brasa.','Almas de criaturas derrotadas perto dele.','Desafia os mais fortes; ignora presas fracas.'],
 reicogu:['Rei dos cogumelos, com uma coroa de fungos.','O solo inteiro da floresta onde reina.','Faz brotar cogumelos ao redor e comanda todos eles.'],
 dragonete:['Dragão jovem, do tamanho de um lobo.','Carne assada pelo próprio fogo.','Testa a força soprando fogo em tudo; aprende rápido.'],
 dragaoancio:['Dragão ancião, uma lenda das montanhas de fogo.','Pedras de lava e tesouros derretidos.','Dorme por décadas sobre o ouro; acordá-lo é a pior ideia possível.'],
 minion:['Esqueleto comum, erguido por magia das fendas.','Não come; move-se pela magia que o ergueu.','Obedece ao mais forte por perto; sem ordens, vaga sem rumo.'],
 mage:['Esqueleto que ainda lembra feitiços.','A mana do ar ao redor.','Mantém distância e lança magia de trás dos outros mortos.'],
 warrior:['Esqueleto guarda com escudo e espada enferrujados.','Nada. Só a magia que o mantém de pé.','Protege portas e passagens até ser destruído.'],
 golem:['Golem feito de mana pura condensada.','Cristais de mana e a energia das fendas.','Fica mais forte perto de cristais; os magos antigos os usavam como guardas.'],
 wraith:['Espectro de alguém que morreu com raiva.','A vida de quem toca.','Caça sem descanso a mesma pessoa que lembra da vida passada.'],
 demon:['Demônio das profundezas da fenda.','Medo, dor e fogo.','Abre caminho para outros demônios; onde ele passa, a terra queima.'],
 goblin:['Goblin guerreiro com arma improvisada.','Tudo que conseguir roubar.','Ataca em bando e grita para parecer maior.'],
 gobShield118:['Goblin escudeiro que protege os outros.','Restos dos banquetes do bando.','Fica na frente do grupo e bloqueia golpes enquanto os outros atacam.'],
 gobArcher118:['Goblin arqueiro de mira surpreendente.','Pássaros e pequenos animais que caça.','Atira de longe e foge quando o alvo se aproxima.'],
 gobShaman118:['Goblin xamã que fala com espíritos.','Ervas, cogumelos e poções fedorentas.','Cura os outros goblins e amaldiçoa quem os fere.'],
 gobBrute118:['Goblin bruto, o maior e mais forte do bando.','Carne em quantidade absurda.','Esmaga primeiro e pensa depois; os outros goblins o temem.'],
 lobo:['Lobo sombrio de pelo escuro e olhos de brasa.','Caça cervos, coelhos e viajantes distraídos.','Anda em matilha; cerca a presa antes de atacar.'],
 aranha:['Aranha gigante de pernas peludas.','Insetos, pássaros e qualquer coisa presa na teia.','Monta teias entre as árvores e espera; prende a presa com fios grossos.'],
 vespa:['Vespa rainha de ferrão venenoso.','Néctar e outros insetos.','Ataca em mergulhos rápidos e foge para o alto.'],
 orc:['Orc adulto, guerreiro de clã.','Carne de caça e cerveja forte.','Luta por honra e respeita quem o vence em duelo justo.'],
 yeti:['Yeti adulto, gigante de pelo branco.','Peixes do gelo, liquens e, quando falta, viajantes.','Protege os filhotes com fúria; ruge para provocar avalanches.'],
 gigante:['Gigante de pedra das cavernas de cristal.','Rochas inteiras.','Dorme encostado nas paredes; parece parte da montanha até se mexer.'],
 raptor:['Raptor veloz das terras vulcânicas.','Carne fresca; caça qualquer coisa que corra.','Persegue a presa em zigue-zague e ataca pelos flancos.'],
 dragao:['Dracônico, meio homem, meio dragão.','Carne e ouro derretido.','Guerreiro orgulhoso; desafia caçadores para provar seu valor.'],
 rogue:['Esqueleto ladino com adagas gêmeas.','Nada. Só a magia que o ergueu.','Ataca pelas costas e foge pelas sombras.']
};
const STEPS294=[[1,'Descrição'],[10,'Alimentação'],[50,'Comportamento'],[100,'Onde vive']];
function habitat294(k){try{const out=[];const NB={campos:'Campos',flores:'Campos floridos',floresta:'Floresta',deserto:'Deserto',vulcao:'Vulcão',neve:'Neve',cristal:'Cavernas de cristal',pantano:'Pântano'};for(const b in HABITATS124){for(let g=0;g<10;g++){if(kindsFor(g,b).some(x=>x.k===k)){out.push(NB[b]||b);break}}}return out.length?out.join(', '):'Só dentro das Fendas (portais)'}catch(_){return 'Desconhecido'}}
function seen(){return Object.fromEntries(Object.entries(profile.bestiary||{}).filter(([k,n])=>n>0&&KINDS[k]).map(([k])=>[k,1]))}
function corner(title,body,col){let box=document.getElementById('ach294');if(!box){box=document.createElement('div');box.id='ach294';box.style.cssText='position:fixed;right:14px;bottom:170px;z-index:61;display:flex;flex-direction:column;gap:6px;align-items:flex-end;pointer-events:none';document.body.appendChild(box)}
 const d=document.createElement('div');d.style.cssText='background:rgba(14,12,22,.9);border:1px solid '+(col||'#ffd54f')+';border-left:4px solid '+(col||'#ffd54f')+';border-radius:6px;padding:6px 12px;color:#f4ead8;font-size:16px;line-height:1.5;max-width:min(380px,88vw);box-shadow:0 3px 10px rgba(0,0,0,.45);transform:translateX(30px);opacity:0;transition:all .35s';d.innerHTML='<div style="font-size:14px;letter-spacing:.08em;color:'+(col||'#ffd54f')+';font-weight:700">'+title+'</div>'+body;box.appendChild(d);requestAnimationFrame(()=>{d.style.opacity='1';d.style.transform='none'});while(box.children.length>3)box.firstChild.remove();setTimeout(()=>{d.style.opacity='0';setTimeout(()=>d.remove(),400)},6500)}
function total(){return Object.keys(KINDS).filter(k=>!KINDS[k].alias308).length}
/* lore por abates: avisa quando um novo trecho abre */
function loreCheck(k,before,after){if(before===0&&after>0){corner('MONSTRO DESCOBERTO','<b>'+KINDS[k].n+'</b> · '+Object.keys(seen()).filter(k=>!KINDS[k].alias308).length+' de '+total()+'<br>Primeiro abate registrado no Bestiário.');sfx('level')}for(const [n,lbl] of STEPS294)if(before<n&&after>=n&&n>1)corner('LORE DESBLOQUEADA','<b>'+KINDS[k].n+'</b> · '+lbl+'<br><span style="opacity:.75">'+(n===100?habitat294(k):LORE294[k]?LORE294[k][n===10?1:2]:'')+'</span>','#9fd0ff')}
function loreHtml(k,n){const L=LORE294[k]||['Criatura pouco estudada.','Desconhecido.','Desconhecido.'];let h='';STEPS294.forEach(([need,lbl],i)=>{const txt=i<3?L[i]:habitat294(k);h+='<br><span style="color:'+(n>=need?'var(--txt,#f4ead8)':'var(--dim)')+'">'+(n>=need?'<b>'+lbl+':</b> '+txt:'🔒 '+lbl+' · '+need+(need===1?' abate':' abates'))+'</span>'});return h}
window.Bestiary294={LORE:LORE294,seen,loreCheck,loreHtml,habitat:habitat294,total,corner};
})();
