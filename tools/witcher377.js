/* v377 (Ian, 14/10/2026): câmera estilo The Witcher 3 (segue atrás ao andar), travar câmera no alvo
   (botão do meio do mouse ou E), corpo sólido entre jogador e monstros, e Lampião de Viagem com 5 níveis
   que acende sozinho quando escurece. */
(function(){
  const W377=window.W377={target:null,lastX:0,lastZ:0,marker:null};
  const LANT=[null,{d:10,c:300},{d:18,c:900},{d:28,c:2200},{d:42,c:5000},{d:80,c:11000}];
  const angDiff=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
  const alive=e=>e&&!e.dead&&!e.gone&&enemies.includes(e);

  /* ---------- Loja: Lampião de Viagem (melhora a cada compra) ---------- */
  const item=POTS.find(p=>p.lantern377);
  if(item){
    const lvl=()=>Math.min(5,(typeof run!=='undefined'&&run&&run.lantern377)||0);
    Object.defineProperty(item,'n',{get:()=>lvl()>=5?'Lampião de Viagem · nível máximo':'Lampião de Viagem · nível '+(lvl()+1)});
    Object.defineProperty(item,'d',{get:()=>{const n=lvl();if(n>=5)return 'Seu lampião já ilumina quase tudo à noite.';const L1=LANT[n+1];return (n?'Melhora seu lampião: ':'Acende sozinho quando escurece e ')+'ilumina '+(n+1>=5?'quase tudo ao redor':L1.d+' m à sua frente')+'. Nível '+(n+1)+' de 5.'}});
    Object.defineProperty(item,'price',{get:()=>lvl()>=5?1e9:LANT[lvl()+1].c});
  }

  /* ---------- Travar câmera no alvo ---------- */
  function pickTarget(){
    const P=player;if(!P)return null;const fwd=pcCam.yaw+Math.PI;let best=null,bs=1e9;
    for(const e of enemies){if(e.dead||e.gone)continue;const dx=e.x-P.x,dz=e.z-P.z,d=Math.hypot(dx,dz);if(d>26)continue;
      const da=Math.abs(angDiff(Math.atan2(dx,dz),fwd)),s=d*(1+da*1.6);if(da<1.4&&s<bs){bs=s;best=e}}
    if(!best){const e=nearestEnemy(P.x,P.z,14);if(e&&!e.dead)best=e}
    return best;
  }
  function setLock(e){
    W377.target=e||null;
    if(e){if(!W377.marker){const g=new THREE.RingGeometry(.22,.32,24),m=new THREE.MeshBasicMaterial({color:0xff4040,transparent:true,opacity:.9,depthTest:false,side:THREE.DoubleSide});W377.marker=new THREE.Mesh(g,m);W377.marker.renderOrder=999}
      scene.add(W377.marker);beep(660,.05,.04,'triangle')}
    else if(W377.marker)scene.remove(W377.marker);
  }
  function toggleLock(){if(!started||paused||modalOpen||player?.dead)return;if(W377.target){setLock(null);return}const e=pickTarget();if(e)setLock(e);else toast('Nenhum alvo por perto para travar a câmera.',1800)}
  W377.toggle=toggleLock;
  addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.altKey)return;const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))return;if(e.code===keyOf('lock377'))toggleLock()});
  $('c').addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.button!==1)return;e.preventDefault();toggleLock()});
  $('c').addEventListener('auxclick',e=>{if(e.button===1)e.preventDefault()});

  /* com o alvo travado, ataques e magias miram nele */
  const aim0=aimPoint;
  aimPoint=function(){const e=W377.target;if(alive(e)&&!player.dead){const b=projectileBody253(e);aimV.set(e.x,b.y,e.z);aimV.enemy253=e;return aimV}return aim0.apply(this,arguments)};
  const face0=faceTarget;
  faceTarget=function(max){const e=W377.target;if(alive(e)&&Math.hypot(e.x-player.x,e.z-player.z)<=(max||7)+e.r+1){player.face=Math.atan2(e.x-player.x,e.z-player.z);return e}return face0.apply(this,arguments)};

  /* ---------- Corpo sólido: jogador e monstros não se atravessam ---------- */
  function solid(){
    const P=player;if(!P||P.dead||L.mode==='title')return;const pr=.42;
    for(const e of enemies){
      if(e.dead||e.gone||e.ghost||e.noCollide)continue;
      let dx=P.x-e.x,dz=P.z-e.z,d=Math.hypot(dx,dz);const min=pr+(e.r||.5)*.9;if(d>=min)continue;
      if(d<1e-4){dx=-Math.sin(P.face);dz=-Math.cos(P.face);d=1}
      const nx=dx/d,nz=dz/d,ov=min-Math.max(d,1e-4);
      const me=e.boss||e.isBoss?1e4:Math.max(.4,(e.r||.5)*(e.r||.5)*4),mp=1,sp=me/(me+mp),se=1-sp;
      moveEnt(P,nx*ov*sp,nz*ov*sp);
      if(se>.001)moveEnt(e,-nx*ov*se,-nz*ov*se);
      /* se a parede impediu o empurrão, termina de afastar o monstro */
      const d2=Math.hypot(P.x-e.x,P.z-e.z);if(d2<min-.02&&!(e.boss||e.isBoss))moveEnt(e,-nx*(min-d2),-nz*(min-d2));
      if(e.m&&e.m.root)e.m.root.position.x=e.x,e.m.root.position.z=e.z;
    }
    P.m.root.position.x=P.x;P.m.root.position.z=P.z;
  }
  const upd0=update;
  update=function(dt){const r=upd0.apply(this,arguments);try{solid()}catch(err){if(!W377.err){W377.err=1;console.warn('solid377',err)}}try{lanternTick(dt)}catch(err){if(!W377.lerr){W377.lerr=1;console.warn('lantern377',err)}}return r};

  /* ---------- Câmera estilo The Witcher ---------- */
  const cam0=camUpdate;
  camUpdate=function(dt){
    const P=player;
    if(P&&started&&!paused&&dt>0){
      const e=W377.target;
      if(e&&(!alive(e)||Math.hypot(e.x-P.x,e.z-P.z)>34))setLock(null);
      if(alive(W377.target)){
        const t=W377.target,want=Math.atan2(t.x-P.x,t.z-P.z)+Math.PI;
        pcCam.yaw+=angDiff(want,pcCam.yaw)*(1-Math.exp(-8*dt));
        pcCam.pitch+=(.22-pcCam.pitch)*(1-Math.exp(-4*dt));
        if(!(P.dodgeT>0)&&!P.dead)P.face=Math.atan2(t.x-P.x,t.z-P.z);
      }else if(!pcCam.active&&!P.dead){
        /* como no Witcher: andando, a câmera vai voltando devagar para trás do personagem */
        const mv=Math.hypot(P.x-W377.lastX,P.z-W377.lastZ)/dt;
        const want=P.face+Math.PI,off=angDiff(want,pcCam.yaw);
        /* andando para trás (rumo à câmera) ela não gira; para frente/lados volta devagar */
        if(mv>1&&Math.abs(off)<1.9){const k=Math.min(1,mv/8)*Math.cos(off*.8);pcCam.yaw+=off*(1-Math.exp(-1.1*Math.max(0,k)*dt))}
      }
      W377.lastX=P.x;W377.lastZ=P.z;
    }
    cam0.apply(this,arguments);
    const t=W377.target;
    if(W377.marker&&alive(t)){const b=projectileBody253(t);W377.marker.position.set(t.x,b.y+(b.hitHeight||0)/2+(t.r||.5)+.55,t.z);W377.marker.quaternion.copy(camera.quaternion)}
  };

  /* ---------- Lampião de Viagem ---------- */
  let spot=null,glow=null,mesh=null;
  function ensure(){
    if(spot)return;
    spot=new THREE.SpotLight(0xffd59a,0,10,Math.PI/4.2,.55,1.2);spot.castShadow=false;scene.add(spot);scene.add(spot.target);
    glow=new THREE.PointLight(0xffc880,0,6,1.6);scene.add(glow);
    const g=new THREE.Group(),frame=new THREE.MeshStandardMaterial({color:0x3a2a18,metalness:.6,roughness:.5});
    const cage=new THREE.Mesh(new THREE.CylinderGeometry(.07,.08,.18,6),new THREE.MeshStandardMaterial({color:0xffd27a,emissive:0xffb040,emissiveIntensity:0,transparent:true,opacity:.85}));
    const top=new THREE.Mesh(new THREE.ConeGeometry(.09,.06,6),frame);top.position.y=.12;
    const bot=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.03,6),frame);bot.position.y=-.1;
    g.add(cage,top,bot);g.userData.cage=cage;mesh=g;
  }
  let cur=0;
  function lanternTick(dt){
    if(!run)return;if(!Number.isFinite(run.lantern377))run.lantern377=0;if(run.lantern377>5)run.lantern377=5;
    const lv=run.lantern377,P=player;if(!lv||!P){if(spot){spot.intensity=0;glow.intensity=0;if(mesh)mesh.visible=false}return}
    ensure();
    if(mesh.parent!==P.m.root){P.m.root.add(mesh);mesh.position.set(-.32,.95,.05)}
    const night=(window.NIGHT153U?NIGHT153U.value:0),dark=L.mode==='dungeon'?1:night;
    const on=dark>.25&&!P.dead;cur+=((on?1:0)-cur)*Math.min(1,dt*3);
    if(on&&!W377.lit){W377.lit=1;if(!W377.told){W377.told=1;toast('<b>[LAMPIÃO]</b> Escureceu: seu lampião acendeu sozinho.',3500)}}if(!on)W377.lit=0;
    const S=LANT[lv],y=terrH(P.x,P.z)+(P.jy||0);
    spot.distance=S.d*1.35;spot.angle=lv>=5?Math.PI/2.3:Math.PI/(4.4-lv*.35);spot.intensity=cur*(2.2+lv*.6);
    spot.position.set(P.x-Math.sin(P.face)*.3,y+2.2,P.z-Math.cos(P.face)*.3);
    spot.target.position.set(P.x+Math.sin(P.face)*S.d*.8,y,P.z+Math.cos(P.face)*S.d*.8);
    glow.position.set(P.x,y+1.4,P.z);glow.distance=lv>=5?60:3+lv*1.5;glow.intensity=cur*(lv>=5?1.6:.9);
    mesh.visible=true;mesh.userData.cage.material.emissiveIntensity=cur*2.2;
    /* nível máximo: a noite fica quase toda visível */
    if(lv>=5&&L.mode==='world'&&ENV.ok&&cur>.01&&typeof hemi!=='undefined'){hemi.intensity+=.32*cur*night;if(scene.fog&&scene.fog.density)scene.fog.density*=1-.45*cur*night}
    else if(lv>=3&&L.mode==='world'&&ENV.ok&&cur>.01&&typeof hemi!=='undefined')hemi.intensity+=.05*(lv-2)*cur*night;
  }
  W377.lantern=lanternTick;
})();
