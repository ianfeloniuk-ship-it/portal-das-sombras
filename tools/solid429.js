/* v429 (Ian): "ainda tem muitos objetos e pessoas no jogo que eu consigo atravessar, como a própria carroça".
   O que se mexe — carroças da estrada, NPCs da cidade, caçadores, figurantes da campanha, clãs amigos, caravana escoltada e peças dos
   acampamentos — entra no mesmo hash de colisores do mundo (HASH, hadd/hrem do 170-colisao) e é atualizado a cada quadro.
   - Pessoas: colisor pl429, só barra o jogador (pushOut dele). Quem está andando desvia do jogador (é empurrado para fora dele).
   - Carroça: colisor normal (barra jogador, monstros e câmera) em círculos ao longo do corpo e do boi. Some enquanto o jogador está nela.
   - Pessoas não atravessam a carroça, nem a que leva o jogador. */
(function(){
'use strict';
const people=new Map(),wagons=new Map(),props=new Map(),figs=new Set();let world=null;
/* carroça detalhada (wagon369): corpo e rodas de -2,65 a 2,66 m, boi e cabeça até ~5,5 m à frente */
const CART429=[[-1.95,1.25],[-.7,1.25],[.55,1.2],[1.75,1.05],[3.05,.7],[4.05,.62],[5.0,.5]];
const PEOPLE429={vendor:.45,hunter:.42,citizen:.4};
function move(c,x,z){if(Math.floor(c.x/HB)!==Math.floor(x/HB)||Math.floor(c.z/HB)!==Math.floor(z/HB)){hrem(c);c.x=x;c.z=z;hadd(HASH,c)}else{c.x=x;c.z=z}}
function make(x,z,r,extra){const c=Object.assign({x,z,r},extra);hadd(HASH,c);return c}
function alive(o){let n=o;while(n){if(n===scene)return true;n=n.parent}return false}
/* HASH é zerado pelo clearLevel ao trocar de mapa: esquece os colisores antigos; figurantes e peças continuam registrados (somem sozinhos quando saem da cena) */
function reset(){people.clear();wagons.clear();for(const p of props.values())p.cols=null;world=L}
function cartCircles(w){const s=Math.sin(w.face),c=Math.cos(w.face);return CART429.map(([dz,r])=>[w.x+s*dz,w.z+c*dz,r])}
function sync(o){if(o.m&&o.m.root){o.m.root.position.x=o.x;o.m.root.position.z=o.z}const c=people.get(o);if(c)move(c,o.x,o.z)}
const walker=o=>o.kind==='hunter'||o.kind==='citizen'||o.friendly217;
function tick(){
 if(typeof L==='undefined'||!L||!player||L.mode!=='world')return;
 if(world!==L)reset();
 const P=player,pr=P.r||.5,seen=new Set(),rideW=window.Living372&&Living372.rideWagon?Living372.rideWagon():null;
 const far=(x,z,d)=>Math.abs(x-P.x)>d||Math.abs(z-P.z)>d;
 const person=(o,r,x,z)=>{seen.add(o);const c=people.get(o);if(!c)people.set(o,make(x,z,r,{pl429:true,own429:o}));else{c.r=r;move(c,x,z)}};
 for(const n of npcs){if(n.gone||n.critter||!n.m||!PEOPLE429[n.kind]||far(n.x,n.z,48))continue;person(n,PEOPLE429[n.kind],n.x,n.z)}
 if(typeof FRIENDS217!=='undefined')for(const e of FRIENDS217){if(e.gone||e.dead||!e.friendly217||!e.m||!e.m.root.parent||far(e.x,e.z,48))continue;person(e,Math.max(.35,Math.min(1.1,(e.r||.5)*.85)),e.x,e.z)}
 for(const a of allies){if(!a.caravan||a.dead||far(a.x,a.z,48))continue;person(a,.9,a.x,a.z);const k=a.cart429k||(a.cart429k={});person(k,.95,a.x-Math.sin(a.face)*1.6,a.z-Math.cos(a.face)*1.6)}
 for(const f of figs){const root=f.m&&f.m.root;if(!root||!alive(root)){figs.delete(f);continue}if(f.noBlock551||!root.visible||far(root.position.x,root.position.z,48))continue;person(f,f.down?.55:.4,root.position.x,root.position.z)}
 for(const [o,c] of people)if(!seen.has(o)){hrem(c);people.delete(o)}
 /* carroças da estrada */
 const list=window.Civic343?Civic343.wagons:[],seenW=new Set();
 for(const w of list){if(w.gone||w===rideW||far(w.x,w.z,64))continue;seenW.add(w);const cs=wagons.get(w),q=cartCircles(w);
  if(!cs)wagons.set(w,q.map(([x,z,r])=>make(x,z,r,{cart429:w})));else q.forEach(([x,z],i)=>move(cs[i],x,z))}
 for(const [w,cs] of wagons)if(!seenW.has(w)){for(const c of cs)hrem(c);wagons.delete(w)}
 /* peças fixas registradas por outros módulos (acampamentos de clã, carroça tombada da campanha) */
 for(const [o,p] of props){if(!alive(o)){if(p.cols)for(const c of p.cols)hrem(c);props.delete(o);continue}
  const s=Math.sin(o.rotation.y),co=Math.cos(o.rotation.y),at=q=>[o.position.x+q.x*co+q.z*s,o.position.z-q.x*s+q.z*co];
  if(!p.cols)p.cols=p.loc.map(q=>{const [x,z]=at(q);return make(x,z,q.r,{prop429:o})});else p.loc.forEach((q,i)=>{const [x,z]=at(q);move(p.cols[i],x,z)})}
 /* quem anda desvia do jogador parado */
 if(!P.dead&&!rideW)for(const [o,c] of people){if(!walker(o)||!o.m)continue;const dx=o.x-P.x,dz=o.z-P.z,d=Math.hypot(dx,dz),m=c.r+pr;if(d<m){if(d>1e-4){o.x=P.x+dx/d*m;o.z=P.z+dz/d*m}else o.x=P.x+m;sync(o)}}
 /* ninguém entra na carroça; o jogador é empurrado para fora se ela encostar nele */
 for(const w of list){if(w.gone||far(w.x,w.z,64))continue;const q=cartCircles(w);
  for(const [o,c] of people){if(!walker(o)||Math.abs(o.x-w.x)>7||Math.abs(o.z-w.z)>7)continue;let hit=false;for(const [x,z,r] of q){const dx=o.x-x,dz=o.z-z,d=Math.hypot(dx,dz),m=r+c.r;if(d<m){hit=true;if(d>1e-4){o.x=x+dx/d*m;o.z=z+dz/d*m}else o.x=x+m}}if(hit)sync(o)}
  if(w!==rideW&&!rideW&&!P.dead&&Math.hypot(P.x-w.x,P.z-w.z)<7&&q.some(([x,z,r])=>Math.hypot(P.x-x,P.z-z)<r+pr-.01)){pushOut(P);P.m.root.position.x=P.x;P.m.root.position.z=P.z}}
}
window.Solid429={tick,CART:CART429,
 figure(f){if(f&&f.m&&f.m.root)figs.add(f);return f},
 prop(o,loc){if(o&&loc&&loc.length)props.set(o,{loc,cols:null});return o},
 count:()=>({people:people.size,wagons:wagons.size,props:props.size,figs:figs.size})};
const base429=update;update=function(dt){base429(dt);try{tick()}catch(err){console.warn('Solid429',err)}};
})();
