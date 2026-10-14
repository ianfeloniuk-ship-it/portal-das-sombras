/* ================= PERSONAGENS ================= */
function weapon(kind,col){
  const g=new THREE.Group();
  if(kind==='sword'){const b=mesh(geo('ws',()=>new THREE.BoxGeometry(.1,.95,.05)),toonS(0xdfe8f0));b.position.y=-.55;g.add(b);g.add(mesh(geo('wg',()=>new THREE.BoxGeometry(.3,.06,.1)),toonS(0x8a6a2a)))}
  else if(kind==='dagger'){const b=mesh(geo('wd',()=>new THREE.ConeGeometry(.07,.55,4)),toonS(0xcfd8ff));b.rotation.x=Math.PI;b.position.y=-.3;g.add(b)}
  else if(kind==='axe'){const h=mesh(geo('wah',()=>new THREE.CylinderGeometry(.04,.04,.9,6)),toonS(0x5a3a20));h.position.y=-.35;g.add(h);const a=mesh(geo('wab',()=>new THREE.BoxGeometry(.38,.28,.06)),toonS(0xb8c0cc));a.position.set(.15,-.72,0);g.add(a)}
  else if(['staff','bonestaff','wand','tome'].includes(kind)){const h=mesh(geo('wst',()=>new THREE.CylinderGeometry(.04,.04,1.3,6)),toonS(0x4a3020));h.position.y=-.45;g.add(h);const o=new THREE.Mesh(geo('wso',()=>new THREE.SphereGeometry(.13,10,8)),glowS(col||0xffd08a,1));o.position.y=-1.12;g.add(o)}
  else if(kind==='bow'){const h=mesh(geo('wb',()=>new THREE.TorusGeometry(.42,.035,5,12,Math.PI)),toonS(0x6b4a2a));h.rotation.z=Math.PI/2;h.position.y=-.3;g.add(h)}
  return g;
}
