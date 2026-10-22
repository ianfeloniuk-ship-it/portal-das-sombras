const fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert');
const {chromium}=require('playwright');
(async()=>{
 const root=process.cwd(),server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]==='/'?'/game.html':req.url.split('?')[0]));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404).end();return}res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.json':'application/json','.glb':'model/gltf-binary','.png':'image/png','.webp':'image/webp'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res)});await new Promise(r=>server.listen(8513,'127.0.0.1',r));
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
 try{
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('PAGEERROR',e.message)});
 await page.addInitScript(()=>window.PDS_SITE=1);await page.goto('http://127.0.0.1:8513/game.html',{waitUntil:'load',timeout:180000});await page.waitForTimeout(7000);
 console.log('loaded');
 await page.evaluate(()=>{profile=pickAwaken(0);store.set('pds2_profile',profile);startGame()});await page.waitForFunction(()=>typeof started!=='undefined'&&started,null,{timeout:180000});await page.waitForTimeout(4000);
 await page.evaluate(()=>{profile.creationPending91=false;closeModal();paused=true;window.requestAnimationFrame=()=>0;});
 console.log('started');
 const res=await page.evaluate(async()=>{
 const out=[],ok=(v,m)=>{if(!v)throw Error(m);out.push(m)};
 Loot353.clear();L.inter=[];run.worldLoot353=[];L.mode='world';player.x=1000;player.z=1000;player.dead=false;
 const mk=(x,f)=>{const e=spawnKind('goblin',x,1000,0);e.dead=true;f&&f(e);e.loot353=[{id:'c'+x,type:'core',rank:0,n:1}];Loot353.create(e);return e};
 const c=mk(1001);ok(!Reclaim372.claimEnemy(c)||true,'common claim');Loot353.tick(1.5);ok(!Reclaim372.jobs.length&&!Reclaim372.pending.size,'comum: sem Mão');
 const t=mk(1003,e=>e.isIntroTutorial=true);Reclaim372.claimEnemy(t);Loot353.tick(1.5);ok(!Reclaim372.jobs.length&&!Reclaim372.pending.size,'tutorial: sem Mão');
 const a=mk(1005,e=>e.camp327='a1');Reclaim372.claimEnemy(a);Loot353.tick(1.5);ok(!Reclaim372.jobs.length&&!Reclaim372.pending.size,'a1 comum: sem Mão');
 const b=mk(1007,e=>e.isBoss=true);await ARCH242.ready;Reclaim372.claimEnemy(b);Loot353.tick(.5);ok(Reclaim372.jobs.length+Reclaim372.pending.size>0,'chefe: Mão vem');
 return out;});console.log(res);
 assert.equal(errors.length,0,'page errors');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exit(1)});
