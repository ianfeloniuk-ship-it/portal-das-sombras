// BEGIN ECOLOGY124
// One resident family per territory/portal. Rank changes strength, not habitat.
const HABITATS124={campos:['goblins','wolves'],floresta:['goblins','wolves','mushrooms','spiders'],flores:['swarm','meadow'],pantano:['slimes','bogkin','spiders'],neve:['yetis','wolves'],cristal:['crystals'],deserto:['cacti','scarabs'],vulcao:['demons','dragons']};
const FAMILIES124={
 goblins:{label:'Clã Ferrugem',name:'Covil do Clã Ferrugem',ks:['goblin','gobShield118','gobArcher118','gobShaman118','gobBrute118'],chief:'gobBrute118',boss:'Chefe do Clã Ferrugem'},
 wolves:{label:'Lobos',name:'Covil da Matilha',ks:['lobo'],chief:'lobo',boss:'Alfa da Matilha'},
 mushrooms:{label:'Cogumelos',name:'Gruta dos Fungos',ks:['cogu','cogufuria','reicogu'],chief:'reicogu',boss:'Rei dos Fungos'},
 spiders:{label:'Aranhas',name:'Ninho das Aranhas',ks:['aranha'],chief:'aranha',boss:'Matriarca das Aranhas'},
 swarm:{label:'Enxame',name:'Colmeia do Vale',ks:['vespa','abelha','abelharainha'],chief:'abelharainha',boss:'Rainha do Enxame'},
 meadow:{label:'Feras da Pradaria',name:'Refúgio da Pradaria',ks:['passaro','coelho','alpaca','alpacaimp'],chief:'alpacaimp',boss:'Guardião da Pradaria'},
 slimes:{label:'Gosmas',name:'Brejo das Gosmas',ks:['gosma','espinhosa'],chief:'espinhosa',boss:'Gosma Ancestral'},
 bogkin:{label:'Habitantes do Brejo',name:'Cavernas Alagadas',ks:['peixinho','sapo','homempeixe'],chief:'sapo',boss:'Guardião do Brejo'},
 yetis:{label:'Yetis',name:'Covil Glacial',ks:['yetinho','yeti'],chief:'yeti',boss:'Ancião dos Yetis'},
 crystals:{label:'Construtos de Pedra',name:'Gruta de Cristal',ks:['golenzinho','golempedra','gigante'],chief:'golempedra',boss:'Colosso de Cristal'},
 cacti:{label:'Cactos',name:'Garganta dos Cactos',ks:['cactinho','cactogig'],chief:'cactogig',boss:'Cactoro Ancião'},
 scarabs:{label:'Escaravelhos',name:'Galerias das Dunas',ks:['escaravelho'],chief:'escaravelho',boss:'Guardião Escaravelho'},
 demons:{label:'Demônios',name:'Covil das Cinzas',ks:['diabrete','demon','chifrudo'],chief:'chifrudo',boss:'Senhor das Cinzas'},
 dragons:{label:'Dracônicos',name:'Ninho Vulcânico',ks:['raptor','dino','dragonete','dragaoancio'],chief:'dragaoancio',boss:'Ancião Vulcânico'}
};
const HABITAT_COLORS124={
 campos:[0x465041,0x515346,0xc69a60,0x171d22,0xe2ddc9],floresta:[0x343e34,0x3d4946,0xb59d71,0x121d20,0xd2decf],
 flores:[0x4b5940,0x515747,0xd8ba79,0x1a2322,0xe5dfc9],pantano:[0x394638,0x3c4840,0x94ad76,0x132025,0xc8d7c2],
 neve:[0x879caa,0x677e8e,0xb3d8e4,0x182832,0xe0ebef],cristal:[0x334b55,0x435763,0xa494d9,0x142129,0xd8deef],
 deserto:[0x967a51,0x776447,0xd8a052,0x282522,0xe8d2b1],vulcao:[0x3b2928,0x3c3535,0xd88a52,0x1d191e,0xdec4ad]
};
function ecoHash124(x,z){return (Math.imul(Math.floor(x/96),374761393)^Math.imul(Math.floor(z/96),668265263)^(typeof WSEED==='number'?WSEED:0))>>>0}
function familyPool124(id,rank,{melee=false}={}){
 const f=FAMILIES124[id];if(!f)return[];
 const pool=f.ks.flatMap((k,i)=>{const d=KINDS[k];if(!d)return[];const min=i===0?0:d.rk??0;return min<=rank?[{k,w:id==='goblins'?[28,19,22,15,12][i]:Math.max(8,24-i*5)}]:[]});
 const close=pool.filter(p=>!['ranged','wraith'].includes(KINDS[p.k].ai));return melee&&close.length?close:pool;
}
function worldFamily124(bio,x,z){const ids=HABITATS124[bio]||HABITATS124.campos;return ids[Math.floor(mulberry32(ecoHash124(x,z))()*ids.length)]}
function worldKinds124(rank,x,z){return familyPool124(worldFamily124(biomeAt(x,z),x,z),rank)}
function dungeonFamily124(g){
 let bio=HABITATS124[g.biome124]?g.biome124:biomeAt(g.x||0,g.z||0);if(!HABITATS124[bio])bio='campos';
 if(g.goblin118&&!HABITATS124[bio].includes('goblins'))bio='floresta';g.biome124=bio;
 const native=HABITATS124[bio];if(g.goblin118)return g.family124='goblins';
 if(String(g.family124).startsWith('rare_')&&FAMILIES124[g.family124])return g.family124;
 if(native.includes(g.family124))return g.family124;
 let ids=native;if(expeditionType(g)==='hunt'){const predators=native.filter(id=>['wolves','spiders','swarm','bogkin','yetis','scarabs','dragons'].includes(id));if(predators.length)ids=predators}
 return g.family124=ids[Math.floor(mulberry32(((g.seed||0)^0x124a91)>>>0)()*ids.length)];
}
function dungeonPool124(g,options){return familyPool124(dungeonFamily124(g),Math.max(0,g.rank||0),options)}
function dungeonTheme124(g){const id=dungeonFamily124(g),[floor,wall,trim,fog,light]=HABITAT_COLORS124[g.biome124];return{n:FAMILIES124[id].name,floor,wall,trim,fog,light,habitat124:g.biome124,family124:id,natural124:true}}
function dungeonBoss124(g){
 const id=dungeonFamily124(g),f=FAMILIES124[id],d=KINDS[f.chief],rank=g.rank||0;
 const high={goblins:1,wolves:2,mushrooms:0,spiders:3,swarm:3,meadow:2,slimes:0,bogkin:0,yetis:4,crystals:4,cacti:0,scarabs:3,demons:1,dragons:2};
 const sovereign={campos:3,floresta:3,flores:3,pantano:2,neve:1,cristal:1,deserto:0,vulcao:0};
 const base=rank>=9?SOVEREIGNS[sovereign[g.biome124]??3]:rank>=6?BOSSES_HIGH[high[id]??2]:BOSSES[id==='wolves'||id==='dragons'||id.startsWith('rare_')?2:0];
 const boss={...base,n:f.boss,ecologyFamily124:id,body:d.body||d.skin||0x69754b,scale:id==='goblins'?1.7:1.6};
 delete boss.mon;delete boss.goblin118;
 if(d.mon)boss.mon=d.mon;if(d.goblin118)boss.goblin118=d.goblin118;
 return boss;
}
function bossMinion124(b,fallback){const id=b?.boss?.ecologyFamily124;return FAMILIES124[id]?wpick(familyPool124(id,b.gr||0)).k:fallback}
function activeDungeonPool124(rank,options){return L.mode==='dungeon'&&!L.special?dungeonPool124(L.gate,options):kindsFor0(rank)}
function gateTheme124(g){return g.secret||g.inverse||g.time?GR[g.rank].th:dungeonTheme124(g)}

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
 registerChestObstacles253(L.group.children.slice(-2));
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

// END ECOLOGY124
