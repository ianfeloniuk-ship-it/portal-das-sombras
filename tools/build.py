"""Gera index.html (site instalável) a partir de game.html."""
import pathlib,re,subprocess,sys
root=pathlib.Path(__file__).resolve().parent.parent
subprocess.run([sys.executable,str(root/'tools'/'sync-goblins122.py')],check=True)
subprocess.run([sys.executable,str(root/'tools'/'sync-ecology124.py')],check=True)
game=(root/'game.html').read_text(encoding='utf-8')
ver=re.search(r"pds-v(\d+)",(root/'sw.js').read_text(encoding='utf-8')).group(1)
head='''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
<meta name="theme-color" content="#0e0710">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Ecos">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon-192.png">
<link rel="apple-touch-icon" href="icon-192.png">
<script>window.PDS_SITE=1</script>
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}</style>
</head>
<body>
'''
tail='''
<div id="pdsver" style="position:fixed;left:6px;bottom:4px;font:10px monospace;color:rgba(159,200,255,.55);z-index:99;pointer-events:none">v__V__</div>
<button id="pdsupd" hidden style="position:fixed;left:50%;top:8px;transform:translateX(-50%);z-index:999;background:#ffd54f;color:#1a1200;border:0;border-radius:6px;padding:10px 16px;font-weight:700">NOVA VERSÃO DO JOGO · TOQUE PARA ATUALIZAR</button>
<script>window.PDS_V=__V__;if('serviceWorker' in navigator&&location.protocol==='https:'){const had=!!navigator.serviceWorker.controller;navigator.serviceWorker.register('sw.js').then(r=>{setInterval(()=>r.update().catch(()=>{}),120000)}).catch(()=>{});
navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!had)return;const b=document.getElementById('pdsupd');b.hidden=false;b.onclick=()=>{try{saveRun()}catch(e){}location.reload()}})}</script>
</body>
</html>
'''
(root/'index.html').write_text(head+game+tail.replace('__V__',ver),encoding='utf-8')
print('index.html gerado')
