/* Isolated exhibits use Primeva's own Viajante, weapons and creatures. */
(()=>{
'use strict';
const T=THREE,owned=new WeakMap();
const ready=Promise.all([MODELS.ready,Warrior127.prepare()]);
function hero(ci){
 if(!Warrior127.ok)return null;
 const c=CLASSES[ci],kind=c.wep||'none',item={uid:'exhibit405-'+ci,slot:'w',kind155:kind,tier:0,rar:0,visualWeapon:Warrior127.visualWeapon(0,kind)};
 const m=Warrior127.create({equip:{w:kind==='none'?null:item},look:{...(profile?.look||{})},legacyLinearOutput:false,tierColors:TIER_COL,rarities:RAR});
 const color=({1:0x638984,5:0xe0cfa1,6:0x6ea8a1,8:0xa4644e,9:0x8baec3,10:0x859577,11:0xa39bb9,21:0xac9977,22:0x7b99aa,24:0xa47c66})[ci];
 if(color)m.model.traverse(o=>{if(o.isMesh&&/^tripo_part_(0|3)$/.test(o.name))o.material.color.lerp(new T.Color(color),.45)});
 if([8,9,10,11].includes(ci)){const source=MODELS.list.Mage?.getObjectByName('Mage_Hat');if(source&&m.bones.head){const h=new T.Mesh(source.geometry,source.material.clone()),holder=new T.Group();h.material.color?.lerp(new T.Color(color),.5);h.geometry.computeBoundingBox();const box=h.geometry.boundingBox,sz=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());h.position.set(-center.x,-box.min.y,-center.z);holder.add(h);holder.scale.setScalar(.46/Math.max(sz.x,.01)/m.model.scale.x);holder.position.set(0,.085,0);m.bones.head.add(holder);m.mats.push(h.material)}}
 const geometries=new Set();m.root.traverse(o=>{if(o.geometry){o.geometry=o.geometry.clone();geometries.add(o.geometry)}});owned.set(m,{kind:'hero',wep:kind,geometries});animate(m,{time:0,dt:.016});return m;
}
function monster(kind='goblin'){const m=window.Bestiary405?.createModel(kind);if(!m)return null;owned.set(m,{kind:'monster'});return m}
function animate(m,o={}){if(!m)return;const t=o.time||0,dt=Math.max(0,o.dt??.016),own=owned.get(m);
 if(m.warrior127){const phase=t-.25,plan=o.skill?skillAnimationPlan405(o.skill,o.skill.sourceClass,own?.wep||'none',own?.wep==='bow'):null;
 const casting=plan&&phase>=0&&phase<plan.duration;
 Warrior127.animate(m,{move:o.move||0,speed:o.speed,sprint:o.sprint,atk:0,skill:casting?plan.clip:null,combo:1,wep:own?.wep||'none',dead:0},t,dt||.000001);
 if(plan?.overlay)Anim303.applyPose(m,plan.overlay,phase,own?.wep!=='none');return}
 if(m.goblin118){animGoblin118(m,{move:o.move||0,atk:0,wind:0,dead:0},t);return}
 if(!m.mixer){if(!m.glb)animChibi(m,{move:o.move||0,atk:0,wind:0,dead:0},t);else if(m.st){m.body.position.y=Math.sin(t*2)*.03;m.body.rotation.set(0,0,0)}return}
 const name=o.hit?'Hit_A':o.move?'Running_A':'Idle';if(m.cur!==name)gPlay(m,name,name==='Hit_A',1);m.mixer?.update(dt);
}
function dispose(m){if(!m||!owned.has(m))return;if(owned.get(m).kind==='monster'){Bestiary405.disposeModel(m);owned.delete(m);return}m.mixer?.stopAllAction();m.mixer?.uncacheRoot(m.model);m.a155?.mixer?.stopAllAction();if(m.a155)m.a155.mixer.uncacheRoot(m.a155.rig);const mats=new Set(m.mats||[]);m.root.traverse(o=>{if(o.material)[].concat(o.material).forEach(x=>mats.add(x))});mats.forEach(x=>{if(!x.userData?.shared)x.dispose()});const sk=new Set();m.root.traverse(o=>{if(o.isSkinnedMesh)sk.add(o.skeleton)});sk.forEach(x=>x.dispose?.());owned.get(m).geometries?.forEach(g=>g.dispose());m.eyeMat?.dispose();m.root.parent?.remove(m.root);owned.delete(m)}
window.Exhibit405={ready,hero,monster,animate,dispose};
})();
