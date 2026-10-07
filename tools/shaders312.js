/* v312 (Ian): visual cartunesco com shaders ricos (como a água e a Fenda), nada chapado.
   Biblioteca compartilhada:
   - energy(cor,op): energia fluindo (ruído animado), borda brilhante (fresnel), mistura aditiva — anéis, cúpulas, cortes, pilares, raios.
   - fire(op): chama com gradiente de calor e tremulação.
   - lava(cor,op): brilho escorrendo (para rachaduras).
   - metal(cor): metal estilizado (ouro, ferro) com rampa em degraus, reflexo em faixa e borda clara.
   Todos aceitam material.opacity normalmente (os efeitos fazem fade por ele). */
(function(){
const T=THREE,U={uTime:{value:0}};
const NOISE=`float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n2(p);p*=2.03;a*=.5;}return v;}`;
const VS=`varying vec2 vUv;varying vec3 vN;varying vec3 vW;
void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`;
function make(fs,uni,opts){const m=new T.ShaderMaterial({uniforms:{uTime:U.uTime,uOpacity:{value:1},...uni},vertexShader:VS,fragmentShader:fs,transparent:true,depthWrite:false,side:T.DoubleSide,...opts});
 Object.defineProperty(m,'opacity',{get(){return m.uniforms.uOpacity.value},set(v){if(m.uniforms)m.uniforms.uOpacity.value=v},configurable:true});
 /* o jogo usa material.color.set(...) (ex.: cor do rank); aponta para a cor do shader */if(m.uniforms.uCol)Object.defineProperty(m,'color',{get(){return m.uniforms.uCol.value},configurable:true});return m}
const FS_ENERGY=`uniform float uTime;uniform float uOpacity;uniform vec3 uCol;varying vec2 vUv;varying vec3 vN;varying vec3 vW;${NOISE}
void main(){vec3 V=normalize(cameraPosition-vW);float fres=pow(1.-abs(dot(normalize(vN),V)),2.);
 float flow=fbm(vec2(vUv.x*6.-uTime*1.4,vUv.y*3.+uTime*.6));float band=smoothstep(.35,.85,flow);
 vec3 c=mix(uCol*.55,mix(uCol,vec3(1.),.55),band)+uCol*fres*1.2;float a=uOpacity*(.35+.65*band+.6*fres);
 gl_FragColor=vec4(c,clamp(a,0.,1.));}`;
const FS_FIRE=`uniform float uTime;uniform float uOpacity;varying vec2 vUv;${NOISE}
void main(){float y=vUv.y;float n=fbm(vec2(vUv.x*4.,y*3.-uTime*3.));float shape=smoothstep(1.,.15,y+n*.45);
 vec3 c=mix(vec3(1.,.95,.6),mix(vec3(1.,.45,.08),vec3(.55,.05,.02),smoothstep(.3,.95,y)),smoothstep(.05,.6,y+n*.2));
 gl_FragColor=vec4(c*1.25,uOpacity*shape);}`;
const FS_LAVA=`uniform float uTime;uniform float uOpacity;uniform vec3 uCol;varying vec2 vUv;varying vec3 vW;${NOISE}
void main(){float n=fbm(vW.xz*1.6+vec2(0.,-uTime*.8));float hot=smoothstep(.35,.9,n);
 vec3 c=mix(uCol*.5,mix(uCol,vec3(1.,.95,.7),.6),hot);gl_FragColor=vec4(c*(1.1+.4*sin(uTime*5.+n*6.)),uOpacity);}`;
const FS_METAL=`uniform float uTime;uniform float uOpacity;uniform vec3 uCol;varying vec2 vUv;varying vec3 vN;varying vec3 vW;
void main(){vec3 N=normalize(vN),V=normalize(cameraPosition-vW),L=normalize(vec3(.4,.9,.35));
 float d=dot(N,L)*.5+.5;d=floor(d*4.)/4.;float rim=pow(1.-max(dot(N,V),0.),3.);
 float sp=pow(max(dot(reflect(-L,N),V),0.),24.);sp=step(.5,sp);
 float band=smoothstep(.45,.55,fract(dot(N,vec3(.3,1.,.2))*2.+.15));
 vec3 c=uCol*(.35+.75*d)+uCol*band*.25+vec3(1.,.97,.9)*sp*.9+mix(uCol,vec3(1.),.5)*rim*.6;
 gl_FragColor=vec4(c,uOpacity);}`;
function energy(col=0x9fe8ff,op=1){const m=make(FS_ENERGY,{uCol:{value:new T.Color(col)}},{blending:T.AdditiveBlending});m.opacity=op;return m}
function fire(op=1){const m=make(FS_FIRE,{},{blending:T.AdditiveBlending});m.opacity=op;return m}
function lava(col=0xff7a2a,op=1){const m=make(FS_LAVA,{uCol:{value:new T.Color(col)}},{});m.opacity=op;return m}
function metal(col=0xd9b25a){const m=make(FS_METAL,{uCol:{value:new T.Color(col)}},{transparent:false,depthWrite:true,side:T.FrontSide});m.opacity=1;return m}
let last=performance.now();(function tick(){requestAnimationFrame(tick);const n=performance.now();U.uTime.value+=(n-last)/1000;last=n})();
window.Shaders312={energy,fire,lava,metal,U};
})();
