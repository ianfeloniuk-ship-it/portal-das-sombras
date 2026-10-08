/* v332: XP de missão pelo nível do jogador com limite de 1 nível por entrega; Conspirar com dois canais de dano. Rodar: node tools/verify-v333.cjs */
const fs=require('fs'),assert=require('assert/strict');
const B=require('./balance-rpg.js'),C=require('./conspiracy333.js');
const html=fs.readFileSync('game.html','utf8'),sw=fs.readFileSync('sw.js','utf8');let checks=0;const test=(n,fn)=>{fn();checks++;console.log('PASS '+n)};
const G_LEVELS=[1,8,20,35,55,80,120,180,220,260];

test('missão de ranque S entregue no nível 1 paga XP de nível 1',()=>{
  for(const type of ['kill','clear','pvp','elite','boss','extract','daily','night','story_tower']){
    const budget=B.questReward({type,level:260,count:type==='kill'?110:4});
    assert(budget.xp>10000,type+' antigo '+budget.xp);
    const now=B.questXpAt(budget,1);
    assert.equal(now,Math.max(1,Math.round(B.xpNeed(1)*.07*budget.minutes*budget.difficulty)));
    assert(now<budget.xp/50,type+' '+now);
  }});
test('XP de missão cresce com o nível de quem entrega',()=>{const b=B.questReward({type:'kill',level:1,count:20});let last=0;for(const l of G_LEVELS){const x=B.questXpAt(b,l);assert(x>last);last=x}});
test('uma entrega nunca passa de 1 nível, em qualquer nível e sobra de barra',()=>{
  for(let level=1;level<=300;level+=7)for(const frac of [0,.3,.99]){
    const need=B.xpNeed(level),xp=Math.floor(need*frac),got=B.questXpCap(1e9,need,xp);
    assert.equal(got,need-xp);let l=level,x=xp+got,ups=0;while(x>=B.xpNeed(l)){x-=B.xpNeed(l);l++;ups++}
    assert.equal(ups,1);assert.equal(x,0);
  }
  assert.equal(B.questXpCap(40,104,0),40);assert.equal(B.questXpCap(0,104,0),0);assert.equal(B.questXpCap(NaN,104,0),0);});
test('jogo usa a trava e o recálculo',()=>{
  assert(html.includes("return source==='quest'?RpgBalance.questXpCap(total,xpNeed(),run.xp):total}"));
  assert(html.includes('return questXpNow332(q.xpBudget262)}'));assert(html.includes('return questXpNow332(st?.xpBudget262||'));
  assert(html.includes('Object.assign(run,keep);clearMissionsOnDeath332();ensureRun();'));
  assert.equal(html.split('QUEST_XP_RULE332').length-1,4);
  assert(html.includes('calibrado pelo nível atual do Transmigrador e possui limite de 1 avanço de nível por entrega.'));});

test('canais de dano não se misturam',()=>{
  const phys=[{atk:40,pen:5,type:'phy'},{atk:40,pen:5,type:'phy'},{atk:40,pen:5,type:'phy'}];
  assert.deepEqual(C.jointDamage(phys,{res:80,esp:0,von:20}),{phy:35,mag:0,total:35,sums:{phyAtk:120,phyPen:15,magAtk:0,magPen:0}});
  // penetração mágica e ataque mágico não ajudam o canal físico
  const mixed=[{atk:60,pen:0,type:'phy'},{atk:60,pen:500,type:'mag'}];
  const r=C.jointDamage(mixed,{res:100,esp:10,von:0});assert.equal(r.phy,0);assert.equal(r.mag,60);assert.equal(r.total,60);
  // somando tudo num canal só o físico passaria (120 > 100): a regra impede
  assert.equal(C.jointDamage([{atk:60,pen:0,type:'phy'},{atk:60,pen:0,type:'mag'}],{res:100,esp:100,von:0}).total,0);
  // Vontade (já em metade) vale contra os dois canais
  assert.equal(C.jointDamage(mixed,{res:0,esp:0,von:30}).total,30+60);
  assert.equal(C.jointDamage([],{res:1,esp:1,von:1}).total,0);});
test('um monstro sozinho que dá 0 continua dando 0; o grupo passa',()=>{
  const m={atk:50,pen:10,type:'phy'},def={res:90,esp:0,von:0};
  assert.equal(C.jointDamage([m],def).total,0);assert.equal(C.jointDamage([m,m],def).total,30);assert.equal(C.jointDamage([m,m,m],def).total,90);});
test('3 golpes seguidos sem dano disparam; dano ou pausa longa zeram',()=>{
  let s=0;s=C.nextStreak(s,-99,10,0);s=C.nextStreak(s,10,11,0);assert.equal(s,2);s=C.nextStreak(s,11,12,0);assert.equal(s,C.CFG.hits);
  assert.equal(C.nextStreak(2,11,12,7),0);assert.equal(C.nextStreak(2,11,11+C.CFG.streakWindow+.1,0),1);});
test('só quem acerta entra na conta, um por vez',()=>{const def={res:90,esp:0,von:0},m={atk:50,pen:10,type:'phy'},p={hits:[],applied:0};assert.equal(C.addHit(p,m,def),0);assert.equal(C.addHit(p,m,def),30);assert.equal(C.addHit(p,{atk:40,pen:0,type:'mag'},def),40);assert.equal(p.applied,70);assert.equal(p.hits.length,3);const q={hits:[],applied:0};C.addHit(q,m,def);assert.equal(q.applied,0)});
test('formação não quebra: sem código de quebra por área ou atordoamento',()=>{const s=fs.readFileSync('tools/conspiracy333.js','utf8');assert(!/breakFormation|aoeWindow|hurtEnemy/.test(s));assert.equal(C.BROKEN,undefined)});
test('regras pedidas: 3 golpes, 8,5 m, 1,8 s',()=>assert.deepEqual([C.CFG.hits,C.CFG.radius,C.CFG.channel],[3,8.5,1.8]));
test('script e versão integrados',()=>{
  assert(html.includes('<script src="tools/conspiracy333.js?v=335"></script>'));assert(sw.includes("const V='pds-v335'"));
  for(const f of ['tools/conspiracy333.js?v=335','tools/balance-rpg.js?v=332','tools/bestiary324.js?v=335'])assert(sw.includes('"'+f+'"'),f);
  assert(fs.readFileSync('tools/bestiary324.js','utf8').includes(C.TIP));});
test('passivas gerais: 12 até o nível 50 e 10 do 55 ao 100',()=>{
  const p263=fs.readFileSync('tools/passives263.js','utf8'),p327=fs.readFileSync('tools/passives327.js','utf8');
  assert(p263.includes('PASSIVE_LV286=[3,6,10,14,18,22,26,30,35,40,45,50]'));assert(p327.includes('const LV=[55,60,65,70,75,80,85,90,95,100]'));
  for(const n of ['Golpe Resoluto','Contra-Fluxo','Caçador de Marcas','Desgaste','Último Fôlego'])assert(p327.includes(n),n);});
console.log(checks+' checks OK');
