const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.html','utf8');
function extract(n){const m=new RegExp('function\\s+'+n+'\\s*\\([^)]*\\)').exec(src);assert(m,n);let b=src.indexOf('{',m.index),d=0,q=null,e=false;for(let i=b;i<src.length;i++){let c=src[i];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c===q)q=null;continue}if(c==='"'||c==="'"||c==='`'){q=c;continue}if(c==='{')d++;if(c==='}'&&!--d)return src.slice(m.index,i+1)}}
const c={classSlotCount:()=>6,rankTalentRows:()=>'',rankTrialReady:()=>true,rankPortalCount:()=>10,profile:{},run:{},row:(...a)=>a.join(' '),btn:(...a)=>a.join(' ')};vm.createContext(c);
vm.runInContext(src.slice(src.indexOf('const RANKS='),src.indexOf('const S='))+src.slice(src.indexOf('const GR='),src.indexOf('const ELIX='))+src.slice(src.indexOf('const MAIN_ACTS='),src.indexOf('function finishTowerStory')),c);
for(const n of ['migrateRankProfile','migrateRankRun','newRun','rankTab','itemAtk','cryUp','spendCry'])vm.runInContext(extract(n),c);
assert.equal(vm.runInContext('RANKS.map(r=>r.id).join(",")',c),'F,E,D,C,B,A,S,SS,SS+,★');
assert(vm.runInContext('TOPR===8 && RANKS[9].secret && !RANKS[8].secret && GR[8].lvl===220 && GR[9].lvl===260',c));
for(const a of ['RANKS','GR','WATK','AHPV','AARM','PRICE','CORE_P','CRY_P','HIRE','TIERN','WBON','ADEF'])assert.equal(vm.runInContext(a+'.length',c),10,a);
const p={rank:8,cls:7,owned:[{rank:8}],retired:[{rank:8}]};assert(c.migrateRankProfile(p));assert.equal(p.rank,9);assert.equal(p.cls,7);assert.equal(p.owned[0].rank,9);assert.equal(p.retired[0].rank,9);assert(!c.migrateRankProfile(p));
const r={items:[{tier:8}],equip:{w:{tier:8,slot:'w'},a:{tier:7}},party:[{rank:8}],official:8,res:{core:[1,2,3,4,5,6,7,8,99],cry:[0,0,0,0,0,0,0,0,50]}};
assert(c.migrateRankRun(r));assert.equal(r.items[0].tier,9);assert.equal(r.equip.w.tier,9);assert.equal(r.equip.a.tier,7);assert.equal(r.party[0].rank,9);assert.equal(r.official,9);assert.deepEqual(r.res.core,[1,2,3,4,5,6,7,8,0,99]);const once=JSON.stringify(r);assert(!c.migrateRankRun(r));assert.equal(JSON.stringify(r),once);
c.gearQ=()=>1;assert.equal(c.itemAtk(r.equip.w),850);c.run=r;assert.equal(c.cryUp(8),50);c.spendCry(8,20);assert.equal(r.res.cry[9],30);
const newer={rankSchema:78,rank:8};assert(!c.migrateRankProfile(newer));assert.equal(newer.rank,8);c.newRun();assert.equal(c.run.res.core.length,10);assert(!c.migrateRankRun(c.run));
c.run.level=220;c.profile={rank:7};assert(c.rankTab().includes('Prova para o rank SS+'));c.profile={rank:8};assert(!c.rankTab().includes('Prova para o rank ★'));c.profile=p;assert(c.rankTab().includes('★'));
console.log('PASS rank sequence, separate rare unlock, legacy save migration, idempotence, stats, resources, new SS+ save, final rank screens');
