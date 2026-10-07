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
 for(const n of ORDER){const r=s.b[n];if(!r)continue;const b=m.bones[n];if(!b||!b.parent)continue;
  e.set(r[0]*D,r[1]*D,r[2]*D,'XYZ');const dLocal=new T.Quaternion().setFromEuler(e);
  const dWorld=charQ.clone().multiply(dLocal).multiply(charQ.clone().invert());
  const bw=b.getWorldQuaternion(new T.Quaternion()),pw=b.parent.getWorldQuaternion(new T.Quaternion());
  b.quaternion.copy(pw.invert().multiply(dWorld.multiply(bw)));b.updateMatrixWorld(true)}}
window.Anim303={play,post,list:Object.keys(A)};
})();
