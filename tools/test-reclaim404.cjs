const fs=require('fs'),vm=require('vm'),assert=require('assert');
const T=require(process.argv[2]||'three');
function boundsWith(source){const c={window:{},THREE:T};c.window=c;vm.runInNewContext(source.replace('return{start,tick,clear,','return{posedBounds,start,tick,clear,'),c);return c.Reclaim372.posedBounds}
const fixed=boundsWith(fs.readFileSync(__dirname+'/reclaim372.js','utf8'));
function fixture(Type,normalized,value){const root=new T.Group(),bone=new T.Bone();root.add(bone);const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute([0,0,0,1,2,1,-1,1,-1],3));g.setAttribute('skinIndex',new T.Uint16BufferAttribute(new Array(12).fill(0),4));g.setAttribute('skinWeight',new T.BufferAttribute(new Type([value,0,0,0,value,0,0,0,value,0,0,0]),4,normalized));const mesh=new T.SkinnedMesh(g,new T.MeshBasicMaterial());root.add(mesh);root.updateMatrixWorld(true);mesh.bind(new T.Skeleton([bone]));bone.position.set(3,1,2);return root}
const float=fixed(fixture(Float32Array,false,1));
for(const [type,max] of [[Uint8Array,255],[Uint16Array,65535]]){const box=fixed(fixture(type,true,max));assert(box.min.distanceTo(float.min)<1e-5);assert(box.max.distanceTo(float.max)<1e-5)}
assert(float.getSize(new T.Vector3()).distanceTo(new T.Vector3(2,2,2))<1e-5);
const old=boundsWith(require('child_process').execFileSync('git',['show','63647b706f52cda11a4b73ed959f8424646b66f1:tools/reclaim372.js'],{encoding:'utf8'}));const inflated=old(fixture(Uint16Array,true,65535)).getSize(new T.Vector3());assert(inflated.x>10000,'fixture must reproduce pre-fix explosion');
console.log('Normalized Uint8/Uint16 and float skin bounds agree; old Uint16 reproduces inflated bounds.');
