
/* ruína no meio do mapa */
function envRuin(g,x0,z0,addCol){const b=new EnvBatch(),R=mulberry32((x0*7+z0*13)|0);
  for(let i=0;i<8;i++){const a=i/8*TAU;if(i===3)continue;const x=x0+Math.cos(a)*7,z=z0+Math.sin(a)*7;EH(b,R()<.5?'statue_columnDamaged':'statue_column',x,0,z,R()*TAU,1.8+R()*3.2);addCol({x,z,r:.8});ENV.cast.push({x:x+.3,z:z-.2,r:1.4,k:.3})}
  EH(b,'arch',x0+Math.cos(3/8*TAU)*7.4,0,z0+Math.sin(3/8*TAU)*7.4,-3/8*TAU+Math.PI/2,4.2);
  for(let i=0;i<6;i++){const a=R()*TAU,d=3+R()*7;EW(b,pk(R,['rubble_half','statue_head','rock_smallA','statue_block','gravestone']),x0+Math.cos(a)*d,0,z0+Math.sin(a)*d,R()*TAU,1+R()*1.2,.9)}
  if(!window.TripoEnvironment153||TripoEnvironment153.treeOk('tree_dead_large',x0+9,z0-6)){EH(b,'tree_dead_large',x0+9,0,z0-6,1,6.5);addCol({x:x0+9,z:z0-6,r:.7})}
  registerChestBatch253(b,g.userData.chestObstacles253||(g.userData.chestObstacles253=[]));envOwn(g,b.mesh(ENVMAT))}
/* baú de verdade, com tampa que abre */
function envChest(boss){const g=new THREE.Group(),k=boss?'chest_gold':'chest',s=.85;const body=envMesh(k);body.scale.setScalar(s);g.add(body);
  const lg=new THREE.Group();lg.position.set(0,.5*s,-.56*s);const lid=envMesh(k+'_lid');lid.scale.setScalar(s);lg.add(lid);g.add(lg);
  const ring=new THREE.Mesh(geo('chring',()=>new THREE.RingGeometry(1.05,1.3,28)),glowS(boss?0xffd070:0xffc060,.55));ring.rotation.x=-Math.PI/2;ring.position.y=.04;g.add(ring);
  return {g,lid:lg,band:ring}}
/* masmorra: pisos e paredes com textura de pedra, tochas de parede, pilares */
let DTEX=null;
function envCanvasTex(draw,s){const c=document.createElement('canvas');c.width=c.height=s;draw(c.getContext('2d'),s,mulberry32(s*7+13));const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t}
function envDunTex(){if(DTEX)return DTEX;
  const brick=envCanvasTex((x,s,R)=>{x.fillStyle='#4e4c4a';x.fillRect(0,0,s,s);const rows=8,bh=s/rows,bw=s/4;
    for(let r=0;r<rows;r++){const off=(r&1)?bw/2:0;for(let i=-1;i<5;i++){const v=150+R()*75|0,px=i*bw+off+2,py=r*bh+2,w=bw-4,h=bh-4;x.fillStyle='rgb('+v+','+(v-5)+','+(v-12)+')';x.fillRect(px,py,w,h);
      x.fillStyle='rgba(255,255,255,.13)';x.fillRect(px,py,w,2);x.fillStyle='rgba(0,0,0,.2)';x.fillRect(px,py+h-3,w,3);
      for(let k=0;k<7;k++){x.fillStyle='rgba(0,0,0,'+(R()*.14).toFixed(2)+')';x.fillRect(px+R()*w,py+R()*h,2+R()*7,1+R()*3)}}}},256);
  const tile=envCanvasTex((x,s,R)=>{x.fillStyle='#3c3a38';x.fillRect(0,0,s,s);const rows=4,rh=s/rows;
    for(let r=0;r<rows;r++){const st=R()*40;let px=st;const y0=r*rh;while(px<st+s){const w=46+R()*58,v=124+R()*66|0,col='rgb('+v+','+(v-4)+','+(v-10)+')',W=Math.min(w,st+s-px)-4,H=rh-4;
      for(const ox of[0,-s]){const X0=px+ox+2,Y0=y0+2;x.fillStyle=col;x.fillRect(X0,Y0,W,H);x.fillStyle='rgba(255,255,255,.09)';x.fillRect(X0,Y0,W,3);x.fillStyle='rgba(0,0,0,.2)';x.fillRect(X0,Y0+H-3,W,3);x.fillRect(X0+W-3,Y0,3,H)}
      px+=w}}
    for(let k=0;k<900;k++){x.fillStyle='rgba(0,0,0,'+(R()*.13).toFixed(2)+')';const q=1+R()*3;x.fillRect(R()*s,R()*s,q,q)}
    for(let k=0;k<9;k++){x.strokeStyle='rgba(0,0,0,.32)';x.lineWidth=1.2;x.beginPath();let cx=R()*s,cy=R()*s;x.moveTo(cx,cy);for(let j=0;j<4;j++){cx+=(R()-.5)*30;cy+=(R()-.5)*30;x.lineTo(cx,cy)}x.stroke()}},256);
  return DTEX={brick,tile}}
const DMATS={};
function envDesat(h,m,k){const c=new THREE.Color(h),l=c.r*.3+c.g*.59+c.b*.11;return new THREE.Color(l,l,l).lerp(c,m).multiplyScalar(k)}
function envDunMats(th){const k=th.floor+'_'+th.wall;if(DMATS[k])return DMATS[k];const T=envDunTex();
  return DMATS[k]={floor:new THREE.MeshLambertMaterial({map:T.tile,vertexColors:true,color:envDesat(th.floor,.5,1.7)}),
    wall:new THREE.MeshLambertMaterial({map:T.brick,vertexColors:true,color:envDesat(th.wall,.5,1.6)})}}
const WNd=(x,y)=>{const h=Math.imul(x*73856093^y*19349663,2654435761)>>>0;return (h%1000)/1000};
function envGrid(cells,Wd,Hd,CS,ox,oz,th,R,pillars,torchP){
  const WH=2.4,SEC=12,secs=new Map(),M=envDunMats(th),trimL=[],torchL=[],hc=CS/2;
  const tint=new THREE.Color(0xffffff).lerp(new THREE.Color(th.light),.3).getHex();
  const S=(x,y)=>{const k=(x/SEC|0)+','+(y/SEC|0);let s=secs.get(k);if(!s){s={f:{P:[],N:[],U:[],C:[],I:[]},w:{P:[],N:[],U:[],C:[],I:[]},b:new EnvBatch()};secs.set(k,s)}return s};
  const quad=(o,a,b2,c,d,n,uv,col)=>{const base=o.P.length/3;for(const p of[a,b2,c,d]){o.P.push(p[0],p[1],p[2]);o.N.push(n[0],n[1],n[2]);o.C.push(col,col,col)}o.U.push(...uv);o.I.push(base,base+1,base+2,base,base+2,base+3)};
  const fl=(x,y)=>x>=0&&y>=0&&x<Wd&&y<Hd&&cells[y*Wd+x]>0;
  const DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
  for(let y=0;y<Hd;y++)for(let x=0;x<Wd;x++){const v=cells[y*Wd+x],wx=ox+(x+.5)*CS,wz=oz+(y+.5)*CS,s=S(x,y);
    if(v){const u0=(wx-hc)/4,u1=(wx+hc)/4,v0=-(wz+hc)/4,v1=-(wz-hc)/4,col=.86+WNd(x,y)*.26;
      quad(s.f,[wx-hc,0,wz+hc],[wx+hc,0,wz+hc],[wx+hc,0,wz-hc],[wx-hc,0,wz-hc],[0,1,0],[u0,v0,u1,v0,u1,v1,u0,v1],col);
      if(v===2&&pillars)s.b.add('d_pillar',wx,0,wz,0,.78,.75,.78,tint)}
    else{let nb=false;for(let dy=-1;dy<=1&&!nb;dy++)for(let dx=-1;dx<=1;dx++){if(fl(x+dx,y+dy)){nb=true;break}}if(!nb)continue;
      trimL.push({x:wx,y:WH+.03,z:wz});
      quad(s.w,[wx-hc,WH,wz+hc],[wx+hc,WH,wz+hc],[wx+hc,WH,wz-hc],[wx-hc,WH,wz-hc],[0,1,0],[0,0,1,0,1,1,0,1],.3);
      for(const [dx,dz] of DIRS){if(!fl(x+dx,y+dz))continue;const n=[dx,0,dz],r=[dz,0,-dx],cx=wx+dx*hc,cz=wz+dz*hc,sh=.85+R()*.25;
        quad(s.w,[cx-r[0]*hc,0,cz-r[2]*hc],[cx+r[0]*hc,0,cz+r[2]*hc],[cx+r[0]*hc,WH,cz+r[2]*hc],[cx-r[0]*hc,WH,cz-r[2]*hc],n,[0,0,1,0,1,WH/CS,0,WH/CS],sh);
        if(R()<torchP){const ry=Math.atan2(dx,dz);s.b.add('torch_mounted',cx,1.35,cz,ry,.72);torchL.push({x:cx+dx*.34,y:1.35+.52,z:cz+dz*.34,s:.72})}}}}
  for(const s of secs.values()){for(const [o,mat] of[[s.f,M.floor],[s.w,M.wall]]){if(!o.P.length)continue;const g=new THREE.BufferGeometry();
      g.setAttribute('position',new THREE.Float32BufferAttribute(o.P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(o.N,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(o.U,2));g.setAttribute('color',new THREE.Float32BufferAttribute(o.C,3));
      g.setIndex(o.P.length/3>65535?new THREE.Uint32BufferAttribute(o.I,1):new THREE.Uint16BufferAttribute(o.I,1));g.computeBoundingSphere();envOwn(L.group,new THREE.Mesh(g,mat))}
    envOwn(L.group,s.b.mesh(ENVMAT))}
  inst(geo('dtr',()=>new THREE.BoxGeometry(CS,.1,CS)),glowS(th.trim,.45),trimL);
  inst(geo('dto',()=>new THREE.SphereGeometry(.25,8,6)),glowS(th.light,1),torchL);
  const voidP=new THREE.Mesh(geo('void',()=>new THREE.PlaneGeometry(400,400)),new THREE.MeshBasicMaterial({color:0x000000}));voidP.rotation.x=-Math.PI/2;voidP.position.y=-.4;L.group.add(voidP)}
/* objetos espalhados pelas salas: barris, caixas, ossos, estandartes */
function envDunProps(rooms,cells,Wd,Hd,CS,ox,oz,th,R,bi,rank){const b=new EnvBatch(),hc=CS/2;
  const fl=(x,y)=>x>=0&&y>=0&&x<Wd&&y<Hd&&cells[y*Wd+x]>0,cp=(x,y)=>({x:ox+(x+.5)*CS,z:oz+(y+.5)*CS});
  const BIG=['barrel_small','barrel_large','box_small','box_large','crates_stacked','keg','barrel_small','box_small','rubble_half','table_medium'],SMALL=['candle_triple','bone_A','skull','ribcage','coin_stack_large'];
  const banner=['banner_blue','banner_red','banner_patternA_red'][rank%3];
  rooms.forEach((r,i)=>{const edge=[];
    for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){if(cells[y*Wd+x]!==1)continue;
      for(const [dx,dy] of[[1,0],[-1,0],[0,1],[0,-1]]){if(fl(x+dx,y+dy))continue;const ax=dy!==0?1:0,ay=dx!==0?1:0;
        if(!fl(x+ax,y+ay)||!fl(x-ax,y-ay))continue;if(fl(x+ax+dx,y+ay+dy)||fl(x-ax+dx,y-ay+dy))continue;edge.push({x,y,dx,dy})}}
    const n=i===0?1:Math.min(edge.length,2+Math.floor(R()*4)+(i===bi?3:0));
    for(let k=0;k<n&&edge.length;k++){const e=edge.splice(Math.floor(R()*edge.length),1)[0];if(cells[e.y*Wd+e.x]!==1)continue;const p=cp(e.x,e.y),ry=Math.atan2(-e.dx,-e.dy);
      const big=R()<.62,key=i===bi&&k<2?'coin_stack_large':big?pk(R,BIG):pk(R,SMALL);
      const px=p.x+e.dx*.35,pz=p.z+e.dy*.35;
      if(big||key==='coin_stack_large'){EW(b,key,px,0,pz,ry+(R()-.5)*.6,key==='crates_stacked'?1.8:key==='table_medium'?1.6:key==='rubble_half'?1.9:1.15);cells[e.y*Wd+e.x]=2}
      else EW(b,key,px,0,pz,ry+R(),key==='candle_triple'?.55:.45+R()*.2)}
    if(i!==0&&edge.length&&R()<.7){const e=edge[Math.floor(R()*edge.length)],p=cp(e.x,e.y);EH(b,i===bi?'banner_red':banner,p.x+e.dx*(hc-.3),0,p.z+e.dy*(hc-.3),Math.atan2(-e.dx,-e.dy),2.3)}
    for(let k=0,nd=i===0?0:1+Math.floor(R()*3);k<nd;k++){const cx=r.x+1+Math.floor(R()*(r.w-2)),cy=r.y+1+Math.floor(R()*(r.h-2));if(cells[cy*Wd+cx]!==1)continue;const p=cp(cx,cy);EW(b,pk(R,['bone_A','skull','rock_smallC','stone_smallA','bone_A']),p.x+(R()-.5)*1.2,0,p.z+(R()-.5)*1.2,R()*TAU,.4+R()*.25,.85)}
    if(i===bi&&edge.length){const e=edge[Math.floor(R()*edge.length)],p=cp(e.x,e.y);EW(b,'sword_shield',p.x+e.dx*(hc-.12),1.5,p.z+e.dy*(hc-.12),Math.atan2(-e.dx,-e.dy),1.3)}});
  envOwn(L.group,b.mesh(ENVMAT))}

