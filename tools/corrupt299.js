/* v299 (Ian): Fendas corrompidas — liberadas no nível 50.
   Do nível 50 em diante, 15% dos portais nascem corrompidos com 1 a 3 modificadores de risco
   (escritos no rótulo). Cada modificador deixa a masmorra mais difícil e aumenta a recompensa ao fechar. */
(function(){
const LV=50,CH=.15;
const MODS={forte:{n:'Monstros fortes',d:'+50% de vida e dano dos monstros',b:.4},sempocao:{n:'Sem poção',d:'poções não funcionam',b:.3},frenesi:{n:'Frenesi',d:'monstros 30% mais rápidos',b:.25},semcura:{n:'Sem regeneração',d:'a vida não se recupera sozinha',b:.25}};
try{UNLOCK.push(['corrupt',LV,'Fendas corrompidas: portais com riscos escolhidos e recompensas maiores'])}catch(_){}
function active(){return typeof L!=='undefined'&&L.mode==='dungeon'&&L.gate&&L.gate.corrupt299}
function has(m){const c=active();return !!c&&c.includes(m)}
function bonus(c){return c.reduce((a,m)=>a+(MODS[m]?.b||0),0)}
function txt(c){return c.map(m=>MODS[m].n).join(' · ')}
const ng0=newGate;newGate=function(){const g=ng0.apply(this,arguments);try{if(g&&run&&run.level>=LV&&!g.secret&&!g.red&&!g.inverse&&!g.time&&!g.anchor221&&!g.custom&&Math.random()<CH){const ks=Object.keys(MODS).sort(()=>Math.random()-.5);g.corrupt299=ks.slice(0,1+Math.floor(Math.random()*3))}}catch(_){}return g};
if(window.Rift131&&Rift131.label){const lb0=Rift131.label;Rift131.label=function(g,text){if(g&&g.corrupt299)text='CORROMPIDA · '+text+' · +'+Math.round(bonus(g.corrupt299)*100)+'%';return lb0.call(this,g,text)}}
const up0=usePot;usePot=function(){if(has('sempocao')){toast('<b>[FENDA CORROMPIDA]</b> Poções não funcionam aqui.',2500);return}return up0.apply(this,arguments)};
const nr0=naturalRegen;naturalRegen=function(P,safe){const r=nr0(P,safe);if(has('semcura'))r.hp=0;return r};
let lastGate=null;
setInterval(()=>{try{const c=active();if(!c){lastGate=null;return}
 if(lastGate!==L.gate){lastGate=L.gate;toast('<b>[FENDA CORROMPIDA]</b> '+c.map(m=>MODS[m].n+' ('+MODS[m].d+')').join(' · ')+'. Feche a fenda para ganhar <b>+'+Math.round(bonus(c)*100)+'%</b> de ouro e XP extra.',8000)}
 for(const e of enemies){if(e.cor299||e.ally||e.dead)continue;e.cor299=1;if(c.includes('forte')){e.hp*=1.5;e.maxhp*=1.5;e.dmg*=1.5}if(c.includes('frenesi')&&Number.isFinite(e.speed))e.speed*=1.3}}catch(_){}},400);
const ld0=leaveDungeon;leaveDungeon=function(toCity){try{const c=active();if(c&&L.bossDead&&!L.failed103){const b=bonus(c),gr=Math.min(9,L.gate.rank||0),gold=Math.round(80*GR[gr].gold*(1+b)*c.length);run.gold+=gold;gainXp(Math.round(xpNeed()*.12*c.length*(1+b)),'quest');profile.corrupt299=(profile.corrupt299||0)+1;setTimeout(()=>{try{toast('<b>[FENDA CORROMPIDA]</b> Fechada com '+c.length+' risco'+(c.length>1?'s':'')+': +'+fmt(gold)+' de ouro e XP extra.',6000)}catch(_){}},800)}}catch(_){}return ld0.apply(this,arguments)};
window.Corrupt299={MODS,active};
})();
