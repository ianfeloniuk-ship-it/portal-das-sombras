/* ================= OVERLAY E HUD ================= */
const v3=new THREE.Vector3();
function proj(x,y,z){v3.set(x,y+terrH(x,z),z).project(camera);return{x:(v3.x+1)/2*W,y:(1-v3.y)/2*H,ok:v3.z<1&&v3.x>-1.2&&v3.x<1.2&&v3.y>-1.2&&v3.y<1.2}}
function bar(x,y,w,f,col,name,ncol){oc.fillStyle='rgba(0,0,0,.65)';oc.fillRect(x-w/2-1,y-1,w+2,6);oc.fillStyle=col;oc.fillRect(x-w/2,y,w*clamp(f,0,1),4);if(name){oc.font='700 10px "Chakra Petch",sans-serif';oc.fillStyle=ncol||'#e8f6ff';oc.fillText(name,x,y-4)}}
function combatStatusList(e){const s=[];if(e.stun>0)s.push(['ATORD.','#ffd66e']);if(e.kitRoot111>time)s.push(['PRESO','#8af0c5']);if(e.slow>0)s.push(['LENTO','#94dfff']);const d=e.basicDots||{};if(d.burn?.t>0||d.kitFire111?.t>0)s.push(['QUEIMA','#ff9b55']);if(d.bleed?.t>0)s.push(['SANGRA','#ff7085']);if(d.venom?.t>0)s.push(['VENENO','#a8e879']);if(d.reprise?.t>0||d.rune?.t>0)s.push(['ECO','#c7a1ff']);if(e.echoMarkUntil>time)s.push(['MARCADO','#bd8bff']);return s}
function playerStatusList(p){const s=[];if(window.Cogu348&&Cogu348.asleep(p))s.push(['SONO','#bed3ff']);if(p.slowT>0)s.push(['LENTO','#94dfff']);if(p.bleedT>0)s.push(['SANGRA','#ff7085']);if(p.stunT>0||p.stun>0)s.push(['ATORD.','#ffd66e']);if(p.kitGuard111?.until>time||p.guard>0)s.push(['DEFESA','#8bdcff']);if(p.buff>0||p.kitBuff111?.until>time)s.push(['FORÇA','#ffd66e']);if(p.stealth>0||p.kitStealth111)s.push(['FURT.','#c7a1ff']);if(p.venomUntil>time)s.push(['VENENO','#a8e879']);return s}
function drawCombatChips(items,x,y){if(!items.length)return;const shown=items.slice(0,4),extra=items.length-shown.length;oc.save();oc.font='700 9px "Chakra Petch",sans-serif';oc.textBaseline='middle';const widths=shown.map(([t])=>Math.ceil(oc.measureText(t).width)+8);if(extra)widths.push(18);const total=widths.reduce((a,b)=>a+b,0)+(widths.length-1)*3;let left=x-total/2;for(let i=0;i<widths.length;i++){const w=widths[i],label=i<shown.length?shown[i][0]:'+'+extra,col=i<shown.length?shown[i][1]:'#dbe8f2';oc.fillStyle='rgba(8,13,22,.88)';oc.fillRect(left,y-6,w,12);oc.strokeStyle=col;oc.lineWidth=1;oc.strokeRect(left+.5,y-5.5,w-1,11);oc.fillStyle=col;oc.textAlign='center';oc.fillText(label,left+w/2,y);left+=w+3}oc.restore()}
function drawOverlay(){
  oc.clearRect(0,0,W,H);if(!started)return;oc.textAlign='center';
  const P=player;
  for(const e of enemies){if(e.dead||e.sleep||e.invuln)continue;const states=combatStatusList(e);if(Math.hypot(e.x-P.x,e.z-P.z)>24)continue;if(!e.isBoss&&!e.aggro&&e.hp>=e.maxhp&&!e.rival&&!e.elite&&!states.length)continue;const p=proj(e.x,2.1*(e.m.sc||1)+.1,e.z);if(!p.ok)continue;
    if(!e.isBoss){bar(p.x,p.y,e.rival?46:34,e.hp/e.maxhp,e.rival?'#ffb84d':e.elite?'#ff8a4d':'#ff4d6a',(e.rival||e.elite)?e.name:null,e.rival?'#ffd89a':'#ffc2a0');
    {const lv=eLvl(e),th=threat(lv);oc.font='700 10px "Chakra Petch",sans-serif';oc.lineWidth=3;oc.strokeStyle='rgba(0,0,0,.85)';const t='Nv '+lv+(th?' ☠':'');const tx=p.x-(e.rival?23:17)-4;oc.textAlign='right';oc.strokeText(t,tx,p.y+4);oc.fillStyle=th||'#c9d3de';oc.fillText(t,tx,p.y+4);oc.textAlign='center'}}if(states.length)drawCombatChips(states,p.x,p.y-14)}
  for(const a of allies){const p=proj(a.x,2.6*(a.m.sc||1),a.z);if(!p.ok)continue;bar(p.x,p.y,34,a.hp/a.maxhp,a.shadow?'#b18cff':'#6ff4ff',healingShield(a)>0?(a.name||a.short||'Aliado')+' · escudo '+fmt(Math.ceil(healingShield(a))):(a.party||a.guest)?a.name:null,a.guest?'#b0ffcc':'#bff4ff')}
  if(!P.dead){const p=proj(P.x,2.35,P.z);if(p.ok){bar(p.x,p.y,44,P.hp/P.maxhp,'#6fe39a');oc.fillStyle='#4f8dff';oc.fillRect(p.x-22,p.y+6,44*clamp(P.mp/P.maxmp,0,1),2);drawCombatChips(playerStatusList(P),p.x,p.y+16)}}
  for(const n of npcs){if(n.noLabel||Math.hypot(n.x-P.x,n.z-P.z)>22)continue;const p=proj(n.x,2.35,n.z);if(!p.ok)continue;oc.font='700 10px "Chakra Petch",sans-serif';oc.lineWidth=3;oc.strokeStyle='rgba(0,0,0,.7)';const t=n.kind==='vendor'?n.name+' · '+n.sign:n.name;oc.strokeText(t,p.x,p.y);oc.fillStyle=n.col||'#e8f6ff';oc.fillText(t,p.x,p.y)}
  for(const f of floats){const p=proj(f.x,f.y+f.t*1.8,f.z);if(!p.ok)continue;const s=f.big?22:15;oc.font='700 '+s+'px "Russo One",sans-serif';oc.globalAlpha=1-Math.max(0,f.t-.5)/.4;oc.lineWidth=3;oc.strokeStyle='rgba(0,0,0,.8)';oc.strokeText(f.txt,p.x,p.y);oc.fillStyle=f.col;oc.fillText(f.txt,p.x,p.y);oc.globalAlpha=1}
  if(FX2.combo>=3){const k=Math.min(1,FX2.comboT/2.2);oc.globalAlpha=.4+.6*k;oc.font='700 '+(26+Math.min(20,FX2.combo))+'px "Russo One",sans-serif';oc.textAlign='right';oc.lineWidth=4;oc.strokeStyle='rgba(0,0,0,.8)';const t='x'+FX2.combo+' COMBO';oc.strokeText(t,W-24,H*.42);oc.fillStyle=FX2.combo>=30?'#ff5a8a':FX2.combo>=15?'#ffd54f':'#7fd8ff';oc.fillText(t,W-24,H*.42);oc.textAlign='center';oc.globalAlpha=1}
  /* PC: inimigo sob o mouse ganha anel no chão, nome e barra de vida */
  if(!touch&&!P.dead){const ap=aimPoint();if(ap){let best=null,bd=2.2;for(const e of enemies){if(e.dead||e.sleep)continue;const d=Math.hypot(e.x-ap.x,e.z-ap.z)-(e.r||.5);if(d<bd){bd=d;best=e}}
    if(best){const pr=proj(best.x,.05,best.z),pt=proj(best.x,2.3*(best.m.sc||1)+.35,best.z);if(pr.ok){oc.strokeStyle='rgba(255,90,110,.9)';oc.lineWidth=2.5;oc.beginPath();oc.ellipse(pr.x,pr.y,22*(best.r||.5)*2,9*(best.r||.5)*2,0,0,TAU);oc.stroke()}
      /* Uma barra só; elites e rivais já têm o nome, então a mira acrescenta apenas a vida. */
      const hasBar=!best.isBoss&&!best.sleep&&!best.invuln&&Math.hypot(best.x-P.x,best.z-P.z)<=24&&(best.aggro||best.hp<best.maxhp||best.rival||best.elite);
      if(!best.isBoss){const pb=proj(best.x,2.1*(best.m.sc||1)+.1,best.z);if(pb.ok){if(!hasBar)bar(pb.x,pb.y,34,best.hp/best.maxhp,'#ff4d6a');oc.font='700 11px "Chakra Petch",sans-serif';oc.lineWidth=3;oc.strokeStyle='rgba(0,0,0,.8)';const t=((best.rival||best.elite)&&hasBar?'':best.name+' · ')+fmt(Math.max(0,best.hp))+'/'+fmt(best.maxhp);const ty=pb.y-((best.rival||best.elite)&&hasBar?16:6);oc.strokeText(t,pb.x,ty);oc.fillStyle='#ffe0e6';oc.fillText(t,pb.x,ty)}}}}}
  const c=ctxTarget();if(c&&!c.label)c.label='F · '+(c.kind==='hunter'||c.kind==='citizen'?'FALAR COM '+String(c.short||c.name||'').replace(/\s*\[.*$/,'').toUpperCase():'INTERAGIR');$('bF').hidden=!c||paused;if(c)$('bF').textContent=touch?c.label.replace('F · ',''):c.label.replace(/^F · /,keyLabel(keyOf('use'))+' · ');
}
const mmc=$('mm').getContext('2d');
function drawMap(ctx,S,full){
  ctx.clearRect(0,0,S,S);ctx.fillStyle='rgba(4,12,28,.88)';ctx.fillRect(0,0,S,S);
  const P=player;ctx.textAlign='center';ctx.textBaseline='middle';
  if(L.mode==='world'){
    const k=full?S/560:2.2,cx=P.x,cz=P.z,tx=x=>S/2+(x-cx)*k,tz=z=>S/2+(z-cz)*k;
    for(const c of citiesAround(P.x,P.z,full?520:160)){ctx.strokeStyle='rgba(255,208,138,.22)';ctx.lineWidth=Math.max(2,4*k);ctx.beginPath();const e=regionCity(Math.floor(c.cx/REG)+1,Math.floor(c.cz/REG)),so=regionCity(Math.floor(c.cx/REG),Math.floor(c.cz/REG)+1);ctx.moveTo(tx(c.x),tz(c.z));ctx.lineTo(tx(e.x),tz(c.z));ctx.lineTo(tx(e.x),tz(e.z));ctx.moveTo(tx(c.x),tz(c.z));ctx.lineTo(tx(c.x),tz(so.z));ctx.lineTo(tx(so.x),tz(so.z));ctx.stroke();
      const cf=cityFallen(c);ctx.fillStyle=cf?'rgba(255,45,85,.25)':'rgba(255,179,71,.22)';ctx.strokeStyle=cf?'#ff4d6a':'#ffb347';ctx.lineWidth=2;ctx.beginPath();ctx.arc(tx(c.x),tz(c.z),Math.max(5,34*k),0,TAU);ctx.fill();ctx.stroke();
      if(full){ctx.fillStyle='#dff4ff';ctx.font='700 15px "Chakra Petch",sans-serif';ctx.fillText(c.name,tx(c.x),tz(c.z)-Math.max(5,34*k)-10)}}
    for(const g of gates){if(g.dead)continue;const col=g.secret?'#ffd070':g.red?'#ff2030':RANKS[g.rank].c;const r=full?10:6;ctx.fillStyle='rgba(0,0,0,.6)';ctx.beginPath();ctx.arc(tx(g.x),tz(g.z),r,0,TAU);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=full?3:2;ctx.stroke();
      ctx.fillStyle=col;ctx.font='700 '+(full?12:9)+'px "Russo One",sans-serif';ctx.fillText(g.secret?'?':gid(g.rank),tx(g.x),tz(g.z)+1)}
    for(const e of enemies){if(e.dead)continue;ctx.fillStyle=e.breaker?'#ff8a4d':'#ff4d6a';ctx.fillRect(tx(e.x)-1.5,tz(e.z)-1.5,3,3)}
    if(run.tmap){ctx.strokeStyle='#ffd54f';ctx.lineWidth=3;const X=tx(run.tmap.x),Z=tz(run.tmap.z);ctx.beginPath();ctx.moveTo(X-6,Z-6);ctx.lineTo(X+6,Z+6);ctx.moveTo(X+6,Z-6);ctx.lineTo(X-6,Z+6);ctx.stroke()}
    for(const e of enemies)if(e.legend&&!e.dead){const X=tx(e.x),Z=tz(e.z),r=full?9:6;ctx.fillStyle='#ffd54f';ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;ctx.lineTo(X+Math.cos(a)*rr,Z+Math.sin(a)*rr)}ctx.closePath();ctx.stroke();ctx.fill();if(full){ctx.font='700 11px sans-serif';ctx.fillStyle='#ffd54f';ctx.textAlign='left';ctx.fillText(e.name,X+11,Z+4)}}
    for(const e of enemies)if(e.world&&!e.dead){ctx.fillStyle='#ff5a1e';ctx.beginPath();ctx.arc(tx(e.x),tz(e.z),6,0,TAU);ctx.fill()}
    if(window.Civic343)try{Civic343.map(ctx,tx,tz,full)}catch(_){}
    for(const n of npcs)if(n.kind==='hunter'){ctx.fillStyle='rgba(232,246,255,.7)';ctx.fillRect(tx(n.x)-1.5,tz(n.z)-1.5,3,3)}
  }else{
    const G=L.grid,k=full?S/(G.W*G.CS):2.6,cx=full?0:P.x,cz=full?floorMapCenter():P.z,tx=x=>S/2+(x-cx)*k,tz=z=>S/2+(z-cz)*k;
    const half=S/2/k;const x0=Math.max(0,Math.floor((cx-half-G.ox)/G.CS)),x1=Math.min(G.W-1,Math.ceil((cx+half-G.ox)/G.CS)),y0=Math.max(0,Math.floor((cz-half-G.oz)/G.CS)),y1=Math.min(G.H-1,Math.ceil((cz+half-G.oz)/G.CS));
    ctx.fillStyle='rgba(255,208,138,.35)';const cs=G.CS*k+.6;
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const i=y*G.W+x;if(L.visited[i]&&G.cells[i])ctx.fillRect(tx(G.ox+x*G.CS),tz(G.oz+y*G.CS),cs,cs)}
    const vis=(x,z)=>{const i=cellIdx(x,z);return i>=0&&L.visited[i]&&(!L.floors||dungeonFloorAt(z)===L.floors.current)};
    for(const it of L.inter){if(it.hidden||!vis(it.x,it.z))continue;if(it.type==='exit'){ctx.strokeStyle=it.locked?'#ff2030':'#ffb347';ctx.lineWidth=3;ctx.beginPath();ctx.arc(tx(it.x),tz(it.z),full?9:6,0,TAU);ctx.stroke()}else if(it.type==='stairs'||it.type==='core'||it.type==='expedition'){ctx.fillStyle='#7ce6cf';ctx.beginPath();ctx.arc(tx(it.x),tz(it.z),full?5:3,0,TAU);ctx.fill()}else if(it.type==='chest'){ctx.fillStyle='#ffd54f';ctx.fillRect(tx(it.x)-4,tz(it.z)-4,8,8)}}
    for(const n of L.expedition?.nodes||[])if(n.kind==='beacon'&&!n.hidden){ctx.fillStyle='#7cf4d2';ctx.font='bold 14px sans-serif';ctx.fillText('E',tx(n.x),tz(n.z))}
    if(bossE&&!bossE.dead&&(L.combat117||L.seen.has(L.bossRoom)&&vis(bossE.x,bossE.z))){ctx.fillStyle='#ffd070';ctx.beginPath();ctx.arc(tx(bossE.x),tz(bossE.z),full?8:5,0,TAU);ctx.fill()}
    for(const e of enemies){if(e.dead||(!e.combatTarget117&&!(e.kitRevealed111>time)&&(!e.aggro||!vis(e.x,e.z))))continue;ctx.fillStyle=e.rival?'#ffb84d':'#ff4d6a';ctx.fillRect(tx(e.x)-1.5,tz(e.z)-1.5,3,3)}
  }
  const tx=full&&L.mode!=='world'?S/2+P.x*S/(L.grid.W*L.grid.CS):S/2,tz=full&&L.mode!=='world'?S/2+(P.z-floorMapCenter())*S/(L.grid.W*L.grid.CS):S/2;
  for(const a of allies){const k=full?(L.mode==='world'?S/560:S/(L.grid.W*L.grid.CS)):(L.mode==='world'?2.2:2.6);ctx.fillStyle=a.shadow?'#b18cff':'#6ff4ff';ctx.fillRect(tx+(a.x-P.x)*k-2,tz+(a.z-P.z)*k-2,4,4)}
  ctx.save();ctx.translate(tx,tz);ctx.rotate(-P.face+Math.PI);ctx.fillStyle='#ffd08a';ctx.beginPath();ctx.moveTo(0,-7);ctx.lineTo(5,5);ctx.lineTo(-5,5);ctx.closePath();ctx.fill();ctx.restore();
}
function missionPanelText(){const rows=[],safe=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),add=(title,detail)=>rows.push('<div class="objective-row"><strong>'+safe(title)+'</strong><small>'+safe(detail)+'</small></div>');
  const track=trackedObjective(),qs=run.quests||[],done=qs.filter(q=>q.got>=q.n).length,q=qs.find(q=>q.got<q.n);
  if(L.inv)add('Invasão em '+L.inv.c.name,fmtT(Math.max(0,L.inv.t))+' restantes. '+enemies.filter(e=>e.inv&&!e.dead).length+' inimigos vivos.');
  if(run.demand){const d=run.demand;add('Desafio do Oráculo','Derrote '+d.n+' monstros '+({nododge:'sem esquivar',nopot:'sem usar poções',night:'à noite'}[d.t]||'')+questTargetText262(d)+'. Progresso: '+d.got+' de '+d.n+'. '+questXpText262(d)+'.')}
  if(track){add(track.n,track.progress);rows[rows.length-1]=rows[rows.length-1].replace('class="objective-row"','class="objective-row" style="cursor:pointer" onclick="event.stopPropagation();journeyView()"')}
  if(run.daily&&!run.daily.done){const n=DAILY.filter(q=>(run.daily.p[q[0]]||0)>=q[2]).length;add('Missão diária',n+' de '+DAILY.length+' objetivos concluídos. '+questXpText262(run.daily,'daily')+'. Veja os detalhes no Diário.')}
  if(run.pts)add(run.pts===1?'1 ponto de atributo disponível':run.pts+' pontos de atributo disponíveis','Distribua na Janela de Status'+(touch?'.':' (tecla '+keyLabel(keyOf('status'))+').'));
  if(done)add(done===1?'1 missão concluída':done+' missões concluídas','Fale com Lyra, na Ordem da Fenda, para receber '+(done===1?'a recompensa.':'as recompensas.'));
  else if(q&&(!track||track.n!==q.d))add(q.d,'Progresso: '+q.got+' de '+q.n+'.');
  const count=allies.filter(a=>a.shadow&&!a.dead).length;if(count)add(count===1?'1 eco ativo':count+' ecos ativos','Ordem: '+(ORDERS.find(o=>o[0]===(run.order||'atacar'))?.[1]||'Atacar')+(touch?'.':' (tecla '+keyLabel(keyOf('orders'))+').'));
  return rows.join('');
}
let xpHudKey='';
function updateXpHud(){const key=run.level+':'+run.xp;if(key===xpHudKey)return;const xp=xpProgress(),xpText=xpProgressText(xp);$('xpb').style.width=xp.percent+'%';$('xpt').textContent=xpNumber(xp.current)+' / '+xpNumber(xp.needed);$('xpleft').textContent='Faltam '+xpNumber(xp.remaining)+' para NV '+xp.nextLevel;$('xppercent').textContent=Math.floor(xp.percent)+'%';$('xpbar').setAttribute('aria-valuenow',String(Math.floor(xp.percent)));$('xpbar').setAttribute('aria-valuetext',xpText);$('xpbar').title=xpText;xpHudKey=key}
function hud(){
  const P=player,rk=RANKS[rankOf()],c=CLASSES[profile.cls];
  $('rk').textContent=rk.id;$('rk').style.fontSize=rk.id.length>3?'12px':'';$('rk').style.color=rk.c;$('cls').textContent=className().toUpperCase();
  const nc=L.mode==='world'?nearestCity(P.x,P.z):null,pd=nc?nc.d:0;
  const where=L.special?L.special.name:L.mode==='world'?(pd<36?nc.c.name:BIO_N[biomeAt(P.x,P.z)]+' · perigo '+GR[danger(P.x,P.z)].id):L.G.th.n+' · '+L.G.id+(L.gate.red?' vermelha':'');const where2=where+(L.mode==='world'&&!L.special&&isNight()?' · noite':'');
  /* v384 (Ian): lugar, perigo e noite saem da ficha e vão para a caixa do minimapa, com relógio */$('lv').textContent='NV '+run.level+(L.mode==='world'&&!L.special?'':' · '+where2);
  $('sht').title=rareHud103();$('hpb').style.width=(100*Math.max(0,P.hp)/P.maxhp)+'%';$('shb').style.width=(P.maxsh?100*P.shield/P.maxsh:0)+'%';$('sht').textContent=fmt(Math.ceil(P.shield||0))+' / '+fmt(P.maxsh||0)+(healingShield(P)>0?' + '+fmt(Math.ceil(healingShield(P)))+' ÉGIDE ('+Math.ceil(P.healShieldUntil-time)+'s)':'');$('hpt').textContent=fmt(Math.max(0,Math.ceil(P.hp)))+' / '+fmt(P.maxhp)+(P.venomUntil>time&&P.venomCharges>0?' · VENENO '+P.venomCharges+' ('+Math.ceil(P.venomUntil-time)+'s)':'');
  resourceHud260();
  updateXpHud();$('gold').textContent=fmt(run.gold);
  const mi=minionAllies().length,ec=allies.filter(a=>a.shadow&&!a.dead).length,showArmy=mi>0||ec>0||canArise()||P.skills.some(s=>s&&['summon','minionbuff'].includes(s.t));$('armyline').style.display=showArmy?'flex':'none';$('ecot').textContent='ECOS '+ec+'/'+shadowCap();$('armyt').textContent='INVOCADOS '+mi+'/'+summonCap();
  const ri=rankOf();
  $('rkp').textContent=ri<9?'Prova de Rank '+RANKS[ri+1].id+': nível '+run.level+'/'+GR[ri+1].lvl:'Rank máximo';
  $('bZ').hidden=profile.rank!==9;
  for(const [id,s] of[['bQ',P.skills[0]],['bR',P.skills[1]],['bT',P.skills[2]],['bG',P.skills[3]],['bY',P.skills[4]],['bU',P.skills[5]],['b5',P.skills[6]],['bZ',profile.rank===9?(run.sovSk||SOV_SK):null]]){if(!s)continue;const b=$(id);b.querySelector('.nm').textContent=s.n;renderSkillButton(b,s,P.mp);const tip=skillButtonTip(s);if(b.title!==tip)b.title=tip}
  if($('stCombo261'))renderSkillButton($('stCombo261'),comboSkill261(),P.mp);if(run.fused&&$('stF'))renderSkillButton($('stF'),run.fused,P.mp);run.stolen.forEach((s,i)=>{const b=$('st'+i);if(b)renderSkillButton(b,s,P.mp)});
  $('potn').textContent=run.pots;$('bH').title=potionDescription();$('bH').setAttribute('aria-label','Poção de vida. '+potionDescription());
  let obj='';
  if(L.mode==='world'){if(pd<36)obj='';else{let bg=null,bd=1e9;for(const g of gates){if(g.dead)continue;const d=Math.hypot(g.x-P.x,g.z-P.z);if(d<bd){bd=d;bg=g}}obj=bg?(bg.secret?'Portal desconhecido':'Portal rank '+GR[bg.rank].id+(bg.red?' vermelho':''))+' · '+Math.round(bd)+' m\n'+nc.c.name+' · '+Math.round(pd)+' m':'Explore'}}
  else if(L.special)obj=L.special.msg;
  else obj=(affN(L.gate).length?'['+affN(L.gate).join(', ')+'] ':'')+(L.brk?'TRANSBORDO DA FENDA · sobreviveu '+fmtT(L.brk.t)+' · recorde '+fmtT(profile.brkBest||0)+' · a saída está aberta':L.bossDead?'Transbordo em '+fmtT(L.closeT)+' · minere, abra o baú e saia (ou fique e sobreviva)':'Salas '+L.seen.size+'/'+L.rooms.length+' · encontre o guardião'+(L.gate.red?' · SEM SAÍDA':''));
  if(L.combat117&&!L.brk)obj=combatObjective117();if(L.expedition&&!L.brk)obj=expeditionObjective();if(L.defense&&!L.brk)obj=coreObjective();if(L.floors)obj='Andar '+(L.floors.current+1)+'/3 · '+(L.bossDead||L.brk?obj+' · saída no 1º andar':'encontre a escada e derrote seus defensores'+(L.floors.current===2?' · guardião neste andar':''));if(L.mode==='world'&&!L.special){const top384=clock384()+(isNight()?' · noite':'')+'\n'+where+(pd<36?' · cidade':'');obj=obj&&obj!=='Explore'?top384+'\n'+obj:top384}$('obj').textContent=obj;
  if(L.defense){const d=L.defense;$('boss').hidden=d.done||d.failed;$('bn').textContent='NÚCLEO · '+Math.ceil(d.core.hp)+' / '+Math.ceil(d.core.maxhp);$('bb').style.width=(100*d.core.hp/d.core.maxhp)+'%'}
  if(bossE&&!bossE.dead&&bossE.aggro&&(!L.floors||dungeonFloorAt(bossE.z)===L.floors.current)){$('boss').hidden=false;$('bn').textContent=bossE.name.toUpperCase()+(bossE.phase===3?' · PODER VERDADEIRO':bossE.phase===2?' · FÚRIA':'');$('bn').textContent='NV '+eLvl(bossE)+' · '+$('bn').textContent;$('bn').style.color=THREAT184[bossE.threat184||0].col||'';bossBars166(bossE)}
  const _mt=missionPanelText();
  $('bStyle').hidden=true;
  let _hm=false;try{_hm=localStorage.getItem('pds_hidemis')==='1'}catch(e){}
  if($('mission').dataset.t!==_mt){$('mission').dataset.t=_mt;$('mission').innerHTML='<span style="float:right;cursor:pointer;margin-left:6px;opacity:.7" title="Esconder (volta pelo ⚙)" onclick="try{localStorage.setItem(\'pds_hidemis\',\'1\')}catch(e){}$(\'mission\').hidden=true">✕</span>'+_mt}
  $('mission').hidden=_hm||!_mt;{const r=$('stat').getBoundingClientRect();if(r.bottom>0)$('mission').style.top=(r.bottom+6)+'px';const pcTop=!touch&&H<=W?$('tb').getBoundingClientRect().bottom+10:0;$('obj').style.top=H>W?(r.bottom+6)+'px':pcTop?pcTop+'px':'';$('boss').style.top=H>W?(r.bottom+34)+'px':pcTop?(pcTop+28)+'px':''}
  if(window.Hud356)Hud356.layout();
  drawMap(mmc,192,false);
}
function buildSteal(){const box=$('steal');box.innerHTML='';comboButton261(box);if(run.fused){const b=document.createElement('div');b.className='b';b.id='stF';b.style.borderColor='#d7b8ff';b.innerHTML='<div class="cd"></div><span class="k">'+(touch?'★':keyLabel(keyOf('fusion')))+'</span><span class="nm">'+run.fused.n+'</span>';bindBtn(b,()=>useSkill(run.fused));box.appendChild(b)}run.stolen.forEach((s,i)=>{const b=document.createElement('div');b.className='b';b.id='st'+i;b.innerHTML='<div class="cd"></div><span class="k">'+(touch?i+1:keyLabel(keyOf('absorbed'+i)))+'</span><span class="nm">'+s.n+'</span>';bindBtn(b,()=>useSkill(run.stolen[i]));box.appendChild(b)})}

