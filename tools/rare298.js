/* v298 (Ian): criaturas raras por bioma — difíceis de encontrar.
   No mundo, cada monstro comum tem 1,5% de chance de nascer como VARIANTE RARA do bioma onde está:
   nome próprio, mais forte (vida ×3, dano ×1,4, maior), brilho na cor do bioma e recompensa grande
   (ouro ×10, XP extra e um equipamento Épico garantido). Fica registrado no Bestiário. */
(function(){
const V={campos:['Alfa',0xffe08a],flores:['Encantado',0xff9fe0],floresta:['Ancião',0x6fe39a],deserto:['Dourado',0xffc84a],vulcao:['Infernal',0xff5a2a],neve:['Ancestral',0xbfe8ff],cristal:['Prismático',0xc8a0ff],pantano:['Venenoso',0x9be05a]};
const CHANCE=.015;
function reg(){profile.rare298=profile.rare298||{};return profile.rare298}
function mark(e,bio){const v=V[bio];if(!v)return;e.rare298={bio,name:(KINDS[e.kind]?.n||'Criatura')+' '+v[0]};e.name=e.rare298.name;
 e.hp*=3;e.maxhp*=3;e.dmg*=1.4;e.gold=(e.gold||1)*10;
 try{const s=1.25;e.m.root.scale.multiplyScalar(s);e.r=(e.r||.5)*s}catch(_){}
 try{const ring=new THREE.Mesh(new THREE.TorusGeometry(1.1,.08,8,40),window.Shaders312?Shaders312.energy(v[1],.95):new THREE.MeshBasicMaterial({color:v[1],transparent:true,opacity:.85}));ring.rotation.x=Math.PI/2;ring.position.y=.15;e.m.root.add(ring);e.rare298.ring=ring;const l=new THREE.PointLight(v[1],1.4,8,1.8);l.position.y=1.5;e.m.root.add(l)}catch(_){}}
function scan(){try{if(typeof started==='undefined'||!started||!run||!player||typeof enemies==='undefined')return;
 for(const e of enemies){
  if(!e.chk298){e.chk298=1;if(L.mode==='world'&&!e.isBoss&&!e.rival&&!e.ally&&!e.friendly217&&!e.statue&&!e.breaker&&!e.raid155&&KINDS[e.kind]&&Math.random()<CHANCE){let bio=null;try{bio=biomeAt(e.x,e.z)}catch(_){}if(bio)mark(e,bio)}}
  if(e.rare298){if(e.rare298.ring)e.rare298.ring.rotation.z+=.03;
   if(!e.rare298.seen&&!e.dead&&Math.hypot(e.x-player.x,e.z-player.z)<30){e.rare298.seen=1;try{Bestiary294.corner('CRIATURA RARA AVISTADA','<b>'+e.rare298.name+'</b><br><span style="opacity:.75">Muito mais forte — e muito mais valiosa.</span>','#ff9fe0');sfx('gong')}catch(_){}}
   if(e.dead&&!e.rare298.done){e.rare298.done=1;const R=reg(),key=e.kind+':'+e.rare298.bio;R[key]=(R[key]||0)+1;store.set('pds2_profile',profile);
    try{const tier=Math.max(0,Math.min(9,rankOf())),sl=EQUIP_SLOTS[Math.floor(Math.random()*EQUIP_SLOTS.length)];const it=makeItem(sl,tier,2,sl==='w'&&typeof shopWeaponKind269==='function'?undefined:undefined);addItem(it)}catch(_){}
    try{gainXp(Math.round(xpNeed()*.15),'monster')}catch(_){}
    try{Bestiary294.corner('CRIATURA RARA DERROTADA','<b>'+e.rare298.name+'</b> · equipamento Épico na bolsa e XP extra.<br><span style="opacity:.75">Variantes raras vencidas: '+Object.values(R).reduce((a,b)=>a+b,0)+'</span>','#ff9fe0')}catch(_){}}}
 }}catch(_){}}
setInterval(scan,300);
/* Bestiário: lista as variantes raras já vencidas */
const bv0=bestView;bestView=function(){bv0();try{const R=reg(),ks=Object.keys(R);const mb=document.getElementById('mb');if(!mb)return;let h='<div class="sec">CRIATURAS RARAS · '+ks.length+' VARIANTES VENCIDAS</div><div class="sysline" style="font-size:12px">No mundo, 1 em cada ~70 monstros nasce como variante rara do bioma (brilho colorido em volta). Mais forte, mas deixa ouro ×10, XP extra e um equipamento Épico.</div>';
 if(!ks.length)h+='<div class="it"><div class="d"><small>Nenhuma ainda. Explore biomas diferentes.</small></div></div>';
 for(const k of ks){const [kind,bio]=k.split(':');h+=row('<b>'+(KINDS[kind]?.n||kind)+' '+(V[bio]?.[0]||'')+'</b>','Vencidas: '+R[k],'')}
 mb.insertAdjacentHTML('afterbegin',h)}catch(_){}};
window.Rare298={V,mark,CHANCE};
})();
