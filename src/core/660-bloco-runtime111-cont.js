
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
/* v187 (Ian): o Segundo Despertar é obtido reunindo e equipando o set de 5 peças de armadura do chefe de classe rara em Fendas Vermelhas. */
function isTwiceAwakened103(){return (awakening103().unlocked||[]).length>0}
function starReady187(){return isTwiceAwakened103()}
