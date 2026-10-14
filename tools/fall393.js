/* v393 (Ian): com as montanhas, dano de queda.
   - Andar para fora de uma borda muito íngreme (desce mais de 1,4 m por metro) faz o herói CAIR com gravidade,
     em vez de grudar no chão.
   - Ao pousar: até 6 m não dói; acima disso, 5% da vida máxima por metro (12 m = 30%, 20 m = 70%).
     Quedas abaixo de 30 m deixam pelo menos 1 de vida; acima de 30 m podem matar.
   - Cair em água funda (nado) não dá dano. Montado ou na carroça também não. */
(function(){
  const SAFE=6,PER_M=.05,LETHAL=30,STEEP=1.4;
  const F=window.FALL393={top:null,last:null};
  const m0=moveEnt;
  moveEnt=function(e,dx,dz){
    if(e!==player||!e||e.dead||e.air344||run?.mounted||L.mode!=='world'||L.grid)return m0(e,dx,dz);
    const ox=e.x,oz=e.z,h0=terrH(ox,oz)+(e.jy||0);const r=m0(e,dx,dz);
    try{const d=Math.hypot(e.x-ox,e.z-oz);if(d>1e-4){const h1=terrH(e.x,e.z);const drop=h0-h1-(e.jy||0);
      if(drop>Math.max(.05,d*STEEP)&&!(window.Water391&&Water391.depthAt(e.x,e.z)>1.3)){e.jy=drop;e.jvy=0;e.air344=true}}}catch(_){}
    return r};
  let was=false;
  function tick(){try{const P=typeof player!=='undefined'?player:null;
    if(P&&started&&!P.dead&&L.mode==='world'&&!L.grid){const y=terrH(P.x,P.z)+(P.jy||0);
      if(P.air344){F.top=was&&F.top!=null?Math.max(F.top,y):y;was=true}
      else if(was){was=false;const drop=(F.top??y)-y;F.top=null;F.last=drop;
        const water=window.Water391&&Water391.depthAt(P.x,P.z)>1.3;
        if(drop>SAFE&&!water&&!run?.mounted){let dmg=P.maxhp*PER_M*(drop-SAFE);if(drop<LETHAL)dmg=Math.min(dmg,P.hp-1);dmg=Math.max(0,Math.round(dmg));
          if(dmg>0){P.hp-=dmg;try{floater(P.x,P.z,'-'+fmt(dmg),'#ff9a6a')}catch(_){}try{shake&&shake(.25)}catch(_){}
            toast('<b>[QUEDA]</b> Você caiu '+Math.round(drop)+' m e perdeu '+fmt(dmg)+' de vida.',2600);if(P.hp<=0&&!P.dead)die()}}}}
    else was=false}catch(_){}
    requestAnimationFrame(tick)}
  F.tick=tick;requestAnimationFrame(tick);
})();
