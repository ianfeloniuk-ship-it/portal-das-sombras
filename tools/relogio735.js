/* relogio735.js — v735: hora e data sempre à vista. Moravam em #obj, que o dialogo520 esconde desde a v532. */
(()=>{'use strict';
const el=document.createElement('div');el.id='relogio735';
el.style.cssText='position:fixed;top:calc(8px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);z-index:30;pointer-events:none;font:600 13px "Chakra Petch",sans-serif;color:#e8e2d0;text-shadow:0 1px 3px #000;white-space:nowrap;display:none';
document.body.appendChild(el);
function tick(){try{const b=document.body.classList,show=started&&!paused&&!b.contains('dlg520')&&!b.contains('story401');el.style.display=show?'block':'none';if(show)el.textContent=clock384()+' · '+data710()}catch(e){el.style.display='none'}}
setInterval(tick,500);})();
