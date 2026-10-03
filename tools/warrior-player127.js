(function(global){
  'use strict';
  const T=global.THREE,API={ok:false,settled:false},SCALE=2.05/1.014584;
  let asset=null,pending=null;
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  API.load=function(url){
    if(pending)return pending;
    pending=new Promise(resolve=>new T.GLTFLoader().load(url,g=>{asset=g;API.ok=true;API.settled=true;resolve(true)},undefined,e=>{console.warn('Guerreiro detalhado não carregou; usando personagem anterior.',e);API.settled=true;resolve(false)}));
    return pending;
  };
  API.visualWeapon=(tier,kind)=>({shape:kind==='sword'?(tier>=6?'long':tier>=3?'broad':'sword'):kind});
  function setupMaterial(mesh,uniforms,linearOutput){
    const material=mesh.material.clone();material.skinning=!!mesh.isSkinnedMesh;
    // Preserve the approved PBR maps and never recolor face or hair.
    material.onBeforeCompile=shader=>{
      Object.assign(shader.uniforms,uniforms);
      shader.vertexShader='attribute vec4 _gear_mask; varying vec4 vGearMask;\n'+shader.vertexShader;
      shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvGearMask = _gear_mask;');
      shader.fragmentShader='varying vec4 vGearMask; uniform vec3 gearArmor; uniform vec3 gearGloves; uniform vec3 gearBoots; uniform vec3 gearAmounts;\n'+shader.fragmentShader;
      shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
        diffuseColor.rgb *= mix(vec3(1.0), gearArmor, vGearMask.x*gearAmounts.x);
        diffuseColor.rgb *= mix(vec3(1.0), gearGloves, vGearMask.y*gearAmounts.y);
        diffuseColor.rgb *= mix(vec3(1.0), gearBoots, vGearMask.z*gearAmounts.z);`);
      if(linearOutput)shader.fragmentShader=shader.fragmentShader.replace('#include <encodings_fragment>','#include <encodings_fragment>\ngl_FragColor = LinearTosRGB(gl_FragColor);');
    };
    material.customProgramCacheKey=()=> 'warrior127-gear-v2-'+!!linearOutput;
    mesh.material=material;mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=false;
    return material;
  }
  // v153: Mixamo-rigged Viajante (Tripo). Bones are renamed to the names the procedural animation uses,
  // and their bind orientation is kept so model-space deltas can be retargeted (see retarget153).
  const MIX153={Hips:'hips',Spine:'spine',Spine2:'chest',Neck:'neck',Head:'head',RightArm:'upperarm_r',RightForeArm:'forearm_r',RightHand:'hand_r',LeftArm:'upperarm_l',LeftForeArm:'forearm_l',LeftHand:'hand_l',RightUpLeg:'thigh_r',RightLeg:'shin_r',RightFoot:'foot_r',LeftUpLeg:'thigh_l',LeftLeg:'shin_l',LeftFoot:'foot_l'};
  API.create=function(options){
    const model=T.SkeletonUtils.clone(options.modelScene||asset.scene),root=new T.Group(),body=new T.Group();root.add(body);body.add(model);
    let mix153=false;model.traverse(o=>{if(o.isMesh&&/^tripo_part/.test(o.name))mix153=true;if(o.isBone&&/^mixamorig:?/.test(o.name)){mix153=true;const k=o.name.replace(/^mixamorig:?/,'');o.userData.mixName=k;if(MIX153[k])o.name=MIX153[k]}});
    if(mix153){model.updateMatrixWorld(true);const box=new T.Box3().setFromObject(model),s=2.05/(box.max.y-box.min.y);model.scale.setScalar(s);model.position.y=-box.min.y*s;}
    else{model.scale.setScalar(SCALE);model.position.y=.501893*SCALE;}
    // v156: a malha do Viajante tem triângulos-fio (luvas e botas) que vão do centro do corpo até além da mão ou do chão à canela,
    // aparecendo como uma linha. Remove triângulos com aresta acima de 12 cm (na escala do arquivo); os normais têm até ~3,5 cm.
    if(mix153)model.traverse(o=>{if(!o.isSkinnedMesh||!o.geometry.index||o.geometry.userData.sliver156!=null)return;const g=o.geometry,P=g.attributes.position,I=g.index.array,keep=[],a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();let cut=0;
      for(let t=0;t<I.length;t+=3){a.fromBufferAttribute(P,I[t]);b.fromBufferAttribute(P,I[t+1]);c.fromBufferAttribute(P,I[t+2]);if(Math.max(a.distanceTo(b),b.distanceTo(c),c.distanceTo(a))>.12){cut++;continue}keep.push(I[t],I[t+1],I[t+2])}
      if(cut)g.setIndex(keep);g.userData.sliver156=cut});
    const uniforms={gearArmor:{value:new T.Color(1,1,1)},gearGloves:{value:new T.Color(1,1,1)},gearBoots:{value:new T.Color(1,1,1)},gearAmounts:{value:new T.Vector3()}};
    const mats=[],bones={};model.traverse(o=>{if(o.isBone&&(!mix153||Object.values(MIX153).includes(o.name)||/^cape/.test(o.name))&&!bones[o.name])bones[o.name]=o;if(o.isMesh)mats.push(setupMaterial(o,uniforms,options.legacyLinearOutput));});
    if(mix153){for(const k of ['cape','cape_tail'])if(!bones[k])bones[k]=new T.Object3D();model.updateMatrixWorld(true);const inv=new T.Quaternion().copy(model.getWorldQuaternion(new T.Quaternion())).invert();
      for(const [k,b] of Object.entries(bones)){if(!b.isBone)continue;b.userData.bindLocal153=b.quaternion.clone();b.userData.bindModel153=inv.clone().multiply(b.getWorldQuaternion(new T.Quaternion()));}
      const minv=new T.Matrix4().copy(model.matrixWorld).invert();model.traverse(o=>{if(!o.isBone)return;o.userData.rest155M=inv.clone().multiply(o.getWorldQuaternion(new T.Quaternion()));o.userData.rest155P=o.getWorldPosition(new T.Vector3()).applyMatrix4(minv);});}
    const socket=new T.Group();socket.name='weapon_socket_r';socket.position.set(.002,0,.004);socket.rotation.set(2.05,0,0);if(mix153){/* v162 (Ian: "corrigir essa espada"): nos ossos do Tripo a mão em pose T tem os eixos do modelo (dedos em -X, polegar em +Z). A lâmina sai do punho para o lado do polegar e o cabo fica na palma. */socket.rotation.set(Math.PI/2,0,0);socket.position.set(-.045,-.015,0);socket.scale.setScalar(1/model.scale.x*1.6)}bones.hand_r.add(socket);
    const armorGroup=new T.Group();armorGroup.name='equipment_layers';model.add(armorGroup);
    const shadow=new T.Mesh(new T.CircleGeometry(.45,24),new T.MeshBasicMaterial({color:0,transparent:true,opacity:.23,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.025;root.add(shadow);
    const m={mix153,root,body,model,bones,uniforms,mats,wmats:[],wnodes:[],socket,armorParts:[],baseMaterials:mats.slice(),warrior127:true,glb:true,sc:1,armL:bones.upperarm_l,armR:bones.upperarm_r,legL:bones.thigh_l,legR:bones.thigh_r,eyeMat:new T.MeshBasicMaterial(),gearSignature:null,attackPhase:0};
    API.gear(m,options.equip||{},options);API.animate(m,{move:0,atk:0,dead:0},0,0);return m;
  };
  function disposePart(part){part.traverse(o=>{if(o.isMesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});part.removeFromParent?part.removeFromParent():part.parent&&part.parent.remove(part);}
  /* v162 (Ian): aura da arma pela cor do rank — espada, cajado e arco. Rank F/E sem aura; cresce e pulsa mais nos ranks altos. */
  function aura162(w,color,tier,len,bow,cy){if(tier<1)return;const k=Math.min(1,tier/9),g=new T.Group();g.name='aura162';
    const mat=new T.MeshBasicMaterial({color,transparent:true,opacity:.18+.3*k,blending:T.AdditiveBlending,depthWrite:false});
    const core=new T.Mesh(new T.CylinderGeometry(.018+.02*k,.035+.03*k,len,10,1,true),mat);core.position.y=cy??(bow?.49:.07+len/2);g.add(core);
    const halo=new T.Mesh(new T.CylinderGeometry(.04+.05*k,.07+.06*k,len*1.05,10,1,true),mat.clone());halo.material.opacity*=.45;halo.position.copy(core.position);g.add(halo);
    g.onBeforeRender=()=>{};core.onBeforeRender=()=>{const t=performance.now()/1000;mat.opacity=(.18+.3*k)*(.75+.25*Math.sin(t*(2+4*k)));halo.scale.setScalar(1+.08*Math.sin(t*(1.5+3*k)))};
    w.add(g)}
  function staff162(item){const r=new T.Group(),col=item.visual.color,mats=[];
    const wood=new T.MeshStandardMaterial({color:0x4a2e1c,roughness:.8}),gem=new T.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:.8,roughness:.25,metalness:.2}),gold=new T.MeshStandardMaterial({color:0x927044,metalness:.75,roughness:.35});mats.push(wood,gem,gold);
    const shaft=new T.Mesh(new T.CylinderGeometry(.013,.016,1.05,8),wood);shaft.position.y=.3;r.add(shaft);
    const ring=new T.Mesh(new T.TorusGeometry(.04,.009,6,14),gold);ring.position.y=.84;r.add(ring);
    const orb=new T.Mesh(new T.IcosahedronGeometry(.045,1),gem);orb.position.y=.86;r.add(orb);
    r.userData.materials=mats;r.userData.shape='staff';r.userData.color=col;r.userData.rank=item.tier||0;return r}
  /* v162 (Ian: "a mão tem que fechar em volta da onde segura a espada"): o Viajante não tem ossos de dedo,
     então os dedos da malha (vértices do hand_r além dos nós dos dedos) são enrolados em volta do cabo. */
  const FIST162={knuckle:.049,lift:.007,r:.016,max:Math.PI*1.55,thumbZ:.044};
  function fist162(m,on){if(!m.mix153)return;m.model.traverse(o=>{if(!o.isSkinnedMesh)return;const sk=o.skeleton,hi=sk.bones.findIndex(b=>b.name==='hand_r');if(hi<0)return;
    let g=o.geometry;const SI=g.attributes.skinIndex,SW=g.attributes.skinWeight,wt=v=>{let w=0;for(let k=0;k<4;k++)if([SI.getX,SI.getY,SI.getZ,SI.getW][k].call(SI,v)===hi)w+=[SW.getX,SW.getY,SW.getZ,SW.getW][k].call(SW,v);return w};
    if(o.userData.fist162===undefined){let has=false;for(let v=0;v<SI.count&&!has;v++)if(wt(v)>.5)has=true;if(!has){o.userData.fist162=null;return}
      g=o.geometry=g.clone();const P0=g.attributes.position,n=new T.BufferAttribute(new Float32Array(P0.count*3),3);for(let v=0;v<P0.count;v++)n.setXYZ(v,P0.getX(v),P0.getY(v),P0.getZ(v));g.setAttribute('position',n);
      const hp=new T.Vector3().setFromMatrixPosition(new T.Matrix4().copy(sk.boneInverses[hi]).invert());o.userData.fist162={orig:n.array.slice(),w:Float32Array.from({length:P0.count},(_,v)=>wt(v)),hp,on:false}}
    const F=o.userData.fist162;if(!F||F.on===on)return;F.on=on;const P=o.geometry.attributes.position,O=F.orig,KX=F.hp.x-FIST162.knuckle,KY=F.hp.y-FIST162.lift,R=FIST162.r,ZT=F.hp.z+FIST162.thumbZ;
    for(let v=0;v<P.count;v++){let x=O[v*3],y=O[v*3+1],z=O[v*3+2];if(on&&F.w[v]>.5&&x<KX&&z<ZT){const f=Math.min((KX-x)/R,FIST162.max),d=y-KY;x=KX-(R+d)*Math.sin(f);y=KY-R+(R+d)*Math.cos(f)}P.setXYZ(v,x,y,z)}
    P.needsUpdate=true;o.geometry.computeVertexNormals();m.fistHand162=F.hp});
    if(on&&m.fistHand162)m.socket.position.set(-FIST162.knuckle,-FIST162.lift-FIST162.r,.02)}
  /* v163 (Ian: "fazer espada tbm no tripo"): espada do Tripo (models/armas155/espada162.glb). Normalizada com o cabo
     na origem e a lâmina em +Y, do mesmo tamanho da espada longa antiga. Enquanto carrega, fica a espada desenhada. */
  let sword163=null;const waiting163=new Set();
  (function(){if(!T.GLTFLoader)return;new T.GLTFLoader().load('models/armas155/espada162.glb',g=>{const o=g.scene;o.updateMatrixWorld(true);
    const b=new T.Box3().setFromObject(o),sz=b.getSize(new T.Vector3()),ax=sz.x>sz.y&&sz.x>sz.z?'x':sz.z>sz.y?'z':'y';
    const holder=new T.Group(),inner=new T.Group();inner.add(o);holder.add(inner);if(ax==='x')inner.rotation.z=-Math.PI/2;if(ax==='z')inner.rotation.x=Math.PI/2;
    holder.updateMatrixWorld(true);const b2=new T.Box3().setFromObject(holder),L=b2.max.y-b2.min.y,sc=.68/L;inner.scale.multiplyScalar(sc);holder.updateMatrixWorld(true);
    const b3=new T.Box3().setFromObject(holder),c=b3.getCenter(new T.Vector3());inner.position.set(-c.x,-(b3.min.y+(b3.max.y-b3.min.y)*.075),-c.z);
    holder.traverse(x=>{if(x.isMesh){x.castShadow=true;if(x.material)x.material.metalness=Math.min(x.material.metalness??0,.6)}});sword163=holder;
    for(const m of waiting163){m.gearSignature=null;if(m.lastGear163)API.gear(m,...m.lastGear163)}waiting163.clear()},undefined,()=>{})})();
  /* v171 (Ian: "cajado, escudo etc" das classes normais): armas comuns do Tripo em metal neutro, pintadas com a cor do rank.
     [arquivo, comprimento, ponto de pegada (fração a partir da base)]. Tanque e Paladino levam escudo na outra mão. */
  const W171={staff:['comum-cajado',1.15,.33],tome:['comum-cajado',1.15,.33],bonestaff:['comum-cajado',1.15,.33],dagger:['comum-adaga',.36,.16],axe:['comum-maca',.6,.14],wand:['comum-lanca',1.35,.4]};
  const SHIELD171={axe:1,wand:1},w171={},wait171=new Set();
  function norm171(o,len,grip){o.updateMatrixWorld(true);const b=new T.Box3().setFromObject(o),sz=b.getSize(new T.Vector3()),ax=sz.x>sz.y&&sz.x>sz.z?'x':sz.z>sz.y?'z':'y';
    const holder=new T.Group(),inner=new T.Group();inner.add(o);holder.add(inner);if(ax==='x')inner.rotation.z=-Math.PI/2;if(ax==='z')inner.rotation.x=Math.PI/2;
    holder.updateMatrixWorld(true);const b2=new T.Box3().setFromObject(holder);inner.scale.multiplyScalar(len/(b2.max.y-b2.min.y));holder.updateMatrixWorld(true);
    const b3=new T.Box3().setFromObject(holder),c=b3.getCenter(new T.Vector3());inner.position.set(-c.x,-(b3.min.y+(b3.max.y-b3.min.y)*grip),-c.z);return holder}
  function load171(file,len,grip,key){if(w171[key]!==undefined||!T.GLTFLoader)return;w171[key]=null;new T.GLTFLoader().load('models/armas155/'+file+'.glb',g=>{w171[key]=norm171(g.scene,len,grip);for(const m of wait171){m.gearSignature=null;if(m.lastGear163)API.gear(m,...m.lastGear163)}wait171.clear()},undefined,()=>{})}
  function make171(key,color){const src=w171[key];if(!src)return null;const w=src.clone(true),mats=[],c=new T.Color(color);w.traverse(x=>{if(x.isMesh){x.castShadow=true;x.material=x.material.clone();x.material.color.copy(c).lerp(new T.Color(1,1,1),.35);mats.push(x.material)}});w.userData.materials=mats;return w}
  function tripoSword163(item){const w=sword163.clone(true),mats=[];w.traverse(x=>{if(x.isMesh){x.material=x.material.clone();mats.push(x.material)}});w.userData.materials=mats;w.userData.shape=item.visual.shape;w.userData.color=item.visual.color;w.userData.rank=item.tier||0;return w}
  API.gear=function(m,equip,options){m.lastGear163=[equip,options];
    options=options||{};const colors=options.tierColors||[0x9a9aa0,0xd0d8e0,0x7fd8ff,0xb18cff,0xff6a3a,0x3a3048,0xd02040,0xffd070,0xffda9f,0xf4f0ff];
    const signature=JSON.stringify(['w','a','h','g','b'].map(k=>{const i=equip[k];return i?[k,i.uid,i.tier,i.rar,i.visual,i.visualWeapon]:[k,null]}));
    if(signature===m.gearSignature)return;m.gearSignature=signature;
    for(const p of m.wnodes)disposePart(p);for(const p of m.armorParts)disposePart(p);m.wnodes=[];m.armorParts=[];m.wmats=[];m.mats=m.baseMaterials.slice();
    const itemFor=it=>{if(!it)return null;return {...it,visual:{...it.visualWeapon,...it.visual,color:it.visual?.color??colors[clamp(it.tier||0,0,9)]}}};
    m.bow155=false;fist162(m,false);const heldWeapon=equip.w,isBow=heldWeapon&&(heldWeapon.kind155==='bow'||heldWeapon.visual?.shape==='bow'||heldWeapon.visualWeapon?.shape==='bow');
    if(isBow&&bow155&&m.bones.hand_l){const bow=T.SkeletonUtils.clone(bow155);const holder=new T.Group();holder.add(bow);m.bowHolder155=holder;
      // Empunhadura: o meio do arco (y≈0,49 do modelo) na palma; em pose T o arco fica de pé no mundo e acompanha a mão.
      bow.position.set(0,-.49,0);const hl=m.bones.hand_l;m.model.updateMatrixWorld(true);const hq=hl.getWorldQuaternion(new T.Quaternion()),hs=hl.getWorldScale(new T.Vector3()).x;
      holder.quaternion.copy(hq.invert()).multiply(new T.Quaternion().setFromEuler(new T.Euler(...BOWROT155)));holder.scale.setScalar(1.3/hs);holder.position.set(...BOWPOS155);hl.add(holder);holder.userData.aimQ155=holder.quaternion.clone();holder.userData.aimP155=holder.position.clone();m.wnodes.push(holder);m.bow155=true;const it=itemFor(heldWeapon);aura162(bow,it.visual.color,it.tier||0,.98,true)}
    else if(heldWeapon){m.bow155=false;const item=itemFor(heldWeapon);if(!item.visual.shape)item.visual.shape=API.visualWeapon(item.tier||0,'sword').shape;const isSword163=heldWeapon.kind155!=='staff'&&/^(sword|broad|long)$/.test(item.visual.shape||'');if(isSword163&&!sword163)waiting163.add(m);const k171=W171[heldWeapon.kind155];if(k171){load171(k171[0],k171[1],k171[2],heldWeapon.kind155);if(!w171[heldWeapon.kind155])wait171.add(m)}const c171=k171&&make171(heldWeapon.kind155,item.visual.color);const weapon=c171||(heldWeapon.kind155==='staff'?staff162(item):isSword163&&sword163?tripoSword163(item):global.WarriorEquipment127.weapon(T,item));
      if(SHIELD171[heldWeapon.kind155]&&m.bones.hand_l){load171('comum-escudo',.55,.5,'shield');const sh=make171('shield',item.visual.color);if(sh){const hold=new T.Group();hold.add(sh);hold.rotation.set(0,Math.PI/2,0);hold.position.set(.03,0,.02);hold.scale.setScalar(1/m.model.scale.x);m.bones.hand_l.add(hold);m.wnodes.push(hold)}else wait171.add(m)}
      fist162(m,true);aura162(weapon,item.visual.color,item.tier||0,...(heldWeapon.kind155==='staff'?[.32,false,.84]:[isSword163&&sword163?.6:item.visual.shape==='long'?.6:.5]));m.socket.add(weapon);m.wnodes.push(weapon);m.staff174=heldWeapon.kind155==='staff'?weapon:null;m.wmats=weapon.userData.materials||[];m.mats.push(...m.wmats);}
    const add=(slot,bone,pos,scale=1,rot=null)=>{if(!equip[slot])return;const p=global.WarriorEquipment127.armor(T,slot,itemFor(equip[slot]));p.position.fromArray(pos);p.scale.setScalar(scale);if(rot)p.rotation.set(...rot);m.bones[bone].add(p);m.armorParts.push(p);m.mats.push(...(p.userData.materials||[]));};
    // Equipment is added as independent pieces; the approved face remains intact.
    // Armor assets await art review. Keep the approved clothes intact.
    const tint=(slot,key,amount)=>{const it=equip[slot];m.uniforms[key].value.set(it?(it.visual?.color??colors[clamp(it.tier||0,0,9)]):0xffffff);return it?amount:0;};
    m.uniforms.gearAmounts.value.set(0,0,0);
    m.equipmentState={weapon:!!equip.w,weaponShape:m.wnodes[0]?.userData.shape||null,weaponColor:m.wnodes[0]?.userData.color||null,slots:['a','h','g','b'].filter(k=>!!equip[k]),armorParts:m.armorParts.length};
  };
  function curve(keys,t){for(let i=1;i<keys.length;i++){if(t<=keys[i][0]){const a=keys[i-1],b=keys[i],u=clamp((t-a[0])/(b[0]-a[0]),0,1),s=u*u*(3-2*u);return a.slice(1).map((v,j)=>v+(b[j+1]-v)*s)}}return keys[keys.length-1].slice(1);}
  const attack={
    upperarm_r:[[0,-.18,0,-.05],[.20,-1.8,-.3,-.45],[.42,-1.30,.65,.18],[.65,.15,.3,.32],[1,-.18,0,-.05]],
    forearm_r:[[0,-.18,0,0],[.20,-.75,0,0],[.42,-.28,0,0],[.65,-.10,0,0],[1,-.18,0,0]],
    chest:[[0,0,0,0],[.20,.02,-.22,-.035],[.42,.10,.20,.035],[.65,.08,.12,.02],[1,0,0,0]],
    upperarm_l:[[0,-.08,0,.035],[.20,-.25,.1,.2],[.42,-.45,-.1,.22],[.65,-.15,0,.1],[1,-.08,0,.035]]
  };
  API.animate=function(m,st,t,dt){
    if(anim155&&m.mix153&&dt>0){m.body.position.set(0,0,0);m.body.rotation.set(0,0,0);frame155(m,st,dt);m.attackPhase=st.atk>0?st.atk:0;m.root.updateMatrixWorld(true);return}
    const b=m.bones;Object.values(b).forEach(o=>o.rotation.set(0,0,0));m.body.position.set(0,0,0);m.body.rotation.set(0,0,0);
    const move=clamp(st.move||0,0,1),wave=Math.sin(t*9),step=Math.abs(Math.sin(t*9));
    b.upperarm_r.rotation.set(-.18+wave*.20*move,0,-.05);b.upperarm_l.rotation.set(-.08-wave*.24*move,0,.035);b.forearm_r.rotation.x=-.18;b.forearm_l.rotation.x=-.1;
    b.thigh_r.rotation.x=wave*.40*move;b.thigh_l.rotation.x=-wave*.40*move;b.shin_r.rotation.x=Math.max(0,-wave)*.34*move;b.shin_l.rotation.x=Math.max(0,wave)*.34*move;
    b.chest.rotation.x=Math.sin(t*2)*.009;b.cape.rotation.x=Math.sin(t*2.3)*.018+move*.04;b.cape_tail.rotation.x=Math.sin(t*3.4+.5)*.035+move*.045;
    m.body.position.y=step*.025*move+Math.sin(t*2)*.006;
    if(st.atk>0){const phase=clamp(st.atk,0,1);for(const [name,keys] of Object.entries(attack))b[name].rotation.set(...curve(keys,phase));b.head.rotation.y=-b.chest.rotation.y*.65;b.cape_tail.rotation.z=-Math.sin(phase*Math.PI)*.06;m.attackPhase=phase;}else m.attackPhase=0;
    if(st.dead>0){m.body.rotation.x=-1.48*st.dead;m.body.position.y=.2*st.dead;}
    modelMatrices(m);
  };
  // T-pose → relaxed arms, applied in model space before the animation deltas.
  const REST153={upperarm_r:new T.Euler(0,0,1.25),upperarm_l:new T.Euler(0,0,-1.25),forearm_r:new T.Euler(0,0,.15),forearm_l:new T.Euler(0,0,-.15)};
  const q1=new T.Quaternion(),q2=new T.Quaternion(),q3=new T.Quaternion();
  function retarget153(m){if(!m.mix153)return;for(const [k,b] of Object.entries(m.bones)){const bl=b.userData.bindLocal153,bm=b.userData.bindModel153;if(!bl)continue;
    q1.setFromEuler(b.rotation);if(REST153[k])q1.multiply(q2.setFromEuler(REST153[k]));
    // Convert the model-space delta into this bone's local frame, then apply on top of its bind rotation.
    q3.copy(bm).invert().multiply(q1).multiply(bm);b.quaternion.copy(bl).multiply(q3);}}
  API.REST153=REST153;
  function modelMatrices(m){retarget153(m);m.root.updateMatrixWorld(true);}
  // v155 (etapa 3): animações prontas do pacote KayKit (CC0, models/anims.glb) no Viajante.
  // O esqueleto KayKit fica invisível; a cada quadro a rotação de cada osso em relação à pose T
  // é copiada para o osso equivalente do Viajante (as duas poses de repouso são pose T).
  // ?semAnim155 volta para a animação por código.
  // Nomes KayKit (o GLTFLoader tira os pontos: upperarm.l → upperarml) → ossos do Viajante.
  const KAY155={hips:'hips',spine:'spine',chest:'chest',head:'head',upperarml:'upperarm_l',lowerarml:'forearm_l',wristl:'hand_l',upperarmr:'upperarm_r',lowerarmr:'forearm_r',wristr:'hand_r',upperlegl:'thigh_l',lowerlegl:'shin_l',footl:'foot_l',upperlegr:'thigh_r',lowerlegr:'shin_r',footr:'foot_r'};
  // Esqueleto Mixamo (animações feitas no Tripo por texto, models/anim-viajante155.glb) → ossos do Viajante.
  const MIXG155={Hips:'hips',Spine:'spine',Spine2:'chest',Neck:'neck',Head:'head',RightArm:'upperarm_r',RightForeArm:'forearm_r',RightHand:'hand_r',LeftArm:'upperarm_l',LeftForeArm:'forearm_l',LeftHand:'hand_l',RightUpLeg:'thigh_r',RightLeg:'shin_r',RightFoot:'foot_r',LeftUpLeg:'thigh_l',LeftLeg:'shin_l',LeftFoot:'foot_l'};
  const CLIP155={idle:'Idle',correr:'Running_A',golpe1:'1H_Melee_Attack_Slice_Diagonal',golpe2:'1H_Melee_Attack_Chop',golpe3:'1H_Melee_Attack_Stab',esquiva:'Dodge_Forward',dano:'Hit_A',morte:'Death_A'};
  // Trecho útil de cada golpe (início/fim em fração do clipe), para o golpe caber nos ~0,28 s do jogo.
  const WIN155={golpe1:[.08,.75],golpe2:[.08,.75],golpe3:[.08,.75]},WINTRIPO155={golpe1:[0,.7],golpe2:[0,.7],golpe3:[.05,.6],pesado1:[0,.7],pesado2:[0,.75],lanca1:[0,.65],adaga1:[0,.8],adaga2:[0,.8],arco1:[0,.85],arco2:[0,.85],cajado1:[0,.8],cajado2:[0,.8],magia_mao:[0,.8],soco:[0,.75]};
  // Golpe básico por tipo de arma da classe (combo 1-2-3). Clipes que faltarem caem no próximo da lista.
  const ATK155={sword:['golpe1','golpe2','golpe3'],axe:['pesado1','pesado2','golpe3'],mace:['pesado1','pesado2','pesado1'],shield:['pesado1','pesado2','pesado1'],spear:['lanca1','lanca1','pesado2'],dagger:['adaga1','adaga2','adaga1'],bow:['arco1','arco2','arco1'],bow_bare:['arremesso_flecha','adaga2','arremesso_flecha'],staff:['cajado1','cajado2','cajado1'],bonestaff:['cajado1','cajado2','cajado1'],wand:['magia_mao','cajado1','magia_mao'],tome:['magia_mao','magia_mao','cajado2'],orb:['magia_mao','magia_mao','magia_mao'],fist:['soco','soco','golpe3'],claw:['soco','soco','golpe3'],none:['golpe1','golpe2','golpe3']};
  let anim155=null;const BOWROT155=[0,Math.PI/2,0],BOWPOS155=[0,0,0];API.BOWROT155=BOWROT155;const BOWIDLE155=[0,0,0],BOWIDLEPOS155=[.11,0,.04];let BOWPALM155=.08;API.setPalm155=v=>BOWPALM155=v;API.BOWIDLE155=BOWIDLE155;API.BOWIDLEPOS155=BOWIDLEPOS155;API.BOWPOS155=BOWPOS155;
  // v155: arco do Arqueiro (Tripo, referência aprovada) na mão esquerda.
  let bow155=null;API.loadBow=function(url){const L=new T.GLTFLoader();return new Promise(res=>L.load(url,g=>{bow155=g.scene;res(true)},undefined,()=>res(false)))};
  API.loadAnims=function(url){
    if(/semAnim155/.test(location.search))return Promise.resolve(false);
    const L=new T.GLTFLoader();if(global.MeshoptDecoder)L.setMeshoptDecoder(global.MeshoptDecoder);
    return new Promise(res=>L.load(url,g=>{const clips={},tripo=g.animations.some(a=>a.name==='idle');if(tripo)for(const a of g.animations)clips[a.name]=a;else for(const [k,n] of Object.entries(CLIP155)){const c=g.animations.find(a=>a.name===n);if(c)clips[k]=c}
      anim155={scene:g.scene,clips,win:tripo?WINTRIPO155:WIN155,src:tripo?'tripo':'kaykit'};API.anim155src=anim155.src;API.anim155=Object.keys(clips);res(true)},undefined,e=>{console.warn('Animações KayKit não carregaram; usando animação por código.',e);res(false)}));
  };
  const v1=new T.Vector3(),v2=new T.Vector3(),q4=new T.Quaternion(),m4=new T.Matrix4();
  function modelQ(o,inv,out){return out.copy(inv).multiply(o.getWorldQuaternion(q4))}
  function setup155(m){
    const rig=T.SkeletonUtils.clone(anim155.scene);rig.traverse(o=>{if(o.isMesh)o.visible=false});rig.updateMatrixWorld(true);
    const kb={};rig.traverse(o=>{const mx=o.name.replace(/^mixamorig:?/,'');const g=KAY155[o.name]||(mx!==o.name&&MIXG155[mx]);if(g)kb[g]=o});
    m.root.updateMatrixWorld(true);const inv=m.model.getWorldQuaternion(new T.Quaternion()).invert(),minv=new T.Matrix4().copy(m.model.matrixWorld).invert();
    // Pose de repouso do Viajante (antes de qualquer animação): usa a guardada na criação.
    const pairs=[];m.model.traverse(o=>{if(!o.isBone||!o.userData.rest155M||!kb[o.name])return;const k=kb[o.name];
      pairs.push({b:o,k,restB:o.userData.rest155M.clone(),restK:k.getWorldQuaternion(new T.Quaternion())})});
    const hips=pairs.find(p=>p.b.name==='hips');
    const hipH=hips.b.userData.rest155P.y,kayH=hips.k.getWorldPosition(new T.Vector3()).y;
    const mixer=new T.AnimationMixer(rig),act={};for(const [k,c] of Object.entries(anim155.clips))act[k]=mixer.clipAction(c);
    m.a155={rig,pairs,hips,ratio:hipH/kayH,kayRestP:hips.k.getWorldPosition(new T.Vector3()),parentInv:new T.Matrix4().copy(minv.clone().multiply(hips.b.parent.matrixWorld)).invert(),mixer,act,cur:null,state:null,t0:0};
  }
  function play155(A,name,fade,once,restart){const a=A.act[name]||A.act.idle;if(A.cur===a&&!restart)return a;if(A.cur===a){a.reset();return a}if(!A.cur)A.mixer.stopAllAction();else for(const o of Object.values(A.act))if(o!==A.cur&&o!==a)o.stop();a.reset();a.setLoop(once?T.LoopOnce:T.LoopRepeat);a.clampWhenFinished=!!once;a.paused=false;a.timeScale=1;a.play();if(A.cur)A.cur.crossFadeTo(a,fade,false);A.cur=a;return a}
  function frame155(m,st,dt){
    if(!m.a155)setup155(m);const A=m.a155;let a;
    if(st.dead>0)play155(A,'morte',.12,true);
    // Habilidade com animação própria (ex.: Chuva de Flechas com/sem arco), tocada uma vez em ~0,8 s.
    else if(st.skill&&A.act[st.skill]){a=play155(A,st.skill,.06,true,A.state!==st.skill);a.timeScale=a.getClip().duration/.8;A.state=st.skill}
    else if(st.atk>0){const seq=ATK155[st.wep]||ATK155.sword,i=((st.combo||1)-1)%3,key=[seq[i],...seq,'golpe1'].find(k=>A.act[k]);
      // Golpe novo (mesmo tipo repetido) reinicia o clipe.
      const fresh=A.state!==key+st.combo||st.atk<A.lastAtk;A.state=key+st.combo;A.lastAtk=st.atk;a=play155(A,key,.06,true,fresh);a.paused=true;const w=anim155.win[key]||[0,1];a.time=a.getClip().duration*(w[0]+(w[1]-w[0])*st.atk)}
    else if(st.dodge){a=play155(A,'esquiva',.05,true);a.timeScale=a.getClip().duration/.38;A.state='esquiva'}
    else if(st.hit&&A.act.dano){a=play155(A,'dano',.05,true);a.timeScale=a.getClip().duration/.4;A.state='dano'}
    else{A.state=null;if((st.move||0)>.08){a=play155(A,'correr',.15);a.timeScale=.65+.5*Math.min(1,st.move)}else play155(A,'idle',.2)}
    A.mixer.update(dt||0);A.rig.updateMatrixWorld(true);
    m.root.updateMatrixWorld(true);const inv=m.model.getWorldQuaternion(new T.Quaternion()).invert();
    for(const p of A.pairs){
      // delta do KayKit desde a pose T, aplicado sobre a pose T do Viajante, em espaço do modelo.
      const d=p.k.getWorldQuaternion(q1).multiply(q2.copy(p.restK).invert()),target=d.multiply(p.restB);
      p.b.parent.updateWorldMatrix(true,false);const pq=modelQ(p.b.parent,inv,q3);p.b.quaternion.copy(pq.invert().multiply(target));
    }
    // Altura do quadril (agachar, cair ao morrer); sem andar sozinho para os lados.
    const hp=A.hips.k.getWorldPosition(v1).sub(A.kayRestP).multiplyScalar(A.ratio);hp.x=0;hp.z=st.dead>0?hp.z:0;
    A.hips.b.position.copy(v2.copy(A.hips.b.userData.rest155P).add(hp).applyMatrix4(A.parentInv));
    // v168 (Irror): tiro com arco = braço esquerdo esticado para o alvo segurando o arco em pé; mão direita puxa a corda até o rosto.
    if(m.bowHolder155&&(/^arco/.test(A.state||'')||st.atk>0&&/^bow/.test(st.wep||''))){aimPose168(m);const bh2=m.bowHolder155,rq=m.root.getWorldQuaternion(new T.Quaternion()),want=rq.multiply(new T.Quaternion().setFromEuler(new T.Euler(...BOWAIM168)));bh2.parent.updateWorldMatrix(true,false);bh2.quaternion.copy(bh2.parent.getWorldQuaternion(new T.Quaternion()).invert().multiply(want));bh2.position.set(0,0,0);bh2.userData.idle155=false;bh2.userData.aim168=true}
    // v174 (Ian): cajado parado fica em pé na mão (como bastão), não atravessado; no golpe segue a animação de cajado.
    if(m.staff174&&m.staff174.parent){const sw=m.staff174;if(!sw.userData.q174)sw.userData.q174=sw.quaternion.clone();const swinging=/^cajado/.test(A.state||'')&&st.atk>0;
      if(!swinging){m.root.updateMatrixWorld(true);const want=m.model.getWorldQuaternion(new T.Quaternion());sw.quaternion.copy(sw.parent.getWorldQuaternion(new T.Quaternion()).invert().multiply(want))}else sw.quaternion.copy(sw.userData.q174)}
    // Arco fora do tiro: em pé ao lado do corpo, um pouco para fora da mão, sem atravessar braço e perna.
    const bh=m.bowHolder155;if(bh&&bh.parent){const aiming=/^(arco|chuva_com_arco)/.test(A.state||'')||st.atk>0&&/^bow/.test(st.wep||'');
      if(!aiming){m.root.updateMatrixWorld(true);const hand=bh.parent,mq=m.model.getWorldQuaternion(q4).clone(),want=mq.multiply(q1.setFromEuler(new T.Euler(...BOWIDLE155)));
        bh.quaternion.copy(hand.getWorldQuaternion(q2).invert().multiply(want));// Palma = pulso + um pouco na direção antebraço→mão (onde os dedos fecham).
        const hw=hand.getWorldPosition(v1),fa=(m.bones.forearm_l||hand.parent).getWorldPosition(new T.Vector3()),dir=hw.clone().sub(fa).normalize();const wp=hw.clone().addScaledVector(dir,BOWPALM155).add(new T.Vector3(...BOWIDLEPOS155).applyQuaternion(m.model.getWorldQuaternion(q3)));bh.position.copy(hand.worldToLocal(wp));bh.userData.idle155=true}
      else if(bh.userData.idle155){bh.quaternion.copy(bh.userData.aimQ155);bh.position.copy(bh.userData.aimP155);bh.userData.idle155=false}}
  }
  const BOWAIM168=[0,0,0];API.BOWAIM168=BOWAIM168;
  function aimBone168(b,c,dir){if(!b||!c||!b.parent)return;b.updateWorldMatrix(true,true);const bp=b.getWorldPosition(new T.Vector3()),cur=c.getWorldPosition(new T.Vector3()).sub(bp).normalize(),q=new T.Quaternion().setFromUnitVectors(cur,dir.clone().normalize()),wq=b.getWorldQuaternion(new T.Quaternion()),pq=b.parent.getWorldQuaternion(new T.Quaternion());b.quaternion.copy(pq.invert().multiply(q.multiply(wq)))}
  function aimPose168(m){const B=m.bones,rq=m.root.getWorldQuaternion(new T.Quaternion()),F=new T.Vector3(0,0,1).applyQuaternion(rq),U=new T.Vector3(0,1,0),R=new T.Vector3(-1,0,0).applyQuaternion(rq);
    const f=F.clone().addScaledVector(U,.1);aimBone168(B.upperarm_l,B.forearm_l,f);aimBone168(B.forearm_l,B.hand_l,f);
    aimBone168(B.upperarm_r,B.forearm_r,R.clone().multiplyScalar(.8).addScaledVector(F,-.3).addScaledVector(U,.15));aimBone168(B.forearm_r,B.hand_r,R.clone().multiplyScalar(-.6).addScaledVector(F,.8).addScaledVector(U,.12));m.root.updateMatrixWorld(true)}
  global.Warrior127=API;
})(window);
