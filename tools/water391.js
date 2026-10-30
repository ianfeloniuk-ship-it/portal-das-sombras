/* v391 (Ian): rios e lagos têm leito fundo (terrain245) e dá para NADAR para atravessar sem ponte.
   - Água funda (> 1,3 m): o herói boia com a cabeça para fora, nada a 60% da velocidade, corpo deitado para frente.
   - Gelo (rio/lago congelado): anda em cima do gelo, na altura da margem.
   - Leito seco (deserto/vulcão): sem água, anda no fundo.
   - Monstros comuns não entram na água funda (antes havia uma parede invisível para todos).
   Bioma marinho, mergulho e portais aquáticos ficam para depois (Ian, 14/10/2026). */
(function(){
  const SWIM_DEPTH=1.3,BODY=1.25;
  /* v628: enchente — nivel sobe com a chuva acumulada (RAIN626) e a agua avanca ate 5 m pelos baixios */
  const RISE=()=>window.RAIN626?RAIN626.rise.value:0,FLOOD=()=>window.RAIN626?RAIN626.flood.value:0;
  function waterAt(x,z){ // {top, frozen} ou null
    if(L.mode!=='world'||L.grid)return null;
    {const SE=window.TER245&&TER245.SEA439;if(SE&&SE.d(x,z)>-60&&terrH(x,z)<SE.Y+RISE()*.5)return {top:SE.Y+RISE()*.5,frozen:false,sea:true}} /* v439: mar a oeste de Thalor */
    {const RS=window.TER245&&TER245.RS661;if(RS)for(const r of RS)if(Math.hypot(x-r.p.x,z-r.p.z)<r.S.R+4+FLOOD()*5)return {top:-2.34+RISE(),frozen:false,pool:true}} /* v661: poço das cachoeiras (nascente do rio) */
    const rv=riverNear239(x,z),w=riverWidth351(rv.b,z);
    if(rv.d<w/2+FLOOD()*5){const b=snowB(x,z);if(b>.717)return null;if(onRoad(roadSegs(x,z,1),x,z,5))return null;return {top:terrH(rv.x+w/2,z)+.06+RISE(),frozen:b<.29}}
    const lk=lakeAt239(Math.round(x/CH),Math.round(z/CH));
    if(lk&&Math.hypot(x-lk.x,z-lk.z)<lk.r+FLOOD()*5)return {top:terrH(lk.x+lk.r,lk.z)+.06+RISE(),frozen:['neve','cristal'].includes(biomeAt(lk.x,lk.z))};
    {const t=window.Enchente687&&Enchente687.at(x,z);if(t!=null)return {top:t,frozen:false,flood:true}} /* v692: area alagada pela enchente (escorre para os baixios) */
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
  /* v395 (Ian: "nado feio e bugado"): braçada de crawl em volta completa (puxa por baixo, volta por cima,
     antes ia e voltava no mesmo caminho), corpo deita girando pelo quadril (antes girava pelos pés, afundava e
     ia parar 2 m atrás, deitado de costas), cabeça para fora, parado = braços remando embaixo d'água, anel de rank escondido. */
  function swimPose(t,moving){const s=Math.sin,c=Math.cos;
    if(moving){const a=t*4.2,k=t*9;
      const arm=(ph)=>{const f=((ph%(2*Math.PI))+2*Math.PI)%(2*Math.PI),rec=f>Math.PI?s(f-Math.PI):0;return {x:-180+f*180/Math.PI,z:rec*35,el:-15-rec*70}};
      const L=arm(a),R=arm(a+Math.PI),roll=s(a)*14;return {
      head:[-40,-s(a)*12,0],neck:[-20,0,0],spine:[0,roll*.5,0],chest:[0,roll,0],
      upperarm_l:[L.x,0,L.z],forearm_l:[L.el,0,0],upperarm_r:[R.x,0,-R.z],forearm_r:[R.el,0,0],
      thigh_l:[14*s(k),0,0],shin_l:[16+14*s(k-1),0,0],thigh_r:[-14*s(k),0,0],shin_r:[16-14*s(k-1),0,0]}}
    const a=t*2.4;return {
      head:[-6,0,0],spine:[6,0,0],
      upperarm_l:[-35+12*s(a),0,18],forearm_l:[-30-10*s(a),0,0],upperarm_r:[-35+12*s(a),0,-18],forearm_r:[-30-10*s(a),0,0],
      thigh_l:[-30+18*s(a*1.5),0,0],shin_l:[40+14*s(a*1.5+1),0,0],thigh_r:[-30-18*s(a*1.5),0,0],shin_r:[40-14*s(a*1.5+1),0,0]}}
  function applyPose(P,pose){const m=P.m,root=m.root;root.updateMatrixWorld(true);const charQ=root.getWorldQuaternion(new THREE.Quaternion());
    for(const n of ORDER){const r=pose[n],b=m.bones[n];if(!r||!b||!b.parent)continue;e.set(r[0]*D,r[1]*D,r[2]*D,'XYZ');
      const dl=new THREE.Quaternion().setFromEuler(e),dw=charQ.clone().multiply(dl).multiply(charQ.clone().invert()),bw=b.getWorldQuaternion(new THREE.Quaternion()),pw=b.parent.getWorldQuaternion(new THREE.Quaternion());
      b.quaternion.copy(pw.invert().multiply(dw.multiply(bw)));b.updateMatrixWorld(true)}}
  const HIP=.95,PRONE=1.35; // + = de bruços (o antigo -1,15 deitava de costas, cabeça para trás)
  function aura(P,on){for(const ch of P.m.root.children)if(ch.isMesh&&ch.geometry?.type==='RingGeometry')ch.visible=on}
  let warned=false,lastX=0,lastZ=0,tilt=0,lastT=performance.now(),moveT=0;
  function swimFrame(P){
    const now=performance.now(),dt=Math.min(.1,(now-lastT)/1000);lastT=now;
    const d=P&&!P.dead&&!run?.mounted&&!run?.aboard440?depthAt(P.x,P.z):0,sw=d>(P?.swim391?SWIM_DEPTH-.15:SWIM_DEPTH);W.swimming=sw;
    /* v699 (Ian: «toco na água e fico na luz, pisca»): o anel de rank some na água e só volta 1 s depois de sair (antes ligava/desligava a cada marola) */
    if(P&&P.m){const wet=P&&!P.dead&&depthAt(P.x,P.z)>.2;if(wet)P.dry698=0;else P.dry698=(P.dry698||0)+dt;const want=P.dry698>1;if(P.aura698!==want){P.aura698=want;aura(P,want)}}
    if(!sw){W.body=BODY;W.off=null;if(P&&P.swim391){P.swim391=false;tilt=0;moveT=0;P.m.root.rotation.x=0}return}
    const step=Math.hypot(P.x-lastX,P.z-lastZ);lastX=P.x;lastZ=P.z;moveT=step>.002?.15:Math.max(0,moveT-dt);const moved=moveT>0;W.moving=moved;
    if(!P.swim391){tilt=0}P.swim391=true;W.body=BODY;
    // volta à pose parada antes de aplicar o nado, para a caminhada não misturar com as braçadas
    try{animChibi(P.m,{move:0,atk:0,dead:0,wind:0,wep:animWep173()},time)}catch(_){}
    const root=P.m.root;root.rotation.x=0;root.rotation.order='YXZ';
    if(!(window.Anim303&&Anim303.active()))applyPose(P,swimPose(now/1000,moved));
    const want=moved?PRONE:.1;tilt+=(want-tilt)*Math.min(1,dt*5);const bob=Math.sin(now*.004)*.04;
    // gira pelo quadril: compensa a posição dos pés para o quadril ficar no lugar e as costas na linha d'água
    const th=tilt+bob,k=tilt/PRONE,fx=Math.sin(P.face),fz=Math.cos(P.face);
    const back=HIP*Math.sin(th),up=HIP*(1-Math.cos(th))+k*.12;
    root.rotation.x=th;W.off={x:-fx*back,z:-fz*back,y:up+bob*.5};
    if(!warned){warned=true;toast('<b>[NADO]</b> Você está nadando: mais devagar, mas atravessa rios e lagos sem ponte.',3500)}
  }
  W.pose=swimPose;W.frame=swimFrame;
  /* o loop recoloca o corpo em (P.x,0,P.z) depois da animação; o deslocamento do nado entra no gancho root */
  if(window.Anim303){const r0=Anim303.root;Anim303.root=function(P){const r=r0?r0.apply(this,arguments):undefined;try{if(P===player&&P.swim391&&W.off){const o=P.m.root.position;o.x+=W.off.x;o.z+=W.off.z;o.y+=W.off.y}}catch(_){}return r}}
  if(window.Anim303){const p0=Anim303.post;Anim303.post=function(P){const r=p0.apply(this,arguments);try{if(P===player)swimFrame(P)}catch(_){}return r}}
})();
