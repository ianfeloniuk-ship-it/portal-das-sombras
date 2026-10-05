import subprocess,sys,json
subprocess.run([sys.executable,'tools/catalog111.py'],check=True)
from pathlib import Path
p=Path('game.html');s=p.read_text(encoding='utf-8');a=s.index('// BEGIN RUNTIME111');b=s.index('// END RUNTIME111',a)
c=json.loads(Path('tools/class-catalog111.json').read_text(encoding='utf-8'))
start=s.index('const KIT_DEFS111=');end=s.index('\n',start)
s=s[:start]+'const KIT_DEFS111='+json.dumps(c,ensure_ascii=False,separators=(',',':'))+';'+s[end:]
a=s.index('// BEGIN RUNTIME111');b=s.index('// END RUNTIME111',a)
s=s[:a]+'// BEGIN RUNTIME111\n'+Path('tools/kit111-runtime.js').read_text(encoding='utf-8')+'\n'+s[b:]
p.write_text(s,encoding='utf-8')
