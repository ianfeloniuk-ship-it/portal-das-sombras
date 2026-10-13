from pathlib import Path
src=Path('tools/test_beetle352.py').read_text(encoding='utf-8')
start=src.index(' const originalGear=');end=src.index(" reportG('PASSOU",start)
body='''
 let e=prepareG();if(!e)return;e.cd=0;
 check(e.m.mon==='slime'&&e.m.clips.length===5,'padrão usa cinco clipes novos');
 const ox=e.x,oz=e.z;await waitG(800);check(!e.slime360&&e.x===ox&&e.z===oz,'padrão sozinho permanece pacífico');
 const friend=spawnKind('slime',player.x-3,player.z,0,{noFendido:true,wild:true});friend.cd=0;await waitG(300);check(Math.hypot(e.x-ox,e.z-oz)>.1,'grupo aproxima para cercar');
 e=prepareG();e.cd=0;spawnKind('slime',e.x+.8,e.z,0,{noFendido:true,wild:true});damageG(e);const hp=player.hp;await waitG(100);check(e.slime360&&player.hp===hp,'preparo não causa dano');await waitG(450);check(player.hp<hp,'contato começa sufocamento');
 const after=player.hp;player.x+=8;await waitG(700);check(player.hp===after&&!e.slime360,'afastar cancela sufocamento');
 e=prepareG();e.cd=0;await waitG(34);e.hp-=1;await waitG(34);check(e.slimeAnger360>0,'padrão reage quando ferido');
 for(const kind of ['slime_f','slime_a']){
  prepareG();enemies.forEach(q=>{scene.remove(q.m.root)});enemies=[];e=spawnKind(kind,player.x+.8,player.z,0,{noFendido:true,wild:true});e.cd=0;
  check(e.m.mon===kind&&e.m.clips.length===5,kind+' modelo e animações próprios');Variants308.dress(e);let extra=0;e.m.root.traverse(o=>{if(o.material?.name==='FendaCristal')extra++});check(!e.orb308&&extra===0,kind+' sem adereços genéricos');
  await waitG(34);check(!!e.slime360,kind+' agressivo sozinho');e.stun=1;await waitG(100);check(!e.slime360,kind+' atordoamento cancela ataque');e.stun=0;e.cd=0;await waitG(34);e.frozen=true;await waitG(100);check(!e.slime360,kind+' congelamento cancela ataque');e.frozen=false;
  corpseDrop353(e,{type:'gold',n:1});killEnemy(e);await waitG(1600);check(!e.gone,kind+' morte não cortada');await waitG(1900);const action=gAct(e.m,'Death_A');check(action.time>=action.getClip().duration-.02,kind+' termina morte');check(e.corpse353&&Loot353.records().some(r=>r.id===e.corpse353),kind+' preserva saque');
 }
'''
src=src[:start]+body+src[end:]
src=src.replace("run.equip=originalGear;delete player.shiny352;",'')
src=src.replace("spawnKind('escaravelho'","spawnKind('slime'").replace("Path('beetle-playtest.html')","Path('slime-playtest.html')").replace('CAVALEIRO ESCARAVELHO','SLIME ROSA E VARIANTES').replace('Cavaleiro Escaravelho','Slime Rosa').replace("a.download='beetle-teste-'","a.download='slime-teste-'")
exec(compile(src,'slime_test','exec'))
