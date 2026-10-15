const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const noop=()=>{}, ctx={console,Map,Math,setInterval:noop,setTimeout:noop,window:{},profile:{rank:0,classless:true,name:'Teste'},run:{level:1,gold:0,equip:{},items:[]},player:{x:0,z:0},L:{mode:'world',inter:[]},story:{acts:[]},LORE:{},store:{set:noop},nearestCity:()=>({c:{name:'Aster',x:0,z:0},d:0}),CITYK:1,cityL:()=>0,cityPalisadeR:()=>80,toast:noop,sfx:noop,storyEv:noop,openShop:noop,journeyView:noop,npcRows:()=>'',extraActions2:noop,journeyObjectives:()=>[],missionPanelText:()=>'',rankTab:()=>'',started:true,paused:false,GATES341:[],npcs:[],logNews:noop,popNews194:noop,RpgBalance:{questReward:()=>({xp:10})},gainXp:()=>10,questGold283:()=>10,rankOf:()=>0,addOrderRep:noop,unlockLore:noop,bigText:noop,xpNumber:String,fmt:String,saveRun:noop};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync('tools/campaign327.js','utf8'),ctx);
const C=ctx.Campaign327,m=C.ACTS[0];C.begin(m);assert.equal(C.state('a1').s,0);assert.equal(C.state('a1').fightDone,false);
C.advance(m);assert.equal(C.state('a1').s,1);C.tick();assert.equal(C.state('a1').s,2);
let dialogue;ctx.Intro401={dialog:(name,lines,done)=>dialogue={name,lines,done}};
ctx.openShop('guild');assert.equal(dialogue.name,'Lyra');assert.equal(C.state('a1').s,2,'opening dialogue must not advance');dialogue.done();assert.equal(C.state('a1').s,3);
C.tick();assert.equal(C.state('a1').done,undefined,'classless barter must not finish');ctx.openShop('wep');assert.equal(dialogue.name,'Kael');delete ctx.profile.classless;C.tick();assert.equal(C.state('a1').done,true);assert.equal(ctx.profile.openWorld401,true);
console.log('PASS: gate -> Lyra completion -> Kael -> awakening -> open world');
vm.runInContext(fs.readFileSync('src/core/560-liberacao-gradual.js','utf8'),ctx);assert.equal(ctx.unl('tower'),true);assert.equal(ctx.unl('rebirth'),true);console.log('PASS: post-prologue system access at level 1');
// Regression: neither barter nor vocation may rerender the previous shop.
const source=fs.readFileSync('src/core/620-janelas.js','utf8');const start=source.indexOf("$('mb').addEventListener('click',e=>{");const end=source.indexOf("\n});",start)+4;let click;let rerenders=0,barters=0,choices=0;
Object.assign(ctx,{$:()=>({addEventListener:(event,fn)=>click=fn}),extraActions:()=>false,extraActions2:()=>false,extraActions3:()=>false,rerender:()=>rerenders++,Awaken396:{barter:()=>barters++,choose:()=>choices++}});
vm.runInContext(source.slice(start,end),ctx);
for(const action of ['barter396','vocation396'])click({target:{closest:()=>({dataset:{a:action,v:'sword'}})}});
assert.equal(barters,1);assert.equal(choices,1);assert.equal(rerenders,0);console.log('PASS: barter and vocation do not reopen previous shop/dialogue');
// Initial physical weapon of a magic class must survive makePlayer normalization.
Object.assign(ctx,{CLASSES:[{n:'Lâmina Arcana',wep:'sword',elem:'arc'}],MAGIC_CLS:[0],AFFC:null,rememberClassCooldowns:noop,weaponIsMagic173:w=>w.kind155==='staff',scene:{remove:noop},pSkills:()=>[],refreshStats:noop,showG:noop,closeModal:noop,makePlayer:()=>{if(ctx.run.style==='nat')ctx.run.equip.w=null;ctx.player.m={root:{position:{set:noop}}}},player:{x:1,z:2,m:{root:{}}},profile:{classless:true},run:{level:0,equip:{w:{kind155:'sword'}},items:[]}});
vm.runInContext(fs.readFileSync('tools/awaken396.js','utf8'),ctx);ctx.Campaign327.tick=noop;assert.equal(ctx.Awaken396.awaken(0),true);assert.equal(ctx.run.style,'off');assert.ok(ctx.run.equip.w);console.log('PASS: Arcane Blade awakening keeps physical sword equipped');
