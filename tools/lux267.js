/* v267 (Ian): onde gastar ouro do rank C em diante.
   Relíquias regionais, investimento na cidade, cômodos da casa, encantamento,
   mercenários de elite e portal encomendado. Preços em H do seu rank
   (H = 400 × ouro do rank: C 5.600, B 12.000, A 28.000...). Tudo fica no perfil,
   exceto o encantamento, que fica no item, e o contrato, que fica na vida atual. */
window.Lux267=(()=>{
 const MIN_RANK=3; // C
 const Hr=r=>400*GR[Math.max(0,Math.min(9,r|0))].gold;
 const H=()=>Hr(rankOf());
 const price=base=>localPrice265(Math.round(base));
 const ok=()=>rankOf()>=MIN_RANK;
 const P=()=>{const x=profile.lux267=profile.lux267||{};x.relics=x.relics||{};x.invest=x.invest||{};x.rooms=x.rooms||{};return x};
 const save=()=>{store.set('pds2_profile',profile);saveRun()};
 const here=()=>player&&nearestCity(player.x,player.z).c;
 const pct=v=>'+'+Math.round(v*100)+'%';

 /* ---------- relíquias regionais: uma por cidade, permanentes ---------- */
 const RELICS=[
  {k:'brasa',n:'Coração de Brasa',d:'+6% de dano',b:{dmg:.06}},
  {k:'raiz',n:'Raiz Anciã',d:'+8% de vida máxima',b:{hp:.08}},
  {k:'olho',n:'Olho do Cronista',d:'+5% de XP',b:{xp:.05}},
  {k:'moeda',n:'Moeda do Primeiro Rei',d:'+8% de ouro dos monstros',b:{gold:.08}},
  {k:'vento',n:'Pena do Vento Norte',d:'+5% de velocidade',b:{spd:.05}},
  {k:'mare',n:'Pérola da Maré',d:'+12% de mana máxima',b:{mp:.12}},
  {k:'bastiao',n:'Pedra do Bastião',d:'+10% de escudo',b:{sh:.10}},
  {k:'eco',n:'Sino do Eco',d:'+4% de defesa',b:{def:.04}}];
 const hash=s=>{let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return h};
 const relicOf=c=>RELICS[hash(c.id)%RELICS.length];
 const relicPrice=()=>price(6*H());
 /* ---------- cômodos da casa ---------- */
 const ROOMS=[
  {k:'treino',n:'Sala de treino',d:'+4% de dano',m:4,b:{dmg:.04}},
  {k:'biblio',n:'Biblioteca',d:'+5% de XP',m:6,b:{xp:.05}},
  {k:'cofre',n:'Cofre reforçado',d:'+2 espaços no cofre de relíquias',m:5,b:{vault:2}},
  /* v288 (Ian): 'jardim de mana' dando vida não fazia sentido. Mesmo cômodo salvo (k:'jardim'), novo nome e efeito; cômodos novos para fúria, vigor e mana. */
  {k:'jardim',n:'Estufa de ervas',d:'+8% de vida',m:4,b:{hp:.08}},
  {k:'medita',n:'Sala de meditação',d:'+8% de mana',m:4,b:{mp:.08}},
  {k:'arena',n:'Arena de combate',d:'+1 de fúria por golpe e +10 de fúria máxima',m:5,b:{furyHit:1,furyMax:10}},
  {k:'pista',n:'Pista de corrida',d:'+10 de vigor máximo e vigor volta 10% mais rápido',m:5,b:{vigorMax:10,vigorRate:.1}}];
 const roomPrice=R=>price(R.m*H());

 function bonus(){const out={dmg:0,hp:0,xp:0,gold:0,spd:0,mp:0,sh:0,def:0,vault:0,furyHit:0,furyMax:0,vigorMax:0,vigorRate:0};if(!profile)return out;const x=P();
  const add=b=>{for(const k in b)out[k]+=b[k]};
  for(const k in x.relics){const R=RELICS.find(r=>r.k===x.relics[k]);if(R)add(R.b)}
  if(profile.house)for(const R of ROOMS)if(x.rooms[R.k])add(R.b);
  return out}

 /* ---------- investimento: 5 níveis por cidade ---------- */
 const investLv=c=>Math.min(5,P().invest[c.id]||0);
 const investPrice=l=>price(2*H()*Math.pow(l+1,1.5));

 /* ---------- encantamento: sem limite prático, +3% de qualidade por nível ---------- */
 const enchPrice=it=>price(.25*Hr(it.tier)*Math.pow(1.3,it.ench267||0));
 const ENCH_MAX=20;

 /* ---------- mercenários e portal ---------- */
 const mercPrice=n=>price((n===2?2.5:1.5)*H());
 const gatePrice=r=>price(1.2*Hr(r));

 function html(){
  if(!ok())return '<div class="sec">LUXO E INVESTIMENTOS</div><div class="sysline">Relíquias regionais, investimentos, encantamentos, mercenários de elite e portais encomendados abrem no <b>rank C</b>.</div>';
  const c=here(),x=P(),lv=investLv(c),R=relicOf(c),own=x.relics[c.id],trust=regionState116(c).trust,b=bonus();
  let h='<div class="sec">INVESTIR EM '+safeText(c.name).toUpperCase()+' · NÍVEL '+lv+'/5</div>';
  h+=row('Investimento na cidade','Cada nível: lojas e serviços desta cidade 3% mais baratos e +5 de confiança. Atual: −'+3*lv+'%.',lv<5?btn(fmt(investPrice(lv))+' ouro','lx267inv',c.id,run.gold>=investPrice(lv),'hot'):'<b style="color:#6fe39a">Máximo</b>');
  h+='<div class="sec">RELÍQUIA DE '+safeText(c.name).toUpperCase()+'</div>';
  h+=row(R.n,R.d+'. Permanente: não ocupa espaço de relíquia e não se perde ao morrer. Exige 50 de confiança na cidade (você tem '+trust+').',own?'<b style="color:#6fe39a">Sua</b>':btn(fmt(relicPrice())+' ouro','lx267rel',c.id,trust>=50&&run.gold>=relicPrice(),'hot'));
  const got=Object.keys(x.relics).length;h+='<div class="sysline" style="font-size:12px">Relíquias regionais: '+got+' · cada cidade guarda uma diferente. Bônus somados: '+['dmg','hp','xp','gold','spd','mp','sh','def'].filter(k=>b[k]).map(k=>({dmg:'dano',hp:'vida',xp:'XP',gold:'ouro',spd:'velocidade',mp:'mana',sh:'escudo',def:'defesa'})[k]+' '+pct(b[k])).join(' · ')+'</div>';
  h+='<div class="sec">ENCANTAMENTO (EQUIPADOS)</div><div class="sysline" style="font-size:12px">Cada nível deixa a peça 3% mais forte, até +'+ENCH_MAX+'. O preço sobe 30% por nível. O encantamento fica na peça.</div>';
  for(const sl of EQUIP_SLOTS){const it=run.equip[sl];if(!it)continue;const e=it.ench267||0;h+=row(EQUIP_LABEL[sl]+': <span style="color:'+RAR[it.rar].c+'">'+gearText(it.name)+'</span>','Encantamento +'+e+'/'+ENCH_MAX,e<ENCH_MAX?btn(fmt(enchPrice(it))+' ouro','lx267ench',sl,run.gold>=enchPrice(it)):'<b style="color:#6fe39a">Máximo</b>')}
  h+='<div class="sec">MERCENÁRIOS DE ELITE</div>';
  const m=run.merc267||0;
  h+=row('Contrato para a próxima masmorra','Caçadores do seu rank, 3 níveis acima de você, lutam ao seu lado na próxima masmorra.'+(m?' <b>Contratados: '+m+'.</b>':''),m?'':btn('1 · '+fmt(mercPrice(1)),'lx267merc',1,run.gold>=mercPrice(1))+btn('2 · '+fmt(mercPrice(2)),'lx267merc',2,run.gold>=mercPrice(2)));
  h+='<div class="sec">PORTAL ENCOMENDADO</div><div class="sysline" style="font-size:12px">A Ordem abre um portal do rank escolhido perto da cidade. Até um rank acima do seu.</div>';
  const pr=rankOf();for(let r=Math.max(0,pr-2);r<=Math.min(TOPR,pr+1);r++)h+=row('Portal rank <span class="rl" style="color:'+RANKS[r].c+'">'+GR[r].id+'</span>','Nível '+portalLvl207(r)+' aproximado',btn(fmt(gatePrice(r))+' ouro','lx267gate',r,L.mode==='world'&&run.gold>=gatePrice(r)));
  return h}

 function roomsHtml(){if(!profile.house)return '';const x=P();let h='<div class="sec">CÔMODOS DE LUXO</div>';
  if(!ok())return h+'<div class="sysline">Ampliações da casa abrem no <b>rank C</b>.</div>';
  for(const R of ROOMS)h+=row(R.n,R.d+'. Permanente.',x.rooms[R.k]?'<b style="color:#6fe39a">Seu</b>':btn(fmt(roomPrice(R))+' ouro','lx267room',R.k,run.gold>=roomPrice(R)));
  return h}

 function spawnGate(r){if(L.mode!=='world')return false;const g=newGate();let x=player.x,z=player.z;
  for(let t=0;t<60;t++){const a=rnd(0,TAU),d=rnd(18,40);const nx=player.x+Math.cos(a)*d,nz=player.z+Math.sin(a)*d;if(nearestCity(nx,nz).d<40*CITYK)continue;if(!worldFree(nx,nz,3.5))continue;x=nx;z=nz;break}
  if(x===player.x&&z===player.z){const c=here();const a=rnd(0,TAU);x=c.x+Math.cos(a)*(52*CITYK+10);z=c.z+Math.sin(a)*(52*CITYK+10)}
  Object.assign(g,{x,z,rank:r,lvl207:portalLvl207(r),aff:[],red:false,double:false,secret:false,inverse:false,time:false,ordered267:true});gates.push(g);gateMesh(g);return g}

 function act(a,v){
  if(!a.startsWith('lx267')||!ok())return;
  const x=P();
  if(a==='lx267inv'){const c=here();if(!c||c.id!==v)return;const l=investLv(c);if(l>=5||!spendService265(investPrice(l)))return;x.invest[c.id]=l+1;regionEvent116(c,5,0,'Você investiu na cidade (nível '+(l+1)+'). Confiança +5.');sfx('coin');toast('<b>['+safeText(c.name)+']</b> Investimento nível '+(l+1)+': lojas 3% mais baratas.');save();return true}
  if(a==='lx267rel'){const c=here();if(!c||c.id!==v||x.relics[c.id]||regionState116(c).trust<50)return;if(!spendService265(relicPrice()))return;x.relics[c.id]=relicOf(c).k;refreshStats();sfx('level');toast('<b>[RELÍQUIA REGIONAL]</b> '+relicOf(c).n+': '+relicOf(c).d+'.',6000);save();return true}
  if(a==='lx267room'){const R=ROOMS.find(r=>r.k===v);if(!R||!profile.house||x.rooms[R.k]||!spendService265(roomPrice(R)))return;x.rooms[R.k]=1;refreshStats();sfx('coin');toast('<b>[CASA]</b> '+R.n+' construída.');save();return true}
  if(a==='lx267ench'){const it=run.equip[v];if(!it||(it.ench267||0)>=ENCH_MAX||!spendService265(enchPrice(it)))return;it.ench267=(it.ench267||0)+1;refreshStats();sfx('boom');toast('<b>[ENCANTAMENTO]</b> '+gearText(it.name)+' +'+it.ench267+'.');save();return true}
  if(a==='lx267merc'){const n=v==2?2:1;if(run.merc267||!spendService265(mercPrice(n)))return;run.merc267=n;sfx('coin');toast('<b>[ORDEM]</b> '+n+' mercenário'+(n>1?'s':'')+' de elite esperam você na próxima masmorra.');save();return true}
  if(a==='lx267gate'){const r=+v;if(!(r>=0&&r<=Math.min(TOPR,rankOf()+1))||L.mode!=='world'||!spendService265(gatePrice(r)))return;spawnGate(r);sfx('ding');toast('<b>[ORDEM]</b> Um portal rank '+GR[r].id+' foi aberto perto de você.',5000);save();return true}
 }

 function spawnMercs(){const n=run.merc267|0;if(!n||!L||L.mode!=='dungeon')return;run.merc267=0;const NM=['Varek','Isolde','Thorne','Maelis','Corvin','Sable'];
  for(let i=0;i<n;i++){const cls=[0,2,4,5,8][Math.floor(Math.random()*5)];makeHunterAlly({name:'Mercenário '+NM[Math.floor(Math.random()*NM.length)],cls,rank:clamp(rankOf(),0,TOPR),lvl:run.level+3,hair:0x333333},player.x+rnd(-1.5,1.5),player.z+rnd(.5,2),true)}
  toast('<b>[ORDEM]</b> Seus mercenários de elite chegaram.');saveRun()}

 /* ---------- ganchos ---------- */
 const baseStats=statsFor;statsFor=function(){const s=baseStats(),b=bonus();s.dmg*=1+b.dmg;s.maxhp=Math.round(s.maxhp*(1+b.hp));s.maxmp=Math.round(s.maxmp*(1+b.mp));s.maxsh=Math.round(s.maxsh*(1+b.sh));s.spd*=1+b.spd;s.def=Math.min(.75,s.def+b.def);return s};
 const baseQ=gearQ;gearQ=function(it){return baseQ(it)*(1+.03*((it&&it.ench267)||0))};
 const baseXp=xpReward253;xpReward253=function(x,source){const r=baseXp(x,source),m=1+bonus().xp;r.total=Math.round(r.total*m);return r};
 const baseSettle=settleEnemyRewardBalance;settleEnemyRewardBalance=function(e){const r=baseSettle(e),g=bonus().gold;if(g&&e.gold)e.gold=Math.round(e.gold*(1+g));return r};
 const baseVault=vaultCap204;vaultCap204=function(){return baseVault()+bonus().vault};
 const basePrice=priceMul;priceMul=function(kind){const c=player&&nearestCity(player.x,player.z),cut=c&&c.d<70*CITYK?.03*investLv(c.c):0;return basePrice(kind)*(1-cut)};
 const baseCity=cityTab;cityTab=function(){return baseCity()+html()};
 const baseHouse=houseView;houseView=function(){baseHouse();const H=profile.house,c=here();if(H&&c&&H.city===c.id)$('mb').insertAdjacentHTML('beforeend',roomsHtml())};
 const baseEnter=enterGate;enterGate=function(g){const r=baseEnter(g);if(L.mode==='dungeon')setTimeout(spawnMercs,600);return r};
 const baseExtra=extraActions;extraActions=function(a,v){if(typeof a==='string'&&a.startsWith('lx267'))return act(a,v);return baseExtra(a,v)};
 return {bonus,html,roomsHtml,act,RELICS,ROOMS,relicOf,investLv,enchPrice,H};
})();
