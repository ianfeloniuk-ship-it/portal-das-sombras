/* v154 look (Ian's approved reference "Proposta de direção visual"): painted, saturated, warm amber light,
   deep greens, petrol shadows, violet only for the rift. Applied as light palette + screen grade + vignette. */
window.Look154=(()=>{
 const C=h=>new THREE.Color(h);
 // Warmer key light, petrol fill and fog instead of grey-blue haze.
 const palette={sd:0x7ea6c4,sn:0x060b18,fd:0x6f8f8c,fn:0x0b1a24,hd:0xd9e6dc,hn:0x3f5a86,gd:0x4f5a34,gn:0x101a22,ud:0xffd7a0,un:0x9ab0ff};
 let patched=false;
 function patch(){if(patched||!L||!L.dn)return;for(const k in palette)if(L.dn[k])L.dn[k].copy(C(palette[k]));patched=true}
 const baseDay=updDayNight;updDayNight=function(dt){patch();baseDay(dt);if(ENV.ok&&scene&&scene.fog&&L.mode==='world')scene.fog.density*=.72};
 // Screen grade on the 3D canvas only (UI untouched) + painted vignette.
 function grade(){const cv=renderer&&renderer.domElement;if(!cv)return setTimeout(grade,500);
  cv.style.filter='saturate(1.32) contrast(1.12) brightness(1.03) sepia(.07)';
  if(!document.getElementById('vignette154')){const v=document.createElement('div');v.id='vignette154';
   v.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:1;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(8,10,18,.38) 82%,rgba(5,6,12,.62) 100%)';
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
