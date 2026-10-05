// v265: all twelve general passives are automatic, with no equipment slots.
function selectedPassives263(){return ResourceBalance263.passives.map(p=>p.id)}
function hasPassive263(id){return selectedPassives263().includes(id)}
function passiveCost263(kind,cost){return cost>0&&hasPassive263(kind+'_saver')?Math.max(1,Math.ceil(Math.round(cost*.9*1e8)/1e8)):cost}
function vigorRate263(){return ResourceBalance263.vigorRate*(hasPassive263('vigor_flow')?1.15:1)}
function resourceWait263(kind){return kind==='vigor'?(hasPassive263('vigor_focus')?1:ResourceBalance263.vigorWait):(hasPassive263('fury_hold')?9:ResourceBalance263.furyWait)}
function passiveGuard263(actor,damage){return actor===player&&actor.hp>actor.maxhp*.8&&hasPassive263('ready_guard')?damage*.92:damage}
function passiveDamage263(enemy,damage,options){return options.fromPlayer&&options.skillHit&&!options.pet&&!options.passive&&enemy.hp<=enemy.maxhp*.35&&hasPassive263('opportunist')?damage*1.08:damage}
function passiveRows263(){let h='<div class="sec">PASSIVAS · '+ResourceBalance263.passives.length+' ATIVAS</div><div class="sysline">Todas estas passivas funcionam juntas desde o início. Não precisam ser equipadas e não ocupam espaços de habilidades.<br>Descontos arredondam o custo para cima; técnicas gratuitas continuam gratuitas.</div>';for(const p of ResourceBalance263.passives)h+=row(p.n,p.d,'<b>Ativa</b>');return h}
