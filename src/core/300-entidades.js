/* ================= ENTIDADES ================= */
/* v168 (Irror): monstro de nível bem acima do seu precisa ter força de verdade. Vida × (nível dele ÷ seu nível) e dano × metade disso, só quando ele está acima. */
/* v177 (Irror): sem "rubber band" — vida e dano do monstro vêm só do nível DELE, nunca do seu. Só o ouro fica pela metade (v169). */
function levelGap168(e){if(!run||!e)return;e.gold=(e.gold||0)*.5;tierSetup177(e)}
/* v177 (Irror): a cada 25 níveis o monstro ganha um poder novo (não só vida):
   à distância — 25: +1 projétil · 50: projéteis 30% mais rápidos · 75: +1 projétil · 100+: +1 a cada 50 níveis (máx. 5);
   corpo a corpo — 25: golpe duplo · 50: pisão em área depois do golpe (avisa antes) · 75: alcance +40% · 100: prepara o golpe 25% mais rápido. */
function monsterTier177(e){return Math.min(8,Math.floor(eLvlRaw177(e)/25))}
function eLvlRaw177(e){const had='lvl' in e,l=eLvl(e);if(!had)delete e.lvl;return l}
function tierSetup177(e){const t=monsterTier177(e);e.tier177=t;if(!t)return;const ranged=e.ai==='ranged'||e.ai==='wraith';if(!ranged){if(t>=3)e.range*=1.4;if(t>=4)e.wind*=.75}}
function tierShoot177(e){const t=e.tier177||0;if(!t||!player||player.dead)return;const extra=Math.min(4,(t>=1?1:0)+(t>=3?1:0)+(t>=4?Math.floor((t-2)/2):0)),sp=13*(t>=2?1.3:1);
  for(let i=1;i<=extra;i++){const side=(i%2?1:-1)*Math.ceil(i/2)*.6,f=e.face;later181(()=>{if(e.dead||!player||player.dead)return;shoot(e.x+Math.cos(f)*side,e.z-Math.sin(f)*side,f,sp,e.dmg*.8,'enemy',0xffb36b,'orb');const q=projs[projs.length-1];if(q&&t>=2)q.wallBounce177=t>=5?2:1},60*i)}
  if(t>=2){const q=projs[projs.length-1];if(q&&q.team!=='player'&&!q.wallBounce177)q.wallBounce177=t>=5?2:1}}
/* v182: cada família tem um jeito próprio — aranha prende com teia, esqueleto arremessa osso, lobo chama a matilha. */
function familySwing182(e,T){if(!T||T.dead||e.isBoss)return;const k=e.kind||'',d=Math.hypot(T.x-e.x,T.z-e.z);
  if(k==='aranha'&&T===player&&d<e.range+1.6&&time>(e.web182||0)){e.web182=time+4;player.slowT=Math.max(player.slowT||0,1.5);floater(player.x,player.z,'TEIA','#e8e0cc')}
  if(['minion','warrior','rogue'].includes(k)&&Math.random()<.25)later181(()=>{if(e.dead||!T||T.dead)return;shoot(e.x,e.z,Math.atan2(T.x-e.x,T.z-e.z),12,e.dmg*.6,'enemy',0xe8e0cc,'orb')},200);
  if(k==='lobo'&&!e.howl182){e.howl182=true;floater(e.x,e.z,'UIVO','#c9d3de');for(const o of enemies)if(!o.dead&&o.kind==='lobo'&&o!==e&&Math.hypot(o.x-e.x,o.z-e.z)<18)o.aggro=true}}
function tierSwing177(e,T){const t=e.tier177||0;if(!t||!T||T.dead)return;
  if(t>=1)later181(()=>{if(e.dead||!T||T.dead)return;const d=Math.hypot(T.x-e.x,T.z-e.z);if(d<e.range+1.2+(T.r||.5)){dmgTo(T,e.dmg*.7);fxSlash(e.x,e.z,e.face,0xffb36b,e.range+.8)}},260);
  if(t>=2){const x=e.x,z=e.z,r=2.6+.3*t;fxRing(x,z,0xff6a3d,r,.5);later181(()=>{if(e.dead)return;fxRing(x,z,0xffb36b,r,.3);shake(.15);for(const a of [player,...(typeof allies!=='undefined'?allies:[])])if(a&&!a.dead&&Math.hypot(a.x-x,a.z-z)<r)dmgTo(a,e.dmg*.9)},550)}}
function mkEnemy(K,x,z,mulHp,mulDmg,extra={}){
  const m=makeChibi({goblin118:K.goblin118,body:K.body,skin:K.skin??0xe8e0cc,eye:K.eye??0xff3030,wep:K.wep,shield:K.shield,scale:K.scale,wcol:0xb06bff,hair:K.hair,helm:K.helm,gk:K.gk,tint:K.gtint,atkClip:K.clip,mon:K.mon});
  m.root.position.set(x,0,z);scene.add(m.root);
  const mb=MonsterBalance.species(K,extra);
  const e={m,mats:m.mats,x,z,face:rnd(0,TAU),name:K.n,hp:mb.hp*mulHp,maxhp:mb.hp*mulHp,dmg:mb.damage*mulDmg,monsterBalanceVersion:2,rewardSpeciesHP262:extra.isBoss?38:mb.hp,speed:K.spd,ai:K.ai,range:K.range,wind:K.wind,atkCd:K.atkCd,xp:K.xp,speciesXpBalance:K.xp,r:K.r,shield:!!K.shield,
    cd:rnd(.5,1.5),act:null,stun:0,slow:0,dotT:0,dotD:0,flash:0,dead:false,deadT:0,aggro:false,kb:{x:0,z:0},t:Math.random()*9,team:'enemy',gold:0,...extra};
  enemies.push(e);return e;
}
function kindsFor(gr,bio){if(bio&&HABITATS124[bio])return HABITATS124[bio].flatMap(id=>familyPool124(id,gr));const X=[];for(const k in KINDS){const K=KINDS[k];if(K.variant||K.fendido)continue;if(K.rk==null||gr<K.rk)continue;if(K.bio&&bio&&K.bio!==bio)continue;X.push({k,w:K.bio&&bio===K.bio?22:K.bio&&bio?0:9})}return kindsFor0(gr).concat(X.filter(x=>x.w>0))}
function kindsFor0(gr){const a=[{k:'minion',w:26},{k:'rogue',w:18},{k:'mage',w:18},{k:'warrior',w:18},{k:'goblin',w:22},{k:'lobo',w:16},{k:'aranha',w:14}];if(gr>=1)a.push({k:'vespa',w:12},{k:'raptor',w:10});if(gr>=2)a.push({k:'orc',w:14+gr*2});if(gr>=3)a.push({k:'golem',w:12+gr*2},{k:'yeti',w:8+gr*2});if(gr>=4)a.push({k:'wraith',w:12+gr*2},{k:'gigante',w:6+gr*2});if(gr>=5)a.push({k:'demon',w:10+gr*3},{k:'dragao',w:4+gr*2});return a}
/* O nível numérico vem do portal; ameaça e recompensas são calculadas separadamente. */
function dunLvl(gr){const G=GR[Math.min(9,gr)];return (L&&L.mode==='dungeon'&&!L.special&&L.gate&&L.gate.id>0)?Math.max(G.lvl,gateLvl207(L.gate)):G.lvl}
function dunScale(e,gr,lvo){const G=GR[Math.min(9,gr)],lv=lvo||dunLvl(gr),old=e.balanceLevel||G.lvl;const mh=eHP(lv)/eHP(old),md=eDMG(lv)/eDMG(old);e.hp*=mh;e.maxhp*=mh;e.dmg*=md;e.lvl=e.balanceLevel=lv}
/* IDs legados de ameaça preservados; ordem semântica: Logos/Divindade, Supremo, Inefável. A ameaça não fixa o nível numérico. */
const THREAT184=[{n:'',h:1,d:1,r:1},
 {n:'Sombra',a:0xd8d8d8,h:1.15,d:1.05,r:1.4,col:'#e0e0e0'},
 {n:'Legião',a:0x7cff6a,h:1.3,d:1.1,r:1.8,col:'#8cff7a'},
 {n:'Praga',a:0x3fb6ff,h:1.5,d:1.15,r:2.4,col:'#5cc4ff'},
 {n:'Dilúvio',a:0xffa21f,h:1.75,d:1.2,r:3.2,col:'#ffae3a'},
 {n:'Babel',a:0xff3a2a,h:2.05,d:1.25,r:4.2,col:'#ff4d3d'},
 {n:'Leviatã',a:0xc03aff,h:2.4,d:1.3,r:5.5,col:'#cf5cff'},
 {n:'Behemoth',a:0x8a0018,h:2.8,d:1.36,r:7,col:'#ff2050',dark:1},
 {n:'Apocalipse',a:0x101018,h:3.3,d:1.43,r:9,col:'#9aa0b8',dark:1},
 {n:'Logos',a:0xfff0a0,h:3.9,d:1.5,r:12,col:'#fff27a'},
 {n:'Inefável',a:0x0a0410,h:6,d:1.9,r:30,col:'#ffffff',dark:1,beyond:1},
 {n:'Supremo',a:0xffffff,h:4.6,d:1.6,r:16,col:'#f4f0ff',beyond:1}];/* v225 (Ian): acima da Divindade: Supremo (pedaços do Arquiteto) e Inefável (o Arquiteto inteiro, nível ???). Absoluto e Uno ficam para a história. */
function threatRoll184(gr,boss,G){const gg=G||(L&&L.gate),red=gg&&gg.red?1:0;let t=boss?1:0;
 const p=boss?.42+.03*gr+.05*red:.16+.02*gr,cap=boss?Math.min(8,3+gr):Math.min(6,1+gr);
 while(t<cap&&Math.random()<p)t++;
 /* v194 (Ian): Divindade só nasce em portal ★ vermelho: o vermelho pode fazer o guardião ascender. */
 if(boss&&gr>=9&&red&&t>=6&&Math.random()<.25){t=9;if(G||L.gate)setTimeout(()=>{try{bigText('O GUARDIÃO ASCENDEU',2000);toast('<b>[NARRADOR]</b> O portal ★ ficou vermelho e o guardião ascendeu a <b>LOGOS</b>.',7000);lore206('god','Os velhos da Ordem dizem que um Logos é um pedaço do Arquiteto tentando atravessar. Cada uma que cai o deixa mais fraco.')}catch(_){}},2600)}
 return t}
let BREAKG184=null;
function bossThreat184(gr){const g=BREAKG184||(L&&L.mode==='dungeon'&&L.gate);if(!g)return threatRoll184(gr,true);if(g.bt184==null)g.bt184=threatRoll184(gr,true,g);return g.bt184}
const AURA184={};
/* v431 (Ian): no lugar da coluna de luz em volta do monstro, uma auréola da cor da ameaça em cima da cabeça. */
function halo431(color,dark){const g=AURA184.h||(AURA184.h=new THREE.TorusGeometry(.32,.045,8,32));const k='h'+color+(dark?'d':'');const mt=AURA184[k]||(AURA184[k]=window.Shaders312?Shaders312.energy(color,.95):new THREE.MeshBasicMaterial({color,transparent:true,opacity:.9,blending:dark?THREE.NormalBlending:THREE.AdditiveBlending,depthWrite:false}));const h=new THREE.Mesh(g,mt);h.rotation.x=Math.PI/2;h.name='halo431';h.castShadow=false;return h}
function placeHalo431(e,h){let n=0;h.onBeforeRender=()=>{if(n>8)return;if(n++%2)return;try{const r=e.m.root;r.updateMatrixWorld(true);const b=new THREE.Box3();r.traverse(o=>{if(o.isMesh&&o!==h&&o.visible){o.geometry.computeBoundingBox&&!o.geometry.boundingBox&&o.geometry.computeBoundingBox();b.expandByObject(o)}});if(!b.isEmpty()){const s=r.getWorldScale(new THREE.Vector3()).y||1;h.position.y=(b.max.y-r.getWorldPosition(new THREE.Vector3()).y)/s+.25/s;h.scale.setScalar(Math.max(.8,Math.min(3,(e.r||.6)/.6))/s)}}catch(_){}}}
function auraMesh184(t){const T=THREAT184[t];if(!AURA184.g){AURA184.g=new THREE.CylinderGeometry(1,1.25,1,20,1,true);AURA184.g.translate(0,.5,0);AURA184.r=new THREE.RingGeometry(.7,1,32);AURA184.r.rotateX(-Math.PI/2)}
 const blend=T.dark?THREE.NormalBlending:THREE.AdditiveBlending;
 const m=AURA184['m'+t]||(AURA184['m'+t]=new THREE.MeshBasicMaterial({color:T.a,transparent:true,opacity:T.dark?.42:.22,blending:blend,depthWrite:false,side:THREE.DoubleSide}));
 const rm=AURA184['r'+t]||(AURA184['r'+t]=new THREE.MeshBasicMaterial({color:T.a,transparent:true,opacity:T.dark?.7:.55,blending:blend,depthWrite:false}));
 const g=new THREE.Group(),c=new THREE.Mesh(AURA184.g,m),r=new THREE.Mesh(AURA184.r,rm);r.position.y=.05;g.add(c,r);
 if(t>=7){const r2=new THREE.Mesh(AURA184.r,AURA184.m9||(AURA184.m9=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false})));r2.position.y=.06;g.add(r2);g.userData.r2=r2}
 const sp=1+t*.12;c.onBeforeRender=()=>{const k=performance.now()/1000;c.scale.set(1+.06*Math.sin(k*3*sp),1+.15*Math.sin(k*2*sp+1),1+.06*Math.sin(k*3*sp));r.rotation.y=k*sp;if(g.userData.r2){const f=(k*.8)%1;g.userData.r2.scale.setScalar(1+f*1.6);g.userData.r2.material.opacity=.5*(1-f)}};return g}
function lore206(id,txt){profile.seen206=profile.seen206||{};if(profile.seen206[id])return;profile.seen206[id]=1;store.set('pds2_profile',profile);setTimeout(()=>{try{showSys(txt)}catch(_){}},1200)}
function threatApply184(e,t){if(!t)return;if(started&&run)lore206('threat','A Ordem mede o peso de cada monstro que atravessa a fenda. A Ordem usa a escala dos textos antigos: Sombra, Legião, Praga, Dilúvio... até Logos, o máximo que um monstro alcança. Acima disso só existem os pedaços do Arquiteto, chamados Supremos, e ele próprio, o Inefável. A balança da Ordem só mostra ???.');const T=THREAT184[t];e.threat184=t;e.hp*=T.h;e.maxhp*=T.h;e.dmg*=T.d;/* Ameaça não altera o nível; XP/ouro vêm de enemyRewardBalance. */e.name='['+T.n+'] '+e.name;
 try{const h=halo431(T.a,T.dark);h.position.y=(e.scale||1)*2.2;e.m.root.add(h);placeHalo431(e,h);e.aura184=h}catch(_){}if(t>=5&&e.m&&e.m.body)e.m.body.scale.multiplyScalar(1+.025*(t-4))}
function spawnKind(k,x,z,gr,extra={}){const G=GR[gr];const e=mkEnemy(KINDS[k],x,z,G.hp,G.dmg,extra);e.kind=k;if(extra.wild&&gr>=2){const w=1+.2*(gr-1);e.hp*=w;e.maxhp*=w;e.dmg*=1+.12*(gr-1)}if(gr>=2&&Math.random()<Math.min(.6,.15+gr*.06))giveTrait(e);e.xp=KINDS[k].xp*G.xp;e.gold=rnd(2,6)*G.gold;e.gr=gr;dunScale(e,gr,extra.wild?Math.max(1,Math.round(G.lvl*(1+.15*Math.max(0,gr-1)))):undefined);if(L&&L.mode==='dungeon')threatApply184(e,threatRoll184(gr,false));return e}
function spawnRival(x,z,gr,extra={}){
  const ri=clamp(gr+Math.floor(rnd(-1,2)),0,TOPR),rk=RANKS[ri],cl=/* v337: sem o Mago Elemental (classe extinta) */CLASSES.filter((c,i)=>i<7&&!c.legacy)[Math.floor(Math.random()*6)];
  const K={gk:CLASS_GK[CLASSES.indexOf(cl)],gtint:CLASS_TINT[CLASSES.indexOf(cl)],n:'',hp:150,dmg:13,spd:3.4,ai:'rival',range:1.9,wind:.38,atkCd:.9,xp:0,scale:1,r:.55,body:cl.body,wep:['bow','staff','wand','tome','bonestaff'].includes(cl.wep)?'sword':cl.wep,skin:0xffd8b8,eye:0x111111,hair:pick([0x222222,0xc85a1e,0xe8e8ff,0x6b4a2a])};
  const G=GR[Math.min(gr,8)];const e=mkEnemy(K,x,z,G.hp*rk.mult*.8,G.dmg*rk.mult*.8,extra);
  Object.assign(e,{name:pick(NAMES)+' ['+rk.id+']',rival:true,xp:60*G.xp*rk.mult,gold:rnd(40,90)*G.gold,dashCd:3,gr});return e;
}
function spawnBoss(x,z,gr,B){
  /* v178 (Irror): todo chefe tem pelo menos 3 tipos de ataque (o SS+ com giro e chuva roxa foi o que mais divertiu). */{const all=['seismic','fury','soulrain','legion'],ts=[...(B.types||[B.type]).filter(Boolean)];while(ts.length<3){const c=all.filter(t=>!ts.includes(t));ts.push(c[Math.floor(Math.random()*c.length)])}B={...B,types:ts}}
  const tp0=(B.types||[B.type])[0],skull=tp0==='soulrain'||tp0==='legion',bsc=B.scale||2.2;
  const K={goblin118:B.goblin118,mon:B.mon,gk:{seismic:'Knight',fury:'Barbarian',soulrain:'Skeleton_Mage',legion:'Skeleton_Warrior'}[tp0],gtint:B.body,n:B.n,hp:900,dmg:20,spd:2.6,ai:'boss',range:3.6*bsc/2.2,wind:.75,atkCd:1.5,xp:0,scale:bsc,r:Math.min(1.6,1.3*bsc/2.2),helm:!skull,skin:skull?0xe8e0cc:0xd8d8e0,eye:B.p3?0xffffff:0xff2020,body:B.body,wep:tp0==='soulrain'?'staff':tp0==='fury'?'axe':'sword'};
  const G=GR[gr];const e=mkEnemy(K,x,z,G.hp,G.dmg,{isBoss:true,boss:B,spT:5,phase:1,absorbed:false,gr});e.bars=bossBarsFor166(gr)+(L.mode==='dungeon'&&L.gate?.red?1:0);/* v167 (Ian): cada barra é vida de verdade (1 barra = 1/3 da vida antiga); portal vermelho +1 barra */e.hp*=e.bars/3;e.maxhp*=e.bars/3;e.xp=200*G.xp;e.gold=rnd(120,180)*G.gold;bossE=e;dunScale(e,gr);if(L.mode==='dungeon'&&L.gate&&L.gate.anchor221){const pc=PIECES222[L.gate.piece222||0];e.name=pc+' do Arquiteto';e.piece222=1;e.hp*=2.5;e.maxhp*=2.5;e.dmg*=1.25;L.gate.bt184=11}if(L.mode==='dungeon'&&L.gate&&L.gate.inv343)e.name='Chefe Invasor · '+e.name;/* v225: pedaço do Arquiteto = Supremo */{const t=bossThreat184(gr);threatApply184(e,t);e.threat183=t;if(t>=5){bigText('AMEAÇA NÍVEL '+THREAT184[t].n.toUpperCase(),2200)}}
  if(Math.random()<Math.min(.95,.6+gr*.06)){e.mech=pick(bossMechanics113(B));e.mechT=8}if(B.goblin118)e.mech='costas';
  // v161: portal de classe rara usa o chefe da classe feito no Tripo.
  const rid161=L&&L.mode==='dungeon'&&L.gate&&L.gate.set153;if(rid161&&window.Boss160&&Boss160.has(rid161)){Boss160.env={L:()=>L,P:()=>player};Boss160.attach(e,rid161)}
  return e;
}
/* MECÂNICAS DE CHEFE: cada chefe pode vir com um "quebra-cabeça" próprio. */
function bossMechanics113(B){return ['costas','divide','barreira',...((B.types||[B.type])[0]==='soulrain'?['inverte']:[])]}
function inversionHit113(h){if(h.owner?.dead||player.dead||player.iT>0||player.dodgeT>0||Math.hypot(player.x-h.x,player.z-h.z)>=h.r+player.r||!los(h.x,h.z,player.x,player.z))return false;FX2.inv=3;bigText('CONTROLES INVERTIDOS · 3s',1200);return true}
const BMECH={
  costas:{n:'Couraça Frontal',d:'Só toma dano de verdade PELAS COSTAS. Esquive para trás dele.'},
  divide:{n:'Divisão',d:'Na metade da vida, se parte em dois fragmentos.'},
  inverte:{n:'Olhar Distorcido',d:'Marca uma área violeta a até 14 m. Após um breve aviso, quem for atingido tem movimento e esquiva invertidos por 3s. Saia do círculo ou esquive no impacto.'},
  barreira:{n:'Barreira de Mana',d:'De tempos em tempos fica quase imune. Afaste-se e espere a barreira cair.'}};
function updBossMech(e,dt){if(!e.mech||e.dead)return;
  if(!e.mechShown&&e.intro){e.mechShown=true;const M=BMECH[e.mech];setTimeout(()=>{showSys('Mecânica do chefe: <b>'+M.n+'</b>. '+M.d)},1200)}
  if(!e.intro)return;e.mechT-=dt;
  if(e.mech==='inverte'&&e.mechT<=0&&!player.dead&&Math.hypot(e.x-player.x,e.z-player.z)<=14&&los(e.x,e.z,player.x,player.z)){e.mechT=12;const h=hazard(player.x,player.z,2.5,1.2,0,'enemy',0xd06bff);h.owner=e;h.invert113=true;floater(e.x,e.z,'OLHAR DISTORCIDO','#d06bff',true)}
  if(e.mech==='barreira'){if(e.mechT<=0&&!e.barrier){e.barrier=5;e.mechT=15;floater(e.x,e.z,'BARREIRA','#7fd8ff',true,4);fxRing(e.x,e.z,0x7fd8ff,4,.8)}if(e.barrier>0){e.barrier-=dt;if(Math.random()<dt*6)fxRing(e.x,e.z,0x7fd8ff,3.2,.3);if(e.barrier<=0){e.barrier=0;floater(e.x,e.z,'BARREIRA CAIU','#ffd54f',true,4)}}}
  if(e.mech==='divide'&&!e.split&&e.hp<e.maxhp*.5){e.split=true;bigText('O CHEFE SE DIVIDIU',1200);for(let i=0;i<2;i++){const a=i*Math.PI+rnd(-.3,.3);const f=spawnKind(bossMinion124(e,i?'gigante':'orc'),e.x+Math.cos(a)*4,e.z+Math.sin(a)*4,e.gr??0,{});f.name='Fragmento de '+e.name;/* v170 (Ian): o fragmento do chefe de classe rara usa o modelo do próprio chefe, menor. */if(e.boss160id&&window.Boss160){Boss160.attach(f,e.boss160id,2.2);f.boss160frag=true}f.hp=f.maxhp=e.maxhp*.25;f.dmg=e.dmg*.6;f.aggro=true;makeElite&&makeElite(f);fxRing(f.x,f.z,0xff5a6e,2.5,.6)}}}
/* TRAÇOS: monstros de portais altos ganham poderes que respondem ao jogador. */
const TRAITS={regen:{n:'Regenerador',d:'recupera 2% da vida por segundo'},veloz:{n:'Veloz',d:'40% mais rápido'},blind:{n:'Blindado',d:'toma 40% menos dano (críticos ignoram)'},vamp:{n:'Vampírico',d:'cura 30% do dano que causa'}};
function giveTrait(e){const t=pick(Object.keys(TRAITS));e.trait=t;e.name=e.name+' '+TRAITS[t].n;if(t==='veloz')e.speed*=1.4}
function spawnShadow(B,x,z,rec){
  const pm=toon(0x3a1d6e,0x2a0f55);const m=makeChibi({mat:pm,skinMat:pm,legMat:pm,eye:0xc9a8ff,wep:'sword',scale:1.3,helm:true,gk:'Knight',tint:0x3a1d6e,emis:0x2a0f55,shield:true});
  m.root.position.set(x,0,z);scene.add(m.root);const mh=260*RANKS[rankOf()].mult*(1+run.level*.04)*(B.p3?4:B.types?2.2:1)*(rec?(1+.08*(rec.lvl-1))*(ALLBOSS().some(b=>b.n===rec.n)?1:.6):1);
  const a={m,mats:m.mats,x,z,face:0,rec,name:rec&&rec.nick?rec.nick+' ['+B.n+']':'Eco: '+B.n,short:'Eco',hp:mh,maxhp:mh,dmg:player.dmg*.6*(hasT('army')?1.2:1)*(rec?1+.08*(rec.lvl-1):1)*(profile.rank===9?1.3:1),speed:5.8,range:2.2,r:.8,cd:0,act:null,stun:0,team:'ally',shadow:true,bossRef:B,life:1e9,t:0,kb:{x:0,z:0},flash:0,slow:0};
  /* Função do eco pela origem: arqueiro (magos/voadores), tanque (grandes/blindados) ou atacante. */
  const nm=String((B&&B.n)||'');a.role=/Mag|Lich|Vesp|Drac|Espectr|Feiti|Alma|Bruxa/i.test(nm)?'arqueiro':/Guard|Golem|Gigant|Yeti|Orc|Cavaleir|Berserk|Tit|Colosso/i.test(nm)?'tanque':'atacante';
  if(a.role==='arqueiro'){a.ranged=true;a.range=9;a.col=0xb98cff;a.dmg*=.85}else if(a.role==='tanque'){a.hp*=1.8;a.maxhp*=1.8;a.dmg*=.75}else{a.dmg*=1.2;a.speed=6.6}
  allies.push(a);return a;
}
function savedSummons(){return allies.filter(a=>a.permanentSummon&&!a.dead&&a.hp>0).map(a=>({kind:a.summonKind,hp:a.hp,maxhp:a.maxhp,dmg:a.dmg,giant:!!a.giant,buffT:Math.max(0,a.buffT||0)}))}
function restoreSummons(){for(const r of run.summons||[]){if(!['wolf','skel','golem','sentinel'].includes(r.kind)||!(r.hp>0))continue;const a=spawnSummon(r.kind,player.x+1,player.z+1,1e9);a.maxhp=Math.max(1,Number(r.maxhp)||a.maxhp);a.hp=Math.min(a.maxhp,r.hp);a.dmg=Math.max(1,Number(r.dmg)||a.dmg);a.buffT=Math.max(0,Number(r.buffT)||0);if(r.giant){a.giant=true;a.m.body.scale.setScalar(2);a.r=1}}}
function makeSpiritWolf(){
  if(MON.list.lobo){const m=makeMonster({mon:'lobo',scale:.85,tint:0x78ccd8});m.locomotion=true;m.gaitSpeed=6.2;return m}
  // Quadruped fallback also works when the optional model cannot be loaded.
  const root=new THREE.Group(),body=new THREE.Group();root.add(body);
  const fur=toon(0x719eab,0x08252c),dark=toon(0x244550),mats=[fur,dark];
  const part=(w,h,d,x,y,z,mat=fur)=>{const m=mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);body.add(m);return m};
  part(.56,.52,1.12,0,.74,0);part(.65,.58,.46,0,.88,.43);
  part(.46,.45,.48,0,1.15,.65);part(.3,.22,.4,0,1.05,.99);part(.27,.16,.09,0,1.07,1.22,dark);
  for(const x of[-.17,.17]){const ear=mesh(new THREE.ConeGeometry(.15,.35,4),fur);ear.position.set(x,1.5,.6);body.add(ear);part(.04,.075,.1,x*1.4,1.23,.87,dark)}
  const paws=[];for(const x of[-.22,.22])for(const z of[-.4,.4]){const leg=new THREE.Group();leg.position.set(x,.65,z);const foot=mesh(new THREE.BoxGeometry(.17,.6,.23),fur);foot.position.y=-.3;leg.add(foot);body.add(leg);paws.push(leg)}
  const tail=part(.22,.22,.75,0,.8,-.84);tail.rotation.x=-.5;
  return{root,body,mats,paws,tail,quadruped:true,sc:1};
}
function makeStoneColossus(){const m=makeChibi({body:0x766c5a,skin:0x8e8068,eye:0xffd070,scale:1.25,wep:'none'}),stone=toon(0x766c5a);for(const part of m.body.children)if(part.isMesh&&part.position.y>1.5&&part.geometry.type==='SphereGeometry')part.geometry=geo('colossusHead',()=>new THREE.DodecahedronGeometry(.46,0));for(const arm of [m.armL,m.armR]){for(const y of [0,-.55]){const rock=mesh(geo('colossusFist',()=>new THREE.DodecahedronGeometry(.3,0)),stone);rock.position.y=y;arm.add(rock)}}const core=mesh(geo('colossusCore',()=>new THREE.OctahedronGeometry(.17)),glowS(0xffd070,.8));core.position.set(0,.95,.38);m.body.add(core);m.mats.push(stone);return m}
function spawnSummon(kind,x,z,life){
  const wolf=kind==='wolf',golem=kind==='golem',col=golem?0xc8a070:wolf?0x6ff4ff:0xa26bff;const pm=toon(wolf?0x1f7f86:0x3a2466,wolf?0x0a3a40:0x1a0a33);
  const m=golem?makeStoneColossus():wolf?makeSpiritWolf():makeChibi({mat:pm,skinMat:pm,legMat:pm,eye:col,wep:'sword',scale:.9,gk:'Skeleton_Minion',tint:0x7a4ac0,emis:0x1a0a33});m.root.position.set(x,0,z);scene.add(m.root);
  const mh=80*RANKS[rankOf()].mult*(1+run.level*.04);
  const a={m,mats:m.mats,x,z,face:0,name:wolf?'Lobo Espiritual':'Soldado',hp:mh,maxhp:mh,dmg:player.dmg*.7,speed:6.2,range:1.8,r:.5,cd:0,act:null,stun:0,team:'ally',life:1e9,permanentSummon:true,summonKind:kind,t:0,buffT:0,kb:{x:0,z:0},flash:0,slow:0};
  if(kind==='sentinel'){a.kitStation111=true;a.ranged=true;a.range=12;a.name='Sentinela';a.col=0x6ff4ff}if(golem){a.name='Colosso de Pedra';a.hp=a.maxhp=mh*3;a.dmg=player.dmg*1.4;a.speed=3.8;a.range=2.6;a.r=.9;a.col=col;}allies.push(a);fxRing(x,z,col,2.5,.5);return a;
}
function makeHunterAlly(p,x,z,guest){
  const c=CLASSES[p.cls];const m=makeChibi({body:c.body,hair:p.hair??c.hair,wep:c.wep,wcol:c.sk[0].col,gk:CLASS_GK[p.cls],tint:CLASS_TINT[p.cls],shield:p.cls===0||p.cls===2});m.root.position.set(x,0,z);scene.add(m.root);
  const mult=RANKS[p.rank].mult,maxhp=(95+p.lvl*9)*mult*1.1;
  const a={m,mats:m.mats,x,z,face:0,name:p.name+' ['+RANKS[p.rank].id+']',short:p.name,hp:maxhp,maxhp,dmg:(10+p.lvl*1.6)*mult*.85,speed:6.2,range:c.ranged?9:2,ranged:c.ranged,healer:c.n==='Paladino',col:c.sk[0].col,
    r:.5,cd:0,healCd:0,buffT:0,act:null,stun:0,team:'ally',party:!guest,guest:!!guest,life:1e9,t:0,kb:{x:0,z:0},flash:0,slow:0,data:p};
  allies.push(a);Hunters138.attach(a,p.cls,p.rank,()=>allies.includes(a));return a;
}

