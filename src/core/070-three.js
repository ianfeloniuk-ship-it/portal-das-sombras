/* ================= THREE ================= */
/* v267 (Ian): celular travando. No celular: sem antialias, LEVE por padrão (até escolher HD),
   resolução menor no LEVE e escala automática que baixa a resolução quando o FPS cai. */
const GFX267={lite:(()=>{try{const v=localStorage.getItem('pds_gfx');return v?v==='leve':touch}catch(e){return touch}})(),scale:1,acc:0,frames:0,
  ratio(){return (this.lite?(touch?.75:1):Math.min(devicePixelRatio,touch?1.25:1.6))*this.scale},
  apply(){renderer.setPixelRatio(this.ratio())},
  tick(dt){if(document.hidden||dt<=0||dt>.5)return;this.acc+=dt;this.frames++;if(this.acc<2)return;const fps=this.frames/this.acc;this.acc=0;this.frames=0;
    if(fps<30&&this.scale>.6){this.scale=Math.max(.6,this.scale-.1);this.apply()}else if(fps>55&&this.scale<1){this.scale=Math.min(1,this.scale+.05);this.apply()}}};
const renderer=new THREE.WebGLRenderer({canvas:$('c'),antialias:!touch,powerPreference:'high-performance'});
TER245.bindRenderer(renderer);
renderer.setPixelRatio(GFX267.ratio());
/* PC: modo ULTRA (resolução cheia + tonemap filmico). Só no PC, nunca no celular. */
const ULTRA=!(matchMedia('(hover:none)').matches||('ontouchstart' in window))&&(()=>{try{return localStorage.getItem('pds_gfx')!=='leve'}catch(e){return true}})();
if(ULTRA){renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15}
const scene=new THREE.Scene();
const riftLight131=window.RIFT131_ENABLE?new THREE.PointLight(0x9566ed,0,13,2):null;if(riftLight131)scene.add(riftLight131);
let riftSound131=null;document.addEventListener('visibilitychange',()=>{if(document.hidden&&riftSound131)riftSound131.silence()});addEventListener('pagehide',()=>{if(riftSound131)riftSound131.dispose()});
const camera=new THREE.PerspectiveCamera(60,1,.08,260);
const ov=$('ov'),oc=ov.getContext('2d');
let W=1,H=1,portrait=false;
function resize(){W=innerWidth;H=innerHeight;portrait=H>W;renderer.setSize(W,H,false);camera.aspect=W/H;camera.fov=portrait?62:60;camera.updateProjectionMatrix();const d=GFX267.lite?1:Math.min(devicePixelRatio,touch?1.5:2);ov.width=W*d;ov.height=H*d;oc.setTransform(d,0,0,d,0,0)}
addEventListener('resize',resize);resize();
if(!touch)document.body.classList.add('pc');
const gmap=new THREE.DataTexture(new Uint8Array([70,70,70,255,160,160,160,255,255,255,255,255]),3,1,THREE.RGBAFormat);
gmap.minFilter=gmap.magFilter=THREE.NearestFilter;gmap.needsUpdate=true;
const GROUNDMAT=new THREE.MeshToonMaterial({vertexColors:true,gradientMap:gmap});
const TC={},GLC={},GC={};
const toonS=c=>{if(!TC[c]){TC[c]=new THREE.MeshToonMaterial({color:c,gradientMap:gmap});TC[c].userData.shared=true}return TC[c]};
const toon=(c,e=0)=>new THREE.MeshToonMaterial({color:c,gradientMap:gmap,emissive:e});
const glowS=(c,o=.8)=>{const k=c+'_'+o;if(!GLC[k]){GLC[k]=new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,blending:THREE.AdditiveBlending,depthWrite:false});GLC[k].userData.shared=true}return GLC[k]};
const glow=(c,o=.8)=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,blending:THREE.AdditiveBlending,depthWrite:false});
/* v172: algumas peças pediam a forma pelo nome sem saber criá-la (()=>0). Se ninguém criou antes, usa a forma padrão daquele nome — senão a tela quebra (torre travava ao limpar o andar). */
const GEO_DEF172={gring:()=>new THREE.TorusGeometry(2.3,.22,8,40),stall:()=>new THREE.BoxGeometry(3,1.1,1.4),awn:()=>new THREE.BoxGeometry(3.4,.15,2),leaf:()=>new THREE.ConeGeometry(2.2,4.2,7),pil:()=>new THREE.CylinderGeometry(1,1,24,12,1,true)};
const geo=(k,f)=>GC[k]||(GC[k]=f()||(GEO_DEF172[k]||(()=>new THREE.BoxGeometry(.01,.01,.01)))());
const OUT=new THREE.MeshBasicMaterial({color:0x241d30,side:THREE.BackSide});
function mesh(g,mat,outline=true,os=1.04){const m=new THREE.Mesh(g,mat);if(outline){const o=new THREE.Mesh(g,OUT);o.scale.setScalar(os);m.add(o)}return m}
/* v399 (Ian): Direção de Arte Toon Shading / Cel Shading vibrante estilo Zelda: Breath of the Wild e Genshin Impact.
   Sombras suaves com tom lavanda/céu, rampa em degraus límpidos e iluminação ensolarada. */
(function(){let on=true;try{on=localStorage.getItem('pds_cel211')!=='0'}catch(e){}if(!on||!THREE.ShaderChunk.aomap_fragment)return;
 THREE.ShaderChunk.aomap_fragment='{vec3 dd212=reflectedLight.directDiffuse;float a212=max(dot(diffuseColor.rgb,vec3(.3333)),.03);float r212=dot(dd212,vec3(.3333))/a212;\n'+
 'float b212=r212<.25?0.72:r212<.65?0.90:1.08;\n'+
 'vec3 toonShadow=mix(dd212*(b212/max(r212,.001)),diffuseColor.rgb*vec3(.72,.76,.86)*b212,.32);\n'+
 'reflectedLight.directDiffuse=r212>.0005?toonShadow:diffuseColor.rgb*vec3(.70,.74,.82)*.72;\n'+
 'reflectedLight.directSpecular=step(.45,reflectedLight.directSpecular)*reflectedLight.directSpecular*1.15;}\n'+THREE.ShaderChunk.aomap_fragment})();
const hemi=new THREE.HemisphereLight(0x52b0ff,0x7eb356,0.95);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff8e7,1.05);sun.position.set(-20,40,15);scene.add(sun);
const bossLight=new THREE.PointLight(0xffd070,0,40,1.6);scene.add(bossLight);
const pLight=new THREE.PointLight(0xffffff,0,22,1.4);scene.add(pLight);
const _m4=new THREE.Matrix4(),_q=new THREE.Quaternion(),_e=new THREE.Euler(),_s=new THREE.Vector3(),_p=new THREE.Vector3(),_c=new THREE.Color();
function inst(g,mat,list,outline,parent){parent=parent||L.group;
  if(!list.length)return;
  const mk=(gg,m)=>{const im=new THREE.InstancedMesh(gg,m,list.length);im.frustumCulled=false;
    list.forEach((o,i)=>{_e.set(o.rx||0,o.ry||0,o.rz||0);_q.setFromEuler(_e);_p.set(o.x,o.y||0,o.z);_s.set(o.sx??o.s??1,o.sy??o.s??1,o.sz??o.s??1);_m4.compose(_p,_q,_s);im.setMatrixAt(i,_m4);if(o.c!==undefined&&m!==OUT){_c.setHex(o.c);im.setColorAt(i,_c)}});
    im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;parent.add(im);return im};
  mk(g,mat);if(outline){const og=g.clone();og.scale(1.07,1.07,1.07);mk(og,OUT)}
}
function makeCitySign(){return new THREE.Group()}
function makeSign(text,col,scale=1){
  const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');
  x.fillStyle='rgba(6,18,38,.88)';x.fillRect(4,14,504,100);x.strokeStyle=col;x.lineWidth=6;x.strokeRect(4,14,504,100);
  x.fillStyle=col;x.font='700 60px "Russo One","Chakra Petch",sans-serif';x.textAlign='center';x.textBaseline='middle';const size=Math.max(18,Math.min(60,Math.floor(60*472/Math.max(1,x.measureText(text).width))));x.font='700 '+size+'px "Russo One","Chakra Petch",sans-serif';x.fillText(text,256,66,472);
  const t=new THREE.CanvasTexture(c);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,fog:false}));s.scale.set(7*scale,1.75*scale,1);return s;
}

