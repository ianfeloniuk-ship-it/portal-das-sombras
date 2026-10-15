/* ================= MODELOS 3D ANIMADOS (KayKit, CC0) ================= */
const MODELS={ok:false,list:{},w:{},anims:[],clips:{},h:{},ready:null};
const MKEYS=['Knight','Rogue','Rogue_Hooded','Mage','Barbarian','Skeleton_Minion','Skeleton_Mage','Skeleton_Rogue','Skeleton_Warrior','necromante-tripo-animado'];
const WKEYS=['sword_1handed','dagger','axe_1handed','staff','crossbow_1handed','shield_round','Skeleton_Blade','Skeleton_Axe','Skeleton_Staff','Skeleton_Shield_Small_A'];
MODELS.ready=new Promise(res=>{
  if(!THREE.GLTFLoader||!THREE.SkeletonUtils){res(false);return}
  const ld=new THREE.GLTFLoader();if(window.MeshoptDecoder)ld.setMeshoptDecoder(MeshoptDecoder);
  const jobs=[['a','anims'],...MKEYS.map(k=>['m',k]),...WKEYS.map(k=>['w',k]),['e','env'],['f','fox']];let n=0,fail=false;
  const fin=()=>{if(++n<jobs.length)return;MODELS.ok=!fail&&MODELS.anims.length>0;res(MODELS.ok)};
  const one=(t,k,g)=>{
    if(t==='f'){MODELS.fox=g;fin();return}
    if(t==='e'){try{envParse(g.scene);envBlades();ENV.ok=true}catch(err){console.warn(err);ENV.ok=false}}
    else if(t==='a')MODELS.anims=g.animations;
    else if(t==='w')MODELS.w[k]=g.scene;
    else{MODELS.list[k]=g.scene;if(k==='necromante-tripo-animado')MODELS.clips[k]=g.animations;const b=new THREE.Box3().setFromObject(g.scene);MODELS.h[k]=b.max.y-b.min.y||2}
    fin()};
  const fk=(t,k)=>(t==='w'?'w_':'')+k;
  const perFile=()=>{for(const [t,k] of jobs)ld.load('models/'+fk(t,k)+'.glb',g=>one(t,k,g),undefined,()=>{if(t!=='e'&&t!=='f')fail=true;fin()})};
  (window.PDS_SITE?Promise.reject(0):fetch('models-pack.json').then(r=>{if(!r.ok)throw 0;return r.json()})).then(p=>{for(const [t,k] of jobs){const b=p[fk(t,k)];if(!b){if(t!=='e'&&t!=='f')fail=true;fin();continue}const s=atob(b),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);ld.parse(u.buffer,'',g=>one(t,k,g),()=>{if(t!=='e'&&t!=='f')fail=true;fin()})}}).catch(perFile);
  setTimeout(()=>{if(n<jobs.length){fail=true;n=jobs.length-1;fin()}},25000);
});
const CLASS_GK=['Knight','Rogue_Hooded','Barbarian','Mage','Rogue','Mage','Mage','necromante-tripo-animado','Mage','Mage','Mage','Mage','Mage','Mage','Knight','Barbarian','Mage','Knight','Mage','Mage','Mage'];
const TINT_K={0x3a2266:.9};/* necromante: tom sombrio forte sobre a textura verde */
const CLASS_TINT=[null,null,null,null,null,0xfff0c0,0x9ff0ff,0x3a2266,0xff5a3a,0x7fd0ff,0xb89060,0xc0a8ff,0x8fe8ff,0xc2a2ff,0xffdb86,0xbfea9c,0x6fe8dd,0xc4b0ff,0xb2dfff,0xffdd9b,0xb98cff];
const ATK_CLIP={sword:'1H_Melee_Attack_Slice_Diagonal',dagger:'Dualwield_Melee_Attack_Slice',axe:'2H_Melee_Attack_Slice',staff:'Spellcast_Shoot',bonestaff:'Spellcast_Shoot',wand:'Spellcast_Shoot',tome:'Spellcast_Shoot',bow:'1H_Ranged_Shoot',none:'1H_Melee_Attack_Chop'};
function wfor(gk,wep,shield){const sk=/^Skeleton/.test(gk);const m={sword:sk?'Skeleton_Blade':'sword_1handed',dagger:sk?'Skeleton_Blade':'dagger',axe:sk?'Skeleton_Axe':'axe_1handed',staff:sk?'Skeleton_Staff':'staff',bonestaff:'Skeleton_Staff',tome:'staff',bow:'crossbow_1handed'};
  const r=m[wep]||null;let l=null;if(wep==='dagger')l=r;if(shield)l=sk?'Skeleton_Shield_Small_A':'shield_round';return[r,l]}
/* ARTE NUM ESTILO SÓ (decisão do Ian: CC0 num estilo só): todo modelo GLB vira material "desenho" (toon) com a mesma rampa de luz do chão,
   e as cores passam por uma paleta comum (leve puxada para o azul do Oráculo). */
const PAL=new THREE.Color(0x9fb4d8);
function toToon(mm,skinned,pal){const t=new THREE.MeshToonMaterial({name:mm.name||'',color:mm.color?mm.color.clone():new THREE.Color(0xffffff),map:mm.map||null,gradientMap:gmap,emissive:mm.emissive?mm.emissive.clone():new THREE.Color(0),transparent:!!mm.transparent,opacity:mm.opacity??1,vertexColors:!!mm.vertexColors,skinning:!!skinned,side:mm.side});if(pal)t.color.lerp(PAL,pal);return t}
function makeActor(o){
  const gk=o.gk,src=MODELS.list[gk];const model=THREE.SkeletonUtils.clone(src);
  const root=new THREE.Group(),body=new THREE.Group();root.add(body);body.add(model);
  const sc=o.scale||1;model.scale.setScalar(2.05/MODELS.h[gk]);body.scale.setScalar(sc);
  const mats=[];
  model.traverse(c=>{if(c.isMesh){envCull(c);const mm=toToon(c.material,c.isSkinnedMesh,.06);if(o.tint!=null&&gk!=='necromante-tripo-animado'){mm.color.lerp(new THREE.Color(o.tint),TINT_K[o.tint]||.6)}if(o.emis)mm.emissive=new THREE.Color(o.emis);mm.roughness=.8;mm.metalness=0;c.material=mm;if(!mats.includes(mm))mats.push(mm)}});
  /* Os modelos KayKit trazem armas embutidas nas mãos (besta, facas, cajado...). Escondemos todas; a arma certa da classe é presa abaixo. */
  /* Algumas classes usam peças embutidas do modelo: Paladino = varinha + livro aberto; Invocador = livro aberto (+ cajado). */
  const keepW={wand:['1H_Wand','Spellbook_open'],tome:['Spellbook_open']}[o.wep]||[];
  model.traverse(c=>{if(c.isMesh&&c.parent&&/^handslot/.test(c.parent.name)&&!keepW.includes(c.name))c.visible=false});
  const wmats=[],wnodes=[];
  const [wr,wl]=wfor(gk,o.wep,o.shield);
  const att=(slot,k)=>{if(!k||!MODELS.w[k])return;const b=model.getObjectByName(slot)||model.getObjectByName(slot.replace('.',''));if(!b)return;const w=MODELS.w[k].clone();w.traverse(c=>{if(c.isMesh){c.material=toToon(c.material,false,.06);if(o.tint!=null&&o.tintW)c.material.color.lerp(new THREE.Color(o.tint),.5);mats.push(c.material);wmats.push(c.material)}});b.add(w);wnodes.push(w)};
  att('handslot.r',wr);att('handslot.l',wl);
  const dummy=()=>{const g=new THREE.Object3D();body.add(g);return g};
  const sh=new THREE.Mesh(geo('shadow',()=>new THREE.CircleGeometry(.55,16)),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.35,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.03;sh.scale.setScalar(sc);root.add(sh);
  return {root,body,model,armL:dummy(),armR:dummy(),legL:dummy(),legR:dummy(),mats,sc,eyeMat:new THREE.MeshBasicMaterial(),glb:true,mixer:new THREE.AnimationMixer(model),act:{},cur:null,customClips:MODELS.clips[gk]||null,atkClip:o.atkClip||(gk==='necromante-tripo-animado'?'chop.001':ATK_CLIP[o.wep]||ATK_CLIP.none),la:0,lw:0,wmats,wnodes};
}
// Articulated CC0 variants replace the static, two-view display meshes.
// Decorations belong to bones, so armor and weapons follow every animation.
function makeArmoredMonster(o){
  const royal=o.mon==='monarca',gold=royal?0xd4b56a:0xd99b29,dark=royal?0x252039:0x29271d;
  const m=makeActor({...o,gk:'Knight',wep:'sword',shield:!royal,tint:null});
  m.model.scale.multiplyScalar((royal?2.8:2.1)/2.05);m.locomotion=true;m.gaitSpeed=3.4*m.sc*(royal?2.8:2.1)/2.05;
  m.model.traverse(c=>{if(!c.isMesh)return;const n=c.name;
    if(/Knight_Cape/.test(n))c.visible=royal;
    if(/^Knight_/.test(n)){if(/Head|Cape/.test(n))c.material.map=null;c.material.color.set(/Head/.test(n)?0x151820:/Cape/.test(n)?0x352759:royal?dark:gold);c.material.needsUpdate=true}
  });
  for(const mt of m.wmats){mt.color.set(gold);mt.map=null;mt.needsUpdate=true}
  const armor=(geometry,color,parent,x,y,z,sx=1,sy=1,sz=1)=>{if(!parent)return null;const mat=toon(color),part=mesh(geometry,mat);part.position.set(x,y,z);part.scale.set(sx,sy,sz);parent.add(part);m.mats.push(mat);return part};
  const head=m.model.getObjectByName('head'),chest=m.model.getObjectByName('chest');
  if(royal){
    armor(geo('royalBand',()=>new THREE.CylinderGeometry(.5,.5,.09,8,true)),gold,head,0,1.14,.02);
    for(let i=0;i<8;i++){const a=i*Math.PI/4;armor(geo('royalTip',()=>new THREE.ConeGeometry(.075,.28,4)),gold,head,Math.sin(a)*.47,1.30,.02+Math.cos(a)*.47)}
    const gem=armor(geo('royalGem',()=>new THREE.OctahedronGeometry(.11)),0x9472ff,chest,0,.03,.23);if(gem){gem.material.emissive.setHex(0x5030bb);gem.material.emissiveIntensity=.7}
  }else{
    const horn=armor(geo('scarabHorn',()=>new THREE.ConeGeometry(.12,.52,6)),gold,head,0,1.43,.15);if(horn)horn.rotation.x=.32;
    for(const side of[-1,1]){const shell=armor(geo('scarabShell',()=>new THREE.SphereGeometry(1,8,6)),gold,chest,side*.16,-.12,-.24,.22,.37,.15);if(shell)shell.rotation.z=side*-.12}
  }
  return m;
}
let ADT=0;
/* monstros de bioma */
const BIOM={vulcao:{p:'Ígneo',c:0xff6a3a,hp:1.1,dmg:1.35,spd:1,gold:1.5},cristal:{p:'Cristalino',c:0x9fe8ff,hp:1.45,dmg:1,spd:.95,gold:1.6},floresta:{p:'Sombrio',c:0x3a5a3a,hp:1.2,dmg:1.15,spd:1.1,gold:1.4,suf:true},neve:{p:'Gélido',c:0x9fd8ff,hp:1.3,dmg:1,spd:.85,gold:1.3},deserto:{p:'das Areias',c:0xe0b060,hp:1,dmg:1.25,spd:1.1,gold:1.3,suf:true},pantano:{p:'do Pântano',c:0x6a8a3a,hp:1.15,dmg:1.1,spd:1,gold:1.3,suf:true}};
function bioMob(e,b){const B=BIOM[b];if(!B||e.isBoss)return;e.hp*=B.hp;e.maxhp*=B.hp;e.dmg*=B.dmg;e.speed=(e.speed||3)*B.spd;e.biomeRewardBalance=1+Math.min(.15,(B.hp*B.dmg-1)*.2);e.name=B.suf?e.name+' '+B.p:e.name+' '+B.p;
  if(e.mats&&!(e.m&&e.m.userRig))for(const m of e.mats)if(m.color)m.color.lerp(new THREE.Color(B.c),.35)}
/* montaria: Lobo de Mana (modelo Fox, CC0/CC-BY) */
function foxMount(){const src=MODELS.fox.scene,model=THREE.SkeletonUtils.clone(src),root=new THREE.Group();root.add(model);
  const b=new THREE.Box3().setFromObject(src),h=b.max.y-b.min.y||1;model.scale.setScalar(1.75/h);
  model.traverse(c=>{if(c.isMesh){envCull(c);c.material=toToon(c.material,c.isSkinnedMesh,0);c.material.color.lerp(new THREE.Color(0x7fb8ff),.55);c.material.emissive=new THREE.Color(0x0a2a50)}});
  const mixer=new THREE.AnimationMixer(model),A={};for(const a of MODELS.fox.animations)A[a.name]=mixer.clipAction(a);return{root,model,mixer,A,cur:null,fox:true}}
function foxAnim(m,mv){const n=mv>.1?(mv>.6?'Run':'Walk'):'Survey';if(m.cur!==n&&m.A[n]){const a=m.A[n];a.reset().play();if(m.cur&&m.A[m.cur])m.A[m.cur].crossFadeTo(a,.2,false);m.cur=n}m.mixer.update(ADT)}
