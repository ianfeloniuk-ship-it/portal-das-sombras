/* v406: official bright toon direction; blue sky, clear greens and light shadows.
   Keep violet rift/corruption materials and the existing day/night timing. */
window.Look154=(()=>{
 const C=h=>new THREE.Color(h);
 // Same palette as the core, including when the environment becomes ready later.
 const palette={sd:0x48a8ef,sn:0x101c3d,fd:0xa5d8ed,fn:0x1d3152,hd:0xd9f1ff,hn:0x7899ce,gd:0x587a52,gn:0x2e4557,ud:0xfff5df,un:0xb6c9ff};
 let patched=null;
 function patch(){if(!L||!L.dn||patched===L.dn)return;for(const k in palette)if(L.dn[k])L.dn[k].copy(C(palette[k]));patched=L.dn}
 const baseDay=updDayNight;updDayNight=function(dt){patch();baseDay(dt);if(ENV.ok&&scene&&scene.fog&&L.mode==='world')scene.fog.density*=.72};
 // One shared grade; no amber cast or heavy dark border on the canvas.
 function grade(){const cv=renderer&&renderer.domElement;if(!cv)return setTimeout(grade,500);
  let on=true;try{on=localStorage.getItem('pds_toon208')!=='0'}catch(e){}
  cv.style.filter=on?'saturate(1.12) contrast(1.03)':'';
  if(!document.getElementById('vignette154')){const v=document.createElement('div');v.id='vignette154';
   v.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:1;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 70%,rgba(18,30,48,.04) 88%,rgba(18,30,48,.12) 100%)';
   cv.parentNode.insertBefore(v,cv.nextSibling)}}
 grade();
 // Warm amber light pools on the ground under lanterns and tower windows (strong at night, faint by day).
 let poolMat=null;
 function pool(){if(poolMat)return poolMat;const night=window.NIGHT153U||(window.NIGHT153U={value:0});
  poolMat=new THREE.ShaderMaterial({uniforms:{uNight:night},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
   vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.);}',
   fragmentShader:'uniform float uNight;varying vec2 vUv;void main(){float r=length(vUv-.5)*2.;float a=pow(max(0.,1.-r),2.2)*(.05+.42*uNight);gl_FragColor=vec4(vec3(1.,.6,.24)*a,a);}'});
  return poolMat}
 return {palette,grade,pool};
})();
