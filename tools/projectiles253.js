/* v253: optional 3D aim and swept collision helpers. No game state or terrain
   mutation: callers supply the muzzle, target and terrain height function. */
(function(g){
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function unit(v){const n=Math.hypot(v.x||0,v.y||0,v.z||0)||1;return{x:(v.x||0)/n,y:(v.y||0)/n,z:(v.z||0)/n}}
  function aim3D(muzzle,target){return unit({x:target.x-muzzle.x,y:target.y-muzzle.y,z:target.z-muzzle.z})}
  function step(a,b,t){return{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:a.z+(b.z-a.z)*t}}
  function bisectTerrain(a,b,height,lo,hi){for(let i=0;i<16;i++){const m=(lo+hi)/2,p=step(a,b,m);if(p.y<=height(p.x,p.z))hi=m;else lo=m}const p=step(a,b,hi);return{...p,t:hi}}
  function terrainHit(a,b,height){if(typeof height!=='function')return null;if(a.y<=height(a.x,a.z))return{...a,t:0};const len=Math.hypot(b.x-a.x,b.y-a.y,b.z-a.z),n=Math.max(1,Math.ceil(len/.2));let prev=0,pa=a;for(let i=1;i<=n;i++){const t=i/n,p=step(a,b,t);if(p.y<=height(p.x,p.z)){if(prev===0&&a.y<=height(a.x,a.z))return{...a,t:0};return bisectTerrain(a,b,height,prev,t)}prev=t;pa=p}return null}
  function segmentSphere(a,b,c,r){const d={x:b.x-a.x,y:b.y-a.y,z:b.z-a.z},q={x:a.x-c.x,y:a.y-c.y,z:a.z-c.z};const A=d.x*d.x+d.y*d.y+d.z*d.z,B=2*(q.x*d.x+q.y*d.y+q.z*d.z),C=q.x*q.x+q.y*q.y+q.z*q.z-r*r,disc=B*B-4*A*C;if(C<=0)return{hit:true,t:0,p:{...a}};if(A===0||disc<0)return{hit:false,t:Infinity,p:b};const t=(-B-Math.sqrt(disc))/(2*A);if(t<0||t>1)return{hit:false,t:Infinity,p:b};return{hit:true,t,p:step(a,b,t)}}
  function segmentCapsule(a,b,c,r,h){
    const y0=c.y-h/2,y1=c.y+h/2,hits=[];
    for(const y of [y0,y1]){const q=segmentSphere(a,b,{x:c.x,y,z:c.z},r);if(q.hit)hits.push(q);}
    const dx=b.x-a.x,dz=b.z-a.z,qx=a.x-c.x,qz=a.z-c.z,A=dx*dx+dz*dz,B=2*(qx*dx+qz*dz),C=qx*qx+qz*qz-r*r;
    if(C<=0&&a.y>=y0&&a.y<=y1)hits.push({hit:true,t:0,p:{...a}});
    const disc=B*B-4*A*C;if(A>1e-12&&disc>=0)for(const t of[(-B-Math.sqrt(disc))/(2*A),(-B+Math.sqrt(disc))/(2*A)])if(t>=0&&t<=1){const p=step(a,b,t);if(p.y>=y0&&p.y<=y1)hits.push({hit:true,t,p});}
    if(!hits.length)return{hit:false,t:Infinity,p:b};return hits.sort((u,v)=>u.t-v.t)[0];
  }
  function intersectRayCapsule(o,d,c,r,h,max=220){const q=segmentCapsule(o,{x:o.x+d.x*max,y:o.y+d.y*max,z:o.z+d.z*max},c,r,h);return q.hit?{...q,distance:q.t*max}:q}
  function aimTerrainRay(ray,height,max=220){const d=unit(ray.direction||ray);const a=ray.origin||{x:0,y:0,z:0},b={x:a.x+d.x*max,y:a.y+d.y*max,z:a.z+d.z*max};return terrainHit(a,b,height)}
  function swept(a,b,targets,height){let best=terrainHit(a,b,height);for(const x of targets||[]){if(!x||x.dead)continue;const h=segmentCapsule(a,b,{x:x.x,y:x.y,z:x.z},x.r||.5,x.hitHeight||0);if(h.hit&&(!best||h.t<best.t))best={...h,target:x}}return best}
  g.Projectiles253={unit,aim3D,terrainHit,segmentSphere,segmentCapsule,intersectRayCapsule,aimTerrainRay,swept};
})(typeof window!=='undefined'?window:globalThis);
