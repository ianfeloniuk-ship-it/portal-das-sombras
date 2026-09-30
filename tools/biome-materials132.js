/* Painted terrain and foliage, shared atlas; preserve wind and actor occlusion. */
window.BiomeMaterials132=(()=>{
 let atlas;function texture(){if(!atlas){atlas=new THREE.TextureLoader().load(window.BIOME132_ATLAS||'models/materiais-biomas132.png');atlas.anisotropy=8;}return atlas;}
 const sampling=`uniform sampler2D biomeAtlas132;
 vec3 tile132(vec2 p,vec2 tile){return texture2D(biomeAtlas132,tile+vec2(.009)+fract(p)*.482).rgb;}
 vec3 tri132(vec3 p,vec3 n,vec2 tile){vec3 w=pow(abs(n),vec3(4.));w/=max(dot(w,vec3(1.)),.001);return tile132(p.yz,tile)*w.x+tile132(p.xz,tile)*w.y+tile132(p.xy,tile)*w.z;}
 `;
 function apply(m,kind){if(m.userData.biome132)return m;m.userData.biome132=true;const before=m.onBeforeCompile,oldKey=m.customProgramCacheKey();m.onBeforeCompile=function(s,r){before.call(this,s,r);s.uniforms.biomeAtlas132={value:texture()};s.fragmentShader=sampling+s.fragmentShader;
 if(kind==='tree'){
 s.vertexShader='varying vec3 surfaceP132;varying vec3 surfaceN132;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nsurfaceP132=(modelMatrix*vec4(position,1.)).xyz;surfaceN132=normalize(mat3(modelMatrix)*normal);');
 s.fragmentShader='varying vec3 surfaceP132;varying vec3 surfaceN132;\n'+s.fragmentShader;
 s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 float bark132=step(vColor.g*1.12,vColor.r);float snow132=smoothstep(.63,.82,min(vColor.r,min(vColor.g,vColor.b)));
 vec3 painted132=tri132(surfaceP132*vec3(.67,.35,.67),surfaceN132,vec2(0.,.5));
 vec3 leaves132=tri132(surfaceP132*.58,surfaceN132,vec2(.5,.5));
 vec3 tint132=mix(leaves132/max(vec3(.25,.30,.17),vec3(.01)),painted132/vec3(.36,.25,.16),bark132);
 diffuseColor.rgb*=mix(vec3(1.),clamp(tint132,vec3(.32),vec3(2.15)),.88*(1.-snow132));
 `);
 }else{
 s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 float road132=smoothstep(.15,.85,road128);float snow132=1.-smoothstep(.1,.7,abs(biome131-4.));float sand132=1.-smoothstep(.1,.7,abs(biome131-6.));float ash132=1.-smoothstep(.1,.7,abs(biome131-7.));
 vec3 soil132=tile132(terrainWorld128.xz*.24,vec2(0.,0.));vec3 sandtex132=tile132(terrainWorld128.xz*.22,vec2(.5,0.));
 vec3 detail132=mix(soil132/vec3(.29,.25,.15),sandtex132/vec3(.66,.49,.29),sand132);
 float mono132=dot(detail132,vec3(.299,.587,.114));detail132=mix(detail132,vec3(mono132),max(snow132,ash132));
 diffuseColor.rgb*=mix(vec3(1.),clamp(detail132,vec3(.38),vec3(1.85)),(1.-road132)*mix(.55+.28*noise128(terrainWorld128.xz*.11),.20,snow132));
 `);
 }
 };m.customProgramCacheKey=()=>oldKey+'-painted132-'+kind;m.needsUpdate=true;return m;}
 return{tree:m=>apply(m,'tree'),ground:m=>apply(m,'ground')};
})();
