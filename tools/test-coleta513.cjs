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
 const result=await page.evaluate(()=>{
 const out=[],ok=(v,m)=>{if(!v)throw Error(m);out.push(m)};
 Loot353.clear();L.inter=[];run.worldLoot353=[];L.mode='world';player.x=1000;player.z=1000;player.dead=false;profile.classless=false;
 const common=spawnKind('goblin',1001,1000,0);common.dead=true;common.loot353=[{id:'core513',type:'core',rank:0,n:2},{id:'skin513',type:'material',name:'Pele',n:1,value:5}];Loot353.create(common);const r=Loot353.records().find(r=>r.id===common.corpse353);ok(!r.boss513,'common metadata');
 Loot353.tick(1.5);ok(r.reclaimed372&&!Loot353.active.get(r.id).model,'common body disappears');ok(!Reclaim372.jobs.length&&!Reclaim372.pending.size,'common never summons hand');ok(!Loot353.active.get(r.id).inter.hidden,'common crystal accessible');ok(Reclaim372.crystals.size===1,'common crystal visible');
 Loot353.open(r.id);ok(!!document.querySelector('.loot513-stage canvas'),'3D collection stage');ok(document.querySelector('.loot513-stage').dataset.ready==='true','resource preview rendered');ok(paused,'loot pauses game');
 window.qa513={r,id:r.id};return out;
 });console.log(result);
 await page.screenshot({path:'coleta513-desktop.png'});
 const before=await page.locator('.loot513-stage').getAttribute('data-angle');await page.getByRole('button',{name:'Girar para a direita',exact:true}).click();const after=await page.locator('.loot513-stage').getAttribute('data-angle');assert.notEqual(before,after);console.log('rotation button works');
 await page.locator('.loot513-stage').focus();await page.keyboard.press('ArrowLeft');assert.notEqual(after,await page.locator('.loot513-stage').getAttribute('data-angle'));console.log('keyboard rotation works');
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(300);await page.screenshot({path:'coleta513-mobile.png'});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));console.log('mobile no horizontal overflow');
 const more=await page.evaluate(async()=>{
 const out=[],ok=(v,m)=>{if(!v)throw Error(m);out.push(m)};
 const id=qa513.id,before=run.res.core[0]||0;ok(Loot353.take(id,'core513'),'take selected resource');ok(run.res.core[0]===before+2,'resource credited once');ok(!Loot353.take(id,'core513'),'duplicate take blocked');Loot353.open(id);ok(document.querySelector('.loot513-info h3').textContent==='Cristal de saque','container preview for other drops');
 closeModal();await Promise.resolve();ok(!Loot513.active,'renderer disposed on close');
 const a=Loot353.active.get(id),rec=Loot353.records().find(r=>r.id===id);ok(Reclaim372.start(a,rec)===null,'direct hand request rejects common');
 Loot353.tick(10);ok(!Loot353.records().some(r=>r.id===id),'crystal expires');Reclaim372.tick(0);ok(Reclaim372.crystals.size===0,'expired crystal disposed');
 // Reattach persisted records without spawning a duplicate corpse.
 const old={id:'persist513',x:1000,z:1000,name:'Antigo',kind:'goblin',reclaimed372:true,crystal402:true,crystalLife402:6,entries:[{id:'c',type:'core',rank:1,n:1}]};run.worldLoot353.push(old);Loot353.tick(.5);ok(!!Loot353.active.get(old.id),'persisted residue restored');ok(!Loot353.active.get(old.id).model,'persisted corpse stays removed');
 // Boss start must leave the crystal interactive throughout the hand animation.
 Loot353.clear();run.worldLoot353=[];
 const b=spawnKind('goblin',1001,1000,0);b.isBoss=true;b.dead=true;b.loot353=[{id:'bossCore',type:'core',rank:2,n:3}];Loot353.create(b);const br=Loot353.records().find(r=>r.id===b.corpse353);ok(br.boss513,'boss metadata persists');
 await ARCH242.ready;const job=Reclaim372.start(Loot353.active.get(br.id),br);ok(!!job,'boss summons hand');ok(!Loot353.active.get(br.id).inter.hidden,'boss crystal accessible during hand');Loot353.open(br.id);ok(document.querySelector('.loot513-stage').dataset.ready==='true','boss loot opens during hand');closeModal();
 const b2=spawnKind('goblin',1002,1000,0);b2.isBoss=true;b2.dead=true;b2.loot353=[{id:'joinedCore',type:'core',rank:2,n:1}];Loot353.create(b2);const br2=Loot353.records().find(r=>r.id===b2.corpse353);ok(Reclaim372.start(Loot353.active.get(br2.id),br2)===job,'nearby boss joins hand');ok(!Loot353.active.get(br2.id).inter.hidden,'joined boss crystal accessible immediately');
 Reclaim372.tick(6);ok(!Reclaim372.jobs.length,'boss hand completes');
 const piece={...br,boss513:true,archPiece464:true};ok(Reclaim372.start({},piece)===null,'Architect parts excluded');
 Loot353.clear();run.worldLoot353=[];const t=spawnKind('goblin',1001,1000,0);t.dead=true;t.isIntroTutorial=true;t.loot353=[{id:'t',type:'core',rank:0,n:1}];Loot353.create(t);ok(Reclaim372.claimEnemy(t),'tutorial leaves crystal');ok(!Reclaim372.jobs.length&&!Reclaim372.pending.size,'tutorial has no hand cinematic');
 ok(!Intro401.reclaiming(),'tutorial camera/input unlocked');
 return out;
 });console.log(more);
 // Neighboring gameplay: real movement, basic attack, and status modal.
 const neighbor=await page.evaluate(()=>{closeModal();paused=false;const old=player.x;player.x+=.2;frame(performance.now()+16);const moved=player.x!==old;try{attack()}catch(e){return {moved,attackError:e.message}}statusView();return {moved,modal:!$('modal').hidden}});console.log('neighbor',neighbor);
 fs.writeFileSync('qa513-results.json',JSON.stringify({checks:[...result,...more],rotation:true,mobile:true,neighbor,errors},null,2));assert.equal(errors.length,0,'page errors');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exit(1)});

