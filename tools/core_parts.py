"""v388 (Ian, 14/10/2026): o script principal do game.html (~7,8 MB, um bloco só) agora mora em partes
em src/core/ (uma por seção: util, dados, jogador, combate, IA, HUD, janelas...). O build junta as partes
de volta no mesmo lugar do game.html, byte por byte, então o jogo roda igual a antes.

Regras:
- Edite a parte certa em src/core/ e rode tools/build.py (ele chama assemble()).
- Se alguém editar o game.html direto, o build percebe (hash) e re-divide a partir dele, avisando.
- Se as partes E o game.html mudaram ao mesmo tempo, o build para com erro em vez de perder trabalho.

Uso manual: python tools/core_parts.py split | assemble | check
"""
import hashlib, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
GAME = ROOT / 'game.html'
DIR = ROOT / 'src' / 'core'
MAN = DIR / 'manifest.json'
OPEN_MARK = re.compile(r"<script>(?=\r?\n'use strict';\r?\n/\* =+ UTIL)")
HEAD = re.compile(r'^\s*/\* =+ (.*?)(?: =+)? \*/|^\s*/\* ===== (.*?)(?:[.:—(]| =====)')
MARK = re.compile(r'^\s*// (BEGIN|END) ([A-Z0-9_]+)')

def read(p):
    with open(p, encoding='utf-8', newline='') as f: return f.read()
def write(p, s):
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, 'w', encoding='utf-8', newline='') as f: f.write(s)
def h(s): return hashlib.sha256(s.replace(chr(13)+chr(10),chr(10)).encode('utf-8')).hexdigest()  # igual em CRLF e LF

def locate(game):
    m = OPEN_MARK.search(game)
    if not m: raise SystemExit('core_parts: não achei o script principal no game.html')
    a = m.end()
    b = game.find('</script>', a)
    return a, b

def slug(t):
    t = t.lower()
    for x, y in zip('áàãâéêíóôõúüç', 'aaaaeeiooouuc'): t = t.replace(x, y)
    t = re.sub(r'[^a-z0-9]+', '-', t).strip('-')
    return t[:40] or 'parte'

def split_text(body):
    lines = body.splitlines(keepends=True)
    parts, cur, name = [], [], 'inicio'
    def flush():
        if cur: parts.append([name, ''.join(cur)])
    for ln in lines:
        m = MARK.match(ln); hd = HEAD.match(ln)
        if m and m.group(1) == 'BEGIN':
            flush(); cur = [ln]; name = 'bloco-' + m.group(2).lower(); continue
        if m and m.group(1) == 'END':
            cur.append(ln); flush(); cur = []; name = 'continua'; continue
        if hd:
            flush(); cur = [ln]; name = slug(hd.group(1) or hd.group(2) or ''); continue
        cur.append(ln)
    flush()
    return parts

def split(game=None):
    game = game or read(GAME)
    a, b = locate(game); body = game[a:b]
    parts = split_text(body)
    for f in DIR.glob('*.js'): f.unlink()
    files, seen = [], {}
    for i, (n, txt) in enumerate(parts):
        n = n if n != 'continua' else (files[-1].split('-', 1)[1][:-3] + '-cont' if files else 'inicio')
        k = seen.get(n, 0); seen[n] = k + 1
        fn = '%03d-%s%s.js' % ((i + 1) * 10, n, '' if not k else '-' + str(k + 1))
        write(DIR / fn, txt); files.append(fn)
    write(MAN, json.dumps({'files': files, 'hash': h(body)}, ensure_ascii=False, indent=1))
    return len(files)

def joined():
    m = json.loads(read(MAN))
    return ''.join(read(DIR / f) for f in m['files']), m

def assemble():
    game = read(GAME); a, b = locate(game); block = game[a:b]
    src, m = joined()
    if src == block: return 'igual'
    if h(block) == m['hash']:            # game.html não foi mexido: as partes mandam
        write(GAME, game[:a] + src + game[b:]); m['hash'] = h(src); write(MAN, json.dumps(m, ensure_ascii=False, indent=1)); return 'montado'
    if h(src) == m['hash']:              # partes intactas, game.html editado direto: re-divide
        split(game); print('core_parts: AVISO — game.html foi editado direto; partes refeitas a partir dele.'); return 'redividido'
    raise SystemExit('core_parts: ERRO — src/core e game.html mudaram ao mesmo tempo. Junte as mudanças à mão antes do build.')

def check():
    game = read(GAME); a, b = locate(game); src, _ = joined()
    return src == game[a:b]

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'check'
    if cmd == 'split': print('partes:', split())
    elif cmd == 'assemble': print(assemble())
    else: print('ok' if check() else 'DIFERENTE'); sys.exit(0 if check() else 1)
