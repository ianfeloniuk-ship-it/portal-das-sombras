/* Mercado, lojas, banco e coleta com a cara do Primeva (Ian, 21/10/2026).
   Não muda regras nem botões: usa a mesma janela (openModal) e as mesmas ações; só muda a forma.
   O jogo fica visível e desfocado atrás; cada item gira num pedestal de cristal na cor do rank. */
(()=>{'use strict';
const T=THREE;
const css=`
#modal.t535{background:radial-gradient(ellipse at 50% 55%,#1a0d2a59,#05030bd9 78%);backdrop-filter:blur(7px) saturate(1.15);-webkit-backdrop-filter:blur(7px) saturate(1.15);align-items:center;padding-top:0}
#mbox.t535{width:min(1180px,96vw);height:min(760px,92vh);max-height:none;background:none;border:0;box-shadow:none;border-radius:0;padding:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,1.05fr);grid-template-rows:auto auto minmax(0,1fr);column-gap:28px;position:relative}
#mbox.t535 #mhead{grid-column:1/-1;display:flex;align-items:center;gap:12px;padding:6px 4px 12px;position:relative}
#mbox.t535 #mhead::after{content:'';position:absolute;left:0;right:0;bottom:0;height:2px;background:linear-gradient(90deg,transparent,#9b6bff,#47d6c4,#ffd27a,#9b6bff,transparent);background-size:300% 100%;animation:t535rift 6s linear infinite;filter:drop-shadow(0 0 6px #9b6bffaa)}
@keyframes t535rift{to{background-position:300% 0}}
#mbox.t535 #mt{font:400 clamp(20px,2.4vw,30px)/1.1 'Russo One',sans-serif;letter-spacing:.06em;color:#fff3e4;text-shadow:0 0 18px var(--t535c,#9b6bff),0 2px 0 #00000080;flex:1;min-width:0}
#mbox.t535 #modalNotice95{grid-column:1/-1}
#mbox.t535 #mb{grid-column:1;grid-row:3;padding:10px 6px 10px 2px;font-size:14px}
.t535-show{grid-column:2;grid-row:3;display:grid;grid-template-rows:minmax(0,1fr) auto;min-height:0;position:relative}
.t535-stage{position:relative;min-height:220px;touch-action:none;cursor:grab}
.t535-stage canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.t535-stage::before{content:'';position:absolute;left:50%;bottom:7%;width:min(62%,380px);aspect-ratio:3/1;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,var(--t535c,#9b6bff)66,transparent 70%);filter:blur(4px);opacity:.75}
.t535-stage::after{content:'';position:absolute;left:50%;bottom:9%;width:min(52%,320px);aspect-ratio:3/1;transform:translateX(-50%);border-radius:50%;border:2px solid transparent;background:conic-gradient(from var(--t535a,0deg),var(--t535c,#9b6bff),#47d6c4,transparent,var(--t535c,#9b6bff)) border-box;-webkit-mask:linear-gradient(#000 0 0) padding-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:t535spin 5s linear infinite;opacity:.9}
@property --t535a{syntax:'<angle>';inherits:false;initial-value:0deg}
@keyframes t535spin{to{--t535a:360deg}}
.t535-card{position:relative;padding:16px 20px 18px;background:linear-gradient(160deg,#160d24f2,#0b0a14f2);clip-path:polygon(14px 0,calc(100% - 14px) 0,100% 14px,100% calc(100% - 14px),calc(100% - 14px) 100%,14px 100%,0 calc(100% - 14px),0 14px);box-shadow:inset 0 0 0 1px #ffffff14}
.t535-card::before{content:'';position:absolute;inset:0;padding:1px;clip-path:inherit;background:linear-gradient(135deg,var(--t535c,#9b6bff),transparent 40%,transparent 60%,#47d6c4);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
.t535-card small{display:block;font:600 10px 'Chakra Petch',sans-serif;letter-spacing:.24em;text-transform:uppercase;color:var(--t535c,#9b6bff)}
.t535-card h3{margin:4px 0 6px;font:400 22px/1.15 'Russo One',sans-serif;color:#fff3e4}
.t535-card p{margin:0;color:#d9cfe6;font-size:13px;line-height:1.45}
.t535-card .t535-big{display:flex;gap:26px;margin-top:10px;flex-wrap:wrap}
.t535-card .t535-big div{display:flex;flex-direction:column}
.t535-card .t535-big span{font:600 10px 'Chakra Petch',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#b9add0}
.t535-card .t535-big b{font:400 28px/1.1 'Russo One',sans-serif;color:var(--gold,#ffd54f);font-variant-numeric:tabular-nums}
#mbox.t535 #mb .it{position:relative;margin:0 0 6px;padding:10px 12px;background:linear-gradient(90deg,#140c20d9,#0d0a16b3);border:0;border-radius:0;clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);transition:background .15s,transform .15s;cursor:pointer}
#mbox.t535 #mb .it::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--rc,#ffffff30);transition:width .15s}
#mbox.t535 #mb .it:hover,#mbox.t535 #mb .it.t535-on{background:linear-gradient(90deg,#2a1640f0,#140c20cc);transform:translateX(4px)}
#mbox.t535 #mb .kael405-item{cursor:pointer;transition:background .15s}#mbox.t535 #mb .kael405-item.t535-on{background:linear-gradient(90deg,#2a1640f0,#140c20cc);box-shadow:inset 4px 0 0 var(--rc,#9b6bff)}
#mbox.t535 #mb .it.t535-on::before{width:5px;box-shadow:0 0 12px var(--rc,#9b6bff)}
#mbox.t535 #mb .it .d{font-size:14px;color:#fff3e4}
#mbox.t535 #mb .it .d small{color:#b9add0}
#mbox.t535 #mb .sec{font:400 13px 'Russo One',sans-serif;letter-spacing:.12em;color:#c9b6ff;margin:16px 0 8px;border:0;padding:0}
#mbox.t535 #mb .sysline{background:none;border:0;border-left:2px solid #47d6c466;padding:4px 10px;color:#d9cfe6}
#mbox.t535 .btn{font-family:'Chakra Petch',sans-serif;border-radius:0;clip-path:polygon(7px 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%,0 7px);background:#2a1a3f;border:0;box-shadow:inset 0 0 0 1px #9b6bff88}
#mbox.t535 .btn:not([disabled]):hover{background:#3b2458;box-shadow:inset 0 0 0 1px #c9b6ff,0 0 14px #9b6bff66}
#mbox.t535 .btn.hot{background:linear-gradient(180deg,#ffd27a,#c98a2c);color:#1a0d05;box-shadow:none}
#mbox.t535 #mx,#mbox.t535 #mback118{flex:none}
#mbox.t535 .loot513{display:none!important}
@media(max-width:820px){
 #mbox.t535{grid-template-columns:1fr;grid-template-rows:auto auto 34vh minmax(0,1fr);height:94vh;column-gap:0}
 .t535-show{grid-column:1;grid-row:3;grid-template-rows:minmax(0,1fr) auto}
 .t535-card{padding:10px 14px}.t535-card h3{font-size:17px}.t535-card p{display:none}.t535-card .t535-big b{font-size:20px}
 #mbox.t535 #mb{grid-column:1;grid-row:4}
}
@media(prefers-reduced-motion:reduce){#mbox.t535 #mhead::after,.t535-stage::after{animation:none}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

/* ===== modelos: arquivos do jogo para armas/armadura/baú; peças de monstro feitas aqui ===== */
const GLB=[[/espada|lâmina|katana/i,'models/armas155/espada162.glb'],[/machado/i,'models/armas155/machado-tanque490.glb'],[/escudo/i,'models/armas155/escudo-tanque490.glb'],[/arco|besta/i,'models/armas155/arco-arqueiro.glb'],[/cajado|bastão/i,'models/armas155/cajado-fogo-490.glb'],[/adaga|punhal/i,'models/armas155/adaga-rank4.glb'],[/lança/i,'models/armas155/comum-lanca.glb'],[/maça|martelo/i,'models/armas155/comum-maca.glb'],[/varinha/i,'models/armas155/varinha-paladino-490.glb'],[/tomo|grimório|livro/i,'models/armas155/tomo-invocador-490.glb'],[/armadura|peitoral|elmo|greva|braça|manopla|botas|capacete/i,'models/equipment431/aco-r3.glb'],[/^ba[uú]$|cofre|espaços|bolsa de/i,'models/m437/bau.glb']];
const PARTS=['Presa','Couro','Essência','Osso','Garra','Escama','Gel','Pena','Chifre','Olho','Coração','Fragmento','Poção','Pergaminho','Comida','Peixe'];
const loader=T.GLTFLoader?new T.GLTFLoader():null,cache={};
const lin=c=>new T.Color(c).convertSRGBToLinear();
const mat=(c,o={})=>new T.MeshStandardMaterial({color:lin(c),roughness:o.r??.6,metalness:o.m??0,flatShading:o.flat??true,emissive:lin(o.e??0),emissiveIntensity:o.ei??1,transparent:!!o.t,opacity:o.t??1});
function bent(r0,len,bend,col){const geo=new T.CylinderGeometry(r0*.06,r0,len,10,14),a=geo.attributes.position;for(let i=0;i<a.count;i++){const y=a.getY(i),t=(y+len/2)/len;a.setX(i,a.getX(i)+bend*t*t*len*.45);a.setY(i,y+len/2)}geo.computeVertexNormals();const g=new T.Group();g.add(new T.Mesh(geo,mat(col,{flat:false,r:.45})));return g}
function part(word,col){const g=new T.Group();
  switch(word){
   case 'Presa':{const p=bent(.22,1.6,1.1,0xf2ead6);p.position.y=-.8;g.add(p);const root=new T.Mesh(new T.CylinderGeometry(.24,.2,.2,7),mat(0xb58a6a));root.position.y=-.85;g.add(root);break}
   case 'Couro':{const s=new T.Shape(),pts=[[-1,-.7],[-.4,-.85],[.3,-.75],[1,-.8],[.9,-.1],[1.05,.6],[.4,.8],[-.2,.7],[-.95,.75],[-1.05,.1]];s.moveTo(...pts[0]);pts.slice(1).forEach(p=>s.lineTo(...p));const geo=new T.ExtrudeGeometry(s,{depth:.06,bevelEnabled:true,bevelSize:.04,bevelThickness:.03,bevelSegments:1});const a=geo.attributes.position;for(let i=0;i<a.count;i++)a.setZ(i,a.getZ(i)+Math.sin(a.getX(i)*2.4)*.12+Math.cos(a.getY(i)*3)*.06);geo.computeVertexNormals();const m=new T.Mesh(geo,mat(0x8a5634,{r:.9}));m.rotation.x=-.5;g.add(m);const st=new T.Mesh(new T.TorusGeometry(.5,.02,4,24),mat(0x5a3420));st.rotation.x=-.5;st.position.z=.12;g.add(st);break}
   case 'Osso':{const sh=new T.Mesh(new T.CylinderGeometry(.13,.13,1.5,8),mat(0xeee4cc));sh.rotation.z=.6;g.add(sh);for(const s of[-1,1])for(const k of[-1,1]){const b=new T.Mesh(new T.SphereGeometry(.2,8,6),mat(0xeee4cc));b.position.set(s*.62*Math.cos(.6)+k*.12,s*-.62*Math.sin(-.6)*-1+k*.08,0);g.add(b)}break}
   case 'Garra':for(let i=0;i<3;i++){const c=bent(.14,1.2,1.4,0x2c2620);c.position.set((i-1)*.32,-.6,0);c.rotation.y=(i-1)*.25;g.add(c)}break;
   case 'Escama':for(let i=0;i<7;i++){const h=new T.Mesh(new T.CylinderGeometry(.42,.42,.06,6),mat(col||0x3fa27a,{m:.4,r:.35}));h.rotation.x=Math.PI/2-.3;h.position.set((i%3-1)*.62+(Math.floor(i/3)%2)*.31,(Math.floor(i/3)-1)*.5,Math.floor(i/3)*.04);g.add(h)}break;
   case 'Gel':{const m=new T.Mesh(new T.IcosahedronGeometry(.8,2),mat(0x63e08a,{t:.75,r:.15,flat:false,e:0x1f6a3a,ei:.6}));m.scale.y=.75;g.add(m);break}
   case 'Pena':{const s=new T.Shape();s.moveTo(0,-1);s.quadraticCurveTo(.5,0,0,1.1);s.quadraticCurveTo(-.5,0,0,-1);const m=new T.Mesh(new T.ShapeGeometry(s,8),mat(0xe8eef6,{flat:false}));m.material.side=T.DoubleSide;g.add(m);const q=new T.Mesh(new T.CylinderGeometry(.025,.02,2.3,5),mat(0xc9b28a));q.position.y=0;g.add(q);g.rotation.z=.5;break}
   case 'Chifre':{const c=bent(.3,1.8,2.2,0xc7b08a);c.position.y=-.9;g.add(c);break}
   case 'Olho':{g.add(new T.Mesh(new T.SphereGeometry(.7,20,14),mat(0xf3eee6,{flat:false,r:.3})));const i=new T.Mesh(new T.SphereGeometry(.36,16,10),mat(col||0xffb02e,{flat:false,e:col||0xffb02e,ei:.6}));i.position.z=.45;i.scale.z=.5;g.add(i);const p=new T.Mesh(new T.SphereGeometry(.16,12,8),mat(0x0b0b0b,{flat:false}));p.position.z=.62;p.scale.set(.5,1,.4);g.add(p);break}
   case 'Coração':{for(const s of[-1,1]){const b=new T.Mesh(new T.SphereGeometry(.45,12,10),mat(0xb1243a,{flat:false,r:.4}));b.position.set(s*.32,.2,0);g.add(b)}const c=new T.Mesh(new T.ConeGeometry(.66,.95,14),mat(0xb1243a,{flat:false,r:.4}));c.rotation.z=Math.PI;c.position.y=-.4;g.add(c);break}
   case 'Essência':{g.add(new T.Mesh(new T.OctahedronGeometry(.75,0),mat(col||0x9b6bff,{e:col||0x9b6bff,ei:.9,t:.85,r:.1})));const r=new T.Mesh(new T.TorusGeometry(1,.03,6,40),mat(0xffffff,{e:0xc9b6ff,ei:1}));r.rotation.x=1.2;g.add(r);break}
   case 'Poção':{const b=new T.Mesh(new T.SphereGeometry(.6,16,12),mat(0xd7f2ff,{t:.45,flat:false,r:.05}));g.add(b);const l=new T.Mesh(new T.SphereGeometry(.52,16,12,0,Math.PI*2,Math.PI*.45,Math.PI*.55),mat(0xe0304a,{flat:false,e:0x70101c,ei:.5}));g.add(l);const n=new T.Mesh(new T.CylinderGeometry(.16,.2,.5,10),mat(0xd7f2ff,{t:.5}));n.position.y=.75;g.add(n);const k=new T.Mesh(new T.CylinderGeometry(.18,.16,.2,8),mat(0x8a5634));k.position.y=1.05;g.add(k);break}
   case 'Pergaminho':{const r=new T.Mesh(new T.CylinderGeometry(.22,.22,1.5,12),mat(0xe8d9b0,{flat:false}));r.rotation.z=Math.PI/2;g.add(r);const s=new T.Mesh(new T.TorusGeometry(.24,.04,6,16),mat(0xb1243a));s.rotation.y=Math.PI/2;g.add(s);break}
   default:{const c=bent(.3,1.4,.6,col||0xbfa27a);c.position.y=-.7;g.add(c)}}
  return g}
function load(url){return new Promise((res,rej)=>{if(cache[url])return res(cache[url]);if(!loader)return rej('sem GLTFLoader');loader.load(url,g=>{cache[url]=g;res(g)},undefined,rej)})}
function fromGlb(g){let skin=false;g.scene.traverse(o=>{if(o.isSkinnedMesh)skin=true});const o=skin?g.scene:g.scene.clone(true);o.updateMatrixWorld(true);const b=new T.Box3();
  if(skin)o.traverse(m=>{if(m.isMesh){m.geometry.computeBoundingBox();b.union(m.geometry.boundingBox);m.frustumCulled=false}});else b.setFromObject(o);return{o,b}}

/* ===== palco 3D único (reaproveitado entre janelas) ===== */
let V=null;
function stage(host){
  if(!V){const cv=document.createElement('canvas');const R=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true});R.outputEncoding=T.sRGBEncoding;R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=1.1;R.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    const sc=new T.Scene(),cam=new T.PerspectiveCamera(30,1,.01,100);sc.add(new T.HemisphereLight(0xe6dcff,0x1a1426,.95));const k=new T.DirectionalLight(0xfff0d8,1.5);k.position.set(3,5,4);sc.add(k);const rim=new T.DirectionalLight(0x9b6bff,.9);rim.position.set(-4,1.5,-3);sc.add(rim);const fill=new T.PointLight(0x47d6c4,.5,8);fill.position.set(0,-1.2,1.5);sc.add(fill);
    const piv=new T.Group();sc.add(piv);V={cv,R,sc,cam,piv,rim,obj:null,yaw:.5,pitch:.12,auto:true,drag:null,raf:0,want:0};
    cv.addEventListener('pointerdown',e=>{V.drag={x:e.clientX,y:e.clientY,yaw:V.yaw,pitch:V.pitch};V.auto=false;cv.setPointerCapture(e.pointerId)});
    cv.addEventListener('pointermove',e=>{if(!V.drag)return;V.yaw=V.drag.yaw+(e.clientX-V.drag.x)*.01;V.pitch=Math.max(-.6,Math.min(.8,V.drag.pitch+(e.clientY-V.drag.y)*.006))});
    cv.addEventListener('pointerup',()=>{V.drag=null;setTimeout(()=>{if(V)V.auto=true},2500)})}
  if(V.cv.parentNode!==host)host.appendChild(V.cv);
  cancelAnimationFrame(V.raf);let last=performance.now();
  const tick=now=>{if(!V.cv.isConnected||$('modal').hidden){V.raf=0;return}V.raf=requestAnimationFrame(tick);const dt=Math.min(.05,(now-last)/1000);last=now;
    const w=V.cv.clientWidth,h=V.cv.clientHeight;if(!w||!h)return;if(V.cv.width!==Math.round(w*V.R.getPixelRatio())){V.R.setSize(w,h,false);V.cam.aspect=w/h;V.cam.updateProjectionMatrix()}
    if(V.auto&&!matchMedia('(prefers-reduced-motion: reduce)').matches)V.yaw+=dt*.5;const s=V.piv.scale.x;if(s<1)V.piv.scale.setScalar(Math.min(1,s+(1-s)*.14+.01));
    V.piv.rotation.set(V.pitch,V.yaw,0);V.piv.position.y=.1+Math.sin(now/1300)*.05;V.R.render(V.sc,V.cam)};
  V.raf=requestAnimationFrame(tick)}
function put(o,b,rim){if(V.obj){V.piv.remove(V.obj);if(!V.obj.userData.keep)V.obj.traverse(m=>{if(m.isMesh&&!m.isSkinnedMesh&&!m.userData.shared){m.geometry.dispose()}})}
  b=b||new T.Box3().setFromObject(o);const s=b.getSize(new T.Vector3()),c=b.getCenter(new T.Vector3()),k=1.7/Math.max(s.x,s.y,s.z,.001);
  const w=new T.Group();o.scale.multiplyScalar(k);o.position.copy(c).multiplyScalar(-k);w.add(o);V.obj=w;V.piv.add(w);V.piv.scale.setScalar(.01);V.cam.position.set(0,.15,4.7);V.cam.lookAt(0,0,0);
  if(rim)V.rim.color.set(rim)}
function showFor(text,entry,color,desc){
  if(!V)return;const id=++V.want,rim=color||'#9b6bff';
  if(entry&&(entry.type==='core'||entry.type==='cry')&&window.Loot513?.model){const o=Loot513.model(entry);o.userData.keep=true;put(o,null,rim);return}
  if(entry&&entry.type==='equipment')text=(entry.item?.name||'')+' '+text;
  const hit=GLB.find(([re])=>re.test(text));
  if(hit){load(hit[1]).then(g=>{if(id!==V.want)return;const{o,b}=fromGlb(g);o.userData.keep=true;put(o,b,rim)}).catch(()=>{if(id===V.want)put(part('Fragmento',0x9b6bff),null,rim)});return}
  const w=PARTS.find(p=>new RegExp(p,'i').test(text))||PARTS.find(p=>new RegExp(p,'i').test(desc||''))||(/ouro/i.test(text)?'Essência':/lobo|montaria/i.test(text)?'Presa':/mapa/i.test(text)?'Pergaminho':/peixe|comer|comida/i.test(text)?'Coração':'Fragmento');
  put(part(w,color?new T.Color(color).getHex():0),null,rim)}

/* ===== janela: decide o tipo pelo título e monta lista + palco + cartão ===== */
function kind(title){if(/^MERCADO DE RECURSOS/.test(title))return 'mkt';if(/^BANCO DE /.test(title))return 'bank';if(/^SAQUE · /.test(title))return 'loot';
  if(/^PRIMEIRA ARMA · KAEL/.test(title)||(typeof SHOPS!=='undefined'&&SHOPS.some(s=>s.id!=='guild'&&s.n===title)))return 'shop';return ''}
function rowName(it){if(it.classList.contains('kael405-item'))return (it.querySelector('b')?.textContent||'').trim();const d=it.querySelector('.d');if(!d)return '';const c=d.cloneNode(true);c.querySelector('small')?.remove();return c.textContent.trim()}
function rowColor(it){const r=it.querySelector('.rl');return r?getComputedStyle(r).color:''}
function card(html){const c=$('mbox').querySelector('.t535-card');if(c)c.innerHTML=html}
function select(it,k,entries,rows){
  rows.forEach(r=>r.classList.toggle('t535-on',r===it));
  const name=rowName(it),desc=(it.querySelector('.d small')||it.querySelector('small'))?.textContent||'',col=rowColor(it)||'#9b6bff';
  $('mbox').style.setProperty('--t535c',col);
  const price=[...it.querySelectorAll('.btn')].map(b=>b.textContent).find(t=>/ouro/i.test(t));
  card('<small>'+(k==='loot'?'Saque':k==='mkt'?'Dorian · recursos':'À venda')+'</small><h3>'+safeText(name)+'</h3><p>'+safeText(desc)+'</p>'+(price?'<div class="t535-big"><div><span>Preço</span><b>'+safeText(price.replace(/\s*ouro/i,''))+'</b></div><div><span>Seu ouro</span><b>'+fmt(run.gold)+'</b></div></div>':''));
  if(isItem(it,k))showFor(name,entries?entries[rows.indexOf(it)]:null,col,desc)}
function isItem(it,k){const n=rowName(it);return k==='loot'||[...it.querySelectorAll('.btn')].some(b=>/ouro|comprar|vender|pegar/i.test(b.textContent)&&!/presentear|doar/i.test(b.textContent))||GLB.some(([re])=>re.test(n))||PARTS.some(p=>new RegExp(p,'i').test(n))}
function bankCard(){card('<small>Cofre de Selene</small><h3>Ouro guardado</h3><p>O que fica aqui não se perde, nem se você morrer lá fora.</p><div class="t535-big"><div><span>Com você</span><b>'+fmt(run.gold)+'</b></div><div><span>No banco</span><b>'+fmt(profile.bank||0)+'</b></div></div>')}
function skin(title){
  const box=$('mbox'),modal=$('modal'),k=kind(title||'');
  if(!k){box.classList.remove('t535');modal.classList.remove('t535');box.querySelector('.t535-show')?.remove();box.style.removeProperty('--t535c');return}
  box.classList.add('t535');modal.classList.add('t535');
  let show=box.querySelector('.t535-show');if(!show){show=document.createElement('div');show.className='t535-show';show.innerHTML='<div class="t535-stage" aria-label="Item em 3D. Arraste para girar."></div><div class="t535-card"></div>';box.appendChild(show)}
  stage(show.querySelector('.t535-stage'));
  box.querySelector('.loot513')?.remove();
  let rows=[...$('mb').querySelectorAll('.it,.kael405-item')];let entries=null;
  if(k==='loot'&&window.Loot353){const nm=title.replace(/^SAQUE · /,'');const r=Loot353.records().find(r=>r.name===nm&&(!r.x||Math.hypot(r.x-player.x,r.z-player.z)<12))||Loot353.records().find(r=>r.name===nm);entries=r?r.entries:null}
  rows.forEach(it=>{const c=rowColor(it);if(c)it.style.setProperty('--rc',c);it.tabIndex=0;
    const go=()=>select(it,k,entries,rows);it.addEventListener('mouseenter',go);it.addEventListener('focus',go);it.addEventListener('click',e=>{if(!e.target.closest('.btn'))go()})});
  if(k==='shop')$('mb').querySelectorAll('details.kael405-stock').forEach(d=>{if(!d.dataset.t535){d.dataset.t535=1;d.open=true}});
  if(k==='bank'){bankCard();$('mbox').style.setProperty('--t535c','#ffd27a');showFor('baú',null,'#ffd27a');return}
  const first=rows.find(r=>isItem(r,k)&&GLB.some(([re])=>re.test(rowName(r))))||rows.find(r=>isItem(r,k))||rows[0];if(first)select(first,k,entries,rows);else{card('<small>'+title+'</small><h3>Nada aqui</h3>');showFor('baú',null)}}
const _open=openModal;
openModal=function(title,html,route){const r=_open.apply(this,arguments);try{skin(title);setTimeout(()=>{try{if($('mbox').classList.contains('t535'))$('mbox').querySelector('.loot513')?.remove()}catch(e){}},0)}catch(e){console.warn('Telas535',e)}return r};
const _close=closeModal;
closeModal=function(){const r=_close.apply(this,arguments);try{$('mbox').classList.remove('t535');$('modal').classList.remove('t535');$('mbox').querySelector('.t535-show')?.remove()}catch(e){}return r};
window.Telas535={kind,showFor,part};
})();
