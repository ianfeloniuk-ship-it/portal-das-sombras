const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.html','utf8'),base=fs.readFileSync(__dirname+'/verify-v95.cjs','utf8');eval(base.slice(base.indexOf('function extract('),base.indexOf('const notes=')).replace("src.indexOf('{',m.index)","src.indexOf('{',m.index+m[0].length)"));
const noop=()=>{},c={Math,run:{level:17,spts:3,skl:{A:8}},FX2:{inv:0},player:{x:0,z:0,r:.5,iT:0,dodgeT:0},los:()=>true,bigText:noop,paused:false,input:{x:1,z:0},keys:{},pcCam:{yaw:0},dodgeCdVal:()=>1,sfx:noop,dprog:noop,demandBreak:noop};vm.createContext(c);
for(const n of ['migrateSkillPoints113','bossMechanics113','inversionHit113','dodge'])vm.runInContext(extract(n),c);
assert.equal(c.migrateSkillPoints113(),13);assert.equal(c.run.spts,16);assert.equal(c.run.skl.A,8);assert.equal(c.migrateSkillPoints113(),0);c.run.level=1;c.run.spts=0;assert.equal(c.migrateSkillPoints113(),0);
for(let lv=1;lv<=500;lv++){c.run={level:lv,spts:Math.floor(lv/5)};c.migrateSkillPoints113();assert.equal(c.run.spts,lv-1)}
assert(!c.bossMechanics113({type:'fury'}).includes('inverte'));assert(!c.bossMechanics113({types:['seismic','soulrain']}).includes('inverte'));assert(c.bossMechanics113({type:'soulrain'}).includes('inverte'));
const h={x:0,z:0,r:2.5,owner:{}};assert(c.inversionHit113(h));c.FX2.inv=0;c.player.iT=.2;assert(!c.inversionHit113(h));c.player.iT=0;c.player.dodgeT=.1;assert(!c.inversionHit113(h));c.player.dodgeT=0;c.player.x=10;assert(!c.inversionHit113(h));c.player.x=0;c.los=()=>false;assert(!c.inversionHit113(h));c.los=()=>true;h.owner.dead=true;assert(!c.inversionHit113(h));h.owner.dead=false;
c.FX2.inv=3;c.dodge();assert.equal(c.player.dir.x,-1);c.FX2.inv=0;assert.equal(c.player.dir.x,-1);c.player.dodgeCd=0;c.dodge();assert.equal(c.player.dir.x,1);
Object.assign(c,{L:{mode:'dungeon',gate:{rank:0}},enemies:[],toast:noop,closeModal:noop,saveRun:noop,narratorEvent105:noop,expReward:noop,expSpawn:(x,z,n,tag)=>c.enemies.push({expTag:tag}),expHazard:noop,expStage:()=>0});
vm.runInContext("const EXP_MATS={ore:{w:1},core:{w:2},heart:{w:3}}",c);
for(const n of ['expCargoWeight','expNear','expAction','expFinishChallenge','expeditionUpdate','expeditionObjective'])vm.runInContext(extract(n),c);
c.L.expedition={s:{type:'extract',cargo:['heart','heart'],sent:0,instability:0},nodes:[{kind:'beacon',index:0,x:0,z:0,r:3,room:0}],timer:99};
assert(c.expAction('beacon',0,'send'));c.expeditionUpdate(12);assert.equal(c.L.expedition.s.sent,0);c.enemies[0].dead=true;c.player.x=20;c.expeditionUpdate(.1);assert.equal(c.L.expedition.challenge.t,0);c.player.x=0;c.expeditionUpdate(12);assert.equal(c.L.expedition.s.sent,6);assert(c.L.expedition.s.completed);assert(c.L.bossDead);assert.equal(c.L.expedition.challenge,null);assert.equal(c.L.expedition.s.cargo.length,0);assert(c.expeditionObjective().includes('sair'));
assert(extract('gainXp').includes('run.spts=(run.spts||0)+1'));assert(!extract('gainXp').includes('if(run.level%5===0)run.spts'));
console.log('PASS retroactive points 1–500 and idempotency; caster pool; inversion collision, walls, death, dodge immunity/direction; extraction send timer, enemies, reset, payout and completion.');
