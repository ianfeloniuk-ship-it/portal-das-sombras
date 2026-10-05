/* v245: relevo do mundo. Tudo que é desenhado sobe/desce pela altura do terreno no vertex shader
   (chão, árvores, prédios, personagens). Cidades, estradas e lagos ficam planos; rios correm em vales.
   A lógica do jogo continua em y=0; a câmera, a mira e os rótulos somam terrH(x,z). */
(function(){const T=THREE;
 const TER=window.TER245={on:{value:0},D:{value:Array.from({length:16},()=>new T.Vector4(0,0,-1,0))},R:{value:Array.from({length:24},()=>new T.Vector4(0,0,0,0))}};
 const P=30*64*2,H0=30*64*.5,RW=11;
 const GL=`uniform float uTerOn;uniform vec4 uTerD[16];uniform vec4 uTerR[24];
float terrH245(vec2 p){if(uTerOn<.5)return 0.;float m=.62+.38*sin(p.x*.0021+1.)*sin(p.y*.0017+.4);
 float h=(15.*sin(p.x*.011+sin(p.y*.0061)*1.7)*sin(p.y*.0093+sin(p.x*.0047)*1.3)+5.*sin(p.x*.031+p.y*.017)*sin(p.y*.027-p.x*.012)+1.2*sin(p.x*.09+p.y*.05))*m;
 float b=floor((p.x-${H0.toFixed(1)})/${P.toFixed(1)}+.5),c=b*${P.toFixed(1)}+${H0.toFixed(1)}+sin(p.y*.0043+b*1.7)*95.+sin(p.y*.011+b)*28.;
 h=mix(h,-2.4,1.-smoothstep(${(RW/2).toFixed(1)},${(RW/2+16).toFixed(1)},abs(p.x-c)));
 for(int i=0;i<16;i++){vec4 D=uTerD[i];if(D.z<0.)continue;h=mix(h,D.w,1.-smoothstep(D.z,D.z+38.,length(p-D.xy)));}
 for(int i=0;i<24;i++){vec4 R=uTerR[i];vec2 q=clamp(p,min(R.xy,R.zw),max(R.xy,R.zw));h=mix(h,0.,1.-smoothstep(5.,22.,length(p-q)));}
 return h;}
`;
 window.terrH=function(x,z){if(!TER.on.value)return 0;const S=Math.sin,m=.62+.38*S(x*.0021+1)*S(z*.0017+.4);
  let h=(15*S(x*.011+S(z*.0061)*1.7)*S(z*.0093+S(x*.0047)*1.3)+5*S(x*.031+z*.017)*S(z*.027-x*.012)+1.2*S(x*.09+z*.05))*m;
  const ss=(a,b,v)=>{const t=Math.min(1,Math.max(0,(v-a)/(b-a)));return t*t*(3-2*t)},mix=(a,b,k)=>a+(b-a)*k;
  const b=Math.floor((x-H0)/P+.5),c=b*P+H0+S(z*.0043+b*1.7)*95+S(z*.011+b)*28;h=mix(h,-2.4,1-ss(RW/2,RW/2+16,Math.abs(x-c)));
  for(const D of TER.D.value){if(D.z<0)continue;h=mix(h,D.w,1-ss(D.z,D.z+38,Math.hypot(x-D.x,z-D.y)))}
  for(const R of TER.R.value){const qx=Math.min(Math.max(x,Math.min(R.x,R.z)),Math.max(R.x,R.z)),qz=Math.min(Math.max(z,Math.min(R.y,R.w)),Math.max(R.y,R.w));h=mix(h,0,1-ss(5,22,Math.hypot(x-qx,z-qz)))}
  return h};
 const C=T.ShaderChunk;
 C.project_vertex=`vec4 mvPosition=vec4(transformed,1.0);
#ifdef USE_INSTANCING
mvPosition=instanceMatrix*mvPosition;
#endif
{vec4 wp245=modelMatrix*mvPosition;wp245.y+=terrH245(wp245.xz);mvPosition=viewMatrix*wp245;}
gl_Position=projectionMatrix*mvPosition;`;
 C.worldpos_vertex=C.worldpos_vertex.replace(/(worldPosition\s*=\s*modelMatrix\s*\*\s*worldPosition;)/,'$1\nworldPosition.y+=terrH245(worldPosition.xz);');
 C.defaultnormal_vertex=C.defaultnormal_vertex+`
#ifdef TER_NORMAL245
{vec4 np245=vec4(position,1.);
#ifdef USE_INSTANCING
np245=instanceMatrix*np245;
#endif
np245=modelMatrix*np245;if(uTerOn>.5){float e=1.5,hx=terrH245(np245.xz+vec2(e,0.))-terrH245(np245.xz-vec2(e,0.)),hz=terrH245(np245.xz+vec2(0.,e))-terrH245(np245.xz-vec2(0.,e));
vec3 wn=normalize((vec4(transformedNormal,0.)*viewMatrix).xyz);if(wn.y>.6){wn=normalize(wn+vec3(-hx,0.,-hz)/(2.*e));transformedNormal=(viewMatrix*vec4(wn,0.)).xyz;}}}
#endif`;
 const add=sh=>{if(!sh.uniforms)return;sh.uniforms.uTerOn=TER.on;sh.uniforms.uTerD=TER.D;sh.uniforms.uTerR=TER.R;if(sh.vertexShader.indexOf('terrH245(vec2')>=0)return;let v=sh.vertexShader;v=v.replace(/(vWp\s*=[^;]*;)/g,'$1vWp.y+=terrH245(vWp.xz);');
  if(v.indexOf('gl_Position')>=0&&v.indexOf('#include <project_vertex>')<0){const i=v.lastIndexOf('}');v=v.slice(0,i)+`{vec4 W245=vec4(position,1.);
#ifdef USE_INSTANCING
W245=instanceMatrix*W245;
#endif
W245=modelMatrix*W245;gl_Position+=projectionMatrix*viewMatrix*vec4(0.,terrH245(W245.xz),0.,0.);}
`+v.slice(i)}
  sh.vertexShader=GL+v};
 const DEF=function(sh){add(sh)};DEF.toString=()=>'ter245';
 Object.defineProperty(T.Material.prototype,'onBeforeCompile',{configurable:true,get(){return this._obc245||DEF},set(f){if(!f||f===DEF){this._obc245=null;return}if(f._w245){this._obc245=f;return}const w=function(sh,r){f.call(this,sh,r);add(sh)};w._w245=1;w.inner=f;w.toString=()=>f.toString()+'ter245';this._obc245=w}});
})();
