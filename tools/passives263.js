// v265: all twelve general passives are automatic, with no equipment slots.
/* v286 (Ian): as passivas não vêm todas no nível 1 — cada uma libera num nível, com explicação. */
const PASSIVE_LV286=[3,6,10,14,18,22,26,30,35,40,45,50];
function passiveLevel286(i){return PASSIVE_LV286[i]??(50+5*(i-11))}
function selectedPassives263(){const lv=(typeof run!=='undefined'&&run&&run.level)||1;return ResourceBalance263.passives.filter((p,i)=>lv>=passiveLevel286(i)).map(p=>p.id)}
function passiveUnlockCheck286(){if(typeof run==='undefined'||!run)return;const lv=run.level||1;run.passSeen286=run.passSeen286??ResourceBalance263.passives.filter((p,i)=>lv>=passiveLevel286(i)).length;const now=ResourceBalance263.passives.filter((p,i)=>lv>=passiveLevel286(i));if(now.length>run.passSeen286){for(const p of now.slice(run.passSeen286))try{toast('<b>[PASSIVA]</b> Nova passiva ativa: <b>'+p.n+'</b> — '+p.d,4500)}catch(_){}run.passSeen286=now.length}}
function hasPassive263(id){return selectedPassives263().includes(id)}
function passiveCost263(kind,cost){return cost>0&&hasPassive263(kind+'_saver')?Math.max(1,Math.ceil(Math.round(cost*.9*1e8)/1e8)):cost}
function vigorRate263(){return ResourceBalance263.vigorRate*(hasPassive263('vigor_flow')?1.15:1)}
function resourceWait263(kind){return kind==='vigor'?(hasPassive263('vigor_focus')?1:ResourceBalance263.vigorWait):(hasPassive263('fury_hold')?9:ResourceBalance263.furyWait)}
function passiveGuard263(actor,damage){return actor===player&&actor.hp>actor.maxhp*.8&&hasPassive263('ready_guard')?damage*.92:damage}
function passiveDamage263(enemy,damage,options){return options.fromPlayer&&options.skillHit&&!options.pet&&!options.passive&&enemy.hp<=enemy.maxhp*.35&&hasPassive263('opportunist')?damage*1.08:damage}
function passiveRows263(){const lv=run.level||1,act=selectedPassives263().length;let h='<div class="sec">PASSIVAS GERAIS · '+act+' DE '+ResourceBalance263.passives.length+' ATIVAS</div><div class="sysline">Passivas funcionam sozinhas: não precisam ser equipadas e não ocupam espaços de habilidade. Cada uma é liberada num nível do personagem.<br>Descontos arredondam o custo para cima; técnicas gratuitas continuam gratuitas.</div>';ResourceBalance263.passives.forEach((p,i)=>{const L=passiveLevel286(i),on=lv>=L;h+=row((on?'':'🔒 ')+p.n,p.d,on?'<b>Ativa</b>':'<span style="color:#9fb0c4">Nível '+L+'</span>')});return h}
