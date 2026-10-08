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
 /* v291 (Ian): elmos que não encaixavam viram coroas temáticas, modeladas aqui: Necromante (coroa de ossos), Mago do Tempo (diadema-relógio), Tecelão de Fendas (aro com cristais da Fenda). */
 const CROWN291={
  necromante(){const g=new T.Group(),bone=new T.MeshToonMaterial({color:0xe8dcc0}),dark=new T.MeshToonMaterial({color:0x2a1840}),glow=new T.MeshBasicMaterial({color:0x9b5cff});
   const band=new T.Mesh(new T.TorusGeometry(1,.12,6,24),dark);band.rotation.x=Math.PI/2;g.add(band);
   for(let i=0;i<9;i++){const a=i/9*Math.PI*2,h=i%2?.55:.85,sp=new T.Mesh(new T.ConeGeometry(.11,h,5),bone);sp.position.set(Math.sin(a),h/2+.05,Math.cos(a));sp.rotation.z=-Math.sin(a)*.18;sp.rotation.x=Math.cos(a)*.18;g.add(sp)}
   const sk=new T.Group();sk.position.set(0,.22,1.05);const cr=new T.Mesh(new T.SphereGeometry(.26,10,8),bone);cr.scale.set(1,1.05,.8);sk.add(cr);const jaw=new T.Mesh(new T.BoxGeometry(.3,.12,.18),bone);jaw.position.set(0,-.24,0);sk.add(jaw);for(const x of [-.1,.1]){const e=new T.Mesh(new T.SphereGeometry(.065,6,5),glow);e.position.set(x,.03,.2);sk.add(e)}g.add(sk);return g},
  tempo(){const g=new T.Group(),gold=new T.MeshToonMaterial({color:0xd9b25a}),face=new T.MeshToonMaterial({color:0xf3ecd8}),ink=new T.MeshToonMaterial({color:0x2a2a38}),glow=new T.MeshBasicMaterial({color:0x8fe8ff});
   const band=new T.Mesh(new T.TorusGeometry(1,.09,6,28),gold);band.rotation.x=Math.PI/2;g.add(band);
   const clock=new T.Group();clock.position.set(0,.32,1.02);const rim=new T.Mesh(new T.TorusGeometry(.34,.06,6,24),gold);clock.add(rim);const disc=new T.Mesh(new T.CircleGeometry(.32,24),face);disc.position.z=.01;clock.add(disc);
   for(let i=0;i<12;i++){const a=i/12*Math.PI*2,t=new T.Mesh(new T.BoxGeometry(.03,.07,.02),ink);t.position.set(Math.sin(a)*.25,Math.cos(a)*.25,.03);t.rotation.z=-a;clock.add(t)}
   const h1=new T.Mesh(new T.BoxGeometry(.035,.18,.02),ink);h1.position.set(0,.08,.04);clock.add(h1);const h2=new T.Mesh(new T.BoxGeometry(.03,.25,.02),ink);h2.position.set(.08,-.05,.045);h2.rotation.z=2.2;clock.add(h2);g.add(clock);
   const gear=new T.Group();gear.position.set(0,.25,-1.0);const gr=new T.Mesh(new T.TorusGeometry(.24,.06,6,16),gold);gear.add(gr);for(let i=0;i<10;i++){const a=i/10*Math.PI*2,tth=new T.Mesh(new T.BoxGeometry(.08,.1,.06),gold);tth.position.set(Math.sin(a)*.31,Math.cos(a)*.31,0);tth.rotation.z=-a;gear.add(tth)}g.add(gear);
   const halo=new T.Mesh(new T.TorusGeometry(1.25,.025,4,40),glow);halo.rotation.x=Math.PI/2;halo.position.y=.55;g.add(halo);g.userData.spin291=halo;g.userData.spinGear291=gear;return g},
  metamorfo(){const g=new T.Group(),bone=new T.MeshToonMaterial({color:0x3a2a22}),claw=new T.MeshToonMaterial({color:0xe8d8c0}),red=new T.MeshBasicMaterial({color:0xff3b2a});
   const band=new T.Mesh(new T.TorusGeometry(1,.13,6,24),bone);band.rotation.x=Math.PI/2;g.add(band);
   for(const sd of [-1,1]){const h=new T.Mesh(new T.ConeGeometry(.16,1.1,6),claw);h.position.set(sd*.85,.45,-.1);h.rotation.z=-sd*.7;g.add(h)}
   for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2+.26,c=new T.Mesh(new T.ConeGeometry(.08,.38,4),claw);c.position.set(Math.sin(a),.2,Math.cos(a));c.rotation.x=Math.cos(a)*.5;c.rotation.z=-Math.sin(a)*.5;g.add(c)}
   const gem=new T.Mesh(new T.SphereGeometry(.13,8,6),red);gem.position.set(0,.12,1.08);g.add(gem);return g},
  guardiao(){const g=new T.Group(),gold=new T.MeshToonMaterial({color:0xe0b45a}),glow=new T.MeshBasicMaterial({color:0xffdb86});
   for(let i=0;i<14;i++){const a=i/14*Math.PI*2,l=new T.Mesh(new T.TorusGeometry(.17,.05,5,10),gold);l.position.set(Math.sin(a),0,Math.cos(a));l.rotation.y=a;l.rotation.x=i%2?Math.PI/2:0;g.add(l)}
   for(let i=0;i<5;i++){const a=(i-2)*.38,p=new T.Mesh(new T.ConeGeometry(.09,i===2?.6:.38,4),gold);p.position.set(Math.sin(a)*1.02,(i===2?.32:.2),Math.cos(a)*1.02);g.add(p)}
   const gem=new T.Mesh(new T.OctahedronGeometry(.13,0),glow);gem.position.set(0,.68,1.0);g.add(gem);return g},
  artifice(){const g=new T.Group(),iron=new T.MeshToonMaterial({color:0x40464f}),rune=new T.MeshBasicMaterial({color:0x5fe8ff});
   const band=new T.Mesh(new T.TorusGeometry(1,.1,6,28),iron);band.rotation.x=Math.PI/2;g.add(band);
   const gear=(r,x,y,z,ry)=>{const q=new T.Group();q.position.set(x,y,z);q.rotation.y=ry;const rg=new T.Mesh(new T.TorusGeometry(r,.05,5,14),iron);q.add(rg);for(let i=0;i<8;i++){const a=i/8*Math.PI*2,t=new T.Mesh(new T.BoxGeometry(.07,.08,.06),iron);t.position.set(Math.sin(a)*(r+.06),Math.cos(a)*(r+.06),0);t.rotation.z=-a;q.add(t)}const c=new T.Mesh(new T.CircleGeometry(r*.55,10),rune);c.position.z=.02;q.add(c);g.add(q);return q};
   g.userData.spinGear291=gear(.3,0,.32,1.0,0);gear(.2,.75,.25,.7,.8);gear(.2,-.75,.25,.7,-.8);
   for(let i=0;i<8;i++){const a=i/8*Math.PI*2,r=new T.Mesh(new T.BoxGeometry(.05,.14,.02),rune);r.position.set(Math.sin(a)*1.03,.02,Math.cos(a)*1.03);r.rotation.y=a;g.add(r)}return g},
  duelista(){const g=new T.Group(),dark=new T.MeshToonMaterial({color:0x1d1a3a}),blade=new T.MeshToonMaterial({color:0xb8c4ff,emissive:0x3a3fa0});
   const band=new T.Mesh(new T.TorusGeometry(1,.09,6,24),dark);band.rotation.x=Math.PI/2;g.add(band);
   for(let i=0;i<7;i++){const a=(i-3)*.33,h=i===3?.8:.5-Math.abs(i-3)*.05,b=new T.Mesh(new T.ConeGeometry(.07,h,3),blade);b.scale.z=.35;b.position.set(Math.sin(a)*1.0,h/2+.04,Math.cos(a)*1.0);b.rotation.y=a;b.rotation.z=(i-3)*-.12;g.add(b)}
   g.userData.float291=[];return g},
  condutor(){const g=new T.Group(),dark=new T.MeshToonMaterial({color:0x22304a}),bolt=new T.MeshBasicMaterial({color:0x7fd4ff});
   const band=new T.Mesh(new T.TorusGeometry(1,.1,6,24),dark);band.rotation.x=Math.PI/2;g.add(band);
   const zig=(x,z,a,h)=>{const q=new T.Group();q.position.set(x,0,z);q.rotation.y=a;let y=.05;for(let k=0;k<3;k++){const seg=new T.Mesh(new T.BoxGeometry(.06,h/3,.05),bolt);seg.position.set(k%2?.07:-.07,y+h/6,0);seg.rotation.z=k%2?.5:-.5;q.add(seg);y+=h/3}g.add(q)};
   for(let i=0;i<6;i++){const a=i/6*Math.PI*2;zig(Math.sin(a),Math.cos(a),a,i%2?.45:.7)}
   const orb=new T.Mesh(new T.SphereGeometry(.14,10,8),bolt);orb.position.set(0,.15,1.08);g.add(orb);
   const halo=new T.Mesh(new T.TorusGeometry(1.2,.02,4,40),bolt);halo.rotation.x=Math.PI/2;halo.position.y=.5;g.add(halo);g.userData.spin291=halo;return g},
  oraculo(){const g=new T.Group(),gold=new T.MeshToonMaterial({color:0xe8bb4a}),white=new T.MeshToonMaterial({color:0xf8f0dc}),eye=new T.MeshBasicMaterial({color:0x2a1a0a}),glow=new T.MeshBasicMaterial({color:0xfff0a0});
   const band=new T.Mesh(new T.TorusGeometry(1,.09,6,28),gold);band.rotation.x=Math.PI/2;g.add(band);
   for(let i=0;i<11;i++){const a=(i-5)*.2,r=new T.Mesh(new T.ConeGeometry(.04,.55,4),glow);r.position.set(Math.sin(a)*1.0,.35,Math.cos(a)*1.0);r.rotation.x=.25;r.rotation.z=-Math.sin(a)*.6;g.add(r)}
   const e=new T.Group();e.position.set(0,.28,1.05);const w=new T.Mesh(new T.SphereGeometry(.22,12,8),white);w.scale.set(1.4,.8,.5);e.add(w);const ir=new T.Mesh(new T.CircleGeometry(.1,12),gold);ir.position.z=.12;e.add(ir);const pu=new T.Mesh(new T.CircleGeometry(.045,10),eye);pu.position.z=.125;e.add(pu);g.add(e);return g},
  devorador(){const g=new T.Group(),black=new T.MeshToonMaterial({color:0x14101e}),voidm=new T.MeshBasicMaterial({color:0xb34dff});
   const band=new T.Mesh(new T.TorusGeometry(1,.12,6,24),black);band.rotation.x=Math.PI/2;g.add(band);
   for(const sd of [-1,1]){const h=new T.Mesh(new T.ConeGeometry(.15,1.0,6),black);h.position.set(sd*.7,.45,.35);h.rotation.z=-sd*.45;h.rotation.x=-.25;g.add(h)}
   for(let i=0;i<5;i++){const a=(i-2)*.5,sp=new T.Mesh(new T.ConeGeometry(.07,.35,4),black);sp.position.set(Math.sin(a)*1.0,.18,Math.cos(a)*1.0);g.add(sp)}
   const orb=new T.Mesh(new T.SphereGeometry(.18,12,10),voidm);orb.position.set(0,.55,.95);g.add(orb);g.userData.float291=[orb];return g},
  tecelao(){const g=new T.Group(),dark=new T.MeshToonMaterial({color:0x3a2a55}),cry=(window.Crystal310?Crystal310.mat(0xb48cff):new T.MeshToonMaterial({color:0xb48cff,emissive:0x5a2fa0})),glow=new T.MeshBasicMaterial({color:0xc2a2ff});
   const band=new T.Mesh(new T.TorusGeometry(1,.1,6,24),dark);band.rotation.x=Math.PI/2;g.add(band);
   for(let i=0;i<5;i++){const a=(i-2)*.42,c=new T.Mesh(new T.OctahedronGeometry(i===2?.26:.17,0),cry);c.scale.y=1.8;c.position.set(Math.sin(a)*1.05,(i===2?.75:.5)-Math.abs(i-2)*.05,Math.cos(a)*1.05);g.add(c);const th=new T.Mesh(new T.CylinderGeometry(.012,.012,c.position.y,4),glow);th.position.set(c.position.x,c.position.y/2,c.position.z);g.add(th)}
   const gem=new T.Mesh(new T.OctahedronGeometry(.14,0),glow);gem.position.set(0,.05,1.08);g.add(gem);g.userData.float291=g.children.filter(o=>o.geometry&&o.geometry.type==='OctahedronGeometry'&&o!==gem);return g}};
 function crownAttach291(root,item){const id=item.set153;let head=null,headBone=null;root.traverse(o=>{if(!head&&o.name==='tripo_part_6')head=o;if(!headBone&&o.isBone&&o.name==='head')headBone=o});if(!head||!headBone)return false;
  root.updateMatrixWorld(true);const hb=new T.Box3().setFromObject(head),hs=hb.getSize(new T.Vector3()),hc=hb.getCenter(new T.Vector3());
  const c=CROWN291[id](),holder=new T.Group();/* v312: coroas com shaders (metal com reflexo, joias de cristal, partes luminosas com energia) */try{const S=window.Shaders312,K=window.Crystal310;if(S)c.traverse(o=>{if(!o.isMesh||!o.material)return;const m=o.material,g=o.geometry&&o.geometry.type;if(m.userData&&m.userData.crystal310)return;if(K&&/Octahedron|Icosahedron/.test(g||'')){o.material=K.mat(m.color?m.color.getHex():0xb48cff);return}if(m.isMeshBasicMaterial){o.material=S.energy(m.color.getHex(),m.opacity??1);return}if(m.isMeshToonMaterial){o.material=S.metal(m.color.getHex())}})}catch(_){}holder.add(c);holder.name='set153_h';
  const r=Math.max(hs.x,hs.z)*.5;c.scale.setScalar(r*1.05);const top=new T.Vector3(hc.x,hb.max.y-hs.y*.42,hc.z);
  const ws=headBone.getWorldScale(new T.Vector3()).x||1;holder.scale.setScalar(1/ws);holder.position.copy(headBone.worldToLocal(top.clone()));
  const rq=root.getWorldQuaternion(new T.Quaternion()),bq=headBone.getWorldQuaternion(new T.Quaternion());holder.quaternion.copy(bq.invert().multiply(rq));
  headBone.add(holder);const t0=performance.now();const tick=()=>{if(!holder.parent)return;const t=(performance.now()-t0)/1000;if(c.userData.spin291)c.userData.spin291.rotation.z=t*.6;if(c.userData.spinGear291)c.userData.spinGear291.rotation.z=-t*.8;(c.userData.float291||[]).forEach((o,i)=>{o.rotation.y=t*(.8+i*.1);o.position.y+=Math.sin(t*2+i)*.0015});requestAnimationFrame(tick)};tick();return true}
 function refreshOutline323(root){if(root.userData.ol210&&typeof outlineRemove210==='function'&&typeof outlineAdd210==='function'){outlineRemove210(root);outlineAdd210(root)}}
 const token323=it=>[it.uid,it.slot,it.tier||0,it.rar||0,it.set153||''].join(':');
 function helmet323(root,item){
  load('models/equipment323/helmet-F-common.glb').then(src=>{
   if(!(root.userData.set153Tokens||new Set()).has(token323(item)))return;
   if(!src){attach(root,{...item,_skip323:true});return}
   let body=null,head=null;root.traverse(o=>{if(!body&&o.isSkinnedMesh&&/^tripo_part_/.test(o.name))body=o;if(o.name==='tripo_part_6')head=o});if(!body||!head)return;
   const pieces=[];src.traverse(sm=>{if(sm.isSkinnedMesh)pieces.push(sm)});
   const ready=pieces.map(sm=>({sm,bones:sm.skeleton.bones.map(b=>boneOf(root,b.name))}));
   if(!ready.length||ready.some(x=>x.bones.some(b=>!b))){console.warn('Equipment323: incompatible skeleton');return}
   for(const {sm,bones} of ready){
    const mats=(Array.isArray(sm.material)?sm.material:[sm.material]).map(x=>{const m=x.clone();m.skinning=true;m.side=T.DoubleSide;return m});
    const mesh=new T.SkinnedMesh(sm.geometry,Array.isArray(sm.material)?mats:mats[0]);mesh.name='set153_h_reference323';mesh.userData.equipment323=sm.name;
    mesh.position.copy(sm.position);mesh.quaternion.copy(sm.quaternion);mesh.scale.copy(sm.scale);mesh.castShadow=true;mesh.frustumCulled=false;
    body.parent.add(mesh);mesh.updateMatrixWorld(true);mesh.bind(new T.Skeleton(bones,sm.skeleton.boneInverses.map(x=>x.clone())),sm.bindMatrix.clone());
   }
   head.visible=false;root.userData.equipment323HeadHidden=true;refreshOutline323(root);
  });
 }
 /* v336 (Ian aprovou o peitoral v025 em 08/10/2026): armadura Ferro/Comum nova — peitoral com ombreiras, braçais e grevas feitos no corpo do Viajante. Um GLB só; cada malha eq331_<slot>_* é ligada aos ossos do herói pelo nome. Com o peitoral somem também as mangas/capinha e a saia da túnica, que apareciam por baixo. */
 const GAIN332=1,EXTRA332={a:['tripo_part_1','tripo_part_2','tripo_part_11']};
 function armor332(root,item){const slot=item.slot;
  Promise.all([load('models/equipment340/armor-F-common.glb'),load(RIG169.guardiao)]).then(([src,rig])=>{
   if(!(root.userData.set153Tokens||new Set()).has(token323(item)))return;
   if(!src){attach(root,{...item,_skip323:true});return}
   let body=null;root.traverse(o=>{if(!body&&o.isSkinnedMesh&&/^tripo_part_/.test(o.name))body=o});if(!body)return;
   const add=(sm,gain)=>{const bones=sm.skeleton.bones.map(b=>boneOf(root,b.name));if(bones.some(b=>!b))return;
    const mats=(Array.isArray(sm.material)?sm.material:[sm.material]).map(x=>{const m=x.clone();m.skinning=true;m.side=T.DoubleSide;if(gain&&m.color)m.color.multiplyScalar(gain);if(!gain){/* v340: cor igual à referência. Sem mapa normal (o GLB antigo levava a textura de cor como normal e virava mancha), sem metal (não há reflexo de ambiente, só escurecia) e cor base branca. O jogo não aplica gama na saída, por isso a textura entra sem decodificação sRGB. */m.normalMap=null;m.vertexColors=false;m.metalness=0;m.roughness=.8;if(m.color)m.color.setScalar(GAIN332);if(m.map){m.map=m.map.clone();m.map.encoding=T.LinearEncoding;m.map.needsUpdate=true}}return m});
    const mesh=new T.SkinnedMesh(sm.geometry,Array.isArray(sm.material)?mats:mats[0]);mesh.name='set153_'+slot;mesh.userData.equipment332=sm.name;
    mesh.position.copy(sm.position);mesh.quaternion.copy(sm.quaternion);mesh.scale.copy(sm.scale);mesh.castShadow=true;mesh.frustumCulled=false;
    body.parent.add(mesh);mesh.updateMatrixWorld(true);mesh.bind(new T.Skeleton(bones,sm.skeleton.boneInverses.map(x=>x.clone())),sm.bindMatrix.clone())};
   src.traverse(sm=>{if(sm.isSkinnedMesh&&sm.name.startsWith('eq331_'+slot+'_'))add(sm,0)});
   if(slot==='a'){const arms=typeof equippedItems==='function'&&equippedItems().some(it=>it.slot==='g');
    if(rig&&!arms)rig.traverse(sm=>{if(sm.isSkinnedMesh&&sm.name.startsWith('base169_g'))add(sm,1.45)});
    root.traverse(o=>{if(EXTRA332.a.includes(o.name))o.visible=false})}
   refreshOutline323(root);
  });
 }
 function attach(root,item){if(['a','g','b'].includes(item.slot)&&!item.set153&&!item.tint292&&(item.tier||0)===0&&(item.rar||0)===0&&!item._skip323){/* v340: o peitoral já é a casca do torso; o torso-base por baixo atravessava a casca */if(item.slot!=='a')attachRig169(root,item,true);armor332(root,item);return}if(item.slot==='h'&&!item.set153&&(item.tier||0)===0&&(item.rar||0)===0&&!item._skip323){helmet323(root,item);return}if(item.slot==='h'&&CROWN291[item.set153]&&(root.userData.set153Tokens||new Set()).has(token323(item))){if(crownAttach291(root,item))return}/* v290 (Ian): elmos dos conjuntos raros saíam atrás da cabeça ou grandes demais no encaixe do Blender; agora usam o encaixe medido na cabeça, como o elmo comum */if(item.slot!=='w'&&item.slot!=='h'&&item.set153&&RIG169[item.set153]){attachRig169(root,item);if(!(item.slot==='a'&&(NOSLOT181[item.set153]||[]).includes('a')))return;/* v292 (Ian): Condutor não tem peitoral próprio — usa o peitoral comum na cor do conjunto */item={...item,set153:undefined,tint292:0x3a6cff}}
  /* v175 (Ian): peça sem conjunto raro usa a armadura comum do Tripo, pintada com a cor do rank. */const id=item.set153||'comum',slot=item.slot,fit=FIT[slot];/* v289 (Ian): armadura comum também troca a roupa — some a roupa larga daquela parte, aparece o corpo base justo e a peça vai por cima */if(id==='comum'&&BODY289.includes(slot))attachRig169(root,item,true);if(!fit||!root||!(id==='comum'?slot!=='w':HAS165(id,slot)))return;
  const url='models/set153/'+id+'-'+({h:'elmo',a:'peitoral',g:'bracal',b:'greva',w:'arma'})[slot]+'.glb';
  load(url).then(src=>{if(!src||!(root.userData.set153Tokens||new Set()).has(token323(item)))return;
   const bones=SIDES[slot]||[[fit.bone,null]];root.updateMatrixWorld(true);
   bones.forEach(([bn,cn],i)=>{const bone=boneOf(root,bn);if(!bone)return;
    const holder=prepare(src,{...fit,red165:id==='metamorfo',tint171:id==='comum'?(item.tint292||(typeof TIER_COL!=='undefined'&&TIER_COL[Math.max(0,Math.min(9,item.tier||0))])||0xb0b0b8):null}),piece=holder.children[0],ws=bone.getWorldScale(new T.Vector3()).x||1,rootQ=root.getWorldQuaternion(new T.Quaternion());
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
    holder.name='set153_'+slot;bone.add(holder);if(slot==='h'&&id!=='comum'){/* v290: elmo de conjunto do tamanho da cabeça (um pouco maior, para cobrir o cabelo) */let head=null;root.traverse(o=>{if(!head&&o.name==='tripo_part_6')head=o});if(head){root.updateMatrixWorld(true);const hs=new T.Box3().setFromObject(head).getSize(new T.Vector3()),bs=new T.Box3().setFromObject(holder).getSize(new T.Vector3()),want=Math.max(hs.x,hs.z)*1.3,have=Math.max(bs.x,bs.z);if(have>0)holder.scale.multiplyScalar(want/have)}}
    if(slot==='w'&&/^(staff|bonestaff|tome)$/.test(item.kind155||'')&&window.Warrior127&&player?.m?.root===root)Warrior127.registerStaffVisual(player.m,holder);
   });
   if(slot==='w')root.traverse(o=>{if(o.name==='weapon_socket_r')o.visible=false});
  });
 }
 // v169: peças encaixadas no Blender no corpo do Viajante, com pesos copiados do corpo (dobram junto). Ligadas aos ossos do herói pelo nome.
 const RIG169=Object.fromEntries(['metamorfo','necromante','tempo','tecelao','guardiao','artifice','duelista','condutor','oraculo','devorador'].map(id=>[id,'models/set153/'+id+'-rig.glb']));window.SET_RIG169=RIG169;
 function attachRig169(root,item,baseOnly){const slot=item.slot;load(RIG169[baseOnly?'guardiao':item.set153]).then(src=>{if(!src||!(root.userData.set153Tokens||new Set()).has(token323(item)))return;
   let body=null;root.traverse(o=>{if(!body&&o.isSkinnedMesh&&/^tripo_part_/.test(o.name))body=o});if(!body)return;
   const parts=[];src.traverse(o=>{if(o.isSkinnedMesh&&((!baseOnly&&o.name.startsWith('set169_'+slot))||(o.name.startsWith('base169_'+slot)&&!(NOSLOT181[item.set153]||[]).includes(slot))))parts.push(o)}); /* v181: corpo base justo onde a roupa some */
   for(const sm of parts){const bones=sm.skeleton.bones.map(b=>boneOf(root,b.name));if(bones.some(b=>!b))continue;
     const mats=(Array.isArray(sm.material)?sm.material:[sm.material]).map(m=>{const c=m.clone();c.side=T.DoubleSide;if(c.color)c.color.multiplyScalar(1.45);return c});
     const m=new T.SkinnedMesh(sm.geometry,Array.isArray(sm.material)?mats:mats[0]);m.name='set153_'+slot;m.castShadow=true;m.frustumCulled=false;
     m.position.copy(sm.position);m.quaternion.copy(sm.quaternion);m.scale.copy(sm.scale);body.parent.add(m);m.updateMatrixWorld(true);
     m.bind(new T.Skeleton(bones,sm.skeleton.boneInverses.map(x=>x.clone())),sm.bindMatrix.clone())}})}
 // Viajante clothing parts (Tripo segmentation) replaced by armor in the same slot.
 const HIDE={a:['tripo_part_0','tripo_part_3'],h:['tripo_part_6'],g:['tripo_part_1','tripo_part_2'],b:['tripo_part_4']};
 /* v181 (Ian): a armadura substitui a roupa larga do Viajante (mangas, casaco, calça). Onde a roupa some aparece um corpo base justo e escuro (base169_*). Cabeça nunca some (capuzes mostram o rosto). */
 const NOSLOT181={condutor:['a']};const BODY289=['a','g','b'];
 function clothing(root,slots,rig){const R={a:HIDE.a,g:HIDE.g,b:HIDE.b};root.traverse(o=>{if(o.isMesh&&/^tripo_part_/.test(o.name)){o.visible=!Object.entries(rig?R:HIDE).some(([sl,list])=>{if(!slots.includes(sl)||!list.includes(o.name))return false;if(!rig)return true;const it=rig.find(i=>i.slot===sl);return !!it})}})}
 function clear(root){if(root.userData.equipment323HeadHidden){root.traverse(o=>{if(o.name==='tripo_part_6')o.visible=true});delete root.userData.equipment323HeadHidden}const old=[];root.traverse(o=>{if(/^set153_/.test(o.name))old.push(o)});old.forEach(o=>o.parent.remove(o));root.traverse(o=>{if(o.name==='weapon_socket_r')o.visible=true});refreshOutline323(root)}
 function apply(){if(!player||!player.m||!player.m.root||typeof equippedItems!=='function')return;const root=player.m.root,items=equippedItems().filter(it=>it.set153||['h','a','g','b'].includes(it.slot));
  const key=items.map(token323).join('|');if(root.userData.set153Key===key)return;root.userData.set153Key=key;clear(root);
  root.userData.set153Tokens=new Set(items.map(token323));{const swap=items.filter(it=>RIG169[it.set153]||(!it.set153&&BODY289.includes(it.slot)));clothing(root,items.filter(it=>it.set153||BODY289.includes(it.slot)).map(it=>it.slot),swap.length?swap:null)}items.forEach(it=>attach(root,it))}
 setInterval(()=>{try{apply();const r=player&&player.m&&player.m.root;if(r){const w=equippedItems().some(it=>it.set153&&it.slot==='w'&&HAS165(it.set153,'w'));r.traverse(o=>{if(o.name==='weapon_socket_r')o.visible=!w})}}catch(e){console.warn('SetVisual153',e)}},400);
 return {apply,clear,FIT};
})();
