/* v245: relevo do mundo. Chão acompanha o terreno; modelos recebem altura constante no ponto de apoio
   (chão, árvores, prédios, personagens). Cidades, estradas e lagos ficam planos; rios correm em vales.
   A lógica do jogo continua em y=0; a câmera, a mira e os rótulos somam terrH(x,z). */
(function(){const T=THREE;
 const TER=window.TER245={on:{value:0},MT:{value:new T.Vector4(40,1,0,0)},D:{value:Array.from({length:16},()=>new T.Vector4(0,0,-1,0))},R:{value:Array.from({length:24},()=>new T.Vector4(0,0,0,0))}};
 const P=30*64*2,H0=30*64*.5,RW=11;
 const GL=`uniform float uTerOn;uniform float uTerHeight245;uniform vec2 uTerAnchor245;uniform float uTerBatch245;uniform float uTerAbsolute245;attribute vec2 terrainAnchor245;uniform vec4 uTerD[16];uniform vec4 uTerR[24];uniform vec4 uMt383;
float mt383(vec2 p){if(uMt383.x<=0.)return 0.;vec2 q=p*uMt383.y;float m=smoothstep(.12,.55,sin(q.x*.0017+sin(q.y*.0023)*1.9)*sin(q.y*.0014+sin(q.x*.0011)*1.4));if(m<=0.)return 0.;
 float r1=1.-abs(sin(q.x*.012+sin(q.y*.009)*1.6)*sin(q.y*.013-q.x*.004));float r2=1.-abs(sin(q.x*.031+q.y*.008)*sin(q.y*.027-q.x*.011));float r3=1.-abs(sin(q.x*.071-q.y*.02)*sin(q.y*.063+q.x*.017));
 return uMt383.x*m*(r1*r1*.65+r2*r2*.27+r3*r3*.08);}
float terrH245(vec2 p){if(uTerOn<.5)return 0.;float m=.62+.38*sin(p.x*.0021+1.)*sin(p.y*.0017+.4);
 float h=(15.*sin(p.x*.011+sin(p.y*.0061)*1.7)*sin(p.y*.0093+sin(p.x*.0047)*1.3)+5.*sin(p.x*.031+p.y*.017)*sin(p.y*.027-p.x*.012)+1.2*sin(p.x*.09+p.y*.05))*m+mt383(p);
 float b=floor((p.x-${H0.toFixed(1)})/${P.toFixed(1)}+.5),c=b*${P.toFixed(1)}+${H0.toFixed(1)}+sin(p.y*.0043+b*1.7)*95.+sin(p.y*.011+b)*28.+sin(p.y*.035+b*2.3)*18.+sin(p.y*.079+b*3.1)*5.;
 float rw=5.5*(1.+.22*sin(p.y*.047+b*1.3)+.12*sin(p.y*.113+b*2.7));float rdx=abs(p.x-c);h=mix(h,-2.4,1.-smoothstep(rw,rw+7.,rdx));if(rdx<rw)h-=2.2*(1.-rdx*rdx/(rw*rw));
 for(int i=0;i<16;i++){vec4 D=uTerD[i];if(D.z<0.)continue;float dd=length(p-D.xy);h=mix(h,D.w,1.-smoothstep(D.z,D.z+38.,dd));if(D.w<0.){float rr=D.z-3.;if(dd<rr)h-=2.5*(1.-dd*dd/(rr*rr));}}
 for(int i=0;i<24;i++){vec4 R=uTerR[i];vec2 q=clamp(p,min(R.xy,R.zw),max(R.xy,R.zw));h=mix(h,0.,1.-smoothstep(5.,22.,length(p-q)));}
 return h;}
`;
 /* v391 (Ian): rios e lagos têm leito cavado (fundo em U de 2,2 m / bacia de 2,5 m) e margens mais íngremes. */
 /* v383 (vídeo André Elias): cordilheiras por ruído suave com cristas (ridged), iguais no CPU e no shader. */
 function mt383(x,z){const M=TER.MT.value;if(M.x<=0)return 0;const S=Math.sin,qx=x*M.y,qz=z*M.y,v=S(qx*.0017+S(qz*.0023)*1.9)*S(qz*.0014+S(qx*.0011)*1.4),t=Math.min(1,Math.max(0,(v-.12)/(.55-.12))),m=t*t*(3-2*t);if(m<=0)return 0;
  const r1=1-Math.abs(S(qx*.012+S(qz*.009)*1.6)*S(qz*.013-qx*.004)),r2=1-Math.abs(S(qx*.031+qz*.008)*S(qz*.027-qx*.011)),r3=1-Math.abs(S(qx*.071-qz*.02)*S(qz*.063+qx*.017));
  return M.x*m*(r1*r1*.65+r2*r2*.27+r3*r3*.08)}
 TER.mt383=mt383;
 window.terrH=function(x,z){if(!TER.on.value)return 0;const S=Math.sin,m=.62+.38*S(x*.0021+1)*S(z*.0017+.4);
  let h=(15*S(x*.011+S(z*.0061)*1.7)*S(z*.0093+S(x*.0047)*1.3)+5*S(x*.031+z*.017)*S(z*.027-x*.012)+1.2*S(x*.09+z*.05))*m+mt383(x,z);
  const ss=(a,b,v)=>{const t=Math.min(1,Math.max(0,(v-a)/(b-a)));return t*t*(3-2*t)},mix=(a,b,k)=>a+(b-a)*k;
  const b=Math.floor((x-H0)/P+.5),c=b*P+H0+S(z*.0043+b*1.7)*95+S(z*.011+b)*28+S(z*.035+b*2.3)*18+S(z*.079+b*3.1)*5;{const rw=(RW*(1+.22*S(z*.047+b*1.3)+.12*S(z*.113+b*2.7)))/2,rdx=Math.abs(x-c);h=mix(h,-2.4,1-ss(rw,rw+7,rdx));if(rdx<rw)h-=2.2*(1-rdx*rdx/(rw*rw))}
  for(const D of TER.D.value){if(D.z<0)continue;const dd=Math.hypot(x-D.x,z-D.y);h=mix(h,D.w,1-ss(D.z,D.z+38,dd));if(D.w<0){const rr=D.z-3;if(dd<rr)h-=2.5*(1-dd*dd/(rr*rr))}}
  for(const R of TER.R.value){const qx=Math.min(Math.max(x,Math.min(R.x,R.z)),Math.max(R.x,R.z)),qz=Math.min(Math.max(z,Math.min(R.y,R.w)),Math.max(R.y,R.w));h=mix(h,0,1-ss(5,22,Math.hypot(x-qx,z-qz)))}
  return h};

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
  if(g.attributes.terrainAnchor245||g.attributes.terrainRoad128||g.attributes.terrainBio131)sphere245.radius+=24;else sphere245.center.y+=TER.heightFor(o);
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
   if(program&&program.program===active){const u=program.getUniforms(),gl=renderer.getContext();u.setValue(gl,'uTerHeight245',TER.height.value);u.setValue(gl,'uTerAnchor245',TER.anchor.value);u.setValue(gl,'uTerBatch245',TER.batch.value);u.setValue(gl,'uTerAbsolute245',TER.absolute.value);u.setValue(gl,'uTerOn',TER.on.value);u.setValue(gl,'uTerD',TER.D.value);u.setValue(gl,'uTerR',TER.R.value);u.setValue(gl,'uMt383',TER.MT.value)}
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
  Object.assign(sh.uniforms,{uMt383:TER.MT,uTerHeight245:TER.height,uTerOn:TER.on,uTerD:TER.D,uTerR:TER.R,uTerAnchor245:TER.anchor,uTerBatch245:TER.batch,uTerAbsolute245:TER.absolute});
  this.defaultAttributeValues={...this.defaultAttributeValues,terrainAnchor245:[0,0]};
  let v=sh.vertexShader;const ground=v.includes('TER_NORMAL245')||/varying vec3 terrainWorld128/.test(v);
  v=v.replace(/(vWp\s*=[^;]*;)/g,'$1vWp.y+=terrainLift245(vWp);');
  if(v.includes('gl_Position')&&!v.includes('#include <project_vertex>')){const i=v.lastIndexOf('}');v=v.slice(0,i)+`{vec4 W245=vec4(position,1.);
#ifdef USE_INSTANCING
W245=instanceMatrix*W245;
#endif
W245=modelMatrix*W245;gl_Position+=projectionMatrix*viewMatrix*vec4(0.,terrainLift245(W245.xyz),0.,0.);}
`+v.slice(i)}
  sh.vertexShader=(ground?'#define TER_GROUND245\n':'')+GL+lift+v;
 };
 const DEF=function(sh){add.call(this,sh)};DEF.toString=()=>'terrain252';
 Object.defineProperty(T.Material.prototype,'onBeforeCompile',{configurable:true,get(){return this._obc245||DEF},set(f){if(!f||f===DEF){this._obc245=null;return}if(f._w245){this._obc245=f;return}const w=function(sh,r){f.call(this,sh,r);add.call(this,sh)};w._w245=1;w.inner=f;w.toString=()=>f.toString()+'terrain252';this._obc245=w}});
})();
