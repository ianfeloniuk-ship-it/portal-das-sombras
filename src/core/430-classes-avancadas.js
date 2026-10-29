/* ================= CLASSES AVANÇADAS ================= */
const ADV=[
  {n:'Cavaleiro Rúnico',sk:S('Lâmina Rúnica','cone',7,25,4.2,0xffd08a)},
  {n:'Lâmina Fantasma',sk:S('Mil Cortes','nova',8,25,3.6,0xa26bff)},
  {n:'Guardião de Aço',sk:S('Fortaleza Viva','guard',16,25,.12,0x9fd3ff)},
  {n:'Arquimago',sk:S('Meteoro','rain',10,35,3,0xff7a22)},
  {n:'Atirador Celestial',sk:S('Flecha Estelar','bolt',6,25,6,0xb8a2ff)},
  {n:'Paladino Solar',sk:S('Sol Nascente','heal',14,35,.7,0xfff3a0)},
  {n:'Mestre das Bestas',sk:S('Matilha Espiritual','summon',16,40,3,0x6ff4ff)},
  {n:'Senhor dos Servos',sk:S('Domínio dos Servos','nova',9,30,3.8,0xb98cff)},
  {n:'Arquimago Ígneo',sk:S('Sol Negro','rain',11,35,3.4,0xff3a1e)},
  {n:'Arquimago Glacial',sk:S('Era do Gelo','nova',11,35,3,0xbff4ff)},
  {n:'Arquimago Telúrico',sk:S('Colosso de Pedra','summon',16,40,2.5,0xc8a070)},
  {n:'Arquimago Tempestuoso',sk:S('Fúria dos Céus','chain',8,30,3.4,0xfff36b)}];
const JOB_LVL=30;
const weekId=()=>Math.floor(gameDay198()/7);/* v198 (Ian): semana de jogo = 7 dias de jogo (~56 min), não a semana real */
function gameDay198(){try{return Math.floor(dayT/DAYLEN)}catch(e){return 0}}
function gameLeftTxt198(sec){sec=Math.max(0,sec);const d=Math.floor(sec/DAYLEN),m=Math.ceil(sec/60);return (d>0?d+' dia'+(d>1?'s':'')+' de jogo · ':'')+'~'+m+' min'}
const weekLeft=()=>((weekId()+1)*7*DAYLEN-dayT);
function weeklyBoss(){const pool=[...BOSSES,...BOSSES_HIGH];return pool[weekId()%pool.length]}

