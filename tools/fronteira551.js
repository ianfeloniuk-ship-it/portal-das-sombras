/* Missão fixa #2: A Ponte dos Escudos Caídos. Cenário e escolta da Estrada Sul. */
(function () {
  'use strict';
  const T = THREE, ss = (a,b,x) => { const t=Math.max(0,Math.min(1,(x-a)/(b-a))); return t*t*(3-2*t); };
  const cx = z => ss(100,260,z)*(130*Math.sin(z*.005712)+52*Math.sin(z*.013369)+18*Math.sin(z*.033069));
  const roadY = z => .018*(z-72), BR=150, START=334, VIL=211;
  const B = { x:cx(BR), z:BR }, SN=.7428872431255049, CS=.6694165698586992 /* a estrada cruza a ponte na diagonal: eixo = tangente de cx em z=150 */, barn={x:cx(VIL)-22,z:VIL};
  let world=null, sceneGroup=null, actors=[], foes=[], last=0, lastSave=0, fireFx=null, interaction=null;
  const geoOwned=[], matOwned=[], texOwned=[];
  const P=(u,v)=>({x:B.x+u*SN+v*CS,z:BR+u*CS-v*SN});
  const bridgeUV=(x,z)=>[(x-B.x)*SN+(z-BR)*CS,(x-B.x)*CS-(z-BR)*SN];
  function state() { return profile?.fixas545?.q002; }
  function save() { store.set('pds2_profile',profile); if(typeof saveRun==='function')saveRun(); }
  function active() { const a=window.Campaign327?.state('a1'); return !!(a&&!a.done&&a.s===1&&state()&&!state().done); }
  function note(t) { toast(t,4500); }
  function ground(x,z,h) {
    const r=Math.abs(x-cx(z)), mask=ss(65,82,z)*(1-ss(365,395,z));
    h+=(roadY(z)-h)*(1-ss(9,19,r))*mask;
    // Vala seca sob o arco. O piso da ponte é uma superfície de colisão separada.
    const [u,v]=bridgeUV(x,z),cut=(1-ss(6,11,Math.abs(u)))*(1-ss(20,43,Math.abs(v)));
    return h-4.8*cut;
  }
  const terrainGround=terrH;
  // A função de relevo e o shader usam o mesmo solo; terrH inclui também o tabuleiro caminhável.
  const surface=(x,z) => { const [u,v]=bridgeUV(x,z); return Math.abs(u)<=12 && Math.abs(v)<=3.65 ? roadY(z)+.12 : null; };
  terrH=function(x,z) { const h=terrainGround(x,z); if(!TER245.on.value||TER245.OW.value.x>.5)return h; const d=surface(x,z); return d===null?h:d; };
  function begin(figs) {
    if(!profile.fixas545)profile.fixas545={};
    if(!state())profile.fixas545.q002={phase:'estrada',z:START-8,hits:[],water:0,choice:null,done:false};
    actors=figs.filter(f=>f?.m&&(f.name==='Edran'||f.name==='Sobrevivente'));
    for(const f of actors) { f.down=false; f.m.wounded401=false; f.noBlock551=true; }
    save();
  }
  function mkActor(id,name) {
    const m=NPC456.create(id), f=NPC456.figure(id,{m,name,down:false,x:0,z:0,t:0});
    m.root.userData.terrainAbsolute245=true;scene.add(m.root);return f;
  }
  function restoreActors() {
    if(!actors.length&&window.NPC456)actors=[mkActor('edran','Edran'),mkActor('homem','Sobrevivente'),mkActor('mulher','Sobrevivente')];
  }
  function material(color) {
    const c=document.createElement('canvas');c.width=c.height=128;const a=c.getContext('2d');a.fillStyle=color;a.fillRect(0,0,128,128);
    for(let i=0;i<1700;i++){const x=(i*73)%128,y=(i*41+Math.floor(i/128)*17)%128;a.fillStyle=i%3?'#00000025':'#e4dacb30';a.fillRect(x,y,1+(i%4),1);}
    const map=new T.CanvasTexture(c);map.wrapS=map.wrapT=T.RepeatWrapping;texOwned.push(map);
    const m=new T.MeshStandardMaterial({map,bumpMap:map,bumpScale:.07,roughness:.96,color:0xc0bbb0});matOwned.push(m);return m;
  }
  function wornBox(w,h,d,seed) {
    const g=new T.BoxGeometry(w,h,d,3,2,2),p=g.attributes.position;
    for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const n=Math.sin(x*19+y*27+z*13+seed);p.setXYZ(i,x+.025*n,y+.018*Math.sin(z*31+seed),z+.026*Math.cos(x*23+y*11+seed));}
    g.computeVertexNormals();geoOwned.push(g);return g;
  }
  function block(parent,x,y,z,w,h,d,mat,seed) {const m=new T.Mesh(wornBox(w,h,d,seed),mat);m.position.set(x,y,z);m.castShadow=false;m.receiveShadow=true;parent.add(m);return m;}
  function bridge(g,stone) {
    const root=new T.Group();root.position.set(B.x,roadY(BR),BR);root.rotation.y=Math.atan2(SN,CS);g.add(root);
    // Lajes e parapeitos de alvenaria irregular, com peças maiores nas cabeceiras.
    for(let iz=0;iz<24;iz++)for(let ix=0;ix<5;ix++)block(root,(ix-2)*1.42,.018*CS*(iz-11.5)-.12,iz-11.5,1.4,.45,.97,stone,ix*31+iz);
    for(const s of [-1,1])for(let k=0;k<24;k++)block(root,s*3.85,.55+.018*CS*(k-11.5),k-11.5,.62,1.25,.96,stone,k+s*101);
    // Arco apontado: aduelas acompanhando duas curvas até a chave, vista nas duas faces.
    for(const s of [-1,1])for(const side of [-1,1])for(let k=0;k<12;k++) {
      const t=(k+.5)/12, z=side*(10*(1-t)), y=-4.3+3.65*Math.sin(t*Math.PI/2);
      const m=block(root,s*3.7,y,z,.85,.72,1.08,stone,k+side*53+s*17);m.rotation.x=side*Math.atan2(3.65*Math.PI/2*Math.cos(t*Math.PI/2),10);
    }
    for(const s of [-1,1])for(const end of [-1,1])for(let i=0;i<4;i++)block(root,s*3.75,-3.7+i*.85,end*10.8,1.2,.82,2.3,stone,i+s*3+end*7);
    // Escudos caídos: GLB do próprio jogo, sem introduzir um símbolo novo.
    {const a=P(13,4.7),b=P(-12,-4.9);prop(g,'sword_shield',a.x,a.z,1.15,.7);prop(g,'sword_shield',b.x,b.z,1.05,-.6);}
    const cols=[];for(const s of [-1,1])for(let z=-12;z<=12;z+=1.5){const q=P(z,s*3.85);cols.push({x:q.x,z:q.z,r:.38});}
    Solid429.prop(g,cols);
    // Fusão estática das aduelas/lajes: um desenho para toda a pedra, sem centenas de chamadas.
    root.updateMatrixWorld(true);const positions=[],normals=[],uvs=[];const inv=new T.Matrix4().copy(g.matrixWorld).invert();
    root.traverse(o=>{if(!o.isMesh||o.material!==stone)return;const a=o.geometry.toNonIndexed(),m=new T.Matrix4().multiplyMatrices(inv,o.matrixWorld);a.applyMatrix4(m);positions.push(...a.attributes.position.array);normals.push(...a.attributes.normal.array);uvs.push(...a.attributes.uv.array);a.dispose();});
    const merged=new T.BufferGeometry();merged.setAttribute('position',new T.Float32BufferAttribute(positions,3));merged.setAttribute('normal',new T.Float32BufferAttribute(normals,3));merged.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));merged.computeBoundingSphere();geoOwned.push(merged);g.remove(root);g.add(new T.Mesh(merged,stone));
  }
  function prop(parent,key,x,z,h,ry=0) {
    if(!ENV.m[key])return null;const m=envMesh(key);m.scale.setScalar(h/(ENV.m[key].h||1));m.position.set(x,terrainGround(x,z),z);m.rotation.y=ry;parent.add(m);return m;
  }
  function house(parent,x,z,id,scale) {
    const model=TripoEnvironment153?.models?.house;if(!model?.parts)return false;
    const root=new T.Group();const h=scale/model.h;
    for(const p of (model.liteParts||model.parts)){const m=new T.Mesh(p.geometry,p.material);m.scale.setScalar(h);root.add(m);}
    root.position.set(x,terrainGround(x,z)-.2,z);root.rotation.y=id;
    root.traverse(o=>{if(o.isMesh){o.castShadow=false;const list=[].concat(o.material).map(a=>{const b=a.clone();if(b.color)b.color.multiplyScalar(.57);if(b.roughness!==undefined)b.roughness=.95;matOwned.push(b);return b});o.material=Array.isArray(o.material)?list:list[0];}});parent.add(root);return true;
  }
  function particles(g) {
    const N=190,p=new Float32Array(N*3),a=new Float32Array(N*4);const emit=[[barn.x,barn.z],[cx(228)+20,228],[cx(243)-17,243]];
    for(let i=0;i<N;i++){const e=emit[i%3];a.set([e[0],e[1],(i*0.61803398875)%1,i%3],i*4);}
    const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(p,3));geometry.setAttribute('seed',new T.BufferAttribute(a,4));geoOwned.push(geometry);
    const mat=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{t:{value:0},saved:{value:0}},vertexShader:'attribute vec4 seed;uniform float t;uniform float saved;varying float age;varying float smoke;void main(){float a=fract(seed.z+t*.32);age=a;smoke=step(.45,seed.z);float live=1.-saved*(1.-step(.5,seed.w));vec3 p=vec3(seed.x+sin(seed.z*74.+t)*(.5+a*2.),0.,seed.y+cos(seed.z*32.)*(.4+a));p.y=1.+a*(smoke>.5?13.:5.);vec4 v=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*v;gl_PointSize=live*(smoke>.5?95.:42.)*(1.-a*.5)/max(1.,-v.z);}',fragmentShader:'varying float age;varying float smoke;void main(){vec2 p=gl_PointCoord*2.-1.;float d=dot(p,p);if(d>1.)discard;vec3 c=mix(vec3(1.,.25,.025),vec3(.14,.13,.12),smoke);float a=(1.-d)*(1.-age)*mix(.85,.3,smoke);gl_FragColor=vec4(c,a);}' });
    // Partículas com altura absoluta por emissor (o shader do relevo não deve somar novamente).
    const h=new Float32Array(N);for(let i=0;i<N;i++)h[i]=terrainGround(a[i*4],a[i*4+1]);geometry.setAttribute('baseHeight',new T.BufferAttribute(h,1));mat.vertexShader='attribute float baseHeight;'+mat.vertexShader.replace('p.y=1.+','p.y=baseHeight+1.+');
    matOwned.push(mat);const pts=new T.Points(geometry,mat);pts.frustumCulled=false;g.add(pts);return {pts,mat};
  }
  function buildScene() {
    if(!ENV.ok||!TripoEnvironment153?.models?.house?.parts)return false;
    const g=new T.Group();g.name='VilaDaFronteira551';g.userData.terrainAbsolute245=true;scene.add(g);sceneGroup=g;
    const stone=material('#69635a');bridge(g,stone);
    house(g,barn.x,barn.z,.3,7);house(g,cx(228)+20,228,-.5,8);house(g,cx(243)-17,243,2.8,6.5);
    prop(g,'building_destroyed',cx(223)-14,223,3.2,.2);prop(g,'crates_stacked',barn.x-2,VIL+4,1.5,.1);prop(g,'sack',barn.x+2,VIL+4,.8,.4);
    prop(g,'bucket_water',barn.x+8,VIL+5,.65);prop(g,'barrel',barn.x+7,VIL+7,1.1);
    const c=[];for(const [x,z,r] of [[barn.x,barn.z,4],[cx(228)+20,228,4.5],[cx(243)-17,243,3.5]])c.push({x,z,r});
    // O grupo da vila e o da ponte têm colisões próprias para não sobrescrever o registro.
    const anchor=new T.Group();g.add(anchor);Solid429.prop(anchor,c);
    fireFx=particles(g);return true;
  }
  function disposeScene() {
    if(sceneGroup)scene.remove(sceneGroup);sceneGroup=null;fireFx=null;
    geoOwned.splice(0).forEach(x=>x.dispose());matOwned.splice(0).forEach(x=>x.dispose());texOwned.splice(0).forEach(x=>x.dispose());
  }
  function setInter(q) {
    if(interaction&&world?.inter)world.inter=world.inter.filter(x=>x!==interaction);interaction=null;
    if(!active())return;
    if(q.phase==='escolha')interaction={x:cx(177),z:177,r:4,label:'F · FALAR COM EDRAN',use:talk};
    if(q.phase==='combate'&&q.choice==='paiol'&&q.water<3)interaction={x:barn.x+6,z:barn.z+5,r:4,label:'F · APAGAR O PAIOL ('+q.water+'/3)',use:water};
    if(interaction)world.inter.push(interaction);
  }
  function talk() {
    if(!active()||state().phase!=='escolha')return;
    const ed=actors[0];Dialogo520.custom({name:'Edran',title:'Batedor da Ordem',type:'fronteira551'},ed,()=>({raiz:{t:'Salteadores na ponte. Fique comigo para atravessarmos juntos, ou vá apagar o paiol pela margem.',o:[{l:'Manter a formação com Edran',fn:()=>{choose('formacao');return 'fim';}},{l:'Salvar os grãos do paiol',fn:()=>{choose('paiol');return 'fim';}}]}}));
  }
  function choose(choice) {
    const q=state();if(!active()||q.phase!=='escolha')return false;
    q.choice=choice;q.phase='combate';q.bleed=choice==='paiol';q.z=169;q.hits=q.hits||[];q.hpEdran=choice==='paiol'?74:100;
    setInter(q);save();note(choice==='paiol'?'Apague o paiol pela margem. Edran segura a ponte.':'Fique com Edran e derrote os salteadores na ponte.');return true;
  }
  function water() {
    const q=state();if(!active()||q.choice!=='paiol'||q.phase!=='combate'||q.water>=3)return;
    if(Math.hypot(player.x-(barn.x+6),player.z-(barn.z+5))>5)return;
    q.water++;sfx('water');setInter(q);save();note(q.water===3?'Fogo apagado. Os grãos estão a salvo.':'Água no paiol: '+q.water+'/3.');
  }
  function spawnFoes(q) {
    for(let i=0;i<3;i++)if(!q.hits.includes(i)&&!foes.some(e=>e.fronteiraIndex551===i&&!e.dead)) {
      const {x,z}=P(7-i*6,(i-1)*1.5);
      const e=spawnKind('invasor_f',x,z,0,{wild:true});e.name=e.short='Salteador Fendido';e.fronteira551=true;e.fronteiraIndex551=i;e.hp=e.maxhp=32;e.dmg=3;e.xp=0;e.gold=0;e.aggro=true;foes.push(e);
    }
  }
  function updateActors(q,dt) {
    restoreActors();
    const offsets=[[-1,0],[1.4,2],[.3,4]];
    actors.forEach((f,i)=>{f.noBlock551=true;const z=q.z+offsets[i][1],x=cx(z)+offsets[i][0];f.x=x;f.z=z;f.down=false;f.m.wounded401=false;f.m.root.position.set(x,terrH(x,z),z);f.m.root.rotation.y=Math.atan2(cx(z-1)-x,-1);});
    if(q.bleed&&q.phase==='combate')q.hpEdran=Math.max(60,q.hpEdran-dt*.3);
  }
  function complete(q) {
    if(q.done)return;q.done=true;q.phase='fim';
    if(q.choice==='paiol'&&!q.reward){const sim=window.WorldSim479?.getSimState();if(sim?.regions?.aster)sim.regions.aster.scarcity=Math.max(0,sim.regions.aster.scarcity-3);q.reward=true;note('Paiol salvo: escassez de Aster reduzida em 3.');}
    else note('Vocês chegaram a Aster. Edran atravessou sem outro sangramento.');
    const a=Campaign327.state('a1');a.roadSpawn401={x:0,z:72};save();setInter(q);
    actors.forEach(f=>{f.gone456=true;f.m.fig=f;scene.remove(f.m.root);});actors=[];
  }
  function objective() {
    if(!active())return null;const q=state();let text,target;
    if(q.phase==='estrada'){text='Escolte Edran e o casal até a Vila da Fronteira';target={x:cx(180),z:180};}
    else if(q.phase==='escolha'){text='Fale com Edran antes de atravessar a ponte [F]';target={x:cx(177),z:177};}
    else if(q.phase==='combate'&&q.choice==='paiol'&&q.water<3){text='Apague o paiol pela margem [F] · '+q.water+'/3';target={x:barn.x+6,z:barn.z+5};}
    else if(q.phase==='combate'){text='Derrote os salteadores na ponte · '+q.hits.length+'/3';const e=foes.find(e=>!e.dead);target=e||B;}
    else {text='Acompanhe Edran e o casal até o Portão de Aster';target={x:0,z:72};}
    if(q.waiting)text='Espere o grupo ou volte até Edran';
    return {actTitle:'A PONTE DOS ESCUDOS CAÍDOS',step:4,totalSteps:6,text,target};
  }
  function tick(dt) {
    if(typeof player==='undefined'||!player||typeof L==='undefined'||L.mode!=='world')return;
    if(world!==L){disposeScene();for(const f of actors)scene.remove(f.m.root);actors=[];foes=[];world=L;interaction=null;}
    const near=Math.hypot(player.x-cx(205),player.z-205)<430;
    if(near&&!sceneGroup)buildScene();else if(!near&&sceneGroup)disposeScene();
    const q=state();if(fireFx){fireFx.pts.visible=near&&Math.hypot(player.x-barn.x,player.z-barn.z)<180;fireFx.mat.uniforms.t.value=performance.now()/1000;fireFx.mat.uniforms.saved.value=q?.water>=3?1:0;}
    if(!active()||paused||player.dead)return;
    if(!interaction&&(q.phase==='escolha'||(q.phase==='combate'&&q.choice==='paiol'&&q.water<3)))setInter(q);
    q.waiting=(q.phase==='estrada'||q.phase==='saida')&&Math.hypot(player.x-cx(q.z),player.z-q.z)>23;
    if(q.phase==='estrada'||q.phase==='saida'){
      if(!q.waiting)q.z-=dt*(q.choice==='paiol'?2:3.2);
      if(q.phase==='estrada'&&q.z<=177){q.z=177;q.phase='escolha';setInter(q);save();note('Vila da Fronteira. Fale com Edran na entrada da ponte.');}
      if(q.phase==='saida'&&q.z<=75){complete(q);return;}
    }
    if(q.phase==='combate'){
      spawnFoes(q);
      for(const e of foes)if(e.dead&&!q.hits.includes(e.fronteiraIndex551)){q.hits.push(e.fronteiraIndex551);save();}
      // v576: Edran não drena mais a vida dos salteadores; quem luta é o jogador.
      
      if(q.hits.length===3&&(q.choice!=='paiol'||q.water===3)){q.phase='saida';setInter(q);save();note(q.choice==='paiol'?'Edran está ferido. Acompanhe o grupo até Aster.':'Ponte livre. Sigam juntos até Aster.');}
    }
    updateActors(q,dt);
    if(performance.now()-lastSave>2500){lastSave=performance.now();Campaign327.state('a1').roadSpawn401={x:cx(q.z)+2,z:q.z+3};save();}
  }
  const prev=update;update=function(dt){prev.apply(this,arguments);try{tick(Math.min(.1,dt||.016));}catch(e){console.warn('Fronteira551',e);}};
  function clearSite(x,z){return (z>110&&z<360&&Math.abs(x-cx(z))<16)||[[barn.x,barn.z,7],[cx(228)+20,228,7],[cx(243)-17,243,7],[cx(START),START,11],[B.x,BR,24]].some(([a,b,r])=>Math.hypot(x-a,z-b)<r);}
  window.Fronteira551={begin,active,objective,choose,water,tick,ground,groundHeight:terrainGround,surface,cx,roadY,B,barn,START,clearSite,get actors(){return actors;},get foes(){return foes;}};
  if(window.Fixas545)Fixas545.LIVE.primeva_q002='v551';
})();
