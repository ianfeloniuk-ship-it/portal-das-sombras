"""Prepare exact official Drive references; never generate or recolor artwork.

Input is a temporary JSON array of connector-authenticated sources, with file_uri.
Only safe provenance is written to the review manifest; expiring download URLs
are never copied to the catalog. Original bytes are verified and kept in memory.
Run with --finalize after visually reviewing the contact sheets and crop choices.
"""
import argparse, hashlib, io, json, re, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
REVIEW = ROOT.parent / 'primeva-art405-sources'
OUT = ROOT / 'assets' / 'equipment405'
MANIFEST = REVIEW / 'prepared.json'
RANKS = ['F','E','D','C','B','A','S','SS','SS+','★']
MATERIALS = ['Ferro','Aço','Mithril','Runas','Dragão','Vazio','Abismo','Celestial','Transcendente','Primeva']
RARITIES = ['Comum','Raro','Épico','Lendário','Mítico','Divino','Primordial','Primeva']

def slug(source):
    return source['key'].replace(':', '-')

def prepare(source):
    key = slug(source)
    dest = REVIEW / (key + '.webp')
    if source.get('local_path'):
        data = Path(source['local_path']).read_bytes()
    else:
        with urllib.request.urlopen(source['file_uri']['download_url'], timeout=90) as response:
            data = response.read()
    assert len(data) == int(source['size']), (source['title'], len(data), source['size'])
    im = ImageOps.exif_transpose(Image.open(io.BytesIO(data)))
    original_size = list(im.size)
    im.thumbnail((1100, 1100), Image.Resampling.LANCZOS)
    im.save(dest, 'WEBP', lossless=True, method=4)
    keep = {k: source[k] for k in ('key','kind','tier','rar','material','scope','classId','layout','version') if k in source}
    keep.update(source={'id': source['id'], 'name': source['title'], 'url': source['url'], 'size': int(source['size']), 'sha256': hashlib.sha256(data).hexdigest(), 'dimensions': original_size}, review=str(dest))
    return keep

def contact(entries, prefix, columns=6, rows=5):
    for offset in range(0,len(entries),columns*rows):
        section = entries[offset:offset+columns*rows]
        sheet=Image.new('RGB',(columns*200,rows*210),(22,28,27))
        draw=ImageDraw.Draw(sheet)
        for i,e in enumerate(section):
            im=Image.open(e['review']); im.thumbnail((192,182))
            x=(i%columns)*200+(200-im.width)//2; y=(i//columns)*210
            sheet.paste(im,(x,y))
            draw.text(((i%columns)*200+5,y+185),e['key'],fill='white')
        sheet.save(REVIEW/(prefix+str(offset//(columns*rows))+'.jpg'),quality=90)

def finalize(entries):
    OUT.mkdir(parents=True,exist_ok=True)
    output=[]
    for e in entries:
        im=Image.open(e['review'])
        crop=e.get('crop')
        if crop:
            w,h=im.size; im=im.crop(tuple(round(v*(w if i%2==0 else h)) for i,v in enumerate(crop)))
        im.thumbnail((512,512),Image.Resampling.LANCZOS)
        path=OUT/(slug(e)+'.webp');im.save(path,'WEBP',lossless=True,method=6)
        record={k:v for k,v in e.items() if k!='review'}
        if e['scope']=='item':
            record.update(rank=RANKS[e['tier']],materialLabel=MATERIALS[e['tier']],rarity=RARITIES[e['rar']])
        record.update(src='assets/equipment405/'+path.name,bytes=path.stat().st_size,dimensions=list(im.size),sha256=hashlib.sha256(path.read_bytes()).hexdigest())
        output.append(record)
    keys={e['key'] for e in output}
    kinds=['h','a','g','b','sword','dagger','axe','staff','bow','wand','tome','bonestaff','spear']
    gaps={kind:[{'rank':RANKS[tier],'material':MATERIALS[tier],'rarities':[RARITIES[rar] for rar in range(8) if f'{kind}:{tier}:{rar}' not in keys]} for tier in range(10) if any(f'{kind}:{tier}:{rar}' not in keys for rar in range(8))] for kind in kinds}
    catalog={'schemaVersion':1,'date':'2026-10-15','entries':output,'coverage':{'exact':sum(e['scope']=='item' for e in output),'classReferences':sum(e['scope']=='class' for e in output),'bytes':sum(e['bytes'] for e in output),'missingWeaponKinds':['staff','bow','wand','tome','bonestaff','spear','firearm'],'missingCombinations':gaps,'note':'Class references are not item/rank/rarity variants. Uncatalogued slots, ranks, rarities and special sets remain unavailable. 80 full armor reference sheets and 10 crowns were inventoried separately but are not presented as isolated slot artwork.'}}
    (ROOT/'tools'/'equipment-art405.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({k:v for k,v in catalog['coverage'].items() if k!='missingCombinations'}))

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('batch',nargs='?');parser.add_argument('--finalize',action='store_true');parser.add_argument('--contacts',action='store_true');args=parser.parse_args()
    REVIEW.mkdir(parents=True,exist_ok=True)
    entries=json.loads(MANIFEST.read_text(encoding='utf-8')) if MANIFEST.exists() else []
    if args.batch:
        sources=json.loads(Path(args.batch).read_text(encoding='utf-8-sig'))
        existing={e['key'] for e in entries}
        with ThreadPoolExecutor(max_workers=5) as pool: entries.extend(pool.map(prepare,[s for s in sources if s['key'] not in existing]))
        MANIFEST.write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        print(json.dumps({'prepared':len(entries),'bytes':sum(Path(e['review']).stat().st_size for e in entries)}))
    if args.contacts:
        for layout in ['isolated','weapon-sheet']:contact([e for e in entries if e['layout']==layout],layout+'-')
    if args.finalize:finalize(entries)
