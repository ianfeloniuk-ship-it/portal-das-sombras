const fs=require('fs'),vm=require('vm'),assert=require('assert');
const path=require('path'),root=path.resolve(__dirname,'..');
const src=fs.readFileSync(root+'/game.html','utf8');
function fn(name){const start=src.indexOf('function '+name+'(');assert(start>=0);let i=src.indexOf('{',start),depth=1;for(let j=i+1;j<src.length;j++){if(src[j]==='{')depth++;if(src[j]==='}'&&!--depth)return src.slice(start,j+1)}}
const THREE=require(process.env.THREE_PATH||path.resolve(__dirname,'../../three-r128.cjs'));let html='';const ctx={THREE,run:{level:100},profile:{rank:3,rankTalents:['bounce']},RANKS:Array.from({length:10},(_,i)=>({id:i})),GR:Array.from({length:10},(_,i)=>({lvl:i*20})),Math,L:{rooms:[{entry:true,floorEnd:true,wx:0,wz:0,i:0},{entry:true,floorEnd:true,wx:0,wz:100,i:1},{entry:true,floorEnd:true,wx:0,wz:200,i:2}],group:new THREE.Group(),inter:[]},geo:(k,f)=>f(),mesh:(g,m)=>new THREE.Mesh(g,m),toonS:c=>new THREE.MeshBasicMaterial({color:c}),makeSign:()=>new THREE.Group(),useDungeonStairs(){},characterTabs:()=>'',skillPoints118:()=>'',transmigratorRow:()=>'',passiveClasses:()=>[],PBOOK:[],CONS:[],unl:()=>false,rankTalent:k=>ctx.profile.rankTalents.filter(v=>v===k).length,row:(a,b,c)=>a+b+c,btn:(n,a,v)=>[n,a,v].join(' '),openModal:(t,h)=>html=h};vm.createContext(ctx);
vm.runInContext(src.match(/const RANK_TALENTS=([^\n]+)/)[0],ctx);
for(const n of ['threat','eLvl','setupDungeonFloors','passivesView'])vm.runInContext(fn(n),ctx);
assert.equal(ctx.threat(100),null);assert(ctx.threat(101));assert.equal(ctx.threat(500),'#ff8a3d');assert.equal(ctx.threat(1000),'#ff3d3d');
ctx.setupDungeonFloors();assert.equal(ctx.L.inter.length,4);for(const stair of ctx.L.inter){const steps=stair.grp.children.filter(x=>x.isMesh).sort((a,b)=>b.position.z-a.position.z);assert.equal(steps.length,5);const delta=steps.at(-1).position.y-steps[0].position.y;assert(stair.forward?delta<0:delta>0);assert(stair.label.includes(stair.forward?'DESCER':'SUBIR'))}
ctx.passivesView();assert(html.includes('Ricochete · 1/8'));assert(html.includes('Ver / distribuir character rank'));assert(!html.includes('Disparo dividido ·'));
assert(src.includes('el=eLvl(e),m='));const reward=src.match(/const pl=Math.max\(1,run.level\),el=eLvl\(e\),m=([^;]+);/)[1];for(const [el,expected] of [[100,1],[200,Math.pow(2,1.3)],[1000,6]])assert(Math.abs(vm.runInNewContext(reward,{el,pl:100,Math})-expected)<1e-10);
assert(src.includes('makeElite(e);e.lvl=tLvl(S.floor)+(e.elite?3:0)'));
for(const match of src.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))if(match[1].trim())new vm.Script(match[1]);
console.log('PASS source syntax, threat thresholds, actual four stair geometries, saved rank passives, XP multiplier and elite tower level.');
