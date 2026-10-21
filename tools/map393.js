/* v393 (Ian): "o mapa não parece mapa de RPG: escuro, só pontos". Agora o minimapa e o mapa grande têm
   terreno pintado por bioma com sombra de relevo (montanhas aparecem), rios e lagos, estradas, ícones de
   acampamentos (barracas), postos avançados, moldura de pergaminho, rosa dos ventos e legenda no mapa grande.
   Os pontos antigos (cidades, portais, monstros, chefes, carroças, tesouro) continuam por cima, iguais. */
(function(){
  const BIO={campos:[143,168,96],floresta:[70,112,64],flores:[160,180,98],pantano:[92,112,84],deserto:[214,194,140],vulcao:[104,72,62],neve:[204,214,222],cristal:[170,206,226]};
  const WATER=[63,128,176],ICE=[196,228,242],ROAD='rgba(120,88,52,.85)';
  const cache={full:null,mini:null},W393={t:0};

  function biomeColor(x,z){let b='campos';try{b=biomeAt(x,z)}catch(_){}return BIO[b]||BIO.campos}
  function waterKind(x,z){ // 0 seco/terra, 1 água, 2 gelo
    try{if(window.TER245&&TER245.SEA439&&TER245.SEA439.d(x,z)>0)return 1}catch(_){}/* v501: mar do mapa finito */
    try{const rv=riverNear239(x,z),w=riverWidth351(rv.b,z);if(rv.d<w/2){const s=snowB(x,z);if(s>.717)return 0;return s<.29?2:1}
      const lk=lakeAt239(Math.round(x/CH),Math.round(z/CH));if(lk&&Math.hypot(x-lk.x,z-lk.z)<lk.r)return ['neve','cristal'].includes(biomeAt(lk.x,lk.z))?2:1}catch(_){}
    return 0}

  /* pinta o terreno numa tela à parte: cor do bioma + sombra de relevo + água; refeito só quando sai da margem */
  function raster(key,S,k,cx,cz,step){
    const c=cache[key],pad=S*(key==='full'?.25:.5);
    if(c&&c.k===k&&c.S===S&&Math.abs(c.cx-cx)*k<pad*.6&&Math.abs(c.cz-cz)*k<pad*.6)return c;
    const W=Math.ceil((S+pad*2)/step),cv=document.createElement('canvas');cv.width=W;cv.height=W;const g=cv.getContext('2d'),img=g.createImageData(W,W),d=img.data;
    const ox=cx-(S/2+pad)/k,oz=cz-(S/2+pad)/k,m=step/k;
    for(let j=0;j<W;j++)for(let i=0;i<W;i++){const x=ox+(i+.5)*m,z=oz+(j+.5)*m,o=(j*W+i)*4;let col;
      const wk=waterKind(x,z);
      if(Math.abs(x)>5000||Math.abs(z)>5000){col=[24,18,12]}else /* v501: fora do mapa finito */
      if(wk){col=wk===2?ICE:WATER}else{
        const h=terrH(x,z),hx=terrH(x+m,z+m),sh=Math.max(.55,Math.min(1.35,1+(h-hx)*.16/Math.max(.6,m)));
        col=biomeColor(x,z);const mt=window.TER245&&TER245.mt383?TER245.mt383(x,z):0;
        if(mt>12){const r=Math.min(1,(mt-12)/18);col=[col[0]+(150-col[0])*r*.6,col[1]+(140-col[1])*r*.6,col[2]+(128-col[2])*r*.6]}
        if(h>34){const r=Math.min(1,(h-34)/8);col=[col[0]+(240-col[0])*r,col[1]+(240-col[1])*r,col[2]+(240-col[2])*r]}
        col=[col[0]*sh,col[1]*sh,col[2]*sh]}
      d[o]=col[0];d[o+1]=col[1];d[o+2]=col[2];d[o+3]=255}
    g.putImageData(img,0,0);
    // estradas por cima, já na tela guardada
    const big=document.createElement('canvas');big.width=big.height=Math.round(S+pad*2);const bg=big.getContext('2d');bg.imageSmoothingEnabled=true;bg.drawImage(cv,0,0,big.width,big.height);
    try{const segs=roadSegs(cx,cz,key==='full'?2:1),T=x=>(x-ox)*k;bg.strokeStyle=ROAD;bg.lineCap='round';bg.lineWidth=Math.max(2,4*k);bg.setLineDash(key==='full'?[]:[]);
      for(const [x1,z1,x2,z2] of segs){bg.beginPath();bg.moveTo(T(x1),(z1-oz)*k);bg.lineTo(T(x2),(z2-oz)*k);bg.stroke()}
      bg.strokeStyle='rgba(235,210,160,.35)';bg.lineWidth=Math.max(1,1.4*k);for(const [x1,z1,x2,z2] of segs){bg.beginPath();bg.moveTo(T(x1),(z1-oz)*k);bg.lineTo(T(x2),(z2-oz)*k);bg.stroke()}}catch(_){}
    return cache[key]={cv:big,k,S,cx,cz,ox,oz}}

  function drawTerrain(ctx,S,full){
    if(L.mode!=='world')return false;const P=player,k=full?S/560:2.2;
    let c;
    if(full){const old=cache.full,fresh=old&&old.k===k&&old.S===S&&Math.abs(old.cx-P.x)*k<S*.15&&Math.abs(old.cz-P.z)*k<S*.15;
      if(fresh)c=old;else{ // abre na hora com uma versão rápida; a detalhada fica pronta logo depois
        const lo=W393.lo;c=lo&&lo.k===k&&lo.S===S&&Math.abs(lo.cx-P.x)*k<S*.15&&Math.abs(lo.cz-P.z)*k<S*.15?lo:(cache.full=null,W393.lo=raster('full',S,k,P.x,P.z,12));cache.full=null;
        if(!W393.t)W393.t=setTimeout(()=>{W393.t=0;try{cache.full=null;raster('full',S,k,player.x,player.z,5);const bm=document.getElementById('bigmap');if(bm)drawMap(bm.getContext('2d'),bm.width,true)}catch(_){}},30)}}
    else c=raster('mini',S,k,P.x,P.z,4);
    ctx.save();ctx.globalAlpha=1;ctx.drawImage(c.cv,(c.ox-P.x)*k+S/2,(c.oz-P.z)*k+S/2);
    // tom de pergaminho e escurecido nas bordas
    ctx.fillStyle='rgba(214,190,140,.16)';ctx.fillRect(0,0,S,S);
    const v=ctx.createRadialGradient(S/2,S/2,S*.3,S/2,S/2,S*.72);v.addColorStop(0,'rgba(40,24,8,0)');v.addColorStop(1,'rgba(40,24,8,.55)');ctx.fillStyle=v;ctx.fillRect(0,0,S,S);
    ctx.restore();return true}

  /* ícones novos: barracas dos clãs e postos avançados */
  function tent(ctx,X,Z,r,col){ctx.fillStyle=col;ctx.strokeStyle='#2a1a0a';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(X,Z-r);ctx.lineTo(X+r,Z+r*.8);ctx.lineTo(X-r,Z+r*.8);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(X,Z-r*.1);ctx.lineTo(X,Z+r*.8);ctx.stroke()}
  function tower(ctx,X,Z,r){ctx.fillStyle='#cfc4ae';ctx.strokeStyle='#2a1a0a';ctx.lineWidth=1.6;ctx.fillRect(X-r*.55,Z-r,r*1.1,r*1.8);ctx.strokeRect(X-r*.55,Z-r,r*1.1,r*1.8);ctx.fillStyle='#7a2a20';ctx.fillRect(X-r*.75,Z-r-2,r*1.5,3)}
  function icons(ctx,S,full){
    if(L.mode!=='world')return;const P=player,k=full?S/560:2.2,tx=x=>S/2+(x-P.x)*k,tz=z=>S/2+(z-P.z)*k,span=S/2/k+20,in_=(x,z)=>Math.abs(x-P.x)<span&&Math.abs(z-P.z)<span;
    ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
    try{if(window.Living372&&Living372.site){const a=Math.floor((P.x-span)/160),b=Math.ceil((P.x+span)/160),c=Math.floor((P.z-span)/160),d=Math.ceil((P.z+span)/160);
      for(let i=a;i<=b;i++)for(let j=c;j<=d;j++){const s=Living372.site(i,j);if(!s||!in_(s.x,s.z))continue;const X=tx(s.x),Z=tz(s.z);tent(ctx,X,Z,full?8:5,'#e0a85a');
        if(full){const n=(s.clan&&(s.clan.n||s.clan.name))||s.name||'Acampamento';ctx.font='700 11px "Chakra Petch",sans-serif';ctx.lineWidth=3;ctx.strokeStyle='rgba(20,12,4,.85)';ctx.strokeText(n,X,Z+15);ctx.fillStyle='#ffe6b8';ctx.fillText(n,X,Z+15)}}}}catch(_){}
    try{const a=Math.floor((P.x-span)/CH),b=Math.ceil((P.x+span)/CH),c=Math.floor((P.z-span)/CH),d=Math.ceil((P.z+span)/CH);
      for(let i=a;i<=b;i++)for(let j=c;j<=d;j++){const o=outpostPoint361(i,j);if(!o||!in_(o.x,o.z))continue;tower(ctx,tx(o.x),tz(o.z),full?7:4)}}catch(_){}
    ctx.restore()}

  function frame(ctx,S,full){
    ctx.save();ctx.strokeStyle='#5a3e1c';ctx.lineWidth=full?6:4;ctx.strokeRect(1,1,S-2,S-2);ctx.strokeStyle='rgba(255,220,160,.5)';ctx.lineWidth=1;ctx.strokeRect(full?7:5,full?7:5,S-(full?14:10),S-(full?14:10));
    if(full){ // rosa dos ventos
      const X=S-46,Z=50;ctx.translate(X,Z);ctx.fillStyle='rgba(40,24,8,.55)';ctx.beginPath();ctx.arc(0,0,30,0,7);ctx.fill();
      for(let q=0;q<4;q++){ctx.rotate(Math.PI/2);ctx.fillStyle=q===3?'#c0392b':'#f1e0bb';ctx.beginPath();ctx.moveTo(0,-26);ctx.lineTo(6,0);ctx.lineTo(-6,0);ctx.closePath();ctx.fill()}
      ctx.fillStyle='#fff';ctx.font='700 12px "Russo One",sans-serif';ctx.textAlign='center';ctx.fillText('N',0,-34);ctx.setTransform(1,0,0,1,0,0);
      // legenda
      const items=[['tent','Acampamento'],['tower','Posto avançado'],['city','Cidade'],['gate','Portal'],['road','Estrada'],['water','Rio / lago'],['mob','Monstro']];
      const lx=14,ly=S-14-items.length*17;ctx.fillStyle='rgba(30,18,6,.72)';ctx.fillRect(lx-6,ly-14,150,items.length*17+12);ctx.font='600 11px "Chakra Petch",sans-serif';ctx.textAlign='left';ctx.textBaseline='middle';
      items.forEach(([t,n],i)=>{const y=ly+i*17,x=lx+7;
        if(t==='tent')tent(ctx,x,y,6,'#e0a85a');else if(t==='tower')tower(ctx,x,y,5);
        else if(t==='city'){ctx.fillStyle='rgba(255,179,71,.3)';ctx.strokeStyle='#ffb347';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.fill();ctx.stroke()}
        else if(t==='gate'){ctx.strokeStyle='#7ce6cf';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,5,0,7);ctx.stroke()}
        else if(t==='road'){ctx.strokeStyle=ROAD;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x-7,y);ctx.lineTo(x+7,y);ctx.stroke()}
        else if(t==='water'){ctx.fillStyle='rgb('+WATER+')';ctx.fillRect(x-7,y-4,14,8)}
        else{ctx.fillStyle='#ff4d6a';ctx.fillRect(x-2,y-2,4,4)}
        ctx.fillStyle='#f6e7c8';ctx.fillText(n,x+14,y)})}
    ctx.restore()}

  const d0=drawMap;
  drawMap=function(ctx,S,full){
    if(L.mode!=='world')return d0(ctx,S,full);
    // o desenho antigo começa limpando e pintando o fundo escuro: troca o fundo pelo terreno pintado
    const fr=ctx.fillRect,cr=ctx.clearRect;let skip=false;
    ctx.clearRect=function(x,y,w,h){cr.call(this,x,y,w,h);if(x===0&&y===0&&w===S){try{skip=drawTerrain(ctx,S,full)}catch(e){skip=false}}};
    ctx.fillRect=function(x,y,w,h){if(skip&&x===0&&y===0&&w===S&&h===S){skip=false;return}return fr.call(this,x,y,w,h)};
    try{d0(ctx,S,full)}finally{ctx.fillRect=fr;ctx.clearRect=cr}
    try{icons(ctx,S,full);frame(ctx,S,full);window.Campaign327?.map(ctx,S,full)}catch(_){}
  };
  window.Map393={cache,raster,waterKind,biomeColor,frame,tent,tower,BIO,WATER,ICE,ROAD};
})();
