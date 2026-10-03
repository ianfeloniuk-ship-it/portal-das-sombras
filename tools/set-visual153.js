/* v153: visible rare-class set pieces. Each equipped set item loads its own Tripo mesh and is
   attached to the matching bone, so pieces from different sets can be mixed on your own character. */
window.SetVisual153=(()=>{
 const T=THREE,cache=new Map(),SIDES={g:[['forearm_r','hand_r'],['forearm_l','hand_l'],['upperarm_r','forearm_r'],['upperarm_l','forearm_l']],b:[['shin_r','foot_r'],['shin_l','foot_l'],['thigh_r','shin_r'],['thigh_l','shin_l']]};
 // World-space fit measured on the 2.05 m character: shoulders .50, forearm .32, shin .39, head ~.30 wide.
 // by = which axis of the piece is matched to `size` (x = width, len = longest side along the limb).
 const FIT={h:{bone:'head',size:.40,by:'x',lift:.07,fwd:.01,upright:true},a:{bone:'chest',size:.80,by:'x',lift:-.05,fwd:.06,upright:true},
  g:{fill:.95,by:'len',along:.5},b:{fill:.95,by:'len',along:.5},w:{bone:'hand_r',size:.42,by:'len',along:.14,child:null,forward:true}};
 const SETS165=['metamorfo','necromante','tempo','tecelao','guardiao','artifice','duelista','condutor','oraculo','devorador'],WEAP165=['metamorfo','necromante','tecelao'];
 const HAS165=(id,slot)=>(window.SET_MODELS165||SETS165).includes(id)&&(slot!=='w'||WEAP165.includes(id));
 function load(url){if(!cache.has(url))cache.set(url,new Promise(res=>new T.GLTFLoader().load(url,g=>res(g.scene),undefined,()=>res(null))));return cache.get(url)}
 function longestAxis(box){const s=box.getSize(new T.Vector3());return s.x>=s.y&&s.x>=s.z?'x':s.y>=s.z?'y':'z'}
 function boneOf(root,name){let b=null;root.traverse(o=>{if(!b&&o.isBone&&o.name===name)b=o});return b}
 function prepare(src,fit){
  const piece=src.clone(true),red165=fit.red165;piece.traverse(o=>{if(o.isMesh){o.castShadow=true;const m=o.material=o.material.clone();m.metalness=Math.min(m.metalness,.25);m.roughness=Math.max(m.roughness,.55);
    // Tripo albedo is very dark under the game light; lift it and let the crimson veins glow so the piece reads from the top-down camera.
    if(fit.tint171!=null){m.color.setHex(fit.tint171).multiplyScalar(1.15)}else m.color.setScalar(red165?1.7:1.25);m.side=T.DoubleSide;
    if(red165)m.onBeforeCompile=sh=>{sh.fragmentShader=sh.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
      float l153=dot(diffuseColor.rgb,vec3(.299,.587,.114));diffuseColor.rgb=max(vec3(0.),mix(vec3(l153),diffuseColor.rgb,1.75));`).replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
      #ifdef USE_MAP
      vec3 t153=texture2D(map,vUv).rgb;float red153=smoothstep(.06,.30,t153.r-max(t153.g,t153.b));totalEmissiveRadiance+=vec3(.9,.05,.04)*red153*1.1;
      #endif`)};if(red165)m.customProgramCacheKey=()=> 'set153-color'}});
  const box=new T.Box3().setFromObject(piece),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());
  const holder=new T.Group();piece.position.sub(center);holder.add(piece);
  const axis=longestAxis(box),len=Math.max(size.x,size.y,size.z);
  holder.userData={axis,len,size};return holder}
 function attach(root,item){if(item.slot!=='w'&&item.set153&&RIG169[item.set153]){attachRig169(root,item);return}
  /* v175 (Ian): peça sem conjunto raro usa a armadura comum do Tripo, pintada com a cor do rank. */const id=item.set153||'comum',slot=item.slot,fit=FIT[slot];if(!fit||!root||!(id==='comum'?slot!=='w':HAS165(id,slot)))return;
  const url='models/set153/'+id+'-'+({h:'elmo',a:'peitoral',g:'bracal',b:'greva',w:'arma'})[slot]+'.glb';
  load(url).then(src=>{if(!src||!(root.userData.set153Tokens||new Set()).has(item.uid+slot))return;
   const bones=SIDES[slot]||[[fit.bone,null]];root.updateMatrixWorld(true);
   bones.forEach(([bn,cn],i)=>{const bone=boneOf(root,bn);if(!bone)return;
    const holder=prepare(src,{...fit,red165:id==='metamorfo',tint171:id==='comum'?((typeof TIER_COL!=='undefined'&&TIER_COL[Math.max(0,Math.min(9,item.tier||0))])||0xb0b0b8):null}),piece=holder.children[0],ws=bone.getWorldScale(new T.Vector3()).x||1,rootQ=root.getWorldQuaternion(new T.Quaternion());
    let q=rootQ.clone();
    if(!fit.upright){
     // Point the piece's longest axis along the limb (bone → child bone) in the current pose.
     const child=cn?boneOf(root,cn):null,a=bone.getWorldPosition(new T.Vector3());
     let dir;if(child)dir=child.getWorldPosition(new T.Vector3()).sub(a).normalize();else{dir=new T.Vector3(0,0,1).applyQuaternion(rootQ)}
     const from=holder.userData.axis==='x'?new T.Vector3(1,0,0):holder.userData.axis==='y'?new T.Vector3(0,1,0):new T.Vector3(0,0,1);
     q=new T.Quaternion().setFromUnitVectors(from.applyQuaternion(rootQ),dir).multiply(rootQ);
     if(/_l$/.test(bn))piece.scale.x*=-1;
     const seg=child?child.getWorldPosition(new T.Vector3()).distanceTo(a):.3;holder.userData.seg=seg;holder.userData.offset=dir.clone().multiplyScalar(seg*fit.along);
    }
    const target=fit.fill?fit.fill*(holder.userData.seg||.3):fit.size,ref=fit.by==='x'?holder.userData.size.x:holder.userData.len,s=target/ref/ws;holder.scale.setScalar(s);
    // Convert the desired world rotation into the bone's local space.
    const boneQ=bone.getWorldQuaternion(new T.Quaternion());holder.quaternion.copy(boneQ.invert().multiply(q));
    const off=(holder.userData.offset||new T.Vector3(0,fit.lift||0,0).add(new T.Vector3(0,0,fit.fwd||0).applyQuaternion(rootQ))).clone().divideScalar(ws);
    holder.position.copy(off.applyQuaternion(bone.getWorldQuaternion(new T.Quaternion()).invert()));
    holder.name='set153_'+slot;bone.add(holder);
   });
   if(slot==='w')root.traverse(o=>{if(o.name==='weapon_socket_r')o.visible=false});
  });
 }
 // v169: peças encaixadas no Blender no corpo do Viajante, com pesos copiados do corpo (dobram junto). Ligadas aos ossos do herói pelo nome.
 const RIG169={metamorfo:'models/set153/metamorfo-rig.glb'};window.SET_RIG169=RIG169;
 function attachRig169(root,item){const slot=item.slot;load(RIG169[item.set153]).then(src=>{if(!src||!(root.userData.set153Tokens||new Set()).has(item.uid+slot))return;
   let body=null;root.traverse(o=>{if(!body&&o.isSkinnedMesh&&/^tripo_part_/.test(o.name))body=o});if(!body)return;
   const parts=[];src.traverse(o=>{if(o.isSkinnedMesh&&o.name.startsWith('set169_'+slot))parts.push(o)});
   for(const sm of parts){const bones=sm.skeleton.bones.map(b=>boneOf(root,b.name));if(bones.some(b=>!b))continue;
     const mats=(Array.isArray(sm.material)?sm.material:[sm.material]).map(m=>{const c=m.clone();c.side=T.DoubleSide;if(c.color)c.color.multiplyScalar(1.45);return c});
     const m=new T.SkinnedMesh(sm.geometry,Array.isArray(sm.material)?mats:mats[0]);m.name='set153_'+slot;m.castShadow=true;m.frustumCulled=false;
     m.position.copy(sm.position);m.quaternion.copy(sm.quaternion);m.scale.copy(sm.scale);body.parent.add(m);m.updateMatrixWorld(true);
     m.bind(new T.Skeleton(bones,sm.skeleton.boneInverses.map(x=>x.clone())),sm.bindMatrix.clone())}})}
 // Viajante clothing parts (Tripo segmentation) replaced by armor in the same slot.
 const HIDE={a:['tripo_part_0','tripo_part_3'],h:['tripo_part_6'],g:['tripo_part_1','tripo_part_2'],b:['tripo_part_4']};
 function clothing(root,slots,rig){root.traverse(o=>{if(o.isMesh&&/^tripo_part_/.test(o.name)){o.visible=!Object.entries(rig?{h:['tripo_part_6']}:HIDE).some(([sl,list])=>slots.includes(sl)&&list.includes(o.name))}})}
 function clear(root){const old=[];root.traverse(o=>{if(/^set153_/.test(o.name))old.push(o)});old.forEach(o=>o.parent.remove(o));root.traverse(o=>{if(o.name==='weapon_socket_r')o.visible=true})}
 function apply(){if(!player||!player.m||!player.m.root||typeof equippedItems!=='function')return;const root=player.m.root,items=equippedItems().filter(it=>it.set153||['h','a','g','b'].includes(it.slot));
  const key=items.map(it=>it.uid+it.slot).join('|');if(root.userData.set153Key===key)return;root.userData.set153Key=key;clear(root);
  root.userData.set153Tokens=new Set(items.map(it=>it.uid+it.slot));clothing(root,items.filter(it=>it.set153).map(it=>it.slot),items.some(it=>RIG169[it.set153]));items.forEach(it=>attach(root,it))}
 setInterval(()=>{try{apply();const r=player&&player.m&&player.m.root;if(r){const w=equippedItems().some(it=>it.set153&&it.slot==='w'&&HAS165(it.set153,'w'));r.traverse(o=>{if(o.name==='weapon_socket_r')o.visible=!w})}}catch(e){console.warn('SetVisual153',e)}},400);
 return {apply,clear,FIT};
})();
