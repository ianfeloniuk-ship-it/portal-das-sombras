const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.html','utf8');
function extract(n){const m=new RegExp('function\\s+'+n+'\\s*\\([^)]*\\)').exec(src);assert(m,n);let b=src.indexOf('{',m.index),d=0,q=null,e=false;for(let i=b;i<src.length;i++){let c=src[i];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c===q)q=null;continue}if(c==='"'||c==="'"||c==='`'){q=c;continue}if(c==='{')d++;if(c==='}'&&!--d)return src.slice(m.index,i+1)}}



const c={L:{mode:'world'},player:{x:0,z:0},inCity:()=>true,run:{gold:10,items:[{uid:'test',value:25}]},toast(){},fmt:String};vm.createContext(c);vm.runInContext(extract('sellEquipment'),c);assert(c.sellEquipment('test'));assert.equal(c.run.gold,35);assert.equal(c.run.items.length,0);assert(!c.sellEquipment('test'));assert.equal(c.run.gold,35);c.run.items=[{uid:'other',value:20}];c.L.mode='dungeon';assert(!c.sellEquipment('other'));assert.equal(c.run.items.length,1);c.L.mode='world';c.inCity=()=>false;assert(!c.sellEquipment('other'));assert.equal(c.run.gold,35);
console.log('PASS manual sale, exact gold, no duplicate sale, city restriction, item preservation');
