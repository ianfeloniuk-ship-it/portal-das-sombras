/* v387 (Ian: "apareceu começou a chover mas não começou"): a chuva antiga eram 700 pontinhos de 0,09
   quase invisíveis. Agora são riscos de gota caindo inclinados ao redor da câmera. Só visual; a regra
   (WX.type==='rain', raios +30%) continua a mesma. */
/* v627 (Ian, ref. Giroka "chuva de verdade"): intensidade variável, vento em rajadas, respingos no chão e na água,
   e o estado de molhado/poças (RAIN626) que o shader do chão (chao626.js) e o EcoGrid leem. Chão molha rápido e seca devagar. */
(function(){
  const RS=window.RAIN626=window.RAIN626||{wet:{value:0},pud:{value:0},k:0,wind:.25};
  const SPN=170,SPR=15;const spGeo=new THREE.RingGeometry(.8,1,12);spGeo.rotateX(-Math.PI/2);
  const spMat=new THREE.MeshBasicMaterial({color:0xdfeaff,transparent:true,opacity:.4,depthWrite:false,fog:true});
  const SP=new THREE.InstancedMesh(spGeo,spMat,SPN);SP.frustumCulled=false;SP.userData.terrainAbsolute245=true;SP.visible=false;SP.renderOrder=4;
  const spT=new Float32Array(SPN),spX=new Float32Array(SPN),spZ=new Float32Array(SPN),spY=new Float32Array(SPN);for(let i=0;i<SPN;i++)spT[i]=Math.random();
  window.RAIN626.splash=SP;
  window.addEventListener('load',()=>{try{scene.add(SP)}catch(_){}});
  const N=2600,BOX=34,TOP=18,LEN=.75;
  const seed=new Float32Array(N*3);
  for(let i=0;i<N;i++){seed[i*3]=(Math.random()-.5)*BOX*2;seed[i*3+1]=Math.random()*TOP;seed[i*3+2]=(Math.random()-.5)*BOX*2}
  // gotas como peças finas (linhas não renderizam com o shader do relevo)
  const geo=new THREE.BoxGeometry(.018,LEN,.018);
  const m=new THREE.MeshBasicMaterial({color:0xcfe3ff,transparent:true,opacity:.6,depthWrite:false,fog:true});
  const R=new THREE.InstancedMesh(geo,m,N);R.frustumCulled=false;R.userData.terrainAbsolute245=true;R.visible=false;R.renderOrder=5;
  scene.add(R);window.RAIN387=R;const M4=new THREE.Matrix4(),Q=new THREE.Quaternion(),S=new THREE.Vector3(1,1,1),V=new THREE.Vector3(),E=new THREE.Euler();
  let last=performance.now(),wind=0;const MS=new THREE.Matrix4(),QS=new THREE.Quaternion(),VS=new THREE.Vector3(),SS=new THREE.Vector3();
  function tick(){const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;
    try{
      const world=started&&L.mode==='world'&&!(player&&player.dead);const raining=world&&WX.type==='rain';
      const tk=raining?.4+.6*Math.max(0,Math.min(1,.5+.5*Math.sin(now*.00006)*Math.sin(now*.00023+1.3)*1.6)):0;
      RS.k+=(tk-RS.k)*Math.min(1,dt*.35);
      RS.wet.value=Math.max(0,Math.min(1,RS.wet.value+(raining?dt/10:-dt/90)));
      RS.pud.value=Math.max(0,Math.min(1,RS.pud.value+(raining&&RS.k>.45?dt/35:-dt/160)));
      const on=raining;
      if(SP.parent!==scene)scene.add(SP);
      SP.visible=on&&RS.k>.05;
      if(SP.visible){const cnt=Math.max(10,Math.floor(SPN*RS.k));SP.count=cnt;const px=player.x,pz=player.z;
        for(let i=0;i<SPN;i++){spT[i]+=dt*(2.6+(i%5)*.3);if(spT[i]>=1){spT[i]-=1;const a=Math.random()*6.283,r=1+Math.sqrt(Math.random())*SPR;spX[i]=px+Math.cos(a)*r;spZ[i]=pz+Math.sin(a)*r;const h=terrH(spX[i],spZ[i]);spY[i]=Math.max(h,.06)+.05}
          const t=spT[i],sc=t<.75?.03+.2*t:Math.max(.01,(1-t)*1.4);SS.set(sc,1,sc);VS.set(spX[i],spY[i],spZ[i]);MS.compose(VS,QS.identity(),SS);SP.setMatrixAt(i,MS)}
        SP.instanceMatrix.needsUpdate=true;spMat.opacity=isNight()?.25:.4}
      if(R.parent!==scene)scene.add(R);
      R.visible=on;if(WX.pts&&WX.type==='rain')WX.pts.visible=false;
      if(on){
        const cx=camera.position.x,cz=camera.position.z,base=terrH(player.x,player.z);wind=(Math.sin(now*.00013)*.35+.3+Math.sin(now*.0011)*.08)*(.6+.6*RS.k);RS.wind=wind;R.count=Math.max(400,Math.floor(N*(.3+.7*RS.k)));
        const sp=24;E.set(0,0,-Math.atan(wind));Q.setFromEuler(E);
        for(let i=0;i<N;i++){let y=seed[i*3+1]-sp*dt;if(y<0)y+=TOP;seed[i*3+1]=y;
          let x=seed[i*3]+wind*sp*dt;if(x>BOX)x-=BOX*2;seed[i*3]=x;
          V.set(cx+x,base+y-2,cz+seed[i*3+2]);M4.compose(V,Q,S);R.setMatrixAt(i,M4)}
        R.instanceMatrix.needsUpdate=true;
        m.opacity=isNight()?.4:.6;
      }
    }catch(_){}
    requestAnimationFrame(tick)}
  requestAnimationFrame(tick);
})();
