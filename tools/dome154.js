/* v154 city protection dome (Ian): a dark translucent shell over each living city.
   - common monsters cannot cross it; the hero inside takes 30% less damage;
   - during the weekly siege the Dragão Sitiante wears it down until it shatters;
   - it must be BUILT first (city level 3+) and does NOT heal by itself: Brann builds/repairs it for gold, crystals and cores
     (prices from Econ154: build 6 h of hunting + 40 crystals + 15 cores; repair 40% of that). State lives in profile.dome154. */
window.Dome154=(()=>{
 const domes=new Map(),shards=[],TAU=Math.PI*2;let t=0;
 const radius=c=>{const l=cityL(c);return l>=6?cityPalisadeR(l)+2:CITYR+3};
 const vert=`varying vec3 vN;varying vec3 vV;varying vec3 vP;void main(){vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;vN=normalize(mat3(modelMatrix)*normal);vV=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;}`;
 const frag=`uniform float uTime,uHp,uGrow;uniform vec3 uHit;uniform float uHitT;uniform vec3 uCenter;varying vec3 vN;varying vec3 vV;varying vec3 vP;
  float hex(vec2 p){p.x*=1.1547;p.y+=mod(floor(p.x),2.)*.5;vec2 f=abs(fract(p)-.5);return smoothstep(.40,.48,max(f.x*1.5+f.y,f.y*2.));}
  void main(){
   vec3 d=normalize(vP-uCenter);float lon=atan(d.z,d.x),lat=asin(clamp(d.y,-1.,1.));
   float fres=pow(1.-abs(dot(normalize(vN),vV)),2.2);
   float cells=hex(vec2(lon*14.,lat*14.)+vec2(0.,uTime*.05));
   float pulse=.5+.5*sin(lat*22.-uTime*1.4);
   float hit=0.;if(uHitT>0.){float dh=distance(vP,uHit);hit=smoothstep(2.5,0.,abs(dh-(1.-uHitT)*14.))*uHitT;}
   vec3 petrol=vec3(.12,.36,.40),violet=vec3(.42,.25,.83);
   vec3 col=mix(petrol,violet,fres*.8+cells*.25)*(.55+.45*pulse)+violet*hit*2.;
   float crack=(1.-uHp)*smoothstep(.55,.95,fract(sin(dot(floor(vec2(lon*9.,lat*9.)),vec2(12.9,78.2)))*43758.5))*cells;
   col=mix(col,vec3(1.,.55,.3),crack*.9);
   col=col*1.7+vec3(.55,.45,1.)*cells*.12*(.4+fres);
   float a=(.15+fres*.5+cells*.05+hit*.6+crack*.5)*uGrow;
   // dark veil seen from inside the city
   gl_FragColor=vec4(col,a);
  }`;
 function make(c){
  const r=radius(c),g=new THREE.SphereGeometry(r,72,28,0,TAU,0,Math.PI/2);
  const u={uTime:{value:0},uHp:{value:1},uGrow:{value:1},uHit:{value:new THREE.Vector3()},uHitT:{value:0},uCenter:{value:new THREE.Vector3(c.x,0,c.z)}};
  const m=new THREE.Mesh(g,new THREE.ShaderMaterial({uniforms:u,vertexShader:vert,fragmentShader:frag,transparent:true,depthWrite:false,side:THREE.DoubleSide}));
  m.position.set(c.x,0,c.z);m.renderOrder=5;m.frustumCulled=false;scene.add(m);
  const prev=((profile.dome154||{})[c.id])||{};
  return {c,r,m,u,max:1,hp:prev.hp??1,broken:!!prev.broken,hitT:0};
 }
 let saveT=0;
 function save(force){profile.dome154=profile.dome154||{};for(const[k,d]of domes)profile.dome154[k]={built:true,hp:Math.max(0,+d.hp.toFixed(3)),broken:d.broken};if(force)store.set('pds2_profile',profile)}
 function state(c){const d=domes.get(c.id),p=(profile.dome154||{})[c.id]||{};return d?{built:true,hp:d.hp,broken:d.broken}:{built:!!p.built,hp:p.hp??1,broken:!!p.broken}}
 function wear(c,f){const d=domes.get(c.id);if(d&&!d.broken){d.hp=Math.max(.05,d.hp-f);save(true)}else{const p=(profile.dome154||{})[c.id];if(p&&p.built&&!p.broken){p.hp=Math.max(.05,(p.hp??1)-f);store.set('pds2_profile',profile)}}}
 function build(id){const c=nearestCity(player.x,player.z).c;if(!c||c.id!==id||L.siege||cityFallen(c)||cityL(c)<3||state(c).built)return false;const k=Econ154.domeBuild();if(!Econ154.pay(k))return false;profile.dome154=profile.dome154||{};profile.dome154[c.id]={built:true,hp:1,broken:false};store.set('pds2_profile',profile);bigText('DOMO ERGUIDO',1600);toast('<b>[CIDADE]</b> Brann ergueu o domo de '+c.name+'.',4000);return true}
 // Repair price: a full rebuild costs 6000 x (1 + city level); partial damage costs its share.
 function repairCost(c){const st=state(c);return Econ154.domeRepair(st.broken?1:(1-st.hp))}
 function repair(id){const c=nearestCity(player.x,player.z).c;if(!c||c.id!==id||L.siege||cityFallen(c))return false;const k=repairCost(c);if(k.gold<=0||!Econ154.pay(k))return false;const d=domes.get(c.id);if(d){d.broken=false;d.hp=1;d.grow=0}profile.dome154=profile.dome154||{};profile.dome154[c.id]={built:true,hp:1,broken:false};store.set('pds2_profile',profile);toast('<b>[CIDADE]</b> Brann reformou o domo de '+c.name+' por '+Econ154.costText(k)+'.',4000);return true}
 function domeRow(c){if(cityFallen(c))return '';const st=state(c);
  if(!st.built){const k=Econ154.domeBuild(),ok=cityL(c)>=3&&!L.siege&&Econ154.canPay(k);
   return '<div class="sec">DOMO DE PROTEÇÃO</div>'+row('Erguer o domo de '+c.name,'Cúpula que bloqueia monstros comuns e reduz em 30% o dano que você recebe na cidade. Não se refaz sozinha.<br>Custo: '+Econ154.costText(k)+'.',btn(cityL(c)<3?'Vila nível 3':L.siege?'Cerco em andamento':'Erguer o domo','domebuild',c.id,ok,'hot'))}
  const k=repairCost(c),pct=Math.round(st.hp*100);
  const txt=st.broken?'<span style="color:#ff8fa3">Rompido</span> · os monstros entram na cidade.':pct>=100?'Íntegro · bloqueia monstros comuns e reduz em 30% o dano que você recebe dentro da cidade. A manutenção sai do tesouro da cidade.':'Desgastado · '+pct+'%';
  return '<div class="sec">DOMO DE PROTEÇÃO</div>'+row('Domo de '+c.name,txt+(k.gold>0?'<br>Reforma: '+Econ154.costText(k)+'.':''),k.gold>0?btn(L.siege?'Cerco em andamento':'Reformar o domo','domefix',c.id,!L.siege&&Econ154.canPay(k),'hot'):'<b>Íntegro</b>')}
 function inside(x,z){for(const d of domes.values())if(!d.broken&&Math.hypot(x-d.c.x,z-d.c.z)<d.r)return d;return null}
 function shatter(d){
  d.broken=true;d.hp=0;bigText('O DOMO SE ROMPEU',1800);shake(.9);sfx&&sfx('gong');
  toast('<b>[CIDADE]</b> O domo de '+d.c.name+' se rompeu. Os monstros podem entrar até Brann reformá-lo (Defesa da Vila).',6000);save(true);
  const mat=new THREE.MeshBasicMaterial({color:0x6a4bd6,transparent:true,opacity:.75,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending});
  for(let i=0;i<90;i++){const a=Math.random()*TAU,el=Math.random()*1.35,s=1.2+Math.random()*2.6;
   const tri=new THREE.Mesh(new THREE.CircleGeometry(s,3),mat.clone());
   tri.position.set(d.c.x+Math.cos(a)*Math.cos(el)*d.r,Math.sin(el)*d.r,d.c.z+Math.sin(a)*Math.cos(el)*d.r);
   tri.lookAt(d.c.x,0,d.c.z);scene.add(tri);
   shards.push({m:tri,v:new THREE.Vector3(Math.cos(a)*(2+Math.random()*4),Math.random()*3,Math.sin(a)*(2+Math.random()*4)),w:new THREE.Vector3(Math.random()*3,Math.random()*3,Math.random()*3),life:2.8+Math.random()*1.2});}
 }
 function update(dt){
  t+=dt;
  // keep one dome per loaded, living city
  const live=new Set();if(L.mode==='world')for(const ch of chunks.values())if(ch.city&&!cityFallen(ch.city))live.add(ch.city);
  for(const[k,d]of domes)if(![...live].some(c=>c.id===k)||Math.abs(d.r-radius(d.c))>.5){scene.remove(d.m);d.m.geometry.dispose();d.m.material.dispose();domes.delete(k)}
  for(const c of live)if(!domes.has(c.id)&&((profile.dome154||{})[c.id]||{}).built)domes.set(c.id,make(c));
  const S=L.siege;
  for(const d of domes.values()){
   d.u.uTime.value=t;d.u.uHp.value=d.hp;
   if(d.broken){d.m.visible=false;continue}
   d.m.visible=true;d.grow=Math.min(1,(d.grow??1)+dt*.35);d.u.uGrow.value=d.grow;d.m.scale.setScalar(.2+.8*d.grow);
   if(d.hitT>0){d.hitT=Math.max(0,d.hitT-dt*.9);d.u.uHitT.value=d.hitT}
   // the siege dragon chews through the shell: ~50 s of contact breaks it
   if(S&&S.c===d.c&&S.b&&!S.b.dead){const dd=Math.hypot(S.b.x-d.c.x,S.b.z-d.c.z);if(dd<d.r+14){d.hp-=dt/50;if(d.hitT<.15){d.hitT=1;const k=d.r/Math.max(.01,dd);d.u.uHit.value.set(d.c.x+(S.b.x-d.c.x)*k,6,d.c.z+(S.b.z-d.c.z)*k)}if(d.hp<=0)shatter(d)}}
   // common monsters cannot cross the shell
   /* v343 (Ian): a tropa que ataca ESTA cidade também é barrada e gasta o domo até ele romper (antes atravessava direto) */
   for(const e of enemies){if(e.dead||e.siege)continue;const raid343=!!(e.raid155&&e.raid155.city===d.c.id);if(e.breaker&&!raid343)continue;const dx=e.x-d.c.x,dz=e.z-d.c.z,dist=Math.hypot(dx,dz),lim=d.r+(e.r||.6);
    if(raid343&&dist<lim+1.5){d.hp-=dt*(e.isBoss?.006:.0025);if(d.hitT<.2&&Math.random()<dt*3){d.hitT=.8;d.u.uHit.value.set(e.x,1.5,e.z)}if(d.hp<=0){shatter(d);break}}
    if(dist<lim&&dist>d.r-6){const k=lim/Math.max(.01,dist);e.x=d.c.x+dx*k;e.z=d.c.z+dz*k;if(e.m&&e.m.root)e.m.root.position.set(e.x,e.m.root.position.y,e.z);if(d.hitT<.2&&Math.random()<dt*2){d.hitT=.6;d.u.uHit.value.set(e.x,1.5,e.z)}}}
  }
  for(let i=shards.length-1;i>=0;i--){const s=shards[i];s.life-=dt;s.v.y-=9.8*dt;s.m.position.addScaledVector(s.v,dt);s.m.rotation.x+=s.w.x*dt;s.m.rotation.y+=s.w.y*dt;s.m.material.opacity=Math.max(0,Math.min(.75,s.life*.4));if(s.life<=0||s.m.position.y<-1){scene.remove(s.m);s.m.geometry.dispose();s.m.material.dispose();shards.splice(i,1)}}
  saveT+=dt;if(saveT>5){saveT=0;save(false)}
 }
 // hooks into the existing game loop and damage
 const baseSiege=updSiege;updSiege=function(dt){baseSiege(dt);try{update(dt)}catch(err){console.warn('Dome154',err)}};
 const baseHurt=hurtPlayer;hurtPlayer=function(amt,...rest){if(L.mode==='world'&&player&&inside(player.x,player.z))amt*=.7;return baseHurt(amt,...rest)};
 return {update,inside,domes,shatter,row:domeRow,repair,repairCost,state,build,wear};
})();
