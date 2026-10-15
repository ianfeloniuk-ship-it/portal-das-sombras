/* ================= EFEITOS VISUAIS POR HABILIDADE ================= */
function fxCustom(o,dur,upd){scene.add(o);fxs.push({o,t:0,dur,kind:'fn',upd})}
function fadeAll(o,a){o.traverse(m=>{if(m.material&&!m.material.userData.shared){m.material.transparent=true;m.material.opacity=a*(m.userData.op??1)}})}
function gl(c,o=1){const m=glow(c,o);return m}
function arrowModel(col,glowy){if(window.Proj155&&Proj155.ready&&Proj155.models.flecha)return Proj155.make('flecha',1);
  const g=new THREE.Group();
  const sh=new THREE.Mesh(geo('ashaft',()=>new THREE.CylinderGeometry(.03,.03,1.1,5)),toonS(0x8a5a2a));sh.rotation.x=Math.PI/2;g.add(sh);
  const hd=new THREE.Mesh(geo('ahead',()=>new THREE.ConeGeometry(.08,.26,6)),toonS(0xdfe6ee));hd.rotation.x=Math.PI/2;hd.position.z=.66;g.add(hd);
  for(const s of[-1,1]){const f=new THREE.Mesh(geo('afl',()=>new THREE.PlaneGeometry(.16,.22)),new THREE.MeshBasicMaterial({color:0xf2f2f2,side:THREE.DoubleSide}));f.position.set(s*.06,0,-.48);f.rotation.y=Math.PI/2;g.add(f)}
  if(glowy){const t=new THREE.Mesh(geo('atrail',()=>new THREE.CylinderGeometry(.09,.01,1.2,6)),glowS(col,.55));t.rotation.x=Math.PI/2;t.position.z=-.3;g.add(t)}
  return g;
}
function projModel(type,col,sc=1,cls=null,actor405=player,ctx405=null){if(type==='bullet372')return Firearms372.bullet();if(/^thorn372(?:_[fa])?$/.test(type))return Cactoro372.projectile(type);if(/^crystal350(?:_[fa])?$/.test(type))return Spiky350.projectile('espinhosa'+type.slice(10));
  if(type==='tspear'){const same339=window.Warrior127?.spearModel?.(actor405?actor405.m:null);if(same339){/* v339 (Ian): a mesma lança que está na mão */const g=new THREE.Group();g.name='Lança arremessada';g.add(same339);g.scale.setScalar(sc*1.6);return g}const g=new THREE.Group();g.name='Lança arremessada';const shaft=mesh(geo('spearShaft326',()=>new THREE.CylinderGeometry(.035,.035,1.45,8)),toonS(0x694424));shaft.rotation.x=Math.PI/2;shaft.position.z=-.15;g.add(shaft);const tip=mesh(geo('spearTip326',()=>new THREE.ConeGeometry(.105,.42,4)),toonS(0xd8dce3));tip.rotation.x=Math.PI/2;tip.position.z=.76;g.add(tip);g.scale.setScalar(sc);return g}

  // v156: modelos do Tripo (Proj155) antes das bolhas de luz.
  if(type==='tdagger'){/* v272: adaga arremessada — cabo atrás, lâmina apontando para frente */const g=new THREE.Group();const same274=window.Warrior127?.daggerModel?.();if(same274){/* v274 (Ian): o mesmo modelo da adaga que está na mão */same274.rotation.x=Math.PI/2;g.add(same274);g.scale.setScalar(sc*1.6);return g}const blade=mesh(geo('tdBlade',()=>new THREE.ConeGeometry(.07,.5,4)),toonS(0xcfd8ff));blade.rotation.x=Math.PI/2;blade.position.z=.2;g.add(blade);const guard=mesh(geo('tdGuard',()=>new THREE.BoxGeometry(.22,.04,.05)),toonS(0x8a7a5a));guard.position.z=-.06;g.add(guard);const grip=mesh(geo('tdGrip',()=>new THREE.CylinderGeometry(.035,.035,.22,6)),toonS(0x4a3020));grip.rotation.x=Math.PI/2;grip.position.z=-.2;g.add(grip);g.scale.setScalar(sc*1.3);return g}
  const p156=window.Proj155&&Proj155.ready&&Proj155.pick(type,cls);if(p156){const g=Proj155.make(p156,sc);
  // Pedido do Ian: energia tem que parecer energia — chama no fogo, eletricidade no Condutor, vazio no Devorador. O fluido do Combat139 envolve o modelo.
  if(ctx405)ctx405.isolate(g);Proj155.addFx(g,p156,col);return g}
  const fluid139=window.Combat139&&Combat139.projectile(type,col,sc,cls);if(fluid139)return fluid139;
  const g=new THREE.Group();
  if(type==='arrow'||type==='sarrow')g.add(arrowModel(col,type==='sarrow'));
  else if(type==='fire'){g.add(new THREE.Mesh(geo('fcore',()=>new THREE.SphereGeometry(.22,10,8)),glowS(0xfff0a0,1)));g.add(new THREE.Mesh(geo('fout',()=>new THREE.SphereGeometry(.36,10,8)),glowS(0xff6a1e,.7)));const t=new THREE.Mesh(geo('ftail',()=>new THREE.ConeGeometry(.3,.9,8)),glowS(0xff3d0e,.5));t.rotation.x=-Math.PI/2;t.position.z=-.55;g.add(t)}
  else if(type==='ice'){const shard=new THREE.Mesh(geo('iceBolt',()=>new THREE.ConeGeometry(.18,1.15,5)),glowS(col,.9));shard.rotation.x=Math.PI/2;g.add(shard)}
  else if(type==='stone'){const rock=mesh(geo('stoneBolt',()=>new THREE.DodecahedronGeometry(.3,0)),toonS(col));rock.scale.set(.7,.7,1.5);g.add(rock)}
  else if(type==='spark'){for(let i=0;i<3;i++){const bolt=new THREE.Mesh(geo('sparkBolt',()=>new THREE.BoxGeometry(.065,.065,.5)),glowS(col,1));bolt.position.set(i%2?.14:0,0,i*.3-.3);bolt.rotation.y=i%2?.5:-.5;g.add(bolt)}}
  else if(type==='soul'){g.add(new THREE.Mesh(geo('score',()=>new THREE.SphereGeometry(.2,10,8)),glowS(col,1)));const t=new THREE.Mesh(geo('stail',()=>new THREE.ConeGeometry(.18,.8,8)),glowS(0x2a0f55,.8));t.rotation.x=-Math.PI/2;t.position.z=-.45;g.add(t)}
  else if(type==='holy'){g.add(new THREE.Mesh(geo('hcore',()=>new THREE.OctahedronGeometry(.22,0)),glowS(0xffffff,1)));g.add(new THREE.Mesh(geo('hring',()=>new THREE.TorusGeometry(.3,.04,6,20)),glowS(col,.9)))}
  else{g.add(new THREE.Mesh(geo('porb',()=>new THREE.SphereGeometry(.22,10,8)),glowS(col,1)));g.add(new THREE.Mesh(geo('phalo',()=>new THREE.SphereGeometry(.36,10,8)),glowS(col,.3)))}
  g.scale.setScalar(sc);return g;
}
function trailFx(p){ // partícula atrás do projétil
  const c=p.ptype==='fire'?(Math.random()<.5?0xff6a1e:0xffc040):p.col;
  const o=new THREE.Mesh(geo('fxp',()=>new THREE.SphereGeometry(.13,6,4)),glow(c,.8));o.userData.terrainAbsolute245=true;o.position.set(p.x+rnd(-.1,.1),(p.y??p.originY??1.1)+rnd(-.1,.1),p.z+rnd(-.1,.1));o.scale.setScalar(p.ptype==='fire'?rnd(1,1.8):rnd(.5,.9));
  scene.add(o);fxs.push({o,t:0,dur:.3,kind:'p',v:{x:0,y:p.ptype==='fire'?2:0,z:0}});
}
// v156: habilidades de chuva mostram o que cai de verdade (flechas do Tripo, meteoros), não só um anel de luz.
function pulseFx156(z,ctx405=null){const n=z.s&&z.s.n||'';const kind=/Flecha/.test(n)?'arrow':/Meteoro/.test(n)?'meteor':null;if(!kind)return;const k=kind==='arrow'?7:2;for(let i=0;i<k;i++){const a=Math.random()*Math.PI*2,r=Math.sqrt(Math.random())*z.r;fallFx(z.x+Math.cos(a)*r,z.z+Math.sin(a)*r,.3+Math.random()*.25,kind,z.col,ctx405)}}
function fallFx(x,z,dur,kind,col,ctx405=null){
  const camera405=ctx405?ctx405.camera:camera;
  const add405=(o,d,fn)=>ctx405?ctx405.vfx302.add(o,d,(k)=>fn(o,k)):fxCustom(o,d,fn);
  const o=kind==='arrow'?arrowModel(col,true):kind==='meteor'?(()=>{const g=new THREE.Group();const r=mesh(geo('mrock',()=>new THREE.DodecahedronGeometry(.6,0)),toonS(0x3a2418));g.add(r);/* v342 (Ian): o meteoro que dá o dano usa os shaders de fogo (antes havia um segundo, só de enfeite) */const S342=window.Shaders312;g.add(new THREE.Mesh(new THREE.IcosahedronGeometry(.9,2),S342?S342.fireball(null,.9):gl(0xff6a1e,.55)));const t=new THREE.Mesh(new THREE.ConeGeometry(.75,4.5,10,6,true),S342?S342.fire(1):gl(0xffa040,.45));t.position.y=2.4;g.add(t);return g})():projModel(kind==='soul'?'soul':'orb',col,1.4);
  if(ctx405)ctx405.isolate(o);
  if(kind==='arrow'){o.rotation.x=Math.PI/2;o.scale.setScalar(o.userData.proj155?1.15:1.7)}
  // v153: the PC camera sits ~12 m up; anything spawned at 16 m fell from behind the lens and was never seen.
  const sx=x+(kind==='meteor'?-6:0),sy=kind==='meteor'?16:Math.min(16,Math.max(5,(camera405?camera405.position.y:16)-4)),sz=z+(kind==='meteor'?-6:0);o.position.set(sx,sy,sz);
  add405(o,dur,(f,k)=>{const e=k*k;o.position.set(sx+(x-sx)*e,sy+(0-sy)*e,sz+(z-sz)*e);if(!ctx405&&kind==='meteor'&&Math.random()<.6)trailFx({x:o.position.x,z:o.position.z,ptype:'fire',col}) ;if(k>.97&&o.visible){o.visible=false;if(kind==='arrow'){if(ctx405)ctx405.vfx302.dust(x,z,0x9a8a70,5);else dustPuff178(x,z);try{ctx405?ctx405.vfx328.stuck(x,z,col):window.VFX328&&VFX328.stuck&&VFX328.stuck(x,z,col)}catch(_){}}else if(kind==='meteor')try{ctx405?ctx405.vfx302.flames(x,z,{n:5,r:.9,h:2,dur:.8}):window.VFX302&&VFX302.flames&&VFX302.flames(x,z,{n:5,r:.9,h:2,dur:.8})}catch(_){}}});
}
function spikes(x,z,n,r0,r1,col,h=2.2,dark=false){
  const g=new THREE.Group();g.position.set(x,0,z);
  for(let i=0;i<n;i++){const a=i/n*TAU+rnd(-.2,.2),r=rnd(r0,r1);const m=new THREE.Mesh(geo('spk',()=>new THREE.ConeGeometry(.35,1,6)),dark?new THREE.MeshBasicMaterial({color:col,transparent:true}):gl(col,.85));m.position.set(Math.cos(a)*r,0,Math.sin(a)*r);m.scale.set(1,.01,1);m.userData.h=h*rnd(.7,1.3);m.rotation.set(rnd(-.25,.25),0,rnd(-.25,.25));g.add(m)}
  fxCustom(g,.9,(f,k)=>{const up=Math.min(1,k*5);for(const m of g.children){m.scale.y=m.userData.h*up;m.position.y=m.userData.h*up/2}if(k>.55)fadeAll(g,(1-k)/.45)});
}
function groundFacet(x,z,size,col,angle=0){
  const g=new THREE.Group(),points=[],top=[],topColors=[],sides=[],sideColors=[],n=7,base=new THREE.Color(col),seed=Math.sin(x*12.7+z*4.1+angle)*43758.5;
  for(let i=0;i<n;i++){const a=i/n*TAU,noise=.82+.18*Math.sin(seed+i*8.31),r=size*noise;points.push(new THREE.Vector3(Math.cos(a)*r,.10+Math.sin(seed+i*2.8)*.025,Math.sin(a)*r))}
  const push=(arr,colors,a,b,c,colorScale)=>{arr.push(...a.toArray(),...b.toArray(),...c.toArray());const tint=base.clone().multiplyScalar(colorScale);for(let j=0;j<3;j++)colors.push(tint.r,tint.g,tint.b)};
  const center=new THREE.Vector3(0,.23,0);for(let i=0;i<n;i++)push(top,topColors,center,points[i],points[(i+1)%n],.84+(i%3)*.10);
  const floor=points.map(p=>new THREE.Vector3(p.x*.88,.015,p.z*.88));for(let i=0;i<n;i++){const j=(i+1)%n;push(sides,sideColors,points[i],floor[i],points[j],.48);push(sides,sideColors,points[j],floor[i],floor[j],.40)}
  const makeGeo=(positions,colors)=>{const q=new THREE.BufferGeometry();q.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));q.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));q.computeVertexNormals();return q};
  const mat=new THREE.MeshStandardMaterial({vertexColors:true,flatShading:true,roughness:.96,metalness:0,side:THREE.DoubleSide,transparent:true,opacity:.96});
  const topMesh=new THREE.Mesh(makeGeo(top,topColors),mat),sideMesh=new THREE.Mesh(makeGeo(sides,sideColors),mat);g.add(sideMesh,topMesh);
  const edgePts=points.map(p=>new THREE.Vector3(p.x,.235,p.z));const edge=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(edgePts),new THREE.LineBasicMaterial({color:0x30271e,transparent:true,opacity:.88}));g.add(edge);
  const veins=[];for(let i=0;i<3;i++){const a=points[(i*2+1)%n],b=new THREE.Vector3(a.x*.30,.238,a.z*.30);veins.push(b,a)}g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(veins),new THREE.LineBasicMaterial({color:0x70583d,transparent:true,opacity:.55})));
  g.position.set(x,.025,z);g.rotation.y=angle;g.scale.set(1,.04,1);g.addEventListener('removed',()=>g.traverse(m=>{if(m.geometry)m.geometry.dispose();if(m.material&&!m.material.userData.shared)m.material.dispose()}));fxCustom(g,.50,(f,k)=>{const pop=k<.28?.04+.96*k/.28:1;g.scale.set(1,pop,1);const fade=k>.72?(1-k)/.28:1;mat.opacity=.96*fade;edge.material.opacity=.88*fade;g.children[3].material.opacity=.55*fade});
}
function pillar(x,z,col,w=.8,dur=.7){
  const g=new THREE.Group();const c=new THREE.Mesh(geo('pil',()=>new THREE.CylinderGeometry(1,1,24,12,1,true)),gl(col,.75));c.position.y=12;g.add(c);const core=new THREE.Mesh(geo('pil',()=>0),gl(0xffffff,.9));core.position.y=12;core.scale.set(.35,1,.35);g.add(core);g.position.set(x,0,z);g.scale.set(w,1,w);
  fxCustom(g,dur,(f,k)=>{g.scale.set(w*(1-k*.7),1,w*(1-k*.7));fadeAll(g,1-k)});
}
function spinRing(x,z,col,r=4,dur=.35){
  const m=new THREE.Mesh(new THREE.RingGeometry(r*.35,r,40,1,0,TAU*.85),gl(col,.8));m.rotation.x=-Math.PI/2;m.position.set(x,.9,z);
  fxCustom(m,dur,(f,k)=>{m.rotation.z=k*TAU*1.4;m.scale.setScalar(.7+k*.4);m.material.opacity=.85*(1-k)});fxs[fxs.length-1].own=true;
}
function waveFwd(x,z,ang,col,len=5,w=2.6){
  const m=new THREE.Mesh(new THREE.RingGeometry(1.2,w,24,1,-.8,1.6),gl(col,.85));m.rotation.x=-Math.PI/2;m.rotation.z=ang-Math.PI/2;
  fxCustom(m,.35,(f,k)=>{m.position.set(x+Math.sin(ang)*len*k,.9,z+Math.cos(ang)*len*k);m.scale.setScalar(.8+k*.8);m.material.opacity=.9*(1-k)});fxs[fxs.length-1].own=true;
}
function rocks(x,z,n,col){for(let i=0;i<n;i++){const o=mesh(geo('rchunk',()=>new THREE.DodecahedronGeometry(.3,0)),toonS(col));o.position.set(x,0,z);const v={x:rnd(-6,6),y:rnd(5,10),z:rnd(-6,6)};fxCustom(o,.8,(f,k,dt)=>{o.position.x+=v.x*dt;o.position.y=Math.max(0,o.position.y+v.y*dt);o.position.z+=v.z*dt;v.y-=22*dt;o.rotation.x+=dt*6})}}
function cracks(x,z,r,col){const m=new THREE.Mesh(new THREE.RingGeometry(r*.2,r,10,3),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.6,wireframe:true}));m.rotation.x=-Math.PI/2;m.position.set(x,.06,z);fxCustom(m,1.2,(f,k)=>{m.material.opacity=.6*(1-k)});fxs[fxs.length-1].own=true;fxRing(x,z,col,r*.8,.45)}
function bubble(dur,col){const P=player;const m=new THREE.Mesh(geo('bub',()=>new THREE.SphereGeometry(1.3,20,14)),gl(col,.25));fxCustom(m,dur,(f,k)=>{m.position.set(P.x,1,P.z);m.material.opacity=(.22+Math.sin(f.t*6)*.06)*(k>.85?(1-k)/.15:1)})}
function sparkUp(x,z,col,n=16,rad=1.2){for(let i=0;i<n;i++){const o=new THREE.Mesh(geo('fxp',()=>new THREE.SphereGeometry(.13,6,4)),glow(col,1));const a=rnd(0,TAU),r=rnd(0,rad);o.position.set(x+Math.cos(a)*r,rnd(0,.6),z+Math.sin(a)*r);o.scale.setScalar(rnd(.5,1));scene.add(o);fxs.push({o,t:0,dur:rnd(.6,1.1),kind:'p',v:{x:0,y:rnd(3,6),z:0}})}}
function cloud(e,col){for(let i=0;i<5;i++){const o=new THREE.Mesh(geo('cl',()=>new THREE.SphereGeometry(.5,8,6)),glow(col,.35));o.position.set(e.x+rnd(-.6,.6),rnd(.4,1.4),e.z+rnd(-.6,.6));scene.add(o);fxs.push({o,t:0,dur:rnd(.9,1.5),kind:'p',v:{x:rnd(-.5,.5),y:rnd(.3,1),z:rnd(-.5,.5)}})}}
function circle(x,z,col){const g=new THREE.Group();g.position.set(x,.06,z);const a=new THREE.Mesh(new THREE.RingGeometry(1.6,1.8,40),gl(col,.9));a.rotation.x=-Math.PI/2;g.add(a);for(let i=0;i<6;i++){const b=new THREE.Mesh(new THREE.PlaneGeometry(.35,.35),gl(col,.9));b.rotation.x=-Math.PI/2;const t=i/6*TAU;b.position.set(Math.cos(t)*1.2,0,Math.sin(t)*1.2);b.rotation.z=t;g.add(b)}
  fxCustom(g,1,(f,k)=>{g.rotation.y=k*3;fadeAll(g,1-k)})}
function zig(pts,col){for(let r=0;r<2;r++){const out=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];for(let s=0;s<6;s++){const t=s/6;out.push(new THREE.Vector3(a.x+(b.x-a.x)*t+(s?rnd(-.5,.5):0),1.1+(s?rnd(-.4,.4):0),a.z+(b.z-a.z)*t+(s?rnd(-.5,.5):0)))}}const l=pts[pts.length-1];out.push(new THREE.Vector3(l.x,1.1,l.z));
  const o=new THREE.Line(new THREE.BufferGeometry().setFromPoints(out),new THREE.LineBasicMaterial({color:r?0xffffff:col,transparent:true,blending:THREE.AdditiveBlending}));scene.add(o);fxs.push({o,t:0,dur:.35,kind:'line',own:true})}
  for(const p of pts.slice(1)){sparkUp(p.x,p.z,col,5,.4)}}
function slashes(x,z,n,col){for(let i=0;i<n;i++)setTimeout(()=>{if(!player)return;const a=rnd(0,TAU);fxSlash(x+rnd(-2.5,2.5),z+rnd(-2.5,2.5),a,col,rnd(1.6,2.6))},i*45)}
function skillFx(sk,P){
  const n=sk.n,c=sk.col,x=P.x,z=P.z,f=P.face;
  if(/Giratório/.test(n)){spinRing(x,z,c,4.2);spinRing(x,z,0xffffff,3,.3)}
  else if(/Gelo|Inverno|Era do/.test(n)&&sk.t!=='bolt'){spikes(x,z,20,1.5,/Inverno|Era/.test(n)?8:6,0xbfefff,2.4);fxRing(x,z,0x70ddff,5,.4)}
  else if(/Julgamento/.test(n)&&sk.t==='nova'){const r=sk.n==='Julgamento'?judgmentRadius(sk):6;fxRing(x,z,0xffe066,r,.6);pillar(x,z,0xffe066,1.2,.8);for(const e of enemies)if(!e.dead&&Math.hypot(e.x-x,e.z-z)<r+e.r)pillar(e.x,e.z,0xffe066,.7)}
  else if(/Almas/.test(n)&&sk.t==='nova'){for(let i=0;i<12;i++){const a=i/12*TAU,o=projModel('soul',0xb98cff);o.rotation.y=a;const sx=x,sz=z;fxCustom(o,.6,(ff,k)=>{o.position.set(sx+Math.sin(a)*6*k,1+Math.sin(k*Math.PI)*.8,sz+Math.cos(a)*6*k);fadeAll(o,1-k)})}}
  else if(/Domínio/.test(n)){spikes(x,z,22,1.2,6.5,0x1a0a33,2.8,true);spikes(x,z,10,1,5,0xb98cff,2)}
  else if(/Mil Cortes/.test(n)){slashes(x,z,12,c);spinRing(x,z,c,4,.4)}
  else if(sk.t==='nova'&&(sk.sourceClass===10||/Sísmico/.test(n))){for(let i=0;i<9;i++){const a=i/9*TAU+f*.35,r=1.4+(i%3)*1.15;groundFacet(x+Math.cos(a)*r,z+Math.sin(a)*r,.34+(i%3)*.09,i%2?c:0x9a7b50,a)}rocks(x,z,4,0x766044)}
  else if(/Impacto|Sísmico/.test(n)){cracks(x,z,/Sísmico/.test(n)?8:6,c);rocks(x,z,10,0x5a5a6a)}
  else if(/Chama/.test(n)){for(let i=0;i<8;i++){const a=i/8*TAU;pillar(x+Math.cos(a)*4,z+Math.sin(a)*4,0xff5a1e,.6,.8)}pillar(x,z,0xffa040,1,.6)}
  else if(sk.t==='cone'){waveFwd(x,z,f,c,/Autoridade/.test(n)?7:5,/Autoridade/.test(n)?4:3);if(/Rúnica/.test(n))circle(x+Math.sin(f)*2,z+Math.cos(f)*2,c);if(/Escudo/.test(n))rocks(x+Math.sin(f)*2,z+Math.cos(f)*2,5,0x6a6a7a)}
  else if(sk.t==='heal'){sparkUp(x,z,c,/Sol/.test(n)?40:22,/Sol/.test(n)?4:1.4);if(/Sol/.test(n))pillar(x,z,0xfff3a0,2.2,1)}
  else if(sk.t==='guard')bubble(5,c);
  else if(sk.t==='buff_dmg'){for(let i=0;i<24;i++){const o=new THREE.Mesh(geo('fxp',()=>new THREE.SphereGeometry(.13,6,4)),glow(i%2?0xff3322:0xff8a1e,1));const a=rnd(0,TAU);o.position.set(x+Math.cos(a)*.7,rnd(0,.5),z+Math.sin(a)*.7);scene.add(o);fxs.push({o,t:0,dur:rnd(.5,.9),kind:'p',v:{x:0,y:rnd(4,7),z:0}})}}
  else if(sk.t==='stealth'){for(let i=0;i<10;i++){const o=new THREE.Mesh(geo('cl',()=>new THREE.SphereGeometry(.5,8,6)),glow(0x6a6a7a,.4));o.position.set(x+rnd(-.8,.8),rnd(.3,1.5),z+rnd(-.8,.8));scene.add(o);fxs.push({o,t:0,dur:.8,kind:'p',v:{x:rnd(-2,2),y:1,z:rnd(-2,2)}})}}
  else if(sk.t==='summon')circle(x,z,c);
  else if(sk.n==='Lâmina Envenenada'){cloud({x,z},c)}
  else if(sk.t==='dot'){for(const e of enemies)if(!e.dead&&Math.hypot(e.x-x,e.z-z)<5.5)cloud(e,c);cloud({x,z},c)}
}
function castFluid139(sk){if(!window.Combat139||!player)return;const cls=sk.sourceClass??profile.cls;/* v179 (Ian): rastro luminoso só nas classes corpo a corpo; magos e arqueiro já têm projéteis próprios */if(CLASSES[cls]&&CLASSES[cls].ranged)return;const v=Combat139.cast(sk,cls);if(v){let x=player.x,z=player.z;if(sk.kit111&&sk.ground){const p=kitPoint111(sk);x=p.x;z=p.z}else if(['rain','thunderstorm'].includes(sk.t)){const p=skillGroundPoint();x=p.x;z=p.z}v.group.position.set(x,0,z);v.group.rotation.y=player.face-Math.PI/2;fxCustom(v.group,.7,(_,k)=>v.update(k))}const chain=Combat139.sequence(sk,cls);if(chain){chain.group.position.set(player.x,0,player.z);fxCustom(chain.group,1.15,(_,k)=>chain.update(k));floater(player.x,player.z,'RESSONÂNCIA TRIPLA','#d9c4ff')}}

