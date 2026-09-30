const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path'),root=path.resolve(__dirname,'..'),src=fs.readFileSync(path.join(root,'game.html'),'utf8');
function extract(name){let s=src.indexOf('function '+name+'(');assert(s>=0);let i=src.indexOf('{',s),d=0;for(;i<src.length;i++){if(src[i]==='{')d++;else if(src[i]==='}'&&!--d)return src.slice(s,i+1)}throw Error(name)}
const ranks=src.slice(src.indexOf('const RANKS='),src.indexOf('const TOPR='));
const mod=fs.readFileSync(path.join(__dirname,'crystals125.js'),'utf8');assert(src.replace(/\r/g,'').includes(mod.replace(/\r/g,'')));
const c={THREE:{Color:class{constructor(v){this.v=v}getHex(){return parseInt(this.v.slice(1),16)}},MeshStandardMaterial:class{constructor(o){Object.assign(this,o);this.userData={}}}},console};vm.createContext(c);vm.runInContext(ranks+mod,c);
(async()=>{assert.equal(await vm.runInContext('crystalReady125',c),false);assert.equal(c.attachCrystal125({},0),false);
 for(let rank=0;rank<10;rank++){const a=c.crystalMaterial125(rank,true),b=c.crystalMaterial125(rank,false);assert.equal(a,c.crystalMaterial125(rank,true));assert.equal(a.color.v,vm.runInContext('RANKS['+rank+'].c',c));assert.equal(b.emissive,0);assert.equal(b.emissiveIntensity,0);assert(a.userData.shared)}
 assert.equal(c.crystalRank125(NaN),0);assert.equal(c.crystalRank125(-5),0);assert.equal(c.crystalRank125(999),9);
 const ctx={Math:Object.create(Math),time:10,run:{res:{cry:Array(10).fill(0)}},profLv:()=>0,hasT:()=>false,profXp(){},storyEv(){},player:{x:0,z:0},floater(){},fxBurst(){},sfx(){},shake(){},npcEv(){},toast(){},L:{group:{remove(g){g.removed=true}}},RANKS:vm.runInContext('RANKS',c),GR:vm.runInContext('RANKS',c),crystalColor125:c.crystalColor125};ctx.Math.random=()=>.8;vm.createContext(ctx);vm.runInContext(extract('mine'),ctx);
 for(let rank=0;rank<10;rank++){ctx.time+=2;const before=ctx.run.res.cry.slice(),it={x:1,z:1,charges:2,g:{scale:{setScalar(){}}}};ctx.mine(it,rank);assert.equal(ctx.run.res.cry[rank],before[rank]+1);ctx.mine(it,rank);assert.equal(it.charges,1);ctx.time+=1;ctx.mine(it,rank);assert(it.hidden&&it.g.removed);ctx.time+=1;ctx.mine(it,rank);assert.equal(ctx.run.res.cry[rank],before[rank]+2);for(let j=0;j<10;j++)if(j!==rank)assert.equal(ctx.run.res.cry[j],before[j]);}
 // Verify the shipped GLB has only the expected two primitives and 8k triangles.
 const b=fs.readFileSync(path.join(root,'models/cristal-fenda-rank125.glb'));assert.equal(b.readUInt32LE(0),0x46546c67);const j=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString());assert.deepEqual(j.meshes.map(x=>x.name).sort(),['mineral','stone']);assert.equal(j.meshes.reduce((n,m)=>n+j.accessors[m.primitives[0].indices].count/3,0),8000);
 console.log('PASS crystals125: 10 rank materials, shared cache, loader-unavailable fallback, rank bounds, mining reward/cooldown/depletion, two-part 8000-triangle GLB');
})().catch(e=>{console.error(e);process.exit(1)});
