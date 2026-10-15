/* Primeva: owned equipment, official art and an isolated rotating player model. */
(()=>{
'use strict';
const esc=gearText,labels={w:'Arma',a:'Armadura',h:'Elmo',g:'Luvas',b:'Botas'};
let selection=null,selectedUid=null,viewer=null,angle=.18,zoom=1;
const owned=sl=>[run.equip?.[sl],...(run.items||[]).filter(it=>it?.slot===sl)].filter((it,i,a)=>it&&a.findIndex(x=>x?.uid===it.uid)===i);
const art=(it,large=false)=>window.ItemArt405?.markup(it,{large})||'';
const hydrate=root=>window.ItemArt405?.hydrate(root);
function hero(){const s=statsFor(),metrics=[['Vida',s.maxhp],['Escudo',s.maxsh],['Mana',s.maxmp],['Ataque',Math.round(s.dmg)],['Defesa',Math.round(s.def*100)+'%'],['Velocidade',s.spd.toFixed(1)]];
 return '<section class="c405-hero"><div class="c405-model"><div class="c405-portrait" tabindex="0" role="group" aria-label="Viajante em 3D. Arraste ou use as setas para girar; mais e menos para aproximar."></div><div class="c405-view-controls"><button class="mini" data-c405-turn="-1" aria-label="Girar para a esquerda">←</button><button class="mini" data-c405-reset>Frente</button><button class="mini" data-c405-turn="1" aria-label="Girar para a direita">→</button></div><small class="c405-view-hint">Arraste para girar · modelo atual</small></div><div><div class="c405-kicker">VIAJANTE DA FENDA</div><h2 class="c405-title">'+esc(profile.name||'Viajante')+'</h2><p class="c405-sub">'+(profile.classless?'Ainda sem classe':esc(className()))+' · Nível '+run.level+' · Rank '+RANKS[rankOf()].id+'</p><div class="c405-metrics">'+metrics.map(([n,v])=>'<div class="c405-metric"><b>'+esc(v)+'</b><small>'+n+'</small></div>').join('')+'</div><p class="c405-gold">'+fmt(run.gold)+' ouro na bolsa</p></div></section>';
}
function relics(){const r=relics183(),keys=Object.keys(UNIQ183).filter(k=>r.own[k]);if(!keys.length)return '';
 return '<details class="c405-relics"><summary>Relíquias · '+r.eq.length+' em uso'+(keys.some(k=>r.vault[k])?' · '+keys.filter(k=>r.vault[k]).length+' no cofre':'')+'</summary><div class="c405-relic-list">'+keys.map(k=>{const u=UNIQ183[k],stored=r.vault[k],on=r.eq.includes(k);return '<div><b>'+esc(u.n)+'</b><small>'+esc(u.d)+'</small><div>'+btn(stored?'No cofre':on?'Retirar':'Equipar','relic',k,!stored,on?'on':'')+(player&&inCity(player.x,player.z)?btn(stored?'Retirar do cofre':'Guardar no cofre','relicvault',k):'')+'</div></div>'}).join('')+'</div></details>';
}
function wardrobe(){const slots=EQUIP_SLOTS.filter(sl=>owned(sl).length);if(selection&&!slots.includes(selection)){selection=null;selectedUid=null}
 return '<section class="c405-wardrobe" aria-label="Seu equipamento"><div class="sec">SEU EQUIPAMENTO</div>'+(slots.length?'<div class="c405-slots">'+slots.map(sl=>{const eq=run.equip[sl],list=owned(sl),it=eq||list[0];return '<button class="c405-slot mini" data-c405-slot="'+sl+'" aria-expanded="'+(selection===sl)+'">'+art(it)+'<b>'+labels[sl]+'</b><span>'+esc(eq?it.name:list.length+' na bolsa')+'</span><small>'+(eq?'Em uso':'Para equipar')+'</small></button>'}).join('')+'</div>':'<p class="c405-note">Seus equipamentos aparecerão aqui quando você adquirir uma peça.</p>')+'<div class="c405-selection"></div>'+relics()+'</section>';
}
function selectedItem(){const list=owned(selection);return list.find(it=>it.uid===selectedUid)||list[0]}
function selectionMarkup(){const it=selectedItem();if(!it)return '';selectedUid=it.uid;const eq=run.equip[selection],on=eq?.uid===it.uid,full=run.items.length>=bagCapacity353();
 const delta=it.slot==='w'?wDelta278(it):{d:itemSh(it)-itemSh(eq),u:' de escudo'},compare=on?'Em uso':delta.d?((delta.d>0?'+':'')+fmt(delta.d)+delta.u+' ao equipar'):'Mesmo bônus do equipamento atual';
 const meta=window.ItemArt405?.resolve?.(it),caption=meta?.status==='exact'?'Arte oficial da peça':meta?.status==='loading'?'Carregando arte da peça':'Arte oficial ainda não disponível';
 return '<div class="c405-selection-head"><h3>'+labels[selection]+'</h3><button class="mini" data-c405-close aria-label="Fechar seleção de equipamento">Fechar</button></div><div class="c405-picker"><div class="c405-picker-list">'+owned(selection).map(x=>'<button class="mini c405-picker-row" data-c405-item="'+esc(x.uid)+'" aria-pressed="'+(x.uid===it.uid)+'">'+art(x)+'<span><b>'+esc(x.name)+'</b><small>'+(eq?.uid===x.uid?'Em uso':'Na bolsa')+'</small></span></button>').join('')+'</div><div class="c405-item-detail">'+art(it,true)+'<div><h4>'+esc(it.name)+'</h4><p class="c405-item-stats">'+esc(statTxt(it).replace(/<[^>]*>/g,''))+'</p><p class="c405-compare">'+esc(compare)+'</p>'+btn(on?'Retirar':'Equipar',on?'unequip':'equip',on?it.slot:it.uid,!on||!full,on?'':'hot')+(on&&full?'<small class="c405-note">Bolsa cheia. Escolha outra peça para trocar.</small>':'')+'<small class="c405-art-caption">'+caption+'</small></div></div></div>';
}
function showSelection(){const mb=$('mb'),host=mb.querySelector('.c405-selection');if(!host)return;host.innerHTML=selection?selectionMarkup():'';host.hidden=!selection;mb.querySelectorAll('[data-c405-slot]').forEach(b=>b.setAttribute('aria-expanded',String(b.dataset.c405Slot===selection)));hydrate(host)}
function releaseClone(root){if(!root)return;const skeletons=new Set();root.traverse(o=>{if(o.isSkinnedMesh)skeletons.add(o.skeleton)});skeletons.forEach(s=>s.dispose?.());root.parent?.remove(root);/* Mesh geometry, materials and maps belong to the game. */}
function createViewer(host){const T=THREE;let renderer,clone=null,closed=false,timer,resize,last='',drag=null,center=new T.Vector3(),halfHeight=1.1,halfWidth=.5;
 try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0,0);renderer.outputEncoding=T.LinearEncoding;host.appendChild(renderer.domElement);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(32,1,.03,100),pivot=new T.Group();scene.add(pivot);scene.add(new T.HemisphereLight(0xe0e8d8,0x263c3b,.9));const light=new T.DirectionalLight(0xffe8c8,1.2);light.position.set(-2,4,4);scene.add(light);
 const draw=()=>{if(closed||!clone)return;const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();const tangent=Math.tan(camera.fov*Math.PI/360),distance=(Math.max(halfHeight/tangent,halfWidth/tangent/camera.aspect)+halfWidth)*1.08*zoom;camera.position.set(0,center.y,distance);camera.lookAt(0,center.y,0);pivot.rotation.y=angle;host.dataset.rotation=angle.toFixed(3);renderer.render(scene,camera)};
 const sync=()=>{if(closed)return;const source=player?.m?.body||player?.m?.root;if(!source)return;const parts=[source.uuid];source.traverse(o=>{if(o.isMesh)parts.push(o.uuid+':'+o.visible)});const sig=parts.join('|');if(sig===last)return;last=sig;releaseClone(clone);clone=T.SkeletonUtils.clone(source);clone.position.set(0,0,0);clone.rotation.set(0,0,0);pivot.rotation.y=0;pivot.add(clone);const box=monsterBounds132(clone);if(!box.isEmpty()){const size=box.getSize(new T.Vector3());box.getCenter(center);clone.position.x-=center.x;clone.position.z-=center.z;halfHeight=Math.max(.4,size.y/2);halfWidth=Math.max(.2,Math.hypot(size.x,size.z)/2)}draw()};
 const turn=d=>{angle+=d;draw()},reset=()=>{angle=0;zoom=1;draw()};
 const down=e=>{if(e.button!==0&&e.pointerType!=='touch')return;drag={id:e.pointerId,x:e.clientX};host.focus({preventScroll:true});if(e.isTrusted)host.setPointerCapture?.(e.pointerId);e.preventDefault()};
 const move=e=>{if(!drag||drag.id!==e.pointerId)return;turn((e.clientX-drag.x)*.012);drag.x=e.clientX;e.preventDefault()};
 const up=e=>{if(drag?.id===e.pointerId){drag=null;if(host.hasPointerCapture?.(e.pointerId))host.releasePointerCapture(e.pointerId)}};
 const key=e=>{if(['ArrowLeft','ArrowRight','Home','+','=','-'].includes(e.key)){e.preventDefault();e.stopPropagation();if(e.key==='Home')reset();else if(e.key==='ArrowLeft'||e.key==='ArrowRight')turn(e.key==='ArrowLeft'?-.2:.2);else{zoom=Math.max(.7,Math.min(1.5,zoom+(e.key==='-'?.1:-.1)));draw()}}};
 host.addEventListener('pointerdown',down);host.addEventListener('pointermove',move);host.addEventListener('pointerup',up);host.addEventListener('pointercancel',up);host.addEventListener('keydown',key);resize=new ResizeObserver(draw);resize.observe(host);sync();timer=setInterval(sync,350);
 return {host,turn,reset,dispose(){if(closed)return;closed=true;clearInterval(timer);resize.disconnect();for(const [n,f] of [['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',up],['keydown',key]])host.removeEventListener(n,f);releaseClone(clone);renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove()}};
 }catch(error){clearInterval(timer);resize?.disconnect();releaseClone(clone);renderer?.dispose();renderer?.forceContextLoss();host.textContent='Modelo indisponível';console.warn('Character405 viewer',error);return null}
}
function decorate(kind){const mb=$('mb');if(mb.querySelector('.c405-hero'))return;mb.classList.add('c405-surface');const tabs=mb.querySelector('.tabs');if(tabs)tabs.insertAdjacentHTML('afterend',hero());else mb.insertAdjacentHTML('afterbegin',hero());viewer?.dispose();viewer=createViewer(mb.querySelector('.c405-portrait'));
 /* v408 (Ian): equipamentos só na Build, nunca no Status. */
 if(kind==='build'){const placeholder=mb.querySelector('[data-c405-wardrobe]');if(placeholder)placeholder.outerHTML=wardrobe();else mb.querySelector('.c405-hero').insertAdjacentHTML('afterend',wardrobe());}
 if(kind==='status'){const guide=mb.querySelector('.guide93');if(guide){guide.className='c405-points';guide.innerHTML='<b>'+run.pts+' pontos para distribuir</b><span>'+xpProgressText(xpProgress())+'</span>'}const rows=[...mb.querySelectorAll(':scope > .it')].filter(r=>r.querySelector('[data-a="stat"]'));if(rows.length){const grid=document.createElement('div');grid.className='c405-attributes';rows[0].before(grid);rows.forEach(r=>grid.append(r))}}
 showSelection();hydrate(mb);
}
for(const [name,kind] of [['statusView','status'],['buildView','build']]){const original=window[name];window[name]=function(){viewer?.dispose();viewer=null;const panel=window.equipmentPanel,bag=window.bagGearRows156;
 /* Only this synchronous render uses the compact wardrobe; original rules are retained. */
 if(kind==='build'){window.equipmentPanel=()=>'<div data-c405-wardrobe></div>';window.bagGearRows156=()=>''}
 let result;try{result=original.apply(this,arguments)}finally{if(kind==='build'){window.equipmentPanel=panel;window.bagGearRows156=bag}}
 decorate(kind);return result;
 }}
$('mb').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;
 if(b.hasAttribute('data-c405-slot')){selection=selection===b.dataset.c405Slot?null:b.dataset.c405Slot;selectedUid=null;showSelection()}
 else if(b.hasAttribute('data-c405-item')){selectedUid=b.dataset.c405Item;showSelection()}
 else if(b.hasAttribute('data-c405-close')){selection=null;selectedUid=null;showSelection()}
 else if(b.hasAttribute('data-c405-turn'))viewer?.turn(Number(b.dataset.c405Turn)*.35);
 else if(b.hasAttribute('data-c405-reset'))viewer?.reset();
});
new MutationObserver(()=>{if($('modal').hidden||!viewer?.host.isConnected){viewer?.dispose();viewer=null;if($('modal').hidden){selection=null;selectedUid=null}if(!$('mb').querySelector('.c405-hero'))$('mb').classList.remove('c405-surface')}}).observe($('modal'),{attributes:true,attributeFilter:['hidden'],childList:true,subtree:true});
Promise.resolve(window.ItemArt405?.ready).then(()=>{if($('mb').querySelector('.c405-wardrobe'))showSelection()});
window.Character405={decorate};
})();
