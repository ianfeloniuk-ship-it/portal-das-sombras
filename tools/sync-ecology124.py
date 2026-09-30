from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
block='// BEGIN ECOLOGY124\n'+'\n'.join((root/'tools'/name).read_text(encoding='utf-8-sig') for name in ['ecology124.js','habitat-render124.js'])+'\n// END ECOLOGY124'
p=root/'game.html';s=p.read_text(encoding='utf-8')
if '// BEGIN ECOLOGY124' not in s:raise RuntimeError('Ecology source block missing')
p.write_text(re.sub(r'// BEGIN ECOLOGY124.*?// END ECOLOGY124',lambda _:block,s,flags=re.S),encoding='utf-8')
