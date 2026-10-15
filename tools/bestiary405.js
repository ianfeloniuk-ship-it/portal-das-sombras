/* Primeva: isolated, rotatable bestiary. Knowledge and combat rules remain in their original helpers. */
(()=>{
'use strict';
const T=THREE,legacy=window.Bestiary324;
if(!legacy)return;
const portraits=new Map(),owned=new WeakSet();
let active=null,threat=0;
const count=k=>k.startsWith('boss:')?(profile.bossSeen308?.[k.slice(5)]?.kills||0):(profile.bestiary?.[k]||0);
const name=k=>k.startsWith('boss:')?k.slice(5):KINDS[k]?.n||'';
const keys=()=>[...Object.keys(KINDS).filter(k=>!KINDS[k].alias308),...(window.Variants308?.bossNames||[]).map(n=>'boss:'+n)];
function specification(k){
 if(!k.startsWith('boss:'))return KINDS[k]||null;
 const b=ALLBOSS().find(b=>b.n===name(k));if(!b)return null;
 const type=(b.types||[b.type])[0],skull=type==='soulrain'||type==='legion';
 return {...b,gk:{seismic:'Knight',fury:'Barbarian',soulrain:'Skeleton_Mage',legion:'Skeleton_Warrior'}[type],gtint:b.body,wep:type==='soulrain'?'staff':type==='fury'?'axe':'sword',scale:b.scale||2.2,helm:!skull,skin:skull?0xe8e0cc:0xd8d8e0,eye:b.p3?0xffffff:0xff2020};
}
function createModel(k){
 const K=specification(k);if(!K)return null;
 const o={...K,tint:K.gtint,atkClip:K.clip};let m;
 // Follow the live species mapping, but never fall through to an unrelated placeholder while loading.
 if(K.goblin118)m=makeGoblin118(o);
 else if(K.mon&&MON.list[K.mon]&&MON_DEF[K.mon])m=makeMonster(o);
 else if(K.mon&&MON_DEF[K.mon]?.actor&&MODELS.ok&&MODELS.list.Knight)m=makeArmoredMonster(o);
 else if(!K.mon&&K.gk&&MODELS.ok&&MODELS.list[K.gk])m=makeActor(o);
 else return null;
 owned.add(m);
 try{
  if(K.variant&&window.Variants308?.dress)Variants308.dress({m,kind:k,x:0,z:0,name:K.n});
  if(m.mixer){gPlay(m,'Idle',false,1);m.mixer.update(0)}
  else if(m.goblin118)animGoblin118(m,{move:0,atk:0,wind:0,dead:0},0);
  m.root.updateMatrixWorld(true);return m;
 }catch(e){disposeModel(m);throw e}
}
function disposeModel(m){
 if(!m||!owned.has(m))return;
 m.mixer?.stopAllAction();m.mixer?.uncacheRoot(m.model||m.root);
 // Factories clone these materials. Texture maps, cached geometry and variant shaders remain shared.
 for(const mat of new Set([...(m.mats||[]),m.eyeMat]))if(mat&&!mat.userData?.shared)mat.dispose();
 const skeletons=new Set();m.root.traverse(o=>{if(o.isSkinnedMesh&&o.skeleton)skeletons.add(o.skeleton)});
 skeletons.forEach(s=>s.dispose?.());m.root.parent?.remove(m.root);owned.delete(m);
}
function dispose(){if(active){const v=active;active=null;v.destroy()}}
function remember(k,canvas){try{const small=document.createElement('canvas');small.width=360;small.height=260;const c=small.getContext('2d'),fit=Math.min(360/canvas.width,260/canvas.height),w=canvas.width*fit,h=canvas.height*fit;c.drawImage(canvas,(360-w)/2,(260-h)/2,w,h);portraits.delete(k);portraits.set(k,small.toDataURL('image/webp',.8));if(portraits.size>16)portraits.delete(portraits.keys().next().value)}catch(_){}}
function catalog(){dispose();legacy.catalog();decorateCatalog()}
function decorateCatalog(){
 const grid=document.querySelector('.dex324-grid');if(!grid)return;
 for(const card of grid.querySelectorAll('[data-v]')){const k=card.dataset.v,src=portraits.get(k);if(!count(k)||!src||card.querySelector('img'))continue;const img=document.createElement('img');img.src=src;img.alt='';img.loading='lazy';card.prepend(img)}
}
function button(label,action,value,title=''){return '<button type="button" class="btn" data-dex405="'+action+'"'+(value!==undefined?' data-value="'+value+'"':'')+(title?' title="'+title+'"':'')+'>'+label+'</button>'}
function open(k){
 if(!k||!count(k)||!name(k)||!specification(k))return catalog();
 dispose();view=()=>open(k);
 const all=keys(),n=count(k),boss=k.startsWith('boss:'),known=all.filter(x=>count(x)>0),idx=known.indexOf(k);
 let facts='';
 if(boss){const lore=Variants308.BOSSLORE[name(k)];facts=['Descrição','Alimentação','Comportamento'].map((label,i)=>row(label,lore?.[i]||'Ainda não registrado.','')).join('')}
 else{const lvl=bestLvl(k),next=BEST_STEPS.find(s=>n<s[0]);facts='<div class="dex405-mastery"><b>'+(lvl?safeText(lvl[2]):'Domínio da espécie')+'</b><span>'+(lvl?'+'+Math.round(lvl[1]*100)+'% de dano':'Sem bônus de dano')+'</span><small>'+(next?Math.max(0,next[0]-n)+' abates para '+safeText(next[2]):'Máximo')+'</small></div><details open><summary>Conhecimento</summary><div class="sysline">'+Bestiary294.loreHtml(k,n).replace(/^<br>/,'')+'</div></details><details class="dex405-combat"><summary>Combate</summary><div class="sysline">'+bestStats293(k,threat)+bestInfo(k,n)+'</div></details>'}
 const h='<section id="dex405"><nav class="dex405-nav" aria-label="Navegação do bestiário">'+button('← Bestiário','catalog')+'<span>#'+String(all.indexOf(k)+1).padStart(3,'0')+' · '+n+' abate'+(n===1?'':'s')+(boss?' · Chefe':'')+'</span><div>'+button('←','entry',idx>0?idx-1:known.length-1,'Criatura descoberta anterior')+button('→','entry',(idx+1)%known.length,'Próxima criatura descoberta')+'</div></nav><div class="dex405-layout"><div class="dex405-exhibit"><div id="dexStage405" class="dex405-stage" tabindex="0" role="group" aria-label="Modelo de '+gearText(name(k))+'. Arraste para girar. Setas giram e inclinam; mais e menos ajustam o zoom; Home recentraliza."><div class="dex405-loading" role="status">Carregando criatura…</div></div><div class="dex405-controls" aria-label="Visualização da criatura"><div>'+button('Frente','angle',0)+button('Lado','angle',90)+button('Costas','angle',180)+'</div><div>'+button('−','zoom',1.15,'Afastar')+button('+','zoom',.87,'Aproximar')+button('Recentrar','reset')+'</div></div><p class="dex405-hint">Arraste para girar · use dois dedos para aproximar</p></div><aside class="dex405-facts">'+facts+'</aside></div></section>';
 openModal('FICHA · '+name(k),h);
 const section=$('dex405');if(!section)return;
 section.addEventListener('click',e=>{const b=e.target.closest('[data-dex405]');if(!b)return;e.preventDefault();e.stopPropagation();const a=b.dataset.dex405,v=Number(b.dataset.value);if(a==='catalog')catalog();else if(a==='entry')open(known[v]);else active?.control(a,v)});
 const select=$('dexThreat351');if(select)select.addEventListener('change',()=>{threat=Number(select.value);const scroll=$('mb').scrollTop;open(k);$('dex405')?.querySelector('.dex405-combat')?.setAttribute('open','');$('mb').scrollTop=scroll;$('dexThreat351')?.focus()});
 active=viewer(k,$('dexStage405'),section);
}
function viewer(k,stage,section){
 let m=null,renderer405=null,raf=0,timer=0,destroyed=false,elapsed=0,last=0,angle=0,pitch=.08,zoom=1,radius=1,fit=1,pinch=0;
 const scene405=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.01,1000),pivot=new T.Group(),pointers=new Map(),listeners=[];
 scene405.add(pivot);scene405.add(new T.HemisphereLight(0xe5f5ef,0x263c3e,1.1));
 const key=new T.DirectionalLight(0xffebcd,1.15);key.position.set(3,5,6);scene405.add(key);
 const fill=new T.DirectionalLight(0x88c8bd,.45);fill.position.set(-4,2,-3);scene405.add(fill);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const on=(el,type,fn,opts)=>{el.addEventListener(type,fn,opts);listeners.push(()=>el.removeEventListener(type,fn,opts))};
 function status(text){stage.querySelector('[role=status]')?.remove();const el=document.createElement('div');el.className='dex405-loading';el.setAttribute('role','status');el.textContent=text;stage.append(el)}
 function frame(){
  if(!renderer405||destroyed)return;
  pivot.rotation.y=angle;const distance=fit*zoom;
  camera.position.set(0,Math.sin(pitch)*distance,Math.cos(pitch)*distance);camera.lookAt(0,0,0);camera.updateMatrixWorld();renderer405.render(scene405,camera);
  stage.dataset.angle=String(Math.round(angle*180/Math.PI));stage.dataset.zoom=zoom.toFixed(2);
  for(const b of section.querySelectorAll('[data-dex405=angle]'))b.setAttribute('aria-pressed',String(Math.abs(((angle*180/Math.PI-Number(b.dataset.value)+540)%360)-180)<1));
 }
 function resize(){if(!renderer405)return;const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer405.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();const halfV=camera.fov*Math.PI/360,halfH=Math.atan(Math.tan(halfV)*camera.aspect);fit=radius/Math.sin(Math.min(halfV,halfH))*1.1;camera.near=Math.max(.001,radius*.002);camera.far=Math.max(100,radius*40);camera.updateProjectionMatrix();frame()}
 function animate(now){if(destroyed)return;const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;elapsed+=dt;if(m?.mixer)m.mixer.update(dt);else if(m?.goblin118)animGoblin118(m,{move:0,atk:0,wind:0,dead:0},elapsed);frame();raf=requestAnimationFrame(animate)}
 function control(a,v){if(!m)return;if(a==='angle'){angle=v*Math.PI/180;pitch=.08}else if(a==='zoom')zoom=Math.min(2,Math.max(.55,zoom*v));else if(a==='reset'){angle=0;pitch=.08;zoom=1}frame()}
 function fallback(){stage.dataset.ready='unavailable';const image=portraits.get(k);if(image){const img=document.createElement('img');img.src=image;img.alt=name(k);img.className='dex405-fallback';stage.prepend(img)}status(image?'Retrato registrado · 3D indisponível agora':'Modelo indisponível agora');for(const b of section.querySelectorAll('[data-dex405=angle],[data-dex405=zoom],[data-dex405=reset]'))b.disabled=true;const retry=document.createElement('button');retry.type='button';retry.className='btn dex405-retry';retry.textContent='Tentar novamente';retry.onclick=()=>open(k);stage.append(retry)}
 const began=performance.now();
 function load(){
  if(destroyed||!stage.isConnected)return;
  try{m=createModel(k);if(!m){if(performance.now()-began<25000){timer=setTimeout(load,200);return}fallback();return}
   // CPU skinning handles the project's normalized byte/short weights, unlike Box3 in Three r128.
   const bounds=monsterBounds132(m.root),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
   if(bounds.isEmpty()||!Number.isFinite(size.length()))throw Error('Limites inválidos');
   radius=Math.max(.1,size.length()/2);m.root.position.sub(center);pivot.add(m.root);
   renderer405=new T.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});renderer405.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
   // makeMonster applies legacy color correction based on the main renderer; match that encoding.
   renderer405.outputEncoding=typeof renderer!=='undefined'?renderer.outputEncoding:T.LinearEncoding;
   renderer405.setClearColor(0x000000,0);renderer405.domElement.setAttribute('aria-hidden','true');stage.replaceChildren(renderer405.domElement);stage.dataset.ready='true';stage.dataset.model=m.mon||m.goblin118||specification(k).gk;
   resize();remember(k,renderer405.domElement);last=performance.now();if(!reduced)raf=requestAnimationFrame(animate);
   on(renderer405.domElement,'webglcontextlost',e=>{e.preventDefault();if(destroyed||!renderer405)return;cancelAnimationFrame(raf);disposeModel(m);m=null;const lost=renderer405;renderer405=null;lost.renderLists.dispose();lost.dispose();lost.domElement.remove();fallback()});
  }catch(e){console.warn('Bestiário: modelo indisponível',k,e);disposeModel(m);m=null;renderer405?.dispose();renderer405?.forceContextLoss();renderer405=null;fallback()}
 }
 const ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(resize):null;ro?.observe(stage);on(window,'resize',resize);
 const distance=()=>{const p=[...pointers.values()];return p.length>1?Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y):0};
 on(stage,'pointerdown',e=>{if(e.target.closest('button')||e.button!==0&&e.pointerType!=='touch')return;e.preventDefault();e.stopPropagation();stage.focus({preventScroll:true});pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});stage.setPointerCapture?.(e.pointerId);pinch=distance();stage.classList.add('dragging')});
 on(stage,'pointermove',e=>{const p=pointers.get(e.pointerId);if(!p)return;e.preventDefault();e.stopPropagation();const dx=e.clientX-p.x,dy=e.clientY-p.y;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size>1){const d=distance();if(pinch>0&&d>0)zoom=Math.min(2,Math.max(.55,zoom*pinch/d));pinch=d}else{angle+=dx*.012;pitch=Math.min(.7,Math.max(-.35,pitch+dy*.006))}frame()});
 const release=e=>{pointers.delete(e.pointerId);pinch=distance();if(!pointers.size)stage.classList.remove('dragging')};
 for(const type of ['pointerup','pointercancel','lostpointercapture'])on(stage,type,release);
 on(stage,'wheel',e=>{e.preventDefault();e.stopPropagation();control('zoom',Math.exp(Math.max(-100,Math.min(100,e.deltaY))*.002))},{passive:false});
 on(window,'keydown',e=>{if(!stage.contains(document.activeElement))return;let handled=true;switch(e.key){case 'ArrowLeft':angle-=.15;break;case 'ArrowRight':angle+=.15;break;case 'ArrowUp':pitch=Math.min(.7,pitch+.08);break;case 'ArrowDown':pitch=Math.max(-.35,pitch-.08);break;case '+':case '=':control('zoom',.87);break;case '-':control('zoom',1.15);break;case 'Home':control('reset');break;default:handled=false}if(handled){e.preventDefault();e.stopImmediatePropagation();frame()}},true);
 // Defer initial work so active owns this viewer before a fast cache hit or failure.
 timer=setTimeout(load,0);
 return {stage,control,destroy(){if(destroyed)return;destroyed=true;clearTimeout(timer);cancelAnimationFrame(raf);ro?.disconnect();listeners.forEach(off=>off());disposeModel(m);m=null;renderer405?.renderLists.dispose();renderer405?.dispose();renderer405?.forceContextLoss();renderer405?.domElement.remove();renderer405=null;pointers.clear();scene405.clear()}};
}
const previous=extraActions;extraActions=function(a,v){if(a==='dexentry324'){open(v);return 'close0'}if(a==='bestv'){catalog();return 'close0'}return previous.apply(this,arguments)};
legacy.open=open;bestView=catalog;
const observer=new MutationObserver(()=>{if(active&&(!active.stage.isConnected||$('modal').hidden))dispose();decorateCatalog()});
observer.observe($('mb'),{childList:true,subtree:true});observer.observe($('modal'),{attributes:true,attributeFilter:['hidden']});
addEventListener('pagehide',dispose);
window.Bestiary405={open,catalog,createModel,disposeModel,dispose,get active(){return !!active}};
})();
