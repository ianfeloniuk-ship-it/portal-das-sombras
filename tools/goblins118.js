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
