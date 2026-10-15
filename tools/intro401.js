/* v401: guided prologue, persistent objective and story camera. */
(()=>{
'use strict';
const API=window.Intro401={conversation:null};
API.guided=()=>!!(profile?.classless&&Campaign327.state('a1')&&!Campaign327.state('a1').done);
API.reclaiming=()=>window.Reclaim372?.jobs.find(j=>j.intro)||[...(window.Reclaim372?.pending?.values()||[])].find(j=>j.intro);
const css=document.createElement('style');css.textContent=`
#quest401{position:fixed;right:22px;top:200px;width:min(300px,35vw);padding:15px 18px;background:linear-gradient(100deg,#111722ed,#192130d9);border-left:2px solid #e7bb68;color:#f8edda;z-index:72;font:14px/1.5 Georgia,serif;box-shadow:0 6px 25px #0005;pointer-events:auto}
#quest401 small{display:block;color:#e7bb68;letter-spacing:1.5px;font:10px/1.6 sans-serif;margin-bottom:6px}#quest401 p{margin:0}#quest401 button{float:right;background:none;border:0;color:#e7bb68;cursor:pointer}#quest401[hidden],#dialog401[hidden]{display:none}
#dialog401{position:fixed;inset:0;z-index:9000;background:linear-gradient(#0009,transparent 22%,transparent 55%,#000c);display:flex;align-items:flex-end;justify-content:center;padding:0 5vw 5vh;box-sizing:border-box}
#dialog401 article{width:min(850px,90vw);background:#101722f5;border-top:2px solid #d4ae69;padding:22px 30px;color:#f7efdf;box-shadow:0 8px 40px #0009;font:18px/1.6 Georgia,serif}#dialog401 h2{font:13px sans-serif;letter-spacing:3px;color:#e7bb68;margin:0 0 12px}#dialog401 p{min-height:58px;margin:0 0 16px}#dialog401 button{float:right;background:#332d22;color:#ffe2ab;border:1px solid #8b754f;padding:8px 18px;cursor:pointer}#dialog401 footer{height:36px;font:11px sans-serif;color:#adaca6}
body.story401 #stat,body.story401 #mission,body.story401 #history95,body.story401 #notice356,body.story401 #btns,body.story401 #quest401{visibility:hidden}body.guided401 #mission{display:none}
@media(max-width:640px){#quest401{top:145px;right:10px;width:210px;max-width:55vw;font-size:12px;padding:10px}#dialog401 article{padding:15px;font-size:15px}}
`;document.head.append(css);
const hud=document.createElement('aside');hud.id='quest401';hud.hidden=true;hud.innerHTML='<button aria-label="Ocultar ou mostrar objetivo">−</button><small></small><p></p>';document.body.append(hud);
let collapsed=false;hud.querySelector('button').onclick=()=>{if(profile.openWorld401){collapsed=!collapsed;hud.querySelector('p').hidden=collapsed;hud.querySelector('button').textContent=collapsed?'+':'−'}};
const overlay=document.createElement('section');overlay.id='dialog401';overlay.hidden=true;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Diálogo da história');overlay.innerHTML='<article><h2></h2><p></p><footer><span>F / Enter · avançar</span><button>Continuar</button></footer></article>';document.body.append(overlay);
function vendor(name){return npcs.filter(n=>!n.gone&&(n.short===name||n.name===name||({guild:'Lyra',wep:'Kael'})[n.shop]===name)).sort((a,b)=>Math.hypot(a.x-player.x,a.z-player.z)-Math.hypot(b.x-player.x,b.z-player.z))[0]}
function edran(){return Campaign327.W.get('a1')?.figs.find(f=>f?.name==='Edran')}
API.dialog=(name,lines,done)=>{
 if(API.conversation||API.reclaiming())return;
 const target=name==='Edran'?edran():vendor(name);
 API.conversation={name,lines,done,target,index:0,count:0,elapsed:0,paused,focus:document.activeElement,position:camera.position.clone(),quaternion:camera.quaternion.clone()};
 paused=true;W377.releaseAll();overlay.hidden=false;document.body.classList.add('story401');overlay.querySelector('h2').textContent=name.toUpperCase()+' · '+(name==='Edran'?'GUARDA DA ORDEM':name==='Lyra'?'ORDEM DA FENDA':'FERREIRO');overlay.querySelector('p').textContent='';overlay.querySelector('button').focus();
};
function next(){const c=API.conversation;if(!c)return;const text=c.lines[c.index];if(c.count<text.length){c.count=text.length;overlay.querySelector('p').textContent=text;return}if(++c.index<c.lines.length){c.count=0;c.elapsed=0;overlay.querySelector('p').textContent='';return}API.conversation=null;overlay.hidden=true;document.body.classList.remove('story401');paused=c.paused;W377.releaseAll();c.focus?.focus?.();c.done();refresh()}
overlay.querySelector('button').onclick=next;
addEventListener('keydown',e=>{if(!API.conversation&&!API.reclaiming())return;e.preventDefault();e.stopImmediatePropagation();if(!e.repeat&&['KeyF','Enter','Space'].includes(e.code))next()},true);
addEventListener('keyup',e=>{if(API.conversation||API.reclaiming()){e.preventDefault();e.stopImmediatePropagation()}},true);
function targetAndText(){
 const s=Campaign327.state('a1');if(!s)return null;
 if(!s.done){
  const w=Campaign327.W.get('a1');
  if(s.s===0){if(!s.helped401&&!s.fightDone&&!s.killed)return {step:1,text:'Ajude o guarda Edran na carroça tombada [F]',target:edran()};
   if(API.reclaiming())return {step:2,text:'A Mão do Arquiteto está recolhendo a criatura…',target:null};
   if(!s.fightDone)return {step:2,text:'Derrote a criatura da Fenda com os punhos',target:w?.foes.find(e=>!e.dead)};
   return {step:3,text:'Fale com Edran [F]',target:edran()};}
  if(s.s===1){const c=nearestCity(player.x,player.z).c;return {step:4,text:'Siga pela estrada até o Portão de Aster',target:GATES341.filter(g=>g.c.name===c.name).sort((a,b)=>Math.hypot(a.x-player.x,a.z-player.z)-Math.hypot(b.x-player.x,b.z-player.z))[0]};}
  if(s.s===2)return {step:5,text:'Registre sua chegada com Lyra na Ordem da Fenda [F]',target:vendor('Lyra')};
  return {step:6,text:'Faça o escambo da sua primeira arma com Kael para despertar sua Classe [F]',target:vendor('Kael')};
 }
 const m=Campaign327.active().find(m=>m.act);if(!m)return {text:'Explore livremente. A história continua quando você quiser.'};const st=Campaign327.state(m.id),sp=m.steps[st.s];return {text:sp.d.replace('{cidade}',st.city||'Aster'),target:sp.npc?vendor(sp.npc):st.pos?{x:st.pos[0],z:st.pos[1]}:null};
}
const arrow=new THREE.Group(),gold=new THREE.MeshBasicMaterial({color:0xffcf70,depthTest:false});
const tip=new THREE.Mesh(new THREE.ConeGeometry(.24,.48,4),gold);tip.rotation.z=Math.PI;arrow.add(tip);const stem=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.38,8),gold);stem.position.y=.35;arrow.add(stem);arrow.traverse(o=>o.renderOrder=990);
const pulse=new THREE.Mesh(new THREE.RingGeometry(.65,.76,40),new THREE.MeshBasicMaterial({color:0xffcf70,transparent:true,opacity:.55,side:THREE.DoubleSide,depthWrite:false}));pulse.rotation.x=-Math.PI/2;
let current=null;
function refresh(){
 if(!started||!player||!run||!profile||profile.creationPending91){hud.hidden=true;arrow.visible=pulse.visible=false;return}
 document.body.classList.toggle('guided401',API.guided());current=targetAndText();hud.hidden=!current; if(!current)return;
 hud.querySelector('small').textContent=current.step?'ATO I · O CHAMADO · '+current.step+'/6':'MUNDO ABERTO · HISTÓRIA OPCIONAL';hud.querySelector('p').textContent=current.text;hud.querySelector('button').hidden=!profile.openWorld401;
}
setInterval(refresh,200);
function pose(f,dt){if(!f?.m?.model||!f.down)return;const m=f.m;
 if(!m.pose401){m.mixer?.stopAllAction();m.pose401={};m.model.traverse(o=>{if(o.isBone)m.pose401[o.name]={bone:o,q:o.quaternion.clone()}});m.model.traverse(o=>{if(o.isMesh&&/arm|body|chest/i.test(o.name)){o.material=o.material.clone();o.material.color.multiplyScalar(.72);if(/arm/i.test(o.name))o.material.color.lerp(new THREE.Color(0x631f23),.3)}})}
 const t=performance.now()/1000,b=m.pose401;const set=(n,x,y=0,z=0)=>{const names={thigh_l:'upperleg.l',thigh_r:'upperleg.r',shin_l:'lowerleg.l',shin_r:'lowerleg.r',upperarm_l:'upperarm.l',upperarm_r:'upperarm.r',forearm_l:'lowerarm.l'};const v=b[names[n]||n];if(v)v.bone.quaternion.copy(v.q).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(x,y,z)))};
 const near=Math.hypot(player.x-f.x,player.z-f.z)<12,want=near?Math.atan2(player.x-f.x,player.z-f.z):-2.1;
 m.root.rotation.y+=Math.atan2(Math.sin(want-m.root.rotation.y),Math.cos(want-m.root.rotation.y))*Math.min(1,dt*2);
 m.body.position.y=-.25+Math.sin(t*3)*.017;
 set('thigh_l',-1.25);set('thigh_r',-1.1);set('shin_l',1.6);set('shin_r',1.4);set('spine',.22+Math.sin(t*3)*.035);set('chest',.12);set('head',-.12,near?.12:0);set('upperarm_l',-.35,0,-.24);set('forearm_l',-.9);set('upperarm_r',API.conversation?.name==='Edran'?-.85+Math.sin(t*2)*.08:.2,0,.2);
}
const cam0=camUpdate;camUpdate=function(dt){cam0.apply(this,arguments);if(!started||!player)return;
 pose(edran(),dt);
 const c=API.conversation,shot=API.reclaiming();
 document.body.classList.toggle('story401',!!(c||shot));
 if(shot){W377.releaseAll();const p=shot.root.position,y=terrH(p.x,p.z),a=Math.atan2(player.x-p.x,player.z-p.z)+.65,dist=Math.max(8.5,shot.sky*1.15);if(!shot.camera402)shot.camera402=camera.position.clone();shot.camera402.lerp(new THREE.Vector3(p.x+Math.sin(a)*dist,y+shot.sky*.48,p.z+Math.cos(a)*dist),1-Math.exp(-dt*5));camera.position.copy(shot.camera402);camera.lookAt(p.x,y+shot.sky*.43,p.z);}
 if(c){c.elapsed+=dt;const text=c.lines[c.index],count=Math.min(text.length,Math.floor(c.elapsed*35));if(count>c.count){c.count=count;overlay.querySelector('p').textContent=text.slice(0,count);if(count%3===0)try{beep(c.name==='Lyra'?240:155,.025,.008,'triangle')}catch(_){}}
  if(c.target){const p=c.target,y=terrH(p.x,p.z),a=Math.atan2(player.x-p.x,player.z-p.z),to=new THREE.Vector3(p.x+Math.sin(a+.35)*3.4,y+1.9,p.z+Math.cos(a+.35)*3.4);c.position.lerp(to,1-Math.exp(-dt*3));camera.position.copy(c.position);camera.lookAt(p.x,y+(c.name==='Edran'?.85:1.5),p.z);if(p.m&&!p.down)p.m.root.rotation.y=a;}
 }
 const p=current?.target,show=!!p&&L.mode==='world'&&!collapsed&&!c&&!shot;arrow.visible=pulse.visible=show;
 if(show){if(arrow.parent!==scene)scene.add(arrow,pulse);const y=terrH(p.x,p.z),t=performance.now()/1000;arrow.position.set(p.x,y+3.3+Math.sin(t*2.8)*.18,p.z);pulse.position.set(p.x,y+.08,p.z);pulse.scale.setScalar(1+(Math.sin(t*2.8)+1)*.22);}
};
API.targetAndText=targetAndText;
})();
