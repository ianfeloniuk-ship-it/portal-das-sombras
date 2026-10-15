/* Behavioral regression test for Reclaim372 (browser-independent THREE fakes). */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const changes = [];
const obj = () => ({position:{x:0,y:0,z:0,set(x,y,z){this.x=x;this.y=y;this.z=z;}},rotation:{x:0,y:0,z:0},scale:{x:1,setScalar(v){this.x=this.y=this.z=v;}},visible:true,add(){},remove(){}});
class Group {constructor(){Object.assign(this,obj());this.children=[];this.userData={};this.parent=null;}add(x){this.children.push(x);x.parent=this;}remove(x){this.children=this.children.filter(y=>y!==x);if(x)x.parent=null;}}
class Mesh extends Group {constructor(g,m){super();this.geometry=g;this.material=m;}}
const THREE={Group,Mesh,DoubleSide:2,OctahedronGeometry:class{dispose(){changes.push('geometry');}},MeshStandardMaterial:class{dispose(){changes.push('material');}},SkeletonUtils:{clone(x){return x;}}};
const removed=[];const context={window:{},THREE,ARCH242:{g:{}},scene:{remove(x){removed.push(x);}},saveRun(){},console,L:{}};context.window=context;
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'reclaim372.js'),'utf8'),context,{filename:'reclaim372.js'});
const R=context.Reclaim372,fail=m=>{throw new Error(m)},ok=(v,m)=>v||fail(m),node=()=>obj();
const job={root:new Group(),body:node(),portal:node(),hand:node(),particles:[node(),node()],scale:2,sky:9,owned:[],geo:[],mats:[],baseScale:1,t:0,revealed:false,a:{root:new Group(),marker:node(),inter:{hidden:true}},r:{introCrystal402:true},intro:true};job.root.parent={};job.a.root.parent={};
R.apply(job,0);ok(job.hand.position.y===9,'hand begins above the scene');const before=job.body.position.y;
R.apply(job,2);ok(Math.abs(job.hand.position.y-1.7)<.01,'hand reaches contact at two seconds');ok(job.body.position.y===before,'body remains still before grip');
R.apply(job,4);ok(job.body.position.y>before,'body rises with hand after contact');ok(!job.revealed,'crystal is not revealed before final phase');
R.apply(job,5.2);ok(job.revealed,'crystal reveal gate opens after 5.15 seconds');R.attachCrystal(job.a,job.r);const crystalCount=R.crystals.size;ok(crystalCount===1,'one crystal is registered for the residue');R.attachCrystal(job.a,job.r);ok(R.crystals.size===crystalCount,'repeated crystal attach is idempotent');
R.jobs.push(job);R.tick(5.9);ok(R.jobs.length===1,'job remains active before six seconds');R.tick(.2);ok(R.jobs.length===0,'job is disposed after six seconds');ok(removed.includes(job.root),'job root is removed on dispose');R.clear();
context.ARCH242.g=null;let resolveReady;context.ARCH242.ready=new Promise(resolve=>{resolveReady=resolve});const pendingA={model:{root:new Group()},root:new Group(),marker:node(),inter:{hidden:true}};pendingA.root.parent={};ok(R.start(pendingA,{x:0,z:0,introCrystal402:true})===null,'readiness defers start');ok(R.pending.size===1,'pending readiness is tracked');R.clear();ok(R.pending.size===0&&!pendingA.waiting402,'clear cancels pending start');resolveReady(true);
(async()=>{
 await new Promise(setImmediate);ok(R.jobs.length===0,'resolved callback cannot restart after clear');
 const failed={model:{root:new Group()},root:new Group(),marker:node(),inter:{hidden:false}};failed.root.parent={};context.ARCH242.ready=Promise.resolve(false);
 R.start(failed,{x:0,z:0,introCrystal402:true});ok(failed.inter.hidden,'pending intro blocks corpse interaction');await new Promise(setImmediate);
 ok(failed.failed402&&!failed.waiting402&&R.pending.size===0&&!failed.inter.hidden,'failed model releases interaction without endless retries');
 ok(R.start(failed,{introCrystal402:true})===null&&R.pending.size===0,'failed model is not requested again');
 const occupied={intro:false,t:2,bodies:[{},{},{},{}],r:{x:0,z:0}};R.jobs.push(occupied);
 ok(R.start({model:{}},{x:0,z:0})===null&&R.jobs.length===1,'regular overflow cannot create a second job');R.jobs.length=0;
 ok(changes.includes('geometry')&&changes.includes('material'),'crystal resources were disposed');
 console.log('reclaim402 behavioral regression passed');
})().catch(e=>{console.error(e);process.exitCode=1});
