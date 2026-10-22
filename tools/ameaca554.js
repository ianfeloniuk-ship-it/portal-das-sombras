/* v554 (Ian, 22/10/2026): NPCs da cidade reagem a ameaças.
   1. IDLE  vendedores nomeados (Citizens133: malha sem esqueleto) ganham respiração, troca de apoio, olhar em volta e
            encolhem de medo com ameaça perto. Eles continuam no posto (NPC essencial: não fogem, não morrem).
   2. DEFESA guardas (role523 'guarda') e caçadores da cidade (Marcos, Kallan e os outros): com monstro agressivo ou invasor
            a menos de 40 m, sacam a arma, correm até ele e batem a cada ~1 s com `hurtEnemy` (dano real, passa a muralha).
            O monstro revida no defensor (o defensor cai por 10 s, nunca morre). Fim da ameaça: guardam a arma e voltam à rotina.
   3. CIVIS moradores/cidadãos fogem do monstro (a 22 m), gritam, se encolhem e retomam a rotina 4 s depois que acaba.
   4. HUD   nome + vida de NPC ao mirar (a 12 m) ou 4 s depois de apanhar/lutar.
   Custo: um único varrer da lista de inimigos a cada 0,4 s (só se há NPC por perto); `Ameaca554.stats` mede (ms médios). */
(function(){
'use strict';
if(typeof updNpc!=='function'||typeof hurtEnemy!=='function'||typeof enemies==='undefined')return;
const A=window.Ameaca554={on:true,stats:{scans:0,ms:0,hits:0,fled:0,fights:0,maxThreats:0}};
const now=()=>(typeof time==='number'?time:performance.now()/1000);
const D=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const isGuard=n=>n.role523==='guarda';
const isDefender=n=>(isGuard(n)||n.kind==='hunter')&&!!n.home;
const isCivil=n=>(n.kind==='morador'||n.kind==='citizen')&&!isGuard(n)&&n.role523!=='ladrao';
const raider=e=>{try{return cityRaider341(e)}catch(_){return false}};
const down=n=>n.gone||n.dead545||n.knock545;
const R_ENGAGE=40,R_FLEE=22,R_CITY=70;
const pick=a=>a[Math.floor(Math.random()*a.length)];

/* ---------- varredura única de ameaças (cacheada) ---------- */
let threats=[],scanAt=-9;
function scan(){
  const t=now();if(t-scanAt<.4)return threats;scanAt=t;
  const t0=performance.now();threats=[];
  if(!player||player.dead||L.mode!=='world'){return threats}
  for(const e of enemies){
    if(!e||e.dead||e.gone||e.hp<=0||e.friendly217||e.ally||e.duel372)continue;
    if(!(e.aggro||raider(e)))continue;
    if(D(e,player)>260)continue;
    let c=null;try{const q=nearestCity(e.x,e.z);if(q&&q.c&&q.d<R_CITY&&!cityFallen(q.c))c=q.c}catch(_){}
    if(!c)continue;
    threats.push(e)}
  A.stats.scans++;A.stats.ms+=performance.now()-t0;A.stats.maxThreats=Math.max(A.stats.maxThreats,threats.length);
  return threats}
function nearest(n,r){let b=null,bd=r;for(const e of threats){if(e.dead||e.gone)continue;const d=D(e,n);if(d<bd){bd=d;b=e}}return b}

/* ---------- arma na mão só em combate ---------- */
function weapon(n,show){
  const m=n.m;if(!m)return;
  if(m.wnodes&&m.wnodes.length)for(const w of m.wnodes)if(w.visible!==show)w.visible=show;
  if(m.wep&&m.wep.visible!==show&&m.wep.isObject3D)m.wep.visible=show;
  if(m.socket&&m.socket.visible!==show&&m.wnodes&&m.wnodes.length)m.socket.visible=show}

/* ---------- dano ---------- */
function atkDmg(n){return n.kind==='hunter'?Math.round(12+(n.rank||0)*7):Math.max(14,Math.round((player?.maxhp||100)*.08))}
function hurtDefender(n,amt){
  if(n.hpMax545==null){n.hpMax545=n.hpMax545||(isGuard(n)?Math.max(300,Math.round((player?.maxhp||100)*2.5)):n.kind==='hunter'?Math.max(150,Math.round(player?.maxhp||100)):80);n.hp545=n.hpMax545}
  n.hp545=Math.max(0,n.hp545-Math.round(amt));n.lastHit545=now();
  if(n.hp545<=0){n.knock545=now()+10;n.hp545=0;n.combat554=false;n.foe554=null;try{floater(n.x,n.z,'CAIU','#ffb0a0')}catch(_){}}}

/* ---------- combate do defensor ---------- */
function fight(n,dt,e){
  const dx=e.x-n.x,dz=e.z-n.z,d=Math.hypot(dx,dz)||1;
  if(!n.combat554){n.combat554=true;A.stats.fights++;try{speech153(n,pick(['Em guarda! Ameaça na cidade!','Defendam o povo!','Monstro! Comigo!']),'')}catch(_){}}
  n.t=(n.t||0)+dt;n.wait=0;n.path=[];n.tx=n.x;n.tz=n.z;
  turnTo(n,Math.atan2(dx,dz),dt,9);
  let mv=0;
  if(d>2.1){const sp=(n.kind==='hunter'?4.8:5.2)*dt;moveEnt(n,dx/d*sp,dz/d*sp);mv=1}
  n.atkCd554=(n.atkCd554||0)-dt;n.atkA554=Math.max(0,(n.atkA554||0)-dt*3);
  if(d<=2.6&&n.atkCd554<=0){
    n.atkCd554=1.1;n.atkA554=1;
    const dmg=atkDmg(n);
    try{hurtEnemy(e,dmg,n.x,n.z,{guard343:1,kb:1,npc554:1});A.stats.hits++;try{fxBurst(e.x,1.1,e.z,0xffe0a0,8,5)}catch(_){}}catch(_){}
    e.aggro=true;e.foe554=n;
    /* o monstro revida no defensor (sem lei de morte: cai por 10 s) */
    if(e.dmg>0)hurtDefender(n,Math.max(2,e.dmg*.35))}
  weapon(n,true);
  try{animChibi(n.m,{move:mv,atk:n.atkA554,dead:0,wind:0},n.t)}catch(_){}
  n.m.root.position.set(n.x,0,n.z);n.m.root.rotation.y=n.face}

/* ---------- civil em pânico ---------- */
function flee(n,dt,e){
  if(!n.panic554){n.panic554=true;A.stats.fled++;try{floater(n.x,n.z,pick(['SOCORRO!','Monstro!','Corram!']),'#ffd7b0')}catch(_){}}
  n.pT554=now()+4;n.t=(n.t||0)+dt;n.wait=0;n.path=[];
  const dx=n.x-e.x,dz=n.z-e.z,d=Math.hypot(dx,dz)||1,c=n.home;
  /* foge para longe do monstro, puxando para o centro da cidade (casas e guardas) */
  let ux=dx/d,uz=dz/d;if(c){const cx=c.x-n.x,cz=c.z-n.z,cl=Math.hypot(cx,cz)||1;ux+=cx/cl*.5;uz+=cz/cl*.5;const l=Math.hypot(ux,uz)||1;ux/=l;uz/=l}
  const mv=d<R_FLEE?1:0;
  turnTo(n,Math.atan2(ux,uz),dt,8);if(mv)moveEnt(n,ux*5.6*dt,uz*5.6*dt);
  try{animChibi(n.m,{move:mv,atk:0,dead:0,wind:0},n.t)}catch(_){}
  n.m.root.position.set(n.x,0,n.z);n.m.root.rotation.y=n.face}

/* ---------- Idle dos vendedores (malha sem esqueleto) ---------- */
function idleVendor(n,dt,fear){
  const m=n.m;if(!m||!m.citizen133||!m.body)return;
  const t=n.t||0,seed=(n.seed554||(n.seed554=Math.random()*20)),b=m.body;
  const breath=Math.sin(t*1.7+seed),shift=Math.sin(t*.45+seed*1.3),look=Math.sin(t*.23+seed)*.5+Math.sin(t*.61+seed*2)*.5;
  const f=n.fear554=(n.fear554||0)+((fear?1:0)-(n.fear554||0))*Math.min(1,dt*4);
  b.scale.y=1+breath*.008-f*.035;b.scale.x=b.scale.z=1+breath*.004+f*.012;
  b.rotation.z=shift*.022+f*.03;b.rotation.x=f*.10;b.position.y=Math.max(0,shift)*.012;
  if(!fear){const P=player;if(!P||Math.hypot(P.x-n.x,P.z-n.z)>8)n.face+=(((n.face0554==null?(n.face0554=n.face):n.face0554)+look*.5)-n.face)*Math.min(1,dt*.8)}
  m.root.rotation.y=n.face}

/* ---------- gancho principal ---------- */
const U0=updNpc;
updNpc=function(n,dt){
  if(!A.on||!n||!n.m||L.mode!=='world')return U0.apply(this,arguments);
  if(n.kind==='vendor'&&n.m.citizen133){
    U0.apply(this,arguments);
    const th=threats.length?nearest(n,26):null;n.t=n.t||0;idleVendor(n,dt,!!th);return}
  if(down(n)||n.hostile545)return U0.apply(this,arguments);
  if(!threats.length&&!n.combat554&&!n.panic554){if(isDefender(n))weapon(n,false);return U0.apply(this,arguments)}
  if(isDefender(n)){
    const e=nearest(n,R_ENGAGE);
    if(e){fight(n,dt,e);return}
    if(n.combat554){n.combat554=false;n.foe554=null;n.tx=n.x;n.tz=n.z;n.wait=0;weapon(n,false)}
    else weapon(n,false);
    return U0.apply(this,arguments)}
  if(isCivil(n)){
    const e=nearest(n,R_FLEE+6);
    if(e){flee(n,dt,e);return}
    if(n.panic554&&now()<n.pT554){n.t=(n.t||0)+dt;try{animChibi(n.m,{move:0,atk:0,dead:0,wind:0},n.t)}catch(_){}return}
    n.panic554=false}
  return U0.apply(this,arguments)};

/* varredura: junto do loop do jogo, só com NPC perto */
const UP0=update;
update=function(dt){const r=UP0.apply(this,arguments);try{if(A.on&&L.mode==='world')scan()}catch(e){console.warn('ameaca554',e)}return r};

/* ---------- HUD: nome + vida de NPC ao mirar ou ao apanhar ---------- */
let hud=null,hudN=null;
function mkHud(){hud=document.createElement('div');hud.id='npc554';hud.style.cssText='position:fixed;top:92px;left:50%;transform:translateX(-50%);z-index:940;pointer-events:none;min-width:190px;text-align:center;font:400 15px "Jost","Chakra Petch",sans-serif;letter-spacing:1px;color:#f4f1ea;text-shadow:0 1px 5px #000,0 0 10px #000;opacity:0;transition:opacity .2s';
  hud.innerHTML='<div class="nm"></div><div style="height:6px;margin-top:4px;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.25)"><div class="hp" style="height:100%;width:100%;background:#c0443a"></div></div>';document.body.appendChild(hud)}
function focusNpc(){
  const P=player;let b=null,bs=1e9;
  for(const n of npcs){if(n.gone||n.dead545||n.kind==='deco'||n.kid527||!n.m||n.m.root.visible===false)continue;
    const dx=n.x-P.x,dz=n.z-P.z,d=Math.hypot(dx,dz);if(d>12)continue;
    let a=Math.atan2(dx,dz)-P.face;a=Math.abs(Math.atan2(Math.sin(a),Math.cos(a)));if(a>.35&&d>2)continue;
    const s=d+a*10;if(s<bs){bs=s;b=n}}
  return b}
setInterval(()=>{try{
  if(!started||L.mode!=='world'||!player||player.dead||modalOpen){if(hud)hud.style.opacity=0;return}
  if(!hud)mkHud();
  let n=null;const t=now();
  for(const x of npcs)if(x.lastHit545&&t-x.lastHit545<4&&!x.gone&&!x.dead545){n=x;break}
  if(!n)n=focusNpc();
  if(!n){hud.style.opacity=0;return}
  const mx=n.hpMax545||(isGuard(n)?Math.max(300,Math.round(player.maxhp*2.5)):n.kind==='hunter'?Math.max(150,Math.round(player.maxhp)):n.kind==='vendor'?80:50);
  const hp=n.hp545==null?mx:n.hp545;
  hud.querySelector('.nm').textContent=(n.short||n.name||'')+(n.job523?' · '+n.job523:n.sign?' · '+n.sign:'');
  hud.querySelector('.hp').style.width=Math.max(0,Math.min(100,hp/mx*100))+'%';
  hud.style.opacity=1}catch(e){}},150);
A.focus=focusNpc;A.scan=scan;A.threats=()=>threats;
})();
