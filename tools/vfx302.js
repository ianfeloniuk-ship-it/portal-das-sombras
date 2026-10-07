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
const add2=(o,col,op=1)=>new T.MeshBasicMaterial({color:col,transparent:true,opacity:op,depthWrite:false,blending:T.AdditiveBlending});
const toon=(col)=>new T.MeshToonMaterial({color:col,transparent:true});
const R=(a,b)=>a+Math.random()*(b-a);
function fade(o,a){o.traverse(c=>{if(c.material){c.material.transparent=true;if(c.material.userData.o0==null)c.material.userData.o0=c.material.opacity;c.material.opacity=c.material.userData.o0*a}})}
/* ---------- efeitos ---------- */
function fissure(x,z,ang,len=7,col=0xff8a3a){const g=new T.Group();g.position.set(x,H(x,z)+.16,z);g.rotation.y=ang;
 const crack=new T.MeshBasicMaterial({color:0x140b06,transparent:true,polygonOffset:true,polygonOffsetFactor:-6,polygonOffsetUnits:-6}),glowM=new T.MeshBasicMaterial({color:col,transparent:true,opacity:.95,depthWrite:false});glowM.polygonOffset=true;glowM.polygonOffsetFactor=-8;glowM.polygonOffsetUnits=-8;g.renderOrder=5;
 let px=0;for(let i=0;i<10;i++){const seg=len/10,w=R(.25,.55)*(1-i/14),q=new T.Mesh(new T.PlaneGeometry(w,seg*1.15),crack);q.rotation.x=-Math.PI/2;const off=R(-.35,.35);q.position.set(px+off,0,i*seg+seg/2);q.rotation.z=R(-.4,.4);q.renderOrder=5;g.add(q);const gl=new T.Mesh(new T.PlaneGeometry(w*.55,seg*1.05),glowM);gl.renderOrder=7;gl.rotation.x=-Math.PI/2;gl.position.set(px+off,.04,i*seg+seg/2);gl.rotation.z=q.rotation.z;g.add(gl);px=off*.6;
  for(const sd of [-1,1])if(Math.random()<.6){const b=new T.Mesh(new T.PlaneGeometry(R(.08,.18),R(.5,1.1)),crack);b.rotation.x=-Math.PI/2;b.rotation.z=sd*R(.6,1.1);b.position.set(px+sd*w*.7,.005,i*seg+seg/2);g.add(b)}}
 const rocks=[];for(let i=0;i<9;i++){const r=new T.Mesh(new T.DodecahedronGeometry(R(.15,.35),0),toon(0x6a5a48));const zz=R(0,len);r.position.set(R(-.6,.6),0,zz);r.userData.v=[R(-1.5,1.5),R(4,7),R(-1,1)];g.add(r);rocks.push(r)}
 add(g,2.6,(k,t)=>{for(const r of rocks){r.position.x+=r.userData.v[0]*.016;r.position.y=Math.max(0,r.position.y+r.userData.v[1]*.016);r.userData.v[1]-=14*.016;r.position.z+=r.userData.v[2]*.016;r.rotation.x+=.1;r.rotation.y+=.07}glowM.opacity=.9*(1-k)*(.7+.3*Math.sin(t*20));if(k>.7)fade(g,(1-k)/.3)});
 try{shake(.45)}catch(_){}dust(x+Math.sin(ang)*len/2,z+Math.cos(ang)*len/2,0x9a8a70,10)}
function quakeRing(x,z,r=5,col=0xc8a060){for(let i=0;i<5;i++){const a=i/5*Math.PI*2+R(0,.6);fissure(x,z,a,r*R(.7,1),col)}}
function dust(x,z,col,n=8){const g=new T.Group();g.position.set(x,H(x,z),z);const ps=[];for(let i=0;i<n;i++){const s=new T.Mesh(new T.SphereGeometry(R(.18,.35),6,5),new T.MeshToonMaterial({color:col,transparent:true,opacity:.55}));s.position.set(R(-1.5,1.5),R(.2,.8),R(-1.5,1.5));g.add(s);ps.push(s)}
 add(g,1.1,k=>{for(const s of ps){s.scale.setScalar(1+k);s.position.y+=.01}fade(g,1-k)})}
function spikes(x,z,col=0xbfe8ff,n=9,r=3.5,mat='ice'){const g=new T.Group();g.position.set(x,H(x,z),z);const list=[];for(let i=0;i<n;i++){const a=R(0,Math.PI*2),d=R(.6,r),h=R(1,2.4);const m=new T.Mesh(new T.ConeGeometry(R(.2,.4),h,mat==='ice'?5:6),mat==='ice'?new T.MeshToonMaterial({color:col,emissive:0x2a5a7a,transparent:true}):toon(col));m.position.set(Math.cos(a)*d,-h,Math.sin(a)*d);m.rotation.z=R(-.25,.25);m.rotation.x=R(-.25,.25);m.userData.h=h;g.add(m);list.push(m)}
 add(g,2,k=>{const up=Math.min(1,k*6);for(const m of list)m.position.y=-m.userData.h*(1-up)+(up>=1?0:0)-(k>.75?(k-.75)*4*m.userData.h:0);if(k>.75)fade(g,(1-k)/.25)});dust(x,z,mat==='ice'?0xe8f4ff:0x8a7a60,6)}
function spikeLine(x,z,ang,len,col,mat){const n=7;for(let i=0;i<n;i++){const d=(i+1)/n*len;setTimeout(()=>spikes(x+Math.sin(ang)*d,z+Math.cos(ang)*d,col,3,.8,mat),i*55)}}
function fireRing(x,z,r=4.5,col=0xff6a1e){const g=new T.Group();g.position.set(x,H(x,z),z);const fl=[];for(let i=0;i<28;i++){const a=i/28*Math.PI*2,f=new T.Mesh(new T.ConeGeometry(.28,1.2,6),add2(0,i%2?0xffb040:col,.9));f.position.set(Math.cos(a)*.5,.6,Math.sin(a)*.5);f.userData.a=a;g.add(f);fl.push(f)}
 const emb=[];for(let i=0;i<24;i++){const e=new T.Mesh(new T.SphereGeometry(.07,4,3),add2(0,0xffd070,1));e.position.set(R(-r,r),R(0,.5),R(-r,r));e.userData.v=R(1.5,3.5);g.add(e);emb.push(e)}
 add(g,1.1,k=>{const rr=.5+(r-.5)*Math.min(1,k*2.2);for(const f of fl){f.position.x=Math.cos(f.userData.a)*rr;f.position.z=Math.sin(f.userData.a)*rr;f.scale.y=1+Math.sin(k*20+f.userData.a*3)*.3}for(const e of emb)e.position.y+=e.userData.v*.016;fade(g,1-k*k)})}
function meteor(x,z,delay=0,col=0xff5a1e){setTimeout(()=>{const g=new T.Group();const y0=H(x,z);g.position.set(x+4,y0+16,z-3);const rock=new T.Mesh(new T.DodecahedronGeometry(.6,0),toon(0x3a2418));g.add(rock);const tail=new T.Mesh(new T.ConeGeometry(.55,3,8),add2(0,col,.8));tail.rotation.x=Math.PI;tail.position.y=1.6;g.add(tail);g.lookAt(x,y0,z);
 add(g,.55,k=>{g.position.set(x+4*(1-k),y0+16*(1-k),z-3*(1-k));rock.rotation.x+=.3;if(k>=1){fireRing(x,z,2.5,col);try{shake(.18)}catch(_){}}})},delay)}
function bolt(x,z,col=0xfff36b){const y0=H(x,z);const pts=[];let px=x+R(-1,1),pz=z+R(-1,1);for(let i=0;i<=9;i++){const t=i/9;pts.push(new T.Vector3(px+(x-px)*t+R(-.5,.5)*(1-t),y0+14*(1-t),pz+(z-pz)*t+R(-.5,.5)*(1-t)))}
 const g=new T.Group();for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],len=a.distanceTo(b);const c=new T.Mesh(new T.CylinderGeometry(.09,.09,len,4),add2(0,col,1));c.position.copy(a).add(b).multiplyScalar(.5);c.lookAt(b);c.rotateX(Math.PI/2);g.add(c);const c2=new T.Mesh(new T.CylinderGeometry(.25,.25,len,4),add2(0,col,.3));c2.position.copy(c.position);c2.quaternion.copy(c.quaternion);g.add(c2)}
 const l=new T.PointLight(col,4,14,1.5);l.position.set(x,y0+3,z);g.add(l);add(g,.35,(k)=>{fade(g,1-k);l.intensity=4*(1-k)});
 const sp=new T.Group();sp.position.set(x,y0,z);const ss=[];for(let i=0;i<10;i++){const s=new T.Mesh(new T.BoxGeometry(.05,.05,.35),add2(0,col,1));s.rotation.set(R(0,3),R(0,3),R(0,3));s.userData.v=new T.Vector3(R(-3,3),R(2,5),R(-3,3));sp.add(s);ss.push(s)}add(sp,.5,k=>{for(const s of ss){s.position.addScaledVector(s.userData.v,.016);s.userData.v.y-=.3}fade(sp,1-k)})}
function storm(x,z,r=4,col=0xfff36b,n=6){for(let i=0;i<n;i++)setTimeout(()=>bolt(x+R(-r,r),z+R(-r,r),col),i*140)}
function pillar(x,z,col=0xfff2b0,r=1.6){const g=new T.Group();g.position.set(x,H(x,z),z);const c=new T.Mesh(new T.CylinderGeometry(r,r*1.1,14,24,1,true),add2(0,col,.55));c.position.y=7;g.add(c);const core=new T.Mesh(new T.CylinderGeometry(r*.35,r*.35,14,12,1,true),add2(0,0xffffff,.8));core.position.y=7;g.add(core);
 const rings=[];for(let i=0;i<3;i++){const ri=new T.Mesh(new T.TorusGeometry(r*1.3,.06,6,32),add2(0,col,.9));ri.rotation.x=Math.PI/2;ri.position.y=.3+i*1.2;g.add(ri);rings.push(ri)}
 add(g,1.2,k=>{c.scale.set(1-k*.3,1,1-k*.3);for(const [i,ri] of rings.entries()){ri.position.y+=.05;ri.scale.setScalar(1+k)}fade(g,1-k)})}
function streak(x,z,ang,len=14,col=0xe8f0ff){const g=new T.Group();const y=H(x,z)+1.1;g.position.set(x,y,z);g.rotation.y=ang;const s=new T.Mesh(new T.BoxGeometry(.12,.12,len),add2(0,col,.9));s.position.z=len/2;g.add(s);const s2=new T.Mesh(new T.BoxGeometry(.5,.5,len),add2(0,col,.25));s2.position.z=len/2;g.add(s2);
 const rings=[];for(let i=1;i<6;i++){const r=new T.Mesh(new T.TorusGeometry(.6,.05,6,20),add2(0,col,.8));r.position.z=i*len/6;g.add(r);rings.push(r)}
 add(g,.5,k=>{for(const r of rings)r.scale.setScalar(1+k*2);s.scale.x=s.scale.y=1-k;fade(g,1-k)})}
function slash(x,z,ang,col=0xffe0a0,r=3,spread=2.4){const g=new T.Group();g.position.set(x,H(x,z)+1,z);g.rotation.y=ang;const m=new T.Mesh(new T.RingGeometry(r*.55,r,32,1,-spread/2+Math.PI/2,spread),add2(0,col,.9));m.rotation.x=-Math.PI/2;g.add(m);const m2=new T.Mesh(new T.RingGeometry(r*.85,r,32,1,-spread/2+Math.PI/2,spread),add2(0,0xffffff,.9));m2.rotation.x=-Math.PI/2;m2.position.y=.02;g.add(m2);
 add(g,.3,k=>{g.rotation.y=ang+(k-.5)*.8;g.scale.setScalar(.8+k*.4);fade(g,1-k)})}
function whirl(col=0xffe0a0,r=3.2){const P=player;const g=new T.Group();g.position.set(P.x,1,P.z);for(let i=0;i<3;i++){const m=new T.Mesh(new T.RingGeometry(r*(.55+i*.12),r*(.7+i*.12),40,1,0,Math.PI*1.6),new T.MeshBasicMaterial({color:i===1?0xffffff:col,transparent:true,opacity:.85,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending}));m.rotation.x=-Math.PI/2;m.position.y=i*.08;g.add(m)}
 add(g,.45,k=>{g.position.set(player.x,1,player.z);g.rotation.y=-k*Math.PI*3;fade(g,1-k)});dust(P.x,P.z,0x9a8a70,5)}
function dome(x,z,col=0x8bdcff,r=2.2,follow){const g=new T.Group();const m=new T.Mesh(new T.IcosahedronGeometry(r,1),add2(0,col,.25));g.add(m);const w=new T.Mesh(new T.IcosahedronGeometry(r*1.01,1),new T.MeshBasicMaterial({color:col,wireframe:true,transparent:true,opacity:.7}));g.add(w);
 add(g,1.4,k=>{const p=follow&&player?player:{x,z};g.position.set(p.x,H(p.x,p.z)+.6,p.z);const s=k<.15?k/.15:1;g.scale.set(s,s*.85,s);w.rotation.y+=.01;fade(g,k>.7?(1-k)/.3:1)})}
function aura(col=0xffb040,follow=true,n=18){const g=new T.Group();const ps=[];for(let i=0;i<n;i++){const p=new T.Mesh(new T.SphereGeometry(.08,4,3),add2(0,col,1));p.userData={a:R(0,6.28),r:R(.6,1.1),y:R(0,.4),v:R(1.2,2.2)};g.add(p);ps.push(p)}const ring=new T.Mesh(new T.RingGeometry(.8,1.1,32),add2(0,col,.6));ring.rotation.x=-Math.PI/2;g.add(ring);
 add(g,1.3,(k,t)=>{const p=player;g.position.set(p.x,H(p.x,p.z)+.05,p.z);for(const q of ps){const u=q.userData;u.y+=u.v*.016;q.position.set(Math.cos(u.a+t*3)*u.r,u.y,Math.sin(u.a+t*3)*u.r)}ring.scale.setScalar(1+k*.6);fade(g,1-k)})}
function heal(x,z,col=0x6fe39a,follow=true){const g=new T.Group();const cs=[];for(let i=0;i<10;i++){const c=new T.Group();const a=new T.Mesh(new T.BoxGeometry(.32,.09,.09),add2(0,col,1)),b=new T.Mesh(new T.BoxGeometry(.09,.32,.09),add2(0,col,1));c.add(a,b);c.position.set(R(-1,1),R(0,.6),R(-1,1));c.userData.v=R(1,2);g.add(c);cs.push(c)}
 add(g,1.5,k=>{const p=follow&&player?player:{x,z};g.position.set(p.x,H(p.x,p.z),p.z);for(const c of cs){c.position.y+=c.userData.v*.016;c.rotation.y+=.05}fade(g,1-k)})}
function runeCircle(x,z,col=0x9fe8ff,r=2){const g=new T.Group();g.position.set(x,H(x,z)+.05,z);const o=new T.Mesh(new T.RingGeometry(r*.92,r,48),add2(0,col,.9));o.rotation.x=-Math.PI/2;g.add(o);const i2=new T.Mesh(new T.RingGeometry(r*.55,r*.6,6),add2(0,col,.8));i2.rotation.x=-Math.PI/2;g.add(i2);
 for(let i=0;i<8;i++){const a=i/8*Math.PI*2,b=new T.Mesh(new T.BoxGeometry(.12,.02,.4),add2(0,col,1));b.position.set(Math.cos(a)*r*.76,0,Math.sin(a)*r*.76);b.rotation.y=-a;g.add(b)}
 const beam=new T.Mesh(new T.CylinderGeometry(r*.5,r*.5,4,16,1,true),add2(0,col,.25));beam.position.y=2;g.add(beam);
 add(g,1.6,k=>{g.rotation.y+=.03;i2.rotation.z-=.06;beam.scale.y=Math.sin(k*Math.PI);fade(g,k>.7?(1-k)/.3:1)})}
function vortex(x,z,col=0xb48cff,r=4){const g=new T.Group();g.position.set(x,H(x,z)+.2,z);const arms=[];for(let j=0;j<4;j++){const pts=[];for(let i=0;i<30;i++){const t=i/29,a=j*Math.PI/2+t*5;pts.push(new T.Vector3(Math.cos(a)*r*(1-t),t*.6,Math.sin(a)*r*(1-t)))}const tube=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),40,.06,4,false),add2(0,col,.9));g.add(tube);arms.push(tube)}
 add(g,1.1,k=>{g.rotation.y-=.15;g.scale.setScalar(1-k*.6);fade(g,1-k)})}
function wind(x,z,ang,col=0xd8f4ff,len=6){const g=new T.Group();g.position.set(x,H(x,z)+1,z);g.rotation.y=ang;const arcs=[];for(let i=0;i<5;i++){const a=new T.Mesh(new T.TorusGeometry(R(1,2.2),.05,4,24,Math.PI*.7),add2(0,col,.8));a.rotation.x=Math.PI/2;a.rotation.z=Math.PI*.15+Math.PI;a.position.set(R(-1,1),R(-.5,.5),0);g.add(a);arcs.push(a)}
 add(g,.6,k=>{for(const a of arcs)a.position.z=k*len;fade(g,1-k)})}
function smoke(x,z,col=0x5a5a6a,r=3){const g=new T.Group();g.position.set(x,H(x,z),z);const ps=[];for(let i=0;i<16;i++){const s=new T.Mesh(new T.SphereGeometry(R(.5,1),7,5),new T.MeshToonMaterial({color:col,transparent:true,opacity:.75}));s.position.set(R(-r,r)*.5,R(.3,1.4),R(-r,r)*.5);s.userData.v=new T.Vector3(R(-1,1),R(.2,.8),R(-1,1));g.add(s);ps.push(s)}
 add(g,2,k=>{for(const s of ps){s.position.addScaledVector(s.userData.v,.016);s.scale.setScalar(1+k*1.2)}fade(g,1-k)})}
function poison(x,z,col=0x8de06a,r=2.5){const g=new T.Group();g.position.set(x,H(x,z),z);const pool=new T.Mesh(new T.CircleGeometry(r,24),add2(0,col,.35));pool.rotation.x=-Math.PI/2;pool.position.y=.03;g.add(pool);const bs=[];for(let i=0;i<14;i++){const b=new T.Mesh(new T.SphereGeometry(R(.08,.2),6,5),add2(0,col,.9));b.position.set(R(-r,r)*.7,R(0,.3),R(-r,r)*.7);b.userData.v=R(.6,1.4);g.add(b);bs.push(b)}
 add(g,2,k=>{for(const b of bs){b.position.y+=b.userData.v*.016;if(b.position.y>1.4)b.position.y=0}fade(g,k>.6?(1-k)/.4:1)})}
function dashTrail(col=0xffffff){const p=player;if(!p)return;const x0=p.x,z0=p.z;setTimeout(()=>{const x1=player.x,z1=player.z,d=Math.hypot(x1-x0,z1-z0);if(d<.5)return;const ang=Math.atan2(x1-x0,z1-z0);const g=new T.Group();g.position.set(x0,H(x0,z0)+1,z0);g.rotation.y=ang;for(let i=0;i<4;i++){const s=new T.Mesh(new T.BoxGeometry(.6-i*.1,1.4-i*.2,d),add2(0,col,.25-i*.05));s.position.z=d/2;g.add(s)}const lines=[];for(let i=0;i<6;i++){const l=new T.Mesh(new T.BoxGeometry(.03,.03,d),add2(0,col,.9));l.position.set(R(-.4,.4),R(-.6,.6),d/2);g.add(l);lines.push(l)}add(g,.4,k=>fade(g,1-k))},140)}
function shockwave(x,z,col,r=4){const g=new T.Group();g.position.set(x,H(x,z)+.06,z);const m=new T.Mesh(new T.RingGeometry(.85,1,48),add2(0,col,.9));m.rotation.x=-Math.PI/2;g.add(m);const m2=new T.Mesh(new T.CylinderGeometry(1,1,.6,40,1,true),add2(0,col,.35));m2.position.y=.3;g.add(m2);add(g,.5,k=>{g.scale.setScalar(.5+k*r);fade(g,1-k)});dust(x,z,0x9a8a70,5)}
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
const us0=useSkill;useSkill=function(sk){if(!sk||sk.empty||!player)return us0.apply(this,arguments);const s0=(player.skills||[]).find(x=>x&&!x.empty&&x.n===sk.n)||sk,c0=s0.cdT||0;mute=performance.now()+30;let r;try{r=us0.apply(this,arguments)}finally{mute=0}if((s0.cdT||0)>c0)try{play(sk)}catch(e){console.warn('vfx302',e)}return r};
window.VFX302={play,whirl,fissure,quakeRing,spikes,fireRing,meteor,bolt,storm,pillar,streak,slash,dome,aura,heal,runeCircle,vortex,wind,smoke,poison,dashTrail,shockwave};
})();
