// Approved procedural body, face and rig source. Used offline only.
const cache={},geo=(k,f)=>cache[k]||(cache[k]=f()),toon=c=>new THREE.MeshStandardMaterial({color:c,roughness:.92,flatShading:true}),toonS=toon;
// Original procedural meshes: no downloaded character, texture or animation assets.
function makeGoblin118(o={}){
 const role=o.goblin118||'warrior',brute=role==='brute',shaman=role==='shaman',archer=role==='archer',guard=role==='shield';
 const root=new THREE.Group(),body=new THREE.Group();root.add(body);const sc=o.scale||1;body.scale.setScalar(sc);const mats=[];
 const mat=c=>{const m=new THREE.MeshStandardMaterial({color:c,roughness:.88,metalness:c===0x777c75?.22:0,flatShading:false});mats.push(m);return m},skin=mat(brute?0x69754b:shaman?0x718b62:0x738957),dark=mat(0x28332c),leather=mat(0x493a2d),cloth=mat(shaman?0x4e575e:archer?0x536046:0x6e493b),iron=mat(0x777c75),edge=mat(0xb0ada0),bone=mat(0xd5c6a1),wood=mat(0x58462f),black=mat(0x1c2421),eye=mat(0xe5b752);
 const part=(parent,g,m,x,y,z,sx=1,sy=1,sz=1)=>{if(g.parameters){const key='gob118:'+g.type+JSON.stringify(g.parameters),shared=geo(key,()=>g);if(shared!==g)g.dispose();g=shared}const p=new THREE.Mesh(g,m);p.position.set(x,y,z);p.scale.set(sx,sy,sz);p.castShadow=true;p.receiveShadow=true;parent.add(p);return p};
 const ell=(p,m,x,y,z,sx,sy,sz)=>part(p,geo('gob118sphere',()=>new THREE.SphereGeometry(1,20,14)),m,x,y,z,sx,sy,sz);
 const box=(p,m,x,y,z,sx,sy,sz)=>part(p,geo('gob118box',()=>goblinRoundedBox118()),m,x,y,z,sx,sy,sz);
 const bar=(p,m,a,b,r)=>{const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),v=bv.clone().sub(av),q=part(p,new THREE.CylinderGeometry(r*.8,r,v.length(),12),m,...av.clone().add(bv).multiplyScalar(.5).toArray());q.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return q};
 const w=brute?.49:.32,hip=brute?.8:.66,shoulder=brute?1.52:1.23;
 const torso=ell(body,skin,0,brute?1.08:.96,-.025,w*1.05,brute?.52:.39,brute?.34:.255);torso.rotation.x=.10;ell(body,skin,0,brute?1.35:1.16,-.065,w*.98,.20,.26);
 ell(body,cloth,0,.66,0,w*1.05,.21,.27);box(body,leather,0,.77,.025,w*2.1,.13,.53);box(body,iron,0,.77,.3,.16,.13,.06);
 const strap=box(body,leather,0,1.06,.27,.13,.56,.065);strap.rotation.z=-.52;
 const head=new THREE.Group();head.position.set(0,brute?1.73:1.49,.11);head.rotation.x=.06;body.add(head);
 ell(head,skin,0,0,0,.32,.3,.26);ell(head,skin,0,-.15,.18,.28,.15,.22);ell(head,dark,0,-.16,.345,.21,.018,.025);
 const nose=ell(head,skin,0,-.012,.33,.095,.12,.175);nose.rotation.x=-.3;ell(head,skin,0,-.07,.39,.10,.065,.075);
 for(const side of [-1,1]){const ear=ell(head,skin,side*.445,.075,-.025,.305,.115,.065);ear.rotation.z=side*.36;const inner=ell(head,cloth,side*.45,.072,.025,.225,.064,.019);inner.rotation.z=side*.36;ell(head,black,side*.145,.03,.231,.102,.064,.035);ell(head,eye,side*.15,.025,.26,.045,.034,.012);box(head,black,side*.15,.022,.276,.014,.043,.006);const brow=ell(head,skin,side*.15,.10,.245,.128,.045,.052);brow.rotation.z=side*.2;const tooth=part(head,new THREE.ConeGeometry(.034,.14,12),bone,side*.16,-.12,.345);tooth.rotation.z=-side*.13;}
 const arm=(side)=>{const a=new THREE.Group();a.position.set(side*(w+.085),shoulder,.015);body.add(a);ell(a,skin,0,-.19,0,brute?.17:.105,.27,.12);ell(a,skin,0,-.46,.035,brute?.15:.10,.23,.10);ell(a,skin,0,-.65,.075,.12,.11,.115);box(a,leather,0,-.49,.005,.24,.18,.22);return a};
 const armL=arm(-1),armR=arm(1);
 const leg=(side)=>{const p=new THREE.Group();p.position.set(side*w*.55,.64,0);body.add(p);ell(p,skin,0,-.18,-.015,.13,.25,.14);ell(p,leather,0,-.43,.025,.12,.19,.12);ell(p,leather,0,-.55,.11,.14,.09,.23);return p};const legL=leg(-1),legR=leg(1);
 if(guard||brute){for(const side of [-1,1]){const a=side<0?armL:armR;ell(a,iron,0,-.01,0,brute?.3:.23,.13,.24);for(let i=0;i<3;i++)part(a,new THREE.ConeGeometry(.045,.19,12),bone,(i-1)*.12,.14,0)}box(body,iron,0,1.07,.3,w*1.5,.31,.07);}
 if(guard){const shield=new THREE.Group();shield.position.set(-.1,-.43,.28);armL.add(shield);for(let i=-1;i<=1;i++)box(shield,wood,i*.19,0,0,.18,.88-Math.abs(i)*.1,.11);box(shield,iron,0,.29,.075,.65,.085,.045);box(shield,iron,0,-.27,.075,.65,.085,.045);ell(shield,iron,0,0,.13,.15,.15,.08);const helm=part(head,new THREE.SphereGeometry(.35,20,12,0,Math.PI*2,0,Math.PI*.48),iron,0,.02,0);box(head,iron,0,.11,.30,.055,.24,.055);}
 if(shaman){const hood=part(head,new THREE.ConeGeometry(.37,.72,20),cloth,0,.35,-.075);hood.rotation.z=-.13;for(const side of [-1,1])bar(head,bone,[side*.22,.44,-.02],[side*.42,.72,-.07],.045);for(let i=0;i<5;i++)ell(body,bone,(i-2)*.105,1.18-Math.abs(i-2)*.025,.29,.045,.045,.04);bar(armR,wood,[0,-1.04,.1],[0,.75,.1],.047);const ring=part(armR,new THREE.TorusGeometry(.20,.038,10,24),bone,0,.83,.1);ell(armR,eye,0,.83,.1,.085,.12,.075);for(const side of [-1,1])bar(armR,leather,[side*.15,.78,.1],[side*.2,.45,.1],.025);}
 else if(archer){const bow=new THREE.Group();bow.position.set(0,-.46,.12);armL.add(bow);const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,-.55,0),new THREE.Vector3(.38,0,0),new THREE.Vector3(0,.55,0));part(bow,new THREE.TubeGeometry(curve,20,.035,10,false),wood,0,0,0);bar(bow,bone,[0,-.55,0],[0,.55,0],.008);box(body,leather,.20,1.04,-.30,.22,.65,.19);for(let i=0;i<3;i++){bar(body,wood,[.13+i*.07,.91,-.3],[.13+i*.07,1.56,-.3],.015);box(body,bone,.13+i*.07,1.51,-.3,.05,.1,.03)}const cap=part(head,new THREE.SphereGeometry(.35,20,12,0,Math.PI*2,0,Math.PI*.5),cloth,0,.045,-.025);cap.rotation.z=.1;}
 else{bar(armR,wood,[0,-.94,.1],[0,.01,.1],brute?.065:.04);const blade=box(armR,iron,brute?.15:.085,-.03,.10,brute?.56:.29,brute?.35:.48,.095);blade.rotation.z=-.12;box(armR,edge,brute?.4:.23,-.035,.10,.045,brute?.36:.47,.10);if(!guard)ell(armL,iron,0,0,0,.19,.12,.20);}
 const sh=part(root,new THREE.CircleGeometry(brute?.68:.47,16),new THREE.MeshBasicMaterial({color:0x10170e,transparent:true,opacity:.32,depthWrite:false}),0,.025,0);sh.rotation.x=-Math.PI/2;sh.scale.setScalar(sc);
 return {root,body,armL,armR,legL,legR,mats,sc,eyeMat:eye,goblin118:role,head};
}
function animGoblin118(m,st,t){
 const role=m.goblin118,mv=Math.max(0,Math.min(1,st.move||0)),wind=Math.max(0,Math.min(1,st.wind||0)),atk=Math.max(0,Math.min(1,st.atk||0));
 // Every frame starts at rest, so attacks cannot leave twisted limbs behind.
 for(const p of [m.body,m.head,m.armL,m.armR,m.legL,m.legR])p.rotation.set(0,0,0);
 m.body.position.set(0,Math.sin(t*2)*.012,0);m.head.rotation.x=.06;
 const rates={warrior:12,shield:8,archer:14,shaman:6,brute:6.5},phase=t*rates[role],step=Math.sin(phase)*mv,plant=Math.abs(Math.sin(phase));
 if(role==='warrior'){
  m.body.rotation.x=.16;m.body.rotation.y=step*.09;m.body.position.y+=plant*.045*mv;
  m.legL.rotation.x=step*.62;m.legR.rotation.x=-step*.62;m.armL.rotation.x=-step*.48;m.armR.rotation.x=step*.38;
  m.armR.rotation.z=-.18;
 }else if(role==='shield'){
  m.body.rotation.x=.08;m.body.rotation.z=step*.045;m.body.position.y+=plant*.018*mv;
  m.legL.rotation.x=step*.28;m.legR.rotation.x=-step*.28;
  m.armL.rotation.x=-.5;m.armL.rotation.y=-.15;m.armR.rotation.x=-.2+step*.12;
 }else if(role==='archer'){
  m.body.rotation.x=.2;m.body.rotation.y=-.16;m.body.position.y-=.035;m.body.position.y+=plant*.025*mv;
  m.legL.rotation.x=step*.38;m.legR.rotation.x=-step*.38;
  m.armL.rotation.x=-.65;m.armL.rotation.z=-.12;m.armR.rotation.x=-.45-step*.12;m.head.rotation.y=.16;
 }else if(role==='shaman'){
  m.body.rotation.x=.12;m.body.rotation.z=step*.06;m.body.position.y+=plant*.012*mv;
  m.legL.rotation.x=step*.22;m.legR.rotation.x=-step*.22;
  m.armR.rotation.x=-.08;m.armR.rotation.z=-.10;m.armL.rotation.x=-step*.2;m.head.rotation.y=Math.sin(t*1.3)*.1;
 }else{
  m.body.rotation.x=.22;m.body.rotation.z=step*.1;m.body.position.x=step*.035;m.body.position.y+=plant*.065*mv;
  m.legL.rotation.x=step*.42;m.legR.rotation.x=-step*.42;m.legL.rotation.z=.09;m.legR.rotation.z=-.09;
  m.armL.rotation.x=-step*.25;m.armR.rotation.x=step*.2;m.armL.rotation.z=.2;m.armR.rotation.z=-.24;
 }
 // Wind is the AI telegraph; atk is its existing 0..1 recovery after impact.
 const active=wind>0||atk>0,release=atk>0?1-Math.pow(1-atk,3):0;
 if(active){
  const ready=atk>0?1:wind,hold=atk>0?1-release:ready;
  if(role==='warrior'){
   m.body.rotation.y=-.65*hold+(atk>0?.45*Math.sin(atk*Math.PI):0);
   m.armR.rotation.x=-1.75*hold+(atk>0?.6*Math.sin(atk*Math.PI):0);m.armR.rotation.z=-.7*hold;
   m.armL.rotation.x=-.45*hold;
  }else if(role==='shield'){
   m.armL.rotation.x=-.65;m.armL.rotation.y=-.2;
   m.armR.rotation.x=-1.6*hold;m.armR.rotation.z=-.08;m.body.rotation.y=-.18*hold;
   m.body.position.z=atk>0?.12*(1-release):-.04*wind;
  }else if(role==='archer'){
   m.body.rotation.y=-.4*ready;m.head.rotation.y=.4*ready;
   m.armL.rotation.x=-1.5*ready;m.armL.rotation.z=-.16;
   m.armR.rotation.x=-1.25*hold;m.armR.rotation.z=-.85*ready;m.armR.rotation.y=-.65*hold;
   m.body.rotation.x=.12+(atk>0?-.09*(1-release):0);
  }else if(role==='shaman'){
   m.armR.rotation.x=-.45*hold;m.armR.rotation.z=-.35*hold;
   m.armL.rotation.x=-1.7*hold;m.armL.rotation.z=.4*hold;m.head.rotation.x=-.12*hold;
   m.body.rotation.y=Math.sin(t*5)*.12*hold;m.body.position.y+=.025*hold;
  }else{
   m.armR.rotation.x=-2.65*hold+(atk>0?.45*Math.sin(atk*Math.PI):0);m.armR.rotation.z=-.15;
   m.armL.rotation.x=-1.8*hold;m.body.rotation.x=-.18*hold+(atk>0?.5*Math.sin(atk*Math.PI):0);
   m.body.position.y-=atk>0?.1*Math.sin(atk*Math.PI):.035*wind;m.head.rotation.x=.16*hold;
  }
 }
 if(st.dead>0){m.body.rotation.set(-Math.PI/2*Math.min(1,st.dead),0,0);m.body.position.set(0,.2*Math.min(1,st.dead),0)}
}
function goblinDungeon118(g){return !!g?.goblin118}
function enterGoblin118(){if(L.mode!=='world'||player.dead||!inCity(player.x,player.z))return false;const g={id:++gateSeq,x:player.x,z:player.z,rank:Math.min(9,profile.rank||0),seed:118731,aff:[],rooms:7,expType:'standard',goblin118:true,custom:true,red:false,double:false,life:900,max:900};closeModal();buildDungeon(g);return true}
function goblinPreviewRow118(){return row('Acampamento dos goblins · amostra visual','Cinco modelos próprios: guerreiro, escudeiro, arqueiro, xamã e bruto. Teste o novo estilo em uma dungeon temática no seu rank.',btn('Testar goblins','goblin118',0,L.mode==='world'&&inCity(player.x,player.z)))}
function goblinCampProps118(rooms){for(const r of rooms){if(r.i===0)continue;for(const side of [-1,1]){const x=r.wx+side*(r.w-2),z=r.wz-2;if(!freeAt(x,z,.45))continue;const pole=new THREE.Mesh(new THREE.CylinderGeometry(.075,.11,3.5,6),toonS(0x58462f));pole.position.set(x,1.75,z);L.group.add(pole);const flag=new THREE.Mesh(new THREE.BoxGeometry(.72,.95,.035),toonS(0x824934));flag.position.set(x+side*.30,2.72,z);L.group.add(flag);for(let k=0;k<3;k++){const mark=new THREE.Mesh(new THREE.BoxGeometry(.055,.42,.055),toonS(0xd5c6a1));mark.position.set(x+side*.30+(k-1)*.16,2.72,z+.035);mark.rotation.z=-.2;L.group.add(mark)}}}}

function goblinRoundedBox118(){const q=new THREE.Shape(),r=.09,a=.41;q.moveTo(-a+r,-a);q.lineTo(a-r,-a);q.quadraticCurveTo(a,-a,a,-a+r);q.lineTo(a,a-r);q.quadraticCurveTo(a,a,a-r,a);q.lineTo(-a+r,a);q.quadraticCurveTo(-a,a,-a,a-r);q.lineTo(-a,-a+r);q.quadraticCurveTo(-a,-a,-a+r,-a);const g=new THREE.ExtrudeGeometry(q,{depth:.82,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.09,bevelThickness:.09,curveSegments:4});g.translate(0,0,-.41);return g}
function goblinShot118(e){const arrow=e.kind==='gobArcher118';shoot(e.x,e.z,e.face,arrow?18:12,e.dmg,'enemy',arrow?0xc6ac78:0xb06bff,arrow?'arrow':'orb')}

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
    if(!m._shamanStudyReleased){
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
    if(!m._bruteStudyFx){
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
  if(m.heldArrow){m.heldArrow.visible=!m._archerStudyFired;m.heldArrow.position.x=-draw}
  if(m._archerPrevWind>0&&atk>0&&!m._archerStudyFired){
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

// Facial color layers conform to the final skin triangles in the bind pose.
// Old separate eyeballs and ear inserts do not fit the new continuous surface.
function fitOrganicFace(m,skinMesh,sample){
 const [,dark,,cloth,,,bone,,black,eye]=m.mats;
 for(const p of [...m.head.children])if(p.isMesh&&(p.material===dark||p.material===black||p.material===eye||(p.material===cloth&&Math.abs(p.position.x)>.35)||(p.material===bone&&p.geometry.type==='ConeGeometry')))m.head.remove(p);
 const headLift=m.head.position.y-1.49;
 m.head.updateMatrix();const inverseHead=m.head.matrix.clone().invert();
 const cast=new THREE.Raycaster(),surface=new THREE.Mesh(skinMesh.geometry,m.mats[0]);
 surface.updateMatrixWorld(true);const down=new THREE.Vector3(0,0,-1);
 const local=p=>p.clone().applyMatrix4(inverseHead);
 const normalAt=p=>{const h=.001;return new THREE.Vector3(sample(p.x+h,p.y,p.z).d-sample(p.x-h,p.y,p.z).d,sample(p.x,p.y+h,p.z).d-sample(p.x,p.y-h,p.z).d,sample(p.x,p.y,p.z+h).d-sample(p.x,p.y,p.z-h).d).normalize()};
 const project=(x,y)=>{cast.set(new THREE.Vector3(x,y+headLift,.72),down);const hit=cast.intersectObject(surface,false)[0];if(!hit)throw Error('Facial patch outside the head silhouette at '+x+','+y);return hit.point};
 m.faceFit={patches:[],maxOffset:0};
 function patch(name,cx,cy,rx,ry,angle,color,offset){
  const material=new THREE.MeshStandardMaterial({color,roughness:.87,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});m.mats.push(material);
  const positions=[],normals=[],indices=[],segments=32,rings=5,ca=Math.cos(angle),sa=Math.sin(angle);
  function point(dx,dy){const p=project(cx+dx*ca-dy*sa,cy+dx*sa+dy*ca),n=normalAt(p);p.addScaledVector(n,offset);const q=local(p),nn=n.clone().transformDirection(inverseHead);positions.push(q.x,q.y,q.z);normals.push(nn.x,nn.y,nn.z)}
  point(0,0);for(let r=1;r<=rings;r++)for(let i=0;i<segments;i++){const a=i/segments*Math.PI*2;point(Math.cos(a)*rx*r/rings,Math.sin(a)*ry*r/rings)}
  for(let i=0;i<segments;i++)indices.push(0,1+i,1+(i+1)%segments);
  for(let r=1;r<rings;r++)for(let i=0;i<segments;i++){const a=1+(r-1)*segments+i,b=1+(r-1)*segments+(i+1)%segments,c=1+r*segments+i,d=1+r*segments+(i+1)%segments;indices.push(a,c,b,b,c,d)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));g.setIndex(indices);
  const p=new THREE.Mesh(g,material);p.name=name;p.receiveShadow=true;m.head.add(p);m.faceFit.patches.push(p);m.faceFit.maxOffset=Math.max(m.faceFit.maxOffset,offset);return p;
 }
 for(const s of [-1,1]){
  patch('ear-lining-'+s,s*.438,1.603,.105,.026,s*.37,0x865d50,.0015);
  patch('eye-socket-'+s,s*.160,1.535,.047,.031,s*.12,0x1c2421,.0016);
  patch('iris-'+s,s*.160,1.536,.023,.024,0,0xd7b768,.0028);
  patch('pupil-'+s,s*.160,1.536,.007,.019,0,0x121b18,.0038);
  const base=project(s*.157,1.318),tooth=new THREE.Mesh(new THREE.ConeGeometry(.025,.105,12),bone);
  tooth.name='embedded-fang-'+s;tooth.position.copy(local(base.clone().add(new THREE.Vector3(0,.041,-.007))));tooth.rotation.z=-s*.13;tooth.castShadow=true;m.head.add(tooth);
 }
 patch('mouth',0,1.336,.159,.010,0,0x28332c,.0015);
}


// Continuous implicit skin, deformed by the approved v120 animation controls.
const approvedMake=makeGoblin118,approvedAnimate=animGoblin118;
function organicWarrior(m){
 const skin=m.mats[0]; const remove=[];m.body.traverse(p=>{if(p.isMesh&&p.material===skin)remove.push(p)});remove.forEach(p=>p.parent.remove(p));
 const bones=[m.body,m.head,m.armL,m.armR,m.legL,m.legR,m.handR,m.handL||m.armL];
 const shapes=[];const brute=m.goblin118==='brute';
 const e=(x,y,z,a,b,c,bone=0)=>{if(brute){if(bone===0){x*=1.48;y=.66+(y-.66)*1.4;a*=1.48;b*=1.35;c*=1.3}else if(bone===1)y+=.24;else if(bone===2||bone===3||bone===6){x*=.575/.405;y+=.29;a*=1.3;c*=1.2}else{x*=.49/.32;a*=1.06;c*=1.06}}shapes.push({x,y,z,a,b,c,bone})};
 e(0,.91,-.035,.285,.30,.205);e(0,1.115,-.05,.33,.22,.235);e(0,.71,0,.27,.17,.205);
 e(0,1.31,.01,.145,.19,.14,1);e(0,1.52,.085,.275,.285,.225,1);
 e(0,1.345,.225,.235,.13,.17,1);e(0,1.49,.355,.075,.125,.12,1);
 for(const s of [-1,1]){
  e(s*.18,1.42,.22,.095,.095,.09,1);e(s*.145,1.59,.235,.125,.042,.052,1);
  e(s*.32,1.55,.035,.16,.085,.055,1);e(s*.455,1.61,.015,.145,.055,.04,1);e(s*.55,1.65,.005,.08,.025,.02,1);
  const arm=s<0?2:3,leg=s<0?4:5;
  e(s*.365,1.205,.005,.14,.155,.145,arm);e(s*.405,1.035,.005,.105,.20,.105,arm);
  e(s*.405,.865,.025,.082,.095,.09,arm);e(s*.405,.755,.035,.095,.16,.095,arm);e(s*.405,.635,.06,.063,.10,.068,arm);
  if(s<0){const handBone=m.goblin118==='archer'?7:arm;e(s*.405,.57,.075,.093,.09,.085,handBone);
   for(let f=0;f<4;f++)e(s*(.348+f*.035),.506,.101,.021,.064,.033,handBone);
   e(s*.325,.575,.125,.033,.066,.037,handBone);
  }else if(m.goblin118==='shaman'){
   e(.373,.58,.073,.043,.077,.046,6);
   for(let f=0;f<4;f++){const y=.532+f*.031;e(.443,y,.107,.024,.018,.045,6);e(.412,y,.143,.043,.018,.023,6)}
   e(.384,.633,.13,.031,.024,.043,6);
  }else{e(.373,.58,.09,.055,.068,.085,6);
   for(let f=0;f<4;f++){const z=.025+f*.041;e(.426,.545,z,.037,.028,.022,6);e(.442,.575,z,.023,.04,.022,6)}
   e(.398,.634,.12,.055,.025,.034,6);
  }
  e(s*.176,.49,-.015,.125,.22,.132,leg);e(s*.176,.325,.015,.09,.085,.10,leg);
  e(s*.176,.235,.02,.092,.15,.098,leg);
 }
 const sample=(x,y,z)=>{let sum=0,weights=new Float64Array(8);for(const q of shapes){const d=(Math.hypot((x-q.x)/q.a,(y-q.y)/q.b,(z-q.z)/q.c)-1)*Math.min(q.a,q.b,q.c);const k=Math.exp(-d/.014);sum+=k;weights[q.bone]+=k}return {d:-Math.log(sum)*.014,w:Array.from(weights,v=>v/sum)}};
 const step=.024,origin=['x','y','z'].map((axis,i)=>Math.floor((Math.min(...shapes.map(q=>q[axis]-q[['a','b','c'][i]]))-.05)/step)*step),counts=['x','y','z'].map((axis,i)=>Math.ceil((Math.max(...shapes.map(q=>q[axis]+q[['a','b','c'][i]]))+.05-origin[i])/step)+1),[nx,ny,nz]=counts,grid=[];
 for(let z=0;z<nz;z++)for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const p=[origin[0]+x*step,origin[1]+y*step,origin[2]+z*step];grid.push({p,...sample(...p)})}
 const verts=[],weights=[],idx=(x,y,z)=>(z*ny+y)*nx+x;
 const offsets=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]],tets=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
 function cross(a,b){const t=a.d/(a.d-b.d);return {p:a.p.map((v,i)=>v+(b.p[i]-v)*t),w:a.w.map((v,i)=>v+(b.w[i]-v)*t)}}
 function triangle(a,b,c){const av=new THREE.Vector3(...a.p),bv=new THREE.Vector3(...b.p),cv=new THREE.Vector3(...c.p);const n=bv.clone().sub(av).cross(cv.clone().sub(av));const mid=av.clone().add(bv).add(cv).multiplyScalar(1/3);const h=.001,grad=new THREE.Vector3(sample(mid.x+h,mid.y,mid.z).d-sample(mid.x-h,mid.y,mid.z).d,sample(mid.x,mid.y+h,mid.z).d-sample(mid.x,mid.y-h,mid.z).d,sample(mid.x,mid.y,mid.z+h).d-sample(mid.x,mid.y,mid.z-h).d);if(n.dot(grad)<0)[b,c]=[c,b];for(const v of [a,b,c]){verts.push(...v.p);weights.push(v.w)}}
 for(let z=0;z<nz-1;z++)for(let y=0;y<ny-1;y++)for(let x=0;x<nx-1;x++){const cube=offsets.map(o=>grid[idx(x+o[0],y+o[1],z+o[2])]);if(cube.every(p=>p.d>0)||cube.every(p=>p.d<=0))continue;for(const tet of tets){const inside=tet.map(i=>cube[i]).filter(p=>p.d<=0),outside=tet.map(i=>cube[i]).filter(p=>p.d>0);if(inside.length===1||inside.length===3){const a=inside.length===1?inside[0]:outside[0],others=inside.length===1?outside:inside;triangle(...others.map(b=>cross(a,b)))}else if(inside.length===2){const a=cross(inside[0],outside[0]),b=cross(inside[0],outside[1]),c=cross(inside[1],outside[0]),d=cross(inside[1],outside[1]);triangle(a,b,c);triangle(b,d,c)}}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
 // Analytical smooth normals avoid visible marching-tetrahedron facets.
 const normals=[];for(let i=0;i<verts.length;i+=3){const [x,y,z]=verts.slice(i,i+3),h=.001,n=new THREE.Vector3(sample(x+h,y,z).d-sample(x-h,y,z).d,sample(x,y+h,z).d-sample(x,y-h,z).d,sample(x,y,z+h).d-sample(x,y,z-h).d).normalize();normals.push(n.x,n.y,n.z)}g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));
 const mesh=new THREE.Mesh(g,skin);mesh.castShadow=mesh.receiveShadow=true;m.body.add(mesh);m.skinMesh=mesh;fitOrganicFace(m,mesh,sample);
 const bodyMatrix=b=>{m.root.updateMatrixWorld(true);return m.body.matrixWorld.clone().invert().multiply(b.matrixWorld)};
 const inverse=bones.map(b=>bodyMatrix(b).invert());
 const base=new Float32Array(verts),normalBase=new Float32Array(normals),v=new THREE.Vector3(),n=new THREE.Vector3(),out=new THREE.Vector3(),nout=new THREE.Vector3();
 m.deform=()=>{const matrices=bones.map((b,i)=>bodyMatrix(b).multiply(inverse[i])),nm=matrices.map(a=>new THREE.Matrix3().getNormalMatrix(a));for(let i=0;i<weights.length;i++){out.set(0,0,0);nout.set(0,0,0);for(let j=0;j<bones.length;j++){const w=weights[i][j];if(w<.0001)continue;v.fromArray(base,i*3).applyMatrix4(matrices[j]);n.fromArray(normalBase,i*3).applyMatrix3(nm[j]);out.addScaledVector(v,w);nout.addScaledVector(n,w)}g.attributes.position.setXYZ(i,out.x,out.y,out.z);nout.normalize();g.attributes.normal.setXYZ(i,nout.x,nout.y,nout.z)}g.attributes.position.needsUpdate=true;g.attributes.normal.needsUpdate=true};mesh.frustumCulled=false;m.organic=true;return m;
}
makeGoblin118=function(o={}){const m=approvedMake(o);if(!o.organic)return m;prepareGoblinRoleStudy(m);const equip={shield:equipShieldStudy,shaman:equipShamanStudy,brute:equipBruteStudy,archer:equipArcherStudy}[m.goblin118];if(equip)equip(m);return organicWarrior(m)};
animGoblin118=function(m,st,t){approvedAnimate(m,st,t);if(m.handR){const f={warrior:animateWarriorGrip,shield:animateShieldStudy,shaman:animateShamanStudy,brute:animateBruteStudy,archer:animateArcherStudy}[m.goblin118];if(f)f(m,st,t)}if(m.deform)m.deform()};

