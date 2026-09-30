// Warrior only. The same held weapon is used at rest, walking and attacking.
function equipWarriorStudy(m){
 const [skin,,leather,,iron,edge,,wood]=m.mats;
 for(const child of [...m.armR.children])if(child.isMesh&&[iron,edge,wood].includes(child.material))m.armR.remove(child);
 const hand=new THREE.Group();hand.name='right-hand-grip';hand.position.set(0,-.65,.075);m.armR.add(hand);m.handR=hand;
 const weapon=new THREE.Group();weapon.name='held-machete';hand.add(weapon);m.weapon=weapon;
 function mesh(geometry,material,x=0,y=0,z=0){const a=new THREE.Mesh(geometry,material);a.position.set(x,y,z);a.castShadow=a.receiveShadow=true;weapon.add(a);return a}
 const handle=mesh(new THREE.CylinderGeometry(.034,.036,.24,12),leather,0,0,0);handle.rotation.x=Math.PI/2;
 for(let i=0;i<7;i++){const ring=mesh(new THREE.TorusGeometry(.035,.004,5,12),wood,0,0,-.092+i*.03);}
 mesh(new THREE.BoxGeometry(.19,.055,.045),iron,0,0,.135);
 const pommel=mesh(new THREE.SphereGeometry(.041,12,8),iron,0,0,-.14);pommel.scale.set(1,1,.65);
 const outline=new THREE.Shape();outline.moveTo(-.048,.16);outline.lineTo(.075,.16);outline.lineTo(.118,.64);outline.quadraticCurveTo(.13,.75,.025,.84);outline.lineTo(-.035,.77);outline.lineTo(-.048,.16);
 const blade=new THREE.ExtrudeGeometry(outline,{depth:.026,bevelEnabled:true,bevelThickness:.008,bevelSize:.008,bevelSegments:2,steps:1,curveSegments:5});blade.translate(0,0,-.013);blade.rotateX(Math.PI/2);m.blade=mesh(blade,iron);
 // Sharpened edge follows the cutting side, in the same blade plane.
 const cutting=new THREE.BufferGeometry();cutting.setAttribute('position',new THREE.Float32BufferAttribute([.075,-.022,.16,.118,-.022,.64,.09,-.023,.63,.075,-.022,.16,.09,-.023,.63,.05,-.023,.18,.118,-.022,.64,.025,-.022,.84,.09,-.023,.63],3));cutting.computeVertexNormals();const sharp=edge.clone();sharp.side=THREE.DoubleSide;m.mats.push(sharp);m.bladeEdge=mesh(cutting,sharp);
 const tip=new THREE.Object3D();tip.position.set(.025,0,.84);weapon.add(tip);m.bladeTip=tip;
 return m;
}
function animateWarriorGrip(m,st){
 const wind=THREE.MathUtils.clamp(st.wind||0,0,1),atk=THREE.MathUtils.clamp(st.atk||0,0,1);
 m.handR.rotation.set(.28,0,0);
 if(st.dead>0)return;
 if(!(wind>0||atk>0))return; // The approved walking controls remain untouched.
 // The last part of the telegraph is the cut; contact is the wind/atk boundary.
 const rest={ax:0,ay:0,az:-.18,by:0,hx:.28,hy:0,hz:0};
 const ready={ax:-1.48,ay:-.85,az:.20,by:.38,hx:1.38,hy:.95,hz:-.5};
 const hit={ax:-.92,ay:.20,az:-.24,by:-.30,hx:.8,hy:-.35,hz:-.55};
 const follow={ax:-.7,ay:.55,az:-.55,by:-.48,hx:.58,hy:-.55,hz:-.65};
 const smooth=x=>{x=THREE.MathUtils.clamp(x,0,1);return x*x*(3-2*x)};
 let a,b,t;
 if(wind>0){if(wind<.64){a=rest;b=ready;t=smooth(wind/.64)}else{a=ready;b=hit;t=smooth((wind-.64)/.36)}}
 else if(atk<.20){a=hit;b=follow;t=smooth(atk/.20)}
 else{a=follow;b=rest;t=smooth((atk-.20)/.80)}
 const pose={};for(const k in a)pose[k]=THREE.MathUtils.lerp(a[k],b[k],t);
 m.armR.rotation.set(pose.ax,pose.ay,pose.az);m.body.rotation.y=pose.by;
 m.handR.rotation.set(pose.hx,pose.hy,pose.hz);m.armL.rotation.x=-.25*Math.sin(Math.PI*(wind||1-atk));
}

// Role accessory adapter for the continuous-body study.
// This file only prepares hierarchy; animation remains in the approved controller.
function prepareGoblinRoleStudy(m){
  const role=m?.goblin118||'warrior';
  if(!m||!m.armR)return m;
  if(role==='warrior' && typeof equipWarriorStudy==='function'){
    m.roleStudy=role;m.useWarriorGrip=true;
    return equipWarriorStudy(m);
  }

  // All roles expose the same hand anchor.  The grip is at the existing hand
  // center, so adding it does not alter the approved arm or walk transforms.
  const hand=new THREE.Group();
  hand.name='right-hand-grip';
  hand.position.set(0,-.65,.075);
  m.armR.add(hand);
  m.handR=hand;
  m.roleStudy=role;
  m.useWarriorGrip=role==='warrior';

  // The eyes now sit on the skin, rather than protruding through the brim.
  for(const child of m.head.children){
    if((role==='shield'||role==='archer')&&child.geometry?.type==='SphereGeometry'&&Math.abs(child.geometry.parameters.radius-.35)<.001)child.position.y+=.075;
    if(role==='shaman'&&child.geometry?.type==='ConeGeometry'&&child.geometry.parameters.radius>.3)child.position.y+=.16;
  }

  if(role==='archer'){
    // The approved bow is the first group attached at the old armL hand point.
    // Move only its anchor; preserve its geometry and scale.
    for(const child of m.armL?.children||[]){
      if(child.isGroup && Math.abs(child.position.y+.46)<.001){
        child.position.y=-.65;
        break;
      }
    }
  }

  if(role==='brute'){
    // Reparent only the old sword pieces. Keep their arm-local pose at setup,
    // then express that pose relative to the new hand anchor.
    const [,,leather,,iron,edge,,wood]=m.mats||[];
    const old=[];
    for(const child of [...m.armR.children]){
      if(!child.isMesh)continue;
      const weaponMaterial=child.material===wood||child.material===edge||child.material===iron;
      const swordRange=child.position.y<-.02 || child.position.y>.20;
      if(weaponMaterial&&swordRange)old.push(child);
    }
    for(const child of old){
      const p=child.position.clone(),q=child.quaternion.clone(),s=child.scale.clone();
      m.armR.remove(child);hand.add(child);
      child.position.copy(p).sub(hand.position);
      child.quaternion.copy(q);child.scale.copy(s);
    }
  }
  return m;
}

function equipShieldStudy(m){
 const shoulder=m.armR.children.filter(p=>p.isMesh&&p.material===m.mats[4]&&p.geometry.type==='SphereGeometry');
 shoulder.forEach(p=>m.armR.remove(p));m.armR.remove(m.handR);equipWarriorStudy(m);shoulder.forEach(p=>m.armR.add(p));
 m.weapon.name='shield-short-sword';m.blade.scale.set(.65,1,.72);m.bladeEdge.scale.copy(m.blade.scale);m.bladeTip.position.set(.025*.65,0,.84*.72);m.shieldStudy=true;return m;
}
function animateShieldStudy(m,st,t){
 m.handR.rotation.set(.28,0,0);if(st.dead>0)return;
 const wind=THREE.MathUtils.clamp(st.wind||0,0,1),atk=THREE.MathUtils.clamp(st.atk||0,0,1);if(!wind&&!atk)return;
 const rest={ax:-.2,az:0,bx:.08,by:0,bz:0,hx:.28},ready={ax:-.75,az:-.12,bx:.04,by:-.22,bz:-.03,hx:.45},hit={ax:-1.30,az:-.12,bx:.12,by:.06,bz:.12,hx:1.30},follow={ax:-1.38,az:-.15,bx:.14,by:.09,bz:.14,hx:1.38};
 let a,b,q;if(wind){if(wind<.64){a=rest;b=ready;q=wind/.64}else{a=ready;b=hit;q=(wind-.64)/.36}}else if(atk<.18){a=hit;b=follow;q=atk/.18}else{a=follow;b=rest;q=(atk-.18)/.82}q=q*q*(3-2*q);const p={};for(const k in a)p[k]=THREE.MathUtils.lerp(a[k],b[k],q);
 m.armR.rotation.set(p.ax,0,p.az);m.body.rotation.x=p.bx;m.body.rotation.y=p.by;m.body.position.z=p.bz;m.handR.rotation.set(p.hx,0,0);
 const protect=Math.sin(Math.PI*(wind?wind:1-atk));m.armL.rotation.x=-.5-.15*protect;m.armL.rotation.y=-.15-.05*protect;
}

// Shaman study adapter.  It prepares the approved staff hierarchy and a
// local-only release orb; it does not alter damage, collision, or game state.
function equipShamanStudy(m){
  if(!m||!m.armR||!m.handR)return m;
  const [,dark,leather,,iron,edge,bone,wood,,eye]=m.mats||[];
  const staff=new THREE.Group();staff.name='shaman-staff';m.handR.add(staff);
  const moved=[];
  for(const child of [...m.armR.children]){
    if(!child.isMesh)continue;
    const staffMat=child.material===wood||child.material===bone||child.material===eye;
    if(!staffMat && !(child.material===leather&&child.geometry?.type==='CylinderGeometry'&&child.position.y>.4))continue;
    // Staff ornaments move with the staff; the box bracer stays on the arm.
    const p=child.position;
    if(child.material===wood || p.y>.80 || (child.material===leather&&child.geometry?.type==='CylinderGeometry'&&p.y>.4)){moved.push(child)}
  }
  for(const child of moved){
    const p=child.position.clone(),q=child.quaternion.clone(),s=child.scale.clone();
    m.armR.remove(child);staff.add(child);
    child.position.copy(p).sub(m.handR.position);
    child.quaternion.copy(q);child.scale.copy(s);
  }
  staff.userData.gripHelper=new THREE.Object3D();
  staff.userData.gripHelper.name='staff-grip-helper';
  staff.userData.gripHelper.position.set(0,0,0);
  m.handR.add(staff.userData.gripHelper);
  const core=moved.find(x=>x.material===eye);
  const emitter=new THREE.Object3D();emitter.name='staff-emitter';
  // The staff pieces were shifted into hand-local space; follow the actual
  // crown core rather than reusing its old arm-local y value.
  emitter.position.copy(core?core.position:new THREE.Vector3(0,1.48,.1));staff.add(emitter);
  if(core){m._shamanCoreOriginalMaterial=core.material;m._shamanCoreGlow=core.material.clone();m._shamanCoreGlow.emissive=new THREE.Color(0xe9a53a);m._shamanCoreGlow.emissiveIntensity=0;core.material=m._shamanCoreGlow;m._shamanCoreMesh=core;m.mats.push(m._shamanCoreGlow)}
  m.staff=staff;m.staffEmitter=emitter;m.shamanStudy=true;
  return m;
}

function animateShamanStudy(m,st,t){
  if(!m?.shamanStudy||!m.handR||!m.staffEmitter)return;
  const wind=THREE.MathUtils.clamp(st?.wind||0,0,1),atk=THREE.MathUtils.clamp(st?.atk||0,0,1);
  const active=wind>0||atk>0;
  const clearOrb=()=>{if(m._shamanStudyOrb){m.root.remove(m._shamanStudyOrb);m._shamanStudyOrb.geometry.dispose();m._shamanStudyOrb.material.dispose();m._shamanStudyOrb=null}m._shamanStudyReleased=false};
  if(st?.dead>0){m.handR.rotation.set(0,0,0);clearOrb();if(m._shamanCoreGlow)m._shamanCoreGlow.emissiveIntensity=0;return}
  if(!active){m.handR.rotation.set(0,0,0);clearOrb();if(m._shamanCoreGlow)m._shamanCoreGlow.emissiveIntensity=0;m._shamanStudyLastT=t;return}
  const hold=wind>0?wind:Math.pow(1-atk,3);
  m.armR.rotation.x=THREE.MathUtils.lerp(-.08,-.45,hold);m.armR.rotation.z=THREE.MathUtils.lerp(-.10,-.35,hold);
  m.head.rotation.x=THREE.MathUtils.lerp(.06,-.12,hold);m.armL.rotation.x=-1.7*hold;m.armL.rotation.z=.4*hold;
  m.body.rotation.y=Math.sin(t*5)*.12*hold;m.body.position.y=Math.sin(t*2)*.012+.025*hold;
  const smooth=x=>x*x*(3-2*x);
  // Wind raises and presents the staff; atk releases from the core and then
  // returns the grip. No branch here runs during ordinary walking.
  if(wind>0){
    clearOrb();
    const q=smooth(wind);
    m.handR.rotation.set(THREE.MathUtils.lerp(0,1.55,q),THREE.MathUtils.lerp(0,.18,q),THREE.MathUtils.lerp(0,.32,q));
    if(m._shamanCoreGlow)m._shamanCoreGlow.emissiveIntensity=1.7*q;
  }else if(atk<.22){
    const q=smooth(atk/.22);
    m.handR.rotation.set(THREE.MathUtils.lerp(1.55,.42,q),THREE.MathUtils.lerp(.18,-.08,q),THREE.MathUtils.lerp(.32,-.18,q));
    if(m._shamanCoreGlow)m._shamanCoreGlow.emissiveIntensity=1.7*(1-q);
    if(!m.inGame122&&!m._shamanStudyReleased){
      const orb=new THREE.Mesh(new THREE.SphereGeometry(.10,16,12),new THREE.MeshStandardMaterial({color:0xffd782,emissive:0xe9a53a,emissiveIntensity:1.8}));
      orb.name='shaman-study-orb';orb.castShadow=true;
      m.root.updateMatrixWorld(true);const wp=new THREE.Vector3();m.staffEmitter.getWorldPosition(wp);m.root.worldToLocal(wp);orb.position.copy(wp);m.root.add(orb);
      m._shamanStudyOrb=orb;m._shamanStudyReleased=true;m._shamanStudyLastT=t;
    }
  }else{
    if(m._shamanCoreGlow)m._shamanCoreGlow.emissiveIntensity=0;
    const q=smooth(Math.min(1,(atk-.22)/.78));
    m.handR.rotation.set(THREE.MathUtils.lerp(.42,0,q),THREE.MathUtils.lerp(-.08,0,q),THREE.MathUtils.lerp(-.18,0,q));
  }
  const prev=m._shamanStudyLastT==null?t:m._shamanStudyLastT;
  const dt=Math.min(.05,Math.max(0,t-prev));m._shamanStudyLastT=t;
  if(m._shamanStudyOrb){m._shamanStudyOrb.position.z+=1.8*dt}
  if(atk<=0){m._shamanStudyReleased=false;m._shamanStudyLastT=t}
}

// Brute role study: a one-handed heavy mace for the canonical physical slam.
function equipBruteStudy(m){
  if(!m?.handR)return m;
  const [,dark,leather,,iron,edge,,wood]=m.mats||[];
  const removeWeapon=(parent)=>{
    for(const child of [...parent.children]){
      if(child.isGroup){removeWeapon(child);continue}
      if(!child.isMesh)continue;
      const weaponMat=child.material===wood||child.material===iron||child.material===edge;
      const sphere=child.geometry?.type==='SphereGeometry';
      const spike=child.geometry?.type==='ConeGeometry';
      if(weaponMat&&!sphere&&!spike){parent.remove(child)}
    }
  };
  removeWeapon(m.armR);removeWeapon(m.handR);
  const weapon=new THREE.Group();weapon.name='brute-mace';m.handR.add(weapon);
  const mesh=(g,mat,z)=>{const q=new THREE.Mesh(g,mat);q.position.z=z;q.castShadow=q.receiveShadow=true;weapon.add(q);return q};
  const handle=mesh(new THREE.CylinderGeometry(.055,.065,.84,12),leather,.28);handle.rotation.x=Math.PI/2;
  const pommel=mesh(new THREE.SphereGeometry(.09,12,8),iron,-.14);pommel.scale.set(1,1,.7);
  const head=mesh(new THREE.BoxGeometry(.48,.30,.24),iron,.68);head.name='mace-head';
  const cap=mesh(new THREE.BoxGeometry(.54,.08,.08),edge,.68);cap.rotation.z=.12;
  const tip=new THREE.Object3D();tip.name='brute-weapon-tip';tip.position.set(0,0,.80);weapon.add(tip);
  m.weapon=weapon;m.weaponTip=tip;m.bruteStudy=true;m.useBruteSlam=true;
  return m;
}

function animateBruteStudy(m,st,t){
  if(!m?.bruteStudy||!m.handR)return;
  const wind=THREE.MathUtils.clamp(st?.wind||0,0,1),atk=THREE.MathUtils.clamp(st?.atk||0,0,1);
  const active=wind>0||atk>0;
  const smooth=x=>x*x*(3-2*x);
  const clearFx=()=>{if(m._bruteStudyDust){m.root.remove(m._bruteStudyDust);m._bruteStudyDust.geometry.dispose();m._bruteStudyDust.material.dispose();m._bruteStudyDust=null}m._bruteStudyFx=false};
  if(st?.dead>0){m.handR.rotation.set(0,0,0);clearFx();return}
  if(!active){m.handR.rotation.set(.28,0,0);clearFx();return}
  const rest={ax:0,az:-.24,bx:.22,hx:.28},ready={ax:-2.4,az:.08,bx:-.10,hx:.15},hit={ax:-.82,az:-.05,bx:.30,hx:1.85},follow={ax:-.80,az:-.05,bx:.30,hx:1.95};
  let a,b,u;if(wind){clearFx();if(wind<.65){a=rest;b=ready;u=wind/.65}else{a=ready;b=hit;u=(wind-.65)/.35}}else if(atk<.16){a=hit;b=follow;u=atk/.16}else{a=follow;b=rest;u=(atk-.16)/.84}u=smooth(u);const p={};for(const k in a)p[k]=THREE.MathUtils.lerp(a[k],b[k],u);
  m.armR.rotation.set(p.ax,0,p.az);m.body.rotation.x=p.bx;m.body.position.y=Math.sin(t*2)*.012;m.handR.rotation.set(p.hx,0,0);
  if(atk>0){
    if(!m.inGame122&&!m._bruteStudyFx){
      const mat=new THREE.MeshBasicMaterial({color:0xc69a60,transparent:true,opacity:.52,depthWrite:false,side:THREE.DoubleSide});
      const dust=new THREE.Mesh(new THREE.RingGeometry(.22,1.0,24),mat);dust.name='brute-slam-dust';dust.rotation.x=-Math.PI/2;m.root.updateMatrixWorld(true);dust.position.copy(m.root.worldToLocal(m.weaponTip.getWorldPosition(new THREE.Vector3())));dust.position.y=.035;m.root.add(dust);m._bruteStudyDust=dust;m._bruteStudyFx=true;
    }
  }
  if(m._bruteStudyDust){const q=smooth(Math.min(1,atk/.35));m._bruteStudyDust.scale.setScalar(.2+q*1.1);m._bruteStudyDust.material.opacity=.52*(1-q)}
}

// Archer study adapter.  The bow is a held prop; the right hand draws its
// string and the released arrow is a single, temporary root child.
function equipArcherStudy(m){
  if(!m||!m.armL||!m.armR)return m;
  const [,dark,leather,,iron,edge,bone,wood]=m.mats||[];
  const handL=new THREE.Group();handL.name='left-hand-grip';handL.position.set(0,-.65,.075);m.armL.add(handL);m.handL=handL;
  if(!m.handR){const h=new THREE.Group();h.name='right-hand-grip';h.position.set(0,-.65,.075);m.armR.add(h);m.handR=h}
  // Remove the old arm-local bow so it cannot render as a second weapon.
  for(const c of [...m.armL.children])if(c!==handL&&((c.isGroup&&Math.abs(c.position.y+.65)<.03)||/bow|string|arrow/i.test(c.name||'')||c.userData?.archerProp)){m.armL.remove(c)}
  const bow=new THREE.Group();bow.name='held-bow';bow.position.z=-.19;bow.rotation.y=-Math.PI/2;handL.add(bow);
  const woodMat=wood||dark||new THREE.MeshStandardMaterial({color:0x70462c});
  const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,-.55,0),new THREE.Vector3(.38,0,0),new THREE.Vector3(0,.55,0));
  const limb=new THREE.Mesh(new THREE.TubeGeometry(curve,16,.035,8,false),woodMat);limb.name='bow-limb';limb.castShadow=true;bow.add(limb);
  const stringMat=leather||dark||woodMat;
  const string=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:stringMat.color||0x4b3022}));string.name='bow-string';string.geometry.setFromPoints([new THREE.Vector3(0,-.55,0),new THREE.Vector3(0,0,0),new THREE.Vector3(0,.55,0)]);bow.add(string);
  const nock=new THREE.Object3D();nock.name='bow-nock';nock.position.set(0,0,0);bow.add(nock);
  const arrow=new THREE.Group();arrow.name='held-arrow';arrow.position.set(0,0,.02);bow.add(arrow);
  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.72,8),woodMat);shaft.rotation.z=Math.PI/2;shaft.position.x=.36;shaft.castShadow=true;arrow.add(shaft);
  const head=new THREE.Mesh(new THREE.ConeGeometry(.055,.13,8),iron||edge||woodMat);head.rotation.z=-Math.PI/2;head.position.x=.75;head.castShadow=true;arrow.add(head);
  bow.userData={nock,string,arrow,baseDraw:0};m.bow=bow;m.bowNock=nock;m.bowString=string;m.heldArrow=arrow;m.archerStudy=true;m._archerStudyLastT=null;m._archerStudyFired=false;m._archerPrevWind=0;m._archerPrevAtk=0;
  return m;
}

function animateArcherStudy(m,st,t){
  if(!m?.archerStudy||!m.handL||!m.handR||!m.bow)return;
  const wind=THREE.MathUtils.clamp(st?.wind||0,0,1),atk=THREE.MathUtils.clamp(st?.atk||0,0,1),active=wind>0||atk>0;
  const smooth=x=>{x=THREE.MathUtils.clamp(x,0,1);return x*x*(3-2*x)};
  const clearArrow=()=>{if(m._archerArrow){m.root.remove(m._archerArrow);m._archerArrow.traverse(o=>{if(o.geometry)o.geometry.dispose()});m._archerArrow=null}m._archerStudyFired=false};
  if(wind>0&&m._archerPrevWind<=0){clearArrow();if(m.heldArrow)m.heldArrow.visible=true}
  if(st?.dead>0||!active){m.handR.position.set(0,-.65,.075);m.handR.rotation.set(0,0,0);m.handL.position.set(0,-.65,.075);m.handL.quaternion.copy(m.body.quaternion).multiply(m.armL.quaternion).invert();m.bowNock.position.x=0;m.heldArrow.position.set(0,0,.02);m.bowString.geometry.setFromPoints([new THREE.Vector3(0,-.55,0),new THREE.Vector3(0,0,0),new THREE.Vector3(0,.55,0)]);if(m.heldArrow)m.heldArrow.visible=true;clearArrow();m._archerStudyLastT=t;m._archerPrevWind=wind;m._archerPrevAtk=atk;return}
  const q=wind>0?smooth(wind):1-smooth(Math.min(1,atk/.75));
  // Face the shot and keep both hands inside the shoulder's reachable arc.
  m.body.rotation.x=THREE.MathUtils.lerp(.20,.12,q);m.body.rotation.y=-.16*(1-q);m.head.rotation.y=.16*(1-q);
  m.armL.rotation.set(THREE.MathUtils.lerp(-.65,-1.5,q),0,THREE.MathUtils.lerp(-.12,-.16,q));
  m.armR.rotation.set(THREE.MathUtils.lerp(-.45,-1.25,q),-.65*q,-.85*q);
  // Telegraph: right hand reaches the actual nock in world space.  The arm
  // remains short because the target is converted into the arm's parent.
  m.handL.position.set(.18*q,-.65,.075);m.handL.quaternion.copy(m.body.quaternion).multiply(m.armL.quaternion).invert();
  const draw=wind>0?.20*q:.20*(1-smooth(Math.min(1,atk/.08)));m.bowNock.position.x=-draw;
  m.root.updateMatrixWorld(true);const nw=new THREE.Vector3();m.bowNock.getWorldPosition(nw);const local=m.armR.worldToLocal(nw.clone());
  const base=new THREE.Vector3(0,-.65,.075);if(local.length()>.82)local.setLength(.82);m.handR.position.lerpVectors(base,local,q);m.handR.rotation.set(-.25*q,-.12*q,.18*q);
  m.bowString.geometry.setFromPoints([new THREE.Vector3(0,-.55,0),new THREE.Vector3(-draw,0,0),new THREE.Vector3(0,.55,0)]);
  if(m.inGame122&&atk>0)m._archerStudyFired=true;
  if(m.heldArrow){m.heldArrow.visible=!m._archerStudyFired;m.heldArrow.position.x=-draw}
  if(!m.inGame122&&m._archerPrevWind>0&&atk>0&&!m._archerStudyFired){
    m.root.updateMatrixWorld(true);const p=new THREE.Vector3();m.bowNock.getWorldPosition(p);const shot=m.heldArrow;shot.visible=false;
    const fired=new THREE.Group();fired.name='archer-study-arrow';fired.position.copy(p);m.root.worldToLocal(fired.position);fired.rotation.set(0,0,0);
    fired.rotation.y=-Math.PI/2;
    const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.72,8),woodMatFor(m));shaft.rotation.z=Math.PI/2;shaft.position.x=.36;fired.add(shaft);
    const tip=new THREE.Mesh(new THREE.ConeGeometry(.055,.13,8),ironMatFor(m));tip.rotation.z=-Math.PI/2;tip.position.x=.75;fired.add(tip);m.root.add(fired);m._archerArrow=fired;m._archerStudyFired=true;m._archerStudyLastT=t;
  }
  const prev=m._archerStudyLastT==null?t:m._archerStudyLastT,dt=Math.min(.05,Math.max(0,t-prev));m._archerStudyLastT=t;
  if(m._archerArrow)m._archerArrow.position.z+=2.2*dt;
  m._archerPrevWind=wind;m._archerPrevAtk=atk;
}
function woodMatFor(m){return (m.mats||[])[7]||(m.mats||[])[1]}
function ironMatFor(m){return (m.mats||[])[4]||(m.mats||[])[5]||(m.mats||[])[7]}

const legacyMakeGoblin122=makeGoblin118,legacyAnimateGoblin122=animGoblin118;
const goblinGeometryCache122={};
function goblinArray122(encoded,Type){const raw=atob(typeof encoded==='number'?GOBLIN_BUFFERS122[encoded]:encoded),a=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)a[i]=raw.charCodeAt(i);return new Type(a.buffer)}
function goblinGeometry122(d,key){
 if(goblinGeometryCache122[key])return goblinGeometryCache122[key];
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(goblinArray122(d.p,Float32Array),3));g.setAttribute('normal',new THREE.BufferAttribute(goblinArray122(d.n,Int16Array),3,true));
 if(d.i!=null)g.setIndex(new THREE.BufferAttribute(goblinArray122(d.i,d.i16?Uint16Array:Uint32Array),1));
 if(d.w!=null){g.setAttribute('skinWeight',new THREE.BufferAttribute(goblinArray122(d.w,d.w16?Uint16Array:Float32Array),4,!!d.w16));g.setAttribute('skinIndex',new THREE.BufferAttribute(goblinArray122(d.b,Uint8Array),4));}
 g.userData.shared=true;return goblinGeometryCache122[key]=g;
}
function organicGoblin122(m){
 const role=m.goblin118,data=GOBLIN_DATA122[role],skin=m.mats[0],remove=[];
 m.body.traverse(p=>{if(p.isMesh&&p.material===skin)remove.push(p)});for(const p of remove)p.parent.remove(p);
 const [,dark,,cloth,,,bone,,black,eye]=m.mats;
 for(const p of [...m.head.children])if(p.isMesh&&(p.material===dark||p.material===black||p.material===eye||(p.material===cloth&&Math.abs(p.position.x)>.35)||(p.material===bone&&p.geometry.type==='ConeGeometry')))m.head.remove(p);
 for(const [i,f] of data.face.entries()){
  const mat=new THREE.MeshStandardMaterial({color:f.color,roughness:f.roughness,polygonOffset:f.polygonOffset,polygonOffsetFactor:-1,polygonOffsetUnits:-1});m.mats.push(mat);
  const mesh=new THREE.Mesh(goblinGeometry122(f.geometry,role+':face:'+i),mat);mesh.name=f.name;mesh.position.fromArray(f.position);mesh.rotation.set(...f.rotation);mesh.receiveShadow=true;mesh.castShadow=f.name.startsWith('embedded-fang');m.head.add(mesh);
 }
 skin.skinning=true;const mesh=new THREE.SkinnedMesh(goblinGeometry122(data,role+':skin'),skin);mesh.castShadow=mesh.receiveShadow=true;mesh.frustumCulled=false;m.body.add(mesh);
 const bones=[m.body,m.head,m.armL,m.armR,m.legL,m.legR,m.handR,m.handL||m.armL];m.root.updateMatrixWorld(true);mesh.bind(new THREE.Skeleton(bones));m.skinMesh=mesh;m.organic=true;return m;
}
makeGoblin118=function(o={}){
 const m=legacyMakeGoblin122(o);if(o.organic===false)return m;m.inGame122=o.inGame122!==false;
 prepareGoblinRoleStudy(m);const equip={shield:equipShieldStudy,shaman:equipShamanStudy,brute:equipBruteStudy,archer:equipArcherStudy}[m.goblin118];if(equip)equip(m);return organicGoblin122(m);
};
animGoblin118=function(m,st,t){
 legacyAnimateGoblin122(m,st,t);if(!m.organic)return;
 const f={warrior:animateWarriorGrip,shield:animateShieldStudy,shaman:animateShamanStudy,brute:animateBruteStudy,archer:animateArcherStudy}[m.goblin118];if(f)f(m,st,t);
};
function goblinMuzzle122(e){
 const m=e.m;if(!m?.organic||!['archer','shaman'].includes(m.goblin118))return null;
 m.root.position.set(e.x,0,e.z);m.root.rotation.y=e.face;animGoblin118(m,{move:0,wind:1,atk:0,dead:0},e.t||0);m.root.updateMatrixWorld(true);
 return (m.staffEmitter||m.bowNock).getWorldPosition(new THREE.Vector3());
}
