/* ===== ATAQUE À CIDADE (chefe de mundo marcado) ===== */
function startSiege(c){if(profile?.classless)return;const a=rnd(0,TAU),x=c.x+Math.cos(a)*60,z=c.z+Math.sin(a)*60;const b=spawnBoss(x,z,clamp(rankOf()+1,0,9),{...WBOSS,n:'Dragão Sitiante'});b.wild=true;b.breaker=true;b.world=true;b.siege=c;b.hp*=5;b.maxhp*=5;b.gold*=6;b.bars=5;b.roam={x:c.x,z:c.z};b.aggro=true;
  for(const s of[-1,1]){const w=new THREE.Mesh(geo('wing',()=>new THREE.PlaneGeometry(2.2,1.2)),new THREE.MeshBasicMaterial({color:0x5a0a0a,side:THREE.DoubleSide}));w.position.set(s*1.3,1.3,-.3);w.rotation.set(0,s*.5,s*.4);b.m.body.add(w)}
  spawnCityDefenders(c,c.x+Math.cos(a)*38*CITYK,c.z+Math.sin(a)*38*CITYK);L.siege={b,c,t:300};bigText('ATAQUE À CIDADE',1600);sfx('gong');shake(.6);showSys('Um DRAGÃO SITIANTE ataca '+c.name+'! Derrote-o em 5 minutos. Recompensa: ouro, troféu e nova coleta da renda de hoje.')}
function updSiege(dt){if(profile?.classless)return;const P=player;run.siegeT=(run.siegeT||0)+dt;
  if(!L.siege&&run.siegeT>1500&&!bossE){const nc=nearestCity(P.x,P.z);if(nc.d<120&&cityL(nc.c)>=5&&!cityFallen(nc.c)){run.siegeT=0;startSiege(nc.c)}}
  const S=L.siege;if(!S)return;S.t-=dt;if(S.b.dead){L.siege=null;return}
  if(S.t<=0){S.b.dead=true;S.b.gone=true;scene.remove(S.b.m.root);if(bossE===S.b){bossE=null;$('boss').hidden=true}L.siege=null;toast('<b>[CIDADE]</b> O dragão cansou e foi embora de '+S.c.name+'.',5000)}}
function siegeWin(b){narratorEvent105('siege');const c=b.siege;if(!b.regional116){b.regional116=true;regionEvent116(c,15,-20,'Você venceu o cerco. Confiança +15; abastecimento recuperado.')}profile.cityDay=profile.cityDay||{};const g=Math.round(400*(1+cityL(c)));run.gold+=g;profile.trophies=profile.trophies||[];const tn='Dragão Sitiante';if(!profile.trophies.includes(tn))profile.trophies.push(tn);profile.sieges=(profile.sieges||0)+1;store.set('pds2_profile',profile);L.siege=null;
  toast('<b>[CIDADE]</b> '+c.name+' está salva! +'+fmt(g)+' ouro e a renda da cidade pode ser coletada de novo hoje.',7000)}

