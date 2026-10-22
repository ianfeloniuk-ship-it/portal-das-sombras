// Guarda estática (Ian, 22/10/2026): a Mão do Arquiteto só pega chefões. Roda no build; falha se voltar a pegar mob comum.
const fs=require('fs'),assert=require('assert');
const r=fs.readFileSync(__dirname+'/reclaim372.js','utf8'),l=fs.readFileSync(__dirname+'/loot353.js','utf8'),c=fs.readFileSync(__dirname+'/../src/core/370-v281.js','utf8');
const m=r.match(/function claimEnemy\(e\)\{[\s\S]*?\n(?=return\{start)/);assert(m,'claimEnemy não achado');
assert(/if\(!e\.isBoss\)\{Loot353\.settle\(r\)/.test(m[0]),'claimEnemy tem de assentar (sem Mão) tudo que não é chefe');
assert(!/isIntroTutorial/.test(m[0]),'claimEnemy não pode abrir exceção para o tutorial/mob comum');
assert(/function reclaim\(r\)\{[^]*?if\(!r\.boss513\)\{settle\(r\);return;\}/.test(l),'loot353.reclaim tem de exigir boss513');
assert(/function start\(a,r\)\{if\(!r\?\.boss513/.test(r),'Reclaim372.start tem de exigir boss513');
assert(/function join\(j,a,r\)\{if\(!r\?\.boss513/.test(r),'Reclaim372.join tem de exigir boss513');
assert(/boss513:!!e\.isBoss/.test(l),'boss513 vem só de e.isBoss');
console.log('mao-so-chefes ok');
