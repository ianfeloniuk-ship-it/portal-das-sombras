/* v672 (Ian: «a roupa mexa junto sem ficar nada pitoresco ou maluco», como no Skyrim): física das correntes de pano.
   O rig do Blender (tools/blender482/rig_humanoid669.py) cria correntes 'pano_<k>_<i>' presas no quadril (saia, vestido,
   túnica). Aqui, depois da animação de cada quadro, cada corrente vira partículas: o topo segue o quadril, o resto
   balança com gravidade e amortecimento, mantém o comprimento, volta devagar para a forma de repouso (não fica maluco)
   e é empurrado para fora das coxas e canelas. Funciona em qualquer modelo animado pelo Warrior127 (jogador e povo). */
(function(global){
'use strict';
const T=global.THREE;if(!T||!global.Warrior127)return;
const W=global.Warrior127,base=W.animate;if(typeof base!=='function')return;
const G=new T.Vector3(0,-9.8,0),UP=new T.Vector3(0,1,0),v1=new T.Vector3(),v2=new T.Vector3(),q1=new T.Quaternion(),q2=new T.Quaternion(),m1=new T.Matrix4();
const WV=new T.Vector3();const API=global.Pano672={on:true,stiff:6,damp:.9,wind:3.2,stats:{models:0,steps:0}};

function setup(m){
  const chains={};m.model.traverse(o=>{const r=/^pano_(\d+)_(\d+)$/.exec(o.name||'');if(o.isBone&&r){(chains[r[1]]||(chains[r[1]]=[]))[+r[2]]=o;o.userData.rest672=o.quaternion.clone()}});
  const list=Object.values(chains).filter(c=>c.length&&c.every(Boolean));
  if(!list.length){m.pano672=false;return}
  const legs=[];const B=m.bones||{};for(const [a,b] of [['thigh_l','shin_l'],['shin_l','foot_l'],['thigh_r','shin_r'],['shin_r','foot_r']])if(B[a]&&B[b])legs.push([B[a],B[b]]);
  m.root.updateMatrixWorld(true);const H=new T.Box3().setFromObject(m.model).getSize(v1).y||1.8;
  m.pano672={chains:list.map(c=>({bones:c,p:null,o:null,len:[]})),legs,r:(list.length>9?.07:.055)*H};/* v673: vestido justo (12 correntes) afasta mais o pano das pernas */API.stats.models++;
}
function tipOf(b){return b.children.find(c=>c.isBone)}
function step(m,dt){
  const S=m.pano672;if(!S)return;dt=Math.min(Math.max(dt||0,0),1/30);if(!dt)return;
  m.root.updateMatrixWorld(true);
  const caps=S.legs.map(([a,b])=>[a.getWorldPosition(new T.Vector3()),b.getWorldPosition(new T.Vector3())]);
  for(const C of S.chains){
    const bs=C.bones,n=bs.length;
    /* forma de repouso deste quadro: ossos na pose de repouso, presos ao quadril animado */
    for(const b of bs){b.quaternion.copy(b.userData.rest672);b.updateMatrixWorld(true)}
    const rest=[];for(const b of bs)rest.push(b.getWorldPosition(new T.Vector3()));
    const tip=tipOf(bs[n-1]);if(tip)rest.push(tip.getWorldPosition(new T.Vector3()));else rest.push(rest[n-1].clone().add(v1.copy(rest[n-1]).sub(rest[n-2]||rest[n-1])));
    /* teletransporte, renascer ou empurrão grande: recomeça da forma de repouso (sem chicote) */
    if(C.p&&C.p[0].distanceToSquared(rest[0])>.25)C.p=null;
    if(!C.p){C.p=rest.map(v=>v.clone());C.o=rest.map(v=>v.clone());for(let i=1;i<rest.length;i++)C.len[i]=rest[i].distanceTo(rest[i-1])}
    C.p[0].copy(rest[0]);C.o[0].copy(rest[0]);
    const k=1-Math.exp(-API.stiff*dt);
    /* v687: vento (tools/vento687.js) empurra o pano na direção do vento, mais forte nas rajadas */
    try{const E=global.ENV||(typeof ENV!=='undefined'?ENV:null);const g=E&&E.gust?E.gust.value:1,d=E&&E.wd?E.wd.value:{x:1,y:0};WV.set(d.x,0,d.y).multiplyScalar(API.wind*g)}catch(_){WV.set(0,0,0)}
    for(let i=1;i<C.p.length;i++){const p=C.p[i],o=C.o[i];v1.copy(p).sub(o).multiplyScalar(API.damp);o.copy(p);p.add(v1).addScaledVector(G,dt*dt).addScaledVector(WV,dt*dt*(.6+.4*Math.sin(i*1.7+performance.now()*.006)));p.lerp(rest[i],k)}
    for(let it=0;it<2;it++)for(let i=1;i<C.p.length;i++){
      const a=C.p[i-1],p=C.p[i];v1.copy(p).sub(a);const d=v1.length()||1e-6;p.copy(a).addScaledVector(v1,C.len[i]/d);
      for(const [c0,c1] of caps){v2.copy(c1).sub(c0);const L2=v2.lengthSq()||1e-6;const t=Math.max(0,Math.min(1,v1.copy(p).sub(c0).dot(v2)/L2));const q=v2.multiplyScalar(t).add(c0);v1.copy(p).sub(q);const dd=v1.length();if(dd<S.r&&dd>1e-6)p.addScaledVector(v1,(S.r-dd)/dd)}}
    /* aponta cada osso para a partícula seguinte */
    for(let i=0;i<n;i++){const b=bs[i];b.updateMatrixWorld(true);b.getWorldQuaternion(q1);
      const cur=v1.copy(UP).applyQuaternion(q1).normalize(),want=v2.copy(C.p[i+1]).sub(C.p[i]).normalize();
      q2.setFromUnitVectors(cur,want).multiply(q1);b.parent.getWorldQuaternion(q1).invert();b.quaternion.copy(q1.multiply(q2));b.updateMatrixWorld(true)}
  }
  API.stats.steps++;
}
const near=m=>{try{const P=global.player||(typeof player!=='undefined'?player:null);if(!P||P.m===m)return true;const p=m.root.position;return Math.hypot(p.x-P.x,p.z-P.z)<API.near}catch(_){return true}};
API.near=35;/* desempenho: física só perto do jogador; longe o pano fica na forma de repouso (o rig já segue as pernas) */
function rest(m){const S=m.pano672;if(!S||S.atRest)return;for(const C of S.chains){for(const b of C.bones)b.quaternion.copy(b.userData.rest672);C.p=null}S.atRest=true}
W.animate=function(m,st,t,dt){const r=base.apply(this,arguments);try{if(API.on&&m&&m.model&&!(st&&st.dead>0)){if(m.pano672===undefined)setup(m);if(m.pano672){if(near(m)){m.pano672.atRest=false;step(m,dt)}else rest(m)}}}catch(e){if(!API.err){API.err=String(e);console.warn('pano672',e)}}return r};
API.step=step;API.setup=setup;
})(typeof window!=='undefined'?window:globalThis);
