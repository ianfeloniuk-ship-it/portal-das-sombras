/* v475 (Ian, 19/10/2026): "as habilidades têm que dar dano em toda área que ela estiver… o monstro vai e a habilidade
   visualmente ainda está acontecendo e o monstro transpassa ela, isso tem que ser corrigido" (ex.: Maremoto empurrava
   só num cone à frente, mas as ondas apareciam em 6 direções e os monstros atravessavam a água).
   Regra nova, igual para TODAS as habilidades de dano de todas as classes: enquanto uma peça do efeito visual
   (onda, chama, anel, fissura, espinhos, raio, nuvem, água, flipbook…) estiver na tela, ela é área de verdade.
   - Monstro que encosta na peça leva o dano da habilidade uma vez por uso (quem já levou pelo acerto normal não
     leva de novo — nada de dano dobrado).
   - Enquanto a peça existir, o monstro não atravessa: é empurrado para fora (na direção em que a peça avança, ou
     para longe do centro). Chefes levam o dano mas não são empurrados.
   - Habilidades de cura, defesa, movimento, invocação e apoio não viram área (não empurram nem ferem).
   - Prender/puxar/lentidão/armadilha/selo: a área fere (se a habilidade tem dano) mas não empurra.
   - Empurrões sem dano (Maremoto e afins, força 0): passam a ferir como um golpe normal (força 1).
   A área é a sombra no chão de cada malha/sprite do efeito (casco das quinas da caixa/projeção), atualizada a cada quadro,
   então acompanha o tamanho, a rotação e o avanço do visual. Partículas pequenas (gotas, faíscas) e peças quase
   transparentes ou no alto (meteoro caindo) não contam. */
(function(){
'use strict';
const V=window.VFX302;
if(typeof fxs==='undefined'||typeof runSkill!=='function'||typeof hurtEnemy!=='function')return;
/* peças vivas: efeitos do jogo (fxs, src/core/330-340), vfx302/328 e sprites realistas flip470 */
function* pieces(){
  for(const en of fxs)yield en;
  if(V&&V.live)for(const en of V.live)yield en;
  if(window.Flip470&&Flip470.live)for(const en of Flip470.live)yield {o:en.sp,flip:true,en};
}
const T=THREE;
const Z=window.Zone475={on:true,stats:{casts:0,pieces:0,hits:0,pushes:0}};
const HARM_T=/^(bolt|chain|cone|dash_strike|dot|nova|rain|stone_lance|thunderstorm|holy_bind|push)$/;
const HARM_K=/^(pulses|line|push|area|target|cone|slow|interrupt|bolt|blind|root|pull|fan|conditional260|chain|burn|venom|trap|seal|release|execute|detonate|slowzone|device|dismantle|capture|consume|echo|reprise|weaken)$/;
function harmful(sk){if(!sk)return false;return HARM_K.test(sk.effect||'')||HARM_T.test(sk.t||'')}
/* habilidades que prendem ou puxam: a área fere, mas não empurra para fora (senão soltaria o monstro) */
const HOLD=/^(root|slow|slowzone|seal|trap|capture|pull|venom|burn|consume)$/;
/* empurrões sem dano (ex.: Maremoto, pow 0): Ian quer dano em toda a área → contam como golpe normal (força 1) */
function dmgOf(sk){try{if(Number(sk.pow)>0)return skillDamage(sk);if(/^(push)$/.test(sk.effect||sk.t||''))return skillDamage({...sk,pow:1})}catch(_){}return 0}

let cast=null;const seen=new WeakSet(),owned=new Map();/* entrada do VFX → lançamento */
const clock=()=>performance.now()/1000;
function adopt(){for(const en of pieces()){if(seen.has(en))continue;
  if(!cast||clock()>cast.until)continue;
  seen.add(en);
  const o=en.o,P=player;if(!o||!P)continue;const px=o.position?o.position.x:P.x,pz=o.position?o.position.z:P.z;
  if(Math.hypot(px-P.x,pz-P.z)>cast.reach)continue;/* efeito de outro (chefe) longe do jogador */
  owned.set(en,cast);cast.pieces++;Z.stats.pieces++}}

function wrapCast(R0){return function(sk){
 if(!Z.on||!harmful(sk)||!player||(cast&&cast.sk===sk&&clock()<cast.t0+.05))return R0.apply(this,arguments);
 adopt();/* o que já estava na tela antes não é deste lançamento */
 const dmg=dmgOf(sk);
 const c={sk,dmg,t0:clock(),hold:HOLD.test(sk.effect||sk.t||''),hit:new Set(),until:clock()+2.2,reach:(sk.range||12)+(sk.radius||6)+6,pieces:0,cx:player.x,cz:player.z};
 cast=c;Z.stats.casts++;
 try{return R0.apply(this,arguments)}finally{adopt()}}}
/* habilidades comuns passam por runSkill; as do catálogo (kit111) por kitCast111 → kitRun111 */
runSkill=wrapCast(runSkill);if(typeof kitRun111==='function')kitRun111=wrapCast(kitRun111);

/* quem levou dano normal da habilidade entra no "já atingido" do lançamento */
const H0=hurtEnemy;
hurtEnemy=function(e,amt,sx,sz,o){const r=H0.apply(this,arguments);try{if(cast&&o&&o.skillHit&&clock()<cast.until+3)cast.hit.add(e)}catch(_){}return r};

/* ---------- geometria: sombra no chão de cada malha / sprite ---------- */
const v3=new T.Vector3();
function hull(pts){pts.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);const lo=[],up=[];
 for(const p of pts){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)}
 for(let i=pts.length-1;i>=0;i--){const p=pts[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)}
 up.pop();lo.pop();return lo.concat(up)}
function opacityOf(m){const mt=Array.isArray(m.material)?m.material[0]:m.material;if(!mt)return 1;let op=mt.opacity??1;if(mt.uniforms){for(const k of ['opacity','uOpacity','uAlpha','alpha'])if(mt.uniforms[k]&&typeof mt.uniforms[k].value==='number'){op=Math.min(op,mt.uniforms[k].value)}}return op}
function shapes(root){const out=[];root.updateMatrixWorld(true);
 root.traverse(m=>{if(!m.isMesh&&!m.isInstancedMesh&&!m.isSprite)return;if(!m.visible)return;let p=m;while(p){if(!p.visible)return;p=p.parent}
  if(opacityOf(m)<.12)return;
  if(m.isSprite){
    const px=m.position.x,py=m.position.y,pz=m.position.z;
    if(py>3.2||py<-1.0)return;
    const r=Math.max(.35,(m.scale.x||1)*.45);
    out.push({h:[[px-r,pz-r],[px+r,pz-r],[px+r,pz+r],[px-r,pz+r]],cx:px,cz:pz});
    return;
  }
  const g=m.geometry;if(!g)return;if(!g.boundingBox)g.computeBoundingBox();const bb=g.boundingBox;if(!bb||bb.isEmpty())return;
  const pts=[];let minY=1e9,maxY=-1e9;
  for(let i=0;i<8;i++){v3.set(i&1?bb.max.x:bb.min.x,i&2?bb.max.y:bb.min.y,i&4?bb.max.z:bb.min.z).applyMatrix4(m.matrixWorld);pts.push([v3.x,v3.z]);if(v3.y<minY)minY=v3.y;if(v3.y>maxY)maxY=v3.y}
  if(minY>2.8||maxY<-.8)return;/* no alto (meteoro caindo) ou enterrado */
  const h=hull(pts);if(h.length<3)return;let ax=1e9,bx=-1e9,az=1e9,bz=-1e9;for(const [x,z] of h){ax=Math.min(ax,x);bx=Math.max(bx,x);az=Math.min(az,z);bz=Math.max(bz,z)}
  if(Math.max(bx-ax,bz-az)<.45)return;/* gota/faísca minúscula */
  out.push({h,cx:(ax+bx)/2,cz:(az+bz)/2})});
 return out}
/* distância com sinal do ponto ao polígono convexo (negativa = dentro) e a saída mais curta */
function inside(h,x,z){let best=1e9,nx=0,nz=0,inn=true;for(let i=0;i<h.length;i++){const a=h[i],b=h[(i+1)%h.length],ex=b[0]-a[0],ez=b[1]-a[1],L=Math.hypot(ex,ez)||1,ox=ez/L,oz=-ex/L;/* normal para fora (casco anti-horário) */
  const d=(x-a[0])*ox+(z-a[1])*oz;if(d>0)inn=false;const t=Math.max(0,Math.min(1,((x-a[0])*ex+(z-a[1])*ez)/(L*L))),qx=a[0]+ex*t,qz=a[1]+ez*t,dd=Math.hypot(x-qx,z-qz);if(dd<best){best=dd;nx=ox;nz=oz}}
 return {d:inn?-best:best,nx,nz}}

const prevC=new Map();
function step(){if(!Z.on||!player)return;adopt();if(!owned.size)return;
 const alive=new Set(pieces());
 for(const [en,c] of owned){if(!alive.has(en)){owned.delete(en);prevC.delete(en);continue}
  const S=shapes(en.o);if(!S.length)continue;
  for(const e of enemies){if(!e||e.dead||e.ally||e.friendly217)continue;const r=(e.r||.5);
   for(const s of S){if(Math.abs(e.x-s.cx)>40||Math.abs(e.z-s.cz)>40)continue;const q=inside(s.h,e.x,e.z);if(q.d>r)continue;
    if(!c.hit.has(e)){c.hit.add(e);if(c.dmg>0){try{H0(e,c.dmg,c.cx,c.cz,{fromPlayer:true,skillHit:true,pierce:true,kb:0,zone475:true});Z.stats.hits++}catch(_){}}}
    if(e.isBoss||e.dead||c.hold)break;
    /* empurra para fora: na direção em que a peça avança, senão para longe do centro da habilidade */
    const pc=prevC.get(en),mx=pc?s.cx-pc.x:(en.vel?en.vel.x:(en.vx||0)),mz=pc?s.cz-pc.z:(en.vel?en.vel.z:(en.vz||0)),mv=Math.hypot(mx,mz);
    let dx,dz,amt;
    if(mv>.01){dx=mx/mv;dz=mz/mv;amt=Math.min(1.2,mv+.15)}
    else{const ox=e.x-(c.cx??s.cx),oz=e.z-(c.cz??s.cz),oL=Math.hypot(ox,oz);if(oL>.05){dx=ox/oL;dz=oz/oL}else{dx=q.nx||1;dz=q.nz||0}amt=Math.min(1.2,r-q.d+.08)}
    const nx=e.x+dx*amt,nz=e.z+dz*amt;if(typeof freeAt!=='function'||freeAt(nx,nz,r)){e.x=nx;e.z=nz;if(e.m&&e.m.root){e.m.root.position.x=nx;e.m.root.position.z=nz}Z.stats.pushes++}
    break}}
  const s0=S[0];prevC.set(en,{x:s0.cx,z:s0.cz})}}
Z.step=step;Z.scanZones=step;

(function hook(){if(typeof camUpdate!=='function'){setTimeout(hook,300);return}const prev=camUpdate;camUpdate=function(){prev.apply(this,arguments);try{step()}catch(err){if(!Z.err)console.warn('zone475',err);Z.err=err}}})();
})();
