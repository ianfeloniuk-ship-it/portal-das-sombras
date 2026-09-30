const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync('game.html','utf8');
function extract(name){const s=src.indexOf(`function ${name}(`);assert(s>=0,`missing ${name}`);let i=src.indexOf('{',s),d=0;for(;i<src.length;i++){if(src[i]==='{')d++;else if(src[i]==='}'&&! --d)return src.slice(s,i+1)}throw Error(name)}
for(const file of ['game.html','index.html','goblin-preview.html'])for(const m of fs.readFileSync(file,'utf8').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))if(m[1].trim())new vm.Script(m[1]);
assert(!src.includes('function enterGoblin118('));assert(!src.includes('goblinPreviewRow118'));assert(!src.includes("btn('Testar goblins'"));
const calls=[],c={shoot:(...a)=>calls.push(a),goblinMuzzle122:()=>null};vm.createContext(c);vm.runInContext(extract('goblinShot118'),c);
c.goblinShot118({kind:'gobArcher118',x:1,z:2,face:0,dmg:8});assert.equal(calls[0][7],'arrow');assert.equal(calls[0][3],18);assert.equal(calls[0][5],'enemy');assert.equal(calls[0][4],8);
c.goblinShot118({kind:'gobShaman118',x:1,z:2,face:0,dmg:10});assert.equal(calls[1][7],'orb');c.goblinShot118({kind:'mage',x:1,z:2,face:0,dmg:10});assert.equal(calls[2][7],'orb');
assert(src.includes("if(B.goblin118)e.mech='costas'"));assert(src.includes('goblinIndex118<5'));assert(src.includes("g.hostile=!goblinDungeon118(g)"));assert(src.includes("g.friends=!goblinDungeon118(g)"));
console.log('PASS source/generated/gallery parse; physical archer arrows and legacy orbs preserve damage/team; five-type roster, boss mechanics and no obsolete goblin mission route');
