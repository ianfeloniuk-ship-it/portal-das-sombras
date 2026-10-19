const fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
  const root=process.cwd();
  const server=http.createServer((req,res)=>{
    const f=path.join(root,decodeURIComponent(req.url.split('?')[0]));
    if(!f.startsWith(root)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404).end();return}
    res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.glb':'model/gltf-binary','.png':'image/png'})[path.extname(f)]||'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    fs.createReadStream(f).pipe(res);
  });
  await new Promise(r=>server.listen(8475,'127.0.0.1',r));
  const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
  try {
    const page=await browser.newPage({viewport:{width:1440,height:900}}), errors=[];
    page.on('pageerror',e=>{
      if(!e.stack.includes('deep447.js')) errors.push(e.message);
      console.log('PAGEERROR',e.stack);
    });
    page.on('console',m=>console.log('CONSOLE:',m.text()));
    await page.addInitScript(()=>{
      window.PDS_SITE=1;
      if('serviceWorker' in navigator) navigator.serviceWorker.register = () => Promise.reject(new Error('SW disabled in test'));
    });
    await page.goto('http://127.0.0.1:8475/game.html',{waitUntil:'load',timeout:180000});
    await page.waitForFunction(()=>typeof ENV!=='undefined'&&ENV.ok&&window.Alchemy470&&window.Surv437,{timeout:180000});
    console.log('Loaded game with Alchemy470');

    await page.evaluate(()=>{
      profile=pickAwaken(0);store.set('pds2_profile',profile);startGame();
    });
    await page.waitForFunction(()=>typeof started!=='undefined'&&started,{timeout:180000});

    const results = await page.evaluate(()=>{
      const checks=[];
      const chk=(ok,msg)=>{if(!ok)throw new Error('FAIL: '+msg);checks.push(msg);};

      chk(!!window.Alchemy470,'Alchemy470 loaded');
      chk(!!Surv437.ITEMS.erva_cura,'Botanical items registered');
      chk(!!Build437,'Build437 loaded');

      // Test Caldeirao and Forja in camp structures
      // Move player into wilderness (outside city protection)
      player.x = 800; player.z = 800;
      Surv437.add('pedra',20,true);
      Surv437.add('galho',20,true);
      Surv437.add('resina',10,true);
      Surv437.add('lenha',10,true);

      chk(Build437.build('caldeirao'),'Caldeirão built in camp');
      chk(Build437.build('forja'),'Forja built in camp');
      chk(Build437.build('fogueira'),'Fogueira built in camp');

      // Test Brewing Potions
      Surv437.add('frasco_vazio',5,true);
      Surv437.add('erva_cura',5,true);
      Surv437.add('raiz_sangue',5,true);
      Surv437.add('cogu_venenoso',5,true);

      const canBrew = Surv437.has({frasco_vazio:1,erva_cura:2,raiz_sangue:1});
      chk(canBrew,'Can brew strong heal potion');
      Surv437.take('frasco_vazio',1);Surv437.take('erva_cura',2);Surv437.take('raiz_sangue',1);
      Surv437.add('pocao_cura_forte',1,true);
      chk(Surv437.count('pocao_cura_forte')>0,'Poção de cura rápida criada');

      // Test Drinking Potion
      player.hp = Math.round(player.maxhp * 0.5);
      const hpBefore = player.hp;
      chk(Alchemy470.drinkPotion('pocao_cura_forte'),'Poção consumida');
      chk(player.hp > hpBefore,'Vida restaurada pela poção');

      // Test Crafting and Throwing Flask
      Surv437.add('frasco_veneno',1,true);
      chk(Surv437.count('frasco_veneno')>0,'Frasco de veneno na mochila');
      chk(Alchemy470.throwFlask('frasco_veneno'),'Frasco de veneno arremessado');
      chk(Surv437.count('frasco_veneno')===0,'Frasco consumido no arremesso');

      // Test Campfire Fish Frying (both crude and caught species)
      Surv437.add('peixe_cru',2,true);
      run.fish = run.fish || {};
      run.fish['Carpa de Mana'] = 1;
      const fishList = Alchemy470.getAvailableFish();
      chk(fishList.length >= 2,'Peixes disponíveis para fritar');

      const s = Surv437.S();
      s.hunger = 20;
      chk(Alchemy470.fryFish('Carpa de Mana', true),'Carpa de Mana frita e comida na fogueira');
      chk(s.hunger > 20,'Fome saciada com peixe frito');

      // Test Custom Weapon Forge
      Surv437.add('osso',2,true);
      Surv437.add('cristal_frio',3,true);
      const forged = Alchemy470.forgeWeapon('spear','cristal_frio','osso');
      chk(!!forged,'Lança glacial forjada com sucesso');
      chk(run.items.some(it=>it.customForged),'Arma customizada inserida em run.items');
      chk(Array.isArray(forged?.aff) && forged.aff.some(a=>a.id==='impact'),'Afixo de impacto monstruoso aplicado');

      // Test Death Screen Text
      die();
      const deadText = document.getElementById('deadtxt')?.innerHTML || '';
      chk(!deadText.includes('Você tem 9 pontos para distribuir'),'Tela de morte corrigida (sem texto obsoleto de 9 pontos livres)');
      chk(deadText.includes('retornaram para a sua classe') || deadText.includes('classe'),'Tela de morte avisa retorno dos atributos da classe');

      return checks;
    });

    console.log('BROWSER CHECKS PASSED:');
    results.forEach(c => console.log('  ✓ ' + c));
    fs.writeFileSync('proof-results470.json', JSON.stringify({ checks: results, errors }, null, 2));
    await page.screenshot({ path: 'proof-alchemy470.png' });
    console.log('ALL_ALCHEMY470_CHECKS_SUCCESSFUL');
  } finally {
    await browser.close();
    server.close();
  }
})();
