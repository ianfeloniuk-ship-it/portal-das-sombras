/* Ground albedo atlas: woodland / limestone / sand / volcanic rock. */
window.Terrain153=(()=>{
 const tex=new THREE.TextureLoader().load('models/terrenos153.png');tex.anisotropy=8;
 function apply(material){
  if(material.userData.terrain153)return material;material.userData.terrain153=true;
  const before=material.onBeforeCompile,key=material.customProgramCacheKey();
  material.onBeforeCompile=function(shader,renderer){
   before.call(this,shader,renderer);shader.uniforms.terrainAtlas153={value:tex};
   shader.fragmentShader='uniform sampler2D terrainAtlas153;\nvec3 tile153(vec2 p,vec2 tile){return texture2D(terrainAtlas153,tile+vec2(.004)+fract(p)*.492).rgb;}\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
    // Etapa 2 (Ian, 02/10): snow edge follows noise, not mesh triangles -> ragged patches that thin out.
    vec2 sq154=terrainWorld128.xz;float sn154=noise128(sq154*.09)*.55+noise128(sq154*.45)*.3+noise128(sq154*2.2)*.15;
    float snowMask154=snow154>.97?1.:smoothstep(.04,.10,snow154-(sn154*.85+.08));
    float ice153=snowMask154;
    // Same ragged cut for sand, ash and swamp (own noise offsets so the borders don't match each other).
    float sandMask154=mix154.x>.97?1.:smoothstep(.04,.10,mix154.x-(noise128(sq154*.09+17.)*.55+noise128(sq154*.45+3.)*.3+noise128(sq154*2.2+9.)*.15)*.85-.08);
    float ashMask154=mix154.y>.97?1.:smoothstep(.04,.10,mix154.y-(noise128(sq154*.09+41.)*.55+noise128(sq154*.45+29.)*.3+noise128(sq154*2.2+13.)*.15)*.85-.08);
    float wetMask154=mix154.z>.97?1.:smoothstep(.04,.10,mix154.z-(noise128(sq154*.09+63.)*.55+noise128(sq154*.45+51.)*.3+noise128(sq154*2.2+27.)*.15)*.85-.08);
    float sand153=sandMask154;
    float ash153=ashMask154;
    float wet153=wetMask154;
    vec3 earth153=tile153(terrainWorld128.xz*.13,vec2(0.,.5));
    earth153=mix(earth153,tile153(terrainWorld128.xz*.14,vec2(0.,0.)),sand153);
    earth153=mix(earth153,tile153(terrainWorld128.xz*.12,vec2(.5,0.)),ash153);
    earth153*=mix(vec3(1.),vec3(.62,.78,.70),wet153);
    earth153=mix(earth153,vec3(.78,.84,.84),ice153*.94);
    vec3 paving153=tile153(terrainWorld128.xz*.16,vec2(.5,.5));
    vec3 albedo153=mix(earth153,paving153,smoothstep(.15,.85,road128));
    diffuseColor.rgb=mix(diffuseColor.rgb,albedo153,.68);
   `);
  };material.customProgramCacheKey=()=>key+'-terrain153';material.needsUpdate=true;return material;
 }
 return {apply};
})();
