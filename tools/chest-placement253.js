/* Spawn-time checks only: chest footprint, obstacle bounds and walkable floor. */
(function(g){
  function clear(p,obstacles,r=1.55){return (obstacles||[]).every(o=>{
    if(Number.isFinite(o.minX)){const x=Math.max(o.minX,Math.min(o.maxX,p.x)),z=Math.max(o.minZ,Math.min(o.maxZ,p.z));return Math.hypot(p.x-x,p.z-z)>=r;}
    return Math.hypot(p.x-o.x,p.z-o.z)>=r+(o.r||0);
  });}
  function candidates(max=16){const out=[{x:0,z:0}];for(let d=.75;d<=max;d+=.75){const n=Math.ceil(2*Math.PI*d/.75);for(let i=0;i<n;i++){const a=i*2*Math.PI/n;out.push({x:Math.cos(a)*d,z:Math.sin(a)*d});}}return out;}
  const nearby=candidates();
  function choose(origin,obstacles,points=nearby,r=1.55,valid=()=>true){for(const q of points){const p={x:origin.x+q.x,z:origin.z+q.z};if(valid(p)&&clear(p,obstacles,r))return p;}return null;}
  function bounds(min,max,x,z,ry=0,sx=1,sz=sx){const c=Math.cos(ry),s=Math.sin(ry),b={minX:Infinity,maxX:-Infinity,minZ:Infinity,maxZ:-Infinity};for(const px of[min[0]*sx,max[0]*sx])for(const pz of[min[2]*sz,max[2]*sz]){const wx=x+px*c+pz*s,wz=z+pz*c-px*s;b.minX=Math.min(b.minX,wx);b.maxX=Math.max(b.maxX,wx);b.minZ=Math.min(b.minZ,wz);b.maxZ=Math.max(b.maxZ,wz);}return b;}
  g.ChestPlacement253={clear,choose,bounds,candidates};
})(typeof window!=='undefined'?window:globalThis);
