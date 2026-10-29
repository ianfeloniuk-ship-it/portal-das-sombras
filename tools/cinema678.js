/* v678 (Ian: «não é um videozinho com VFX, é cinema» — He-Man do último filme, o simbionte da Marvel):
   a transformação vira uma cena de filme com cortes de câmera. O corpo da criatura nasce DENTRO do Viajante e o toma
   aos poucos a partir da mão direita: uma frente viva (bordas acesas, fios) come a pele do Viajante e revela a pele
   da criatura por baixo — primeiro a mão vira garra, depois o braço, o peito, o corpo todo; o corpo cresce até o
   tamanho da fera; close no rosto no rugido; a câmera abre e o controle volta.
   Planos: 1 geral baixo · 2 close na mão · 3 por cima do ombro (o corpo é tomado e cresce) · 4 rosto (rugido) · 5 abre.
   Faixas pretas de cinema, cor de filme, o jogador não anda durante a cena. A volta continua a de tools/transforma677.js. */
(function(global){
'use strict';
const T=global.THREE,TR=global.Transforma677;if(!T||!TR)return;
const LOOK={
  lobisomem:{edge:0xff3a10,edge2:0x200400,grade:'contrast(1.18) saturate(.75) sepia(.12)'},
  vampiro:{edge:0xff1030,edge2:0x0a0004,grade:'contrast(1.2) saturate(.7) hue-rotate(-8deg)'},
  draugr:{edge:0x9fe8ff,edge2:0x0a1620,grade:'contrast(1.15) saturate(.45) brightness(.92)'}
};
const SHOTS=[0,1.6,5.4,8.6,10.2,12];/* início de cada plano (s) e o fim */
const API=global.Cinema678={LOOK,s:null};
/* a forma segue o corpo do jogador: vampiro masculino para o Viajante; draugr guerreiro (morto-vivo de armadura) */
const fem=()=>{try{return /f|mulher|fem/i.test(String(profile.gender||profile.sex||''))}catch(_){return false}};
const WANT={vampiro:()=>fem()?/feminina/:/masculino/,draugr:()=>/guerreiro/};
/* frente de transformação: cada material ganha um corte por distância a um centro que cresce */
function cutMats(m){if(m.cut678)return m.cut678;const U={uC:{value:new T.Vector4(0,0,0,-1)},uMode:{value:0},uEdge:{value:new T.Color()},uEdge2:{value:new T.Color()},uT:{value:0}};
  m.root.traverse(o=>{if(!o.isMesh||!o.material)return;for(const mt of [].concat(o.material)){const ob=mt.onBeforeCompile;mt.onBeforeCompile=function(sh,r){if(ob)ob.call(this,sh,r);Object.assign(sh.uniforms,U);
      sh.vertexShader='varying vec3 vW678;\n'+sh.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvW678=(modelMatrix*vec4(transformed,1.0)).xyz;');
      sh.fragmentShader='varying vec3 vW678;uniform vec4 uC;uniform float uMode,uT;uniform vec3 uEdge,uEdge2;\nfloat e678=0.;\n'+sh.fragmentShader
        .replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nif(uMode!=0.){vec3 q=vW678*9.;float n=sin(q.x+sin(q.y*1.7+uT*3.))*sin(q.y*1.3+uT*2.)*sin(q.z+sin(q.x*1.9))*.09+sin(q.y*4.+q.x*3.)*.025;float d=distance(vW678,uC.xyz)+n-uC.w;if(uMode>0.&&d>0.)discard;if(uMode<0.&&d<0.)discard;e678=1.-smoothstep(0.,.035,abs(d));}')
        .replace('#include <encodings_fragment>','#include <encodings_fragment>\nif(e678>0.)gl_FragColor.rgb=mix(gl_FragColor.rgb,mix(uEdge2,uEdge*1.7,e678*e678*e678),min(1.,e678*1.2));');};
    const k0=mt.customProgramCacheKey?mt.customProgramCacheKey.bind(mt):()=>'';mt.customProgramCacheKey=()=>k0()+'|cut678';mt.needsUpdate=true}});
  return m.cut678=U}
let bars=null;
/* esconde o HUD durante a cena (só fica o 3D): tudo some por CSS e só o canvas do jogo e as faixas voltam a aparecer */
let css678=null;
function hud678(on){if(!css678){css678=document.createElement('style');css678.textContent='body.cine678 *{visibility:hidden!important}body.cine678 .keep678,body.cine678 canvas{visibility:visible!important}';document.head.appendChild(css678)}
  const c=global.renderer&&renderer.domElement;if(c)c.classList.add('keep678');if(bars)for(const d of bars)d.classList.add('keep678');document.body.classList.toggle('cine678',!!on)}
function letterbox(a,grade){if(!bars){bars=['top','bottom'].map(side=>{const d=document.createElement('div');d.style.cssText=`position:fixed;left:0;right:0;${side}:0;height:0;background:#000;z-index:60;pointer-events:none`;document.body.appendChild(d);return d})}
  hud678(a>0);for(const d of bars)d.style.height=(a*12).toFixed(2)+'vh';const c=global.renderer&&renderer.domElement;if(c)c.style.filter=a>0?grade:''}
const ease=x=>x<0?0:x>1?1:x*x*(3-2*x);
const bone=(m,n)=>{const b=m&&m.bones&&m.bones[n];return b?b.getWorldPosition(new T.Vector3()):null};
/* procura um lado sem casa, carroça ou árvore entre a câmera dos planos gerais e o jogador */
function clearSide(P,skip){const gy=terrH(P.x,P.z),from=new T.Vector3(P.x,gy+1.3,P.z),rc=new T.Raycaster(),objs=scene.children.filter(o=>!skip.includes(o)&&o.visible&&!o.isLight);
  let best=0,bestN=1e9;for(const a of [0,.8,-.8,1.6,-1.6,2.4,-2.4,Math.PI]){const f=(P.face||0)+a;let n=0;
    for(const [d,r,y] of [[5.5,1.6,.45],[4.3,1.6,.45],[-3,-.9,1.9],[-2,-.9,1.9],[3,0,.7],[5,1,2],[7,2,3.3]]){const to=new T.Vector3(P.x+Math.sin(f)*d+Math.cos(f)*r,gy+y,P.z+Math.cos(f)*d-Math.sin(f)*r),dir=to.clone().sub(from),len=dir.length();rc.set(from,dir.normalize());rc.far=len;
      const hits=[];for(const o of objs){try{rc.intersectObject(o,true,hits)}catch(_){}}if(hits.some(i=>!i.object.isPoints&&!i.object.isSprite&&i.distance>.6&&!(i.object.material&&i.object.material.transparent)))n++}
    if(n<bestN){bestN=n;best=a}if(!n)break}/* o lado com menos coisas na frente */
  return best}
API.play=function(k){const L=LOOK[k];if(!L||API.s||TR.scene||TR.cur||!global.player||!player.m||!global.Criaturas673)return false;
  const P=player,old=P.m,m=Criaturas673.model(k,WANT[k]&&WANT[k]()),par=old.root.parent;if(!par)return false;
  const full=m.model.scale.x,h0=(old.height482||2.05)/(m.height482||2.05);m.model.scale.setScalar(full*h0);/* nasce do tamanho do Viajante */
  par.add(m.root);m.root.position.copy(old.root.position);m.root.rotation.copy(old.root.rotation);
  const Uo=cutMats(old),Un=cutMats(m);for(const [U,mode] of [[Uo,-1],[Un,1]]){U.uMode.value=mode;U.uEdge.value.setHex(L.edge);U.uEdge2.value.setHex(L.edge2);U.uC.value.w=-1}
  API.s={k,L,t:0,rot:clearSide(P,[old.root,m.root]),old,m,full,h0,Uo,Un,spd0:P.spd,fov0:camera.fov,cam:null,done:{},parts:[]};P.spd=0;
  try{if(global.FP550&&FP550.active)FP550.set(false)}catch(_){}try{if(typeof sfx==='function')sfx('hit')}catch(_){}return true};
function tick(dt){const S=API.s;if(!S)return;const P=player,t=(S.t+=dt),{old,m}=S;
  m.root.position.copy(old.root.position);m.root.rotation.copy(old.root.rotation);P.spd=0;
  for(const U of [S.Uo,S.Un])U.uT.value=t;
  /* o corpo novo se mexe junto (respira), e ruge no plano do rosto */
  if(t>=SHOTS[3]&&!S.done.roar){S.done.roar=1;m.forceClip677=TR.FORM[S.k].roar;try{shakeA=Math.max(shakeA||0,.8);if(typeof sfx==='function')sfx('boss')}catch(_){}}
  try{animChibi(m,{move:0,dead:0,atk:0},performance.now()/1000)}catch(_){}
  if(t>SHOTS[1]&&t<SHOTS[3])spasm(S,t);
  /* a frente: nasce na mão direita (garra), sobe pelo braço e toma o corpo */
  const hand=bone(old,'hand_r')||new T.Vector3(P.x,terrH(P.x,P.z)+1,P.z);
  const r=t<SHOTS[1]?-1:t<SHOTS[2]?.02+.3*ease((t-SHOTS[1]-.4)/(SHOTS[2]-SHOTS[1]-.6)):.32+2.6*ease((t-SHOTS[2])/(SHOTS[3]-SHOTS[2]-.4));
  for(const U of [S.Uo,S.Un])U.uC.value.set(hand.x,hand.y,hand.z,r);
  /* cresce até o tamanho da fera enquanto é tomado */
  if(t>SHOTS[2])m.model.scale.setScalar(S.full*(S.h0+(1-S.h0)*ease((t-SHOTS[2]-.6)/(SHOTS[3]-SHOTS[2]))));
  if(t>SHOTS[2]&&!S.done.burst){S.done.burst=1;try{shakeA=Math.max(shakeA||0,.25)}catch(_){}}
  letterbox(ease(t/.8)*(1-ease((t-SHOTS[5]+.9)/.9)),S.L.grade);
  if(t>=SHOTS[5])finish(S)}
/* espasmos: coluna, ombros e cabeça puxam em trancos, mais fortes quando a frente passa pelo peito */
function spasm(S,t){const a=t<SHOTS[2]?.25*ease((t-SHOTS[1])/1.5):.25+.45*Math.sin(Math.PI*Math.min(1,(t-SHOTS[2])/(SHOTS[3]-SHOTS[2])));
  const j=(f,p)=>Math.sin(t*f+p)*Math.sin(t*f*.37+p*2.1);
  for(const m of [S.old,S.m]){const b=m.bones||{};const add=(n,x,y,z)=>{const o=b[n];if(o&&o.isBone){o.rotation.x+=x*a;o.rotation.y+=y*a;o.rotation.z+=z*a}};
    add('spine',.35*j(11,0)+.25,0,.12*j(7,1));add('chest',.25*j(13,2)+.2,.15*j(9,3),0);add('neck',.3*j(17,4),.2*j(5,5),0);add('head',-.35*j(15,6)-.2,.25*j(8,7),.15*j(12,8));
    add('upperarm_r',.3*j(10,9),0,.35*j(14,1));add('upperarm_l',.3*j(12,3),0,-.35*j(9,2));add('forearm_r',.4*j(16,4),0,0);add('forearm_l',.4*j(13,6),0,0);m.model.updateMatrixWorld(true)}}
function finish(S){const P=player,{old,m}=S;S.Un.uMode.value=0;S.Uo.uMode.value=0;if(old.root.parent)old.root.parent.remove(old.root);
  P.m=m;m.forceClip677=null;TR.viajante=old;try{TR.dist0=pcCam.distance;pcCam.distance=Math.min(9,pcCam.distance/S.h0*1.15)}catch(_){}/* a câmera acompanha o tamanho da fera */TR.cur=S.k;TR.spd0=S.spd0;P.spd=S.spd0*TR.FORM[S.k].spd;camera.fov=S.fov0;camera.updateProjectionMatrix();letterbox(0,'');
  try{toast('<b>['+TR.FORM[S.k].name+']</b> '+TR.FORM[S.k].text,4000)}catch(_){}API.s=null}
/* câmera: um plano por trecho, movimento lento dentro de cada um */
function shot(S){const P=player,t=S.t,f=(P.face||0)+(S.rot||0),F=new T.Vector3(Math.sin(f),0,Math.cos(f)),R=new T.Vector3(Math.cos(f),0,-Math.sin(f)),gy=terrH(P.x,P.z),base=new T.Vector3(P.x,gy,P.z);
  const hand=bone(S.old,'hand_r')||base.clone().setY(gy+1),head=bone(S.m,'head')||base.clone().setY(gy+2),chest=bone(S.m,'chest')||base.clone().setY(gy+1.4);
  let pos,look,fov;
  if(t<SHOTS[1]){const u=t/SHOTS[1];pos=base.clone().addScaledVector(F,5.5-1.2*u).addScaledVector(R,1.6).setY(gy+.45);look=base.clone().setY(gy+1.3);fov=40}/* 1: geral, de baixo, chegando */
  else if(t<SHOTS[2]){const u=(t-SHOTS[1])/(SHOTS[2]-SHOTS[1]),a=-.6+.9*u;pos=hand.clone().add(new T.Vector3().addScaledVector(F,.95*Math.cos(a)).addScaledVector(R,.95*Math.sin(a)+.3)).setY(hand.y+.25);look=hand;fov=30}/* 2: a mão */
  else if(t<SHOTS[3]){const u=(t-SHOTS[2])/(SHOTS[3]-SHOTS[2]);pos=chest.clone().addScaledVector(F,-1.9-1.1*u).addScaledVector(R,-.9).setY(chest.y+.5+.4*u);look=chest.clone().addScaledVector(R,.2);fov=42}/* 3: ombro, o corpo é tomado e cresce */
  else if(t<SHOTS[4]){const u=(t-SHOTS[3])/(SHOTS[4]-SHOTS[3]);pos=head.clone().addScaledVector(F,1.15-.25*u).addScaledVector(R,.15).setY(head.y-.08);look=head;fov=34}/* 4: rosto, rugido */
  else{const u=ease((t-SHOTS[4])/(SHOTS[5]-SHOTS[4]));pos=base.clone().addScaledVector(F,3+4*u).addScaledVector(R,2*u).setY(gy+.7+2.6*u);look=base.clone().setY(gy+1.4);fov=38+12*u}/* 5: abre */
  return{pos,look,fov}}
if(typeof camUpdate==='function'){const cu0=camUpdate;camUpdate=function(){const r=cu0.apply(this,arguments);const S=API.s;if(S){try{const c=shot(S),sh=(typeof shakeA!=='undefined'?shakeA:0)*.05;
  camera.position.copy(c.pos).add(new T.Vector3((Math.random()-.5)*sh,(Math.random()-.5)*sh,(Math.random()-.5)*sh));camera.lookAt(c.look);if(Math.abs(camera.fov-c.fov)>.01){camera.fov=c.fov;camera.updateProjectionMatrix()}}catch(e){API.err=API.err||String(e)}}return r}}
if(typeof update==='function'){const u0=update;update=function(dt){const r=u0.apply(this,arguments);try{tick(Math.min(.05,dt||.016))}/* tempo do jogo: a criatura e a cena andam juntas */catch(e){if(!API.err){API.err=String(e);console.warn('Cinema678',e)}}return r}}
})(typeof window!=='undefined'?window:globalThis);
