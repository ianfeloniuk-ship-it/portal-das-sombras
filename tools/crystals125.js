// Local TripoSR mesh: shared geometry, neutral mineral colors, rank materials.
// No per-vein lights, timers, changes to generation RNG, or mining rewards.
const CRYSTALS125={template:null,materials:new Map()};
function crystalRank125(rank){return Math.max(0,Math.min(RANKS.length-1,Number.isFinite(rank)?Math.floor(rank):0))}
function crystalColor125(rank){return new THREE.Color(RANKS[crystalRank125(rank)].c)}
function crystalMaterial125(rank,mineral){
 const key=crystalRank125(rank)+':'+mineral;
 if(!CRYSTALS125.materials.has(key)){
  const color=crystalColor125(rank);
  const material=new THREE.MeshStandardMaterial({color:mineral?color:0xc5cfda,vertexColors:true,roughness:mineral?.38:.94,metalness:mineral?.12:0,emissive:mineral?color:0x000000,emissiveIntensity:mineral?.16:0});
  material.userData.shared=true;CRYSTALS125.materials.set(key,material);
 }
 return CRYSTALS125.materials.get(key);
}
const crystalReady125=new Promise(resolve=>{
 if(!THREE.GLTFLoader){resolve(false);return}
 new THREE.GLTFLoader().load('models/cristal-fenda-rank125.glb',gltf=>{
  const root=gltf.scene;root.traverse(o=>{if(o.isMesh){if(!o.geometry.attributes.normal)o.geometry.computeVertexNormals();o.geometry.userData.shared=true;o.castShadow=false;o.receiveShadow=true;const original=o.material;o.userData.mineral125=o.name==='mineral';o.material=crystalMaterial125(0,o.userData.mineral125);if(Array.isArray(original))original.forEach(m=>m.dispose());else original.dispose()}});
  const box=new THREE.Box3().setFromObject(root),height=box.max.y-box.min.y;
  if(!(height>0)){resolve(false);return}
  root.scale.setScalar(1.8/height);root.position.y=-box.min.y*root.scale.y;
  CRYSTALS125.template=root;resolve(true);
 },undefined,()=>resolve(false));
});
function attachCrystal125(group,rank){
 if(!CRYSTALS125.template)return false;
 group.clear();const model=CRYSTALS125.template.clone(true);
 model.traverse(o=>{if(o.isMesh)o.material=crystalMaterial125(rank,o.userData.mineral125)});
 group.add(model);group.userData.rankCrystal125=true;group.userData.rank125=crystalRank125(rank);return true;
}
