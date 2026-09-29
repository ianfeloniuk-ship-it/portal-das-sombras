const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.html','utf8');
function extract(n){const m=new RegExp('function\\s+'+n+'\\s*\\([^)]*\\)').exec(src);assert(m,n);let b=src.indexOf('{',m.index),d=0,q=null,e=false;for(let i=b;i<src.length;i++){let c=src[i];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c===q)q=null;continue}if(c==='"'||c==="'"||c==='`'){q=c;continue}if(c==='{')d++;if(c==='}'&&!--d)return src.slice(m.index,i+1)}}




const c={player:{x:0,z:0,hp:20,maxhp:100,mp:0,maxmp:100},run:{pots:0,gold:0,res:{cry:[0,0]}},enemies:[],L:{mode:'dungeon',gate:{rank:1},bossRoom:1,rooms:[{},{x:1,y:1,w:2,h:2}],grid:{W:5},visited:new Uint8Array(25)},GR:[{gold:1},{gold:2}],hasAff:()=>false,toast(){},fmt:String,saveRun(){}};vm.createContext(c);for(const n of ['mulberry32','portalEncounterPlan','encounterEnemies','claimPortalEncounter'])vm.runInContext(extract(n),c);vm.runInContext(src.slice(src.indexOf('const PORTAL_ENCOUNTERS='),src.indexOf('function portalEncounterPlan')),c);
assert.equal(c.portalEncounterPlan({seed:1},[]),null);assert.equal(c.portalEncounterPlan({seed:1,encounterUsed:true},[1]),null);const kinds=new Set();for(let seed=1;seed<=100;seed++){const a=c.portalEncounterPlan({seed},[2,4]);const b=c.portalEncounterPlan({seed},[2,4]);assert.equal(a.kind,b.kind);assert([2,4].includes(a.room));kinds.add(a.kind)}assert.equal(kinds.size,3);
function event(id){c.L.gate.encounterUsed=false;c.L.encounter={x:0,z:0,room:2,it:{r:2.8},obj:{},cfg:{id,n:id}}}
event('cache');c.enemies=[{room:2,dead:false}];assert(!c.claimPortalEncounter('take'));assert.equal(c.run.gold,0);c.enemies[0].dead=true;assert(c.claimPortalEncounter('take'));assert.equal(c.run.gold,100);assert.equal(c.run.res.cry[1],3);assert(!c.claimPortalEncounter('take'));assert.equal(c.run.gold,100);
event('scout');assert(c.claimPortalEncounter('take'));assert.equal(c.run.pots,2);assert.equal(c.L.visited[6],1);assert.equal(c.L.visited[12],1);assert.equal(c.L.visited[0],0);
event('spring');c.hasAff=()=>true;assert(!c.claimPortalEncounter('hp'));assert(c.claimPortalEncounter('mp'));assert.equal(c.player.mp,50);assert(!c.claimPortalEncounter('hp'));event('spring');c.hasAff=()=>false;assert(c.claimPortalEncounter('hp'));assert.equal(c.player.hp,70);event('spring');c.player.x=10;assert(!c.claimPortalEncounter('hp'));c.player.x=0;c.L.special={kind:'tower'};assert(!c.claimPortalEncounter('hp'));delete c.L.special;c.player.hp=100;assert(!c.claimPortalEncounter('hp'));assert(!c.claimPortalEncounter('invalid'));
console.log('PASS deterministic varied encounters, valid rooms, combat gate, exact reward once, scout map/potions, mutually exclusive source choice, full health/no-cure/distance/special guards');
