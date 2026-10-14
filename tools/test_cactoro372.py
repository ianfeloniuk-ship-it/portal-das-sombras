from pathlib import Path
s=Path('game.html').read_text(encoding='utf8')
# Local-only test UI: uses real world, damage, death, animation and collision functions.
panel='''<section id="gtest" style="position:fixed;z-index:99999;top:8px;right:8px;width:330px;background:#17251fee;padding:12px;color:#e6ffdf;font:13px monospace"><b>TESTE LOCAL · CACTOROS</b><p>Entre na cidade antes de preparar.</p><button id="prepG">Preparar Cactoro</button><button id="hitG">Aproximar</button><button id="nightG">Anoitecer</button><button id="dayG">Dia</button><button id="suiteG">Testar mecânica</button><button id="proofG">Salvar prova</button><button id="stepG">Avançar 2s</button><pre id="gresult" style="white-space:pre-wrap"></pre></section><script>
let testG=null,arenaG=null,kindG="cactinho";const outG=document.getElementById('gresult');const waitG=ms=>{for(let t=0;t<ms/1000;t+=1/30){ADT=1/30;time+=ADT;Gosma347.update(ADT);for(const e of [...enemies])updEnemy(e,ADT);enemies=enemies.filter(e=>!e.gone);}curAtk=null;return Promise.resolve();};
function reportG(s){outG.textContent+=s+'\\n';}
function prepareG(){
 if(!player||!run){reportG('Entre na cidade primeiro.');return;}
 for(const p of projs)scene.remove(p.mesh);projs=[];for(const e of enemies)scene.remove(e.m.root);enemies=[];
 let x=arenaG?arenaG.x:player.x,z=arenaG?arenaG.z:player.z;let found=!!arenaG;
 for(let d=70;d<300&&!found;d+=10)for(let a=0;a<6.28;a+=.2){const xx=x+Math.sin(a)*d,zz=z+Math.cos(a)*d;if(freeAt(xx,zz,6)&&los(xx,zz,xx+3,zz)&&nearestCity(xx,zz).d>60){x=xx;z=zz;found=true;break;}}
 if(!found)throw Error('Sem arena livre');arenaG={x,z};
 player.x=x;player.z=z;player.hp=player.maxhp;player.dead=false;player.stealth=0;player.mp=0;player.iT=9999;player.m.root.position.set(x,0,z);
 dayT=DAYLEN*.25;testG=spawnKind(kindG,x+3,z,0,{noFendido:true,noInedita:true,wild:true});testG.aggro=true;testG.speed=5;player.face=0;
 reportG('Cactoro · '+testG.m.mon+' · HP '+testG.hp.toFixed(2)+' · '+(testG.m.clips||[]).map(c=>c.name).join('/')); return testG;
}
function damageG(e){player.iT=0;player.sleep348=0;player.sleepImmune348=0;player.x=e.x;player.z=e.z+.5;return e;}
document.getElementById('prepG').onclick=prepareG;document.getElementById('hitG').onclick=()=>{if(testG)damageG(testG)};
document.getElementById('nightG').onclick=()=>{dayT=DAYLEN*.7;enemies.forEach(e=>{if(e.gosmaGroup347)e.speed=3});reportG('Noite ativada');};
document.getElementById('dayG').onclick=()=>{dayT=DAYLEN*.25;reportG('Dia ativado');};
const nearG=(a,b)=>Math.abs(a-b)<1e-5;
async function suiteG(){outG.textContent='';let checks=0;const check=(v,s)=>{if(!v)throw Error(s);checks++;reportG('OK '+s)};try{
 for(kindG of ['cactinho','cactinho_f','cactinho_a']){
 let e=prepareG();check(e.m.mon===kindG,'modelo '+kindG);check(e.m.clips.length===8,'oito clipes');check(e.m.model.getObjectByName('Muzzle'),'boca articulada');
 dayT=DAYLEN*.7;e.cd=0;await waitG(34);check(e.cactor372?.phase==='wind','aviso antes do tiro');const n=projs.length,a={...e.cactor372};await waitG(100);check(projs.length===n,'sem dano antecipado');player.z+=4;await waitG(900);check(projs.length===n+1,'um disparo por preparo');const p=projs[projs.length-1];check(p.dmg===kitWeakDamage111(e,e.dmg),'dano preservado');const hp=player.hp;player.iT=0;for(let j=0;j<60;j++){player.iT=Math.max(0,player.iT-.025);updateProjectiles253(.025)}check(player.hp===hp,'esquiva do projétil');await waitG(200);check(projs.length<=n+1,'sem duplicação');
 e=prepareG();dayT=DAYLEN*.7;e.cd=0;await waitG(34);e.stun=2;await waitG(1000);check(!e.cactor372&&projs.length===0,'atordoamento cancela');
 e=prepareG();dayT=DAYLEN*.7;e.cd=0;await waitG(34);e.frozen=true;await waitG(1000);check(!e.cactor372&&projs.length===0,'gelo cancela');
 e=prepareG();dayT=DAYLEN*.7;e.cd=0;await waitG(34);killEnemy(e);await waitG(1000);check(projs.length===0,'morte cancela');check(!e.gone,'morte não corta em 1s');await waitG(1500);check(e.m.cur==='Death_A','clipe de morte');
 e=prepareG();dayT=DAYLEN*.7;e.cd=0;await waitG(1000);player.iT=0;player.shield=0;const oldhp=player.hp;for(let j=0;j<60;j++){player.iT=Math.max(0,player.iT-.025);updateProjectiles253(.025)}check(player.hp<oldhp,'projétil real acerta');
 e=prepareG();dayT=DAYLEN*.25;e.cd=99;const x=e.x,z=e.z;player.x=e.x-7;await waitG(200);if(kindG!=='cactinho_a')check(e.x===x&&e.z===z,'raízes fixas no dia');dayT=DAYLEN*.7;await waitG(200);check(Math.hypot(e.x-x,e.z-z)>.01,'anda ao anoitecer');
 }
 reportG('PASSOU '+checks+' verificações');prepareG();
 }catch(err){reportG('FALHOU '+err.message);console.error(err)}}
document.getElementById('suiteG').onclick=suiteG;
document.getElementById('stepG').onclick=()=>waitG(2000);
document.getElementById('proofG').onclick=()=>{renderer.render(scene,camera);const dst=document.createElement('canvas');dst.width=renderer.domElement.width;dst.height=renderer.domElement.height;const ctx=dst.getContext('2d');ctx.drawImage(renderer.domElement,0,0);ctx.fillStyle='#142519ee';ctx.fillRect(14,14,390,Math.min(450,60+outG.textContent.split('\\n').length*15));ctx.fillStyle='#ddffd8';ctx.font='11px monospace';ctx.fillText('CACTOROS · TESTE NO JOGO · '+(isNight()?'NOITE':'DIA'),28,40);outG.textContent.split('\\n').filter(l=>l.startsWith('OK ')||l.startsWith('PASSOU')).forEach((l,i)=>ctx.fillText(l.slice(0,53),28,65+i*15));dst.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='spiky-teste-'+(isNight()?'noite':'dia')+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),10000)});};
setInterval(()=>{document.querySelector('#gtest p').textContent=(isNight()?'NOITE':'DIA')+' · vivos: '+enemies.filter(q=>!q.dead).length+' · '+enemies.filter(q=>!q.dead).map(q=>q.hp.toFixed(1)).join(' / ')},500);
</script>'''
s+=panel;Path('cactoro-playtest.html').write_text(s,encoding='utf8')
