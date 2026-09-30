/* Short-lived, layered melee trails. Shared geometry, no textures or extra lights. */
window.Combat139=(()=>{
 let strip,sparks;
 function geometry(){if(strip)return strip;const p=[],uv=[],ix=[];for(let i=0;i<=64;i++){for(let side=0;side<2;side++){p.push(0,0,0);uv.push(i/64,side)}if(i<64){const a=i*2;ix.push(a,a+1,a+2,a+1,a+3,a+2)}}strip=new THREE.BufferGeometry();strip.setAttribute('position',new THREE.Float32BufferAttribute(p,3));strip.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));strip.setIndex(ix);return strip;}
 function arc(color,radius,width,start,span){const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,uniforms:{t:{value:0},tint:{value:new THREE.Color(color)},radius:{value:radius},width:{value:width},start:{value:start},span:{value:span}},vertexShader:`varying vec2 v;uniform float radius,width,start,span,t;void main(){v=uv;float a=start+uv.x*span;float r=radius-width*uv.y*(.45+.55*sin(uv.x*3.14159));vec3 p=vec3(cos(a)*r,sin(a)*r,0.);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,fragmentShader:`varying vec2 v;uniform vec3 tint;uniform float t;void main(){float taper=pow(max(0.,sin(v.x*3.14159)),.7);float edge=exp(-v.y*7.);float threads=.65+.35*sin(v.x*85.-v.y*24.-t*11.);float alpha=taper*(edge*.8+pow(1.-v.y,2.)*.25*threads)*pow(1.-t,1.4)*smoothstep(0.,.07,t);vec3 color=mix(tint,vec3(1.,.96,.85),edge*.78);gl_FragColor=vec4(color,alpha);}`});const mesh=new THREE.Mesh(geometry(),material);mesh.frustumCulled=false;mesh.rotation.x=-Math.PI/2;return mesh;}
 function particles(color,spin){if(!sparks){const p=[],v=[];for(let i=0;i<18;i++){const a=i*2.399;p.push(0,0,0);v.push(Math.cos(a)*(1.5+(i%4)),.5+(i%5)*.35,Math.sin(a)*(1.5+(i%4)))}sparks=new THREE.BufferGeometry();sparks.setAttribute('position',new THREE.Float32BufferAttribute(p,3));sparks.setAttribute('velocity',new THREE.Float32BufferAttribute(v,3));}
 const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{t:{value:0},tint:{value:new THREE.Color(color)},size:{value:spin?4:2.6}},vertexShader:`attribute vec3 velocity;uniform float t,size;void main(){vec3 p=velocity*t;p.y-=t*t*1.2;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(size*16./max(1.,-mv.z),1.,5.);}`,fragmentShader:`uniform float t;uniform vec3 tint;void main(){float a=1.-smoothstep(.15,.5,length(gl_PointCoord-.5));gl_FragColor=vec4(mix(tint,vec3(1.),.4),a*pow(1.-t,2.)*.7);}`});const obj=new THREE.Points(sparks,mat);obj.frustumCulled=false;return obj;}
 function create(color,radius,spin=false){const group=new THREE.Group(),arcs=[];const count=spin?2:1;for(let i=0;i<count;i++){const a=arc(color,radius*(i? .78:1),radius*(spin?.20:.27),i*Math.PI,spin?Math.PI*1.3:1.8);a.position.y=spin?.45+i*.24:.85;group.add(a);arcs.push(a)}const dust=particles(color,spin);dust.position.y=.35;group.add(dust);return{group,update(k){for(let i=0;i<arcs.length;i++){const a=arcs[i];a.material.uniforms.t.value=k;a.rotation.z=(spin?k*Math.PI*2:k*.55)+(spin?i*.1:0);a.scale.setScalar(.88+k*.18)}dust.material.uniforms.t.value=k;}};}

 const families=['steel','shadow','earth','fire','wind','holy','arcane','shadow','fire','ice','earth','lightning','time','rift','holy','wild','arcane','shadow','arcane','rift','void'];
 const modes={steel:0,fire:1,ice:2,earth:3,holy:4,shadow:5,arcane:6,wind:7,lightning:8,time:9,rift:10,wild:7,void:5};
 const shapes={};const noise=`float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+1.),f.x),f.y);}float fb(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=n(p)*a;p=mat2(.8,-.6,.6,.8)*p*2.03+3.7;a*=.5;}return v;}`;
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
 float boundary=mix(.8,(1.-smoothstep(.64,1.,r))*(.6+.4*warp),disc);float alpha=boundary*(body*.72+filament*.48)*opacity;vec3 col=mix(tint*.72,tint*1.5,body*.7+filament*.3);gl_FragColor=vec4(col,alpha*.62);}`});const mesh=new THREE.Mesh(shapes[key],material);mesh.frustumCulled=false;mesh.onBeforeRender=()=>{material.uniforms.clock.value=performance.now()*.001;};return mesh;}
 function projectile(type,color,scale=1){const family={fire:'fire',ice:'ice',spark:'lightning',soul:'shadow',holy:'holy',orb:'arcane'}[type];if(!family)return null;const group=new THREE.Group(),core=surface(color,family,'orb');core.scale.set(.30,.30,type==='ice'?.72:.39);group.add(core);const tail=surface(color,family,'orb');tail.scale.set(.23,.23,.65);tail.position.z=-.46;tail.material.uniforms.opacity.value=.55;group.add(tail);group.scale.setScalar(scale);group.addEventListener('removed',()=>{core.material.dispose();tail.material.dispose()});return group;}
 function cast(skill,cls){const family=families[cls]||'arcane',type=skill.effect||skill.t,color=skill.col??0xb6a0ff;
 if(cls===0&&(/Giratório/.test(skill.n)||type==='nova'))return create(color,4.2,true);
 if(['cone','dash_strike','line','target','execute','push','pull','counter','interrupt'].includes(type)&&[0,1,2,4,14,15].includes(cls))return create(color,2.5,false);
 const group=new THREE.Group(),ground=['area','nova','rain','dot','pulses','field','zone','healzone','trap','barrier','slowzone'].includes(type),guard=['guard','ward','holy_shield','minionbuff','buff_dmg','heal','cleanse','stealth','allybuff'].includes(type),form=guard?'guard':'disc',mesh=surface(color,family,form),radius=ground?(type==='nova'||type==='healzone'?2.5:1.8):1.05;
 if(form==='guard'){mesh.position.y=.95;mesh.scale.set(radius,1.2,radius)}else{mesh.rotation.x=-Math.PI/2;mesh.position.y=.12;mesh.scale.setScalar(radius)}group.add(mesh);
 const lift=surface(color,family,'orb');lift.position.y=guard?1.05:ground?.24:.68;if(guard)lift.scale.set(.33,.72,.33);else if(ground)lift.scale.setScalar(.19);else lift.scale.set(.33,.48,.33);lift.material.uniforms.opacity.value=.24;group.add(lift);
 return{group,update(k){const fade=Math.sin(Math.PI*Math.min(1,k));mesh.material.uniforms.opacity.value=fade*(ground?.88:.72);lift.material.uniforms.opacity.value=fade*.38;if(ground)mesh.scale.setScalar(radius*(.55+k*.48));lift.rotation.y=k*1.3;}};
 }
 return{create,cast,projectile,families};
})();
