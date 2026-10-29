/* v678 (Ian: vampiro com aura vermelha de sangue pelo peito, «com shaders, não VFX», como skin lendária de FPS):
   a aura é desenhada no próprio material do vampiro. Do peito saem veias de sangue aceso que pulsam como coração
   (o pulso corre do peito para fora), e a borda do corpo brilha em vermelho (contorno de skin lendária).
   Vale para todo modelo de vampiro: os monstros do mundo e o jogador transformado. */
(function(global){
'use strict';
const T=global.THREE;if(!T||typeof animChibi!=='function')return;
const COR=new T.Color(0xff1028),ESCURO=new T.Color(0x3a0008);
function install(m){const U={uChest:{value:new T.Vector3()},uAT:{value:0},uAC:{value:COR},uAD:{value:ESCURO},uAR:{value:.55}};
  m.root.traverse(o=>{if(!o.isMesh||!o.material)return;for(const mt of [].concat(o.material)){if(!(mt.isMeshStandardMaterial||mt.isMeshPhongMaterial||mt.isMeshLambertMaterial||mt.isMeshToonMaterial))continue;/* só materiais com normal */const ob=mt.onBeforeCompile;mt.onBeforeCompile=function(sh,r){if(ob)ob.call(this,sh,r);Object.assign(sh.uniforms,U);
      sh.vertexShader='varying vec3 vWA678;varying vec3 vNA678;\n'+sh.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvWA678=(modelMatrix*vec4(transformed,1.0)).xyz;vNA678=normalize(mat3(modelMatrix)*objectNormal);');
      sh.fragmentShader='varying vec3 vWA678;varying vec3 vNA678;uniform vec3 uChest,uAC,uAD;uniform float uAT,uAR;\n'+sh.fragmentShader.replace('#include <encodings_fragment>',`#include <encodings_fragment>
{vec3 p=vWA678-uChest;float d=length(p);
 /* veias: linhas finas de um campo ondulado, mais densas perto do peito */
 vec3 q=vWA678*7.;float w=sin(q.x*1.3+sin(q.y*2.1+q.z))*sin(q.y*1.7+sin(q.z*1.9+q.x*.7))+.35*sin(q.z*3.1+q.y*2.3);
 float vein=1.-smoothstep(.0,.12,abs(w));
 /* batida do coração: dois pulsos rápidos e uma pausa, correndo do peito para fora */
 float beat=pow(max(0.,sin(uAT*5.2-d*9.)),6.)+.5*pow(max(0.,sin(uAT*5.2-d*9.-1.1)),8.);
 float reach=1.-smoothstep(.05,uAR,d);
 float core=exp(-d*d*28.)*(.55+.45*sin(uAT*5.2));
 float g=vein*reach*(.35+1.4*beat)+core*.9;
 /* contorno vermelho (borda do corpo vista pela câmera) */
 float rim=pow(1.-abs(dot(normalize(vNA678),normalize(cameraPosition-vWA678))),3.)*(.55+.25*beat);
 gl_FragColor.rgb=mix(gl_FragColor.rgb,gl_FragColor.rgb*.75+uAD,min(1.,g*.6))+uAC*(g*1.6+rim*1.1);}`);};
    const k0=mt.customProgramCacheKey?mt.customProgramCacheKey.bind(mt):()=>'';mt.customProgramCacheKey=()=>k0()+'|aura678';mt.needsUpdate=true}});
  m.aura678=U;return U}
const an0=animChibi;
animChibi=function(m){const r=an0.apply(this,arguments);try{if(m&&m.crit673==='vampiro'){const U=m.aura678||install(m),b=m.bones&&(m.bones.chest||m.bones.spine);
  if(b)b.getWorldPosition(U.uChest.value);U.uAT.value=(typeof time!=='undefined'?time:performance.now()/1000);U.uAR.value=.55*(m.model.scale.x/(m.s0678||(m.s0678=m.model.scale.x)))}}catch(_){}return r};
global.Aura678={install};
})(typeof window!=='undefined'?window:globalThis);
