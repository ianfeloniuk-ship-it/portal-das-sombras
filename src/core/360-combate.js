/* ================= COMBATE ================= */
function nearestEnemy(x,z,max){let best=null,bd=max;for(const e of enemies){if(e.dead||e.sleep||e.invuln)continue;const d=Math.hypot(e.x-x,e.z-z);if(d<bd&&los(x,z,e.x,e.z)){bd=d;best=e}}return best}
/* Nível do monstro: rank da masmorra (ou andar da torre) e perigo do mundo. Caveira: amarela 2×, laranja 5×, vermelha 10× o seu nível. */
function eLvl(e){if(e.lvl)return e.lvl;const g=GR[Math.min(9,e.gr||0)];return e.lvl=Math.max(1,g.lvl)}
function threat(lv){const r=lv/Math.max(1,run.level);return r>=10?'#ff3d3d':r>=5?'#ff8a3d':r>1?'#ffd54f':null}
function identityHitDamage(e,amt,o){if(!o.fromPlayer||o.pet||o.passive)return amt;if(o.execute&&e.hp<=e.maxhp*.35)amt*=1.5;if(o.longshot&&Math.hypot(e.x-o.originX,e.z-o.originZ)>=8)amt*=1.25;return amt}
function applyWeaponVenom(e,amt){const P=player;if(!(P.venomUntil>time)||!(P.venomCharges>0))return;P.venomCharges--;e.basicDots=e.basicDots||{};const old=e.basicDots.venom;e.basicDots.venom={t:4,d:Math.max(old?.d||0,amt*.6/4),acc:old?.acc||0};floater(e.x,e.z,'ENVENENADO','#8de06a')}
function judgmentRelief(P,r,sk){if(hasAff('nocure'))return;for(const a of [P,...allies])if(!a.dead&&(a===P||a.life>0)&&Math.hypot(a.x-P.x,a.z-P.z)<=r){const h=Math.min(a.maxhp-a.hp,a.maxhp*judgmentHealing(sk||{n:'Julgamento'}));if(h>0){a.hp+=h;if(a!==P)narratorEvent105('support');floater(a.x,a.z,'+'+fmt(h),'#fff3a0');fxRing(a.x,a.z,0xfff3a0,1,.4)}}}
function resolveEnemyStun(e,oldStun){if(e.stun>oldStun){try{e.stun=oldStun+(e.stun-oldStun)*(1-mobAttr281(e).status)}catch(_){}if(e.isBoss||time<(e.stunResistUntil||0))e.stun=oldStun;else{e.stun=Math.min(e.stun,.3);e.stunResistUntil=time+3}}}
