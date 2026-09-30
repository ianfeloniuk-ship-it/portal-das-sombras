/* Short-lived, layered melee trails. Shared geometry, no textures or extra lights. */
window.Combat139=(()=>{
 let strip,sparks;
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
 const shapes={};let earthMap;const noise=`float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(p+vec2(0.,1.)),h(i+1.),f.x),f.y);}float fb(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=n(p)*a;p=mat2(.8,-.6,.6,.8)*p*2.03+3.7;a*=.5;}return v;}`;
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
 function cast(skill,cls){const family=families[cls]||'arcane',type=skill.effect||skill.t,color=skill.col??0xb6a0ff;
 if(cls===0&&(/Giratório/.test(skill.n)||type==='nova'))return create(color,4.2,true);
 if(['cone','dash_strike','line','target','execute','push','pull','counter','interrupt'].includes(type)&&[0,1,2,4,14,15].includes(cls))return create(color,2.5,false);
 const group=new THREE.Group(),ground=['area','nova','rain','dot','pulses','field','zone','healzone','trap','barrier','slowzone'].includes(type),guard=['guard','ward','holy_shield','minionbuff','buff_dmg','heal','cleanse','stealth','allybuff'].includes(type),form=guard?'guard':'disc',mesh=surface(color,family,form),radius=ground?(type==='nova'||type==='healzone'?2.5:1.8):1.05;
 if(form==='guard'){mesh.position.y=.95;mesh.scale.set(radius,1.2,radius)}else{mesh.rotation.x=-Math.PI/2;mesh.position.y=.12;mesh.scale.setScalar(radius)}group.add(mesh);
 const lift=surface(color,family,'orb');lift.position.y=guard?1.05:ground?.24:.68;if(guard)lift.scale.set(.33,.72,.33);else if(ground)lift.scale.setScalar(.19);else lift.scale.set(.33,.48,.33);lift.material.uniforms.opacity.value=.24;group.add(lift);
 return{group,update(k){const fade=Math.sin(Math.PI*Math.min(1,k));mesh.material.uniforms.opacity.value=fade*(ground?.88:.72);lift.material.uniforms.opacity.value=fade*.38;if(ground)mesh.scale.setScalar(radius*(.55+k*.48));lift.rotation.y=k*1.3;}};
 }
 return{create,basicMelee,cast,projectile,families};
})();
