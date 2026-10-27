/* ===== Monstros animados (Quaternius, CC0) — carregam em segundo plano; até lá o monstro usa o esqueleto KayKit ===== */
// Three r128 Box3 measures undeformed geometry, not the rendered skinned pose.
function monsterBounds132(root){
 root.updateMatrixWorld(true);
 const box=new THREE.Box3(),p=new THREE.Vector3(),base=new THREE.Vector3(),out=new THREE.Vector3(),tmp=new THREE.Vector3(),mat=new THREE.Matrix4();
 const read=(a,i,k)=>{const data=a.isInterleavedBufferAttribute?a.data.array:a.array,idx=a.isInterleavedBufferAttribute?i*a.data.stride+a.offset+k:i*a.itemSize+k;let v=data[idx];if(a.normalized){const div=data instanceof Int8Array?127:data instanceof Uint8Array?255:data instanceof Int16Array?32767:data instanceof Uint16Array?65535:data instanceof Int32Array?2147483647:4294967295;v=Math.max(-1,v/div)}return v};
 root.traverse(m=>{if(!m.isMesh)return;const a=m.geometry.attributes,position=a.position;if(!position)return;if(m.isSkinnedMesh)m.skeleton.update();
  for(let i=0;i<position.count;i++){
   p.set(read(position,i,0),read(position,i,1),read(position,i,2));
   if(m.isSkinnedMesh){base.copy(p).applyMatrix4(m.bindMatrix);out.set(0,0,0);for(let k=0;k<4;k++){const weight=read(a.skinWeight,i,k);if(!weight)continue;const joint=read(a.skinIndex,i,k);mat.fromArray(m.skeleton.boneMatrices,joint*16);tmp.copy(base).applyMatrix4(mat);out.addScaledVector(tmp,weight)}p.copy(out).applyMatrix4(m.bindMatrixInverse)}
   box.expandByPoint(p.applyMatrix4(m.matrixWorld));
  }
 });return box;
}

const MON={list:{},clips:{},h:{}};
const MON_DEF={/* h = altura em metros no jogo; a = nomes das animações (sufixo) */
  goblin:{h:1.5,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve'}},
  orc:{h:2.3,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Weapon',Hit:'HitReact'}},
  aranha:{h:.75,a:{Idle:'Spider_Idle',Running_A:'Spider_Walk',Death_A:'Spider_Death',ATK:'Spider_Attack'}},
  lobo:{h:1.3,a:{Idle:'Idle',Running_A:'Gallop',Death_A:'Death',ATK:'Attack',Hit:'Idle_HitReact_Left'}},
  demonio:{h:2.3,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Weapon',Hit:'HitReact'}},
  raptor:{h:1.9,a:{Idle:'Velociraptor_Idle',Running_A:'Velociraptor_Run',Death_A:'Velociraptor_Death',ATK:'Velociraptor_Attack'}},
  dragao:{h:3.4,a:{Idle:'Dragon_Flying',Running_A:'Dragon_Flying',Death_A:'Dragon_Death',ATK:'Dragon_Attack',Hit:'Dragon_Hit'}},
  gigante:{h:3.6,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve'}},
  yeti:{h:2.6,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Punch',Hit:'HitReact'}},
  vespa:{h:1.4,a:{Idle:'Wasp_Flying',Running_A:'Wasp_Flying',Death_A:'Wasp_Death',ATK:'Wasp_Attack'}},
  slime:{h:1.0,a:{Idle:'Idle',Running_A:'Walk',Death_A:'Death',ATK:'Bite_Front',Hit:'HitRecieve'}},
  gosma:{h:1.0,a:{Idle:'Idle',Running_A:'Walk',Death_A:'Death',ATK:'Bite_Front',Hit:'HitRecieve',Split:'Split',Merge:'Merge'}},
 gosma_part0:{h:1.0,a:{Idle:'Idle',Running_A:'Walk',Death_A:'Death',ATK:'Bite_Front',Hit:'HitRecieve'}},
 gosma_part1:{h:0.5334072269033641,a:{Idle:'Idle',Running_A:'Walk',Death_A:'Death',ATK:'Bite_Front',Hit:'HitRecieve'}},
 gosma_part2:{h:0.44590008025988936,a:{Idle:'Idle',Running_A:'Walk',Death_A:'Death',ATK:'Bite_Front',Hit:'HitRecieve'}},
  cogu:{h:1.0,a:{Idle:'Idle',Running_A:'Walk',Death_A:'Death',ATK:'Spore',Hit:'HitRecieve',Spore:'Spore'}},
  passaro:{h:1.1,a:{Idle:'Idle',Running_A:'Flight',Death_A:'Death',ATK:'Dive',Hit:'HitRecieve',Flight:'Flight',Takeoff:'Takeoff',Dive:'Dive',Recover:'Recover',Land:'Land',Glide:'Glide'}},
  espinhosa:{h:1.2,a:{Idle:'Idle',Sense:'Sense',Running_A:'Walk',Death_A:'Death',ATK:'Fire',Hit:'HitRecieve',Windup:'Windup',Fire:'Fire',Regrow:'Regrow',HitRecieve:'HitRecieve'}},
  cactinho:{h:1.2,a:{Idle:'Idle',Running_A:'Walk',Death_A:'Death',ATK:'Bite_Front',Hit:'HitRecieve'}},
  magote:{h:0.457,a:{Idle:'Idle',Running_A:'Walk',Walk:'Walk',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve',HitRecieve:'HitRecieve',Alert:'Alert',Windup:'Prep',Prep:'Prep',Attack:'Attack',Recover:'Recover'}},
  orcinho:{h:1.2,a:{Idle:'Idle',Running_A:'Walk',Death_A:'Death',ATK:'Bite_Front',Hit:'HitRecieve'}},
  ninjinha:{h:1.1,a:{Idle:'Idle',Running_A:'Walk',Death_A:'Death',ATK:'Bite_Front',Hit:'HitRecieve'}},
  visitante:{h:1.2,a:{Idle:'Idle',Running_A:'Walk',Death_A:'Death',ATK:'Bite_Front',Hit:'HitRecieve'}},
  yetinho:{h:1.2,a:{Idle:'Idle',Running_A:'Walk',Death_A:'Death',ATK:'Bite_Front',Hit:'HitRecieve'}},
  peixinho:{h:1.1,a:{Idle:'Idle',Running_A:'Walk',Death_A:'Death',ATK:'Bite_Front',Hit:'HitRecieve'}},
  fantasma:{h:1.6,a:{Idle:'Flying_Idle',Running_A:'Fast_Flying',Death_A:'Death',ATK:'Headbutt',Hit:'HitReact'}},
  abelha:{h:1.4,a:{Idle:'Flying_Idle',Running_A:'Fast_Flying',Death_A:'Death',ATK:'Headbutt',Hit:'HitReact'}},
  glub:{h:1.5,a:{Idle:'Flying_Idle',Running_A:'Fast_Flying',Death_A:'Death',ATK:'Headbutt',Hit:'HitReact'}},
  golenzinho:{h:1.6,a:{Idle:'Flying_Idle',Running_A:'Fast_Flying',Death_A:'Death',ATK:'Headbutt',Hit:'HitReact'}},
  cogufuria:{h:1.5,a:{Idle:'Idle',Running_A:'Walk',Death_A:'Death',ATK:'Bite_Front',Hit:'HitRecieve'}},
  sapo:{h:1.9,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Weapon',Hit:'HitReact'}},
  coelho:{h:1.8,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Weapon',Hit:'HitReact'}},
  caveira:{h:1.7,a:{Idle:'Flying_Idle',Running_A:'Fast_Flying',Death_A:'Death',ATK:'Headbutt',Hit:'HitReact'}},
  redemoinho:{h:1.7,a:{Idle:'Flying_Idle',Running_A:'Fast_Flying',Death_A:'Death',ATK:'Headbutt',Hit:'HitReact'}},
  mono:{h:2.0,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Weapon',Hit:'HitReact'}},
  ninja:{h:2.0,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Weapon',Hit:'HitReact'}},
  cactogig:{h:2.3,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Weapon',Hit:'HitReact'}},
  homempeixe:{h:2.1,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Weapon',Hit:'HitReact'}},
  alpaca:{h:1.8,a:{Idle:'Flying_Idle',Running_A:'Fast_Flying',Death_A:'Death',ATK:'Headbutt',Hit:'HitReact'}},
  abelharainha:{h:1.8,a:{Idle:'Flying_Idle',Running_A:'Fast_Flying',Death_A:'Death',ATK:'Headbutt',Hit:'HitReact'}},
  glubancio:{h:1.9,a:{Idle:'Flying_Idle',Running_A:'Fast_Flying',Death_A:'Death',ATK:'Headbutt',Hit:'HitReact'}},
  golempedra:{h:2.6,a:{Idle:'Flying_Idle',Running_A:'Fast_Flying',Death_A:'Death',ATK:'Headbutt',Hit:'HitReact'}},
  lula:{h:1.9,a:{Idle:'Flying_Idle',Running_A:'Fast_Flying',Death_A:'Death',ATK:'Headbutt',Hit:'HitReact'}},
  invasor:{h:2.1,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Weapon',Hit:'HitReact'}},
  dino:{h:2.4,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Punch',Hit:'HitReact'}},
  diabrete:{h:1.7,a:{Idle:'Flying_Idle',Running_A:'Fast_Flying',Death_A:'Death',ATK:'Headbutt',Hit:'HitReact'}},
  tribal:{h:2.0,a:{Idle:'Flying_Idle',Running_A:'Fast_Flying',Death_A:'Death',ATK:'Headbutt',Hit:'HitReact'}},
  alpacaimp:{h:2.2,a:{Idle:'Flying_Idle',Running_A:'Fast_Flying',Death_A:'Death',ATK:'Headbutt',Hit:'HitReact'}},
  chifrudo:{h:2.5,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Weapon',Hit:'HitReact'}},
  reicogu:{h:2.8,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Weapon',Hit:'HitReact'}},
  dragonete:{h:2.4,a:{Idle:'Flying_Idle',Running_A:'Fast_Flying',Death_A:'Death',ATK:'Headbutt',Hit:'HitReact'}},
  dragaoancio:{h:3.2,a:{Idle:'Flying_Idle',Running_A:'Fast_Flying',Death_A:'Death',ATK:'Headbutt',Hit:'HitReact'}},
  gato:{h:0.7,a:{Idle:'Idle',Running_A:'Walk',Death_A:'Death',ATK:'Bite_Front',Hit:'HitRecieve'}},
  galinha:{h:0.6,a:{Idle:'Idle',Running_A:'Walk',Death_A:'Death',ATK:'Bite_Front',Hit:'HitRecieve'}},
  escaravelho:{h:2.1,a:{Idle:'Idle',Running_A:'Walk',Walk:'Walk',Death_A:'Death',ATK:'Charge',Hit:'HitRecieve',HitRecieve:'HitRecieve',Windup:'Windup',Charge:'Charge',Impact:'Impact',Recover:'Recover'}},monarca:{h:2.8,actor:true},guardiao:{h:2,a:{Idle:'Idle',Running_A:'Walk',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve',HitRecieve:'HitRecieve',Wake:'Wake',Walk:'Walk',Windup:'Windup',Attack:'Attack',Recover:'Recover'}},
  pombo:{h:0.5,a:{Idle:'Idle',Running_A:'Walk',Death_A:'Death',ATK:'Bite_Front',Hit:'HitRecieve'}}};
MON_DEF.user_goblin_guerreiro={h:1.55,file:'goblin-guerreiro',userRig:true,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve'}};
MON_DEF.user_goblin_arqueiro={h:1.5,file:'goblin-arqueiro',userRig:true,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve'}};
MON_DEF.user_goblin_xama={h:1.55,file:'goblin-xama',userRig:true,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve'}};
MON_DEF.user_goblin_bruto={h:1.65,file:'goblin-bruto',userRig:true,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve'}};
MON_DEF.user_orc={h:2.25,file:'orc',userRig:true,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve'}};
MON_DEF.user_yeti={h:2.6,file:'yeti',userRig:true,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve'}};
MON_DEF.user_golem_pedra={h:2.6,file:'golem-pedra',userRig:true,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve'}};
MON_DEF.user_gigante_pedra={h:3.4,file:'gigante-pedra',userRig:true,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve'}};
MON_DEF.user_golem_madeira={h:2.5,file:'golem-madeira',userRig:true,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve'}};
MON_DEF.user_yeti_corrompido={h:3.0,file:'yeti-corrompido',userRig:true,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve'}};
MON_DEF.user_berserker_rubro={h:2.2,file:'berserker-rubro',userRig:true,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve'}};
MON_DEF.user_cavaleiro_carmesim={h:2.2,file:'cavaleiro-carmesim',userRig:true,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve'}};
MON_DEF.user_rei_oco={h:2.8,file:'rei-oco',userRig:true,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve'}};
MON_DEF.user_dragao_kaelthys={h:3.4,file:'dragao-kaelthys',userRig:true,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve'}};
MON_DEF.cactinho.a={Idle:'Idle',Rooted:'Rooted',Walk:'Walk',Running_A:'Walk',Windup:'Windup',Fire:'Fire',Recover:'Recover',ATK:'Fire',Hit:'HitRecieve',HitRecieve:'HitRecieve',Death_A:'Death'};
MON_DEF.cactinho_f={h:1.2,a:{...MON_DEF.cactinho.a}};MON_DEF.cactinho_a={h:1.4/1.15,a:{...MON_DEF.cactinho.a}};
MON_DEF.guardiao_f={h:2,a:{...MON_DEF.guardiao.a}};MON_DEF.guardiao_a={h:2,a:{...MON_DEF.guardiao.a}};
MON_DEF.escaravelho_f={h:2.1,a:{...MON_DEF.escaravelho.a}};MON_DEF.escaravelho_a={h:2.1,a:{...MON_DEF.escaravelho.a}};
MON_DEF.slime_f={h:1,a:{...MON_DEF.slime.a}};MON_DEF.slime_a={h:1,a:{...MON_DEF.slime.a}};
MON_DEF.gosma_f={h:1,a:{...MON_DEF.gosma.a}};
MON_DEF.gosma_a={h:1,a:{...MON_DEF.gosma.a}};
MON_DEF.gosma_part0={h:1.0,a:{...MON_DEF.gosma.a}};
MON_DEF.gosma_part1={h:0.5334072269033641,a:{...MON_DEF.gosma.a}};
MON_DEF.gosma_part2={h:0.44590008025988936,a:{...MON_DEF.gosma.a}};
MON_DEF.gosma_f_part0={h:1.0,a:{...MON_DEF.gosma.a}};
MON_DEF.gosma_f_part1={h:0.580231579951942,a:{...MON_DEF.gosma.a}};
MON_DEF.gosma_f_part2={h:0.5405333559028804,a:{...MON_DEF.gosma.a}};
MON_DEF.gosma_a_part0={h:1.0,a:{...MON_DEF.gosma.a}};
MON_DEF.gosma_a_part1={h:0.8123278059065342,a:{...MON_DEF.gosma.a}};
MON_DEF.gosma_a_part2={h:0.7289040395990014,a:{...MON_DEF.gosma.a}};
MON_DEF.cogu_f={h:1,a:{...MON_DEF.cogu.a}};
MON_DEF.cogu_a={h:1.1,a:{...MON_DEF.cogu.a}};
MON_DEF.espinhosa_f={h:1.2,a:{...MON_DEF.espinhosa.a}};
MON_DEF.espinhosa_a={h:1.2,a:{...MON_DEF.espinhosa.a}};
MON_DEF.passaro_f={h:1.1,a:{...MON_DEF.passaro.a}};
MON_DEF.passaro_a={h:1.1,a:{...MON_DEF.passaro.a}};
MON_DEF.magote_f={h:0.418,a:{...MON_DEF.magote.a}};MON_DEF.magote_a={h:0.526,a:{...MON_DEF.magote.a}};
MON_DEF.draconico318={h:3.4,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Cast',Hit:'Hit'}};
const spiritWolfReady=new Promise(resolve=>{if(!THREE.GLTFLoader){resolve();return}const ld=new THREE.GLTFLoader();if(window.MeshoptDecoder)ld.setMeshoptDecoder(MeshoptDecoder);ld.load('models/m_lobo.glb',g=>{MON.list.lobo=g.scene;MON.clips.lobo=g.animations;const b=new THREE.Box3().setFromObject(g.scene);MON.h.lobo=b.max.y-b.min.y||1;resolve()},undefined,()=>resolve())});
MODELS.ready=Promise.all([MODELS.ready,spiritWolfReady]).then(([ok])=>ok);
MODELS.ready.then(()=>{if(!THREE.GLTFLoader)return;const ld=new THREE.GLTFLoader();if(window.MeshoptDecoder)ld.setMeshoptDecoder(MeshoptDecoder);
  for(const k in MON_DEF){const D=MON_DEF[k];if(D.actor||D.externalLoader314||MON.list[k])continue;const url=(D.file?'models/mobs165/'+D.file+'.glb':'models/m_'+k+'.glb')+(D.file?'?v=410':(k.startsWith('magote')?'?v=394':k.startsWith('cactinho')?'?v=372':k.startsWith('slime')?'?v=360':k.startsWith('gosma')?'?v=363':k.startsWith('cogu')?'?v=366':k.startsWith('passaro')?'?v=367':k.startsWith('guardiao')?'?v=370':k.startsWith('espinhosa')?'?v=368':k.startsWith('escaravelho')?'?v=359':''));ld.load(url,g=>{MON.list[k]=g.scene;MON.clips[k]=D.userRig?fixUserRigClips413(g.animations):g.animations;const b=monsterBounds132(g.scene);MON.h[k]=(b.max.y-b.min.y)||1},undefined,()=>{})}});
/* v413 (Ian: "anda um, dois, para, trava"): os 14 GLBs userRig (PrimevaRig, 18 ossos) trazem o Run quebrado: coxa -31,5° no 1º quadro,
   +31,5° no 17º e 0° no último, então a cada volta a perna estala 31,5° de volta; e os tempos começam em 1/24 s. Na carga: tempos a partir de 0,
   raiz/pelve sem deslocamento horizontal, e o Run vira vai-e-volta até o extremo (ciclo fechado, 2 passos). */
function fixUserRigClips413(clips){
 for(const c of clips){let t0=Infinity;for(const tr of c.tracks)if(tr.times.length)t0=Math.min(t0,tr.times[0]);
  if(t0>0&&t0<Infinity)for(const tr of c.tracks)tr.shift(-t0);
  for(const tr of c.tracks)if(/^(root|pelvis)\.position$/.test(tr.name)){const v=tr.values;for(let i=3;i<v.length;i+=3){v[i]=v[0];v[i+2]=v[2]}}
  c.resetDuration();if(/(^|\|)(Run|Walk)$/.test(c.name))smoothLoop452(c)}
 return clips}
function smoothLoop452(clip){
 const dur=clip.duration;if(!dur||dur<=0)return clip;
 for(const tr of clip.tracks){
  const sz=tr.getValueSize(),n=tr.times.length;if(n<2)continue;
  const isQ=tr.ValueTypeName==='quaternion',v0=tr.values.slice(0,sz);
  const blendStart=dur*0.75;
  for(let i=0;i<n;i++){
   const t=tr.times[i];
   if(t>=blendStart){
    const u=(t-blendStart)/(dur-blendStart);
    const idx=i*sz;
    if(isQ){
     const dot=tr.values[idx]*v0[0]+tr.values[idx+1]*v0[1]+tr.values[idx+2]*v0[2]+tr.values[idx+3]*v0[3];
     const flip=dot<0?-1:1;
     for(let j=0;j<4;j++)tr.values[idx+j]=(1-u)*tr.values[idx+j]+u*v0[j]*flip;
     const len=Math.hypot(tr.values[idx],tr.values[idx+1],tr.values[idx+2],tr.values[idx+3])||1;
     for(let j=0;j<4;j++)tr.values[idx+j]/=len;
    }else{
     for(let j=0;j<sz;j++)tr.values[idx+j]=(1-u)*tr.values[idx+j]+u*v0[j];
    }
   }
  }
 }
 clip.resetDuration();clip.optimize();return clip}
function makeMonster(o){
  const k=o.mon,src=MON.list[k],D=MON_DEF[k];const model=THREE.SkeletonUtils.clone(src);
  const root=new THREE.Group(),body=new THREE.Group();root.add(body);body.add(model);
  const sc=o.scale||1;model.scale.setScalar(D.h/MON.h[k]);body.scale.setScalar(sc);
  const mats=[];model.traverse(c=>{if(c.isMesh){envCull(c);c.frustumCulled=false;const keepPbr=!!D.userRig||k.startsWith('magote')||k.startsWith('cactinho')||k==='draconico318'||k.startsWith('slime')||k==='cogu'||k.startsWith('passaro')||k.startsWith('espinhosa')||k.startsWith('guardiao')||k.startsWith('escaravelho')||k.startsWith('gosma');const mm=keepPbr?c.material.clone():toToon(c.material,c.isSkinnedMesh,.16);if(keepPbr)mm.skinning=!!c.isSkinnedMesh;if((D.userRig||k.startsWith('guardiao')||k.startsWith('cactinho')||k.startsWith('magote'))&&renderer.outputEncoding!==THREE.sRGBEncoding){mm.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <encodings_fragment>','#include <encodings_fragment>\ngl_FragColor=LinearTosRGB(gl_FragColor);')};mm.customProgramCacheKey=()=> 'guardian370-linear';}if(o.tint!=null&&!D.userRig)mm.color.lerp(new THREE.Color(o.tint),.35);mm.roughness=(k.startsWith('slime')||k.startsWith('gosma'))?.42:k.startsWith('escaravelho')?.52:.8;mm.metalness=k.startsWith('escaravelho')?.35:0;c.material=mm;mats.push(mm)}});
  const dummy=()=>{const g=new THREE.Object3D();body.add(g);return g};
  const sh=new THREE.Mesh(geo('shadow',()=>new THREE.CircleGeometry(.55,16)),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.35,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.03;sh.scale.setScalar(sc*Math.max(1,D.h/1.8));root.add(sh);
  return {root,body,model,armL:dummy(),armR:dummy(),legL:dummy(),legR:dummy(),mats,sc,eyeMat:new THREE.MeshBasicMaterial(),glb:true,userRig:!!D.userRig,gait413:D.userRig?.61*(D.h/MON.h[k])*sc:0,mixer:new THREE.AnimationMixer(model),act:{},cur:null,atkClip:'ATK',la:0,lw:0,alias:D.a,clips:MON.clips[k],mon:k,st:!!D.st};
}
function gAct(m,n){if(m.act[n])return m.act[n];let c;
  if(m.alias){const nm=m.alias[n]||(n==='Hit_A'?m.alias.Hit:null)||m.alias.Idle;c=m.clips.find(a=>a.name===nm||a.name.endsWith('|'+nm))}
  else if(m.customClips)c=m.customClips.find(a=>a.name===n);
  else c=MODELS.anims.find(a=>a.name===n);
  if(!c)return null;return m.act[n]=m.mixer.clipAction(c)}
function gPlay(m,n,once,spd){if(m.mon==='draconico318'&&!m.userRig&&n==='Hit_A'){m.hit318=.35;return}const a=gAct(m,n);if(!a)return;const prev=m.cur&&m.act[m.cur];const keep=m.userRig&&n==='Running_A'&&a.time>0;if(keep){a.stopFading();a.paused=false}else a.reset();a.setLoop(once?THREE.LoopOnce:THREE.LoopRepeat,Infinity);a.clampWhenFinished=!!once;a.timeScale=spd||1;a.enabled=true;a.setEffectiveWeight(1);if(!keep&&m.userRig&&n==='Running_A')a.time=a.getClip().duration*.25;a.play();if(prev&&prev!==a)prev.crossFadeTo(a,once?.12:.22,false);m.cur=n}
function animGlb(m,st){
  if(m.st){const b=m.body,tt=performance.now()/1000+(m.ph||(m.ph=Math.random()*9));if(st.dead>0){b.rotation.x=Math.max(-1.5,b.rotation.x-.06);b.position.y=0;return}
    b.position.y=st.move>.1?Math.abs(Math.sin(tt*8))*.14:Math.sin(tt*2)*.03;b.rotation.z=st.move>.1?Math.sin(tt*8)*.06:0;b.rotation.x=st.wind>0?-.3:st.atk>0?Math.sin(Math.min(1,st.atk)*Math.PI)*.55:st.move>.1?.1:0;return}
  m.body.position.y=0;m.body.rotation.set(0,0,0);if(m.userRig){/* v413: Idle do PrimevaRig vem parado; respiração leve */if(!(st.move>.1)&&!(st.dead>0)){const tt=performance.now()/1000+(m.ph||(m.ph=Math.random()*9));m.body.position.y=(Math.sin(tt*2.1)*.5+.5)*.025*(m.sc||1);m.body.rotation.z=Math.sin(tt*1.3)*.012;m.body.rotation.x=Math.sin(tt*2.1)*.01}m.hold413=st.move>.1?.25:Math.max(0,(m.hold413||0)-ADT);if(st.speed!=null)m.spd413=m.spd413==null?st.speed:m.spd413+(st.speed-m.spd413)*Math.min(1,ADT*6)}
  if(st.dead>0){if(m.cur!=='Death_A')gPlay(m,'Death_A',true,/^(escaravelho|slime|gosma|cogu|passaro|espinhosa|guardiao|cactinho|magote)/.test(m.mon||'')?1:1.2)}
  else if(st.wind>0&&m.mon&&m.mon.startsWith('magote')){if(m.cur!=='Windup'||st.wind<m.lw)gPlay(m,'Windup',true,1);m.lw=st.wind}
  else if(st.wind>0){if(m.cur!==m.atkClip||st.wind<m.lw)gPlay(m,m.atkClip,true,.55);m.lw=st.wind}
  else if(st.atk>0){if(m.cur!==m.atkClip||st.atk<m.la)gPlay(m,m.atkClip,true,1.6);m.la=st.atk;m.lw=0}
  else if(m.mon&&m.mon.startsWith('magote')&&m.cur===m.atkClip){gPlay(m,'Recover',true,1);m.la=0;m.lw=0}
  else if((st.move>.1||m.hold413>0)&&(!m.locomotion||st.speed==null||st.speed>.05)){const rate=m.userRig&&m.gait413&&m.spd413!=null&&st.speed!=null?clamp(m.spd413/m.gait413,.6,2.2):m.locomotion&&st.speed!=null?clamp(st.speed/m.gaitSpeed,.25,3):.8+st.move*.4;if(m.cur!=='Running_A')gPlay(m,'Running_A',false,rate);else if(m.act.Running_A)m.act.Running_A.timeScale=rate;m.la=0;m.lw=0}
  else{const a=m.cur&&m.act[m.cur],busy=a&&a.loop===THREE.LoopOnce&&a.isRunning()&&m.cur!=='Death_A';if(m.customClips){if(!busy&&a){a.fadeOut(.25);m.cur=null}}else if(!busy&&m.cur!=='Idle')gPlay(m,'Idle',false);m.la=0;m.lw=0}
  if(window.Culling637)Culling637.mix(m,ADT);else m.mixer.update(ADT);/* v640: fora da vista ou longe anima a 1/4 do ritmo */
  try{if(window.Anim547&&Anim547.postMobGlb)Anim547.postMobGlb(m,st,ADT)}catch(_){}
}

function animDraconico318(m,st,t){
 if(m.hit318>0)m.hit318=Math.max(0,m.hit318-ADT);
 const name=st.dead>0?'Death':m.hit318>0?'Hit':(st.wind>0||st.atk>0)?(m.attack318||'Cast'):st.move>.1?'Run':'Idle';
 const clip=m.clips.find(c=>c.name===name||c.name.startsWith(name+'_'));
 if(!clip)return;
 if(m.state318!==name){/* v547: mistura em vez de corte seco */const old=m.action318,nw=m.mixer.clipAction(clip);nw.reset().setEffectiveWeight(1).play();if(old&&old!==nw)old.crossFadeTo(nw,name==='Death'?.15:.22,false);m.action318=nw;m.state318=name;}
 const a=m.action318;
 if(st.dead>0)a.time=Math.min(Math.max(0,clip.duration-0.000001),st.dead*clip.duration);
 else if(name==='Hit')a.time=clip.duration*(1-m.hit318/.35);
 else if(st.wind>0)a.time=clip.duration*.68*st.wind;
 else if(st.atk>0)a.time=clip.duration*(.68+.32*st.atk);
 else a.time=(t*(name==='Run'?Math.max(.35,st.move):1))%clip.duration;
 m.mixer.update(0);
}
function animChibi(m,st,t){
  if(m.npc456)return; /* v456: NPC do Tripo anima sozinho (tools/npc456.js) */
  if(m.citizen133&&window.Citizens133){Citizens133.animate(m,st,t);return}
  if(m.edran452&&m.bones){
    const b=m.bones,sw=Math.sin(t*9)*.5*st.move;
    if(b.thigh_l)b.thigh_l.rotation.x=-sw;
    if(b.thigh_r)b.thigh_r.rotation.x=sw;
    if(b.shin_l)b.shin_l.rotation.x=Math.max(0,sw)*.45;
    if(b.shin_r)b.shin_r.rotation.x=Math.max(0,-sw)*.45;
    if(b.upperarm_l)b.upperarm_l.rotation.x=sw*.5;
    if(b.upperarm_r)b.upperarm_r.rotation.x=-sw*.5;
    if(b.spine)b.spine.rotation.x=Math.sin(t*2)*.02;
    m.body.position.y=Math.abs(Math.sin(t*9))*.03*st.move;
    return;
  }
  if(m.warrior127&&window.Warrior127){Warrior127.animate(m,st,t,ADT);return}
  if(m.goblin118){animGoblin118(m,st,t);return}
  if(m.quadruped){if(window.Anim547&&Anim547.animQuadruped){Anim547.animQuadruped(m,st,t);return}const sw=Math.sin(t*11)*.65*st.move;m.paws.forEach((p,i)=>p.rotation.x=(i===0||i===3?sw:-sw));m.tail.rotation.y=Math.sin(t*5)*.15;m.body.position.y=Math.abs(Math.sin(t*11))*.035*st.move;m.body.rotation.x=st.wind>0?-.12:st.atk>0?Math.sin(st.atk*Math.PI)*.2:0;if(st.dead>0)m.body.rotation.z=st.dead*Math.PI/2;return}
  if(m.mon==='draconico318'&&!m.userRig){animDraconico318(m,st,t);return}
  if(m.glb){animGlb(m,st);return}
  if(window.Anim547&&Anim547.animChibi){Anim547.animChibi(m,st,t);return}
  const sw=Math.sin(t*11)*.7*st.move;
  m.legL.rotation.x=sw;m.legR.rotation.x=-sw;m.armL.rotation.x=-sw*.8;
  if(st.wind>0){m.armR.rotation.x=-2.6*st.wind;m.body.rotation.x=-.15*st.wind}
  else if(st.atk>0){const a=st.atk;m.armR.rotation.x=-2.6+3.6*Math.min(1,a*2.2);m.armR.rotation.z=-.4*Math.sin(a*Math.PI);m.body.rotation.y=Math.sin(a*Math.PI)*.5;m.body.rotation.x=.15*Math.sin(a*Math.PI)}
  else{m.armR.rotation.x=sw*.8;m.armR.rotation.z*=.8;m.body.rotation.y*=.8;m.body.rotation.x*=.8}
  m.body.position.y=Math.abs(Math.sin(t*11))*.08*st.move+Math.sin(t*2.2)*.02;
  if(st.dead>0){m.body.rotation.x=-Math.PI/2*st.dead;m.body.position.y=.35*st.dead}
}
function flashMats(m,v,col=0xffffff){for(const mt of m.mats||[]){if(!mt||!mt.emissive)continue;if(mt.userData.e0===undefined)mt.userData.e0=mt.emissive.getHex();mt.emissive.setHex(v>0?col:mt.userData.e0)}}

