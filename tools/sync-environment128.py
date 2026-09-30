from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
p=root/'game.html'
s=p.read_text(encoding='utf-8')
block='// BEGIN ENVIRONMENT128\n'+'\n'.join((root/'tools'/name).read_text(encoding='utf-8') for name in ['environment128.js','environment-bridge128.js'])+'\n// END ENVIRONMENT128'
s,n=re.subn(r'// BEGIN ENVIRONMENT128.*?// END ENVIRONMENT128',lambda _:block,s,flags=re.S)
if n!=1:raise RuntimeError('Environment source block missing or duplicated')
p.write_text(s,encoding='utf-8')
