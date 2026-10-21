/* v245: relevo do mundo. Chão acompanha o terreno; modelos recebem altura constante no ponto de apoio
   (chão, árvores, prédios, personagens). Cidades, estradas e lagos ficam planos; rios correm em vales.
   A lógica do jogo continua em y=0; a câmera, a mira e os rótulos somam terrH(x,z). */
(function(){const T=THREE;
 const TER=window.TER245={TF:{value:Array.from({length:48},()=>new T.Vector4(0,0,0,0))},TFN:{value:0},on:{value:0},MT:{value:new T.Vector4(40,1,0,0)},D:{value:Array.from({length:16},()=>new T.Vector4(0,0,-1,0))},R:{value:Array.from({length:24},()=>new T.Vector4(0,0,0,0))},OW:{value:new T.Vector4(0,185,7,0)},OWB:{value:new T.Vector4(0,0,0,0)}};
 const P=30*64*2,H0=30*64*.5,RW=11;
 /* v513 (Ian): serras feitas à mão que dividem o mapa em regiões (como Skyrim), com passagens onde a estrada cruza. */
 const RIDGE513=[[[-3700,-2350],[-2700,-2150],[-1800,-2000],[-900,-2150],[0,-2150],[900,-2100],[2000,-1900],[2900,-2150],[3700,-2450]],
  [[2000,-1900],[1750,-1100],[1850,-400],[1820,0],[1700,500],[1800,1000]],
  [[-3100,2550],[-2200,2250],[-1300,2150],[-500,2050],[0,2050],[500,2100],[1300,2550]],
  [[-2600,-1900],[-2350,-1100],[-2400,-400],[-2400,0],[-2450,500],[-2650,1200],[-2900,1800]]];
 const GAP513=[[0,-2150,220],[1820,0,220],[0,2050,220],[-2400,0,240]],RH513=170,RW513=230;
 const RSEG513=[];for(const L of RIDGE513)for(let i=1;i<L.length;i++)RSEG513.push([L[i-1][0],L[i-1][1],L[i][0],L[i][1]]);
 const f1=v=>v.toFixed(1);
 const GL513='float sd513(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h);}\nfloat ridge513(vec2 p){float d=1e9;'+RSEG513.map(r=>'d=min(d,sd513(p,vec2('+f1(r[0])+','+f1(r[1])+'),vec2('+f1(r[2])+','+f1(r[3])+')));').join('')+
  'float t=d/'+f1(RW513)+';if(t>=1.)return 0.;float f=1.-smoothstep(.35,1.,t);float n=.72+.28*sin(p.x*.004+sin(p.y*.003)*2.)*sin(p.y*.0047+p.x*.001);float cr=1.-abs(sin(p.x*.013+sin(p.y*.009)*1.7)*sin(p.y*.012-p.x*.005));float h='+f1(RH513)+'*f*n*(.8+.2*cr*cr);'+
  GAP513.map(g=>'h*=smoothstep('+f1(g[2]*.36)+','+f1(g[2])+',length(p-vec2('+f1(g[0])+','+f1(g[1])+')));').join('')+'return h;}\n';const SEAX=-4100,SEAY=-.9; /* v439: costa do mar (x) e nível do mar (y absoluto) */
 const GL=`uniform float uTerOn;uniform float uTerHeight245;uniform vec2 uTerAnchor245;uniform float uTerBatch245;uniform float uTerAbsolute245;attribute vec2 terrainAnchor245;uniform vec4 uTerD[16];uniform vec4 uTerR[24];uniform vec4 uMt383;uniform vec4 uTF444[48];uniform float uTFN444;uniform vec4 uOW460;uniform vec4 uOWB460;
/* v461 (Ian): relevo do Outro Mundo dentro da Fenda — infinito, sem borda: colinas + cordilheiras em crista; chegada e Cidadela planas. Igual ao TER.owH460 do CPU. */
float owH460(vec2 p){float s=uOW460.w,A=uOW460.z,M=uOW460.y;
 float h=A*(.62*sin(p.x*.0185+sin(p.y*.0113+s)*1.6)*sin(p.y*.0161+sin(p.x*.0093+s*1.7)*1.3)+.30*sin(p.x*.047+p.y*.029+s*2.3)*sin(p.y*.041-p.x*.023+s)+.08*sin(p.x*.13+p.y*.09)*sin(p.y*.11-p.x*.07));
 float m=smoothstep(.15,.65,sin(p.x*.0031+sin(p.y*.0023+s)*1.7)*sin(p.y*.0027+sin(p.x*.0019-s)*1.5));
 float r1=1.-abs(sin(p.x*.011+sin(p.y*.008+s)*1.6)*sin(p.y*.012-p.x*.004)),r2=1.-abs(sin(p.x*.029+p.y*.007)*sin(p.y*.025-p.x*.010+s));
 h+=M*m*(r1*r1*.7+r2*r2*.3);
 return h*smoothstep(6.,22.,length(p-uOWB460.xy))*smoothstep(26.,50.,length(p-uOWB460.zw));}
float mt383(vec2 p){if(uMt383.x<=0.)return 0.;vec2 q=p*uMt383.y;float m=smoothstep(.12,.55,sin(q.x*.0017+sin(q.y*.0023)*1.9)*sin(q.y*.0014+sin(q.x*.0011)*1.4));if(m<=0.)return 0.;
 float r1=1.-abs(sin(q.x*.012+sin(q.y*.009)*1.6)*sin(q.y*.013-q.x*.004));float r2=1.-abs(sin(q.x*.031+q.y*.008)*sin(q.y*.027-q.x*.011));float r3=1.-abs(sin(q.x*.071-q.y*.02)*sin(q.y*.063+q.x*.017));
 return uMt383.x*m*(r1*r1*.65+r2*r2*.27+r3*r3*.08);}
/* v439 (Ian): o mar a oeste de Thalor — praia, recifes, alto-mar e fossas. Igual ao seaD439/seaBed439 do CPU. */
/* v500 (Ian): mapa finito de 10 km — mar no oeste (Thalor), no leste (além de Zahar) e no sul (além de Urdan); cordilheira de gelo no norte. Igual ao CPU. */
float seaD439(vec2 p){float w=${SEAX.toFixed(1)}+150.*sin(p.y*.0009)+60.*sin(p.y*.0031+1.3)+20.*sin(p.y*.011)-p.x;float e=p.x-4250.-140.*sin(p.y*.0011+2.)-50.*sin(p.y*.0037);float s=p.y-4300.-150.*sin(p.x*.0010+.7)-55.*sin(p.x*.0029+1.9);return max(w,max(e,s));}
float ice500(vec2 p){float k=1.-smoothstep(-4550.,-3950.,p.y+90.*sin(p.x*.0013));if(k<=0.)return 0.;float r1=1.-abs(sin(p.x*.0061+sin(p.y*.004)*1.6)*sin(p.y*.0072-p.x*.002)),r2=1.-abs(sin(p.x*.019+p.y*.006)*sin(p.y*.017-p.x*.008));return k*(70.+150.*(r1*r1*.7+r2*r2*.3));}
float seaBed439(vec2 p,float d){float b=d<60.?mix(1.2,-3.,(d+60.)/120.):d<450.?mix(-3.,-7.,(d-60.)/390.):mix(-7.,-22.,clamp((d-450.)/1200.,0.,1.));
 b+=2.6*max(0.,sin(p.x*.06+sin(p.y*.05)*2.)*sin(p.y*.055+sin(p.x*.04)*1.5)-.2)*smoothstep(40.,120.,d)*(1.-smoothstep(380.,500.,d));
 if(d>800.){float t=1.-abs(sin(p.x*.0042+sin(p.y*.0027)*2.1)*sin(p.y*.0036-p.x*.0011));b-=42.*smoothstep(.86,.97,t)*smoothstep(800.,1000.,d);}
 return b+.6*sin(p.x*.13+p.y*.07)*sin(p.y*.11-p.x*.05);}
/* v456: terraplenagem desativada — relevo natural de Aster e das 5 Capitais 100% protegido. */
float terra444(vec2 p,float h){return h;}
float path444(vec2 p){return 0.;}
${GL513}float terrH245(vec2 p){if(uTerOn<.5)return 0.;if(uOW460.x>.5)return owH460(p);float m=.62+.38*sin(p.x*.0021+1.)*sin(p.y*.0017+.4);
 float h=(15.*sin(p.x*.011+sin(p.y*.0061)*1.7)*sin(p.y*.0093+sin(p.x*.0047)*1.3)+5.*sin(p.x*.031+p.y*.017)*sin(p.y*.027-p.x*.012)+1.2*sin(p.x*.09+p.y*.05))*m+mt383(p)+ice500(p)+ridge513(p);
 float b=floor((p.x-${H0.toFixed(1)})/${P.toFixed(1)}+.5),c=b*${P.toFixed(1)}+${H0.toFixed(1)}+sin(p.y*.0043+b*1.7)*95.+sin(p.y*.011+b)*28.+sin(p.y*.035+b*2.3)*18.+sin(p.y*.079+b*3.1)*5.;
 float rw=5.5*(1.+.22*sin(p.y*.047+b*1.3)+.12*sin(p.y*.113+b*2.7));float rdx=abs(p.x-c);h=mix(h,-2.4,1.-smoothstep(rw,rw+7.,rdx));if(rdx<rw)h-=2.2*(1.-rdx*rdx/(rw*rw));
 float sd=seaD439(p);if(sd>-60.)h=mix(h,seaBed439(p,sd),smoothstep(-60.,30.,sd));float rk439=1.-smoothstep(300.,600.,sd);
 for(int i=0;i<16;i++){vec4 D=uTerD[i];if(D.z<0.)continue;float dd=length(p-D.xy);h=mix(h,D.w,1.-smoothstep(D.z,D.z+38.,dd));if(D.w<0.){float rr=D.z-3.;if(dd<rr)h-=2.5*(1.-dd*dd/(rr*rr));}}
 for(int i=0;i<24;i++){vec4 R=uTerR[i];h=mix(h,0.,(1.-smoothstep(5.,22.,sd513(p,R.xy,R.zw)))*rk439);}
 float gc510=smoothstep(100.,260.,p.y)*(130.*sin(p.y*.0057120)+52.*sin(p.y*.013369)+18.*sin(p.y*.033069));float gx510=abs(p.x-gc510);float gz510=smoothstep(78.,118.,p.y)*(1.-smoothstep(500.,560.,p.y));float gm510=.3+.7*smoothstep(-.2,.55,sin(p.y*.011+1.));float ga510=smoothstep(8.,23.,gx510);
 h+=gz510*gm510*ga510*(17.+4.*sin(p.y*.045+sign(p.x)*1.3))*(1.+.16*sin(p.y*.21+p.x*.11)+.09*sin(p.y*.47-p.x*.23)+.05*sin(p.y*.97+p.x*.41));
 return h;}
`;
 /* v391 (Ian): rios e lagos têm leito cavado (fundo em U de 2,2 m / bacia de 2,5 m) e margens mais íngremes. */
 /* v383 (vídeo André Elias): cordilheiras por ruído suave com cristas (ridged), iguais no CPU e no shader. */
 function mt383(x,z){const M=TER.MT.value;if(M.x<=0)return 0;const S=Math.sin,qx=x*M.y,qz=z*M.y,v=S(qx*.0017+S(qz*.0023)*1.9)*S(qz*.0014+S(qx*.0011)*1.4),t=Math.min(1,Math.max(0,(v-.12)/(.55-.12))),m=t*t*(3-2*t);if(m<=0)return 0;
  const r1=1-Math.abs(S(qx*.012+S(qz*.009)*1.6)*S(qz*.013-qx*.004)),r2=1-Math.abs(S(qx*.031+qz*.008)*S(qz*.027-qx*.011)),r3=1-Math.abs(S(qx*.071-qz*.02)*S(qz*.063+qx*.017));
  return M.x*m*(r1*r1*.65+r2*r2*.27+r3*r3*.08)}
 TER.mt383=mt383;
 function terra444cpu(x,z,h){return h}
 TER.path444=function(){return 0};
 function seaD439(x,z){const S=Math.sin,w=SEAX+150*S(z*.0009)+60*S(z*.0031+1.3)+20*S(z*.011)-x,e=x-4250-140*S(z*.0011+2)-50*S(z*.0037),s=z-4300-150*S(x*.0010+.7)-55*S(x*.0029+1.9);return Math.max(w,e,s)}
 function ice500(x,z){const S=Math.sin,t=Math.min(1,Math.max(0,(z+90*S(x*.0013)+4550)/600)),k=1-t*t*(3-2*t);if(k<=0)return 0;const r1=1-Math.abs(S(x*.0061+S(z*.004)*1.6)*S(z*.0072-x*.002)),r2=1-Math.abs(S(x*.019+z*.006)*S(z*.017-x*.008));return k*(70+150*(r1*r1*.7+r2*r2*.3))}
 TER.ice500=ice500;
 const sdc513=(x,z,ax,az,bx,bz)=>{const px=x-ax,pz=z-az,dx=bx-ax,dz=bz-az,l=dx*dx+dz*dz,h=l?Math.min(1,Math.max(0,(px*dx+pz*dz)/l)):0;return Math.hypot(px-dx*h,pz-dz*h)};
 function ridge513(x,z){let d=1e9;for(const r of RSEG513){const v=sdc513(x,z,r[0],r[1],r[2],r[3]);if(v<d)d=v}const t=d/RW513;if(t>=1)return 0;const S=Math.sin,ss=(a,b,v)=>{const q=Math.min(1,Math.max(0,(v-a)/(b-a)));return q*q*(3-2*q)};
  const f=1-ss(.35,1,t),n=.72+.28*S(x*.004+S(z*.003)*2)*S(z*.0047+x*.001),cr=1-Math.abs(S(x*.013+S(z*.009)*1.7)*S(z*.012-x*.005));let h=RH513*f*n*(.8+.2*cr*cr);
  for(const g of GAP513)h*=ss(g[2]*.36,g[2],Math.hypot(x-g[0],z-g[1]));return h}
 TER.ridge513=ridge513;TER.RIDGE513=RIDGE513;TER.GAP513=GAP513;TER.sd513=sdc513;
 function seaBed439(x,z,d){const S=Math.sin,ss=(a,b,v)=>{const t=Math.min(1,Math.max(0,(v-a)/(b-a)));return t*t*(3-2*t)},mix=(a,b,k)=>a+(b-a)*k;
  let b=d<60?mix(1.2,-3,(d+60)/120):d<450?mix(-3,-7,(d-60)/390):mix(-7,-22,Math.min(1,Math.max(0,(d-450)/1200)));
  b+=2.6*Math.max(0,S(x*.06+S(z*.05)*2)*S(z*.055+S(x*.04)*1.5)-.2)*ss(40,120,d)*(1-ss(380,500,d));
  if(d>800){const t=1-Math.abs(S(x*.0042+S(z*.0027)*2.1)*S(z*.0036-x*.0011));b-=42*ss(.86,.97,t)*ss(800,1000,d)}
  return b+.6*S(x*.13+z*.07)*S(z*.11-x*.05)}
 TER.SEA439={X:SEAX,Y:SEAY,d:seaD439,bed:seaBed439};
 TER.owH460=function(x,z){const S=Math.sin,O=TER.OW.value,B=TER.OWB.value,s=O.w,A=O.z,M=O.y,ss=(a,b,v)=>{const t=Math.min(1,Math.max(0,(v-a)/(b-a)));return t*t*(3-2*t)};
  let h=A*(.62*S(x*.0185+S(z*.0113+s)*1.6)*S(z*.0161+S(x*.0093+s*1.7)*1.3)+.30*S(x*.047+z*.029+s*2.3)*S(z*.041-x*.023+s)+.08*S(x*.13+z*.09)*S(z*.11-x*.07));
  const m=ss(.15,.65,S(x*.0031+S(z*.0023+s)*1.7)*S(z*.0027+S(x*.0019-s)*1.5)),r1=1-Math.abs(S(x*.011+S(z*.008+s)*1.6)*S(z*.012-x*.004)),r2=1-Math.abs(S(x*.029+z*.007)*S(z*.025-x*.010+s));
  h+=M*m*(r1*r1*.7+r2*r2*.3);
  return h*ss(6,22,Math.hypot(x-B.x,z-B.y))*ss(26,50,Math.hypot(x-B.z,z-B.w))};
 window.terrH=function(x,z){if(!TER.on.value)return 0;if(TER.OW.value.x>.5)return TER.owH460(x,z);const S=Math.sin,m=.62+.38*S(x*.0021+1)*S(z*.0017+.4);
  let h=(15*S(x*.011+S(z*.0061)*1.7)*S(z*.0093+S(x*.0047)*1.3)+5*S(x*.031+z*.017)*S(z*.027-x*.012)+1.2*S(x*.09+z*.05))*m+mt383(x,z)+ice500(x,z)+ridge513(x,z);
  const ss=(a,b,v)=>{const t=Math.min(1,Math.max(0,(v-a)/(b-a)));return t*t*(3-2*t)},mix=(a,b,k)=>a+(b-a)*k;
  const b=Math.floor((x-H0)/P+.5),c=b*P+H0+S(z*.0043+b*1.7)*95+S(z*.011+b)*28+S(z*.035+b*2.3)*18+S(z*.079+b*3.1)*5;{const rw=(RW*(1+.22*S(z*.047+b*1.3)+.12*S(z*.113+b*2.7)))/2,rdx=Math.abs(x-c);h=mix(h,-2.4,1-ss(rw,rw+7,rdx));if(rdx<rw)h-=2.2*(1-rdx*rdx/(rw*rw))}
  const sd=seaD439(x,z);if(sd>-60)h=mix(h,seaBed439(x,z,sd),ss(-60,30,sd));const rk439=1-ss(300,600,sd);
  for(const D of TER.D.value){if(D.z<0)continue;const dd=Math.hypot(x-D.x,z-D.y);h=mix(h,D.w,1-ss(D.z,D.z+38,dd));if(D.w<0){const rr=D.z-3;if(dd<rr)h-=2.5*(1-dd*dd/(rr*rr))}}
  for(const R of TER.R.value){h=mix(h,0,(1-ss(5,22,sdc513(x,z,R.x,R.y,R.z,R.w)))*rk439)}
  {/* v520: desfiladeiro do Marco Zero, segue a estrada sinuosa (mundo513.js) e abre/fecha; igual ao GLSL */const gc=ss(100,260,z)*(130*S(z*.005712)+52*S(z*.013369)+18*S(z*.033069)),gx=Math.abs(x-gc),gz=ss(78,118,z)*(1-ss(500,560,z)),gm=.3+.7*ss(-.2,.55,S(z*.011+1)),ga=ss(8,23,gx);h+=gz*gm*ga*(17+4*S(z*.045+Math.sign(x)*1.3))*(1+.16*S(z*.21+x*.11)+.09*S(z*.47-x*.23)+.05*S(z*.97+x*.41))}
  return terra444cpu(x,z,h)};

 const C=T.ShaderChunk;
 TER.height={value:0};TER.anchor={value:new T.Vector2()};TER.batch={value:0};TER.absolute={value:0};
 const roots=new WeakMap();
 TER.rootFor=function(o){let r=o;while(r.parent&&!r.parent.isScene&&!r.parent.userData.terrainContainer245){if(r.userData.terrainRoot245)break;r=r.parent}return r};
 const heightCache348=new WeakMap();let heightFrame348=0;
 TER.heightFor=function(o){const r=TER.rootFor(o),e=r.matrixWorld.elements,x=e[12],z=e[14],c=heightCache348.get(r);if(c&&c.frame===heightFrame348&&c.x===x&&c.z===z)return c.h;const h=window.terrH(x,z);heightCache348.set(r,{frame:heightFrame348,x,z,h});return h};
 // CPU visibility tests must use the same height as the vertex shader.
 const sphere245=new T.Sphere(),intersectsObject245=T.Frustum.prototype.intersectsObject,intersectsSprite245=T.Frustum.prototype.intersectsSprite;
 T.Frustum.prototype.intersectsObject=function(o){if(!TER.on.value||!o.geometry)return intersectsObject245.call(this,o);const r=TER.rootFor(o);if(o.userData.terrainAbsolute245||r.userData.terrainAbsolute245)return intersectsObject245.call(this,o);
  const g=o.geometry;if(!g.boundingSphere)g.computeBoundingSphere();sphere245.copy(g.boundingSphere).applyMatrix4(o.matrixWorld);
  if(g.attributes.terrainAnchor245||g.attributes.terrainRoad128||g.attributes.terrainBio131){const ic=TER.ice500(sphere245.center.x,sphere245.center.z)+TER.ridge513(sphere245.center.x,sphere245.center.z);sphere245.radius+=24+ic*.7;sphere245.center.y+=ic*.5}/* v500: cordilheira de gelo passa de 200 m */else sphere245.center.y+=TER.heightFor(o);
  return this.intersectsSphere(sphere245);
 };
 T.Frustum.prototype.intersectsSprite=function(o){if(!TER.on.value)return intersectsSprite245.call(this,o);const r=TER.rootFor(o);if(o.userData.terrainAbsolute245||r.userData.terrainAbsolute245)return intersectsSprite245.call(this,o);sphere245.center.set(0,0,0);sphere245.radius=.7071067811865476;sphere245.applyMatrix4(o.matrixWorld);sphere245.center.y+=TER.heightFor(o);return this.intersectsSphere(sphere245)};
 TER.bindRenderer=function(renderer){if(renderer.__terrain252)return;renderer.__terrain252=true;
  const draw=renderer.renderBufferDirect,use=renderer.state.useProgram,render=renderer.render;let active=null;renderer.render=function(...args){heightFrame348++;return render.apply(this,args)};
  renderer.state.useProgram=function(program){const changed=use.call(this,program);active=program;return changed};
  renderer.renderBufferDirect=function(camera,scene,geometry,material,object,group){
   let r=roots.get(object);if(!r||!r.parent||r.userData.terrainContainer245){r=TER.rootFor(object);roots.set(object,r)}
   const e=r.matrixWorld.elements;TER.anchor.value.set(e[12],e[14]);TER.batch.value=geometry.attributes.terrainAnchor245?1:0;
   TER.absolute.value=object.userData.terrainAbsolute245||r.userData.terrainAbsolute245?1:0;TER.height.value=TER.on.value&&!TER.absolute.value?TER.heightFor(object):0;
   // r128 does not upload custom uniforms between consecutive draws of one material.
   const program=renderer.properties.get(material).currentProgram;
   if(program&&program.program===active){const u=program.getUniforms(),gl=renderer.getContext();u.setValue(gl,'uTerHeight245',TER.height.value);u.setValue(gl,'uTerAnchor245',TER.anchor.value);u.setValue(gl,'uTerBatch245',TER.batch.value);u.setValue(gl,'uTerAbsolute245',TER.absolute.value);u.setValue(gl,'uTerOn',TER.on.value);u.setValue(gl,'uTerD',TER.D.value);u.setValue(gl,'uTerR',TER.R.value);u.setValue(gl,'uMt383',TER.MT.value);u.setValue(gl,'uTF444',TER.TF.value);u.setValue(gl,'uTFN444',TER.TFN.value);u.setValue(gl,'uOW460',TER.OW.value);u.setValue(gl,'uOWB460',TER.OWB.value)}
   return draw.call(this,camera,scene,geometry,material,object,group);
  };
 };
 const lift=`
float terrainLift245(vec3 wp){if(uTerAbsolute245>.5)return 0.;
#ifdef TER_GROUND245
return terrH245(wp.xz);
#else
#ifndef USE_INSTANCING
if(uTerBatch245<.5)return uTerHeight245;
#endif
vec2 anchor=uTerAnchor245;
#ifdef USE_INSTANCING
anchor=(modelMatrix*instanceMatrix*vec4(0.,0.,0.,1.)).xz;
#endif
if(uTerBatch245>.5){vec4 base=vec4(terrainAnchor245.x,0.,terrainAnchor245.y,1.);
#ifdef USE_INSTANCING
base=instanceMatrix*base;
#endif
anchor=(modelMatrix*base).xz;}
return terrH245(anchor);
#endif
}
`;
 C.project_vertex=`vec4 mvPosition=vec4(transformed,1.0);
#ifdef USE_INSTANCING
mvPosition=instanceMatrix*mvPosition;
#endif
{vec4 wp245=modelMatrix*mvPosition;wp245.y+=terrainLift245(wp245.xyz);mvPosition=viewMatrix*wp245;}
gl_Position=projectionMatrix*mvPosition;`;
 C.worldpos_vertex=C.worldpos_vertex.replace(/(worldPosition\s*=\s*modelMatrix\s*\*\s*worldPosition;)/,'$1\nworldPosition.y+=terrainLift245(worldPosition.xyz);');
 C.defaultnormal_vertex+=`
#ifdef TER_NORMAL245
{vec4 np245=modelMatrix*vec4(position,1.);if(uTerOn>.5){float e=1.5,hx=terrH245(np245.xz+vec2(e,0.))-terrH245(np245.xz-vec2(e,0.)),hz=terrH245(np245.xz+vec2(0.,e))-terrH245(np245.xz-vec2(0.,e));
vec3 wn=normalize((vec4(transformedNormal,0.)*viewMatrix).xyz);if(wn.y>.6){wn=normalize(wn+vec3(-hx,0.,-hz)/(2.*e));transformedNormal=(viewMatrix*vec4(wn,0.)).xyz;}}}
#endif`;
 const add=function(sh){if(!sh.uniforms||sh.vertexShader.includes('terrH245(vec2'))return;
  Object.assign(sh.uniforms,{uOW460:TER.OW,uOWB460:TER.OWB,uTF444:TER.TF,uTFN444:TER.TFN,uMt383:TER.MT,uTerHeight245:TER.height,uTerOn:TER.on,uTerD:TER.D,uTerR:TER.R,uTerAnchor245:TER.anchor,uTerBatch245:TER.batch,uTerAbsolute245:TER.absolute});
  this.defaultAttributeValues={...this.defaultAttributeValues,terrainAnchor245:[0,0]};
  let v=sh.vertexShader;const ground=v.includes('TER_NORMAL245')||/varying vec3 terrainWorld128/.test(v);
  v=v.replace(/(vWp\s*=[^;]*;)/g,'$1vWp.y+=terrainLift245(vWp);');
  if(v.includes('gl_Position')&&!v.includes('#include <project_vertex>')){const i=v.lastIndexOf('}');v=v.slice(0,i)+`{vec4 W245=vec4(position,1.);
#ifdef USE_INSTANCING
W245=instanceMatrix*W245;
#endif
W245=modelMatrix*W245;gl_Position+=projectionMatrix*viewMatrix*vec4(0.,terrainLift245(W245.xyz),0.,0.);}
`+v.slice(i)}
  if(ground&&/varying float road128/.test(v)){const k=v.lastIndexOf('}');v=v.slice(0,k)+'{vec4 pw444=modelMatrix*vec4(position,1.);road128=max(road128,path444(pw444.xz));float th446=terrH245(pw444.xz),sm446=step(-60.,seaD439(pw444.xz));sea446=sm446*(clamp(-.9-th446,0.,1.)+clamp((-.9-th446)*.04,0.,1.));}\n'+v.slice(k);v='varying float sea446;\n'+v} /* v444: trilha e calcamento usam o visual de estrada */
  sh.vertexShader=(ground?'#define TER_GROUND245\n':'')+GL+lift+v;
 };
 const DEF=function(sh){add.call(this,sh)};DEF.toString=()=>'terrain252';
 Object.defineProperty(T.Material.prototype,'onBeforeCompile',{configurable:true,get(){return this._obc245||DEF},set(f){if(!f||f===DEF){this._obc245=null;return}if(f._w245){this._obc245=f;return}const w=function(sh,r){f.call(this,sh,r);add.call(this,sh)};w._w245=1;w.inner=f;w.toString=()=>f.toString()+'terrain252';this._obc245=w}});
})();
