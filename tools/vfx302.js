/* v302 (Ian): efeitos visuais de verdade para as habilidades (antes quase tudo era um anel brilhando).
   Cada habilidade lançada escolhe um efeito pelo nome, pelo elemento e pelo tipo:
   fissura no chão com pedras e tremor, espinhos de gelo, anel de fogo com brasas, meteoros, relâmpagos do céu,
   pilar de luz, rastro de flecha perfurante, arco de corte, cúpula de escudo, cura, círculo rúnico, vórtice, vento, fumaça, veneno. */
(function(){
const T=THREE,live=[];
/* o jogo já ergue sozinho tudo que está no mundo até o relevo (como fxRing); aqui a altura é relativa ao chão */
function H(x,z){return 0}
function add(o,dur,fn){scene.add(o);live.push({o,t:0,dur,fn})}
function loop(){requestAnimationFrame(loop);const dt=1/60;for(let i=live.length-1;i>=0;i--){const L=live[i];L.t+=dt;const k=Math.min(1,L.t/L.dur);try{L.fn&&L.fn(k,L.t,L.o)}catch(_){}if(k>=1){scene.remove(L.o);L.o.traverse(c=>{if(c.geometry&&!c.geometry.userData?.shared)c.geometry.dispose?.()});live.splice(i,1)}}}
loop();
/* v312: energia com shader (fluxo + borda) no lugar do brilho chapado */
const add2=(o,col,op=1)=>window.Shaders312?Shaders312.energy(col,op):new T.MeshBasicMaterial({color:col,transparent:true,opacity:op,depthWrite:false,blending:T.AdditiveBlending});
const toon=(col)=>new T.MeshToonMaterial({color:col,transparent:true});
const R=(a,b)=>a+Math.random()*(b-a);
function fade(o,a){o.traverse(c=>{if(c.material){c.material.transparent=true;if(c.material.userData.o0==null)c.material.userData.o0=c.material.opacity;c.material.opacity=c.material.userData.o0*a}})}
/* ---------- efeitos ---------- */
function fissure(x,z,ang,len=7,col=0xff8a3a){const g=new T.Group();g.position.set(x,H(x,z)+.16,z);g.rotation.y=ang;
 const crack=new T.MeshBasicMaterial({color:0x140b06,transparent:true,polygonOffset:true,polygonOffsetFactor:-6,polygonOffsetUnits:-6}),glowM=window.Shaders312?Shaders312.lava(col,.95):new T.MeshBasicMaterial({color:col,transparent:true,opacity:.95,depthWrite:false});glowM.polygonOffset=true;glowM.polygonOffsetFactor=-8;glowM.polygonOffsetUnits=-8;g.renderOrder=5;
 let px=0;for(let i=0;i<10;i++){const seg=len/10,w=R(.25,.55)*(1-i/14),q=new T.Mesh(new T.PlaneGeometry(w,seg*1.15),crack);q.rotation.x=-Math.PI/2;const off=R(-.35,.35);q.position.set(px+off,0,i*seg+seg/2);q.rotation.z=R(-.4,.4);q.renderOrder=5;g.add(q);const gl=new T.Mesh(new T.PlaneGeometry(w*.55,seg*1.05),glowM);gl.renderOrder=7;gl.rotation.x=-Math.PI/2;gl.position.set(px+off,.04,i*seg+seg/2);gl.rotation.z=q.rotation.z;g.add(gl);px=off*.6;
  for(const sd of [-1,1])if(Math.random()<.6){const b=new T.Mesh(new T.PlaneGeometry(R(.08,.18),R(.5,1.1)),crack);b.rotation.x=-Math.PI/2;b.rotation.z=sd*R(.6,1.1);b.position.set(px+sd*w*.7,.005,i*seg+seg/2);g.add(b)}}
 const rocks=[];for(let i=0;i<9;i++){const r=new T.Mesh(new T.DodecahedronGeometry(R(.15,.35),0),toon(0x6a5a48));const zz=R(0,len);r.position.set(R(-.6,.6),0,zz);r.userData.v=[R(-1.5,1.5),R(4,7),R(-1,1)];g.add(r);rocks.push(r)}
 add(g,2.6,(k,t)=>{for(const r of rocks){r.position.x+=r.userData.v[0]*.016;r.position.y=Math.max(0,r.position.y+r.userData.v[1]*.016);r.userData.v[1]-=14*.016;r.position.z+=r.userData.v[2]*.016;r.rotation.x+=.1;r.rotation.y+=.07}glowM.opacity=.9*(1-k)*(.7+.3*Math.sin(t*20));if(k>.7)fade(g,(1-k)/.3)});
 try{shake(.45)}catch(_){}dust(x+Math.sin(ang)*len/2,z+Math.cos(ang)*len/2,0x9a8a70,10)}
function quakeRing(x,z,r=5,col=0xc8a060){for(let i=0;i<5;i++){const a=i/5*Math.PI*2+R(0,.6);fissure(x,z,a,r*R(.7,1),col)}}
function dust(x,z,col,n=8){const g=new T.Group();g.position.set(x,H(x,z),z);const ps=[];for(let i=0;i<n;i++){const s=new T.Mesh(new T.SphereGeometry(R(.18,.35),6,5),new T.MeshToonMaterial({color:col,transparent:true,opacity:.55}));s.position.set(R(-1.5,1.5),R(.2,.8),R(-1.5,1.5));g.add(s);ps.push(s)}
 add(g,1.1,k=>{for(const s of ps){s.scale.setScalar(1+k);s.position.y+=.01}fade(g,1-k)})}
function spikes(x,z,col=0xbfe8ff,n=9,r=3.5,mat='ice'){const g=new T.Group();g.position.set(x,H(x,z),z);const list=[];for(let i=0;i<n;i++){const a=R(0,Math.PI*2),d=R(.6,r),h=R(1,2.4);const m=new T.Mesh(new T.ConeGeometry(R(.2,.4),h,mat==='ice'?5:6),mat==='ice'?(window.Crystal310?Crystal310.mat(col,.9):new T.MeshToonMaterial({color:col,emissive:0x2a5a7a,transparent:true})):/* v331: pedra com brilho próprio leve, para não sumir à noite */new T.MeshToonMaterial({color:col,emissive:0x4a3824,transparent:true}));m.position.set(Math.cos(a)*d,-h,Math.sin(a)*d);m.rotation.z=R(-.25,.25);m.rotation.x=R(-.25,.25);m.userData.h=h;g.add(m);list.push(m)}
 add(g,2,k=>{const up=Math.min(1,k*6);for(const m of list)m.position.y=-m.userData.h*(1-up)+(up>=1?0:0)-(k>.75?(k-.75)*4*m.userData.h:0);if(k>.75)fade(g,(1-k)/.25)});dust(x,z,mat==='ice'?0xe8f4ff:0x8a7a60,6)}
function spikeLine(x,z,ang,len,col,mat){const n=7;for(let i=0;i<n;i++){const d=(i+1)/n*len;setTimeout(()=>spikes(x+Math.sin(ang)*d,z+Math.cos(ang)*d,col,3,.8,mat),i*55)}}
function streak(x,z,ang,len=14,col=0xe8f0ff){const g=new T.Group();const y=H(x,z)+1.1;g.position.set(x,y,z);g.rotation.y=ang;const s=new T.Mesh(new T.BoxGeometry(.12,.12,len),add2(0,col,.9));s.position.z=len/2;g.add(s);const s2=new T.Mesh(new T.BoxGeometry(.5,.5,len),add2(0,col,.25));s2.position.z=len/2;g.add(s2);
 /* v331: aros menores e mais discretos (com várias flechas viravam uma pilha de argolas) */const rings=[];for(let i=1;i<4;i++){const r=new T.Mesh(new T.TorusGeometry(.32,.03,6,20),add2(0,col,.45));r.position.z=i*len/4;g.add(r);rings.push(r)}
 add(g,.5,k=>{for(const r of rings)r.scale.setScalar(1+k*1.2);s.scale.x=s.scale.y=1-k;fade(g,1-k)})}
function aura(col=0xffb040,follow=true,n=18){const g=new T.Group();const ps=[];for(let i=0;i<n;i++){const p=new T.Mesh(new T.SphereGeometry(.08,4,3),add2(0,col,1));p.userData={a:R(0,6.28),r:R(.6,1.1),y:R(0,.4),v:R(1.2,2.2)};g.add(p);ps.push(p)}const ring=new T.Mesh(new T.RingGeometry(.8,1.1,32),add2(0,col,.6));ring.rotation.x=-Math.PI/2;g.add(ring);
 add(g,1.3,(k,t)=>{const p=player;g.position.set(p.x,H(p.x,p.z)+.05,p.z);for(const q of ps){const u=q.userData;u.y+=u.v*.016;q.position.set(Math.cos(u.a+t*3)*u.r,u.y,Math.sin(u.a+t*3)*u.r)}ring.scale.setScalar(1+k*.6);fade(g,1-k)})}
function heal(x,z,col=0x6fe39a,follow=true){const g=new T.Group();const cs=[];for(let i=0;i<10;i++){const c=new T.Group();const a=new T.Mesh(new T.BoxGeometry(.32,.09,.09),add2(0,col,1)),b=new T.Mesh(new T.BoxGeometry(.09,.32,.09),add2(0,col,1));c.add(a,b);c.position.set(R(-1,1),R(0,.6),R(-1,1));c.userData.v=R(1,2);g.add(c);cs.push(c)}
 add(g,1.5,k=>{const p=follow&&player?player:{x,z};g.position.set(p.x,H(p.x,p.z),p.z);for(const c of cs){c.position.y+=c.userData.v*.016;c.rotation.y+=.05}fade(g,1-k)})}
function wind(x,z,ang,col=0xd8f4ff,len=6){const g=new T.Group();g.position.set(x,H(x,z)+1,z);g.rotation.y=ang;const arcs=[];for(let i=0;i<5;i++){const a=new T.Mesh(new T.TorusGeometry(R(1,2.2),.05,4,24,Math.PI*.7),add2(0,col,.8));a.rotation.x=Math.PI/2;a.rotation.z=Math.PI*.15+Math.PI;a.position.set(R(-1,1),R(-.5,.5),0);g.add(a);arcs.push(a)}
 add(g,.6,k=>{for(const a of arcs)a.position.z=k*len;fade(g,1-k)})}
function dashTrail(col=0xffffff){const p=player;if(!p)return;const x0=p.x,z0=p.z;setTimeout(()=>{const x1=player.x,z1=player.z,d=Math.hypot(x1-x0,z1-z0);if(d<.5)return;const ang=Math.atan2(x1-x0,z1-z0);const g=new T.Group();g.position.set(x0,H(x0,z0)+1,z0);g.rotation.y=ang;for(let i=0;i<4;i++){const s=new T.Mesh(new T.BoxGeometry(.6-i*.1,1.4-i*.2,d),add2(0,col,.25-i*.05));s.position.z=d/2;g.add(s)}const lines=[];for(let i=0;i<6;i++){const l=new T.Mesh(new T.BoxGeometry(.03,.03,d),add2(0,col,.9));l.position.set(R(-.4,.4),R(-.6,.6),d/2);g.add(l);lines.push(l)}add(g,.4,k=>fade(g,1-k))},140)}
function shockwave(x,z,col,r=4){const g=new T.Group();g.position.set(x,H(x,z)+.06,z);const m=new T.Mesh(new T.RingGeometry(.85,1,48),add2(0,col,.9));m.rotation.x=-Math.PI/2;g.add(m);const m2=new T.Mesh(new T.CylinderGeometry(1,1,.6,40,1,true),add2(0,col,.35));m2.position.y=.3;g.add(m2);add(g,.5,k=>{g.scale.setScalar(.5+k*r);fade(g,1-k)});dust(x,z,0x9a8a70,5)}
/* ---------- v334 (Ian): peças refeitas com shader próprio (Shaders312) — chama que se move, fumaça, raio, pilar, escudo, círculo mágico, corte ---------- */
const SH=()=>window.Shaders312;
const yawCam=(x,z)=>Math.atan2(camera.position.x-x,camera.position.z-z);
/* fogueira: várias línguas de fogo balançando; o.col tinge a chama (azul, roxa, verde…) */
function flames(x,z,o={}){const n=o.n??5,r=o.r??.5,h=o.h??1.8,dur=o.dur??1.2,col=o.col??null;const g=new T.Group();g.position.set(x,H(x,z),z);const fl=[];
 for(let i=0;i<n;i++){const a=R(0,6.28),d=i?R(0,r):0,hh=h*R(.65,1.1)*(i?1:1.15),f=new T.Mesh(new T.ConeGeometry(hh*R(.22,.32),hh,10,6,true),SH().fire(1,col));f.position.set(Math.cos(a)*d,hh/2,Math.sin(a)*d);f.userData.h=hh;g.add(f);fl.push(f)}
 const glow=new T.Mesh(new T.CircleGeometry(r+h*.28,20),SH().lava(col||0xff7a2a,.4));glow.rotation.x=-Math.PI/2;glow.position.y=.04;g.add(glow);
 const emb=[];for(let i=0;i<n*2;i++){const e=new T.Mesh(new T.SphereGeometry(.05,4,3),add2(0,col||0xffd070,1));e.position.set(R(-r,r),R(0,h*.6),R(-r,r));e.userData.v=R(1.5,3.5);g.add(e);emb.push(e)}
 add(g,dur,k=>{const s=k<.15?k/.15:k>.7?(1-k)/.3:1;for(const f of fl){f.scale.set(1,Math.max(.01,s),1);f.position.y=f.userData.h*s/2}glow.material.opacity=.4*s;for(const e of emb){e.position.y+=e.userData.v*.016;e.material.opacity=1-k}});return g}
function fireRing(x,z,r=4.5,col=0xff6a1e){const g=new T.Group();g.position.set(x,H(x,z),z);const fl=[],n=Math.max(10,Math.round(r*7)),tint=(col===0xff6a1e||col===0xff5a1e||col===0xff3a00)?null:col;
 for(let i=0;i<n;i++){const a=i/n*Math.PI*2,hh=R(1,1.9),f=new T.Mesh(new T.ConeGeometry(hh*.26,hh,8,5,true),SH().fire(1,tint));f.userData={a,h:hh};g.add(f);fl.push(f)}
 const scorch=new T.Mesh(new T.RingGeometry(.55,1,40),SH().lava(col,.7));scorch.rotation.x=-Math.PI/2;scorch.position.y=.04;g.add(scorch);
 const emb=[];for(let i=0;i<20;i++){const e=new T.Mesh(new T.SphereGeometry(.06,4,3),add2(0,0xffd070,1));e.position.set(R(-r,r),R(0,.5),R(-r,r));e.userData.v=R(1.5,3.5);g.add(e);emb.push(e)}
 add(g,1.2,k=>{const rr=.5+(r-.5)*Math.min(1,k*2.2),s=k>.6?(1-k)/.4:Math.min(1,k*8);for(const f of fl){const u=f.userData;f.position.set(Math.cos(u.a)*rr,u.h*s/2,Math.sin(u.a)*rr);f.scale.set(1,Math.max(.01,s),1)}scorch.scale.setScalar(rr);scorch.material.opacity=.7*s;for(const e of emb){e.position.y+=e.userData.v*.016;e.material.opacity=1-k}})}
/* meteoro: rocha incandescente com cauda de chama; rocky = pedra comum com poeira */
function meteor(x,z,delay=0,col=0xff5a1e,rocky=false){setTimeout(()=>{const g=new T.Group();const y0=H(x,z);g.position.set(x+4,y0+16,z-3);
 const rock=new T.Mesh(new T.DodecahedronGeometry(.6,0),rocky?new T.MeshToonMaterial({color:col,emissive:0x4a3824}):SH().lava(col,1));g.add(rock);
 const tail=new T.Mesh(new T.ConeGeometry(.75,5,10,6,true),rocky?SH().smoke(0x9a8a70,.7):SH().fire(1,col===0xff5a1e?null:col));tail.rotation.x=-Math.PI/2;tail.position.z=-2.6;g.add(tail);g.lookAt(x,y0,z);
 add(g,.55,k=>{g.position.set(x+4*(1-k),y0+16*(1-k),z-3*(1-k));rock.rotation.z+=.3;if(k>=1){if(rocky){dust(x,z,0x9a8a70,12);spikes(x,z,col,5,1.2,'rock')}else{flames(x,z,{n:6,r:1,h:2.2,dur:.9,col:col===0xff5a1e?null:col});fireRing(x,z,2.5,col)}try{shake(.18)}catch(_){}}})},delay)}
/* raio do céu: fio elétrico que treme e ramifica, clarão e faíscas */
function bolt(x,z,col=0xfff36b){const y0=H(x,z),g=new T.Group();g.position.set(x,y0,z);const hgt=14,ps=[];
 for(let i=0;i<2;i++){const p=new T.Mesh(new T.PlaneGeometry(i?5:3.2,hgt),SH().electric(col,1,0));p.position.y=hgt/2;g.add(p);ps.push(p)}
 const flash=new T.Mesh(new T.RingGeometry(.5,.9,24),add2(0,col,.7));flash.rotation.x=-Math.PI/2;flash.position.y=.06;g.add(flash);
 const l=new T.PointLight(col,2.2,10,1.5);l.position.set(0,3,0);g.add(l);
 add(g,.4,k=>{g.rotation.y=yawCam(x,z);flash.rotation.z=-g.rotation.y;const f=(1-k)*(.55+.45*Math.random());for(const p of ps)p.material.opacity=f;flash.material.opacity=.7*(1-k);flash.scale.setScalar(.5+k*1.6);l.intensity=2.2*(1-k)});
 const sp=new T.Group();sp.position.set(x,y0,z);const ss=[];for(let i=0;i<10;i++){const s=new T.Mesh(new T.BoxGeometry(.05,.05,.35),add2(0,col,1));s.rotation.set(R(0,3),R(0,3),R(0,3));s.userData.v=new T.Vector3(R(-3,3),R(2,5),R(-3,3));sp.add(s);ss.push(s)}add(sp,.5,k=>{for(const s of ss){s.position.addScaledVector(s.userData.v,.016);s.userData.v.y-=.3}fade(sp,1-k)})}
function storm(x,z,r=4,col=0xfff36b,n=6){for(let i=0;i<n;i++)setTimeout(()=>bolt(x+R(-r,r),z+R(-r,r),col),i*140)}
/* arco elétrico entre dois pontos (correntes de raio, agulhas, descargas) */
function zap(x1,z1,x2,z2,col=0xfff36b,dur=.35,w=1.4,y=1.1){const d=Math.hypot(x2-x1,z2-z1);if(d<.3)return;const g=new T.Group();g.position.set((x1+x2)/2,H(x1,z1)+y,(z1+z2)/2);g.rotation.y=Math.atan2(x2-x1,z2-z1);const ps=[];
 for(let i=0;i<2;i++){const p=new T.Mesh(new T.PlaneGeometry(w,d),SH().electric(col,1,1));p.rotation.x=Math.PI/2;if(i)p.rotation.y=Math.PI/2;g.add(p);ps.push(p)}
 add(g,dur,k=>{const f=(1-k)*(.6+.4*Math.random());for(const p of ps)p.material.opacity=f})}
/* pilar de luz: raios subindo, núcleo e círculo no chão */
function pillar(x,z,col=0xfff2b0,r=1.6){const g=new T.Group();g.position.set(x,H(x,z),z);const c=new T.Mesh(new T.CylinderGeometry(r,r*1.15,14,32,1,true),SH().ray(col,1));c.position.y=7;g.add(c);
 const core=new T.Mesh(new T.CylinderGeometry(r*.3,r*.4,14,16,1,true),SH().ray(0xffffff,.9));core.position.y=7;g.add(core);
 const base=new T.Mesh(new T.CircleGeometry(r*1.8,40),SH().magic(col,1,8));base.rotation.x=-Math.PI/2;base.position.y=.05;g.add(base);
 const rings=[];for(let i=0;i<3;i++){const ri=new T.Mesh(new T.TorusGeometry(r*1.3,.05,6,32),add2(0,col,.9));ri.rotation.x=Math.PI/2;ri.position.y=.3+i*1.2;g.add(ri);rings.push(ri)}
 add(g,1.2,k=>{const s=k<.12?k/.12:1;c.scale.set(s*(1-k*.3),1,s*(1-k*.3));core.scale.set(s,1,s);for(const ri of rings){ri.position.y+=.05;ri.scale.setScalar(1+k)}fade(g,1-k)})}
function slash(x,z,ang,col=0xffe0a0,r=3,spread=2.4){const g=new T.Group();g.position.set(x,H(x,z)+1,z);g.rotation.y=ang;const a0=-spread/2-Math.PI/2;
 const m=new T.Mesh(new T.RingGeometry(r*.45,r,48,1,a0,spread),SH().slash(col,a0,spread,r*.45,r,1));m.rotation.x=-Math.PI/2;g.add(m);
 add(g,.32,k=>{g.rotation.y=ang+(k-.5)*.9;g.scale.setScalar(.8+k*.4);fade(g,1-k*k)})}
function whirl(col=0xffe0a0,r=3.2){const P=player;const g=new T.Group();g.position.set(P.x,1,P.z);const sp=Math.PI*1.7;
 for(let i=0;i<2;i++){const r1=r*(1-i*.22),m=new T.Mesh(new T.RingGeometry(r1*.5,r1,56,1,0,sp),SH().slash(i?0xffffff:col,0,sp,r1*.5,r1,i?.7:1));m.rotation.x=-Math.PI/2;m.rotation.z=i*2.1;m.position.y=i*.25;g.add(m)}
 add(g,.5,k=>{g.position.set(player.x,1,player.z);g.rotation.y=-k*Math.PI*3;fade(g,1-k*k)});dust(P.x,P.z,0x9a8a70,5)}
/* cúpula de escudo: colmeia com borda acesa e onda subindo */
function dome(x,z,col=0x8bdcff,r=2.2,follow){const g=new T.Group();const m=new T.Mesh(new T.SphereGeometry(r,32,16,0,Math.PI*2,0,Math.PI*.55),SH().shield(col,1));g.add(m);
 const base=new T.Mesh(new T.RingGeometry(r*.9,r*1.02,48),add2(0,col,.9));base.rotation.x=-Math.PI/2;base.position.y=-.5;g.add(base);
 add(g,1.4,k=>{const p=follow&&player?player:{x,z};g.position.set(p.x,H(p.x,p.z)+.6,p.z);const s=k<.15?k/.15:1;g.scale.set(s,s*.9,s);fade(g,k>.7?(1-k)/.3:1)})}
function runeCircle(x,z,col=0x9fe8ff,r=2){const g=new T.Group();g.position.set(x,H(x,z)+.05,z);const o=new T.Mesh(new T.CircleGeometry(r,48),SH().magic(col,1,6));o.rotation.x=-Math.PI/2;g.add(o);
 const beam=new T.Mesh(new T.CylinderGeometry(r*.5,r*.6,4,24,1,true),SH().ray(col,.7));beam.position.y=2;g.add(beam);
 add(g,1.6,k=>{o.scale.setScalar(k<.15?k/.15:1);beam.scale.y=Math.max(.01,Math.sin(k*Math.PI));fade(g,k>.7?(1-k)/.3:1)})}
function vortex(x,z,col=0xb48cff,r=4){const g=new T.Group();g.position.set(x,H(x,z)+.2,z);const disc=new T.Mesh(new T.CircleGeometry(r,40),SH().swirl(col,1));disc.rotation.x=-Math.PI/2;g.add(disc);
 for(let j=0;j<3;j++){const pts=[];for(let i=0;i<30;i++){const t=i/29,a=j*Math.PI*2/3+t*5;pts.push(new T.Vector3(Math.cos(a)*r*(1-t),t*1.2,Math.sin(a)*r*(1-t)))}g.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),40,.05,4,false),add2(0,col,.9)))}
 add(g,1.1,k=>{g.rotation.y-=.15;g.scale.setScalar(1-k*.6);fade(g,1-k)})}
/* fumaça de verdade: volumes macios que crescem, sobem e se desfazem */
function smoke(x,z,col=0x5a5a6a,r=3){const g=new T.Group();g.position.set(x,H(x,z),z);const ps=[];for(let i=0;i<12;i++){const s=new T.Mesh(new T.IcosahedronGeometry(R(.55,1),2),SH().smoke(col,.85));s.position.set(R(-r,r)*.45,R(.4,1.3),R(-r,r)*.45);s.userData.v=new T.Vector3(R(-.6,.6),R(.3,.9),R(-.6,.6));s.rotation.y=R(0,6);g.add(s);ps.push(s)}
 add(g,2,k=>{const s0=Math.min(1,k*6);for(const s of ps){s.position.addScaledVector(s.userData.v,.016);s.scale.setScalar(s0*(1+k*1.1));s.rotation.y+=.01}fade(g,k>.45?(1-k)/.55:1)})}
/* veneno: poça borbulhando e vapor tóxico */
function poison(x,z,col=0x8de06a,r=2.5){const g=new T.Group();g.position.set(x,H(x,z),z);const pool=new T.Mesh(new T.CircleGeometry(r,32),SH().lava(col,.75));pool.rotation.x=-Math.PI/2;pool.position.y=.04;g.add(pool);const bs=[];
 for(let i=0;i<12;i++){const b=new T.Mesh(new T.SphereGeometry(R(.08,.2),8,6),add2(0,col,.9));b.position.set(R(-r,r)*.7,R(0,.3),R(-r,r)*.7);b.userData.v=R(.6,1.4);g.add(b);bs.push(b)}
 const vs=[];for(let i=0;i<5;i++){const v=new T.Mesh(new T.IcosahedronGeometry(R(.4,.7),2),SH().smoke(col,.45));v.position.set(R(-r,r)*.5,R(.3,.8),R(-r,r)*.5);g.add(v);vs.push(v)}
 add(g,2,k=>{pool.scale.setScalar(Math.min(1,k*5));for(const b of bs){b.position.y+=b.userData.v*.016;if(b.position.y>1.4)b.position.y=0}for(const v of vs){v.position.y+=.006;v.scale.setScalar(1+k*.8)}fade(g,k>.6?(1-k)/.4:1)})}
/* ---------- escolha ---------- */
const has=(n,re)=>re.test(n||'');
function play(sk){if(!sk||!player)return;const n=sk.n||'',t=sk.t==='kit111'?sk.effect:(sk.effect||sk.t),P=player,ang=P.face||0,col=sk.col||0xffffff;
 let tx=P.x+Math.sin(ang)*6,tz=P.z+Math.cos(ang)*6;try{if(/area|pulses|rain|slowzone|healzone|trap|device|barrier/.test(t)){const g=skillGroundPoint();if(g){tx=g.x;tz=g.z}}}catch(_){}
 const fire=has(n,/fogo|ígnea|igne|chama|meteor|sol negro|combust|brasa|cinza|incend/i),ice=has(n,/gelo|glacial|congel|nevasca|frio|estilha/i),earth=has(n,/terremoto|tremor|sísm|sism|abalo|erup|pedra|rocha|colosso|areia|cristal/i),light=has(n,/raio|tempest|elétr|eletr|trovo|relâmp|relamp|estát|estat|voltai|descarga|céus|ceus|clarão|clarao/i),holy=has(n,/luz|sagrad|julgament|solar|bênção|bencao|sol nascente|égide|egide|graça|purifica/i),arrow=has(n,/flecha|disparo|tiro|leque/i),smk=has(n,/fumaça|fumaca|furtiv|névoa|nevoa|sombr/i),pois=has(n,/venen|praga|peçonh|ácid|acid/i);
 if(has(n,/girat|redemoinho|varredura|rodopio|meia-lua|garras em arco/i))return whirl(col);
 if(earth&&/area|push|nova|pulses|interrupt/.test(t))return quakeRing(P.x,P.z,5.5);
 if(earth&&/line|bolt|target/.test(t))return spikeLine(P.x,P.z,ang,9,0x8a7a60,'rock');
 if(earth)return spikes(tx,tz,0x8a7a60,8,3,'rock');
 if(fire&&/pulses|rain/.test(t)){for(let i=0;i<7;i++)meteor(tx+R(-3.5,3.5),tz+R(-3.5,3.5),i*220);return}
 if(fire&&/line|bolt|target/.test(t)){streak(P.x,P.z,ang,10,0xff7a2a);return fireRing(tx,tz,1.6)}
 if(fire)return fireRing(/move|self|ward|guard/.test(t)?P.x:tx,/move|self|ward|guard/.test(t)?P.z:tz,4.5);
 if(ice&&/line|bolt|target/.test(t))return spikeLine(P.x,P.z,ang,9,0xbfe8ff,'ice');
 if(ice&&/ward|guard/.test(t))return dome(P.x,P.z,0xbfe8ff,2,true);
 if(ice)return spikes(/slow|nova|area/.test(t)?P.x:tx,/slow|nova|area/.test(t)?P.z:tz,0xbfe8ff,12,4,'ice');
 if(light&&/chain|bolt|target|line/.test(t)){bolt(tx,tz);return}
 if(light&&/ward|guard|speed|move/.test(t)){aura(0xfff36b);return storm(P.x,P.z,1.5,0xfff36b,2)}
 if(light)return storm(tx,tz,4,0xfff36b,7);
 if(holy&&/heal|healzone|cleanse/.test(t)){pillar(P.x,P.z,0xfff2b0,1.4);return heal(P.x,P.z)}
 if(holy)return pillar(/area|healzone/.test(t)?tx:P.x+Math.sin(ang)*4,/area|healzone/.test(t)?tz:P.z+Math.cos(ang)*4,0xfff2b0,2.2);
 if(arrow&&/pulses|rain/.test(t)){for(let i=0;i<12;i++)setTimeout(()=>streak(tx+R(-3,3),tz+R(-3,3)-0,Math.PI,0,0xe8f0ff),0);for(let i=0;i<10;i++)setTimeout(()=>{const x=tx+R(-3.5,3.5),z=tz+R(-3.5,3.5);bolt(x,z,0xe8f0ff)},i*120);return}
 if(arrow&&/fan/.test(t)){for(const d of [-.4,-.2,0,.2,.4])streak(P.x,P.z,ang+d,12,0xe8f0ff);return}
 if(arrow)return streak(P.x,P.z,ang,16,0xe8f0ff);
 if(smk||/stealth|blind|evade/.test(t))return smoke(P.x,P.z);
 if(pois||/venom|dot|burn/.test(t))return poison(tx,tz);
 if(/heal|healzone|rewindheal|repair/.test(t))return heal(P.x,P.z);
 if(/guard|ward|block|parry|barrier|anchorward|interpose|link/.test(t))return dome(P.x,P.z,col,2.2,true);
 if(/summon|device|echo|form|capture|gate|passage/.test(t))return runeCircle(tx,tz,col,2.2);
 if(/pull|consume/.test(t))return vortex(tx,tz,col);
 if(/push|interrupt/.test(t))return wind(P.x,P.z,ang,col);
 if(/buff_dmg|rally260|allybuff|speed|taunt|order|reveal|foresight|survey|self|dilate/.test(t))return aura(col);
 if(/move|dash_strike|relocate/.test(t))return dashTrail(col);
 if(/cone|fan/.test(t))return slash(P.x,P.z,ang,col,4,2.2);
 if(/line|bolt|target|execute/.test(t))return streak(P.x,P.z,ang,10,col);
 if(/nova|area|pulses|slow|slowzone|root|weaken|seal|trap/.test(t))return shockwave(/nova/.test(t)?P.x:tx,/nova/.test(t)?P.z:tz,col,4.5);
 return shockwave(P.x,P.z,col,3)}
/* liga ao lançamento: detecta quando a habilidade realmente saiu (recarga começou) */
let mute=0;const fr0=fxRing;fxRing=function(){if(performance.now()<mute)return;return fr0.apply(this,arguments)};
const wf0=waveFwd;waveFwd=function(){if(performance.now()<mute)return;return wf0.apply(this,arguments)};
const us0=useSkill;useSkill=function(sk){if(!sk||sk.empty||!player)return us0.apply(this,arguments);const s0=(player.skills||[]).find(x=>x&&!x.empty&&x.n===sk.n)||sk,c0=s0.cdT||0;mute=performance.now()+30;let r;try{r=us0.apply(this,arguments)}finally{mute=0}if((s0.cdT||0)>c0)try{(window.VFX302&&window.VFX302.play||play)(sk)}catch(e){console.warn('vfx302',e)}return r};
window.VFX302={add,fade,add2,dust,spikeLine,play,flames,zap,whirl,fissure,quakeRing,spikes,fireRing,meteor,bolt,storm,pillar,streak,slash,dome,aura,heal,runeCircle,vortex,wind,smoke,poison,dashTrail,shockwave};
})();
