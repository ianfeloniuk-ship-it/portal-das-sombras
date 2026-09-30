const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.html','utf8');
function extract(n){const m=new RegExp('function\\s+'+n+'\\s*\\([^)]*\\)').exec(src);assert(m,n);let b=src.indexOf('{',m.index),d=0,q=null,e=false;for(let i=b;i<src.length;i++){let c=src[i];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c===q)q=null;continue}if(c==='"'||c==="'"||c==='`'){q=c;continue}if(c==='{')d++;if(c==='}'&&!--d)return src.slice(m.index,i+1)}}






let uid=0,saves=0;const c={profile:{},run:{},PRICE:[150],EQUIP_SLOTS:['w','a','h','g','b'],store:{set(){}},toast(){},saveRun(){saves++},refreshStats(){},rankOf:()=>0,equipFactor:s=>['h','g','b'].includes(s)?.2:1,priceMul:()=>1,makeItem:(slot,tier,rar)=>({uid:++uid,slot,tier,rar,name:'Teste'}),addItem:it=>c.run.items.push(it)};vm.createContext(c);Object.assign(c,{fmt:String,TOPR:8,RANKS:Array.from({length:10},(_,i)=>({id:String(i)}))});vm.runInContext(src.slice(src.indexOf('const ORDER_REP_NEED='),src.indexOf('function rankPortalCount')),c);for(const n of ['rankPortalCount','qualifyingRankPortals'])vm.runInContext(extract(n),c);
for(const n of ['pickAwaken','newRun','startFirstEquipment','firstEquipmentObjective','finishFirstEquipment','equipmentShopPrice','equipmentBagRoom','buyEquipment','equipBagItem'])vm.runInContext(extract(n),c);
c.newRun();assert.equal(c.run.gold,60);Object.assign(c.run,{gold:734});assert.equal(c.run.gold,734);c.startFirstEquipment();assert(!c.profile.firstEquipment92);
c.profile=c.pickAwaken(0);c.newRun();assert.equal(c.run.gold,0);c.startFirstEquipment();assert.equal(c.run.trackObj,'firstEquipment');assert.equal(c.run.gold,0);assert(c.firstEquipmentObjective().progress.includes('Etapa 1'));assert(!c.buyEquipment('b',0));assert.equal(c.run.items.length,0);
// Found equipment now completes the tutorial, even above the player's rank.
c.run.items.push({uid:++uid,slot:'w',tier:9,name:'Saque'});assert(c.firstEquipmentObjective().progress.includes('Etapa 2'));c.equipBagItem(uid);assert(c.profile.firstEquipment92.done);assert.equal(c.firstEquipmentObjective(),null);assert(!c.finishFirstEquipment());assert.equal(saves,1);
// Buying is optional, expensive, and still completes only after manual equip.
c.profile.firstEquipment92={done:false};c.run.equip={};c.run.items=[];c.run.gold=340;c.run.trackObj='firstEquipment';assert(c.buyEquipment('b',0));assert.equal(c.run.gold,40);assert(c.firstEquipmentObjective().progress.includes('Etapa 2'));assert(!c.profile.firstEquipment92.done);
c.profile=JSON.parse(JSON.stringify(c.profile));c.run=JSON.parse(JSON.stringify(c.run));c.startFirstEquipment();assert.equal(c.run.gold,40);assert(c.firstEquipmentObjective().progress.includes('Etapa 2'));
c.run.items=[];assert(c.firstEquipmentObjective().progress.includes('Etapa 1'));c.run.gold=340;c.buyEquipment('b',0);const purchased=c.run.items[0];c.equipBagItem(purchased.uid);assert(c.profile.firstEquipment92.done);assert.equal(c.run.gold,40);assert.equal(c.run.trackObj,null);assert.equal(c.firstEquipmentObjective(),null);assert(!c.finishFirstEquipment());assert.equal(saves,2);
c.profile.firstEquipment92.done=false;c.run.trackObj='other';assert(c.finishFirstEquipment());assert.equal(c.run.trackObj,'other');
assert(src.includes('startFirstEquipment();saveRun();tutorial()'));assert(src.includes('finishFirstEquipment();refreshStats()'));
console.log('PASS zero starting gold, legacy balance, quest stages, failed purchase, loot acceptance, sale recovery, persisted purchase, manual equip, unique completion without currency reward');
