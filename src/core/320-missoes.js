/* ================= MISSÕES ================= */
/* v262: reward quotes depend on the contract, never time spent waiting or the level at claim. */
function questBudget262(q,type){if(!q)return {xp:0,level:1,minutes:0,difficulty:0};if(!q.xpBudget262){const rank=Math.max(0,Math.min(9,q.repRank97??q.rank??rankOf()));q.repRank97=rank;q.xpBudget262=RpgBalance.questReward({type:type||q.t,level:Math.max(GR[rank].lvl,q.lvl283||0),count:q.n||1})}return questXpNow332(q.xpBudget262)}
/* v332 (Ian): o orçamento guarda nível/duração da missão (alvos, ouro); o XP é recalculado pelo nível atual do jogador a cada consulta e entrega. */
function questXpNow332(b){return {...b,xp:RpgBalance.questXpAt(b,run?.level||1)}}
const QUEST_XP_RULE332='XP ajustado ao seu nível, até 1 nível por entrega.';
function questXpText262(q,type){const b=questBudget262(q,type);return xpNumber(type==='daily'&&profile.dailyXp262Day===q.day?0:xpAwardAmount262(b.xp,'quest'))+' XP · duração estimada '+String(Math.round(b.minutes*10)/10).replace('.',',')+' min'}
function questTargetText262(q){return ['kill','pvp','night','nopot','nododge'].includes(q.t)?' · NV '+questBudget262(q).level+' ou desafio equivalente':''}
function questEnemyEligible262(q,e){if(!e||e.noExpLoot||e.rewardBlocked||e.ally||e.statue)return false;const b=questBudget262(q);return eLvl(e)>=b.level||enemyRewardBalance(e).xp>=RpgBalance.reward({level:b.level,speciesXp:6}).xp}

/* v284 (Ian): XP da missão pelo nível em que ela foi gerada (fixo no contrato); quantidade e tipos de objetivo crescem com o rank. */
function questGold283(q){const r=Math.min(9,q.repRank97??q.rank??rankOf());return ({kill:70,clear:80,pvp:20,elite:12*(q.n||1),boss:60*(q.n||1)}[q.t]||20)*GR[r].gold}
function questTypes283(){const pr=Math.min(9,rankOf());return ['kill','clear','pvp',...(pr>=2?['elite']:[]),...(pr>=4?['boss']:[])]}
function genQuest(t){const pr=Math.min(9,rankOf()),lvM=1,lv=Math.max(GR[pr].lvl,run.level||1);/* Orçamento por objetivo, sem fator ilimitado do nível do jogador. */
  if(t==='elite'){const n=3+pr;const q={t,repRank97:pr,lvl283:lv,n,got:0,d:'Derrote '+n+' monstros elite'};q.rw=Math.round(questGold283(q));questBudget262(q);return q}
  if(t==='boss'){const n=1+Math.floor((pr-4)/2);const q={t,repRank97:pr,lvl283:lv,n,got:0,d:'Derrote '+n+(n>1?' chefes':' chefe')+' de portal'};q.rw=Math.round(questGold283(q));questBudget262(q);return q}
  if(t==='kill'){const n=20+pr*10;const q={t,repRank97:pr,lvl283:lv,n,got:0,rw:Math.round(70*GR[pr].gold*lvM),d:'Mate '+n+' monstros'};questBudget262(q);return q}
  if(t==='clear'){const r=Math.max(0,pr-(Math.random()<.5?1:0));const nc=1+Math.floor(pr/3);const q={t,repRank97:r,rank:r,lvl283:lv,n:nc,got:0,rw:Math.round(80*nc*GR[r].gold*lvM),d:(nc>1?'Feche '+nc+' portais':'Feche um portal')+' rank '+GR[r].id+' ou maior'};questBudget262(q);return q}
  const np=1+Math.floor(pr/2);const q={t:'pvp',repRank97:pr,lvl283:lv,n:np,got:0,rw:Math.round(20*np*GR[pr].gold*lvM),d:np>1?'Derrote '+np+' caçadores hostis':'Derrote um caçador hostil'};questBudget262(q);return q}
function normalizeRewardBudgetsBalance(){run.quests=run.quests||[];for(const q of run.quests){if(!q.lvl283){q.lvl283=Math.max(GR[Math.min(9,q.repRank97??q.rank??rankOf())].lvl,run.level||1);delete q.xpBudget262}q.rw=Math.min(q.rw,questGold283(q)*(q.t==='clear'||q.t==='pvp'?(q.n||1):1));questBudget262(q)}for(const t of questTypes283())if(!run.quests.some(q=>q.t===t))run.quests.push(genQuest(t));if(run.extractMission117){const q=run.extractMission117;q.rw=Math.min(q.rw,120*GR[Math.min(9,q.rank)].gold);questBudget262(q,'extract')}if(run.demand)questBudget262(run.demand)}
function genQuests(){return questTypes283().map(genQuest)}
function qev(type,val){if(type==='kill'&&val&&run.quests){if(val.elite)qev('elite',val);if(val.isBoss&&!val.rival)qev('boss',val)}if(type==='elite'||type==='boss'){for(const q of run.quests||[]){if(q.t!==type||q.got>=q.n||!questEnemyEligible262(q,val))continue;q.got++;if(q.got>=q.n)toast('<b>[NARRADOR]</b> Missão concluída: '+q.d+'. Receba na Ordem.',3500)}return}if(type==='clear'){recordRankPortal(val);npcEv('clear');storyEv('clear')}if(!run.quests)return;for(const q of run.quests){if(q.t!==type||q.got>=q.n)continue;if(type==='clear'&&val<q.rank)continue;if((type==='kill'||type==='pvp')&&!questEnemyEligible262(q,val))continue;q.got++;if(q.got>=q.n)toast('<b>[NARRADOR]</b> Missão concluída: '+q.d+'. Receba na Ordem.',3500)}}

