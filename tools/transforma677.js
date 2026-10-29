/* v677 (Ian: «quero ver a transformação», documento "Doença e Transformação" aprovado em 29/10/2026):
   a CENA e a FORMA das três doenças, jogáveis. Lobisomem e vampiro trocam o Viajante pelo modelo da criatura (o mesmo
   dos monstros, animado pelo banco de criatura em tools/criaturas673.js); a praga do draugr não muda o modelo: a pele
   fica cinza aos poucos e o frio sai da boca.
   Cena (doc, "A cena da transformação"): 0 s aviso (bordas vermelhas, coração) · 1 s a quebra (câmera gira, o corpo
   curva e cresce) · 2 s o pelo/a névoa (partículas, troca do modelo, roupa em pedaços) · 3 s o rugido (tela treme) ·
   4 s o controle volta. Voltar = o caminho inverso em 3 s.
   Ainda NÃO entra aqui (próximos passos do doc): contágio, estágios, fome, lua cheia forçada, Raiva, cura. */
(function(global){
'use strict';
const T=global.THREE;if(!T)return;
const FORM={
  lobisomem:{tint:'rgba(150,0,0,', dur:4, roar:'rugido', puff:0x2a2018, puff2:0x5a1010, spd:1.6, name:'LOBISOMEM', text:'A Maldição da Lua tomou o seu corpo.'},
  vampiro:{tint:'rgba(120,0,30,', dur:4, roar:'mordida', puff:0x7a0010, puff2:0x200008, spd:1.3, name:'VAMPIRO DESPERTO', text:'O Sangue Antigo despertou.'},
  draugr:{tint:'rgba(90,110,130,', dur:3, roar:'grito', puff:0xcfe4f0, puff2:0x8aa0b0, spd:.85, name:'PRAGA DO TÚMULO', text:'Sua pele esfria e fica cinza.'}
};
const API=global.Transforma677={FORM,cur:null,scene:null};
let vig=null;
function vignette(color,a){if(!vig){vig=document.createElement('div');vig.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:40;transition:none';document.body.appendChild(vig)}
  vig.style.background=a>0?`radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, ${color}${a.toFixed(3)}) 100%)`:'none'}
/* partículas: pelos/névoa que saem do corpo e caem */
function burst(x,y,z,c1,c2,n,up){const g=new T.BufferGeometry(),P=new Float32Array(n*3),V=new Float32Array(n*3),C=new Float32Array(n*3),a=new T.Color(c1),b=new T.Color(c2);
  for(let i=0;i<n;i++){const th=Math.random()*Math.PI*2,r=Math.random()*.5;P.set([x+Math.cos(th)*r,y+.2+Math.random()*1.8,z+Math.sin(th)*r],i*3);
    V.set([Math.cos(th)*(1+Math.random()*3),(up||1)*(Math.random()*3),Math.sin(th)*(1+Math.random()*3)],i*3);const c=Math.random()<.5?a:b;C.set([c.r,c.g,c.b],i*3)}
  g.setAttribute('position',new T.BufferAttribute(P,3));g.setAttribute('color',new T.BufferAttribute(C,3));
  const pts=new T.Points(g,new T.PointsMaterial({size:.09,vertexColors:true,transparent:true,opacity:1,depthWrite:false}));pts.userData.v=V;pts.userData.t=0;scene.add(pts);return pts}
function stepBurst(p,dt){if(!p)return false;p.userData.t+=dt;const P=p.geometry.attributes.position.array,V=p.userData.v;
  for(let i=0;i<P.length;i+=3){V[i+1]-=4*dt;P[i]+=V[i]*dt;P[i+1]=Math.max(.02,P[i+1]+V[i+1]*dt);P[i+2]+=V[i+2]*dt}
  p.geometry.attributes.position.needsUpdate=true;p.material.opacity=Math.max(0,1-p.userData.t/2.2);if(p.userData.t>2.3){scene.remove(p);p.geometry.dispose();p.material.dispose();return false}return true}
function swapModel(m){const P=player,old=P.m,par=old.root.parent;m.root.position.copy(old.root.position);m.root.rotation.copy(old.root.rotation);if(par){par.remove(old.root);par.add(m.root)}P.m=m}
function tintAll(m,k,col){m.root.traverse(o=>{if(!o.isMesh||!o.material)return;for(const mt of [].concat(o.material)){if(!mt.userData.c677&&mt.color)mt.userData.c677=mt.color.clone();if(mt.userData.c677)mt.color.copy(mt.userData.c677).lerp(col,k)}})}
/* começa a transformação na forma k; back=true faz o caminho de volta */
API.start=function(k,back){const F=FORM[k];if(!F||API.scene||!global.player||!player.m)return false;
  if(!back&&API.cur)return false;if(back&&API.cur!==k)return false;
  API.scene={k,back:!!back,t:0,F,done:{},parts:[]};try{if(typeof sfx==='function')sfx('hit')}catch(_){}return true};
API.end=function(){if(API.cur)API.start(API.cur,true)};
function tick(dt){const S=API.scene;if(!S)return;const P=player,F=S.F,t=(S.t+=dt),D=S.back?3:F.dur;
  S.parts=S.parts.filter(p=>stepBurst(p,dt));
  const pulse=.35+.25*Math.sin(t*9);vignette(F.tint,t<D?pulse*(S.back?.6:1):0);
  if(t<D-.6&&global.pcCam){pcCam.yaw+=dt*(S.back?.35:.6)}/* a câmera gira devagar em volta */
  if(!S.back){
    if(k('quebra',1)){S.parts.push(burst(P.x,terrH(P.x,P.z),P.z,F.puff,F.puff2,60,.3))}
    if(t>1&&t<2&&S.k!=='draugr'&&P.m&&P.m.model){const u=t-1;P.m.model.rotation.x=.35*u;P.m.model.scale.setScalar((P.m.s677||(P.m.s677=P.m.model.scale.x))*(1+.15*u))}
    if(S.k==='draugr')tintAll(P.m,Math.min(1,t/F.dur),new T.Color(0x5d6a78));
    if(S.k==='draugr'&&Math.random()<dt*20)S.parts.push(burst(P.x+Math.sin(P.face||0)*.25,terrH(P.x,P.z)+1.45,P.z+Math.cos(P.face||0)*.25,0xe8f4ff,0xb8ccd8,12,.15));/* o frio sai da boca */
    if(k('troca',2)){S.parts.push(burst(P.x,terrH(P.x,P.z),P.z,F.puff,F.puff2,420,1));
      if(S.k!=='draugr'&&global.Criaturas673&&Criaturas673.model){const old=P.m;old.model.rotation.x=0;if(old.s677)old.model.scale.setScalar(old.s677);
        const m=Criaturas673.model(S.k);API.viajante=old;swapModel(m);m.model.scale.multiplyScalar(.85);m.grow677=m.model.scale.x}
      try{if(typeof sfx==='function')sfx('boss')}catch(_){}}
    if(t>2&&t<3&&P.m&&P.m.grow677){P.m.model.scale.setScalar(P.m.grow677*(1+.176*(t-2)))}
    if(k('rugido',3)&&F.roar){P.m.forceClip677=F.roar;try{shakeA=Math.max(shakeA||0,.7)}catch(_){}}
  }else{
    if(k('volta',1)){S.parts.push(burst(P.x,terrH(P.x,P.z),P.z,F.puff,F.puff2,300,.8));
      if(API.viajante){swapModel(API.viajante);API.viajante=null}else if(S.k==='draugr')tintAll(P.m,0,new T.Color(0x5d6a78))}/* v678: a cena de cinema troca o modelo nas três formas */
  }
  if(t>=D){vignette(F.tint,0);if(P.m)P.m.forceClip677=null;
    if(!S.back){API.cur=S.k;API.spd0=P.spd;P.spd=P.spd*F.spd;try{toast('<b>['+F.name+']</b> '+F.text,4000)}catch(_){}}
    else{API.cur=null;if(API.spd0)P.spd=API.spd0;if(API.dist0){try{pcCam.distance=API.dist0}catch(_){}API.dist0=null}try{toast('Você voltou a ser você.',2500)}catch(_){}}
    API.scene=null}
  function k(name,at){if(S.done[name]||t<at)return false;return S.done[name]=true}
}
if(typeof update==='function'){const u0=update;update=function(dt){const r=u0.apply(this,arguments);try{tick(Math.min(.1,dt||.016))}catch(e){if(!API.err){API.err=String(e);console.warn('Transforma677',e)}}return r}}
})(typeof window!=='undefined'?window:globalThis);
