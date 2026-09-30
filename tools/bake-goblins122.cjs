const fs=require('fs'),vm=require('vm'),path=require('path'),child=require('child_process');
const tools=__dirname;
const threePath=path.resolve(process.env.THREE_PATH||process.argv[2]||path.join(tools,'..','..','three-r128.cjs'));
const input=process.argv[3]||path.join(tools,'goblin-bake-source122.js');
const output=process.argv[4]||path.join(tools,'goblin-data122.js');
const THREE=require(threePath);
let src=fs.readFileSync(input,'utf8').replace('const base=new Float32Array(verts)','m.bakeData={verts,normals,weights};const base=new Float32Array(verts)');
const c={THREE,console};vm.createContext(c);vm.runInContext(src,c);
const pack=(Type,a)=>Buffer.from(new Type(a).buffer).toString('base64');
function geometry(g){return {p:pack(Float32Array,g.attributes.position.array),n:pack(Int16Array,Array.from(g.attributes.normal.array,x=>Math.round(x*32767))),i:g.index?pack(Uint32Array,g.index.array):null}}
const data={},stats=[];
for(const role of ['warrior','shield','archer','shaman','brute']){const start=Date.now(),m=c.makeGoblin118({goblin118:role,organic:true}),d=m.bakeData,verts=[],normals=[],indices=[],weights=[],bones=[],seen=new Map();let maxLoss=0;
 for(let v=0;v<d.weights.length;v++){const order=d.weights[v].map((w,i)=>({w,i})).sort((a,b)=>b.w-a.w).slice(0,4),sum=order.reduce((s,q)=>s+q.w,0);maxLoss=Math.max(maxLoss,1-sum);const pos=d.verts.slice(v*3,v*3+3),norm=d.normals.slice(v*3,v*3+3),w=order.map(q=>q.w/sum),bi=order.map(q=>q.i),key=[...pos,...norm,...w].map(x=>Math.round(x*1e6)).join(',')+','+bi.join(',');let index=seen.get(key);if(index===undefined){index=verts.length/3;seen.set(key,index);verts.push(...pos);normals.push(...norm);weights.push(...w);bones.push(...bi)}indices.push(index)}
 const face=[];for(const p of m.head.children)if(p.name?.startsWith('embedded-fang-')||m.faceFit.patches.includes(p))face.push({name:p.name,geometry:geometry(p.geometry),position:p.position.toArray(),rotation:p.rotation.toArray().slice(0,3),color:p.material.color.getHex(),roughness:p.material.roughness??.88,polygonOffset:!!p.material.polygonOffset});data[role]={p:pack(Float32Array,verts),n:pack(Int16Array,normals.map(x=>Math.round(x*32767))),i:pack(Uint32Array,indices),w:pack(Float32Array,weights),b:pack(Uint8Array,bones),face};stats.push({role,vertices:verts.length/3,triangles:indices.length/3,maxDiscardedWeight:maxLoss,bakeMs:Date.now()-start})}
fs.writeFileSync(output,'const GOBLIN_DATA122='+JSON.stringify(data)+';\n');child.execFileSync(process.execPath,[path.join(tools,'pack-goblins122.cjs'),output],{stdio:'inherit'});console.log(stats);
