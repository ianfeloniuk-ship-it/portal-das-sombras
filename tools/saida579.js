/* v579 (Fase A, bug 13): quem aparece dentro de um sólido (teleporte para (0,0) = centro da fonte de Aster, queda, evento) é levado ao ponto livre mais próximo.
   Antes a câmera ficava dentro do objeto (tela lavanda lisa) e o jogador não saía. */
(function(){
'use strict';
let acc=0,stuck=0;
const free=(x,z)=>{try{return worldFree(x,z,.35,terrH(x,z)+(player.jy||0)+1)}catch(e){return true}};
function eject(){
  for(let r=1;r<=24;r+=1){const n=Math.max(8,Math.round(r*6));for(let i=0;i<n;i++){const a=i/n*Math.PI*2,x=player.x+Math.cos(a)*r,z=player.z+Math.sin(a)*r;if(free(x,z)){player.x=x;player.z=z;if(typeof cam!=='undefined'){cam.x=x;cam.z=z}try{player.m.root.position.set(x,terrH(x,z),z)}catch(e){}return true}}}
  return false}
const prev=update;
update=function(dt){prev.apply(this,arguments);try{
  if(typeof player==='undefined'||!player||player.dead||typeof L==='undefined'||L.mode!=='world'||typeof paused!=='undefined'&&paused||!window.started&&typeof started!=='undefined'&&!started)return;
  acc+=dt||.016;if(acc<.5)return;acc=0;
  if(free(player.x,player.z)){stuck=0;return}
  /* só depois de 2 verificações seguidas (1 s) para não brigar com o empurrão normal de colisão */
  if(++stuck>=2){stuck=0;eject()}
}catch(e){console.warn('Saida579',e)}};
window.Saida579={eject};
})();
