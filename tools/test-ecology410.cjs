// v456: confere se todas as 200 criaturas do Bestiário (61 espécies × normal/Fendida/Abissal + 4 inéditas da Fenda + 13 chefes = 200)
// têm perfil de ecologia, tática do Livro Oficial, regra de escape e reação à isca LURE_FOOD. Uso: node tools/test-ecology410.cjs
const fs=require('fs'),path=require('path'),assert=require('assert');
const dir=__dirname,read=f=>fs.readFileSync(path.join(dir,f),'utf8');
const lore=read('bestiary294.js').split('const LORE294={')[1].split('\n};')[0];
const bases=[...lore.matchAll(/^ (\w+):\[/gm)].map(m=>m[1]);
assert.strictEqual(bases.length,61,'61 espécies base no Bestiário');
global.KINDS={};for(const k of bases){KINDS[k]={n:k};KINDS[k+'_f']={baseKind:k,variant:'f'};KINDS[k+'_a']={baseKind:k,variant:'a'}}
for(const k of ['olhoerrante','arraia','arauto','semente'])KINDS[k]={n:k,inedita309:true};
const Eco=require('./ecology410.js');
const bossNames=Object.keys(eval('({'+read('variants308.js').split('const BOSSLORE={')[1].split('};')[0]+'})'));
assert.strictEqual(bossNames.length,13,'13 chefes');
for(const b of bossNames)assert.ok(Eco.bossProfile('[S] '+b),'chefe com tática do Livro: '+b);
const c=Eco.coverage();
assert.strictEqual(c.total,61*3+4+13,'200 criaturas cobertas (200/200)');
assert.deepStrictEqual(c.missing,[],'nenhuma criatura sem perfil/tática/escape');
for(const r of c.rows)for(const f of r.p.f)assert.ok(Eco.FAM410[f],'família conhecida '+f);
for(const k of ['olhoerrante','arraia','arauto','semente'])assert.ok(Eco.profileOf(k),'criatura da Fenda com ecologia ativa: '+k);
// regras pedidas por Ian + LURE_FOOD
assert.ok(Eco.profileOf('sapo').honor&&Eco.profileOf('orc').honor,'Sapo Guerreiro e Orc se rendem');
assert.ok(Eco.profileOf('yetinho').leader.includes('yeti'),'filhote foge quando o yeti cai');
assert.strictEqual(Eco.profileOf('escaravelho').lure,'charge');assert.strictEqual(Eco.profileOf('mono').lure,'grab');
assert.ok(Eco.profileOf('guardiao').esc.home,'Guardião volta ao posto');
const lure=Eco.dropLure(10,10,'food',18);
assert.strictEqual(lure.type,'LURE_FOOD','Isca de Carniça cria LURE_FOOD');
console.log('ecology410 ok:',c.total,'criaturas (200/200)');
const label=Eco.FAM410;console.log(Object.entries(c.count).sort((a,b)=>b[1]-a[1]).map(([f,n])=>label[f]+': '+n).join('\n'));

