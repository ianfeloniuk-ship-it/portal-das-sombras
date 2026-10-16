/* v446 (Ian: "areia tbm gelo terra"): última camada do chão, por cima do atlas pintado (biome-materials132) e do
   terrain153. Ruído (fbm) no próprio shader: AREIA com ondulações de vento e grãos que brilham, NEVE com montes de
   neve e placas de GELO lisas, rachadas e com reflexo, TERRA com manchas de solo, pedrinhas e variação no verde.
   Estradas, trilhas e calçamento (road128) ficam como estão. */
(function () {
  'use strict';
  if (!window.BiomeMaterials132) return;
  const FN = `
float fbm446(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise128(p);p=p*2.03+vec2(17.3,9.1);a*=.5;}return v;}
float ridge446(vec2 p){return 1.-abs(noise128(p)*2.-1.);}
`;
  const COLOR = `
{vec2 q446=terrainWorld128.xz;float nat446=1.-smoothstep(.15,.8,road128);
 float sandK=1.-smoothstep(.1,.5,abs(biome131-6.));
 float iceK=max(1.-smoothstep(.1,.5,abs(biome131-4.)),1.-smoothstep(.1,.5,abs(biome131-5.)));
 float soilK=max(max(1.-smoothstep(.1,.5,abs(biome131)),1.-smoothstep(.1,.5,abs(biome131-1.))),1.-smoothstep(.1,.5,abs(biome131-2.)));
 /* areia: ondulações do vento com o desenho torto pelo fbm, dunas largas e grão brilhante */
 float warp=fbm446(q446*.045)*14.;float rip=sin(dot(q446,vec2(.82,.36))*5.2+warp);float rip2=sin(dot(q446,vec2(-.3,.9))*9.+warp*1.7);
 float dune=fbm446(q446*.012);vec3 sandC=mix(vec3(.86,.70,.47),vec3(1.,.88,.64),dune)*(.82+.22*smoothstep(-.3,1.,rip)+.06*rip2);
 sandC+=vec3(.25,.22,.16)*step(.992,hash128(floor(q446*38.)))*(.5+.5*sin(q446.x*3.+q446.y*2.));
 diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*.35+sandC*.75,sandK*nat446);
 /* neve e gelo: montes de neve; onde o fbm sobe vira placa de gelo azul, lisa e rachada */
 float drift=fbm446(q446*.09);vec3 snowC=mix(vec3(.82,.88,.96),vec3(1.,1.,1.02),drift)*(.94+.08*noise128(q446*4.));
 ice446=smoothstep(.5,.56,fbm446(q446*.03+vec2(3.1,7.7)))*iceK*nat446;
 float crack446=smoothstep(.93,.99,ridge446(q446*.55))+smoothstep(.95,.995,ridge446(q446*1.4+vec2(5.)))*.6;
 vec3 iceC=mix(vec3(.36,.6,.82),vec3(.62,.82,.96),fbm446(q446*.2))*(1.-crack446*.45);
 snowC+=vec3(.2)*step(.994,hash128(floor(q446*45.)));
 diffuseColor.rgb=mix(diffuseColor.rgb,mix(snowC,iceC,ice446/max(iceK*nat446,.001)),iceK*nat446*.9);
 /* terra: manchas de solo entre o verde, pedrinhas e variação de tom no capim */
 float soilM=smoothstep(.56,.70,fbm446(q446*.055+vec2(11.,4.)))*soilK*nat446;
 vec3 soilC=vec3(.46,.34,.22)*(.8+.35*noise128(q446*2.6));
 vec2 pc=fract(q446*2.2)-.5;float peb=step(.86,hash128(floor(q446*2.2)))*(1.-smoothstep(.12,.2,length(pc)));
 soilC=mix(soilC,vec3(.62,.6,.56),peb);
 diffuseColor.rgb*=mix(vec3(1.),mix(vec3(.88,1.,.86),vec3(1.06,1.02,.9),fbm446(q446*.07)),soilK*nat446*(1.-soilM));
 diffuseColor.rgb=mix(diffuseColor.rgb,soilC,soilM*.75);}
`;
  const ROUGH = `
roughnessFactor=mix(roughnessFactor,.16,ice446);
`;
  const g0 = BiomeMaterials132.ground;
  BiomeMaterials132.ground = function (m) {
    const r = g0.apply(this, arguments);
    if (!r || r.userData.ground446) return r;
    r.userData.ground446 = true;
    const ob = r.onBeforeCompile, key = r.customProgramCacheKey();
    r.onBeforeCompile = function (s, rr) {
      ob.call(this, s, rr);
      if (!s.fragmentShader.includes('terrainWorld128') || !s.fragmentShader.includes('#include <roughnessmap_fragment>')) return;
      s.fragmentShader = s.fragmentShader.replace('void main() {', FN + 'void main() {\nfloat ice446=0.;')
        .replace('#include <roughnessmap_fragment>', COLOR + '#include <roughnessmap_fragment>' + ROUGH);
    };
    r.customProgramCacheKey = () => key + '-ground446';
    r.needsUpdate = true;
    return r;
  };
})();
