/* v547 (Ian, 22/10/2026): "viajanta, npcs mobs dragões tudo que tem animações" — lei anti-boneco rígido.
   Camada pós-mixer universal: roda depois de todo AnimationMixer.update (Viajante, NPCs, mobs, dragões).
   1) Pé no relevo: IK CCD de 2 ossos por perna com terrH + pelve descendo até o pé mais baixo.
   2) Cauda/pescoço/asas: onda com atraso de fase + mola de inércia pelo giro do corpo.
   3) Peso: quadril inclina nas curvas e na ladeira.
   Tudo é desfeito antes do próximo update do mixer (não acumula em osso sem trilha).
   LOD: IK até 24 m da câmera, ondas até 45 m. Desliga: window.Anim547.on=false */
(function(){
'use strict';
if(!window.THREE||!THREE.AnimationMixer||THREE.AnimationMixer.prototype.__anim547)return;
const T=THREE,API={on:true,ikDist:24,waveDist:45,stats:{rigs:0,ik:0,wave:0}};window.Anim547=API;
const ST=new WeakMap(),V1=new T.Vector3(),V2=new T.Vector3(),V3=new T.Vector3(),V4=new T.Vector3(),Q1=new T.Quaternion(),Q2=new T.Quaternion(),UP=new T.Vector3(0,1,0);
const nm=b=>(b.name||'').toLowerCase().replace(/mixamorig:?/,'');
const FOOT=/(^|[^a-z])(foot|feet|paw|ankle|pe|pata|tornozelo|hoof)(?![a-z]*(end|tip|top|_end))|leftfoot|rightfoot|footl|footr/;
const TOE=/toe|dedo|end|tip|ball|heel|_end|nub/;
const BAD=/hip|pelvis|root|spine|chest|torso|body|armature|tronco/;
const sm=(a,b,k,dt)=>a+(b-a)*(1-Math.exp(-k*dt));
function depth(b){let d=0;while(b.parent){d++;b=b.parent}return d}
function chainOf(bones,re){const L=bones.filter(b=>re.test(nm(b)));const groups=[];
  for(const b of L){if(b.parent&&re.test(nm(b.parent)))continue;const g=[b];let c=b;for(;;){const n=c.children.find(k=>k.isBone&&re.test(nm(k)));if(!n)break;g.push(n);c=n}if(g.length>=2)groups.push(g)}return groups}
function build(root){const bones=[];root.traverse(o=>{if(o.isBone)bones.push(o)});const R={root,legs:[],tails:[],necks:[],wings:[],hips:null,len:1};
  if(!bones.length)return R;
  for(const f of bones){const n=nm(f);if(!FOOT.test(n)||TOE.test(n))continue;if(f.parent&&FOOT.test(nm(f.parent)))continue;const lo=f.parent,up=lo&&lo.parent;if(!lo||!up||!lo.isBone||!up.isBone||BAD.test(nm(lo))||BAD.test(nm(up)))continue;R.legs.push({up,lo,f,d:0})}
  R.tails=chainOf(bones,/tail|cauda|rabo/);R.necks=chainOf(bones,/neck|pescoc/);R.wings=chainOf(bones,/wing|asa(?![a-z])|^asa/);
  R.hips=bones.find(b=>/hips|pelvis|quadril/.test(nm(b)))||null;
  /* comprimento de perna (mundo) p/ limitar IK */
  root.updateWorldMatrix(true,true);if(R.legs.length){let s=0;for(const g of R.legs){g.up.getWorldPosition(V1);g.lo.getWorldPosition(V2);g.f.getWorldPosition(V3);g.l1=V1.distanceTo(V2);g.l2=V2.distanceTo(V3);s+=g.l1+g.l2}R.len=s/R.legs.length||1}
  else{const b=new T.Box3().setFromObject(root);R.len=Math.max(.3,(b.max.y-b.min.y)*.45)}
  R.quad=R.legs.length>=4;API.stats.rigs++;return R}
/* --- desfazer/salvar: só restaura se ninguém mexeu depois de nós --- */
function track(S,o,prop){let r=S.touched.get(o);if(!r){r={o,q:new T.Quaternion(),p:new T.Vector3(),sq:new T.Quaternion(),sp:new T.Vector3(),hq:false,hp:false};S.touched.set(o,r)}
  if(prop==='q'&&!r.hq){r.q.copy(o.quaternion);r.hq=true}if(prop==='p'&&!r.hp){r.p.copy(o.position);r.hp=true}return r}
function seal(S){for(const r of S.touched.values()){if(r.hq)r.sq.copy(r.o.quaternion);if(r.hp)r.sp.copy(r.o.position)}}
function undo(S){for(const r of S.touched.values()){if(r.hq&&r.o.quaternion.equals(r.sq))r.o.quaternion.copy(r.q);if(r.hp&&r.o.position.equals(r.sp))r.o.position.copy(r.p);r.hq=r.hp=false}}
/* rotação em eixo do mundo aplicada no espaço local do osso */
function rotW(S,b,axis,ang){if(!ang||!b.parent)return;track(S,b,'q');b.parent.getWorldQuaternion(Q2);Q1.setFromAxisAngle(axis,ang);const inv=Q2.clone().invert();b.quaternion.premultiply(inv.multiply(Q1).multiply(Q2));b.updateMatrixWorld(true)}
function aimW(S,b,from,to){/* gira b para levar ponto 'from' até 'to' (mundo) */b.getWorldPosition(V4);const a=from.clone().sub(V4),c=to.clone().sub(V4);if(a.lengthSq()<1e-8||c.lengthSq()<1e-8)return;a.normalize();c.normalize();const ang=Math.acos(T.MathUtils.clamp(a.dot(c),-1,1));if(ang<1e-4)return;const ax=a.cross(c).normalize();rotW(S,b,ax,Math.min(ang,1.2))}
/* two-bone IK anal?tico: joelho dobra pela lei dos cossenos (joelho p/ frente), depois coxa mira o alvo */
function ik2(S,L,tgt,right){const H=L.up.getWorldPosition(new T.Vector3()),K=L.lo.getWorldPosition(new T.Vector3()),F=L.f.getWorldPosition(new T.Vector3());
  const l1=H.distanceTo(K),l2=K.distanceTo(F);if(l1<1e-5||l2<1e-5)return;const d=T.MathUtils.clamp(H.distanceTo(tgt),Math.abs(l1-l2)+1e-4,l1+l2-1e-4);
  const cur=K.clone().sub(H).normalize().angleTo(F.clone().sub(K).normalize());/* 0 = perna reta */
  const want=Math.PI-Math.acos(T.MathUtils.clamp((l1*l1+l2*l2-d*d)/(2*l1*l2),-1,1));
  let n=K.clone().sub(H).cross(F.clone().sub(K));if(n.lengthSq()<1e-8||cur<.02)n.copy(right);else n.normalize();
  rotW(S,L.lo,n,T.MathUtils.clamp(want-cur,-2.4,2.4));L.f.getWorldPosition(F);aimW(S,L.up,F,tgt)}
function camDist(p){const c=window.camera;return c?c.position.distanceTo(p):0}
function post(mixer,dt){const root=mixer.getRoot();if(!root||!root.isObject3D)return;let S=ST.get(mixer);
  if(!S){S={R:null,touched:new Map(),t:Math.random()*9,yaw:null,yr:0,spd:0,last:null,drop:0,pitch:0,roll:0};ST.set(mixer,S)}
  if(!API.on||!root.parent||root.visible===false){return}
  if(!S.R)S.R=build(root);const R=S.R;if(!R.legs.length&&!R.tails.length&&!R.necks.length&&!R.wings.length)return;
  dt=Math.min(.1,Math.max(0,dt||0))||1/60;S.t+=dt;
  root.updateWorldMatrix(true,false);root.getWorldPosition(V1);const dist=camDist(V1);if(dist>API.waveDist)return;
  /* giro e velocidade do corpo (mundo) */
  root.getWorldQuaternion(Q1);V2.set(0,0,1).applyQuaternion(Q1);const yaw=Math.atan2(V2.x,V2.z);
  if(S.yaw==null)S.yaw=yaw;let dy=yaw-S.yaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));S.yaw=yaw;
  S.yr=sm(S.yr,T.MathUtils.clamp(dy/dt,-6,6),6,dt);
  const v=S.last?V3.copy(V1).sub(S.last).setY(0).length()/dt:0;(S.last||(S.last=new T.Vector3())).copy(V1);S.spd=sm(S.spd,Math.min(v,20),5,dt);
  const fwd=V2.clone().setY(0).normalize(),right=new T.Vector3().crossVectors(UP,fwd).normalize();
  const heavy=T.MathUtils.clamp(R.len/0.6,.6,4);/* criatura grande = mola lenta */
  root.updateWorldMatrix(false,true);
  /* ---------- 1) pé no relevo ---------- */
  const tH=window.terrH;let grounded=false;
  if(R.legs.length&&typeof tH==='function'&&dist<API.ikDist){const g0=tH(V1.x,V1.z),air=V1.y-g0;grounded=Math.abs(air)<.35*Math.max(1,R.len);
    if(grounded){let minD=0;for(const L of R.legs){L.f.getWorldPosition(V2);let d=tH(V2.x,V2.z)-g0;d=T.MathUtils.clamp(d,-R.len*.45,R.len*.45);L.d=sm(L.d,d,14,dt);if(L.d<minD)minD=L.d}
      S.drop=sm(S.drop,minD,10,dt);
      /* pelve desce (modelo inteiro em Y, espaço do pai) */
      if(Math.abs(S.drop)>.002){track(S,root,'p');const ps=root.parent.getWorldScale(V4).y||1;root.position.y+=S.drop/ps;root.updateMatrixWorld(true)}
      for(const L of R.legs){const need=L.d-S.drop;if(need<.004)continue;L.f.getWorldPosition(V2);const tgt=V2.clone();tgt.y+=need;
        ik2(S,L,tgt,right);API.stats.ik++}
      /* ladeira: inclina o corpo pela diferença frente/trás */
      const k=R.len*.8,sl=Math.atan2(tH(V1.x+fwd.x*k,V1.z+fwd.z*k)-tH(V1.x-fwd.x*k,V1.z-fwd.z*k),2*k);
      S.pitch=sm(S.pitch,T.MathUtils.clamp(sl,-.5,.5)*(R.quad?.7:.22),6,dt)}
    else{S.drop=sm(S.drop,0,10,dt);S.pitch=sm(S.pitch,0,6,dt)}}
  /* ---------- 3) peso: inclinar na curva + ladeira ---------- */
  const lean=T.MathUtils.clamp(-S.yr*Math.min(S.spd,8)*.012,-.22,.22);S.roll=sm(S.roll,lean,5/heavy,dt);
  const hb=R.hips||null;if(hb&&(Math.abs(S.roll)>.003||Math.abs(S.pitch)>.003)){rotW(S,hb,fwd,S.roll);rotW(S,hb,right,-S.pitch)}
  else if(!hb&&R.quad&&Math.abs(S.pitch)>.003){track(S,root,'q');rotW(S,root,right,-S.pitch)}
  /* ---------- 2) onda com atraso de fase ---------- */
  const air=!grounded&&R.wings.length>0,w=(1.6+Math.min(S.spd,8)*.35)/Math.sqrt(heavy);
  for(const ch of R.tails){const n=ch.length;for(let i=0;i<n;i++){const f=(i+1)/n,ph=S.t*w-i*.6;
      const yawA=(-S.yr*.06*f+Math.sin(ph)*.07*f*(S.spd>.3?1.4:1))/Math.sqrt(heavy*.8),pit=Math.sin(ph*.5+1)*.025*f;rotW(S,ch[i],UP,yawA);rotW(S,ch[i],right,pit)}}
  for(const ch of R.necks){const n=ch.length;for(let i=0;i<n;i++){const f=(i+1)/n;rotW(S,ch[i],UP,S.yr*.035*f);rotW(S,ch[i],right,Math.sin(S.t*w*2-i*.5)*.015*Math.min(1,S.spd*.3))}}
  for(const ch of R.wings){const n=ch.length;for(let i=1;i<n;i++){const f=i/(n-1),a=(air?.09:.025)*f;rotW(S,ch[i],fwd,Math.sin(S.t*w*1.3-i*.65)*a)}}
  API.stats.wave++;seal(S)}
const base=T.AnimationMixer.prototype.update;
T.AnimationMixer.prototype.update=function(dt){const S=ST.get(this);if(S)undo(S);const r=base.call(this,dt);
  /* update(0) (dracônico) usa o passo do quadro */
  try{post(this,dt>0?dt:(window.ADT||1/60))}catch(e){if(!API.err){API.err=1;console.warn('anim547',e)}}return r};
T.AnimationMixer.prototype.__anim547=true;
})();
