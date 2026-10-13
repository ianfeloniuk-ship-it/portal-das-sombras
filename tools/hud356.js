/* Navigation stays with the map. Every notification remains in the existing history. */
window.Hud356=(()=>{
 const style=document.createElement('style');style.textContent=`
 body #obj{box-sizing:border-box;left:auto!important;right:8px;transform:none;max-width:none;width:170px;white-space:pre-line;font-size:10px;line-height:1.35;padding:5px 7px;text-align:left;box-shadow:none;overflow:auto;max-height:100px;pointer-events:auto}
 body:not(.pc) #obj{width:128px;font-size:10px;max-height:94px}
 #notice356{position:fixed;z-index:9;box-sizing:border-box;width:310px;max-width:calc(100vw - 16px);padding:9px 11px;background:#15121df2;border:1px solid #947453;border-radius:6px;color:#fff3e4;font:12px/1.45 'Chakra Petch',sans-serif;pointer-events:auto;box-shadow:0 2px 8px #0005}
 #notice356[data-priority="2"]{border-left:3px solid #ffb347}
 #noticeText356{max-height:110px;overflow:auto;overflow-wrap:anywhere}
 #notice356 footer{display:flex;justify-content:space-between;gap:8px;margin-top:7px}
 #notice356 button{background:transparent;border:0;color:#ffd08a;font:inherit;cursor:pointer;padding:3px 0;min-height:26px}
 `;document.head.appendChild(style);
 const box=document.createElement('section');box.id='notice356';box.hidden=true;box.setAttribute('aria-label','Aviso do jogo');box.innerHTML='<div id="noticeText356" role="status" aria-live="polite"></div><footer><button id="noticeRead356">Reler no histórico</button><button id="noticeClose356" aria-label="Fechar aviso">Fechar ×</button></footer>';document.body.appendChild(box);
 const queue=[];let current=null,remaining=0,last=performance.now(),hover=false;
 const plain=html=>{const d=document.createElement('div');d.innerHTML=historyHtml95(html);return d.textContent.trim()};
 function priority(html){const t=plain(html);if(/transbordo|invas[aã]o|defesa caindo|sem sa[ií]da|cidade.*(?:caiu|ataque)|monstros dentro|ressuscit|desbloque|nova habilidade|subiu.*n[ií]vel|bolsa cheia|invent[aá]rio cheio|fim do mundo/i.test(t))return 2;
  if(/^\[(?:NARRADOR|AFINIDADE)\]/i.test(t)||/^\[ORDEM\].*reputa[çc][aã]o/i.test(t))return 0;return 1}
 function duration(html,ms,pri){return Math.min(24000,Math.max(pri===2?10000:5000,Number(ms)||0,plain(html).split(/\s+/).length*300+1800))}
 function next(){current=queue.shift()||null;if(!current){box.hidden=true;return}remaining=duration(current.html,current.ms,current.priority);$('noticeText356').innerHTML=historyHtml95(current.html);box.dataset.priority=current.priority;box.hidden=false;layout()}
 function push(html,ms){const pri=priority(html);if(!pri)return;const key=plain(html);if(current?.key===key||queue.some(q=>q.key===key))return;
  const q={html,key,ms,priority:pri};if(current&&pri>current.priority){queue.unshift(current);current=null}
  queue.push(q);queue.sort((a,b)=>b.priority-a.priority);if(queue.length>6)queue.pop();if(!current)next()}
 function layout(){if(!started)return;const obj=$('obj'),mm=$('mm'),toolbar=$('tb').getBoundingClientRect();
  if(touch){obj.style.top=Math.max(48,toolbar.bottom+6)+'px';mm.style.top=(obj.getBoundingClientRect().bottom+6)+'px';if($('cam165'))$('cam165').style.top=(mm.getBoundingClientRect().bottom+6)+'px'}
  else{mm.style.top='';obj.style.top=Math.max(toolbar.bottom+6,mm.getBoundingClientRect().top-obj.offsetHeight-6)+'px'}
  if(touch){const mission=$('mission');$('history95').style.top=(Math.max($('stat').getBoundingClientRect().bottom,mission.hidden?0:mission.getBoundingClientRect().bottom)+6)+'px'}
  const hist=$('history95').getBoundingClientRect();box.style.left='8px';box.style.top='auto';box.style.bottom='auto';
  if(!touch)box.style.bottom=Math.max(12,innerHeight-hist.top+8)+'px';
  else{const mission=$('mission');const top=Math.max($('stat').getBoundingClientRect().bottom,mission.hidden?0:mission.getBoundingClientRect().bottom,mm.getBoundingClientRect().bottom,hist.bottom)+8;box.style.top=Math.min(top,Math.max(8,$('btns').getBoundingClientRect().top-box.offsetHeight-10))+'px';box.style.width='min(310px,calc(100vw - 16px))'}
 }
 $('noticeClose356').onclick=()=>next();$('noticeRead356').onclick=()=>{latestHistory95();next()};
 box.addEventListener('pointerenter',()=>hover=true);box.addEventListener('pointerleave',()=>hover=false);
 box.addEventListener('pointerdown',e=>e.stopPropagation());
 setInterval(()=>{const now=performance.now(),dt=Math.min(500,now-last);last=now;if(!current)return;box.hidden=!!modalOpen||!started||!!player?.dead;if(box.hidden||document.hidden||hover||box.contains(document.activeElement))return;remaining-=dt;if(remaining<=0)next()},250);
 // toast() and showSys() keep writing the full text through logNews().
 popNews194=push;addEventListener('resize',layout);
 return {layout,priority,duration,push,queue,get current(){return current},get remaining(){return remaining}};
})();
