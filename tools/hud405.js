/* v405: quiet exploration HUD; complete values stay one click away. */
(()=>{
 'use strict';
 const style=document.createElement('style');style.id='hud405-style';style.textContent=`
 body.ui405 #stat{width:210px;padding:10px 12px;background:#10151de8;border:1px solid #b9955738;border-radius:7px;box-shadow:none}
 #stat .hud405-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:5px}
 #stat .hud405-top span{font-size:9px;letter-spacing:1.2px;color:#b3ada3}
 #hudDetails405{border:0;background:transparent;color:#ebc582;cursor:pointer;padding:3px 0 3px 10px;font:11px inherit;pointer-events:auto}
 #stat .bar{margin-top:6px}#stat .lbl{font-size:10px}
 body.ui405:not(.hudDetails405) #stat .hud405-detail,body.ui405:not(.hudDetails405) #stat .hud405-unused{display:none!important}
 body.ui405:not(.hudDetails405) #rk{font-size:14px;width:25px;height:25px;line-height:25px}
 body.ui405.classless405:not(.hudDetails405) #rk{display:none}
 body.ui405 #history95.collapsed{width:auto!important;min-width:120px;background:#10151dd9;border-color:#b9955738;max-width:210px}
 body.ui405 #history95.collapsed header{border:0}
 body.ui405 #quest401{right:22px;top:64px;width:248px;max-width:35vw;padding:10px 13px;font:13px/1.45 'Chakra Petch',sans-serif;box-shadow:none;border-left:2px solid #cfa768;background:#10151ddb}
 body.ui405 #quest401 small{font-size:9px;letter-spacing:.8px;margin-bottom:4px}
 body.ui405 #quest401 p{max-width:100%}
 body.ui405 #mission{display:none!important}
 body.ui405 #mm{width:126px!important;height:126px!important;right:22px;bottom:18px;border-color:#b9955755;opacity:.9}
 body.ui405 #obj{width:154px!important;right:22px!important;background:#10151dcf;font-size:10px}
 body.ui405 #rare-status103{bottom:168px!important}
 body.ui405 #btns .b[data-state="empty"]{display:none!important}
 body.ui405.classless405 #bQ,body.ui405.classless405 #bR,body.ui405.classless405 #bT,body.ui405.classless405 #bG,body.ui405.classless405 #bY,body.ui405.classless405 #bU,body.ui405.classless405 #b5{display:none!important}
 body.ui405 #notice356{background:#10151df5;border-color:#b9955755}
 body.ui405.quiet405 #stat,body.ui405.quiet405 #history95,body.ui405.quiet405 #quest401,body.ui405.quiet405 #mm,body.ui405.quiet405 #obj,body.ui405.quiet405 #tb,body.ui405.quiet405 #btns,body.ui405.quiet405 #bF,body.ui405.quiet405 #notice356,body.ui405.quiet405 #ach294,body.ui405.quiet405 #steal,body.ui405.quiet405 #ov,body.ui405.quiet405 #pad,body.ui405.quiet405 #stick{visibility:hidden!important;pointer-events:none!important}
 body.ui405.story401 #ov,body.ui405.story401 #steal,body.ui405.story401 #pad,body.ui405.story401 #stick{visibility:hidden!important}
 @media(max-width:700px){body.ui405 #stat{width:165px;padding:7px 9px}body.ui405 #quest401{top:70px;right:10px;width:180px;max-width:43vw;padding:8px;font-size:12px}body.ui405 #mm{width:100px!important;height:100px!important;right:10px}body.ui405 #obj{width:128px!important;right:10px!important}body.ui405 #history95.collapsed{top:auto!important;bottom:8px;max-width:180px}body.ui405 #history95:not(.collapsed){max-width:calc(100vw - 20px)} }
 `;document.head.appendChild(style);document.body.classList.add('ui405');
 const stat=$('stat'),top=document.createElement('div');top.className='hud405-top';top.innerHTML='<span>VIAJANTE</span><button id="hudDetails405" aria-expanded="false" aria-controls="stat">Ficha +</button>';stat.prepend(top);
 const details=$('hudDetails405');details.onclick=e=>{e.stopPropagation();const on=document.body.classList.toggle('hudDetails405');details.textContent=on?'Ficha −':'Ficha +';details.setAttribute('aria-expanded',String(on));window.Hud356?.layout()};
 // Existing bars remain the source of truth; only irrelevant rows are tucked away.
 const hp=$('hpb').parentElement,shield=$('shb').parentElement,mana=$('mpb').parentElement;
 for(const el of [$('xpbar'),$('xpt').parentElement,$('xpleft').parentElement,$('rkp'),$('gold').parentElement])el.classList.add('hud405-detail');
 const setUnused=(bar,unused)=>{bar.classList.toggle('hud405-unused',unused);bar.nextElementSibling?.classList.toggle('hud405-unused',unused)};
 if(!CFG.quietHud405){CFG.historyCollapsed95=true;CFG.quietHud405=true;store.set('pds_cfg',CFG);applyHistory95()}
 const priority=window.Hud356?.priority,push=window.Hud356?.push;
 if(priority&&push)popNews194=(html,ms)=>{if(priority(html)>=2)push(html,ms)};
 function refresh(){
  document.body.classList.toggle('quiet405',!!modalOpen);
  if(!started||!player||!profile||!run)return;
  document.body.classList.toggle('classless405',!!profile.classless);
  top.firstElementChild.textContent=profile.classless?'SEM CLASSE':'VIAJANTE';
  setUnused(shield,!(player.maxsh>0||healingShield(player)>0));
  const skills=[...(player.skills||[]),...(run.stolen||[]),...(run.fused?[run.fused]:[])];
  const usesMana=!profile.classless&&skills.some(s=>s&&!s.empty&&resourceQuote261(s).mana>0);
  setUnused(mana,!usesMana&&player.mp>=player.maxmp);
  for(const el of $('secondaryResources260').children){const k=el.dataset.resource261;el.classList.toggle('hud405-unused',!!profile.classless&&k!=='vigor')}
  // Intro401 is the single owner of quest401's title and progress text.
 }
 new MutationObserver(refresh).observe($('modal'),{attributes:true,attributeFilter:['hidden']});
 setInterval(refresh,250);refresh();
 window.Hud405={refresh};
})();
