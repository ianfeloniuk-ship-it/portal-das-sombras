/* Local Aster art study. Preserve Village129 occlusion and Environment128 terrain. */
window.AsterMaterials130=(()=>{
 let atlas;
 function texture(){
  if(!atlas){atlas=new THREE.TextureLoader().load('models/aster-materiais130.png',undefined,undefined,e=>console.error('Materiais de Aster não carregaram',e));atlas.anisotropy=4;}
  return atlas;
 }
 const sampling=`
 uniform sampler2D asterAtlas130;
 vec3 asterSample130(vec2 uv,vec2 tile){return texture2D(asterAtlas130,tile+vec2(.012)+fract(uv)*.476).rgb;}
 vec3 asterDetail130(vec2 uv,vec2 tile,vec3 average){return clamp(asterSample130(uv,tile)/average,vec3(.38),vec3(1.7));}
 `;
 function chain(material,type){
  if(material.userData.aster130)return material;
  material.userData.aster130=true;
  const before=material.onBeforeCompile,cache=material.customProgramCacheKey;
  material.onBeforeCompile=function(s,renderer){
   before.call(this,s,renderer);s.uniforms.asterAtlas130={value:texture()};
   s.fragmentShader=sampling+s.fragmentShader;
   if(type==='buildings'){
    s.vertexShader='varying vec3 asterNormal130;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nasterNormal130=normalize(mat3(modelMatrix)*normal);');
    s.fragmentShader='varying vec3 asterNormal130;\n'+s.fragmentShader;
    s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
     float area130=1.;
     float mx130=max(vColor.r,max(vColor.g,vColor.b));
     float glass130=step(.90,vColor.r)*step(.50,vColor.g)*(1.-step(.53,vColor.b));
     vec2 tile130=vec2(0.,.5);vec3 avg130=vec3(.56,.535,.48);float scale130=.48;float shade130=.92;
     if(vColor.r>vColor.b*1.40&&mx130<.57){tile130=vec2(.5,.5);avg130=vec3(.365,.28,.19);scale130=.48;shade130=.86;}
     else if(vColor.b>vColor.r*1.16&&mx130<.60){tile130=vec2(.5,0.);avg130=vec3(.28,.32,.36);scale130=.55;shade130=.92;}
     else if(mx130>.64&&mx130<.95){tile130=vec2(0.,0.);avg130=vec3(.76,.66,.51);scale130=.27;shade130=.88;}
     vec3 weights130=pow(abs(asterNormal130),vec3(6.));weights130/=max(dot(weights130,vec3(1.)),.001);
     vec3 wear130=asterDetail130(villageP129.yz*scale130,tile130,avg130)*weights130.x
       +asterDetail130(villageP129.xz*scale130,tile130,avg130)*weights130.y
       +asterDetail130(villageP129.xy*scale130,tile130,avg130)*weights130.z;
     diffuseColor.rgb*=mix(vec3(1.),wear130*shade130,area130*(1.-glass130)*.88);
    `);
   }else{
    s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
     float area130=smoothstep(.8,1.,road128);
     vec3 wear130=asterDetail130(terrainWorld128.xz*.60,vec2(0.,.5),vec3(.56,.535,.48));
     diffuseColor.rgb*=mix(vec3(1.),wear130*.90,area130*.88);
    `);
   }
  };
  const oldKey=cache.call(material);
  material.customProgramCacheKey=()=>oldKey+'-aster-atlas130-'+type;
  material.needsUpdate=true;return material;
 }
 return{buildings:m=>chain(m,'buildings'),ground:m=>chain(m,'ground')};
})();
