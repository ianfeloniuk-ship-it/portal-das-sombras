/* v666 (Ian, 28/10/2026): "3 minutos de jogo, morri 3 vezes" — começo calmo e cidade segura.
   CALMO  primeiros 30 min de jogo do personagem (e só até o nível 10): 4 Fendas por perto em vez de 12,
          Fenda que vence o tempo não solta monstros, sem Chefe Errante e sem dragão atacando a cidade.
   CIDADE dragão selvagem e Chefe Errante nunca nascem a menos de 150 m de uma cidade. */
(function(){
'use strict';
const CALMO=1800,PERTO=150;
function pt(){try{return profile&&profile.pt666||0}catch(_){return 0}}
function calmo(){try{return pt()<CALMO&&(!run||(run.level||1)<10)}catch(_){return false}}
function pertoCidade(x,z){try{const n=nearestCity(x,z);return !!(n&&n.c&&n.d<PERTO)}catch(_){return false}}
window.Inicio666={calmo,semDragao:(x,z)=>calmo()||pertoCidade(x,z),bloqueiaChefe:()=>calmo()||(typeof player!=='undefined'&&player&&pertoCidade(player.x,player.z))};
let acc=0;
setInterval(()=>{try{if(typeof started!=='undefined'&&started&&!paused&&!document.hidden&&profile&&player&&!player.dead){profile.pt666=(profile.pt666||0)+1;if(++acc>=30){acc=0;store.set('pds2_profile',profile)}}}catch(_){}},1000);
})();
