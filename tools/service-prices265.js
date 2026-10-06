(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ServicePrices265=factory()})(typeof window!=='undefined'?window:globalThis,function(){
 const H0=400,MAX=Number.MAX_SAFE_INTEGER;
 const nums=(o,k,d,min=0)=>{const v=o[k]===undefined?d:Number(o[k]);if(!Number.isFinite(v)||v<min)throw new RangeError(k);return v};
 const ints=(o,k,d,min=0)=>{const v=nums(o,k,d,min);if(!Number.isInteger(v))throw new RangeError(k);return v};
 const factor=(o,k)=>nums(o,k,1,Number.MIN_VALUE),rank=o=>factor(o,'rankFactor'),tier=o=>factor(o,'tierFactor'),slot=o=>factor(o,'slotFactor');
 function safe(v){if(!Number.isFinite(v)||v<=0)return v===Infinity?MAX:Math.max(.01,Number(v)||.01);return Math.min(MAX,v)}
 const f={
  travel:o=>H0*(.0125+.0375*Math.pow(nums(o,'km',0,0),1.35))*Math.pow(rank(o),.6),
  rest:o=>H0*.05*(1+.1*Math.min(5,ints(o,'innLevel',0,0))),elixir:o=>100,
  resurrection:o=>800*rank(o),forge:o=>120*tier(o)*slot(o),upgrade:o=>80*tier(o)*slot(o)*(ints(o,'upgrade',0,0)+1)*Math.pow(1.12,ints(o,'upgrade',0,0)),
  rune:o=>60*tier(o)*slot(o),class:o=>300*Math.pow(rank(o),.6)*Math.pow(ints(o,'classes',1,1),2),passive:o=>200*Math.pow(rank(o),.6)*Math.pow(ints(o,'passiveLevel',0,0)+1,2),
  pet:o=>2400*Math.pow(rank(o),.6),petTraining:o=>60*Math.pow(rank(o),.6)*Math.pow(ints(o,'petLevel',1,1),1.4),mount:o=>1600*Math.pow(rank(o),.6),book:o=>3200*rank(o)*(o.high?4:1),
  recruit:o=>1200*tier(o)*(1+ints(o,'candidateLevel',1,1)/100),innUpgrade:o=>1600*Math.pow(ints(o,'innLevel',0,0)+1,2),defense:o=>1200*Math.pow(ints(o,'defenseLevel',0,0)+1,2),rod:o=>H0*.5*Math.pow(ints(o,'rodLevel',1,1),2),treasureMap:o=>200*tier(o),retired:o=>1600*tier(o),guild:o=>3200*rank(o),element:o=>800*rank(o),regionalAid:o=>500,rebuild:o=>3200,gift:o=>20*Math.pow(ints(o,'affinityLevel',0,0)+1,2)
 };
 function base(kind,options){if(!Object.prototype.hasOwnProperty.call(f,kind))throw new RangeError('kind');const o=options||{};return safe(f[kind](o))}
 return {H0,base,rates:Object.keys(f),description:'base prices before local discounts, tax and priceMul; integration rounds final prices with ceil(base*multipliers).'};
});
