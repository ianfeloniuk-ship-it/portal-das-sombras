/* v541 (Ian, 22/10/2026, áudios estilo Skyrim): "cada uma gasta tipo um de mana por segundo que você está atacando" e
   "girando [a rodinha] tu consegue escolher as armas … também pode apertar um, dois, três ou quatro".
   LOTE   até 4 armas do próprio jogador (a equipada + as da bolsa, na ordem em que entraram). Não há barra na tela:
          girar a rodinha do mouse ou apertar 1–4 troca a arma na mão. Apertar a rodinha continua sendo defender (Guard472).
          A troca não passa pelo bloqueio de estilo: arma mágica põe o ataque básico arcano, arma física o físico.
   MANA   o ataque básico mágico gasta 1 de mana a cada segundo atacando, e a mana não regenera enquanto você ataca.
          Sem mana, o ataque mágico não sai: troque para uma arma física. */
(function(){
'use strict';
if(typeof attack!=='function'||typeof update!=='function')return;
const L=window.Lote541={size:4};
const MAG=/^(staff|bonestaff|wand|tome|orb)$/,PHY=/^(sword|axe|mace|spear|hammer|bow|dagger|firearm)$/;
const kind=w=>{try{return weaponKind272(w)||''}catch(_){return w?.kind155||''}};
const magicWeapon=w=>MAG.test(kind(w));
function basicMagicNow(){const k=kind(run.equip.w);if(PHY.test(k))return false;if(MAG.test(k))return true;try{return basicIsMagic()}catch(_){return false}}
const now=()=>(typeof time==='number'?time:performance.now()/1000);

/* ---------- lote: uids das armas que o jogador tem ---------- */
function owned(){if(!run)return [];return [run.equip?.w,...(run.items||[])].filter(it=>it&&it.slot==='w'&&it.uid)}
function lote(){
  if(!run)return [];const have=owned(),ids=new Set(have.map(it=>it.uid));
  let l=Array.isArray(run.lote541)?run.lote541.filter(u=>ids.has(u)):[];
  for(const it of have){if(l.length>=L.size)break;if(!l.includes(it.uid))l.push(it.uid)}
  run.lote541=l;return l}
L.list=()=>{const have=owned();return lote().map(u=>have.find(it=>it.uid===u))};

function switchTo(uid){
  if(!run||!player||player.dead||!started||paused||modalOpen)return false;
  const cur=run.equip.w;if(cur&&cur.uid===uid)return false;
  const i=run.items.findIndex(x=>x.uid===uid);if(i<0)return false;
  const it=run.items[i];run.items.splice(i,1);if(cur)run.items.push(cur);run.equip.w=it;
  const mag=magicWeapon(it);let canArc=false;try{canArc=canUseMagicStyle()}catch(_){}
  run.style=isMagic()?(mag?'nat':'off'):(mag&&canArc?'arc':'nat');
  try{resetBasicPose259()}catch(_){}
  refreshStats();saveRun();
  try{floater(player.x,player.z,it.name,mag?'#9cc8ff':'#f3e3c0')}catch(_){}
  sfx?.('swing');return true}
L.select=n=>{const l=lote();return l[n]?switchTo(l[n]):false};
L.step=d=>{const l=lote();if(l.length<2)return false;const at=Math.max(0,l.indexOf(run.equip.w?.uid));return switchTo(l[(at+d+l.length)%l.length])};

let wheelAcc=0,wheelT=0;
document.getElementById('c')?.addEventListener('wheel',e=>{
  if(touch||!started||paused||modalOpen)return;e.preventDefault();
  if(performance.now()-wheelT>400)wheelAcc=0;wheelT=performance.now();wheelAcc+=e.deltaY;
  if(Math.abs(wheelAcc)<60)return;L.step(wheelAcc>0?1:-1);wheelAcc=0},{passive:false});

/* ---------- mana: 1 por segundo atacando com magia ---------- */
let channelUntil=-9,acc=0,warnT=-9;
const A0=attack;
attack=function(){
  if(player&&!player.dead&&!paused&&player.atkCd<=0&&basicMagicNow()&&(player.mp||0)<1){
    if(now()-warnT>1.5){warnT=now();try{floater(player.x,player.z,'SEM MANA','#60a5fa')}catch(_){}}
    return}
  const before=player?.atkCd||0,res=A0.apply(this,arguments);
  if(player&&player.atkCd>before&&curDType281==='mag')channelUntil=now()+player.atkCd+.25;
  return res};
const U0=update;
update=function(dt){
  const mp0=player?.mp;const res=U0.apply(this,arguments);
  try{if(player&&!player.dead&&now()<channelUntil){
    if(player.mp>mp0&&player.mp-mp0<=dt*10)player.mp=mp0;/* sem regenerar enquanto ataca (poção continua valendo) */
    acc+=dt;while(acc>=1){acc-=1;player.mp=Math.max(0,Math.floor(player.mp)-1)}
  }else acc=0}catch(_){}
  return res};
L.state=()=>({lote:lote(),channel:now()<channelUntil,acc});
})();
