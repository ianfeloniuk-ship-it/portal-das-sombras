from pathlib import Path
p=Path('game.html');s=p.read_text(encoding='utf-8');a=s.index('// BEGIN RUNTIME111');b=s.index('// END RUNTIME111',a)
s=s[:a]+'// BEGIN RUNTIME111\n'+Path('tools/kit111-runtime.js').read_text(encoding='utf-8')+'\n'+s[b:]
p.write_text(s,encoding='utf-8')
