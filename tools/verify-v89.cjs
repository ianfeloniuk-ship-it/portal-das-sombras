const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.html','utf8');
function extract(n){const m=new RegExp('function\\s+'+n+'\\s*\\([^)]*\\)').exec(src);assert(m,n);let b=src.indexOf('{',m.index),d=0,q=null,e=false;for(let i=b;i<src.length;i++){let c=src[i];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c===q)q=null;continue}if(c==='"'||c==="'"||c==='`'){q=c;continue}if(c==='{')d++;if(c==='}'&&!--d)return src.slice(m.index,i+1)}}





const notices=[];let refreshes=0;const c={profile:{ach:['hunter','sov'],titles:['hunter','sov'],rank:9},run:{kills:100,shadows:[],level:1,gold:0},L:{},player:{dead:false},store:{set(){}},toast:m=>notices.push(m),sfx(){},refreshStats(){refreshes++},row:(a,b,d)=>a+b+d,btn:()=>'',view:null,openModal(){}};vm.createContext(c);
vm.runInContext(src.slice(src.indexOf('const TITLES='),src.indexOf('function checkTitles()')),c);vm.runInContext(extract('checkTitles'),c);
const tracks=vm.runInContext('TITLE_TRACKS',c),hunt=tracks[0],portal=tracks[1],tower=tracks[2],village=tracks[3];
c.checkTitles();assert.equal(c.titleLevel(hunt),1);assert(c.profile.ach.includes(hunt.id));assert.equal(c.titleB().dmg,.1);assert.equal(c.titleB().hp,.1);assert(!c.titleB().hunt);c.profile.titles.push(hunt.id);assert.equal(c.titleB().hunt,c.titleGain(1));
const before=notices.length;c.checkTitles();assert.equal(notices.length,before);c.run.kills=300;c.checkTitles();assert.equal(c.titleLevel(hunt),2);assert.equal(refreshes,1);assert.equal(c.profile.ach.filter(x=>x===hunt.id).length,1);
c.run.kills=0;c.checkTitles();assert.equal(c.titleLevel(hunt),2);c.profile=JSON.parse(JSON.stringify(c.profile));assert.equal(c.titleLevel(hunt),2);
c.profile.closedPortalsByRank={1:2,2:3};c.profile.towerBest=30;c.profile.sieges=3;c.checkTitles();assert.equal(c.titleLevel(portal),1);assert.equal(c.titleLevel(tower),2);assert.equal(c.titleLevel(village),2);c.profile.titles=[hunt.id,portal.id,tower.id,village.id];assert(c.titleB().hp>0);assert.equal(c.titleHitBonus({}),c.titleGain(2));assert.equal(c.titleHitBonus({isBoss:true}),c.titleGain(1));c.L.special={kind:'tower'};assert.equal(c.titleHitBonus({}),c.titleGain(2)*2);
c.profile.titles=[];assert.equal(c.titleHitBonus({isBoss:true}),0);assert.equal(c.titleB().hp,undefined);
for(const n of [1,2,10,100,100000]){c.profile.titleProgress[hunt.id]=c.titleGoal(hunt,n);assert.equal(c.titleLevel(hunt),n);assert(c.titleGain(n)>0&&c.titleGain(n)<.1);assert(c.titleGain(n+1)>c.titleGain(n))}
assert(c.titleGain(11)-c.titleGain(10)<c.titleGain(2)-c.titleGain(1));assert(c.titleTrackRows().includes('Próximo nível:'));assert(c.titleTrackRows().includes('<progress'));assert(src.includes('if(o.fromPlayer)amt*=1+titleHitBonus(e)'));assert(src.includes('profile.titleKills=Math.max(profile.titleKills||0,run.kills||0)+1'));
console.log('PASS legacy title effects, migration from available counters, milestones, persistent high-water progress, no duplicate unlock, equipped-only bonuses, refresh on level-up, combat context, save roundtrip, 100000 levels and diminishing gains');
