/* HUD de exploração novo (Ian, 22/10/2026: proposta aprovada «gostei»).
   Troca o painel de barras do canto por um cristal de rank com vida, mana e estamina em arcos;
   aviso de lugar no canto esquerdo («Local registrado na Ordem»), bússola em cima e XP numa linha fina embaixo.
   Só lê o estado do jogo (player, run, martialState260); não muda nenhuma regra. */
(()=>{'use strict';
const css=`@import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&display=swap');
body.hud539 #stat{visibility:hidden!important}
#exp539{position:fixed;inset:0;pointer-events:none;z-index:6;font:300 13px/1.4 "Jost","Futura","Century Gothic","Chakra Petch",sans-serif;color:#ece8df}
#exp539[hidden]{display:none}
#exp539 .cmp{position:absolute;top:calc(46px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);width:min(460px,60vw);height:26px;background:linear-gradient(90deg,transparent,#0000009c 14%,#0000009c 86%,transparent);border-top:1px solid #ffffff44;border-bottom:1px solid #ffffff44;overflow:hidden}
#exp539 .cmp i{position:absolute;top:50%;transform:translate(-50%,-50%);font-style:normal;font-size:12px;letter-spacing:.1em;color:#ddd}
#exp539 .cmp i.N{color:#fff;font-weight:500}
#exp539 .cmp .pi{font-size:13px;text-shadow:0 0 4px #000,0 0 2px #000;line-height:1}#exp539 .cmp .pi.q{font-size:17px;text-shadow:0 0 8px #ffc83c,0 0 2px #000}#exp539 .cmp .pi.en{font-size:8px;text-shadow:0 0 5px #f00}
#exp539 .cmpn{position:absolute;top:calc(74px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);font-size:12px;letter-spacing:.12em;text-transform:uppercase;text-shadow:0 1px 4px #000,0 0 2px #000;white-space:nowrap;transition:opacity .25s;opacity:0}
#exp539 .cmp .mk{width:8px;height:8px;transform:translate(-50%,-50%) rotate(45deg)}
#exp539 .found{position:absolute;left:max(24px,env(safe-area-inset-left,0px));top:calc(96px + env(safe-area-inset-top,0px));display:flex;align-items:center;gap:12px;text-shadow:0 1px 5px #000;opacity:0;transform:translateX(-24px);transition:opacity .6s,transform .6s}
#exp539 .found.show{opacity:1;transform:none}
#exp539 .found svg{width:34px;height:34px;flex:none;filter:drop-shadow(0 0 8px #47d6c4aa)}
#exp539 .found small{display:block;font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:#bff3ea}
#exp539 .found b{display:block;font:300 24px/1.1 inherit;letter-spacing:.18em;text-transform:uppercase}
#exp539 .found span{display:block;font-size:12px;color:#e6e0d4}
#exp539 .g{position:absolute;left:max(18px,env(safe-area-inset-left,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px));width:150px;height:150px;transition:opacity .6s}
#exp539 .g svg{width:100%;height:100%;overflow:visible}
#exp539 .lab{position:absolute;left:calc(max(18px,env(safe-area-inset-left,0px)) + 154px);bottom:calc(24px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:1px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;text-shadow:0 1px 3px #000,0 0 2px #000;font-variant-numeric:tabular-nums;transition:opacity .6s}
#exp539 .lab b{font-weight:500}
#exp539 .lab .h{color:#ff9c90}#exp539 .lab .m{color:#9cc4ff}#exp539 .lab .s{color:#b8e6a2}#exp539 .lab .o{color:#e9c46a}#exp539 .lab .x{color:#cfe7ff}
#exp539 .xp{position:absolute;left:0;right:0;bottom:env(safe-area-inset-bottom,0px);height:2px;background:#00000070}
#exp539 .xp i{display:block;height:100%;width:0;background:linear-gradient(90deg,transparent,#e9c46a);transition:width .3s}
@media(max-width:760px){#exp539 .g{width:118px;height:118px}#exp539 .lab{left:calc(max(18px,env(safe-area-inset-left,0px)) + 120px)}#exp539 .cmp{top:calc(64px + env(safe-area-inset-top,0px))}#exp539 .cmpn{top:calc(92px + env(safe-area-inset-top,0px))}}
@media(prefers-reduced-motion:reduce){#exp539 .found{transition:none}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const root=document.createElement('div');root.id='exp539';root.hidden=true;root.setAttribute('aria-hidden','true');
root.innerHTML='<div class="cmp"></div><div class="cmpn"></div><div class="found"><svg viewBox="0 0 34 34"><path d="M17 2 L28 17 L17 32 L6 17 Z" fill="none" stroke="#bff3ea" stroke-width="1.4"/><path d="M17 8 L23 17 L17 26 L11 17 Z" fill="#47d6c4" opacity=".7"/></svg><div><small></small><b></b><span></span></div></div><div class="g"></div><div class="lab"></div><div class="xp"><i></i></div>';
document.body.appendChild(root);document.body.classList.add('hud539');
const q=s=>root.querySelector(s);
function arc(c,r,a0,a1){const p=a=>[c+r*Math.cos(a),c+r*Math.sin(a)];const[x0,y0]=p(a0),[x1,y1]=p(a1);return 'M'+x0.toFixed(1)+' '+y0.toFixed(1)+' A'+r+' '+r+' 0 '+(a1-a0>Math.PI?1:0)+' 1 '+x1.toFixed(1)+' '+y1.toFixed(1)}
const R=d=>d*Math.PI/180;
function seg(a0,a1,p,col,r){p=Math.max(0,Math.min(1,p||0));return '<path d="'+arc(85,r,R(a0),R(a1))+'" stroke="#00000080" stroke-width="9" fill="none" stroke-linecap="round"/>'+(p>.005?'<path d="'+arc(85,r,R(a0),R(a0+(a1-a0)*p))+'" stroke="'+col+'" stroke-width="5" fill="none" stroke-linecap="round" style="filter:drop-shadow(0 0 4px '+col+')"/>':'')}
let lastG='',lastCity=null,foundT=0;
function gauge(hp,mp,sp,rk,col,lv){const k=[hp,mp,sp].map(v=>Math.round(v*60)).join(',')+rk+col+lv;if(k===lastG)return;lastG=k;
  q('.g').innerHTML='<svg viewBox="0 0 170 170"><defs><linearGradient id="rk539" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="'+col+'"/><stop offset="1" stop-color="#1d2430"/></linearGradient></defs>'+
   seg(135,315,hp,'#d4493c',70)+seg(150,300,mp,'#4f8ee0',56)+seg(165,285,sp,'#79c25e',44)+
   '<g transform="translate(85 85)"><path d="M0 -30 L22 0 L0 30 L-22 0 Z" fill="url(#rk539)" stroke="#ffffffa0" stroke-width="1"/><path d="M0 -30 L22 0 L0 0 Z" fill="#ffffff40"/><text x="0" y="7" text-anchor="middle" font-family="Jost,sans-serif" font-size="'+(rk.length>1?14:20)+'" font-weight="500" fill="#10141c">'+rk+'</text></g>'+
   '<text x="85" y="134" text-anchor="middle" font-family="Jost,sans-serif" font-size="9" letter-spacing="2" fill="#e6e0d4" style="paint-order:stroke" stroke="#000" stroke-width="2">NÍVEL '+lv+'</text></svg>'}
/* v564 (Ian, 22/10/2026): bússola como a do Skyrim — alvo da missão, lugares descobertos com ícone, não descobertos apagados, inimigos em combate */
const cityCache={seed:null,l:[]};
const ICO={cap:'♛',city:'⌂',gate:'◉',quest:'◆'};
function questTarget(){let t=null;try{t=window.Campaign327&&Campaign327.target()}catch(e){}
  if(!t)try{const st=window.Quests480&&Quests480.getState();if(st&&st.tracked&&st.active[st.tracked]&&st.active[st.tracked].targetPos)t=st.active[st.tracked].targetPos}catch(e){}
  return t&&isFinite(t.x)&&isFinite(t.z)?t:null}
function disc(key,x,z,known){const D=profile.cmp564=profile.cmp564||{};if(D[key])return true;if(known||Math.hypot(x-player.x,z-player.z)<130){D[key]=1;try{store.set('pds2_profile',profile)}catch(e){}return true}return false}
function compass(){if(typeof camera==='undefined')return;const v=new THREE.Vector3();camera.getWorldDirection(v);const head=(Math.atan2(v.x,-v.z)*180/Math.PI+360)%360;
  const m=['N','NE','L','SE','S','SO','O','NO'];let h='';for(let a=-360;a<=720;a+=45){const x=50+(a-head)/2.6;if(x<-2||x>102)continue;const k=m[((a/45)%8+8)%8];h+='<i class="'+(k==='N'?'N':'')+'" style="left:'+x+'%">'+k+'</i>'}
  const items=[];
  const rel=(tx,tz)=>{const b=(Math.atan2(tx-player.x,-(tz-player.z))*180/Math.PI+360)%360;return{d:((b-head+540)%360)-180,dist:Math.hypot(tx-player.x,tz-player.z)}};
  const add=(x,z,ico,col,name,ok,maxD,minOp)=>{const r=rel(x,z);if(r.dist>maxD||Math.abs(r.d)>128)return;
    const op=Math.max(minOp,Math.min(1,1.15-r.dist/maxD))*(ok?1:.6);items.push({d:r.d,dist:r.dist,ico,col,name,ok,op})};
  try{
    if(typeof L!=='undefined'&&L.mode==='world'){
      if(cityCache.seed!==WSEED){cityCache.seed=WSEED;cityCache.l=[];for(let rz=-2;rz<=2;rz++)for(let rx=-2;rx<=2;rx++){const c=regionCity(rx,rz);if(c)cityCache.l.push(c)}}
      for(const c of cityCache.l){const k='c'+(c.id||c.name),ok=disc(k,c.x,c.z,c.name==='Aster'||!!(profile.found539&&profile.found539[c.id])||!!(profile.visited217&&(profile.visited217[c.id]||profile.visited217['c_'+c.id])));
        add(c.x,c.z,c.capital?ICO.cap:ICO.city,c.capital?'#ffd070':'#e8e2d0',c.name,ok,ok?(c.capital?3200:2200):(c.capital?900:600),.35)}
      if(window.Lugares637)for(const s of Lugares637.known())add(s.x,s.z,s.ico,s.col,s.name,true,900,.3);/* v639: lugares descobertos no caminho */
      if(typeof gates!=='undefined')for(const g of gates){if(g.dead)continue;const k='g'+Math.round(g.x)+','+Math.round(g.z),ok=disc(k,g.x,g.z,false);
        const col=g.secret?'#ffd070':g.red?'#ff2030':(typeof RANKS!=='undefined'&&RANKS[g.rank]?RANKS[g.rank].c:'#9b6bff');
        add(g.x,g.z,ICO.gate,col,ok?(g.secret?'Portal secreto':'Portal '+(typeof gid==='function'?gid(g.rank):'')):'Local desconhecido',ok,ok?1600:300,.45)}
      for(const e of enemies){if(e.dead||!(e.aggro||e.isBoss&&e.aggro))continue;const r=rel(e.x,e.z);if(r.dist<38&&Math.abs(r.d)<128)items.push({d:r.d,dist:r.dist,ico:'●',col:'#ff3b30',name:'',ok:true,op:1,en:1})}
      const t=questTarget();if(t){const r=rel(t.x,t.z);items.push({d:Math.max(-124,Math.min(124,r.d)),dist:r.dist,ico:ICO.quest,col:'#ffe27a',name:'Objetivo',ok:true,op:Math.abs(r.d)>128?.6:1,q:1})}
    }
  }catch(e){if(!compass.w){compass.w=1;console.warn('Bussola564',e)}}
  items.sort((a,b)=>(a.q?1:0)-(b.q?1:0)||(a.en?1:0)-(b.en?1:0)||b.dist-a.dist);
  let best=null;for(const it of items){h+='<i class="pi'+(it.q?' q':'')+(it.en?' en':'')+'" style="left:'+(50+it.d/2.6)+'%;color:'+it.col+';opacity:'+it.op.toFixed(2)+(it.ok?'':';filter:grayscale(1)')+'">'+it.ico+'</i>';
    if(!it.en&&Math.abs(it.d)<7&&(!best||it.dist<best.dist))best=it}
  q('.cmp').innerHTML=h;
  const n=q('.cmpn');n.textContent=best?best.name+' · '+(best.dist>=1000?(best.dist/1000).toFixed(1).replace('.',',')+' km':Math.round(best.dist)+' m'):'';n.style.opacity=best?1:0}
function found(city){profile.found539=profile.found539||{};const first=!profile.found539[city.id];profile.found539[city.id]=1;try{store.set('pds2_profile',profile)}catch(e){}
  q('.found small').textContent=first?'Local registrado na Ordem':'Entrando em';q('.found b').textContent=city.name;q('.found span').textContent=city.name==='Aster'?'Capital-nexo · as três muralhas':'Cidade de Primeva';
  const f=q('.found');f.classList.add('show');clearTimeout(foundT);foundT=setTimeout(()=>f.classList.remove('show'),4500)}
function tick(){
  try{
    const stat=document.getElementById('stat'),show=typeof started!=='undefined'&&started&&player&&stat&&!stat.hidden&&!/(conv539|dlg520|story401)/.test(document.body.className);
    root.hidden=!show;if(!show)return;const P=player;
    const ms=typeof martialState260==='function'?martialState260():{vigor:100},vm=typeof vigorMaxR260==='function'?vigorMaxR260():100;
    const hp=Math.max(0,P.hp)/(P.maxhp||1),mp=(P.mp||0)/(P.maxmp||1),sp=(ms.vigor||0)/(vm||100);
    const rk=typeof RANKS!=='undefined'&&typeof rankOf==='function'?RANKS[rankOf()]:{id:'F',c:'#9fb0c4'};
    gauge(hp,mp,sp,rk.id,rk.c,run.level);
    const full=hp>=.999&&mp>=.999&&sp>=.999&&!(P.shield>0);q('.g').style.opacity=full?.35:1;
    const rl=(document.getElementById('resourceLabel260')?.textContent||'Mana').toLowerCase();
    q('.lab').style.opacity=full?0:1;
    q('.lab').innerHTML='<span class="h"><b>'+fmt(Math.ceil(Math.max(0,P.hp)))+'</b> vida</span>'+(P.shield>0?'<span class="x"><b>'+fmt(Math.ceil(P.shield))+'</b> escudo</span>':'')+'<span class="m"><b>'+fmt(Math.floor(P.mp||0))+'</b> '+rl+'</span><span class="s"><b>'+fmt(Math.floor(ms.vigor||0))+'</b> estamina</span><span class="o"><b>'+fmt(run.gold)+'</b> ouro</span>';
    q('.xp i').style.width=(document.getElementById('xpb')?.style.width||'0%');
    const boss=document.getElementById('boss');q('.cmp').style.visibility=q('.cmpn').style.visibility=boss&&!boss.hidden?'hidden':'visible';compass();
    if(L.mode==='world'&&typeof nearestCity==='function'){const nc=nearestCity(P.x,P.z),inside=nc.c&&nc.d<60;const id=inside?nc.c.id:null;if(id!==lastCity){lastCity=id;if(inside&&!modalOpen)found(nc.c)}}else lastCity=null;
  }catch(e){if(!tick.warned){tick.warned=1;console.warn('Explorar539',e)}}
}
setInterval(tick,120);
window.Explorar539={tick};
})();
