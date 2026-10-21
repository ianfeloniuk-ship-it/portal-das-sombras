/* v295 (Ian): biomas mais longos e com efeito no personagem (bônus ou penalidade),
   e itens no Mercado (Dorian) que anulam a penalidade de um bioma por 5 minutos de jogo.
   v441: Deserto de Zahar (5,0) com queda acelerada de Sede pelo calor árido; Montanhas Glaciais de Ymiria (0,-5)
   com penalidade de Frio/Congelamento neutralizada por Fogueiras com Feixes de Lenha, Tochas com Resina ou Chá Térmico. */
(function(){
// Garante que a região em torno das capitais canônicas tenha o bioma oficial (Zahar = deserto, Ymiria = neve)
if(typeof biomeAt==='function'&&!biomeAt.cap441){
 const b0=biomeAt;
 biomeAt=function(x,z){
  try{
   if(typeof regionCity==='function'){
    const zah=regionCity(2,0),ymi=regionCity(0,-2) /* v500: mapa finito */;
    if(zah&&Math.hypot(x-zah.x,z-zah.z)<560)return 'deserto';
    if(ymi&&Math.hypot(x-ymi.x,z-ymi.z)<560)return 'neve';
   }
  }catch(_){}
  return b0.apply(this,arguments);
 };
 biomeAt.cap441=true;
}
function warmSource441(){
 try{
  if(window.Living372&&Living372.sheltered())return 'abrigo';
  const s=typeof run!=='undefined'&&run?.surv437;
  if(s){
   if(s.torchT>0)return 'Tocha com Resina';
   if(s.chaT>0)return 'Chá Térmico';
  }
  const sites=typeof run!=='undefined'&&run?.build437;
  if(sites&&typeof player!=='undefined'&&player){
   for(const q of sites)if((q.t==='fogueira'||q.t==='cabana')&&(q.fuel>0)&&Math.hypot(q.x-player.x,q.z-player.z)<9.5)return 'Fogueira acesa';
  }
 }catch(_){}
 return null;
}
const FX={
 campos:{n:'Campos',d:'Clima ameno. Sem efeitos.'},
 flores:{n:'Campos floridos',d:'Ar perfumado: fora de combate, recupera 1% da vida a cada 3 segundos.',regen:.01/3,good:true},
 floresta:{n:'Floresta',d:'Sombras densas: +5% de chance de crítico.',crit:.05,good:true},
 cristal:{n:'Cavernas de cristal',d:'Mana no ar: +25% de regeneração de mana.',mana:.25,good:true},
 deserto:{n:'Deserto',d:'Calor árido: o cansaço chega 2× mais rápido e o estamina volta 25% mais devagar.',tired:2,vigor:-.25,thirst:2.35,item:'cantil'},
 neve:{n:'Neve',d:'Frio glacial: −12% de velocidade, −20% de regeneração de mana e Congelamento longe de calor (use Fogueira com Feixes de Lenha, Tocha com Resina ou Chá Térmico).',move:-.12,mana:-.2,cold:1,item:'capa'},
 vulcao:{n:'Vulcão',d:'Ar quente: perde 1% da vida a cada 3 segundos (nunca abaixo de 20%).',burn:.01/3,item:'unguento'},
 pantano:{n:'Pântano',d:'Lama funda: −10% de velocidade de movimento e o estamina volta 15% mais devagar.',move:-.1,vigor:-.15,item:'botas'}};
const ITEMS={cantil:{n:'Cantil de couro',d:'anula o calor do deserto',b:'deserto',p:30},capa:{n:'Capa de pele',d:'anula o frio da neve',b:'neve',p:30},unguento:{n:'Unguento refrescante',d:'anula o ar quente do vulcão',b:'vulcao',p:40},botas:{n:'Botas de lodo',d:'anulam a lama do pântano',b:'pantano',p:30}};
const DUR=300;
function gear(){run.bioGear295=run.bioGear295||{};return run.bioGear295}
function here(){try{return (typeof L!=='undefined'&&L.mode==='world'&&player)?biomeAt(player.x,player.z):null}catch(_){return null}}
function fx(){if(window.Intro401?.guided())return null;const b=here();const f=b&&FX[b];if(!f)return null;if(b==='neve'){const w=warmSource441();if(w)return {n:f.n,protegido:true,warmBy:w};}if(window.Living372&&b==='pantano'&&run.clanRespect372&&!gear()[f.item])return {...f,move:-.05};if(f.item&&gear()[f.item]>0)return {n:f.n,protegido:true,warmBy:ITEMS[f.item].n};return f}
function price(k){const g=(typeof GR!=='undefined'&&GR[Math.min(9,rankOf())])?GR[Math.min(9,rankOf())].gold:1;return Math.round(ITEMS[k].p*g)}
// ---- efeitos ----
const ms0=movementSpeed;movementSpeed=function(raw){const f=fx(),c=(run?.surv437?.cold441||0)>60?-.08:0;return ms0(f&&f.move?raw*(1+f.move+c):raw)};
const cc0=critChance;critChance=function(){const f=fx();return cc0()+(f&&f.crit?f.crit:0)};
const mr0=pManaRegen281;pManaRegen281=function(){const f=fx();return (1+mr0())*(1+(f&&f.mana?f.mana:0))-1};
const vr0=pVigorRegen281;pVigorRegen281=function(){const f=fx();return (1+vr0())*(1+(f&&f.vigor?f.vigor:0))-1};
let last=null,acc=0,lastT=performance.now(),frzHurt=0;
function tick(){const now=performance.now(),dt=Math.min(1,(now-lastT)/1000);lastT=now;try{if(typeof started==='undefined'||!started||!run||!player||player.dead||paused)return;
  const G=gear();for(const k in G){G[k]-=dt;if(G[k]<=0){delete G[k];try{toast('<b>[VIAGEM]</b> O efeito de '+ITEMS[k].n+' acabou.',3500)}catch(_){}}}
  if(window.Intro401?.guided())return;
  const b=here(),f=fx(),s=run.surv437;
  if(b&&b!==last){last=b;const F=FX[b];if(F&&b!=='campos')try{toast('<b>['+F.n.toUpperCase()+']</b> '+(f&&f.protegido?'Você está protegido por '+(f.warmBy||ITEMS[F.item].n)+'.':F.d)+(F.item&&!(f&&f.protegido)?' O Mercado vende '+ITEMS[F.item].n+'.':''),5500)}catch(_){}}
  if(s){
   if(b==='neve'&&f&&!f.protegido){
    s.cold441=Math.min(100,(s.cold441||0)+dt*4.5);
    if(s.cold441>=100){frzHurt-=dt;if(frzHurt<=0&&player.hp>player.maxhp*.12){frzHurt=3;player.hp=Math.max(player.maxhp*.12,player.hp-player.maxhp*.02);try{floater(player.x,player.z,'CONGELANDO','#9fe8ff')}catch(_){}}}
   }else if(s.cold441>0){
    s.cold441=Math.max(0,s.cold441-dt*(warmSource441()?18:8));
   }
  }
  if(!f)return;
  if(f.tired&&run.awake287!=null)run.awake287+=dt*(f.tired-1);
  const fight=enemies.some(e=>!e.dead&&!e.ally&&Math.hypot(e.x-player.x,e.z-player.z)<14);
  if(f.regen&&!fight&&!hasAff('nocure'))player.hp=Math.min(player.maxhp,player.hp+player.maxhp*f.regen*dt);
  if(f.burn&&player.hp>player.maxhp*.2)player.hp=Math.max(player.maxhp*.2,player.hp-player.maxhp*f.burn*dt);
 }catch(_){}}
setInterval(tick,250);
// ---- Mercado ----
const mv0=mktView;mktView=function(){mv0();try{const mb=document.getElementById('mb');if(!mb)return;const G=gear();let h='<div class="sec">EQUIPAMENTO DE VIAGEM</div><div class="sysline" style="font-size:12px">Cada bioma muda o personagem. Estes itens anulam a penalidade de um bioma por 5 minutos de jogo.</div>';
  for(const k in ITEMS){const I=ITEMS[k],left=G[k]>0?Math.ceil(G[k]):0;h+=row('<b>'+I.n+'</b>',I.d+' ('+FX[I.b].d+')'+(left?' · <b style="color:#6fe39a">ativo: '+Math.floor(left/60)+'min '+(left%60)+'s</b>':''),btn(fmt(price(k))+' ouro','bio295buy',k,run.gold>=price(k)))}
  h+='<div class="sysline" style="font-size:12px">Biomas bons: <b>Floresta</b> (+5% crítico), <b>Campos floridos</b> (recupera vida fora de combate), <b>Cavernas de cristal</b> (+25% de regeneração de mana).</div>';
  mb.insertAdjacentHTML('beforeend',h)}catch(_){}};
const ea0=extraActions;extraActions=function(a,v){if(a==='bio295buy'){const I=ITEMS[v];if(!I)return;const p=price(v);if(run.gold<p)return;run.gold-=p;gear()[v]=(gear()[v]>0?gear()[v]:0)+DUR;try{sfx('buy')}catch(_){}toast('<b>[MERCADO]</b> '+I.n+' ativo por 5 minutos.',3500);saveRun();mktView();return 'close0'}return ea0(a,v)};
window.Biomes295={FX,ITEMS,here,fx,warmSource441};
})();
