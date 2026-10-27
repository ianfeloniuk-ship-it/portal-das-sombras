/* v545 (Ian, 22/10/2026, áudio): "poder atacar NPCs aleatoriamente dentro da cidade, fora da cidade, que nem em Skyrim …
   ele te ataca de volta. Dentro da cidade, dependendo do cidadão, se ele é da cidade ou de outra cidade … se virem,
   obviamente tu vai ficar falado na cidade e perder reputação."
   ATACAR  golpe corpo a corpo (alcance do básico) e tiros do jogador acertam NPCs. Crianças não são atingidas.
           Quem apanha revida: moradores e viajantes com socos fracos, guardas com força de verdade. Desiste se você
           se afastar 30 m ou ficar 25 s sem bater. Vendedores e personagens da história não morrem: caem e levantam.
   CRIME   só conta se alguém viu (outro NPC a até 22 m, guarda a até 35 m; a própria vítima vê a agressão).
           Cidadão da cidade: agressão = 40 de recompensa, morte = 1000, naquela cidade, e a confiança dela cai (2 / 10).
           Gente de fora (viajante, caçador, encontro na estrada): sem recompensa, mas se alguém viu você fica falado
           e a confiança da cidade cai do mesmo jeito. Ninguém viu: nada acontece. Ladrão (de noite) não conta.
   GUARDA  com recompensa na cidade, os guardas de lá vêm até você e falam: pagar (some a recompensa) ou resistir
           (todos os guardas da cidade atacam até você pagar). Não há cela. Os textos do guarda ficam em dialogo520.js. */
(function(){
'use strict';
if(typeof attack!=='function'||typeof updNpc!=='function'||typeof hurtPlayer!=='function')return;
const C=window.Crime545={};
const now=()=>(typeof time==='number'?time:performance.now()/1000);
const ASSAULT=40,MURDER=1000;
const KILLABLE=/^(morador|citizen|hunter|traveler|emergent|emergent_skyrim)$/;
const LINES={hit:['Ei! Qual é o seu problema?','Você ficou louco?!','Pare com isso!','Guardas! Socorro!'],guard:['Você vai pagar por isso!','Em nome da lei, pare!'],down:['Chega… chega…'],seen:['Guardas! Ele atacou alguém!','Assassino!','Eu vi o que você fez!']};
const pick=a=>a[Math.floor(Math.random()*a.length)];

/* ---------- quem é quem ---------- */
const isGuard=n=>n.role523==='guarda';
const isThief=n=>n.role523==='ladrao';
function target(n){return n&&!n.alma545&&!n.gone&&!n.dead545&&n.kind!=='deco'&&!n.kid527&&!n.talk575&&n.m&&n.m.root&&n.m.root.visible!==false&&!(typeof inConversation==='function'&&inConversation())}
const essential=n=>!KILLABLE.test(n.kind||'')&&!isGuard(n);
function cityAt(x,z){try{const q=nearestCity(x,z);return q&&q.c&&q.d<90&&q.c.name?q.c:null}catch(_){return null}}
/* morador da cidade: moradores, guardas e vendedores daquela cidade; caçadores, viajantes e encontros são de fora */
const fromHere=(n,c)=>!!(c&&n.home&&(n.home===c||n.home.id===c.id)&&!/^(hunter|traveler|emergent|emergent_skyrim)$/.test(n.kind||''));
function maxHp(n){if(n.hpMax545)return n.hpMax545;const P=player;n.hpMax545=isGuard(n)?Math.max(300,Math.round(P.maxhp*2.5)):n.kind==='hunter'?Math.max(150,Math.round(P.maxhp)):essential(n)?80:50;n.hp545=n.hpMax545;return n.hpMax545}

/* ---------- recompensa ---------- */
function book(){if(!profile.bounty545)profile.bounty545={};if(!profile.resist545)profile.resist545={};return profile}
C.bounty=c=>c?(book().bounty545[c.id]||0):0;
C.resisting=c=>!!(c&&book().resist545[c.id]);
C.pay=c=>{const b=C.bounty(c);if(!b||run.gold<b)return false;run.gold-=b;delete book().bounty545[c.id];delete profile.resist545[c.id];calmGuards(c);store.set('pds2_profile',profile);saveRun();banner('Recompensa paga em '+c.name);return true};
C.resist=c=>{if(!c)return;book().resist545[c.id]=true;store.set('pds2_profile',profile);for(const n of npcs)if(isGuard(n)&&fromHere(n,c)&&!n.gone)anger(n,true);banner('Você resistiu à prisão em '+c.name)};
function calmGuards(c){for(const n of npcs)if(isGuard(n)&&fromHere(n,c)){n.hostile545=false;if(n.chase523===player)n.chase523=null}}
function addBounty(c,v){book().bounty545[c.id]=(profile.bounty545[c.id]||0)+v;store.set('pds2_profile',profile);banner(v+' de recompensa em '+c.name)}
function talk(c,trust,reason){try{regionEvent116(c,-trust,0,reason)}catch(_){}}

let bannerEl=null,bannerT=0;
function banner(t){if(!bannerEl){bannerEl=document.createElement('div');bannerEl.id='crime545';bannerEl.style.cssText='position:fixed;top:64px;left:22px;z-index:950;pointer-events:none;font:400 17px "Jost","Chakra Petch",sans-serif;letter-spacing:1px;color:#f4f1ea;text-shadow:0 1px 5px #000,0 0 10px #000;opacity:0;transition:opacity .35s';document.body.appendChild(bannerEl)}
  bannerEl.textContent=t;bannerEl.style.opacity='1';clearTimeout(bannerT);bannerT=setTimeout(()=>{bannerEl.style.opacity='0'},4200)}
function say(n,l){try{speech153(n,l,'')}catch(_){try{floater(n.x,n.z,l,'#ffe0c0')}catch(__){}}}

function witnesses(v,x,z){let seen=false,guard=false;
  for(const n of npcs){if(n===v||n.alma545||n.gone||n.dead545||n.kind==='deco'||!n.m||n.m.root.visible===false)continue;const d=Math.hypot(n.x-x,n.z-z);
    if(isGuard(n)&&d<35){seen=guard=true}else if(d<22){seen=true;if(!n.hostile545&&Math.random()<.5)say(n,pick(LINES.seen))}}
  return {seen,guard}}

function crime(v,killed){
  if(isThief(v))return;
  const c=cityAt(v.x,v.z),w=witnesses(v,v.x,v.z),local=fromHere(v,c),seen=w.seen||(local&&!killed);/* agressão a morador: a vítima denuncia */
  if(!c||!seen)return;
  if(local){
    if(killed)addBounty(c,MURDER);else if(!v.assaulted545){v.assaulted545=true;addBounty(c,ASSAULT)}else return;
    talk(c,killed?10:2,killed?'Mataram um morador da cidade e o povo sabe quem foi.':'Um morador foi agredido em plena rua.');
  }else if(killed||!v.talked545){v.talked545=true;talk(c,killed?10:2,killed?'Um forasteiro foi morto perto da cidade. Todos comentam o nome de quem fez.':'Viram você agredir um forasteiro. O caso correu a cidade.')}
}

/* ---------- dano no NPC ---------- */
function anger(n,quiet){n.hostile545=true;n.calm545=now()+25;n.wait=0;n.path=[];if(!quiet)say(n,pick(isGuard(n)?LINES.guard:LINES.hit))}
function hitNpc(n,dmg){
  if(!target(n)||!(dmg>0)||(typeof inConversation==='function'&&inConversation())||n.talk575)return false;maxHp(n);
  dmg=Math.max(1,Math.round(dmg));n.hp545=Math.max(0,n.hp545-dmg);n.lastHit545=now();
  try{floater(n.x,n.z,'-'+dmg,'#ff6b6b')}catch(_){}
  if(n.hp545<=0){
    if(essential(n)){n.knock545=now()+10;n.hostile545=false;n.hp545=0;say(n,pick(LINES.down));crime(n,false);return true}
    die(n);return true}
  if(!n.hostile545)anger(n);else n.calm545=now()+25;
  crime(n,false);return true}
function die(n){
  crime(n,true);/* antes de mudar o tipo: o tipo diz se era da cidade */
  n.dead545=true;n.hostile545=false;n.deadAt545=now();try{window.Povo655&&Povo655.morreu(n)}catch(_){}n.vida523=false;n.label='';n.kind='deco';n.noLabel=true;
  try{floater(n.x,n.z,(n.short||n.name||'Morador')+' morreu','#ef4444',true)}catch(_){}}
C.hit=hitNpc;

/* golpe corpo a corpo: mesmo alcance do básico (2,6 m; 3,1 m no terceiro golpe) */
const A0=attack;
attack=function(){
  if(typeof inConversation==='function'&&inConversation())return;
  const cd=player?.atkCd||0,np=(typeof projs!=='undefined'&&projs)?projs.length:0;
  const r=A0.apply(this,arguments);
  try{if(player&&player.atkCd>cd&&L.mode==='world'&&projs.length===np&&!(typeof inConversation==='function'&&inConversation())){
    const third=player.combo===3,reach=third?3.1:2.6,arc=third?1.3:1.0,dmg=player.dmg*(third?1.8:1);
    for(const n of npcs){if(!target(n))continue;const dx=n.x-player.x,dz=n.z-player.z,d=Math.hypot(dx,dz);if(d>reach+.4)continue;
      let a=Math.atan2(dx,dz)-player.face;a=Math.atan2(Math.sin(a),Math.cos(a));if(Math.abs(a)<=arc||d<1)hitNpc(n,dmg)}}}catch(e){console.warn('crime545',e)}
  return r};

/* ---------- NPC que revida, caído ou morto ---------- */
const U0=updNpc;
updNpc=function(n,dt){
  if(n.dead545){try{animChibi(n.m,{move:0,atk:0,dead:1,wind:0},(n.t=(n.t||0)+dt))}catch(_){}n.m.root.position.set(n.x,0,n.z);
    if(now()-n.deadAt545>900||(player&&Math.hypot(player.x-n.x,player.z-n.z)>160)){n.gone=true;try{scene.remove(n.m.root)}catch(_){}}return}/* v655: o corpo fica até você se afastar (ou 15 min) */
  if(n.knock545){if(now()<n.knock545){try{animChibi(n.m,{move:0,atk:0,dead:1,wind:0},(n.t=(n.t||0)+dt))}catch(_){}return}n.knock545=0;n.hp545=n.hpMax545}
  if(!n.hostile545)return U0.apply(this,arguments);
  const P=player,c=n.home;
  if(!P||P.dead||Math.hypot(P.x-n.x,P.z-n.z)>30||(now()>n.calm545&&!(isGuard(n)&&C.resisting(c)))){n.hostile545=false;n.wait=0;n.tx=n.x;n.tz=n.z;return U0.apply(this,arguments)}
  n.t=(n.t||0)+dt;const dx=P.x-n.x,dz=P.z-n.z,d=Math.hypot(dx,dz)||1;turnTo(n,Math.atan2(dx,dz),dt,8);
  let mv=0;if(d>1.4){const sp=(isGuard(n)?5.2:4.2)*dt;moveEnt(n,dx/d*sp,dz/d*sp);mv=1}
  n.atkCd545=(n.atkCd545||0)-dt;n.atkA545=Math.max(0,(n.atkA545||0)-dt*3);
  if(d<=1.8&&n.atkCd545<=0){n.atkCd545=isGuard(n)?1.0:1.3;n.atkA545=1;const dmg=isGuard(n)?Math.max(8,Math.round(P.maxhp*.06)):Math.max(2,Math.round(P.maxhp*.02));try{hurtPlayer(dmg)}catch(_){}}
  try{animChibi(n.m,{move:mv,atk:n.atkA545,dead:0,wind:0},n.t)}catch(_){}
  n.m.root.position.set(n.x,0,n.z);n.m.root.rotation.y=n.face};

/* ---------- tiros, guardas que vêm cobrar ---------- */
let lastStop=-99;
const UP0=update;
update=function(dt){
  const r=UP0.apply(this,arguments);
  try{if(L.mode!=='world'||!player||player.dead)return r;
    for(const p of projs){if(p.team!=='player'||!(p.life>0))continue;
      for(const n of npcs){if(!target(n)||p.hit.has(n))continue;if(Math.hypot(n.x-p.x,n.z-p.z)>(p.r||.4)+.5)continue;p.hit.add(n);hitNpc(n,p.dmg);if(!p.pierce){p.life=0;break}}}
    const c=cityAt(player.x,player.z);
    if(c&&C.bounty(c)>0){
      for(const n of npcs){if(!isGuard(n)||n.gone||n.dead545||!fromHere(n,c))continue;
        if(C.resisting(c)){if(!n.hostile545)anger(n,true);continue}
        const d=Math.hypot(n.x-player.x,n.z-player.z);if(d<40&&!n.hostile545)n.chase523=player;
        if(d<3&&!modalOpen&&now()-lastStop>30&&window.Dialogo520&&!document.getElementById('skyrim-dialog')){lastStop=now();Dialogo520.vida(n)}}}
  }catch(e){console.warn('crime545',e)}
  return r};
})();
