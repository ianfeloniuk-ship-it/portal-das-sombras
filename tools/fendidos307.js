/* v307 (Ian): os FENDIDOS — criaturas tocadas pela Fenda, com identidade visual própria do jogo.
   Modelos: CC0 da Quaternius transformados no Blender (cristais presos aos ossos, corpo escurecido, olhos brilhando).
   Mutação por bioma: a cor dos cristais e o nome mudam conforme o bioma onde a criatura nasce.
   Aparecem dentro das Fendas (portais) e no mundo perto de portais abertos. */
(function(){
const NEW={
 lobofendido:{base:'lobo',n:'Lobo Fendido',h:1.5,a:{Idle:'Idle',Running_A:'Gallop',Death_A:'Death',ATK:'Attack',Hit:'Idle_HitReact_Left'},mul:[1.7,1.4],rk:1,
  lore:['Lobo tocado pela Fenda: cristais roxos brotam da coluna e os olhos queimam como brasas frias.','Caça o eco de mana que fica nos viajantes depois de atravessar um portal.','Uiva antes de atacar; o uivo faz os cristais de toda a matilha pulsarem juntos.']},
 tecela:{base:'aranha',n:'Tecelã de Vidro',h:.95,a:{Idle:'Spider_Idle',Running_A:'Spider_Walk',Death_A:'Spider_Death',ATK:'Spider_Attack'},mul:[1.8,1.5],rk:2,
  lore:['Aranha cujo abdômen virou um aglomerado de cristal translúcido, com uma luz pulsando dentro.','Suga a mana das criaturas presas na teia e guarda dentro do próprio corpo.','Tece fios de luz entre os pilares de cristal; quem toca um fio é sentido por ela a quilômetros.']},
 colosso:{base:'gigante',n:'Colosso Rachado',h:4.4,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Attack',Hit:'HitRecieve'},mul:[2.2,1.5],rk:4,
  lore:['Gigante de pedra partido pela Fenda: o vazio brilha nas rachaduras do peito e pedras de cristal orbitam o corpo.','Não come. Absorve a energia das fendas abertas por perto.','Anda em direção ao portal mais próximo como se fosse chamado; destrói o que estiver no caminho.']},
 yeticorrompido:{base:'yeti',n:'Yeti Corrompido',h:3,a:{Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Punch',Hit:'HitReact'},mul:[1.9,1.5],rk:3,
  lore:['Yeti de pelo escurecido, com chifres e ombreiras de cristal crescidos da própria pele.','Come gelo misturado a cristais de mana; por isso a respiração solta névoa roxa.','Perdeu o instinto de proteger os filhotes: agora só segue o chamado da Fenda.']}};
const MUT={campos:['',0x9b5cff,0x66f0ff],flores:['Florido',0xff7ad8,0xffd0f0],floresta:['Musgoso',0x3fd98a,0xb0ffcf],deserto:['de Âmbar',0xffb02e,0xfff0a0],vulcao:['Ígneo',0xff4a1e,0xffc070],neve:['Gélido',0x7fd8ff,0xe8faff],cristal:['Prismático',0xc78cff,0xffffff],pantano:['Tóxico',0x9be03a,0xe8ff9a]};
const ids=Object.keys(NEW);
// fichas
for(const k of ids){const N=NEW[k],B=KINDS[N.base];KINDS[k]={...B,mon:k,n:N.n,hp:Math.round(B.hp*N.mul[0]),dmg:Math.round(B.dmg*N.mul[1]),xp:Math.round((B.xp||10)*1.8),rk:N.rk,bio:undefined,fendido:true};MON_DEF[k]={h:N.h,a:N.a};
 try{Bestiary294.LORE[k]=N.lore}catch(_){}}
// carrega os modelos
if(THREE.GLTFLoader){const ld=new THREE.GLTFLoader();if(window.MeshoptDecoder)ld.setMeshoptDecoder(MeshoptDecoder);for(const k of ids)ld.load('models/m_'+k+'.glb?v=307',g=>{MON.list[k]=g.scene;MON.clips[k]=g.animations;const b=monsterBounds132(g.scene);MON.h[k]=(b.max.y-b.min.y)||1},undefined,()=>{})}
const ready=k=>!!MON.list[k];
function mutate(e){if(!e||!NEW[e.kind]||e.mut307)return;let bio='campos';try{bio=biomeAt(e.x,e.z)}catch(_){}if(typeof L!=='undefined'&&L.mode==='dungeon'){try{bio=(L.gate&&L.gate.bio124)||bio}catch(_){}}const M=MUT[bio]||MUT.campos;e.mut307=bio;
 if(M[0])e.name=NEW[e.kind].n+' '+M[0];
 try{e.m.root.traverse(o=>{if(!o.isMesh||!o.material)return;const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){if(m.name==='FendaCristal'){m.color.setHex(M[1]);if(m.emissive)m.emissive.setHex(M[1])}else if(m.name==='FendaBrilho'){m.color.setHex(M[2]);if(m.emissive)m.emissive.setHex(M[2])}}})}catch(_){}
 try{const l=new THREE.PointLight(M[1],1.1,7,1.8);l.position.y=1.4;e.m.root.add(l)}catch(_){}}
// substitui parte dos monstros por Fendidos: 12% nas Fendas (portais), 8% no mundo perto de portais abertos
const sk0=spawnKind;spawnKind=function(k,x,z,gr,extra){try{if(!(extra&&extra.noFendido)&&KINDS[k]&&!KINDS[k].fendido&&!(extra&&(extra.boss||extra.rival))){const inDun=typeof L!=='undefined'&&L.mode==='dungeon';let near=false;if(!inDun&&typeof gates!=='undefined')near=gates.some(g=>!g.dead&&Math.hypot(g.x-x,g.z-z)<60);const ch=inDun?.12:near?.08:0;if(ch&&Math.random()<ch){const opts=ids.filter(id=>ready(id)&&(NEW[id].rk<=Math.max(1,gr||0)+1));if(opts.length){const pick=opts[Math.floor(Math.random()*opts.length)];const e=sk0.call(this,pick,x,z,gr,extra);mutate(e);return e}}}}catch(_){}return sk0.apply(this,arguments)};
window.Fendidos307={NEW,MUT,mutate,ids};
})();
