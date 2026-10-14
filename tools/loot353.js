/* Manual corpse loot. World drops persist with the run; dungeon drops belong
   to that visit. Never sell, overwrite or reroll an unclaimed item. */
const BAGS353=[{slots:25,rank:0,level:1,price:0},...[30,40,50,60,75,90,110,135,165,200].map((slots,rank)=>({slots,rank,level:rank?GR[rank].lvl:5,price:Math.round(800*GR[rank].gold)}))];
function bagTier353(){return Math.max(0,Math.min(BAGS353.length-1,Number(profile?.bagTier353)||0))}
function bagCapacity353(){return BAGS353[bagTier353()].slots}
function bagShop353(){const tier=bagTier353();return '<details><summary>Bolsas · '+bagCapacity353()+' espaços</summary><p>Compra permanente. Não perde na morte. Preço total de cada bolsa.</p>'+BAGS353.slice(1).map((b,i)=>row(b.slots+' espaços','Rank '+GR[b.rank].id+' · nível '+b.level+' · '+fmt(b.price)+' ouro',i+1<=tier?'Adquirida':btn('Comprar','bagbuy353',i+1,rankOf()>=b.rank&&run.level>=b.level&&run.gold>=b.price))).join('')+'</details>'}
function corpseDrop353(e,entry){(e.loot353||(e.loot353=[])).push({...entry,id:crypto.randomUUID()});return true}
function finishCorpse353(e){if(!e.loot353?.length)return;Loot353.create(e)}
window.Loot353=(()=>{
 const active=new Map();let region=null,elapsed=0,dirty=false;
 const reclaimDistance=15;
 function reclaim(r){if(r.reclaimed372)return;r.reclaimed372=true;window.Reclaim372?.start(active.get(r.id),r);dirty=true}
 const records=()=>L.mode==='world'?(run.worldLoot353||(run.worldLoot353=[])):(L.corpseLoot353||(L.corpseLoot353=[]));
 const nearby=r=>player&&!player.dead&&Math.hypot(r.x-player.x,r.z-player.z)<=3.5&&los(player.x,player.z,r.x,r.z);
 function clear(){window.Reclaim372?.clear();if(dirty){saveRun();dirty=false}for(const a of active.values()){a.inter.hidden=true;if(L?.inter)L.inter=L.inter.filter(it=>it!==a.inter);scene.remove(a.root);a.model?.mixer?.stopAllAction()}active.clear();region=null;elapsed=0}
 function attach(r,e){if(active.has(r.id))return;
  let model=r.reclaimed372?null:e?.m;
  if(!model&&!r.reclaimed372){const K=KINDS[r.kind];if(K){model=makeChibi({...K,tint:K.gtint,atkClip:K.clip});model.root.position.set(r.x,0,r.z);animChibi(model,{move:0,atk:0,dead:1,wind:0},1);model.mixer?.update(/^(escaravelho|slime|gosma|cogu|passaro|espinhosa|guardiao|cactinho|magote)/.test(model.mon||'')?(gAct(model,'Death_A')?.getClip().duration||2)+.1:2)}}
  const root=model?.root||new THREE.Group();root.position.set(r.x,0,r.z);root.userData.terrainRoot245=true;scene.add(root);
  // A small, unlit marker makes the fallen body readable without adding lights.
  const marker=new THREE.Mesh(geo('corpse353',()=>new THREE.OctahedronGeometry(.16)),glowS(0xffd08a,.6));marker.position.y=r.reclaimed372?.25:1.2;root.add(marker);
  const inter={type:'corpse353',x:r.x,z:r.z,r:3.5,label:(r.reclaimed372?'F · RECOLHER VESTÍGIOS DE ':'F · VASCULHAR ')+r.name,use:()=>open(r.id)};L.inter.push(inter);
  active.set(r.id,{root,model,marker,inter,original:!!e,boss:!!e?.isBoss});
 }
 function create(e){if(region!==L){clear();region=L}if(e.corpse353)return;const r={id:crypto.randomUUID(),name:e.name||KINDS[e.kind]?.n||'Criatura',kind:e.kind,x:e.x,z:e.z,entries:e.loot353};records().push(r);e.corpse353=r.id;attach(r,e);dirty=true}
 function remove(r){const list=records(),i=list.indexOf(r);if(i>=0)list.splice(i,1);const a=active.get(r.id);if(a){a.inter.hidden=true;L.inter=L.inter.filter(it=>it!==a.inter);a.root.remove(a.marker);if(!a.boss||r.reclaimed372)scene.remove(a.root);active.delete(r.id)}}
 function label(x){return x.type==='equipment'?x.item.name:x.type==='gold'?fmt(x.n)+' ouro':x.type==='potion'?'Poção de vida × '+x.n:x.type==='book'?'Livro de habilidade × '+x.n:x.type==='core'?'Núcleo '+GR[x.rank].id+' × '+x.n:x.name+' × '+x.n}
 function detail(x){return x.type==='equipment'?RAR[x.item.rar].n+' · '+statTxt(x.item):x.type==='book'?'+1 ponto de habilidade por livro.':x.type==='material'?(x.b?'Troféu de chefe · vai para Bolsa → Materiais.':'Material de forja · vai para Bolsa → Materiais.'):x.type==='core'?'Recurso para comércio e melhorias.':x.type==='potion'?'Recupera vida.':''}
 function open(id){const r=records().find(r=>r.id===id);if(!r||!nearby(r))return;view=()=>open(id);let h='<p>Escolha o que levar. Bolsa: '+run.items.length+'/'+bagCapacity353()+'.</p>';
  if(r.entries.length)h+=btn('Pegar tudo','lootall376',id);
  for(const x of r.entries)h+=row(safeText(label(x)),detail(x),btn('Pegar','loottake353',id+'|'+x.id,x.type!=='equipment'||run.items.length<bagCapacity353()));
  const boss=bossE&&bossE.dead&&!bossE.absorbed&&Math.hypot(bossE.x-r.x,bossE.z-r.z)<1;
  if(boss)h+=btn(canArise()?'Erguer eco / essência':'Absorver essência','lootpower353',id);
  h+='<p>O que você deixar permanece nos vestígios, mesmo após a fenda levar o corpo.'+(L.mode==='world'?'':' Saques abandonados somem ao sair da masmorra.')+'</p>';
  openModal('SAQUE · '+r.name,h);
 }
 function take(id,entryId){const r=records().find(r=>r.id===id);if(!r||!nearby(r))return false;const i=r.entries.findIndex(x=>x.id===entryId);if(i<0)return false;const x=r.entries[i];
  if(x.type==='equipment'){if(run.items.length>=bagCapacity353())return false;run.items.push(x.item)}
  else if(x.type==='gold')run.gold+=x.n;
  else if(x.type==='core')run.res.core[x.rank]+=x.n;
  else if(x.type==='potion')run.pots+=x.n;
  else if(x.type==='book')run.spts=(run.spts||0)+x.n;
  else if(x.type==='material'){run.loot=run.loot||{};const old=run.loot[x.name]||(run.loot[x.name]={n:0,v:x.value,b:x.b});old.n+=x.n;old.v=Math.max(old.v,x.value);old.b=!!(old.b||x.b)}
  else return false;
  r.entries.splice(i,1);if(!r.entries.length){reclaim(r);remove(r);}saveRun();if(x.type==='material'&&x.b)toast('Guardado em Bolsa → Materiais: '+x.name+' × '+x.n+'.');sfx('coin');return true;
 }
 function takeAll(id){const r=records().find(r=>r.id===id);if(!r||!nearby(r))return false;let taken=false;for(const x of [...r.entries])taken=take(id,x.id)||taken;return taken}
 function refreshLoot(id){if(records().some(r=>r.id===id))open(id);else closeModal()}
 function buy(tier){if(!Number.isInteger(tier)||tier<=bagTier353()||tier>=BAGS353.length||L.mode!=='world'||!inCity(player.x,player.z)||player.dead)return false;const b=BAGS353[tier];if(rankOf()<b.rank||run.level<b.level||run.gold<b.price)return false;run.gold-=b.price;profile.bagTier353=tier;saveRun();return true}
 function action(a,v){if(a==='lootall376'){takeAll(String(v));refreshLoot(String(v));return 'close0'}if(a==='bagbuy353'){buy(Number(v));mktView();return 'close0'}if(a==='loottake353'){const [id,entry]=String(v).split('|');take(id,entry);refreshLoot(id);return 'close0'}if(a==='lootpower353'){const r=records().find(r=>r.id===v);if(r&&nearby(r)&&bossE?.dead&&!bossE.absorbed){closeModal();absorb(bossE)}return 'close0'}return false}
 function tick(dt){if(!run||!player)return;window.Reclaim372?.tick(dt);if(region!==L){clear();region=L}elapsed+=dt;if(elapsed<.5)return;elapsed=0;if(dirty){saveRun();dirty=false}
  const list=records();for(const r of list)if(!r.reclaimed372&&Math.hypot(r.x-player.x,r.z-player.z)>reclaimDistance)reclaim(r);if(dirty){saveRun();dirty=false}for(const [id,a] of active){const r=list.find(x=>x.id===id);if(!r||Math.hypot(r.x-player.x,r.z-player.z)>85){a.inter.hidden=true;L.inter=L.inter.filter(it=>it!==a.inter);scene.remove(a.root);a.model?.mixer?.stopAllAction();active.delete(id)}}
  // Render only the nearest bodies; every unclaimed record stays available.
  const near=list.filter(r=>Math.hypot(r.x-player.x,r.z-player.z)<65).sort((a,b)=>Math.hypot(a.x-player.x,a.z-player.z)-Math.hypot(b.x-player.x,b.z-player.z)).slice(0,32);
  const ids=new Set(near.map(r=>r.id));for(const [id,a] of active)if(!ids.has(id)){a.inter.hidden=true;L.inter=L.inter.filter(it=>it!==a.inter);scene.remove(a.root);a.model?.mixer?.stopAllAction();active.delete(id)}
  for(const r of near)if(!active.has(r.id))attach(r);
  for(const [id,a] of active){const r=list.find(x=>x.id===id);if(r)a.root.visible=L.mode==='world'||!L.floors||dungeonFloorAt(r.z)===L.floors.current}
 }
 // Keep the extra powers in a square row directly above the actual skill bar,
 // including wrapped desktop bars and resized/touch controls.
 const css=document.createElement('style');css.textContent='body #steal .b{box-sizing:border-box;border-radius:5px!important;flex:0 0 56px;width:56px;height:56px}body.pc #steal .b{width:66px;height:66px;flex-basis:66px}body #steal{right:auto;gap:6px;max-width:calc(100vw - 16px);flex-wrap:wrap;justify-content:center}';document.head.appendChild(css);
 function place(){const bar=$('btns'),box=$('steal');if(!bar||!box)return;const r=bar.getBoundingClientRect(),n=box.children.length;box.style.width=Math.min(innerWidth-20,Math.max(0,n*(touch?56:66)+6*(n-1)))+'px';box.style.left=(!touch?Math.max(8,(innerWidth-box.offsetWidth)/2):Math.max(8,innerWidth-box.offsetWidth-10))+'px';box.style.bottom=Math.max(8,innerHeight-r.top+8)+'px';if(touch&&$('bF'))$('bF').style.bottom=Math.max(8,innerHeight-r.top+box.offsetHeight+16)+'px';if($('ach294'))$('ach294').style.bottom=Math.max(16,innerHeight-r.top+box.offsetHeight+(touch?70:16))+'px'}
 const oldBuild=buildSteal;buildSteal=function(){oldBuild();for(let i=0;i<run.stolen.length;i++)if($('st'+i))$('st'+i).title=skillButtonTip(run.stolen[i]);requestAnimationFrame(place)};
 new ResizeObserver(place).observe($('btns'));addEventListener('resize',place);
 return {create,clear,tick,open,take,takeAll,buy,action,records,active,place};
})();
