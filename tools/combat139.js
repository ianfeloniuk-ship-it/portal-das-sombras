/* Short-lived, layered melee trails. Shared geometry, no textures or extra lights. */
window.Combat139=(()=>{
 let strip,sparks,sequenceQueue=[];
 function geometry(){if(strip)return strip;const p=[],uv=[],ix=[];for(let i=0;i<=64;i++){for(let side=0;side<2;side++){p.push(0,0,0);uv.push(i/64,side)}if(i<64){const a=i*2;ix.push(a,a+1,a+2,a+1,a+3,a+2)}}strip=new THREE.BufferGeometry();strip.setAttribute('position',new THREE.Float32BufferAttribute(p,3));strip.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));strip.setIndex(ix);return strip;}
 function arc(color,radius,width,start,span){const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,uniforms:{t:{value:0},tint:{value:new THREE.Color(color)},radius:{value:radius},width:{value:width},start:{value:start},span:{value:span}},vertexShader:`varying vec2 v;uniform float radius,width,start,span,t;void main(){v=uv;float a=start+uv.x*span;float r=radius-width*uv.y*(.45+.55*sin(uv.x*3.14159));vec3 p=vec3(cos(a)*r,sin(a)*r,0.);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,fragmentShader:`varying vec2 v;uniform vec3 tint;uniform float t;void main(){float taper=pow(max(0.,sin(v.x*3.14159)),.7);float edge=exp(-v.y*7.);float threads=.65+.35*sin(v.x*85.-v.y*24.-t*11.);float alpha=taper*(edge*.8+pow(1.-v.y,2.)*.25*threads)*pow(1.-t,1.4)*smoothstep(0.,.07,t);vec3 color=mix(tint,vec3(1.,.96,.85),edge*.78);gl_FragColor=vec4(color,alpha);}`});const mesh=new THREE.Mesh(geometry(),material);mesh.frustumCulled=false;mesh.rotation.x=-Math.PI/2;return mesh;}
 function particles(color,spin){if(!sparks){const p=[],v=[];for(let i=0;i<18;i++){const a=i*2.399;p.push(0,0,0);v.push(Math.cos(a)*(1.5+(i%4)),.5+(i%5)*.35,Math.sin(a)*(1.5+(i%4)))}sparks=new THREE.BufferGeometry();sparks.setAttribute('position',new THREE.Float32BufferAttribute(p,3));sparks.setAttribute('velocity',new THREE.Float32BufferAttribute(v,3));}
 const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{t:{value:0},tint:{value:new THREE.Color(color)},size:{value:spin?4:2.6}},vertexShader:`attribute vec3 velocity;uniform float t,size;void main(){vec3 p=velocity*t;p.y-=t*t*1.2;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(size*16./max(1.,-mv.z),1.,5.);}`,fragmentShader:`uniform float t;uniform vec3 tint;void main(){float a=1.-smoothstep(.15,.5,length(gl_PointCoord-.5));gl_FragColor=vec4(mix(tint,vec3(1.),.4),a*pow(1.-t,2.)*.7);}`});const obj=new THREE.Points(sparks,mat);obj.frustumCulled=false;return obj;}
 function create(color,radius,spin=false){const group=new THREE.Group(),arcs=[];const count=spin?2:1;for(let i=0;i<count;i++){const a=arc(color,radius*(i? .78:1),radius*(spin?.20:.27),i*Math.PI,spin?Math.PI*1.3:1.8);a.position.y=spin?.45+i*.24:.85;group.add(a);arcs.push(a)}const dust=particles(color,spin);dust.position.y=.35;group.add(dust);return{group,update(k){for(let i=0;i<arcs.length;i++){const a=arcs[i];a.material.uniforms.t.value=k;a.rotation.z=(spin?k*Math.PI*2:k*.55)+(spin?i*.1:0);a.scale.setScalar(.88+k*.18)}dust.material.uniforms.t.value=k;}};}
 // Basic attacks reuse the proven aim-aligned crescent, with a distinct weapon read per melee class.
 function basicMelee(cls,color,radius,third=false){
  const group=new THREE.Group(),arcs=[],set=(tint,scale,width,start,span,height)=>{const a=arc(tint,radius*scale,radius*width,start,span);a.position.y=height;group.add(a);arcs.push(a)};
  if(cls===1){set(color,1,.15,-.98,1.0,.82);set(0xcbb5ff,.72,.12,.08,1.02,1.08);if(third)set(0xffffff,1.04,.085,-.55,1.05,1.25)}
  else if(cls===2){set(color,1,.36,-.78,1.62,.67);set(0xe7f3ff,.84,.09,-.70,1.42,.96)}
  else if(cls===14){set(color,1,.23,-.90,1.65,.85);set(0xffe6a0,.72,.08,-.55,1.0,1.12)}
  else if(cls===15){set(color,1,.18,-1.05,1.35,.82);set(0xd8ffc0,.72,.09,-.25,.95,1.05);if(third)set(0xffffff,1.08,.08,-.75,1.5,1.2)}
  else if(cls===17){set(color,1,.17,-1.0,1.1,.78);set(0xb6a0ff,.70,.11,.08,1.05,1.06)}
  else{set(color,1,.27,-.90,1.8,.85);if(third)set(0xffedb0,1.08,.10,-.90,1.8,1.03)}
  const dust=particles(color,third);dust.position.y=.28;group.add(dust);
  return{group,update(k){for(let i=0;i<arcs.length;i++){const a=arcs[i];a.material.uniforms.t.value=k;a.rotation.z=k*(cls===1?-.42:.48)+i*.025;a.scale.setScalar(.84+k*.22)}dust.material.uniforms.t.value=k;}};
 }

 const families=['steel','shadow','earth','fire','wind','holy','arcane','shadow','fire','ice','earth','lightning','time','rift','holy','wild','arcane','shadow','arcane','rift','void'];
 const modes={steel:0,fire:1,ice:2,earth:3,holy:4,shadow:5,arcane:6,wind:7,lightning:8,time:9,rift:10,wild:7,void:5};
 const shapes={};let earthMap;const noise=`float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+1.),f.x),f.y);}float fb(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=n(p)*a;p=mat2(.8,-.6,.6,.8)*p*2.03+3.7;a*=.5;}return v;}`;
 function surface(color,family,form){const sphere=form==='orb'||form==='guard';const key=sphere?'sphere':'plane';if(!shapes[key])shapes[key]=sphere?new THREE.SphereGeometry(1,20,14):new THREE.PlaneGeometry(2,2);const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.NormalBlending,uniforms:{clock:{value:0},opacity:{value:1},tint:{value:new THREE.Color(color)},mode:{value:modes[family]??6},disc:{value:sphere?0:1}},vertexShader:`varying vec2 uv139;void main(){uv139=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:noise+`
 varying vec2 uv139;uniform float clock,opacity,mode,disc;uniform vec3 tint;
 void main(){vec2 p=uv139*2.-1.;float r=length(p),angle=atan(p.y,p.x);float rate=mode==2.?.24:mode==3.?.35:mode==8.?2.8:mode==4.?.55:1.;float t=clock*rate;
 vec2 flow=p*2.4;float spin=angle+sin(r*5.-t)*.18;
 if(mode==1.)flow=vec2(p.x*2.2+sin(p.y*3.-t)*.35,p.y*2.6-t*.7);
 else if(mode==5.||mode==10.)flow=vec2(spin*1.15+r*2.-t*.32,r*2.4+t*.34);
 else if(mode==7.)flow=vec2(p.x*1.8+t*.55+sin(p.y*2.)*.2,p.y*3.+t*.12);
 else flow+=vec2(t*.16,-t*.28);
 float warp=fb(flow+vec2(fb(flow+vec2(t*.08,-t*.12)),fb(flow+2.7-vec2(t*.07)))*1.25);
 float current=.5+.5*sin(warp*8.+sin(flow.x*1.7+flow.y*1.2-t*.38)*1.2-t*.5);
 float filament=smoothstep(.70,.96,current)*smoothstep(.18,.48,warp);
 float body=smoothstep(.12,.40,warp)*(.78+.22*current);
 if(mode==2.){float frost=.5+.5*sin(flow.x*2.4+sin(flow.y*2.-t*.3));filament*=.35+.65*smoothstep(.58,.9,frost);}
 if(mode==9.)filament*=.65+.35*(.5+.5*sin(r*11.-t*1.3));
 if(mode==3.)body*=.7+.3*n(floor(p*9.));
 if(mode==8.){float pulse=.5+.5*sin(flow.y*2.+flow.x*.7-t*.9);filament*=smoothstep(.68,.94,pulse)*.6;}
 float grain=fb(uv139*58.+vec2(t*.035,-t*.02));float boundary=mix(.8,(1.-smoothstep(.64,1.,r))*(.6+.4*warp),disc);float alpha=boundary*(body*.72+filament*.48)*opacity;vec3 col=mix(tint*.72,tint*1.5,body*.7+filament*.3);col*=.92+.12*grain;gl_FragColor=vec4(col,alpha*.62);}`});const mesh=new THREE.Mesh(shapes[key],material);mesh.frustumCulled=false;mesh.onBeforeRender=()=>{material.uniforms.clock.value=performance.now()*.001;};return mesh;}
 function earthTexture(){if(earthMap)return earthMap;const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle='#b99d6a';x.fillRect(0,0,128,128);let seed=773;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};for(let i=0;i<900;i++){const r=rand(),v=Math.round(92+r*94);x.fillStyle=`rgba(${v},${Math.round(v*.84)},${Math.round(v*.59)},${.08+r*.24})`;const px=rand()*128,py=rand()*128;x.beginPath();x.ellipse(px,py,.5+rand()*2.1,.4+rand()*1.5,rand()*3,0,Math.PI*2);x.fill()}earthMap=new THREE.CanvasTexture(c);earthMap.wrapS=earthMap.wrapT=THREE.RepeatWrapping;earthMap.colorSpace=THREE.SRGBColorSpace||earthMap.colorSpace;earthMap.needsUpdate=true;return earthMap;}
 function rockGeometry(){if(shapes.rock)return shapes.rock;const g=new THREE.DodecahedronGeometry(1,0).toNonIndexed(),p=g.attributes.position,colors=[];for(let i=0;i<p.count;i+=3){const shade=.70+((Math.sin(i*12.9898)*43758.5453)%1+1)%1*.38;for(let j=0;j<3;j++)colors.push(shade,shade,shade)}g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.scale(.82,.38,1);shapes.rock=g;return g;}
 function projectile(type,color,scale=1,cls=null){
  if(type==='arrow'||type==='sarrow')return null;const family=cls!=null?families[cls]:({fire:'fire',ice:'ice',spark:'lightning',soul:'shadow',holy:'holy',orb:'arcane',stone:'earth'}[type]);if(!family)return null;
  const group=new THREE.Group(),core=surface(color,family,'orb');let geo;
  if(family==='earth'){geo=rockGeometry();core.material.dispose();core.material=new THREE.MeshStandardMaterial({color, map:earthTexture(), vertexColors:true, flatShading:true, roughness:1, metalness:0});core.scale.set(.56,.56,.66);
   const edgeGeo=shapes.rockEdges||(shapes.rockEdges=new THREE.EdgesGeometry(geo,24)),edge=new THREE.LineSegments(edgeGeo,new THREE.LineBasicMaterial({color:0x382d20,transparent:true,opacity:.88}));edge.scale.copy(core.scale);group.add(edge);
  }else if(family==='ice'){geo=shapes.ice||(shapes.ice=new THREE.OctahedronGeometry(1,0));core.scale.set(.26,.30,.76)}
  else if(family==='wind'){geo=shapes.wind||(shapes.wind=new THREE.ConeGeometry(.43,1.15,5));core.rotation.x=Math.PI/2;core.scale.set(.45,.45,.92)}
  else if(family==='holy'){geo=shapes.holy||(shapes.holy=new THREE.OctahedronGeometry(.58,0));core.scale.set(.66,.66,.72)}
  else if(family==='lightning'){geo=shapes.lightning||(shapes.lightning=new THREE.OctahedronGeometry(.52,0));core.scale.set(.48,.48,.82)}
  else if(family==='fire'){geo=shapes.fire||(shapes.fire=new THREE.DodecahedronGeometry(.58,0));core.scale.set(.83,.74,1.05)}
  else if(family==='shadow'||family==='void'){geo=shapes.shadow||(shapes.shadow=new THREE.DodecahedronGeometry(.60,0));core.scale.set(.72,.84,1.08)}
  else if(family==='rift'||family==='time'){geo=shapes.rift||(shapes.rift=new THREE.IcosahedronGeometry(.60,1));core.scale.set(.72,.72,.82)}
  else{geo=shapes.arcane||(shapes.arcane=new THREE.IcosahedronGeometry(.56,1));core.scale.set(.72,.72,.82)}
  core.geometry=geo;group.add(core);
  if(family!=='earth'){const tail=surface(color,family,'orb');tail.scale.set(.20,.20,.52);tail.position.z=-.46;tail.material.uniforms.opacity.value=.36;group.add(tail)}
  if(['holy','time','rift','arcane'].includes(family)){const ringGeo=shapes.ring||(shapes.ring=new THREE.TorusGeometry(.38,.025,5,20)),halo=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color,transparent:true,opacity:.55}));halo.rotation.y=Math.PI/2;halo.scale.setScalar(family==='holy'?.8:.65);group.add(halo)}
  group.scale.setScalar(scale);group.addEventListener('removed',()=>{core.material.dispose();for(const child of group.children)if(child!==core&&child.material)child.material.dispose()});return group;
 }
 function motifGeometry(family){
  const key='motif_'+family;if(shapes[key])return shapes[key];
  return shapes[key]=family==='earth'?rockGeometry():family==='ice'?new THREE.OctahedronGeometry(1,0):family==='fire'?new THREE.ConeGeometry(.58,1.3,5):family==='wind'||family==='wild'?new THREE.ConeGeometry(.24,1.15,4):family==='lightning'||family==='holy'?new THREE.OctahedronGeometry(.8,0):family==='arcane'||family==='rift'||family==='time'?new THREE.IcosahedronGeometry(.72,0):new THREE.DodecahedronGeometry(.72,0);
 }
 function motifs(group,family,color,radius,ground,guard,skill){
  const layer=new THREE.Group(),parts=[],rings=[],name=skill?.n||'',count=ground?(family==='earth'?3:5):guard?4:2,geo=motifGeometry(family),r=ground?radius*.78:guard?.82:.30;
  const detailCount=/Chuva|Tempestade|Meteoro|Domínio/.test(name)?7:/Estaca|Lança|Flecha|Projétil/.test(name)?1:count;
  for(let i=0;i<detailCount;i++){
   const m=surface(color,family,'orb');m.geometry=geo;const a=i/detailCount*Math.PI*2+(family==='wind'||family==='wild'?.2:0),y=ground?.13:guard?.25+(i%2)*.48:.50+(i%2)*.22;
   m.position.set(detailCount===1?0:Math.cos(a)*r,y,detailCount===1?0:Math.sin(a)*r);
   if(family==='earth')m.scale.set(.22+(i%2)*.08,.22+(i%3)*.04,.27+(i%2)*.10);
   else if(family==='ice'||family==='fire'||family==='wind'||family==='wild')m.scale.set(.13,.34,.13);
   else m.scale.setScalar(.16+(i%2)*.045);
   m.rotation.set(.12*i,a,.18*i);m.userData.base=m.scale.clone();layer.add(m);parts.push(m);
  }
  if(['holy','arcane','time','rift','lightning'].includes(family)){
   const geom=shapes['motifRing_'+family]||(shapes['motifRing_'+family]=new THREE.TorusGeometry(radius*(ground?.78:.43),family==='holy'?.045:.026,5,32));
   const ring=new THREE.Mesh(geom,new THREE.MeshBasicMaterial({color,transparent:true,opacity:.6,depthWrite:false}));ring.rotation.x=ground?-Math.PI/2:0;ring.position.y=ground?.08:guard?.92:.55;layer.add(ring);rings.push(ring);
   if(family==='time'||family==='rift'){const inner=new THREE.Mesh(geom,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.32,depthWrite:false}));inner.rotation.copy(ring.rotation);inner.position.copy(ring.position);inner.scale.setScalar(.68);layer.add(inner);rings.push(inner)}
  }
  group.add(layer);
  return k=>{layer.rotation.y=(family==='time'?-1:1)*k*1.35;const pulse=.72+.28*Math.sin(k*Math.PI);for(const m of parts){m.scale.copy(m.userData.base).multiplyScalar(pulse);m.material.uniforms.opacity.value=Math.sin(Math.PI*k)*.78}for(const ring of rings){ring.rotation.z+=.025;ring.material.opacity=.6*Math.sin(Math.PI*k)}};
 }
 // Class-signature silhouettes sit on top of existing spell material; gameplay stays untouched.
 function signature(skill,cls,color){
  const root=new THREE.Group(),parts=[],rings=[],arcs=[];const mat=(c=color,opacity=.82)=>new THREE.MeshStandardMaterial({color:c,roughness:.76,metalness:.08,transparent:true,opacity,depthWrite:false,emissive:c,emissiveIntensity:.12});
  const add=(geo,pos,scale,c=color,opacity=.82,rot=null)=>{const m=new THREE.Mesh(geo,mat(c,opacity));m.position.set(...pos);m.scale.set(...scale);if(rot)m.rotation.set(...rot);root.add(m);parts.push(m);return m};
  const ring=(r,t,c=color,y=.55)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(r,t,5,32),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.72,depthWrite:false}));m.position.y=y;root.add(m);rings.push(m);return m};
  const shard=shapes.sigShard||(shapes.sigShard=new THREE.ConeGeometry(.16,.68,5));
  switch(cls){
   case 0: return null; // Keep the approved Warrior sword sweep intact.
   case 1: for(let i=0;i<3;i++){const a=arc(color,1.0-i*.13,.13,-.95+i*.78,1.08,.72+i*.18);root.add(a);arcs.push(a)}break;
   case 2: add(shapes.sigShield||(shapes.sigShield=new THREE.CylinderGeometry(.58,.66,.16,6)),[0,.88,.38],[1,1,1],0x9fd3ff,.84,[Math.PI/2,0,0]);add(shapes.sigShield||(shapes.sigShield=new THREE.CylinderGeometry(.58,.66,.16,6)),[0,.88,.40],[.68,.68,.68],color,.8,[Math.PI/2,0,0]);break;
   case 3: ring(.66,.035,color,.58);for(let i=0;i<3;i++)add(shapes.sigCore||(shapes.sigCore=new THREE.IcosahedronGeometry(.13,0)),[Math.cos(i*2.094)*.68,.56,Math.sin(i*2.094)*.68],[1,1,1],i===0?0xff8752:i===1?0x70ddff:0xfff36b,.95);break;
   case 4: for(let i=0;i<5;i++)add(shard,[(i-2)*.22,.62,.40+Math.abs(i-2)*.08],[.46,.72,.38],i%2?color:0xe5ffd0,.9,[0,0,(i-2)*-.22]);break;
   case 5: ring(.58,.035,0xffe49b,.5);add(shapes.sigBeam||(shapes.sigBeam=new THREE.CylinderGeometry(.045,.13,.92,8)),[0,1.05,.2],[1,1,1],0xffefbd,.72);add(shapes.sigCore||(shapes.sigCore=new THREE.IcosahedronGeometry(.13,0)),[0,.52,.2],[1.1,1.1,1.1],0xfff3c4,.95);break;
   case 6: ring(.48,.045,color,.18);for(let i=0;i<4;i++)add(shapes.sigCore||(shapes.sigCore=new THREE.IcosahedronGeometry(.13,0)),[(i-1.5)*.2,.40,.38],[.76,.76,.76],0x9bdcff,.9);break;
   case 7: add(shapes.sigSkull||(shapes.sigSkull=new THREE.DodecahedronGeometry(.30,0)),[0,.72,.38],[.86,1.08,.72],0xe2d8c8,.92);for(let i=0;i<2;i++)add(shapes.sigBone||(shapes.sigBone=new THREE.CylinderGeometry(.035,.035,.78,5)),[i?-.31:.31,.64,.36],[1,1,1],0xd7c7a8,.88,[0,0,i?-.48:.48]);ring(.57,.022,0x955cff,.62);break;
   case 8: for(let i=0;i<3;i++)add(shapes.sigMeteor||(shapes.sigMeteor=new THREE.DodecahedronGeometry(.22,0)),[(i-1)*.38,.72+Math.abs(i-1)*.18,.28],[1.2,1.45,1],i===1?0xffd08a:0xff7040,.92,[.4*i,.3*i,.7*i]);break;
   case 9: for(let i=0;i<5;i++)add(shard,[(i-2)*.24,.68,.30+Math.abs(i-2)*.07],[.54,1.0,.44],i%2?0xb9f1ff:0x70ddff,.86,[0,0,(i-2)*-.13]);ring(.72,.018,0xb9f1ff,.28);break;
   case 10: {const rock=add(rockGeometry(),[0,.54,.34],[.38,.30,.40],color,.96,[.22,.1,.18]);rock.material= new THREE.MeshStandardMaterial({color:0xc6aa74,map:earthTexture(),vertexColors:true,flatShading:true,roughness:1});const edge=new THREE.LineSegments(shapes.rockEdges||(shapes.rockEdges=new THREE.EdgesGeometry(rockGeometry(),24)),new THREE.LineBasicMaterial({color:0x382d20,transparent:true,opacity:.88}));edge.position.copy(rock.position);edge.scale.copy(rock.scale);root.add(edge);break;}
   case 11: ring(.50,.025,0xfff36b,.7);for(let i=0;i<3;i++){const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3((i-1)*.38,.42,.35),new THREE.Vector3((i-1)*.2,.95,.30),new THREE.Vector3((1-i)*.34,1.30,.30));const line=new THREE.Mesh(new THREE.TubeGeometry(curve,8,.025,4,false),mat(0xfff36b,.95));root.add(line);parts.push(line)}break;
   case 12: {const r=ring(.62,.025,0x9bcaff,.65);for(let i=0;i<8;i++){const a=i*Math.PI/4;add(shapes.sigTick||(shapes.sigTick=new THREE.BoxGeometry(.045,.18,.035)),[Math.cos(a)*.61,.65+Math.sin(a)*.61,.25],[1,1,1],0xe4efff,.9,[0,0,a])}const hand=add(shapes.sigHand||(shapes.sigHand=new THREE.BoxGeometry(.035,.47,.035)),[0,.65,.29],[1,1,1],0xffffff,.95);hand.userData.hand=true;break;}
   case 13: ring(.62,.035,0x9c65ff,.72);ring(.46,.018,0xe0caff,.72);add(shapes.sigCore||(shapes.sigCore=new THREE.IcosahedronGeometry(.12,0)),[0,.72,.30],[1,1,1],0xd7b4ff,.9);break;
   case 14: for(let i=0;i<3;i++)ring(.34,.035,i===1?0xffe7a6:color,.46+i*.23);break;
   case 15: for(let i=0;i<3;i++){const a=arc(color,.92-i*.14,.14,-.80+i*.58,1.0,.62+i*.12);root.add(a);arcs.push(a)}break;
   case 16: ring(.58,.022,0x8fe8ff,.62);for(let i=0;i<4;i++)add(shapes.sigTick||(shapes.sigTick=new THREE.BoxGeometry(.045,.18,.035)),[Math.cos(i*Math.PI/2)*.56,.62,Math.sin(i*Math.PI/2)*.56],[1,1,1],0x8fe8ff,.94,[0,i*Math.PI/2,0]);add(shapes.sigCore||(shapes.sigCore=new THREE.IcosahedronGeometry(.13,0)),[0,.62,.25],[1,1,1],0x8fe8ff,.95);break;
   case 17: ring(.48,.03,0xbda2ff,.62);for(let i=0;i<2;i++){const a=arc(i?0xf3edff:color,.9-i*.25,.11,-.7+i*.55,1.15,.75+i*.28);root.add(a);arcs.push(a)}break;
   case 18: add(shapes.sigCore||(shapes.sigCore=new THREE.IcosahedronGeometry(.22,1)),[0,.73,.32],[1,1,1],0xffe978,.96);ring(.47,.025,0x8defff,.73);for(let i=0;i<3;i++){const a=arc(0x8defff,.78,.07,-.78+i*.55,.58,.68+i*.10);root.add(a);arcs.push(a)}break;
   case 19: ring(.52,.025,0xc8b4ff,.66);ring(.25,.018,0xffe6a3,.66);add(shapes.sigEye||(shapes.sigEye=new THREE.SphereGeometry(.11,12,8)),[0,.66,.22],[1.4,.72,.7],0xffe6a3,.94);break;
   case 20: add(shapes.sigVoid||(shapes.sigVoid=new THREE.IcosahedronGeometry(.26,1)),[0,.70,.32],[1,1,1],0x34184e,.96);ring(.45,.03,0xb071ed,.7);ring(.65,.018,0x6f38a6,.7);break;
  }
  for(const m of parts)m.userData.sigBase=m.scale.clone();root.userData.parts=parts;root.userData.rings=rings;root.userData.arcs=arcs;return{group:root,update(k){const pulse=.9+.1*Math.sin(k*Math.PI*2);for(const m of parts){if(m.userData.hand)m.rotation.z=-k*Math.PI*3;else m.rotation.y+=.012;m.scale.copy(m.userData.sigBase).multiplyScalar(pulse)}for(let i=0;i<rings.length;i++){rings[i].rotation.y+=(i%2?-.025:.035);rings[i].material.opacity=.45+.3*Math.sin(k*Math.PI)}for(const a of arcs){a.material.uniforms.t.value=k;a.rotation.z+=.012;a.scale.setScalar(.9+k*.14)}}};
 }
 function decorate(result,skill,cls,color){const s=signature(skill,cls,color);if(!s)return result;result.group.add(s.group);const update=result.update;result.update=k=>{update(k);s.update(k)};return result;}
 function sequence(skill,cls){
  const now=performance.now(),key=(skill.skillId||skill.n||'skill')+':'+cls,entry={key,color:skill.col??0xb6a0ff,family:families[cls]||'arcane'};
  if(!sequenceQueue.length||now-sequenceQueue[sequenceQueue.length-1].at>6500)sequenceQueue=[];
  if(sequenceQueue.at(-1)?.key===key){sequenceQueue=[{...entry,at:now}];return null}
  sequenceQueue=sequenceQueue.filter(x=>x.key!==key);sequenceQueue.push({...entry,at:now});if(sequenceQueue.length<3)return null;
  const trio=sequenceQueue.slice(-3);sequenceQueue=[{...trio[2],at:now}];
  const group=new THREE.Group(),nodes=[],rings=[],lines=[],radius=1.22;
  for(let i=0;i<3;i++){
   const a=-Math.PI/2+i*Math.PI*2/3,x=Math.cos(a)*radius,z=Math.sin(a)*radius,item=trio[i];
   const ring=new THREE.Mesh(new THREE.TorusGeometry(.34,.026,5,24),new THREE.MeshBasicMaterial({color:item.color,transparent:true,opacity:.82,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.set(x,.22,z);group.add(ring);rings.push(ring);
   const core=new THREE.Mesh(motifGeometry(item.family),new THREE.MeshStandardMaterial({color:item.color,emissive:item.color,emissiveIntensity:.22,roughness:.65,transparent:true,opacity:.92,depthWrite:false}));core.position.set(x,.72,z);core.scale.setScalar(.18);core.userData.home=core.position.clone();group.add(core);nodes.push(core);
  }
  for(let i=0;i<3;i++){
   const a=-Math.PI/2+i*Math.PI*2/3,b=-Math.PI/2+(i+1)*Math.PI*2/3,p1=new THREE.Vector3(Math.cos(a)*radius,.42,Math.sin(a)*radius),p2=new THREE.Vector3(Math.cos(b)*radius,.42,Math.sin(b)*radius),mid=new THREE.Vector3((p1.x+p2.x)*.20,.8,(p1.z+p2.z)*.20),curve=new THREE.QuadraticBezierCurve3(p1,mid,p2),line=new THREE.Mesh(new THREE.TubeGeometry(curve,16,.024,4,false),new THREE.MeshBasicMaterial({color:0xe5d8ff,transparent:true,opacity:.65,depthWrite:false}));group.add(line);lines.push(line)
  }
  const center=new THREE.Mesh(new THREE.IcosahedronGeometry(.20,1),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.9,depthWrite:false}));center.position.y=.52;group.add(center);nodes.push(center);
  return{group,update(k){const fade=Math.sin(Math.PI*k),pulse=.84+.16*Math.sin(k*Math.PI*4);for(const m of nodes){m.material.opacity=.92*fade;m.scale.setScalar((m===center?.20:.18)*pulse);m.rotation.y+=.045}for(const r of rings){r.material.opacity=.82*fade;r.rotation.z+=.035}for(const l of lines)l.material.opacity=.65*fade}};
 }
 function cast(skill,cls){const family=families[cls]||'arcane',type=skill.effect||skill.t,color=skill.col??0xb6a0ff;
 if(cls===0&&(/Giratório/.test(skill.n)||type==='nova'))return create(color,4.2,true);
 if(['cone','dash_strike','line','target','execute','push','pull','counter','interrupt'].includes(type)&&[0,1,2,4,14].includes(cls))return decorate(create(color,2.5,false),skill,cls,color);
 const group=new THREE.Group(),ground=['area','nova','rain','dot','pulses','field','zone','healzone','trap','barrier','slowzone'].includes(type),guard=['guard','ward','holy_shield','minionbuff','buff_dmg','heal','cleanse','stealth','allybuff'].includes(type),form=guard?'guard':'disc',mesh=surface(color,family,form),radius=ground?(type==='nova'||type==='healzone'?2.5:1.8):1.05;
 if(form==='guard'){mesh.position.y=.95;mesh.scale.set(radius,1.2,radius)}else{mesh.rotation.x=-Math.PI/2;mesh.position.y=.12;mesh.scale.setScalar(radius)}group.add(mesh);
 const lift=surface(color,family,'orb');lift.position.y=guard?1.05:ground?.24:.68;if(guard)lift.scale.set(.33,.72,.33);else if(ground)lift.scale.setScalar(.19);else lift.scale.set(.33,.48,.33);lift.material.uniforms.opacity.value=family==='earth'?0:.24;group.add(lift);
 const detailUpdate=motifs(group,family,color,radius,ground,guard,skill);
 return decorate({group,update(k){const fade=Math.sin(Math.PI*Math.min(1,k));mesh.material.uniforms.opacity.value=fade*(ground?.88:.72);lift.material.uniforms.opacity.value=fade*(family==='earth'?0:.38);if(ground)mesh.scale.setScalar(radius*(.55+k*.48));lift.rotation.y=k*1.3;detailUpdate(k)}},skill,cls,color);
 }
 return{create,basicMelee,cast,projectile,sequence,families};
})();
