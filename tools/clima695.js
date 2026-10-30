/* v697 (Ian: «a chuva tem que ter um ciclo»; «no deserto não pode cair neve»; «às vezes chove na minha frente, olho pra trás e não chove»):
   - O céu sorteia uma frente de tempo (WX.base) e cada região mostra o que faz sentido nela:
     deserto e vulcão = seco (nem chuva nem neve); neve e cristal = a chuva vira neve; fora do inverno não neva nas terras quentes.
   - Ciclo: cada chuva/neve começa fraca, engrossa até o pico e vai parando (RAIN626.cycle, lido por rain387.js).
   - A neblina fecha com a chuva forte, então a chuva aparece longe também, não só nos riscos perto da câmera. */
(function(){
  'use strict';
  const dry=b=>b==='deserto'||b==='vulcao',cold=b=>b==='neve'||b==='cristal';
  function local(base,x,z){if(base==='clear')return 'clear';let b='';try{b=biomeAt(x,z)}catch(_){}
    if(dry(b))return 'clear';if(cold(b))return 'snow';if(base==='snow'&&seasonI()!==3)return 'rain';return base}
  let last=null,lastBiomeMsg=0;
  const W0=updWeather;
  updWeather=function(dt){
    const P=typeof player!=='undefined'&&player;
    if(WX.base===undefined)WX.base=WX.type;
    WX.type=WX.base;const t0=WX.t;
    /* o aviso "começou a chover" do sorteio só sai se chover aqui mesmo */
    const t0f=window.toast;let r;window.toast=function(m){if(typeof m==='string'&&m.includes('[CLIMA]')&&P&&L.mode==='world'){const lt=local(WX.type,P.x,P.z);if(lt==='clear'&&WX.type!=='clear')return;if(lt!==WX.type)m='<b>[CLIMA]</b> '+(lt==='snow'?'Começou a nevar. Monstros mais lentos, gelo 30% mais forte.':'Começou a chover. Raios ficam 30% mais fortes.');last=lt}return t0f.apply(this,arguments)};
    try{r=W0.apply(this,arguments)}finally{window.toast=t0f}
    if(WX.t>t0+1){WX.dur=WX.t}                         // sorteou uma frente nova
    WX.base=WX.type;
    if(P&&L.mode==='world'){const lt=local(WX.base,P.x,P.z);
      if(last!==null&&lt!==last&&WX.base!=='clear'&&performance.now()-lastBiomeMsg>20000){lastBiomeMsg=performance.now();
        try{toast('<b>[CLIMA]</b> '+(lt==='clear'?'A chuva fica para trás: aqui o ar é seco.':lt==='snow'?'O frio transforma a chuva em neve.':'Aqui a neve vira chuva.'),3500)}catch(_){}}
      WX.type=lt;last=lt;if(WX.pts)WX.pts.visible=lt==='snow';if(WX.pts&&lt==='snow'){WX.pts.material.color.setHex(0xffffff);WX.pts.material.size=.16}}
    /* ciclo: 0 no começo e no fim da frente, 1 no meio */
    const D=WX.dur||200,u=Math.max(0,Math.min(1,1-WX.t/D));
    const cyc=WX.type==='clear'?0:Math.min(1,Math.min(u/.25,(1-u)/.2));
    const RS=window.RAIN626;if(RS){RS.cycle=cyc}
    return r};
  window.Clima695={local};
  /* neblina da chuva forte (a chuva aparece ao longe também) */
  const hook=()=>{if(typeof renderer==='undefined'||renderer.__clima695)return;renderer.__clima695=true;const r0=renderer.render;
    renderer.render=function(sc,cam){const RS=window.RAIN626,k=RS&&WX.type!=='clear'?(RS.k||0):0;
      if(k>.05&&sc===scene&&scene.fog&&scene.fog.density!==undefined){const d=scene.fog.density;scene.fog.density=d*(1+k*1.6);try{return r0.apply(this,arguments)}finally{scene.fog.density=d}}
      return r0.apply(this,arguments)}};
  window.addEventListener('load',()=>setTimeout(hook,1600));
})();
