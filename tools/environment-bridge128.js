// Integrate original sculpted templates into existing batched scenery, preserving placement and collisions.
const environmentEH128=EH;
EH=function(batch,key,x,y,z,ry,height,tint){
 if(!key.startsWith('tree_'))return environmentEH128(batch,key,x,y,z,ry,height,tint);
 const bio=L.mode==='dungeon'&&L.G&&L.G.th&&L.G.th.habitat124||biomeAt(x,z),se=seasonI(),variant=Math.abs(Math.floor(x*7+z*13))%3,dead=key.includes('dead'),id='sculpted128:'+bio+':'+se+':'+variant+':'+dead;
 if(!ENV.m[id])ENV.m[id]=Environment128.tree(bio,se,variant,dead);
 // Bark and snow have independent authored colors; old whole-tree tints must not whiten the trunk.
 return environmentEH128(batch,id,x,y,z,ry,height,undefined);
};
const environmentGroundColors128=envGroundColors;
envGroundColors=function(pg,near){
 environmentGroundColors128(pg,near);const pos=pg.attributes.position,col=pg.attributes.color,season=seasonI();
 const palette={campos:0x56664a,floresta:0x35493e,flores:0x627350,pantano:0x3a4b40,deserto:0xb4986d,neve:0xc8d9df,cristal:0x91adb9,vulcao:0x494044},color=new THREE.Color(),other=new THREE.Color();
 const segs=roadSegs(pos.getX(0),pos.getZ(0),2),surfaces=new Float32Array(pos.count),biomes=new Float32Array(pos.count),biomeIds=['campos','floresta','flores','pantano','neve','cristal','deserto','vulcao'];
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i),bio=biomeAt(x,z);let d=1e9;for(const city of near)d=Math.min(d,Math.hypot(x-city.x,z-city.z));const road=onRoad(segs,x,z)||near.some(city=>(Math.abs(x-city.x)<4.5||Math.abs(z-city.z)<4.5)&&Math.hypot(x-city.x,z-city.z)<40);
  color.setHex(palette[bio]);if(!['neve','cristal','deserto','vulcao'].includes(bio)){if(season===0)color.lerp(other.setHex(0x587452),.18);if(season===2)color.lerp(other.setHex(0x896542),.38);if(season===3)color.lerp(other.setHex(0xd6e1e2),.88)}
  color.multiplyScalar(.85+WN(x*.065,z*.065)*.25);
  if(road)color.setHex(season===3&&!['deserto','vulcao'].includes(bio)?0xa2aaa8:0x827866);
  if(d<31)color.lerp(other.setHex(0x8c897d),clamp((31-d)/3,0,1));
  biomes[i]=season===3&&!['deserto','vulcao'].includes(bio)?4:biomeIds.indexOf(bio);col.setXYZ(i,color.r,color.g,color.b);surfaces[i]=d<31?1:road?.62:0;
 }col.needsUpdate=true;pg.setAttribute('terrainRoad128',new THREE.BufferAttribute(surfaces,1));pg.setAttribute('terrainBio131',new THREE.BufferAttribute(biomes,1));
};
envGroundMat=function(){return GMAT2||(GMAT2=Environment128.groundMaterial())};
// Natural dungeon floors use the same stone/soil finish with their existing biome colors.
habitatFloor124=function(bio){return HABITAT_FLOORS124[bio]||(HABITAT_FLOORS124[bio]=Environment128.groundMaterial(bio))};

if(window.BiomeMaterials132)BiomeMaterials132.tree(TREEMAT);
