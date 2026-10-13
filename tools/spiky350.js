/* Gosma Espinhosa: stationary vibration ambush; damage uses existing projectiles. */
(function(){
'use strict';
function pose(e,name,dt){const m=e.m;if(m.glb){if(m.cur!==name)gPlay(m,name,name!=='Idle',1);m.mixer.update(dt);}else animChibi(m,{move:0,atk:0,wind:0,dead:0},e.t);m.root.position.set(e.x,0,e.z);m.root.rotation.y=e.face;}
function beforeAI(e,dt){
 if(!/^espinhosa(?:_[fa])?$/.test(e.kind)||e.isBoss||e.ally)return false;
 e.act=null;const pt=pickTarget(e),T=pt&&pt.t;const variant=e.kind.endsWith('_f')?'f':e.kind.endsWith('_a')?'a':'';
 const last=e.spikyLast350;e.spikyLast350=T?{target:T,x:T.x,z:T.z}:null;
 const moved=T&&last&&last.target===T&&Math.hypot(T.x-last.x,T.z-last.z)>.008;
 const hit=e.spikyHp350!=null&&e.hp<e.spikyHp350;e.spikyHp350=e.hp;
 if(hit)e.spikyImpact350=.8;
 e.spikyImpact350=Math.max(0,(e.spikyImpact350||0)-dt);
 if(e.stun>0){e.spiky350=null;e.cd=Math.max(e.cd,.3);pose(e,'HitRecieve',dt);return true;}
 let a=e.spiky350;
 if(a){a.t+=dt;
  if(a.phase==='wind'){
   pose(e,'Windup',dt);
   if(a.t>=e.wind){
    if(a.target&&!a.target.dead&&(!('hp' in a.target)||a.target.hp>0)&&los(e.x,e.z,a.x,a.z)){
     e.face=Math.atan2(a.x-e.x,a.z-e.z);
     const bone=e.m.model&&e.m.model.getObjectByName('Crystal');e.m.root.updateMatrixWorld(true);
     const p=bone?bone.getWorldPosition(new THREE.Vector3()):new THREE.Vector3(e.x,.9,e.z);
     const dx=a.x-p.x,dz=a.z-p.z,dy=a.y-(terrH(p.x,p.z)+p.y),d=Math.hypot(dx,dy,dz)||1;
     shoot(p.x,p.z,e.face,12,e.dmg,'enemy',variant?0xa978df:0xc69342,'crystal350'+(variant?'_'+variant:''),{originY:p.y,dir3D:{x:dx/d,y:dy/d,z:dz/d}});
    }
    a.phase='recover';a.t=0;e.cd=e.atkCd;pose(e,'Fire',0);
   }
  }else{pose(e,a.t<.25?'Fire':'Regrow',dt);if(a.t>=e.atkCd)e.spiky350=null;}
  return true;
 }
 pose(e,'Idle',dt);
 if(T&&pt.d<9&&e.cd<=0&&(moved||e.spikyImpact350>0||(variant==='f'&&(T.mp||0)>0)||variant==='a')&&los(e.x,e.z,T.x,T.z)){
  const dx=T.x-e.x,dz=T.z-e.z,dy=terrH(T.x,T.z)+1-(terrH(e.x,e.z)+.72),d=Math.hypot(dx,dy,dz)||1;
  e.spikyImpact350=0;e.face=Math.atan2(dx,dz);e.spiky350={phase:'wind',t:0,target:T,x:T.x,z:T.z,y:terrH(T.x,T.z)+1,dir:{x:dx/d,y:dy/d,z:dz/d}};
  floater(e.x,e.z,variant==='a'?'PULSO!':variant==='f'?'PRISMA!':'ESPINHO!',variant?'#cba3ff':'#e6ba69',true,e.wind+.3);
 }
 return true;
}
function projectile(kind='espinhosa'){const g=new THREE.Group(),src=MON.list[kind]&&MON.list[kind].getObjectByName('Crystal350');
 if(src&&src.isMesh){src.updateWorldMatrix(true,false);const geo=src.geometry.clone();geo.applyMatrix4(src.matrixWorld);geo.computeBoundingBox();geo.translate(...geo.boundingBox.getCenter(new THREE.Vector3()).multiplyScalar(-1).toArray());geo.rotateX(Math.PI/2);const mat=src.material.clone();mat.skinning=false;const c=new THREE.Mesh(geo,mat);c.scale.setScalar(1.2/(MON.h[kind]||1));g.add(c);return g;}
 const m=new THREE.MeshStandardMaterial({color:0xc69342,roughness:.3,metalness:.05});const c=new THREE.Mesh(new THREE.ConeGeometry(.07,.24,5),m);c.rotation.x=Math.PI/2;g.add(c);return g;}
window.Spiky350={beforeAI,projectile};
})();
