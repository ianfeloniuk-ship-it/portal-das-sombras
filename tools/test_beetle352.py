from pathlib import Path
s=Path('game.html').read_text(encoding='utf8')
# Local-only test UI: uses real world, damage, death, animation and collision functions.
panel='''<section id="gtest" style="position:fixed;z-index:99999;top:8px;right:8px;width:330px;background:#17251fee;padding:12px;color:#e6ffdf;font:13px monospace"><b>TESTE LOCAL · CAVALEIRO ESCARAVELHO</b><p>Entre na cidade antes de preparar.</p><button id="prepG">Preparar Cavaleiro Escaravelho</button><button id="hitG">Aproximar</button><button id="nightG">Anoitecer</button><button id="dayG">Dia</button><button id="suiteG">Testar mecânica</button><button id="proofG">Salvar prova</button><button id="stepG">Avançar 2s</button><pre id="gresult" style="white-space:pre-wrap"></pre></section><script>
let testG=null,arenaG=null;const outG=document.getElementById('gresult');const waitG=ms=>{for(let t=0;t<ms/1000;t+=1/30){ADT=1/30;time+=ADT;Gosma347.update(ADT);for(const e of [...enemies])updEnemy(e,ADT);enemies=enemies.filter(e=>!e.gone);}curAtk=null;return Promise.resolve();};
function reportG(s){outG.textContent+=s+'\\n';}
function prepareG(){
 if(!player||!run){reportG('Entre na cidade primeiro.');return;}
 for(const p of projs)scene.remove(p.mesh);projs=[];for(const e of enemies)scene.remove(e.m.root);enemies=[];
 let x=arenaG?arenaG.x:player.x,z=arenaG?arenaG.z:player.z;let found=!!arenaG;
 for(let d=70;d<300&&!found;d+=10)for(let a=0;a<6.28;a+=.2){const xx=x+Math.sin(a)*d,zz=z+Math.cos(a)*d;if(freeAt(xx,zz,6)&&los(xx,zz,xx+3,zz)&&nearestCity(xx,zz).d>60){x=xx;z=zz;found=true;break;}}
 if(!found)throw Error('Sem arena livre');arenaG={x,z};
 player.x=x;player.z=z;player.hp=player.maxhp;player.dead=false;player.stealth=0;player.iT=9999;player.m.root.position.set(x,0,z);
 dayT=DAYLEN*.25;testG=spawnKind('escaravelho',x+3,z,0,{noFendido:true,wild:true});testG.aggro=true;testG.speed=3.4;player.face=0;
 reportG('Cavaleiro Escaravelho · '+testG.m.mon+' · HP '+testG.hp.toFixed(2)+' · '+(testG.m.clips||[]).map(c=>c.name).join('/')); return testG;
}
function damageG(e){player.iT=0;player.sleep348=0;player.sleepImmune348=0;player.x=e.x;player.z=e.z+.5;return e;}
document.getElementById('prepG').onclick=prepareG;document.getElementById('hitG').onclick=()=>{if(testG)damageG(testG)};
document.getElementById('nightG').onclick=()=>{dayT=DAYLEN*.7;enemies.forEach(e=>{if(e.gosmaGroup347)e.speed=3});reportG('Noite ativada');};
document.getElementById('dayG').onclick=()=>{dayT=DAYLEN*.25;reportG('Dia ativado');};
const nearG=(a,b)=>Math.abs(a-b)<1e-5;
async function suiteG(){
 outG.textContent='';let checks=0;const check=(v,s)=>{if(!v)throw Error(s);checks++;reportG('OK '+s)};
 try{
 const originalGear={...run.equip};
 let e=prepareG();if(!e)return;e.cd=0;run.equip.w=null;run.equip.a=null;player.shiny352=false;
 check(e.m.mon==='escaravelho'&&e.m.clips.length===8,'modelo Escaravelho e oito clipes');
 const x=e.x,z=e.z;e.face=0;await waitG(200);check(!e.beetle352,'sem brilho não provoca investida');check(Math.abs(e.x-x)<.001&&e.z>z,'patrulha em linha reta');
 delete player.shiny352;run.equip.w={kind155:'sword',rar:0};check(Beetle352.shiny(player),'lâmina metálica é percebida');run.equip.w={kind155:'bow',rar:0};check(!Beetle352.shiny(player),'arco comum não emite brilho');run.equip.w={kind155:'bow',rar:1};check(Beetle352.shiny(player),'brilho de raridade atrai');
 player.shiny352=true;e=prepareG();e.cd=0;await waitG(34);check(e.beetle352?.phase==='wind','brilho inicia aviso');const origin={x:e.x,z:e.z};await waitG(200);check(e.x===origin.x&&e.z===origin.z,'preparo não avança');const aim={dx:e.beetle352.dx,dz:e.beetle352.dz};player.z+=4;await waitG(450);check(e.beetle352?.phase==='charge','preparo inicia investida');check(e.beetle352.dx===aim.dx&&e.beetle352.dz===aim.dz,'direção travada permite esquiva');
 const committed=e.beetle352,hp=player.hp;await waitG(1200);check(player.hp===hp,'esquiva sai da trajetória');await waitG(1500);check(e.beetle352!==committed,'termina recuperação');
 e=prepareG();e.cd=0;player.iT=0;const hpHit=player.hp;await waitG(900);check(player.hp<hpHit,'contato real causa dano');const after=player.hp;player.iT=0;await waitG(250);check(player.hp===after,'não repete dano na mesma investida');
 e=prepareG();e.cd=0;await waitG(34);e.stun=1;await waitG(700);check(!e.beetle352,'atordoamento cancela');
 e=prepareG();e.cd=0;await waitG(34);e.frozen=true;await waitG(100);check(!e.beetle352,'congelamento cancela');e.frozen=false;
 e=prepareG();e.cd=0;await waitG(34);killEnemy(e);const deadPos={x:e.x,z:e.z};await waitG(800);check(e.dead&&e.x===deadPos.x&&e.z===deadPos.z,'morte impede avanço');
 // Real static collider in a clear arena; no movement or damage function is mocked.
 e=prepareG();e.cd=0;await waitG(34);const wall={x:(e.x+player.x)/2,z:(e.z+player.z)/2,r:.6},wx=e.x,wz=e.z;hadd(HASH,wall);const hpWall=player.hp;await waitG(900);
 check(e.beetle352?.phase==='recover'&&Math.hypot(e.x-wx,e.z-wz)<.6,'obstáculo interrompe sem desviar');check(player.hp===hpWall,'não atinge através do obstáculo');
 for(const [key,list] of HASH){const i=list.indexOf(wall);if(i>=0)list.splice(i,1);}
 reportG('PASSOU '+checks+' verificações no jogo');
 run.equip=originalGear;delete player.shiny352;const finalMob=prepareG();finalMob.cd=999;finalMob.face=Math.PI/2;
 }catch(err){reportG('FALHOU '+err.message);console.error(err);}
}
document.getElementById('suiteG').onclick=suiteG;
document.getElementById('stepG').onclick=()=>waitG(2000);
document.getElementById('proofG').onclick=()=>{renderer.render(scene,camera);const dst=document.createElement('canvas');dst.width=renderer.domElement.width;dst.height=renderer.domElement.height;const ctx=dst.getContext('2d');ctx.drawImage(renderer.domElement,0,0);ctx.fillStyle='#142519ee';ctx.fillRect(14,14,390,Math.min(450,60+outG.textContent.split('\\n').length*15));ctx.fillStyle='#ddffd8';ctx.font='11px monospace';ctx.fillText('CAVALEIRO ESCARAVELHO · TESTE NO JOGO · '+(isNight()?'NOITE':'DIA'),28,40);outG.textContent.split('\\n').filter(l=>l.startsWith('OK ')||l.startsWith('PASSOU')).forEach((l,i)=>ctx.fillText(l.slice(0,53),28,65+i*15));dst.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='beetle-teste-'+(isNight()?'noite':'dia')+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),10000)});};
setInterval(()=>{document.querySelector('#gtest p').textContent=(isNight()?'NOITE':'DIA')+' · vivos: '+enemies.filter(q=>!q.dead).length+' · '+enemies.filter(q=>!q.dead).map(q=>q.hp.toFixed(1)).join(' / ')},500);
</script>'''
s+=panel;Path('beetle-playtest.html').write_text(s,encoding='utf8')
