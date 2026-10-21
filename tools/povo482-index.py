"""v482 Povo482: gera models/povo482/index.json a partir dos <id>.glb + <id>.json que existirem.
Rodar de novo sempre que o lote de geração (tools/blender482) acrescentar bases ou dragões.
O jogo (tools/npc482.js) só usa o que está no índice; o que faltar continua no comportamento antigo."""
import json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
d = root / 'models' / 'povo482'
out = []
if d.is_dir():
    for glb in sorted(d.glob('*.glb')):
        i = glb.stem
        meta = {'id': i}
        js = d / (i + '.json')
        if js.is_file():
            try:
                meta.update(json.loads(js.read_text(encoding='utf-8')))
            except Exception as e:
                print('json inválido, ignorado:', js.name, e); continue
        meta['id'] = i
        meta['kb'] = round(glb.stat().st_size / 1024)
        # dragão = race dragon/role dragon ou id conhecido de dragão sem metadados humanos
        if meta.get('race') == 'dragon' or meta.get('role') in ('dragon', 'monster') or (
                'race' not in meta and any(k in i for k in ('drag', 'serpe', 'wyrm'))):
            meta['kind'] = 'dragon'
        else:
            meta['kind'] = 'human'
            if not {'race', 'sex', 'role'} <= meta.keys():
                print('sem race/sex/role, ignorado:', i); continue
        out.append({k: meta[k] for k in meta if k in ('id', 'kind', 'race', 'sex', 'role', 'heightScale', 'family', 'kb', 'skirt', 'tris')})
    d.mkdir(parents=True, exist_ok=True)
    (d / 'index.json').write_text(json.dumps({'v': 482, 'bases': out}, ensure_ascii=False, indent=1), encoding='utf-8')
print('povo482:', len(out), 'entradas', [b['id'] for b in out])
