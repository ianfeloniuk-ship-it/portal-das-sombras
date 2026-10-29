/* v678 (Ian: asas do vampiro): as asas têm ossos próprios (asa_l_0..3 / asa_r_0..3, tools/blender482/asas678.py) e
   não seguem mais o braço. Aqui elas se mexem sozinhas: parado = meio dobradas atrás das costas, respirando; correndo =
   fechadas para trás; golpe = abrem e batem uma vez. Vale para todo modelo com esses ossos (monstros e jogador). */
(function(global){
'use strict';
const T=global.THREE,W=global.Warrior127;if(!T||!W||!W.animate)return;
const qa=new T.Quaternion(),qb=new T.Quaternion(),qm=new T.Quaternion(),qp=new T.Quaternion(),UP=new T.Vector3(0,1,0),FW=new T.Vector3(0,0,1),RT=new T.Vector3(1,0,0);
function setup(m){const L=[],R=[];m.model.traverse(o=>{if(!o.isBone)return;const k=/^asa_([lr])_(\d)$/.exec(o.name);if(k){(k[1]==='l'?L:R)[+k[2]]=o;o.userData.bind678=o.quaternion.clone()}});
  m.asas678=L.length===4&&R.length===4?{L,R,open:0,flap:0,t:0}:false;return m.asas678}
/* gira o osso em volta de um eixo do MODELO (não do osso), por cima da pose de repouso */
function turn(b,axis,ang,qModel){b.parent.getWorldQuaternion(qp);qa.setFromAxisAngle(axis,ang);qb.copy(qModel).multiply(qa).multiply(qm.copy(qModel).invert());
  qa.copy(qp).invert().multiply(qb).multiply(qp);b.quaternion.copy(qa).multiply(b.userData.bind678);b.updateMatrixWorld(true)}
function pose(m,st,dt){const A=m.asas678;A.t+=dt;const spd=m.v673!=null?m.v673:(st.speed||0),atk=!!(st.clip486&&/golpe|mordida|garra/.test(st.clip486))||(st.atk||0)>0;
  const wantOpen=atk?1:0,run=Math.min(1,Math.max(0,(spd-2)/3));A.open+=(wantOpen-A.open)*Math.min(1,dt*(atk?9:3));
  if(atk&&A.flap<=0)A.flap=1;A.flap=Math.max(0,A.flap-dt*1.8);
  const breath=Math.sin(A.t*1.6)*.06,beat=Math.sin((1-A.flap)*Math.PI*2)*A.flap*.5;
  const back=(1.05+.35*run)*(1-A.open)+.15*A.open,down=(.35+.15*run)*(1-A.open)-(.15+beat)*A.open+breath,fold=(.55+.2*run)*(1-A.open)+.08*A.open;
  m.model.updateMatrixWorld(true);m.model.getWorldQuaternion(qm);const qModel=qm.clone();
  for(const [arr,s] of [[A.L,1],[A.R,-1]]){arr[0].quaternion.copy(arr[0].userData.bind678);
    turn(arr[0],UP,s*back,qModel);turn(arr[0],FW,-s*down,qModel);
    for(let i=1;i<4;i++){arr[i].quaternion.copy(arr[i].userData.bind678);arr[i].updateMatrixWorld(true);turn(arr[i],UP,s*fold*(i===1?1:.7),qModel)}}}
const an0=W.animate;
W.animate=function(m,st,t,dt){const r=an0.apply(this,arguments);try{if(!global.NOASAS678&&m&&m.model&&(m.asas678??setup(m)))pose(m,st||{},Math.min(.1,dt||1/60))}catch(e){if(!global.Asas678.err)global.Asas678.err=String(e)}return r};
global.Asas678={setup};
})(typeof window!=='undefined'?window:globalThis);
