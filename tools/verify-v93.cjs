const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.html','utf8');
function extract(n){const m=new RegExp('function\\s+'+n+'\\s*\\([^)]*\\)').exec(src);assert(m,n);let b=src.indexOf('{',m.index),d=0,q=null,e=false;for(let i=b;i<src.length;i++){let c=src[i];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c===q)q=null;continue}if(c==='"'||c==="'"||c==='`'){q=c;continue}if(c==='{')d++;if(c==='}'&&!--d)return src.slice(m.index,i+1)}}







const played=[],notes=[],messages=[];const c={CFG:{readySounds:true,slotSounds:[1,2,3,4,5,6,7,8],effects:1},player:{dead:false,x:0,z:0,skills:[{cdT:0},{cdT:2}]},run:{},AU:{ctx:{currentTime:10},on:true},tone:(...a)=>notes.push(a),audioInit(){},store:{set(){}},profile:{tips93:{}},modalOpen:false,enemies:[],touch:false,keyOf:k=>k,keyLabel:k=>k,canUseMagicStyle:()=>false,nearestCity:()=>({d:0}),L:{mode:'world'},toast:s=>messages.push(s)};vm.createContext(c);
vm.runInContext(src.slice(src.indexOf('const CUE_NAMES='),src.indexOf('function playReadySound')),c);
vm.runInContext('let tutorialDelay93=12;',c);
for(const n of ['playReadySound','updateReadySounds','setReadySounds','setSlotSound','tutorialTick93'])vm.runInContext(extract(n),c);
const actual=c.playReadySound;c.playReadySound=id=>played.push(id);c.updateReadySounds();assert.equal(played.length,0);c.player.skills[1].cdT=0;c.updateReadySounds();assert.deepEqual(played,[2]);c.updateReadySounds();assert.equal(played.length,1);
c.player.skills[0].cdT=3;c.updateReadySounds();c.player.skills[0].cdT=0;c.updateReadySounds();assert.deepEqual(played,[2,1]);c.player.skills[0]={cdT:0};c.updateReadySounds();assert.equal(played.length,2);
c.setReadySounds(false);c.player.skills[0].cdT=1;c.updateReadySounds();c.player.skills[0].cdT=0;c.updateReadySounds();c.setReadySounds(true);c.updateReadySounds();assert.equal(played.length,2);
c.playReadySound=actual;c.playReadySound(1);assert.equal(notes.length,1);c.CFG.effects=0;c.playReadySound(2);assert.equal(notes.length,1);c.CFG.effects=1;c.AU.on=false;c.playReadySound(3);assert.equal(notes.length,1);c.AU.on=true;c.setSlotSound(0,6);assert.equal(c.CFG.slotSounds[0],6);assert.equal(notes.length,4);c.setSlotSound(0,99);assert.equal(c.CFG.slotSounds[0],6);
c.tutorialTick93(11);assert.equal(messages.length,0);c.modalOpen=true;c.tutorialTick93(20);assert.equal(messages.length,0);c.modalOpen=false;c.tutorialTick93(1);assert.equal(messages.length,1);c.enemies=[{x:2,z:0,dead:false}];c.tutorialTick93(24);assert.equal(messages.length,1);c.tutorialTick93(1);assert.equal(messages.length,2);c.tutorialTick93(30);assert.equal(messages.length,2);assert(c.profile.tips93.combat);assert(!extract('tutorial').includes('setTimeout'));
console.log('PASS one cue per cooldown, no initial/swap/enable false alarms, mute/effects routing, persisted slot selection, contextual spaced hints paused in menus');
