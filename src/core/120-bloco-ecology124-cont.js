function makeChibi(o){
  if(o.goblin118){const userGoblin={/* v413: arquivos conferidos com as fichas do Drive */warrior:'user_goblin_guerreiro',archer:'user_goblin_arqueiro',shaman:'user_goblin_bruto',shield:'user_goblin_xama',brute:'user_orc'}[o.goblin118];if(userGoblin&&MON.list[userGoblin])return makeMonster({...o,mon:userGoblin});return makeGoblin118(o)}
  if(o.mon==='escaravelho'&&MON.list.escaravelho)return makeMonster(o);
  if((o.mon==='escaravelho'||o.mon==='monarca')&&MODELS.ok&&MODELS.list.Knight)return makeArmoredMonster(o);
  if(o.mon&&MON.list[o.mon])return makeMonster(o);
  if(o.gk&&MODELS.ok&&MODELS.list[o.gk])return makeActor(o);
  const root=new THREE.Group(),body=new THREE.Group();root.add(body);
  const sc=o.scale||1;body.scale.setScalar(sc);
  const bm=o.mat||toon(o.body),sm=o.skinMat||toon(o.skin??0xffd8b8);
  const torso=mesh(geo('torso',()=>new THREE.CylinderGeometry(.33,.42,.72,10)),bm);torso.position.y=.86;body.add(torso);
  const head=mesh(geo('head',()=>new THREE.SphereGeometry(.44,16,12)),sm);head.position.y=1.58;body.add(head);
  if(o.hair!==undefined){const h=mesh(geo('hair',()=>new THREE.SphereGeometry(.47,16,10,0,TAU,0,Math.PI*.52)),toonS(o.hair),false);h.position.y=1.62;h.rotation.x=-.25;body.add(h)}
  if(o.helm){const h=mesh(geo('helm',()=>new THREE.CylinderGeometry(.5,.48,.5,10)),bm);h.position.y=1.7;body.add(h);const c=mesh(geo('crest',()=>new THREE.ConeGeometry(.14,.5,6)),toonS(0xffd070));c.position.set(0,2.05,0);body.add(c)}
  const em=new THREE.MeshBasicMaterial({color:o.eye??0x111111});
  for(const s of[-1,1]){const e=new THREE.Mesh(geo('eye',()=>new THREE.BoxGeometry(.1,.16,.04)),em);e.position.set(.15*s,1.56,.42);body.add(e)}
  const limb=(x,y,k,h,m)=>{const p=new THREE.Group();p.position.set(x,y,0);const l=mesh(geo(k,()=>new THREE.BoxGeometry(k==='arm'?.17:.21,h,k==='arm'?.17:.21)),m);l.position.y=-h/2;p.add(l);body.add(p);return p};
  const lm=o.legMat||toonS(0x1c1c28);
  const armL=limb(-.47,1.12,'arm',.55,bm),armR=limb(.47,1.12,'arm',.55,bm),legL=limb(-.17,.52,'leg',.52,lm),legR=limb(.17,.52,'leg',.52,lm);
  if(o.wep&&o.wep!=='none'){const w=weapon(o.wep,o.wcol);w.position.y=-.5;armR.add(w);if(o.wep==='dagger'){const w2=weapon('dagger');w2.position.y=-.5;armL.add(w2)}}
  if(o.shield){const s=mesh(geo('shield',()=>new THREE.BoxGeometry(.08,.6,.5)),toonS(0x6a4a2a));s.position.set(-.1,-.45,.1);armL.add(s)}
  const sh=new THREE.Mesh(geo('shadow',()=>new THREE.CircleGeometry(.55,16)),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.35,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.03;sh.scale.setScalar(sc);root.add(sh);
  const mats=[];body.traverse(m=>{if(m.isMesh&&m.material.isMeshToonMaterial&&!m.material.userData.shared&&!mats.includes(m.material))mats.push(m.material)});
  return {root,body,armL,armR,legL,legR,mats,sc,eyeMat:em};
}
