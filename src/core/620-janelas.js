/* ================= JANELAS ================= */
function openModal(title,html,route=''){if(profile?.creationPending91&&started&&title!=='CRIAÇÃO DO PERSONAGEM')return;rememberCharacter118();const restoredScroll=enterModal118(title,route);$('mx').hidden=!!(profile?.creationPending91&&started);toggleGameMenu95(false);if(!modalOpen||$('mt').textContent!==title)$('modalNotice95').hidden=true;$('mt').textContent=title;$('mb').innerHTML=html;$('modal').hidden=false;modalOpen=true;paused=true;$('dlg').hidden=true;modalRoute118=route;if(route)CHAR_UI118.route=route;const scroll=restoredScroll,serial=MODAL_NAV118.serial;$('mback118').hidden=!!profile?.creationPending91||!(MODAL_NAV118.back.length||modalParent118());$('mb').scrollTop=scroll;requestAnimationFrame(()=>{if(modalOpen&&MODAL_NAV118.serial===serial)$('mb').scrollTop=scroll})}
function closeModal(){if(profile?.creationPending91&&started)return;rememberCharacter118();bindWait=null;modalRoute118='';MODAL_NAV118.current=null;MODAL_NAV118.back=[];MODAL_NAV118.serial++;$('modal').hidden=true;modalOpen=false;view=null;if(player&&!player.dead&&$('dead').hidden)paused=false}
function rerender(){if(view)view()}
const tipAttr154=t=>cap154(String(t??'').replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,'')).replace(/&/g,'&amp;').replace(/"/g,'&quot;');
const cap154=t=>String(t??'').replace(/^((?:<[^>]+>|\s)*)([a-zà-ú])/,(m,a,b)=>a+b.toUpperCase());
const row=(name,desc,btns)=>'<div class="it"><div class="d">'+cap154(name)+'<small>'+cap154(desc)+'</small></div><div class="acts">'+btns+'</div></div>';
const btn=(txt,a,v,en=true,cls='')=>'<button class="btn '+cls+'" data-a="'+a+'" data-v="'+v+'" '+(en?'':'disabled')+'>'+txt+'</button>';
/* GRIMÓRIOS: ensinam poderes de guardiões (vão para os espaços de poder absorvido, teclas 1–3). Caros de propósito. */
function bookList(){const pr=rankOf();const pool=[...BOSSES,...(pr>=5?BOSSES_HIGH:[])];const seen=new Set();const out=[];
  for(const b of pool){if(!b.skill||seen.has(b.skill.n))continue;seen.add(b.skill.n);out.push({sk:b.skill,price:servicePrice265('book',{high:BOSSES_HIGH.includes(b)})})}return out.slice(0,6)}
/* BIBLIOTECA DE PODERES: todo poder aprendido fica guardado; 3 ficam ativos nas teclas 1–3 (escolha na aba Poderes). */
function powLib(){const key=s=>s.n+'|'+(kitCanonical111(s)?'class':'power');run.lib=(run.lib||[]).filter((x,i,a)=>a.findIndex(y=>key(y)===key(x))===i);run.stolen=run.stolen.filter((x,i,a)=>a.findIndex(y=>key(y)===key(x))===i);for(const s of run.stolen)if(!run.lib.some(x=>key(x)===key(s)))run.lib.push({...s,cdT:0});return run.lib.filter(s=>!kitCanonical111(s))}
function learnPower(sk){const lib=powLib();
  /* Repetido: sobe 1 nível do poder (ideia do Irror); no máximo, vira 2 pontos de habilidade. */
  if(lib.some(x=>x.n===sk.n)){const l=run.skl[sk.n]||0;if(l<10){run.skl[sk.n]=l+1;toast('<b>[NARRADOR]</b> Você já conhecia <b>'+sk.n+'</b>: ele subiu para o <b>NV '+(l+1)+'</b>.',5000)}else{run.spts=(run.spts||0)+2;toast('<b>[NARRADOR]</b> <b>'+sk.n+'</b> já está no máximo: +2 pontos de habilidade.',5000)}sfx('level');return}
  lib.push({...sk,cdT:0});
  if(run.stolen.length<3&&!run.stolen.some(x=>x.n===sk.n)){run.stolen.push({...sk,cdT:0});buildSteal()}
  else toast('<b>[NARRADOR]</b> <b>'+sk.n+'</b> foi guardado na sua Biblioteca de Poderes. Troque os ativos em Bolsa → Poderes.',6000)}
function libRows(){const lib=powLib();let h='<div class="sec">BIBLIOTECA DE PODERES ('+lib.length+')</div><div class="sysline" style="font-size:12px">Todo poder que você absorve ou aprende fica guardado aqui. Só <b>3 ficam ativos</b> (teclas 1–3). Escolha qual vai em cada tecla.</div>';
  lib.forEach((sk,i)=>{const slot=run.stolen.findIndex(x=>x.n===sk.n);h+=row('<b>'+sk.n+'</b>'+(slot>=0?' <span style="color:#6fe39a">· ativo na tecla '+(slot+1)+'</span>':''),skillDesc(sk),[0,1,2].map(k=>btn(String(k+1),'powslot',i+':'+k,true,slot===k?'on165" data-tip154="Clique de novo para tirar da tecla '+(k+1):'')).join(''))});return h}
function sellMonsterLoot(){const gold=lootTotal();if(gold<=0)return false;run.loot={};run.gold+=gold;toast('<b>[MERCADO]</b> Espólios vendidos: +'+fmt(gold)+' ouro. Cristais e núcleos preservados.');beep(990,.15,.05);return true}
function mktView(){
  view=mktView;let h='<div class="sysline">Dorian: Núcleos e cristais de mana. Pago à vista. · Seu ouro: <b class="gold">'+fmt(run.gold)+'</b></div>';let any=false;h+=bagShop353();
  for(const [k,nm,P] of[['core','Núcleo mágico',CORE_P],['cry','Cristal de mana',CRY_P]])for(let r=0;r<10;r++){const n=run.res[k][r];if(!n)continue;any=true;h+=row(nm+' <span class="rl" style="color:'+RANKS[r].c+'">'+GR[r].id+'</span> × '+n,fmt(sellP(k,r))+' ouro cada ('+arrow(r)+') · total '+fmt(n*sellP(k,r)),btn('Vender estes '+n,'sellres',k+r))}
  {const lt=run.loot||{},ks=Object.keys(lt).filter(k=>lt[k].n);if(ks.length){any=true;h+='<div class="sec">ESPÓLIOS DE MONSTROS</div>';for(const k of ks)h+=row((lt[k].b?'<b style="color:#ffb84d">'+k+'</b>':k)+' × '+lt[k].n,fmt(lt[k].v)+' ouro cada','')}}
  if(!any)h+='<div class="it"><div class="d"><small>Você não tem recursos. Monstros deixam núcleos. Veios nas masmorras dão cristais.</small></div></div>';
  if(lootTotal()>0)h+='<div style="display:flex;justify-content:flex-end;margin-top:8px">'+btn('VENDER ESPÓLIOS · '+fmt(lootTotal())+' ouro','sellall',0,true,'hot')+'</div>';
  h+='<div class="sysline" style="font-size:12px;color:var(--dim)">Vender espólios preserva cristais e núcleos. Guarde os materiais que pretende usar na forja.</div>';
  h+='<div class="sec">COMPRAR CRISTAIS (PACOTE DE 10)</div><div class="sysline" style="font-size:12px">Dorian compra por 1x e vende por 3x o preço base. Só até o seu rank.</div>';
  for(let t=0;t<=Math.min(9,rankOf());t++){const p=crystalPurchasePriceBalance(t);h+=row('10 cristais <span class="rl" style="color:'+RANKS[t].c+'">'+GR[t].id+'</span>','Você tem '+run.res.cry[t],btn(fmt(p)+' ouro','buycry',t,run.gold>=p))}
  
  h+='<div class="sec">MONTARIA</div>'+row('Lobo de Mana','+80% de velocidade fora das masmorras',run.mount?'<b>Comprado</b>':btn(fmt(mountPrice265())+' ouro','buymount',0,run.gold>=mountPrice265()))+'<div class="sec">COMPANHEIRO</div>'+petRows();
  h+='<div class="sec">SERVIÇOS</div>'+row('Mapa do tesouro','Marca uma ruína distante com um tesouro lendário',unl('ruins')?btn(mapPrice265()?fmt(mapPrice265())+' ouro':'Sem mapa disponível','tmap',0,mapPrice265()>0&&run.gold>=mapPrice265()&&!run.tmap):lockMsg('ruins'))+row('Escoltar caravana','Leve uma caravana até a cidade mais próxima. Emboscadas no caminho.',unl('caravan')?btn('Aceitar','caravan',0,!L.car):lockMsg('caravan'));
  h+=(unl('fish')?cookRows():'')+affRow('Dorian');
  openModal('MERCADO DE RECURSOS',h);
}
function openShop(id){
  if(id==='defense')return defenseView();if(id==='guild')return guildView('quests');if(id==='mkt')return mktView();if(id==='bank')return bankView();
  view=()=>openShop(id);const S=SHOPS.find(s=>s.id===(id==='arm'?'wep':id));const pr=rankOf();
  let h='<div class="sysline">'+S.vendor+': '+(id==='pot'?'Poção boa salva vida lá dentro.':id==='wep'?'Equipamento custa caro. Nas masmorras, você conquista o seu. Nenhuma peça exige rank.':'Armadura pesada, dano leve.')+' · Seu ouro: <b class="gold">'+fmt(run.gold)+'</b></div>';
  if(id==='wep'||id==='arm')h='<div class="tabs">'+btn('Armas','equipshop','wep',true,id==='wep'?'on':'')+btn('Armaduras','equipshop','arm',true,id==='arm'?'on':'')+'</div>'+h;
  if(id==='pot')h+=row('Pergaminho de Ressurgimento','Revive automaticamente sem perder itens ou progresso. Quantidade: '+(run.rez187||0)+' (máx. 3).',btn(fmt(resurrectionPrice265())+' ouro','buyrez',0,run.gold>=resurrectionPrice265()&&(run.rez187||0)<3));if(id==='pot'&&(cityL(cityOf())>=2||(window.Civic343&&Civic343.grade()>=2)))ELIX.forEach((p,i)=>{h+=row(p.n+' <span style="color:#6fe39a">'+(cityL(cityOf())>=2?'(cidade nv 2)':'(estoque reservado · Conhecido)')+'</span>',p.d,btn(fmt(elixirPrice265())+' ouro','buyelix',i,run.gold>=elixirPrice265()))});
  if(id==='pot')POTS.forEach((p,i)=>{const pp=Math.round(p.price*priceMul('pot'));h+=row(p.n,p.give.pots?(p.give.pots>1?'Cada poção: ':'')+potionDescription():p.d,btn(fmt(pp)+' ouro','buyp',i,run.gold>=pp))});
  else{const sl=id==='wep'?'w':(EQUIP_SLOTS.includes(L.armorSlot)&&L.armorSlot!=='w'?L.armorSlot:'a');if(id==='arm')h+='<div class="tabs">'+EQUIP_SLOTS.filter(k=>k!=='w').map(k=>btn(EQUIP_LABEL[k],'armorpart',k,true,sl===k?'on':'')).join('')+'</div>';const eq=run.equip[sl];
    if(eq){const up=eq.up||0,q=equipmentUpgradeCost(eq),gc=q.gold,cc=q.cry,have=cryUp(eq.tier);h+='<div class="sec">APRIMORAR</div><div class="sysline" style="font-size:12px">Melhora o item que você está <b>usando agora</b>: cada nível dá +8% no número base (ataque da arma ou escudo da armadura). Gasta ouro e cristais do rank do item (cristais caem nas masmorras).</div>'+row('<b style="color:'+RAR[eq.rar].c+'">'+eq.name+'</b> → +'+(up+1),'+8% no bônus · custa '+fmt(gc)+' ouro e '+cc+' cristais '+GR[eq.tier].id+' ou maiores (você tem '+have+')'+(up>=10?' · pode falhar: '+Math.round(Math.min(.6,.2+(up-10)*.04)*100)+'%; materiais perdidos, item preservado':' · sucesso garantido'),btn('Aprimorar','upg',sl,run.gold>=gc&&have>=cc))+'<div class="sec">COMPRAR</div>'}
    if(sl==='w'&&window.Awaken396)h+=Awaken396.shopRows();
    if(sl==='w')h+='<div class="sysline" style="font-size:12px">A arma da sua classe está sempre à venda; as outras mudam a cada dia do jogo.</div>';for(let t=0;t<(secretRankKnown292()?10:9);t++)for(const wk of (sl==='w'?shopKinds290(t):[undefined])){const it=makeItem(sl,t,0,wk);const eq=run.equip[sl];h+=row('<span class="rl" style="color:'+RANKS[t].c+'">'+RANKS[t].id+'</span> · '+it.name,statTxt(it)+' · uso livre'+(()=>{const w=sl==='w',u=w?wDelta278(it).u:' de escudo',d=w?wDelta278(it).d:itemSh(it)-itemSh(eq);return eq?(d>0?' · <b style="color:#6fe39a">▲ +'+fmt(d)+u+'</b> a mais que a sua '+eq.name:d<0?' · <b style="color:#ff8a9a">▼ '+fmt(d)+u+'</b> — a sua '+eq.name+' é melhor':' · igual à sua'):' · <b style="color:#6fe39a">você não tem '+EQUIP_LABEL[sl].toLowerCase()+' nesta posição</b>'})(),btn(fmt(equipmentShopPrice(sl,t))+' ouro','buyi',sl+t+(wk?':'+wk:''),run.gold>=equipmentShopPrice(sl,t)))}if(window.Civic343)h+=Civic343.reservedRows(sl)}
  if((id==='wep'||id==='arm')&&unl('forge'))h+=row('Forja de espólios','Use partes de monstros ou relíquias de chefes para fabricar e aprimorar.',btn('Trabalhar espólios','lootforge',id==='wep'?'w':(L.armorSlot||'a')))+forgeRows(id==='wep'?'w':(L.armorSlot||'a'),pr);
  h+=regionSummary116(nearestCity(player.x,player.z).c)+affRow(S.vendor);
  h+='<div class="sysline" style="font-size:12px;color:var(--dim)">Para vender itens, abra a BOLSA dentro da cidade.</div>';
  openModal(S.n,h);
}
function guildView(tab){
  view=()=>guildView(tab);
  let h='<div class="tabs">'+[['quests','Missões'],['alvos','Alvos Notórios'],['prova','Prova de Rank'],['jobs','Trabalhos'],['story','Histórias'],['job','Classe'],['weekly','Semanal'],['tower','Torre'],['season','Sazonal'],['domain','Domínios'],['city','Cidade'],['guild','Guilda'],['hire','Recrutar'],['clone','Prova'],['god','Criar portal'],['rank','Ranking'],['reaval','Reavaliação'],['travel','Viagem']].filter(([k])=>k!=='reaval'&&(k==='quests'||k==='alvos'||k==='story'||k==='prova'||k==='jobs'||k==='rank'||k==='reaval'||k==='travel'||unl(k))).map(([k,n])=>btn(n,'gtab',k,true,k===tab?'on':'')).join('')+'<span style="margin-left:auto" class="gold">'+fmt(run.gold)+' ouro</span></div>';
  if(tab==='quests'){h+='<div class="sysline">Lyra: Ganhe XP, ouro e reputação. XP considera o desafio e a duração esperada; esperar não aumenta o prêmio. As missões renovam ao receber.<br>'+QUEST_XP_RULE332+'</div>';h+=affRow('Lyra');h+=extractionMissionRow117();run.quests.forEach((q,i)=>{const ok=q.got>=q.n;h+=row(q.d+questTargetText262(q),'Progresso '+Math.min(q.got,q.n)+'/'+q.n+' · '+questXpText262(q)+' · '+fmt(q.rw)+' ouro + '+questOrderRep(q)+' de reputação da Ordem',btn(ok?'RECEBER':'Em andamento','claim',i,ok,ok?'hot':''))})}
  else if(tab==='job'){const A=ADV[profile.cls],c=CLASSES[profile.cls];h+=fusionRows();
    if(run.adv)h+='<div class="sec">PROVAÇÃO DA CLASSE</div><div class="sysline">A cada 100 níveis sua classe pode evoluir de novo: +15% de dano e vida, +3 pontos de habilidade e novo título. Evoluções: <b>'+tierOf()+'</b>.</div>'+row('Próxima: '+(TIER_N[Math.min(tierOf()+1,TIER_N.length-1)]+' '+A.n),'Nível '+tierNeed()+' · você está no '+run.level+' · 3 ondas + Mestre da Provação.',btn('ENFRENTAR','tier',0,run.level>=tierNeed(),'hot'))+'<div class="sysline">Você já é <b>'+className()+'</b>. Habilidade exclusiva: <b>'+A.sk.n+'</b> (botão G). Vida +25% e dano +30%.</div>';
    else{h+='<div class="sysline">Lyra: Todo '+c.n+' que passa no Julgamento vira <b>'+A.n+'</b>. Sua classe não muda, ela evolui.</div>';
      h+=row('Requisito','Nível '+JOB_LVL+' · você está no nível '+run.level,'')+row('Missão','Sobreviva a 3 ondas na Arena do Julgamento e derrote o Cavaleiro do Julgamento. Sem saída até o fim.','')+row('Recompensa','Classe '+A.n+', vida +25%, dano +30% e a habilidade '+A.sk.n,'');
      h+='<div style="display:flex;justify-content:flex-end">'+btn('ACEITAR MISSÃO','job',0,run.level>=JOB_LVL,'hot')+'</div>'}}
  else if(tab==='weekly'){const B=weeklyBoss(),gr=Math.min(9,rankOf()+1),done=profile.weekly===weekId(),left=weekLeft();
    h+='<div class="sysline">Chefe desta semana: <b>'+B.n+'</b>. Ele se ajusta ao seu rank.</div>'+row('Rank do chefe','Um acima do seu','<b class="rl" style="color:'+RANKS[gr].c+'">'+GR[gr].id+'</b>')+row('Recompensa','Dois baús de guardião, ouro triplo e núcleos','')+row('Troca de chefe','Em '+gameLeftTxt198(left),'');
    h+='<div style="display:flex;justify-content:flex-end">'+(done?'<span class="sysline">Concluído nesta semana.</span>':btn('ENFRENTAR','weekly',0,true,'hot'))+'</div>'}
  else if(tab==='alvos'){h+=window.Civic343?Civic343.targetsTab():''}
  else if(tab==='guild'){h+=guildTab()+huntRows203()}
  else if(tab==='travel'){h+=travelTab()}
  else if(tab==='reaval'){const cur=rankOf(),off=run.official??profile.rank,ok=cur>off;
    h+='<div class="sysline">Lyra: A Ordem só reconhece oficialmente o rank depois da <b>Reavaliação</b>. O cristal mede sua mana e o resultado vai para o registro nacional.</div>'+
      row('Rank oficial','Registrado na Ordem','<b class="rl" style="color:'+RANKS[off].c+'">'+RANKS[off].id+'</b>')+
      row('Mana medida agora','Seu poder atual','<b class="rl" style="color:'+RANKS[cur].c+'">'+RANKS[cur].id+'</b>')+
      row('Recompensa','Bônus da Ordem por subir de rank: '+fmt(2000*(cur+1))+' ouro e 2 pontos de status','')+
      '<div style="display:flex;justify-content:flex-end">'+(ok?btn('FAZER REAVALIAÇÃO','reaval',0,true,'hot'):'<span class="sysline">Seu rank oficial já está atualizado.</span>')+'</div>'}
  else if(tab==='clone')h+=cloneTab();else if(tab==='god')h+=godTab();
  else if(tab==='tower')h+=towerTab()+towerRankRows202();else if(tab==='season')h+=seasonTab();else if(tab==='domain')h+=domainTab();else if(tab==='city')h+=cityTab();else if(tab==='story')h+=storyTab();else if(tab==='prova')h+=rankTab();else if(tab==='jobs')h+=jobsTab();
  else if(tab==='hire'){h+='<div class="sysline">Caçadores contratados seguem você no mundo e nas masmorras. Se morrerem, não voltam. Máximo de 3.</div><div class="sec">SEU GRUPO ('+run.party.length+'/3)</div>';
    if(!run.party.length)h+='<div class="it"><div class="d"><small>Ninguém contratado.</small></div></div>';
    run.party.forEach((p,i)=>{h+=row(p.name+' <span class="rl" style="color:'+RANKS[p.rank].c+'">['+RANKS[p.rank].id+']</span>',CLASSES[p.cls].n+' · NV '+p.lvl,btn('Dispensar','fire',i,true,'red'))});
    h+='<div class="sec">DISPONÍVEIS</div>';L.cands.forEach((p,i)=>{h+=row(p.name+' <span class="rl" style="color:'+RANKS[p.rank].c+'">['+RANKS[p.rank].id+']</span>',CLASSES[p.cls].n+' · NV '+p.lvl+(CLASSES[p.cls].n==='Paladino'?' · cura você':''),btn(fmt(recruitPrice265(p))+' ouro','hire',i,run.party.length<3&&run.gold>=recruitPrice265(p)))})}
  else{const list=ranking.map(r=>({...r,me:false}));list.push({name:'Você',rank:rankOf(),lvl:run.level,me:true});list.sort((a,b)=>b.lvl-a.lvl);
    h+='<div class="sysline">Ranking de caçadores da região.</div>';list.forEach((r,i)=>{h+='<div class="it" style="'+(r.me?'background:rgba(255,179,71,.14)':'')+'"><div class="d"><b>'+(i+1)+'º</b> '+r.name+'</div><span class="rl" style="color:'+RANKS[r.rank].c+'">'+RANKS[r.rank].id+'</span><span style="width:64px;text-align:right">NV '+r.lvl+'</span></div>'})}
  openModal('ORDEM DE CAÇADORES',h);
}
/* RECOMENDAÇÃO DO ORÁCULO: nota de poder de cada item, comparada com o equipado. */
const AFW={dmg:1,crit:.8,ls:.6,spd:.5,hp:.5,mp:.3};
function itemScore(it){if(!it)return 0;let sc=it.slot==='w'?itemAtk(it):itemSh(it)/6;
  for(const a of (specialGear354(it)?it.aff:[])||[])sc*=1+a.v*(AFW[a.k]??(run.elem===a.k?1:.35))/100;
  if(specialGear354(it)&&it.set){const o=equippedItems().find(x=>x.uid!==it.uid&&x.set===it.set);if(o)sc*=1.05}
  if(specialGear354(it)&&it.curse)sc*=.9;return Math.round(sc)}
function bestInBag(slot){let b=null;for(const it of run.items)if(it.slot===slot&&(!b||itemScore(it)>itemScore(b)))b=it;return b}
/* v278 (Ian): a arma é comparada pelo ataque do tipo dela — cajado mostra quanto o seu ataque MÁGICO sobe, espada quanto o FÍSICO sobe */
function wDelta278(it){const mag=weaponIsMagic173(it),k=mag?'mag':'phy',cur=run.equip.w,now=atkOf(k);run.equip.w=it;const after=atkOf(k);run.equip.w=cur;return{d:Math.round(after-now),u:' de ataque '+(mag?'mágico':'físico')}}
function recoTag(it){const cur=run.equip[it.slot],w=it.slot==='w',u=w?wDelta278(it).u:' de escudo',d=w?wDelta278(it).d:itemSh(it)-itemSh(cur);
  if(d>0&&bestInBag(it.slot)===it)return '<b style="color:#6fe39a">▲ RECOMENDADO: +'+fmt(d)+u+'</b>';if(d>0)return '<span style="color:#6fe39a">▲ +'+fmt(d)+u+'</span>';if(d<0)return '<span style="color:#ff8a9a">▼ '+fmt(d)+u+'</span>';return '<span style="color:#9fb0c4">= igual ao seu</span>'}
function bagItems(){
  normalizeOwned363();
  for(const it of[...run.items,...equippedItems()])if(it&&/^undefined/.test(it.name))it.name=it.name.replace(/^undefined/,'Arma');
  view=bagItems;const city=inCity(player.x,player.z);
  let h='<div class="sysline">Ouro na bolsa <b class="gold">'+fmt(run.gold)+'</b></div>';
  const category=L.bagCategory363||'equipment',materialCount=Object.values(run.loot||{}).reduce((n,x)=>n+(Number(x.n)||0),0),relicCount=Object.keys(relics183().own).filter(k=>UNIQ183[k]&&relics183().own[k]).length;
  h+='<div class="tabs">'+[['equipment','Equipamentos ('+run.items.length+')'],['materials','Materiais ('+materialCount+')'],['relics','Relíquias ('+relicCount+')']].map(([k,label])=>btn(label,'bagcategory363',k,true,category===k?'on':'')).join('')+'</div>';
  if(category==='materials'){h+='<p>Materiais de forja. Não ocupam espaços de equipamento.</p>';const entries=Object.entries(run.loot||{}).filter(([k,x])=>x.n>0);if(!entries.length)h+='<p>Nenhum material guardado.</p>';for(const [k,x] of entries)h+=row(safeText(k)+' × '+x.n,x.b?'Troféu de chefe · material de forja.':'Material de forja.','');openModal('BOLSA · MATERIAIS',h);return}
  if(category==='relics'){h+='<p>Relíquias equipáveis. Clique para equipar ou retirar.</p>'+relicPanel183();openModal('BOLSA · RELÍQUIAS',h);return}


  
  h+=row('Equipamento','Veja e troque o que você usa em Personagem → Build.',btn('Abrir Build','character','build'));
  h+='<div class="sec">BOLSA ('+run.items.length+'/'+bagCapacity353()+')</div><div class="sysline">Melhore sua bolsa no Mercado. Materiais e consumíveis ficam separados.</div>';
  if(!run.items.length)h+='<div class="it"><div class="d"><small>Vazia. Monstros e baús das masmorras dão equipamentos.</small></div></div>';
  run.items.slice().sort((a,b)=>itemScore(b)-itemScore(a)).forEach(it=>{h+=row('<b draggable="true" data-gear-uid="'+gearText(it.uid)+'" style="cursor:grab;color:'+RAR[it.rar].c+'">'+gearText(it.name)+'</b><br>'+recoTag(it),EQUIP_LABEL[it.slot]+' · '+RAR[it.rar].n+' · rank '+rkN(it.tier)+' · '+statTxt(it),btn('Equipar','equip',it.uid,true)+equipmentSellButton(it))});
  h+='<div class="sec">RECURSOS</div>';const rs=[];for(let r=0;r<10;r++){if(run.res.core[r])rs.push(run.res.core[r]+' núcleo '+GR[r].id);if(run.res.cry[r])rs.push(run.res.cry[r]+' cristal '+GR[r].id)}
  h+=row('Núcleos e cristais',rs.length?rs.join(' · '):'Nada ainda. Quando tiver, venda no Mercado de qualquer cidade.','');
  h+='<div class="sec">CONSUMÍVEIS</div>';
  {const fo=run.foods||{};const ks=Object.keys(fo).filter(k=>fo[k]>0);h+=row('Comida'+(run.food&&run.food.t>0?' · ativo: '+run.food.n+' ('+fmtT(run.food.t)+')':''),ks.length?'':'Cozinhe no Mercado com peixes do lago',ks.map(k=>btn('Comer '+k+' ×'+fo[k],'eat',k)).join(''))}
  h+=row('Pergaminhos de Ressurgimento: '+(run.rez187||0),'Revive automaticamente sem perder itens ou progresso.','');
  const canScroll=L.mode==='dungeon'&&!(L.gate.red&&!L.bossDead)&&run.scrolls>0;
  h+=row('Poções de vida: '+run.pots,potionDescription()+' Consome 1 poção. Botão ✚ ou tecla '+keyLabel(keyOf('pot'))+'.','')+row('Pergaminhos de retorno: '+run.scrolls,'Sai da masmorra. Não revive você.',btn('USAR','scroll',0,canScroll));

  if(!city)h+='<div class="sysline" style="font-size:12px;color:var(--dim)">Venda de itens só dentro de uma cidade.</div>';
  openModal('BOLSA',bagTabs('itens')+h);
}
function mapView(){
  view=mapView;const P=player;
  let h='<canvas id="bigmap" width="600" height="600" style="width:100%;max-width:min(720px,65vh);aspect-ratio:1;display:block;margin:0 auto;border-radius:4px"></canvas>';
  if(L.mode==='world'){h+='<div class="sec">CIDADES PRÓXIMAS</div>';citiesAround(P.x,P.z,700).map(c=>({c,d:Math.hypot(c.x-P.x,c.z-P.z)})).sort((a,b)=>a.d-b.d).slice(0,5).forEach(({c,d})=>{h+=row(c.name,Math.round(d)+'m · zona segura com lojas','')});h+='<div class="sec">PORTAIS ABERTOS</div>';gates.filter(g=>!g.dead).map(g=>({g,d:Math.hypot(g.x-P.x,g.z-P.z)})).sort((a,b)=>a.d-b.d).forEach(({g,d})=>{if(g.secret){h+=row('<span class="rl" style="color:#ffd070">???</span> · portal desconhecido',Math.round(d)+'m · fecha em '+fmtT(g.life)+' · o Oráculo não consegue medir','');return}h+=row('<span class="rl" style="color:'+(g.red?'#ff4d6a':RANKS[g.rank].c)+'">RANK '+GR[g.rank].id+'</span>'+(g.red?' · vermelho':'')+' · '+gateTheme124(g).n,Math.round(d)+'m · fecha em '+fmtT(g.life)+' · nível do portal <b>'+(g.anchor221?'???':gateLvl207(g))+'</b>','')})}
  else h+='<div class="sysline" style="font-size:12px">'+(L.floors?'Andar '+(L.floors.current+1)+'/3 · escadas em verde · saída somente no 1º andar. ':'')+'Salas exploradas '+L.seen.size+'/'+L.rooms.length+'. Azul: saída. Dourado: baú e guardião.</div>';
  openModal(L.mode==='world'?'MAPA · TERRAS DESPERTAS':L.special?'MAPA · '+L.special.name.toUpperCase():'MAPA · MASMORRA RANK '+L.G.id,h);
  drawMap($('bigmap').getContext('2d'),600,true);
}
function gateModal(g){
  retireExtraction117(g);
  view=()=>gateModal(g);if(g.secret){openModal('PORTAL ???','<div class="sysline"><b>[NARRADOR]</b> Erro. Não foi possível medir este portal.</div>'+row('Rank','Desconhecido','<b style="color:#ffd070">???</b>')+row('Fecha em',fmtT(g.life),'')+'<div class="sysline" style="color:var(--dim)">A energia lá dentro não se parece com nada que a Ordem registrou. Quem entra não pode sair até o fim.</div><div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">'+btn('VOLTAR','modalback118',0)+btn('ENTRAR','enter',g.id,true,'hot')+'</div>');return}const G={...GR[g.rank],th:gateTheme124(g)},pr=rankOf();const warn=run.level<G.lvl;
  let h='<div class="sysline"><b>[NARRADOR]</b> Portal <b style="color:'+(g.red?'#ff4d6a':RANKS[g.rank].c)+'">RANK '+G.id+'</b> · '+G.th.n+(g.red?' · <b style="color:#ff4d6a">PORTAL VERMELHO</b>':'')+'</div>';
  if((g.aff||[]).length)h+=row('Afixos','<span style="color:#ffb84d">'+(g.aff.map(i=>{const a=AFFIX.find(x=>x.id===i);return a.n+' ('+a.d+')'}).join(', '))+'</span> · ouro +'+g.aff.length*50+'%','');
  h+=row('Nível recomendado',(warn?'<span style="color:#ff8fa3">Você está abaixo do recomendado</span>':'Você está pronto'),'<b>'+G.lvl+'+</b>');
  const et=expeditionType(g);if(et){h+=row('Tipo: '+EXP_TYPES[et].n,EXP_TYPES[et].d,'');if(['rupture','hunt'].includes(et)){const keys=et==='rupture'?['ward','echo','storm']:et==='hunt'?['fang','stalker']:['ore','core','heart'];h+=row('Materiais e receitas',keys.map(expRecipe).join('<br>'),'');if(et==='hunt')h+=row('Desafio opcional','Vencer sem usar isca: +2 Glândulas. Ninhos e colunas não reduzem a recompensa.','')}}h+=row('Tamanho',(et==='floors'?'3 andares · 4 salas por andar':et==='core'?'Arena de defesa e entrada':'~'+G.rooms+' salas')+(et==='core'?' · 4 ondas':' · guardião e baús'),'');
  h+=row('Saída','Volte à porta da entrada após concluir o objetivo. Transbordo em 60s.','');
  h+=row('Fecha em',fmtT(g.life)+(g.rank>=2?' · se fechar sem ser limpo, os monstros escapam':''),'');
  h+=row('Seu grupo',run.party.length?run.party.map(p=>p.name).join(', '):'Sozinho'+(run.shadows.length?' + '+run.shadows.length+' eco(s)':''),'');
  if(g.red)h+='<div class="sysline" style="color:#ffb3c0"><b>Portal vermelho</b><br>Saída bloqueada até concluir o objetivo. Retorno não funciona.<br>Monstros +30% de força; recompensas em dobro.<br>Morrer rompe o portal e libera monstros no mundo.</div>';
  h+='<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">'+btn('VOLTAR','modalback118',0)+btn('ENTRAR','enter',g.id,true,'hot')+'</div>';
  openModal('PORTAL RANK '+G.id,h);
}
let gearDrag=null;
$('mb').addEventListener('dragstart',e=>{if(e.target.closest('[data-gear-uid]'))e.preventDefault()});
$('mb').addEventListener('pointerdown',e=>{const el=e.target.closest('[data-gear-uid]');if(!el||e.button!==0||e.pointerType==='touch')return;e.preventDefault();gearDrag={uid:el.dataset.gearUid,x:e.clientX,y:e.clientY};$('mb').setPointerCapture(e.pointerId);el.style.opacity='.5'});
$('mb').addEventListener('pointerup',e=>{if(!gearDrag)return;const drag=gearDrag;gearDrag=null;const el=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-gear-slot]');if(el&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>5){if(dropEquipment(drag.uid,el.dataset.gearSlot))saveRun();else toast('Arraste uma peça compatível com esta posição e com seu rank.')}rerender()});
$('mb').addEventListener('pointercancel',()=>{if(gearDrag){gearDrag=null;rerender()}});
$('mb').addEventListener('toggle',e=>{if(e.target.matches('details[data-skill114]')){if(e.target.isConnected)CHAR_UI118.details[e.target.dataset.skill114]=e.target.open}},true);
$('mb').addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b||b.disabled)return;const a=b.dataset.a,v=b.dataset.v;
  const xr=extraActions(a,v)||extraActions2(a,v)||extraActions3(a,v);if(xr==='close'||xr==='close0')return;if(xr){saveRun();rerender();return}
  if(a==='close')return closeModal();
  if(a==='enter'){const g=gates.find(x=>x.id==v);if(g&&!g.dead)enterGate(g);return}
  if(a==='gtab')return guildView(v);
  if(a==='buyp'){const p=POTS[+v],pp=Math.round(p.price*priceMul('pot'));if(run.gold<pp)return;run.gold-=pp;if(window.Econ154)Econ154.notePurchase(pp);for(const k in p.give)run[k]+=p.give[k];beep(990,.08,.05);toast('<b>[NARRADOR]</b> Comprado: '+p.n)}
  if(a==='barter396'){if(window.Awaken396)Awaken396.barter(v)}
  if(a==='buyi'){const [st,k]=String(v).split(':');buyEquipment(st[0],+st.slice(1),k)}
  if(a==='equipbest'){for(const sl of EQUIP_SLOTS){const b=bestInBag(sl);if(b&&itemScore(b)>itemScore(run.equip[sl])){run.items.splice(run.items.indexOf(b),1);if(run.equip[sl])run.items.push(run.equip[sl]);run.equip[sl]=b}}finishFirstEquipment();refreshStats();toast('<b>[NARRADOR]</b> Equipamento otimizado.');}
  if(a==='travel217'){travelGo217(v);return 'close'}if(a==='relic'){relicToggle183(v);if(view)view();return}if(a==='relicvault'){if(inCity(player.x,player.z))relicVault190(v);if(view)view();return}if(a==='equip'){equipBagItem(v);/* v194 (Ian): despertar abre ao encaixar a última peça do set */if(Object.keys(SETS153).some(id=>awakenTestReady155(id))){L.awAsked169=null;setTimeout(()=>{closeModal();awakenPopup169(true)},120);return 'close0'}}
  if(a==='sell'){if(!sellEquipment(v))return}
  if(a==='claim'){if(!claimOrderQuest(+v))return}
  if(a==='hire'){const p=L.cands[+v];if(!p||run.party.length>=3||!spendService265(recruitPrice265(p)))return;L.cands.splice(+v,1);run.party.push(p);narratorEvent105('hire');makeHunterAlly(p,player.x+1,player.z+1,false);toast('<b>[NARRADOR]</b> '+p.name+' entrou no seu grupo.')}
  if(a==='fire'){const p=run.party[+v];run.party.splice(+v,1);const al=allies.find(x=>x.data===p);if(al){al.dead=true;scene.remove(al.m.root)}}
  if(a==='sellres'){const k=v.slice(0,-1),r=+v.slice(-1);if(!['core','cry'].includes(k)||!Number.isInteger(r)||r<0||r>9)return;const P=k==='core'?CORE_P:CRY_P;const g=run.res[k][r]*sellP(k,r);run.gold+=g;if(window.Econ154)Econ154.noteResSale(r,g);run.res[k][r]=0;toast('<b>[NARRADOR]</b> +'+fmt(g)+' ouro');beep(990,.08,.05)}
  if(a==='sellall'){if(!sellMonsterLoot())return}
  if(a==='upg'){const eq=run.equip[v];if(!eq)return;const q=equipmentUpgradeCost(eq);if(run.gold<q.gold||cryUp(eq.tier)<q.cry)return;if(!spendService265(q.gold))return;spendCry(eq.tier,q.cry);finishEquipmentUpgrade(eq)}
  if(a==='job'){if(run.level<JOB_LVL||run.adv)return;closeModal();buildSpecial('job');return}
  if(a==='tier'){if(!run.adv||run.level<tierNeed())return;closeModal();L.tierTrial=true;buildSpecial('job');return}
  if(a==='weekly'){if(profile.weekly===weekId())return;closeModal();buildSpecial('weekly');return}
  if(a==='dep'||a==='wd'){const have=a==='dep'?run.gold:(profile.bank||0);const amt=v==='all'?have:Math.min(+v,have);if(!Number.isSafeInteger(amt)||amt<=0)return;if(a==='dep'){run.gold-=amt;profile.bank=(profile.bank||0)+amt;npcEv('bank',amt)}else{profile.bank-=amt;run.gold+=amt}store.set('pds2_profile',profile);sfx('coin')}
  if(a==='scroll'){if(run.scrolls<=0)return;run.scrolls--;closeModal();leaveDungeon(true);return}
  saveRun();rerender();
});
$('mx').addEventListener('click',closeModal);
$('mission').style.pointerEvents='auto';$('mission').addEventListener('click',()=>{if(started&&!paused&&allies.some(a=>a.shadow&&!a.dead))cycleOrder()});
/* Tocar/clicar no painel do personagem abre a Janela de Status. */
$('stat').style.cursor='pointer';$('stat').style.pointerEvents='auto';$('stat').addEventListener('click',()=>{if(started&&!modalOpen&&$('dead').hidden)statusView()});

