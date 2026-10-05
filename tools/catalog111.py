"""Rebuild catalogue from preserved base and reviewed expansion."""
import json
from pathlib import Path
from expansion260 import expand
p=Path(__file__).resolve().parent
catalog=expand(json.loads((p/'class-catalog111-base.json').read_text(encoding='utf-8')))
(p/'class-catalog111.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2),encoding='utf-8')
