/* ================= ITENS ================= */
const WEAPON_LOOT_KINDS=['sword','dagger','axe','staff','bow','wand','tome','bonestaff','spear'];
function makeItem(slot,tier,rar,kindOverride){
  const R=RAR[rar];const kind=slot==='w'?(kindOverride||WEAPON_LOOT_KINDS[Math.floor(Math.random()*WEAPON_LOOT_KINDS.length)]):null;const wn={sword:'Espada',dagger:'Adagas',axe:'Machado',staff:'Cajado',bow:'Arco',wand:'Maça Sacra',tome:'Grimório',bonestaff:'Cajado de Osso',spear:'Lança',firearm:'Pistola da Escama'}[kind]||'Arma';
  const visual=slot==='w'&&window.Warrior127&&Warrior127.visualWeapon?Warrior127.visualWeapon(tier,kind):undefined;
  return {slot,tier,rar,...(slot==='w'?{kind155:kind}:{}),name:(slot==='w'?wn:EQUIP_LABEL[slot])+' '+TIERN[tier],v2:1,value:equipmentBaseValueBalance(tier,slot,rar),uid:Math.random().toString(36).slice(2,9),aff:[],...(visual?{visual}: {})};
}
/* v153 (pedido do Ian): sets das classes raras. Peças separadas (cabeça, peito, braços, pernas, arma) que qualquer personagem equipa;
   o bônus só desperta na classe dona do set. Ficam em Fendas de Vestígio, portais raros que surgem ao acaso. */
const SETS153={metamorfo:{cls:15,n:'Pele do Metamorfo',family:'rare_metamorfo',biome:'floresta',col:'#9fe07a',
  lore:'Este portal não leva a um mundo qualquer: é o vestígio de onde um Metamorfo caiu. A pele dele se partiu e os pedaços ainda respiram entre lobos e dragões.',
  pieces:{h:{n:'Elmo do Instinto',d:'Formas atacam 10% mais rápido.'},a:{n:'Couraça Mutável',d:'Na Forma Blindada você recebe 15% menos dano.'},g:{n:'Braçais das Garras Vivas',d:'Golpes em forma envenenam: 40% do dano em 3 s.'},b:{n:'Grevas do Predador',d:'+12% de velocidade em qualquer forma.'},w:{n:'Garras do Metamorfo',d:'+15% de dano das formas.'}},
  full:{n:'Fúria Primordial',d:'Trocar de forma dá 4 s de +30% de dano e cura 5% da vida.'}}};
/* v155 (Ian): cada uma das 10 classes raras tem portal próprio, criaturas do tema e um set de 5 peças.
   Peças das 9 classes novas: +6% de dano e +6% de vida cada (só na classe dona); set completo: +15% de ambos. */
const RARE_SETS155=[
 ['necromante',7,'Mortalha do Necromante','#b98cff','Cripta do Lich','Lich da Cripta',['minion','warrior','rogue','mage','fantasma','caveira','wraith'],'mage','Um necromante foi enterrado aqui e não aceitou. Esqueletos e fantasmas guardam o que restou da mortalha dele.',['Capuz da Cripta','Manto Fúnebre','Luvas do Ossuário','Botas do Sepulcro','Cajado de Ossos']],
 ['tempo',12,'Relógio do Mago do Tempo','#8fe8ff','Salão dos Instantes','Guardião do Instante',['redemoinho','invasor','guardiao','lula'],'guardiao','O tempo aqui anda em círculos. Algo parou no meio de um passo e ficou.',['Coroa da Hora','Túnica Suspensa','Luvas do Ponteiro','Sandálias do Atraso','Astrolábio Partido']],
 ['tecelao',13,'Fios do Tecelão de Fendas','#c2a2ff','Tear da Fenda','Fiandeira do Vazio',['visitante','invasor','lula','wraith'],'lula','Fios brilhantes atravessam as paredes. Quem costurou esta passagem ainda puxa a linha.',['Véu do Tecelão','Manto Costurado','Luvas do Fio','Botas da Passagem','Lâmina de Linha']],
 ['guardiao',14,'Juramento do Guardião','#ffdb86','Bastião dos Vínculos','Colosso Juramentado',['golenzinho','golempedra','guardiao','gigante'],'gigante','Muralhas que se movem protegem um juramento que ninguém mais lembra.',['Elmo do Juramento','Couraça do Bastião','Manoplas do Vínculo','Grevas da Âncora','Escudo Juramentado']],
 ['metamorfo',15],
 ['artifice',16,'Engrenagens do Artífice Rúnico','#ffb36b','Oficina Rúnica','Autômato Mestre',['golenzinho','tribal','golempedra'],'golempedra','Runas acesas por todo lado. As máquinas daqui ainda obedecem ao dono que sumiu.',['Óculos Rúnicos','Avental Blindado','Luvas de Forja','Botas de Engrenagem','Martelo Rúnico']],
 ['duelista',17,'Lâmina do Duelista Espectral','#9fc8ff','Arena dos Reflexos','Duelista sem Rosto',['ninjinha','ninja','rogue','wraith'],'ninja','Cada sombra aqui é um oponente. O melhor deles ainda espera o próximo duelo.',['Máscara Espectral','Gibão do Duelo','Luvas da Guarda','Botas do Passo','Florete Espectral']],
 ['condutor',18,'Para-raios do Condutor','#7ad7ff','Pico das Tempestades','Senhor do Trovão',['passaro','vespa','redemoinho','glubancio'],'redemoinho','O ar estala. Uma tempestade presa entre paredes procura saída.',['Elmo Condutor','Peitoral de Cobre','Manoplas do Raio','Grevas do Vento','Lança da Tempestade']],
 ['oraculo',19,'Vestes do Oráculo','#e7d48a','Santuário dos Vestígios','Profeta Mascarado',['tribal','mono','fantasma','caveira'],'tribal','Máscaras sussurram o que vai acontecer. Uma delas fala mais alto que as outras.',['Máscara do Presságio','Vestes do Vestígio','Luvas da Leitura','Sandálias do Caminho','Relicário do Oráculo']],
 ['devorador',20,'Carapaça do Devorador','#a070ff','Abismo Faminto','Boca do Vazio',['lula','invasor','demon','chifrudo'],'lula','O escuro aqui tem fome. Tudo o que entra encolhe um pouco.',['Elmo Oco','Carapaça do Vazio','Manoplas Famintas','Grevas do Abismo','Manopla Devoradora']]
];
FAMILIES124.rare_metamorfo={label:'Feras do Metamorfo',name:'Covil do Metamorfo',ks:['lobo','raptor','dragonete','dino','dragaoancio'],chief:'dragaoancio',boss:'Metamorfo Primordial'};
for(const [id,cls,n,col,place,boss,ks,chief,lore,pc] of RARE_SETS155){if(id==='metamorfo')continue;
 FAMILIES124['rare_'+id]={label:n,name:place,ks,chief,boss};
 const owner=()=>CLASSES[cls]?.n||'dona do set';
 SETS153[id]={cls,n,family:'rare_'+id,biome:'campos',col,lore,generic155:true,
  pieces:Object.fromEntries(['h','a','g','b','w'].map((sl,i)=>[sl,{n:pc[i],d:'+6% de dano e +6% de vida.'}])),
  full:{n:'Despertar de '+n.split(' do ').pop().split(' das ').pop(),d:'+15% de dano e +15% de vida. Libera o teste de despertar.'}}}
function rareSetBonus155(){const out={dmg:0,hp:0};if(!run||!player)return out;for(const id in SETS153){const S=SETS153[id];if(!S.generic155||!setActive153(id))continue;const n=Math.min(5,setCount153(id));out.dmg+=.06*n+(n>=5?.15:0);out.hp+=.06*n+(n>=5?.15:0)}return out}
function rareGateChance155(rank){return .02+.48*Math.max(0,Math.min(9,rank))/9}
function rollRareGate155(g){if(g.rareRolled155||g.secret||g.inverse||g.custom||g.missionExtract117)return;g.rareRolled155=true;if(Math.random()>=rareGateChance155(g.rank))return;
 const id=RARE_SETS155[Math.floor(Math.random()*RARE_SETS155.length)][0],S=SETS153[id];
 Object.assign(g,{set153:id,family124:S.family,biome124:HABITATS124[g.biome124]?g.biome124:'campos',red:true,expType:'standard',layout103:null,double:false})}

function setActive153(id){const S=SETS153[id];return !!S&&!!player&&(rareActive103(S.cls)||profile.cls===S.cls)}
function setHas153(id,slot){return setActive153(id)&&equippedItems().some(it=>it.set153===id&&it.slot===slot)}
function setCount153(id){return equippedItems().filter(it=>it.set153===id).length}
function setFull153(id){return setActive153(id)&&setCount153(id)>=5}
function setPiece153(id,slot,tier){const S=SETS153[id],P=S.pieces[slot],it=makeItem(slot,tier,3,CLASSES[S.cls]?.wep||'sword');it.set153=id;it.aff=rollAff2(tier,3);it.name=P.n;it.value=Math.round(it.value*2.5);return it}
function setText153(it){const S=SETS153[it.set153];if(!S)return '';const n=setCount153(it.set153),on=setActive153(it.set153);
  return '<br>Conjunto '+S.n+' · '+n+'/5: '+S.pieces[it.slot].d+'<br>5 peças: '+S.full.d+(on?'':' (requer '+(CLASSES[S.cls]?.n||'dona do set')+')')}
function setDrop153(boss,x=player.x,z=player.z){const g=L.gate,id=g&&g.set153,S=SETS153[id];if(!S||!Object.prototype.hasOwnProperty.call(SETS153,id))return false;if(!boss&&Math.random()>=.3)return false;
  const pending=[...(run.worldLoot353||[]),...(L.corpseLoot353||[])].flatMap(r=>r.entries||[]).filter(e=>e.type==='equipment').map(e=>e.item);
  const owned=new Set([...run.items,...equippedItems(),...(profile.house?.chest||[]),...pending].filter(it=>it&&it.set153===id).map(it=>it.slot));
  const missing=EQUIP_SLOTS.filter(sl=>!owned.has(sl));
  const slot=pick(boss&&missing.length?missing:EQUIP_SLOTS);
  const it=setPiece153(id,slot,Math.max(0,Math.min(9,g.rank)));const reward={x,z,name:'Recompensa · '+S.n};corpseDrop353(reward,{type:'equipment',item:it});finishCorpse353(reward);floater(x,z,'PEÇA DE CONJUNTO',S.col,true);
  const a=awakening103();if(RARE_IDS111.includes(S.cls)&&!a.unlocked.includes(S.cls)&&!(a.points[S.cls]>0)){a.points[S.cls]=1;logNews('<b>[NARRADOR]</b> A peça vibra no seu corpo. Algo do '+(CLASSES[S.cls]?.n||'dono')+' tenta acordar em você.')}
  saveRun();return true}
function rollItem(tier,boss,depth=0,minRarity=0){tier=Math.max(0,Math.min(9,tier));depth=Math.max(0,Math.min(2,depth));const red=L.gate&&L.gate.red;const w=(boss?RARWB:RARW).slice();if(red){w[2]+=10;w[3]+=5;w[4]+=1}const woven=!!(L.gate&&L.gate.rareCreated103),wovenB=woven?(L.gate.woven153||.15):0;const rar=Math.min(RAR.length-1,Math.max(minRarity,woven?1:0,wpick(w.map((w,i)=>({i,w}))).i+depth+(woven?1:0)));const it=makeItem(pick(EQUIP_SLOTS),tier,rar);return it}
function dungeonEquipmentChance(e){if(L.mode!=='dungeon'||L.special||e.noExpLoot||e.rival||e.isBoss)return 0;const depth=dungeonFloorAt(e.z);return e.elite?.35+.1*depth:.08+.04*depth}
function dropDungeonEquipment(e){const chance=dungeonEquipmentChance(e);if(chance<=0||Math.random()>=chance)return false;return corpseDrop353(e,{type:'equipment',item:rollItem(e.gr??L.gate.rank,false,dungeonFloorAt(e.z))})}
function statTxt(it){normalizeGear363(it);return affTxt(it)+(it.slot==='w'?'+'+itemAtk(it)+' de ataque'+(weaponIsMagic173(it)?' mágico':' físico'):'+'+itemSh(it)+' de escudo')+(it.curse?' · MALDIÇÃO: '+it.curse.n+' ('+it.curse.d+')':'')+(it.set153?setText153(it):'')+(it.unique183&&UNIQ183[it.unique183]?' · <b style="color:#ff3d1e">ÚNICO:</b> '+UNIQ183[it.unique183].d:'')+(it.woven153?' · Tecido: +'+Math.round((it.woven153===1?.15:it.woven153)*100)+'% de ataque/escudo (incluído)':'')+(it.depth105?' · Andar '+(it.depth105+1)+': +'+(it.depth105*25)+'% de ataque/escudo (incluído)':'')+gearRuneText(it)}
function addItem(it){
  if(run.items.length>=bagCapacity353()){const value=equipmentSaleValueBalance(it);run.gold+=value;if(window.Econ154)Econ154.noteMarketSale('equipment',value);toast('<b>[NARRADOR]</b> Bolsa cheia. '+it.name+' convertido por '+fmt(value)+' ouro.');return false}
  run.items.push(it);toast('<b>[NARRADOR]</b> Item na bolsa: <b style="color:'+RAR[it.rar].c+'">'+RAR[it.rar].n+' · '+it.name+'</b>. Abra a Bolsa para equipar.',3500);return true
}
function equipmentBagRoom(){if(run.items.length<bagCapacity353())return true;toast('<b>[NARRADOR]</b> Bolsa cheia. Libere um espaço antes de comprar ou forjar equipamentos.');return false}
/* v269 (Ian): o estoque de armas muda só a cada dia do jogo e a compra entrega o item mostrado (antes o tipo era sorteado de novo ao desenhar e ao comprar). */
function shopWeaponKind269(t){const c=nearestCity(player.x,player.z).c,day=Math.floor(dayT/DAYLEN),h=(Math.imul(day+1,73856093)^Math.imul(t+1,19349663)^Math.imul(Math.round((c?c.x:0)+31*(c?c.z:0))+7,83492791))>>>0;return window.Living372?Living372.weapon(h,biomeAt(player.x,player.z)):WEAPON_LOOT_KINDS[h%WEAPON_LOOT_KINDS.length]}
/* v290 (Ian): a arma da sua classe fica sempre à venda; as outras mudam por dia */
function classShopKind290(){const k=CLASSES[profile.cls]?.wep;return WEAPON_LOOT_KINDS.includes(k)?k:null}
function shopKinds290(t){return [...new Set([classShopKind290(),shopWeaponKind269(t)].filter(Boolean))]}
function buyEquipment(sl,t,k){if(!EQUIP_SLOTS.includes(sl)||!Number.isInteger(t)||t<0||t>9||!PRICE[t])return false;const pp=equipmentShopPrice(sl,t);if(run.gold<pp||!equipmentBagRoom())return false;const it=makeItem(sl,t,0,sl==='w'?(shopKinds290(t).includes(k)?k:shopWeaponKind269(t)):undefined);run.gold-=pp;if(window.Econ154)Econ154.notePurchase(pp);it.purchasePaidBalance=pp;if(profile.firstEquipment92&&!profile.firstEquipment92.done)it.firstPurchase92=true;addItem(it);narratorEvent105('buy');return true}
function equipBagItem(uid){const i=run.items.findIndex(x=>x.uid===uid);if(i<0)return false;const it=run.items[i];if(!EQUIP_SLOTS.includes(it.slot))return false;if(it.slot==='w'&&!weaponFitsStyle259(it)){toast('Esta arma exige estilo '+(weaponIsMagic173(it)?'mágico':'físico')+'. Troque o estilo antes de equipar.');return false;}/* v280 (Ian): o bloqueio por estilo é regra do jogo — volta */run.items.splice(i,1);if(run.equip[it.slot])run.items.push(run.equip[it.slot]);run.equip[it.slot]=it;if(it.slot==='w'&&profile.classless&&window.Awaken396)Awaken396.byWeapon(it);finishFirstEquipment();refreshStats();saveRun();toast('<b>[NARRADOR]</b> Equipado: '+it.name);return true}

