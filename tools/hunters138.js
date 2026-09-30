(function(global){
'use strict';
let scene=null,pending=null;
const API={load(){if(!pending)pending=new Promise(resolve=>new THREE.GLTFLoader().load('models/cacador-veterano138.glb',g=>{scene=g.scene;resolve(true)},undefined,()=>resolve(false)));return pending;},
create(rank){if(!scene||!global.Warrior127)return null;const m=Warrior127.create({modelScene:scene,legacyLinearOutput:true,equip:{w:{tier:rank,visual:{shape:'broad'}}}});m.hunter138=true;
m.root.addEventListener('removed',()=>{if(m.disposed138)return;m.disposed138=true;for(const mat of m.mats)mat.dispose();m.eyeMat.dispose();for(const part of m.wnodes)part.traverse(o=>{if(o.isMesh)o.geometry.dispose()});for(const child of m.root.children)if(child.isMesh){child.geometry.dispose();child.material.dispose()}m.model.traverse(o=>{if(o.isSkinnedMesh&&o.skeleton.boneTexture)o.skeleton.boneTexture.dispose()});});return m;},
attach(actor,cls,rank,isCurrent){if(cls!==0)return;API.load().then(ok=>{if(!ok||!isCurrent()||actor.dead||actor.gone)return;const old=actor.m,parent=old.root.parent;if(!parent)return;const m=API.create(rank);if(!m)return;m.root.position.copy(old.root.position);m.root.rotation.copy(old.root.rotation);parent.remove(old.root);actor.m=m;if(actor.mats)actor.mats=m.mats;parent.add(m.root);});}
};global.Hunters138=API;
})(window);
