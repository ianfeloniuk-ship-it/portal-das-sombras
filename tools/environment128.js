/* Original local environmental meshes. Shared templates; no network or generation service. */
const Environment128=(()=>{
 const cache=new Map(),pal={campos:[0x536747,0x414b32],floresta:[0x304e47,0x213e38],flores:[0x697954,0x526749],pantano:[0x536355,0x344c42],neve:[0x345851,0x24433d],cristal:[0x3e6970,0x31535d],deserto:[0x787354,0x5c6143],vulcao:[0x393739,0x272c2e]};
 function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
 function tree(bio='floresta',season=1,variant=0,dead=false){
  const key=[bio,season,variant,dead].join(':');if(cache.has(key))return cache.get(key);
  const R=rng(217+variant*731),p=[],c=[],idx=[],leafIds=[],snow=bio==='neve'||bio==='cristal'||(season===3&&!['deserto','vulcao'].includes(bio)),pine=['neve','cristal'].includes(bio),bare=dead||bio==='vulcao'||(season===3&&!pine),bark=new THREE.Color(bio==='vulcao'?0x393438:0x665244),leaf=new THREE.Color(season===2&&!pine?0xad7946:pal[bio][0]);
  function vertex(x,y,z,col,k=1){p.push(x,y,z);c.push(col.r*k,col.g*k,col.b*k)}
  function tube(points,radii,seed){const start=p.length/3,N=9;for(let j=0;j<points.length;j++){const a=new THREE.Vector3(...points[Math.max(0,j-1)]),b=new THREE.Vector3(...points[Math.min(points.length-1,j+1)]),t=b.sub(a).normalize(),u=new THREE.Vector3(0,0,1).cross(t).normalize(),v=new THREE.Vector3().crossVectors(t,u);for(let i=0;i<N;i++){const angle=i/N*Math.PI*2,r=radii[j]*(1+.17*Math.sin(i*3+seed+j*.4)),pt=new THREE.Vector3(...points[j]).addScaledVector(u,Math.cos(angle)*r).addScaledVector(v,Math.sin(angle)*r);vertex(pt.x,pt.y,pt.z,bark,.7+.3*(.5+.5*Math.sin(angle*4+seed+j*.3)));}if(j)for(let i=0;i<N;i++){const a=start+(j-1)*N+i,b=start+(j-1)*N+(i+1)%N,d=start+j*N+i,e=start+j*N+(i+1)%N;idx.push(a,d,b,b,d,e)}}}
  // Tapered curved trunk, fluted bark and shallow buttress roots inside the trunk collision footprint.
  const lean=(R()-.5)*.6;
  tube([[0,-.04,0],[.08,.23,.03],[-.07,.8,.02],[lean,1.5,.06],[lean+.16,2.15,.02],[lean+.04,2.85,-.06],[lean+.22,3.5,.04]],[.29,.25,.17,.14,.11,.07,.018],variant);
  for(let k=0;k<5;k++){const a=k*1.256+R()*.25;tube([[0,.42,0],[Math.cos(a)*.22,.12,Math.sin(a)*.22],[Math.cos(a)*.37,.015,Math.sin(a)*.37]],[.115,.085,.014],k)}
  function crown(x,y,z,rx,ry,rz,col,seed){const start=p.length/3,U=12,V=6;for(let j=0;j<=V;j++){const v=j/V*Math.PI;for(let i=0;i<=U;i++){const u=i/U*Math.PI*2,noise=1+.12*Math.sin(u*5+v*4+seed)+.085*Math.cos(u*3-v*6),nx=Math.sin(v)*Math.cos(u),ny=Math.cos(v),nz=Math.sin(v)*Math.sin(u),color=snow&&ny>.15?new THREE.Color(0xd8e4e4):col;vertex(x+nx*rx*noise,y+ny*ry*noise,z+nz*rz*noise,color,.70+.28*(ny*.5+.5)+.05*Math.sin(u*7+v*5));if(j<V&&i<U){const a=start+j*(U+1)+i;idx.push(a,a+1,a+U+1,a+1,a+U+2,a+U+1)}}}}
  const branches=pine?10:7;
  for(let k=0;k<branches;k++){const angle=k*2.399+variant*.71,y=pine?1.2+k*.21:1.45+(k%3)*.48,reach=pine?1.13-k*.071:.72+R()*.35,ex=Math.cos(angle)*reach+lean,ez=Math.sin(angle)*reach,ey=pine?y+.05:y+.75+R()*.28;
   tube([[lean*.5,y,0],[ex*.5,y+.23,ez*.5],[ex,ey,ez],[ex*1.16,ey+.26,ez*1.16]],[.095,.062,.033,.005],k+2);
   if(bare){tube([[ex*.62,y+.36,ez*.62],[ex*.8+.18,ey+.3,ez*.8-.14],[ex*.91+.29,ey+.53,ez*.91-.18]],[.036,.02,.003],k+11);if(snow)crown(ex*.6,y+.29,ez*.6,.22,.045,.17,new THREE.Color(0xe1e8e8),k);continue}
   const shade=leaf.clone().lerp(new THREE.Color(pal[bio][1]),R()*.36);
   crown(ex*.85,ey+.08,ez*.85,pine?.68:.73,pine?.19:.28,pine?.58:.62,shade.clone().multiplyScalar(.68),k);
   // Individual sculpted leaf sprays break up the outer silhouette without transparent cards.
   for(let f=0;f<44;f++){const a=R()*Math.PI*2,rad=Math.sqrt(R())*.79,xx=ex*.85+Math.cos(a)*rad,zz=ez*.85+Math.sin(a)*rad,yy=ey+.10+Math.sqrt(Math.max(0,1-rad*rad))*.26+R()*.13;
    const b=p.length/3,l=.10+R()*.13,co=snow?new THREE.Color(0xcbdcde):shade.clone().multiplyScalar(.75+R()*.5),dx=Math.cos(a)*l,dz=Math.sin(a)*l;
    vertex(xx-dx,yy-.07,zz-dz,co,.7);vertex(xx-dz*.5,yy+.025,zz+dx*.5,co);vertex(xx+dx,yy,zz+dz,co);vertex(xx+dz*.5,yy-.035,zz-dx*.5,co,.85);idx.push(b,b+1,b+2,b,b+2,b+3,b+2,b+1,b,b+3,b+2,b);leafIds.push(b,b+1,b+2,b+3);
   }
  }
  if(!bare)crown(lean+.13,3.39,0,pine?.35:.49,pine?.40:.24,pine?.35:.42,leaf,19);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));g.setIndex(idx);g.computeVertexNormals();g.computeBoundingBox();const box=g.boundingBox;
  // Two-sided leaf faces share indices; give their cancelled normals a stable upward direction.
  const normals=g.attributes.normal;for(let n=0;n<normals.count;n++)if(Math.hypot(normals.getX(n),normals.getY(n),normals.getZ(n))<.01)normals.setXYZ(n,0,1,0);for(const n of leafIds)normals.setXYZ(n,0,1,0);
  const out={p:g.attributes.position.array,n:g.attributes.normal.array,c:g.attributes.color.array,i:g.index.array,nv:p.length/3,min:box.min.toArray(),max:box.max.toArray(),h:box.max.y-box.min.y,w:Math.max(box.max.x-box.min.x,box.max.z-box.min.z)};g.dispose();cache.set(key,out);return out;
 }
 function groundMaterial(){const m=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.96});m.defaultAttributeValues={...m.defaultAttributeValues,terrainRoad128:[0]};m.onBeforeCompile=s=>{
  s.vertexShader='attribute float terrainRoad128;varying float road128;varying vec3 terrainWorld128;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nterrainWorld128=(modelMatrix*vec4(position,1.)).xyz;road128=terrainRoad128;');
  s.fragmentShader=`varying float road128;varying vec3 terrainWorld128;
  float hash128(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise128(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash128(i),hash128(i+vec2(1,0)),f.x),mix(hash128(i+vec2(0,1)),hash128(i+vec2(1,1)),f.x),f.y);}
  `+s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   vec2 q=terrainWorld128.xz;float broad=noise128(q*.22),grain=noise128(q*17.);vec2 cell=q*1.55;cell.x+=floor(cell.y)*.43;
   vec2 f=fract(cell);float edge=min(min(f.x,1.-f.x),min(f.y,1.-f.y));float crack=1.-smoothstep(.014,.056,edge+noise128(q*5.)*.035);
   float stone=smoothstep(.65,.80,noise128(q*.48));float detail=mix(.85+grain*.22+noise128(q*2.7)*.09, .98-crack*.28+grain*.07,road128);
   detail+=stone*.055;float snow128=smoothstep(.58,.78,max(diffuseColor.r,max(diffuseColor.g,diffuseColor.b)));detail=mix(detail,.95+grain*.06,snow128*.8);
   diffuseColor.rgb*=detail*(.88+broad*.22);
  `);};m.customProgramCacheKey=()=> 'sculpted-terrain128';return m}
 return{tree,groundMaterial,cache};
})();
