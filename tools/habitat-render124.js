// Habitat surfaces retain the existing navigation grid and room objectives.
const HABITAT_MATS124={};
const HABITAT_FLOORS124={};
let HABITAT_TEX124=null;
function habitatFloor124(bio){
 if(!HABITAT_TEX124){HABITAT_TEX124=envGroundTex();HABITAT_TEX124.repeat.set(1,1)}
 if(!HABITAT_FLOORS124[bio])HABITAT_FLOORS124[bio]=new THREE.MeshStandardMaterial({vertexColors:true,map:HABITAT_TEX124,bumpMap:HABITAT_TEX124,bumpScale:bio==='neve'?.025:.065,roughness:bio==='pantano'?.78:.98});
 return HABITAT_FLOORS124[bio];
}
function habitatMat124(color){
 if(!HABITAT_MATS124[color]){const m=new THREE.MeshStandardMaterial({color,roughness:.96});m.userData.shared=true;HABITAT_MATS124[color]=m}
 return HABITAT_MATS124[color];
}
function renderHabitat124(cells,W,H,CS,ox,oz,th,R){
 const points=[],colors=[],uvs=[],indices=[],walls=[],bases=[],pillars=[],details=[],hc=CS/2,c=new THREE.Color(th.floor);
 const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&cells[y*W+x]>0;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const wx=ox+(x+.5)*CS,wz=oz+(y+.5)*CS,v=cells[y*W+x];
  if(v){const offset=points.length/3;
   for(const [dx,dz] of [[-hc,hc],[hc,hc],[hc,-hc],[-hc,-hc]]){points.push(wx+dx,0,wz+dz);uvs.push((wx+dx)/9,(wz+dz)/9);const shade=1.12+.13*Math.sin((wx+dx)*.34)+.10*Math.cos((wz+dz)*.29);colors.push(c.r*shade,c.g*shade,c.b*shade)}
   indices.push(offset,offset+1,offset+2,offset,offset+2,offset+3);
   if(v===2)pillars.push({x:wx,y:1.05,z:wz,sx:.78,sy:1.2,sz:.78,ry:R()*6.28});
  }else if(open(x+1,y)||open(x-1,y)||open(x,y+1)||open(x,y-1)){
   bases.push({x:wx,y:.48,z:wz});
   walls.push({x:wx,y:1.02,z:wz,sx:CS*(.54+R()*.12),sy:.85+R()*.65,sz:CS*(.54+R()*.12),ry:R()*6.28});
   if(R()<.19)details.push({x:wx,z:wz,ry:R()*6.28});
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();
 const ground=new THREE.Mesh(g,habitatFloor124(th.habitat124));ground.receiveShadow=true;ground.name='habitat-ground-'+th.habitat124;envOwn(L.group,ground);
 inst(geo('habitat-base124-'+CS,()=>new THREE.BoxGeometry(CS,.96,CS)),habitatMat124(th.wall),bases);
 inst(geo('habitat-rock188',()=>{/* v188 (Ian): parede lisa parecia bola de neve; rocha facetada e irregular */const q=new THREE.DodecahedronGeometry(1,1).toNonIndexed(),P=q.attributes.position,v=new THREE.Vector3();for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i);const h=Math.sin(v.x*12.9+v.y*78.2+v.z*37.7)*43758.5,n=h-Math.floor(h);v.multiplyScalar(.78+n*.36);v.y=v.y>0?v.y*1.15:v.y*.7;P.setXYZ(i,v.x,v.y,v.z)}q.computeVertexNormals();return q}),habitatMat124(th.wall),walls.concat(pillars));
 const voidGround=new THREE.Mesh(new THREE.PlaneGeometry(W*CS+80,H*CS+80),habitatMat124(th.fog));voidGround.rotation.x=-Math.PI/2;voidGround.position.set(0,-.3,0);envOwn(L.group,voidGround);
 const bio=th.habitat124,ice=bio==='neve'||bio==='cristal',plants=new EnvBatch(),flora=new EnvBatch();
 for(const p of details){
  if(ENV.ok){
   if(bio==='floresta'||bio==='campos')EH(plants,bio==='floresta'?'tree_oak_dark':'tree_default',p.x,1.5,p.z,p.ry,3.2+R()*1.8);
   else if(bio==='pantano')EH(plants,'tree_dead_large',p.x,1.2,p.z,p.ry,3.5);
   else if(bio==='deserto')EH(plants,R()<.5?'cactus_tall':'cactus_short',p.x,1.3,p.z,p.ry,1.4+R()*1.5);
   else if(bio==='flores')EH(flora,pk(R,FLOWERS),p.x,1.6,p.z,p.ry,.8+R()*.7);
   else if(bio==='neve')EH(plants,'tree_pineRoundA',p.x,1.4,p.z,p.ry,2.6+R(),0xdce9ee);
   else if(bio==='vulcao')EH(plants,'tree_dead_large',p.x,1.5,p.z,p.ry,2.4,0x544238);
  }
  if(ice||bio==='vulcao'){
   const crystal=new THREE.Mesh(geo('habitat-crystal124',()=>new THREE.ConeGeometry(.4,2,5)),habitatMat124(ice?th.trim:0x2d2626));crystal.position.set(p.x,2,p.z);crystal.rotation.set(.12,p.ry,.17);L.group.add(crystal);
  }
 }
 if(ENV.ok){envOwn(L.group,plants.mesh(TREEMAT));envOwn(L.group,flora.mesh(FLORAMAT))}
}
function habitatProps124(rooms,g,R){
 if(!ENV.ok)return;const flora=new EnvBatch(),bio=g.biome124,family=dungeonFamily124(g);
 const choices={goblins:['log_stack','barrel_small','box_small'],wolves:['bone_A','ribcage'],mushrooms:['mushroom_redGroup','mushroom_tanGroup'],spiders:['bone_A','stump_old'],slimes:['lily_large','plant_flatTall'],bogkin:['lily_large','grass_leafsLarge'],yetis:['rock_smallC','bone_A'],crystals:['rock_tallA','stone_tallA'],cacti:['cactus_short','plant_bushSmall'],scarabs:['rock_smallC','bone_A'],demons:['tree_dead_small','bone_A'],dragons:['ribcage','rock_smallC'],swarm:['flower_yellowA','flower_purpleA'],meadow:['flower_redA','grass_leafsLarge']}[family]||['bone_A','rock_smallC','ribcage'];
 const grid=L.grid;
 // Low edge details never consume walkable cells or cover stairs/objectives.
 for(const r of rooms){if(r.i===0)continue;let count=0;
  for(let y=r.y+1;y<r.y+r.h-1&&count<6;y++)for(let x=r.x+1;x<r.x+r.w-1&&count<6;x++){
   if(grid.cells[y*grid.W+x]!==1||(x!==r.x+1&&x!==r.x+r.w-2&&y!==r.y+1&&y!==r.y+r.h-2)||R()>.24)continue;
   const wx=grid.ox+(x+.5)*grid.CS,wz=grid.oz+(y+.5)*grid.CS,key=pk(R,choices);EW(flora,key,wx,0,wz,R()*6.28,.35+R()*.45,bio==='neve'?0xe5eef1:undefined);count++;
  }
 }
 envOwn(L.group,flora.mesh(FLORAMAT));
 if(family==='goblins')goblinCampProps118(rooms);
}
