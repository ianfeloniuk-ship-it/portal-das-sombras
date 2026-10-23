/* v544 (Ian, 22/10/2026, áudio): "quando for apertar o mapa, eu quero um mapa de Skyrim … um relevo, névoa … o mar igual Skyrim".
   No mundo aberto, M abre o mapa-múndi em 3D na tela inteira: o relevo real do jogo (terrH, 10 km × 10 km, altura exagerada 3×)
   pintado com as cores do mapa-múndi (Mapa501.sample), mar com ondas, nuvens baixas que passam por cima e névoa no horizonte.
   Nomes das cidades flutuam sobre o relevo; portais, missões, carroças, alvo e tesouro ficam numa camada pintada sobre o chão.
   Mouse: arrastar move, rodinha aproxima, botão direito gira. A lista de missões/cidades/portais do mapa antigo fica no painel à direita.
   Masmorras e lugares especiais continuam com o mapa 2D. */
(function(){
'use strict';
const T=window.THREE;
if(!T||typeof mapView!=='function'||typeof closeModal!=='function'||!window.Mapa501)return;
const HALF=5000,N=321,TEX=1024,EX=3,SEA_Y=-.9*EX-.6;
const M=window.Mapa3D544={on:true};
const D={seed:null,h:null,sea:null,tex:null,ready:false,job:null,texDone:0};
const S={el:null,cv:null,lab:null,panel:null,r:null,scene:null,cam:null,terrain:null,marks:null,mkCv:null,mkTex:null,water:null,clouds:[],player:null,ring:null,
  tx:0,tz:0,dist:2600,yaw:0,raf:0,last:0,mkT:0,drag:null,collapsed:(()=>{try{return localStorage.getItem('pds_maplist')!=='open'}catch(_){return true}})()};
const sleep=()=>new Promise(r=>setTimeout(r,0));
const mix=(a,b,r)=>[a[0]+(b[0]-a[0])*r,a[1]+(b[1]-a[1])*r,a[2]+(b[2]-a[2])*r];
const worldOk=()=>L.mode==='world'&&!L.special&&window.TER245&&TER245.on&&TER245.on.value;

/* ---------- dados: altura e cor, uma vez por mundo, aos poucos ---------- */
async function build(){
  const seed=WSEED;D.seed=seed;D.ready=false;D.texDone=0;
  try{Mapa501.ensure&&Mapa501.ensure()}catch(_){}
  const h=new Float32Array(N*N),sea=new Uint8Array(N*N),st=2*HALF/(N-1),SD=TER245.SEA439&&TER245.SEA439.d;
  for(let j=0;j<N;j++){for(let i=0;i<N;i++){const x=-HALF+i*st,z=-HALF+j*st;let v=0;try{v=terrH(x,z)}catch(_){}h[j*N+i]=v;try{sea[j*N+i]=SD&&SD(x,z)>0?1:0}catch(_){}}if(j%16===15){await sleep();if(D.seed!==seed)return}}
  D.h=h;D.sea=sea;
  /* cor: começa pela tela pronta do mapa-múndi e troca pela de 1024 quando terminar */
  const cv=document.createElement('canvas');cv.width=cv.height=TEX;const g=cv.getContext('2d');
  const base=Mapa501.C.cv||Mapa501.C.lo;if(base){g.imageSmoothingEnabled=true;g.drawImage(base,0,0,TEX,TEX)}else{g.fillStyle='#7d8b6a';g.fillRect(0,0,TEX,TEX)}
  D.cv=cv;D.ready=true;if(S.terrain)applyTerrain();
  const img=g.createImageData(TEX,TEX),d=img.data,m=2*HALF/TEX;
  for(let j=0;j<TEX;j++){for(let i=0;i<TEX;i++){let c;try{c=Mapa501.sample(-HALF+(i+.5)*m,-HALF+(j+.5)*m,m)}catch(_){c=[120,130,100]}
      /* tom do mapa do Skyrim: menos saturado e um pouco frio */
      const l=(c[0]*.3+c[1]*.59+c[2]*.11);c=mix(c,[l,l,l],.28);if(l>200)c=mix(c,[206,214,226],Math.min(1,(l-200)/40)*.7);/* neve sem estourar: a luz do 3D mostra o relevo */const o=(j*TEX+i)*4;d[o]=c[0]*.97;d[o+1]=c[1];d[o+2]=c[2]*1.04;d[o+3]=255}
    if(j%24===23){await sleep();if(D.seed!==seed)return}}
  g.putImageData(img,0,0);roads(g);D.texDone=1;if(S.terrain)applyTerrain()}
function roads(g){
  const v=Mapa501.C.vec;if(!v)return;const k=TEX/(2*HALF),t=x=>(x+HALF)*k;
  g.lineCap='round';g.strokeStyle='rgba(96,74,48,.75)';g.lineWidth=2.2;g.beginPath();for(const [x1,z1,x2,z2] of v.roads){g.moveTo(t(x1),t(z1));g.lineTo(t(x2),t(z2))}g.stroke();
  g.strokeStyle='rgba(222,204,168,.35)';g.lineWidth=.9;g.stroke()}
function ensureData(){if(D.seed!==WSEED&&!D.job){D.job=build().catch(e=>console.warn('mapa3d544',e)).finally(()=>{D.job=null})}}

/* ---------- cena ---------- */
function noiseCanvas(n,seed,fn){const cv=document.createElement('canvas');cv.width=cv.height=n;const g=cv.getContext('2d'),img=g.createImageData(n,n);let s=seed;const R=()=>(s=(s*16807)%2147483647)/2147483647;
  const L0=[];for(let o=0;o<5;o++){const w=4<<o,a=new Float32Array(w*w);for(let i=0;i<a.length;i++)a[i]=R();L0.push({w,a})}
  const val=(u,v)=>{let t=0,amp=1,tot=0;for(const {w,a} of L0){const x=u*w,y=v*w,i=Math.floor(x),j=Math.floor(y),fx=x-i,fy=y-j,q=(I,J)=>a[((J%w+w)%w)*w+((I%w+w)%w)],sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);
    t+=amp*((q(i,j)*(1-sx)+q(i+1,j)*sx)*(1-sy)+(q(i,j+1)*(1-sx)+q(i+1,j+1)*sx)*sy);tot+=amp;amp*=.55}return t/tot};
  for(let j=0;j<n;j++)for(let i=0;i<n;i++){const o=(j*n+i)*4,c=fn(val(i/n,j/n),i/n,j/n);d4(img.data,o,c)}g.putImageData(img,0,0);return cv}
function d4(d,o,c){d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=c[3]}

function makeScene(){
  const cv=document.createElement('canvas');S.cv=cv;
  const r=new T.WebGLRenderer({canvas:cv,antialias:true,preserveDrawingBuffer:true});r.setPixelRatio(Math.min(2,devicePixelRatio||1));S.r=r;
  if('outputEncoding' in r&&T.sRGBEncoding)r.outputEncoding=T.sRGBEncoding;
  const sc=new T.Scene();S.scene=sc;const FOG=0x97a3ad;sc.background=new T.Color(FOG);sc.fog=new T.Fog(FOG,5200,15500);
  S.cam=new T.PerspectiveCamera(40,1,20,40000);
  sc.add(new T.HemisphereLight(0xe4ecf4,0x40403a,.75));
  const sun=new T.DirectionalLight(0xfff1dc,1.25);sun.position.set(-1,1.1,-.7);sc.add(sun);
  /* relevo */
  const geo=new T.PlaneGeometry(2*HALF,2*HALF,N-1,N-1);geo.rotateX(-Math.PI/2);
  S.terrain=new T.Mesh(geo,new T.MeshLambertMaterial({color:0xffffff}));sc.add(S.terrain);
  /* camada de marcas (portais, missões…) pintada sobre o chão */
  S.mkCv=document.createElement('canvas');S.mkCv.width=S.mkCv.height=2048;S.mkTex=new T.CanvasTexture(S.mkCv);
  S.marks=new T.Mesh(geo,new T.MeshBasicMaterial({map:S.mkTex,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4,fog:false}));S.marks.renderOrder=2;sc.add(S.marks);
  /* mar */
  const nm=noiseCanvas(256,7,(v,u,w)=>{const a=v*6.283;return [128+Math.cos(a)*90,128+Math.sin(a)*90,255,255]});
  const nt=new T.CanvasTexture(nm);nt.wrapS=nt.wrapT=T.RepeatWrapping;nt.repeat.set(14,14);
  S.water=new T.Mesh(new T.PlaneGeometry(60000,60000).rotateX(-Math.PI/2),new T.MeshPhongMaterial({color:0x22394a,specular:0x5d7584,shininess:40,normalMap:nt,normalScale:new T.Vector2(.28,.28),transparent:true,opacity:.97}));
  S.water.position.y=SEA_Y;sc.add(S.water);
  /* nuvens baixas */
  const ct=new T.CanvasTexture(noiseCanvas(256,31,(v,u,w)=>{const dx=u-.5,dy=w-.5,r=Math.min(1,Math.sqrt(dx*dx+dy*dy)*2),q=Math.min(1,Math.max(0,(v-.36)/.3)),a=q*q*(3-2*q)*Math.pow(1-r,1.2);return [246,248,250,Math.min(255,a*255)]}));
  let s=99;const R=()=>(s=(s*16807)%2147483647)/2147483647;
  for(let i=0;i<46;i++){const sz=900+R()*1500,m=new T.Mesh(new T.PlaneGeometry(sz,sz*(.6+R()*.5)).rotateX(-Math.PI/2),new T.MeshLambertMaterial({map:ct,transparent:true,depthWrite:false,opacity:.75}));
    m.position.set(-7000+R()*14000,620+R()*520,-7000+R()*14000);m.rotation.y=R()*6.28;m.userData.v=18+R()*22;m.renderOrder=3;S.clouds.push(m);sc.add(m)}
  /* nuvens grossas na borda do mundo (como o mapa do Skyrim esconde o fim) */
  for(let i=0;i<72;i++){const a=i/72*6.283,rr=5600+R()*1500,sz=2200+R()*1800,m=new T.Mesh(new T.PlaneGeometry(sz,sz).rotateX(-Math.PI/2),new T.MeshLambertMaterial({map:ct,transparent:true,depthWrite:false,opacity:.95}));
    const k=1/Math.max(Math.abs(Math.cos(a)),Math.abs(Math.sin(a)));m.position.set(Math.cos(a)*rr*k*.92,260+R()*700,Math.sin(a)*rr*k*.92);m.rotation.y=R()*6.28;m.userData.edge=1;m.renderOrder=3;S.clouds.push(m);sc.add(m)}
  /* jogador: seta dourada e anel */
  const arrow=new T.Shape();arrow.moveTo(0,-70);arrow.lineTo(46,50);arrow.lineTo(0,24);arrow.lineTo(-46,50);arrow.closePath();
  S.player=new T.Mesh(new T.ExtrudeGeometry(arrow,{depth:14,bevelEnabled:false}).rotateX(Math.PI/2),new T.MeshBasicMaterial({color:0xffd070,fog:false}));sc.add(S.player);
  S.ring=new T.Mesh(new T.RingGeometry(70,86,40).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:0xffe6a8,transparent:true,opacity:.6,fog:false,depthWrite:false}));sc.add(S.ring);
  applyTerrain()}
function applyTerrain(){
  if(!D.ready||!S.terrain)return;const p=S.terrain.geometry.attributes.position;
  for(let i=0;i<p.count;i++)p.setY(i,yAt(i));
  p.needsUpdate=true;S.terrain.geometry.computeVertexNormals();S.terrain.geometry.computeBoundingSphere();
  const tex=new T.CanvasTexture(D.cv);if('encoding' in tex&&T.sRGBEncoding)tex.encoding=T.sRGBEncoding;tex.anisotropy=Math.min(8,S.r.capabilities.getMaxAnisotropy());
  const mat=S.terrain.material;if(mat.map)mat.map.dispose();mat.map=tex;mat.needsUpdate=true}
/* o mar do mapa só existe onde o jogo tem mar (SEA439); terra baixa fica logo acima da água, fundo do mar logo abaixo */
function yAt(i){const y=Math.max(D.h[i],-60)*EX;return D.sea[i]?Math.min(y,SEA_Y-14):Math.max(y,SEA_Y+3)}
function hAt(x,z){if(!D.h)return 0;const st=2*HALF/(N-1),i=Math.max(0,Math.min(N-1,Math.round((x+HALF)/st))),j=Math.max(0,Math.min(N-1,Math.round((z+HALF)/st)));return Math.max(yAt(j*N+i),SEA_Y)}

/* ---------- marcas sobre o chão (as mesmas funções do mapa 2D) ---------- */
function paintMarks(){
  const g=S.mkCv.getContext('2d'),W=S.mkCv.width,k=W/(2*HALF),tx=x=>(x+HALF)*k,tz=z=>(z+HALF)*k;
  g.clearRect(0,0,W,W);g.textAlign='center';g.textBaseline='middle';
  for(const gt of gates){if(gt.dead)continue;const col=gt.secret?'#ffd070':gt.red?'#ff2030':RANKS[gt.rank].c,X=tx(gt.x),Z=tz(gt.z);
    g.fillStyle='rgba(0,0,0,.6)';g.beginPath();g.arc(X,Z,7,0,7);g.fill();g.strokeStyle=col;g.lineWidth=2.5;g.stroke();g.fillStyle=col;g.font='700 9px "Russo One",sans-serif';g.fillText(gt.secret?'?':gid(gt.rank),X,Z+1)}
  for(const e of enemies)if(!e.dead&&(e.legend||e.world)){g.fillStyle=e.legend?'#ffd54f':'#ff5a1e';g.strokeStyle='#000';g.lineWidth=1.5;g.beginPath();g.arc(tx(e.x),tz(e.z),5,0,7);g.fill();g.stroke()}
  if(run.tmap){g.strokeStyle='#ffd54f';g.lineWidth=4;const X=tx(run.tmap.x),Z=tz(run.tmap.z);g.beginPath();g.moveTo(X-8,Z-8);g.lineTo(X+8,Z+8);g.moveTo(X+8,Z-8);g.lineTo(X-8,Z+8);g.stroke()}
  try{if(window.Civic343)Civic343.map(g,tx,tz,true)}catch(_){}
  try{if(window.Quests480)Quests480.drawMinimap(g,tx,tz,true)}catch(_){}
  try{const t=window.Campaign327&&Campaign327.target();if(t){g.fillStyle='#ffda68';g.strokeStyle='#3b2505';g.lineWidth=2.5;g.beginPath();g.arc(tx(t.x),tz(t.z),7,0,7);g.fill();g.stroke()}}catch(_){}
  S.mkTex.needsUpdate=true}

/* ---------- nomes flutuando (como no Skyrim) ---------- */
const V=new T.Vector3();
function labels(){
  const c=S.lab,g=c.getContext('2d'),dpr=Math.min(2,devicePixelRatio||1),W=c.width/dpr,H=c.height/dpr;g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);
  g.textAlign='center';g.textBaseline='bottom';const v=Mapa501.C.vec;if(!v)return;
  const put=(x,y,z)=>{V.set(x,y,z).project(S.cam);return V.z<1&&Math.abs(V.x)<1.1&&Math.abs(V.y)<1.1?[(V.x+1)/2*W,(1-V.y)/2*H]:null};
  const far=S.dist>5200;
  for(const ct of v.cities){if(far&&!ct.capital)continue;const p=put(ct.x,hAt(ct.x,ct.z)+40,ct.z);if(!p)continue;let fall=false;try{fall=cityFallen(ct)}catch(_){}
    const big=ct.capital,txt=big?ct.name.toUpperCase():ct.name;
    g.font=(big?'500 17px':'400 13px')+' "Jost","Chakra Petch",sans-serif';if('letterSpacing' in g)g.letterSpacing=big?'3px':'1px';
    g.fillStyle=fall?'#ff8a9a':big?'#fff6df':'#f2f4f6';g.shadowColor='rgba(0,0,0,.85)';g.shadowBlur=6;g.fillText(txt,p[0],p[1]-8);g.shadowBlur=0;
    g.fillStyle=fall?'#ff4d6a':big?'#ffd070':'#e8e2d0';g.beginPath();if(big){g.moveTo(p[0],p[1]-6);g.lineTo(p[0]+6,p[1]);g.lineTo(p[0],p[1]+6);g.lineTo(p[0]-6,p[1])}else g.arc(p[0],p[1],3,0,7);g.fill()}
  if('letterSpacing' in g)g.letterSpacing='0px';
  const P=player,p=put(P.x,hAt(P.x,P.z)+120,P.z);if(p){g.font='500 12px "Jost","Chakra Petch",sans-serif';g.fillStyle='#ffe6a8';g.shadowColor='rgba(0,0,0,.9)';g.shadowBlur=5;g.fillText('VOCÊ',p[0],p[1]-14);g.shadowBlur=0}}

/* ---------- câmera e controles ---------- */
function placeCam(){
  const d=S.dist,pitch=.5+.5*Math.min(1,Math.max(0,(d-700)/6000));/* perto: mais deitado; longe: mais de cima */
  const gy=hAt(S.tx,S.tz);S.cam.position.set(S.tx+Math.sin(S.yaw)*Math.cos(pitch)*d,gy+Math.sin(pitch)*d,S.tz+Math.cos(S.yaw)*Math.cos(pitch)*d);
  S.cam.lookAt(S.tx,gy,S.tz);S.scene.fog.near=d*1.1;S.scene.fog.far=d*4.2}
function bind(){
  const el=S.cv;
  el.addEventListener('contextmenu',e=>e.preventDefault());
  el.addEventListener('pointerdown',e=>{S.drag={b:e.button,x:e.clientX,y:e.clientY};el.setPointerCapture(e.pointerId)});
  el.addEventListener('pointermove',e=>{const d=S.drag;if(!d)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;d.x=e.clientX;d.y=e.clientY;
    if(d.b===2){S.yaw-=dx*.006}else{const s=S.dist/700,c=Math.cos(S.yaw),n=Math.sin(S.yaw);S.tx-=(dx*c+dy*n)*s;S.tz-=(-dx*n+dy*c)*s;S.tx=Math.max(-HALF,Math.min(HALF,S.tx));S.tz=Math.max(-HALF,Math.min(HALF,S.tz))}});
  el.addEventListener('pointerup',()=>{S.drag=null});
  el.addEventListener('wheel',e=>{e.preventDefault();S.dist=Math.max(600,Math.min(14000,S.dist*Math.exp(e.deltaY*.0012)))},{passive:false})}

function frame(t){
  if(!S.el||!S.el.isConnected){S.raf=0;return}
  S.raf=requestAnimationFrame(frame);
  const dt=Math.min(.1,(t-(S.last||t))/1000);S.last=t;
  const w=S.el.clientWidth,h=S.el.clientHeight;if(w&&h&&(S.cv.width!==Math.round(w*S.r.getPixelRatio())||S.lab.width!==Math.round(w*Math.min(2,devicePixelRatio||1)))){S.r.setSize(w,h,false);S.cam.aspect=w/h;S.cam.updateProjectionMatrix();const dpr=Math.min(2,devicePixelRatio||1);S.lab.width=w*dpr;S.lab.height=h*dpr}
  const nt=S.water.material.normalMap;nt.offset.x+=dt*.004;nt.offset.y+=dt*.0025;
  const fade=Math.min(1,Math.max(.12,(S.dist-900)/3500));
  for(const c of S.clouds){if(c.userData.edge){c.rotation.y+=dt*.01;continue}c.position.x+=c.userData.v*dt;if(c.position.x>7500)c.position.x=-7500;c.material.opacity=.8*fade}
  const P=player,py=hAt(P.x,P.z);S.player.position.set(P.x,py+40,P.z);S.player.rotation.y=P.face+Math.PI;const sc=Math.max(.6,S.dist/2600);S.player.scale.setScalar(sc);
  S.ring.position.set(P.x,py+8,P.z);S.ring.scale.setScalar(sc*(1+.15*Math.sin(t*.004)));
  if(t-S.mkT>500){S.mkT=t;paintMarks()}
  placeCam();S.r.render(S.scene,S.cam);labels()}

/* ---------- abrir / fechar junto com a janela do mapa ---------- */
function css(){if(document.getElementById('mapa3d544-css'))return;const st=document.createElement('style');st.id='mapa3d544-css';st.textContent=`
#mapa3d544{position:fixed;inset:0;z-index:1200;background:#97a3ad;overflow:hidden}
#mapa3d544 canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
#mapa3d544 .lab{pointer-events:none}
#mapa3d544 .side{position:absolute;top:0;right:0;bottom:0;width:min(360px,34vw);overflow:auto;padding:58px 16px 16px;background:linear-gradient(90deg,rgba(8,10,14,0),rgba(8,10,14,.72) 18%,rgba(8,10,14,.82));color:#e9edf1}
#mapa3d544 .ttl{position:absolute;top:18px;left:0;right:0;text-align:center;pointer-events:none;font:300 22px "Jost","Chakra Petch",sans-serif;letter-spacing:8px;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.7)}
#mapa3d544 .ttl:after{content:"";display:block;width:220px;height:1px;margin:8px auto 0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent)}
#mapa3d544 .hint{position:absolute;left:0;right:0;bottom:14px;text-align:center;pointer-events:none;font:400 12px "Jost","Chakra Petch",sans-serif;letter-spacing:2px;color:rgba(255,255,255,.82);text-shadow:0 1px 4px rgba(0,0,0,.8)}
#mapa3d544 .side.off{display:none}
#mapa3d544 .tg{position:absolute;top:58px;right:16px;z-index:2;padding:6px 12px;background:rgba(8,10,14,.82);border:1px solid rgba(255,255,255,.35);border-radius:6px;color:#fff;font:400 13px "Jost","Chakra Petch",sans-serif;letter-spacing:2px;cursor:pointer}
#mapa3d544 .side:not(.off)~.tg{right:min(376px,calc(34vw + 16px))}
#mapa3d544 .x{position:absolute;top:14px;right:16px;z-index:2;background:none;border:0;color:#fff;font:300 26px "Jost",sans-serif;cursor:pointer;opacity:.8}
#mapa3d544 .wait{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;font:300 15px "Jost","Chakra Petch",sans-serif;letter-spacing:4px;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.7)}`;document.head.appendChild(st)}
function mount(){
  if(!M.on||!worldOk()||!modalOpen)return;ensureData();css();
  const fresh=!S.el||!S.el.isConnected;
  if(fresh){
    if(!S.r)makeScene();
    const el=document.createElement('div');el.id='mapa3d544';S.el=el;
    S.lab=document.createElement('canvas');S.lab.className='lab';
    el.append(S.cv,S.lab);
    el.insertAdjacentHTML('beforeend','<div class="ttl">TERRAS DESPERTAS</div><div class="hint">ARRASTAR · MOVER &nbsp;&nbsp; RODINHA · APROXIMAR &nbsp;&nbsp; BOTÃO DIREITO · GIRAR &nbsp;&nbsp; M · FECHAR</div><button class="x" aria-label="Fechar">×</button><div class="wait">DESENHANDO O RELEVO…</div>');
    S.panel=document.createElement('div');S.panel.className='side'+(S.collapsed?' off':'');el.appendChild(S.panel);
    const tg=document.createElement('button');tg.className='tg';tg.textContent=S.collapsed?'‹ PORTAIS':'PORTAIS ›';tg.setAttribute('aria-label','Recolher ou reabrir a lista');
    tg.onclick=()=>{S.collapsed=!S.collapsed;try{localStorage.setItem('pds_maplist',S.collapsed?'closed':'open')}catch(_){};S.panel.classList.toggle('off',S.collapsed);tg.textContent=S.collapsed?'‹ PORTAIS':'PORTAIS ›'};el.appendChild(tg);
    el.querySelector('.x').onclick=()=>closeModal();
    document.body.appendChild(el);if(!S.bound){bind();S.bound=true}
    S.tx=player.x;S.tz=player.z;S.dist=2600;S.yaw=0;S.last=0}
  /* a lista do mapa antigo (missões, cidades, portais) vai para o painel; o desenho 2D fica escondido embaixo */
  const mb=$('mb');S.panel.innerHTML='';if(mb)for(const n of [...mb.childNodes])if(n.id!=='bigmap')S.panel.appendChild(n);
  if(!S.raf)S.raf=requestAnimationFrame(frame);waitMsg()}
function waitMsg(){const w=S.el&&S.el.querySelector('.wait');if(!w)return;if(D.ready){w.remove();return}setTimeout(waitMsg,150)}
/* v551 (Ian): crash ao fechar o mapa — causa: o mapa mantinha um 2º contexto WebGL vivo (antialias, canvas 2048, ~120 malhas) por cima do jogo e a GPU ficava sem memória (GL_OUT_OF_MEMORY / CONTEXT_LOST). Agora fechar libera tudo e abrir refaz. */
function teardown(){
  const r=S.r;if(!r)return;
  try{S.scene&&S.scene.traverse(o=>{if(o.geometry)o.geometry.dispose();const m=o.material;if(m)for(const x of (Array.isArray(m)?m:[m])){for(const k of ['map','normalMap'])if(x[k])x[k].dispose();x.dispose()}})}catch(e){console.warn('mapa3d544',e)}
  try{S.mkTex&&S.mkTex.dispose();r.dispose();r.forceContextLoss()}catch(e){console.warn('mapa3d544',e)}
  S.r=S.scene=S.cam=S.terrain=S.marks=S.mkCv=S.mkTex=S.water=S.player=S.ring=S.cv=S.lab=null;S.clouds=[];S.drag=null;S.bound=false}
function unmount(){if(S.raf){cancelAnimationFrame(S.raf);S.raf=0}if(S.el){S.el.remove()}teardown()}
M._S=S;M._D=D;M.mount=mount;M.unmount=unmount;M.state=()=>({ready:D.ready,hiTex:D.texDone,open:!!(S.el&&S.el.isConnected),dist:S.dist,tx:S.tx,tz:S.tz});
M.view=o=>{Object.assign(S,o||{});return M.state()};
M.snapshot=()=>{placeCam();S.r.render(S.scene,S.cam);labels();const c=document.createElement('canvas');c.width=S.cv.width;c.height=S.cv.height;const g=c.getContext('2d');g.drawImage(S.cv,0,0);g.drawImage(S.lab,0,0,c.width,c.height);return c.toDataURL('image/jpeg',.85)};

const mv0=mapView;mapView=function(){const r=mv0.apply(this,arguments);try{mount()}catch(e){console.warn('mapa3d544',e)}return r};
const cm0=closeModal;closeModal=function(){const r=cm0.apply(this,arguments);if(!modalOpen)unmount();return r};
/* outra janela aberta por cima (ex.: clique num portal) tira o mapa 3D */
const om0=openModal;openModal=function(title){const r=om0.apply(this,arguments);if(S.el&&S.el.isConnected&&view!==mapView&&!/^MAPA/.test(title||''))unmount();return r};
})();
