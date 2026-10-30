/* ================= AÇÕES ================= */
/* PC: mira pelo mouse. O golpe/habilidade vai para onde o cursor aponta no chão. */
const mouseAim={x:0,y:0,ok:false},aimRay=new THREE.Raycaster(),aimPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0),aimV=new THREE.Vector3();
if(!touch)addEventListener('mousemove',e=>{mouseAim.x=e.clientX;mouseAim.y=e.clientY;mouseAim.ok=true});
// Bounds are measured once from the actual model; terrain is added only to its rigid base.
function projectileBody253(e){const m=e.m;let b=m?.projectileBounds253;
  /* v490 (Ian): o GLB (ex.: Lobo Fendido) chega depois do corpo provisório; medir de novo quando o modelo trocar, senão a mira desce para o chão */
  const src490=m&&(m.model||m.body||m.root);if(b&&(b.src490!==src490||b.kids490!==(src490?.children?.length||0)))b=null;
  if(!b&&m){m.root.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(m.model||m.body||m.root),base=m.root.matrixWorld.elements[13];b=m.projectileBounds253={lo:box.min.y-base,hi:box.max.y-base,bodyY:m.body?.position.y||0,rw:Math.max(box.max.x-box.min.x,box.max.z-box.min.z)/2,src490,kids490:src490?.children?.length||0};/* SkinnedMesh do Lobo Fendido mede ~230 m na pose de ligação: caixa absurda volta ao corpo pelo raio */if(!isFinite(b.lo)||!isFinite(b.hi)||b.hi-b.lo<.3||b.hi-b.lo>Math.max(6,(e.r||.5)*10)){b.rw=e.r||.5;b.lo=0;b.hi=Math.max(.8,(e.r||.5)*2.5);}}
  const low=b?.lo??0,high=b?.hi??Math.max(.8,(e.r||.5)*2.5),h=Math.max(.1,high-low),r=Math.max(.1,e.r||.5,Math.min(2.5,(b?.rw||0)*.7)),lift=(m?.body?.position.y||0)-(b?.bodyY||0);
  const gy490=terrH(e.x,e.z);
  return {x:e.x,y:Math.max(gy490+Math.min(h/2,1.2),gy490+(m?.root?.position.y||0)+lift+(low+high)/2),z:e.z,r,hitHeight:Math.max(0,h-2*r),entity:e};
}
let aimCache253=null;
function aimPoint(){if(touch||!mouseAim.ok)return null;
  const key=[time,mouseAim.x,mouseAim.y,camera.position.x,camera.position.y,camera.position.z,camera.quaternion.x,camera.quaternion.y,camera.quaternion.z].join(':');
  if(aimCache253?.key===key){aimV.copy(aimCache253.point);aimV.enemy253=aimCache253.enemy;aimV.ray388=aimCache253.ray388;return aimV;}
  const rc=renderer.domElement.getBoundingClientRect();aimRay.setFromCamera({x:(mouseAim.x-rc.left)/(rc.width||W)*2-1,y:-((mouseAim.y-rc.top)/(rc.height||H))*2+1},camera);
  const ray=aimRay.ray,ground=Projectiles253.aimTerrainRay(ray,terrH,220);let best=null,dist=ground?ground.t*220:220;
  for(const e of enemies){if(e.dead||e.sleep||Math.hypot(e.x-player.x,e.z-player.z)>80)continue;const b=projectileBody253(e),hit=Projectiles253.intersectRayCapsule(ray.origin,ray.direction,b,b.r+.35,b.hitHeight,220);/* v408: folga na mira p/ bichos baixos e largos (Lobo Fendido) */if(hit.hit&&hit.distance<dist){dist=hit.distance;best=e;}}
  if(best){const b=projectileBody253(best);aimV.set(best.x,b.y,best.z);}
  else if(ground)aimV.set(ground.x,ground.y+1.1,ground.z);
  else{const distance=Math.max(35,camera.position.distanceTo(new THREE.Vector3(player.x,terrH(player.x,player.z)+1.1,player.z))+45);aimV.copy(ray.origin).addScaledVector(ray.direction,distance);}
  /* v389 (Ian): ponto exato onde a mira do mouse cai (chão ou longe no céu), para o tiro básico livre subir e descer com a mira */
  const ray388=ground?new THREE.Vector3(ground.x,ground.y,ground.z):ray.origin.clone().addScaledVector(ray.direction,Math.max(35,camera.position.distanceTo(new THREE.Vector3(player.x,terrH(player.x,player.z)+1.1,player.z))+45));
  aimV.enemy253=best;aimV.ray388=ray388;aimCache253={key,point:aimV.clone(),enemy:best,ray388};return aimV;
}
function playerMoveDir(){
  if(!player)return null;
  let dx=(typeof input!=='undefined'?input.x:0),dz=(typeof input!=='undefined'?input.z:0);
  if(keys.KeyW||keys.ArrowUp)dz-=1;if(keys.KeyS||keys.ArrowDown)dz+=1;if(keys.KeyA||keys.ArrowLeft)dx-=1;if(keys.KeyD||keys.ArrowRight)dx+=1;
  if(typeof pcCam!=='undefined'&&pcCam.yaw&&typeof camRot==='function')[dx,dz]=camRot(dx,dz);
  if(typeof FX2!=='undefined'&&FX2.inv>0){dx=-dx;dz=-dz}
  const l=Math.hypot(dx,dz);if(l<.15)return null;
  return {x:dx/l,z:dz/l,angle:Math.atan2(dx,dz)};
}
function faceTarget(max=7){
  if(window.W377&&W377.target){
    const e=W377.target;
    if(!e.dead&&!e.gone&&(typeof enemies!=='undefined'&&enemies.includes(e))&&Math.hypot(e.x-player.x,e.z-player.z)<=(max||7)+e.r+1){
      player.face=Math.atan2(e.x-player.x,e.z-player.z);
      return e;
    }
  }
  const ap=aimPoint();
  if(ap&&ap.enemy253){
    const e=ap.enemy253;
    player.face=Math.atan2(e.x-player.x,e.z-player.z);
    return e;
  }
  const mv=playerMoveDir();
  if(mv){
    player.face=mv.angle;
    let best=null,bd=1e9;
    for(const e of enemies){
      if(e.dead||e.gone)continue;
      const dx=e.x-player.x,dz=e.z-player.z,d=Math.hypot(dx,dz);
      if(d>max+e.r)continue;
      let da=Math.atan2(dx,dz)-mv.angle;
      da=Math.abs(Math.atan2(Math.sin(da),Math.cos(da)));
      if(da<1.0&&d<bd){bd=d;best=e;}
    }
    return best;
  }
  if(ap){
    const fa=Math.atan2(ap.x-player.x,ap.z-player.z);
    player.face=fa;
    let best=null,bd=1e9;
    for(const e of enemies){
      if(e.dead)continue;
      const dx=e.x-player.x,dz=e.z-player.z,d=Math.hypot(dx,dz);
      if(d>max)continue;
      let da=Math.atan2(dx,dz)-fa;
      da=Math.abs(Math.atan2(Math.sin(da),Math.cos(da)));
      if(da<.7&&d<bd){bd=d;best=e}
    }
    return best;
  }
  const e=nearestEnemy(player.x,player.z,max);
  if(e)player.face=Math.atan2(e.x-player.x,e.z-player.z);
  return e;
}
function attack(){if(typeof inConversation==='function'&&inConversation()){if(typeof mouseHeld!=='undefined')mouseHeld=false;return;}if(typeof isCinematic451==='function'&&isCinematic451()){if(typeof mouseHeld!=='undefined')mouseHeld=false;return;}if(window.Cogu348&&Cogu348.asleep(player))return;
  if(player.dead||paused||player.atkCd>0||player.dodgeT>0)return;resourceCombat258();if(kitFormAttack111())return;if(window.Firearms372?.isGun(run.equip.w)){Firearms372.fire();return}
  curDType281=(()=>{const k=weaponKind272(run.equip.w)||'';if(/^(sword|axe|mace|spear|hammer|bow|dagger|firearm)$/.test(k))return 'phy';if(/^(staff|bonestaff|wand|tome|orb)$/.test(k))return 'mag';return basicIsMagic()?'mag':'phy'})();
  const ci=basicAttackId(),c=CLASSES[ci],effectClass=MAGIC_CLS.includes(ci)===basicIsMagic()?ci:null;
  player.combo=player.comboT>0?(player.combo%3)+1:1;player.comboT=.85;
  const third=player.combo===3,timing=attackTiming(third);if(player.atkT<=0)player.atkT=.001;
  const overRatio=(window.Surv437&&typeof Surv437.overRatio==='function')?Surv437.overRatio():1.0;
  const overSlow=overRatio>1.0?Math.min(2.5,1+(overRatio-1.0)*1.6):1.0;
  player.atkCd=timing.interval*overSlow;dprog('atk',1);
  if(overRatio>1.0&&Math.random()<0.3){try{floater(player.x,player.z,'PESO EXCESSIVO','#ff9999');}catch(_){}}
  const dmg=player.dmg*timing.damage*basicDmgMul()*(player.buff>0?player.buffMul:1)*(third?1.8+.25*rankTalent('finisher'):1)*(FX2.counter?1.6:1);FX2.counter=false;
  /* v272 (Ian): o ataque básico segue a ARMA equipada, não a classe — arco atira flechas, adaga é arremessada (pelo cabo, lâmina na frente), espada/machado batem; cajado/varinha/tomo e mãos vazias seguem a regra da classe */
  const wk272=weaponKind272(run.equip.w),weaponMode272=wk272==='bow'?'arrow':wk272==='dagger'?'tdagger':wk272==='spear'?'tspear':/^(sword|axe|mace|spear|hammer)$/.test(wk272)?'melee':/^(staff|bonestaff|wand|tome|orb)$/.test(wk272)?'magic':null;
  const shootsNow=MELEE_MAGIC297.includes(ci)&&weaponMode272!=='arrow'&&weaponMode272!=='tdagger'&&weaponMode272!=='tspear'?false:weaponMode272?weaponMode272!=='melee':basicIsMagic();/* v695 (Ian): sem arma e sem magia, toda classe dá soco */
  if(shootsNow&&weaponMode272&&weaponMode272!=='magic'){faceTarget(16);const n=1+rankTalent('volley');for(let i=0;i<n;i++){const f=player.face,side=i===0?0:(i%2?-1:1)*Math.ceil(i/2)*.55;shoot(player.x+Math.cos(f)*side,player.z-Math.sin(f)*side,f,(weaponMode272==='arrow'?22:18)*(1+.15*rankTalent('reach')),dmg,'player',weaponMode272==='arrow'?0xd8c49a:0xcfd8ff,weaponMode272,{basicAim365:true,third,pierce:!!rankTalent('piercing'),bounces:rankTalent('bounce')})}beep(520,.04,.03,'triangle')}
  else if(shootsNow){faceTarget(16);const col=c.sk[0].col;const n=1+rankTalent('volley');const dirs=[0,...(rankTalent('mirror')>=1?[Math.PI]:[]),...(rankTalent('mirror')>=2?[Math.PI/2,-Math.PI/2]:[])];for(const da of dirs)for(let i=0;i<n;i++){const f=player.face+da,side=i===0?0:(i%2?-1:1)*Math.ceil(i/2)*.55;shoot(player.x+Math.cos(f)*side,player.z-Math.sin(f)*side,f,22*(1+.15*rankTalent('reach')),dmg,'player',col,c.wep==='bow'?'arrow':c.wep==='spear'?'tspear':c.pt?c.pt:c.n==='Mago Elemental'?'fire':c.n==='Paladino'?'holy':c.n==='Necromante'?'soul':'orb',{basicAim365:true,basicClass:ci,third,pierce:!!rankTalent('piercing')||(ci===4&&third),bounces:rankTalent('bounce')})}beep(440,.05,.03,'triangle')}
  else{faceTarget(6);const reach=(third?3.1:2.6)*(styleOff()?.85:1)*(1+.04*pb('area'))*(1+.25*rankTalent('sweep')),arc=(third?1.3:1.0)+rankTalent('sweep')*Math.PI/9;moveEnt(player,Math.sin(player.face)*.45,Math.cos(player.face)*.45);
    fxSlash(player.x,player.z,player.face,third?0xffe070:0xffd08a,reach,third,effectClass,player.jy||0);sfx('swing');
    let hit=false;for(const e of enemies){if(e.dead)continue;const dx=e.x-player.x,dz=e.z-player.z,d=Math.hypot(dx,dz);if(window.Dragao551&&Dragao551.is(e)){/* v551: dragão = esferas 3D (tronco, cabeça, asas, cauda, patas); chão vazio embaixo não conta */if(!Dragao551.melee(e,player,reach,arc,player.face)&&!(rankTalent('backstrike')&&Dragao551.melee(e,player,reach,arc,player.face+Math.PI)))continue}else{if(d>reach+e.r)continue;let da=Math.atan2(dx,dz)-player.face;da=Math.atan2(Math.sin(da),Math.cos(da));if(Math.abs(da)>arc&&d>1.2&&!(rankTalent('backstrike')&&Math.PI-Math.abs(da)<arc))continue}hurtEnemy(e,dmg,player.x,player.z,{kb:third?4:1.5,fromPlayer:true,stun:third?.5:.22,third,basicClass:effectClass});hit=true}
    if(rankTalent('backstrike'))fxSlash(player.x,player.z,player.face+Math.PI,0xffd08a,reach,third,effectClass,player.jy||0);
    if(third&&rankTalent('wave')){/* v178: Onda de choque */const f=player.face;for(let k=0;k<rankTalent('wave');k++)later181(()=>{if(player.dead)return;shoot(player.x,player.z,f,16,dmg,'player',0xffd08a,'orb',{basicClass:ci,pierce:true,kb:2,fromPlayer:true,staffCast:false})},120*k)}
    if(hit){hitstop(third?.09:.06);shake(third?.28:.12)}}
}
function autoAim357(a){let best=null,dist=16;for(const e of enemies){if(e.dead)continue;const dx=e.x-player.x,dz=e.z-player.z,d=Math.hypot(dx,dz),delta=Math.atan2(dx,dz)-a;if(d<dist&&Math.abs(Math.atan2(Math.sin(delta),Math.cos(delta)))<.45&&los(player.x,player.z,e.x,e.z)){dist=d;best=e}}return best?projectileBody253(best):null}
/* v690 (Ian, 29/10): balística real. Projétil FÍSICO (flecha, virote, adaga, lança, pedra arremessada) cai pela gravidade;
   magia voa reta; sem vento. Flecha aponta para onde voa e, se errar, fica cravada no chão; passar por cima recolhe (v691: a puxada do arco define a velocidade). Monstro arqueiro compensa a queda na mira. */
const BAL690={g:9.8,arrow:50,life:8,stuck:20},stuck690=[];
function physProj690(t){return !MAGIC_PT281.test(t||'')}
function ballisticPitch690(v,d,dy){const g=BAL690.g,v2=v*v,disc=v2*v2-g*(g*d*d+2*dy*v2);return disc<0?Math.PI/4:Math.atan((v2-Math.sqrt(disc))/(g*d))}
function shoot(x,z,a,spd,dmg,team,col,type='orb',o={}){
  const nearCaster=team==='player'&&Math.hypot(x-player.x,z-player.z)<1.8;
  const aim=nearCaster&&o.aim3D!==false&&o.staffCast!==false&&!o.dir3D?(aimPoint()||autoAim357(a)):null,target=aim&&{x:aim.x,y:aim.y,z:aim.z};
  // v389 (Ian): o tiro básico livre segue a mira também na vertical (mirar para cima sobe, para baixo desce); antes ficava na altura de saída.
  const freeAim389=!!(o.basicAim365&&target&&!aim.enemy253&&!aim.entity&&aim.ray388);if(freeAim389){target.x=aim.ray388.x;target.y=aim.ray388.y;target.z=aim.ray388.z}
  let pitch=0;if(target){const origin={x,y:terrH(player.x,player.z)+(player.jy||0)+1.1,z};pitch=Math.atan2(target.y-origin.y,Math.hypot(target.x-x,target.z-z));player.aimPitch253=pitch;}
  if(nearCaster&&type==='tspear')player.spearGone339=time+.3;if(nearCaster&&type==='tspear'&&o.originY==null&&player?.m?.warrior127){const muzzle=Warrior127.handMuzzle(player.m,{face:player.face,combo:player.combo,pitch253:pitch,wep:'spear_throw'});if(muzzle){x=muzzle.x+(x-player.x);z=muzzle.z+(z-player.z);o={...o,originY:muzzle.y,terrainLaunch245:TER245.heightFor(player.m.root)}}}
  // Pose first, then read the actual tip/hand. Logical muzzle height receives its rigid terrain base once.
  if(nearCaster&&o.staffCast!==false&&o.originY==null&&player?.m?.warrior127&&!/^(arrow|sarrow|stone_lance|tdagger|tspear)$/.test(type)&&(o.basicClass==null||MAGIC_CLS.includes(o.basicClass)||basicIsMagic())){
    const m=player.m,staff=weaponIsMagic173(run.equip.w)&&Warrior127.staffMuzzle(m),unarmed=!weaponIsMagic173(run.equip.w)&&basicIsMagic();let muzzle=null;
    if(staff){Warrior127.prepareStaffCast(m,{face:player.face,combo:player.combo,pitch253:pitch});muzzle=Warrior127.staffMuzzle(m);}
    else if(unarmed)muzzle=Warrior127.handMuzzle(m,{face:player.face,combo:player.combo,pitch253:pitch});
    if(muzzle){x=muzzle.x+(x-player.x);z=muzzle.z+(z-player.z);o={...o,originY:muzzle.y,terrainLaunch245:TER245.heightFor(m.root)};}
  }
  if(team!=='player'){dmg=kitWeakDamage111(curAtk,dmg);o.fromBoss111=!!curAtk?.isBoss;}
  /* v279 (Ian): tiro de monstro mira a ALTURA do alvo no momento do disparo (terreno com relevo), mas segue reto depois — não é teleguiado, dá para esquivar */
  if(team!=='player'&&!o.dir3D&&player){let best=null,bd=1e9;for(const t of [player,...allies]){if(!t||t.dead)continue;const tx=t.x-x,tz=t.z-z,td=Math.hypot(tx,tz);if(td<.5||td>60)continue;let da=Math.atan2(tx,tz)-a;da=Math.atan2(Math.sin(da),Math.cos(da));if(Math.abs(da)<.6&&td<bd){bd=td;best=t}}
    if(best){const y0=(o.originY??1.1)+(o.terrainLaunch245??terrH(x,z)),ty=projectileBody253(best).y,pitch=physProj690(type)?ballisticPitch690(spd,bd,ty-y0):Math.atan2(ty-y0,bd);o={...o,dir3D:{x:Math.sin(a)*Math.cos(pitch),y:Math.sin(pitch),z:Math.cos(a)*Math.cos(pitch)}}}}const big=type==='big';if(big)type='orb';const sc=o.sc||(big?2:1);
  const y=o.worldOriginY253??((o.originY??(1.1+(nearCaster?(player.jy||0):0)))+(o.terrainLaunch245??terrH(x,z)));
  let dir=o.dir3D?Projectiles253.unit(o.dir3D):{x:Math.sin(a),y:0,z:Math.cos(a)};
  if(target){dir=Projectiles253.aim3D({x,y,z},target);const da=a-player.face,cs=Math.cos(da),sn=Math.sin(da),dx=dir.x;dir.x=dx*cs+dir.z*sn;dir.z=dir.z*cs-dx*sn;}
  const phys690=physProj690(type);const draw691=window.__bowDraw588;if(phys690&&team==='player'&&/^(arrow|sarrow)$/.test(type))spd=draw691!=null?BAL690.arrow*(.65+.35*draw691):Math.max(spd,BAL690.arrow);
  const arrowId691=phys690&&team==='player'&&type==='arrow'&&window.Flechas663?Flechas663.current():null;
  const holder=projModel(type,col,sc,o.vis156??o.basicClass);holder.userData.terrainAbsolute245=true;holder.position.set(x,y,z);holder.rotation.set(-Math.atan2(dir.y,Math.hypot(dir.x,dir.z)),Math.atan2(dir.x,dir.z),0,'YXZ');scene.add(holder);
  projs.push({elem300:o.elem300,dtype281:o.dtype281||(team==='player'?curDType281:null),originY:y,y,vy:dir.y*spd,fromBoss111:!!o.fromBoss111,stun:o.stun,mesh:holder,ptype:type,tt:0,x,z,vx:dir.x*spd,vz:dir.z*spd,dmg,team,col,life:phys690?BAL690.life:1.4,grav690:phys690?BAL690.g:0,arrowId691,pierce:!!o.pierce,hit:new Set(),r:sc>4?1.3:sc>1.4?.7:.4,kb:o.kb??(team==='player'?.35:1.2),fromPlayer:o.fromPlayer??team==='player',longshot:!!o.longshot,originX:x,originZ:z,slow:o.slow||0,burn:o.burn||0,basicClass:o.basicClass,skillHit:!!o.skillHit,bounces:o.bounces||0,third:!!o.third});
}
function projectileImpact253(p){if(window.Golpes487&&!Golpes487.legacyDepth&&p.team==='player'&&!p.skillHit&&Golpes487.basic(p.basicClass??profile.cls)&&p.ptype==='tdagger')return Golpes487.legacy(()=>projectileImpact253(p));const start=fxs.length;fxBurst(p.x,p.y,p.z,p.col,5,3);for(let i=start;i<fxs.length;i++)fxs[i].o.userData.terrainAbsolute245=true;
  if(window.Flip470){const elem=p.elem300||(p.ptype==='fire'?'fogo':p.ptype==='spark'?'raio':p.ptype==='ice'?'gelo':p.ptype==='soul'?'trevas':p.ptype==='holy'?'luz':null);if(elem==='fogo')Flip470.spawn('explosion',p.x,p.y,p.z,2.2,{grow:.3});else if(elem==='raio')Flip470.spawn('lightning',p.x,p.y+.2,p.z,2.2,{grow:.15});else if(elem==='gelo')Flip470.spawn('water',p.x,p.y,p.z,2.0,{grow:.25});else if(elem==='trevas')Flip470.spawn('smoke',p.x,p.y,p.z,1.8,{tint:0x4c1d95,grow:.3});else if(elem==='luz')Flip470.spawn('rune',p.x,p.y,p.z,1.6,{grow:.1});else if(p.ptype==='arrow'||p.ptype==='sarrow'||p.ptype==='tspear')Flip470.spawn('dust',p.x,p.y,p.z,1.6,{grow:.3,op:.7});}
}
function updateProjectiles253(dt){
  for(let i=stuck690.length-1;i>=0;i--){const st=stuck690[i];
    if(st.id&&player&&!player.dead&&Math.hypot(st.x-player.x,st.z-player.z)<1.6&&window.Surv437){try{Surv437.add(st.id,1,true);floater(player.x,player.z,'+1 flecha','#e8d8a8');window.Flechas695&&Flechas695.picked(st.id)}catch(_){}scene.remove(st.m);stuck690.splice(i,1);continue}
    if((st.t-=dt)<=0){scene.remove(st.m);stuck690.splice(i,1)}}
  for(let i=projs.length-1;i>=0;i--){const p=projs[i],lease487=window.Golpes487&&Golpes487.projectile(p),priorSkill487=window.Golpes487?.legacySkill;if(lease487){Golpes487.legacyDepth++;Golpes487.legacySkill=p.fx487.sk}try{const pdt=dt*(p.team==='player'?1:rareAreaTime103(p.x,p.z)),before={x:p.x,y:p.y??p.originY??1.1,z:p.z};
    p.life-=pdt;if(p.grav690)p.vy=(p.vy||0)-p.grav690*pdt;p.x+=p.vx*pdt;p.y=before.y+(p.vy||0)*pdt;p.z+=p.vz*pdt;
    if(p.grav690)p.mesh.rotation.set(-Math.atan2(p.vy,Math.hypot(p.vx,p.vz)),Math.atan2(p.vx,p.vz),0,'YXZ');
    const after={x:p.x,y:p.y,z:p.z},terrain=Projectiles253.terrainHit(before,after,terrH),limit=terrain?.t??1;
    let done=p.life<=0,bounced=false;
    if(kitCapture111(p,pdt)){scene.remove(p.mesh);projs.splice(i,1);continue;}
    const targets=p.team==='player'?enemies:[player,...allies],hits=[];
    for(const e of targets){if(e.dead||p.hit.has(e))continue;const body=projectileBody253(e),hit=Projectiles253.segmentCapsule(before,after,body,body.r+p.r,body.hitHeight);if(hit.hit&&hit.t<limit)hits.push({e,hit});}
    hits.sort((a,b)=>a.hit.t-b.hit.t);
    for(const {e,hit} of hits){p.x=hit.p.x;p.y=hit.p.y;p.z=hit.p.z;p.hit.add(e);
      if(p.team==='player'){hurtEnemy(e,p.dmg,p.x-p.vx*.05,p.z-p.vz*.05,{longshot:p.longshot,originX:p.originX,originZ:p.originZ,kb:p.kb,stun:p.stun,slow:p.slow,fromPlayer:p.fromPlayer,ptype300:p.ptype,elem300:p.elem300,basicClass:p.basicClass,skillHit:p.skillHit,skillVfx487:p.fx487?.sk,basicVfx487:p.fx487?.ci,third:p.third,dtype281:p.dtype281});if(p.burn){e.dotT=3;e.dotD=Math.max(e.dotD||0,p.dmg*p.burn/3);}if(p.arrowId691){const ar=e.arrows695||(e.arrows695={});ar[p.arrowId691]=(ar[p.arrowId691]||0)+1;}projectileImpact253(p);if(bounceBasic(p)){bounced=true;break;}if(!p.pierce){done=true;break;}}
      else{if(e===player){window.projOwner333=p.owner333||null;inDType281=MAGIC_PT281.test(p.ptype||'')?'mag':'phy';hurtPlayer(p.dmg,!p.fromBoss111);inDType281='phy';window.projOwner333=null}else hurtAlly(e,p.dmg);projectileImpact253(p);done=true;break;}
    }
    if(!done&&!bounced){p.x=after.x;p.y=after.y;p.z=after.z;if(terrain){p.x=terrain.x;p.y=terrain.y;p.z=terrain.z;done=true;projectileImpact253(p);if(p.grav690)p.stuck690=true;}}
    if(!done){const fr=(x,z)=>L.grid?gfree(x,z):worldFree(x,z,.1,p.y);if(!fr(p.x,p.z)){if(p.wallBounce177>0){if(!fr(p.x,before.z))p.vx=-p.vx;if(!fr(before.x,p.z))p.vz=-p.vz;if(fr(p.x,before.z)&&fr(before.x,p.z)){p.vx=-p.vx;p.vz=-p.vz;}p.x=before.x;p.y=before.y;p.z=before.z;p.wallBounce177--;p.mesh.rotation.y=Math.atan2(p.vx,p.vz);}else{done=true;if(p.grav690){p.x=before.x;p.y=before.y;p.z=before.z;p.stuck690=true;}}}}
    p.mesh.position.set(p.x,p.y,p.z);
    if(p.mesh.userData.spriteFx){const sf=p.mesh.userData.spriteFx;sf.t+=pdt;const k=Math.floor(sf.t*(sf.s.fps||30))%sf.s.n,cx=k%sf.s.c,cy=Math.floor(k/sf.s.c);sf.sp.material.map.offset.set(cx/sf.s.c,1-(cy+1)/sf.s.r)}
    else if(p.ptype==='stone'||p.basicClass===10)p.mesh.rotation.z+=pdt*1.6;
    if(!done){p.tt=(p.tt||0)-dt;if(p.tt<=0){p.tt=.05;if(p.ptype==='fire'||p.elem300==='fogo'){trailFx(p);if(window.Flip470&&Math.random()<.45)Flip470.spawn('flame',p.x,p.y,p.z,.7,{grow:.1,dur:.12,op:.85})}else if(p.ptype==='spark'||p.elem300==='raio'){if(window.Flip470&&Math.random()<.55)Flip470.spawn('lightning',p.x,p.y,p.z,.65,{grow:.1,dur:.1,op:.9})}else if(p.ptype==='ice'||p.elem300==='gelo'){if(window.Flip470&&Math.random()<.45)Flip470.spawn('water',p.x,p.y,p.z,.65,{grow:.1,dur:.12,op:.75})}else if(p.ptype==='soul'||p.elem300==='trevas'){trailFx(p);if(window.Flip470&&Math.random()<.45)Flip470.spawn('smoke',p.x,p.y,p.z,.6,{tint:0x4c1d95,grow:.15,dur:.15,op:.6})}else if(p.ptype==='sarrow'||p.ptype==='arrow'){trailFx(p)}}}
    if(done){if(p.stuck690){p.mesh.position.set(p.x,p.y,p.z);stuck690.push({m:p.mesh,t:p.arrowId691?Infinity:BAL690.stuck,id:p.arrowId691,x:p.x,y:p.y,z:p.z});if(stuck690.length>80){scene.remove(stuck690[0].m);stuck690.shift();}}else scene.remove(p.mesh);projs.splice(i,1);}
    }finally{if(lease487){Golpes487.legacyDepth--;Golpes487.legacySkill=priorSkill487}}
  }
}
/* Recarga da esquiva: 1,50 s ÷ (1 + 1% por ponto de Agilidade), sem limite. */
function dodgeCdVal(){return Math.max(.1,1.5/(1+.01*((run.stats||{}).agi||0))*(hasT('brk60')?.85:1))*(cons('vel')>=10?.8:1)}/* v485: título Inabalável = 15% mais rápida (antes −0,2 s) */
function dodgeFaster484(){return Math.round((1.5/dodgeCdVal()-1)*100)}
/* v343 (Ian): Espaço só pula; o ataque básico fica só no botão esquerdo do mouse. */
function jump343(){if(window.Cogu348&&Cogu348.asleep(player))return;const P=player;if(!P||P.dead||paused||P.air344||P.dodgeT>0||run.mounted)return;P.jvy=Math.sqrt(2*24*1.3);P.jy=(P.jy||0)+.001;P.air344=true;beep(330,.05,.03,'triangle')}
function dodge(){if(window.Cogu348&&Cogu348.asleep(player))return;
  if(player.dead||paused||player.dodgeCd>0)return;
  let dx=input.x,dz=input.z;if(keys.KeyW||keys.ArrowUp)dz-=1;if(keys.KeyS||keys.ArrowDown)dz+=1;if(keys.KeyA||keys.ArrowLeft)dx-=1;if(keys.KeyD||keys.ArrowRight)dx+=1;
  if(pcCam.yaw)[dx,dz]=camRot(dx,dz);
  if(FX2.inv>0){dx=-dx;dz=-dz}
  if(Math.hypot(dx,dz)<.2){dx=Math.sin(player.face);dz=Math.cos(player.face)}const l=Math.hypot(dx,dz);
  player.dir={x:dx/l,z:dz/l};player.face=Math.atan2(dx,dz);player.dodgeT=.32;player.iT=.38;player.dodgeCd=dodgeCdVal();player.ghostT=0;sfx('dodge');dprog('dodge',1);demandBreak('nododge');
}
function potionHealFraction(){return (npcHas('Mira')?.75:.5)+(hasT('lvl50')?.15:0)}/* v485: Veterano soma 15% (antes ×1,25 = 62,5%) */
function potionDescription(){const p=potionHealFraction();return 'Cura '+Math.round(p*100)+'% da vida máxima ('+fmt(Math.round(player.maxhp*p))+' de vida).'+(hasT('lakeg')?' Recupera também 30% do escudo máximo.':'')}
function usePot(){if(player.dead||paused)return;if(hasAff('nocure')){toast('Afixo Sem cura: poções não funcionam aqui.');return}demandBreak('nopot');if(run.pots<=0){toast('<b>[NARRADOR]</b> Sem poções. Compre na loja de Poções.');return}if(player.hp>=player.maxhp)return;run.pots--;narratorEvent105('potion');player.hp=Math.min(player.maxhp,player.hp+player.maxhp*potionHealFraction());if(hasT('lakeg'))player.shield=Math.min(player.maxsh,player.shield+player.maxsh*.3);fxRing(player.x,player.z,0xff8fa3,2.4);floater(player.x,player.z,'+VIDA','#ff8fa3')}
function useSkill(sk){if(typeof inConversation==='function'&&inConversation())return false;if(typeof isCinematic451==='function'&&isCinematic451())return false;if(window.Cogu348&&Cogu348.asleep(player))return false;if(sk?.combo261)return useCombo261();if(!sk||sk.empty||!player||player.dead||paused)return false;
  if(sk&&!sk.empty){const canonical=kitCanonical111(sk);if(canonical){const equipped=player.skills.find(s=>!s.empty&&s.skillId===canonical.skillId);if(!equipped){toast('Equipe esta habilidade em um dos seis espaços.');return}if(!player.dead&&!paused){const c0=equipped.cdT;kitCast111(equipped);if(equipped.cdT>c0)skillAnim155(equipped)}return}}
  if(player.dead||paused||!sk||sk.empty)return;
  if(sk.n==='Sol Nascente'){sk=player.skills.find(s=>!s.empty&&s.n==='Sol Nascente');if(!sk){toast('Equipe Sol Nascente em um dos seis espaços de Personagem → Habilidades.');return}}
  if(sk.rare103){const returning=sk.t==='rare_anchor'&&AR103.anchor&&AR103.anchor.until>time;if(sk.cdT>0&&!returning)return;const error=rareCastCheck103(sk);if(error){toast(error);return}if(sk.t==='rare_gate'){rareAutoGate153(sk);return}const receipt=paySkill258(sk,returning);if(!receipt)return false;if(!returning){sk.cdT=sk.cdMax=skillCooldown(sk);player.lastSpellAt=time}rareSkillRun103(sk);if(typeof castFluid139==='function')castFluid139(sk);narratorSkill105(sk);player.atkT=.001;finishSkill258(sk,receipt);return true}
  if(sk.cdT>0)return;
   if(sk.t==='summon'&&minionAllies().length>=summonCap()&&(sk.n!=='Matilha Espiritual'||!allies.some(a=>!a.dead&&a.summonKind==='wolf'))){floater(player.x,player.z,'LIMITE DE INVOCAÇÕES','#b18cff');return}
   if(sk.t==='heal'&&hasAff('nocure')){floater(player.x,player.z,'SEM CURA','#ff8fa3');return}
   if(sk.t==='minionbuff'&&!minionAllies(true).length){floater(player.x,player.z,'SEM INVOCADOS','#9fb0c4');return}
  if(sk.t==='chain'&&sk.n!=='Fúria dos Céus'&&!nearestEnemy(player.x,player.z,12)){floater(player.x,player.z,'SEM ALVO','#9fb0c4');return}
  const receipt=paySkill258(sk);if(!receipt)return false;
  player.lastSpellAt=time;sk.cdT=skillCooldown(sk);sk.cdMax=sk.cdT;if(['nova','cone','bolt','chain','rain','dot','stone_lance','thunderstorm'].includes(sk.t)&&sk.n!=='Lâmina Envenenada')AR103.lastAttack={...sk};runSkill(sk);narratorSkill105(sk);player.atkT=.001;finishSkill258(sk,receipt);return true;
}
function setStealth(on){player.m.mats.forEach(m=>{m.transparent=on;m.opacity=on?.35:1})}
function skillGroundPoint(max=14,fallback=7){const ap=aimPoint();if(ap){const dx=ap.x-player.x,dz=ap.z-player.z,d=Math.hypot(dx,dz),k=d>max?max/d:1;return{x:player.x+dx*k,z:player.z+dz*k}}return{x:player.x+Math.sin(player.face)*fallback,z:player.z+Math.cos(player.face)*fallback}}
function physicalEvolution(sk,dmg){const P=player;
  if(sk.n==='Lâmina Rúnica'){for(let i=1;i<=3;i++){const x=P.x+Math.sin(P.face)*i*3,z=P.z+Math.cos(P.face)*i*3,h=hazard(x,z,2,i*.25,dmg/3,'player',0xffd08a);h.kb=0;h.stun=0;h.runeStrike=true;}waveFwd(P.x,P.z,P.face,0xffd08a,8,2);return true}
  if(sk.n==='Mil Cortes'){for(let i=0;i<6;i++){const h=hazard(P.x,P.z,5,i*.2,dmg/6,'player',0xa26bff);h.kb=0;h.stun=0;h.bladeStrike=true;}spinRing(P.x,P.z,0xa26bff,5,1.2);return true}
  if(sk.n==='Fortaleza Viva'){P.guard=5;P.guardVal=sk.pow;let count=0;for(const a of allies)if(!a.dead&&Math.hypot(a.x-P.x,a.z-P.z)<=6){a.fortressUntil=time+5;fxRing(a.x,a.z,0x9fd3ff,1.2,5);count++}bubble(5,0x9fd3ff);fxRing(P.x,P.z,0x9fd3ff,6,1);toast('<b>[FORTALEZA]</b> Proteção por 5s · '+count+' aliados protegidos.');return true}
  return false;
}
function solarHeal(x,z,r,fraction){if(hasAff('nocure'))return;for(const a of [player,...allies])if(!a.dead&&Math.hypot(a.x-x,a.z-z)<=r){const old=a.hp;a.hp=Math.min(a.maxhp,a.hp+a.maxhp*fraction);const healed=a.hp-old;if(healed>0)floater(a.x,a.z,'+'+fmt(healed),'#9fffc0');fxRing(a.x,a.z,0xfff3a0,1,.4)}}
function magicEvolution(sk,dmg){const P=player,col=sk.col;
  if(['Meteoro','Sol Negro','Era do Gelo','Fúria dos Céus'].includes(sk.n)){const pt=skillGroundPoint(),meteor=sk.n==='Meteoro',fire=sk.n==='Sol Negro',ice=sk.n==='Era do Gelo',n=meteor?1:fire?5:ice?4:3,r=meteor?5:fire?4:ice?6:3;for(let i=0;i<n;i++){const delay=meteor?1:fire?.5+i:ice?.3+i:.3+i*.35,/* v485: tempos inteiros no texto (Meteoro 1s, Gelo 1 pulso/s, Fúria 3 raios em 1s) */h=hazard(pt.x,pt.z,r,delay,dmg/n,'player',col);h.kb=0;h.stun=0;h.slow=ice?2:0;if(!meteor&&!fire&&!ice)h.lightning=true;if(ice)h.icePulse=true;if(fire)h.firePulse=true;}if(meteor)fallFx(pt.x,pt.z,.9,'meteor',col);else if(fire)pillar(pt.x,pt.z,0xff3a1e,1.1,.7);else if(ice)spikes(pt.x,pt.z,12,1,6,col,1);return true}
  if(sk.n==='Sol Nascente'){solarHeal(P.x,P.z,6,sk.pow/2);for(let i=1;i<=3;i++){const h=hazard(P.x,P.z,6,i,0,'player',col);h.healFraction=sk.pow/6;}pillar(P.x,P.z,col,1.5,1);return true}
  if(sk.n==='Domínio dos Servos'){fxRing(P.x,P.z,col,7,1);spikes(P.x,P.z,14,1,7,col,1.5);for(const e of enemies)if(!e.dead&&Math.hypot(e.x-P.x,e.z-P.z)<=7+e.r){e.echoMarkUntil=Math.max(e.echoMarkUntil||0,time+8);hurtEnemy(e,dmg,P.x,P.z,{kb:0,stun:0,fromPlayer:true,skillHit:true})}return true}
  if(sk.n==='Matilha Espiritual'||sk.n==='Colosso de Pedra'){const wolf=sk.n==='Matilha Espiritual',n=Math.min(wolf?3:1,Math.max(0,summonCap()-minionAllies().length));for(let i=0;i<n;i++){let x=P.x+Math.sin(i*2.1)*1.8,z=P.z+Math.cos(i*2.1)*1.8;if(!freeAt(x,z,.5)){x=P.x;z=P.z}spawnSummon(wolf?'wolf':'golem',x,z,1e9)}if(wolf)for(const a of allies)if(!a.dead&&a.summonKind==='wolf'){a.buffT=Math.max(a.buffT||0,8);fxRing(a.x,a.z,col,1.4,.6)}circle(P.x,P.z,col);saveRun();return true}
  return false;
}
// v155: habilidades com animação própria no Viajante (Chuva de Flechas: com arco mira para o alto; sem arco joga um punhado de flechas para cima).
/* v303 (Ian): cada habilidade tem a sua animação de lançamento (antes só a Chuva de Flechas tinha). Usa as animações do modelo do Viajante. */
/* Shared animation choice: gameplay and the isolated class gallery use the same clips. */
function skillAnimationPlan405(sk,src,wk,bow){const own487=window.Golpes487?.animationPlan?.(sk);if(own487)return own487;if(!sk)return {clip:null,overlay:null,duration:.75};const n=sk.n||'',t=sk.t==='kit111'?sk.effect:(sk.effect||sk.t),mag=MAGIC_CLS.includes(src),staff=/^(staff|bonestaff|wand|tome)$/.test(wk);let k=null;

 if(/Chuva de Flechas/.test(n))k=!bow?'chuva_sem_arco':'chuva_com_arco';
 else if(/terremoto|tremor|sísm|abalo|erup|impacto|golpe brutal|golpe pesado|quebra|rompante|pisão|esmag/i.test(n))k='pesado2';
 else if(/girat|redemoinho|varredura|meia-lua|garras em arco|rodopio/i.test(n))k='golpe3';
 else if(/flecha|disparo|tiro|leque/i.test(n))k=bow?'arco2':'arremesso_flecha';
 else if(/punho|soco|chute|palma/i.test(n)||src===21)k='soco';
 else if(/estocada|lança|lanca|salto do dragão/i.test(n)||src===23)k='lanca1';
 else if(/guard|ward|block|parry|barrier|anchorward|interpose|form/.test(t))k='guarda';
 else if(/move|dash_strike|evade|relocate/.test(t))k='esquiva';
 else if(src===1||/adaga|faca|lâmina envenenada|cortes/i.test(n))k='adaga2';
 else if(/cone|target|execute|line/.test(t)&&!mag)k=wk==='axe'||src===2||src===24?'pesado1':'golpe2';
 else if(mag||/heal|healzone|summon|buff|rally260|allybuff|speed|order|cleanse|pulses|area|nova|bolt|chain|slow|slowzone|root|weaken/.test(t))k=staff?'cajado2':'magia_mao';

 const mapped=window.Anim303?.map?.[n];
 const overlay=mapped||(/terremoto|tremor|sísm|abalo|erup|impacto|salto do dragão|quebra/i.test(n)?'salto_impacto':/girat|redemoinho|varredura|rodopio|meia-lua/i.test(n)?'giro':/raio|tempest|trovo|meteor|céus|ceus|chuva|sol negro|estrela/i.test(n)&&!/flecha/i.test(n)?'ceu':/heal|healzone|rewindheal|cleanse/.test(t)?'ajoelhar':/guard|ward|block|barrier|anchorward|interpose/.test(t)?'firme':/push|line|bolt|chain|fan/.test(t)&&mag?'palmas':null);
 return {clip:mapped?null:k,overlay,duration:.75};
}
function skillAnim155(sk){if(!sk||!player)return;const plan=skillAnimationPlan405(sk,sk.sourceClass??profile.cls,weaponKind272(run.equip.w)||'',hasBow259());if(plan.clip)player.skillAnim155={k:plan.clip,until:time+plan.duration};if(!plan.clip)player.skillAnim155=null;if(plan.overlay)try{Anim303.play(plan.overlay)}catch(_){}}

function runSkill(sk){skillAnim155(sk);if(sk.kit111){kitRun111(sk);castFluid139(sk);return}
  const P=player,dmg=skillDamage(sk),col=sk.col;faceTarget(14);if(physicalEvolution(sk,dmg)||magicEvolution(sk,dmg)){castFluid139(sk);sfx('skill');return}skillFx(sk,P);castFluid139(sk);
  if(sk.rare103){rareSkillRun103(sk);return}
  switch(sk.t){
    case 'cone':{for(const e of enemies){if(e.dead)continue;const dx=e.x-P.x,dz=e.z-P.z,d=Math.hypot(dx,dz);let da=Math.atan2(dx,dz)-P.face;da=Math.atan2(Math.sin(da),Math.cos(da));if(d<5+e.r&&Math.abs(da)<.95)hurtEnemy(e,dmg,P.x,P.z,{kb:5,stun:.8,pierce:true,fromPlayer:true,skillHit:true})}hitstop(.08);shake(.3);break}
    case 'nova':{let landed=false;const r=sk.n==='Julgamento'?judgmentRadius(sk):sk.n==='Golpe Sísmico'?8:6;const ice=sk.n.includes('Gelo');for(const e of enemies)if(!e.dead&&Math.hypot(e.x-P.x,e.z-P.z)<r+e.r){const hit=hurtEnemy(e,dmg,P.x,P.z,{kb:sk.n==='Julgamento'?0:4,stun:0,slow:ice?4:0,pierce:true,fromPlayer:true,skillHit:true});if(hit>0)landed=true}hitstop(.08);shake(.35);break}
    case 'chain':{let cur={x:P.x,z:P.z};const hs=new Set(),pts=[{x:P.x,z:P.z}];for(let i=0;i<5;i++){let best=null,bd=i?7:12;for(const e of enemies){if(e.dead||hs.has(e))continue;const d=Math.hypot(e.x-cur.x,e.z-cur.z);if(d<bd){bd=d;best=e}}if(!best)break;hs.add(best);pts.push({x:best.x,z:best.z});hurtEnemy(best,dmg*(1-i*.12),cur.x,cur.z,{kb:1,pierce:true,fromPlayer:true,skillHit:true});cur=best}zig(pts,col);if(pts.length===1)floater(P.x,P.z,'SEM ALVO','#8aa6c0');break}
    case 'bolt':{if(sk.n==='Flecha Estelar'){for(const offset of [-.2,0,.2])shoot(P.x,P.z,P.face+offset,30,dmg/3,'player',0xb8a2ff,'sarrow',{skillHit:true,pierce:true,kb:1,sc:1.8});break}const ar=sk.n.includes('Flecha'),ice=/Gelo/.test(sk.n),fire=/Fogo|Chama/.test(sk.n);shoot(P.x,P.z,P.face,ar?30:ice?27:20,dmg,'player',col,ar?'sarrow':ice?'ice':fire?'fire':'orb',{longshot:sk.n==='Flecha Perfurante',skillHit:true,pierce:ar||ice,kb:ice?1:3,slow:ice?3:0,burn:fire?.25:0,sc:ar?1.6:ice?1.35:fire?5.4:1.8});break}
    case 'stone_lance':{const dx=Math.sin(P.face),dz=Math.cos(P.face);for(let i=1;i<=5;i++){const x=P.x+dx*i*1.5,z=P.z+dz*i*1.5;spikes(x,z,3,0,.5,col,1.5+i*.1);cracks(x,z,.7,col)}for(const e of enemies){if(e.dead)continue;const x=e.x-P.x,z=e.z-P.z,along=x*dx+z*dz,across=Math.abs(x*dz-z*dx);if(along>0&&along<8+e.r&&across<.8+e.r)hurtEnemy(e,dmg,P.x,P.z,{kb:5,stun:e.isBoss?.2:.8,pierce:true,fromPlayer:true,skillHit:true})}shake(.25);break}
    case 'thunderstorm':{const pt=skillGroundPoint(),cx=pt.x,cz=pt.z,targets=enemies.filter(e=>!e.dead&&Math.hypot(e.x-cx,e.z-cz)<5).slice(0,5);if(!targets.length)for(let i=0;i<5;i++)targets.push({x:cx+(i?Math.sin(i*Math.PI/2)*2.5:0),z:cz+(i?Math.cos(i*Math.PI/2)*2.5:0)});for(const [i,e] of targets.entries()){const h=hazard(e.x,e.z,.85,.5+i*.12,dmg,'player',col);h.lightning=true;}break}
    case 'dash_strike':{P.dodgeT=.28;P.iT=.34;P.dir={x:Math.sin(P.face),z:Math.cos(P.face)};P.dashDmg={dmg,execute:sk.n==='Passo Sombrio',hit:new Set()};P.dashSpd=30;break}
    case 'blink':{for(let d=7;d>0;d-=1){const bx=P.x-Math.sin(P.face)*d,bz=P.z-Math.cos(P.face)*d;if(freeAt(bx,bz,.5)){fxBurst(P.x,1,P.z,col,10,4);P.x=bx;P.z=bz;break}}P.iT=.6;fxRing(P.x,P.z,col,2);break}
    case 'holy_step':{const pt=skillGroundPoint(6,6);if(freeAt(pt.x,pt.z,P.r||.5)&&los(P.x,P.z,pt.x,pt.z)){P.x=pt.x;P.z=pt.z;fxRing(P.x,P.z,col,1.5,.5)}break}
    case 'holy_bind':{const pt=skillGroundPoint(12);for(const e of enemies)if(!e.dead&&!e.isBoss&&Math.hypot(e.x-pt.x,e.z-pt.z)<=4&&los(P.x,P.z,e.x,e.z))e.slow=Math.max(e.slow||0,3);fxRing(pt.x,pt.z,col,4,.7);break}
    case 'cleanse':case 'holy_shield':{for(const a of [P,...allies])if(!a.dead&&Math.hypot(a.x-P.x,a.z-P.z)<=8){if(sk.t==='cleanse'){a.sleep348=0;a.slowT=0;a.bleedT=0;a.bleedD=0;a.slow=0;a.stun=0}else{const cap=healingShieldCap(sk),previous=healingShield(a);a.healShield=Math.max(previous,a.maxhp*cap);a.healShieldCap=Math.max(a.healShieldCap||0,cap);a.healShieldUntil=time+6}fxRing(a.x,a.z,col,1.3,.6)}break}
    case 'heal':{applyHealingLight(P,sk);for(const a of allies)if(!a.dead&&a.life>0&&(sk.n!=='Luz Curativa'||Math.hypot(a.x-P.x,a.z-P.z)<=8))applyHealingLight(a,sk);break}
    case 'buff_dmg':{P.buff=8;P.buffMul=sk.pow;toast('<b>[NARRADOR]</b> '+sk.n+': dano x'+sk.pow+' por 8s');break}
    case 'guard':{P.guard=5;P.guardVal=sk.pow;if(sk.n==='Bênção')blessAllies(P);toast('<b>[NARRADOR]</b> '+sk.n+': dano recebido reduzido');break}
    case 'stealth':{P.stealth=5;setStealth(true);for(const e of enemies)if(!e.isBoss)e.aggro=false;toast('<b>[NARRADOR]</b> Furtivo por 5s. Próximo golpe x3');break}
    case 'minionbuff':{const mine=minionAllies(true),blocked=hasAff('nocure');for(const a of mine){if(!blocked)a.hp=Math.min(a.maxhp,a.hp+a.maxhp*.45);a.buffT=8+(sk.pow-1.5)*4;fxRing(a.x,a.z,0xb98cff,1.4,.4)}fxRing(P.x,P.z,0xb98cff,4,.6);floater(P.x,P.z,'PACTO SOMBRIO: '+mine.length+(blocked?' fortalecidas (sem cura)':' curadas e fortalecidas'),'#b18cff');break}
    case 'summon':{const n=Math.min(Math.round(sk.pow),Math.max(0,summonCap()-minionAllies().length));
      for(let i=0;i<n;i++){const a=rnd(0,TAU);let x=P.x+Math.cos(a)*1.8,z=P.z+Math.sin(a)*1.8;if(!freeAt(x,z,.4)){x=P.x;z=P.z}const a2=spawnSummon(sk.n.includes('Lobo')||sk.n.includes('Feras')||sk.n.includes('Matilha')?'wolf':'skel',x,z,1e9);if(sk.giant){a2.giant=true;a2.m.body.scale.setScalar(2);a2.hp=a2.maxhp*=8;a2.dmg*=5;a2.r=1}}saveRun();break}
    case 'rain':{const pt=skillGroundPoint(),cx=pt.x,cz=pt.z;const fk=/Flecha/.test(sk.n)?'arrow':/Meteoro/.test(sk.n)?'meteor':/Alma/.test(sk.n)?'soul':'orb';const nn=fk==='meteor'?5:fk==='arrow'?10:7;if(fk==='arrow')player.skillAnim155={k:!hasBow259()?'chuva_sem_arco':'chuva_com_arco',until:time+.8};for(let i=0;i<nn;i++){const hx=cx+rnd(-3,3),hz=cz+rnd(-3,3),du=(fk==='meteor'?.6:.35)+i*(fk==='arrow'?.28:.35);const h=hazard(hx,hz,fk==='meteor'?2.4:1.9,du,dmg*(fk==='arrow'?.7:1),'player',col);if(sk.n==='Chuva de Flechas')h.slow=2;fallFx(hx,hz,du,fk,col)}break}
    case 'dot':{if(sk.n==='Lâmina Envenenada'){P.venomCharges=3;P.venomUntil=time+8;fxRing(P.x,P.z,col,1.5);break}const pt=skillGroundPoint(11,5);for(let i=0;i<5;i++){const h=hazard(pt.x,pt.z,6,.5+i,dmg/5,'player',col);h.kb=0;h.passive=true}break}
  }
  sfx('skill');
}
function absorb(b){
  if(!canArise())return;b.absorbed=true;
  shake(.7);fxRing(b.x,b.z,0xa26bff,6,.9);fxBurst(b.x,.3,b.z,0xa26bff,30,6);b.m.root.visible=false;addShadow({n:b.boss.n,lvl:1,xp:0,nick:null});toast('<b>[NARRADOR]</b> '+b.boss.n+' se levanta como seu servo.',4000);sfx('arise');
  saveRun();
}
function ctxTarget(){
  if(!player||player.dead||!started)return null;
  let best=null,bd=1e9;const P=player;
  for(const it of L.inter){if(it.hidden)continue;const d=Math.hypot(P.x-it.x,P.z-it.z);if(d<it.r&&d<bd){bd=d;best=it}}
  for(const n of npcs){if(n.gone||n.kind==='deco')continue;const d=Math.hypot(P.x-n.x,P.z-n.z);if(d<2.8&&d<bd){bd=d;best=n}}
  if(bossE&&bossE.dead&&!bossE.absorbed){const d=Math.hypot(P.x-bossE.x,P.z-bossE.z);if(d<4.5&&d<bd){if(canArise())best={label:'F · ERGUER SERVO',use:()=>absorb(bossE)}}}
  return best;
}
function interact(){if(player.dead||paused)return;const c=ctxTarget();if(!c)return;if(typeof c.use==='function')c.use();else if(c.kind==='hunter')talk(c)}
/* v332 (Ian): morte verdadeira apaga as missões em andamento (quadro da Ordem, extração, exigência, diária) para ninguém guardar missão de nível alto e entregar no nível 1. */
function clearMissionsOnDeath332(){run.quests=null;run.demand=null;delete run.extractMission117;delete run.daily;if(run.trackObj&&!String(run.trackObj).startsWith('camp327:'))run.trackObj=null}
function die(){
  if(player.dead)return;
  if(window.Campaign327?.respawnRoad())return;
  /* v187 (Ian): Pergaminho de Ressurgimento levanta você no lugar, sem perder nada. */
  if((run.rez187||0)>0){run.rez187--;player.dead=false;player.hp=player.maxhp;player.mp=player.maxmp;player.iT=3;player.bleedT=0;player.bleedD=0;player.slowT=0;player.stun=0;player.sleep348=0;bigText('RESSURGIDO',1400);sfx('arise');fxRing(player.x,player.z,0xfff0a0,5,.6);toast('<b>[NARRADOR]</b> O pergaminho queimou e você voltou. Restam '+run.rez187+'.',5000);saveRun();return}
  /* v187 (Ian): morte verdadeira. Perde nível, XP, ouro, itens, status e habilidades: recomeça do zero.
     Fica: rank de classe, despertar e classes, e o que está no banco e na casa. */
  const redBroken=failRedPortalOnDeath();expAbandon();FX2.inv=0;player.dead=true;player.hp=0;recordNemesis();
  const gp192=L.mode==='world'?{x:player.x,z:player.z}:(L.gate?{x:L.gate.x,z:L.gate.z}:null);if(gp192&&run.gold>0)profile.grave192={x:gp192.x,z:gp192.z,gold:Math.round(run.gold*.2)};const lostLv=run.level,lostG=run.gold,lostI=(run.items||[]).length+equippedItems().length;profile.deaths=(profile.deaths||0)+1;
  profile.towerBest=0;if(profile.relics183){const v=profile.relics183.vault||{};profile.relics183={own:{...v},eq:[],vault:v}}
  resetPointPassives253();const keep={pos:run.invReturn372?{x:run.invReturn372.x,z:run.invReturn372.z}:run.pos,invReturn372:run.invReturn372,classLoadout:run.classLoadout,initialSkillFix259:run.initialSkillFix259};/* v341 (Ian): morrer voltava a habilidade equipada para a primeira da classe */newRun();Object.assign(run,keep);clearMissionsOnDeath332();ensureRun();if(!classLoadout().some(Boolean))run.classLoadout=[profile.cls+':0'];run.pts=(run.pts||0)+CREATION_PTS281;/* v269/v281 (Ian): os 9 pontos da criação voltam */player.skills=pSkills();refreshStats();narratorDeath105();store.set('pds2_profile',profile);player.dead=false;saveRun();player.dead=true;
  const rk=RANKS[profile.rank];
  $('deadtxt').innerHTML='Você voltou ao nível 1.<br><b>Perdeu:</b> '+fmt(lostG)+' de ouro, '+lostI+' itens, atributos, melhorias de passivas e missões da Ordem.<br><b>Manteve:</b> rank '+rkN(profile.rank)+', Juramento e bens no banco e na casa.<br>Os 9 pontos iniciais retornaram para a sua classe. Atributos sobem treinando.'+(redBroken?'<br>O portal vermelho rompeu.':'');

  setTimeout(()=>{$('dead').hidden=false;paused=true},1300);
}

