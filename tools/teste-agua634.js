/* v634: atalho de teste da água viva, sem botão na tela. No console do navegador (F12):
   Primeva.testeEnchente('rio')  ou  Primeva.testeEnchente('lago')  -> leva ao rio/lago fundo mais perto, monta fogueira, barraca,
   carrinho e um despojo na margem, faz chover forte e acelera a enchente (x12). Primeva.testeEnchente.fim() para a chuva
   (a água baixa); Primeva.testeEnchente.estado() mostra nível, enchente e o que foi levado. */
(function(){
 'use strict';
 const P=window.Primeva=window.Primeva||{};
 const sleep=t=>new Promise(r=>setTimeout(r,t));
 let timer=null,base=null;
 function acharRio(){const rv=riverNear239(player.x,player.z+100);const w=riverWidth351(rv.b,player.z+100);return {x:rv.x,z:player.z+100,half:w/2,fl:true}}
 function acharLago(){const cx=Math.round(player.x/CH),cz=Math.round(player.z/CH);let best=null;
  for(let i=-80;i<=80;i++)for(let j=-80;j<=80;j++){const l=lakeAt239(cx+i,cz+j);if(l&&!['neve','cristal'].includes(biomeAt(l.x,l.z))){const d=Math.hypot(l.x-player.x,l.z-player.z);if(!best||d<best.d)best={x:l.x,z:l.z,half:l.r,d}}}
  return best}
 async function testeEnchente(onde){
  if(!started||L.mode!=='world')return 'Entre no mundo (fora de masmorra) antes.';
  onde=onde==='lago'?'lago':'rio';const s=onde==='lago'?acharLago():acharRio();if(!s)return 'Nenhum lago achado perto.';
  player.x=s.x+(onde==='lago'?0:0);player.z=s.z;await sleep(2500); // o relevo do leito so existe perto do jogador
  const ex=s.x+s.half+1.2; // margem seca logo ao lado da agua
  const px=(z,off)=>{if(onde==='lago')return s.x+s.half+off;const rv=riverNear239(s.x,z);return rv.x+riverWidth351(rv.b,z)/2+off}; // cada item na margem do rio no proprio z
  const S=Surv437.S();S.built=(S.built||[]).filter(b=>!/^t634/.test(b.uid));
  S.built.push({uid:'t634f',kind:'fogueira',x:px(s.z-3,.8),z:s.z-3,fuel:6},{uid:'t634a',kind:'abrigo',x:px(s.z+3,1.2),z:s.z+3});
  run.cart437=Object.assign(run.cart437||{},{built:true,pulling:false,onBoat440:null,x:px(s.z,.8),z:s.z,rot:0,inv:run.cart437?.inv||{},spoil:run.cart437?.spoil||{}});
  try{Cart437.moveTo630(px(s.z,.8),s.z)}catch(_){}
  const fake={name:'Lobo (teste)',x:px(s.z+6,1),z:s.z+6,loot353:[{type:'gold',n:25,id:'t634'}]};Loot353.create(fake);
  player.x=px(s.z,8);player.z=s.z;
  base={onde,s,ex,tent:[px(s.z+3,1.2),s.z+3],cart:[px(s.z,.8),s.z],loot:[fake.x,fake.z],fake};
  RAIN626.fast=12;clearInterval(timer);timer=setInterval(()=>{if(WX.type!=='rain'){WX.type='rain';}WX.t=9999;paused=false},500);
  toast('<b>[TESTE]</b> '+onde.toUpperCase()+': chuva forte x12. Espere ~20 s e veja a água subir, o chão virar lama e a fogueira apagar.',7000);
  return 'ok: '+onde+' em ('+Math.round(s.x)+', '+Math.round(s.z)+')'}
 testeEnchente.fim=function(){clearInterval(timer);WX.type='clear';WX.t=60;RAIN626.fast=12;return 'chuva parada; a agua baixa (x12). Primeva.testeEnchente.estado() acompanha.'};
 testeEnchente.estado=function(){const b=base,S=Surv437.S(),f=S.built.find(x=>x.uid==='t634f'),a=S.built.find(x=>x.uid==='t634a'),c=run.cart437;
  const rec=Loot353.records().find(r=>b&&r.entries.some(e=>e.id==='t634'));
  const d=(x,z,o)=>o?Math.round(Math.hypot(x-o[0],z-o[1])*10)/10:null;
  return {acc:+RAIN626.acc.toFixed(2),nivel:+RAIN626.rise.value.toFixed(2),enchente:+RAIN626.flood.value.toFixed(2),fogueira_fuel:f&&+f.fuel.toFixed(1),barraca_m:a&&d(a.x,a.z,b.tent),carrinho_m:c&&d(c.x,c.z,b.cart),despojo_m:rec&&d(rec.x,rec.z,b.loot),margem:(()=>{try{const q=EcoGrid.getCellAt(b.ex,b.s.z);return q&&{umidade:q.umidade,fertilidade:q.fertilidade}}catch(_){}})()}};
 P.testeEnchente=testeEnchente;
})();
