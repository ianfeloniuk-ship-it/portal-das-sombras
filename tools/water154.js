/* v154 plaza lake: animated water instead of a flat blue disc. Shared material, time driven by onBeforeRender. */
/* v628: estado compartilhado da água viva (chuva acumulada -> nível sobe e a água alaga os baixios). rain387.js atualiza. */
window.RAIN626=window.RAIN626||{wet:{value:0},pud:{value:0},k:0,wind:.25};
Object.assign(window.RAIN626,{rise:window.RAIN626.rise||{value:0},flood:window.RAIN626.flood||{value:0},acc:window.RAIN626.acc||0});
/* v706 (Ian: «água real, com física»): simulação de ondas de verdade (equação da onda) em 32 m ao redor do herói.
   O corpo empurra a água na frente e abre um vão atrás, a braçada bate, a chuva pinga e a onda rebate na margem.
   A textura leva a inclinação da superfície para rio, lago, mar e enchente; não soma brilho. */
window.Ripple=(()=>{const N=128,S=32,CELL=S/N,wall=new Uint8Array(N*N),px=new Uint8Array(N*N*4);let cur=new Float32Array(N*N),old=new Float32Array(N*N);
 for(let i=0;i<px.length;i+=4){px[i]=px[i+1]=px[i+2]=128;px[i+3]=255}
 const tex=new THREE.DataTexture(px,N,N,THREE.RGBAFormat);tex.minFilter=tex.magFilter=THREE.LinearFilter;tex.needsUpdate=true;
 const U={uRip:{value:tex},uRipC:{value:new THREE.Vector3(0,0,S)}};let cu=0,cv=0,en=0,acc=0,last=performance.now(),mx=1e9,mz=1e9,lx=0,lz=0,ph=0;
 function moved(A,du,dv){const t=new Float32Array(N*N);for(let v=0;v<N;v++)for(let u=0;u<N;u++){const q=u+du,w=v+dv;if(q>=0&&q<N&&w>=0&&w<N)t[v*N+u]=A[w*N+q]}return t}
 function poke(x,z,s,r){const ox=U.uRipC.value.x-S/2,oz=U.uRipC.value.y-S/2,R=Math.max(1,Math.round((r||.5)/CELL)),cx=Math.floor((x-ox)/CELL),cz=Math.floor((z-oz)/CELL);
  for(let v=-R;v<=R;v++)for(let u=-R;u<=R;u++){const q=cx+u,w=cz+v;if(q<1||w<1||q>=N-1||w>=N-1)continue;const d=(u*u+v*v)/(R*R);if(d<1)cur[w*N+q]+=s*(1+Math.cos(d*3.1416))*.5}en=1}
 function mask(top){/* onde o chão passa da água a onda rebate; malha de 2 m para não pesar */const ox=U.uRipC.value.x-S/2,oz=U.uRipC.value.y-S/2;for(let j=0;j<16;j++)for(let i=0;i<16;i++){let h=-1e9;try{h=terrH(ox+(i+.5)*2,oz+(j+.5)*2)}catch(_){}const w=h>top?1:0;for(let v=0;v<8;v++)for(let u=0;u<8;u++)wall[(j*8+v)*N+i*8+u]=w}}
 function step(){const c=.42,d=.986;for(let v=1;v<N-1;v++)for(let u=1;u<N-1;u++){const i=v*N+u;if(wall[i]){old[i]=0;continue}const n=cur[i-1]+cur[i+1]+cur[i-N]+cur[i+N]-4*cur[i];old[i]=(2*cur[i]-old[i]+c*n)*d}const t=cur;cur=old;old=t}
 function tick(){requestAnimationFrame(tick);const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;try{
  if(typeof started==='undefined'||!started||typeof player==='undefined'||!player||L.mode!=='world'||!window.Water391)return;
  const W=Water391.waterAt(player.x,player.z),wet=W&&!W.frozen,dep=wet?W.top-terrH(player.x,player.z):0;
  if(!wet&&en<.001)return;
  const nu=Math.round(player.x/CELL),nv=Math.round(player.z/CELL);if(nu!==cu||nv!==cv){const du=nu-cu,dv=nv-cv;if(Math.abs(du)>=N||Math.abs(dv)>=N){cur.fill(0);old.fill(0)}else{cur=moved(cur,du,dv);old=moved(old,du,dv)}cu=nu;cv=nv;U.uRipC.value.set(cu*CELL,cv*CELL,S);mx=1e9}
  if(wet&&Math.hypot(player.x-mx,player.z-mz)>4){mx=player.x;mz=player.z;mask(W.top+.15)}
  const vx=(player.x-lx)/Math.max(dt,.001),vz=(player.z-lz)/Math.max(dt,.001),sp=Math.hypot(vx,vz);
  if(dep>.12&&sp>.3&&sp<40){const k=Math.min(1,sp/6)*Math.min(1,dep/.6),f=.8;poke(player.x+vx/sp*f,player.z+vz/sp*f,.1*k,.55);poke(player.x-vx/sp*f,player.z-vz/sp*f,-.08*k,.65)}
  else if(dep>.3){ph+=dt;if(ph>1.4){ph=0;poke(player.x,player.z,.05,.8)}}
  lx=player.x;lz=player.z;
  if(window.RAIN626&&RAIN626.k>.05&&typeof WX!=='undefined'&&WX.type==='rain')for(let i=0,n=Math.ceil(RAIN626.k*4);i<n;i++)poke(player.x+(Math.random()-.5)*S*.9,player.z+(Math.random()-.5)*S*.9,.018+Math.random()*.03,.3);
  acc+=dt;let st=0;while(acc>1/60&&st<2){step();acc-=1/60;st++}if(st===2)acc=0;
  let e=0;for(let v=0;v<N;v++)for(let u=0;u<N;u++){const i=v*N+u,q=i*4,gx=u>0&&u<N-1?cur[i+1]-cur[i-1]:0,gz=v>0&&v<N-1?cur[i+N]-cur[i-N]:0;px[q]=Math.max(0,Math.min(255,128+gx*380));px[q+1]=Math.max(0,Math.min(255,128+gz*380));const h=Math.abs(cur[i]);if(h>e)e=h}
  en=e;tex.needsUpdate=true}catch(_){}}
 requestAnimationFrame(tick);return {U,poke}})();
window.RIP_GLSL=`uniform sampler2D uRip;uniform vec3 uRipC;vec2 ripG(vec2 p){vec2 q=(p-uRipC.xy)/uRipC.z;vec2 e=abs(q)*2.;float f=1.-smoothstep(.8,1.,max(e.x,e.y));if(f<=0.)return vec2(0.);return (texture2D(uRip,q+.5).xy-128./255.)*f;}`;
/* compatível com quem chama: batida na água */
window.Wake701={add(x,z,s){Ripple.poke(x,z,.14*(s||1),.5)}};
window.Water154=(()=>{
 const night=()=>window.NIGHT153U||(window.NIGHT153U={value:0});
 let shared=null;
 function material(){
  if(shared)return shared;
  const uniforms={uTime:{value:0},uNight:night(),uRise:RAIN626.rise,uFlood:RAIN626.flood,uRip:Ripple.U.uRip,uRipC:Ripple.U.uRipC};
  shared=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,
   vertexShader:`uniform float uRise,uFlood;varying vec2 vUv;varying vec3 vW;void main(){vUv=uv;vec3 pp=position;pp.xy+=(uv-.5)*2.*uFlood*5.;vec4 w=modelMatrix*vec4(pp,1.);w.y+=uRise;vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
   fragmentShader:`uniform float uTime,uNight,uFlood;varying vec2 vUv;varying vec3 vW;${RIP_GLSL}
    float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
    float waves(vec2 p,float t){return sin(p.x*2.1+t*1.1)*.5+sin(p.y*2.7-t*.9)*.4+sin((p.x+p.y)*3.9+t*1.7)*.25+n(p*3.+t*.4)*.6;}
    void main(){
     vec2 c=vUv-.5;float r=length(c)*2.;float t=uTime;vec2 p=vW.xz;
     float e=.03;float w0=waves(p,t);vec2 g=vec2(waves(p+vec2(e,0),t)-w0,waves(p+vec2(0,e),t)-w0)/e;
     g+=ripG(vW.xz)*38.;/* v706: ondas da simulação */
     vec3 nrm=normalize(vec3(-g.x*.18,1.,-g.y*.18));
     vec3 deep=vec3(.025,.075,.09),shallow=vec3(.12,.25,.24);/* v692: tons naturais (antes ciano de desenho) */
     vec3 col=mix(shallow,deep,smoothstep(.15,.85,1.-r)*.85);
     // Sky tint and moving caustic light near the shallow rim.
     col=mix(col,vec3(.55,.72,.82),pow(1.-nrm.y,.6)*.55);
     float caus=pow(n(p*4.+vec2(t*.5,-t*.35))*n(p*5.3-vec2(t*.4,t*.3)),1.5)*1.6;col+=vec3(.25,.45,.42)*caus*smoothstep(.35,1.,r);
     vec3 L=normalize(mix(vec3(-.4,.8,.45),vec3(.3,.9,-.3),uNight));vec3 V=vec3(0.,.85,.53);
     float spec=pow(max(0.,dot(reflect(-L,nrm),normalize(cameraPosition-vW))),220.)*2.6;/* v692: brilho do sol fino e na direção da câmera */col+=mix(vec3(1.,.93,.78),vec3(.65,.75,1.),uNight)*spec;
     // Foam ring that breathes against the stones.
     float foam=smoothstep(.86,.97,r+n(vec2(atan(c.y,c.x)*6.,t*.6))*.06+sin(t*1.3+atan(c.y,c.x)*5.)*.012);col=mix(col,vec3(.82,.9,.9),foam*.7);
     /* v628: reflexo do ceu (Fresnel), espuma de margem em linhas, turvacao de enchente, raso transparente */
     vec3 Vv=normalize(cameraPosition-vW);float fres=pow(1.-clamp(Vv.y,0.,1.),3.5);fres=.03+.97*pow(1.-clamp(dot(nrm,Vv),0.,1.),5.);col=mix(col,mix(vec3(.58,.68,.78),vec3(.08,.11,.2),uNight),clamp(fres,0.,.85));/* v692: reflexo do céu de Fresnel real (rasante reflete mais) */
     float shr=smoothstep(.8,1.,r);col=mix(col,vec3(.9,.95,.95),smoothstep(.45,.75,n(p*5.+vec2(t*.35,-t*.2)))*shr*.5);
     col=mix(col,vec3(.36,.29,.18)*mix(1.,.4,uNight),clamp(uFlood*.42,0.,.42));col+=vec3(.5,.45,.36)*smoothstep(.62,.8,n(p*vec2(1.6,.5)+vec2(0.,-t*1.3)))*uFlood*.22*mix(1.,.4,uNight);
     col*=mix(1.,.38,uNight);
     float a=mix(.9,.97,1.-r)*(1.-smoothstep(.985,1.,r));a*=mix(.55,1.,smoothstep(.02,.4,1.-r));
     gl_FragColor=vec4(col,a);
    }`});
  return shared;
 }
 function mesh(radius){
  const m=new THREE.Mesh(new THREE.CircleGeometry(radius,48),material());
  m.onBeforeRender=()=>{shared.uniforms.uTime.value=performance.now()/1000};
  return m;
 }
 return {material,mesh};
})();
