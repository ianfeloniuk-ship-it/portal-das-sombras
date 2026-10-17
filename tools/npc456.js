/* v456 (Ian): NPCs de verdade na abertura — Edran e os sobreviventes da carroça gerados no Tripo Studio
   (imagem → modelo H3.1 → auto-rig Mixamo → animações do Tripo; deitado/sentado ferido gerados por texto), no lugar dos bonecos KayKit/Blender.
   Cada GLB traz o esqueleto e os clipes; aqui só carregamos, corrigimos a cor (linear → sRGB, sem toToon)
   e escolhemos o clipe pelo estado da figura: caído/sentado, andando ou parado. */
(()=>{
'use strict';
const V='456';
const DEFS={
 edran :{file:'models/npc456/edran456.glb', h:1.84, clips:{idle:'idle',walk:'walk',down:/^A wounded/,push:'lift_heavy'}},
 homem :{file:'models/npc456/sobrevivente-homem456.glb', h:1.76, lieYaw:-Math.PI/2, clips:{idle:'idle',walk:'walk',down:/^A wounded/,scared:'scared_01'}},
 mulher:{file:'models/npc456/sobrevivente-mulher456.glb', h:1.66, lieYaw:Math.PI/2, clips:{idle:'idle',walk:'walk',down:/^A wounded/,scared:'scared_01'}},
};
const cache=new Map(),live=new Set();
function load(id){
 const d=DEFS[id];if(!d)return Promise.resolve(null);
 if(!cache.has(id))cache.set(id,new Promise(res=>{
  const ld=new THREE.GLTFLoader();if(window.MeshoptDecoder)ld.setMeshoptDecoder(MeshoptDecoder);
  ld.load(d.file+'?v='+V,g=>{
   /* trilhas de escala do Tripo são constantes e só custam; tirar evita "esticar" por arredondamento */
   for(const c of g.animations)c.tracks=c.tracks.filter(t=>!/\.scale$/.test(t.name));
   g.scene.updateMatrixWorld(true);
   const box=new THREE.Box3().setFromObject(g.scene);g.h456=Math.max(.01,box.max.y-box.min.y);g.y0456=box.min.y;
   res(g)},undefined,()=>res(null));
 }));
 return cache.get(id);
}
function fixMat(mat){
 if(!mat||mat.userData.npc456)return mat;
 mat.userData.npc456=true;mat.side=THREE.DoubleSide;
 mat.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <encodings_fragment>','#include <encodings_fragment>\ngl_FragColor=LinearTosRGB(gl_FragColor);')};
 mat.customProgramCacheKey=()=>'npc456-linear';
 return mat;
}
/* Ator no mesmo formato dos outros figurantes: {root, body, mats, model}. */
function create(id){
 const d=DEFS[id];const root=new THREE.Group(),body=new THREE.Group();root.add(body);
 const m={root,body,mats:[],model:null,glb:true,npc456:id,actions:{},cur:null,last:null,speed:0};
 load(id).then(g=>{
  if(!g)return;
  const model=THREE.SkeletonUtils.clone(g.scene);const k=d.h/g.h456;model.scale.setScalar(k);model.position.y=-g.y0456*k;
  model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;const l=Array.isArray(o.material)?o.material:[o.material];l.forEach(fixMat);m.mats.push(o.material)}});
  body.add(model);m.model=model;m.mixer=new THREE.AnimationMixer(model);
  for(const [key,name] of Object.entries(d.clips)){const c=g.animations.find(a=>name instanceof RegExp?name.test(a.name):a.name===name);if(c)m.actions[key]=m.mixer.clipAction(c)}
  if(m.actions.push){m.actions.push.setLoop(THREE.LoopRepeat)}
  play(m,want(m),0);
 });
 live.add(m);return m;
}
function play(m,key,fade=.3){
 const a=m.actions[key]||m.actions.idle;if(!a||m.cur===a)return;
 a.reset();a.enabled=true;a.setEffectiveWeight(1);
 /* caído/sentado: clipe feito no Tripo por texto, já começa no chão e repete (respiração) */
 a.play();if(m.cur&&fade>0)m.cur.crossFadeTo(a,fade,false);else if(m.cur)m.cur.stop();
 m.cur=a;m.curKey=key;
}
function want(m){
 const f=m.fig;
 if(f&&f.down)return 'down';
 if(m.force456&&m.actions[m.force456])return m.force456;
 return m.speed>.35?'walk':'idle';
}
function update(dt){
 for(const m of live){
  if(!m.root.parent){if(m.fig&&m.fig.gone456)live.delete(m);continue}
  if(!m.mixer)continue;
  const p=m.root.position;
  if(m.last){const v=Math.hypot(p.x-m.last.x,p.z-m.last.z)/Math.max(dt,1e-3);m.speed+=(Math.min(v,6)-m.speed)*Math.min(1,dt*6)}else m.last=new THREE.Vector3();
  m.last.copy(p);
  m.root.rotation.z=0;m.root.rotation.x=0;
  /* pés no chão: se a cena nasceu antes do relevo carregar, gy() deu 0 e ficavam enterrados */
  try{const gh=(typeof gy==='function'?gy:terrH)(p.x,p.z);if(isFinite(gh))p.y=gh}catch(_){}
  play(m,want(m));
  if(m.curKey==='walk')m.cur.timeScale=Math.max(.6,Math.min(1.6,m.speed/1.4));
  m.mixer.update(Math.min(dt,.1));
 }
}
/* Mesmo gancho por quadro usado no prólogo (intro401): roda depois da câmera, com o dt real. */
(function hook(){
 if(typeof camUpdate!=='function'){setTimeout(hook,300);return}
 const prev=camUpdate;camUpdate=function(dt){prev.apply(this,arguments);try{update(dt||.016)}catch(_){}};
})();
window.NPC456={DEFS,load,create,play,live,
 /* figurante da campanha: liga a figura ao ator para saber se está caído */
 figure(id,fig){fig.m.fig=fig;return fig},
 preload(){Object.keys(DEFS).forEach(load)}};
})();
