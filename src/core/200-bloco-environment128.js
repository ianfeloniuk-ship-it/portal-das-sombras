// BEGIN ENVIRONMENT128
/* Original local environmental meshes. Shared templates; no network or generation service. */
const Environment128=(()=>{
 const cache=new Map(),pal={campos:[0x64b94d,0x398547],floresta:[0x369a5c,0x236b49],flores:[0x86c65c,0x54a34d],pantano:[0x536355,0x344c42],neve:[0x345851,0x24433d],cristal:[0x3e6970,0x31535d],deserto:[0x787354,0x5c6143],vulcao:[0x393739,0x272c2e]};
 function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
 function tree(bio='floresta',season=1,variant=0,dead=false){
  const key=[bio,season,variant,dead].join(':');if(cache.has(key))return cache.get(key);
  const willow=bio==='pantano',acacia=bio==='deserto',blossom=bio==='flores';
  const R=rng(217+variant*731),p=[],c=[],idx=[],leafIds=[],snow=bio==='neve'||bio==='cristal'||(season===3&&!['deserto','vulcao'].includes(bio)),pine=['neve','cristal'].includes(bio),bare=dead||bio==='vulcao'||(season===3&&!pine&&!acacia),bark=new THREE.Color(bio==='vulcao'?0x393438:willow?0x514c3e:acacia?0x806248:0x665244),leaf=new THREE.Color(season===2&&!pine?0xad7946:pal[bio][0]);
  function vertex(x,y,z,col,k=1){p.push(x,y,z);c.push(col.r*k,col.g*k,col.b*k)}
  function tube(points,radii,seed){const start=p.length/3,N=12;for(let j=0;j<points.length;j++){const a=new THREE.Vector3(...points[Math.max(0,j-1)]),b=new THREE.Vector3(...points[Math.min(points.length-1,j+1)]),t=b.sub(a).normalize(),u=new THREE.Vector3(0,0,1).cross(t).normalize(),v=new THREE.Vector3().crossVectors(t,u);for(let i=0;i<N;i++){const angle=i/N*Math.PI*2,r=radii[j]*(1+.17*Math.sin(i*3+seed+j*.4)),pt=new THREE.Vector3(...points[j]).addScaledVector(u,Math.cos(angle)*r).addScaledVector(v,Math.sin(angle)*r);vertex(pt.x,pt.y,pt.z,bark,.7+.3*(.5+.5*Math.sin(angle*4+seed+j*.3)));}if(j)for(let i=0;i<N;i++){const a=start+(j-1)*N+i,b=start+(j-1)*N+(i+1)%N,d=start+j*N+i,e=start+j*N+(i+1)%N;idx.push(a,d,b,b,d,e)}}}
  // Tapered curved trunk, fluted bark and shallow buttress roots inside the trunk collision footprint.
  const lean=(R()-.5)*(willow?1.05:acacia?.85:.45);
  tube([[0,-.04,0],[.08,.23,.03],[-.07,.8,.02],[lean,1.5,.06],[lean+.16,2.15,.02],[lean+.04,2.85,-.06],[lean+.22,3.5,.04]],[.29,.25,.17,.14,.11,.07,.018],variant);
  for(let k=0;k<5;k++){const a=k*1.256+R()*.25;tube([[0,.42,0],[Math.cos(a)*.22,.12,Math.sin(a)*.22],[Math.cos(a)*.37,.015,Math.sin(a)*.37]],[.115,.085,.014],k)}
  function crown(x,y,z,rx,ry,rz,col,seed){const start=p.length/3,U=8,V=4;for(let j=0;j<=V;j++){const v=j/V*Math.PI;for(let i=0;i<=U;i++){const u=i/U*Math.PI*2,noise=1+.12*Math.sin(u*5+v*4+seed)+.085*Math.cos(u*3-v*6),nx=Math.sin(v)*Math.cos(u),ny=Math.cos(v),nz=Math.sin(v)*Math.sin(u),color=snow&&ny>.15?new THREE.Color(0xd8e4e4):col;vertex(x+nx*rx*noise,y+ny*ry*noise,z+nz*rz*noise,color,.70+.28*(ny*.5+.5)+.05*Math.sin(u*7+v*5));if(j<V&&i<U){const a=start+j*(U+1)+i;idx.push(a,a+1,a+U+1,a+1,a+U+2,a+U+1)}}}}
  const branches=pine?12:willow?9:acacia?6:9;
  for(let k=0;k<branches;k++){const angle=k*2.399+variant*.71,y=pine?1.05+k*.20:acacia?2.05+(k%2)*.27:1.3+(k%3)*.5,reach=pine?1.20-k*.075:acacia?1.18+R()*.22:willow?1.03+R()*.24:.78+R()*.34,ex=Math.cos(angle)*reach+lean,ez=Math.sin(angle)*reach,ey=pine?y+.05:acacia?3.04+R()*.12:y+.65+R()*.32;
   tube([[lean*.5,y,0],[ex*.5,y+.23,ez*.5],[ex,ey,ez],[ex*1.16,ey+.26,ez*1.16]],[.095,.062,.033,.005],k+2);
   if(bare){tube([[ex*.62,y+.36,ez*.62],[ex*.8+.18,ey+.3,ez*.8-.14],[ex*.91+.29,ey+.53,ez*.91-.18]],[.036,.02,.003],k+11);if(snow)crown(ex*.6,y+.29,ez*.6,.22,.045,.17,new THREE.Color(0xe1e8e8),k);continue}
   const shade=leaf.clone().lerp(new THREE.Color(pal[bio][1]),R()*.36);
   for(let cl=0;cl<5;cl++){const ca=cl*2.4+k,cr=cl===0?0:.34;
    crown(ex*.85+Math.cos(ca)*cr,ey+.10+Math.sin(cl*1.7)*.13,ez*.85+Math.sin(ca)*cr,pine?.30:acacia?.44:.40,pine?.18:acacia?.15:.31,pine?.28:acacia?.39:.36,shade.clone().multiplyScalar(.66+cl*.045),k+cl*7);
   }
   // Individual sculpted leaf sprays break up the outer silhouette without transparent cards.
   for(let f=0;f<(pine?38:54);f++){const a=R()*Math.PI*2,rad=Math.sqrt(R())*(pine?.57:acacia?.86:.76),xx=ex*.85+Math.cos(a)*rad,zz=ez*.85+Math.sin(a)*rad,yy=ey+.10+Math.sqrt(Math.max(0,1-rad*rad))*.26+R()*.13;
    const b=p.length/3,l=.10+R()*.13,co=snow?new THREE.Color(0xcbdcde):blossom&&season===0&&R()>.55?new THREE.Color(0xc390a0):shade.clone().multiplyScalar(.75+R()*.5),dx=Math.cos(a)*l,dz=Math.sin(a)*l;
    vertex(xx-dx,yy-.07,zz-dz,co,.7);vertex(xx-dz*.5,yy+.025,zz+dx*.5,co);vertex(xx+dx,yy,zz+dz,co);vertex(xx+dz*.5,yy-.035,zz-dx*.5,co,.85);idx.push(b,b+1,b+2,b,b+2,b+3,b+2,b+1,b,b+3,b+2,b);leafIds.push(b,b+1,b+2,b+3);
   }
   if(willow){
    // Curtains of tapered leafy branchlets, open between strands for visibility.
    for(let v=0;v<5;v++){const a=angle+(v-2)*.24,xx=ex*.88+Math.cos(a)*.32,zz=ez*.88+Math.sin(a)*.32,len=.65+R()*.65;
     tube([[xx,ey+.1,zz],[xx+.06,ey-len*.5,zz+.08],[xx+.09,ey-len,zz+.14]],[.013,.008,.002],v+k);
     for(let j=0;j<7;j++){const b=p.length/3,yy=ey-j*len/7,wide=.08*(1-j/10),cx=xx+.06,cz=zz+.08,co=shade.clone().multiplyScalar(.82+j*.018);
      vertex(cx-wide,yy+.035,cz,co,.8);vertex(cx,yy+.09,cz+.025,co);vertex(cx+wide,yy+.025,cz,co,.9);vertex(cx,yy-.15,cz+.05,co,.72);idx.push(b,b+1,b+2,b,b+2,b+3,b+2,b+1,b,b+3,b+2,b);leafIds.push(b,b+1,b+2,b+3);
     }
    }
   }
  }
  if(!bare)crown(lean+.13,3.39,0,pine?.35:.49,pine?.40:.24,pine?.35:.42,leaf,19);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));g.setIndex(idx);g.computeVertexNormals();g.computeBoundingBox();const box=g.boundingBox;
  // Two-sided leaf faces share indices; give their cancelled normals a stable upward direction.
  const normals=g.attributes.normal;for(let n=0;n<normals.count;n++)if(Math.hypot(normals.getX(n),normals.getY(n),normals.getZ(n))<.01)normals.setXYZ(n,0,1,0);for(const n of leafIds)normals.setXYZ(n,0,1,0);
  const out={p:g.attributes.position.array,n:g.attributes.normal.array,c:g.attributes.color.array,i:g.index.array,nv:p.length/3,min:box.min.toArray(),max:box.max.toArray(),h:box.max.y-box.min.y,w:Math.max(box.max.x-box.min.x,box.max.z-box.min.z)};g.dispose();cache.set(key,out);return out;
 }
 /* v244: sombras de nuvens andando no chão */
 function groundMaterial(bio){const m=groundMaterial0(bio),ob=m.onBeforeCompile;m.onBeforeCompile=function(sh,r){ob.call(this,sh,r);sh.vertexShader='#define TER_NORMAL245\n'+sh.vertexShader;sh.uniforms.uCl244=typeof ENV!=='undefined'?ENV.wind:{value:0};sh.fragmentShader='uniform float uCl244;\n'+sh.fragmentShader.replace('#include <emissivemap_fragment>',`{vec2 cq=terrainWorld128.xz*.012+vec2(uCl244*.018,uCl244*.007);float cl=noise128(cq)*.65+noise128(cq*2.3+7.)*.35;diffuseColor.rgb*=1.-.26*smoothstep(.52,.7,cl);}
 #include <emissivemap_fragment>`)};return m}
 function groundMaterial0(bio='campos'){const m=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.96});m.defaultAttributeValues={...m.defaultAttributeValues,terrainRoad128:[0],terrainSnow154:[bio==='neve'||bio==='cristal'?1:0],terrainMix154:[bio==='deserto'?1:0,bio==='vulcao'?1:0,bio==='pantano'?1:0],terrainBio131:[['campos','floresta','flores','pantano','neve','cristal','deserto','vulcao'].indexOf(bio)]};m.onBeforeCompile=s=>{
  s.vertexShader='attribute float terrainRoad128;attribute float terrainBio131;attribute float terrainSnow154;attribute vec3 terrainMix154;varying float snow154;varying vec3 mix154;varying float biome131;varying float road128;varying vec3 terrainWorld128;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nterrainWorld128=(modelMatrix*vec4(position,1.)).xyz;road128=terrainRoad128;biome131=terrainBio131;snow154=terrainSnow154;mix154=terrainMix154;');
  s.fragmentShader=`varying float snow154;varying vec3 mix154;varying float road128;varying float biome131;varying vec3 terrainWorld128;
  float hash128(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  uniform vec4 uTerR[24];
  float noise128(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash128(i),hash128(i+vec2(1,0)),f.x),mix(hash128(i+vec2(0,1)),hash128(i+vec2(1,1)),f.x),f.y);}
  `+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   {/* v512 (Ian): trilha de terra estreita (3-4 m) pelo segmento real da estrada + rocha lascada nas encostas */
    vec2 tp=terrainWorld128.xz;float dmin=1e9;
    for(int i=0;i<24;i++){vec4 R=uTerR[i];vec2 ab=R.zw-R.xy;vec2 qq=R.xy+ab*clamp(dot(tp-R.xy,ab)/max(dot(ab,ab),1e-4),0.,1.);dmin=min(dmin,length(tp-qq));}
    float trail=(1.-smoothstep(1.2,2.5,dmin+(noise128(tp*.9)-.5)*1.3));
    vec3 dirt=vec3(.40,.31,.21)*(.78+noise128(tp*3.1)*.3+noise128(tp*13.)*.18);
    float rut=smoothstep(.55,.95,noise128(vec2(tp.x*.8+tp.y*.8,dmin*2.4)));
    diffuseColor.rgb=mix(diffuseColor.rgb,dirt*(1.-rut*.18),trail*.94);
    mat3 Rt=transpose(mat3(viewMatrix));vec3 wn=normalize(Rt*normalize(cross(dFdx(vViewPosition),dFdy(vViewPosition))));float steep=smoothstep(.90,.66,abs(wn.y));
    vec3 pw=cameraPosition-Rt*vViewPosition;float lay=noise128(vec2((pw.x+pw.z)*.11,pw.y*.75));vec2 cu=vec2((pw.x+pw.z)*.38,pw.y*.8);cu+=(vec2(noise128(pw.xz*.31+pw.y*.4),noise128(pw.zx*.29+pw.y*.5))-.5)*4.;cu.x+=floor(cu.y)*.43;vec2 ci=floor(cu),cf=fract(cu);float blk=hash128(ci);float edgeL=min(min(cf.x,1.-cf.x),min(cf.y,1.-cf.y));float crackL=1.-smoothstep(.02,.11,edgeL+noise128(pw.xz*3.+pw.y*3.)*.05);
    vec3 rock=mix(vec3(.17,.16,.15),vec3(.58,.56,.52),blk*.75+lay*.25)*(1.-crackL*.45)*(.85+noise128(pw.xz*7.+pw.y*7.)*.3);
    rock=mix(rock,vec3(.30,.38,.20),smoothstep(.5,.92,abs(wn.y))*.3*noise128(pw.xz*.6));
    diffuseColor.rgb=mix(diffuseColor.rgb,rock,steep*(1.-trail));}
   vec2 q=terrainWorld128.xz;float broad=noise128(q*.22),grain=noise128(q*17.);vec2 cell=q*1.55;cell.x+=floor(cell.y)*.43;
   vec2 f=fract(cell);float edge=min(min(f.x,1.-f.x),min(f.y,1.-f.y));float crack=1.-smoothstep(.014,.056,edge+noise128(q*5.)*.035);
   float stone=smoothstep(.65,.80,noise128(q*.48));float detail=mix(.85+grain*.22+noise128(q*2.7)*.09, .98-crack*.28+grain*.07,road128);
   detail+=stone*.055;float snow128=smoothstep(.58,.78,max(diffuseColor.r,max(diffuseColor.g,diffuseColor.b)));detail=mix(detail,.95+grain*.06,snow128*.8);
   float natural131=1.-smoothstep(.15,.8,road128);
   float sand131=1.-smoothstep(.1,.5,abs(biome131-6.));
   float bog131=1.-smoothstep(.1,.5,abs(biome131-3.));
   float forest131=1.-smoothstep(.1,.5,abs(biome131-1.));
   float ice131=1.-smoothstep(.1,.5,abs(biome131-4.));
   float ash131=1.-smoothstep(.1,.5,abs(biome131-7.));
   float crystal131=1.-smoothstep(.1,.5,abs(biome131-5.));
   float ripples131=.5+.5*sin(q.x*8.+q.y*2.3+noise128(q*.32)*9.);
   detail*=1.+natural131*(sand131*(ripples131-.5)*.16+ice131*(ripples131-.5)*.045);
   vec3 stain131=mix(vec3(1.),vec3(.53,.59,.48),bog131*smoothstep(.36,.68,noise128(q*.31))*natural131);
   stain131=mix(stain131,vec3(.73,.61,.45),forest131*smoothstep(.5,.75,noise128(q*.8))*natural131*.6);
   stain131=mix(stain131,vec3(.57,.54,.53),ash131*crack*natural131*.6);
   stain131=mix(stain131,vec3(.65,.91,1.07),crystal131*stone*natural131*.35);
   diffuseColor.rgb*=detail*(.88+broad*.22)*stain131;

  `);
  s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
   float damp131=(1.-smoothstep(.1,.5,abs(biome131-3.)))*(1.-smoothstep(.15,.8,road128))*smoothstep(.38,.68,noise128(terrainWorld128.xz*.31));
   roughnessFactor=mix(roughnessFactor,.38,damp131);
  `);};m.customProgramCacheKey=()=> 'biome-terrain131';return typeof window!=='undefined'&&window.BiomeMaterials132?window.BiomeMaterials132.ground(m):m}
 return{tree,groundMaterial,cache};
})();

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
 const palette={campos:0x58a94b,floresta:0x39854c,flores:0x83bf55,pantano:0x3a4b40,deserto:0xb4986d,neve:0xc8d9df,cristal:0x91adb9,vulcao:0x494044},color=new THREE.Color(),other=new THREE.Color();
 const segs=roadSegs(pos.getX(0),pos.getZ(0),2),surfaces=new Float32Array(pos.count),biomes=new Float32Array(pos.count),snows=new Float32Array(pos.count),mixes=new Float32Array(pos.count*3),biomeIds=['campos','floresta','flores','pantano','neve','cristal','deserto','vulcao'];
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i),bio=biomeAt(x,z);let d=1e9;for(const city of near)d=Math.min(d,Math.hypot(x-city.x,z-city.z));const road=near.some(city=>{const cl=cityL(city),maxWallR=(cl>=8?130:cl>=6?100:70);return (Math.abs(x-city.x)<5.5||Math.abs(z-city.z)<5.5)&&Math.hypot(x-city.x,z-city.z)<maxWallR});
  color.setHex(palette[bio]);if(!['neve','cristal','deserto','vulcao'].includes(bio)){if(season===0)color.lerp(other.setHex(0x70bc58),.18);if(season===2)color.lerp(other.setHex(0x896542),.38);if(season===3)color.lerp(other.setHex(0xd6e1e2),.88)}
  color.multiplyScalar(.85+WN(x*.065,z*.065)*.25);
  if(road)color.setHex(season===3&&!['deserto','vulcao'].includes(bio)?0xa2aaa8:0x827866);
  if(d<31)color.lerp(other.setHex(0x8c897d),clamp((31-d)/3,0,1));
  biomes[i]=season===3&&!['deserto','vulcao'].includes(bio)?4:biomeIds.indexOf(bio);{const m=biomeMix154(x,z),w=season===3&&!['deserto','vulcao'].includes(bio);snows[i]=w?1:Math.min(1,m.snow+m.crystal);mixes[i*3]=m.sand;mixes[i*3+1]=m.ash;mixes[i*3+2]=m.wet}col.setXYZ(i,color.r,color.g,color.b);surfaces[i]=d<31?1:road?.62:0;
 }col.needsUpdate=true;pg.setAttribute('terrainRoad128',new THREE.BufferAttribute(surfaces,1));pg.setAttribute('terrainBio131',new THREE.BufferAttribute(biomes,1));pg.setAttribute('terrainSnow154',new THREE.BufferAttribute(snows,1));pg.setAttribute('terrainMix154',new THREE.BufferAttribute(mixes,3));
};
envGroundMat=function(){return GMAT2||(GMAT2=Environment128.groundMaterial())};
// Natural dungeon floors use the same stone/soil finish with their existing biome colors.
habitatFloor124=function(bio){return HABITAT_FLOORS124[bio]||(HABITAT_FLOORS124[bio]=Environment128.groundMaterial(bio))};

if(window.BiomeMaterials132)BiomeMaterials132.tree(TREEMAT);

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

// END ENVIRONMENT128
