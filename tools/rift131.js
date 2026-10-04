/* Original sculpted rift. Geometry, effects and motion shared by preview and game. */
(function(global){
 'use strict';const T=global.THREE,TAU=Math.PI*2,textures=new Map();
 // v153: rounded liquid oval; the old pointed crown vertex read as a "tip" on the portal.
 const contour=Array.from({length:15},(_,i)=>{const a=(i+.5)/15*Math.PI*2;return[-1.38*(1+.045*Math.sin(3*a+1.))*Math.sin(a),2.62-2.44*(1+.03*Math.sin(2*a+.4))*Math.cos(a)];});
 const noise=`float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);} float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);} float fbm(vec2 p){float a=.5,v=0.;for(int i=0;i<4;i++){v+=a*noise(p);p=mat2(.8,-.6,.6,.8)*p*2.03+7.17;a*=.5;}return v;}`;
 const vertex=`varying vec2 vUv;varying vec2 vLocal;void main(){vUv=uv;vLocal=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
 function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
 function palette(g){return g.exit?0xe0b06a:g.red?0xec3552:0x9566ed;}
 function merge(parts){const pos=[],normal=[],color=[],uv=[];for(const part of parts){let geo=part.geo.index?part.geo.toNonIndexed():part.geo.clone();if(part.matrix)geo.applyMatrix4(part.matrix);const p=geo.attributes.position,n=geo.attributes.normal,u=geo.attributes.uv;for(let i=0;i<p.count;i++){pos.push(p.getX(i),p.getY(i),p.getZ(i));normal.push(n.getX(i),n.getY(i),n.getZ(i));uv.push(u?u.getX(i):0,u?u.getY(i):0);color.push(...(part.color||[1,1,1]));}geo.dispose();part.geo.dispose();}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('normal',new T.Float32BufferAttribute(normal,3));g.setAttribute('color',new T.Float32BufferAttribute(color,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeBoundingSphere();return g;}
 const matrix=(p,r=[0,0,0],s=[1,1,1])=>new T.Matrix4().compose(new T.Vector3(...p),new T.Quaternion().setFromEuler(new T.Euler(...r)),new T.Vector3(...s));
 function slab(points,depth,bevel=.04){const shape=new T.Shape();points.forEach((p,i)=>i?shape.lineTo(...p):shape.moveTo(...p));shape.closePath();return new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:bevel,bevelThickness:bevel});}
 function shard(r=.4){return slab([[-r*.7,-r*.6],[r*.1,-r],[r*.8,-r*.36],[r*.59,r*.64],[-r*.15,r],[-r*.78,r*.22]],r*.65,r*.075);}
 function create(options={}){
  const R=rng(731+(options.seed||0)%997),root=new T.Group();root.name='Fenda esculpida';
  const accent=new T.Color(palette(options)).convertSRGBToLinear(),linear=!!options.legacyLinearOutput;
  const secondary=new T.Color(options.red?0xff9f49:options.exit?0xffe5a3:0x668fff).convertSRGBToLinear();
  const uniforms={uTear:{value:0},uTime:{value:0},uColor:{value:accent},uSecondary:{value:secondary},uPower:{value:1+(options.rank||0)*.035},uContour:{value:contour.map(p=>new T.Vector2(...p))}};
  const texURL=options.textureUrl||'models/aster-materiais130.png';if(!textures.has(texURL)){const tex=new T.TextureLoader().load(texURL);tex.anisotropy=4;textures.set(texURL,tex);}const atlas=textures.get(texURL);
  const stone=new T.MeshStandardMaterial({color:new T.Color(0x62636a).convertSRGBToLinear(),roughness:.93,metalness:.06,vertexColors:true});
  stone.onBeforeCompile=s=>{s.uniforms.riftAtlas={value:atlas};s.vertexShader='varying vec3 riftP;varying vec3 riftN;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nriftP=position;riftN=normal;');s.fragmentShader='uniform sampler2D riftAtlas;varying vec3 riftP;varying vec3 riftN;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   vec3 w=pow(abs(riftN),vec3(5.));w/=max(dot(w,vec3(1.)),.001);
   vec3 a=texture2D(riftAtlas,vec2(.01,.51)+fract(riftP.yz*.72)*.48).rgb*w.x+texture2D(riftAtlas,vec2(.01,.51)+fract(riftP.xz*.72)*.48).rgb*w.y+texture2D(riftAtlas,vec2(.01,.51)+fract(riftP.xy*.72)*.48).rgb*w.z;
   diffuseColor.rgb*=clamp(dot(a,vec3(.3,.5,.2))*1.8,.45,1.4);
  `);if(linear)s.fragmentShader=s.fragmentShader.replace('#include <encodings_fragment>','#include <encodings_fragment>\ngl_FragColor=LinearTosRGB(gl_FragColor);');};stone.customProgramCacheKey=()=> 'rift131-stone-'+linear;
  const luminous=new T.MeshBasicMaterial({color:accent.clone().multiplyScalar(2.5),transparent:true,opacity:.85,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false});
  const parts=[],cracks=[],floats=[],blocks=[];
  function mesh(geo,mat,parent=root){const m=new T.Mesh(geo,mat);m.castShadow=mat===stone;m.receiveShadow=mat===stone;parent.add(m);return m;}
  function vein(points,radius=.012){for(let i=1;i<points.length;i++){const a=new T.Vector3(...points[i-1]),b=new T.Vector3(...points[i]),mid=a.clone().add(b).multiplyScalar(.5),dir=b.clone().sub(a);const geo=new T.CylinderGeometry(radius*.65,radius,dir.length(),4);const q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),dir.normalize());cracks.push({geo,matrix:new T.Matrix4().compose(mid,q,new T.Vector3(1,1,1))});}}
  for(let i=0;i<contour.length;i++){
   const a=contour[i],b=contour[(i+1)%contour.length];if(i===2||i===6||i===7||i===10||i===14)continue;
   const av=new T.Vector2(...a),bv=new T.Vector2(...b),d=bv.clone().sub(av),out=new T.Vector2(-d.y,d.x).normalize(),gap=.025+R()*.08;
   av.addScaledVector(d,gap);bv.addScaledVector(d,-gap);const thick=.21+R()*.48;
   const innerA=av.clone().addScaledVector(out,.065),innerB=bv.clone().addScaledVector(out,.045),outerB=bv.clone().addScaledVector(out,thick),outerA=av.clone().addScaledVector(out,thick*(.85+R()*.3));
   const outerMid=outerA.clone().lerp(outerB,.34+R()*.32).addScaledVector(out,.08+R()*.09);
   const depth=.38+R()*.29,geo=slab([innerA,innerB,outerB,outerMid,outerA].map(p=>p.toArray()),depth,.055),shade=.55+R()*.35;
   blocks.push({geo,matrix:matrix([0,0,-depth*.45]),color:[shade,shade,shade*1.06],center:[(innerA.x+innerB.x+outerA.x+outerB.x)/4,(innerA.y+innerB.y+outerA.y+outerB.y)/4,-depth*.45],index:i});
   const c=av.clone().lerp(bv,.45+R()*.12),e=c.clone().addScaledVector(out,thick*.88),mid=c.clone().lerp(e,.53).addScaledVector(d,.13);
   vein([[c.x,c.y,depth*.56+.05],[mid.x,mid.y,depth*.56+.055],[e.x,e.y,depth*.56+.05]],.009);
   if(i%3===0){const z=depth*.56+.055,x=e.x,y=e.y;vein([[x-.045,y-.11,z],[x+.04,y+.05,z],[x-.03,y+.14,z]],.009);}
  }
  // Unequal broken crown fragments: the outline never becomes a rotating wheel.
  const positions=[[-.72,4.97,-.05],[-.23,5.70,-.08],[.38,5.26,.03],[1.76,4.36,.10],[-1.93,3.54,.18],[1.98,2.7,-.05],[-1.92,1.58,.18],[1.72,4.87,-.18]];
  positions.forEach((p,i)=>{const g=shard(i<3?.30:.14+R()*.11);const colors=new Float32Array(g.attributes.position.count*3);colors.fill(.72);g.setAttribute('color',new T.BufferAttribute(colors,3));const m=mesh(g,stone);m.position.fromArray(p);m.rotation.set(R()*.6-.3,R()*.7-.35,R()-.5);floats.push({mesh:m,position:m.position.clone(),rotation:m.rotation.clone(),phase:R()*TAU,speed:.55+R()*.4});});
  // Grounded roots and debris belong to the terrain, not to a perfect magic circle.
  for(let i=0;i<21;i++){const a=R()*TAU,r=.8+R()*2.7,size=.09+R()*.25;parts.push({geo:shard(size),matrix:matrix([Math.cos(a)*r,.08,Math.sin(a)*r*.55],[-Math.PI/2+(R()-.5)*.3,R(),a]),color:[.60,.62,.68]});}
  for(const side of [-1,1])for(let i=0;i<3;i++){parts.push({geo:shard(.34+i*.1),matrix:matrix([side*(1.4+i*.13),.13,-.05+i*.12],[-Math.PI/2,.3,side*.3]),color:[.7,.72,.76]});}
  for(const b of blocks){b.geo.applyMatrix4(b.matrix);b.geo.translate(-b.center[0],-b.center[1],-b.center[2]);const blockShade=b.color[0],blockColors=new Float32Array(b.geo.attributes.position.count*3);for(let i=0;i<blockColors.length;i+=3){blockColors[i]=blockShade;blockColors[i+1]=blockShade;blockColors[i+2]=blockShade*1.06}b.geo.setAttribute("color",new T.BufferAttribute(blockColors,3));const m=mesh(b.geo,stone);m.position.set(...b.center);m.userData.riftBlock131=true;floats.push({mesh:m,position:new T.Vector3(...b.center),rotation:m.rotation.clone(),phase:R()*TAU,speed:.55+R()*.4,block:true,index:b.index});}
  mesh(merge(parts),stone);mesh(merge(cracks),luminous);
  const shape=new T.Shape();shape.moveTo(...contour[0]);shape.splineThru([...contour.slice(1),contour[0]].map(p=>new T.Vector2(...p)));
  const rim=shape.getSpacedPoints(96).slice(0,96),RINGS=14,cx=0,cy=2.62,apPos=[],apUv=[],apK=[],apA=[],apIdx=[];
  apPos.push(cx,cy,0);apUv.push(cx/3.2+.5,cy/5.3);apK.push(0);apA.push(0);
  for(let k=1;k<=RINGS;k++)for(let j=0;j<rim.length;j++){const f=k/RINGS,x=cx+(rim[j].x-cx)*f,y=cy+(rim[j].y-cy)*f;apPos.push(x,y,0);apUv.push(x/3.2+.5,y/5.3);apK.push(f);apA.push(j/rim.length);}
  const ring=(k,j)=>1+(k-1)*rim.length+((j+rim.length)%rim.length);
  for(let j=0;j<rim.length;j++){apIdx.push(0,ring(1,j),ring(1,j+1));for(let k=1;k<RINGS;k++){apIdx.push(ring(k,j),ring(k+1,j),ring(k+1,j+1),ring(k,j),ring(k+1,j+1),ring(k,j+1));}}
  const aperture=new T.BufferGeometry();aperture.setAttribute('position',new T.Float32BufferAttribute(apPos,3));aperture.setAttribute('uv',new T.Float32BufferAttribute(apUv,2));aperture.setAttribute('ringK',new T.Float32BufferAttribute(apK,1));aperture.setAttribute('ringA',new T.Float32BufferAttribute(apA,1));aperture.setIndex(apIdx);aperture.computeBoundingSphere();
  const liquidVertex=`attribute float ringK;attribute float ringA;uniform float uTime,uPower,uTear;varying vec2 vUv;varying vec2 vLocal;varying float vEdge;varying float vBulge;
   void main(){vUv=uv;vec3 p=position;float t=uTime,a=ringA*6.28318;vec2 c=vec2(0.,2.62),d=p.xy-c;
    // Liquid rim: the outline wobbles like a surface held by tension.
    float wob=sin(a*5.+t*1.35)*.045+sin(a*9.-t*2.1)*.025+sin(a*3.-t*.7)*.035;
    // Opening: the edge is ragged like torn cloth while reality is being ripped.
    wob+=uTear*(sin(a*23.+t*9.)*.06+sin(a*41.-t*13.)*.035+abs(sin(a*7.+t*3.))*.05);p.xy+=d*wob*ringK*ringK;
    // Body: a soft bulge that breathes plus travelling ripples, so the portal has volume instead of a flat card.
    float bulge=(1.-ringK*ringK)*(.30+.07*sin(t*1.1))*clamp(uPower,0.,1.6);
    float rip=sin(length(d)*5.5-t*2.4)*.05*(1.-ringK)+sin(d.x*3.+d.y*2.-t*1.6)*.035*(1.-ringK*ringK);
    p.z+=bulge+rip;vBulge=bulge+rip;vLocal=p.xy;vEdge=(1.-ringK)*1.25;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`;
  const surface=new T.ShaderMaterial({uniforms,vertexShader:liquidVertex,fragmentShader:`
   uniform float uTime,uPower;uniform vec3 uColor,uSecondary;uniform vec2 uContour[15];varying vec2 vUv,vLocal;varying float vEdge,vBulge;
   ${noise}
   float segment(vec2 p,vec2 a,vec2 b){vec2 d=b-a;return length(p-a-d*clamp(dot(p-a,d)/dot(d,d),0.,1.));}
   float liquid(vec2 p,float t){
    float r=length(p),turn=r*3.4-t*.24;
    p+=vec2(sin(p.y*5.+t*.63),cos(p.x*4.-t*.51))*.065;
    vec2 q=mat2(cos(turn),-sin(turn),sin(turn),cos(turn))*p;
    float broad=sin(q.x*8.+sin(q.y*5.-t*.52)*1.4+t*.62)*.075;
    broad+=cos(q.y*8.5+sin(q.x*4.+t*.41)-t*.76)*.064;
    return broad+sin(r*29.-t*2.1+sin(p.x*5.)*.4)*.016*smoothstep(.04,.30,r);
   }
   void main(){
    float edge=vEdge;
    vec2 p=(vUv-vec2(.50,.47))*vec2(1.2,1.);float rad=length(p),t=uTime*.74;
    float h=liquid(p,t),epsilon=.004;
    vec2 grad=vec2(liquid(p+vec2(epsilon,0.),t)-liquid(p-vec2(epsilon,0.),t),liquid(p+vec2(0.,epsilon),t)-liquid(p-vec2(0.,epsilon),t))/(epsilon*2.);
    vec3 normal=normalize(vec3(-grad*1.25,1.));
    vec3 reflected=reflect(vec3(0.,0.,-1.),normal);
    float fresnel=pow(1.-max(0.,normal.z),2.);
    float sheen=pow(max(0.,dot(normal,normalize(vec3(-.45,.65,1.2)))),24.);
    float caustic=pow(.5+.5*sin(h*21.+rad*8.-t*.45),10.);
    float sky=smoothstep(-.45,.8,reflected.y);
    vec3 deep=mix(uColor*.065,uSecondary*.09,sky);
    vec3 col=deep*(.55+sky*.7)+mix(uColor,uSecondary,sky*.50)*caustic*.26;
    col+=mix(uColor,uSecondary,.65)*sheen*.22;
    col+=uSecondary*fresnel*.14;
    // Flowing ink currents drawn into the core give depth and keep it from reading as a looping image.
    vec2 fp=p*3.2;float sw=atan(p.y,p.x)+rad*4.-t*.55;vec2 flow=vec2(cos(sw),sin(sw))*rad;
    float ink=fbm(fp+flow*2.2+vec2(t*.21,-t*.17));float ink2=fbm(fp*1.7-flow*1.6+vec2(-t*.13,t*.19)+ink*1.3);
    col+=mix(uColor,uSecondary,ink2)*pow(ink2,2.2)*.55*smoothstep(.02,.35,rad);
    col+=mix(uSecondary,vec3(1.),.35)*pow(max(0.,vBulge*2.4),3.)*.10;
    col*=1.-.88*exp(-rad*rad*40.);
    float lip=exp(-edge*57.)*(.35+.65*(.5+.5*sin(vLocal.y*5.-t*1.2+h*9.)));
    float borderGlow=exp(-edge*8.)*(.72+.28*sin(t+vLocal.y*3.));
    col+=uColor*borderGlow*.85+mix(uColor,uSecondary,.40)*lip*1.4;
    col*=uPower;
    gl_FragColor=vec4(col,1.);
    #include <tonemapping_fragment>
    #include <encodings_fragment>
    ${linear?'gl_FragColor=LinearTosRGB(gl_FragColor);':''}
   }`,side:T.DoubleSide});
  const membrane=mesh(aperture,surface);membrane.position.z=.025;membrane.castShadow=false;
  const aura=new T.ShaderMaterial({uniforms,vertexShader:vertex,fragmentShader:`uniform vec3 uColor;uniform float uTime;varying vec2 vUv;${noise}void main(){vec2 p=(vUv-.5)*2.;float r=length(p);float a=atan(p.y,p.x);float fissure=pow(max(0.,1.-abs(sin(a*9.+noise(p*6.)*.7))),32.)*(1.-smoothstep(.25,.9,r))*smoothstep(.12,.35,r);float halo=exp(-r*r*5.)*.28;gl_FragColor=vec4(uColor*1.3,(halo+fissure*.50)*( .88+.12*sin(uTime*.8)));}`,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false});
  const glow=mesh(new T.PlaneGeometry(8,6),aura);glow.rotation.x=-Math.PI/2;glow.position.y=.035;glow.castShadow=false;
  const haloMat=new T.ShaderMaterial({uniforms,vertexShader:vertex,fragmentShader:`uniform vec3 uColor,uSecondary;uniform float uTime;varying vec2 vUv;${noise}void main(){vec2 p=(vUv-.5)*2.;float r=length(p);float n=fbm(p*3.+vec2(uTime*.18,-uTime*.25));float a=exp(-r*r*3.)*(.13+n*.19)*(1.-smoothstep(.65,1.,r));gl_FragColor=vec4(mix(uColor,uSecondary,n)*1.5,a);}`,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,toneMapped:false});
  const halo=mesh(new T.PlaneGeometry(6.8,8.4),haloMat);halo.position.set(0,2.8,-.20);halo.renderOrder=-1;
  const seeds=[],points=[];for(let i=0;i<150;i++){seeds.push(R(),R(),R(),R());points.push(0,0,0);}const particles=new T.BufferGeometry();particles.setAttribute('position',new T.Float32BufferAttribute(points,3));particles.setAttribute('seed',new T.Float32BufferAttribute(seeds,4));
  const motes=new T.ShaderMaterial({uniforms,vertexShader:`attribute vec4 seed;uniform float uTime;varying float strength;void main(){float life=fract(seed.x+uTime*(.11+seed.w*.065));float side=seed.y>.5?1.:-1.;vec3 p=vec3(side*(1.3+seed.z*.7)+sin(life*7.+seed.y*18.)*.2,life*5.7,.20+sin(seed.z*20.+life*4.)*.65);vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;strength=sin(life*3.14159)*(.3+seed.w*.7);gl_PointSize=clamp((38.+seed.w*38.)/max(1.,-mv.z),1.5,8.);}`,fragmentShader:`uniform vec3 uColor;varying float strength;void main(){float r=length(gl_PointCoord-.5);float a=(1.-smoothstep(.07,.5,r))*strength;gl_FragColor=vec4(mix(uColor,vec3(.85,.74,1.),.5)*1.6,a);}`,transparent:true,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false});const pts=new T.Points(particles,motes);pts.frustumCulled=false;root.add(pts);
  const scarMat=new T.MeshBasicMaterial({color:accent,transparent:true,opacity:.48,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false});
  const scar=new T.Group();const scarLine=mesh(new T.TorusGeometry(.34,.018,3,18,Math.PI*1.3),scarMat,scar);scarLine.rotation.set(Math.PI/2,0,-.6);for(let i=0;i<5;i++){const a=-1.1+i*.51,p=[Math.cos(a)*.34,.02,Math.sin(a)*.34],q=[Math.cos(a+.26)*(.5+i*.03),.02,Math.sin(a+.26)*(.5+i*.03)],v=new T.Vector3(...q).sub(new T.Vector3(...p)),geo=new T.CylinderGeometry(.012,.003,v.length(),4);scar.add(new T.Mesh(geo,new T.MeshBasicMaterial({color:accent,transparent:true,opacity:.4,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false})));const crack=scar.children[scar.children.length-1];crack.position.set((p[0]+q[0])/2,.025,(p[2]+q[2])/2);crack.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());}scar.position.set(0,.065,-.06);scar.visible=false;root.add(scar);
  root.userData.rift131={time:(options.seed||0)%11,uniforms,floats,membrane,color:accent,scar,materials:[stone,luminous,surface,aura,motes,haloMat,scarMat],disposed:false,closing:0,closed:false,basePower:1+(options.rank||0)*.035};
  root.userData.triangles=0;root.traverse(o=>{if(o.isMesh)root.userData.triangles+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3;});
  return root;
 }
 function open(root){const d=root&&root.userData.rift131;if(!d||d.disposed||d.closing)return false;d.opening=.001;for(const f of d.floats){f.mesh.visible=false;f.from=f.position.clone().add(new T.Vector3(f.position.x*1.6,-2.2-Math.random()*1.5,(Math.random()-.5)*3));}return true;}
 function close(root,leaveStoryScar=false){const d=root&&root.userData.rift131;if(!d||d.disposed||d.closing||d.closed)return false;d.closing=.001;d.closed=true;d.leaveStoryScar=!!leaveStoryScar;d.scar.visible=d.leaveStoryScar;return true;}
 function update(root,dt){const data=root&&root.userData.rift131;if(!data||data.disposed)return;const step=Math.min(dt,.1);data.time+=step;data.uniforms.uTime.value=data.time;if(data.opening){data.opening+=step;const D=2.6,o=Math.min(1,data.opening/D),ms=data.membrane;
   // v153 Tecelão: reality tears as a bright slit, then the cloth of the world is pulled open and the stones are drawn in.
   const slit=Math.min(1,o/.32),se=slit*slit*(3-2*slit),wide=Math.max(0,(o-.32)/.68),we=1-Math.pow(1-wide,3),over=Math.sin(wide*Math.PI)*.12;
   ms.scale.set(Math.max(.025,we+over*(1-wide)),Math.max(.001,se),1);ms.position.y=2.62*(1-se);ms.rotation.z=0;
   data.uniforms.uTear.value=1-we*.85-(o>=1?.15:0);data.uniforms.uPower.value=(data.basePower||1)*(1+2.6*(1-we)*se);
   for(const f of data.floats){const m=f.mesh,k=Math.min(1,Math.max(0,(o-.30-(f.index%5||0)*.04)/.5)),ke=1-Math.pow(1-k,3);if(k<=0){m.visible=false;continue}m.visible=true;
    const from=f.from||f.position;m.position.lerpVectors(from,f.position,ke);m.rotation.set(f.rotation.x+(1-ke)*3,f.rotation.y+(1-ke)*2,f.rotation.z+(1-ke)*2.5);}
   if(o>=1){data.opening=0;data.uniforms.uTear.value=0;data.uniforms.uPower.value=data.basePower||1;ms.scale.set(1,1,1);ms.position.y=0;}
   }else if(data.closing){data.closing+=step;const D=1.9,t=Math.min(1,data.closing/D),ease=t*t*(3-2*t);
   // v153 closure: a flare, then the liquid spins and is swallowed into the centre; stones are pulled in, then drop.
   const flare=Math.exp(-Math.pow((data.closing-.18)/.12,2))*1.8,shrink=Math.max(.001,1-Math.pow(ease,1.4));
   data.uniforms.uTime.value=data.time+data.closing*data.closing*3.5;
   const ms=data.membrane;ms.scale.set(shrink*(1+Math.sin(data.time*9.)*.03*(1-t)),shrink,1);ms.position.y=2.62*(1-shrink);ms.rotation.z=ease*.9;
   data.uniforms.uPower.value=(data.basePower||1)*(Math.max(.001,1-ease)+flare);
   data.scar.visible=data.leaveStoryScar&&t>=.72;for(const o of data.scar.children){o.material.opacity=(1-ease)*(.24+.16*Math.sin(data.time*2.2));}
   for(const f of data.floats){const m=f.mesh,pull=Math.min(1,data.closing/.75),pe=pull*pull*(3-2*pull);
    const cx=0,cy=2.62,tx=f.position.x+(cx-f.position.x)*.32*pe,ty=f.position.y+(cy-f.position.y)*.32*pe;
    if(data.closing<.75){m.position.set(tx+Math.sin(data.time*23.+f.phase)*.03*pe,ty,f.position.z);m.rotation.z=f.rotation.z+pe*.6;continue;}
    const fall=data.closing-.75-(f.index%4)*.05;if(fall<0)continue;
    m.position.set(tx+Math.sin(f.phase)*fall*.5,Math.max(-.15,ty-fall*fall*4.2),f.position.z+Math.cos(f.phase)*fall*.3);
    m.rotation.set(f.rotation.x+fall*2.2,f.rotation.y+fall*1.5,f.rotation.z+.6+fall*2.4);if(fall>1.15)m.visible=false;}
   if(t>=1)data.uniforms.uPower.value=.001;}else{data.membrane.scale.x=1+Math.sin(data.time*.95)*.018;for(const f of data.floats){const t=data.time*f.speed*1.45+f.phase;f.mesh.position.copy(f.position);f.mesh.position.y+=Math.sin(t)*.18;f.mesh.position.x+=Math.sin(t*.68)*.075;f.mesh.rotation.set(f.rotation.x+Math.sin(t*.61)*.16,f.rotation.y+Math.sin(t*.45)*.18,f.rotation.z+Math.sin(t*.79)*.15);}}}
 function dispose(root){const d=root&&root.userData.rift131;if(!d||d.disposed)return;d.disposed=true;root.traverse(o=>{if(o.geometry&&!o.isSprite)o.geometry.dispose();});d.materials.forEach(m=>m.dispose());}
 function inside(x,y){let hit=false;for(let i=0,j=contour.length-1;i<contour.length;j=i++){const a=contour[i],b=contour[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
 function crosses(a,b,radius=.20){if(Math.abs(b[2]-.025)<=radius&&inside(b[0],b[1]))return true;const za=a[2]-.025,zb=b[2]-.025;if(za*zb>=0)return false;const f=za/(za-zb);return inside(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f);}
 function label(g,rank){const text=g.anchor221?'FENDA DA ÂNCORA':g.exit?(g.locked?'SAÍDA BLOQUEADA':'SAÍDA'):g.set153?'FENDA DE VESTÍGIO':g.secret?'FENDA OCULTA':g.red?'FENDA VERMELHA':g.inverse?'FENDA INVERTIDA':g.time?'FENDA TEMPORAL':g.custom?'FENDA CRIADA':'FENDA VIOLETA';const canvas=document.createElement('canvas');canvas.width=640;canvas.height=168;const c=canvas.getContext('2d');c.textAlign='center';c.textBaseline='middle';c.shadowColor='#090c15';c.shadowBlur=9;c.lineWidth=5;c.strokeStyle='#090c15';c.fillStyle='#e9e2d5';c.font='500 30px Georgia';c.strokeText(text,320,49);c.fillText(text,320,49);c.font='600 43px Georgia';const bottom=g.secret&&!g.exit?'RANK ???':'RANK '+rank;c.strokeText(bottom,320,111);c.fillText(bottom,320,111);const map=new T.CanvasTexture(canvas),sprite=new T.Sprite(new T.SpriteMaterial({map,transparent:true,depthWrite:false,toneMapped:false}));sprite.scale.set(3.1,.82,1);sprite.position.y=6.35;return sprite;}
 function setPalette(root,options){const d=root.userData.rift131;if(!d)return;d.color.setHex(palette(options)).convertSRGBToLinear();d.uniforms.uSecondary.value.setHex(options.red?0xff9f49:options.exit?0xffe5a3:0x668fff).convertSRGBToLinear();d.materials[1].color.copy(d.color).multiplyScalar(2.5);}
 global.Rift131={create,update,dispose,open,close,palette,inside,crosses,label,setPalette};
})(window);
