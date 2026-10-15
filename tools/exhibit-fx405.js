/* Same visual recipes and actors as combat, sampled on an isolated clock. */
(()=>{
'use strict';
function create({scene,camera,hero,targets,ci}){
 const T=THREE,P={x:-2.8,z:0,face:Math.PI/2,m:hero,r:.5},enemies=targets.map(m=>({m,x:0,z:0,r:.55,maxhp:100,dead:false,hitUntil:0}));
 let clock=0,current=null,cast=false,disposed=false,allies=[];const queue=[],shaderTime={value:0},isolated=new WeakSet();
 const heroMaterials=[...new Set(hero.mats||[])].map(m=>({m,transparent:m.transparent,opacity:m.opacity,depthWrite:m.depthWrite}));
 function isolate(o){if(isolated.has(o))return o;isolated.add(o);const gs=new Map(),ms=new Map();o.traverse(n=>{if(n.geometry){if(!gs.has(n.geometry)){const g=n.geometry.clone();g.userData={...g.userData,shared:false};gs.set(n.geometry,g)}n.geometry=gs.get(n.geometry)}if(n.material){const clone=m=>{if(!ms.has(m)){const c=m.clone();c.userData={...c.userData,shared:false};if(c.uniforms?.uOpacity)Object.defineProperty(c,'opacity',{get(){return this.uniforms.uOpacity.value},set(v){this.uniforms.uOpacity.value=v},configurable:true});ms.set(m,c)}return ms.get(m)};n.material=Array.isArray(n.material)?n.material.map(clone):clone(n.material)}});return o}
 const ctx={scene,camera,player:P,enemies,allies:[],isolate,
  defer(fn,ms){if(!disposed)queue.push({at:clock+(ms||0)/1000,fn})},
  point(range=14){const d=Math.min(Number(range)||14,5.3);return{x:-2.8+Math.sin(P.face)*d,z:Math.cos(P.face)*d}},
  kitPoint(s){if(s.effect==='anchorward')return this.point(8);return s.ground===true||(s.ground!==false&&['slow','root','trap','barrier','slowzone','seal','device','relocate','pull','anchorward'].includes(s.effect))?this.point(s.range):{x:P.x,z:P.z}},
  kitRadius(s){return s.radius||0},
  kitTarget(s){const pt=this.point(s.range);return enemies.filter(e=>Math.hypot(e.x-P.x,e.z-P.z)<=(s.range||14)+e.r).sort((a,b)=>Math.hypot(a.x-pt.x,a.z-pt.z)-Math.hypot(b.x-pt.x,b.z-pt.z))[0]},
  kitTargets(s,pt=this.kitPoint(s)){if(s.single||['target','execute','burn','counter'].includes(s.effect)){const e=this.kitTarget(s);return e?[e]:[]}return enemies.filter(e=>Math.hypot(e.x-pt.x,e.z-pt.z)<=this.kitRadius(s)+e.r)},
  prepareObject(o){o.traverse(n=>{for(const m of [].concat(n.material||[]))if(m.uniforms?.uTime)m.uniforms.uTime=shaderTime})},
  projectile(type,col,scale,cls){return isolate(projModel(type,col,scale,cls,P,ctx))}
 };
 const fx=ctx.vfx302=VFX302.createPreview(ctx);ctx.vfx328=VFX328.createPreview(ctx);
 function releaseAlly(m){m.mixer?.stopAllAction();m.mixer?.uncacheRoot(m.model||m.root);const gs=new Set(),ms=new Set(),ss=new Set();m.root.traverse(o=>{if(o.geometry)gs.add(o.geometry);for(const x of [].concat(o.material||[]))ms.add(x);if(o.isSkinnedMesh)ss.add(o.skeleton)});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());ss.forEach(s=>s.dispose?.());m.root.parent?.remove(m.root)}
 function removeAllies(){allies.forEach(releaseAlly);allies=[];ctx.allies=[]}
 function restoreHero(){heroMaterials.forEach(({m,transparent,opacity,depthWrite})=>{if(m.transparent!==transparent){m.transparent=transparent;m.needsUpdate=true}m.opacity=opacity;m.depthWrite=depthWrite})}
 function reset(s){fx.clear();queue.length=0;removeAllies();restoreHero();clock=0;shaderTime.value=0;cast=false;current=s;P.x=-2.8;P.z=0;hero.root.visible=true;hero.a155?.mixer.stopAllAction();if(hero.a155){hero.a155.cur=null;hero.a155.state=null;hero.a155.mixer.setTime(0)}
  const pt=ctx.kitPoint(s),centered=s.t==='kit111'&&pt.x===P.x&&pt.z===P.z&&!s.single&&!['target','execute','burn','counter','bolt','fan','chain'].includes(s.effect),d=Math.min(s.range||5.3,5.3)*.75;
  enemies.forEach((e,i)=>{const r=Math.min(3,(s.radius||4)*.75);e.x=centered?P.x+Math.cos((i-1)*.8)*r:P.x+d+(i===1?.7:0);e.z=centered?Math.sin((i-1)*.8)*r:(i-1)*1.4;e.hitUntil=0;e.m.mixer?.stopAllAction();e.m.cur=null});pose(0)
 }
 function summon(s){const kind=s.kind||(/Colosso/.test(s.n)?'golem':/Lobo|Feras|Matilha/.test(s.n)?'wolf':'skel'),count=s.count||Math.round(s.pow)||1;
  for(let i=0;i<count;i++){let m;if(kind==='wolf')m=makeSpiritWolf();else if(kind==='golem')m=makeStoneColossus();else{const pm=toon(0x3a2466,0x1a0a33);m=makeChibi({mat:pm,skinMat:pm,legMat:pm,eye:0xa26bff,wep:'sword',scale:.9,gk:'Skeleton_Minion',tint:0x7a4ac0,emis:0x1a0a33})}
   isolate(m.root);m.root.position.set(P.x+Math.sin(i*2.1)*1.8,0,P.z+Math.cos(i*2.1)*1.8);m.root.rotation.y=P.face;scene.add(m.root);allies.push(m);ctx.allies.push({m,x:m.root.position.x,z:m.root.position.z,dead:false})
  }
 }
 // kitRun111's damaging projectiles use these same model, speed, spread and cadence.
 function shootPreview(s,offset=0,speed=25){const a=P.face+offset,m=ctx.projectile('orb',s.col,1,s.sourceClass??ci),start=new T.Vector3(P.x,1.1,P.z);const muzzle=MAGIC_CLS.includes(s.sourceClass??ci)&&Warrior127.staffMuzzle?.(hero);if(muzzle)start.set(muzzle.x,muzzle.y,muzzle.z);m.position.copy(start);m.rotation.y=a;
  const hit=new Set();fx.add(m,1.4,(k,t)=>{m.position.set(start.x+Math.sin(a)*speed*t,start.y,start.z+Math.cos(a)*speed*t);for(const e of enemies)if(!hit.has(e)&&Math.hypot(e.x-m.position.x,e.z-m.position.z)<e.r+.4){hit.add(e);e.hitUntil=clock+.25;if(s.effect!=='fan'&&s.sourceClass!==4)m.visible=false}})
 }
 function launch(){cast=true;const s=current,eff=s.effect||s.t;
  if(eff==='move'){const pt=ctx.point(s.range),dx=pt.x-P.x,dz=pt.z-P.z,len=Math.hypot(dx,dz);if(len){const d=Math.min(s.range,len)*(s.back?-1:1);P.x+=dx/len*d;P.z+=dz/len*d}}
  else if(eff==='blink')P.x-=7;
  fx.play(s);
  if(s.t==='kit111'&&['bolt','fan','release'].includes(eff)){if(eff==='bolt'&&s.sourceClass===4){for(let i=0;i<3;i++)ctx.defer(()=>shootPreview(s,0,30),i*110)}else for(const a of eff==='fan'?[-.2,0,.2]:[0])shootPreview(s,a)}
  if(eff==='pulses'&&/Flecha|Meteoro/.test(s.n)){const pt=ctx.kitPoint(s);for(let i=0;i<s.pulses;i++)ctx.defer(()=>pulseFx156({x:pt.x,z:pt.z,r:ctx.kitRadius(s),s,col:s.col},ctx),((s.delay||.1)+i*.65)*1000)}
  else if(eff==='rain'){const pt=ctx.point(),kind=/Flecha/.test(s.n)?'arrow':/Meteoro/.test(s.n)?'meteor':/Alma/.test(s.n)?'soul':'orb',n=kind==='meteor'?5:kind==='arrow'?10:7;for(let i=0;i<n;i++)fallFx(pt.x+Math.random()*6-3,pt.z+Math.random()*6-3,(kind==='meteor'?.6:.35)+i*(kind==='arrow'?.28:.35),kind,s.col,ctx)}
  if(eff==='summon')summon(s);
  if(eff==='stealth')heroMaterials.forEach(({m})=>{m.transparent=true;m.opacity=.35;m.needsUpdate=true});
  const at=ctx.kitTargets(s);if(['area','target','execute','cone','line','chain','counter'].includes(eff))at.forEach(e=>e.hitUntil=clock+.25);
 }
 function pose(dt){if(!current)return;const phase=clock-.25,eff=current.effect||current.t;if(eff==='dash_strike')P.x=-2.8+30*Math.max(0,Math.min(.28,phase));
  hero.root.position.set(P.x,0,P.z);hero.root.rotation.set(0,P.face,0);hero.model.visible=true;Exhibit405.animate(hero,{time:clock,skill:current,dt});
  if(eff==='stealth'&&phase>=(current.duration||3))restoreHero();
  enemies.forEach(e=>{e.m.root.position.set(e.x,0,e.z);e.m.root.rotation.y=-Math.PI/2;Exhibit405.animate(e.m,{time:clock,dt,hit:e.hitUntil>clock})});allies.forEach(m=>Exhibit405.animate(m,{time:clock,dt}))
 }
 function step(dt){clock+=dt;shaderTime.value=clock;pose(dt);if(!cast&&clock>=.25)launch();for(let i=0;i<queue.length;){if(queue[i].at<=clock+.00001){const task=queue.splice(i,1)[0];task.fn()}else i++}fx.update(dt)}
 function sample(s,t){if(disposed)return;if(s!==current||t<clock-.001)reset(s);while(clock+1/60<=t+.00001)step(1/60);if(t===0)pose(0)}
 function dispose(){if(disposed)return;disposed=true;queue.length=0;fx.dispose();removeAllies();restoreHero()}
 return{sample,dispose,reset,get duration(){const s=current;if(!s)return 3.8;if(s.effect==='pulses')return Math.max(3.8,.25+(s.delay||.1)+(s.pulses-1)*.65+.55+1.3);return 3.8},get effectCount(){return fx.size}};
}
window.ExhibitEffects405={create};
})();
