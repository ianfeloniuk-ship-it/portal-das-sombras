/* Conversa estilo Skyrim com a marca do Primeva (Ian, 22/10/2026: proposta aprovada «gostei»).
   F num vendedor de Aster abre primeiro a conversa (câmera de perto, perguntas à direita, cristal da Fenda);
   «Ver loja» chama o openShop de antes, então tutorial, campanha e falas da história seguem iguais. */
(()=>{'use strict';
const VEND={guild:'Lyra',pot:'Mira',wep:'Kael',arm:'Brann',defense:'Brann',mkt:'Dorian',bank:'Selene'};
const ROLE={Lyra:'Ordem da Fenda',Mira:'Poções',Kael:'Ferreiro',Brann:'Defesa da vila',Dorian:'Mercador',Selene:'Banco'};
const SHOPT={guild:'Quero ver as missões da Ordem.',pot:'Quero ver as poções.',wep:'Quero ver o que você vende.',arm:'Quero ver as defesas.',defense:'Quero ver as defesas.',mkt:'Quero negociar recursos.',bank:'Quero mexer no cofre.'};
const BYE={Lyra:'Que a Fenda reconheça o seu caminho.',Mira:'Volte inteiro. Poção boa salva vida lá dentro.',Kael:'Volte com algo quebrado. É assim que a gente se conhece.',Brann:'A muralha agradece cada mão.',Dorian:'Pago à vista, como sempre.',Selene:'O que fica aqui não se perde.'};
const css=`@import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&display=swap');
#conv539{position:fixed;inset:0;z-index:40;font:300 15px/1.5 "Jost","Futura","Century Gothic","Chakra Petch",sans-serif;color:#ece8df;pointer-events:auto}
#conv539[hidden]{display:none}
#conv539 .v{position:absolute;inset:0;background:linear-gradient(90deg,transparent 32%,#00000030 46%,#000000b8 66%,#000000d8 100%),linear-gradient(0deg,#000000a0,transparent 26%)}
#conv539 .who{position:absolute;left:50%;top:52%;transform:translate(-100%,-50%);padding-right:22px;text-align:right;text-shadow:0 1px 6px #000,0 0 2px #000}
#conv539 .who b{display:block;font:400 22px/1.1 inherit;letter-spacing:.06em}
#conv539 .who span{display:block;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#ddd6c8;margin-top:3px}
#conv539 .who i{display:block;font-style:normal;font-size:12px;color:#e88a9a;letter-spacing:.1em;margin-top:4px}
#conv539 .rail{position:absolute;left:50%;top:22%;bottom:22%;width:1px;background:linear-gradient(180deg,transparent,#ffffffb0 18%,#ffffffb0 82%,transparent)}
#conv539 .gem{position:absolute;left:50%;width:22px;height:22px;transform:translate(-50%,-50%);transition:top .18s ease}
#conv539 .gem svg{display:block;width:100%;height:100%;filter:drop-shadow(0 0 6px #9b6bffcc)}
#conv539 .opts{position:absolute;left:calc(50% + 26px);right:24px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:2px;max-width:560px}
#conv539 .opt{display:flex;align-items:center;gap:10px;background:none;border:0;text-align:left;font:300 17px/1.35 inherit;color:#d6d0c2;padding:5px 0;cursor:pointer;text-shadow:0 1px 4px #000}
#conv539 .opt:hover,#conv539 .opt.on{color:#fff}
#conv539 .opt.done{color:#8f8a80}#conv539 .opt.lock{color:#77736b;cursor:default}
#conv539 .tag{flex:none;width:14px;text-align:center;font-size:12px}
#conv539 .tag.q{color:#e9c46a}#conv539 .tag.n{color:#47d6c4}#conv539 .tag.a{color:#e88a9a}#conv539 .tag.l{color:#6f6c66}
#conv539 .opt small{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8f8a80;margin-left:6px}
#conv539 .say{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(64px + env(safe-area-inset-bottom,0px));width:min(760px,90vw);text-align:center;text-shadow:0 1px 4px #000,0 0 2px #000;font-size:17px;line-height:1.45;min-height:3em;transition:opacity .25s}
#conv539 .say b{font-weight:500;color:#fff}
#conv539 .narr{position:absolute;left:50%;transform:translateX(-50%);top:calc(40px + env(safe-area-inset-top,0px));width:min(620px,88vw);text-align:center;font-size:13px;font-style:italic;color:#d8c8ff;text-shadow:0 1px 4px #000;opacity:0;transition:opacity .6s}
#conv539 .narr.show{opacity:1}
#conv539 .narr b{font-style:normal;font-weight:500;letter-spacing:.2em;font-size:10px;color:#9b6bff;display:block;margin-bottom:2px}
#conv539 .keys{position:absolute;right:24px;bottom:calc(18px + env(safe-area-inset-bottom,0px));display:flex;gap:16px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#ddd6c8;text-shadow:0 1px 3px #000}
#conv539 kbd{font:400 11px inherit;border:1px solid #ffffff70;padding:1px 7px;margin-right:6px;color:#fff;background:#00000060}
body.conv539>*:not(#c):not(#conv539):not(script):not(style):not(#modal){visibility:hidden!important}
@media(max-width:760px){#conv539 .v{background:linear-gradient(0deg,#000000e0 0,#000000b0 42%,transparent 70%)}#conv539 .who{left:24px;top:auto;bottom:calc(46% + 8px);transform:none;text-align:left;padding:0}#conv539 .rail,#conv539 .gem,#conv539 .keys{display:none}#conv539 .opts{left:24px;right:24px;top:auto;bottom:calc(120px + env(safe-area-inset-bottom,0px));transform:none}#conv539 .opt{font-size:15px}#conv539 .say{bottom:calc(46px + env(safe-area-inset-bottom,0px));font-size:14px}#conv539 .narr{top:calc(70px + env(safe-area-inset-top,0px))}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const root=document.createElement('div');root.id='conv539';root.hidden=true;root.setAttribute('role','dialog');
root.innerHTML='<div class="v"></div><div class="narr"><b>NARRADOR</b><span></span></div><div class="who"><b></b><span></span><i></i></div><div class="rail"></div><div class="gem"><svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="g539" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d8c8ff"/><stop offset=".5" stop-color="#9b6bff"/><stop offset="1" stop-color="#47d6c4"/></linearGradient></defs><path d="M12 1 L21 12 L12 23 L3 12 Z" fill="url(#g539)"/><path d="M12 1 L21 12 L12 12 Z" fill="#ffffff55"/><path d="M12 5 L17 12 L12 19 L7 12 Z" fill="none" stroke="#ffffffaa" stroke-width=".8"/></svg></div><div class="opts" role="listbox" aria-label="Perguntas"></div><div class="say" aria-live="polite"></div><div class="keys"><span><kbd>↑ ↓</kbd>escolher</span><span><kbd>E</kbd>perguntar</span><span><kbd>Esc</kbd>sair</span></div>';
document.body.appendChild(root);
const q=s=>root.querySelector(s);
let S=null; // {id,name,npc,opts,sel,camSave}
const prevShop=openShop;
const fill=t=>String(t).replace(/\{nome\}/g,(typeof profile!=='undefined'&&profile&&profile.name)||'Viajante');
const esc=t=>typeof safeText==='function'?safeText(fill(t)):fill(t).replace(/[<>&]/g,'');
const hearts=n=>'♥'.repeat(n)+'♡'.repeat(Math.max(0,10-n));
function act(a,v){try{const r=(typeof extraActions==='function'&&extraActions(a,v))||(typeof extraActions2==='function'&&extraActions2(a,v))||(typeof extraActions3==='function'&&extraActions3(a,v));if(r&&typeof saveRun==='function')saveRun();return r}catch(e){console.warn('Conversa539',e);return false}}
function npcOf(name){if(typeof npcs==='undefined'||!player)return null;let best=null,bd=9;for(const n of npcs){if(n.name!==name)continue;const d=Math.hypot(n.x-player.x,n.z-player.z);if(d<bd){bd=d;best=n}}return best}
function skip(){try{return !started||!player||player.dead||modalOpen||L.mode!=='world'||profile.classless||profile.orderPending401||profile.creationPending91}catch(e){return true}}
function build(){
  const n=S.name,l=typeof affL==='function'?affL(n):0,o=[];
  const objT=(document.getElementById('obj')?.textContent||'').trim();
  if(objT&&new RegExp(n,'i').test(objT))o.push({t:'Sobre a missão: '+objT.replace(/\s+/g,' ').slice(0,60),tag:'q',go:'shop'});
  if(typeof NPCTALK!=='undefined'&&NPCTALK[n]){const i=Math.min(NPCTALK[n].length-1,Math.floor(l/2)),seen=(profile.talk539||{})[n];o.push({t:'Como estão as coisas?',tag:seen===i?'':'n',a:NPCTALK[n][i],talk:i})}
  if(typeof NPCQ!=='undefined'&&NPCQ[n]){const qq=NPCQ[n],s=(profile.npcq||{})[n]||{got:0},has=typeof npcHas==='function'&&npcHas(n);
    if(has)o.push({t:'Sobre o que você me ensinou.',done:1,a:'Você já carrega '+qq.sk+'. Use bem.'});
    else if(l>=3)o.push(s.got>=qq.n?{t:'Terminei o que você pediu.',tag:'q',fn:()=>{act('npcdone',n);return 'Bom trabalho. Leve isto: '+qq.sk+'.'},narr:'Missão pessoal concluída: '+qq.sk+'.'}:{t:'Tem trabalho para mim?',tag:'q',a:qq.d+'. Até agora: '+Math.min(s.got,qq.n)+' de '+qq.n+'.',narr:'Missão pessoal: '+qq.d+' ('+Math.min(s.got,qq.n)+'/'+qq.n+').'});
    else o.push({t:'Tem trabalho para mim?',tag:'l',sm:'3 corações',lock:1})}
  o.push({t:SHOPT[S.id]||'Quero ver o que você tem.',go:'shop'});
  if(typeof AFF_PERK!=='undefined'&&AFF_PERK[n]&&l<10){const c=typeof servicePrice265==='function'?servicePrice265('gift',{affinityLevel:l}):0;o.push({t:'Trouxe um presente.',tag:'a',sm:fmt(c)+' ouro',dis:run.gold<c,fn:()=>{const b=affL(n);act('gift',n);return affL(n)>b?'Hm. Não precisava. Mas não vou recusar.':'Guarde seu ouro por enquanto.'},narr:AFF_PERK[n]})}
  o.push({t:'Até mais.',bye:1,a:BYE[n]||'Até mais.'});
  S.opts=o;S.sel=Math.max(0,o.findIndex(x=>!x.lock&&!x.done));}
function render(){
  const n=S.name,l=typeof affL==='function'?affL(n):0;
  q('.who b').textContent=n;q('.who span').textContent=(ROLE[n]||'')+' · '+(typeof nearestCity==='function'?nearestCity(player.x,player.z).c.name:'');q('.who i').textContent=hearts(l);
  q('.opts').innerHTML=S.opts.map((x,i)=>'<button type="button" class="opt'+(x.done||S.asked.has(x.t)?' done':'')+(x.lock||x.dis?' lock':'')+'" role="option" data-i="'+i+'"><span class="tag '+(x.tag||'')+'">'+(x.tag==='q'?'◆':x.tag==='n'?'●':x.tag==='a'?'♥':x.tag==='l'?'⌂':'')+'</span>'+esc(x.t)+(x.sm?'<small>'+esc(x.sm)+'</small>':'')+'</button>').join('');
  root.querySelectorAll('.opt').forEach(b=>{b.onmouseenter=()=>{S.sel=+b.dataset.i;mark()};b.onclick=()=>{S.sel=+b.dataset.i;choose()}});mark()}
function mark(){if(!S)return;const bs=root.querySelectorAll('.opt');bs.forEach((b,i)=>b.classList.toggle('on',i===S.sel));const b=bs[S.sel];if(b){const r=b.getBoundingClientRect();q('.gem').style.top=(r.top+r.height/2)+'px'}}
let nt;function narr(t){if(!t)return;q('.narr span').textContent=t;q('.narr').classList.add('show');clearTimeout(nt);nt=setTimeout(()=>q('.narr').classList.remove('show'),4200)}
function say(t){const el=q('.say'),nm=S?S.name:'';el.style.opacity=0;setTimeout(()=>{el.innerHTML='<b>'+esc(nm)+':</b> '+esc(t);el.style.opacity=1},140)}
function choose(){if(!S)return;const x=S.opts[S.sel];if(!x)return;
  if(x.lock){q('.say').innerHTML='<span style="color:#a7a49c">Ainda não. ('+esc(x.sm||'')+')</span>';return}
  if(x.dis){q('.say').innerHTML='<span style="color:#a7a49c">Ouro insuficiente.</span>';return}
  if(x.go==='shop'){const id=S.id;close(true);prevShop.call(window,id);return}
  if(x.bye){say(x.a);setTimeout(()=>close(),900);return}
  let t=x.a;if(x.fn)t=x.fn();if(x.talk!=null){profile.talk539=profile.talk539||{};profile.talk539[S.name]=x.talk;try{store.set('pds2_profile',profile)}catch(e){}}
  if(!S)return;say(t);narr(x.narr);S.asked.add(x.t);const sel=S.sel;build();S.sel=Math.min(sel,S.opts.length-1);render()}
/* câmera de perto: entre o jogador e o NPC, um pouco de lado */
function camOn(npc){S.camSave=window.camUpdate;try{const pm=player.m?.root||player.m;if(pm&&'visible' in pm){S.pmVis=pm.visible;pm.visible=false;S.pm=pm}}catch(e){}const dx=player.x-npc.x,dz=player.z-npc.z,d=Math.hypot(dx,dz)||1,ux=dx/d,uz=dz/d,px=-uz,pz=ux,h=terrH(npc.x,npc.z);
  const cx=npc.x+ux*2.6+px*.6,cz=npc.z+uz*2.6+pz*.6,tx=npc.x-px*.45,tz=npc.z-pz*.45;
  window.camUpdate=function(){camera.position.set(cx,h+1.7,cz);camera.lookAt(tx,h+1.35,tz)};
  try{npc.face=Math.atan2(dx,dz);if(npc.m?.root)npc.m.root.rotation.y=npc.face}catch(e){}}
function camOff(){if(!S)return;if(S.camSave)window.camUpdate=S.camSave;if(S.pm)S.pm.visible=S.pmVis!==false}
function open(id){
  const name=VEND[id],npc=npcOf(name);if(!npc)return false;
  S={id,name,npc,opts:[],sel:0,asked:new Set()};build();
  try{paused=true}catch(e){}document.body.classList.add('conv539');root.hidden=false;camOn(npc);
  const l=affL(name);q('.say').innerHTML='<b>'+esc(name)+':</b> '+esc(typeof NPCTALK!=='undefined'&&NPCTALK[name]?NPCTALK[name][0]:'Pois não?');
  render();requestAnimationFrame(mark);return true}
function close(keepPaused){if(!S)return;camOff();root.hidden=true;document.body.classList.remove('conv539');clearTimeout(nt);q('.narr').classList.remove('show');S=null;
  if(!keepPaused)try{if(!modalOpen&&player&&!player.dead)paused=false}catch(e){}}
openShop=function(id){if(S)close(true);else if(VEND[id]&&!skip()&&open(id))return;return prevShop.apply(this,arguments)};
addEventListener('keydown',e=>{if(!S)return;const k=e.key;e.stopImmediatePropagation();
  if(['ArrowUp','ArrowDown','Enter',' ','Escape','Tab'].includes(k)||/^[eEfF]$/.test(k))e.preventDefault();
  const n=S.opts.length;if(k==='ArrowDown'){S.sel=(S.sel+1)%n;mark()}else if(k==='ArrowUp'){S.sel=(S.sel+n-1)%n;mark()}
  else if(k==='Enter'||k===' '||/^[eE]$/.test(k))choose();else if(k==='Escape'||k==='Tab')close()},true);
addEventListener('keyup',e=>{if(S)e.stopImmediatePropagation()},true);
addEventListener('resize',()=>{if(S)mark()});
window.Conversa539={open,close,get active(){return !!S}};
})();
