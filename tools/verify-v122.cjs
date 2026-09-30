const fs=require('fs'),vm=require('vm'),assert=require('assert');
const path=require('path');
const THREE=require(process.env.THREE_PATH||process.argv[2]||path.resolve(__dirname,'../../three-r128.cjs'));
const src=fs.readFileSync('game.html','utf8');
const body=src.slice(src.indexOf('function goblinShot118'),src.indexOf('// END GOBLINS118'));
const calls=[];
const c={shoot:(...a)=>calls.push(a),goblinMuzzle122:e=>e.muzzle||null};vm.createContext(c);vm.runInContext(body,c);
const e={kind:'gobArcher118',x:1,z:2,face:0,dmg:8,muzzle:{x:4,z:5,y:1.6}};
c.goblinShot118(e);assert.deepEqual(calls[0].slice(0,8),[4,5,0,18,8,'enemy',0xc6ac78,'arrow']);assert.equal(calls[0][8].originY,1.6);
const s={kind:'gobShaman118',x:1,z:2,face:Math.PI/2,dmg:10,muzzle:{x:-2,z:3,y:1.9}};c.goblinShot118(s);assert.deepEqual(calls[1].slice(0,8),[-2,3,Math.PI/2,12,10,'enemy',0xb06bff,'orb']);assert.equal(calls[1][8].originY,1.9);
const g={kind:'mage',x:1,z:2,face:0,dmg:10};c.goblinShot118(g);assert.equal(calls[2][0],1);assert.equal(calls[2][1],2);
assert(src.includes("if(!m?.organic||!['archer','shaman'].includes(m.goblin118))return null"));
assert(src.includes("return (m.staffEmitter||m.bowNock).getWorldPosition"));
assert(src.includes("if(e.m.organic&&A.done){wind=0;atk=Math.max(.000001,(A.t-A.wind)/.25)}"));
assert(src.includes("else if(A.type==='slam')"));
assert(src.includes("hazard(e.x+Math.sin(e.face)*1.6,e.z+Math.cos(e.face)*1.6,3.2,e.wind,e.dmg*1.3,'enemy'"));
console.log('PASS v122 muzzle origin, arrow/orb type and damage preservation; organic ranged recovery; canonical slam hazard remains single source of damage.');

// Decode and exercise every packed organic role with Three r128. This stays
// CPU-side: no browser and no runtime edits are required.
const packed=fs.readFileSync('tools/goblin-data122.js','utf8');
const runtime=fs.readFileSync('tools/goblins118.js','utf8')+'\n'+packed+'\n'+fs.readFileSync('tools/goblins122.js','utf8');
const cache={};const ctx={THREE,atob:s=>Buffer.from(s,'base64').toString('binary'),GOBLIN_BUFFERS122:null,GOBLIN_DATA122:null,
  geo:(k,f)=>cache[k]||(cache[k]=f()),toon:c=>new THREE.MeshStandardMaterial({color:c}),toonS:c=>new THREE.MeshStandardMaterial({color:c}),
  goblinRoundedBox118:()=>new THREE.BoxGeometry(.82,.82,.82),console};vm.createContext(ctx);vm.runInContext(runtime,ctx);
const roles=['warrior','shield','archer','shaman','brute'];
for(const role of roles){
  const a=ctx.makeGoblin118({goblin118:role,organic:true,inGame122:false}),b=ctx.makeGoblin118({goblin118:role,organic:true,inGame122:false});
  assert(a.skinMesh&&a.skinMesh.skeleton&&a.skinMesh.material.skinning,'real skin mesh/skeleton '+role);
  assert(a.skinMesh.geometry===b.skinMesh.geometry,'packed geometry cache '+role);assert(a.skinMesh.material!==b.skinMesh.material,'materials independent '+role);
  const testGeometry=a.skinMesh.geometry.clone(),packedWeights=testGeometry.attributes.skinWeight.array,weights=new Float32Array(packedWeights.length);for(let j=0;j<weights.length;j++)weights[j]=packedWeights[j]/65535;testGeometry.setAttribute('skinWeight',new THREE.BufferAttribute(weights,4));a.skinMesh.geometry=testGeometry;
  const positions=a.skinMesh.geometry.attributes.position;
  for(let i=0;i<positions.count;i++){let sum=0;for(let j=0;j<4;j++)sum+=weights[i*4+j];assert(Math.abs(sum-1)<.02,'normalized skin weights '+role);}
  const states=[['idle',{move:0,wind:0,atk:0}],['walk',{move:1,wind:0,atk:0}],['wind',{move:0,wind:1,atk:0}],['atk',{move:0,wind:0,atk:.5}]];
  function vertexWorld(i){const v=new THREE.Vector3().fromBufferAttribute(positions,i);a.skinMesh.boneTransform(i,v);return a.skinMesh.localToWorld(v)}
  for(const [label,st] of states){
    ctx.animGoblin118(a,st,1.23);a.root.updateMatrixWorld(true);a.skinMesh.skeleton.update();const box=new THREE.Box3();
    for(let i=0;i<positions.count;i+=17){const v=vertexWorld(i);assert(Number.isFinite(v.x+v.y+v.z),'finite deformed vertex '+role+' '+label);box.expandByPoint(v)}
    const size=box.getSize(new THREE.Vector3());assert(size.y>.8&&size.y<4&&size.x<4&&size.z<4,'bounded deformed envelope '+role+' '+label);
  }
  // Compare a real skinned vertex before/after root transform in the same pose.
  ctx.animGoblin118(a,{move:0,wind:.4,atk:0},1.23);a.root.position.set(0,0,0);a.root.rotation.set(0,0,0);a.root.scale.setScalar(1);a.root.updateMatrixWorld(true);a.skinMesh.skeleton.update();
  const sample=[0,Math.floor(positions.count/2),positions.count-1],base=sample.map(vertexWorld);
  a.root.position.set(3,0,-2);a.root.rotation.y=.7;a.root.scale.setScalar(1.7);a.root.updateMatrixWorld(true);a.skinMesh.skeleton.update();
  sample.forEach((i,j)=>{const transformed=vertexWorld(i),expected=base[j].clone().applyMatrix4(a.root.matrixWorld);assert(transformed.distanceTo(expected)<1e-4,'root transform once '+role)});
  if(role==='archer')assert(a.bowNock&&a.handL,'bow attachment '+role);if(role==='shaman')assert(a.staffEmitter&&a.handR,'staff attachment '+role);if(role==='warrior'||role==='shield'||role==='brute')assert(a.weapon&&a.handR,'weapon attachment '+role);
}
assert(src.includes("m.root.position.set(e.x,0,e.z);m.root.rotation.y=e.face"),'muzzle pins root once');
console.log('PASS packed v122 roles/skeleton: finite normalized weights, bounded idle/walk/wind/atk vertices, independent instances, face attachments, bind-space transforms, and no duplicate muzzle transform.');
