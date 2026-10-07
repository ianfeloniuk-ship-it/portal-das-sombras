/* v304 (Ian): animações novas de lançamento, criadas direto nos ossos do Viajante.
   Camada aplicada depois da animação normal, a cada quadro, só durante a habilidade:
   salto_impacto (pula e bate no chão), giro (360°), ceu (braços para o céu), palmas (empurra para a frente),
   ajoelhar (cura), firme (postura de escudo). Rotações em graus, no espaço do personagem:
   x = inclinar para a frente(+)/trás(−), y = girar, z = tombar para o lado. */
(function(){
const T=THREE,D=Math.PI/180;
const lerp=(a,b,t)=>a+(b-a)*t,ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
/* cada animação: duração e chaves {t, root:{y,spin}, b:{osso:[x,y,z]}} */
const A={
 salto_impacto:{d:1.0,k:[
  {t:0,root:{y:0},b:{}},
  {t:.22,root:{y:-.25},b:{spine:[25,0,0],thigh_l:[-40,0,0],thigh_r:[-40,0,0],shin_l:[60,0,0],shin_r:[60,0,0],upperarm_l:[20,0,0],upperarm_r:[20,0,0]}},
  {t:.45,root:{y:1.3},b:{spine:[-15,0,0],upperarm_l:[-160,0,0],upperarm_r:[-160,0,0],thigh_l:[-30,0,0],thigh_r:[-30,0,0],shin_l:[50,0,0],shin_r:[50,0,0]}},
  {t:.6,root:{y:-.2},b:{spine:[45,0,0],chest:[15,0,0],upperarm_l:[-60,0,0],upperarm_r:[-60,0,0],thigh_l:[-50,0,0],thigh_r:[-50,0,0],shin_l:[80,0,0],shin_r:[80,0,0]}},
  {t:.8,root:{y:-.15},b:{spine:[35,0,0],upperarm_l:[-40,0,0],upperarm_r:[-40,0,0],thigh_l:[-40,0,0],thigh_r:[-40,0,0],shin_l:[60,0,0],shin_r:[60,0,0]}},
  {t:1,root:{y:0},b:{}}]},
 giro:{d:.6,k:[
  {t:0,root:{spin:0},b:{}},
  {t:.15,root:{spin:30},b:{upperarm_l:[0,0,70],upperarm_r:[0,0,-70],spine:[10,0,0]}},
  {t:.85,root:{spin:390},b:{upperarm_l:[0,0,80],upperarm_r:[0,0,-80],spine:[10,0,0]}},
  {t:1,root:{spin:360},b:{}}]},
 ceu:{d:.9,k:[
  {t:0,b:{}},
  {t:.3,b:{upperarm_l:[-170,0,15],upperarm_r:[-170,0,-15],chest:[-15,0,0],head:[-25,0,0]}},
  {t:.75,b:{upperarm_l:[-175,0,20],upperarm_r:[-175,0,-20],chest:[-20,0,0],head:[-30,0,0]}},
  {t:1,b:{}}]},
 palmas:{d:.6,k:[
  {t:0,b:{}},
  {t:.25,b:{upperarm_l:[-30,0,0],upperarm_r:[-30,0,0],spine:[-10,0,0]}},
  {t:.5,b:{upperarm_l:[-90,0,-10],upperarm_r:[-90,0,10],forearm_l:[0,0,0],forearm_r:[0,0,0],spine:[20,0,0]}},
  {t:.8,b:{upperarm_l:[-85,0,-10],upperarm_r:[-85,0,10],spine:[15,0,0]}},
  {t:1,b:{}}]},
 ajoelhar:{d:1.0,k:[
  {t:0,root:{y:0},b:{}},
  {t:.3,root:{y:-.45},b:{thigh_l:[-80,0,0],shin_l:[100,0,0],thigh_r:[10,0,0],shin_r:[90,0,0],spine:[20,0,0],head:[25,0,0],upperarm_l:[-50,0,0],upperarm_r:[-50,0,0]}},
  {t:.75,root:{y:-.45},b:{thigh_l:[-80,0,0],shin_l:[100,0,0],thigh_r:[10,0,0],shin_r:[90,0,0],spine:[15,0,0],head:[15,0,0],upperarm_l:[-70,0,0],upperarm_r:[-70,0,0]}},
  {t:1,root:{y:0},b:{}}]},
 firme:{d:.8,k:[
  {t:0,root:{y:0},b:{}},
  {t:.3,root:{y:-.15},b:{thigh_l:[-20,0,-20],thigh_r:[-20,0,20],shin_l:[30,0,0],shin_r:[30,0,0],upperarm_l:[-80,0,-35],upperarm_r:[-80,0,35],spine:[15,0,0]}},
  {t:.8,root:{y:-.15},b:{thigh_l:[-20,0,-20],thigh_r:[-20,0,20],shin_l:[30,0,0],shin_r:[30,0,0],upperarm_l:[-85,0,-40],upperarm_r:[-85,0,40],spine:[15,0,0]}},
  {t:1,root:{y:0},b:{}}]}};
const ORDER=['hips','spine','chest','neck','head','upperarm_l','forearm_l','hand_l','upperarm_r','forearm_r','hand_r','thigh_l','shin_l','foot_l','thigh_r','shin_r','foot_r'];
function sample(an,t){const k=an.k;let i=0;while(i<k.length-2&&t>k[i+1].t)i++;const a=k[i],b=k[i+1],u=ease(Math.max(0,Math.min(1,(t-a.t)/Math.max(1e-6,b.t-a.t))));
 const out={root:{y:lerp(a.root?.y||0,b.root?.y||0,u),spin:lerp(a.root?.spin||0,b.root?.spin||0,u)},b:{}};const names=new Set([...Object.keys(a.b||{}),...Object.keys(b.b||{})]);for(const n of names){const x=a.b[n]||[0,0,0],y=b.b[n]||[0,0,0];out.b[n]=[lerp(x[0],y[0],u),lerp(x[1],y[1],u),lerp(x[2],y[2],u)]}return out}
let cur=null;
function play(name,slow=1){if(!A[name]||!player)return;cur={name,t0:performance.now()/1000,slow}}
const qa=new T.Quaternion(),qb=new T.Quaternion(),qc=new T.Quaternion(),e=new T.Euler();
function post(P){if(!cur||!P||!P.m||!P.m.bones)return;const an=A[cur.name],t=(performance.now()/1000-cur.t0)/(an.d*(cur.slow||1));if(t>=1){cur=null;return}
 const s=sample(an,t),m=P.m,root=m.root;
 if(s.root.spin)root.rotation.y+=s.root.spin*D;
 const charQ=root.getWorldQuaternion(qa.clone());
 if(s.root.y)root.position.y+=s.root.y;
 root.updateMatrixWorld(true);
 const armed=!!(run&&run.equip&&run.equip.w);
 for(const n of ORDER){let r=s.b[n];if(!r)continue;/* v305 (Ian): com arma na mão direita, o braço direito nunca cruza o peito (a espada atravessava o corpo) */if(armed&&n==='upperarm_r')r=[r[0],r[1],Math.min(r[2],-25)];if(armed&&n==='forearm_r')r=[r[0],r[1],r[2]];const b=m.bones[n];if(!b||!b.parent)continue;
  e.set(r[0]*D,r[1]*D,r[2]*D,'XYZ');const dLocal=new T.Quaternion().setFromEuler(e);
  const dWorld=charQ.clone().multiply(dLocal).multiply(charQ.clone().invert());
  const bw=b.getWorldQuaternion(new T.Quaternion()),pw=b.parent.getWorldQuaternion(new T.Quaternion());
  b.quaternion.copy(pw.invert().multiply(dWorld.multiply(bw)));b.updateMatrixWorld(true)}}
/* v305 (Ian): chefes, elites e rivais também se movem ao usar ataques, com efeito visual no momento do impacto. */
function enemyPost(e,dt){if(!(e.isBoss||e.elite||e.rival)||!e.m||!e.m.root)return;const A=e.act,root=e.m.root,sc=e.isBoss?1.3:1;
 const body=e.m.body||root.children.find(c=>c.isObject3D&&!c.isLight)||null;if(body&&body.userData.y305==null)body.userData.y305=body.position.y;const lift=v=>{if(body)body.position.y=body.userData.y305+v/(root.scale.y||1)};
 if(!A){root.rotation.x=0;root.rotation.z=0;lift(0);return}lift(0);
 const w=Math.min(1,A.t/Math.max(.05,A.wind||.6)),after=A.t-(A.wind||.6),V=window.VFX302;
 if(A.type==='slam'){if(after<0){lift(Math.sin(w*Math.PI*.5)*1.2*sc);root.rotation.x=-.35*w}else{const k=Math.min(1,after/.15);lift(1.2*sc*(1-k));root.rotation.x=-.35+(.6)*k;if(!A.vfx305&&k>=1){A.vfx305=1;try{V&&V.quakeRing(e.x,e.z,e.isBoss?6:4)}catch(_){}}}}
 else if(A.type==='charge'||A.type==='lunge'){root.rotation.x=after<0?-.15*w:.35;if(after>=0&&!A.vfx305){A.vfx305=1;try{V&&V.dashTrail}catch(_){}}if(after>=0&&Math.random()<.4)try{const d=new THREE.Mesh(new THREE.SphereGeometry(.3,5,4),new THREE.MeshToonMaterial({color:0x9a8a70,transparent:true,opacity:.6}));d.position.set(e.x,.3,e.z);scene.add(d);setTimeout(()=>scene.remove(d),500)}catch(_){}}
 else if(A.type==='cast'){lift(.5*Math.sin(Math.min(1,A.t/.6)*Math.PI*.5)*sc);if(!A.vfx305){A.vfx305=1;try{V&&V.runeCircle(e.x,e.z,0xb48cff,e.isBoss?3:2)}catch(_){}}}
 else if(A.type==='swing'){if(after<0)root.rotation.y=(e.face||0)-.9*w;else{root.rotation.y=(e.face||0)+Math.min(1,after/.12)*.6;if(!A.vfx305){A.vfx305=1;try{V&&V.slash(e.x,e.z,e.face||0,0xffc8a0,(e.r||.6)*4+2,2.4)}catch(_){}}}}
 else if(A.type==='shoot'){root.rotation.x=after<0?-.12*w:0}}
window.Anim303={play,post,enemyPost,list:Object.keys(A)};
})();
