/* Aster v253: full roof footprints, clear streets and deterministic placement. */
(function(g){'use strict';
 const gap=3,road=5.5,PI=Math.PI,TAU=PI*2;
 const bank={key:'tripo_bank_building',x:-16,z:7.5,ry:PI/2,width:10};
 function bounds(dim,x,z,ry){const c=Math.cos(ry),s=Math.sin(ry),corners=[];for(const lx of[-dim.w/2,dim.w/2])for(const lz of[-dim.d/2,dim.d/2])corners.push({x:x+lx*c+lz*s,z:z-lx*s+lz*c});return {minX:Math.min(...corners.map(p=>p.x)),maxX:Math.max(...corners.map(p=>p.x)),minZ:Math.min(...corners.map(p=>p.z)),maxZ:Math.max(...corners.map(p=>p.z)),corners};}
 function overlap(a,b,pad=0){return !(a.maxX+pad<=b.minX||b.maxX+pad<=a.minX||a.maxZ+pad<=b.minZ||b.maxZ+pad<=a.minZ);}
 function clearance(a,b){return Math.hypot(Math.max(0,a.minX-b.maxX,b.minX-a.maxX),Math.max(0,a.minZ-b.maxZ,b.minZ-a.maxZ));}
 const wallRadius=level=>level>=8?106:level>=7?94:82;
 function plan(o){const radius=o.radius||60,level=o.level||1,dim=o.dimensions,random=o.random||(()=>.5),homes=o.homeKeys,used=[],residences=[],services=[];
  function entry(key,x,z,ry,width,role){const d=dim(key,width);return {key,x,z,ry,width,role,dim:d,footprint:bounds(d,x,z,ry)};}
  function reserve(e){used.push(e);return e;}
  for(const s of o.shopEntries)reserve(entry(s.key,s.x,s.z,s.ry,s.width,'shop'));
  reserve(entry(bank.key,bank.x,bank.z,bank.ry,bank.width,'bank'));
  reserve(entry('building_home_A_red',46,12,-PI/2,6.5,'player-home'));
  for(const a of[0,PI/2,PI,PI*1.5])for(const sd of[-1,1]){const aa=a+sd*.24,x=Math.cos(aa)*radius,z=Math.sin(aa)*radius;reserve(entry(sd>0?'building_tower_A_blue':'building_tower_B_blue',x,z,Math.atan2(-x,-z),8.6,'tower'));}
  if(level>=6){const r=wallRadius(level);for(const a of[0,PI/2,PI,PI*1.5])for(const sd of[-1,1]){const aa=a+sd*8.7/r,x=Math.cos(aa)*r,z=Math.sin(aa)*r;reserve(entry('building_tower_A_blue',x,z,Math.atan2(-x,-z),11,'outer-tower'));}}
  function vacant(e,limit){const b=e.footprint;if(b.corners.some(p=>Math.hypot(p.x,p.z)>limit-3))return false;if(b.minX<road&&b.maxX>-road||b.minZ<road&&b.maxZ>-road)return false;return used.every(u=>clearance(b,u.footprint)>=gap);}
  function place(key,angle,r,width,role,limit=radius){for(const dr of[0,1.5,-1.5,3,-3,4.5])for(const da of[0,2,-2,4,-4,6,-6]){const a=(angle+da)*PI/180,x=Math.cos(a)*(r+dr),z=Math.sin(a)*(r+dr),e=entry(key,x,z,Math.atan2(-x,-z),width,role);if(vacant(e,limit))return reserve(e);}return null;}
  const inn=place('building_tavern_blue',157.5,47,8.2,'inn')||place('building_tavern_blue',45,48,8.2,'inn');
  if(level>=7){for(const a of[45,225]){const e=place('building_windmill_blue',a,81,7,'mill',wallRadius(level));if(e)services.push(e);}const e=place('building_lumbermill_blue',135,81,6.5,'lumber',wallRadius(level));if(e)services.push(e);}
  if(level>=8){const e=place('building_church_blue',315,84,8,'church',wallRadius(level));if(e)services.push(e);}
  function home(a,r,width,limit){const key=homes[Math.min(homes.length-1,Math.floor(random()*homes.length))],e=place(key,a,r,width,'residence',limit);if(e)residences.push(e);}
  for(const a of[15,30,60,75,105,120,195,210,240,255,285,300,330,345])home(a,44,5.4+random()*1.2,radius);
  if(level>=6)for(let i=0;i<14;i++)home(i/14*360+3,71,5+random()*1.2,wallRadius(level));
  if(level>=8)for(let i=0;i<18;i++)home(i/18*360+3,94,5.4+random()*1.2,wallRadius(level));
  return {inn,residences,services,footprints:used,gap,bank};
 }
 g.City253={bounds,overlap,clearance,plan,bank,wallRadius,gap};
})(window);
