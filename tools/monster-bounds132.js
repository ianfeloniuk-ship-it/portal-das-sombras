// Three r128 Box3 measures undeformed geometry, not the rendered skinned pose.
function monsterBounds132(root){
 root.updateMatrixWorld(true);
 const box=new THREE.Box3(),p=new THREE.Vector3(),base=new THREE.Vector3(),out=new THREE.Vector3(),tmp=new THREE.Vector3(),mat=new THREE.Matrix4();
 const read=(a,i,k)=>{const data=a.isInterleavedBufferAttribute?a.data.array:a.array,idx=a.isInterleavedBufferAttribute?i*a.data.stride+a.offset+k:i*a.itemSize+k;let v=data[idx];if(a.normalized){const div=data instanceof Int8Array?127:data instanceof Uint8Array?255:data instanceof Int16Array?32767:data instanceof Uint16Array?65535:data instanceof Int32Array?2147483647:4294967295;v=Math.max(-1,v/div)}return v};
 root.traverse(m=>{if(!m.isMesh)return;const a=m.geometry.attributes,position=a.position;if(!position)return;if(m.isSkinnedMesh)m.skeleton.update();
  for(let i=0;i<position.count;i++){
   p.set(read(position,i,0),read(position,i,1),read(position,i,2));
   if(m.isSkinnedMesh){base.copy(p).applyMatrix4(m.bindMatrix);out.set(0,0,0);for(let k=0;k<4;k++){const weight=read(a.skinWeight,i,k);if(!weight)continue;const joint=read(a.skinIndex,i,k);mat.fromArray(m.skeleton.boneMatrices,joint*16);tmp.copy(base).applyMatrix4(mat);out.addScaledVector(tmp,weight)}p.copy(out).applyMatrix4(m.bindMatrixInverse)}
   box.expandByPoint(p.applyMatrix4(m.matrixWorld));
  }
 });return box;
}
