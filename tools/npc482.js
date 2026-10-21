/* v482 (Ian, 20/10/2026): Povo482 — NPCs humanos e dragões novos.
   Regras de Ian: rig sempre no Blender (tools/blender482), NPC do tamanho do Viajante (2,05; mulheres ~0,95; elfos ~1,04;
   anões ~0,70), movimento fluido igual ao do Viajante (mesmo banco de 25 clipes de models/anim-viajante155.glb via Warrior127),
   moradores sem armadura e sem arma; só caçadores levam a arma do jogo pelo Rank; magos sem armadura.
   - Bases lidas de models/povo482/index.json (tools/povo482-index.py). O que não existir continua no comportamento antigo (chibi KayKit
     ou o caçador veterano138).
   - Variação sem custo: matiz da roupa (_NPC_MASK.x) pela paleta da região, cabelo (y) e pele (z); couro/metal (w) ficam naturais.
     Porte por osso, velocidade do clipe e fase de respiração por semente do NPC (determinístico).
   - Desempenho: até CAP NPCs detalhados (os mais perto, < 60 m); 30–60 m anima a cada 2 quadros; > 60 m não anima.
     Quem sai do alcance volta a ser chibi e a malha/material detalhado é liberado.
   - Dragões: GLB em models/povo482/<id>.glb registrado no MON_DEF com userRig:true (só se o arquivo existir). */
(function(global){
'use strict';
const T=global.THREE;if(!T||!T.GLTFLoader)return;
const V='493',DIR='models/povo482/',CAP=24,NEAR=30,FAR=60,DROP=75;
const API={V,CAP,bases:[],byId:{},ready:false,live:new Set(),reg:new Set(),stats:{made:0,freed:0}};

/* ---------- utilidades determinísticas ---------- */
function hash(s){let h=2166136261>>>0;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h>>>0}
function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
const lerp=(a,b,t)=>a+(b-a)*t;
function wchoice(R,list,w){const ws=list.map(w);let s=ws.reduce((a,b)=>a+b,0);if(!(s>0))return null;let n=R()*s;for(let i=0;i<list.length;i++)if((n-=ws[i])<0)return list[i];return list[list.length-1]}
const lin=hex=>new T.Color(hex).convertSRGBToLinear();

/* ---------- regiões e paletas (sRGB, convertidas para linear no uso) ---------- */
const PAL={
 aster:[0x2f4f8a,0x6b4a2a,0x7a2d2d,0x4a5a3a,0x8a7a5a,0x3a3a44],
 solaria:[0xe0b040,0xd06a2a,0xf0e0b0,0xb03a2a,0xe8dcc0,0xc89030],
 ymiria:[0x3a6a9a,0xdfe8f0,0x2a3a5a,0x6a8aa8,0x8a2a2a,0x5a6470],
 zahar:[0xc89a5a,0xa04a2a,0xe0c890,0x2a6a8a,0x6a2a5a,0xd8b070],
 thalor:[0x1a5a7a,0x2a8a8a,0xe0e0d0,0x3a3a6a,0xa08050,0x4a7a8a],
 urdan_verden:[0x3a6a2a,0x6a8a3a,0x5a4020,0x8a6a3a,0x2a4a3a,0x7a5a30]
};
const HAIR={preto:0x16130f,castanho:0x4a2e1a,ruivo:0x8a3a18,loiro:0xc8a060,grisalho:0x9a9690};
const SKIN=[0xf1c7a5,0xe0b08a,0xc69068,0xa86b45,0x7a4a30,0x5a3424];
const CAPS={'0,0':'aster','0,-5':'ymiria','5,0':'zahar','-5,0':'thalor','0,5':'urdan_verden','5,5':'urdan_verden'};
function regionOf(c){if(!c)return 'aster';if(c.region482)return c.region482;let rx=0,rz=0;const p=String(c.id||'').split(',');if(p.length===2){rx=+p[0]||0;rz=+p[1]||0}
 let best='aster',bd=1e9;for(const [k,id] of Object.entries(CAPS)){const [x,z]=k.split(',').map(Number),d=Math.hypot(rx-x,rz-z);if(d<bd){bd=d;best=id}}
 /* Solaria não tem capital no mapa: as cidades a leste/nordeste de Aster (mais perto de Aster que das outras capitais) são de Solaria */
 if(best==='aster'&&!(rx===0&&rz===0)&&rx>=1&&rz<=0)best='solaria';
 return c.region482=best}

/* ---------- registro das bases ---------- */
const loadP=new Map(),assets=new Map();
API.load=function(){if(API.loadP)return API.loadP;
 API.loadP=fetch(DIR+'index.json?v='+V,{cache:'no-cache'}).then(r=>r.ok?r.json():null).catch(()=>null).then(j=>{
  const list=(j&&Array.isArray(j.bases))?j.bases:[];API.bases=list.filter(b=>b&&b.id&&b.kind!=='dragon');API.dragons=list.filter(b=>b&&b.kind==='dragon');
  for(const b of list)API.byId[b.id]=b;API.ready=true;try{Dragons.init(API.dragons)}catch(e){console.warn('Povo482 dragões',e)}return API.bases.length});
 return API.loadP};
function loadBase(id){if(loadP.has(id))return loadP.get(id);const p=new Promise(res=>{const ld=new T.GLTFLoader();if(global.MeshoptDecoder)ld.setMeshoptDecoder(global.MeshoptDecoder);
  ld.load(DIR+id+'.glb?v='+V,g=>{g.animations=[];prepAsset(g,id);assets.set(id,g);res(g)},undefined,e=>{console.warn('Povo482: base '+id+' não carregou',e);assets.set(id,null);res(null)})});
 loadP.set(id,p);return p}
/* Médias da textura em cada máscara: cabelo (luminância) e pele (cor), para mudar o tom sem perder o desenho da textura. */
function prepAsset(g,id){const ref={hairL:.05,skin:new T.Color(.55,.33,.22)};g.scene.traverse(o=>{if(!o.isMesh)return;const geo=o.geometry;
  if(geo.attributes._NPC_MASK&&!geo.attributes._npc_mask){geo.setAttribute('_npc_mask',geo.attributes._NPC_MASK);geo.deleteAttribute('_NPC_MASK')}
  const M=geo.attributes._npc_mask,UV=geo.attributes.uv,img=o.material&&o.material.map&&o.material.map.image;if(!M||!UV||!img)return;
  try{const W=256,H=256,cv=document.createElement('canvas');cv.width=W;cv.height=H;const cx=cv.getContext('2d');cx.drawImage(img,0,0,W,H);const px=cx.getImageData(0,0,W,H).data;
   const div=M.array instanceof Uint8Array?255:M.array instanceof Uint16Array?65535:1,toL=v=>Math.pow(v/255,2.2);let hs=0,hn=0,sr=0,sg=0,sb=0,sn=0;
   for(let i=0;i<M.count;i+=2){const y=M.getY(i)/div,z=M.getZ(i)/div;if(y<.5&&z<.5)continue;let u=UV.getX(i)%1,v=UV.getY(i)%1;if(u<0)u+=1;if(v<0)v+=1;
    const k=((Math.min(H-1,v*H|0))*W+Math.min(W-1,u*W|0))*4,r=toL(px[k]),gg=toL(px[k+1]),b=toL(px[k+2]);
    if(y>=.5){hs+=.2126*r+.7152*gg+.0722*b;hn++}else{sr+=r;sg+=gg;sb+=b;sn++}}
   if(hn>20)ref.hairL=Math.max(.004,hs/hn);if(sn>20)ref.skin.setRGB(sr/sn,sg/sn,sb/sn)}catch(e){/* textura sem acesso (CORS): fica a média padrão */}});
 g.ref482=ref}

/* ---------- escolha da base ---------- */
const FAMILY={0:'soldado',22:'soldado',23:'soldado',2:'pesado',5:'pesado',1:'sombra',4:'arqueiro',3:'mago',6:'mago',7:'mago',8:'mago',9:'mago',10:'mago',11:'mago',21:'monge',24:'berserker'};
function familyOf(cls){if(FAMILY[cls])return FAMILY[cls];const c=global.CLASSES&&CLASSES[cls]||(typeof CLASSES!=='undefined'?CLASSES[cls]:null);return c&&(c.ranged||/^(staff|tome|wand|bonestaff)$/.test(c.wep||''))?'mago':'soldado'}
const RACE_W={human:1,dwarf:.22,anao:.22,elf:.25,elfo:.25};
function pickBase(R,want){const pool=API.bases.filter(b=>b.role===want.role&&(!want.family||String(b.family||'').includes(want.family)||String(b.id).includes(want.family))&&(!want.sex||b.sex===want.sex)&&(!want.race||b.race===want.race));
 if(!pool.length)return want.race?pickBase(R,{...want,race:null}):null;return wchoice(R,pool,b=>RACE_W[b.race]??.3)}
API.hasRole=(role,family)=>API.bases.some(b=>b.role===role&&(!family||String(b.family||'').includes(family)||String(b.id).includes(family)));

/* ---------- criação do ator detalhado ---------- */
const GLSL=`#include <map_fragment>
 { vec3 c0=diffuseColor.rgb; float L=dot(c0,vec3(.2126,.7152,.0722));
   vec3 cloth=clamp(npcCloth/max(dot(npcCloth,vec3(.2126,.7152,.0722)),.01)*L,0.,1.);
   vec3 hair=clamp(npcHair*(L/max(npcRef.x,.004)),0.,1.);
   vec3 skin=clamp(c0*npcSkin,0.,1.);
   vec4 k=clamp(vNpcMask,0.,1.);
   vec3 c=mix(c0,cloth,k.x*npcAmt.x); c=mix(c,hair,k.y*npcAmt.y); c=mix(c,skin,k.z*npcAmt.z);
   diffuseColor.rgb=c; }`;
function paint(mat,U){const prev=mat.onBeforeCompile;mat.onBeforeCompile=sh=>{if(prev)prev(sh);Object.assign(sh.uniforms,U);
  sh.vertexShader='attribute vec4 _npc_mask; varying vec4 vNpcMask;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvNpcMask = _npc_mask;');
  sh.fragmentShader='varying vec4 vNpcMask; uniform vec3 npcCloth; uniform vec3 npcHair; uniform vec3 npcSkin; uniform vec3 npcRef; uniform vec3 npcAmt;\n'+sh.fragmentShader.replace('#include <map_fragment>',GLSL)};
 mat.customProgramCacheKey=()=> 'povo482-v1';mat.needsUpdate=true}
function looks(R,base,region,race){const pal=PAL[region]||PAL.aster;const hairW=race==='elf'||race==='elfo'?{preto:1,castanho:1,ruivo:.5,loiro:2.4,grisalho:.6}:race==='dwarf'||race==='anao'?{preto:1,castanho:1.6,ruivo:2,loiro:.6,grisalho:1}:{preto:2,castanho:2.2,ruivo:.6,loiro:.9,grisalho:.7};
 const hk=wchoice(R,Object.keys(HAIR),k=>hairW[k]);const skinW=region==='zahar'?[.3,.6,1,1.4,1.2,.8]:region==='ymiria'?[1.6,1.4,.8,.5,.3,.2]:region==='solaria'?[.6,1,1.4,1.2,.8,.5]:[1.1,1.2,1,.8,.6,.4];
 const sk=wchoice(R,SKIN,(_,i)=>skinW[i]||1)??SKIN[1];
 return {cloth:pal[Math.floor(R()*pal.length)],hair:hk,hairHex:HAIR[hk],skin:SKIN[SKIN.indexOf(sk)]}}
function create(base,g,o){
 const R=rng(o.seed),lk=looks(R,base,o.region,base.race);
 const m=Warrior127.create({modelScene:g.scene,legacyLinearOutput:true,equip:{}});m.povo482=base.id;m.hunter138=o.role==='hunter';m.civil482=o.role!=='hunter';
 const ref=g.ref482||{hairL:.05,skin:new T.Color(.55,.33,.22)},skinT=lin(lk.skin),U={npcCloth:{value:lin(lk.cloth)},npcHair:{value:lin(lk.hairHex)},
  npcSkin:{value:new T.Vector3(...['r','g','b'].map(c=>Math.max(.3,Math.min(2.2,skinT[c]/Math.max(.01,ref.skin[c])))))},npcRef:{value:new T.Vector3(ref.hairL,0,0)},npcAmt:{value:new T.Vector3(.85,1,1)}};
 for(const mat of m.baseMaterials)paint(mat,U);m.npcU482=U;m.look482=lk;
 /* porte: altura 0,92–1,08 × heightScale da base; peito/ombros 0,94–1,15 (osso do peito com escala uniforme e pescoço/ombros compensados) */
 const h=(Number(base.heightScale)||1)*lerp(.92,1.08,R()),ch=lerp(.94,1.15,R());m.root.scale.setScalar(h);m.height482=h;
 const B=m.bones;if(B.chest){B.chest.scale.setScalar(ch);m.model.traverse(b=>{if(b.isBone&&b.parent===B.chest)b.scale.setScalar(1/ch)})}m.chest482=ch;
 m.spd482=lerp(.88,1.12,R());m.phase482=R()*3;m.wep482='fist';
 if(o.role==='hunter'&&o.weaponKind&&typeof makeItem==='function'){try{const it=makeItem('w',Math.max(0,Math.min(9,o.rank|0)),0,o.weaponKind);Warrior127.gear(m,{w:it},{tierColors:typeof TIER_COL!=='undefined'?TIER_COL:undefined});m.wep482=o.weaponKind}catch(e){console.warn('Povo482 arma',e)}}
 API.stats.made++;return m}
function dispose(m){if(!m||m.freed482)return;m.freed482=true;API.live.delete(m);API.stats.freed++;
 for(const k of ['a155','bank486_povo'])try{m[k]&&(m[k].mixer.stopAllAction(),m[k].mixer.uncacheRoot(m[k].rig))}catch(_){}
 for(const mat of new Set(m.mats.concat(m.baseMaterials||[])))try{mat.dispose()}catch(_){}
 try{m.eyeMat.dispose()}catch(_){}
 /* arma do caçador (Warrior127.gear cria malhas próprias por ator) */
 for(const part of (m.wnodes||[]).concat(m.armorParts||[]))try{part.traverse(o=>{if(o.isMesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(x=>x.dispose())}})}catch(_){}
 for(const c of m.root.children)if(c.isMesh){c.geometry.dispose();c.material.dispose()}
 m.model.traverse(o=>{if(o.isSkinnedMesh){if(o.userData.fist162&&o.userData.fist162!==null)o.geometry.dispose();if(o.skeleton&&o.skeleton.boneTexture)o.skeleton.boneTexture.dispose()}})}

/* ---------- animação com nível de detalhe ---------- */
function animate(m,st,t){const P=global.player||(typeof player!=='undefined'?player:null),p=m.root.position,d=P?Math.hypot(P.x-p.x,P.z-p.z):0,dt=(typeof ADT!=='undefined'?ADT:1/60)||1/60;
 m.acc482=(m.acc482||0)+dt;
 if(d>FAR&&!(st.dead>0))return;
 if(d>NEAR){m.odd482=!m.odd482;if(m.odd482)return}
 const step=m.acc482;m.acc482=0;
 /* velocidade real (pelo deslocamento) escolhe andar ou correr e o ritmo do clipe */
 if(m.last482){const v=Math.hypot(p.x-m.last482.x,p.z-m.last482.z)/Math.max(step,1e-3);m.v482+=(Math.min(v,9)-m.v482)*Math.min(1,step*6)}else{m.last482=new T.Vector3();m.v482=0}
 m.last482.copy(p);
 const s={...st};if(s.move>.08){s.speed=Math.max(.6,m.v482/(m.height482||1));s.sprint=m.v482>4.2}if(!s.wep)s.wep=m.wep482;
 if(m.civil482&&civilBank()){s.bank486='povo';const c=civilClip(m,s,step);if(c){s.clip486=c.n;s.rate486=c.r;if(c.move){s.move=1;s.speed=Math.max(s.speed||0,5)}}}
 if(!m.phased482&&Warrior127.anim155&&dt>0){m.phased482=true;Warrior127.animate(m,{move:0,atk:0,dead:0},t,m.phase482)}
 Warrior127.animate(m,s,t,step*m.spd482)}
if(typeof animChibi==='function'){const base=animChibi;animChibi=function(m,st,t){if(m&&m.povo482&&global.Warrior127)return animate(m,st,t);return base.apply(this,arguments)}}

/* v486 (Ian): moradores usam o banco do dia a dia do Tripo (models/povo482/anim-povo482.glb, só esqueleto Mixamo + 36 clipes),
   pelo mesmo retarget por delta da pose T do Warrior127. Caçadores seguem com os golpes do Viajante.
   Parado: alterna atividades (olhar em volta, braços cruzados, acenar, rir, cavar, rachar lenha...). Monstro a < 14 m: assusta; andando perto: foge. */
const BANK='models/povo482/anim-povo482.glb?v=486';let bankAsk=false;
function civilBank(){const W=global.Warrior127;if(!W||!W.loadBank486)return false;if(!bankAsk){bankAsk=true;W.loadBank486('povo',BANK)}const b=W.banks486&&W.banks486.povo;return !!(b&&b.ok)}
const IDLE486=[['idle',4],['look_around',1.4],['standing_relax',1.6],['wait',1.2],['fold_arms',1.2],['scratch',.5]],
 SOCIAL486=[['greet_01',.7],['greet_02',.5],['wave_goodbye_01',.6],['clap',.4],['cheer',.3],['laugh_01',.6]],
 WORK486=[['dig',.5],['shovel',.5],['chop',.6],['lift_heavy',.4],['sit',.5]];
function monsterNear(p,r){try{const E=typeof enemies!=='undefined'?enemies:null;if(!E)return false;for(const e of E){if(!e||e.dead||e.hp<=0)continue;const ex=e.x!=null?e.x:e.m&&e.m.root&&e.m.root.position.x,ez=e.z!=null?e.z:e.m&&e.m.root&&e.m.root.position.z;if(ex!=null&&Math.hypot(ex-p.x,ez-p.z)<r)return true}}catch(_){}return false}
function civilClip(m,s,dt){const p=m.root.position,C=m.civ486||(m.civ486={t:0,n:null,R:rng(hash(m.povo482)^((m.phase482*1e4)|0)),chk:0,fear:false});
 C.chk-=dt;if(C.chk<=0){C.chk=.5;C.fear=monsterNear(p,14)}
 if(s.dead>0)return null;
 if(C.fear)return (s.move||0)>.08?{n:'flee_01',r:1,move:true}:{n:m.civ486.R()<.5?'scared_01':'frightened',r:1};
 if((s.move||0)>.08){C.t=0;C.n=null;return null}
 C.t-=dt;if(C.t<=0||!C.n){const R=C.R,pool=R()<.65?IDLE486:SOCIAL486;/* v486 (Ian): sem cavar/carregar/sentar no vazio — trabalho de verdade é a mina (tools/vida486.js) */C.n=wchoice(R,pool.map(x=>x[0]),(_,i)=>pool[i][1]);C.t=lerp(6,14,R())}
 return {n:C.n,r:1}}

/* ---------- registro de atores e troca chibi <-> detalhado ---------- */
function weaponOf(cls){const c=typeof CLASSES!=='undefined'&&CLASSES[cls];const w=c&&c.wep;return {sword:'sword',dagger:'dagger',axe:'axe',bow:'bow',wand:'wand',tome:'tome',bonestaff:'bonestaff',staff:'staff',spear:'spear'}[w]||null}
function register(actor,o){if(!actor||actor.p482)return;actor.p482=o;API.reg.add(actor)}
function swapIn(actor,m){const old=actor.m;if(!old||!old.root||!old.root.parent)return false;const parent=old.root.parent;
 m.root.position.copy(old.root.position);m.root.rotation.copy(old.root.rotation);
 if(actor.cargo348&&actor.cargo348.parent===old.root)m.root.add(actor.cargo348);
 parent.remove(old.root);actor.chibi482=old;actor.m=m;if(actor.mats)actor.mats=m.mats;m.actor482=actor;parent.add(m.root);API.live.add(m);
 m.root.addEventListener('removed',()=>setTimeout(()=>{if(!m.root.parent)dispose(m)},0));return true}
function swapOut(actor){const m=actor.m;if(!m||!m.povo482)return;const old=actor.chibi482,parent=m.root.parent;
 if(old&&parent){old.root.position.copy(m.root.position);old.root.rotation.copy(m.root.rotation);if(actor.cargo348&&actor.cargo348.parent===m.root)old.root.add(actor.cargo348);parent.add(old.root);actor.m=old;if(actor.mats)actor.mats=old.mats}
 actor.chibi482=null;if(parent)parent.remove(m.root);dispose(m)}
function current(a){if(!a||a.gone||a.dead)return false;const o=a.p482;if(o.isCurrent)return !!o.isCurrent();return typeof npcs!=='undefined'&&npcs.includes(a)&&typeof L!=='undefined'&&L.mode==='world'}
let busy=0;
function upgrade(a){const o=a.p482;if(!o.base){const R=rng(o.seed^0x9e3779b9);o.base=pickBase(R,{role:o.role,family:o.family,sex:o.sex,race:o.race})||false}
 if(!o.base)return false;const g=assets.get(o.base.id);if(g===undefined){if(!busy){busy++;loadBase(o.base.id).then(()=>busy--)}return false}if(!g){/* GLB ausente: caçador volta ao comportamento antigo (veterano138) uma vez */if(o.fallback){const f=o.fallback;o.fallback=null;API.reg.delete(a);try{f()}catch(_){}}return false}
 const m=create(o.base,g,o);if(!swapIn(a,m)){dispose(m);return false}return true}
function tick(){if(!API.ready||!API.bases.length||typeof L==='undefined'||L.mode!=='world'||typeof player==='undefined'||!player||!global.Warrior127)return;
 if(!Warrior127.animsSettled)Warrior127.loadAnims('models/anim-viajante155.glb?v=374');
 const P=player,rows=[];for(const a of API.reg){if(!current(a)){if(a.m&&a.m.povo482&&(a.gone||a.dead||!a.m.root.parent))dispose(a.m);if(a.gone||!a.m||!a.m.root.parent)API.reg.delete(a);continue}
  rows.push({a,d:Math.hypot(P.x-a.x,P.z-a.z)-(a.p482.priority?20:0)})}
 rows.sort((x,y)=>x.d-y.d);const want=new Set(rows.filter(r=>r.d<FAR).slice(0,CAP).map(r=>r.a));
 /* quem saiu do alcance (> 75 m) volta a chibi; se alguém mais perto precisa da vaga, o mais longe cede primeiro */
 let missing=0;for(const a of want)if(!(a.m&&a.m.povo482))missing++;
 for(let i=rows.length-1;i>=0;i--){const r=rows[i];if(!(r.a.m&&r.a.m.povo482)||want.has(r.a))continue;if(r.d>DROP||(missing>0&&API.live.size>=CAP)){swapOut(r.a);missing--}}
 let n=0;for(const r of rows){if(n>=2||API.live.size>=CAP)break;if(want.has(r.a)&&!(r.a.m&&r.a.m.povo482)){if(upgrade(r.a))n++}}}
setInterval(()=>{try{tick()}catch(e){console.warn('Povo482',e)}},600);

/* Moradores: bases role=civil, sem arma e sem armadura. Nome, falas e label continuam os de spawnCitizen. */
/* o corpo combina com o nome (CNAMES): Pietra é mulher, Otto é homem; Duda pode ser os dois */
const SEXN={'Brígida':'f',Elsbeth:'f',Flora:'f',Helena:'f',Matilde:'f',Maud:'f',Nesta:'f',Petronela:'f',Aldo:'m',Cedric:'m',Godwin:'m',Gerold:'m',Ivo:'m',Leofric:'m',Otto:'m',Roderic:'m',Mirela:'f',Ysolde:'f',Brunhild:'f',Elowen:'f',Isolde:'f',Rowena:'f',Aldren:'m',Godric:'m',Edric:'m',Tormund:'m',Wulfric:'m',
 /* NAMES dos caçadores */Mirae:'f',Selin:'f',Yuna:'f',Hyejin:'f',Aiko:'f',Dara:'f',Nayra:'f',Talia:'f',Vega:'f',Voss:'m',Ryuga:'m',Taeho:'m',Kargan:'m',Draven:'m',Oren:'m',Bastian:'m',Ekko:'m',Kenji:'m',Lior:'m',Rurik:'m',Soren:'m'};
function sexOfName(nm){nm=String(nm||'').split(/[ ·]/)[0];return SEXN[nm]||null}
if(typeof spawnCitizen==='function'){const base=spawnCitizen;spawnCitizen=function(c){const n=base.apply(this,arguments);try{if(n&&!n.critter)register(n,{role:'civil',sex:sexOfName(n.name),seed:hash((c&&c.id)+'|'+n.name+'|'+Math.round(n.x)+'|'+Math.round(n.z)),region:regionOf(c)})}catch(_){}return n}}
/* Caçadores (spawnHunter e aliados): base role=hunter da família da classe, arma do jogo pelo Rank. Sem base da família → comportamento antigo. */
if(global.Hunters138){const base=Hunters138.attach;Hunters138.attach=function(actor,cls,rank,isCurrent){const fam=familyOf(cls);
  if(!API.ready||!API.hasRole('hunter',fam))return base.apply(this,arguments);
  const args=arguments,self=this;register(actor,{role:'hunter',family:fam,sex:sexOfName(actor.short||actor.name),cls,rank,isCurrent,fallback:()=>base.apply(self,args),weaponKind:weaponOf(cls),seed:hash((actor.home&&actor.home.id)+'|'+actor.name+'|'+cls+'|'+Math.round(actor.x||0)+'|'+Math.round(actor.z||0)),region:regionOf(actor.home)})}}

/* ---------- caçadores nomeados da v479 (tools/worldsim479.js) ---------- */
const NAMED={
 'Aldric das Brumas':{cls:0,sex:'m'},'Kallan Lâmina-do-Aço':{cls:1,sex:'m'},
 'Valen Radiante':{cls:5,sex:'m'},'Cynthia Alvorada':{cls:8,sex:'f'},
 'Torben Machado-de-Gelo':{cls:0,sex:'m'},'Eira Caçadora dos Montes':{cls:4,sex:'f'},
 'Farid Falcão-das-Dunas':{cls:4,sex:'m'},'Zahra Passo-Silencioso':{cls:22,sex:'f'},
 'Kaelen Arpoador':{cls:23,sex:'m'},'Marina Olho-da-Tormenta':{cls:11,sex:'f'},
 'Kaelen Garra-Verde':{cls:10,sex:'m'},'Sylas Sombra-da-Copa':{cls:4,sex:'m',race:'elf'}
};/* Edran fica de fora: é personagem da campanha (tools/npc456.js) */
const namedCd={};let namedT=20;
function rankFromWins(v){return Math.max(1,Math.min(5,Math.round((v||0)/7)))}
function spawnNamed(c,rid,h){const def=NAMED[h.name];if(!def||typeof makeChibi!=='function')return null;const fam=familyOf(def.cls);if(!API.hasRole('hunter',fam))return null;
 const cl=CLASSES[def.cls];if(!cl)return null;const ri=rankFromWins(h.victories),ci=def.cls;
 const m=makeChibi({body:cl.body,hair:cl.hair||0x222222,wep:cl.wep,wcol:cl.sk&&cl.sk[0]&&cl.sk[0].col,gk:CLASS_GK[ci],tint:CLASS_TINT[ci],shield:ci===0});
 const a=[0,Math.PI/2,Math.PI,Math.PI*1.5][Math.floor(Math.random()*4)],x=c.x+Math.cos(a)*40,z=c.z+Math.sin(a)*40;m.root.position.set(x,0,z);scene.add(m.root);
 const n={kind:'hunter',home:c,m,x,z,face:0,r:.5,name:h.name+' ['+RANKS[ri].id+']',short:h.name,rank:ri,col:RANKS[ri].c,t:Math.random()*9,tx:c.x+(Math.random()-.5)*20,tz:c.z+(Math.random()-.5)*20,wait:0,path:[],label:'F · FALAR COM '+h.name.toUpperCase(),named482:h.name};
 const R=WorldSim479.REGIONS[rid];n.use=()=>speech153(n,regionLine116(c)||pick(HLINES),h.rank+' de '+(R?R.name:c.name));npcs.push(n);
 register(n,{role:'hunter',family:fam,cls:ci,rank:ri,sex:def.sex,race:def.race||null,weaponKind:weaponOf(ci),seed:hash('named|'+h.name),region:rid,priority:true});return n}
setInterval(()=>{try{namedT-=5;if(namedT>0||!API.ready||typeof L==='undefined'||L.mode!=='world'||typeof player==='undefined'||!player||!global.WorldSim479)return;namedT=40;
 if(typeof isNight==='function'&&isNight())return;const nc=nearestCity(player.x,player.z);if(!nc||!nc.c||nc.d>260||(typeof cityFallen==='function'&&cityFallen(nc.c)))return;
 const rid=regionOf(nc.c),R=WorldSim479.REGIONS[rid];if(!R||!R.hunters)return;if(npcs.some(n=>n.named482&&!n.gone&&n.home===nc.c))return;if(Math.random()>.3)return;
 const now=Date.now(),opts=R.hunters.filter(h=>NAMED[h.name]&&!(namedCd[h.name]>now)&&!npcs.some(n=>n.named482===h.name&&!n.gone));if(!opts.length)return;
 const h=opts[Math.floor(Math.random()*opts.length)];if(spawnNamed(nc.c,rid,h))namedCd[h.name]=now+6*60*1000}catch(e){console.warn('Povo482 nomeado',e)}},5000);

/* ---------- dragões ---------- */
const Dragons=(()=>{
 /* ids aceitos no índice para cada espécie (o lote de geração pode usar um ou outro nome) */
 const IDS={dragonete:['dragonete','dragonete482'],dragaoancio:['dragao_anciao','dragaoancio','dragao_ancio','dragao_anciao482'],
  dragao_gelido_ymiria:['dragao_gelido_ymiria'],serpe_zahar:['serpe_zahar'],dragao_musgo_verden:['dragao_musgo_verden']};
 /* espécies novas: porte Enorme, coerentes com o Dragão Ancião (480 de vida, 36 de dano, rank 7) */
 const NEW={
  dragao_gelido_ymiria:{h:3.3,bio:['neve'],K:{mon:'dragao_gelido_ymiria',gk:'Skeleton_Mage',n:'Dragão Gélido de Ymiria',hp:440,dmg:34,spd:3.6,ai:'wraith',range:11,wind:.5,atkCd:1.9,xp:90,scale:1,body:0x8fd8ff,wep:'none',r:.97,rk:7,bio:'neve'}},
  serpe_zahar:{h:3.0,bio:['deserto'],K:{mon:'serpe_zahar',gk:'Skeleton_Warrior',n:'Serpe de Zahar',hp:420,dmg:35,spd:4.2,ai:'lunge',range:2.6,wind:.4,atkCd:1.5,xp:88,scale:1,body:0xd8b070,wep:'none',r:.95,rk:6,bio:'deserto'}},
  dragao_musgo_verden:{h:3.2,bio:['floresta','pantano'],K:{mon:'dragao_musgo_verden',gk:'Skeleton_Warrior',n:'Dragão-Musgo de Verden',hp:460,dmg:32,spd:3.4,ai:'melee',range:2.6,wind:.5,atkCd:1.6,xp:92,scale:1,body:0x5a8a3a,wep:'none',r:.99,rk:6,bio:'floresta'}}
 };
 /* v486: escala pedida por Ian em relação ao Viajante (2,05): Dragonete ~2x, adultos ~4x, Ancião ~5x (acima do porte do Livro) */
 const SIZE482={dragonete:4.2,dragao_gelido_ymiria:8.4,serpe_zahar:7,dragao_musgo_verden:8.2,dragaoancio:10.2};
 const CHANCE=.02,ready={};
 const find=(clips,names)=>{for(const n of names){const c=clips.find(a=>a.name===n||a.name.endsWith('|'+n));if(c)return c.name}for(const n of names){const l=n.toLowerCase(),c=clips.find(a=>a.name.toLowerCase().includes(l));if(c)return c.name}return null};
 function aliases(clips,ranged){const a={},put=(k,names)=>{const n=find(clips,names);if(n)a[k]=n};
  put('Idle',['Idle','Flying_Idle','Fly_Idle']);put('Walk',['Walk']);put('Running_A',['Run','Running','Walk','Fly']);put('Fly',['Fly','Flying']);put('Breath',['Breath','Sopro','Fire_Breath','Fire']);
  put('ATK',ranged?['Breath','Sopro','Fire_Breath','Bite','Attack','Headbutt']:['Bite','Attack','Headbutt','Breath']);put('Bite',['Bite','Attack']);put('Hit',['Hit','HitReact','Hit_React']);put('Death_A',['Death','Die']);
  if(!a.Idle&&clips[0])a.Idle=clips[0].name;return a}
 /* depois de trocado, o carregador antigo (m_dragonete.glb) não pode sobrescrever o modelo novo */
 function lock(k,scene,clips,h){for(const [obj,val] of [[MON.list,scene],[MON.clips,clips],[MON.h,h]])Object.defineProperty(obj,k,{configurable:true,enumerable:true,get:()=>val,set:()=>{}})}
 function loadOne(k,entry){const D0=MON_DEF[k]||{};const ld=new T.GLTFLoader();if(global.MeshoptDecoder)ld.setMeshoptDecoder(global.MeshoptDecoder);
  ld.load(DIR+entry.id+'.glb?v='+V,g=>{const clips=typeof fixUserRigClips413==='function'?fixUserRigClips413(g.animations):g.animations;const ranged=(KINDS[k]||NEW[k]&&NEW[k].K||{}).ai==='wraith';
   const h0=D0.h||(NEW[k]&&NEW[k].h)||3,hS=SIZE482[k]||h0,f=hS/h0;
   const D=MON_DEF[k]={...D0,h:hS,userRig:true,externalLoader314:true,file482:entry.id,a:aliases(clips,ranged)};
   const b=monsterBounds132(g.scene);lock(k,g.scene,clips,(b.max.y-b.min.y)||1);ready[k]=true;
   if(NEW[k]&&!KINDS[k])KINDS[k]={...NEW[k].K};
   /* v486 (Ian: "os dragões têm que ser muito maiores... o jogo tem escala"): corpo, alcance e passada crescem junto com o tamanho */
   const Kd=KINDS[k];if(Kd&&f>1&&!Kd.size486){Kd.size486=f;if(Kd.r)Kd.r*=f;if(!ranged&&Kd.range)Kd.range*=Math.sqrt(f)*1.4;if(Kd.spd)Kd.spd*=Math.sqrt(f);}
   if(k==='serpe_zahar')linkQuest();
  },undefined,e=>{console.warn('Povo482: dragão '+entry.id+' não carregou; mantendo o modelo antigo',e);restore(k)})}
 /* sem arquivo novo: o substituto marcou externalLoader314 cedo; carrega o GLB antigo de volta */
 function restore(k){const D=MON_DEF[k];if(!D||!D.wait482)return;delete D.externalLoader314;delete D.wait482;if(MON.list[k])return;const ld=new T.GLTFLoader();if(global.MeshoptDecoder)ld.setMeshoptDecoder(global.MeshoptDecoder);
  ld.load('models/m_'+k+'.glb',g=>{MON.list[k]=g.scene;MON.clips[k]=g.animations;const b=monsterBounds132(g.scene);MON.h[k]=(b.max.y-b.min.y)||1},undefined,()=>{})}
 /* antes do índice chegar, segura o carregador antigo dos dois dragões a substituir (evita baixar o antigo à toa) */
 for(const k of ['dragonete','dragaoancio'])if(typeof MON_DEF!=='undefined'&&MON_DEF[k]&&!(typeof MON!=='undefined'&&MON.list[k])){MON_DEF[k].externalLoader314=true;MON_DEF[k].wait482=true}
 function init(list){const ids=new Set(list.map(b=>b.id));
  for(const [k,names] of Object.entries(IDS)){const id=names.find(n=>ids.has(n));if(id)loadOne(k,API.byId[id]);else restore(k)}}
 function linkQuest(){const Q=global.Quests480&&Quests480.CATALOG&&Quests480.CATALOG.bounty_wyrm_zahar;if(!Q)return;Q.bossKind='serpe_zahar';
  Q.desc='Uma serpe gigantesca que nada por baixo das dunas tem atacado poços artesianos e engolido camelos de carga inteiros. Cace a fera no coração das dunas.'}
 if(typeof spawnKind==='function'){const sk0=spawnKind;spawnKind=function(k,x,z,gr,extra){try{/* só na geração natural (wild), nunca em missão, evento, invasão ou cena; no máximo 1 dragão novo vivo */if(extra&&extra.wild&&!extra.breaker&&!(extra.boss||extra.rival||extra.noFendido||extra.noInedita||extra.noDragon482)&&!(typeof enemies!=='undefined'&&enemies.some(e=>e&&!e.dead&&e.hp>0&&NEW[e.kind]))&&typeof L!=='undefined'&&L.mode==='world'&&KINDS[k]&&!NEW[k]&&Math.random()<CHANCE){
    const bio=typeof biomeAt==='function'?biomeAt(x,z):null,opts=Object.keys(NEW).filter(d=>ready[d]&&NEW[d].bio.includes(bio)&&(gr||0)>=NEW[d].K.rk-1);
    if(opts.length)return sk0.call(this,opts[Math.floor(Math.random()*opts.length)],x,z,gr,{...(extra||{}),noFendido:true,noInedita:true,noDragon482:true})}}catch(_){}return sk0.apply(this,arguments)}}
 return {init,NEW,IDS,ready,aliases}})();
API.Dragons=Dragons;API.regionOf=regionOf;API.familyOf=familyOf;API.register=register;API.tick=tick;API.spawnNamed=spawnNamed;API.NAMED=NAMED;API.PAL=PAL;
global.Povo482=API;
API.load();
})(window);
