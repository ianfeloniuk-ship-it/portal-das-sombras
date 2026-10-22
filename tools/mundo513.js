/* v513 (Ian, 21/10/2026): mapa feito à mão, como Skyrim — nada de grade nem estrada reta.
   - As 19 vilas ficam em lugares escolhidos (costa, beira de rio, pé da serra, oásis), não no centro de cada quadrado.
   - Estradas sinuosas (curva suave entre pontos de controle) que contornam o relevo e passam pelas passagens das serras.
   - Serras (tools/terrain245.js: ridge513) dividem o mapa em regiões; cada uma tem uma passagem onde a estrada cruza.
   - A estrada de Aster para o sul sai reta do portão (z até 88) e depois serpenteia pelo desfiladeiro do marco zero (z de 88 a 520), na mesma curva da garganta de terrain245.js (gc510): mude os dois juntos. */
(function(){
  /* vilas: região → posição (x, z) */
  const TOWN={
    '-2,-2':[-3300,-3000],'-1,-2':[-1700,-3100],'1,-2':[1500,-3300],'2,-2':[3300,-2900],
    '-2,-1':[-3200,-1300],'-1,-1':[-1300,-1200],'0,-1':[250,-1500],'1,-1':[1350,-850],'2,-1':[3000,-1400],
    '-1,0':[-1500,300],'1,0':[1350,300],
    '-2,1':[-3400,1500],'-1,1':[-1700,1400],'0,1':[-200,1300],'2,1':[3300,1600],
    '-2,2':[-3250,3250],'-1,2':[-1500,3500],'1,2':[1500,3500],'2,2':[3500,3300]
  };
  const rc0=regionCity;
  regionCity=function(rx,rz){const c=rc0(rx,rz);if(c.v513)return c;c.v513=true;
    const p=TOWN[c.id];if(p){c.cx=Math.round(p[0]/CH);c.cz=Math.round(p[1]/CH);c.x=c.cx*CH;c.z=c.cz*CH}
    return c};
  try{cityCache.clear()}catch(_){}

  /* estradas: lista de pontos; texto = centro da cidade daquela região */
  const ROUTES=[
    ['0,0',[0,-260],[-130,-700],[150,-1150],'0,-1',[60,-1850],[0,-2150],[-150,-2600],[80,-3000],'0,-2'],
    ['0,0',[260,0],[600,-120],[950,120],'1,0',[1600,100],[1820,0],[2300,-150],[2800,120],'2,0'],
    ['0,0',[-260,0],[-700,150],'-1,0',[-1950,120],[-2400,0],[-3000,-150],'-2,0'],
    ['0,0',[0,88],[5,120],[42,160],[101,200],[136,240],[103,280],[62,320],[52,360],[67,400],[73,440],[55,480],[36,520],[150,700],'0,1',[-80,1700],[0,2050],[200,2500],[-100,2950],'0,2'],
    ['0,0',[190,190],[700,600],[1200,1100],[1650,1450],[2000,1900],'1,1'],
    [[150,-1150],[700,-1000],'1,-1'],
    [[-700,150],[-900,-400],'-1,-1'],
    ['0,-2',[-800,-3250],'-1,-2',[-2500,-3100],'-2,-2'],
    ['0,-2',[800,-3400],'1,-2',[2400,-3150],'2,-2'],
    ['2,0',[3300,-700],'2,-1'],
    ['2,0',[3250,800],'2,1',[3450,2500],'2,2'],
    ['-2,0',[-3600,-700],'-2,-1'],
    ['-2,0',[-3600,800],'-2,1',[-3350,2400],'-2,2'],
    ['0,2',[-700,3500],'-1,2',[-2300,3450],'-2,2'],
    ['0,2',[700,3450],'1,2',[1900,3000],'1,1'],
    ['0,1',[-900,1450],'-1,1']
  ];
  const STEP=40;let SEGS=null;
  function pt(q){if(typeof q==='string'){const [a,b]=q.split(',').map(Number),c=regionCity(a,b);return [c.x,c.z]}return q}
  function build(){
    const out=[];
    for(const r of ROUTES){const P=r.map(pt);
      for(let i=0;i<P.length-1;i++){
        const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(P.length-1,i+2)];
        const straight=p1[0]===0&&p2[0]===0&&p1[1]>=0&&p2[1]<=300; /* desfiladeiro do marco zero: reto */
        const n=Math.max(1,Math.ceil(Math.hypot(p2[0]-p1[0],p2[1]-p1[1])/STEP));let prev=p1;
        for(let k=1;k<=n;k++){const t=k/n;let x,z;
          if(straight){x=p1[0]+(p2[0]-p1[0])*t;z=p1[1]+(p2[1]-p1[1])*t}
          else{const t2=t*t,t3=t2*t,cr=(a,b,c,d)=>.5*(2*b+(-a+c)*t+(2*a-5*b+4*c-d)*t2+(-a+3*b-3*c+d)*t3);x=cr(p0[0],p1[0],p2[0],p3[0]);z=cr(p0[1],p1[1],p2[1],p3[1])}
          out.push([prev[0],prev[1],x,z]);prev=[x,z]}}}
    return out}
  function segs(){if(!SEGS){try{SEGS=build()}catch(e){console.warn('mundo513',e);return []}}return SEGS}
  const wi0=worldInit;worldInit=function(){const r=wi0.apply(this,arguments);SEGS=null;return r};

  roadSegs=function(x,z,n){const R=500+(n||1)*900;if(n>=3)return segs().slice();
    return segs().filter(s=>Math.abs((s[0]+s[2])/2-x)<R&&Math.abs((s[1]+s[3])/2-z)<R)};
  const sd=(x,z,ax,az,bx,bz)=>{const px=x-ax,pz=z-az,dx=bx-ax,dz=bz-az,l=dx*dx+dz*dz,h=l?Math.min(1,Math.max(0,(px*dx+pz*dz)/l)):0;return Math.hypot(px-dx*h,pz-dz*h)};
  onRoad=function(S,x,z,w=4.5){for(const s of S){if(Math.abs(x-s[0])>60+w&&Math.abs(x-s[2])>60+w)continue;if(sd(x,z,s[0],s[1],s[2],s[3])<w)return true}return false};

  /* v529: planta, flor e arbusto não nascem em parede/encosta íngreme */
  const PLANT=/plant|flower|bush|grass|mushroom|fern|shrub|flor|arbust|cogu|erva|frut/i;
  /* mede com o relevo ligado (o cenário às vezes é montado antes de ligar, e aí terrH dá 0) */
  const steep=(x,z,lim=.8)=>{try{if(!window.TER245)return false;const o=TER245.on.value;TER245.on.value=1;const s=Math.hypot(terrH(x+1.5,z)-terrH(x-1.5,z),terrH(x,z+1.5)-terrH(x,z-1.5))/3;TER245.on.value=o;return s>lim}catch(_){return false}};
  if(typeof EH==='function'){const eh0=EH;EH=function(b,key,x,y,z){if(PLANT.test(key||'')&&steep(x,z))return 0;return eh0.apply(this,arguments)}}
  if(typeof EW==='function'){const ew0=EW;EW=function(b,key,x,y,z){if(PLANT.test(key||'')&&steep(x,z))return 0;return ew0.apply(this,arguments)}}
  window.Mundo513={TOWN,ROUTES,segs,sd,steep};
})();
