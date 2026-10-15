/* The Architect claims a searched body once; unclaimed loot stays in a residue. */
window.Reclaim372=(()=>{const T=THREE,jobs=[],crystals=new Map(),pending=new Map();let generation=0,cooldown=0,handSource=null,handParts=[];const clamp01=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp01(x);return x*x*(3-2*x)};
function posedBounds(root){
 root.updateMatrixWorld(true);
 const box=new T.Box3(),v=new T.Vector3(),base=new T.Vector3(),sum=new T.Vector3(),part=new T.Vector3(),bone=new T.Matrix4(),getters=['getX','getY','getZ','getW'];
 root.traverse(o=>{
  if(!o.isMesh||!o.geometry?.attributes?.position)return;
  if(o.isSkinnedMesh)o.skeleton.update();
  const a=o.geometry.attributes.position,weights=o.geometry.attributes.skinWeight,indices=o.geometry.attributes.skinIndex,step=Math.max(1,Math.floor(a.count/5000));
  for(let i=0;i<a.count;i+=step){
   v.fromBufferAttribute(a,i);
   if(o.isSkinnedMesh){
    // r128 boneTransform reads normalized Uint16 weights as raw integers.
    // Match the GPU weights so goblins cannot inflate bounds by 65535.
    base.copy(v).applyMatrix4(o.bindMatrix);sum.set(0,0,0);
    let total=0;for(const get of getters)total+=weights[get](i);
    if(total>0){
     for(const get of getters){const w=weights[get](i)/total;if(w){bone.fromArray(o.skeleton.boneMatrices,indices[get](i)*16);sum.addScaledVector(part.copy(base).applyMatrix4(bone),w)}}
     v.copy(sum).applyMatrix4(o.bindMatrixInverse);
    }
   }
   v.applyMatrix4(o.matrixWorld);box.expandByPoint(v);
  }
 });return box;
}
function cachedHand(){const source=ARCH242.g?.scene;if(!source)return [];if(source===handSource)return handParts;for(const p of handParts){p.geometry.dispose();p.material.dispose()}handSource=source;handParts=[];if(source){source.updateMatrixWorld(true);source.traverse(sm=>{if(!sm.isSkinnedMesh)return;const g=sm.geometry,si=g.attributes.skinIndex,sw=g.attributes.skinWeight,idx=g.index;const want=sm.skeleton.bones.findIndex(b=>b.name==='hand_R');if(want<0)return;const pos=[],norm=[],uv=[];const v=new T.Vector3(),n=new T.Vector3(),nm=new T.Matrix3().getNormalMatrix(sm.matrixWorld);const main=i=>{let best=-1,weight=-1;for(let k=0;k<4;k++){const w=sw.array[i*4+k];if(w>weight){weight=w;best=si.array[i*4+k]}}return best};for(let q=0;q<(idx?idx.count:g.attributes.position.count);q+=3){const ids=[0,1,2].map(k=>idx?idx.getX(q+k):q+k);if(!ids.every(i=>main(i)===want))continue;for(const i of ids){v.fromBufferAttribute(g.attributes.position,i).applyMatrix4(sm.matrixWorld);pos.push(v.x,v.y,v.z);n.fromBufferAttribute(g.attributes.normal,i).applyMatrix3(nm).normalize();norm.push(n.x,n.y,n.z);uv.push(g.attributes.uv.getX(i),g.attributes.uv.getY(i))}}if(!pos.length)return;const hg=new T.BufferGeometry();hg.setAttribute('position',new T.Float32BufferAttribute(pos,3));hg.setAttribute('normal',new T.Float32BufferAttribute(norm,3));hg.setAttribute('uv',new T.Float32BufferAttribute(uv,2));hg.computeBoundingBox();const b=hg.boundingBox,c=b.getCenter(new T.Vector3()),sz=b.getSize(new T.Vector3()),factor=1.2/Math.max(sz.x,sz.y,sz.z);hg.translate(-c.x,-c.y,-c.z);hg.scale(factor,factor,factor);const hm=archMat247(sm.material,false);hm.transparent=true;handParts.push({geometry:hg,material:hm});});}return handParts;}
// Articulate the original extracted hand without replacing its mesh or texture.
function handRig404(mesh){
 const a=mesh.geometry.attributes.position,n=mesh.geometry.attributes.normal;
 mesh.userData.grip404={base:new Float32Array(a.array),norm:new Float32Array(n.array),last:NaN};mesh.frustumCulled=false;
}
function poseHand404(hand,grip){
 for(const mesh of hand.children||[]){const rig=mesh.userData.grip404;if(!rig||Math.abs(rig.last-grip)<.0005)continue;rig.last=grip;
  const p=mesh.geometry.attributes.position,n=mesh.geometry.attributes.normal,b=rig.base,ns=rig.norm;
  for(let i=0;i<p.count;i++){
   const k=i*3,x=b[k],y=b[k+1],z=b[k+2];let X=x,Y=y,Z=z,NX=ns[k],NY=ns[k+1],NZ=ns[k+2];
   // Four finger columns, with staggered closure. The palm/cuff stay fixed.
   const finger=Math.max(0,Math.min(3,Math.floor((x+.33)/.14))),phase=[0,.07,.12,.18][finger];
   const close=ease((grip-phase)/(1-phase)),weight=ease((.025-y)/.20)*(1-ease((x-.19)/.13));
   const angle=(-.42+close*[.84,.96,1.02,.90][finger])*weight;
   if(weight>0){const c=Math.cos(angle),sn=Math.sin(angle),py=y-.025,pz=z+.035;Y=.025+py*c-pz*sn;Z=-.035+py*sn+pz*c;NY=ns[k+1]*c-ns[k+2]*sn;NZ=ns[k+1]*sn+ns[k+2]*c;}
   // Opposing thumb closes later, towards the palm rather than with the fingers.
   const thumb=ease((x-.16)/.16)*ease((.34-y)/.16)*(1-ease((-.12-y)/.12));
   const ta=(.22-.78*ease((grip-.12)/.88))*thumb;
   if(thumb>0){const c=Math.cos(ta),sn=Math.sin(ta),px=X-.17,py=Y-.22;X=.17+px*c-py*sn;Y=.22+px*sn+py*c;const nx=NX;NX=nx*c-NY*sn;NY=nx*sn+NY*c;}
   p.setXYZ(i,X,Y,Z);n.setXYZ(i,NX,NY,NZ);
  }
  p.needsUpdate=n.needsUpdate=true;
 }
}
function start(a,r){if(!a?.model||a.reclaim372||a.failed402)return null;
if(!r.introCrystal402){if(window.Intro401?.guided())return null;const j=jobs[0];if(j&&!j.intro&&j.t<1.2&&j.bodies.length<4&&Math.hypot(r.x-j.r.x,r.z-j.r.z)<6){const joined=join(j,a,r);if(joined)saveRun();return joined;}if(jobs.length||pending.size||cooldown>0)return null;}else if(jobs.length)return null;
if(!ARCH242.g){if(a.waiting402)return null;a.waiting402=true;const level=L,gen=generation;if(r.introCrystal402){a.inter.hidden=true;a.marker.visible=false;}
pending.set(a,{root:a.root,sky:7,intro:!!r.introCrystal402,level,a,r,waiting:true});
Promise.resolve(ARCH242.ready).then(ok=>{pending.delete(a);a.waiting402=false;if(gen!==generation||level!==L||!a.root.parent)return;if(!ok){a.failed402=true;a.inter.hidden=false;a.marker.visible=true;return}start(a,r)});return null;}
a.root.remove(a.marker);a.root.updateMatrixWorld(true);const body=T.SkeletonUtils.clone(a.model.root),owned=[];body.position.set(0,0,0);body.userData.terrainRoot245=false;body.traverse(o=>{if(o.isMesh){const clone=m=>{const c=m.clone();if(c.emissive&&m.userData.e0!==undefined)c.emissive.setHex(m.userData.e0);c.onBeforeCompile=m.onBeforeCompile;c.customProgramCacheKey=m.customProgramCacheKey;return c};o.material=Array.isArray(o.material)?o.material.map(clone):clone(o.material);for(const m of [].concat(o.material)){m.transparent=true;owned.push(m)}}});
for(const ch of [...body.children])if(ch.isMesh&&ch.geometry?.type==='CircleGeometry')body.remove(ch);const initial=posedBounds(body).getSize(new T.Vector3()),wanted=(MON_DEF[a.model.mon]?.h||1)*(a.model.sc||1);if(Math.max(initial.x,initial.y,initial.z)<wanted*.45)body.scale.setScalar(wanted*.65/Math.max(.05,initial.x,initial.y,initial.z));const baseScale=body.scale.x;const bounds=posedBounds(body),size=bounds.getSize(new T.Vector3()),scale=Math.max(.8,Math.min(3.4,Math.max(size.x,size.y,size.z))),root=new T.Group();const center=bounds.getCenter(new T.Vector3());body.position.x=-center.x;body.position.z=-center.z;root.position.set(r.x+center.x,0,r.z+center.z);root.userData.terrainRoot245=true;scene.add(root);root.add(body);
const portal=new T.Group();const sky=Math.max(7,scale*4.5);portal.position.set(0,sky,0);portal.rotation.x=-Math.PI/2;root.add(portal);const geo=[],mats=[];
const mat=(c,em=0)=>{const m=new T.MeshStandardMaterial({color:c,emissive:em,emissiveIntensity:1.6,roughness:.58,metalness:.4,transparent:true});mats.push(m);return m};const stone=mat(0x65596e,0x170d25),vein=mat(0xc9a4ff,0x794bc2),voidmat=new T.MeshBasicMaterial({color:0x090414,transparent:true,side:T.DoubleSide});mats.push(voidmat);
function mesh(g,m,parent){geo.push(g);const o=new T.Mesh(g,m);parent.add(o);return o;}
const core=mesh(new T.CircleGeometry(scale*.65,48),voidmat,portal);core.scale.y=.7;
const ring=mesh(new T.TorusGeometry(scale*.66,scale*.022,8,64),vein,portal);ring.scale.y=.7;
const outer=mesh(new T.TorusGeometry(scale*.73,scale*.006,6,48),vein,portal);outer.scale.y=.7;
const hand=new T.Group();root.add(hand);hand.rotation.y=Math.PI+.2;hand.scale.setScalar(scale);const fingers=[];
// Extract the actual giant right hand from the same Tripo asset used by the Architect.
for(const p of cachedHand()){const geometry=p.geometry.clone();geo.push(geometry);const real=new T.Mesh(geometry,p.material);real.userData.tripoSource='models/arquiteto246.glb#hand_R';handRig404(real);hand.add(real)}
if(!hand.children.length){scene.remove(root);geo.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());owned.forEach(m=>m.dispose());a.root.add(a.marker);a.failed402=true;a.inter.hidden=false;console.warn('A Mão do Arquiteto não possui geometria carregada.');return null;}
hand.userData.tripo372=true;a.reclaim372=true;r.reclaimed372=true;r.crystal402=true;
const dust=new T.Group();root.add(dust);const particles=[];for(let i=0;i<(r.introCrystal402?36:12);i++){const p=mesh(new T.OctahedronGeometry(scale*(.013+(i%4)*.004)),vein,dust);particles.push(p)}
const original=a.root;original.userData.reclaimed372=true;scene.remove(original);a.model.mixer?.stopAllAction();const residue=new T.Group();residue.position.set(r.x,0,r.z);residue.userData.terrainRoot245=true;residue.add(a.marker);a.marker.position.y=.25;a.marker.visible=false;a.inter.hidden=true;scene.add(residue);a.root=residue;a.model=null;a.original=false;a.inter.label='F · RECOLHER VESTÍGIOS DE '+r.name;
const job={root,body,portal,hand,fingers,particles,scale,sky,owned,geo,mats,baseScale,t:0,a,r,intro:!!r.introCrystal402,level:L};
job.bodies=[{body,baseScale,owned,a,r}];jobs.push(job);
if(!job.intro)for(const [id,b] of Loot353.active){if(job.bodies.length>=4)break;const rec=Loot353.records().find(x=>x.id===id);if(b!==a&&b.model&&!b.reclaim372&&b.root.visible!==false&&rec&&!rec.introCrystal402&&Math.hypot(rec.x-r.x,rec.z-r.z)<6)join(job,b,rec)}
apply(job,0);saveRun();return job;}
function join(j,a,r){if(!a?.model||a.reclaim372||j.bodies.length>=4)return null;
a.root.remove(a.marker);const body=T.SkeletonUtils.clone(a.model.root),owned=[];body.userData.terrainRoot245=false;
body.position.set(r.x-j.root.position.x,0,r.z-j.root.position.z);
body.traverse(o=>{if(o.isMesh){const clone=m=>{const c=m.clone();if(c.emissive&&m.userData.e0!==undefined)c.emissive.setHex(m.userData.e0);c.onBeforeCompile=m.onBeforeCompile;c.customProgramCacheKey=m.customProgramCacheKey;c.transparent=true;owned.push(c);return c};o.material=Array.isArray(o.material)?o.material.map(clone):clone(o.material)}});
for(const ch of [...body.children])if(ch.isMesh&&ch.geometry?.type==='CircleGeometry')body.remove(ch);
const homeX=body.position.x,homeZ=body.position.z,bounds=posedBounds(body),center=bounds.getCenter(new T.Vector3());
const endX=homeX-center.x+(j.bodies.length-2)*j.scale*.2,endZ=homeZ-center.z;
const baseScale=body.scale.x;scene.remove(a.root);a.model.mixer?.stopAllAction();a.root.userData.reclaimed372=true;
const residue=new T.Group();residue.position.set(r.x,0,r.z);residue.userData.terrainRoot245=true;residue.add(a.marker);a.marker.visible=false;a.marker.position.y=.25;scene.add(residue);
a.root=residue;a.model=null;a.original=false;a.reclaim372=true;a.inter.hidden=true;a.inter.label='F · RECOLHER VESTÍGIOS DE '+r.name;r.reclaimed372=true;r.crystal402=true;
j.root.add(body);j.owned.push(...owned);j.bodies.push({body,baseScale,owned,a,r,homeX,homeZ,endX,endZ});return j;}
function reveal(j){if(j.revealed)return;j.revealed=true;for(const b of j.bodies||[j]){b.a.inter.hidden=false;attachCrystal(b.a,b.r)}}
/* Descida visível, contato, subida conjunta, fechamento e só então o cristal. */
function apply(j,t){const {body,portal,hand,particles,scale:s,sky}=j;
const emerge=ease(t/.6),reach=ease((t-.6)/1.4),grip=ease((t-2)/.65),pull=ease((t-2.7)/1.9),fade=ease((t-4.45)/.6),close=ease((t-5.15)/.7);
poseHand404(hand,grip);
portal.scale.setScalar(Math.max(.001,emerge*(1-close)));portal.rotation.z=t*.3;
const contact=s*.85,lift=(sky-contact)*pull;
hand.position.set(0,sky-(sky-contact)*reach+lift,s*.08);hand.rotation.x=-.1-.2*grip;hand.scale.setScalar(s*(1-fade));hand.visible=t>=.6&&fade<1;
for(const b of j.bodies||[j]){b.body.position.y=s*.08*grip+lift;b.body.scale.setScalar(b.baseScale*(1-.96*fade));if(b.homeX!==undefined){const gather=ease((t-1.2)/1.45);b.body.position.x=b.homeX+(b.endX-b.homeX)*gather;b.body.position.z=b.homeZ+(b.endZ-b.homeZ)*gather}for(const m of b.owned)m.opacity=1-fade;}
particles.forEach((p,i)=>{const q=(t*.55+i/particles.length)%1,a=i*2.399+t*2,rad=s*.6*(1-q);p.position.set(Math.cos(a)*rad,.2+q*sky,Math.sin(a)*rad);p.visible=t>2.4&&t<5.4;p.scale.setScalar(Math.sin(q*Math.PI)*(1-close));});
if(t>=5.15)reveal(j);
}
function attachCrystal(a,r){if(!a?.root?.parent||crystals.has(a.root))return;
r.crystal402=true;if(r.crystalLife402==null)r.crystalLife402=10;a.inter.label='F · RECOLHER CRISTAL · '+r.name;a.marker.visible=false;const crystal=new T.Mesh(new T.OctahedronGeometry(.24),new T.MeshStandardMaterial({color:0xc8b0ff,emissive:0x7951cd,emissiveIntensity:1.2,roughness:.25,metalness:.5,transparent:true}));crystal.position.y=1.1;a.root.add(crystal);a.root.userData.introCrystal401=true;crystals.set(a.root,{crystal,r,level:L,t:0});}
function disposeCrystal(root,c){root.remove(c.crystal);c.crystal.geometry.dispose();c.crystal.material.dispose();crystals.delete(root);}
function dispose(j){scene.remove(j.root);j.geo.forEach(g=>g.dispose());j.mats.forEach(m=>m.dispose());j.owned.forEach(m=>m.dispose())}
function tick(dt){cooldown=Math.max(0,cooldown-dt);for(const [a,p] of pending)if(p.level!==L||!a.root.parent){a.waiting402=false;pending.delete(a)}for(let i=jobs.length-1;i>=0;i--){const j=jobs[i];j.t+=dt;apply(j,j.t);if(j.t>=6){dispose(j);jobs.splice(i,1);if(!j.intro)cooldown=1.5}}
for(const [root,c] of crystals){if(c.level!==L||!root.parent){disposeCrystal(root,c);continue}c.t+=dt;c.crystal.rotation.y=c.t;c.crystal.position.y=1.1+Math.sin(c.t*2)*.12;c.crystal.material.opacity=Math.min(1,(c.r.crystalLife402??10)/2);c.crystal.material.emissiveIntensity=1.2+Math.sin(c.t*4)*.25;}}
function clear(){generation++;cooldown=0;for(const [a] of pending){a.waiting402=false;a.inter.hidden=false}pending.clear();jobs.splice(0).forEach(dispose);for(const [root,c] of crystals)disposeCrystal(root,c);}
function claimEnemy(e){if(!e?.m?.root||e.m.root.userData.reclaimed372)return false;
// A single loot record owns both the corpse and the residue. Never reattach the original body.
if(!e.corpse353){e.loot353=e.loot353||[];Loot353.create(e)}
const r=Loot353.records().find(r=>r.id===e.corpse353),a=Loot353.active.get(e.corpse353);if(!r||!a)return false;
if(e.isIntroTutorial)r.introCrystal402=true;else return false;
try{const job=start(a,r);if(job){try{sfx('gong');shake(.35)}catch(_){}}return !!job||!!a.waiting402}catch(err){console.warn('Reclaim372.claimEnemy',err);return false}}
return{start,tick,clear,jobs,apply,claimEnemy,attachCrystal,crystals,pending};})();
