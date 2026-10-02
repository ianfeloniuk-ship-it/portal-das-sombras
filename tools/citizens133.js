/* Detailed stationary town NPCs. Existing shop logic remains owned by game.html. */
window.Citizens133=(()=>{
 const assets=new Map(),pending=new Map(),definitions={Dorian:{url:'models/dorian133.glb',height:1.96},Selene:{url:'models/selene133.glb',height:1.88},
  // v154 shop vendors modelled in Tripo.
  Lyra:{url:'models/lyra154.glb',height:1.86},Mira:{url:'models/mira154.glb',height:1.74},Kael:{url:'models/kael154.glb',height:1.98},Brann:{url:'models/brann154.glb',height:1.92}};
 function has(name){return !!definitions[name]}
 function load(name){if(!has(name))return Promise.resolve(false);if(pending.has(name))return pending.get(name);
 const task=new Promise(resolve=>new THREE.GLTFLoader().load(definitions[name].url,g=>{const box=new THREE.Box3().setFromObject(g.scene),height=box.max.y-box.min.y;if(!Number.isFinite(height)||height<=0){resolve(false);return}const scale=definitions[name].height/height,center=box.getCenter(new THREE.Vector3());g.scene.scale.setScalar(scale);g.scene.position.set(-center.x*scale,-box.min.y*scale,-center.z*scale);g.scene.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;const list=Array.isArray(o.material)?o.material:[o.material];for(const m of list){m.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <encodings_fragment>','#include <encodings_fragment>\ngl_FragColor=LinearTosRGB(gl_FragColor);')};m.customProgramCacheKey=()=> 'citizen133-linear';}});assets.set(name,g.scene);resolve(true)},undefined,e=>{console.warn('NPC detalhado indisponível: '+name,e);resolve(false)}));pending.set(name,task);return task;}
 function create(name){const asset=assets.get(name);if(!asset)return null;const root=new THREE.Group(),body=new THREE.Group(),model=asset.clone(true),mats=[];root.name='citizen133-'+name;root.add(body);body.add(model);model.traverse(o=>{if(o.isMesh)mats.push(...(Array.isArray(o.material)?o.material:[o.material]))});return{root,body,model,mats,wmats:[],wnodes:[],citizen133:true,glb:true,sc:1,name};}
 function animate(m,st,t){m.body.scale.y=1+Math.sin(t*1.6)*.0018;m.body.rotation.z=Math.sin(t*.7)*.0015;}
 return{has,load,create,animate};
})();
