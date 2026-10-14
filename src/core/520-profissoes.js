/* ===== PROFISSÕES ===== */
const PROFN={mine:'Mineração',forge:'Forja',fish:'Pesca'};
function profLv(k){return Math.floor(Math.sqrt((((profile.prof||{})[k])||0)/20))}
function profXp(k,v){profile.prof=profile.prof||{};const l0=profLv(k);profile.prof[k]=(profile.prof[k]||0)+v;const l1=profLv(k);if(l1>l0){toast('<b>[PROFISSÃO]</b> '+PROFN[k]+' subiu para o nível <b>'+l1+'</b>. Veja em PERSONAGEM (topo da ficha).',5000);sfx('level')}}
function profRows(){const D={mine:l=>'+'+Math.min(100,l*5)+'% de chance de +1 cristal por golpe',forge:l=>'raridades melhores ao forjar (+'+l+' nível de sorte)',fish:l=>'faixa da pesca +'+String(Math.min(10,l*.5)).replace('.',',')+'%'};let h='<div class="sec">PROFISSÕES</div>';
  for(const k in PROFN){if(!((profile.prof||{})[k]>0))continue;const l=profLv(k),x=((profile.prof||{})[k])||0,nx=20*(l+1)*(l+1);h+=row(PROFN[k]+' <b>NV '+l+'</b>',D[k](l)+' · '+fmt(x)+'/'+fmt(nx)+' XP','')}return h}

