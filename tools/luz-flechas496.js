/* Approved Archer/Paladin pieces. Drawings follow the game's own projectile and hit state. */
(function(){'use strict';
const G=window.Golpes487;if(!G)return;const X=G.fx,T=THREE,heads=new Map(),CIS=[4,5];
const recipe=ci=>G.referenceRecipes.find(r=>r.id===ci),world=p=>new T.Vector3(p.x,p.y??X.ground(p.x,p.z)+1,p.z);
const point=(p,y=0)=>new T.Vector3(p.x,X.ground(p.x,p.z)+y,p.z),random=()=>X.random();
function impact(p,e){const ci=p.fx487.ci,rs=recipe(ci),c=X.context(ci,e||null,p),pos=world(p);c.foe.position=point(p);
 X.inContext(c,()=>{if(ci===5){X.fade(X.sprite(X.starTex,pos,1.6,{color:rs.col[1]}),.25,.3);X.ringFace(pos,rs.col[1],.3,1.5,.3);X.sparks(pos,12,rs.col[1],4,2);X.knock(c.foe,.2)}else{X.sparks(pos,12,rs.col[1],4.5);X.ringFace(pos,rs.col[1],.3,1.2,.25);X.knock(c.foe,.22);if(p.third)X.sparks(pos,10,rs.col[1],3)}});
}
const P={basic:ci=>CIS.includes(ci),replacesBasic:o=>CIS.includes(o.basicVfx487??o.fx487?.ci),handles:s=>s?.skillId==='4:0'||s?.skillId==='5:1',immediate:s=>s.sourceClass===4,delayFor:s=>s.sourceClass===4?0:.35,
 animationPlan:s=>({clip:null,overlay:s.sourceClass===4?'arco496_chuva':'luz496_julgamento',duration:1.1}),
 start(s,K,cast){const ci=s.sourceClass,rs=recipe(ci),c=X.context(ci,ci===5?K.list[0]||null:null,K.pt);c.cast=cast;c.skill=s;c.areaRadius=K.r;
  X.inContext(c,()=>{if(ci===5){rs.s();X.at(.35,()=>{if(K.list[0])c.foe.position=point(K.list[0]);G.releaseCast(cast);for(const e of K.list.slice(1)){const q=point(e,.85);X.sparks(q,12,rs.col[1],4,2);X.fade(X.sprite(X.starTex,q,1.5,{color:rs.col[1]}),.3,.3)}});return}
   const base=point(K.pt),hand=point(player,1.1).addScaledVector(c.S.dir,.5),up=hand.clone().add(new T.Vector3(0,8,0));
   const make=(p,big=false)=>{const m=new T.Mesh(X.BLADE,X.crystalMat('green'));m.position.copy(p);m.scale.set(.9,big?1.6:1.3,.9);X.add(m);return m};
   X.shot(hand,up,22,p=>make(p),null,{align:true,trail:[.25,rs.col]});
   const life=(s.delay||.1)+(s.pulses-1)*.65+.8;X.ringFlat(base,rs.col[1],2.8,K.r/.36,life);X.rune(base,rs.col[2],K.r*2.15,life,.6);
   // Sixteen approved arrows, grouped around the five unchanged canonical pulses.
   let serial=0;for(let pulse=0;pulse<s.pulses;pulse++){const count=s.pulses===5?(pulse===2?4:3):Math.floor((pulse+1)*16/s.pulses)-Math.floor(pulse*16/s.pulses);for(let j=0;j<count;j++){const n=serial++,g=base.clone().add(new T.Vector3((random()-.5)*3.6,0,(random()-.5)*3.6));g.y=X.ground(g.x,g.z)+.05;const a=g.clone().add(new T.Vector3(-1.5,7,1.5)),hitAt=(s.delay||.1)+pulse*.65+j*.035,flight=Math.min(a.distanceTo(g)/24,hitAt),launch=hitAt-flight;
    X.at(launch,()=>X.shot(a,g,a.distanceTo(g)/Math.max(.03,flight),p=>make(p),p=>{X.sparks(p.clone().add(new T.Vector3(0,.15,0)),7,rs.col[1],3);X.ringFlat(p,rs.col[1],.2,1.1,.3);X.crystal('green',p,.35,.5,.25,new T.Vector3(1,0,-1).normalize(),{geo:X.BLADE,hold:.5,chunks:0,bits:false});if(n===15)X.flash(.4,.5,.12)},{align:true,trail:[.16,rs.col]}));
   }}
  });
 },
 hit(s,e){if(s.sourceClass!==4)return;const c=X.context(4,e);X.inContext(c,()=>{X.sparks(point(e,.85),9,recipe(4).col[1],4);X.knock(c.foe,.18,.2)})},
 prewarm(){const c=X.context(4,null,player);X.inContext(c,()=>{X.crystal('green',point(player),.2,.2,0,X.UP,{geo:X.BLADE,hold:.1,chunks:0,bits:false})})},
 clear(){for(const p of heads.keys()){p.mesh?.traverse(o=>o.layers.set(0));delete p.fx487}heads.clear()}
};G.providers.push(P);window.LuzFlechas496=P;
const shoot0=shoot;shoot=function(){const n=projs.length,r=shoot0.apply(this,arguments);if(!G.on)return r;for(let i=n;i<projs.length;i++){const p=projs[i],ci=p.basicClass??basicAttackId();if(p.team!=='player'||!p.fromPlayer||p.skillHit||!P.basic(ci))continue;if(ci===4&&!/^(arrow|sarrow)$/.test(p.ptype)||ci===5&&!/^(holy|orb)$/.test(p.ptype))continue;const rs=recipe(ci),c=X.context(ci,null,p);p.fx487={ci,sk:null,start:world(p),serial:player.combo||1};p.mesh.traverse(o=>o.layers.set(31));X.inContext(c,()=>{let m;if(ci===4){m=new T.Mesh(X.BLADE,X.crystalMat('green'));m.scale.set(.9,p.third?1.6:1.2,.9);m.position.copy(world(p));X.add(m)}else m=X.orb(world(p),.55,rs.col,{noise:.6});heads.set(p,m);X.trail(()=>projs.includes(p)?world(p):null,ci===4?(p.third?.3:.18):.3,rs.col,{len:p.third?18:12});X.spawn(m,(o,dt,t)=>{if(!projs.includes(p)){heads.delete(p);return false}o.position.copy(world(p));if(ci===4)o.quaternion.setFromUnitVectors(X.UP,new T.Vector3(p.vx,p.vy||0,p.vz).normalize());else{X.faceCam(o);o.material.uniforms.uTime.value=time}return true})})}return r};
const pi0=projectileImpact253;projectileImpact253=function(p){if(!G.projectile(p)||!P.basic(p.fx487.ci))return pi0.apply(this,arguments);const r=pi0.apply(this,arguments);impact(p,[...p.hit].at(-1));return r};
const ready={upperarm_l:[-90,0,30],upperarm_r:[-75,0,-35],forearm_l:[-20,0,0],forearm_r:[-75,0,0],spine:[5,0,0]};
Anim303.A.arco496_chuva={d:1.1,gameClock:true,mage488:true,k:[{t:0,b:{}},{t:.15,b:{...ready,chest:[-15,-20,0],upperarm_l:[-150,0,30],upperarm_r:[-130,0,-45],forearm_r:[-120,0,0],head:[-30,0,0]}},{t:.3,b:{...ready,chest:[-10,15,0],upperarm_l:[-145,0,30],upperarm_r:[-110,0,-60],forearm_r:[-20,0,0]}},{t:.6,b:ready},{t:1,b:{}}]};
Anim303.A.luz496_julgamento={d:1.1,gameClock:true,mage488:true,k:[{t:0,b:{}},{t:.17,b:{upperarm_r:[-160,0,-35],upperarm_l:[-140,0,35],forearm_r:[-20,0,0],forearm_l:[-35,0,0],chest:[-14,0,0],head:[-20,0,0]}},{t:.34,root:{y:-.08},b:{upperarm_r:[-85,0,-30],upperarm_l:[-80,0,30],forearm_r:[-15,0,0],forearm_l:[-20,0,0],chest:[20,0,0],spine:[12,0,0]}},{t:.7,b:ready},{t:1,b:{}}]};
})();
