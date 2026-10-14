/* v396 (Ian, 14/10/2026): o Viajante chega sem classe e sem ouro. Kael troca a primeira arma por um fragmento
   (escambo, uma vez); a classe desperta ao equipar a primeira arma (qualquer origem). */
(function(){
  const KINDS={sword:{ci:0,n:'Espada'},axe:{ci:2,n:'Machado'},dagger:{ci:1,n:'Adaga'},bow:{ci:4,n:'Arco'},wand:{ci:5,n:'Varinha'},tome:{ci:6,n:'Tomo'},staff:{ci:8,n:'Cajado'}};
  const ALIAS={spear:'sword',bonestaff:'staff',orb:'staff'};
  const NAMEK={Espada:'sword',Machado:'axe',Adaga:'dagger',Arco:'bow',Varinha:'wand',Tomo:'tome',Cajado:'staff',Lança:'sword'};
  function kindOf(it){let k=it&&it.kind155||'';if(!KINDS[k])k=ALIAS[k]||'';if(!k){const m=String(it&&it.name||'').match(/^(\S+)/);k=m?NAMEK[m[1]]||'':''}return KINDS[k]?k:'sword'}
  function canBarter(){return !!(profile&&profile.classless&&!profile.kaelBarter396&&!run.equip.w&&!run.items.some(i=>i.slot==='w'))}
  function byWeapon(it){
    if(!profile||!profile.classless||!it||it.slot!=='w')return false;
    const ci=KINDS[kindOf(it)].ci;
    rememberClassCooldowns();
    delete profile.classless;profile.cls=ci;profile.jobs=[ci];AFFC=null;
    run.elem=CLASSES[ci].elem||null;run.style='nat';run.adv=false;run.classLoadout=[ci+':0'];
    store.set('pds2_profile',profile);
    const x=player.x,z=player.z;scene.remove(player.m.root);makePlayer();player.x=x;player.z=z;player.m.root.position.set(x,0,z);
    player.skills=pSkills();refreshStats();player.hp=player.maxhp;player.mp=player.maxmp;showG();
    bigText(CLASSES[ci].n.toUpperCase(),1600);sfx('arise');
    toast('<b>[NARRADOR]</b> Sua alma absorveu a mana da Fenda. Caminho de <b>'+CLASSES[ci].n+'</b> desperto! A primeira habilidade da classe já está na barra.',7000);
    saveRun();return true}
  function barter(kind){
    if(!canBarter()||!KINDS[kind]||!equipmentBagRoom())return false;
    const it=makeItem('w',0,0,kind);profile.kaelBarter396=true;store.set('pds2_profile',profile);addItem(it);
    toast('<b>Kael:</b> Você não tem moedas de Aster, Viajante. Ninguém que cai da Fenda tem. Deixe o fragmento de metal dos escombros comigo; sua primeira ferramenta de treino sai da forja agora.',7500);
    equipBagItem(it.uid);return true}
  function shopRows(){
    if(!canBarter())return '';
    let h='<div class="sec">ESCAMBO COM O KAEL</div><div class="sysline" style="font-size:12px">Sem ouro? Kael troca o fragmento de metal que você trouxe da estrada por uma arma de treino. <b>Só uma vez.</b> A arma que escolher desperta a sua classe.</div>';
    for(const k in KINDS)h+=row(KINDS[k].n+' de treino','Desperta o caminho de <b>'+CLASSES[KINDS[k].ci].n+'</b>.',btn('Trocar','barter396',k,true,'hot'));
    return h}
  window.Awaken396={byWeapon,barter,shopRows,canBarter,KINDS};
})();
