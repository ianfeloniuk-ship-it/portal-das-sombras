/* Remaining mage abilities: approved real-time pieces, canonical combat untouched. */
(function(){'use strict';
const G=window.Golpes487;if(!G)return;const X=G.fx,T=THREE,old=new Set(['8:1','9:0','10:0','11:0']);
const rec=ci=>G.referenceRecipes.find(r=>r.id===ci),pal=ci=>ci===9?'ice':ci===10?'stone':'magma';
const point=(p,y=0)=>new T.Vector3(p.x,X.ground(p.x,p.z)+y,p.z);
const watches=new Set();
function watch(c,life,fn){const w={c,life,age:0,next:0,fn};watches.add(w);return w}
function dust(p,ci,n=8){const col=rec(ci).col;X.sparks(point(p,.65),n,col[1],3.5);X.smoke(point(p,.12),Math.ceil(n/3),ci===8?0x44302a:ci===10?0x79634c:0xa9ddeb,1,1,.8,.28)}
function wave(p,r,ci,life=.65){X.ringFlat(point(p),rec(ci).col[1],.3,r/.36,life);X.crack(point(p),rec(ci).col[1],Math.min(7,r*1.6),.5)}
function shard(p,ci,h=1,hold=.5){X.crystal(pal(ci),point(p),h,.65,.35,new T.Vector3(p.x-player.x,0,p.z-player.z).normalize(),{grow:.12,hold,melt:.35,chunks:2})}
function hit(p,ci,big=false){if(ci===8){rec(8).boom(point(p,.6),big?1.2:.7);return}dust(p,ci,big?16:7);if(ci===9||ci===10){X.bits(pal(ci),point(p,.65),big?10:5);shard(p,ci,big?1.7:.7)}else{X.bolt(point(p,4),point(p,.25),rec(ci).col,{width:big?.28:.15,life:.22});X.ringFace(point(p,.7),rec(ci).col[1],.2,big?2:1,.3)}if(big)X.flash(.25,.4,.12)}
function shell(c,a,ci,life,valid){const pieces=[],origin=point(a);for(let i=0;i<6;i++){const angle=i*Math.PI/3,m=new T.Mesh(X.GEOS[i],X.crystalMat(pal(ci)));m.name='MageShield493';m.scale.set(.34,1,.3);m.position.copy(origin).add(new T.Vector3(Math.sin(angle)*.7,.35,Math.cos(angle)*.7));m.rotation.z=Math.sin(angle)*.25;X.add(m);pieces.push({m,offset:m.position.clone().sub(origin)});X.spawn(m,(o,dt,t)=>{if(a.dead||t>life||!valid()){X.bits(pal(ci),o.position,2);return false}o.position.copy(point(a)).add(pieces[i].offset);o.scale.y=1+.035*Math.sin(t*5+i);o.material.uniforms.uTime.value=time;return true})}X.rune(origin,rec(ci).col[1],2.5,.7)}
function trailStep(K,ci){const a=point(K.origin,.35),b=point(player,.35),dist=a.distanceTo(b),col=rec(ci).col;for(let i=0,n=Math.max(2,Math.ceil(dist/.65));i<=n;i++){const p=a.clone().lerp(b,i/n);if(ci===11){if(i)X.bolt(a.clone().lerp(b,(i-1)/n),p,col,{width:.2,life:.32})}else if(ci===8)X.embers(p,3,col[1],.5,.8);else{shard(p,ci,.22,.2);X.smoke(p,1,0xc6efff,.4,.7,.5,.25)}}wave(player,1.4,ci,.45);dust(K.origin,ci);dust(player,ci)}
function zone(c,s,z){const ci=s.sourceClass,col=rec(ci).col,life=Math.min(6.5,z.until-time);X.rune(point(z),col[1],z.r*2.15,life,.2);
 if(s.effect==='barrier'){for(let i=0;i<7;i++){const a=i*Math.PI*2/7,p={x:z.x+Math.sin(a)*z.r*.8,z:z.z+Math.cos(a)*z.r*.8};if(ci===10)shard(p,ci,1.7,Math.max(.1,life-.4))}watch(c,life,()=>{if(z.until<=time)return false;if(ci===8){for(let i=0;i<5;i++){const a=i*Math.PI*2/5+time*.15,p={x:z.x+Math.sin(a)*z.r*.8,z:z.z+Math.cos(a)*z.r*.8};const o=X.orb(point(p,.9),1.1,col,{fire:1});o.material.uniforms.uFade.value=.3;X.spawn(o,(m,dt,t)=>{m.material.uniforms.uTime.value=time;X.faceCam(m);m.material.uniforms.uFade.value=.3*Math.max(0,1-t/.35);return t<.35});X.bolt(point(p,.15),point(p,2.1),col,{width:.45,life:.14,jit:.1,gain:.55});X.embers(point(p),2,col[1],.5,.5)}}return true})}
 else watch(c,life,()=>{if(z.until<=time)return false;if(ci===11){const a=time*2,p={x:z.x+Math.sin(a)*z.r*.8,z:z.z+Math.cos(a)*z.r*.8};X.bolt(point(z,.12),point(p,.12),col,{width:.09,life:.2});X.sparks(point(p,.1),3,col[1],1,0)}else{X.slash(point(z,.08),time,{col,r:z.r*.65,w:.22,arc:4,dur:.25,tilt:0});X.smoke(point(z,.1),2,0x856645,z.r,.6,1,.2)}return true});
}
const Q={basic:()=>false,delayFor:()=>0,handles:s=>!!s&&[8,9,10,11].includes(s.sourceClass)&&Number(s.skillId?.split(':')[1])<10&&!old.has(s.skillId),immediate:()=>true,
 animationPlan:s=>{const kind=['move','speed'].includes(s.effect)?'paso':['ward','guard','barrier','summon','slowzone'].includes(s.effect)?'selo':s.effect==='pulses'?'ceu':s.effect==='line'?'jato':'explosao';return {clip:null,overlay:'mage493_'+kind,duration:kind==='paso'?.6:kind==='ceu'?1.45:1}},
 start(s,K){const ci=s.sourceClass,c=X.context(ci,K.list[0]||null,K.pt),col=rec(ci).col,r=K.r;X.inContext(c,()=>{
  const p=K.pt;X.fade(X.sprite(X.glowTex,point(K.origin,1.15),.25,{color:col[1]}),.3,2);
  switch(s.effect){
   case 'bolt':X.ringDir(point(K.origin,1),c.S.dir,col[1],.2,1.2,.3);break;
   case 'area':wave(p,r,ci);if(ci===8){hit(p,ci,true);for(let i=0;i<5;i++)X.slash(point(p,.5),i*1.256,{col,r:Math.min(r*.6,3),w:.6,arc:1.3,dur:.25,tilt:.6})}else{for(let i=0;i<8;i++){const a=i*Math.PI/4;shard({x:p.x+Math.sin(a)*r*.65,z:p.z+Math.cos(a)*r*.65},ci,1.1)}dust(p,ci,18)}for(const e of K.list)dust(e,ci,6);break;
   case 'conditional260':case 'target':for(const e of K.list){X.bolt(point(K.origin,1.1),point(e,.8),col,{width:.09,life:.14,jit:.1});hit(e,ci,true)}break;
   case 'line':{const a=point(K.origin,1),b=a.clone().addScaledVector(c.S.dir,s.range);X.bolt(a,b,col,{width:.55,life:.4,jit:.12});for(let i=1;i<=8;i++){const q=a.clone().lerp(b,i/8),o=X.orb(q,.75,col,{fire:1});X.spawn(o,(m,dt,t)=>{X.faceCam(m);m.material.uniforms.uTime.value=time;m.scale.setScalar(.75*(1-t/.45));return t<.45});X.embers(q,2,col[1],.5,.6)}break}
   case 'pulses':{const z=kitState111().zones.at(-1);if(!z)break;if(ci===10&&s.skillId==='10:8'){const a=point(z,8),b=point(z,.2);X.shot(a,b,a.distanceTo(b)/(s.delay||1),q=>{const m=new T.Mesh(X.GEOS[3],X.crystalMat('stone'));m.scale.set(.8,1.1,.8);m.position.copy(q);X.add(m);return m},()=>dust(z,ci,16),{trail:[.4,col],tumble:true})}X.rune(point(z),col[1],r*2.15,(s.delay||.1)+s.pulses*.65,.25);if(ci===8){const dark=X.crystalMat('magma');dark.uniforms.uD.value.set(.004,.001,.001);dark.uniforms.uM.value.set(.025,.004,.001);dark.uniforms.uE.value.set(.08,.008,.001);dark.uniforms.uV.value.set(.15,.012,.001);const geo=new T.IcosahedronGeometry(.7,2);geo.computeVertexNormals();const core=new T.Mesh(geo,dark);core.position.copy(point(z,1.8));X.add(core);X.spawn(core,(m,dt,t)=>{m.rotation.y+=dt*.7;m.rotation.x+=dt*.2;dark.uniforms.uTime.value=time;m.scale.setScalar(1+.04*Math.sin(t*9));return t<(s.delay||.1)+s.pulses*.65});const o=X.orb(point(z,1.8),2.4,[0x11090b,0x8c1e07,0xff9b24],{fire:1,noise:1.2});X.spawn(o,(m,dt,t)=>{X.faceCam(m);m.material.uniforms.uTime.value=time;return t<(s.delay||.1)+s.pulses*.65});}let left=z.left;watch(c,(s.delay||.1)+s.pulses*.65+.4,()=>{if(z.left!==left){left=z.left;wave(z,r,ci,.45);if(ci===11&&s.skillId==='11:3'){X.bolt(point(z,10),point(z,.2),col,{width:.55,life:.3});X.flash(.3,.5,.15)}dust(z,ci,6)}return z.left>0},);break}
   case 'burn':{const e=K.list[0];if(e)watch(c,s.duration,()=>{if(e.dead||!(e.basicDots?.kitFire111?.t>0))return false;X.embers(point(e,.5),5,col[1],.7,.65);const o=X.orb(point(e,.65),.85,col,{fire:1});X.spawn(o,(m,dt,t)=>{X.faceCam(m);m.material.uniforms.uTime.value=time;return t<.3});return true});break}
   case 'move':trailStep(K,ci);break;
   case 'blind':wave(p,r,ci,.45);for(const e of K.list){if(ci===9)X.smoke(point(e,.8),7,0x9bdbed,1,s.duration,1.4,.3);else{X.ringFace(point(e,1),col[1],.2,1.3,.3);X.sparks(point(e,1),8,col[1],2,0)}}break;
   case 'slow':wave(p,r,ci);for(const e of K.list)if(e.slow>0){shard(e,ci,.5,.6);dust(e,ci,5)}break;
   case 'root':for(const e of K.list)if(!e.isBoss&&e.kitRoot111>time){for(let i=0;i<5;i++){const a=i*Math.PI*2/5;shard({x:e.x+Math.sin(a)*.6,z:e.z+Math.cos(a)*.6},ci,1.45,Math.max(.1,e.kitRoot111-time-.4))}dust(e,ci,8)}break;
   case 'push':wave(p,r,ci);if(ci===9){for(let i=0;i<3;i++)X.slash(point(p,.5+i*.4),i*2,{col,r:r*.65,w:.65,arc:3.8,dur:.45,spin:2,tilt:.18})}else if(ci===10){for(let i=0;i<7;i++){const a=i*Math.PI*2/7;shard({x:p.x+Math.sin(a)*r*.55,z:p.z+Math.cos(a)*r*.55},ci,1.8)}}else for(let i=0;i<3;i++)X.slash(point(p,.4+i*.35),i*2,{col,r:r*.6,w:.35,arc:4.5,dur:.5,spin:4,tilt:.15});for(const e of K.list)dust(e,ci,7);break;
   case 'ward':for(const a of kitAllies111(s))shell(c,a,ci,s.duration,()=>a.healShield>0&&a.healShieldUntil>time);break;
   case 'guard':for(const a of kitAllies111(s))shell(c,a,ci,s.duration,()=>a.kitGuard111?.until>time);break;
   case 'summon':for(const a of allies)if(!K.alliesBefore.has(a)){a.m.root.traverse(o=>o.layers.set(0));delete a.m.root.userData.gate487;X.rune(point(a),col[1],4,1.2);for(let i=0;i<6;i++){const angle=i*Math.PI/3,start=point(a).add(new T.Vector3(Math.sin(angle)*2,1,Math.cos(angle)*2));X.shot(start,point(a,1),7,q=>{const m=new T.Mesh(X.GEOS[i],X.crystalMat('stone'));m.scale.setScalar(.2);m.position.copy(q);X.add(m);return m},()=>dust(a,ci,3),{trail:[.12,col]})}wave(a,2,ci)}break;
   case 'barrier':case 'slowzone':{const z=kitState111().zones.at(-1);if(z)zone(c,s,z);break}
   case 'interrupt':wave(p,r,ci,.35);for(const e of K.list)if(!e.isBoss&&e.kitInterrupt111>time){for(let i=0;i<3;i++)X.bolt(point(e,.3+i*.3),point(e,.6+(i%2)*.8),col,{width:.12,life:.25,jit:.4});dust(e,ci,6)}break;
   case 'speed':{let prev=point(player,.15);watch(c,s.duration,()=>{if(!(kitState111().speed?.until>time))return false;const next=point(player,.15);if(next.distanceTo(prev)>.12){X.bolt(prev,next,col,{width:.1,life:.22});X.sparks(next,3,col[1],1,0);prev=next}return true});wave(player,1.3,ci);break}
  }
 });},
 hit(s,e){if(s.effect!=='pulses')return;const c=X.context(s.sourceClass,e);X.inContext(c,()=>hit(e,s.sourceClass,false))},
 update(dt){for(const w of watches){w.age+=dt;if(w.age>w.life){watches.delete(w);continue}w.next-=dt;if(w.next<=0){w.next=.12;try{if(X.inContext(w.c,w.fn)===false)watches.delete(w)}catch(e){watches.delete(w);G.errors.push(String(e));console.error('magos493',e)}}}},
 clear(){watches.clear()}
};G.providers.push(Q);window.Magos493=Q;
// Short cast motions return to locomotion; gameplay position and collision remain owned by the kit.
const A=Anim303.A,ready={upperarm_r:[-85,0,-30],upperarm_l:[-80,0,30],forearm_r:[-65,0,0],forearm_l:[-60,0,0],spine:[8,0,0]};
const motions={
 explosao:[{...ready,chest:[-10,-30,0],upperarm_r:[-140,0,-40]},{...ready,chest:[18,30,0],forearm_r:[-10,0,0],forearm_l:[-15,0,0]}],
 selo:[{...ready,chest:[-8,0,0],upperarm_r:[-130,0,-45],upperarm_l:[-130,0,45]},{...ready,chest:[15,0,0],forearm_r:[-15,0,0],forearm_l:[-15,0,0]}],
 jato:[{...ready,chest:[-10,-25,0],forearm_r:[-110,0,0]},{...ready,chest:[12,20,0],upperarm_r:[-100,0,-25],forearm_r:[-10,0,0],upperarm_l:[-100,0,30]}],
 ceu:[{...ready,chest:[-15,0,0],upperarm_r:[-160,0,-30],upperarm_l:[-150,0,30]},{...ready,chest:[12,0,0],upperarm_r:[-115,0,-35],upperarm_l:[-110,0,35]}],
 paso:[{...ready,spine:[28,0,0],thigh_l:[-40,0,0],shin_l:[55,0,0],upperarm_r:[20,0,-25]},{...ready,spine:[18,0,0],thigh_r:[-30,0,0],shin_r:[40,0,0],upperarm_l:[15,0,25]}]
};for(const [name,[a,b]]of Object.entries(motions))A['mage493_'+name]={d:name==='paso'?.6:name==='ceu'?1.45:1,gameClock:true,mage488:true,k:[{t:0,b:{}},{t:.18,b:a},{t:.38,root:{y:-.06},b:b},{t:.72,b:ready},{t:1,b:{}}]};
})();
