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
function make(fs,uni,opts,vs){const m=new T.ShaderMaterial({uniforms:{uTime:U.uTime,uOpacity:{value:1},...uni},vertexShader:vs||VS,fragmentShader:fs,transparent:true,depthWrite:false,side:T.DoubleSide,...opts});
 Object.defineProperty(m,'opacity',{get(){return m.uniforms.uOpacity.value},set(v){if(m.uniforms)m.uniforms.uOpacity.value=v},configurable:true});
 /* o jogo usa material.color.set(...) (ex.: cor do rank); aponta para a cor do shader */if(m.uniforms.uCol)Object.defineProperty(m,'color',{get(){return m.uniforms.uCol.value},configurable:true});return m}
const FS_ENERGY=`uniform float uTime;uniform float uOpacity;uniform vec3 uCol;varying vec2 vUv;varying vec3 vN;varying vec3 vW;${NOISE}
void main(){vec3 V=normalize(cameraPosition-vW);float fres=pow(1.-abs(dot(normalize(vN),V)),2.);
 float flow=fbm(vec2(vUv.x*6.-uTime*1.4,vUv.y*3.+uTime*.6));float band=smoothstep(.35,.85,flow);
 vec3 c=mix(uCol*.85,mix(uCol,vec3(1.),.35),band)+uCol*fres;float a=clamp(uOpacity*(.35+.65*band+.6*fres),0.,1.);
 /* v331: pré-multiplicado e cobrindo 85% do fundo — de dia a cor da classe não vira branco; no escuro continua brilhando */
 gl_FragColor=vec4(c*a,a*.85);}`;
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
function energy(col=0x9fe8ff,op=1){const m=make(FS_ENERGY,{uCol:{value:new T.Color(col)}},{blending:T.CustomBlending,blendEquation:T.AddEquation,blendSrc:T.OneFactor,blendDst:T.OneMinusSrcAlphaFactor});m.opacity=op;return m}
function lava(col=0xff7a2a,op=1){const m=make(FS_LAVA,{uCol:{value:new T.Color(col)}},{});m.opacity=op;return m}
function metal(col=0xd9b25a){const m=make(FS_METAL,{uCol:{value:new T.Color(col)}},{transparent:false,depthWrite:true,side:T.FrontSide});m.opacity=1;return m}
/* ---------- v334 (Ian): shaders próprios por tipo de efeito — chama que se move, fumaça, raio, escudo, círculo mágico, corte, água, vazio, pilar de luz.
   Todos cobrem parte do fundo (pré-multiplicado), então mantêm a cor de dia e brilham à noite. ---------- */
const PM={blending:T.CustomBlending,blendEquation:T.AddEquation,blendSrc:T.OneFactor,blendDst:T.OneMinusSrcAlphaFactor};
const VS2=`uniform float uTime;uniform float uAmp;uniform float uSeed;varying vec2 vUv;varying vec3 vN;varying vec3 vW;varying vec3 vP;${NOISE}
void main(){vUv=uv;vP=position;vec3 p=position;
 float n=fbm(vec2(position.x*1.7+position.z*1.3+uSeed,position.y*1.5-uTime*.9))-.5;p+=normal*n*uAmp;
 vec4 w=modelMatrix*vec4(p,1.);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`;
/* chama: a ponta balança e sobe (uv.y = 1 na ponta) */
const VS_FLAME=`uniform float uTime;uniform float uAmp;uniform float uSeed;varying vec2 vUv;varying vec3 vN;varying vec3 vW;varying vec3 vP;${NOISE}
void main(){vUv=uv;vP=position;vec3 p=position;float h=uv.y;
 p.x+=(sin(uTime*6.+uSeed+h*6.)*.5+fbm(vec2(h*3.-uTime*2.5,uSeed))-.5)*h*uAmp;
 p.z+=(cos(uTime*5.+uSeed*1.7+h*5.)*.5+fbm(vec2(uSeed,h*3.-uTime*2.2))-.5)*h*uAmp;
 vec4 w=modelMatrix*vec4(p,1.);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`;
const FS_FLAME=`uniform float uTime;uniform float uOpacity;uniform float uSeed;uniform vec3 uCol;uniform vec3 uOut;varying vec2 vUv;${NOISE}
void main(){float h=vUv.y;vec2 q=vec2(vUv.x*5.+uSeed,h*2.5-uTime*2.8);float n=fbm(q+fbm(q*1.7+uTime*.6)*.6);
 float m=(1.-h)*1.05+(n-.5)*.95;float a=smoothstep(.28,.5,m);float heat=clamp(m*1.3-.25,0.,1.);heat=floor(heat*5.+.5)/5.;
 vec3 c=mix(uOut,uCol,smoothstep(.15,.6,heat));c=mix(c,vec3(1.,.93,.55),smoothstep(.6,.85,heat));c=mix(c,vec3(1.,.98,.86),smoothstep(.9,1.,heat));c=mix(vec3(.14,.05,.04),c,smoothstep(0.,.3,heat));
 a*=uOpacity;gl_FragColor=vec4(c*a*1.1,a*.88);}`;
/* bola de fogo / de energia: núcleo quente, casca que se desfaz em línguas */
const FS_BALL=`uniform float uTime;uniform float uOpacity;uniform float uSeed;uniform vec3 uCol;uniform vec3 uOut;varying vec3 vN;varying vec3 vW;varying vec3 vP;${NOISE}
void main(){vec3 V=normalize(cameraPosition-vW);float f=abs(dot(normalize(vN),V));
 float n=fbm(vP.xy*2.2+vec2(uSeed,-uTime*2.2)+fbm(vP.yz*2.+uTime)*.7);float m=f*1.15+(n-.5)*.8;float a=smoothstep(.25,.5,m);
 float heat=floor(clamp(m-.15,0.,1.)*5.+.5)/5.;vec3 c=mix(uOut,uCol,smoothstep(.1,.55,heat));c=mix(c,vec3(1.,.97,.85),smoothstep(.7,1.,heat));
 a*=uOpacity;gl_FragColor=vec4(c*a*1.15,a*.9);}`;
/* fumaça: volume macio, bordas que se desfazem, sombreado em degraus */
const FS_SMOKE=`uniform float uTime;uniform float uOpacity;uniform float uSeed;uniform vec3 uCol;varying vec3 vN;varying vec3 vW;varying vec3 vP;${NOISE}
void main(){vec3 N=normalize(vN),V=normalize(cameraPosition-vW);float f=max(dot(N,V),0.);
 float n=fbm(vP.xz*1.6+vec2(uSeed+uTime*.25,vP.y*1.5-uTime*.5));float a=smoothstep(.2,.8,f*(.55+n*.95))*uOpacity;
 float lit=floor(clamp(N.y*.5+.5,0.,1.)*3.+.5)/3.;vec3 c=uCol*(.55+.6*lit)+vec3(n*.1);gl_FragColor=vec4(c,a);}`;
/* raio: fio que treme e ramifica (uv.y ao longo do raio) */
const FS_ELEC=`uniform float uTime;uniform float uOpacity;uniform float uSeed;uniform float uPin;uniform vec3 uCol;varying vec2 vUv;${NOISE}
void main(){float t=floor(uTime*22.)+uSeed,y=vUv.y;float pin=mix(smoothstep(0.,.12,y),smoothstep(0.,.1,y)*smoothstep(1.,.9,y),uPin);
 float off=((n2(vec2(y*9.,t))-.5)*.5+(n2(vec2(y*27.,t*1.3))-.5)*.16)*pin;float d=abs(vUv.x-.5-off);
 float core=smoothstep(.04,0.,d),glow=smoothstep(.28,0.,d)*.5;
 float off2=off+(n2(vec2(y*14.,t+7.))-.5)*.6*pin;float br=smoothstep(.022,0.,abs(vUv.x-.5-off2))*step(.5,n2(vec2(floor(y*6.),t)));
 float a=clamp(core+glow+br,0.,1.)*uOpacity;vec3 c=mix(uCol,vec3(1.),clamp(core+br*.6,0.,1.));gl_FragColor=vec4(c*a,a*.6);}`;
/* pilar de luz: raios subindo, borda macia */
const FS_RAY=`uniform float uTime;uniform float uOpacity;uniform float uSeed;uniform vec3 uCol;varying vec2 vUv;varying vec3 vN;varying vec3 vW;${NOISE}
void main(){vec3 V=normalize(cameraPosition-vW);float fres=pow(1.-abs(dot(normalize(vN),V)),1.5);
 float s=fbm(vec2(vUv.x*26.+uSeed,vUv.y*1.5-uTime*1.8));float streak=smoothstep(.35,.8,s);
 float fv=smoothstep(1.,.5,vUv.y)*smoothstep(0.,.06,vUv.y);float a=(.22+.65*streak)*(.3+.7*(1.-fres))*fv*uOpacity;
 vec3 c=mix(uCol,vec3(1.),streak*.6);gl_FragColor=vec4(c*a,a*.6);}`;
/* escudo: colmeia, borda brilhante e onda subindo */
const FS_SHIELD=`uniform float uTime;uniform float uOpacity;uniform vec3 uCol;varying vec3 vN;varying vec3 vW;varying vec3 vP;
float hexd(vec2 p){vec2 r=vec2(1.,1.732),h=r*.5;vec2 a=mod(p,r)-h,b=mod(p-h,r)-h;vec2 g=dot(a,a)<dot(b,b)?a:b;g=abs(g);return max(g.x,g.x*.5+g.y*.866);}
void main(){vec3 V=normalize(cameraPosition-vW);float fres=pow(1.-abs(dot(normalize(vN),V)),2.2);
 float R=length(vP);vec2 s=vec2(atan(vP.z,vP.x)*R*1.6,vP.y*2.4);float e=smoothstep(.4,.49,hexd(s));
 float wave=smoothstep(.75,1.,sin(vP.y*3.-uTime*4.)*.5+.5);
 float a=clamp(e*.7+fres*.85+.07+wave*.18,0.,1.)*uOpacity;vec3 c=mix(uCol,vec3(1.),clamp(e*.35+fres*.3+wave*.3,0.,1.));gl_FragColor=vec4(c*a,a*.75);}`;
/* círculo mágico no chão: anéis, faixa tracejada girando e dois polígonos (uv do disco) */
const FS_MAGIC=`uniform float uTime;uniform float uOpacity;uniform float uN;uniform vec3 uCol;varying vec2 vUv;${NOISE}
float poly(float r,float an,float k,float rad,float rot){float aa=mod(an+rot,k)-k*.5;float d=r*cos(aa)-rad*cos(k*.5);return smoothstep(.022,0.,abs(d))*step(d,.02);}
void main(){vec2 p=vUv*2.-1.;float r=length(p),an=atan(p.y,p.x),k=6.2832/uN;
 float ring=smoothstep(.03,0.,abs(r-.96))+smoothstep(.014,0.,abs(r-.82))+smoothstep(.014,0.,abs(r-.42));
 float band=step(.84,r)*step(r,.94)*step(.55,fract((an+uTime*.7)*18./6.2832))*.7;
 float st=poly(r,an,k,.82,uTime*.35)+poly(r,an,k,.82,uTime*.35+k*.5);
 float fill=smoothstep(1.,.1,r)*.16*(.5+.6*fbm(p*3.+uTime*.3));
 float a=clamp(ring+band+st+fill,0.,1.)*step(r,1.)*uOpacity;vec3 c=mix(uCol,vec3(1.),clamp(ring*.4+st*.4,0.,1.));gl_FragColor=vec4(c*a,a*.75);}`;
/* corte: meia-lua que afina nas pontas, fio branco por fora, rastro riscado */
const FS_SLASH=`uniform float uTime;uniform float uOpacity;uniform float uA0;uniform float uSpread;uniform float uR0;uniform float uR1;uniform vec3 uCol;varying vec3 vP;${NOISE}
void main(){float r=length(vP.xy),an=atan(vP.y,vP.x);float u=mod(an-uA0,6.2832)/uSpread;float rr=(r-uR0)/(uR1-uR0);
 float w=sin(clamp(u,0.,1.)*3.1416);float inner=1.-w*.95;float body=smoothstep(inner,inner+.3,rr)*smoothstep(1.,.94,rr);
 float streak=.55+.45*n2(vec2(an*16.,rr*3.+uTime*7.));float lead=.35+.65*smoothstep(0.,.85,u);
 float a=body*streak*lead*uOpacity;vec3 c=mix(uCol,vec3(1.),smoothstep(.72,.98,rr)*.85);gl_FragColor=vec4(c*a,a*.8);}`;
/* redemoinho: braços em espiral num disco */
const FS_SWIRL=`uniform float uTime;uniform float uOpacity;uniform vec3 uCol;varying vec2 vUv;${NOISE}
void main(){vec2 p=vUv*2.-1.;float r=length(p),an=atan(p.y,p.x);float arms=sin(an*3.+r*9.-uTime*7.+fbm(p*3.)*2.);
 float a=smoothstep(.15,.9,arms)*smoothstep(1.,.75,r)*smoothstep(0.,.2,r)*uOpacity;vec3 c=mix(uCol,vec3(1.),smoothstep(.8,1.,arms)*.6);gl_FragColor=vec4(c*a,a*.7);}`;
/* água: onda com espuma na crista (uv.y = 1 no topo) */
const FS_WATER=`uniform float uTime;uniform float uOpacity;uniform float uSeed;uniform vec3 uCol;varying vec2 vUv;${NOISE}
void main(){float n=fbm(vec2(vUv.x*8.+uTime*1.2+uSeed,vUv.y*3.-uTime*2.));float foam=smoothstep(.84,.97,vUv.y+n*.22);
 vec3 c=mix(uCol*.5,uCol,n);c=floor(c*5.+.5)/5.;c=mix(c,vec3(1.),foam);float a=(.72+.28*foam)*smoothstep(0.,.08,vUv.y)*smoothstep(0.,.14,vUv.x)*smoothstep(1.,.86,vUv.x)*uOpacity;gl_FragColor=vec4(c*a,a);}`;
/* vazio: núcleo negro, redemoinho da cor e borda acesa */
const FS_VOID=`uniform float uTime;uniform float uOpacity;uniform vec3 uCol;varying vec3 vN;varying vec3 vW;varying vec3 vP;${NOISE}
void main(){vec3 V=normalize(cameraPosition-vW);float f=abs(dot(normalize(vN),V));float rim=pow(1.-f,2.2);
 float an=atan(vP.z,vP.x)+uTime*1.5+vP.y*2.;float sw=fbm(vec2(an*1.5,vP.y*2.-uTime*.8));
 vec3 c=mix(vec3(.02,0.,.05),uCol,smoothstep(.45,.8,sw)*.7)+uCol*rim*1.6+vec3(1.)*pow(rim,3.)*.5;float a=clamp(.92+rim,0.,1.)*uOpacity;gl_FragColor=vec4(c*a,a);}`;
const seed=()=>({uSeed:{value:Math.random()*40}});
const C3=(c,d)=>new T.Color(c==null?d:c);
function fire(op=1,col=null){const hot=C3(col,0xff8a1c),out=col==null?new T.Color(0xc21a06):new T.Color(col).multiplyScalar(.4);const m=make(FS_FLAME,{uCol:{value:hot},uOut:{value:out},uAmp:{value:.35},...seed()},PM,VS_FLAME);m.opacity=op;return m}
function fireball(col=null,op=1){const hot=C3(col,0xff8a1c),out=col==null?new T.Color(0xc21a06):new T.Color(col).multiplyScalar(.4);const m=make(FS_BALL,{uCol:{value:hot},uOut:{value:out},uAmp:{value:.25},...seed()},PM,VS2);m.opacity=op;return m}
function smoke(col=0x6a6a78,op=.9){const m=make(FS_SMOKE,{uCol:{value:new T.Color(col)},uAmp:{value:.35},...seed()},{},VS2);m.opacity=op;return m}
function electric(col=0xfff36b,op=1,pin=0){const m=make(FS_ELEC,{uCol:{value:new T.Color(col)},uPin:{value:pin},...seed()},PM);m.opacity=op;return m}
function ray(col=0xfff2b0,op=1){const m=make(FS_RAY,{uCol:{value:new T.Color(col)},...seed()},PM);m.opacity=op;return m}
function shield(col=0x8bdcff,op=1){const m=make(FS_SHIELD,{uCol:{value:new T.Color(col)},uAmp:{value:0},...seed()},PM,VS2);m.opacity=op;return m}
function magic(col=0x9fe8ff,op=1,n=6){const m=make(FS_MAGIC,{uCol:{value:new T.Color(col)},uN:{value:n}},PM);m.opacity=op;return m}
function slash(col,a0,spread,r0,r1,op=1){const m=make(FS_SLASH,{uCol:{value:new T.Color(col)},uA0:{value:a0},uSpread:{value:spread},uR0:{value:r0},uR1:{value:r1},uAmp:{value:0},...seed()},PM,VS2);m.opacity=op;return m}
function swirl(col=0xb48cff,op=1){const m=make(FS_SWIRL,{uCol:{value:new T.Color(col)}},PM);m.opacity=op;return m}
function water(col=0x3aa0ff,op=1){const m=make(FS_WATER,{uCol:{value:new T.Color(col)},uAmp:{value:.25},...seed()},PM,VS2);m.opacity=op;return m}
function voidm(col=0x7a3cff,op=1){const m=make(FS_VOID,{uCol:{value:new T.Color(col)},uAmp:{value:.12},...seed()},PM,VS2);m.opacity=op;return m}
let last=performance.now();(function tick(){requestAnimationFrame(tick);const n=performance.now();U.uTime.value+=(n-last)/1000;last=n})();
window.Shaders312={energy,fire,lava,metal,fireball,smoke,electric,ray,shield,magic,slash,swirl,water,voidm,U};
})();
