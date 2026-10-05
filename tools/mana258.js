/* Ian: mana extra amplia a reserva; apenas melhorar a habilidade aumenta seu custo. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Mana258=factory()})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const finite=(n,fallback=0)=>Number.isFinite(Number(n))?Number(n):fallback;
 function rank(value){return Math.max(0,Math.min(10,Math.floor(finite(value))))}
 function cost(base,improvements=0){const b=Math.max(0,finite(base));return b?Math.ceil(Math.round(b*(1+.1*rank(improvements))*1e8)/1e8):0}
 function regeneration(level,maximum,resting=false){const l=Math.max(1,Math.min(2000,Math.floor(finite(level,1)))),m=Math.max(0,finite(maximum));return .008*(60+3*l)+.002*m+(resting?.06*m:0)}
 return Object.freeze({rank,cost,regeneration});
});
