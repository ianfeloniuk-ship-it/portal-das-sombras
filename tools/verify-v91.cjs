const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.html','utf8');
function extract(n){const m=new RegExp('function\\s+'+n+'\\s*\\([^)]*\\)').exec(src);assert(m,n);let b=src.indexOf('{',m.index),d=0,q=null,e=false;for(let i=b;i<src.length;i++){let c=src[i];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c===q)q=null;continue}if(c==='"'||c==="'"||c==='`'){q=c;continue}if(c==='{')d++;if(c==='}'&&!--d)return src.slice(m.index,i+1)}}





let saved=0;const c={profile:{creationPending91:true,cls:0},run:{stats:{for:0,agi:0,per:0,int:0,vit:0},pts:0,spts:2},CLASSES:[{sk:[{n:'A'},{n:'B'},{n:'C'}]}],player:{maxhp:100,maxmp:20},store:{set(){}},creationView(){},startFirstEquipment(){},toast(){},pSkills:()=>[],refreshStats(){},showG(){},closeModal(){},saveRun(){saved++},tutorial(){},passivesView(){},CFG:{vol:.2,music:1,effects:1,btn:1},AU:{on:true,master:{gain:{}},mus:{gain:{}},fx:{gain:{}}},document:{documentElement:{style:{setProperty(){}}}},localStorage:{setItem(){}},$:()=>({hidden:false})};vm.createContext(c);
for(const n of ['creationDraft','creationUsed','creationEdit','finishCreation','safeText','transmigratorBonus','improveTransmigrator','applyCfg','setAudioVolume','gainXp'])vm.runInContext(extract(n),c);
c.creationView=()=>{};assert(!c.finishCreation());c.creationEdit('name','  Lia <&>  ');c.creationEdit('skill',2);for(let i=0;i<8;i++)c.creationEdit('for',1);assert.equal(c.creationUsed(),5);c.creationEdit('for',-1);assert.equal(c.creationUsed(),4);c.profile=JSON.parse(JSON.stringify(c.profile));assert(c.finishCreation());assert.equal(c.profile.name,'Lia <&>');assert.equal(c.run.stats.for,4);assert.equal(c.run.pts,1);assert.equal(c.run.classLoadout[0],'0:2');c.creationView=()=>{};assert(!c.finishCreation());assert.equal(c.run.pts,1);assert.equal(c.safeText('<img>'),'&lt;img&gt;');
assert(c.improveTransmigrator());assert.equal(c.run.spts,1);assert.equal(c.transmigratorBonus(),.10);c.profile.transmigratorLv=10;assert(!c.improveTransmigrator());assert.equal(c.run.spts,1);
Object.assign(c,{guildBonus:()=>0,npcHas:()=>false,festival:()=>null,pb:()=>0,xpNeed:()=>1e9,rankOf:()=>0,JOB_LVL:20,GR:[],TOPR:8});c.run.xp=0;c.run.level=1;c.gainXp(100,'monster');assert.equal(c.run.xp,200);c.gainXp(100);assert.equal(c.run.xp,300);
c.setAudioVolume('music',0);assert.equal(c.AU.mus.gain.value,0);assert.equal(c.AU.fx.gain.value,.75);c.setAudioVolume('effects',.4);assert(Math.abs(c.AU.fx.gain.value-.3)<1e-9);assert.equal(c.AU.mus.gain.value,0);c.setAudioVolume('music',1);assert(Math.abs(c.AU.fx.gain.value-.3)<1e-9);assert.equal(c.AU.mus.gain.value,.24);assert.equal(c.AU.master.gain.value,1);
assert(src.includes('cv.connect(AU.fx)'));assert(src.includes('mc.connect(AU.mus)'));assert(src.includes('o.dest===AU.mus?AU.musRev:AU.rev'));assert(src.includes('$(id).hidden=!!player.skills[i].lockedRank'));
console.log('PASS creation budget/refund/name escaping/skill/reload/single grant, passive costs/cap/monster-only XP, independent audio channel gains and wet routing, locked-slot visibility');


const nodes={};c.$=id=>nodes[id]||(nodes[id]={hidden:false,querySelector:()=>({textContent:''})});c.skillTips=()=>{};c.refreshKeyLabels=()=>{};vm.runInContext(extract('showG'),c);c.player.skills=Array.from({length:7},(_,i)=>({n:'slot'+i,empty:i!==0,lockedRank:i!==0?'E':null}));c.showG();assert(nodes.bR.hidden);c.player.skills[1]={n:'Espaço vazio',empty:true};c.showG();assert(!nodes.bR.hidden);assert(nodes.bT.hidden);console.log('PASS locked slots disappear and newly unlocked empty slots reappear');
