/* v626 (Ian, 26/10/2026: "o chão é meio feio; a pedra é tudo uma coisa só, o deserto também, a neve também"):
   chão realista medieval por bioma. Camada final do shader do chão, por cima do atlas (biome-materials132), do terrain153 e do ground446.
   Mistura por inclinação (encosta = rocha com estrato e fendas), altura (alto = rocha nua), umidade (musgo, lama, poça), ruído em várias
   escalas (sem repetir padrão) e distância (detalhe de perto, variação larga de longe). Usa as máscaras com borda irregular do terrain153
   (neve/areia/cinza/pântano) para transição suave entre biomas. Relevo de pedrinha/duna/estrato por mapa de altura calculado no shader. */
(function () {
  'use strict';
  if (!window.BiomeMaterials132) return;
  window.RAIN626=window.RAIN626||{wet:{value:0},pud:{value:0},k:0,wind:.25};
  const FN = `
uniform float uWet626;uniform float uPud626;uniform float uFlood626;float mudK626=0.;float trail626=0.;float hb626=0.;float emb626=0.;float pud626=0.;float roughK626=0.;
float f626(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*noise128(p);p=p*2.07+vec2(13.1,7.7);a*=.5;}return v/.875;}
float rg626(vec2 p){return 1.-abs(noise128(p)*2.-1.);}
vec2 pb626(vec2 p){vec2 i=floor(p),f=fract(p);float h=hash128(i);vec2 c=vec2(hash128(i+7.1),hash128(i+13.3))*.56+.22;float r=.14+.2*hash128(i+3.7);float d=length(f-c);float m=step(.5,h)*(1.-smoothstep(r*.55,r,d));return vec2(m,hash128(i+21.));}
`;
  const COLOR = `
{vec2 q=terrainWorld128.xz;float nat=1.-smoothstep(.15,.8,road128);float tk=nat*(1.-trail626);
 float dist=length(vViewPosition);float nf=1.-smoothstep(25.,95.,dist);float mf=1.-smoothstep(110.,420.,dist);
 mat3 Rt6=transpose(mat3(viewMatrix));vec3 pw6=cameraPosition-Rt6*vViewPosition;
 float sl=vNy534;float steep=smoothstep(.97,.72,sl);
 float snowW=clamp(snowMask154,0.,1.),sandW=clamp(sandMask154,0.,1.)*(1.-snowW),ashW=clamp(ashMask154,0.,1.)*(1.-snowW)*(1.-sandW),wetW=clamp(wetMask154,0.,1.)*(1.-snowW)*(1.-sandW)*(1.-ashW);
 float grassW=max(0.,1.-snowW-sandW-ashW-wetW);
 float forestK=1.-smoothstep(.1,.5,abs(biome131-1.));
 float macro=f626(q*.006+vec2(3.,9.)),macro2=f626(q*.021+vec2(41.,5.));
 vec3 base=diffuseColor.rgb;
 base*=.9+.2*macro+.06*(macro2-.5);
 float hb=0.;
 /* ---- campo, flores, floresta: terra, grama, folhas, raízes e pedras ---- */
 if(grassW>.01){float dry=f626(q*.033+vec2(5.,2.));float pat6=smoothstep(.5,.64,dry+steep*.35+(forestK*.08));
  float ln=noise128(q*2.9);vec3 loam=mix(vec3(.28,.19,.12),vec3(.46,.33,.2),ln)*(.8+.4*noise128(q*11.)*nf+.2*(1.-nf));
  vec2 pc=pb626(q*3.2);loam=mix(loam,vec3(.5,.47,.42)*(.75+.4*pc.y),pc.x*.8*nf);hb+=pc.x*.05*nf;
  float lit=smoothstep(.45,.62,f626(q*.09+vec2(3.)))*forestK;vec2 lc=floor(q*13.);vec3 leaf=mix(vec3(.36,.22,.09),vec3(.58,.4,.14),hash128(lc));leaf=mix(leaf,vec3(.26,.19,.09),hash128(lc+5.)*.5);leaf*=.8+.3*noise128(q*30.)*nf;
  float rootL=smoothstep(.94,.985,rg626(q*.75+vec2(f626(q*.3)*2.)))*forestK*nf;
  vec3 ground=mix(loam,leaf,lit);ground=mix(ground,vec3(.17,.11,.07),rootL*.8);hb+=rootL*.1+lit*noise128(q*26.)*.02*nf;
  base=mix(base,ground,clamp(pat6+lit*.55,0.,1.)*.88*grassW*tk);
  base*=1.+(noise128(q*9.)-.5)*.16*nf*grassW*(1.-pat6);}
 /* ---- pântano: lama brilhante, poças e alga ---- */
 if(wetW>.01){vec3 mud=mix(vec3(.12,.095,.06),vec3(.22,.17,.1),noise128(q*1.7))*(.85+.3*noise128(q*8.)*nf);
  float pdl=smoothstep(.54,.62,f626(q*.055+vec2(2.,8.)));pud626=pdl*wetW*nat;
  vec3 water=mix(vec3(.07,.12,.11),vec3(.15,.22,.2),f626(q*.4));vec3 algae=vec3(.2,.3,.12);
  mud=mix(mud,algae,smoothstep(.55,.7,f626(q*.12+vec2(9.)))*.6);
  vec3 sw=mix(mud,water,pdl);sw=mix(sw,mud*.6,smoothstep(.0,.35,pdl)*(1.-pdl)*.8);
  base=mix(base,sw,wetW*.92*nat);hb-=pdl*.12*wetW;hb+=(noise128(q*5.)-.5)*.05*nf*wetW;roughK626=max(roughK626,wetW*.5);}
 /* ---- deserto: duna com crista clara, ondulação, cascalho e rocha aparecendo ---- */
 if(sandW>.01){vec2 dir=normalize(vec2(.82,.36));float wp=f626(q*.012)*9.;float s=dot(q,dir)*.034+wp;float prof=.5+.5*sin(s);float crest=pow(prof,3.);
  float rip=sin(dot(q,vec2(-.3,.9))*5.5+f626(q*.05)*9.+sin(s)*2.)*.5+.5;
  vec3 sand=mix(mix(vec3(.42,.28,.16),vec3(.58,.42,.25),prof),vec3(.78,.62,.4),crest);sand=mix(sand,sand*vec3(1.12,.86,.7),smoothstep(.45,.65,f626(q*.011+vec2(21.)))*.6);sand*=1.-.22*smoothstep(.56,.7,f626(q*.045+vec2(8.)))+.0;sand*=.9+.2*noise128(q*5.5)*nf;
  sand*=.9+.12*f626(q*.15)+(rip-.5)*.1*nf;sand+=vec3(.2,.17,.1)*step(.993,hash128(floor(q*40.)))*nf;
  float gr=smoothstep(.5,.62,f626(q*.028+vec2(4.)))*(1.-crest*.6);vec2 pc=pb626(q*2.6);vec3 gv=mix(vec3(.42,.33,.25),vec3(.6,.5,.4),pc.y);
  sand=mix(sand,mix(sand*.72,gv,pc.x),gr*.85);hb+=(rip-.5)*.07*nf+crest*.5*0.+pc.x*gr*.05*nf;
  base=mix(base,sand,sandW*.95*tk+sandW*.45*(1.-tk));}
 /* ---- vulcão: basalto, cinza e brasas ---- */
 if(ashW>.01){vec3 bas=mix(vec3(.1,.09,.09),vec3(.24,.22,.21),f626(q*.11))*(.8+.35*noise128(q*7.)*nf);
  float ashp=smoothstep(.5,.64,f626(q*.04+vec2(15.)));vec3 ash=mix(vec3(.3,.29,.28),vec3(.46,.45,.44),noise128(q*3.))*(.85+.25*noise128(q*16.)*nf);
  vec3 vc=mix(bas,ash,ashp);vec2 wq=q+vec2(f626(q*.07),f626(q*.07+9.))*8.;
  float cr=smoothstep(.985,.998,rg626(wq*.16))*(1.-ashp*.85)+smoothstep(.985,.998,rg626(wq*.42+vec2(4.)))*.5*nf*(1.-ashp);
  emb626=cr*ashW*nat*(.5+.4*f626(q*.5));vc=mix(vc,vec3(.04,.03,.03),cr*.5);
  float sp=step(.996,hash128(floor(q*26.)))*nf*(1.-ashp);emb626+=sp*ashW*.8;
  base=mix(base,vc,ashW*.94*nat);hb+=cr*-.05*nf*ashW+(noise128(q*6.)-.5)*.04*nf*ashW;}
 /* ---- neve: variação, azul nos baixios, rocha e terra nas encostas e onde o vento varre ---- */
 if(snowW>.01){float sh=f626(q*.05+vec2(30.));float hol=smoothstep(.62,.4,f626(q*.017+vec2(7.)));
  vec3 sn=mix(vec3(.74,.84,.95),vec3(.98,.99,1.),sh);sn=mix(sn,vec3(.62,.76,.92),hol*.55);
  float sas=sin(dot(q,vec2(.7,.71))*2.3+f626(q*.3)*6.)*.5+.5;sn*=.97+.05*sas*nf;sn+=vec3(.16)*step(.995,hash128(floor(q*42.)))*nf;
  float bare=smoothstep(.62,.72,f626(q*.07+vec2(1.,3.)))*(.35+steep*.9);vec3 under=mix(vec3(.3,.26,.22),vec3(.42,.4,.38),noise128(q*3.))*(.8+.3*noise128(q*12.)*nf);
  sn=mix(sn,under,clamp(bare,0.,1.)*.85);hb+=sas*.05*nf*(1.-bare)+bare*noise128(q*8.)*.05*nf;
  base=mix(base,sn,snowW*.93*nat);}
 /* ---- rocha: encosta e altura, estrato horizontal, fendas, cascalho no pé, musgo ---- */
 {float alt=smoothstep(42.,120.,pw6.y+(macro2-.5)*40.)*(1.-snowW*.5);float rw=clamp(steep+alt*.55*smoothstep(.95,.8,sl),0.,1.)*tk;
  if(rw>.01){vec3 pal=vec3(.38,.35,.31);pal=mix(pal,vec3(.7,.44,.28),sandW);pal=mix(pal,vec3(.15,.14,.14),ashW);pal=mix(pal,vec3(.5,.53,.58),snowW);pal=mix(pal,vec3(.34,.33,.28),wetW);
   float band=.5*noise128(vec2(pw6.y*1.7,3.))+.3*noise128(vec2(pw6.y*6.1,11.))+.2*noise128(vec2(pw6.y*17.,5.));
   float lay=floor(pw6.y*1.3+f626(pw6.xz*.04)*2.);vec3 rc=pal*(.62+.7*band)*(.9+.2*hash128(vec2(lay,3.)));
   rc=mix(rc,rc*vec3(1.08,.96,.84),hash128(vec2(lay,9.)));
   float fis=smoothstep(.04,.0,abs(noise128(vec2((pw6.x+pw6.z)*1.9+pw6.y*.15,pw6.y*.5))-.5)-.015)*smoothstep(.3,.9,noise128(pw6.xz*.3));
   rc*=1.-fis*.55*(.5+.5*nf);rc*=.85+.25*noise128(pw6.xz*5.+pw6.y*4.)*nf+.1*(1.-nf);
   float up=smoothstep(.55,.86,sl);float moss=smoothstep(.52,.74,f626(q*.08+vec2(5.,2.)))*up*(1.-sandW)*(1.-ashW)*(1.-snowW)*(1.-.4*steep);
   rc=mix(rc,mix(vec3(.2,.29,.11),vec3(.3,.38,.15),noise128(q*6.)),moss*.6*(.4+.6*nf));
   base=mix(base,rc,rw*.9);roughK626=max(roughK626,rw*.3);}
  float foot=smoothstep(.985,.93,sl)*smoothstep(.62,.88,sl)*(1.-steep)*tk*(1.-snowW*.7);
  if(foot>.01){vec2 p1=pb626(q*2.1),p2=pb626(q*5.3+vec2(9.));float pm=max(p1.x,p2.x);vec3 pc=mix(vec3(.38,.34,.3),vec3(.62,.58,.52),mix(p1.y,p2.y,step(p1.x,p2.x)));pc=mix(pc,pc*vec3(1.1,.8,.62),sandW);pc=mix(pc,pc*.4,ashW);
   base=mix(base,mix(base*.78,pc,pm),foot*.8*(.35+.65*nf));hb+=pm*.07*nf*foot;}}
 diffuseColor.rgb=mix(diffuseColor.rgb,base,.94);hb626=hb*nf;
}
`;
  const ROUGH = `
{/* chuva: chão molhado escurece e brilha; poça nos baixios planos e nas ruas, enche devagar e seca devagar */
 vec2 qw=terrainWorld128.xz;float flat6=smoothstep(.955,.99,vNy534);float wetK=uWet626*(1.-.5*snowMask154);
 float bn=f626(qw*.03+vec2(60.))*.55+f626(qw*.2+vec2(5.))*.45+(f626(qw*.7+vec2(9.))-.5)*.25+smoothstep(.2,.8,road128)*.18;float bt=.7-.16*uPud626;float basin=smoothstep(bt,bt+.05,bn);
 float pd=basin*flat6*uPud626;pud626=max(pud626,pd);
 diffuseColor.rgb*=1.-.5*wetK;diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.15,.2,.26),clamp(pd*1.5,0.,.9));
 roughnessFactor=mix(roughnessFactor,.28,wetK*.75);}
roughnessFactor=mix(roughnessFactor,.3,clamp(mudK626,0.,1.));
roughnessFactor=mix(roughnessFactor,.97,roughK626*(1.-pud626));roughnessFactor=mix(roughnessFactor,.05,clamp(pud626*1.3,0.,1.));
`;
  const EMIS = `
#include <emissivemap_fragment>
totalEmissiveRadiance+=vec3(1.,.32,.04)*emb626*1.5+vec3(.09,.12,.17)*pud626;
`;
  const BUMP = `
#include <normal_fragment_maps>
if(hb626!=0.){vec2 dh6=vec2(dFdx(hb626),dFdy(hb626));vec3 sx6=dFdx(-vViewPosition),sy6=dFdy(-vViewPosition);vec3 r1=cross(sy6,normal),r2=cross(normal,sx6);float det6=dot(sx6,r1);vec3 g6=sign(det6)*(dh6.x*r1+dh6.y*r2);normal=normalize(abs(det6)*normal-g6*.5);}
`;
  const g0 = BiomeMaterials132.ground;
  BiomeMaterials132.ground = function (m) {
    const r = g0.apply(this, arguments);
    if (!r || r.userData.ground626) return r;
    r.userData.ground626 = true;
    const ob = r.onBeforeCompile, key = r.customProgramCacheKey();
    r.onBeforeCompile = function (s, rr) {
      ob.call(this, s, rr);
      s.uniforms.uWet626 = RAIN626.wet; s.uniforms.uPud626 = RAIN626.pud; s.uniforms.uFlood626 = RAIN626.flood || (RAIN626.flood = { value: 0 });
      let f = s.fragmentShader;
      if (!f.includes('terrainWorld128') || !f.includes('#include <roughnessmap_fragment>') || !f.includes('snowMask154') || !f.includes('vNy534') || f.includes('hb626')) return;
      const t0 = 'float trail=(1.-smoothstep(1.2,2.5,dmin+(noise128(tp*.9)-.5)*1.3));';
      if (f.includes(t0)) f = f.replace(t0, t0 + 'trail626=trail;');
      f = f.replace('void main() {', FN + 'void main() {')
        .replace('#include <roughnessmap_fragment>', COLOR + '#include <roughnessmap_fragment>' + ROUGH);
      if (f.includes('#include <emissivemap_fragment>')) f = f.replace('#include <emissivemap_fragment>', EMIS);
      if (f.includes('#include <normal_fragment_maps>')) f = f.replace('#include <normal_fragment_maps>', BUMP);
      s.fragmentShader = f;
    };
    r.customProgramCacheKey = () => key + '-ground626';
    r.needsUpdate = true;
    return r;
  };
})();
