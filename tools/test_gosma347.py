from pathlib import Path
s=Path('game.html').read_text(encoding='utf8')
# Local-only test UI: uses real world, damage, death, animation and collision functions.
panel='''<section id="gtest" style="position:fixed;z-index:99999;top:8px;right:8px;width:330px;background:#17251fee;padding:12px;color:#e6ffdf;font:13px monospace"><b>TESTE LOCAL · GOSMA</b><p>Entre na cidade antes de preparar.</p><button id="prepG">Preparar Gosma</button><button id="hitG">Ferir até dividir</button><button id="nightG">Anoitecer</button><button id="dayG">Dia</button><button id="suiteG">Testar mecânica</button><button id="proofG">Salvar prova</button><button id="stepG">Avançar 2s</button><pre id="gresult" style="white-space:pre-wrap"></pre></section><script>
let testG=null;const outG=document.getElementById('gresult');const waitG=ms=>{for(let t=0;t<ms/1000;t+=1/30){ADT=1/30;Gosma347.update(ADT);for(const e of [...enemies])updEnemy(e,ADT);enemies=enemies.filter(e=>!e.gone);}curAtk=null;return Promise.resolve();};
function reportG(s){outG.textContent+=s+'\\n';}
function prepareG(){
 if(!player||!run){reportG('Entre na cidade primeiro.');return;}
 for(const e of enemies)scene.remove(e.m.root);enemies=[];
 let x=player.x,z=player.z;let found=false;
 for(let d=70;d<160&&!found;d+=10)for(let a=0;a<6.28;a+=.4){const xx=x+Math.sin(a)*d,zz=z+Math.cos(a)*d;if(freeAt(xx,zz,3)&&nearestCity(xx,zz).d>60){x=xx;z=zz;found=true;break;}}
 player.x=x;player.z=z;player.hp=player.maxhp;player.iT=9999;player.m.root.position.set(x,0,z);
 dayT=DAYLEN*.25;testG=spawnKind('gosma',x+3,z,0,{noFendido:true,wild:true});testG.aggro=true;testG.speed=0;
 reportG('Gosma pronta · HP '+testG.hp.toFixed(2));return testG;
}
function damageG(e){for(let i=0;i<40&&!e.gosmaUsed347&&!e.dead;i++)hurtEnemy(e,Math.max(1,e.maxhp*.08),player.x,player.z,{kb:0,stun:0,pierce:true,guard343:true});return e;}
document.getElementById('prepG').onclick=prepareG;document.getElementById('hitG').onclick=()=>{if(testG)damageG(testG)};
document.getElementById('nightG').onclick=()=>{dayT=DAYLEN*.7;enemies.forEach(e=>{if(e.gosmaGroup347)e.speed=3});reportG('Noite ativada');};
document.getElementById('dayG').onclick=()=>{dayT=DAYLEN*.25;reportG('Dia ativado');};
const nearG=(a,b)=>Math.abs(a-b)<1e-5;
async function suiteG(){
 outG.textContent='';let checks=0;const check=(v,s)=>{if(!v)throw Error(s);checks++;reportG('OK '+s)};
 try{
 let e=prepareG();if(!e)return;const initialMax=e.maxhp,kills=run.kills;
 damageG(e);const remaining=e.hp;await waitG(1400);let a=enemies.filter(q=>q.gosmaGroup347&&!q.dead);
 reportG(JSON.stringify({kind:e.kind,used:e.gosmaUsed347,split:e.gosmaSplit347,frozen:e.frozen,hold:e.hold,mon:e.m.mon,noLoot:e.noExpLoot,ready:[0,1,2].map(i=>!!MON.list['gosma_part'+i])}));check(a.length===3,'três alvos após dano');check(nearG(a.reduce((v,q)=>v+q.hp,0),remaining),'vida conservada na divisão');
 check(nearG(a.reduce((v,q)=>v+q.maxhp,0),initialMax),'vida máxima conservada');check(run.kills===kills,'dividir não conta morte');
 const attacker=a[2];player.x=attacker.x;player.z=attacker.z+.4;attacker.cd=0;attacker.stun=0;attacker.aggro=true;attacker.act=null;updEnemy(attacker,1/30);check(attacker.act?.type==='swing','fragmento inicia ataque próprio');player.x-=3;

 await waitG(8000);check(a.every(q=>!q.gone)&&!a[0].gosmaGroup347.merged,'não reúne durante o dia');
 const removed=a[1];killEnemy(removed);check(run.kills===kills,'fragmento não dá recompensa isolada');
 a=a.filter(q=>!q.dead);const surviving=a.reduce((v,q)=>v+q.hp,0),survivingMax=a.reduce((v,q)=>v+q.maxhp,0);
 a.forEach(q=>q.speed=3);dayT=DAYLEN*.7;await waitG(4000);
 a=enemies.filter(q=>q.gosmaGroup347&&!q.dead);check(a.length===1&&a[0].gosmaGroup347.merged,'reunião noturna');
 check(nearG(a[0].hp,surviving)&&nearG(a[0].maxhp,survivingMax),'não cura nem ressuscita pedaço destruído');
 e=a[0];damageG(e);await waitG(700);check(enemies.filter(q=>q.gosmaGroup347&&!q.dead).length===1,'não divide repetidamente');
 killEnemy(e);killEnemy(e);check(run.kills===kills+1,'uma recompensa e uma morte por organismo');
 e=prepareG();const k2=run.kills;damageG(e);await waitG(1000);a=enemies.filter(q=>q.gosmaGroup347&&!q.dead);a.forEach(killEnemy);check(run.kills===k2+1,'exterminar todos também recompensa só uma vez');
 e=prepareG();const k3=run.kills;killEnemy(e);await waitG(600);check(!e.gosmaGroup347&&run.kills===k3+1,'morte direta não cria fragmentos');
 reportG('PASSOU '+checks+' verificações no jogo');
 }catch(err){reportG('FALHOU '+err.message);console.error(err);}
}
document.getElementById('suiteG').onclick=suiteG;
document.getElementById('stepG').onclick=()=>waitG(2000);
document.getElementById('proofG').onclick=()=>{renderer.render(scene,camera);const dst=document.createElement('canvas');dst.width=renderer.domElement.width;dst.height=renderer.domElement.height;const ctx=dst.getContext('2d');ctx.drawImage(renderer.domElement,0,0);ctx.fillStyle='#142519ee';ctx.fillRect(14,14,390,Math.min(450,60+outG.textContent.split('\\n').length*15));ctx.fillStyle='#ddffd8';ctx.font='11px monospace';ctx.fillText('GOSMA VERDE · TESTE NO JOGO · '+(isNight()?'NOITE':'DIA'),28,40);outG.textContent.split('\\n').forEach((l,i)=>ctx.fillText(l.slice(0,53),28,65+i*15));dst.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='gosma-teste-'+(isNight()?'noite':'dia')+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),10000)});};
setInterval(()=>{document.querySelector('#gtest p').textContent=(isNight()?'NOITE':'DIA')+' · vivos: '+enemies.filter(q=>!q.dead).length+' · '+enemies.filter(q=>!q.dead).map(q=>q.hp.toFixed(1)).join(' / ')},500);
</script>'''
s+=panel;Path('gosma-playtest.html').write_text(s,encoding='utf8')
