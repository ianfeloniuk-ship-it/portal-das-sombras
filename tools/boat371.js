(function(){'use strict';const T=THREE;let asset=null;const API={error:null};
API.ready=new Promise(resolve=>new T.GLTFLoader().load('models/boat371.glb?v=371',g=>{asset=g;resolve(true)},undefined,e=>{API.error=String(e);resolve(false)}));
API.attach=function(b){const fallback=b.root.children.filter(o=>o!==b.m.root);API.ready.then(ok=>{if(!ok||!b.root.parent||b.disposed371)return;const g=asset.scene.clone(true);g.name='CascaDeSalgueiro';g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.material=o.material.clone();if(renderer.outputEncoding!==T.sRGBEncoding){o.material.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <encodings_fragment>','#include <encodings_fragment>\ngl_FragColor=LinearTosRGB(gl_FragColor);')};o.material.customProgramCacheKey=()=> 'boat371-linear';}}});
 // Retain the existing fisher and fishing line; replace only the old hull and seats.
 for(const o of fallback){if(o===b.rod371||o.isLine)continue;b.root.remove(o);if(o.userData.own&&o.geometry)o.geometry.dispose()}
 b.root.add(g);b.model371=g;b.mixer371=new T.AnimationMixer(g);b.actions371={};for(const c of asset.animations)b.actions371[c.name]=b.mixer371.clipAction(c);b.m.root.position.set(0,-.16,.05);b.root.position.y=.32;API.setMode(b,'Float');b.detailed371=true;
});};
API.setMode=function(b,name){if(!b.actions371?.[name]||b.mode371===name)return false;b.mixer371.stopAllAction();const a=b.actions371[name];a.reset().setLoop(name==='Dock'?T.LoopOnce:T.LoopRepeat,Infinity);a.clampWhenFinished=name==='Dock';a.play();b.mode371=name;return true};
API.animate=function(b,dt){if(!b.detailed371)return;b.root.position.y=.32+Math.sin(b.t*1.4)*.035;b.mixer371.update(dt);b.model371.rotation.z=Math.sin(b.t*1.1)*.014;b.model371.rotation.x=Math.sin(b.t*.9)*.012;};
API.dispose=function(b){b.disposed371=true;if(b.mixer371){b.mixer371.stopAllAction();b.mixer371.uncacheRoot(b.model371)}if(b.model371)b.model371.traverse(o=>{if(o.isMesh&&o.material)o.material.dispose()});};
window.Boat371=API;
})();
