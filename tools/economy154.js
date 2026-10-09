/* Economia local: unidade H de calibração = 400 ouro em F, sem equivalência
   presumida com horas reais. Demanda transacional, abastecimento e impostos
   afetam cada cidade; valores limitados preservam previsibilidade. */
window.Econ154=(()=>{
 const H0=400; // unidade de projeto; não representa horas de caça
 const H=r=>H0*GR[Math.max(0,Math.min(9,r|0))].gold;
 const cityH=H0; // cidade tem escala própria; o nível do jogador não reajusta sua economia
 const rank=()=>Math.max(0,Math.min(9,rankOf()));
 const fmtPct=v=>(v>=0?'+':'')+Math.round(v*100)+'%';
 // ---------- city state ----------
 function cityOf(){const n=player&&nearestCity(player.x,player.z);return n&&n.d<70*CITYK?n.c:null}
 function st(c){profile.econ154=profile.econ154||{};let s=profile.econ154[c.id];
  if(!s)s=profile.econ154[c.id]={ipc:1,tax:.08,treasury:Math.round(2*cityH),day:todayKey(),sat:{},hist:[],flow:0};
  s.ipc=Math.max(.8,Math.min(1.3,Number(s.ipc)||1));s.tax=Math.max(.05,Math.min(.15,Number(s.tax)||.08));s.treasury=Math.max(0,Number(s.treasury)||0);s.sat=s.sat||{};s.hist=s.hist||[];s.flow=Number.isFinite(Number(s.flow))?Number(s.flow):0;return s}
 function save(){store.set('pds2_profile',profile)}
 /* v343: Herói Local (confiança 75+) não paga imposto nas vendas da cidade. */
 const stax=k=>window.Civic343&&Civic343.taxFree(k.c)?0:k.s.tax;
 function treasuryPay(c,amount){if(!c)return 0;const s=st(c),v=Math.max(0,Math.min(Math.floor(s.treasury),Math.round(Number(amount)||0)));s.treasury-=v;save();return v}
 // Daily drift of the price index and tax, paid upkeep. Bank interest is owned by game.html.
 function dayTick(c,s){
  const today=Number(todayKey());const old=Number(s.day);if(Number.isFinite(old)&&old>=today)return;const days=Math.min(7,Math.max(1,Number.isFinite(old)&&Number.isFinite(today)?today-old:1));s.day=today;
  for(let i=0;i<days;i++){
   const money=Math.max(0,s.flow)/Math.max(1,5*cityH);       // demanda transacional local, não riqueza da carteira
   const dome=window.Dome154?Dome154.state(c):{built:false};
   let target=1+Math.min(.18,Math.max(-.08,Math.log10(Math.max(.1,money))*.09)); // too much gold -> inflation
   if(cityFallen(c))target+=.25;if(dome.built&&dome.broken)target+=.12;if(L.siege&&L.siege.c===c)target+=.08;
   const fest=festival&&festival();if(fest)target-=.12;target-=Math.min(.1,cityL(c)*.01);       // big, well-run cities are cheaper
   s.ipc=Math.max(.8,Math.min(1.3,s.ipc+(target-s.ipc)*.35));
   // council sets the tax: war and empty treasury push it up, festivals push it down
   let tax=.08+(s.treasury<cityH?.04:0)+(L.siege&&L.siege.c===c?.03:0)-(fest?.04:0);s.tax=Math.max(.05,Math.min(.15,tax));
   // treasury pays the dome upkeep; unpaid upkeep wears the dome
   if(dome.built&&!dome.broken){const up=Math.round(.15*cityH);if(s.treasury>=up)s.treasury-=up;else if(window.Dome154)Dome154.wear(c,.1)}
   for(const k in s.sat)s.sat[k]=Math.max(0,s.sat[k]*.5);             // markets recover from gluts
   s.flow=0;
   s.hist.push(+s.ipc.toFixed(3));if(s.hist.length>14)s.hist.shift();
   // bank interest is settled once per calendar day below, outside the city loop
  }
  save();
 }
 function cur(){const c=cityOf();if(!c)return null;const s=st(c);dayTick(c,s);return {c,s}}
 // ---------- price hooks ----------
 const baseMul=priceMul;
 priceMul=function(kind){const m=baseMul(kind),k=cur(),ipc=k?k.s.ipc:1,tax=k?k.s.tax:.08;
  const scale=kind==='pot'?Math.max(1,Math.pow(GR[rank()].gold,.7)):1;              // consumables follow the cost of living
  return m*scale*ipc*(1+tax)};
 // Peça grande custa 0,8 H do rank do item; slots pequenos custam 20%.
 equipmentShopPrice=function(sl,t){return Math.max(1,Math.round(.8*H(t)*equipFactor(sl)*priceMul(sl==='w'?'wep':'arm')))};
 // Serviços compartilham a tarifa; a viagem já inclui o fator de rank no módulo puro.
 function localPrice(base,kind='service'){const b=Number(base),m=priceMul(kind);if(!Number.isFinite(b)||b<=0||!Number.isFinite(m)||m<=0)throw new RangeError('service price');return Math.max(1,Math.min(Number.MAX_SAFE_INTEGER,Math.ceil(b*m)))}
 function servicePrice(kind,options){const category=kind==='elixir'?'pot':['forge','upgrade','rune'].includes(kind)?(options.slot==='w'?'wep':'arm'):'service';return localPrice(ServicePrices265.base(kind,options),category)}
 guildCost=function(){return servicePrice('guild',{rankFactor:GR[rank()].gold})};
 // Loot sold at the market: glut, index and tax; tax goes to the city treasury.
 const baseLoot=lootTotal;
  lootTotal=function(){const k=cur(),g=baseLoot();if(!k)return g;const sat=k.s.sat.loot||0;return Math.round(g*Math.sqrt(k.s.ipc)*(1-stax(k))*Math.max(.5,1-sat))};
 const baseSellLoot=sellMonsterLoot;
 sellMonsterLoot=function(){const k=cur(),gross=baseLoot(),net=lootTotal();const ok=baseSellLoot();if(ok&&k){const transactionGross=Math.round(net/Math.max(1-stax(k),.01));const tax=Math.round(transactionGross*stax(k));k.s.treasury+=tax;k.s.sat.loot=Math.min(.5,(k.s.sat.loot||0)+transactionGross/Math.max(1,6*cityH));save()}return ok};
 // Crystals/cores: ECON[] is read by sellP; refresh it with index, tax and glut every frame.
 let econRefreshDay=null,econRefreshCity=null;
 function refreshECON(){const k=cur();const id=k&&k.c.id+(stax(k)?'':'|livre'),day=k&&k.s.day;if(id===econRefreshCity&&day===econRefreshDay)return;econRefreshCity=id;econRefreshDay=day;for(let r=0;r<10;r++){const sat=k?(k.s.sat['res'+r]||0):0,demand=k?(k.s.sat['demand'+r]||0):0;ECON[r]=k?Math.max(.4,Math.min(1.8,Math.sqrt(k.s.ipc)*(1-stax(k))*Math.max(.5,1-sat)*(1+Math.min(.15,demand)) )):1}}
 function invalidateMarket(){econRefreshDay=null;econRefreshCity=null}
 function noteResSale(r,gold){const k=cur();if(!k)return;const net=Number(gold)||0;const gross=net/Math.max(1-stax(k),.01);k.s.sat['res'+r]=Math.min(.5,(k.s.sat['res'+r]||0)+gross/Math.max(1,4*cityH));k.s.treasury+=Math.round(net*stax(k)/Math.max(1-stax(k),.01));invalidateMarket();refreshECON();save()}
 function noteResourcePurchase(r,amount){const k=cur();if(!k)return;const v=Math.max(0,Number(amount)||0);k.s.sat['demand'+r]=Math.min(.15,(k.s.sat['demand'+r]||0)+v/Math.max(1,8*cityH));invalidateMarket();refreshECON();save()}
 // Preço sem descontos de afinidade: a maior revenda possível fica abaixo de 50%.
 function resourceBuyPrice(r,n=10){const k=cur(),ipc=k?k.s.ipc:1,tax=k?k.s.tax:.08;return Math.ceil(CRY_P[r]*n*3*ipc*(1+tax))}
 function resourceSalePrice(kind,r){refreshECON();const base=(kind==='core'?CORE_P:CRY_P)[r];return Math.max(0,Math.round(base*ECON[r]*(1+.03*Math.min(10,Math.max(0,affL('Dorian'))))))}
 function salePrice(category,base){const k=cur();if(!k)return Math.max(0,Math.round(base));return Math.max(0,Math.round(base*Math.sqrt(k.s.ipc)*(1-stax(k))*Math.max(.5,1-(k.s.sat[category]||0))))}
 function noteMarketSale(category,net){const k=cur();if(!k||!(net>0))return;const gross=net/(1-stax(k));k.s.treasury+=Math.round(gross*stax(k));k.s.sat[category]=Math.min(.5,(k.s.sat[category]||0)+gross/(6*cityH));save()}
 function notePurchase(totalPaid){const k=cur();if(!k)return;const paid=Math.max(0,Number(totalPaid)||0);k.s.flow+=paid;k.s.treasury+=Math.round(paid*k.s.tax/(1+k.s.tax));save()}
 // ---------- dome numbers (used by Dome154) ----------
 function cityTier(){const c=cityOf();return c?Math.max(0,Math.min(5,Math.round(cityL(c)||0))):0}
 function cityResourceRank(){return Math.max(0,Math.min(9,cityTier()));}
 function domeBuild(){const r=cityResourceRank(),t=cityTier();return {gold:localPrice(Math.round(6*cityH*(.75+.1*t)/100)*100),cry:40,core:15,r}}
 function domeRepair(frac){const r=cityResourceRank(),f=Math.max(0,Math.min(1,frac)),t=cityTier();return {gold:f>0?localPrice(Math.max(1,Math.round(.4*6*cityH*(.75+.1*t)*f/100)*100)):0,cry:Math.ceil(15*f),core:Math.ceil(5*f),r}}
 function canPay(k){return run.gold>=k.gold&&run.res.cry[k.r]>=k.cry&&run.res.core[k.r]>=k.core}
 function pay(k){if(!canPay(k))return false;run.gold-=k.gold;run.res.cry[k.r]-=k.cry;run.res.core[k.r]-=k.core;notePurchase(k.gold);return true}
 function costText(k){return fmt(k.gold)+' ouro'+(k.cry?' + '+k.cry+' cristais '+GR[k.r].id:'')+(k.core?' + '+k.core+' núcleos '+GR[k.r].id:'')}
 // ---------- panel shown at Dorian's market ----------
 function panel(){const k=cur();if(!k)return '';const s=k.s,trend=s.hist.length>1?s.ipc-s.hist[s.hist.length-2]:0;
  return '<div class="sec">ECONOMIA DE '+k.c.name.toUpperCase()+'</div>'+
   row('Índice de preços',(s.ipc>1.03?'<span style="color:#ff8fa3">Inflação</span>':s.ipc<.97?'<span style="color:#6fe39a">Deflação</span>':'Estável')+' · preços '+fmtPct(s.ipc-1)+' (ontem '+fmtPct(trend)+'). Compras locais, cerco e domo rompido afetam os preços; festival e abastecimento recuperado ajudam a estabilizar.','')+
   row('Imposto do conselho',Math.round(s.tax*100)+'% nas lojas, viagens e serviços e na venda de equipamentos, peixes, recursos e espólios. Doações e transferências são isentas. Vai para o tesouro da cidade.','')+
   row('Tesouro da cidade',fmt(s.treasury)+' ouro · paga a manutenção do domo ('+fmt(Math.round(.15*cityH))+'/dia).',btn('Doar '+fmt(Math.round(.25*cityH)),'econdonate',k.c.id,run.gold>=Math.round(.25*cityH)))}
 function donate(id){const k=cur();if(!k||k.c.id!==id)return false;const g=Math.round(.25*cityH);if(run.gold<g)return false;run.gold-=g;k.s.treasury+=g;if(typeof regionEvent116==='function')regionEvent116(k.c,3,0,'Você doou ao tesouro da cidade. Confiança +3.');save();return true}
 const baseModal=openModal;
 openModal=function(title,html,...rest){if(/MERCADO/.test(title))html=panel()+html;return baseModal(title,html,...rest)};
 // per-frame refresh through the event loop already used by the dome
 const baseSiege=updSiege;updSiege=function(dt){baseSiege(dt);refreshECON()};
 return {H,cur,st,panel,donate,domeBuild,domeRepair,canPay,pay,costText,noteResSale,noteResourcePurchase,notePurchase,resourceBuyPrice,resourceSalePrice,servicePrice,localPrice,salePrice,noteMarketSale,treasuryPay};
})();
