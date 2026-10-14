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
      else if(w.top-base>SWIM_DEPTH){const up=w.top-BODY-base;if(up>f&&up<=ceiling+3)return up}}}catch(_){}
    return f};

  /* movimento: nadando = 60%; monstros comuns não entram na água funda */
  const m0=moveEnt;
  moveEnt=function(e,dx,dz){
    try{
      if(e===player){if(depthAt(e.x,e.z)>SWIM_DEPTH&&!run?.mounted){dx*=.6;dz*=.6}}
      else if(e&&!e.isBoss&&!e.fly&&depthAt(e.x+dx,e.z+dz)>SWIM_DEPTH*.6&&depthAt(e.x,e.z)<=SWIM_DEPTH*.6)return;
    }catch(_){}
    return m0(e,dx,dz)};

  /* pose e aviso */
  let warned=false;
  function tick(){try{const P=window.player;if(P&&P.m&&P.m.root&&started){
      const sw=!P.dead&&depthAt(P.x,P.z)>SWIM_DEPTH;W.swimming=sw;
      if(sw){P.air344=false;P.m.root.rotation.order='YXZ';P.m.root.rotation.x=-.75+Math.sin(performance.now()*.006)*.08;P.swim391=true;
        if(!warned){warned=true;toast('<b>[NADO]</b> Você está nadando: mais devagar, mas atravessa rios e lagos sem ponte.',3500)}}
      else if(P.swim391){P.swim391=false;P.m.root.rotation.x=0}}}catch(_){}
    requestAnimationFrame(tick)}
  requestAnimationFrame(tick);
})();
