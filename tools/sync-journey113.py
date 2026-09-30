from pathlib import Path
p=Path('tools/journey113.js');s=p.read_text(encoding='utf-8').replace("if(s.mode==='pulse'){const beat=", "if(s.mode==='pulse'){if(t.step>=3)return false;const beat=");p.write_text(s,encoding='utf-8')
p=Path('game.html');s=p.read_text(encoding='utf-8');a=s.index('// BEGIN JOURNEY113');b=s.index('// END JOURNEY113',a);s=s[:a]+'// BEGIN JOURNEY113\n'+Path('tools/journey113.js').read_text(encoding='utf-8')+'\n'+s[b:];p.write_text(s,encoding='utf-8')
