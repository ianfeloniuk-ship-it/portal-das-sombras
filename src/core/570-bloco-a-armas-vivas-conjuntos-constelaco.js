/* ================= BLOCO A: ARMAS VIVAS, CONJUNTOS, CONSTELAÇÕES, REENCARNAÇÃO ================= */
const SOULS=['Morrigan','Kurogane','Vesper','Aurelia','Grimnir','Sable','Ignis','Nocturne'];
const WLINES=['Mais. Eu quero mais.','Esse aí tinha medo de você. Eu senti.','Você está ficando rápido. Gosto disso.','Não me solte. Nunca.','Eu já pertenci a um rei. Você é melhor.','Sinto cheiro de guardião por perto.'];
function weaponXp(x){if(!unl('living'))return;const w=run.equip.w;if(!w||!specialGear354(w))return;w.wlv=w.wlv||0;w.wxp=(w.wxp||0)+x*.25;const need=Math.round(120*Math.pow(w.wlv+1,1.5));
  if(w.wxp>=need&&w.wlv<10){w.wxp-=need;w.wlv++;refreshStats();floater(player.x,player.z,'ARMA NV '+w.wlv,'#ffd070');
    if(w.wlv===5&&w.rar>=2&&!w.soul){w.soul=pick(SOULS);bigText('A ARMA DESPERTOU',1500);sfx('arise');toast('<b>['+w.soul.toUpperCase()+']</b> Finalmente acordei. Me chame de '+w.soul+'.',6000)}}
  if(w.soul&&Math.random()<.02&&(!L.wtalk||time-L.wtalk>60)){L.wtalk=time;toast('<b>['+w.soul.toUpperCase()+']</b> '+pick(WLINES),4000)}}
const SETS=[{n:'Caçador Noturno',d:'+15% de dano',b:{dmg:.15}},{n:'Guardião',d:'+20% de vida',b:{hp:.2}},{n:'Arcano',d:'+25% de mana e +15% de dano de habilidade',b:{mp:.25,skill:.15}}];
function activeSets(){const counts={};for(const it of equippedItems())if(specialGear354(it)&&it.set)counts[it.set]=(counts[it.set]||0)+1;return SETS.filter(s=>counts[s.n]>=2)}
function setB(){const out={};for(const s of activeSets())for(const [k,v] of Object.entries(s.b))out[k]=(out[k]||0)+v;return out}

const /* v207 (Ian): Muralha removida (o reviver era forte demais; pontos devolvidos). Quatro constelações novas com efeitos diferentes. */
CONS=[['fur','Fúria','+1% de chance de crítico por ponto','Ápice: mais +10% de chance de crítico'],['arc','Arcano','−2% de recarga das habilidades por ponto','Ápice: mais −20% de recarga'],['cac','Caçador','+3% de ouro e XP dos monstros por ponto','Ápice: +25% de ouro de monstros com ameaça'],['vel','Vento','+1% de velocidade por ponto','Ápice: esquiva recarrega 20% mais rápido'],['san','Sangue','a cada 3 pontos, cura 1% do dano que você causa','Ápice: cada abate cura 3% da vida'],['som','Sombra','+2% de dano contra chefes por ponto','Ápice: mais +10% contra chefes']];
const cons=k=>{const c=run.cons||{};if(c.mur){run.cpts=(run.cpts||0)+c.mur;delete c.mur}return c[k]||0};
function consFull(){const c=run.cons||{};return CONS.every(([k,,,cap])=>(c[k]||0)>=10)}
function consView(){view=consView;run.cons=run.cons||{};L.characterTab='passives';let h=characterTabs('passives')+characterBack118('Constelações','passives')+'<div class="sysline">Pontos de constelação: <b>'+(run.cpts||0)+'</b>. Ganhe 1 por nível a partir do 35.'+(consFull()?' <b style="color:#ffd54f">Constelações completas:</b> os pontos que sobram viram pontos de status no botão abaixo.':'')+'</div>'+(consFull()&&run.cpts>0?'<div style="display:flex;justify-content:flex-end">'+btn('CONVERTER '+run.cpts+' PONTOS EM '+run.cpts+' DE STATUS','consconv',0,true,'hot')+'</div>':'');
  for(const [k,n,d,cap] of CONS){const v=cons(k);h+=row(n+' <b>'+v+'/10</b>','<span style="color:#ffd070">'+'★'.repeat(v)+'☆'.repeat(10-v)+'</span> · '+d+' · '+cap,btn('+1','cons',k,(run.cpts||0)>0&&v<10))}
  openModal('PERSONAGEM',h,'constel')}
const rebirthB=()=>1+.1*(profile.rebirths||0);
