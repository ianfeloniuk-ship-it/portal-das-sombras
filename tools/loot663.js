/* v667: Lote 2 de saque (Trellis → Blender). Catálogo dos 41 modelos em models/loot/,
   espólio por espécie no cristal de saque e prévia 3D em "Examinar".
   Não muda quantidade nem valor do espólio: só o nome e o modelo. */
(()=>{'use strict';
const C={
 // couros e peles
 pele_goblin_curtida:{n:'Pele de Goblin Curtida',cat:'couro'},
 couro_orc_quebrarocha:{n:'Couro de Orc Quebra-Rocha',cat:'couro'},
 couro_lobisomem_zahar:{n:'Couro de Lobisomem de Zahar',cat:'couro'},
 couro_raptor_sauriano:{n:'Couro de Raptor Sauriano',cat:'couro'},
 membrana_vampiro_ymiria:{n:'Membrana de Vampiro de Ymíria',cat:'couro'},
 // minérios e veios
 veio_cobre_zahar:{n:'Veio de Cobre de Zahar',cat:'minerio'},
 ouro_primeiro_rei_zahar:{n:'Ouro do Primeiro Rei',cat:'minerio'},
 ferro_pantanoso_verden:{n:'Ferro Pantanoso de Verden',cat:'minerio'},
 rocha_craca_thalor:{n:'Rocha de Craca de Thalor',cat:'minerio'},
 geodo_cristal_mana_fenda:{n:'Geodo de Cristal da Fenda',cat:'minerio'},
 // troféus
 presa_lobo:{n:'Presa de Lobo',cat:'trofeu'},
 garra_fera:{n:'Garra de Fera',cat:'trofeu'},
 chifre_runico:{n:'Chifre Rúnico',cat:'trofeu'},
 escama_dragao:{n:'Escama de Dragão',cat:'trofeu'},
 olho_abissal:{n:'Olho Abissal',cat:'trofeu'},
 dente_pirata_zumbi:{n:'Dente de Pirata Zumbi',cat:'trofeu'},
 presa_vampiro_ymiria:{n:'Presa de Vampiro de Ymíria',cat:'trofeu'},
 quelicera_aranha_gigante:{n:'Quelícera de Aranha Gigante',cat:'trofeu'},
 quitina_escaravelho_zahar:{n:'Quitina de Escaravelho',cat:'trofeu'},
 carne_afogado_thalor:{n:'Carne de Afogado de Thalor',cat:'trofeu'},
 // sobrevivência e forja
 lingote_ferro:{n:'Lingote de Ferro',cat:'forja'},
 barra_aco:{n:'Barra de Aço',cat:'forja'},
 cantil_couro:{n:'Cantil de Couro',cat:'sobrevivencia'},
 carne_seca:{n:'Carne Seca',cat:'sobrevivencia'},
 peixe_defumado:{n:'Peixe Defumado',cat:'sobrevivencia'},
 // fungos
 cogu_amanita_venenosa:{n:'Amanita Venenosa',cat:'fungo'},
 cogu_bolha_seiva:{n:'Cogumelo Bolha-de-Seiva',cat:'fungo'},
 cogu_cogumelo_craca:{n:'Cogumelo Craca',cat:'fungo'},
 cogu_falso_ouro:{n:'Falso-Ouro',cat:'fungo'},
 cogu_guarda_chuva_noturno:{n:'Guarda-Chuva Noturno',cat:'fungo'},
 cogu_orelha_de_pau:{n:'Orelha-de-Pau',cat:'fungo'},
 cogu_esporo_vacuo:{n:'Esporo do Vácuo',cat:'essencia'},
 // essências e frascos
 essencia_gosma_fendida:{n:'Essência de Gosma Fendida',cat:'essencia'},
 gel_fogo_fatuo:{n:'Gel de Fogo-Fátuo',cat:'essencia'},
 lodo_abissal:{n:'Lodo Abissal',cat:'essencia'},
 seiva_vital:{n:'Seiva Vital',cat:'essencia'},
 veneno_fenda:{n:'Veneno da Fenda',cat:'essencia'},
 elixir_vigor:{n:'Elixir de Vigor',cat:'essencia'},
 frasco_fogo:{n:'Frasco de Fogo',cat:'essencia'},
 pocao_mana:{n:'Poção de Mana',cat:'essencia'},
 pocao_vida:{n:'Poção de Vida',cat:'essencia'}
};
// Espólio por espécie (só espécies que existem no jogo hoje; chefe continua "Relíquia de …").
const BY_KIND={goblin:'pele_goblin_curtida',orc:'couro_orc_quebrarocha',orcinho:'couro_orc_quebrarocha',
 lobo:'presa_lobo',raptor:'couro_raptor_sauriano',dino:'couro_raptor_sauriano',aranha:'quelicera_aranha_gigante',
 escaravelho:'quitina_escaravelho_zahar',dragao:'escama_dragao',dragaoancio:'escama_dragao',dragonete:'escama_dragao',
 chifrudo:'chifre_runico',demon:'chifre_runico',diabrete:'chifre_runico',yeti:'garra_fera',gigante:'garra_fera',
 lobisomem:'couro_lobisomem_zahar', gosma:'essencia_gosma_fendida',cogu:'cogu_esporo_vacuo',cogufuria:'cogu_esporo_vacuo',reicogu:'cogu_esporo_vacuo'};
// Saíram com defeito do Trellis (cartão plano ou placa de chão): fora do jogo até refazer.
const BAD=['quelicera_aranha_gigante','couro_raptor_sauriano','garra_fera','membrana_vampiro_ymiria','cogu_cogumelo_craca','pocao_mana'];
// Essências fluidas = só shader (essencias664.js, v664); não usar GLB sólido.
for(const id of ['essencia_gosma_fendida','lodo_abissal','gel_fogo_fatuo','seiva_vital'])BAD.push(id);
for(const id of BAD)delete C[id];
for(const k in BY_KIND)if(!C[BY_KIND[k]])delete BY_KIND[k];
const BY_NAME={};for(const id in C)BY_NAME[C[id].n]=id;
const V=667,cache=new Map();
function load(id){
 if(!C[id])return Promise.resolve(null);
 if(!cache.has(id))cache.set(id,new Promise(res=>{try{new THREE.GLTFLoader().load('models/loot/'+id+'.glb?v='+V,g=>res(g.scene),undefined,()=>res(null))}catch(_){res(null)}}));
 return cache.get(id).then(s=>s?s.clone(true):null);
}
const idOf=x=>x?.m663&&C[x.m663]?x.m663:(x?.name&&BY_NAME[x.name])||null;
if(typeof dropLoot==='function'){
 const base=dropLoot;
 dropLoot=function(e){const before=e?.loot353?.length||0;base.apply(this,arguments);
  if(!e||e.isBoss||!e.loot353||e.loot353.length<=before)return;
  const id=BY_KIND[e.kind];if(!id)return;const x=e.loot353[e.loot353.length-1];
  /* Essência/Gel de … fica como está: é o núcleo fluido em shader (v664) */
  if(x.type==='material'&&!/^(Essência|Gel) de /.test(x.name||'')){x.name=C[id].n;x.m663=id}};
}
window.Loot663={C,BY_KIND,load,idOf,has:x=>!!idOf(x)};
})();
