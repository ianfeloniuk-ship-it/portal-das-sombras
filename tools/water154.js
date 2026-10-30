/* v154 plaza lake: animated water instead of a flat blue disc. Shared material, time driven by onBeforeRender. */
/* v628: estado compartilhado da água viva (chuva acumulada -> nível sobe e a água alaga os baixios). rain387.js atualiza. */
window.RAIN626=window.RAIN626||{wet:{value:0},pud:{value:0},k:0,wind:.25};
Object.assign(window.RAIN626,{rise:window.RAIN626.rise||{value:0},flood:window.RAIN626.flood||{value:0},acc:window.RAIN626.acc||0});
window.Water154=(()=>{
 const night=()=>window.NIGHT153U||(window.NIGHT153U={value:0});
 let shared=null;
 function material(){
  if(shared)return shared;
  const uniforms={uTime:{value:0},uNight:night(),uRise:RAIN626.rise,uFlood:RAIN626.flood};
  shared=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,
   vertexShader:`uniform float uRise,uFlood;varying vec2 vUv;varying vec3 vW;void main(){vUv=uv;vec3 pp=position;pp.xy+=(uv-.5)*2.*uFlood*5.;vec4 w=modelMatrix*vec4(pp,1.);w.y+=uRise;vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
   fragmentShader:`uniform float uTime,uNight,uFlood;varying vec2 vUv;varying vec3 vW;
    float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
    float waves(vec2 p,float t){return sin(p.x*2.1+t*1.1)*.5+sin(p.y*2.7-t*.9)*.4+sin((p.x+p.y)*3.9+t*1.7)*.25+n(p*3.+t*.4)*.6;}
    void main(){
     vec2 c=vUv-.5;float r=length(c)*2.;float t=uTime;vec2 p=vW.xz;
     float e=.03;float w0=waves(p,t);vec2 g=vec2(waves(p+vec2(e,0),t)-w0,waves(p+vec2(0,e),t)-w0)/e;
     vec3 nrm=normalize(vec3(-g.x*.18,1.,-g.y*.18));
     vec3 deep=vec3(.025,.075,.09),shallow=vec3(.12,.25,.24);/* v692: tons naturais (antes ciano de desenho) */
     vec3 col=mix(shallow,deep,smoothstep(.15,.85,1.-r)*.85);
     // Sky tint and moving caustic light near the shallow rim.
     col=mix(col,vec3(.55,.72,.82),pow(1.-nrm.y,.6)*.55);
     float caus=pow(n(p*4.+vec2(t*.5,-t*.35))*n(p*5.3-vec2(t*.4,t*.3)),1.5)*1.6;col+=vec3(.25,.45,.42)*caus*smoothstep(.35,1.,r);
     vec3 L=normalize(mix(vec3(-.4,.8,.45),vec3(.3,.9,-.3),uNight));vec3 V=vec3(0.,.85,.53);
     float spec=pow(max(0.,dot(reflect(-L,nrm),normalize(cameraPosition-vW))),220.)*2.6;/* v692: brilho do sol fino e na direção da câmera */col+=mix(vec3(1.,.93,.78),vec3(.65,.75,1.),uNight)*spec;
     // Foam ring that breathes against the stones.
     float foam=smoothstep(.86,.97,r+n(vec2(atan(c.y,c.x)*6.,t*.6))*.06+sin(t*1.3+atan(c.y,c.x)*5.)*.012);col=mix(col,vec3(.82,.9,.9),foam*.7);
     /* v628: reflexo do ceu (Fresnel), espuma de margem em linhas, turvacao de enchente, raso transparente */
     vec3 Vv=normalize(cameraPosition-vW);float fres=pow(1.-clamp(Vv.y,0.,1.),3.5);fres=.03+.97*pow(1.-clamp(dot(nrm,Vv),0.,1.),5.);col=mix(col,mix(vec3(.58,.68,.78),vec3(.08,.11,.2),uNight),clamp(fres,0.,.85));/* v692: reflexo do céu de Fresnel real (rasante reflete mais) */
     float shr=smoothstep(.8,1.,r);col=mix(col,vec3(.9,.95,.95),smoothstep(.45,.75,n(p*5.+vec2(t*.35,-t*.2)))*shr*.5);
     col=mix(col,vec3(.36,.29,.18)*mix(1.,.4,uNight),clamp(uFlood*.42,0.,.42));col+=vec3(.5,.45,.36)*smoothstep(.62,.8,n(p*vec2(1.6,.5)+vec2(0.,-t*1.3)))*uFlood*.22*mix(1.,.4,uNight);
     col*=mix(1.,.38,uNight);
     float a=mix(.9,.97,1.-r)*(1.-smoothstep(.985,1.,r));a*=mix(.55,1.,smoothstep(.02,.4,1.-r));
     gl_FragColor=vec4(col,a);
    }`});
  return shared;
 }
 function mesh(radius){
  const m=new THREE.Mesh(new THREE.CircleGeometry(radius,48),material());
  m.onBeforeRender=()=>{shared.uniforms.uTime.value=performance.now()/1000};
  return m;
 }
 return {material,mesh};
})();
