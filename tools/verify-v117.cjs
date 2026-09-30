const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.html','utf8');
function extract(name){const start=src.indexOf('function '+name+'(');assert(start>=0,'missing '+name);let i=src.indexOf('{',start),d=0;for(;i<src.length;i++){if(src[i]==='{')d++;else if(src[i]==='}'&&!--d)return src.slice(start,i+1)}throw new Error('unclosed '+name)}
const c={Math,console,EXP_TYPES:{rupture:{},hunt:{},combat:{}},GR:Array.from({length:10},(_,i)=>({id:i})),fmtT:n=>String(n),fxRing(){},bigText(){},player:{dead:false},enemies:[],L:null,run:{loot:{"Núcleo Estável":{n:2,v:70}}},spawnBoss(x,z,rank,B){const e={x,z,rank,B,isBoss:true,dead:false,hp:100,maxhp:100,speed:2,gold:10};c.enemies.push(e);return e},beginDungeonEscape(){c.L.closeT=60},toast(){},bossE:null};
vm.runInContext(extract('mulberry32'),vm.createContext(c));
vm.createContext(c);
for(const n of ['expeditionType','retireExtraction117','expState','combatRemaining117','updateCombat117','combatObjective117'])vm.runInContext(extract(n),c);

// Legacy migration is idempotent, keeps already awarded progress out of the new state,
// and does not mutate the loot container supplied by the caller.
const loot=c.run.loot;
const g={id:4,seed:9,rank:3,red:true,double:true,expType:'extract',expState:{type:'extract',sent:6,completed:true,cargo:['ore'],deposits:[1]}};
assert.equal(c.retireExtraction117(g),true);assert.equal(g.expType,'combat');assert.equal(g.red,false);assert.equal(g.double,false);assert.equal(g.extractionCleared117,true);assert.deepEqual(g.retiredExtraction117,{sent:6,completed:true});assert.equal(g.expState,undefined);
assert.equal(c.retireExtraction117(g),false);assert.deepEqual(loot,{"Núcleo Estável":{n:2,v:70}});
assert.equal(c.expeditionType(g),'combat');assert.equal(c.expState(g),null);

// No generated ordinary dungeon is classified as extract; explicit special layouts remain special.
for(let seed=0;seed<128;seed++)assert.notEqual(c.expeditionType({seed,rank:2}),'extract');
assert.equal(c.expeditionType({seed:1,layout103:'core'}),'core');
assert.equal(c.expeditionType({seed:1,layout103:'floors'}),'floors');
assert.equal(c.expeditionType({seed:1,expType:'hunt'}),'hunt');

// Boss remains locked until every initial target is dead or gone; extra spawns are ignored.
const target1={dead:false,gone:false,combatTarget117:true},target2={dead:false,gone:false,combatTarget117:true};
c.L={combat117:{boss:{n:'B'},targets:[target1,target2],spawned:false},bossDead:false,brk:false,gate:{rank:2,red:true,aff:['armor','frenzy','expl']},rooms:[{wx:0,wz:0}],bossRoom:0,seen:new Set()};c.enemies=[target1,target2];
assert.equal(c.combatRemaining117().length,2);assert.equal(c.updateCombat117(),false);assert.equal(c.L.combat117.spawned,false);assert.equal(c.enemies.filter(e=>e.isBoss).length,0);
const extra={dead:false,gone:false,combatTarget117:false};c.enemies.push(extra);target1.dead=true;target2.gone=true;assert.equal(c.combatRemaining117().length,0);assert.equal(c.updateCombat117(),true);assert.equal(c.L.combat117.spawned,true);assert.equal(c.enemies.filter(e=>e.isBoss).length,1);assert(Math.abs(c.enemies.at(-1).hp-195)<1e-9);assert(Math.abs(c.enemies.at(-1).speed-2*1.3)<1e-9);assert.equal(c.combatObjective117().includes('guardião'),true);
assert.equal(c.updateCombat117(),false);assert.equal(c.enemies.filter(e=>e.isBoss).length,1);

// Already completed, breaking, dead and special variants cannot spawn this boss.
for(const state of [{bossDead:true},{brk:true},{playerDead:true}]){c.L={combat117:{boss:{},targets:[],spawned:false},bossDead:!!state.bossDead,brk:!!state.brk,gate:{rank:1},rooms:[{wx:0,wz:0}],bossRoom:0,seen:new Set()};c.player.dead=!!state.playerDead;c.enemies=[];assert.equal(c.updateCombat117(),false);assert.equal(c.enemies.length,0)}
c.player.dead=false;
// Explicit Order mission: city-only start, persisted partial progress, one claim.
Object.assign(c,{L:{mode:'world'},rankOf:()=>2,run:{level:10,gold:0,extractMission117:{sent:3,completed:false,rank:2,rw:100}},profile:{guildClaims:0},inCity:()=>true,saveRun(){},affL:()=>0,questOrderRep:q=>q.rank,addOrderRep(){},fmt:n=>String(n),gateSeq:0,enterGate(g){c.startedGate=g;},store:{set(){}}});
for(const n of ['extractionOffer117','extractionMissionRow117','startExtractionMission117','claimExtractionMission117'])vm.runInContext(extract(n),c);
assert.equal(c.expeditionType({missionExtract117:true,expType:'extract'}),'extract');assert.equal(c.expeditionType({expType:'extract'}),'combat');
assert.equal(c.startExtractionMission117(),true);assert(c.startedGate.missionExtract117&&c.startedGate.expType==='extract');c.run.extractMission117.completed=true;
assert.equal(c.claimExtractionMission117(),true);assert.equal(c.run.extractMission117,undefined);assert.equal(c.claimExtractionMission117(),false);assert.equal(c.profile.guildClaims,1);
// City guards, actual serialization of partial progress and prevention of re-entry after completion.
c.run.extractMission117={rank:2,repRank97:2,sent:3,completed:false,rw:100,seed:777};
c.run=JSON.parse(JSON.stringify(c.run));c.startedGate=null;c.inCity=()=>false;
assert.equal(c.startExtractionMission117(),false);assert.equal(c.startedGate,null);
c.inCity=()=>true;assert.equal(c.startExtractionMission117(),true);
assert.equal(c.startedGate.seed,777);assert.equal(c.run.extractMission117.sent,3);
c.run.extractMission117.completed=true;c.startedGate=null;
assert.equal(c.startExtractionMission117(),false);assert.equal(c.startedGate,null);
c.inCity=()=>false;assert.equal(c.claimExtractionMission117(),false);assert(c.run.extractMission117);
c.inCity=()=>true;const beforeGold=c.run.gold;assert(c.claimExtractionMission117());
assert.equal(c.run.gold,beforeGold+100);assert.equal(c.claimExtractionMission117(),false);assert.equal(c.run.gold,beforeGold+100);
assert.equal(c.retireExtraction117({missionExtract117:true,expType:'extract'}),false);
assert.equal(c.expeditionType({missionExtract117:false,expType:'extract'}),'combat');

// Finished extraction stops all outstanding threats and cannot spawn instability again.
Object.assign(c,{run:{extractMission117:{sent:6,completed:false}},player:{dead:false},L:{gate:{missionExtract117:true},expedition:{s:{type:'extract',sent:6,completed:false,instability:99},nodes:[{grp:{visible:true}}],timer:0}},enemies:[{m:{root:{}},act:{}}],hazards:[{g:{}}],projs:[{mesh:{}}],scene:{remove(){}},unlockDungeonExit(){},expStage:()=>3,expSpawn(){throw new Error('Unexpected spawn after completion')},expHazard(){throw new Error('Unexpected hazard after completion')}});
for(const n of ['finishExtraction117','expeditionUpdate'])vm.runInContext(extract(n),c);
assert(c.finishExtraction117());assert.equal(c.finishExtraction117(),false);
assert(c.run.extractMission117.completed);assert(c.L.bossDead);assert(c.enemies.every(e=>e.dead&&e.gone&&!e.act));
assert.equal(c.hazards.length,0);assert.equal(c.projs.length,0);assert(c.L.expedition.nodes.every(n=>n.hidden&&!n.grp.visible));
for(let i=0;i<20;i++)c.expeditionUpdate(10);
console.log('PASS: world combat gating and single boss; explicit city-only extraction mission; partial save/resume; one claim; completed-state cleanup and no repeated threats.');
