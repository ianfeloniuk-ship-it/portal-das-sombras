/* v300 (Ian): Afinidade elemental — liberada no nível 55.
   Cada criatura tem fraqueza e resistência a fogo, gelo, terra e raio (pelo bioma e pelo tipo).
   Acertar a fraqueza = +30% de dano ("FRACO!"); bater no que ela resiste = −30% ("RESISTE").
   Projéteis mágicos têm elemento pelo tipo; golpes com arma usam o encantamento da arma (Mercado). */
(function(){
const LV=55,ELN={fogo:'Fogo',gelo:'Gelo',terra:'Terra',raio:'Raio'},COL={fogo:'#ff7a3a',gelo:'#8fd8ff',terra:'#c8a060',raio:'#fff36b'};
const BIO={vulcao:['gelo','fogo'],neve:['fogo','gelo'],deserto:['gelo','terra'],pantano:['raio','terra'],cristal:['terra','raio'],floresta:['fogo','terra'],flores:['fogo','raio'],campos:['raio','gelo']};
const PROF={Espectral:['raio','gelo'],Arcano:['terra','raio'],Blindado:['raio','terra'],Universal:['gelo','fogo']};
const PT={fire:'fogo',meteor:'fogo',ice:'gelo',stone:'terra',stone_lance:'terra',spark:'raio'};
try{UNLOCK.push(['elem',LV,'Afinidade elemental: fraquezas e resistências; encante a arma no Mercado'])}catch(_){}
function on(){return run&&run.level>=LV}
function aff(e){if(e.elem300)return e.elem300;let bio=null;try{bio=e.home124||biomeAt(e.x,e.z)}catch(_){}let a=null;try{a=PROF[mobAttr281(e).prof]}catch(_){}if(!a&&bio&&BIO[bio])a=BIO[bio];if(!a){const k=Object.keys(ELN);const h=[...String(e.kind||'x')].reduce((s,c)=>s+c.charCodeAt(0),0);a=[k[h%4],k[(h+2)%4]]}e.elem300={weak:a[0],res:a[1]};return e.elem300}
function hitElem(o){if(o.elem300)return o.elem300;if(o.ptype300&&PT[o.ptype300])return PT[o.ptype300];if(o.fromPlayer&&!o.skillHit){const w=run.equip&&run.equip.w;if(w&&w.elem300)return w.elem300}if(o.skillHit&&o.basicClass!=null){const c=CLASSES[o.basicClass];if(c&&c.elem)return c.elem}return null}
window.elemMul300=function(e,amt,o){try{if(!on()||!o||!o.fromPlayer)return amt;const el=hitElem(o);if(!el)return amt;const a=aff(e);if(el===a.weak){if(time>(e.ef300||0)){floater(e.x,e.z,'FRACO A '+ELN[el].toUpperCase()+'!',COL[el]);e.ef300=time+.8}return amt*1.3}if(el===a.res){if(time>(e.ef300||0)){floater(e.x,e.z,'RESISTE','#9fb0c4');e.ef300=time+.8}return amt*.7}}catch(_){}return amt};
function price(){return Math.round(60*GR[Math.min(9,rankOf())].gold)}
const mv0=mktView;mktView=function(){mv0();try{const mb=document.getElementById('mb');if(!mb)return;let h='<div class="sec">ENCANTAR ARMA · ELEMENTO</div>';
 if(!on()){h+='<div class="sysline" style="font-size:12px">Liberado no nível '+LV+'.</div>';mb.insertAdjacentHTML('beforeend',h);return}
 const w=run.equip.w;h+='<div class="sysline" style="font-size:12px">Golpes com a arma passam a ter o elemento escolhido. Contra quem é fraco a ele: <b>+30%</b> de dano. Contra quem resiste: <b>−30%</b>. Veja fraquezas no Bestiário.'+(w?' Arma atual: <b>'+safeText(w.name)+'</b>'+(w.elem300?' · <b style="color:'+COL[w.elem300]+'">'+ELN[w.elem300]+'</b>':' · sem elemento'):' Equipe uma arma primeiro.')+'</div>';
 for(const k in ELN)h+=row('<b style="color:'+COL[k]+'">'+ELN[k]+'</b>',w&&w.elem300===k?'Encantamento atual':'',btn(fmt(price())+' ouro','elem300',k,!!w&&run.gold>=price()&&w.elem300!==k));
 mb.insertAdjacentHTML('beforeend',h)}catch(_){}};
const ea0=extraActions;extraActions=function(a,v){if(a==='elem300'){const w=run.equip.w;if(!w||!ELN[v]||!on())return;const p=price();if(run.gold<p)return;run.gold-=p;w.elem300=v;toast('<b>[MERCADO]</b> '+safeText(w.name)+' encantada com <b>'+ELN[v]+'</b>.',4000);saveRun();mktView();return 'close0'}return ea0(a,v)};
/* Bestiário: mostra fraqueza e resistência (depois de 10 abates) */
const bs0=bestStats293;bestStats293=function(k){let h=bs0(k);try{if(on()&&((profile.bestiary||{})[k]||0)>=10){const fake={kind:k,x:player.x,z:player.z};const a=aff(fake);h+='<br><span style="color:var(--dim)">Fraco a <b style="color:'+COL[a.weak]+'">'+ELN[a.weak]+'</b> · resiste a <b style="color:'+COL[a.res]+'">'+ELN[a.res]+'</b></span>'}}catch(_){}return h};
window.Elem300={aff,ELN};
})();
