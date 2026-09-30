const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
class Geometry { constructor(){this.attributes={position:{count:12,getX:()=>1,getY:()=>1,getZ:()=>1}}} toNonIndexed(){return this} setAttribute(){} scale(){} }
class Group { constructor(){this.children=[]} add(o){this.children.push(o)} }
class Mesh { constructor(geometry,material){this.geometry=geometry;this.material=material;this.position={set(){},clone(){return {}}};this.scale={setScalar(){},clone(){return {}}};this.rotation={x:0,y:0,z:0};this.userData={}} }
class Material { constructor(o={}){Object.assign(this,o)} }
class Vec3 { constructor(x,y,z){Object.assign(this,{x,y,z})} }
const THREE={Group,Mesh,MeshBasicMaterial:Material,MeshStandardMaterial:Material,Vector3:Vec3,QuadraticBezierCurve3:class{},TubeGeometry:Geometry,TorusGeometry:Geometry,IcosahedronGeometry:Geometry,DodecahedronGeometry:Geometry,OctahedronGeometry:Geometry,ConeGeometry:Geometry,CylinderGeometry:Geometry,BoxGeometry:Geometry,BufferGeometry:Geometry,Float32BufferAttribute:class{}};
let now=0;const context={window:{},THREE,performance:{now:()=>now}};vm.runInNewContext(fs.readFileSync('tools/combat139.js','utf8'),context);
const api=context.window.Combat139;assert(api&&typeof api.sequence==='function');
const generated=[];for(let i=0;i<21;i++){now+=400;const effect=api.sequence({n:'Habilidade '+i,skillId:'skill:'+i,col:0x8866aa},i);if(effect){assert(effect.group.children.length>=10);effect.update(.5);generated.push(i)}}
assert.equal(generated.length,10,'as 21 classes devem formar as tríades sequenciais');
now+=7000;assert.equal(api.sequence({n:'A',skillId:'A',col:1},0),null);now+=100;assert.equal(api.sequence({n:'B',skillId:'B',col:2},1),null);now+=6600;assert.equal(api.sequence({n:'C',skillId:'C',col:3},2),null,'janela expirada deve zerar a sequência');
console.log('PASS: 21 famílias aceitas; tríades geram selo animado; janela de 6,5s expira corretamente.');
