"""Regenera somente a integração v122 e a galeria dos goblins."""
from pathlib import Path
import re

TOOLS = Path(__file__).resolve().parent
ROOT = TOOLS.parent
DATA = (TOOLS / 'goblin-data122.js').read_text(encoding='utf-8-sig')
RUNTIME = (TOOLS / 'goblins122.js').read_text(encoding='utf-8-sig')
BLOCK = '// BEGIN GOBLINS122\n' + DATA + '\n' + RUNTIME + '\n// END GOBLINS122'

def sync_game():
    path = ROOT / 'game.html'
    text = path.read_text(encoding='utf-8-sig')
    pattern = r'// BEGIN GOBLINS122.*?// END GOBLINS122'
    if not re.search(pattern, text, flags=re.S):
        raise RuntimeError('game.html não contém o bloco BEGIN GOBLINS122')
    path.write_text(re.sub(pattern, lambda _: BLOCK, text, count=1, flags=re.S), encoding='utf-8')

def sync_gallery():
    template = (TOOLS / 'goblin-preview122.html').read_text(encoding='utf-8')
    html = template.replace('__GOBLIN_BASELINE__', (TOOLS / 'goblins118.js').read_text(encoding='utf-8-sig'))
    html = html.replace('__GOBLIN_DATA__', DATA).replace('__GOBLIN_RUNTIME__', RUNTIME)
    (ROOT / 'goblin-preview.html').write_text(html, encoding='utf-8')

if __name__ == '__main__':
    sync_game()
    sync_gallery()
    print('v122: game.html e goblin-preview.html sincronizados')
