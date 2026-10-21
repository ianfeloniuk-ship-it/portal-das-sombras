/* v517 (Ian): bicho e NPC não ficam dentro d'água. Quem não é aquático e está no mar, lago ou rio é levado
   para a margem seca mais próxima (checa a cada meio segundo, só no mundo aberto). */
(function(){
  const AQUA=/peix|krak|serp|sereia|polvo|ondina|tritao|tritão|enguia|caranguejo|tubar|baleia|medusa|afog|lagoa|pescador|barco/i;
  let acc=0,lastT=0;
  function wet(x,z){
    try{const SE=window.TER245&&TER245.SEA439;if(SE&&SE.d(x,z)>-60&&terrH(x,z)<SE.Y+.05)return true}catch(_){}
    try{return typeof inWater244==='function'&&inWater244(x,z)}catch(_){return false}
  }
  function shore(x,z){
    for(let r=5;r<=1600;r+=r<120?5:25)for(let i=0;i<16;i++){const a=i/16*Math.PI*2,sx=x+Math.cos(a)*r,sz=z+Math.sin(a)*r;if(!wet(sx,sz))return {x:sx,z:sz}}
    return null;
  }
  function fix(e){
    if(!e||e.dead||e.flying||e.fly||e.boat)return;
    const nm=(e.name||'')+' '+(e.kind||'')+' '+(e.short||'');
    if(AQUA.test(nm)||(e.water!=null&&e.water>0))return;
    if(!wet(e.x,e.z))return;
    const s=shore(e.x,e.z);if(!s)return;
    e.x=s.x;e.z=s.z;if(e.tx!=null){e.tx=s.x;e.tz=s.z}
  }
  function tick(){
    if(typeof L==='undefined'||L.mode!=='world')return;
    if(typeof enemies!=='undefined')for(const e of enemies)fix(e);
    if(typeof npcs!=='undefined')for(const n of npcs)fix(n);
  }
  window.Agua517={tick,wet};
  const prev=window.requestAnimationFrame;
  function loop(t){acc+=t-lastT;lastT=t;if(acc>500){acc=0;try{tick()}catch(_){}}prev.call(window,loop)}
  prev.call(window,loop);
})();
