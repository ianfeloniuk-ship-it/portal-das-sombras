from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
p=root/'game.html';s=p.read_text(encoding='utf-8')
block='// BEGIN CRYSTALS125\n'+(root/'tools/crystals125.js').read_text(encoding='utf-8')+'\n// END CRYSTALS125'
s,n=re.subn(r'// BEGIN CRYSTALS125.*?// END CRYSTALS125',lambda _:block,s,flags=re.S)
if n!=1:raise RuntimeError('Crystal source block missing or duplicated')
p.write_text(s,encoding='utf-8')
