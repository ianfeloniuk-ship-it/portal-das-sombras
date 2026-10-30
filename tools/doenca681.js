/* v681 (Ian: «Contágio e estágios»; documento "Primeva — Doença e Transformação" aprovado em 29/10/2026, passo 1 da
   ordem do documento): as três doenças pegam de criatura de verdade, incubam, e depois de tomar conta avançam por
   estágios com bônus e preço. Liga em tools/corpo659.js (golpe que fere grau 2+, hora do jogo, ficha Status → Corpo).
   PEGAR    Sangue Antigo = vampiro despertado (1 em 10); Maldição da Lua = lobisomem, só de noite (1 em 8);
            Praga do Túmulo = draugr (1 em 12). Só golpe que abre ferida de grau 2 ou mais; golpe defendido não fere.
   INCUBA   Sangue 3 dias do jogo; Túmulo 2 dias; Lua até a próxima lua cheia (a cada 28 dias do jogo, v696).
            Enquanto incuba, cura barata: Álcool Forte ou o médico (já existiam).
   ESTÁGIO  Vampiro: 1 Saciado (bebeu há menos de 1 dia), 2 Sedento (1–2 dias), 3 Faminto (2–3), 4 Sangue à tona (3+).
            Sol de dia, ao ar livre: −5/−10/−15/−15 de vida por segundo. Enxerga no escuro já no 1.
            Draugr: 1 Frio, 2 Pele cinza (3 dias sem carne crua: −20% de velocidade), 3 Túmulo (6 dias sem carne crua).
            Comer Carne Crua volta ao 1. Lobisomem: sem estágios; a ficha mostra a próxima lua cheia.
   AINDA NÃO (próximos passos do documento): beber sangue, tecla da forma, lua cheia forçando a fera, Raiva, Grito do
   Túmulo, bônus de dano à noite, crime, curas pesadas. */
(function(global){
'use strict';
const CHUNK='[DOENÇA]',FULL=28;/* v696 (Ian): lua cheia a cada 28 dias do jogo */
const DEF={
  sangue:{n:'Sangue Antigo',forma:'Vampiro',re:/Vampir/,em:10,inc:72,sinal:'Seus olhos amanhecem vermelhos e a água não mata a sede.'},
  lua:{n:'Maldição da Lua',forma:'Lobisomem',re:/Lobisomem/,em:8,noite:true,inc:'lua',sinal:'A ferida não fecha e você sonha com caça.'},
  tumulo:{n:'Praga do Túmulo',forma:'Draugr',re:/Draugr/,em:12,inc:48,sinal:'A pele das suas mãos ficou cinza e o frio não passa.'}
};
const VST=[null,{n:'Saciado',b:'Enxerga no escuro.',p:'−5 de vida por segundo ao sol.'},{n:'Sedento',b:'Enxerga no escuro.',p:'−10 de vida por segundo ao sol.'},
  {n:'Faminto',b:'Enxerga no escuro.',p:'−15 de vida por segundo ao sol.'},{n:'Sangue à tona',b:'Enxerga no escuro.',p:'−15 de vida por segundo ao sol.'}];
const DST=[null,{n:'Frio',b:'Não sente frio.',p:'Nenhum ainda.'},{n:'Pele cinza',b:'Não sente frio.',p:'−20% de velocidade.'},{n:'Túmulo',b:'Não sente frio.',p:'−20% de velocidade.'}];
const SOL=[0,5,10,15,15];
const night=()=>{try{return typeof isNight==='function'&&isNight()}catch(_){return false}};
const day=()=>{try{return typeof gameDay198==='function'?gameDay198():0}catch(_){return 0}};
const corpo=()=>{try{return run&&run.corpo659}catch(_){return null}};
const dias=h=>{h=Math.max(0,Math.ceil(h));const d=Math.floor(h/24),r=h%24;return (d?d+(d===1?' dia':' dias'):'')+(d&&r?' e ':'')+(r||!d?r+(r===1?' hora':' horas'):'')};
function luaEm(){const d=day(),f=d+((FULL-1-d%FULL+FULL)%FULL||FULL);return f-d}/* dias até a próxima lua cheia (nunca hoje) */
function luaCheia(){return day()%FULL===FULL-1}
function estagio(m,c){if(!m)return 0;if(m.k==='sangue'){const h=c.hh-m.fed;return h<24?1:h<48?2:h<72?3:4}
  if(m.k==='tumulo'){const h=c.hh-m.meat;return h<72?1:h<144?2:3}return 0}
const API=global.Doenca681={DEF,estagio,luaCheia,luaEm,FULL,
  /* v696: fase da Lua 0..1 (1 = cheia, 0 = nova) para o céu (tools/vento687.js) */
  fase(){const d=day()%FULL,a=((d+1)%FULL)/FULL*Math.PI*2;return .5+.5*Math.cos(a)},
  /* golpe que feriu: rola a doença da criatura (chamado por corpo659 com o grau da parte) */
  rolar(c,e,g,nome){if(g<2||c.disease||c.mal681)return;for(const [k,D] of Object.entries(DEF)){if(!D.re.test(nome||''))continue;
      if(D.noite&&!night())return;if(Math.random()*D.em>=1)return;API.pegar(c,k);return}},
  pegar(c,k){const D=DEF[k];const h=D.inc==='lua'?luaEm()*24:D.inc;c.disease={k,until:c.hh+h,d681:true};
    try{toast('<b>'+CHUNK+'</b> '+D.sinal+' Você pegou '+D.n+'. Toma conta em '+dias(h)+'. Antes disso, Álcool Forte ou o médico curam.',8000)}catch(_){}},
  /* uma vez por hora do jogo */
  hora(c){const d=c.disease;
    if(d&&!d.d681){const k=d.k==='vampirismo'?'sangue':'lua';c.disease={k,until:d.until,d681:true}}/* save antigo */
    if(c.disease&&c.hh>=c.disease.until){const k=c.disease.k;c.disease=null;c.mal681={k,at:c.hh,fed:c.hh,meat:c.hh,st:1};
      try{toast('<b>'+CHUNK+'</b> '+DEF[k].n+' tomou conta. Agora você é '+DEF[k].forma+'.',8000)}catch(_){}}
    const m=c.mal681;if(!m)return;const s=estagio(m,c);
    if(s!==m.st){const L_=m.k==='sangue'?VST:DST;if(s>m.st)try{toast('<b>'+CHUNK+'</b> '+L_[s].n+': '+(m.k==='sangue'?'beba sangue para voltar ao começo.':'coma Carne Crua para voltar ao começo.'),6000)}catch(_){}m.st=s}
    if(m.k==='lua'){const lc=luaCheia();if(lc&&!m.lc)try{toast('<b>'+CHUNK+'</b> Hoje é lua cheia.',5000)}catch(_){}m.lc=lc}},
  /* linhas da ficha Status → Corpo */
  ficha(c,R,esc){let h='';const d=c.disease,m=c.mal681;
    if(d&&d.d681)h+=R('<b>'+esc(DEF[d.k].n)+'</b>',esc('Incubando: toma conta em '+dias(d.until-c.hh)+' · cura agora com Álcool Forte ou o médico'),'');
    if(m){const D=DEF[m.k],s=estagio(m,c);
      if(m.k==='lua')h+=R('<b>'+esc(D.n)+'</b>',esc('Lobisomem · '+(luaCheia()?'hoje é lua cheia':'próxima lua cheia em '+luaEm()+(luaEm()===1?' dia':' dias'))),'');
      else{const E=(m.k==='sangue'?VST:DST)[s];h+=R('<b>'+esc(D.n)+'</b>',esc(D.forma+' · estágio '+s+' '+E.n+' · '+E.b+' '+E.p+(m.k==='sangue'?' Beber sangue volta ao 1.':' Comer Carne Crua volta ao 1.')),'')}}
    return h}
};
/* efeitos por segundo */
let acc=0,last=0;
if(typeof update==='function'){const u0=update;update=function(dt){const r=u0.apply(this,arguments);try{tick(Math.min(.1,dt||0))}catch(e){if(!API.err)API.err=String(e)}return r}}
function tick(dt){API.ticks=(API.ticks||0)+1;const c=corpo(),m=c&&c.mal681;if(!m||!player||player.dead)return;acc+=dt;if(acc<1)return;acc-=1;
  /* v696 (Ian): na noite de lua cheia o lobisomem vira fera sem escolher; ao amanhecer volta */
  if(m.k==='lua'&&global.Transforma677&&!Transforma677.scene){const T6=Transforma677,on=luaCheia()&&night()&&(typeof L==='undefined'||L.mode==='world');
    if(on&&!T6.cur){if(T6.start('lobisomem')){m.forced696=true;try{toast('<b>'+CHUNK+'</b> A lua cheia chama a fera. Você vira Lobisomem até o amanhecer.',7000)}catch(_){}}}
    else if(!on&&m.forced696&&T6.cur==='lobisomem'){m.forced696=false;T6.end()}}
  if(m.k==='sangue'){const s=estagio(m,c),out=typeof L==='undefined'||L.mode==='world';
    if(!night()&&out&&s>0){const n=SOL[s];player.hp-=n;try{floater(player.x,player.z,'-'+n,'#ffb040')}catch(_){}
      if(!m.solAviso){m.solAviso=1;try{toast('<b>'+CHUNK+'</b> O sol queima. Procure abrigo ou espere a noite.',5000)}catch(_){}}
      if(player.hp<=0){player.hp=0;try{die()}catch(_){}}}}}
/* comer Carne Crua acalma a Praga do Túmulo */
if(global.Corpo659&&Corpo659.onUse){const ou0=Corpo659.onUse;Corpo659.onUse=function(id){const r=ou0.apply(this,arguments);try{const c=corpo(),m=c&&c.mal681;
  if(id==='carne'&&m&&m.k==='tumulo'){m.meat=c.hh;m.st=1;toast('<b>'+CHUNK+'</b> A carne crua acalmou a praga. Estágio 1 Frio.',4000)}}catch(_){}return r}}
/* Pele cinza e Túmulo: −20% de velocidade */
if(typeof movementSpeed==='function'){const ms0=movementSpeed;movementSpeed=function(){const r=ms0.apply(this,arguments);try{const c=corpo(),m=c&&c.mal681;if(m&&m.k==='tumulo'&&estagio(m,c)>=2)return r*80/100}catch(_){}return r}}
})(typeof window!=='undefined'?window:globalThis);
