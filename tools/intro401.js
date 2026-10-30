/* v401: guided prologue, persistent objective and story camera. */
(()=>{
'use strict';
const API=window.Intro401={conversation:null};
API.guided=()=>!!(profile?.classless&&Campaign327.state('a1')&&!Campaign327.state('a1').done);
API.reclaiming=()=>window.Reclaim372?.jobs.find(j=>j.intro)||[...(window.Reclaim372?.pending?.values()||[])].find(j=>j.intro);
const css=document.createElement('style');css.textContent=`
#quest401{position:fixed;right:22px;top:200px;width:min(300px,35vw);padding:15px 18px;background:linear-gradient(100deg,#111722ed,#192130d9);border-left:2px solid #e7bb68;color:#f8edda;z-index:72;font:14px/1.5 Georgia,serif;box-shadow:0 6px 25px #0005;pointer-events:auto}
#quest401 small{display:block;color:#e7bb68;letter-spacing:1.5px;font:10px/1.6 sans-serif;margin-bottom:6px}#quest401 p{margin:0}#quest401 .q410{float:right;display:flex;gap:2px;margin:-4px -6px 0 6px}#quest401 .q410 button{background:none;border:0;color:#e7bb68;cursor:pointer;font:16px/1 sans-serif;padding:2px 5px}#quest401 .q410 button:hover{color:#fff}#quest401[hidden],#dialog401[hidden]{display:none}
#dialog401{position:fixed;inset:0;z-index:9000;background:linear-gradient(#0009,transparent 22%,transparent 55%,#000c);display:flex;align-items:flex-end;justify-content:center;padding:0 5vw 5vh;box-sizing:border-box}
#dialog401 article{width:min(850px,90vw);background:#101722f5;border-top:2px solid #d4ae69;padding:22px 30px;color:#f7efdf;box-shadow:0 8px 40px #0009;font:18px/1.6 Georgia,serif}#dialog401 h2{font:13px sans-serif;letter-spacing:3px;color:#e7bb68;margin:0 0 12px}#dialog401 p{min-height:58px;margin:0 0 16px}#dialog401 button{float:right;background:#332d22;color:#ffe2ab;border:1px solid #8b754f;padding:8px 18px;cursor:pointer}#dialog401 footer{height:36px;font:11px sans-serif;color:#adaca6}
body.story401 #stat,body.story401 #mission,body.story401 #history95,body.story401 #notice356,body.story401 #btns,body.story401 #quest401,body.story401 #bF,body.story401 #ach294,body.story401 #mm,body.story401 #obj,body.story401 #tb{visibility:hidden}body.guided401 #mission{display:none}
@media(max-width:640px){#quest401{top:145px;right:10px;width:210px;max-width:55vw;font-size:12px;padding:10px}#dialog401 article{padding:15px;font-size:15px}}
`;document.head.append(css);
const hud=document.createElement('aside');hud.id='quest401';hud.hidden=true;hud.innerHTML='<span class="q410"><button data-q="min" aria-label="Minimizar objetivo" title="Minimizar">−</button><button data-q="close" aria-label="Fechar objetivo" title="Fechar (reabrir pelo MENU)">×</button></span><small></small><p></p>';document.body.append(hud);
/* v410 (Ian): painel do Ato com minimizar (−/+) e fechar (×); reabre pelo MENU → OBJETIVO DO ATO. Estado fica salvo. */
const qui=()=>{try{return CFG.quest410=CFG.quest410||{min:false,closed:false}}catch(_){return{min:false,closed:false}}},qsave=()=>{try{store.set('pds_cfg',CFG)}catch(_){}};
let collapsed=false;hud.addEventListener('click',ev=>{const b=ev.target.closest('[data-q]');if(!b)return;const q=qui();if(b.dataset.q==='min')q.min=!q.min;else q.closed=true;qsave();hud.hidden=hud.hidden||q.closed});
API.showQuest=()=>{const q=qui();q.closed=false;q.min=false;qsave()};
(function menuBtn(){const ref=document.getElementById('bDiary');if(!ref){setTimeout(menuBtn,500);return}if(document.getElementById('bQuest410'))return;const b=document.createElement('button');b.className='mini';b.id='bQuest410';b.textContent='OBJETIVO DO ATO';b.onclick=()=>{const q=qui();if(q.closed||q.min)API.showQuest();else{q.closed=true;qsave()}};ref.after(b)})();
const overlay=document.createElement('section');overlay.id='dialog401';overlay.hidden=true;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Diálogo da história');overlay.innerHTML='<article><h2></h2><p></p><footer><span>E / Enter · avançar</span><button>Continuar</button></footer></article>';document.body.append(overlay);
function vendor(name){return npcs.filter(n=>!n.gone&&(n.short===name||n.name===name||({guild:'Lyra',wep:'Kael'})[n.shop]===name)).sort((a,b)=>Math.hypot(a.x-player.x,a.z-player.z)-Math.hypot(b.x-player.x,b.z-player.z))[0]}
function edran(){return Campaign327.W.get('a1')?.figs.find(f=>f?.name==='Edran')||window.Fronteira551?.actors.find(f=>f.name==='Edran')}
API.dialog=(name,lines,done)=>{
 if(API.conversation||API.reclaiming())return;
 const target=name==='Edran'?edran():vendor(name);
 API.conversation={name,lines,done,target,index:0,count:0,elapsed:0,paused,focus:document.activeElement,position:camera.position.clone(),quaternion:camera.quaternion.clone()};
 if(typeof narratorSilence513==='function')narratorSilence513();
 paused=true;W377.releaseAll();overlay.hidden=false;document.body.classList.add('story401');overlay.querySelector('h2').textContent=name.toUpperCase()+' · '+(name==='Edran'?'GUARDA DA ORDEM':name==='Lyra'?'ORDEM DA FENDA':'FERREIRO');overlay.querySelector('p').textContent='';overlay.querySelector('button').focus();
};
function next(){const c=API.conversation;if(!c)return;const text=c.lines[c.index];if(c.count<text.length){c.count=text.length;overlay.querySelector('p').textContent=text;return}if(++c.index<c.lines.length){c.count=0;c.elapsed=0;overlay.querySelector('p').textContent='';return}API.conversation=null;overlay.hidden=true;document.body.classList.remove('story401');paused=c.paused;W377.releaseAll();window._cinematicGrace451=performance.now()+2500;if(typeof player!=='undefined'&&player)player.iT=Math.max(player.iT||0,2.5);c.focus?.focus?.();c.done();refresh()}
overlay.querySelector('button').onclick=next;
addEventListener('keydown',e=>{if(!API.conversation&&!API.reclaiming())return;e.preventDefault();e.stopImmediatePropagation();if(!e.repeat&&[(typeof keyOf==='function'?keyOf('use'):'KeyE'),'Enter','Space'].includes(e.code))next()},true);
addEventListener('keyup',e=>{if(API.conversation||API.reclaiming()){e.preventDefault();e.stopImmediatePropagation()}},true);
function targetAndText(){
 if(window.Caixa606?.active())return Caixa606.objective();
 if(window.Torre607?.objective?.())return Torre607.objective();
 if(window.Sulco609?.active())return Sulco609.objective();
 if(window.Aldric610?.active())return Aldric610.objective();
 if(window.Corredor611?.active())return Corredor611.objective();
 if(window.Noite612?.active())return Noite612.objective();
 if(window.Mapa613?.active())return Mapa613.objective();
 if(window.Vale614?.active())return Vale614.objective();
 if(window.Ymiria683?.active())return Ymiria683.objective();
 if(window.Zahar685?.active())return Zahar685.objective();
 if(window.Thalor686?.active())return Thalor686.objective();
 if(window.Urdan721?.active())return Urdan721.objective();
 if(window.Verden722?.active())return Verden722.objective();
 if(window.Logos723?.active())return Logos723.objective();
 if(window.Erebo724?.active())return Erebo724.objective();
 if(window.Portal725?.active())return Portal725.objective();
 if(window.Ponte726?.active())return Ponte726.objective();
 if(window.Cacada727?.active())return Cacada727.objective();
 if(window.Porta728?.active())return Porta728.objective();
 if(window.Juramento726?.active())return Juramento726.objective();
 const s1=Campaign327?.state?.('a1');
 if(s1&&!s1.done){
  const w=Campaign327.W.get('a1');
  if(s1.s===0){if(!s1.helped401&&!s1.fightDone&&!s1.killed)return {actTitle:'ATO I · O CHAMADO',step:1,totalSteps:6,text:'Ajude o guarda Edran na carroça tombada [E]',target:edran()};
   if(API.reclaiming())return {actTitle:'ATO I · O CHAMADO',step:2,totalSteps:6,text:'Recolha o cristal deixado pela criatura [E]',target:null};
   if(!s1.fightDone)return {actTitle:'ATO I · O CHAMADO',step:2,totalSteps:6,text:s1.cartRescued401?'Derrote a criatura da Fenda com os punhos':'Empurre a carroça para salvar os dois [E] ou derrote a criatura primeiro',target:w?.foes.find(e=>!e.dead)};
   return {actTitle:'ATO I · O CHAMADO',step:3,totalSteps:6,text:s1.edranHelp401?'Ajude Edran a empurrar a carroça [E]':(s1.helped401?'Fale com Edran na carroça [E]':'Fale com Edran [E]'),target:(s1.edranHelp401||s1.helped401)?Campaign327.target():edran()};}
  if(s1.s===1&&window.Fronteira551?.active())return Fronteira551.objective();
  if(s1.s===1){const c=nearestCity(player.x,player.z).c;return {actTitle:'ATO I · O CHAMADO',step:4,totalSteps:6,text:'Siga pela estrada até o Portão de Aster',target:GATES341.filter(g=>g.c.name===c.name).sort((a,b)=>Math.hypot(a.x-player.x,a.z-player.z)-Math.hypot(b.x-player.x,b.z-player.z))[0]};}
  if(s1.s===2)return {actTitle:'ATO I · O CHAMADO',step:5,totalSteps:6,text:'Registre sua chegada com Lyra na Ordem da Fenda [E]',target:vendor('Lyra')};
  return {actTitle:'ATO I · O CHAMADO',step:6,totalSteps:6,text:'Faça o escambo da sua primeira arma com Kael para despertar sua Classe [E]',target:vendor('Kael')};
 }
 if(!window.Campaign327)return null;
 const activeMissions=Campaign327.active()||[];
 let m=null;
 if(run?.trackObj&&String(run.trackObj).startsWith('camp327:')){
  const tid=run.trackObj.slice(8);
  m=activeMissions.find(x=>x.id===tid)||(Campaign327.ACTS||[]).find(x=>x.id===tid)||(Campaign327.SIDE||[]).find(x=>x.id===tid);
 }
 if(!m)m=activeMissions.find(x=>x.act)||activeMissions[0];
 if(!m){
  const tr=typeof trackedObjective==='function'?trackedObjective():null;
  if(tr)return {actTitle:'OBJETIVO',step:1,totalSteps:1,text:tr.progress||tr.n||tr.d,target:null};
  return {actTitle:'MUNDO ABERTO',step:0,totalSteps:0,text:'Explore livremente. A história continua quando você quiser.',target:null};
 }
 const st=Campaign327.state(m.id);
 if(!st||st.done){
  return {actTitle:m.act?'ATO '+(['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII'][m.act-1]||m.act)+' · '+m.title.toUpperCase():'MISSÃO · '+m.title.toUpperCase(),step:m.steps?.length||1,totalSteps:m.steps?.length||1,text:m.consequence||'Missão concluída. Consulte o Diário para os próximos passos.',target:null};
 }
 const sp=m.steps[st.s],romans=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII'];
 const title=m.act?('ATO '+(romans[m.act-1]||m.act)+' · '+m.title.toUpperCase()):('MISSÃO · '+m.title.toUpperCase());
 const stepNum=st.s+1,total=m.steps.length;
 const desc=sp?sp.d.replace('{cidade}',st.city||'Aster'):'Objetivo em andamento';
 const tgt=Campaign327.target()||(sp?.npc?vendor(sp.npc):st.pos?{x:st.pos[0],z:st.pos[1]}:null);
 return {actTitle:title,step:stepNum,totalSteps:total,text:desc,target:tgt};
}
const arrow=new THREE.Group(),gold=new THREE.MeshBasicMaterial({color:0xffcf70,depthTest:false});
const tip=new THREE.Mesh(new THREE.ConeGeometry(.24,.48,4),gold);tip.rotation.z=Math.PI;arrow.add(tip);const stem=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.38,8),gold);stem.position.y=.35;arrow.add(stem);arrow.traverse(o=>o.renderOrder=990);
const pulse=new THREE.Mesh(new THREE.RingGeometry(.65,.76,40),new THREE.MeshBasicMaterial({color:0xffcf70,transparent:true,opacity:.55,side:THREE.DoubleSide,depthWrite:false}));pulse.rotation.x=-Math.PI/2;
/* v428: seta e anel ficam na altura absoluta (terrH); sem a marca o relevo do shader somava a altura de novo e flutuavam em morro */
arrow.userData.terrainAbsolute245=true;pulse.userData.terrainAbsolute245=true;
let current=null;
function refresh(){
 if(!started||!player||!run||!profile||profile.creationPending91){hud.hidden=true;arrow.visible=pulse.visible=false;return}
 document.body.classList.toggle('guided401',API.guided());current=targetAndText();hud.hidden=!current; if(!current)return;
 const titleTxt=current.actTitle?(current.actTitle+(current.totalSteps>1?' · '+current.step+'/'+current.totalSteps:'')):(current.step?'ATO I · O CHAMADO · '+current.step+'/6':'MUNDO ABERTO · HISTÓRIA OPCIONAL');
 hud.querySelector('small').textContent=titleTxt;hud.querySelector('p').textContent=current.text;{const q=qui();collapsed=q.min;hud.hidden=!!q.closed;hud.querySelector('p').hidden=collapsed;hud.querySelector('[data-q="min"]').textContent=collapsed?'+':'−';hud.querySelector('[data-q="min"]').setAttribute('aria-label',collapsed?'Mostrar objetivo':'Minimizar objetivo')}
}
setInterval(refresh,200);
function pose(f,dt){if(!f?.m?.model||!f.down)return;const m=f.m;
 if(m.npc456){const near=Math.hypot(player.x-f.x,player.z-f.z)<12,want=near?Math.atan2(player.x-f.x,player.z-f.z):-2.1;m.root.rotation.y+=Math.atan2(Math.sin(want-m.root.rotation.y),Math.cos(want-m.root.rotation.y))*Math.min(1,dt*2);return} /* v456: Edran do Tripo usa o clipe sentado */
 if(!m.pose401){m.mixer?.stopAllAction();m.pose401={};m.model.traverse(o=>{if(o.isBone)m.pose401[o.name]={bone:o,q:o.quaternion.clone()}});m.model.traverse(o=>{if(o.isMesh&&/arm|body|chest/i.test(o.name)){o.material=o.material.clone();o.material.color.multiplyScalar(.72);if(/arm/i.test(o.name))o.material.color.lerp(new THREE.Color(0x631f23),.3)}})}
 const t=performance.now()/1000,b=m.pose401;const set=(n,x,y=0,z=0)=>{const names={thigh_l:'upperleg.l',thigh_r:'upperleg.r',shin_l:'lowerleg.l',shin_r:'lowerleg.r',upperarm_l:'upperarm.l',upperarm_r:'upperarm.r',forearm_l:'lowerarm.l'};const v=b[n]||b[names[n]];if(v)v.bone.quaternion.copy(v.q).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(x,y,z)))};
 const near=Math.hypot(player.x-f.x,player.z-f.z)<12,want=near?Math.atan2(player.x-f.x,player.z-f.z):-2.1;
 m.root.rotation.y+=Math.atan2(Math.sin(want-m.root.rotation.y),Math.cos(want-m.root.rotation.y))*Math.min(1,dt*2);
 m.body.position.y=(m.edran452?-0.22:0.05)+Math.sin(t*3)*.017;
 if(m.edran452)m.body.rotation.z=-0.08;
 set('thigh_l',-1.25);set('thigh_r',-1.1);set('shin_l',1.6);set('shin_r',1.4);set('spine',.22+Math.sin(t*3)*.035);set('chest',.12);set('head',-.12,near?.12:0);set('upperarm_l',.8,0,-.9);set('forearm_l',.9);set('upperarm_r',API.conversation?.name==='Edran'?-0.5+Math.sin(t*2)*.08:.4,0,.8);set('forearm_r',.5);
}
const cam0=camUpdate;camUpdate=function(dt){cam0.apply(this,arguments);if(!started||!player)return;
 pose(edran(),dt);
 const c=API.conversation,shot=API.reclaiming();
 document.body.classList.toggle('story401',!!(c||shot));
 if(shot){W377.releaseAll();const p=shot.root.position,y=terrH(p.x,p.z),a=Math.atan2(player.x-p.x,player.z-p.z)+.65,dist=Math.max(8.5,shot.sky*1.15);if(!shot.camera402)shot.camera402=camera.position.clone();shot.camera402.lerp(new THREE.Vector3(p.x+Math.sin(a)*dist,y+shot.sky*.48,p.z+Math.cos(a)*dist),1-Math.exp(-dt*5));camera.position.copy(shot.camera402);camera.lookAt(p.x,y+shot.sky*.43,p.z);}
 if(c){c.elapsed+=dt;const text=c.lines[c.index],count=Math.min(text.length,Math.floor(c.elapsed*35));if(count>c.count){c.count=count;overlay.querySelector('p').textContent=text.slice(0,count);if(count%3===0)try{beep(c.name==='Lyra'?240:155,.025,.008,'triangle')}catch(_){}}
  if(c.target){const p=c.target,y=terrH(p.x,p.z),a=Math.atan2(player.x-p.x,player.z-p.z),to=new THREE.Vector3(p.x+Math.sin(a+.35)*3.4,y+1.9,p.z+Math.cos(a+.35)*3.4);c.position.lerp(to,1-Math.exp(-dt*3));camera.position.copy(c.position);camera.lookAt(p.x,y+(c.name==='Edran'?.85:1.5),p.z);if(p.m&&!p.down)p.m.root.rotation.y=a;}
 }
 if(!c&&!shot)Campaign327.rescueCamera(dt);
 const p=current?.target,show=!!p&&L.mode==='world'&&!collapsed&&!c&&!shot;arrow.visible=pulse.visible=show;
 if(show){if(arrow.parent!==scene)scene.add(arrow,pulse);const y=terrH(p.x,p.z),t=performance.now()/1000;arrow.position.set(p.x,y+3.3+Math.sin(t*2.8)*.18,p.z);pulse.position.set(p.x,y+.08,p.z);pulse.scale.setScalar(1+(Math.sin(t*2.8)+1)*.22);}
};
API.targetAndText=targetAndText;
})();
