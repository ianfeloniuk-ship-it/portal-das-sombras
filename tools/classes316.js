/* v316: seven distinct tactical abilities per new class. Stable IDs 0..2 are untouched. */
(function(){
'use strict';
const defs={
21:[
 ['Palma dos Ecos','echo',9,16,1.2,'Marca um alvo por 8s. Após 3 ataques básicos nele, os ecos explodem em 3 m causando mais 180% do dano desta técnica.'],
 ['Passo em Oito','eight',7,12,1.4,'Desloca 3 m para o lado e golpeia o caminho. Alterna esquerda e direita a cada uso; paredes impedem o movimento.'],
 ['Respiração Inversa','breath',14,0,0,'Converte até 30 de Vigor disponível em duas vezes esse valor de Fúria. Não funciona sem Vigor ou com Fúria cheia.'],
 ['Quebra de Cadência','cadence',10,18,1.6,'Atinge um alvo. Durante a preparação de um ataque dele, causa o dobro de dano e interrompe inimigos comuns.'],
 ['Balança dos Punhos','balance',12,22,1.3,'Atinge os dois inimigos mais próximos. A diferença entre suas porcentagens de vida aumenta o dano nos dois, até o dobro.'],
 ['Selo dos Cinco Pontos','five',16,20,0.8,'Marca um alvo por 10s. Cada um dos próximos 5 ataques básicos recebe um bônus crescente de 8%, até 40%; o quinto encerra o selo.'],
 ['Roda dos Meridianos','wheel',18,12,0.7,'Gasta a Fúria restante: a cada 10 pontos, adiciona um golpe, até 5. Distribui os golpes em rodízio entre inimigos a até 6 m.']
],
22:[
 ['Inscrição Alternada','alternate',10,14,1.1,'Marca por 10s. Alternar ataques físicos e mágicos no alvo aumenta cada acerto alternado em 35%; repetir o tipo não dá bônus.'],
 ['Reserva Incandescente','reserve',16,8,0,'Armazena até 20% da mana máxima restante por 8s. Seu próximo ataque básico consome a reserva e espalha dano mágico nos outros inimigos em 3 m do alvo.'],
 ['Costura Astral','stitch',12,20,1.7,'Traça um corte entre os dois inimigos mais distantes entre si no alcance de 10 m. Atinge todos que cruzam essa linha, sem atravessar paredes.'],
 ['Dízimo Rúnico','tithe',14,12,1.0,'Marca um alvo por 8s. Os próximos 3 ataques básicos nele recuperam, cada um, 4% da sua mana máxima.'],
 ['Corte do Reservatório','reservoir',11,10,1.4,'Consome até 25% da mana máxima restante e atinge um alvo. O dano cresce com a mana adicional realmente gasta, até +150%.'],
 ['Díade Arcana','dyad',17,24,1.4,'Liga os dois inimigos mais próximos com um corte. Quanto mais separados estiverem, maior o dano nos dois: +10% por metro, até +100%.'],
 ['Órbita Reversa','orbit',15,18,1.5,'Atinge apenas inimigos entre 3 e 8 m de distância. Cada inimigo atingido devolve 3% da mana máxima, até 15%.']
],
23:[
 ['Ponta Absoluta','tip',8,14,2.8,'Estoca apenas na faixa entre 4 e 8 m à frente, em uma linha estreita. Inimigos próximos demais não são atingidos.'],
 ['Recuo de Caça','retreat',10,18,1.1,'Recua 3 m e marca o alvo atingido por 6s. Seu próximo ataque básico nele causa +80% se você estiver a pelo menos 4 m.'],
 ['Cruz de Hastes','cross',12,22,1.1,'Dois cortes diagonais formam um X à frente. Um inimigo no cruzamento pode receber os dois golpes; quem está fora das faixas não é atingido.'],
 ['Cravo de Muralha','wall',12,18,1.7,'Golpeia um alvo. Se houver parede até 2 m atrás dele, causa +80% de dano e prende inimigos comuns por 2s.'],
 ['Fio da Fileira','file',14,24,2.4,'Perfura uma linha de 10 m do mais distante ao mais próximo. O primeiro recebe dano integral; cada alvo seguinte recebe 20% menos que o anterior.'],
 ['Bússola Partida','compass',10,16,1.9,'Atinge os flancos esquerdo e direito entre 2 e 6 m. As faixas diretamente à frente e atrás ficam fora do golpe.'],
 ['Medida do Caçador','measure',14,18,1.2,'Marca a distância até um alvo por 8s. O próximo ataque básico nele causa +25% por metro que você tiver se aproximado, até +150%.']
],
24:[
 ['Dízimo de Sangue','blood',15,0,0,'Sacrifica até 20% da vida máxima, sem matar você, e ganha Fúria proporcional: até 60. Não funciona com vida insuficiente ou Fúria cheia.'],
 ['Juramento da Cicatriz','scar',16,10,0,'Por 8s, prepara o próximo golpe desta classe. O dano extra cresce com a vida perdida desde o juramento, até +200%; o golpe consome o juramento.'],
 ['Partilha Brutal','share',12,22,4,'Divide o dano igualmente entre inimigos a até 6 m. Cada alvo que sobreviver devolve 5 de Fúria, até 25.'],
 ['Desafio do Maior','challenge',10,16,2.2,'Ataca o inimigo com maior vida atual a até 7 m. Se ele sobreviver, devolve 12 de Fúria; se morrer, não devolve.'],
 ['Penhor Carmesim','pledge',18,20,1.4,'Marca um alvo por 8s e sacrifica até 10% da vida máxima. Se você o abater durante a marca, recupera o dobro da vida sacrificada, respeitando bloqueios de cura.'],
 ['Corrente de Sacrifícios','chainblood',15,18,1,'Atinge até 5 alvos, do mais próximo ao mais distante. Cada golpe custa 2% da vida máxima e causa 30% mais dano que o anterior. Para antes de matar você.'],
 ['Estilhaço da Égide','shatter',14,12,1.3,'Consome todo o seu escudo atual. Atinge inimigos em 5 m, dividindo entre eles dano adicional igual a duas vezes o escudo consumido. Exige escudo.']
]};
for(const [key,rows] of Object.entries(defs)){const ci=+key;for(const [n,mode,cd,mp,pow,brief] of rows){const si=CLASSES[ci].sk.length;CLASSES[ci].sk.push({n,t:'class316',new316:true,mode316:mode,cd,mp,pow,col:CLASSES[ci].sk[0].col,range:10,radius:6,sourceClass:ci,skillId:ci+':'+si,resource260:ci===22?'mana':ci===23?'vigor':'fury',brief316:brief})}}
const state=()=>player.class316||(player.class316={});
const dist=e=>Math.hypot(e.x-player.x,e.z-player.z);
const targets=(r=10)=>enemies.filter(e=>!e.dead&&!e.ally&&!e.friendly217&&dist(e)<=r+(e.r||0)&&los(player.x,player.z,e.x,e.z)).sort((a,b)=>dist(a)-dist(b));
const fury=n=>{const r=martialState260();r.fury=Math.max(0,Math.min(furyMaxR260(),r.fury+n));r.furyWait=resourceWait263('fury')};
const heal=n=>{if(!hasAff('nocure'))player.hp=Math.min(player.maxhp,player.hp+n)};
function sidePoint(sign,back=false){const a=player.face+(back?Math.PI:sign*Math.PI/2),x=player.x+Math.sin(a)*3,z=player.z+Math.cos(a)*3;return freeAt(x,z,player.r||.5)&&los(player.x,player.z,x,z)?{x,z}:null}
function segment(e,a,b,width){const dx=b.x-a.x,dz=b.z-a.z,l=dx*dx+dz*dz,t=l?Math.max(0,Math.min(1,((e.x-a.x)*dx+(e.z-a.z)*dz)/l)):0;return Math.hypot(e.x-a.x-t*dx,e.z-a.z-t*dz)<=width+(e.r||0)}
function check(s){const ts=targets(({wheel:6,share:6,shatter:5,challenge:7})[s.mode316]||10),r=martialState260();
 if(['balance','stitch','dyad'].includes(s.mode316)&&ts.length<2)return 'São necessários dois inimigos visíveis.';
 if(!['breath','reserve','blood','scar','eight'].includes(s.mode316)&&!ts.length)return 'Nenhum inimigo visível no alcance.';
 if(s.mode316==='breath'&&(r.vigor<1||r.fury>=furyMaxR260()))return 'Precisa de Vigor e espaço na barra de Fúria.';
 if(s.mode316==='blood'&&(player.hp<=1||r.fury>=furyMaxR260()))return 'Precisa de vida e espaço na barra de Fúria.';
 if(s.mode316==='shatter'&&!(player.shield>0))return 'Precisa de escudo atual para estilhaçar.';
 if(s.mode316==='reserve'&&player.mp<=resourceCost260(s))return 'Precisa de mana além do custo para criar a reserva.';
 if(s.mode316==='chainblood'&&player.hp<=player.maxhp*.02+1)return 'Vida insuficiente para iniciar os sacrifícios.';
 if(s.mode316==='eight'&&!sidePoint(state().side||1))return 'Caminho lateral bloqueado.';
 if(s.mode316==='retreat'&&!sidePoint(1,true))return 'Caminho de recuo bloqueado.';
 return '';
}
const baseNewRun=newRun;newRun=function(){if(typeof player!=='undefined'&&player)player.class316={};if(typeof enemies!=='undefined')for(const e of enemies)for(const key of ['echo316','five316','alternate316','tithe316','retreat316','measure316','pledge316'])delete e[key];return baseNewRun.apply(this,arguments)};
const baseUse=useSkill;useSkill=function(s){if(s?.new316){if(!player||player.dead||paused||s.cdT>0)return false;if(!learnedSkills().some(x=>x.skillId===s.skillId)||!player.skills.some(x=>!x.empty&&x.skillId===s.skillId))return false;const err=check(s);if(err){toast(err);return false}}return baseUse.apply(this,arguments)};
const baseDesc=skillEffect102;skillEffect102=function(s){return s?.new316?s.brief316:baseDesc.apply(this,arguments)};
const baseDamage=skillHasDamage;skillHasDamage=function(s){return s?.new316?s.pow>0:baseDamage.apply(this,arguments)};
const baseRun=runSkill;runSkill=function(s){if(!s?.new316)return baseRun.apply(this,arguments);const P=player,k=state(),ts=targets(),e=ts[0],d=skillDamage(s);let mult=1;
 if(s.sourceClass===24&&s.pow>0&&k.scar&&k.scar.until>time){mult+=Math.min(2,Math.max(0,k.scar.hp-P.hp)/P.maxhp*5);k.scar=null}
 const hit=(enemy,power=1,extra=0)=>{if(!enemy||enemy.dead)return 0;return hurtEnemy(enemy,Math.max(0,d*power*mult+extra),P.x,P.z,{fromPlayer:true,skillHit:true,new316:true,kb:0,stun:0})||0};
 const mark=(enemy,key,data)=>{enemy[key]={until:time+8,...data}};
 skillAnim155({...s,t:s.sourceClass===22?'bolt':'cone'});fxRing(P.x,P.z,s.col,3,.45);sfx('skill');
 switch(s.mode316){
 case 'echo':mark(e,'echo316',{hits:0,damage:d*1.8});hit(e);break;
 case 'eight':{const dest=sidePoint(k.side||1),a={x:P.x,z:P.z};if(!dest)break;k.side=-(k.side||1);P.x=dest.x;P.z=dest.z;for(const x of ts)if(segment(x,a,dest,1))hit(x);fxRing(a.x,a.z,s.col,1,.5);break}
 case 'breath':{const r=martialState260(),n=Math.min(30,r.vigor,(furyMaxR260()-r.fury)/2);r.vigor-=n;r.vigorWait=resourceWait263('vigor');fury(n*2);break}
 case 'cadence':{const casting=e.act&&!e.act.done&&e.act.t<e.act.wind;hit(e,casting?2:1);if(casting&&!e.isBoss&&!e.dead){e.act=null;e.stun=Math.max(e.stun||0,1)}break}
 case 'balance':{const bonus=1+Math.abs(ts[0].hp/ts[0].maxhp-ts[1].hp/ts[1].maxhp);hit(ts[0],bonus);hit(ts[1],bonus);break}
 case 'five':mark(e,'five316',{until:time+10,hits:0});hit(e);break;
 case 'wheel':{const r=martialState260(),n=Math.min(5,1+Math.floor(r.fury/10)),victims=targets(6);r.fury=0;for(let i=0;i<n;i++)hit(victims[i%victims.length]);break}
 case 'alternate':mark(e,'alternate316',{until:time+10,last:null});hit(e);break;
 case 'reserve':{const mana=Math.min(P.mp,P.maxmp*.2);P.mp-=mana;k.reserve={until:time+8,damage:mana*2+P.dmg*.5};break}
 case 'stitch':{let pair=[ts[0],ts[1]],long=0;for(const a of ts)for(const b of ts){const len=Math.hypot(a.x-b.x,a.z-b.z);if(len>long&&los(a.x,a.z,b.x,b.z)){long=len;pair=[a,b]}}for(const x of ts)if(segment(x,pair[0],pair[1],.8))hit(x);fxRing(pair[0].x,pair[0].z,s.col,1,.5);fxRing(pair[1].x,pair[1].z,s.col,1,.5);break}
 case 'tithe':mark(e,'tithe316',{hits:0});hit(e);break;
 case 'reservoir':{const n=Math.min(P.mp,P.maxmp*.25);P.mp-=n;hit(e,1+1.5*n/Math.max(1,P.maxmp*.25));break}
 case 'dyad':{const a=ts[0],b=ts[1],m=1+Math.min(1,Math.hypot(a.x-b.x,a.z-b.z)*.1);hit(a,m);hit(b,m);break}
 case 'orbit':{let count=0;for(const x of ts)if(dist(x)>=3&&dist(x)<=8&&hit(x)>0)count++;P.mp=Math.min(P.maxmp,P.mp+P.maxmp*.03*Math.min(5,count));break}
 case 'tip':case 'file':{const a={x:P.x,z:P.z},dir={x:Math.sin(P.face),z:Math.cos(P.face)},max=s.mode316==='tip'?8:10,b={x:a.x+dir.x*max,z:a.z+dir.z*max};const line=ts.filter(x=>{const along=(x.x-a.x)*dir.x+(x.z-a.z)*dir.z;return along>=(s.mode316==='tip'?4:0)&&along<=max&&segment(x,a,b,.65)}).sort((a,b)=>dist(b)-dist(a));line.forEach((x,i)=>hit(x,s.mode316==='file'?Math.pow(.8,i):1));waveFwd(P.x,P.z,P.face,s.col,max,1);break}
 case 'retreat':{const dest=sidePoint(1,true);if(!dest)break;P.x=dest.x;P.z=dest.z;mark(e,'retreat316',{until:time+6});hit(e);break}
 case 'cross':{for(const angle of [-.55,.55]){const a={x:P.x+Math.sin(P.face-angle)*2,z:P.z+Math.cos(P.face-angle)*2},b={x:P.x+Math.sin(P.face+angle)*7,z:P.z+Math.cos(P.face+angle)*7};for(const x of ts)if(segment(x,a,b,.6))hit(x)}break}
 case 'wall':{const len=dist(e)||1,x=e.x+(e.x-P.x)/len*2,z=e.z+(e.z-P.z)/len*2,wall=!freeAt(x,z,e.r||.5);hit(e,wall?1.8:1);if(wall&&!e.isBoss&&!e.dead)e.kitRoot111=time+2;break}
 case 'compass':{for(const x of ts){const dx=x.x-P.x,dz=x.z-P.z,along=dx*Math.sin(P.face)+dz*Math.cos(P.face),across=dx*Math.cos(P.face)-dz*Math.sin(P.face);if(dist(x)>=2&&dist(x)<=6&&Math.abs(across)>Math.abs(along)*1.5)hit(x)}break}
 case 'measure':mark(e,'measure316',{distance:dist(e)});hit(e);break;
 case 'blood':{const n=Math.min(P.maxhp*.2,P.hp-1);P.hp-=n;fury(n/P.maxhp*300);break}
 case 'scar':k.scar={until:time+8,hp:P.hp};break;
 case 'share':{const near=targets(6);let n=0;for(const x of near){hit(x,1/near.length);if(!x.dead)n++}fury(Math.min(25,n*5));break}
 case 'challenge':{const target=targets(7).sort((a,b)=>b.hp-a.hp)[0];hit(target);if(target&&!target.dead)fury(12);break}
 case 'pledge':{const n=Math.min(P.maxhp*.1,P.hp-1);P.hp-=n;mark(e,'pledge316',{heal:n*2});hit(e);break}
 case 'chainblood':{let n=0;for(const x of ts.slice(0,5)){const loss=P.maxhp*.02;if(P.hp<=loss+1)break;P.hp-=loss;hit(x,1+.3*n++);}break}
 case 'shatter':{const near=targets(5),shield=P.shield;P.shield=0;for(const x of near)hit(x,1,shield*2/near.length);break}
 }
};
const baseHit=hurtEnemy;hurtEnemy=function(e,amt,x,z,o={}){if(!e||e.dead)return baseHit.apply(this,arguments);const basic=o.fromPlayer&&Number.isInteger(o.basicClass)&&!o.skillHit,alt=e.alternate316;
 if(o.fromPlayer&&!o.new316&&alt?.until>time){const type=MAGIC_CLS.includes(o.basicClass??profile.cls)?'mag':'phy';if(alt.last&&alt.last!==type)amt*=1.35}
 if(basic){if(e.five316?.until>time){amt*=1+.08*(e.five316.hits+1)}if(e.retreat316?.until>time){if(dist(e)>=4)amt*=1.8}if(e.measure316?.until>time){amt*=1+Math.min(1.5,Math.max(0,e.measure316.distance-dist(e))*.25)}}
 const dealt=baseHit.call(this,e,amt,x,z,o);
 if(o.fromPlayer&&!o.new316&&dealt>0&&alt?.until>time)alt.last=MAGIC_CLS.includes(o.basicClass??profile.cls)?'mag':'phy';
 if(basic&&dealt>0){if(e.five316?.until>time&&++e.five316.hits>=5)e.five316=null;e.retreat316=null;e.measure316=null;if(e.tithe316?.until>time){player.mp=Math.min(player.maxmp,player.mp+player.maxmp*.04);if(++e.tithe316.hits>=3)e.tithe316=null}if(e.echo316?.until>time&&++e.echo316.hits>=3){const echo=e.echo316;e.echo316=null;for(const a of targets(12))if(Math.hypot(a.x-e.x,a.z-e.z)<=3&&los(e.x,e.z,a.x,a.z))baseHit(a,echo.damage,e.x,e.z,{fromPlayer:true,skillHit:true,new316:true,kb:0,stun:0});fxRing(e.x,e.z,0xffc86a,3,.5)}const reserve=state().reserve;if(reserve?.until>time){state().reserve=null;const oldType=curDType281;try{curDType281='mag';for(const a of targets(12))if(a!==e&&Math.hypot(a.x-e.x,a.z-e.z)<=3&&los(e.x,e.z,a.x,a.z))baseHit(a,reserve.damage,e.x,e.z,{fromPlayer:true,skillHit:true,new316:true,kb:0,stun:0})}finally{curDType281=oldType}fxRing(e.x,e.z,0x8fa0ff,3,.5)}}
 if(o.fromPlayer&&e.dead&&e.pledge316?.until>time){heal(e.pledge316.heal);e.pledge316=null}return dealt;
};
window.Classes316={defs,check,targets};
})();
