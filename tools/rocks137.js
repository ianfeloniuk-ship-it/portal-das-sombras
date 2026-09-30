// Authored stone families, cached and merged into existing scenery batches.
const Rocks137=(()=>{
 const cache=new Map(),palette={campos:0x827b68,floresta:0x777867,flores:0x8d8275,pantano:0x606c60,neve:0x828f9b,cristal:0x648991,deserto:0xbb9264,vulcao:0x594f50};
 function model(bio,key,variant,season,source){
  const id=[bio,key,variant,season].join(':');if(cache.has(id))return cache.get(id);
  const g=new THREE.DodecahedronGeometry(1,1),p=g.attributes.position,colors=[],seed=variant*1.71;
  // Continuous deformation keeps duplicate edge vertices welded in position.
  for(let i=0;i<p.count;i++){
   let x=p.getX(i),y=p.getY(i),z=p.getZ(i);
   const strata=Math.sin(y*11+x*1.9+seed),warp=1+.10*Math.sin(x*5+z*4+seed)+.07*strata;
   x=x*warp+.09*y;z=z*warp-.055*y;y=y*(1+.08*Math.cos(x*4-z*3+seed));
   // Broad fracture planes and a grounded, flattened underside.
   x=Math.max(-.85,Math.min(.88,x));z=Math.max(-.84,Math.min(.87,z));y=Math.max(-.68,Math.min(.87,y));
   p.setXYZ(i,x,y,z);
  }
  g.computeBoundingBox();const bounds=g.boundingBox,sz=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
  const width=source.w,height=source.h;
  for(let i=0;i<p.count;i++){
   const x=(p.getX(i)-center.x)/Math.max(sz.x,sz.z)*width,z=(p.getZ(i)-center.z)/Math.max(sz.x,sz.z)*width,y=(p.getY(i)-bounds.min.y)/sz.y*height;
   p.setXYZ(i,x,y,z);
   const h=y/height,n=.5+.5*Math.sin(x*7.1+Math.sin(z*6.3)+y*10+seed),band=.5+.5*Math.sin(y/height*24+x*2+seed);
   const c=new THREE.Color(palette[bio]||palette.campos).multiplyScalar(.76+n*.26+band*.14);
   const vein=Math.pow(.5+.5*Math.sin(y/height*18+x*3+z*2+seed),18);
   c.lerp(new THREE.Color(bio==='vulcao'?0x9c6855:0xc2b9a1),vein*.23);
   if(['campos','floresta','flores','pantano'].includes(bio))c.lerp(new THREE.Color(bio==='pantano'?0x425c3d:0x586445),Math.max(0,1-h*2.8)*(.35+n*.35));
   if(bio==='neve'||(season===3&&!['deserto','vulcao'].includes(bio)))c.lerp(new THREE.Color(0xd7e2e4),THREE.MathUtils.smoothstep(h+n*.11,.61,.83));
   colors.push(c.r,c.g,c.b);
  }
  g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.computeVertexNormals();g.computeBoundingBox();
  const indices=new Uint16Array(p.count);for(let i=0;i<p.count;i++)indices[i]=i;
  const out={rock137:true,p:p.array,n:g.attributes.normal.array,c:g.attributes.color.array,i:indices,nv:p.count,min:g.boundingBox.min.toArray(),max:g.boundingBox.max.toArray(),h:height,w:width};
  cache.set(id,out);g.dispose();return out;
 }
 return{model,cache};
})();
const rocksEW137=EW;
EW=function(batch,key,x,y,z,ry,width,tint){
 if(!/^(rock|stone)_(small|large|tall)/.test(key)||!ENV.m[key])return rocksEW137(batch,key,x,y,z,ry,width,tint);
 const bio=L.mode==='dungeon'&&L.G?.th?.habitat124||biomeAt(x,z),variant=Math.abs(Math.floor(x*7+z*13))%4,season=seasonI(),id='rock137:'+bio+':'+key+':'+variant+':'+season;
 if(!ENV.m[id])ENV.m[id]=Rocks137.model(bio,key,variant,season,ENV.m[key]);
 // Local stone palette replaces old full-object tints; scalar darkness remains useful in ruins.
 return rocksEW137(batch,id,x,y,z,ry,width,tint!=null&&tint<=4?tint:undefined);
};

// Mark stone vertices inside the existing mixed scenery batch: zero extra draw calls.
const rockBatchGeo137=EnvBatch.prototype.geo;
EnvBatch.prototype.geo=function(){const g=rockBatchGeo137.call(this);if(!g)return g;const mask=new Float32Array(this.nv);let offset=0;for(const e of this.l){if(e.m.rock137)mask.fill(1,offset,offset+e.m.nv);offset+=e.m.nv;}g.setAttribute('rockSurface137',new THREE.BufferAttribute(mask,1));return g;};
const rockCompile137=ENVMAT.onBeforeCompile,rockKey137=ENVMAT.customProgramCacheKey();
ENVMAT.onBeforeCompile=function(s,r){rockCompile137.call(this,s,r);
 s.vertexShader='attribute float rockSurface137;varying float rockMask137;varying vec3 rockP137;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nrockMask137=rockSurface137;rockP137=(modelMatrix*vec4(position,1.)).xyz;');
 s.fragmentShader=`varying float rockMask137;varying vec3 rockP137;
 float grain137(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);vec3 a=vec3(17.13,43.71,113.5);float n=dot(i,a);return mix(mix(mix(fract(sin(n)*43758.5453),fract(sin(n+a.x)*43758.5453),f.x),mix(fract(sin(n+a.y)*43758.5453),fract(sin(n+a.x+a.y)*43758.5453),f.x),f.y),mix(mix(fract(sin(n+a.z)*43758.5453),fract(sin(n+a.x+a.z)*43758.5453),f.x),mix(fract(sin(n+a.y+a.z)*43758.5453),fract(sin(n+a.x+a.y+a.z)*43758.5453),f.x),f.y),f.z);}
 `+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 if(rockMask137>.5){float mottled=grain137(rockP137*5.);float fine=grain137(rockP137*47.);float strata=abs(sin(rockP137.y*15.+rockP137.x*2.+grain137(rockP137*2.)*5.));float seam=1.-smoothstep(.025,.085,strata);diffuseColor.rgb*=.68+mottled*.40+fine*.22;diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*.40,seam*.48);}
 `);
};ENVMAT.customProgramCacheKey=()=>rockKey137+'-stone137';ENVMAT.needsUpdate=true;
