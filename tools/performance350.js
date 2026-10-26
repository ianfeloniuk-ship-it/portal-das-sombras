/* Keep the GPU light layout stable when monsters, crystals and effects appear.
   Source lights retain their positions/colors/intensity. Three nearby sources are
   represented by fixed render lights; distant decorative glow stays emissive. */
(()=>{
 const pool=Array.from({length:3},()=>{const l=new THREE.PointLight(0xffffff,0,1,2);l.userData.pool348=true;scene.add(l);return l});
 const pos=new THREE.Vector3(),render=renderer.render;
 function update(){
  const candidates=[],px=player?.x||0,pz=player?.z||0;
  scene.traverseVisible(o=>{if(!o.isPointLight||o.userData.pool348)return;o.isLight=false;if(!(o.intensity>0))return;
   o.updateWorldMatrix(true,false);pos.setFromMatrixPosition(o.matrixWorld);
   const distance=Math.hypot(pos.x-px,pos.z-pz),range=o.distance||100;
   if(distance>range+45)return;
   candidates.push({o,x:pos.x,y:pos.y,z:pos.z,score:o.intensity/(1+distance*distance/Math.max(1,range))});
  });
  candidates.sort((a,b)=>b.score-a.score);
  pool.forEach((l,i)=>{const c=candidates[i];l.intensity=c?c.o.intensity:0;if(!c)return;l.color.copy(c.o.color);l.distance=c.o.distance;l.decay=c.o.decay;l.position.set(c.x,c.y,c.z)});
 }
 renderer.render=function(s,c,...args){if(s===scene)update();return render.call(this,s,c,...args)};
 // Short-lived effects used to release the last reference to their GPU program
 // on every swing. Retain one compiled material per shader variant (bounded).
 const retained=new Map(),seen=new WeakSet(),draw=renderer.renderBufferDirect;
 function retain(m){
  if(m.isShaderMaterial&&!seen.has(m)){
   seen.add(m);
   const key=m.vertexShader+'|'+m.fragmentShader+'|'+JSON.stringify(m.defines||{})+'|'+m.side+'|'+m.blending;
   if(!retained.has(key)&&retained.size<64){retained.set(key,m);m.userData.retained348=true;m.dispose=function(){};}
  }
 }
 renderer.renderBufferDirect=function(camera,s,g,m,o,group){retain(m);return draw.call(this,camera,s,g,m,o,group)};
 let warmed=false;
 function warm(){if(warmed||!window.Combat139)return;warmed=true;const f=Combat139.basicMelee(profile.cls,0xffd08a,3,true);f.group.traverse(o=>{if(o.material)retain(o.material)});scene.add(f.group);try{update();renderer.compile(scene,camera)}finally{scene.remove(f.group)}}
 window.Lights348={pool,update,retained,warm};
})();
