/* servos683.js — v683: "ecos" viraram Servos. Renomeia nomes antigos nos saves antes do jogo carregar. */
(()=>{const R=[['Erguer Eco','Erguer Servo'],['Domínio dos Ecos','Domínio dos Servos'],['Senhor dos Ecos','Senhor dos Servos'],['Palma dos Ecos','Palma Ressoante'],['Eco do Arquiteto','Chuva do Arquiteto'],['Eco da vida ','Vida passada ']];
try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!/^pds/.test(k))continue;let v=localStorage.getItem(k),o=v;if(!v)continue;for(const [a,b] of R)v=v.split(a).join(b);if(v!==o)localStorage.setItem(k,v)}}catch(e){}})();
