/* v500 (Ian, 21/10/2026): MAPA FINITO de 10 km x 10 km (x e z de -5000 a +5000).
   - Só existem as regiões -2..2 (25 regiões de ~1,9 km). Cidades comuns ficam dentro de 3,7 km do centro.
   - Aster (0,0) no centro; as 5 Capitais em volta, com bioma próprio:
     Ymiria (norte, neve) · Zahar (leste, deserto) · Thalor (oeste, costa do mar) · Urdan (sul, pântano → vulcão) · Verden (sudeste, floresta).
   - Bordas (relevo em tools/terrain245.js): mar a oeste, leste e sul; cordilheira de gelo ao norte.
   - Ninguém passa de 4,92 km do centro em x ou z. */
(function(){
  const LIM=4920,KEEP=3700;
  const CAP={
    '0,-2':{name:'Ymiria',x:0,z:-3400,b:.18,b2:.40},
    '2,0':{name:'Zahar',x:3400,z:0,b:.84,b2:.40},
    '-2,0':{name:'Thalor',x:-3850,z:0,b:.50,b2:.50},
    '0,2':{name:'Urdan',x:0,z:3400,b:null,b2:.73},
    '1,1':{name:'Verden',x:2300,z:2300,b:.50,b2:.18}
  };
  const ASTER={x:0,z:0,b:.5,b2:.45}; /* Aster: campos temperados, sem bioma hostil no Nexo */
  const used=new Map();
  const inMap=(rx,rz)=>Math.abs(rx)<=2&&Math.abs(rz)<=2;
  const rc0=regionCity;
  regionCity=function(rx,rz){
    if(!inMap(rx,rz)){const k=rx+','+rz;let c=cityCache.get(k);if(c)return c;
      c={id:k,cx:rx*2000,cz:rz*2000,x:rx*128000,z:rz*128000,capital:false,name:'',out500:true};cityCache.set(k,c);return c}
    const c=rc0(rx,rz);if(c.v500)return c;c.v500=true;
    const q=CAP[c.id];
    if(q){c.cx=Math.round(q.x/CH);c.cz=Math.round(q.z/CH);c.capital=true;c.name=q.name}
    else if(c.id!=='0,0'){c.capital=false;c.cx=Math.max(-KEEP/CH,Math.min(KEEP/CH,c.cx))|0;c.cz=Math.max(-KEEP/CH,Math.min(KEEP/CH,c.cz))|0}
    if(!q&&c.id!=='0,0'){const o=used.get(c.name);if(o&&o!==c.id){let i=Math.abs(rx*7+rz*13);for(let t=0;t<CITY_NAMES.length;t++){const nm=CITY_NAMES[(i+t)%CITY_NAMES.length];if(!used.has(nm)){c.name=nm;break}}}}
    used.set(c.name,c.id);c.x=c.cx*CH;c.z=c.cz*CH;return c};
  const rs0=roadSegs;
  roadSegs=function(x,z,n){return rs0(x,z,n).filter(s=>Math.abs(s[0])<9000&&Math.abs(s[1])<9000&&Math.abs(s[2])<9000&&Math.abs(s[3])<9000)};
  /* nomes sem repetir, sempre na mesma ordem (norte→sul, oeste→leste) */
  function warm(){cityCache.clear();used.clear();for(let rz=-2;rz<=2;rz++)for(let rx=-2;rx<=2;rx++)regionCity(rx,rz)}
  const wi0=worldInit;worldInit=function(seed){const same=WSEED===(seed|0)&&WN;const r=wi0.apply(this,arguments);if(!same)warm();return r};
  try{if(WN)warm();else cityCache.clear()}catch(_){}

  /* biomas oficiais em volta das capitais (muda o chão, a vegetação e o efeito do bioma juntos) */
  const ss=(a,b,v)=>{const t=Math.min(1,Math.max(0,(v-a)/(b-a)));return t*t*(3-2*t)};
  const bs0=biomeSample317;
  biomeSample317=function(x,z){const r=bs0(x,z);let b=r.b,b2=r.b2;
    /* v534 (Ian): clima por região, como Skyrim — norte frio, sul quente, leste mais seco; sem neve no meio do mapa */
    {const cl=v=>Math.max(-1,Math.min(1,v));b=.5+(b-.5)*.45+(z<0?.28:.17)*cl(z/3400)+.12*Math.max(0,cl(x/3400));}
    for(const k in CAP){const q=CAP[k],w=1-ss(1000,1700,Math.hypot(x-q.x,z-q.z));if(w<=0)continue;
      const tb=q.b==null?.5+.34*ss(-250,250,z-q.z):q.b;b+=(tb-b)*w;b2+=(q.b2-b2)*w}
    {const w=1-ss(700,1300,Math.hypot(x,z));if(w>0){b+=(ASTER.b-b)*w;b2+=(ASTER.b2-b2)*w}}
    const wn=ss(-3500,-3950,z);if(wn>0){b+=(.16-b)*wn;b2+=(.4-b2)*wn}
    return {w:r.w,b,b2}};

  /* borda do mundo */
  let lastMsg=0;
  const me0=moveEnt;
  moveEnt=function(e,dx,dz){const r=me0.apply(this,arguments);
    try{if(L.mode==='world'&&e&&!(window.TER245&&TER245.OW.value.x>.5)){let hit=null;
      if(e.x>LIM){e.x=LIM;hit='e'}else if(e.x<-LIM){e.x=-LIM;hit='w'}
      if(e.z>LIM){e.z=LIM;hit='s'}else if(e.z<-LIM){e.z=-LIM;hit='n'}
      if(hit&&e===player&&performance.now()-lastMsg>12000){lastMsg=performance.now();
        toast(hit==='n'?'<b>[CORDILHEIRA DE GELO]</b> As montanhas de Ymiria fecham o norte. Nada passa daqui.':'<b>[MAR SEM FIM]</b> O mar além daqui não tem volta. O mundo conhecido acaba nesta água.',5000)}}}catch(_){}
    return r};

  window.Mapa500={LIM,CAP,inMap,capital:n=>{for(const k in CAP)if(CAP[k].name===n)return regionCity(...k.split(',').map(Number));return null}};
})();
