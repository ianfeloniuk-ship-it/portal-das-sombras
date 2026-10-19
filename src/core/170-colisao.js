/* ================= COLISÃO ================= */
const HB=8;const hkey=(bx,bz)=>(bx+100)*1000+(bz+100);
function hadd(h,c){const k=hkey(Math.floor(c.x/HB),Math.floor(c.z/HB));let a=h.get(k);if(!a)h.set(k,a=[]);a.push(c)}
function hnear(h,x,z,fn){const bx=Math.floor(x/HB),bz=Math.floor(z/HB);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const a=h.get(hkey(bx+i,bz+j));if(a)for(const c of a)fn(c)}}
/* v344 (Ian): pedras e troncos têm altura (c.h). Quem está acima do topo passa por cima e pode parar em cima; sem c.h o obstáculo continua valendo em qualquer altura. */
let COLY344=0;const envTop344=(k,s,y)=>{const m=ENV.m[k];return m&&s?Math.max(.2,(m.h*s+y)*.85):undefined};
function stepVertical357(P,dt){
 const old=Number(P.jy)||0,v=Number(P.jvy)||0,fl=floor344(P.x,P.z,old+.01);
 if(old>fl+.001||v>0){P.air344=true;const next=old+v*dt-12*dt*dt;P.jvy=v-24*dt;const land=floor344(P.x,P.z,Math.max(old,next)+.01);if(next<=land&&P.jvy<=0){P.jy=land;P.jvy=0;P.air344=false}else P.jy=next}
 else{P.jy=fl;P.jvy=0;P.air344=false}
}
function envSolidEW357(addCol,b,k,x,y,z,ry,w,t){const scale=EW(b,k,x,y,z,ry,w,t);envSolid357(addCol,k,x,y,z,ry,scale);return scale}
function envSolid357(addCol,key,x,y,z,ry,scale){
 const m=ENV.m[key];if(!m||!scale)return;const min=m.min,max=m.max,c=Math.cos(ry),sn=Math.sin(ry);
 const w=(max[0]-min[0])*scale,d=(max[2]-min[2])*scale,r=Math.max(.12,Math.min(w,d)*.48),longX=w>=d,len=Math.max(w,d),count=Math.max(1,Math.ceil(Math.max(0,len-2*r)/(r*1.4))+1);
 for(let i=0;i<count;i++){const offset=count===1?0:(i/(count-1)-.5)*(len-2*r),lx=(min[0]+max[0])*.5*scale+(longX?offset:0),lz=(min[2]+max[2])*.5*scale+(longX?0:offset);addCol({x:x+c*lx+sn*lz,z:z-sn*lx+c*lz,r,h:Math.max(.1,max[1]*scale+y),anchorX357:x,anchorZ357:z,prop357:key})}
}
function floor344(x,z,ceiling=Infinity){if(!L.ow460&&(L.mode!=='world'||L.grid))return 0;let f=0;const base=terrH(x,z);hnear(L.ow460?.solidHash||HASH,x,z,c=>{const top=c.h==null?0:terrH(c.anchorX357??c.x,c.anchorZ357??c.z)+c.h-base;if(top>f&&top<=ceiling+.001&&Math.hypot(x-c.x,z-c.z)<c.r)f=top});return f}
/* v429 (Ian): pessoas (NPCs, figurantes) entram no HASH com pl429 — só barram o jogador (pushOut dele); não contam para lugar livre, câmera nem IA */
function worldFree(x,z,r,worldY=terrH(x,z)+COLY344){let ok=true;hnear(L.ow460?.solidHash||HASH,x,z,c=>{if(c.pl429)return;if(c.h!=null&&worldY>=terrH(c.anchorX357??c.x,c.anchorZ357??c.z)+c.h-.01)return;if(Math.hypot(x-c.x,z-c.z)<c.r+r)ok=false});return ok}
function pushOut(e){const r=e.r||.5,y344=e.worldY357??(terrH(e.x,e.z)+(e===player?(player.jy||0):0));hnear(L.ow460?.solidHash||HASH,e.x,e.z,c=>{if(c.pl429&&e!==player)return;if(c.h!=null&&y344>=terrH(c.anchorX357??c.x,c.anchorZ357??c.z)+c.h-.01)return;const dx=e.x-c.x,dz=e.z-c.z,d=Math.hypot(dx,dz),m=c.r+r;if(d<m){const a=d>1e-6?Math.atan2(dz,dx):0;e.x=c.x+Math.cos(a)*m;e.z=c.z+Math.sin(a)*m}})}
function cellIdx(x,z){const G=L.grid;const cx=Math.floor((x-G.ox)/G.CS),cz=Math.floor((z-G.oz)/G.CS);if(cx<0||cz<0||cx>=G.W||cz>=G.H)return -1;return cz*G.W+cx}
function gfree(x,z){const i=cellIdx(x,z);return i>=0&&L.grid.cells[i]===1}
function freeAt(x,z,r){if(!crystalFree126(x,z,r))return false;if(L.ow460)return worldFree(x,z,r);if(L.grid)return gfree(x-r,z-r)&&gfree(x+r,z-r)&&gfree(x-r,z+r)&&gfree(x+r,z+r);return worldFree(x,z,r)}
/* v276 (Ian): monstros não ficam mais presos andando reto contra parede/cristal — se o passo quase não anda, escolhem um desvio livre e seguem por ele um tempo */
function navFree276(x,z,r){return crystalFree126(x,z,r)&&(L.grid?freeAt(x,z,r*.85):worldFree(x,z,r))}
function moveEnt(e,dx,dz){if(window.Cogu348&&Cogu348.asleep(e))return;if(e===player||!Number.isFinite(dx)||!Number.isFinite(dz))return moveEnt0(e,dx,dz);const want=Math.hypot(dx,dz);if(want<1e-4)return moveEnt0(e,dx,dz);
  if(e.path276&&e.path276.n>0&&e.path276.pts.length){e.path276.n--;const q=e.path276.pts[0],qx=q.x-e.x,qz=q.z-e.z,ql=Math.hypot(qx,qz);if(ql<.5){e.path276.pts.shift()}else{dx=qx/ql*want;dz=qz/ql*want}const x1=e.x,z1=e.z;moveEnt0(e,dx,dz);if(Math.hypot(e.x-x1,e.z-z1)<want*.2)e.path276.n-=5;return}
  if(e.detour276&&e.detour276.n>0){e.detour276.n--;const a=e.detour276.a,c=Math.cos(a),s=Math.sin(a);const ndx=dx*c-dz*s,ndz=dx*s+dz*c;dx=ndx;dz=ndz}
  const x0=e.x,z0=e.z;moveEnt0(e,dx,dz);const got=Math.hypot(e.x-x0,e.z-z0);
  if(got<want*.3){e.block276=(e.block276||0)+1;if(e.block276>6){e.block276=0;if(L.grid){/* masmorra: caminho de verdade pelo grid até o alvo */const ux0=dx/want,uz0=dz/want,px=player.x-e.x,pz=player.z-e.z,pl=Math.hypot(px,pz)||1,goal=(px*ux0+pz*uz0)/pl>.85?{x:player.x,z:player.z}:{x:e.x+ux0*10,z:e.z+uz0*10},pts=expPath(e,goal);if(pts.length){e.path276={pts,n:180};return}}const r=e.r||.5,ux=dx/want,uz=dz/want,side=e.side276=-(e.side276||1);let best=null;for(const deg of [50,80,110,140,170]){for(const sg of [side,-side]){const a=sg*deg*Math.PI/180,c=Math.cos(a),s=Math.sin(a),vx=ux*c-uz*s,vz=ux*s+uz*c;if(navFree276(e.x+vx*1.6,e.z+vz*1.6,r)&&navFree276(e.x+vx*.8,e.z+vz*.8,r)){best=a;break}}if(best!=null)break}e.detour276={a:best??Math.PI,n:45}}}
  else if(!e.detour276||e.detour276.n<=0)e.block276=0}
function moveEnt0(e,dx,dz){const oldY348=COLY344,raised=e===player&&(e.air344||(e.jy||0)>.01);if(e===player){COLY344=e.jy||0;if(raised)e.worldY357=terrH(e.x,e.z)+(e.jy||0)}try{return moveEntGround348(e,dx,dz)}finally{if(raised)e.jy=e.worldY357-terrH(e.x,e.z);delete e.worldY357;COLY344=oldY348}}
function moveEntGround348(e,dx,dz){crystalUnstuck126(e);if(!Number.isFinite(dx)||!Number.isFinite(dz))return;const dist=Math.hypot(dx,dz);if(!dist)return;const limit=32,scale=dist>limit?limit/dist:1;dx*=scale;dz*=scale;const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dz))/.25));dx/=steps;dz/=steps;for(let i=0;i<steps;i++){if(kitBlocked111(e,e.x+dx,e.z+dz))break;if(L.grid&&!L.ow460){const r=(e.r||.5)*.85;if(crystalFree126(e.x+dx,e.z,e.r||.5)&&freeAt(e.x+dx,e.z,r))e.x+=dx;if(crystalFree126(e.x,e.z+dz,e.r||.5)&&freeAt(e.x,e.z+dz,r))e.z+=dz}else{e.x+=dx;e.z+=dz;pushOut(e);crystalUnstuck126(e)}}}
/* v185 (Ian): missões não dão mais ponto de habilidade; dão a Bênção da Fenda: +8% de velocidade e cura 1% da vida por segundo por 10 min de jogo. */
function boon184(){return run&&run.boon184>(run.playT184||0)?1:0}
function giveBoon184(min){run.playT184=run.playT184||0;run.boon184=Math.max(run.boon184||0,run.playT184)+min*60;floater(player.x,player.z,'BÊNÇÃO DA FENDA','#7fe0ff',true);toast('<b>[NARRADOR]</b> Bênção da Fenda: +8% de velocidade e cura 1% da vida por segundo por '+Math.round((run.boon184-run.playT184)/60)+' min.',5000)}
function movementSpeed(raw){if(!Number.isFinite(raw))return 0;return Math.max(0,CFG.moveLimit?Math.min(raw,6.4*CFG.moveCap/100):raw)}
// v155 (Ian): Arqueiro sem arco arremessa a flecha com a mão, mais devagar, até equipar um arco.
function bareArcher155(){return !basicIsMagic()&&basicAttackClass()?.wep==='bow'&&!MAGIC_CLS.includes(basicAttackId())&&!hasBow259()&&run.equip.w?.kind155!=='firearm';}
/* v270 (Ian): só fica 60% mais lento quem ataca à distância (arqueiro, magos) SEM nenhuma arma; arma de outro tipo e o assassino não sofrem */function slowUnarmed270(){const c=basicAttackClass();return !run.equip.w&&!!(c?.ranged||c?.basicRanged)&&c.wep!=='dagger'}
function attackTiming(third){const factor=statsBonus().atk,desired=(third?.46:.3)*(Number.isFinite(factor)&&factor>0?factor:1)*(slowUnarmed270()?1.6:1)*(typeof passiveSpd327==='function'?passiveSpd327():1),interval=Math.max(.05,desired);return {interval,damage:interval/desired}}
function movementSettings(){return '<div class="sec">VELOCIDADE DE MOVIMENTO</div><label><input id="moveLimit" type="checkbox" '+(CFG.moveLimit?'checked':'')+' onchange="CFG.moveLimit=this.checked;applyCfg();cfgView()"> <span class="tipi" style="cursor:help" data-tip154="Limita a corrida e a montaria. 100% é a velocidade inicial.">Limitar minha velocidade de movimento</span></label><label for="moveCap">Limite: <span id="moveCapValue">'+CFG.moveCap+'%</span></label><input id="moveCap" aria-label="Limite de velocidade de movimento" type="range" min="50" max="400" step="10" value="'+CFG.moveCap+'" '+(!CFG.moveLimit?'disabled':'')+' oninput="CFG.moveCap=+this.value;document.getElementById(&quot;moveCapValue&quot;).textContent=this.value+&quot;%&quot;;applyCfg()" style="width:100%">'}

function los(x1,z1,x2,z2){if(!L.grid)return true;const n=Math.ceil(Math.hypot(x2-x1,z2-z1));for(let i=1;i<n;i++){const t=i/n;if(!gfree(x1+(x2-x1)*t,z1+(z2-z1)*t))return false}return true}
const inCity=(x,z)=>{if(L.mode!=='world')return false;const n=nearestCity(x,z);return n.d<36*CITYK&&!cityFallen(n.c)};

