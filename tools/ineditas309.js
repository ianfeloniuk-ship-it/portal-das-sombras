/* v309 (Ian): 4 criaturas inéditas da lore da Fenda, modeladas do zero no Blender (Entregas/Fendidos-2026-10-07/ineditas-blender.py).
   Com elas o Bestiário chega a 200 (183 espécies + 13 chefes + 4). */
(function(){
const A={Idle:'Idle',Running_A:'Run',Death_A:'Death',ATK:'Attack',Hit:'Hit'};
const NEW={
 olhoerrante:{n:'Olho Errante',h:1.7,base:'fantasma',hp:1.6,dmg:1.5,rk:2,ai:'wraith',
  lore:['Um olho gigante que flutua sozinho, com uma casca escura e seis tentáculos pendurados. A íris brilha em roxo.','Alimenta-se do que vê: cada criatura que ele encara fica um pouco mais fraca e ele, um pouco mais forte.','Vigia as passagens das Fendas sem piscar. Quando encontra um intruso, dispara luz pela pupila e chama os outros.']},
 arraia:{n:'Arraia do Vazio',h:1.4,base:'passaro',hp:1.8,dmg:1.6,rk:2,ai:null,
  lore:['Uma arraia que nada no ar como se fosse água, com pintas que brilham como estrelas e uma cauda longa e afiada.','Filtra pó de estrela e restos de mana que flutuam no ar das Fendas.','Circula em silêncio acima das presas e mergulha de repente, cortando com a cauda.']},
 arauto:{n:'Arauto da Fenda',h:3.1,base:'wraith',hp:3.5,dmg:2,rk:5,ai:'wraith',
  lore:['Uma figura encapuzada sem rosto: só o vazio dentro do capuz. Mãos de luz flutuam ao lado do corpo e dois anéis de runas giram em volta.','Ninguém sabe. Dizem que se alimenta das próprias palavras que anuncia.','Aparece pouco antes de uma Fenda grande se abrir, como um mensageiro. Quem o ouve falar nunca esquece a voz.']},
 semente:{n:'Semente da Fenda',h:.6,base:'slime',hp:1.2,dmg:1.2,rk:0,ai:null,
  lore:['Uma semente de cristal do tamanho de um gato, que anda sobre quatro raízes e tem um núcleo brilhando dentro.','Suga a mana do chão onde pisa; por onde passa, a grama seca e cresce cristal.','Anda em bandos pequenos ao redor de portais. Se ninguém fechar a Fenda a tempo, as sementes viram cristais grandes.']}};
const ids=Object.keys(NEW);
for(const k of ids){const N=NEW[k],B=KINDS[N.base];KINDS[k]={...B,mon:k,n:N.n,hp:Math.round(B.hp*N.hp),dmg:Math.round(B.dmg*N.dmg),xp:Math.round((B.xp||10)*2),rk:N.rk,bio:undefined,scale:1,inedita309:true,...(N.ai?{ai:N.ai}:{})};MON_DEF[k]={h:N.h,a:A};try{Bestiary294.LORE[k]=N.lore}catch(_){}}
if(THREE.GLTFLoader){const ld=new THREE.GLTFLoader();if(window.MeshoptDecoder)ld.setMeshoptDecoder(MeshoptDecoder);for(const k of ids)ld.load('models/m_'+k+'.glb?v=309b',g=>{MON.list[k]=g.scene;MON.clips[k]=g.animations;const b=monsterBounds132(g.scene);MON.h[k]=(b.max.y-b.min.y)||1},undefined,()=>{})}
/* onde aparecem: Sementes perto de portais e nas Fendas; Olho e Arraia nas Fendas; Arauto só em Fendas fundas (vermelhas, corrompidas ou rank B+) */
const sk0=spawnKind;spawnKind=function(k,x,z,gr,extra){try{if(!(extra&&(extra.noFendido||extra.boss||extra.rival||extra.noInedita))&&KINDS[k]&&!KINDS[k].inedita309){const inDun=typeof L!=='undefined'&&L.mode==='dungeon';const g=inDun?L.gate:null;const deep=g&&(g.red||g.corrupt299||(g.rank||0)>=4);let near=false;if(!inDun&&typeof gates!=='undefined')near=gates.some(q=>!q.dead&&Math.hypot(q.x-x,q.z-z)<60);const r=Math.random();let pick=null;
 if(inDun){if(deep&&r<.015)pick='arauto';else if(r<.045)pick=Math.random()<.5?'olhoerrante':'arraia';else if(r<.08)pick='semente'}else if(near&&r<.06)pick='semente';
 if(pick&&MON.list[pick]&&(gr||0)>=NEW[pick].rk-1)return sk0.call(this,pick,x,z,gr,{...(extra||{}),noFendido:true,noInedita:true})}}catch(_){}return sk0.apply(this,arguments)};
window.Ineditas309={NEW,ids};
})();
