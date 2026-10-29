
const BOSSES=[
 {n:'O Último Portão',mon:'user_cavaleiro_carmesim',type:'seismic',body:0xa3201f,skill:S('Golpe Sísmico','nova',8,25,3.2,0xff5533)},
 {n:'O Arquivista',mon:'user_rei_oco',type:'soulrain',body:0x4b2a8a,skill:S('Chuva de Almas','rain',9,28,1.7,0x9c6bff)},
 {n:'O Campeão das Arenas',mon:'user_berserker_rubro',type:'fury',body:0x7a1010,skill:S('Fúria Sangrenta','buff_dmg',14,20,1.8,0xff2244)},
 {n:'O Marechal sem Bandeira',type:'legion',body:0x7b7b82,skill:S('Legião','summon',16,35,3,0xd0d0d0)}];
const BOSSES_HIGH=[
 {n:'O Rei Oco',mon:'monarca',types:['seismic','soulrain'],body:0x2a2436,scale:1.5,skill:S('Colapso do Vazio','nova',8,30,2.6,0x9c6bff)},
 {n:'O Senhor da Fornalha',types:['fury','seismic'],body:0x6a0a0a,scale:2.8,skill:S('Chama do Rei Demônio','nova',9,30,4.5,0xff5a1e)},
 {n:'A Fera dos Quatro Céus',types:['soulrain','seismic'],body:0x1a4a2a,scale:3,skill:S('Sopro do Caos','rain',10,34,2.6,0x6fffb0)},
 {n:'A Mãe do Ninho',types:['legion','soulrain'],body:0x2a1a3a,scale:2.6,skill:S('Ninhada Sombria','summon',16,40,5,0xb18cff)},
 {n:'O Inverno Que Andava',types:['seismic','legion'],body:0x6fa8c8,scale:3,skill:S('Inverno Absoluto','nova',9,32,4,0xa8f0ff)}];
const SOVEREIGNS=[
 {n:'O que Restou da Cidade',mon:'user_gigante_pedra',types:['fury','seismic','soulrain','legion'],body:0x2a0a0a,scale:3.4,p3:true,skill:S('Autoridade da Destruição','cone',6,30,7,0xff3d1e)},
 {n:'A Rainha do Inverno Parado',mon:'user_yeti_corrompido',types:['seismic','soulrain','legion','fury'],body:0x9fd8f0,scale:3.4,p3:true,skill:S('Era do Gelo','nova',10,40,6,0xcff4ff)},
 {n:'O Jardineiro da Podridão',mon:'user_golem_madeira',types:['soulrain','legion','seismic','fury'],body:0x3a5a1a,scale:3.4,p3:true,skill:S('Praga Soberana','dot',8,30,5,0x9cff6b)},
 {n:'O Caçador Primevo',mon:'user_yeti',types:['legion','fury','seismic','soulrain'],body:0x5a3a1a,scale:3.4,p3:true,skill:S('Rugido das Feras','summon',18,45,6,0xffb84d)}];
const ALLBOSS=()=>[...BOSSES,...BOSSES_HIGH,...SOVEREIGNS];
const KINDS={
 slime:{mon:'slime',gk:'Skeleton_Minion',n:'Slime Rosa',hp:22,dmg:5,spd:3.2,ai:'melee',range:1.3,wind:0.5,atkCd:1.4,xp:6,scale:1,body:0xff8ab0,wep:'none',r:0.55,rk:0},
 gosma:{mon:'gosma',gk:'Skeleton_Minion',n:'Gosma Verde',hp:24,dmg:5,spd:3,ai:'melee',range:1.3,wind:0.5,atkCd:1.4,xp:6,scale:1,body:0x6fe36f,wep:'none',r:0.55,rk:0,bio:'pantano'},
 cogu:{mon:'cogu',gk:'Skeleton_Minion',n:'Cogumelinho',hp:20,dmg:6,spd:3.4,ai:'melee',range:1.3,wind:0.5,atkCd:1.4,xp:6,scale:1,body:0xd05050,wep:'none',r:0.55,rk:0,bio:'floresta'},
 passaro:{mon:'passaro',gk:'Skeleton_Minion',n:'Pássaro Bravo',hp:18,dmg:6,spd:5,ai:'lunge',range:1.5,wind:0.35,atkCd:1.4,xp:6,scale:1,body:0x6fb0ff,wep:'none',r:0.57,rk:0,bio:'flores'},
 espinhosa:{mon:'espinhosa',gk:'Skeleton_Minion',n:'Gosma Espinhosa',hp:40,dmg:9,spd:3,ai:'melee',range:1.4,wind:0.5,atkCd:1.4,xp:8,scale:1,body:0x4aa04a,wep:'none',r:0.59,rk:1,bio:'pantano'},
 escaravelho:{mon:'escaravelho',gk:'Skeleton_Warrior',n:'Cavaleiro Escaravelho',hp:70,dmg:12,spd:3.4,ai:'melee',range:1.8,wind:0.55,atkCd:1.3,xp:14,scale:1,body:0xc8a050,wep:'none',r:0.7,rk:2,bio:'deserto'},
 guardiao:{mon:'guardiao',gk:'Knight',n:'Guardião Corrompido',hp:80,dmg:13,spd:3.6,ai:'melee',range:1.8,wind:0.5,atkCd:1.2,xp:16,scale:1,body:0x3a8a8a,wep:'none',r:0.6,rk:3},
 cactinho:{mon:'cactinho',gk:'Skeleton_Minion',n:'Cactoro',hp:36,dmg:9,spd:3.2,ai:'melee',range:1.4,wind:0.5,atkCd:1.4,xp:7,scale:1,body:0x5a9a4a,wep:'none',r:0.59,rk:1,bio:'deserto'},
 magote:{mon:'magote',gk:'Skeleton_Minion',n:'Magote',hp:28,dmg:9,spd:3.2,ai:'wraith',range:9,wind:0.5,atkCd:1.9,xp:6,scale:1,body:0x7a5aff,wep:'none',r:0.59,rk:1},
 orcinho:{mon:'orcinho',gk:'Skeleton_Minion',n:'Orc Pequeno',hp:44,dmg:9,spd:3.6,ai:'melee',range:1.5,wind:0.5,atkCd:1.4,xp:8,scale:1,body:0x5a8a3a,wep:'none',r:0.59,rk:1},
 ninjinha:{mon:'ninjinha',gk:'Skeleton_Minion',n:'Ninja Mirim',hp:30,dmg:10,spd:5,ai:'lunge',range:1.5,wind:0.35,atkCd:1.4,xp:6,scale:1,body:0x333344,wep:'none',r:0.57,rk:1,bio:'floresta'},
 visitante:{mon:'visitante',gk:'Skeleton_Minion',n:'Visitante',hp:34,dmg:9,spd:3.4,ai:'melee',range:1.4,wind:0.5,atkCd:1.4,xp:6,scale:1,body:0x7fe0a0,wep:'none',r:0.59,rk:1,bio:'cristal'},
 yetinho:{mon:'yetinho',gk:'Skeleton_Minion',n:'Filhote de Yeti',hp:46,dmg:9,spd:3.2,ai:'melee',range:1.5,wind:0.5,atkCd:1.4,xp:9,scale:1,body:0xe0f0ff,wep:'none',r:0.59,rk:1,bio:'neve'},
 peixinho:{mon:'peixinho',gk:'Skeleton_Minion',n:'Peixe Andante',hp:36,dmg:8,spd:3.2,ai:'melee',range:1.4,wind:0.5,atkCd:1.4,xp:7,scale:1,body:0x4f9fd8,wep:'none',r:0.57,rk:1,bio:'pantano'},
 fantasma:{mon:'fantasma',gk:'Skeleton_Mage',n:'Fantasma',hp:50,dmg:12,spd:3.6,ai:'wraith',range:8,wind:0.5,atkCd:1.9,xp:10,scale:1,body:0xd8e0ff,wep:'none',r:0.67,rk:2,bio:'floresta'},
 abelha:{mon:'abelha',gk:'Skeleton_Mage',n:'Abelha Blindada',hp:55,dmg:12,spd:4.6,ai:'lunge',range:1.6,wind:0.35,atkCd:1.4,xp:11,scale:1,body:0xffc040,wep:'none',r:0.63,rk:2,bio:'flores'},
 glub:{mon:'glub',gk:'Skeleton_Mage',n:'Glub',hp:48,dmg:12,spd:3.4,ai:'wraith',range:9,wind:0.5,atkCd:1.9,xp:9,scale:1,body:0x9a6aff,wep:'none',r:0.65,rk:2},
 golenzinho:{mon:'golenzinho',gk:'Skeleton_Mage',n:'Golenzinho',hp:90,dmg:12,spd:2.4,ai:'melee',range:1.8,wind:0.5,atkCd:1.4,xp:18,scale:1,body:0x9a8a7a,wep:'none',r:0.67,rk:2,bio:'cristal'},
 cogufuria:{mon:'cogufuria',gk:'Skeleton_Minion',n:'Cogumelo Furioso',hp:70,dmg:13,spd:3.4,ai:'melee',range:1.6,wind:0.5,atkCd:1.4,xp:14,scale:1,body:0xa03030,wep:'none',r:0.65,rk:2,bio:'floresta'},
 sapo:{mon:'sapo',gk:'Skeleton_Warrior',n:'Sapo Guerreiro',hp:80,dmg:13,spd:3.6,ai:'melee',range:1.8,wind:0.5,atkCd:1.4,xp:16,scale:1,body:0x5aa05a,wep:'none',r:0.73,rk:2,bio:'pantano'},
 coelho:{mon:'coelho',gk:'Skeleton_Warrior',n:'Coelho Assassino',hp:60,dmg:15,spd:5.5,ai:'lunge',range:1.7,wind:0.35,atkCd:1.4,xp:12,scale:1,body:0xf0e0e0,wep:'none',r:0.71,rk:2,bio:'flores'},
 caveira:{mon:'caveira',gk:'Skeleton_Mage',n:'Caveira Fantasma',hp:80,dmg:16,spd:3.8,ai:'wraith',range:9,wind:0.5,atkCd:1.9,xp:16,scale:1,body:0xe0e0d0,wep:'none',r:0.69,rk:3},
 redemoinho:{mon:'redemoinho',gk:'Skeleton_Mage',n:'Redemoinho',hp:90,dmg:16,spd:5,ai:'lunge',range:1.8,wind:0.35,atkCd:1.4,xp:18,scale:1,body:0x9fe8ff,wep:'none',r:0.69,rk:3,bio:'cristal'},
 mono:{mon:'mono',gk:'Skeleton_Warrior',n:'Monkroose',hp:120,dmg:17,spd:4,ai:'melee',range:1.9,wind:0.5,atkCd:1.4,xp:24,scale:1,body:0xb07a4a,wep:'none',r:0.75,rk:3,bio:'floresta'},
 ninja:{mon:'ninja',gk:'Skeleton_Warrior',n:'Ninja Sombrio',hp:100,dmg:19,spd:5.5,ai:'lunge',range:1.8,wind:0.35,atkCd:1.4,xp:20,scale:1,body:0x2a2a3a,wep:'none',r:0.75,rk:3,bio:'floresta'},
 cactogig:{mon:'cactogig',gk:'Skeleton_Warrior',n:'Cactoro Gigante',hp:150,dmg:17,spd:3,ai:'melee',range:2,wind:0.5,atkCd:1.4,xp:30,scale:1,body:0x4a8a3a,wep:'none',r:0.81,rk:3,bio:'deserto'},
 homempeixe:{mon:'homempeixe',gk:'Skeleton_Warrior',n:'Homem-Peixe',hp:130,dmg:16,spd:3.6,ai:'melee',range:1.9,wind:0.5,atkCd:1.4,xp:26,scale:1,body:0x3a7ab0,wep:'none',r:0.77,rk:3,bio:'pantano'},
 alpaca:{mon:'alpaca',gk:'Skeleton_Mage',n:'Alpaca Real',hp:110,dmg:16,spd:3.8,ai:'lunge',range:1.8,wind:0.35,atkCd:1.4,xp:22,scale:1,body:0xf0d8a0,wep:'none',r:0.71,rk:3,bio:'flores'},
 abelharainha:{mon:'abelharainha',gk:'Skeleton_Mage',n:'Abelha Rainha Blindada',hp:130,dmg:20,spd:4.6,ai:'lunge',range:1.8,wind:0.35,atkCd:1.4,xp:26,scale:1,body:0xffb020,wep:'none',r:0.71,rk:4,bio:'flores'},
 glubancio:{mon:'glubancio',gk:'Skeleton_Mage',n:'Glub Ancião',hp:120,dmg:21,spd:3.4,ai:'wraith',range:10,wind:0.5,atkCd:1.9,xp:24,scale:1,body:0x7a4aff,wep:'none',r:0.73,rk:4},
 golempedra:{mon:'golempedra',gk:'Skeleton_Mage',n:'Golem de Pedra',hp:260,dmg:22,spd:2.2,ai:'melee',range:2.2,wind:0.5,atkCd:1.4,xp:52,scale:1,body:0x8a8a9a,wep:'none',r:0.87,rk:4,bio:'cristal'},
 lula:{mon:'lula',gk:'Skeleton_Mage',n:'Lula do Vazio',hp:140,dmg:21,spd:3.6,ai:'wraith',range:10,wind:0.5,atkCd:1.9,xp:28,scale:1,body:0x6a3a8a,wep:'none',r:0.73,rk:4},
 invasor:{mon:'invasor',gk:'Skeleton_Warrior',n:'Invasor',hp:160,dmg:22,spd:4,ai:'melee',range:1.9,wind:0.5,atkCd:1.4,xp:32,scale:1,body:0x6fe0a0,wep:'none',r:0.77,rk:4,bio:'cristal'},
 dino:{mon:'dino',gk:'Skeleton_Warrior',n:'Dino',hp:200,dmg:22,spd:4.4,ai:'lunge',range:2,wind:0.35,atkCd:1.4,xp:40,scale:1,body:0x6a9a4a,wep:'none',r:0.83,rk:4,bio:'vulcao'},
 diabrete:{mon:'diabrete',gk:'Skeleton_Mage',n:'Diabrete',hp:130,dmg:22,spd:4.2,ai:'wraith',range:9,wind:0.5,atkCd:1.9,xp:26,scale:1,body:0xd04030,wep:'none',r:0.69,rk:4,bio:'vulcao'},
 tribal:{mon:'tribal',gk:'Skeleton_Mage',n:'Máscara Tribal',hp:200,dmg:26,spd:3.6,ai:'wraith',range:10,wind:0.5,atkCd:1.9,xp:40,scale:1,body:0xc08040,wep:'none',r:0.75,rk:5},
 alpacaimp:{mon:'alpacaimp',gk:'Skeleton_Mage',n:'Alpaca Imperial',hp:260,dmg:26,spd:4,ai:'lunge',range:2,wind:0.35,atkCd:1.4,xp:52,scale:1,body:0xffe0a0,wep:'none',r:0.79,rk:5,bio:'flores'},
 chifrudo:{mon:'chifrudo',gk:'Skeleton_Warrior',n:'Demônio Chifrudo',hp:300,dmg:28,spd:4,ai:'melee',range:2.1,wind:0.5,atkCd:1.4,xp:60,scale:1,body:0xb02020,wep:'none',r:0.85,rk:5,bio:'vulcao'},
 reicogu:{mon:'reicogu',gk:'Skeleton_Warrior',n:'Rei Cogumelo',hp:340,dmg:27,spd:3.2,ai:'melee',range:2.2,wind:0.5,atkCd:1.4,xp:68,scale:1,body:0xc03a3a,wep:'none',r:0.91,rk:5,bio:'floresta'},
 dragonete:{mon:'dragonete',gk:'Skeleton_Mage',n:'Dragonete',hp:300,dmg:30,spd:4,ai:'wraith',range:11,wind:0.5,atkCd:1.9,xp:60,scale:1,body:0xd05030,wep:'none',r:0.83,rk:6,bio:'vulcao'},
 dragaoancio:{mon:'dragaoancio',gk:'Skeleton_Mage',n:'Dragão Ancião',hp:480,dmg:36,spd:3.8,ai:'wraith',range:12,wind:0.5,atkCd:1.9,xp:96,scale:1,body:0x8a1a1a,wep:'none',r:0.99,rk:7,bio:'vulcao'},

 minion:{gk:'Skeleton_Minion',n:'Esqueleto',hp:26,dmg:6,spd:3.6,ai:'melee',range:1.6,wind:.4,atkCd:1.1,xp:6,scale:.72,body:0xd9d2bf,wep:'none',r:.45},
 mage:{gk:'Skeleton_Mage',n:'Esqueleto Mago',hp:32,dmg:9,spd:2.8,ai:'ranged',range:10,wind:.6,atkCd:2.3,xp:11,scale:.95,body:0x5a3d8a,wep:'staff',r:.55},
 warrior:{gk:'Skeleton_Warrior',clip:'1H_Melee_Attack_Chop',n:'Esqueleto Guarda',hp:85,dmg:13,spd:2.1,ai:'melee',range:2.1,wind:.7,atkCd:1.7,xp:16,scale:1.15,body:0x8a8f99,wep:'axe',shield:true,r:.7},
 golem:{gk:'Skeleton_Warrior',gtint:0x6a82ff,clip:'2H_Melee_Attack_Slice',n:'Golem de Mana',hp:240,dmg:20,spd:1.8,ai:'slam',range:2.6,wind:1,atkCd:2.4,xp:34,scale:1.7,body:0x4a5f7a,skin:0x6a82a0,eye:0xffd08a,wep:'none',r:.95},
 wraith:{gk:'Skeleton_Mage',gtint:0x5a3aa0,n:'Espectro',hp:70,dmg:14,spd:3.4,ai:'wraith',range:11,wind:.6,atkCd:2,xp:26,scale:1,body:0x241a3e,skin:0x3a2c5a,eye:0x9cf0ff,wep:'staff',r:.55},
 demon:{mon:'demonio',gk:'Skeleton_Rogue',gtint:0xd03030,n:'Demônio',hp:120,dmg:18,spd:4.6,ai:'lunge',range:1.7,wind:.35,atkCd:1.3,xp:30,scale:1.1,body:0x8a1a1a,skin:0xb03030,eye:0xffa000,wep:'axe',r:.6},
 goblin:{goblin118:'warrior',n:'Goblin Guerreiro',hp:30,dmg:7,spd:4.2,ai:'melee',range:1.5,wind:.35,atkCd:1,xp:8,scale:1,body:0x4a7a3a,wep:'none',r:.45},
 gobShield118:{goblin118:'shield',n:'Goblin Escudeiro',hp:58,dmg:7,spd:2.9,ai:'melee',range:1.6,wind:.55,atkCd:1.4,xp:14,scale:1,shield:true,r:.5},
 gobArcher118:{goblin118:'archer',n:'Goblin Arqueiro',hp:25,dmg:8,spd:3.6,ai:'ranged',range:10,wind:.65,atkCd:2.2,xp:12,scale:.95,r:.43},
 gobShaman118:{goblin118:'shaman',n:'Goblin Xamã',hp:33,dmg:10,spd:2.8,ai:'ranged',range:10,wind:.95,atkCd:2.7,xp:16,scale:1,r:.46},
 gobBrute118:{goblin118:'brute',n:'Goblin Bruto',hp:85,dmg:12,spd:2.6,ai:'slam',range:2,wind:1.1,atkCd:2.3,xp:22,scale:1.12,r:.65},
 lobo:{mon:'lobo',gk:'Skeleton_Rogue',n:'Lobo Sombrio',hp:38,dmg:9,spd:5.4,ai:'lunge',range:1.6,wind:.3,atkCd:1.4,xp:11,scale:1,body:0x3a3a4a,wep:'none',r:.55},
 aranha:{mon:'aranha',gk:'Skeleton_Rogue',n:'Aranha Gigante',hp:46,dmg:10,spd:3.8,ai:'lunge',range:1.6,wind:.4,atkCd:1.6,xp:13,scale:1.1,body:0x2a2a2a,wep:'none',r:.7},
 vespa:{mon:'vespa',gk:'Skeleton_Mage',n:'Vespa Rainha',hp:40,dmg:11,spd:4,ai:'wraith',range:9,wind:.5,atkCd:1.9,xp:15,scale:1,body:0xd0a020,wep:'none',r:.55},
 orc:{mon:'orc',gk:'Skeleton_Warrior',n:'Orc',hp:110,dmg:15,spd:2.6,ai:'melee',range:2,wind:.6,atkCd:1.6,xp:20,scale:1,body:0x4a6a2a,wep:'none',r:.7},
 yeti:{mon:'yeti',gk:'Skeleton_Warrior',n:'Yeti',hp:200,dmg:19,spd:2.2,ai:'slam',range:2.5,wind:.9,atkCd:2.2,xp:30,scale:1,body:0xe0f0ff,wep:'none',r:.9},
 gigante:{mon:'gigante',gk:'Skeleton_Warrior',n:'Gigante de Pedra',hp:340,dmg:26,spd:1.7,ai:'slam',range:3,wind:1.1,atkCd:2.6,xp:45,scale:1,body:0x8a7a6a,wep:'none',r:1.1},
 raptor:{mon:'raptor',gk:'Skeleton_Rogue',n:'Raptor',hp:70,dmg:14,spd:5.2,ai:'lunge',range:1.8,wind:.3,atkCd:1.3,xp:18,scale:1,body:0x6a8a3a,wep:'none',r:.7},
 dragao:{mon:'user_dragao_kaelthys',gk:'Skeleton_Mage',n:'Dracônico',hp:260,dmg:22,spd:3,ai:'wraith',range:12,wind:.7,atkCd:2,xp:50,scale:1,body:0x8a2a2a,wep:'none',r:1.1},
 rogue:{gk:'Skeleton_Rogue',n:'Esqueleto Ladino',hp:44,dmg:11,spd:3.4,ai:'lunge',range:1.5,wind:.5,atkCd:2.2,xp:12,scale:.95,body:0x3c3c46,wep:'dagger',r:.55}};
// ranks de portal
const GR=[
 {id:'F',hp:1,dmg:1,xp:1,gold:1,size:40,rooms:6,dens:1,lvl:1,th:{n:'Caverna Azul',floor:0x1e3050,wall:0x2b4a78,trim:0xffb347,fog:0x0a1830,light:0xc8a2ff}},
 {id:'E',hp:1.9,dmg:1.5,xp:1.8,gold:2.5,size:48,rooms:8,dens:1.1,lvl:8,th:{n:'Cripta Violeta',floor:0x241a3a,wall:0x3a2a5e,trim:0xa26bff,fog:0x140a24,light:0xc9a8ff}},
 {id:'D',hp:3.4,dmg:2.2,xp:3,gold:6,size:56,rooms:10,dens:1.2,lvl:20,th:{n:'Templo Submerso',floor:0x173026,wall:0x255038,trim:0x6fe39a,fog:0x08180e,light:0xb0ffcc}},
 {id:'C',hp:6,dmg:3.2,xp:5,gold:14,size:62,rooms:12,dens:1.3,lvl:35,th:{n:'Forja de Lava',floor:0x331614,wall:0x5a2420,trim:0xff6a3d,fog:0x200806,light:0xffb090}},
 {id:'B',hp:10,dmg:4.5,xp:8,gold:30,size:68,rooms:14,dens:1.4,lvl:55,th:{n:'Palácio de Gelo',floor:0x24404d,wall:0x3d6f80,trim:0xa8f0ff,fog:0x10262e,light:0xe0fbff}},
 {id:'A',hp:17,dmg:6.5,xp:13,gold:70,size:76,rooms:16,dens:1.5,lvl:80,th:{n:'Trono do Vazio',floor:0x14121c,wall:0x2a2436,trim:0xffd070,fog:0x06050a,light:0xffe0a0}},
 {id:'S',hp:28,dmg:9.5,xp:21,gold:160,size:82,rooms:18,dens:1.5,lvl:120,th:{n:'Abismo Carmesim',floor:0x220a10,wall:0x4a1420,trim:0xff2d55,fog:0x12030a,light:0xff9aa8}},
 {id:'SS',hp:46,dmg:14,xp:34,gold:380,size:88,rooms:20,dens:1.55,lvl:180,th:{n:'Castelo Demoníaco',floor:0x1a1010,wall:0x3a1a14,trim:0xff8a1e,fog:0x0e0604,light:0xffc080}},
 {id:'SS+',hp:62,dmg:17.5,xp:45,gold:600,size:91,rooms:21,dens:1.55,lvl:220,th:{n:'Cidadela Celestial',floor:0x241c14,wall:0x483620,trim:0xffda9f,fog:0x100a06,light:0xffe4b5}},
 {id:'★',hp:80,dmg:21,xp:60,gold:900,size:94,rooms:22,dens:1.55,lvl:260,th:{n:'Domínio do Arconte',floor:0x0c0a14,wall:0x1e1830,trim:0xe0d0ff,fog:0x040308,light:0xd8c8ff}}];
/* Portais altos mais duros (feedback do Ian e do Irror: estava fácil): vida +25% e dano +15% por rank acima do E. */
/* ORÁCULO 2.0 (feedback do Irror): vida e dano dos monstros saem do JOGADOR ESPERADO naquele nível — mesma conta dos dois lados.
   Jogador esperado = nível + 1 ponto por nível no atributo principal + equipamento do rank daquele nível + ~35% de bônus. */
const WATK=[6,14,30,60,110,190,320,520,680,850],AHPV=[30,70,150,300,550,950,1600,2600,3400,4200],AARM=[5,10,16,24,34,46,60,76,86,95];
const tierAt=L=>{let t=0;GR.forEach((g,i)=>{if(L>=g.lvl)t=i});return Math.min(9,t)};
/* Valor de 1 ponto de atributo: números inteiros que sobem a cada 25 níveis (pedido do Irror: nada de número quebrado). */
const pStep=L=>Math.floor(L/25),atkPer=L=>2+pStep(L),hpPer=L=>15+8*pStep(L),mpPer=L=>4+2*pStep(L),nextStep=L=>(pStep(L)+1)*25;
const statK=L=>atkPer(L)/2;
const expAtk=L=>(10+2*L+L*atkPer(L)+1.3*WATK[tierAt(L)])*1.35,expHp=L=>(100+10*L+1.3*AHPV[tierAt(L)])*1.35;
/* v169 (Irror: "muito fácil"): monstros ~3x mais vida e ~2,4x mais dano que o jogador esperado aguentava antes. */
// Vida/dano v2: curva fixa por nível próprio, calibrada pelas classes; não lê run.level.
const eHP=L=>MonsterBalance.reference(L).dps*4/38,eDMG=L=>MonsterBalance.reference(L).hp/(18*.55*.85)/9;
GR.forEach(g=>{g.hp=eHP(g.lvl);g.dmg=eDMG(g.lvl)});
const gid=i=>GR[i].id;
const GATE_W=[26,24,20,14,10,6,3,1.5,.7,.4],GATE_RANDOM153=[16,15,14,13,11,9,8,6,5,3];
const RAR=[{n:'Comum',c:'#c9d3de',m:1},{n:'Raro',c:'#ffb347',m:1.3},{n:'Épico',c:'#b18cff',m:1.7},{n:'Lendário',c:'#ffb84d',m:2.3},{n:'Mítico',c:'#ff5a8a',m:2.8},{n:'Divino',c:'#fff36b',m:3.4},{n:'Primordial',c:'#ff3d1e',m:4.2},{n:'Primeva',c:'#7ffff0',m:5.2}];
const RARW=[60,28,10,2,.45,.09,.012,.001],RARWB=[0,50,38,12,3.5,.7,.1,.01];
const PRICE=[150,700,2400,7000,18000,50000,140000,400000,700000,1200000];
const CORE_P=[8,20,50,130,340,900,2200,5500,9000,14000],CRY_P=[15,40,100,260,680,1800,4500,11000,18000,28000];
const HIRE=[100,300,900,2500,7000,18000,45000,110000,180000,300000];
const TIERN=['de Ferro','de Aço','de Mithril','de Runas','de Dragão','do Vazio','do Abismo','Celestial','Transcendente','Primeva'];
const rkN=t=>t===9&&profile.rank!==9?'???':RANKS[t].id;
const WBON=[.15,.4,.8,1.4,2.3,3.6,5.5,8.5,10.5,13],ADEF=[.05,.08,.11,.14,.17,.2,.23,.26,.28,.3];
const ELIX=[{n:'Elixir de Fúria',d:'+25% de dano por 3 min'},{n:'Elixir de Ferro',d:'+30% de vida por 3 min'}];
const POTS=[{n:'Poção de Vida',d:'Recupera 50% da vida',price:40,give:{pots:1}},{n:'Pacote com 5 poções',d:'5 poções de vida',price:180,give:{pots:5}},{n:'Pergaminho de Retorno',d:'Tira você da masmorra e leva à cidade. Não funciona em portal vermelho nem no Outro Mundo de uma Fenda antes do Soberano cair.',price:150,give:{scrolls:1}},{n:'Lampião de Viagem',d:'',price:0,give:{lantern377:1},lantern377:1},{n:'Lampião Mágico',d:'Acende sozinho em masmorra com Escuridão: enxerga longe por 3 minutos.',price:120,give:{lamps:1}}];
const SHOPS=[
 {id:'guild',n:'ORDEM DE CAÇADORES',sign:'ORDEM',vendor:'Lyra',x:-25,z:-25,w:12,d:9,h:7,col:0x2a5fb0,roof:0x1b3a70,sc:'#ffb347',vb:0x2a5fb0,vh:0xe8e8ff,vw:'staff'},
 {id:'pot',n:'LOJA DE POÇÕES',sign:'POÇÕES',vendor:'Mira',x:25,z:-25,w:8,d:7,h:5,col:0x8a2b4a,roof:0x4a1426,sc:'#ff8fa3',vb:0x8a2b4a,vh:0xffb0c8,vw:'staff'},
 {id:'wep',n:'EQUIPAMENTOS DO KAEL',sign:'EQUIPAMENTOS',vendor:'Kael',x:25,z:25,w:9,d:7,h:5.5,col:0x7a4a2a,roof:0x3a2414,sc:'#ffb84d',vb:0x7a4a2a,vh:0xc85a1e,vw:'axe'},
 {id:'arm',n:'DEFESA DA VILA',sign:'DEFESA',vendor:'Brann',x:-25,z:25,w:9,d:7,h:5.5,col:0x5f6f86,roof:0x2b3446,sc:'#c9d3de',vb:0x5f6f86,vh:0x2b2b2b,vw:'sword'}];
/* v486 (Ian: "que nomes são esses? é um mundo medieval"): nomes medievais de fantasia */const NAMES=['Voss','Aldren','Mirela','Godric','Selene','Kargan','Ysolde','Draven','Brunhild','Oren','Elowen','Bastian','Dara','Edric','Isolde','Tormund','Lior','Rowena','Rurik','Soren','Talia','Wulfric'];
const HLINES=['Portais mais longe da cidade costumam ser de rank mais alto.','Nas Fendas, abata 100 monstros ou o Soberano. Na comum, a entrada fica aberta e nada mostra o Soberano; na vermelha, um feixe mostra o Soberano e a entrada só destranca com o objetivo.','Viu um portal vermelho? Lá dentro não tem saída até cumprir o objetivo. Mas paga o dobro.','Se um portal de rank D ou maior fecha sem ninguém limpar, os monstros escapam. Transbordo da fenda.','A Ordem paga bem pelas missões do quadro.','O Kael só vende as armas do seu rank. Suba primeiro.','Ressurgimento protege você da perda por morte. Pergaminho não tira ninguém de um portal vermelho antes da vitória.','Tem caçador que entra nas masmorras só para caçar outros caçadores.','Contrate um paladino na Ordem. Faz diferença no guardião.','Baú de guardião sempre traz equipamento.','Masmorra rank A? Vi uma vez. O trono lá dentro brilha dourado.','Quanto mais longe da muralha, mais fortes os monstros das planícies.','Guardas de escudo bloqueiam de frente. Pegue pelas costas.'];

