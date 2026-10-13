from pathlib import Path
s=Path('game.html').read_text(encoding='utf8')
# Local-only test UI: uses real world, damage, death, animation and collision functions.
panel='''<section id="gtest" style="position:fixed;z-index:99999;top:8px;right:8px;width:330px;background:#17251fee;padding:12px;color:#e6ffdf;font:13px monospace"><b>TESTE LOCAL · COGUMELINHO</b><p>Entre na cidade antes de preparar.</p><button id="prepG">Preparar Cogumelinho</button><button id="hitG">Encurralar</button><button id="nightG">Anoitecer</button><button id="dayG">Dia</button><button id="suiteG">Testar mecânica</button><button id="proofG">Salvar prova</button><button id="stepG">Avançar 2s</button><pre id="gresult" style="white-space:pre-wrap"></pre></section><script>
let testG=null,kindG='cogu';const outG=document.getElementById('gresult');const waitG=ms=>{for(let t=0;t<ms/1000;t+=1/30){ADT=1/30;time+=ADT;Gosma347.update(ADT);for(const e of [...enemies])updEnemy(e,ADT);enemies=enemies.filter(e=>!e.gone);}curAtk=null;return Promise.resolve();};
function reportG(s){outG.textContent+=s+'\\n';}
function prepareG(){
 if(!player||!run){reportG('Entre na cidade primeiro.');return;}
 for(const e of enemies)scene.remove(e.m.root);enemies=[];
 let x=player.x,z=player.z;let found=false;
 for(let d=70;d<160&&!found;d+=10)for(let a=0;a<6.28;a+=.4){const xx=x+Math.sin(a)*d,zz=z+Math.cos(a)*d;if(freeAt(xx,zz,3)&&nearestCity(xx,zz).d>60){x=xx;z=zz;found=true;break;}}
 player.x=x;player.z=z;player.hp=player.maxhp;player.iT=9999;player.m.root.position.set(x,0,z);
 dayT=DAYLEN*.25;testG=spawnKind(kindG,x+3,z,0,{noFendido:true,wild:true});testG.aggro=true;testG.speed=3.4;
 reportG('Cogumelinho · '+testG.m.mon+' · HP '+testG.hp.toFixed(2)+' · '+(testG.m.clips||[]).map(c=>c.name).join('/')); return testG;
}
function damageG(e){player.iT=0;player.sleep348=0;player.sleepImmune348=0;player.x=e.x;player.z=e.z+.5;return e;}
document.getElementById('prepG').onclick=prepareG;document.getElementById('hitG').onclick=()=>{if(testG)damageG(testG)};
document.getElementById('nightG').onclick=()=>{dayT=DAYLEN*.7;enemies.forEach(e=>{if(e.gosmaGroup347)e.speed=3});reportG('Noite ativada');};
document.getElementById('dayG').onclick=()=>{dayT=DAYLEN*.25;reportG('Dia ativado');};
const nearG=(a,b)=>Math.abs(a-b)<1e-5;
async function suiteG(){
 outG.textContent='';let checks=0;const check=(v,s)=>{if(!v)throw Error(s);checks++;reportG('OK '+s)};
 try{
 for(kindG of ['cogu','cogu_f','cogu_a']){
 let e=prepareG();if(!e)return;player.iT=0;player.sleep348=0;player.sleepImmune348=0;
 const d0=Math.hypot(player.x-e.x,player.z-e.z);await waitG(500);
 check(kindG==='cogu'?Math.hypot(player.x-e.x,player.z-e.z)>d0+.3:Math.hypot(player.x-e.x,player.z-e.z)<d0,kindG+' fuga ou aproximação conforme espécie');check(e.m.mon===kindG,kindG+' modelo próprio');
 player.x=e.x;player.z=e.z+.5;await waitG(100);
 check(!!e.coguCast348&&!Cogu348.asleep(player),'avisa antes de liberar esporos');await waitG(650);
 check(Cogu348.asleep(player),'esporos aplicam sono no alcance');if(kindG!=='cogu')check(player.hp<player.maxhp,'nuvem da variante causa dano');
 const x=player.x,z=player.z;moveEnt(player,1,0);check(player.x===x&&player.z===z,'sono impede movimento');
 player.atkT=0;player.dodgeT=0;player.air344=false;attack();dodge();jump343();check(!player.atkT&&!player.dodgeT&&!player.air344,'sono impede ataque, esquiva e salto');
 const sk=player.skills[0],beforeCd=sk.cdT,mp=player.mp;useSkill(sk);kitCast111(sk);useCombo261();check(sk.cdT===beforeCd&&player.mp===mp,'sono impede habilidades sem gastar recurso');
 const hp=player.hp;player.iT=0;curAtk=e;hurtPlayer(50);curAtk=null;check(player.hp<hp&&!Cogu348.asleep(player),'dano acorda o jogador');
 check(!Cogu348.sleep(player),'imunidade evita sono em cadeia');
 player.sleepImmune348=0;player.iT=0;Cogu348.sleep(player);time+=3;check(!Cogu348.asleep(player),'sono termina sozinho');
 e=prepareG();player.iT=0;player.sleep348=0;player.sleepImmune348=0;player.x=e.x;player.z=e.z+.5;await waitG(100);player.x+=8;await waitG(750);check(!Cogu348.asleep(player),'sair do raio evita o sono');
 e=prepareG();player.iT=0;player.sleep348=0;player.sleepImmune348=0;player.x=e.x;player.z=e.z+.5;await waitG(100);killEnemy(e);await waitG(1000);check(!Cogu348.asleep(player),'morte cancela a nuvem antes do disparo');
 e=prepareG();player.iT=0;player.sleep348=0;player.sleepImmune348=0;player.x=e.x;player.z=e.z+.5;await waitG(100);e.stun=.8;await waitG(850);check(!Cogu348.asleep(player),'interrupção cancela o disparo');

 e=prepareG();player.iT=0;player.sleep348=0;player.sleepImmune348=0;player.x=e.x;player.z=e.z+.5;await waitG(100);e.frozen=true;await waitG(850);check(!e.coguCast348&&!Cogu348.asleep(player),'congelamento cancela emissão');e.frozen=false;
 e=prepareG();killEnemy(e);await waitG(1600);check(e.dead&&!e.gone,'morte preserva duração longa');await waitG(2500);check(e.dead,'morte conclui sem reanimar');

 }
 reportG('PASSOU '+checks+' verificações no jogo');
 }catch(err){reportG('FALHOU '+err.message);console.error(err);}
}
document.getElementById('suiteG').onclick=suiteG;
document.getElementById('stepG').onclick=()=>waitG(2000);
document.getElementById('proofG').onclick=()=>{renderer.render(scene,camera);const dst=document.createElement('canvas');dst.width=renderer.domElement.width;dst.height=renderer.domElement.height;const ctx=dst.getContext('2d');ctx.drawImage(renderer.domElement,0,0);ctx.fillStyle='#142519ee';ctx.fillRect(14,14,390,Math.min(450,60+outG.textContent.split('\\n').length*15));ctx.fillStyle='#ddffd8';ctx.font='11px monospace';ctx.fillText('COGUMELINHO · TESTE NO JOGO · '+(isNight()?'NOITE':'DIA'),28,40);outG.textContent.split('\\n').forEach((l,i)=>ctx.fillText(l.slice(0,53),28,65+i*15));dst.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='cogu-teste-'+(isNight()?'noite':'dia')+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),10000)});};
setInterval(()=>{document.querySelector('#gtest p').textContent=(isNight()?'NOITE':'DIA')+' · vivos: '+enemies.filter(q=>!q.dead).length+' · '+enemies.filter(q=>!q.dead).map(q=>q.hp.toFixed(1)).join(' / ')},500);
</script>'''
s+=panel;Path('cogu-family-playtest.html').write_text(s,encoding='utf8')
