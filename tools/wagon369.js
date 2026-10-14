(function(global){
'use strict';
const T=global.THREE,API={ok:false,error:null},stations=new Set();let asset=null;
API.ready=new Promise(resolve=>{
 if(!T||!T.GLTFLoader||!T.SkeletonUtils){API.error='loader';resolve(false);return}
 new T.GLTFLoader().load('models/wagon369.glb?v=369',g=>{asset=g;API.ok=true;resolve(true)},undefined,e=>{API.error=String(e);console.warn('Carroça detalhada indisponível; mantendo modelo anterior.',e);resolve(false)});
});
API.create=function(){
 if(!asset)return null;
 const g=T.SkeletonUtils.clone(asset.scene),mixer=new T.AnimationMixer(g),actions={};
 g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(o.isSkinnedMesh)o.frustumCulled=false;if(typeof renderer!=='undefined'&&renderer.outputEncoding!==T.sRGBEncoding){o.material=o.material.clone();o.material.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <encodings_fragment>','#include <encodings_fragment>\ngl_FragColor=LinearTosRGB(gl_FragColor);')};o.material.customProgramCacheKey=()=> 'wagon369-linear';}}});
 for(const clip of asset.animations)actions[clip.name]=mixer.clipAction(clip);
 for(const name of ['SeatedIdle','OxIdle'])if(actions[name])actions[name].play();
 const wheels=['WheelFrontL','WheelFrontR','WheelRearL','WheelRearR'].map(n=>g.getObjectByName(n));
 const driver={root:g.getObjectByName('DriverRoot')},ox=g.getObjectByName('OxRoot');
 const w={g,wheels,driver,ox,legs:[],mixer,actions,detailed369:true,distance369:0,walking369:false,steer369:0};
 return w;
};
API.animate=function(w,dt,distance,turn){
 if(!w||!w.detailed369)return;
 const moved=Number.isFinite(distance)?Math.max(0,distance):0,moving=moved>1e-6;
 w.distance369+=moved;
 if(walkingChanged(w,moving)){
  for(const [idle,walk] of [['SeatedIdle','Drive'],['OxIdle','OxWalk']]){
   const from=w.actions[moving?idle:walk],to=w.actions[moving?walk:idle];
   if(from)from.stop();if(to)to.reset().play();
  }
 }
 // Rolling angle comes from distance, never elapsed wall time. Front and rear radii differ.
 w.wheels.forEach((wheel,i)=>{if(wheel)wheel.rotation.x+=moved/(i<2?.522:.756)});
 w.steer369+=(Math.max(-.24,Math.min(.24,turn||0))-w.steer369)*Math.min(1,dt*8);
 // Each wheel steers about its own vertical spindle; rolling remains about local X.
 for(const wheel of w.wheels.slice(0,2))if(wheel)wheel.rotation.y=w.steer369;
 if(moving&&w.actions.OxWalk)w.actions.OxWalk.timeScale=(moved/Math.max(dt,1e-6))/2.7;
 if(moving&&w.actions.Drive)w.actions.Drive.timeScale=(moved/Math.max(dt,1e-6))/2.7;
 w.mixer.update(dt);
};
function walkingChanged(w,v){if(w.walking369===v)return false;w.walking369=v;return true}
API.station=function(parent,x,z){
 // Create the holder synchronously: unloading its chunk cannot leave an orphan model.
 const holder=new T.Group();holder.name='OrderWagonStation';holder.position.set(x,0,z);parent.add(holder);
 const entry={holder,w:null,seen:false,age:0};stations.add(entry);
 API.ready.then(ok=>{if(!ok)return;entry.w=API.create();holder.add(entry.w.g)});
 return holder;
};
API.tickStations=function(dt,scene,player){
 for(const entry of stations){let node=entry.holder,attached=false;while(node){if(node===scene){attached=true;break}node=node.parent}
  entry.age+=dt;if(attached)entry.seen=true;else if(entry.seen||entry.age>2){if(entry.w)entry.w.mixer.stopAllAction();stations.delete(entry);continue}
  if(attached&&entry.w&&(!player||Math.hypot(entry.holder.position.x-player.x,entry.holder.position.z-player.z)<65))API.animate(entry.w,dt,0,0);
 }
};
API.stationCount=()=>stations.size;
global.Wagon369=API;
})(window);
