/* v396/v398 (Ian, 14/10/2026): o Viajante chega sem classe e sem ouro. Kael troca a primeira arma por escambo (uma vez);
   a classe desperta ao equipar a primeira arma. Arma com mais de uma classe comum → pergunta a vocação. */
(function(){
  const ORDER=['sword','axe','dagger','bow','spear','staff','wand','tome','none'];
  const LABEL={sword:'Espada',axe:'Machado',dagger:'Adaga',bow:'Arco',spear:'Lança',staff:'Cajado',wand:'Varinha',tome:'Tomo',none:'Punhos (sem arma)'};
  const ALIAS={bonestaff:'staff',orb:'staff'};
  const NAMEK={Espada:'sword',Machado:'axe',Adaga:'dagger',Arco:'bow',Varinha:'wand',Tomo:'tome',Cajado:'staff',Lança:'spear',Lanca:'spear'};
  /* classes comuns iniciais (não raras, não legadas, com peso de sorteio) por tipo de arma — direto de CLASSES */
  function kindClasses(){const m={};CLASSES.forEach((c,i)=>{if(c.rare||c.legacy||c.complement103||!(c.w>0)||!c.wep)return;(m[c.wep]=m[c.wep]||[]).push(i)});return m}
  function kindOf(it){let k=it&&it.kind155||'';k=ALIAS[k]||k;const KC=kindClasses();if(!KC[k]){const m=String(it&&it.name||'').match(/^(\S+)/);k=m?NAMEK[m[1]]||'':''}return KC[k]?k:'sword'}
  function canBarter(){return !!(profile&&profile.classless&&!profile.kaelBarter396&&!run.equip.w&&!run.items.some(i=>i.slot==='w'))}
  let pending=null,silent=false;
  function awaken(ci){
    if(!profile||!profile.classless||!CLASSES[ci])return false;
    pending=null;rememberClassCooldowns();
    delete profile.classless;profile.cls=ci;profile.jobs=[ci];AFFC=null;
    run.elem=CLASSES[ci].elem||null;run.style=MAGIC_CLS.includes(ci)&&run.equip.w&&!weaponIsMagic173(run.equip.w)?'off':'nat';run.adv=false;run.classLoadout=[ci+':0'];
    store.set('pds2_profile',profile);
    const x=player.x,z=player.z;scene.remove(player.m.root);makePlayer();player.x=x;player.z=z;player.m.root.position.set(x,0,z);
    player.skills=pSkills();refreshStats();player.hp=player.maxhp;player.mp=player.maxmp;showG();
    try{closeModal()}catch(e){}
    bigText(CLASSES[ci].n.toUpperCase(),1600);sfx('arise');
    toast('<b>[NARRADOR]</b> Sua alma absorveu a mana da Fenda. Caminho de <b>'+CLASSES[ci].n+'</b> desperto! A primeira habilidade da classe já está na barra.',7000);
    window.Campaign327?.tick();saveRun();return true}
  function askVocation(kind,mode){
    const list=kindClasses()[kind]||[];
    pending={kind,mode};
    view=()=>askVocation(kind,mode);
    let h='<div class="sysline"><b>Qual caminho sua alma desperta com esta arma?</b> ('+LABEL[kind]+')</div>';
    for(const ci of list){const c=CLASSES[ci];h+=row('<b>'+c.n+'</b>',(PASSIVES[ci]?PASSIVES[ci].n+': '+PASSIVES[ci].d+'<br>':'')+c.sk.map(s=>s.n).join(' · '),btn('Despertar','vocation396',ci,true,'hot'))}
    openModal('VOCAÇÃO',h)}
  /* mode 'barter': a arma ainda não existe; mode 'equip': já está equipada */
  function choose(ci){
    ci=+ci;if(!pending||!(kindClasses()[pending.kind]||[]).includes(ci))return false;
    const p=pending;
    if(p.mode==='barter')return barter(p.kind,ci);
    return awaken(ci)}
  function byWeapon(it){
    if(silent||!profile||!profile.classless||!it||it.slot!=='w')return false;
    const k=kindOf(it),list=kindClasses()[k]||[];
    if(list.length>1){askVocation(k,'equip');return true}
    return awaken(list[0]!=null?list[0]:0)}
  function barter(kind,ci){
    if(!canBarter())return false;const list=kindClasses()[kind];if(!list)return false;
    if(ci==null){if(list.length>1){askVocation(kind,'barter');return true}ci=list[0]}
    if(!list.includes(+ci))return false;ci=+ci;
    if(kind==='none'){profile.kaelBarter396=true;store.set('pds2_profile',profile);
      toast('<b>Kael:</b> Sem arma? Há quem aprenda a lutar só com as mãos. O que você carrega na alma vale mais que qualquer aço, Viajante.',7500);
      return awaken(ci)}
    if(!equipmentBagRoom())return false;
    const it=makeItem('w',0,0,kind);profile.kaelBarter396=true;store.set('pds2_profile',profile);addItem(it);
    toast('<b>Kael:</b> Você não tem moedas de Aster, Viajante. Ninguém que cai da Fenda tem. Deixe isso comigo: sua primeira arma de treino sai da forja agora.',7500);
    silent=true;try{equipBagItem(it.uid)}finally{silent=false}
    awaken(ci);
    return true}
  function shopRows(){
    if(!canBarter())return '';
    const KC=kindClasses();
    let h='<div class="sec">ESCAMBO COM O KAEL</div><div class="sysline" style="font-size:12px">Sem ouro? Kael entrega sua primeira arma de treino por escambo inicial. <b>Só uma vez.</b> A arma que escolher desperta a sua classe; se ela serve a mais de uma, você escolhe o caminho em seguida.</div>';
    for(const k of ORDER){const l=KC[k];if(!l)continue;h+=row(k==='none'?LABEL[k]:LABEL[k]+' de treino',(l.length>1?'Caminhos: ':'Caminho: ')+'<b>'+l.map(i=>CLASSES[i].n).join(', ')+'</b>.',btn(l.length>1?'Escolher':'Trocar','barter396',k,true,'hot'))}
    return h}
  /* se a janela de vocação for fechada sem escolher, pergunta de novo */
  setInterval(()=>{try{if(started&&run&&player&&profile&&profile.classless&&run.equip.w&&!profile.creationPending91&&!modalOpen){const k=kindOf(run.equip.w);if((kindClasses()[k]||[]).length>1)askVocation(k,'equip');else byWeapon(run.equip.w)}}catch(e){}},2500);
  window.Awaken396={byWeapon,barter,choose,awaken,shopRows,canBarter,kindClasses,LABEL};
})();
