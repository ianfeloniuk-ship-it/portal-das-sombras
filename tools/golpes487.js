function golpesCombatTime487(){return time;}
/* Preview batch 1: approved 20/10/2026 demo engine. Visuals only.
   Legacy VFX collision geometry remains on layer 31 to preserve Zone475 behavior.
   20/10/2026: Ian authorized hit timings to follow the approved video. Damage budget, range and cooldown unchanged. */
(function(){'use strict';
if(typeof THREE==='undefined'||typeof scene==='undefined')return;
const T=THREE,lite=()=>GFX267.lite;
const API=window.Golpes487={on:true,bloomOn:true,optimizeBloomDepth:true,bloomScale:.75,legacyDepth:0,stats:{basics:0,skills:0,hits:0,peak:0},errors:[]};
const supported=new Set(['0:0','1:3','2:0']);
API.providers=[];API.provider=sk=>API.providers.find(p=>p.handles(sk));
API.handles=sk=>!!(API.on&&sk&&((sk.t==='kit111'&&supported.has(sk.skillId))||!!API.provider(sk)));
API.basic=ci=>API.on&&([0,1,2].includes(ci)||API.providers.some(p=>p.basic(ci)));
API.projectile=p=>API.on&&!!p?.fx487;
API.legacy=function(fn,sk=activeSkill){const prev=API.legacySkill;API.legacySkill=sk;API.legacyDepth++;try{return fn()}finally{API.legacyDepth--;API.legacySkill=prev}};
API.bindLegacy=fn=>{if(!API.legacyDepth)return fn;const sk=API.legacySkill;return function(){const a=arguments,t=this;return API.legacy(()=>fn.apply(t,a),sk)}};
const legacyRoots504=new Set();
function pruneLegacy504(mask=false){for(const o of legacyRoots504){if(!o.parent||(o.layers.mask>>>0)!==0x80000000){legacyRoots504.delete(o);continue}if(mask)o.traverse(c=>c.layers.set(31))}}
API.legacyCount504=()=>legacyRoots504.size;
const sceneAdd=scene.add;
scene.add=function(...objs){if(API.legacyDepth)for(const o of objs){if(o.userData.terrainRoot245){o.traverse(c=>c.layers.set(0));continue}legacyRoots504.add(o);o.userData.gate487=API.castState?API.castState(API.legacySkill):null;o.traverse(c=>c.layers.set(31));}else if(currentCtx){for(const o of objs)addFX(o);return this}return sceneAdd.apply(this,objs)};
function addFX(o){o.userData.ctx487=currentCtx;o.traverse(c=>{if(c.material)for(const m of [].concat(c.material)){m.toneMapped=false;m.fog=false}});o.userData.terrainAbsolute245=true;o.userData.golpes487=true;sceneAdd.call(scene,o)}
const ground=(x,z)=>typeof terrH==='function'?terrH(x,z):0;
const pos=(x,z,y=0)=>new T.Vector3(x,ground(x,z)+y,z);
const rng=seed=>{let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
let rand=rng(487),currentCtx=null,hero=null,F=null,S={},foes=[];
function inContext(c,fn){const prev=[currentCtx,hero,F,S,foes];if(c){currentCtx=c;hero=c.hero;F=c.foe;S=c.S;foes=c.foes||[F]}try{return fn()}finally{[currentCtx,hero,F,S,foes]=prev}}
function radialTex(stops,size=256){const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');const g=x.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);for(const [o,col] of stops)g.addColorStop(o,col);x.fillStyle=g;x.fillRect(0,0,size,size);return new T.CanvasTexture(c)}
const glowTex=radialTex([[0,'rgba(255,255,255,1)'],[.18,'rgba(255,255,255,.9)'],[.45,'rgba(255,255,255,.3)'],[1,'rgba(255,255,255,0)']]);
const softTex=radialTex([[0,'rgba(255,255,255,.55)'],[.6,'rgba(255,255,255,.15)'],[1,'rgba(255,255,255,0)']]);
const ringTex=(()=>{const s=256,c=document.createElement('canvas');c.width=c.height=s;const x=c.getContext('2d');x.strokeStyle='rgba(255,255,255,1)';x.shadowColor='rgba(255,255,255,1)';x.shadowBlur=18;x.lineWidth=10;x.beginPath();x.arc(s/2,s/2,s*.36,0,6.283);x.stroke();x.lineWidth=4;x.beginPath();x.arc(s/2,s/2,s*.36,0,6.283);x.stroke();return new T.CanvasTexture(c)})();
const starTex=(()=>{const s=128,c=document.createElement('canvas');c.width=c.height=s;const x=c.getContext('2d');const g=x.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,s,s);x.fillStyle='#fff';x.beginPath();x.moveTo(s/2,2);x.lineTo(s/2+5,s/2-5);x.lineTo(s-2,s/2);x.lineTo(s/2+5,s/2+5);x.lineTo(s/2,s-2);x.lineTo(s/2-5,s/2+5);x.lineTo(2,s/2);x.lineTo(s/2-5,s/2-5);x.closePath();x.fill();return new T.CanvasTexture(c)})();
function crackTex(seed){const r=rng(seed),s=512,c=document.createElement('canvas');c.width=c.height=s;const x=c.getContext('2d');x.lineCap='round';
 const branch=(rr,x0,y0,a,len,w,depth)=>{let px=x0,py=y0;x.beginPath();x.moveTo(px,py);for(let i=0;i<6;i++){a+=(rr()-.5)*.7;px+=Math.cos(a)*len/6;py+=Math.sin(a)*len/6;x.lineTo(px,py);if(depth<2&&rr()<.35)branch(rr,px,py,a+(rr()<.5?-1:1)*(.5+rr()*.6),len*.45,w*.6,depth+1)}x.lineWidth=w;x.stroke()};
 for(const [blur,col,w] of [[18,'rgba(255,255,255,.5)',6],[5,'rgba(255,255,255,.9)',3],[1.5,'rgba(255,255,255,1)',1.2]]){x.strokeStyle=col;x.shadowColor='#fff';x.shadowBlur=blur;const rr=rng(seed);for(let i=0;i<13;i++){const a=i/13*6.283+rr()*.4;branch(rr,s/2+Math.cos(a)*18,s/2+Math.sin(a)*18,a,150+rr()*90,w,0)}}
 return new T.CanvasTexture(c)}
const CRACK=[crackTex(3),crackTex(11)];
function runeTex(seed){const r=rng(seed),s=512,c=document.createElement('canvas');c.width=c.height=s;const x=c.getContext('2d');x.strokeStyle='#fff';x.shadowColor='#fff';x.shadowBlur=10;x.lineCap='round';
 const C=s/2;x.lineWidth=5;x.beginPath();x.arc(C,C,C*.92,0,6.283);x.stroke();x.lineWidth=2.5;x.beginPath();x.arc(C,C,C*.78,0,6.283);x.stroke();x.beginPath();x.arc(C,C,C*.42,0,6.283);x.stroke();
 for(let k=0;k<2;k++){x.beginPath();for(let i=0;i<=6;i++){const a=i/6*6.283+k*Math.PI/6;const px=C+Math.cos(a)*C*.78,py=C+Math.sin(a)*C*.78;i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke()}
 for(let i=0;i<18;i++){const a=i/18*6.283;x.save();x.translate(C+Math.cos(a)*C*.85,C+Math.sin(a)*C*.85);x.rotate(a+Math.PI/2);x.beginPath();const n=2+Math.floor(r()*3);for(let j=0;j<n;j++){x.moveTo((r()-.5)*16,(r()-.5)*14);x.lineTo((r()-.5)*16,(r()-.5)*14)}x.stroke();x.restore()}
 return new T.CanvasTexture(c)}
const RUNE=runeTex(5);

/* ---- materiais ---- */
const V3=a=>new T.Vector3(a[0],a[1],a[2]);
const PAL={ice:{d:[.04,.24,.85],m:[.36,.8,1],e:[1,1,1],v:[.36,.8,1]},stone:{d:[.07,.055,.05],m:[.26,.22,.19],e:[.7,.45,.22],v:[1,.45,.08]},
 gold:{d:[.5,.28,.03],m:[1,.78,.3],e:[1,1,.85],v:[1,.9,.5]},violet:{d:[.2,.03,.42],m:[.68,.38,1],e:[1,.9,1],v:[.9,.6,1]},
 steel:{d:[.07,.15,.34],m:[.5,.7,.95],e:[.9,.97,1],v:[.6,.85,1]},green:{d:[.02,.3,.12],m:[.4,1,.55],e:[.9,1,.9],v:[.6,1,.7]},
 red:{d:[.3,0,.02],m:[1,.18,.1],e:[1,.8,.65],v:[1,.4,.2]},magma:{d:[.15,.03,0],m:[.5,.12,.02],e:[1,.65,.15],v:[1,.45,.05]},
 turq:{d:[0,.25,.35],m:[.3,1,.9],e:[.9,1,1],v:[.5,1,.95]},arcane:{d:[.1,.08,.5],m:[.5,.7,1],e:[1,.95,1],v:[.75,.6,1]},magenta:{d:[.32,.02,.38],m:[1,.45,.9],e:[1,.9,1],v:[1,.6,.95]}};
const shardVS=`varying vec3 vN;varying vec3 vW;varying float vH;void main(){vH=position.y;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`;
const shardFS=`uniform float uTime,uMelt,uFlash,uFade,uSeed;uniform vec3 uD,uM,uE,uV;varying vec3 vN;varying vec3 vW;varying float vH;
void main(){float cut=1.-uMelt;if(vH>cut)discard;vec3 N=normalize(gl_FrontFacing?vN:-vN);vec3 V=normalize(cameraPosition-vW);
 float fr=pow(1.-abs(dot(N,V)),2.2);float facet=.5+.5*dot(N,normalize(vec3(-.35,.85,.4)));
 vec3 c=mix(uD,uM,smoothstep(.25,1.,facet));c=mix(c,uE,smoothstep(.25,1.,fr)*.9);c+=uE*smoothstep(.62,1.,vH)*.5;
 float s=sin((vW.x-vW.z)*13.+vH*18.+uSeed*6.+uTime*5.);c+=uV*smoothstep(.93,1.,s)*.6;
 float tw=fract(sin(dot(floor(vW*9.),vec3(12.9,78.2,37.7))+uSeed)*43758.5);c+=uE*step(.985,tw)*(.5+.5*sin(uTime*14.+tw*30.));
 float edge=step(.001,uMelt)*smoothstep(.12,0.,cut-vH);c+=uV*edge*1.6;c*=1.+uFlash*1.6;gl_FragColor=vec4(c,.93*uFade);}`;
function crystalMat(pal){const p=PAL[pal];return new T.ShaderMaterial({vertexShader:shardVS,fragmentShader:shardFS,transparent:true,side:T.DoubleSide,
 uniforms:{uTime:{value:0},uMelt:{value:0},uFlash:{value:0},uFade:{value:1},uSeed:{value:rand()*10},uD:{value:V3(p.d)},uM:{value:V3(p.m)},uE:{value:V3(p.e)},uV:{value:V3(p.v)}}})}
const NOISE=`float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){return .55*vn(p)+.3*vn(p*2.1+3.)+.15*vn(p*4.3+7.);}`;
/* energia: fitas de corte, rastros, raios. x = ao longo (0..1), y = através (0..1) */
const ribVS=`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const ribFS=NOISE+`uniform float uTime,uProg,uTail,uFade,uMode,uCenter,uNoise,uNs,uSpd,uDis,uGain;uniform vec3 uA,uB,uC;varying vec2 vUv;
void main(){float x=vUv.x,y=vUv.y,al;
 if(uMode<.5){float h=uProg*(1.+uTail);al=smoothstep(h-uTail,h-uTail*.35,x)*(1.-smoothstep(h-.025,h,x));al*=pow(max(0.,sin(3.1416*x)),.35);}
 else if(uMode<1.5){al=pow(1.-x,1.4)*smoothstep(0.,.04,x+.02);}else{al=1.;}
 float body,core;
 if(uCenter>.5){float d=abs(y-.5)*2.;body=1.-smoothstep(.55,1.,d);core=pow(1.-d,5.);}
 else{body=smoothstep(0.,.75,y)*(1.-smoothstep(.96,1.,y));core=smoothstep(.86,.97,y)*(1.-smoothstep(.975,1.,y))*1.2;}
 float n=fbm(vec2(x*uNs-uTime*uSpd,y*2.5+uTime*.7));
 float a=al*body*mix(1.,.35+1.1*n,uNoise);
 a*=smoothstep(uDis,uDis+.15,n+(1.-uFade)*.0);
 vec3 c=uCenter>.5?mix(uC,uB,smoothstep(.1,.9,body*n+.2))+uA*core*1.4:mix(uC,uB,smoothstep(.15,.7,y)*(.75+.5*n))+uA*core;
 gl_FragColor=vec4(c*uGain,clamp(a*uFade,0.,1.));}`;
function ribMat(col,o={}){return new T.ShaderMaterial({vertexShader:ribVS,fragmentShader:ribFS,transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,
 uniforms:{uTime:{value:0},uProg:{value:0},uTail:{value:o.tail??.75},uFade:{value:1},uMode:{value:o.mode??0},uCenter:{value:o.center??0},uNoise:{value:o.noise??.7},uNs:{value:o.ns??7},uSpd:{value:o.spd??5},uDis:{value:o.dis??0},uGain:{value:(o.gain??1.25)*(currentCtx?.energyGain500??1)},
  uA:{value:new T.Color(col[0])},uB:{value:new T.Color(col[1])},uC:{value:new T.Color(col[2])}}})}
/* orbe/bola: quadrado sempre virado para a câmera */
const orbFS=NOISE+`uniform float uTime,uFade,uNoise,uFire;uniform vec3 uA,uB,uC;varying vec2 vUv;
void main(){vec2 p=vUv*2.-1.;float r=length(p),ang=atan(p.y,p.x);
 float n=fbm(vec2(ang*2.+uTime*2.,r*3.-uTime*4.));float nf=fbm(p*3.+vec2(0.,-uTime*5.));
 float rr=r+(n-.5)*.45*uNoise+(nf-.5)*.5*uFire*smoothstep(-.3,.6,-p.y+.2);
 float a=1.-smoothstep(.35,1.,rr);float core=1.-smoothstep(0.,.42,r);
 vec3 c=mix(uC,uB,1.-smoothstep(.2,.9,rr))+uA*core*1.6;gl_FragColor=vec4(c*1.2,a*uFade);}`;
function orbMat(col,o={}){return new T.ShaderMaterial({vertexShader:ribVS,fragmentShader:orbFS,transparent:true,depthWrite:false,blending:T.AdditiveBlending,
 uniforms:{uTime:{value:0},uFade:{value:1},uNoise:{value:o.noise??1},uFire:{value:o.fire??0},uA:{value:new T.Color(col[0])},uB:{value:new T.Color(col[1])},uC:{value:new T.Color(col[2])}}})}
const hexFS=`uniform float uTime,uFade;uniform vec3 uA,uB;varying vec2 vUv;
void main(){vec2 p=abs(vUv*2.-1.);float d=max(p.x*.866+p.y*.5,p.y);float border=smoothstep(.78,.93,d)*(1.-smoothstep(.97,1.,d));
 float scan=.5+.5*sin(vUv.y*40.-uTime*9.);vec3 c=uB*(.18+.12*scan)+uA*border*1.5;gl_FragColor=vec4(c,(.35+border)*uFade*(1.-step(1.,d)));}`;

/* ---- vida dos objetos ---- */
const activeEntries=new Set();
let live=[],time=0,seqT=0,shakeT=0,flashV=0,bloomKick=0,speed=1;
function spawn(obj,update,options={}){const cap=lite()?500:900;if(live.length>=cap){kill(obj);return obj}const entry={obj,update,t:0,ctx:currentCtx,maxAge:options.maxAge??8};live.push(entry);activeEntries.add(entry);API.stats.peak=Math.max(API.stats.peak,live.length);return obj}
function at(delay,fn){if(currentCtx?.recipeChain&&((currentCtx.chainCount<2&&Math.abs(delay-.46)<1e-7)||(currentCtx.chainCount<3&&Math.abs(delay-.6)<1e-7)))return;spawn(null,(o,dt,t)=>{if(t>=delay){fn();return false}return true})}
function kill(o){if(!o||o.userData.dead487)return;if(o.userData.pool487){o.userData.pool487.entries.delete(o);o.material.dispose();if(o.parent)o.parent.remove(o);o.userData.dead487=true;return;}o.userData.dead487=true;if(o.parent)o.parent.remove(o);const mats=new Set(),geos=new Set();o.traverse(m=>{if(m.material)[].concat(m.material).forEach(a=>mats.add(a));if(m.geometry&&!GEOS.includes(m.geometry)&&m.geometry!==BLADE)geos.add(m.geometry)});mats.forEach(m=>{if(!m.userData.warm487)m.dispose()});geos.forEach(g=>g.dispose())}
function sprite(tex,pos,size,o={}){const m=new T.SpriteMaterial({map:tex,color:o.color??0xffffff,transparent:true,depthWrite:false,blending:o.normal?T.NormalBlending:T.AdditiveBlending,opacity:o.op??1});const s=new T.Sprite(m);s.position.copy(pos);s.scale.setScalar(size);if(tex===starTex||tex===glowTex){const pool=getSpritePool(tex);pool.entries.add(s);s.userData.pool487=pool;s.userData.ctx487=currentCtx;pool.holder.add(s)}else addFX(s);return s}
const easeOutBack=x=>{const c1=2.2,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
const UP=new T.Vector3(0,1,0);
function fade(o,life,grow=0,base){const b=base??o.scale.x;spawn(o,(ob,dt,t)=>{const k=t/life;ob.scale.setScalar(b*(1+grow*k));ob.material.opacity=Math.max(0,1-k);if(k>=1){kill(ob);return false}return true})}

/* ---- peças da técnica ---- */
function flash(v=1,kick=.8,shake=.25){flashV=Math.max(flashV,v);bloomKick=Math.max(bloomKick,kick);shakeT=Math.max(shakeT,shake)}
function sparks(pos,n,color,spd=4,grav=6,size=.16,life=.45){n=Math.ceil(n*(lite()?.5:1));for(let i=0;i<n;i++){const s=sprite(starTex,pos,size*(.6+rand()*.8),{color}),v=new T.Vector3(rand()-.5,rand()*.9-.1,rand()-.5).normalize().multiplyScalar(spd*(.4+rand()*.8));
 spawn(s,(o,dt,t)=>{v.y-=grav*dt;o.position.addScaledVector(v,dt);v.multiplyScalar(1-2.5*dt);o.material.opacity=Math.max(0,1-t/life);if(t>life){kill(o);return false}return true})}}
function embers(pos,n,color,spread=1,life=1.2){for(let i=0;i<n;i++){const p=pos.clone().add(new T.Vector3((rand()-.5)*spread,rand()*.4,(rand()-.5)*spread)),s=sprite(glowTex,p,.08+rand()*.08,{color,op:0}),d=rand()*.3,v=new T.Vector3((rand()-.5)*.6,.6+rand()*1.2,(rand()-.5)*.6);
 spawn(s,(o,dt,t)=>{const k=(t-d)/life;if(k<0)return true;o.position.addScaledVector(v,dt);o.material.opacity=Math.sin(Math.min(1,k)*Math.PI)*(.7+.3*Math.sin(t*30+i));if(k>=1){kill(o);return false}return true})}}
function smoke(pos,n,color,spread=1,life=1.2,size=.9,op=.35){n=Math.ceil(n*(lite()?.5:1));for(let i=0;i<n;i++){const p=pos.clone().add(new T.Vector3((rand()-.5)*spread,rand()*.3,(rand()-.5)*spread)),s=sprite(softTex,p,size*.5,{color,normal:true,op:0}),g=1+rand()*1.5,v=new T.Vector3((rand()-.5)*.5,.3+rand()*.4,(rand()-.5)*.5);
 spawn(s,(o,dt,t)=>{const k=t/life;o.position.addScaledVector(v,dt);o.scale.setScalar(size*(.5+g*k));o.material.opacity=op*Math.sin(Math.min(1,k)*Math.PI);if(k>=1){kill(o);return false}return true})}}
function ringFlat(pos,color,from,to,life,y=.05){const m=new T.Mesh(new T.PlaneGeometry(1,1,8,8),new T.MeshBasicMaterial({map:ringTex,color,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));m.rotation.x=-Math.PI/2;m.position.set(pos.x,ground(pos.x,pos.z)+y,pos.z);m.scale.setScalar(from);m.userData.groundDecal487=.05;m.frustumCulled=false;addFX(m);
 spawn(m,(o,dt,t)=>{const k=t/life;o.scale.setScalar(from+(to-from)*(1-Math.pow(1-Math.min(1,k),2)));o.material.opacity=Math.max(0,1-k);if(k>=1){kill(o);return false}return true});return m}
function ringFace(pos,color,from,to,life){const s=sprite(ringTex,pos,from,{color});spawn(s,(o,dt,t)=>{const k=t/life;o.scale.setScalar(from+(to-from)*k);o.material.opacity=Math.max(0,1-k);if(k>=1){kill(o);return false}return true})}
function ringDir(pos,dir,color,from,to,life){const m=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:ringTex,color,transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending}));m.position.copy(pos);m.lookAt(pos.clone().add(dir));m.scale.setScalar(from);addFX(m);
 spawn(m,(o,dt,t)=>{const k=t/life;o.scale.setScalar(from+(to-from)*k);o.material.opacity=Math.max(0,1-k);if(k>=1){kill(o);return false}return true})}
function crack(pos,color,size,hold=1.2,which=0){const m=new T.Mesh(new T.PlaneGeometry(1,1,8,8),new T.MeshBasicMaterial({map:CRACK[which],color,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));m.rotation.x=-Math.PI/2;m.rotation.z=rand()*6.28;m.position.set(pos.x,ground(pos.x,pos.z)+.02,pos.z);m.scale.setScalar(.1);m.userData.groundDecal487=.02;m.frustumCulled=false;addFX(m);
 spawn(m,(o,dt,t)=>{o.scale.setScalar(size*Math.min(1,t/.12));o.material.opacity=t<hold?1:Math.max(0,1-(t-hold)/.5);if(t>hold+.5){kill(o);return false}return true})}
function rune(pos,color,size,life,spin=1,y=.04){const m=new T.Mesh(new T.PlaneGeometry(1,1,8,8),new T.MeshBasicMaterial({map:RUNE,color,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));m.rotation.x=-Math.PI/2;m.position.set(pos.x,ground(pos.x,pos.z)+y,pos.z);m.scale.setScalar(.1);m.userData.groundDecal487=.04;m.frustumCulled=false;addFX(m);
 spawn(m,(o,dt,t)=>{const k=t/life;o.rotation.z+=dt*spin;o.scale.setScalar(size*Math.min(1,easeOutBack(Math.min(1,t/.25))));o.material.opacity=k<.75?1:Math.max(0,(1-k)/.25);if(k>=1){kill(o);return false}return true});return m}
/* corte em arco (a fita de luz do anime) */
function slash(center,yaw,o){if(currentCtx?.cast&&currentCtx.ci===1&&!currentCtx.cast.ready)impactCast(currentCtx.cast);const N=48,r=(o.r??1.3)*1.15,w=(o.w??.45)*1.45,arc=o.arc??2.4,a0=(o.a0??-arc/2),p=[],uv=[],idx=[];
 for(let i=0;i<=N;i++){const f=i/N,a=a0+arc*f*(o.rev?-1:1)+(o.rev?arc:0),wf=w*(.35+.65*Math.sin(Math.PI*f));for(const [j,rr] of [[0,r-wf*.65],[1,r+wf*.35]]){p.push(Math.sin(a)*rr,0,Math.cos(a)*rr);uv.push(f,j)}}
 for(let i=0;i<N;i++){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);
 const mat=ribMat(o.col,{tail:o.tail??.7,noise:o.noise??.8,ns:o.ns??6,spd:o.spd??4,gain:(o.gain??1.3)*1.25}),m=new T.Mesh(g,mat);m.userData.ownGeo=true;
 const grp=new T.Group();grp.add(m);grp.position.copy(center);grp.rotation.order='YXZ';grp.rotation.set(o.pitch??0,yaw,o.tilt??0);addFX(grp);
 const dur=o.dur??.18,spin=o.spin??0;
 spawn(grp,(ob,dt,t)=>{mat.uniforms.uTime.value=time;mat.uniforms.uProg.value=Math.min(1,t/dur);if(spin)m.rotation.y+=spin*dt;if(t>dur){mat.uniforms.uFade.value=Math.max(0,1-(t-dur)/(o.fade??.16));mat.uniforms.uDis.value=(t-dur)*2.5}if(t>dur+(o.fade??.16)){kill(ob);return false}return true});return grp}
/* fita que segue a câmera passando por pontos (rastro, raio) */
function stripGeo(pts,width,taper=true){const p=[],uv=[],idx=[],n=pts.length,view=new T.Vector3();
 for(let i=0;i<n;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(n-1,i+1)],tg=b.clone().sub(a).normalize();view.copy(camera.position).sub(pts[i]).normalize();const side=tg.clone().cross(view).normalize();const f=i/(n-1),w=width*(taper?(1-f*.85):1)*.5;
  p.push(pts[i].x+side.x*w,pts[i].y+side.y*w,pts[i].z+side.z*w,pts[i].x-side.x*w,pts[i].y-side.y*w,pts[i].z-side.z*w);uv.push(f,0,f,1)}
 for(let i=0;i<n-1;i++){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);return g}
function trail(getPos,width,col,o={}){const pts=[],mat=ribMat(col,{mode:1,center:1,noise:o.noise??.5,ns:o.ns??5,spd:o.spd??6,gain:o.gain??1.3}),m=new T.Mesh(new T.BufferGeometry(),mat);m.frustumCulled=false;addFX(m);const len=o.len??14;let dead=0;
 spawn(m,(ob,dt,t)=>{mat.uniforms.uTime.value=time;const p=getPos();if(p){pts.unshift(p.clone());if(pts.length>len)pts.pop()}else{dead+=dt;pts.pop();mat.uniforms.uFade.value=Math.max(0,1-dead/.25)}
  if(pts.length>1){ob.geometry.dispose();ob.geometry=stripGeo(pts,width)}if(!p&&(pts.length<2||dead>.25)){kill(ob);return false}return true});return m}
function bolt(a,b,col,o={}){const life=o.life??.16,width=o.width??.16;let m=null,acc=0;const mat=ribMat(col,{mode:1,center:1,noise:.35,ns:12,spd:14,gain:o.gain??1.6});mat.uniforms.uMode.value=2;
 const build=()=>{const pts=[a.clone()],n=o.seg??12,d=b.clone().sub(a),len=d.length(),side=new T.Vector3(-d.z,0,d.x).normalize();for(let i=1;i<n;i++){const f=i/n,jit=(o.jit??.35)*Math.sin(Math.PI*f);pts.push(a.clone().addScaledVector(d,f).addScaledVector(side,(rand()-.5)*jit*2).add(new T.Vector3(0,(rand()-.5)*jit*1.4,0)))}pts.push(b.clone());
  if(m){m.geometry.dispose();m.geometry=stripGeo(pts,width,false)}else{m=new T.Mesh(stripGeo(pts,width,false),mat);m.frustumCulled=false;addFX(m)}};
 build();spawn(m,(ob,dt,t)=>{acc+=dt;mat.uniforms.uTime.value=time;if(acc>.04){acc=0;build()}mat.uniforms.uFade.value=Math.max(0,1-t/life)*(.75+.25*Math.sin(t*90));if(t>life){kill(m);return false}return true});
 fade(sprite(glowTex,a,.6,{color:col[1]}),.15,.4);}
function orb(pos,size,col,o={}){const m=new T.Mesh(new T.PlaneGeometry(1,1),orbMat(col,o));m.position.copy(pos);m.scale.setScalar(size);addFX(m);return m}
function faceCam(m){m.quaternion.copy(camera.quaternion)}
/* projétil genérico: vai de a até b, chama hit ao chegar */
function shot(a,b,spd,make,hit,o={}){const head=make(a);const d=b.clone().sub(a),len=d.length(),dir=d.clone().normalize();let pos=a.clone(),done=false;
 if(o.trail)trail(()=>done?null:pos,o.trail[0],o.trail[1],o.trailOpt||{});
 spawn(head,(ob,dt,t)=>{const s=Math.min(len,t*spd);pos=a.clone().addScaledVector(dir,s);if(o.arcH)pos.y+=Math.sin(Math.PI*s/len)*o.arcH;ob.position.copy(pos);if(ob.isMesh&&ob.material.uniforms&&ob.material.uniforms.uTime){ob.material.uniforms.uTime.value=time;if(o.face!==false&&ob.geometry.type==='PlaneGeometry')faceCam(ob)}
  if(o.align){ob.quaternion.setFromUnitVectors(UP,dir);if(o.spinAxis)ob.rotateY(t*20)}if(o.tumble){ob.rotation.x+=dt*9;ob.rotation.z+=dt*7}
  if(s>=len){done=true;kill(ob);if(currentCtx?.skill)API.provider(currentCtx.skill)?.onShotImpact?.(currentCtx,b);hit&&hit(b.clone(),dir);return false}return true});}
/* cristais */
function shardGeo(r){const k=5+Math.floor(r()*2),rad=.17+r()*.05,tip=[(r()-.5)*.1,1,(r()-.5)*.1],bot=[],mid=[];
 for(let i=0;i<k;i++){const a=i/k*6.283+r()*.5,rr=rad*(.7+r()*.55);bot.push([Math.cos(a)*rr*.9,-.3,Math.sin(a)*rr*.9]);mid.push([Math.cos(a)*rr*.82,.48+r()*.14,Math.sin(a)*rr*.82])}
 const p=[];const tri=(a,b,c)=>p.push(...a,...b,...c);for(let i=0;i<k;i++){const j=(i+1)%k;tri(bot[i],bot[j],mid[j]);tri(bot[i],mid[j],mid[i]);tri(mid[i],mid[j],tip)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.computeVertexNormals();return g}
const GEOS=[];{const r=rng(7);for(let i=0;i<8;i++)GEOS.push(shardGeo(r))}
function bladeGeo(){const p=[],tri=(a,b,c)=>p.push(...a,...b,...c),w=.09,t=.03;const tip=[0,1,0],base=[[w,0,0],[0,0,t],[-w,0,0],[0,0,-t]],tail=[0,-.25,0];for(let i=0;i<4;i++){const j=(i+1)%4;tri(base[i],base[j],tip);tri(base[j],base[i],tail)}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.computeVertexNormals();return g}
const BLADE=bladeGeo();
function crystal(pal,pos,h,w,lean,leanDir,o={}){pos=pos.clone();pos.y=ground(pos.x,pos.z);const geo=o.geo||GEOS[Math.floor(rand()*GEOS.length)],mat=crystalMat(pal),m=new T.Mesh(geo,mat);
 const target=UP.clone().addScaledVector(leanDir,Math.tan(lean)).normalize();m.quaternion.copy(new T.Quaternion().setFromUnitVectors(UP,target).multiply(new T.Quaternion().setFromAxisAngle(UP,rand()*6.283)));
 m.position.copy(pos);m.scale.setScalar(.0001);addFX(m);const grow=o.grow??.13,hold=o.hold??.8,melt=o.melt??.32;let em=0;
 spawn(m,(ob,dt,t)=>{const p=Math.min(1,t/grow);ob.scale.set(w*Math.min(1,p*1.6),h*Math.max(.0001,easeOutBack(p)),w*Math.min(1,p*1.6));mat.uniforms.uTime.value=time;mat.uniforms.uFlash.value=flashV;
  const mt=t-grow-hold;if(mt>0){const mp=Math.min(1,mt/melt);mat.uniforms.uMelt.value=mp;em-=dt;if(em<=0&&o.bits!==false){em=.03;bits(pal,new T.Vector3(0,h*(1-mp)*.9,0).applyQuaternion(ob.quaternion).add(pos),1,o.bitCol)}if(mp>=1){kill(ob);return false}}return true});
 if(o.pop!==false){for(let i=0;i<(o.chunks??2);i++)chunk(pal,pos,.8+h*.5)}return m}
function chunk(pal,pos,power){const mt=crystalMat(pal),m=new T.Mesh(GEOS[Math.floor(rand()*8)],mt);const s=.05+rand()*.08;m.scale.set(s,s*2,s);m.position.set(pos.x,ground(pos.x,pos.z)+.05,pos.z);addFX(m);
 const v=new T.Vector3((rand()-.5)*2.2,2.2+rand()*2*power,(rand()-.5)*2.2),sp=rand()*9;spawn(m,(o,dt,t)=>{v.y-=14*dt;o.position.addScaledVector(v,dt);o.rotation.x+=sp*dt;o.rotation.y+=sp*dt;mt.uniforms.uTime.value=time;if(o.position.y<ground(o.position.x,o.position.z)+.03){o.position.y=ground(o.position.x,o.position.z)+.03;v.multiplyScalar(.35);v.y=Math.abs(v.y)*.4}mt.uniforms.uFade.value=Math.max(0,1-t/.9);if(t>.9){kill(o);return false}return true})}
function bits(pal,p,n,col){n=Math.ceil(n*(lite()?.5:1));for(let i=0;i<n;i++){const mt=crystalMat(pal),m=new T.Mesh(GEOS[Math.floor(rand()*8)],mt);const s=.035+rand()*.05;m.scale.set(s,s*2.4,s);m.position.copy(p);addFX(m);
 const v=new T.Vector3((rand()-.5)*3,1+rand()*2.5,(rand()-.5)*3),sp=rand()*14;spawn(m,(o,dt,t)=>{v.y-=9*dt;o.position.addScaledVector(v,dt);o.rotation.x+=sp*dt;o.rotation.z+=sp*.7*dt;if(o.position.y<ground(o.position.x,o.position.z)+.02){o.position.y=ground(o.position.x,o.position.z)+.02;v.set(v.x*.3,0,v.z*.3)}mt.uniforms.uTime.value=time;mt.uniforms.uFade.value=Math.max(0,1-t/.7);if(t>.7){kill(o);return false}return true})}}
function hexShield(pos,dir,col,life,push){const grp=new T.Group(),mats=[];const cells=[[0,0],[.52,.3],[-.52,.3],[.52,-.3],[-.52,-.3],[0,.6],[0,-.6]];
 for(const [x,y] of cells){const mt=new T.ShaderMaterial({vertexShader:ribVS,fragmentShader:hexFS,transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,uniforms:{uTime:{value:0},uFade:{value:1},uA:{value:new T.Color(col[0])},uB:{value:new T.Color(col[1])}}});mats.push(mt);
  const m=new T.Mesh(new T.CircleGeometry(.34,6),mt);m.userData.ownGeo=true;m.position.set(x,y+.9,0);m.rotation.z=Math.PI/6;grp.add(m)}
 grp.position.copy(pos);grp.lookAt(pos.clone().add(dir));grp.scale.setScalar(.01);addFX(grp);
 spawn(grp,(o,dt,t)=>{for(const m of mats){m.uniforms.uTime.value=time}const k=Math.min(1,t/.12);o.scale.setScalar(easeOutBack(k));if(push&&t>push[0])o.position.addScaledVector(dir,dt*push[1]*Math.max(0,1-(t-push[0])/.25));if(t>life){for(const c of o.children){const wp=new T.Vector3();c.getWorldPosition(wp);bits('steel',wp,3)}kill(o);return false}return true});return grp}


// Batched camera-facing particles: the approved star/glow textures, two draw calls.
const spritePools=new Map(),poolMatrix=new T.Matrix4(),poolScale=new T.Vector3(),poolColor=new T.Color();
function getSpritePool(tex){if(spritePools.has(tex))return spritePools.get(tex);const mesh=new T.InstancedMesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false}),360);mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.setColorAt(0,new T.Color(0));mesh.instanceColor.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;mesh.count=0;addFX(mesh);const p={mesh,holder:new T.Group(),entries:new Set()};spritePools.set(tex,p);return p}
function syncPools(){for(const p of spritePools.values()){let i=0;for(const s of p.entries){if(i>=360)break;poolScale.set(s.scale.x,s.scale.y,1);poolMatrix.compose(s.position.clone().add(followOffset(s.userData.ctx487)),camera.quaternion,poolScale);p.mesh.setMatrixAt(i,poolMatrix);poolColor.copy(s.material.color).multiplyScalar(Math.max(0,s.material.opacity));p.mesh.setColorAt(i,poolColor);i++}p.mesh.count=i;if(i){if(!p.mesh.parent)addFX(p.mesh);p.mesh.instanceMatrix.needsUpdate=true;p.mesh.instanceColor.needsUpdate=true}}}

const COLORS={0:[0xffffff,0xffc94d,0xff5a10],1:[0xffffff,0xc07bff,0x5a10a0],2:[0xffffff,0x8cc4ff,0x1f4fb0]},PALS={0:'gold',1:'violet',2:'steel'};
class GroundVector extends T.Vector3{setY(y){this.y=ground(this.x,this.z)+y;return this}}
const gp=(x,z,y=0)=>new GroundVector(x,ground(x,z)+y,z);
function actor(e,point){return {entity:e,position:point||gp(e.x,e.z),userData:{inner:{rotation:new T.Euler()}}}}
function context(ci,e,point){const h=actor(player,gp(player.x,player.z)),f=actor(e||null,e?gp(e.x,e.z):gp((point||player).x,(point||player).z)),yaw=ci===1&&e?Math.atan2(e.x-player.x,e.z-player.z):player.face||0;return {ci,hero:h,foe:f,S:{dir:new T.Vector3(Math.sin(yaw),0,Math.cos(yaw)),yaw},region:L}}
const hand=(h=.95)=>hero.position.clone().addScaledVector(S.dir,.5).setY(h);
const tgt=(f=F,h=.85)=>f.position.clone().setY(h);
// These offsets affect only drawing. Entity positions, collider positions and movement remain in the game.
const poses=new Map();
function followOffset(ctx){return ctx?.follow&&ctx.followAt?new T.Vector3(ctx.follow.x-ctx.followAt.x,0,ctx.follow.z-ctx.followAt.z):new T.Vector3()}
function lunge(d,dir,dur=.2){const e=hero.entity;spawn(null,(o,dt,t)=>{let p=poses.get(e);if(!p){p={offset:new T.Vector3(),rot:new T.Euler()};poses.set(e,p)}const k=t/dur;p.offset.copy(dir).multiplyScalar(d*Math.sin(Math.min(1,k)*Math.PI));if(k>=1){p.offset.set(0,0,0);return false}return true})}
function knock(f,amt=.3,dur=.35){const e=f.entity;if(!e)return;spawn(null,(o,dt,t)=>{let p=poses.get(e);if(!p){p={offset:new T.Vector3(),rot:new T.Euler()};poses.set(e,p)}const k=t/dur;p.rot.z=-amt*Math.sin(Math.min(1,k)*Math.PI)*(1-k);p.rot.x=amt*.5*Math.sin(Math.min(1,k)*Math.PI)*(1-k);if(k>=1){p.rot.set(0,0,0);return false}return true})}
function meleeHit(col,pal,big){if(currentCtx?.manualImpact500)return;if(currentCtx?.cast)impactCast(currentCtx.cast);const p=tgt();sparks(p,big?22:12,col[1],big?6:4.5);fade(sprite(glowTex,p,big?1.4:.8,{color:col[1]}),.18,1);knock(F,big?.45:.25);if(big){flash(.6,.7,.22);crack(F.position,col[1],2.4,.6)}else flash(0,.25,.06)}
const RECIPES=[
 {id:0,n:'Guerreiro',arma:'espada',melee:true,col:[0xffffff,0xffc94d,0xff5a10],pal:'gold',basic:'Combo de espada',skill:'Corte Giratório',
  b(){const c=this.col;[0,.42,.84].forEach((d,i)=>at(d,()=>{lunge(.35,S.dir,.18);const big=i===2;slash(hero.position.clone().setY(big?1.1:.95),S.yaw,{col:c,r:1.35,w:big?.7:.5,arc:2.5,tilt:i===0?.35:i===1?-.4:1.45,rev:i===1,dur:.15});at(.08,()=>meleeHit(c,this.pal,big))}))},
  s(){const c=this.col;rune(hero.position,c[1],2.2,1.1,3);at(.15,()=>{for(const [y,r,d] of [[.55,1.9,0],[1,2.15,.1]])at(d,()=>slash(hero.position.clone().setY(y),S.yaw,{col:c,r,w:.7,arc:6.283,dur:.32,tail:.9,fade:.25}));
   at(.12,()=>{ringFlat(hero.position,c[1],1,6,.45);sparks(hero.position.clone().setY(.8),30,c[1],7,4);meleeHit(c,this.pal,true)});at(.28,()=>{for(let i=0;i<10;i++){const a=i/10*6.283;crystal('gold',hero.position.clone().add(new T.Vector3(Math.cos(a)*1.9,0,Math.sin(a)*1.9)),.45+rand()*.3,.8,.6,new T.Vector3(Math.cos(a),0,Math.sin(a)),{hold:.35,chunks:1})}})})}},
 {id:1,n:'Assassino',arma:'adagas',melee:false,dist:4.8,col:[0xffffff,0xc07bff,0x5a10a0],pal:'violet',basic:'Adagas arremessadas',skill:'Mil Cortes',
  b(){const c=this.col;[0,.3,.6].forEach(d=>at(d,()=>{const a=hand();shot(a,tgt(),18,p=>{const m=new T.Mesh(BLADE,crystalMat('violet'));m.position.copy(p);m.scale.setScalar(.95);scene.add(m);return m},(p,dir)=>{sparks(p,10,0xff3050,3.5,7,.14);sparks(p,6,c[1],4);slash(p.clone(),Math.atan2(dir.x,dir.z),{col:c,r:.45,w:.3,arc:2,tilt:.8,dur:.08,fade:.12});knock(F,.2)},{align:true,trail:[.18,c]})}))},
  s(){const c=this.col;const p=F.position.clone();rune(p,c[2],1.6,1.4,-2);for(let i=0;i<7;i++)at(.06+i*.1,()=>{slash(p.clone().setY(.5+rand()*.9),rand()*6.28,{col:c,r:.8+rand()*.3,w:.35,arc:2.2,tilt:(rand()-.5)*2.4,pitch:(rand()-.5)*.6,dur:.07,fade:.14});sparks(tgt(),8,c[1],5);sparks(tgt(),4,0xff3050,3,7,.12);knock(F,.15,.12)});
   at(.8,()=>{flash(.7,.8,.25);slash(p.clone().setY(1),S.yaw,{col:c,r:1.2,w:.8,arc:2.8,tilt:.9,dur:.1,fade:.3});slash(p.clone().setY(1),S.yaw,{col:c,r:1.2,w:.8,arc:2.8,tilt:-.9,dur:.1,fade:.3});sparks(tgt(),26,c[1],7);bits('violet',tgt(),10);crack(p,c[1],2,.5)})}},
 {id:2,n:'Tanque',arma:'machado e escudo',melee:true,col:[0xffffff,0x8cc4ff,0x1f4fb0],pal:'steel',basic:'Golpes de machado',skill:'Golpe de Escudo',
  b(){const c=this.col;[0,.5,1].forEach((d,i)=>at(d,()=>{lunge(.3,S.dir,.22);const big=i===2;slash(hero.position.clone().setY(1.2),S.yaw,{col:c,r:1.25,w:big?.85:.65,arc:2,tilt:1.5,rev:i===1,dur:.17});at(.12,()=>{meleeHit(c,this.pal,big);if(big){ringFlat(F.position,c[1],.5,4,.4);for(let k=0;k<8;k++)chunk('steel',F.position,1.4)}})}))},
  s(){const c=this.col;const sh=hexShield(hero.position.clone().addScaledVector(S.dir,.7),S.dir,c,.75,[.3,9]);at(.32,()=>{for(let k=0;k<3;k++)at(k*.06,()=>slash(hero.position.clone().addScaledVector(S.dir,.6+k*.5).setY(.7),S.yaw,{col:c,r:.6+k*.7,w:.5,arc:1.7,dur:.12,fade:.2}));
   at(.12,()=>{meleeHit(c,this.pal,true);knock(F,.6,.5);ringFlat(F.position,c[1],.4,3.5,.4);smoke(F.position,6,0x9cb4d8,1.2,1,1.2,.25)})})}},
 {id:4,n:'Arqueiro',arma:'arco',melee:false,dist:6.4,col:[0xffffff,0x6dffa0,0x0a8a40],pal:'green',basic:'Flechas de luz',skill:'Chuva de Flechas',
  b(){const c=this.col;[0,.38,.76].forEach((d,i)=>at(d,()=>{const a=hand(1.05),big=i===2,end=big?tgt().addScaledVector(S.dir,3):tgt();fade(sprite(glowTex,a,.6,{color:c[1]}),.15,1);
   shot(a,end,26,p=>{const m=new T.Mesh(BLADE,crystalMat('green'));m.position.copy(p);m.scale.set(.9,big?1.6:1.2,.9);scene.add(m);return m},()=>{if(big){sparks(end,10,c[1],3)}},{align:true,trail:[big?.3:.18,c,{len:big?18:12}]});
   at(tgt().distanceTo(a)/26,()=>{sparks(tgt(),12,c[1],4.5);ringFace(tgt(),c[1],.3,1.2,.25);knock(F,.22)})}))},
  s(){const c=this.col,P=F.position.clone();const a=hand(1.1);shot(a,a.clone().add(new T.Vector3(0,8,0)),22,p=>{const m=new T.Mesh(BLADE,crystalMat('green'));m.position.copy(p);scene.add(m);return m},null,{align:true,trail:[.25,c]});
   ringFlat(P,c[1],2.8,3,1.8);rune(P,c[2],3.2,1.9,.6);
   for(let i=0;i<16;i++)at(.35+i*.08,()=>{const g=P.clone().add(new T.Vector3((rand()-.5)*3.6,0,(rand()-.5)*3.6));const s0=g.clone().add(new T.Vector3(-1.5,7,1.5));
    shot(s0,g.clone().setY(.05),24,p=>{const m=new T.Mesh(BLADE,crystalMat('green'));m.position.copy(p);m.scale.set(.9,1.3,.9);scene.add(m);return m},(p)=>{sparks(p.clone().setY(.2),7,c[1],3);ringFlat(p,c[1],.2,1.1,.3);const st=crystal('green',p,.35,.5,.25,new T.Vector3(1,0,-1).normalize(),{geo:BLADE,hold:.5,chunks:0,bits:false});if(p.distanceTo(P)<1.3){knock(F,.18,.2)}},{align:true,trail:[.16,c,{len:8}]})});
   at(1.8,()=>{flash(.4,.5,.12)})}},
 {id:5,n:'Paladino',arma:'varinha sagrada',melee:false,dist:4.2,col:[0xffffff,0xffe28a,0xd08a20],pal:'gold',basic:'Luz sagrada',skill:'Julgamento',
  b(){const c=this.col;[0,.42,.84].forEach(d=>at(d,()=>{const a=hand(1.05);shot(a,tgt(),13,p=>orb(p,.55,c,{noise:.6}),(p)=>{fade(sprite(starTex,p,1.6,{color:c[1]}),.25,.3);ringFace(p,c[1],.3,1.5,.3);sparks(p,12,c[1],4,2);knock(F,.2)},{trail:[.3,c,{len:12}]})}))},
  s(){const c=this.col,H=hero.position.clone();rune(H,c[1],2.4,1.6,1.5);at(.1,()=>{const col=new T.Mesh(new T.CylinderGeometry(.42,.42,9,24,1,true),ribMat(c,{mode:1,center:1,noise:.6,ns:3,spd:-3,gain:1.2}));col.userData.ownGeo=true;
   col.material.uniforms.uMode.value=2;col.position.set(H.x,ground(H.x,H.z)+4.5,H.z);scene.add(col);col.scale.set(.1,1,.1);
   spawn(col,(o,dt,t)=>{o.material.uniforms.uTime.value=time;const k=t/.55;o.scale.set(Math.sin(Math.min(1,k)*Math.PI)+.05,1,Math.sin(Math.min(1,k)*Math.PI)+.05);o.material.uniforms.uFade.value=Math.max(0,1-k);if(k>=1){kill(o);return false}return true})});
   at(.35,()=>{flash(.8,.9,.3);rune(H,c[1],currentCtx?.areaRadius?currentCtx.areaRadius*2.15:7,1.1,.8);ringFlat(H,c[1],1,currentCtx?.areaRadius?currentCtx.areaRadius/.36:8,.6);ringFlat(H,0xffffff,1,currentCtx?.areaRadius?currentCtx.areaRadius*.75/.36:6,.45,.08);sparks(H.clone().setY(1),36,c[1],8,1.5,.2,.7);embers(H,30,c[1],5,1.5);meleeHit(c,this.pal,false);knock(F,.4,.4);fade(sprite(starTex,tgt(),2,{color:c[1]}),.3,.3)})}},
 {id:6,n:'Invocador',arma:'tomo',melee:false,dist:5.6,col:[0xffffff,0x8fb8ff,0x6a30e0],pal:'arcane',basic:'Esfera arcana',skill:'Lobo Espiritual',
  b(){const c=this.col;[0,.45,.9].forEach(d=>at(d,()=>{const a=hand(1.05);const o0=orb(a,.5,c,{noise:.8});const gl=[];for(let k=0;k<3;k++){gl.push(sprite(starTex,a,.18,{color:c[1]}))}
   let pos=a.clone();spawn(o0,(o,dt,t)=>{gl.forEach((g,k)=>{const an=t*14+k*2.09;g.position.copy(o.position).add(new T.Vector3(Math.cos(an)*.32,Math.sin(an*1.3)*.18,Math.sin(an)*.32))});return o.parent!=null});
   shot(a,tgt(),11,()=>o0,(p)=>{gl.forEach(g=>kill(g));rune(F.position,c[1],1.4,.9,2,.05);ringFace(p,c[1],.3,1.3,.3);sparks(p,12,c[1],4);knock(F,.2)},{trail:[.26,c]})}))},
  s(){const c=this.col,P=hero.position.clone().addScaledVector(new T.Vector3(-S.dir.z,0,S.dir.x),1.4).addScaledVector(S.dir,.6);rune(P,c[1],2.2,1.8,2.5);
   for(let i=0;i<24;i++)at(rand()*.5,()=>{const a=rand()*6.28,from=P.clone().add(new T.Vector3(Math.cos(a)*1.4,.2+rand()*1.6,Math.sin(a)*1.4)),s=sprite(starTex,from,.14,{color:c[1]});spawn(s,(o,dt,t)=>{const k=Math.min(1,t/.3);o.position.lerpVectors(from,P.clone().setY(.7),k*k);if(k>=1){kill(o);return false}return true})});
   at(.55,()=>{flash(.5,.7,.1);ringFace(P.clone().setY(.8),c[1],.3,2.4,.35);const sp=new T.Group(),m=crystalMat('arcane');m.uniforms.uFade.value=0;
    const body=new T.Mesh(new T.SphereGeometry(.42,24,16),m);body.scale.set(1.5,.75,.75);body.position.y=.6;sp.add(body);const head=new T.Mesh(new T.SphereGeometry(.26,20,14),m);head.position.set(.62,.85,0);head.scale.set(1.3,.85,.85);sp.add(head);for(const z of [-.1,.1]){const ear=new T.Mesh(GEOS[1],m);ear.scale.set(.35,.35,.35);ear.position.set(.58,1.02,z);sp.add(ear)}const tail=new T.Mesh(GEOS[4],m);tail.scale.set(.3,.8,.3);tail.position.set(-.6,.75,0);tail.rotation.z=1.1;sp.add(tail);for(const [x,z] of [[.4,-.18],[.4,.18],[-.35,-.18],[-.35,.18]]){const leg=new T.Mesh(GEOS[2],m);leg.scale.set(.22,.45,.22);leg.position.set(x,.12,z);sp.add(leg)}
    const glow=orb(new T.Vector3(),.9,c,{noise:1});sp.add(glow);glow.position.y=.7;sp.position.copy(P);sp.lookAt(F.position.clone().setY(0));sp.rotateY(-Math.PI/2);scene.add(sp);
    trail(()=>sp.parent?sp.position.clone().setY(.7):null,.6,c,{len:16});
    const from=P.clone(),to=F.position.clone().addScaledVector(S.dir,-.9);spawn(sp,(o,dt,t)=>{glow.quaternion.copy(camera.quaternion).premultiply(o.quaternion.clone().invert());glow.material.uniforms.uTime.value=time;m.uniforms.uTime.value=time;m.uniforms.uFade.value=Math.min(1,t*3);
     const k=Math.min(1,Math.max(0,(t-.35)/.3));o.position.lerpVectors(from,to,k*k);o.position.y=Math.sin(k*Math.PI)*.6;if(t>.66&&!o.userData.bit){o.userData.bit=1;for(let j=0;j<3;j++)slash(tgt().add(new T.Vector3(0,(j-1)*.22,0)),S.yaw,{col:c,r:.55,w:.18,arc:1.4,tilt:.5,dur:.09,fade:.2});sparks(tgt(),16,c[1],5);knock(F,.35);flash(.3,.5,.12)}
     if(t>1.3){m.uniforms.uFade.value=Math.max(0,1-(t-1.3)*3);glow.material.uniforms.uFade.value=Math.max(0,1-(t-1.3)*2)}if(t>1.6){kill(o);return false}return true})})}},
 {id:8,n:'Mago de Fogo',arma:'cajado',melee:false,dist:6.4,col:[0xfff2c0,0xff8a20,0xc01a00],pal:'magma',basic:'Bola de fogo',skill:'Chuva de Meteoros',
  b(){const c=this.col;[0,.45,.9].forEach(d=>at(d,()=>{const a=hand(1.05);shot(a,tgt(),12,p=>orb(p,.75,c,{fire:1,noise:.8}),(p)=>this.boom(p,1),{trail:[.45,c,{len:14,noise:.9,ns:4,spd:8}]})}))},
  boom(p,s){const c=this.col;const o=orb(p,.8*s,c,{fire:1});spawn(o,(ob,dt,t)=>{faceCam(ob);ob.material.uniforms.uTime.value=time;ob.scale.setScalar(s*(.8+t*5));ob.material.uniforms.uFade.value=Math.max(0,1-t/.35);if(t>.35){kill(ob);return false}return true});
   for(let i=0;i<5;i++)slash(new T.Vector3(p.x,Math.max(ground(p.x,p.z)+.3,p.y-.2),p.z),rand()*6.28,{col:c,r:.5*s,w:.35*s,arc:1.6,pitch:-.9-rand()*.5,dur:.12,fade:.2,noise:1,ns:5});
   embers(p,14*s,c[1],.8*s,1.1);sparks(p,10*s,0xffd080,4*s,4);smoke(p,4*s,0x3a2a24,.8*s,1.3,1*s,.35);crack(new T.Vector3(p.x,0,p.z),c[1],1.6*s,.5);knock(F,.25*s);if(s>1)flash(.5,.7,.25)},
  s(){const c=this.col,P=F.position.clone();ringFlat(P,c[1],3,3.2,1.9);for(let i=0;i<5;i++)at(.15+i*.28,()=>{const g=P.clone().add(new T.Vector3((rand()-.5)*2.8,.1,(rand()-.5)*2.8));if(i===2)g.copy(P).setY(.1);const s0=g.clone().add(new T.Vector3(-3,9,2.2));
   shot(s0,g,16,p=>{const grp=new T.Group();const rock=new T.Mesh(GEOS[i%8],crystalMat('magma'));rock.scale.set(.45,.6,.45);grp.add(rock);const fo=orb(new T.Vector3(),1.4,c,{fire:1});grp.add(fo);grp.position.copy(p);scene.add(grp);
    spawn(grp,(o,dt,t)=>{rock.rotation.x+=dt*6;fo.quaternion.copy(camera.quaternion);fo.material.uniforms.uTime.value=time;return grp.parent!=null});return grp},(p)=>this.boom(p,1.6),{trail:[.8,c,{len:20,noise:1,ns:3,spd:9}]})})}},
 {id:9,n:'Mago de Gelo',arma:'cajado',melee:false,dist:6.6,col:[0xffffff,0x8fe8ff,0x2f7dff],pal:'ice',basic:'Estilhaço de gelo',skill:'Lança de Gelo',
  b(){const c=this.col;[0,.42,.84].forEach(d=>at(d,()=>{const a=hand(1.05);shot(a,tgt(),17,p=>{const m=new T.Mesh(GEOS[2],crystalMat('ice'));m.position.copy(p);m.scale.set(.5,1.1,.5);scene.add(m);return m},(p,dir)=>{bits('ice',p,8);sparks(p,10,c[1],4);ringFace(p,c[1],.2,1.2,.25);
   for(let k=0;k<3;k++)crystal('ice',F.position.clone().add(new T.Vector3((rand()-.5)*.8,0,(rand()-.5)*.8)),.35+rand()*.2,.6,.5,new T.Vector3(rand()-.5,0,rand()-.5).normalize(),{hold:.25,grow:.08,chunks:1});knock(F,.22)},{align:true,trail:[.22,c],tumble:false})}))},
  s(){this.line('ice',this.col,true)},
  line(pal,c,frost){const A=hero.position.clone(),B=F.position.clone(),dir=S.dir,perp=new T.Vector3(-dir.z,0,dir.x),hd=hand();
   const orbm=sprite(glowTex,hd,.1,{color:c[1]});spawn(orbm,(o,dt,t)=>{if(t<.42){const k=t/.42;o.scale.setScalar(.25+.75*k+Math.sin(t*60)*.05);if(rand()<.6){const a=rand()*6.28,from=hd.clone().add(new T.Vector3(Math.cos(a),(rand()-.3),Math.sin(a))),s=sprite(starTex,from,.12,{color:c[1]});spawn(s,(oo,d2,tt)=>{const kk=Math.min(1,tt/.2);oo.position.lerpVectors(from,hd,kk*kk);if(kk>=1){kill(oo);return false}return true})}}else{const k=(t-.42)/.18;o.scale.setScalar(1+k*.8);o.material.opacity=Math.max(0,1-k);if(k>=1){kill(o);return false}}return true});
   at(.42,()=>{ringFace(hd,c[1],.3,2.6,.32);sparks(hd,18,c[1],5);flash(0,.4,.08)});
   const start=A.clone().addScaledVector(dir,.75),end=B.clone().addScaledVector(dir,-.7),len=start.distanceTo(end),N=17;
   for(let i=0;i<N;i++){const f=i/(N-1),p=start.clone().addScaledVector(dir,len*f).addScaledVector(perp,(rand()-.5)*.22);p.y=0;const born=.47+f*.42,h=.38+f*f*1.05+rand()*.12,w=.75+f*.75,hold=1.72+f*.34-born-.13;
    at(born,()=>{crystal(pal,p,h,w,.38+rand()*.18,dir.clone().addScaledVector(perp,(rand()-.5)*.5).normalize(),{hold});crack(p,c[1],.6+h*.5,1.4-f*.3,0);if(!frost)smoke(p,1,0x6a5240,.4,.8,.7,.3)});
    for(const side of [-1,1]){if(f<.12)continue;const q=p.clone().addScaledVector(perp,side*(.18+f*.32)).addScaledVector(dir,(rand()-.5)*.2);at(born+.035,()=>crystal(pal,q,h*(.45+rand()*.2),w*.62,.62+rand()*.25,perp.clone().multiplyScalar(side).addScaledVector(dir,.6).normalize(),{hold:hold+.02,chunks:1}))}}
   at(.92,()=>{flash(1,.8,.32);crack(B,c[1],3.6,1.3,1);knock(F,.4,.45);for(let i=0;i<16;i++){const a=i/16*6.28,r=1.05+rand()*.55,p=new T.Vector3(B.x+Math.cos(a)*r,0,B.z+Math.sin(a)*r);crystal(pal,p,.28+rand()*.22,.9+rand()*.6,1.25,new T.Vector3(Math.cos(a),0,Math.sin(a)),{grow:.1,hold:1.1,bits:false,chunks:0})}
    for(let i=0;i<11;i++){const a=i/11*6.28,r=.25+rand()*.45,p=new T.Vector3(B.x+Math.cos(a)*r,0,B.z+Math.sin(a)*r);crystal(pal,p,1.5+rand()*1.1,1.5+rand()*.7,.28+rand()*.32,new T.Vector3(Math.cos(a),0,Math.sin(a)).addScaledVector(dir,.3).normalize(),{grow:.11,hold:1+rand()*.1,melt:.38})}
    for(let i=0;i<20;i++)chunk(pal,new T.Vector3(B.x+(rand()-.5)*1.4,0,B.z+(rand()-.5)*1.4),1.6);fade(sprite(glowTex,gp(B.x,B.z,1.2),.5,{color:c[1]}),.35,6);
    if(frost){at(.85,()=>{smoke(A.clone().lerp(B,.6),10,0x9cc8ff,3,1.6,1.2,.2);embers(A.clone().lerp(B,.55),40,0xdff4ff,3.5,1.6)})}else{at(.9,()=>smoke(A.clone().lerp(B,.6),12,0x6a5240,3,1.6,1.4,.3))}})}},
 {id:10,n:'Mago da Terra',arma:'cajado',melee:false,dist:6.4,col:[0xfff0c0,0xffa040,0x8a3a08],pal:'stone',basic:'Rocha arremessada',skill:'Estaca de Pedra',
  b(){const c=this.col;[0,.45,.9].forEach((d,i)=>at(d,()=>{const a=hand(1.05);shot(a,tgt(),13,p=>{const m=new T.Mesh(GEOS[i+3],crystalMat('stone'));m.position.copy(p);m.scale.set(.6,.6,.6);scene.add(m);return m},(p)=>{for(let k=0;k<8;k++)chunk('stone',F.position,1.2);bits('stone',p,6);smoke(p,4,0x6a5240,.8,1,1,.35);sparks(p,8,c[1],3.5);crack(F.position,c[1],1.6,.5);knock(F,i===2?.45:.25);if(i===2)flash(.3,.5,.2)},{tumble:true,arcH:.6,trail:[.28,c,{len:10}]})}))},
  s(){RECIPES.find(k=>k.id===9).line('stone',this.col,false)}},
 {id:11,n:'Mago do Raio',arma:'cajado',melee:false,dist:5.8,col:[0xffffff,0xa8c0ff,0x5a3cff],pal:'arcane',extra:true,basic:'Faísca',skill:'Corrente de Raios',
  b(){const c=this.col;[0,.35,.7].forEach(d=>at(d,()=>{const a=hand(1.05);bolt(a,tgt(),c,{width:.14,life:.16});sparks(tgt(),12,c[1],5,3);fade(sprite(glowTex,tgt(),1,{color:c[1]}),.15,.5);knock(F,.2);flash(.15,.35,.05)}))},
  s(){const c=this.col;const hd=hand(1.05);fade(sprite(glowTex,hd,.2,{color:c[1]}),.4,4);for(let k=0;k<5;k++)at(k*.06,()=>bolt(hd,hd.clone().add(new T.Vector3((rand()-.5)*1.2,rand()*.9,(rand()-.5)*1.2)),c,{width:.06,life:.08,seg:5,jit:.2}));
   const chain=[hd,tgt(foes[0]),tgt(foes[1]),tgt(foes[2])];for(let i=0;i<3;i++)at(.32+i*.14,()=>{bolt(chain[i],chain[i+1],c,{width:.22,life:.32,seg:14,jit:.5});bolt(chain[i],chain[i+1],c,{width:.08,life:.26,seg:10,jit:.7});const f=foes[i];
    flash(.35,.7,.12);sparks(chain[i+1],20,c[1],6,3);ringFace(chain[i+1],c[1],.3,1.8,.3);ringFlat(f.position,c[1],.3,2.2,.35);crack(f.position,c[1],1.8,.6);knock(f,.35);
    for(let k=0;k<4;k++)at(.08+k*.07,()=>bolt(chain[i+1],chain[i+1].clone().add(new T.Vector3((rand()-.5)*1.4,(rand()-.3)*1.2,(rand()-.5)*1.4)),c,{width:.05,life:.07,seg:5,jit:.25}))})}},
 {id:21,n:'Monge',arma:'punhos',melee:true,col:[0xffffff,0xffc060,0xff6a10],pal:'gold',basic:'Rajada de socos',skill:'Chute Giratório',
  b(){const c=this.col;[0,.22,.44,.66,.95].forEach((d,i)=>at(d,()=>{const big=i===4;lunge(.4,S.dir,.12);const fist=hero.position.clone().addScaledVector(S.dir,.9).add(new T.Vector3(0,.95+(i%2?.12:-.05),0)).addScaledVector(new T.Vector3(-S.dir.z,0,S.dir.x),(i%2?.18:-.18));
   ringDir(fist.clone().addScaledVector(S.dir,big?.6:.3),S.dir,c[1],.2,big?2.2:1,.2);for(let k=0;k<(big?6:3);k++){const off=new T.Vector3((rand()-.5)*.6,(rand()-.5)*.5,(rand()-.5)*.6);const a=fist.clone().add(off),b=a.clone().addScaledVector(S.dir,1.4);const m=new T.Mesh(stripGeo([b,a],.05,false),ribMat(c,{mode:1,center:1,noise:.2,gain:1.4}));m.frustumCulled=false;scene.add(m);spawn(m,(o,dt,t)=>{o.material.uniforms.uFade.value=Math.max(0,1-t/.14);if(t>.14){kill(o);return false}return true})}
   at(.05,()=>meleeHit(c,this.pal,big))}))},
  s(){const c=this.col;const base=hero.position.clone();spawn(null,(o,dt,t)=>{const k=Math.min(1,t/.7);hero.position.y=Math.sin(k*Math.PI)*.9;hero.userData.inner.rotation.y=t*22;if(k>=1){hero.position.y=0;hero.userData.inner.rotation.y=0;return false}return true});
   for(let i=0;i<4;i++)at(.06+i*.13,()=>{for(const y of [.4,.9,1.4])slash(hero.position.clone().setY(hero.position.y+y),S.yaw+i*1.3,{col:c,r:1.1+y*.4,w:.5,arc:5.5,dur:.16,tail:1.3,fade:.22,noise:.8,ns:9,spd:9,gain:1.6});sparks(hero.position.clone().setY(1),8,c[1],6,2)});
   at(.25,()=>{meleeHit(c,this.pal,true);knock(F,.55,.5);ringFlat(base,c[1],1,5,.5);smoke(base,10,0xd8c0a0,2.4,1.1,1.2,.25)});at(.6,()=>{ringFlat(base,c[1],.6,3.5,.35);flash(.3,.5,.18)})}},
 {id:22,n:'Lâmina Arcana',arma:'espada arcana',melee:true,col:[0xffffff,0xff7ce0,0x8a20d0],pal:'magenta',basic:'Corte arcano',skill:'Salto Rúnico',
  b(){const c=this.col;[0,.42,.84].forEach((d,i)=>at(d,()=>{lunge(.35,S.dir,.18);const big=i===2;slash(hero.position.clone().setY(1),S.yaw,{col:c,r:1.3,w:big?.7:.5,arc:2.6,tilt:[.5,-.5,0][i],rev:i===1,dur:.15,ns:10});
   for(let k=0;k<(big?8:4);k++){const p=tgt().add(new T.Vector3((rand()-.5)*.8,(rand()-.3)*.8,(rand()-.5)*.8)),s=sprite(RUNE,p,.3,{color:c[1]});s.material.rotation=rand()*6;spawn(s,(o,dt,t)=>{o.position.y+=dt*.8;o.material.opacity=Math.max(0,1-t/.7);if(t>.7){kill(o);return false}return true})}
   at(.08,()=>{meleeHit(c,this.pal,big);if(big)rune(F.position,c[1],2.2,.7,3)})}))},
  s(){const c=this.col;const A=hero.position.clone(),to=F.position.clone().addScaledVector(S.dir,-1.1);rune(A,c[1],2,1,3);
   at(.25,()=>{for(let k=0;k<4;k++){const g=new T.Mesh(new T.CylinderGeometry(.42,.42,1.55,20),new T.MeshBasicMaterial({color:c[1],transparent:true,opacity:.35,blending:T.AdditiveBlending,depthWrite:false}));g.userData.ownGeo=true;g.position.copy(A.clone().lerp(to,k/4)).setY(.8);scene.add(g);spawn(g,(o,dt,t)=>{o.material.opacity=.35*Math.max(0,1-t/.4);if(t>.4){kill(o);return false}return true})}
    const m=new T.Mesh(stripGeo([to.clone().setY(.9),A.clone().setY(.9)],.9,false),ribMat(c,{mode:1,center:1,noise:.9,ns:8,spd:12}));m.frustumCulled=false;scene.add(m);spawn(m,(o,dt,t)=>{o.material.uniforms.uTime.value=time;o.material.uniforms.uFade.value=Math.max(0,1-t/.35);if(t>.35){kill(o);return false}return true});
    hero.position.copy(to);sparks(to.clone().setY(.9),14,c[1],5)});
   at(.36,()=>{slash(hero.position.clone().setY(1.3),S.yaw,{col:c,r:1.4,w:.85,arc:2.6,tilt:1.5,dur:.13,fade:.25,ns:10});at(.08,()=>{meleeHit(c,this.pal,true);rune(F.position,c[1],3.4,1,2.5);ringFlat(F.position,c[1],.5,4.5,.45);for(let k=0;k<14;k++){const p=tgt().add(new T.Vector3((rand()-.5)*1.4,rand()*1.2,(rand()-.5)*1.4)),s=sprite(RUNE,p,.35,{color:c[1]});spawn(s,(o,dt,t)=>{o.position.y+=dt;o.material.opacity=Math.max(0,1-t/.8);if(t>.8){kill(o);return false}return true})}})});
   at(1.5,()=>{hero.position.copy(A)})}},
 {id:23,n:'Lanceiro',arma:'lança',melee:true,dist:3.4,col:[0xffffff,0x5cffe8,0x0a7a9a],pal:'turq',basic:'Estocadas de lança',skill:'Salto do Dragão',
  b(){const c=this.col;[0,.38,.76].forEach((d,i)=>at(d,()=>{lunge(.5,S.dir,.16);const a=hand(1),b=a.clone().addScaledVector(S.dir,2.8);const m=new T.Mesh(stripGeo([b,a],.32,true),ribMat(c,{mode:1,center:1,noise:.7,ns:9,spd:14}));m.frustumCulled=false;scene.add(m);spawn(m,(o,dt,t)=>{o.material.uniforms.uTime.value=time;o.material.uniforms.uFade.value=Math.max(0,1-t/.2);if(t>.2){kill(o);return false}return true});
   for(let k=0;k<2;k++){const pts=[];for(let j=0;j<=20;j++){const f=j/20,an=f*12+k*Math.PI;const pp=a.clone().addScaledVector(S.dir,f*2.6).add(new T.Vector3(-S.dir.z*Math.cos(an)*.18,Math.sin(an)*.18,S.dir.x*Math.cos(an)*.18));pts.push(pp)}pts.reverse();const h=new T.Mesh(stripGeo(pts,.06,false),ribMat(c,{mode:1,center:1,noise:.2,gain:1.5}));h.frustumCulled=false;scene.add(h);spawn(h,(o,dt,t)=>{o.material.uniforms.uFade.value=Math.max(0,1-t/.22);if(t>.22){kill(o);return false}return true})}
   ringDir(tgt().addScaledVector(S.dir,.3),S.dir,c[1],.2,1.4,.2);at(.04,()=>meleeHit(c,this.pal,i===2))}))},
  s(){const c=this.col;const A=hero.position.clone(),L=F.position.clone().addScaledVector(S.dir,-.9);
   spawn(null,(o,dt,t)=>{const k=Math.min(1,t/.62);hero.position.lerpVectors(A,L,k);hero.position.y=Math.sin(k*Math.PI)*3.2*(1-k*.15);if(k>=1){hero.position.y=0;return false}return true});trail(()=>hero.position.y>.05||hero.position.distanceTo(A)<.1?hero.position.clone().setY(hero.position.y+.8):null,.5,c,{len:18});
   at(.62,()=>{flash(1,1,.38);const P=F.position.clone();ringFlat(P,c[1],.5,6,.5);ringFlat(P,0xffffff,.5,4,.35,.08);crack(P,c[1],4,1,1);knock(F,.6,.5);
    for(let k=0;k<3;k++)for(let j=0;j<3;j++)at(j*.05,()=>slash(P.clone().setY(.3+j*.55+k*.1),k*2.1+j*.6,{col:c,r:.9+j*.25,w:.4,arc:4,pitch:-.35,dur:.2,tail:1,fade:.25,ns:8}));
    for(let i=0;i<12;i++){const a=i/12*6.28;crystal('turq',P.clone().add(new T.Vector3(Math.cos(a)*1.5,0,Math.sin(a)*1.5)),.7+rand()*.6,1,.45,new T.Vector3(Math.cos(a),0,Math.sin(a)),{hold:.55,chunks:2})}sparks(P.clone().setY(.8),30,c[1],8,5);smoke(P,8,0x8ad0d0,2,1.1,1.2,.2)});
   at(1.6,()=>hero.position.copy(A))}},
 {id:24,n:'Berserker',arma:'machado',melee:true,col:[0xfff0e0,0xff3020,0x6a0008],pal:'red',basic:'Golpes brutais',skill:'Redemoinho de Aço',
  b(){const c=this.col;[0,.45,.9].forEach((d,i)=>at(d,()=>{lunge(.4,S.dir,.2);const big=i===2;slash(hero.position.clone().setY(1.05),S.yaw,{col:c,r:1.4,w:big?.95:.7,arc:2.4,tilt:[.6,-.6,1.5][i],rev:i===1,dur:.16,noise:1,ns:5,gain:1.4});
   at(.1,()=>{meleeHit(c,this.pal,big);embers(tgt(),10,0xff6a30,.6,.8);if(big){for(let k=0;k<8;k++)chunk('red',F.position,1.5);smoke(F.position,5,0x3a1a1a,1,1,1.1,.35)}})}))},
  s(){const c=this.col;const H=hero.position.clone();spawn(null,(o,dt,t)=>{hero.userData.inner.rotation.y=t*26;if(t>1.25){hero.userData.inner.rotation.y=0;return false}return true});
   for(let i=0;i<5;i++)at(i*.24,()=>{slash(hero.position.clone().setY(.85+((i%2)?.25:0)),S.yaw+i*1.7,{col:c,r:1.7,w:1,arc:6.283,dur:.2,tail:1.3,fade:.22,noise:.8,ns:5,gain:1.7});ringFlat(H,c[1],1,4,.3);
    for(let k=0;k<10;k++){const a=rand()*6.28,p=H.clone().add(new T.Vector3(Math.cos(a)*1.7,.9,Math.sin(a)*1.7)),s=sprite(starTex,p,.16,{color:0xffa060}),v=new T.Vector3(-Math.sin(a),0,Math.cos(a)).multiplyScalar(6);spawn(s,(o,dt,t)=>{o.position.addScaledVector(v,dt);o.material.opacity=Math.max(0,1-t/.3);if(t>.3){kill(o);return false}return true})}
    at(.1,()=>{meleeHit(c,this.pal,i===4);embers(tgt(),6,0xff6a30,.6,.8)})});
   at(.2,()=>crack(H,c[1],3,1.1,1));at(1.1,()=>{flash(.5,.7,.3);smoke(H,10,0x3a1a1a,2.4,1.2,1.3,.3)})}},
];


API.referenceRecipes=RECIPES;
API.fx={hexShield,random:()=>rand(),T,UP,GEOS,BLADE,PAL,crystalMat,ribMat,orb,bolt,shot,slash,trail,stripGeo,sparks,embers,smoke,chunk,bits,crystal,ringFlat,ringFace,ringDir,rune,crack,flash,knock,sprite,fade,glowTex,starTex,softTex,spawn,at,kill,add:addFX,pos:gp,ground,context,actor,inContext,faceCam};
API.releaseCast=impactCast;
API.releaseTarget=(c,e)=>{if(!c||c.cancelled)return;c.ready=true;const keep=[];for(const h of c.hits){if(h[0]===e)releaseHit({e:h[0],d:h[1],sk:h[2],region:c.region});else keep.push(h)}c.hits=keep;};

API.animationPlan=sk=>(API.on&&API.provider(sk)?.animationPlan?.(sk))||(API.handles(sk)?{clip:null,overlay:({0:'giro487',1:'cortes487',2:'escudo487'})[sk.sourceClass],duration:({0:.86,1:1.04,2:.96})[sk.sourceClass]}:null);
let activeSkill=null,lastRegion=null,trackedClass=null;
let castStates=new WeakMap(),statesById=new Map();
API.castState=sk=>sk&&(castStates.get(sk)||statesById.get(sk.skillId));
API.trackCast=(sk,c)=>{castStates.set(sk,c);statesById.set(sk.skillId,c);return c};
function skillContext(ci,e,pt,cast){const c=context(ci,e,pt);c.cast=cast;return c;}
function impactCast(c){if(!c||c.cancelled||c.ready)return;c.ready=true;c.releasing=true;const hits=c.hits.splice(0);for(const [e,d,sk]of hits)releaseHit({e,d,sk,region:c.region});c.releasing=false;}

API.withSkill=function(sk,fn){const prev=activeSkill,hs=window.hitstop,sh=window.shake;activeSkill=sk;try{if(API.handles(sk)){window.hitstop=()=>{};window.shake=()=>{}}return fn()}finally{activeSkill=prev;window.hitstop=hs;window.shake=sh}};
API.delayFor=sk=>!API.handles(sk)?0:API.provider(sk)?.delayFor?.(sk)??(sk.sourceClass===0?.27:sk.sourceClass===2?.44:.06);
API.pulseTimes=sk=>API.on?(API.provider(sk)?.pulseTimes?.(sk)||(API.handles(sk)&&sk.sourceClass===1?[.16,.26,.36,.46,.56,.8]:null)):null;
const originalPlay=VFX302.play;
// The entire old presentation is collision-only. The recipes above own the visible presentation.
VFX302.play=function(sk){if(API.handles(sk))return API.legacy(()=>originalPlay.apply(this,arguments),sk);return originalPlay.apply(this,arguments)};
const oldFluid=castFluid139;castFluid139=function(sk){if(!API.handles(sk))return oldFluid.apply(this,arguments);const f=floater;floater=function(x,z,txt,...a){if(txt==='RESSONÂNCIA TRIPLA')return;return f(x,z,txt,...a)};try{return API.legacy(()=>oldFluid.apply(this,arguments),sk)}finally{floater=f}};
const kitHit0=kitHit111;
kitHit111=function(e,d,sk){const old=activeSkill;activeSkill=API.handles(sk)?sk:null;try{if(API.handles(sk)&&activeCast&&!activeCast.ready&&!activeCast.releasing){activeCast.hits.push([e,d,{...sk}]);return d}const hp=e?.hp,r=kitHit0.apply(this,arguments);if(API.handles(sk)&&e?.hp<hp)API.provider(sk)?.hit?.(sk,e);return r}finally{activeSkill=old}};
let activeCast=null;const hitEvents=[];
function releaseHit(q){if(q.region!==L||!q.e||q.e.dead||!player||player.dead)return;const old=activeSkill;activeSkill=q.sk;try{const hp=q.e.hp;kitHit0(q.e,q.d,q.sk);API.stats.hits+=q.e.hp<hp?1:0}finally{activeSkill=old}}
function skillStart(sk,K,cast){const provider=API.provider(sk);if(provider){API.stats.skills++;return provider.start(sk,K,cast)}const ci=sk.sourceClass,targets=K.list.slice(),recipe=RECIPES.find(c=>c.id===ci);API.stats.skills++;if(ci===1){const list=targets.length?targets:[null];for(const e of list){const ctx=skillContext(ci,e,K.pt,cast);ctx.follow=e;ctx.followAt=e?{x:e.x,z:e.z}:null;inContext(ctx,()=>recipe.s())}}else inContext(skillContext(ci,targets[0]||null,K.pt,cast),()=>recipe.s())}
const originalKit=kitRun111;
kitRun111=function(sk){if(!API.handles(sk))return originalKit.apply(this,arguments);const K=VFX328.truth(sk);if(!K)return originalKit.apply(this,arguments);K.origin={x:player.x,z:player.z};K.alliesBefore=new Set(allies);const cast={hits:[],region:L,releasing:false,ready:!!API.provider(sk)?.immediate?.(sk),cancelled:false},prev=activeCast;castStates.set(sk,cast);statesById.set(sk.skillId,cast);activeCast=cast;activeSkill=sk;let result;try{result=API.legacy(()=>originalKit.apply(this,arguments))}finally{activeCast=prev;activeSkill=null}
 skillStart(sk,{...K,list:cast.hits.length?[...new Set(cast.hits.map(h=>h[0]))]:K.list},cast);return result};
API.replacesHit=o=>{
 if(!API.on||!o)return false;
 if(o.summonVfx487)return true;
 if(!o.fromPlayer||o.pet||o.passive||o.dot||o.tick)return false;
 if(o.skillHit)return API.handles(activeSkill||o.skillVfx487||o.fx487?.sk);
 const ci=o.basicClass??o.basicVfx487??o.fx487?.ci??profile.cls;
 return [0,1,2].includes(ci)||API.providers.some(p=>p.basic(ci)&&(!p.replacesBasic||p.replacesBasic(o)));
};
const H=hurtEnemy;
hurtEnemy=function(e,amt,sx,sz,o){const hp=e&&e.hp,owns=API.replacesHit(o),hs=window.hitstop,sh=window.shake;let r;try{if(owns){window.hitstop=()=>{};window.shake=()=>{}}r=H.apply(this,arguments)}finally{window.hitstop=hs;window.shake=sh}if(API.replacesHit(o)&&!o.skillHit&&[0,1,2].includes(o.basicClass??o.basicVfx487??o.fx487?.ci??profile.cls)&&e&&e.hp<hp){const ci=o.basicClass??o.basicVfx487??o.fx487?.ci??profile.cls,c=COLORS[ci],ctx=context(ci,e);inContext(ctx,()=>{if(ci===1){const p=tgt();sparks(p,10,0xff3050,3.5,7,.14);sparks(p,6,c[1],4);slash(p.clone(),S.yaw,{col:c,r:.45,w:.3,arc:2,tilt:.8,dur:.08,fade:.12});knock(F,.2)}else{meleeHit(c,PALS[ci],!!o.third);if(ci===2&&o.third){ringFlat(F.position,c[1],.5,4,.4);for(let k=0;k<8;k++)chunk('steel',F.position,1.4)}}});API.stats.hits++}return r};
const originalImpact504=projectileImpact253;projectileImpact253=function(p){if(!API.replacesHit(p)&&!API.projectile(p))return originalImpact504.apply(this,arguments);const args=arguments,self=this;return API.legacy(()=>originalImpact504.apply(self,args),p?.fx487?.sk||null)};
const oldSlash=fxSlash;
fxSlash=function(x,z,a,c,r,big,ci,footY){if(!API.on||![0,1,2].includes(ci))return oldSlash.apply(this,arguments);const ctx=context(ci,null,{x,z}),i=big?2:Math.max(0,(player.combo||1)-1)%3;ctx.hero.position=gp(x,z,footY||0);ctx.S={dir:new T.Vector3(Math.sin(a),0,Math.cos(a)),yaw:a};inContext(ctx,()=>{lunge(ci===2?.3:.35,S.dir,ci===2?.22:.18);slash(hero.position.clone().setY(ci===2?1.2:big?1.1:.95),S.yaw,{col:COLORS[ci],r:ci===2?1.25:1.35,w:ci===2?(big?.85:.65):(big?.7:.5),arc:ci===2?2:2.5,tilt:ci===2?1.5:i===0?.35:i===1?-.4:1.45,rev:i===1,dur:ci===2?.17:.15})});API.stats.basics++};
// Replace each real dagger's drawing, never its physics or its collision mesh/radius.
const tracked=new Map();
function projectiles(){for(const p of projs){if(p.team!=='player'||p.skillHit||![0,1,2].includes(p.basicClass??profile.cls)||p.ptype!=='tdagger'||tracked.has(p))continue;const ci=p.basicClass??profile.cls,m=new T.Mesh(BLADE,crystalMat(PALS[ci]));m.scale.setScalar(.95);addFX(m);p.mesh.layers.set(31);p.mesh.traverse(o=>o.layers.set(31));tracked.set(p,m);trail(()=>projs.includes(p)?new T.Vector3(p.x,p.y,p.z):null,.18,COLORS[ci]);spawn(m,(o,dt,t)=>{if(!projs.includes(p)||t>3){tracked.delete(p);kill(o);return false}o.position.set(p.x,p.y,p.z);o.quaternion.setFromUnitVectors(UP,new T.Vector3(p.vx,p.vy||0,p.vz).normalize());o.material.uniforms.uTime.value=time;return true})}}
function clear(){for(const p of API.providers)p.clear?.();if(window.Anim303?.A?.[Anim303.active()]?.mage488)Anim303.stop();if(/^(giro|cortes|escudo)487$/.test(window.Anim303?.active?.()||''))Anim303.stop();for(const [p,m]of tracked){if(p.mesh)p.mesh.traverse(o=>o.layers.set(0))}for(const l of live)kill(l.obj);live=[];activeEntries.clear();tracked.clear();poses.clear();for(const c of statesById.values()){c.cancelled=true;c.ready=true;c.hits.length=0}castStates=new WeakMap();statesById=new Map();hitEvents.length=0;rand=rng((profile?.cls||0)+1);shakeT=0;flashV=bloomKick=0;API.errors.length=0}
API.clear=clear;Object.defineProperty(API,'live',{get:()=>live.length});
function step(dt){pruneLegacy504();if(lastRegion!==L||trackedClass!==profile?.cls){clear();lastRegion=L;trackedClass=profile?.cls}if(!API.on){if(live.length)clear();return}time+=dt;for(const p of API.providers)p.update?.(dt);for(let i=hitEvents.length-1;i>=0;i--){const q=hitEvents[i];q.left-=dt;if(q.left<=1e-8){hitEvents.splice(i,1);releaseHit(q)}}projectiles();const batch=live.slice().reverse();for(const l of batch){if(!activeEntries.has(l))continue;l.t+=dt;try{if(l.obj?.userData.dead487||l.t>l.maxAge||inContext(l.ctx,()=>l.update(l.obj,dt,l.t))===false){kill(l.obj);activeEntries.delete(l)}}catch(e){API.errors.push(String(e));console.error('golpes487',e);kill(l.obj);activeEntries.delete(l)}}live=live.filter(l=>activeEntries.has(l));for(const [e,p]of poses)if((!e?.m?.root)||(p.offset.lengthSq()<1e-12&&Math.abs(p.rot.x)+Math.abs(p.rot.z)<1e-12))poses.delete(e);shakeT=Math.max(0,shakeT-dt);flashV=Math.max(0,flashV-dt*6);bloomKick=Math.max(0,bloomKick-dt*5)}
API.update=step;
const cam0=camUpdate;camUpdate=function(){step(typeof ADT==='number'?ADT:0);return cam0.apply(this,arguments)};
// All legacy asynchronous callbacks created inside a migrated recipe retain the collision-only layer.
// Composer uses its own RenderPass; the loop calls this entry point exactly once per rendered game frame.
let composer=null,bloom=null,lastW=0,lastH=0,lastRatio=0,quad=null;
const decalPoint=new T.Vector3();
function conformGround(){for(const l of live){const m=l.obj;if(!m?.userData.groundDecal487||!m.geometry)continue;m.updateMatrixWorld(true);const a=m.geometry.attributes.position;for(let i=0;i<a.count;i++){decalPoint.set(a.getX(i),a.getY(i),0).applyMatrix4(m.matrixWorld);a.setZ(i,(ground(decalPoint.x,decalPoint.z)+m.userData.groundDecal487-m.position.y)/Math.max(.0001,m.scale.z));}a.needsUpdate=true;}}
const draw0=function(){
 pruneLegacy504(true);
 conformGround();
 syncPools();renderer.render(scene,camera);
 if(!API.on||!API.bloomOn||lite()||!T.EffectComposer||!live.some(l=>l.obj&&l.obj.parent&&l.obj.visible))return;
 if(!composer){composer=new T.EffectComposer(renderer);composer.renderToScreen=false;composer.addPass(new T.RenderPass(scene,camera));bloom=new T.UnrealBloomPass(new T.Vector2(512,512),.85,.45,.72);composer.addPass(bloom);quad=new T.FullScreenQuad(new T.ShaderMaterial({uniforms:{t:{value:null}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:'uniform sampler2D t;varying vec2 v;void main(){gl_FragColor=vec4(texture2D(t,v).rgb,1.);}',blending:T.AdditiveBlending,transparent:true,depthTest:false,depthWrite:false,toneMapped:false}))}
 const size=renderer.getSize(new T.Vector2()),ratio=Math.min(API.bloomScale,renderer.getPixelRatio());if(size.x!==lastW||size.y!==lastH||ratio!==lastRatio){composer.setPixelRatio(ratio);composer.setSize(size.x,size.y);lastW=size.x;lastH=size.y;lastRatio=ratio}
 const materials=new Map(),hidden=[],masked=[],bg=scene.background,fog=scene.fog,encoding=renderer.outputEncoding,auto=renderer.autoClear;
 const visit=(o,isFX=false)=>{if(API.optimizeBloomDepth&&!o.visible)return;isFX=isFX||!!o.userData.golpes487;if(!isFX){if(o.isMesh){const mats=[].concat(o.material);if(API.optimizeBloomDepth&&mats.every(m=>!m.depthWrite)){masked.push([o,o.layers.mask]);o.layers.mask=0}else for(const m of mats){if(!materials.has(m)){materials.set(m,m.colorWrite);m.colorWrite=false}}}else if(o.isSprite||o.isPoints||o.isLine){if(o.visible){hidden.push(o);o.visible=false}}}for(const c of o.children)visit(c,isFX)};
 try{visit(scene);scene.background=new T.Color(0);renderer.outputEncoding=T.LinearEncoding;bloom.strength=.85+bloomKick*1.2;composer.render();}
 finally{for(const [o,mask]of masked)o.layers.mask=mask;API.stats.depthSkipped=masked.length;for(const [m,cw]of materials)m.colorWrite=cw;for(const o of hidden)o.visible=true;scene.background=bg;scene.fog=fog;renderer.outputEncoding=encoding}
 // Add only the blurred glow (not the crisp FX image, already drawn in the base pass).
 quad.material.uniforms.t.value=bloom.renderTargetsHorizontal[0].texture;
 try{renderer.autoClear=false;renderer.setRenderTarget(null);quad.render(renderer)}finally{renderer.autoClear=auto}
};

const flashEl=document.createElement('div');flashEl.style.cssText='position:fixed;inset:0;pointer-events:none;opacity:0;z-index:2;background:radial-gradient(circle at 55% 45%,rgba(255,255,255,.9),rgba(160,210,255,.3) 45%,rgba(60,120,255,0) 75%)';document.body.appendChild(flashEl);
API.render=function(){const restore=[],cp=camera.position.clone(),cq=camera.quaternion.clone();const fxRestore=[];for(const l of live){const o=l.obj;if(o?.parent===scene&&l.ctx?.follow){fxRestore.push([o,o.position.clone()]);o.position.add(followOffset(l.ctx));o.updateMatrixWorld(true)}}for(const [e,p]of poses){const root=e?.m?.root;if(!root)continue;restore.push([root,root.position.clone(),root.rotation.clone()]);root.position.add(p.offset);root.rotation.x+=p.rot.x;root.rotation.z+=p.rot.z;root.updateMatrixWorld(true)}if(shakeT>0){const aim=cp.clone().add(camera.getWorldDirection(new T.Vector3()).multiplyScalar(10));camera.position.x+=(Math.random()-.5)*shakeT*.5;camera.position.y+=(Math.random()-.5)*shakeT*.5;camera.lookAt(aim)}flashEl.style.opacity=matchMedia('(prefers-reduced-motion: reduce)').matches?'0':String(flashV*.45);try{for(const provider of API.providers)provider.beforeRender?.();return draw0()}finally{for(const provider of API.providers)provider.afterRender?.();for(const [o,p]of fxRestore){o.position.copy(p);o.updateMatrixWorld(true)}for(const [root,p,r]of restore){root.position.copy(p);root.rotation.copy(r);root.updateMatrixWorld(true)}camera.position.copy(cp);camera.quaternion.copy(cq)}};
// Compile the visual programs while entering the world, not during the first attack.
const warmMaterials=new Set();let warmed=false;
API.prewarm=function(){if(warmed||!API.on)return;warmed=true;lastRegion=L;trackedClass=profile.cls;
 const saved={...API.stats},p=pos(player.x,player.z),c=COLORS[0];
 slash(p.clone().add(new T.Vector3(0,1,0)),0,{col:c,r:1,w:.4});crystal('gold',p,.4,.4,0,UP,{chunks:0,bits:false});hexShield(p,new T.Vector3(0,0,1),COLORS[2],.2,null);sparks(p,1,c[1]);
 for(const provider of API.providers)provider.prewarm?.();
 for(const l of live)if(l.obj)l.obj.traverse(o=>{if(o.material)for(const m of [].concat(o.material)){m.userData.warm487=true;warmMaterials.add(m)}});
 step(.1);try{API.render()}finally{clear();Object.assign(API.stats,saved);renderer.render(scene,camera)}
};
const start0=startGame;startGame=function(){const was=started,r=start0.apply(this,arguments);if(!was&&started)API.prewarm();return r};
})();
