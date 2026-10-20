/* v468 (Ian, 19/10/2026): itens 1 a 3 do PDF "Técnicas de Instagram para o Primeva" (reels porsukgames
   "combat feel", darkmemory "golpe pesado"). Completa a v459 (flash, hitstop, tremor, faíscas e números já existiam).
   Só visual e som: dano, alcance, tempo de ataque e regras não mudam. Vale para todas as classes e armas
   (entra por hurtEnemy, igual à v459).
   1 SQUASH  o monstro atingido achata e estica por um instante (corpo volta exatamente ao tamanho de antes).
   2 BARRAS  rastro branco atrasado: ao perder vida, a parte perdida fica branca e "alcança" a barra depois de
             um instante — na barra do jogador (HUD), na barra do chefe e nas barrinhas sobre monstros/aliados.
   3 SOM     camada grave no impacto + um "tic" cujo tom sobe a cada acerto seguido (até 8), zera após 1,1 s. */
(function(){
'use strict';
if(typeof hurtEnemy!=='function'||typeof bar!=='function')return;
const J=window.Juice468={on:true,stats:{squash:0,combo:0,maxCombo:0}};
const HOLD=.35,SPEED=.9;/* rastro: espera 0,35 s e desce 90% da barra por segundo */
const now=()=>performance.now()/1000;/* relógio real: o congelamento do golpe não atrasa o rastro nem o combo */

/* ---------- 1 squash ---------- */
const sq=new Map();
function squash(e,crit){const r=e&&e.m&&e.m.root;if(!r||e.dead)return;let s=sq.get(e);if(!s){s={x:r.scale.x,y:r.scale.y,z:r.scale.z};sq.set(e,s)}s.t=0;s.d=crit?.2:.15;s.a=crit?.26:.17;J.stats.squash++}
function stepSquash(dt){for(const [e,s] of sq){const r=e.m&&e.m.root;if(!r){sq.delete(e);continue}s.t+=dt;const k=s.t/s.d;
  if(k>=1||e.dead){r.scale.set(s.x,s.y,s.z);sq.delete(e);continue}
  const w=Math.sin(Math.PI*k)*(1-k*.4),a=s.a*w;r.scale.set(s.x*(1+a*.6),s.y*(1-a),s.z*(1+a*.6))}}

/* ---------- 3 som: grave + tom subindo no combo ---------- */
let comboN=0,comboT=-9,lastTic=-9;
function comboSound(crit){const t0=now();
  if(t0-lastTic<.05)return;lastTic=t0;comboN=t0-comboT<1.1?Math.min(8,comboN+1):1;comboT=t0;J.stats.combo=comboN;J.stats.maxCombo=Math.max(J.stats.maxCombo,comboN);
  if(typeof AU==='undefined'||!AU.ctx||!AU.on||typeof tone!=='function')return;
  try{const t=AU.ctx.currentTime,p=Math.pow(1.0595,(comboN-1)*2);/* 2 semitons por acerto */
   tone(58,t,.16,{v:crit?.3:.22,slide:38});/* sub-grave */
   tone(620*p,t+.004,.06,{type:'triangle',v:.045+.004*comboN})}catch(_){}}

const H0=hurtEnemy;
/* só reage quando a vida caiu de fato: a v459 guarda o golpe para o quadro do impacto e chama de novo */
hurtEnemy=function(e,amt,sx,sz,o){const hp0=e&&e.hp,r=H0.apply(this,arguments);
 try{if(J.on&&e&&r>0&&e.hp<hp0&&!(o&&o.dot)&&!(o&&o.tick)){const crit=!!(o&&o.crit);if(!(window.Golpes487&&Golpes487.replacesHit(o)))squash(e,crit);if(o&&(o.fromPlayer||o.skillHit||o.basicClass!=null))comboSound(crit)}}catch(_){}return r};

/* ---------- 2 barras com rastro ---------- */
/* barrinhas desenhadas no canvas: bar(...) ganha um 8º parâmetro opcional, a entidade */
const B0=bar;
bar=function(x,y,w,f,col,name,ncol,ent){
 if(J.on&&ent&&typeof oc!=='undefined'){const t=now(),fc=Math.max(0,Math.min(1,f));
  if(ent.lag468==null||fc>ent.lag468){ent.lag468=fc;ent.lagHold468=t}
  else if(fc<ent.lagF468-1e-4)ent.lagHold468=t;
  ent.lagF468=fc;
  if(ent.lag468>fc&&t-ent.lagHold468>HOLD){const dt=Math.min(.1,t-(ent.lagT468||t));ent.lag468=Math.max(fc,ent.lag468-SPEED*dt)}
  ent.lagT468=t;
  B0.call(this,x,y,w,f,col,name,ncol);
  if(ent.lag468>fc+.002){oc.fillStyle='rgba(255,255,255,.85)';oc.fillRect(x-w/2+w*fc,y,w*(ent.lag468-fc),4)}
  return}
 return B0.apply(this,arguments)};

/* barras do HUD (HTML): um <i> branco atrás da barra real */
function trailFor(id){const fill=document.getElementById(id);if(!fill||!fill.parentNode)return null;const box=fill.parentNode;
 const tr=document.createElement('i');tr.className='trail468';box.style.position='relative';
 tr.style.cssText='position:absolute;left:0;top:0;height:100%;width:0;background:rgba(255,255,255,.8);transition:none;pointer-events:none';
 fill.style.position='relative';fill.style.zIndex='1';box.insertBefore(tr,fill);return {fill,tr,lag:null,f:null,hold:0}}
const huds=[];
function initHud(){for(const id of ['hpb','bb']){const h=trailFor(id);if(h)huds.push(h)}}
function stepHud(dt){const t=now();for(const h of huds){const f=parseFloat(h.fill.style.width);if(!Number.isFinite(f))continue;
  if(h.lag==null||f>h.lag+.5){h.lag=f;h.hold=t}else if(f<h.f-.01)h.hold=t;h.f=f;
  if(h.lag>f&&t-h.hold>HOLD)h.lag=Math.max(f,h.lag-SPEED*100*dt);
  h.tr.style.width=(J.on?h.lag:f)+'%'}}

let last=performance.now();
function loop(){const n=performance.now(),dt=Math.min(.1,(n-last)/1000);last=n;try{stepSquash(dt);stepHud(dt)}catch(err){if(!J.err)console.warn('juice468',err);J.err=err}}
(function hook(){if(typeof camUpdate!=='function'){setTimeout(hook,300);return}initHud();const prev=camUpdate;camUpdate=function(){prev.apply(this,arguments);loop()}})();
})();
