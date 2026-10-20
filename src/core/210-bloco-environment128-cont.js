/* árvores, pedras e tudo que cobre o chão num pedaço do mundo */
const TINTS=[0xffffff,0xeef5d6,0xdcebdc,0xf5eccc,0xe2e8d2];
function tintB(h,k){return(Math.min(255,((h>>16)&255)*k)<<16)|(Math.min(255,((h>>8)&255)*k)<<8)|Math.min(255,(h&255)*k)}
function envChunk(g,R,x0,z0,cityD,addCol){
  const Q=()=>[0,1,2,3].map(()=>new EnvBatch()),TR=Q(),FL=Q(),SO=Q(),qi=(x,z)=>(x>x0?1:0)+(z>z0?2:0),dg=danger(x0,z0),bio=WN(x0*.004+900,z0*.004+900),st=CH/12,lite=ENV.lite;let tr,fl,so;const at=(x,z)=>{const i=qi(x,z);tr=TR[i];fl=FL[i];so=SO[i]};
  const B=biomeAt(x0,z0),SE=seasonI();
  for(let i=0;i<12;i++)for(let j=0;j<12;j++){const px=x0-CH/2+(i+.5)*st+(R()-.5)*3,pz=z0-CH/2+(j+.5)*st+(R()-.5)*3,q=cityD(px,pz);if(q.d<44*CITYK||q.clear)continue;
    const B=biomeAt(px,pz),set=B==='neve'||B==='cristal'?TREES.pine:B==='vulcao'?TREES.dead:B==='floresta'?['tree_default_dark','tree_oak_dark','tree_pineTallA_detailed','tree_tall']:bio<.34?TREES.pine:bio>.74||SE===2?TREES.fall:TREES.leaf,BT=B==='cristal'?0x9fe8ff:B==='vulcao'?0x5a3a30:B==='neve'||SE===3?0xe8f0f6:B==='pantano'?0x9aa886:null;
    const n=WN(px*.035,pz*.035);at(px,pz);
    if(B==='deserto'){if((n>.56||R()<.035)&&R()<.35){EH(tr,R()<.5?'cactus_tall':'cactus_short',px,0,pz,R()*TAU,2.2+R()*1.8);addCol({x:px,z:pz,r:.6})}}
    else if(n>(B==='floresta'?.4:B==='vulcao'?.7:.56)||R()<.035){const dead=(dg>=5&&R()<.12+dg*.05)||(B==='pantano'&&R()<.45)||B==='vulcao';const k=dead?pk(R,TREES.dead):R()<.15?pk(R,TREES.leaf):pk(R,set);if(window.TripoEnvironment153&&!TripoEnvironment153.treeOk(k,px,pz))continue;
      EH(tr,k,px,0,pz,R()*TAU,(dead?4.4:5.2)+R()*2.3,BT&&!dead?tintB(BT,.84+R()*.16):tintB(pk(R,TINTS),.84+R()*.16));addCol({x:px,z:pz,r:.8});ENV.cast.push({x:px+.5,z:pz-.4,r:dead?1.8:2.7,k:dead?.25:.42})}
    else if(WN(px*.09+500,pz*.09+500)>.82){const s=.6+R();const rk344=pk(R,ROCKS),sc344=EW(so,rk344,px,-.08,pz,R()*TAU,2.4*s,tintB(0xffffff,.84+R()*.16));addCol({x:px,z:pz,r:1.1*s,h:envTop344(rk344,sc344,-.08)});ENV.cast.push({x:px+.3,z:pz-.25,r:1.7*s,k:.3})}}
  if(B==='flores')for(let k=0,nf=lite?80:220;k<nf;k++){const px=x0+(R()-.5)*CH,pz=z0+(R()-.5)*CH,q=cityD(px,pz);if(q.clear||q.d<40*CITYK||biomeAt(px,pz)!=='flores')continue;at(px,pz);EH(fl,pk(R,FLOWERS),px,0,pz,R()*TAU,.6+R()*.5)}
  if(B==='cristal'||B==='vulcao')for(let k=0;k<(lite?6:14);k++){const px=x0+(R()-.5)*CH,pz=z0+(R()-.5)*CH,q=cityD(px,pz);if(q.clear||q.d<44*CITYK)continue;at(px,pz);const s2=.7+R()*.9;const rk344=pk(R,['rock_tallA','rock_tallB','stone_tallA']),sc344=EW(so,rk344,px,-.05,pz,R()*TAU,2.2*s2,tintB(B==='cristal'?0x9fe8ff:0x6a2a1a,1));addCol({x:px,z:pz,r:.9*s2,h:envTop344(rk344,sc344,-.05)})}
  for(let k=0,nc=lite?60:150;k<nc;k++){const px=x0+(R()-.5)*CH,pz=z0+(R()-.5)*CH,q=cityD(px,pz);if(q.clear||q.d<37*CITYK)continue;
    const B=biomeAt(px,pz),fo=WN(px*.035,pz*.035),fw=WN(px*.05+77,pz*.05+77),r=R(),ry=R()*TAU;at(px,pz);
    if(B==='deserto'){if(r<.5)envSolidEW357(addCol,so,pk(R,['rock_smallA','rock_smallC','rock_largeA','stone_smallA']),px,-.03,pz,ry,.6+R()*1.2,0xe8d2a0);else if(r<.62)EH(so,pk(R,['bone_A','skull','ribcage']),px,0,pz,ry,.4+R()*.3);else if(r<.8)EH(fl,'plant_bushSmall',px,0,pz,ry,.5+R()*.3,0xc9a86a);continue}
    // Etapa 2: no green plants on snow, sand or ash, decided per spot (borders are ragged now).
    if(bare154(px,pz))continue;
    if(B==='neve'||['neve','cristal'].includes(biomeAt(px,pz))||snowB(px,pz)<.33){if(r<.3)envSolidEW357(addCol,so,pk(R,['rock_smallA','stone_smallA','rock_smallFlatA']),px,-.03,pz,ry,.5+R()*.8,0xf0f4f8);continue}
    if(B==='pantano'&&r<.25){EH(fl,pk(R,['mushroom_redGroup','mushroom_tanGroup','plant_flatTall','grass_leafsLarge']),px,0,pz,ry,.5+R()*.5,0x9aa886);continue}
    if(dg>=5&&r<.08){EH(so,pk(R,['bone_A','skull','ribcage','gravemarker_A','bone_A','gravestone']),px,0,pz,ry,.35+R()*.45);continue}
    if(fo>.52&&r<.3){const k2=pk(R,['mushroom_redGroup','mushroom_tanGroup','mushroom_red','stump_round','stump_old','plant_bushDetailed','log','log_large']);
      if(k2.startsWith('log')){if(worldFreeL(px,pz)){const sc344=EW(so,k2,px,0,pz,ry,2.4+R()*1.2);envSolid357(addCol,k2,px,0,pz,ry,sc344);ENV.cast.push({x:px,z:pz,r:1.5,k:.22})}}else if(k2.startsWith('stump')){const sc357=EH(so,k2,px,0,pz,ry,.7+R()*.4);envSolid357(addCol,k2,px,0,pz,ry,sc357);}else EH(fl,k2,px,0,pz,ry,.5+R()*.5);continue}
    if(fw>.6&&r<.55&&dg<6&&B==='campos'){for(let f=0,nf=lite?1:2;f<nf;f++)EH(fl,pk(R,FLOWERS),px+(R()-.5)*2,0,pz+(R()-.5)*2,R()*TAU,.45+R()*.35);continue}
    if(r<.45)EH(fl,lite?'grass_leafs':pk(R,['grass_leafs','grass_leafs','grass_leafs','grass','grass_leafsLarge']),px,0,pz,ry,.45+R()*.35);
    else if(r<.72)EH(fl,pk(R,['plant_bush','plant_bushLarge','plant_bushSmall','plant_flatShort','plant_flatTall']),px,0,pz,ry,.7+R()*.6);
    else if(r<.85)envSolidEW357(addCol,so,pk(R,['rock_smallA','rock_smallC','stone_smallA','rock_smallFlatA']),px,-.03,pz,ry,.5+R()*.7);
    else EH(fl,'blades',px,0,pz,ry,.7+R()*.5)}
  for(let k=0,nb=lite?80:220;k<nb;k++){const px=x0+(R()-.5)*CH,pz=z0+(R()-.5)*CH;if(WN(px*.09+5,pz*.09+5)<.36)continue;const q=cityD(px,pz),B=biomeAt(px,pz);if(q.clear||q.d<36*CITYK||B==='deserto'||B==='neve'||['neve','cristal'].includes(biomeAt(px,pz))||snowB(px,pz)<.33||bare154(px,pz))continue;at(px,pz);EH(fl,'blades',px,0,pz,R()*TAU,.5+R()*.6,tintB(B==='neve'?0xdfe8e0:B==='pantano'?0x8a9a70:0xffffff,.85+R()*.15))}
  for(let i=0;i<4;i++){envOwn(g,TR[i].mesh(TREEMAT));envOwn(g,FL[i].mesh(FLORAMAT));envOwn(g,SO[i].mesh(ENVMAT));registerChestBatch253(SO[i],g.userData.chestObstacles253||(g.userData.chestObstacles253=[]));}
}
ENV.cast=[];
function envAO(pg){const pos=pg.attributes.position,col=pg.attributes.color,C=ENV.cast;if(!C.length)return;
  for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);let f=1;for(const c of C){const dx=x-c.x,dz=z-c.z;if(dx>c.r||dx<-c.r||dz>c.r||dz<-c.r)continue;const d=Math.hypot(dx,dz);if(d<c.r){const t=1-d/c.r;f*=1-c.k*t*t}}
    if(f<1)col.setXYZ(i,col.getX(i)*f,col.getY(i)*f,col.getZ(i)*f)}col.needsUpdate=true;ENV.cast=[]}
function worldFreeL(x,z){let ok=true;hnear(HASH,x,z,c=>{if(Math.hypot(x-c.x,z-c.z)<c.r+1.4)ok=false});return ok}
/* cidade: muralha, torres, casas, lojas, praça */
/* v154: residential ring only gets homes; shops, inn, mill and chapel have fixed places. */
const HOMES154=['building_home_A_blue','building_home_B_blue','building_home_A_red','building_home_A_yellow','building_home_B_green'];
const HOUSES=['building_home_A_blue','building_home_B_blue','building_home_A_red','building_home_B_red','building_home_A_yellow','building_home_B_green','building_tavern_blue','building_windmill_blue','building_lumbermill_blue','building_church_blue','building_home_A_blue','building_home_B_blue'];
/* v154 (Ian): bigger walled city so metre-scaled buildings fit in order. Everything tied to the old 34 m wall scales by CITYK. */
const CITYR=60,CITYK=CITYR/34,cityPalisadeR=l=>City253.wallRadius(l);
function cityDim253(key,width){return TripoEnvironment153.dimensions(key,width)||{w:width,d:width,h:width};}
function cityFront253(x,z,ry,distance){return {x:x+Math.sin(ry)*distance,z:z+Math.cos(ry)*distance};}
function cityCollider253(addCol,x,z,ry,dim){const hw=dim.w*.42,hd=dim.d*.42,cs=Math.cos(ry),sn=Math.sin(ry),r=.65;
  const put=(dx,dz)=>addCol({x:x+dx*cs+dz*sn,z:z-dx*sn+dz*cs,r});
  for(let dx=-hw;dx<=hw+.01;dx+=Math.min(1.1,hw*2))for(const dz of[-hd,hd])put(dx,dz);
  for(let dz=-hd;dz<=hd+.01;dz+=Math.min(1.1,hd*2))for(const dx of[-hw,hw])put(dx,dz);
  addCol({x,z,r:Math.min(hw,hd)});
}
const SHOPM={guild:['building_barracks_blue',10.5],pot:['building_home_B_red',7.2],wep:['building_blacksmith_blue',8.4],arm:['building_market_blue',9]};
function envCity(c,g,addCol,R,fallen,cLv){const X=c.x,Z=c.z,b=new EnvBatch(),fl=new EnvBatch(),tr=new EnvBatch(),dark=fallen?.55:1,glowL=[];
  const gate=a=>Math.min(...[0,Math.PI/2,Math.PI,Math.PI*1.5,TAU].map(q=>Math.abs(a-q)));
  const layout=c.layout253=City253.plan({radius:CITYR,level:cLv,dimensions:cityDim253,random:R,homeKeys:HOMES154,shopEntries:SHOPS.map(s=>({key:SHOPM[s.id][0],width:SHOPM[s.id][1],x:s.x,z:s.z,ry:Math.atan2(-s.x,-s.z)}))});
  const emit=e=>{if(!e)return;const x=X+e.x,z=Z+e.z;EW(b,fallen?'building_destroyed':e.key,x,0,z,e.ry,e.width,fallen?.8:1);cityCollider253(addCol,x,z,e.ry,e.dim);ENV.cast.push({x:x+.8,z:z-.6,r:Math.max(e.dim.w,e.dim.d)*.6,k:.5});};
  for(let a=TAU/152;a<TAU;a+=TAU/76){if(gate(a)<.18)continue;const x=X+Math.cos(a)*CITYR,z=Z+Math.sin(a)*CITYR;
    const m=ENV.m.wall_straight;b.add('wall_straight',x,0,z,-(a+Math.PI/2),(TAU*CITYR/76*1.04)/(m.max[0]-m.min[0]),3.1/m.h,1.35/.8,fallen&&R()<.4?.45:dark);
    if(cLv>=3&&!fallen)glowL.push({x,y:3.4,z,w:1});
    if(fallen&&R()<.25)EW(b,'rubble_half',x+Math.cos(a)*-2,0,z+Math.sin(a)*-2,R()*TAU,2.6,.7)}
  for(let a=0;a<TAU-.01;a+=TAU/180){if(gate(a)<.18)continue;addCol({x:X+Math.cos(a)*CITYR,z:Z+Math.sin(a)*CITYR,r:1.8})}
  cityGates341(c,g,fallen,CITYR,.18*CITYR,3.5);
  /* v481 (Ian): 3 MURALHAS CONCÊNTRICAS ESTILO ATTACK ON TITAN (SINA 60m, ROSE 85m, MARIA 115m) */
  if(!fallen&&cLv>=6&&window.TripoEnvironment153&&TripoEnvironment153.models.wall){
    // 2ª Muralha (Muralha Rose / Intermediária - 85m)
    const R2=85,seg2=4,n2=Math.round(TAU*R2/seg2),gap2=6.5/R2;
    for(let i=0;i<n2;i++){const a=(i+.5)/n2*TAU;if(gate(a)<gap2)continue;const x=X+Math.cos(a)*R2,z=Z+Math.sin(a)*R2;b.add('outerwall154',x,0,z,-(a+Math.PI/2),TAU*R2/n2);addCol({x,z,r:2.6})}
    for(const a of[0,Math.PI/2,Math.PI,Math.PI*1.5])for(const sd of[-1,1]){const aa=a+sd*(gap2+2.2/R2),x=X+Math.cos(aa)*R2,z=Z+Math.sin(aa)*R2;b.add('building_tower_A_blue',x,0,z,Math.atan2(X-x,Z-z),1);addCol({x,z,r:2.6})}
    cityGates341(c,g,false,R2,6.5,5.5);
  }
  if(!fallen&&cLv>=8&&window.TripoEnvironment153&&TripoEnvironment153.models.wall){
    // 3ª Muralha (Muralha Maria / Externa - 115m)
    const R3=115,seg3=4.2,n3=Math.round(TAU*R3/seg3),gap3=7.5/R3;
    for(let i=0;i<n3;i++){const a=(i+.5)/n3*TAU;if(gate(a)<gap3)continue;const x=X+Math.cos(a)*R3,z=Z+Math.sin(a)*R3;b.add('outerwall154',x,0,z,-(a+Math.PI/2),TAU*R3/n3);addCol({x,z,r:2.8})}
    for(const a of[0,Math.PI/2,Math.PI,Math.PI*1.5])for(const sd of[-1,1]){const aa=a+sd*(gap3+2.4/R3),x=X+Math.cos(aa)*R3,z=Z+Math.sin(aa)*R3;b.add('building_tower_A_blue',x,0,z,Math.atan2(X-x,Z-z),1.2);addCol({x,z,r:2.8})}
    cityGates341(c,g,false,R3,7.5,6.5);
  }
  for(const a of[0,Math.PI/2,Math.PI,Math.PI*1.5])for(const s of[-1,1]){const aa=a+s*.24,x=X+Math.cos(aa)*CITYR,z=Z+Math.sin(aa)*CITYR;
    EH(b,s>0?'building_tower_A_blue':'building_tower_B_blue',x,0,z,Math.atan2(X-x,Z-z),8.6,dark);addCol({x,z,r:2.2});ENV.cast.push({x:x+.8,z:z-.6,r:3.4,k:.45});/* Tower windows provide local amber light. */
    if(cLv>=1&&!fallen)EH(b,'flag_blue',x,8.2,z,-aa,2.2)}
  emit(layout.inn);for(const e of layout.residences)emit(e);for(const e of layout.services)emit(e);
  /* Trees stay outside residential roofs and the four main streets. */
  for(const a of[45,135,225,315]){const r=a*Math.PI/180,x=X+Math.cos(r)*31,z=Z+Math.sin(r)*31;
    const treeBox=City253.bounds({w:12,d:12},x-X,z-Z,0);if(layout.footprints.some(e=>City253.clearance(treeBox,e.footprint)<1))continue;
    const k=fallen?pk(R,TREES.dead):pk(R,TREES.leaf);if(!window.TripoEnvironment153||TripoEnvironment153.treeOk(k,x,z)){EH(tr,k,x,0,z,R()*TAU,5.4+R()*1.8,tintB(pk(R,TINTS),.86+R()*.14));addCol({x,z,r:.8});ENV.cast.push({x:x+.5,z:z-.4,r:2.6,k:.4});}}
  for(let k=0,n=ENV.lite?50:150;k<n;k++){const a=R()*TAU,d=CITYR-3.4+R()*2.6;if(gate(a)<.15)continue;EH(fl,k%9?'blades':pk(R,['plant_bush','grass_leafs','plant_flatShort']),X+Math.cos(a)*d,0,Z+Math.sin(a)*d,R()*TAU,.5+R()*.5,fallen?.6:tintB(0xffffff,.85+R()*.15))}
  const shopH={};
  for(const sp of SHOPS){const sx=X+sp.x,sz=Z+sp.z,ry=Math.atan2(-sp.x,-sp.z),[k,W]=SHOPM[sp.id]||['building_home_A_blue',7];
    const s=EW(b,fallen?'building_destroyed':k,sx,0,sz,ry,W,fallen?.8:1);ENV.cast.push({x:sx+.9,z:sz-.7,r:W*.72,k:.5});shopH[sp.id]=cityDim253(k,W).h;
    const cs=Math.cos(ry),sn=Math.sin(ry),side=(dx,dz)=>({x:sx+dx*cs+dz*sn,z:sz-dx*sn+dz*cs});
    if(!fallen){const dim=cityDim253(k,W),p1=side(dim.w*.5+1,dim.d*.25),p2=side(-dim.w*.5-1,dim.d*.25);envSolidEW357(addCol,b,'barrel',p1.x,0,p1.z,R()*TAU,1.05);envSolidEW357(addCol,b,'crate_A_big',p2.x,0,p2.z,R()*TAU,1.1);
      const p3=side(dim.w*.5+1,dim.d*.25-1.3);EW(b,sp.id==='wep'?'weaponrack':sp.id==='guild'?'target':'crate_B_small',p3.x,0,p3.z,ry,sp.id==='guild'?1.4:1);addCol({x:p3.x,z:p3.z,r:sp.id==='guild'?.65:.55})/* v429: não se atravessa mais */}}
  const fs=0;/* v236: fonte própria do selo (seal231) */if(fallen)for(let i=0;i<7;i++){const a=i/7*TAU;EW(b,R()<.5?'rubble_half':'rock_smallA',X+Math.cos(a)*3.6,0,Z+Math.sin(a)*3.6,R()*TAU,1.4+R(),.7)}ENV.cast.push({x:X+.4,z:Z-.3,r:5.2,k:.18});addCol({x:X,z:Z,r:4.4});/* v231: obelisco virou a coluna do selo (buildCity); fonte quebrada na cidade caída */
  for(let i=0;i<8;i++){const a=i/8*TAU+TAU/16,x=X+Math.cos(a)*11,z=Z+Math.sin(a)*11;EH(b,'lantern',x,0,z,-a,3.3,dark);glowL.push({x,y:3.05,z,s:.75});addCol({x,z,r:.35})}
  EW(b,'stall-red',X+5,0,Z+10.5,0,3.4,dark);if(!fallen&&TripoEnvironment153.models.bankhall){const bank=layout.bank;b.add(bank.key,X+bank.x,0,Z+bank.z,bank.ry,1);cityCollider253(addCol,X+bank.x,Z+bank.z,bank.ry,cityDim253(bank.key,bank.width))}else EW(b,'stall-green',X-5,0,Z+10.5,0,3.4,dark);addCol({x:X+5,z:Z+10.3,r:1.3});if(!TripoEnvironment153.models.bankhall)addCol({x:X-5,z:Z+10.3,r:1.3});
  EW(b,'building_well_blue',X+15.5,0,Z+7,-.5,2.6,dark);addCol({x:X+15.5,z:Z+7,r:1.4});
  EW(b,'campfire_stones',X+4.8,0,Z-3.6,0,1.3);
  for(let i=0;i<9;i++){const a=i/9*TAU,x=X-7+Math.cos(a)*2.55,z=Z-6+Math.sin(a)*2.55;EW(b,pk(R,['rock_smallA','rock_smallC','stone_smallA']),x,-.04,z,R()*TAU,.8+R()*.3)}
  EW(b,'lily_large',X-7.6,.07,Z-6.4,R()*TAU,.9);EW(b,'lily_small',X-6.2,.07,Z-5.3,R()*TAU,.6);EH(fl,'grass_large',X-9.3,0,Z-6.8,0,.7);EH(fl,'grass',X-4.8,0,Z-7.4,1,.6);
  if(cLv>=2&&!fallen){
    EW(b,'cart',X+12.5,0,Z-15,.6,2.4);addCol({x:X+12.5,z:Z-15,r:1.3});
    EW(b,'cart',X-12.5,0,Z-15,-.6,2.4);addCol({x:X-12.5,z:Z-15,r:1.3});
    envSolidEW357(addCol,b,'resource_lumber',X-14,0,Z+13,.3,2.2);
    envSolidEW357(addCol,b,'resource_stone',X-16.5,0,Z+11,.2,1.8);
    envSolidEW357(addCol,b,'crates_stacked',X+14,0,Z+13,0,1.4);
  }
  if(cLv>=3&&!fallen){
    for(const sx of[-1,1])for(const sz of[-1,1]){
      EH(b,'statue_column',X+sx*8.8,0,Z+sz*8.8,0,3.4,1.25);
      addCol({x:X+sx*8.8,z:Z+sz*8.8,r:.85});
    }
  }/* v429: coluna sólida */
  /* CIDADE QUE CRESCE (pedido do Ian): cada nível muda o visual; do 6 em diante surgem bairros fora da muralha. */
  if(!fallen){const gA=a=>gate(((a%TAU)+TAU)%TAU)<.26;
    if(cLv>=4){
      for(let i=0;i<16;i++){const a=i/16*TAU+TAU/32;if(gA(a))continue;EH(b,'flag_blue',X+Math.cos(a)*CITYR,4.5,Z+Math.sin(a)*CITYR,-a,1.8)}
      EW(b,'stall',X+2,0,Z+14,Math.PI,3.2);EW(b,'stall-bench',X-2.5,0,Z+14,Math.PI,3.2);
      EW(b,'stall-red',X-12,0,Z-6,Math.PI/2,3.2);EW(b,'stall-green',X+12,0,Z-6,-Math.PI/2,3.2);
      addCol({x:X+2,z:Z+14,r:1.3});addCol({x:X-2.5,z:Z+14,r:1.3});addCol({x:X-12,z:Z-6,r:1.3});addCol({x:X+12,z:Z-6,r:1.3});
    }
    if(cLv>=5)for(const a of[0,Math.PI/2,Math.PI,Math.PI*1.5])for(const d of[18,26,34,42]){for(const sd of[-1,1]){const x=X+Math.cos(a)*d+Math.cos(a+Math.PI/2)*sd*3.2,z=Z+Math.sin(a)*d+Math.sin(a+Math.PI/2)*sd*3.2;EH(b,'lantern_standing',x,0,z,-a,2.2);glowL.push({x,y:2.4,z,s:.6});addCol({x,z,r:.3})}}
    if(cLv>=9){for(const s2 of[-1,1]){EH(b,'statue_head',X+s2*12,0,Z-12,s2*.6,2.6);addCol({x:X+s2*12,z:Z-12,r:1.2})}glowL.push({x:X,y:6.4,z:Z})}
    if(cLv>=10)for(let i=0;i<24;i++){const a=i/24*TAU;glowL.push({x:X+Math.cos(a)*5.6,y:.9,z:Z+Math.sin(a)*5.6,s:.5})}}
  if(!fallen&&festival())for(let i=0;i<12;i++){const a=i/12*TAU+.13;EH(b,i%2?'banner_red':'banner_green',X+Math.cos(a)*15,0,Z+Math.sin(a)*15,-a,2.4);addCol({x:X+Math.cos(a)*15,z:Z+Math.sin(a)*15,r:.3})}
  if(fallen){for(let i=0;i<14;i++){const a=R()*TAU,d=6+R()*24;EH(b,pk(R,['bone_A','skull','ribcage','rubble_half']),X+Math.cos(a)*d,0,Z+Math.sin(a)*d,R()*TAU,.5+R()*.5,.8)}}
  envOwn(g,b.mesh(BLDMAT));envOwn(g,tr.mesh(TREEMAT));envOwn(g,fl.mesh(FLORAMAT));
  inst(geo('tflame',()=>new THREE.SphereGeometry(.4,8,6)),glowS(fallen?0xff4d6a:0xffd08a,1),glowL.filter(o=>!o.s&&!o.w),false,g);
  if(cLv>=3&&!fallen)inst(geo('wglow2',()=>new THREE.OctahedronGeometry(.32,0)),toonS(0x6fd8ff),glowL.filter(o=>o.w),false,g);
  inst(geo('lampg',()=>new THREE.SphereGeometry(.28,8,6)),glowS(fallen?0x803040:0xffd9a0,1),glowL.filter(o=>o.s),false,g);
  if(!fallen&&window.Look154)inst(geo('pool154',()=>{const q=new THREE.PlaneGeometry(1,1);q.rotateX(-Math.PI/2);return q}),Look154.pool(),glowL.filter(o=>!o.w).map(o=>({x:o.x,y:.07,z:o.z,s:o.s?7:10})),false,g);
  return shopH}
