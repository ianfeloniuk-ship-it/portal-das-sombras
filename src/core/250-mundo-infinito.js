/* ================= MUNDO INFINITO ================= */
const CH=64,REG=30;
let chunks=new Map(),HASH=new Map(),WN=null,WSEED=null,ranking=[],cityCache=new Map();
const CN_A=['Val','Ny','Se','Dra','Lu','Kal','Vey','Or','Tes','Mi','Gwy','Sol','Ar','Ki','Hol','Ze','Ob','Mar','El','Syl','Bri','Cor','Tha','Um','Ra','Is','Fen','Gal','Mor','Zar','Aur','Bel','Cai','Dun','Eri','Fal','Hae','Ith','Jor','Lor','Nar','Pel','Qui','Rho','Sar','Tor','Ul','Var','Wyn','Xan'];
const CN_B=['kor','mera','ran','moor','men','dera','ra','ion','sar','rath','dun','lace','dent','rin','low','phyr','sidia','row','dran','var','sa','vo','los','bra','heim','vale','gard','polis','thas','mir','tia','nor','wen','bur','dell','crest','fall','hold','reach','spire'];
const CN_C=['',' Alta',' do Norte',' Nova',' Velha',' do Sul',' dos Ventos',' das Brumas',' de Cristal',' do Vale','','',''];
function cityNameGen(R){return CN_A[Math.floor(R()*CN_A.length)]+CN_B[Math.floor(R()*CN_B.length)]+CN_C[Math.floor(R()*CN_C.length)]}
const CITY_NAMES=['Valkor','Nymeria','Seoran','Drakemoor','Lumen','Kaldera','Veyra','Orion','Tessar','Mirath','Gwyn','Solace','Ardent','Kirin','Hollow','Zephyr','Obsidia','Marrow','Eldran','Sylvar','Brisa','Corvo','Thalos','Umbra'];
function rh(a,b,c=0){return (Math.imul(a|0,73856093)^Math.imul(b|0,19349663)^Math.imul(c|0,83492791)^WSEED)>>>0}
const CANON_CAPITALS={'0,0':'Aster','0,-5':'Ymiria','5,0':'Zahar','-5,0':'Thalor','0,5':'Urdan','5,5':'Verden'};
function regionCity(rx,rz){const k=rx+','+rz;let c=cityCache.get(k);if(c)return c;const R=mulberry32(rh(rx,rz,7));
  const H217=REG>>1,o=(rx===0&&rz===0)?{x:H217,z:H217}:{x:Math.round(H217+(R()-.5)*REG*.4),z:Math.round(H217+(R()-.5)*REG*.4)};const cx=rx*REG+o.x-H217,cz=rz*REG+o.z-H217;/* v217: cidade perto do centro da região: no mínimo ~1,1 km entre cidades */
  const cap217=((rx%5)+5)%5===0&&((rz%5)+5)%5===0;const cName=CANON_CAPITALS[k]||(cap217?'Capital '+cityNameGen(R):cityNameGen(R));c={id:k,cx,cz,x:cx*CH,z:cz*CH,capital:cap217,name:cName};cityCache.set(k,c);return c}
function nearestCity(x,z){const rx=Math.floor(Math.round(x/CH)/REG),rz=Math.floor(Math.round(z/CH)/REG);let best=null,bd=1e12;
  for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const c=regionCity(rx+i,rz+j),d=Math.hypot(x-c.x,z-c.z);if(d<bd){bd=d;best=c}}return{c:best,d:bd}}
function citiesAround(x,z,rad){const out=[];const rx=Math.floor(Math.round(x/CH)/REG),rz=Math.floor(Math.round(z/CH)/REG),n=Math.ceil(rad/(CH*REG))+1;
  for(let i=-n;i<=n;i++)for(let j=-n;j<=n;j++){const c=regionCity(rx+i,rz+j);if(Math.hypot(c.x-x,c.z-z)<rad)out.push(c)}return out}
/* ESTRADAS (pedido do Irror): cada cidade liga à cidade vizinha do leste e do sul por uma estrada em L. */
function roadSegs(x,z,n){const RX=Math.floor(Math.round(x/CH)/REG),RZ=Math.floor(Math.round(z/CH)/REG),out=[];
  for(let i=-n;i<=n;i++)for(let j=-n;j<=n;j++){const c=regionCity(RX+i,RZ+j),e=regionCity(RX+i+1,RZ+j),so=regionCity(RX+i,RZ+j+1);out.push([c.x,c.z,e.x,c.z],[e.x,c.z,e.x,e.z],[c.x,c.z,c.x,so.z],[c.x,so.z,so.x,so.z])}return out}
function onRoad(segs,x,z,w=4.5){for(const [x1,z1,x2,z2] of segs){if(z1===z2){if(Math.abs(z-z1)<w&&x>=Math.min(x1,x2)-w&&x<=Math.max(x1,x2)+w)return true}else if(Math.abs(x-x1)<w&&z>=Math.min(z1,z2)-w&&z<=Math.max(z1,z2)+w)return true}return false}
/* v215 (Ian): cidades a ~1,3 km (REG 6→20); perigo esticado na mesma proporção */
function danger(x,z){const n=nearestCity(x,z);return clamp(Math.floor((n.d-46)/(26*REG/6))+Math.floor(Math.hypot(x,z)/900),0,9)}
function worldInit(seed){if(WSEED===(seed|0)&&WN)return;WSEED=seed|0;WN=makeNoise(seed);cityCache.clear();
  const RK=mulberry32(seed+5);ranking=[];for(let i=0;i<14;i++){const ri=Math.min(TOPR,Math.floor(Math.pow(RK(),2.2)*(TOPR+1)));ranking.push({name:NAMES[Math.floor(RK()*NAMES.length)],rank:ri,lvl:Math.round(8+RK()*30+ri*18)})}}
function hrem(c){const a=HASH.get(hkey(Math.floor(c.x/HB),Math.floor(c.z/HB)));if(a){const i=a.indexOf(c);if(i>=0)a.splice(i,1);if(!a.length)HASH.delete(hkey(Math.floor(c.x/HB),Math.floor(c.z/HB)))}}
function loadChunk(cx,cz){
  const key=cx+','+cz;if(chunks.has(key))return;
  const R=mulberry32(rh(cx,cz,1)),g=new THREE.Group(),ch={key,cx,cz,group:g,cols:[],city:null},x0=cx*CH,z0=cz*CH;
  const addCol=c=>{hadd(HASH,c);ch.cols.push(c)};
  const near=[];for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const c=regionCity(Math.floor(cx/REG)+i,Math.floor(cz/REG)+j);if(Math.abs(c.cx-cx)<=2&&Math.abs(c.cz-cz)<=2)near.push(c)}
  const RSEG=roadSegs(x0,z0,2);const op217=[];for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const p=outpostPoint361(cx+i,cz+j);if(p)op217.push(p)}const lk239=lakeAt239(cx,cz),ruin253=ruinAt(cx,cz),camps372=window.Living372?Living372.nearbySites(x0,z0):[];const cityD=(x,z)=>{let m=1e9,road=onRoad(RSEG,x,z);for(const c of near){const dx=x-c.x,dz=z-c.z,d=Math.hypot(dx,dz),cl=cityL(c),gw=(cl>=8?30:cl>=7?22:cl>=6?16:0)*CITYK;if(d-gw<m)m=d-gw;if((Math.abs(dx)<4.5||Math.abs(dz)<4.5)&&d<40*CITYK)road=true;if(Math.hypot(dx-44,dz-12)<8)road=true}return{d:m,road,clear:camps372.some(p=>Math.hypot(x-p.x,z-p.z)<16)||road||onRoad(RSEG,x,z,10.5)||(ruin253&&Math.hypot(x-x0,z-z0)<11)||op217.some(p=>Math.hypot(x-p.x,z-p.z)<17)||(lk239&&Math.hypot(x-lk239.x,z-lk239.z)<lk239.r+2.5)||riverClear239(x,z)}};
  if(ENV.ok){ENV.cast=[];const pg=new THREE.PlaneGeometry(CH,CH,32,32);pg.rotateX(-Math.PI/2);pg.translate(x0,0,z0);envGroundColors(pg,near);ch.pg=pg;envOwn(g,new THREE.Mesh(pg,envGroundMat()));envChunk(g,R,x0,z0,cityD,addCol)}else{
  const pg=new THREE.PlaneGeometry(CH,CH,12,12);pg.rotateX(-Math.PI/2);pg.translate(x0,0,z0);const pos=pg.attributes.position,cols=[];
  const ca=new THREE.Color(0x10284f),cb=new THREE.Color(0x1d4272),cc=new THREE.Color(0x2c3e60),cd=new THREE.Color(0x3a4a6a),red=new THREE.Color(0x2a0c22),tmp=new THREE.Color();
  for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i),q=cityD(x,z);
    if(q.d<14)tmp.copy(cd);else if(q.d<35*CITYK)tmp.copy(cc);else if(q.road)tmp.copy(cc).multiplyScalar(.9);else tmp.copy(ca).lerp(cb,WN(x*.03,z*.03));
    if(q.d>40&&!q.road){const bg=BIO_G[biomeAt(x,z)];if(bg){BGC.setHex(bg[0]);tmp.lerp(BGC,bg[1]*clamp((q.d-40)/30,0,1))}}if(q.road)tmp.setHex(0x5a5f70);else tmp.lerp(red,clamp((q.d-46)/160,0,1)*.4);if(SEAC[seasonI()])tmp.lerp(SEAC[seasonI()][0],SEAC[seasonI()][1]);cols.push(tmp.r,tmp.g,tmp.b)}
  pg.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));
  g.add(new THREE.Mesh(pg,GROUNDMAT));
  const trees=[],rocks=[];const st=CH/12;
  for(let i=0;i<12;i++)for(let j=0;j<12;j++){const px=x0-CH/2+(i+.5)*st+(R()-.5)*3,pz=z0-CH/2+(j+.5)*st+(R()-.5)*3,q=cityD(px,pz);if(q.d<44*CITYK||q.clear)continue;
    const n=WN(px*.035,pz*.035);
    if(n>.56||R()<.035){const s=.8+R()*.6;trees.push({x:px,z:pz,s,ry:R()*TAU});addCol({x:px,z:pz,r:.8})}
    else if(WN(px*.09+500,pz*.09+500)>.82){const s=.6+R();rocks.push({x:px,z:pz,s,ry:R()*TAU});addCol({x:px,z:pz,r:1.1*s})}}
  inst(geo('trunk',()=>new THREE.CylinderGeometry(.35,.5,3,7)),toonS(0x1b3d63),trees.map(t=>({x:t.x,y:1.5,z:t.z})),false,g);
  inst(geo('leaf',()=>new THREE.ConeGeometry(2.2,4.2,7)),toonS(0x2a6fb0),trees.map(t=>({x:t.x,y:4,z:t.z,s:t.s,ry:t.ry})),true,g);
  inst(geo('leaf',()=>0),toonS(0x3a86c8),trees.map(t=>({x:t.x,y:5.6,z:t.z,s:t.s*.7,ry:t.ry})),true,g);
  inst(geo('rock',()=>new THREE.DodecahedronGeometry(1.2,0)),toonS(0x3a4d6b),rocks.map(r=>({x:r.x,y:.4*r.s,z:r.z,s:r.s,ry:r.ry,rx:r.ry})),true,g);
  }
  const city=near.find(c=>c.cx===cx&&c.cz===cz);try{if(!city)buildWater239(ch,g,addCol)}catch(e){}if(city){ch.city=city;buildCity(city,g,addCol,R)}else if(outpostAt217(cx,cz))buildOutpost217(ch,g,addCol);else if(ruinAt(cx,cz))buildRuin(ch,g,addCol);
  if(ch.pg){envAO(ch.pg);delete ch.pg}
  L.group.add(g);chunks.set(key,ch);
}
function unloadChunk(ch){if(ch.friend217){const e=ch.friend217;e.gone=true;scene.remove(e.m.root);const ix=FRIENDS217.indexOf(e);if(ix>=0)FRIENDS217.splice(ix,1)}L.inter=L.inter.filter(i=>i.chunk!==ch);L.group.remove(ch.group);for(const c of ch.cols)hrem(c);ch.group.traverse(o=>{if(o.isInstancedMesh&&o.dispose)o.dispose();else if(o.userData.own&&o.geometry)o.geometry.dispose();else if(o.isSprite&&o.material.map){o.material.map.dispose();o.material.dispose()}});ch.group.children[0].geometry.dispose();
  if(ch.city){for(const n of npcs)if(n.home===ch.city){n.gone=true;scene.remove(n.m.root)}L.inter=L.inter.filter(i=>i.city!==ch.city)}chunks.delete(ch.key)}
function reloadCityChunks(c){if(!c)return;for(const ch of[...chunks.values()])if((ch.city&&ch.city.id===c.id)||(Math.abs(ch.cx-c.cx)<=2&&Math.abs(ch.cz-c.cz)<=2))unloadChunk(ch);updChunks(true)}
/* v415 (Ian: "jogo travado em 20 fps"): árvores/pedras instanciadas de até 49 pedaços eram desenhadas (≈2,9 mi de triângulos), mesmo na neblina.
   Enfeites instanciados só aparecem nos pedaços a até ~115 m do jogador; o chão e as colisões continuam carregados. */
function propCull415(){const P=player||{x:0,z:0};for(const ch of chunks.values()){if(!ch.group||ch.city)continue;let n=0;ch.group.traverse(()=>n++);if(!ch.props415||ch.n415!==n){ch.n415=n;ch.props415=[];ch.lod415=null;ch.group.traverse(o=>{if(o.isInstancedMesh&&(!window.NAT422||!o.userData.tripo153||NAT422.has(o.userData.tripo153))){/* v422: muralha/casas não afinam (sobravam pedaços soltos) */o.userData.count415=o.userData.count415??o.count;ch.props415.push(o)}})}
 const d=Math.hypot(ch.cx*CH-P.x,ch.cz*CH-P.z),lod=d<CH*1.1?2:d<CH*2?1:0;if(ch.lod415===lod)continue;ch.lod415=lod;
 for(const m of ch.props415){if(m.userData.lite180||m.userData.isLite423){m.userData.thin423=lod===2?1:lod===1?.5:.2;continue}/* v424: árvore/construção com versão leve: o CULL180 separa por distância */const full=m.userData.count415;m.count=lod===2?full:lod===1?Math.ceil(full*.5):Math.ceil(full*.2)}/* v418: só afina a quantidade; quem liga/desliga (perto/leve/longe) é o CULL180 */}}
function updChunks(force){
  const P=player||{x:0,z:0},pcx=Math.round(P.x/CH),pcz=Math.round(P.z/CH);let n=0;const want=[];
  for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++)want.push([pcx+i,pcz+j,i*i+j*j]);want.sort((a,b)=>a[2]-b[2]);
  for(const [x,z] of want){if(chunks.has(x+','+z))continue;loadChunk(x,z);if(!force&&++n>=(ENV.ok?1:2))break}
  for(const ch of[...chunks.values()])if(Math.abs(ch.cx-pcx)>3||Math.abs(ch.cz-pcz)>3)unloadChunk(ch);try{propCull415()}catch(_){}
}
