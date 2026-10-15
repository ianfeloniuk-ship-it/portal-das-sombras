/* Behavioral readiness checks for V405. */
'use strict';
const fs=require('fs'),vm=require('vm');
const root=__dirname+'/..', source=fs.readFileSync(root+'/tools/warrior-player127.js','utf8');
function check(v,m){if(!v)throw Error(m);console.log('ok - '+m)}
function harness(query=''){
  const calls=[],pending=[]; class Loader{load(url,onLoad,onProgress,onError){calls.push(url);pending.push({url,onLoad,onError});}}
  const T={GLTFLoader:Loader,SkeletonUtils:{},Vector3:class{},Quaternion:class{},Matrix4:class{},Euler:class{},Box3:class{},Color:class{},Group:class{},MeshBasicMaterial:class{}};
  const ctx={console:{warn(){}},THREE:T,MeshoptDecoder:null,URLSearchParams,location:{search:query},performance:{now:()=>0},window:null};ctx.window=ctx;
  vm.runInNewContext(source,ctx,{filename:'warrior-player127.js'});
  function resolve(url,ok=true){const i=pending.findIndex(p=>p.url===url);if(i<0)throw Error('pending URL missing: '+url);const p=pending.splice(i,1)[0];if(!ok)return p.onError?.(Error('fail'));if(url.includes('anim'))p.onLoad({scene:{},animations:[{name:'idle'}]});else p.onLoad({scene:{}})}
  return {api:ctx.Warrior127,calls,pending,resolve};
}
async function main(){
 {const h=harness();h.api.load('models/viajante153.glb');h.resolve('models/viajante153.glb');const ready=h.api.prepare();check(h.calls.some(x=>x.includes('anim-viajante155')),'prepare requests animations after model preload');check(h.calls.some(x=>x.includes('arco-arqueiro')),'prepare requests bow after model preload');check(h.api.settled&&!h.api.readySettled,'model settled does not mean prepared');h.resolve('models/anim-viajante155.glb?v=374');await new Promise(r=>setImmediate(r));check(h.api.animsSettled&&!h.api.bowSettled&&!h.api.readySettled,'ready waits for bow after animations');h.resolve('models/armas155/arco-arqueiro.glb');await ready;check(h.api.readySettled,'prepare settles after all assets');}
 {const h=harness();const a=h.api.prepare(),b=h.api.prepare(),c=h.api.loadAnims('models/anim-viajante155.glb?v=374'),d=h.api.loadBow('models/armas155/arco-arqueiro.glb');check(a===b,'concurrent prepare shares promise');const relevant=h.calls.filter(x=>/viajante153|anim-viajante155|anims\.glb|arco-arqueiro/.test(x));check(relevant.length===3,'model, animations and bow each fetched once');h.resolve('models/viajante153.glb');h.resolve('models/anim-viajante155.glb?v=374');h.resolve('models/armas155/arco-arqueiro.glb');await a;check(h.api.readySettled,'concurrent preparation resolves');}
 {const h=harness();const p=h.api.prepare();h.resolve('models/viajante153.glb',false);h.resolve('models/anim-viajante155.glb?v=374',false);h.resolve('models/armas155/arco-arqueiro.glb',false);await p;check(h.api.readySettled,'failed assets settle without deadlock');}
 {const h=harness('?semAnim155');const p=h.api.prepare();check(!h.calls.some(x=>x.includes('anim-viajante155')),'semAnim155 skips animation request');h.resolve('models/viajante153.glb');h.resolve('models/armas155/arco-arqueiro.glb');await p;}
 {const h=harness('?animKay&guerreiroAntigo');const p=h.api.prepare();check(h.calls.includes('models/guerreiro-rig127.glb'),'guerreiroAntigo selects legacy model');check(h.calls.includes('models/anims.glb'),'animKay selects KayKit animation');h.resolve('models/guerreiro-rig127.glb');h.resolve('models/anims.glb');h.resolve('models/armas155/arco-arqueiro.glb');await p;}
 // Execute the production boot gate with only world construction replaced by a counter.
 {const text=fs.readFileSync(root+'/src/core/640-telas.js','utf8');
  const a=text.indexOf('let playerAssetsReady405='),b=text.indexOf("$('title').hidden=true;",a);
  check(a>=0&&b>a,'production gate is present');
  const gate=text.slice(a,b)+"starts++;started=true;}";
  let prepareResolve,projResolve,prepareCalls=0,projCalls=0;
  const go={disabled:false,textContent:''};
  const c={window:{WARRIOR127_ENABLE:true},profile:{cls:0},location:{search:''},started:false,starts:0,MODELS:{done:true},$:()=>go,console,Promise};
  c.Warrior127=c.window.Warrior127={settled:true,prepare:()=>{prepareCalls++;return new Promise(r=>prepareResolve=r)}};
  c.Proj155=c.window.Proj155={load:()=>{projCalls++;return new Promise(r=>projResolve=r)}};
  vm.runInNewContext(gate,c);c.startGame();c.startGame();
  check(c.starts===0&&go.disabled&&prepareCalls===1&&projCalls===0,'preloaded model still waits once for prepare');
  prepareResolve();await new Promise(r=>setImmediate(r));c.startGame();
  check(c.starts===0&&go.disabled&&projCalls===1,'game waits once for projectiles');
  projResolve();await new Promise(r=>setImmediate(r));
  check(c.starts===1&&c.started&&!go.disabled,'world initializes once after all readiness');
  c.startGame();check(c.starts===1&&prepareCalls===1&&projCalls===1,'repeated start cannot initialize twice');}
 console.log('readiness405 behavioral checks passed');
}
let timeout;Promise.race([main(),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(Error('readiness deadlock')),2000)})]).catch(e=>{console.error(e.stack||e);process.exitCode=1}).finally(()=>clearTimeout(timeout));
