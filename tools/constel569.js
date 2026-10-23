/* v570 (Ian, 23/10/2026): constelações novas no estilo das habilidades do Skyrim (as 6 antigas ficam).
   18 ativas (só mexem em números que já existem) e 5 apagadas ("desperta em breve").
   Cada figura é um traço único de 11 estrelas (as estrelas se ligam em ordem). Efeitos: wrappers no fim. */
(function(){
'use strict';
const circ=(x,y,r)=>`M${x-r} ${y} a${r} ${r} 0 1 0 ${2*r} 0 a${r} ${r} 0 1 0 ${-2*r} 0Z`;
const seg=(a,b,w)=>{const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l*w/2,ny=dx/l*w/2;
  return['+',`M${a[0]+nx} ${a[1]+ny} L${b[0]+nx} ${b[1]+ny} L${b[0]-nx} ${b[1]-ny} L${a[0]-nx} ${a[1]-ny}Z`]};
const line=(pts,w=13)=>{const o=[];for(let i=0;i<pts.length-1;i++){o.push(seg(pts[i],pts[i+1],w));o.push(['+',circ(pts[i+1][0],pts[i+1][1],w/2)])}return o};
const mk=(fig,hue,pts,ex,lore,extra={})=>({fig,hue,pts,ex,lore,art:line(pts),...extra});
const spi=[];for(let i=0;i<11;i++){const a=i*.62,r=40+i*22;spi.push([300+Math.cos(a)*r,300+Math.sin(a)*r])}
const FIG={
 uma:mk('A Espada Solitária',[200,215,245],[[300,570],[300,480],[195,455],[405,455],[300,455],[324,360],[324,150],[300,30],[276,150],[276,360],[300,300]],
  n=>['Dano de espada ou adaga 100','<b>'+(100+2*n)+'</b>'],'Uma lâmina só, uma mão só. Em Aster dizem que quem domina uma espada nunca precisa de duas.'),
 dua:mk('O Machado Grande',[255,160,100],[[300,580],[300,460],[300,340],[300,220],[300,80],[410,60],[505,140],[495,245],[400,305],[300,300],[300,190]],
  n=>['Dano de machado, martelo ou lança 100','<b>'+(100+2*n)+'</b>'],'Os ferreiros do norte dizem que machado grande pede ombro grande.'),
 arq:mk('O Arco Estelar',[135,230,155],[[230,40],[140,120],[100,240],[110,360],[160,480],[240,570],[240,300],[380,300],[540,300],[475,255],[475,345]],
  n=>['Dano de flecha 100','<b>'+(100+2*n)+'</b>'],'A flecha que parte já escolheu o alvo. O arqueiro só concorda com ela.'),
 blo:mk('O Escudo do Guardião',[125,190,255],[[300,30],[470,70],[520,200],[480,370],[380,500],[300,570],[220,500],[120,370],[80,200],[130,70],[300,300]],
  n=>['Teto do escudo 100','<b>'+(100+2*n)+'</b>'],'Quem segura o escudo segura a linha.'),
 pes:mk('A Torre de Ferro',[170,175,195],[[170,580],[170,180],[170,90],[250,90],[250,150],[350,150],[350,90],[430,90],[430,580],[300,580],[300,420]],
  n=>['Dano recebido 100','<b>'+(100-n)+'</b>'],'Armadura pesada é uma muralha que anda.'),
 lev:mk('O Lobo Sombrio',[150,190,235],[[160,110],[130,300],[210,450],[300,575],[390,450],[470,300],[440,110],[350,210],[250,210],[210,300],[390,300]],
  n=>['Velocidade de movimento 100','<b>'+(100+n)+'</b>'],'O lobo não corre depressa por força: corre por não carregar peso que não precisa.'),
 des:mk('A Chama Antiga',[255,145,65],[[300,580],[190,500],[140,380],[200,270],[270,230],[260,120],[320,30],[380,150],[450,270],[460,420],[300,430]],
  n=>['Dano de habilidade 100','<b>'+(100+2*n)+'</b>'],'Fogo não pede licença. Destruir também é uma arte, e das mais antigas.'),
 res:mk('O Sol Curador',[255,225,135],[[300,150],[406,194],[450,300],[406,406],[300,450],[194,406],[150,300],[194,194],[300,40],[300,300],[460,160]],
  n=>['Recuperação natural 100','<b>'+(100+3*n)+'</b>'],'Todo ferimento fecha mais depressa sob a luz certa.'),
 con:mk('A Caveira Pálida',[195,165,255],[[150,300],[130,170],[210,70],[300,50],[390,70],[470,170],[450,300],[400,350],[400,500],[200,500],[200,350]],
  n=>['Vida e dano dos invocados 100','<b>'+(100+3*n)+'</b>'],'Os mortos atendem a quem fala baixo e com firmeza.'),
 for:mk('O Martelo da Forja',[255,175,75],[[300,580],[300,450],[300,320],[300,190],[160,190],[160,70],[440,70],[440,190],[300,190],[300,130],[300,60]],
  n=>['Custo de ouro da forja 100','<b>'+(100-2*n)+'</b>'],'Todo mestre ferreiro começou martelando ferro frio.'),
 alq:mk('O Frasco Verde',[125,230,155],[[250,40],[250,200],[130,380],[110,500],[200,570],[400,570],[490,500],[470,380],[350,200],[350,40],[300,380]],
  n=>['Cura da poção 100','<b>'+(100+3*n)+'</b>'],'Em cada frasco cabe um dia a mais.'),
 fts:mk('A Coruja Atenta',[215,195,135],[[140,120],[110,40],[230,90],[300,70],[370,90],[490,40],[460,120],[480,330],[400,520],[300,580],[200,520]],
  n=>['Dano do golpe furtivo ×3','<b>×'+(3+.06*n).toFixed(2).replace('.',',')+'</b>'],'A coruja não precisa de luz para ver nem de pressa para vencer.'),
 fal:mk('A Moeda de Aster',[255,215,105],[[300,40],[484,116],[560,300],[484,484],[300,560],[116,484],[40,300],[116,116],[300,170],[300,300],[300,430]],
  n=>['Preço de venda 100','<b>'+(100+n)+'</b>'],'Quem fala bem negocia bem.'),
 cer:mk('O Cervo Prateado',[175,225,155],[[300,560],[240,420],[230,300],[170,200],[110,90],[210,140],[300,250],[390,140],[490,90],[430,200],[370,300]],
  n=>['Ouro e XP de monstros do mundo aberto 100','<b>'+(100+2*n)+'</b>'],'O cervo prateado só aparece para quem sabe esperar.'),
 pei:mk('O Peixe Dourado',[255,195,95],[[70,300],[180,200],[320,170],[440,240],[560,140],[520,300],[560,460],[440,360],[320,430],[180,400],[150,270]],
  n=>['Valor do peixe 100','<b>'+(100+2*n)+'</b>'],'Pescar é a única guerra que se ganha esperando.'),
 min:mk('A Picareta Cravada',[195,195,205],[[300,580],[300,480],[300,380],[300,280],[300,180],[300,100],[170,110],[60,210],[430,110],[540,210],[300,300]],
  n=>['Chance de +1 cristal por golpe','<b>'+(3*n)+'%</b>'],'Toda montanha guarda algo que o mineiro paciente acaba encontrando.'),
 coz:mk('A Panela do Viajante',[255,170,110],[[80,250],[120,420],[210,520],[390,520],[480,420],[520,250],[420,200],[300,180],[180,200],[300,90],[300,300]],
  n=>['Duração da refeição 100','<b>'+(100+3*n)+'</b>'],'Comida quente vale mais que qualquer poção em noite fria.'),
 mon:mk('O Cavalo Alado',[210,200,255],[[150,560],[200,400],[170,250],[230,120],[340,40],[400,110],[480,230],[420,300],[330,260],[290,380],[300,200]],
  n=>['Velocidade montado 100','<b>'+(100+2*n)+'</b>'],'Quem monta bem chega antes e menos cansado.'),
 ilu:mk('A Máscara Sussurrante',[200,125,225],[[300,50],[440,90],[510,220],[470,400],[380,530],[300,575],[220,530],[130,400],[90,220],[160,90],[300,300]],null,'A máscara ainda dorme.',{soon:'Domine as mentes dos outros.'}),
 alt:mk('A Espiral Mutável',[125,225,215],spi,null,'A espiral gira, mas ninguém aprendeu a pará-la.',{soon:'Mude a forma das coisas.'}),
 enc:mk('A Runa Muda',[155,155,255],[[300,570],[300,450],[300,330],[300,210],[300,50],[440,150],[300,290],[160,390],[300,520],[420,440],[300,400]],null,'A runa existe, mas o gesto que a acorda ainda não foi ensinado.',{soon:'Encante armas e armaduras.'}),
 gat:mk('A Chave Torta',[235,205,125],[[300,570],[300,450],[300,330],[300,270],[200,230],[160,150],[200,70],[300,30],[400,70],[440,150],[400,230]],null,'A chave está no céu, mas não há fechadura que a aceite.',{soon:'Abra o que não é seu.'}),
 esc:mk('O Pico Nevado',[205,225,245],[[40,540],[140,400],[210,300],[260,200],[300,90],[350,200],[400,290],[470,400],[560,540],[300,540],[300,320]],null,'O sistema de escalada será revisto antes de despertar esta estrela.',{soon:'Escale mais depressa e com menos cansaço.'})
};
const fl=d=>['+',d],ct=d=>['-',d];
const ART={
 uma:[fl('M300 30 L332 120 L326 380 L274 380 L268 120 Z'),ct('M300 80 L304 380 L296 380 Z'),fl('M170 392 L430 392 L430 424 L170 424 Z'),fl('M284 424 L316 424 L316 520 L284 520 Z'),fl(circ(300,548,26))],
 dua:[fl('M288 40 L312 40 L312 580 L288 580 Z'),fl('M296 90 C220 40 120 70 70 170 C130 160 190 190 296 230 Z'),fl('M304 90 C380 40 480 70 530 170 C470 160 410 190 304 230 Z'),ct(circ(300,142,16))],
 arq:[...line([[230,40],[140,120],[100,240],[110,360],[160,480],[240,570]],26),seg([230,40],[230,570],5),seg([230,300],[540,300],7),fl('M570 300 L500 268 L500 332Z'),fl('M215 300 L250 276 L250 324Z')],
 blo:[fl('M300 40 C400 90 480 90 540 80 C550 260 500 450 300 570 C100 450 50 260 60 80 C120 90 200 90 300 40 Z'),ct('M300 100 C380 130 440 135 490 130 C490 270 440 420 300 510 C160 420 110 270 110 130 C160 135 220 130 300 100 Z'),fl(circ(300,290,62)),ct(circ(300,290,32)),fl('M290 130 L310 130 L310 450 L290 450Z')],
 pes:[fl('M170 150 L430 150 L450 570 L150 570 Z'),fl('M140 60 L200 60 L200 130 L240 130 L240 60 L280 60 L280 130 L320 130 L320 60 L360 60 L360 130 L400 130 L400 60 L460 60 L460 160 L140 160Z'),ct('M270 360 C270 300 330 300 330 360 L330 570 L270 570Z'),ct('M280 210 L320 210 L320 260 L280 260Z')],
 lev:[fl('M120 180 L190 50 L250 150 C280 140 320 140 350 150 L410 50 L480 180 C500 300 470 400 400 470 L300 580 L200 470 C130 400 100 300 120 180 Z'),ct('M190 250 L250 280 L240 310 L180 290Z M410 250 L350 280 L360 310 L420 290Z'),ct('M270 480 L300 520 L330 480 L300 450Z'),ct('M290 330 L310 330 L300 430Z')],
 des:[fl('M300 20 C340 120 470 190 470 360 C470 480 400 580 300 580 C200 580 130 480 130 360 C130 280 180 230 210 170 C220 230 250 250 270 230 C250 140 270 80 300 20 Z'),ct('M300 260 C340 330 390 360 390 440 C390 510 350 550 300 550 C250 550 210 510 210 440 C210 370 260 340 300 260 Z'),fl('M300 340 C320 390 350 410 350 460 C350 500 330 520 300 520 C270 520 250 500 250 460 C250 410 280 390 300 340 Z')],
 res:[fl(circ(300,300,105)),ct(circ(300,300,60)),fl(circ(300,300,34)),...[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4,c=Math.cos(a),s=Math.sin(a);return seg([300+c*150,300+s*150],[300+c*270,300+s*270],i%2?22:34)})],
 con:[fl('M300 40 C440 40 520 140 510 270 C505 340 460 370 440 400 L440 500 L160 500 L160 400 C140 370 95 340 90 270 C80 140 160 40 300 40Z'),ct(circ(220,260,58)),ct(circ(380,260,58)),ct('M300 320 L335 410 L265 410Z'),ct('M200 440 L215 440 L215 500 L200 500Z M245 440 L260 440 L260 500 L245 500Z M292 440 L308 440 L308 500 L292 500Z M340 440 L355 440 L355 500 L340 500Z M385 440 L400 440 L400 500 L385 500Z')],
 for:[fl('M120 100 L480 100 L480 220 L360 220 L360 570 L240 570 L240 220 L120 220Z'),ct('M150 130 L450 130 L450 190 L150 190Z'),fl('M430 80 L550 100 L550 220 L430 240Z')],
 alq:[fl('M240 40 L360 40 L360 80 L340 90 L340 220 C470 290 540 400 500 500 C470 570 130 570 100 500 C60 400 130 290 260 220 L260 90 L240 80Z'),ct('M150 450 C200 420 250 480 300 450 C350 420 400 480 450 450 C450 510 400 535 300 535 C200 535 150 510 150 450Z'),fl(circ(300,380,22)),fl(circ(360,320,14))],
 fts:[fl('M300 60 C420 60 500 150 500 270 C500 420 430 540 300 570 C170 540 100 420 100 270 C100 150 180 60 300 60Z'),fl('M130 140 L90 40 L220 90Z M470 140 L510 40 L380 90Z'),ct(circ(215,240,62)),ct(circ(385,240,62)),fl(circ(215,240,30)),fl(circ(385,240,30)),ct('M300 290 L340 360 L300 400 L260 360Z')],
 fal:[fl(circ(300,300,270)),ct(circ(300,300,225)),fl(circ(300,300,205)),ct(circ(300,300,160)),fl('M300 130 L320 270 L470 300 L320 330 L300 470 L280 330 L130 300 L280 270Z')],
 cer:[fl('M220 250 C220 200 380 200 380 250 L350 420 C340 490 260 490 250 420Z'),...line([[240,230],[190,130],[120,70]],20),...line([[190,130],[150,150]],16),...line([[260,200],[230,90]],16),...line([[360,230],[410,130],[480,70]],20),...line([[410,130],[450,150]],16),...line([[340,200],[370,90]],16),ct(circ(265,300,15)),ct(circ(335,300,15)),fl(circ(300,470,30))],
 pei:[fl('M70 300 C150 160 330 130 440 250 L560 150 L540 300 L560 450 L440 350 C330 470 150 440 70 300Z'),ct(circ(160,270,16)),ct('M240 220 C270 280 270 320 240 380 M300 200 C330 270 330 330 300 400'),fl('M220 130 C260 90 330 100 360 150 C320 170 270 170 220 130Z')],
 min:[fl('M285 120 L315 120 L330 570 L270 570Z'),fl('M60 200 C150 90 450 90 540 200 C470 140 380 140 330 160 L270 160 C220 140 130 140 60 200Z'),fl('M70 200 L40 260 L120 190Z M530 200 L560 260 L480 190Z')],
 coz:[fl('M90 230 L510 230 L490 450 C480 520 420 560 300 560 C180 560 120 520 110 450Z'),ct('M120 260 L480 260 L470 300 L130 300Z'),fl('M40 290 L90 290 L90 330 L40 330Z M510 290 L560 290 L560 330 L510 330Z'),fl('M250 90 C230 130 270 150 250 200 L270 200 C290 150 250 130 270 90Z M330 70 C310 120 350 150 330 200 L350 200 C370 150 330 120 350 70Z')],
 mon:[fl('M140 570 C150 450 170 380 200 330 C190 250 200 170 250 110 L290 40 L320 100 C400 100 470 150 510 240 L540 300 C520 320 480 310 450 290 C420 300 400 330 380 370 C370 450 350 520 340 570Z'),ct(circ(380,190,12)),fl('M250 110 C200 120 150 170 120 260 C150 220 190 190 230 180Z')],
 ilu:[fl('M300 50 C450 50 530 150 520 270 C510 420 410 560 300 570 C190 560 90 420 80 270 C70 150 150 50 300 50Z'),ct('M150 250 C190 210 250 230 270 280 C230 310 180 310 150 250Z'),ct('M450 250 C410 210 350 230 330 280 C370 310 420 310 450 250Z'),ct('M240 420 C280 450 320 450 360 420 C320 480 280 480 240 420Z')],
 alt:line(spi,26),
 enc:[...line([[300,40],[300,570]],28),...line([[300,160],[470,260],[300,360]],26),...line([[300,300],[140,400],[300,520]],26)],
 gat:[fl(circ(300,130,105)),ct(circ(300,130,52)),fl('M278 220 L322 220 L322 560 L278 560Z'),fl('M322 400 L420 400 L420 440 L322 440Z M322 500 L390 500 L390 540 L322 540Z')],
 esc:[fl('M20 560 L170 330 L230 400 L300 80 L370 320 L430 270 L580 560Z'),ct('M300 80 L255 260 L285 240 L300 280 L330 235 L345 255Z')]
};
for(const k in ART)if(FIG[k])FIG[k].art=ART[k];
const LIST=[
 ['uma','Uma Mão','+2% de dano com espadas e adagas por ponto','Ápice: mais +10% de chance de crítico com elas'],
 ['dua','Duas Mãos','+2% de dano com machados, martelos e lanças por ponto','Ápice: +15% de dano em alvo atordoado'],
 ['arq','Arquearia','+2% de dano com arco por ponto','Ápice: mais +10% de chance de crítico com arco'],
 ['blo','Bloqueio','+2% no teto dos escudos por ponto','Ápice: mais +10% no teto dos escudos'],
 ['pes','Armadura Pesada','−1% de dano recebido por ponto','Ápice: mais −5% de dano recebido'],
 ['lev','Armadura Leve','+1% de velocidade de movimento por ponto','Ápice: mais +10% de velocidade e esquiva 20% mais rápida'],
 ['des','Destruição','+2% de dano das habilidades por ponto','Ápice: mais +15% de dano das habilidades'],
 ['res','Restauração','+3% de recuperação natural por ponto','Ápice: mais +20% de recuperação natural'],
 ['con','Conjuração','+3% de vida e dano dos invocados por ponto','Ápice: +1 invocado ao mesmo tempo'],
 ['for','Forja','−2% de ouro nos serviços da forja por ponto','Ápice: mais −10% de ouro na forja'],
 ['alq','Alquimia','+3% de cura das poções por ponto','Ápice: mais +20% de cura das poções'],
 ['fts','Furtividade','+2% no dano do golpe furtivo por ponto','Ápice: Furtividade recarrega 20% mais rápido'],
 ['fal','Fala','+1% no preço de venda e −1% no de compra por ponto','Ápice: mais +10% no preço de venda'],
 ['cer','Caça','+2% de ouro e XP dos monstros do mundo aberto por ponto','Ápice: mais +20% de ouro e XP no mundo aberto'],
 ['pei','Pesca','+2% no valor dos peixes por ponto','Ápice: mais +20% no valor dos peixes'],
 ['min','Mineração','+3% de chance de +1 cristal por golpe por ponto','Ápice: mais +10% de chance de +1 cristal'],
 ['coz','Cozinha','+3% na duração das refeições por ponto','Ápice: mais +20% na duração das refeições'],
 ['mon','Montaria','+2% de velocidade montado por ponto','Ápice: mais +10% de velocidade montado']
];
const SOON=[['ilu','Ilusão'],['alt','Alteração'],['enc','Encantamento'],['gat','Gatunagem'],['esc','Escalada']];
window.CONS569={fig:FIG,list:LIST,soon:SOON};
try{for(const r of LIST)if(!CONS.some(c=>c[0]===r[0]))CONS.push(r)}catch(e){console.warn('CONS569',e)}

/* ===== efeitos: só mexem em números que já existem ===== */
const c=k=>{try{return cons(k)}catch(e){return 0}},ap=k=>c(k)>=10;
function grip(){let k='';try{k=String(weaponKind272(run.equip.w)||CLASSES[profile.cls]?.wep||'')}catch(e){}
  if(/bow|arco/i.test(k))return'bow';if(/great|axe|hammer|mace|spear|lan[cç]a|machado|martelo/i.test(k))return'2h';if(/sword|dagger|blade|katana|espada|adaga/i.test(k))return'1h';return''}
try{const h0=hurtEnemy;hurtEnemy=function(e,amt,sx,sz,o){
  if(o&&o.fromPlayer&&Number.isFinite(amt)&&amt>0){const g=grip();
    if(g==='1h'&&c('uma'))amt*=1+.02*c('uma');
    else if(g==='2h'&&c('dua')){amt*=1+.02*c('dua');if(ap('dua')&&e&&e.stun>0)amt*=1.15}
    else if(g==='bow'&&c('arq'))amt*=1+.02*c('arq')}
  return h0.call(this,e,amt,sx,sz,o)}}catch(e){console.warn('CONS569 hurtEnemy',e)}
try{const k0=critChance;critChance=function(){let v=k0.apply(this,arguments);const g=grip();if((g==='1h'&&ap('uma'))||(g==='bow'&&ap('arq')))v=Math.round((v+.1)*100)/100;return v}}catch(e){}
try{const s0=skillDamage;skillDamage=function(){const v=s0.apply(this,arguments);return v*(1+.02*c('des')+(ap('des')?.15:0))}}catch(e){}
try{const n0=naturalRegen;naturalRegen=function(){const r=n0.apply(this,arguments),m=1+.03*c('res')+(ap('res')?.2:0);if(m>1){r.hp=r.hp?Math.max(1,Math.round(r.hp*m)):0;r.mp=r.mp?Math.max(1,Math.round(r.mp*m)):0}return r}}catch(e){}
try{const p0=potionHealFraction;potionHealFraction=function(){return p0.apply(this,arguments)*(1+.03*c('alq')+(ap('alq')?.2:0))}}catch(e){}
try{const hp0=hurtPlayer;hurtPlayer=function(amt,...r){const m=1-.01*c('pes')-(ap('pes')?.05:0);if(m<1&&Number.isFinite(amt))amt*=m;return hp0.call(this,amt,...r)}}catch(e){}
try{const m0=movementSpeed;movementSpeed=function(raw){if(!Number.isFinite(raw))return m0.call(this,raw);
  let m=1+.01*c('lev')+(ap('lev')?.1:0);if(run&&run.mounted)m*=1+.02*c('mon')+(ap('mon')?.1:0);return m0.call(this,raw*m)}}catch(e){}
try{const d0=dodgeCdVal;dodgeCdVal=function(){return d0.apply(this,arguments)*(ap('lev')?.8:1)}}catch(e){}
try{const s1=skillCooldown;skillCooldown=function(sk){const v=s1.apply(this,arguments);return sk&&sk.t==='stealth'&&ap('fts')?Math.max(1,Math.round(v*.8)):v}}catch(e){}
try{const sp0=spawnSummon;spawnSummon=function(){const a=sp0.apply(this,arguments),q=1+.03*c('con');if(a&&q>1&&a.maxhp&&!a.c569){a.c569=1;a.maxhp=Math.round(a.maxhp*q);a.hp=Math.min(a.maxhp,Math.round(a.hp*q));if(Number.isFinite(a.dmg))a.dmg=Math.round(a.dmg*q)}return a}}catch(e){}
try{const sc=summonCap;summonCap=function(){return sc.apply(this,arguments)+(ap('con')?1:0)}}catch(e){}
try{const q0=lootForgeQuote;lootForgeQuote=function(){const q=q0.apply(this,arguments),m=1-.02*c('for')-(ap('for')?.1:0);if(q&&q.gold>0&&m<1)q.gold=Math.max(1,Math.round(q.gold*m));return q}}catch(e){}
try{const pm=priceMul;priceMul=function(){return pm.apply(this,arguments)*(1-.01*c('fal'))}}catch(e){}
try{const E=window.Econ154;if(E&&E.salePrice){const sp1=E.salePrice;E.salePrice=function(cat,base){return sp1.call(this,cat,base)*(1+.01*c('fal')+(ap('fal')?.1:0))}}}catch(e){}
try{const f0=fishValue;fishValue=function(){return Math.round(f0.apply(this,arguments)*(1+.02*c('pei')+(ap('pei')?.2:0)))}}catch(e){}
try{const r0=settleEnemyRewardBalance;settleEnemyRewardBalance=function(e){const r=r0.apply(this,arguments),n=c('cer');
  if(n&&typeof L!=='undefined'&&L.mode==='world'){const m=1+.02*n+(ap('cer')?.2:0);e.xp=Math.round(e.xp*m);e.gold=Math.round(e.gold*m);if(e.trainingXp262)e.trainingXp262=Math.round(e.trainingXp262*m)}return r}}catch(e){}
/* Cozinha: a refeição recém-comida dura mais (uma vez só por refeição) */
setInterval(()=>{try{const b=run&&run.surv437&&run.surv437.foodBuff;if(b&&!b.c569&&b.t>0){b.c569=1;const m=1+.03*c('coz')+(ap('coz')?.2:0);if(m>1)b.t=Math.round(b.t*m)}}catch(e){}},500);
})();
