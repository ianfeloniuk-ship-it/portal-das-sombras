/* v501 (Ian, 21/10/2026): MAPA-MÚNDI FINITO. O mapa grande mostra o quadrado inteiro de 10 km (x e z de -5000 a +5000):
   mar a oeste/leste/sul, cordilheira de gelo ao norte, cor do bioma (amostrada numa grade e guardada numa tela),
   cidades, estradas, as 6 Capitais em destaque, acampamentos, postos, portais e o jogador com a direção do olhar.
   O minimapa continua local (em volta de você), mas agora pinta o mar e deixa escuro o que fica fora do mapa (tools/map393.js).
   Não há sistema de áreas exploradas no mundo aberto, então não existe neblina de guerra. */
(function(){
  const M=Map393,HALF=5000,N_LO=100,N_HI=400,PAD=16;
  const SAND=[222,204,150],DEEP=[28,78,128],PARCH=[58,42,24];
  const mix=(a,b,r)=>[a[0]+(b[0]-a[0])*r,a[1]+(b[1]-a[1])*r,a[2]+(b[2]-a[2])*r];
  const C={cv:null,lo:null,job:0,vec:null,seed:-1};

  function sample(x,z,m){
    const T=window.TER245,sd=T&&T.SEA439?T.SEA439.d(x,z):-1;
    if(sd>0){const t=Math.min(1,sd/1300);return mix(M.WATER,DEEP,t)}
    const wk=M.waterKind(x,z);if(wk)return wk===2?M.ICE:M.WATER;
    const h=terrH(x,z),hx=terrH(x+m,z+m),sh=Math.max(.78,Math.min(1.25,1+(h-hx)*.045));
    let col=M.biomeColor(x,z);
    const mt=T&&T.mt383?T.mt383(x,z):0;if(mt>12)col=mix(col,[150,140,128],Math.min(1,(mt-12)/18)*.6);
    if(sd>-90)col=mix(col,SAND,Math.min(1,(sd+90)/90)*.85);/* praia */
    const ic=T&&T.ice500?T.ice500(x,z):0;if(ic>8)col=mix(col,[226,236,246],Math.min(1,(ic-8)/60));
    else if(h>34)col=mix(col,[240,240,240],Math.min(1,(h-34)/8));
    return [col[0]*sh,col[1]*sh,col[2]*sh]}

  function paint(n,y0,y1,img){const m=2*HALF/n,d=img.data;
    for(let j=y0;j<y1;j++)for(let i=0;i<n;i++){const c=sample(-HALF+(i+.5)*m,-HALF+(j+.5)*m,m),o=(j*n+i)*4;d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=255}}
  function whole(n){const cv=document.createElement('canvas');cv.width=cv.height=n;const g=cv.getContext('2d'),img=g.createImageData(n,n);paint(n,0,n,img);g.putImageData(img,0,0);return cv}

  /* lista de elementos que não mudam, calculada uma vez por mundo */
  function vectors(){
    const v={cities:[],roads:[],tents:[],posts:[]};
    for(let rz=-2;rz<=2;rz++)for(let rx=-2;rx<=2;rx++){const c=regionCity(rx,rz);if(c&&Math.abs(c.x)<=HALF&&Math.abs(c.z)<=HALF)v.cities.push(c)}
    try{v.roads=roadSegs(0,0,3).filter(s=>s.every(q=>Math.abs(q)<=HALF))}catch(_){}
    try{if(window.Living372&&Living372.site)for(let i=-32;i<=32;i++)for(let j=-32;j<=32;j++){const s=Living372.site(i,j);if(s&&Math.abs(s.x)<=HALF&&Math.abs(s.z)<=HALF)v.tents.push(s)}}catch(_){}
    try{const n=Math.ceil(HALF/CH);for(let i=-n;i<=n;i++)for(let j=-n;j<=n;j++){const o=outpostPoint361(i,j);if(o&&Math.abs(o.x)<=HALF&&Math.abs(o.z)<=HALF)v.posts.push(o)}}catch(_){}
    return v}

  function ensure(){
    if(C.seed!==WSEED||!C.lo){if(C.job){clearTimeout(C.job);C.job=0}C.seed=WSEED;C.vec=vectors();C.lo=whole(N_LO);C.cv=null;startHi()}}
  function startHi(){
    const n=N_HI,cv=document.createElement('canvas');cv.width=cv.height=n;const g=cv.getContext('2d'),img=g.createImageData(n,n);let y=0;const seed=C.seed;
    const step=()=>{C.job=0;if(seed!==C.seed)return;paint(n,y,Math.min(n,y+20),img);y+=20;
      if(y<n){C.job=setTimeout(step,0);return}
      g.putImageData(img,0,0);C.cv=cv;const bm=document.getElementById('bigmap');if(bm&&L.mode==='world')drawMap(bm.getContext('2d'),bm.width,true)};
    C.job=setTimeout(step,0)}

  function place(ctx,S){
    const A=S-PAD*2,k=A/(2*HALF),tx=x=>PAD+(x+HALF)*k,tz=z=>PAD+(z+HALF)*k,P=player;
    ctx.clearRect(0,0,S,S);ctx.fillStyle='rgb('+PARCH+')';ctx.fillRect(0,0,S,S);
    ctx.imageSmoothingEnabled=true;ctx.drawImage(C.cv||C.lo,PAD,PAD,A,A);
    ctx.fillStyle='rgba(214,190,140,.14)';ctx.fillRect(PAD,PAD,A,A);
    ctx.strokeStyle='rgba(60,40,16,.9)';ctx.lineWidth=2;ctx.strokeRect(PAD,PAD,A,A);
    ctx.textAlign='center';ctx.textBaseline='middle';
    const label=(t,x,y,font,col)=>{ctx.font=font;ctx.lineWidth=3;ctx.strokeStyle='rgba(20,12,4,.9)';ctx.strokeText(t,x,y);ctx.fillStyle=col;ctx.fillText(t,x,y)};
    const F='700 12px "Russo One",sans-serif';
    ctx.save();ctx.globalAlpha=.8;label('CORDILHEIRA DE GELO',S/2,PAD+14,F,'#eaf6ff');
    label('MAR',PAD+24,S/2,F,'#cfe8ff');label('MAR',S-PAD-24,S/2,F,'#cfe8ff');label('MAR',S/2,S-PAD-12,F,'#cfe8ff');ctx.restore();
    ctx.lineCap='round';ctx.strokeStyle=M.ROAD;ctx.lineWidth=2;ctx.beginPath();for(const [x1,z1,x2,z2] of C.vec.roads){ctx.moveTo(tx(x1),tz(z1));ctx.lineTo(tx(x2),tz(z2))}ctx.stroke();
    for(const o of C.vec.posts)M.tower(ctx,tx(o.x),tz(o.z),2.5);
    ctx.fillStyle='#e0a85a';ctx.beginPath();for(const s of C.vec.tents){ctx.rect(tx(s.x)-1,tz(s.z)-1,2,2)}ctx.fill();/* acampamentos: pontos, são milhares */
    for(const c of C.vec.cities){const X=tx(c.x),Z=tz(c.z),fall=cityFallen(c);
      if(c.capital){ctx.fillStyle=fall?'#ff4d6a':'#ffd070';ctx.strokeStyle='#2a1a0a';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?5:11;ctx.lineTo(X+Math.cos(a)*r,Z+Math.sin(a)*r)}ctx.closePath();ctx.fill();ctx.stroke();
        label(c.name.toUpperCase(),X,Z+20,'700 14px "Russo One",sans-serif','#ffe6a8')}
      else{ctx.fillStyle=fall?'rgba(255,45,85,.55)':'rgba(255,179,71,.65)';ctx.strokeStyle=fall?'#ff4d6a':'#3a2406';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(X,Z,4,0,7);ctx.fill();ctx.stroke();
        label(c.name,X,Z+11,'600 10px "Chakra Petch",sans-serif','#fff1d4')}}
    for(const g of gates){if(g.dead)continue;const col=g.secret?'#ffd070':g.red?'#ff2030':RANKS[g.rank].c;ctx.fillStyle='rgba(0,0,0,.6)';ctx.beginPath();ctx.arc(tx(g.x),tz(g.z),5,0,7);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=2;ctx.stroke()}
    for(const e of enemies)if(!e.dead&&(e.legend||e.world)){ctx.fillStyle=e.legend?'#ffd54f':'#ff5a1e';ctx.strokeStyle='#000';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(tx(e.x),tz(e.z),4,0,7);ctx.fill();ctx.stroke()}
    if(run.tmap){ctx.strokeStyle='#ffd54f';ctx.lineWidth=3;const X=tx(run.tmap.x),Z=tz(run.tmap.z);ctx.beginPath();ctx.moveTo(X-6,Z-6);ctx.lineTo(X+6,Z+6);ctx.moveTo(X+6,Z-6);ctx.lineTo(X-6,Z+6);ctx.stroke()}
    try{if(window.Civic343)Civic343.map(ctx,tx,tz,false)}catch(_){}
    try{if(window.Quests480)Quests480.drawMinimap(ctx,tx,tz,false)}catch(_){}
    try{const t=window.Campaign327&&Campaign327.target();if(t){ctx.fillStyle='#ffda68';ctx.strokeStyle='#3b2505';ctx.lineWidth=2;ctx.beginPath();ctx.arc(tx(t.x),tz(t.z),5,0,7);ctx.fill();ctx.stroke()}}catch(_){}
    /* jogador: seta + cone de visão */
    ctx.save();ctx.translate(tx(P.x),tz(P.z));ctx.rotate(-P.face+Math.PI);
    ctx.fillStyle='rgba(255,230,160,.28)';ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,38,-Math.PI/2-.55,-Math.PI/2+.55);ctx.closePath();ctx.fill();
    ctx.fillStyle='#fff3c4';ctx.strokeStyle='#2a1a0a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(6,6);ctx.lineTo(0,3);ctx.lineTo(-6,6);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    M.frame(ctx,S,true)}

  const d1=drawMap;
  drawMap=function(ctx,S,full){
    if(!full||L.mode!=='world'||L.special||!window.Mapa500||!window.TER245)return d1(ctx,S,full);
    try{ensure();place(ctx,S)}catch(e){console.warn('mapa501',e);return d1(ctx,S,full)}};
  window.Mapa501={C,HALF};
})();
