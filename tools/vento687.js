/* v687 (Ian, 29/10/2026: «falta vento, nuvens»): vento de verdade e céu com nuvens.
   - Vento: direção que gira devagar e rajadas (ENV.gust / ENV.wd). Grama (grass446), plantas e árvores (190/680)
     e o pano das roupas (pano672) leem os mesmos valores; na chuva (RAIN626.k) o vento fica mais forte.
   - Céu: cúpula com gradiente, brilho do sol, 3 camadas de nuvens (fbm) que andam com o vento, cobertura maior na
     chuva/neve; à noite estrelas e lua. A cor de base vem do ciclo de dia/noite (scene.background e névoa).
   - Folhas (campo, floresta, flores, pântano), poeira (deserto, estrada) e neve fina (neve) levadas pelo vento perto do jogador. */
(function(){
'use strict';
const T=window.THREE;if(!T||typeof scene==='undefined'||typeof ENV==='undefined')return;
const W=window.Vento687={on:true,str:1,gust:1,ang:0,off:new T.Vector2(),stats:{}};
let t=0,gT=0,gTarget=1;

/* ---------- céu ---------- */
const U={uTop:{value:new T.Color()},uHor:{value:new T.Color()},uSun:{value:new T.Vector3(-.43,.86,.32).normalize()},uNight:{value:0},uCov:{value:.45},
  uOff:{value:new T.Vector2()},uT:{value:0},uRain:{value:0}};
const sky=new T.Mesh(new T.SphereGeometry(900,48,24),new T.ShaderMaterial({uniforms:U,side:T.BackSide,depthWrite:false,depthTest:true,fog:false,
  vertexShader:'varying vec3 vD;void main(){vD=normalize(position);vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_Position=p.xyww;}',
  fragmentShader:`uniform vec3 uTop,uHor,uSun;uniform float uNight,uCov,uT,uRain;uniform vec2 uOff;varying vec3 vD;
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){s+=a*n2(p);p=m*p;a*=.5;}return s;}
void main(){vec3 d=normalize(vD);float y=d.y;
 float hz=pow(1.-max(y,0.),3.);vec3 col=mix(uTop,uHor,hz);
 if(y<0.)col=uHor;
 float sd=max(dot(d,uSun),0.),day=1.-uNight;
 col+=vec3(1.,.82,.55)*(pow(sd,8.)*.25+pow(sd,600.)*3.)*day*(1.-uRain*.8);
 vec3 mo=normalize(vec3(.55,.42,-.72));float md=dot(d,mo);
 if(uNight>.01&&y>0.){vec2 sp=d.xz/(y+.08)*90.;float st=step(.9965,h21(floor(sp)))*(.6+.4*sin(uT*3.+h21(floor(sp)+3.)*40.));
  col+=vec3(.85,.9,1.)*st*uNight*smoothstep(.02,.25,y);
  float disc=smoothstep(.9994,.9997,md);float crater=fbm(d.xy*260.)*.35;col=mix(col,vec3(.93,.94,.86)-crater,disc*uNight);
  col+=vec3(.55,.62,.8)*pow(max(md,0.),90.)*.35*uNight;}
 if(y>.005){vec2 P=d.xz/(y+.12);
  float acc=0.,lit=0.;
  for(int L=0;L<3;L++){float fl=float(L);vec2 q=P*(.55+fl*.42)+uOff*(1.+fl*.35)+fl*13.7;
   float c=fbm(q*1.3);float c2=fbm(q*1.3+uSun.xz*.08);
   float th=mix(.72,.38,uCov)-fl*.04;float a=smoothstep(th,th+.22,c)*(1.-acc)*(L==2?.55:1.);
   float shade=clamp((c-c2)*4.+.55,0.,1.);
   lit+=a*shade;acc+=a;}
  acc*=smoothstep(.0,.18,y);
  vec3 cDay=mix(vec3(.55,.58,.64),vec3(1.,.98,.94),lit/max(acc,.001));cDay=mix(cDay,vec3(.45,.47,.5),uRain*.7);
  vec3 cNight=mix(vec3(.05,.07,.12),vec3(.22,.26,.36),lit/max(acc,.001)*(.5+.5*pow(max(md,0.),6.)));
  vec3 cc=mix(cDay,cNight,uNight);cc+=vec3(1.,.75,.45)*pow(sd,6.)*.35*day*acc;
  col=mix(col,cc,clamp(acc,0.,1.));}
 col=mix(col,uHor,smoothstep(.12,0.,y)*.85);
 gl_FragColor=vec4(col,1.);
 #include <colorspace_fragment>
}`}));
sky.frustumCulled=false;sky.renderOrder=-50;sky.userData.terrainAbsolute245=true;sky.name='ceu687';
/* three r1xx antigo: sem colorspace chunk */
if(!T.ShaderChunk.colorspace_fragment)sky.material.fragmentShader=sky.material.fragmentShader.replace('#include <colorspace_fragment>','');
scene.add(sky);W.sky=sky;

/* ---------- folhas / poeira / neve no vento ---------- */
const N=260;
const pg=new T.PlaneGeometry(1,1);
const pm=new T.MeshLambertMaterial({vertexColors:false,side:T.DoubleSide,transparent:true,depthWrite:false});
pm.onBeforeCompile=sh=>{sh.fragmentShader=sh.fragmentShader.replace('#include <alphamap_fragment>','#include <alphamap_fragment>\n{vec2 q=vUv687*2.-1.;float r=vKind687<.5?length(q*vec2(1.,1.9))+.15*sin(q.x*9.):length(q);diffuseColor.a*=vKind687<.5?step(r,.95):smoothstep(1.,.1,r)*(vKind687<1.5?.5:.85);}')
  .replace('void main() {','varying vec2 vUv687;varying float vKind687;\nvoid main() {');
  sh.vertexShader=sh.vertexShader.replace('void main() {','attribute float kind687;varying vec2 vUv687;varying float vKind687;\nvoid main() {vUv687=uv;vKind687=kind687;')};
pm.customProgramCacheKey=()=>'p687';
const P=new T.InstancedMesh(pg,pm,N);P.frustumCulled=false;P.userData.terrainAbsolute245=true;P.name='vento687';
const kindA=new Float32Array(N);P.geometry.setAttribute('kind687',new T.InstancedBufferAttribute(kindA,1));
P.instanceColor=new T.InstancedBufferAttribute(new Float32Array(N*3),3);
/* culling637 calcula a esfera das instâncias uma vez; aqui ela acompanha o jogador */
const SPH=new T.Sphere(new T.Vector3(),70);P.userData.key637=N;P.userData.sph637b=SPH;
scene.add(P);W.parts=P;
const S=[];for(let i=0;i<N;i++)S.push({x:0,y:-999,z:0,vy:0,ph:Math.random()*6.28,sp:Math.random()*6.28,k:-1,life:0});
const M4=new T.Matrix4(),Q=new T.Quaternion(),E=new T.Euler(),V=new T.Vector3(),SC=new T.Vector3(),C=new T.Color();
const LEAF=[0x8a6a2a,0x6f7f2c,0xa0522d,0x5d6b2a,0xb08a3a],DUST=0xc8b089,SNOW=0xf2f6ff;
function kindFor(x,z){let b='campos';try{b=biomeAt(x,z)}catch(_){}
  let road=0;try{road=window.TER245&&TER245.path444?TER245.path444(x,z):0}catch(_){}
  if(b==='deserto'||road>.4)return 1;if(b==='neve'||b==='cristal')return 2;if(b==='vulcao')return 1;return 0}
function spawn(s,i,px,pz,wx,wz){const a=Math.random()*6.28,r=4+Math.random()*30;
  s.x=px-wx*18+Math.cos(a)*r;s.z=pz-wz*18+Math.sin(a)*r;let g=0;try{g=terrH(s.x,s.z)}catch(_){}
  if(window.Water391&&Water391.waterAt&&Water391.waterAt(s.x,s.z)){s.k=-1;s.y=-999;return}
  s.k=kindFor(s.x,s.z);s.g=g;s.y=g+(s.k===0?.6+Math.random()*5:.1+Math.random()*2.2);s.vy=0;s.life=4+Math.random()*6;
  kindA[i]=s.k;P.geometry.attributes.kind687.needsUpdate=true;C.setHex(s.k===0?LEAF[i%LEAF.length]:s.k===1?DUST:SNOW);P.setColorAt(i,C)}


/* ---------- neblina rasteira (Ian 29/10: «nuvens, neblina») ---------- */
const NF=36;
const fm=new T.MeshBasicMaterial({transparent:true,depthWrite:false,fog:false,color:0xffffff,opacity:.3});
fm.uniforms={uCol:{value:fm.color},uA:{value:.3},uT:{value:0}};
fm.onBeforeCompile=sh=>{sh.uniforms.uT687=fm.uniforms.uT;
  sh.vertexShader=sh.vertexShader.replace('void main() {','attribute float seed687;varying vec2 vU687;varying float vS687;\nvoid main() {vU687=uv;vS687=seed687;');
  sh.fragmentShader=sh.fragmentShader.replace('void main() {','uniform float uT687;varying vec2 vU687;varying float vS687;float h687(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}float n687(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h687(i),h687(i+vec2(1,0)),f.x),mix(h687(i+vec2(0,1)),h687(i+vec2(1,1)),f.x),f.y);}\nvoid main() {')
   .replace('#include <alphamap_fragment>','#include <alphamap_fragment>\n{vec2 q=vU687*2.-1.;float r=length(q*vec2(1.,1.6));float m=n687(vU687*3.+vS687*7.+uT687*.05)*.6+n687(vU687*7.-uT687*.08+vS687)*.4;diffuseColor.a*=smoothstep(1.,.2,r)*smoothstep(.15,.7,m);}')};
fm.customProgramCacheKey=()=>'fog687';
const F=new T.InstancedMesh(new T.PlaneGeometry(1,1),fm,NF);F.frustumCulled=false;F.userData.terrainAbsolute245=true;F.name='neblina687';F.renderOrder=5;
const fseed=new Float32Array(NF);for(let i=0;i<NF;i++)fseed[i]=Math.random();F.geometry.setAttribute('seed687',new T.InstancedBufferAttribute(fseed,1));
const FS=new T.Sphere(new T.Vector3(),200);F.userData.key637=NF;F.userData.sph637b=FS;scene.add(F);W.fog=F;
const FB=[];for(let i=0;i<NF;i++)FB.push({x:0,z:0,y:-999,w:0,life:0});
function fogTick(dt,px,pz,wx,wz,g,n,w){
  const p=typeof dayT!=='undefined'&&typeof DAYLEN!=='undefined'?(dayT%DAYLEN)/DAYLEN:.3;
  const dawn=Math.max(0,1-Math.abs(p-.08)/.08);/* manhã cedo */
  let b='campos';try{b=biomeAt(px,pz)}catch(_){}
  const bio=b==='pantano'?1:b==='floresta'?.75:b==='deserto'||b==='vulcao'?0:.55;
  const dens=Math.min(1,bio*(.45+n*.5+dawn*.8)+w*.5);fm.uniforms.uA.value=.6*dens;fm.opacity=fm.uniforms.uA.value;fm.uniforms.uT.value=t;
  if(scene.fog)fm.uniforms.uCol.value.copy(scene.fog.color).lerp(new T.Color(0xffffff),.25*(1-n));
  FS.center.set(px,(player.y||0),pz);F.userData.key637=NF;F.userData.sph637b=FS;F.visible=dens>.02;
  for(let i=0;i<NF;i++){const f=FB[i];f.life-=dt;
    if(f.life<=0||Math.hypot(f.x-px,f.z-pz)>130){const a=Math.random()*6.28,r=12+Math.random()*90;f.x=px+Math.cos(a)*r;f.z=pz+Math.sin(a)*r;
      let best=1e9,bx=f.x,bz=f.z;for(let k=0;k<4;k++){const x=f.x+(Math.random()-.5)*40,z=f.z+(Math.random()-.5)*40;let hh=0;try{hh=terrH(x,z)}catch(_){}if(hh<best){best=hh;bx=x;bz=z}}/* procura o baixio */
      f.x=bx;f.z=bz;f.y=best+1.5+Math.random()*2;f.w=22+Math.random()*26;f.life=25+Math.random()*30}
    f.x+=wx*dt*.8*g;f.z+=wz*dt*.8*g;const fade=Math.min(1,f.life/4);
    M4.compose(V.set(f.x,f.y,f.z),camera.quaternion,SC.set(f.w*fade,f.w*.32*fade,1));F.setMatrixAt(i,M4)}
  F.instanceMatrix.needsUpdate=true}

function inWorld(){try{return L&&L.mode==='world'}catch(_){return false}}
function tick(dt){if(!W.on)return;t+=dt;
  /* vento: direção vagueia, rajadas a cada poucos segundos, chuva fortalece */
  const rk=window.RAIN626?RAIN626.k||0:0;W.ang=Math.sin(t*.011)*.9+Math.sin(t*.037)*.3;
  gT-=dt;if(gT<=0){gT=3+Math.random()*7;gTarget=Math.min(2,.7+Math.random()*1.1+rk*.8)}
  W.gust+=(gTarget-W.gust)*Math.min(1,dt*.8);if(gT<1.2)gTarget+=(1-gTarget)*Math.min(1,dt*.9);
  const g=W.gust*W.str;ENV.gust.value=g;const wx=Math.cos(W.ang),wz=Math.sin(W.ang);ENV.wd.value.set(wx,wz);
  W.off.x+=wx*dt*.006*(.6+g*.6);W.off.y+=wz*dt*.006*(.6+g*.6);
  const on=inWorld();sky.visible=on;P.visible=on;F.visible=on;if(!on)return;
  /* céu */
  try{sky.position.copy(camera.position)}catch(_){}
  const n=window.NIGHT153U?NIGHT153U.value:0,w=(L.dn&&L.dn.w)||0;
  U.uNight.value=n;U.uRain.value=Math.min(1,w*1.2);U.uCov.value=Math.min(1,.42+w*.75);U.uOff.value.copy(W.off);U.uT.value=t;
  if(scene.background&&scene.background.isColor)U.uTop.value.copy(scene.background).multiplyScalar(.82);
  if(scene.fog)U.uHor.value.copy(scene.fog.color);
  try{U.uSun.value.copy(sun.position).sub(sun.target.position).normalize()}catch(_){}
  /* partículas */
  let px=0,pz=0;try{px=player.x;pz=player.z}catch(_){return}
  SPH.center.set(px,(player.y||0)+3,pz);P.userData.key637=N;P.userData.sph637b=SPH;
  const speed=2.2+g*3.2;let live=0;
  for(let i=0;i<N;i++){const s=S[i];s.life-=dt;
    if(s.life<=0||Math.hypot(s.x-px,s.z-pz)>48){spawn(s,i,px,pz,wx,wz)}
    if(s.k<0){M4.makeScale(0,0,0);P.setMatrixAt(i,M4);continue}live++;
    const sp=speed*(s.k===0?1:s.k===1?1.25:.9),fl=Math.sin(t*2.3+s.ph);
    s.x+=(wx*sp+fl*.4*-wz)*dt;s.z+=(wz*sp+fl*.4*wx)*dt;
    if(s.k===0){s.vy+=(-.55+Math.sin(t*1.7+s.ph)*.9+(g-1)*.8)*dt;s.vy*=.96;s.y+=s.vy*dt;if(s.y<s.g+.05){s.y=s.g+.05;s.vy=Math.abs(s.vy)*.3}}
    else{s.y+=Math.sin(t*1.1+s.ph)*.3*dt}
    const fade=Math.min(1,s.life*.8);
    const sz=s.k===0?.26:s.k===1?(1.6+fl*.3)*(.5+.5*g):.45;
    if(s.k===0){E.set(t*3+s.sp,t*2.2+s.ph,t*1.3);Q.setFromEuler(E)}else{Q.copy(camera.quaternion)}
    SC.set(sz*fade,sz*(s.k===0?.6:1)*fade,1);M4.compose(V.set(s.x,s.y,s.z),Q,SC);P.setMatrixAt(i,M4)}
  try{fogTick(dt,px,pz,wx,wz,g,n,w)}catch(e){if(!W.ferr)W.ferr=String(e)}
  P.instanceMatrix.needsUpdate=true;if(P.instanceColor)P.instanceColor.needsUpdate=true;
  W.stats.live=live}
W.tick=tick;W.S=S;W.FB=FB;
let last=performance.now();
(function loop(now){requestAnimationFrame(loop);now=now||performance.now();const dt=Math.min(.1,(now-last)/1000);last=now;try{tick(dt)}catch(e){if(!W.err){W.err=String(e);console.warn('vento687',e)}}})(last);
})();
