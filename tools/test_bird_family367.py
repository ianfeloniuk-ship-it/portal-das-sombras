from pathlib import Path
s=Path('game.html').read_text(encoding='utf8')
# Local-only test UI: uses real world, damage, death, animation and collision functions.
panel='''<section id="gtest" style="position:fixed;z-index:99999;top:8px;right:8px;width:330px;background:#17251fee;padding:12px;color:#e6ffdf;font:13px monospace"><b>TESTE LOCAL · PÁSSARO BRAVO</b><p>Entre na cidade antes de preparar.</p><button id="prepG">Preparar Pássaro Bravo</button><button id="hitG">Aproximar</button><button id="nightG">Anoitecer</button><button id="dayG">Dia</button><button id="suiteG">Testar mecânica</button><button id="proofG">Salvar prova</button><button id="stepG">Avançar 2s</button><pre id="gresult" style="white-space:pre-wrap"></pre></section><script>
let birdKind='passaro';let testG=null;const outG=document.getElementById('gresult');const waitG=ms=>{for(let t=0;t<ms/1000;t+=1/30){ADT=1/30;time+=ADT;Gosma347.update(ADT);for(const e of [...enemies])updEnemy(e,ADT);enemies=enemies.filter(e=>!e.gone);}curAtk=null;return Promise.resolve();};
function reportG(s){outG.textContent+=s+'\\n';}
function prepareG(){
 if(!player||!run){reportG('Entre na cidade primeiro.');return;}
 for(const e of enemies)scene.remove(e.m.root);enemies=[];
 let x=player.x,z=player.z;let found=false;
 for(let d=70;d<160&&!found;d+=10)for(let a=0;a<6.28;a+=.4){const xx=x+Math.sin(a)*d,zz=z+Math.cos(a)*d;if(freeAt(xx,zz,3)&&nearestCity(xx,zz).d>60){x=xx;z=zz;found=true;break;}}
 player.x=x;player.z=z;player.hp=player.maxhp;player.iT=9999;player.m.root.position.set(x,0,z);
 dayT=DAYLEN*.25;testG=spawnKind(birdKind,x+3,z,0,{noFendido:true,wild:true});testG.aggro=true;testG.speed=5;player.face=0;
 reportG('Pássaro Bravo · '+testG.m.mon+' · HP '+testG.hp.toFixed(2)+' · '+(testG.m.clips||[]).map(c=>c.name).join('/')); return testG;
}
function damageG(e){player.iT=0;player.sleep348=0;player.sleepImmune348=0;player.x=e.x;player.z=e.z+.5;return e;}
document.getElementById('prepG').onclick=prepareG;document.getElementById('hitG').onclick=()=>{if(testG)damageG(testG)};
document.getElementById('nightG').onclick=()=>{dayT=DAYLEN*.7;enemies.forEach(e=>{if(e.gosmaGroup347)e.speed=3});reportG('Noite ativada');};
document.getElementById('dayG').onclick=()=>{dayT=DAYLEN*.25;reportG('Dia ativado');};
const nearG=(a,b)=>Math.abs(a-b)<1e-5;
async function suiteG(){
 outG.textContent='';let checks=0;const check=(v,s)=>{if(!v)throw Error(s);checks++;reportG('OK '+s)};
 try{
 for(birdKind of ['passaro','passaro_f','passaro_a']){let e=prepareG();if(!e)return;check(e.m.mon===birdKind,'modelo dedicado '+birdKind);player.iT=999;player.face=0;e.x=player.x;e.z=player.z+4;e.cd=0;
 check(!Bird349.lateral(e,player),'posição frontal reconhecida');
 await waitG(100);check(!e.bird349,'não começa mergulho de frente');
 let guard=0;while(!e.bird349&&guard++<240)await waitG(34);
 check(!!e.bird349&&e.bird349.phase==='wind','busca lateral antes de preparar');
 check(Bird349.lateral(e,player),'preparação ocorre pela lateral');
 const hp=player.hp;await waitG(100);check(player.hp===hp,'aviso não causa dano');
 while(e.bird349&&e.bird349.phase==='wind')await waitG(34);
 check(e.bird349?.phase==='dive','entra em mergulho após aviso');
 const a=e.bird349,dx=a.dx,dz=a.dz;player.x+=8;await waitG(100);
 check(e.bird349.dx===dx&&e.bird349.dz===dz,'trajetória fica fixa durante passagem');
 await waitG(1000);check(player.hp===hp,'sair da trajetória evita acerto');
 e=prepareG();player.iT=0;player.face=0;e.cd=0;e.x=player.x+4;e.z=player.z;await waitG(34);
 const before=player.hp;guard=0;while(e.bird349?.phase!=='recover'&&guard++<100)await waitG(34);
 check(e.bird349?.hit&&player.hp<before,'mergulho lateral acerta no contato');
 const hitHp=player.hp;player.iT=0;await waitG(200);check(player.hp===hitHp,'passagem não duplica dano');
 e=prepareG();player.iT=0;e.x=player.x+4;e.z=player.z;e.cd=0;await waitG(34);e.stun=1;const hpStun=player.hp;await waitG(600);
 check(!e.bird349&&player.hp===hpStun,'atordoamento cancela mergulho');
 e=prepareG();player.iT=0;e.x=player.x+4;e.z=player.z;e.cd=0;await waitG(34);const hpDead=player.hp;killEnemy(e);await waitG(1000);
 check(player.hp===hpDead,'morte cancela ataque');await waitG(600);check(!e.gone,'morte dura mais que limite antigo');await waitG(1800);check(e.gone,'morte termina e permite saque');
 e=prepareG();player.iT=0;e.x=player.x+4;e.z=player.z;e.cd=0;await waitG(34);e.frozen=true;const hpFreeze=player.hp;await waitG(500);check(!e.bird349&&player.hp===hpFreeze,'congelamento cancela mergulho');
 e=prepareG();player.iT=999;e.x=player.x+4;e.z=player.z;e.cd=0;await waitG(34);player.face=Math.PI/2;await waitG(34);check(!e.bird349,'virar de frente durante aviso cancela abordagem');
 }
 reportG('PASSOU '+checks+' verificações no jogo');
 }catch(err){reportG('FALHOU '+err.message);console.error(err);}
}
document.getElementById('suiteG').onclick=suiteG;
document.getElementById('stepG').onclick=()=>waitG(2000);
document.getElementById('proofG').onclick=()=>{renderer.render(scene,camera);const dst=document.createElement('canvas');dst.width=renderer.domElement.width;dst.height=renderer.domElement.height;const ctx=dst.getContext('2d');ctx.drawImage(renderer.domElement,0,0);ctx.fillStyle='#142519ee';ctx.fillRect(14,14,390,Math.min(450,60+outG.textContent.split('\\n').length*15));ctx.fillStyle='#ddffd8';ctx.font='11px monospace';ctx.fillText('PÁSSARO BRAVO · TESTE NO JOGO · '+(isNight()?'NOITE':'DIA'),28,40);outG.textContent.split('\\n').forEach((l,i)=>ctx.fillText(l.slice(0,53),28,65+i*15));dst.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='bird-teste-'+(isNight()?'noite':'dia')+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),10000)});};
setInterval(()=>{document.querySelector('#gtest p').textContent=(isNight()?'NOITE':'DIA')+' · vivos: '+enemies.filter(q=>!q.dead).length+' · '+enemies.filter(q=>!q.dead).map(q=>q.hp.toFixed(1)).join(' / ')},500);
</script>'''
s+=panel;Path('bird-family-playtest.html').write_text(s,encoding='utf8')

