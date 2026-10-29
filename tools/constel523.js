/* Céu de constelações estilo Skyrim (Ian, 21/10/2026). Usa as constelações reais (CONS, cons, run.cpts);
   figuras e frases tiradas do Livro Oficial e do Manuscrito. Substitui a lista de consView(). */
(()=>{'use strict';
const css=`#cons523{position:fixed;inset:0;z-index:2147483000;background:#05070f;color:#ece8df;font:300 15px/1.55 "Jost","Chakra Petch",system-ui,sans-serif}
#cons523[hidden]{display:none!important}
#cons523 canvas{position:absolute;inset:0;width:100%;height:100%;display:block;cursor:grab;touch-action:none}
#cons523 canvas.hand{cursor:pointer}
#cons523 .c5-top{position:absolute;top:calc(18px + env(safe-area-inset-top,0px));left:0;right:0;text-align:center;pointer-events:none;padding:0 16px}
#cons523 h1{margin:0;font:300 clamp(24px,4.4vw,42px)/1.1 inherit;letter-spacing:.34em;text-transform:uppercase;text-shadow:0 0 22px #9fc0ff66}
#cons523 .c5-sub{margin:6px 0 0;color:#a9a69e;font-size:12px;letter-spacing:.24em;text-transform:uppercase}
#cons523 .c5-q{display:block;margin:10px auto 0;max-width:56ch;color:#c9c3b6;font-size:13px;font-style:italic;transition:opacity .5s}
#cons523 .c5-pts{position:absolute;top:calc(20px + env(safe-area-inset-top,0px));left:20px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#a9a69e;pointer-events:none}
#cons523 .c5-pts b{display:block;font:300 34px/1 inherit;color:#ece8df;letter-spacing:0}
#cons523 .c5-pts small{display:block;margin-top:4px;font-size:10px;letter-spacing:.1em;text-transform:none}
#cons523 .c5-x{position:absolute;top:calc(16px + env(safe-area-inset-top,0px));right:16px;font:400 12px inherit;letter-spacing:.16em;text-transform:uppercase;color:#ece8df;background:#00000080;border:1px solid #ffffff40;padding:8px 14px;cursor:pointer}
#cons523 .c5-conv{position:absolute;top:calc(64px + env(safe-area-inset-top,0px));right:16px;font:400 11px inherit;letter-spacing:.12em;text-transform:uppercase;color:#ffd9a0;background:#00000080;border:1px solid #ffd9a066;padding:8px 12px;cursor:pointer}
#cons523 .c5-panel{position:absolute;right:0;top:50%;transform:translateY(-50%);width:min(390px,92vw);padding:28px 32px 28px 56px;background:linear-gradient(90deg,transparent,#000000cc 18%,#000000f2);transition:opacity .35s;pointer-events:none;opacity:0;box-sizing:border-box}
#cons523 .c5-panel.show{opacity:1}
#cons523 .c5-panel h2{margin:0;font:400 20px/1.25 inherit;letter-spacing:.16em;text-transform:uppercase;border-bottom:1px solid #ffffff40;padding-bottom:10px}
#cons523 .c5-st{margin:10px 0 14px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#a9a69e}
#cons523 .c5-st.ok{color:#ffd9a0}
#cons523 .c5-d{margin:0 0 16px;font-size:16px;font-weight:400}
#cons523 .c5-ex{border-left:1px solid #ffffff40;padding:2px 0 2px 14px;color:#a9a69e;font-size:14px}
#cons523 .c5-ex span{display:block;font-size:10px;letter-spacing:.22em;text-transform:uppercase;margin-bottom:4px;color:#cfe0ff}
#cons523 .c5-ex b{color:#ece8df}
#cons523 .c5-lore{margin:16px 0 0;font-size:13px;font-style:italic;color:#bdb6a8}
#cons523 .c5-keys{position:absolute;bottom:calc(16px + env(safe-area-inset-bottom,0px));left:0;right:0;display:flex;justify-content:center;gap:22px;flex-wrap:wrap;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#a9a69e;pointer-events:none;padding:0 16px}
#cons523 kbd{font:400 11px inherit;border:1px solid #ffffff40;padding:1px 7px;margin-right:6px;color:#ece8df}
#cons523 .c5-toast{position:absolute;left:50%;bottom:calc(64px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#ffd9a0;opacity:0;transition:opacity .4s;pointer-events:none;text-align:center}
#cons523 .c5-toast.show{opacity:1}
@media(max-width:760px){#cons523 .c5-top{top:calc(66px + env(safe-area-inset-top,0px))}#cons523 h1{font-size:22px;letter-spacing:.22em}#cons523 .c5-pts small{display:none}#cons523 .c5-keys{font-size:10px;gap:12px}#cons523 .c5-panel{bottom:calc(64px + env(safe-area-inset-bottom,0px));top:auto;bottom:calc(52px + env(safe-area-inset-bottom,0px));transform:none;width:100%;padding:18px 16px;background:linear-gradient(180deg,transparent,#000000cc 25%)}#cons523 .c5-lore,#cons523 .c5-q{display:none}}`;

/* ===== figuras: arte em caixa 600×600 ('+' pinta, '-' recorta) e 11 estrelas (10 pontos + Ápice) ===== */
const circ=(x,y,r)=>`M${x-r} ${y} a${r} ${r} 0 1 0 ${2*r} 0 a${r} ${r} 0 1 0 ${-2*r} 0Z`;
function hand(){let s='M250 0 L350 0 L385 130 C402 200 402 262 396 305 L204 305 C198 262 198 200 215 130 Z';
  for(const[bx,tx,ty]of[[218,192,540],[262,256,566],[302,304,582],[342,350,564],[384,404,530]])
    s+=`M${bx-17} 292 Q${bx-16+(tx-bx)*.4} ${ty-150} ${tx} ${ty} Q${bx+16+(tx-bx)*.4} ${ty-150} ${bx+17} 292 Z`;
  return s+'M378 165 Q470 215 518 332 Q452 268 372 242 Z'}
function star8(R,r){let s='';for(let i=0;i<16;i++){const a=i*Math.PI/8-Math.PI/2,q=i%2?r:R;s+=(i?'L':'M')+(300+Math.cos(a)*q).toFixed(1)+' '+(300+Math.sin(a)*q).toFixed(1)}return s+'Z'}
const FIG={
 fur:{fig:'O Dragão Rubro',hue:[255,120,80],ex:n=>['Chance de crítico (base 5%)','<b>'+(5+n)+'%</b>'],
  lore:'Os dragões chegam pelo céu sem aviso. Quem sobrevive a um passa a mirar onde dói.',
  art:[['+','M300 260 C240 200 160 140 60 120 C100 160 110 190 100 222 C140 215 160 230 170 256 C200 246 230 256 252 288 Z M300 260 C360 200 440 140 540 120 C500 160 490 190 500 222 C460 215 440 230 430 256 C400 246 370 256 348 288 Z'],
   ['-','M118 150 L250 262 L240 270 Z M482 150 L350 262 L360 270 Z M150 205 L262 275 L255 283 Z M450 205 L338 275 L345 283 Z'],
   ['+','M300 148 C322 170 332 210 327 260 C324 320 312 380 300 422 C288 380 276 320 273 260 C268 210 278 170 300 148 Z'],
   ['+','M300 84 L320 128 L312 162 L288 162 L280 128 Z M288 104 L258 62 L294 118 Z M312 104 L342 62 L306 118 Z'],
   ['+','M296 410 C278 472 310 522 360 546 C402 562 432 542 442 520 C420 536 390 540 362 522 C322 496 306 462 308 410 Z M436 524 L476 500 L460 546 Z'],
   ['-',circ(292,124,5)+circ(308,124,5)]],
  pts:[[468,520],[362,542],[300,420],[318,320],[430,256],[540,120],[300,215],[60,120],[170,256],[300,150],[300,96]]},
 arc:{fig:'O Olho da Fenda',hue:[140,170,255],ex:n=>['Habilidade de 50 segundos','volta em <b>'+(50-n)+' s</b>'],
  lore:'Cada rasgo no céu é um mundo inteiro costurado ao nosso. Aldric os conta com astrolábios de bronze.',
  art:[['+','M50 300 Q300 80 550 300 Q300 520 50 300 Z'],['-','M105 300 Q300 135 495 300 Q300 465 105 300 Z'],['+',circ(300,300,100)],['-',circ(300,300,74)],['+','M300 218 Q336 300 300 382 Q264 300 300 218 Z'],['+','M296 20 L304 20 L304 120 L296 120 Z M296 480 L304 480 L304 580 L296 580 Z']],
  pts:[[50,300],[150,212],[300,192],[450,212],[550,300],[450,388],[300,408],[150,388],[300,22],[300,578],[300,300]]},
 cac:{fig:'A Arraia do Vazio',hue:[110,225,230],ex:n=>['Goblin que dá 100 de ouro','dá <b>'+(100+3*n)+'</b>'],
  lore:'Nada no ar como se fosse água e filtra pó de estrela nas Fendas. Os caçadores dizem que ela mostra onde há presa.',
  art:[['+','M300 120 C380 140 470 200 560 250 C480 280 410 300 360 330 C340 380 320 420 300 442 C280 420 260 380 240 330 C190 300 120 280 40 250 C130 200 220 140 300 120 Z'],['+','M272 128 C258 96 268 78 286 72 C286 94 292 110 304 120 Z M328 128 C342 96 332 78 314 72 C314 94 308 110 296 120 Z'],['+','M294 440 C300 500 330 560 362 592 C322 566 290 508 286 440 Z'],['-',circ(250,220,7)+circ(350,220,7)+circ(200,250,5)+circ(400,250,5)+circ(300,300,8)]],
  pts:[[358,588],[318,515],[300,440],[250,345],[150,282],[50,250],[214,176],[300,128],[386,176],[550,250],[300,270]]},
 vel:{fig:'O Lobo de Mana',hue:[185,232,255],ex:n=>['Corrida de 100 m','termina <b>'+n+'%</b> mais cedo'],
  lore:'O Lobo de Mana corre as estradas de Primeva mais rápido que qualquer carroça. Seguir sua estrela é nunca ficar parado.',
  art:[['+','M80 330 C110 300 150 290 190 295 C240 260 300 250 360 260 C400 230 430 200 450 175 L462 138 L480 178 C500 180 520 192 540 215 L562 232 L530 242 C510 252 495 262 480 270 C470 300 450 330 420 345 L472 410 L502 422 L480 432 L440 422 L395 360 C350 370 300 370 250 360 L202 422 L218 440 L190 440 L170 420 L195 355 C160 345 130 345 100 360 L40 400 L60 370 Z'],['-',circ(482,206,8)]],
  pts:[[45,396],[110,345],[205,434],[250,358],[420,345],[494,424],[480,270],[556,232],[462,142],[380,250],[482,206]]},
 san:{fig:'O Cálice Partido',hue:[235,80,105],ex:n=>['Você causa 300 de dano','cura <b>'+Math.floor(n/3)*3+'</b> de vida'],
  lore:'Na estrada sul havia sangue seco antes de qualquer espada. Quem bebe desse cálice devolve ao corpo o que tira do inimigo.',
  art:[['+','M170 112 L430 112 C430 232 380 302 320 318 L320 432 C360 442 400 462 410 492 L190 492 C200 462 240 442 280 432 L280 318 C220 302 170 232 170 112 Z'],['-','M300 112 L284 162 L314 192 L294 244 L306 244 L328 190 L298 160 L312 112 Z'],['+','M300 18 C320 44 332 62 332 76 C332 92 318 102 300 102 C282 102 268 92 268 76 C268 62 280 44 300 18 Z']],
  pts:[[190,492],[410,492],[300,432],[300,318],[200,226],[170,112],[300,176],[430,112],[400,226],[300,114],[300,64]]},
 som:{fig:'A Mão do Arquiteto',hue:[170,120,255],ex:n=>['Golpe de 100 num chefe','causa <b>'+(100+2*n)+'</b>'],
  lore:'Lá no alto, rasgando o céu, a mão colossal do Arquiteto desceu para recolher os chefes caídos. Esta estrela ensina a bater de volta.',
  art:[['+',hand()]],
  pts:[[300,28],[300,200],[218,300],[192,538],[256,564],[304,580],[350,562],[404,528],[384,300],[516,330],[300,252]]}
};
Object.assign(FIG,(window.CONS569||{}).fig||{});
const STAR={k:'est',n:'A Estrela',fig:'Rank secreto',hue:[255,232,180],locked:true,d:'Revela-se depois do Juramento da Âncora.',
  lore:'Há um rank acima de todos os outros. Ninguém em Aster sabe dizer que estrela é essa.',
  art:[['+',star8(240,70)],['-',star8(150,44)],['+',circ(300,300,40)]],
  pts:[[300,60],[470,130],[540,300],[470,470],[300,540],[130,470],[60,300],[130,130],[300,190],[300,410],[300,300]]};

let C=null,root=null,cv=null,ctx=null,raf=0,open=false,W=0,H=0,DPR=1;
const S=.0007;
let cur=-1,focused=false,hover=null,sel=null,parts=[],t0=0,last=0,lit=null,sway={x:0,y:0},swayT={x:0,y:0},down=null;
const cam={y:-.4,p:.3,f:1.8},tgt={y:0,p:.3,f:1.8};
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function dir(y,p){return[Math.cos(p)*Math.sin(y),Math.sin(p),Math.cos(p)*Math.cos(y)]}
function basis(y,p){return{f:dir(y,p),r:[Math.cos(y),0,-Math.sin(y)],u:[-Math.sin(p)*Math.sin(y),Math.cos(p),-Math.sin(p)*Math.cos(y)]}}
const dot3=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const angd=(a,b)=>((a-b+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;
const nearY=a=>cam.y+angd(a,cam.y);
let sky=[],neb=[],B=basis(0,0),F=1;const nexo=dir(0,.035);
function proj(d){const z=dot3(d,B.f);if(z<.05)return null;return[W/2+dot3(d,B.r)/z*F,H/2-dot3(d,B.u)/z*F,z]}
function lbl(t,x,y){ctx.lineWidth=4;ctx.lineJoin='round';ctx.strokeStyle='rgba(4,6,14,.92)';ctx.strokeText(t,x,y);ctx.fillText(t,x,y)}
function paintArt(art,g,N){if(art&&art.tagName==='IMG'){g.drawImage(art,0,0,N,N);return}g.save();g.scale(N/600,N/600);for(const[op,d]of art){g.globalCompositeOperation=op==='+'?'source-over':'destination-out';g.fillStyle='#fff';g.fill(new Path2D(d))}g.restore();g.globalCompositeOperation='source-over'}
function build(c,i){
  const N=180,o=document.createElement('canvas');o.width=o.height=N;const g=o.getContext('2d',{willReadFrequently:true});paintArt(c.art,g,N);
  const px=g.getImageData(0,0,N,N).data,inside=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&px[(y*N+x)*4+3]>110;
  const edge=[],fill=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(inside(x,y))(inside(x+1,y)&&inside(x-1,y)&&inside(x,y+1)&&inside(x,y-1)?fill:edge).push([x,y]);
  const r=mulberry(i+5);c.dust=[];const pick=(arr,n,e)=>{for(let k=0;k<n&&arr.length;k++){const[x,y]=arr[Math.floor(r()*arr.length)];c.dust.push({x:(x+r())*600/N-300,y:(y+r())*600/N-300,e,s:.5+r()*(e?1.3:.8),ph:r()*6.28})}};
  pick(edge,Math.min(1100,edge.length*2.4),1);pick(fill,650,0);
  const T=512,tx=document.createElement('canvas');tx.width=tx.height=T;const t2=tx.getContext('2d');
  const m=document.createElement('canvas');m.width=m.height=T;paintArt(c.art,m.getContext('2d'),T);
  const[rr,gg,bb]=c.hue;
  t2.filter='blur(14px)';t2.globalAlpha=.55;t2.drawImage(m,0,0);t2.filter='blur(3px)';t2.globalAlpha=.5;t2.drawImage(m,0,0);t2.filter='none';t2.globalAlpha=1;
  t2.globalCompositeOperation='source-in';const gr=t2.createRadialGradient(T/2,T/2,0,T/2,T/2,T*.6);gr.addColorStop(0,`rgb(${rr*.55|0},${gg*.55|0},${bb*.65|0})`);gr.addColorStop(1,`rgb(${rr},${gg},${bb})`);t2.fillStyle=gr;t2.fillRect(0,0,T,T);
  c.tex=tx}
function setup(){
  if(C)return;
  C=CONS.map(([k,n,d,cap])=>({k,n,d,cap,...(FIG[k]||FIG.fur)})).concat(((window.CONS569||{}).soon||[]).map(([k,n])=>({k,n,cap:'',...FIG[k],d:FIG[k].soon,locked:true,soon:true}))).concat([STAR]);
  const R=mulberry(11);
  for(let i=0;i<1800;i++)sky.push({d:dir((R()*2-1)*Math.PI,Math.asin(R())*1.02-.04),s:.4+R()*1.3,ph:R()*6.28,l:.25+R()*.75});
  const cols=[[60,80,170],[110,60,160],[30,110,150],[150,90,140],[90,60,120]];for(let i=0;i<110;i++){const y=(R()*2-1)*Math.PI;neb.push({d:dir(y,.25+Math.sin(y*1.3)*.25+R()*.5),r:.1+R()*.34,c:cols[i%5],a:.03+R()*.05})}
  C.forEach((c,i)=>{
    c.p=c.pts.map(([x,y],j)=>({i:j,x:x-300,y:y-300,apex:j===10}));
    c.yaw=i*2*Math.PI/C.length;c.pc=[.28,.7,1.12][i%3];c.roll=(((i*5)%7)-3)*.09;
    const b0=basis(c.yaw,c.pc),cr=Math.cos(c.roll),sr=Math.sin(c.roll),cb={f:b0.f,r:[0,1,2].map(k=>b0.r[k]*cr+b0.u[k]*sr),u:[0,1,2].map(k=>b0.u[k]*cr-b0.r[k]*sr)};
    const m=(x,y)=>{const v=[0,1,2].map(k=>cb.f[k]+(x*cb.r[k]-y*cb.u[k])*S),l=Math.hypot(...v);return v.map(q=>q/l)};
    c.m=m;c.center=cb.f;c.labelD=m(0,350);build(c,i);c.dust.forEach(q=>q.d=m(q.x,q.y));c.p.forEach(p=>p.v=m(p.x,p.y))});
  const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  root=document.createElement('div');root.id='cons523';root.hidden=true;root.setAttribute('role','dialog');root.setAttribute('aria-label','Constelações');
  root.innerHTML='<canvas tabindex="0" aria-label="Céu de constelações. Setas trocam, Enter entra, Esc volta."></canvas><div class="c5-pts"><b></b>pontos de constelação<small>Ganhe 1 a cada 3 níveis, do 37 ao 777.</small></div><div class="c5-top"><h1></h1><p class="c5-sub"></p><q class="c5-q">Você chegou a Aster sem conhecer suas estrelas.</q></div><button class="c5-x" type="button">Fechar</button><button class="c5-conv" type="button" hidden></button><div class="c5-panel" aria-live="polite"></div><div class="c5-toast"></div><div class="c5-keys"></div>';
  document.body.appendChild(root);cv=root.querySelector('canvas');ctx=cv.getContext('2d');
  root.querySelector('.c5-x').onclick=close;
  root.querySelector('.c5-conv').onclick=()=>{try{extraActions('consconv',0);if(typeof saveRun==='function')saveRun()}catch(e){console.warn(e)}ui()};
  cv.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,cy:tgt.y};cv.setPointerCapture(e.pointerId)});
  cv.addEventListener('pointermove',e=>{
    if(down&&!focused){tgt.y=down.cy-(e.clientX-down.x)/F;cam.y=tgt.y}
    swayT.x=(e.clientX/W-.5)*.05;swayT.y=-(e.clientY/H-.5)*.035;
    const h=pick(e.clientX,e.clientY);if(h!==hover){hover=h;ui()}cv.classList.toggle('hand',!!h||!focused)});
  cv.addEventListener('pointerup',e=>{const moved=down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>8;
    if(!focused){if(moved){cur=C.reduce((bi,c,i)=>Math.abs(angd(c.yaw,tgt.y))<Math.abs(angd(C[bi].yaw,tgt.y))?i:bi,0);tgt.y=nearY(C[cur].yaw);ui()}
      else{const i=pickSky(e.clientX,e.clientY);if(i>=0){cur=i;setFocus(true)}}}
    else if(!moved){const p=pick(e.clientX,e.clientY);if(p){sel=p;buy(p)}}
    down=null});
  addEventListener('keydown',e=>{if(!open)return;e.stopImmediatePropagation();
    const k=e.key;if(['ArrowLeft','ArrowRight','Enter',' ','Escape'].includes(k))e.preventDefault();
    if(k==='Escape'){if(focused)setFocus(false);else close()}
    else if(!focused&&k==='ArrowRight')go(1);else if(!focused&&k==='ArrowLeft')go(-1);else if(!focused&&k==='Enter')setFocus(true);
    else if(focused&&(k==='ArrowRight'||k==='ArrowLeft')){const ps=C[cur].p,i=sel?ps.indexOf(sel):-1;sel=ps[((i<0?0:i)+(k==='ArrowRight'?1:ps.length-1))%ps.length];hover=null;ui()}
    else if(focused&&(k===' '||k==='Enter')&&sel)buy(sel)},true);
  addEventListener('keyup',e=>{if(open)e.stopImmediatePropagation()},true);
  addEventListener('resize',()=>{if(open)resize()});
}
const lv=c=>c.locked?0:cons(c.k);
const isOn=(c,p)=>!c.locked&&(p.apex?lv(c)>=10:p.i<lv(c));
const canBuy=(c,p)=>!c.locked&&!p.apex&&p.i===lv(c)&&lv(c)<10;
function resize(){DPR=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR}
function setFocus(f){if(cur<0)cur=0;const c=C[cur];focused=f;tgt.y=nearY(c.yaw+(f?(W<760?.04:.2):0));tgt.p=f?c.pc:.3;tgt.f=f?.92:1.8;hover=null;sel=f?(c.p[Math.min(10,lv(c))]||c.p[0]):null;ui()}
function go(d){cur=((cur<0?0:cur)+d+C.length)%C.length;tgt.y=nearY(C[cur].yaw);ui()}
function mount(a){return .035*Math.sin(a*3.1+1)+.025*Math.sin(a*7.3)+.012*Math.sin(a*17.9+2)+.006*Math.sin(a*41)+.04}
function toScreen(p){return proj(p.v)||[-999,-999,0]}
function pick(mx,my){if(!focused)return null;const c=C[cur];let best=null,bd=28;for(const p of c.p){const[x,y]=toScreen(p),d=Math.hypot(x-mx,y-my);if(d<bd){bd=d;best=p}}return best}
function pickSky(mx,my){let bi=-1,bd=1e9;C.forEach((c,i)=>{const q=dot3(c.center,B.f)>.2&&proj(c.center);if(!q)return;const d=Math.hypot(q[0]-mx,q[1]-my);if(d<bd){bd=d;bi=i}});return bd<Math.max(170,F*.32)?bi:-1}
function buy(p){const c=C[cur];
  if(c.locked){toast(c.soon?'Revela-se em breve':'Revela-se depois do Juramento da Âncora');return}
  if(isOn(c,p)){toast(p.apex?'Ápice aceso':'Já aceso');return}
  if(p.apex){toast('O Ápice acende sozinho com as 10 estrelas');return}
  if(!canBuy(c,p)){toast('Acenda as estrelas em ordem');return}
  if((run.cpts||0)<1){toast('Sem pontos. Ganhe 1 a cada 3 níveis, do 37 ao 777');return}
  run.cons=run.cons||{};run.cons[c.k]=(run.cons[c.k]||0)+1;run.cpts--;
  if(typeof refreshStats==='function')refreshStats();if(typeof saveRun==='function')saveRun();
  try{sfx('levelup')}catch(e){}
  const[x,y]=toScreen(p);burst(x,y,50,[255,230,190],180);
  if(lv(c)>=10){const a=toScreen(c.p[10]);burst(a[0],a[1],140,c.hue,320);lit=c;c.litT=(performance.now()-t0)/1000;toast(c.n+': Ápice aceso')}
  else toast(c.n+' '+lv(c)+'/10');
  sel=c.p[Math.min(10,lv(c))];ui()}
function burst(x,y,n,col,sp){for(let i=0;i<n;i++){const a=Math.random()*6.28,v=40+Math.random()*sp;parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:.6+Math.random()*.8,c:col})}}
let tt;function toast(m){const e=root.querySelector('.c5-toast');e.textContent=m;e.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('show'),1800)}
function ui(){
  const c=cur<0?null:C[cur],q=s=>root.querySelector(s);
  q('h1').textContent=c?c.n:'O Céu de Aster';
  q('.c5-sub').textContent=c?(c.soon?c.fig+' · desperta em breve':c.locked?'???':c.fig+' · '+lv(c)+'/10'+(lv(c)>=10?' · Ápice':'')):'Constelações';
  q('.c5-q').style.opacity=focused?0:1;
  q('.c5-pts b').textContent=run.cpts||0;
  const cb=q('.c5-conv');const full=typeof consFull==='function'&&consFull()&&(run.cpts||0)>0;cb.hidden=!full;if(full)cb.textContent='Converter '+run.cpts+' em status';
  q('.c5-keys').innerHTML=focused?'<span><kbd>Clique</kbd>acender estrela</span><span><kbd>← →</kbd>ver estrelas</span><span><kbd>Esc</kbd>voltar ao céu</span>':'<span><kbd>← →</kbd>ou arraste para girar</span><span><kbd>Enter</kbd>ou clique para entrar</span><span><kbd>Esc</kbd>fechar</span>';
  const p=focused?(hover||sel):null,el=q('.c5-panel');
  if(!p||!c){el.classList.remove('show');return}
  let h;
  if(c.soon)h='<h2>'+c.n+'</h2><p class="c5-st">Desperta em breve</p><p class="c5-d">'+c.d+'</p>';
  else if(c.locked)h='<h2>???</h2><p class="c5-st">Bloqueada</p><p class="c5-d">'+c.d+'</p>';
  else if(p.apex)h='<h2>Ápice de '+c.n+'</h2><p class="c5-st'+(isOn(c,p)?' ok':'')+'">'+(isOn(c,p)?'Aceso':'Acende com as 10 estrelas')+'</p><p class="c5-d">'+c.cap.replace('Ápice: ','')+'.</p>';
  else{const n=p.i+1,ex=c.ex(n);
    h='<h2>'+c.n+' '+n+'</h2><p class="c5-st'+(isOn(c,p)?' ok':'')+'">'+(isOn(c,p)?'Aceso':canBuy(c,p)?((run.cpts||0)>0?'Disponível · 1 ponto':'Sem pontos'):'Acenda a estrela '+p.i+' antes')+' · '+n+' de 10</p><p class="c5-d">'+c.d+'.</p><div class="c5-ex"><span>Com '+n+' estrela'+(n>1?'s':'')+'</span>'+ex[0]+' → '+ex[1]+'</div>'}
  el.innerHTML=h+'<p class="c5-lore">'+c.lore+'</p>';el.classList.add('show')}
function glow(x,y,r,c,a){if(!(r>0))return;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a})`);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
function dot(x,y,r,c,a){ctx.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},${a})`;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()}
function flare(x,y,r,a){const h=ctx.createLinearGradient(x-r,y,x+r,y),v=ctx.createLinearGradient(x,y-r,x,y+r);for(const g of[h,v]){g.addColorStop(0,'rgba(255,240,220,0)');g.addColorStop(.5,`rgba(255,245,230,${.6*a})`);g.addColorStop(1,'rgba(255,240,220,0)')}ctx.fillStyle=h;ctx.fillRect(x-r,y-.7,r*2,1.4);ctx.fillStyle=v;ctx.fillRect(x-.7,y-r,1.4,r*2)}
function frame(now){
  if(!open)return;raf=requestAnimationFrame(frame);
  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dt=Math.min(.05,(now-last)/1000);last=now;const t=(now-t0)/1000;
  const k=RM?1:1-Math.exp(-dt*2.6);cam.y+=(tgt.y-cam.y)*k;cam.p+=(tgt.p-cam.p)*k;cam.f+=(tgt.f-cam.f)*k;
  sway.x+=(swayT.x-sway.x)*Math.min(1,dt*2);sway.y+=(swayT.y-sway.y)*Math.min(1,dt*2);
  const drift=RM?0:Math.sin(t*.13)*.012;
  B=basis(cam.y+sway.x+drift,cam.p+sway.y);F=(H/2)/Math.tan(cam.f/2)*Math.max(1,W/H*.62);
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
  const hz=proj(dir(cam.y+sway.x+drift,0)),hy=hz?hz[1]:H*1.5,cl=v=>Math.max(0,Math.min(1,v));
  const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#02030a');bg.addColorStop(cl(hy/H-.3),'#070b1b');bg.addColorStop(cl(hy/H-.02),'#18213f');bg.addColorStop(cl(hy/H),'#24305a');bg.addColorStop(1,'#24305a');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  ctx.globalCompositeOperation='lighter';
  for(const n of neb){const q=proj(n.d);if(!q)continue;const r=n.r*F;if(q[0]<-r||q[0]>W+r||q[1]<-r||q[1]>H+r)continue;glow(q[0],q[1],r,n.c,n.a)}
  for(const s of sky){const q=proj(s.d);if(!q||q[0]<0||q[0]>W||q[1]<0||q[1]>H)continue;ctx.fillStyle=`rgba(225,235,255,${(.45+.4*Math.sin(t*1.7*s.l+s.ph))*s.l})`;ctx.fillRect(q[0],q[1],s.s,s.s)}
  const zz=Math.min(1.6,F/700);
  const LB=[];
  C.forEach((c,ci)=>{
    if(dot3(c.center,B.f)<.2)return;
    const near=ci===cur,fa=c.locked?.38:(near||cur<0?1:.5),[r,g,b]=c.hue;
    const p0=proj(c.m(0,0)),px=proj(c.m(300,0)),py=proj(c.m(0,300));
    if(p0&&px&&py){ctx.save();ctx.setTransform(DPR*(px[0]-p0[0])/300,DPR*(px[1]-p0[1])/300,DPR*(py[0]-p0[0])/300,DPR*(py[1]-p0[1])/300,DPR*p0[0],DPR*p0[1]);
      ctx.globalAlpha=Math.min(1,(.3+.06*Math.sin(t*.8+ci))*fa*(c.locked?.6:1)+(lit===c?.35*Math.max(0,1-(t-c.litT)):0));ctx.drawImage(c.tex,-300,-300,600,600);ctx.restore()}
    for(const q of c.dust){const s=proj(q.d);if(!s||s[0]<-5||s[0]>W+5||s[1]<-5||s[1]>H+5)continue;
      ctx.fillStyle=`rgba(${Math.min(255,r+60)},${Math.min(255,g+60)},${Math.min(255,b+60)},${(q.e?.85:.3)*(.6+.4*Math.sin(t*1.3+q.ph))*fa})`;const z=q.s*Math.max(.9,zz*.75);ctx.fillRect(s[0],s[1],z,z)}
    for(let i=1;i<c.p.length;i++){const a=c.p[i-1],p=c.p[i],A=proj(a.v),Bq=proj(p.v);if(!A||!Bq)continue;const[x1,y1]=A,[x2,y2]=Bq;
      if(isOn(c,p)&&isOn(c,a)){for(const w of [[10,.07],[3.2,.28],[1.4,.9]]){ctx.lineWidth=w[0];ctx.strokeStyle=`rgba(255,240,215,${w[1]*fa})`;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
        const u=(t*.3+i*.17)%1;glow(x1+(x2-x1)*u,y1+(y2-y1)*u,11,[255,245,225],.7*fa)}
      else{ctx.lineWidth=1;ctx.strokeStyle=`rgba(${r},${g},${b},${(canBuy(c,p)?.6:.28)*fa})`;ctx.setLineDash([3,6]);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.setLineDash([])}}
    for(const p of c.p){const q=proj(p.v);if(!q)continue;const[x,y]=q,on=isOn(c,p),av=canBuy(c,p),hv=near&&focused&&(hover===p||sel===p),pulse=.5+.5*Math.sin(t*3+p.x),big=p.apex?1.7:1;
      if(on){glow(x,y,46*zz*big,[255,236,200],.55*fa);flare(x,y,32*zz*big*(.9+.1*pulse),fa);dot(x,y,3.4*big,[255,255,255],fa)}
      else if(av){glow(x,y,32*zz*big,[r,g,b],(.32+.28*pulse)*fa);dot(x,y,2.9*big,[240,245,255],.95*fa)}
      else{glow(x,y,18*zz*big,[r,g,b],.18*fa);dot(x,y,2*big,[210,220,240],.6*fa)}
      if(p.apex&&!c.locked){ctx.lineWidth=1;ctx.strokeStyle=`rgba(${r},${g},${b},${.35*fa})`;ctx.beginPath();ctx.arc(x,y,22*zz,0,7);ctx.stroke()}
      if(hv){ctx.lineWidth=1;ctx.strokeStyle='rgba(255,255,255,.65)';ctx.beginPath();ctx.arc(x,y,17*big+pulse*2,0,7);ctx.stroke()}}
    if(!focused){const l=proj(c.labelD);if(l)LB.push({x:l[0],y:Math.min(l[1],hy-62),a:near?.98:.8,b:near?.95:.75,n:c.n.toUpperCase(),s:c.soon?c.fig.toUpperCase()+' · EM BREVE':c.locked?'???':c.fig.toUpperCase()+' · '+lv(c)+'/10'})}
  });
  /* v582: rótulos perto do horizonte caíam todos na mesma altura e se sobrepunham: empilha os que colidem */
  LB.sort((p,q)=>p.x-q.x);const placed=[];ctx.globalCompositeOperation='source-over';ctx.textAlign='center';
  for(const l of LB){let y=l.y,k=0;while(k++<8&&placed.some(o=>Math.abs(o.x-l.x)<150&&Math.abs(o.y-y)<44))y-=46;placed.push({x:l.x,y});
    ctx.font='500 18px Jost, "Chakra Petch", sans-serif';ctx.fillStyle=`rgba(246,242,233,${l.a})`;lbl(l.n,l.x,y);ctx.font='400 13px Jost, "Chakra Petch", sans-serif';ctx.fillStyle=`rgba(200,196,186,${l.b})`;lbl(l.s,l.x,y+20)}
  ctx.globalCompositeOperation='lighter';
  parts=parts.filter(q=>(q.l-=dt)>0);for(const q of parts){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=.96;q.vy*=.96;glow(q.x,q.y,6+q.l*10,q.c,q.l)}
  const nq=proj(nexo);ctx.globalCompositeOperation='source-over';
  if(hy<H+F*.2){
    const fog=ctx.createLinearGradient(0,hy-F*.16,0,hy);fog.addColorStop(0,'rgba(120,140,200,0)');fog.addColorStop(1,'rgba(120,140,200,.2)');ctx.fillStyle=fog;ctx.fillRect(0,hy-F*.16,W,F*.16);
    for(const [lay,col,sc,off] of [[0,'#0d1324',.85,2.1],[1,'#04060c',1,0]]){ctx.beginPath();ctx.moveTo(0,H);
      for(let x=0;x<=W+6;x+=6){const a=cam.y+sway.x+drift+Math.atan((x-W/2)/F)+off;ctx.lineTo(x,hy-mount(a*(lay?1:1.6))*F*sc)}
      ctx.lineTo(W,H);ctx.closePath();ctx.fillStyle=col;ctx.fill();if(lay){ctx.strokeStyle='rgba(170,190,235,.22)';ctx.lineWidth=1;ctx.stroke()}}
    if(nq){ctx.globalCompositeOperation='lighter';const pu=.75+.25*Math.sin(t*2);glow(nq[0],nq[1],70*zz*pu,[90,150,255],.5);glow(nq[0],nq[1],14*zz,[200,225,255],.9);
      ctx.globalCompositeOperation='source-over';ctx.font='300 10px Jost, "Chakra Petch", sans-serif';ctx.textAlign='center';ctx.fillStyle='rgba(180,200,240,.7)';ctx.fillText('NEXO DE ASTER',nq[0],nq[1]+30*zz+8)}
  }
}
function show(k){
  setup();
  if(typeof modalOpen!=='undefined'&&modalOpen&&typeof closeModal==='function')closeModal();
  try{paused=true}catch(e){}
  root.hidden=false;open=true;resize();parts=[];lit=null;
  cur=-1;focused=false;Object.assign(cam,{y:-.4,p:.3,f:1.8});Object.assign(tgt,{y:0,p:.3,f:1.8});
  t0=last=performance.now();ui();cv.focus({preventScroll:true});
  const i=k?C.findIndex(c=>c.k===k):-1;
  if(i>=0){cur=i;setFocus(true);Object.assign(cam,tgt)}
  else setTimeout(()=>{if(open&&cur<0&&(run.cpts||0)>0){const j=C.findIndex(c=>!c.locked&&cons(c.k)<10);cur=j<0?0:j;setFocus(true)}},2600);
  cancelAnimationFrame(raf);raf=requestAnimationFrame(frame)}
function close(){if(!open)return;open=false;root.hidden=true;cancelAnimationFrame(raf);
  try{if(!modalOpen&&player&&!player.dead&&$('dead').hidden)paused=false}catch(e){}}
window.Cons523={open:show,close,isOpen:()=>open};
// a janela antiga (lista com estrelas ★) vira esta tela
consView=function(){show()};
/* v565 (Ian): fácil de achar — tecla própria, entrada no MENU e aviso de ponto novo (sem barra nova no HUD) */
function keyName(){try{return keyLabel(keyOf('cons'))}catch(e){return '7'}}
function canOpen(){try{return started&&$('dead').hidden}catch(e){return false}}
function menu(){try{toggleGameMenu95(false)}catch(e){}
  if(open){close();return}
  if(!canOpen())return;
  try{if(!unl('constel')){toast('<b>[NARRADOR]</b> O céu de constelações abre no nível 35.');return}}catch(e){}
  show()}
window.Cons523.menu=menu;
function labelBtn(){const b=document.getElementById('bCons523');if(b)b.innerHTML='✦ CONSTELAÇÕES <kbd style="opacity:.75">['+keyName()+']</kbd>'}
addEventListener('keydown',e=>{if(e.repeat||e.target&&['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;
  let want='Digit7';try{want=keyOf('cons')}catch(_){}
  if(e.code!==want)return;
  if(open){e.preventDefault();e.stopImmediatePropagation();close();return}
  if(!canOpen()||(typeof modalOpen!=='undefined'&&modalOpen&&0))return;
  e.preventDefault();e.stopImmediatePropagation();menu()},true);
let seen=-1,nt=0,nel=null;
function note(n){if(!nel){nel=document.createElement('button');nel.type='button';nel.id='cons523note';
  nel.style.cssText='position:fixed;top:calc(52px + env(safe-area-inset-top,0px));right:calc(8px + env(safe-area-inset-right,0px));z-index:8;font:700 12px "Chakra Petch",sans-serif;letter-spacing:.06em;color:#fff3d0;background:rgba(20,16,40,.92);border:1px solid #ffd070;border-radius:6px;padding:9px 12px;cursor:pointer;box-shadow:0 0 14px #ffd07066';
  nel.onclick=()=>{nel.hidden=true;menu()};document.body.appendChild(nel)}
  nel.innerHTML='✦ '+(n>1?n+' novos pontos':'Novo ponto')+' — <kbd>'+keyName()+'</kbd> Constelações';nel.hidden=false;clearTimeout(nt);nt=setTimeout(()=>{nel.hidden=true},12000)}
setInterval(()=>{try{labelBtn();if(!canOpen()){if(nel)nel.hidden=true;return}
  const p=run.cpts||0;if(seen<0){seen=p;return}
  if(p>seen&&!open)note(p-seen+(nel&&!nel.hidden?0:0));if(p<seen&&nel)nel.hidden=true;if(open&&nel)nel.hidden=true;seen=p}catch(e){}},1000);
})();
