/* v383 (Ian, 14/10/2026, técnicas do vídeo do André Elias): cordilheiras por ruído (terrain245.js),
   escalada estilo Zelda BotW em encosta íngreme (gasta Estamina, sobe no topo com impulso) e
   painel de ajustes com controles deslizantes (F9), igual a um editor de engine. */
(function(){
  const DEF={mtH:40,mtScale:1,slope:1.0,speed:.5,cost:14,lean:.45};
  const CL=window.CLIMB383={cfg:{...DEF},on:false,t:0,mantleT:0,panel:null};
  try{const s=JSON.parse(localStorage.getItem('climb383')||'null');if(s)Object.assign(CL.cfg,s)}catch(_){}
  const save=()=>{try{localStorage.setItem('climb383',JSON.stringify(CL.cfg))}catch(_){}};
  const applyTerrain=()=>{const T=window.TER245;if(T&&T.MT){T.MT.value.x=CL.cfg.mtH;T.MT.value.y=CL.cfg.mtScale}};
  applyTerrain();
  const res=()=>{try{return martialState260()}catch(_){return null}};

  /* ---------- Escalada: só o jogador, a pé, no mundo aberto ---------- */
  const move0=moveEnt;
  moveEnt=function(e,dx,dz){
    if(e!==player||!e||e.dead||run?.mounted||(window.Living372&&Living372.riding())||L.mode!=='world'||L.grid)return move0(e,dx,dz);
    const d=Math.hypot(dx,dz);if(d<1e-5)return move0(e,dx,dz);
    const h0=terrH(e.x,e.z),la=Math.min(d,.6)/d,h1=terrH(e.x+dx*la,e.z+dz*la),slope=(h1-h0)/(d*la);
    const steep=slope>CL.cfg.slope*(CL.on?.8:1); // histerese: não pisca entre andar e escalar
    if(steep&&!(e.dodgeT>0)){
      const r=res();
      if(r&&r.vigor<=1)CL.tired=true;else if(r&&r.vigor>20)CL.tired=false;
      if(CL.tired){ // sem fôlego: não sobe; escorrega encosta abaixo
        if(!CL.warn||time-CL.warn>3){CL.warn=time;toast('<b>[ESCALADA]</b> Sem Estamina para escalar. Descanse um pouco.',2200)}
        const gx=terrH(e.x+.5,e.z)-terrH(e.x-.5,e.z),gz=terrH(e.x,e.z+.5)-terrH(e.x,e.z-.5),gl=Math.hypot(gx,gz)||1;
        CL.on=false;return move0(e,-gx/gl*d*.4,-gz/gl*d*.4);
      }
      CL.on=true;CL.t=time;CL.climbed=(CL.climbed||0)+d*CL.cfg.speed;if(r)r.vigor=Math.max(0,r.vigor-CL.cfg.cost*(window.dtLast383||1/60));
      return move0(e,dx*CL.cfg.speed,dz*CL.cfg.speed);
    }
    if(CL.on&&(CL.climbed||0)>1.5&&!e.air344){ // chegou na borda: impulso para subir no topo
      e.jvy=5.2;e.jy=(e.jy||0)+.001;e.air344=true;CL.mantleT=time;CL.mantles=(CL.mantles||0)+1;
    }
    if(CL.on){CL.on=false;CL.climbed=0}
    return move0(e,dx,dz);
  };

  /* ---------- Pose: inclina o corpo para a parede enquanto escala ---------- */
  let last=performance.now();
  const tick=()=>{const now=performance.now();window.dtLast383=Math.min(.1,(now-last)/1000);last=now;
    const P=window.player;if(P&&P.m&&P.m.root){
      if(CL.on&&time-CL.t>.2){CL.on=false;CL.climbed=0}
      const want=CL.on?-CL.cfg.lean:0;P.lean383=(P.lean383||0)+(want-(P.lean383||0))*Math.min(1,window.dtLast383*10);
      if(Math.abs(P.lean383)>.002){P.m.root.rotation.order='YXZ';P.m.root.rotation.x=P.lean383}
    }
    requestAnimationFrame(tick)};
  requestAnimationFrame(tick);

  /* ---------- Painel de ajustes (F9) ---------- */
  const ROWS=[
    ['mtH','Altura das montanhas (m)',0,90,1,true],
    ['mtScale','Tamanho das cordilheiras (menor = maiores)',.4,2.5,.05,true],
    ['slope','Inclinação que vira escalada',.5,2.5,.05],
    ['speed','Velocidade escalando',.15,1,.05],
    ['cost','Estamina por segundo escalando',0,40,1],
    ['lean','Inclinação do corpo',0,.9,.05]];
  function panel(){
    if(CL.panel){CL.panel.remove();CL.panel=null;return}
    const el=document.createElement('div');CL.panel=el;
    el.style.cssText='position:fixed;right:12px;top:70px;z-index:9999;background:rgba(10,12,20,.92);color:#e8eefc;font:12px system-ui;padding:12px 14px;border:1px solid #3a4a6a;border-radius:8px;width:280px';
    el.innerHTML='<b>Ajustes de terreno e escalada</b> <span style="opacity:.6">(F9 fecha)</span>';
    for(const [k,label,min,max,step,ter] of ROWS){
      const row=document.createElement('label');row.style.cssText='display:block;margin-top:8px';
      const val=document.createElement('span');val.style.cssText='float:right;color:#ffd54f';val.textContent=CL.cfg[k];
      const inp=document.createElement('input');Object.assign(inp,{type:'range',min,max,step,value:CL.cfg[k]});inp.style.width='100%';
      inp.oninput=()=>{CL.cfg[k]=+inp.value;val.textContent=inp.value;if(ter)applyTerrain();save()};
      row.append(label,val,inp);el.append(row);
    }
    const b=document.createElement('button');b.textContent='Voltar ao padrão';b.style.cssText='margin-top:10px;width:100%';
    b.onclick=()=>{Object.assign(CL.cfg,DEF);applyTerrain();save();panel();panel()};el.append(b);
    document.body.append(el);
  }
  CL.panel_toggle=panel;
  addEventListener('keydown',e=>{if(e.code==='F9'&&!e.repeat){e.preventDefault();panel()}});

  /* v385 (Ian: "ando sem tocar em nada"): no gelo, ao soltar as teclas o deslize levava ~14 s para parar.
     Agora para em ~1,5 s. E soltar uma tecla é registrado na fase de captura, antes de qualquer outro código. */
  const ice0=iceMove240;
  iceMove240=function(P,vx,vz,dt){const r=ice0(P,vx,vz,dt);if(r&&!vx&&!vz&&P.iv240){const k=Math.exp(-3*dt);P.iv240.x*=k;P.iv240.z*=k;if(Math.hypot(P.iv240.x,P.iv240.z)<.3)P.iv240.x=P.iv240.z=0}return r};
  addEventListener('keyup',e=>{try{keys[e.code]=false}catch(_){}},true);
  document.addEventListener('mouseleave',()=>{try{if(!document.hasFocus())for(const k in keys)keys[k]=false}catch(_){}});
})();
