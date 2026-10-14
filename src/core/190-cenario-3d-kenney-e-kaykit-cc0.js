/* ================= CENÁRIO 3D (Kenney e KayKit, CC0) ================= */
const ENV={ok:false,m:{},wind:{value:0},lite:GFX267.lite};
/* personagens com culling: esfera um pouco maior para não sumirem animando */
function envCull(c){const g=c.geometry;if(!g.userData.bs){if(!g.boundingSphere)g.computeBoundingSphere();g.boundingSphere=g.boundingSphere.clone();g.boundingSphere.radius*=1.5;g.userData.bs=1}c.frustumCulled=true}
function envArr(a){return a.isInterleavedBufferAttribute?a.data.array:a.array}
function envGet(a,i,k){const v=k===0?a.getX(i):k===1?a.getY(i):a.getZ(i);if(!a.normalized)return v;const A=envArr(a);
  return A instanceof Int8Array?Math.max(v/127,-1):A instanceof Uint8Array?v/255:A instanceof Int16Array?Math.max(v/32767,-1):A instanceof Uint16Array?v/65535:v}
function envParse(root){root.updateMatrixWorld(true);const nm=new THREE.Matrix3(),v=new THREE.Vector3();
  root.traverse(o=>{if(!o.isMesh)return;const g=o.geometry,P=g.attributes.position,N=g.attributes.normal,C=g.attributes.color,n=P.count;
    const p=new Float32Array(n*3),nr=new Float32Array(n*3),c=new Float32Array(n*3);nm.getNormalMatrix(o.matrixWorld);
    let x0=1e9,y0=1e9,z0=1e9,x1=-1e9,y1=-1e9,z1=-1e9;
    for(let i=0;i<n;i++){v.set(envGet(P,i,0),envGet(P,i,1),envGet(P,i,2)).applyMatrix4(o.matrixWorld);p[i*3]=v.x;p[i*3+1]=v.y;p[i*3+2]=v.z;
      if(v.x<x0)x0=v.x;if(v.y<y0)y0=v.y;if(v.z<z0)z0=v.z;if(v.x>x1)x1=v.x;if(v.y>y1)y1=v.y;if(v.z>z1)z1=v.z;
      if(N){v.set(envGet(N,i,0),envGet(N,i,1),envGet(N,i,2)).applyMatrix3(nm).normalize()}else v.set(0,1,0);nr[i*3]=v.x;nr[i*3+1]=v.y;nr[i*3+2]=v.z;
      if(C){c[i*3]=envGet(C,i,0);c[i*3+1]=envGet(C,i,1);c[i*3+2]=envGet(C,i,2)}else{c[i*3]=c[i*3+1]=c[i*3+2]=1}}
    const src=g.index?envArr(g.index):null,ix=n>65535?new Uint32Array(src?src.length:n):new Uint16Array(src?src.length:n);
    if(src)ix.set(src);else for(let i=0;i<n;i++)ix[i]=i;
    ENV.m[o.name]={p,n:nr,c,i:ix,nv:n,min:[x0,y0,z0],max:[x1,y1,z1],h:y1-y0,w:Math.max(x1-x0,z1-z0)}})}
/* junta muitos modelos numa malha só: poucos draw calls por pedaço do mundo */
class EnvBatch{constructor(){this.l=[];this.nv=0;this.ni=0}
  add(k,x,y,z,ry,sx,sy,sz,tint){const m=ENV.m[k];if(!m)return false;sx=sx||1;this.l.push({m,x,y,z,ry:ry||0,sx,sy:sy||sx,sz:sz||sx,tint});this.nv+=m.nv;this.ni+=m.i.length;return true}
  geo(){if(!this.l.length)return null;const P=new Float32Array(this.nv*3),N=new Int8Array(this.nv*3),C=new Uint8Array(this.nv*3),A=new Float32Array(this.nv*2),I=this.nv>65535?new Uint32Array(this.ni):new Uint16Array(this.ni);let vo=0,io=0;
    for(const e of this.l){const m=e.m,cs=Math.cos(e.ry),sn=Math.sin(e.ry),sx=e.sx,sy=e.sy,sz=e.sz,ex=e.x,ey=e.y,ez=e.z,uni=sx===sy&&sy===sz;let tr=255,tg=255,tb=255;
      if(e.tint!=null){if(e.tint<=4){tr=tg=tb=255*e.tint}else{tr=(e.tint>>16)&255;tg=(e.tint>>8)&255;tb=e.tint&255}}
      const mp=m.p,mn=m.n,mc=m.c,end=m.nv*3;let b=vo*3;
      for(let a=0;a<end;a+=3,b+=3){const px=mp[a]*sx,py=mp[a+1]*sy,pz=mp[a+2]*sz;P[b]=px*cs+pz*sn+ex;P[b+1]=py+ey;P[b+2]=pz*cs-px*sn+ez;A[vo*2+a/3*2]=ex;A[vo*2+a/3*2+1]=ez;
        let nx=mn[a],ny=mn[a+1],nz=mn[a+2];if(!uni){nx/=sx;ny/=sy;nz/=sz;const l=127/Math.sqrt(nx*nx+ny*ny+nz*nz);nx*=l;ny*=l;nz*=l}else{nx*=127;ny*=127;nz*=127}
        N[b]=nx*cs+nz*sn;N[b+1]=ny;N[b+2]=nz*cs-nx*sn;const r=mc[a]*tr,g=mc[a+1]*tg,bl=mc[a+2]*tb;C[b]=r>255?255:r;C[b+1]=g>255?255:g;C[b+2]=bl>255?255:bl}
      const mi=m.i;for(let i=0;i<mi.length;i++)I[io+i]=mi[i]+vo;vo+=m.nv;io+=mi.length}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('normal',new THREE.BufferAttribute(N,3,true));g.setAttribute('color',new THREE.BufferAttribute(C,3,true));g.setAttribute('terrainAnchor245',new THREE.BufferAttribute(A,2));g.userData.terrainBatch245=true;g.setIndex(new THREE.BufferAttribute(I,1));g.computeBoundingSphere();return g}
  mesh(mat){const g=this.geo();if(!g)return null;const m=new THREE.Mesh(g,mat);m.userData.terrainBatch245=!!g.userData.terrainBatch245;m.matrixAutoUpdate=false;m.updateMatrix();return m}}
/* materiais: vento nas plantas; prédios e árvores ficam vazados quando tampam o personagem */
ENV.pl={value:new THREE.Vector3()};ENV.ca={value:new THREE.Vector3()};ENV.occ={value:0};
const ENV_WIND='float hh=max(transformed.y-.3,0.),amp=hh*.03+min(hh,.8)*.08;transformed.x+=sin(uWind*1.6+transformed.x*.31+transformed.z*.17)*amp;transformed.z+=cos(uWind*1.27+transformed.z*.29+transformed.x*.11)*amp*.7;';const ENV_PUSH244='{vec2 dp=transformed.xz-uPlW.xz;float dl=length(dp),pw=smoothstep(1.7,.2,dl)*clamp(transformed.y,0.,1.2)*.8;transformed.xz+=dp/max(dl,.05)*pw;transformed.y-=pw*.35;}';/* v244: grama e flores se abrem quando o jogador passa */
function envShader(wind,see){return sh=>{let v=sh.vertexShader,f=sh.fragmentShader,add='';
  if(wind){sh.uniforms.uWind=ENV.wind;sh.uniforms.uPlW=ENV.pl;v='uniform float uWind;uniform vec3 uPlW;\n'+v;add+=ENV_WIND+(see?'':ENV_PUSH244)}
  if(see){sh.uniforms.uPl=ENV.pl;sh.uniforms.uCa=ENV.ca;sh.uniforms.uOcc=ENV.occ;v='varying vec3 vWp;\n'+v;add+='vWp=(modelMatrix*vec4(transformed,1.)).xyz;';
    f='uniform vec3 uPl;uniform vec3 uCa;uniform float uOcc;varying vec3 vWp;\n'+f.replace('void main() {','void main() {\nif(uOcc>.5){vec3 dd=uPl-uCa;float tt=dot(vWp-uCa,dd)/dot(dd,dd);if(tt>.04&&tt<.97){float rr=length(vWp-(uCa+dd*tt)),RR=mix(1.4,4.6,tt);if(rr<RR&&(rr<RR*.6||mod(floor(gl_FragCoord.x)+floor(gl_FragCoord.y),2.)<1.))discard;}}')}
  sh.vertexShader=v.replace('#include <begin_vertex>','#include <begin_vertex>\n'+add);sh.fragmentShader=f}}
// Etapa 2 (Ian): low plants stop being neon lime; their green follows the season and sits closer to the ground tone.
function floraSeason154(sh){sh.uniforms.uSeason154=window.SEASON154U||(window.SEASON154U={value:0});sh.fragmentShader='uniform float uSeason154;'+String.fromCharCode(10)+sh.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
  {vec3 c0=diffuseColor.rgb;float g154=smoothstep(.02,.12,c0.g-max(c0.r,c0.b));float l154=dot(c0,vec3(.3,.59,.11));
   vec3 tone154=uSeason154<.5?vec3(.62,.86,.42):uSeason154<1.5?vec3(.56,.74,.38):uSeason154<2.5?vec3(1.,.62,.26):vec3(.86,.9,.88);
   diffuseColor.rgb=mix(c0,(l154*1.35+.03)*tone154,g154*.85);}`)}
function envMat(wind,see){const m=new THREE.MeshLambertMaterial({vertexColors:true});m.onBeforeCompile=wind&&!see?sh=>{envShader(wind,see)(sh);floraSeason154(sh)}:envShader(wind,see);m.customProgramCacheKey=()=>'env'+(wind?1:0)+(see?1:0);return m}
const ENVMAT=envMat(false,false),FLORAMAT=envMat(true,false),TREEMAT=envMat(true,true),BLDMAT=envMat(false,true);
/* tufos de grama feitos à mão: poucas faces, muitas cópias */
function envBlades(){const P=[],N=[],C=[],I=[];const R=mulberry32(77);
  for(let b=0;b<7;b++){const a=R()*Math.PI,r=R()*.22,ox=Math.cos(a*2)*r,oz=Math.sin(a*2)*r,w=.055+R()*.04,h=.42+R()*.5,lean=(R()-.5)*.35,dx=Math.cos(a),dz=Math.sin(a);
    const tipx=ox+Math.cos(a+1.57)*lean,tipz=oz+Math.sin(a+1.57)*lean,base=P.length/3;
    P.push(ox-dx*w,0,oz-dz*w,ox+dx*w,0,oz+dz*w,tipx,h,tipz);
    const k=.85+R()*.3;C.push(.28*k,.68*k,.18*k,.28*k,.68*k,.18*k,.55*k,.88*k,.32*k);
    for(let q=0;q<3;q++)N.push(0,1,0);I.push(base,base+1,base+2,base,base+2,base+1)}
  const n=P.length/3;ENV.m.blades={p:new Float32Array(P),n:new Float32Array(N),c:new Float32Array(C),i:new Uint16Array(I),nv:n,min:[-.3,0,-.3],max:[.3,1,.3],h:.9,w:.6}}
/* textura de detalhe do chão (ruído de grama, bem sutil) */
function envGroundTex(){const s=256,c=document.createElement('canvas');c.width=c.height=s;const x=c.getContext('2d');const R=mulberry32(91);
  x.fillStyle='#d8d8d8';x.fillRect(0,0,s,s);
  for(let i=0;i<9000;i++){const v=150+R()*105|0;x.fillStyle='rgb('+v+','+v+','+v+')';const px=R()*s,py=R()*s;x.fillRect(px,py,1+R()*2,1+R()*3)}
  for(let i=0;i<260;i++){const v=120+R()*60|0;x.fillStyle='rgba('+v+','+v+','+v+',.35)';x.beginPath();x.arc(R()*s,R()*s,2+R()*7,0,6.3);x.fill()}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(8,8);t.anisotropy=4;return t}

/* ---------- cenário 3D: mundo, cidade, ruínas, masmorra ---------- */
const pk=(R,a)=>a[Math.floor(R()*a.length)];
function EH(b,k,x,y,z,ry,H,t){const m=ENV.m[k];if(!m)return 0;const s=H/m.h;b.add(k,x,y,z,ry,s,s,s,t);return s}
/* v188 (Ian): nos modelos de prédio a porta fica na lateral; giramos para a porta olhar para onde o prédio aponta. */
/* v200: na cidade os prédios viram modelos Tripo, que já têm a porta na frente; só a loja de armaduras tem a porta atrás. As casas giram no próprio código da casa Tripo. */
const DOOR188={};function doorRot188(k){return k&&k.startsWith('building_')&&!/destroyed|well|scaffold/.test(k)?(DOOR188[k]??0):0}
function EW(b,k,x,y,z,ry,W,t){const m=ENV.m[k];if(!m)return 0;ry+=doorRot188(k);const s=W/m.w;b.add(k,x,y,z,ry,s,s,s,t);return s}
const ENVG={};
function envMesh(k,mat){const m=ENV.m[k];if(!m)return new THREE.Group();if(!ENVG[k]){const b=new EnvBatch();b.add(k,0,0,0,0,1);ENVG[k]=b.geo()}return new THREE.Mesh(ENVG[k],mat||ENVMAT)}
function envOwn(parent,m){if(m){m.userData.own=1;if(m.userData.terrainBatch245)parent.userData.terrainContainer245=true;parent.add(m)}return m}
function envDispose(root){root.traverse(o=>{if(o.userData&&o.userData.own&&o.geometry)o.geometry.dispose();else if(o.isSprite&&o.material&&o.material.map){o.material.map.dispose();o.material.dispose()}})}
let GMAT2=null;let envGroundMat=()=>GMAT2||(GMAT2=new THREE.MeshLambertMaterial({vertexColors:true,map:envGroundTex()}));
const BGC=new THREE.Color();
const SEAC=[[new THREE.Color(0x2f6a4a),.14],null,[new THREE.Color(0x6a4a22),.2],[new THREE.Color(0xdde8f2),.55]];
const TREES={pine:['tree_pineRoundA','tree_pineRoundC','tree_pineTallA_detailed','tree_pineDefaultA','tree_cone'],
  leaf:['tree_default','tree_oak','tree_detailed','tree_fat','tree_tall','tree_simple','tree_thin','tree_plateau','tree_default_dark','tree_oak_dark'],
  fall:['tree_default_fall','tree_oak_fall','tree_default_fall','tree_thin','tree_oak','tree_default'],
  dead:['tree_dead_large','tree_dead_medium','tree_dead_small']};
const ROCKS=['rock_largeA','rock_largeB','rock_largeC','rock_largeD','rock_tallA','rock_tallB','rock_tallC','stone_tallA','stone_largeA'];
// Etapa 2 (Ian, 02/10): borders are not straight lines; warp the lookup so biomes reach into each other in fingers and islands.
function biomeWarp(x,z){return[x+(WN(x*.021+5.3,z*.021+9.1)-.5)*46+(WN(x*.09+3.7,z*.09+7.2)-.5)*14,z+(WN(x*.021+41.2,z*.021+77.5)-.5)*46+(WN(x*.09+61.4,z*.09+13.8)-.5)*14]}
function biomeSample317(x,z){const w=biomeWarp(x,z);return {w,b:WN(w[0]*.00125+311,w[1]*.00125+733),b2:WN(w[0]*.0018+91,w[1]*.0018+57)}}
function biomeMix154(x,z){const {b,b2}=biomeSample317(x,z),snow=clamp((.35-b)/.08,0,1),cold=clamp((b2-.58)/.08,0,1),heat=clamp((b-.65)/.05,0,1),lava=clamp((b2-.55)/.08,0,1),wet=clamp((b2-.64)/.08,0,1)*(1-snow)*(1-heat);return{snow:snow*(1-cold),crystal:snow*cold,sand:heat*(1-lava),ash:heat*lava,wet}}
function bare154(x,z){const B=biomeAt(x,z),m=biomeMix154(x,z);return B==='deserto'||B==='vulcao'||m.sand>.6||m.ash>.6}
function snowB(x,z){return biomeSample317(x,z).b}
function biomeAt(x,z){const {w,b,b2}=biomeSample317(x,z);x=w[0];z=w[1];if(b<.3)return b2>.62?'cristal':'neve';if(b>.7)return b2>.55?'vulcao':'deserto';if(b2>.68)return'pantano';if(b2<.3)return'floresta';return WN(x*.0022+17,z*.0022+29)>.74?'flores':'campos'}
const BIO_N={neve:'Tundra gelada',deserto:'Deserto',pantano:'Pântano',campos:'Terras selvagens',vulcao:'Terras Vulcânicas',cristal:'Geleira de Cristal',floresta:'Floresta Sombria',flores:'Campos Floridos'};
const BIO_G={neve:[0xdde8f2,.45],deserto:[0xc8a060,.4],pantano:[0x3a4a2a,.35],vulcao:[0x5a1a10,.5],cristal:[0x7fd8ff,.35],floresta:[0x10261a,.45],flores:[0x3a7a3a,.25]};
const FLOWERS=['flower_purpleA','flower_redA','flower_yellowA','flower_purpleB','flower_redB','flower_yellowB'];
/* cores do chão: grama, terra batida nas estradas, pedra na cidade, terra escura no perigo */
function envGroundColors(pg,near){
  const pos=pg.attributes.position,cols=new Float32Array(pos.count*3),t=new THREE.Color(),u=new THREE.Color();
  const G1=new THREE.Color(0x56be32),G2=new THREE.Color(0x72d43e),DRY=new THREE.Color(0x9cb85c),FOR=new THREE.Color(0x3ea030),DIRT=new THREE.Color(0xd2b57d),COB=new THREE.Color(0x9fa19c),PLZ=new THREE.Color(0xc0b8a8),BAD=new THREE.Color(0x4a3632),SNOW=new THREE.Color(0xf6f9fd),SAND=new THREE.Color(0xd9c288),SWMP=new THREE.Color(0x486438);
  for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);let d=1e9,road=0;
    for(const c of near){const dx=x-c.x,dz=z-c.z,dd=Math.hypot(dx,dz);if(dd<d)d=dd;if(dd<125){const m=Math.min(Math.abs(dx),Math.abs(dz));road=Math.max(road,clamp((4.9-m)/1.8,0,1)*clamp((125-dd)/12,0,1))}}
    t.copy(G1).lerp(G2,WN(x*.02+40,z*.02+40));
    {const b=WN(x*.0016+311,z*.0016+733),sw=WN(x*.003+91,z*.003+57),ns=clamp((.34-b)/.06,0,1),ds=clamp((b-.66)/.06,0,1),ps=clamp((sw-.64)/.06,0,1)*(1-ns)*(1-ds);
      if(ns>0)t.lerp(SNOW,ns*.9);if(ds>0)t.lerp(SAND,ds*.92);if(ps>0)t.lerp(SWMP,ps*.8)}
    const dr=WN(x*.06+13,z*.06+13);if(dr>.6)t.lerp(DRY,Math.min(.55,(dr-.6)*2.2));
    const fo=WN(x*.035,z*.035);if(fo>.48)t.lerp(FOR,Math.min(.7,(fo-.48)*3.5));
    if(road>0)t.lerp(u.copy(DIRT).multiplyScalar(.9+WN(x*.3,z*.3)*.2),road*.95);
    if(d<CITYR-3){t.lerp(COB,clamp((CITYR-3-d)/2.5,0,1));if(d<15)t.lerp(PLZ,clamp((15-d)/2,0,1))}
    t.lerp(BAD,clamp((d-CITYR-12)/160,0,1)*.28);t.multiplyScalar(1.08);cols[i*3]=t.r;cols[i*3+1]=t.g;cols[i*3+2]=t.b}
  pg.setAttribute('color',new THREE.BufferAttribute(cols,3))}
