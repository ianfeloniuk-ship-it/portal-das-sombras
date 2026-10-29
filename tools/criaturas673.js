/* v675 (Ian: lobisomens, vampiros e draugr do Drive no jogo, «perfeito, igual Skyrim»): criaturas humanoides rigadas no
   Blender (tools/blender482/rig_humanoid669.py, modelo em pose T do Colab), animadas como o povo: Warrior127 + banco de
   clipes próprio (o lobisomem usa models/anim-lobisomem673.glb, animações "Mutant" do Mixamo, reaproveitadas pelo delta
   da pose T). O pano (tanga, rabo) usa a física de tools/pano672.js.
   - Lobisomem: florestas e neve (Ymíria), só de noite, no lugar de um lobo sombrio selvagem (1 em 5); no máximo 2 vivos.
     Saque: Couro de Lobisomem (tools/loot663.js). */
(function(global){
'use strict';
const T=global.THREE,W=global.Warrior127;if(!T||!T.GLTFLoader||!W||typeof KINDS==='undefined'||typeof makeChibi!=='function')return;
const V='676';
const DEF={
  lobisomem:{file:'models/lobisomem673.glb',bank:'lobo',bankFile:'models/anim-lobisomem673.glb',h:2.6,bio:['floresta','neve'],night:true,from:['lobo'],chance:.2,max:2,
    clips:{atk:['garra','soco'],dead:'morte',hit:'soco',roar:'rugido'},
    K:{n:'Lobisomem',hp:260,dmg:24,spd:4.6,ai:'lunge',range:2.4,wind:.35,atkCd:1.3,xp:60,scale:1,body:0x4a4a52,wep:'none',r:.7,rk:4,bio:'floresta',crit673:'lobisomem'}},
  /* v675: draugr (mortos-vivos nórdicos, 6 aparências) — neve e floresta, no lugar de esqueletos e filhotes de yeti; lentos */
  draugr:{file:['draugr_aldea','draugr_bruxa','draugr_campones','draugr_guerreiro','draugr_jarl','draugr_shieldmaiden'].map(f=>'models/criaturas675/'+f+'.glb'),
    bank:'draugr',bankFile:'models/anim-draugr675.glb',h:2.0,bio:['neve','floresta'],night:false,from:['minion','warrior','caveira','yetinho'],chance:.35,max:4,
    clips:{atk:['golpe','garra'],dead:'morte',hit:'dano',roar:'grito'},
    K:{n:'Draugr',hp:180,dmg:18,spd:3.2,ai:'melee',range:2.2,wind:.45,atkCd:1.6,xp:45,scale:1,body:0x6a6a70,wep:'none',r:.55,rk:3,bio:'neve',crit673:'draugr'}},
  /* v675: vampiros despertados (Ymíria, reino gelado dos vampiros) — só de noite, no lugar de fantasmas e yetis */
  vampiro:{file:['vampira_despertada_feminina','vampiro_despertado_masculino'].map(f=>'models/criaturas675/'+f+'.glb'),
    bank:'vamp',bankFile:'models/anim-vamp675.glb',h:2.3,bio:['neve'],night:true,from:['fantasma','yeti'],chance:.25,max:2,
    clips:{atk:['mordida','golpe'],dead:'morte',hit:'golpe',roar:'mordida'},
    K:{n:'Vampiro Despertado',hp:220,dmg:26,spd:5.2,ai:'lunge',range:2.4,wind:.3,atkCd:1.2,xp:70,scale:1,body:0x8a1a1a,wep:'none',r:.6,rk:5,bio:'neve',crit673:'vampiro'}}
};
const API=global.Criaturas673={DEF,ready:{},base:{},stats:{spawned:0,made:0}};
for(const [k,D] of Object.entries(DEF)){
  W.loadBank486(D.bank,D.bankFile+'?v='+V);
  const files=[].concat(D.file);API.base[k]=[];
  for(const f of files)new T.GLTFLoader().load(f+'?v='+V,g=>{g.file678=f;API.base[k].push(g);if(!KINDS[k])KINDS[k]={...D.K};API.ready[k]=true},undefined,e=>console.warn('Criaturas673: '+f+' não carregou',e));
}
/* modelo: o mkEnemy do jogo monta o boneco padrão; depois troca pelo Warrior127 com o GLB da criatura, na altura dela */
function model(k,want){const D=DEF[k],L0=API.base[k],L=(want&&L0.filter(g=>want.test(g.file678||'')).length)?L0.filter(g=>want.test(g.file678||'')):L0,g=L[Math.floor(Math.random()*L.length)];/* v678: want escolhe a aparência (ex.: vampiro masculino) */const m=W.create({modelScene:g.scene,legacyLinearOutput:true,equip:{}});
  m.model.scale.multiplyScalar(D.h/2.05);m.crit673=k;m.height482=D.h;API.stats.made++;return m}
API.model=model;
if(typeof mkEnemy==='function'){const mk0=mkEnemy;mkEnemy=function(K){const e=mk0.apply(this,arguments);
  try{const k=K&&K.crit673;if(k&&API.base[k]&&API.base[k].length&&e&&e.m&&e.m.root){const old=e.m,par=old.root.parent,m=model(k);
    m.root.position.copy(old.root.position);m.root.rotation.copy(old.root.rotation);if(par){par.remove(old.root);par.add(m.root)}e.m=m;if(e.mats)e.mats=m.mats}}catch(err){console.warn('Criaturas673 modelo',err)}
  return e}}
/* animação: banco da criatura; golpe, dano e morte pelo estado do monstro */
const an0=animChibi;
animChibi=function(m,st,t){if(!m||!m.crit673)return an0.apply(this,arguments);
  const D=DEF[m.crit673],p=m.root.position,dt=(typeof ADT!=='undefined'?ADT:1/60)||1/60;
  if(m.last673){const v=Math.hypot(p.x-m.last673.x,p.z-m.last673.z)/Math.max(dt,1e-3);m.v673+=(Math.min(v,10)-m.v673)*Math.min(1,dt*6)}else{m.last673=new T.Vector3();m.v673=0}m.last673.copy(p);
  const s={bank486:D.bank,move:st.move,speed:m.v673,walking:m.v673<3,sprint:m.v673>4,dead:st.dead,atk:0,once486:false,clip486:null};
  if(m.forceClip677){s.clip486=m.forceClip677;s.once486=true;s.fade486=.15}/* v677: cena da transformação manda o clipe *//* v678: golpe novo só quando o tempo do ataque recomeça (antes trocava e reiniciava o clipe a cada quadro e o braço travava) */
  else if(st.dead>0){s.clip486=D.clips.dead;s.once486=true;s.dead=0}
  else if(st.atk>0){if(!m.atkClip673||st.atk>(m.lastAtk673||0)+.01)m.atkClip673=D.clips.atk[(m.nAtk673=(m.nAtk673||0)+1)%D.clips.atk.length];m.lastAtk673=st.atk;s.clip486=m.atkClip673;s.once486=true;s.fade486=.12}
  else m.atkClip673=null;
  return W.animate(m,s,t,dt)};
/* geração: de noite, no bioma certo, no lugar de um lobo selvagem */
const night=()=>{try{return typeof isNight==='function'&&isNight()}catch(_){return false}};
const alive=k=>{try{return (typeof enemies!=='undefined'?enemies:[]).filter(e=>e&&e.kind===k&&!e.dead).length}catch(_){return 0}};
if(typeof spawnKind==='function'){const sk0=spawnKind;spawnKind=function(k,x,z,gr,extra){
  try{if(extra&&extra.wild&&!(extra.boss||extra.rival||extra.noCriatura673)){
    const bio=typeof biomeAt==='function'?biomeAt(x,z):null;
    for(const [c,D] of Object.entries(DEF)){if(!API.ready[c]||!D.from.includes(k)||!D.bio.includes(bio)||(D.night&&!night())||alive(c)>=D.max||Math.random()>D.chance)continue;
      API.stats.spawned++;return sk0.call(this,c,x,z,Math.max(gr||0,D.K.rk-1),{...extra,noCriatura673:true,noFendido:true,noInedita:true,noDragon482:true})}}}catch(_){}
  return sk0.apply(this,arguments)}}
})(typeof window!=='undefined'?window:globalThis);
