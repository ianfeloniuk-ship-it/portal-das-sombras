/* v310 (Ian): cristais mais reais, sem fugir do visual do jogo.
   Shader de cristal compartilhado: faces lapidadas (normal plana), borda brilhante (fresnel),
   luz fluindo por dentro (faixas animadas), brilho especular em degraus (cartunesco) e cintilância.
   Uso: Crystal310.mat(cor) devolve um material; Crystal310.upgrade(obj) troca todo material 'FendaCristal' de um objeto. */
(function(){
const T=THREE,U={uTime:{value:0}};
const vs=`varying vec3 vW;varying vec3 vN;varying vec3 vL;
void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vL=position;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`;
const fs=`uniform float uTime;uniform vec3 uCol;uniform vec3 uDeep;uniform float uOpacity;varying vec3 vW;varying vec3 vN;varying vec3 vL;
float h(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
void main(){
 vec3 fn=normalize(cross(dFdx(vW),dFdy(vW)));if(dot(fn,vN)<0.)fn=-fn;
 vec3 V=normalize(cameraPosition-vW);float nv=clamp(dot(fn,V),0.,1.);
 float fres=pow(1.-nv,2.6);
 vec3 Ld=normalize(vec3(.4,.9,.3));float diff=dot(fn,Ld)*.5+.5;diff=floor(diff*3.)/3.;
 vec3 H=normalize(Ld+V);float spec=pow(max(dot(fn,H),0.),48.);spec=step(.45,spec);
 float flow=sin(vL.y*9.-uTime*2.2+sin(vL.x*6.+uTime)*1.5)*.5+.5;flow=smoothstep(.55,1.,flow);
 float facet=h(floor(fn*6.));
 vec3 inner=mix(uDeep,uCol,.35+.65*diff)*(.75+.35*facet);
 vec3 col=inner+uCol*flow*.55+mix(uCol,vec3(1.),.6)*fres*1.15+vec3(1.)*spec*.9;
 float tw=step(.985,h(floor(vW*14.)+floor(uTime*3.)))*fres;col+=vec3(tw);
 gl_FragColor=vec4(col,uOpacity*(.72+.28*fres));
}`;
const cache=new Map();
function mat(col=0x9b5cff,opacity=.92){const c=new T.Color(col),deep=c.clone().multiplyScalar(.28);const m=new T.ShaderMaterial({uniforms:{uTime:U.uTime,uCol:{value:c},uDeep:{value:deep},uOpacity:{value:opacity}},vertexShader:vs,fragmentShader:fs,transparent:true,depthWrite:true,side:T.FrontSide,extensions:{derivatives:true}});m.name='FendaCristal';m.userData.crystal310=true;return m}
function setColor(m,col){if(m&&m.userData&&m.userData.crystal310){m.uniforms.uCol.value.setHex(col);m.uniforms.uDeep.value.setHex(col).multiplyScalar(.28)}}
function upgrade(obj,col){if(!obj)return;obj.traverse(o=>{if(!o.isMesh||o.isSkinnedMesh||!o.material)return;const mats=Array.isArray(o.material)?o.material:[o.material];const out=mats.map(m=>{if(m&&m.userData&&m.userData.crystal310){if(col!=null)setColor(m,col);return m}if(m&&m.name==='FendaCristal'){const c=col!=null?col:(m.emissive&&m.emissive.getHex())||(m.color&&m.color.getHex())||0x9b5cff;return mat(c)}return m});o.material=Array.isArray(o.material)?out:out[0]})}
let last=performance.now();(function tick(){requestAnimationFrame(tick);const n=performance.now();U.uTime.value+=(n-last)/1000;last=n})();
window.Crystal310={mat,upgrade,setColor,U};
})();
