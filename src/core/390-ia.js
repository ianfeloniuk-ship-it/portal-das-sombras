/* ================= IA ================= */
function turnTo(e,a,dt,s=10){let d=a-e.face;d=Math.atan2(Math.sin(d),Math.cos(d));e.face+=d*Math.min(1,dt*s)}
function pickTarget(e){if(!e.isBoss&&e.kitTaunt111>time&&!player.dead&&Math.hypot(e.x-player.x,e.z-player.z)<20&&los(e.x,e.z,player.x,player.z))return {t:player,d:Math.hypot(e.x-player.x,e.z-player.z)};
  const gt=AR103.trial;if(e.aw103&&gt?.ci===14&&gt.helper&&!gt.helper.dead){const pd=Math.hypot(player.x-e.x,player.z-e.z);if(!player.dead&&player.stealth<=0&&pd<3)return {t:player,d:pd};return {t:gt.helper,d:Math.hypot(gt.helper.x-e.x,gt.helper.z-e.z)}}
  if(e.coreRaider&&L.defense?.started&&!L.defense.failed&&!L.defense.done){const c=L.defense.core,pd=Math.hypot(player.x-e.x,player.z-e.z);if(!player.dead&&player.stealth<=0&&pd<4)return {t:player,d:pd};const ally=allies.find(a=>!a.dead&&Math.hypot(a.x-e.x,a.z-e.z)<3);if(ally)return {t:ally,d:Math.hypot(ally.x-e.x,ally.z-e.z)};return {t:c,d:Math.hypot(c.x-e.x,c.z-e.z)}}
  let best=null,bd=1e9;
  if(!player.dead&&player.stealth<=0&&(!inCity(player.x,player.z)||/* v341: quem invade a cidade pode atacar o jogador lá dentro */(cityRaider341(e)&&inCity(e.x,e.z)))){bd=Math.hypot(player.x-e.x,player.z-e.z);best=player}
  for(const a of allies){if(a.dead)continue;const d=Math.hypot(a.x-e.x,a.z-e.z)+1.5;if(d<bd){bd=d;best=a}}
  return best?{t:best,d:bd}:null;
}
function dmgTo(t,amt){amt=kitWeakDamage111(curAtk,amt);if(t.defenseCore){hurtDefenseCore(amt);return}if(t===player)hurtPlayer(amt);else hurtAlly(t,amt)}
/* v233 (Ian): chefes e elites ficavam duros. Camada de movimento por cima da animação: balanço ao andar, inclina para trás ao preparar, avança no golpe, tranco ao levar dano. */
/* v250 (Ian): material do líquido da fenda para as juntas e as peças do Arquiteto */
let GOO250=null;
function goo250(){if(GOO250)return GOO250;const m=new THREE.ShaderMaterial({uniforms:{uT:{value:0},uC:{value:new THREE.Color(0x9566ed)},uS:{value:new THREE.Color(0x668fff)}},
 vertexShader:`uniform float uT;varying vec3 vP;varying vec3 vN;varying vec3 vV;void main(){vec3 p=position;float w=sin(p.y*4.+uT*2.3)*.11+sin(p.x*6.-uT*1.7)*.08+sin(p.z*5.+uT*1.3)*.08+sin(p.y*11.-uT*3.1)*.03;p+=normal*w*length(position);vec4 W=modelMatrix*vec4(p,1.);vP=position*2.;vN=normalize(mat3(modelMatrix)*normal);vV=normalize(cameraPosition-W.xyz);gl_Position=projectionMatrix*viewMatrix*W;}`,
 fragmentShader:`uniform float uT;uniform vec3 uC,uS;varying vec3 vP;varying vec3 vN;varying vec3 vV;
 float h(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
 float n(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}
 float fb(vec3 p){float a=.5,v=0.;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+7.1;a*=.5;}return v;}
 void main(){float t=uT*.6;vec3 q=vP*1.6+vec3(0.,-t*.5,t*.2);float ink=fb(q+fb(q*1.3+t*.3)*1.4);float ink2=fb(q*2.1-vec3(t*.4,0.,t*.2)+ink);
  float fr=pow(1.-max(0.,dot(normalize(vN),vV)),2.);float caus=pow(.5+.5*sin(ink*18.+t*1.4),10.);
  vec3 deep=mix(uC*.07,uS*.1,ink);vec3 col=deep+mix(uC,uS,ink2)*pow(ink2,2.2)*.9+mix(uC,uS,.6)*caus*.35+uS*fr*.55+mix(uS,vec3(1.),.4)*pow(fr,6.)*.6;
  gl_FragColor=vec4(col*1.6,1.);}`});
 m.onBeforeRender=null;GOO250=m;(function tick(){m.uniforms.uT.value=performance.now()/1000;requestAnimationFrame(tick)})();return m}
/* v372: original Tripo geometry and textures; Blender supplies only the rig/animation. */
function archMat247(src,skin){const m=src.clone();m.skinning=!!skin;m.side=THREE.DoubleSide;m.metalness=Math.min(m.metalness||0,.25);if(renderer.outputEncoding!==THREE.sRGBEncoding){m.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <encodings_fragment>','#include <encodings_fragment>\ngl_FragColor=LinearTosRGB(gl_FragColor);')};m.customProgramCacheKey=()=> 'architect372-tripo-linear';}return m;}

const ARCH242={g:null};(function(){if(!THREE.GLTFLoader)return;new THREE.GLTFLoader().load('models/arquiteto246.glb',g=>{ARCH242.g=g},undefined,()=>{})})();
function arch242(e){const G=ARCH242.g;if(!G||!THREE.SkeletonUtils)return false;const m=THREE.SkeletonUtils.clone(G.scene);const bb=new THREE.Box3().setFromObject(m),h=bb.max.y-bb.min.y||1;m.scale.setScalar(9/(h*(e.m.root.scale.y||1)));e.m.root.children.forEach(c=>{c.visible=false});e.m.root.add(m);m.traverse(o=>{if(o.isMesh){o.castShadow=true;o.frustumCulled=false;o.material=archMat247(o.material,o.isSkinnedMesh)}});try{if(outlineOn210()){outlineAdd210(m);m.traverse(c=>{if(c.userData.ol210c){const u=c.material.userData.u,src=c.onBeforeRender;c.onBeforeRender=function(){src.apply(this,arguments);u.value*=3.2}}})}}catch(_){}const mx=new THREE.AnimationMixer(m),A={};G.animations.forEach(c=>{A[c.name]=mx.clipAction(c)});e.a242={mx,A,cur:null,k:0};arch242play(e,'idle');return true}
function arch242play(e,n,once){const S=e.a242,a=S&&S.A[n];if(!a||S.cur===n)return;const p=S.cur&&S.A[S.cur];a.reset();if(once){a.setLoop(THREE.LoopOnce,1);a.clampWhenFinished=true}a.play();if(p)a.crossFadeFrom(p,.25,false);S.cur=n}
function arch242tick(e,mv,atk,dt){const S=e.a242;if(!S)return;if(e.dead||e.hp<=0)arch242play(e,'morte',1);else if(atk>.3){if(!S.at){S.k^=1;S.at=1}arch242play(e,S.k?'golpe1':'golpe2',1)}else{S.at=0;const a=S.A[S.cur];if(!(S.cur&&S.cur.startsWith('golpe')&&a.isRunning()))arch242play(e,mv?'andar':'idle')}S.mx.update(dt)}
function juice233(e,mv,atk,wind,dt){if(e.a242)arch242tick(e,mv,atk,dt);const J=e.j233||(e.j233={t:0,hit:0}),r=e.m.root,k=e.isBoss?1:.6;J.t+=dt;if(e.flash>0)J.hit=.22;J.hit=Math.max(0,J.hit-dt);
 const lean=(-.28*Math.min(1,wind)+.38*Math.sin(Math.min(1,atk)*Math.PI)-J.hit*1.1)*k;r.rotation.x+=(lean-r.rotation.x)*Math.min(1,dt*14);r.rotation.z=Math.sin(J.t*4.2)*.07*mv*k;
 r.position.y=Math.abs(Math.sin(J.t*7.5))*.22*mv*k*(e.scale||1)/2+Math.sin(Math.min(1,atk)*Math.PI)*.12*k}
function updEnemy(e,dt){if(e.friendly217){e.t=(e.t||0)+dt;if(!e.dead)animChibi(e.m,{move:0,atk:0,dead:0,wind:0},e.t);return}if(!e.gap168done){e.gap168done=1;if(!e.rival)levelGap168(e)}if(!e.dead)crystalUnstuck126(e);if(L.floors){const active=dungeonFloorAt(e.z)===L.floors.current;e.m.root.visible=active&&!e.gone;if(!active)return}dt*=rareAreaTime103(e.x,e.z,e.isBoss);curAtk=e;if(e.trait==='regen'&&!e.dead&&e.hp<e.maxhp)e.hp=Math.min(e.maxhp,e.hp+e.maxhp*.02*dt);
  e.t+=dt;
  const pd=Math.hypot(player.x-e.x,player.z-e.z);
  if(e.dead&&e.m.root.userData.reclaimed372){e.gone=true;return;}if(e.dead){e.deadT+=dt;animChibi(e.m,{move:0,atk:0,dead:Math.min(1,e.deadT*3),wind:0},e.t);if(!e.isBoss&&e.deadT>(/^(escaravelho|slime|gosma|cogu|passaro|espinhosa|guardiao|cactinho)/.test(e.m.mon||'')?((gAct(e.m,'Death_A')?.getClip().duration||1.4)+.15):1.4)){if(!e.corpse353)scene.remove(e.m.root);e.gone=true}return}
  if(e.raid155&&L.mode==='world'){if(pd>55||!pickTarget(e)||pickTarget(e).d>6){const mv=raidMove155(e,dt,pd<=55);if(pd<=55)animChibi(e.m,{move:mv,atk:e.raidAttack348>time?.7:0,dead:0,wind:0},e.t);return}}
  e.sleep=pd>55&&!e.aggro&&!e.gosmaGather347&&!e.gosmaSplit347&&!(e.expBoss&&L.expedition?.s.type==='hunt');if(e.sleep)return;
  if(e.frozen||e.hold){e.act=null;if(e.cactor372){e.cactor372=null;e.cd=Math.max(e.cd,.3);}if(e.guard370){e.guard370=null;e.cd=Math.max(e.cd,.3);}e.bird349=null;if(e.spiky350){e.spiky350=null;e.cd=Math.max(e.cd,.3);}if(e.coguCast348){e.coguCast348=null;e.coguCd348=Math.max(e.coguCd348||0,1);}if(e.slime360){e.slime360=null;e.cd=Math.max(e.cd,.3);}if(e.beetle352){e.beetle352=null;e.cd=Math.max(e.cd,.3);}animChibi(e.m,{move:0,atk:0,dead:0,wind:0},e.t);e.m.root.position.set(e.x,0,e.z);e.m.root.rotation.y=e.face;return}
  e.cd-=dt;e.stun-=dt;e.slow-=dt;
  if(e.flash>0){e.flash-=dt;flashMats(e.m,e.flash>0?1:0)}
  updateBasicDots(e,dt);if(e.dead)return;
  if(e.dotT>0){e.dotT-=dt;e.dotAcc=(e.dotAcc||0)+dt;if(e.dotAcc>=1){e.dotAcc=0;hurtEnemy(e,e.dotD,e.x,e.z,{kb:0,stun:0,pierce:true})}if(e.dead)return}
  if(window.Gosma347&&Gosma347.beforeAI(e,dt))return;
  if(Math.abs(e.kb.x)+Math.abs(e.kb.z)>.05){moveEnt(e,e.kb.x*dt,e.kb.z*dt);e.kb.x*=.86;e.kb.z*=.86}
  if(L.mode==='world'&&!e.raid155){const nc=nearestCity(e.x,e.z);{const cl=cityL(nc.c),R2=38+(cl>=8?30:cl>=7?22:cl>=6?16:0);/* v341: monstro comum fica do lado de fora do portão */const R341=cityRaider341(e)?R2:Math.max(R2,36*CITYK+.6),d341=nc.d||1;if(nc.d<R341&&!cityFallen(nc.c)){e.x=nc.c.x+(nc.d?(e.x-nc.c.x)/d341:1)*R341;e.z=nc.c.z+(e.z-nc.c.z)/d341*R341;e.aggro=false}}}
  if(expHuntMove(e,dt))return;
  if(window.Cogu348&&Cogu348.beforeAI(e,dt))return;
  if(window.Bird349&&Bird349.beforeAI(e,dt))return;
  if(window.Spiky350&&Spiky350.beforeAI(e,dt))return;
  if(window.Cactoro372&&Cactoro372.beforeAI(e,dt))return;
  if(window.Guardian370&&Guardian370.beforeAI(e,dt))return;
  if(window.Beetle352&&Beetle352.beforeAI(e,dt))return;
  if(window.Slime360&&Slime360.beforeAI(e,dt))return;
  const pt=pickTarget(e);
  if(pt&&!e.aggro){const ar=e.isBoss?12:e.rival?13:(L.mode==='world'?12:9);if(pt.d<ar&&los(e.x,e.z,pt.t.x,pt.t.z)){e.aggro=true;if(e.isBoss)bossAggro(e);if(e.group)for(const x of enemies)if(x.group===e.group)x.aggro=true}}
  if(e.isBoss&&!e.expBoss&&e.aggro&&pt&&pt.d>40){e.aggro=false;e.hp=Math.min(e.maxhp,e.hp+e.maxhp*.2)}
  if(e.aggro&&!pt&&L.mode==='world')e.aggro=false;
  let mv=0,atk=0,wind=0;
  if(!e.aggro||!pt||e.stun>0){animChibi(e.m,{move:0,atk:0,dead:0,wind:0},e.t);e.m.root.position.set(e.x,0,e.z);e.m.root.rotation.y=e.face;return}
  const T=pt.t,dx=T.x-e.x,dz=T.z-e.z,d=Math.hypot(dx,dz)||1,ang=Math.atan2(dx,dz);
  const spd=e.speed*(e.slow>0?(e.isBoss?.75:.5):1)*(L.mode==='world'&&WX.type==='snow'?.8:1);
  if(e.act){
    const A=e.act;A.t+=dt;
    if(A.type==='draco_claw'||A.type==='draco_tail'){
      e.m.attack318=A.type==='draco_tail'?'TailSwipe':'Claw';wind=Math.min(1,A.t/A.wind);
      if(A.t<A.wind)turnTo(e,ang,dt,3);
      if(!A.done&&A.t>=A.wind){A.done=true;let da=Math.atan2(Math.sin(ang-e.face),Math.cos(ang-e.face));
        if(d<3.3+(T.r||.5)&&(A.type==='draco_tail'||Math.abs(da)<1.15))dmgTo(T,e.dmg);
        fxSlash(e.x,e.z,e.face,0xff9d4e,3.3);}
      if(A.done){wind=0;atk=Math.min(1,(A.t-A.wind)/.45)}
      if(A.t>A.wind+.45){e.act=null;e.cd=e.atkCd;}
    }else if(A.type==='swing'){wind=Math.min(1,A.t/A.wind);if(A.t<A.wind)turnTo(e,ang,dt,e.isBoss?9:4);
      if(!A.done&&A.t>=A.wind){A.done=true;if(e.isBoss||e.rival)sfx('swing');let da=ang-e.face;da=Math.atan2(Math.sin(da),Math.cos(da));if(d<e.range+1+(T.r||.5)&&Math.abs(da)<1.2)dmgTo(T,e.dmg*(A.mul||1));fxSlash(e.x,e.z,e.face,e.isBoss?0xff4040:0xff8a8a,e.range+.8);tierSwing177(e,T);familySwing182(e,T)}
      if(A.done){wind=0;atk=(A.t-A.wind)/.3}if(A.t>A.wind+.3){e.act=null;e.cd=e.atkCd}}
    else if(A.type==='shoot'){if(e.m.mon==='draconico318')e.m.attack318='Cast';wind=Math.min(1,A.t/A.wind);turnTo(e,ang,dt,8);if(!A.done&&A.t>=A.wind){A.done=true;if(A.spread){for(const o of[-.25,0,.25])shoot(e.x,e.z,e.face+o,13,e.dmg,'enemy',0x9cf0ff,'orb')}else goblinShot118(e);tierShoot177(e)}if((e.m.organic||e.m.mon==='draconico318')&&A.done){wind=0;atk=Math.max(.000001,(A.t-A.wind)/.25)}if(A.t>A.wind+.25){e.act=null;e.cd=e.atkCd}}
    else if(A.type==='lunge'||A.type==='charge'){
      if(A.t<A.wind){wind=A.t/A.wind;turnTo(e,ang,dt,6);A.dir={x:Math.sin(e.face),z:Math.cos(e.face)}}
      else{const sp=A.type==='charge'?18:13;moveEnt(e,A.dir.x*sp*dt,A.dir.z*sp*dt);mv=1;atk=.5;if(!A.hit&&Math.hypot(T.x-e.x,T.z-e.z)<e.r+1.1){A.hit=true;dmgTo(T,e.dmg*(A.type==='charge'?1.5:1.2))}}
      if(A.t>A.wind+(A.type==='charge'?.75:.45)){e.act=null;e.cd=e.atkCd*(A.type==='charge'?.6:1)}}
    else if(A.type==='slam'){wind=Math.min(1,A.t/A.wind);if(e.m.organic&&A.t>=A.wind){wind=0;atk=Math.max(.000001,(A.t-A.wind)/.3)}if(A.t>A.wind+.3){e.act=null;e.cd=e.atkCd}}
    else if(A.type==='cast'){wind=Math.min(1,A.t/.6);if(A.t>1.1){e.act=null;e.cd=.6}}
  }else{
    turnTo(e,ang,dt,e.isBoss?7+(e.gr||0)*.6:undefined);
    if(e.isBoss&&!e.world){e.volT=(e.volT??3)-dt;if(e.volT<=0&&d<22){const g=e.gr||0;e.volT=Math.max(1.4,4-g*.3)*(e.phase>=2?.75:1);const n=6+g*2+(e.phase>=2?4:0),off=Math.random()*TAU;if(!(e.boss160id&&window.Boss160&&Boss160.volley(e,T,n)))for(let i=0;i<n;i++)shoot(e.x,e.z,off+i/n*TAU,9+g*.6,e.dmg*.45,'enemy',0xff5d7a,'orb');sfx('swing')}}
    if(e.ai==='melee'||e.ai==='boss'||e.ai==='rival'){
      if(e.ai==='boss'){e.spT-=dt;if(e.spT<=0&&d<20){e.spT=(e.phase>=2?4.2:6.5)*(e.phase>=3?.7:1)*((e.boss.types||[]).length>2?.8:1);bossSpecial(e,T);return}}
      if(e.ai==='rival'){e.dashCd-=dt;if(e.dashCd<=0&&d>4&&d<10){e.dashCd=rnd(2.5,4);e.act={type:'lunge',t:0,wind:.3};return}if(player.atkT>0&&d<3&&Math.random()<.02){e.kb.x=-dx/d*9;e.kb.z=-dz/d*9}}
      if(d>e.range+(T.r||.5)*.6){moveEnt(e,dx/d*spd*dt,dz/d*spd*dt);mv=1}
      else if(e.cd<=0)e.act={type:'swing',t:0,wind:e.wind,mul:e.rival&&Math.random()<.3?1.6:1};
    }else if(e.ai==='slam'){
      if(d>e.range+(T.r||.5)*.6){moveEnt(e,dx/d*spd*dt,dz/d*spd*dt);mv=1}
      else if(e.cd<=0){e.act={type:'slam',t:0,wind:e.wind};hazard(e.x+Math.sin(e.face)*1.6,e.z+Math.cos(e.face)*1.6,3.2,e.wind,e.dmg*1.3,'enemy',0xff6030)}
    }else if(e.m.mon==='draconico318'&&d<3.3&&e.cd<=0){
      e.strike318=(e.strike318||0)+1;e.act={type:e.strike318%3===0?'draco_tail':'draco_claw',t:0,wind:e.wind};
    }else if(e.ai==='wraith'){
      e.blinkCd=(e.blinkCd||0)-dt;
      if(d<5&&e.blinkCd<=0){for(let t=0;t<8;t++){const a=rnd(0,TAU),nx=T.x+Math.cos(a)*9,nz=T.z+Math.sin(a)*9;if(freeAt(nx,nz,.5)){fxBurst(e.x,1,e.z,0x9cf0ff,8,3);e.x=nx;e.z=nz;e.blinkCd=4;break}}}
      else if(d>11){moveEnt(e,dx/d*spd*dt,dz/d*spd*dt);mv=1}else{moveEnt(e,dz/d*spd*.6*dt,-dx/d*spd*.6*dt);mv=.6}
      if(e.cd<=0&&d<14&&los(e.x,e.z,T.x,T.z))e.act={type:'shoot',t:0,wind:e.wind,spread:true};
    }else if(e.ai==='ranged'){
      if(d<6){moveEnt(e,-dx/d*spd*dt,-dz/d*spd*dt);mv=1}else if(d>11){moveEnt(e,dx/d*spd*dt,dz/d*spd*dt);mv=1}else{moveEnt(e,dz/d*spd*.5*dt,-dx/d*spd*.5*dt);mv=.6}
      if(e.cd<=0&&d<14&&los(e.x,e.z,T.x,T.z))e.act={type:'shoot',t:0,wind:e.wind};
    }else if(e.ai==='lunge'){
      if(d>7.5){moveEnt(e,dx/d*spd*dt,dz/d*spd*dt);mv=1}else if(e.cd<=0)e.act={type:'lunge',t:0,wind:e.wind};else if(d>e.range+.6){moveEnt(e,dx/d*spd*.5*dt,dz/d*spd*.5*dt);mv=.5}
    }
  }
  for(const o of enemies){if(o===e||o.dead||o.sleep)continue;const sx=e.x-o.x,sz=e.z-o.z;if(Math.abs(sx)>2.5||Math.abs(sz)>2.5)continue;const sd=Math.hypot(sx,sz),m=e.r+o.r;if(sd<m&&sd>0)moveEnt(e,sx/sd*(m-sd)*.5,sz/sd*(m-sd)*.5)}
  if(e.act&&e.act.t<e.act.wind&&!e.isBoss)e.mats.forEach(m=>m.emissive.setHex(Math.sin(e.t*40)>0?0x552200:(m.userData.e0??0)));
  animChibi(e.m,{move:mv,speed:Math.hypot(e.x-e.m.root.position.x,e.z-e.m.root.position.z)/Math.max(dt,.001),atk:clamp(atk,0,1),dead:0,wind},e.t);if(e.isBoss||e.elite)juice233(e,mv,clamp(atk,0,1),wind||0,dt);if(window.Anim303)Anim303.enemyPost(e,dt);
  e.m.root.position.set(e.x,0,e.z);e.m.root.rotation.y=e.face;
}
/* v166 (Irror): barras de vida sobrepostas e coloridas; a da frente esvazia e revela a de trás. Bolinhas em cima marcam quantas faltam. */
const BOSS_COLS166=['#ff2d55','#ff8a3d','#ffd23d','#5fe07a','#3dc8ff','#7a6bff','#d06bff','#ff6bd0'];
function bossBars166(b){const n=b.bars||3,f=Math.max(0,b.hp)/b.maxhp*n,cur=Math.max(b.hp>0?1:0,Math.ceil(f-1e-9)),part=cur?f-(cur-1):0,col=BOSS_COLS166[(cur-1+BOSS_COLS166.length)%BOSS_COLS166.length];
  $('bb').style.width=(100*part)+'%';$('bb').style.background=col;$('bbar').style.background=cur>1?BOSS_COLS166[(cur-2)%BOSS_COLS166.length]+'55':'rgba(0,0,0,.45)';$('bx').textContent=n>1?'×'+cur:'';
  const pp=$('bpips');if(pp.childElementCount!==n)pp.innerHTML='<i></i>'.repeat(n);[...pp.children].forEach((d,i)=>{d.className=i<cur?'on':'';d.style.setProperty('--c',BOSS_COLS166[i%BOSS_COLS166.length])})}
function bossBarsFor166(gr){return [1,2,3,3,4,4,5,6,7,8][Math.max(0,Math.min(9,gr|0))]}
/* v218 (Ian): chefes falam e ligam a história (Arquiteto, Fenda, Transmigradores). Chefes do despertar e Divindades têm falas próprias. */
const BOSSL218={
 base:{aggro:['Mais um Transmigrador... o Arquiteto disse que vocês viriam.','Esta fenda é minha. Volte para o seu mundo.','Você cheira a outro céu. Vou guardar seus ossos.'],fury:['Chega de brincar!','A Fenda me alimenta. E você só sangra.'],power:['O Arquiteto me deu isto. Veja!','Agora você conhece o meu peso.'],death:['O Arquiteto... vai lembrar... de você.','A fenda... fecha... mas outra abre.','Você só atrasou o fim.']},
 goblins:{aggro:['Ouro! Ouro de Transmigrador!','O Clã Ferrugem não teme gente de fora!'],death:['Fala... pro clã... que eu lutei bem.']},
 wolves:{aggro:['A matilha sentiu você desde a estrada.'],death:['Os filhotes... vão uivar meu nome.']},
 demons:{aggro:['Eu já queimei três mundos antes deste.'],death:['O fogo... não morre... só espera.']},
 undead:{aggro:['Eu também atravessei a fenda um dia. Olhe no que virei.'],death:['Finalmente... silêncio.']},
 awaken:{aggro:['Você carrega pedaços de mim. Prove que merece o resto.','Quer o meu poder? Então copie cada golpe meu.'],fury:['Você aprende rápido. Rápido demais.'],death:['Leve o que era meu. E não desonre.','O próximo a usar esta força... será você.']},
 piece:{aggro:['Eu sou uma parte. As outras estão vindo.','Quando as cinco âncoras caírem, eu volto a ser inteiro.'],fury:['Você está ferindo um pedaço do céu.'],death:['Um pedaço cai... os outros lembram.','Você só me atrasou. As âncoras vão cair.']},
 god:{aggro:['Eu sou um dedo do Arquiteto tocando este mundo.','Ajoelhe. Deuses não lutam, julgam.'],fury:['Você feriu um deus. Isso tem preço.'],death:['Um pedaço dele... caiu... ele vai sentir.','Você não matou um deus. Só abriu a porta.']}};
function bossSay218(b,stage){try{if(!b||!b.isBoss)return;const fam=(L.gate&&L.gate.family124)||'',grp=b.piece222?'piece':(b.threat184||0)>=9?'god':L.gate&&L.gate.set153?'awaken':/goblin/.test(fam)?'goblins':/wol|lobo/.test(fam)?'wolves':/demon/.test(fam)?'demons':/undead|crypt|skel|necro/.test(fam)?'undead':'base';
 const T=(BOSSL218[grp]&&BOSSL218[grp][stage])||BOSSL218.base[stage];if(!T)return;const line=pick(T);speech153(b,line);logNews('<b>'+gearText(b.name||'Chefe')+':</b> “'+line+'”')}catch(e){}}
function bossAggro(b){bossSay218(b,'aggro');if(b.raid155)bossE=b;$('boss').hidden=false;toast('<b>[NARRADOR]</b> Guardião: <b>'+b.name+'</b>');bossLight.color.setHex(0xffd070);bossLight.intensity=1.4}
function bossSpecial(b,T){
  // v161: chefe de classe rara usa o poder da própria classe.
  if(b.boss160id&&window.Boss160&&Boss160.special(b,T)){b.spI=(b.spI||0)+1;return}
  const types=b.boss.types||[b.boss.type];b.spI=(b.spI||0)+1;const tp=types[b.spI%types.length],p2=b.phase>=2;b.act={type:'cast',t:0,wind:.6};
  if(tp==='seismic'){hazard(b.x,b.z,p2?9:7,1.1,b.dmg*1.6,'enemy',0xff3030);if(p2)setTimeout(()=>{if(!b.dead&&L.mode==='dungeon')hazard(b.x,b.z,12,1,b.dmg*1.2,'enemy',0xff3030)},700);toast('<b>[NARRADOR]</b> '+b.name+': Golpe Sísmico',1400)}
  else if(tp==='soulrain'){const n=p2?9:5;for(let i=0;i<n;i++){const hx=T.x+(i?rnd(-4,4):0),hz=T.z+(i?rnd(-4,4):0);hazard(hx,hz,2.2,1+i*.12,b.dmg*1.1,'enemy',0xb06bff);fallFx(hx,hz,1+i*.12,'soul',0xb06bff)}toast('<b>[NARRADOR]</b> '+b.name+': Chuva de Almas',1400)}
  else if(tp==='fury'){const a=Math.atan2(T.x-b.x,T.z-b.z);b.face=a;for(let i=1;i<=5;i++)hazard(b.x+Math.sin(a)*i*2.6,b.z+Math.cos(a)*i*2.6,1.7,.9,0,'enemy',0xff3030);b.act={type:'charge',t:0,wind:.9,dir:{x:Math.sin(a),z:Math.cos(a)}};toast('<b>[NARRADOR]</b> '+b.name+': Investida Sangrenta',1400)}
  else if(tp==='legion'){const n=p2?4:3;for(let i=0;i<n;i++){const a=i/n*TAU;let x=b.x+Math.cos(a)*3.5,z=b.z+Math.sin(a)*3.5;if(!freeAt(x,z,.5)){x=b.x;z=b.z}const m=spawnKind(bossMinion124(b,b.gr>=6?(i%2?'demon':'wraith'):(i%2?'minion':'rogue')),x,z,b.gr,{room:b.room});m.aggro=true;fxRing(m.x,m.z,0xd0d0d0,1.5)}hazard(b.x,b.z,5,1,b.dmg,'enemy',0xff3030);toast('<b>[NARRADOR]</b> '+b.name+': Legião',1400)}
}
function echoAttackMul(a,e){return (a.kitBuff111?.until>time?1+a.kitBuff111.amount:1)*(a.shadow&&e&&e.echoMarkUntil>time?1.2:1)*(a.shadow||a.permanentSummon?1+.08*gearRuneCount('command'):1)}
function updAlly(a,dt){if(window.Cogu348&&Cogu348.asleep(a)){animChibi(a.m,{move:0,atk:0,dead:0,wind:0},time);return;}if(a.caravan){if(!a.dead)caravanUpd(a,dt);return}
  if(a.dead)return;a.t+=dt;a.cd-=dt;if(!a.permanentSummon)a.life-=dt;if(a.buffT>0){a.buffT-=dt;if(Math.random()<dt*3)fxBurst(a.x,1.2,a.z,0xb98cff,1,1)}a.healCd=(a.healCd||0)-dt;
  if(a.life<=0){a.dead=true;scene.remove(a.m.root);fxBurst(a.x,1,a.z,0x6ff4ff,6,3);return}
  if(a.flash>0){a.flash-=dt;flashMats(a.m,a.flash>0?1:0,0x550000)}
  if(kitStation111(a))return;if(a.guardianTrial108){animChibi(a.m,{move:0,atk:0},a.t);a.m.root.position.set(a.x,0,a.z);return}
  const P=player,pdist=Math.hypot(P.x-a.x,P.z-a.z);
  if(a.healer&&a.healCd<=0&&!P.dead&&P.hp<P.maxhp*.6&&pdist<12){a.healCd=7;const h=P.maxhp*.22;P.hp=Math.min(P.maxhp,P.hp+h);fxRing(P.x,P.z,0xfff3a0,3,.6);floater(P.x,P.z,'+'+fmt(h)+' ('+a.short+')','#9fffc0')}
  const ord=a.shadow?(run.order||'atacar'):'atacar';
  let e=(a.guest&&pdist>18)?nearestEnemy(a.x,a.z,9):nearestEnemy(a.x,a.z,11);
  if(a.permanentSummon){const focus=enemies.find(t=>!t.dead&&t.summonFocusUntil>time&&Math.hypot(t.x-a.x,t.z-a.z)<14);if(focus)e=focus}
  if(ord==='seguir')e=null;else if(ord==='defender'){e=nearestEnemy(P.x,P.z,8)}
  if(a.rareOrder103&&a.rareOrder103.until>time){const o=a.rareOrder103;e=o.target&&!o.target.dead?o.target:nearestEnemy(o.x,o.z,6);if(!e){const d=Math.hypot(o.x-a.x,o.z-a.z);if(d>1)moveEnt(a,(o.x-a.x)/d*a.speed*dt,(o.z-a.z)/d*a.speed*dt);a.m.root.position.set(a.x,0,a.z);return}}
  let mv=0,atk=0;
  if(a.act){a.act.t+=dt;atk=a.act.t/.3;if(!a.act.done&&a.act.t>.15){a.act.done=true;const t=a.act.e;
      if(a.ranged){if(t&&!t.dead)shoot(a.x,a.z,a.face,20,a.dmg*(a.buffT>0?1.6:1)*echoAttackMul(a,t),'player',a.col,'orb',{fromPlayer:false})}
      else{if(t&&!t.dead&&Math.hypot(t.x-a.x,t.z-a.z)<a.range+t.r+.6)hurtEnemy(t,a.dmg*(a.buffT>0?1.6:1)*echoAttackMul(a,t),a.x,a.z,{kb:1.2});fxSlash(a.x,a.z,a.face,a.shadow?0xa26bff:(a.col||0x6ff4ff),2)}}
    if(a.act.t>.3){a.act=null;a.cd=a.summonKind==='golem'?1.5:a.shadow?.7:a.ranged?1.1:.9}}
  else if(e&&(pdist<18||a.guest)){const dx=e.x-a.x,dz=e.z-a.z,d=Math.hypot(dx,dz);turnTo(a,Math.atan2(dx,dz),dt);
    if(a.ranged){if(d<5){moveEnt(a,-dx/d*a.speed*dt,-dz/d*a.speed*dt);mv=1}else if(d>a.range){moveEnt(a,dx/d*a.speed*dt,dz/d*a.speed*dt);mv=1}else if(a.cd<=0)a.act={t:0,e}}
    else if(d>a.range+e.r){moveEnt(a,dx/d*a.speed*dt,dz/d*a.speed*dt);mv=1}else if(a.cd<=0)a.act={t:0,e}}
  else if(!a.guest||pdist<14){let tx=P.x,tz=P.z,near=3;if(!a.guest&&!a.party){const F=allies.filter(o=>!o.dead&&!o.guest&&!o.party&&!o.caravan),i=F.indexOf(a),row=Math.floor(i/4),cn=Math.min(4,F.length-row*4),col=i%4-(cn-1)/2,bx=col*1.6,bz=-(2.2+row*1.6),sf=Math.sin(P.face),cf=Math.cos(P.face);tx=P.x+bx*cf+bz*sf;tz=P.z-bx*sf+bz*cf;near=.35}
    const dx=tx-a.x,dz=tz-a.z,d=Math.hypot(dx,dz);if(d>near){turnTo(a,Math.atan2(dx,dz),dt);const s=d>10?a.speed*1.6:d<1.5?a.speed*.7:a.speed;moveEnt(a,dx/d*Math.min(s*dt,d),dz/d*Math.min(s*dt,d));mv=d>.6?1:.4}else turnTo(a,P.face,dt)
    if(a.guest&&!a.joined){a.joined=true;toast('<b>[NARRADOR]</b> '+a.short+' e o grupo dele vão lutar com você nesta masmorra.')}
    if(d>28&&!a.guest){a.x=P.x+rnd(-1,1);a.z=P.z+1;if(L.grid&&!freeAt(a.x,a.z,.4)){a.x=P.x;a.z=P.z}}}
  animChibi(a.m,{move:mv,speed:Math.hypot(a.x-a.m.root.position.x,a.z-a.m.root.position.z)/Math.max(dt,.001),atk:clamp(atk,0,1),dead:0,wind:0},a.t);a.m.root.position.set(a.x,0,a.z);a.m.root.rotation.y=a.face;
}
function updNpc(n,dt){
  n.t+=dt;const P=player,c=n.home;if(n.kind==='deco')return;
  if(n.kind==='vendor'){if(P&&Math.hypot(P.x-n.x,P.z-n.z)<8)turnTo(n,Math.atan2(P.x-n.x,P.z-n.z),dt,4);animChibi(n.m,{move:0,atk:0,dead:0,wind:0},n.t);n.m.root.rotation.y=n.face;return}
  let mv=0;
  if(n.kind==='citizen'){const danger=enemies.find(e=>!e.dead&&!e.gone&&cityRaider341(e)&&Math.hypot(e.x-n.x,e.z-n.z)<20);if(danger){if(!n.panic348){n.panic348=true;floater(n.x,n.z,'SOCORRO!','#ffd7b0')}const dx=n.x-danger.x,dz=n.z-danger.z,d=Math.hypot(dx,dz)||1;turnTo(n,Math.atan2(dx,dz),dt,8);moveEnt(n,dx/d*5.5*dt,dz/d*5.5*dt);n.wait=0;n.path=[];animChibi(n.m,{move:1,atk:0,dead:0,wind:0},n.t);n.m.root.position.set(n.x,0,n.z);n.m.root.rotation.y=n.face;return}else n.panic348=false}
  if(n.kind==='citizen'&&isNight()&&!n.leaving){n.leaving=true;n.path=[];n.wait=0;const a=rnd(0,TAU);n.tx=c.x+Math.cos(a)*27;n.tz=c.z+Math.sin(a)*27}
  if(n.wait>0){n.wait-=dt}
  else{
    if(n.goGate&&n.goGate.dead){n.goGate=null;n.path=[]}
    const tgt=n.path.length?n.path[0]:{x:n.tx,z:n.tz};const dx=tgt.x-n.x,dz=tgt.z-n.z,d=Math.hypot(dx,dz);
    if(d<1.2){if(n.path.length){n.path.shift()}
      else if(n.leaving){n.gone=true;scene.remove(n.m.root)}
      else if(n.goGate){n.gone=true;scene.remove(n.m.root);fxRing(n.x,n.z,0xffd08a,2)}
      else{n.wait=rnd(2,6);const gs=gates.filter(g=>!g.dead&&Math.hypot(g.x-c.x,g.z-c.z)<200);const rx=n.x-c.x,rz=n.z-c.z;
        if(n.kind!=='citizen'&&Math.random()<.22&&gs.length){const g=pick(gs);n.goGate=g;const ga=Math.round(Math.atan2(g.z-c.z,g.x-c.x)/(Math.PI/2))*(Math.PI/2);n.path=[{x:c.x+Math.cos(ga)*28,z:c.z+Math.sin(ga)*28},{x:c.x+Math.cos(ga)*40,z:c.z+Math.sin(ga)*40}];n.tx=g.x;n.tz=g.z+1}
        else if(Math.hypot(rx,rz)>30){const ga=Math.round(Math.atan2(rz,rx)/(Math.PI/2))*(Math.PI/2);n.path=[{x:c.x+Math.cos(ga)*40,z:c.z+Math.sin(ga)*40},{x:c.x+Math.cos(ga)*26,z:c.z+Math.sin(ga)*26}];n.tx=c.x+rnd(-10,10);n.tz=c.z+rnd(-10,10)}
        else{const a=rnd(0,TAU),r=rnd(3,20);n.tx=c.x+Math.cos(a)*r;n.tz=c.z+Math.sin(a)*r}}}
    else{turnTo(n,Math.atan2(dx,dz),dt,6);moveEnt(n,dx/d*3.2*dt,dz/d*3.2*dt);mv=1}
  }
  animChibi(n.m,{move:mv,atk:0,dead:0,wind:0},n.t);n.m.root.position.set(n.x,0,n.z);n.m.root.rotation.y=n.face;
}

