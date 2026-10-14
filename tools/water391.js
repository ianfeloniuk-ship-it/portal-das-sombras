/* v391 (Ian): rios e lagos têm leito fundo (terrain245) e dá para NADAR para atravessar sem ponte.
   - Água funda (> 1,3 m): o herói boia com a cabeça para fora, nada a 60% da velocidade, corpo deitado para frente.
   - Gelo (rio/lago congelado): anda em cima do gelo, na altura da margem.
   - Leito seco (deserto/vulcão): sem água, anda no fundo.
   - Monstros comuns não entram na água funda (antes havia uma parede invisível para todos).
   Bioma marinho, mergulho e portais aquáticos ficam para depois (Ian, 14/10/2026). */
(function(){
  const SWIM_DEPTH=1.3,BODY=1.25;
  function waterAt(x,z){ // {top, frozen} ou null
    if(L.mode!=='world'||L.grid)return null;
    const rv=riverNear239(x,z),w=riverWidth351(rv.b,z);
    if(rv.d<w/2){const b=snowB(x,z);if(b>.717)return null;if(onRoad(roadSegs(x,z,1),x,z,5))return null;return {top:terrH(rv.x+w/2,z)+.06,frozen:b<.29}}
    const lk=lakeAt239(Math.round(x/CH),Math.round(z/CH));
    if(lk&&Math.hypot(x-lk.x,z-lk.z)<lk.r)return {top:terrH(lk.x+lk.r,lk.z)+.06,frozen:['neve','cristal'].includes(biomeAt(lk.x,lk.z))};
    return null}
  function depthAt(x,z){const w=waterAt(x,z);return w&&!w.frozen?w.top-terrH(x,z):0}
  const W=window.Water391={waterAt,depthAt,swimming:false};

  /* altura do chão: gelo = superfície; água funda = boiar */
  const f0=floor344;
  floor344=function(x,z,ceiling=Infinity){const f=f0(x,z,ceiling);
    try{const w=waterAt(x,z);if(w){const base=terrH(x,z);
      if(w.frozen){const up=w.top-base;if(up>f&&up<=ceiling+3)return up}
      else if(w.top-base>SWIM_DEPTH){const up=w.top-(W.body??BODY)-base;if(up>f&&up<=ceiling+3)return up}}}catch(_){}
    return f};

  /* movimento: nadando = 60%; monstros comuns não entram na água funda */
  const m0=moveEnt;
  moveEnt=function(e,dx,dz){
    try{
      if(e===player){if(depthAt(e.x,e.z)>SWIM_DEPTH&&!run?.mounted){dx*=.6;dz*=.6}}
      else if(e&&!e.isBoss&&!e.fly&&depthAt(e.x+dx,e.z+dz)>SWIM_DEPTH*.6&&depthAt(e.x,e.z)<=SWIM_DEPTH*.6)return;
    }catch(_){}
    return m0(e,dx,dz)};

  /* v392 (Ian): animação de nado nos ossos do Viajante (mesmo esquema do pulo em anim303.js).
     Nadando: corpo deitado, braçadas alternadas (crawl), pernas batendo. Parado: boiando em pé, braços
     abrindo e fechando e pernas pedalando. Rotações em graus no espaço do personagem (x = frente). */
  const D=Math.PI/180,e=new THREE.Euler(),ORDER=['hips','spine','chest','neck','head','upperarm_l','forearm_l','upperarm_r','forearm_r','thigh_l','shin_l','thigh_r','shin_r'];
  function swimPose(t,moving){const s=Math.sin,c=Math.cos;
    if(moving){const a=t*5.2,k=t*10.4;return {
      head:[-35,0,0],neck:[-15,0,0],chest:[0,s(a)*10,0],
      upperarm_l:[-95+95*s(a),0,10],forearm_l:[-25*Math.max(0,c(a)),0,0],
      upperarm_r:[-95-95*s(a),0,-10],forearm_r:[-25*Math.max(0,-c(a)),0,0],
      thigh_l:[12*s(k),0,0],shin_l:[18+12*s(k+1),0,0],thigh_r:[-12*s(k),0,0],shin_r:[18-12*s(k+1),0,0]}}
    const a=t*2.6;return {
      spine:[8,0,0],upperarm_l:[-25,0,55+18*s(a)],forearm_l:[-20,0,0],upperarm_r:[-25,0,-55-18*s(a)],forearm_r:[-20,0,0],
      thigh_l:[-35+20*s(a*1.6),0,0],shin_l:[45+15*s(a*1.6+1),0,0],thigh_r:[-35-20*s(a*1.6),0,0],shin_r:[45-15*s(a*1.6+1),0,0]}}
  function applyPose(P,pose){const m=P.m,root=m.root;root.updateMatrixWorld(true);const charQ=root.getWorldQuaternion(new THREE.Quaternion());
    for(const n of ORDER){const r=pose[n],b=m.bones[n];if(!r||!b||!b.parent)continue;e.set(r[0]*D,r[1]*D,r[2]*D,'XYZ');
      const dl=new THREE.Quaternion().setFromEuler(e),dw=charQ.clone().multiply(dl).multiply(charQ.clone().invert()),bw=b.getWorldQuaternion(new THREE.Quaternion()),pw=b.parent.getWorldQuaternion(new THREE.Quaternion());
      b.quaternion.copy(pw.invert().multiply(dw.multiply(bw)));b.updateMatrixWorld(true)}}
  let warned=false,lastX=0,lastZ=0,tilt=0,lastT=performance.now();
  function swimFrame(P){
    const now=performance.now(),dt=Math.min(.1,(now-lastT)/1000);lastT=now;
    const sw=!!P&&!P.dead&&!run?.mounted&&depthAt(P.x,P.z)>SWIM_DEPTH;W.swimming=sw;
    if(!sw){W.body=BODY;if(P&&P.swim391){P.swim391=false;tilt=0;P.m.root.rotation.x=0}return}
    const moved=Math.hypot(P.x-lastX,P.z-lastZ)>.002;lastX=P.x;lastZ=P.z;W.moving=moved;
    P.swim391=true;
    // volta à pose parada antes de aplicar o nado, para a caminhada não misturar com as braçadas
    try{animChibi(P.m,{move:0,atk:0,dead:0,wind:0,wep:animWep173()},time)}catch(_){}
    if(!(window.Anim303&&Anim303.active()))applyPose(P,swimPose(now/1000,moved));
    const want=moved?-1.15:-.12;W.body=(W.body??BODY)+((moved?.45:BODY)-(W.body??BODY))*Math.min(1,dt*5);tilt+=(want-tilt)*Math.min(1,dt*6);P.m.root.rotation.order='YXZ';P.m.root.rotation.x=tilt+Math.sin(now*.004)*.04;
    if(!warned){warned=true;toast('<b>[NADO]</b> Você está nadando: mais devagar, mas atravessa rios e lagos sem ponte.',3500)}
  }
  W.pose=swimPose;W.frame=swimFrame;
  if(window.Anim303){const p0=Anim303.post;Anim303.post=function(P){const r=p0.apply(this,arguments);try{if(P===player)swimFrame(P)}catch(_){}return r}}
})();
