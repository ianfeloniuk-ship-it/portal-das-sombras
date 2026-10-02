// One resident family per territory/portal. Rank changes strength, not habitat.
const HABITATS124={campos:['goblins','wolves'],floresta:['goblins','wolves','mushrooms','spiders'],flores:['swarm','meadow'],pantano:['slimes','bogkin','spiders'],neve:['yetis','wolves'],cristal:['crystals'],deserto:['cacti','scarabs'],vulcao:['demons','dragons']};
const FAMILIES124={
 goblins:{label:'Clã Ferrugem',name:'Covil do Clã Ferrugem',ks:['goblin','gobShield118','gobArcher118','gobShaman118','gobBrute118'],chief:'gobBrute118',boss:'Chefe do Clã Ferrugem'},
 wolves:{label:'Lobos',name:'Covil da Matilha',ks:['lobo'],chief:'lobo',boss:'Alfa da Matilha'},
 mushrooms:{label:'Cogumelos',name:'Gruta dos Fungos',ks:['cogu','cogufuria','reicogu'],chief:'reicogu',boss:'Rei dos Fungos'},
 spiders:{label:'Aranhas',name:'Ninho das Aranhas',ks:['aranha'],chief:'aranha',boss:'Matriarca das Aranhas'},
 swarm:{label:'Enxame',name:'Colmeia do Vale',ks:['vespa','abelha','abelharainha'],chief:'abelharainha',boss:'Rainha do Enxame'},
 meadow:{label:'Feras da Pradaria',name:'Refúgio da Pradaria',ks:['passaro','coelho','alpaca','alpacaimp'],chief:'alpacaimp',boss:'Guardião da Pradaria'},
 slimes:{label:'Gosmas',name:'Brejo das Gosmas',ks:['gosma','espinhosa'],chief:'espinhosa',boss:'Gosma Ancestral'},
 bogkin:{label:'Habitantes do Brejo',name:'Cavernas Alagadas',ks:['peixinho','sapo','homempeixe'],chief:'sapo',boss:'Guardião do Brejo'},
 yetis:{label:'Yetis',name:'Covil Glacial',ks:['yetinho','yeti'],chief:'yeti',boss:'Ancião dos Yetis'},
 crystals:{label:'Construtos de Pedra',name:'Gruta de Cristal',ks:['golenzinho','golempedra','gigante'],chief:'golempedra',boss:'Colosso de Cristal'},
 cacti:{label:'Cactos',name:'Garganta dos Cactos',ks:['cactinho','cactogig'],chief:'cactogig',boss:'Cactoro Ancião'},
 scarabs:{label:'Escaravelhos',name:'Galerias das Dunas',ks:['escaravelho'],chief:'escaravelho',boss:'Guardião Escaravelho'},
 demons:{label:'Demônios',name:'Covil das Cinzas',ks:['diabrete','demon','chifrudo'],chief:'chifrudo',boss:'Senhor das Cinzas'},
 dragons:{label:'Dracônicos',name:'Ninho Vulcânico',ks:['raptor','dino','dragonete','dragaoancio'],chief:'dragaoancio',boss:'Ancião Vulcânico'}
};
const HABITAT_COLORS124={
 campos:[0x465041,0x515346,0xc69a60,0x171d22,0xe2ddc9],floresta:[0x343e34,0x3d4946,0xb59d71,0x121d20,0xd2decf],
 flores:[0x4b5940,0x515747,0xd8ba79,0x1a2322,0xe5dfc9],pantano:[0x394638,0x3c4840,0x94ad76,0x132025,0xc8d7c2],
 neve:[0x879caa,0x677e8e,0xb3d8e4,0x182832,0xe0ebef],cristal:[0x334b55,0x435763,0xa494d9,0x142129,0xd8deef],
 deserto:[0x967a51,0x776447,0xd8a052,0x282522,0xe8d2b1],vulcao:[0x3b2928,0x3c3535,0xd88a52,0x1d191e,0xdec4ad]
};
function ecoHash124(x,z){return (Math.imul(Math.floor(x/96),374761393)^Math.imul(Math.floor(z/96),668265263)^(typeof WSEED==='number'?WSEED:0))>>>0}
function familyPool124(id,rank,{melee=false}={}){
 const f=FAMILIES124[id];if(!f)return[];
 const pool=f.ks.flatMap((k,i)=>{const d=KINDS[k];if(!d)return[];const min=i===0?0:d.rk??0;return min<=rank?[{k,w:id==='goblins'?[28,19,22,15,12][i]:Math.max(8,24-i*5)}]:[]});
 const close=pool.filter(p=>!['ranged','wraith'].includes(KINDS[p.k].ai));return melee&&close.length?close:pool;
}
function worldFamily124(bio,x,z){const ids=HABITATS124[bio]||HABITATS124.campos;return ids[Math.floor(mulberry32(ecoHash124(x,z))()*ids.length)]}
function worldKinds124(rank,x,z){return familyPool124(worldFamily124(biomeAt(x,z),x,z),rank)}
function dungeonFamily124(g){
 let bio=HABITATS124[g.biome124]?g.biome124:biomeAt(g.x||0,g.z||0);if(!HABITATS124[bio])bio='campos';
 if(g.goblin118&&!HABITATS124[bio].includes('goblins'))bio='floresta';g.biome124=bio;
 const native=HABITATS124[bio];if(g.goblin118)return g.family124='goblins';
 if(String(g.family124).startsWith('rare_')&&FAMILIES124[g.family124])return g.family124;
 if(native.includes(g.family124))return g.family124;
 let ids=native;if(expeditionType(g)==='hunt'){const predators=native.filter(id=>['wolves','spiders','swarm','bogkin','yetis','scarabs','dragons'].includes(id));if(predators.length)ids=predators}
 return g.family124=ids[Math.floor(mulberry32(((g.seed||0)^0x124a91)>>>0)()*ids.length)];
}
function dungeonPool124(g,options){return familyPool124(dungeonFamily124(g),Math.max(0,g.rank||0),options)}
function dungeonTheme124(g){const id=dungeonFamily124(g),[floor,wall,trim,fog,light]=HABITAT_COLORS124[g.biome124];return{n:FAMILIES124[id].name,floor,wall,trim,fog,light,habitat124:g.biome124,family124:id,natural124:true}}
function dungeonBoss124(g){
 const id=dungeonFamily124(g),f=FAMILIES124[id],d=KINDS[f.chief],rank=g.rank||0;
 const high={goblins:1,wolves:2,mushrooms:0,spiders:3,swarm:3,meadow:2,slimes:0,bogkin:0,yetis:4,crystals:4,cacti:0,scarabs:3,demons:1,dragons:2};
 const sovereign={campos:3,floresta:3,flores:3,pantano:2,neve:1,cristal:1,deserto:0,vulcao:0};
 const base=rank>=9?SOVEREIGNS[sovereign[g.biome124]??3]:rank>=6?BOSSES_HIGH[high[id]??2]:BOSSES[id==='wolves'||id==='dragons'||id.startsWith('rare_')?2:0];
 const boss={...base,n:f.boss,ecologyFamily124:id,body:d.body||d.skin||0x69754b,scale:id==='goblins'?1.7:1.6};
 delete boss.mon;delete boss.goblin118;
 if(d.mon)boss.mon=d.mon;if(d.goblin118)boss.goblin118=d.goblin118;
 return boss;
}
function bossMinion124(b,fallback){const id=b?.boss?.ecologyFamily124;return FAMILIES124[id]?wpick(familyPool124(id,b.gr||0)).k:fallback}
function activeDungeonPool124(rank,options){return L.mode==='dungeon'&&!L.special?dungeonPool124(L.gate,options):kindsFor0(rank)}
function gateTheme124(g){return g.secret||g.inverse||g.time?GR[g.rank].th:dungeonTheme124(g)}
