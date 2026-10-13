from pathlib import Path
g=Path(__file__).resolve().parent.parent
src=(g/'tools/test_beetle352.py').read_text(encoding='utf-8')
extra='''
 for(const kind of ['escaravelho','escaravelho_f','escaravelho_a']){
  prepareG();const e=spawnKind(kind,player.x+3,player.z,0,{noFendido:true,wild:true});e.cd=0;
  check(e.m.mon===kind&&e.m.clips.length===8,kind+' modelo próprio');
  if(kind!=='escaravelho'){Variants308.dress(e);let generic=0;e.m.root.traverse(o=>{if(o.material?.name==='FendaCristal')generic++});check(generic===0&&!e.orb308,kind+' sem adereços duplicados');player.shiny352=false;await waitG(34);check(e.beetle352?.phase==='wind',kind+' reage sem equipamento brilhante');}
  corpseDrop353(e,{type:'gold',n:1});killEnemy(e);await waitG(1600);
  check(!e.gone,kind+' morte não cortada em 1,4s');await waitG(1600);
  const action=gAct(e.m,'Death_A');check(action.time>=action.getClip().duration-.02,kind+' morte termina');
  check(e.corpse353&&Loot353.records().some(r=>r.id===e.corpse353),kind+' saque preservado');
 }
'''
src=src.replace(" reportG('PASSOU '+checks+' verificações no jogo');",extra+" reportG('PASSOU '+checks+' verificações no jogo');")
src=src.replace("Path('beetle-playtest.html')","Path('family-playtest.html')")
exec(compile(src,'family_test','exec'))
