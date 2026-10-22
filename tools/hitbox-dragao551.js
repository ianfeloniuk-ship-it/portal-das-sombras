/* v551 (Ian, 22/10/2026): dano do dragão por hitboxes 3D compostas (tronco, pescoço, cabeça, asas, cauda, patas).
   Antes: cápsula única no centro (x,z) e golpe corpo a corpo só pela distância no chão — o golpe acertava o dragão no ar
   por baixo e a asa/cauda/cabeça fora do centro não contava. Agora o corpo real vale e o chão vazio abaixo é ignorado. */
(function(g){
const P3=g.Projectiles253;if(!P3)return;
const cache=new WeakMap();
function localBox(e){const m=e.m;if(!m||!m.root)return null;const src=m.model||m.body||m.root,kids=src.children?src.children.length:0;let c=cache.get(m);
 if(c&&c.src===src&&c.kids===kids)return c;
 const rot=m.root.rotation.clone();m.root.rotation.set(0,0,0);m.root.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(src),inv=new THREE.Matrix4().copy(m.root.matrixWorld).invert();
 const pts=[];for(const x of[box.min.x,box.max.x])for(const y of[box.min.y,box.max.y])for(const z of[box.min.z,box.max.z])pts.push(new THREE.Vector3(x,y,z).applyMatrix4(inv));
 const b=new THREE.Box3().setFromPoints(pts),sc=new THREE.Vector3();m.root.matrixWorld.decompose(new THREE.Vector3(),new THREE.Quaternion(),sc);m.root.rotation.copy(rot);m.root.updateMatrixWorld(true);
 const L=(b.max.z-b.min.z)*sc.z,W=(b.max.x-b.min.x)*sc.x,H=(b.max.y-b.min.y)*sc.y;
 /* malha ligada no pose de ligação pode medir absurdo: volta ao tamanho do corpo */
 const bad=!isFinite(L+W+H)||L<=0||L>60||W>90||H>40;
 c={src,kids,b,bad,L,W,H};cache.set(m,c);return c}
/* esferas do corpo em coordenadas do mundo: {x,y,z,r,n} */
function parts(e){const m=e.m,c=localBox(e);const gy=terrH(e.x,e.z);
 if(!m||!m.root||!c||c.bad){const r=Math.max(1.5,e.r||1.5),D=e.drake510;return[{x:e.x,y:gy+(m?.root?.position.y||D?.alt||0)+r,z:e.z,r:r*1.4,n:'corpo'}]}
 m.root.updateMatrixWorld(true);const b=c.b,sz=b.max.z-b.min.z,sx=b.max.x-b.min.x,sy=b.max.y-b.min.y,k=Math.max(c.L,1)/Math.max(sz,1e-3);
 const cx=(b.min.x+b.max.x)/2,L=c.L,W=c.W,out=[];
 const add=(fx,fy,fz,r,n)=>{const v=new THREE.Vector3(cx+fx*sx,b.min.y+fy*sy,b.min.z+fz*sz).applyMatrix4(m.root.matrixWorld);out.push({x:v.x,y:v.y,z:v.z,r:Math.max(.5,r),n})};
 const tr=L*.17;
 for(const fz of[.38,.5,.62])add(0,.5,fz,tr,'tronco');
 for(const[fz,fy]of[[.72,.62],[.8,.7]])add(0,fy,fz,L*.09,'pescoco');
 add(0,.76,.92,L*.1,'cabeca');
 for(const[fz,fy,r]of[[.28,.38,.075],[.16,.32,.06],[.06,.3,.045]])add(0,fy,fz,L*r+.4,'cauda');
 for(const s of[-1,1])for(const[fx,fy,r]of[[.14,.62,.07],[.28,.64,.065],[.42,.62,.06],[.5,.6,.05]])add(s*fx,fy,.5,Math.max(W*r*.9,.8),'asa');
 for(const s of[-1,1])for(const fz of[.42,.62])add(s*.1,.12,fz,L*.06+.3,'pata');
 return out}
function segSphere(a,b,s,pad){return P3.segmentSphere(a,b,s,s.r+(pad||0))}
function segHit(a,b,e,pad){let best=null;for(const s of parts(e)){const q=segSphere(a,b,s,pad);if(q.hit&&(!best||q.t<best.t))best=q}return best||{hit:false,t:Infinity,p:b}}
/* segmentCapsule / intersectRayCapsule: se o alvo é dragão (c.entity.drake510) usa as esferas */
const oldSeg=P3.segmentCapsule,oldRay=P3.intersectRayCapsule;
P3.segmentCapsule=function(a,b,c,r,h){const e=c&&c.entity;if(e&&e.drake510&&e.m){const pad=Math.max(0,r-(c.r||0));return segHit(a,b,e,pad)}return oldSeg.apply(this,arguments)};
P3.intersectRayCapsule=function(o,d,c,r,h,max=220){const e=c&&c.entity;if(e&&e.drake510&&e.m){const q=P3.segmentCapsule(o,{x:o.x+d.x*max,y:o.y+d.y*max,z:o.z+d.z*max},c,r,h);return q.hit?{...q,distance:q.t*max}:q}return oldRay.apply(this,arguments)};
/* golpe corpo a corpo: esfera do golpe à frente do jogador contra as esferas do dragão (altura conta) */
function melee(e,pl,reach,arc,face){const gy=terrH(pl.x,pl.z)+(pl.jy||0),cy=gy+1.1;
 for(const s of parts(e)){const dx=s.x-pl.x,dz=s.z-pl.z,dy=s.y-cy,dh=Math.hypot(dx,dz);if(Math.hypot(dh,dy)>reach+s.r)continue;
  if(dh<s.r+.6)return true;let da=Math.atan2(dx,dz)-face;da=Math.atan2(Math.sin(da),Math.cos(da));if(Math.abs(da)<=arc+Math.asin(Math.min(1,s.r/dh)))return true}
 return false}
g.Dragao551={parts,segHit,melee,box:localBox};
})(window);
