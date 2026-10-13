from pathlib import Path
g=Path(__file__).resolve().parent.parent
source=g/'tools/test_gosma347.py'
src=source.read_text(encoding='utf-8')
src=src.replace('let testG=null;',"let testG=null,kindG='gosma';")
src=src.replace("spawnKind('gosma',",'spawnKind(kindG,')
start=src.index(' let e=prepareG();');end=src.index(" reportG('PASSOU",start)
body=src[start:end]
body=body.replace("'gosma_part'+i","kindG+'_part'+i")
body=body.replace("check(a.length===3,'três alvos após dano');", "check(a.length===3,kindG+' três alvos após dano');check(a.every((q,i)=>q.m.mon===kindG+'_part'+i),kindG+' fragmentos próprios');if(kindG!=='gosma')check(a[0].gosmaGroup347.links?.length===2,kindG+' ligações entre bolsas');")
src=src[:start]+" for(kindG of ['gosma','gosma_f','gosma_a']){\n"+body+'\n }\n'+src[end:]
src=src.replace("Path('gosma-playtest.html')","Path('gosma-family-playtest.html')")
exec(compile(src,'gosma_family_test','exec'))
