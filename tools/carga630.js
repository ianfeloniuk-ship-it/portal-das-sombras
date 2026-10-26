/* v630: o three r128 compila shaders de forma síncrona no 1º desenho. Em vez de congelar o título,
   mostra a tela CARREGANDO MUNDO e só solta o jogador quando os quadros ficam estáveis. */
(()=>{
 if(typeof startGame!=='function')return;
 const orig=startGame;let busy=false,go=false;
 const ov=document.createElement('div');
 ov.style.cssText='position:fixed;inset:0;z-index:99999;background:#0b0a10;color:#e8dcc0;display:none;align-items:center;justify-content:center;flex-direction:column;font:700 22px serif;letter-spacing:3px;pointer-events:all';
 ov.innerHTML='<div>CARREGANDO MUNDO…</div><div id="carga630t" style="font:14px sans-serif;opacity:.6;margin-top:10px;letter-spacing:1px">preparando o chão, a água e as luzes</div>';
 document.body.appendChild(ov);
 function release(){
  let good=0,n=0,t0=performance.now(),last=t0;
  (function f(){const now=performance.now(),dt=now-last;last=now;n++;
   good=dt<110?good+1:0;
   if((good>=30&&n>40)||now-t0>15000){ov.style.display='none';window.CARGA630.ms=Math.round(now-t0);return}
   requestAnimationFrame(f)})();
 }
 window.CARGA630={ms:0};
 startGame=function(){
  if(go)return orig();
  if(started||busy)return;
  busy=true;ov.style.display='flex';
  requestAnimationFrame(()=>setTimeout(()=>{
   go=true;try{orig()}catch(e){ov.style.display='none';throw e}finally{go=false;busy=false}
   if(started)release();else ov.style.display='none';
  },60));
 };
})();
