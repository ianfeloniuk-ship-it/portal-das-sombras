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
 const GAP513=[[40,-1880,-120,-2480,230],[1500,90,2200,-120,230],[-60,1760,160,2420,230],[-2000,110,-2850,-110,240]] /* v529: passagem = vale largo ao longo da estrada (cápsula), não um ponto */,RH513=170,RW513=230;
 /* v692 (Ian): picos com nome e morros dos marcos [x,z,altura,raio,plato]; nomes em tools/marcos692.js */
 const PK692=[[-1700, -4300, 150, 950, 0.2], [-900, -2150, 140, 620, 0.05], [2900, -2150, 140, 620, 0.05], [1830, -1350, 130, 560, 0.05], [-1300, 2150, 150, 620, 0.05], [-2300, -1050, 130, 520, 0.05], [4500, -1900, 120, 500, 0.3], [-5000, 2900, 70, 350, 0.3], [-1900, 4300, 110, 450, 0.3], [4000, 3900, 90, 450, 0.3]];
 const RSEG513=[];for(const L of RIDGE513)for(let i=1;i<L.length;i++)RSEG513.push([L[i-1][0],L[i-1][1],L[i][0],L[i][1]]);
 const f1=v=>v.toFixed(1);
 const GL513='float sd513(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h);}\nfloat ridge513(vec2 p){vec2 pw=p+vec2(110.*sin(p.y*.0031+.7)+50.*sin(p.y*.0093),110.*sin(p.x*.0027+1.9)+50.*sin(p.x*.0089));float d=1e9;'+RSEG513.map(r=>'d=min(d,sd513(pw,vec2('+f1(r[0])+','+f1(r[1])+'),vec2('+f1(r[2])+','+f1(r[3])+')));').join('')+
  'float t=d/'+f1(RW513)+';if(t>=1.)return 0.;float f=1.-smoothstep(.35,1.,t);float n=.72+.28*sin(p.x*.004+sin(p.y*.003)*2.)*sin(p.y*.0047+p.x*.001);float cr=1.-abs(sin(p.x*.013+sin(p.y*.009)*1.7)*sin(p.y*.012-p.x*.005));float h='+f1(RH513)+'*f*n*(.8+.2*cr*cr);'+
  GAP513.map(g=>'h*=smoothstep('+f1(g[4]*.36)+','+f1(g[4])+',sd513(p,vec2('+f1(g[0])+','+f1(g[1])+'),vec2('+f1(g[2])+','+f1(g[3])+')));').join('')+'return h;}\n'+'float pk692(vec2 p){float h=0.;'+PK692.map(k=>'h+='+f1(k[2])+'*(1.-smoothstep('+f1(k[3]*k[4])+','+f1(k[3])+',length(p-vec2('+f1(k[0])+','+f1(k[1])+'))));').join('')+'return h;}\n';const SEAX=-4100,SEAY=-.9; /* v439: costa do mar (x) e nível do mar (y absoluto) */
 /* v661 (Ian): Thalor é banhada pelo mar e flutua pela magia antiga dos afogados — um canal de mar em volta da muralha (r 335–415 m)
    faz da cidade uma ilha; as 3 estradas passam por aterros de pedra. As nascentes dos rios (poços das cachoeiras) também cavam o chão aqui. */
 const TH661={x:-3840,z:0,r0:335,r1:415},CW661=[[[-3555,0],[-3526,-6],[-3495,-15],[-3462,-25],[-3428,-37],[-3392,-50]],[[-3840,-285],[-3829,-315],[-3816,-346],[-3801,-379],[-3784,-413],[-3765,-447],[-3745,-482]],[[-3840,285],[-3831,313],[-3820,342],[-3807,373],[-3792,405],[-3777,439],[-3760,473]]],CWS661=[];for(const L of CW661)for(let i=1;i<L.length;i++)CWS661.push([L[i-1][0],L[i-1][1],L[i][0],L[i][1]]);
 const RIO661=window.RIO_SRC661={'-1':{z0:-640,x0:-2745,L:260,R:30,a:0,W:34,H:38},'0':{z0:-1855,x0:null,L:0,R:28,a:-Math.PI/2,W:28,H:34}}; /* nascentes dos rios: usado também em riverCenter239 (580); a = de onde vem a queda, W/H = largura e altura do paredão */
 const rb661=(b,z)=>b*P+H0+Math.sin(z*.0043+b*1.7)*95+Math.sin(z*.011+b)*28+Math.sin(z*.035+b*2.3)*18+Math.sin(z*.079+b*3.1)*5;
 const RS661=[-1,0].map(b=>{const S=RIO661[b];return {b,S,p:{x:S.x0==null?rb661(b,S.z0):S.x0,z:S.z0},c0:rb661(b,S.z0)}});
 const GL661='float sg661(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h);}\n'+
  'float cw661(vec2 p){float d=1e9;'+CWS661.map(r=>'d=min(d,sg661(p,vec2('+f1(r[0])+','+f1(r[1])+'),vec2('+f1(r[2])+','+f1(r[3])+')));').join('')+'return d;}\n'+
  'float moat661(vec2 p){float r=length(p-vec2('+f1(TH661.x)+','+f1(TH661.z)+'));if(r<'+f1(TH661.r0-120)+'||r>'+f1(TH661.r1+120)+')return -1e9;return min(min(r-'+f1(TH661.r0)+','+f1(TH661.r1)+'-r),cw661(p)-15.)*6.;}\n'+
  'float cwr661(vec2 p,float h){float r=length(p-vec2('+f1(TH661.x)+','+f1(TH661.z)+'));if(r<'+f1(TH661.r0-60)+'||r>'+f1(TH661.r1+60)+')return h;return mix(h,max(h,.6),1.-smoothstep(11.,18.,cw661(p)));}\n'+
  'float rc661(float b,float z){float c=b*'+f1(P)+'+'+f1(H0)+'+sin(z*.0043+b*1.7)*95.+sin(z*.011+b)*28.+sin(z*.035+b*2.3)*18.+sin(z*.079+b*3.1)*5.;'+RS661.filter(r=>r.S.x0!=null).map(r=>'if(b=='+f1(r.b)+'){float t=smoothstep(0.,1.,clamp((z-('+f1(r.S.z0)+'))/'+f1(r.S.L)+',0.,1.));c+='+(r.S.x0-r.c0).toFixed(2)+'*(1.-t);}').join('')+'return c;}\n'+
  'float rk661(float b,float z){'+RS661.map(r=>'if(b=='+f1(r.b)+')return smoothstep('+f1(r.S.z0-4)+','+f1(r.S.z0+8)+',z);').join('')+'return 1.;}\n'+
  'float pool661(vec2 p,float h){'+RS661.map(r=>{const dx=Math.cos(r.S.a).toFixed(4),dz=Math.sin(r.S.a).toFixed(4);return '{vec2 q=p-vec2('+f1(r.p.x)+','+f1(r.p.z)+');float d=length(q);h=mix(h,-2.4,1.-smoothstep('+f1(r.S.R)+','+f1(r.S.R+12)+',d));if(d<'+f1(r.S.R)+')h-=2.6*(1.-d*d/'+f1(r.S.R*r.S.R)+');'+'float u=dot(q,vec2('+dx+','+dz+')),vs=dot(q,vec2(-('+dz+'),'+dx+')),v=abs(vs),j=2.5*sin(vs*.37)+1.5*sin(vs*.93+1.);float Hc='+f1(r.S.H)+'+5.*sin(vs*.11)+3.*sin(vs*.29+2.)+1.2*sin(u*.4);float k=smoothstep('+f1(r.S.R-2)+'+j,'+f1(r.S.R+.5)+'+j,u)*(1.-smoothstep('+f1(r.S.W)+'+6.*sin(u*.05),'+f1(r.S.W+22)+',v))*(1.-smoothstep(150.,200.,u));if(Hc>h)h+=(Hc-h)*k;}'}).join('')+'return h;}\n';
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
/* v689 (Ian): continente orgânico de ~100 km² com mar em volta (antes: quadrado de 10 km). Igual ao CPU. */
${GL661}float coast684(vec2 p){vec2 d=p-vec2(600.,0.);float t=atan(d.y,d.x);float R=5630.+637.*cos(2.*t+3.0569)+367.*cos(3.*t+2.7038)+314.*cos(4.*t+3.5068)+265.*cos(5.*t+6.0495)+147.*cos(7.*t+0.7812)+70.*cos(9.*t+4.4740)+35.*sin(p.x*.011+p.y*.007)+18.*sin(p.x*.029-p.y*.023);{float u=atan(sin(t-(2.66)),cos(t-(2.66)))/0.130;R+=1500.0*exp(-u*u);}{float u=atan(sin(t-(-0.75)),cos(t-(-0.75)))/0.110;R+=-1500.0*exp(-u*u);}{float u=atan(sin(t-(1.62)),cos(t-(1.62)))/0.110;R+=-1000.0*exp(-u*u);}{float u=atan(sin(t-(-2.20)),cos(t-(-2.20)))/0.120;R+=1200.0*exp(-u*u);}{float u=atan(sin(t-(0.55)),cos(t-(0.55)))/0.100;R+=1000.0*exp(-u*u);}{float u=atan(sin(t-(-1.75)),cos(t-(-1.75)))/0.100;R+=-900.0*exp(-u*u);}{float u=atan(sin(t-(1.20)),cos(t-(1.20)))/0.100;R+=900.0*exp(-u*u);}{float u=atan(sin(t-(-0.12)),cos(t-(-0.12)))/0.045;R+=-1400.0*exp(-u*u);}{float u=atan(sin(t-(2.20)),cos(t-(2.20)))/0.060;R+=-700.0*exp(-u*u);}return length(d)-R;}
float seaD439(vec2 p){return max(coast684(p),moat661(p));}
float ice500(vec2 p){float k=1.-smoothstep(-4550.,-3950.,p.y+90.*sin(p.x*.0013));if(k<=0.)return 0.;float r1=1.-abs(sin(p.x*.0061+sin(p.y*.004)*1.6)*sin(p.y*.0072-p.x*.002)),r2=1.-abs(sin(p.x*.019+p.y*.006)*sin(p.y*.017-p.x*.008));return k*(70.+150.*(r1*r1*.7+r2*r2*.3));}
float seaBed439(vec2 p,float d){float b=d<60.?mix(1.2,-3.,(d+60.)/120.):d<450.?mix(-3.,-7.,(d-60.)/390.):mix(-7.,-22.,clamp((d-450.)/1200.,0.,1.));
 b+=2.6*max(0.,sin(p.x*.06+sin(p.y*.05)*2.)*sin(p.y*.055+sin(p.x*.04)*1.5)-.2)*smoothstep(40.,120.,d)*(1.-smoothstep(380.,500.,d));
 if(d>800.){float t=1.-abs(sin(p.x*.0042+sin(p.y*.0027)*2.1)*sin(p.y*.0036-p.x*.0011));b-=42.*smoothstep(.86,.97,t)*smoothstep(800.,1000.,d);}
 return b+.6*sin(p.x*.13+p.y*.07)*sin(p.y*.11-p.x*.05);}
/* v456: terraplenagem desativada — relevo natural de Aster e das 5 Capitais 100% protegido. */
float terra444(vec2 p,float h){return h;}
float path444(vec2 p){return 0.;}
${GL513}float terrH245(vec2 p){if(uTerOn<.5)return 0.;if(uOW460.x>.5)return owH460(p);float m=.62+.38*sin(p.x*.0021+1.)*sin(p.y*.0017+.4);
 float hl529=15.*sin(p.x*.011+sin(p.y*.0061)*1.7)*sin(p.y*.0093+sin(p.x*.0047)*1.3)*m;
 float h=(15.*sin(p.x*.011+sin(p.y*.0061)*1.7)*sin(p.y*.0093+sin(p.x*.0047)*1.3)+5.*sin(p.x*.031+p.y*.017)*sin(p.y*.027-p.x*.012)+1.2*sin(p.x*.09+p.y*.05))*m+mt383(p)+ice500(p)+ridge513(p)+pk692(p);
 float b=floor((p.x-${H0.toFixed(1)})/${P.toFixed(1)}+.5),c=rc661(b,p.y),rk=rk661(b,p.y);
 float rw=5.5*(1.+.22*sin(p.y*.047+b*1.3)+.12*sin(p.y*.113+b*2.7));float rdx=abs(p.x-c);h=mix(h,-2.4,(1.-smoothstep(rw,rw+7.,rdx))*rk);if(rdx<rw)h-=2.2*(1.-rdx*rdx/(rw*rw))*rk;h=pool661(p,h);
 float sd=seaD439(p);if(sd>-60.)h=mix(h,seaBed439(p,sd),smoothstep(-60.,30.,sd));float rk439=1.-smoothstep(300.,600.,sd);
 for(int i=0;i<16;i++){vec4 D=uTerD[i];if(D.z<0.)continue;float dd=length(p-D.xy);float wd529=1.-smoothstep(D.z,D.z+38.,dd);h=mix(h,D.w,wd529);hl529=mix(hl529,D.w,wd529);if(D.w<0.){float rr=D.z-3.;if(dd<rr)h-=2.5*(1.-dd*dd/(rr*rr));}}
 for(int i=0;i<24;i++){vec4 R=uTerR[i];h=mix(h,hl529,(1.-smoothstep(5.,22.,sd513(p,R.xy,R.zw)))*rk439);}h=cwr661(p,h);
 float gc510=smoothstep(100.,260.,p.y)*(130.*sin(p.y*.0057120)+52.*sin(p.y*.013369)+18.*sin(p.y*.033069));float gx510=abs(p.x-gc510);float gz510=smoothstep(78.,118.,p.y)*(1.-smoothstep(500.,560.,p.y));float gm510=.3+.7*smoothstep(-.2,.55,sin(p.y*.011+1.));float ga510=smoothstep(8.,23.,gx510);
 h+=gz510*gm510*ga510*(1.-smoothstep(70.,170.,gx510))*(17.+4.*sin(p.y*.045+sign(p.x)*1.3))*(1.+.16*sin(p.y*.21+p.x*.11)+.09*sin(p.y*.47-p.x*.23)+.05*sin(p.y*.97+p.x*.41));

 float road551=.018*(p.y-72.);float rm551=smoothstep(65.,82.,p.y)*(1.-smoothstep(365.,395.,p.y));
 h=mix(h,road551,(1.-smoothstep(9.,19.,gx510))*rm551);
 float u551=(p.x-29.679420774901278)*.7428872431255049+(p.y-150.)*.6694165698586992,v551=(p.x-29.679420774901278)*.6694165698586992-(p.y-150.)*.7428872431255049;float cut551=(1.-smoothstep(6.,11.,abs(u551)))*(1.-smoothstep(20.,43.,abs(v551)));
 h-=4.8*cut551;
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
 /* v689 (Ian, 29/10/2026): continente de forma orgânica (~100 km²) cercado de mar — igual ao coast684 do shader. Positivo = mar. */
 /* v692 (Ian): costa recortada - peninsulas e baias (lobos no angulo), igual ao shader */
 function LOBE692(t){let r=0;for(const [c,a,w] of [[2.66, 1500, 0.13], [-0.75, -1500, 0.11], [1.62, -1000, 0.11], [-2.2, 1200, 0.12], [0.55, 1000, 0.1], [-1.75, -900, 0.1], [1.2, 900, 0.1], [-0.12, -1400, 0.045], [2.2, -700, 0.06]]){const u=Math.atan2(Math.sin(t-c),Math.cos(t-c))/w;r+=a*Math.exp(-u*u)}return r}
 function coast684(x,z){const C=Math.cos,dx=x-600,t=Math.atan2(z,dx);return Math.hypot(dx,z)-(5630+637*C(2*t+3.0569)+367*C(3*t+2.7038)+314*C(4*t+3.5068)+265*C(5*t+6.0495)+147*C(7*t+0.7812)+70*C(9*t+4.4740)+35*Math.sin(x*.011+z*.007)+18*Math.sin(x*.029-z*.023)+LOBE692(t))}
 TER.coast684=coast684;
 function seaD439(x,z){return Math.max(coast684(x,z),moat661(x,z))}
 function cw661(x,z){let d=1e9;for(const r of CWS661){const px=x-r[0],pz=z-r[1],dx=r[2]-r[0],dz=r[3]-r[1],h=Math.min(1,Math.max(0,(px*dx+pz*dz)/(dx*dx+dz*dz)));d=Math.min(d,Math.hypot(px-dx*h,pz-dz*h))}return d}
 function moat661(x,z){const r=Math.hypot(x-TH661.x,z-TH661.z);if(r<TH661.r0-120||r>TH661.r1+120)return -1e9;return Math.min(r-TH661.r0,TH661.r1-r,cw661(x,z)-15)*6}
 function pool661(x,z,h){const ss=(a,b,v)=>{const t=Math.min(1,Math.max(0,(v-a)/(b-a)));return t*t*(3-2*t)};for(const r of RS661){const qx=x-r.p.x,qz=z-r.p.z,d=Math.hypot(qx,qz),R=r.S.R;h=h+(-2.4-h)*(1-ss(R,R+12,d));if(d<R)h-=2.6*(1-d*d/(R*R));
   /* paredão de pedra atrás do poço: a água cai solta dele */const dx=+Math.cos(r.S.a).toFixed(4),dz=+Math.sin(r.S.a).toFixed(4),u=qx*dx+qz*dz,vs=-qx*dz+qz*dx,v=Math.abs(vs),S=Math.sin,j=2.5*S(vs*.37)+1.5*S(vs*.93+1),Hc=r.S.H+5*S(vs*.11)+3*S(vs*.29+2)+1.2*S(u*.4),k=ss(R-2+j,R+.5+j,u)*(1-ss(r.S.W+6*S(u*.05),r.S.W+22,v))*(1-ss(150,200,u));if(Hc>h)h+=(Hc-h)*k}return h}
 TER.TH661=TH661;TER.moat661=moat661;TER.RS661=RS661;TER.CW661=CW661;
 function ice500(x,z){const S=Math.sin,t=Math.min(1,Math.max(0,(z+90*S(x*.0013)+4550)/600)),k=1-t*t*(3-2*t);if(k<=0)return 0;const r1=1-Math.abs(S(x*.0061+S(z*.004)*1.6)*S(z*.0072-x*.002)),r2=1-Math.abs(S(x*.019+z*.006)*S(z*.017-x*.008));return k*(70+150*(r1*r1*.7+r2*r2*.3))}
 TER.ice500=ice500;
 const sdc513=(x,z,ax,az,bx,bz)=>{const px=x-ax,pz=z-az,dx=bx-ax,dz=bz-az,l=dx*dx+dz*dz,h=l?Math.min(1,Math.max(0,(px*dx+pz*dz)/l)):0;return Math.hypot(px-dx*h,pz-dz*h)};
 function ridge513(x,z){const wx=x+110*Math.sin(z*.0031+.7)+50*Math.sin(z*.0093),wz=z+110*Math.sin(x*.0027+1.9)+50*Math.sin(x*.0089);let d=1e9;for(const r of RSEG513){const v=sdc513(wx,wz,r[0],r[1],r[2],r[3]);if(v<d)d=v}const t=d/RW513;if(t>=1)return 0;const S=Math.sin,ss=(a,b,v)=>{const q=Math.min(1,Math.max(0,(v-a)/(b-a)));return q*q*(3-2*q)};
  const f=1-ss(.35,1,t),n=.72+.28*S(x*.004+S(z*.003)*2)*S(z*.0047+x*.001),cr=1-Math.abs(S(x*.013+S(z*.009)*1.7)*S(z*.012-x*.005));let h=RH513*f*n*(.8+.2*cr*cr);
  for(const g of GAP513)h*=ss(g[4]*.36,g[4],sdc513(x,z,g[0],g[1],g[2],g[3]));return h}
 function pk692(x,z){let h=0;for(const k of PK692){const d=Math.hypot(x-k[0],z-k[1]);if(d>=k[3])continue;const a=k[3],b=k[3]*k[4],t=Math.min(1,Math.max(0,(d-a)/(b-a)));h+=k[2]*t*t*(3-2*t)}return h}
 TER.pk692=pk692;TER.PK692=PK692;
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
  let hl529=15*S(x*.011+S(z*.0061)*1.7)*S(z*.0093+S(x*.0047)*1.3)*m;
  let h=(15*S(x*.011+S(z*.0061)*1.7)*S(z*.0093+S(x*.0047)*1.3)+5*S(x*.031+z*.017)*S(z*.027-x*.012)+1.2*S(x*.09+z*.05))*m+mt383(x,z)+ice500(x,z)+ridge513(x,z)+pk692(x,z);
  const ss=(a,b,v)=>{const t=Math.min(1,Math.max(0,(v-a)/(b-a)));return t*t*(3-2*t)},mix=(a,b,k)=>a+(b-a)*k;
  const b=Math.floor((x-H0)/P+.5),c=riverCenter239(b,z),SR=RIO_SRC661[b],rk=SR?ss(SR.z0-4,SR.z0+8,z):1;{const rw=(RW*(1+.22*S(z*.047+b*1.3)+.12*S(z*.113+b*2.7)))/2,rdx=Math.abs(x-c);h=mix(h,-2.4,(1-ss(rw,rw+7,rdx))*rk);if(rdx<rw)h-=2.2*(1-rdx*rdx/(rw*rw))*rk}h=pool661(x,z,h);
  const sd=seaD439(x,z);if(sd>-60)h=mix(h,seaBed439(x,z,sd),ss(-60,30,sd));const rk439=1-ss(300,600,sd);
  for(const D of TER.D.value){if(D.z<0)continue;const dd=Math.hypot(x-D.x,z-D.y),wd=1-ss(D.z,D.z+38,dd);h=mix(h,D.w,wd);hl529=mix(hl529,D.w,wd);if(D.w<0){const rr=D.z-3;if(dd<rr)h-=2.5*(1-dd*dd/(rr*rr))}}
  for(const R of TER.R.value){h=mix(h,hl529,(1-ss(5,22,sdc513(x,z,R.x,R.y,R.z,R.w)))*rk439)}{/* v661: aterros de Thalor acima do mar */const r=Math.hypot(x-TH661.x,z-TH661.z);if(r>TH661.r0-60&&r<TH661.r1+60)h=mix(h,Math.max(h,.6),1-ss(11,18,cw661(x,z)))}
  {/* v520: desfiladeiro do Marco Zero, segue a estrada sinuosa (mundo513.js) e abre/fecha; igual ao GLSL */const gc=ss(100,260,z)*(130*S(z*.005712)+52*S(z*.013369)+18*S(z*.033069)),gx=Math.abs(x-gc),gz=ss(78,118,z)*(1-ss(500,560,z)),gm=.3+.7*ss(-.2,.55,S(z*.011+1)),ga=ss(8,23,gx);h+=gz*gm*ga*(1-ss(70,170,gx))*(17+4*S(z*.045+Math.sign(x)*1.3))*(1+.16*S(z*.21+x*.11)+.09*S(z*.47-x*.23)+.05*S(z*.97+x*.41))}

  { const rx=ss(100,260,z)*(130*S(z*.005712)+52*S(z*.013369)+18*S(z*.033069));
    h=mix(h,.018*(z-72),(1-ss(9,19,Math.abs(x-rx)))*ss(65,82,z)*(1-ss(365,395,z)));
    {const u=(x-29.679420774901278)*.7428872431255049+(z-150)*.6694165698586992,v=(x-29.679420774901278)*.6694165698586992-(z-150)*.7428872431255049;h-=4.8*(1-ss(6,11,Math.abs(u)))*(1-ss(20,43,Math.abs(v)));} }
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
  if(g.attributes.terrainAnchor245||g.attributes.terrainRoad128||g.attributes.terrainBio131){const ic=TER.ice500(sphere245.center.x,sphere245.center.z)+TER.ridge513(sphere245.center.x,sphere245.center.z)+TER.pk692(sphere245.center.x,sphere245.center.z);sphere245.radius+=24+ic*.7;sphere245.center.y+=ic*.5}/* v500: cordilheira de gelo passa de 200 m */else sphere245.center.y+=TER.heightFor(o);
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
/* v629: o chao calcula o relevo 3 vezes por vertice (centro + 2 vizinhos) e reaproveita em elevacao, normal e estrada; antes eram 12 copias de terrH245 e o shader levava ~5 s para compilar */
float tgH245=0.,tgX245=0.,tgZ245=0.;void tgCompute245(vec2 p){tgH245=terrH245(p);tgX245=terrH245(p+vec2(2.,0.));tgZ245=terrH245(p+vec2(0.,2.));}
float terrainLift245(vec3 wp){if(uTerAbsolute245>.5)return 0.;
#ifdef TER_GROUND245
return tgH245;
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
float h551=terrH245(anchor);float au551=(anchor.x-29.679420774901278)*.7428872431255049+(anchor.y-150.)*.6694165698586992,av551=(anchor.x-29.679420774901278)*.6694165698586992-(anchor.y-150.)*.7428872431255049;if(uOW460.x<.5&&abs(au551)<=12.&&abs(av551)<=3.65)h551=.018*(anchor.y-72.)+.12;return h551;
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
{vec4 np245=modelMatrix*vec4(position,1.);if(uTerOn>.5){float e=1.5,hx=(tgX245-tgH245)*1.5,hz=(tgZ245-tgH245)*1.5;
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
  if(ground&&/varying float road128/.test(v)){const k=v.lastIndexOf('}');v=v.slice(0,k)+'{vec4 pw444=modelMatrix*vec4(position,1.);road128=max(road128,path444(pw444.xz));{float e529=2.,gx529=(tgX245-tgH245)*2.,gz529=(tgZ245-tgH245)*2.;float sl534=length(vec2(gx529,gz529))/(2.*e529);road128*=1.-smoothstep(.35,.75,sl534);vNy534=inversesqrt(1.+sl534*sl534);}float th446=tgH245,sm446=step(-60.,seaD439(pw444.xz));sea446=sm446*(clamp(-.9-th446,0.,1.)+clamp((-.9-th446)*.04,0.,1.));}\n'+v.slice(k);v='varying float sea446;varying float vNy534;\n'+v} /* v444: trilha e calcamento usam o visual de estrada */
  if(ground)v=v.replace(/void main\s*\(\s*\)\s*\{/,'void main(){tgCompute245((modelMatrix*vec4(position,1.)).xz);');
  sh.vertexShader=(ground?'#define TER_GROUND245\n':'')+GL+lift+v;
  /* v534: cenário instanciado (árvore, pedra) some em pontilhado a menos de 2,6 m da câmera — antes a câmera entrava no tronco e aparecia um triângulo preto */
  if(!ground&&sh.vertexShader.includes('#include <project_vertex>')&&sh.fragmentShader.includes('void main()')&&!sh.fragmentShader.includes('vCam534')){
   sh.vertexShader='varying float vCam534;\n'+sh.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\n#if defined(USE_INSTANCING)&&!defined(USE_SKINNING)\nvCam534=length(mvPosition.xyz);\n#else\nvCam534=99.;\n#endif');
   sh.fragmentShader='varying float vCam534;\n'+sh.fragmentShader.replace('void main() {','void main() {\nif(vCam534<2.6&&fract(sin(dot(floor(gl_FragCoord.xy),vec2(12.9898,78.233)))*43758.5453)>(vCam534-.5)/2.1)discard;');}
  /* v529 (Ian): o relevo aparece longe (serras no horizonte, como Skyrim): no chão a neblina pesa bem menos */
  if(ground&&sh.fragmentShader.includes('#include <fog_fragment>'))sh.fragmentShader=sh.fragmentShader.replace('#include <fog_fragment>','#ifdef USE_FOG\n#ifdef FOG_EXP2\nfloat ff529=1.0-exp(-fogDensity*fogDensity*fogDepth*fogDepth*.02);\n#else\nfloat ff529=smoothstep(fogNear,fogFar*3.,fogDepth);\n#endif\ngl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,ff529);\n#endif');
 };
 const DEF=function(sh){add.call(this,sh)};DEF.toString=()=>'terrain252';
 Object.defineProperty(T.Material.prototype,'onBeforeCompile',{configurable:true,get(){return this._obc245||DEF},set(f){if(!f||f===DEF){this._obc245=null;return}if(f._w245){this._obc245=f;return}const w=function(sh,r){f.call(this,sh,r);add.call(this,sh)};w._w245=1;w.inner=f;w.toString=()=>f.toString()+'terrain252';this._obc245=w}});
})();
