/* v154 economy (Ian: "quase uma economia real", decided by Claude with Ian's go-ahead on 01/10/2026).
   Base unit H = expected gold per hour of hunting at a rank (measured: ~17k/h at F after the boss-relic cut, x GR gold).
   Each city has a government: tax rate, treasury and a price index (IPC) that drifts daily (inflation/deflation).
   Selling always pays less than buying; flooding a market with one good drops its price for a while.
   See "Economia — cálculo e proposta (2026-10-01).md" in the vault for the reasoning. */
window.Econ154=(()=>{
 const H0=17000;
 const H=r=>H0*GR[Math.max(0,Math.min(9,r|0))].gold;
 const rank=()=>Math.max(0,Math.min(9,rankOf()));
 const fmtPct=v=>(v>=0?'+':'')+Math.round(v*100)+'%';
 // ---------- city state ----------
 function cityOf(){const n=player&&nearestCity(player.x,player.z);return n&&n.d<70*CITYK?n.c:null}
 function st(c){profile.econ154=profile.econ154||{};let s=profile.econ154[c.id];
  if(!s)s=profile.econ154[c.id]={ipc:1,tax:.08,treasury:Math.round(2*H(rank())),day:todayKey(),sat:{},hist:[]};return s}
 function save(){store.set('pds2_profile',profile)}
 // Daily drift of the price index and tax, paid upkeep, bank interest.
 function dayTick(c,s){
  const today=todayKey();if(s.day>=today)return;const days=Math.min(7,today-s.day);s.day=today;
  for(let i=0;i<days;i++){
   const money=(run.gold+(profile.bank||0))/Math.max(1,5*H(rank()));       // money supply vs. 5 hours of income
   const dome=window.Dome154?Dome154.state(c):{built:false};
   let target=1+Math.min(.18,Math.max(-.08,Math.log10(Math.max(.1,money))*.09)); // too much gold -> inflation
   if(cityFallen(c))target+=.25;if(dome.built&&dome.broken)target+=.12;if(L.siege&&L.siege.c===c)target+=.08;
   const fest=festival&&festival();if(fest)target-=.12;target-=Math.min(.1,cityL(c)*.01);       // big, well-run cities are cheaper
   s.ipc=Math.max(.8,Math.min(1.3,s.ipc+(target-s.ipc)*.35));
   // council sets the tax: war and empty treasury push it up, festivals push it down
   let tax=.08+(s.treasury<H(rank())?.04:0)+(L.siege&&L.siege.c===c?.03:0)-(fest?.04:0);s.tax=Math.max(.05,Math.min(.15,tax));
   // treasury pays the dome upkeep; unpaid upkeep wears the dome
   if(dome.built&&!dome.broken){const up=Math.round(.15*H(rank()));if(s.treasury>=up)s.treasury-=up;else if(window.Dome154)Dome154.wear(c,.1)}
   for(const k in s.sat)s.sat[k]=Math.max(0,s.sat[k]*.5);             // markets recover from gluts
   s.hist.push(+s.ipc.toFixed(3));if(s.hist.length>14)s.hist.shift();
   if(profile.bank>0)profile.bank=Math.round(profile.bank*1.005);        // Selene pays 0.5% a day
  }
  save();
 }
 function cur(){const c=cityOf();if(!c)return null;const s=st(c);dayTick(c,s);return {c,s}}
 // ---------- price hooks ----------
 const baseMul=priceMul;
 priceMul=function(kind){const m=baseMul(kind),k=cur(),ipc=k?k.s.ipc:1,tax=k?k.s.tax:.08;
  const scale=kind==='pot'?Math.max(1,H(rank())/H0*1.7):1;              // consumables follow the cost of living
  return m*scale*ipc*(1+tax)};
 // Equipment: a piece of rank t costs ~0.8 hour of hunting at rank t (body); small slots 20%.
 equipmentShopPrice=function(sl,t){return Math.round(.8*H(t)*equipFactor(sl)*priceMul(sl==='w'?'wep':'arm')/100)*100};
 const baseTravel=travelCost;travelCost=function(c){return Math.round(baseTravel(c)*Math.pow(GR[rank()].gold,.6))};
 guildCost=function(){return Math.round(50*H(5))};
 // Loot sold at the market: glut, index and tax; tax goes to the city treasury.
 const baseLoot=lootTotal;
 lootTotal=function(){const k=cur(),g=baseLoot();if(!k)return g;const sat=k.s.sat.loot||0;return Math.round(g*Math.sqrt(k.s.ipc)*(1-k.s.tax)*Math.max(.5,1-sat))};
 const baseSellLoot=sellMonsterLoot;
 sellMonsterLoot=function(){const k=cur(),gross=baseLoot(),net=lootTotal();const ok=baseSellLoot();if(ok&&k){k.s.treasury+=Math.round(gross-net);k.s.sat.loot=Math.min(.5,(k.s.sat.loot||0)+net/Math.max(1,6*H(rank())));save()}return ok};
 // Crystals/cores: ECON[] is read by sellP; refresh it with index, tax and glut every frame.
 function refreshECON(){const k=cur();for(let r=0;r<10;r++){const sat=k?(k.s.sat['res'+r]||0):0;ECON[r]=k?Math.sqrt(k.s.ipc)*(1-k.s.tax)*Math.max(.5,1-sat):1}}
 function noteResSale(r,gold){const k=cur();if(!k)return;k.s.sat['res'+r]=Math.min(.5,(k.s.sat['res'+r]||0)+gold/Math.max(1,4*H(r)));k.s.treasury+=Math.round(gold*k.s.tax);save()}
 // ---------- dome numbers (used by Dome154) ----------
 function domeBuild(){const r=rank();return {gold:Math.round(6*H(r)/100)*100,cry:40,core:15,r}}
 function domeRepair(frac){const r=rank(),f=Math.max(0,Math.min(1,frac));return {gold:Math.round(.4*6*H(r)*f/100)*100,cry:Math.ceil(15*f),core:Math.ceil(5*f),r}}
 function canPay(k){return run.gold>=k.gold&&run.res.cry[k.r]>=k.cry&&run.res.core[k.r]>=k.core}
 function pay(k){if(!canPay(k))return false;run.gold-=k.gold;run.res.cry[k.r]-=k.cry;run.res.core[k.r]-=k.core;const c=cityOf();if(c){const s=st(c);s.treasury+=Math.round(k.gold*.1)}return true}
 function costText(k){return fmt(k.gold)+' ouro'+(k.cry?' + '+k.cry+' cristais '+GR[k.r].id:'')+(k.core?' + '+k.core+' núcleos '+GR[k.r].id:'')}
 // ---------- panel shown at Dorian's market ----------
 function panel(){const k=cur();if(!k)return '';const s=k.s,trend=s.hist.length>1?s.ipc-s.hist[s.hist.length-2]:0;
  return '<div class="sec">ECONOMIA DE '+k.c.name.toUpperCase()+'</div>'+
   row('Índice de preços',(s.ipc>1.03?'<span style="color:#ff8fa3">Inflação</span>':s.ipc<.97?'<span style="color:#6fe39a">Deflação</span>':'Estável')+' · preços '+fmtPct(s.ipc-1)+' (ontem '+fmtPct(trend)+'). Muito ouro parado, cerco ou domo rompido encarecem tudo; festival e cidade forte barateiam.','')+
   row('Imposto do conselho',Math.round(s.tax*100)+'% sobre compras e vendas. Vai para o tesouro da cidade.','')+
   row('Tesouro da cidade',fmt(s.treasury)+' ouro · paga guardas e a manutenção do domo ('+fmt(Math.round(.15*H(rank())))+'/dia).',btn('Doar '+fmt(Math.round(.25*H(rank()))),'econdonate',k.c.id,run.gold>=Math.round(.25*H(rank()))))}
 function donate(id){const k=cur();if(!k||k.c.id!==id)return false;const g=Math.round(.25*H(rank()));if(run.gold<g)return false;run.gold-=g;k.s.treasury+=g;if(typeof regionEvent116==='function')regionEvent116(k.c,3,0,'Você doou ao tesouro da cidade. Confiança +3.');save();return true}
 const baseModal=openModal;
 openModal=function(title,html,...rest){if(/MERCADO/.test(title))html=panel()+html;return baseModal(title,html,...rest)};
 // per-frame refresh through the event loop already used by the dome
 const baseSiege=updSiege;updSiege=function(dt){baseSiege(dt);refreshECON()};
 return {H,cur,st,panel,donate,domeBuild,domeRepair,canPay,pay,costText,noteResSale};
})();
