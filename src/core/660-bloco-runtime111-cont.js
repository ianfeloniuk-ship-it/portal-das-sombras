
// Transient Guardian state never enters the profile or the run save.
function guardianState108(){
 if(!player||player.dead||AR103.region!==L||!rareActive103(14)){AR103.guardian108=null;return null}
 const g=AR103.guardian108||(AR103.guardian108={links:[],wards:[],oath:null});
 g.links=g.links.filter(l=>l.until>time&&(l.target?!l.target.dead&&allies.includes(l.target):l.pool>0)).slice(-affinity103(14));
 g.wards=g.wards.filter(w=>w.until>time&&w.amount>0&&!w.target.dead&&(w.target===player||allies.includes(w.target)));
 return g;
}
function guardianPoint108(l){return l.target||l}
function guardianReach108(l,r=12){const p=guardianPoint108(l);return Math.hypot(p.x-player.x,p.z-player.z)<=r&&los(player.x,player.z,p.x,p.z)}
function guardianAim108(){const pt=skillGroundPoint(12);return allies.filter(a=>!a.dead&&a.maxhp>0&&Math.hypot(a.x-player.x,a.z-player.z)<=12&&Math.hypot(a.x-pt.x,a.z-pt.z)<=3&&los(player.x,player.z,a.x,a.z)).sort((a,b)=>Math.hypot(a.x-pt.x,a.z-pt.z)-Math.hypot(b.x-pt.x,b.z-pt.z))[0]}
function guardianLanding108(g){
 const pt=skillGroundPoint(12),links=g.links.filter(l=>guardianReach108(l)).sort((a,b)=>{const p=guardianPoint108(a),q=guardianPoint108(b);return Math.hypot(p.x-pt.x,p.z-pt.z)-Math.hypot(q.x-pt.x,q.z-pt.z)});
 for(const l of links){const p=guardianPoint108(l);for(let i=0;i<12;i++){const a=Math.atan2(player.x-p.x,player.z-p.z)+i*Math.PI/6,r=l.target?(player.r||.5)+(p.r||.5)+.3:0,x=p.x+Math.sin(a)*r,z=p.z+Math.cos(a)*r;if(freeAt(x,z,player.r||.5)&&los(player.x,player.z,x,z))return {x,z}}}return null;
}
function guardianCheck108(sk){const g=guardianState108();if(!g)return 'Equipe uma habilidade do Guardião.';
 if(sk.t==='rare_link'){if(guardianAim108())return '';const p=skillGroundPoint(8);return freeAt(p.x,p.z,.6)&&los(player.x,player.z,p.x,p.z)?'':'Escolha um aliado ou chão livre e visível.'}
 if(!g.links.some(l=>guardianReach108(l)))return 'Crie um Elo Protetor próximo primeiro.';
 if(sk.t==='rare_interpose'&&!guardianLanding108(g))return 'Não há caminho livre para a Interposição.';
 if(sk.t==='rare_oath'&&g.oath)return 'Seu Juramento ainda está ativo.';return '';
}
function guardianWard108(g,a,amount,duration){let w=g.wards.find(w=>w.target===a);if(!w){w={target:a,amount:0,until:0};g.wards.push(w)}w.amount=Math.max(w.amount,Math.min(a.maxhp*.4,amount));w.until=Math.max(w.until,time+duration);fxRing(a.x,a.z,0xffdb86,1.3,.6)}
function guardianWave108(g,r,fraction,charge,duration){for(const a of [player,...allies])if(!a.dead&&Math.hypot(a.x-player.x,a.z-player.z)<=r&&los(player.x,player.z,a.x,a.z))guardianWard108(g,a,a.maxhp*fraction+charge,duration);fxRing(player.x,player.z,0xffdb86,r,.8)}
function guardianCast108(sk){const g=guardianState108();if(!g)return;
 if(sk.t==='rare_link'){const target=guardianAim108(),p=target||skillGroundPoint(8);if(target)g.links=g.links.filter(l=>l.target!==target);g.links.push({target:target||null,x:p.x,z:p.z,pool:target?0:player.maxhp*.3,until:time+20});g.links=g.links.slice(-affinity103(14));fxRing(p.x,p.z,0xffdb86,target?1.5:8,1);floater(p.x,p.z,target?'ELO PROTETOR':'ÂNCORA PROTETORA','#ffdb86')}
 else if(sk.t==='rare_interpose'){const p=guardianLanding108(g);if(!p)return;player.x=p.x;player.z=p.z;player.act=null;guardianWave108(g,4,.2,0,4)}
 else if(sk.t==='rare_oath'){g.oath={until:time+6,charge:0};fxRing(player.x,player.z,0xffdb86,3,1);floater(player.x,player.z,'JURAMENTO','#ffdb86')}
}
function guardianCharge108(g,amount){if(g.oath&&g.oath.until>time)g.oath.charge=Math.min(player.maxhp*.3,g.oath.charge+Math.max(0,amount))}
function guardianAbsorb108(g,a,amt,charge=true){const w=g.wards.find(w=>w.target===a);if(!w)return amt;const n=Math.min(w.amount,amt);w.amount-=n;if(charge)guardianCharge108(g,n);return amt-n}
function guardianDamage108(a,amt){if(!(amt>0))return amt;const g=guardianState108();if(!g)return amt;amt=guardianAbsorb108(g,a,amt);if(amt<=0)return 0;
 const fraction=g.oath&&g.oath.until>time?.5:.3;
 if(a===player){let remaining=amt*fraction;for(const l of g.links){if(l.target||!guardianReach108(l,8))continue;const n=Math.min(l.pool,remaining);l.pool-=n;remaining-=n;amt-=n;guardianCharge108(g,n);if(remaining<=0)break}return amt}
 if(!g.links.some(l=>l.target===a&&guardianReach108(l)))return amt;
 const n=amt*fraction;guardianCharge108(g,n);const cost=guardianAbsorb108(g,player,n*.5,false);
 if(cost>0){player.hp-=cost;player.shT=4;floater(player.x,player.z,'ELO −'+fmt(cost),'#ffdb86');if(player.hp<=0)die()}
 return amt-n;
}
function guardianUpdate108(){const g=guardianState108();if(!g)return;if(g.oath&&g.oath.until<=time){const charge=g.oath.charge;g.oath=null;guardianWave108(g,8,.1,charge,6)}
 if(time>=(g.ringAt||0)){g.ringAt=time+1;for(const l of g.links){const p=guardianPoint108(l);fxRing(p.x,p.z,0xffdb86,l.target?1.3:8,1.1)}}
}
function guardianHud108(){const g=guardianState108();if(!g)return '';const w=g.wards.find(w=>w.target===player),pool=g.links.reduce((n,l)=>n+(l.target?0:l.pool),0);return ' · VÍNCULOS '+g.links.length+'/'+affinity103(14)+(pool?' · ÂNCORA '+Math.ceil(pool):'')+(w?' · PROTEÇÃO '+Math.ceil(w.amount)+' ('+Math.ceil(w.until-time)+'s)':'')+(g.oath?' · JURAMENTO '+Math.ceil(Math.max(0,g.oath.until-time))+'s · CARGA '+Math.ceil(g.oath.charge):'')}

function awakeningDiscovered109(){const a=profile?.awakening103;if(a&&a.pending)a.pending=null;return !!(a&&a.unlocked?.length)}
function awakening103(){const a=profile.awakening103||(profile.awakening103={});a.points=a.points&&typeof a.points==='object'?a.points:{};a.unlocked=Array.isArray(a.unlocked)?a.unlocked.filter(i=>RARE_IDS111.includes(i)):[];a.energy=Math.max(0,Number(a.energy)||0);a.total=Math.max(0,Number(a.total)||0);a.essences=Array.isArray(a.essences)?a.essences.slice(-20):[];return a}
function rareActive103(ci){return !!player&&player.skills.some(s=>!s.empty&&s.sourceClass===ci&&s.rare103)}
function affinity103(ci){return awakening103().affinity===ci&&rareActive103(ci)?2:1}
function rareOnPortal103(g){return; /* v169 (Ian): a fissura antiga não existe mais; o despertar vem dos sets dos chefes */if(g.rareRewarded103)return;g.rareRewarded103=true;const a=awakening103();if(a.discovered)a.energy++;if(a.pending||g.rank<Math.min(8,profile.rank)||run.level<30)return;if(!a.discovered)a.energy++;a.discovered=true;narratorEvent105('fissure',{rank:g.rank});a.pending={x:g.x,z:g.z,rank:g.rank,id:String(g.id),color:g.red?'red':'violet'};toast('<b>[NARRADOR]</b> O portal fechou. Mas alguma coisa continua sustentando uma fissura. Você sente a fissura. Uma nova aba apareceu em Personagem.',7000);store.set('pds2_profile',profile)}
/* v292 (Ian): o rank ★ só aparece depois que o jogador ganha uma classe secreta (rara) */
function secretRankKnown292(){try{return (profile.rank||0)>=9||awakening103().unlocked.length>0||(awakening103().total||0)>=1}catch(_){return false}}
function isTwiceAwakened103(){return awakening103().total>=3}
/* v187 (Ian): rank ★ na Guilda só depois do segundo despertar (ter despertado uma classe rara). */
function starReady187(){return awakening103().unlocked.length>0}
function rareEligible103(ci){const a=awakening103();return RARE_IDS111.includes(ci)&&a.total>=3&&(a.points[ci]||0)>0&&!a.unlocked.includes(ci)}
function rareLearn103(ci){if(!rareEligible103(ci)||!canRedistribute())return false;const a=awakening103();a.unlocked.push(ci);narratorEvent105('learnrare');profile.jobs=[...new Set([...jobsOf(),ci])];store.set('pds2_profile',profile);saveRun();return true}
function rareAttune103(ci){const a=awakening103(),max=Math.max(0,...Object.values(a.points));if(!canRedistribute()||!a.unlocked.includes(ci)||a.points[ci]!==max||a.affinity===ci||a.total-(a.attunedAt||0)<3)return false;a.affinity=ci;a.attunedAt=a.total;narratorEvent105('affinity');store.set('pds2_profile',profile);saveRun();return true}
function awakeningViewOld103(){if(!awakeningDiscovered109())return;view=awakeningView103;L.characterTab='awakening';const a=awakening103();if(!isTwiceAwakened103()){let h=characterTabs('awakening')+'<div class="guide93"><strong>A FISSURA</strong><p>O portal fechou, mas você ainda sente algo ali. Uma passagem que parece responder à sua presença.</p><p>O Narrador percebe que alguma coisa mudou. Ainda não sabe o que está acontecendo.</p></div>';if(a.pending)h+=row('Um vestígio permanece','Posição '+Math.round(a.pending.x)+', '+Math.round(a.pending.z)+'. Distância: '+Math.round(Math.hypot(player.x-a.pending.x,player.z-a.pending.z))+' m. Aproxime-se para investigar.',btn('Investigar','awinspect',0,L.mode==='world'&&Math.hypot(player.x-a.pending.x,player.z-a.pending.z)<5));else h+=row('A sensação permanece','Não há um vestígio para investigar agora. Continue sua jornada.','');if(a.total>0)h+=row('O que você viveu',a.total+' '+(a.total===1?'vestígio investigado':'vestígios investigados')+'. Você ainda está descobrindo o que isso significa.','');h+=trialJournal113();openModal('PERSONAGEM',h,'awakening');return}let h=characterTabs('awakening')+'<div class="guide93"><strong>O QUE PERMANECEU</strong><p>Algo sobrevive ao fechamento das Fendas. Você consegue sustentar essa passagem; o Narrador ainda não sabe explicar como.</p><p>Você poderá aprender todas as dez classes raras e combinar até seis habilidades. A afinidade principal dobra apenas a característica exclusiva da classe, quando uma habilidade rara dela estiver equipada.</p></div>';
 h+=row('Rank e Despertar','Rank '+RANKS[profile.rank].id+' · '+(isTwiceAwakened103()?'Segundo Despertar concluído':'Segundo Despertar em desenvolvimento')+'. Despertar não promove seu rank. Para superar SS+, alcance SS+, conclua o Segundo Despertar e cumpra os requisitos da prova ★.','');
 h+=row('Capítulo 1 · A fissura que permaneceu',a.discovered?'Investigações concluídas: '+a.total+' / 3 para despertar. Energia de Fendas: '+a.energy+'.':'A partir do nível 30, conclua e saia de uma Fenda de pelo menos seu rank atual (inclusive F). Investigue o vestígio deixado no mundo.','');
 if(a.pending)h+=row('Fissura para investigar','Posição '+Math.round(a.pending.x)+', '+Math.round(a.pending.z)+'. Distância: '+Math.round(Math.hypot(player.x-a.pending.x,player.z-a.pending.z))+' m. Ela permanece disponível se você sair para se preparar.',btn('Investigar','awinspect',0,L.mode==='world'&&Math.hypot(player.x-a.pending.x,player.z-a.pending.z)<5));
 h+='<div class="sec">CAMINHOS DO SEGUNDO DESPERTAR</div>';for(const c of RARE103){if(!c.ready){h+=row(c.n,'Chega nas próximas etapas do Segundo Despertar.','Em desenvolvimento');continue}const learned=a.unlocked.includes(c.id);h+=row(c.n,'Afinidade construída: '+(a.points[c.id]||0)+'. '+c.exclusive+'<br>'+(a.affinity===c.id?'Afinidade principal · ×2':'Característica ativa ao equipar habilidade rara da classe.'),(learned?'<b>Aprendida</b>':btn('Aprender','awlearn',c.id,rareEligible103(c.id)&&canRedistribute()))+(learned?btn('Afinidade principal','awattune',c.id,canRedistribute()&&a.affinity!==c.id&&a.points[c.id]===Math.max(0,...Object.values(a.points))&&a.total-(a.attunedAt||0)>=3):''))}
 h+='<div class="sysline">Cada investigação concluída desenvolve o caminho escolhido. A afinidade principal pode ser escolhida entre os caminhos mais desenvolvidos. Para mudar depois, conclua mais três investigações e desenvolva o novo caminho até ele estar entre suas maiores afinidades. Não perde nenhuma classe. Aprendizado e escolha de afinidade são feitos na cidade. Ecos e habilidades antigos permanecem disponíveis.</div>';h+=trialJournal113();openModal('PERSONAGEM',h,'awakening')}
