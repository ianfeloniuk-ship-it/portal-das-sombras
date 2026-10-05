(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./balance-rpg.js'));
 else root.MonsterBalance=factory(root.RpgBalance);
})(typeof self!=='undefined'?self:this,function(balance){
 'use strict';
 if(!balance)throw Error('RpgBalance é obrigatório para MonsterBalance');
 const levels=[1,8,20,35,55,80,120,180,220,260],weapons=[6,14,30,60,110,190,320,520,680,850];
 // Mago Elemental legado excluído. Mediana das 20 classes existentes.
 const classIds=[0,1,2,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
 const cache=new Map();
 function median(a){a.sort((x,y)=>x-y);return (a[9]+a[10])/2;}
 function reference(level){
  if(!Number.isSafeInteger(level)||level<1)throw RangeError('Nível inválido');
  if(cache.has(level))return cache.get(level);
  let tier=0;levels.forEach((l,i)=>{if(level>=l)tier=i;});
  const next=Math.min(9,tier+1),f=next===tier?0:(level-levels[tier])/(levels[next]-levels[tier]);
  const weapon=weapons[tier]+f*(weapons[next]-weapons[tier]);
  const classes=classIds.map(id=>balance.baseStats(level,id)),points=level-1;
  // Referência fixa de projeto: 75% dos pontos ofensivos, 25% em vitalidade.
  const attack=median(classes.map(c=>Math.max(c.physical,c.magic)))+.75*points*(2+level/25)+1.3*weapon;
  const hp=median(classes.map(c=>c.hp))+.25*points*(15+8*level/25);
  // Combo real 1+1+1,8 em 0,3+0,3+0,46 s; 55% de aproveitamento esperado.
  const out=Object.freeze({level,attack,hp,dps:attack*(3.8/1.06)*.55,weapon});
  if(cache.size>=2048)cache.clear();cache.set(level,out);return out;
 }
 function cycle(K){
  const cd=Number.isFinite(K.atkCd)?K.atkCd:1.4,wind=Number.isFinite(K.wind)?K.wind:.5;
  const ranged=K.ai==='ranged'||K.ai==='wraith';
  return Math.max(.1,cd+wind+(K.ai==='lunge'?.45:ranged?.25:.3));
 }
 function species(K,extra){
  // Objetos de puzzle têm orçamento próprio e não são criaturas comuns.
  if(extra.statue||extra.totem)return {hp:K.hp,damage:K.dmg};
  if(extra.isBoss)return {hp:38*8,damage:9*1.6*cycle(K)*.65};
  const hitMultiplier=K.ai==='lunge'?1.2:K.ai==='slam'?1.3:1;
  const rangedBudget=K.ai==='wraith'?.7:K.ai==='ranged'?.85:1;
  return {hp:38*Math.sqrt(Math.max(0,K.hp)/38),damage:K.dmg===0?0:9*Math.sqrt(Math.max(0,K.dmg)/9)*cycle(K)/hitMultiplier*rangedBudget};
 }
 return Object.freeze({version:2,reference,species,cycle});
});
