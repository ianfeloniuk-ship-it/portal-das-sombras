/* ================= EFEITOS ================= */
/* v179 (Ian): área de habilidade marcada por um contorno discreto no chão (sem disco branco brilhando). */
function zoneMark178(x,z,r,col,dur){const c=new THREE.Color(col).multiplyScalar(.8),m=new THREE.Mesh(geo('zm178',()=>new THREE.RingGeometry(.93,1,48)),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.55,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,.07,z);m.scale.setScalar(r);const f=new THREE.Mesh(geo('zf178',()=>new THREE.CircleGeometry(1,40)),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.1,depthWrite:false}));f.rotation.x=-Math.PI/2;f.position.set(x,.06,z);f.scale.setScalar(r);scene.add(m);scene.add(f);fxCustom(new THREE.Group(),dur,(o,k)=>{const a=k<.85?1:(1-k)/.15;m.material.opacity=.55*a;f.material.opacity=.1*a;if(k>.99){scene.remove(m);scene.remove(f);m.material.dispose();f.material.dispose()}})}
function dustPuff178(x,z){for(let i=0;i<5;i++){const d=new THREE.Mesh(geo('dp178',()=>new THREE.SphereGeometry(.18,6,5)),new THREE.MeshBasicMaterial({color:0x9a8a70,transparent:true,opacity:.55,depthWrite:false}));const a=Math.random()*6.28,v=.6+Math.random()*.6;d.position.set(x,.15,z);scene.add(d);fxCustom(new THREE.Group(),.45,(o,k)=>{d.position.set(x+Math.cos(a)*v*k,.15+.4*k,z+Math.sin(a)*v*k);d.scale.setScalar(1+2*k);d.material.opacity=.55*(1-k);if(k>.99){scene.remove(d);d.material.dispose()}})}}
function fxRing(x,z,col,r,dur=.45){const o=new THREE.Mesh(geo('fxr',()=>new THREE.RingGeometry(.2,.6,32)),glow(col,.45));o.rotation.x=-Math.PI/2;o.position.set(x,.08,z);scene.add(o);fxs.push({o,t:0,dur,kind:'ring',r})}
function fxBurst(x,y,z,col,n=8,sp=5){for(let i=0;i<n;i++){const o=new THREE.Mesh(geo('fxp',()=>new THREE.SphereGeometry(.13,6,4)),glow(col,1));o.scale.setScalar(rnd(.6,1.4));o.position.set(x,y,z);scene.add(o);fxs.push({o,t:0,dur:rnd(.3,.6),kind:'p',v:{x:rnd(-1,1)*sp,y:rnd(.5,1.5)*sp,z:rnd(-1,1)*sp}})}}
function fxSlash(x,z,ang,col,r=2.4,big=false,cls=null,footY=0){if(window.Combat139){const f=cls==null?Combat139.create(col,r,false):Combat139.basicMelee(cls,col,r,big);f.group.position.set(x,footY,z);f.group.rotation.y=ang-Math.PI/2;fxCustom(f.group,big?.30:.24,(_,k)=>f.update(k));return}const o=new THREE.Mesh(new THREE.RingGeometry(r*.55,r,24,1,-.9,1.8),glow(col,.85));o.rotation.x=-Math.PI/2;o.rotation.z=ang-Math.PI/2;o.position.set(x,.9+footY,z);scene.add(o);fxs.push({o,t:0,dur:big?.28:.2,kind:'slash',own:true})}
function fxLine(pts,col){const g=new THREE.BufferGeometry().setFromPoints(pts.map(p=>new THREE.Vector3(p.x,1.1,p.z)));const o=new THREE.Line(g,new THREE.LineBasicMaterial({color:col,transparent:true,blending:THREE.AdditiveBlending}));scene.add(o);fxs.push({o,t:0,dur:.3,kind:'line',own:true})}
function fxGhost(){const o=new THREE.Mesh(geo('ghost',()=>new THREE.CylinderGeometry(.35,.4,1.9,8)),glow(0xffd08a,.35));o.position.set(player.x,1,player.z);scene.add(o);fxs.push({o,t:0,dur:.3,kind:'ghost'})}
function floater(x,z,txt,col,big=false,y=2.4){floats.push({x,y,z,txt:String(txt),col,t:0,big})}
function shake(a){shakeA=Math.max(shakeA,a)}
function hitstop(s){freeze=Math.max(freeze,s)}
/* Histórico compartilhado pelas notificações e falas. */
let historyUnread95=0;
function historyEntry95(html,kind='event'){return {h:String(html),t:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),at:Date.now(),kind,n:1}}
function appendHistory95(list,entry){const last=list[0];if(last&&last.h===entry.h&&entry.at-(last.at||0)<5000){last.n=(last.n||1)+1;last.at=entry.at;last.t=entry.t;return true}list.unshift(entry);if(list.length>200)list.length=200;return false}

/* v488 (Ian): o Narrador aparece no topo da tela com banner elegante e som suave, visível mesmo com o histórico fechado. */
function narratorSayTop(text, ms = 7500){
  if(!text)return;
  const clean = String(text).replace(/^<b>\[NARRADOR\]<\/b>\s*/i, '').replace(/<[^>]*>/g, '').trim();
  if(!clean)return;
  logNews('<b>[NARRADOR]</b> ' + clean, 'narratorPersonal105');
  if(typeof modalOpen !== 'undefined' && modalOpen)return;
  let box = document.getElementById('narratorTopBar');
  if(!box){
    box = document.createElement('aside');
    box.id = 'narratorTopBar';
    box.setAttribute('role', 'status');
    box.setAttribute('aria-live', 'polite');
    box.style.cssText = 'position:fixed;top:max(14px,env(safe-area-inset-top));left:50%;transform:translateX(-50%) translateY(-10px);z-index:9999;width:min(580px,calc(100vw - 32px));background:linear-gradient(180deg,rgba(16,23,34,0.96),rgba(10,14,22,0.94));border:1px solid rgba(231,187,104,0.7);border-radius:8px;padding:9px 18px;color:#fdf4e4;text-align:center;box-shadow:0 6px 30px rgba(0,0,0,0.8),0 0 18px rgba(231,187,104,0.22);pointer-events:auto;cursor:pointer;transition:opacity .35s ease,transform .35s ease;opacity:0;box-sizing:border-box;';
    box.onclick = () => { box.style.opacity = '0'; box.style.transform = 'translateX(-50%) translateY(-10px)'; };
    document.body.appendChild(box);
  }
  box.innerHTML = '<small style="display:block;color:#e7bb68;font:bold 10px/1.3 sans-serif;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:3px">O NARRADOR</small><span style="font:italic 15px/1.45 Georgia,serif;color:#fbf2e3;display:block">“' + clean + '”</span>';
  try{ beep(165, .035, .01, 'triangle'); }catch(_){}
  clearTimeout(narratorSayTop._timer);
  requestAnimationFrame(()=>{
    box.style.opacity = '1';
    box.style.transform = 'translateX(-50%) translateY(0)';
  });
  const dur = Math.max(ms, 3500 + clean.length * 28);
  narratorSayTop._timer = setTimeout(()=>{
    box.style.opacity = '0';
    box.style.transform = 'translateX(-50%) translateY(-10px)';
  }, dur);
}

function logNews(html,kind='event'){if(!profile)return;profile.news=Array.isArray(profile.news)?profile.news:[];const repeat=appendHistory95(profile.news,historyEntry95(html,kind));store.set('pds2_profile',profile);if(started)renderHistory95(false,repeat)}
function historyHtml95(html){const t=document.createElement('template');t.innerHTML=String(html);for(const el of [...t.content.querySelectorAll('*')]){if(!['B','STRONG','SMALL','BR','EM','I','SPAN'].includes(el.tagName)){el.replaceWith(document.createTextNode(el.textContent));continue}for(const a of [...el.attributes])el.removeAttribute(a.name)}return t.innerHTML}
function historyRow95(x){const d=document.createElement('div');d.className='history-entry95'+(x.kind==='important'||/desbloque|liberad|nova habilidade|novo sistema/i.test(x.h)?' important':'');d.innerHTML='<span class="history-time95">'+safeText(x.t||'')+'</span>'+historyHtml95(x.h)+(x.n>1?'<span class="history-repeat95">×'+x.n+'</span>':'');return d}
function historyAtEnd95(el){return el.scrollHeight-el.clientHeight-el.scrollTop<24}
function historyBadge95(){const b=$('historyUnread95');b.hidden=!historyUnread95;b.textContent=historyUnread95+' nova'+(historyUnread95===1?'':'s');}
function renderHistory95(initial=false,repeat=false){const body=$('historyBody95'),list=(profile&&profile.news)||[],follow=initial||(!CFG.historyCollapsed95&&historyAtEnd95(body));let top=body.scrollTop;if(initial){body.replaceChildren();for(const x of [...list].reverse())body.appendChild(historyRow95(x))}else if(list.length){if(repeat&&body.lastElementChild)body.lastElementChild.replaceWith(historyRow95(list[0]));else body.appendChild(historyRow95(list[0]));while(body.children.length>list.length){top-=body.firstElementChild.getBoundingClientRect().height;body.firstElementChild.remove()}}if(follow){body.scrollTop=body.scrollHeight;historyUnread95=0}else{body.scrollTop=Math.max(0,top);historyUnread95++}historyBadge95()}
function sizeHistory95(w,h){const maxW=Math.max(160,Math.min(620,innerWidth-(touch?120:16))),maxH=Math.max(90,Math.min(420,innerHeight*(touch?.25:.45)));return {w:Math.max(Math.min(220,maxW),Math.min(maxW,Number(w)||320)),h:Math.max(Math.min(110,maxH),Math.min(maxH,Number(h)||175))}}
function applyHistory95(){const box=$('history95'),size=sizeHistory95(CFG.historyW95,CFG.historyH95);box.style.width=size.w+'px';box.style.height=size.h+'px';box.classList.toggle('collapsed',!!CFG.historyCollapsed95);$('historyToggle95').setAttribute('aria-expanded',String(!CFG.historyCollapsed95));$('historyToggle95').textContent='HISTÓRICO '+(CFG.historyCollapsed95?'▸':'▾')}
function toggleHistory95(){/* v410: fechar o histórico tira o painel da tela (sem a barrinha recolhida) */$('history95').hidden=true;CFG.historyCollapsed95=false;store.set('pds_cfg',CFG)}
function latestHistory95(){CFG.historyCollapsed95=false;applyHistory95();$('historyBody95').scrollTop=$('historyBody95').scrollHeight;historyUnread95=0;historyBadge95();store.set('pds_cfg',CFG)}
function newsView(){if(!started)return;const box=$('history95');/* v410: o painel só aparece quando aberto pelo MENU */if(!box.hidden){box.hidden=true;return}box.hidden=false;CFG.historyCollapsed95=false;applyHistory95();store.set('pds_cfg',CFG);$('historyBody95').focus()}
/* v194 (Ian): aviso aparece em destaque no topo e depois fica nas Notícias. Tempo cresce com o tamanho do texto; no máximo 3 na tela. */
/* v277 (Ian): avisos um de cada vez, pequenos, no alto — não tampam a luta. Repetidos são ignorados; tudo continua no Histórico. */
const POPQ277=[];let popBusy277=false;
function popNews194(html,ms){const key=String(html).replace(/<[^>]*>/g,'').replace(/\d+/g,'#');if(POPQ277.some(q=>q.key===key)||popBusy277===key)return;POPQ277.push({html,key,ms});while(POPQ277.length>3)POPQ277.shift();if(!popBusy277)popNext277()}
function popNext277(){if(modalOpen){POPQ277.length=0;popBusy277=false;return}const q=POPQ277.shift();if(!q){popBusy277=false;return}popBusy277=q.key;let box=document.getElementById('pop194');if(!box){box=document.createElement('div');box.id='pop194';box.style.cssText='position:fixed;top:max(10px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:10;display:flex;flex-direction:column;align-items:center;pointer-events:none;width:min(420px,calc(100vw - 32px))';document.body.appendChild(box)}
 const d=document.createElement('div');d.innerHTML=q.html;d.style.cssText='background:rgba(14,12,22,.96);border:1px solid rgba(255,179,71,.7);border-radius:8px;padding:6px 10px;color:#fff6e6;font-size:13px;line-height:1.35;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.4);transition:opacity .3s;opacity:0;pointer-events:none;box-sizing:border-box;width:100%;overflow-wrap:anywhere';box.replaceChildren(d);requestAnimationFrame(()=>d.style.opacity='1');
 const t=Math.min(6500,Math.max(q.ms||0,2500+d.textContent.length*18));setTimeout(()=>{d.style.opacity='0';setTimeout(()=>{d.remove();popNext277()},320)},t)}
function toast(html,ms=2600){NR105.quietFor=6;if(String(html).includes('[NARRADOR]')){narratorSayTop(html,ms);return}logNews(html);if(!modalOpen)try{popNews194(html,ms)}catch(_){}if(modalOpen){$('modalNotice95').innerHTML=historyHtml95(html);$('modalNotice95').hidden=false}}
function bigText(t,ms=1600){logNews('<b>'+safeText(t)+'</b>','important')}
function toggleGameMenu95(force){const open=typeof force==='boolean'?force:$('gameMenu95').hidden;$('gameMenu95').hidden=!open;$('bMenu').setAttribute('aria-expanded',String(open));if(open){if(document.pointerLockElement)document.exitPointerLock();mouseHeld=false;for(const k in keys)keys[k]=false;const b=$('gameMenu95').querySelector('button:not([hidden])');if(b)b.focus()}}

