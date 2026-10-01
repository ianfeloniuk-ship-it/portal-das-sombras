const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('game.html','utf8');
function extract(name){const start=html.indexOf('function '+name+'(');assert(start>=0,name+' exists');const open=html.indexOf('{',start);let depth=0,quote='',escape=false;for(let i=open;i<html.length;i++){const c=html[i];if(quote){if(escape)escape=false;else if(c==='\\')escape=true;else if(c===quote)quote='';continue}if(c==='\''||c==='"'||c==='`'){quote=c;continue}if(c==='{')depth++;else if(c==='}'&&--depth===0)return html.slice(start,i+1)}throw Error('Unclosed '+name)}
const calls=[],context={time:10,healingShield:a=>a.healShield||0,oc:{save(){},restore(){},measureText:s=>({width:s.length*5}),fillRect(){},strokeRect(){},fillText(s){calls.push(s)}}};vm.createContext(context);for(const n of ['combatStatusList','playerStatusList','drawCombatChips'])vm.runInContext(extract(n),context);
const enemy={stun:.2,kitRoot111:11,slow:3,basicDots:{burn:{t:1},bleed:{t:2},venom:{t:3},rune:{t:0}},echoMarkUntil:12};assert.deepEqual(Array.from(context.combatStatusList(enemy),x=>x[0]),['ATORD.','PRESO','LENTO','QUEIMA','SANGRA','VENENO','MARCADO']);
const player={slowT:1,bleedT:2,stun:0,kitGuard111:{until:11},healShield:50,shield:0,buff:0,stealth:0,venomUntil:0};assert.deepEqual(Array.from(context.playerStatusList(player),x=>x[0]),['LENTO','SANGRA','DEFESA','ESCUDO']);
context.drawCombatChips([['ATORD.','#fff'],['PRESO','#fff'],['LENTO','#fff'],['QUEIMA','#fff'],['SANGRA','#fff'],['VENENO','#fff']],100,100);assert(calls.includes('ATORD.')&&calls.includes('QUEIMA')&&calls.includes('+2'));
console.log('PASS: inimigos/jogador exibem estados ativos, curtos e limitados a 4 chips com contador do excedente.');

