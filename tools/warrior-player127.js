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
  API.create=function(options){
    const model=T.SkeletonUtils.clone(asset.scene),root=new T.Group(),body=new T.Group();root.add(body);body.add(model);
    model.scale.setScalar(SCALE);model.position.y=.501893*SCALE;
    const uniforms={gearArmor:{value:new T.Color(1,1,1)},gearGloves:{value:new T.Color(1,1,1)},gearBoots:{value:new T.Color(1,1,1)},gearAmounts:{value:new T.Vector3()}};
    const mats=[],bones={};model.traverse(o=>{if(o.isBone)bones[o.name]=o;if(o.isMesh)mats.push(setupMaterial(o,uniforms,options.legacyLinearOutput));});
    const socket=new T.Group();socket.name='weapon_socket_r';socket.position.set(.002,0,.004);socket.rotation.set(2.05,0,0);bones.hand_r.add(socket);
    const armorGroup=new T.Group();armorGroup.name='equipment_layers';model.add(armorGroup);
    const shadow=new T.Mesh(new T.CircleGeometry(.45,24),new T.MeshBasicMaterial({color:0,transparent:true,opacity:.23,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.025;root.add(shadow);
    const m={root,body,model,bones,uniforms,mats,wmats:[],wnodes:[],socket,armorParts:[],baseMaterials:mats.slice(),warrior127:true,glb:true,sc:1,armL:bones.upperarm_l,armR:bones.upperarm_r,legL:bones.thigh_l,legR:bones.thigh_r,eyeMat:new T.MeshBasicMaterial(),gearSignature:null,attackPhase:0};
    m.defaultWeapon=options.defaultWeapon||null;API.gear(m,options.equip||{},options);API.animate(m,{move:0,atk:0,dead:0},0,0);return m;
  };
  function disposePart(part){part.traverse(o=>{if(o.isMesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});part.removeFromParent?part.removeFromParent():part.parent&&part.parent.remove(part);}
  API.gear=function(m,equip,options){
    options=options||{};const colors=options.tierColors||[0x9a9aa0,0xd0d8e0,0x7fd8ff,0xb18cff,0xff6a3a,0x3a3048,0xd02040,0xffd070,0xffda9f,0xf4f0ff];
    const signature=JSON.stringify(['w','a','h','g','b'].map(k=>{const i=equip[k];return i?[k,i.uid,i.tier,i.rar,i.visual,i.visualWeapon]:[k,null]}));
    if(signature===m.gearSignature)return;m.gearSignature=signature;
    for(const p of m.wnodes)disposePart(p);for(const p of m.armorParts)disposePart(p);m.wnodes=[];m.armorParts=[];m.wmats=[];m.mats=m.baseMaterials.slice();
    const itemFor=it=>{if(!it)return null;return {...it,visual:{...it.visualWeapon,...it.visual,color:it.visual?.color??colors[clamp(it.tier||0,0,9)]}}};
    const heldWeapon=equip.w||m.defaultWeapon;if(heldWeapon){const item=itemFor(heldWeapon);if(!item.visual.shape)item.visual.shape=API.visualWeapon(item.tier||0,'sword').shape;const weapon=global.WarriorEquipment127.weapon(T,item);m.socket.add(weapon);m.wnodes.push(weapon);m.wmats=weapon.userData.materials||[];m.mats.push(...m.wmats);}
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
  function modelMatrices(m){m.root.updateMatrixWorld(true);}
  global.Warrior127=API;
})(window);
