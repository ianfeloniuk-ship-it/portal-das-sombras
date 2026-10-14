/* v387 (Ian: "apareceu começou a chover mas não começou"): a chuva antiga eram 700 pontinhos de 0,09
   quase invisíveis. Agora são riscos de gota caindo inclinados ao redor da câmera. Só visual; a regra
   (WX.type==='rain', raios +30%) continua a mesma. */
(function(){
  const N=2600,BOX=34,TOP=18,LEN=.75;
  const seed=new Float32Array(N*3);
  for(let i=0;i<N;i++){seed[i*3]=(Math.random()-.5)*BOX*2;seed[i*3+1]=Math.random()*TOP;seed[i*3+2]=(Math.random()-.5)*BOX*2}
  // gotas como peças finas (linhas não renderizam com o shader do relevo)
  const geo=new THREE.BoxGeometry(.018,LEN,.018);
  const m=new THREE.MeshBasicMaterial({color:0xcfe3ff,transparent:true,opacity:.6,depthWrite:false,fog:true});
  const R=new THREE.InstancedMesh(geo,m,N);R.frustumCulled=false;R.userData.terrainAbsolute245=true;R.visible=false;R.renderOrder=5;
  scene.add(R);window.RAIN387=R;const M4=new THREE.Matrix4(),Q=new THREE.Quaternion(),S=new THREE.Vector3(1,1,1),V=new THREE.Vector3(),E=new THREE.Euler();
  let last=performance.now(),wind=0;
  function tick(){const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;
    try{
      const on=started&&L.mode==='world'&&WX.type==='rain'&&!(player&&player.dead);
      if(R.parent!==scene)scene.add(R);
      R.visible=on;if(WX.pts&&WX.type==='rain')WX.pts.visible=false;
      if(on){
        const cx=camera.position.x,cz=camera.position.z,base=terrH(player.x,player.z);wind=Math.sin(now*.00013)*.35+.25;
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
