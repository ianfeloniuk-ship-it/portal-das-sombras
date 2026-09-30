const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync('game.html','utf8');
function fn(n){let s=src.indexOf('function '+n+'('),i=src.indexOf('{',s),d=0;for(;i<src.length;i++){if(src[i]==='{')d++;else if(src[i]==='}'&&!--d)return src.slice(s,i+1)}}
const c={L:{grid:{},inter:[{type:'vein',x:0,z:0}]},gfree:(x,z)=>Math.abs(x)<10&&Math.abs(z)<10,worldFree:()=>true,kitBlocked111:()=>false,Math,Number};vm.createContext(c);vm.runInContext(['crystalFree126','crystalUnstuck126','freeAt','moveEnt'].map(fn).join('\n'),c);
for(const r of [.35,.5,1.2]){const e={x:0,z:0,r};c.crystalUnstuck126(e);assert(Math.hypot(e.x,e.z)>=1.2+r);assert(c.freeAt(e.x,e.z,r));}
const e={x:-4,z:0,r:.5};c.moveEnt(e,8,0);assert(e.x<0);assert(Math.hypot(e.x,e.z)>=1.2+.5*.85);
c.L.inter[0].hidden=true;c.moveEnt(e,8,0);assert(e.x>0);
c.L.inter[0].hidden=false;c.L.inter.push({type:'vein',x:1.5,z:0});const crowded={x:.6,z:0,r:.5};c.crystalUnstuck126(crowded);assert(c.freeAt(crowded.x,crowded.z,.5));
console.log('PASS crystal collision: centered spawn, 3 actor sizes, movement cannot cross, depleted vein releases passage, adjacent veins and walls');
