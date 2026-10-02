/* v156 (pedido do Ian): projéteis feitos no Tripo a partir das referências aprovadas
   (Entregas/Tripo-Referencias-Classes-2026-10-01/Projeteis) no lugar das bolhas de luz.
   Raio e terra foram refeitos no Tripo (02/10) e entraram na v159.
   Cada modelo é virado para que o comprimento fique no eixo +Z (direção do voo) e medido em metros. */
(function(global){
  'use strict';
  const T=global.THREE,API={ready:false,models:{}};
  // nome do arquivo → comprimento no jogo (m)
  const FILES={flecha:.95,fogo:.7,gelo:.9,artifice:1,condutor:1,devorador:.9,metamorfo:.9,raio:.95,terra:.8};
  // Tipo de projétil do jogo e classe dona → modelo.
  const BY_TYPE={arrow:'flecha',sarrow:'flecha',fire:'fogo',ice:'gelo'};
  const BY_CLASS={4:'flecha',8:'fogo',9:'gelo',10:'terra',11:'raio',15:'metamorfo',16:'artifice',18:'condutor',20:'devorador'};
  // Ajuste fino de quem tem a ponta para trás (giro em Y, radianos).
  const FLIP={};
  API.load=function(base){
    const L=new T.GLTFLoader();if(global.MeshoptDecoder)L.setMeshoptDecoder(global.MeshoptDecoder);
    return Promise.all(Object.entries(FILES).map(([n,len])=>new Promise(res=>L.load(base+n+'.glb',g=>{
      const o=g.scene;o.updateMatrixWorld(true);const b=new T.Box3().setFromObject(o),s=b.getSize(new T.Vector3()),c=b.getCenter(new T.Vector3());
      const holder=new T.Group(),inner=new T.Group();inner.add(o);
      // Direção real do corpo (eixo principal dos vértices), não a caixa: modelos do Tripo vêm na diagonal.
      const pts=[],v=new T.Vector3();o.traverse(m=>{if(m.isMesh){const p=m.geometry.attributes.position,st=Math.max(1,Math.floor(p.count/4000));for(let i=0;i<p.count;i+=st)pts.push(v.fromBufferAttribute(p,i).applyMatrix4(m.matrixWorld).clone())}});
      const mean=new T.Vector3();pts.forEach(p=>mean.add(p));mean.divideScalar(pts.length||1);
      let ax=new T.Vector3(1,1,1).normalize();for(let it=0;it<30;it++){const nx=new T.Vector3();for(const p of pts){const d=p.clone().sub(mean);nx.addScaledVector(d,d.dot(ax))}ax=nx.normalize()}
      let mn=Infinity,mx=-Infinity;for(const p of pts){const t=p.clone().sub(mean).dot(ax);mn=Math.min(mn,t);mx=Math.max(mx,t)}
      // A ponta é o lado mais fino: ela tem que apontar para a frente do voo (+Z).
      const band=(mx-mn)*.18;let wHi=0,nHi=0,wLo=0,nLo=0;for(const p of pts){const d=p.clone().sub(mean),t=d.dot(ax),r=d.clone().addScaledVector(ax,-t).length();if(t>mx-band){wHi+=r;nHi++}else if(t<mn+band){wLo+=r;nLo++}}
      if(nHi&&nLo&&wHi/nHi>wLo/nLo){ax.negate();[mn,mx]=[-mx,-mn]}
      o.position.sub(mean);inner.quaternion.setFromUnitVectors(ax,new T.Vector3(0,0,1));
      const fl=new T.Group();fl.add(inner);fl.rotation.y=FLIP[n]||0;fl.scale.setScalar(len/Math.max(mx-mn,.001));holder.add(fl);
      o.traverse(m=>{if(m.isMesh){m.castShadow=false;m.frustumCulled=false;const mt=m.material;if(mt&&mt.emissive){if(mt.map){mt.emissiveMap=mt.map;mt.emissive.setScalar(.55)}else mt.emissive.setScalar(.3);mt.needsUpdate=true}}});
      API.models[n]=holder;res()},undefined,()=>res())))).then(()=>{API.ready=true;return true});
  };
  API.pick=function(type,cls){return API.models[BY_CLASS[cls]]?BY_CLASS[cls]:API.models[BY_TYPE[type]]?BY_TYPE[type]:null};
  API.make=function(name,sc){const m=API.models[name];if(!m)return null;const g=new T.Group();g.add(m.clone(true));g.scale.setScalar(sc||1);g.userData.proj155=name;return g};

  // ---- Efeitos de energia (pedido do Ian): fogo = chama, condutor = eletricidade, devorador = vazio, gelo = névoa fria.
  let glowTex=null;function tex(){if(glowTex)return glowTex;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);glowTex=new T.CanvasTexture(c);return glowTex}
  function sprite(color,add=true,op=1){const m=new T.SpriteMaterial({map:tex(),color,transparent:true,opacity:op,depthWrite:false,blending:add?T.AdditiveBlending:T.NormalBlending});const s=new T.Sprite(m);return s}
  const rnd=(a,b)=>a+Math.random()*(b-a);
  function flame(g,len){const parts=[];for(let i=0;i<26;i++){const s=sprite(i%3?0xff7a1a:0xffd060);s.userData.ph=Math.random();g.add(s);parts.push(s)}const core=sprite(0xffe6a0);core.scale.setScalar(len*.9);g.add(core);
    return t=>{core.scale.setScalar(len*(.8+.15*Math.sin(t*31)));for(const s of parts){const u=(s.userData.ph+t*2.2)%1;s.position.set(rnd(-.04,.04)+Math.sin(t*20+u*9)*.06*u,rnd(-.04,.04)+u*.18,-u*len*1.6);const k=(1-u);s.scale.setScalar(len*(.25+.55*k));s.material.color.setHex(u<.3?0xffd060:u<.6?0xff7a1a:0xb3240c);s.material.opacity=k*.95}}}
  function lightning(g,len,col){const lines=[];for(let i=0;i<7;i++){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(new Float32Array(8*3),3));const l=new T.Line(geo,new T.LineBasicMaterial({color:i>1?col:0xdff4ff,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false}));g.add(l);lines.push(l)}
    const glow=sprite(col,true,.55);glow.scale.setScalar(len*1.1);g.add(glow);let last=-1;
    return t=>{if(t-last<.05)return;last=t;glow.material.opacity=.35+Math.random()*.4;for(const l of lines){const p=l.geometry.attributes.position;const a=rnd(0,6.28),r=len*.16;let z=len*.55;for(let k=0;k<8;k++){p.setXYZ(k,Math.cos(a+k*.7)*r*rnd(.3,1.2),Math.sin(a+k*.7)*r*rnd(.3,1.2),z);z-=len*rnd(.12,.22)}p.needsUpdate=true;l.visible=Math.random()>.15}}}
  function voidFx(g,len){const core=sprite(0x05000a,false,.95);core.scale.setScalar(len*.75);g.add(core);const rim=sprite(0x7a2cff,true,.7);rim.scale.setScalar(len*1.05);g.add(rim);const ps=[];for(let i=0;i<22;i++){const s=sprite(i%2?0xb070ff:0x6a1ad0,true);s.userData.ph=Math.random();g.add(s);ps.push(s)}
    return t=>{rim.material.opacity=.45+.25*Math.sin(t*9);for(const s of ps){const u=(s.userData.ph+t*.9)%1,r=len*(.55-.5*u),a=s.userData.ph*20+t*6+u*5;s.position.set(Math.cos(a)*r,Math.sin(a)*r,-u*len*.4);s.scale.setScalar(len*.26*(1-u*.4));s.material.opacity=.35+u*.65}}}
  function frost(g,len,col){const ps=[];for(let i=0;i<10;i++){const s=sprite(i%2?0xd8f6ff:col,true,.7);s.userData.ph=Math.random();g.add(s);ps.push(s)}
    return t=>{for(const s of ps){const u=(s.userData.ph+t*1.5)%1;s.position.set(rnd(-.05,.05),rnd(-.05,.05),-u*len*1.2);s.scale.setScalar(len*.3*(1-u));s.material.opacity=(1-u)*.6}}}
  const FX={fogo:(g,c)=>flame(g,.9),metamorfo:(g,c)=>flame(g,.5),condutor:(g,c)=>lightning(g,1.2,0x9fe0ff),artifice:(g,c)=>lightning(g,.9,0x5fd0ff),devorador:(g,c)=>voidFx(g,1.3),gelo:(g,c)=>frost(g,.8,0x9fe8ff),raio:(g,c)=>lightning(g,1.1,0xc8ecff),terra:(g,c)=>frost(g,.7,0x9a7b55)};
  API.addFx=function(g,name,col){const f=FX[name];if(!f)return;const holder=new T.Group();g.add(holder);const up=f(holder,col);const t0=performance.now();
    // Atualiza junto com o desenho do projétil (sem depender do laço do jogo).
    const hook=new T.Mesh(new T.BufferGeometry(),new T.MeshBasicMaterial({visible:false}));hook.frustumCulled=false;hook.onBeforeRender=()=>up((performance.now()-t0)/1000);holder.add(hook);up(0)};
  API.BY_CLASS=BY_CLASS;API.FLIP=FLIP;
  global.Proj155=API;
})(window);
