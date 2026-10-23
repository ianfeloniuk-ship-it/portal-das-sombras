/* ===== v281 (Ian): 9 atributos — Grimório de Atributos e Bestiário (Entregas/Grimorio-Atributos-2026-10-06).
   Um efeito, um atributo. Defesa física (Resistência), mágica (Espírito) e universal (Vontade) separadas.
   Fórmula com retorno decrescente: pts ÷ (pts + K + nível), com teto — funciona para nível infinito. ===== */
const ATTR_NEW281=['des','res','esp','von'],CREATION_PTS281=0;/* v465/v466 (Ian): os 9 pontos iniciais não se distribuem — vão sozinhos para a classe (tools/classgrowth465.js) */
/* v283 (Ian): nada tem teto. A fórmula sozinha nunca chega a 100%; o resto (pontos) cresce sem limite. */
function attrRed281(pts,L,k){pts=Math.max(0,+pts||0);return pts>0?Math.round(pts/(pts+k+Math.max(1,L))*100)/100:0}/* v485: sempre % inteiro (o que a ficha mostra é o que vale) */
function st281(k){return Math.max(0,+((run&&run.stats||{})[k])||0)}
function pDef281(type){const L=run?.level||1;const phy=attrRed281(st281('res'),L,40,.5),mag=attrRed281(st281('esp'),L,40,.5),uni=attrRed281(st281('von'),L,100,.25);return 1-(1-uni)*(1-(type==='mag'?mag:phy))}
function pStatusRes281(){return attrRed281(st281('von'),run?.level||1,40,.4)}
function pPen281(){return attrRed281(st281('des'),run?.level||1,60,.25)}
function lux288(k){try{return (window.Lux267&&Lux267.bonus()[k])||0}catch(_){return 0}}
function furyMax281(){return 100+Math.floor(st281('res')/2)+lux288('furyMax')}/* v485: +1 a cada 2 pontos */
function vigorMax281(){return 100+Math.floor(st281('vit')/2)+lux288('vigorMax')}
function pManaRegen281(){return attrRed281(st281('esp'),run?.level||1,40,.5)}
function pHealBonus281(){return 0}
function pVigorRegen281(){return lux288('vigorRate')}
function pFuryHit281(){return Math.floor(st281('for')/20)+lux288('furyHit')}
function pCritDmg281(){return Math.floor(st281('per')/2)*.01}/* v485: +1% a cada 2 pontos */
/* Destreza: ataque físico à distância (arco, adaga arremessada, classes físicas que atiram) usa Destreza no lugar de Força */
function atkRanged281(){return atkOf('phy')-atkPer(run.level)*st281('for')+atkPer(run.level)*st281('des')}
function rangedPhysBasic281(){const k=weaponKind272(run.equip.w)||'';if(/^(bow|dagger|firearm)$/.test(k))return true;if(/^(sword|axe|mace|spear|hammer)$/.test(k))return false;return !basicIsMagic()&&!!basicAttackClass()?.ranged}
/* ---- criaturas ---- */
const THREAT_ORDER281=[0,1,2,3,4,5,6,7,8,9,11,10];
const MPROF281={Equilibrado:{res:.15,esp:.15,von:.15,agi:.30,des:.25},Blindado:{res:.65,esp:.05,von:.10,agi:.05,des:.15},Espectral:{res:.05,esp:.60,von:.10,agi:.25,des:0},Arcano:{res:.05,esp:.55,von:.10,agi:.15,des:.15},Universal:{res:.10,esp:.10,von:.50,agi:.15,des:.15},'Ágil':{res:.15,esp:.05,von:.05,agi:.50,des:.25},Atirador:{res:.10,esp:.05,von:.05,agi:.20,des:.60},Bruto:{res:.45,esp:.05,von:.15,agi:.20,des:.15}};
const MSPEC281={Blindado:'escaravelho guardiao abelha abelharainha golenzinho golempedra gigante gobShield118 warrior cactogig yeti',Espectral:'fantasma caveira wraith redemoinho lula visitante invasor',Arcano:'mage golem gobShaman118 tribal diabrete reicogu','Universal':'demon chifrudo dragonete dragao dragaoancio alpacaimp','Ágil':'ninjinha ninja coelho lobo raptor rogue passaro mono vespa aranha',Atirador:'gobArcher118 espinhosa cactinho',Bruto:'orcinho orc goblin gobBrute118 sapo cogufuria dino yetinho homempeixe peixinho glubancio alpaca'};
const KPROF281={};for(const [p,l] of Object.entries(MSPEC281))for(const k of l.split(' '))KPROF281[k]=p;
function mobRole281(e){return e.isBoss?2:e.rival?1.6:e.elite?1.4:1}
function mobAttr281(e){const role=mobRole281(e),key=role+':'+(e.threat184||0);if(e.att281&&e.att281.key===key)return e.att281;const L=Math.max(1,(()=>{try{return eLvl(e)}catch(_){return 1}})()),ti=Math.max(0,THREAT_ORDER281.indexOf(e.threat184||0)),P=.5*L*role*(1+.05*ti),pr=MPROF281[KPROF281[e.kind]||'Equilibrado'],a={key,L,P,prof:KPROF281[e.kind]||'Equilibrado'};for(const k in pr)a[k]=P*pr[k];
  a.phy=attrRed281(a.res,L,40,.5);a.mag=attrRed281(a.esp,L,40,.5);a.uni=attrRed281(a.von,L,100,.25);a.status=attrRed281(a.von,L,40,e.isBoss?.6:.4);a.pen=attrRed281(a.des,L,60,.25);a.spd=attrRed281(a.agi,L,40);
  if(!e.spd281Done&&Number.isFinite(e.speed)){e.speed*=1+a.spd;e.spd281Done=1}e.att281=a;return a}
function mobDefFor281(e,type){const a=mobAttr281(e),pen=pPen281();const spec=type==='mag'?a.mag:a.phy;return 1-(1-a.uni*(1-pen))*(1-spec*(1-pen))}
/* v296 (Ian): defesa é NÚMERO que se desconta do dano (100 de dano contra 200 de defesa = 0). Cada ponto vale atkPer(nível); a universal vale metade e conta contra os dois tipos. Penetração da Destreza também é número. */
function pDefNums296(){const k=atkPer(run?.level||1);return {phy:st281('res')*k,mag:st281('esp')*k,uni:st281('von')*k*.5+tomeDef327()}}
/* v327 (Ian): Tomo da Pele de Ferro dá defesa em número (desconta de todo dano), não porcentagem. */
function tomeDef327(){return Math.round(1.5*pb('res')*atkPer(run?.level||1))}
function pDefVal296(type){const d=pDefNums296();return (type==='mag'?d.mag:d.phy)+d.uni}
function pPenVal296(){return Math.round(st281('des')*atkPer(run?.level||1)*.5)}
function mobDefNums296(e){const a=mobAttr281(e),k=atkPer(a.L)*.5;if(a.penV==null)a.penV=(a.des||0)*k;return {phy:(a.res||0)*k,mag:(a.esp||0)*k,uni:(a.von||0)*k*.5}}
function mobDefVal296(e,type){const d=mobDefNums296(e);return (type==='mag'?d.mag:d.phy)+d.uni}
let curDType281='phy',inDType281='phy';
const MAGIC_PT281=/^(orb|fire|ice|stone|spark|soul|holy|big|meteor|arcane|rift|time|stone_lance)$/;

const L281={};
function tick281(dt){if(!player||player.dead||!run)return;
  if(!window.vr281&&typeof vigorRate263==='function'){window.vr281=1;const v0=vigorRate263;window.vigorRate263=vigorRate263=function(){return v0()*(1+pVigorRegen281())}}
  if(!window.fg281&&typeof cm154Gain==='function'){window.fg281=1;const g0=cm154Gain;window.cm154Gain=cm154Gain=function(n,...r){return g0(n>0?n+pFuryHit281():n,...r)}}
  if(L281.hp!=null&&player.hp>L281.hp&&player.hp<player.maxhp)player.hp=Math.min(player.maxhp,player.hp+(player.hp-L281.hp)*pHealBonus281());
  const sr=pStatusRes281();for(const k of ['slowT','stun','bleedT']){const v=+player[k]||0,o=L281[k];if(o!=null&&v>o)player[k]=o+(v-o)*(1-sr);L281[k]=+player[k]||0}
  L281.hp=player.hp;L281.mp=player.mp}

function hurtEnemy(e,amt,sx,sz,o={}){if(!e||e.friendly217||e.ally||!Number.isFinite(amt)||amt<=0)return 0;/* v341 (Ian): de dentro da cidade não se fere quem está fora da muralha */if(!e.dead&&!o.guard343&&wallBlock341(e)){if(!(e.wallT341>time)){e.wallT341=time+1.2;floater(e.x,e.z,'MURALHA','#9fb0c4')}if(!(gateHint341>time)){gateHint341=time+45;toast('<b>[NARRADOR]</b> De dentro da cidade seus golpes não passam da muralha. Saia pelo portão para lutar.',5000)}return 0}if(!e.dead)resourceCombat258();
  if(e.dead)return;if(o.fromPlayer&&e.inv&&L.inv)L.inv.helped116=true;const oldStun=e.stun||0;if(e.invuln){if(Math.random()<.3)floater(e.x,e.z,'IMUNE','#9fb0c4');return}
  if(o.fromPlayer&&e.isBoss){const sm=cons('som');if(sm)amt*=1+.02*sm+(sm>=10?.1:0)}let blocked=false;
  if(o.fromPlayer&&e.kind)amt*=bestMul(e.kind);if(o.fromPlayer&&e.elite&&hasT('avenger'))amt*=1.2;if(o.fromPlayer&&hasT('towerc')&&L.special&&L.special.kind==='tower')amt*=1.2;
  if(e.mech==='barreira'&&e.barrier>0){amt*=.08;if(Math.random()<.25)floater(e.x,e.z,'BARREIRA','#7fd8ff')}
  if(e.mech==='costas'){const ax=sx-e.x,az=sz-e.z,l=Math.hypot(ax,az)||1;if((ax*Math.sin(e.face)+az*Math.cos(e.face))/l>-.2){amt*=.2;if(o.fromPlayer&&(e.hintT||0)<time){e.hintT=time+2;floater(e.x,e.z,'ATAQUE PELAS COSTAS!','#ffd54f',true,4)}}else if(o.fromPlayer&&Math.random()<.3)floater(e.x,e.z,'PONTO FRACO!','#6fe39a')}
  if(e.shield&&e.stun<=0&&!o.pierce){const ax=sx-e.x,az=sz-e.z,l=Math.hypot(ax,az)||1;if((ax*Math.sin(e.face)+az*Math.cos(e.face))/l>.35&&Math.random()<.65){amt*=.25;blocked=true}}
  if(player.stealth>0&&o.fromPlayer){if(!player.kitStealth111){amt*=3*(1+.02*cons('fts'));o.sneak=true}player.stealth=0;player.kitStealth111=false;setStealth(false)}
  if(o.fromPlayer&&hasClassPassive(4)&&!o.passive)amt*=1+Math.min(.3,.02*Math.hypot(e.x-player.x,e.z-player.z));
  if(e.trait==='blind')amt*=.6;
  const cc=o.fromPlayer?critChance()+((o.crit154||(e.snare154>time)||(!blocked&&passiveCrit327(o)))?1:0):.05,cn=blocked?0:Math.floor(cc)+(Math.random()<cc-Math.floor(cc)?1:0),crit=cn>0,crit3=cn>=2;if(crit)amt*=1+cn*(o.fromPlayer?1+pCritDmg281():1);if(e.res)amt*=1-e.res;amt=Math.max(0,amt-Math.max(0,mobDefVal296(e,o.dtype281||(o.fromPlayer?curDType281:'phy'))-passiveShred327(e,o)-(o.fromPlayer?pPenVal296():0)));
  if(Number.isInteger(o.basicClass)&&e.hp>e.maxhp*.8)amt*=1+.1*gearRuneCount('stalker');amt=identityHitDamage(e,amt,o);amt=passiveDamage263(e,amt,o);amt=passive297(e,amt,o);amt=passiveHit327(e,amt,o);if(window.elemMul300){const b327=amt;amt=elemMul300(e,amt,o);passiveElem327(b327,amt,o)}
  if(o.fromPlayer)amt*=1+titleHitBonus(e)+(e.isBoss?trophyB():0);if(e.isBoss)amt=Math.min(amt,e.maxhp*(o.sneak?.2:.06));amt=expeditionDamage(e,Math.max(0,Math.round(amt)));if(amt<=0)return 0;const nb=e.bars||3,bar0=e.isBoss?Math.ceil(e.hp/e.maxhp*nb):0;e.hp-=amt;
  if(e.isBoss&&e.hp>0&&Math.ceil(e.hp/e.maxhp*nb)<bar0){e.invuln=true;bigText('BARRA QUEBRADA',900);if(hasT('kings'))player.hp=Math.min(player.maxhp,player.hp+player.maxhp*.1);fxRing(e.x,e.z,0xff2d55,4);shake(.4);setTimeout(()=>{e.invuln=false},1500)}if(o.fromPlayer&&!o.pet){const ls=affB().ls+pb('ls');/* v485: Tomo do Vampiro 1% por nível */if(ls)player.hp=Math.min(player.maxhp,player.hp+amt*ls/100)}e.flash=.1;e.aggro=true;
  if(o.fromPlayer){FX2.combo++;FX2.comboT=2.2}
  floater(e.x,e.z,blocked?'BLOQUEIO '+fmt(Math.trunc(amt)):crit3?fmt(amt)+' ×'+(1+cn)+'!':crit?fmt(amt)+'!':fmt(amt),blocked?'#9fb0c4':crit?'#ffd54f':'#ffffff',crit,2.2*(e.isBoss?1.9:1));if(blocked&&time>=(e.blockFeedbackAt||0)){fxRing(e.x,e.z,0xb8c7d8,1.15,.22);e.blockFeedbackAt=time+.12}if(crit&&o.fromPlayer){if(time>=(player.critFeedbackAt||0)){fxBurst(e.x,.72,e.z,crit3?0xffefaa:0xffcf56,crit3?9:5,crit3?3.2:2.3);fxRing(e.x,e.z,crit3?0xffefaa:0xffcf56,crit3?1.9:1.35,.26);player.critFeedbackAt=time+.12}shake(crit3?.18:.12);hitstop(crit3?.055:.035)}
  if(!e.isBoss){const ax=e.x-sx,az=e.z-sz,l=Math.hypot(ax,az)||1;const k=(o.kb??2)*(blocked?.3:1);e.kb.x=ax/l*k*4;e.kb.z=az/l*k*4;if(!blocked)e.stun=Math.max(e.stun,o.stun??.22)}
  if(o.slow)e.slow=Math.max(e.slow,o.slow);
  if(o.fromPlayer&&!blocked&&(Number.isInteger(o.basicClass)||o.basicClass===null)){if(typeof cm154Basic==='function')cm154Basic(o,e);hitHooks183(e,amt,o);applyBasicAttackEffect(e,o.basicClass,amt,o.third);applyWeaponVenom(e,amt);applyGearRuneHit(e,amt)}
  if(o.fromPlayer&&!o.pet&&!o.passive&&!blocked&&profile)applyPassive(e,amt,crit,o);
  resolveEnemyStun(e,oldStun);
  sfx(blocked?'block':'hit',crit);
  if(e.group)for(const x of enemies)if(x.group===e.group)x.aggro=true;
  if(e.hp<=0)killEnemy(e);
  else if(e.isBoss&&e.phase===1&&e.hp<e.maxhp*.5)enrage(e);
  else if(e.isBoss&&e.phase===2&&e.boss.p3&&e.hp<e.maxhp*.25)awaken3(e);if(window.Gosma347)Gosma347.afterDamage(e);return amt;
}
/* PASSIVAS DE CLASSE: funcionam sozinhas a cada acerto do jogador (feedback do Irror). */
const PASSIVES=[
 {n:'Fúria de Batalha',d:'O 3º golpe do combo atordoa por mais tempo e cura 3% da sua vida.'},
 {n:'Sangramento',d:'25% de chance de fazer o inimigo sangrar (50% do dano ao longo de 3 s).'},
 {n:'Muralha Viva',d:'20% de chance de empurrar o inimigo com força e atordoar.'},
 {n:'Afinidade Arcana',d:'Acertos têm 15% de chance de reduzir a recarga das habilidades em 1 s.'},
 {n:'Olho de Águia',d:'Quanto mais longe o alvo, mais dano: +2% por metro (até +30%).'},
 {n:'Graça',d:'Cada acerto cura 2% da sua vida.'},
 {n:'Elo Espiritual',d:'Acertos têm 20% de chance de reduzir a recarga das habilidades em 1 s.'},
 {n:'Colheita de Almas',d:'Cada inimigo derrotado devolve 5% de mana e 3% de vida.'},
 {n:'Queimadura',d:'30% de chance de incendiar (60% do dano ao longo de 3 s).'},
 {n:'Frio Cortante',d:'25% de chance de deixar o inimigo lento por 2 s.'},
 {n:'Abalo',d:'15% de chance de atordoar o alvo por um instante; depois ele resiste a novos atordoamentos por 3s.'},
 {n:'Estática',d:'20% de chance de um raio pular para outro inimigo próximo (50% do dano).'}];
function passiveClasses(){return jobsOf().filter(i=>!!PASSIVES[i])}
function hasClassPassive(ci){return !!profile&&passiveClasses().includes(ci)}
function passiveOf(){const ids=passiveClasses();return ids.length?{n:ids.length+' passivas de classe ativas',d:ids.map(i=>PASSIVES[i].n+': '+PASSIVES[i].d).join(' · ')}:null}
function applyPassive(e,amt,crit,o){const P=player;for(const c of passiveClasses()){
  if(c===0&&o.third){e.stun=Math.max(e.stun,.9);if(!hasAff('nocure'))P.hp=Math.min(P.maxhp,P.hp+P.maxhp*.03)}
  else if(c===1&&Math.random()<.25){e.dotT=3;e.dotD=Math.max(e.dotD||0,amt*.5/3);floater(e.x,e.z,'SANGRANDO','#ff4d6a')}
  else if(c===2&&Math.random()<.2&&!e.isBoss){const ax=e.x-P.x,az=e.z-P.z,l=Math.hypot(ax,az)||1;e.kb.x=ax/l*14;e.kb.z=az/l*14;e.stun=Math.max(e.stun,.7);fxRing(e.x,e.z,0x9fd3ff,1.6,.3)}
  else if((c===3&&Math.random()<.15)||(c===6&&Math.random()<.2)){for(const sk of P.skills)sk.cdT=Math.max(0,sk.cdT-1)}
  else if(c===5&&!hasAff('nocure')){P.hp=Math.min(P.maxhp,P.hp+P.maxhp*.02)}
  else if(c===8&&Math.random()<.3){e.dotT=3;e.dotD=Math.max(e.dotD||0,amt*.6/3);floater(e.x,e.z,'QUEIMANDO','#ff7a22')}
  else if(c===9&&Math.random()<.25){e.slow=Math.max(e.slow,2);floater(e.x,e.z,'LENTO','#ffd08a')}
  else if(c===10&&Math.random()<.15){e.stun=Math.max(e.stun,.8);floater(e.x,e.z,'ATORDOADO','#c8a070')}
  else if(c===11&&Math.random()<.2){let b=null,bd=7;for(const x of enemies){if(x===e||x.dead)continue;const d=Math.hypot(x.x-e.x,x.z-e.z);if(d<bd){bd=d;b=x}}if(b){zig([{x:e.x,z:e.z},{x:b.x,z:b.z}],0xfff36b);hurtEnemy(b,amt*.5,e.x,e.z,{fromPlayer:true,passive:true})}}}}
/* Explicação de cada habilidade (tooltip no PC e texto na Janela de Status). */
const SKD={stone_lance:'Ergue uma linha de estacas na direção da mira, atingindo e atordoando quem estiver no caminho',thunderstorm:'Raios na área da mira (até 14 m), mesmo sem inimigos; com alvos, marca até 5 posições antes dos impactos',bolt:'Dispara um projétil forte na direção da mira',nova:'Explosão em volta de você, acerta todos por perto',cone:'Golpe em leque à sua frente',chain:'Raio que salta entre vários inimigos',rain:'Chuva na área da mira (até 14 m), com impactos durante cerca de 3 s; pode lançar no chão vazio',dot:'Área de praga na mira (até 11 m), com 5 pulsos durante 5 s; atinge inimigos que entrarem nela',dash_strike:'Avança rápido golpeando quem estiver no caminho',blink:'Salto rápido para escapar',buff_dmg:'Aumenta muito seu dano por alguns segundos',guard:'Reduz o dano que você recebe por alguns segundos',heal:'Cura parte da sua vida',stealth:'Fica invisível; o próximo ataque causa dano x3',summon:'Invoca aliados que lutam por você (limite pela mana máxima; permanecem até morrer)'};
function skillCooldown(sk,level){const lv=level==null?(run&&run.skl?run.skl[sk.n]||0:0):level,arc=run?cons('arc'):0;return Math.max(1,Math.round(Math.max(sk.cd*.45,skillCooldownRaw219(sk,lv,arc))))}/* v219: recarga nunca abaixo de 45%. v485 (Ian: sem número quebrado): a recarga real é sempre em segundos inteiros */
function skillCooldownRaw219(sk,lv,arc){return sk.cd*(1-.05*lv)*(1-.02*arc)*(arc>=10?.8:1)*(run&&typeof uniqueHas183=='function'&&uniqueHas183('cdr')?1-.12*relicM204('cdr'):1)}
function skillCooldownText(sk){return String(skillCooldown(sk))}
function skillCooldownRatio(sk){return clamp((sk.cdT||0)/(sk.cdMax||skillCooldown(sk)||1),0,1)}
function skillButtonState(sk,mp){if(sk.combo261&&comboValidity261())return {kind:'empty',text:'CONFIGURAR'};if(sk.kit111&&sk.effect==='anchor'&&kitState111().anchor?.until>time)return {kind:'ready',text:'RETORNAR'};if(sk.kit111&&sk.energy&&sk.cdT<=0&&kitState111().energy<sk.energy)return {kind:'mana',text:'SEM ENERGIA'};if(sk.t==='rare_anchor'&&AR103.anchor&&AR103.anchor.until>time)return {kind:'ready',text:'RETORNAR'};if(sk.empty)return {kind:'empty',text:sk.lockedRank?'BLOQUEADO':'VAZIO'};if(sk.cdT>0)return {kind:'cooldown',text:Math.ceil(sk.cdT)+'s'};const error260=resourceError260(sk,mp);if(error260)return {kind:'mana',text:error260};return {kind:'ready',text:'PRONTA'}}
function renderSkillButton(b,sk,mp){const state=skillButtonState(sk,mp);b.dataset.state=state.kind;let label=b.querySelector('.state');if(!label){label=document.createElement('span');label.className='state';b.appendChild(label)}if(label.textContent!==state.text)label.textContent=state.text;b.querySelector('.cd').style.transform='scaleY('+skillCooldownRatio(sk)+')';b.style.opacity='1';b.setAttribute('aria-label',sk.n+' · '+state.text);}
function skillDamage(sk,level){const P=player;return P.dmg*(sk.sourceClass==null?1:(MAGIC_CLS.includes(sk.sourceClass)?atkOf('mag'):CLASSES[sk.sourceClass]?.ranged?atkRanged281():atkOf('phy'))/Math.max(1,atkOf(isMagic()?'mag':'phy')))*(P.buff>0?P.buffMul:1)*wxSkillMul(sk)*sk.pow*(1+.15*(level==null?(run.skl[sk.n]||0):level))*statsBonus().skill*(1+(setB().skill||0))}
function healerLevel(sk){return Math.max(0,Math.min(10,Number(run.skl[sk.n])||0))}
function judgmentRadius(sk){return 6+Math.floor(healerLevel(sk)/2)}/* v485: +1 m a cada 2 níveis (antes +0,4 m por nível) */
function healingFraction(sk){return sk.n==='Luz Curativa'?.5+.02*healerLevel(sk):sk.pow}
function healingShieldCap(sk){return .2+.02*healerLevel(sk)}
function healingShield(a){if(a.dead||!(a.healShieldUntil>time)){a.healShield=0;return 0}return Math.max(0,Math.min(a.healShield||0,a.maxhp*(a.healShieldCap||0)))}
function absorbHealingShield(a,amt){const shield=healingShield(a),blocked=Math.min(shield,Math.max(0,amt));a.healShield=shield-blocked;return amt-blocked}
function applyHealingLight(a,sk){if(a.dead||hasAff('nocure'))return;const amount=a.maxhp*healingFraction(sk),missing=Math.max(0,a.maxhp-a.hp),healed=Math.min(amount,missing);a.hp=Math.min(a.maxhp,a.hp+healed);if(healed>0)narratorEvent105(a===player?'healself':'support');

  if(healed>0)floater(a.x,a.z,'+'+fmt(healed),'#9fffc0');fxRing(a.x,a.z,0xfff3a0,1,.4)}
function blessAllies(P){for(const a of allies)if(!a.dead&&a.life>0&&Math.hypot(a.x-P.x,a.z-P.z)<=8)a.blessingUntil=time+5}
function allyProtection(a){return Math.min(a.fortressUntil>time?.5:1,a.blessingUntil>time?.7:1)}

function preciseNumber(n){return String(Math.round(n))}/* v485 (Ian): o jogo mostra só números inteiros; os valores de origem já são inteiros */
function judgmentHealing(sk){return 0}
function skillHasDamage(sk){if(sk.kit111)return sk.pow>0;if(sk.rare103)return ['rare_cut','rare_order'].includes(sk.t);return sk.n!=='Lâmina Envenenada'&&!['heal','guard','buff_dmg','stealth','blink','minionbuff','summon','cleanse','holy_shield','holy_step','holy_bind'].includes(sk.t)}
function skillDamagePart(sk,lv){if(sk.kit111)return Math.round(skillDamage(sk,lv));const div=sk.n==='Sol Negro'?5:sk.n==='Era do Gelo'?4:sk.n==='Fúria dos Céus'||sk.n==='Lâmina Rúnica'||sk.n==='Flecha Estelar'?3:sk.n==='Mil Cortes'?6:sk.t==='dot'?5:1;return Math.round(skillDamage(sk,lv)/div*(sk.t==='rain'&&/Flecha/.test(sk.n)?.7:1))}
function skillUpgradeText(sk){const lv=run.skl[sk.n]||0;if(lv>=10)return '';const parts=['Custo '+manaCost177(sk,lv)+' → '+manaCost177(sk,lv+1)+' '+resourceName260(sk)];if(sk.n==='Julgamento'){{const a=6+Math.floor((run.skl[sk.n]||0)/2),b=6+Math.floor(((run.skl[sk.n]||0)+1)/2);parts.push(a===b?'Área '+a+' m (sobe +1 m a cada 2 níveis)':'Área '+a+' m → '+b+' m')}}if(sk.n==='Luz Curativa')parts.push('Cura +2 pontos percentuais');if(sk.n==='Égide Sagrada')parts.push('Escudo +2 pontos percentuais');if(skillHasDamage(sk))parts.push('Dano '+skillDamagePart(sk,lv)+' → '+skillDamagePart(sk,lv+1));parts.push('Recarga '+preciseNumber(skillCooldown(sk,lv))+'s → '+preciseNumber(skillCooldown(sk,lv+1))+'s');return '<b>Próximo nível:</b> '+parts.join(' · ')}
function skillEffect102(sk){if(sk.kit111)return kitEffect111(sk);if(sk.rare103)return (RSK103[sk.n]?.d||'Habilidade rara.')+(sk.t==='rare_anchor'?'<br><b>Retorno:</b> use novamente durante a janela, sem custo adicional.':sk.t==='rare_reprise'?'<br><b>Dano:</b> 60% da habilidade repetida, com seus atributos atuais.':'');const r=preciseNumber,skn=sk.n;
 const named={
 'Julgamento':()=> 'Causa dano sagrado em um raio de '+r(judgmentRadius(sk))+' m.',
 'Luz Curativa':()=> 'Cura você e aliados a até 8 m em '+r(healingFraction(sk)*100)+'% da vida máxima ('+fmt(Math.round(player.maxhp*healingFraction(sk)))+' de vida em você).',
 'Purificação':()=> 'Remove sangramento, lentidão e atordoamento de você e aliados a até 8 m.',
 'Égide Sagrada':()=> 'Concede a você e aliados a até 8 m um escudo de '+r(healingShieldCap(sk)*100)+'% da vida máxima ('+fmt(Math.round(player.maxhp*healingShieldCap(sk)))+' de vida em você) por 6s. Não acumula.',
 'Passo da Luz':()=> 'Avança até 6 m na direção da mira. Não concede invulnerabilidade.',
 'Correntes Sagradas':()=> 'Desacelera inimigos na mira em 50% por 3s. Raio: 4 m. Chefes resistem.',
 'Passo Sombrio':()=> 'Avança cerca de 8 m, atingindo inimigos no caminho.<br><b>Execução:</b> +50% de dano contra alvos com até 35% de vida.',
 'Lâmina Envenenada':()=> 'Por 8s, os próximos 3 acertos aplicam veneno: 60% do dano em 4s. Não acumula.',
 'Flecha Perfurante':()=> 'Flecha que atravessa inimigos.<br><b>Distância:</b> +25% de dano a partir de 8 m do disparo.',
 'Chuva de Flechas':()=> '10 impactos na área da mira, a até 14 m, ao longo de 3s.<br><b>Lentidão:</b> cada impacto reduz o movimento dos inimigos em 50% por 2s.',
 'Bênção':()=> 'Protege por 5s.<br><b>Você:</b> recebe 60% menos dano.<br><b>Aliados a até 8 m:</b> recebem 30% menos dano, mesmo se saírem da área. Com Fortaleza Viva, vale a maior proteção.',
 'Meteoro':()=> 'Meteoro na mira, a até 14 m. Explode após 1s em um raio de 5 m.',
 'Sol Negro':()=> 'Área de fogo na mira, a até 14 m.<br><b>Área:</b> 4 m de raio · 5 pulsos, um por segundo.',
 'Era do Gelo':()=> 'Área de gelo na mira, a até 14 m.<br><b>Área:</b> 6 m de raio · 4 pulsos, um por segundo.<br><b>Lentidão:</b> 50% por 2s a cada acerto.',
 'Fúria dos Céus':()=> '3 raios na área da mira, a até 14 m.<br><b>Área:</b> 3 m de raio · os 3 raios caem em 1s.',
 'Sol Nascente':()=> 'Área de cura com 6 m de raio.<br><b>Cura imediata:</b> '+r(sk.pow*50)+'% da vida máxima.<br><b>Cura no chão:</b> mais '+r(sk.pow*50)+'% em 3 pulsos durante 3s. Você e aliados precisam estar na área de cada pulso.',
 'Domínio dos Ecos':()=> 'Atinge e marca inimigos em um raio de 7 m.<br><b>Marca:</b> seus ecos causam +20% de dano nesses alvos por 8s. Renova a marca do Necromante.',
 'Matilha Espiritual':()=> 'Invoca até 3 lobos nas vagas livres; permanecem até morrer.<br><b>Matilha:</b> seus lobos recebem +60% de dano e 45% de redução de dano por 8s, mesmo com o limite cheio.<br><b>Invocações:</b> '+minionAllies().length+'/'+summonCap()+'.',
 'Colosso de Pedra':()=> 'Invoca um golem permanente até morrer, ocupando uma vaga.<br><b>Golem:</b> triplo da vida e dobro do dano de uma invocação comum; movimentação e ataques mais lentos.<br><b>Invocações:</b> '+minionAllies().length+'/'+summonCap()+'.',
 'Lâmina Rúnica':()=> '3 explosões em linha na direção da mira, até 9 m.<br><b>Área:</b> 2 m de raio por explosão.',
 'Mil Cortes':()=> '6 golpes na área onde você lançou, durante 1s.<br><b>Área:</b> 5 m de raio. Você pode se mover enquanto os cortes continuam.',
 'Fortaleza Viva':()=> 'Protege por 5s.<br><b>Você:</b> recebe '+r((1-sk.pow)*100)+'% menos dano.<br><b>Aliados a até 6 m:</b> recebem 50% menos dano, mesmo se saírem da área. Reaplicar renova a duração.',
 'Flecha Estelar':()=> '3 flechas perfurantes em leque. Mais de uma pode atingir o mesmo inimigo de perto.',
 'Lança de Gelo':()=> 'Projétil perfurante que reduz o movimento dos inimigos por 3s.',
 'Bola de Fogo':()=> 'Projétil de fogo.<br><b>Queimadura:</b> mais 25% do dano do projétil ao longo de 3s.'};
 if(named[skn])return named[skn]();
 if(sk.t==='minionbuff')return 'Cura ecos e invocações em 45% da vida máxima.<br><b>Fortalecimento:</b> +60% de dano e 45% de redução de dano por '+r(8+(sk.pow-1.5)*4)+'s.';
 if(sk.t==='summon')return 'Invoca até '+Math.min(Math.round(sk.pow),summonCap())+' aliados nas vagas livres. Permanecem até morrer.<br><b>Invocações:</b> '+minionAllies().length+'/'+summonCap()+' · limite aumenta com a mana máxima.';
 if(sk.t==='heal')return 'Cura você e seus aliados vivos em '+r(healingFraction(sk)*100)+'% da vida máxima ('+fmt(Math.round(player.maxhp*healingFraction(sk)))+' de vida em você).';
 if(sk.t==='guard')return 'Reduz o dano recebido em '+r((1-sk.pow)*100)+'% por 5s.';
 if(sk.t==='buff_dmg')return 'Aumenta seu dano em '+r((sk.pow-1)*100)+'% por 8s.';
 if(sk.t==='stealth')return 'Furtividade por 5s. Seu próximo ataque básico causa o triplo do dano.';
 if(sk.t==='blink')return 'Salta até 7 m para trás e fica imune a dano por um instante.';
 if(sk.t==='nova')return 'Explosão em um raio de '+(skn==='Golpe Sísmico'?8:6)+' m.'+(skn.includes('Gelo')?'<br><b>Lentidão:</b> reduz o movimento dos inimigos por 4s.':'');
 if(sk.t==='cone')return 'Golpe em leque à frente, com alcance de 5 m.';
 if(sk.t==='chain')return 'Atinge até 5 inimigos. Alcance: 12 m; saltos de 7 m.<br><b>Saltos:</b> cada salto perde 12% do dano do primeiro acerto.';
 if(sk.t==='stone_lance')return 'Estacas em linha na direção da mira, com alcance de 8 m. Empurram e atordoam inimigos.';
 if(sk.t==='thunderstorm')return 'Até 5 raios na área da mira, a até 14 m. Marcam posições de inimigos antes dos impactos.';
 if(sk.t==='rain')return (/Meteoro/.test(skn)?'5 meteoros':'7 impactos')+' na área da mira, a até 14 m. ';
 if(sk.t==='dot')return 'Área de praga na mira, a até 11 m.<br><b>Área:</b> 6 m de raio · 5 pulsos durante 5s.';
 if(sk.t==='dash_strike')return 'Avança cerca de 8 m, atingindo inimigos no caminho.';
 if(sk.t==='bolt')return 'Projétil na direção da mira.'+(skn.includes('Flecha')?' Atravessa inimigos.':'');
 return SKD[sk.t]||'Habilidade especial.';
}
function skillDesc(sk){if(!sk)return '';if(sk.combo261)return comboDescription261();if(sk.kit111)return kitDescription111(sk);const lines=[skillEffect102(sk)];if(skillHasDamage(sk)&&sk.pow>0){const unit=sk.n==='Sol Negro'?' por pulso · 5 pulsos':sk.n==='Era do Gelo'?' por pulso · 4 pulsos':sk.n==='Fúria dos Céus'?' por raio · 3 raios':sk.n==='Mil Cortes'?' por golpe · 6 golpes':sk.n==='Lâmina Rúnica'?' por explosão · 3 explosões':sk.n==='Flecha Estelar'?' por flecha · 3 flechas':sk.t==='rain'?' por impacto':sk.t==='dot'?' por pulso · 5 pulsos':sk.t==='chain'?' no primeiro alvo':' por inimigo';lines.push('<b>Dano:</b> '+skillDamagePart(sk)+unit);}if(hasAff('nocure')&&(sk.t==='heal'||sk.t==='minionbuff'))lines.push('Cura bloqueada nesta masmorra.');lines.push('<b>Custo:</b> '+manaCostText258(sk)+' · <b>Recarga:</b> '+skillCooldownText(sk)+'s');return '<div class="skill-copy">'+lines.join('<br>')+'</div>'}

/* espólio de monstros */
const LOOTP=['Presa','Couro','Essência','Osso','Garra','Escama','Gel','Pena','Chifre','Olho','Coração','Fragmento'];
function lootName(e){const k=e.kind||e.name||'x';let h=0;for(const ch of k)h=(h*31+ch.charCodeAt(0))>>>0;const base=(e.name||'').replace(/^Elite /,'').replace(/ (Gélido|das Areias|do Pântano)$/,'');return LOOTP[h%LOOTP.length]+' de '+base}
function dropLoot(e){if(e.rival||e.statue||e.rewardBlocked||!run)return;const n=e.isBoss?1+(Math.random()<.5?1:0):e.elite?2:Math.random()<.4?1:0;if(!n)return;const name=e.isBoss?'Relíquia de '+(e.name||'Chefe'):lootName(e),value=Math.max(1,Math.round((e.gold||0)*(e.isBoss?.65:e.elite?.9:1.25)));corpseDrop353(e,{type:'material',name,n,value,b:!!e.isBoss})}

function lootTotal(){let t=0;for(const k in run.loot||{})t+=run.loot[k].n*run.loot[k].v;return t}
/* Nível numérico e ameaça são eixos independentes. Valores legados de e.xp/e.gold
   em eventos antigos não são compostos de novo: esta é a fonte final da recompensa. */
function enemyRewardBalance(e){
  const gate=L&&L.mode==='dungeon'?L.gate:null,aff=gate&&gate.aff||[];
  const risk=Math.min(1.5,(e.biomeRewardBalance||1)+.08*aff.length+(gate&&gate.red?.15:0)+(gate&&gate.giant?.15:0)+(e.nightRewardBalance?.08:0)+(e.breaker?.1:0)+(e.legend?.4:0)+(e.nemesis?.35:0)+(e.isBoss&&e.bars>3?Math.min(.25,(e.bars-3)*.08):0));
  const role=e.isBoss?'boss':e.rival?'rival':e.elite?'elite':'normal';
  const level=eLvl(e),threat=e.threat184||0,T=THREAT184[threat]||THREAT184[0];
  const speciesHp=e.rewardSpeciesHP262||(e.isBoss?38:MonsterBalance.species(KINDS[e.kind]||{hp:38,dmg:9},{}).hp);
  const effort=RpgBalance.combatEffort({hp:e.maxhp,baselineHp:speciesHp*eHP(level)*T.h,resistance:e.res,role});
  return RpgBalance.reward({level,threat,role,speciesXp:e.isBoss||e.rival?undefined:e.speciesXpBalance,risk,effort,noExpLoot:e.noExpLoot||e.rewardBlocked||e.ally||e.statue});
}
function trainingXpBalance(e){return Math.round((e.trainingXp262??e.xp??0)/RpgBalance.xpNeed(eLvl(e))*200)}
function settleEnemyRewardBalance(e){const reward=enemyRewardBalance(e),cc=cons('cac');e.trainingXp262=Math.round(RpgBalance.reward({level:eLvl(e),threat:e.threat184||0,role:reward.role,speciesXp:e.isBoss||e.rival?undefined:e.speciesXpBalance,risk:reward.riskFactor,noExpLoot:e.noExpLoot||e.rewardBlocked||e.ally||e.statue}).xp*(1+.03*cc));e.xp=Math.round(reward.xp*(1+.03*cc));e.gold=Math.round(reward.gold*(1+.03*cc)*(cc>=10&&e.threat184?1.25:1));return reward}
function killEnemy(e){if(e.dead)return;if(window.Gosma347&&Gosma347.beforeKill(e))return;if(e.noExpLoot||e.ally||e.statue){e.dead=true;e.deadT=0;e.act=null;return}settleEnemyRewardBalance(e);try{passiveKill327(e)}catch(_){}if(e.arch223)setTimeout(()=>archWin223(e),500);if(e.piece250)setTimeout(()=>pieceSeal250(e),300);if(e.isBoss)bossSay218(e,'death');if(!e.ally&&run){if(cons('san')>=10&&player)player.hp=Math.min(player.maxhp,player.hp+player.maxhp*.03)}rememberVestige103(e);if(!e.ally)try{relicKill204()}catch(_){}if(e.threat184&&!e.hunt203&&!e.ally){e.hunt203=1;try{huntCount203(e.threat184)}catch(_){}}if(e.noExpLoot){e.dead=true;e.deadT=0;e.act=null;return}if(e.nemesis)narratorEvent105('nemesis');else if(e.isBoss)narratorEvent105('boss');else if(e.elite&&!e.statue&&!e.rival)narratorEvent105('elite');dropLoot(e);dropDungeonEquipment(e);
  if(hasClassPassive(7)&&player&&!player.dead){player.mp=Math.min(player.maxmp,player.mp+player.maxmp*.05);if(!hasAff('nocure'))player.hp=Math.min(player.maxhp,player.hp+player.maxhp*.03)}
  e.dead=true;e.deadT=0;e.act=null;gainXp(e.xp,'monster');storyEv('kill');if(hasT('hunter')&&player)player.shield=Math.min(player.maxsh,player.shield+player.maxsh*.05);profile.titleKills=Math.max(profile.titleKills||0,run.kills||0)+1;run.kills++;if(!e.statue){dprog('kill',1);shadowXp(trainingXpBalance(e))}
  bestKill(e.kind);
  if(e.elite&&!e.isBoss){npcEv('elite');storyEv('elite')}
  if(e.elite&&!e.isBoss&&Math.random()<.08){corpseDrop353(e,{type:'book',n:1})}
  if(canArise()&&e.elite&&!e.isBoss&&!e.rival){const it={type:'arise',x:e.x,z:e.z,r:2.5,label:'F · ERGUER ECO',use:()=>{it.hidden=true;fxBurst(e.x,.3,e.z,0xa26bff,16,5);sfx('arise');bigText('DESPERTE',1000);e.m.root.visible=false;addShadow({n:e.name.replace('Elite ',''),lvl:1,xp:0,nick:null})}};L.inter.push(it);setTimeout(()=>{it.hidden=true},8000)}
  const g=Math.round((e.gold||0)*(1+guildBonus()+(titleB().gold||0)));
  if(g>0&&run){
    run.gold=(run.gold||0)+g;
    if(typeof $('gold')!=='undefined'&&$('gold'))$('gold').textContent=fmt(run.gold);
    if(typeof floater==='function')floater(e.x,e.z,'+'+fmt(g)+' ouro','#ffd54f',true);
    if(typeof sfx==='function')sfx('coin');
  }
  fxBurst(e.x,1,e.z,e.isBoss?0xffd070:0xa26bff,e.isBoss?30:10,e.isBoss?8:4);
  qev('kill',e);demandKill(e);
  if(e.expl){hazard(e.x,e.z,2.4,.6,e.dmg*1.5,'enemy',0xff6030)}
  if(e.nemesis){profile.nemKills=(profile.nemKills||0)+1;profile.nemesis=null;store.set('pds2_profile',profile);bigText('VINGANÇA',1400);toast('<b>[NÊMESIS]</b> Você derrotou quem te matou.',5000)}
  if(!e.rival){const gr=e.gr??0,ch=e.isBoss||e.elite?1:(npcHas('Dorian')?.5:.35);if(Math.random()<ch){const n=e.isBoss?3:1;corpseDrop353(e,{type:'core',rank:gr,n})}}
  if(e.rival){qev('pvp',e);toast('<b>[NARRADOR]</b> Caçador '+e.name+' derrotado. Recolha o saque deixado no local.');}
  weaponXp(trainingXpBalance(e));if(e.isBoss){if(L.mode==='world')worldBossDeath(e);else onBossDeath(e)}
  else if(Math.random()<.06)corpseDrop353(e,{type:'potion',n:1});
  finishCorpse353(e);
  if(e.isBoss||e.isIntroTutorial||e.camp327==='a1'||e.architectClaim)try{window.Reclaim372?.claimEnemy(e)}catch(_){}
}
function onBossDeath(b){expBossReward();unlockLore('boss');npcEv('boss');storyEv('boss');if(b.boss&&b.boss.n){profile.trophies=profile.trophies||[];if(!profile.trophies.includes(b.boss.n))profile.trophies.push(b.boss.n)}profile.bossKills=(profile.bossKills||0)+1;
  hitstop(.25);shake(.8);sfx('boom');sfx('gong');bossLight.color.setHex(0xa26bff);bossLight.intensity=2.4;L.bossDead=true;if(L.gate?.inv343&&window.Living372)Living372.invasionWon(L.gate);$('boss').hidden=true;
  for(const x of enemies)if(!x.dead&&x!==b&&!x.rival&&Math.hypot(x.x-b.x,x.z-b.z)<20)killEnemy(x);
  unlockDungeonExit();
  addChest(b.x+4,b.z+1,L.gate.rank,true);addVein(b.x-4,b.z+1,L.gate.rank,7,0xffd070);if(!b.world){run.spts=(run.spts||0)+1;floater(b.x,b.z,'+1 PONTO DE HABILIDADE','#b18cff',true,4)}beginDungeonEscape();
  toast('<b>[NARRADOR]</b> Guardião derrotado. Transbordo em 60s. Recolha o tesouro e volte à única saída, na entrada.',5000);
  if(!L.special&&L.gate.double){const r=L.rooms[L.bossRoom],G=L.grid,dz=G.oz+(r.y+.5)*G.CS+1.2,dx=r.wx;
    const door=new THREE.Group();door.position.set(dx,0,dz);const st=mesh(geo('sdoor',()=>new THREE.BoxGeometry(3,3.4,.4)),toonS(0x3a3a46));st.position.y=1.7;door.add(st);
    const cr=new THREE.Mesh(geo('scrack',()=>new THREE.BoxGeometry(.12,2.6,.45)),glowS(0xffd070,.35));cr.position.y=1.5;door.add(cr);L.group.add(door);
    const it={type:'hidden',x:dx,z:dz+1,r:2.6,label:'F · EXAMINAR A PAREDE',use:()=>{it.hidden=true;cr.material=glowS(0xffd070,1);sfx('gong');shake(.6);
      toast('<b>[NARRADOR]</b> ...',2000);setTimeout(()=>toast('Uma passagem escondida se abriu atrás da parede.',3500),900);
      setTimeout(()=>{if(L.mode==='dungeon'&&!player.dead){qev('clear',L.gate.rank);run.clears++;buildSpecial('temple',L.gate)}},2600)}};L.inter.push(it)}
  if(L.special&&L.special.kind==='job')completeJob();
  if(L.special&&L.special.kind==='tower')towerClear(L.special);
  if(L.special&&L.special.kind==='past'){unlockLore('past');setTimeout(()=>showSys('Isso foi antes de mim. O primeiro guardião não protegia o mundo. Protegia a porta.'),1500)}
  if(L.special&&L.special.kind==='primordial'){profile.season=weekId();storyCh220('act11');store.set('pds2_profile',profile);addChest(b.x-4,b.z-3,9,true);addChest(b.x+4,b.z-3,9,true);toast('<b>[NARRADOR]</b> O Portal Primordial foi fechado. O mundo está salvo, por enquanto.',6000)}
  if(!L.special&&!L.gate.owned){const it={type:'dom',x:b.x-3,z:b.z+3,r:2.6,label:'F · DOMINAR MASMORRA (3 núcleos '+GR[L.gate.rank].id+')',use:()=>{if(dominate())it.hidden=true}};L.inter.push(it)}
  if(L.special&&L.special.kind==='weekly'){profile.weekly=weekId();store.set('pds2_profile',profile);addChest(b.x-4,b.z-3,L.gate.rank,true);toast('<b>[NARRADOR]</b> Chefe semanal derrotado. Um novo aparece na próxima semana.',5000)}
}
function awaken3(b){bossSay218(b,'power');b.phase=3;b.speed*=1.2;b.atkCd*=.8;b.dmg*=1.25;bigText('DESPERTAR DO ARCONTE',1600);shake(.9);toast('<b>[NARRADOR]</b> '+b.name+' liberou o poder verdadeiro.',3500);
  for(let i=0;i<3;i++){const a=i/3*TAU;let x=b.x+Math.cos(a)*4,z=b.z+Math.sin(a)*4;if(!freeAt(x,z,.6)){x=b.x;z=b.z}const m=spawnKind(bossMinion124(b,'demon'),x,z,b.gr,{room:b.room});makeElite(m);m.aggro=true}
  hazard(b.x,b.z,14,1.4,b.dmg*1.5,'enemy',0xe0d0ff);b.mats.forEach(m=>{m.userData.e0=0x332255;m.emissive.setHex(0x332255)})}
function enrage(b){bossSay218(b,'fury');b.phase=2;b.speed*=1.35;b.atkCd*=.75;b.wind*=.85;bossLight.color.setHex(0xff2020);bossLight.intensity=3;scene.fog.color.setHex(0x3a0508);
  toast('<b>[NARRADOR]</b> '+b.name+' entrou em FÚRIA.',3000);bigText('FÚRIA',1100);shake(.6);
  for(let i=0;i<2;i++){const a=rnd(0,TAU);const m=spawnKind(bossMinion124(b,b.gr>=5?'demon':'minion'),b.x+Math.cos(a)*3,b.z+Math.sin(a)*3,b.gr,{room:b.room});m.aggro=true}
  b.mats.forEach(m=>{m.userData.e0=0x440000;m.emissive.setHex(0x440000)})}
/* ESQUIVA PERFEITA: ser atingido durante a esquiva → câmera lenta + próximo golpe forte. */
const FX2={slow:0,combo:0,comboT:0,perfCd:0,counter:false,cine:0,inv:0};
function isCinematic451(){
  if(window.Dream488?.active)return true;
  if(window._cinematicGrace451&&window._cinematicGrace451>performance.now())return true;
  if(typeof FX2!=='undefined'&&FX2.cine>0)return true;
  if(window.CINE231)return true;
  if(document.getElementById('pds_intro_fade'))return true;
  if(window.Intro401?.conversation)return true;
  if(window.Intro401?.reclaiming?.())return true;
  if(document.body&&document.body.classList&&(document.body.classList.contains('story401')||document.body.classList.contains('reading406')))return true;
  if(typeof modalOpen!=='undefined'&&modalOpen)return true;
  return false;
}
function perfectDodge(){if(FX2.perfCd>0)return;narratorEvent105('dodge');FX2.perfCd=2.5;FX2.slow=.9;FX2.counter=true;try{passiveDodge327()}catch(_){}bigText('ESQUIVA PERFEITA',900);fxRing(player.x,player.z,0x7fd8ff,3,.5);sfx('dodge');floater(player.x,player.z,'CONTRA-ATAQUE!','#7fd8ff',true,2.8)}
function hurtPlayer(amt,compatible111=!!curAtk&&!curAtk.isBoss){
  if(player.dead||isCinematic451())return;resourceCombat258();if(player.iT>0){if(player.dodgeT>0)perfectDodge();return}
  if(setHas153('metamorfo','a')&&kitState111().form==='blindada')amt*=.85;const beforeGuard=amt;amt=kitIncoming111(player,amt,compatible111);if(amt<=0)return;if(typeof cm181Hurt==='function')cm181Hurt();hurtHooks183(amt);const guarded=beforeGuard-amt;if(guarded>0&&time>=(player.defenseFeedbackAt||0)){floater(player.x,player.z,'DEFESA -'+fmt(Math.round(guarded)),'#8bdcff',false,3.0);fxRing(player.x,player.z,0x8bdcff,1.35,.24);player.defenseFeedbackAt=time+.3}amt=Math.max(0,Math.round(amt*(1-player.def)*(player.guard>0?player.guardVal:1)*(1-.03*gearRuneCount('ward'))-Math.max(0,pDefVal296(inDType281)-(curAtk?.att281?.penV||0))));if(amt<=0){if(time>=(player.def296At||0)){floater(player.x,player.z,'BLOQUEADO','#8bdcff');player.def296At=time+.5}return}
  if(pb('eva')&&Math.random()<.02*pb('eva')){floater(player.x,player.z,'EVITOU','#c8f4ff');return}
  player.shT=4;const incoming=amt;amt=absorbHealingShield(player,amt);const shielded=incoming-amt;if(shielded>0&&time>=(player.shieldFeedbackAt||0)){floater(player.x,player.z,'ESCUDO -'+fmt(shielded),'#9fe8ff',false,2.8);fxRing(player.x,player.z,0x8bdcff,1.35,.24);player.shieldFeedbackAt=time+.3}if(amt<=0){sfx('block');return}if(player.shield>0){const ab=Math.min(player.shield,amt);player.shield-=ab;amt-=ab;if(ab>0&&time>=(player.shieldFeedbackAt||0)){floater(player.x,player.z,'BARREIRA -'+fmt(ab),'#9fe8ff',false,2.0);fxRing(player.x,player.z,0x8bdcff,1.35,.24);player.shieldFeedbackAt=time+.3}if(amt<=0){sfx('block');return}}
  amt=guardianDamage108(player,amt);if(amt<=0){sfx('block');return}amt=Math.max(1,Math.round(passiveIncoming327(amt)));
  if(hasT('phoenix')&&player.hp-amt<player.maxhp*.2&&time>(player.phxT||0)){player.phxT=time+60;player.shield=player.maxsh;floater(player.x,player.z,'FÊNIX','#ff9a3d',true,3)}
  if(curAtk&&curAtk.kind){if(['mage','wraith','vespa','yeti'].includes(curAtk.kind)&&!player.slowT){player.slowT=2;floater(player.x,player.z,'LENTO','#ffd08a')}else if(['rogue','aranha','lobo','raptor'].includes(curAtk.kind)&&Math.random()<.35){player.bleedT=3;player.bleedD=amt*.08;floater(player.x,player.z,'SANGRANDO','#ff4d6a')}}
  if(window.Cogu348)Cogu348.wake(player);player.hp-=amt;player.hitAnimT=time+.4;floater(player.x,player.z,'-'+fmt(amt),'#ff4d6a');shake(.3);$('vig').style.boxShadow='inset 0 0 120px rgba(255,0,40,.55)';setTimeout(()=>$('vig').style.boxShadow='inset 0 0 120px rgba(255,0,40,0)',160);
  if(curAtk){player.lastHit=curAtk;if(curAtk.trait==='vamp')curAtk.hp=Math.min(curAtk.maxhp,curAtk.hp+amt*.3)}flashMats(player.m,1,0x660000);setTimeout(()=>flashMats(player.m,0),90);sfx('hurt');
  if(player.hp<=0&&passiveLast327())return;
  if(player.hp<=0)die();
}
function hurtAlly(a,amt){if(a.dead)return;amt=kitIncoming111(a,amt);amt*=allyProtection(a);if(a.buffT>0)amt*=.55;amt=absorbHealingShield(a,amt);amt=guardianDamage108(a,amt);if(amt<=0)return;if(window.Cogu348)Cogu348.wake(a);a.hp-=amt;a.flash=.1;if(a.hp<=0){a.dead=true;fxBurst(a.x,1,a.z,0xa26bff,10,4);scene.remove(a.m.root);
  if(a.shadow&&a.rec){a.rec.lvl=0;a.rec.xp=0;a.rec.on=false;toast('<b>[NARRADOR]</b> '+(a.rec.nick||a.rec.n)+' caiu e voltou ao nível 0. Chame novamente pelo Exército de Ecos.');saveRun()}
  if(a.permanentSummon)saveRun();
  if(a.caravan){L.car=null;toast('<b>[CARAVANA]</b> A caravana foi destruída. Missão falhou.',4000)}
  if(a.party){run.party=run.party.filter(p=>p!==a.data);toast('<b>[NARRADOR]</b> '+a.short+' morreu. Caçadores mortos não voltam.',3500)}}}
function xpReward253(x,source){const base=Math.max(0,Number(x)||0),transmigrator=source==='monster'?transmigratorBonus():0,other=1+guildBonus()+(npcHas('Lyra')?.1:0)+restXp287()+((festival()||{}).xp||0)+.03*pb('xp');return {base,transmigrator,transmigratorLevel:transmigratorLevel253(),afterTransmigrator:base*(1+transmigrator),other,total:Math.round(base*(1+transmigrator)*other*(1+.02*(profile.rebirths||0)))}/* v574 (Ian): +2% de XP por reencarnação */;}
function xpAwardAmount262(x,source){if(!Number.isFinite(x)||x<=0)return 0;const total=xpReward253(x,source).total;/* v332 (Ian): entrega de missão sobe no máximo 1 nível */return source==='quest'?RpgBalance.questXpCap(total,xpNeed(),run.xp):total}
const LEVEL_MAX=777;/* v572 (Ian): nível máximo */
function gainXp(x,source){
  if(run.level>LEVEL_MAX){run.level=LEVEL_MAX;run.xp=0}
  if(run.level>=LEVEL_MAX){run.xp=0;return 0}
  if(profile.classless)return 0; // O primeiro nível só desperta no escambo de Kael.
  const awarded=xpAwardAmount262(x,source);if(!awarded)return 0;run.xp+=awarded;let need=xpNeed();const r0=rankOf(),level0=run.level;
  while(run.xp>=need&&run.level<LEVEL_MAX){run.xp-=need;run.level++;storyLevel(run.level);unlockCheck(run.level);try{passiveUnlockCheck286()}catch(_){}/* v165 (Irror): continua ganhando ponto de constelação com tudo cheio; o botão converte em status quantas vezes quiser. */if(run.level>=37&&run.level%3===1)run.cpts=(run.cpts||0)+1;/* v572 (Ian): 1 ponto a cada 3 níveis a partir do 37 (até o 777 = 247 pontos), de propósito menos que as 29 constelações */run.spts=(run.spts||0)+1;/* v465 (Ian): nível não dá mais ponto de atributo (vem do treino); a classe cresce sozinha (RpgBalance) */need=xpNeed();if(run.level>=LEVEL_MAX){run.xp=0;break}if(rankOf()>(run.official??profile.rank)&&run.reavalHint!==rankOf()){run.reavalHint=rankOf();setTimeout(()=>toast('<b>[NARRADOR]</b> Sua mana cresceu. <b>Reavaliação</b> disponível na Ordem (Lyra).',5000),1500)}logNews('Nível '+run.level+' · +1 ponto de habilidade e o crescimento da classe (vida, mana e ataque).');refreshStats();player.hp=player.maxhp;player.mp=player.maxmp;}
  if(run.level>level0)sfx('levelup357');
  {const nx=profile.rank+1;if(profile.rk2&&rankTrialReady(nx)&&run.rkNote!==nx){run.rkNote=nx;setTimeout(()=>toast('<b>[ORDEM]</b> Você pode fazer a <b>Prova para o rank '+RANKS[nx].id+'</b>. Fale com a Lyra (aba Prova de Rank).',6000),1200)}}
  if(run.level>=JOB_LVL&&!run.adv&&!run.jobNote){run.jobNote=true;setTimeout(()=>toast('<b>[NARRADOR]</b> Missão de troca de classe disponível. Fale com a Ordem em qualquer cidade.',5000),800)}
  const r1=rankOf();if(r1>r0){refreshStats();toast('<b>[NARRADOR]</b> RANK SUBIU: <b style="color:'+RANKS[r1].c+'">'+RANKS[r1].id+'</b>',4000);bigText('RANK '+RANKS[r1].id,1400);player.aura.material.color.set(RANKS[r1].c);try{rebuildLook()}catch(_){}/* v431: auréola com a cor do rank novo */}
  return awarded;
}
/* Custos compatíveis com os saves; recompensas normalizadas por nível do monstro. */
const XP_CURVE=Object.freeze({base:60,linear:40,power:1.8,scale:4});
function xpNeed(level=run.level){return RpgBalance.xpNeed(level)}
function xpProgress(level=run.level,xp=run.xp){const needed=xpNeed(level),current=Math.max(0,Math.floor(xp));return {current,needed,remaining:Math.max(0,needed-current),percent:Math.min(100,current*100/needed),nextLevel:level+1}}
function xpNumber(value){return Math.floor(value).toLocaleString('pt-BR')}
function xpProgressText(progress){if(profile.classless)return 'Nível 0 · registre-se com Lyra e desperte sua classe no escambo com Kael.';return 'XP '+xpNumber(progress.current)+' / '+xpNumber(progress.needed)+' · faltam '+xpNumber(progress.remaining)+' para NV '+progress.nextLevel} /* v169: ~2,5x mais XP por nível no 100, ~3x no 200 */

