const fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const root=process.cwd();const server=http.createServer((req,res)=>{const f=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(root)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404).end();return}res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.glb':'model/gltf-binary','.png':'image/png'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res)});await new Promise(r=>server.listen(8469,'127.0.0.1',r));
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
 page.on('pageerror',e=>{if(!e.stack.includes('at addItems (http://127.0.0.1:8469/tools/deep447.js'))errors.push(e.message);console.log('PAGEERROR',e.stack)});
 page.on('console',m=>{if(m.type()==='warning'&&m.text().includes('OW460')){errors.push(m.text());console.log(m.text())}});
 page.on('response',r=>{if(r.status()>=400)console.log('HTTP',r.status(),r.url())});
 await page.addInitScript(()=>window.PDS_SITE=1);
 await page.goto('http://127.0.0.1:8469/game.html',{waitUntil:'load',timeout:180000});
 await page.waitForFunction(()=>typeof ENV!=='undefined'&&ENV.ok&&window.OW460,{timeout:180000});
 console.log('Loaded game');
 await page.evaluate(()=>{profile=pickAwaken(0);store.set('pds2_profile',profile);startGame()});
 await page.waitForFunction(()=>typeof started!=='undefined'&&started,{timeout:180000});
 await page.evaluate(()=>{profile.creationPending91=false;closeModal();paused=true;player.dead=false;player.hp=player.maxhp;window.proofs469=[];window.check469=(ok,label)=>{if(!ok)throw Error(label);proofs469.push(label)};window.g469={id:99469,seed:8469,rank:0,red:false,expType:'standard',x:0,z:100,life:1000,aff:[]};buildDungeon(g469);paused=true;L.ow460.cine=null;L.ow460.arrival=null;});
 await page.waitForFunction(()=>[...new Set([...L.ow460.solidHash.values()].flat())].some(c=>c.prop357?.endsWith('.glb')),{timeout:60000});
 console.log(await page.evaluate(()=>{
  const s=L.ow460, b=bossE;check469(!!b,'Sovereign spawned');const d=Math.hypot(player.x-b.x,player.z-b.z);check469(d>=180&&d<=290,'Initial sovereign 190–280m');
  OW460.guide(.1);check469(s.beam469&&s.beam469.parent===L.group,'In-world sovereign beam');check469(s.exitBeam469&&!s.exit.locked,'Normal return resonance');
  const colliders=[...new Set([...s.solidHash.values()].flat())];check469(colliders.length>100,'Streamed solid objects registered');check469(colliders.some(c=>c.prop357?.endsWith('.glb')),'GLB crystals have collision');
  const c=colliders.find(c=>{const y=terrH(c.anchorX357??c.x,c.anchorZ357??c.z)+c.h+.1;return c.h>.3&&c.h<1&&/rock/.test(c.prop357)&&worldFree(c.x,c.z,.05,y)&&crystalFree126(c.x,c.z,.05)});check469(!!c,'Low rock available');
  player.x=c.x;player.z=c.z;player.jy=0;COLY344=0;check469(!freeAt(c.x,c.z,.4),'Rock blocks horizontal movement');
  const h=terrH(c.anchorX357??c.x,c.anchorZ357??c.z)+c.h-terrH(c.x,c.z);check469(floor344(c.x,c.z,h+.01)>=h-.01,'Rock surface matches terrain height');
  player.jy=h+.1;COLY344=player.jy;check469(freeAt(c.x,c.z,.05),'Can pass above low rock');COLY344=0;player.jy=h+.1;player.jvy=-2;stepVertical357(player,.1);check469(Math.abs(player.jy-h)<.02,'Jump lands on rock top');
  // Deliberately choose empty ground for the movement check.
  player.x=s.entry.x;player.z=s.entry.z;player.jy=0;const x0=player.x;moveEnt(player,1,0);check469(player.x>x0+.8,'Walking still works');
  // Move far away without fighting, with a recorded exploration direction.
  player.x=b.x+900;player.z=b.z;s.heading469={x:1,z:0};s.lastPlayer469={x:player.x,z:player.z};
  for(let k=0;k<20;k++)OW460.guide(.1);
  check469(Math.hypot(b.x-player.x,b.z-player.z)>=150&&Math.hypot(b.x-player.x,b.z-player.z)<=300,'Elastic relocation within range');check469(b.x>player.x,'Relocation ahead of travel');
  b.aggro=true;OW460.guide(.1);b.aggro=false;const bx=b.x,bz=b.z;player.x+=1000;
  for(let k=0;k<120;k++)OW460.guide(.1);
  check469(b.x===bx&&b.z===bz,'No relocation after combat, even after losing aggro');
  // Unload streamed collision, then revisit deterministically.
  const old=s.chunks.values().next().value, oldCols=(old.grp.userData.solids469||[]).map(v=>v.c);OW460.tick(.3);
  check469(oldCols.every(c=>![...s.solidHash.values()].some(a=>a.includes(c))),'Unloaded chunk leaves no ghost colliders');
  return proofs469;
 }));
 // Red gate, death/exit, hunt and objective variants.
 for(const variant of ['standard','hunt','combat','core','floors','rupture']){
  await page.evaluate(v=>{clearLevel();buildDungeon({...g469,id:99470,seed:8469,red:true,expType:v});paused=true;L.ow460.cine=null;L.ow460.arrival=null;},variant);
  await page.waitForTimeout(300);
  console.log(await page.evaluate(v=>{
   const s=L.ow460;OW460.guide(.1);check469(s.exit.locked,v+': red exit locked');
   if(v==='combat'){check469(!s.beam469,'Combat: no misleading sovereign beam before spawn');for(const e of L.combat117.targets)e.dead=true;updateCombat117();OW460.guide(.1);check469(!!s.beam469,'Combat: beam after sovereign spawn');}
   if(v==='core')check469(!!s.beam469,'Core: guide points at objective');
   if(v==='hunt'){const b=bossE;b.aggro=false;player.x=b.x+800;player.z=b.z;for(let k=0;k<15;k++)OW460.guide(.1);check469(Math.hypot(b.x-player.x,b.z-player.z)<300,'Hunt: elastic sovereign');}
   L.bossDead=true;unlockDungeonExit();OW460.guide(.1);check469(!s.exit.locked&&L.exits.some(e=>e.ow460==='boss'),v+': victory unlocks both exits');
   return v+' passed';
  },variant));
 }
 await page.evaluate(()=>{buildDungeon({...g469,seed:8469});paused=true;L.ow460.cine=null;L.ow460.arrival=null;OW460.guide(.1);player.m.root.position.set(player.x,0,player.z);camera.position.set(player.x,terrH(player.x,player.z)+6,player.z+12);camera.lookAt(bossE.x,terrH(bossE.x,bossE.z)+35,bossE.z);renderer.render(scene,camera)});
 await page.screenshot({path:'proof-fendas469.png'});
 await page.evaluate(()=>{Surv437.open();document.querySelector('#mb details').open=true});await page.screenshot({path:'proof-suprimentos469.png'});
 await page.evaluate(()=>{closeModal();statusView()});await page.screenshot({path:'proof-status469.png'});
 await page.evaluate(()=>{closeModal();buildWorld();paused=true;check469(!L.ow460,'Return restores world collision');player.dead=false;player.hp=player.maxhp;attack();});
 assert.equal(errors.length,0,errors.join('\n'));
 fs.writeFileSync('proof-results469.json',JSON.stringify({checks:await page.evaluate(()=>proofs469),errors},null,2));console.log('ALL_BROWSER469_CHECKS_PASSED');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1)});
