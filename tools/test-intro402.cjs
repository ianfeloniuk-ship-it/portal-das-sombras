const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const noop=()=>{}, ctx={console,Map,Math,setInterval:noop,setTimeout:noop,window:{},profile:{rank:0,classless:true,name:'Teste'},run:{level:1,gold:0,equip:{},items:[]},player:{x:0,z:0},L:{mode:'world',inter:[]},story:{acts:[]},LORE:{},store:{set:noop},nearestCity:()=>({c:{name:'Aster',x:0,z:0},d:0}),CITYK:1,cityL:()=>0,cityPalisadeR:()=>80,toast:noop,sfx:noop,storyEv:noop,openShop:noop,journeyView:noop,npcRows:()=>'',extraActions2:noop,journeyObjectives:()=>[],missionPanelText:()=>'',rankTab:()=>'',started:true,paused:false,GATES341:[],npcs:[],logNews:noop,popNews194:noop,RpgBalance:{questReward:()=>({xp:10})},gainXp:()=>10,questGold283:()=>10,rankOf:()=>0,addOrderRep:noop,unlockLore:noop,bigText:noop,xpNumber:String,fmt:String,saveRun:noop};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync('tools/campaign327.js','utf8'),ctx);

const C=ctx.Campaign327,m=C.ACTS[0];C.begin(m);
ctx.modalOpen=false;ctx.document={getElementById:()=>({style:{}})};let timers=[];
ctx.setTimeout=(fn,ms)=>{timers.push({fn,ms})};ctx.cam={};ctx.gy=()=>0;ctx.terrH=()=>0;ctx.updChunks=noop;
ctx.player={x:12,z:100,hp:0,maxhp:120,maxmp:28,maxsh:0,m:{root:{position:{set:noop}}}};
const s=C.state('a1');s.roadSpawn401={x:3,z:105};
for(const step of [0,1]){s.s=step;ctx.player.dead=false;ctx.player.hp=0;ctx.player.x=9;ctx.player.z=110;timers=[];
 assert.equal(C.respawnRoad(),true);timers.find(t=>t.ms===450).fn();
 assert.equal(ctx.player.x,3);assert.equal(ctx.player.z,105);assert.equal(ctx.player.hp,120);assert.equal(s.s,step);assert.equal(ctx.run.level,1);}
console.log('PASS: death before and after rescue returns to road, full HP, same mission');
s.s=1;ctx.GATES341=[{c:{name:'Aster'},x:0,z:60}];ctx.run.trackObj=null;ctx.THREE={Group:class{constructor(){this.userData={};this.position={set:noop};}add(){}},SphereGeometry:class{},MeshBasicMaterial:class{},Mesh:class{constructor(){this.position={y:0}}}};ctx.scene={add:noop};ctx.performance={now:()=>0};ctx.nearestCity=()=>({c:{name:'Aster',x:0,z:0},d:65});C.tick();assert.equal(s.s,1,'outside the actual gate must keep road checkpoint');ctx.nearestCity=()=>({c:{name:'Aster',x:0,z:0},d:54});C.tick();assert.equal(s.s,2);ctx.nearestCity=()=>({c:{name:'Aster',x:0,z:0},d:0});s.s=2;s.cityCheckpoint401=true;assert.equal(C.roadCheckpoint(),false);ctx.player.dead=false;timers=[];assert.equal(C.respawnRoad(),true);timers.find(t=>t.ms===450).fn();assert.equal(ctx.player.x,0);assert.equal(ctx.player.z,14);assert.equal(s.s,2);
delete ctx.profile.classless;assert.equal(C.respawnRoad(),false);console.log('PASS: city checkpoint only after entry; awakened death uses existing rules');
ctx.profile.classless=true;ctx.profile.orderPending401=true;let dialogue,creation=0;ctx.Intro401={dialog:(name,lines,done)=>dialogue={name,done}};ctx.creationView=()=>creation++;
ctx.openShop('guild');assert.equal(s.s,2);dialogue.done();assert.equal(creation,1);assert.equal(s.s,2);assert.equal(ctx.profile.creationPending91,true);
C.registered();assert.equal(s.s,3);C.registered();assert.equal(s.s,3);console.log('PASS: Lyra opens registration; stage advances once, only on confirmation');
const balance=require('./balance-rpg.js');for(const n of [0,1,100])assert.deepEqual(balance.baseStats(n,'none'),{hp:120,mp:28,physical:12,magic:2.5});
for(const ci of [0,1,2,4,5,6,8,9,10,11,21,22,23,24]){const g=balance.growthFor(ci),a=balance.baseStats(1,ci),b=balance.baseStats(2,ci);for(const k of ['hp','mp','physical','magic'])assert.ok(Math.abs((b[k]-a[k])-g[k].perLevel)<1e-8)}
console.log('PASS: no class growth for traveler; all 14 classes use their own level growth');
const xp=fs.readFileSync('src/core/370-v281.js','utf8');const a=xp.indexOf('function gainXp('),b=xp.indexOf('\n/* Custos',a);vm.runInContext(xp.slice(a,b),ctx);ctx.run.level=0;ctx.run.xp=0;assert.equal(ctx.gainXp(100000,'monster'),0);assert.equal(ctx.run.level,0);assert.equal(ctx.run.xp,0);console.log('PASS: XP cannot awaken classless traveler');
