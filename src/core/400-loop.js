/* ================= LOOP ================= */
let last=performance.now(),hudAt348=0;
function frame(now){
  requestAnimationFrame(frame);
  /* v196 (Ian): relógio do mundo usa o tempo real (até 1 s por quadro); combate segue limitado a .05 para não atravessar paredes. Com PC lento, dias, estações e portais não atrasam. */
  const realDt=Math.max(0,Math.min(1,(now-last)/1000));window.WDT196=realDt;const rdt=Math.min(.05,realDt);last=now;
  AU.want=wantTrack();
  if(riftSound131&&(!started||paused||document.hidden||!AU.on||player?.dead))riftSound131.silence();
  if(!started){titleCam(rdt);ENV.occ.value=0;renderer.render(scene,camera);return}
  let dt=rdt;if(freeze>0){freeze-=rdt;dt=0}if(paused)dt=0;
  if(started&&!paused&&!touch&&mouseHeld)attack();
  if(started&&(time|0)!==FX2.lastSec){FX2.lastSec=time|0;markVisited()}
  if(run&&run.sovSk&&run.sovSk.cdT>0)run.sovSk.cdT-=dt;
  if(L.lampT>0&&L.lampL&&player){L.lampT-=dt;L.lampL.position.set(player.x,3,player.z);if(L.lampT<=0||L.mode!=='dungeon'){scene.remove(L.lampL);L.lampL=null;L.lampT=0;if(L.mode==='dungeon'){scene.fog.density=.018;toast('<b>[NARRADOR]</b> O Lampião apagou.')}}}
  if(FX2.slow>0){FX2.slow-=rdt;dt*=.3}FX2.cine-=rdt;if(FX2.inv>0)FX2.inv-=dt;if(dt>0&&bossE)updBossMech(bossE,dt);
  if(started&&bossE&&!bossE.dead&&!bossE.intro&&player&&Math.hypot(bossE.x-player.x,bossE.z-player.z)<17){bossE.intro=true;FX2.cine=1.8;FX2.slow=Math.max(FX2.slow,1);bigText(bossE.boss&&bossE.boss.n?bossE.boss.n:'GUARDIÃO',2000);shake(.5);sfx('arise')}FX2.comboT-=dt;if(FX2.comboT<=0)FX2.combo=0;FX2.perfCd-=rdt;
  time+=dt;ADT=dt;ENV.wind.value=time;if(dt>0){rareUpdate103(dt);update(dt);narratorUpdate105(dt);updateReadySounds();tutorialTick93(dt)}
  camUpdate(rdt);ENV.pl.value.set(player.x,1.1+terrH(player.x,player.z),player.z);ENV.ca.value.copy(camera.position);ENV.occ.value=player.dead?0:1;if(window.Golpes487)Golpes487.render();else renderer.render(scene,camera);drawOverlay();if(!paused&&now>=hudAt348){hudAt348=now+100;hud()}GFX267.tick(realDt);
}
let tcA=0;function titleCam(dt){tcA+=dt*.06;camera.position.set(Math.sin(tcA)*46,24,Math.cos(tcA)*46);camera.lookAt(0,2,0);if(L.crystal)L.crystal.rotation.y+=dt}
/* v243: vida no mundo — folhas caindo, borboletas de dia e vaga-lumes à noite, só perto do jogador */
const LIFE243={};
function life243(dt){if(typeof L==='undefined'||L.mode!=='world'||!player){if(LIFE243.g)LIFE243.g.visible=false;return}
 if(!LIFE243.g){const g=LIFE243.g=new THREE.Group();scene.add(g);
  const NL=70,lp=new Float32Array(NL*3),lc=new Float32Array(NL*3);const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.BufferAttribute(lp,3));lg.setAttribute('color',new THREE.BufferAttribute(lc,3));
  const leaf=new THREE.Points(lg,new THREE.PointsMaterial({size:.32,vertexColors:true,transparent:true,opacity:.9,depthWrite:false}));leaf.frustumCulled=false;g.add(leaf);LIFE243.leaf=leaf;LIFE243.lv=[];
  for(let i=0;i<NL;i++){LIFE243.lv.push({x:0,y:-99,z:0,s:Math.random()*6});const c=[[.85,.55,.18],[.55,.7,.22],[.9,.75,.3],[.7,.35,.15]][i%4];lc.set(c,i*3)}
  const NF=40,fp=new Float32Array(NF*3);const fg=new THREE.BufferGeometry();fg.setAttribute('position',new THREE.BufferAttribute(fp,3));
  const ff=new THREE.Points(fg,new THREE.PointsMaterial({size:.28,color:0xfff08a,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));ff.frustumCulled=false;g.add(ff);LIFE243.ff=ff;LIFE243.fv=[];for(let i=0;i<NF;i++)LIFE243.fv.push({x:0,y:-99,z:0,p:Math.random()*9});
  const wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.Float32BufferAttribute([0,0,-.12,.3,0,-.2,.25,0,.15, 0,0,-.12,.25,0,.15,0,0,.12, 0,0,-.12,-.25,0,.15,-.3,0,-.2, 0,0,-.12,0,0,.12,-.25,0,.15],3));wg.computeVertexNormals();
  const NB=14,bm=new THREE.InstancedMesh(wg,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}),NB);bm.frustumCulled=false;g.add(bm);LIFE243.bm=bm;LIFE243.bv=[];const cols=[0xffd24a,0xff8ad8,0x8ad0ff,0xffffff,0xff9a3a];
  for(let i=0;i<NB;i++){LIFE243.bv.push({x:0,y:-99,z:0,h:Math.random()*6,p:Math.random()*9});bm.setColorAt(i,new THREE.Color(cols[i%5]))}bm.instanceColor.needsUpdate=true}
 const g=LIFE243.g;g.visible=true;const t=time,px=player.x,pz=player.z,bio=biomeAt(px,pz),night=isNight(),cold=bio==='neve'||bio==='cristal',hot=bio==='vulcao'||bio==='deserto';
 const R=(a)=>(Math.random()*2-1)*a,gy=()=>0;
 {const P=LIFE243.leaf.geometry.attributes.position,on=!cold&&!hot;LIFE243.leaf.visible=on;if(on)LIFE243.lv.forEach((v,i)=>{if(v.y<gy(v.x,v.z)||Math.hypot(v.x-px,v.z-pz)>30){v.x=px+R(26);v.z=pz+R(26);v.y=gy(v.x,v.z)+4+Math.random()*7}v.s+=dt;v.y-=dt*(.6+.3*Math.sin(v.s*2.3));v.x+=dt*(.9+Math.sin(v.s*1.7)*1.2);v.z+=dt*Math.cos(v.s*1.3)*.8;P.setXYZ(i,v.x,v.y,v.z)});P.needsUpdate=true}
 {const P=LIFE243.ff.geometry.attributes.position,on=night&&!cold;LIFE243.ff.visible=on;if(on)LIFE243.fv.forEach((v,i)=>{if(v.y<-50||Math.hypot(v.x-px,v.z-pz)>22){v.x=px+R(20);v.z=pz+R(20);v.y=gy(v.x,v.z)+.5+Math.random()*2}v.p+=dt;v.x+=Math.sin(v.p*.9+i)*dt*.6;v.z+=Math.cos(v.p*.7+i*2)*dt*.6;v.y+=Math.sin(v.p*1.3)*dt*.25;P.setXYZ(i,v.x,v.y,v.z)});P.needsUpdate=true;LIFE243.ff.material.opacity=.55+.45*Math.sin(t*3)}
 {const M=LIFE243.bm,on=!night&&!cold&&!hot,m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),s=new THREE.Vector3(),p=new THREE.Vector3();M.visible=on;if(on){LIFE243.bv.forEach((v,i)=>{if(v.y<-50||Math.hypot(v.x-px,v.z-pz)>24){v.x=px+R(18);v.z=pz+R(18);v.y=0}v.p+=dt;v.h+=Math.sin(v.p*.8+i)*dt*1.5;v.x+=Math.cos(v.h)*dt*1.4;v.z+=Math.sin(v.h)*dt*1.4;v.y=gy(v.x,v.z)+.7+Math.sin(v.p*1.9)*.4+(i%3)*.4;e.set(0,-v.h+Math.PI/2,0);q.setFromEuler(e);s.set(.25+.75*Math.abs(Math.sin(v.p*14+i)),1,1);m.compose(p.set(v.x,v.y,v.z),q,s);M.setMatrixAt(i,m)});M.instanceMatrix.needsUpdate=true}}
}
/* v244: personagem mais vivo — inclina nas curvas e ao correr, olha em volta parado */
const AL244={up:new THREE.Vector3(0,1,0),q:new THREE.Quaternion(),a:new THREE.Vector3()};
function alive244(P,mv,dt){const m=P.m;if(!m||!m.body||P.dead||!dt)return;let df=(P.face-(P.f244??P.face));df=Math.atan2(Math.sin(df),Math.cos(df));P.f244=P.face;
 const tl=clamp(-df/dt*.035*mv,-.2,.2);P.lean244=(P.lean244||0)+(tl-(P.lean244||0))*Math.min(1,dt*8);P.fw244=(P.fw244||0)+(mv*.09-(P.fw244||0))*Math.min(1,dt*6);
 m.body.rotation.z+=P.lean244;m.body.rotation.x+=P.fw244;
 P.idle244=mv>.05||P.atkT>0?0:(P.idle244||0)+dt;const h=m.bones&&m.bones.head;
 if(h&&P.idle244>2.5){const k=Math.min(1,(P.idle244-2.5)*.8),t=P.idle244,yaw=(Math.sin(t*.45)*.5+Math.sin(t*1.1)*.12)*k;h.getWorldQuaternion(AL244.q);AL244.a.copy(AL244.up).applyQuaternion(AL244.q.invert());h.rotateOnAxis(AL244.a,yaw)}}
/* v244: pássaros (bando no alto e grupo no chão que foge), poeira dos passos e respingos na água */
const LF244={};
function inWater244(x,z){const b=snowB(x,z);if(b<.29||b>.7)return false;const rv=riverNear239(x,z);if(rv.d<riverWidth351(rv.b,z)/2)return true;const lk=lakeAt239(Math.round(x/CH),Math.round(z/CH));return !!(lk&&!['neve','cristal'].includes(biomeAt(lk.x,lk.z))&&Math.hypot(x-lk.x,z-lk.z)<lk.r)}
function life244(dt){if(!LIFE243.g||!player)return;const g=LIFE243.g;
 if(!LF244.bird){const bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.Float32BufferAttribute([0,0,.22,.07,0,-.18,-.07,0,-.18, 0,0,.05,.55,.04,-.08,0,0,-.12, 0,0,.05,0,0,-.12,-.55,.04,-.08, 0,.02,-.12,.1,0,-.3,-.1,0,-.3],3));
  const NB=16,bm=new THREE.InstancedMesh(bg,new THREE.MeshBasicMaterial({color:0x2b2630,side:THREE.DoubleSide}),NB);bm.frustumCulled=false;g.add(bm);LF244.bird=bm;LF244.bv=[];for(let i=0;i<NB;i++)LF244.bv.push({p:Math.random()*9,air:i<9});LF244.gr={x:0,z:0,st:'off',t:0};
  const pm=new THREE.InstancedMesh(new THREE.SphereGeometry(.16,6,5),new THREE.MeshBasicMaterial({transparent:true,opacity:.55,depthWrite:false}),90);pm.frustumCulled=false;g.add(pm);LF244.pm=pm;LF244.pv=[];for(let i=0;i<90;i++){LF244.pv.push({l:0});pm.setColorAt(i,new THREE.Color(1,1,1))}LF244.pi=0;LF244.st=0;LF244.lx=player.x;LF244.lz=player.z}
 const P=player,t=time,bio=biomeAt(P.x,P.z),night=isNight(),m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),sc=new THREE.Vector3(),ps=new THREE.Vector3(),M=LF244.bird,G=LF244.gr;
 const birds=!night&&bio!=='vulcao'&&bio!=='cristal';M.visible=birds&&L.mode==='world'&&g.visible;
 if(M.visible){if(G.st==='off'){G.t-=dt;if(G.t<=0){const a=Math.random()*6.28,d=14+Math.random()*8;G.x=P.x+Math.cos(a)*d;G.z=P.z+Math.sin(a)*d;G.st='chao';LF244.bv.forEach((v,i)=>{if(!v.air){v.x=G.x+(Math.random()-.5)*3;v.z=G.z+(Math.random()-.5)*3;v.y=0;v.h=Math.random()*6.28;v.vy=0}})}}
  else if(G.st==='chao'){if(Math.hypot(P.x-G.x,P.z-G.z)<7){G.st='voa';G.t=0;LF244.bv.forEach(v=>{if(!v.air){const a=Math.atan2(v.z-P.z,v.x-P.x)+(Math.random()-.5);v.vx=Math.cos(a)*7;v.vz=Math.sin(a)*7;v.vy=4+Math.random()*3}})}else if(Math.hypot(P.x-G.x,P.z-G.z)>60)G.st='off'}
  else{G.t+=dt;if(G.t>6){G.st='off';G.t=10+Math.random()*15}}
  LF244.bv.forEach((v,i)=>{v.p+=dt;let flap;if(v.air){const R=18+(i%3)*4,a=t*.25+i*.7;const cx=P.x+Math.sin(t*.05)*20,cz=P.z+Math.cos(t*.04)*20;v.x=cx+Math.cos(a)*R;v.z=cz+Math.sin(a)*R;v.y=20+Math.sin(t*.6+i)*2+(i%2)*3;v.h=-a;flap=Math.sin(v.p*(i%4?3:9))*.5+.5}
   else if(G.st==='off'){v.y=-999;flap=0}else if(G.st==='chao'){if(Math.random()<dt*.4)v.h+=(Math.random()-.5)*2;v.y=Math.max(0,Math.sin(v.p*7+i)*.04);flap=.15}
   else{v.x+=v.vx*dt;v.z+=v.vz*dt;v.y+=v.vy*dt;v.vy+=dt*1.5;v.h=Math.atan2(v.vx,v.vz);flap=Math.abs(Math.sin(v.p*16));}
   e.set(G.st==='chao'&&!v.air?Math.max(0,Math.sin(v.p*2.3+i))*.5:0,v.h,0);q.setFromEuler(e);const k=v.air?1.6:1.4;sc.set((.2+.8*flap)*k,k,k);m.compose(ps.set(v.x,v.y+(v.air?0:.12),v.z),q,sc);M.setMatrixAt(i,m)});M.instanceMatrix.needsUpdate=true}
 const pm=LF244.pm,mv=Math.hypot(P.x-LF244.lx,P.z-LF244.lz)/Math.max(dt,1e-3);LF244.lx=P.x;LF244.lz=P.z;LF244.st-=dt;
 if(mv>2&&mv<40&&LF244.st<=0&&!P.dead){const wet=L.mode==='world'&&inWater244(P.x,P.z),snow=bio==='neve'||bio==='cristal',sand=bio==='deserto';LF244.st=wet?.18:.28;const col=wet?[.75,.88,1]:snow?[.95,.97,1]:sand?[.86,.74,.5]:bio==='vulcao'?[.35,.3,.3]:[.62,.54,.42];
  for(let j=0;j<(wet?6:3);j++){const v=LF244.pv[LF244.pi=(LF244.pi+1)%90];const a=Math.random()*6.28;v.x=P.x+(Math.random()-.5)*.4;v.z=P.z+(Math.random()-.5)*.4;v.y=.1;v.vx=Math.cos(a)*(wet?1.6:.7);v.vz=Math.sin(a)*(wet?1.6:.7);v.vy=wet?2.5+Math.random()*1.5:.5;v.l=v.L=wet?.55:.6;v.w=wet;pm.setColorAt(LF244.pv.indexOf(v),new THREE.Color(...col))}
  pm.instanceColor.needsUpdate=true;if(wet&&Math.random()<.4)fxRing(P.x,P.z,0xbfe4ff,1.6,.5)}
 LF244.pv.forEach((v,i)=>{if(v.l>0){v.l-=dt;v.x+=v.vx*dt;v.z+=v.vz*dt;v.y+=v.vy*dt;if(v.w)v.vy-=9*dt;const k=Math.max(0,v.l/v.L),s=v.w?.7*k+.2:(1.6-k)*.9*k+.15;m.compose(ps.set(v.x,Math.max(.05,v.y),v.z),q.identity(),sc.set(s,s,s))}else m.makeScale(0,0,0);pm.setMatrixAt(i,m)});pm.instanceMatrix.needsUpdate=true}
/* v245: relevo — zonas planas perto do jogador (cidades, lagos, estradas) */
function ter245tick(){const T=window.TER245;if(!T)return;if(L.group)L.group.userData.terrainContainer245=true;const ow460=L.mode==='dungeon'&&!!L.ow460;if(T.OW)T.OW.value.x=ow460?1:0;const on=(L.mode==='world'||ow460)&&!(typeof window.TER245OFF!=='undefined'&&window.TER245OFF);T.on.value=on?1:0;if(!on||!player||ow460)return;
 const P=player;if(T.lx!=null&&Math.hypot(P.x-T.lx,P.z-T.lz)<24)return;T.lx=P.x;T.lz=P.z;const D=[];
 if(run&&run.surv437&&run.surv437.leveled&&run.surv437.leveled.length)run.surv437.leveled=[];
 for(const c of citiesAround(P.x,P.z,1800)){const cl=cityL(c),cr=cl>=8?125:cl>=6?95:65,cap501=c.capital&&c.name!=='Aster'&&window.Capitais501;D.push([c.x,c.z,cityBig533(c)?285:cap501?175:cr+20,0]);}/* v504: Capitais com muralha de 150 m ficam planas até 175 m */
 const cx=Math.round(P.x/CH),cz=Math.round(P.z/CH);for(let i=-8;i<=8;i++)for(let j=-8;j<=8;j++){const lk=lakeAt239(cx+i,cz+j);if(lk)D.push([lk.x,lk.z,lk.r+3,-1.8])}
 D.sort((a,b)=>Math.hypot(a[0]-P.x,a[1]-P.z)-Math.hypot(b[0]-P.x,b[1]-P.z));T.D.value.forEach((v,i)=>{const d=D[i];if(d)v.set(d[0],d[1],d[2],d[3]);else v.set(0,0,-1,0)});
 const sd=r=>Math.hypot(P.x-clamp(P.x,Math.min(r[0],r[2]),Math.max(r[0],r[2])),P.z-clamp(P.z,Math.min(r[1],r[3]),Math.max(r[1],r[3]))),R=roadSegs(P.x,P.z,1).sort((a,b)=>sd(a)-sd(b));T.R.value.forEach((v,i)=>{const r=R[i];if(r)v.set(r[0],r[1],r[2],r[3]);else v.set(1e7,1e7,1e7,1e7)})}
function update(dt){if(window.Loot353)Loot353.tick(dt);try{ter245tick();life243(dt);life244(dt)}catch(_){}
  const P=player;const motionX372=P.x,motionZ372=P.z;
  let ix=input.x,iz=input.z;
  if(keys.KeyW||keys.ArrowUp)iz-=1;if(keys.KeyS||keys.ArrowDown)iz+=1;if(keys.KeyA||keys.ArrowLeft)ix-=1;if(keys.KeyD||keys.ArrowRight)ix+=1;
  if(pcCam.yaw)[ix,iz]=camRot(ix,iz);
  if(FX2.inv>0){ix=-ix;iz=-iz}
  if(window.Cogu348&&Cogu348.asleep(P)||window.Living372&&Living372.riding())ix=iz=0;
  const il=Math.hypot(ix,iz);if(il>1){ix/=il;iz/=il}
  if(!P.dead){
    P.atkCd-=dt;P.comboT-=dt;try{passiveTick327(dt)}catch(_){}P.dodgeCd-=dt;P.iT-=dt;P.buff-=dt;P.guard-=dt;
    if(P.stealth>0){P.stealth-=dt;if(P.stealth<=0)setStealth(false)}
    resourceTick260(dt);recoveryTick258(dt);tick281(dt);const regen=naturalRegen(P);P.mp=Math.max(0,Math.min(P.maxmp,P.mp+dt*regen.mp));
    if(P.slowT>0)P.slowT-=dt;if(P.bleedT>0&&!(typeof isCinematic451==='function'&&isCinematic451())){P.bleedT-=dt;P.hp-=guardianDamage108(P,absorbHealingShield(P,P.bleedD*dt));if(P.hp<=0&&!P.dead)die()}
    if(P.shT>0)P.shT-=dt;else if(P.shield<P.maxsh)P.shield=Math.min(P.maxsh,P.shield+regen.shield*dt);
    if(regen.hp>0&&P.hp<P.maxhp&&!P.dead)P.hp=Math.min(P.maxhp,P.hp+regen.hp*dt);
    {const wasT=tired287();run.awake287=(run.awake287||0)+dt;if(!wasT&&tired287()){refreshStats();toast('<b>[CANSAÇO]</b> Você está há 2 dias sem dormir: −10% de dano e −10% de XP até descansar numa Pousada ou na Tenda Portátil do Acampamento.',7000)}}if(run.rested&&run.rested.t>0){run.rested.t-=dt;if(run.rested.t<=0){run.rested=null;refreshStats();toast('<b>[POUSADA]</b> O efeito do descanso acabou.')}}
    for(const c of Object.values(run.classCooldowns||{}))c.left=Math.max(0,c.left-dt);for(const s of P.skills)s.cdT=Math.max(0,s.cdT-dt);for(const s of run.stolen)s.cdT-=dt;if(run.fused)run.fused.cdT-=dt;if(run.food&&run.food.t>0){run.food.t-=dt;if(run.food.t<=0){refreshStats();toast('O efeito da comida acabou.')}}
    let mv=0;COLY344=P.jy||0;
    const sprintState372=P.sprint372||(P.sprint372={running:false,exhausted:false});
    const held372=touchSprint373||window.RUNLOCK378||Object.keys(keys).some(k=>keys[k]&&(remapCode(k)==='ShiftLeft'||k==='ShiftRight'&&keyOf('sprint')==='ShiftLeft'));
    const allowed372=il>.1&&!run.mounted&&!P.air344&&!(P.dodgeT>0)&&!(P.atkT>0)&&!(P.atkCd>.15)&&!(P.skillAnim155&&P.skillAnim155.until>time)&&!(window.Anim303&&Anim303.active());
    sprintState372.running=Sprint373.canSprint(sprintState372,martialState260(),held372,allowed372);
    if(P.dodgeT>0){const before372=P.dodgeT,step372=Math.min(dt,before372);P.dodgeT-=dt;const u0=1-before372/.32,u1=1-Math.max(0,P.dodgeT)/.32,envelope372=P.dashSpd?1:.4+.3*(Math.cos(Math.PI*u0)-Math.cos(Math.PI*u1))/Math.max(1e-6,u1-u0);const sp=(P.dashSpd||8.5)*envelope372;moveEnt(P,P.dir.x*sp*step372,P.dir.z*sp*step372);P.ghostT-=dt;if(P.ghostT<=0){P.ghostT=.04;fxGhost()}
      if(P.dashDmg){for(const e of enemies){if(e.dead||P.dashDmg.hit.has(e))continue;if(Math.hypot(e.x-P.x,e.z-P.z)<1.8+e.r){P.dashDmg.hit.add(e);hurtEnemy(e,P.dashDmg.dmg,P.x,P.z,{execute:P.dashDmg.execute,kb:3,fromPlayer:true,skillHit:true,stun:.6});hitstop(.05)}}}
      if(P.dodgeT<=0){P.dashDmg=null;P.dashSpd=0}mv=1}
    else if(il>.1){const sp=movementSpeed(P.spd*(run.mounted?1.8:1)*(setHas153('metamorfo','b')&&kitState111().form?1.12:1)*(kitState111().speed?.until>time?1+kitState111().speed.amount:1)*(uniqueHas183('swift')?1+.15*relicM204('swift'):1)*(1+.01*cons('vel'))*(boon184()?1.08:1))*(P.atkCd>.15&&!rankTalent('flow')?.45:1)*(P.slowT>0?.6:1)*(run.mounted?1:sprintState372.running?Sprint373.runFactor:(keys.KeyC||keys.AltLeft||(il>0&&il<.55))?Sprint373.walkFactor:(Sprint373.normalFactor||1.0));dprog('run',sp*dt*Math.min(1,il));const ox111=P.x,oz111=P.z;if(!iceMove240(P,ix*sp,iz*sp,dt))moveEnt(P,ix*sp*dt,iz*sp*dt);kitWalk111(Math.hypot(P.x-ox111,P.z-oz111));if(P.atkCd<=.15)turnTo(P,Math.atan2(ix,iz),dt,14);mv=Math.min(1,il)}else{try{iceMove240(P,0,0,dt)}catch(e){}}
    const moved372=Math.hypot(P.x-motionX372,P.z-motionZ372);Sprint373.spend(sprintState372,martialState260(),dt,moved372>.002,resourceWait263('vigor'));
    if(P.atkT>0){P.atkT+=dt*3.6;if(P.atkT>1)P.atkT=0}
    {stepVertical357(P,dt);COLY344=0}
    animChibi(P.m,{move:mv,sprint:sprintState372.running,walking:!!(keys.ControlLeft||keys.AltLeft||(il>0&&il<.55)),speed:dt>0?moved372/dt:0,atk:P.atkT,dead:0,wind:0,combo:P.combo,wep:animWep173(),aimPitch253:P.aimPitch253||0,dodge:P.dodgeT>0&&!run.mounted,skill:P.skillAnim155&&P.skillAnim155.until>time?P.skillAnim155.k:null,hit:(P.hitAnimT||0)>time&&!run.mounted},time);if(window.Anim303)Anim303.post(P);if(P.air344&&window.Anim303&&Anim303.air)Anim303.air(P,P.jvy);
    if(P.mountM){if(P.mountM.fox)foxAnim(P.mountM,mv);else animChibi(P.mountM,{move:mv,atk:0,dead:0,wind:0},time);P.mountM.root.position.set(P.x,0,P.z);P.mountM.root.rotation.y=P.face;P.m.body.position.y+=.95}
  }else{P.deadA=Math.min(1,(P.deadA||0)+dt*3);animChibi(P.m,{move:0,atk:0,dead:P.deadA,wind:0},time)}
  P.m.root.position.set(P.x,0,P.z);P.m.root.rotation.y=P.face;/* v331: giro e salto das animações de habilidade (antes eram zerados aqui) */if(window.Anim303&&Anim303.root)Anim303.root(P);try{if(window.Anim547&&Anim547.postPlayer)Anim547.postPlayer(P.m,{move:mv,speed:dt>0?moved372/dt:0},dt)}catch(_){}if(P.jy!==0&&Number.isFinite(P.jy)){if(P.dead){P.jy=0;P.air344=false}else P.m.root.position.y+=P.jy}/* v339: a lança sai da mão enquanto voa */if(P.spearGone339){const h339=P.spearGone339>time&&P.m.kind195==='spear'&&P.m.socket;if(P.m.socket)P.m.socket.visible=!h339;if(!h339)P.spearGone339=0}/* v338: a lança aponta para onde o golpe vai */try{if(P.m.kind195==='spear'&&window.Warrior127&&Warrior127.spearAim){const a338=window.Anim303&&Anim303.active?Anim303.active():null,sk338=P.skillAnim155&&P.skillAnim155.until>time,at338=P.atkT>0;Warrior127.spearAim(P.m,{anim:a338||(sk338||at338?null:'rest'),throwing:at338&&!sk338&&!a338})}}catch(_){}try{alive244(P,mv,dt)}catch(_){}P.aura.rotation.z+=dt;
  pLight.position.set(P.x,4,P.z);
  tickGates(dt);
  if(window.Gosma347)Gosma347.update(dt);for(const e of enemies)updEnemy(e,dt);curAtk=null;enemies=enemies.filter(e=>!e.gone);
  for(const a of allies)updAlly(a,dt);allies=allies.filter(a=>!a.dead);
  for(const n of npcs)if(!n.gone)updNpc(n,dt);npcs=npcs.filter(n=>!n.gone);
  if(riftContact131())return;
  if(L.mode==='world')updWorld(dt);else updDungeon(dt);
  updateProjectiles253(dt);
  updHazards(dt);
  for(let i=fxs.length-1;i>=0;i--){const f=fxs[i];if(f.o?.userData.gate487&&!f.o.userData.gate487.ready)continue;f.t+=dt;const k=f.t/f.dur;
    if(f.kind==='ring'){f.o.scale.setScalar(1+k*f.r*1.6);f.o.material.opacity=.9*(1-k)}
    else if(f.kind==='p'){f.o.position.x+=f.v.x*dt;f.o.position.y+=f.v.y*dt;f.o.position.z+=f.v.z*dt;f.v.y-=12*dt;f.o.material.opacity=1-k}
    else if(f.kind==='fn'){f.upd(f,Math.min(1,k),dt)}
    else{f.o.material.opacity=(f.kind==='ghost'?.35:.85)*(1-k);if(f.kind==='slash')f.o.scale.setScalar(1+k*.25)}
    if(k>=1){scene.remove(f.o);if(f.o.material){if(!f.o.material.userData.shared)f.o.material.dispose()}else f.o.traverse(m=>{if(m.material&&!m.material.userData.shared&&m.material!==OUT)m.material.dispose()});if(f.own)f.o.geometry.dispose();fxs.splice(i,1)}}
  for(const f of floats)f.t+=dt;floats=floats.filter(f=>f.t<.9);
  if(bossE&&!bossE.dead)bossLight.position.set(bossE.x,5,bossE.z);
  if(dlgT>0){dlgT-=dt;if(dlgT<=0){$('dlg').hidden=true;dlgT=0}}
}
function updWorld(dt){updEcon(dt);
  const P=player,nc=nearestCity(P.x,P.z),fal=cityFallen(nc.c),safe=nc.d<Math.max(36*CITYK,cityBig533(nc.c))&&!fal;
  if(fal&&nc.d<45*CITYK&&!(profile.raided155||{})[nc.c.id]){L.fallSp=L.fallSp||{};if(!L.fallSp[nc.c.id]){L.fallSp[nc.c.id]=1;const gr=clamp(rankOf()+1,0,9);for(let i=0;i<10;i++){const a=rnd(0,TAU),r=rnd(4,22);const e=spawnKind(wpick(worldKinds124(gr,nc.c.x,nc.c.z)).k,nc.c.x+Math.cos(a)*r,nc.c.z+Math.sin(a)*r,gr,{wild:true,breaker:true});e.gold*=2;if(i<3)makeElite(e)}toast('<b>[NARRADOR]</b> '+nc.c.name+' caiu. Monstros tomaram a cidade. Feche o Portal Primordial para salvá-la.',6000)}}updDayNight(dt);updEvents(dt);updWeather(dt);updInvasion(dt);updPet(dt);updGates341(dt);
  if(L.car){L.carT-=dt;if(L.carT<=0){L.carT=18;const c=L.car;for(let i=0;i<3;i++){const a=rnd(0,TAU),x=c.x+Math.cos(a)*14,z=c.z+Math.sin(a)*14;if(nearestCity(x,z).d<40*CITYK)continue;const e=spawnKind(wpick(worldKinds124(danger(x,z),x,z)).k,x,z,Math.max(danger(x,z),rankOf()-2),{wild:true});e.aggro=true}toast('<b>[CARAVANA]</b> Emboscada!',1500)}if(L.car.dead)L.car=null}
  if(unl('worldboss')){L.wbT=(L.wbT??300)-dt;const wb=enemies.find(e=>e.world&&!e.dead);if(!wb&&L.wbT<=0&&!safe){L.wbT=1200;spawnWorldBoss()}if(wb&&!wb.aggro){const dx=wb.roam.x-wb.x,dz=wb.roam.z-wb.z,d=Math.hypot(dx,dz);if(d<2)wb.roam={x:wb.x+rnd(-40,40),z:wb.z+rnd(-40,40)};else{wb.x+=dx/d*2*dt;wb.z+=dz/d*2*dt;wb.face=Math.atan2(dx,dz);wb.m.root.position.set(wb.x,0,wb.z);wb.m.root.rotation.y=wb.face}}}
  if(run.daily&&run.daily.day!==todayKey())ensureRun();
  if(run.penalty){run.penalty=false}/* v213 (Ian): diária no dia real não pune mais */
  L.loadT-=dt;if(L.loadT<=0){L.loadT=.35;updChunks(false)}
  if(L.moon)L.moon.position.set(P.x-80,70,P.z-150);
  for(const ch of chunks.values())if(ch.group.userData.crystal)ch.group.userData.crystal.rotation.y+=dt;
  for(let i=SEALS233.length-1;i>=0;i--){const r=SEALS233[i];if(!r.parent||!r.parent.parent){SEALS233.splice(i,1);continue}Rift131.update(r,dt);const rg=r.parent.userData.ring233;if(rg)rg.rotation.z+=dt*.5}for(const g of gates)if(g.mesh){if(g.mesh.userData.rift131)Rift131.update(g.mesh,dt);else{g.ring.rotation.z+=dt*.6;g.sw.rotation.z-=dt*2.5}}
  if(riftLight131){let nearest=null,dist=22;for(const g of gates){const d=Math.hypot(g.x-P.x,g.z-P.z);if(g.mesh?.userData.rift131&&d<dist){nearest=g;dist=d}}riftLight131.intensity=nearest?(4.2+Math.sin(time*1.4)*.65)*clamp((22-dist)/12,0,1):0;if(nearest){riftLight131.position.set(nearest.x,2.4,nearest.z+.8);riftLight131.color.copy(nearest.mesh.userData.rift131.color)}
   if(AU.ctx&&AU.on&&window.RiftAudio131&&!document.hidden&&!P.dead){if(!riftSound131)riftSound131=RiftAudio131.create(AU.ctx,AU.fx);if(nearest){const dx=nearest.x-P.x,dz=nearest.z-P.z,pan=(dx*camera.matrixWorld.elements[0]+dz*camera.matrixWorld.elements[2])/12;riftSound131.update(nearest.mesh.userData.rift131.time,Math.pow(clamp((22-dist)/17,0,1),1.6),pan);}else riftSound131.silence();}else if(riftSound131)riftSound131.silence();
  }
  L.spawnT-=dt;if(typeof isCinematic451==='function'&&isCinematic451())L.spawnT=Math.max(L.spawnT,1);/* v455: não nasce monstro durante cena/diálogo */
  if(L.spawnT<=0){
    const inAto1=window.Intro401?.guided?.()||(profile?.classless&&!Campaign327?.state?.('a1')?.done);
    const lv455=run.level||1;L.spawnT=inAto1?7.5:lv455<=12?3.5:2.5;const wild=enemies.filter(e=>e.wild&&!e.breaker&&!e.dead).length;/* v455 (Ian: muito monstro): menos selvagens juntos até o nível 12 */const cap455=inAto1?3:lv455<=5?5:lv455<=12?7:10;
    const safeBuffer=inAto1&&((nc.c&&nc.c.name==='Aster'&&nc.d<430)||!!window.Fronteira551?.active());
    if(!safeBuffer&&wild<cap455&&nc.d>30){for(let t=0;t<10;t++){const a=rnd(0,TAU),d=rnd(28,44),x=P.x+Math.cos(a)*d,z=P.z+Math.sin(a)*d;if(nearestCity(x,z).d<48*CITYK||!worldFree(x,z,1.5))continue;
      const rk455=rankOf(),dg455=danger(x,z);/* v455 (Ian: morro rápido): selvagem aleatório nasce no máximo no rank do jogador (25% de chance de rank +1); região mais perigosa segue perigosa pelos portais, elites, chefes e masmorras */const gr=clamp(Math.max(Math.min(dg455,rk455+(Math.random()<.25?1:0)),rk455-3),0,9);const resident124=worldKinds124(gr,x,z),k=wpick(resident124).k;const n=k==='minion'?3:Math.random()<.4?2:1;
      for(let i=0;i<n;i++){const e=spawnKind(i?wpick(resident124).k:k,x+rnd(-2,2),z+rnd(-2,2),gr,{wild:true});if(isNight()){e.hp*=1.3;e.maxhp*=1.3;e.dmg*=1.25;e.nightRewardBalance=true}bioMob(e,biomeAt(x,z))}break}}}
  // v155 (Ian): monstros que escaparam de um portal ficam no mundo mesmo longe de você (só não são desenhados); no máximo 80, saem os mais distantes.
  {const br=[];for(const e of enemies)if(e.wild&&!e.dead){const d=Math.hypot(e.x-P.x,e.z-P.z);if(e.breaker){e.m.root.visible=d<=220;br.push([d,e])}else if(d>90){scene.remove(e.m.root);e.gone=true}}
   if(br.length>80)br.sort((a,b)=>b[0]-a[0]).slice(0,br.length-80).forEach(([,e])=>{scene.remove(e.m.root);e.gone=true})}
  if(safe&&!P.dead){const b=naturalRegen(P),c=naturalRegen(P,true);P.hp=Math.min(P.maxhp,P.hp+(c.hp-b.hp)*dt);P.mp=Math.min(P.maxmp,P.mp+(c.mp-b.mp)*dt);for(const a of allies)a.hp=Math.min(a.maxhp,a.hp+a.maxhp*.1*dt)}
  if(safe&&L.lastCity!==nc.c){L.lastCity=nc.c;if(nc.c.name!=='Aster')unlockLore('city');bigText(nc.c.name.toUpperCase(),1200);(nc.c.name==='Aster'?logNews:toast)('<b>[NARRADOR]</b> Zona segura: cidade de '+nc.c.name+'.');L.cands=genCands()}
  if(!safe&&nc.d>40)L.lastCity=null;
  L.turT=(L.turT||0)-dt;if(L.turT<=0){L.turT=1;for(const e of enemies){if(e.dead||!e.breaker)continue;const n=nearestCity(e.x,e.z);if(n.d<defenseRange(n.c)&&cityL(n.c)>=5&&!cityFallen(n.c)){hurtEnemy(e,e.maxhp*.06,n.c.x,n.c.z,{kb:0,pierce:true});fxLine([{x:n.c.x+(e.x-n.c.x)/Math.max(.01,n.d)*CITYR,z:n.c.z+(e.z-n.c.z)/Math.max(.01,n.d)*CITYR},{x:e.x,z:e.z}],0xffd070)}}}
  L.hunterT-=dt;if(L.hunterT<=0){L.hunterT=10;if(!isNight())for(const ch of chunks.values())if(ch.city&&!cityFallen(ch.city)&&npcs.filter(n=>n.kind==='citizen'&&!n.gone&&n.home===ch.city).length</*v486 (Ian: "tem muita pessoa")*/2+Math.min(4,Math.ceil(cityL(ch.city)/2))){spawnCitizen(ch.city);if(npcs.filter(n=>n.critter&&!n.gone&&n.home===ch.city).length<3)spawnCritter(ch.city)}for(const ch of chunks.values())if(ch.city&&npcs.filter(n=>n.kind==='hunter'&&n.home===ch.city).length<5)spawnHunter(ch.city,false)}
}
function updDungeon(dt){
  for(const it of L.exits){if(it.grp?.userData.rift131){riftExitVisual131(it);Rift131.update(it.grp,dt);}else it.ring.rotation.z+=dt*.8;}
  if(riftLight131){const e=L.exits.filter(it=>it.grp?.userData.rift131).sort((a,b)=>Math.hypot(a.x-player.x,a.z-player.z)-Math.hypot(b.x-player.x,b.z-player.z))[0],dist=e?Math.hypot(e.x-player.x,e.z-player.z):100;riftLight131.intensity=e?(4.2+Math.sin(time*1.4)*.65)*clamp((22-dist)/12,0,1):0;if(e){riftLight131.position.set(e.x,2.1,e.z+.7);riftLight131.color.copy(e.grp.userData.rift131.color);}if(AU.ctx&&AU.on&&window.RiftAudio131&&!document.hidden&&!player.dead){if(!riftSound131)riftSound131=RiftAudio131.create(AU.ctx,AU.fx);if(e)riftSound131.update(e.grp.userData.rift131.time,Math.pow(clamp((22-dist)/17,0,1),1.6));else riftSound131.silence();}}

  updSpecial(dt);expeditionUpdate(dt);updateCoreDefense(dt);updateCombat117();
  if(L.brk){updBreak(dt)}else if(L.bossDead&&L.expedition?.s.type!=='extract'){L.closeT-=dt;if(L.closeT<=0){startBreak();return}if(Math.floor(L.closeT)===30&&!L.warn30){L.warn30=true;toast('<b>[NARRADOR]</b> 30 segundos para a masmorra QUEBRAR. Saia pelo portal ou fique e sobreviva à invasão.',5000)}}
  L.markT-=dt;if(L.markT>0)return;L.markT=.15;
  const G=L.grid,P=player,cx=Math.floor((P.x-G.ox)/G.CS),cz=Math.floor((P.z-G.oz)/G.CS);
  const vr460=(L.ow460?12:6)+(window.Attr462?Attr462.surv().reveal:0);for(let dy=-vr460;dy<=vr460;dy++)for(let dx=-vr460;dx<=vr460;dx++){if(dx*dx+dy*dy>vr460*vr460)continue;const x=cx+dx,y=cz+dy;if(x>=0&&y>=0&&x<G.W&&y<G.H)L.visited[y*G.W+x]=1}
  L.rooms.forEach((r,i)=>{if(L.seen.has(i))return;if(cx>=r.x&&cx<r.x+r.w&&cz>=r.y&&cz<r.y+r.h){L.seen.add(i);
    for(const e of enemies)if(e.room===i&&!e.dead){e.aggro=true;if(e.isBoss)bossAggro(e)}
    if(i===L.bossRoom&&(!L.combat117||L.combat117.spawned))bigText(L.defense?'NÚCLEO':'GUARDIÃO',1000);if(r.hostile)toast('<b>[NARRADOR]</b> Caçadores hostis! Eles querem seu ouro.');}});
}
/* Terceira pessoa: botão direito arrastado gira a câmera (v476: defesa no botão do meio); cursor livre para avisos e menus. */
const pcCam={yaw:0,pitch:.03,distance:2.25,active:false,firstPerson:false};
window.pcCam=pcCam;
function camRot(x,z){const c=Math.cos(pcCam.yaw),s=Math.sin(pcCam.yaw);return[x*c+z*s,-x*s+z*c]}
function cameraLook373(dx,dy){pcCam.yaw-=dx*.003;const fp=!!pcCam.firstPerson;pcCam.pitch=clamp(pcCam.pitch+dy*.003,fp?-1.45:-.85,fp?1.45:1.10)}
addEventListener('contextmenu',e=>{if(!touch&&e.target===$('c'))e.preventDefault()});
let cameraDrag375=null;
function releaseCamera373(){const p=cameraDrag375;cameraDrag375=null;pcCam.active=false;if(p&&$('c').hasPointerCapture(p.id))$('c').releasePointerCapture(p.id)}
$('c').addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.button!==2||!started||paused||modalOpen||!$('gameMenu95').hidden)return;cameraDrag375={id:e.pointerId,x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY};pcCam.active=true;try{$('c').setPointerCapture(e.pointerId)}catch(_){}e.preventDefault()});
$('c').addEventListener('pointermove',e=>{const p=cameraDrag375;if(!p||p.id!==e.pointerId)return;if(!(e.buttons&2)||paused||modalOpen){releaseCamera373();return}p.moved472=(p.moved472||0)+Math.abs(e.clientX-p.x)+Math.abs(e.clientY-p.y);cameraLook373(e.clientX-p.x,e.clientY-p.y);p.x=e.clientX;p.y=e.clientY});
addEventListener('pointerup',e=>{if(e.button===2){window.camMoved472=cameraDrag375?(cameraDrag375.moved472||0):0;releaseCamera373()}});
$('c').addEventListener('lostpointercapture',releaseCamera373);
addEventListener('pointercancel',releaseCamera373);
addEventListener('keydown',e=>{if(e.code==='Escape')releaseCamera373()});
addEventListener('blur',releaseCamera373);
let cameraTouch372=null;
$('c').addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'||!started||paused||modalOpen||!$('gameMenu95').hidden||e.clientX<innerWidth*.5)return;cameraTouch372={id:e.pointerId,x:e.clientX,y:e.clientY};$('c').setPointerCapture(e.pointerId)});
$('c').addEventListener('pointermove',e=>{const p=cameraTouch372;if(!p||p.id!==e.pointerId)return;cameraLook373(e.clientX-p.x,e.clientY-p.y);p.x=e.clientX;p.y=e.clientY});
for(const event of ['pointerup','pointercancel','lostpointercapture'])$('c').addEventListener(event,e=>{if(cameraTouch372?.id===e.pointerId)cameraTouch372=null});
function camUpdate(dt){
  const P=player;cam.x+=(P.x-cam.x)*(1-Math.exp(-14*dt));cam.z+=(P.z-cam.z)*(1-Math.exp(-14*dt));
  if((paused||modalOpen||!$('gameMenu95').hidden)&&pcCam.active)releaseCamera373();
  shakeA=Math.max(0,shakeA-dt*2.2);const s=shakeA*shakeA*1.2;
  const mounted=!!run?.mounted||!!(window.Living372&&Living372.riding());
  const isFP=!!(pcCam.firstPerson&&!mounted&&!P.dead);
  if(isFP){
    /* 1ª Pessoa Skyrim: Câmera na linha dos olhos (1.68m, alinhada à 3ª pessoa), corpo de 3ª pessoa oculto para não clipar. */
    if(window.FP550)FP550.body(true);
    const eyeY=terrH(P.x,P.z)+(P.jy||0)+1.68+(window.FP550?.bobY||0);
    const [fx,fz]=camRot(0,-.08);
    camera.position.set(P.x+fx,eyeY,P.z+fz);
    camera.position.x+=rnd(-s,s);camera.position.y+=rnd(-s,s);
    const [vx,vz]=camRot(0,-Math.cos(pcCam.pitch));
    camera.lookAt(camera.position.clone().add(new THREE.Vector3(vx,-Math.sin(pcCam.pitch),vz)));
    if(!P.dead)P.face=Math.atan2(vx,vz);
  }else{
    /* 3ª Pessoa Witcher/Skyrim: Modelo 100% visível, câmera over-the-shoulder a 1.60m/2.25m, altura inalterada. */
    if(P.m?.root&&!P.m.root.visible)P.m.root.visible=true;
    if(P.m?.bones?.head&&P.m.bones.head.scale.x<.1)P.m.bones.head.scale.set(.88,.88,.88);
    const pivot=new THREE.Vector3(cam.x,terrH(cam.x,cam.z)+(P.jy||0)+(mounted?2.5:1.60),cam.z);
    /* v377 (Ian): câmera estilo The Witcher 3 — perto, sobre o ombro direito, personagem um pouco à esquerda. */
    const distance=mounted?4.2:2.25,cp=Math.cos(pcCam.pitch),sp=Math.sin(pcCam.pitch);
    const [ox,oz]=camRot(mounted?.35:.45,distance*cp),offset=new THREE.Vector3(ox,distance*sp,oz);
    offset.y=Math.max(offset.y,terrH(pivot.x+ox,pivot.z+oz)+.30-pivot.y);
    // Sweep a camera-sized sphere against terrain and the same solid world geometry as movement.
    let safe=distance;
    const steps=Math.ceil(distance/.10),q=new THREE.Vector3();
    for(let i=1;i<=steps;i++){
      q.copy(pivot).addScaledVector(offset,i/steps);
      const blocked=q.y<terrH(q.x,q.z)+.22||(L.grid?!freeAt(q.x,q.z,.23):!worldFree(q.x,q.z,.23,q.y-.22));
      if(blocked){safe=Math.max(.85,distance*(i-1)/steps);break}
    }
    pcCam.distance=safe<pcCam.distance?safe:Math.min(safe,pcCam.distance+dt*5);
    camera.position.copy(pivot).addScaledVector(offset,pcCam.distance/distance);
    camera.position.x+=rnd(-s,s);camera.position.y+=rnd(-s,s);
    const [vx,vz]=camRot(0,-Math.cos(pcCam.pitch));
    camera.lookAt(camera.position.clone().add(new THREE.Vector3(vx,-Math.sin(pcCam.pitch),vz)));
  }
  if(window.FP550?.tick)FP550.tick(dt);
  {const C=window.CINE231;if(C){C.t+=Math.min(.05,Math.max(0,dt||0));const a=C.t*.35;const ch245=terrH(C.x,C.z);camera.position.set(C.x+Math.cos(a)*22+rnd(-s,s),11+ch245+rnd(-s,s),C.z+Math.sin(a)*22);camera.lookAt(C.x,4+ch245,C.z);if(C.t>C.dur){window.CINE231=null;/* v455 (Ian): ao fim da âncora/junção, 3 s sem dano nem aggro para se posicionar */window._cinematicGrace451=performance.now()+3000;if(player&&!player.dead)player.iT=Math.max(player.iT||0,3)}}}
}

