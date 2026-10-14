/* ================= ESTADO ================= */
let L={mode:'none',group:new THREE.Group(),inter:[]};scene.add(L.group);
let player=null,enemies=[],allies=[],projs=[],hazards=[],fxs=[],floats=[],npcs=[],bossE=null,gates=[],curGate=null,gateSeq=0,WL=null;
let run=null,started=false,paused=true,modalOpen=false,freeze=0,shakeA=0,time=0,dlgT=0,view=null;
const CHAR_UI118={route:'status',scroll:{},details:{},filters:{}};
let modalRoute118='';
const MODAL_NAV118={current:null,back:[],returning:false,restore:null,serial:0};
function modalParent118(){if(modalRoute118==='basic'||modalRoute118.startsWith('loadout'))return skillsView;if(modalRoute118==='constel')return passivesView;return null}
function modalBack118(){if(profile?.creationPending91&&started)return;bindWait=null;const prev=MODAL_NAV118.back.pop(),parent=modalParent118();if(!prev&&!parent)return;MODAL_NAV118.returning=true;MODAL_NAV118.restore=prev?prev.scroll:null;try{(prev?prev.render:parent)()}finally{MODAL_NAV118.returning=false;MODAL_NAV118.restore=null}}
function enterModal118(title,route){const nav=MODAL_NAV118,key=route?'character:'+route:title+'|'+String(view);if(!modalOpen){nav.current=null;nav.back=[]}const old=nav.current;if(old)old.scroll=$('mb').scrollTop;let scroll=route?CHAR_UI118.scroll[route]||0:0;
 if(old&&old.key===key)scroll=old.scroll;
 if(!nav.returning&&old&&old.key!==key){const index=nav.back.findIndex(p=>p.key===key);if(index>=0){scroll=nav.back[index].scroll;nav.back.length=index}else if(old.render){nav.back.push(old);if(nav.back.length>30)nav.back.shift()}}
 if(nav.restore!==null)scroll=nav.restore;nav.current={key,render:typeof view==='function'?view:null,scroll};nav.serial++;return scroll}

function rememberCharacter118(){if(modalOpen&&modalRoute118)CHAR_UI118.scroll[modalRoute118]=$('mb').scrollTop}
function openCharacter118(){const [page,slot]=CHAR_UI118.route.split(':');if(page==='loadout')return loadoutView(slot===undefined?undefined:Number(slot));if(page==='basic')return basicAttackView();if(page==='constel')return consView();return characterView(page)}
function characterBack118(label){return '<div class="character-path118"><strong>'+label+'</strong></div>'}
function skillPoints118(){const n=run.spts||0;return '<div class="guide93"><strong>'+n+(n===1?' ponto de habilidade disponível':' pontos de habilidade disponíveis')+'</strong><p>Ganhe 1 por nível e por guardião de masmorra. Vale para habilidades e Transmigrador.</p></div>'}

const keys={},input={x:0,z:0},cam={x:0,z:0};

// v78 inserts public SS+ before the legacy secret rank. Migrate each save part once.
function migrateRankProfile(p){if(!p||p.rankSchema===78)return false;if(p.rank===8)p.rank=9;for(const k of ['owned','retired'])for(const r of p[k]||[])if(r.rank===8)r.rank=9;p.rankSchema=78;return true}
function migrateRankRun(r){if(!r||r.rankSchema===78)return false;for(const it of [...(r.items||[]),...Object.values(r.equip||{})])if(it&&it.tier===8)it.tier=9;for(const p of r.party||[])if(p.rank===8)p.rank=9;for(const k of ['official','reavalHint','rkNote'])if(r[k]===8)r[k]=9;if(r.res)for(const k of ['core','cry']){const a=r.res[k]||(r.res[k]=[]);while(a.length<9)a.push(0);a.splice(8,0,0)}r.rankSchema=78;return true}
function backupRanks78(){if(profile&&profile.rankSchema!==78&&!store.get('pds_backup_ranks78'))store.set('pds_backup_ranks78',{profile:JSON.parse(JSON.stringify(profile)),run:store.get('pds3_run')})}

function rankOf(){if(profile&&profile.rk2)return profile.rank;return rankOfOld()}
function rankOfOld(){let lv=run.level-1,r=profile.rank;const top=profile.rank>TOPR?profile.rank:TOPR;while(r<top){const need=RANK_STEPS[Math.min(r,RANK_STEPS.length-1)];if(lv>=need){lv-=need;r++}else break}return r}
function newRun(){run={attr281:1,rankSchema:78,level:1,xp:0,gold:profile?.journey92?0:60,pots:3,scrolls:1,items:[],equip:{w:null,a:null},stolen:[],shadows:[],party:[],kills:0,clears:0,quests:null,res:{core:[0,0,0,0,0,0,0,0,0,0],cry:[0,0,0,0,0,0,0,0,0,0]},pos:null}}
function saveRun(){if(window._wipe||!run||!player||player.dead)return;normalizeOwned363();profile.maxLevel111=Math.max(profile.maxLevel111||0,run.level||1);rememberClassCooldowns();run.summons=savedSummons();if(profile){profile.dayT=dayT;store.set('pds2_profile',profile)}if(L.mode==='world')run.pos={x:player.x,z:player.z};if(L.mode==='world'&&run.invReturn372&&!run.inGate269)delete run.invReturn372;store.set('pds3_run',{...run,stolen:run.stolen.map(s=>s.n),shadows:run.shadows})}
function loadRun(){const r=store.get('pds3_run');if(!r)return false;backupRanks78();migrateRankRun(r);if(!r.v71&&!store.get('pds3_backup_v70'))store.set('pds3_backup_v70',{profile:store.get('pds2_profile'),run:r});newRun();Object.assign(run,r);run.v71=1;if(run.invReturn372){const q=run.invReturn372;run.pos={x:q.x,z:q.z};profile.inv343=profile.inv343||{};if(q.raided){profile.raided155=profile.raided155||{};profile.raided155[q.city]=1;}if(q.open)profile.inv343[q.city]=1;else delete profile.inv343[q.city];delete run.inGate269;}if(run.inGate269){run.sealed269=(run.sealed269||[]).concat([{x:run.inGate269.x,z:run.inGate269.z,t:Date.now()+36e5}]);delete run.inGate269;run.abandon269=1}
  run.stolen=(r.stolen||[]).map(n=>loadedPower111(n,r.lib||[])).filter(Boolean).map(sk=>({...sk,cdT:0}));
  run.shadows=r.shadows||[];run.equip=r.equip||{w:null,a:null};run.party=r.party||[];run.items=r.items||[];if(!r.res)run.res={core:[0,0,0,0,0,0,0,0,0,0],cry:[0,0,0,0,0,0,0,0,0,0]};for(const k of['core','cry'])while(run.res[k].length<10)run.res[k].push(0);normalizeOwned363();return true}

