/* Visual de conversa aprovado por Ian (22/10/2026: «é isso que quero mas com a cara de Primeva» → «gostei»).
   v541: um sistema só. O diálogo de todos os NPCs é o do dialogo520.js (vendedores, caçadores, moradores, guardas,
   mendigos, brigas, encontros); esta camada só muda a forma: câmera de perto, nome/função/corações à esquerda de uma
   linha, perguntas à direita com o cristal da Fenda, fala embaixo e o Narrador no alto (os avisos viram fala dele).
   As falas da história (Intro401, #dialog401) usam o mesmo visual. Não intercepta mais a loja. */
(()=>{'use strict';
const css=`@import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&display=swap');
#skyrim-dialog,#dialog401{font-family:"Jost","Futura","Century Gothic","Chakra Petch",sans-serif!important}
#skyrim-dialog::before{content:'';position:fixed;inset:0;background:linear-gradient(90deg,transparent 32%,#00000030 46%,#000000b8 66%,#000000d8 100%),linear-gradient(0deg,#000000a0,transparent 26%);pointer-events:none}
#skyrim-dialog .skyrim-dialog-choices{left:calc(50% + 26px)!important;right:24px!important;top:50%!important;bottom:auto!important;width:auto!important;max-width:560px;transform:translateY(-50%);animation:none!important;gap:2px!important}
#skyrim-dialog .skyrim-dialog-header,#skyrim-dialog .skyrim-dialog-footer,#skyrim-dialog .skyrim-dialog-speaker,#skyrim-dialog .skyrim-choice-icon{display:none!important}
#skyrim-dialog .skyrim-choice-item{font-family:"Jost","Futura",sans-serif!important;font-weight:300!important;font-size:17px!important;line-height:1.35!important;color:#d6d0c2!important;padding:5px 0!important;transform:none!important;text-shadow:0 1px 4px #000!important;gap:8px!important}
#skyrim-dialog .skyrim-choice-item:hover,#skyrim-dialog .skyrim-choice-item.on541{color:#fff!important}
#skyrim-dialog .skyrim-choice-num{font-size:10px!important;font-weight:400!important;color:#8f8a80!important;min-width:12px}
#skyrim-dialog .t541{display:inline-block;width:14px;text-align:center;font-size:12px;margin-right:4px}
#skyrim-dialog .t541.q{color:#e9c46a}#skyrim-dialog .t541.n{color:#47d6c4}#skyrim-dialog .t541.a{color:#e88a9a}#skyrim-dialog .t541.l{color:#6f6c66}
#skyrim-dialog .skyrim-dialog-subtitles{bottom:calc(64px + env(safe-area-inset-bottom,0px))!important;width:min(760px,90vw)!important;animation:none!important}
#skyrim-dialog .skyrim-dialog-text{font-family:"Jost","Futura",sans-serif!important;font-weight:300!important;font-size:17px!important;line-height:1.45!important;color:#ece8df!important}
.who541{position:absolute;left:50%;top:52%;transform:translate(-100%,-50%);padding-right:22px;text-align:right;text-shadow:0 1px 6px #000,0 0 2px #000;color:#ece8df;pointer-events:none}
.who541 b{display:block;font:400 22px/1.1 "Jost",sans-serif;letter-spacing:.06em}
.who541 span{display:block;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#ddd6c8;margin-top:3px}
.who541 i{display:block;font-style:normal;font-size:12px;color:#e88a9a;letter-spacing:.1em;margin-top:4px}
.rail541{position:absolute;left:50%;top:22%;bottom:22%;width:1px;background:linear-gradient(180deg,transparent,#ffffffb0 18%,#ffffffb0 82%,transparent);pointer-events:none}
.gem541{position:absolute;left:50%;top:50%;width:22px;height:22px;transform:translate(-50%,-50%);transition:top .18s ease;pointer-events:none}
.gem541 svg{display:block;width:100%;height:100%;filter:drop-shadow(0 0 6px #9b6bffcc)}
.narr541{position:absolute;left:50%;transform:translateX(-50%);top:calc(40px + env(safe-area-inset-top,0px));width:min(620px,88vw);text-align:center;font:italic 300 13px/1.4 "Jost",sans-serif;color:#d8c8ff;text-shadow:0 1px 4px #000;opacity:0;transition:opacity .6s;pointer-events:none}
.narr541.show{opacity:1}
.narr541 b{font-style:normal;font-weight:500;letter-spacing:.2em;font-size:10px;color:#9b6bff;display:block;margin-bottom:2px}
.keys541{position:absolute;right:24px;bottom:calc(18px + env(safe-area-inset-bottom,0px));display:flex;gap:16px;font:400 11px "Jost",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#ddd6c8;text-shadow:0 1px 3px #000;pointer-events:none}
.keys541 kbd{font:400 11px "Jost",sans-serif;border:1px solid #ffffff70;padding:1px 7px;margin-right:6px;color:#fff;background:#00000060}
body.dlg520>*:not(#c):not(#skyrim-dialog):not(#modal):not(script):not(style),body.story401>*:not(#c):not(#dialog401):not(#modal):not(script):not(style){visibility:hidden!important}
#dialog401{background:linear-gradient(90deg,transparent 32%,#00000030 46%,#000000b8 66%,#000000d8 100%),linear-gradient(0deg,#000000a0,transparent 26%)!important;display:block!important;padding:0!important}
#dialog401[hidden]{display:none!important}
#dialog401 article{position:static!important;width:auto!important;background:none!important;border:0!important;box-shadow:none!important;padding:0!important;font:300 17px/1.45 "Jost",sans-serif!important;color:#ece8df!important}
#dialog401 h2{position:absolute;left:50%;top:52%;transform:translate(-100%,-50%);padding-right:22px;margin:0;text-align:right;font:400 13px/1.6 "Jost",sans-serif!important;letter-spacing:.2em!important;color:#ddd6c8!important;text-shadow:0 1px 6px #000;max-width:45vw}
#dialog401 p{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(64px + env(safe-area-inset-bottom,0px));width:min(760px,90vw);margin:0;text-align:center;text-shadow:0 1px 4px #000,0 0 2px #000;min-height:3em}
#dialog401 footer{position:absolute;left:calc(50% + 26px);top:calc(50% - 16px);display:flex;flex-direction:column;align-items:flex-start;gap:6px;background:none!important;border:0!important}
#dialog401 footer button{font:300 17px/1.35 "Jost",sans-serif!important;color:#fff!important;background:none!important;border:0!important;padding:5px 0!important;text-shadow:0 1px 4px #000;cursor:pointer;box-shadow:none!important;text-transform:none!important;letter-spacing:0!important}
#dialog401 footer span{position:absolute;left:0;top:44px;white-space:nowrap;font:400 11px "Jost",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#ddd6c8;text-shadow:0 1px 3px #000}
@media(max-width:760px){#skyrim-dialog::before,#dialog401{background:linear-gradient(0deg,#000000e0 0,#000000b0 42%,transparent 70%)!important}
 .who541,#dialog401 h2{left:24px;top:auto;bottom:calc(46% + 8px);transform:none;text-align:left;padding:0}.rail541,.gem541,.keys541{display:none}
 #skyrim-dialog .skyrim-dialog-choices{left:24px!important;right:24px!important;top:auto!important;bottom:calc(120px + env(safe-area-inset-bottom,0px))!important;transform:none}
 #skyrim-dialog .skyrim-choice-item,#dialog401 footer button{font-size:15px!important}#skyrim-dialog .skyrim-dialog-subtitles,#dialog401 p{bottom:calc(46px + env(safe-area-inset-bottom,0px))!important;font-size:14px}
 #dialog401 footer{left:24px;top:auto;bottom:calc(120px + env(safe-area-inset-bottom,0px))}.narr541{top:calc(70px + env(safe-area-inset-top,0px))}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const GEM='<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="g541" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d8c8ff"/><stop offset=".5" stop-color="#9b6bff"/><stop offset="1" stop-color="#47d6c4"/></linearGradient></defs><path d="M12 1 L21 12 L12 23 L3 12 Z" fill="url(#g541)"/><path d="M12 1 L21 12 L12 12 Z" fill="#ffffff55"/><path d="M12 5 L17 12 L12 19 L7 12 Z" fill="none" stroke="#ffffffaa" stroke-width=".8"/></svg>';
const ROLE={Lyra:'Ordem da Fenda',Mira:'Poções',Kael:'Ferreiro',Brann:'Defesa da vila',Dorian:'Mercador',Selene:'Banco'};
let cam=null,narrT=0,dlg=null;
function npcBy(name){if(typeof npcs==='undefined'||!player||!name)return null;const nm=String(name).replace(/\s*\[.*\]$/,'').trim().toLowerCase();let best=null,bd=12;for(const n of npcs){if(n.gone)continue;const a=String(n.name||'').toLowerCase(),b=String(n.short||'').toLowerCase();if(a!==nm&&b!==nm&&!a.startsWith(nm+' '))continue;const d=Math.hypot(n.x-player.x,n.z-player.z);if(d<bd){bd=d;best=n}}return best}
function camOn(npc){if(cam||!npc||typeof camera==='undefined')return;cam={save:window.camUpdate};
  try{const pm=player.m?.root||player.m;if(pm&&'visible' in pm){cam.pm=pm;cam.vis=pm.visible;pm.visible=false}}catch(e){}
  const dx=player.x-npc.x,dz=player.z-npc.z,d=Math.hypot(dx,dz)||1,ux=dx/d,uz=dz/d,px=-uz,pz=ux,h=terrH(npc.x,npc.z);
  const cx=npc.x+ux*2.6+px*.6,cz=npc.z+uz*2.6+pz*.6,tx=npc.x-px*.45,tz=npc.z-pz*.45;
  window.camUpdate=function(){camera.position.set(cx,h+1.7,cz);camera.lookAt(tx,h+1.35,tz)};
  try{npc.face=Math.atan2(dx,dz);if(npc.m?.root)npc.m.root.rotation.y=npc.face}catch(e){}}
function camOff(){if(!cam)return;window.camUpdate=cam.save;if(cam.pm)cam.pm.visible=cam.vis!==false;cam=null}
function hearts(name,npc){try{if(typeof affL==='function'&&typeof AFF_PERK!=='undefined'&&AFF_PERK[name]&&npc?.home?.name==='Aster'){const l=affL(name);return '♥'.repeat(l)+'♡'.repeat(10-l)}
  const m=profile?.dialogo520?.['cidade:'+name];if(m&&m.bond!=null)return '♥'.repeat(m.bond)+'♡'.repeat(Math.max(0,5-m.bond))}catch(e){}return ''}
function role(name,npc){if(!npc)return '';const city=npc.home?.name?' · '+npc.home.name:'';if(ROLE[name]&&npc.home?.name==='Aster')return ROLE[name]+city;
  return (npc.job523||({vendor:(npc.sign||'Comerciante'),hunter:'Caçador',citizen:'Morador'})[npc.kind]||'')+city}
function decorate(el){
  if(!el.querySelector('.who541')){el.insertAdjacentHTML('afterbegin','<div class="narr541"><b>NARRADOR</b><span></span></div><div class="who541"><b></b><span></span><i></i></div><div class="rail541"></div><div class="gem541">'+GEM+'</div><div class="keys541"><span><kbd>1-9</kbd>escolher</span><span><kbd>F</kbd>primeira</span><span><kbd>Esc</kbd>sair</span></div>')}
  const name=(document.getElementById('skyrim-speaker')?.textContent||'').trim(),npc=npcBy(name),base=name.replace(/\s*\[.*\]$/,'');
  const set=(sel,v)=>{const x=el.querySelector(sel);if(x&&x.textContent!==v)x.textContent=v};set('.who541 b',name);set('.who541 span',role(base,npc));set('.who541 i',hearts(base,npc));
  const items=[...el.querySelectorAll('.skyrim-choice-item')];
  items.forEach(it=>{const t=it.querySelector('.skyrim-choice-text');if(t&&!t.dataset.t541){t.dataset.t541=1;const m=/^([◆●♥⌂])\s*/.exec(t.textContent);if(m){const k={'◆':'q','●':'n','♥':'a','⌂':'l'}[m[1]];t.innerHTML='<span class="t541 '+k+'">'+m[1]+'</span>'+t.innerHTML.replace(/^([◆●♥⌂])\s*/,'')}}
    if(!it.dataset.h541){it.dataset.h541=1;it.addEventListener('mouseenter',()=>point(el,it))}});
  if(items[0]&&!el.querySelector('.on541'))point(el,items[0]);
  if(npc)camOn(npc)}
function point(el,it){el.querySelectorAll('.skyrim-choice-item').forEach(x=>x.classList.toggle('on541',x===it));const r=it.getBoundingClientRect();const g=el.querySelector('.gem541');if(g)g.style.top=(r.top+r.height/2)+'px'}
function narr(html){const el=document.querySelector('body.dlg520 #skyrim-dialog .narr541')||document.querySelector('body.story401 #dialog401 .narr541');if(!el)return false;const d=document.createElement('div');d.innerHTML=html;el.querySelector('span').textContent=d.textContent.trim();el.classList.add('show');clearTimeout(narrT);narrT=setTimeout(()=>el.classList.remove('show'),4500);return true}
/* avisos durante a conversa viram fala do Narrador (antes ficavam escondidos atrás da tela) */
if(typeof toast==='function'){const t0=toast;toast=function(h){if((document.body.classList.contains('dlg520')||document.body.classList.contains('story401'))&&narr(h))return;return t0.apply(this,arguments)}}
let busy=false;
function watch(){
  const el=document.getElementById('skyrim-dialog');
  if(el&&el!==dlg){dlg=el;const run=()=>{if(busy)return;busy=true;try{if(el.style.display!=='none')decorate(el);else camOff()}finally{busy=false}};new MutationObserver(run).observe(el,{attributes:true,attributeFilter:['style']});const list=document.getElementById('skyrim-choices-list');if(list)new MutationObserver(run).observe(list,{childList:true});const sp=document.getElementById('skyrim-speaker');if(sp)new MutationObserver(run).observe(sp,{childList:true,characterData:true,subtree:true});if(el.style.display!=='none')run()}
  const s=document.getElementById('dialog401');
  if(s&&!s.dataset.d541){s.dataset.d541=1;s.insertAdjacentHTML('afterbegin','<div class="narr541"><b>NARRADOR</b><span></span></div><div class="rail541"></div><div class="gem541">'+GEM+'</div>')}
  if(el&&el.style.display==='none'&&cam)camOff()}
setInterval(watch,500);watch();
window.Conversa539={camOn,camOff,narr};
})();
