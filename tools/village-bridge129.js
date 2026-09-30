const villageCityBase129=envCity;
envCity=function(c,g,addCol,R,fallen,cLv){
 const bio=biomeAt(c.x,c.z),snow=['neve','cristal'].includes(bio)||(seasonI()===3&&!['deserto','vulcao'].includes(bio));
 for(const key of Object.keys(ENV.m)){const kind=Village129.classify(key);if(kind)ENV.m[key]=Village129.make(kind,snow)}
 return villageCityBase129(c,g,addCol,R,fallen,cLv);
};
// Keep the established building occlusion shader; add subtle surface grain and warm window emission.
const villageShaderBase129=BLDMAT.onBeforeCompile;
BLDMAT.onBeforeCompile=function(shader){
 villageShaderBase129(shader);
 shader.vertexShader='varying vec3 villageP129;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvillageP129=(modelMatrix*vec4(position,1.)).xyz;');
 shader.fragmentShader='varying vec3 villageP129;\n'+shader.fragmentShader;
 shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
  float window129=step(.90,vColor.r)*step(.50,vColor.g)*(1.-step(.53,vColor.b));
  float grain129=fract(sin(dot(floor(villageP129*42.),vec3(17.13,81.71,47.23)))*43758.5453);
  diffuseColor.rgb*=mix(.92+grain129*.10,1.,window129);
 `).replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
  totalEmissiveRadiance+=vec3(1.,.40,.09)*window129*.48;
 `);
};
BLDMAT.customProgramCacheKey=()=> 'village129-occlusion-grain-amber';
BLDMAT.needsUpdate=true;
