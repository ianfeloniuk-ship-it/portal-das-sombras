/* v664 (Ian): essências realistas só com shader (raymarching), mostradas no Examinar do saque. */
/* essencias-shader.js — Primeva · Núcleos Fluidos realistas, 100% shader (raymarching), sem malha sólida.
   A malha é só uma caixa invisível; o formato, o vidro, a refração, a absorção e o brilho são calculados no shader.
   Uso:  const g = ESSENCIAS.criar('gosma'|'lodo'|'fogo'|'seiva', {size:.5}); scene.add(g);
         ESSENCIAS.update(dt);   // todo quadro                                   (three.js r128+) */
(function (G) {
'use strict';
const T = G.THREE, UT = { value: 0 };
const TIPOS = { gosma: 0, lodo: 1, fogo: 2, seiva: 3 };

const VS = `varying vec3 vLocal;void main(){vLocal=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;

const FS = `
uniform float uTime;uniform vec3 uCam,uBmin,uBmax;uniform mat4 projectionMatrix,modelMatrix;varying vec3 vLocal;
float hash(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
 return mix(mix(mix(hash(i),hash(i+vec3(1.,0.,0.)),f.x),mix(hash(i+vec3(0.,1.,0.)),hash(i+vec3(1.,1.,0.)),f.x),f.y),
 mix(mix(hash(i+vec3(0.,0.,1.)),hash(i+vec3(1.,0.,1.)),f.x),mix(hash(i+vec3(0.,1.,1.)),hash(i+vec3(1.,1.,1.)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*noise(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return s;}
vec2 vor(vec3 p){vec3 i=floor(p),f=fract(p);float d1=9.,d2=9.;
 for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++)for(int z=-1;z<=1;z++){vec3 g=vec3(float(x),float(y),float(z));
  vec3 o=vec3(hash(i+g),hash(i+g+7.1),hash(i+g+13.7));float d=length(g+o-f);if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;}
 return vec2(d1,d2);}
float sdRoundCone(vec3 p,vec3 a,vec3 b,float r1,float r2){vec3 ba=b-a;float l2=dot(ba,ba),rr=r1-r2,a2=l2-rr*rr,il2=1./l2;
 vec3 pa=p-a;float y=dot(pa,ba),z=y-l2;vec3 xv=pa*l2-ba*y;float x2=dot(xv,xv),y2=y*y*l2,z2=z*z*l2,k=sign(rr)*rr*rr*x2;
 if(sign(z)*a2*z2>k)return sqrt(x2+z2)*il2-r2;if(sign(y)*a2*y2<k)return sqrt(x2+y2)*il2-r1;return (sqrt(x2*a2*il2)+y*rr)*il2-r1;}
float sdEll(vec3 p,vec3 r){float k0=length(p/r),k1=length(p/(r*r));return k0*(k0-1.)/k1;}

// estúdio: chão/céu cinza + softboxes (dá o reflexo realista das pranchas)
vec3 env(vec3 d){vec3 c=mix(vec3(.16,.16,.17),vec3(.46,.46,.48),smoothstep(-.4,.9,d.y));
 c+=vec3(3.2)*smoothstep(.86,.96,dot(d,normalize(vec3(-.6,.65,.45))));
 c+=vec3(1.4)*smoothstep(.9,.98,dot(d,normalize(vec3(.75,.35,.55))));
 c+=vec3(.7)*smoothstep(.92,.99,dot(d,normalize(vec3(0.,.25,-1.))));return c;}

#if TYPE==0
vec3 dropPos(int i){float fi=float(i),a=fi*1.7+.6,rr=1.02+.13*sin(fi*3.1);
 return vec3(cos(a)*rr,sin(a)*rr*.9,.06*sin(fi)+.04*sin(uTime*.8+fi));}
float map(vec3 p){float d=sdEll(p,vec3(.92,.92,.3))+.01*sin(length(p.xy)*18.-uTime*1.5);
 for(int i=0;i<7;i++){float r=.03+.035*hash(vec3(float(i),2.,5.));d=min(d,length(p-dropPos(i))-r);}return d;}
void vol(vec3 p,out vec3 em,out vec3 sg){float r=length(p.xy),a=atan(p.y,p.x);
 sg=vec3(1.0,.05,.65);
 float rings=pow(.5+.5*sin(r*46.-uTime*.6),10.)*smoothstep(.22,.38,r)*smoothstep(.95,.7,r);
 em=vec3(.25,1.,.5)*rings*.9+vec3(.08,.5,.2)*.5;
 float core=smoothstep(.32,.14,r)*smoothstep(.26,.0,abs(p.z));
 float sw=fbm(vec3(a*2.+r*14.-uTime*1.8,r*6.,uTime*.2));
 float hole=smoothstep(.13,.05,r);
 em+=mix(vec3(.35,.05,1.),vec3(.95,.65,1.),sw)*core*(.5+1.8*sw)*(1.-hole)*3.;
 sg+=vec3(10.)*hole*core+vec3(1.,4.,.5)*core*.6;}
#define IOR 1.35
#elif TYPE==1
float map(vec3 p){float d=sdRoundCone(p,vec3(0.,-.35,0.),vec3(0.,.85,0.),.62,.015);
 if(d>.25)return d;vec2 v=vor(p*3.);float bump=1.-smoothstep(0.,.55,v.x);
 bump+=.6*smoothstep(.3,.7,noise(p*7.))*step(.0,p.y);return (d-.05*bump)*.8;}
#elif TYPE==2
vec3 bendP(vec3 p){float b=smoothstep(.1,.9,p.y);p.x-=.13*b*b*(1.+.25*sin(uTime*1.7));p.z-=.05*b*sin(uTime*1.3);return p;}
float map(vec3 p){return sdRoundCone(bendP(p),vec3(0.,-.3,0.),vec3(0.,.86,0.),.6,.02)*.9;}
void vol(vec3 p,out vec3 em,out vec3 sg){sg=vec3(1.3,.5,.06);vec3 q=bendP(p);
 float h=clamp((q.y+.9)/1.7,0.,1.),w=.52*(1.-h*.85);
 float n=fbm(q*3.2-vec3(0.,uTime*1.6,0.)+vec3(0.,0.,uTime*.3));
 float f=smoothstep(w,w*.1,length(q.xz)+(n-.5)*.38)*smoothstep(.0,.15,h)*(.55+.9*n);
 em=mix(vec3(.04,.22,1.),vec3(.65,.97,1.),f*f)*f*4.2;}
float smoke(vec3 p){if(p.y<.5)return 0.;float h=p.y-.5;vec3 q=p;q.x-=.13+.22*sin(p.y*3.2+uTime*.7)*h;
 float w=.1+.38*h,n=fbm(vec3(q.x*3.,p.y*2.2-uTime*.8,q.z*3.));
 return smoothstep(w,0.,length(q.xz))*smoothstep(.38,.75,n)*smoothstep(1.45,.5,h)*2.;}
#define IOR 1.33
#else
float map(vec3 p){return sdEll(p-vec3(0.,-.05,0.),vec3(1.05,.72*(1.+.02*sin(uTime*.6)),.8));}
void vol(vec3 p,out vec3 em,out vec3 sg){sg=vec3(.05,.24,1.1);
 vec3 c=p*7.,id=floor(c),f=fract(c)-.5;float h=hash(id);vec3 o=vec3(hash(id+3.1),hash(id+5.7),hash(id+9.3))-.5;
 float star=smoothstep(.08+.13*step(.95,h),.0,length(f-o*.6))*step(.68,h);
 em=vec3(1.,.78,.3)*star*7.*(.6+.4*sin(uTime*2.+h*40.))+vec3(1.,.66,.18)*.55*fbm(p*2.5+uTime*.05);}
#define IOR 1.54
#endif

vec2 boxHit(vec3 ro,vec3 rd){vec3 inv=1./rd,t0=(uBmin-ro)*inv,t1=(uBmax-ro)*inv,a=min(t0,t1),b=max(t0,t1);
 return vec2(max(max(a.x,a.y),a.z),min(min(b.x,b.y),b.z));}
vec3 nrm(vec3 p){vec2 e=vec2(.0015,0.);return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));}
float spec(vec3 n,vec3 rd,vec3 l,float k){return pow(max(dot(n,normalize(normalize(l)-rd)),0.),k);}

void main(){
 vec3 ro=uCam,rd=normalize(vLocal-uCam);vec2 tb=boxHit(ro,rd);float t=max(tb.x,0.);
 bool hit=false;vec3 p=ro+rd*t;vec3 smC=vec3(0.);float smA=0.;
 for(int i=0;i<110;i++){p=ro+rd*t;float d=map(p);
  #if TYPE==2
   float st=clamp(d*.9,.004,.05);float a=smoke(p)*st;smC+=(1.-smA)*a*vec3(.45,.75,1.)*1.6;smA+=(1.-smA)*a*.55;
  #else
   float st=max(d*.9,.003);
  #endif
  if(d<.001){hit=true;break;}t+=st;if(t>tb.y)break;}
 if(!hit&&smA<.01)discard;
 vec3 col=vec3(0.);
 if(hit){vec3 n=nrm(p);float ndv=clamp(dot(n,-rd),0.,1.);vec3 refl=env(reflect(rd,n));
  #if TYPE==1
   float F=.05+.95*pow(1.-ndv,5.);vec2 v=vor(p*3.);float cr=1.-smoothstep(0.,.055,v.y-v.x);
   float pulse=.6+.4*sin(uTime*1.8+p.y*5.+v.x*7.);float diff=clamp(dot(n,normalize(vec3(-.5,.7,.6))),0.,1.);
   col=vec3(.012,.008,.02)*(.3+diff)+refl*(.08+.9*F)+vec3(1.,.12,.85)*cr*pulse*2.6+vec3(.35,.04,.42)*smoothstep(.22,0.,v.y-v.x)*pulse*.45;
  #else
   float F=.04+.96*pow(1.-ndv,5.);vec3 rdi=refract(rd,n,1./IOR),q=p+rdi*.004,Tr=vec3(1.),L=vec3(0.);float sl=.03;
   for(int i=0;i<72;i++){if(map(q)>0.)break;vec3 em,sg;vol(q,em,sg);L+=Tr*em*sl;Tr*=exp(-sg*sl);q+=rdi*sl;}
   vec3 n2=-nrm(q),rdo=refract(rdi,n2,IOR);if(dot(rdo,rdo)<.01)rdo=reflect(rdi,n2);
   col=mix(L+Tr*env(rdo)*.85,refl,F);
  #endif
  col+=vec3(1.)*spec(n,rd,vec3(-.6,.65,.45),220.)*2.+vec3(.8)*spec(n,rd,vec3(.75,.35,.55),120.)*.6;
  vec4 cp=projectionMatrix*viewMatrix*modelMatrix*vec4(p,1.);gl_FragDepthEXT=clamp(cp.z/cp.w*.5+.5,0.,1.);
 }else{vec4 cp=projectionMatrix*viewMatrix*modelMatrix*vec4(ro+rd*max(tb.x,0.),1.);gl_FragDepthEXT=clamp(cp.z/cp.w*.5+.5,0.,1.);}
 col=smC+(1.-smA)*col;gl_FragColor=vec4(col,hit?1.:smA);}
`;

const BOX = { 0: [[-1.25, -1.1, -.45], [1.25, 1.1, .45]], 1: [[-.72, -1.05, -.72], [.72, .95, .72]],
  2: [[-.75, -.98, -.75], [.95, 2.05, .75]], 3: [[-1.1, -.82, -.85], [1.1, .75, .85]] };

function criar(tipo, o) {
  o = Object.assign({ size: .5 }, o);
  const id = TIPOS[tipo]; if (id === undefined) throw new Error('tipo de essência desconhecido: ' + tipo);
  const b = BOX[id], mn = new T.Vector3(...b[0]), mx = new T.Vector3(...b[1]);
  const geo = new T.BoxGeometry(mx.x - mn.x, mx.y - mn.y, mx.z - mn.z);
  geo.translate((mx.x + mn.x) / 2, (mx.y + mn.y) / 2, (mx.z + mn.z) / 2);
  const mat = new T.ShaderMaterial({ defines: { TYPE: id },
    uniforms: { uTime: UT, uCam: { value: new T.Vector3() }, uBmin: { value: mn }, uBmax: { value: mx } },
    vertexShader: VS, fragmentShader: FS, side: T.BackSide, transparent: true, extensions: { fragDepth: true } });
  const m = new T.Mesh(geo, mat); m.scale.setScalar(o.size); m.frustumCulled = false;
  m.onBeforeRender = (r, s, cam) => { m.updateMatrixWorld(); const v = mat.uniforms.uCam.value.setFromMatrixPosition(cam.matrixWorld); m.worldToLocal(v); };
  m.userData.essencia = tipo;
  return m;
}
G.ESSENCIAS = { criar, update(dt) { UT.value += dt; }, TIPOS };
})(typeof window !== 'undefined' ? window : globalThis);
/* Liga as essências do saque (Essência de X / Gel de X) ao tipo visual da Prancha II. */
window.Essencia663=(()=>{
 const isFluid=x=>x?.type==='material'&&/^(Essência|Gel) de /.test(x.name||'');
 function kind(x){if(!isFluid(x))return null;const n=x.name;
  if(/^Gel /.test(n)||/Fantasma|Esp[ií]rito|Espectr|Caveira|Fogo|Chama/i.test(n))return 'fogo';
  if(/Gosma|Slime|Limo/i.test(n))return 'gosma';
  if(/Cogumelo|Árvore|Ent\b|Planta|Raiz|Flor/i.test(n))return 'seiva';
  return 'lodo';}
 const NOME={gosma:'Essência de Gosma Fendida',lodo:'Lodo Abissal',fogo:'Gel de Fogo-Fátuo',seiva:'Seiva Vital Ancestral'};
 function mesh(x){const g=new THREE.Group();const k=kind(x);g.add(ESSENCIAS.criar(k,{size:{gosma:.6,lodo:.64,fogo:.85,seiva:.72}[k]}));/* margem invisível: o palco enquadra pela caixa */const pad=new THREE.Mesh(new THREE.BoxGeometry(2.3,2.3,2.3));pad.visible=false;g.add(pad);return g}
 function desc(x){return x.n+' unidades · Núcleo fluido: '+NOME[kind(x)]+'. Base de poções e frascos de arremesso.'}
 return {kind,mesh,desc,isFluid};
})();
